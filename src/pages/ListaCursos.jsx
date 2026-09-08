import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CursoListItem from '../components/CursoListItem';
import { supabase } from '../supabaseClient';
import { listaCursosGiga } from './cursosData';
import imagemFundo from '../assets/herocursos.png';
import EsteiraFrases from '../components/EsteiraFrases';

// Categorias descontinuadas: mesmo que ainda existam no banco, ficam fora das
// abas de filtro e da listagem. Depois de rodar
// supabase/remove_categorias_descontinuadas.sql (que apaga os dados de vez)
// esta lista pode ser esvaziada.
const CATEGORIAS_OCULTAS = [
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos',
];

const categoriaOculta = (nome) => CATEGORIAS_OCULTAS.includes((nome || '').trim().toLowerCase());

const WHATSAPP_NUMERO = '5554999568140';

// O botão de matrícula leva direto pro WhatsApp, já com o nome do curso na mensagem.
function montarLinkWhatsapp(nomeCurso) {
  const mensagem = `Olá! Vim pelo site e quero garantir minha vaga no curso de ${nomeCurso}.`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export default function ListaCursos() {
  const [searchParams] = useSearchParams();
  const [pesquisa, setPesquisa] = useState(() => searchParams.get('busca') || '');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [filtroCategoriaAberto, setFiltroCategoriaAberto] = useState(false);

  // Cursos cadastrados pelo admin (Supabase), exibidos em card com página de detalhe
  const [cursosCadastrados, setCursosCadastrados] = useState([]);
  // Categorias cadastradas pelo admin (Supabase) — usadas para montar as abas de filtro
  const [categoriasDb, setCategoriasDb] = useState([]);

  useEffect(() => {
    async function buscarCursosCadastrados() {
      try {
        const { data, error } = await supabase
          .from('cursos_cadastrados')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCursosCadastrados(data || []);
      } catch (err) {
        console.error('Erro ao buscar cursos cadastrados:', err);
      }
    }
    async function buscarCategorias() {
      try {
        const { data, error } = await supabase.from('categorias').select('*');
        if (error) throw error;
        setCategoriasDb(data || []);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    }
    buscarCursosCadastrados();
    buscarCategorias();
  }, []);

  // Proteção contra dados vazios
  const dadosCursos = Array.isArray(listaCursosGiga) ? listaCursosGiga : [];

  // Abas de categoria: começa com as categorias fixas de sempre e soma
  // automaticamente qualquer categoria nova cadastrada pelo admin (tabela
  // "categorias") ou já usada em algum curso cadastrado — sem precisar
  // mexer no código toda vez que uma categoria nova é criada.
  const categoriasFiltro = useMemo(() => {
    const fixas = [
      'Técnicos',
    ];
    const doBanco = categoriasDb.map((c) => c.nome).filter(Boolean);
    const dosCursosCadastrados = cursosCadastrados.map((c) => c.categoria).filter(Boolean);

    const vistas = new Map();
    for (const nome of [...fixas, ...doBanco, ...dosCursosCadastrados]) {
      const chave = nome.trim().toLowerCase();
      if (categoriaOculta(chave)) continue;
      if (!vistas.has(chave)) vistas.set(chave, nome.trim());
    }

    return ['Todas', ...Array.from(vistas.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'))];
  }, [categoriasDb, cursosCadastrados]);

  // Helper para renderizar os ícones idênticos aos da imagem nas abas de categorias
  const getCategoriaIcon = (cat) => {
    switch(cat.toLowerCase()) {
      case 'todas':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
          </svg>
        );
      case 'técnicos':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        );
      case 'eja':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Filtro de Busca e Categoria
  const cursosFiltrados = dadosCursos.filter((curso) => {
    if (!curso) return false;
    const nomeCurso = curso.nome || curso.titulo || "";
    const categoriaCurso = curso.categoriaNome || "";

    const combinaTexto = nomeCurso.toLowerCase().includes(pesquisa.toLowerCase());
    const combinaCategoria = categoriaSelecionada === 'Todas' || 
                             categoriaCurso.toLowerCase() === categoriaSelecionada.toLowerCase();

    return combinaTexto && combinaCategoria;
  });

  // Cursos cadastrados pelo admin, filtrados pela mesma busca e categoria da lista
  const cursosCadastradosFiltrados = cursosCadastrados.filter((curso) => {
    const nomeCurso = curso.titulo || "";
    const categoriaCurso = curso.categoria || "";

    if (categoriaOculta(categoriaCurso)) return false;

    const combinaTexto = nomeCurso.toLowerCase().includes(pesquisa.toLowerCase());
    const combinaCategoria = categoriaSelecionada === 'Todas' ||
                             categoriaCurso.toLowerCase() === categoriaSelecionada.toLowerCase();

    return combinaTexto && combinaCategoria;
  });

  const totalCursosEncontrados = cursosCadastradosFiltrados.length + cursosFiltrados.length;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-gray-900 antialiased pb-20 flex flex-col">
      <Navbar />

      <EsteiraFrases texto="Todos os cursos são reconhecidos pela SEDUC" />

      {/* 1. HERO SECTION CORRIGIDA (Preenchimento total da tela sem cortes nem espaços brancos) */}
      <div 
        className="relative w-full bg-cover bg-center py-14 md:py-24 border-b border-gray-100 flex items-center min-h-[420px] md:min-h-[480px]" 
        style={{ backgroundImage: `url(${imagemFundo})` }}
      >
        <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
          
          {/* Caixa de Conteúdo restrita à metade da tela (md:max-w-xl) para nunca sobrepor a imagem da direita */}
          <div className="relative w-full max-w-md md:max-w-xl flex flex-col items-start text-left">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
            {/* Barra de Pesquisa */}
            <div className="relative w-full bg-white rounded-full shadow-lg border border-gray-100 p-1 flex items-center -ml-8 md:-ml-38 top-24 md:top-20">
              <span className="pl-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Pesquisar curso por nome, área ou palavra-chave..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full pl-2 pr-4 py-3 bg-transparent text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none font-medium"
              />
              <button className="bg-[#FFF500] hover:bg-[#FFF500] text-white p-2.5 md:p-3 rounded-full transition-all flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>

      <EsteiraFrases texto="Todos os cursos são reconhecidos pela SEDUC." />

      {/* 2. FILTROS E CONTEÚDO */}
      <div className="max-w-6xl w-full mx-auto px-6 mt-10">
        
        {/* Abas de Categorias (desktop): todas as pills lado a lado */}
        <div className="hidden md:flex flex-wrap gap-3 mb-6 justify-start">
          {categoriasFiltro.map((cat) => {
            const isSelected = categoriaSelecionada.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={`btn-filtro-${cat}`}
                onClick={() => setCategoriaSelecionada(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#01923F] text-white border-[#01923F] shadow-sm'
                    : 'bg-white text-[#1a103c]/80 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {getCategoriaIcon(cat)}
                <span className="capitalize">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Abas de Categorias (mobile): "Todas" + botão que abre a lista de categorias */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCategoriaSelecionada('Todas'); setFiltroCategoriaAberto(false); }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-2 cursor-pointer shrink-0 ${
                categoriaSelecionada.toLowerCase() === 'todas'
                  ? 'bg-[#01923F] text-white border-[#01923F] shadow-sm'
                  : 'bg-white text-[#1a103c]/80 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getCategoriaIcon('Todas')}
              <span>Todas</span>
            </button>

            <button
              onClick={() => setFiltroCategoriaAberto((v) => !v)}
              className={`flex-1 min-w-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center justify-center gap-2 cursor-pointer ${
                categoriaSelecionada.toLowerCase() !== 'todas'
                  ? 'bg-[#01923F] text-white border-[#01923F] shadow-sm'
                  : 'bg-white text-[#1a103c]/80 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 9h12M10 15h4" />
              </svg>
              <span className="capitalize truncate">
                {categoriaSelecionada.toLowerCase() === 'todas' ? 'Filtrar por categoria' : categoriaSelecionada}
              </span>
              <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${filtroCategoriaAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {filtroCategoriaAberto && (
            <div className="mt-3 flex flex-wrap gap-2 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
              {categoriasFiltro.filter((cat) => cat.toLowerCase() !== 'todas').map((cat) => {
                const isSelected = categoriaSelecionada.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={`btn-filtro-mobile-${cat}`}
                    onClick={() => { setCategoriaSelecionada(cat); setFiltroCategoriaAberto(false); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#01923F] text-white border-[#01923F] shadow-sm'
                        : 'bg-white text-[#1a103c]/80 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {getCategoriaIcon(cat)}
                    <span className="capitalize">{cat}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quantidade Encontrada */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold mb-4 uppercase tracking-wider">
          <svg className="w-3.5 h-3.5 text-[#01923F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-[#01923F] font-extrabold">{totalCursosEncontrados}</span> cursos encontrados
        </div>

        {/* Cursos cadastrados pelo admin, exibidos em card acima da listagem */}
        {cursosCadastradosFiltrados.length > 0 && (
          <div className="flex flex-col gap-4 md:gap-5 mb-8">
            {cursosCadastradosFiltrados.map((curso) => (
              <CursoListItem key={curso.id} curso={curso} />
            ))}
          </div>
        )}

        {/* 3. LISTAGEM DE CURSOS */}
        {dadosCursos.length > 0 && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          
          {/* Header da tabela com o Degradê Triplo perfeito (Rosa -> Roxo -> Azul) */}
          <div className="bg-gradient-to-r from-[#01923F] via-[#046B30] to-[#034D23] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <h2 className="font-extrabold text-xs tracking-wider uppercase">
                TODOS OS CURSOS
              </h2>
            </div>
            <div className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              <span className="text-white text-xs font-bold">{cursosFiltrados.length} cursos</span>
            </div>
          </div>

          {/* Listagem com Scroll Interno */}
          <div className="flex flex-col max-h-[750px] overflow-y-auto bg-white md:divide-y md:divide-gray-100">
            {cursosFiltrados.length === 0 ? (
              <div className="p-12 text-center text-sm font-bold text-gray-400">
                Nenhum curso corresponde à sua busca.
              </div>
            ) : (
              cursosFiltrados.map((curso, index) => {
                const nomeItem = curso.nome || curso.titulo || "Curso sem nome";
                const horasItem = curso.horas || curso.duracao || "N/A";

                // Exibe o ID do curso vindo do banco ou gera uma numeração sequencial
                const numeroFormatado = curso.id || String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={`linha-curso-${curso.id ?? index}-${index}`}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between py-2.5 px-3 md:py-4 md:px-6 mx-2 my-1 md:mx-0 md:my-0 rounded-xl md:rounded-none border border-gray-100 md:border-0 bg-white hover:bg-gray-50/50 transition-colors gap-1.5 md:gap-0"
                  >
                    {/* Numeração em Destaque Rosa + Título Escuro */}
                    <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0">
                      <span className="text-[#01923F] font-extrabold text-xs md:text-sm w-7 md:w-10 text-center shrink-0">
                        {numeroFormatado}
                      </span>
                      <h3 className="text-[11px] md:text-sm font-extrabold text-[#1a103c] uppercase tracking-wide leading-tight truncate">
                        {nomeItem}
                      </h3>
                    </div>

                    {/* Lado Direito: Horas e Ação */}
                    <div className="flex items-center justify-between w-full md:w-auto md:gap-4 ml-0 md:ml-6 shrink-0">

                      {/* Badge das Horas (Roxo claro) */}
                      <span className="text-[#D9251C] font-bold text-[9px] md:text-[10px] bg-[#FDECEA] px-2 py-0.5 md:px-2.5 md:py-1 rounded whitespace-nowrap">
                        {typeof horasItem === 'number' ? `${horasItem}H` : String(horasItem).toUpperCase()}
                      </span>

                      {/* Botão de Matrícula: vai direto pro WhatsApp */}
                       <a
                  href={montarLinkWhatsapp(nomeItem)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#01923F] hover:bg-[#046B30] text-white px-2.5 py-1.5 md:px-4 md:py-2 rounded font-bold transition-all flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer shrink-0 shadow-sm active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.437-9.884 9.889-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                  </svg>
                  <span className="hidden md:inline text-[11px] font-extrabold uppercase tracking-wider">
                    Matricule-se
                  </span>
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
        )}

        {/* Nenhum resultado em nenhuma das listagens */}
        {totalCursosEncontrados === 0 && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-10 text-center text-sm font-bold text-gray-400">
            Nenhum curso corresponde à sua busca.
          </div>
        )}

        {/* --- SEÇÃO INFERIOR — WHATSAPP --- */}
        <div className="w-full max-w-4xl mx-auto bg-[#EAFAF1] rounded-2xl border border-green-100 p-10 md:p-12 text-center flex flex-col items-center mt-10 mb-10">
          <h3 className="text-[#0f1a30] font-black text-lg md:text-xl mb-2 tracking-tight">
            Ainda tem dúvidas?
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mb-6 font-medium max-w-sm leading-relaxed">
            Nossa equipe de atendimento corporativo está online pronta para te ajudar agora mesmo.
          </p>
          <a
            href="https://wa.me/5554999568140"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-pulse-destaque inline-flex bg-gradient-to-r from-[#01923F] to-[#034D23] text-white text-sm font-extrabold px-12 py-4 rounded-full hover:opacity-95 transition-opacity tracking-wide uppercase"
          >
            Falar no WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
