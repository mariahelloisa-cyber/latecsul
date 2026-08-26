

update public.cursos_cadastrados
set
  imagem_url = 'https://efhqhorzanyasztadnvj.supabase.co/storage/v1/object/public/banners/ChatGPT%20Image%2021%20de%20ago.%20de%202026,%2010_07_42.png',
  imagem_capa_url = 'https://efhqhorzanyasztadnvj.supabase.co/storage/v1/object/public/banners/ChatGPT%20Image%2021%20de%20ago.%20de%202026,%2010_07_42.png'
where lower(trim(categoria)) = 'tecnólogos';
