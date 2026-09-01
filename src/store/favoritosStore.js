import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritosStore = create(
  persist(
    (set, get) => ({
      favoritos: [],
      favoritosAberto: false, // <-- Controla se a aba está visível ou oculta

      // Função para abrir ou fechar os favoritos manualmente
      setFavoritosAberto: (aberto) => set({ favoritosAberto: aberto }),

      adicionarAosFavoritos: (curso) => {
        const favoritosAtuais = get().favoritos;
        const jaExiste = favoritosAtuais.find((item) => item.id === curso.id);

        if (!jaExiste) {
          set({
            favoritos: [...favoritosAtuais, curso],
            favoritosAberto: true // <-- Abre a aba automaticamente ao favoritar!
          });
        } else {
          set({ favoritosAberto: true }); // Abre a aba para mostrar que já está lá
        }
      },

      removerDosFavoritos: (cursoId) => {
        set({
          favoritos: get().favoritos.filter((item) => item.id !== cursoId),
        });
      },

      limparFavoritos: () => set({ favoritos: [] }),
    }),
    {
      name: 'meus-favoritos-cursos',
      // Salva apenas a lista de cursos no navegador, ignorando se a aba estava aberta ou fechada
      partialize: (state) => ({ favoritos: state.favoritos }),
    }
  )
);
