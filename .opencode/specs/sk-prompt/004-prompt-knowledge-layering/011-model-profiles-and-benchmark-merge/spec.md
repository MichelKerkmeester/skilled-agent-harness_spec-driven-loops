---
title: "Feature Specification: model-profiles-and-benchmark-merge"
description: "Merge benchmark 006 into 005 (two eval subsets), repoint every stale benchmark citation to the renumbered 00N scheme, and apply comment-hygiene to model-profiles.json annotation fields."
trigger_phrases:
  - "benchmark merge"
  - "stale benchmark id repoint"
  - "model-profiles json hygiene"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/011-model-profiles-and-benchmark-merge"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Merged 006 into 005; repointed stale citations"
    next_safe_action: "Validate then commit phase 011"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/benchmarks/005-mimo-minimax-capability-discrimination/"
      - ".opencode/skills/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/references/pattern-index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Merge shape = two eval subsets under 005; rename bundled into this phase's commit"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: model-profiles-and-benchmark-merge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 13 |
| **Predecessor** | 010-hub-doc-alignment-and-router |
| **Successor** | 012-cli-doc-alignment |
| **Handoff Criteria** | 006 merged into 005 (two eval subsets); benchmark folder rename staged; all stale benchmark/phase citations repointed; model-profiles.json valid + hygienic; guard green; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 11 of spec 130. The benchmark folders were renamed on disk to a clean `00N` scheme without
git, leaving 270 deleted old-named files + 6 untracked new folders, and every benchmark citation in
the hub stale. This phase stages the rename, merges the two sibling MiniMax-vs-MiMo benchmarks into
one (005), repoints all citations, and applies comment-hygiene to the registry.

**Scope boundary**: the `benchmarks/` tree, `model-profiles.json`, and the citation-bearing hub
docs (profiles, `_index.md`, `pattern-index.md`). No SKILL.md/README structural change (phase 010),
no executor docs (phase 012), no card move (phase 013).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The benchmark rename was a filesystem operation git never saw. Benchmarks 005 (capability
discrimination) and 006 (strict-validation fixtures) are the same MiniMax-M3-vs-MiMo comparison and
belong together. Every profile, the index, and the registry cited the old spec/phase ids
(`120/003`, `126/004`, `127/004`, `127/006`, `113/003`, `113/005`), now stale. `pattern-index.md`
also carried ephemeral spec-phase pointers (`Phase 004/005/006`, the `114-...` arc).

### Purpose
One coherent benchmark layer: the rename staged, the two sibling runs merged into 005 as
`eval/capability-discrimination/` + `eval/strict-validation/`, every citation pointing at the new
`00N` names, and the registry's annotation fields hygienic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stage the benchmark folder rename (`113-003→001` … `127-006→006`; node_modules/lockfiles stay ignored).
- Merge 006 into 005: move 005's `eval/*` → `eval/capability-discrimination/`, 006's `eval/*` → `eval/strict-validation/`, author a merged top-level `synthesis.md`, remove 006.
- Repoint ~40 stale benchmark citations to `benchmark 00N` across profiles, `_index.md`, `pattern-index.md`, and `model-profiles.json` evidence fields.
- model-profiles.json comment-hygiene: durable WHY in `notes`/`evidence`, no ephemeral spec pointers, stale benchmark ids refreshed.
- Scrub ephemeral spec-phase refs from `pattern-index.md` (the `Phase NNN` column → `Status`, the `114-...` arc, the deleted-phase line, spec-folder links).

### Out of Scope
- SKILL.md/README structure (phase 010, done).
- Executor docs (phase 012); card move (phase 013).
- Historical changelogs (frozen; they legitimately cite the ids current when written).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
None.

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Merge 006→005 | 005 has `synthesis.md` + `eval/{capability-discrimination,strict-validation}/`; 006 gone |
| REQ-002 | Repoint citations | No stale `120/003`/`126/004`/`127/00N`/`113/00N` ids in active hub docs |
| REQ-003 | Registry hygiene | `model-profiles.json` valid JSON; annotation fields durable + benchmark ids refreshed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `005/eval/{capability-discrimination,strict-validation}/` present; `006-*` removed; merged `synthesis.md` ties both.
- **SC-002**: `grep` finds no stale benchmark/phase ids in active hub docs.
- **SC-003**: `model-profiles.json` parses; guard green; `validate.sh --recursive --strict` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Staging the 270-file rename could orphan history | Med | `git add -A benchmarks/` lets git pair deletes+adds as renames; verified mapping is 1:1 |
| Risk | JSON edit breaks the registry | Med | `python3 -m json.tool` validation after the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Rename-bundling + merge shape locked with the user.
<!-- /ANCHOR:questions -->
