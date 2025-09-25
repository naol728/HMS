import { supabase } from "@/lib/supabaseClient";

// Register
export const registerUser = async ({ name, email, password }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw new Error(authError.message);

    const userId = authData.user?.id;
    if (userId) {
      const { error: dbError } = await supabase
        .from("users")
        .insert([{ id: userId, name, email, role: "customer" }]);
      if (dbError) throw new Error(dbError.message);
    }

    return authData.user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Login
export const loginUser = async ({ email, password }) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return authData.user;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return true;
};
