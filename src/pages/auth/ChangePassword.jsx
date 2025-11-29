import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) setMessage(error.message);
    else setMessage("Password changed successfully!");
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChange}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
