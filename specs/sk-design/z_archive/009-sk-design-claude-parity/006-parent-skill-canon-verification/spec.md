---
title: "Feature Specification: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization"
description: "Executed Level 2 specification re-verifying sk-design against sk-doc's canonical parent-hub pattern after the Claude-parity refactor, and deciding whether the procedures/ companion-directory pattern becomes sk-doc canon or stays sk-design-local."
trigger_phrases:
  - "parent-skill canon verification"
  - "sk-design canon re-verification"
  - "procedures pattern formalization"
  - "proceduresPath companion directory"
  - "parent-skill-check.cjs re-run"
  - "sk-doc canon gap"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed Phase 006 canon verification and accepted ADR-001."
    next_safe_action: "Phase 007 should follow the sk-design-local procedure-card template path."
---
# Feature Specification: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Completed** | 2026-07-06 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope** | This Phase 006 folder only; read-only audit of `.opencode/skills/sk-design/**` and `.opencode/skills/sk-doc/references/skill_creation/**`; zero `sk-design`, `sk-doc`, or command file edits were performed |
| **Depends On** | `005-parity-benchmark-release-gate/` documentation and automated router-mode benchmark closed with a **CONDITIONAL** release verdict (see `release-report.md` §7); Phase 006 depends only on that documentation-level closure and on a fresh `parent-skill-check.cjs` run, not on Phase 005's outstanding live/manual/browser evidence gaps, which remain the operator's responsibility |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../005-parity-benchmark-release-gate/spec.md |
| **Successor Phase** | ../007-procedure-card-template-alignment/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 001-005 refactored `sk-design` toward Claude Design-like manager behavior while preserving the OpenCode-native parent-hub shape: one advisor identity, registry-driven routing, five public modes. Phase 003 introduced a `procedures/` companion directory inside all five workflow-mode packets (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) plus `shared/procedures/`, backed by a new `proceduresPath` field on every mode entry in `mode-registry.json` and a local `procedure_card_schema.md`. Two things are unverified now that the refactor has landed: (1) whether `sk-design` still satisfies every hard and canon invariant in the authoritative `parent-skill-check.cjs` checker, proven with fresh, phase-owned evidence rather than evidence gathered before this phase existed, and (2) whether the `procedures/` + `proceduresPath` pattern belongs in sk-doc's canonical parent-hub reference (`parent_skills_nested_packets.md`) as a reusable pattern, or should stay a deliberate sk-design-local convention. Neither the checker's directory-reverse-consistency check (6a, which only reconciles hub-root child directories) nor its companion-file checks (7-9, which only look at hub-root `changelog/`, `description.json`, `manual_testing_playbook/`, and `benchmark/`) inspect packet-local subdirectories, so the pattern is currently invisible to automated canon enforcement regardless of how the second question is answered.

### Purpose

Re-verify `sk-design` against the canon checker with fresh, phase-owned evidence, audit the `procedures/`/`proceduresPath` pattern against sk-doc's canonical reference and the other two hubs it documents (`sk-code`, `deep-loop-workflows`), and record one explicit, evidence-based ADR deciding formalize-vs-local-convention so Phase 007 (`procedure-card-template-alignment`) knows whether it is building an sk-doc-wide template or an sk-design-local one.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fresh, phase-owned execution of `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` (default STRICT mode) with the full PASS/FAIL/WARN transcript and exit code captured in this phase's own evidence, not reused from prior grounding.
- Read-only audit of `.opencode/skills/sk-design/mode-registry.json` for `proceduresPath` presence and consistency across all five workflow modes.
- Read-only inventory of the six `procedures/` directories (five mode-local plus `shared/procedures/`) confirming card counts and required-field coverage against `.opencode/skills/sk-design/shared/procedure_card_schema.md`.
- Read-only comparison of `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` §4 (Three Hubs Extension Matrix) and §6 (Companion file policy) against current `sk-design`, `sk-code`, and `deep-loop-workflows` hub contents to confirm cross-hub adoption status (Rule-of-Three test).
- One decision-record ADR on formalize-vs-local-convention, including alternatives considered, a Five Checks evaluation, and explicit consequences for Phase 007 scope.
- Explicit Phase 007 handoff criteria naming which template family (sk-doc-wide vs. sk-design-local) Phase 007 must design against.

### Out of Scope

- Any edit to `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**`. If the ADR favors formalization, the canon-doc edit is future work for a later phase, not performed in Phase 006 (this phase already found the checker passing, so it is verification, not remediation).
- Any change to `parent-skill-check.cjs` or its rule set, including adding a new `procedures/`-aware check.
- Reshuffling, editing, or grading the content of the existing 14 procedure cards.
- Resolving Phase 005's outstanding live/manual/browser evidence gaps; those remain operator-owned per `release-report.md` §5-7.
- The parallel `.opencode/commands/design/**` asset-refactor track tracked elsewhere in this spec tree (`013-design-commands-asset-refactor`); unrelated to hub/packet canon.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Update | Completion status and executed evidence references |
| `plan.md` | Update | Completed quality gates and execution state |
| `tasks.md` | Update | Completed task markers and evidence summary |
| `checklist.md` | Update | P0/P1/P2 evidence and gate status |
| `decision-record.md` | Update | ADR-001 accepted formalize-vs-local decision |
| `implementation-summary.md` | Create | Final evidence, files changed, and verification results |
| `description.json` | Regenerate | Discovery metadata for this phase packet |
| `graph-metadata.json` | Regenerate | Graph metadata and source hashes for this phase packet |

No `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**` file is planned as an edit in this phase.

### Canon Verification Targets

| Target | Planned Verification | Evidence (when executed) |
|--------|----------------------|---------------------------|
| Structural canon (checks 1-9) | Fresh run of `parent-skill-check.cjs .opencode/skills/sk-design` | Exit code 0; 22 PASS rows; 0 warnings; final `OK: parent-skill-check — all hard invariants passed, 0 warnings` recorded in `implementation-summary.md` |
| `proceduresPath` registry consistency | Confirm all five workflow modes declare `proceduresPath` pointing at an existing `procedures/` directory | `mode-registry.json` lines 43-45, 63-65, 83-85, 103-105, and 123-125; 14-card inventory across six procedure buckets |
| Procedure-card schema compliance | Sample-check card files against `procedure_card_schema.md`'s required-field order | Six sampled cards show required fields in order: one per mode plus `shared` |
| Canon-doc gap | Confirm `parent_skills_nested_packets.md` §4/§6 do not currently document `procedures/`/`proceduresPath` | §4 sk-design row mentions transform-verbs only; §6 companion policy lists hub/packet companion files and shared directories but omits `procedures/`/`proceduresPath` |
| Rule-of-Three cross-hub check | Confirm `sk-code` and `deep-loop-workflows` do not use a `procedures/` companion directory | `Grep` for `proceduresPath|procedures/` under both hubs returned no files; adopted-by count is 1 of 3 documented hubs |
| Formalize-vs-local decision | Record ADR-001 with recommendation and rationale | `decision-record.md` status moved to Accepted |
| Phase 007 handoff | State template scope (sk-doc-wide vs. sk-design-local) explicitly | This spec's Related Documents section and `implementation-summary.md` continuation notes state sk-design-local |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-001 | Phase 005 documentation-level closure verified as go signal | Phase 005 `spec.md` Status field and `release-report.md` §7 are read and cited; Phase 006 does not block on Phase 005's outstanding live/manual/browser gaps |
| REQ-002 | Fresh canon-checker run captured | `parent-skill-check.cjs` output, exit code, and PASS/FAIL/WARN counts for `sk-design` are recorded as this phase's own evidence |
| REQ-003 | `proceduresPath` consistency confirmed | All five workflow modes in `mode-registry.json` declare a `proceduresPath` that resolves to an existing directory |
| REQ-004 | Canon-doc gap confirmed | `parent_skills_nested_packets.md` §4 and §6 are read and shown to omit `procedures/`/`proceduresPath` before any formalization decision is made |
| REQ-005 | Formalize-vs-local ADR recorded | `decision-record.md` contains one ADR with a stated status, alternatives, and a Five Checks evaluation |
| REQ-006 | Phase 007 handoff is explicit | This spec and `implementation-summary.md` (once created) state which template family Phase 007 must design against |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-007 | Rule-of-Three cross-hub evidence captured | `sk-code` and `deep-loop-workflows` are checked for a `procedures/` companion directory and the result is recorded |
| REQ-008 | Card-schema compliance sampled | At least one card per owning mode is checked against `procedure_card_schema.md`'s required-field list |
| REQ-009 | No scope creep into remediation | Docs state plainly that this phase performs verification and decision-making only, with zero `sk-design`/`sk-doc`/`commands` file edits |
| REQ-010 | Verification commands are listed | `plan.md`, `tasks.md`, and `checklist.md` name the exact checker, grep, and directory-search commands to run |
| REQ-011 | Rollback path is non-destructive first | `plan.md` names diff/status inspection first, matching every other phase in this packet |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Result |
|-----------|--------|
| **SC-001** Phase 006 docs and metadata exist and validate as a Level 2 child packet | Complete; strict validation evidence is recorded in `implementation-summary.md` |
| **SC-002** The canon checker is re-run fresh for this phase rather than relying on pre-existing grounding evidence | Complete; fresh checker output and exit code recorded in `implementation-summary.md` |
| **SC-003** The `procedures/` pattern's canon-doc gap is confirmed with direct reads, not assumption | Complete; §4/§6 read and summarized in `implementation-summary.md` |
| **SC-004** The Rule-of-Three cross-hub check is performed before any formalization recommendation | Complete; only `sk-design` uses the pattern, so ADR-001 keeps it local |
| **SC-005** Exactly one ADR decision is recorded, with clear consequences for Phase 007 scope | Complete; ADR-001 accepted and Phase 007 handoff is sk-design-local |
| **SC-006** No `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**` file is edited by this phase | Complete; final negative-control review recorded in `implementation-summary.md` |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 documentation closure | Phase 006 depends on Phase 005's doc-level closure only | Read Phase 005 `spec.md` Status and `release-report.md` §7 before starting |
| Dependency | Live `sk-design` and `sk-doc` state at execution time | Canon evidence can drift between this planning pass and execution | Re-run the checker and re-read canon docs at execution time rather than trusting this plan's grounding |
| Risk | Premature formalization | Promoting a one-hub pattern to sk-doc-wide canon before a second adopter risks a wrong-abstraction outcome | ADR explicitly tests cross-hub adoption (Rule of Three) before recommending formalization |
| Risk | Checker/canon-doc drift left unaddressed | If formalization is deferred indefinitely, the pattern stays invisible to automated enforcement | ADR names an explicit reconsideration trigger (a second hub adopting the pattern) |
| Risk | Phase 007 scope ambiguity | Without an explicit decision, Phase 007 cannot decide whether it edits `sk-doc` or stays sk-design-local | This phase's handoff section states the answer explicitly |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Verification requirements map to the canon checker's own check numbers (1-9) and to the two named `parent_skills_nested_packets.md` sections.
- **NFR-T02**: The ADR explicitly hands scope detail to Phase 007 rather than embedding template design decisions in this phase.

### Maintainability
- **NFR-M01**: This phase stays read-only audit plus one decision; no mode-packet or checker logic is touched.
- **NFR-M02**: The ADR's reconsideration trigger is stated in the open, not buried in prose.

### Safety
- **NFR-S01**: No `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**` file is edited by this phase.
- **NFR-S02**: Rollback requires non-destructive diff/status inspection first and explicit approval before any destructive recovery.

### Verification
- **NFR-V01**: Strict spec validation runs after metadata regeneration.
- **NFR-V02**: The canon checker's exit code is recorded verbatim, not paraphrased.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **`sk-design` state drifts before execution**: Re-run the checker and re-read the registry/procedures directories at execution time instead of trusting this plan's grounding.
- **A sixth mode or a new `procedures/`-adjacent directory appears before execution**: Re-run the inventory commands and update counts before citing them as evidence.

### Error Scenarios
- **Checker reports a new FAIL not seen in this plan's grounding**: Treat it as a fresh finding, not something this phase remediates; hand off to a remediation phase if needed.
- **Canon-doc sections have moved or been renamed**: Locate the current section by content, not assumed line numbers, before citing a gap.

### Concurrent Operations
- **Sibling phase or parent-level dirty-tree changes exist**: Preserve them; Phase 006 writes stay inside this phase folder only.
- **Phase 007 folder does not yet exist at plan time**: The forward link in Phase Navigation and the parent's Phase Documentation Map are descriptive pointers, not proof of existence.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Does the repository owner want the ADR's reconsideration trigger (a second hub adopting `procedures/`) tracked anywhere beyond this decision record?
- Should an eventual sk-doc-wide promotion, if a second hub ever adopts the pattern, also update `parent-skill-check.cjs` in the same phase, or land as a documentation-only change first?
- Should the recommended Three Hubs Extension Matrix Notes-column accuracy update (named in `decision-record.md` as future, out-of-phase work) be tracked as a follow-up ticket now, or deferred until a second-hub adoption actually triggers reconsideration?

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Phase**: `../005-parity-benchmark-release-gate/`
- **Successor Phase (handoff)**: `../007-procedure-card-template-alignment/` — Phase 007 must design an **sk-design-local** procedure-card template, per accepted ADR-001, not a new `sk-doc`-wide template family.
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`

<!-- /ANCHOR:related-docs -->
