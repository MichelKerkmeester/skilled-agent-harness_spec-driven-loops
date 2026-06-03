---
title: "Implementation Summary: model-profiles-and-benchmark-merge"
description: "Staged the benchmark folder rename, merged benchmark 006 into 005 as two eval subsets with a combined synthesis, repointed every stale benchmark citation to the 00N scheme, and applied comment-hygiene to the registry and pattern-index."
trigger_phrases:
  - "benchmark merge summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/011-model-profiles-and-benchmark-merge"
    last_updated_at: "2026-06-03T09:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 011 content complete + verified"
    next_safe_action: "Stage rename, validate, commit; then phase 012"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/benchmarks/005-mimo-minimax-capability-discrimination/"
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-model-profiles-and-benchmark-merge |
| **Completed** | 2026-06-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The benchmark layer is now coherent: the rename is reconciled in git, the two sibling runs are one benchmark, and every citation points at the right place.

### The rename is reconciled
The benchmark folders had been renamed on disk to a clean `00N` scheme without git (270 deleted old-named files + 6 untracked new folders). This phase stages that rename as part of its commit, with `node_modules` and seed lockfiles staying ignored.

### Two sibling benchmarks became one
Benchmarks 005 (capability discrimination) and 006 (strict-validation fixtures) are the same MiniMax-M3-vs-MiMo comparison and reach the same verdict. 006 was merged into 005 as `eval/strict-validation/`, 005's original data moved to `eval/capability-discrimination/`, and a merged top-level `synthesis.md` ties both (M3 perfect across 32/32 cells over 8 fixtures and two independent runs; MiMo ~0.89, gate-ineligible both times). The `006-` folder is gone.

### Citations point at the new scheme
Roughly 40 stale benchmark citations (`120/003`, `126/004`, `127/004`, `127/006`, `113/003`, `113/005`) across the profiles, `_index.md`, `pattern-index.md`, and `model-profiles.json` were repointed to `benchmark 00N`. The registry's annotation fields were hygiened (durable WHY, no ephemeral pointers). `pattern-index.md` also lost its remaining ephemeral spec-phase refs (the `Phase NNN` column became `Status`, the arc name and deleted-phase line and spec-folder links were removed).

### Files Changed
| File | Action | Purpose |
|------|--------|---------|
| `benchmarks/` (6 folders) | Renamed (staged) | Reconcile the on-disk rename in git |
| `benchmarks/005-*/` | Restructured | Two eval subsets + merged synthesis; 006 removed |
| `references/models/*.md` (6) + `_index.md` | Modified | Citations → `benchmark 00N` |
| `references/pattern-index.md` | Modified | Citations + spec-phase scrub |
| `assets/model-profiles.json` | Modified | Evidence ids refreshed; notes hygiened |
| `SKILL.md` | Modified | Version 0.7.1.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The merge file moves and the registry/pattern-index hygiene were done directly; the repetitive ~40-citation repoint was delegated to a subagent against an exact id mapping, then verified (no stale ids remain in active docs, JSON parses). The rename is staged via `git add -A benchmarks/` so git pairs the deletes and adds as renames.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two eval subsets under 005 (not a flat fuse) | Non-destructive; both run datasets stay reproducible |
| Bundle the rename into this commit | The user's pending on-disk rename belongs with the benchmark work |
| Render citations as `benchmark 00N` | Durable, points at the new folder; drops the old spec/phase form |
| Leave historical changelogs untouched | They legitimately cite the ids current when written |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `005/eval/{capability-discrimination,strict-validation}/` present; 006 removed | PASS |
| No stale benchmark/phase ids in active hub docs | PASS |
| `model-profiles.json` valid JSON | PASS |
| card-sync guard | PASS |
| validate.sh --recursive --strict | (run at commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The merged `synthesis.md` summarizes; the per-run detail lives in the two `eval/` subset synthesis files.** Intentional — the top synthesis is the combined reading.
<!-- /ANCHOR:limitations -->
