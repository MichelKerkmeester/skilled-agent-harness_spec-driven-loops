---
title: "Implementation Plan: Pi runtime compatibility (prompts, agents, extensions)"
description: "Plan for building sync-prompts-pi.cjs, sync-agents-pi.cjs, and .pi/extensions/*.ts, reusing the existing codex generator pattern and shared guard-core modules."
trigger_phrases: ["pi runtime compatibility plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/012-pi-runtime-compatibility"
    last_updated_at: "2026-07-27T18:32:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md: 3-stream build (prompts/agents/extensions), LUNA+GLM discipline"
    next_safe_action: "Author tasks.md/checklist.md, then dispatch LUNA"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/scripts/pi/"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi runtime compatibility (prompts, agents, extensions)

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS generator scripts (matching `sync-prompts.cjs`/`sync-agents.cjs`); TypeScript for `.pi/extensions/*.ts` (Pi's native extension format). |
| **Framework** | None new — reuses the existing codex generator pattern and the shared runtime-neutral guard-core modules already consumed by 3 other CLI adapters. |
| **Storage** | None. |
| **Testing** | Generator `--check` mode (drift detection); live `pi` session dispatch in this worktree (real installed `pi` 0.82.1 + pi-subagents + pi-mcp-extension). |

### Overview
Build 3 independent artifacts by extending an already-proven pattern: (1) `sync-prompts-pi.cjs`, a sibling of `sync-prompts.cjs` emitting thin-pointer `.pi/prompts/*.md` stubs for all 36 commands; (2) `sync-agents-pi.cjs`, a NEW converter (pi-subagents' schema differs too much from Codex's TOML wrapper to reuse `sync-agents.cjs` directly) emitting `.pi/agents/*.md` for all 13 agents; (3) `.pi/extensions/*.ts` files, one per guard-core already wired for cursor/devin/codex, delegating to the same shared core modules. All 3 streams are independent and can be built in parallel, then live-verified together against this worktree's already-working `.pi/` state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 005/006/008 confirmed landed with real, actionable designs. [EVIDENCE: all 3 phases' `spec.md` Status fields, re-confirmed this session]
- [x] This worktree's real `.pi/` state (settings.json, npm/node_modules with pi-subagents + pi-mcp-extension) confirmed present from phases 001/007. [EVIDENCE: `find .pi -maxdepth 2`]
- [x] Existing `sync-prompts.cjs`/`sync-agents.cjs` generator pattern read and understood before authoring new siblings. [EVIDENCE: this session's research agent report]

### Definition of Done
- [x] `sync-prompts-pi.cjs --check` and `sync-agents-pi.cjs --check` both report clean.
- [x] All 7 `.pi/extensions/*.ts` files live-load without a startup error.
- [x] A command dispatch context and agent parse-check are live-verified with captured evidence.
- [x] GLM-5.2 independent review completed, findings addressed.
- [x] `validate.sh --strict` passes for this phase folder; whole-packet `--recursive --strict` still `Errors: 0`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend, don't reinvent: `.pi/prompts/*.md` reuses `sync-prompts.cjs`'s exact thin-pointer stub shape and command-discovery walk (both Codex and Pi are LLM-driven agents that can act on a pointer instruction). `.pi/agents/*.md` needs a genuinely new converter since pi-subagents' 17-field schema doesn't map onto Codex's TOML wrapper. `.pi/extensions/*.ts` makes Pi a 4th consumer of the SAME shared guard-core modules the Codex/Claude/OpenCode hook adapters already call — never a second reimplementation of guard logic.

### Key Components
- **`scripts/pi/sync-prompts-pi.cjs`**: reuses `sync-prompts.cjs`'s command-discovery walk (skip `assets/`, `scripts/`, `fixtures/`, `README.md`, `*.contract.md`); emits `.pi/prompts/<flattened-name>.md` pointer stubs; `--check`/write modes.
- **`scripts/pi/sync-agents-pi.cjs`**: reads `.opencode/agents/*.md` frontmatter + body; maps OpenCode's `permission:{read,write,edit,bash,...}` block to a pi-subagents `tools:` array, `mode`/other fields to pi-subagents' `description`/`model`/etc.; emits `.pi/agents/<name>.md`; `--check`/write modes.
- **`.pi/extensions/*.ts`**: one file per guard-core (spec-gate-enforce equivalent, mcp-route-guard equivalent, task-dispatch-guard equivalent, session-start equivalent — matching the set cursor/devin already wire), each a plain `ExtensionFactory` calling the shared core module with the SAME fail-open try/catch shape.

### Data Flow
`.opencode/agents/*.md` / `.opencode/commands/**/*.md` (canonical sources, read-only) -> generator script -> `.pi/agents/*.md` / `.pi/prompts/*.md` (generated output) -> live `pi` session (verification). For extensions: real Pi lifecycle event -> `.pi/extensions/*.ts`'s `pi.on()` handler -> shared guard-core module (same code path 3 other runtimes already use) -> allow/deny decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm live: 36 commands, 13 agents, this worktree's `.pi/` state, phase 008's guard-core-to-event mapping table.
- [x] Read `sync-prompts.cjs`/`sync-agents.cjs` in full to extract the exact reusable discovery-walk logic and `--check`/write-mode pattern.

### Phase 2: Core Implementation
- [x] Author `sync-prompts-pi.cjs`; generate all 36 `.pi/prompts/*.md` stubs; run `--check`.
- [x] Author `sync-agents-pi.cjs`; generate all 13 `.pi/agents/*.md` files; run `--check`.
- [x] Author `.pi/extensions/*.ts` (one per guard-core), delegating to the shared core modules.
- [x] Author `scripts/pi/README.md` documenting both generators.
- [x] Add the confirmed `.pi/agents/**/*.md` convention to `cli-pi/references/agent-delegation.md`.

### Phase 3: Verification
- [x] Live-dispatch at least one flattened command via a real `pi` session.
- [x] Live-parse-check at least one translated agent.
- [x] Live-load at least one extension, confirm no startup error.
- [x] GLM-5.2 independent review of the diff; address findings.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift check | Both generators report clean after generation | `sync-prompts-pi.cjs --check`, `sync-agents-pi.cjs --check` |
| Live dispatch | At least 1 command, 1 agent, 1 extension | Real `pi -p`/`--offline` session in this worktree |
| Independent review | Full diff | GLM-5.2 via `devin -p --model glm-5.2` |
| Structural | This phase folder | `validate.sh --strict` (main-tree round-trip) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `005-pi-command-layer`, `006-pi-agent-bridge`, `008-pi-hook-extension-layer` | Internal | Complete/Blocked-with-real-findings | This phase executes their designs; a design gap would surface as a live-verification failure |
| `sync-prompts.cjs`/`sync-agents.cjs` (existing) | Internal | Present, currently drifted for Codex (unrelated, not touched here) | Pattern precedent only; drift doesn't block reuse |
| This worktree's real `.pi/` state | Internal | Present (phases 001/007) | Live verification unavailable without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A generated file is malformed, a live dispatch corrupts `.pi/settings.json`, or GLM-5.2 flags a real guard-logic defect.
- **Procedure**: `git checkout -- <path>` for the specific malformed file (all new files, so a simple `rm`/revert is safe); re-run the generator; re-verify before re-committing.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `../005-pi-command-layer/`, `../006-pi-agent-bridge/`, `../008-pi-hook-extension-layer/` (own the designs)
