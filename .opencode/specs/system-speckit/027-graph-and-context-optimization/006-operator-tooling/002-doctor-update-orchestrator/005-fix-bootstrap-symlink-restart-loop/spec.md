# Feature Specification: Fix Doctor Bootstrap Symlink Restart Loop

> **Parent:** `027-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`
> **Level:** 1 (single-file behavior fix, < 100 LOC)
> **Date:** 2026-06-08
> **Status:** Implemented

---

## 1. Problem

`/doctor:update` never reached its database rebuild. Phase 0 (`doctor-runtime-bootstrap.sh`)
re-created the legacy `.opencode/skill -> skills` compatibility symlink whenever it was
absent and set `restart_required=true`. Whenever that symlink was not present, every run
re-created it and emitted `STATUS=RESTART_REQUIRED` before any database work could begin —
an unbreakable restart loop. The operator was told to restart and rerun with
`--resume-bootstrap`, but the next run hit the same branch again and the loop repeated.

## 2. Root Cause

`doctor-runtime-bootstrap.sh` had three layout branches, each setting `restart_required=true`:

1. Promote a real legacy `.opencode/skill` directory into `.opencode/skills` (+ symlink).
2. Back up a stray real `.opencode/skill` directory (+ symlink).
3. **Create the `.opencode/skill -> skills` symlink whenever it was simply missing.**

Branch 3 fired whenever the symlink was absent. The compatibility symlink is unnecessary:
every runtime launcher and MCP config resolves the canonical plural path `.opencode/skills/`
directly (verified in `.mcp.json`, `opencode.json`, `mk-spec-memory-launcher.cjs`). The only
references to the singular `.opencode/skill/` path are prose inside spec `graph-metadata.json`
`causal_summary` fields — not runtime path resolution.

## 3. Scope

**In scope**

- `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` (both the versioned
  surface `Barter-BV/ai-speckit` and the Public mirror
  `opencode--spec-kit-skilled-agent-orchestration`, kept byte-identical).

**Behavior change**

- The redundant symlink-creation branch is removed.
- The two genuine legacy-directory migration branches keep their `mv` (data move) but no
  longer create a compatibility symlink and no longer force a restart on a layout move alone.
- The legitimate post-*build* restart is retained: when `mcp_server/dist` is missing and gets
  built, MCP tools genuinely need re-registration, so `restart_required=true` still fires.

**Out of scope**

- The `RESTART CONTRACT` text in `doctor_update.yaml` / command markdown — still correct for
  the build case; left unchanged.
- The Phase 8 `directory_layout_bridge` migration path in the YAML (separate, signal-gated
  mechanism that only runs during an explicit migration).

## 4. Requirements

- **R1** — A cloud-synced repo with the v3.4 plural layout MUST complete Phase 0 with
  `restart_required=false` and proceed to the dependency rebuild without a process restart.
- **R2** — No `.opencode/skill` compatibility symlink is created by the bootstrap.
- **R3** — A genuine fresh install (missing `dist`) MUST still report `restart_required=true`
  via the build step.
- **R4** — Both repository copies of the script remain byte-identical.

## 5. Acceptance

- `bash -n` passes on both copies.
- Running the bootstrap against the current layout yields
  `"restart_required": false, "actions": []` and does not create `.opencode/skill`.
- The only remaining `restart_required=true` in the script is the dist-build branch.
