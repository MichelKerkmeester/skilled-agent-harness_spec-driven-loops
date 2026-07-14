---
title: "Feature Specification: Codex command parity — repo-tracked thin router-prompts + a fail-closed sync-prompts.cjs generator mirroring the agent-TOML sync"
description: "Establish durable Codex command parity: a new sync-prompts.cjs generator (1:1 structural mirror of sync-agents.cjs) that renders one thin router-prompt per OpenCode command into a repo-tracked .codex/prompts/ tree with a --check drift gate. Codex COMMANDS are markdown prompts (not TOML — TOML is the Codex agent format), so each prompt points at its canonical .opencode/commands/<path> and passes $ARGUMENTS through rather than duplicating the body. The ~/.codex/prompts/ install + stale-symlink repair are deferred to operator confirmation (user-home blast radius)."
trigger_phrases:
  - "codex command parity prompts"
  - "sync-prompts.cjs generator"
  - "codex thin router prompts"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude"
    recent_action: "Built sync-prompts and 37 thin router-prompts; parity gate green"
    next_safe_action: "Orchestrator validates then defers the ~/.codex install"
---
# Feature Specification: Codex command parity — repo-tracked thin router-prompts + a fail-closed sync-prompts.cjs generator mirroring the agent-TOML sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` (worktree `.worktrees/0041-skilled-command-agent-canon`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Predecessor** | 002-agent-canon-conformance (agent-TOML sync + `sync-agents.cjs --check` gate that this phase mirrors for commands) |
| **Successor** | 004-integrate-validate-ship |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Agents already have durable, fail-closed dual-runtime sync: `sync-agents.cjs` converts the canonical OpenCode/Claude agent markdown into `.codex/agents/*.toml` and its `--check` mode gates drift. Codex COMMANDS had no equivalent. The parent packet's original premise assumed Codex commands were TOML like agents; that premise is wrong. Codex commands are MARKDOWN prompt files invoked as `/<name>` with `$ARGUMENTS` substitution, living in `~/.codex/prompts/`. There was no repo-tracked source for these prompts and no generator, so any Codex command surface would drift silently from the authoritative `.opencode/commands/` tree — the exact failure mode the agent sync was built to prevent. The user's home `~/.codex/prompts/` additionally carried 20 hand-drifted files from an older flat convention plus a broken `create` symlink pointing at a non-existent singular `.opencode/command/` path.

### Purpose
Establish durable, gated Codex command parity that mirrors the agent-TOML sync exactly, correcting the TOML premise. Build `sync-prompts.cjs` as a 1:1 structural mirror of `sync-agents.cjs` (node builtins only, `REPO_ROOT` resolved via `__dirname`, a `--check` drift mode). Generate one THIN router-prompt per OpenCode command into a repo-tracked `.codex/prompts/` tree: each prompt names its canonical `.opencode/commands/<path>` as the single source of truth and passes `$ARGUMENTS` through, so the OpenCode command body is never duplicated and Codex cannot drift from it. Repo-tracking the generated tree plus wiring `--check` makes the parity durable and enforceable. The user-HOME install (`~/.codex/prompts/`) and stale-symlink repair are intentionally deferred — they mutate pre-existing files outside the repo and wait on explicit operator confirmation.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new generator `sync-prompts.cjs` under the codex script directory, structurally mirroring `sync-agents.cjs` (same `REPO_ROOT`-via-`__dirname` shape, node builtins, `--check` drift mode emitting `MISSING`/`STALE`/`EXTRA` and setting `process.exitCode = 1` on any drift).
- Source discovery over `.opencode/commands/**/*.md`, excluding the `assets`/`scripts`/`fixtures` directories and skipping `README.md` and `*.contract.md`.
- A repo-tracked `.codex/prompts/` tree: one flat-hyphenated markdown prompt per command (e.g. `design/motion.md` → `design-motion.md`), each a thin router pointing at its canonical command and forwarding `$ARGUMENTS`.
- A drift gate: `sync-prompts.cjs --check` returns GREEN (exit 0) when in sync and fails closed (exit 1) on any `MISSING`/`STALE`/`EXTRA`.

### Out of Scope
- Duplicating or transforming command BODY content into the prompts — the prompts are routers, not copies; the OpenCode command stays authoritative.
- Installing prompts into the user's `~/.codex/prompts/` and repairing the stale `create` symlink — deferred to operator confirmation (user-home blast radius; see Open Questions and `decision-record.md` ADR-002).
- Codex AGENT parity (`.codex/agents/*.toml`, `sync-agents.cjs`) — owned by phase 002.
- CI wiring of the new `--check` gate — a parent-level follow-on, not built here.
- Command template-canon conformance of the `.opencode/commands/**` sources — owned by phase 001.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` | Create | md→codex-prompt generator; 1:1 structural mirror of `sync-agents.cjs`; `--check` drift mode |
| `.codex/prompts/*.md` (37 files) | Create | Repo-tracked thin router-prompts, one per in-scope OpenCode command, flat-hyphenated names |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- REQ-001: `sync-prompts.cjs` is a structural mirror of `sync-agents.cjs` — `REPO_ROOT` via `__dirname`, node builtins only (`node:fs`, `node:path`), and a `--check` drift mode that emits `MISSING`/`STALE`/`EXTRA` lines and sets `process.exitCode = 1` when any drift is present (fail-closed).
- REQ-002: All in-scope commands are generated (37/37) and `sync-prompts.cjs --check` returns GREEN (exit 0) with the tree present.
- REQ-003: Each generated prompt is a THIN router — it names its canonical `.opencode/commands/<path>` as the single source of truth and forwards `$ARGUMENTS`; it does NOT duplicate the command body.
- REQ-004: The `.codex/prompts/` tree is repo-tracked (committed), so parity is durable and reviewable rather than living only in the user's home directory.

### P1 - Required (complete OR user-approved deferral)
- REQ-005: The `~/.codex/prompts/` install of the 37 prompts and the repair of the stale `create` symlink are DEFERRED pending explicit operator confirmation (user-home blast radius). Tracked as the sole Open Question; the in-repo tree + `--check` gate are complete regardless.
- REQ-006: Naming and discovery match convention — flat-hyphenated prompt names (matching the existing `~/.codex/prompts/` flat convention and the repo's hyphen-naming direction), with `assets`/`scripts`/`fixtures` directories, `README.md`, and `*.contract.md` excluded from generation.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Acceptance Scenarios
- Given the generator, when `node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check` runs against the committed tree, then it prints `PASS: 37 prompts are in sync.` and exits 0.
- Given a hand edit to any generated prompt, when `--check` re-runs, then it reports that file as `STALE` and exits 1 (fail-closed) — confirmed by the drift logic (`STALE` detection sets `process.exitCode = 1`).
- Given a generated prompt (e.g. `design-motion.md`), when it is read, then it references `.opencode/commands/design/motion.md` as the source of truth and forwards `$ARGUMENTS` — no command body is inlined.
- Given the repo tree, when the commit is inspected, then `.codex/prompts/` and `sync-prompts.cjs` are tracked under commit `c1771fbbf3`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Home-directory mutation risk**: installing to `~/.codex/prompts/` and repairing the `create` symlink touch pre-existing user files from an older flat convention. Mitigation: those actions are deferred to explicit operator confirmation (REQ-005 / ADR-002); the in-repo deliverable does not depend on them.
- **Silent-drift risk**: without a gate, `.codex/prompts/` could diverge from `.opencode/commands/`. Mitigation: the thin-router design means prompts carry no body to drift, and `--check` fails closed on `MISSING`/`STALE`/`EXTRA`.
- **Source-set drift**: adding/removing an OpenCode command changes the expected prompt set. Mitigation: `--check` reports `MISSING`/`EXTRA` so the gate catches an un-regenerated tree; the exclusion set (`assets`/`scripts`/`fixtures`, `README.md`, `*.contract.md`) is encoded in the generator.
- **Dependency**: the canonical `.opencode/commands/**` tree is the generator's input; the mirrored `sync-agents.cjs` is the structural precedent this phase follows.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Deferred (operator confirmation required):** Should the 37 prompts be installed into the user's `~/.codex/prompts/`, and should the stale `create` symlink (currently a broken link → `../../.opencode/command/create`, singular "command", target absent) be repaired? Both are user-HOME mutations over pre-existing files from an older flat convention, so they are held pending explicit operator confirmation. The in-repo `.codex/prompts/` tree and the `--check` gate are complete and committed independent of this decision. See `decision-record.md` ADR-002.

<!-- /ANCHOR:questions -->
