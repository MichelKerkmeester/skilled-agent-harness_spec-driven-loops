# What Changed in Goal OpenCode Plugin

> This packet shipped the OpenCode session-goal layer: a durable `/goal` command and plugin that stores one active goal per session, injects it as passive context and governs completion or continuation through conservative lifecycle gates.

---

## 1. GOAL OPENCODE PLUGIN

This is the session-goal feature: how an OpenCode session stores one active goal, injects it as passive context and decides whether to complete or continue it.

**Before**

The active-goal feature had no durable store, no root command and no safe way to put the current goal into the assistant's system context. A session could not rely on one stable active goal and there was no lifecycle memory for token budget charging, completion evidence or guarded continuation after idle.

**After**

The plugin now persists one active goal per OpenCode session through atomic serialized state, refuses missing session ids and exposes the feature through a thin `/goal` router whose tools own session resolution, mutation, status and injection preview. Active goals reach the assistant as a sanitized `[active_goal]` block through OpenCode's system transform. Lifecycle tracking records assistant activity, charges usage only when safe and marks a goal budget_limited once its token cap is reached. On idle, a conservative supervisor evaluates redacted evidence and completes the goal only on an exact met verdict, while guarded continuation stays passive by default and calls `promptAsync` only when every gate passes.

**Impact**

OpenCode now has a passive goal layer with durable session state, visible status, budget awareness and a cautious completion path. The assistant can see the active goal without making chat depend on persistence and the continuation machinery exists without becoming an always-on prompt sender.

**Why**

The implementation keeps state ownership inside the plugin tools, keeps injection sanitized and passive and makes automatic completion conservative enough that a goal only closes when the stored verifier result says it is met.
