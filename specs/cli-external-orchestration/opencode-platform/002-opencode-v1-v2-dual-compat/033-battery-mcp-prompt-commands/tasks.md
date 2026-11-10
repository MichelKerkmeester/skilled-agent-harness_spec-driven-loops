---
title: "Tasks: Phase 33: battery-mcp-prompt-commands"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "battery mcp prompt commands tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 33: battery-mcp-prompt-commands

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the failing leg and the shape of the stray entry (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: on the main checkout on 2026-10-20 the v2 `command-listed` leg passed once and failed once; the stray is `code_mode:utcp_codemode_usage`, listed only when the server connected before the read, and the entry has only `name` and `description`.
- [x] T002 Confirm OpenCode 1 needs no change (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: the v1 list comes from `debug config` `.command` keys, which held 40 commands and no `:` names with `code_mode` configured.
- [x] T003 Read the config endpoint's shape (`GET /api/config`) Done: the private v2 server answers with a top-level array of config sources, and the MCP server names are the keys of each source's `info.mcp.servers`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read the array endpoint (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: `parseJsonArray` reads a top-level array and returns null when nothing parses; `readApiJson` takes a parser argument that defaults to `parseJsonObject`.
- [x] T005 Read the MCP server names (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: `mcpServerNames` collects the keys of `info.mcp.servers`, and of the older direct `info.mcp`, from every source and returns them sorted; a non-array response yields an empty list.
- [x] T006 Accept a configured server's prompt (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: `legCommandListed` passes a colon-prefixed name only when its prefix is in `mcpServers`; every other listed name still fails as a stray, and a PASS with accepted prompts adds `mcp prompts: <n>`.
- [x] T007 Read the config once per v2 run (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: `readV2` reads `GET /api/config` with the same project environment and returns it as `config`; `legsForV2` passes the names into the command leg.
- [x] T008 Cover the rule with tests (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`) Done: five new tests (C9 to C13), 45 to 50. They cover both config shapes and a non-array body, a configured prompt that passes with `mcp prompts: 1`, an unprefixed stray that fails, an unconfigured prefix that fails, and an unreadable config that degrades a prefixed name.
- [x] T009 Document the rule (`.skilled/command-support/doctor/scripts/README.md`) Done: the `command-listed` bullet says a `<server>:<prompt>` name passes when the server is in the config sources the private server reports, and that a PASS notes `mcp prompts: <n>`.
- [x] T010 Write this packet (this folder) Done: spec, plan, tasks and implementation summary, plus the parent phase map and handoff row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the unit suite Done: 50 of 50 pass.
- [x] T012 Mutate the new rule five ways Done: never accept, always accept and ignore `info.mcp.servers` each fail 2 tests; degrade-whenever-any-prefixed-name and drop-the-config-read each fail at least 1.
- [x] T013 Run the battery in worktree 173 Done: v1 all four legs PASS, v2 all four legs PASS on three runs.
- [x] T014 Run v2 with `--root` on the main checkout, nine times over two sessions Done: all PASS; four listed 43 with `mcp prompts: 1` and the other five listed 42.
- [x] T015 Check the isolated read Done: a nested worktree reads only its own `.opencode` folder, so no MCP server and no MCP prompt appears there, and the leg passes.
- [x] T016 Validate this folder strict Done: `RESULT: PASSED`.
- [x] T017 Confirm the CI handoff (`.github/workflows/`) Done: all 14 workflows passed at main `ec32f8587d`; OpenCode Dual-Version Battery run 39466991017 passed v1, v2 and both, every leg PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review Fixes

- [x] T018 Degrade an unjudgeable MCP prompt (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) Done: when the config sources did not parse, a listed `<server>:<prompt>` name that no command folder holds degrades `command-listed` with a reason and one detail per name, while a missing project command or an unprefixed stray still FAILs and a valid config that lacks the server still FAILs.
- [x] T019 Cover the degraded case (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`) Done: the real-`readV2` fake answers `/api/config` and lists `code_mode:utcp_codemode_usage`, that test asserts the returned config and the `mcp prompts: 1` PASS, C12 expects DEGRADED for a null config plus `code_mode:x`, and a null config plus an unprefixed stray still FAILs.
- [x] T020 Rerun the suite and strict validation (this folder) Done: 50 of 50 tests pass and strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
