# Reference — obsidian-flat-financing (Beancount personal finance)

> Destined for `mcp-tooling/mcp-obsidian/references/` at Phase 5. Operate this plugin at the **file layer**: edit the Beancount ledger the plugin reads; the plugin only renders it.

## 1. IDENTITY (verified)

| Field | Value |
|-------|-------|
| Repo | `pranjulsingh/obsidian-flat-financing` |
| License | MIT |
| Install | **BRAT** (recommended) or manual build (`npm install && npm run build`) — see `obsidian42-brat.md` |
| Community list | No (beta — install via BRAT) |
| Data format | **Beancount** plain-text double-entry ledger (`.beancount`) |

## 2. WHAT IT DOES

A personal-finance manager rendered over a plain-text **Beancount** file: dashboards (net worth, account distribution, income-vs-expense), goal tracking, entry modals, filtering by account wildcard / tag / date range, privacy mode (mask balances to `***`), CSV/Markdown export. It works entirely locally over your existing `.beancount` file.

## 3. DATA MODEL — the file the AI operates

The plugin reads/writes **one Beancount ledger file** (path set in settings). The AI adds accounts and transactions by appending valid Beancount directives to that file. Account tree: `Assets`, `Liabilities`, `Expenses`, `Income`, `Equity`.

**Open an account** (required before use):
```beancount
2026-01-01 open Assets:Bank:Checking USD
2026-01-01 open Expenses:Food:Groceries USD
```

**A transaction** (must balance to zero across postings):
```beancount
2026-08-02 * "Grocery Store" "Weekly shop" #reimbursable
  Expenses:Food:Groceries    42.50 USD
  Assets:Bank:Checking      -42.50 USD
```
- `*` = cleared, `!` = pending. Payee + narration are the two quoted strings.
- `#tag` and `^link` attach to the transaction (used by the plugin's tag filter, e.g. `#vacation`).
- Every posting is `Account  amount CUR`; the postings must sum to 0 (omit one amount to let Beancount infer it).

**Other common directives:** `balance` assertions, `price` entries, `; comments`.

## 4. SETTINGS (Settings → Obsidian Accounting)

- **Beancount File Path** — absolute path to the main `.beancount` file `VERIFY exact key`.
- **Currency Symbol** — default currency (USD/EUR/…).
- **Hide Balances** — global mask to `***`.

Settings persist at `.obsidian/plugins/<plugin-id>/data.json` `VERIFY plugin-id`.

## 5. IN-APP COMMANDS (context only — the mode does NOT drive the UI)

`Accounting: Open Dashboard` (ribbon graph icon) · `Accounting: Add Account` · `Accounting: Add Transaction` (ribbon "+"). The mode achieves the same outcomes by editing the ledger file directly.

## 6. FILE-LAYER RECIPES (via mcp-obsidian CLI/MCP)

- **Add account** → append an `open` directive to the ledger.
- **Add transaction** → append a balanced transaction block (see §3). Re-open/reload the dashboard to re-render.
- **Query** → read the ledger and grep by account (`Expenses:Food:*`), tag (`#vacation`), or date prefix (`2026-08`).
- **Report/export** → read the ledger; the AI can compute sums itself or use the plugin's CSV/Markdown export in-app.

## 7. GOTCHAS / VERIFY

- Postings MUST balance or Beancount (and the plugin) will flag the entry.
- `VERIFY` whether the plugin needs the account `open`ed before a transaction referencing it renders.
- `VERIFY` whether editing the ledger while the dashboard is open needs a manual reload (append is safe; the plugin re-reads on focus).

## Sources
- Repo README: https://github.com/pranjulsingh/obsidian-flat-financing
- Beancount language: https://beancount.github.io/docs/
