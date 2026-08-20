-- Concede os privilégios de tabela que o Supabase normalmente configura
-- sozinho quando as tabelas são criadas pela interface. Como as tabelas
-- deste projeto foram criadas via SQL Editor puro, as roles "anon" e
-- "authenticated" ficaram sem GRANT nenhum — e sem GRANT, o Postgres nem
-- chega a avaliar as políticas de RLS (retorna "permission denied").
--
-- Rode este arquivo por último, depois de todos os outros scripts em supabase/.

grant usage on schema public to anon, authenticated;

grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Garante que tabelas criadas no futuro (por outros scripts) já saiam com os
-- mesmos privilégios, sem precisar rodar isso de novo.
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;
