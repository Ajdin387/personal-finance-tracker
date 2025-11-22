import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AddExpense({ onAdded }: { onAdded: () => void}) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [notes, setNotes] = useState("");

    async function handleAddExpense() {
        if (amount === "" || category === "") {
            alert("Please provide amount and category");
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { alert("Not logged in"); return; }
        const { data, error } = await supabase
            .from("expenses")
            .insert({
                user_id: user.id,
                amount: Number(amount),
                category: category,
                notes: notes, })
        if (error) {
            alert(error.message);
            console.error(error)
            return;
        }
        console.log("Inserted:", data);
        onAdded();
        setAmount("");
        setCategory("");
        setNotes("");
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Add Expense</h1>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount:" />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category: " />
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes:" />
            <button onClick={handleAddExpense}>Add expense</button>
        </div>
    )
}

export default AddExpense;