---
title: "Checklist: Wire Compiler + Routing-Accuracy Gates into CI"
description: "QA checklist for adding skill_graph_compiler.py and score-routing-corpus.py as new gated CI steps in routing-registry-drift.yml."
trigger_phrases:
  - "ci compiler accuracy gate checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation runs (this packet is Planned, not built).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] 003 + 004 shipped before activation [evidence: both `implementation-summary.md` Status Complete on origin prior to this change]
- [x] CHK-002 [P0] 002's pin read and referenced [evidence: `002-baseline-capture/baseline/routing-baseline.json` `corpus` sha256 block; the CI hash check reads it at run time]
- [x] CHK-003 [P1] Both commands run clean pre-edit [evidence: compiler "VALIDATION PASSED" 11 roots exit 0; scorer reproduced 002's sqlite-regime pin exactly (0.5692/0.9843/108-3-1)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] Only the workflow modified in code; both validators untouched [evidence: code diff = `routing-registry-drift.yml` alone (plus this packet's own docs)]
- [x] CHK-005 [P1] Four pre-existing `routing-drift` steps byte-unchanged [evidence: diff shows only additive step + paths entries]
- [x] CHK-006 [P1] Accuracy step runs in the `mcp-server` working-directory context; the compiler step is invoked repo-root-relative like the lean job's sibling node gates [evidence: workflow YAML]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] Compiler negative confirmed [evidence: scratch tree, broken `derived.key_files` → `ERRORS in sk-git … path does not exist`, `VALIDATION FAILED`, exit 2]
- [x] CHK-008 [P0] Accuracy negative confirmed [evidence: raised floor → exit 1; tampered corpus copy → hash-pin check exit 2 naming the drifted file]
- [x] CHK-009 [P1] CI-condition simulation passed [evidence: the gitignored `skill-graph.sqlite` masked (the operative local/CI difference) → compiler exit 0 + gated scorer exit 0 with the shipped floors; this simulation is what caught and fixed the regime miscalibration; `npm ci` legs first-push-confirmable]
- [x] CHK-010 [P1] Paths syntax verified by parity [evidence: added entry is byte-parallel to the existing quoted `**` entries; YAML parses; test-branch push deferred to the first real push]
- [x] CHK-011 [P2] Fleet-wide compiler run post-003/004 clean [evidence: `--validate-only` → 11 roots, zero errors]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-012 [P0] Both steps present and reachable [evidence: workflow parses with 8 routing-drift steps + 5 golden-gate steps; no `if:` guards or comments disabling them]
- [x] CHK-013 [P1] Activation order honored [evidence: 003 and 004 commits landed and pushed before this change]
- [x] CHK-014 [P2] Floors measured, not guessed [evidence: deterministic no-sqlite fallback baseline (0.5333/0.9843/101-3-1) — the regime CI runs — cross-referenced against 002's sqlite-regime pin (0.5692/108); deviation recorded in the spec amendment]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-015 [P1] No secrets/tokens introduced [evidence: steps run python3 + the checked-in scripts only; no env secrets referenced]
- [x] CHK-016 [P2] Same permissions/runner [evidence: no `permissions:` block added; both steps in existing jobs on `ubuntu-latest`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-017 [P1] Inline rationale comments present [evidence: both new steps carry durable-why comment blocks — the unpinned-corpus hazard and the compiler's coverage gap — in the file's existing style]
- [x] CHK-018 [P2] Continuity updated [evidence: `implementation-summary.md` Status Complete with the full positive/negative verification record]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-019 [P1] Docs contained to this phase's folder [evidence: doc diff = spec/tasks/checklist/implementation-summary under `006-ci-compiler-accuracy-gates/` only]
- [ ] CHK-020 [P2] `validate.sh --strict` — **BLOCKED** repo-wide (concurrent session's incomplete pi-hook relocation breaks the spec-kit orchestrator build); verified by the direct positive/negative gate runs [documented deferral]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 3/3 |
| Code quality | 3 | 3/3 |
| Testing | 5 | 5/5 |
| Fix completeness | 3 | 3/3 |
| Security | 2 | 2/2 |
| Docs | 2 | 2/2 |
| File org | 2 | 1/2 (CHK-020 validate blocked upstream, deferred) |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
