# Iteration 9 — D4 Validator Cross-Field-Gap Check + Null-completion_pct Sizing + Consolidation Pass

- **Dimension:** D1/D4 (schema: correctness + security) — validation-layer detection gap, sibling to D1-P2-001 and D4-P0-001
- **Mode:** review (iteration 9 of 10; stop_policy=max-iterations — ONE more iteration then synthesis; broaden, do not converge)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified outside `review/`)

## Objective

Three closing-out tasks: (1) confirm whether ANY validator in the `validate.sh --strict` chain cross-checks `derived.status` against canonical completion signals; if not, surface the detection gap as a new finding; (2) size the null-`completion_pct` edge case for the iter-6 patch-shape's true-positive rate; (3) consolidation pass — flag near-duplicates across the 8 prior iterations before synthesis. No fix implemented (design/sizing only).

## Validator Cross-Field-Gap Check

### Validators in the `validate.sh --strict` chain (enumerated at validate.sh:18-30)

`spec-doc-structure`, `continuity-freshness`, `evidence-marker-lint`, `generated-metadata-integrity`, `generated-metadata-drift`. All five read.

### Per-validator verdict on `derived.status` ↔ canonical-completion consistency

| Validator | Reads `derived.status`? | Cross-checks vs completion_pct? | vs open-tasks? | vs checklist content (beyond existence)? |
|---|---|---|---|---|
| `generated-metadata-integrity.ts` | YES — enum-membership only (`:99` `STATUS_NOT_IN_ENUM`) | **NO** | **NO** | **NO** (existence gate is in the *producer* deriveStatus, not here) |
| `generated-metadata-drift.ts` | **NO** — `driftedFields` only ever holds `description` + `causal_summary` (`:224-242`); never re-derives/compares `status` | **NO** | **NO** | **NO** |
| `continuity-freshness.ts` | **NO** — reads canonical-doc `_memory.continuity.completion_pct` (`:113`) + frontmatter `status:` (`:114`) + metadata-table Status row (`:143-145`); all *within*-canonical-doc, never joined to graph-metadata's `derived.status` | within-doc only | n/a | n/a |
| `spec-doc-structure.ts` | NO | NO — `completion_pct` appears only as an `inferCategory` routing *token* (`:1030`), not a check | NO | NO |
| `evidence-marker-lint.ts` | NO (grep over `scripts/validation/` for `completion_pct\|derived\.status\|deriveStatus\|openTasks` = 0 hits in this file) | NO | NO | NO |

**Confirmed: NO cross-field consistency check between `derived.status` and (a) `completion_pct`, (b) open `[ ]` tasks, or (c) checklist content exists ANYWHERE in the validation layer.** A stored `derived.status:"complete"` passes `--strict` as long as it is enum-valid (`graphMetadataSchema` closed enum) and the file parses — regardless of whether the folder's own canonical docs say 0% / 20 open tasks / no checklist authored. This is the structural reason `validate.sh --strict` never flagged the 213 (iter-5) / ~261 (this iteration, broader slice — see below) false-complete files.

### Drift-validator secondary blindness (NEW beyond iter-6's integrity-validator note)

iter-6's blast-radius assessment recorded `validatorBlind` against `generated-metadata-integrity.ts:99` only. This iteration adds: **the drift gate is blind for a *different* reason** — `checkGeneratedMetadataDrift` (`generated-metadata-drift.ts:155-252`) re-derives ONLY `description` and `causal_summary` (via `derivePacketSynopsis`); it never reads, re-derives, or compares `derived.status`. And even if it did, stored-vs-fresh would be *tautological*: both sides route through the same buggy `deriveStatus:1167-1224`, so a false-complete matches itself. So drift is a second structurally-blind validator, by construction.

### Producer confirmation (re-read this iteration)

`deriveStatus` (`graph-metadata-parser.ts:1167-1224`) consults, in order: (1) override, (2) frontmatter `status` via `selectFirstValue(ranked)` over impl-summary/checklist/tasks/plan/spec `.status`, (3) availability `'unknown'`, (4) implementation-summary presence, (5) checklist presence + `evaluateChecklistCompletion`. It **never** reads `completion_pct` and **never** counts open `[ ]` tasks. Confirmed at source — this is precisely D4-P0-001's mechanism; the detection layer mirrors the producer's blindness.

## Null-completion_pct Sizing

### Methodological note (self-correction recorded)

First probe read top-level frontmatter `^completion_pct:` — returned 1510/1510 null. **Wrong level**: the field is nested under `_memory.continuity.completion_pct` (confirmed in phase-009 scaffold spec.md frontmatter and authored sample `ai-systems/006-blog-posts-generalization` which carries `_memory.continuity.completion_pct: 10`). Re-ran with indentation-aware nested extraction. `rg '^completion_pct:' --glob spec.md` over `.opencode/specs` = **0** matches (no folder has a top-level field), confirming the nested location is universal.

### Corrected sizing (2433 graph-metadata.json files; +8 vs iter-5's 2425 — immaterial)

| Slice (of `derived.status:"complete"` = **1510**) | Count | % of complete | Interpretation |
|---|---|---|---|
| `completion_pct: 100` | **953** | 63.1% | CORRECT (status matches) |
| `completion_pct: 0` | **116** | 7.7% | FALSE-complete (scaffold untouched; explicit 0) |
| `completion_pct` in (0,100) | **145** | 9.6% | FALSE-complete (authored-but-incomplete: 90/85/95/80/5/60…) |
| **NO `completion_pct` field at all** | **296** | 19.6% | NULL edge case (brief's target) |
| └ of null: no `_memory` block | 73 | — | likely lean phase-parents / legacy |
| └ of null: `_memory.continuity` present, field absent | 223 | — | authored without the continuity field |

**Null edge case = 296 folders** (the brief's ask). This is **2.55× the explicit-`completion_pct:0` case** (296 vs 116).

### Bearing on iter-6 patch shape

iter-6's minimal gate `completion_pct>=100 AND openTasks===0` (before deriveStatus:1216) has a **null-handling dependency** this sizing exposes: a value absent from `_memory.continuity` cannot satisfy `>=100`, so it must be resolved explicitly (treat null → not-complete, or fall back to open-tasks) — otherwise the 296-null set is silently miscategorized. The 953 correct-complete (pct:100) all survive the gate; the 261 explicit-false-completes (116+145) are corrected; the 296-null is the residual design decision. A naive `pct < 100 → not-complete` rule would *miss* all 296 nulls.

### Reconciliation with iter-5/6 numbers

iter-5's **213** = on-disk-complete subset reaching the buggy deriveStatus branch (no valid frontmatter status). This iteration's **261** explicit-pct<100 = ALL `status:complete` folders with a non-null `completion_pct` below 100 (broader denominator — does not isolate the buggy-branch subset). Consistent, not contradictory; both confirm hundreds of false-completes. (296-null not comparable to either; it has no pct to evaluate.)

## Findings Consolidation Pass

### Current registry (read this iteration)

11 open findings: `D1-P2-001/002/003`, `D2-P2-001/002/003/004`, `D3-P2-001/002`, `D4-P0-001`, `D4-P2-001`. `findingsBySeverity`: P0:1, P1:0, P2:11.

### Near-duplicate triage

| Pair | Verdict | Reasoning |
|---|---|---|
| **D1-P2-001** (loader/validator *format-tolerance* split) vs **new cross-field-gap finding** | **DISTINCT** | Different axis: D1-P2-001 = raw `JSON.parse` vs legacy-text tolerance (parseability/format). New = enum-valid `complete` passes with no semantic consistency check (semantic/consistency). Different code locations, different defect classes, different fixes. The brief's "sibling" framing holds (both are validation-layer gaps) but they are not the same finding restated. |
| **D4-P0-001** (deriveStatus *producer* bug) vs **new finding** | **ADJACENT but DISTINCT — do NOT merge** | D4-P0-001 = the bug that *creates* false-complete; fix lives in `deriveStatus:1216`. New = the validator's *absence* of a check that would *detect* it; fix = a new cross-field rule (different code location). HOWEVER: iter-6 already recorded the integrity-validator blindness *informally* inside `D4-P0-001.blastRadiusAssessment.consumerMap.validatorBlind`. **Synthesis hygiene recommendation: do not carry `validatorBlind` as both an embedded D4-P0-001 sub-bullet AND a standalone D1-P1-001 evidence row — fold the sub-bullet into the new finding's evidenceRefs and let D4-P0-001 reference it by id.** This prevents the same observation appearing twice in the report. The findings themselves remain distinct (producer vs detector). |
| All other pairs | no overlap | D2 family (ownership), D3 family (plan/scope), D1-P2-002/003 (early-return guard, seeded arithmetic), D4-P2-001 (synopsis/tier regression) — each unique axis. |

**No true duplicates to merge.** One embedded-observation relationship to de-duplicate at *synthesis* (D4-P0-001.validatorBlind ↔ new finding), not at registry level.

## Findings by Severity

### P0 (Critical): none new. (D4-P0-001 not re-probed; unchanged.)

### P1 (Major): 1 NEW.

---

#### D1-P1-001 (NEW) — Validation layer has NO cross-field consistency check between `derived.status` and canonical completion signals; `--strict` is structurally blind to false-complete (the detection-side gap that let D4-P0-001's 213+ false-completes pass undetected)

- **claim:** Every validator in the `validate.sh --strict` chain treats `derived.status` as an isolated enum field (integrity) or ignores it entirely (drift, continuity-freshness, spec-doc-structure, evidence-marker-lint). None cross-checks a stored `complete` against (a) `_memory.continuity.completion_pct`, (b) open `[ ]` task count in tasks.md, or (c) checklist.md content beyond bare existence. A false `complete` therefore passes `--strict` whenever it is enum-valid and parseable — which is exactly the condition all 213 (iter-5) / 261+ (iter-9 broader slice) corrupted files satisfy. This is the structural detection gap, distinct from the producer bug (D4-P0-001) and the format-tolerance gap (D1-P2-001).
- **evidenceRefs:**
  - `generated-metadata-integrity.ts:95-102` — `graphMetadataSchema.safeParse` only; `:99` maps `derived.status` issues to `STATUS_NOT_IN_ENUM` (membership), nothing compares to completion signals;
  - `generated-metadata-integrity.ts:83-114` (`validateGraphMetadataFile` full) — no canonical-doc read at all; validator operates on graph-metadata.json in isolation;
  - `generated-metadata-drift.ts:224-242` — `driftedFields` push sites are `description` (`:230-233`) and `causal_summary` (`:238-241`) only; `derived.status` never re-derived/compared;
  - `generated-metadata-drift.ts:112-119` (`readStoredCausalSummary`) + `:236-241` — confirms only causal_summary is the graph-side drift subject;
  - `continuity-freshness.ts:96-141` (`readContinuityFields`) — reads `_memory.continuity.completion_pct:113` + frontmatter `status:114` + metadata-table Status row, all *within* canonical docs; no join to graph-metadata `derived.status`;
  - `spec-doc-structure.ts:1030` — `completion_pct` is an `inferCategory` routing token, not a validation;
  - `validate.sh:18-30` — the 5-validator chain enumeration (spec-doc-structure, continuity-freshness, evidence-marker-lint, generated-metadata-integrity, generated-metadata-drift); grep of `scripts/validation/` + `mcp_server/lib/validation/` for `completion_pct|openTasks|open.?tasks|derived\.status|deriveStatus` = the 2 self-referential hits only (integrity:99, continuity-freshness:113), neither a cross-check;
  - `deriveStatus` re-read `graph-metadata-parser.ts:1167-1224` — producer never reads completion_pct/open-tasks; validator mirrors producer's blindness.
- **counterevidenceSought (and result):** (1) Does the drift gate re-derive status? NO — only description + causal_summary (`:224-242`); even if it did, stored-vs-fresh is tautological (same buggy deriveStatus both sides). (2) Does continuity-freshness join canonical-pct to graph-status? NO — within-canonical-doc only. (3) Did my grep miss a validator outside `validation/`? The validate.sh chain is the closed set (5 files, enumerated `:18-30`); all 5 read or grep-confirmed; `evidence-marker-lint.ts` (the one not line-read) returned 0 grep hits for every relevant field name across `scripts/validation/`. (4) Is the check maybe in the orchestrator (`spec-doc-structure.ts` top-level orchestration)? grep-confirmed no `derived.status`/`completion_pct` cross-reference.
- **alternativeExplanation:** The blindness is *by design* — the validator deliberately trusts the producer's derivation and only enforces the generated contract (schema + enum + fingerprint + path-prefix), deferring semantic "is this folder really done" to the canonical-doc checks (continuity-freshness) which read the *source of truth* (frontmatter) rather than the *derived* field. Plausible intent — but it means a producer bug is undetectable at the only gate that runs on every commit, so the defense-in-depth gap is real even if the single-layer design is defensible.
- **finalSeverity:** **P1** — it is not itself a correctness bug (produces no wrong data; that is D4-P0-001), but it is the structural reason a repo-wide P0 went undetected through presumably-many `--strict` runs, and its fix lives at a *different code location* (new cross-field rule) from the producer fix. A producer-only fix leaves detection blind to future regressions (hand-edits, a new deriveStatus bug, stale-pct folders). P1, not P0, because no wrong data is *produced* here and iter-6 established no consumer branches on the field today (currently-inert); P1, not P2, because it is the enabler of a repo-wide P0 staying latent.
- **confidence:** **0.93** — every validator in the closed 5-file chain read or grep-confirmed; the field-name grep over both validation dirs returned only self-referential hits. Residual: `evidence-marker-lint.ts` was grep-confirmed (not line-read) for the relevant fields; its name/role (evidence-citation markers) makes a status cross-check implausible, and the grep would have surfaced the field names if present.
- **downgradeTrigger:** a cross-field status-vs-completion_pct-vs-open-tasks validator is added to the `--strict` chain (the fix); OR a design doc explicitly establishes the canonical-doc-only trust boundary as contractual and accepts producer-bug-latency as the tradeoff.
- **upgradeTrigger:** none realistic (already the detection-side ceiling; cannot exceed "no check exists").
- **relationship:** distinct from D1-P2-001 (format axis) and D4-P0-001 (producer axis); FORMALIZES/PROMOTES the `validatorBlind` note iter-6 embedded inside `D4-P0-001.blastRadiusAssessment.consumerMap` into a standalone actionable finding (synthesis should fold the embedded note into this finding's evidence, not carry both).

---

### P2 (Minor): none new. (11 prior P2s unchanged this iteration.)

## Verdict

**D1/D4 covered for iteration 9** (genuine new content — the cross-field-gap confirmation across all 5 validators + drift-secondary-blindness + null-pct sizing — not a re-walk).

1. **Cross-field gap: CONFIRMED absent.** No validator joins `derived.status` to any canonical completion signal. Surfaced as **D1-P1-001** (detection-side sibling to D4-P0-001 producer, distinct from D1-P2-001 format-gap).
2. **Drift gate secondarily blind** (never re-derives status; would be tautological if it did) — folded into D1-P1-001 evidence, new beyond iter-6's integrity-only note.
3. **Null-completion_pct = 296 folders** (2.55× the explicit-0 case); the iter-6 patch shape has a real null-handling dependency.
4. **No true duplicates.** One embedded-observation (D4-P0-001.validatorBlind ↔ D1-P1-001) flagged for synthesis-time de-dup.

## SCOPE VIOLATIONS

None. All writes confined to the four allowed paths under `review/` (`iterations/iteration-9.md`, `deep-review-state.jsonl` append, `deltas/iter-009.jsonl`, in-place `deep-review-strategy.md` + `deep-review-findings-registry.json`). No file under `009-.../` outside `review/` created/modified/deleted/renamed. No validator/source edit. Reading unrestricted and exercised repo-wide (`find`, `rg`, node sizing probes, validator source reads). No `scope_violation` to record. Two `/tmp` probe scripts written outside the workspace (transient, not under the 009 phase folder) — read-only against the repo.

## Next Focus for iteration 10 — final iteration (synthesis)

1. **SYNTHESIS iteration** — produce `review/review-report.md` from the registry (12 findings: P0×1, P1×1, P2×11). Stop collecting; converge to the report.
2. **Synthesis-hygiene action:** fold `D4-P0-001.blastRadiusAssessment.consumerMap.validatorBlind` into `D1-P1-001` evidenceRefs (do not carry the same observation twice); cross-link the three validation-layer findings (D1-P2-001 format-gap, D1-P1-001 detection-gap, D4-P0-001 producer-bug) as a single "metadata-status integrity chain" narrative with distinct fix locations each.
3. **Patch-shape carry-forward:** the D4-P0-001 + D1-P1-001 fix narrative now has two coordinated recommendations — (a) producer: gate deriveStatus on `completion_pct>=100 AND openTasks===0` with explicit null-handling for the 296 absent-pct case; (b) detector: add a cross-field `--strict` rule so future regressions are caught. Report both.
4. **Do NOT** re-probe D2 (trailer angle exhausted iter-8) or D3 (handover-as-de-facto-spec settled iter-3). The review has run its course on substance; iteration 10 is the write-up.
