---
title: "BDG-022 -- Cleanup leak detection (DESTRUCTIVE)"
description: "This scenario validates the cleanup contract for `BDG-022`. It focuses on confirming that omitting `bdg stop` leaks a Chrome process and that calling `bdg stop` returns the process count to baseline. DESTRUCTIVE: spawns and counts real Chrome processes."
version: 1.0.0.7
---

# BDG-022 -- Cleanup leak detection (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-022`.

> **DESTRUCTIVE WARNING**: This scenario spawns a real Chrome process via bdg, intentionally leaks it temporarily, and then kills it. Run only against a throwaway session — never on a workstation where another long-running Chrome session is active (the process counts will not be reliable). Always finish with `bdg stop` to avoid leaving a leaked browser behind.

---

## 1. OVERVIEW

This scenario validates the cleanup contract for `BDG-022`. It focuses on confirming the observable claim that "omitting `bdg stop` leaks a Chrome process" and the recovery claim that "calling `bdg stop` returns the process count to baseline". The proof is a three-point process count: pre-session baseline, post-session count, post-stop count.

### Why This Matters

Leaked Chrome processes are silent: they don't crash anything, they just consume RAM until the OS notices. On long-running workstations or CI agents, accumulated leaks degrade performance over hours/days, and the root cause is hard to attribute back to bdg without an explicit detection scenario. This complements BDG-004 (clean stop) by demonstrating the destructive consequence of skipping the cleanup step.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify the Chrome process count increases after `bdg <url>` and decreases after `bdg stop` — specifically: post-session count > baseline AND post-stop count <= baseline.
- Real user request: `"Show me that bdg actually leaks Chrome if I forget to stop it."`
- Prompt: `Show whether bdg leaves Chrome running without stop, then run stop and confirm cleanup.`
- Expected execution process: count Chrome baseline; start session; recount; do NOT call stop yet (capture leak proof); then call stop; recount.
- Expected signals: pre-session count = `B`; post-session count > `B`; post-stop count <= `B`.
- Desired user-visible outcome: A short report listing the three counts with the leak delta and the post-stop recovery delta with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if post-session count == baseline (bdg didn't actually launch a process), or post-stop count remains > baseline (cleanup is broken — TRUE LEAK).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show whether bdg leaves Chrome running without stop, then run stop and confirm cleanup.`

### Commands

1. `bash: pgrep -fl chrome | wc -l` — pre-session baseline (call this `B`)
2. `bash: bdg https://example.com 2>&1; echo "EXIT=$?"` — start session (DO NOT stop yet)
3. `bash: pgrep -fl chrome | wc -l` — post-session count (call this `S`); expect `S > B`
4. `bash: pgrep -fl chrome` — list to confirm the new process is bdg-owned (look for `--remote-debugging` flag)
5. `bash: bdg stop 2>&1; echo "EXIT=$?"`
6. `bash: pgrep -fl chrome | wc -l` — post-stop count (call this `P`); expect `P <= B`
7. `bash: pgrep -fl chrome` — list to confirm no bdg-owned processes remain

### Expected

- Step 1: integer `B` (operator's normal baseline)
- Step 2: exit 0
- Step 3: `S > B`
- Step 4: list includes a Chrome process with `--remote-debugging` argv
- Step 5: exit 0
- Step 6: `P <= B`
- Step 7: no Chrome processes with `--remote-debugging` argv

### Evidence

Capture all three counts (`B`, `S`, `P`), the process lists from steps 4 and 7, and the bdg stop exit code.

### Pass / Fail

- **Pass**: `S > B` (leak observable) AND `P <= B` (cleanup observable).
- **Fail**: `S == B` (bdg didn't launch a process — cross-reference BDG-002, BDG-019); `P > B` (TRUE CLEANUP LEAK — bdg stop ran but processes remain); step 7 still lists a `--remote-debugging` Chrome.

### Failure Triage

1. If `S == B`: bdg did not launch a Chrome process — cross-reference BDG-002 (session start) and BDG-019 (missing browser); the launch may have silently fallen back to an attached browser without spawning a child.
2. If `P > B`: TRUE CLEANUP LEAK. Cross-reference BDG-021 (dead session). Manual recovery: identify the specific leaked PID by bdg's own `--user-data-dir` marker (`bash: pgrep -af "chrome.*--user-data-dir=.*\.bdg/chrome-profile"`, confirmed by live `bdg --help`) and kill only that PID (`bash: kill -9 <pid>`); never a broad `pkill -f "chrome.*--remote-debugging"`, which can also match unrelated remote-debugging Chrome processes (e.g. a concurrent `chrome_devtools_1`/`chrome_devtools_2` MCP session). Then file a bug against bdg's `stop` implementation with the captured `S` and `P` counts and the process list.

### Optional Supplemental Checks

- Re-run the scenario back-to-back twice; if `B` drifts upward across runs, leak accumulation is confirmed and operators must compensate by resetting the baseline before each test wave.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | bdg stop semantics + cleanup |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: BDG-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `recovery-and-failure/cleanup-leak.md`
