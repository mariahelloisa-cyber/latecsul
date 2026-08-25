-- Atualiza o curso "Técnico de Administração EAD" já existente (id 79 neste
-- projeto) com a grade curricular e o conteúdo do PDF "Cópia de Cópia de
-- Grades LA Tec Sul", em vez de criar um curso duplicado.
--
-- Confira antes de rodar: "select id, titulo from public.cursos_cadastrados
-- where titulo = 'Técnico de Administração EAD';" — se o id não for 79 no seu
-- banco, ajuste o "where id = 79" abaixo (ou troque por
-- "where titulo = 'Técnico de Administração EAD'").
--
-- Preço (900/1590) e duração ("6 a 12 meses") já estavam corretos e não são
-- alterados; só carga_horaria, descrição, grade e conteúdo são atualizados.

update public.cursos_cadastrados
set
  carga_horaria = '800h',
  descricao = 'Prepare-se para atuar na gestão de empresas públicas e privadas. O curso desenvolve competências em economia, recursos humanos, marketing, gestão da qualidade e ação comunitária, formando profissionais capazes de organizar processos e apoiar a tomada de decisões. Estude no seu ritmo, com aulas 100% on-line e certificação reconhecida.',
  grade_curricular = $grade3$1º Semestre
Matemática Financeira | 70h
Economia Aplicada aos Negócios | 70h
Comunicação e Expressão em Língua Portuguesa | 70h
Informática Aplicada | 60h
Direito e Legislação | 60h
Administração de Recursos Humanos | 70h

2º Semestre
Noções de Marketing | 80h
Organização de Empresas Públicas e Privadas | 80h
Gestão da Qualidade | 80h
Ética Profissional na Administração | 80h
Ação Comunitária | 80h$grade3$,
  blocos_conteudo = $blocos3$## Curso Técnico em Administração: O que é
O Técnico em Administração forma profissionais capazes de apoiar a gestão de empresas públicas e privadas, atuando em processos administrativos, financeiros, comerciais e de recursos humanos.

## Objetivo do Curso
Desenvolver competências para organizar processos administrativos, apoiar a tomada de decisões e contribuir para o crescimento das organizações, com base em conhecimentos de economia, marketing, qualidade e gestão de pessoas.

Ao concluir o curso, o aluno estará apto a:

apoiar rotinas administrativas e financeiras de empresas e órgãos públicos;
auxiliar em processos de recrutamento e gestão de recursos humanos;
aplicar noções de marketing e organização empresarial;
atuar com ética profissional e responsabilidade em ações comunitárias;
utilizar ferramentas de informática aplicadas à rotina administrativa.

## Metodologia de Ensino
O curso é ministrado 100% na modalidade EaD, através de um Ambiente Virtual de Aprendizagem (AVA) dinâmico e facilitador. O aluno conta com vídeoaulas, materiais didáticos e acompanhamento pedagógico durante todo o curso.

## Mercado de Trabalho e Oportunidades
Profissionais de administração são demandados em praticamente todos os setores da economia. Com a formação, o aluno amplia suas oportunidades em:

empresas privadas de todos os portes;
órgãos e autarquias públicas;
setores administrativo, financeiro e de recursos humanos;
concursos públicos na área administrativa.

## Avaliação e Certificação
Será conferido certificado de conclusão aos alunos que cumprirem as exigências pedagógicas e acadêmicas do Projeto Pedagógico do Curso: 75% de participação nas aulas do AVA e nota igual ou superior à média estabelecida.$blocos3$
where id = 79;
