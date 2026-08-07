{
  "_note": "REPRESENTATIVE shape — VERIFY against a real obsidian-tables .table.md generated in-app before programmatic writes. Key names (columns/rows/views + per-column keys) are not schema-confirmed.",
  "columns": [
    { "name": "Task", "type": "text" },
    { "name": "Status", "type": "select", "options": ["Todo", "Doing", "Done"] },
    { "name": "Priority", "type": "number" },
    { "name": "Due Date", "type": "date" },
    { "name": "Owner", "type": "notelink" },
    { "name": "Overdue", "type": "formula", "formula": "{{ Due Date }} < today()" }
  ],
  "rows": [
    { "Task": "Draft spec", "Status": "Done", "Priority": 1, "Due Date": "2026-08-01", "Owner": "[[Michel]]" },
    { "Task": "Build CLI", "Status": "Doing", "Priority": 2, "Due Date": "2026-08-10", "Owner": "[[Michel]]" }
  ],
  "views": [
    { "name": "Sprint Board", "filters": [ { "column": "Status", "op": "!=", "value": "Done" } ], "sorts": [ { "column": "Priority", "dir": "asc" } ] }
  ]
}
