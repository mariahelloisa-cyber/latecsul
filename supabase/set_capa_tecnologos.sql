-- Define a mesma foto (capa) para todos os cursos da categoria "Tecnólogos".
--
-- imagem_url      -> foto usada nos cards (listagem de cursos, home, etc).
-- imagem_capa_url -> foto de fundo (hero) da página de detalhe do curso.
--
-- PASSO 1: suba a imagem em algum lugar do painel admin (por exemplo, edite
-- qualquer curso "Tecnólogos" existente, troque a foto e salve — ou use o
-- Storage do Supabase diretamente: Project > Storage > bucket "banners" >
-- upload). Depois copie a URL pública gerada (algo como
-- https://SEU-PROJETO.supabase.co/storage/v1/object/public/banners/arquivo.png).
--
-- PASSO 2: cole a URL no lugar de SUBSTITUA_PELA_URL_DA_IMAGEM abaixo (nos
-- dois campos) e rode este script no SQL Editor do Supabase.

update public.cursos_cadastrados
set
  imagem_url = 'https://efhqhorzanyasztadnvj.supabase.co/storage/v1/object/public/banners/ChatGPT%20Image%2021%20de%20ago.%20de%202026,%2010_07_42.png',
  imagem_capa_url = 'https://efhqhorzanyasztadnvj.supabase.co/storage/v1/object/public/banners/ChatGPT%20Image%2021%20de%20ago.%20de%202026,%2010_07_42.png'
where lower(trim(categoria)) = 'tecnólogos';
