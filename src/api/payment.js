import { supabase } from "@/lib/supabaseClient";

export const getPaymentdata = async () => {
  try {
    const { data, error } = await supabase.from("payments").select("*");
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
