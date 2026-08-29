---
title: "Tasks: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute"
description: "Ordered task list for removing 7 bare devin Grok ids from executor allowlists, test fixture, and cli-devin skill docs while preserving all cursor-grok-* entries."
trigger_phrases:
  - "grok devin removal tasks"
  - "drop grok devin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture pre-edit baseline cursor-grok-4.6 counts — `rg -c 'cursor-grok-4\.6'` → fanout-run.cjs:8, executor-config.ts:8
- [x] T002 Grep all in-scope files for bare grok-4-[56]- hits — `rg -n 'grok-4-[56]-'` identified 29 hits across 7 files before editing
- [x] T003 [P] Read all 7 in-scope files before editing — executor-config.ts:364, fanout-run.cjs:2003, fanout-run.vitest.ts:1361 read before any edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove 7 bare Grok ids from `executor-config.ts` `DEVIN_SUPPORTED_MODELS` (executor-config.ts:364-370)
- [x] T005 Remove 7 bare Grok ids from `fanout-run.cjs` `DEVIN_ALLOWED_MODELS` (fanout-run.cjs:2003-2009)
- [x] T006 Remove 7 bare Grok ids from `fanout-run.vitest.ts` allowlist fixture (fanout-run.vitest.ts:1361-1362)
- [x] T007 Remove 7 Grok table rows and update notes/family-count in `providers-and-models.md`
- [x] T008 Remove Grok from model-resolution table, curated family list, selection strategy, and rule 7 in `SKILL.md`
- [x] T009 Update FAQ model recommendation in `README.md`
- [x] T010 Remove/replace all Grok references in `cli-reference.md` (usage examples, selection table, env var, reasoning-effort prose)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `npx vitest run` → 112 tests pass, exit 0
- [x] T012 Confirm cursor-grok-4.6 counts unchanged — `rg -c 'cursor-grok-4\.6'` → fanout-run.cjs:8, executor-config.ts:8 (8/8 unchanged)
- [x] T013 Confirm no bare devin Grok ids remain — `rg -n 'grok-4-[56]-'` on in-scope files returns only changelog/ hits (0 hits in runtime or skill docs)
- [x] T014 Fill all spec packet docs — spec.md:14, plan.md:14, tasks.md:14, acceptance-criteria.md:28, implementation-summary.md:28 all filled with real content
- [x] T015 Run `validate.sh --strict` → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — 5 REQ rows filled with real evidence
- [x] CHK-002 [P0] Technical approach defined in plan.md — architecture and affected surfaces filled
- [x] CHK-003 [P1] Dependencies identified — Vitest 4.1.x only; no external deps
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No TypeScript or CJS syntax changes — only array element removals; tsc/lint not impacted
- [x] CHK-011 [P0] 112 vitest tests pass, exit 0, no warnings
- [x] CHK-012 [P1] No new error handling needed — this is a removal, not an addition
- [x] CHK-013 [P1] Edits match existing array and table style in each file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — see acceptance-criteria.md AC-001 through AC-005
- [x] CHK-021 [P0] Manual testing complete — grep probes and vitest run confirmed
- [x] CHK-022 [P1] Edge case: cursor-grok entries verified unchanged (count = 8/8)
- [x] CHK-023 [P1] Edge case: changelog files intentionally untouched (historical record)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — same 7 Grok ids appeared in 2 runtime allowlists, 1 test fixture, and 4 doc files.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg 'grok-4-[56]-'` across all in-scope files identified every occurrence before editing.
- [x] CHK-FIX-003 [P0] Consumer inventory: allowlist arrays, test fixture, and all doc references updated together in one session.
- [x] CHK-FIX-004 [P0] N/A — not a security/path/parser/redaction fix; no adversarial table required.
- [x] CHK-FIX-005 [P1] Matrix axes: (file) × (bare-grok / cursor-grok / other) — all cells verified.
- [x] CHK-FIX-006 [P1] N/A — no process-wide state; tests use temp dirs and stub binaries.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit line numbers from pre-edit grep output (executor-config.ts:364-370, fanout-run.cjs:2003-2009, fanout-run.vitest.ts:1361-1362).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — only model id strings removed
- [x] CHK-031 [P0] No input validation changes — allowlist enforcement is unchanged; invalid ids still rejected
- [x] CHK-032 [P1] No auth/authz changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all filled
- [x] CHK-041 [P1] No inline code comments changed — only array data and doc prose
- [x] CHK-042 [P2] cli-devin README.md updated (FAQ answer updated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created
- [x] CHK-051 [P1] scratch/ empty; nothing to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---



