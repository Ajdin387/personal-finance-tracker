import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function AddAccount({ onAdded }: { onAdded: () => void }) {
    const ACCOUNT_TYPES = ["Cash", "Bank account", "Crypto account"];
    const COINS = [
        { id: "bitcoin", name: "Bitcoin (BTC)" },
        { id: "ethereum", name: "Ethereum (ETH)" },
        { id: "solana", name: "Solana (SOL)" },
        { id: "pepe", name: "Pepe (PEPE)"},
    ]

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [balance, setBalance] = useState("");
    const [coin, setCoin] = useState("");
    const [coinAmount, setCoinAmount] = useState("");

    async function handleAddAccount() {
        if (name === "" || type === "") {
            alert("Provide a name and a type")
            return;
        }
        const { data: { user }} = await supabase.auth.getUser();
        if (!user) { return; }
        let finalBalance = Number(balance)
        if (type === "Crypto account") {
            if (!coin || !coinAmount) {
                alert("Please select coin and specify amount.");
                return;
            }
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=eur`);
            const priceData = await res.json();
            const price = priceData[coin]?.eur;
            if (!price) {
                alert("Failed to calculate price.")
                return;
            }
            finalBalance = Number(coinAmount) * price;
        }
        const { error } = await supabase
            .from("accounts")
            .insert ({
                user_id: user.id,
                name: name,
                type: type,
                balance: Number(finalBalance),
                coin: type === "Crypto account" ? coin : null,
                coin_amount: type === "Crypto account" ? Number(coinAmount) : null,
            })
        if (error) {
            alert(error.message);
            console.error(error);
            return;
        }
        onAdded();
        setName("");
        setType("");
        setBalance("");
        setCoin("");
        setCoinAmount("");
    }

    return (
            <div>
                <h1 className="text-xl font-bold">Add account</h1>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name:" />
                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="">Select type</option>
                    {ACCOUNT_TYPES.map(t => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                {type === "Crypto account" && (
                    <span>
                        <select value={coin} onChange={e => setCoin(e.target.value)}>
                            <option value="">Select coin</option>
                            {COINS.map( c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Amount (e.g. 0.05)"
                            value={coinAmount}
                            onChange={e => setCoinAmount(e.target.value)}
                        />
                    </span>
                )}
                {type !== "Crypto account" && (
                    <input value={balance} onChange={e => setBalance(e.target.value)} placeholder="Balance:" />
                )}
                <button onClick={handleAddAccount} className="text-l text-yellow-500 border px-3 cursor-pointer">Add account</button>
            </div>
        )
}

export default AddAccount;