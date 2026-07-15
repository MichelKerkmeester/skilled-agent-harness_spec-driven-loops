# Iteration 9 — Cross-Surface Integration Trace

## Focus

This iteration traced one `.opencode/` implementation/spec-folder-write flow across system-spec-kit, sk-code, and mcp-coco-index. The goal was to verify whether sk-code guidance is loaded at authoring time, whether spec-folder write rules are first-class OpenCode resources, and whether CocoIndex can act as the retrieval bridge for those resources.

## Actions Taken

- Action 1: Read strategy Section 11 and prior iteration findings to avoid re-reporting the known `STACK_FOLDERS`, OpenCode asset, and resource-map gaps.
- Action 2: Traced system-spec-kit implementation/complete flow references to `sk-code`, especially `speckit_implement_auto.yaml`, `speckit_complete_auto.yaml`, and `system-spec-kit/SKILL.md`.
- Action 3: Read sk-code OpenCode routing and resource-loading docs, including `SKILL.md`, `references/router/resource_loading.md`, and `references/opencode/shared/universal_patterns.md`.
- Action 4: Inspected mcp-coco-index include/exclude configuration, indexer/query behavior, and local SQLite auxiliary rows to verify whether `.opencode/skills/sk-code/` resources are ingested.
- Action 5: Attempted a live `ccc status` smoke probe; the daemon could not start inside this sandbox because it tried to write under `~/.cocoindex_code/daemon.log`, so ranking claims below are limited to direct database ingestion evidence.

## Findings

### system-spec-kit / sk-code

### F-009-001 — system-spec-kit requires sk-code for code updates, but implement/complete load it at review time rather than authoring time [P1]

`system-spec-kit/SKILL.md` says all code creation/updates route through `sk-code` at `.opencode/skills/system-spec-kit/SKILL.md:401` and repeats that "Code updates route through `sk-code`" at `.opencode/skills/system-spec-kit/SKILL.md:440`. The concrete `/speckit:implement` auto workflow, however, only names `sk-code` inside the review agent's standards overlay: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:207-216`. The actual development step at `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:402-423` says to parse tasks, set up, follow TDD, do core development, integrate, and update task checklists, but does not include a sk-code detection/load gate before writing code.

The same pattern appears in `/speckit:complete`: `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:311-318` and `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:320-327` only mention the `sk-code` overlay for pre-commit review. That makes sk-code standards enforceable after development, but not reliably loaded before the authoring decisions are made.

Concrete target: add a Step 5/6 pre-development resource gate to implement/complete workflows: detect target files, load `sk-code` OpenCode resources, record the selected language/resources in the checkpoint, then proceed to authoring. Review-time overlay should remain, but it is not a substitute for authoring-time loading.

### sk-code

### F-009-002 — sk-code has spec-folder invariants, but no first-class SPEC_FOLDER or IMPLEMENTATION OpenCode load path [P1]

The sk-code top-level router recognizes implementation as an intent at `.opencode/skills/sk-code/SKILL.md:121`, and OpenCode verification explicitly includes "spec validation for changed spec folders" at `.opencode/skills/sk-code/SKILL.md:127-133`. The detailed OpenCode resource map in `.opencode/skills/sk-code/references/router/resource_loading.md:113-140` only maps `CODE_QUALITY`, `VERIFICATION`, `HOOKS`, `CONFIG`, and language standards. It has no `IMPLEMENTATION` or `SPEC_FOLDER` row.

The spec-folder safety rules do exist, but they are buried inside the broad shared reference at `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:418-426`: canonicalize paths, validate containment, enforce `NNN-name`, reject targets outside approved roots, and avoid rollback instructions without checkpoints. Because this is not a named resource recipe, a workflow can "load OpenCode shared resources" and still miss the exact spec-folder write checklist needed for system-spec-kit scripts.

Concrete target: promote these rules into a dedicated OpenCode resource such as `references/opencode/shared/spec_folder_writes.md` and add an OPENCODE `SPEC_FOLDER` or `IMPLEMENTATION` resource-map row that system-spec-kit workflows can name directly.

### mcp-coco-index / sk-code

### F-009-003 — CocoIndex ingests sk-code resources locally, but excludes spec packet learnings by design [P2]

The mcp-coco-index indexer includes Markdown and text by default at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:17-48`; the active project settings keep `**/*.md` included at `.cocoindex_code/settings.yml:20-50`. Direct SQLite auxiliary-table inspection found 2,028 chunks across 126 distinct `.opencode/skills/sk-code/` files, including OpenCode references such as `.opencode/skills/sk-code/references/opencode/shared/code_organization.md` with 37 chunks, TypeScript quality standards with 32 chunks, and `shared/universal_patterns.md` with 24 chunks. OpenCode checklist assets are also present: `config_checklist.md`, `javascript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `typescript_checklist.md`, and `universal_checklist.md`.

The same active settings exclude `.opencode/specs/**` at `.cocoindex_code/settings.yml:14`, plus other runtime spec roots at `.cocoindex_code/settings.yml:15-18`. That likely protects search quality from packet noise, but it also means spec-packet implementation summaries and deep-research outputs cannot become semantic-search evidence unless findings are promoted into skill docs/assets or another indexed canonical location.

Concrete target: treat `.opencode/skills/sk-code/` as the canonical retrieval destination for any durable OpenCode authoring/spec-folder guidance discovered in this packet. Do not rely on `.opencode/specs/**` being indexed.

### F-009-004 — The missing cross-surface smoke test is a rank test, not another path-existence test [P2]

system-spec-kit has `check-smart-router.sh`, but it validates top-level `.opencode/skills/*/SKILL.md` markdown resource paths and bloat only (`.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:19-27`, `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:67-72`). sk-code's `verify_alignment_drift.py` only scans executable/config extensions (`.ts`, `.tsx`, `.mts`, `.js`, `.mjs`, `.cjs`, `.py`, `.sh`, `.json`, `.jsonc`) at `.opencode/skills/sk-code/scripts/verify_alignment_drift.py:31-42`. Neither gate verifies that OpenCode router resource-map docs are present, nor that CocoIndex ranks the canonical OpenCode authoring/spec resources ahead of manual-testing or historical packet material.

The iteration-10 remediation list should therefore include retrieval smoke queries, not only filesystem checks. Candidate queries: `OpenCode spec folder path invariants`, `OpenCode skill authoring checklist`, `system-spec-kit implementation sk-code resources`, and `OpenCode command authoring verification`. Expected top results should be the dedicated sk-code OpenCode authoring/spec resources once created, not `.opencode/specs/**` packets or generic manual testing playbook scenarios.

## Questions Answered

- Q4: Partially answered. Local ingestion of `.opencode/skills/sk-code/` resources is real, but live semantic ranking could not be smoke-tested because `ccc` could not start its daemon in this sandbox.
- Q5: Partially answered. The missing OpenCode resource is now sharper: a first-class spec-folder-write/implementation recipe, not only language checklists.
- Q7: Partially answered. `/speckit:implement` and `/speckit:complete` name sk-code for review evidence, but current YAML evidence does not show an authoring-time sk-code load before Step 6 development.

## Questions Remaining

- Q1: Still open for final synthesis prioritization across all system-spec-kit drift findings.
- Q2: Still open for final synthesis prioritization across validator and graph-metadata coverage gaps.
- Q3: Mostly answered by earlier iterations; iteration 10 should consolidate the CLI/MCP parity P1 list.
- Q4: Ranking remains open until `ccc search` can run in an environment where the daemon can write to its runtime directory.
- Q6: Answered by iteration 8, but should be summarized in final remediation sequencing.

## Next Focus (for iteration 10)

Prepare final synthesis. Gather the P0/P1 findings across iterations 1-9, collapse duplicates, and propose remediation phases in this order: authoring-time sk-code load in system-spec-kit workflows, sk-code OpenCode spec-folder/authoring resource manifest, mcp-coco-index maintenance/refresh parity, then validator/metadata coverage hardening.
