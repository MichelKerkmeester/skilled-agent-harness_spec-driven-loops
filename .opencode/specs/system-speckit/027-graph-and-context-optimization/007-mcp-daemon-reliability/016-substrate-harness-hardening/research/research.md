# Deep Research — Substrate skip-not-fail-on-live-owner: behavioral-claim validation

## 1. Overview

Adversarial validation of the five behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness. The fix makes `connectSharedClient` record a tolerated `SKIP` (instead of `FAIL`) when a live operator daemon holds the single-writer lease and bridging is disabled.

- **Spec folder:** `.opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation`
- **Executor:** cli-opencode → `minimax/MiniMax-M2.7-highspeed`
- **Iterations:** 5 / 5 (stop reason: `maxIterationsReached`)
- **Sources under test:**
  - `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`
  - `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`
  - `.opencode/bin/mk-code-index-launcher.cjs`, `.env.local`

## 2. Executive Summary

**All five claims are PROVEN, with two material refinements the original summary understated.** The fix behaves as advertised for its intended purpose (live-owner lease contention → SKIP, in interactive sessions), genuine crashes still FAIL, and the false-green guard survives. Two nuances strengthen the picture:

1. **Q1/Q2 share one residual hole:** the *only* way a genuine crash can be masked as SKIP — and the *only* way the 410 guard can be bypassed — is the **PID-recycling window (F-005)**: a hard-crashed daemon leaves an un-cleaned lease whose `ownerPid` is reassigned by the OS to a live unrelated process. Narrow, but real.
2. **Q5 is more precisely "merely hidden", not "sidestepped":** the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak is **orthogonal** to skip-not-fail and is only *untriggered* in interactive sessions (child exits before the scan). In a clean env / CI with `.env.local` present, the forced INDEX scan is **live**.

## 3. Methodology

Five fresh-context iterations, one key question each, externalized state (JSONL + per-iteration deltas + narratives), reducer-synchronized registry/dashboard. Each iteration was dispatched to MiniMax M2.7-highspeed via `opencode run`, then its 3-artifact output contract was validated (`post_dispatch_validate`), reduced, and convergence-checked before the next. Evidence is cited at file:line.

newInfoRatio trace: iter1 `0.85`, iter2 `0.25`, iter3 `0.95`, iter4 `0.95`, iter5 `0.95` (rolling avg stayed ≫ 0.05; stop was the hard 5-iteration cap, not convergence).

## 4. Key Questions

| # | Question | Verdict |
|---|----------|---------|
| Q1 | Do genuine daemon crashes still FAIL? | **PROVEN** (caveat: PID recycling) |
| Q2 | Does the false-green guard still fire in a clean env? | **PROVEN** (same single bypass) |
| Q3 | Is the evidence TSV reproducible? | **PROVEN** (structure; pid values are session-specific; EPERM stale-pid hazard) |
| Q4 | Is graph-metadata churn non-harness? | **PROVEN** |
| Q5 | Is the maintainer-mode leak sidestepped or hidden? | **PROVEN — "hidden", not fixed; orthogonal** |

## 5. Findings

### Q1 — Genuine crashes still FAIL (PROVEN, caveat)
- **F-001:** The catch block's null-vs-non-null branch on `liveOwnerForService(name)` is the sole FAIL arbiter — `liveOwner !== null` → SKIP, `=== null` → FAIL (`run-substrate-stress-harness.mjs` catch block ~394-416; null path `:358-364`).
- **F-002:** `isPidAlive` is correct: `process.kill(pid,0)` → ESRCH→`false` (dead), EPERM→`true` (alive, foreign-owned), no-throw→`true` (`:321-330`). Consistent with `daemon-detect.ts` ESRCH semantics.
- **F-003:** `liveOwnerForService` checks only `['ownerPid','pid']`, **not** `childPid` (DR-016). If the launcher parent dies but the child daemon lives, the harness still FAILs — which is the *correct* "can't spawn a dedicated child" semantic, not a false-green.
- **F-004:** **TOCTOU is not exploitable** — `liveOwnerForService` reads the lease *synchronously* in the catch with no `await` between connect-failure and lease-read (the only await, `client.close()`, runs before it).
- **F-005 (residual risk):** PID recycling — hard crash leaves an un-cleaned lease whose `ownerPid` is reassigned to a live unrelated process → `isPidAlive` true → SKIP masks a real crash. Requires all of: un-cleaned lease + recycled-to-live PID + harness reads after reassignment. Narrow on macOS/Unix, non-zero.

### Q2 — False-green guard still fires (PROVEN, same bypass)
- **F-008:** A `runner:` row is emitted *only* on a connect/listTools throw; the happy path returns `diagnostic: null` (no row). Classification is purely by `liveOwnerForService` (alive→SKIP, dead→FAIL) regardless of the specific error.
- **F-009:** The guard (`substrate-runner-harness.vitest.ts:79-83`) computes `memoryOwnerSkipped` from `runner:mk-spec-memory` SKIP rows; when absent (clean connect), it asserts 410 ∈ {PASS,PARTIAL}. If `memory_search` isn't exposed, 410 falls to SKIP → assertion fails → **the false green is caught**.
- **F-010 / F-011:** The *only* bypass is the F-005 PID-recycling path. `listTools()` failure is not an independent false-green pathway: alive→SKIP (legit), dead→FAIL.
- **RO-005/006/007:** zombie/unresponsive daemon, empty toolNames, and undefined `memoryScenario.verdict` all resolve to correct fail/skip — not silent bypasses.

### Q3 — TSV reproducibility (PROVEN, with hazard)
- **Deterministic write:** `writeSummary` tab-joins 4 fields and sanitizes embedded tabs/newlines via `.replace(/\t/g,' ').replace(/\n/g,' ')` → byte-identical for identical rows (`:660-666`).
- **Structured SKIP row:** `key_metric` = `"${name} owned by live daemon pid ${ownerPid}"`; `detail` interpolates the pid twice + the underlying connect error (`:398-404`). The observed TSV matches the template exactly.
- **Reproducible structure, session-specific pids:** owner pids are read from the live lease and vary per session (observed `mk-spec-memory 57747`, `mk-code-index 69226` this run vs `48700` earlier).
- **F (hazard):** **EPERM-locked-TSV fallback** (`:667-676`) returns without writing and preserves the existing file → if a prior run's TSV is present, **stale pids remain visible**. Reproducibility hazard for an analyst reading the file.

### Q4 — graph-metadata churn is not harness-produced (PROVEN)
- **F-013:** The harness writes only the TSV, `_sandbox` workload/stderr files, and packet state — **zero** `graph-metadata.json` writes.
- **F-014:** In the live-owner path the child exits at `mk-code-index-launcher.cjs:864` (lease held) **before** `buildIfNeeded` at `:944` → no INDEX scan → no graph-metadata write.
- **F-015:** The writer is the operator's own maintainer-mode code-index daemon (background rescans).
- **F-016:** Indirect triggering via the harness is implausible — the harness writes under `_sandbox/`, outside the operator daemon's scan scope (`.opencode/{skills,specs,agents,commands,plugins}`).

### Q5 — maintainer-mode leak: "hidden", not fixed (PROVEN — refines original claim)
- **Q5-1:** `.env.local:4` sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`; the launcher loads `.env.local` (`cjs:65-71`) and forces all 5 `INDEX_*` flags (`cjs:80-94`).
- **Q5-2:** **Neither** `buildChildEnv` (`cjs:645-652`, blocks only `NODE_/npm_/NPM_`) **nor** the harness `buildDaemonEnv` (`mjs:57-64`, blocks only credential patterns) scrub the var — it propagates to the child unscrubbed.
- **Q5-3 (interactive):** child exits at `cjs:864` before the scan → leak **untriggered** (not neutralized).
- **Q5-4 (clean env / CI):** child acquires the lease, reaches `buildIfNeeded` (`cjs:944`) with `INDEX_*` forced → **full INDEX scan fires** → rewrites graph-metadata across the tree.
- **Q5-5/6 (verdict):** skip-not-fail (FAIL→SKIP on lease contention) is **orthogonal** to the env leak. The leak is **merely hidden** in interactive use, **live** in clean env. The harness comment (`mjs:708-711`) acknowledges intent but cannot stop the *launcher* (separate process) from loading `.env.local`.

## 6. Cross-Cutting Verdict

| Claim | Verdict | Anchor evidence |
|-------|---------|-----------------|
| Q1 crashes still FAIL | PROVEN (caveat F-005) | `mjs` catch `:394-416`, null path `:358-364`, `isPidAlive :321-330` |
| Q2 false-green guard fires | PROVEN (bypass = F-005) | `vitest.ts:79-83`, `mjs:376-416`, generic-skip `:583-589` |
| Q3 TSV reproducible | PROVEN (pid values vary; EPERM stale hazard) | `mjs:660-666`, `:398-404`, `:667-676` |
| Q4 churn non-harness | PROVEN | `cjs:864` vs `:944`; harness writes only `_sandbox`/TSV |
| Q5 leak hidden not fixed | PROVEN (orthogonal) | `.env.local:4`, `cjs:65-94`, `cjs:645-652`, `mjs:57-64` |

## 7. Residual Risks & Recommendations

1. **PID-recycling false-SKIP (F-005)** — low probability, real. *Optional hardening:* compare the lease's `startedAtIso`/owner identity against the live process, or check `childPid` liveness, before classifying SKIP. Not required for correctness today.
2. **EPERM stale-pid TSV hazard** — an analyst could read prior-run pids. *Optional:* stamp each TSV with a run-id/timestamp header, or fail loudly instead of silently preserving on EPERM.
3. **Maintainer-mode leak in clean env (Q5)** — CI runs with `.env.local` present would trigger a tree-wide INDEX scan. *Recommended for hermetic CI:* scrub `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` in `buildDaemonEnv` and/or set `SPECKIT_CODE_GRAPH_DB_DIR` to a temp dir for harness children. This is the previously-deferred "full hermeticity" option, now scoped precisely.

## 8. Open Questions
None — all five key questions resolved with file:line evidence.

## 9. Limitations
- Static + read-only dynamic analysis; the PID-recycling window (F-005) was reasoned about, not reproduced live (it requires a hard crash + OS PID reassignment race).
- Executor was MiniMax M2.7-highspeed (small model); each iteration's 3-artifact output was validated, but line numbers are as the model read the current file state and may drift ±a few lines after future edits.
- Clean-env blast radius (Q5-7) is reasoned from the launcher scan scope, not executed (would mutate the tree).

## 10. Convergence Report
- Stop reason: `maxIterationsReached` (5/5)
- Questions answered: 5 / 5
- newInfoRatio: 0.85 → 0.25 → 0.95 → 0.95 → 0.95 (rolling avg ≫ threshold 0.05; no early convergence)
- Corruption count: 0 across all reducer runs

<!-- ANCHOR:references -->
## 11. References
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.env.local`
- Iteration narratives: `research/iterations/iteration-001.md` … `iteration-005.md`
- Resource map: `research/resource-map.md`
<!-- /ANCHOR:references -->

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- placeholder; replaced by step_writeback_spec_findings -->
<!-- END GENERATED: deep-research/spec-findings -->
