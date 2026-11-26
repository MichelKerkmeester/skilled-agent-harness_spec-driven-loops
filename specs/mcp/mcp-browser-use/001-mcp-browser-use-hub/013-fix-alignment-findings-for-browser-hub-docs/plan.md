---
title: "Implementation Plan: Phase 13: fix-alignment-findings-for-browser-hub-docs"
description: "Fix the 112 alignment findings in place: literal fixes by script, judgment fixes against bdg 0.6.10's source and live Code Mode probes, then one regex lift in the advisor scorer and a handful of script edits."
trigger_phrases:
  - "fix alignment findings for browser hub docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: fix-alignment-findings-for-browser-hub-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, Bash scripts, TypeScript (advisor scorer and deep-loop config), Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest suites, the hub and playbook validators, `run-probes.cjs` and the alignment recheck |

### Overview
Most fixes are doc edits: the doc run's 45 literal fixes go in with `apply-fixes.cjs`, and each judgment finding is fixed by hand against bdg 0.6.10's installed source and live Code Mode probes. The code changes are small: one regex lift in `fusion.ts`, a Devin model entry, one freshness-panel predicate and the hub scripts. Proof is the probe replay, both rechecks and the hub gates run from the final state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `run-probes.cjs` prints `pass=9 fail=0`, and the advisor suite has no new failure against its baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place doc and script repair.

### Key Components
- **`readOnlyRouteAllowed` in `fusion.ts`**: lifts the read-only floor for the hub when a prompt names an own-Chrome attach.
- **Hub scripts under `mcp-chrome-devtools/scripts/` and `examples/`**: the setup checks and the three CI example scripts.

### Data Flow
A prompt reaches the advisor, the read-only explainer floor holds it at 0.25 confidence, and the lift releases the floor for `mcp-browser-use` only when the attach wording is present. The hub's own router then picks the Chrome DevTools mode.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup baselines the hub gates, the advisor suite and the probes. Implementation applies the literal fixes, the judgment fixes, the scripts and the routing lift. Verification reruns every gate, both rechecks and the rescan sweeps from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The routing lift gets three cases in `route-gates.vitest.ts`: two own-Chrome prompts that lift and two negative controls that stay floored. The probe replay then checks the live daemon end to end. Script fixes are checked by running the changed `install.sh` functions against the pre-change copy and by running each new jq filter on a fixture shaped like bdg's `formatConsoleJson` output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

bdg 0.6.10 and `jq` on PATH. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed yet. Before a commit, `git restore` on a file reverts it. The two git-ignored doc-alignment YAMLs have copies in `~/.local/state/local-alignment-backups/20261123-alignment-fixes/`. After a commit, revert that one commit.
<!-- /ANCHOR:rollback -->

---
