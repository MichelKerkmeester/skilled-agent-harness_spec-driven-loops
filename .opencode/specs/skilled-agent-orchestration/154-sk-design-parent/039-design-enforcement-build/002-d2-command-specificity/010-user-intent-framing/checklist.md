---
title: "Verification Checklist: D2-R10 — User-intent framing for the /design:* surface"
description: "Acceptance gates for adding userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframing the five wrappers to lead with the user job and relocate mode-binding to an Internal binding section, and extending design-command-surface-check.mjs to require the intent lead and ban bridge-first phrases; populated with evidence during the build."
trigger_phrases:
  - "d2-r10 user intent framing checklist"
  - "design command user intent checklist"
  - "lead with user job checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/010-user-intent-framing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all 30 checklist items with evidence; checker PASS invalid=0 drift=0"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r10-user-intent-framing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "copyGuard scanned in the intent lead region only; the renumber is safe via name+anchor matching"
---
# Verification Checklist: D2-R10 — User-intent framing for the /design:* surface

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

- [x] CHK-001 [P0] Prior D2 baseline confirmed green before any edit (`invalid=0 drift=0`)
  - **Evidence**: Additive baseline confirmed; final `node design-command-surface-check.mjs` still `STATUS=PASS invalid=0 drift=0`
- [x] CHK-002 [P0] `userIntent` + `copyGuard` schema documented in plan.md (`job`, `ownedSignals`, banned bridge-first corpus)
  - **Evidence**: plan.md §3 Key Components + Record shape worked example; copyGuard corpus = `["Thin bridge","Pin the","parent skill's","parent hub to","loads the","mode directly"]`
- [x] CHK-003 [P1] Per-command `userIntent.job` / `ownedSignals` / `copyGuard` authored in plan.md §3 and reconciled with each record's `aliases` (signal ⊆ aliases) and `description` (job restates the promise)
  - **Evidence**: plan.md §3 per-command framing table; live check confirms `ownedSignals ⊆ aliases` true 5/5
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers (body-only) + the checker
  - **Evidence**: `git status` shows exactly 7 files (1 JSON + 5 wrappers + checker); nothing else

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON; each of the 5 records carries `userIntent{ job, ownedSignals }` (non-empty job string, non-empty ownedSignals array) and a non-empty `copyGuard` array
  - **Evidence**: `node` JSON parse OK, 5 records; each record `job:true`, `ownedSignals` 3-entry array, `copyGuard` 6-entry array
- [x] CHK-011 [P0] Every `userIntent.ownedSignals` entry is a member of the same record's `aliases` (alias-subset reconciliation)
  - **Evidence**: live subset check `ownedSignals ⊆ aliases` true for audit/foundations/interface/md-generator/motion (5/5)
- [x] CHK-012 [P0] Each wrapper leads with its user job and carries `## 1. USER INTENT` (job + owned signals) and `## 2. INTERNAL BINDING` (relocated mode mechanics)
  - **Evidence**: `## 1. USER INTENT` @L11 and `## 2. INTERNAL BINDING` @L15 in all five wrappers; lead line is the user-voice job
- [x] CHK-013 [P0] No `copyGuard` bridge-first phrase (`Thin bridge`, `Pin the`, `parent skill's`, `parent hub to`, `loads the`, `mode directly`) survives in any wrapper's intent lead region
  - **Evidence**: Stage-2 copyGuard-in-lead scan (H1 → first `## INTERNAL BINDING`) clean 5/5; checker `drift=0`
- [x] CHK-014 [P1] Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged (body-only edits)
  - **Evidence**: frontmatter-drift gate stays 0 in full checker run; only body lead + section numbering changed

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 passes: `userIntent` + `copyGuard` present and well-formed, all `ownedSignals` ∈ `aliases`, for all five records (`invalid=0`)
  - **Evidence**: `validateUserIntent` (checker L630) green for all 5; `SUMMARY invalid=0`
- [x] CHK-021 [P0] Stage 2 passes: all five wrappers carry the `USER INTENT` job lead, the `INTERNAL BINDING` section, and no bridge-first phrase in the lead
  - **Evidence**: `expectedUserIntentDrift` (checker L753) reports zero `user-intent` drift; USER INTENT 5/5, INTERNAL BINDING 5/5
- [x] CHK-022 [P0] Full run is no-regression: existing frontmatter drift stays 0, all prior D2 sections (sibling-discriminator, PRECONDITIONS, EMIT DELIVERABLE, Example) still present, and overall `node design-command-surface-check.mjs` reports `drift=0`, exit 0
  - **Evidence**: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0` / EXIT=0; 8 named sections survive 5/5
- [x] CHK-023 [P1] Synthetic break — removing a record's `userIntent` flips the checker to exit 2 (INVALID)
  - **Evidence**: implementer + orchestrator-verified; missing `userIntent` → INVALID; restored to `invalid=0`
- [x] CHK-024 [P1] Synthetic break — setting an `ownedSignals` entry to a non-alias value flips the checker to exit 2 (INVALID)
  - **Evidence**: orchestrator-verified; `STATUS=INVALID` "userIntent.ownedSignals contains non-alias signal" (`invalid=1`); restored → `invalid=0 drift=0`
- [x] CHK-025 [P1] Synthetic break — re-introducing a bridge-first phrase in a wrapper lead flips the checker to `user-intent` drift, exit 1
  - **Evidence**: orchestrator-verified; Stage-2 `user-intent` drift fires (exit 1); restored
- [x] CHK-026 [P1] `node --check` passes on the edited checker (valid ESM)
  - **Evidence**: `node --check design-command-surface-check.mjs` → CHECKER_SYNTAX_OK

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The gap is closed at the source (metadata SSOT + one gate), not per-wrapper hand-editing — the lead is projected from `userIntent` and policed by the checker
  - **Evidence**: `userIntent` lives in `command-metadata.json`; `validateUserIntent` + `expectedUserIntentDrift` enforce projection across all 5
- [x] CHK-FIX-002 [P0] Every command — not just `interface` (the cited evidence) — leads with its user job and carries an `Internal binding` section
  - **Evidence**: USER INTENT 5/5 and INTERNAL BINDING 5/5 across audit/foundations/interface/md-generator/motion
- [x] CHK-FIX-003 [P1] The bridge-first ban is enforced by the checker against the `copyGuard` corpus, not just authored once in prose
  - **Evidence**: Stage-2 loop scans each record's `copyGuard` against the lead region, emitting `user-intent` drift naming the phrase
- [x] CHK-FIX-004 [P1] The intent framing reconciles with the aliases/description (ownedSignals ⊆ aliases enforced deterministically; job↔description verified in authoring)
  - **Evidence**: non-alias-signal Stage-1 rule deterministic (synthetic break bites); job↔description verified per plan.md §3 table
- [x] CHK-FIX-005 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `SUMMARY invalid=0 drift=0`, EXIT=0; re-runnable

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (read-only alias/intent source, not mutated)
  - **Evidence**: `git diff --stat mode-registry.json` empty; not in `git status` changed set
- [x] CHK-031 [P0] No file outside `command-metadata.json` + the five wrappers + the checker is created or modified
  - **Evidence**: `git status` shows exactly 7 changed paths; no other live file touched
- [x] CHK-032 [P1] The checker still treats the wrappers and the registry as read-only (`readFile` only, no write/edit)
  - **Evidence**: checker uses `readFileSync`/`readFile` only; no write API; stateless drift-gate

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized on the `userIntent`/`copyGuard` schema, the wrapper lead + Internal binding reframing, and the additive `drift=0` outcome
  - **Evidence**: all three docs status `complete`; schema + reframing + `invalid=0 drift=0` consistent across them
- [x] CHK-041 [P1] The additive coupling to D2-R3 documented (two namespaced fields + one section on the frozen record/wrapper shape; prior D2 additions and future siblings unaffected)
  - **Evidence**: plan.md §6 Dependencies coupling note; spec.md §6 RISKS dependency rows
- [x] CHK-042 [P1] The renumber-safety note documented (named sections + sibling-discriminator anchors are load-bearing, not their numbers)
  - **Evidence**: plan.md Renumber-safety note + spec.md §6 RISKS; verified by 8 sections surviving 5/5

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: live grep finds no spec/packet/phase ID or spec path in the metadata
- [x] CHK-051 [P0] The five wrappers and the checker carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: live grep finds no IDs/paths in the wrappers or the checker; checker resolves paths from `import.meta.url`
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: no temp artifacts left in the package or live tree; only the 7 scoped files changed

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: claude-opus-4-8 (orchestrator-verified gate evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
