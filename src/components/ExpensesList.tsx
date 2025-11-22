import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Expense = {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    notes: string | null;
    created_at: string;
}

function ExpensesList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        async function loadExpenses() {
            const { data, error } = await supabase
                .from("expenses")
                .select("*")
                .order("created_at", {ascending: false});
            if (error) { 
                alert(error.message); 
                console.error(error); 
                return;
            }
            setExpenses(data);
        }
        loadExpenses();
    }, [])
    
    return (
        <div>
            <h2>Your Expenses</h2>
            {expenses.length === 0 && <p>No expenses yet.</p>}
            <br />
            {expenses.map((exp) => (
                <div key={exp.id}>
                    <hr />
                    {exp.amount} € - {exp.category}
                    <br />
                    {exp.notes || "Expense has no note."}
                    <br />
                    {exp.created_at}
                    <hr />
                </div>
            ))}
            <br />
        </div>
    );
}

export default ExpensesList;