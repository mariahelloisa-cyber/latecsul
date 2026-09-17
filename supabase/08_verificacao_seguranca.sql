-- ============================================================
-- 08 — Verificação de segurança (SOMENTE LEITURA)
--
-- Este arquivo NÃO altera nada. São consultas para rodar no SQL Editor do
-- Supabase e CONFERIR, com evidência, o estado real da autorização no banco.
--
-- A auditoria de código consegue provar o que os arquivos .sql pedem; ela NÃO
-- consegue provar o que o banco em produção realmente tem aplicado (as
-- migrations podem ter sido rodadas parcialmente, fora de ordem, ou alguém
-- pode ter mexido por fora pelo Dashboard). Rodar estas 7 consultas é o que
-- transforma "presumo que está aplicado" em "verificado".
--
-- Como usar: abra o SQL Editor do projeto, cole um bloco por vez e compare o
-- resultado com o "ESPERADO" descrito acima de cada consulta.
-- ============================================================


-- ------------------------------------------------------------
-- 1) Toda tabela do schema public tem RLS ligada?
-- ESPERADO: zero linhas. Qualquer linha aqui é uma tabela exposta na API REST
-- sem controle de acesso — os dados dela são legíveis por qualquer pessoa com
-- a chave anon, que está publicada no JavaScript do site.
-- ------------------------------------------------------------
select
  c.relname            as tabela_sem_rls,
  c.relrowsecurity     as rls_ligada,
  c.relforcerowsecurity as rls_forcada
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relrowsecurity = false;


-- ------------------------------------------------------------
-- 2) Existe alguma policy de ESCRITA que não exige ser admin?
-- ESPERADO: zero linhas.
-- Uma linha aqui significa que um usuário apenas autenticado (qualquer conta
-- criada no Supabase Auth, não necessariamente da escola) pode escrever nessa
-- tabela. Se o cadastro público estiver habilitado no projeto, isso é
-- defacement do site por qualquer pessoa da internet.
-- ------------------------------------------------------------
select
  tablename   as tabela,
  policyname  as policy,
  cmd         as operacao,
  qual        as condicao_using,
  with_check  as condicao_with_check
from pg_policies
where schemaname = 'public'
  and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and coalesce(qual, '') || coalesce(with_check, '') not like '%is_current_user_admin%';


-- ------------------------------------------------------------
-- 3) Quais policies de LEITURA são públicas?
-- ESPERADO: exatamente as tabelas de conteúdo do site (banners, selos,
-- depoimentos, diferenciais, noticias, faqs, vagas, cursos_destaque,
-- cursos_cadastrados, categorias, banner_blog_lateral, sobre_*,
-- contato_footer, home_carrossel_3d). Esse conteúdo é público de propósito:
-- é o que o site mostra para visitante não logado.
-- NÃO ESPERADO: "admins" ou qualquer tabela com dado pessoal nesta lista.
-- ------------------------------------------------------------
select tablename as tabela, policyname as policy, roles, qual as condicao
from pg_policies
where schemaname = 'public'
  and cmd = 'SELECT'
order by tablename;


-- ------------------------------------------------------------
-- 4) A tabela public.admins está realmente fechada?
-- ESPERADO: policies = 0, rls_ligada = true, rls_forcada = true,
-- e a coluna privilegios_anon_authenticated vazia/nula.
-- ------------------------------------------------------------
select
  c.relrowsecurity      as rls_ligada,
  c.relforcerowsecurity as rls_forcada,
  (select count(*) from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'admins') as policies,
  (select string_agg(distinct privilege_type, ', ')
     from information_schema.role_table_grants g
    where g.table_schema = 'public'
      and g.table_name = 'admins'
      and g.grantee in ('anon', 'authenticated'))            as privilegios_anon_authenticated
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'admins';


-- ------------------------------------------------------------
-- 5) A função de autorização está correta?
-- ESPERADO: security_definer = true, search_path fixo em "public, pg_temp",
-- e quem pode executar = apenas authenticated (anon NÃO pode).
-- security_definer sem search_path fixo permitiria a um usuário criar um
-- schema próprio, plantar ali uma tabela chamada "admins" e fazer a função
-- responder true para ele — por isso o search_path fixo importa.
-- ------------------------------------------------------------
select
  p.proname                                as funcao,
  p.prosecdef                              as security_definer,
  p.proconfig                              as configuracoes,
  has_function_privilege('anon',          p.oid, 'EXECUTE') as anon_pode_executar,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_pode_executar
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'is_current_user_admin';


-- ------------------------------------------------------------
-- 6) Quem são os administradores hoje?
-- ESPERADO: somente contas que você reconhece. Cada linha aqui tem poder
-- total sobre o conteúdo do site. Se aparecer um e-mail desconhecido,
-- trate como incidente: remova a linha e troque a senha das contas restantes.
-- ------------------------------------------------------------
select a.user_id, u.email, a.created_at
from public.admins a
left join auth.users u on u.id = a.user_id
order by a.created_at;


-- ------------------------------------------------------------
-- 7) O bucket de Storage está com os limites aplicados?
-- ESPERADO: public = true (as imagens do site precisam ser lidas por
-- visitante não logado), allowed_mime_types = {image/jpeg,image/png,image/webp}
-- e file_size_limit = 5242880.
-- Se allowed_mime_types vier NULL, a validação de tipo existe apenas no
-- JavaScript do navegador — e o navegador é do atacante, então ela não vale
-- nada: dá para subir qualquer arquivo montando a requisição na mão.
-- ------------------------------------------------------------
select id, name, public, allowed_mime_types, file_size_limit
from storage.buckets;


-- ------------------------------------------------------------
-- 8) Policies do Storage
-- ESPERADO: a policy de SELECT é pública (leitura das imagens);
-- as de INSERT/UPDATE/DELETE devem citar is_current_user_admin().
-- ------------------------------------------------------------
select policyname as policy, cmd as operacao, roles,
       qual as condicao_using, with_check as condicao_with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by cmd;
