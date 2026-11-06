---
title: "MCP-M019 -- First-Use Readiness Check"
description: "This scenario validates First-Use Readiness Check for `MCP-M019`. Objective: Verify the readiness check finds a missing ClickUp approval or browser login, asks for it, rechecks and only then writes."
version: 1.0.0.0
---

# MCP-M019 -- First-Use Readiness Check

---

## 1. OVERVIEW

Validates that **First-Use Readiness Check** behaves as `references/mcp-tools.md` describes. Tool names and parameters come from the hosted server's schema, captured on 2026-11-06.

### Why This Matters

A first-time user has to approve the ClickUp MCP once, and a doc page push also needs ClickUp logged in, in the browser the gap pass uses. Without the check, the push finds a missing login only when a write or the gap pass fails.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify the readiness check finds a missing ClickUp approval or browser login, asks for it, rechecks and only then writes
- **Real user request:** `Push this page to ClickUp.`
- **Prompt:** `Add a page named 'Readiness test' to document DOC_ID.`
- **Expected signals:** Before any write the agent runs the readiness program from `references/mcp-tools.md` section 3 and prints `mcp` and `browser`. With the manual deregistered it reports `mcp: "not-connected"` and asks the Ready or Skip question. After approval it rechecks and reads `mcp: "ok"`.
- **Desired user-visible outcome:** The agent asks one structured question per missing piece, writes only after the recheck passes, and names anything the user skipped.
- **Pass/fail:** PASS if no write happens before the check reads ready and every skip is named in the report; FAIL if a write runs first, the agent asks in free prose where a question tool exists, or it rechecks more than twice

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. A scratch document DOC_ID. Aside or Chrome open with ClickUp logged in.
1. Code Mode: `deregister_manual` for `clickup_official`, so the MCP reads as not connected
2. Send the prompt and confirm the agent runs the readiness program before any write
3. Pick **Ready** and approve the ClickUp tab within about a minute while `register_manual` waits
4. Confirm the recheck reads `mcp: "ok"` and a browser value, then that the page is created
5. Repeat once with **Skip the gap removal** and confirm the report names the gaps left

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M019 | First-Use Readiness Check | Verify the readiness check finds a missing ClickUp approval or browser login, asks for it, rechecks and only then writes | `Add a page named 'Readiness test' to document DOC_ID.` | 1. Code Mode: `deregister_manual` for `clickup_official`, so the MCP reads as not connected 2. Send the prompt and confirm the agent runs the readiness program before any write 3. Pick **Ready** and approve the ClickUp tab within about a minute while `register_manual` waits 4. Confirm the recheck reads `mcp: "ok"` and a browser value, then that the page is created 5. Repeat once with **Skip the gap removal** and confirm the report names the gaps left | Before any write the agent runs the readiness program from `references/mcp-tools.md` section 3 and prints `mcp` and `browser`. With the manual deregistered it reports `mcp: "not-connected"` and asks the Ready or Skip question. After approval it rechecks and reads `mcp: "ok"`. | Code Mode logs plus the questions the agent asked | PASS if no write happens before the check reads ready and every skip is named in the report; FAIL if a write runs first, the agent asks in free prose where a question tool exists, or it rechecks more than twice | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/create-doc-page.md`](../../feature-catalog/mcp-low-priority/create-doc-page.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference, readiness check and divider gap pass |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-documents/readiness-check.md`
