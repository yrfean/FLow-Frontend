import { useEffect, useState } from "react";
import { useAllData } from "../Query/QueryAndMutation";

const useNotificaions = () => {
  const [notification, setNotification] = useState<any>();
  const { data } = useAllData();

  useEffect(() => {
    const myTotalMessages = data?.allMessages.filter(
      (msg: any) => msg.recieverId === data.user._id
    );
    const unSeenMessages = myTotalMessages?.filter(
      (msg: any) => msg.seen === false
    );
    if (unSeenMessages) setNotification(unSeenMessages);
  }, [data]);
  
  return { notification };
}; 

export default useNotificaions;
