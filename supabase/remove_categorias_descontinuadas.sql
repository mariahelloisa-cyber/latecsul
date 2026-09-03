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
