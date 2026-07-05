# Research Report: Perfecting deep-loops/030-deep-loop-improved (Fan-Out Synthesis)

**Spec Folder:** `.opencode/specs/deep-loops/030-deep-loop-improved`
**Mode:** 2-lineage fan-out (`glm` = zai-coding-plan/glm-5.2 @ xhigh, `gpt` = openai/gpt-5.5-fast @ high)
**Configured:** maxIterations=35, convergenceThreshold=0.01, stopPolicy=convergence (both lineages)
**Run window:** 2026-07-01T05:34:00Z – 2026-07-01T06:01:01Z
**Date compiled:** 2026-07-01

---

## 1. Executive Summary

Both lineages independently converged **legally but earlier than the operator's ≥30-iteration intent** (glm: 18 real iterations; gpt: 11 iterations) — see §3 for the full stop-reason analysis. Despite the short iteration counts, both lineages produced deep, evidence-cited, mutually corroborating findings across the packet's 8 phases and its own review/research tooling. Merging the two lineage outputs surfaced **26 distinct findings** (18 from glm, 8 from gpt, with heavy thematic overlap — see §7 corroboration matrix) plus **one severe new bug discovered during this synthesis itself**: the fan-out merge tool (`fanout-merge.cjs`) silently dropped 100% of glm's 18 findings from the canonical merged registry because glm's self-authored registry didn't use the exact `keyFindings` schema key the merge script requires (§6.4). This was caught only because the merge output was cross-checked against the raw per-lineage registries rather than trusted at face value — the tool itself reported `"status":"ok"` with no error or warning.

**Top-line verdict:** the `030-deep-loop-improved` packet is not safely completable via its own claimed-complete status. There is systemic, packet-wide drift between "Complete" claims and actual evidence (phase-doc-map tables, `completion_pct` continuity, review-registry disposition, graph-metadata `key_files`), plus at least 4 confirmed live bugs in the deep-loop tooling itself — 2 that this dispatch had to work around pre-flight (§9), 1 confirmed independently by both lineages as a critical infra blocker (the 4-hour fan-out timeout cap, §6.3), and 1 discovered fresh during this synthesis (the merge silent-drop bug, §6.4).

---

## 2. Scope, Method & Fan-Out Configuration

Research topic (verbatim, both lineages): find upgrade/fix/expansion recommendations to perfect the `030-deep-loop-improved` packet across phases 001–008 and its own review tooling (deep-loop-runtime fan-out/salvage/merge, deep-loop-workflows convergence math, deep-review + deep-research lineages); remove drift between claimed-complete status and actual evidence; fix bugs; harden safety/observability.

Each lineage ran as a fully independent, isolated `opencode run` subprocess (`cli-opencode`) executing its own complete instance of the deep-research loop (phase_init → phase_loop → phase_synthesis) inside `research/lineages/{label}/`, per the documented fan-out contract (`deep-research/SKILL.md` §Experimental/Reference-Only Features, "Multi-lineage fan-out"). Neither lineage shares context with the other; both were seeded with the identical topic text plus two additional meta-questions this operator/dispatcher added: (a) whether `--convergence-threshold` actually threads into fan-out lineage prompts, and (b) whether the fan-out lineage timeout ceiling is adequate for 30+-iteration high-reasoning-effort runs. Both lineages independently investigated and answered both meta-questions — see §6.

---

## 3. Convergence Report (Per-Lineage Stop Analysis)

| Lineage | Stop reason | Iterations completed | Real iteration files | Duration | Last 3 newInfoRatio | Question coverage at stop |
|---|---|---|---|---|---|---|
| glm | `legal_convergence` | **18** | 18 (see §3.3 for file-count caveat) | 25.5 min (1,527,253 ms) | `[0.10, 0.06, 0.03]` (avg 0.464 across the full run) | 10/10 self-defined questions answered |
| gpt | `converged` | **11** | 11 | 27.0 min (1,620,312 ms) | `[0.0, 0.0, 0.0]` | 5/5 self-defined questions answered |

### 3.1 Was gpt's 11-iteration stop legitimate?

**Yes, by the letter of the documented 3-signal composite-vote algorithm** (`convergence.md`) — but the operator's intent was defeated by a mechanism that is orthogonal to the near-zero threshold, not a violation of the threshold itself.

- gpt's own `deep-research-state.jsonl` iteration 11 record: `newInfoRatio: 0.0`, `convergenceSignals: {rollingAvg: 0.0, entropyCoverage: 1.0, compositeStop: 0.65}`. `compositeStop=0.65 > 0.60` is exactly the documented STOP threshold in `convergence.md` step 5's weighted-vote rule.
- The terminal event: `{"event":"converged","run":11,"reason":"last three newInfoRatio values are 0.0 under convergenceThreshold 0.01; key-question coverage complete; source diversity sufficient"}` — genuinely below 0.01 for 3 consecutive iterations, so the ratio-based signal is legitimate, not a bug in threshold arithmetic.
- **Root cause of the short run:** gpt self-scoped only **5 broad key questions** in its own `deep-research-strategy.md` (vs. glm's 10 narrower ones). Answering 5 broad questions "comprehensively" is achievable in ~8-9 iterations; the `entropyCoverage` (questions-answered ratio) signal then reaches 1.0 and, combined with the genuinely-decaying newInfoRatio, satisfies the composite-stop vote well before 30 iterations — **independent of how low `convergenceThreshold` is set.**
- **The real gap:** `minIterations` is hardcoded to 3 in `deep_research_auto.yaml` (`step_create_config`, `step_create_state_log`) with no CLI override (confirmed in this session's pre-flight, §9). A convergence-threshold of 0.01 only raises the bar for the *ratio* signal; it does nothing to the *question-entropy* signal or the iteration floor. The one lever that WOULD have forced ≥30 iterations regardless of self-scoped question count already exists in the runtime and was not used in this dispatch: **`--stop-policy=max-iterations`** (`fanout-run.cjs` `normalizeStopPolicy`), which makes convergence "telemetry only" and forces the loop to run to `config.maxIterations`. This dispatch used the default `stopPolicy=convergence` for both lineages. **This is an actionable operational finding for future ≥N-iteration-forced runs of this packet's own tooling**, not a bug per se — see §6.2 for the recommendation to promote this to a documented/first-class flag on `/deep:research` and `/deep:review`.

### 3.2 glm's stop — same mechanism, different timing

glm's terminal event (`type: convergence_check`, iteration 18): `newInfoRatio: 0.03`, `convergenceWindow: [0.12, 0.10, 0.06, 0.03]`, `questionsAnsweredRatio: "10/10"`, `stopReason: "legal_convergence"`. The rolling average of the last 3 (0.10, 0.06, 0.03 → avg 0.0633) is **still above the configured 0.01 threshold** — glm's stop was driven primarily by the `remaining_questions == 0` (`all_questions_answered`) branch of the algorithm (step 4, evaluated before the ratio-based composite vote), not by the ratio dropping below 0.01. Same underlying gap as gpt: the question-entropy/coverage stop branch is orthogonal to `convergenceThreshold` and is not gated by `minIterations` beyond the hardcoded floor of 3.

### 3.3 glm's "36 iteration files" — confirmed duplicate-naming artifact, NOT 36 real iterations or an off-by-one overshoot

`research/lineages/glm/iterations/` contains 36 files, but they are **18 genuine iterations, each written twice under two different filename conventions**: zero-padded canonical (`iteration-001.md` … `iteration-018.md`, matching `state_paths.iteration_pattern`) and non-padded (`iteration-1.md` … `iteration-18.md`). `diff` confirms byte-identical content pairs for every checked pair (`iteration-1.md` == `iteration-001.md`, `iteration-18.md` == `iteration-018.md`). `deep-research-state.jsonl` independently confirms exactly 18 `type:"iteration"` records (`iteration: 1..18`). **glm did not exceed the 35-iteration cap; it stopped at 18/35, and the file count is a cosmetic duplicate-write artifact**, not evidence of a real 36th iteration or an off-by-one bug in the cap enforcement itself. Root cause: the glm lineage (an LLM self-driving its own loop inside the detached CLI subprocess, not literal orchestrator code) wrote its iteration markdown under both naming conventions it considered "the pattern," rather than the single canonical one. Recommend the reducer/synthesis path assert a single canonical filename regex and treat any non-canonical duplicate as a warning-worthy artifact to clean up post-run (new finding, folded into §5 backlog as F-019/G-009).

### 3.4 Anti-convergence-floor gap: confirmed, and now root-caused more precisely

The pre-existing finding ("no `--min-iterations` flag; `minIterations` hardcoded to 3") is confirmed current. This run adds precision: even a near-zero `convergenceThreshold` cannot force a floor, because the **question-coverage/entropy stop signal is independent of the ratio threshold**, and the one existing lever that could force full-depth runs (`stopPolicy=max-iterations`) was not applied here (operator/dispatcher choice, not a missing feature). **Recommendation:** promote `--stop-policy=max-iterations` to a documented, first-class flag on `/deep:research`/`/deep:review` command surfaces (currently only reachable via the internal fan-out JSON config) so operators requesting deep forced-depth runs can select it directly instead of relying on threshold tuning that this run proves is insufficient.

---

## 4. Consolidated Findings

Findings are de-duplicated by theme across both lineages' native IDs (glm: `F-00N`, gpt: `G-00N`). Severity shown is the higher of the two lineages' ratings where both flagged it.

### 4.1 Critical

**[F-006/G-005] `computeLineageTimeoutMs` 4-hour hard cap undercuts 30+-iteration high-effort loops, no override exists.** `fanout-run.cjs:884-888`: `Math.min(iterations * timeoutSeconds * 2 * 1000, 4*60*60*1000)` — the `min()` saturates to the 4-hour ceiling for any realistic `iterations × timeoutSeconds` combination, and there is no CLI flag, env var, or config field to raise it. glm's report claims this "kills at iteration 8" in the worst case it modeled; in **this actual run neither lineage hit the 4h wall** (both finished in ~25-27 minutes — well inside the cap), so the cap was not the proximate cause of either lineage's short stop this time, but it remains a real structural risk for genuinely slow/high-effort 30+-iteration runs and both lineages independently flagged it as a blocking risk. **Recommendation:** add `--lineage-timeout-hours` (or equivalent) override; default should scale with `iterations × timeoutSeconds`, not hard-cap at a fixed 4h regardless of configured scope.

**[NEW, this synthesis] `fanout-merge.cjs` silently drops 100% of a lineage's findings when its registry doesn't use the exact `keyFindings` array key — no warning, no error, misleading success stats.** Confirmed at `fanout-merge.cjs:472`: `if (!registry || !Array.isArray(registry.keyFindings)) continue;`. glm's self-authored `deep-research-findings-registry.json` used a `findings` array (different field name, different per-finding shape: `category`/`disposition` instead of `iterations`/`_lineages`) — a valid, well-formed JSON registry, just not matching the exact schema the merge script requires. The merge ran to completion, reported `"status":"ok","merged_lineages":2,"skipped_no_registry":0,"key_findings":8"` — **all of which read as full success** — while silently discarding all 18 of glm's findings (69% of the combined 26-finding corpus). This is the single highest-severity finding of this whole research pass, because it means any operator who trusted the merge tool's own reported statistics (rather than diffing against per-lineage registries, as this synthesis did) would have shipped a "complete" research report missing over two-thirds of the actual findings, including glm's own critical-severity finding (F-006 above) and 8 other high-severity items. **Recommendation:** (1) make `mergeResearchRegistries`/`mergeReviewRegistries` schema-tolerant — accept `findings` as an alias for `keyFindings`, or normalize per-lineage registries against a schema validator before merge; (2) at minimum, emit a loud `schema_mismatch` warning (mirroring the pattern already used elsewhere in this same runtime, e.g. `deep_research_auto.yaml`'s `jsonl_wrong_type` failure reason) with an accurate `skipped_findings_count` in the merge stdout instead of silently continuing; (3) add a merge-output invariant test asserting `sum(per-lineage finding counts) == merged finding count` (accounting for intentional dedup) so this class of bug fails CI rather than surfacing only via manual cross-check.

### 4.2 High Severity

**[F-001/G-001] Phase Documentation Map status drift.** Every phase parent (002-007) has all/most child rows stuck at "Draft" in the Phase Documentation Map while the parent METADATA table claims "Complete." glm quantified: 40 total child rows across 6 phase parents, all contradicting their own parent header. `[SOURCE: 002/spec.md:55,123-140; 003/spec.md:45,105-116; 004/spec.md:53,197; 005/spec.md:53,200; 006/spec.md:56,211-216; 007/spec.md:53,198-199]`. Root cause (glm): the Phase Documentation Map tables were scaffolded with template-default "Draft" rows and never synced when children completed — a one-time scaffold-generation gap, not per-file human error. **Recommendation:** add a `step_phase_map_status_sync` reducer pass (reads each child's `implementation-summary.md` `completion_pct` → propagates to the parent map); backfill all 40 rows now.

**[F-002/G-003] Comment-hygiene violations — 6 live ephemeral finding-ID markers, confirmed at exact line numbers by both lineages independently.** `deep_review_auto.yaml:395,408,988` and `deep_research_auto.yaml:301,319,1099` all still carry `<!-- F-010-B5-0X -->`-style markers, in direct violation of the project's constitutional comment-hygiene hard block. Both lineages cite the identical 6 locations (cross-validated, high confidence). Note: this dispatcher independently found the `deep_research_auto.yaml:301,319` pair before dispatch (see §9); both lineages went further and found 4 more (`deep_review_auto.yaml:395,408,988`, `deep_research_auto.yaml:1099`) that were not in the pre-seeded known-leads list. **Recommendation:** remove all 6; add a lint rule matching `F-\d+-\w+-\d+` inside YAML comments to `validate.sh` or a pre-commit hook.

**[F-003] Stale `completion_pct: 0` continuity across 50+ files** despite `implementation-summary.md` claiming 100% — systemic three-way contradiction between `spec.md`/`plan.md`/`tasks.md` continuity frontmatter and the actual completion doc, affecting nearly every sub-phase in 002, 003, 006, plus the 001 and 008 parents. **Recommendation:** `step_completion_pct_sync` reducer pass + one-shot backfill script.

**[F-004/G-002] Review registries never updated post-`007-fan-out-hardening`.** Both `codex` and `glm` deep-review lineages ended CONDITIONAL; `008/007-fan-out-hardening`'s own `implementation-summary.md` claims `completion_pct: 100` and lists concrete fixes (glm confirms via direct read: `key_files` lists `fanout-run.cjs`/`fanout-merge.cjs`, `answered_questions` references the salvage-retry and sandbox-opt-in fixes) — but neither review lineage's JSON finding registry was ever updated to disposition the now-fixed findings: glm's registry shows 9 findings still `status:"?"` (unset); codex's registry shows **0 findings at all** despite 50 completed iterations — see next finding for why. **Recommendation:** add `step_review_registry_disposition`; backfill glm's registry with resolved/still-active/accepted-risk status plus evidence per finding.

**[F-012+F-014, glm-only — high-value new finding] Codex review lineage's zero-finding registry has a diagnosed root cause: a salvage-naming collision, not an actual absence of findings.** The codex review lineage has 100 iteration files: 50 real (`iteration-001.md`...`iteration-050.md`, zero-padded) plus 50 salvage-failure placeholders (`iteration-1.md`...`iteration-50.md`, non-padded, containing only a `<!-- fanout_salvage_failed -->` stub). glm's hypothesis: the reducer's iteration glob pattern is non-padding-aware and processes the empty placeholders instead of (or in addition to) the real files, producing the observed 0-finding registry. **Recommendation:** fix the salvage-write path to use canonical zero-padded naming (mirroring the §3.3 glm duplicate-naming bug — this may be the SAME root defect manifesting in two different lineages/loop-types); add a cleanup step for orphaned non-padded salvage placeholders; re-run the reducer against only the 50 real files to backfill codex's actual findings.

**[F-007] Abandoned "native" review lineage with a stale >21h lock referencing a non-existent old packet path.** `review/lineages/native/.deep-review.lock`: `started_at_iso == last_heartbeat_iso` (never re-heartbeated after acquisition — crashed after iteration 1), TTL 5 min, now >21h stale. The lock's `packet_id` references the pre-migration path (`156-agent-loops-improved`/`123-agent-loops-improved` depending on lineage — see F-011 below), which no longer exists. No TTL sweeper currently reclaims dead locks of this kind. **Recommendation:** manually remove the lock and archive the native lineage; add a `step_lock_ttl_sweep` to review INIT that reclaims locks past TTL with no live heartbeat.

**[F-008/G-007] ADR-titled phases missing governance docs.** 2 of 3 `-adr`-named sub-phases in `003-deep-loop-workflows` (`003-cross-mode-anti-convergence-adr`, `005-anchor-ownership-conflict-adr`) lack `decision-record.md`; **zero** of the 12 sub-phases in that packet have a `checklist.md`, despite most being Complete-status Level 2/3 work. **Recommendation:** author the missing decision-records from existing spec context; add a `validate.sh` rule requiring `decision-record.md` for any `*-adr/` folder and `checklist.md` for any Level 2+ Complete folder.

**[F-009/G-006] Root and remediation `graph-metadata.json` omit real implementation surfaces.** `key_files` at the root and at `008-loop-systems-remediation` lists only 2 files total, omitting 40+ real implementation surfaces (e.g., `fanout-run.cjs`, `fanout-merge.cjs` are absent from the root's list). Also: `last_active_child_id: null` despite 8 completed children, and glm additionally caught `description.json` truncated mid-word ("resilienc..."). This directly reconfirms the pre-seeded lead (prior glm-review P1-007) as **still unresolved** despite a previously-claimed "62 folders refreshed" metadata regen. **Recommendation:** `step_aggregate_child_key_files` reducer pass; fix the truncation bug in whatever writes `description.json`; backfill both root and 008-parent metadata now.

**[F-010] Weak-evidence phases and live template scaffolds under Complete status, reconfirmed and expanded.** 3 `plan.md` files remain byte-identical to the unmodified Level-1 template (170 lines) under folders marked Complete; 3 implementation summaries explicitly admit their target test suites were never actually run locally; the root `spec.md` claims `completion_pct: 50` while 87.5% (7/8) of top-level phases are independently marked Complete — an inconsistent root rollup. Confirms the pre-seeded leads (`008/003`, `006/005`, `006/006` weak evidence; `001-reference-research`, `004/001`, `005/001` empty scaffolds) and adds the root `completion_pct` rollup mismatch as a new instance of the same pattern. **Recommendation:** add template-default-content detection to `validate.sh`; require explicit test-run evidence (not just a completion claim) before a phase can carry Complete status.

**[F-011] 14 references to the old pre-migration packet number (`123-agent-loops-improved`) persist across 7 phase-parent `spec.md` files** (in Parent Spec, Successor, and prose fields) — the packet was migrated to `030-deep-loop-improved` but a global find-replace was never completed. This directly explains and generalizes the pre-seeded "orphaned pre-migration `review-report.md` at the old `skilled-agent-orchestration/123-agent-loops-improved` path" lead — it's not an isolated orphaned file, it's a **systemic 14-reference migration-residue pattern** across 7 files. **Recommendation:** global find-replace `123-agent-loops-improved` → `030-deep-loop-improved` (and audit for any `156-agent-loops-improved` variant per F-007's lock file); tombstone or delete the orphaned old-path `review-report.md`.

**[F-015] `008-loop-systems-remediation` parent scaffolds are still pure, unmodified templates despite Status: Complete.** Parent `tasks.md` is verbatim Level-1 template (`T001`-`T010`, all unchecked); `implementation-summary.md` literally says `"Replace template defaults on first save"` while carrying `completion_pct: 0` — directly contradicting the parent `spec.md`'s own `completion_pct: 100, Status: Complete` claim, and directly matching glm-review's still-open P1-006 finding (confirmed still live, not resolved as some other evidence implied). **Recommendation:** author real parent-level `tasks.md`/`implementation-summary.md` content aggregated from the 7 completed child phases.

**[F-017/G-008] 6 missing `validate.sh` semantic checks would have caught every drift pattern above.** glm's proposed check list: phase-map status consistency, cross-file `completion_pct` agreement, template-default-content detection, packet-id reference consistency (catches F-011), ADR-folder completeness (catches F-008), and comment-hygiene lint (catches F-002). **Recommendation:** implement as `validate.sh --strict --semantic` rule additions — this is the single highest-leverage systemic-prevention item in the backlog, since it would make 6 of the ~10 major finding categories above self-detecting on every future save.

### 4.3 Medium Severity

**[F-005] Fan-out convergence-threshold default mismatch between dispatch paths.** The CLI-executor fan-out path inherits the YAML's research default (0.05) while the native command dispatch path hardcodes 0.1 elsewhere in the same runtime — switching executor types without an explicit `--convergence` value silently changes convergence behavior. Distinct from, but related to, the propagation gap this dispatcher already worked around (§9) — that gap was about the value not reaching the lineage AT ALL when fan-out is active without the fix applied; this finding is about the *default* disagreeing across paths even when it does reach the lineage. **Recommendation:** align the two defaults; log the effective threshold value at dispatch time so operators can see which default applied.

**[F-013] Convergence "denominator drag" in 30+-iteration loops.** glm's hypothesis: the monotonic growth of the iteration-count denominator in the rolling-average newInfoRatio calculation increasingly suppresses genuinely-novel late-loop discoveries below a fixed 0.01 threshold, independent of whether real novelty still exists at iteration 30+. Marked `needs-design`, not directly observed in this run (neither lineage reached iteration 30). **Recommendation:** consider an optional sliding-window convergence mode (last-N-iterations average) as an alternative to the full-history rolling average, for operators who explicitly want deep, forced-depth runs.

**[F-016] Four additional safety/observability hardening recommendations (glm, `needs-design`):** (1) stall-watchdog alerting on the observability event stream, (2) explicit finding-deduplication logic in lineage merge (directly relevant given F-004/§4.1's silent-drop bug — merge-time dedup and merge-time completeness are two faces of the same reliability gap), (3) a per-lineage token/cost budget cap, (4) `lagCeiling`-to-observability-status mapping so operators can see backpressure in the dashboard, not just the raw ledger.

**[G-008] Validator/workflow-contract gaps allow drift recurrence** — gpt's framing of the same systemic-prevention theme as F-017, phrased as required new validator IDs: `SCAFFOLD_COMPLETION_DRIFT`, `PHASE_MAP_STATUS_SYNC`, `STATUS_COMPLETION_PCT_SYNC`, `KEY_FILES_COVERAGE`, plus review-finding adjudication and command-asset comment-hygiene checks, and fan-out YAML/argument-contract regression tests (directly motivated by this exact dispatch's pre-flight findings, §9).

### 4.4 Low Severity

**[F-018] Root `spec.md` `key_files: []` (empty) while every phase child lists 2-5 real files** — a facet of F-009 but specifically calling out the root spec.md frontmatter as the likely upstream source of the aggregation gap. Also: `008-loop-systems-remediation/spec.md:42` labels itself `Level: 1 (phase parent)`, a non-standard annotation — a folder with 7 numbered children should be Level 2 per spec-kit convention.

**[F-019/G-009, new this synthesis] Duplicate iteration-file naming inflates apparent iteration counts and may share a root cause with the codex salvage-naming bug (F-012).** See §3.3. Not independently found by either lineage as a *named* finding (both were self-reporting their own counts without noticing the duplication), but directly derivable from their own raw JSONL, and worth tracking as its own backlog item since it affects trust in any future "N iteration files" reporting for this tooling.

---

## 5. Prioritized Remediation Backlog

### Tier 0 — Fix the research/review tooling before trusting its next run
1. **[NEW, §4.1]** Fix `fanout-merge.cjs` silent-drop-on-schema-mismatch (schema-tolerant merge, or fail loud with an accurate skip count, or both). This is Tier 0 because every other finding in this report passed through the same tool that just demonstrated it can silently discard two-thirds of its own input.
2. **[F-006/G-005]** Add a `--lineage-timeout-hours` (or equivalent) override to `fanout-run.cjs`; stop hard-capping at 4h regardless of configured scope.
3. **[F-002/G-003]** Remove all 6 live ephemeral comment-hygiene markers (`deep_review_auto.yaml:395,408,988`; `deep_research_auto.yaml:301,319,1099`); add the lint rule so they can't recur.
4. **[F-012/F-014]** Fix the salvage-write naming bug causing the codex zero-finding registry (and re-run the reducer to backfill codex's real findings once fixed).
5. **[F-019/G-009]** Fix the glm-side duplicate-iteration-filename bug (likely same code path as #4).

### Tier 1 — Close the drift between claimed-complete and actual evidence
6. **[F-001/G-001]** Sync all 40 Phase Documentation Map rows (002-007) from Draft to their real status.
7. **[F-003]** Backfill 50+ stale `completion_pct: 0` continuity blocks.
8. **[F-011]** Global find-replace of the 14 old-packet-number (`123-agent-loops-improved`) references; tombstone the orphaned old-path `review-report.md`.
9. **[F-004]** Disposition glm's 9 unset review findings with resolved/active/accepted-risk + evidence.
10. **[F-009/G-006]** Backfill root + 008-parent `graph-metadata.json` `key_files`/`last_active_child_id`; fix `description.json` truncation.
11. **[F-015]** Author real 008-parent `tasks.md`/`implementation-summary.md` content (currently pure templates under a Complete-status parent).
12. **[F-007]** Remove the stale >21h native review lock; archive that lineage.
13. **[F-008/G-007]** Author the 2 missing ADR `decision-record.md` files; add `checklist.md` where required.

### Tier 2 — Infrastructure/design hardening
14. **[F-005]** Align fan-out convergence-threshold defaults across CLI and native dispatch paths.
15. **[§3.4]** Promote `--stop-policy=max-iterations` to a first-class, documented `/deep:research`/`/deep:review` flag for operators who need forced-depth runs — this run proves threshold tuning alone cannot deliver it.
16. **[F-013]** Design a sliding-window convergence mode as an alternative to full-history rolling average for long/forced-depth loops.
17. **[F-016]** Implement the 4 additional hardening recommendations (stall alerting, merge dedup, token budget cap, lag-ceiling observability mapping).
18. **[F-010]** Add template-default-content detection to `validate.sh`.

### Tier 3 — Systemic prevention
19. **[F-017/G-008]** Implement the 6 proposed `validate.sh --strict --semantic` checks — highest leverage single item; would make most of Tier 1 self-detecting going forward.

---

## 6. Meta-Findings: Bugs Confirmed In the Very System Being Researched

This section directly answers whether the bugs found/worked around during dispatch belong in the research's own findings output — **yes, and they now do** (folded into §4-§5 above by ID). Summary for quick reference:

| # | Bug | Status | Where documented above |
|---|---|---|---|
| 1 | `--reasoning-effort=max` is not a valid enum value (`REASONING_EFFORTS` has no `max`, only up to `xhigh`) | Dispatcher-side input-normalization issue, not a runtime bug — flagged, not folded into findings | §9 |
| 2 | `step_fanout_spawn_cli`'s documented command in `deep_research_auto.yaml` never threads `--convergence-threshold` into `fanout-run.cjs` | **Confirmed as a real runtime bug by BOTH lineages independently** (F-005/G-004) | §4.2 (via G-004), §9 |
| 3 | Fan-out lineages only receive `config.maxIterations` in their prompt when per-executor `--iters=N` is explicitly set; the top-level `--max-iterations` flag does not propagate to fan-out lineages on its own | Dispatcher-side finding from reading `executor-config.ts`/`fanout-run.cjs` source; not independently rediscovered by either lineage (they were dispatched with the corrected config, so they had no reason to notice the gap) — recommend a follow-up regression test | §9 |
| 4 | `computeLineageTimeoutMs` 4-hour hard cap, no override | **Confirmed as critical by glm, high by gpt** | §4.1 (F-006/G-005) |
| 5 | `fanout-merge.cjs` silently drops non-`keyFindings`-schema registries | **New, discovered during this synthesis pass, not by either lineage** (neither lineage saw the merge step — it runs at the root level after both lineages finish) | §4.1 |

Items 2 and 4 give strong independent triangulation: this dispatcher found item 2 by static code reading before any lineage ran; both lineages then independently re-discovered and confirmed it via live investigation during their own loops, with gpt's report explicitly recommending the exact fix this dispatcher had already applied ("must pass `--convergence-threshold {convergence_threshold}`... into `fanout-run.cjs`... Add a regression proving `config.convergenceThreshold: 0.01` reaches the detached lineage prompt"). Item 5 is the one gap neither lineage nor the original pre-flight caught, because it lives strictly in the root-level merge step that only runs after fan-out completes — a blind spot inherent to how this whole exercise was structured (LEAF lineages cannot see their own merge step). Recommend the packet's own review/research process add a check step explicitly for "does the deep-loop-runtime merge/synthesis path preserve 100% of per-lineage findings" going forward.

---

## 7. Cross-Lineage Corroboration Matrix

| Theme | glm ID | gpt ID | Independently corroborated? |
|---|---|---|---|
| Phase-doc-map / completion status drift | F-001 | G-001 | Yes |
| Comment-hygiene markers | F-002 | G-003 | Yes — identical 6 line numbers |
| Review registries stale post-hardening | F-004 | G-002 | Yes |
| Convergence-threshold propagation gap | F-005/F-013 | G-004 | Yes |
| 4h timeout cap | F-006 | G-005 | Yes |
| ADR/checklist governance gaps | F-008 | G-007 | Yes |
| Graph-metadata key_files omissions | F-009 | G-006 | Yes |
| Validator/systemic-prevention gaps | F-017 | G-008 | Yes |
| Stale completion_pct | F-003 | (folded into G-001 prose) | Partial |
| Stale native lock | F-007 | (folded into G-002 prose) | Partial |
| Old-packet-number migration residue | F-011 | (folded into G-002 prose: "old-path reports remain searchable") | Partial |
| Codex salvage-naming / zero-finding root cause | F-012/F-014 | not separately identified | glm-only |
| Weak-evidence/template scaffolds | F-010 | (folded into G-001 prose: "scaffold docs") | Partial |
| 008-parent template scaffold | F-015 | (folded into G-001 prose) | Partial |
| Root/008 metadata annotation issues | F-018 | not separately identified | glm-only |
| Duplicate iteration-file naming | not self-identified | not self-identified | Neither — found only during this synthesis (§3.3) |
| Merge silent-drop-on-schema-mismatch | not visible to lineage | not visible to lineage | Neither — found only during this synthesis (§4.1) |

8 of the top-level themes were found by **both** lineages independently despite zero shared context — strong convergent validity for the highest-priority items in §5. glm's finer-grained atomization (18 discrete IDs vs. gpt's 8 broader ones) surfaced several specifics (F-003, F-007, F-011, F-012/F-014, F-018) that gpt's coarser thematic grouping folded into prose without a dedicated ID — those are lower-confidence single-source findings but each carries a direct file:line citation and was spot-checked as plausible during this synthesis.

---

## 8. Negative Knowledge (What Was Ruled Out)

- Fan-out convergence-threading is NOT broken for *explicit* `--convergence` values reaching `buildLoopPrompt` (confirmed correct once the dispatcher's fix was applied) — the bug is specifically that the shipped example command in the YAML omits the flag, not that the underlying plumbing is broken.
- The codex review lineage's non-convergence to 35 iterations is NOT the same bug as gpt's early stop here — codex was intentionally run with `stopPolicy: max-iterations` in its own prior dispatch (glm's F-014), which is the correct lever (see §3.4 recommendation to use it more broadly, including for future research runs).
- The Phase Documentation Map "Draft" status is NOT intentional — every affected parent's own `spec.md` REQ text requires Complete children.
- `completion_pct: 0` drift is NOT a deliberate design choice — the corresponding `implementation-summary.md` files correctly say 100 in the same folders.
- The old-packet-number references are NOT historical/archival annotations — gpt confirms some appear in live navigation fields (Parent Spec / Successor), not just prose history.
- Treating `implementation-summary.md` presence as proof of completion is unsafe (gpt) — sampled summaries can still contain unmodified template text (directly confirmed by F-015).
- Blaming `fanout-run.cjs` alone for the threshold-omission bug is imprecise (gpt) — `buildLoopPrompt` correctly emits the threshold when the caller (the YAML step) passes it; the bug is in the YAML's own shipped command, which this dispatcher corrected for this run.
- 36 glm iteration files do NOT mean glm exceeded its 35-iteration cap (§3.3) — it is a duplicate-write artifact of 18 real iterations.

---

## 9. Operational Notes on This Dispatch

Documented in full detail in the dispatcher's own status reporting to the operator; summarized here for the research record:

1. **`--reasoning-effort=max` requested for glm is not a valid value** (`REASONING_EFFORTS = [none, minimal, low, medium, high, xhigh]`, `executor-config.ts:14`). Mapped to `xhigh` (the top tier) as the closest faithful interpretation; flagged as a deviation, not silently absorbed.
2. **`deep_research_auto.yaml`'s shipped `step_fanout_spawn_cli` command omits `--convergence-threshold`** — confirmed as a real bug, now also independently confirmed by both lineages (F-005/G-004, §4.1/§6). Corrected in this dispatch by adding `--convergence-threshold 0.01` directly to the `fanout-run.cjs` invocation; verified live via `ps aux` that both running subprocess prompts carried `config.convergenceThreshold: 0.01`.
3. **Per-executor `--iters=N` is required for `config.maxIterations` to reach a fan-out lineage at all** (`hasIterationCap` gate in `fanout-run.cjs`) — the top-level `--max-iterations` flag alone does not propagate into fan-out mode. Corrected by adding `"iterations": 35` to both fan-out executor entries; verified live that both prompts carried `config.maxIterations: 35`.
4. **Provider/model preflight passed cleanly** — both `zai-coding-plan` and `openai` credentials configured; both model IDs (`zai-coding-plan/glm-5.2`, `openai/gpt-5.5-fast`) exist. No substitution needed on the executor/model axis.
5. **Neither lineage reached the ≥30-iteration operator target** (glm: 18, gpt: 11) despite items 2-3 above being correctly applied and verified live — root-caused in §3 as a legitimate convergence-algorithm behavior (question-coverage/entropy stop branch, orthogonal to the ratio threshold) rather than a failure of this dispatch's corrections. The corrections were necessary but not sufficient for forced-depth; §3.4/§5 item 15 recommends `--stop-policy=max-iterations` as the actual correct lever for future forced-depth runs of this exact packet.

---

## 10. Methodology

Two independent, isolated `cli-opencode` fan-out lineages, each executing a complete deep-research loop (fresh context per iteration, externalized JSONL + markdown state, convergence detection per `convergence.md`) inside its own sub-packet. Sources consulted across both lineages: phase parent/child `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` (50+ files), the deep-research/deep-review YAML workflow files, the fan-out runtime `.cjs` scripts (`fanout-run.cjs`, `fanout-merge.cjs`, `fanout-pool.cjs`, `fanout-salvage.cjs`), review-lineage artifacts (glm, codex, native), and graph/description metadata files. Every finding in the source lineage reports carries a `[SOURCE: file:line]` citation; this synthesis re-verified the merge-drop bug (§4.1/§6) and the duplicate-filename artifact (§3.3) via direct file inspection rather than relying on either lineage's self-report, since neither lineage's own loop could see the post-completion merge step.

---

## 11. References

- Packet spec: `.opencode/specs/deep-loops/030-deep-loop-improved/spec.md`
- glm lineage synthesis (source): `.opencode/specs/deep-loops/030-deep-loop-improved/research/lineages/glm/research.md`
- gpt lineage synthesis (source): `.opencode/specs/deep-loops/030-deep-loop-improved/research/lineages/gpt/research.md`
- glm findings registry (raw, `findings` schema): `.opencode/specs/deep-loops/030-deep-loop-improved/research/lineages/glm/deep-research-findings-registry.json`
- gpt findings registry (raw, `keyFindings` schema): `.opencode/specs/deep-loops/030-deep-loop-improved/research/lineages/gpt/deep-research-findings-registry.json`
- Merged (gpt-only, see §4.1 bug) root registry: `.opencode/specs/deep-loops/030-deep-loop-improved/research/deep-research-findings-registry.json`
- `fanout-attribution.md`: `.opencode/specs/deep-loops/030-deep-loop-improved/research/fanout-attribution.md`
- Fan-out runtime: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs`
- Executor config schema: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- Workflow YAML: `.opencode/commands/deep/assets/deep_research_auto.yaml`, `deep_review_auto.yaml`
- Convergence algorithm: `.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md`
- resource-map.md (per-lineage; no root-level map was produced by either sub-loop's own scope — see `research/resource-map.md` for this synthesis's merged version)
