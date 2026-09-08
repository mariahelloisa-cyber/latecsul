import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Importação dos componentes globais
import Footer from './components/Footer';
import WhatsappFloatButton from './components/WhatsappFloatButton';

// Importação das tuas páginas (lazy: cada página vira um chunk carregado sob demanda)
import Inicio from './pages/Inicio';
const Blog = lazy(() => import('./pages/Blog'));
const Vagas = lazy(() => import('./pages/Vagas'));
const Ouvidoria = lazy(() => import('./pages/ouvidoria'));
const PostDetalhe = lazy(() => import('./pages/PostDetalhe'));
const FAQ = lazy(() => import('./pages/FAQ'));
// Página de Aproveitamento desativada por enquanto (ver rota mais abaixo)
// const ValidacaoRastreio = lazy(() => import('./pages/ValidacaoRastreio'));
const Sobre = lazy(() => import('./pages/sobre'));
const ListaCursos = lazy(() => import('./pages/ListaCursos'));
const CursoDetalhe = lazy(() => import('./pages/CursoDetalhe'));
const Login = lazy(() => import('./pages/Login'));

function LayoutGlobal() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <WhatsappFloatButton />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<PostDetalhe />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/ouvidoria" element={<Ouvidoria />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Aproveitamento desativado por enquanto: quem acessar o link antigo
              vai para a Home. Para reativar, troque o Navigate pelo componente,
              descomente o import lá em cima e o link no Navbar. */}
          <Route path="/validacaoRastreio" element={<Navigate to="/" replace />} />
          {/* <Route path="/validacaoRastreio" element={<ValidacaoRastreio />} /> */}
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cursos" element={<ListaCursos />} />
          <Route path="/cursos/:id" element={<CursoDetalhe />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>

      {/* O Footer SÓ aparece se NÃO for a página de login */}
      {!isLoginPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutGlobal />
    </Router>
  );
}