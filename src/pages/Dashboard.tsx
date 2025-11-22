import { useState } from "react";
import AddExpense from "../components/AddExpense";
import ExpensesList from "../components/ExpensesList";
import { supabase } from "../lib/supabaseClient";

function Dashboard() {
    const [reloadTrigger, setReloadTrigger] = useState(0);
    
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
            <AddExpense onAdded={() => setReloadTrigger(prev => prev + 1)}/>
            <ExpensesList
                reloadTrigger={reloadTrigger}
                onDelete={() => setReloadTrigger(prev => prev + 1)}
            />
            <button onClick={handleLogout}>Logout</button>
        </div>
    )

}

export default Dashboard;