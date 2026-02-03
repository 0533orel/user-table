import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import styles from "./Dialog.module.css";
import type { DialogContextType } from "../../types/DialogContextType";



const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"confirm" | "prompt">("confirm"); 
  const [inputValue, setInputValue] = useState(""); 

  const resolveRef = useRef<(value: any) => void>(() => {});

  const showConfirm = useCallback((msg: string): Promise<boolean> => {
    setMessage(msg);
    setType("confirm");
    setIsOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const showPrompt = useCallback((msg: string): Promise<string | null> => {
    setMessage(msg);
    setType("prompt");
    setInputValue(""); 
    setIsOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (type === "confirm") {
      resolveRef.current(true);
    } else {
      resolveRef.current(inputValue); 
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (type === "confirm") {
      resolveRef.current(false);
    } else {
      resolveRef.current(null); 
    }
  };

  return (
    <DialogContext.Provider value={{ showConfirm, showPrompt }}>
      {children}

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p className={styles.message}>{message}</p>

            {type === "prompt" && (
              <input
                type="text"
                className={styles.promptInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                placeholder="הקלד כאן..."
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()} 
              />
            )}

            <div className={styles.buttons}>
              <button onClick={handleCancel} className={styles.cancelBtn}>
                ביטול
              </button>
              <button onClick={handleConfirm} className={styles.confirmBtn}>
                אישור
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
