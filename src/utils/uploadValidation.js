// Validação de arquivo usada por todos os uploads de imagem do painel admin.
// Isto é uma camada de UX/defesa em profundidade no cliente: a barreira de
// segurança real (quem pode fazer upload) é a RLS + a policy de storage.objects
// exigindo public.is_current_user_admin() (ver supabase/06_admin_authz.sql).
// A restrição de tipo/tamanho também é imposta de novo no bucket
// (allowed_mime_types / file_size_limit), porque qualquer checagem feita só
// aqui pode ser contornada por quem montar a requisição manualmente.
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB

// Assinaturas binárias (magic bytes) dos formatos permitidos. O Content-Type
// (arquivo.type) é só o que o navegador DECLAROU a partir da extensão — não
// prova que o conteúdo do arquivo é realmente aquele formato. Conferir os
// primeiros bytes reais eleva o custo de subir algo disfarçado de imagem
// (ex.: um HTML renomeado para .png), mesmo sabendo que isto ainda roda no
// cliente e não substitui uma validação de conteúdo do lado do servidor.
async function assinaturaBateComTipo(arquivo) {
  const cabecalho = new Uint8Array(await arquivo.slice(0, 12).arrayBuffer());

  if (arquivo.type === 'image/png') {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return png.every((byte, i) => cabecalho[i] === byte);
  }
  if (arquivo.type === 'image/jpeg') {
    return cabecalho[0] === 0xff && cabecalho[1] === 0xd8 && cabecalho[2] === 0xff;
  }
  if (arquivo.type === 'image/webp') {
    const riff = cabecalho[0] === 0x52 && cabecalho[1] === 0x49 && cabecalho[2] === 0x46 && cabecalho[3] === 0x46;
    const webp = cabecalho[8] === 0x57 && cabecalho[9] === 0x45 && cabecalho[10] === 0x42 && cabecalho[11] === 0x50;
    return riff && webp;
  }
  return false;
}

// Retorna null se o arquivo for válido, ou uma mensagem de erro pronta para
// exibir ao usuário caso contrário.
export async function validarArquivoImagem(arquivo) {
  if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
    return 'Formato não permitido. Envie apenas imagens JPG, PNG ou WEBP.';
  }
  if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
    return 'Arquivo maior que 5 MB. Escolha uma imagem menor.';
  }
  if (!(await assinaturaBateComTipo(arquivo))) {
    return 'O conteúdo do arquivo não corresponde a uma imagem válida desse formato.';
  }
  return null;
}

// Nome de arquivo é escolhido pelo usuário e vira parte da chave do objeto no
// Supabase Storage — sanitiza antes de usar (remove separadores de caminho,
// acentos e qualquer caractere fora de um allow-list simples) em vez de
// confiar que o Storage sempre trata "path" como chave opaca e nunca como
// caminho de filesystem.
export function sanitizarNomeArquivo(nomeOriginal) {
  const partes = String(nomeOriginal || '').split('.');
  const extensao = (partes.length > 1 ? partes.pop() : '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5);
  const base = partes.join('.')
    .normalize('NFKD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // remove acentos (diacriticos combinantes)
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'arquivo';
  return extensao ? `${base}.${extensao}` : base;
}
