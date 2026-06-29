---
title: "Verification Checklist: D2-R12 — Promote high-value task verbs as command-visible projections"
description: "Acceptance gates for adding taskProjections to command-metadata.json, generating the wrapper Task Projections section, and extending design-command-surface-check.mjs with a projection validator, mode-registry alias reconciliation, and a command-creep negative corpus; populated with evidence during the build."
trigger_phrases:
  - "d2-r12 promote task verbs checklist"
  - "design command task projections checklist"
  - "transform verbs command surface checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/012-promote-task-verbs"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all CHK items [x] with evidence; P0 20/20, P1 15/15; checker PASS"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r12-promote-task-verbs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All six synthetic-break negative controls fire (four exit 2, two exit 1); restore returns to PASS"
---
# Verification Checklist: D2-R12 — Promote high-value task verbs as command-visible projections

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

- [x] CHK-001 [P0] D2-R7 baseline confirmed green before any edit (`invalid=0 drift=0`)
  - **Evidence**: additive baseline confirmed; final `node design-command-surface-check.mjs` still `STATUS=PASS invalid=0 drift=0`, exit 0
- [x] CHK-002 [P0] Verb→ownerMode mapping documented in plan.md §3 (foundations: typeset, colorize · interface: bolder, quieter, distill, delight · audit: harden, polish); each verb traces to spec.md §2
  - **Evidence**: plan.md §3 mapping table; live metadata matches: audit=[harden,polish], foundations=[typeset,colorize], interface=[bolder,quieter,distill,delight]
- [x] CHK-003 [P0] Each `referenceSources` anchor confirmed to exist in the skill tree via Read (no fabricated or not-yet-built path such as `transform_application.md`)
  - **Evidence**: implementer Read each anchor before pinning; `transform_application.md` deliberately not cited (not yet built); the buried-verb source `transform_remediation.md` used
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers (append-only body) + the checker
  - **Evidence**: `git status` shows exactly 7 changed live files (metadata, 5 wrappers, checker); nothing else

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON; each of the 5 records carries `taskProjections` (array; empty for `motion`/`md-generator`)
  - **Evidence**: `node` JSON parse OK, 5 records; all carry `taskProjections`; motion=[], md-generator=[]
- [x] CHK-011 [P0] Each of the eight projection entries carries `verb`, `ownerMode` (= record's ownerMode), `strictness: "advisory"`, non-empty `referenceSources`, non-empty `requires`, non-empty `fixtures`
  - **Evidence**: Stage 1 `validateTaskProjections` green (`invalid=0`); all 8 entries carry the six fields with `strictness: "advisory"`
- [x] CHK-012 [P0] Each wrapper carries the generated `## TASK PROJECTIONS` block (owned verbs or empty notice) with the `Negative corpus:` guard line
  - **Evidence**: section present in all five wrappers (audit:91, foundations:91, interface:104, md-generator:93, motion:91) + `Negative corpus:` guard line each
- [x] CHK-013 [P1] Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged (append-only body edits)
  - **Evidence**: body-only appends; checker frontmatter `drift=0` on all five wrappers

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 passes: `taskProjections` present on all five records; each entry's six fields valid; `strictness` is `"advisory"` (`invalid=0`)
  - **Evidence**: `STATUS=PASS ... invalid=0`; `validateTaskProjections` green
- [x] CHK-021 [P0] The eight verbs are globally unique and each `ownerMode` equals the record's `ownerMode` (∈ workflowModes)
  - **Evidence**: 8 verbs each appear once; ownerMode parity enforced (checker:468-476); workflowModes = audit,foundations,interface,md-generator,motion
- [x] CHK-022 [P0] Command-creep rejected: no `/design:<verb>` exists; the checker rejects minting one (negative corpus)
  - **Evidence**: command-creep branch at checker:462 ("must not be minted as"); isolated-copy mint of `/design:harden` → `STATUS=INVALID` exit 2
- [x] CHK-023 [P0] Alias reconciliation passes: no projected verb collides with another mode's `mode-registry.json` aliases
  - **Evidence**: `validateTaskProjectionAliasCollisions` at checker:500-514 reads registry aliases; full run `invalid=0` (no collision)
- [x] CHK-024 [P0] Stage 2 passes: every wrapper carries the `## TASK PROJECTIONS` section, its owned verb tokens, and the guard marker
  - **Evidence**: `drift=0`; Stage-2 body rule (checker:1031-1075) green across all five wrappers
- [x] CHK-025 [P0] Full run is no-regression: existing frontmatter/example/discriminator/precondition drift stays 0 and overall `node design-command-surface-check.mjs` reports `drift=0`, exit 0
  - **Evidence**: `STATUS=PASS invalid=0 drift=0`, exit 0; prior D2 fields (argumentHint/examples/outputContract/discriminator/preconditions/toolPolicy) green
- [x] CHK-026 [P1] Synthetic break — mint `/design:harden` record → checker exits 2 (INVALID)
  - **Evidence**: isolated-copy run: minting `/design:harden` → `STATUS=INVALID` exit 2; restore → PASS
- [x] CHK-027 [P1] Synthetic break — verb→ownerMode mismatch → checker exits 2 (INVALID)
  - **Evidence**: isolated-copy run: `taskProjections[0].ownerMode must match record ownerMode audit`, exit 2; restore → PASS
- [x] CHK-028 [P1] Synthetic break — `strictness: "enforceable"` → checker exits 2 (INVALID)
  - **Evidence**: isolated-copy run: `taskProjections[0].strictness must be one of advisory`, exit 2; restore → PASS
- [x] CHK-029 [P1] Synthetic break — duplicate verb across two records → checker exits 2 (INVALID)
  - **Evidence**: isolated-copy run: `taskProjections[4].verb harden is already owned by /design:audit`, exit 2; orchestrator confirmed the same gate for `typeset`; restore → PASS
- [x] CHK-030 [P1] Synthetic break — removed verb token in a wrapper → checker reports `taskProjections` drift, exit 1
  - **Evidence**: isolated-copy run: `DRIFT kind=taskProjections /design:audit expected="harden" actual="<missing projection verb>"`, exit 1; restore → PASS
- [x] CHK-031 [P1] Synthetic break — removed `Negative corpus:` guard line → checker reports drift, exit 1
  - **Evidence**: isolated-copy run: `DRIFT kind=taskProjections expected="Negative corpus:" actual="<missing negative corpus marker>"`, exit 1; restore → PASS
- [x] CHK-032 [P1] `node --check` passes on the edited checker (valid ESM)
  - **Evidence**: `node --check` OK (orchestrator-verified)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All eight spec verbs are promoted as task projections; none is left buried in references/aliases only
  - **Evidence**: all 8 (typeset, colorize, bolder, quieter, distill, delight, harden, polish) present as `taskProjections` entries across audit/foundations/interface
- [x] CHK-FIX-002 [P0] The gap is closed at the source (metadata SSOT + one gate), not per-wrapper hand-editing; the verbs are projections, NOT new modes and NOT new commands
  - **Evidence**: verbs live in `command-metadata.json` taskProjections; wrappers project them; command-creep guard bars any `/design:<verb>` command
- [x] CHK-FIX-003 [P0] The call stays advisory — `strictness` is enforced to `"advisory"` by the checker, so a non-advisory projection is rejected
  - **Evidence**: closed enum `{"advisory"}` at checker:89,480-481; isolated-copy `enforceable` break → exit 2
- [x] CHK-FIX-004 [P1] The command-creep ban is enforced by the checker (negative corpus), not just authored once in prose
  - **Evidence**: command-creep branch at checker:462; isolated-copy mint → INVALID exit 2
- [x] CHK-FIX-005 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `SUMMARY invalid=0 drift=0`, exit 0; deterministic, re-runnable

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] `mode-registry.json` is byte-unchanged (read-only for reconciliation, not mutated)
  - **Evidence**: `git diff --stat` on `mode-registry.json` is empty (byte-unchanged)
- [x] CHK-041 [P0] No file outside `command-metadata.json` + the five wrappers + the checker is created or modified
  - **Evidence**: `git status` shows exactly 7 changed live files: metadata, 5 wrappers, checker
- [x] CHK-042 [P1] The checker still treats the wrappers and the registry as read-only (`readFile` only, no write/edit)
  - **Evidence**: checker imports only `readFile` from `node:fs/promises` (checker:5); no write/edit calls
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] plan.md / tasks.md / checklist.md synchronized on the projection schema, wrapper section, registry reconciliation, and additive `invalid=0 drift=0` outcome
  - **Evidence**: plan/tasks/checklist all describe the six-field schema, the wrapper section, alias reconciliation, and the `invalid=0 drift=0` outcome
- [x] CHK-051 [P1] The additive coupling to D2-R3/D2-R7 documented (one array field on the frozen record shape; siblings unaffected)
  - **Evidence**: spec §6 + plan §6 document the one-array-field widening of the D2-R3 record; prior D2 fields preserved, siblings unaffected
- [x] CHK-052 [P1] The verb-set reconciliation documented (spec's eight transform verbs are sub-mode projections; the brief's `audit/design/animate/extract` are mode-level and out of scope)
  - **Evidence**: spec §3 Out of Scope + plan §1 "Verb-set reconciliation" both record the mode-level verbs as out of scope

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths; `referenceSources` are durable skill source anchors only (evergreen [HARD])
  - **Evidence**: evergreen clean (orchestrator-verified); `referenceSources` are durable skill source anchors only
- [x] CHK-061 [P0] The five wrappers and the checker carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: evergreen clean (orchestrator-verified); no IDs/paths embedded in wrappers or checker
- [x] CHK-062 [P1] No temp files created outside `scratch/`
  - **Evidence**: synthetic-break copies run under the session scratchpad mirror only; no temp files in the repo
<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: claude-opus-4-8 (orchestrator-verified gate evidence + isolated-copy negative controls)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
