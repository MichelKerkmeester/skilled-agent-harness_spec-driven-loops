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

The engine has two parts with a firm division. `validate.sh` is a front-end: it resolves arguments and the set of folders to validate, then hands every rule decision to the compiled orchestrator at `mcp-server/lib/validation/orchestrator.ts`. The orchestrator detects the target spec level, runs the rules, and aggregates the result into terminal-friendly output or JSON.

The front-end deliberately implements no rules of its own. It used to carry a second, independent implementation of the same rule set, chosen between by environment; the two disagreed, so a packet's verdict depended on how the caller's shell was configured. One engine is the point.

---

## 2. HOW IT WORKS

### Entry Point & Routing

`validate.sh` begins with hard skip controls: `SPECKIT_SKIP_VALIDATION` exits immediately, and `SPECKIT_VALIDATION=false` also disables execution. From there it parses CLI flags for JSON, strict mode, verbose mode, quiet mode, and recursive validation, resolves the folder set, and delegates. A compiled build is preferred; a source-only checkout runs the orchestrator through the TypeScript loader. When neither is available it exits `3` asking for a build rather than answering with a different rule set.

Rule inventory lives in `scripts/lib/validator-registry.json`, which carries each rule's id, aliases, script path, severity, and category. The orchestrator implements the most common rules natively and shells out to the registry for the rest, so duplication is bounded to the handful implemented twice rather than all of them.

Rule selection is deterministic. By default every registry rule runs except those marked `skip`, plus the rules marked `strict_only` when `--strict` is passed. `SPECKIT_RULES` narrows the run to a named subset, canonicalizing aliases and hyphenated spellings. It selects *which* rules run and never *how* a rule decides, so a narrowed run cannot change a verdict on any rule it includes. A name the registry does not recognise is a hard error: a subset that matched nothing would otherwise report a clean pass for a packet no rule had examined.

Registry dispatch is guarded. For each rule the orchestrator resolves the real path, verifies it remains inside the rules directory (or the compiled validation directory for Node rules), and refuses anything that escapes. Shell rules report through `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS`, and `RULE_REMEDIATION`, which the orchestrator converts into pass, warn, error, or info entries. Detail lines print whenever a rule produced any, because a finding that will not say what it found cannot be acted on.

### Quality Gates & Validation

Severity comes from the registry, not from a table in the front-end. Missing files, placeholders, anchor issues, table-of-contents policy, template-header mismatches, and spec-doc integrity failures are errors. Section, priority, evidence, and phase-link issues are warnings. Level declaration is informational. `--strict` upgrades warning-bearing runs into exit-code failure without changing the underlying rule outputs.

Level detection belongs to the orchestrator. It first looks for explicit level markers in `spec.md`, including `<!-- SPECKIT_LEVEL: ... -->`, metadata tables, bullet metadata, YAML frontmatter, or line-anchored `Level:` text. A `<!-- SPECKIT_LEVEL: review -->` marker selects the lean review-record path, which requires only `spec.md` plus `review/review-report.md` and waives the `plan.md`, `tasks.md` and `implementation-summary.md` requirements that apply to numbered levels. The review marker is the only entry into that path, so no inferred folder reaches it. If no explicit declaration is present, it infers Level 3 from `decision-record.md`, Level 2 from `checklist.md`, and Level 1 otherwise.

Phase awareness sits in the front-end. If the target folder contains child directories matching `NNN-*/`, recursive validation is auto-enabled unless `--no-recursive` is passed. The parent is validated first, then each child phase with its own detected level, and the run's exit code is the worst of them. A caller can declare exactly which children a recursive run must cover by pointing `SPECKIT_CHILD_MANIFEST_FILE` at a hashed manifest, so a child cannot be added or dropped without the declaration changing with it. In JSON mode each folder emits its own report object rather than one wrapper.

The engine therefore behaves as one validator with a thin front-end: a single place where rules are decided, a registry that names them, and optional recursive traversal across phased spec packets.

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

> **Representative subset.** The table below is an illustrative sample of rule scripts, not the full set. The authoritative, complete rule roster — including `check-ac-coverage.sh` (advisory `AC_COVERAGE`, default-on) — is the registry at `scripts/lib/validator-registry.json`.

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

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-validation-rule-engine.md`
Related references:
- [spec-lifecycle-automation.md](../../feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md) — Spec Lifecycle Automation
- [memory-maintenance-and-migration-clis.md](../../feature-catalog/tooling-and-scripts/memory-maintenance-and-migration-clis.md) — Memory Maintenance and Migration CLIs
