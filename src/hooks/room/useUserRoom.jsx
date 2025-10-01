import { getUserReservation } from "@/api/reservation";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function useUserRoom() {
  const userid = useSelector((state) => state.user.user?.id);

  const {
    data,
    error: userroomerr,
    isLoading: userroomloading,
  } = useQuery({
    queryFn: () => getUserReservation(userid),
    queryKey: ["getUserReservation", userid],
    enabled: !!userid,
  });

  const userrooms = data?.filter((el) => el.status === "confirmed") || [];

  return { userrooms, userroomerr, userroomloading };
}
