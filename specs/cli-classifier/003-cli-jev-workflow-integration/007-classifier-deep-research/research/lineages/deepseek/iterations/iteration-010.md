---
title: "Iteration 10 — deepseek-10: The two-backend amendments to 002, 003, 005 and 006"
trigger_phrases: []
---

# Iteration 10 — deepseek-10: The two-backend amendments

## Focus

Angle **deepseek-10** (W4): *The two-backend amendments to 002, 003, 005 and 006.* Maps to question H; answers angle questions 1 to 5. W4 in force: own iterations and the newest sibling files were read first; `swe-08` has not landed (the SWE lineage is at iteration 2), so its probe contract is noted as missing rather than assumed.

## Actions Taken

1. Read the four phase specs for their Jev-only gating lines: `002-advisor-jev-tiebreak-arm/spec.md:3`, `:49`, `:52`, `:73`, `:86-87`, `:92`; `003-goal-verifier-jev-shadow/spec.md:48`, `:54`, `:97`, `:124-128`; `005-compaction-recall-harness/spec.md:91`, `:105-109`; `006-goal-criteria-lint/spec.md:3`, `:43`, `:53`, `:66`, `:86`, `:102-108`.
2. Reused the gate contract defined in this lineage: iteration 1 F1-F6 and N-deepseek-01-1/-2/-3, corrected at iteration 4 F10 (allowlist + model pin), the node-vs-spawn rule at iteration 4 F5, the failure table at iteration 9 F1 and the disagreement rule at iteration 9 F5.
3. Reused the shape and lifecycle findings for `cli-deem`: iteration 6 F6/N-deepseek-06-1 (separate client), iteration 2 N-deepseek-02-1 (lifecycle as documentation over `deem-ctl`), iteration 7 N-deepseek-07-1 (minimum hub).
4. Read the newest sibling set for this wave: `grok/iteration-010.md`, `mimo/iteration-001.md`, `swe/iteration-002.md`, `glm/iteration-001.md`.
5. No phase file was edited; this iteration produces amendment text only, for the synthesis and the later orchestrator leaves.

## Sibling check

- `grok/iterations/iteration-010.md`: its one-phase order and stop lines are adopted as grok's; the amendments below order by dependency, not by rank.
- `mimo/iterations/iteration-001.md`: no gate material; quoted only as the measurement owner.
- `swe/iterations/iteration-002.md`: validator checks; the 006 amendment keeps `check-goal.cjs` read-only per its map.
- `glm/iterations/iteration-001.md`: its D2/D3 amendment rule is honored: the hub text below extends D2's intent (two transports under one hub) without amending the decision.
- `swe-08` (the two-backend probe contract) has not landed; its row-27 question is noted as open in the hub step.

## Findings

**F1 (new; answers angle question 1). The exact Jev-only lines to amend, per phase.**

| Phase | Line | Today | Amendment |
|---|---|---|---|
| 002 | `spec.md:3` | description says the arm is Jev-only | name both backends: "a Python `jev-cli` or local Deem `choice` over the near-tie cluster" |
| 002 | `:49` | "For the arm only: the Python `jev-cli` … and a credential" | add the Deem alternative: a passing `/health` probe (allowlist + model pin) needs no credential |
| 002 | `:86` | "A Jev arm behind `--jev`" | "A judgment arm behind `--jev` (Jev) or `--deem` (local), never both at once" |
| 002 | `:92` | excludes any live, served or hook-time call | replace with iteration 5's N-deepseek-05-2 condition (R1 `keep` + measured connect+call p95 with advisor work in place; shell-out form stays excluded) |
| 003 | `:48`, `:54`, `:97` | Jev arm behind `--jev` and the key gate; shadow value | both backends; the shadow uses whichever passes; goal text prefers Deem (local) |
| 003 | `:124-128` | shadow reads a `jev` value | read the preferred backend's value; record backend + commit |
| 005 | `:91` | any Jev arm is a later amendment | later "judgment arm on either backend", with the Deem precompute form (iteration 8 N-deepseek-08-1) |
| 005 | `:105-109` | census only | unchanged; the census stays zero-call |
| 006 | `:3`, `:53`, `:86` | Jev arm past the stop rule | a judgment arm on either backend; the lint itself stays zero-call |
| 006 | `:43`, `:102-108` | `check-goal.cjs` read-only; sibling scripts | unchanged; the classifier advisory remains a separate sibling (iteration 3) |

[SOURCE: the four `spec.md` lines above, opened this iteration]

**F2 (new; answers angle question 2). The replacement gate text, once, for all four phases.** "A feature is dormant unless a backend is available. **Jev** is available when `command -v jev` succeeds, `jev --version` prints `jev 0.6.2`, and `jev auth status --provider <p>` exits 0 for the provider the feature calls. **Deem** is available when `GET http://127.0.0.1:8300/health` returns HTTP 200 within the feature's probe budget, the JSON parses, `status` is `ok`, `backend` is `torch` or an `ensemble:` name without `stub`, and `model` equals `deem-0.8-v1`. When both pass, the feature uses the backend its switch names; when it names none, Deem is preferred for payload-bearing or high-volume cheap judgments and Jev for typed-semantics or gold-calibrated ones. Each failure prints its own skip line (`jev arm skipped: …` / `deem arm skipped: …`); with neither, output is byte-identical to today and the exit code is unchanged. No path returns a default score or verdict, and no path fails over mid-run." Plus the Deem skip-line table (iteration 1 N-deepseek-01-3) and the commit-pair record rule (iteration 2 N-deepseek-02-3). [SOURCE: iteration 4 F10; iteration 1; iteration 2 N-deepseek-02-3; iteration 9 F5]

**F3 (new; answers angle question 3). Which keep rules change under Deem.**

| Phase | Keep rule component | Change |
|---|---|---|
| 002 | per-call latency record (`spec.md:35`) | the recorded number becomes connect+call p95 on the Node path with the advisor's compiled-route work in place; the Jev spawn-included number is a different row |
| 002 | the four-outcome verdict (sign test, comparators, flip ≤ 0.10) | unchanged; the flip rule is backend-agnostic |
| 002 | conditional Gate 3 calibration (R21) | with Deem, calibration must be fit locally first (temperature 1.0, `LOCAL:27`); do not reuse Jev's calibration data |
| 003 | shadow promotion (`:48`, REQ-014) | unchanged error-rate bars; the shadow threshold must be set on raw, uncalibrated probabilities and validated on the labeled set before it acts |
| 005 | arm bars (p50 ≤ 30 s, recall ≥ stock, kept ≤ 3× stock, fallback ≤ 20%) | the fallback bar becomes the Deem skip rate; a cold pass writes nothing, which is a fallback, not a failure |
| 006 | per-rule precision ≥ 0.8 before the advisory line | unchanged; independent of backend |

[SOURCE: `002/spec.md:35`; `003/spec.md:48`; `005/spec.md:91`; `006/spec.md:108`; `LOCAL:27`; iterations 4 and 8]

**F4 (new; answers angle question 4). The build order by dependency, with each step's rollback.** 1) Phase-text amendments (this iteration's output): no dependency; rollback = revert the doc commit. 2) `cli-classifier` hub + `cli-deem` client (iteration 7 F5 order, iteration 6 N-deepseek-06-1): every Deem call depends on it; rollback = revert the move/wiring and delete the client. 3) 002 census (zero-call) then its arm: the census is independent of any backend; rollback = delete the script/tests. 4) 006 lexical lint (zero-call) then the criterion-quality advisory: rollback = delete the sibling scripts. 5) 005 census, then the precompute background pass: rollback = delete the pass and the state key. 6) 003 slice 0 census, then the labeled set and shadow: the slowest because the operator labels. Nothing before step 3 needs a backend; nothing after step 2 needs a new deadline. [SOURCE: iterations 6, 7, 8; the four phase specs' file lists]

**F5 (new; answers angle question 5). Which phase should not take Deem at all.** 006's mechanical lint must not: it is a lexical, zero-call check whose value is determinism (`006/spec.md:43` keeps `check-goal.cjs` read-only). Its classifier form is a separate later advisory (iteration 3 N-deepseek-03-1) and never a gate. The `custom` provider route is not used by any phase (iteration 6 verdict). And no phase takes a purely live form: 002's arm is offline, 005's is precompute, 003's shadow may run live only past its gate, 006's never does. [SOURCE: `006/spec.md:43`; iteration 3 F7; iteration 6 F6; iteration 8 F6]

**F6 (new; a missing input, stated). The two-backend probe contract (swe-08's row-27 question) has not landed, so the hub step's shared-helper decision is open.** Today's evidence: three probes exist or are planned (the Jev three checks, the Deem health check, `deem-ctl`'s own rule), and row 27's rule extracts a shared helper at the third certain caller. The hub's client (iteration 6) is the natural third caller. The synthesis should either adopt that extraction or record the duplication decision with this gap named. [SOURCE: `swe/iterations/` (only 2 files); iteration 6 N-deepseek-06-1; BASE1 row 27]

## Per-Idea Records

### N-deepseek-10-1: The amendment set above (F1-F3) as the phase text

- **Idea:** Apply F1's line replacements, F2's gate text and F3's keep-rule notes to 002, 003, 005 and 006; no phase gains a global switch and none gains a live form it did not already have.
- **Question:** H.
- **Builds on:** iterations 1-9; the four specs.
- **Value:** Every Planned phase becomes runnable on either backend with the same consent, failure and record rules.
- **Seam:** The spec lines in F1; the plan/tasks files of each phase when the orchestrator applies it.
- **Metric, baseline, harness:** Metric: each phase names both probes and its preference; baseline: today they name Jev alone. Harness: the no-behavior-change fixture (iteration 9 N-deepseek-09-2).
- **Savings:** Structural; no token claim.
- **Cost, latency, privacy:** None; the Deem path keeps payloads local.
- **Two-backend gate:** This is its written form.
- **Rough LOC:** 0 (text); the hub/client is a separate phase.
- **Verdict:** **build-now as amendment text.**
- **Confidence:** Confirmed from the opened lines.

### N-deepseek-10-2: The hub step owns the third probe's fate

- **Idea:** The `cli-classifier` phase decides whether the Deem probe becomes a shared helper (row 27) or stays duplicated; the evidence for extraction is the third certain caller (the hub client), the evidence against is that no caller ships yet.
- **Question:** H, G.
- **Builds on:** F6; iteration 6; iteration 7.
- **Value:** Closes the row-27 question with a named owner instead of leaving it dangling.
- **Seam:** Hub's client folder; `deem-ctl:59-66` as the reference rule.
- **Metric, baseline, harness:** Metric: one probe implementation named in the hub, or a recorded duplication note; baseline: three copies today.
- **Savings:** Maintenance only.
- **Cost, latency, privacy:** None.
- **Two-backend gate:** The probe is the gate; its location is the question.
- **Rough LOC:** 0 now; ~40-60 if extracted.
- **Verdict:** **build-now as a decision row in the hub phase.**
- **Confidence:** Confirmed from the counts; open pending swe-08.

### Dropped: any amendment that adds a global backend switch

- **Idea:** A single `--backend` flag shared by all phases.
- **Reason:** Per-feature switches remain the contract (iteration 1; BASE2 row 42); a global flag cannot express per-feature preferences and hides which backend a result used. Dropped.
- **Confidence:** Confirmed from the baseline rule.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| Line-level amendment map for 002/003/005/006 | **new** | F1 table |
| One replacement gate text covering both backends and all skip lines | new | F2 |
| Keep-rule deltas under Deem (latency record, calibration, fallback bar) | new | F3 |
| Six-step build order with rollbacks; backend-free until step 3 | new | F4 |
| 006 takes no classifier; `custom` used by no phase | new | F5 |
| The row-27 shared-probe question is open pending swe-08 | new (gap) | F6 |
| Jev gate and skip lines | restated | BASE2 section 11 |

## Hand-off

- Synthesis: this is the lineage's answer to question H's amendment half; every phase recommendation carries F2's gate text.
- The orchestrator's later leaves: apply F1-F3; the hub phase inherits N-deepseek-10-2; the first arm ships N-deepseek-09-2's fixture.
- No further iteration follows: the loop is at its cap (10/10).
