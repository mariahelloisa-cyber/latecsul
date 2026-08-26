const QTD_REPETICOES = 8; // repetições por cópia — controla quantas frases cabem antes do loop repetir

function IconeEscudo() {
  return (
    <svg className="w-4 h-4 text-[#1E7FD9] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <rect x="9.5" y="11" width="5" height="4" rx="0.75" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 11v-1.25a1.5 1.5 0 013 0V11" />
    </svg>
  );
}

function FaixaFrases({ texto }) {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: QTD_REPETICOES }, (_, i) => (
        <span key={i} className="flex items-center gap-2 px-6 whitespace-nowrap">
          <IconeEscudo />
          <span className="text-base font-normal text-[#01923F]">{texto}</span>
        </span>
      ))}
    </div>
  );
}

export default function EsteiraFrases({ texto }) {
  return (
    <div className="relative w-full overflow-hidden bg-white border-y border-gray-100 py-1.5 select-none">
      <style>{`
        @keyframes esteiraFrasesScroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex w-max"
        style={{ animation: 'esteiraFrasesScroll 25s linear infinite' }}
      >
        <FaixaFrases texto={texto} />
        <FaixaFrases texto={texto} />
      </div>
    </div>
  );
}
