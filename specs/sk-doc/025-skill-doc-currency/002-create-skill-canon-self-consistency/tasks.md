---
title: "Tasks: create-skill-canon-self-consistency"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "canon consistency tasks"
  - "authority proof task"
  - "scaffold rehearsal task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-skill-canon-self-consistency

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Re-verify flags: the seven `§` registry-supplementary items (`RE-006-02`, `-10`, `-11`, `-12`, `-13`, `-14`, `-15`) reached this phase through a dedupe collision, so neither their currency nor their novelty was independently checked — each needs its own evidence line, and **batch-editing them is forbidden**. Four of the fifteen registry findings are ID pairs describing one defect each; confirm the surface, not the ID count
- [ ] T002 **Authority proof.** Read the root-metadata contract and its executable module in full and record whether they are the authoritative side. If the contract is itself stale — for example if a later decision reinstated the requirement and only the contract missed it — **halt and escalate with both facts and the decision needed.** Do not pick a side and edit
- [ ] T003 [P] Inventory every existing companion-metadata placeholder file across all skill roots, so a new one is detectable afterwards (`<packet>/baselines/`)
- [ ] T004 [P] Record the pre-edit fleet-gate result for the affected hub roots (`<packet>/baselines/`)
- [ ] T005 [P] Record the pre-edit packaging-script result over two or three real skills (`<packet>/baselines/`)
- [ ] T006 [P] Record the pre-edit router-test result, before any alias normalization (`<packet>/baselines/`)
- [ ] T007 Rule DR-4: is the workflow section required or advisory? The ruling must cover the prose **and** the validator together — the finding warns explicitly against a validator-only change (`decision-record.md`) — **[OPERATOR-DECISION: DR-4]**
- [ ] T008 Rule DR-5: is the per-hub extension matrix generated from each registry, or explicitly labelled illustrative and non-authoritative? The ruling governs four documents, not one (`decision-record.md`) — **[OPERATOR-DECISION: DR-5]**
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — the companion-metadata contradiction

- [ ] T009 Rewrite the doctrine's companion-file policy to defer to the module rather than restate it (`sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`) — `RE-001-01`, `RE-009-02`
- [ ] T010 Remove the mandate from the creation workflow (`sk-create-skill/SKILL.md`) — `RE-001-02`, `RE-009-01`
- [ ] T011 Remove the requirement from the hub template (`sk-create-skill/assets/parent-skill/parent-skill-hub-template.md`) — `RE-001-03`, `RE-009-03`
- [ ] T012 Rewrite the scaffold preamble to state when the file is warranted (`sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json`) — `RE-001-04`
- [ ] T013 Grep the whole packet for other statements of the same policy and fold them into deference; the four reported surfaces are not assumed to be all of them — `REQ-002`

### Lane B — remaining canon self-contradictions

- [ ] T014 [P] [B] Match the template's frontmatter labels to the packaging script's required-field list. Blocked on T005's baseline (`sk-create-skill/assets/skill/skill-md-template.md`) — `RE-001-06`
- [ ] T015 [P] Match the hub template's resource-directory language to the packet's own conditional prose (`sk-create-skill/assets/parent-skill/parent-skill-hub-template.md`) — `RE-001-07`
- [ ] T016 [P] Fix the naming-rule example so no filename appears in both the valid and invalid columns (`sk-create-skill/assets/skill/skill-reference-template.md`) — `RE-009-05`
- [ ] T017 [P] [B] Apply the DR-5 ruling to the doctrine's extension matrix (`sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`) — `RE-001-05`, **[OPERATOR-DECISION: DR-5]**
- [ ] T018 [B] Apply the DR-4 ruling to the prose and the validation together; do not change one alone (`sk-create-skill/scripts/package_skill.py` and the governing workflow prose) — `RE-009-06`, **[OPERATOR-DECISION: DR-4]**
- [ ] T019 Record why the mechanical gate cannot catch this class of defect, as the rationale for the conformance test (`spec.md` evidence, no code change) — `RE-001-08`

### Lane C — the hub's own front door

- [ ] T020 [P] Replace the retired directory tree in the hub README and in the default fallback resource the router serves for an ambiguous request (`sk-doc/README.md`, `sk-doc/shared/references/quick-reference.md`) — `RE-006-01`
- [ ] T021 [P] § Realign the shared canonical standards with the current templates and repair every related-resource link (`sk-doc/shared/references/core-standards.md`) — `RE-006-02`
- [ ] T022 [P] § Resolve the orphaned second-layer router: delete it, or rewrite it with frontmatter, an owner, and language that does not contradict the hub's routing contract. **Check for consumers first — if something reads it, this is a migration, not a removal** (`sk-doc/shared/references/smart-routing.md`) — `RE-006-14`
- [ ] T023 § Normalize the mode-registry aliases to the contract's lowercase convention **together with** every consumer, router test and generated index that reads them (`sk-doc/mode-registry.json`) — `RE-006-13`

### Lane D — registry-supplementary canon and template drift

- [ ] T024 [P] § Replace the asset template's embedded classification example with current section names and the canonical version shape, labelled illustrative (`sk-create-skill/assets/skill/skill-asset-template.md`) — `RE-006-10`
- [ ] T025 [P] [B] § Apply the DR-5 ruling to the three further documents that restate a sibling hub's mode topology (`sk-create-quality-control/references/workflows.md`, `sk-create-skill/assets/skill/skill-procedure-template.md`, `sk-create-skill/references/parent-skill/parent-hub-router-schema.md`) — `RE-006-11`, **[OPERATOR-DECISION: DR-5]**
- [ ] T026 [P] § Correct the version examples to the component count the metadata contract accepts (`sk-create-skill/references/skill/examples-and-maintenance.md`) — `RE-006-12`
- [ ] T027 [P] § Replace the hyphen-to-underscore guidance with the current convention, and distinguish a legacy compatibility warning from a required correction (`sk-create-quality-control/references/validation-and-enforcement.md`) — `RE-006-15`

### Lane E — the durable half

- [ ] T028 Build the conformance test: parse the class sets from the module and the requirement tables from the prose, fail on disagreement, and **fail on a side it cannot read** (`sk-create-skill/scripts/`) — `REQ-003`
- [ ] T029 Prove the conformance test works by introducing a deliberate mismatch and observing the failure, then removing it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Guardrail assertion: no companion-metadata placeholder file exists that was not in the T003 inventory, and the standalone-class skill still has none — `RE-003-06`, `REQ-004`
- [ ] T031 Scaffold a throwaway command-less hub from the repaired template; assert it emits no placeholder file and passes `parent-skill-check.cjs`; then remove it — `REQ-005`
- [ ] T032 Re-run the packaging script over the same sample skills; report the delta against T005, not just the final state
- [ ] T033 Re-run the router tests; report the delta against T006
- [ ] T034 Path-existence assertion over every directory named in the hub README and the default fallback resource; zero unresolvable — `REQ-010`
- [ ] T035 Confirm every one of the 22 scope items reached exactly one terminal state, each supplementary item with its own evidence line
- [ ] T036 Notify the two wave-2 phases that the canon rulings they cite are signed
- [ ] T037 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The authority proof is recorded, not assumed
- [ ] Every delta claim anchored to a recorded pre-edit number
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` — scaffolded at copy time, populated by T007 and T008
<!-- /ANCHOR:cross-refs -->
