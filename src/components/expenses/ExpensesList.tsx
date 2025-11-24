import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Expense = {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    notes: string | null;
    created_at: string;
    account_id: string;
    account: {
        id: string;
        name: string;
        type: string;
    } | null;
}

function ExpensesList({ reloadTrigger, onDeleted }: { reloadTrigger: number; onDeleted: () => void }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        async function loadExpenses() {
            const { data, error } = await supabase
                .from("expenses")
                .select(`
                    id,
                    user_id,
                    amount,
                    category,
                    notes,
                    created_at,
                    account_id,
                    account:accounts!account_id (
                        id,
                        name,
                        type
                    )
                `)
                .order("created_at", {ascending: false});
            if (error) { 
                alert(error.message); 
                console.error(error); 
                return;
            }
            if (data) {
                const normalized: Expense[] = data.map((row: any) => ({
                    ...row,
                    account: row.account && Array.isArray(row.account)
                        ? row.account[0] ?? null
                        : row.account ?? null,
                }));
                setExpenses(normalized);
            } else {
                setExpenses([]);
            }
        }
        loadExpenses();
    }, [reloadTrigger])

    async function handleDelete(id: string) {
        const { error } = await supabase
            .from("expenses")
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
            <h2 className="text-2xl">Your Expenses</h2>
            
            {expenses.length === 0 && <p>No expenses yet.</p>}
            {expenses.map((exp) => (
                <div key={exp.id}>
                    <hr />
                    {exp.amount} € - {exp.category}
                    <br />
                    {exp.notes || "Expense has no note."}
                    <br />
                    {new Date(exp.created_at).toLocaleString()}
                    <br />
                    Account: {exp.account?.name || "Unknown account"} ({ exp.account?.type })
                    <br />
                    <button onClick={() => handleDelete(exp.id)} className="text-l text-red-500 border px-3 cursor-pointer">Delete</button>
                    <hr />
                </div>
            ))}
            <br />
            <br />
            <br />
        </div>
    );
}

export default ExpensesList;