import { useCallback, useState } from "react";
import { type UserRowTypes } from "../types/UserRowTypes";
import { type ColumnTypes } from "../types/ColumnTypes";

export const useTableManager = () => {
  const [columns, setColumns] = useState<ColumnTypes[]>([
    {
      id: "name",
      title: "שם מלא",
      type: "text",
      maxLength: 20,
      isSystem: true,
    },
    {
      id: "phone",
      title: "מספר פלאפון",
      type: "number",
      maxLength: 10,
      isSystem: true,
    },
    {
      id: "idCard",
      title: "תעודת זהות",
      type: "number",
      maxLength: 9,
      isSystem: true,
    },
  ]);

  const [rows, setRows] = useState<UserRowTypes[]>([]);

  const addColumn = useCallback(
    (title: string) => {
      const exists = columns.some((col) => col.title === title);
      if (exists) {
        alert("שגיאה: קיימת כבר עמודה בשם זה!");
        return;
      }

      if (title.length > 15) {
        alert("שגיאה: שם העמודה ארוך מדי (מקסימום 15 תווים)");
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
    },
    [columns],
  );

  const updateColumnTitle = useCallback((colId: string, newTitle: string) => {
    const col = columns.find((c) => c.id === colId);

    if (col?.isSystem) {
      alert("לא ניתן לשנות שם של עמודת מערכת");
      return;
    }

    if (!newTitle.trim()) {
      alert("שם העמודה לא יכול להיות ריק!");
      return;
    }

    setColumns((prevCols) => {
      const exists = prevCols.some(
        (c) => c.title === newTitle && c.id !== colId,
      );
      if (exists) {
        alert("כבר קיימת עמודה בשם זה!");
        return prevCols;
      }

      return prevCols.map((col) =>
        col.id === colId ? { ...col, title: newTitle } : col,
      );
    });
  }, []);

  const deleteColumn = useCallback(
    (colId: string) => {
      const col = columns.find((c) => c.id === colId);

      if (col?.isSystem) {
        alert("שגיאה: לא ניתן למחוק עמודות ברירת מחדל (System Columns)");
        return;
      }
      if (
        window.confirm(
          "מחיקת עמודה תמחק את כל הנתונים הקשורים אליה. האם להמשיך?",
        )
      ) {
        setColumns((prev) => prev.filter((c) => c.id !== colId));
      }
    },
    [columns.length],
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
      if (row && !row.data["name"]) {
        alert("חובה למלא שם מלא!");
        return;
      }
      setRows((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, isSaved: true } : row)),
      );
    },
    [rows],
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

  const deleteRow = useCallback((rowId: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק שורה זו?")) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
    }
  }, []);

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
