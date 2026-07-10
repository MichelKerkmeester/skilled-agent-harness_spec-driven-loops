---
title: "BDG-015 -- Dual-instance parallel"
description: "This scenario validates parallel execution across `chrome_devtools_1` and `chrome_devtools_2` for `BDG-015`. It focuses on confirming `Promise.all` returns both navigate+screenshot results faster than sequential execution."
version: 1.0.0.6
---

# BDG-015 -- Dual-instance parallel

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-015`.

---

## 1. OVERVIEW

This scenario validates parallel execution across two MCP browser instances (`chrome_devtools_1` and `chrome_devtools_2`) for `BDG-015`. It focuses on confirming `Promise.all` over both instances returns valid screenshot files (verified by a separate filesystem check, not a base64 length), and that the same-wave median of repeated parallel navigate trials is meaningfully faster than the same-wave median of repeated sequential navigate trials (parallelism observable against a controlled, same-run baseline, not a single sample from a different scenario). This scenario depends on CM-012 (Promise.all parallel pattern) and CM-014..CM-016 (Chrome via Code Mode).

### Why This Matters

Dual-instance parallel is the value proposition of having two MCP browser instances at all: if it doesn't actually run in parallel (e.g., the MCP transport serializes calls), there's no point provisioning the second instance. Verifying observable parallelism — not just "both calls returned" — is the contract that justifies the doubled MCP cost.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `Promise.all([navigate+shot on _1, navigate+shot on _2])` produces two valid PNG files on disk, and that a same-wave repeated-trial parallel median is meaningfully faster than a same-wave repeated-trial sequential median.
- Real user request: `"Open example.com on one browser and example.org on another at the same time and screenshot both."`
- RCAF Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in parallel via Promise.all through Code Mode against both MCP instances. Verify both return successfully and confirm parallelism with a same-wave sequential-vs-parallel median comparison. Cross-reference: depends on CM-012 (Promise.all parallel). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: build a Code Mode script that (a) runs one functional navigate+screenshot pair inside `Promise.all` with explicit `filePath`s, then (b) runs several repeated same-wave trials of a sequential pair and a parallel pair (interleaved to control for warm-up/variance), measuring wall time per trial; verify the screenshot files with a separate shell step; compare medians.
- Expected signals: both screenshot files exist, are non-empty, and have PNG magic bytes; the parallel-trial median wall time is below a documented fraction of the sequential-trial median (this scenario requires at least 30% faster: `parallelMedianMs < 0.7 * sequentialMedianMs`).
- Desired user-visible outcome: A short report quoting both URLs, both screenshot file paths, the sequential and parallel medians, and a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL if one branch throws, either screenshot file is missing/empty, or the parallel median is not meaningfully faster than the same-wave sequential median.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in parallel via Promise.all through Code Mode against both MCP instances. Verify both return successfully and confirm parallelism with a same-wave sequential-vs-parallel median comparison. Cross-reference: depends on CM-012 (Promise.all parallel). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: both `chrome_devtools_1` and `chrome_devtools_2` are registered; verify with `bash: jq '.manuals | keys' .utcp_config.json | grep chrome_devtools_`
2. Code Mode script — build and dispatch via `call_tool_chain`. Part A proves functional correctness once (explicit `filePath` per instance); Part B runs repeated, interleaved same-wave sequential and parallel navigate trials to compare medians, since a single sample against an older scenario's baseline (BDG-014) cannot control for warm/cold variance:
   ```ts
   // Part A: functional correctness (once)
   const [r1, r2] = await Promise.all([
     (async () => {
       await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
       return chrome_devtools_1.chrome_devtools_1_take_screenshot({ filePath: '/tmp/bdg-015-func-1.png' });
     })(),
     (async () => {
       await chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.org' });
       return chrome_devtools_2.chrome_devtools_2_take_screenshot({ filePath: '/tmp/bdg-015-func-2.png' });
     })(),
   ]);

   // Part B: same-wave timing, interleaved sequential/parallel trials
   async function sequentialTrial(): Promise<number> {
     const t0 = Date.now();
     await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
     await chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.org' });
     return Date.now() - t0;
   }
   async function parallelTrial(): Promise<number> {
     const t0 = Date.now();
     await Promise.all([
       chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' }),
       chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.org' }),
     ]);
     return Date.now() - t0;
   }
   function median(values: number[]): number {
     const sorted = [...values].sort((a, b) => a - b);
     const mid = Math.floor(sorted.length / 2);
     return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
   }

   const sequentialMs: number[] = [];
   const parallelMs: number[] = [];
   for (let i = 0; i < 3; i++) {
     sequentialMs.push(await sequentialTrial());
     parallelMs.push(await parallelTrial());
   }

   return {
     functional: { r1, r2 },
     sequentialMs,
     parallelMs,
     sequentialMedianMs: median(sequentialMs),
     parallelMedianMs: median(parallelMs),
   };
   ```
3. `bash: ls -la /tmp/bdg-015-func-1.png /tmp/bdg-015-func-2.png && xxd /tmp/bdg-015-func-1.png | head -1 && xxd /tmp/bdg-015-func-2.png | head -1` — confirm both files exist, are non-empty, and start with the PNG magic bytes `89 50 4e 47`
4. Assert: both screenshot files valid PNG AND `parallelMedianMs < 0.7 * sequentialMedianMs` (parallel median at least 30% faster than the same-wave sequential median)

### Expected

- Step 1: both manuals registered
- Step 2: returns `{ functional, sequentialMs, parallelMs, sequentialMedianMs, parallelMedianMs }`, three samples each for sequential and parallel
- Step 3: both files exist, size > 0, first bytes are the PNG magic number `89 50 4e 47`
- Step 4: `parallelMedianMs` clearly less than `0.7 * sequentialMedianMs` (parallelism observable against a same-wave control, not an external single-sample baseline)

### Evidence

Capture the Code Mode script, the returned object (all six trial samples plus both medians), and the `ls -la` / `xxd` output for both screenshot files.

### Pass / Fail

- **Pass**: both screenshot files exist with PNG magic bytes AND `parallelMedianMs < 0.7 * sequentialMedianMs`.
- **Fail**: one branch throws (cross-reference CM-005 namespace contract); either file is missing/empty (cross-reference CM-015); `parallelMedianMs` is not meaningfully below the sequential median (no observable parallelism — likely transport serialization or a shared resource).

### Failure Triage

1. If one branch throws "manual not found" for `chrome_devtools_2`: the second MCP is not registered — cross-reference CM-005 (manual-namespace contract) and confirm `.utcp_config.json` includes `chrome_devtools_2` with a distinct port/profile from `chrome_devtools_1`.
2. If both calls succeed but `parallelMedianMs` is close to `sequentialMedianMs`: the transport is serializing — cross-reference CM-012 (Promise.all parallel pattern) and confirm both manuals are configured with independent processes / sockets, not a shared bus.
3. If the three sequential or three parallel samples vary widely: re-run with a larger sample count and report the full array, not just the median, since network/browser-start variance can otherwise mask or fake observable parallelism.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | CM playbook (CM-012 parallel; CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | chrome_devtools_1/chrome_devtools_2 MCP reference |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Code Mode parallel patterns |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/dual-instance-parallel.md`
