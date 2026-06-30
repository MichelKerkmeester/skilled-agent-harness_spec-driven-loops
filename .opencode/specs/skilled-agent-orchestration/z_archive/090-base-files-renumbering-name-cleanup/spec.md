---
title: "111: 026 cleanup remediation (Wave 3)"
description: "Remediate 4 cleanup gaps after 026 Wave 1+2 restructure: 11 sub-phase dirs missing 33 base files; 86 sub-phase children + 22 parent children need sequential renumber; 2 dup-prefix pairs under 014; ~25 verbose names need shortening."
trigger_phrases:
  - "111 spec"
  - "026 cleanup wave 3"
  - "sub-phase base files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup"
    last_updated_at: "2026-05-16T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet 111"
    next_safe_action: "W3.A cli-devin swarm dispatch"
    blockers: []
    key_files:
      - "/Users/michelkerkmeester/.claude/plans/scaffold-both-and-fix-piped-bengio.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000111"
      session_id: "111-spec-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Baseline: dbd3fbe79"
      - "Source plan: ~/.claude/plans/scaffold-both-and-fix-piped-bengio.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 111: 026 cleanup remediation (Wave 3)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Source plan** | `~/.claude/plans/scaffold-both-and-fix-piped-bengio.md` |
| **Baseline** | `dbd3fbe79` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packets 107 (Wave 1) and 109 (Wave 2) restructured the 026 phase parent but left 4 cleanup gaps: (1) all 11 sub-phase dirs under `000-release-cleanup/` and `006-skill-advisor/` are missing `spec.md` + `description.json` + `graph-metadata.json` (33 files); (2) 86 sub-phase children preserve original flat 026 numbers instead of sequential per sub-phase; (3) `005-code-graph`, `010-doctor-update-orchestrator`, `014-local-embeddings-migration` have non-sequential children with 2 dup-prefix pairs under 014; (4) ~25 packet names > 35 chars are confusingly verbose. Remediate all four in one packet using cli-devin SWE-1.6 for authoring + scoring, main agent for mechanical renumbers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (7 sub-waves W3.A → W3.G)

- W3.A: cli-devin × 11 parallel — author 33 missing sub-phase base files
- W3.B: main agent — renumber 86 sub-phase children sequentially per sub-phase
- W3.C: main agent — renumber 22 children in 007/013/014
- W3.D: main agent — resolve 014 dup-prefix pairs (2 ops)
- W3.E: cli-devin × 1 scorer + main agent — verbose name cleanup (~25 renames)
- W3.F: cli-devin × 1 — sync 17 phase-parent graph-metadata children_ids + spec.md PHASE CHILDREN tables
- W3.G: main agent — strict-validate + orphan-ref check

### Out of Scope

- Recursive renumber inside deeply-nested children (already sequential per spot check)
- Phase parents under other roots (only 026 in scope)
- Additional DEEP archives surfaced during W3.E (defer to packet 112)
- 005-code-graph thematic sub-phase recatalog (defer)
- 026 multi-wave CHANGELOG (defer to `/create:changelog`)

### Files to Change

| Path | Change | Description |
|------|--------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/*/` (6 dirs) | Create 18 files | spec.md + description.json + graph-metadata.json per sub-phase |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/*/` (5 dirs) | Create 15 files | Same as above |
| 86 sub-phase children | Rename | git mv + sed cross-ref sweep |
| 22 children under 007/013/014 | Rename | Same |
| 2 dup-prefix pairs under 014 | Rename | Same |
| ~25 verbose-named packets | Rename | Same + title update |
| 17 phase-parent `graph-metadata.json` | Edit | Re-derive children_ids |
| 17 phase-parent `spec.md` | Edit | Update PHASE CHILDREN tables |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 11 sub-phase dirs have spec.md + description.json + graph-metadata.json | `validate_document.py` exits 0 on all 33 files |
| REQ-002 | All 11 sub-phases have sequential children 001..N | `ls -d */ \| cut -c1-3 \| sort -c` succeeds |
| REQ-003 | 007/013/014 children sequential; zero dup-prefix pairs under 014 | `find ... -mindepth 2 -maxdepth 2 -type d \| awk -F/ '{print $NF}' \| cut -c1-3 \| sort \| uniq -d` returns empty |
| REQ-004 | 17 phase-parent graph-metadata.children_ids match filesystem | `jq` extract = `ls` output for each |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verbose names ≥ threshold 5 renamed; spec.md titles updated | Max packet name length drops ≤ 42 chars |
| REQ-006 | Zero orphan references | `rg -l` of every old name returns 0 active-surface refs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: strict-validate of 026 phase parent exits 0
- **SC-002**: strict-validate of packet 111 exits 0
- **SC-003**: 0 orphan references across active surface
- **SC-004**: ~125-130 commits land cleanly on main
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | W3.C 014 sweep touches ~2750 file refs | High | Per-rename atomic commit + slash-anchored sed + sanity-grep every 10 commits |
| Risk | Two-pass collision-safety doubles commits in worst case | Med | Acceptable cost; deterministic prefix-only renumber |
| Risk | cli-devin W3.A schema drift | Low | Main agent fixes inline (one-shot), no re-dispatch |
| Risk | Parallel agent commit interleaving | Low | Tolerate per 107 precedent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — plan pre-approved.
<!-- /ANCHOR:questions -->
