import { useCallback, useState } from "react";
import { type UserRowTypes } from "../types/UserRowTypes";
import { type ColumnTypes } from "../types/ColumnTypes";
import { useSnackbar } from "../context/SnackbarContext/SnackbarContext";
import { useDialog } from "../context/DialogContext/DialogContext";

export const useTableManager = () => {
  const { showSnackbar } = useSnackbar();
  const { showConfirm } = useDialog();

  const [columns, setColumns] = useState<ColumnTypes[]>([
    {
      id: "name",
      title: "שם מלא",
      type: "text",
      maxLength: 20,
      isSystem: true,
      required: true,
    },
    {
      id: "phone",
      title: "מספר פלאפון",
      type: "number",
      maxLength: 10,
      isSystem: true,
      required: true,
    },
    {
      id: "idCard",
      title: "תעודת זהות",
      type: "number",
      maxLength: 9,
      isSystem: true,
      required: true,
    },
  ]);

  const [rows, setRows] = useState<UserRowTypes[]>([]);

  const addColumn = useCallback(
    (title: string) => {
      const exists = columns.some((col) => col.title === title);
      if (exists) {
        showSnackbar("שגיאה: קיימת כבר עמודה בשם זה!", "error");
        return;
      }

      if (title.length > 15) {
        showSnackbar("שגיאה: שם העמודה ארוך מדי (מקסימום 15 תווים)", "error");
        return;
      }

      const newCol: ColumnTypes = {
        id: `col_${Date.now()}`,
        title,
        type: "text",
        maxLength: 30,
        isSystem: false,
      };
      setColumns((prev) => [...prev, newCol]);
      showSnackbar("עמודה נוספה בהצלחה!", "success");
    },
    [columns, showSnackbar],
  );

  const updateColumnTitle = useCallback(
    (colId: string, newTitle: string) => {
      const col = columns.find((c) => c.id === colId);

      if (col?.isSystem) {
        showSnackbar("לא ניתן לשנות שם של עמודת מערכת", "error");
        return;
      }

      if (!newTitle.trim()) {
        showSnackbar("שם העמודה לא יכול להיות ריק!", "error");
        return;
      }

      setColumns((prevCols) => {
        const exists = prevCols.some(
          (c) => c.title === newTitle && c.id !== colId,
        );
        if (exists) {
          return prevCols;
        }

        return prevCols.map((col) =>
          col.id === colId ? { ...col, title: newTitle } : col,
        );
      });

      showSnackbar("שם עמודה עודכן בהצלחה!", "success");
    },
    [columns, showSnackbar],
  );

  const deleteColumn = useCallback(
    async (colId: string) => {
      const col = columns.find((c) => c.id === colId);

      if (col?.isSystem) {
        showSnackbar(
          "שגיאה: לא ניתן למחוק עמודות ברירת מחדל (System Columns)",
          "error",
        );
        return;
      }

      const isConfirmed = await showConfirm(
        "מחיקת עמודה תמחק את כל הנתונים הקשורים אליה. האם להמשיך?",
      );

      if (isConfirmed) {
        setColumns((prev) => prev.filter((c) => c.id !== colId));
        showSnackbar(`עמודה ${col?.title} נמחקה בהצלחה!`, "success");
      }
    },
    [columns, showSnackbar, showConfirm],
  );

  const addRow = useCallback(() => {
    const newRow: UserRowTypes = {
      id: `userl_${Date.now()}`,
      isSaved: false,
      data: {},
    };
    setRows((prev) => [...prev, newRow]);
  }, []);

  const editRow = useCallback((rowId: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, isSaved: false } : row)),
    );
  }, []);

  const saveRow = useCallback(
    (rowId: string) => {
      const row = rows.find((r) => r.id === rowId);
      if (!row) return;

      const missingField = columns.find(
        (col) =>
          col.required && (!row.data[col.id] || row.data[col.id].trim() === ""),
      );

      if (missingField) {
        showSnackbar(`חובה למלא ${missingField.title}!`, "error");
        return;
      }

      setRows((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, isSaved: true } : row)),
      );

      showSnackbar("המשתמש נשמר בהצלחה!", "success");
    },
    [rows, columns, showSnackbar], // חשוב: להוסיף את columns לתלויות
  );

  const updateCell = useCallback(
    (
      rowId: string,
      colId: string,
      value: string,
      type: "text" | "number",
      maxLength: number,
    ) => {
      if (value.length > maxLength) return;

      if (type === "number" && isNaN(Number(value)) && value !== "") return;

      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== rowId) return row;
          return {
            ...row,
            data: { ...row.data, [colId]: value },
          };
        }),
      );
    },
    [],
  );

  const deleteRow = useCallback(
    async (rowId: string) => {
      const isConfirmed = await showConfirm(
        "האם אתה בטוח שברצונך למחוק שורה זו?",
      );

      if (isConfirmed) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
        showSnackbar("המשתמש נמחק בהצלחה!", "success");
      }
    },
    [showConfirm, showSnackbar],
  );

  return {
    columns,
    rows,
    addColumn,
    addRow,
    updateCell,
    saveRow,
    editRow,
    deleteRow,
    updateColumnTitle,
    deleteColumn,
  };
};
