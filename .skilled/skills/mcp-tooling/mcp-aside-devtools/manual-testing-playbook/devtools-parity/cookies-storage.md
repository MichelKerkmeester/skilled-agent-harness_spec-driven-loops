---
title: "ASD-019 -- Cookies + web storage read"
description: "This scenario validates Chrome-DevTools Application-panel parity for `ASD-019`: page.context().cookies() and localStorage/sessionStorage key reads via page.evaluate through the aside REPL, redacted, with a SKIP-valid path when no bound session exists."
version: 1.0.0.0
---

# ASD-019 -- Cookies + web storage read

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-019`.

---

## 1. OVERVIEW

This scenario reads cookies for the bound context via `page.context().cookies()` and enumerates `localStorage`/`sessionStorage` keys via `page.evaluate` — the Application-panel parity path. Values are redacted; only names/keys are logged.

### Why This Matters

Cookie and storage inspection is a common debugging need (`bdg network getCookies` analog). The Playwright context API makes it reachable, but cookies and storage are sensitive: the packet redacts values by default and never exposes saved-password values (confirmed online in `security.md`).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-019` and confirm the expected signals without contradictory evidence.

- Objective: On a bound tab, return the cookie names+domains and the storage key lists — no values in saved evidence.
- Real user request: `"What cookies and local storage does this page have?"`
- Prompt: `Read cookies and web-storage keys through the aside REPL on a bound tab, redacting values.`
- Expected execution process: one persistent REPL context; cookies + storage read in one call.
- Expected signals: a parseable array of `{name, domain}` and a parseable `{ local: [...], session: [...] }` key map.
- Desired user-visible outcome: Cookie names/domains and storage keys, values redacted, PASS verdict.
- Pass/fail: PASS when both parse; SKIP (valid) with the blocker "no bound Aside session available"; FAIL if values are logged unredacted or the call errors against a bound tab.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read cookies and web-storage keys through the aside REPL on a bound tab, redacting values.`

### Commands

1. Precondition: a bound tab (ASD-006). If none, SKIP with that blocker.
2. `bash:` read cookies (redacted) + storage keys:
   `aside repl "const ck = await page.context().cookies(); const st = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })); console.log(JSON.stringify({ cookies: ck.map(c => ({ name: c.name, domain: c.domain })), storage: st }))" 2>&1`

### Expected

- Output parses to `{ cookies: [{name, domain}...], storage: { local: [...], session: [...] } }`. For `example.com` the cookie array may be empty (valid).

### Evidence

The REPL transcript and the parsed, redacted JSON. Never save cookie/storage VALUES.

### Pass / Fail

- **Pass**: both structures parse; no values in evidence.
- **Skip**: no bound session — documented blocker.
- **Fail**: values logged unredacted, or the call errors against a genuinely bound tab.

### Failure Triage

1. Binding error: cross-reference ASD-006/ASD-010.
2. `context()` undefined: record the exact call form; evaluate/context edge cases are a known vendor-changelog theme.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/cookies-and-storage.md` | Capability leaf with the repl code patterns |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md` | §5: saved passwords hidden from the agent |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/cookies-storage.md`
