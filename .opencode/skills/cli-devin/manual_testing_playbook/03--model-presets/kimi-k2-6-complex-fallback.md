---
title: "DV-026 -- Kimi k2.6 (complex-task fallback — large context)"
description: "This scenario validates that --model kimi-k2.6 works as the documented complex-task fallback for large-context work when DeepSeek v4 doesn't fit."
---

# DV-026 -- Kimi k2.6 (complex-task fallback — large context)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-026`.

---

## 1. OVERVIEW

This scenario validates `--model kimi-k2.6` for `DV-026`. Kimi k2.6 is one of two documented **complex-task fallbacks** in cli-devin's four-model preset — the right pick when DeepSeek v4 doesn't fit a complex task and the work needs an unusually **large context window** (long files, sprawling diffs, multi-repo grep, anything that wants to fit a lot of source in one window).

### Why This Matters

The cli-devin Routing Matrix designates Kimi k2.6 as a complex-task fallback alongside GLM 5.1. Operators need empirical evidence that Kimi k2.6 is reachable and produces coherent output on large-context complex work — otherwise the fallback recommendation has no operational basis. Note: this scenario uses ID DV-026 (out of category sequence) to avoid renumbering downstream IDs DV-011..DV-025 already in use.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `--model kimi-k2.6` is accepted and produces coherent output on a complex large-context task (one that benefits from fitting a lot of source in a single context window).
- Real user request: `DeepSeek v4 lost the thread because the codebase context is too large to fit in its window. Try Kimi k2.6.`
- Prompt: `Dispatch a complex large-context task with --model kimi-k2.6 --permission-mode auto and confirm Kimi k2.6 produces a coherent consolidated analysis spanning multiple files.`
- Expected execution process: Operator picks a large-context task (e.g. "read every file under directory X, identify all entry points matching pattern Y, produce a consolidated table") -> dispatches with Kimi k2.6 -> captures output -> verifies the output spans multiple input files coherently.
- Expected signals: `devin` exits 0. Stdout contains a consolidated analysis that references multiple input files. Dispatched command line includes `--model kimi-k2.6`. The output enumerates entries from across the directory rather than focusing on one file.
- Desired user-visible outcome: A working consolidated analysis that demonstrates Kimi k2.6's large-context advantage for the complex task.
- Pass/fail: PASS if exit 0 AND output references at least 5 distinct input files coherently AND dispatch line includes `--model kimi-k2.6`. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a large-context task: enumerate references across many files (e.g. "every mention of `--permission-mode` across all cli-devin .md files").
2. Dispatch with `--model kimi-k2.6 --permission-mode auto`.
3. Capture output.
4. Verify the output references many distinct input files (5+).
5. Return a PASS/FAIL verdict naming the file-reference count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-026 | Kimi k2.6 (complex-task fallback — large context) | Verify Kimi k2.6 is accepted and produces a coherent multi-file consolidated analysis on a complex large-context task | `Dispatch a complex large-context task with --model kimi-k2.6 --permission-mode auto and confirm Kimi k2.6 produces a coherent consolidated analysis spanning multiple files.` | 1. `bash: printf 'Read every .md file under .opencode/skills/cli-devin/. Identify every mention of --permission-mode (any value: normal / dangerous / bypass). Produce a consolidated Markdown table with columns: File, Line, Permission Mode, Context (1-line summary). Sort by File. Do not modify any files.\n' > /tmp/dv-026-prompt.md` -> 2. `devin --prompt-file /tmp/dv-026-prompt.md --model kimi-k2.6 --permission-mode auto > /tmp/dv-026-output.md 2>&1 </dev/null; echo "Exit: $?"` -> 3. `bash: head -60 /tmp/dv-026-output.md` -> 4. `bash: grep -cE '\.md\|\.md:' /tmp/dv-026-output.md` (count file references) | Step 2: exit 0; Step 3: consolidated Markdown table visible; Step 4: at least 5 distinct .md file references | Prompt file, dispatch log, consolidated table output, terminal transcript | PASS if exit 0 AND output references 5+ input files coherently AND dispatch line includes `--model kimi-k2.6`; FAIL otherwise | (1) Verify `--model kimi-k2.6` is in `devin --help`; (2) compare against DeepSeek v4 (DV-009) on the same prompt — Kimi should fit more files in one window; (3) confirm Kimi model name hasn't rotated |

### Optional Supplemental Checks

- Repeat the task with a much larger source set (e.g. all .md files under `.opencode/skills/`) to stress-test the context window.
- Compare against GLM 5.1 (DV-010) on the same prompt — GLM may produce more structured agentic output, Kimi should fit more source.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 Model Selection) | Documents Kimi k2.6 row |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Model Selection (Kimi k2.6 row) |
| `../../references/agent_delegation.md` (§3 Routing Matrix + §6 Example 4) | Routes large-context complex tasks to Kimi k2.6 fallback |
| `../../references/devin_tools.md` (§3 When to pick cli-devin) | Cross-CLI fallback routing |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/kimi-k2-6-complex-fallback.md`
