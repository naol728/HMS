import { supabase } from "@/lib/supabaseClient";

export const giveFeedback = async (info) => {
  try {
    const { rating, reservationid, userid, comment } = info;
    const { data, error } = await supabase.from("feedbacks").insert([
      {
        user_id: userid,
        reservation_id: reservationid,
        rating,
        comment,
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getfeedbacks = async (reservationid, userid) => {
  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("reservation_id", reservationid)
      .eq("user_id", userid);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
