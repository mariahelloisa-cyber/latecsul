import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Fonte única de verdade, no frontend, para decidir se a UI do painel
// administrativo deve aparecer. Duas condições precisam ser verdadeiras:
// 1) existe uma sessão Supabase real (supabase.auth.getSession());
// 2) o usuário da sessão está na allow-list public.admins, checada via a
//    função SECURITY DEFINER public.is_current_user_admin() (RPC).
//
// IMPORTANTE: isto é só para experiência do usuário (esconder/mostrar o
// painel). A autorização de verdade para qualquer INSERT/UPDATE/DELETE é
// sempre garantida pelas RLS policies do banco, que chamam a mesma função
// do lado do Postgres — nunca confie neste hook como controle de acesso.
export function useAdminGuard() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [carregandoAdmin, setCarregandoAdmin] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function verificarAdmin(sessaoAtual) {
      if (!sessaoAtual) {
        if (ativo) setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase.rpc('is_current_user_admin');
      if (ativo) setIsAdmin(!error && data === true);
    }

    supabase.auth.getSession().then(({ data: { session: sessaoInicial } }) => {
      if (!ativo) return;
      setSession(sessaoInicial);
      verificarAdmin(sessaoInicial).finally(() => {
        if (ativo) setCarregandoAdmin(false);
      });
    });

    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      if (!ativo) return;
      setSession(novaSessao);
      verificarAdmin(novaSessao);
    });

    return () => {
      ativo = false;
      assinatura?.subscription?.unsubscribe();
    };
  }, []);

  return { session, isAdmin, carregandoAdmin };
}
