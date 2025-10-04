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

export const getAllfeedbacks = async () => {
  try {
    const { data: feedbacks, error: feedbackError } = await supabase
      .from("feedbacks")
      .select("*");
    if (feedbackError) throw new Error(feedbackError.message);

    if (!feedbacks || feedbacks.length === 0) {
      console.log("No feedbacks found.");
      return [];
    }

    const reservationIds = feedbacks.map((f) => f.reservation_id);
    const { data: reservations, error: reservationError } = await supabase
      .from("reservations")
      .select("*")
      .in("id", reservationIds);

    if (reservationError) throw new Error(reservationError.message);

    const roomIds = reservations.map((r) => r.room_id);
    const { data: rooms, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .in("id", roomIds);

    if (roomError) throw new Error(roomError.message);

    const merged = feedbacks.map((feedback) => {
      const reservation = reservations.find(
        (r) => r.id === feedback.reservation_id
      );
      const room = rooms.find((room) => room.id === reservation?.room_id);
      return {
        ...feedback,
        reservation,
        room,
      };
    });

    console.log(merged);
    return merged;
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    throw new Error(error.message);
  }
};
