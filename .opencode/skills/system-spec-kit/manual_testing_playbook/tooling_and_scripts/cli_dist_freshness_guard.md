---
title: "429 -- CLI Dist-Freshness Guard Trip"
description: "Manual check that a CLI shim refuses a stale dist entrypoint with exit 69 and a rebuild instruction, that the per-system dev-override env restores pass-through, and that the trip is fully reversible via content restore."
version: 3.6.0.3
---

# 429 -- CLI Dist-Freshness Guard Trip

## 1. OVERVIEW

This scenario verifies the dist-freshness guard in the CLI shims. All three shims (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) call the shared `checkPackageFreshness()` helper in `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`, the same module that backs `validate.sh`'s compiled-orchestrator backstop (see the companion scenario for that check) and the warn-only Claude Code hook and OpenCode plugin. Staleness is decided by a pure mtime comparison: the newest mtime among the package's watched source files versus the mtime of its compiled dist entry (`newestSourceMtime > distMtime`). When the source is newer, the shim refuses with exit 69 (`EXIT_PROTOCOL`) plus a rebuild instruction, so an operator can never silently exercise an outdated CLI.

A SHA256 content hash over the watched source files is written lazily into a small cache file next to the dist entry (e.g. `dist/.dist-freshness-<package>-<suffix>.json`) purely as a same-session performance short-circuit: if a later check finds the same content hash already cached, it reports fresh without re-checking mtime at all. This cache is not pre-warmed by any build script -- it is written only by the runtime check itself, and only on a fresh pass -- so a clean checkout or the first check against a given source state always falls through to the authoritative mtime comparison. One consequence worth knowing (directly verified): a bare `touch` (mtime bump, no content change) does NOT re-trip the guard once a matching cache entry already exists for that exact content, but the identical `touch` DOES trip the guard when no matching cache entry exists yet, because mtime alone decides staleness in that case.

The test trips the guard reversibly: it backs up the source file, appends a content change so it is genuinely newer than the dist entry, observes the refusal and the override, then restores the exact original content — no rebuild needed and no lasting host impact. If the restored run still refuses (no matching cache entry for the original content on this host), `touch` the dist entry to clear it without rebuilding. Per-system development overrides (`SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`) turn the refusal into pass-through.

## 2. SCENARIO CONTRACT

- Objective: Confirm the stale-dist refusal (exit 69), the dev-override pass-through, and clean restoration.
- Real user request: `If I edit the CLI source and forget to rebuild, will the shim run the old build behind my back?`
- Prompt: `Trip the spec-memory dist-freshness guard reversibly, confirm exit 69 plus the rebuild message, confirm the dev override, then restore.`
- Expected execution process: Back up source, append a content change, run `list-tools` (refusal), rerun with the override env (pass), restore exact content, rerun clean (pass).
- Expected signals: Exit 69 with `dist is stale` on the tripped run; exit 0 under the override; exit 0 after restore.
- Desired user-visible outcome: Stale builds are loudly refused with the exact rebuild command, never silently executed.
- Pass/fail: PASS only when all three phases behave as expected and the source content is restored byte-exact.

## 3. TEST EXECUTION

### Prompt

```text
Trip the spec-memory dist-freshness guard reversibly, confirm exit 69 plus the rebuild message, confirm the dev override, then restore.
```

### Commands

```bash
SRC=.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts
BAK=$(mktemp); cp "$SRC" "$BAK"                                  # exact content backup
printf '\n// freshness probe: content change to trip the hash gate (reverted below)\n' >> "$SRC"

node .opencode/bin/spec-memory.cjs list-tools --format json >/dev/null; echo "tripped exit=$?"
SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs list-tools --format json >/dev/null; echo "override exit=$?"

cp "$BAK" "$SRC"; rm -f "$BAK"                                   # restore exact content (hash matches again)
node .opencode/bin/spec-memory.cjs list-tools --format json >/dev/null; echo "restored exit=$?"
```

The same recipe applies to `code-index.cjs` (source `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts`, override `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`) and `skill-advisor.cjs` (source `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts`, override `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`).

### Expected

- `tripped exit=69` with stderr `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`
- `override exit=0`.
- `restored exit=0` with no rebuild having run.

The same three phases apply with the equivalent messages for `code-index.cjs` (`@spec-kit/system-code-graph dist is stale. Run: cd .opencode/skills/system-code-graph && npm run build`) and `skill-advisor.cjs` (`@spec-kit/system-skill-advisor dist is stale. Run: cd .opencode/skills/system-skill-advisor/mcp_server && npm run build`). All three exit 69 tripped / 0 overridden / 0 restored — only the message wording differs per package.

### Evidence

BLOCKED before executing the Commands block.

Required scenario commands would write outside the allowed scenario file:

```bash
SRC=.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts
BAK=$(mktemp); cp "$SRC" "$BAK"                                  # exact content backup
printf '\n// freshness probe: content change to trip the hash gate (reverted below)\n' >> "$SRC"
cp "$BAK" "$SRC"; rm -f "$BAK"                                   # restore exact content (hash matches again)
```

User-provided constraint for this run:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/cli_dist_freshness_guard.md (this file only)
```

The scenario also has no `### Preconditions` section to satisfy before the write-requiring Commands block.

### Pass / Fail

- **BLOCKED**: The scenario's required Commands block cannot be executed under this run's allowed-write constraint because it must append to and restore `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts`, plus create/remove a temporary backup file outside the allowed write path.

### Failure Triage

A restored run that still exits 69 means the restore was not byte-exact — confirm `git diff` on the source file is empty — or another tracked source (for spec-memory: `tool-schemas.ts`, files under `schemas/`) genuinely changed and is newer than the compiled dist output; rebuild instead of restoring. If the diff is clean but the restored run still refuses, the on-disk hash cache next to the dist entry has no matching entry for the restored content yet; `touch` the dist entry (e.g. `dist/spec-memory-cli.js`) so its mtime is newer than the restored source and re-run — no rebuild required. An untripped first run means the content append did not land (source unchanged) or the override env leaked into the shell.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md` | Feature-catalog source describing the shim guards |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` | Shared `checkPackageFreshness()` module: mtime comparison, lazy same-session hash cache, `DIST_PACKAGES` registry (7 watched packages) |
| `.opencode/bin/spec-memory.cjs` | `ensureFreshDist` guard, exit 69, `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE` |
| `.opencode/bin/code-index.cjs` | Same guard for code-index, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` |
| `.opencode/bin/skill-advisor.cjs` | Same guard for skill-advisor, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 429
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/cli_dist_freshness_guard.md`
