import {useCallback, useState} from "react";
import { ref, getDatabase, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";
import {ICalculatedMarks, Status} from "../../models";

const useFetchBallistics = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [ballistics, setValue] = useState<ICalculatedMarks | null>(null);
  const [error, setError] = useState<any | null>(null);

  const getBallistics = useCallback(() => {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus(Status.Pending);
    try {
      const dbRef = ref(db, "users/" + userId + "/ballistics");
      onValue(dbRef, (snapshot) => {
        const { calculation_result } = snapshot.val();
        console.log("DATA: ", calculation_result)
        setValue(calculation_result);
        setStatus(Status.Idle);
      })
    } catch (e) {
      setError(e);
      setStatus(Status.Idle);
    }
  }, []);

  return {
    status,
    ballistics,
    error,
    getBallistics,
  };
};

export default useFetchBallistics;
