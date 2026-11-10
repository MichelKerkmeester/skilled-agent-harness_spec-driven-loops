---
title: "Implementation Plan: Phase 10: dsh-mcp-code-mode"
description: "Add an opt-in .dsh/patches/mcp-code-mode.patch.yml with one code_mode stdio row, an mcp-route-guard adapter in the repo-guards bundle and the cli-deepseek-harness MCP capability in executor-config.ts, proven by dump-config, a keyless run with a launcher PID comparison and unit tests."
trigger_phrases:
  - "dsh mcp code mode plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: dsh-mcp-code-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML patch, TypeScript and JavaScript |
| **Framework** | dsh `@deepseek-ai/dsh-mcp-client` row in a Cordis patch, the repo-guards bundle and the deep-loop executor config |
| **Storage** | None |
| **Testing** | `--dump-config`, a keyless `dsh` run, `node --test` for the adapter and vitest for `executor-config.vitest.ts` |

### Overview
This phase adds one MCP patch, one guard adapter and one capability entry, so Code Mode reaches dsh only when a dispatch asks for it. The patch replaces `.pi/mcp.json` for dsh with explicit env, cwd and timeout, because dsh has no lazy lifecycle. Authoring is `sk-code` `sk-code-skilled` and the executor is `cli-codex gpt-6-luna xhigh fast`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: phases 004, 006 and 008 acceptance rows are Met

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The two `--dump-config` greps print 1 and 0, and the launcher PID comparison prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in composition patch. MCP exists in a dispatch only when the runner passes the MCP patch.

### Key Components
- **`mcp-code-mode.patch.yml`**: one `dsh-mcp-client` row that runs `node .skilled/bin/mcp-code-mode-launcher.cjs` over stdio with `UTCP_CONFIG_FILE=.utcp_config.json`.
- **`mcp-route-guard` adapter**: `tools/pre-execute` on `mcp__.*`, calling `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`, mounted from the MCP patch so it only exists when MCP does.
- **Executor capability**: the `cli-deepseek-harness` entry in `executor-config.ts` that lets a lineage request `code_mode` and keeps MCP off by default.

### Data Flow
The runner adds the MCP patch when a lineage requests `code_mode`. dsh starts the launcher at boot with the scrubbed env plus the row's `env`. Each `mcp__code_mode__*` call passes the route guard before it runs, and the launcher exits when the session disposes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is new behavior, not a fix, but it touches env handling and a shared policy table, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` MCP validation | Lets only `cli-hermes` name MCP servers per lineage | update for `cli-deepseek-harness` | `executor-config.vitest.ts` passes, existing kinds unchanged |
| `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Owns the MCP allowlist verdict | unchanged, imported only | `git diff --stat .skilled/hooks/mcp-route-guard` prints nothing |
| `.pi/mcp.json` | Pi's lazy Code Mode mount | not a consumer, unchanged | `git diff --stat .pi/mcp.json` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'mcpServers' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`.
- Consumers of changed symbols: `rg -n 'liveTools' .skilled/skills/system-deep-loop/runtime --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: patch present or absent by launcher started or not, four rows.
- Algorithm invariant: no lineage without the MCP patch starts a launcher.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the launcher PID baseline and the executor test baseline. Implementation writes the patch, the adapter and the capability. Verification runs the dumps, the keyless run and the tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Route-guard deny outside the allowlist, kind MCP capability and default off | `node --test` over the bundle, the runtime's vitest run of `tests/unit/executor-config.vitest.ts` |
| Integration | `--dump-config` with and without the MCP patch, keyless run with PID comparison | `dsh` 0.2.2-rc.1 under a disposable `DSH_HOME`, `pgrep -f mcp-code-mode-launcher` |
| Manual | Row env reviewed for any key value | `rg -n -i 'key\|secret\|token' .dsh/patches/mcp-code-mode.patch.yml` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 004, 006 and 008 | Internal | Yellow, planned | No patch folder, kind or bundle to extend |
| `.skilled/bin/mcp-code-mode-launcher.cjs` and `.utcp_config.json` | Internal | Green, present | No server to mount |
| `@deepseek-ai/dsh-mcp-client` in the 0.2.2-rc.1 install | External | Green per research | No MCP row type |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A launcher outlives the keyless run, or an existing executor kind's test fails.
- **Procedure**: Revert the phase commit, which removes the MCP patch, the adapter and the capability entry. No dispatch passes the MCP patch by default, so nothing else changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 004, 006 and 008 complete | Implementation |
| Implementation | Baselines captured | Verification |
| Verification | Patch, adapter and capability present | Phase 013 live MCP check |
<!-- /ANCHOR:phase-deps -->

---
