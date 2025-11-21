import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";


function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                setUser(data.session?.user ?? null);
            }
            setLoading(false);
        }
        loadSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        })

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);

    return { user, loading }
}

export default useAuth;