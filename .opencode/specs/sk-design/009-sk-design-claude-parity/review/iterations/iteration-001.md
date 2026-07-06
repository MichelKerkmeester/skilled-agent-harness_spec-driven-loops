---
title: Deep Review Iteration 001 - Inventory Pass
description: Inventory-pass narrative for the sk-design Claude-parity deep review.
---

# Deep Review Iteration 001 - Inventory Pass

## Dimension

Inventory-pass only. This iteration built the artifact map for the review target and performed light correctness and traceability spot checks. Deep dimension review for correctness, security, traceability, and maintainability remains deferred to iteration 2 and later.

## Files Reviewed

| Area | Evidence | Inventory Result |
|------|----------|------------------|
| Review state packet | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-config.json:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-findings-registry.json:1` | Config is initialized for generation 1, state has only the config record before this iteration, strategy names this inventory pass as next focus, and registry has zero open findings. |
| Spec parent | `.opencode/specs/sk-design/009-sk-design-claude-parity:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/spec.md:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/description.json:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/graph-metadata.json:1` | Parent is a phase parent with lean trio present. `external/`, `research/`, and `review/` exist and remain out of review scope except for this review packet's own artifacts. |
| Spec phases | `.opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate/spec.md:1`, `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/checklist.md:1` | Thirteen direct phase folders are present (`001-...` through `013-...`). Targeted glob found the expected phase document families: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, with `decision-record.md` present on many phases. Phase `008` has `benchmark-after-008/report.{md,json}`. |
| Skill hub root | `.opencode/skills/sk-design:1`, `.opencode/skills/sk-design/mode-registry.json:1`, `.opencode/skills/sk-design/hub-router.json:1` | Hub root contains the expected root docs/config (`SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, command metadata, descriptions, references, shared resources, benchmark, changelog, feature catalog, manual testing playbook, and five mode packets). |
| Mode packets | `.opencode/skills/sk-design/design-interface:1`, `.opencode/skills/sk-design/design-foundations:1`, `.opencode/skills/sk-design/design-motion:1`, `.opencode/skills/sk-design/design-audit:1`, `.opencode/skills/sk-design/design-md-generator:1` | All five mode packets have `SKILL.md`, `README.md`, `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, `procedures/`, `references/`, and `assets/` where expected. `design-foundations` and `design-audit` have `scripts/`; `design-interface` has an extra `LICENSE.txt`; `design-md-generator` has `INSTALL_GUIDE.md`, `backend/`, and `node_modules/` which is out of scope. |
| md-generator backend | `.opencode/skills/sk-design/design-md-generator/backend:1`, `.opencode/skills/sk-design/design-md-generator/backend/package.json:1`, `.opencode/skills/sk-design/design-md-generator/backend/dist:1`, `.opencode/skills/sk-design/design-md-generator/backend/tsconfig.build.json:1`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:86` | Backend has package/build/test configs, `scripts/`, `tests/`, `node_modules/`, and populated `dist/` output including `cli.js`, `.d.ts`, and `.js.map` files. Initial targeted glob missed `dist/`, but direct directory read confirmed it is present and populated. |
| Commands | `.opencode/commands/design:1` | Five flat command files are present: `audit.md`, `foundations.md`, `interface.md`, `md-generator.md`, `motion.md`. This matches Phase 013's planning-only decision to leave command files untouched for now. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Deferred | Inventory mapped spec and implementation roots, but full spec-to-code traceability begins in later iterations. |
| `checklist_evidence` | Partial, no new defect | Search for unchecked checklist rows found deferred/known rows: Phase 012's P0/P1 rows are explicitly covered by accepted ADR-003 descope, Phase 013 has only deferred P2 rows after all P0/P1 rows are verified, and Phase 005 has one deferred P2 accessibility note. Evidence: `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121`, `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/checklist.md:141`. |
| `skill_agent` | Deferred | Mode-packet inventory completed; skill/agent route fidelity remains for traceability iteration. |
| `agent_cross_runtime` | Not applicable | Strategy already marks this not applicable because sk-design has no dedicated agent family beyond the shared design LEAF agent. Evidence: `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:128`. |
| `feature_catalog_code` | Deferred | Feature catalog tree presence confirmed; content-to-capability verification remains for later iterations. |
| `playbook_capability` | Deferred | Manual testing playbook tree presence confirmed; scenario-to-capability verification remains for later iterations. |

## Ruled Out Directions

| Direction | Result | Evidence |
|-----------|--------|----------|
| Parent/phase folder missing required top-level structure | Ruled out for inventory scope | Parent lean trio and 13 phase folders were present in directory and targeted glob output. |
| Hard-blocker checklist rows silently left unchecked | Ruled out as a new finding for iteration 1 | The unchecked P0/P1 rows surfaced by grep are Phase 012 rows deliberately preserved as NOT MET under accepted ADR-003 descope, not silent completion claims. |
| Mode-registry tool-surface drift | Ruled out for inventory scope | `mode-registry.json` declares exactly five modes; interface/foundations/motion/audit are read-only and md-generator allows read/write/bash as expected. Evidence: `.opencode/skills/sk-design/mode-registry.json:32`. |
| Missing md-generator compiled output | Ruled out | `backend/dist/` contains `cli.js`, matching `package.json` `main: dist/cli.js`. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/package.json:6`, `.opencode/skills/sk-design/design-md-generator/backend/dist:1`. |
| Obvious placeholder/stub residue | Ruled out for inventory scope | Targeted searches found intentional references to placeholder policy, examples, or explicitly deferred planning rows, not obvious empty stubs requiring a finding this iteration. |

## Search Depth

Scope class is complex. Coverage in this iteration was intentionally broad and shallow: inventory roots, checklist state, mode registry, backend package/build shape, command surface, and placeholder/stub residue. The code graph was checked and reported stale, so structural graph review was not used for assertions this iteration.

## Scope Violations

None. No reviewed target files were modified.

## Verdict

PASS for iteration 1 inventory scope: no confirmed P0/P1/P2 findings were discovered.

## Next Dimension

Iteration 2 should begin deep correctness review. Recommended starting targets: `mode-registry.json` and `hub-router.json` routing invariants, mode packet `SKILL.md` loaders, md-generator backend entrypoints (`cli.ts`, `extract.ts`, `validate.ts`, `build-write-prompt.ts`), and checklist/spec evidence paths for phases 010 and 012 because both already required remediation/reconciliation passes.

Review verdict: PASS
