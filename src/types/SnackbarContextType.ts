export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarContextType {
    showSnackbar: (message: string, type?: SnackbarType) => void
}