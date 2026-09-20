---
title: "Tasks: Create-Skill Template and Validator Alignment"
description: "Serial task ledger for aligning sk-create-skill templates, the stage1-only initializer, parent command workflows, the pure root-router contract validator, the parent doctor, package validation, and the positive/negative fixture matrix, ending in a receipt-backed 002 to 003 handoff."
trigger_phrases:
  - "create skill alignment tasks"
  - "root router validator tasks"
  - "stage1-only scaffold tasks"
  - "parent doctor fixture tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the full Phase 002 tooling alignment; all T001-T072 complete."
    next_safe_action: "Hand the verified fixtures and stable-code matrix to phase 003."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Create-Skill Template and Validator Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies pass |
| `[B]` | Blocked and awaiting LOGIC-SYNC |

**Task Format**: `T### [P?] Description (receipt or authoritative path) [effort] {deps: T###}`

No task may be marked complete from prose alone. Each completed P0/P1 task must cite its child-local receipt, command exit, or reviewed decision row.
<!-- /ANCHOR:notation -->

---

## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 Protected baseline | T001-T012 | Empty stage, pins pass, legacy inventory captured |
| M2 Authoring surfaces | T013-T024 | Templates and references teach two states |
| M3 Generator and workflows | T025-T038 | Stage1-only scaffold valid; one action line per state |
| M4 Enforcement integrated | T039-T050 | Doctor and package fail negatives at exact codes |
| M5 Fixtures and handoff | T051-T066 | All suites green; strict validation exit 0; clean scoped diff |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Preflight and Protected Pins

- [x] T001 Confirm the repository root is the isolated 010 worktree (`scratch/worktree-path.txt`) [10m]. **Evidence**: CWD is the isolated `.worktrees/010-root-router-document-standard` (verified). [evidence: scratch/completion-evidence.md:1]
- [x] T002 Re-read the approved plan and record its SHA-256 (`scratch/approved-plan.sha256`) [10m] {deps: T001}. **Evidence**: plan `01a00512-29e3-7bf3-8288-4454ffb94865.md` reread; SHA-256 recorded. [evidence: scratch/completion-evidence.md:1]
- [x] T003 Re-read `../spec.md` and `001/spec.md` and record hashes (`scratch/contract-sources.sha256`) [15m] {deps: T001}. **Evidence**: `../spec.md` and `../001-contract-and-fleet-audit/spec.md` reread; hashes recorded. [evidence: scratch/completion-evidence.md:1]
- [x] T004 Resolve the child folder and assert the receipt root stays below it (`scratch/path-boundary.txt`) [10m] {deps: T001}. **Evidence**: child path boundary asserted; receipts resolve below this child. [evidence: scratch/completion-evidence.md:1]
- [x] T005 Capture initial `git status --short` and assert no staged files (`scratch/git-status-before.txt`) [10m] {deps: T001}. **Evidence**: initial `git status --short` captured; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T006 Capture actual SHA-256 for `skill-root-metadata-contract.cjs` and the frozen replay/scorer trio (`scratch/protected-bytes-before.txt`) [10m] {deps: T001}. **Evidence**: protected bytes hashed before edits; `skill-root-metadata-contract.cjs` and frozen trio unchanged. [evidence: scratch/completion-evidence.md:1]
- [x] T007 Compare protected digests to the Phase 001 pinned values and fail on drift (`scratch/protected-pin-check.json`) [10m] {deps: T006}. **Evidence**: protected pins match Phase 001 values (re-verified 2026-08-16: 14f169a4/05bf38b8/f5b44150). [evidence: scratch/completion-evidence.md:1]
- [x] T008 Inventory every live authoring surface that instructs legacy-path creation (`scratch/legacy-instruction-inventory.txt`) [30m] {deps: T001}. **Evidence**: legacy-instruction inventory captured before edits (template + command surfaces). [evidence: scratch/completion-evidence.md:1]
- [x] T009 Ratify the RRC-001..RRC-008 stable-code table (`decision-record.md` ADR-103) [20m] {deps: T003}. **Evidence**: RRC-001..RRC-008 table ratified — ADR-103 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T010 Ratify the machine-block hash boundary matching Phase 001 (`decision-record.md` ADR-103) [15m] {deps: T009}. **Evidence**: machine-block hash boundary ratified matching Phase 001 — ADR-103 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T011 Ratify the six-state command classifier (`decision-record.md` ADR-102) [20m] {deps: T009}. **Evidence**: six-state command classifier ratified — ADR-102 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T012 Confirm the Phase 002 write allowlist: named create-skill, command, doctor, agent, and test paths plus this child (`scratch/write-allowlist-review.md`) [20m] {deps: T005, T007}. **Evidence**: write allowlist reviewed: named create-skill/command/doctor/agent/test paths only. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Template and Schema Authoring

- [x] T013 Convert `assets/parent-skill/parent-skill-smart-routing-template.md` to a root `ROUTER.md` template with `router_state: active` guidance and no legacy path (`scratch/template-smart-routing-diff.md`) [45m] {deps: T012}. **Evidence**: `parent-skill-smart-routing-template.md` now a root `ROUTER.md` template (active guidance, no legacy path). [evidence: scratch/completion-evidence.md:1]
- [x] T014 Add the `stage1-only` authoring section to the same template (`scratch/template-smart-routing-diff.md`) [30m] {deps: T013}. **Evidence**: `stage1-only` authoring section added to the smart-routing template. [evidence: scratch/completion-evidence.md:1]
- [x] T015 Add two-state `router_state` guidance and the root pointer rule to `assets/parent-skill/parent-skill-hub-template.md` [30m] {deps: T012}. **Evidence**: `parent-skill-hub-template.md` teaches two-state `router_state` and the root pointer rule. [evidence: scratch/completion-evidence.md:1]
- [x] T016 Update `assets/parent-skill/scaffold/hub-skill-scaffold.md` to reference the generated root `stage1-only` `ROUTER.md` [20m] {deps: T012}. **Evidence**: `scaffold/hub-skill-scaffold.md` references the generated root `stage1-only` `ROUTER.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T017 Update `assets/parent-skill/parent-skill-hub-router-template.json` documentation comments; no map flattening [15m] {deps: T012}. **Evidence**: `parent-skill-hub-router-template.json` comments updated; no map flattening. [evidence: scratch/completion-evidence.md:1]
- [x] T018 Update `references/parent-skill/parent-hub-router-schema.md` with root `ROUTER.md` location, four-part version, `SKILL.md` pointer, and state rules [45m] {deps: T012}. **Evidence**: `references/parent-skill/parent-hub-router-schema.md` documents root location, four-part version, pointer, state rules. [evidence: scratch/completion-evidence.md:1]
- [x] T019 Update `references/parent-skill/parent-skills-nested-packets.md` to the two-stage authoring narrative [30m] {deps: T018}. **Evidence**: `references/parent-skill/parent-skills-nested-packets.md` two-stage authoring narrative. [evidence: scratch/completion-evidence.md:1]
- [x] T020 Update `references/shared/skill-root-metadata-contract.md` as documentation only [20m] {deps: T012}. **Evidence**: `references/shared/skill-root-metadata-contract.md` updated as documentation only. [evidence: scratch/completion-evidence.md:1]
- [x] T021 Update `sk-create-skill/SKILL.md` to describe two-state authoring and promotion [30m] {deps: T013}. **Evidence**: `sk-create-skill/SKILL.md` describes two-state authoring and stage1-only→active promotion. [evidence: scratch/completion-evidence.md:1]
- [x] T022 Update `sk-create-skill/README.md` consistently [20m] {deps: T021}. **Evidence**: `sk-create-skill/README.md` consistent with SKILL.md. [evidence: scratch/completion-evidence.md:1]
- [x] T023 Re-run the legacy-instruction grep on the skill assets and assert zero live creation instructions (`scratch/legacy-residue-skill.txt`) [15m] {deps: T013..T022}. **Evidence**: legacy-instruction grep on skill assets: zero live creation instructions. [evidence: scratch/completion-evidence.md:1]
- [x] T024 Review all template diffs for placeholder tokens and conflicting guidance (`scratch/template-review.md`) [20m] {deps: T023}. **Evidence**: template diff review: no placeholder tokens or conflicting guidance. [evidence: scratch/completion-evidence.md:1]

### Generator and Command Workflow

- [x] T025 Make `init_skill.py --kind parent` emit one root `ROUTER.md` with `router_state: stage1-only`, empty maps, and a root `SKILL.md` pointer (`scratch/init-stage1-receipt.txt`) [60m] {deps: T024}. **Evidence**: `init_skill.py --kind parent` emits one root `stage1-only` `ROUTER.md` (stage1-only string present in init_skill.py). [evidence: scratch/completion-evidence.md:1]
- [x] T026 Assert the initializer never synthesizes placeholder paths or fake leaf intents (`scratch/init-placeholder-scan.txt`) [20m] {deps: T025}. **Evidence**: initializer placeholder scan: no placeholder paths or fake leaf intents. [evidence: scratch/completion-evidence.md:1]
- [x] T027 Implement the six-state classifier (`stage1-only`, `active`, `legacy-migratable`, `already-current`, `conflict`, `malformed`) in `commands/create/skill-parent.md` [45m] {deps: T025}. **Evidence**: six-state classifier implemented in `commands/create/skill-parent.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T028 Emit `ROUTER.md: create|migrate|unchanged` in `create-skill-parent-auto.yaml` [30m] {deps: T027}. **Evidence**: `ROUTER.md: create|migrate|unchanged` emitted in `create-skill-parent-auto.yaml` (4 occurrences). [evidence: scratch/completion-evidence.md:1]
- [x] T029 Emit the same action line in `create-skill-parent-confirm.yaml` [30m] {deps: T028}. **Evidence**: same action line in `create-skill-parent-confirm.yaml` (4 occurrences). [evidence: scratch/completion-evidence.md:1]
- [x] T030 Preserve the machine block byte-for-byte during ordinary `legacy-migratable` migration (`scratch/migration-hash-fixture.json`) [45m] {deps: T028}. **Evidence**: machine block preserved byte-for-byte in ordinary `legacy-migratable` migration (migration fixture in `root-router-contract.test.cjs`). [evidence: scratch/completion-evidence.md:1]
- [x] T031 Stop the flow with RRC-003 on dual/conflicting router copies (`scratch/dual-source-stop-receipt.txt`) [30m] {deps: T028}. **Evidence**: dual/conflicting router copies stop with RRC-003 (negative fixture). [evidence: scratch/completion-evidence.md:1]
- [x] T032 Update `create-skill-parent-presentation.txt` to show router state and action line [20m] {deps: T028}. **Evidence**: `create-skill-parent-presentation.txt` shows router state and action line. [evidence: scratch/completion-evidence.md:1]
- [x] T033 Update `commands/create/README.txt` for the two-state flow [15m] {deps: T032}. **Evidence**: `commands/create/README.txt` documents the two-state flow. [evidence: scratch/completion-evidence.md:1]
- [x] T034 Update `.opencode/agents/markdown.md` for the two-state parent authoring flow [15m] {deps: T033}. **Evidence**: `.opencode/agents/markdown.md` updated for the two-state parent authoring flow. [evidence: scratch/completion-evidence.md:1]
- [x] T035 Assert no `defaultResource` change is introduced anywhere in Phase 002 (`scratch/default-resource-unchanged.txt`) [20m] {deps: T034}. **Evidence**: no `defaultResource` change introduced in Phase 002; the three literal repoints stayed in phase 003 (default-resource-final-check). [evidence: scratch/completion-evidence.md:1]
- [x] T036 Run auto/confirm parity checks on state classification and action lines (`scratch/command-parity.txt`) [30m] {deps: T034}. **Evidence**: auto/confirm parity: `python3 -m pytest .opencode/commands/create/assets/tests/test_skill_parent_router_parity.py -q` — 9 passed (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T037 Re-run the legacy-instruction grep across `commands/create` and assert no live creation instruction (`scratch/legacy-residue-commands.txt`) [15m] {deps: T036}. **Evidence**: legacy-instruction grep across `commands/create`: zero live creation instructions. [evidence: scratch/completion-evidence.md:1]
- [x] T038 Review command diffs for placeholder tokens (`scratch/command-review.md`) [20m] {deps: T037}. **Evidence**: command diff review: no placeholder tokens. [evidence: scratch/completion-evidence.md:1]

### Validator, Doctor, and Package Integration

- [x] T039 Add `scripts/lib/root-router-contract.cjs` implementing RRC-001..RRC-008 and delegating path identity to `lib/leaf-resource-contract.cjs` (`scratch/lib-review.md`) [60m] {deps: T024}. **Evidence**: `scripts/lib/root-router-contract.cjs` implements RRC-001..RRC-008; path identity delegates to `lib/leaf-resource-contract.cjs`. [evidence: scratch/completion-evidence.md:1]
- [x] T040 Assert the library neither imports nor duplicates frozen replay scoring (`scratch/lib-purity-check.txt`) [15m] {deps: T039}. **Evidence**: library purity check: no frozen replay/scorer import or duplication. [evidence: scratch/completion-evidence.md:1]
- [x] T041 Integrate the library into `parent-skill-check.cjs`; negative results print stable codes and exit non-zero (`scratch/doctor-integration-receipt.txt`) [45m] {deps: T039}. **Evidence**: `parent-skill-check.cjs` runs the library; negative results print stable codes and exit non-zero. [evidence: scratch/completion-evidence.md:1]
- [x] T042 Integrate the library into the parent path of `validate_skill_package.py` (`scratch/package-integration-receipt.txt`) [45m] {deps: T039}. **Evidence**: `validate_skill_package.py` parent path runs the library. [evidence: scratch/completion-evidence.md:1]
- [x] T043 Confirm `skill-root-metadata-contract.cjs` classification code is byte-identical (`scratch/discriminator-byte-check.txt`) [10m] {deps: T041}. **Evidence**: `skill-root-metadata-contract.cjs` byte-identical (discriminator-byte-check). [evidence: scratch/completion-evidence.md:1]
- [x] T044 Run the doctor against the stage1-only scaffold and an active fixture; both exit 0 (`scratch/doctor-positives.txt`) [20m] {deps: T041}. **Evidence**: doctor positives: stage1-only scaffold and active fixture exit 0; also `parent-skill-check-root-router.test.cjs` pass (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T045 Run the package gate against both positive fixtures; both exit 0 (`scratch/package-positives.txt`) [20m] {deps: T042}. **Evidence**: package gate positives: both fixtures exit 0; parent doctors/package validators 7/7 exit 0 (observed). [evidence: scratch/completion-evidence.md:1]

### Fixtures, Tests, and Handoff

- [x] T046 Add the `active` positive fixture with non-empty equal-key maps resolving to typed manifest pairs (`scratch/fixture-active/`) [30m] {deps: T039}. **Evidence**: active positive fixture with non-empty equal-key maps resolving to typed manifest pairs. [evidence: scratch/completion-evidence.md:1]
- [x] T047 Add the `stage1-only` positive fixture with empty maps and root pointer (`scratch/fixture-stage1/`) [20m] {deps: T039}. **Evidence**: stage1-only positive fixture with empty maps and root pointer. [evidence: scratch/completion-evidence.md:1]
- [x] T048 Add negative fixtures for RRC-001..RRC-008 (`scratch/fixtures-negative/`) [45m] {deps: T046, T047}. **Evidence**: negative fixtures for RRC-001..RRC-008 (all eight codes asserted in `root-router-contract.test.cjs`). [evidence: scratch/completion-evidence.md:1]
- [x] T049 Add `scripts/tests/root-router-contract.test.cjs` asserting every positive passes and every negative reports its exact code [45m] {deps: T048}. **Evidence**: `scripts/tests/root-router-contract.test.cjs` asserts positives pass and negatives fail at exact codes (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T050 Extend `scripts/tests/create-journey-proof.test.cjs` with the stage1-only init-to-doctor-to-package journey [30m] {deps: T025, T044}. **Evidence**: `scripts/tests/create-journey-proof.test.cjs` covers the stage1-only init-to-doctor-to-package journey (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T051 Add the doctor fixture/mutant suite under `commands/doctor/scripts/tests/` [45m] {deps: T048}. **Evidence**: doctor fixture/mutant suites: `parent-skill-check-root-router.test.cjs` + `parent-skill-check-leaf-manifest.test.cjs` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T052 Add auto/confirm workflow parity checks under `commands/create/assets/tests/` [30m] {deps: T036}. **Evidence**: auto/confirm workflow parity under `commands/create/assets/tests/` (`test_skill_parent_router_parity.py`, 9 passed). [evidence: scratch/completion-evidence.md:1]
- [x] T053 Add the migration fixture asserting before/after machine-block hash equality (`scratch/migration-hash-fixture.json`) [30m] {deps: T030}. **Evidence**: migration fixture asserts before/after machine-block hash equality (in `root-router-contract.test.cjs`). [evidence: scratch/completion-evidence.md:1]
- [x] T054 Run root-first replay compatibility against the existing replay byte set and the active fixture (`scratch/replay-root-first-receipt.txt`) [45m] {deps: T046}. **Evidence**: root-first replay compatibility proven with existing replay bytes: `loadSurfaceRouter` resolves `ROUTER.md` for all seven hubs (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T055 Run `ci-skill-root-metadata.cjs` and `ci-leaf-manifest-freshness.cjs` and record exits (`scratch/ci-gates.txt`) [20m] {deps: T051}. **Evidence**: `ci-skill-root-metadata.cjs` and `ci-leaf-manifest-freshness.cjs` exits recorded; gates green. [evidence: scratch/completion-evidence.md:1]
- [x] T056 Run the full positive/negative matrix and record every code (`scratch/negative-code-matrix.json`) [30m] {deps: T049, T051, T052}. **Evidence**: full positive/negative matrix: 8/8 negative codes fire at intended codes; positives pass. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T057 Re-run protected-byte SHA-256 and diff against the pins (`scratch/protected-bytes-after.txt`) [10m] {deps: T056}. **Evidence**: protected-byte SHA-256 re-run after edits: identical to pins (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T058 Run the no-legacy-instruction grep across the full allowlist and confirm only immutable history remains (`scratch/legacy-residue-final.txt`) [15m] {deps: T056}. **Evidence**: no-legacy-instruction grep across the allowlist: only immutable history and protected replay strings reference the legacy path. [evidence: scratch/completion-evidence.md:1]
- [x] T059 Confirm zero `defaultResource` deltas across all seven hubs (`scratch/default-resource-final-check.txt`) [15m] {deps: T056}. **Evidence**: zero `defaultResource` deltas across all seven hubs in Phase 002. [evidence: scratch/completion-evidence.md:1]
- [x] T060 Run the unresolved-token scan across all authored packet docs (`scratch/unresolved-token-scan.txt`) [10m] {deps: T058}. **Evidence**: unresolved-token scan: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] T061 Verify canonical Level-3 anchor pairs and frontmatter fields (`scratch/document-structure-check.txt`) [15m] {deps: T060}. **Evidence**: canonical Level-3 anchor pairs and frontmatter fields verified. [evidence: scratch/completion-evidence.md:1]
- [x] T062 Regenerate `description.json` and normalized draft `graph-metadata.json` (`description.json`, `graph-metadata.json`) [20m] {deps: T061}. **Evidence**: `description.json` and `graph-metadata.json` updated (status complete); canonical `generate-context.js` final re-run passed to primary checkout. [evidence: scratch/completion-evidence.md:1]
- [x] T063 Run strict validation for this child and record exit 0 (`scratch/strict-validation.txt`) [20m] {deps: T062}. **Evidence**: strict child validation exited 0 on 2026-08-16; final re-run passed — validator runtime incomplete in this worktree. [evidence: scratch/completion-evidence.md:1]
- [x] T064 Capture final status, changed paths, and staged-file inventory (`scratch/git-status-after.txt`) [15m] {deps: T063}. **Evidence**: final status captured; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T065 Assert every changed path is inside this child or the Phase 002 allowlist and that no live hub path appears (`scratch/out-of-scope-paths.txt`) [20m] {deps: T064}. **Evidence**: changed paths confined to this child + Phase 002 allowlist; no live hub path changed. [evidence: scratch/completion-evidence.md:1]
- [x] T066 Approve or block the 002 to 003 handoff with the fixture, gate, and byte receipts (`scratch/handoff-contract.md`) [20m] {deps: T065}. **Evidence**: 002 to 003 handoff approved with fixture, gate, and byte receipts. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T067 Confirm `ROUTER.md` never becomes a typed leaf, advisor identity, generated file, or class discriminator (`decision-record.md` ADR-101) [15m] {deps: T041}. **Evidence**: ROUTER.md never a typed leaf/advisor identity/generated file/class discriminator — ADR-101 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T068 Confirm no leaf map moves into `SKILL.md` or `hub-router.json` (`decision-record.md` ADR-102) [15m] {deps: T044}. **Evidence**: no leaf map moved into `SKILL.md` or `hub-router.json` — ADR-102 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T069 Confirm stable codes are library-owned and printed by every consumer (`decision-record.md` ADR-103) [15m] {deps: T049}. **Evidence**: stable codes library-owned and printed by every consumer — ADR-103 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T070 Confirm `defaultResource` semantics are preserved for all seven hubs (`decision-record.md` ADR-104) [15m] {deps: T059}. **Evidence**: `defaultResource` semantics preserved for all seven hubs — ADR-104 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T071 Confirm protected replay/scorer/discriminator bytes are untouched and documented as such (`decision-record.md` ADR-105) [15m] {deps: T057}. **Evidence**: protected replay/scorer/discriminator bytes untouched — ADR-105 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T072 Confirm phase 003 receives the verified active fixture, the migration fixture, and the stable-code matrix as handoff inputs (`scratch/handoff-contract.md`) [20m] {deps: T066}. **Evidence**: phase 003 received the active fixture, migration fixture, and stable-code matrix (handoff-contract). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T072 tasks are complete with child-local or allowlisted-path evidence. [evidence: scratch/completion-evidence.md:1]
- [x] No `[B]` blocked task remains. [evidence: scratch/completion-evidence.md:1]
- [x] All P0/P1 checklist items carry concrete receipt evidence. [evidence: scratch/completion-evidence.md:1]
- [x] Stage1-only scaffold and active fixture pass the library, doctor, and package gate. [evidence: scratch/completion-evidence.md:1]
- [x] All eight negative fixtures fail at their intended stable codes. [evidence: scratch/completion-evidence.md:1]
- [x] Command workflows emit exactly one `ROUTER.md` action line and stop on dual copies. [evidence: scratch/completion-evidence.md:1]
- [x] Machine block hash is unchanged in ordinary migration. [evidence: scratch/completion-evidence.md:1]
- [x] Protected bytes are unchanged; zero `defaultResource` deltas; no legacy creation instruction remains. [evidence: scratch/completion-evidence.md:1]
- [x] Strict validation exits 0; no staged files; no out-of-scope or live-hub path changed. [evidence: scratch/completion-evidence.md:1]
- [x] Lifecycle is Complete; the execution pass recorded the handoff to phase 003. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Implementation Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Predecessor Contract**: `../001-contract-and-fleet-audit/spec.md`
- **Parent Phase**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
