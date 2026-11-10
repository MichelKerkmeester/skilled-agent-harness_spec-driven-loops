# Iteration 010 — The ranked simplification plan (KQ8, angle 8)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 10 | status: **thought** (analytical-only — no new evidence; synthesizes 30 findings, runs 1-9, against the restraint ladder)
Focus: capability preserved | files touched | risk | expected gain per outcome — ranked. Sources: iterations/001-009 + deltas/; no files read this run (the restraint ladder applied to the loop itself: the 30 findings are the evidence).

## The verdict, first

The corpus's overengineering is **not in the validated core** — the 39-rule gate, the honesty machinery (anchors/closure/waiver-ADR/fingerprint), and the governance layering are evidenced WORKING (F27-F29: 62% duty cycle measured, 0/1 faking found, 0 placeholder debt, honesty mechanical where exercised). The overengineering lives in the **perimeter**: documentation shape (5 uncoordinated copies of one vocabulary — F14), ceremony spread (3,582 LOC of out-of-process adapter protocol — F11), phantom promises (6 promised dashboards, 3 mechanismless — F18), and a 0-adoption promotion tail (F23). Five P1s: F1, F11, F14, F18, F23 — of which FOUR are perimeter-shape, ONE is adoption. The plan therefore: trim the perimeter, keep the core, prove nothing.

## The ranked moves

**R1 — One vocabulary, one authority (the severity/strict/status covenant).** *F14 (P1), + F1, F2, F9, F16, F30.*
- Capability preserved: all 39 rules, the narrowed-run fatal-unknown, the warn-vs-ENFORCE covenant, the freshness mechanics — untouched.
- Files touched: 6 — `validator-registry.json` (sole authority, unchanged), `orchestrator.ts:106-111,293-300,984-988` (derive, don't restate), `validate.sh:46-64` (printer consumes the report's own summary; kills the 2-of-3 drift), `validation-rules.md:36-48` (→ pointer), `feature-catalog.md:514` (→ pointer), `continuity-freshness.ts:60-62` (+1 clause: the hashed input — closes F30).
- Risk: LOW — display/pointer layer only; gating logic and the registry untouched.
- Gain: better output ~0 (neutral); **better adherence** — the already-demonstrated drift class (F2) dies and becomes mechanically caught (the drift guard exists: `env-reference-drift.vitest.ts`); **lower maintenance** — 5+ coordinated edits per semantics change → 1.
- Why first: the drift ALREADY HAPPENED (F2); this is the 80/20.

**R2 — Collapse the two 5:1 multiplexes.** *F8 (P2), F1.*
- Capability preserved: the 10 behaviors, as subcodes of 2 rule ids; narrowing via the existing 31-alias mechanism (a group id + subcode, fatal-unknown kept).
- Files: `validator-registry.json` (10 rows → 2 + subrules), `rules/check-canonical-save.sh` + the `spec-doc-structure` module (emit subcodes), `orchestrator.ts:152-163` (the `SPECKIT_CANONICAL_SAVE_RULE` set→run→unset round-trip dies).
- Risk: MEDIUM — the narrowing vocabulary changes; the alias map absorbs it; report consumers that count rows see 8 fewer.
- Gain: better output (8 fewer report rows — legibility); better adherence (the silent wrong-rule-attribution mode dies); lower maintenance (8× fewer descriptions).
- Note: same move, second occurrence — the pattern's THIRD instance would justify the abstraction; there are exactly two, so this is a direct collapse, not a new mechanism (restraint ladder).

**R3 — Provenance lines in the manual playbook.** *F31 (P2).*
- Capability: unchanged (additive). Files: 85 scenario docs × 1 line ("shadows: `<file>.vitest.ts#<case>`"; 84/85 currently UNKNOWN — the line makes it answerable). Risk: TRIVIAL. Gain: better adherence (readers verify proofs; duplication-vs-shadowing becomes decidable); better output (traceability).
- Why third: cheapest yield in the plan; 85 lines.

**R4 — Make complete.md:92 true.** *F18 (P1).*
- Capability: the completion report's ACTUAL shape becomes the documented shape. Files: 1 (complete.md:92, list what `speckit-complete-auto.yaml` actually assembles) — the "build the 6 dashboards" variant is the alternative, higher risk, unproven demand (the restraint ladder: the promise shrinks, nothing is built).
- Risk: TRIVIAL. Gain: better output (promise=product); better adherence (no completion-conversation hunt for 3 mechanismless "dashboards"); lower maintenance (a 6-name list synced against nothing dies).

**R5 — Resolve the naming conventions.** *F20 (P2), F13 (P2).*
- Capability: unchanged — pointers resolve mechanically. Files: ~4 (`speckit-complete-confirm.yaml:244-247`, `speckit-complete-auto.yaml:272`, `runtime/cli/resource-map/README.md:64` → real `templates/addons/*.md.tmpl` paths; the empty `runtime/hooks/opencode/` dir: delete orpoint it at wherever the OpenCode integration actually lives — 1 sentence of honesty).
- Risk: TRIVIAL-LOW. Gain: better adherence (greps and link-checkers hit something); lower maintenance (the 0-resolution convention's decoding lore dies).

**R6 — Freeze the optimizer's promotion tail.** *F23 (P1).*
- Capability preserved: telemetry emission, the manifest covenant, the drift guard, the perf benches (the machinery's evidenced consumers); the 3 advisory tunables and the DESIGN stay.
- Files: 0 touched, 5 quarantined (`promote.cjs`, `replay-corpus.cjs`, `replay-runner.cjs`, `rubric.cjs`, `search.cjs` + the empty `audit/promotion-reports/`) — mark frozen-until-second-promotion; DELETE only after an import-census beyond the evidenceBoundary (advisory consumption recorded UNKNOWN, run 9).
- Risk: LOW if frozen (zero behavior change), MEDIUM if deleted (UNKNOWN out-of-boundary imports).
- Gain: lower maintenance (5 scripts' drift + the 5-6 ledger/lock files per lineage justify themselves only when a second promotion exists); better output ~0; better adherence: the covenant ("advisory-only") gains a truthful mileage note.
- Note: the restraint ladder's second rung — the simpler existing thing — is "telemetry + manifest + ONE hand-run promotion report"; the machinery outran its adoption by exactly one promotion.

**R7 — Retire the readerless flag.** *F24 (P2).*
- Capability: none lost — the skill's own drift test pronounces it dead (`env-reference-drift.vitest.ts:295`); it is absent from `ENV-REFERENCE.md` already.
- Files: `golden-queries.json:27,189-191` (−4 rows), the drift-test clause (−1). Risk: TRIVIAL. Gain: better output (fixtures stop ceremonially exercising a ghost); better adherence; lower maintenance (1 fewer truth to keep).

**R8 — The one-line orientation pointer.** *F25 (P2).*
- Files: the governance clause (§5) +1 line → `runtime/ENV-REFERENCE.md`. Risk: TRIVIAL. Gain: better adherence (the "retrieval = 2 machineries" orientation cost, measured at 3 greps in run 7, dies).

**R9 — The keep-list (the+ column, not maintenance):** governance = ONE 506-line file + symlink (F22: measured 0× duplication); repo-rules = 1,615 LOC of behavior, 1 machinery mention (the layering CLEAN — nothing to fold, ruling out the "fold into a repo rule" industry); the honesty machinery (F27-F29: 62% duty cycle, 0 faked surfaces in the sample, ADR-backed waivers, Closeable:No); the F15 leaf-manifest covenant (2 artifacts per docs edit — priced, deliberate, --check'd); the F21 2-layer freshness covenant (the ONLY 2× restatement between governance and component); the env-reference drift guard (the machinery that catches F14-class debt). Any future simplification must preserve these; their measured non-bloat is the part of this corpus worth copying.

## Gains, totaled, honestly

- Better output: R2 (−8 report rows), R4 (promise=product), R7 (no ghost fixtures) — REAL but small; the corpus's output (the 39-rule verdict, the honesty machinery) was never the problem.
- Better adherence: R1 (drift class dies, mechanically caught), R3 (traceable proofs), R4/R5 (promises and pointers resolve), R8 — the largest-yield outcome; the corpus's demonstrated adherence weakness is exactly vocabulary drift and unread ceremony.
- Lower maintenance: R1 (5+→1 edits), R2 (−8 descriptions, −1 indirection), R6 (−5 scripts' drift), R7 (−1 truth) — the largest-yield outcome for the maintainers.
- The 5 P1s decompose: F14→R1, F18→R4, F23→R6, F11→(unranked this run: the 3,582-LOC adapter ceremony — the highest-effort/highest-payout move, MEDIUM-HIGH risk, requires the host-native port; deliberately NOT ranked above R1-R8 because it is the only move that changes runtime behavior), F1→R1+R2.
- F11's explicitly-deferred port: capability = the 4 delegating adapters' contracts; files = 5 hook trees + their registrations; risk = MEDIUM-HIGH (5 runtimes' live behavior); gain = −3,582 LOC of ceremony, −1 doctor-asset dependency. It is the plan'sphase-2, gated on R1-R8's adoption proving the appetite.

## Loop telem线metry (final, this run)

10/10 iterations; status history: 9× complete, 1× thought; newInfoRatio 0.9→0.622 (rolling, 9 evidence iterations); convergenceThreshold=3 (structural: novelty never nominates — by dispatch design, recorded as telemetry); compositeStop 0.0 throughout; stuck count 0; 0 timeouts/errors. Planned stop: cap.
