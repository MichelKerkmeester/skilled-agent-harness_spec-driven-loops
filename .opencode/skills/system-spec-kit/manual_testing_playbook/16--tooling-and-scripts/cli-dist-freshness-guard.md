---
title: "429 -- CLI Dist-Freshness Guard Trip"
description: "Manual check that a CLI shim refuses a stale dist entrypoint with exit 69 and a rebuild instruction, that the per-system dev-override env restores pass-through, and that the trip is fully reversible via content restore."
version: 3.6.0.2
---

# 429 -- CLI Dist-Freshness Guard Trip

## 1. OVERVIEW

This scenario verifies the dist-freshness guard in the CLI shims. Each shim computes a content hash (SHA256 over its sorted source surface) and compares it to the dist-side fingerprint written at build time; when they differ it refuses to run stale output with exit 69 (`EXIT_PROTOCOL`) plus a rebuild instruction, so an operator can never silently exercise an outdated CLI. When the fingerprint file is missing or corrupt, the guard falls back to a conservative source-vs-dist mtime check, fail-closed. Per-system development overrides (`SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`) turn the refusal into pass-through.

The test trips the guard reversibly: it backs up the source file, appends a content change so its hash no longer matches the dist fingerprint, observes the refusal and the override, then restores the exact original content — no rebuild needed and no lasting host impact. An mtime-only `touch` does NOT trip the content-hash guard while a valid fingerprint exists; a real content change is required.

## 2. SCENARIO CONTRACT

- Objective: Confirm the stale-dist refusal (exit 69), the dev-override pass-through, and clean restoration.
- Real user request: `If I edit the CLI source and forget to rebuild, will the shim run the old build behind my back?`
- Prompt: `Trip the spec-memory dist-freshness guard reversibly, confirm exit 69 plus the rebuild message, confirm the dev override, then restore.`
- Expected execution process: Back up source, append a content change, run `list-tools` (refusal), rerun with the override env (pass), restore exact content, rerun clean (pass).
- Expected signals: Exit 69 with `dist entrypoint is stale` on the tripped run; exit 0 under the override; exit 0 after restore.
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

- `tripped exit=69` with stderr `spec-memory dist entrypoint is stale. Run npm run build --workspace=@spec-kit/mcp-server.`
- `override exit=0`.
- `restored exit=0` with no rebuild having run.

### Evidence

Shell transcript with the three exit codes and the stale-dist stderr line.

### Pass / Fail

- **Pass**: 69 → 0 (override) → 0 (restored), with the rebuild instruction printed on the trip.
- **Fail**: the tripped run executes anyway, exits with a different code, the override does not bypass, or the restored run still trips.

### Failure Triage

A restored run that still exits 69 means the restore was not byte-exact, or another tracked source (for spec-memory: `tool-schemas.ts`, files under `schemas/`) genuinely differs from the dist fingerprint — rebuild instead of restoring. An untripped first run means the content append did not land (source hash unchanged) or the override env leaked into the shell.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/16--tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source describing the shim guards |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/spec-memory.cjs` | `ensureFreshDist` guard, exit 69, `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE` |
| `.opencode/bin/code-index.cjs` | Same guard for code-index, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` |
| `.opencode/bin/skill-advisor.cjs` | Recursive source-tree mtime guard, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 429
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-dist-freshness-guard.md`
