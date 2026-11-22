---
title: "Skill Advisor Install + Setup Guide"
description: "Bootstrap, verification, runtime hooks, local scorer, rollback, operator notes and reference commands for the daemon-backed skill advisor CLI."
version: 1.0.7.0
---

# Skill Advisor Install + Setup Guide

This is the canonical install + setup guide for the Skill Advisor. The advisor runs as a resident daemon reached through one CLI front door, `node .skilled/bin/skill-advisor.cjs`, and owns its own SQLite database and scoring stack. It exposes nine commands: the eight public ones `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status` and `skill_graph_validate`, plus the trusted-caller-only `skill_graph_propagate_enhances`. The Python local scorer at `runtime/scripts/skill_advisor.py` answers `advisor_recommend` when the daemon is unreachable. This document merges the previously-separate `SET-UP_GUIDE.md` (runtime hooks, rollback CLI, operator states, reference commands) into the install bootstrap so there is a single source of truth.

---

## 0. AI-FIRST SETUP GUIDE

Copy and paste this prompt to your AI assistant to get setup help:

```
I want to set up the Skill Advisor from .skilled/skills/system-skill-advisor/runtime

Please help me:
1. Verify Node.js, npm and python3 are installed
2. Install dependencies and build the advisor runtime
3. Confirm the @spec-kit/shared package is linked (a missing link breaks the build)
4. Verify the advisor CLI answers: node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
5. Confirm the prompt-time brief appears on a work-intent prompt

Guide me through each step with the exact commands I need to run.
```

Your AI assistant will:
- Verify Node.js, npm and python3 are available
- Install and build the advisor runtime
- Check the `@spec-kit/shared` dependency link
- Confirm the CLI answers and the prompt-time brief arrives

**Expected setup time:** 3-5 minutes

---

## 1. OVERVIEW

The advisor is a TypeScript package under `.skilled/skills/system-skill-advisor/runtime/`, served through one CLI front door at `.skilled/bin/skill-advisor.cjs`. The CLI exposes 9 commands (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` and the trusted-only `skill_graph_propagate_enhances`) and reaches the resident daemon over a unix socket. The package owns the handlers, schemas, tools, launcher, plus the package-local SQLite DB at `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`. The Python scorer at `runtime/scripts/skill_advisor.py` is called in production: the CLI runs it when the daemon is unreachable and marks the answer degraded. Nothing registers per runtime, because the prompt-time hooks and the OpenCode plugin ship with the repository.

---

## 2. PREREQUISITES

- Node.js and npm for the advisor runtime.
- `python3` on PATH: the local scorer and the graph scripts are Python.
- Repository root as the working directory.
- No runtime configuration: the prompt-time hooks and the OpenCode plugin are committed, and there is no MCP registration step.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless you are intentionally testing rollback.
- The local shared package at `.skilled/skills/system-spec-kit/shared` is present; `npm install` links it into `runtime/node_modules/@spec-kit/shared`.

---

## 3. INSTALLATION

The package ships source, not build output, so build it once:

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Verify the local shared package link exists. Missing this link breaks the build with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`.

```bash
test -e .skilled/skills/system-skill-advisor/runtime/node_modules/@spec-kit/shared && echo "shared dependency linked"
```

That is the whole install. The CLI starts the daemon on first use, so there is nothing to register or start by hand.

---

## 4. VERIFICATION

Verify the CLI answers:

```bash
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --format json
node .skilled/bin/skill-advisor.cjs advisor_validate --confirm-heavy-run true --format json
```

The first two answer in about a second. `advisor_validate --confirm-heavy-run true` runs the heavier validation bundle and takes around ten seconds.

Expected:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata and freshness trust.
- `advisor_rebuild` rebuilds stale, absent or unavailable advisor state and returns before/after freshness diagnostics.
- `advisor_validate` returns real corpus, holdout, parity, safety and latency measurements.

---

## 5. PACKAGE CHECKS

Run before declaring setup complete:

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run typecheck
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node -e "import('./.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes/lexical.js')"
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/handlers/advisor-recommend.vitest.ts tests/compat/shim.vitest.ts --reporter=default
```

For routing accuracy, run the validator and treat its JSON output as the baseline. One call returns the corpus, holdout, parity, safety and latency slices:

```bash
node .skilled/bin/skill-advisor.cjs advisor_validate --confirm-heavy-run true --format json
```

---

## 6. RUNTIME HOOKS AND PLUGIN

The prompt-time brief ships with the repository, so there is nothing to register:

| Runtime | Hook Surface |
| --- | --- |
| Claude Code | `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, with the runtime shim at `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` |
| Codex and Devin | shims at `.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` and `.../devin/user-prompt-submit.ts`, which delegate to the Claude shim |
| Cursor | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts` |
| Pi | `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, loaded as a Pi extension through the entry file at `.pi/extensions/prompt-advisor.ts` that imports it |
| OpenCode | `.opencode/plugins/system-skill-advisor.js` |

Every surface ends at the same stable entrypoint, the CLI:

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "<request>" --format json
```

The CLI attaches to the daemon, starts it when the socket is cold and falls back to the Python local scorer when the daemon stays unreachable. The OpenCode plugin spawns this same CLI with a bounded timeout and fails open on expiry or exit `75`.

---

## 7. COMPAT SHIMS

`runtime/scripts/skill_advisor.py` is the advisor's local scorer. The CLI runs it in production whenever `advisor_recommend` cannot reach the daemon, and the answer it returns is marked degraded rather than live. Called directly, it probes the advisor first and falls back to local scoring when the probe is unavailable.

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin
```

Mode meanings:

| Mode | Behavior |
| --- | --- |
| default | Probe the advisor. Use it when live or stale. Otherwise score locally with Python. |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require the advisor and fail prompt-safely when it is unavailable. |
| `--force-local` | Bypass the advisor and score locally. |

Testing controls:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this context"
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "save this context"
```

Prompt-time surfaces run the same scorer, which is why a shim smoke test doubles as a hook smoke test. There is no plugin bridge or MCP client in the chain: the hooks and the OpenCode plugin shell out to `.skilled/bin/skill-advisor.cjs`, and the CLI starts the daemon through `.skilled/bin/system-skill-advisor-launcher.cjs` when the socket is cold.

---

## 8. ROLLBACK

Use rollback only long enough to diagnose or recover the daemon path.

| Control | Scope |
| --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables prompt-time advisor briefs and makes the CLI and the scorer skip advisor work. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Forces the Python local scorer instead of the daemon, in the shim and in the CLI's compat checks. |
| `--force-local` | Python scorer flag: bypass the advisor and score locally. |
| `--force-native` | Python scorer flag: require the advisor and fail prompt-safely. |

```bash
# Disable prompt-time advisor surfaces and native recommendation output.
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1

# Keep hooks enabled but force Python compatibility where supported.
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1

# CLI-only Python path.
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "your prompt"
```

Unset variables after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

---

## 9. OPERATOR CHECKS

`skill_graph_*` commands are served by the advisor daemon and reached through the CLI; the command ids are stable.

Use `advisor_status` as the prompt-safe health source:

```bash
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
```

State interpretation:

| State | Meaning | Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted | No action. |
| `stale` | Source files are newer than graph state | Run `skill_graph_scan` or restart the watcher. |
| `absent` | Graph state is missing | Rebuild from source; `advisor_recommend` should return an empty fail-open set. |
| `unavailable` | Status cannot be read | Inspect daemon logs and rebuild source state. |
| `degraded` | Runtime can only provide limited trust | Follow OP-001 in the manual playbook. |
| `quarantined` | Malformed skill metadata was isolated | Follow OP-002 in the manual playbook. |

Manual recovery scenarios live at:

```text
.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
```

### Indexer scan-vs-index counts

`skill_graph_scan` reports two numbers: `scannedFiles` (every `graph-metadata.json` discovered) and `indexedFiles` (real skills indexed into SQLite). The delta is normally 1 or 2 files. The indexer skips `scripts/test-fixtures/*/graph-metadata.json` (test scaffolding) and emits a `NON-SKILL-METADATA: skipped` warning. A larger delta means real skills are being filtered, so inspect the warning list.

H5 operator scenarios live in the manual playbook under `operator-h5/`.

---

## 10. TROUBLESHOOTING

| What You See | Cause | Fix |
| --- | --- | --- |
| Build or CLI startup fails with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared` | The advisor package is installed but the local shared package link is missing from `runtime/node_modules`. | Run `npm --prefix .skilled/skills/system-skill-advisor/runtime install` then `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`. |
| The brief says `Advisor: stale`, or `advisor_recommend` returns `degraded: true` | The daemon was unreachable, so the CLI answered from the Python local scorer. | A degraded answer is usable. Check `python3` is on PATH and retry; pass `--warm-only` to make the CLI fail instead of degrading. |

---

## 11. REFERENCE COMMANDS

```bash
# Build and typecheck the runtime package
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
npm --prefix .skilled/skills/system-skill-advisor/runtime run typecheck

# Advisor health and recommendation through the CLI
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "create a pull request on github" --format json

# Trusted graph mutation
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json

# Python local scorer, direct
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "create a pull request on github"
printf '%s' "save this conversation context to memory" | \
  python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin

# Native required
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this context"

# Python fallback required
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "save this context"

# Regression compatibility
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py \
  --dataset .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl
```

---

## 12. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Operator overview, quick start, runtime integrations. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Package-local architecture and public API entrypoints. |
| [Hook reference](./hooks/skill-advisor-hook.md) | Prompt-time hook surfaces for each runtime. |
| [Manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) | OP-001 / OP-002 operator scenarios + indexer edge cases. |

---

## 13. TUNING THE ADVISOR

Installation makes the advisor run; tuning makes it route *your* skills accurately. The advisor scores each prompt against every skill's `graph-metadata.json` signals plus the scorer lane tables (`TOKEN_BOOSTS`, `PHRASE_BOOSTS`, `CATEGORY_HINTS`). There are two tuning paths — a fast signal-only loop and the full gated workflow.

### 13.1 Quick tuning (no rebuild) — recommended for external clones

Most "match my setup" needs are signal additions, not lane-weight changes:

1. Edit `intent_signals` (and optionally `derived.trigger_phrases` / `derived.key_topics`) in the per-skill `graph-metadata.json`:
   ```bash
   $EDITOR .skilled/skills/<name>/graph-metadata.json
   ```
2. Re-index the SQLite graph — REQUIRED, or the edit has ZERO effect on routing:
   - Trusted CLI: `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`
3. Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "your test phrase" --format json` — your skill should now appear.

> **Critical:** the advisor reads scoring inputs from `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`, NOT from `graph-metadata.json` directly. Editing JSON without re-indexing produces identical pre-edit scores.

### 13.2 Full tuning: `/doctor:skill-advisor tune`

For batch optimization across all skills plus lane-weight tuning, run the gated doctor workflow:

| Use case | Command |
| --- | --- |
| First-time tuning / re-tune after adding a skill | `/doctor:skill-advisor tune` |
| Preview without writing | `/doctor:skill-advisor tune --dry-run` |
| Tune one lane only | `/doctor:skill-advisor tune --scope=explicit` (or `derived` / `lexical`) |
| Skip post-apply tests (not recommended) | `/doctor:skill-advisor tune --skip-tests` |

Five phases gated behind operator approval: Discovery → Analysis → Proposal → Apply → Verify. Phase 3 (Apply) rebuilds `dist/`, runs `skill_graph_scan`, runs the advisor test suite, and writes a per-run rollback script. Full reference: `.skilled/commands/doctor/skill-advisor.md` and `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml`.

### 13.3 What tuning touches

Mutates only:

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (`TOKEN_BOOSTS`, `PHRASE_BOOSTS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` (`CATEGORY_HINTS`)
- `.skilled/skills/<name>/graph-metadata.json` (`intent_signals`, `derived.trigger_phrases`, `derived.key_topics`)

Never touches any `SKILL.md` content, `weights-config.ts`, the fusion scorer, or daemon code. Any MANUAL edit to these files (e.g. the Quick-tuning recipe above) requires a re-index (`skill_graph_scan`) — the SQLite graph is the runtime source of truth.

### 13.4 Tuning rollback

`/doctor:skill-advisor tune` Phase 3 writes a per-run rollback script at `<packet_scratch>/rollback-<timestamp>.sh` (under `<spec-folder>/scratch/` or `.skilled/scratch/`). The script restores only the files that run modified, preserves unrelated WIP and rebuilds the package at the end. Prefer it over a broad `git checkout HEAD -- ...`, which would discard unrelated WIP.

If the per-run script is unavailable (the run failed before Phase 3 completed), stash unrelated WIP first, then restore from HEAD and rebuild:

```bash
git stash push -m "skill-advisor-rollback-safety" -- \
  .skilled/skills/system-skill-advisor/runtime/lib/ \
  .skilled/skills/*/graph-metadata.json

git restore --source=HEAD -- \
  .skilled/skills/system-skill-advisor/runtime/lib/ \
  .skilled/skills/*/graph-metadata.json

npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```
