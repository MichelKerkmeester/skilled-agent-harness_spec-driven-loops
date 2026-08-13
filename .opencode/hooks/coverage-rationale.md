---
title: "Hook Coverage Rationale: Why a Runtime Lacks a Concern"
description: "Explains, per concern, why a runtime has no adapter for it — so an absent <concern>/<runtime>/ folder reads as by-design, not a gap. Companion to the README coverage matrix."
trigger_phrases:
  - "why does only opencode have this hook"
  - "why doesnt this runtime have this hook"
  - "hook coverage rationale"
  - "missing runtime adapter by design"
  - "uneven hook coverage explained"
importance_tier: "important"
contextType: "reference"
---

# Hook Coverage Rationale: Why a Runtime Lacks a Concern

The hub's runtime coverage is intentionally uneven; this explains why a given concern has no adapter for a given runtime, so a missing folder reads as by-design.

---

## 1. OVERVIEW

### Principle

A missing `<concern>/<runtime>/` folder is deliberate, not an oversight. Runtimes expose different lifecycle events and host different plugin models, so each concern is implemented **wherever it can be and should be** — never mechanically mirrored across all six. Every absence falls into one of the reason classes in Section 2.

The per-cell authority is the **Coverage matrix in [`README.md`](./README.md)** (`✓ covered` / `by-design` / `n/a` / `~ partial` / `unverified`). This doc names the *reason* behind each absence and walks through every asymmetric concern.

---

## 2. REASON CLASSES

Each absence is one of these:

- **Plugin-owned** — The behavior is inherently an OpenCode plugin's job; no other runtime hosts an equivalent, and those runtimes reach the outcome another way.
- **Folded-in** — The behavior exists on the runtime but is embedded inside another hook rather than a separately-indexed adapter.
- **Owned-elsewhere** — The runtime implements the concern in a different layer, so the concern's own folder has no entry for it.
- **Native-surface-bound** — The feature only ships on runtimes whose native surface supports it.
- **Target-not-host** — The runtime is what the hook acts *on*, not a place the hook runs *from*.
- **Runtime-agnostic** — The hook is git-level, not per-editor-runtime, so it has no runtime subfolders at all.
- **Shared-adapter** — Editor runtimes share one adapter (a `shared/` or `.opencode/bin` script) instead of per-runtime copies. This is a folder-shape difference, not a coverage gap.
- **No-capable-event** — The runtime exposes no event able to implement the concern (or its feasibility is unverified), so no adapter is wired.
- **No-surface** — The runtime has no equivalent surface for the concern at all.

---

## 3. PER-CONCERN RATIONALE

Only concerns with uneven coverage appear here. The six covered on all runtimes — `completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`, `skill-advisor`, and `spec-gate` — are omitted because there is nothing to explain.

**`spec-memory`** — present only on **opencode**; absent on claude, codex, cursor, devin, and pi. *Plugin-owned.* Continuity retrieval is the `mk-spec-memory` OpenCode plugin. The other runtimes recover continuity through their `session-lifecycle` hooks plus the Spec-Kit Memory MCP, so they need no separate spec-memory adapter.

**`session-lifecycle`** — present on claude, codex, cursor, devin, and pi; absent on **opencode**. *Owned-elsewhere.* In OpenCode, session start/stop/compact events run **inside** the owning `mk-*` plugins (`mk-spec-memory`, `mk-goal`, and so on), so there is no standalone session-lifecycle adapter — it is indexed under those plugins instead.

**`codex-watchdog`** — present only on **opencode**; absent on the rest. *Plugin-owned.* It audits Codex's hook installation from OpenCode's plugin layer; no other runtime hosts that watchdog.

**`directive-lifecycle`** — present only on **claude**; absent on codex, cursor, devin, opencode, and pi. *Folded-in.* Only Claude carries a separately-indexed boundary adapter. The others fold directive de-dup into their shared `user-prompt-submit` lifecycle — `prompt-advisor.ts` for Pi, `mk-skill-advisor` state for OpenCode.

**`goal`** — present on cursor, opencode, and pi; absent on claude, codex, and devin. *Native-surface-bound.* Goal state ships only on the native session-bound goal surfaces; claude/codex/devin have no goal surface to bind to.

**`hook-install`** — present on claude, cursor, and devin; absent on codex, opencode, and pi. *Target-not-host.* The installer reconciles the repo hook set **into** Codex's user-global hook file — Codex is the install target, not a host — and it runs from the editor runtimes. OpenCode and Pi manage their own hooks.

**`permission-policy`** — present only on **devin**; absent on claude, codex, cursor, opencode, and pi. *No-capable-event.* Only Devin exposes a dedicated `permission-request` event. Claude and Codex shape permission via `PreToolUse` decisions, and the rest have no separate approval event.

**`task-dispatch`** — present on claude, cursor, devin, opencode, and pi; absent on **codex**. *No-capable-event.* Codex has `PreToolUse` but no confirmed agent-spawn tool event, so no adapter is wired. (Pi's coverage is `~ partial` — it intercepts direct `subagent` calls only.)

**`worktree-guard`** and **`git-hooks-check`** — present on claude, codex, cursor, and devin; absent on opencode and pi. *Shared-adapter / No-surface.* Each is a single shared script in `.opencode/bin` (`worktree-guard.sh`, `check-git-hooks.sh`) invoked by the four editor runtimes' hook systems. OpenCode (plugins) and Pi (extensions) don't run these git-workflow shell guards.

**`dist-freshness`** — present on claude, codex, cursor, devin, and opencode; absent on **pi**. *Plugin-owned / No-surface.* The OpenCode plugin owns the real source→dist freshness projection; the four editor runtimes carry the lightweight startup `check-dist-staleness.sh`; Pi has no build-artifact surface to check.

**`session-cleanup`** — present on claude, codex, cursor, devin, and opencode; absent on **pi**. *No-surface.* A shared teardown `.sh` for the editor runtimes plus the OpenCode plugin; Pi has no equivalent bounded-teardown hook.

**`git-preflight`** — covered on **all six**, so this is not a gap. *Shared-adapter.* The four editor runtimes share one `shared/git-preflight-advisory.mjs` rather than four identical subfolders; opencode and pi have runtime-specific adapters. A folder scan shows only `opencode/` and `pi/` subfolders because the editor adapter lives in `shared/`.

**`git` (commit hooks)** — no runtime subfolders at all. *Runtime-agnostic.* `pre-commit`, `pre-push`, and `commit-msg` are git-level hooks installed into `.git/hooks` (or `core.hooksPath`), not per-editor-runtime adapters, so this concern has no runtime subfolders by nature.

---

## 4. RELATED

- [`README.md`](./README.md) — the coverage matrix (per-cell authority) and the directory tree.
- [`injection-contract.md`](./injection-contract.md) — what each hook actually injects, per event and channel.
