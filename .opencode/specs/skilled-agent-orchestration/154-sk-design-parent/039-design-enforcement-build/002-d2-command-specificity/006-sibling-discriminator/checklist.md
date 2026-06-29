---
title: "Verification Checklist: D2-R6 — sibling discriminator + deferToHubWhen at the command layer"
description: "Acceptance gates for the discriminator block, the generated wrapper sections, and the extended design-command-surface-check.mjs; populated with evidence during the build."
trigger_phrases:
  - "d2-r6 sibling discriminator checklist"
  - "design command discriminator checklist"
  - "deferToHubWhen command layer checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/006-sibling-discriminator"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all 29 checklist items with evidence and recompute counts"
    next_safe_action: "Run D2-R7 preconditions-and-failure-modes phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r6-sibling-discriminator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D2-R6 — sibling discriminator + deferToHubWhen at the command layer

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

- [x] CHK-001 [P0] Discriminator shape documented in plan.md (`whenToUse`, `preferSiblingWhen[]`, `pairWithHubWhen`, `sequence`)
  - **Evidence**: `plan.md` §3 data shape + matrix
- [x] CHK-002 [P0] The five `workflowMode` keys enumerated from `mode-registry.json` as the sibling allow-set
  - **Evidence**: checker reports `workflowModes=audit,foundations,interface,md-generator,motion`
- [x] CHK-003 [P1] Per-command discriminator lines derived from the child `Use when` / `When NOT to Use` blocks, provenance recorded
  - **Evidence**: `plan.md` §3 matrix marks each line `explicit` or `boundary`
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers + the checker; `mode-registry.json` read-only
  - **Evidence**: `git status` lists exactly the seven files; registry `git diff` empty

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses; all 5 records carry a well-formed `discriminator`
  - **Evidence**: checker Stage 1 `invalid=0`; `node -e require()` parses, records=5
- [x] CHK-011 [P0] Checker still resolves all paths via `import.meta.url` — no hardcoded absolute or spec paths after the edit
  - **Evidence**: source review of the extended checker; evergreen grep clean
- [x] CHK-012 [P1] Checker remains stateless/deterministic (sorted output, no timestamps, no `/tmp` state)
  - **Evidence**: two `--json` runs byte-identical; drift sorted via `compareDrift`
- [x] CHK-013 [P1] `node --check design-command-surface-check.mjs` passes (checker was edited)
  - **Evidence**: `node --check` exit 0 (NODE_CHECK=OK)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each command carries a sibling discriminator per the spec (whenToUse + 4 sibling lines + hub line)
  - **Evidence**: discriminator-presence channel `kind=discriminator` drift=0 across 5 wrappers; e.g. interface.md:17-26
- [x] CHK-021 [P0] `pairWithHubWhen === deferToHubWhen` on every record (hub choice reconciled with metadata)
  - **Evidence**: Stage 1 reconciliation passes; independent node check hub_eq_defer=true on all five
- [x] CHK-022 [P0] `preferSiblingWhen` covers exactly the other four `/design:*` commands per record (full per-pair matrix); each sibling ∈ registry workflowModes
  - **Evidence**: Stage 1 rule 4 passes; sibling set = the other four per record
- [x] CHK-023 [P1] `sequence.typicallyBefore ⊆ next`; no self-reference; all entries real `/design:*` commands
  - **Evidence**: Stage 1 sequence rule passes; seqBefore ⊆ next verified per record
- [x] CHK-024 [P0] `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0`
  - **Evidence**: STATUS=PASS invalid=0 drift=0
- [x] CHK-025 [P0] No-regression: the frontmatter drift channel stays 0 (`description` / `argument-hint` / `aliases` / `allowed-tools`)
  - **Evidence**: `kind=frontmatter` drift=0 (matches the pre-D2-R6 baseline `drift=0`)
- [x] CHK-026 [P1] Exit-code contract preserved (0 = pass / 1 = drift / 2 = invalid metadata or usage error)
  - **Evidence**: self-sibling synthetic break → STATUS=INVALID; restoring → invalid=0 drift=0

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding fixed at the source: discriminator authored once in the SSOT, projected to wrappers — not hand-patched per wrapper
  - **Evidence**: wrapper sections mirror `command-metadata.json`; body-presence check passes
- [x] CHK-FIX-002 [P0] Per-pair "right sibling / right hub" choice is deterministically gated on the named targets
  - **Evidence**: rule 4 (full sibling coverage) + rule 3 (hub binding) enforced by the checker; scope decision recorded in `plan.md` §3
- [x] CHK-FIX-003 [P1] Spec's "per-pair replay fixtures" reconciliation recorded as a flagged open decision (D3 router-replay is a different dimension / not a named target here)
  - **Evidence**: `plan.md` §3 scope decision + `spec.md` §10 Open Questions + frontmatter `open_questions`
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report, not a moving measurement
  - **Evidence**: `SUMMARY invalid=0 drift=0` reproducible on demand

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (read-only, not mutated)
  - **Evidence**: `git diff --stat` shows no change
- [x] CHK-031 [P0] No file outside the seven intended runtime targets is created or modified
  - **Evidence**: `git status --porcelain` lists only `command-metadata.json`, the checker, and the five wrappers
- [x] CHK-032 [P1] Checker treats the wrappers and the registry as read-only (no write/edit calls)
  - **Evidence**: checker uses `readFile` only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized
  - **Evidence**: all three describe the same discriminator shape, reconciliation rules, and no-regression invariant
- [x] CHK-041 [P1] Wording stays advisory; the checker enforces presence + reconciliation only (documented)
  - **Evidence**: `plan.md` §3 states wording is not diffed
- [x] CHK-042 [P1] Transport routing (figma / open-design / chrome-devtools) explicitly excluded from the command-layer sibling set
  - **Evidence**: `plan.md` §3 + `spec.md` §3 out-of-scope note

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: data file review; grep clean
- [x] CHK-051 [P0] The five wrappers carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: wrapper review after generation; grep clean
- [x] CHK-052 [P0] `design-command-surface-check.mjs` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: paths resolved from `import.meta.url`; `node --check` passes
- [x] CHK-053 [P1] No temp files created outside `scratch/`
  - **Evidence**: only the intended artifacts touched

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: Build verification (discriminator on five records; WHEN TO USE THIS, NOT A SIBLING in five wrappers; surface-check STATUS=PASS invalid=0 drift=0; self-sibling synthetic break proves the gate bites; prior D2 parity preserved; mode-registry byte-unchanged; evergreen clean)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
