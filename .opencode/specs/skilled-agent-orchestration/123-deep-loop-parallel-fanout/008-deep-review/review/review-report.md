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
| 5 | TIMEOUT-ORPHANS | P1 | Fold into C-01: `detached` + `process.kill(-pid)` group signal | M / Med | — |
| 6 | BOUNDS | P1 | `.max()` on count + concurrency + total-expansion cap in `parseFanoutConfig` | S / Low | — |
| 7 | ENV-LEAK | P1 | Allowlist child env at the spawn site | M / Med | **yes** |
| 8 | MERGE-DEDUP | P1 | Dedup by contentHash, fallback `file:line+title`, in both merges | M / Med | — |
| 9 | XOR | P1 | Root validator rejecting a both-present (executor+fanout) config | S / Low | — |
| 10 | C-04 + N-01 | P1 | Zero-pad salvage filename; stop reusing one recovered blob for all iterations; fix the test that enshrines unpadded | S / Low | — |
| 11 | C-03 | P1 | Verbatim-invoke per CLI lineage, OR amend spec §2 to accept prompt-synthesis | L / High | **yes** |
| 12 | N-04, N-02, DOC-STALENESS | P2 | Attribution from live severities; clarifying comment; child impl-summaries + graph-metadata regen | S–M / Low | DOC: **yes** |

**Test additions that would have caught the P0s (add alongside the fixes):**
- C-01: drive `runCappedPool` with a **real** spawn worker (not the gated mock) and assert ≥2 subprocesses are concurrently live.
- C-02: a fan-out review where every lineage exits non-zero must produce `summary.failed > 0` and a non-PASS merged verdict.

**Needs an operator decision (not pure code):** U-01 (canonical field + write-back contract),
C-03 (verbatim vs prompt-synthesis), ENV-LEAK (allowlist source), DOC-STALENESS (confirm shipped).

## 5–8. Spec Seed / Plan Seed / Traceability / Deferred

If actioned, a single remediation phase under packet 123 covering items 1-11 (code) + 12 (docs) is
sufficient. All 16 review dimensions covered; Opus verified every finding line-by-line across 2
passes; 0 findings disagreed-on between the passes. Deferred pending operator decision.

## 9. Audit Appendix

**Method.** 16 read-only `cli-codex` GPT-5.5 (xhigh, fast) review iterations (kill-between,
single-dispatch discipline) → 2 Opus-4.8 verification/deepening iterations (re-read every cited
line, re-ran the real 72-test suite, produced recommendation cards + re-checked each other) →
conductor spot-checked the highest-stakes verdicts (C-01 serialization, C-02 false-PASS, U-01
review-side type/kind, C-03 spec §2, BOUNDS, XOR) against source.

**Three-pass convergence.** GPT-5.5 raw: 8 P0 / 42 P1 / 3 P2. After verification: 2 confirmed P0 +
1 latent-P0 + 8 P1 + 3 P2; 0 firmly rejected (the chain declined to clear anything it could not
disprove from a read line); several GPT-5.5 over-counts collapsed (dup line-341 P0s) and 2 NEW
issues found that GPT-5.5 missed (N-01 salvage-reuse, N-04 attribution-shape).

**Verification-integrity record (kept honestly).** Pass 1 (conductor) produced a false-PASS;
pass 2 fabricated a test count; both retracted. The Opus passes + spot-checks are the corrected
record. Lesson saved to memory: green tests + a mock-injected pool hid a real serialization P0 in
the un-mocked worker, and over-confident verification nearly shipped it as PASS.

**Cost.** 20 codex dispatches (~2.27M tokens) + 2 Opus agents (~523k tokens).

**Artifacts.** `review/review-report.md` (this), `review/iterations/iteration-001..016.md` (GPT-5.5),
`opus/iterations/iteration-001.md` (verify) + `iteration-002.md` (deepen+recs), `opus/deltas/*.jsonl`.

**Execution mode.** report-only — no fixes applied to reviewed code.
