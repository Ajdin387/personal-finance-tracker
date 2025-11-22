import AddExpense from "../components/AddExpense";
import ExpensesList from "../components/ExpensesList";
import { supabase } from "../lib/supabaseClient";

function Dashboard() {
    
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
            <AddExpense />
            <ExpensesList />
            <button onClick={handleLogout}>Logout</button>
        </div>
    )

}

export default Dashboard;