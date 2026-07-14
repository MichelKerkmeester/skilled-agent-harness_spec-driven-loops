---
title: "Implementation Summary: Codex command parity — sync-prompts.cjs + thin router-prompts"
description: "Implementation summary for the Codex command parity phase: a fail-closed sync-prompts.cjs generator mirroring sync-agents.cjs, 37 repo-tracked thin router-prompts, --check GREEN, with the ~/.codex install deferred to operator confirmation."
trigger_phrases:
  - "codex command parity summary"
  - "sync-prompts implementation"
  - "codex prompt parity evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude"
    recent_action: "In-repo deliverable complete + committed c1771fbbf3; --check GREEN; install deferred"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child, then rolls up the parent"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-codex-command-parity |
| **Completed** | 2026-07-14 (in-repo deliverable; `~/.codex` install deferred) |
| **Level** | 2 |
| **Commit** | `c1771fbbf3` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Durable, gated Codex COMMAND parity that mirrors the existing agent-TOML sync — correcting the parent packet's original premise that Codex commands were TOML. Codex commands are markdown prompts (invoked `/<name>` with `$ARGUMENTS` substitution); TOML is only the Codex agent format, already handled in phase 002.

Two things were produced:

1. **`sync-prompts.cjs`** — a new generator at `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`, a 1:1 structural mirror of `sync-agents.cjs`. It resolves `REPO_ROOT` from `__dirname`, uses only node builtins (`node:fs`, `node:path`), walks `.opencode/commands/**/*.md` (excluding the `assets`/`scripts`/`fixtures` directories and skipping `README.md` and `*.contract.md`), and exposes a `--check` drift mode that emits `MISSING`/`STALE`/`EXTRA` and sets `process.exitCode = 1` on any drift (fail-closed).

2. **`.codex/prompts/` (37 thin router-prompts)** — one generated markdown prompt per in-scope command, flat-hyphenated (`design/motion.md` → `design-motion.md`). Each prompt is a THIN ROUTER: it names its canonical `.opencode/commands/<path>` as the single source of truth and forwards `$ARGUMENTS`. It does NOT duplicate the command body, so the OpenCode command stays authoritative and the Codex surface cannot drift from it.

The generated tree is repo-tracked, making parity reviewable and enforceable rather than living only in the user's home directory.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Precedent-first: identify the agent-TOML sync (`sync-agents.cjs`) as the structural template, correct the TOML-vs-markdown premise, then author `sync-prompts.cjs` to the same shape but with a thin-router render instead of a TOML render. Run the generator to materialize the tree, prove `--check` GREEN, confirm the thin-router shape on a sample, and commit the generator plus the derived tree. All work was done in the worktree `.worktrees/0041-skilled-command-agent-canon`; the main tree was untouched. The user-HOME install was deliberately not performed (see Known Limitations and `decision-record.md` ADR-002).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Thin router-prompts, not body duplication | Keeps `.opencode/commands/**` the single source of truth and makes drift structurally impossible (the prompt carries no command logic). See ADR-001. |
| Mirror `sync-agents.cjs` structurally | Reuses a proven, gated pattern (`__dirname` REPO_ROOT, `--check` drift mode) instead of a bespoke generator. |
| Flat-hyphenated prompt names | Matches the existing `~/.codex/prompts/` flat convention and the repo's hyphen-naming direction. |
| Defer the `~/.codex/prompts/` install + symlink repair | Those are user-HOME mutations over pre-existing files; deferred to explicit operator confirmation. See ADR-002. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Generator present + structural mirror | CONFIRMED: `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` resolves `REPO_ROOT` via `__dirname`, uses only `node:fs`/`node:path`, and exposes `--check`. |
| `--check` in sync (GREEN) | CONFIRMED: `node …/codex/sync-prompts.cjs --check` printed `[codex-prompt-sync] PASS: 37 prompts are in sync.` and exited 0. |
| Prompt count | CONFIRMED: `.codex/prompts/*.md` = 37 files. |
| Thin-router shape | CONFIRMED (sample): `.codex/prompts/design-motion.md` points at `.opencode/commands/design/motion.md`, forwards `$ARGUMENTS`, and inlines no command body. |
| Fail-closed drift | CONFIRMED by code inspection: `checkOutputs()` records `STALE`/`MISSING`/`EXTRA` and `main()` sets `process.exitCode = 1` on drift. The implementing session additionally reported a hand-edit reproducing `STALE` + exit 1 (session evidence). |
| Commit | CONFIRMED: `c1771fbbf3` — `feat(codex): add sync-prompts.cjs and 37 thin router-prompts for command parity`. |
| Main tree untouched | CONFIRMED: all changes are in the worktree; the commit scopes only `sync-prompts.cjs` + `.codex/prompts/`. |
| `~/.codex/prompts/` install | DEFERRED (not performed): operator confirmation required; broken `create` symlink left in place (`../../.opencode/command/create`, target absent). |
| Strict spec validation | INFERRED / PENDING: `validate.sh --strict` for this child is run by the orchestrator, not in this session. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **User-home install deferred.** The 37 prompts are NOT yet installed into `~/.codex/prompts/`, and the stale `create` symlink (`~/.codex/prompts/create -> ../../.opencode/command/create`, singular "command", target absent) is NOT yet repaired. Both are user-HOME mutations over pre-existing files from an older flat convention and wait on explicit operator confirmation (ADR-002). The in-repo tree + `--check` gate are complete and committed regardless.
2. **CI wiring not built.** Enforcing `sync-prompts.cjs --check` in CI is a plausible parent-level follow-on (mirrors the agent-sync gate); it is out of scope here.
3. **Fail-closed proof is code-confirmed plus session-reported.** The drift-to-exit-1 path is confirmed by reading `checkOutputs()` / `main()`; the empirical hand-edit reproduction is reported by the implementing session rather than re-run here (re-running would require mutating a tracked file).

### Rollback

Revert commit `c1771fbbf3` to remove `sync-prompts.cjs` and the `.codex/prompts/` tree. No user-home state was mutated (the install was deferred), so no home-directory reversal is needed and the change is a single clean repo revert.

<!-- /ANCHOR:limitations -->
