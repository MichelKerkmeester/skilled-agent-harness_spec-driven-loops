---
title: "Feature Specification: Phase 4: agents-commands-config"
description: "Gives both OpenCode versions one set of agents, commands and config, with a browser deny key on each agent, runtime-neutral delegation wording, the non-command files moved out of the command folder and a check on the shape of opencode.json."
trigger_phrases:
  - "agents commands config"
  - "phase 4 agents commands config"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: agents-commands-config

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/143-opencode-dual-compat-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 11 |
| **Predecessor** | 003-hard-plugins |
| **Successor** | 005-version-aware-guards |
| **Handoff Criteria** | The mirror sync checker exits 0 with 11 agents checked. No moved file is registered on either version. The contract compiler tests pass from the new paths. `opencode.json` loads on v1 1.19.3, and the config shape test passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The agent files under `.skilled/agents/` and their mirror copies, the non-command markdown files under `.skilled/commands/`, the consumers of those files, and one config shape test under `.opencode/bin/tests/`. The plugins (phases 2 and 3), the dispatch guards (phase 5) and the cli-opencode code (phase 6) are outside the boundary.

**Dependencies**:
- Phase 3 closed. This is an ordering rule, not a technical one, because phase 4 touches no plugin file.
- The orchestrator's decisions in task T003. They cover the destination of the moved files, the `opencode.json` conflict, the agent with no `chrome_devtools` key and the mirror folders that the checker does not read.
- The contract compiler tests in `.skilled/skills/system-deep-loop/runtime/tests/unit/`, which run from the new paths.

**Deliverables**:
- A `browser: deny` key beside `chrome_devtools: deny` in the frontmatter of each agent that carries the second key.
- Runtime-neutral delegation wording in the agent bodies that name the `Task` tool.
- A Devin entry, and UNKNOWN entries where no evidence exists, in the runtime table of `orchestrate.md`.
- The 12 non-command markdown files moved out of `.skilled/commands/`, with every consumer updated.
- The mirror copies synced for every changed agent.
- `.opencode/bin/tests/opencode-config-shape.test.cjs`, which checks that `opencode.json` carries no v2-only key.

**Executor (D6, with the brief's split)**: DeepSeek V4.1 Flash max through cli-devin writes the agent body wording, with the markdown persona and the sk-doc agent mode. GPT-6 Luna max fast through cli-codex makes the file moves, the consumer edits and the config test. The orchestrator runs the mirror sync, the contract tests, the command listings and the config load.

**Frozen decisions that bind this phase**: The parent goal carries decisions D1 to D8. This table records what each one means for phase 4.

| ID | Effect on this phase |
|----|----------------------|
| D1 | No agent body changes shape. The default exports of the plugins are not touched in this phase. |
| D2 | `opencode.json` keeps the v1 shape. The file uses `mcp.code_mode`, while D2 names `mcp.servers.<name>` as the v1 shape. No edit to `opencode.json` happens until the orchestrator settles that conflict (see Open Questions). |
| D3 | No child dispatch runs in this phase. |
| D4 | No step stops, starts or restarts the v2 background service. |
| D5 | The pins from phase 2 stay as they are. |
| D6 | Agent wording goes to DeepSeek through cli-devin. File moves and consumer edits go to Luna through cli-codex. The orchestrator reruns every check. |
| D7 | Agent bodies follow the sk-doc agent mode. The new config test follows the sk-code OPENCODE surface. |
| D8 | No public compatibility claim is written in this phase. |
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The agents and commands carry wording and file layout that only one host understands. Research's condensed mechanical ledger lists these items: the `browser: deny` key, the `Task` naming, the agent extras, the non-command markdown files and the runtime-specific command flags (`research/research.md`, lines 228 to 233). Two facts make this a live problem. The `.opencode/commands` folder is a symlink to `.skilled/commands`, so any markdown file under that folder is read as a command candidate. And the eleven agents name the `Task` tool, while the runtime table at `.skilled/agents/orchestrate.md` line 35 shows that each runtime names its delegation tool differently (`task` in OpenCode, `Agent` in Claude Code, `spawn_agent` in Codex and `subagent` in Pi).

### Purpose
Both versions read one set of agents, commands and config, and each version reads each file with the same intent. The mirror copies stay in sync, and no non-command file is registered as a command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `browser: deny` key beside `chrome_devtools: deny` in the frontmatter of the ten agents that carry the second key.
- Runtime-neutral wording in the agent bodies that name the `Task` tool. The eleven agents under `.skilled/agents/` all name it. The wording changes, and the behaviour and the permissions do not.
- The runtime table at `.skilled/agents/orchestrate.md` line 35. It gains a Devin entry from the cli-devin references, and UNKNOWN entries for the runtimes that have no evidence.
- The mirror copies of each changed agent, synced with the repo's own sync command.
- The move of the 12 non-command markdown files, with every consumer listed below pointed at the new paths.
- `.opencode/bin/tests/opencode-config-shape.test.cjs`, with a positive case and a negative case.

### Out of Scope
- Any change to an agent's permissions or behaviour beyond the `browser` key and the wording.
- Any change to `opencode.json` before the orchestrator settles the D2 conflict. The phase adds the shape check either way.
- The `browser` key for `orchestrate.md`, which has no `chrome_devtools` key to sit beside. Adding one changes the permissions, so the default is to leave the file as it is (see Open Questions).
- The benchmark reports under `benchmark/reports/`. They are historical records, so the phase does not rewrite them.
- The cli-opencode code. Phase 6 owns it.
- Doc prose beyond the moved paths. Phase 10 owns the doc sweep.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/debug.md`, `context.md`, `design.md`, `markdown.md`, `ai-council.md`, `review.md`, `deep-research.md`, `code.md`, `deep-review.md`, `prompt-improver.md` | Modify | Add `browser: deny` beside `chrome_devtools: deny` in the frontmatter (10 files). |
| `.skilled/agents/*.md` (11 agents) | Modify | Make the wording that names the `Task` tool runtime-neutral. The phase changes no permission and no behaviour. |
| `.skilled/agents/orchestrate.md` | Modify | Extend the runtime table at line 35 with a Devin entry (`run_subagent`) and UNKNOWN entries for Cursor and Hermes. |
| `.claude/agents/*.md`, `.codex/agents/*.toml`, `.pi/agents/*` | Modify | The mirror copies of each changed agent, synced by the repo's sync command (task T009). |
| `.cursor/agents/*.md`, `.devin/agents/*` | Not edited | These are symlinks to `.claude/agents/`, so they follow the `.claude` copies. T001 verifies the Devin folder. |
| The 12 non-command markdown files under `.skilled/commands/` | Move | Six READMEs, three `deep/assets/legacy/*.body.md` files and three `deep/assets/compiled/*.contract.md` files. The destination is the orchestrator's decision (proposal: `.skilled/command-support/`, with the subfolders kept). |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`, `render-command-contract.cjs`, `check-contract-drift.cjs` | Modify | Point at the new paths. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`, `check-contract-drift.vitest.ts`, `render-command-contract.vitest.ts` | Modify | Point at the new paths. The render test is named in the brief, so T011 checks it even if no path matches. |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts` | Modify | Point at the new paths. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md`, `runtime/scripts/README.md`, `shared/progress/README.md` | Modify | Point at the new paths. |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | Modify | Point at the new paths. |
| `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/command-authoring.md` | Modify | Point at the new paths. |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Point at the new paths. |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Point at the new paths. |
| `.codex/SYNC.md` | Modify | Point at the new paths. |
| `.opencode/bin/tests/opencode-config-shape.test.cjs` | Create | Asserts that `opencode.json` carries no `permissions`, `plugins` or `disabled` key, and that the singular `permission` key remains. A negative case adds a v2-only key to a copy and expects a failure. |
| `opencode.json` | Not edited unless D2 is settled | The file uses `mcp.code_mode` at lines 10 and 11, and the singular `permission` key at line 3. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .opencode/bin/check-agent-mirror-sync.cjs` exits 0 and reports 11 agents checked. |
| REQ-002 | Each agent that carries `chrome_devtools: deny` also carries `browser: deny`, and no other frontmatter permission changes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Agent bodies name the delegation tool without a runtime-only name as the universal name. Each remaining `Task` mention is a prohibition or a named example. |
| REQ-004 | The runtime table in `orchestrate.md` lists Devin's `run_subagent`, and it lists UNKNOWN for each runtime with no evidence. |
| REQ-005 | None of the 12 moved files remains under `.skilled/commands/`. |
| REQ-006 | Neither the v1 command listing nor `opencode2 api GET /api/command` registers any moved file. |
| REQ-007 | The contract compiler and its tests pass from the new paths, with the same pass count as the baseline. |
| REQ-008 | `opencode.json` loads on v1 1.19.3 without error. |
| REQ-009 | The config shape test passes, and its negative case fails as intended. |
| REQ-010 | No consumer still points at an old path, except the benchmark reports recorded as exceptions. |
| REQ-011 | `git status --porcelain` changes stay inside the file list in section 3. |
| REQ-012 | The DeepSeek review finds no open P0 or P1 item against `sk-doc` agent mode and `sk-code/sk-code-opencode`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The mirror sync checker exits 0 with 11 agents checked, and the ten `browser: deny` keys are present.
- **SC-002**: The moved files are invisible to both command listings, and the contract compiler tests pass from the new paths.
- **SC-003**: `opencode.json` loads on v1, and the config shape test guards it against v2-only keys.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The orchestrator's decisions in T003 | The destination, the D2 conflict and the `orchestrate.md` key change the files touched. | T003 records them. The moves (T010) and the config work (T012) wait for it. |
| Dependency | The contract compiler tests in `system-deep-loop/runtime` | They break when a path changes, and they show whether the move is safe. | T001 records the baseline, and T015 compares it. |
| Dependency | The repo's mirror sync command | The mirror copies cannot change without it. | T009 finds the command in `.opencode/bin/` or `.skilled/bin/`, and records it before use. |
| Risk | The D2 conflict: the repo uses `mcp.code_mode`, and D2 names `mcp.servers.<name>` as the v1 shape | Editing the file to match D2 may break the MCP launcher on v1. | No edit until the orchestrator settles the conflict. T017 checks that `opencode.json` loads on v1 as it is. |
| Risk | A moved file is still read as a command on one host | The command listing shows a non-command file. | T002 records the baseline listing, and T016 compares the listing after the move. |
| Risk | `orchestrate.md` has no `chrome_devtools` key | Adding `browser: deny` alone would change its permissions. | The default leaves the file's permissions as they are. The orchestrator decides in T003. |
| Risk | Devin's tool name is taken from the cli-devin references, while the research does not name it | The runtime table could show a name that Devin does not use. | T005 cites the reference line, and the table marks the entry as taken from that reference. |
| Risk | The benchmark reports cite old paths | A consumer check reports stale paths that are only history. | They are recorded as exceptions in the T019 grep, and the phase does not rewrite them. |
| Risk | Wording changes drift into behaviour changes | An agent behaves differently after a wording edit. | T020 shows the frontmatter diff. Only the `browser: deny` lines may change a permission. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The config shape test runs in one pass over `opencode.json`, with no network call.
- **NFR-P02**: The moves add no load to either command listing.

### Security
- **NFR-S01**: The `browser: deny` key denies browser use on every agent that carried `chrome_devtools: deny`, and no agent gains a permission.
- **NFR-S02**: The config shape test reads `opencode.json` and writes nothing outside its scratch copy.

### Reliability
- **NFR-R01**: Each dispatch changes one folder of files, and the mirror sync and the contract tests run before the next dispatch.
- **NFR-R02**: A consumer edit that fails a test is reverted, and the path is recorded as open in the implementation summary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A moved README links to a sibling that moved with it. The link stays relative, and the README moves as a unit.
- An agent with no `chrome_devtools` key gets no `browser` key by default.
- A copy of `opencode.json` with a `plugins` key fails the shape test, and the original file passes it.

### Error Scenarios
- The sync command fails on one mirror: the phase stops at that mirror and records the output. No copy is edited by hand.
- A contract test fails from a new path: the path is reverted, and the failure is recorded.
- A benchmark report cites an old path: the report is recorded as an exception, and the phase moves on.

### State Transitions
- Partial completion: the agent wording batches that finished keep their change. The rest stay as they were, and the implementation summary lists them.
- Session expiry: this phase holds no session across dispatches, so this case cannot arise.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | About 11 agents with their mirrors, 12 moved files, about 16 consumers and one new test. |
| Risk | 12/25 | The D2 conflict and the mirror sync carry most of the risk. The moves are mechanical. |
| Research | 8/20 | Research section 3 and the cli-devin references. |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **The D2 conflict.** D2 names `mcp.servers.<name>` as the v1 shape. Research iteration 008 (finding F3) names `mcp.servers` as the v2 shape, which v1 also accepts by unwrapping it, and the research does not verify a direct `mcp.<name>` key on v2. The repo's `opencode.json` uses the direct key `mcp.code_mode`. The brief says to keep the file in the v1 shape. The orchestrator settles which shape each host reads in T003, before any edit to `opencode.json`.
- **The destination of the moved files.** The brief names no destination. The proposal is `.skilled/command-support/`, with the subfolders kept. The orchestrator confirms or amends it in T003.
- **The agent with no `chrome_devtools` key.** `orchestrate.md` carries no `chrome_devtools` key, so the `browser` rule does not reach it. The default leaves its permissions as they are.
- **The mirror folders the checker does not read.** The checker covers `.claude` and `.codex`. The `.pi` copies need a separate sync check, and the `.cursor` and `.devin` links follow `.claude`. T009 records how each folder is synced.
<!-- /ANCHOR:questions -->
