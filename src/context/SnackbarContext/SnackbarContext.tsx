import { SnackbarContext } from "./context";
import React, { useState, useCallback } from "react";
import type {
  SnackbarType,
} from "../../types/SnackbarContextType";
import styles from "./Snackbar.module.css";


export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");

  const showSnackbar = useCallback(
    (msg: string, msgType: SnackbarType = "info") => {
      setMessage(msg);
      setType(msgType);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    },
    [],
 );
  
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {show && (
        <div className={`${styles.snackbar} ${styles[type]}`}>
            {message}
        </div>
      )}
    </SnackbarContext.Provider>
    );
};
