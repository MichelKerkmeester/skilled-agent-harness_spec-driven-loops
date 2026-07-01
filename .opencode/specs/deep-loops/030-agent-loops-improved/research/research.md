# Research Report: Perfecting deep-loops/030-agent-loops-improved (Generation 2 — Forced-Depth Fan-Out Synthesis)

**Spec Folder:** `.opencode/specs/deep-loops/030-agent-loops-improved`
**Mode:** 2-lineage fan-out, generation 2 (RESTART — see §1.1), `glm` = zai-coding-plan/glm-5.2 @ xhigh, `gpt` = openai/gpt-5.5-fast @ high
**Configured:** maxIterations=35 (forced), convergenceThreshold=0.01 (telemetry-only), **stopPolicy=max-iterations**
**Run window:** 2026-07-01T07:15:47Z (dispatch) – 2026-07-01T07:39:02Z (gpt terminal) / ~07:34Z (glm real completion) — **orchestrator process itself did not exit until ~09:02Z; see §6.3**
**Generation-1 report (preserved, do not delete):** `research/research_archive/20260701T071133Z-gen1/research.md` (26 findings, F-001..F-019, G-001..G-009)
**Date compiled:** 2026-07-01

---

## 1. Executive Summary

This is round 2 of a two-round forced-depth research effort on the same packet. Round 1 (archived at `research_archive/20260701T071133Z-gen1/`) legally converged early (glm: 18 iterations, gpt: 11) on a question-coverage/entropy signal independent of `convergenceThreshold`. Round 2 forced `stopPolicy=max-iterations` on both lineages, guaranteeing exactly 35 real iterations each — confirmed genuine, not merely claimed (§2).

**Both lineages hit real 35-iteration depth**, and the forced depth paid off: glm alone surfaced **13 net-new findings** beyond round-1's baseline (its own iteration 034 delta inventory), and gpt independently surfaced **12 clean, evidence-cited findings**, 2 of which (comment-hygiene locations beyond the original 6; the `009` remediation phase's own metadata staleness) are genuinely new since round 1.

**Round 2 also surfaced two brand-new, more severe bugs in the research tooling itself**, found only because this run pushed depth and because the orchestrating session cross-checked live process state rather than trusting self-reported completion (§6.1, §6.2):

1. **glm's own synthesis step never ran to completion.** Its internal JSONL narrates `max_iterations_reached` → `synthesis_complete` at iteration 35, but `deep-research-findings-registry.json` was never updated past its INIT-time empty state (0 keyFindings, all 8 openQuestions still `"open"`), and `research.md`/`deep-research-dashboard.md`/`resource-map.md` were never written at all. The 35 iterations of real, substantive, evidence-cited work exist ONLY as raw `iterations/iteration-0NN.md` files — this report had to reconstruct glm's findings directly from those files rather than from its (empty) registry.
2. **The fan-out orchestrator hung for over an hour after both underlying CLI subprocesses had already exited.** gpt settled cleanly (`orchestration-status.log` "completed" event, `terminal:true`, at 07:39:02Z). glm's own subprocess also exited (confirmed via live `ps`/`lsof` — no `opencode run` process for either lineage remained), yet the orchestrator's ledger never recorded a "completed" event for glm, and the top-level `fanout-run.cjs` process (and its tsx-loaded child) stayed alive, idle, for ~1h20m+ past both lineages' real completion, never writing `orchestration-summary.json` and never exiting on its own. It was manually terminated by this session (`kill -TERM`) so the run could be synthesized. `fanoutConfig.lagCeilingMs` was left at its default (0 = disabled) — there is no active stall-watchdog that would have caught this.

Also confirmed this round: **round-1's Tier-0 #1 "merge silent-drop" bug is genuinely FIXED** in live code (`fanout-merge.cjs`'s `normalizeRegistrySchema` + `reconstructReviewRegistryFromState`, shipped by `009/001-fanout-merge-schema-tolerance`) — verified both by glm's own code-read (iteration 010) and independently by this session re-running `fanout-merge.cjs` against generation-2's registries, which produced no schema-mismatch warning (glm's registry is genuinely empty, not mis-shaped). Of round-1's 4 "Tier 0 immediate" backlog items, only this one shipped; the other 3 (`009/002` timeout override, `009/003` comment-hygiene + salvage-naming) remain scaffolded but unimplemented as of this run (§5).

---

## 1.1 Lifecycle Decision: RESTART (not resume) — record for the reconciliation trail

Both generation-1 lineages had already produced a lineage-level `research.md` synthesis plus a terminal `converged`/`legal_convergence` JSONL event before this dispatch began — a textbook "completed session." `deep_research_auto.yaml`'s own documented `on_completed_session` branch is `halt: true`, with message *"Completed deep-research packet detected. Archive or replace the existing research/ tree before starting a new session"* (`deep_research_auto.yaml:276-279`) — resume is contractually reserved for continuing a still-active lineage, not extending a session that already reached synthesis. Restart was therefore the only clean, documented path.

**What was archived (moved, not deleted), matching the documented `on_restart` mechanic** (`mkdir -p {archive_root} && mv {packet_dir} {archive_root}/{timestamp_slug}`, `deep_research_auto.yaml:268`), applied at whole-research-tree granularity since fan-out has no single `packet_dir`:
- `research/lineages/glm/`, `research/lineages/gpt/` (full generation-1 lineage trees)
- `research/research.md`, `resource-map.md`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `orchestration-status.log`, `orchestration-summary.json`, `observability-events.jsonl`

All preserved at `research/research_archive/20260701T071133Z-gen1/`.

**Consequence:** generation 2 minted fresh session IDs and its own finding-ID schemes (glm: `B-001`..`B-013`; gpt: `R2-GPT-001`..`R2-GPT-012`) with no memory of generation-1's `F-00N`/`G-00N` IDs. **§7 below is the explicit crosswalk** the operator asked for — the remediation phase (`009-research-backlog-remediation`, 10 planned children) that already cites generation-1 IDs throughout its children's `spec.md` files does **not** need any edits: every citation found (`grep -rn` across all 10 children) already resolves through the archived path `research/research_archive/20260701T071133Z-gen1/research.md`, which this restart preserved byte-for-byte. Nothing goes stale. §7 additionally maps each generation-1 ID to its generation-2 confirmation/refinement for anyone extending the 009 children with round-2 evidence.

---

## 2. Iteration Count Verification (genuine, not claimed)

| Lineage | Claimed | Real padded iteration files on disk | JSONL `type:"iteration"` records | Terminal event | Registry `metrics.iterationsCompleted` |
|---|---|---|---|---|---|
| gpt | 35 | 35 (`iteration-001.md`..`iteration-035.md`, each distinct, 14 lines, real content — verified by diff) | 35 | `orchestration-status.log`: `{"event":"completed","label":"gpt","duration_ms":1395301,"terminal":true}` at 07:39:02Z | **35** ✓ |
| glm | 35 | 35 (`iteration-001.md`..`iteration-035.md`, each distinct, 1.3–2.8KB, substantive cited content — verified by direct read of all 35) | 35 (`deep-research-state.jsonl`, final record: `{"event":"max_iterations_reached","run":35,"stopReason":"maxIterationsReached"}` then `{"event":"synthesis_complete","totalIterations":35,"answeredCount":8,"totalQuestions":8}`) | **No** orchestrator-ledger "completed" event — see §6.2 | N/A — registry never updated past INIT (0 keyFindings) |

**Both lineages genuinely reached iteration 35/35.** `stopPolicy=max-iterations` worked exactly as designed for iteration depth. The verification gap that mattered was NOT iteration count — it was that "the loop said it's done" (JSONL/registry self-report) and "the orchestrator recorded it as done" (ledger completion) diverged for glm, and would have gone unnoticed without directly cross-checking live process state (§6.2).

Both lineages also independently show a duplicate non-zero-padded iteration-filename artifact from the salvage sweep (glm: not present this round — checked, none found; **gpt: `iteration-1.md`..`iteration-35.md`, 35 files, all byte-identical to each other at 4753 bytes, containing raw captured agent tool-narration text, NOT iteration content** — see §6.4, a materially worse variant of the round-1 F-019/G-009 artifact).

---

## 3. Consolidated Findings

### 3.1 New/refined meta-bugs in the research tooling itself (highest priority — found by this synthesis, not by either lineage)

**[NEW-1, CRITICAL] glm's self-driven lineage narrated completion but never wrote its own synthesis artifacts.** `research/lineages/glm/deep-research-findings-registry.json` is byte-identical to its INIT-time state: `keyFindings: []`, `resolvedQuestions: []`, all 8 `openQuestions` still `"status":"open"` — despite the JSONL claiming `synthesis_complete` at iteration 35 with `answeredCount:8/8`. `deep-research-dashboard.md`, `research.md`, and `resource-map.md` were never created in the lineage directory at all (confirmed via direct `ls`; none exist). The 35 iterations of real work (evidence-cited, high novelty per glm's own `newInfoRatio` fields) exist only as raw `iterations/iteration-0NN.md` files. **This means any tooling that trusts a lineage's JSONL "synthesis_complete" event, or its registry, as a completion/content signal — exactly what `fanout-merge.cjs` does — will silently see ZERO findings from a lineage that actually did the most substantive work of the two.** This is a more severe variant of round-1's various "claimed-complete but incomplete" findings (F-003/F-010/F-015), this time inside the research runtime's own synthesis step rather than in the packet being researched. **Recommendation:** add a synthesis-completion invariant check — `synthesis_complete` may only be logged after `registry.keyFindings.length > 0` (when the lineage produced any findings) and after `research.md`/`dashboard.md` exist on disk; otherwise emit a `synthesis_incomplete` warning event instead.

**[NEW-2, CRITICAL] Fan-out orchestrator can hang indefinitely after a lineage's underlying CLI subprocess has already exited, with no watchdog to catch it.** Both `glm`'s and `gpt`'s `opencode run` subprocesses had exited (confirmed via live `ps`/`lsof` — no matching process for either lineage remained, by ~07:34–07:39Z). gpt settled cleanly in the pool (ledger `"completed"`/`terminal:true`). glm's worker never produced a ledger `completed`/`failed` event, and the top-level `fanout-run.cjs` process (PID 18501/child 18503, confirmed via `ps -p`/`pgrep -P`) remained alive and idle (0.43s total CPU across 1h40m+, kqueue-blocked with zero pending events) until this session manually sent it `SIGTERM`. `fanoutConfig.lagCeilingMs` was left at its schema default (`0` = disabled), and `progressHeartbeatSeconds` heartbeats (which WERE firing — `orchestration-status.log` shows regular `progress` events for glm) do not themselves trigger any timeout/abort; they are purely observational. **Recommendation:** this is precisely what round-1's F-016 ("lagCeiling-to-observability-status mapping") and glm's own round-2 iteration 013 finding ("fanout-pool.cjs silent-return patterns") anticipated in the abstract — this run provides the first concrete reproduction. Set a non-zero default `lagCeilingMs` (or require an explicit opt-out) so a worker whose underlying subprocess exited without a corresponding pool-settle event is force-failed after a bounded grace period, rather than hanging the whole orchestrator indefinitely.

**[CONFIRMED FIXED] Round-1 critical merge silent-drop bug — verified resolved in live code, by two independent methods.** `fanout-merge.cjs` now has `normalizeRegistrySchema` (canonical/alias tolerance, e.g. `findings`→`keyFindings`) wired into both `mergeResearchRegistries` and `mergeReviewRegistries`, plus `reconstructReviewRegistryFromState` for leaf-only review lineages — shipped by `009/001-fanout-merge-schema-tolerance` (`implementation-summary.md` claims 33/33 targeted tests pass; not re-run this round, code-level confirmation only). Verified two ways: (1) glm's own iteration 010 direct code read; (2) this session independently re-ran `fanout-merge.cjs --loop-type research --artifact-dir research/` against the real generation-2 registries and got `{"status":"ok","merged_lineages":2,"key_findings":12}` with **no schema-mismatch warning** — the 0-from-glm result is accurate (glm's registry is genuinely empty, not mis-shaped), which is a different, new bug (NEW-1 above), not a recurrence of the fixed one. **Known residual gap (glm iteration 029, confirmed):** `reconstructReviewRegistryFromState` exists only for the review path; there is no `reconstructResearchRegistryFromState` counterpart for research lineages — meaning a genuinely leaf-only research lineage (crashes before writing any registry) would still be silently dropped by `mergeResearchRegistries`'s `if (!registry || !Array.isArray(registry.keyFindings)) continue;` guard. This is now a live near-miss: NEW-1 shows glm's registry technically *exists* (so it isn't skipped), but if it hadn't been written at all, generation-2's merge would have silently lost glm the same way generation-1 did.

**[ROOT-CAUSED] Salvage-naming duplicate-file bug — exact root cause and one-line fix identified (glm iteration 012).** `fanout-salvage.cjs:112`: `const iterFile = path.join(iterDir, \`iteration-${iterNum}.md\`);` — `iterNum` is a raw number from `record.iteration`, so salvage always writes **unpadded** filenames (`iteration-1.md`), while the normal write path uses zero-padded names (`iteration-001.md`). When salvage runs after real files already exist, it creates non-padded duplicates that inflate apparent iteration counts and can confuse any `iteration-*.md` glob (this is very likely the original root cause of round-1's "codex review registry: 0 findings despite 50 iterations," per F-012/F-014, now confirmed at the code level rather than just hypothesized). **Fix:** `iteration-${String(iterNum).padStart(3,'0')}.md`. Confirmed recurring in generation-2's own gpt lineage this round (§6.4) — not glm-specific, not codex-specific; it is a defect in the shared salvage path hit by any lineage whose CLI executor triggers a salvage recovery.

### 3.2 gpt's 12 findings (R2-GPT-001..012, clean registry, full detail preserved in `research/lineages/gpt/deep-research-findings-registry.json`)

| ID | Severity | Title |
|---|---|---|
| R2-GPT-001 | P0 | Phase 009 exists and partially fixed merge-schema loss, but its own metadata (`graph-metadata.json`) is already stale |
| R2-GPT-002 | P0 | Comment-hygiene violations remain live and extend beyond the six command-YAML markers (new locations: `cli-opencode/references/agent_delegation.md:225`, `cli-opencode/SKILL.md:289`) |
| R2-GPT-003 | P0 | Salvage still writes non-padded iteration filenames (matches §3.1 root-cause) |
| R2-GPT-004 | P0 | Lineage timeout override (`009/002`) remains unimplemented despite forced-depth requirements |
| R2-GPT-005 | P1 | Review registries stale-active after fixes; no adjudication ledger exists |
| R2-GPT-006 | P1 | Phase maps and completion_pct drift share a never-synced-after-completion root cause |
| R2-GPT-007 | P1 | `stopPolicy=max-iterations` is internally used but not first-class in research command docs |
| R2-GPT-008 | P1 | Detached lineage prompts blur command-host vs. LEAF-agent responsibilities |
| R2-GPT-009 | P1 | Prompt-only write isolation is a safety weakness for detached OpenCode lineages |
| R2-GPT-010 | P1 | Metadata descriptions still truncated; old packet identity (123-/156-) still live |
| R2-GPT-011 | P2 | ADR/checklist governance artifacts missing or partial under Complete-status phases |
| R2-GPT-012 | P2 | Template-default tasks remain under Complete-status folders |

### 3.3 glm's 35-iteration reconstructed backlog (B-001..B-013, extracted from raw `iterations/*.md` — its own registry never populated, see NEW-1)

**P0 — Critical:** **B-001** 4h timeout cap still live, no override, `009/002` unimplemented. **B-002** salvage naming root cause found (`fanout-salvage.cjs:112`), `009/003` unimplemented. **B-003** comment-hygiene 6 markers still live, `009/003` unimplemented.
**P1 — High:** **B-004** registry-disposition gap is systemic (both glm and codex review registries never disposition fixed findings) + research-reconstruct asymmetry (NEW scope, not in 009's plan). **B-005** phase-map Draft (40 rows) + completion_pct:0 now measured at **143 files** (wider than round-1's "50+" estimate), `009/004` unimplemented. **B-006** graph-metadata key_files omission + `last_active_child_id:null` + `description.json` truncation — root-caused to a `generate-context.js` fixed-length slice without word-boundary clamping (framework-level bug, not packet-specific), `009/006` unimplemented. **B-007** native lock stale >24h + 123-/156- residue (now measured at **16 files**, wider than round-1's 14) + no auto-sweep, `009/005` unimplemented. **B-008** `008` parent template scaffolds + missing ADR decision-records/checklists, `009/007` unimplemented.
**P2 — Medium:** **B-009** `stopPolicy` first-class flag + unconditional `minIterations` floor. **B-010** sliding-window convergence design (denominator-drag mitigation). **B-011** `fanout-pool.cjs` silent-return warnings + 4-way reducer fragmentation (`reduce-state.cjs` duplicated once per mode: research/review/improvement/context, with no shared library — explains cross-sibling convergence-threshold divergence). **B-012** `loop-lock.cjs` proactive sweep command (PID-liveness + archive-not-delete).
**P3 — Prevention:** **B-013** the 6 `validate.sh --strict --semantic` checks, now specified as concrete assertions (glm iteration 031): phase-map-status-consistency, cross-file-completion-pct-agreement, template-default-content-detection, packet-id-reference-consistency, adr-folder-completeness, comment-hygiene-lint.

**Root-cause taxonomy (glm iteration 028, new this round):** the packet's doc-drift symptoms cluster into three independent causes, not one — (A) missing post-completion sync steps (phase-map, completion_pct, registry disposition — one `speckit:complete` post-hook fixes all three), (B) derivation-layer generator bugs (`generate-context.js` under-slicing description text and under-aggregating `key_files` — one generator hardening pass fixes both), (C) scaffold-never-finalized human omissions (008 parent, 001 plan.md — needs a `validate.sh` template-detection lint, not a generator fix). This refines round-1's flat 6-check list into a 3-cause map that clarifies which fixes are code changes vs. one-time backfills vs. new lint rules.

---

## 4. Execution Status of the Remediation Phase (`009-research-backlog-remediation`)

Both lineages independently confirmed: of the 10 planned children, **only `001-fanout-merge-schema-tolerance` has shipped** (implementation-summary present, code verified live). `002` and `003` (the two remaining Tier-0/critical items — timeout override and comment-hygiene+salvage-naming) have `spec.md`/`plan.md`/`tasks.md` but no `implementation-summary.md` — scaffolded, not executed. `004`-`010` are `009/spec.md`-declared but do not exist as folders (an honest "Not Started" state, not drift — `009/spec.md`'s own phase-map is internally consistent). **Highest-leverage next action per both lineages independently: implement `009/002` and `009/003` — both already have written plans.**

---

## 5. Prioritized Remediation Backlog (unified, gen-1 + gen-2)

### Tier 0 — Tooling correctness (found this round; do before trusting another fan-out run)
0. **[NEW-2]** Add a stall/hang detector for a lineage worker whose subprocess exited without a pool-settle event (non-zero default `lagCeilingMs`, or an explicit post-exit grace-period force-fail).
0b. **[NEW-1]** Add a synthesis-completion invariant: `synthesis_complete` may not log unless registry/dashboard/research.md actually exist and (when findings were produced) `keyFindings.length > 0`.
1. **[B-001/R2-GPT-004]** Implement `009/002` — lineage timeout override. Still the single highest-leverage unshipped item; blocks trust in any future 30+-iteration run.
2. **[B-002/B-003/R2-GPT-002/R2-GPT-003]** Implement `009/003` — comment-hygiene lint (now known to extend beyond the original 6 locations) + the one-line salvage zero-padding fix (`fanout-salvage.cjs:112`).
3. **[B-004]** Add `reconstructResearchRegistryFromState` (research-side counterpart to the review-only fix already shipped) to close the residual leaf-only-research-lineage merge gap.

### Tier 1 — Drift closure (`009/004`-`009/007`, all scoped, none shipped)
4. **[B-005/R2-GPT-006]** `009/004` — phase-map + completion_pct sync (now measured at 143 stale files, not 50+).
5. **[B-007/R2-GPT-010]** `009/005` — packet-identity cleanup (16 stale `123-`/`156-` references, native lock removal).
6. **[B-004/R2-GPT-005/R2-GPT-001]** `009/006` — review-registry disposition ledger + graph-metadata backfill + `009`'s own metadata (already stale per R2-GPT-001, ironic given 009 IS the remediation phase).
7. **[B-008/R2-GPT-011]** `009/007` — 008-parent scaffold finalization + missing ADR decision-records/checklists.

### Tier 2 — Infrastructure/design hardening
8. **[B-009/R2-GPT-007]** `009/008` — surface `--stop-policy=max-iterations` as a first-class, documented flag (confirmed already correctly wired at the code level — this run is itself the proof — just undocumented).
9. **[B-010]** `009/009` — sliding-window convergence design (mitigates the mathematically-proven denominator-drag effect glm characterized this round).
10. **[B-011]** `fanout-pool.cjs` silent-return hardening + factor the 4 duplicated `reduce-state.cjs` reducers into a shared library.
11. **[B-012]** `loop-lock.cjs` proactive stale-lock sweep command.

### Tier 3 — Systemic prevention
12. **[B-013/R2-GPT-012]** `009/010` — implement the 6 `validate.sh --strict --semantic` checks (now fully specified as concrete assertions, §3.3).

---

## 6. Meta-Findings: Full Detail on Bugs Confirmed/Discovered During This Dispatch

### 6.1 glm's incomplete synthesis (NEW-1) — see §3.1 for full detail.

### 6.2 Orchestrator hang post-subprocess-exit (NEW-2) — see §3.1 for full detail. Evidence trail: `ps -p 18501,18503` showed both alive with `STAT=SN`, negligible CPU (0:00.43 total), `lsof` showing idle `KQUEUE` file descriptors (`count=0`) — i.e., genuinely blocked waiting on an event that was never going to arrive, not doing productive work. `pgrep -P 18501` confirmed only one child (18503, the tsx-loaded real process); neither had any live `opencode run` child for either lineage's model/sessionId (`ps -ef | grep <glm sessionId>` returned nothing; `ps -ef | grep zai-coding-plan/glm-5.2` matched only two OTHER, unrelated packets' processes). Manually terminated via `kill -TERM` on both PIDs.

### 6.3 Wall-clock reality check
The genuine research work (both lineages' real 35-iteration execution) completed in under 25 minutes (07:15:47Z dispatch → ~07:34–07:39Z), matching round-1's pace. The orchestrator then sat idle for **~1h20m+ longer** before this session discovered and cleared the hang — meaning "how long did this fan-out run take" has two very different honest answers depending on whether you measure the research or the orchestrator process lifetime. Neither lineage approached the 4-hour `computeLineageTimeoutMs` ceiling (still confirmed live and un-liftable, per glm iteration 011 and R2-GPT-004) — the ceiling was not the proximate cause of the hang; the hang was purely a missing post-exit settle/watchdog path.

### 6.4 gpt's non-padded duplicate iteration files contain garbage, not a harmless copy
Round-1's F-019/G-009 described glm's duplicate-naming artifact as *harmless* — each non-padded file was byte-identical to its own correctly-numbered padded sibling (`iteration-1.md` == `iteration-001.md`). This round's gpt duplicates are worse: `iteration-1.md` through `iteration-35.md` (35 files) are **all byte-identical to EACH OTHER** (4753 bytes, verified via `diff`), and their content is not iteration research at all — it is raw captured CLI-agent tool-narration/reasoning-trace text (e.g. *"The memory trigger gate rejected the detached lineage ID because it is not a server-managed memory session; I'm retrying..."*), completely unrelated to any specific iteration's actual findings. This is a materially higher-risk variant of the same root-caused bug (§3.1) — a naive `iteration-*.md` glob would not just double-count, it would ingest 35 copies of unrelated agent-narration noise as if they were 35 distinct research iterations.

---

## 7. Finding-ID Crosswalk (Generation 1 ↔ Generation 2) — REQUIRED reconciliation for `009-research-backlog-remediation`

**No action needed on the 009 children's existing citations** — every `F-00N`/`G-00N` reference already resolves through `research/research_archive/20260701T071133Z-gen1/research.md`, preserved byte-for-byte by the restart. This table is for anyone who wants to attach generation-2's fresh evidence to an existing 009 child, or extend scope.

| Gen-1 ID(s) | 009 child that cites it | Gen-2 status this round | Gen-2 ID(s) |
|---|---|---|---|
| [NEW, gen-1 §4.1] merge silent-drop | `009/001` | **CONFIRMED FIXED** (code + independent merge re-run) | R2-GPT-001 (re: 009's own stale metadata) |
| F-006/G-005 (4h timeout cap) | `009/002` | **STILL LIVE, unimplemented** | B-001, R2-GPT-004 |
| F-002/G-003 (comment-hygiene) | `009/003` | **STILL LIVE, same 6 locations + 2 new ones** | B-003, R2-GPT-002, R2-GPT-003 |
| F-012/F-014 (codex salvage collision) | `009/003` | **ROOT-CAUSED** (`fanout-salvage.cjs:112`, one-line fix) | B-002, R2-GPT-003 |
| F-019/G-009 (duplicate iteration filenames) | `009/003` | **RECURRED in gpt this round, worse variant (garbage content, not harmless dupe)** | §6.4 |
| F-001/G-001 (phase-map Draft drift) | `009/004` | **STILL LIVE**, 40 rows confirmed unchanged | B-005 |
| F-003 (completion_pct:0 drift) | `009/004` | **STILL LIVE**, count revised 50+ → **143 files** | B-005, R2-GPT-006 |
| F-011 (123-/156- migration residue) | `009/005` | **STILL LIVE**, count revised 14 → **16 files**; orphaned old-path review-report.md sub-item now resolved | B-007, R2-GPT-010 |
| F-007 (native review lock) | `009/005` | **STILL LIVE**, unchanged, >24h stale; sweep design now fully specified | B-007, B-012 |
| F-004/G-002 (review registry disposition) | `009/006` | **STILL LIVE**, confirmed systemic (both glm+codex; root cause = missing workflow step, not data corruption) | B-004, R2-GPT-005 |
| F-009/G-006 (graph-metadata key_files/truncation) | `009/006` | **STILL LIVE**; truncation root-caused to `generate-context.js` slice bug (framework-level) | B-006, R2-GPT-001, R2-GPT-010 |
| F-015 (008-parent template scaffolds) | `009/007` | **STILL LIVE**, unchanged | B-008 |
| F-008/G-007 (ADR/checklist gaps) | `009/007` | **STILL LIVE**, unchanged | B-008, R2-GPT-011 |
| F-018 (008 Level annotation) | `009/007` | Not independently re-checked this round; no contradicting evidence found | — |
| F-005/G-004 (convergence-threshold default mismatch) | `009/008` | Not independently re-verified this round | — |
| §3.4 (stopPolicy not first-class) | `009/008` | **CONFIRMED reachable and correct**; still not documented | B-009, R2-GPT-007 |
| F-013 (denominator drag) | `009/009` | **DEEPENED** — mathematically characterized, not just hypothesized | B-010 |
| F-016 (4 hardening recs) | `009/009` | Partially deepened (stall-watchdog now has a concrete reproduction, NEW-2; pool silent-return class identified) | B-011, NEW-2 |
| F-010 (template/weak-evidence phases) | `009/010` | **STILL LIVE**, new instance found in `001-reference-research/plan.md` | B-013 sub-item, R2-GPT-012 |
| F-017/G-008 (6 validate.sh checks) | `009/010` | **SPECIFIED as concrete assertions** (was a proposal, now a spec) | B-013 |

**New gen-2 findings with no gen-1 predecessor and no existing 009 child** (candidates for new scope, flagged in glm iteration 030/034 as NOT currently in 009's plan): the registry-disposition-is-systemic conclusion and the research-side `reconstructResearchRegistryFromState` gap (both currently folded into `009/006`'s existing scope per the table above, but exceed what `009/006`'s spec.md text currently describes — worth a scope-expansion pass); the 4-way `reduce-state.cjs` reducer fragmentation (B-011, no existing 009 child); and this report's own NEW-1/NEW-2 tooling bugs (no existing 009 child — recommend a new `009/011` or folding into `009/002`/`009/003` given their operational-reliability nature).

---

## 8. Negative Knowledge (what generation 2 ruled out or corrected from generation 1)

- The round-1 merge silent-drop bug is **no longer live** — do not re-flag it; `009/001` fixed it (verified two independent ways, §3.1).
- The round-1 "codex registry: 0 findings" is **no longer accurate** — the registry was rebuilt since round 1 and now shows 5 real findings (still undispositioned, a distinct live issue).
- Do **not** treat `research_archive/20260701T071133Z-gen1/`'s contents as evidence for generation-2 claims (per gpt's own explicit ruled-out note) — every generation-2 finding above was independently re-verified against live files this round, not inherited.
- The orphaned pre-migration `review-report.md` at the old `123-`/`156-` path, cited in round 1, **no longer exists** (glm iteration 007 confirms neither old path exists as a directory) — likely cleaned up or was archive-only; drop this sub-item from future backlogs.
- glm's 36-iteration-file artifact from round 1 was a harmless byte-identical duplicate (round-1 finding, re-confirmed); **do not assume the same bug is harmless in general** — gpt's generation-2 duplicate set (§6.4) is a worse variant with garbage content, not a harmless copy.
- Do not trust a lineage's own JSONL `synthesis_complete` event, or `orchestration-summary.json`'s absence, as sufficient signals of true completion state without cross-checking live process status and on-disk artifact existence — this exact gap (NEW-1/NEW-2) is what this synthesis had to work around manually.

---

## 9. Methodology

Two independent, isolated `cli-opencode` fan-out lineages under `stopPolicy=max-iterations` (forced to iteration 35/35, verified genuine via direct iteration-file content diffing, JSONL record counts, and ledger cross-checks — not taken at either lineage's word). glm's findings were reconstructed by this synthesis directly from its 35 raw `iterations/*.md` files (its own registry/dashboard/research.md were never written — §3.1/NEW-1); gpt's findings were taken from its own complete, well-formed `deep-research-findings-registry.json` (12 findings, cross-spot-checked for plausibility against cited `file:line` locations, not independently re-verified line-by-line for every citation). `fanout-merge.cjs` was re-run against the live generation-2 lineage directories (not merely trusted from the first run) and its output (`merged_lineages:2, key_findings:12, no schema warning`) is consistent with glm's registry being genuinely empty rather than a merge-tool defect. The orchestrator process's hang (§6.2) was diagnosed via direct `ps`/`pgrep`/`lsof` inspection, not inferred from tool self-reports.

---

## 10. References

- Packet spec: `.opencode/specs/deep-loops/030-agent-loops-improved/spec.md`
- Generation-1 archive (preserved verbatim): `research/research_archive/20260701T071133Z-gen1/` (`research.md`, both lineage trees, root registry/attribution/ledger)
- glm generation-2 raw iterations (registry never populated — see NEW-1): `research/lineages/glm/iterations/iteration-001.md`..`iteration-035.md`, `research/lineages/glm/deep-research-state.jsonl`
- gpt generation-2 findings registry: `research/lineages/gpt/deep-research-findings-registry.json`
- Merged registry (this run, gpt-only per glm's empty registry, NOT a merge-tool defect): `research/deep-research-findings-registry.json`
- Fan-out attribution: `research/fanout-attribution.md`
- Remediation phase (10 planned children, 1 shipped): `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/`
- Fan-out runtime: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs`, `fanout-salvage.cjs`, `fanout-pool.cjs`
- Lifecycle contract: `.opencode/commands/deep/assets/deep_research_auto.yaml:245-313` (`step_classify_session`, `on_resume`/`on_restart`/`on_completed_session`)
