// Converte o texto digitado no admin em blocos de conteúdo (título + texto).
//
// Formato esperado:
//   ## Metodologia
//   Texto explicando a metodologia do curso...
//   pode ter várias linhas.
//
//   ## Material Didático
//   Mais texto aqui...
//
// Linhas iniciadas com "##" começam um novo bloco com esse título.
// Texto sem nenhum "##" vira um único bloco sem título.
export function parseBlocosConteudo(texto) {
  if (!texto) return [];

  const linhas = texto.split('\n');
  const blocos = [];
  let atual = null;

  for (const linhaOriginal of linhas) {
    const linha = linhaOriginal.trimEnd();
    if (linha.trim().startsWith('##')) {
      atual = { titulo: linha.trim().replace(/^##\s*/, ''), texto: '' };
      blocos.push(atual);
    } else if (atual) {
      atual.texto += (atual.texto ? '\n' : '') + linha;
    } else if (linha.trim()) {
      atual = { titulo: '', texto: linha };
      blocos.push(atual);
    }
  }

  return blocos
    .map((bloco) => ({ ...bloco, texto: bloco.texto.trim() }))
    .filter((bloco) => bloco.titulo || bloco.texto);
}

// Versão tolerante usada pelo formulário do admin: mantém blocos vazios
// (ainda em edição) para que nada some enquanto o admin digita.
export function parseBlocosParaEditor(texto) {
  if (!texto || !texto.trim()) return [];
  return parseBlocosConteudo(texto).map((bloco) => ({
    titulo: bloco.titulo || '',
    texto: bloco.texto || '',
  }));
}

// Transforma os blocos estruturados do formulário de volta no texto salvo no banco.
export function serializarBlocosConteudo(blocos) {
  if (!Array.isArray(blocos)) return '';

  return blocos
    .map((bloco) => {
      const titulo = (bloco.titulo || '').trim();
      const texto = (bloco.texto || '').trim();
      if (!titulo && !texto) return '';
      return [titulo ? `## ${titulo}` : '', texto].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}
