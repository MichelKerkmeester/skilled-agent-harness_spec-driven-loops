---
title: "Tasks: Hub Doc Conformance Fixes [131-hub-doc-conformance-fixes]"
description: "Task Format: T### [P?] Description (file path) -- all 73 distinct findings (67 P0 / 4 P1 / 2 P2) from the 130-hub-doc-conformance-review registry, grouped into 4 collision-free work-streams."
trigger_phrases:
  - "tasks"
  - "hub doc conformance fixes"
  - "work-stream tasks"
  - "finding remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-hub-doc-conformance-fixes"
    last_updated_at: "2026-07-10T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Enumerated all 73 findings as checkable tasks by work-stream"
    next_safe_action: "Dispatch one fix agent per work-stream against this file"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "131-hub-doc-conformance-fixes-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Hub Doc Conformance Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (marks the first task of a work-stream; the whole stream runs in parallel with the other three) |
| `[B]` | Blocked (verify-first probe was unreachable; see `plan.md` section 2, step 4) |

**Task Format**: `T### [P?] <finding-id(s)> -- <title> (<file(s)>): <fix summary>`

Every task below applies the verify-first protocol (`plan.md` section 2) before editing, and respects the doc-layer/routing-layer boundary (`plan.md` section 4): prose sections of `SKILL.md` are in scope, routing blocks/`INTENT_SIGNALS`/`RESOURCE_MAP`/`mode-registry.json` are not. Finding IDs and titles are pulled directly from `130-hub-doc-conformance-review/review/iterations/iteration-00{1..9}.md` and `iteration-010.md`, cross-checked against `deep-review-findings-registry.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the 73-finding deduped set (67 P0 / 4 P1 / 2 P2) against `deep-review-findings-registry.json` and all 10 iteration narratives; reconcile against the dashboard's raw 102/5/4 self-reported sum (see `plan.md` section 1).
- [ ] T002 Capture the pre-fix baseline: run `validate_document.py` (correct `--type`) + `extract_structure.py` DQI on every file named in Phase 2 below, so post-fix regressions show as deltas.
- [ ] T003 Confirm the doc-layer/routing-layer boundary on every target `SKILL.md` (`cli-external`, `cli-opencode`, `cli-claude-code`, `mcp-tooling`, `mcp-click-up`, `mcp-figma`, `mcp-chrome-devtools`): grep for `INTENT_SIGNALS`/`RESOURCE_MAP`/routing-block markers and list them explicitly out of scope before any work-stream starts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS-A: mcp-click-up (28 P0, 3 solely-owned P1 + 1 P1 shared with WS-C, ~120-140 files)

- [ ] T004 [P] [P0] R1-P0-007 -- Stale Code Mode invocation shape (`mcp-click-up/SKILL.md:279`): replace the array `call_tool_chain([...])` example with the verified `{ code: ... }` form and a discovered `clickup.clickup_clickup_*` callable, matching README lines 79-95.
- [ ] T005 [P0] R1-P0-001 + R1-P1-001 (ClickUp half) -- clickup-cli README fails the README schema, DQI 42 (`mcp-click-up/mcp-servers/clickup-cli/README.md`): rebuild from `sk-doc/create-readme/assets/readme_template.md` with frontmatter, AT A GLANCE, OVERVIEW, install/verification content.
- [ ] T006 [P0] R1-P0-002 + R1-P1-001 (ClickUp half) -- clickup-mcp README fails the README schema, DQI 40 (`mcp-click-up/mcp-servers/clickup-mcp/README.md`): rebuild with full template sections while preserving the remote-server/no-vendoring truth.
- [ ] T007 [P0] R2-P0-001 -- MCP reference routes readers to nonexistent tools (`mcp-click-up/references/mcp_tools.md:23,58,85,109,118,212,231,250,307`): replace Sections 4-10 and 12 with the verified tool inventory and real `clickup.clickup_clickup_*` names.
- [ ] T008 [P0] R9-P0-002 -- Seven cards advertise tools absent from the verified inventory (`mcp-click-up/feature_catalog/12--mcp-medium-priority/{get-document,update-document,manage-goals}.md`, `.../13--mcp-low-priority/{audit-logs,create-checklist,create-checklist-item,delete-checklist-item}.md`): remove or relabel `SKIP` with the verified capability blocker.
- [ ] T009 [P0] DR5-P0-003 -- ClickUp source anchors one directory too shallow, 11 files (`mcp-click-up/manual_testing_playbook/{01--cupt-lifecycle,02--task-operations,03--time-and-notes}/*.md`): change `../feature_catalog/...` and `../references/...` to `../../...`.
- [ ] T010 [P0] DR5-P0-004 -- ClickUp execution matrices truncate canonical prompts, same 11 files as T009: replace every truncated cell with the complete SCENARIO CONTRACT value and full exact command sequence.
- [ ] T011 [P0] R6-P0-001 -- All 28 reviewed ClickUp per-feature scenarios have dead relative source anchors (`mcp-click-up/manual_testing_playbook/{04--mcp-advanced,05--recovery-and-failure,06--cupt-advanced-listing,07--cupt-offline-and-cache,08--mcp-task-crud,09--mcp-documents-goals,10--mcp-bulk-and-structure}/*.md`): root anchors become `../manual_testing_playbook.md`; catalog/reference anchors become `../../feature_catalog/...` and `../../references/...`.
- [ ] T012 [P0] R6-P0-002 -- MCP scenarios use the retired Code Mode callable prefix (same 18 MCP files as T011's MCP subset): query `tool_info()` per operation, replace every two-part invocation with the exact returned callable name.
- [ ] T013 [P0] R6-P0-003 -- Six scenarios require absent official MCP tools (`bulk-create.md`, both goal scenarios, `get-document.md`, `checklist-lifecycle.md`, `create-webhook.md`): mark `SKIP` with the verified capability blocker, do not invent substitutes.
- [ ] T014 [P0] R6-P0-004 -- MCP-M015 and MCP-M019 each have duplicate canonical files (`04--mcp-advanced/create-document.md` vs `09--mcp-documents-goals/create-document.md`; `manage-goals.md` pair): retain one canonical file per ID under `09--mcp-documents-goals/`, remove the `04--mcp-advanced/` duplicates.
- [ ] T015 [P1] R6-P1-001 -- All 28 ClickUp execution tables are 7-column, not the required 9-field contract (same 28 files as T011): regenerate with the full 9 columns, copying complete untruncated values.
- [ ] T016 [P0] R7-P0-002 -- Credentials described as encrypted but stored as plaintext YAML (`mcp-click-up/feature_catalog/01--cupt-authentication/{direct-token,interactive-auth}.md:25-27`): state plaintext YAML protected by 0600 permissions; never print an actual token value.
- [ ] T017 [P0] R7-P0-003 -- `auth-status`/`show-config` promise fields the commands do not print (`.../01--cupt-authentication/{auth-status,show-config}.md:19-27`): match exactly `cupt status` and `cupt config --show` output.
- [ ] T018 [P0] R7-P0-004 -- `clear-cache` documents a nonexistent cache directory (`.../01--cupt-authentication/clear-cache.md:19-27`): list the actual `~/.cupt/task_cache/` surfaces.
- [ ] T019 [P0] R7-P0-005 -- Date-filter windows differ from implementation (`.../02--cupt-task-listing/{filter-week,filter-today,filter-overdue}.md:19-27`): document the actual local-time rolling windows.
- [ ] T020 [P0] R7-P0-006 -- Listing entries hide bounded pagination (`.../02--cupt-task-listing/{all-tasks,filter-team,cap-results}.md:19-27`): describe `--all`/`--team` as bounded with page caps; `-n` as a post-fetch slice.
- [ ] T021 [P0] R7-P0-007 -- `--mine` does not override `--all` (`.../02--cupt-task-listing/mine-only.md:19-27`): remove the `--all --mine` recipe.
- [ ] T022 [P0] R7-P0-008 -- Tag filtering is not server-side AND logic (`.../02--cupt-task-listing/filter-tag.md:19-27`, `stacked-filters.md`): state OR prefilter server-side, AND enforced client-side.
- [ ] T023 [P0] R8-P0-001 -- Auto-note advertises an unimplemented Ollama backend (`.../04--cupt-task-completion/auto-note.md:21`): replace with "Apple Intelligence via `apple-fm-sdk`," move Ollama to a future/not-supported note.
- [ ] T024 [P0] R8-P0-002 -- Ambiguous attachment behavior is reversed (`.../08--cupt-attachments/download-file.md:27`): state ambiguous partial names fail, instruct 1-based index or unique substring.
- [ ] T025 [P0] R8-P0-003 -- Attachment list promises absent metadata (`.../08--cupt-attachments/list-attachments.md:21`): limit documented output to index, size, filename.
- [ ] T026 [P0] R8-P0-004 -- Timer status output fields are wrong (`.../06--cupt-time-tracking/timer-status.md:21`): document current `Task ID` and `Started` fields only.
- [ ] T027 [P0] R8-P0-005 -- Task Summary describes a different aggregation (`.../09--cupt-workspace/task-summary.md:21`): rewrite around the daily-view sections, document `--all` as the workspace switch.
- [ ] T028 [P0] R8-P0-006 -- `--json` is not a global all-read flag (`.../10--cupt-global-flags/json-flag.md:2`): reclassify as selective, enumerate the supported commands.
- [ ] T029 [P0] R8-P0-007 -- Prefetch scope is overstated (`.../09--cupt-workspace/prefetch.md:21`): replace "all tasks" with "tasks assigned to the configured user," document `--limit`.
- [ ] T030 [P0] R8-P0-008 -- Task creation tools absent from the live Code Mode registry (`.../11--mcp-high-priority/{create-task,create-bulk-tasks}.md:19`): update to the exact discovered callable names/schemas, or mark unavailable until registration is live.
- [ ] T031 [P0] [P1] R9-P0-001 + R9-P1-001 -- Every scoped card contradicts the checked-in MCP deployment/auth config, and all 30 cards omit required asset frontmatter fields + intro (`.../11--mcp-high-priority/*.md`, `.../12--mcp-medium-priority/*.md` line 37 pattern + lines 1-17): replace the implementation row with the checked-in `clickup_official`/`@clickup/mcp-server`/API-key contract; add `importance_tier`/`contextType` and a post-H1 intro to every card.
- [ ] T032 [P0] [P1] R10-P0-001 + R10-P1-001 -- ClickUp catalog documents a transport/namespace that is not configured, and `use-template.md` misses the DQI floor (`mcp-click-up/feature_catalog/FEATURE_CATALOG.md:18-31`, 14 `13--mcp-low-priority/*.md` cards, `use-template.md` DQI 73): regenerate the MCP portion from the currently registered `clickup_official` inventory; add source-backed content to `use-template.md` to clear DQI 75.

### WS-B: cli-opencode + cli-claude-code (20 P0, 1 P2, ~35-40 files)

- [ ] T033 [P] [P0] R1-P0-004 -- cli-opencode agent reference teaches routes its own contract forbids (`cli-external/cli-opencode/references/agent_delegation.md:17,80-92,222-231,309-360`): make the current `SKILL.md` contract canonical -- omit `--agent` for default dispatch, use `--agent orchestrate` for generic subagents, `/deep:*` commands for deep agents.
- [ ] T034 [P0] R1-P0-005 -- Wrong Claude agent directory + stale roster (`cli-external/cli-claude-code/README.md:109`, `SKILL.md:277-285`, `references/agent_delegation.md:94-121`): resolve to `.claude/agents/`, regenerate the roster from files on disk, remove nonexistent slugs.
- [ ] T035 [P0] R1-P0-006 -- Stale Claude/OpenCode capability matrix (`cli-external/cli-claude-code/references/claude_tools.md:45,72,182,234-272`): remove visible-chain-of-thought claims, replace with current `opencode run` flags/model discovery.
- [ ] T036 [P0] R2-P0-004 -- Claude templates dispatch agents that do not exist (`cli-claude-code/assets/prompt_templates.md:294,303,442-443`, `manual_testing_playbook/04--agent-routing/handover-agent-context-transfer.md:27-50`): route to the real `markdown` agent, replace `handover` dispatch with the canonical continuity workflow.
- [ ] T037 [P0] R2-P0-005 -- JSON playbooks query stale `.cost`/`.duration` envelope fields (`cli-claude-code/manual_testing_playbook/{01--cli-invocation/default-model-selection-sonnet,03--reasoning-and-models/haiku-fast-classification,03--reasoning-and-models/opus-extended-thinking,03--reasoning-and-models/sonnet-balanced-default}.md:49`): update every jq query to `total_cost_usd`/`duration_ms`.
- [ ] T038 [P0] R3-P0-001 -- Twenty OpenCode scenarios use the forbidden top-level `general` agent route (`cli-opencode/manual_testing_playbook/01--cli-invocation/base-non-interactive-invocation.md:15` + CO-002..006,011-013,018-020,022,025-029,035-036, reconfirmed and expanded in iteration 4): remove `--agent general` from ordinary invocations, rewrite CO-013 to validate the unflagged default path.
- [ ] T039 [P0] R3-P0-002 -- Deep-loop scenarios bypass the command-owned state machine (`cli-opencode/manual_testing_playbook/04--agent-routing/deep-research-agent-iterations.md:27`, `deep-review-agent-audit.md`): exercise the owning `/deep:research`/`/deep:review` command workflow against a pre-bound packet, do not synthesize `/tmp` state.
- [ ] T040 [P0] R3-P0-003 -- Claude scenarios invoke absent `research`/`speckit` agents (`cli-claude-code/manual_testing_playbook/04--agent-routing/{research-agent-investigation,speckit-agent-spec-folder}.md:27`): replace with extant agents/workflows and update the roster count, or add and register the documented agents.
- [ ] T041 [P0] R3-P0-004 -- Eight source tables cite a deleted uppercase root filename (`cli-claude-code/manual_testing_playbook/04--agent-routing/{orchestrate-agent-multi-step,research-agent-investigation,speckit-agent-spec-folder}.md`, `08--cost-and-background/{max-budget-usd-cap,background-execution}.md`, `cli-opencode/manual_testing_playbook/04--agent-routing/{deep-research-agent-iterations,deep-review-agent-audit}.md` + 1 more): replace `MANUAL_TESTING_PLAYBOOK.md` with lowercase `manual_testing_playbook.md`. Bundle with T040/T039/T045/T048/T049 where the file is shared.
- [ ] T042 [P0] R3-P0-005 -- CC-027 waits for a background PID from a different shell (`cli-claude-code/manual_testing_playbook/08--cost-and-background/background-execution.md:50`): launch, probe, `wait`, exit-capture, and assertion in one shell invocation.
- [ ] T043 [P0] R3-P0-007 -- CO-012 uses contradictory DeepSeek variant ceilings (`cli-opencode/manual_testing_playbook/03--multi-provider/variant-levels-comparison.md:27,49,53-60`): resolve the live provider-supported variant set, use two accepted endpoints, remove the duplicate row.
- [ ] T044 [P0] R3-P0-008 -- CO-017's no-write oracle contradicts the current AI Council contract (`cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md:15-19,27-33`): pre-bind a spec packet, assert writes occur only under its `ai-council/**` subtree.
- [ ] T045 [P0] R3-P0-009 -- CC-024 advertises a stale top-level spec-folder path (`cli-claude-code/manual_testing_playbook/04--agent-routing/speckit-agent-spec-folder.md:27-33`): update to `.opencode/specs/[track]/[###-short-name]/`.
- [ ] T046 [P0] R3-P0-010 -- CC-026 can pass when cost metadata is missing (`cli-claude-code/manual_testing_playbook/08--cost-and-background/max-budget-usd-cap.md:27-33,50`): fail unless one supported cost field exists and is numeric; fix the `2>&1 > file` redirect order.
- [ ] T047 [P0] R3-P0-011 -- CC-014 claims high-effort depth but omits the effort flag (`cli-claude-code/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy-planning.md:27-33,49-53`): add `--effort high` to the exact command, or remove effort-specific acceptance criteria.
- [ ] T048 [P0] R4-P0-001 -- Template inventory requires both 13 and 16 templates (`cli-opencode/manual_testing_playbook/07--prompt-templates/templates-inventory.md:27-33`): make every count and range 16, validate Templates 1-16.
- [ ] T049 [P0] R4-P0-002 -- Kimi scenario mandates the framework its current profile avoids, wrong profile id (`cli-opencode/manual_testing_playbook/07--prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md:29,42,50`): select `id == "kimi-k2.7-code"`, compose with COSTAR plus lean pre-planning.
- [ ] T050 [P0] R4-P0-003 -- Parallel-session test asserts a nonexistent `~/.opencode/state/<id>` contract (`cli-opencode/manual_testing_playbook/08--parallel-detached/parallel-detached-session.md:17,31-35,49,57`; `SKILL.md:334`): derive session persistence from the installed `~/.local/share/opencode/` storage/DB layout.
- [ ] T051 [P0] R4-P0-006 -- Four scenarios depend on shell variables assigned in earlier, separate shell steps (`cli-opencode/manual_testing_playbook/05--session-continuity/resume-by-session-id.md:49` + CO-019/020/026/029): keep assignment and dependent commands in one shell invocation, or persist/reload explicitly. Bundle with T050 where CO-026/`parallel-detached-session.md` is shared.
- [ ] T052 [P0] R4-P0-007 -- Three scenarios report an unrelated exit status (`cli-opencode/manual_testing_playbook/06--integration-patterns/memory-epilogue-handback.md:50` + CO-022/025/029): capture status in the dispatch shell, assert the persisted value before content checks.
- [ ] T053 [P2] R2-P2-001 -- Bypass playbook names the same sibling twice (`cli-claude-code/manual_testing_playbook/02--permission-modes/bypass-permissions-guard-rail-sandboxed.md:54`): replace one duplicate `cli-opencode` with the actual second sibling intended (`cli-claude-code` or the correct family member).

### WS-C: mcp-figma + mcp-chrome-devtools (11 P0, 1 P1 shared with WS-A, 1 P2, ~20 files)

- [ ] T054 [P] [P0] R1-P0-003 -- figma-cli README fails the README schema, DQI 42 (`mcp-figma/mcp-servers/figma-cli/README.md`): rebuild with frontmatter, AT A GLANCE, OVERVIEW, naming-trap/install/verification/requirements content.
- [ ] T055 [P1] R1-P1-001 (Figma half) -- figma-mcp README misses the DQI 75 floor, DQI 42 (`mcp-figma/mcp-servers/figma-mcp/README.md`): apply the README template's full shape while retaining concise embedded-server scope.
- [ ] T056 [P2] R1-P2-001 -- Figma README labels an existing install guide as planned (`mcp-figma/README.md:189`): remove `(planned)`, the guide exists and resolves.
- [ ] T057 [P0] R2-P0-002 -- bdg docs invent concurrent named sessions over a single-session CLI (`mcp-chrome-devtools/references/session_management.md:236-291`, `references/cdp_patterns.md:649-668`): remove the concurrent/named-session claims or document real isolated selectors proven by live help.
- [ ] T058 [P0] R2-P0-003 -- Figma `arrange` is classified as non-destructive against live CLI truth (`mcp-figma/references/tool_surface.md:102,193`, `references/figma_cli_reference.md:247`): classify DESTRUCTIVE, add to the omit-by-default set and rollback table.
- [ ] T059 [P0] DR5-P0-001 -- BDG-018 invokes a nonexistent cookie tool and wrong evaluate argument (`mcp-chrome-devtools/manual_testing_playbook/05--mcp-parallel-instances/page-context-isolation.md:50-56`): use `{ function: "..." }` for `evaluate_script`, replace cookie retrieval with a discovered tool.
- [ ] T060 [P0] DR5-P0-002 -- Screenshot scenarios assert an undocumented base64 shape (`mcp-chrome-devtools/manual_testing_playbook/05--mcp-parallel-instances/{chrome-devtools-1-navigate,dual-instance-parallel,close-and-select-page}.md`): pass a unique `filePath`, verify the written file exists/non-empty/PNG magic bytes.
- [ ] T061 [P0] DR5-P0-006 -- Destructive recovery scenarios can kill unrelated Chrome sessions (`mcp-chrome-devtools/manual_testing_playbook/06--recovery-and-failure/{dead-session,cleanup-leak}.md`): capture the exact bdg-owned PID, verify ownership, kill only that PID; remove broad `pkill`.
- [ ] T062 [P0] DR5-P0-007 -- BDG-015's timing oracle cannot prove parallel execution (`mcp-chrome-devtools/manual_testing_playbook/05--mcp-parallel-instances/dual-instance-parallel.md:66`): run repeated sequential/parallel pairs in the same wave, compare medians against a documented margin.
- [ ] T063 [P0] R7-P0-001 -- EXPORT-001 uses a command shape the installed CLI rejects (`mcp-figma/manual_testing_playbook/03--read-only/read-only-export.md:47-55`, `manual_testing_playbook.md:293-309`): use `figma-ds-cli export screenshot --output <out>` / `export node <nodeId> --output <out>` / `extract <output>`.
- [ ] T064 [P0] R10-P0-002 -- Figma optional-MCP wrong env var + tool namespace (`mcp-figma/feature_catalog/08--optional-mcp/optional-mcp-context.md:19-27`, `feature_catalog.md:187-194`): change env key to `FIGMA_API_KEY`, invocations to `figma.figma.get_figma_data`/`figma.figma.download_figma_images`.
- [ ] T065 [P0] R10-P0-003 -- Figma token card misidentifies node deletion as variable deletion, invalid create signature (`mcp-figma/feature_catalog/05--tokens-and-variables/tokens-and-variables.md:31-37`, `feature_catalog.md:143-150`): document node deletion separately, use the verified `-c`/`-t`/`-v` create signature.
- [ ] T066 [P0] R10-P0-004 -- Figma export cards publish incorrect positional output syntax (`mcp-figma/feature_catalog/07--export/export.md:25-27`, `feature_catalog.md:160-165`): replace with the authority's `-o file` forms.

### WS-D: cross-cutting root playbooks + solo test-oracle mechanics (8 distinct P0 finding IDs across 7 tasks and 7 files; T069 bundles 2 IDs sharing one file)

- [ ] T067 [P] [P0] R3-P0-006 -- Claude root playbook contradicts its own verdict vocabulary (`cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:9,107-116`): choose one canonical PASS/FAIL/SKIP enum, use it in the execution policy, scenario rules, and release gate.
- [ ] T068 [P0] DR5-P0-005 -- Chrome root playbook permits a verdict forbidden by its own execution policy (`mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md:9,57`): replace `PASS / PARTIAL / FAIL` with `PASS / FAIL / SKIP` (SKIP requires a sandbox blocker).
- [ ] T069 [P0] R4-P0-004 + R4-P0-008 -- Root claims complete coverage with two missing feature files, and its non-OpenCode runtime list includes OpenCode (`cli-opencode/manual_testing_playbook/manual_testing_playbook.md:11,41,137,157,302,551,814,840`): author the two missing feature files or reduce the declared total; remove OpenCode from the non-OpenCode conductor lists.
- [ ] T070 [P0] R6-P0-005 -- Root overstates scenario coverage as 76 when 46 scenario files exist (`mcp-click-up/manual_testing_playbook/manual_testing_playbook.md:19-41`): change the coverage table, wave plan, and release-readiness language to the actual 46-file scenario set.
- [ ] T071 [P0] R2-P0-006 -- Base invocation scenario never captures the Claude process exit code (`cli-claude-code/manual_testing_playbook/01--cli-invocation/base-non-interactive-invocation.md:48-50`): run under `set -o pipefail`, capture `${PIPESTATUS[0]}` in the same shell invocation.
- [ ] T072 [P0] R2-P0-007 -- stream-json test corrupts its own JSON channel by merging stderr (`cli-claude-code/manual_testing_playbook/01--cli-invocation/stream-json-incremental-output.md:47-49`): capture stdout to the JSONL evidence file and stderr to a separate log; parse only stdout.
- [ ] T073 [P0] R4-P0-005 -- Ablation command has invalid shell syntax, `&;` (`cli-opencode/manual_testing_playbook/08--parallel-detached/ablation-suite.md:55`): use `... & pid_a=$!; ... & pid_b=$!; wait "$pid_a"; a=$?; wait "$pid_b"; b=$?` in one shell.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T074 Re-run `130-hub-doc-conformance-review`'s scope (or an equivalent `/deep:review` dispatch) against `cli-external` + `mcp-tooling`.
- [ ] T075 Confirm 0 active P0 findings, or record an explicit, operator-approved carry-over list with rationale.
- [ ] T076 Run `validate.sh --strict` on every touched packet (`cli-external`, `mcp-tooling`, and their child skills) and report the final Errors/Warnings count per packet.
- [ ] T077 Update `graph-metadata.json`/`description.json` for every touched packet via the canonical generation flow, so the fixes are visible to `memory_search`/graph traversal.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 77 tasks marked `[x]` (or `[B]` blocked with a documented, live-probe-unreachable reason).
- [ ] No `[B]` blocked tasks remaining without an operator-reviewed disposition.
- [ ] Phase 3's re-run-deep-review gate passed or carried over with explicit approval.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Findings**: `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/deep-review-findings-registry.json` and `review/iterations/iteration-00{1..9}.md`, `iteration-010.md`
<!-- /ANCHOR:cross-refs -->
