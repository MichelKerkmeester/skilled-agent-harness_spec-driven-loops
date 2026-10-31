---
title: "Iteration 2: COMMANDS sweep — /memory:learn, /memory:manage, /memory:search, /memory:save + presentation assets + workflow YAMLs"
trigger_phrases: []
---
# Iteration 2: COMMANDS sweep — /memory:learn, /memory:manage, /memory:search, /memory:save + presentation assets + workflow YAMLs

## Focus
Every command doc and presentation asset naming constitutional or learned-triggers; classify command-surface action per touchpoint.

## Findings

### F2.1 /memory:learn — the constitutional-authoring command (entire command is in scope)
- `learn.md:2` description "Create and manage constitutional rules — always-surface entries that appear at the top of every search result"; `:9` "Thin router for constitutional rule management"; `:13` Destination `.opencode/skills/system-spec-kit/constitutional/`; `:22,34,44,46-48,54,58,61,80` — routing to constitutional dir writes, create/edit/remove routes, "verify constitutional visibility with memory_search", index via memory_save/memory_index_scan. [SOURCE: file:.opencode/commands/memory/learn.md:2,13,22,46,54,61]
- `learn-presentation.txt:16` "Do not infer a new constitutional rule from prior conversation context"; `:41-42` "This rule may not need constitutional tier. Constitutional rules appear in every search result and consume the shared budget."; `:72` "Tier constitutional"; `:121` "DESTRUCTIVE This removes a constitutional rule." [SOURCE: file:.opencode/commands/memory/assets/learn-presentation.txt:16,41,72,121]
- Action: command + asset are the authoring surface for the deprecated layer → retarget to plain-doc authoring (or DELETE command; owner direction: rules stay as plain docs, so command must be repurposed/retired). Class: TODO (retarget or delete).

### F2.2 /memory:manage — tier distribution + learned-trigger maintenance
- `manage.md:2` description names "learned triggers"; `:44-45` `learned-expire [--dry-run]` / `learned-clear` modes; `:70-71` tool map (memory_learned_expire/clear); `:88` presentation boundary lists learned-trigger maintenance; `:99` workflow summary. [SOURCE: file:.opencode/commands/memory/manage.md:2,44,70,88]
- `manage-presentation.txt:8` confirmations for learned-trigger expiry/clear; `:22,48,71` tier distribution lines `constitutional <count>`; `:115` "Protected: constitutional <count>"; `:149-183` learned-expire/learned-clear dashboards; `:197,215` learned_feedback_audit ledger counts. [SOURCE: file:.opencode/commands/memory/assets/manage-presentation.txt:22,71,115,149,197]
- Action: tier-distribution rows → DELETE after tier removal; learned-trigger surface → inventory-only (system C dead, 0 rows; formal removal out of scope). Class: TODO (constitutional parts) / KEEP (learned surface, noted).

### F2.3 /memory:search — constitutional presentation contract
- `search.md:159` related-commands mention only. [SOURCE: file:.opencode/commands/memory/search.md:159]
- `search-presentation.txt:12` "Empty results: Section 3, trigger fallback and constitutional rows"; `:135-137` "Constitutional rows are context, not ranked hits: exclude any result whose isConstitutional is true... List them, if relevant, under a separate `Constitutional rules` heading"; `:160,167` forbidden-vocabulary rules for constitutional-result labels. [SOURCE: file:.opencode/commands/memory/assets/search-presentation.txt:12,135,160,167]
- Action: presentation contract for constitutional display → DELETE after deprecation (no constitutional rows exist in results). Class: TODO.

### F2.4 /memory:save + memory README
- `save.md:92` related-commands prose "constitutional rules". [SOURCE: file:.opencode/commands/memory/save.md:92]
- `memory/README.txt:3` description; `:38` overview "constitutional memory management"; `:60` learn command description; `:80-84` Learn Subcommands table; `:141,144` (structure/notes); `:305` FAQ "Use /memory:learn to create constitutional memories..."; `:323` troubleshooting "constitutional rules under .opencode/skills/*/constitutional/". [SOURCE: file:.opencode/commands/memory/README.txt:3,38,60,80,305,323]
- `commands/README.txt:201` Learn command purpose "Create and manage constitutional memories". [SOURCE: file:.opencode/commands/README.txt:201]
- Action: rewrite/remove constitutional prose; FAQ + troubleshooting entries retarget to plain-doc rules. Class: TODO.

### F2.5 speckit workflow YAMLs — tier_reference strings (6 files)
- `speckit-plan-confirm.yaml:760`, `speckit-plan-auto.yaml:698`, `speckit-implement-confirm.yaml:632`, `speckit-implement-auto.yaml:603`, `speckit-complete-confirm.yaml:1141`, `speckit-complete-auto.yaml:1180` — all `tier_reference: "constitutional > critical > important > normal > temporary > deprecated"` in importance_tier assignment steps. [SOURCE: grep -n constitutional .opencode/commands/speckit/assets/*.yaml]
- Action: drop `constitutional` from tier_reference ladder (critical becomes top tier in prompts). Class: TODO.

### F2.6 create workflow YAMLs — tier_reference blocks (5 files)
- `create-readme-confirm.yaml:695,1242`, `create-readme-auto.yaml:695,1150`, `create-command-auto.yaml:590`, `create-agent-confirm.yaml:726`, `create-agent-auto.yaml:630` — all `constitutional: Core project rules (auto-surface always)` lines in tier_reference blocks. [SOURCE: grep -n constitutional .opencode/commands/create/assets/*.yaml]
- Action: remove constitutional line from tier reference. Class: TODO.

### F2.7 Learned-trigger maintenance handlers exist (system C surface)
- `handlers/memory-learned-maintenance.ts` (file exists; verified earlier in handlers listing) — learned-expire/learned-clear tool backend; tied to 30-day TTL learned triggers, 0 rows per grounding. [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/handlers/memory-learned-maintenance.ts (exists; detail deferred)]

## Sources Consulted
- `.opencode/commands/memory/{learn,manage,search,save}.md`, `README.txt`, `assets/*.txt`
- `.opencode/commands/README.txt`, `.opencode/commands/speckit/assets/*.yaml`, `.opencode/commands/create/assets/*.yaml`

## Assessment
- newInfoRatio: 1.0 — command surface fully inventoried; no overlap with Iter 1 (code).
- Novelty justification: complete command-doc + presentation + YAML sweep with file:line coordinates.
- Confidence: high (grep + reads confirmed); F2.7 handler detail deferred to Iter 3/10.

## Reflection
- Worked: count-then-files_with_matches grep pattern to triage command trees.
- Ruled out: needing to read full presentation assets — context greps captured all constitutional/learned lines.

## Recommended Next Focus
Iter 3: TESTS sweep — every constitutional/learned test file; what each MUST assert after deprecation.
