// Reduz a imagem no navegador ANTES de subir pro Supabase Storage.
//
// O painel aceita arquivos de até 5 MB, mas o site nunca exibe um banner com
// mais de ~1600px de largura — subir o original significa fazer todo visitante
// baixar megabytes que o navegador vai jogar fora no downscale. Comprimir aqui
// é o que efetivamente encurta o carregamento do hero.
//
// Isto é só otimização, não validação: quem chama deve rodar
// validarArquivoImagem() no arquivo ORIGINAL antes, e as regras reais de
// tipo/tamanho continuam sendo as do bucket (ver supabase/06_admin_authz.sql).

const LARGURA_MAXIMA_PADRAO = 1600;
const QUALIDADE_PADRAO = 0.82;

// Decodifica respeitando a orientação EXIF (foto de celular deitada, por
// exemplo). createImageBitmap é bem mais rápido que <img> + onload, mas nem
// todo navegador aceita o segundo argumento — daí o retry sem opções.
async function decodificar(arquivo) {
  try {
    return await createImageBitmap(arquivo, { imageOrientation: 'from-image' });
  } catch {
    return await createImageBitmap(arquivo);
  }
}

function paraBlob(canvas, qualidade) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', qualidade));
}

/**
 * Devolve um File WebP menor, ou o arquivo original se comprimir não ajudar
 * (imagem já pequena, navegador sem suporte, qualquer erro na conversão).
 * Nunca lança — o upload não pode quebrar por causa da otimização.
 */
export async function comprimirImagem(arquivo, opcoes = {}) {
  const larguraMaxima = opcoes.larguraMaxima ?? LARGURA_MAXIMA_PADRAO;
  const qualidade = opcoes.qualidade ?? QUALIDADE_PADRAO;

  if (typeof createImageBitmap !== 'function') return arquivo;

  let bitmap;
  try {
    bitmap = await decodificar(arquivo);
  } catch {
    return arquivo;
  }

  try {
    const escala = Math.min(1, larguraMaxima / bitmap.width);
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) return arquivo;
    ctx.drawImage(bitmap, 0, 0, largura, altura);

    const blob = await paraBlob(canvas, qualidade);
    // toBlob devolve null se o formato não for suportado, e alguns navegadores
    // caem pra PNG silenciosamente — nesse caso o resultado costuma ser MAIOR
    // que o original, então a checagem de tamanho abaixo cobre os dois casos.
    if (!blob || blob.type !== 'image/webp' || blob.size >= arquivo.size) return arquivo;

    const nomeSemExtensao = arquivo.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${nomeSemExtensao}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return arquivo;
  } finally {
    bitmap.close?.();
  }
}
