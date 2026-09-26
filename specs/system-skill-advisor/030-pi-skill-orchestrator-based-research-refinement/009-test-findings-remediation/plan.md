---
title: "Implementation Plan: Remediating the Cross-CLI Test Findings"
description: "Grok 4.7 through cli-cursor implements each fix from a scoped brief, GPT-6 Luna through cli-codex verifies it with a reverse check, and the orchestrator runs the whole-suite gates and reruns the nine scenarios in all five CLIs."
trigger_phrases:
  - "test findings remediation plan"
  - "grok implementer luna verifier"
  - "cross cli rerun plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remediating the Cross-CLI Test Findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor runtime, CommonJS launcher, ESM OpenCode plugin, Markdown scenarios |
| **Framework** | Node 26, OpenCode plugin API, Pi extension API |
| **Storage** | The advisor SQLite database and its generation and launcher state files |
| **Testing** | vitest, `node --test`, the 457 cadence harness and the nine manual scenarios |

### Overview
Each finding has an implementer brief and a verifier brief under the orchestrator's scratch area. Grok 4.7 xhigh-fast implements a brief inside Cursor's sandbox, GPT-6 Luna max fast checks the diff and proves the new test fails against the base commit, and the orchestrator reads every report against the files before it counts. After the fixes land, the orchestrator rebuilds the advisor dist, runs every suite serially and reruns the nine scenarios in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every finding verified by the orchestrator against code or a rerun
- [x] Each brief names the files it may touch, and no two parallel briefs share a file
- [x] Base commit `fa4f76d881` recorded for every reverse check

### Definition of Done
- [ ] Each fix has a PASS from its implementer and its verifier, confirmed by the orchestrator
- [ ] The advisor, spec-kit, Pi dispatch and plugin suites exit 0
- [ ] The nine scenarios pass in all five CLIs, or a FAIL is traced to a named environment limit
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator, leaf executors at depth 1. No executor dispatches another.

### Key Components
- **Implementer briefs**: one finding each, a literal change where possible, a named verify command and a fixed RETURN line.
- **Verifier briefs**: scope and diff checks, the suite gate and a reverse check that restores the base file for a moment and restores the fix before exiting.
- **Scenario reruns**: the phase 8 tester persona and report format, one scenario per dispatch, two dispatches at a time.

### Data Flow
Brief, then Grok's diff, then the orchestrator's read of that diff, then Luna's verdict, then the orchestrator's own rerun of the gate. Only after that does a fix count as landed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every code fix carries a test that fails against the base commit. The whole-suite gates run serially after the advisor dist is rebuilt, because the `skill-advisor-cli-*` suites spawn real sandboxed daemons and, before the containment fixes, wrote the live generation and launcher state files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 8's evidence and findings.
- Grok 4.7 through cli-cursor and GPT-6 Luna through cli-codex. Luna verifiers run under `workspace-write`; a test that needs a local socket is rerun by the orchestrator.
- Restarting the live advisor daemon and changing the operator's global Codex hook file are operator calls.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is a separate diff against `fa4f76d881` and reverts on its own. The `.opencode/bin` symlink is removed with `rm .opencode/bin`. The advisor dist is rebuilt from source with `npm run build`.
<!-- /ANCHOR:rollback -->

---
