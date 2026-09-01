-- Adiciona 5 dos 6 cursos técnicos do PDF "Cópia de Cópia de Grades LA Tec Sul"
-- (Análises Clínicas, Transações Imobiliárias, Meio Ambiente, Guia de Turismo
-- e Enfermagem) na tabela public.cursos_cadastrados.
--
-- O 6º curso do PDF (Administração) NÃO entra aqui: já existe um "Técnico de
-- Administração EAD" cadastrado, então ele é atualizado em vez de duplicado —
-- ver supabase/05_update_curso_administracao.sql.
--
-- Preço, duração e selo_mec seguem o padrão do curso "Técnico de Administração
-- EAD" já cadastrado na categoria "Técnicos" (900 / 1590, 6 a 12 meses, sem
-- selo MEC). categoria_id = 2 é o id da categoria "Técnicos" neste projeto —
-- confira com "select id, nome from public.categorias" antes de rodar, caso
-- os ids sejam diferentes no seu banco.
--
-- imagem_url e imagem_capa_url ficam em branco: suba as fotos de cada curso
-- pelo painel admin (Gerenciar Cursos > editar) depois de rodar este script.

insert into public.cursos_cadastrados
  (titulo, descricao, categoria, categoria_id, preco, preco_original, duracao, carga_horaria, selo_mec, imagem_url, imagem_capa_url, grade_curricular, blocos_conteudo)
values

-- 1) TÉCNICO EM ANÁLISES CLÍNICAS


-- 2) TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS (TTI)
(
  'Técnico em Transações Imobiliárias EAD',
  'Prepare-se para atuar no mercado imobiliário, da intermediação de negócios à avaliação de imóveis. O curso desenvolve competências em direito imobiliário, marketing, avaliação de imóveis e técnicas comerciais, formando profissionais aptos a atuar em imobiliárias, incorporadoras e como corretores autônomos. Estude no seu ritmo, com aulas 100% on-line e certificação reconhecida.',
  'Técnicos',
  2,
  900.00,
  1590.00,
  '6 a 12 meses',
  '800h',
  false,
  '',
  '',
  $grade2$1º Semestre
Matemática Financeira | 75h
Comunicação e Expressão em Língua Portuguesa | 75h
Noções de Direito e Legislação | 75h
Noções de Relações Humanas e Ética | 75h
Noções de Economia e Mercado | 75h
Operações Imobiliárias | 75h

2º Semestre
Desenho Arquitetônico | 70h
Marketing Imobiliário | 70h
Organização e Técnicas Comerciais | 70h
Redes Sociais e Noções de Tecnologia | 70h
Avaliação de Imóveis | 70h$grade2$,
  $blocos2$## Curso Técnico em Transações Imobiliárias: O que é
O Técnico em Transações Imobiliárias (TTI) forma profissionais preparados para atuar na intermediação, avaliação e comercialização de imóveis, unindo noções de direito, economia, marketing e técnicas comerciais aplicadas ao mercado imobiliário.

## Objetivo do Curso
Capacitar o aluno para atuar em todas as etapas de uma transação imobiliária — da avaliação do imóvel à negociação com o cliente — com conhecimento técnico, comercial e legal.

Ao concluir o curso, o aluno estará apto a:

intermediar negociações de compra, venda e locação de imóveis;
avaliar imóveis com critérios técnicos de mercado;
elaborar peças de marketing imobiliário;
compreender a legislação e os aspectos jurídicos das transações imobiliárias;
utilizar redes sociais e ferramentas digitais para prospecção de clientes.

## Metodologia de Ensino
O curso é ministrado 100% na modalidade EaD, através de um Ambiente Virtual de Aprendizagem (AVA) dinâmico e facilitador. O aluno conta com vídeoaulas, materiais didáticos e acompanhamento pedagógico durante todo o curso.

## Mercado de Trabalho e Oportunidades
O mercado imobiliário segue em expansão e demanda profissionais qualificados para atuar em:

imobiliárias e incorporadoras;
construtoras e empreendimentos residenciais e comerciais;
consultorias de avaliação de imóveis;
atuação autônoma como corretor de imóveis, após registro no órgão de classe.

## Avaliação e Certificação
Será conferido certificado de conclusão aos alunos que cumprirem as exigências pedagógicas e acadêmicas do Projeto Pedagógico do Curso: 75% de participação nas aulas do AVA e nota igual ou superior à média estabelecida.$blocos2$
),

-- 4) TÉCNICO EM MEIO AMBIENTE
(
  'Técnico em Meio Ambiente EAD',
  'Prepare-se para atuar na gestão ambiental de empresas, indústrias e órgãos públicos. O curso desenvolve competências em gestão de resíduos, recursos energéticos, licenciamento ambiental e recuperação de áreas degradadas, formando profissionais alinhados às exigências de sustentabilidade do mercado. Estude no seu ritmo, com aulas 100% on-line e certificação reconhecida.',
  'Técnicos',
  2,
  900.00,
  1590.00,
  '6 a 12 meses',
  '1200h',
  false,
  '',
  '',
  $grade4$1º Semestre
Linguagem e Comunicação | 100h
Segurança, Meio Ambiente e Saúde | 100h
Ética e Relações Interpessoais | 100h
Ecologia | 100h

2º Semestre
Gestão Ambiental e Sustentabilidade | 135h
Gestão de Resíduos | 135h
Recursos Energéticos | 135h
Legislação e Licenciamento Ambiental | 135h
Manejo e Recuperação de Áreas Degradadas | 130h
Programa de Prevenção de Riscos Ambientais - PPRA | 130h$grade4$,
  $blocos4$## Curso Técnico em Meio Ambiente: O que é
O Técnico em Meio Ambiente forma profissionais preparados para atuar na gestão ambiental de empresas, indústrias e órgãos públicos, com foco em sustentabilidade, gestão de resíduos e recuperação de áreas degradadas.

## Objetivo do Curso
Capacitar o aluno a compreender e aplicar práticas de gestão ambiental, legislação e licenciamento, contribuindo para a adequação das organizações às exigências ambientais e de sustentabilidade.

Ao concluir o curso, o aluno estará apto a:

apoiar processos de licenciamento e gestão ambiental;
elaborar e acompanhar planos de gestão de resíduos;
atuar em programas de prevenção de riscos ambientais (PPRA);
propor ações de recuperação de áreas degradadas;
compreender os fundamentos de ecologia e recursos energéticos aplicados à indústria.

## Metodologia de Ensino
O curso é ministrado 100% na modalidade EaD, através de um Ambiente Virtual de Aprendizagem (AVA) dinâmico e facilitador. O aluno conta com vídeoaulas, materiais didáticos e acompanhamento pedagógico durante todo o curso.

## Mercado de Trabalho e Oportunidades
A crescente exigência por práticas sustentáveis abre espaço para o técnico em meio ambiente atuar em:

indústrias e empresas com departamentos de gestão ambiental;
consultorias ambientais e de sustentabilidade;
órgãos públicos de fiscalização e licenciamento ambiental;
projetos de recuperação e manejo de áreas degradadas.

## Avaliação e Certificação
Será conferido certificado de conclusão aos alunos que cumprirem as exigências pedagógicas e acadêmicas do Projeto Pedagógico do Curso: 75% de participação nas aulas do AVA e nota igual ou superior à média estabelecida.$blocos4$
),

-- 5) TÉCNICO EM GUIA DE TURISMO
(
  'Técnico em Guia de Turismo EAD',
  'Prepare-se para atuar no guiamento e na organização de roteiros turísticos regionais e nacionais. O curso desenvolve competências em história, geografia, cultura, transporte e hospedagem, formando profissionais aptos a atuar em agências de viagem, órgãos de turismo e como guias autônomos. Estude no seu ritmo, com aulas 100% on-line e certificação reconhecida.',
  'Técnicos',
  2,
  900.00,
  1590.00,
  '6 a 12 meses',
  '800h',
  false,
  '',
  '',
  $grade5$1º Semestre
Geografia | 100h
Gestão Ambiental e Sustentabilidade | 100h
História e Museologia | 100h
Informática Aplicada | 100h

2º Semestre
Arte e Cultura | 100h
Transporte e Hospedagem | 100h
Guiamento no Contexto Regional e Nacional | 100h
Legislação | 100h$grade5$,
  $blocos5$## Curso Técnico em Guia de Turismo: O que é
O Técnico em Guia de Turismo forma profissionais preparados para conduzir e organizar roteiros turísticos, com conhecimentos de geografia, história, cultura local e legislação do setor.

## Objetivo do Curso
Capacitar o aluno a atuar no guiamento turístico regional e nacional, unindo conhecimento cultural e geográfico a noções de transporte, hospedagem e sustentabilidade ambiental aplicadas ao turismo.

Ao concluir o curso, o aluno estará apto a:

conduzir grupos e roteiros turísticos regionais e nacionais;
apresentar o patrimônio histórico, cultural e ambiental de um destino;
apoiar a organização de transporte e hospedagem em viagens e excursões;
atuar em conformidade com a legislação do turismo;
aplicar noções de sustentabilidade na atividade turística.

## Metodologia de Ensino
O curso é ministrado 100% na modalidade EaD, através de um Ambiente Virtual de Aprendizagem (AVA) dinâmico e facilitador. O aluno conta com vídeoaulas, materiais didáticos e acompanhamento pedagógico durante todo o curso.

## Mercado de Trabalho e Oportunidades
O setor de turismo oferece oportunidades para o técnico em guia de turismo atuar em:

agências e operadoras de turismo;
órgãos públicos e privados de promoção turística;
museus, parques e pontos de interesse histórico-cultural;
atuação autônoma como guia de turismo, após registro no órgão competente.

## Avaliação e Certificação
Será conferido certificado de conclusão aos alunos que cumprirem as exigências pedagógicas e acadêmicas do Projeto Pedagógico do Curso: 75% de participação nas aulas do AVA e nota igual ou superior à média estabelecida.$blocos5$
),

-- 6) TÉCNICO EM ENFERMAGEM (presencial, com estágio obrigatório)
(
  'Técnico em Enfermagem',
  'Prepare-se para atuar na assistência à saúde em hospitais, clínicas e unidades de atenção básica. O curso desenvolve competências em fundamentos de enfermagem, urgência e emergência, saúde da mulher e da criança e saúde coletiva, unindo aulas teóricas e estágio obrigatório supervisionado. Certificação reconhecida ao final do curso.',
  'Técnicos',
  2,
  900.00,
  1590.00,
  '6 a 12 meses',
  '1600h',
  false,
  '',
  '',
  $grade6$1º Semestre
Linguagem e Comunicação | 80h
Segurança, Meio Ambiente e Saúde | 80h
Ética e Relações Interpessoais | 80h
Anatomia e Fisiologia | 80h
Primeiros Socorros | 80h

2º Semestre
Introdução à Enfermagem | 90h
Administração de Medicamentos | 90h
Atendimento de Urgência e Emergência | 90h
Saúde Mental | 90h
Envelhecimento Humano e Atendimento Domiciliar | 90h
Fundamentos de Enfermagem | 90h
Saúde da Mulher e da Criança | 90h
Saúde Coletiva e Políticas Públicas | 85h
Enfermagem Clínica-Cirúrgica | 85h$grade6$,
  $blocos6$## Curso Técnico em Enfermagem: O que é
O Técnico em Enfermagem forma profissionais preparados para atuar na assistência à saúde em hospitais, clínicas, unidades básicas de saúde e atendimento domiciliar, sob supervisão da equipe de enfermagem.

## Modalidade e Estágio
Diferente dos demais cursos técnicos, o Técnico em Enfermagem é ministrado na modalidade presencial e organizado em dois módulos, com matrícula por componente curricular. A carga horária total é de 1600 horas, sendo 1200 horas de aulas e 400 horas de estágio obrigatório supervisionado.

## Objetivo do Curso
Capacitar o aluno para prestar assistência de enfermagem com segurança e ética, atuando em situações de urgência e emergência, saúde da mulher e da criança, saúde mental e saúde coletiva.

Ao concluir o curso, o aluno estará apto a:

prestar cuidados básicos de enfermagem sob supervisão;
atuar em situações de urgência e emergência;
auxiliar na administração de medicamentos;
prestar assistência em saúde da mulher, da criança e do idoso;
compreender políticas públicas de saúde coletiva.

## Mercado de Trabalho e Oportunidades
O técnico em enfermagem é uma das profissões mais demandadas na área da saúde, com oportunidades em:

hospitais e prontos-socorros;
clínicas e consultórios médicos;
unidades básicas de saúde e programas de atendimento domiciliar;
concursos públicos na área da saúde.

## Avaliação e Certificação
Será conferido certificado de conclusão aos alunos que cumprirem as exigências pedagógicas e acadêmicas estabelecidas no Projeto Pedagógico do Curso, incluindo a carga horária de estágio obrigatório supervisionado, frequência mínima exigida e nota igual ou superior à média estabelecida.$blocos6$
);
