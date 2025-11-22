import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function AuthPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSignUp() {
        if (email == "" || password == "") {
            alert("Email and password must not be empty.")
            return;
        }
        const { data, error } = await supabase.auth.signUp({ email, password, });
        if (error) {
            alert(error.message);
            return;
        }
        console.log("Registration successful");
        console.log("User registered: ",  data.user);
    }

    async function handleLogin() {
        if (email == "" || password == "") {
            alert("Email and password must not be empty.")
            return;
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password, });
        if (error) {
            alert(error.message);
            return;
        }
        console.log("Login successful");
        console.log("User logged in: ",  data.user);
        navigate("/app");
    }

    return (
        <div>
            <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={handleSignUp}>Sign up</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default AuthPage;