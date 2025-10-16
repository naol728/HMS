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
      .select(
        `*, rooms:room_id (
          id,
          room_number,
          type,
          status,
          image_url
        ), users:user_id (
          id,
          name,
          email
        )`
      )
      .eq("user_id", id)
      .eq("is_active", true);
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
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllReservation = async () => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        *,
        users:user_id (
          id,
          name,
          email
        ),
        rooms:room_id (
          id,
          room_number,
          type,
          status,
          image_url
        )
      `
      )
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Error fetching reservations:", error.message);
    throw new Error(error.message);
  }
};
export const deletereservation = async (id) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Reservation not found");

    const { error: roomError } = await supabase
      .from("rooms")
      .update({ status: "available" })
      .eq("id", data.room_id);

    if (roomError) throw new Error(roomError.message);

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
