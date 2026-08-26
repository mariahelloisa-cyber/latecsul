create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;


comment on table public.admins is
  'Allow-list explícita de administradores. Sem policies de API de propósito: só é gerenciável via SQL Editor/Dashboard (service_role), nunca por anon/authenticated. Inserir o primeiro admin manualmente após aplicar esta migration.';

create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

comment on function public.is_current_user_admin() is
  'Retorna true se o usuário autenticado atual (auth.uid()) está na allow-list public.admins. SECURITY DEFINER com search_path fixo (evita search_path hijacking); não aceita parâmetros para impedir consulta de UUID arbitrário via RPC.';

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

drop policy if exists "banners: insert autenticado" on public.banners;
create policy "banners: insert admin" on public.banners
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "banners: delete autenticado" on public.banners;
create policy "banners: delete admin" on public.banners
  for delete to authenticated using (public.is_current_user_admin());

-- selos
drop policy if exists "selos: insert autenticado" on public.selos;
create policy "selos: insert admin" on public.selos
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "selos: delete autenticado" on public.selos;
create policy "selos: delete admin" on public.selos
  for delete to authenticated using (public.is_current_user_admin());

-- depoimentos
drop policy if exists "depoimentos: insert autenticado" on public.depoimentos;
create policy "depoimentos: insert admin" on public.depoimentos
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "depoimentos: delete autenticado" on public.depoimentos;
create policy "depoimentos: delete admin" on public.depoimentos
  for delete to authenticated using (public.is_current_user_admin());

-- diferenciais
drop policy if exists "diferenciais: insert autenticado" on public.diferenciais;
create policy "diferenciais: insert admin" on public.diferenciais
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "diferenciais: delete autenticado" on public.diferenciais;
create policy "diferenciais: delete admin" on public.diferenciais
  for delete to authenticated using (public.is_current_user_admin());

-- noticias
drop policy if exists "noticias: insert autenticado" on public.noticias;
create policy "noticias: insert admin" on public.noticias
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "noticias: delete autenticado" on public.noticias;
create policy "noticias: delete admin" on public.noticias
  for delete to authenticated using (public.is_current_user_admin());
-- noticias não tinha policy de UPDATE antes desta migration (o admin editava
-- via delete+insert em alguns fluxos, mas o código também faz UPDATE direto
-- em handleSalvarEdicaoNoticia — adiciona a policy que faltava, também
-- restrita a admin, para o UPDATE funcionar sob o novo modelo):
drop policy if exists "noticias: update admin" on public.noticias;
create policy "noticias: update admin" on public.noticias
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- faqs
drop policy if exists "faqs: insert autenticado" on public.faqs;
create policy "faqs: insert admin" on public.faqs
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "faqs: delete autenticado" on public.faqs;
create policy "faqs: delete admin" on public.faqs
  for delete to authenticated using (public.is_current_user_admin());

-- vagas
drop policy if exists "vagas: insert autenticado" on public.vagas;
create policy "vagas: insert admin" on public.vagas
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "vagas: delete autenticado" on public.vagas;
create policy "vagas: delete admin" on public.vagas
  for delete to authenticated using (public.is_current_user_admin());

-- cursos_destaque
drop policy if exists "cursos_destaque: insert autenticado" on public.cursos_destaque;
create policy "cursos_destaque: insert admin" on public.cursos_destaque
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "cursos_destaque: update autenticado" on public.cursos_destaque;
create policy "cursos_destaque: update admin" on public.cursos_destaque
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());
drop policy if exists "cursos_destaque: delete autenticado" on public.cursos_destaque;
create policy "cursos_destaque: delete admin" on public.cursos_destaque
  for delete to authenticated using (public.is_current_user_admin());

-- banner_blog_lateral
drop policy if exists "banner_blog_lateral: insert autenticado" on public.banner_blog_lateral;
create policy "banner_blog_lateral: insert admin" on public.banner_blog_lateral
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "banner_blog_lateral: delete autenticado" on public.banner_blog_lateral;
create policy "banner_blog_lateral: delete admin" on public.banner_blog_lateral
  for delete to authenticated using (public.is_current_user_admin());

-- sobre_historia
drop policy if exists "sobre_historia: insert autenticado" on public.sobre_historia;
create policy "sobre_historia: insert admin" on public.sobre_historia
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "sobre_historia: delete autenticado" on public.sobre_historia;
create policy "sobre_historia: delete admin" on public.sobre_historia
  for delete to authenticated using (public.is_current_user_admin());

-- cursos_cadastrados
drop policy if exists "cursos_cadastrados: insert autenticado" on public.cursos_cadastrados;
create policy "cursos_cadastrados: insert admin" on public.cursos_cadastrados
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "cursos_cadastrados: update autenticado" on public.cursos_cadastrados;
create policy "cursos_cadastrados: update admin" on public.cursos_cadastrados
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());
drop policy if exists "cursos_cadastrados: delete autenticado" on public.cursos_cadastrados;
create policy "cursos_cadastrados: delete admin" on public.cursos_cadastrados
  for delete to authenticated using (public.is_current_user_admin());

-- categorias
drop policy if exists "categorias: insert autenticado" on public.categorias;
create policy "categorias: insert admin" on public.categorias
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "categorias: update autenticado" on public.categorias;
create policy "categorias: update admin" on public.categorias
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());
drop policy if exists "categorias: delete autenticado" on public.categorias;
create policy "categorias: delete admin" on public.categorias
  for delete to authenticated using (public.is_current_user_admin());

-- sobre_galeria (a policy original de insert chamava-se "upsert autenticado")
drop policy if exists "sobre_galeria: upsert autenticado" on public.sobre_galeria;
create policy "sobre_galeria: insert admin" on public.sobre_galeria
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "sobre_galeria: update autenticado" on public.sobre_galeria;
create policy "sobre_galeria: update admin" on public.sobre_galeria
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- sobre_redes_sociais
drop policy if exists "sobre_redes_sociais: insert autenticado" on public.sobre_redes_sociais;
create policy "sobre_redes_sociais: insert admin" on public.sobre_redes_sociais
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "sobre_redes_sociais: update autenticado" on public.sobre_redes_sociais;
create policy "sobre_redes_sociais: update admin" on public.sobre_redes_sociais
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- sobre_produto_destaque
drop policy if exists "sobre_produto_destaque: insert autenticado" on public.sobre_produto_destaque;
create policy "sobre_produto_destaque: insert admin" on public.sobre_produto_destaque
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "sobre_produto_destaque: update autenticado" on public.sobre_produto_destaque;
create policy "sobre_produto_destaque: update admin" on public.sobre_produto_destaque
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- contato_footer
drop policy if exists "contato_footer: insert autenticado" on public.contato_footer;
create policy "contato_footer: insert admin" on public.contato_footer
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "contato_footer: update autenticado" on public.contato_footer;
create policy "contato_footer: update admin" on public.contato_footer
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- home_carrossel_3d
drop policy if exists "home_carrossel_3d: insert autenticado" on public.home_carrossel_3d;
create policy "home_carrossel_3d: insert admin" on public.home_carrossel_3d
  for insert to authenticated with check (public.is_current_user_admin());
drop policy if exists "home_carrossel_3d: update autenticado" on public.home_carrossel_3d;
create policy "home_carrossel_3d: update admin" on public.home_carrossel_3d
  for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- ============================================================
-- 4) STORAGE — bucket "banners": leitura pública mantida, escrita só admin
-- ============================================================
drop policy if exists "banners bucket: upload autenticado" on storage.objects;
create policy "banners bucket: upload admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'banners' and public.is_current_user_admin());

drop policy if exists "banners bucket: delete autenticado" on storage.objects;
create policy "banners bucket: delete admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'banners' and public.is_current_user_admin());

-- "banners bucket: leitura publica" (SELECT, to public) não é tocada — a
-- leitura das imagens precisa continuar pública para o site funcionar.

-- Camada 2 da validação de upload (a real): restringe tipo e tamanho no
-- próprio bucket, para que a checagem não dependa só do que o navegador
-- decide mandar. Isto NÃO apaga nem invalida arquivos já existentes no
-- bucket — só passa a valer para uploads novos a partir de agora.
update storage.buckets
set
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'],
  file_size_limit = 5242880 -- 5 MB, em bytes
where id = 'banners';

-- ============================================================
-- Nota sobre GRANTs (02_grants.sql)
-- ============================================================
-- Os GRANTs de insert/update/delete para "authenticated" concedidos em
-- 02_grants.sql permanecem necessários e não são revertidos por esta
-- migration: sem GRANT, o Postgres nem chega a avaliar a RLS (retorna
-- "permission denied" antes de checar a policy). A restrição real agora
-- vem das policies acima, que exigem public.is_current_user_admin() além
-- do GRANT. Um usuário "authenticated" comum (fora de public.admins)
-- continua tendo o GRANT, mas toda tentativa de escrita será rejeitada
-- pela RLS.
