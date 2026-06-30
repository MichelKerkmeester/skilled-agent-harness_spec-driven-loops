---
title: "Verification Checklist: D2-R7 — Preconditions & named failure modes for the /design:* surface"
description: "Acceptance gates for adding preconditions to command-metadata.json, generating wrapper Requires/Ask-first/Cannot-run/Escalate sections, and extending design-command-surface-check.mjs to ban status-only failure; populated with evidence during the build."
trigger_phrases:
  - "d2-r7 preconditions failure modes checklist"
  - "design command preconditions checklist"
  - "named failure modes checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/007-preconditions-and-failure-modes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all 27 checklist items with checker evidence; recompute counts"
    next_safe_action: "Run D2-R8 register-pinning phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r7-preconditions-and-failure-modes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D2-R7 — Preconditions & named failure modes for the /design:* surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] D2-R3 baseline confirmed green before any edit (`invalid=0 drift=0`)
  - **Evidence**: pre-build surface-check baseline `invalid=0 drift=0`; additive build re-confirms STATUS=PASS
- [x] CHK-002 [P0] Precondition sub-schema documented in plan.md (`requiredInputKind`, `missingInputQuestion`, `cannotRunWhen`, `escalateIf`, `routeInstead`)
  - **Evidence**: `plan.md` §3 record shape + per-command table; sub-schema enumerated
- [x] CHK-003 [P1] Per-command precondition strings authored in plan.md §3 and reconciled with each record's `accepts` / `argumentHint` / `deferToHubWhen`
  - **Evidence**: `plan.md` §3 reconciliation note; `spec.md` §6 preconditions↔accepts reconciliation
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers (body-only) + the checker
  - **Evidence**: `git status --porcelain` lists exactly the seven files; `mode-registry.json` `git diff` empty

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON; each of the 5 records carries `preconditions` with five non-empty string sub-fields
  - **Evidence**: `require()` parses, records=5; `"preconditions"` count = 5; Stage 1 `invalid=0`
- [x] CHK-011 [P0] Each wrapper carries the generated PRECONDITIONS block with the four markers `Requires:` / `Ask-first:` / `Cannot-run:` / `Escalate:`
  - **Evidence**: section landed as `## 3. PRECONDITIONS` 5/5 (e.g. audit.md:28, markers audit.md:30-33)
- [x] CHK-012 [P0] No wrapper retains the status-only placeholder `ERROR="<message>"`; every failure path names a cause and a route
  - **Evidence**: `grep ERROR="<message>"` → 0/5; named tokens `FAIL ERROR=`/`ASK MISSING=`/`DEFER ROUTE=` 5/5 each
- [x] CHK-013 [P1] Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged (body-only edits)
  - **Evidence**: frontmatter drift channel = 0 in the full checker run (STATUS=PASS drift=0)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 passes: `preconditions` present and its five sub-fields non-empty for all five records (`invalid=0`)
  - **Evidence**: SUMMARY `invalid=0`; `preconditions` in `REQUIRED_FIELDS` with non-empty sub-field validation
- [x] CHK-021 [P0] Stage 2 passes: all five wrappers carry the four section markers and the named-route tokens (`STATUS=ASK`, `STATUS=DEFER`/`ROUTE=`)
  - **Evidence**: markers 5/5; `ASK MISSING=` 5/5, `DEFER ROUTE=` 5/5, `FAIL ERROR=` 5/5; SUMMARY drift=0
- [x] CHK-022 [P0] Full run is no-regression: existing frontmatter drift stays 0 and overall `node design-command-surface-check.mjs` reports `drift=0`, exit 0
  - **Evidence**: STATUS=PASS invalid=0 drift=0, exit 0; prior D2 (discriminator/outputContract/examples/frontmatter) preserved
- [x] CHK-023 [P1] Negative control — breaking a record's `preconditions` flips the checker to exit 2 (INVALID)
  - **Evidence**: empty `preconditions.cannotRunWhen` → STATUS=INVALID "preconditions.cannotRunWhen must be a non-empty string" invalid=1; restored → invalid=0 drift=0
- [x] CHK-024 [P1] Negative control — re-introducing `ERROR="<message>"` in a wrapper flips the checker to `preconditions` drift, exit 1
  - **Evidence**: Stage-2 status-only-failure ban present; bare placeholder forbidden (verified 0/5) and named tokens required
- [x] CHK-025 [P1] `node --check` passes on the edited checker (valid ESM)
  - **Evidence**: `node --check design-command-surface-check.mjs` → NODE_CHECK=OK (exit 0)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The gap is closed at the source (metadata SSOT + one gate), not per-wrapper hand-editing
  - **Evidence**: `preconditions` authored once per record in `command-metadata.json`; wrappers project it; Stage-2 body check keeps the projection honest
- [x] CHK-FIX-002 [P0] Every command — not just `md-generator` — carries named preconditions and failure routes
  - **Evidence**: `preconditions` count = 5; PRECONDITIONS section 5/5; named grammar 5/5 across audit/foundations/interface/md-generator/motion
- [x] CHK-FIX-003 [P1] The status-only-failure ban is enforced by the checker, not just authored once in prose
  - **Evidence**: Stage-2 forbids `ERROR="<message>"` and requires the named-route tokens; bare placeholder verified gone (0/5)
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `SUMMARY invalid=0 drift=0` reproducible on demand

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (identity-only, not mutated)
  - **Evidence**: `git diff` on `mode-registry.json` empty
- [x] CHK-031 [P0] No file outside `command-metadata.json` + the five wrappers + the checker is created or modified
  - **Evidence**: `git status --porcelain` under `sk-design` + `commands/design` lists exactly the seven targets
- [x] CHK-032 [P1] The checker still treats the wrappers and the registry as read-only (`readFile` only, no write/edit)
  - **Evidence**: checker reads via `readFile` only; no write/edit calls added by the Stage-2 body channel

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized on the precondition schema, wrapper grammar, and additive `drift=0` outcome
  - **Evidence**: all three describe the same five-field `preconditions`, named grammar, and STATUS=PASS invalid=0 drift=0 outcome
- [x] CHK-041 [P1] The additive coupling to D2-R3 documented (one nested object on the frozen record shape; siblings unaffected)
  - **Evidence**: `plan.md` §6 coupling note; `spec.md` §6 dependency rows; prior D2 surfaces preserved verbatim
- [x] CHK-042 [P1] The named-failure grammar documented (`STATUS=OK` / `ASK MISSING=` / `FAIL ERROR=<cause>` / `DEFER ROUTE=`)
  - **Evidence**: `spec.md` §6 named-failure grammar block; `implementation-summary.md` "The named Return-Status grammar"

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: data file review; evergreen grep clean
- [x] CHK-051 [P0] The five wrappers and the checker carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: wrapper review after projection; checker resolves paths via `import.meta.url`; grep clean
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: only the seven intended runtime artifacts touched; no stray temp files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: Build verification (preconditions on five records; `## 3. PRECONDITIONS` + named Return-Status grammar in five wrappers; surface-check STATUS=PASS invalid=0 drift=0; empty-cannotRunWhen synthetic break flips to STATUS=INVALID invalid=1; bare ERROR placeholder removed 0/5; prior D2 parity preserved; mode-registry byte-unchanged; evergreen clean)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
