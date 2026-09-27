import { createContext } from "react";
import type { DialogContextType } from "../../types/DialogContextType";
export const DialogContext = createContext<DialogContextType | undefined>(undefined);
