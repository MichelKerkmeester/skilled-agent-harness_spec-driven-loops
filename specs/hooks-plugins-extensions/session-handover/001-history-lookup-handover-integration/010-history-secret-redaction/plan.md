---
title: "Implementation Plan: Phase 10: history-secret-redaction"
description: "Redact every adapter entry once, inside createHistoryLookup and before projection, using the spec-kit shared secret scrubber plus three shapes it lacks. Every lookup operation then reads redacted text, so search, bounds and page offsets agree with what a caller receives."
trigger_phrases:
  - "history secret redaction plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: history-secret-redaction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js ESM |
| **Framework** | None |
| **Storage** | None. The lookup is read-only. |
| **Testing** | vitest for the engine and hooks tree, `node --test` for the session readers and the handover CLI |

### Overview
`createHistoryLookup` is the single entry every adapter and the CLI call. It now maps each entry to a redacted copy before `projectHistoryEntries`, so no route reaches the original strings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm --prefix .skilled/hooks/session-handover/history test` prints `Tests  144 passed (144)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Redact at intake. One pure transform runs before projection, and everything downstream is unchanged.

### Key Components
- **`redactHistoryEntries` in `core.ts`**: copies each entry with its text, thinking and tool-call arguments redacted. Ids, tool names, ordering and image bytes stay untouched.
- **`scrubSecrets` from the shared scrubber**: vendor keys, tokens, JWTs, bearer values, private keys and `key=value` credentials.
- **Two local patterns and a key check**: a URL password, a non-bearer `Authorization` value with a digit or mixed case, and an argument under a credential name such as `password`.

### Data Flow
The adapter reads its store and builds `HistoryEntry[]`. `createHistoryLookup` redacts the entries, projects them and builds the navigator. Search, browse, load and page then read the redacted items, and the byte bound measures the same text the caller receives.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces the leak with `scratch/repro-secret-leak.mjs` and records the engine baseline of 140. Implementation adds intake redaction to `core.ts` and the redaction suite. Verification reruns the repro, the four suites, the typecheck, the build and one CLI run over a stored-locator fixture. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A negative control backs the suite: with the intake call removed, three of the four redaction cases fail. The fourth guards ordinary text and paging exclusion, so it passes either way by design.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The engine imports the shared scrubber's build by relative path, the same way `cli.ts` imports the runtime build. `cli.ts` is not edited, so the parallel work in worktree 420 on that file is unaffected.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one function call, its helpers, one test file and one README bullet, and nothing is stored.
<!-- /ANCHOR:rollback -->

---
