# Iteration 001 — A1: extend the live quality machinery to the authored spec-doc + metadata-JSON write surface

Focus: the exact code seams to wire data-quality scoring/refinement into `generate-context.ts` (the metadata-JSON + canonical-doc write surface) and `validate.sh` (the completion gate), reusing the two shipped machineries, with the destructive-auto-fix rail enforced. Reader class: A (adherence) + L (logic), plus R via trigger/description fields. Floor: BYPASS (write-time/metadata) — ships on cost, inherits no prod-mode gate.

## The decisive correction to the dq-deep framing

dq-deep A1 said "extend the live default-ON `quality-loop.ts`". Reading the code, that is the WRONG machine to extend wholesale, because there are **two** quality machineries and they have opposite safety profiles:

1. `quality-loop.ts` (`handlers/quality-loop.ts:582 runQualityLoop`) — a verify-**fix**-verify loop whose `attemptAutoFix` (`:434`) MUTATES content: re-extracts triggers, **trims to budget by `substring` (`:463-468`)**, normalizes anchors. Its budget trim is the net-negative hazard the parent flagged: `DEFAULT_CHAR_BUDGET = 2000 tokens × 4 = 8000 chars` (`:82-85`), so any authored spec.md over ~8KB (the 005 spec.md is 10.6KB) would be silently amputated.
2. `post-save-review.ts` (`core/post-save-review.ts:573 reviewPostSaveQuality`) — a **non-mutating** severity-tagged reviewer (PSR-1..6, D1..8, DUP1..7). It emits `{severity, field, message, fix}` issues, computes a composite blocker (`:1041 blocking = high>=2 || (high>=1 && medium>=2)`), and a bounded score penalty (`:1077 computeReviewScorePenalty`, floor −0.30). It NEVER writes content.

**The build-ready A1 design: reuse the pure SCORER from machine 1 and the non-mutating REVIEW/SEVERITY shape from machine 2; never run machine 1's `attemptAutoFix` on an authored doc.** This is the single most important seam decision and it dissolves the destructive-auto-fix caution by construction rather than by a runtime rail.

## A1 seam map (file:line, exact)

### Seam 1 — `generate-context.ts` (on-write, the metadata-JSON path)

`generate-context.ts:398 atomicWriteJson()` is the single choke point that writes `description.json` and `graph-metadata.json` (`:55 GRAPH_METADATA_FILE`, `:385 readGraphMetadata`, `:935 main`). The post-save reviewer (`reviewPostSaveQuality`) already runs after canonical-doc saves (the "POST-SAVE QUALITY REVIEW" block CLAUDE.md describes after `generate-context.js`). Two concrete hooks:

- **H1 (metadata-JSON scorer).** Add `scoreMetadataJson(descriptionObj, graphObj): ReviewIssue[]` next to `reviewPostSaveQuality`, returning the same `ReviewIssue[]` shape. Checks (all non-mutating, all floor-bypassing): (a) `description` is not a copy of `title` and not in `GENERIC_TITLES` (`post-save-review.ts:128`); (b) `trigger_phrases.length >= 4` reusing `scoreTriggerPhrases` logic (`quality-loop.ts:103`) but as a WARN not a 0.5 score; (c) `importance_tier`/`status`/`content_type` ∈ enum (the enum, not the field, is the new artifact — see dq-deep A3); (d) curated frontmatter `trigger_phrases` from the spec.md propagate into `description.json` (subset assertion, NOT equality — the derived set is capped at 12 per `graph-metadata-schema.ts:41`). Call it from `main()` right before `atomicWriteJson`, attach issues to the existing post-save-review JSON output. Severity: WARN-only in v1.
- **H2 (canonical-doc body scorer).** Extend `reviewPostSaveQuality`'s input to optionally accept the spec.md / plan.md / decision-record.md BODY (today it reviews the rendered memory file). Add a pure call to `computeMemoryQualityScore(body, {triggerPhrases})` (`quality-loop.ts:392`, exported `:747`) to get the `{triggers, anchors, budget, coherence}` breakdown as ADVISORY telemetry — score only, no fix. The `budget` sub-score will be low for large specs; that is correct as a *signal*, and crucially it drives no mutation.

### Seam 2 — `validate.sh` (retroactive + completion-gate)

`validate.sh` runs rules from `scripts/rules/` via `should_run_rule` (`:420`) and invokes TS/JS validators through node (the pattern at `:832 run_continuity_freshness_check`, `:834 run_evidence_marker_lint_check`). The build-ready hook:

- **H3 (new rule `CONTENT_QUALITY`).** Add `scripts/validation/content-quality.ts` (+ compiled `dist/validation/content-quality.js`) that imports `computeMemoryQualityScore` + the new `scoreMetadataJson`, scores every authored doc + the two JSONs in the folder, and prints `{file, score, issues}` JSON. Register it in `validator-registry.json` (alongside the existing `DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE` warn rules at `:192-206`) and add a `run_content_quality_check` shell wrapper mirroring `:832`. Gate it with `should_run_rule "CONTENT_QUALITY"`.
- **Promotion ladder** (matches the parent Stage 2→3 pattern): v1 WARN-only (exit code unaffected); v2 (after a corpus sweep reads clean) flip to `--strict` error. This is the SAME warn→error discipline the parent used for the JSON-schema gate, applied to content quality.

## Scorer reuse map (what transfers, what must change)

| Scorer (`quality-loop.ts`) | Transfers to authored docs? | Adaptation |
|---|---|---|
| `scoreTriggerPhrases` (:103) | YES (R/A) | Read frontmatter `trigger_phrases`, not memory metadata key |
| `scoreAnchorFormat` (:137) | PARTIAL | Spec docs use `<!-- ANCHOR:x -->` (same grammar) — works as-is for spec.md; meaningless for JSONs (skip) |
| `scoreTokenBudget` (:235) | AS A SIGNAL ONLY | An 8KB budget is wrong for a 10KB spec; report as advisory, never gate, never trim |
| `scoreCoherence` (:274) | YES (L) | Heading/length/temporal checks all valid for authored prose |
| `attemptAutoFix` (:434) | **NO — HARD EXCLUDE** | Destructive `substring` trim; authored docs use suggest-only |

## Auto-fix safety: the one safe deterministic fix

The ONLY content-mutating fix that is safe on an authored doc is the **HVR/style linter** (dq-deep A6): em-dash → space-hyphen-space, prose-semicolon split, Oxford-comma removal — all length-neutral, fence-aware, reversible token swaps. This is NOT in `quality-loop.ts` (its fixes are trigger/budget/anchor). Build it as a separate `scripts/validation/hvr-autofix.ts` that operates ONLY on text outside ```code fences``` and frontmatter, and have it auto-apply only under an explicit `--fix` flag (default report-only). Everything else on the authored surface is score+suggest.

## On-write vs retroactive timing

- **On-write (H1, H2):** fires inside `generate-context.ts main()` on every `/memory:save` and packet metadata refresh. Latency-bounded (pure scoring, no LLM). OPEN: timing on a large spec (inherited from dq-deep open Q) — mitigate by scoring the BODY async/advisory, gating only the cheap JSON checks synchronously.
- **Retroactive (H3):** fires on `validate.sh --strict` at completion and in the B1 corpus sweep. Same scorer, batch invocation.

## Rollback

- H1/H2: single-commit revert of the `main()` hook; the scorer modules are additive and dormant if unwired.
- H3: remove the registry entry + the `run_content_quality_check` line; `should_run_rule` then never selects it. The TS file can stay (dead) — zero runtime effect.
- HVR-autofix: report-only by default, so the rollback for the mutating path is "don't pass `--fix`".

## Risks

- **RISK-A1a (destructive trim leak):** if a future caller wires `runQualityLoop` (not the pure scorer) onto authored docs, the budget trim returns. MITIGATION: export a `computeAuthoredDocQuality()` wrapper that calls only `computeMemoryQualityScore` and throws if `mode==='full-auto'`; make THAT the only authored-surface entry point.
- **RISK-A1b (budget false-alarm noise):** large specs always trip the budget sub-score, drowning real signal. MITIGATION: exclude `budget` from the authored-doc composite or raise the authored char budget to a doc-appropriate ceiling (env `SPECKIT_AUTHORED_CHAR_BUDGET`).
- **RISK-A1c (enum churn):** enum-constraining `importance_tier`/`status`/`content_type` can fail-loud on legacy values. MITIGATION: warn-only v1 + a corpus census before flip (the parent's Stage 2 discipline).

## Rollout order (A1 internal)

1. Add the pure `computeAuthoredDocQuality` wrapper + `scoreMetadataJson` (additive, no wiring). 
2. Wire H1 (JSON checks, synchronous) + H2 (body score, advisory) into `generate-context.ts main()`, WARN-only.
3. Add H3 rule to `validate.sh`, WARN-only; run corpus-wide as a report (this is the B1 sweep's first payload).
4. After the census reads clean, flip the cheap deterministic JSON/enum checks to `--strict` error; keep body-budget advisory forever.
5. Ship HVR-autofix as opt-in `--fix`.

## Dead ends ruled out this iteration

- Extending `runQualityLoop` directly onto authored docs (dq-deep's literal A1 wording) — its `attemptAutoFix` budget-trim is destructive on 8KB+ docs. Reuse the pure scorer + the non-mutating reviewer instead. [evidence: `quality-loop.ts:463-468`]
- Treating `description.json` generation as needing a NEW reviewer — `reviewPostSaveQuality` already exists with the exact `{severity,field,message,fix}` contract and a composite blocker; extend it, don't fork it. [evidence: `post-save-review.ts:573,1041`]
- Gating on the token-budget sub-score — wrong ceiling for authored docs; advisory only. [evidence: `quality-loop.ts:82-85`]

## Assessment

newInfoRatio: 0.90 — first build-ready iteration; the two-machinery distinction and the "reuse pure scorer, never the destructive loop" seam is net-new design not present in any prior lineage (they said "extend quality-loop.ts"; this says exactly which exported function and why the obvious one is wrong). Status: complete. Sources: `quality-loop.ts:82,103,137,235,274,392,434,463-468,747`; `post-save-review.ts:128,573,1041,1077`; `generate-context.ts:55,385,398,935`; `validate.sh:420,832,834`; `validator-registry.json:192-206`.
