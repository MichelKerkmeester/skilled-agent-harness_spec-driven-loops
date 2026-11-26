---
title: "ASD-019 -- Cookies + web storage read"
description: "This scenario validates Chrome-DevTools Application-panel parity for `ASD-019`: the page.context() cookie gap, page-visible cookie names, and localStorage/sessionStorage key reads via page.evaluate through the aside REPL, redacted, with a SKIP-valid path when no bound session exists."
version: 1.0.3.0
---

# ASD-019 -- Cookies + web storage read

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-019`.

---

## 1. OVERVIEW

This scenario was written to read cookies for the bound context via `page.context().cookies()` and to enumerate `localStorage`/`sessionStorage` keys via `page.evaluate`, the Application-panel parity path. On Aside 1.26.626.1517 `page.context` is not a function, so the context cookie read is a gap: the scenario records that the API is absent, reads only the cookie names the page itself can see through `document.cookie` (no HttpOnly cookies, no domains), and keeps the storage-key read. Values are redacted; only names/keys are logged.

### Why This Matters

Cookie and storage inspection is a common debugging need (`bdg network getCookies` analog). The Playwright context API would make it reachable, but Aside 1.26.626.1517 does not expose `page.context()`. Cookies and storage are also sensitive: the packet redacts values by default and never exposes saved-password values (confirmed online in `security.md`).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-019` and confirm the expected signals without contradictory evidence.

- Objective: On a tab opened in the same evaluation, record whether `page.context` exists, return the page-visible cookie names and the storage key lists, with no values in saved evidence.
- Real user request: `"What cookies and local storage does this page have?"`
- Prompt: `Read cookies and web-storage keys through the aside REPL on a bound tab, redacting values.`
- Expected execution process: one REPL evaluation that opens its own tab first, since a separate `aside repl` call starts with `page` null; API check, cookie names and storage keys read in that call.
- Expected signals: `contextApi` reported (not `"function"` on Aside 1.26.626.1517); a parseable `cookieNames` array; a parseable `{ local: [...], session: [...] }` key map.
- Desired user-visible outcome: Cookie names/domains and storage keys, values redacted, PASS verdict.
- Pass/fail: PASS when the output parses and the verdict states the context-cookie gap; SKIP (valid) with the blocker "no bound Aside session available"; FAIL if values are logged unredacted or the call errors against a bound tab.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read cookies and web-storage keys through the aside REPL on a bound tab, redacting values.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. If no bound session is available, SKIP with that blocker.
2. `bash:` open the tab, check the context API, read page-visible cookie names (redacted) + storage keys:
   `aside repl "await openTab('https://example.com'); const contextApi = typeof page.context; const st = await page.evaluate(() => ({ cookieNames: document.cookie.split('; ').filter(Boolean).map(c => c.split('=')[0]), local: Object.keys(localStorage), session: Object.keys(sessionStorage) })); console.log(JSON.stringify({ contextApi, cookieNames: st.cookieNames, storage: { local: st.local, session: st.session } }))" 2>&1`

### Expected

- Output parses to `{ contextApi, cookieNames: [...], storage: { local: [...], session: [...] } }` and carries no error line. For `example.com` the arrays may be empty (valid). On Aside 1.26.626.1517 `contextApi` is not `"function"`; the verdict states that context cookies (with domains and HttpOnly entries) are not readable this way. If a later version reports `"function"`, record it as version drift; the context cookie read can then be retried.
- Exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.

### Evidence

The REPL transcript and the parsed, redacted JSON. Never save cookie/storage VALUES.

### Pass / Fail

- **Pass**: the output parses; the verdict states the context-cookie gap; no values in evidence. The saved reason opens with `gap:` and names what was read, so a PASS row in the report index never reads as working cookie access.
- **Skip**: no bound session — documented blocker.
- **Fail**: values logged unredacted, or the call errors against a genuinely bound tab.

### Failure Triage

1. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
2. `page.context is not a function`: the call form still uses `page.context().cookies()`; that API is absent on Aside 1.26.626.1517, so use the check above and report the gap.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/devtools-parity/cookies-and-storage.md` | Capability leaf with the repl code patterns |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/aside-online-research-2026-07-17.md` | §5: saved passwords hidden from the agent |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/cookies-storage.md`
