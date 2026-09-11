---
title: "Latency delta: prompt path after the MCP decommission"
description: "Final-state prompt-hook and CLI latency measured against the phase 2 budget and the controlled same-worktree baseline."
trigger_phrases:
  - "advisor latency delta"
  - "prompt hook latency after decommission"
  - "phase 2 budget check"
importance_tier: "important"
contextType: "reference"
---
# Latency delta: prompt path after the MCP decommission

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Measured from the final state, in the same worktree as the controlled baseline, through the
> path a real session actually takes: the spec-kit shim that spawns the advisor's compiled hook.

---

## 1. AGAINST THE BUDGET

| Gate | Budget | Measured | Verdict |
|------|--------|----------|---------|
| CLI recommend, warm | p50 at or under 1100 ms | **736 ms** p50, n=7 | Inside |
| Prompt hook, warm | p50 not above 2096 ms | **819 ms** p50, n=7 | Inside |
| Cold first call | under 3500 ms | **1566 to 1812 ms**, n=3 | Inside |

---

## 2. AGAINST THE BASELINE

Two baselines exist and they are not interchangeable. The phase 2 figure of 2096 ms was taken in
the main checkout. The controlled figure was taken by rebuilding the pre-change hook in this
worktree and measuring it here, which is the only apples-to-apples comparison.

| Path | Before | After | Change |
|------|--------|-------|--------|
| Prompt hook, warm, same worktree | 1104 to 1369 ms, p50 about 1184 | 754 to 1135 ms, p50 819 | about 30 percent faster |

The output is byte-identical across that change, so this is a like-for-like comparison rather than
a faster path that does less.

---

## 3. WHY IT GOT FASTER

The old prompt path spawned the Python scorer, which probed for the native advisor and used it
when reachable. Two process hops on every prompt. The path now calls the CLI, which reaches the
daemon directly. The Python scorer still exists and still runs, but only when the daemon cannot be
reached, where it costs about 213 ms on its own.

---

## 4. METHOD NOTES

- An earlier comparison in this packet was invalid: it measured the old hook in the main checkout
  against the new one in the worktree, two different corpora, and the numbers flattered the change.
  Every figure here comes from one worktree.
- The cold runs stop the daemon first, so each one pays a real start rather than reusing a warm one.
