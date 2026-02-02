export interface ColumnTypes {
    id: string;
    title: string;
    type: 'text' | 'number'
    maxLength: number;
    isSystem: boolean;
}