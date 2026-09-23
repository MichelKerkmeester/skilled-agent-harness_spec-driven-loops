---
title: "Implementation Plan: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces"
description: "This implements three repairs: the restored full-delivery return in the pi dedup decision, one-root path resolution in the CLI fallback and the root probes in the Claude hook and the OpenCode plugin, plus a renewed advisor battery and updated documentation. The pi dedup suite runs as a negative control against 028's source and the advisor runtime battery runs against baselines renewed by the capture tools."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and JavaScript hook sources plus JSON fixtures. The Claude hooks compile with tsc, and the pi extension loads its TypeScript source directly through the `.pi/extensions/` symlink |
| **Framework** | pi extension event hook and Claude and OpenCode hook entry points (fail-open, advisory delivery) |
| **Storage** | No storage change. The worktree's existing skill-graph database and advisor database are reused |
| **Testing** | The advisor runtime vitest battery, the Pi dedup suite under the hooks vitest config and a stdin smoke of the compiled Claude hook |

### Overview

Three delivery paths get fixed in this round. The pi extension's dedup decision returns its full delivery again on a changed contribution instead of falling off the end of the function. The CLI fallback resolves its database dir and companion paths from one root and reads one variable once. The Claude hook checks `.skilled` before `.opencode`, and the OpenCode plugin resolves its compiled-routing helper from its own root first and `.skilled/bin` second. The advisor runtime battery then reports 0 failed tests (891 passed, 7 skipped of 898) against baselines renewed by the repository's capture tools and every documentation surface that described the old behavior is brought up to date. A second pass reads each renamed environment variable once, states which kill-switch name each surface reads and makes the shim test's unavailable case run every time. A follow-up merges main, re-captures both baselines, deletes the dead tri-daemon drill and points the CI corpus gate at the baseline's archived path.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)

The first round is merged and pushed to main and skilled/v4.0.0.0. The follow-up on `worktrees/063-remove-tri-daemon-drill` waits for the operator's go-ahead to push.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-process event-hook extensions (fail-open): a brief is advisory and never blocks the prompt.

### Key Components
- **`decidePiDirectiveDelivery`** (hooks/pi/prompt-advisor.ts): the pi extension's dedup decision. It returns its full delivery on a changed contribution and records the receipt on every full delivery.
- **`skill-advisor-cli-fallback.ts`** (hooks/lib): the CLI fallback's one-root path resolution. It takes the CLI, the IPC bridge and the default database dir from one found root and reads `SYSTEM_SKILL_ADVISOR_DB_DIR` once.
- **`user-prompt-submit.ts`** (system-spec-kit runtime Claude hook) and **`resolveCompiledRouteStatusModule()`** (.opencode/plugins/system-skill-advisor.js): the root probes. The Claude hook checks `.skilled` first and falls back to `.opencode`. The plugin checks its own root first and falls back to `.skilled/bin`.

### Data Flow
A prompt reaches the hook entry point for its runtime (pi `input` event, Claude user-prompt-submit or the OpenCode plugin). Kill-switches and the dedup decision run first. The probe then finds the root and the fallback paths, the one-shot CLI or the resident daemon produces the recommendation and the rendered `Advisor:` head plus directives are appended to the prompt as the brief.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Beyond the verification tasks in `tasks.md`: the negative control is the Pi dedup suite (`.skilled/hooks/dispatch/pi/directive-dedup.test.ts`), which fails 8 of 15 against 028's `prompt-advisor.ts` and passes 15 of 15 against this packet's version. The advisor runtime battery covers the fallback, probe, graph and baseline lanes and a stdin smoke of the compiled Claude hook covers its root probe end to end. Comment hygiene is checked so no ephemeral artifact labels land in code comments. The runtime battery alone could not see the dedup defect because its include glob is `tests/**/*.vitest.ts` under the runtime folder while the Pi dedup suite runs under `.skilled/hooks/vitest.config.ts`, so both suites run here. A live three-turn Pi RPC session then checks delivery, suppression of a byte-identical repeat and re-delivery on a changed prompt, with a dedup-off run as the control.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The worktree's own skill-graph database and the advisor daemon it runs. Lane E seeds that database from the regenerated graph so the graph-health and CLI-parity tests read the repaired state. The Python scorer that the divergence ledger compares against reads that daemon's live `skill-graph.sqlite`, so a database rebuild can move its tops, and the ledger is renewed only by its capture tool.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this packet's commits, newest first: the follow-up's drill deletion, the corpus-gate path fix (5ba4c78aac), the baseline re-capture (2f5fc94ef2) and the fix (89569a7f81). The merge commit 2dbaa8fd66 stays, because it only brings main in. No data migration runs and the renewed baselines revert with their commits.
<!-- /ANCHOR:rollback -->
