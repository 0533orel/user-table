export interface DialogContextType {
  showConfirm: (message: string) => Promise<boolean>;
  showPrompt: (message: string) => Promise<string | null>; 
}
