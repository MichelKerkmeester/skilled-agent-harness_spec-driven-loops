---
title: "Tasks: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "Task breakdown for the cli-orca extraction, the official-skill embedding, the hub removal, the packet move and the closing gates."
trigger_phrases:
  - "cli-orca tasks"
  - "extraction task list"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: Consolidate Official Orca Skills Into Standalone cli-orca

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Meaning |
|-----------|-------|---------|
| M1 | T001-T004 | Baseline captured and snapshot removed with proof |
| M2 | T005-T008 | Skill root authored |
| M3 | T009-T015 | Corpus, catalog and playbook complete |
| M4 | T016-T022 | Hub clean at nine modes |
| M5 | T023-T028 | Packets moved and metadata live |
| M6 | T029-T036 | Fleet catalogs, re-ingestion and gates closed |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline and Snapshot Cleanup [Milestone M1]

- [x] T001 Capture the hub baseline with the parent check (`.skilled/skills/mcp-tooling`) [10m]
- [x] T002 Capture the advisor and compiled-route before-state for an Orca prompt (`scratch/baseline-pre-extraction.txt`) [15m]
- [x] T003 Prove equivalence between the removed repository copy and the vendored snapshot, and locate the rollback archive (`scratch/baseline-pre-extraction.txt`) [15m]
- [x] T004 Record the equivalence and recovery locations (`scratch/baseline-pre-extraction.txt`) [5m]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Research and Packet Docs [Milestone M1]

- [x] T005 [P] Dispatch the official-skill inventory worker and save the return (`scratch/research-official-skills.md`) [30m]
- [x] T006 [P] Dispatch the CLI surface worker and save the return (`scratch/research-orca-cli-surface.md`) [30m]
- [x] T007 [P] Dispatch the routing boundary worker and save the return (`scratch/research-routing-boundaries.md`) [30m]
- [x] T008 Author the packet documents at Level 3 (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`) [60m] {deps: T005-T007}

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Standalone Skill Root [Milestone M2]

- [x] T009 Author the routing contract (`.skilled/skills/cli-orca/SKILL.md`) [90m] {deps: T008}
- [x] T010 Author the advisor identity (`.skilled/skills/cli-orca/graph-metadata.json`) [20m] {deps: T009}
- [x] T011 Author the leaf roots config (`.skilled/skills/cli-orca/leaf-manifest.config.json`) [10m] {deps: T009}
- [x] T012 Author the package index (`.skilled/skills/cli-orca/README.md`) [30m] {deps: T009}

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Corpus, Catalog and Playbook [Milestone M3]

- [x] T013 Author the CLI references and the official-skill references (`.skilled/skills/cli-orca/references/**`) [120m] {deps: T009}
- [x] T014 Author the feature catalog (`.skilled/skills/cli-orca/feature-catalog/**`) [45m] {deps: T013}
- [x] T015 Author the manual testing playbook (`.skilled/skills/cli-orca/manual-testing-playbook/**`) [60m] {deps: T013}
- [x] T016 Author the changelog and the benchmark record (`.skilled/skills/cli-orca/{changelog,benchmark}/**`) [20m] {deps: T013}
- [x] T017 Generate the derived metadata and validate every authored document (`.skilled/skills/cli-orca/**`) [20m] {deps: T014-T016}

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Hub Extraction [Milestone M4]

- [x] T018 Remove the mode from the registry and the router (`.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json}`) [30m] {deps: T017}
- [x] T019 Remove the stage-two intent and resource map entries (`.skilled/skills/mcp-tooling/ROUTER.md`) [20m]
- [x] T020 Update the hub contract and descriptions (`.skilled/skills/mcp-tooling/{SKILL.md,README.md,description.json,graph-metadata.json}`) [30m]
- [x] T021 Move the hub-side evidence out of the hub (`.skilled/skills/mcp-tooling/benchmark/**` to `specs/cli-orca/001-mcp-orca-cli/benchmark/`) [15m]
- [x] T022 Regenerate the manifest and re-run the parent check (`.skilled/skills/mcp-tooling/leaf-manifest.json`) [20m] {deps: T018-T021}

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Packet Move and Track Metadata [Milestone M5]

- [x] T023 Move the predecessor packet (`specs/mcp-tooling/021-mcp-orca-cli` to `specs/cli-orca/001-mcp-orca-cli`) [20m]
- [x] T024 Re-point the moved metadata and add the supersession addendum (`specs/cli-orca/001-mcp-orca-cli/**`) [30m] {deps: T023}
- [x] T025 Author the cli-orca track metadata (`specs/cli-orca/{description.json,graph-metadata.json}`) [20m]
- [x] T026 Drop the moved packet from the mcp-tooling track metadata (`specs/mcp-tooling/{description.json,graph-metadata.json}`) [15m]
- [x] T027 Validate both packets strictly (`specs/cli-orca/**`, `specs/mcp-tooling/**`) [15m] {deps: T024-T026}
- [x] T028 Sweep for stale references (`specs/**`, `.skilled/**`) [10m] {deps: T027}

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Fleet Catalogs, Re-ingestion and Gates [Milestone M6]

- [x] T029 Update the fleet catalog (`.skilled/skills/README.txt`) [15m]
- [x] T030 Update the root metadata contract fleet table (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`) [15m]
- [x] T031 Re-ingest the advisor graph and replay the positive and holdout prompts [20m] {deps: T029-T030}
- [x] T032 Run the full gate suite and capture outputs (`scratch/gate-results.md`) [30m] {deps: T031}
- [x] T033 Record the results in the implementation summary (`implementation-summary.md`) [15m] {deps: T032}
- [x] T034 Raise the skill router block to the canonical smart-router markers and add the related-resources section (`.skilled/skills/cli-orca/SKILL.md`) [15m]
- [x] T035 Refresh the frozen sk-doc directory manifest that the two moved hub directories invalidated (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`) [10m]
- [x] T036 Record the run as dated benchmark evidence (`.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/**`) [20m] {deps: T032}

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

| Check | Command shape | Expected result | Status |
|-------|---------------|-----------------|--------|
| Root metadata gate | `ci-skill-root-metadata.cjs --fix` then a no-write run | Clean, no forbidden or stale rows | Passed, `checked=14 passed=14 failed=0`, `OK [S] cli-orca` |
| Package validation | `validate_skill_package.py` and `package_skill.py --check` | Clean exit | Passed, standalone kind detected and `Result: PASS` under `--strict` |
| Document validation | `validate_document.py` per authored doc | Clean, zero blocking issues | Passed, `checked=31 blocking=0` |
| Hub parent check | `parent-skill-check.cjs` on the hub | Nine modes, zero warnings | Passed, all hard invariants with 0 warnings |
| Routing replay | `compiled-route.cjs` positive and negative prompts | Single correct route, no Orca route from the hub | Passed, the hub returns no Orca target and admission still passes |
| Advisor replay | `skill_advisor.py` positive and holdout prompts | `cli-orca` recommended, holdout ignored | Passed, `cli-orca` first for the Orca phrase, no recommendation for the holdout |
| Spec validation | `validate.sh --strict` on both packets | `RESULT: PASSED` | Passed on both packets |
| Stale reference sweep | Repository search for the retired identifiers | No hits outside preserved history | Passed, 0 live references outside changelog history |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All milestones achieved
- [x] Every verification row carries an observed result
- [x] Acceptance criteria each carry evidence
- [x] ADRs have status Accepted or a recorded deferral

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decisions**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
