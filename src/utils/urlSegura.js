// Sanitização de URLs que vêm do banco (tabelas contato_footer e
// sobre_redes_sociais) e são usadas diretamente em href.
//
// Por que isto existe: o valor é digitado no painel admin e gravado no banco.
// Um href só deveria apontar para uma página web, mas o atributo aceita
// qualquer esquema — incluindo "javascript:", que executa código no contexto
// do site quando o visitante clica (stored XSS). A CSP em public/_headers
// (script-src 'self', sem 'unsafe-inline') já bloqueia a execução de
// "javascript:", mas depender só dela deixa a aplicação segura por acidente:
// se a CSP for afrouxada um dia, o buraco volta sozinho. Esta função fecha o
// buraco na origem.
//
// Regra: só http e https passam. Qualquer outra coisa (javascript:, data:,
// vbscript:, file:, URL malformada, valor vazio) vira '#', que é exatamente o
// que o código já usava como fallback quando o campo estava vazio — ou seja,
// o comportamento visível do site não muda.
const ESQUEMAS_PERMITIDOS = ['http:', 'https:'];

export function urlSeguraExterna(valor) {
  if (!valor || typeof valor !== 'string') return '#';
  const texto = valor.trim();
  if (!texto || texto === '#') return '#';

  try {
    // Base window.location.origin resolve links relativos ("/algo") sem
    // quebrar; URLs absolutas ignoram a base.
    const url = new URL(texto, window.location.origin);
    return ESQUEMAS_PERMITIDOS.includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

// Mesma ideia para o link "mailto:" do rodapé: o e-mail vem do banco e, sem
// checagem, poderia trazer um endereço com vírgula/quebra de linha para
// embutir cc/bcc/assunto no cliente de e-mail do visitante. Aceita apenas um
// endereço simples; qualquer outra coisa devolve null para quem chama decidir
// não renderizar o link.
const EMAIL_SIMPLES = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function emailSeguro(valor) {
  const texto = (valor || '').trim();
  return EMAIL_SIMPLES.test(texto) ? texto : null;
}
