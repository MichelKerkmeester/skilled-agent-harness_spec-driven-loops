# SWE lineage synthesis: the council-revised Jev recommendations as code

Lineage `swe`. Session `fanout-swe-1790457982528-yjdrdz`. Five iterations, cap 5, convergence mode off (`maxIterationsReached`). Lens: code-level slice design — exact files, functions, imports, fixtures, LOC, printed lines, kill rules. Python `jev-cli` 0.6.2 is the package every arm would spawn (`.skilled/skills/cli-jev/cli-usage/`); npm `jevctl` 0.2.3 is vendored research material only — their exit-2 meanings collide and are never conflated here.

## 1. Executive Summary

No rank moves off BASE §11: R1 stays build-now, R19's census stays build-now with its arm later, R20's lexical lint and R2's zero-call slice stay next, R21 stays conditional, the arms and the shadow mode stay later. What this lineage adds is executability: every survivor now has named files, functions, LOC budgets, test cases, printed failure lines and kill predicates — plus the corrections that make each slice honest.

The corrections that matter:

- **R1:** the keep rule's decided universe is *movable* rows only, with `gold_demoted` reported apart; 002's plan omits `-s -` (the call would send no state); exact sign-test min-wins table computed (n<5 impossible; 7/8; 10/13; 17/24); a hung `jev` spawn has no printed line — add a per-call timeout + `unmeasured_timeout`.
- **R19:** Q25 answered at record level — across 47 real compact boundaries, **no post-boundary hook attachment exists and no `PreCompact` hookEvent is ever recorded**; the brief must be reconstructed by replaying `buildMergedCompactResult` over the same `tailFile(path,50)` raw lines the hook reads. The placeholder-state estimate is a verbatim port of the vendored `estimateTokens`/`fitState`, never `preTokens` vs 25,000.
- **R2:** the driver needs **zero new exports** (`__test.writeGoalAtomic` + `__test.maybeVerifyGoal` over a mkdtemp state dir); the clamp defect is confirmed end-to-end in both runtimes (evidence >1,200 chars can never reach `met`); 003's docs omit BASE's tail-window arm, the native pre-label join, the `verifier_shadow=` field and the redaction unit cases; recorded verifier use is **zero** (5/5 goal records `not_evaluated`) — the Jev arm and shadow mode are presently unbuildable under every sibling's kill rule.
- **R20:** `check-goal.cjs` is safely requireable but exports the wrong layer — the lint copies ~60 LOC of parser internals and imports three `goal-slice.cjs` helpers; `walkGoalFiles` lets `review/lineages/**/scratch/` fixtures into the corpus; the skip-line family has a real naming split (`skipped:` vs `refused:`) to unify.

## 2. Scope, Method and Inputs

Five angles per `context/research-angles.md`: swe-01 R1-as-code, swe-02 R19-census-as-code, swe-03 R2-slice-as-code, swe-04 R20-lint-as-code + cross-arm skip lines, swe-05 build-order-in-code. Every iteration opened real source (plugins, goal-core, vendored compaction, corpora counts, transcript record shapes, goal-state dir) and wrote only under this lineage. No `jev` of either package was spawned, no `.env` opened, no repository module executed, no transcript *content* copied — field names, counts and record types only. Waves honored: W1 read no siblings; W2 read deepseek-05, grok-05, mimo-02; W3 read all own plus newest siblings.

## 3. RQ1/RQ4 — R1 as code (`score-jev-tiebreak.mjs`)

~330 LOC total, splittable into a ~180 LOC census commit and a ~350 LOC arm commit with separate kills. Function decomposition: `loadCorpus` (asserts 195/70/24 rows), `classifyRows` (movable vs `gold_demoted` — alias membership must use `mergedSkillForAlias`/`skillMatchesAlias`, importable at `capture-scorer-eval-baseline.mjs:49,70-76`), `reprintBaseline` (deterministic env `:35-46`, must print `53/70` or `baseline mismatch: comparison void`), `gate` (ordered `command -v` → `--version` literal → `auth status`, printing 002's three-line vocabulary), `askJev` (`-s -` stdin, per-call timeout — see gaps), `signTest` (binomial tail over movable rows), `stability` (`1−stddev/mean ≥0.95`, `benchmark-stability.cjs:102-108`), `calls.jsonl` writer.

Confirmed from code: the eval script `score-outcome-rerank.mjs` executes on import (:159) and exports nothing — its metric functions must be copied, not imported. Undefined cases now defined: reciprocal-rank ties, all-`none` rows, comparator-empty rows, gold outside cluster (each gets an explicit row class). 002's docs diverge from BASE in 15 enumerated places (rejected keep rule, 0.95 coefficient as rank criterion, tau veto, no comparators/R21/underpowered handling). Inferred: whether any movable rows exist — the census answers it.

## 4. RQ2 — R19 census as code (`score-compaction-recall.mjs`)

~730 LOC under `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/`. Parser: closed `KNOWN_TYPES` whitelist (record `type` level; attachment *subtypes* tolerated with a `new_attachment_type` counter — see cross-lineage note), stop-with-named-error on malformed JSONL, unknown type, missing `uuid`/`timestamp`/`message`, or `compactMetadata` on a non-`compact_boundary` subtype. Estimator: verbatim port of `estimateTokens` (`state.ts:22-41`, documented +2–18% upper bound) and `fitState` staging (`:198-307`, reports `stage` or `fitError`), records→`Message` map pairing `tool_use`/`tool_result` by `tool_use_id`; `estRequests` via `batchCalls` budget (`compact.ts:76-102`). Must-survive rules: `identifiersUsedAfterBoundary`, `writtenFiles` (Write/Edit `file_path` — 315+888 real calls), `boundSpecFolder` (uses the `specs/[\w-]+` topics regex :133, **not** `detectSpecFolder` :182 whose `\.opencode/specs/` pattern is dead on this surface), `lastUserInstruction` (partially unverifiable from fields — prints `uncheckable`), `preservedSegmentSanity`. Spot-check rows print `rule / item-name / survived` only — no transcript text.

### Cross-lineage reconciliation — Q25

deepseek-02's census of a different transcript found the injected brief recorded as an `attachment`/`hook_success` record with `hookName=SessionStart:compact` at +13 after boundaries; swe-02's 47-boundary census across two files found zero post-boundary hook attachments of any type and no `hook_success` subtype at all. Both are true observations over different files/host configurations; the merged design is read-the-recorded-brief-first (`hook_success`/`SessionStart:compact` attachment when present), replay `buildMergedCompactResult` as fallback — with `replay_version=<sha256[:12] of built compact-merger.js>` printed per row because a rebuilt merger silently changes the reconstructed brief (failure mode no existing line reports).

## 5. RQ3 — R2 zero-call slice as code

`score-verifier-labeled-set.cjs` (~280 LOC) + `build-verifier-fixture.cjs` (~140) + tests under `.skilled/hooks/goal/lib/`. Driver: `__test.writeGoalAtomic({status:'active', objective, lastEvidence:raw, …}, {stateDir:mkdtemp})` → `__test.maybeVerifyGoal(sessionID, {stateDir})` — the real heuristic end-to-end through `normalizeOptions` (:254-256), `runSupervisorVerifier` (:2354) and the CAS apply (:2412-2417); no new exports, no frozen-contract touch (the `__test` object is pinned by `opencode-goal-export-contract.test.cjs`). Arms: heuristic (attribution via the five reason strings :2202-2220), **tail-window** (`rawEvidence.slice(-1200)`, same five checks, no clamp marker — missing from 003's docs, must be added), goal-core parity (`require('goal-core.cjs').verifyGoalHeuristic`, export :1611). Vocabulary: `not-met`→`not_met`; `unclear` collapses to `not_met` in confusion math but stays its own row — it is the verdict Pi nudges on (`goal-context.ts:233-238`).

Clamp defect, confirmed end-to-end: `clampText` appends `...` (:387-388; port `goal-core.cjs:295-296`) → the truncation check `/\.\.\.$/` reads it (:2209-2211; :606-607) → forced `not_met`/`unclear`. Self-inflicted, both runtimes. Redaction unit cases with asymmetric minimal fixes: plugin :474 needs only `\b`→`(?<![A-Za-z0-9])`; scrubber :128 needs that plus `service` in the prefix alternation — reported to owners, not made. Fixture schema carries `rawEvidence` AND `asIngestedEvidence` plus `nativeLabel` from `goal_status` attachments (`met`,`reason` fields; 757 per mimo-02, 755 per BASE — a 2-record drift) joined to preceding assistant text; OpenCode state records currently contribute zero rows (all `not_evaluated`, `lastEvidence` empty).

## 6. RQ3 — R20 lint as code

`lint-goal-criteria.cjs` (~200 LOC, advisory exit-0-always) + `score-goal-lint.cjs` (~80) + `goal-criteria-labels.jsonl` (`{id=path:line, text_sha12, rubric, rule4_ok, rule5_ok, note, labeler}` — stale labels counted). Parser: import `extractDurableSlice`/`splitFrontmatter`/`LOG_ANCHOR` (`check-goal.cjs:13-18`), copy `getAnchorBody`+`getGoalSections`+`getCriterionItems` (~60 LOC); never wired into `CHECKS` (:44-49) so `RESULT: PASSED` and exit codes 0/1/2 (:659-675) are untouched. Rules as functions: `rule4DanglingRefs` (referring-expression extraction + locality stoplist) and `rule5ExternalFile` (`as-described-in`/`every-kept-file`/`where-they` patterns), each with 3+3 real `path:line` examples in iteration-004. The lint is precision-first and prints its own precision/recall against the labels — mimo-02's method-gap finding means the lint's hit rate is an instrument reading, never "the" base rate. Placement: standalone CLI mirroring `check-goal.cjs <packet>`, plus one owner-approved line in `create-goal-auto.yaml` before `step_check` (:220-221).

## 7. RQ7 — Build order in code

Phase 0 (owner report): the two redaction diffs + unit cases. Phase 1: 002 census (~180 LOC). Phase 2: 005 census (~730). Phase 3: 002 arm (+~350, `--jev`) — the first latency record everyone waits on (BASE :1259). Phase 4a: 006 lint (~370). Phase 4b: 003 slice (~420+tests). Phase 5: conditional arms — R21 only on `underpowered`; R19 arm past census clearance+Phase 0+payload acceptance+Q18; R20 arm past ≥5% labeled rate; R2 arm+shadow blocked today by zero recorded verifier use. Shared code at the third caller: the Jev client wrapper (~60–80 LOC), extracted only when the third arm is built; the skip-line vocabulary stays shared-by-text forever. First PR: 002's census — observable check is `holdout top-1: 53/70` + one stop line + empty stub-`jev` log + clean `git status`.

## 8. Failure modes with no printed line (new this round)

1. `jev` spawn that never exits — 002 REQ-009/010 record wall time and map exit codes but name no per-call cap; add spawn `timeout` + `unmeasured_timeout` (003's `:49` 30 s is the existing pattern).
2. Replay version skew — `replay_version=` per row or `replay_unavailable` when dist is missing.
3. Scratch-fixture goals entering the real corpus — `walkGoalFiles` skips only `z_archive` (:433); lint must skip `**/lineages/**/scratch/**`.
4. `unclear` silently collapsed — kept as its own report row (Pi nudge visibility).
5. Silent `heuristic` fallback for `OPENCODE_GOAL_VERIFIER=jev` today (:226-229) — the mode's one enablement line is what makes no-key behavior honest.

## 9. Verdicts (unchanged ranks, sharpened clauses)

| Rec | Verdict | Code-level clause added |
|---|---|---|
| R1 (002) | **build-now** | decided=movable rows; `-s -`; sign-test table; `unmeasured_timeout`; missing-answer voids report |
| R19 census (005) | **build-now** | closed-whitelist parser; vendored estimator port; read-then-replay brief column; `replay_version` |
| R20 lint (006) | **next** | parser-copy design; scratch-skip; label schema; skip-line table; <5% kill |
| R2 slice (003) | **next** | export-free driver; tail-window arm required; two-form fixture; native pre-label join; 6 doc divergences to fix |
| R21 | **next, conditional** | only on `underpowered`; missing answers excluded |
| R19/R20/R2 arms, shadow mode | **later** | R2's gate currently *firing*: zero recorded verifier use |

## 10. Key gate, switches, no-key behavior (one contract, five switches)

Every Jev-bearing slice shares one three-step gate — `command -v jev` → `jev --version` prints literally `jev 0.6.2` → `jev auth status` exits 0 — and each carries its own switch: R1 `--jev` flag on `score-jev-tiebreak.mjs`; R19 `--jev` on `score-compaction-recall.mjs`; R20 `--jev` on `lint-goal-criteria.cjs`; R21 `OPENCODE_GOAL_VERIFIER=jev`; R2 shadow `verifier_mode=verifier_shadow` on the goal plugin. No-key behavior is uniform: the zero-call slice runs identically, the Jev portion prints the `skipped:`/`refused:` vocabulary from 002's three-line family (R1/R19/R20) or falls back silently to `heuristic` today (R21/R2 — the enablement line at `opencode-goal.js:226-229`), and the repo behaves exactly as now. No slice reaches for a key, `.env`, or network without the flag.

## 11. RQ5 and RQ6 — what this lineage adopted and what round 1 missed

RQ5 (from this lens): adopted — the vendored `estimateTokens`/`fitState`/`batchCalls` trio as the census's estimator (port, not dependency), and `__test`-export driving as the zero-cost integration pattern. Rejected — the vendored `preTokens`-vs-25,000 feasibility proxy, `detectSpecFolder`'s dead `.opencode/specs/` regex, and jevctl's exit-2 semantics anywhere near the Python contract. RQ6: the seams round 1 and the council both missed are the `walkGoalFiles` scratch-fixture leak (:433), the missing `-s -` stdin flag in 002's plan (:71), the clamp-then-truncate self-infliction in both runtimes, and two failure modes with no printed line (hung spawn, replay version skew) — §8.

## 12. Eliminated Alternatives

Importing `score-outcome-rerank.mjs` (runs on import, no exports) · metadata-only census · real tokenizer · `thinking`-as-text · skip-with-warning parser · `supervisorVerifier` injection (can't wrap an unexported function) · OpenCode-state as evidence source (empty) · extending `check-goal` exports · wiring the lint into `CHECKS` · merged census script · early wrapper extraction · regex fixes made in-place (owner-reported instead).

## 13. Open Questions carried

Q18 (production compaction budget — deepseek: UNKNOWN), movable-row count (census answers), whether Pi awaits `turn_end` (deepseek-03's question), the operator's rubric choice for R20 labels (mimo-02's protocol), 755-vs-757 `goal_status` census drift.

## 14. Evidence Quality

Confirmed from code/census this round: all parser contracts, both regex gaps (by trace), the clamp chain, the 5-record state census, record-type inventories (two files, 47 boundaries), corpus counts, sign-test table. Inferred: movable-row existence, replay fidelity vs hook-time brief (version-pinned now), transfer of the 55% >1200-char proxy to OpenCode sessions. Single-lens caveat: this lineage is one model family; where a sibling contested (Q25's recorded brief), the disagreement is reconciled by a both-paths design rather than a vote.

## 15. Convergence Report

newInfoRatios: 0.85, 0.92, 0.85, 0.85, 0.75 (rolling 0.84). Convergence telemetry only; `convergenceMode: off`; ran to `maxIterationsReached` at 5. All five angles answered; each iteration's file, delta and state record exist under this lineage.

## 16. Handoff

To the packet-level synthesis leaf (REQ-003): the amendments owed to the phase docs are 002's `-s -` + movable-row universe + `unmeasured_timeout` + 15 divergences; 005's read-then-replay brief column + `replay_version` + `uncheckable` rule; 003's tail-window arm + two-form fixture + native pre-label join + `verifier_shadow=` field + redaction unit cases; 006's scratch-skip + `skipped:`/`refused:` split + label schema. Owner reports (not code changes): the two redaction regexes (`opencode-goal.js:474`, `secret-scrubber.ts:128`) and the `walkGoalFiles` scratch leak. Rollback is per-phase and uniform — each slice is a new script plus its tests under one directory, so revert = delete the directory and, where a flag exists, leave it; no slice mutates an existing contract. This lineage writes no code; nothing here is merged, open, or pending beyond these artifacts.
