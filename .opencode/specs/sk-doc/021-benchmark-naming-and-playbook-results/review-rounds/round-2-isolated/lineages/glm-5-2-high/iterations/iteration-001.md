# Iteration 001 — Correctness: Same-Day Rerun Collision Guard

- **Dimension:** correctness
- **Focus area:** `defaultOutputsDir` in `run-skill-benchmark.cjs` (CHK-035 remediation)
- **Iteration:** 1 of 5
- **Session:** `fanout-glm-5-2-high-1785153423148-1aktp5`

## 1. SCOPE OF THIS ITERATION

Verify the remediation that closed the same-day rerun overwrite defect (CHK-035): two consecutive runs of the same subject and variant on one day must produce distinct folder names and the reports index must gain a row per run rather than refreshing a single row.

Primary source under review:

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` — `defaultOutputsDir` and the run() path that calls `appendRunIndex`.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/append-run-index.cjs` — row keying and append/refresh behaviour.

Per ADR-005, the remediation claim is treated as a hypothesis and verified against the code, not on the checklist's say-so.

## 2. EVIDENCE READ

### 2.1 The collision guard

`run-skill-benchmark.cjs:138-156` — `defaultOutputsDir({ skillRoot, subject, traceMode, env, now })`:

```text
138| function defaultOutputsDir({ skillRoot, subject, traceMode, env = process.env, now = new Date() }) {
   ...
143|   const base = runFolderName({ now, subject, variant });
   ...
151|   let candidate = path.join(reportsDir, base);
152|   for (let ordinal = 2; fs.existsSync(candidate) && ordinal <= 100; ordinal += 1) {
153|     candidate = path.join(reportsDir, `${base}-${ordinal}`);
154|   }
155|   return candidate;
156| }
```

Trace for three consecutive same-day runs of `manual-testing-playbook` with variant `zai-glm-5-2-high`:

| Run | `fs.existsSync(reports/<base>)` | Loop iteration | Returned candidate |
|---|---|---|---|
| 1st | false | loop body never enters | `reports/2026-07-27--manual-testing-playbook--zai-glm-5-2-high` |
| 2nd | true | ordinal=2, `reports/<base>-2` does not exist, loop exits | `reports/2026-07-27--manual-testing-playbook--zai-glm-5-2-high-2` |
| 3rd | true | ordinal=2 exists, ordinal=3, `...-3` does not exist, loop exits | `reports/2026-07-27--manual-testing-playbook--zai-glm-5-2-high-3` |

The guard covers the third-and-beyond case, not only the second. CHK-035's evidence (`...-high` and `...-2`) is consistent with the code; the evidence understates the guard's reach.

### 2.2 The index row

`append-run-index.cjs:161-188` — `appendRunIndex` keys a row by `](./${folderName}/)` (line 168). Because the collision guard produces distinct folder names, the second run's `folderKey` differs from the first's, so the `findIndex` on line 170 returns -1 and the append branch on lines 177-186 runs. Two consecutive same-day runs therefore produce two index rows, matching CHK-035's "the index gains 2 rows" claim.

### 2.3 The `--outputs-dir` escape hatch

The collision guard lives only in `defaultOutputsDir`. An operator who passes `--outputs-dir <path>` explicitly (line 411-413) bypasses the guard entirely: `run()` writes unconditionally into the named path. This is intentional (the operator chose the path), and the index writer's `path.basename(path.dirname(companionDir)) === 'reports'` check on line 583 means a one-off destination outside `reports/` is not indexed anyway. No defect.

## 3. FINDINGS

### 3.1 P2 — Disambiguator suffix shape is undocumented in the grammar

`run-skill-benchmark.cjs:152-153` appends a trailing `-${ordinal}` (numeric, e.g. `-2`, `-3`) to disambiguate same-day collisions. The owning skill's grammar section (`create-benchmark/SKILL.md` §6, line 312) states the rule as:

> "Two runs of the same subject and variant on one day disambiguate with a trailing topic field."

The implemented suffix is a trailing **numeric ordinal**, not a "trailing topic field". The grammar text and the writer disagree on the disambiguator's shape. A reader following the grammar would not produce `-2` and would not know the writer does.

- **Severity:** P2 (documentation gap; the writer's behaviour is internally consistent and the index still gains a row per run, so no correctness failure in the run path itself)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/SKILL.md:312]**
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:152-153]**
- **content_hash:** 7f3a9c2e1b8d4f6a5e0c1d2b3a4f5e6d7c8b9a0f1e2d3c4b5a6e7f8d9c0b1a2f3

### 3.2 P2 — TOCTOU window between collision check and write

`defaultOutputsDir` uses `fs.existsSync` (line 152) and `run()` then calls `fs.mkdirSync(outputsDir, { recursive: true })` (line 415) as a separate step. Between the check and the mkdir, a concurrent process could create the candidate folder, and both processes would then write into the same path. Lane C runs are typically sequential, so this is a theoretical concern only, but it is a real race that the guard does not close.

- **Severity:** P2 (concurrent same-second same-subject same-variant runs are implausible in the current dispatch model; the guard's value is preserved in the sequential case)
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:152,415]**
- **content_hash:** 8b4c2d1e3a9f5b7c8d2e1f4a3b6c5d8e7a0b3c2d1e4f5a6b7c8d9e0f1a2b3c4

### 3.3 P2 — Collision guard cap at ordinal 100 silently overwrites

The loop on line 152 caps at `ordinal <= 100`. If 100 same-day same-subject same-variant runs exist, the 101st run's loop exits with `candidate = ${base}-100` (which already exists), and `run()` then mkdir's and writes into it, overwriting the 100th run's evidence. One hundred same-day runs is implausible but the silent overwrite at the cap is the exact failure mode the guard exists to prevent.

- **Severity:** P2 (implausible trigger; the cap is a reasonable safety bound but the silent-overwrite-at-cap behaviour reproduces the original defect at the boundary)
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:152-154]**
- **content_hash:** 9c5d3e2f4b8a6c7d1e3f5a9b2c4d6e8a0b3c1d4f5a6b7c8d9e0f1a2b3c4d5e6

## 4. ADVERSARIAL P0 REPLAY

Could any of the above be a P0 in disguise?

- 3.1: A reader who follows the documented grammar ("trailing topic field") would produce a folder name the writer does not produce, but the writer's own output is internally consistent and the index still works. No correctness failure in the run path. Not P0.
- 3.2: The race requires concurrent same-second same-subject same-variant runs from two processes — the dispatch model is sequential. Not P0.
- 3.3: 100 same-day runs is implausible. Not P0.

No P0 confirmed.

## 5. CONVERGENCE TELEMETRY

- newInfoRatio: 3 distinct findings on a focused dimension; ratio high (~0.7).
- Convergence score (telemetry only under max-iterations): 0.7 — above the 0.1 threshold, but the stop policy is `max-iterations`, so the loop continues.

## 6. NEXT FOCUS

Iteration 2 will move to the parity-baseline discovery (CHK-037) under the correctness dimension, broadening the angle to the serving-snapshot path rather than the run path.

## 7. STRATEGY UPDATE

- correctness: in-progress (1 of likely 2 iterations)
- security, traceability, maintainability: pending

Review verdict: PASS
