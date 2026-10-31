# Deep Research Strategy — lineage `glm`

Session: `fanout-glm-1790490452777-942a1f` · label `glm` (cli-pi, glm-5.3-flash, reasoningEffort max) · packet: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research` · generation 1 · started 2026-09-27T06:39:30Z.

Lens (research-angles.md:57): **the contrarian** — it argues what not to build and where the other lineages overengineer, grounded in `.skilled/repo-rules/prevent-overengineering.md` and the fitness checklist. A contrarian verdict without code, a count or a rule citation earns nothing.

## 1. OVERVIEW

- **Topic:** Find where a classifier model, Jev hosted or local Deem 0.8B, cuts the main AI's context and manual review work in this repository.
- **Angles:** glm-01 (W1), glm-02 (W2), glm-03 (W2), glm-04 (W3), glm-05 (W4) — five forced iterations, `stopPolicy: max-iterations`, `convergenceMode: off` (convergence is telemetry only; broaden review angles instead of synthesizing early).
- **Per-iteration contract:** `context/research-angles.md:71-117` governs; section 7 refinements (`:859-905`) bind as part of each named angle.

## 2. TOPIC

See above; the brief, questions A-H and the answer shape are `spec.md:104-122` (Research Brief). Every recommendation in the final packet synthesis must name its seam at `file:line`, the metric with its baseline and harness, the two-backend gate with exact no-backend behavior, the smallest slice, a rough LOC and a verdict of build-now, next, later or drop with one sentence of reason; every claim marked confirmed or inferred-with-what-would-confirm (spec.md:119).

## 3. KEY QUESTIONS (remaining)

- [x] G1: What is the least a `cli-classifier` hub must contain to pass the parent-hub checks? — **Answered it.2:** 6 hub files + 2 member skills, every row enforcement-pinned (`validate_skill_package.py:210-232,255-290`; `parent-skill-check.cjs:271-274` + the 1a single-`graph-metadata` rule; `description.json` = the doctor's, 18 refs); the true marginal cost is the vocabulary MERGE into one `graph-metadata.json` (metadata-class modes have no advisor entry of their own, skill-hub-routing.md:26-42). Routing machinery alone ≈ 18-20 KB.
- [x] G2: Move `cli-jev` now vs start with `cli-deem`? — **Answered it.2:** neither — the D2.1 ledger clause: no hub phase; mint the 6-file shape only when 002's census printed AND exactly one more live caller exists; kill when either member is 0-caller (a 1-mode hub is air — cli-jev's own hub-router:8-11). Counted: 638/83+30+2,372/467 references, +10-12 KB surface, +1 hop (~1,700-2,000 tokens/judgment pass, arithmetic); the four Planned phases mention the hub ZERO times.
- [ ] C1: Which question-C proposals fail Q1-Q15 or the red flags, and on which question? (glm-03)
- [ ] C2: Which context-reduction savings claims rest on estimates rather than counts? (glm-03)
- [x] D/E/F1: Which replace a fact/validator verdict with a judgment? — **Answered it.4:** only the D correctness/traceability residue ("no validator at all", mimo-002:95-97); E-pick and F-routing replace deterministic code (the printed 7-row matrix; the hub-router) — a regression dressed as intelligence.
- [x] D/E/F2: Which produce a report nobody reads, lack gold, or are better solved by a docs/template fix? — **Answered it.4:** gold exists ONLY in D (the review tables' severity+dimension labels — the 0.8B's D-precision = one replay, not one phase); the 7-vs-5 = a docs bug (the 59,661B prize collected by "read only the selected section"); E-score/F-routing = 0 gold, 0 archived runs, hope-first; the D-flags must land IN the review table, not beside it.
- [x] H1: the round-3 drop list, numbered from 73 — **Answered it.5:** #73-88, sixteen rows, six joins (swe-001, grok-003, grok-005 ×2, grok-006 ×2, mimo-002 ×2), each with reason + checklist + evidence + lineage.
- [x] H2: the smallest program, its kill, the decline-first — **Answered it.5:** 1 word + 1 replay + 2 amendments + 2 lines, the 0.8B as a twice-gated candidate scorer; the kill = agreement < 0.68 (or the censuses kill it earlier); decline-first = the hub (#77).
- [x] A1: Should any feature use the served 0.8B? — **Answered it.1, conditionally:** no wiring yet; exactly one candidate (N-glm-01-1, the 002 census's second scorer), decided by the printed stop line: agreement < 0.68 (or < 5 movable rows) stops all Deem work; ≥ 0.68 with aggregate flip ≤ 0.10 earns the one feature.
- [x] A2: What is the least update mechanism that meets the auto-update wish? — **Answered it.1:** the as-built 6-hourly `deem-ctl update` stays (the wish, goal.md:131); amendments are provenance (answers record `/health`'s `model`+`backend`) and keep-rule requalification (N-glm-01-2). Cadence and a quality gate ruled out.
- [x] B1: Which drops flip on the 60 ms call alone? — **Answered it.1:** none; BASE1 rows 1 and 5 stayed `Later` for coverage/contract reasons, which speed does not touch.
- [x] A3: Where does the 0.8B's first measurement live? — **Answered it.2:** the 002 census, via ONE word (002 spec.md:92 "Jev call" → "Jev or Deem call") + a 30-60 LOC scorer riding the ~180-LOC census (its own switch, per :98's exclusivity); the 24-row ambiguity labels located at `routing-accuracy/ambiguity-prompts.jsonl` (002's Files-to-Change) — it.1's UNKNOWN resolved.

## 4. NON-GOALS

- Building nothing: every recommendation stays a finding (research-only phase; 007 spec.md:43, :85-87).
- No live `jev` call, no Deem server call, start, or download — the orchestrator owns them (contract 7; 007 spec.md:87). `deem-ctl` and the launchd plist are read, never executed (ALL-1).
- No writes outside `research/lineages/glm/`; no repository module, test, `validate.sh`, `generate-context.js`, install, network call or git write (contract 6).
- Not re-deriving the orchestrator-confirmed facts (research-angles.md:35-47) — cite them or their `LOCAL` line.
- Not re-answering rounds 1-2: new information only; a BASE restatement without new evidence earns nothing (contract 12).

## 5. STOP CONDITIONS

- Iteration 5 completes → synthesis. `stopPolicy: max-iterations` forces all 5; convergence before the cap is telemetry only.
- The F1 printed stop line (it.1): if the 0.8B's census agreement lands < 0.68 (or < 5 movable rows), *all Deem work stops* — the lineage's later iterations then argue from the number, not around it. That is a finding to record, not an early stop of this loop.

## 6. ANSWERED QUESTIONS

- it.1 → A1, A2, B1 (conditional answers; the printed number is their dependency). Details: `iterations/iteration-001.md` (F1-F4), deltas/iter-001.jsonl.
- it.2 → G1, G2, A3. Details: `iterations/iteration-002.md` (F1-F6), deltas/iter-002.jsonl. Corrections of it.1 recorded: `/health`'s model id is update-invariant — provenance = the `models/current` readlink + the `deem-ctl status` commit pair (deepseek-002's F9 rule, their words, my deem-ctl:97-98); the calibration-wait gates on a vendor artifact that does not exist for this checkpoint (LOCAL:27) — the measured flip rate subsumes it (grok-07's calibration thread: answered-cut).

<!-- ANCHOR:answered-questions -->

## 7. WHAT WORKED

- Riding the existing 002 census harness instead of proposing a new one: the 0.8B's whole case reduced to one printed number on an instrument round 2 already fixed (BASE2 C1/C3/C6) — zero new machinery, checklist Q1 satisfied by inheritance (it.1).
- Counting instead of designing (it.2): the 6-file minimum, the 0/0/0/0 phase-mention count, the reference counts and the +1-hop arithmetic produced a verdict (the ledger clause) noSibling debate (grok-010 vs swe-01's build-now timing) could produce — because the question everyone argued (WHEN to build the client) dissolved once the caller count (0) was the unit.

## 8. WHAT FAILED

- Nothing retried yet. One correction: the spec's risk table (`007.../spec.md:170`) *inferred* the jev-cli→Deem field gap; it.1 opened both sides and confirmed it, and found the richer detail (the typed subcommands fail; the `run`-file passthrough works) — noted so the synthesis upgrades the risk, not the inference.

## 9. EXHAUSTED APPROACHES (do not retry)

### Update-mechanism redesign — PRODUCTIVE (it.1)
- What worked: attacking the mechanism *as built* (per the glm-01 refinement) — the 208-line `deem-ctl` + launchd proved right-sized; only provenance and rule-pinning were missing.
- Prefer for: glm-02's hub question (same posture: count the least that passes the checks; attack only what a count or rule convicts).

## 10. RULED OUT DIRECTIONS

- Cadence-lowering as the reproducibility fix: the switch fires before any quality comparison regardless of cadence (deem-ctl:163,167; plist:12-13) — provenance + requalification is cheaper and addresses the cause (it.1, deltas/iter-001.jsonl).
- A Tare-harness quality gate inside `deem-ctl update`: needs a labeled set this repository has not built (LOCAL:52-53) and a harness the lineage does not own; the F1 threshold already answers the only question that matters here (it.1).
- Hub-mint-now (D2 as written, a build phase): a 1-mode hub replicates cli-jev's own "unreachable while the hub registers one mode" case (hub-router:8-11); the census needs no hub (002 spec.md:98); the +1-hop/~10-12 KB/identity-re-mint buys nothing at 0 callers (it.2).
- Wrapper-family shapes for the eventual cli-deem: the 70-LOC passthrough (pays Jev's key ceremony, ALL-8, to reach an authless server — deem_server.py:809-811) and the wheel-patch (fork-divergence + the 60 s timeout, JEVSRC:288); route (c)'s direct client is the only one that makes the ALL-8 key question vanish (it.2, F5).

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11A. CARRIED-FORWARD OPEN QUESTIONS

- UNKNOWN (one read): the choice-answer's key in `deem_server.py:592-601` (the return block was cut at :596-601 in it.1). Whoever next touches question A's answer-shape clause (the synthesis, per spec.md:119) resolves it there; it changes no verdict.
- N-glm-01-2's caller variant (read `/health` beside the run) is the provenance precedent any later hook/feature should inherit.
- Any it.2+ recommendation that trusts the 0.8B inherits the qualifier "next, after the census prints ≥ 0.68" (F1).

## 11. NEXT FOCUS

**glm-05: What not to build, round 3** (W4 — the cap, research-angles.md:756-768). Read ALL FOUR own iterations + the newest of every sibling (re-verify swe-005+/mimo-003+/deepseek-011+), then BASE1 rows 1-43 + BASE2 rows 44-72; the drop list IN THE SYNTHESIS FORMAT, numbered from 73 (`| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |`); which baseline drops the flip set reopens WRONGLY; the smallest program that remains; its kill; what to decline FIRST. The four through-lines to judge every row: (1) the 0.8B = second-scorer-on-existing-gold, never a pioneer; (2) determinism-wins-where-it-exists; (3) the it.3 F2 attention+cache unit governs every savings column; (4) provenance-or-quiet (it.1-2). The W3-unmeasured list (F-rubric, F-hub-accuracy, mimo-08's run) must appear as unmeasured rows, not guesses.

## 12. KNOWN CONTEXT

### Bounded Context Snapshot (pointer-based, codebase-scoped)

- **Measured ground truth (the orchestrator's; never re-derive):** `context/deem-local.md` — the served 0.8B: p50 60.2-60.5 ms, p95 62.8-78.5 ms (:34-38), 3,368 MB footprint / 814 MB RSS / ~10 s cold (:40-44), no calibration, temperature 1.0 (:27), quality here unmeasured (:52-53), 2.1 GB under `~/.local/share/deem/`, nothing in any repository (:28), the operate+update table (:55-70), launchd 6-hourly+at-login, health parses `backend` and refuses `stub` (:70). Cite by its lines.
- **The as-built control surface (read, never executed; ALL-1):** `/Users/michelkerkmeester/.local/share/deem/bin/deem-ctl` — 208 lines; smoke = one synthetic `choice` (:79-81); update = switch-then-smoke (:163,167), exit-3 restore (:169-172); `/health`-based, `stub` refused (:58-60). `/Users/michelkerkmeester/Library/LaunchAgents/com.skilled.deem-update.plist` — bare `update` (:7-11), StartInterval 21600 (:12-13), RunAtLoad (:14-15).
- **The field-gap (confirmed it.1, both sides opened):** Python `jev-cli` 0.6.2 `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:364-369,381-393` vs `context/deem-main/serve/deem_server.py:535-548,596-622`. The 0.8B's answers carry no provenance (:596-622; `DeemCore`+`self.model_id` at :628-642; `/health` → `{status, model, backend}` :772-777; CORS `*` :809-811, :837-839).
- **Baselines:** BASE1 = `001-deep-research/research/research.md` (What-Not-To-Build rows 1-43; rows 1,5 = it.1's; R1/R21 at :594,:598). BASE2 = `004-deep-research-expansion/research/research.md` (rows 44-72; §1's power line :47; C1-C6 :59-80). R-ids: never mint; name a new idea `N-<angle>-<k>`.
- **The contrarian's instruments:** `001-deep-research/context/repo-rules-digest.md:52-109` (fitness Q1-Q15, red flags); `.skilled/repo-rules/prevent-overengineering.md` (smallest-thing rule; costlier move only by naming what fails at the cheaper); the section-7 `glm (all)` Q7/Q9/Q10/Q12 reading requirement (:899).
- **Integration points likely touched:** the planned hub files of `.skilled/skills/cli-external-orchestration/` (naming precedent for modes), `.skilled/skills/cli-jev/` (the moved skill), Planned phases 002/003/005/006 (the reconciliation targets).
- **Constraints/risks:** five lineages run concurrently — a sibling's newest file may be older than mine (research-angles.md:64); wave-1 independence: agree only on evidence I opened myself (:61-63); steering lags ~one iteration (spec.md:173).

## 13. RESEARCH BOUNDARIES

- Max iterations: 5 (forced; `stopPolicy: max-iterations`)
- Convergence threshold: 0.05 on newInfoRatio, `convergenceMode: off` — telemetry only
- Per-iteration budget: ~15 tool calls (contract 4); research actions 3-5, target 8-11, max 12 (TCB)
- Progressive synthesis: true (this lineage's `research.md` is written at synthesis, workflow-owned)
- research.md ownership: workflow-owned canonical synthesis output; written once at the cap
- Lifecycle: `new` (lineageMode), generation 1; fork/completed-continue are not runtime-wired
- Machine-owned sections: the inline reducer controls sections 3, 6, 7-11A (this detached execution folds the reducer refresh into the same process, per the launching prompt: no nested dispatch, no subprocess)
- Question injection surface: none wired (inbox.jsonl not in use; no operator waits on this lineage)
- Canonical pause sentinel: not consulted (detached, unattended)
- Current generation: 1
- Started: 2026-09-27T06:39:30Z
