---
title: "Goal: Phase 10: dsh-mcp-code-mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh mcp code mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/010-dsh-mcp-code-mode"
    last_updated_at: "2026-11-06T07:54:24Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; keyless stderr and default-off case remain open."
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
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: dsh-mcp-code-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A dsh dispatch gets the repo's Code Mode MCP server, guarded and cleanly shut down, only when it adds `.dsh/patches/mcp-code-mode.patch.yml`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The MCP patch mounts exactly one `@deepseek-ai/dsh-mcp-client` row, `code_mode` over stdio, running `.skilled/bin/mcp-code-mode-launcher.cjs` with `UTCP_CONFIG_FILE` in its `env`, the repo root as `cwd` and an explicit `startupTimeoutMs` |
| D2 | The `mcp-route-guard` adapter is mounted from the MCP patch, so it exists only when MCP does |
| D3 | Launcher cleanup is proven by comparing the `mcp-code-mode-launcher` PID set before and after the run, because other runtimes keep their own launchers alive |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `--dump-config` under a disposable `DSH_HOME` piped to `grep -c 'dsh-mcp-client'` prints 1 with `.dsh/patches/mcp-code-mode.patch.yml` and 0 without it
- [ ] A keyless run with the MCP patch exits 1 with `MISSING_CREDENTIAL`, stderr shows no MCP startup failure and `comm -13` of the launcher PID lists from before and after the run prints nothing
- [ ] A `node --test` case over `.dsh/plugins/repo-guards/` passes only when an `mcp__code_mode__*` tool outside the allowlist is denied
- [ ] The runtime's vitest run of `tests/unit/executor-config.vitest.ts` passes with cases for the `cli-deepseek-harness` MCP capability and MCP off when no server is requested
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 10 opt-in Code Mode MCP | Built, verification open | The patch dump has one `code_mode` row with the patch and none without. The route-guard deny test passes in the 37/0 bundle run, and executor-config vitest passes 112/112. Strict validation prints `RESULT: PASSED` with 0 errors and 0 warnings (`tasks.md:66`). The env block is derived from the patch because the dump excerpt omits it. The 07:59 keyless run predates bundle edits and stderr has a manual registration error. Evidence: `evidence/dump-config-mcp.txt`, `evidence/keyless-mcp-boot.txt`, `evidence/executor-config-vitest.txt`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| Launcher cleanup check | The phase plan's bare `pgrep -f mcp-code-mode-launcher` check finds four launchers from other runtimes on 2026-11-06, so the criterion compares PID sets instead |
| Route guard mount point | D2 says the adapter is mounted from the MCP patch, so it exists only when MCP does. `index.mjs` registers it on every guards load. Without the MCP patch no `mcp__*` tool exists, so the guard never fires. T004 stays open. |
| Route guard fail policy | The worker brief said fail-open. Spec CHK-012 says the route guard denies when its core throws, so the adapter is `fail-closed`. The spec prevailed. |
| Stderr line in the keyless MCP run | The run's stderr holds `Error during batch registration for manual 'webflow'`. The evidence ties it to a token variable the scrubbed environment lacks. AC-003 and T009 stay open until the operator rules whether this counts as an MCP startup error. |
| Default-off case missing | The vitest suite asserts the capability and the refusal for other kinds. No case asserts that `cli-deepseek-harness` defaults to no MCP. AC-005 and T006 stay open. |
| Bundle changed during the closeout | Another process edited six adapters and both test files between 08:18:28 and 08:18:55. The keyless MCP run predates those edits, so it needs a rerun. |
| Code Mode child environment | `references/mcp.md:68` says UTCP loads the repository `.env` and passes values to its child. dsh does not receive those keys. This accepted behavior was recorded without opening any `.env` file. |
<!-- /ANCHOR:log -->
