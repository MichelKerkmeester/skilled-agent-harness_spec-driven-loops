---
title: "Spec Validation Rule Engine"
description: "Validation orchestrator that detects spec level, loads configured or alphabetical rule scripts, applies severity policy, supports recursive phase validation, and emits human-readable or JSON results."
trigger_phrases:
  - "spec validation rule engine"
  - "validate.sh"
  - "run validation rules"
  - "rule scripts"
  - "recursive phase validation"
version: 3.6.0.8
---

# Spec Validation Rule Engine

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Spec Validation Rule Engine is the executable validation surface behind Spec Kit's documentation quality gates.

The engine is centered on `validate.sh`, which acts as an orchestrator for a directory of rule scripts under `scripts/rules/`. It detects the target spec level, resolves which rules to run, applies severity mapping, executes each rule in-process, and aggregates the result into terminal-friendly output or JSON for automation.

---

## 2. HOW IT WORKS

### Entry Point & Routing

`validate.sh` is a rule runner, not a single monolithic validator. It begins with hard skip controls: `SPECKIT_SKIP_VALIDATION` exits immediately, and `SPECKIT_VALIDATION=false` also disables execution. From there it parses CLI flags for JSON, strict mode, verbose mode, quiet mode, and recursive validation, then loads optional configuration from `.speckit.yaml` in the target folder or repository root.

Rule selection is configurable but deterministic. If `SPECKIT_RULES` is set, the engine canonicalizes the requested subset and only runs those rules. If `.speckit.yaml` declares `rule_order`, that order is respected. Otherwise the engine runs every `check-*.sh` file in `scripts/rules/` alphabetically. Canonical rule names are mapped to script basenames such as `FILE_EXISTS -> check-files.sh` and `PHASE_LINKS -> check-phase-links.sh`.

Rule execution is dynamic but guarded. For each selected rule script, the orchestrator resolves the real path, verifies that it remains inside `RULES_DIR`, requires a `.sh` extension, sources the file, and calls its `run_check` function with the target folder and detected level. Each rule reports through shared `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS`, and `RULE_REMEDIATION` variables, which `validate.sh` then converts into pass, warn, error, or info output. Verbose mode adds per-rule timing.

### Quality Gates & Validation

Severity is partly centralized in the orchestrator. Missing files, placeholders, anchor issues, table-of-contents policy, template-header mismatches, and spec-doc integrity failures are treated as errors. Section, priority, evidence, and phase-link issues are warnings by default. Level declaration is informational. `--strict` upgrades warning-bearing runs into exit-code failure without changing the underlying rule outputs.

Level detection is shared infrastructure for the whole engine. `validate.sh` first looks for explicit level markers in `spec.md`, including `<!-- SPECKIT_LEVEL: ... -->`, metadata tables, bullet metadata, YAML frontmatter, or line-anchored `Level:` text. A `<!-- SPECKIT_LEVEL: review -->` marker selects the lean review-record path, which requires only `spec.md` plus `review/review-report.md` and waives the `plan.md`, `tasks.md` and `implementation-summary.md` requirements that apply to numbered levels. The review marker is the only entry into that path, so no inferred folder reaches it. If no explicit declaration is present, it infers Level 3 from `decision-record.md`, Level 2 from `checklist.md`, and Level 1 otherwise.

Phase awareness is built into the engine. If the target folder contains child directories matching `NNN-*/`, recursive validation is auto-enabled unless `--no-recursive` is passed. In recursive mode, the parent is validated first, then each child phase is validated with its own detected level, and JSON output includes a separate `phases[]` result set plus aggregate counts.

The current rule engine therefore behaves like a shell-based plugin host: central orchestration, distributed checks, configurable order, shared severity policy, and optional recursive traversal across phased spec packets.

### Edge Cases & Caveats

The implementation extended the strict path beyond the original shell-rule inventory. `validate.sh --strict` now runs the continuity-freshness check (`32a180bba`), the evidence-marker lint wrapper built on the new bracket-depth audit parser (`7d85861a0`, `e40dff0bb`), and the scope-normalizer duplication guard (`ded5ece07`). That means the rule engine now enforces stale continuity timestamps, malformed `[EVIDENCE:...]` markers, and new duplicate `normalizeScope*` helpers in the same operator-facing strict run instead of relying on ad hoc sweep scripts alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Orchestrator | Parses flags and config, detects level, resolves rule order, sources rule scripts, aggregates results, and handles recursive phase validation |
| `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` | Validation helper | Warns when `_memory.continuity.last_updated_at` lags `graph-metadata.json.derived.last_save_at` |
| `.opencode/skills/system-spec-kit/scripts/validation/evidence-marker-audit.ts` | Validation helper | Bracket-depth evidence-marker parser used for audit and repair sweeps |
| `.opencode/skills/system-spec-kit/scripts/validation/evidence-marker-lint.ts` | Validation helper | Strict lint wrapper that fails malformed evidence-marker cases |

### Rule Inventory

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh` | Validation rule | Rule script discovered and executed by the orchestrator for the AI protocols domain |
| `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh` | Validation rule | Rule script discovered and executed by the orchestrator for anchor validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh` | Validation rule | Rule script discovered and executed by the orchestrator for complexity matching |
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | Validation rule | Rule script discovered and executed by the orchestrator for evidence citation checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh` | Validation rule | Rule script discovered and executed by the orchestrator for required file checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-folder-naming.sh` | Validation rule | Rule script discovered and executed by the orchestrator for folder naming checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh` | Validation rule | Rule script discovered and executed by the orchestrator for frontmatter validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh` | Validation rule | Rule script discovered and executed by the orchestrator for level matching checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level.sh` | Validation rule | Rule script discovered and executed by the orchestrator for level declaration checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-links.sh` | Validation rule | Rule script discovered and executed by the orchestrator for link validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-normalizer-lint.sh` | Validation rule | Rule script discovered and executed by the orchestrator for duplicate scope-normalizer detection |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-links.sh` | Validation rule | Rule script discovered and executed by the orchestrator for parent-child phase linkage checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh` | Validation rule | Rule script discovered and executed by the orchestrator for placeholder detection |
| `.opencode/skills/system-spec-kit/scripts/rules/check-priority-tags.sh` | Validation rule | Rule script discovered and executed by the orchestrator for checklist priority-tag checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Validation rule | Rule script discovered and executed by the orchestrator for section-count validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh` | Validation rule | Rule script discovered and executed by the orchestrator for required section checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` | Validation rule | Rule script discovered and executed by the orchestrator for spec document integrity checks |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` | Validation rule | Rule script discovered and executed by the orchestrator for template-header validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh` | Validation rule | Rule script discovered and executed by the orchestrator for template-source validation |
| `.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh` | Validation rule | Rule script discovered and executed by the orchestrator for table-of-contents policy checks |

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling-and-scripts/spec-validation-rule-engine.md`
Related references:
- [spec-lifecycle-automation.md](spec-lifecycle-automation.md) — Spec Lifecycle Automation
- [memory-maintenance-and-migration-clis.md](memory-maintenance-and-migration-clis.md) — Memory Maintenance and Migration CLIs
