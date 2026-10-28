# Baseline: cli-external-orchestration, cli-classifier and mcp-tooling hubs

Recorded on 2026-10-28 from the worktree at `9fdae0b7d4`, which is main with phases 001 to 007 landed, before any phase edit. Raw logs: `.scratch-dc90/072-008/baseline/`, one file per gate. Runner: `scratch/gates.sh`.

## 1. Gates

All 39 gates exit 0: seven `parent-skill-check` runs, the compiled-route guard and the sync check, `verify-router-sync`, fourteen `package_skill.py --check --strict` runs, the rule-copies canary, router vocabulary reach, the Hermes mirror check, the sk-code setup battery, root metadata, leaf-manifest freshness, the router test files, routing accuracy, recursive strict validation of the parent packet, contract drift, the advisor routing suites, the feature-catalog package validator, the sk-doc script tests, the cite-drift gate and the skill-graph freshness report.

Two of the fourteen `package_skill.py` runs carry one advisory each, and both advisories are the routing-shape warning on the hub they check: `pkg-cli-external-orchestration` and `pkg-cli-classifier`. `pkg-mcp-tooling` carries none.

## 2. Routing accuracy

| Corpus | Top-1 |
|---|---|
| Full corpus | 155 / 195 |
| Holdout | 49 / 66 |
| Ambiguity | 19 / 24 |

## 3. Routing shape

Eighteen ledger entries belong to the three hubs and their sixteen packets, and every one of them is reported as known debt by `parent-skill-check`:

| Key | Lines | Words | Machine blocks | Codes |
|---|---|---|---|---|
| `cli-external-orchestration` | 26 | 586 | 0 | RS-001 |
| `cli-external-orchestration/cli-claude-code` | 87 | 808 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-codex` | 86 | 588 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-cursor` | 94 | 685 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-devin` | 85 | 605 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-hermes` | 82 | 610 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-opencode` | 64 | 1026 | 1 | RS-001, RS-002 |
| `cli-external-orchestration/cli-pi` | 57 | 492 | 1 | RS-001, RS-002 |
| `cli-classifier` | 24 | 334 | 0 | RS-001 |
| `cli-classifier/cli-jev` | 136 | 771 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-aside-devtools` | 128 | 754 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-chrome-devtools` | 128 | 736 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-click-up` | 172 | 1107 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-figma` | 142 | 1276 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-mobbin` | 135 | 1161 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-notion` | 177 | 1069 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-obsidian` | 294 | 1676 | 1 | RS-001, RS-002 |
| `mcp-tooling/mcp-refero` | 132 | 1100 | 1 | RS-001, RS-002 |

Three more cli and mcp keys sit in the same ledger and are not this phase's: `cli-orca` and `mcp-code-mode` are standalone skills, and `mcp-tooling/mcp-magicpath` is out of scope because another session is deprecating it. The ledger holds 26 entries at `HEAD`; the eighteen above are the ones this phase closes.

The three hubs report nineteen known-debt entries between them, because `mcp-tooling` also reports its ninth packet:

```text
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration
PASS: 12b-routing-shape: hub and 7 packet(s) follow the routing canon (8 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 1.7.9.0

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier
PASS: 12b-routing-shape: hub and 1 packet(s) follow the routing canon (2 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 0.8.3.0

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling
PASS: 12b-routing-shape: hub and 9 packet(s) follow the routing canon (9 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 1.8.9.0
```

## 4. What the baseline already had, and what it repeated

`mcp-tooling/SKILL.md` is 10 non-blank lines and 148 words at `HEAD`, already inside the 12-line and 180-word canon limits, and it carries no `MACHINE ROUTER` heading. It is the one hub of the three that the routing shape does not ask to change, and the phase leaves it alone.

The seven cli packets each end their SMART ROUTING with a numbered **Call sequence** of the same six steps. The steps name the shared helpers `discover_markdown_resources()`, `_guard_in_skill()`, `load_if_available()`, `score_intents()`, `select_intents()` and `get_routing_key()`, whose bodies live in `system-spec-kit/references/cli/shared-smart-router.md`. So the same sequence is written seven times, and each copy points at the file that already states it.

All three hubs' `routerPolicy.defaultMode` is `null`, and `cli-jev` is the only mode `cli-classifier` registers.
