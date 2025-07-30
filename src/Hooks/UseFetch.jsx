import React, { useEffect, useState } from "react";
import { db } from "../libs/firebase";
import { onSnapshot, QuerySnapshot } from "firebase/firestore";

function UseFetch(url) {
  const [loadedData, setLoadedData] = useState([]);
  const [ispending, setIspending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIspending(true);
      try {
        const ref = collection(db, url);
        onSnapshot(ref, (QuerySnapshot) => {
          let arr = [];
          QuerySnapshot.forEach((doc) => {
            arr.push({ id: doc.id, ...doc.data() });
          });
          setLoadedData(arr);
          setIspending(falase);
          setError(null);
        });
      } catch (error) {
        setError(`${error} Could not fetch Data`);
        ispending(false);
      }
    };
  }, []);

  return { ispending, error, loadedData };
}

export default UseFetch;
