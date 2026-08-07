---
title: "Deep Review Report: packet 123 (deep-loop parallel fan-out)"
author: "16× GPT-5.5 xhigh (cli-codex, read-only) + 2× Opus-4.8 verification/deepening; conductor spot-checked key verdicts"
date: "2026-05-31"
status: "complete — findings source-verified across 3 passes"
model: "review: gpt-5.5 xhigh fast | verify+deepen: opus-4.8"
severity_summary: "VERIFIED: 2 P0 + 1 latent-P0 + 8 P1 + 3 P2 (after adversarial verification)"
iterations: "16 review + 2 Opus verify/deepen"
execution_mode: "report-only (no fixes applied; operator decides)"
---

# Deep Review Report — Packet 123 (deep-loop native parallel fan-out)

`.opencode/specs/skilled-agent-orchestration/123-deep-loop-parallel-fanout`

## 1. Executive Summary

**Verdict: CONDITIONAL — NOT a clean pass. Two confirmed P0 defects in the core feature.**

The packet's headline capability — "run N executor lineages concurrently, capped" — **does not
work as built**, and a failed fan-out review can return a **false PASS**. Both were confirmed by
re-reading the actual source three times (GPT-5.5 review → Opus verify → Opus re-check), plus
conductor spot-checks. The 72-test suite is green but structurally cannot catch the two P0s (it
injects an async mock worker and never runs the real `spawnSync` path; the salvage test enshrines
the filename bug).

**Verification integrity note:** the first synthesis of this review was wrong (a false-PASS, then a
fabricated test count) — both retracted. This version reflects line-by-line re-verification; every
finding traces to a read line. Real test count: **5 files / 72 tests pass.**

## 2. Planning Trigger

**YES.** C-01 defeats success-criterion #1 (concurrency) and C-02 defeats the review gate's
trustworthiness. A remediation cycle is warranted.

## 3. Active Finding Registry (verified)

### P0 — must fix

| ID | File:Line | Defect (verified mechanism) |
| -- | --------- | --------------------------- |
| **C-01** | `scripts/fanout-run.cjs:341` | The pool worker is `async` but has **no `await` before the blocking `spawnSync`**. `runCappedPool`'s pump admits a lineage → the worker runs synchronously up to `spawnSync` → `spawnSync` blocks the event loop to completion before the next lineage is admitted. **CLI fan-out is fully serial; `--concurrency` is inert.** Violates spec §6 #1. |
| **C-02** | `scripts/fanout-run.cjs:359-360` + `fanout-merge.cjs:197-202` | Worker returns `{exitCode, timedOut}` and **never throws** on non-zero exit/timeout → `settleItem` marks it `fulfilled` → `buildPoolSummary` counts it `succeeded`. Then `mergeReviewRegistries` returns `PASS` when zero registries are readable. **A fan-out review where every lineage crashed yields a false PASS.** P0 for the review gate. |

### Latent P0 — confirm one runtime fact, then it's P0 or P2

| ID | File:Line | Status |
| -- | --------- | ------ |
| **U-01** | `deep_start-review-loop_auto.yaml:735/741` vs `start-review-loop.md:141/157/164` | Three layers disagree on the executor field name. The **review command doc writes `config.executor.type`**; the **review YAML predicate reads `config.executor.kind`**; the loader (`executor-config.ts:87-112`) renames `type→kind` **only inside `parseExecutorConfig`**. The YAML declares `resolve_executor.loader: parseExecutorConfig` (:698-700) but **no step writes the normalized result back into `config.executor`** before the `.kind` predicate (:741). If the runner does not implicitly write-back, a default **native review mis-branches into the CLI path = P0**; if it does, harmless = P2. (Research side is self-consistent on `.type`; review is the broken side.) **One native-review trace closes this.** |

### P1 — should fix

| ID | File:Line | Defect |
| -- | --------- | ------ |
| C-03 | `fanout-run.cjs:122-146,315` | `buildLoopPrompt` **synthesizes a natural-language prompt** ("Read `${skill}` and execute the loop…") instead of running the command verbatim. Contradicts spec §2's approved **Option B** ("orchestrator shells the existing command … so the YAML loop runs verbatim"). Also: `lineage.iterations` is used only to size the timeout (:154-158), never as a max-iterations cap. **Needs decision: implement verbatim, or amend §2 to accept prompt-synthesis for CLI kinds.** |
| MERGE-DROP | `fanout-merge.cjs:61-67` | `tryReadJson` swallows a malformed registry as `null` → lineage silently `skipped_no_registry`. A lineage that found an active **P0 can vanish** from the merged review verdict. Fail closed instead. |
| TIMEOUT-ORPHANS | `fanout-run.cjs:341-348` | `spawnSync` has `timeout` but no `detached`/process-group; grandchild processes survive a timed-out lineage. Fold into the C-01 spawn rewrite (`detached` + group kill). |
| BOUNDS | `executor-config.ts:298,306` | `count` and `concurrency` are `.positive()` with **no upper cap**; `expandLineages` materializes one entry per `count` → memory exhaustion on a hostile/typo config. Add `.max()` + a total-expansion cap. |
| ENV-LEAK | `fanout-run.cjs:345` | Full `process.env` forwarded to every lineage subprocess (no allowlist), bypassing the executor-audit env discipline. **Needs decision: allowlist source.** |
| MERGE-DEDUP | `fanout-merge.cjs:97,174` | Dedup keys on lineage-local `id`/`title`, not a content hash → cross-lineage dedup unreliable (dupes survive or distinct findings collide). |
| XOR-NOT-ENFORCED | `executor-config.ts:304` + `start-review-loop.md:152` | Schema `.strip()`s unknown keys, so a config with **both** `executor` and `fanout` parses cleanly (one side silently dropped). The "0-1→executor / 2+→fanout" policy is **prose guidance to the setup AI, not a runtime guard.** No code path rejects both-present. Add a root validator. (No operator decision needed.) |
| C-04 | `fanout-salvage.cjs:106` | Salvage writes **unpadded** `iteration-${n}.md`; canonical pattern is `iteration-{NNN}.md`. Breaks exact-name `assert_exists` checks. The salvage test itself uses unpadded names, enshrining the bug. |
| N-01 | `fanout-salvage.cjs:103,120` | `recoveredText` is computed **once** outside the loop and written into **every** missing iteration → multiple missing iterations get byte-identical content. |

### P2 — polish / docs

| ID | File:Line | Issue |
| -- | --------- | ----- |
| N-04 | `fanout-merge.cjs:242` | Attribution-table verdict reads `findingsBySeverity.P0` (a precomputed count) rather than the live `registry.findings` severities; can show PASS while active P0s exist. |
| N-02 | `fanout-run.cjs:52-66` | A second `spawnSync` (the TSX self-respawn) is fine to stay synchronous; add a comment that C-01 targets the *inner* worker, not this. |
| DOC-STALENESS | `123/00{3,4,5,6}/graph-metadata.json` + parent `spec.md` | All four children show `status: planned` while their specs claim `completion_pct: 100`; `implementation-summary.md` is **absent** in all four; parent continuity still says `completion_pct: 33` / Phase-003-pending. **Needs decision: confirm the packet actually shipped, then regen.** |

## 4. Recommendations — implementation-ready (ordered)

Recommended **sequence** (rationale: fix the gate's honesty before the concurrency change, so the
test harness reports failures truthfully before parallelism can hide them):

| # | ID | Sev | Fix (concrete) | Effort/Risk | Decision? |
| - | -- | --- | -------------- | ----------- | --------- |
| 1 | C-02 | P0 | Worker throws on `exitCode!==0 || timedOut`; `mergeReviewRegistries` fails closed on zero readable registries | S / Low | — |
| 2 | C-01 | P0 | Replace `spawnSync` with `spawn`-in-Promise resolving on `close` (inner worker only, not the TSX respawn) | M / Med | — |
| 3 | U-01 | P1→P0? | One canonical field end-to-end: align review predicate to the doc-written field, or make `resolve_executor.loader` write back | S / Med | **yes** |
| 4 | MERGE-DROP | P1 | `tryReadJson` returns a parse-error sentinel; merge fails closed (completes C-02's merge half) | S / Low | — |