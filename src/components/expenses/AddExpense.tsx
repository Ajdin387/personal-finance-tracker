import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Account = {
    id: string;
    name: string;
    type: string;
}

function AddExpense({ onAdded }: { onAdded: () => void}) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [notes, setNotes] = useState("");
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState("");

    useEffect(() => {
        async function loadAccounts() {
            const { data, error } = await supabase
                .from("accounts")
                .select("*")
                .order("created_at", {ascending: true});
            if (error) {
                alert(error.message);
                console.error(error);
                return;
            }
            setAccounts(data);
        }
        loadAccounts();
    }, [])

    async function handleAddExpense() {
        if (amount === "" || category === "") {
            alert("Please provide amount and category");
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { return; }
        const { error } = await supabase
            .from("expenses")
            .insert({
                user_id: user.id,
                amount: Number(amount),
                category: category,
                notes: notes, 
                account_id: selectedAccountId})
        if (error) {
            alert(error.message);
            console.error(error)
            return;
        }
        onAdded();
        setAmount("");
        setCategory("");
        setNotes("");
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Add Expense</h1>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount:" />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category: " />
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes:" />
            <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} >
                <option value="">Select account</option>
                {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                    </option>
                ))}
            </select>
            <button onClick={handleAddExpense} className="text-l text-yellow-500 border px-3 cursor-pointer">Add expense</button>
        </div>
    )
}

export default AddExpense;