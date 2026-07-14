---
title: "Implementation Plan: Codex command parity — sync-prompts.cjs generator + repo-tracked thin router-prompts"
description: "Plan for building sync-prompts.cjs as a 1:1 structural mirror of sync-agents.cjs, generating 37 thin router-prompts into a repo-tracked .codex/prompts/ tree, and gating drift with --check. The ~/.codex/prompts/ install and stale-symlink repair are deferred to operator confirmation."
trigger_phrases:
  - "codex command parity plan"
  - "sync-prompts generator plan"
  - "codex prompt drift gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude"
    recent_action: "Built + verified sync-prompts.cjs and 37 prompts; --check GREEN; committed c1771fbbf3"
    next_safe_action: "Orchestrator runs validate.sh --strict; ~/.codex install deferred"
---
# Implementation Plan: Codex command parity — sync-prompts.cjs generator + repo-tracked thin router-prompts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS, node builtins only), Markdown |
| **Framework** | OpenCode command surface, Codex Desktop prompt convention (`/<name>` + `$ARGUMENTS`) |
| **Storage** | Repo-tracked `.codex/prompts/` markdown tree; canonical source `.opencode/commands/**` |
| **Testing** | `sync-prompts.cjs --check` drift gate; code inspection of the drift branches; commit-scoped review |

### Overview
Add one generator that mirrors the existing agent-TOML sync. `sync-prompts.cjs` resolves `REPO_ROOT` from `__dirname`, walks `.opencode/commands/**/*.md` (excluding `assets`/`scripts`/`fixtures` dirs, `README.md`, `*.contract.md`), and renders one thin router-prompt per command into `.codex/prompts/<flat-hyphenated>.md`. Each prompt names the canonical command path and forwards `$ARGUMENTS`; no body is duplicated. A `--check` mode compares the expected set against disk and fails closed on `MISSING`/`STALE`/`EXTRA`. The generated tree is repo-tracked. Installing into `~/.codex/prompts/` and repairing the stale `create` symlink are deferred to operator confirmation.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| Premise correction | Codex commands are MARKDOWN prompts (invoked `/<name>`, `$ARGUMENTS`), not TOML; TOML is only the Codex agent format (owned by phase 002). |
| Precedent | `sync-agents.cjs` supplies the exact structural shape (`REPO_ROOT` via `__dirname`, `--check` drift mode) to mirror for commands. |
| Source inventory | `.opencode/commands/**/*.md` minus `assets`/`scripts`/`fixtures`, `README.md`, `*.contract.md` resolves to 37 command files. |
| Home-dir state | `~/.codex/prompts/` carried drifted flat files and a broken `create` symlink → `../../.opencode/command/create` (singular, absent) — deferred, not touched. |

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] TOML-vs-markdown premise resolved (commands are markdown prompts).
- [x] Mirror precedent identified (`sync-agents.cjs`).
- [x] Source-set exclusion rules defined (`assets`/`scripts`/`fixtures`, `README.md`, `*.contract.md`).

### Definition of Done
- [x] `sync-prompts.cjs` exists and mirrors `sync-agents.cjs` structurally, with a fail-closed `--check`.
- [x] 37/37 prompts generated into a repo-tracked `.codex/prompts/` tree.
- [x] `sync-prompts.cjs --check` returns GREEN (exit 0).
- [x] Prompts are thin routers (no body duplication) forwarding `$ARGUMENTS`.
- [ ] `~/.codex/prompts/` install + `create` symlink repair — DEFERRED (operator confirmation).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generator-with-drift-gate, mirroring the agent-TOML sync: a single source of truth (`.opencode/commands/**`) projected into a derived, repo-tracked runtime tree (`.codex/prompts/**`) that a `--check` mode keeps honest.

### Key Components
- **Generator**: `sync-prompts.cjs` — `listCommandFiles()` (recursive walk + exclusions), `toFlatName()` (`design/motion.md` → `design-motion`), `renderPrompt()` (thin router text), `buildExpectedOutputs()`, `checkOutputs()` (drift), `writeOutputs()` (materialize).
- **Derived tree**: `.codex/prompts/*.md` — one thin router per command, generated-by header, canonical-path pointer, `$ARGUMENTS` passthrough.
- **Gate**: `--check` — compares expected vs on-disk, prints `MISSING`/`STALE`/`EXTRA`, sets `process.exitCode = 1` on drift; prints `PASS: N prompts are in sync.` otherwise.

### Data Flow
Default run: read `.opencode/commands/**` → build expected prompt map → write changed/new files, unlink extras → report count. Check run: read `.opencode/commands/**` → build expected map → diff against `.codex/prompts/**` → GREEN or fail closed. The thin-router design means the prompt bodies carry no command logic, so the only thing `--check` must protect is presence + the fixed router text, not divergent command content.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Build the generator
- [x] Author `sync-prompts.cjs` mirroring `sync-agents.cjs`: `REPO_ROOT` via `__dirname`, node builtins, recursive source walk with the exclusion set, flat-hyphenated naming, thin-router render, and a `--check` drift mode.

### Phase 2: Generate the repo-tracked tree
- [x] Run the generator to materialize 37 thin router-prompts into `.codex/prompts/`.
- [x] Confirm each prompt points at its canonical `.opencode/commands/<path>` and forwards `$ARGUMENTS` (no body duplication).

### Phase 3: Gate and commit
- [x] Run `sync-prompts.cjs --check` → GREEN (exit 0).
- [x] Confirm fail-closed behavior via the drift branches (`STALE`/`MISSING`/`EXTRA` → `process.exitCode = 1`).
- [x] Commit the generator + tree (`c1771fbbf3`); leave `~/.codex/prompts/` install deferred.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift gate (in sync) | Committed `.codex/prompts/` tree | `node …/codex/sync-prompts.cjs --check` → GREEN exit 0 |
| Drift gate (fail-closed) | Hand-edited prompt | `--check` → `STALE` + exit 1 (per drift logic) |
| Thin-router audit | A sampled prompt (`design-motion.md`) | Read: canonical-path pointer + `$ARGUMENTS`, no inlined body |
| Structural mirror | `sync-prompts.cjs` vs `sync-agents.cjs` | Code inspection: `__dirname` REPO_ROOT, node builtins, `--check` shape |
| Spec validation | This packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` (run by the orchestrator) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/commands/**` canonical tree | Internal source | Available | Generator has no input to project |
| `sync-agents.cjs` | Structural precedent | Available | Mirror shape must be re-derived |
| Node.js runtime (builtins only) | Toolchain | Available | Generator cannot run |
| Operator confirmation | External decision | Pending | Gates only the deferred `~/.codex/prompts/` install + symlink repair, not the in-repo deliverable |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the generator or generated tree proves incorrect, or the parity approach is abandoned.
- **Procedure**: revert commit `c1771fbbf3` to remove `sync-prompts.cjs` and the `.codex/prompts/` tree. No user-home state was mutated (the install was deferred), so no home-directory reversal is required.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Build generator) -> Phase 2 (Generate tree) -> Phase 3 (Gate + commit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Build generator | Source inventory + mirror precedent | Generate tree |
| Generate tree | Generator | Gate + commit |
| Gate + commit | Generated tree | Parent rollup (004) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Build generator | Low (mirror of existing script) | ~1 hour |
| Generate tree | Low | ~15 min |
| Gate + commit | Low | ~30 min |
| **Total** | | **~2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration required.
- [x] Change is additive (one new script + one new derived tree); no existing runtime path altered.
- [x] User-home state untouched (install deferred), so rollback is a single repo revert.

### Rollback Procedure
1. Revert commit `c1771fbbf3`.
2. Confirm `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` and `.codex/prompts/` are removed.
3. No `~/.codex/prompts/` cleanup needed — nothing was installed there.

<!-- /ANCHOR:enhanced-rollback -->
