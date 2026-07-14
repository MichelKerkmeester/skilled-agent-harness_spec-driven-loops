---
title: "Feature Specification: rename and reference tooling (017 phase 005)"
description: "A blind path-segment `_`->`-` substitution corrupts names (`_common.sh`->`-common.sh`, `__fixtures__`->`--fixtures--`, leading-hyphen CLI hazards) and misses dynamic references. The program needs a deterministic, dry-run-default rename engine driven by a SEMANTIC source->target map, plus a rename-map-driven whole-repo "
trigger_phrases:
  - "rename and reference tooling"
  - "hyphen naming phase 005"
  - "kebab-case rename and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Rename and reference tooling

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `004-no-new-snake-guard`; successor `006-inventory-and-frozen-map`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A blind path-segment `_`->`-` substitution corrupts names (`_common.sh`->`-common.sh`, `__fixtures__`->`--fixtures--`, leading-hyphen CLI hazards) and misses dynamic references. The program needs a deterministic, dry-run-default rename engine driven by a SEMANTIC source->target map, plus a rename-map-driven whole-repo reference checker that resolves modules, config path-values, and shell sourcing and dispositions every dynamic site.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A dry-run-default rename engine: semantic source->target map (not char substitution), collision hard-abort on exact/casefold/NFC, symlink mode-120000 + exec-bit preservation, exemption deny-list.
- A rename-map-driven whole-repo reference checker: JS/TS module resolution, JSON/YAML/TOML path-values, shell `source`, and registry paths.
- A disposition ledger requiring every dynamic `require(...)`/`source`/glob site to be classified.
- The checker fails on zero files scanned (no silent no-op).

### Out of Scope
- Running the migration (007+).
- The guard (004).
- The frozen map (006).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rename engine is dry-run by default and applies only on an explicit flag | A dry-run makes zero writes in a temp git repo |
| REQ-002 | The engine hard-aborts on exact/casefold/NFC collisions | A synthetic colliding pair aborts before any write |
| REQ-003 | The engine uses a semantic map and preserves symlink mode and exec bits | Leading-underscore and double-underscore inputs map to safe targets; mode 120000 and +x survive |
| REQ-004 | The reference checker resolves imports, path-values, and shell sourcing across the repo | Planted broken references are caught; resolution runs over JS/TS/JSON/YAML/shell |
| REQ-005 | Every dynamic require/source/glob site is dispositioned in a ledger | The ledger has no un-dispositioned dynamic site |
| REQ-006 | The checker fails when zero files are scanned | A misconfigured run exits non-zero rather than passing vacuously |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A safe, reviewable rename engine exists.
- **SC-002**: A whole-repo reference checker catches broken and dynamic references.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-rename-engine/ | [Phase 1 scope] | Pending |
| 2 | 002-reference-checker-and-disposition-ledger/ | [Phase 2 scope] | Pending |
| 3 | 003-fixture-corpus-and-dry-run-harness/ | [Phase 3 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-rename-engine | 002-reference-checker-and-disposition-ledger | [Criteria TBD] | [Verification TBD] |
| 002-reference-checker-and-disposition-ledger | 003-fixture-corpus-and-dry-run-harness | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
