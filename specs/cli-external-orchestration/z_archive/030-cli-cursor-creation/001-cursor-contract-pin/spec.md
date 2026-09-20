---
title: "Feature Specification: Cursor CLI contract pin"
description: "Verify the live Cursor CLI (cursor-agent, build 2026.07.23-e383d2b) contract - install, binary name, non-interactive flags, auth, hooks, shared .cursor config, permissions/sandbox, models, and unique surfaces (worktree/worker/plugin/skills) - before any executor or skill-packet work depends on assumptions from Cursor-the-editor knowledge."
trigger_phrases: ["cursor cli contract pin", "cursor-agent verification", "cursor cli hooks contract"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Verified live Cursor CLI contract against installed binary and docs"
    next_safe_action: "Hand contract facts to phase 002 (deep-loop-executor-support)"
    blockers: ["cursor-agent login needs an interactive OAuth browser flow - not automatable"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Cursor CLI is a real, currently-shipping terminal coding agent whose binary is cursor-agent (with an agent alias), sharing its entire config surface with the Cursor editor under .cursor/ and ~/.cursor/."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cursor CLI contract pin

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | None (first phase) |
| **Successor** | `002-deep-loop-executor-support` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cursor CLI has never existed in this repo before — this is a first-time creation, not a revival. There is no archived packet, no prior contract, and no cached facts to lean on. Worse, "Cursor" is widely known as an IDE, and much pretrained knowledge (`.cursorrules`, editor-only config) is stale or IDE-specific rather than CLI-specific. Building the new `cli-cursor` mode on IDE-era assumptions would restore an inaccurate skill. The Cursor CLI shipped as a terminal-native agent (`cursor-agent`) with its own headless/print mode, a shared-with-the-editor config surface, a Cursor 1.7+ hooks system, native git-worktree isolation, and a cloud `worker` model — none of which can be assumed from editor knowledge.

### Purpose
Install the CLI, verify its live build, and pin the current contract for every surface the later phases depend on: binary/invocation/flags, non-interactive dispatch, auth, hooks (events + schema + discovery + response envelope), the shared `.cursor/`/`~/.cursor/` config surface, permission/sandbox model, model roster, and the Cursor-unique surfaces (worktree, worker, plugin, skills) that have no analog in `cli-codex`/`cli-claude-code`/`cli-opencode` — each confirmed against a live command's stdout or an official `cursor.com/docs` page, not inferred.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install the official Cursor CLI and confirm the live binary build and canonical binary name.
- Confirm the non-interactive/headless dispatch surface (`-p`/`--print`, `--output-format`, `--stream-partial-output`, execution modes) against live `--help`.
- Confirm the auth model (`login` OAuth vs. `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN` env / `--api-key` for headless) and current auth state on this machine.
- Confirm the hooks contract (event names, `hooks.json` schema, discovery locations, response envelope) against `cursor.com/docs/hooks` and the live `~/.cursor/hooks.json`.
- Confirm the config surface: that the CLI shares `.cursor/` (project) and `~/.cursor/` (user) with the Cursor editor (`mcp.json`, `hooks.json`, rules, skills, plugins) plus its own `~/.cursor/cli-config.json`.
- Confirm the permission/sandbox model (`-f`/`--force`, `--yolo`, `--auto-review`, `--sandbox enabled|disabled`, `--trust`) against live `--help`.
- Confirm the model roster shape (`Auto` router default, Cursor-native Composer, hosted frontier models via `--model`) — noting live enumeration requires account auth.
- Confirm the Cursor-unique surfaces with no sibling analog: native git worktree (`-w`/`--worktree`), cloud `worker`, `plugin marketplace`, Cursor skills, and MCP (`mcp` subcommand + `.cursor/mcp.json`).

### Out of Scope
- Completing `cursor-agent login` (interactive OAuth, operator-only action).
- Any executor, skill-packet, or hook-adapter implementation (phases 002-004).
- Enumerating the exact live model roster (requires account auth this machine does not hold — deferred to implementation time).

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| (none - verification only) | N/A | 001 | This phase produces evidence, not code changes. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Cursor CLI installed and its build confirmed via `cursor-agent --version`; the canonical binary name (`cursor-agent`, with `agent` as an alias symlink) confirmed via `which`. | P0 |
| REQ-002 | Auth model confirmed (`cursor-agent login` OAuth, or `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`/`--api-key` for headless); current auth state confirmed via `about`/`status`. | P0 |
| REQ-003 | Non-interactive dispatch surface confirmed live (`-p`/`--print`, `--output-format text\|json\|stream-json`, `--mode plan\|ask`, `--model`), including fail-closed behavior when no account auth is present. | P0 |
| REQ-004 | Hooks contract confirmed against official docs and the live `~/.cursor/hooks.json`: event names, `hooks.json` schema, discovery order, and the `{permission, user_message, agent_message}` + exit-code-2-blocks response envelope. | P0 |
| REQ-005 | Config surface confirmed: the CLI shares `.cursor/`/`~/.cursor/` with the editor (`mcp.json`, `hooks.json`, rules, skills, plugins) plus its own `~/.cursor/cli-config.json`. This is materially different from Devin's/Codex's tool-private namespace. | P0 |
| REQ-006 | Permission/sandbox model confirmed (`--force`/`--yolo`, `--auto-review`, `--sandbox enabled\|disabled`, `--trust`) — not assumed from IDE settings. | P1 |
| REQ-007 | Model roster shape confirmed (`Auto` router default, Cursor-native Composer, hosted frontier models); live enumeration explicitly deferred as auth-gated (TBD). | P1 |
| REQ-008 | Cursor-unique surfaces confirmed as genuinely without a `cli-codex`/`cli-claude-code`/`cli-opencode` analog: native git worktree (`-w`), cloud `worker`, `plugin marketplace`, Cursor skills. | P2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- `cursor-agent --version` returns a live build string.
- Every REQ above has a citation to either a live command's stdout or a `cursor.com/docs` URL, not an inference.
- Anything genuinely unconfirmable (live model roster, per-event CLI hook delivery) is marked "TBD — verify at implementation time", never fabricated.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **IDE-vs-CLI drift**: much public Cursor knowledge describes the editor, not the CLI. Mitigated by verifying every claim against the installed `cursor-agent` binary's own `--help`/subcommands and the current `cursor.com/docs/cli/**` pages, not editor-era assumptions.
- **Docs-vs-binary drift**: fetched documentation could describe a newer/older feature set than the exact installed build (`2026.07.23-e383d2b`). Mitigated by cross-checking each doc claim against a live `--help`/subcommand where one exists.
- **Auth-gated facts**: the live model roster and any account-scoped behavior cannot be enumerated without account auth, which requires an operator-only OAuth flow. Mitigated by marking those facts TBD rather than guessing.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

None beyond standard evidence-based verification.

## 8. EDGE CASES

- `cursor-agent` absent from `PATH` entirely (handled by phase 002's fail-closed executor guard, not this phase).
- User never completes `cursor-agent login` (headless `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN` path documented as the CI-safe alternative; a `-p` dispatch without auth fails closed with `Error: Authentication required`).

## 9. COMPLEXITY ASSESSMENT

Low - read-only verification, no code changes.

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Docs describe editor-only or unshipped features | Medium | Medium | Cross-checked docs against live `--help` output and installed subcommands |
| Model roster fabricated from pretrained IDE knowledge | Medium | Medium | Live enumeration marked auth-gated TBD; only `--help`/product-page-confirmed model shapes recorded |
<!-- /ANCHOR:questions -->

## 11. USER STORIES

- As the operator, I want the creation's later phases built against the Cursor CLI I actually have installed, not IDE-era assumptions or a fabricated CLI contract.

## 12. OPEN QUESTIONS

- Exact live model roster (ids/families available to a given account) is auth-gated — TBD, verify at implementation time via `cursor-agent models`/`--list-models` once authenticated.
- Whether the Cursor CLI (as opposed to the editor) fires every hook event defined in `hooks.json` is not guaranteed — a documented community caveat notes the CLI may not send all events; TBD, verify per-event live at hook-adapter time (phase 004).

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase)
- `../002-deep-loop-executor-support/spec.md` (consumes this phase's contract facts)
