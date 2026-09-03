# Implementation Summary: Fix Doctor Bootstrap Symlink Restart Loop

> **Spec:** `./spec.md` | **Date:** 2026-06-08 | **Status:** Complete & verified

---

## What Changed

`.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` (versioned surface +
Public mirror, kept byte-identical).

### Before

Three layout branches, each setting `restart_required=true`, including a third branch that
created the `.opencode/skill -> skills` symlink whenever it was simply missing:

```bash
elif [[ -d "$SKILLS_DIR" && ! -e "$LEGACY_SKILL_DIR" ]]; then
  ln -s skills "$LEGACY_SKILL_DIR"
  restart_required=true
  record_action "created compatibility symlink .opencode/skill -> skills"
fi
```

### After

Branch 3 removed. Migration branches keep their directory `mv` but no longer create a symlink
or force a restart:

```bash
if [[ ! -d "$SKILLS_DIR" && -d "$LEGACY_SKILL_DIR" && ! -L "$LEGACY_SKILL_DIR" ]]; then
  mv "$LEGACY_SKILL_DIR" "$SKILLS_DIR"
  record_action "promoted legacy .opencode/skill directory to .opencode/skills"
elif [[ -d "$SKILLS_DIR" && -d "$LEGACY_SKILL_DIR" && ! -L "$LEGACY_SKILL_DIR" ]]; then
  backup="$OPENCODE_DIR/skill_legacy_backup_$(date -u +%Y%m%dT%H%M%SZ)"
  mv "$LEGACY_SKILL_DIR" "$backup"
  record_action "moved stray legacy .opencode/skill directory to ${backup#$ROOT/}"
fi
```

The `--help` usage text was updated from "Creates the legacy bridge" to "Migrates a legacy
directory". The dist-build branch's `restart_required=true` is retained (a freshly built MCP
server genuinely needs re-registration).

## Why

Whenever `.opencode/skill` was absent, branch 3 re-created it and forced
`STATUS=RESTART_REQUIRED` on `/doctor:update`, before any database rebuild could start.
Nothing depends on the singular path — all launchers and MCP configs resolve the plural
`.opencode/skills/` directly — so the symlink is an unnecessary compatibility shim and
recreating it must never gate a restart.

## Evidence

**Singular-path audit** — only matches were prose in `graph-metadata.json` `causal_summary`
fields; `.mcp.json`, `opencode.json`, and `mk-spec-memory-launcher.cjs:80` all use the plural
path.

**Before fix** — bootstrap run returned:
```json
{ "status": "complete", "restart_required": true,
  "actions": ["created compatibility symlink .opencode/skill -> skills"] }
```

**After fix** — bootstrap run returned:
```json
{ "status": "complete", "restart_required": false, "actions": [] }
```
…and `.opencode/skill` was not recreated.

## Verification

| Check | Result |
| --- | --- |
| `bash -n` (both copies) | PASS |
| `diff` both copies | IDENTICAL (sync invariant held) |
| Live bootstrap run | `restart_required:false`, `actions:[]`, no symlink |
| Remaining `restart_required=true` | 1 occurrence — the dist-build branch only |

## Follow-ups

- No git commit/push performed (repository git policy is read-only for the assistant). Commit
  commands for both repos are provided in the session handoff.
- The `RESTART CONTRACT` text in `doctor_update.yaml` / command markdown was intentionally left
  unchanged — still accurate for the build-restart case.
