---
title: "Spec Kit: Feature Catalog"
description: "Unified reference combining the complete current feature inventory for the system-spec-kit engine after the memory server was removed."
trigger_phrases:
  - "spec kit feature catalog"
  - "spec kit features"
  - "spec kit feature inventory"
  - "what does spec kit do"
  - "spec kit capability inventory"
last_updated: "2026-09-03"
version: 4.0.0.0
---

# Spec Kit: Feature Catalog

This document is the current feature inventory for the `system-spec-kit` engine. It describes the validation rules, templates and level contracts, spec-folder scaffolding and discovery, the continuity writer, generated metadata, phase decomposition, the doctor routes, and the workflow scripts that ship with the package.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `system-spec-kit` feature surface. The numbered sections below group the engine by capability area so readers can move from a top-level summary into per-feature files without losing implementation or validation context. Each section maps one-to-one onto a directory under `feature-catalog/`.

### What This Catalog No Longer Covers

The memory MCP server was removed: its 41 tools, daemon, launcher, plugin, hooks, database, embeddings, vector and BM25 search, causal graph, checkpoints, retention, ingestion, query intelligence, evaluation dashboards and ablations are gone, and so are their catalog entries. Nothing in this document describes those tools as available.

| Retired surface | Where the capability lives now |
|---|---|
| `memory_match_triggers` prompt-to-phrase matching | The generated trigger index, read by `node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs "<prompt>"` |
| `memory_search`, `memory_quick_search`, `memory_context` | The ripgrep recipes in `references/retrieval/retrieval-conventions.md` §2, ranked caller-side per §5 |
| `memory_save` continuity writes | The packet-local continuity writer and `scripts/memory/generate-context.ts` |
| Session resume and context assembly | `/speckit:resume` over the `handover.md` -> `_memory.continuity` -> spec-doc ladder |
| Daemon health checks | `node .opencode/bin/skill-advisor.cjs advisor_status --format json` for the one daemon that remains |

Semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup are a declared loss, not a relocated capability. `references/retrieval/retrieval-conventions.md` §1 carries the full boundary table.

---

## 2. TOOLING AND SCRIPTS

### Architecture boundary enforcement

#### Description

Automates two import rules: `shared/` must not import from `mcp-server/` or `scripts/`, and `mcp-server/scripts/` must contain only thin wrappers.

#### Current Reality

The checker runs over the surviving package tree and fails on a crossed boundary.

#### Source Files

See [`tooling-and-scripts/architecture-boundary-enforcement.md`](tooling-and-scripts/architecture-boundary-enforcement.md) for full implementation and test file listings.

---

### Canonical-first spec-root resolution

#### Description

Gives unqualified packet names a stable canonical winner, preserves explicit paths, retains a legacy-only read fallback, and blocks unsafe duplicate-root writes.

#### Current Reality

The resolver, collision classifier and write guard ship in `scripts/core/`; the real-data migration and alias retirement remain deployment-gated.

#### Source Files

See [`tooling-and-scripts/canonical-first-spec-root-resolution.md`](tooling-and-scripts/canonical-first-spec-root-resolution.md) for full implementation and test file listings.

---

### Warm-only CLI hook fallbacks and plugin bridges

#### Description

Prompt-time hooks probe a daemon socket first and fail open fast, so no prompt-time cold spawn happens when a backend is down.

#### Current Reality

The skill-advisor is the only daemon left behind this contract; the spec-memory and code-index fallbacks were removed with their servers.

#### Source Files

See [`tooling-and-scripts/cli-runtime-warm-only-fallbacks.md`](tooling-and-scripts/cli-runtime-warm-only-fallbacks.md) for full implementation and test file listings.

---

### Code standards alignment

#### Description

Brings comments, MODULE/COMPONENT headers, import ordering and constant naming into line with the sk-code OPENCODE route standards.

#### Current Reality

The standards apply to the surviving package source; the checklists live in sk-code.

#### Source Files

See [`tooling-and-scripts/code-standards-alignment.md`](tooling-and-scripts/code-standards-alignment.md) for full implementation and test file listings.

---

### Completion-verdict freshness validation

#### Description

Default-off strict validation rule that recomputes packet continuity fingerprints and flags stale completion claims after in-scope edits.

#### Current Reality

`SPECKIT_COMPLETION_FRESHNESS` gates the rule; `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates a stale warning to a blocking error.

#### Source Files

See [`tooling-and-scripts/completion-verdict-freshness-validation.md`](tooling-and-scripts/completion-verdict-freshness-validation.md) for full implementation and test file listings.

---

### Completion verification workflow

#### Description

Checklist completion verifier that enforces P0/P1 completion, evidence markers and priority tagging, with JSON or human-readable status output.

#### Current Reality

`scripts/spec/check-completion.sh` reads `checklist.md` from the packet under test.

#### Source Files

See [`tooling-and-scripts/completion-verification-workflow.md`](tooling-and-scripts/completion-verification-workflow.md) for full implementation and test file listings.

---

### Core workflow infrastructure

#### Description

Shared workflow modules that load configuration, build titles and topics, edit frontmatter, review post-save output and persist packet continuity.

#### Current Reality

`scripts/core/workflow.ts` and its siblings own the save path; the indexing and lease behavior that used to reach into the MCP server is now source-owned.

#### Source Files

See [`tooling-and-scripts/core-workflow-infrastructure.md`](tooling-and-scripts/core-workflow-infrastructure.md) for full implementation and test file listings.

---

### Debug-delegation scaffold generator

#### Description

`scaffold-debug-delegation.sh` generates a structured `debug-delegation.md` from a failure trail, versions filenames on collision, and never auto-dispatches `@debug`.

#### Current Reality

Escalation stays under explicit operator control; the script only writes the scaffold.

#### Source Files

See [`tooling-and-scripts/debug-delegation-scaffold-generator.md`](tooling-and-scripts/debug-delegation-scaffold-generator.md) for full implementation and test file listings.

---

### Derived packet repair

#### Description

Repairs the packet facts recomputable from repository state and refuses the ones that record work a person did, reporting those by rule instead.

#### Current Reality

`scripts/spec/repair-derived.cjs` ships with its own README and vitest coverage.

#### Source Files

See [`tooling-and-scripts/derived-packet-repair.md`](tooling-and-scripts/derived-packet-repair.md) for full implementation and test file listings.

---

### Dist-freshness enforcement

#### Description

Shared source-vs-dist staleness detection for local TypeScript build outputs.

#### Current Reality

`scripts/lib/dist-freshness.cjs` backs `validate.sh`'s hard exit-3 backstop, a Claude Code hook, an OpenCode plugin, and the surviving `skill-advisor.cjs` shim.

#### Source Files

See [`tooling-and-scripts/dist-freshness-enforcement.md`](tooling-and-scripts/dist-freshness-enforcement.md) for full implementation and test file listings.

---

### JSON mode structured summary hardening

#### Description

Structured JSON summary support for `generate-context`, including `toolCalls`/`exchanges` fields and file-backed JSON authority.

#### Current Reality

Decision confidence, truncated titles, `git_changed_file_count` stability and template count preservation are all hardened on the structured path.

#### Source Files

See [`tooling-and-scripts/json-mode-hybrid-enrichment.md`](tooling-and-scripts/json-mode-hybrid-enrichment.md) for full implementation and test file listings.

---

### JSON-primary deprecation posture

#### Description

Routine saves prefer `--json` or `--stdin` structured input, while positional JSON file input remains supported on the same structured path.

#### Current Reality

Operator guidance documents JSON-first save workflows without claiming positional input was removed.

#### Source Files

See [`tooling-and-scripts/json-primary-deprecation-posture.md`](tooling-and-scripts/json-primary-deprecation-posture.md) for full implementation and test file listings.

---

### Markdown link integrity guard

#### Description

`check-markdown-links.cjs` resolves every relative markdown link across the skills, commands and agents doc trees and fails when a target no longer exists.

#### Current Reality

It catches breakage from deleted or moved files that survives in an unchanged referrer, which is exactly the failure mode a large deletion produces.

#### Source Files

See [`tooling-and-scripts/markdown-link-integrity-guard.md`](tooling-and-scripts/markdown-link-integrity-guard.md) for full implementation and test file listings.

---

### Orphan MCP sweeper and LaunchAgent template

#### Description

Dry-run-first operator runbook and scripts for stale MCP helper cleanup, temporary dispatch artifact cleanup and session cleanup.

#### Current Reality

The sweeper serves the skill-advisor and code-mode launchers; its memory-daemon branches came out with the server.

#### Source Files

See [`tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md`](tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md) for full implementation and test file listings.

---

### Orphan sweep stop-hook activation

#### Description

The Stop hook's session-cleanup script no-ops without `CLAUDE_SESSION_PID`, because guessing from PPID is refused as a cross-session-kill risk.

#### Current Reality

When enabled, the no-session-pid branch delegates to the orphan-only sweeper, which reaps only ownerless reparented daemons. Default off, with dry-run and live modes.

#### Source Files

See [`tooling-and-scripts/orphan-sweep-stop-hook-activation.md`](tooling-and-scripts/orphan-sweep-stop-hook-activation.md) for full implementation and test file listings.

---

### Phase-system knowledge node

#### Description

Knowledge node and supporting command/script surface for decomposing complex work into parent-child phase folders with scoring, lifecycle guidance and recursive validation.

#### Current Reality

`references/structure/phase-system.md` and `phase-definitions.md` carry both phase-qualification thresholds.

#### Source Files

See [`tooling-and-scripts/phase-system-knowledge-node.md`](tooling-and-scripts/phase-system-knowledge-node.md) for full implementation and test file listings.

---

### Progressive validation for spec documents

#### Description

A 4-level pipeline — detect, auto-fix, suggest, report — layered on top of `validate.sh`.

#### Current Reality

`scripts/spec/progressive-validate.sh` drives it; the authoritative verdict still comes from `validate.sh`.

#### Source Files

See [`tooling-and-scripts/progressive-validation-for-spec-documents.md`](tooling-and-scripts/progressive-validation-for-spec-documents.md) for full implementation and test file listings.

---

### Research metadata backfill

#### Description

Creates missing `description.json` and `graph-metadata.json` files under research iteration folders without rewriting complete folders.

#### Current Reality

`scripts/memory/backfill-research-metadata.ts` runs from `scripts/core/workflow.ts` and has vitest coverage.

#### Source Files

See [`tooling-and-scripts/research-metadata-backfill.md`](tooling-and-scripts/research-metadata-backfill.md) for full implementation and test file listings.

---

### Session capturing pipeline quality

#### Description

The shipped JSON-primary save path for `generate-context`, its quality gates, sufficiency enforcement and template-contract validation.

#### Current Reality

Positional JSON file input still resolves onto the same structured path.

#### Source Files

See [`tooling-and-scripts/session-capturing-pipeline-quality.md`](tooling-and-scripts/session-capturing-pipeline-quality.md) for full implementation and test file listings.

---

### Session extraction and enrichment

#### Description

Extractor-layer session enrichment for files, diagrams and activity signals, plus the barrel exports that expose those helpers.

#### Current Reality

`scripts/extractors/` feeds the continuity writer, not a memory index.

#### Source Files

See [`tooling-and-scripts/session-extraction-and-enrichment.md`](tooling-and-scripts/session-extraction-and-enrichment.md) for full implementation and test file listings.

---

### Setup, native module health and prerequisite validation

#### Description

Spec-folder prerequisite validation, native module diagnostics and rebuild, and Node ABI marker recording.

#### Current Reality

The prerequisite and native-module halves survive; the memory-server bootstrap and MCP registration steps were removed with the server.

#### Source Files

See [`tooling-and-scripts/setup-native-module-health-and-mcp-installation.md`](tooling-and-scripts/setup-native-module-health-and-mcp-installation.md) for full implementation and test file listings.

---

### sk-git numbered worktree convention

#### Description

Feature worktrees use a `wt/{NNNN}-{name}` branch under a `.worktrees/{NNNN}-{name}` directory, where `{NNNN}` is allocated, never hand-counted.

#### Current Reality

sk-git owns the full mechanics; this entry is a cross-reference.

#### Source Files

See [`tooling-and-scripts/sk-git-worktree-convention.md`](tooling-and-scripts/sk-git-worktree-convention.md) for full implementation and test file listings.

---

### Daemon-backed skill-advisor CLI surface

#### Description

Dual-stack CLI front door over the `system-skill-advisor` daemon, with manifest-backed commands, warm-only fallback and trusted mutation gating.

#### Current Reality

This is the only daemon-backed CLI surface left in the repository, and it powers Gate 2 routing.

#### Source Files

See [`tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md`](tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md) for full implementation and test file listings.

---

### Source-dist alignment enforcement

#### Description

Validates that every `.js` file under a compiled `dist/lib/` has a corresponding `.ts` source file, detecting orphaned build artifacts.

#### Current Reality

The check matters more after a large source deletion, because orphaned dist output is exactly what a prune leaves behind.

#### Source Files

See [`tooling-and-scripts/source-dist-alignment-enforcement.md`](tooling-and-scripts/source-dist-alignment-enforcement.md) for full implementation and test file listings.

---

### Spec-folder detection and description metadata

#### Description

Spec-folder detection, alignment validation, directory setup and description-metadata generation for the save workflow.

#### Current Reality

`scripts/spec-folder/` owns detection and `generate-description.ts` owns the generated `description.json`.

#### Source Files

See [`tooling-and-scripts/spec-folder-detection-and-description.md`](tooling-and-scripts/spec-folder-detection-and-description.md) for full implementation and test file listings.

---

### Spec folder literal naming: AI-derived slugs

#### Description

Workflow YAMLs and the SKILL.md naming rule require agents to propose phase and remediation slugs carrying a specific subject token.

#### Current Reality

AI-derived spec folders never default to a generic placeholder.

#### Source Files

See [`tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md`](tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md) for full implementation and test file listings.

---

### Spec folder literal naming: create.sh fallback

#### Description

`create.sh` emits `PROVIDE-DESCRIPTIVE-SLUG` placeholders and one stderr warning per child when `--phase-names` is omitted.

#### Current Reality

Generic `phase-N` names never reach the spec tree.

#### Source Files

See [`tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md`](tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md) for full implementation and test file listings.

---

### Spec lifecycle automation

#### Description

Coordinated shell lifecycle for recommending spec depth, creating spec folders and phases, upgrading level, measuring completion and archiving finished work.

#### Current Reality

`create.sh`, `recommend-level.sh`, `check-completion.sh` and `archive.sh` are the entry points.

#### Source Files

See [`tooling-and-scripts/spec-lifecycle-automation.md`](tooling-and-scripts/spec-lifecycle-automation.md) for full implementation and test file listings.

---

### Spec validation rule engine

#### Description

Validation orchestrator that detects spec level, loads configured or alphabetical rule scripts, applies severity policy, supports recursive phase validation, and emits human-readable or JSON results.

#### Current Reality

`validate.sh` is the authoritative completion gate; a stale compiled orchestrator makes it exit 3 with no rule output rather than pass silently.

#### Source Files

See [`tooling-and-scripts/spec-validation-rule-engine.md`](tooling-and-scripts/spec-validation-rule-engine.md) for full implementation and test file listings.

---

### Strict validation add-ons: continuity freshness and evidence markers

#### Description

Extends `validate.sh --strict` with continuity-freshness, evidence-marker lint, bracket-depth audit tooling and the normalizer lint guardrail.

#### Current Reality

`--strict` selects which rules run; a warning is advice and does not fail the run.

#### Source Files

See [`tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md`](tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md) for full implementation and test file listings.

---

### Template compliance contract enforcement

#### Description

Three-layer defense ensuring agent-generated spec documents pass structural validation on first write: injected anchor-to-H2 contracts, post-write validation, and content minimum rules.

#### Current Reality

The contract lives in `references/validation/template-compliance-contract.md` and binds every agent that writes authored spec docs.

#### Source Files

See [`tooling-and-scripts/template-compliance-contract-enforcement.md`](tooling-and-scripts/template-compliance-contract-enforcement.md) for full implementation and test file listings.

---

### Template composition system

#### Description

Level contract and inline rendering pipeline that generates packet documents from the current template source.

#### Current Reality

The level-contract resolver and the inline gate renderer decide which documents a level requires.

#### Source Files

See [`tooling-and-scripts/template-composition-system.md`](tooling-and-scripts/template-composition-system.md) for full implementation and test file listings.

---

### Tree thinning for spec folder consolidation

#### Description

Reduces token counts before spec-folder consolidation by classifying files and merging small ones into parent-level summaries.

#### Current Reality

`scripts/core/tree-thinning.ts` runs from the workflow module and has vitest coverage.

#### Source Files

See [`tooling-and-scripts/tree-thinning-for-spec-folder-consolidation.md`](tooling-and-scripts/tree-thinning-for-spec-folder-consolidation.md) for full implementation and test file listings.

---

## 3. SPEC-DOC QUALITY AND METADATA

### Spec-doc structure validator

#### Description

Fail-closes malformed frontmatter continuity blocks, merge legality, sufficiency, contamination and post-save fingerprint checks before a spec doc is accepted.

#### Current Reality

The validator runs from `validate.sh --strict`; its former memory-save caller is gone.

#### Source Files

See [`memory-quality-and-indexing/spec-doc-structure-validator.md`](memory-quality-and-indexing/spec-doc-structure-validator.md) for full implementation and test file listings.

---

### Spec folder description discovery

#### Description

Generates per-folder `description.json` metadata for every packet.

#### Current Reality

`scripts/spec-folder/generate-description.ts` is the surviving producer; the vector-search short-circuit it used to feed went with the memory engine.

#### Source Files

See [`memory-quality-and-indexing/spec-folder-description-discovery.md`](memory-quality-and-indexing/spec-folder-description-discovery.md) for full implementation and test file listings.

---

### Post-save quality review

#### Description

After canonical packet continuity is written, compares saved frontmatter against the original JSON payload and emits severity-graded findings.

#### Current Reality

`scripts/core/post-save-review.ts` runs at the end of the continuity write; HIGH findings must be patched by hand.

#### Source Files

See [`memory-quality-and-indexing/post-save-quality-review.md`](memory-quality-and-indexing/post-save-quality-review.md) for full implementation and test file listings.

---

## 4. GOVERNANCE

### Feature flag governance

#### Description

Operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits, plus the `SPECKIT_COMPILED_ROUTING` tri-state gate.

#### Current Reality

Cross-cutting rather than spec-kit-local: five other hub catalogs and the advisor's `advisor_recommend` entry link here for the compiled-routing contract. The memory engine's own flag family — retention, embedding cache and retry, launcher idle timeout, index scans and roadmap phases — was retired with that engine rather than deprecated in place.

#### Source Files

See [`governance/feature-flag-governance.md`](governance/feature-flag-governance.md) for full implementation and test file listings.

---

## 5. DOCTOR COMMANDS

### Doctor commands overview

#### Description

The argv-positional `/doctor` router and the subsystem routes it dispatches to.

#### Current Reality

The deep-loop, update and MCP-infrastructure routes survive; the memory and causal-graph routes were removed with the engine.

#### Source Files

See [`doctor-commands/category-overview.md`](doctor-commands/category-overview.md) for full implementation and test file listings.

---

## 6. MAINTENANCE

### Doctor router and manifest-driven dispatch

#### Description

Argv-positional `/doctor` router that dispatches to per-subsystem YAML workflows via a canonical `_routes.yaml` manifest.

#### Current Reality

The manifest is the single source for which subsystems a route may reach; retired subsystems are removed from it rather than left declared.

#### Source Files

See [`maintenance/doctor-router-and-manifest-dispatch.md`](maintenance/doctor-router-and-manifest-dispatch.md) for full implementation and test file listings.

---

## 7. LIFECYCLE

### Speckit autopilot lifecycle

#### Description

The branch-preserved `:autopilot` / `:unattended` command envelope for `/speckit:plan`, `/speckit:implement` and `/speckit:complete`.

#### Current Reality

The envelope preserves the working branch and keeps the mandatory gates intact.

#### Source Files

See [`lifecycle/speckit-autopilot-lifecycle.md`](lifecycle/speckit-autopilot-lifecycle.md) for full implementation and test file listings.

---

## 8. RETRIEVAL

### Session recovery via /speckit:resume

#### Description

Reconstructs interrupted session state through the spec-folder resume workflow and routes the operator to one next step.

#### Current Reality

The continuity ladder is `handover.md` -> `_memory.continuity` -> packet-first spec docs and bounded anchors. There is no session inference and no memory-tool helper surface behind it.

#### Source Files

See [`retrieval/session-recovery-spec-kit-resume.md`](retrieval/session-recovery-spec-kit-resume.md) for full implementation and test file listings.

---

## 9. CONTEXT PRESERVATION

### Resource map template

#### Description

Optional cross-cutting packet template that records the file footprint of a packet in one flat, review-friendly place.

#### Current Reality

It complements `implementation-summary.md` by listing paths rather than narrative, so a reviewer never reconstructs that ledger from prose or git history.

#### Source Files

See [`context-preservation/resource-map-template.md`](context-preservation/resource-map-template.md) for full implementation and test file listings.

---

## 10. CONFIGURATION CONTRACTS

### Runtime config contract

#### Description

`config/config.jsonc` is the editable JSONC surface for the script-side runtime configuration loader.

#### Current Reality

Active top-level workflow keys merge into `WorkflowConfig`; the remaining sections stay in the file as documentation only.

#### Source Files

See [`feature-flag-reference/runtime-config-contract.md`](feature-flag-reference/runtime-config-contract.md) for full implementation and test file listings.

---

### Filter config contract

#### Description

`config/filters.jsonc` is the file-backed contract for the content-filter pipeline used by `scripts/lib/content-filter.ts`.

#### Current Reality

It controls whether the pipeline runs, the ordered stage list, and the thresholds for noise rejection, deduplication and quality scoring.

#### Source Files

See [`feature-flag-reference/filter-config-contract.md`](feature-flag-reference/filter-config-contract.md) for full implementation and test file listings.

---

## 11. UX HOOKS

### Cross-runtime directive-lifecycle dedup

#### Description

Lifecycle-scoped advisor policy delivery with transcript high-water tracking, trusted host-boundary invalidation and hardened durable state.

#### Current Reality

The contract is owned by `system-skill-advisor`, which survives the memory decommission and still powers Gate 2.

#### Source Files

See [`ux-hooks/directive-lifecycle-dedup.md`](ux-hooks/directive-lifecycle-dedup.md) for full implementation and test file listings.

---

### Goal OpenCode plugin

#### Description

Local `/goal` OpenCode plugin that persists session objectives, injects active-goal context and exposes `opencode_goal` tools.

#### Current Reality

The plugin keeps its own local state and never depended on the memory database.

#### Source Files

See [`ux-hooks/goal-opencode-plugin.md`](ux-hooks/goal-opencode-plugin.md) for full implementation and test file listings.
