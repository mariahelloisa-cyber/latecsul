-- ============================================================
-- 07 — Endurecimento adicional (auditoria de segurança)
-- Rode DEPOIS de 02_grants.sql e 06_admin_authz.sql.
-- Este arquivo é idempotente: pode ser rodado mais de uma vez.
-- ============================================================

-- ------------------------------------------------------------
-- 1) public.admins — a tabela que define quem é administrador
-- ------------------------------------------------------------
-- 02_grants.sql faz "grant insert, update, delete on all tables in schema
-- public to authenticated". Esse comando é cego: se for rodado depois de
-- 06_admin_authz.sql (e a instrução no próprio arquivo é "rode por último"),
-- ele também concede escrita na tabela public.admins para QUALQUER usuário
-- autenticado.
--
-- Hoje isso não é explorável, porque public.admins tem RLS habilitado e
-- nenhuma policy — e RLS sem policy nega tudo, inclusive para quem tem o
-- GRANT. Ou seja, a segurança da tabela mais sensível do sistema está
-- apoiada em UMA camada só (a ausência de policies). Basta alguém criar uma
-- policy permissiva nessa tabela por engano, num futuro "vou liberar pra
-- testar", para virar escalação de privilégio direta: usuário comum insere o
-- próprio auth.uid() em public.admins e vira admin de todo o painel.
--
-- Os dois comandos abaixo tiram essa dependência de camada única: sem GRANT,
-- o Postgres rejeita a escrita ANTES de sequer olhar as policies.
revoke all on table public.admins from anon, authenticated;

-- E impede que a escrita passe por cima da RLS quando a sessão for a do dono
-- da tabela (o dono, por padrão, ignora RLS — com FORCE, não ignora mais).
-- service_role continua conseguindo gerenciar admins pelo SQL Editor/Dashboard
-- porque lá o bypass é feito pelo atributo BYPASSRLS da role, não por posse.
alter table public.admins force row level security;

-- ------------------------------------------------------------
-- 2) Função de autorização
-- ------------------------------------------------------------
-- Reafirma o estado esperado: anon não executa, authenticated executa.
-- (06_admin_authz.sql já faz isso; repetir aqui deixa o arquivo de
-- endurecimento auto-suficiente e detectável numa revisão futura.)
revoke all on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;

-- ------------------------------------------------------------
-- 3) Privilégios padrão para tabelas FUTURAS
-- ------------------------------------------------------------
-- 02_grants.sql deixou "alter default privileges ... grant select to anon".
-- Efeito colateral: qualquer tabela nova criada neste schema já nasce legível
-- pela role anon. Se quem criar a tabela esquecer de rodar
-- "alter table ... enable row level security", os dados dessa tabela ficam
-- públicos na API REST sem nenhum aviso — a falha é silenciosa.
--
-- NÃO estamos revertendo isso automaticamente, porque reverter obriga a
-- conceder GRANT manual em toda tabela nova e quebraria o fluxo de trabalho
-- atual do projeto. A decisão fica com quem administra o banco. Para tornar o
-- comportamento "à prova de esquecimento", descomente as três linhas abaixo:
--
-- alter default privileges in schema public revoke select on tables from anon;
-- alter default privileges in schema public revoke select on tables from authenticated;
-- alter default privileges in schema public revoke insert, update, delete on tables from authenticated;
--
-- Enquanto não for descomentado, o controle compensatório é rodar
-- 08_verificacao_seguranca.sql (consulta 1) sempre que uma tabela nova for
-- criada, para conferir que ela tem RLS ligada.
