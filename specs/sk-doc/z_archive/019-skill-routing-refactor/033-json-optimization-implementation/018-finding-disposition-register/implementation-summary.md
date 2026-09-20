---
title: "Implementation Summary: Finding Disposition Register"
description: "All 41 audit findings from the four legs carry exactly one disposition — 21 fixed, 11 refuted with re-checkable evidence, 8 deferred with an owner, 1 accepted — and the retrospective records the severity inversion, the coverage gaps, and the run-integrity defects a future audit should inherit."
trigger_phrases:
  - "finding disposition register summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/018-finding-disposition-register"
    last_updated_at: "2026-07-30T15:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Registered dispositions for all 41 findings"
    next_safe_action: "Operator: decide 011 build, 012 close, and parent status"
    blockers: []
    key_files:
      - "finding-disposition-register.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/018-finding-disposition-register"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deferred code-style findings park with the sk-code quality gate / advisor-code owner backlog"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Finding Disposition Register

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 1 |
| **Completion** | 100% — 41 findings dispositioned, retrospective written, phase map finalized |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The register that closes the audit: `finding-disposition-register.md`. Every one of the 41 canonical findings from the four legs (three review lineages plus the deep-alignment run) carries exactly one disposition, and the retrospective records what the audit itself missed and got wrong.

### One disposition per finding

The 60 raw finding rows across the four legs deduplicate to 41 canonical findings (F01–F41), each dispositioned once:
- **21 fixed** (F01–F21), each mapped to the remediation phase that closed it (013–020);
- **11 refuted** (F22–F32), each with re-checkable evidence — the synthesis §2 "not a routing regression" claim is backwards (53/72 is the live top-3, the number moved), the eight documentation-validator rows are one symlink-resolution instrument error, the DQI-floor rows are a heuristic firing on a generated diff table, and the path-containment sink is a bare existence check that opens nothing;
- **8 deferred** (F33–F40), each parked with the sk-code quality gate / advisor-code owner rather than closed by omission;
- **1 accepted** (F41), the comment-hygiene doctrine-vs-gate gap, referred to the gate owner.

### Retrospective

- **Severity inversion:** the four legs agreed on what a status table showed, not on consequence; the most serious defect — a routing regression below the release floor — was found by no leg because every leg read documents and none ran the capture. The concrete lesson: treat a claim of measured neutrality as unverified until the measurement is re-run.
- **Coverage gaps:** no leg examined runtime behaviour, whether CI gates what it claims, or the three scorer diffs that were the only live-code blast radius.
- **Run-integrity defects:** the fanout that deleted untracked artifacts mid-run, truncated lane identifiers, inconsistent registry schemas, and SOURCE citations to a file the executor could not resolve — recorded because a fabricated source path is worse than most findings.

### Phase map finalized

As the closing phase, 018 set the parent phase-map rows for 017–020 to Complete, matching their landed state.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `018.../finding-disposition-register.md` | Created | The 41-finding register plus the retrospective |
| `033.../spec.md` (parent) | Modified | Phase-map rows 017–020 set to Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Extract every finding row from the review-lineage and alignment registries, deduplicate to the canonical 41, and disposition each against the actual remediation outcome — fixed rows cite the phase that closed them, refuted rows cite the static fact that refutes them, deferred rows name an owner. The retrospective was written from what the remediation exposed about the audit: the regression no document-reading leg could find, the gates that did not gate, and the instrument defects that corrupted the run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deduplicate the 60 raw rows to 41 canonical and disposition once | A cross-leg duplicate is one finding; dispositioning it three times would inflate the register and hide the real count |
| Refute rather than fix the eight doc-validator rows | They are one instrument error (an unresolved symlink), not eight real defects — fixing phantom findings is the anti-pattern this program exists to correct |
| Park the code-style findings in a backlog, not a new packet | They are cosmetic and low-severity; a backlog owner keeps them from disappearing without spinning up a phase |
| Leave 011/012/parent for the operator | 011 was never built and 012's verification is re-opened; whether to build/close them and mark the parent Complete is a judgement above this register |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 41 findings present, one disposition each | register numbered F01–F41; §6 reconciles 60 raw rows → 41; 21+11+8+1 = 41 |
| Refutations re-checkable | each §2 entry points at a static file fact, not an opinion |
| Deferrals owned | each §3 entry names a backlog owner |
| Retrospective concrete | §5 states the re-run-the-measurement lesson and the coverage-gap list with counts |
| Phase map finalized | parent rows 017–020 read Complete |
| `validate.sh <this-folder> --strict` | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 60→41 deduplication is by defect identity, not a canonical audit-supplied list.** The audit did not emit a single deduplicated 41-row file; the register reconstructs it from the leg registries, so the exact partition of near-duplicate rows into canonical findings reflects this phase's judgement, stated openly in §6.
2. **Three operator decisions are left open:** whether to build the never-implemented 011, whether to close 012's re-opened rollout verification, and whether the parent packet's In Progress status should move to Complete now that the gate is green.
<!-- /ANCHOR:limitations -->
