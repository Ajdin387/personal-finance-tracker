import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient";

type Account = {
    id: string;
    user_id: string;
    name: string;
    type: string;
    balance: number;
    created_at: string;
    coin: string;
    coin_amount: number;
}

function AccountList( { onDeleted, reloadTrigger }: { onDeleted: () => void, reloadTrigger: number } ) {
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect (() => {
        async function loadAccounts() {
            const { data, error } = await supabase
                .from("accounts")
                .select("*")
                .order("created_at", {ascending: false});
            if (error) { 
                alert(error.message); 
                console.error(error); 
                return; 
            }
            setAccounts(data);
        }
        loadAccounts();
    }, [reloadTrigger])

    async function handleDelete(id: string) {
        const { error } = await supabase
            .from("accounts")
            .delete()
            .eq("id", id);
        if (error) {
            alert(error.message);
            console.error(error);
            return;
        }
        onDeleted();
    }

    return (
        <div>
            <br />
            <h2 className="text-2xl">Your accounts:</h2>
            {accounts.length === 0 && <p>No accounts yet.</p>}
            {accounts.map(acc => (
                <div key={acc.id}>
                    <h3>{acc.name}</h3>
                    <p>Type: {acc.type}</p>
                    {acc.type === "Crypto account" && (
                        <p>Crypto: {acc.coin_amount} {acc.coin}</p>
                    )}
                    <p>Balance: {acc.balance} €</p>
                    <button onClick={ () => handleDelete(acc.id)} className="border px-3 text-red-500 cursor-pointer">Delete</button>
                    <hr />
                </div>
            ))}
            <br />
            <br />
        </div>
    );
}

export default AccountList;