-- Remove de vez as categorias descontinuadas e os cursos delas.
-- Cole e rode no SQL Editor do Supabase.
--
-- Categorias removidas:
--   Profissionalizantes premium
--   Profissionalizantes comuns
--   Profissionalizantes avançados
--   Tecnólogos
--
-- Os cursos de "Profissionalizantes *" ficavam numa lista fixa no código
-- (src/pages/cursosData.js, já esvaziada). Os de "Tecnólogos" estão no banco,
-- inseridos por add_cursos_tecnologos.sql / add_cursos_tecnologos_parte2.sql.

-- 1) CONFERÊNCIA — rode primeiro e veja o que vai ser apagado.
select id, titulo, categoria
from public.cursos_cadastrados
where lower(trim(categoria)) in (
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos'
)
order by categoria, titulo;

select id, nome
from public.categorias
where lower(trim(nome)) in (
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos'
);

-- 2) EXCLUSÃO — rode depois de conferir a lista acima.
begin;

delete from public.cursos_destaque
where lower(trim(categoria)) in (
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos'
);

delete from public.cursos_cadastrados
where lower(trim(categoria)) in (
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos'
);

delete from public.categorias
where lower(trim(nome)) in (
  'profissionalizantes premium',
  'profissionalizantes comuns',
  'profissionalizantes avançados',
  'tecnólogos'
);

commit;
