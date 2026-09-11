---
title: "Feature Specification: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "Delete the sk-vision MCP stdio server and every registration that points at it, and restore vision on Cursor and Devin through each host's own prompt-time hook API, matching how OpenCode and Pi already attach in-process."
trigger_phrases:
  - "sk-vision MCP retirement"
  - "sk-vision cursor hook adapter"
  - "sk-vision devin hook adapter"
  - "retire sk-vision-mcp server"
  - "vision without MCP"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters"
    last_updated_at: "2026-09-11T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Consumer audit complete; packet authored from observed evidence."
    next_safe_action: "Operator approves the deletion set, then build the two hook adapters before removing the server."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters/spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
      - ".opencode/skills/sk-vision/hooks/devin/mcp_config.json"
      - ".opencode/skills/sk-vision/hooks/cursor/mcp.json"
      - ".cursor/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-024-mcp-retirement-and-hook-adapters"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `023-command-gated-vision-and-runtime-teardown` |
| **Supersedes** | `014-cursor-devin-mcp-adapters`, `020-cursor-mcp-decoupling`, `021-mcp-server-process-lifecycle` |
| **Handoff Criteria** | The MCP stdio server, its dependency, its build step and every registration pointing at it are gone, and Cursor and Devin both produce a `<SK-VISION>` evidence block from a live session through their own hook adapters. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

sk-vision reaches four hosts. OpenCode and Pi attach the thirteen `sk_vision_*` tools in-process, through a plugin symlink and an extension symlink that the skill owns. Cursor and Devin were given an MCP stdio server instead, on the reasoning that they had no in-process plugin API.

That reasoning is now out of date. Both hosts run repo-owned lifecycle hooks on every prompt, and the shared injection contract records a proven model-context channel for each. The MCP transport is therefore no longer the only way to reach them, and it has stopped working on both.

**Deliverables**: the MCP transport deleted at the source, two prompt-time hook adapters in its place, every doc and playbook realigned, and the dead system-skill MCP registrations cleared out of the runtime configs that still name them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-vision MCP transport has no host that can currently reach it, and it is decaying in two directions at once.

Cursor is half-removed. Its registration was dropped from `.cursor/mcp.json`, which now carries only `code_mode`, but `.cursor/rules/sk-vision.md` is still symlinked into the rules directory with `alwaysApply: true`, and `.cursor/commands/vision.md` still declares `mcp__sk-vision__sk_vision_inspect` in its allowed-tools. Every Cursor session on this repo therefore carries a standing instruction to call tools that are not registered.

Devin still registers the server through `.devin/mcp_config.json`, which symlinks into the skill. Its calls are gated by `.devin/config.local.json`, whose allowlist grants `mcp__mk_spec_memory__*` and `mcp__mk_skill_advisor__*` and never grants `mcp__sk-vision__*`. The cli-devin skill records that `devin -p` rejects MCP tool calls under the permission modes this repo dispatches in unless the allowlist names them, so the one host still registering the server cannot call it in the mode it is actually used. Both servers that allowlist does grant were themselves decommissioned earlier, so the file is stale on every line that mentions MCP.

The transport also carries real weight for that zero reach: an MCP SDK dependency, a second bundle step, a 1.1 MB gitignored artifact last built four days before its own source changed, an integration test, two host configs, two mirror symlinks, two best-effort instruction rules and roughly fifteen documentation and playbook files.

Meanwhile the premise that justified it is false. `.cursor/hooks.json` registers repo-owned adapters on `beforeSubmitPrompt`, and `.devin/hooks.v1.json` registers them on `UserPromptSubmit`. The shared injection contract classifies both as model-context channels already carrying the spec-gate question and the advisor brief.

### Purpose

Retire the MCP transport completely and give Cursor and Devin vision the same way OpenCode and Pi have it: through the host's own extension point, owned by the skill, wired by a symlink, with no second transport concept to maintain.

This trades a dead best-effort path for a live deterministic one. The MCP rules could only ask a model to call a tool. A prompt-time hook runs the analysis itself and injects the evidence, which is the posture OpenCode's command hook already has.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Remove the transport**
- Delete `vision-runtime/src/mcp/server.ts` and `vision-runtime/src/mcp/server.test.ts`.
- Drop the `sk-vision-mcp` bin entry, the `mcp` script and the `@modelcontextprotocol/sdk` dependency from `vision-runtime/package.json`.
- Drop the MCP bundle step from `vision-runtime/scripts/build.ts` so `dist/mcp-server.js` stops being produced.
- Delete `hooks/cursor/mcp.json` and `hooks/devin/mcp_config.json`, and the two mirror symlinks under `.opencode/hooks/sk-vision/`.
- Replace `.devin/mcp_config.json` with a Devin-owned real file carrying only `code_mode`, so retiring sk-vision's config does not take Code Mode with it.

**Add the hook adapters**
- `hooks/cursor/sk-vision.mjs`, registered on `beforeSubmitPrompt` in `.cursor/hooks.json`.
- `hooks/devin/sk-vision.mjs`, registered on `UserPromptSubmit` in `.devin/hooks.v1.json`.
- Both detect an image path in the submitted prompt, run the existing analysis through `RuntimeClient` and `PhotonProvider`, inject a `<SK-VISION>` evidence block on the host's own channel and tear the runtime down afterwards.
- Both fail open on every path, matching the goal and spec-gate adapters: a malformed payload, a disabled kill-switch or any runtime error resolves to a no-op, never a block.
- Unit tests beside each adapter, following `goal-cursor.test.mjs` and `goal-devin.test.mjs`.
- Mirror both into `.opencode/hooks/sk-vision/{cursor,devin}` as per-file symlinks.

**Realign what described the old path**
- Rewrite `hooks/cursor/vision-rule.md` and `hooks/devin/vision-rule.md` for the hook path, or delete them if the hook makes the instruction redundant.
- Rewrite `.cursor/commands/vision.md` so its allowed-tools no longer name an MCP tool.
- `SKILL.md`, skill `README.md` and `hooks/README.md`: replace the MCP-only-hosts model with the four-host hook and plugin model.
- Feature catalog: replace `host-adapters/mcp-transport.md` with per-host adapter entries, and update `feature-catalog.md`.
- Manual testing playbook: retire `cursor-mcp.md`, `devin-mcp.md`, `mcp-standalone.md` and `mcp-lifecycle.md`, add the two hook scenarios, update `vision-blind-model.md` and the playbook index.
- `.opencode/hooks/injection-contract.md` and `.opencode/hooks/README.md`: add the vision injection and its kill-switch.

**Clear the dead system-skill MCP registrations**
- `.devin/config.local.json`: drop the `mcp__mk_spec_memory__*` and `mcp__mk_skill_advisor__*` allowlist entries, both naming decommissioned servers.
- Repo `README.md`: drop the `system_skill_advisor` MCP server-name and client-namespace line.
- `.claude/agents/review.md` and `.claude/agents/deep-review.md`: drop `mcp__system_code_index__detect_changes` from their tools lists.

### Out of Scope

- The OpenCode plugin and the Pi extension. Both work and neither changes.
- The thirteen-tool registry, `PhotonProvider`, `RuntimeClient` and `python/runtime.py`. The adapters are new callers, not a contract change.
- Claude Code vision. It has had no sk-vision integration since `020-cursor-mcp-decoupling` and gains none here.
- Historical spec packets under `specs/` that describe the MCP transport. They are records of what was true when written, not live wiring, and rewriting them would destroy the audit trail this packet depends on.
- The stale `code_mode` and advisor entries in runtime configs that are currently uncommitted working-tree changes. This packet does not adjudicate that in-flight edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts` | Delete | MCP stdio server and its lifecycle guards |
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts` | Delete | MCP integration test |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Update | Drop bin, `mcp` script, MCP SDK dependency |
| `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts` | Update | Drop the `mcp-server.js` bundle step |
| `.opencode/skills/sk-vision/hooks/cursor/mcp.json` | Delete | Portable Cursor MCP entry |
| `.opencode/skills/sk-vision/hooks/devin/mcp_config.json` | Delete | Skill-owned Devin MCP config |
| `.devin/mcp_config.json` | Replace | Symlink becomes a Devin-owned real file carrying only `code_mode` |
| `.opencode/hooks/sk-vision/cursor/mcp.json` | Delete | Mirror symlink |
| `.opencode/hooks/sk-vision/devin/mcp_config.json` | Delete | Mirror symlink |
| `.opencode/skills/sk-vision/hooks/cursor/sk-vision.mjs` | Create | `beforeSubmitPrompt` adapter |
| `.opencode/skills/sk-vision/hooks/cursor/sk-vision-cursor.test.mjs` | Create | Adapter unit test |
| `.opencode/skills/sk-vision/hooks/devin/sk-vision.mjs` | Create | `UserPromptSubmit` adapter |
| `.opencode/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs` | Create | Adapter unit test |
| `.cursor/hooks.json` | Update | Register the Cursor adapter |
| `.devin/hooks.v1.json` | Update | Register the Devin adapter |
| `.opencode/hooks/sk-vision/cursor/sk-vision.mjs` | Create | Mirror symlink |
| `.opencode/hooks/sk-vision/devin/sk-vision.mjs` | Create | Mirror symlink |
| `.cursor/commands/vision.md` | Update | Drop the MCP tool from allowed-tools |
| `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md` | Update | Hook path, or delete if redundant |
| `.opencode/skills/sk-vision/hooks/devin/vision-rule.md` | Update | Hook path, or delete if redundant |
| `.opencode/skills/sk-vision/SKILL.md` | Update | Four-host adapter model |
| `.opencode/skills/sk-vision/README.md` | Update | Host table |
| `.opencode/skills/sk-vision/hooks/README.md` | Update | Attach-model table and the section explaining why Cursor and Devin differ |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/mcp-transport.md` | Delete | Replaced by per-host adapter entries |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/cursor-hook.md` | Create | Cursor adapter entry |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/devin-hook.md` | Create | Devin adapter entry |
| `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md` | Update | Catalog index |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/*` | Update | Retire four MCP scenarios, add two hook scenarios |
| `.opencode/hooks/injection-contract.md` | Update | Add the vision injection row |
| `.opencode/hooks/README.md` | Update | Kill-switch index entry |
| `.devin/config.local.json` | Update | Drop two decommissioned MCP allowlist entries |
| `README.md` | Update | Drop the advisor MCP server-name line |
| `.claude/agents/review.md` | Update | Drop `mcp__system_code_index__detect_changes` |
| `.claude/agents/deep-review.md` | Update | Drop `mcp__system_code_index__detect_changes` |

### Verification evidence

- `bun test` and `bunx tsc --noEmit` green in `vision-runtime` after the deletion, with the pre-change counts captured first.
- `bun run scripts/build.ts` produces `dist/plugin.js` and `dist/python/runtime.py` and no `dist/mcp-server.js`.
- A repo-wide search for `sk-vision-mcp`, `mcp-server.js` and `mcp__sk-vision__` returns no hits outside `specs/`.
- Live Cursor session: a prompt naming an image path produces a `<SK-VISION>` block the model answers from.
- Live Devin session: the same, through `UserPromptSubmit`.
- Both hosts still start clean with the adapter disabled by its kill-switch.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-001** The MCP stdio server, its test, its bin entry, its build step and the MCP SDK dependency are removed, and the package still typechecks and tests green.
- **REQ-002** No registration anywhere in the live tree points at `dist/mcp-server.js` or an `mcp__sk-vision__*` tool.
- **REQ-003** Devin retains `code_mode` after `.devin/mcp_config.json` stops being owned by sk-vision.
- **REQ-004** Cursor produces a `<SK-VISION>` evidence block from a live session through `beforeSubmitPrompt`.
- **REQ-005** Devin produces a `<SK-VISION>` evidence block from a live session through `UserPromptSubmit`.
- **REQ-006** Both adapters fail open: a malformed payload, a disabled kill-switch or a runtime error yields a no-op, never a blocked turn.

### P1 - Required

- **REQ-007** The adapters tear the vision runtime down after each call, matching the teardown contract the OpenCode command hook established.
- **REQ-008** Every doc, catalog entry and playbook scenario describing the MCP transport is replaced or retired, with no surviving claim that Cursor or Devin attach over MCP.
- **REQ-009** The four dead system-skill MCP registrations are cleared from the live configs that name them.

### P2 - Nice to have

- **REQ-010** The two `vision-rule.md` instruction files are deleted rather than rewritten, if the hook injection makes the standing instruction redundant.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The `vision-runtime` package has no MCP dependency, no MCP entrypoint and no MCP build output.
- All four hosts reach vision through their own native extension point, and the skill owns the adapter source for each.
- A search for the retired tool namespace returns hits only inside `specs/`.
- `validate.sh` on this packet reports `RESULT: PASSED` under `--strict`.
- The deletion is revertible by a single `git revert` of the packet's commits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| ~~Cursor's `beforeSubmitPrompt` may not reach the model~~ **CONFIRMED BROKEN 2026-09-11** | The Cursor half of the design is not buildable as written | Probed live against build `2026.09.02-c22c1a3`: the event does not fire, while a `sessionStart` positive control did. Evidence in `scratch/cursor-event-probe.md`. REQ-004 is blocked pending an operator decision on the Cursor route. See ADR-005. |
| Removing sk-vision's config file takes Devin's Code Mode with it | Devin loses an unrelated capability | `.devin/mcp_config.json` is replaced with a Devin-owned real file before the skill's copy is deleted, and Code Mode presence is asserted from the final state. |
| A prompt-time hook runs the local model on turns the user did not ask about | GPU spin and latency on ordinary prompts | The adapters inherit the command-gated posture: they fire only when the prompt names an image path, and they respect the same kill-switch family as every other hook here. |
| The build artifact is already stale, so a test run may exercise code that does not match source | A green run that proves nothing | Rebuild before capturing the baseline, and read the output rather than the exit status. |
| Deleting docs loses the reasoning behind the original MCP design | Future work re-litigates a settled question | The superseded packets stay untouched under `specs/`, and this packet's decision record names them. |

### Dependencies

- The existing thirteen-tool registry, `PhotonProvider` and `RuntimeClient`, unchanged.
- The hook adapter pattern established by `.opencode/hooks/goal/{cursor,devin}/goal-inject.mjs`.
- The shared injection contract at `.opencode/hooks/injection-contract.md`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions

- **Is the MCP transport still used?** No. Cursor's registration is gone and Devin's permission allowlist never granted the tools. Answered by direct inspection of the runtime configs and `.devin/config.local.json`.
- **Should this be a CLI instead?** No. Both hosts run repo-owned hooks already, so extending that pattern is cheaper than introducing a new invocation surface. Recorded in the decision record.
- **Does Devin support hooks?** Yes. `.devin/hooks.v1.json` registers eight events, six of them already carrying repo-owned adapters.

### Open Questions

- **What route does Cursor get?** Its only prompt-time event does not fire, so the hook design is dead for that host. The live options are a CLI its existing `/vision` command and rule invoke, or keeping MCP for Cursor alone. Blocks REQ-004, AC-004 and the Cursor half of ADR-002. Devin is unaffected.
- **Do the `vision-rule.md` instruction files survive?** If the hook injects evidence unconditionally, a standing instruction telling the model to call a tool is redundant. Decide after the adapters are proven live. On Cursor this now depends on the question above.
<!-- /ANCHOR:questions -->
