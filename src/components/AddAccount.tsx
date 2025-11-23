import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AddAccount() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [balance, setBalance] = useState("");

    async function handleAddAccount() {
        if (name === "" || type === "") {
            alert("Provide a name and a type")
            return;
        }
        const { data: { user }} = await supabase.auth.getUser();
        if (!user) { return; }
        const { error } = await supabase
            .from("accounts")
            .insert ({
                user_id: user.id,
                name: name,
                type: type,
                balance: Number(balance)
            })
        if (error) {
            alert(error.message);
            console.error(error);
            return;
        }
        setName("");
        setType("");
        setBalance("");
    }

    return (
            <div>
                <h1 className="text-xl font-bold">Add account</h1>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name:" />
                <input value={type} onChange={e => setType(e.target.value)} placeholder="Type:" />
                <input value={balance} onChange={e => setBalance(e.target.value)} placeholder="Balance:" />
                <button onClick={handleAddAccount} className="text-l text-yellow-500 border px-3 cursor-pointer">Add account</button>
            </div>
        )
}

export default AddAccount;