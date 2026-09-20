---
title: "Command Benchmark Census Snapshot"
description: "Frozen 36-command OpenCode source inventory and its 36 generated Codex prompt mirrors, captured before the command-benchmark launcher is added."
trigger_phrases:
  - "command benchmark census snapshot"
  - "36 command baseline"
  - "Codex prompt mirror inventory"
importance_tier: "important"
contextType: "implementation"
---

# Command Benchmark Census Snapshot

## 1. OVERVIEW

This snapshot freezes the exact pre-launcher command source and generated-mirror inventory that every downstream benchmark phase uses for discovery, fixtures, coverage, and closeout reconciliation.

## 2. FROZEN BASELINE

The phase-000 baseline is **36 canonical command sources and 36 generated Codex prompt mirrors**. The canonical inventory is the source walk implemented by `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`: Markdown files under `.opencode/commands/`, excluding `assets/`, `scripts/`, `fixtures/`, `README.md`, and `*.contract.md`. Mirrors are the generated Markdown files directly under `.codex/prompts/`.

Baseline capture on 2026-07-15:

```text
[codex-prompt-sync] PASS: 36 prompts are in sync.
source_count=36
mirror_count=36
```

The source inventory is authoritative. A copied count or this table is a revision snapshot, not an alternative discovery mechanism.

## 3. REPRODUCTION

Run from the repository root:

```bash
node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check

rg --files .opencode/commands \
  -g '*.md' \
  -g '!**/assets/**' \
  -g '!**/scripts/**' \
  -g '!**/fixtures/**' \
  -g '!**/README.md' \
  -g '!**/*.contract.md' \
  | sort | wc -l

rg --files .codex/prompts -g '*.md' | sort | wc -l
```

The gate passes only when the sync check exits `0`, both counts are `36`, and the source-to-mirror mapping below has no missing, stale, or extra mirror.

## 4. EXACT SOURCE-TO-MIRROR INVENTORY

| # | Canonical source | Generated Codex mirror |
| ---: | --- | --- |
| 1 | `.opencode/commands/agent_router.md` | `.codex/prompts/agent_router.md` |
| 2 | `.opencode/commands/create/agent.md` | `.codex/prompts/create-agent.md` |
| 3 | `.opencode/commands/create/benchmark.md` | `.codex/prompts/create-benchmark.md` |
| 4 | `.opencode/commands/create/changelog.md` | `.codex/prompts/create-changelog.md` |
| 5 | `.opencode/commands/create/command.md` | `.codex/prompts/create-command.md` |
| 6 | `.opencode/commands/create/feature-catalog.md` | `.codex/prompts/create-feature-catalog.md` |
| 7 | `.opencode/commands/create/flowchart.md` | `.codex/prompts/create-flowchart.md` |
| 8 | `.opencode/commands/create/manual-testing-playbook.md` | `.codex/prompts/create-manual-testing-playbook.md` |
| 9 | `.opencode/commands/create/readme.md` | `.codex/prompts/create-readme.md` |
| 10 | `.opencode/commands/create/skill-parent.md` | `.codex/prompts/create-skill-parent.md` |
| 11 | `.opencode/commands/create/skill.md` | `.codex/prompts/create-skill.md` |
| 12 | `.opencode/commands/deep/agent-improvement.md` | `.codex/prompts/deep-agent-improvement.md` |
| 13 | `.opencode/commands/deep/ai-council.md` | `.codex/prompts/deep-ai-council.md` |
| 14 | `.opencode/commands/deep/alignment.md` | `.codex/prompts/deep-alignment.md` |
| 15 | `.opencode/commands/deep/model-benchmark.md` | `.codex/prompts/deep-model-benchmark.md` |
| 16 | `.opencode/commands/deep/research.md` | `.codex/prompts/deep-research.md` |
| 17 | `.opencode/commands/deep/review.md` | `.codex/prompts/deep-review.md` |
| 18 | `.opencode/commands/deep/skill-benchmark.md` | `.codex/prompts/deep-skill-benchmark.md` |
| 19 | `.opencode/commands/design/audit.md` | `.codex/prompts/design-audit.md` |
| 20 | `.opencode/commands/design/foundations.md` | `.codex/prompts/design-foundations.md` |
| 21 | `.opencode/commands/design/interface.md` | `.codex/prompts/design-interface.md` |
| 22 | `.opencode/commands/design/md-generator.md` | `.codex/prompts/design-md-generator.md` |
| 23 | `.opencode/commands/design/motion.md` | `.codex/prompts/design-motion.md` |
| 24 | `.opencode/commands/doctor/mcp.md` | `.codex/prompts/doctor-mcp.md` |
| 25 | `.opencode/commands/doctor/speckit.md` | `.codex/prompts/doctor-speckit.md` |
| 26 | `.opencode/commands/doctor/update.md` | `.codex/prompts/doctor-update.md` |
| 27 | `.opencode/commands/goal_opencode.md` | `.codex/prompts/goal_opencode.md` |
| 28 | `.opencode/commands/memory/learn.md` | `.codex/prompts/memory-learn.md` |
| 29 | `.opencode/commands/memory/manage.md` | `.codex/prompts/memory-manage.md` |
| 30 | `.opencode/commands/memory/save.md` | `.codex/prompts/memory-save.md` |
| 31 | `.opencode/commands/memory/search.md` | `.codex/prompts/memory-search.md` |
| 32 | `.opencode/commands/prompt-improve.md` | `.codex/prompts/prompt-improve.md` |
| 33 | `.opencode/commands/speckit/complete.md` | `.codex/prompts/speckit-complete.md` |
| 34 | `.opencode/commands/speckit/implement.md` | `.codex/prompts/speckit-implement.md` |
| 35 | `.opencode/commands/speckit/plan.md` | `.codex/prompts/speckit-plan.md` |
| 36 | `.opencode/commands/speckit/resume.md` | `.codex/prompts/speckit-resume.md` |

## 5. BASELINE-TO-FINAL TRANSITION

Phase 000 freezes the pre-launcher baseline at `36 / 36`. Phase 009 adds exactly one canonical source, `.opencode/commands/deep/command-benchmark.md`, and generates exactly one mirror, `.codex/prompts/deep-command-benchmark.md`. Phase 010 must therefore reproduce `37 / 37`; any other delta is census drift and invalidates closeout until reconciled.
