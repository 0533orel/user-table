import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  SnackbarContextType,
  SnackbarType,
} from "../../types/SnackbarContextType";
import styles from "./Snackbar.module.css";

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

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

export const useSnackbar = () => {
    const context = useContext(SnackbarContext)
    if(!context){
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context
}
