---
title: "Feature Specification: full strict evergreen-citation sweep across the deep-* skills"
description: "Rewrites every transient packet/arc/phase/spec-path citation in the runtime docs, code comments, feature catalogs, playbooks, and tests of deep-loop-runtime, deep-research, deep-review, deep-ai-council, and deep-agent-improvement to present-tense evergreen form. ADR names are kept as stable anchors; only the mutable packet/phase prefixes are dropped. Changelogs and machine-regenerated metadata are exempt."
trigger_phrases:
  - "full strict evergreen sweep deep skills"
  - "010 evergreen citation sweep"
  - "drop packet phase arc citations runtime docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/002-evergreen-citation-sweep"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "sweep-skill-by-skill-then-regrep"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/deep-loop-runtime/README.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/skills/deep-review/references/state_format.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010001"
      session_id: "131-000-010-evergreen-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator chose Full strict sweep: rewrite ADR-provenance citations, code comments, and phase-numbered section headers across all deep-* skills"
      - "Keep ADR names (stable anchors); drop only the mutable packet/phase prefix"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: full strict evergreen-citation sweep across the deep-* skills

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Source** | 009 cross-skill sweep follow-on; operator chose "Full strict sweep" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 009 cross-skill sweep fixed two incidental citations and surfaced ~63 more transient packet/arc/phase/spec-path references across the five deep-* skills. The evergreen rule (and the sk-doc "skill docs state desired logic only, no phase/test references" rule) says runtime docs, feature catalogs, playbooks, and code comments must not cite mutable spec/phase/packet numbers — changelogs are the only legitimate home for those.

The bulk is `deep-loop-runtime`'s ~23 "Packet 131/001/008 ADR-001 (Runtime Boundary Decision)" provenance citations in README/SKILL, plus `reduce-state.cjs`/`mutation-coverage.cjs` code comments ("phase 008 REQ-015 parity"), phase-numbered playbook + reference section headers, and feature-catalog phase references.

The fix rewrites each to present-tense form that keeps the durable anchor (ADR name, REQ semantics, behavior description) and drops the mutable prefix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

All transient `arc NNN` / `packet NNN` / `phase NNN` / `NNN/NNN/NNN` / `116-deep-skill-evolution` citations in non-exempt files of:

- `deep-loop-runtime` (README.md, SKILL.md, feature_catalog, lib/deep-loop/README.md, tests/council/README.md, tests/unit/executor-config.vitest.ts, manual_testing_playbook).
- `deep-research` (SKILL.md, scripts/reduce-state.cjs).
- `deep-review` (README.md, references/state_format.md, references/convergence.md, scripts/reduce-state.cjs, manual_testing_playbook).
- `deep-ai-council` (references/folder_layout.md, convergence_signals.md, command_wiring.md, manual_testing_playbook).
- `deep-agent-improvement` (scripts/mutation-coverage.cjs, scripts/reduce-state.cjs, manual_testing_playbook).

### Out of Scope

- `changelog/**` — the legitimate home for packet refs (exempt).
- `graph-metadata.json`, `description.json`, `.code-graph*`, `.advisor-state` — machine-regenerated metadata (exempt; editing is overwritten on next save).
- The actual behavior of any script — comment rewording only, no logic change.
- ADR names themselves (kept as stable anchors).

### Files Changed

~27 files across the 5 skills (see In Scope) plus this packet's `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Transient packet/arc/phase/spec-path citations removed from non-exempt deep-* skill files | Comprehensive re-grep returns 0 hits in non-exempt files |
| REQ-002 | Durable anchors preserved | ADR names retained (e.g. "Runtime Boundary Decision (ADR-001)"); REQ semantics + behavior descriptions kept |
| REQ-003 | No script behavior change | `node --check` clean on every touched `.cjs`; only comments edited |
| REQ-004 | Touched skills pass alignment + tests | `verify_alignment_drift.py` PASS per touched skill; vitest suites still green where present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Comprehensive evergreen re-grep clean (0 transient citations in non-exempt files across all 5 deep-* skills).
- **SC-002**: `node --check` clean on all touched `.cjs`; deep-loop-runtime + deep-agent-improvement + deep-review vitest suites still pass.
- **SC-003**: sk-code alignment-drift PASS on each touched skill.
- **SC-004**: 010 spec folder passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewording a code comment changes behavior | Low | Comments only; `node --check` + vitest after |
| Risk | Dropping a packet prefix loses needed traceability | Low | Keep ADR names + REQ semantics; only the mutable prefix goes; changelog retains full provenance |
| Risk | Missing a citation (incomplete sweep) | Med | Re-grep with the full pattern after edits; iterate until 0 |
| Dependency | repo-root vitest, Node 18+ | Green | Present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Operator selected "Full strict sweep"; the keep-ADR-name / drop-packet-prefix rule is settled.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md` | **Tasks**: `tasks.md` | **Summary**: `implementation-summary.md`
- **Source**: `../009-resolve-005-deep-research-followon-findings/implementation-summary.md` (F4 sweep that surfaced this set)
