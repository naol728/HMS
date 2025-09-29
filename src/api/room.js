import { supabase } from "@/lib/supabaseClient";

export const createRoom = async (formData) => {
  try {
    const room_number = formData.get("room_number");
    const type = formData.get("type");
    const status = formData.get("status");
    const price_per_night = Number(formData.get("price_per_night"));
    const discount = Number(formData.get("discount") || 0);
    const description = formData.get("description");

    const images = formData.getAll("images");
    const imageUrls = [];

    for (const file of images) {
      if (!file || typeof file.name !== "string") continue;

      const fileExt = file.name.split(".").pop();
      const fileName = `${room_number}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("room_images")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("room_images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Insert room record
    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          room_number,
          type,
          status,
          price_per_night,
          discount,
          description,
          image_url: imageUrls,
        },
      ])
      .select();

    if (error) throw error;

    return data[0];
  } catch (err) {
    console.error("Error creating room:", err.message);
    throw new Error(err.message);
  }
};

export const getRooms = async () => {
  try {
    const rooms = await supabase.from("rooms").select("*");
    return rooms.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const getRoomByID = async (id) => {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteRoom = async (id) => {
  try {
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const updateRoom = async ({ id, formData }) => {
  try {
    const room_number = formData.get("room_number");
    const type = formData.get("type");
    const status = formData.get("status");
    const price_per_night = Number(formData.get("price_per_night"));
    const discount = Number(formData.get("discount") || 0);
    const description = formData.get("description");

    // Fetch existing room (keep old images if no new ones)
    const { data: existingRoom, error: fetchError } = await supabase
      .from("rooms")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    let imageUrls = existingRoom?.image_url || [];

    // Handle new images
    const images = formData.getAll("images");
    for (const file of images) {
      if (!file || typeof file.name !== "string") continue;

      const fileExt = file.name.split(".").pop();
      const fileName = `${room_number}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("room_images")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("room_images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Update record
    const { data: updatedData, error } = await supabase
      .from("rooms")
      .update({
        room_number,
        type,
        status,
        price_per_night,
        discount,
        description,
        image_url: imageUrls,
      })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return updatedData[0];
  } catch (err) {
    console.error("Error updating room:", err.message);
    throw new Error(err.message);
  }
};
