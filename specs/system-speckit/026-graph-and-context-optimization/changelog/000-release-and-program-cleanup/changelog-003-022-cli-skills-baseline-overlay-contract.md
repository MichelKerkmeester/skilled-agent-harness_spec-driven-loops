---
title: "CLI Skills Baseline and Overlay Contract"
description: "Five CLI orchestrator skills updated to use a codebase-agnostic baseline+overlay standards contract instead of hardcoded sk-code-review / sk-code-opencode references. Ten files edited across cli-claude-code, cli-codex, cli-gemini, cli-opencode."
trigger_phrases:
  - "cli skills baseline overlay contract"
  - "codebase-agnostic standards contract"
  - "cli skill.md code standards loading"
  - "sk-code overlay hardcoded replacement"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Five CLI orchestrator skills (`cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode`) hardcoded specific overlay skill names (`sk-code-review`, `sk-code-opencode`) in their dispatch instructions. When a different stack was active (Webflow, React/Next.js, Go), the dispatch prompt directed the dispatched session to load the wrong overlay, silently producing mismatched code standards.

Each SKILL.md gained an identical numbered ALWAYS rule titled "Code Standards Loading (codebase-agnostic baseline+overlay contract)". The rule instructs dispatched sessions to load `sk-code` baseline first, detect stack signals from markers and target files, load exactly one matching `sk-code-*` overlay then apply precedence rules. Seven direct overlay-skill mentions were replaced with codebase-agnostic phrasing across cli-codex and cli-opencode reference files. All 10 files were pure documentation rewrites with no behavior changes, no schema changes, no moves or deletes.

### Added

- None.

### Changed

- Canonical "Code Standards Loading (codebase-agnostic baseline+overlay contract)" ALWAYS rule added to `cli-claude-code/SKILL.md` as item 9
- Canonical "Code Standards Loading" ALWAYS rule added to `cli-codex/SKILL.md` as item 11
- Canonical "Code Standards Loading" ALWAYS rule added to `cli-gemini/SKILL.md` as item 9
- Canonical "Code Standards Loading" ALWAYS rule added to `cli-opencode/SKILL.md` as item 12
- `cli-codex/references/hook_contract.md` advisor-brief example updated: `sk-code-opencode` replaced with `sk-code`
- `cli-codex/SKILL.md` Skill Integration table collapsed from two `sk-code` rows to one baseline+overlay row
- Six remaining `sk-code-review` / `sk-code-opencode` mentions in cli-opencode references, playbook, prompt template replaced with codebase-agnostic phrasing

### Fixed

- Dispatch prompts no longer instruct dispatched sessions to load a stack-specific overlay when a different stack is active

### Verification

- 5 of 5 CLI SKILL.md files contain the canonical "Code Standards Loading (codebase-agnostic baseline+overlay contract)" rule
- Zero non-anti-pattern mentions of `sk-code-review` / `sk-code-opencode` in active CLI skill files
- 9 of 10 modified files pass `validate_document.py`. `cli-codex/references/hook_contract.md` fails on `missing_required_section: overview`, a pre-existing quirk not introduced by this packet
- Cross-skill consistency confirmed: canonical insert text byte-identical across all 5 SKILL.md files
- 17 of 17 tasks completed

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/cli-claude-code/SKILL.md` | Canonical Code Standards Loading rule inserted as ALWAYS item 9 |
| `.opencode/skills/cli-codex/SKILL.md` | Canonical rule inserted as ALWAYS item 11. Skill Integration table collapsed to one baseline+overlay row. |
| `.opencode/skills/cli-gemini/SKILL.md` | Canonical rule inserted as ALWAYS item 9 |
| `.opencode/skills/cli-opencode/SKILL.md` | Canonical rule inserted as ALWAYS item 12. Cross-reference and Skill Integration table updated to baseline+overlay phrasing. |
| `.opencode/skills/cli-codex/references/hook_contract.md` | Advisor-brief example on line 112 updated: `sk-code-opencode` replaced with `sk-code` |
| `.opencode/skills/cli-opencode/references/opencode_tools.md` | Skill access list updated to baseline+overlay phrasing |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Notation note updated to `sk-code` baseline compatible phrasing |
| `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/003-template-applied-to-real-dispatch.md` | Prompt body updated: contract bullet and table cell replaced with codebase-agnostic phrasing |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | TEMPLATE 5 (Code Review) lines 193 and 196 to 197 updated to canonical codebase-agnostic phrasing |

### Follow-Ups

- Address `hook_contract.md` missing Overview H2 section. The `missing_required_section: overview` validator failure is pre-existing and was not introduced by this packet. A follow-on cleanup pass should add the missing section.
- Refresh downstream copies of TEMPLATE 5. Local copies users may have made of cli-opencode TEMPLATE 5 still contain the old hardcoded mentions. The canonical template is fixed and consumers should refresh.
