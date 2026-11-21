---
title: "Deep Review Strategy: Ollama lane removal"
description: "Session tracking for the ten-iteration deep review of the 024 lane removal epic."
trigger_phrases:
  - "ollama lane removal deep review"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal` (spec-folder). The Ollama and embedding semantic lane removal epic: eight phases (001 residue check and cleanup tool, 002 doctor surface, 003 lane feeders, 004 lane core, 005 shared embeddings package, 006 prose docs and changelogs, 007 generated surfaces, 008 cleanup wiring and gating) plus two alignment passes, on branch `worktrees/497-ollama-lane-removal` against merge-base `bf6806ad4b3`. Scope is the packet docs plus the 292 surviving files the branch changed outside `specs/` (91 files were deleted).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- History packets under `specs/` other than 024 (decision D1 keeps them as history, outside the residue check).
- The merge decision and the state of the operator's own machine (D2: nothing merges or pushes; D6: apply never runs on the operator's machine).
- Re-litigating the frozen decisions D1 to D7 in `024-ollama-lane-removal/goal.md` and `decision-record.md`, except where code contradicts them.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 10 iterations; convergence is telemetry only.
- Max duration 360 minutes, 30 minutes per dispatch.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maintainability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work on this target, from the packet's own docs:
- `goal.md`: objective and frozen decisions D1 to D7; all five completion criteria were met at `ea291bdaabc`.
- `decision-record.md`: operator decisions Q001 to Q006 and the later goal amendments.
- `008-cleanup-wiring-and-gating/implementation-summary.md`: the `alignment-pass` section lists every alignment finding with its verdict.
- Earlier gates at the tip: recursive strict validate 9/9 PASSED, residue repo mode exit 0 with 47/47 allowlist rows, planted fixture exit 1, fixture machine mode exit 1 then 0 after apply, advisor suite 2438 passed.

### Bounded Context Snapshot

- Target pointers: `sweep-lane-residue.mjs` and `fixtures/lane-residue-allowlist.json`; advisor runtime under `.skilled/skills/system-skill-advisor/runtime/`; doctor commands under `.skilled/commands/doctor/`; `doctor-update-apply.yaml`; `.github/workflows/advisory-checks.yml` lane-residue job; changelogs under `.skilled/changelog/` and skill changelogs.
- Behavior claims: each child's `acceptance-criteria.md`; repo mode exits 0, planted term exits 1, malformed index shape exits 2; refused flags exit 64; cleanup asks about the shared model every run and stores no answer.
- Reuse and conventions: allowlist rows are exact paths; comment hygiene bans packet ids in code comments.
- Review risks and gaps: 91 deleted files are not in scope as files, so dangling references to them must be searched for; the advisor latency test is load-sensitive.

resource-map.md not present; skipping coverage gate

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/decision-record.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/goal.md | - | - | - | pending |
| .env.example | - | - | - | pending |
| .github/workflows/README.md | - | - | - | pending |
| .github/workflows/advisory-checks.yml | - | - | - | pending |
| .github/workflows/agent-mirror-sync.yml | - | - | - | pending |
| .github/workflows/changed-packet-validation.yml | - | - | - | pending |
| .github/workflows/command-tree-parity.yml | - | - | - | pending |
| .github/workflows/deep-loop-runtime.yml | - | - | - | pending |
| .github/workflows/dispatch-enforcement-guard.yml | - | - | - | pending |
| .github/workflows/gate-inputs.yml | - | - | - | pending |
| .github/workflows/hook-vitest-suites.yml | - | - | - | pending |
| .github/workflows/opencode-plugin-tests.yml | - | - | - | pending |
| .github/workflows/opencode-v2-battery.yml | - | - | - | pending |
| .github/workflows/pi-extension-tests.yml | - | - | - | pending |
| .github/workflows/playbook-operator-contract.yml | - | - | - | pending |
| .github/workflows/routing-registry-drift.yml | - | - | - | pending |
| .github/workflows/sk-code-script-tests.yml | - | - | - | pending |
| .github/workflows/sk-doc-rename-harness.yml | - | - | - | pending |
| .github/workflows/sk-doc-script-tests-filtered.yml | - | - | - | pending |
| .github/workflows/sk-doc-script-tests.yml | - | - | - | pending |
| .github/workflows/skill-advisor-stress.yml | - | - | - | pending |
| .github/workflows/skill-doc-frontmatter.yml | - | - | - | pending |
| .github/workflows/spec-kit-check.yml | - | - | - | pending |
| .github/workflows/strict-pass-freshness-report.yml | - | - | - | pending |
| .github/workflows/trigger-index-rebuild.yml | - | - | - | pending |
| .gitignore | - | - | - | pending |
| .skilled/bin/README.md | - | - | - | pending |
| .skilled/bin/launcher-threshold-env.vitest.ts | - | - | - | pending |
| .skilled/bin/lib/README.md | - | - | - | pending |
| .skilled/bin/lib/launcher-ipc-bridge.cjs | - | - | - | pending |
| .skilled/bin/system-skill-advisor-launcher.cjs | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.1.2.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.4.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.4.1.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.5.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.5.0.3.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.6.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.0.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.1.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.2.0.0.md | - | - | - | pending |
| .skilled/commands/create/assets/create-command-auto.yaml | - | - | - | pending |
| .skilled/commands/create/assets/create-command-confirm.yaml | - | - | - | pending |
| .skilled/commands/create/assets/create-command-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/_routes.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-install-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-install.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-apply.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-repin.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-setup.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-symlink-link.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-symlink-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-update-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/scripts/README.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/orphan-process-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/setup.md | - | - | - | pending |
| .skilled/commands/doctor/skill-advisor.md | - | - | - | pending |
| .skilled/commands/doctor/update.md | - | - | - | pending |
| .skilled/hooks/shared/env-aliases.cjs | - | - | - | pending |
| .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md | - | - | - | pending |
| .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md | - | - | - | pending |
| .skilled/scripts/git-hooks/pre-commit | - | - | - | pending |
| .skilled/scripts/orphan-mcp-sweeper.sh | - | - | - | pending |
| .skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs | - | - | - | pending |
| .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | - | - | - | pending |
| .skilled/skills/mcp-code-mode/scripts/install.sh | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md | - | - | - | pending |
| .skilled/skills/sk-doc/changelog/v1.6.0.0.md | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/README.md | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py | - | - | - | pending |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl | - | - | - | pending |
| .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md | - | - | - | pending |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/typo-flags.test.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/package-lock.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/ROUTER.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/SKILL.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.11.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.17.6.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.2.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.2.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/df-idf-corpus.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/doc-frontmatter-harvest.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/provenance-and-trust-lanes.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/age-haircut.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/archive-handling.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/schema-migration.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ambiguity.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/executor-delegation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/lane-fusion.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/projection.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/graph-metadata.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/leaf-aliases.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/schema-migration.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/advisor-status-rebuild-separation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-fusion.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/projection.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/config/db-path-policy.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/advisor-server.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/graph-causal.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/shared/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/package-lock.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/package.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/lane-fusion-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/scorer-extras-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/advisor-rebuild.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/daemon-probe.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-unavailable.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-trust-gate.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/lane-attribution.test.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-bridge-isolation.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-registry-env-override.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/packet-local-changelog.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/rrf-determinism-spine.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/runtime-lane-health.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/shadow-sink.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-job-semantics.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tools/advisor-status.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/scripts/doctor.sh | - | - | - | pending |
| .skilled/skills/system-skilled-doctor/README.md | - | - | - | pending |
| .skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/ARCHITECTURE.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/ROUTER.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/SKILL.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v0+/v0.2.10.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v0+/v0.2.21.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v1+/v1.4.2.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v1+/v1.7.0.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v2.12.12.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/leaf-aliases.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/package-lock.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/package.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/config/environment-variables.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/memory/memory-system.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/memory-pipeline-regressions.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/core/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/algorithms/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/tests/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/types.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/utils/README.md | - | - | - | pending |
| INSTALL-SKILLED.md | - | - | - | pending |
| README.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-21T12:39:47Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-21T12:39:47Z
<!-- MACHINE-OWNED: END -->

---
