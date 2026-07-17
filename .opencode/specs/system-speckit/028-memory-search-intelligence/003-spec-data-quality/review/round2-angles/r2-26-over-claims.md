# r2-26 Over-claims (adversarial)

**Angle summary:** Where the data-quality program dresses a structural inference as a measured result, frames net-new green-field construction as trivial reuse, or makes a default-safe claim its own phases contradict.

**Scope checked:** `SUMMARY.md`, `spec.md`, `research/research.md`, the keystone build phases `004-schema-warn-to-error`, `026-shared-safe-fix-engine`, `013-retrieval-feedback-edge`, `015-prodmode-recall-gate`, the live `confidence-truncation.ts` / `search-flags.ts` / `hybrid-search.ts`, and the governance lineage `findings-registry.json`. Note: r2-16-research-soundness already flagged the research.md §1 truncation magnitude and citation imprecision at P1. Findings below are scoped to angles r2-16 did not cover so they do not double-count.

---

## FINDING 1 (P1): "11 invalid graph files" is asserted as a census count while the program's own governance lineage calls it uncounted

**Evidence:**
- `research/research.md:108` states "Known starting numbers: 11 invalid graph files on the live root, 0 grandfathered packets" as a settled fact feeding the migration plan.
- `004-schema-warn-to-error/spec.md:140` ("parent census counted 11 invalid graph files") and `:195` ("the 11 census-counted invalid live-root graph files") present 11 as the output of a run census.
- The governance lineage contradicts this. `research/lineages/dq-governance-rollout/findings-registry.json` lists "The per-detector corpus-wide failure counts (the Stage-0 census; every prior lineage's asserted-not-counted band; deferred to a build)" as a DEFERRED item, and its anti-pattern entry says the warn-to-error flip "exists because the corpus band is asserted-not-counted".
- The number 11 appears nowhere in the parent or Stage-0 tree outside phase 004 (grep of `028-memory-search-intelligence/**/*.md` excluding `005/004` returns no `11 invalid` / `counted 11` origin), and the packet holds no census run artifact (no log, no count file).

A read-only validation census against the live zod schema is the deferred Stage-0 work by the program's own admission. Presenting its result as a "known starting number" before that census runs is a structural inference dressed as a measurement. This is the cleanest instance on my slice.

**Class:** SPEC-PREMISE issue.

---

## FINDING 2 (P1): SUMMARY's "only ever shows the top 3 results" is a hard-cap mischaracterization of a feature-flagged gap-cliff floor

**Evidence:**
- `SUMMARY.md:9` tells the non-expert reader "Search only ever shows the top 3 results ... it cuts the answer down to about three results", and `:9` makes this the single rule that "decides whether every idea below is worth doing".
- Live code says otherwise. `confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS = 3` is a FLOOR ("Minimum number of results to always return, regardless of gap", `:28-30`). `:130` returns ALL results when count is at or below minResults. `:166-188` only cuts the tail when a score gap exceeds 2x the median gap (a relevance cliff), so a smoothly scored result set passes through whole. `:117` passes everything through unchanged when the flag is off.
- The mechanism is gap-based and flag-gated, not a fixed K=3 cap. It guarantees at least 3 and frequently returns more.
- The companion "028 already measured a 5.9x eval-versus-prod fidelity gap on this exact corpus" (`research.md:8`) is a cross-packet 028 import (`028/before-vs-after.md:159`, 0.212 vs 0.036 at K8), not reproduced against this tree, yet it is stated as measured on "this exact corpus".

The directional point (prod truncates, eval does not, so retrieval candidates carry a tax) survives, as r2-16 noted. What I add is that the most-read plain-language doc states the strongest absolute form of the error and anchors the whole 28-phase ROI argument on it, and that the supporting magnitude is presented as a same-corpus measurement when it is an imported one.

**Class:** SPEC-PREMISE issue (the live code at `confidence-truncation.ts` is the disproof).

---

## FINDING 3 (P1): "Overwhelmingly wiring existing machinery, not building new things" over-claims reuse and understates a large green-field surface

**Evidence:**
- `SUMMARY.md:11` "Most of the program is wiring up machinery that already exists, not building new things" and `research.md:8` "overwhelmingly wiring that shipped machinery ... not building anything green-field".
- The reuse is genuine for the PURE scorer only (`computeMemoryQualityScore`, `reviewPostSaveQuality`). Everything that hosts it is net-new. `026-shared-safe-fix-engine/spec.md:62` states plainly "There is no `detector-registry.ts` single source of truth and no `dq-engine.ts` pure runner today", and this net-new engine is a P0 INFRA foundation that A1, B1 and B2 all block on.
- The Create surface across phases includes net-new `dq-engine.ts`, `detector-registry.ts`, `dq-sweep.ts`, a new `.github/workflows/dq-corpus-sweep.yml`, the C2 gate harness `run-spec-recall-gate.mjs` plus `spec-corpus-golden.json` plus `spec-recall-baseline.json`, plus seven novel modules (`hvr-style.ts`, `llm-relation-extractor.ts`, `quality-sla.ts`, `sla-ticket.ts`, `refresh-queue.ts`, `freshness-decay.ts`, `detect-retrieval-gaps.ts`) with their own vitest files.
- `013-retrieval-feedback-edge/spec.md:3` admits the impression telemetry "does not exist" and the capture is "mandatory and net-new".

The §4 build section describes these net-new seams honestly. The over-claim lives in the headline framing of §1 and the SUMMARY, which sell a real engine, registry, sweep, CI workflow, benchmark gate and telemetry capture as "just wiring". This is the reuse-dressed-as-trivial pattern my slice targets.

**Class:** SPEC-PREMISE issue (corroborated by the LIVE-CODE absence stated in `026/spec.md:62` and `013/spec.md:3`).

---

## FINDING 4 (P2): SUMMARY's "one sure thing (zero risk) ... Free" for A4 drops the qualifier and contradicts A4's own mandatory migration

**Evidence:**
- `SUMMARY.md:26` "Do now, one sure thing (zero risk): turn on a schema check that already exists but is not switched on ... Free."
- `research.md:29` scopes the real claim narrowly as "zero prod-retrieval risk" because A4 "touches validation not ranking". The SUMMARY widens "zero prod-retrieval risk" into "zero risk" and "Free".
- A4's own phase contradicts the wide form. `004-schema-warn-to-error/spec.md:140` records a Med risk that "an early flip would block validation on legacy packets" and mandates "BACKFILL ... then re-measure to zero before flipping", and `:195` leaves the backfill ownership of the 11 invalid files as an open question. The migration is the four-beat WARN to BACKFILL to RE-MEASURE-TO-ZERO to ERROR discipline (`research.md:108`), not a one-step switch-on.

A change that requires censusing and backfilling an asserted 11 invalid live files to zero before it can flip is not "Free" and not "zero risk" in the unqualified sense the SUMMARY uses. P2 because the underlying narrow claim (no ranking risk, no re-index) is sound and only the plain-language compression overstates it.

**Class:** SPEC-PREMISE issue.

---

## Slice verdict

The packet's detailed sections (research.md §4, the per-phase specs) are mostly honest about their seams. The over-claims cluster in the two summarizing surfaces (SUMMARY.md and research.md §1), where measured-vs-asserted and reuse-vs-build distinctions get flattened in the reader's favor.
