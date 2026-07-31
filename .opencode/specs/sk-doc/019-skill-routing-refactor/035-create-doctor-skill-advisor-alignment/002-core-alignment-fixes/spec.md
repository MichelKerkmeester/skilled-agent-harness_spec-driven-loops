---
title: "Feature Specification: Create/Doctor/Skill-Advisor Core Alignment Fixes"
description: "Implement Track A of 001-research's dependency-ordered recommendations: fix diagnosed doctor/create defects, wire skill_graph_validate into doctor output semantics, fix leaf-manifest generation ownership, author a shared advisor-index-handoff vocabulary, and wire it into every create branch."
trigger_phrases:
  - "create doctor skill advisor core alignment fixes"
  - "advisor index handoff implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/002-core-alignment-fixes"
    last_updated_at: "2026-07-31T03:57:25Z"
    last_updated_by: "claude-code"
    recent_action: "A1-A7 plus gap remediation complete"
    next_safe_action: "validate.sh --strict, then user decides on commit"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-core-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Create/Doctor/Skill-Advisor Core Alignment Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-31 |
| **Branch** | `sk-doc/0128-create-doctor-skill-advisor-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`../001-research/research/research.md` found the create → doctor → skill-advisor system structurally sound but operationally under-wired: no command proves a newly created skill reached the live advisor index, `/doctor:skill-advisor` omits the live `skill_graph_validate` tool from its own declared surface, `leaf-manifest.json` generation is inconsistently owned, and three small but real, fully-diagnosed defects sit in the doctor/create surfaces (route-validate parity, a stale template cross-reference, a missing tool declaration).

### Purpose
Implement Track A from research.md Section 6 — the seven dependency-ordered core recommendations (A1-A7) — so creating a skill and diagnosing its advisor state share one honest, evidence-backed vocabulary instead of tribal knowledge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A1: fix the three zero-design-ambiguity defects (route-validate parity regex, stale template cross-reference, missing `skill_graph_validate` tool declaration)
- A2: wire `skill_graph_validate` into `doctor-skill-advisor.yaml`'s verification phase with the researched severity/field-mapping semantics
- A3: fix `/create:skill-parent`'s leaf-manifest generation to use the scoped generator, not the fleet `--fix` gate
- A4: author the shared `advisor-index-handoff.md` vocabulary contract
- A5: wire the handoff into every resolved create branch (standalone full-create/full-update, parent create/update, narrow leaf-freshness check for reference/asset-only branches)
- A6: add the contract tests (shared vocabulary/output-semantics test + doctor route-contract test)
- A7: state the guardrail (description.json stays descriptive; standalone create never requires parent-hub metadata) in the new shared doc
- Gap remediation (added after initial Complete, same packet, per operator direction "Fix gaps"): the two deferred research findings this packet's own implementation surfaced (G3 fleet-gate blast radius, G4 missing-vs-stale redirect), plus the three pre-existing test failures discovered during T013 verification and confirmed unrelated at the time — now fixed rather than left as known limitations

### Out of Scope
- Track B (Codex-hook/worktree source-selection) — adjacent, independently sequenced, not part of this phase
- Any change to the skill-advisor scorer's ranking internals
- Any change to the compiled-routing runtime engine/guard/sync tooling

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/scripts/route-validate.py` | Modify | Fix stale snake_case regex for the hyphen-case yaml filenames (A1) |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Add `skill_graph_validate` to skill-advisor route (A1) |
| `.opencode/commands/doctor/speckit.md` | Modify | Add `skill_graph_validate` to router allowed-tools (A1) |
| `.opencode/commands/create/skill-parent.md` | Modify | Fix stale `assets/skill/` -> `assets/parent-skill/` cross-reference (A1) |
| `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` | Modify | Wire graph-validation semantics into verification phase (A2) |
| `.opencode/commands/create/assets/create-skill-parent-auto.yaml` | Modify | Scoped leaf-manifest generation (A3) |
| `.opencode/commands/create/assets/create-skill-parent-confirm.yaml` | Modify | Same fix mirrored for `:confirm` — discovered during implementation; shares the same presentation template as `-auto.yaml` and had the identical omission (A3, A5b) |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md` | Create | Shared vocabulary contract (A4) |
| `.opencode/commands/create/assets/create-skill-auto.yaml`, `create-skill-confirm.yaml`, `create-skill-presentation.txt`, `create-skill-parent-auto.yaml`, `create-skill-parent-confirm.yaml`, `create-skill-parent-presentation.txt` | Modify | Wire handoff fields into every resolved create branch (A5) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/advisor-index-handoff-contract.test.cjs`, `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | Create | Contract tests (A6) |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerate | Refresh sk-doc's own manifest after adding `advisor-index-handoff.md` |
| `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | Modify | Add missing `s-class-config-defaults.json` to the fixture-copy list (gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | Remove stray `manual` graph-metadata key, expand `intent_signals` to 8, scope the class gate's `--fix` via `--skill` (G3, gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json`, `assets/parent-skill/parent-skill-graph-metadata-template.json` | Modify | Remove the same stray `manual` key from both hand-authored templates (gap fix) |
| `.opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modify | Replace hardcoded `010-live-activation` with dynamic `*-live-activation` discovery (gap fix) |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Point `MISSING_GENERATED_FILE` violations at the scoped generator (G4, gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Add `--skill <name>` scoping flag (G3, gap fix) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A1: three zero-ambiguity defects fixed | `route-validate.sh` exits 0 with 10/10 routes validated |
| REQ-002 | A2: `skill_graph_validate` produces the researched `pass/warn/fail/unavailable` semantics in the doctor workflow | Doctor verification phase reads `isValid`/`errorCount`/`warningCount` and derives the documented status |
| REQ-003 | A4/A5: shared vocabulary contract authored and wired into every resolved create branch | `advisor-index-handoff.md` exists; standalone full-create/full-update and parent create/update each render the handoff fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A3: leaf-manifest generation uses the scoped generator | `create-skill-parent-auto.yaml` invokes `generate-leaf-manifest.cjs --write <skillDir>`, not the fleet `--fix` gate |
| REQ-005 | A6: contract tests exist and pass | New/updated test file(s) exercise the shared vocabulary and the doctor route-contract subset check |
| REQ-006 | Gap remediation: G3/G4 fixed, all 3 pre-existing test failures fixed | `--skill` scoping proven end-to-end (sibling root byte-identical before/after); missing-manifest message includes the redirect; `sk-create-skill` (17/17), `doctor/scripts` (5/5), and `test_create_skill_contract.py` (23/23) all pass with zero pre-existing failures remaining |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `route-validate.sh`, `parent-skill-check.cjs`, and the existing create/doctor test suites all still pass after every change
- **SC-002**: A skill created via `/create:skill-parent` reports, in its own completion output, whether the advisor index reflects it — never silently
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | research.md Section 6 Track A | All design decisions already made by the 20-iteration research; this phase implements, does not redesign | Cite the relevant theme/finding in each commit |
| Risk | YAML workflow asset edits are easy to desync from their presentation .txt counterpart | Silent doc/behavior drift | Re-run route-validate.sh / relevant asset checks after every YAML edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Canonical-contract artifact shape (Markdown-only vs Markdown+fixture) — deferred to implementation judgment per research.md Section 4, resolved as Markdown-only for A4 given no consumer currently needs a machine-readable form.
<!-- /ANCHOR:questions -->
