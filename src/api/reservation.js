import { supabase } from "@/lib/supabaseClient";

export async function createReservationAndReserveRoom(data) {
  const {
    user_id,
    room_id,
    check_in,
    check_out,
    total_price,
    status,
    payment_status,
  } = data;

  const { data: reservation, error: reservationError } = await supabase
    .from("reservations")
    .insert([
      {
        user_id,
        room_id,
        check_in,
        check_out,
        total_price,
        status: status || "pending",
        payment_status: payment_status || "pending",
      },
    ])
    .select()
    .single();

  if (reservationError) {
    console.error("Error creating reservation:", reservationError.message);
    throw reservationError;
  }

  const { data: updatedRoom, error: roomError } = await supabase
    .from("rooms")
    .update({ status: "reserved" })
    .eq("id", room_id)
    .select()
    .single();

  if (roomError) {
    console.error("Error updating room status:", roomError.message);
    throw roomError;
  }

  return { reservation, updatedRoom };
}

export const getUserReservation = async (id) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", id);
    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const getReservationbyid = async (id) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
