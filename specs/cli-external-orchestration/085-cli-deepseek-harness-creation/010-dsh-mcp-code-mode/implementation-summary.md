---
title: "Implementation Summary"
description: "Phase 10 added an opt-in Code Mode MCP patch, an mcp-route-guard adapter and the kind's MCP capability. The dump evidence and both unit suites pass. The keyless MCP run has one open question about its stderr, and it predates the current bundle."
trigger_phrases:
  - "dsh mcp code mode implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/010-dsh-mcp-code-mode"
    last_updated_at: "2026-11-06T07:54:24Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; keyless stderr and default-off test remain open."
    next_safe_action: "Resolve AC-003 and add the default-off case."
    blockers: ["phase 008 open", "AC-003 unresolved", "default-off case missing"]
    key_files: [".dsh/patches/mcp-code-mode.patch.yml", ".dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs", "evidence/dump-config-mcp.txt", "evidence/keyless-mcp-boot.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-010-dsh-mcp-code-mode"
      parent_session_id: null
    completion_pct: 45
    open_questions: ["Does a Code Mode manual registration error count as an MCP startup failure under AC-003?"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-dsh-mcp-code-mode |
| **Status** | In Progress: built, verification open |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dsh dispatch gets the repo's Code Mode server only when it adds `.dsh/patches/mcp-code-mode.patch.yml`. The dump without the patch has no MCP row. No run without the patch tested launcher startup.

- **The patch.** One `@deepseek-ai/dsh-mcp-client` row with `serverName: code_mode`, `transport: stdio` and `command: node`. It runs `.skilled/bin/mcp-code-mode-launcher.cjs`, passes `env: UTCP_CONFIG_FILE: .utcp_config.json`, and sets `startupTimeoutMs: 60000`. Its `cwd` is an expression that finds the checkout from the patch's own `--patch` path, because a dispatch runs outside the checkout.
- **The route guard.** `adapters/mcp-route-guard.mjs` acts on `tools/pre-execute` for `mcp__*` tools. It denies a `code_mode` tool outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`. It also denies when the shared core throws (`ERROR_POLICY` is `fail-closed`), and it turns a core routing warning into a deny reason, because dsh has no advisory channel at that seam.
- **The capability.** `executor-config.ts` lists `cli-deepseek-harness` as MCP-capable, with `code_mode` as the only server in its roster (capability map near line 739, roster near line 747). Other kinds still refuse a non-empty `liveTools.mcpServers`, and the refusal text now names both per-lineage kinds.
- **The runner wiring.** `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (lines 3159 to 3165) adds the MCP patch only for a lineage that names `code_mode`, and it refuses any other name.
- **The docs.** `references/mcp.md` in the cli-deepseek-harness packet describes the patch, its env, the cwd rule and the observed shutdown. `.dsh/SYNC.md` names the patch and its env.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/patches/mcp-code-mode.patch.yml` | Created in this phase | The one `code_mode` row |
| `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs` | Created in this phase | The route guard adapter |
| `.dsh/plugins/repo-guards/tests/mcp-route-guard.test.mjs` | Created in this phase | Allow, deny, kill switch, ignore, throw and parity cases |
| `.dsh/plugins/repo-guards/index.mjs` | Modified in this phase | Registers the route guard |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified in this phase | The kind's MCP capability and roster |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified in this phase | Capability and refusal cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified in this phase | Adds the patch for a lineage that names `code_mode` |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md` | Modified in this phase | Patch, env and shutdown contract |
| `.dsh/SYNC.md` | Modified in this phase | Names the MCP patch and its env |
| `evidence/dump-config-mcp.txt`, `evidence/keyless-mcp-boot.txt` | Created in this phase | Dump and keyless run records |
| `evidence/executor-config-vitest.txt` | Created in the closeout pass | The vitest run at 112 of 112 |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md` (LOG and continuity only) | Edited in the closeout pass | Status and evidence for this phase |

The skip for the optional doctor rows (T007) is recorded here. No `doctor-mcp-*.yaml` file gained a dsh row, so the MCP doctor does not yet check dsh.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order the checks ran:

1. Dump without the MCP patch, with the route, lineage and guards patches (`evidence/dump-config-mcp.txt`, line 2): exit 0, 0 `dsh-mcp-client` rows, empty stderr.
2. Dump with the MCP patch added (`evidence/dump-config-mcp.txt`, line 3): exit 0, 1 `dsh-mcp-client` row, `serverName: code_mode`, empty stderr.
3. Keyless MCP run (captured 07:59). Exit 1 with `MISSING_CREDENTIAL`. The launcher PID comparison is empty. The server logged its own shutdown (`CodeMode-MCP shutting down: stdin closed`). Evidence: `evidence/keyless-mcp-boot.txt`. The probe history in that file records one earlier defect: the first walk-up cwd fell back to the scratch folder and the launcher failed with `MODULE_NOT_FOUND`. The patch now finds the root from its own `--patch` path.
4. Route guard cases. The MCP test file runs 6 of 6 in the 08:19 bundle snapshot (`../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`).
5. Executor config. `node_modules/.bin/vitest run tests/unit/executor-config.vitest.ts` in the runtime folder exited 0 with 112 of 112 passing (`evidence/executor-config-vitest.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The route guard is `fail-closed` | Spec CHK-012 says the route guard denies when its core throws. The worker brief had asked for fail-open. The spec prevailed, and this is recorded as a deviation in `goal.md` section 4. |
| The MCP patch is the only switch | dsh has no per-dispatch MCP flag and starts servers eagerly, so composition is the only opt-in. The guards and lineage patches never mount MCP. |
| Launcher cleanup compares PID sets | Four `mcp-code-mode-launcher` processes from other runtimes were already running on 2026-11-06, so a bare `pgrep` after the run could not prove cleanup. |
| The route guard registers from the bundle, not from the MCP patch (build choice, not revisited here) | The build registers the adapter in `index.mjs`, as the phase brief directed. D2 asks for a mount from the MCP patch, so the two differ. Without the MCP patch no `mcp__*` tool exists, so the guard never fires. The gap is recorded in `goal.md` section 4 and T004. |
| The optional doctor rows are skipped | The rows are optional, and the MCP doctor has no dsh rows yet. The skip is recorded here, as T007 allows. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `--dump-config` with the patch, `grep -c 'dsh-mcp-client'` | 1 (`evidence/dump-config-mcp.txt`, line 3). `serverName` and `transport` shown in the excerpt. The `env` block follows from the patch row (derived) |
| `--dump-config` without the patch | 0 (`evidence/dump-config-mcp.txt`, line 2) |
| Keyless MCP run | Exit 1 and `MISSING_CREDENTIAL`. PID comparison empty. Recorded at 07:59, before the 08:02 to 08:18 bundle edits |
| Stderr of the keyless MCP run | One line, `Error during batch registration for manual 'webflow'`, which the evidence ties to a missing token variable under the scrubbed environment. Whether this counts as an MCP startup error is an operator question (AC-003) |
| Route-guard deny case (`tests/mcp-route-guard.test.mjs` lines 58 to 76) | Passes. MCP file 6 of 6 at the 08:19 snapshot |
| Executor config vitest | 112 of 112 pass (`evidence/executor-config-vitest.txt`). No default-off case for the kind (AC-005) |
| Docs name the patch | `rg -l 'mcp-code-mode.patch.yml'` lists `.dsh/SYNC.md` and `references/mcp.md` |
| Strict validation | `RESULT: PASSED`, 0 errors and 0 warnings after the final closeout edits |

Concurrent change: another process edited six adapters and both test files between 08:18:28 and 08:18:55, during this closeout. The keyless MCP run predates those edits.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No live tool call. This phase proves mount, guard and shutdown without a provider key. Phase 013's keyed runs did not use the MCP patch, so whether a model reaches `mcp__code_mode__*` tools through dsh stays UNKNOWN.
2. The startup-timeout path (CHK-023) and the run without the MCP patch (CHK-022) were not exercised.
3. Lint and format checks for the adapter and config change (CHK-010) were not run.
4. The stderr question in AC-003 is open. This summary does not decide it.
5. `references/mcp.md:68` says Code Mode's UTCP config loads the repository `.env` and passes its values to the child process. dsh does not receive those keys. This accepted behavior was recorded without opening any `.env` file.
6. **Why the status stays In Progress.** T001, T002, T004, T006, T009, CHK-003, CHK-010, CHK-011, CHK-020, CHK-022 and CHK-023 stay open. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal. The repo-guards plugin and patches these rows name are being extended by the separate DSH hook-parity work, which re-verifies them there.
<!-- /ANCHOR:limitations -->

---
