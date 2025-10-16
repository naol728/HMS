import { supabase } from "@/lib/supabaseClient";

export const subscribenewsletter = async (email) => {
  try {
    const { data, error } = await supabase
      .from("newsletter")
      .insert([
        {
          email,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
