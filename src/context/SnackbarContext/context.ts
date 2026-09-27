import { createContext } from "react";
import type { SnackbarContextType } from "../../types/SnackbarContextType";
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
