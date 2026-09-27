---
title: "Implementation Plan: Closing the Review Advisories and the Codex Hook Cleanup"
description: "The orchestrator runs the removal-only Codex installer and restores hook trust through Codex's own config write. Grok 4.7 through cli-cursor implements each advisory fix from a scoped brief, and GPT-6 Luna through cli-codex verifies it with a reverse check against 05231a01ea."
trigger_phrases:
  - "review advisories plan"
  - "codex hook cleanup plan"
  - "grok implementer luna verifier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Closing the Review Advisories and the Codex Hook Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor runtime and hooks, CommonJS scripts, ESM OpenCode plugin, workflow YAML |
| **Framework** | Node 26, the Codex app-server JSON-RPC API, OpenCode plugin API, Pi extension API |
| **Storage** | `~/.codex/hooks.json`, `~/.codex/config.toml` and the advisor metrics directory |
| **Testing** | vitest, `node --test`, PyYAML parses, the stem-producer census and live `codex exec` runs |

### Overview
The Codex cleanup runs first and by the orchestrator alone, because it writes the operator's global files. Each advisory then gets an implementer brief and a verifier brief under the orchestrator's scratch area. Grok 4.7 xhigh-fast implements a brief inside Cursor's sandbox. GPT-6 Luna max fast checks the diff and proves each new test fails against `05231a01ea`. The orchestrator reads every report against the files, rebuilds the dists, regenerates the compiled workflow contracts and reruns every suite against its baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every advisory confirmed in code by the orchestrator, with file and line
- [x] Each brief names the files it may touch, and no two parallel briefs share a file
- [x] Baselines recorded before any edit: advisor 959 passed and 6 skipped, deep-loop 2701 passed and 8 skipped, spec-kit hook subset 236 passed, Pi dispatch 50, plugin 31, pi-cache-optimizer 116

### Definition of Done
- [ ] Each fix has a PASS from its implementer and its verifier, confirmed by the orchestrator
- [ ] Every suite exits 0 with no test lost against its baseline
- [ ] A live `codex exec` starts each repository hook once and writes one advisor record per prompt
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator, leaf executors at depth 1. No executor dispatches another.

### Key Components
- **Codex client**: a small JSON-RPC client for `codex app-server` that lists hooks with their current hashes and writes trust through `config/batchWrite`, the same write Codex's `/hooks` review makes.
- **Implementer briefs**: one finding each, literal text where possible, an allowlist of files, a named verify command and a fixed RETURN line.
- **Verifier briefs**: scope and diff checks, a claim-by-claim read, the suite gate and a reverse check or mutation that restores the file before exiting.
- **Shared close-out script**: `synthesis-closeout.cjs` stages the synthesis event for both deep-loop modes, and each workflow keeps its own gateway call.

### Data Flow
Brief, then Grok's diff, then the orchestrator's read of that diff, then Luna's verdict, then the orchestrator's own rerun of the gate. A verifier's out-of-scope observation that proves a real defect in the same code becomes a sibling finding, N1 to N4, before any work on it starts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every behavior change carries a test that fails against `05231a01ea`. Comment-only fixes are checked by reading the code they describe, and by a mutation that shows an existing test pins the stated contract. The dist-backed CLI checks run after the orchestrator rebuilds the advisor dist, because the bin shim refuses a stale dist.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 9's removal-only installer, `.skilled/bin/install-codex-hooks.mjs`.
- The phase 6 review report for the twelve advisories.
- Grok 4.7 through cli-cursor and GPT-6 Luna through cli-codex. Luna verifiers run under `workspace-write`.
- Restarting the live advisor daemon is an operator call. The daemon change in N4 is backward compatible, so it takes effect whenever the daemon next starts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Codex files: `cp ~/.codex/hooks.json.bak-2026-09-27T07-15-03-730Z ~/.codex/hooks.json` and `cp ~/.codex/config.toml.bak-retrust-2026-09-27T07-14-57Z ~/.codex/config.toml`.
- Code: each fix is a separate diff against `05231a01ea` and reverts on its own. The advisor and spec-kit dists rebuild from source with `npm run build`, and the compiled workflow contracts regenerate with `compile-command-contracts.cjs --write`.
<!-- /ANCHOR:rollback -->

---
