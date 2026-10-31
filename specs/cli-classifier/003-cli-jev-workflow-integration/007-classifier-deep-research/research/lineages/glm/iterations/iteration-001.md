# Iteration 001 — glm-01: Should any feature use the served Deem at all?

- **Lineage:** `glm` (cli-pi, glm-5.3-flash, reasoningEffort max) · session `fanout-glm-1790490452777-942a1f` · 2026-09-27
- **Wave:** W1 (independent) · **Maps to:** A, B, H · **Timestamp (research):** 2026-09-27T06:39:30Z

## Focus

Angle `glm-01` (research-angles.md:333-345): the 0.8B is served, fast and free, but uncalibrated and unmeasured on this repository's judgments — is speed without measured quality a reason to wire it anywhere yet? Plus the angle's other four questions, the reopened drops (BASE1 rows 1 and 5), and the update mechanism as built (the glm-01 refinement, research-angles.md:897).

## STEER

No `steer.md` exists in this lineage yet (verified before this iteration; the lead has not written one). Section 7 read: ALL-1 through ALL-8 (research-angles.md:863-874) and the `glm-01` / `glm (all)` refinements (:897, :899) bind. ALL-2's `LOCAL:55-61` reads as `LOCAL:55-70`. No refinement conflicts with the angle; the refinement sharpens it: **verdicts against D2/D3 are proposed amendments, not drops.**

## Sibling check

Independent: no round-3 sibling file read.

## Actions Taken (reads only; nothing executed, nothing written outside this lineage)

1. Read the angle and section 7: `context/research-angles.md:333-345`, `:859-905`.
2. Read the as-built control script `/Users/michelkerkmeester/.local/share/deem/bin/deem-ctl` (208 lines) — specifically :5-7 (purpose: pulls model+source, restarts, rolls back), :12-15 (exit codes; 3 = updated version failed, previous restored), :58-68 (`health_ok` parses `backend`, refuses `stub`; `wait_healthy`), :79-98 (`smoke_decision` — "one real decision proves the loaded weights work"; `current_model_sha` = basename of the `models/current` readlink), :139-172 (`update`: switches `models/current` with `ln -sfn` at :163, then `start_server`+`smoke_decision`, restores the previous link and exits 3 at :169-172), :181 (cleanup keeps only remote+local+current), :196-198 (`status` prints model+source commits). Read only — `status`/`update --check` never executed (ALL-1).
3. Read the launchd agent `/Users/michelkerkmeester/Library/LaunchAgents/com.skilled.deem-update.plist` (21 lines): program = bare `deem-ctl update` (:7-11), `StartInterval` 21600 = every 6 hours (:12-13), `RunAtLoad` true (:14-15), both output streams to one log (:16-19). Its existence and first-run exit 0 are recorded at `context/deem-local.md:70` (LOCAL).
4. Read LOCAL: `context/deem-local.md:20-28` (install, 2.1 GB under `~/.local/share/deem/`, nothing in any repository), `:34-44` (p50 60.2-60.5 ms, p95 62.8-78.5 ms, 3,368 MB footprint, 814 MB RSS, ~10 s to healthy), `:50-53` (spawn+connect cost unmeasured; no key, no quota, no data leaves the machine; quality unmeasured here; card's 96.3% cited, no JevBench score), `:55-70` (the operate-and-update table; :65 = update row incl. the one-real-`choice` requirement and exit-3 restore; :66 = `rm -rf ~/.local/share/deem`; :68 = both update paths tested 2026-09-27; :70 = the 6-hourly+at-login launchd schedule, health check parses `backend` and refuses `stub`).
5. Read vendor claims, labeled: `context/deem-main/docs/MODEL_CARD_08B.md:18-29` (96.3% long-policy hold-out, trap 91.8%, 362 ms CPU, 0.9 GB int8 — the Rust CPU/int8/x86 stack, not what serves here, per ALL-5) and `context/deem-main/eval/tare/leaderboard.md:1-25` (vendor-run harness; its 0.8B-class entry `deem-v2`, backbone Qwen3.5-0.8B: macro acc 0.6788, ECE post —, flip 0.9680, :14). Whether `deem-0.8-v1` (the served checkpoint) is the same lineage as the leaderboard's `deem-v2` is UNKNOWN from these files; confirming it needs the HF model card's lineage note.
6. Read the fitness checklist and red flags: `001-deep-research/context/repo-rules-digest.md:52-109` (Q1-Q15, red flags; Q1 sources `prevent-overengineering.md:60,77-78` and `evidence-and-proof.md:128-136`).
7. Read the parent's decisions: `specs/cli-jev/003-cli-jev-workflow-integration/goal.md:49-51` (D1 two-backend gate; D2 the `cli-classifier` hub; D3 the served 0.8B "kept current with Deem's releases. Nothing else is built") and `:131` (D3 amendment 2026-09-27: the operator chose 0.8B bf16 over the 9B and "asked that it auto-update whenever Deem releases a new version").
8. Read the reopened drops: `001-deep-research/research/research.md:572` (row 1: the grader's rank; "the classifier it does reach runs on 0 of 8 cases"; Later for R5 and R7) and `:576` (row 5: "no P0 downgrade exists in `transitions`, and the stop replay's local arms are not a Jev integration"; Later), plus the recommendations R1 and R21 (`:594`: "Offline advisor tie-break arm, with a keep rule that can fail — build-now — `choice` — 002"; `:598`: "Gate 3 calibration arm — next, only when R1's census prints `underpowered` — `noul` — 002").
9. Read BASE2 section 1 and its changed records: `004-deep-research-expansion/research/research.md:43-57` (the power line: "at most 55 rows are movable, so even a full deck needs a true win rate near 0.68 for 80% power", :47) and C1-C6 (:59-80; C1 aggregate flip rule ≤ 0.10; C2 decided universe; C3 the census prints its power line; C6 the capture env is `capture-scorer-eval-baseline.mjs:35-46`).
10. Opened both sides of the field gap: the Python `jev-cli` 0.6.2 (`specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:364-369` — `question_request` sends `{"type", "instructions", "criteria"}`; :381-382 — `choice` sends `criteria` = dict of `--option`, `score` sends `criteria` = `--level`; :389-393 — it reads the answer as `result["answers"]["answer"][kind]`) against the served server (`context/deem-main/serve/deem_server.py:535-548` — `choice` needs `spec.get("options")` as a list else "needs an options list"; `score` needs `spec.get("levels")` as a list else "needs a levels list"; :596-622 — the answer builders return `type/confidence/temperature` plus `level`+probabilities for `score` (:602-608) and `value`+derived confidence for `noul` (:618-622); the `DeemCore` class that owns `self.model_id` starts at :628-642, AFTER those module-scope builders; :772-777 — `/health` returns `{"status","model","backend"}`; :809-811 and :837-839 — CORS `*`, no authentication).

## Findings

### F1 — The printed stop line: one candidate, one number (answers A, H)

The served 0.8B earns **no** wiring today on speed alone. Its measured 60 ms answers question H's *cost* side (LOCAL:36-38) but question A's *quality* side is open: no calibration loaded, temperature 1.0 (LOCAL:27), quality on this repository unmeasured (LOCAL:52-53), and the two published figures disagree in kind — the card's 96.3% long-policy hold-out (MODEL_CARD_08B.md:20, vendor) versus the Tare harness's 0.6788 macro accuracy for the 0.8B-class `deem-v2` (leaderboard.md:14, vendor) — so no published number can stand in for a local measurement. Checklist Q1 (digest :54-57: metric, baseline, harness, measured before the change) fails for every wiring proposal until one local number exists.

The one candidate that survives: the 0.8B rides the **already-designed** round-2 census as its second scorer — see N-glm-01-1. It needs no new harness, because the round-2 synthesis already fixed the instrument: the capture env `capture-scorer-eval-baseline.mjs:35-46` (BASE2 C6, `004-deep-research-expansion/research/research.md:76-77`), the aggregate flip rule ≤ 0.10 (C1, :61-62), and the power line — "at most 55 rows are movable, so even a full deck needs a true win rate near 0.68 for 80% power" (`:47`, citing BASE2 section 1).

**The printed stop line (the angle's Q4):**

```
deem-0.8-v1 agreement=<X> on n=<movable> rows of the 002 census deck, aggregateFlip=<Y>
  thresholds: agree < 0.68 (or n < 5)  -> stop all Deem work (print "deem: stopped, agreement")
  agree >= 0.68 AND flip <= 0.10       -> exactly one feature: N-glm-01-1
  (measured with the same capture env as R1: capture-scorer-eval-baseline.mjs:35-46)
```

### F2 — The provenance gap: answers carry no checkpoint identity (answers A, H; contests LOCAL:50)

The as-built update mechanism can silently change every answer, and nothing would notice:

- The launchd agent runs bare `deem-ctl update` every 6 hours and at load (`com.skilled.deem-update.plist:7-15`).
- `deem-ctl update` switches `models/current` to the new commit **first** (deem-ctl:163), then gates only on health + **one synthetic** `choice` smoke decision (:167, :79-81: "one real decision proves the loaded weights work"). The smoke catches dead weights, not drift: a healthier-but-different model passes it.
- The failure rollback (:169-172, exit 3) restores availability, not equivalence — and was proven to work (LOCAL:68), which makes silent switching *more* likely, not less.
- Meanwhile the served answers themselves carry no provenance: the `noul` return is `{"type","value","confidence","temperature"}` (deem_server.py:618-622), the `score` return adds `level/probabilities/expected` (:602-608) — no model id, no commit. The answer builders are module-scope functions; the class owning `self.model_id` starts afterwards (:628-642), so the field is not accidentally in their scope. `/health` *does* return `{"status","model","backend"}` (:772-777) — the information exists on the wire, one GET away, but nothing attaches it to a decision.

LOCAL:50 frames the open question as "whether a caller can afford a process spawn plus 60 ms" — that is the *cost* half. The *reproducibility* half is weaker still: today the same question answered at 10:00 and at 16:00 may already be answered by different weights, and no record distinguishes them. For any "measured keep rule" (BASE2 C1/C3) this is the difference between a measurement and an anecdote.

This contests LOCAL's framing (a restatement of what changes: provenance, not just spawn cost) — it does not contest the measurements themselves, which are the orchestrator's.

### F3 — Speed alone flips nothing (answers B)

The drops the 60 ms call "reopens" (research-angles.md:62-63, the angles' own preamble; BASE1 rows 1 and 5) stay `Later`:

- **BASE1 row 1** (001-deep-research/research/research.md:572): the advisor grader — its recorded reason to stay later was *placement and coverage* ("the classifier it does reach runs on 0 of 8 cases"), not latency. A faster call does not add one label. Checklist: Q1 (no metric/baseline/harness for the model: F1), Q8 (no owner/caller/frozen contract named for any hook call yet — digest :72-74).
- **BASE1 row 5** (:576): stop/severity replays — "no P0 downgrade exists in `transitions`, and the stop replay's local arms are not a Jev integration". Again a *contract* finding, not a latency finding; the 3 s PreCompact budget (research-angles.md:62) was never the binding constraint for a replay.

The 0.8B-ness of the call passes the checklist questions the Jev key used to fail — Q7 (opt-in, degrades cleanly: dormant by D1, `goal.md:49`; no key at all, LOCAL:51), Q9 (egress: none, LOCAL:51; the Python `jev-cli` 0.6.2 always sends a bearer key and exits 3 without one — ALL-8, `jev_cli/__init__.py`-adjacent, cited here from research-angles.md:874 — while Deem does none, deem_server.py:809-811) — but those were never what held rows 1 and 5 back. **Their `Later` stands; nothing flips to build-now on latency.** (Confirms BASE with new evidence: the drop *reason* changed from "too slow" to "unmeasured, contract-unnamed", which changes what would un-drop them: a printed accuracy, not a faster CPU.)

### F4 — The D3 amendment: keep the cadence, add provenance, pin the measured rule (answers A, H; a proposed amendment to the parent's D3, not a drop)

The operator's wish is "auto-update whenever Deem releases a new version" (`goal.md:131`) and D3 says "kept current with Deem's releases. Nothing else is built" (`:50`). The as-built mechanism meets the wish (F2's mechanism) and is otherwise *right-sized* — the part the section-7 note told me to attack (deem-ctl update + 6-hourly launchd, LOCAL:55-70) is 208 lines, keeps two checkpoints, and its tested rollback (LOCAL:68) is stronger than most one-server installs. Attacking it as built, exactly two things are missing, both amendments:

1. **Record the served checkpoint with every answer.** Cheapest: the caller reads `/health` (`{"status","model","backend"}`, deem_server.py:772-777) once per census run and writes it beside the results — zero server LOC, one extra localhost GET. Strongest: the server adds `"model": self.model_id` to the three answer returns (:596-622) — but those are module-scope (:628-642 owns `self.model_id`), so it needs the id passed in: ~6-10 LOC in the vendored server. Either satisfies "every Deem figure cites the commit it was measured on" (risk table, 007 spec.md:169) at the *answer* level, not just the *run* level.
2. **Pin the measured rule to the measured commit.** The F1 stop line is only meaningful while the weights are the ones measured. So: once the census prints its number, the 6-hourly updater keeps switching (the wish), but any feature whose keep rule depends on printed agreement re-qualifies against the same printed threshold after an update — the check is the existing harness, not new machinery (Q6: no new option; Q12: no new dependency — the model, venv and launchd agent already exist, LOCAL:20-28, :70).

Amendment text (for the parent, at its next reconciliation): *D3.2 — the 6-hourly `deem-ctl update` keeps the 0.8B current; every answer of a feature that trusts Deem records the `model` and `backend` of the `/health` of the same server (deem_server.py:772-777), and a keep rule that was measured on a printed census (BASE2 C1/C3 thresholds) re-qualifies after any weights change. With the server absent or unhealthy, features behave exactly as today (D1, goal.md:49).*

Exposure note (ALL-3 binds any design that keeps it running): the server answers any local process — CORS `*`, no authentication (deem_server.py:809-811, :837-839, confirmed live per ALL-3). The census harness runs on the same machine; the amendment adds no new exposure.

## The `glm (all)` refinement: the digest's Q7, Q9, Q10 and Q12, stated for Deem (research-angles.md:899)

| # | Reading for the served 0.8B |
|---|---|
| Q7 (opt-in, clean degradation) | Passes, better than Jev: no key exists to lose (LOCAL:51). Dormant-by-default is D1's own clause (`goal.md:49`). A downed server must skip the feature *visibly* — the ALL-4 parsed-`backend` check (deem-ctl:58-60, :772-777) is what makes "skip" distinguishable from "stub" |
| Q9 (nothing leaves the machine) | Passes trivially: answers, model and weights all local (LOCAL:51). The one off-machine act is the *updater's* (it pulls from Hugging Face and GitHub, deem-ctl:5-7) — that is the operator's, not a feature's, egress |
| Q10 (reversibility, rollback sentence) | The feature side: yes — the D1 switch. The install side: "To undo this: `rm -rf ~/.local/share/deem` + `launchctl bootout gui/$(id -u)/com.skilled.deem-update`" (LOCAL:66, :70). The 2.1 GB + launchd agent is the bite: the dependency lives outside every repository (LOCAL:28), so the repo can neither pin nor audit it — which is exactly why F4.1's answer-level provenance matters |
| Q12 (new dependency justified) | For features: none added — the model, venv (torch 2.14.0, transformers 5.17.0, LOCAL:23) and launchd schedule predate this research. The climbing sentence the checklist wants is already written by D3 itself (`goal.md:50-51`); what a *feature* adds is a service dependency on a launchd-managed, repo-external process — named, and answered by F4.1's provenance (a feature that records what served it fails diagnosably, not mysteriously) |

## Per-idea records

### N-glm-01-1 — The 0.8B as the 002 census's second scorer

| Field | Value |
|---|---|
| **Idea** | `N-glm-01-1`: the served 0.8B answers the already-designed R1 census deck (advisor tie-break) as a *second, local* scorer, so the census prints whether the model earns its one feature. Type: `choice` (the census's subtype) |
| **Question** | A (does any feature use it), B (does the local call change any verdict), H (the printed rule that decides) |
| **Builds on** | R1 (`001-deep-research/research/research.md:594`: "Offline advisor tie-break arm, with a keep rule that can fail — build-now — 002") + BASE2 C1/C3/C6 (`004-.../research/research.md:59-80`) |
| **Value** | Before any billed or wired call, the repository learns whether the free local model can *be* the tie-breaker — the decision the 0.8B's install was purchased for |
| **Seam** | The 002 harness's scorer step (phase `002-advisor-jev-tiebreak-arm`'s census; its env fixed at `capture-scorer-eval-baseline.mjs:35-46`, quoted from BASE2 C6 at `004-.../research/research.md:76-77` — not reopened here, that phase owns the file) |
| **Metric, baseline, harness** | Agreement (modal pick match) + aggregate flip ≤ 0.10; baseline = the recorded advisor-gold captures; harness = the existing census, second scorer added. NewInfo: the 0.8B rides a harness round 2 already built — nobody proposed that substitution |
| **Savings** | It *costs* ~55 rows × 3 reruns × 60 ms ≈ 10 s of p50-summable wall time (LOCAL:36-38 — arithmetic, marked) and 0 quota; it *saves* the alternative it replaces: wiring any feature before knowing agreement. Both sides counted or arithmetic-on-measured, no estimates |
| **Cost, latency, privacy** | Deem: 165 calls, all local, no key (LOCAL:51); deadline: none (offline census — the 2,500 ms/3 s hook budgets of the reopened drops do not bind here, research-angles.md:62). Jev: the comparison arm when the operator wants one — 165 keyed calls, 3 s-class budget, state leaves the machine (digest Q7/Q9 INFERRED note, :62-63, :74) |
| **Two-backend gate** | Own switch: run the 0.8B scorer only when `GET /health` returns `status:"ok"`, `model:"deem-0.8-v1"`, `backend != "stub"` (the ALL-4 parsed-field check; deepseek-01 owns its final wording — research-angles.md:891). Prefer: Deem, because the comparison costs 0 there and the question is whether the *local* model clears the bar. When Jev is also available, run both scorers — that comparison is the point. When neither: the census runs exactly today's behavior, no third scorer, prints "no backend: today's behavior" (D1, `goal.md:49`; no silent default — digest Q7, :62-63). Malformed answer: the row is `unmeasured`, the fused order stands (BASE2 C5, :73-74). Slow answer: the census's own step timeout; the deck's measured ceiling is ~10 s of model time (LOCAL:36-38) |
| **Rough LOC** | ~30-60: a second scorer (localhost POST, the field shim, the agreement/flip print) in the 002 harness. Estimate — the exact insertion point is 002's, not opened here (marked) |
| **Verdict** | **next** — after R1's census prints `movable ≥ 5`; the 0.8B arm must not precede the harness it would ride (BASE2's own order, `:51` V7: "002, 005 and 003's Pi census first, then 002's arm") |
| **Confidence** | Confirmed from code for the seam pieces I opened (field gap, answer shape, health payload); inferred for the LOC and the insertion point — confirming them means opening 002's harness, which is that phase's next action, not this research's |

### N-glm-01-2 — D3.2: answer-level provenance + measured-rule requalification

| Field | Value |
|---|---|
| **Idea** | `N-glm-01-2`: the 6-hourly update keeps switching (the wish, `goal.md:131`), but (a) answers record which weights produced them, (b) a printed keep rule re-qualifies after any weights change. Type: `noul`/`choice`-adjacent (provenance, not a judgment) |
| **Question** | A (the least update mechanism that meets the wish), H (what makes a measured rule survive an update) |
| **Builds on** | D3 + its amendment (`goal.md:50-51`, `:131`); LOCAL:55-70; the spec's risk "an update changes the model under the run" (`007.../spec.md:169`) |
| **Value** | The operator's "auto-update" stops being a synonym for "answers may silently drift"; every keep rule becomes auditable against the weights that served it |
| **Seam** | `deem_server.py:596-622` (the three module-scope answer returns — where `"model"` would be added, requiring the id as a parameter because `DeemCore` starts at :628-642) or, at zero server LOC, the caller-side `/health` read (:772-777); `deem-ctl:163,167,169-172` (the switch-then-smoke order that makes the gap) |
| **Metric, baseline, harness** | Metric: every trusted answer carries `model`+`backend` (a presence check, not a judgment — no model in the loop). Baseline: today, 0 of 3 answer types carry it (deem_server.py:596-622 — counted in this iteration). Harness: one assertion in the census's scorer ("response.model == health.model") |
| **Savings** | Context tokens: 0. Minutes: saves the *debugging* session after a silent flip (unbounded, mark: estimate — no recorded incident yet, the first flip would be the measurement). AI passes: 0 |
| **Cost, latency, privacy** | Server variant: +6-10 LOC vendored, +1 field/answer (~0 ms). Caller variant: +1 localhost GET per run (~sub-ms, inside any budget). Neither changes egress (LOCAL:51); neither adds a dependency (Q12) |
| **Two-backend gate** | Own switch: the provenance record is written by whichever backend answered; a Jev-answered row records the Jev response's own identifiers, a Deem-answered row records `/health`'s `model`+`backend`. Neither available: no record, behavior exactly today's — the *absence* of the record is itself the D1 state, printed, not defaulted |
| **Rough LOC** | 0 (caller variant, named) to 6-10 (server variant); the caller variant is the recommendation (smallest, Q5) |
| **Verdict** | **next**, riding the first feature that trusts Deem — it costs nothing until such a feature exists, and inventing it earlier would be work without a caller (Q6) |
| **Confidence** | Confirmed from code: the answers' field lists, the module-vs-class scope, the health payload, the switch-then-smoke order, the plist cadence. Inferred: that no incident has yet occurred (absence of record — the honest state; the first update under a trusted feature would confirm it) |

### Ruled out (contract 12)

| Tried/considered | Why ruled out |
|---|---|
| Lowering the 6-hourly cadence (e.g. daily) as the reproducibility fix | Treats the symptom: the switch fires before any quality comparison regardless of cadence (deem-ctl:163,167; plist:12-13); at ~weekly release cadence (the model commit's "last modified 2026-09-25", LOCAL:20 — one data point, marked) even 28 polls between releases cost nothing measurable. The cheaper, correct fix is provenance + requalification (N-glm-01-2) |
| A "quality-gate" step inside `deem-ctl update` (run the Tare harness before switching) | Costs a harness the lineage does not own and a *labeled* set this repository has not built (LOCAL:52-53: "quality here is unmeasured"); the F1 census threshold already plays this role for the only question that matters here, at 0 new LOC. Vendor comparisons: the card's 96.3% (MODEL_CARD_08B.md:20) and Tare's 0.6788 (leaderboard.md:14) disagree in kind and neither measures this repository's judgments |

## Questions Answered

- **A (partial):** Should any feature use the served Deem? — No feature yet; exactly one candidate (N-glm-01-1), decided by the printed F1 number. Is the 0.8B's `custom`-provider route a thin wrapper? — No: the typed `choice`/`score` paths fail the field names (`criteria` vs `options`/`levels`, `jev_cli/__init__.py:364-369,381-382` vs `deem_server.py:535-548`) and the answer keys (it reads `answer.choice`/`answer.score` per :389-393; the server returns `level` for score, :602-608; the choice-return key NOT opened here — its block was cut at :596-601, marked UNKNOWN, what confirms: reading deem_server.py:592-601). The workable route today is the Python `jev-cli` 0.6.2's passthrough `run` with a Deem-shaped question file (:372-375: `run` loads the request and only defaults the model) — confirmed from both sides I opened.
- **B (partial):** Which drops flip on the 60 ms call alone? — None (F3): the reopened rows' drop reasons were coverage and contract, not latency.
- **H (partial):** The stop line (F1) and the amendment (F4) — both printed.

## Questions Remaining

- G: the smallest `cli-classifier` hub that passes the parent-hub checks, and whether it starts without moving `cli-jev` (glm-02, next).
- C: which context-reduction proposals survive Q1-Q15 and the red flags (glm-03).
- D/E/F: which validator, sk-prompt and sk-design judgment calls survive after every template check passes (glm-04).
- H: the resulting order, the smallest program that remains, and the round-3 drop list (glm-05).
- A: whether `answer.choice`'s key in deem_server.py:592-601 is `value` (UNKNOWN; one read confirms — queued for the synthesis or a later iteration).

## Next Focus

`glm-02: The smallest cli-classifier hub` (W2, research-angles.md:518-532). Before starting: read the newest existing iteration of each of the other four lineages (`research/lineages/<other>/iterations/`) and fill the Sibling check; then count the least hub that passes the parent-hub checks, weigh moving `cli-jev` against starting with `cli-deem` alone, and name any sibling proposal that is a wrapper that only forwards arguments. Carry: the F4.1 caller-vs-server provenance choice (a hub-adjacent surface if the hub ever proxies Deem) and the confirmed field gap (A's `custom`-route clause) as constraints the hub's `cli-deem` half must name.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| No feature wires the 0.8B today; one candidate, decided by a printed agreement on the existing census | **new** (the census-ride substitution is round-3's; BASE2's R21 calibration arm was Jev-shaped, `001-.../research/research.md:598`) | This iteration: F1, N-glm-01-1; LOCAL:27,52-53; BASE2 :47,59-80 |
| Served answers carry no checkpoint identity; the update switch fires before any quality comparison | **new** (LOCAL:50's open question names spawn+connect cost; the provenance gap is the other, unstated half) | deem-ctl:163,167,79-81; deem_server.py:596-622,628-642,772-777; plist:7-15 |
| BASE1 rows 1 and 5 stay `Later`; the 60 ms call does not flip them | **confirms BASE with new evidence** (the drop reason shifts from latency to coverage/contract) | 001-.../research/research.md:572,576; digest :54-57,:72-74 |
| The Python jev-cli 0.6.2's typed subcommands do not reach Deem unchanged; `run` with a Deem-shaped file does | **new** (both sides opened here; the spec's risk table inferred it, `007.../spec.md:170` — now confirmed) | jev_cli/__init__.py:364-369,381-393; deem_server.py:535-548,596-622 |
| The as-built updater is right-sized; its two amendments are provenance and rule-pinning, not cadence or a quality gate | **new** (verdict against the mechanism the refinement targeted, written as a proposed D3 amendment) | F4; deemed-ctl:5-7,58-68,139-172; goal.md:50-51,131; LOCAL:55-70 |

## SCOPE VIOLATIONS

None. All reads; writes: this file, `deltas/iter-001.jsonl`, the state record, and the lineage's reducer-owned state files, all inside `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/glm/`. `deem-ctl` and the launchd plist were read, never executed (ALL-1).

## Hand-off

- **glm-02** must weigh the hub *with* this iteration's constraint: `cli-deem`'s wrapped call, if any, is a passthrough (F-last: the `run`-file route) or a shim that fixes the field names — a wrapper that only forwards arguments is the red flag the angle asks it to catch.
- The F1 printed number is **the** dependency of every later verdict: any iteration 2-5 recommendation that trusts the 0.8B inherits the "next, after the census prints ≥0.68" qualifier.
- The UNKNOWN (the choice-answer's key, deem_server.py:592-601) is one read; whoever next touches question A's answer-shape clause (the synthesis, per 007 spec.md:119) resolves it there — it changes no verdict.
- N-glm-01-2's caller variant (read `/health` beside the run) is the provenance precedent any later hook/feature should inherit, so the record exists *before* the first trusted answer, not after.
