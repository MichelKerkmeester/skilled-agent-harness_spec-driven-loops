# Iteration 10 — Final Remediation Synthesis Prep

## Focus
Prepared the final remediation synthesis by gathering P0/P1 findings across iterations 1-9, collapsing duplicates into dependency-ordered remediation phases, and re-checking the current source lines that decide cross-surface priority.

## Actions Taken
- Action 1: Read `deep-research-strategy.md` Sections 3, 6-12, with Section 11 directing final synthesis-prep and remediation phase ordering.
- Action 2: Reviewed prior iteration headings and P0/P1 findings from `research/iterations/iteration-001.md` through `iteration-009.md` to avoid re-treading.
- Action 3: Re-read system-spec-kit implement/complete workflow evidence and `system-spec-kit/SKILL.md` to verify where `sk-code` is required vs actually loaded.
- Action 4: Re-read sk-code OpenCode routing/resource maps and on-disk OpenCode assets to confirm the missing first-class authoring/spec-folder resources.
- Action 5: Re-read mcp-coco-index skill/tool docs and fork code paths to place maintenance/refresh parity after canonical sk-code resource creation, not before it.

## Findings

### system-spec-kit

### F-010-001 — Authoring-time sk-code loading is the first remediation dependency [P1]
The P1 list should start with system-spec-kit workflow loading, not validator cleanup. `system-spec-kit/SKILL.md` requires all code creation/updates to route through `sk-code` at `.opencode/skills/system-spec-kit/SKILL.md:401` and repeats that code updates route through `sk-code` at `.opencode/skills/system-spec-kit/SKILL.md:440`. The `/spec_kit:implement` auto workflow names `sk-code` only in the review agent overlay at `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:209`-`.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:216`, while the development step at `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:402`-`.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:423` proceeds through task parsing, setup, TDD, core development, integration, and checklist updates without a concrete `sk-code` resource-load gate. `/spec_kit:complete` has the same shape: pre-work checks a generic skills folder at `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:538`-`.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:549`, planning explorers use CocoIndex at `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:667`-`.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:706`, and development says "Check skills folder for coding standards" at `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:859`-`.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:889` but does not name the selected `sk-code` OpenCode resources.

Remediation Phase 1: add a pre-development gate to `/spec_kit:implement` and `/spec_kit:complete` that detects target files, loads `sk-code` with OPENCODE language/resource selection, records the selected resources in the checkpoint, then permits writing. Keep the review overlay as a backstop; it is not a substitute for authoring-time guidance.

### F-010-002 — Validator and graph-metadata coverage remain P1, but sequence after integration fixes [P1]
Iteration 2 found two validator P1s that should remain in final synthesis: default Node validation passes malformed graph metadata by checking only file existence, and it omits registry-owned phase rules. The concrete evidence is in `iteration-002.md`: the Node graph check is summarized as `fs.existsSync(path.join(folder, 'graph-metadata.json')) ? 'pass' : 'warn'` at `iteration-002.md:17`-`iteration-002.md:20`, while the shell rule parses JSON fields but is bypassed on the default path. The second P1 is that `PHASE_LINKS` and `PHASE_PARENT_CONTENT` exist in the shell registry but the Node orchestrator emits a fixed subset and cannot produce those rules, documented at `iteration-002.md:22`-`iteration-002.md:25`.

Remediation Phase 4: after authoring/routing resources are fixed, port graph metadata shape checks and phase-parent registry rules into the default Node orchestrator, or make `validate.sh` run both paths coherently. Then add default-path tests for malformed `graph-metadata.json`, stale `derived.last_active_child_id`, and missing phase links.

### mcp-coco-index

### F-010-003 — CocoIndex maintenance/refresh parity should follow canonical resource creation [P1]
The dedicated `mcp-coco-index` skill is clear that the MCP server exposes only `search`: `.opencode/skills/mcp-coco-index/SKILL.md:211`-`.opencode/skills/mcp-coco-index/SKILL.md:220` says CLI handles `ccc status`, `ccc index`, `ccc search`, and `ccc reset`, while MCP exposes `search` only and advises `refresh_index=true` on the first query. Its tool reference repeats that `status`, `index`, and `reset` are CLI-only at `.opencode/skills/mcp-coco-index/references/tool_reference.md:18`-`.opencode/skills/mcp-coco-index/references/tool_reference.md:23`.

That conflicts with the system-spec-kit surface from iteration 3: `ccc_status`, `ccc_reindex`, and `ccc_feedback` are documented/registered there but not dispatched, producing an `Unknown tool` path (`iteration-003.md:17`-`iteration-003.md:22`). The mcp-coco-index fork also has refresh/wait behavior at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:454`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:520`, while CLI output includes fork telemetry such as `dedupedAliases`, `uniqueResultCount`, `raw_score`, `path_class`, and `rankingSignals` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:136`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:161`.

Remediation Phase 3: decide one owner for CocoIndex maintenance. Either implement the system-spec-kit `ccc_*` dispatcher against the dedicated CocoIndex surface, or remove those exposed descriptors and keep maintenance CLI-only. Only after Phase 2 creates canonical sk-code OpenCode authoring/spec resources should retrieval smoke tests assert that those files outrank playbook/spec noise.

### sk-code

### F-010-004 — sk-code needs a canonical OpenCode authoring/spec-folder resource manifest [P1]
The strongest sk-code P1s from iterations 6-9 collapse into one remediation target. `sk-code/SKILL.md` says OPENCODE covers `.opencode/` skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell at `.opencode/skills/sk-code/SKILL.md:20`-`.opencode/skills/sk-code/SKILL.md:23`. It recognizes implementation and many other intents at `.opencode/skills/sk-code/SKILL.md:119`-`.opencode/skills/sk-code/SKILL.md:125`, and its OpenCode verification row includes spec validation for changed spec folders at `.opencode/skills/sk-code/SKILL.md:127`-`.opencode/skills/sk-code/SKILL.md:133`.

The actual OpenCode resource map is narrower. `references/router/resource_loading.md` always loads only shared universal/code-organization resources for OPENCODE, then maps `CODE_QUALITY`, `VERIFICATION`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS` at `.opencode/skills/sk-code/references/router/resource_loading.md:113`-`.opencode/skills/sk-code/references/router/resource_loading.md:140`. There is no `IMPLEMENTATION`, `TESTING`, `DEBUGGING`, authoring, command, agent, skill, or `SPEC_FOLDER` row. On disk, `references/opencode/` contains language/shared/config references only, while `assets/opencode/` contains only six checklists: `config_checklist.md`, `javascript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `typescript_checklist.md`, and `universal_checklist.md`. The spec-folder invariant exists only as a broad shared section at `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:418`-`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:426`, and the universal checklist only covers approved roots and archive/restore/create target checks at `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:89`-`.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:96`.

Remediation Phase 2: add a machine-readable OpenCode resource manifest plus first-class resources for `spec_folder_writes`, `skill_authoring`, `agent_authoring`, and `command_authoring`. Then update the OpenCode resource map so system-spec-kit workflows can name exact files instead of relying on "check skills folder" prose.

## Questions Answered
- Q1: Resolved for synthesis. The highest system-spec-kit drift is split between workflow/code-routing drift and validator/MCP drift; remediation should start with authoring-time `sk-code` loading because it affects every subsequent code write.
- Q2: Resolved for synthesis. Validator/metadata coverage remains P1 through default Node graph-metadata and phase-rule omissions, but it is Phase 4 after the cross-surface routing resources are made concrete.
- Q3: Resolved for synthesis. Dedicated mcp-coco-index docs say MCP is `search` only, while system-spec-kit exposes/documented `ccc_*` maintenance descriptors without dispatch; ownership must be clarified.
- Q4: Partially resolved. Local ingestion of `.opencode/skills/sk-code/` resources was shown in iteration 9, but rank smoke tests should wait until canonical OpenCode authoring/spec resources exist.
- Q5: Resolved for synthesis. Missing OpenCode resources are first-class authoring/spec-folder recipes and a manifest, not just another language checklist.
- Q6: Resolved. The old `STACK_FOLDERS` contract is not live; the active map is prose/table-based and needs a machine-readable manifest.
- Q7: Resolved enough for remediation. Existing implement/complete evidence loads `sk-code` at review time or generically, not as a concrete authoring-time gate.

## Questions Remaining
- Q4: Live ranking remains unverified because iteration 9 could not start the `ccc` daemon in this sandbox. After Phase 2, run rank smoke queries against the canonical resource files.

## Next Focus (for iteration 11)
No iteration 11 is needed unless the research run is manually extended. Move to final synthesis: write the remediation plan in four phases, preserve zero P0 status, carry forward the four P1 clusters above, and require rank smoke tests only after canonical sk-code OpenCode authoring/spec resources exist.
