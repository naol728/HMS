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
export const makePayment = async (data) => {
  const { resid, amount } = data;
  try {
    // Insert a new payment record
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        reservation_id: resid,
        amount,
        method: "cash",
        status: "paid",
      },
    ]);
    if (paymentError)
      throw new Error("Payment insertion failed: " + paymentError.message);

    // Update reservation status to confirmed and payment_status to paid
    const { error: reservationError } = await supabase
      .from("reservations")
      .update({ status: "confirmed", payment_status: "paid" })
      .eq("id", resid);
    const { data: reservationData, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", resid)
      .single();
    if (reservationError || error)
      throw new Error("Reservation update failed: " + reservationError.message);
    // Update the associated room status to occupied using the room_id from the reservation
    const { error: roomError } = await supabase
      .from("rooms")
      .update({ status: "occupied" })
      .eq("id", reservationData.room_id);
    if (roomError) throw new Error("Room update failed: " + roomError.message);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
