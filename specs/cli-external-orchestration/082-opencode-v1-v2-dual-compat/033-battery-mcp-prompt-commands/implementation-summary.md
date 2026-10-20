---
title: "Implementation Summary"
description: "The v2 command-listed leg no longer fails at random when OpenCode 2 lists a prompt from a connected MCP server. It reads the server names from the private server's config sources and accepts a `<server>:<prompt>` name only from a configured server, so `code_mode:utcp_codemode_usage` passes while a stray or an unknown prefix still fails."
trigger_phrases:
  - "battery mcp prompt commands implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/033-battery-mcp-prompt-commands"
    last_updated_at: "2026-10-20T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded test and battery evidence; CI pending"
    next_safe_action: "Confirm the dual-version battery on CI at the pushed commit"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/opencode-version-battery.cjs"
      - ".skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs"
      - ".skilled/command-support/doctor/scripts/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-battery-mcp-prompt-commands"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-battery-mcp-prompt-commands |
| **Completed** | 2026-10-20 |
| **Status** | In Progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The battery's v2 `command-listed` leg used to call an MCP prompt a stray. Now it asks the private server which MCP servers are configured and accepts a prompt only from one of them. The leg still fails a name that no folder holds and no server owns, so the guard got narrower, not looser.

### Phase 33: battery-mcp-prompt-commands

OpenCode 2 lists each prompt of a connected MCP server as a command named `<server>:<prompt>`. The entry has only `name` and `description`, and it appears only when the server connected before the read. With `code_mode` configured, the main checkout therefore passed once and failed once on 2026-10-20, on the same tree.

The battery now reads `GET /api/config` once per v2 run. That endpoint answers with a top-level array, so it gets its own array parser. The MCP server names come from the keys of each source's `info.mcp.servers`, and the older direct `info.mcp` shape is read too. A listed name that a command folder does not hold passes only when its prefix names one of those servers, and the PASS detail then says `mcp prompts: <n>`. An unprefixed stray and an unconfigured prefix still fail. When the config sources did not parse, a `<server>:<prompt>` name that no command folder holds degrades the leg, because the server list cannot be judged, while a missing project command or an unprefixed stray still fails. OpenCode 1 keeps its `debug config` path, which held 40 commands and no `:` names.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modified | Reads the config sources, reads MCP server names, narrows the stray test, degrades an unjudgeable prompt, notes `mcp prompts` |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modified | Tests for the reader, both acceptance outcomes and the unreadable-config degradation |
| `.skilled/command-support/doctor/scripts/README.md` | Modified | The `command-listed` rule and the `mcp prompts` note |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/033-battery-mcp-prompt-commands/` | Created | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modified | Phase map row and handoff row for 033 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim was measured before the docs were written. The unit suite moved from 45 to 50 tests (C9 to C13), and five mutations of the new rule were run against it. The battery ran in worktree 173 for both families, three times, with every leg passing. The v2 family then ran nine times over two sessions with `--root` on the main checkout, which produced both listing sizes: four runs listed 43 with `mcp prompts: 1` and the other five listed 42. The isolated nested-worktree read was checked as well. CI has not run yet, so this phase stays In Progress.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the config sources instead of listing prompts | The API names servers, not prompts; the prefix is enough to tell a server's prompt from a stray, and it costs one read. |
| Accept only a configured prefix | Accepting any `<word>:<word>` name would hide a real stray behind a colon. |
| Read the config once per run | One request per run, and the same answer serves the whole leg. |
| Parse the array separately | The object parser refuses a top-level array by design, and loosening it would weaken every other read. |
| Leave OpenCode 1 alone | Its listing path never showed a `:` name with `code_mode` configured, so a change there would add risk without a failure to fix. |
| Note `mcp prompts: <n>` in the PASS detail | A reader can see whether the run exercised the new branch or passed without it. |
| Degrade rather than fail an unjudgeable prefixed name | When `/api/config` does not parse, any `<prefix>:<name>` command in no folder makes the leg DEGRADED, even an unconfigured one such as `ghost:typo`, because without the config the battery cannot tell the two apart. DEGRADED exits 3, and the CI job fails on any non-zero exit, so such a stray never passes; it is reported as unjudgeable rather than proven stray. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Unit suite | 50 of 50 pass (45 before, five added, C9 to C13) |
| Real `readV2` config and unreadable-config case | The fake answers `/api/config` and lists `code_mode:utcp_codemode_usage`, so the leg passes with `mcp prompts: 1`; a null config with `code_mode:x` degrades and a null config with an unprefixed stray still fails |
| Mutations: never accept, always accept, ignore `info.mcp.servers` | Each fails 2 tests |
| Mutations: degrade whenever any prefixed name, drop the config read | Each fails at least 1 test |
| Battery in worktree 173 | v1 all four legs PASS; v2 all four legs PASS on three runs |
| v2 with `--root` on the main checkout, nine runs over two sessions | All PASS; four listed 43 with `mcp prompts: 1`, the other five listed 42 |
| Isolated nested-worktree read | Reads only its own `.opencode` folder, so no MCP server and no MCP prompt appears; the leg passes |
| Strict validation | This folder `RESULT: PASSED` |
| CI at the pushed main commit | Not run yet; the dual-version battery on CI at the pushed main commit remains pending, so this phase is In Progress |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The prefix is trusted, not the prompt.** A project command literally named `<configured-server>:<anything>` would pass without being an MCP prompt. The runtime lists no such name today.
2. **The config shape is read as it exists today.** `mcpServerNames` understands `info.mcp.servers` and the older direct `info.mcp` keys. A new shape yields no names, and a listed prompt then fails as a stray when the config parsed but lacks the server; an unreadable config degrades instead, so the gap is visible rather than silent.
3. **The prompt's presence is a race.** It is listed only when the server connected before the read, so the count alternates between 42 and 43 across runs. Both outcomes pass now.
<!-- /ANCHOR:limitations -->

---
