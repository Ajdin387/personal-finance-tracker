import { useState } from "react";
import AddExpense from "../components/expenses/AddExpense";
import ExpensesList from "../components/expenses/ExpensesList";
import { supabase } from "../lib/supabaseClient";
import AddAccount from "../components/accounts/AddAccount";
import AccountList from "../components/accounts/AccountList";

function Dashboard() {
    const [reloadTrigger, setReloadTrigger] = useState(0);
    
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
            <br/>
            <br />
            <br />
            <AddExpense 
                reloadTrigger={reloadTrigger}
                onAdded={() => setReloadTrigger(prev => prev + 1)}
            />
            <br/>
            <ExpensesList
                reloadTrigger={reloadTrigger}
                onDeleted={() => setReloadTrigger(prev => prev + 1)}
            />
            <br />
            <AddAccount onAdded={() => setReloadTrigger(prev => prev + 1)} />
            <AccountList 
                reloadTrigger={reloadTrigger} 
                onDeleted={() => setReloadTrigger(prev => prev + 1)}
                />
            <br />
            <br />
            <button onClick={handleLogout} className="font-bold border px-3 cursor-pointer">Logout</button>
        </div>
    )

}

export default Dashboard;