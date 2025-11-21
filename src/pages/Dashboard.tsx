import { supabase } from "../lib/supabaseClient";

function Dashboard() {
    
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )

}

export default Dashboard;