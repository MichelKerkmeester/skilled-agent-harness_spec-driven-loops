---
title: "Feature Specification: Pi runtime compatibility (prompts, agents, extensions)"
description: "Build the three real .pi/ artifacts phases 005/006/008 designed but never authored: .pi/prompts/*.md (36 flattened commands), .pi/agents/*.md (13 translated agents via pi-subagents), and .pi/extensions/*.ts (guard-core hooks mirroring cli-cursor/cli-devin's hook wiring)."
trigger_phrases:
  - "pi runtime compatibility"
  - "pi prompts agents extensions"
  - "pi command agent hook parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/012-pi-runtime-compatibility"
    last_updated_at: "2026-07-27T15:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md (Planned), grounded in phases 005/006/008's designs plus live research"
    next_safe_action: "Author plan.md/tasks.md/checklist.md, then dispatch LUNA per plan.md"
    blockers: []
    key_files: [".pi/prompts/", ".pi/agents/", ".pi/extensions/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: ["CONFIRMED: .cursor/.devin do NOT have agent/command mirror files -- only .codex does, as Codex CLI's own native per-agent/per-command registration requirement.", "CONFIRMED: pi-subagents supports project-local .pi/agents/**/*.md (flat glob, project overrides global), 17-field schema, live-fetched from pi.dev.", "CONFIRMED: Pi's real extension mechanism is .pi/extensions/*.ts, auto-discovered, pi.on(event, handler), 32 real events (phase 008 type-file read).", "CONFIRMED: .codex/agents/*.toml and .codex/prompts/*.md are generated via sync-agents.cjs/sync-prompts.cjs; the existing Codex mirror is currently drifted (3 missing/1 stale prompts, 1 stale agent) -- pre-existing, unrelated, out of scope here."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi runtime compatibility (prompts, agents, extensions)

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Phase** | 12 of 13 |
| **Predecessor** | `../011-docs-agents-governance-and-closeout/spec.md` |
| **Successor** | `../013-pi-manual-testing-playbook-authoring/spec.md` |
| **Handoff Criteria** | **Entry**: phases 005 (command layer), 006 (agent bridge), and 008 (hook/extension layer) have each landed a design this phase can execute against (all three confirmed Complete/Blocked-with-real-findings). **Exit**: `.pi/prompts/*.md`, `.pi/agents/*.md`, and `.pi/extensions/*.ts` all exist, are live-verified to load/dispatch without error in this worktree's real `pi` installation, and `validate.sh --strict` passes for this phase folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the CLI Pi creation specification — the first of two phases added after the original 11-phase plan, at the operator's explicit request to bring `.pi/` to real command/agent/hook compatibility and to give `cli-pi` a working manual-testing-playbook (phase 013).

**Scope Boundary**: Real implementation (not planning) — this phase builds and live-verifies the three `.pi/` artifacts phases 005/006/008 designed but explicitly deferred. It does not author the manual-testing-playbook itself (phase 013's job, which exercises what this phase builds).

**Dependencies**:
- `005-pi-command-layer` — the flattening/translation design for `.pi/prompts/*.md` (naming convention, `$1`/`$2`/`$@` argument-substitution mapping from OpenCode's `$ARGUMENTS`, non-recursive discovery).
- `006-pi-agent-bridge` — the `pi-subagents` schema (17 fields, `.pi/agents/**/*.md` flat glob, project-overrides-global) and the confirmed `pi install npm:pi-subagents -l --approve` verb.
- `008-pi-hook-extension-layer` — the real 32-event Extension API and the guard-core-to-lifecycle-event mapping table (type-confirmed via a direct `types.d.ts` read).
- `007-pi-mcp-host-integration` — this worktree's real, working `.pi/` directory (`.pi/settings.json`, `.pi/npm/node_modules/`) that this phase's live verification runs against.
- The existing `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`/`sync-agents.cjs` generator pattern — reused/extended, not reinvented.

**Deliverables**:
- `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` (or an equivalent flag on the existing script) generating `.pi/prompts/*.md` thin-pointer stubs for all 36 canonical `.opencode/commands/**/*.md` files, with a `--check` mode.
- `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` generating `.pi/agents/*.md` for all 13 canonical `.opencode/agents/*.md` files, translating OpenCode's frontmatter into pi-subagents' own field names, with a `--check` mode.
- One `.pi/extensions/*.ts` file per guard-core already wired into `.cursor/hooks.json`/`.devin/hooks.v1.json`/`.codex/hooks.json`, delegating to the same shared runtime-neutral core modules.
- Live verification in this worktree's real `pi` installation: at least one flattened command dispatches, at least one translated agent parses without a schema error, and the extension(s) load without a startup crash.

**Changelog**: no hub changelog entry — matches this packet's own established precedent (adding cli-pi itself never touched `cli-external-orchestration/changelog/`).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-pi` is registered as the hub's 6th executor and its model/MCP-host integration are real and live-verified (phases 007/009), but Pi still cannot actually run this repo's 36 commands, 13 agents, or governance hooks the way Claude Code/OpenCode/Codex/Cursor/Devin already can — phases 005/006/008 designed HOW each would translate but explicitly stopped short of writing the files (`.pi/prompts/`, `.pi/agents/`, `.pi/extensions/` all do not exist in this worktree today; only `.pi/mcp.json`/`.pi/settings.json`/`.pi/npm/` exist, from phase 007). A live research pass this session also found the operator's own mental model needed correcting: `.cursor/` and `.devin/` do NOT have agent/command mirror files like `.codex/agents/*.toml`/`.codex/prompts/*.md` — that pattern is Codex-specific (its own native per-agent/per-command file-registration requirement). What Cursor and Devin genuinely share, and Pi is missing, is **hook wiring** into the same shared guard-core scripts (`spec-gate-enforce`, `mcp-route-guard`, `task-dispatch-guard`) every other runtime already delegates to.

### Purpose
Build and live-verify the three concrete `.pi/` artifacts (prompts, agents, extensions) that bring Pi to real parity with its siblings, reusing the existing `sync-prompts.cjs`/`sync-agents.cjs` generator pattern and the same runtime-neutral guard-core modules every other CLI adapter already consumes — grounding every claim in a real command or live `pi` session, not documentation alone.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `sync-prompts-pi.cjs` (or a `--target pi` mode on the existing script) walking the same 36-command canonical source list (`.opencode/commands/**/*.md`, skipping `assets/`, `scripts/`, `fixtures/`, `README.md`, `*.contract.md`) and emitting `.pi/prompts/*.md` thin-pointer stubs, matching `.codex/prompts/*.md`'s proven shape (a pointer instruction Pi, being an LLM-driven agent, can act on directly — not a full content duplicate).
- A new `sync-agents-pi.cjs` walking `.opencode/agents/*.md` (13 files) and emitting `.pi/agents/*.md`, translating OpenCode's frontmatter (`mode`, `permission` block, `tools`) into pi-subagents' own 17-field schema (`name`, `description`, `tools`, `model`, `thinking`, `systemPromptMode`, `inheritProjectContext`, `inheritSkills`, `skills`, `skillPath`, `output`, `async`, `timeoutMs`, `turnBudget`, `acceptance`), carrying the instruction body through unchanged.
- One `.pi/extensions/*.ts` file per guard-core already wired for the other 3 runtimes, each a plain `ExtensionFactory` (`(pi: ExtensionAPI) => void`) registering via `pi.on(event, handler)` against phase 008's confirmed real event set, delegating to the same shared `.opencode/skills/system-spec-kit/lib/spec-gate/spec-gate-core.mjs`-class modules (fail-open discipline identical to the Codex/Claude/OpenCode adapters).
- Both `--check` mode is used to confirm no drift after generation; both new generator scripts get a `README.md` mirroring `.opencode/skills/system-spec-kit/scripts/codex/README.md`'s shape.
- Live verification in THIS worktree's real, already-installed `pi` (0.82.1) + `pi-subagents`/`pi-mcp-extension` state: dispatch at least one flattened command, parse-check at least one translated agent, and confirm at least one extension loads without a startup error.

### Out of Scope
- Authoring the actual manual-testing-playbook (`013-pi-manual-testing-playbook-authoring`'s job — this phase's artifacts are what that playbook exercises).
- Fixing the Codex mirror's own currently-drifted state (3 missing/1 stale prompts, 1 stale agent in `.codex/`) — a real, pre-existing, unrelated issue, flagged here but not bundled into this phase's fix.
- Any change to `.opencode/agents/*.md`, `.opencode/commands/**/*.md`, or `.claude/agents/*.md` themselves — those stay canonical, read-only sources for this phase's generators.
- Installing any NEW third-party package — `pi-subagents` and `pi-mcp-extension` are already installed in this worktree from phases 001/007's real work.
- Wiring these new `.pi/extensions/*.ts` files into any CI/pre-commit gate — that is a separate, future decision, out of this phase's scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` | Create | Generator: 36 canonical commands -> `.pi/prompts/*.md` thin-pointer stubs, `--check` mode. |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` | Create | Generator: 13 canonical agents -> `.pi/agents/*.md`, OpenCode-to-pi-subagents field translation, `--check` mode. |
| `.opencode/skills/system-spec-kit/scripts/pi/README.md` | Create | Documents both generators, mirroring `codex/README.md`'s shape. |
| `.pi/prompts/*.md` | Create (36 files) | Generated output of `sync-prompts-pi.cjs`. |
| `.pi/agents/*.md` | Create (13 files) | Generated output of `sync-agents-pi.cjs`. |
| `.pi/extensions/*.ts` | Create (N files, one per guard-core) | Delegates to the same shared guard-core modules the other 3 runtimes already consume. |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md` | Modify | Add the confirmed `.pi/agents/**/*.md` path/schema convention (currently covers delegation patterns only, not the file-path schema). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sync-prompts-pi.cjs` generates a `.pi/prompts/*.md` thin-pointer stub for all 36 canonical commands. | `find .pi/prompts -name '*.md' \| wc -l` returns 36; each stub names its canonical `.opencode/commands/...` source and passes `$ARGUMENTS`-equivalent argument passthrough; `--check` reports clean immediately after generation. |
| REQ-002 | `sync-agents-pi.cjs` generates a `.pi/agents/*.md` file for all 13 canonical agents, with fields correctly translated into pi-subagents' schema. | `find .pi/agents -name '*.md' \| wc -l` returns 13; each file's frontmatter uses pi-subagents' own field names (not OpenCode's `mode`/`permission` block verbatim); `--check` reports clean immediately after generation. |
| REQ-003 | At least one `.pi/extensions/*.ts` file exists, registers via `pi.on(...)` against a real, phase-008-confirmed event name, and delegates to a shared guard-core module rather than reimplementing guard logic. | A live `pi` session in this worktree loads without a startup error with the extension present; direct code read confirms the delegation call, not a reimplementation. |
| REQ-004 | Live verification: at least one flattened `.pi/prompts/*.md` command dispatches via a real `pi` session, and at least one `.pi/agents/*.md` file parses without a schema error. | Captured command output/exit code recorded as evidence, not inferred from file existence alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The Codex mirror's pre-existing drift (found live this session: 3 missing/1 stale prompts, 1 stale agent) is flagged, not silently ignored and not fixed as part of this phase. | This phase's docs name the exact drift found, with a note that fixing it is a separate, future task. |
| REQ-006 | `cli-pi/references/agent-delegation.md` gains the confirmed `.pi/agents/**/*.md` path/schema convention. | `git diff` on that file shows the addition; no unrelated rewrite. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 36 commands have a `.pi/prompts/*.md` stub; `sync-prompts-pi.cjs --check` reports clean.
- **SC-002**: All 13 agents have a `.pi/agents/*.md` translation; `sync-agents-pi.cjs --check` reports clean.
- **SC-003**: At least one guard-core is bridged via a real `.pi/extensions/*.ts` file, confirmed live-loading without a startup error.
- **SC-004**: At least one command dispatch and one agent parse-check are live-verified, with captured evidence (not inferred).
- **SC-005**: `validate.sh --strict` passes for this phase folder; whole-packet `validate.sh --recursive --strict` still returns `Errors: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The pi-subagents field-translation (OpenCode `permission` block -> pi-subagents `tools:` array) may not have a clean 1:1 mapping for every agent. | Medium — a lossy translation could silently under- or over-grant tool access in the translated agent. | Translate conservatively (deny-by-default where the mapping is ambiguous); live-verify at least one translated agent parses and flag any agent whose mapping needed a judgment call. |
| Risk | `.pi/extensions/*.ts` is genuinely new, security-relevant code (a 4th consumer of the guard-core modules). | Medium-High — a bug here could fail-closed (blocking legitimate work) or, worse, fail in a way that doesn't fail open. | Mirror the EXACT fail-open pattern (`try { ... } catch { approve } `) the other 3 adapters already use; GLM-5.2 independent review before commit. |
| Risk | The existing `.codex/` mirror is currently drifted; touching the SAME generator-pattern family could tempt scope creep into "fixing" it. | Low-Medium if not disciplined | REQ-005 explicitly names this as out-of-scope; do not touch `.codex/agents/*.toml`/`.codex/prompts/*.md` in this phase. |
| Dependency | `005-pi-command-layer`, `006-pi-agent-bridge`, `008-pi-hook-extension-layer` | Complete/Blocked-with-real-findings — this phase executes their designs. | Cross-reference each phase's own spec.md/implementation-summary.md before authoring the corresponding generator. |
| Dependency | This worktree's real, working `.pi/` (settings.json, npm/node_modules with pi-subagents + pi-mcp-extension installed) from phases 001/007. | Present and confirmed working. | Live verification runs directly against it — no new install needed for this phase. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the design questions (thin-pointer vs. full-content commands, flat-glob vs. subdirectory agents, delegate-vs-reimplement hooks) were resolved during this phase's planning pass, grounded in the already-proven `.codex/` generator precedent and phases 005/006/008's own confirmed facts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../005-pi-command-layer/spec.md`, `../006-pi-agent-bridge/spec.md`, `../008-pi-hook-extension-layer/spec.md` (own the designs this phase executes)
- `../013-pi-manual-testing-playbook-authoring/spec.md` (successor, exercises this phase's artifacts)
- `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs`, `sync-prompts.cjs`, `README.md` (existing generator precedent this phase's scripts pattern-match)
