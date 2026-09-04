// Converte o texto digitado no admin em uma grade curricular estruturada.
//
// Formato esperado:
//   1º Semestre
//   Matemática Básica | 60h
//   Português Instrumental | 40h
//
//   2º Semestre
//   Cálculo I | 80h
//
// Linhas sem "|" iniciam um novo semestre. Linhas com "nome | horas"
// são as disciplinas desse semestre.
export function parseGradeCurricular(texto) {
  if (!texto) return [];

  const linhas = texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0);

  const semestres = [];
  let atual = null;

  for (const linha of linhas) {
    if (linha.includes('|')) {
      if (!atual) {
        atual = { titulo: 'Disciplinas', disciplinas: [] };
        semestres.push(atual);
      }
      const [nome, horas] = linha.split('|').map((parte) => parte.trim());
      if (nome) atual.disciplinas.push({ nome, horas: horas || '' });
    } else {
      atual = { titulo: linha, disciplinas: [] };
      semestres.push(atual);
    }
  }

  return semestres.filter((semestre) => semestre.disciplinas.length > 0);
}

// Versão tolerante usada pelo formulário do admin: mantém semestres vazios
// (ainda em edição) para que nada some enquanto o admin digita.
export function parseGradeParaEditor(texto) {
  if (!texto || !texto.trim()) return [];

  const linhas = texto.split('\n').map((linha) => linha.trim());
  const semestres = [];
  let atual = null;

  for (const linha of linhas) {
    if (!linha) continue;
    if (linha.includes('|')) {
      if (!atual) {
        atual = { titulo: 'Disciplinas', disciplinas: [] };
        semestres.push(atual);
      }
      const [nome, horas] = linha.split('|').map((parte) => parte.trim());
      atual.disciplinas.push({ nome: nome || '', horas: horas || '' });
    } else {
      atual = { titulo: linha, disciplinas: [] };
      semestres.push(atual);
    }
  }

  return semestres;
}

// Transforma a grade estruturada do formulário de volta no texto salvo no banco.
export function serializarGradeCurricular(semestres) {
  if (!Array.isArray(semestres)) return '';

  return semestres
    .map((semestre) => {
      const titulo = (semestre.titulo || '').trim();
      const disciplinas = (semestre.disciplinas || [])
        .filter((d) => (d.nome || '').trim())
        .map((d) => `${d.nome.trim()} | ${(d.horas || '').trim()}`);
      if (!titulo && disciplinas.length === 0) return '';
      return [titulo, ...disciplinas].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}
