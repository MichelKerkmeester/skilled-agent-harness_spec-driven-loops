---
title: "Implementation Plan: Phase 40: dispatch-lint-held-fixes"
description: "Fix the ten held dispatch-hook findings in the shared classifier, the rule checks and the Pi preflight, one short writer brief per change, each with a test that fails on the pre-change engine, and compare every verdict over the dispatch command corpus before and after."
trigger_phrases:
  - "dispatch lint held fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 40: dispatch-lint-held-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM) and TypeScript hooks on Node 20 and later |
| **Framework** | None; Pi, Claude, Codex and Devin hook adapters around one shared core |
| **Storage** | None; the audit appends to `.skilled/logs/cli-dispatch-audit.log` |
| **Testing** | `node --test` for the rule checks, vitest for the audit core and the Pi preflight |

### Overview
The preflight and the audit share one classifier in `lib/dispatch-audit.mjs`. The fixes move every caller onto the resolver that already unwraps exec and shell wrappers, extend that resolver to return every dispatch in a chain and to read a heredoc that a shell runs, and make the two rule checks and the Pi directive test read only real arguments and unquoted, unnegated text.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding and Luna's remedy read from `039/review.md` §3 and `039/scratch/luna/confirm-b09-hooks-dispatch.txt`
- [x] Suite baselines captured in `scratch/suites/baseline/`
- [x] Pre-change engine snapshot and corpus comparison in place, 0 differences on unchanged code

### Definition of Done
- [ ] Every finding has a fix commit and a test that fails on the pre-change engine
- [ ] The corpus comparison moves only commands a finding names
- [ ] Every suite at or above baseline, Luna verdict PASS or P2-only, CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared classifier with thin runtime adapters.

### Key Components
- **`inspectDispatch`**: token-level classification of one command into direct, ambiguous or none.
- **`resolveDispatchPacket`**: segment split, heredoc handling and wrapper unwrapping on top of `inspectDispatch`; decides which packet's rules apply.
- **`evaluate` and `CHECKS`**: the hard-rule engine each adapter runs on a resolved dispatch.
- **Pi preflight**: authorization (`shouldDenyPiDispatch`) before the hard rules.

### Data Flow
Adapter receives the command, resolves the packet or packets, reads each packet's `hard-rules.json`, evaluates, and denies or advises; the post-tool audit resolves the same way and appends one line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each fix brief adds its test first; the test is run against the pre-change engine snapshot to record that it fails, then against the change. `scratch/corpus-diff.mjs` compares inspection, audit match, resolved packets and rule verdicts for 260 commands taken from the pre-change suites plus the earlier v1 parity corpus.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commits; the hooks have no stored state beyond the audit log.
<!-- /ANCHOR:rollback -->

---
