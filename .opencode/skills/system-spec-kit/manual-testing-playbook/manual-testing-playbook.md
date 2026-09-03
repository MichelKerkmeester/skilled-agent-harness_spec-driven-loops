---
title: "Spec Kit: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the system-spec-kit engine."
last_updated: "2026-09-03"
version: 4.0.0.0
---

# Spec Kit: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked and not stubbed. AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. Valid scenario classifications are `PASS`, `FAIL`, and `SKIP` (with a specific sandbox, credential, or runtime blocker documented). A scenario that cannot be truthfully executed through the direct-handler runner is a `SKIP` whose blocker names that runner limitation.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP`
> outcome and its reason are persisted alongside the captured evidence for that run, so a later
> reader can reconstruct which scenarios ran, what each returned, and why — without the original
> operator. An outcome that exists only in a chat transcript does not count as persisted.

This document combines the full manual-validation contract for the `system-spec-kit` engine into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern. The root document acts as the directory, review surface, and orchestration guide, while per-scenario execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `context-preservation/`
- `doctor-commands/`
- `feature-flag-reference/`
- `governance/`
- `lifecycle/`
- `memory-quality-and-indexing/` — spec-doc quality, generated metadata and the post-save review
- `plugins-and-hooks/`
- `retrieval/`
- `tooling-and-scripts/`
- `ux-hooks/`

---

## 1. OVERVIEW

This playbook is the operator-facing manual validation directory for the `system-spec-kit` engine: validation and its rules, templates and level contracts, scaffolding and `create.sh`, the continuity writer and `generate-context`, generated graph metadata and `description.json`, derived-packet repair, phase decomposition, spec-folder discovery, the surviving hooks and plugins, and the surviving `/doctor` routes. It preserves each scenario's original ID and links every entry to a dedicated file carrying the full execution contract.

### What This Playbook No Longer Covers

The memory MCP server was removed, and every scenario that validated it went with it: the 41 tools, the daemon and launcher, the database, embeddings, vector and BM25 search, the causal graph, checkpoints, retention, ingestion, query intelligence, evaluation dashboards and ablations. No scenario below asks an operator to start a memory daemon or call a memory tool.

Where a surviving scenario used to open with a daemon prerequisite or close with a memory-tool verification, the successor is named in the scenario file itself:

| Retired step | Successor |
|---|---|
| Start the memory daemon before the run | Nothing to start. For the one daemon that remains, `node .opencode/bin/skill-advisor.cjs advisor_status --format json` reports health |
| `memory_match_triggers(prompt)` to surface context | `node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs "<prompt>"` |
| `memory_search` / `memory_context` to find evidence | The ripgrep recipes in `references/retrieval/retrieval-conventions.md` §2 |
| `memory_save` to persist the run | The packet-local continuity writer and `scripts/memory/generate-context.ts` |

Scenario counts are derived by the runner from the walked tree; do not hand-maintain them here.

### Realistic Test Model

These manual tests should mimic real user behavior, not just isolated command execution. The preferred execution shape is:

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Feature Files Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome, not just the internal tool output
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root.
2. The `system-spec-kit` package builds: a stale compiled validation orchestrator makes `validate.sh` exit 3 with no rule output at all.
3. Spec-folder scripts are executable and reachable through `realpath` when `.opencode` is a symlink.
4. Manual execution logging is enabled (terminal transcript capture).
5. Scenarios that write into a spec folder run against a scratch packet, never a live one.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `<tool> <subcommand> [args]`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-scenario files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule: any critical-path scenario `FAIL` forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-scenario files.
4. No unresolved blocking triage item remains.

### Destructive Scenario Rules

- Scenarios that delete or rewrite files on disk MUST run on non-production data only.
- Before executing, verify the affected resource can be rebuilt from scratch.
- Never run destructive scenarios in parallel with other scenarios that depend on the same resource.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-scenario file.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

This section records coordinator/worker utilization guidance for assembling or reviewing playbook bundles. It is not a runtime support matrix and does not, by itself, prove feature parity for any CLI.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate the remaining worker slots.
4. Pre-assign explicit scenario IDs, per-scenario files, and ranges to each wave before execution.
5. Run destructive scenarios in dedicated sandbox-only waves.
6. Record the utilization table and evidence paths in the final report.

### What Belongs In Per-Scenario Files

- Real user requests
- Orchestrator prompts
- Expected delegation or alternate-CLI routing
- Desired user-visible outcomes
- Isolation constraints or acceptance caveats that do not apply globally

---

## 7. SCENARIO DIRECTORY

Every row links a scenario file that exists on disk. The **Catalog Entry** column doubles as the feature-catalog cross-reference index; `—` means the scenario validates a surface the catalog does not carry a leaf for.

### 7.1 Tooling and Scripts

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| M-013 | AC_COVERAGE single-source ratio | [M-013](tooling-and-scripts/ac-coverage-single-source-ratio.md) | — |
| 206 | Architecture boundary enforcement | [206](tooling-and-scripts/architecture-boundary-enforcement.md) | [architecture-boundary-enforcement](../feature-catalog/tooling-and-scripts/architecture-boundary-enforcement.md) |
| 456 | Canonical-first spec-root resolution | [456](tooling-and-scripts/canonical-first-spec-root-resolution.md) | [canonical-first-spec-root-resolution](../feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md) |
| 449 | CLI compact list-tools and completion generation | [449](tooling-and-scripts/cli-compact-and-completion.md) | [skill-advisor-cli-daemon-backed-surface](../feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md) |
| 429 | CLI dist-freshness guard trip | [429](tooling-and-scripts/cli-dist-freshness-guard.md) | [dist-freshness-enforcement](../feature-catalog/tooling-and-scripts/dist-freshness-enforcement.md) |
| 431 | skill-advisor CLI trusted-gate refusal | [431](tooling-and-scripts/cli-trusted-gate-refusal.md) | [skill-advisor-cli-daemon-backed-surface](../feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md) |
| 428 | CLI warm-only no-spawn behavior | [428](tooling-and-scripts/cli-warm-only-no-spawn.md) | [cli-runtime-warm-only-fallbacks](../feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md) |
| 089 | Code standards alignment | [089](tooling-and-scripts/code-standards-alignment.md) | [code-standards-alignment](../feature-catalog/tooling-and-scripts/code-standards-alignment.md) |
| 233 | Completion verification workflow | [233](tooling-and-scripts/completion-verification-workflow.md) | [completion-verification-workflow](../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) |
| 240 | Core workflow infrastructure | [240](tooling-and-scripts/core-workflow-infrastructure.md) | [core-workflow-infrastructure](../feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md) |
| DBG-SCAF-001 | Debug-delegation scaffold generator | [DBG-SCAF-001](tooling-and-scripts/debug-delegation-scaffold-generator.md) | [debug-delegation-scaffold-generator](../feature-catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md) |
| 153 | JSON mode structured summary hardening | [153](tooling-and-scripts/json-mode-hybrid-enrichment.md) | [json-mode-hybrid-enrichment](../feature-catalog/tooling-and-scripts/json-mode-hybrid-enrichment.md) |
| 154 | JSON-primary deprecation posture | [154](tooling-and-scripts/json-primary-deprecation-posture.md) | [json-primary-deprecation-posture](../feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md) |
| M-004 | Main-agent review and verdict handoff | [M-004](tooling-and-scripts/main-agent-review-and-verdict-handoff.md) | — |
| 420 | Markdown link integrity guard | [420](tooling-and-scripts/markdown-link-integrity-guard.md) | [markdown-link-integrity-guard](../feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md) |
| 138 | MODULE header compliance via verify_alignment_drift.py | [138](tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md) | [code-standards-alignment](../feature-catalog/tooling-and-scripts/code-standards-alignment.md) |
| 152 | No symlinks in lib/ tree | [152](tooling-and-scripts/no-symlinks-in-lib-tree.md) | [architecture-boundary-enforcement](../feature-catalog/tooling-and-scripts/architecture-boundary-enforcement.md) |
| 419 | Orphan MCP runtime lifecycle guardrails | [419](tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md) | [orphan-mcp-sweeper-and-launchagent-template](../feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md) |
| 425 | Orphan sweep stop-hook activation | [425](tooling-and-scripts/orphan-sweep-stop-hook-activation.md) | [orphan-sweep-stop-hook-activation](../feature-catalog/tooling-and-scripts/orphan-sweep-stop-hook-activation.md) |
| PHASE-005 | Phase command workflow | [PHASE-005](tooling-and-scripts/phase-command-workflow.md) | [phase-system-knowledge-node](../feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md) |
| PHASE-001 | Phase detection scoring | [PHASE-001](tooling-and-scripts/phase-detection-scoring.md) | [phase-system-knowledge-node](../feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md) |
| PHASE-002 | Phase folder creation | [PHASE-002](tooling-and-scripts/phase-folder-creation.md) | [spec-lifecycle-automation](../feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md) |
| 236 | Phase-system knowledge node | [236](tooling-and-scripts/phase-system-knowledge-node.md) | [phase-system-knowledge-node](../feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md) |
| 062 | Progressive validation for spec documents | [062](tooling-and-scripts/progressive-validation-for-spec-documents-pi-b2.md) | [progressive-validation-for-spec-documents](../feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md) |
| PHASE-003 | Recursive phase validation | [PHASE-003](tooling-and-scripts/recursive-phase-validation.md) | [spec-validation-rule-engine](../feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md) |
| 271 | Research metadata backfill | [271](tooling-and-scripts/research-metadata-backfill.md) | [research-metadata-backfill](../feature-catalog/tooling-and-scripts/research-metadata-backfill.md) |
| M-011 | Review packet type marker-gated validation | [M-011](tooling-and-scripts/review-packet-type-marker-gated-validation.md) | [spec-validation-rule-engine](../feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md) |
| M-009 | Runtime family count census | [M-009](tooling-and-scripts/runtime-family-count-census.md) | — |
| M-010 | Runtime lineage naming parity | [M-010](tooling-and-scripts/runtime-lineage-naming-parity.md) | — |
| 139 | Session capturing pipeline quality (coverage) | [139](tooling-and-scripts/session-capturing-pipeline-quality-coverage.md) | [session-capturing-pipeline-quality](../feature-catalog/tooling-and-scripts/session-capturing-pipeline-quality.md) |
| M-007 | Session capturing pipeline quality | [M-007](tooling-and-scripts/session-capturing-pipeline-quality.md) | [session-capturing-pipeline-quality](../feature-catalog/tooling-and-scripts/session-capturing-pipeline-quality.md) |
| 241 | Session extraction and enrichment | [241](tooling-and-scripts/session-extraction-and-enrichment.md) | [session-extraction-and-enrichment](../feature-catalog/tooling-and-scripts/session-extraction-and-enrichment.md) |
| 243 | Setup, native module health and prerequisite validation | [243](tooling-and-scripts/setup-native-module-health-and-mcp-installation.md) | [setup-native-module-health-and-mcp-installation](../feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md) |
| EX-041 | sk-git worktree convention | [EX-041](tooling-and-scripts/sk-git-worktree-convention.md) | [sk-git-worktree-convention](../feature-catalog/tooling-and-scripts/sk-git-worktree-convention.md) |
| 150 | Source-dist alignment validation | [150](tooling-and-scripts/source-dist-alignment-validation.md) | [source-dist-alignment-enforcement](../feature-catalog/tooling-and-scripts/source-dist-alignment-enforcement.md) |
| 242 | Spec-folder detection and description metadata | [242](tooling-and-scripts/spec-folder-detection-and-description.md) | [spec-folder-detection-and-description](../feature-catalog/tooling-and-scripts/spec-folder-detection-and-description.md) |
| PHASE-008 | Spec-folder literal naming (CLI-driven slug) | [PHASE-008](tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md) | [spec-folder-literal-naming-ai-derived-slugs](../feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md) |
| PHASE-006 | Spec-folder literal naming (create.sh fallback) | [PHASE-006](tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md) | [spec-folder-literal-naming-create-sh-fallback](../feature-catalog/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md) |
| PHASE-009 | Spec-folder literal naming (remediation rule) | [PHASE-009](tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md) | [spec-folder-literal-naming-ai-derived-slugs](../feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md) |
| 237 | Spec lifecycle automation | [237](tooling-and-scripts/spec-lifecycle-automation.md) | [spec-lifecycle-automation](../feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md) |
| 238 | Spec validation rule engine | [238](tooling-and-scripts/spec-validation-rule-engine.md) | [spec-validation-rule-engine](../feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md) |
| 272 | Strict validation add-ons | [272](tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md) | [strict-validation-addons](../feature-catalog/tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md) |
| 208 | Template compliance contract blocks non-compliant | [208](tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md) | [template-compliance-contract-enforcement](../feature-catalog/tooling-and-scripts/template-compliance-contract-enforcement.md) |
| 181 | Template compliance contract produces compliant | [181](tooling-and-scripts/template-compliance-contract-enforcement-produces-compliant.md) | [template-compliance-contract-enforcement](../feature-catalog/tooling-and-scripts/template-compliance-contract-enforcement.md) |
| 244 | Template composition system | [244](tooling-and-scripts/template-composition-system.md) | [template-composition-system](../feature-catalog/tooling-and-scripts/template-composition-system.md) |
| 061 | Tree thinning for spec folder consolidation | [061](tooling-and-scripts/tree-thinning-for-spec-folder-consolidation-pi-b1.md) | [tree-thinning-for-spec-folder-consolidation](../feature-catalog/tooling-and-scripts/tree-thinning-for-spec-folder-consolidation.md) |
| 455 | validate.sh dist-freshness backstop | [455](tooling-and-scripts/validate-sh-dist-freshness-backstop.md) | [dist-freshness-enforcement](../feature-catalog/tooling-and-scripts/dist-freshness-enforcement.md) |

### 7.2 Doctor Commands

Category notes and the retired ID range: [`doctor-commands/README.md`](doctor-commands/README.md).

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| DOC-331 | Doctor deep-loop lazy init | [DOC-331](doctor-commands/doctor-deep-loop-lazy-init.md) | [doctor-router-and-manifest-dispatch](../feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md) |
| DOC-332 | Doctor deep-loop empty, no source | [DOC-332](doctor-commands/doctor-deep-loop-empty-no-source.md) | [doctor-router-and-manifest-dispatch](../feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md) |
| DOC-333 | Doctor deep-loop convergence | [DOC-333](doctor-commands/doctor-deep-loop-convergence.md) | [doctor-router-and-manifest-dispatch](../feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md) |
| DOC-338 | Doctor update G5 failure injection mid-rebuild | [DOC-338](doctor-commands/doctor-update-g5-confirm-failure-injection.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-339 | Doctor update G6 concurrent refusal | [DOC-339](doctor-commands/doctor-update-g6-concurrent.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-340 | Doctor update G7 SIGINT | [DOC-340](doctor-commands/doctor-update-g7-sigint.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-341 | Doctor update G8 migration gap | [DOC-341](doctor-commands/doctor-update-g8-migration-gap.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-342 | Doctor update G9 dashboard | [DOC-342](doctor-commands/doctor-update-g9-dashboard.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-344 | Doctor update tier-aware default | [DOC-344](doctor-commands/doctor-update-tier-aware-default.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-345 | Version migration 3.3.0.0 to 3.4.1.0 | [DOC-345](doctor-commands/version-migration-3-3-0-0-to-3-4-1-0.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-346 | Version migration cleanup legacy | [DOC-346](doctor-commands/version-migration-cleanup-legacy.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |
| DOC-347 | Version migration no-op | [DOC-347](doctor-commands/version-migration-no-op.md) | [doctor-commands overview](../feature-catalog/doctor-commands/category-overview.md) |

### 7.3 Spec-Doc Quality and Metadata

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| 042 | Spec folder description discovery | [042](memory-quality-and-indexing/spec-folder-description-discovery-pi-b3.md) | [spec-folder-description-discovery](../feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md) |
| 131 | description.json batch backfill validation | [131](memory-quality-and-indexing/description-json-batch-backfill-validation-pi-b3.md) | [spec-folder-description-discovery](../feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md) |
| 132 | description.json schema field validation | [132](memory-quality-and-indexing/description-json-schema-field-validation.md) | [spec-folder-description-discovery](../feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md) |
| 155 | Post-save quality review | [155](memory-quality-and-indexing/post-save-quality-review.md) | [post-save-quality-review](../feature-catalog/memory-quality-and-indexing/post-save-quality-review.md) |
| 201 | Spec-doc structure validator and continuity frontmatter | [201](memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md) | [spec-doc-structure-validator](../feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md) |

### 7.4 Governance

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| 063 | Feature flag governance | [063](governance/feature-flag-governance.md) | [feature-flag-governance](../feature-catalog/governance/feature-flag-governance.md) |

### 7.5 Plugins and Hooks

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| completion-evidence-sentinel | Completion evidence sentinel | [completion-evidence-sentinel](plugins-and-hooks/completion-evidence-sentinel.md) | — |
| dist-freshness-guard | Dist freshness guard | [dist-freshness-guard](plugins-and-hooks/dist-freshness-guard.md) | [dist-freshness-enforcement](../feature-catalog/tooling-and-scripts/dist-freshness-enforcement.md) |
| session-cleanup-plugin | Session cleanup plugin | [session-cleanup-plugin](plugins-and-hooks/session-cleanup-plugin.md) | [orphan-sweep-stop-hook-activation](../feature-catalog/tooling-and-scripts/orphan-sweep-stop-hook-activation.md) |
| spec-mutation-gate-enforce | Spec mutation gate enforce | [spec-mutation-gate-enforce](plugins-and-hooks/spec-mutation-gate-enforce.md) | — |
| speckit-completion-exposer | Speckit completion exposer | [speckit-completion-exposer](plugins-and-hooks/speckit-completion-exposer.md) | [completion-verification-workflow](../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) |

### 7.6 UX Hooks

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| 119-A | Comment hygiene: checker script baseline | [119-A](ux-hooks/comment-hygiene-checker-baseline.md) | — |
| 119-B | Comment hygiene: Claude Code PostToolUse hook | [119-B](ux-hooks/comment-hygiene-claude-code-hook.md) | — |
| 119-C | Comment hygiene: OpenCode plugin and pre-commit gate | [119-C](ux-hooks/comment-hygiene-opencode-plugin.md) | — |
| 433 | CLI hook transport-down fail-open | [433](ux-hooks/cli-hook-transport-down-fail-open.md) | [cli-runtime-warm-only-fallbacks](../feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md) |
| 454 | Goal OpenCode plugin | [454](ux-hooks/goal-opencode-plugin.md) | [goal-opencode-plugin](../feature-catalog/ux-hooks/goal-opencode-plugin.md) |
| 457 | Cross-runtime directive-lifecycle dedup | [457](ux-hooks/directive-lifecycle-dedup.md) | [directive-lifecycle-dedup](../feature-catalog/ux-hooks/directive-lifecycle-dedup.md) |

### 7.7 Configuration Contracts

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| 223 | Runtime config contract | [223](feature-flag-reference/runtime-config-contract.md) | [runtime-config-contract](../feature-catalog/feature-flag-reference/runtime-config-contract.md) |
| 224 | Filter config contract | [224](feature-flag-reference/filter-config-contract.md) | [filter-config-contract](../feature-catalog/feature-flag-reference/filter-config-contract.md) |
| 444 | Authored continuity snapshot | [444](feature-flag-reference/authored-continuity-snapshot.md) | — |
| 445 | Completion freshness validator | [445](feature-flag-reference/completion-freshness-validator.md) | [completion-verdict-freshness-validation](../feature-catalog/tooling-and-scripts/completion-verdict-freshness-validation.md) |

### 7.8 Lifecycle, Retrieval and Context Preservation

| Playbook ID | Scenario | Scenario File | Catalog Entry |
|---|---|---|---|
| 453 | Speckit autopilot lifecycle | [453](lifecycle/speckit-autopilot-lifecycle.md) | [speckit-autopilot-lifecycle](../feature-catalog/lifecycle/speckit-autopilot-lifecycle.md) |
| 190 | Session recovery via /speckit:resume | [190](retrieval/session-recovery-spec-kit-resume.md) | [session-recovery-spec-kit-resume](../feature-catalog/retrieval/session-recovery-spec-kit-resume.md) |
| 270 | Resource map template | [270](context-preservation/resource-map-template.md) | [resource-map-template](../feature-catalog/context-preservation/resource-map-template.md) |

---

## 8. AUTOMATED TEST CROSS-REFERENCE

Automated coverage is tracked in two places:

- The **Catalog Entry** column in Section 7, which maps each scenario to the feature-catalog leaf whose SOURCE FILES table names the regression tests.
- The scenario runner at `scripts/tests/manual-playbook-runner.ts`, which walks this package, parses each scenario's `Playbook ID` and command sequence, and reports scenarios it cannot execute deterministically as `SKIP` with a named blocker.

The runner derives its scenario census from the walked tree. A scenario file added or removed without updating Section 7 will show up as an orphan in the link audit, not as a silent gap.
