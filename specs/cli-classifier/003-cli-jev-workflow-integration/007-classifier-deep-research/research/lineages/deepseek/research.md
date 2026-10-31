---
title: "DeepSeek Lineage Synthesis — Classifier Round 3: seams, gating and failure paths"
description: "Terminal synthesis of the deepseek lineage in 007-classifier-deep-research: ten forced iterations on the two-backend gate, the cli-deem lifecycle, validators, reduction seams and deadlines, the flip set, the custom-provider failure side, the hub move, the live-seam lifecycle, the two-backend failure table and the phase amendments."
trigger_phrases:
  - "classifier round 3 deepseek lineage"
  - "two-backend gate failure paths"
  - "deem availability check"
importance_tier: "important"
contextType: "research"
---

# DeepSeek Lineage Synthesis — Classifier Round 3

Lineage `deepseek` (cli-pi, `deepseek-v4.1-flash`, max, session `fanout-deepseek-1790490452777-942a1f`) in `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Lens: **seams, gating and failure paths, including the two-backend gate**. Ten forced iterations, `stopPolicy: max-iterations`, convergence off. Baselines: `../004-deep-research-expansion/research/research.md` (BASE2, R1-R22, rows 44-72) and `../001-deep-research/research/research.md` (BASE1, rows 1-43). Every load-bearing claim names where it was opened; restated baseline material is marked.

## 1. Executive summary

- **The Deem half of the two-backend gate is now exact and code-derived.** Pass condition: HTTP 200 within the probe budget, JSON parses, `status == "ok"`, `backend` is `torch` or an `ensemble:` name without `stub` (the tested `deem-ctl` allowlist, `deem-ctl:59-66`), and `model == "deem-0.8-v1"`. Failures print four skip lines; loading weights and a mid-update restart both read as "not reachable". BASE2 defined only the Jev half.
- **The live budget is now measured in code, not assumed.** Advisor chain: settings 3,000 ms → shim child kill 2,500 ms → internal 2,200 ms; every failure returns `{}`. PreCompact: 3,000 ms host, 1,800 ms internal, deadline-driven skips. Routing CLIs have no hook deadline. Only a shell-out spawns; a Node-native Deem fetch costs connect + ~60-80 ms warm.
- **Exactly one flip survives contract review, conditionally:** the advisor live form (BASE1 row 1) under the Node-native path, and only after R1 prints `keep` plus a measured connect+call p95 with the advisor's own compiled-route work in place. Rows 5, 38, 40 and the grok-04 latency/egress set do not flip. `002/spec.md:92` already freezes the exclusion until amended.
- **`cli-deem` is a separate small client, not a `custom`-provider wrapper.** The wrapper fails at request build for `choice`/`score` (400), needs a bearer Deem ignores, and `auth status --provider custom` would report a dead server as available. The separate client carries Deem's failure map and no fake secret.
- **The hub move (D2) is a counted engineering job:** 92 files / 927 references across nine surface classes; an alias cannot carry a `metadata` hub, so the plan is skeleton-first, `git mv`, literals, regeneration, two-stage replay — each step revertible.
- **No model-bearing survivor is build-now.** The build-now set is zero-call or structural: the gate text, the failure table, the no-behavior-change fixture, the AC_COVERAGE existence check, the hub, and 002's unchanged census.

## 2. What this lineage changes against the baselines

| Item | Change | Evidence |
|---|---|---|
| Two-backend gate, Deem half | Exact probe: `/health`, allowlist + model pin + timeout; four skip lines; no cache file; no retry | iteration 1 F1-F6; iteration 4 F10 |
| Gate failure table | 400 / 413 / 404 / 405 / 500 taxonomy; loading = refused; port collision = OSError | iteration 1 F5-F6 |
| `deem-ctl` audit | Lifecycle as built: start pinning, update/rollback/prune, exit 0-4; the stopped-server smoke gap; the no-wait stop race | iteration 2 F1-F11 |
| Validators | 40-rule map with kind and residue; six pattern proxies; `AC_COVERAGE` checks presence, not existence; `check-goal.cjs` four checks and their residues | iteration 3 F2-F6 |
| Reduction deadlines | Budget chains and headroom; rows 1/5 partial, rows 38/40 no; degrade path | iteration 4 F1-F10 |
| Flip set | Frozen contracts and callers per seam; the constant is test-pinned; the advisor already shells out inside its budget; one conditional flip | iteration 5 F1-F8 |
| `custom` provider | Full failure map against Deem; no scheme guard; `auth status` trap; separate-client verdict | iteration 6 F1-F6 |
| Hub move | 92 files / 927 refs; frozen literals; alias cannot carry a metadata hub; five-step plan | iteration 7 F1-F8 |
| Live seam | Warm or skip; host `precompute` contract with the "still leads" clause; no repo dispatch; background pass | iteration 8 F1-F6 |
| Failure and kill | Combined two-backend table; no-behavior-change fixture; printed kill lines; no failover | iteration 9 F1-F6 |
| Phase amendments | Line map for 002/003/005/006; replacement gate text; keep-rule deltas; build order | iteration 10 F1-F6 |
| Jev gate and its skip lines | Restated, never silently changed | BASE2 section 11 |

## 3. The two-backend gate (this lineage's ownership)

**Jev available** when `command -v jev` succeeds, `jev --version` prints `jev 0.6.2`, and `jev auth status --provider <p>` exits 0 for the provider the feature calls (BASE2 section 11, restated).

**Deem available** when `GET http://127.0.0.1:8300/health` returns 200 within the probe budget, the body parses as JSON, `status == "ok"`, `backend` is `torch` or an `ensemble:` name without `stub`, and `model == "deem-0.8-v1"` (or a per-feature pinned id). Probe budgets: 2,000 ms offline, 500 ms in hooks.

**Skip lines (Deem).** `deem arm skipped: server not reachable` (refused / timeout / non-200 / parse failure / warming up / mid-update restart); `deem arm skipped: stub backend`; `deem arm skipped: unexpected model <found>`; `deem arm skipped: health response malformed`.

**Preference.** Per-feature switch only (no global switch). Deem preferred for payload-bearing or high-volume cheap judgments, Jev for typed-semantics or gold-calibrated ones. With neither: byte-identical output, same exit code, no default score or verdict. No mid-run failover; a backend disagreement is a comparison data row with backend and commit recorded.

**Records.** Every Deem measurement carries the `models/current` model sha and the `git` source sha; `/health` does not expose the commit.

## 4. Angle results

1. **deepseek-01 — the gate as code.** The probe, its failure taxonomy and its timeout policy; loading weights = connection refused; MCP has no HTTP surface; probe costs zero model passes.
2. **deepseek-02 — the lifecycle.** `deem-ctl` audited line by line (ALL-1): health allowlist, start pinning, update/rollback/prune. The stopped-server update skips the smoke decision; `stop_server` never waits for exit; the commit pair lives only in `status`.
3. **deepseek-03 — validators.** All 40 registry rules mapped; six approximate meaning with patterns and none reads meaning; `AC_COVERAGE` never verifies a cited line exists (the one no-model spin-off); `check-goal.cjs`'s four checks each leave a named residue; the classifier's only seat is a separate exit-neutral advisory.
4. **deepseek-04 — deadlines.** Advisor 3,000/2,500/2,200 with `{}` fail-open; PreCompact 1,800 internal with skip-on-exhaustion; routing CLIs have no clock; PostToolUse 5-10 s but no output-rewrite contract; two call paths (connect vs spawn); rows 1/5 partial, 38/40 no; the degrade table.
5. **deepseek-05 — flip set, seam side.** Frozen contracts, owners and callers found by search; the advisor constant is pinned by three tests and the hub doc; the advisor already shells out to `compiled-route.cjs` inside its budget; `002/spec.md:92` freezes the exclusion; contest of grok-04's spawn-included bar for the Node path.
6. **deepseek-06 — `custom` provider, failure side.** No guard refuses loopback/plain HTTP (recorded probe evidence); the bearer must exist pre-socket and Deem ignores it; the full exit map (2/3/4/1/4 plus KeyError 1); `auth status --provider custom` passes with no server; separate client verdict.
7. **deepseek-07 — hub move.** 92 files / 927 occurrences; the seven-hub guard list and tri-state flag list are literals; eleven parent-hub surfaces of which only five are gated (row 6, the advisor vocabulary, is the silent breaker); an alias cannot carry a metadata hub; five-step order.
8. **deepseek-08 — live seam.** Warm or skip (3,368 MB idle; ~10 s cold; update restart is the cold case); the host `precompute` contract ("kept … if the conversation it ran over still leads"); no repo route without a plugin; background pass as the only live compaction home.
9. **deepseek-09 — failure and kill.** One failure table for both backends; the no-behavior-change fixture; frozen contracts per survivor; printed kill lines; no averaging or failover.
10. **deepseek-10 — amendments.** Line map for the four phases; one replacement gate text; keep-rule deltas under Deem; six-step build order with rollback; 006 takes no classifier; the row-27 shared-probe question stays open pending swe-08.

## 5. Verdicts from this lens (two-backend gate on every row)

| Idea | What it is | Seam | Metric, baseline, harness | No-backend behavior | LOC | Verdict |
|---|---|---|---|---|---|---|
| N-deepseek-01-1 | The Deem probe contract | `deem_server.py:772-777`, `:845-846` | 4 refusal fixtures print their lines; no baseline existed | skip line, exit 0, byte-identical | 25-40 | **build-now (text)** |
| N-deepseek-01-2 | Probe timeouts 2,000 ms / 500 ms; never start the server | probe call site; `settings.json:110`, `:115`, `:222` | sleeping-stub fixture; UNKNOWN today | skip; no start | 3-5 | **build-now (text)** |
| N-deepseek-01-3 | Skip-line table + preference rule | gate text | refusal matrix; no lines existed | byte-identical | ~6 | **build-now (text)** |
| N-deepseek-02-1 | Adopt `deem-ctl`; no rebuild | `deem-ctl:9-16`, `:190-206` | zero new lifecycle code; tested (`LOCAL:68`) | operator tool only | 0 | **build-now (docs)** |
| N-deepseek-02-2 | Probe = deem-ctl allowlist + pin | `deem-ctl:59-66` | wrong-model fixture refused | skip | 1 | **build-now (text)** |
| N-deepseek-02-3 | Commit pair on every Deem record | `deem-ctl:97-99`, `:195-202` | 100% of rows carry the pair; no format existed | n/a | ~5/arm | **build-now (contract)** |
| N-deepseek-02-4 | Idle footprint options | `model-server-supervision.cjs:224-234` | 3,368 MB idle (`LOCAL:43`) | n/a | 0 now | **later (operator)** |
| N-deepseek-02-5 | Smoke on start | `deem-ctl:105-121`, `:166-167` | corrupt-checkpoint start rejected; today passes | n/a | ~3 | **next (propose to operator)** |
| N-deepseek-03-1 | Criterion-quality advisory | `check-goal.cjs:681-689` | precision ≥ 0.8 on labels; no labels today | `advisory skipped: …`, exit 0 | 120-160 | **later (no gold)** |
| N-deepseek-03-2 | Placeholder-in-spirit advisory | `check-goal.cjs:32-42` | agreement with labels; UNKNOWN | skip, exit 0 | 80-120 | **drop (rare)** |
| N-deepseek-03-3 | AC_COVERAGE evidence-existence check | `rules/check-ac-coverage.sh` | dead-citation count; floor counts presence | none needed | 80-120 | **build-now (spec-kit spin-off, no model)** |
| N-deepseek-04-1 | Per-path budget rule | seam budgets | p95 per path; spawn UNKNOWN | n/a | ~20 harness | **build-now (rule)** |
| N-deepseek-04-2 | Precompute/remainingMs only for compaction | `compact-inject.ts:440-463`, `:519-531` | merge p50/p95; UNKNOWN | stock path untouched | 40-80 | **next** |
| N-deepseek-04-3 | Row-1 revival = connect+call + R1 keep | `002/spec.md:92` | as N-04-1 plus R1 | exclusion until amended | 0 | **build-now (text)** |
| N-deepseek-05-1 | Three-check flip gate | contracts F1 | each flip names contract + path | n/a | 0 | **build-now (text)** |
| N-deepseek-05-2 | 002 exclusion replaced by the two-path condition | `002/spec.md:92` | R1 keep + p95 with advisor work | today's exclusion | 0 | **build-now (text)** |
| N-deepseek-06-1 | `cli-deem` separate client | `deem_server.py:843-904` | connect+call p95; LOCAL 60-80 ms warm | client absent, nothing changes | 120-180 | **build-now (hub phase)** |
| N-deepseek-06-2 | Two probes, never one | `jev_cli/__init__.py:419-421` | env key + dead server must skip | byte-identical | 0 | **build-now (text)** |
| N-deepseek-07-1 | Minimum `cli-classifier` hub | `mode-registry.json` model | parent-skill-check + two-stage replay | routing as today | ~8 files | **build-now (D2 mandate)** |
| N-deepseek-07-2 | Five-step move plan | F5 steps | zero legacy sentinels after step 4 | old hub serves until green | 0 | **build-now (plan)** |
| N-deepseek-08-1 | Background precompute pass | Stop hooks `settings.json:158-178`; reader in `compact-inject` | hit/stale rate; R19 census | no failed probe writes; path untouched | 80-150 | **next (conditional on census + labels)** |
| N-deepseek-08-2 | Printed kill lines | arm logs | the four lines | n/a | ~4 | **build-now (text)** |
| N-deepseek-09-1 | Failure table + disagreement rule | phase specs | dead-backend fixture: no byte, no mtime change | this is its form | 0 | **build-now (text)** |
| N-deepseek-09-2 | No-behavior-change fixture | first arm's tests | byte-identical, zero writes, exit 0 | the proof | 60-100 | **build-now (with first arm)** |
| N-deepseek-10-1 | Phase amendment set | F1 lines | each phase names both probes | today's text | 0 | **build-now (text)** |
| N-deepseek-10-2 | Hub owns the shared-probe decision | hub client | one implementation or a recorded duplication | n/a | 0-60 | **build-now (decision row)** |

## 6. Failure table (compact) and kill lines

Jev: exit 3 before a call → `jev arm skipped: no credential`; exit 3 mid-run → stop, rows `partial`; exit 4 → one retry, row `unmeasured`; malformed/exit 1 → `unmeasured`; npm `jevctl` first on PATH → `jev arm skipped: version` with found version and path. Deem: refused/timeout/warming/mid-update → `deem arm skipped: server not reachable`; stub → `… stub backend`; wrong id → `… unexpected model <found>`; 400/413 → row `unmeasured`; 500 → one retry offline, then `unmeasured`; the precompute pass writes nothing; the advisory exits 0 with its skip line. No path returns a default score or verdict; no path persists anything beyond row status.

Kill lines: `verdict: kill` (R1); `kill: latency`; `kill: cold <n>%`; `kill: stale cache`; `kill: accuracy`; Deem's own `deem arm skipped: …` for a whole run or a changed commit pair; `parent-skill-check: failed` for the hub.

## 7. Corrections carried from steering (confirmed in code)

The probe allowlist replaces the iteration-1 denylist; the stub line is `deem_server.py:979-984`, `serve_forever` `:1007`, `KeyboardInterrupt` `:1006-1008`; the vendor `0.0.0.0` is `README.md:226`; the idle failsafe is `hf-model-server.cjs:52`; the rollback restart swallows failure at `deem-ctl:171`; smoke greps `"choice"` and proves no error, not sanity; the two-retained-model disk estimate is ~3.5 GB; the launchd job runs `deem-ctl update` (glm-001 opened the plist); probe frequency/caching/mid-session stop is answered (iteration 4 F9).

## 8. Open unknowns and what would confirm them

- **Connect cost** (loopback fetch from an already-running hook process): unmeasured. Confirm with 100 loopback calls from a Node hook; it gates N-04-1/N-04-3.
- **Deem's accuracy on this repository's judgments**: unmeasured (`LOCAL:52`). Confirm with a labeled set and a pre-registered precision floor; it gates every `next` verdict.
- **The compaction merge's own spend**: uncounted. Confirm with the R19 census's per-boundary timings; it gates N-04-2/N-08-1.
- **The row-27 shared probe**: open until swe-08 lands; the hub client is the candidate third caller (iteration 10 F6).
- **The live advisor form's end-to-end p95**: does not exist. Confirm inside the advisor process with `enrichCompiledRoutes()` active (iteration 5 F7).

## 9. Where this lineage stops

Ten iterations, `maxIterationsReached`. No file outside this lineage directory was written; no `jev` call was made; the Deem server was never called. The synthesis reserves recommendation ranks for the fresh Opus leaf; this file reports, it does not rank.
