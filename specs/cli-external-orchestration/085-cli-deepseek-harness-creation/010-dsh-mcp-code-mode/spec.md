---
title: "Feature Specification: Phase 10: dsh-mcp-code-mode"
description: "dsh has no MCP mount for the repo's Code Mode server, and the executor config lets only cli-hermes name MCP servers per lineage. This optional phase adds a separate mcp-code-mode patch with one code_mode stdio row, an mcp-route-guard adapter and the kind's MCP capability, so MCP is opt-in per dispatch and never leaks inherited secrets."
trigger_phrases:
  - "dsh mcp code mode"
  - "phase 10 dsh mcp code mode"
  - "dsh mcp patch"
  - "dsh mcp-route-guard"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: dsh-mcp-code-mode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 15 |
| **Predecessor** | 009-dsh-context-guards-and-goal-bridge |
| **Successor** | 011-hub-registration-and-routing |
| **Handoff Criteria** | `--dump-config` shows exactly one `code_mode` row with the MCP patch and none without it, the keyless MCP run leaves no new launcher process and the route-guard and executor-config tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Optional phase. One `.dsh/patches/mcp-code-mode.patch.yml` that mounts a single `@deepseek-ai/dsh-mcp-client` row for `code_mode`, the `mcp-route-guard` adapter in the repo-guards bundle, the kind's MCP capability in `executor-config.ts` and the docs. No other MCP server and no per-dispatch MCP flag, because dsh has none.

**Dependencies**:
- `004-dsh-runtime-folder-and-patches` for `.dsh/patches/` and `.dsh/SYNC.md`
- `006-deep-loop-executor-kind` for the `cli-deepseek-harness` kind in `executor-config.ts`
- `008-dsh-repo-guards-safety-wave` for the repo-guards bundle the route guard joins

**Deliverables**:
- `.dsh/patches/mcp-code-mode.patch.yml`
- The `mcp-route-guard` adapter and its test in `.dsh/plugins/repo-guards/`
- The kind's MCP capability entry and test in `executor-config.ts` and `executor-config.vitest.ts`
- The packet's `references/mcp.md` and `.dsh/SYNC.md` updated, and optional `doctor-mcp-*.yaml` rows
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi mounts Code Mode from `.pi/mcp.json` with `lifecycle: lazy`, but dsh reads MCP only from patch rows, starts servers eagerly and strips ambient names matching `KEY`, `PASSWORD`, `SECRET` or `TOKEN` from the child env. Without a separate patch, MCP would either be missing from dsh or mounted in every fan-out leaf, and a launcher that needs an unlisted variable would fail or be orphaned. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:274-278]

### Purpose
A dispatch that adds `--patch .dsh/patches/mcp-code-mode.patch.yml` gets one guarded `code_mode` server with explicit env, cwd and timeouts, and a dispatch without it gets no MCP at all.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .dsh/patches/mcp-code-mode.patch.yml 2>&1
ls: .dsh/patches/mcp-code-mode.patch.yml: No such file or directory
$ rg -n "only cli-hermes names MCP servers" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
730:        message: `liveTools.mcpServers is not supported by executor kind '${config.kind}'; only cli-hermes names MCP servers per lineage`,
$ pgrep -f mcp-code-mode-launcher | wc -l
       4
```

The four launcher processes belong to other runtimes' sessions already running on this machine, so a bare `pgrep` after the keyless run cannot prove cleanup. The check compares the launcher PID set before and after the run instead.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write `.dsh/patches/mcp-code-mode.patch.yml` with one `@deepseek-ai/dsh-mcp-client` row: `serverName: code_mode`, `transport: stdio`, `command: node`, `args: [.skilled/bin/mcp-code-mode-launcher.cjs]`, `env` naming `UTCP_CONFIG_FILE`, `cwd` the repo root and an explicit `startupTimeoutMs`.
- Add an `mcp-route-guard` adapter on `tools/pre-execute` for `mcp__.*` tools that calls `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` and is mounted only with the MCP patch.
- Add the kind's MCP capability entry in `executor-config.ts` so MCP stays off unless a server is requested.
- Update the packet's `references/mcp.md` and `.dsh/SYNC.md`, and optionally add `.skilled/commands/doctor/assets/doctor-mcp-*.yaml` rows.

### Out of Scope
- Any MCP server besides `code_mode` - the packet's `mcp-opt-in-only` rule names one opt-in server.
- Mounting MCP in the guards or lineage patch - MCP stays a separate composition step.
- Live tool calls through `code_mode` with a model - that needs a provider key and belongs to phase 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/patches/mcp-code-mode.patch.yml` | Create | One `code_mode` stdio row |
| `.dsh/plugins/repo-guards/` (`mcp-route-guard` adapter and test) | Create | Denies `mcp__code_mode__*` tools outside the allowlist |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | MCP capability for `cli-deepseek-harness` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Capability and default-off assertions |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md` | Modify | Patch, env and shutdown contract |
| `.dsh/SYNC.md` | Modify | Names the MCP patch with mechanism and source |
| `.skilled/commands/doctor/assets/doctor-mcp-*.yaml` | Modify (optional) | dsh rows for the MCP doctor |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--dump-config` under a disposable `DSH_HOME` with the MCP patch shows exactly one `@deepseek-ai/dsh-mcp-client` row (`serverName: code_mode`, `transport: stdio`, `env` naming `UTCP_CONFIG_FILE`), and without the patch shows none |
| REQ-002 | A keyless run with the MCP patch exits 1 with `MISSING_CREDENTIAL` and no MCP startup failure on stderr, and the `mcp-code-mode-launcher` PID set after the run equals the set before it |
| REQ-003 | A route-guard test denies an `mcp__code_mode__*` tool outside the allowlist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The executor-config test asserts the kind's MCP capability and that MCP stays off when no server is requested |
| REQ-005 | `references/mcp.md` and `.dsh/SYNC.md` name `mcp-code-mode.patch.yml` and the env it passes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c 'dsh-mcp-client'` on the dump with the MCP patch prints 1 and on the dump without it prints 0.
- **SC-002**: `comm -13` of the sorted launcher PID lists from before and after the keyless MCP run prints nothing.
- **SC-003**: The route-guard and executor-config tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 executor kind | No kind to give an MCP capability | Start the executor-config task only after phase 006 tests pass |
| Risk | Eager startup and a scrubbed env drop what the launcher needs | Med: startup fails or hangs | Name every needed variable in the row `env` and set `startupTimeoutMs` explicitly |
| Risk | The launcher process is orphaned after the run | Med: leaked processes across fan-out lineages | Before and after PID comparison in REQ-002 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Code Mode startup is bounded by the row's explicit `startupTimeoutMs`.
- **NFR-P02**: N/A for throughput, because one dispatch mounts at most one server.

### Security
- **NFR-S01**: The row's `env` names only `UTCP_CONFIG_FILE` plus any variable the launcher proves it needs, and never a key value.
- **NFR-S02**: Server instructions joined to the system prompt are treated as data.

### Reliability
- **NFR-R01**: No launcher process outlives the dispatch that started it.
- **NFR-R02**: A dispatch without the MCP patch has no MCP row and no launcher.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a dispatch without the MCP patch shows no `dsh-mcp-client` row and starts no launcher.
- Maximum input: server instructions join the system prompt as literal text up to 32 KiB, so `references/mcp.md` tells the dispatcher to treat them as data.
- Failure path: a launcher that does not start within `startupTimeoutMs` surfaces an MCP startup error on stderr, which fails REQ-002.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One patch, one adapter, one config entry and two docs |
| Risk | 12/25 | Env scrubbing and process lifetime |
| Research | 8/20 | Stdio probe and `ctx.tools.restrict()` coverage are open |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does Code Mode pass the stdio probe and shut down cleanly with only `UTCP_CONFIG_FILE` set? This phase answers it with the keyless run. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:395]
- What does `ctx.tools.restrict()` cover across nested agents and MCP tools? This phase answers it in part, and live coverage waits for phase 013. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:396]
<!-- /ANCHOR:questions -->

---

