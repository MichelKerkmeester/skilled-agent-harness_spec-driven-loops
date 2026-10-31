---
title: "Research: Improve, Refine And Expand The Jev Spec-Track Narrowing (deepseek lineage)"
trigger_phrases:
  - "jev track narrowing research"
  - "score-track-narrowing analysis"
  - "deepseek lineage research"
---
# Research: Improve, Refine And Expand The Jev Spec-Track Narrowing

**Lineage:** `deepseek` (cli-pi, DeepSeek V4.1 Flash, reasoning max) — 5 iterations
**Session:** `fanout-deepseek-1790979783604-cne6rp`
**Packet:** `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research`
**Subject:** `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` (cli-jev feature 017)
**Recorded result under study:** `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330 jev_version=0.6.2 provider=official model=jev-1.13.0`, p50 330 ms, p95 391 ms.
**Stop reason:** maxIterationsReached (stopPolicy: max-iterations; 5 of 5 iterations ran)

---

## 1. Executive Summary

The keep is real but narrow, and it is narrower than the headline reads. On the recorded corpus Jev beats the best lexical baseline by 11.3 points (97 vs 68 of 256), but the keep rule's margin condition is a 10.0-point floor, so the verdict sits 3.4 rows above failure; margin and sign test both score the same difference (A-B is identically W-L); and a four-row swing flips the verdict. The corpus is a hash-ordered 20-per-track sample of packet descriptions (256 kept of 1,727 usable), so the questions are author-written descriptions, not the prompts Gate 1 receives — on the 14 gold-bearing paraphrase probes, ripgrep beats Jev 8 to 2. Both baselines are structurally handicapped in task-specific ways (lookup self-exclusion and 80-percent single-phrase coverage; ripgrep token-presence plurality), which inflates the apparent gain's meaning while keeping it real as measured.

The strongest immediate wins are trust and calibration, not new capability: pin the row set, fix out-dir history loss, adopt probability-aware aggregation (+1 row on recorded calls, no new calls), report decided-subset accuracy and margin slack, and re-run before treating the 10-point margin as established. The measurement is otherwise mechanically sound — exact BigInt sign test, clean 811/811 attempt-1 run — so the trust problem is exchangeability and missing row identity, not arithmetic.

Default-on serving is feasible in shape — the `cli-jev` transport and `JEV_TRANSPORT` route already exist and the parent D1 policy (dormant unless auth passes, no secret) already governs availability — but it is gated on an operator decision, and the facts argue for assistive, no-hit-only serving: one call (p50 330 ms) roughly doubles the entire 200 ms p95 budget the Gate 1 lookup holds itself to, and the pick is wrong more often than right (37.9 percent row accuracy, 48.7 percent on decided rows, clustered by track).

---

## 2. Findings By Question

### Q1 — What drove the measured result

- **The verdict arithmetic is a 29-net-win margin over a 25.6-row floor.** `decideVerdict` checks coverage, margin, sign test and flips in order; margin fails below A-B = 25.6 and the recorded A-B is 29, so four rows decide the outcome. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:880]
- **Margin and sign test are not independent.** A-B is identically W-L (each discordant row moves both by one), so the rule scores one difference twice: once against a magnitude floor, once as a sign-test tail (p = 0.006330, exact BigInt). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:948]
- **The questions are a stratified hash sample of packet descriptions, not Gate 1 prompts.** 256 kept of 1,727 usable; system-speckit 1,009 usable to 20 kept, system-deep-loop 261 to 20, hooks 103 to 20, cli-orca 1 kept; 85 percent of usable text is discarded by the cap. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:330]
- **The accuracy ranking flips by input family.** `paraphrase probes: total=20 gold-less=6 lookup=0/14 ripgrep=8/14 jev=2/14`; on paraphrases Jev abstained on 9 of 14. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt]
- **Both baselines are handicapped by construction.** Lookup requires one phrase key to cover 80 percent of query tokens after dropping tokens < 3 chars and keeping only the first 8, and `lookupPick` removes the question's own folder's rows by design — 17/256. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:146] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:456] Ripgrep scores files by how many question tokens they contain and takes a track plurality — 68/256. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:512]
- **Abstention and instability are counted as errors.** 57 abstained (`none`) and 3 unstable of 256; both are wrong for A by construction. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:937]
- **Cost is per call.** 811 planned calls / 905,891 estimated input tokens / 1339.6 s wall; p50 330 ms and p95 391 ms are single-invocation wall times, ~1.7-2x the cold lookup's 200 ms p95 budget. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:43]

### Q2 — How to raise accuracy or lower cost

- **The margin is exactly a 10-point-gain floor** (10*(A-B) >= M ⇔ A >= B + M/10), and Jev passed 10.0 by 1.3 points. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:883]
- **Abstention is lost, not latent:** zero of the 57 `none`-modal rows had the gold track picked in any order; decided-subset accuracy is 48.7 percent, still under half. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl]
- **Probability-aware aggregation is a free +1 row:** summing recorded `pickProb` across orders instead of taking the modal key gives 98 vs 97 with no losses; scoring never reads those fields today. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1357]
- **Order rotation is not the tax it looks like:** per-order right counts are 94/95/96; abstains 58/56/57.
- **Cost is 96.8 percent options:** ~4,474 chars (~1,118 tokens) per call, option block 4,330 chars, question ~108 chars. A 5-option two-stage shortlist ≈ 68 percent less input (amendment to call shape). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1240]
- **A larger corpus buys power, not pick accuracy**, at ~3 calls per row; tracks with 1-12 rows cannot support per-track claims.
- **The question family is the accuracy gap:** the probes fixture holds 120 rows but only latin paraphrase is read; the frozen `prompt-set.json` is unused by this scorer.
- **Amendment cost is pinned:** 978-line suite across ten describes; the rule itself states call-shape/keep-rule changes are amendments, not tunings. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:502] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:53]

### Q3 — How to make the measurement more trustworthy

- **Rows are 16 heterogeneous clusters, not 256 exchangeable draws.** Per-track accuracy spans 0.15 (sk-design 3/20) to 1.00 (cli-orca 1/1); abstention spans 0 to 0.80; sk-design alone abstained 16/20 and three tracks hold 32 of 57 abstentions. The exact one-sided sign test assumes independent rows. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:813]
- **The row set is unpinned.** `report.json` stores counts only; `calls.jsonl` stores no question text; questions are re-derived from live `description.json`; the fixture's `promptSetHash` is never checked and the manifest's slot stays null. Two runs can report K=256 with different rows. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1474] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:79]
- **Out-dir reuse destroys evidence:** `calls.jsonl` is truncated on first append and `report.json` is overwritten; already logged as an unchased P2 in the 017 session. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1113] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/scratch/w3-session/session-evidence.md:181]
- **Requalify is print-only and provider/model-scoped;** same-model reruns silently overwrite and no repeatability run is required. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1394]
- **The comparison already uses the stronger lexical method** (ripgrep 68 > lookup 17), which is fair; only the path-only recipe of the documented set is used, and structured/count recipes exist unused. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:628] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:96]
- **Labels are unaudited;** the sibling feature 022 fixture had its target wrong on every row, showing label risk is real in this family. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md]
- **What is already sound:** exact BigInt p with no float threshold comparison; 811/811 calls measured on attempt 1 with exit 0, so latency has no retry contamination. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:832]

### Q4 — Where else in `.skilled` the same judgment pays off

- **The judgment is served nowhere today** — the 017 record: "This keep serves nothing, because serving a pick needs a later phase, and opening one is the operator's call." [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md:66]
- **Gate 1 is the highest-reach insertion** across all runtimes (root `AGENTS.md`), and `/speckit:search` explicitly declares semantic matching unsupported today. [SOURCE: file:AGENTS.md:65] [SOURCE: file:.skilled/commands/speckit/search.md:138]
- **Spec-folder suggestion already measures the same judgment at finer granularity** with an operator label gate and the same keep-rule shape (`keep K=40 A=39 B=30`). [SOURCE: file:.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md:42]
- **Clarify default uses identical geometry** (3 rotated orders, `none`, first-alternative baseline, 30-row label gate; `keep K=54 A=28 B=15`). [SOURCE: file:.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md:30]
- **The advisor suggested-order eval already implements probability aggregation** (mean probability ordering, 2,200 ms budget, 241 prompts) — the I2 recommendation has a precedent. [SOURCE: file:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md:28]
- **The scorer pattern is reused across the classifier family** (injection screen, completion claims, hallucination grader), so trust upgrades multiply if applied once. [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md:18]
- **Trigger-phrase quality is a lower-risk offline insertion** (the generator already buckets rejected phrases). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:256]
- **Serving substrate exists:** `cli-jev` transport (never fails over silently) and the measured `JEV_TRANSPORT` Pi route (`adopt`, agreement 95.5, p95 340/387 ms, cost 0.0022 per 100). [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:22] [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:79]

### Q5 — What a default-on integration needs, cost and risk

- **Operator-gated by construction;** this phase is research-only. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/spec.md:77]
- **Fleet policy exists:** D1 "Jev only, dormant unless `jev auth status` passes. Jev gets no secret", with "Jev first, else Deem". [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/goal.md:47]
- **Latency is the headline cost:** p50 330 ms against a 200 ms lookup budget; a no-hit-only or advisory trigger is the mitigation. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt]
- **Validity window:** jev 0.6.2 / official / jev-1.13.0 and the hashed option set (changes when any track description changes); requalification must be explicit. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:585]
- **Wrong picks are the dominant product risk:** 37.9 percent row / 48.7 percent decided accuracy; default-on converts Gate 1's fail-open no-hit into a wrong-answer mode. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json]
- **Abstention must be a first-class outcome** (57 rows, concentrated: sk-design 16); **privacy** changes (user prompts leave the machine) need explicit operator acceptance.

---

## 3. Ranked Recommendations (Build List)

| # | Recommendation | Class | Effort | Evidence |
|---|----------------|-------|--------|----------|
| 1 | Pin the row set (ids, question hashes, gold) and the option-set/model tuple into `report.json` or a companion file; version or freeze `--out` so history survives | Trust | Small | Q3: report stores counts only; P2 truncation record |
| 2 | Adopt probability-aware aggregation (sum/mean `pickProb`) and report decided-subset accuracy plus distance-to-threshold for each keep condition | Accuracy + trust | Small (scoring-side, amendment) | Q2: 98 vs 97, no losses; Q3: 3.4-row slack invisible |
| 3 | Attack the concentrated abstention clusters (sk-design 16/20, sk-doc 8, sk-communication 8) by inspecting those tracks' questions/descriptions, and promote a second scored question family (latin paraphrase probes and/or `prompt-set.json`) | Accuracy | Medium (amendment) | Q2/Q3: abstention concentration; probes 2/14 vs 8/14 |
| 4 | Repeat the run (n >= 2) and add a cluster-aware bootstrap over the 16 tracks; audit a 20-30 row wrong-pick sample | Trust | Medium | Q3: clusters 0.15-1.00; margin 3.4 rows; 022 label precedent |
| 5 | Two-stage shortlist (N candidate tracks, then a choice among N+1 options) to cut the 96.8 percent option-block payload (~68 percent less input at N=5) and reduce distractor pressure | Cost | Medium (call-shape amendment) | Q2: payload arithmetic |
| 6 | Advisory-first serving in Gate 1: call only when the lexical lanes return nothing or disagree, define `none` as fall back/ask, fail open on timeout, reuse the `cli-jev` transport, remain dormant unless auth passes | Integration | Medium | Q4: search front door declares semantic gap; Q5: latency, D1 |
| 7 | Port the trust upgrades (1, 2, 4) to the shared scorer pattern used by alignment suggestion, clarify default, injection screen, completion claims and the advisor eval | Family-wide | Small-medium | Q4: five sibling surfaces share the pattern |
| 8 | Longer term: packet-level narrowing for search/resume (reusing the folder-suggestion label pipeline) and an offline trigger-phrase quality judge | Reach | Large | Q4: finer-grained judgments already measured; phraseQuality bucket exists |

Ordering logic: 1-2 are cheap and make every later verdict more trustworthy; 3-4 measure before promising; 5-6 are the integration path only after 1-4; 7-8 are reach expansions.

---

## 4. Convergence Report

| Field | Value |
|-------|-------|
| Stop reason | `maxIterationsReached` (stopPolicy: max-iterations; pre-cap convergence telemetry only) |
| Total iterations completed | 5 of 5 |
| Questions answered | 5 of 5 (Q1-Q5) |
| newInfoRatio trend | 0.90, 0.72, 0.62, 0.58, 0.55 (average 0.674) |
| Distinct sources consulted | 25+ files across scorer, libraries, fixtures, recorded run output, sibling scorers, commands, goal docs |
| Weakest single source | sibling feature catalogs (contracts read, not re-executed) and the offline payload arithmetic (derived from the run's own estimate, not a new run) |

Convergence note: novelty declined monotonically but never approached the 0.05 threshold; under max-iterations policy no early stop was legal, and later iterations broadened the angle (trust, reuse surfaces, integration) rather than re-covering the scorer.

## 5. Open Questions And Required Integration Data

- The Gate 1 no-hit rate is unmeasured; the fraction of prompts a no-hit-only trigger would serve is unknown.
- `pickProb` calibration (mean 0.641 on picks) is observed but not validated; a threshold-based confidence gate needs a calibrated curve.
- Run-to-run variance is unknown until a repeat run exists.
- The 6 gold-less paraphrase probes are dropped from the denominator; which probe cases they are, and why, is unrecorded.

## 6. Sources

Scorer and libraries: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`, `lookup-trigger-index.mjs`, `measure-cold-lookup.mjs`, `generate-trigger-index.mjs`, `lib/normalize.mjs`, `lib/rg-lane.mjs`, `README.md`, `fixtures/semantic-probes.json`, `fixtures/prompt-set.json`, `tests/score-track-narrowing.vitest.ts`.
Recorded run: `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/` (`stdout.txt`, `out/report.json`, `out/calls.jsonl`), `implementation-summary.md`, session evidence.
Siblings and policy: `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`, `specs/cli-jev/003-cli-jev-workflow-integration/goal.md`, `AGENTS.md`, `.skilled/commands/speckit/search.md`, `.skilled/skills/system-spec-kit/SKILL.md`, feature catalogs for alignment suggestion, clarify default, suggested-order eval, injection screen and Pi transport, `.skilled/skills/cli-classifier/SKILL.md`, `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`.
