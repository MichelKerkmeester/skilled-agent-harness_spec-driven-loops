---
title: "Changelog: /goal OpenCode Plugin [002-goal-opencode-plugin/root]"
description: "Chronological changelog for the /goal OpenCode Plugin spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin` (Level 1)

### Summary

Phase 002 shipped a passive goal layer for OpenCode with durable per-session state, sanitized context injection and a thin `/goal` command router. It added lifecycle budget tracking, conservative idle-time completion and guarded continuation while keeping automatic prompting gated and passive by default.

### Before vs After

**Before**

The active-goal feature had no durable store, no root command and no safe way to put the current goal into the assistant's system context. A session could not rely on one stable active goal and there was no lifecycle memory for token budget charging, completion evidence or guarded continuation after idle.

**After**

The plugin now persists one active goal per OpenCode session through atomic serialized state, refuses missing session ids and exposes the feature through a thin `/goal` router whose tools own session resolution, mutation, status and injection preview. Active goals reach the assistant as a sanitized `[active_goal]` block through OpenCode's system transform. Lifecycle tracking records assistant activity, charges usage only when safe and marks a goal budget_limited once its token cap is reached. On idle, a conservative supervisor evaluates redacted evidence and completes the goal only on an exact met verdict, while guarded continuation stays passive by default and calls `promptAsync` only when every gate passes.

**Impact**

OpenCode now has a passive goal layer with durable session state, visible status, budget awareness and a cautious completion path. The assistant can see the active goal without making chat depend on persistence and the continuation machinery exists without becoming an always-on prompt sender.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-state-store` | Complete | The passive /goal milestone now has durable state. mk-goal.js persists one active goal per OpenCode session, refuses missing session ids, writes JSON atomically, and serializes mutations so later phases can rely on a stable store. |
| `002-injection-plugin` | Complete | Active goals now reach the assistant as passive system context. The plugin reads the current session goal, renders a sanitized [active_goal] block, and appends it through OpenCode's system transform without making chat depend on state persistence. |
| `003-goal-command` | Complete | The passive goal feature now has a root command. /goal is a thin router that selects one plugin tool call, and the tools own session resolution, state mutation, status rendering, and the exact injection preview. |
| `004-lifecycle-tracking` | Complete | Lifecycle tracking now gives /goal enough runtime memory to govern budgets and prepare verifier evidence without changing its passive M1 behavior. The plugin observes OpenCode events, records assistant activity, charges usage only when it is safe, and marks a goal budget_limited once its configured token cap is reached. |
| `005-completion-supervisor` | Complete | The goal plugin now has a conservative supervisor path for automatic completion. On session.idle, it evaluates the last redacted evidence, stores the verifier result, and completes the goal only when the verdict is exactly met. |
| `006-active-continuation` | Complete | The goal plugin now has a guarded continuation path after idle-time verification. It stays passive by default, can be smoke-tested without sending a prompt, and only calls promptAsync when every gate passes. |

### Added

- No new additions recorded.

### Changed

- This is Phase 1 of the loop-systems implementation — a net-new capability, sequenced first because it carries the highest design uncertainty. Its design is produced by a dedicated 10-iteration deep-research run (cli-codex gpt-5.5 xhigh fast) whose artifacts land in this folder's research/.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
