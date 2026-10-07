# Iteration 11: Q4 - phrase tooling audit, the seeder's pinning chain, and Gate 3 wording

## Focus

Audit `template-phrase-cleanup.mjs`, `template-phrase-census.mjs`, the `create.sh` seeder, and the Gate 3 wording change (4af470d1531) for hardening gaps.

## Actions Taken

1. Re-read `steer.md`.
2. Read `template-phrase-cleanup.mjs` (full, 532 lines) and `template-phrase-census.mjs` (full, 484 lines).
3. Read `create.sh`'s `replace_template_default_trigger_phrases` seeder and `create-root-numbering.vitest.ts:205-324` (the pinning test).
4. Read `phrase-judge.mjs` head (single-verdict-source contract).
5. Diffed `4af470d1531` for `spec-gate-core.mjs`; enumerated all 102 touched files; grepped which templates carry `trigger_phrases` and who consumes the new `GATE_3_CHOICE_*` constants.
6. Read `advisory-checks.yml` in full.

## Findings

1. The seeder's triplication is defended, not accidental: `create-root-numbering.vitest.ts` pins (a) create.sh's stop-word list to cleanup's `DESCRIPTION_STOP_WORDS`, and (b) every template's quoted `trigger_phrases` block to BOTH its `phrase-judge.mjs` constant AND the matching create.sh bash array - a three-way equality across all five doc kinds. A template phrase edit that forgets the judge set or the seeder fails the suite. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:212-324; phrase-judge.mjs:8-13]
2. `phrase-judge.mjs` is the deliberate single verdict source: "the one place that says which trigger phrases the convention rejects", re-exported by the retrofit pipeline and validator so "every enforcer keeps the same verdict". CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:5-13]
3. GAP - add-on docs uncovered: NINE more templates ship `trigger_phrases` (goal, handover, decision-record, before-after, debug-delegation, research, resource-map, roadmap, timeline) but `TARGET_KINDS`/`DOCUMENT_KINDS` cover only spec/plan/tasks/implementation-summary/acceptance-criteria - so cleanup and census are blind to template-phrase debt in every add-on doc. CONFIRMED [SOURCE: template-phrase-cleanup.mjs:32-38; template-phrase-census.mjs:28-49; grep -l trigger_phrases templates/]
4. GAP - non-atomic writes in cleanup: `fs.writeFileSync(file, plan.updated)` at :420 truncates-then-writes authored documents, while repair-derived goes through `writeAtomic` (tmp+rename+mode preserve) for exactly this reason - an interrupt mid-write loses the document. CONFIRMED [SOURCE: template-phrase-cleanup.mjs:419-422; repair-derived.cjs:214-235]
5. Gate 3 wording has a self-inflicted three-way divergence: commit 4af470d1531 extracted `GATE_3_CHOICE_EXISTING/NEW/RELATED/SKIP` constants, but the rendered menus still inline DIFFERENT text - the constant says "Use a related folder, phase child, or a series parent..." while `GATE_3_QUESTION`'s C line says "Use a related spec folder or phase child, or a series parent..." and the NOTICE's C uses a third phrasing; QUESTION's D is inline while NOTICE's D uses the constant. The constants are consumed by spec-gate-enforce.ts and the test - so one canonical wording exists but the menus don't render it. CONFIRMED [SOURCE: git show 4af470d1531 spec-gate-core.mjs diff; grep for GATE_3_CHOICE_* consumers]
6. The advisory-checks design is coherent as shipped: trigger-index freshness runs `--check` report-only with deliberate `continue-on-error` ("a red X nobody is expected to act on is how a gate becomes background noise"), while the rebuild job is the enforcement leg on integration branches - report in CI, repair post-merge. CONFIRMED [SOURCE: .github/workflows/advisory-checks.yml:8-13,55-68]
7. Cleanup's `--apply` writes carry sha256 before/after proof per file in the report and `cleanup-apply.json` in the scratchpad evidences the recorded trail - the audit shape is right; only the write mechanics (finding 4) lag repair-derived. CONFIRMED [SOURCE: template-phrase-cleanup.mjs:419-427,475-495]

## Ruled Out

- Extending TARGET_KINDS to all nine add-on docs blindly: each needs its seeded-phrase recipe (slug+kind pattern fails for e.g. resource-map where the slug alone may be right); per-kind seed recipes must be decided first.
- Treating the Gate 3 constant-vs-inline difference as necessarily a bug: consumers may intentionally want terse constants vs verbose menu text - but then the constants are misnamed (they read as THE wording); flag as drift surface regardless.

## Dead Ends

None.

## Edge Cases

- `usableDescription` treats `[`-prefixed descriptions as absent (scaffold-placeholder detection) - good; a real description starting with a bracket is ignored, a documented-by-code tradeoff.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R11.1 | Extend cleanup/census TARGET_KINDS to the nine add-on doc kinds, each with an explicit seed recipe (default: slug only); add each kind to the three-way vitest pin (template block <-> judge set <-> seed recipe) | Q4 | template-phrase-{cleanup,census}.mjs, phrase-judge.mjs, create.sh seeder, vitest | M | Med: new kinds need recipe decisions; keep dry-run + sha256 proof | 5 files | finding 3 coverage gap | CONFIRMED gap, INFERRED recipe effort |
| R11.2 | Route cleanup's writes through the same atomic pattern as repair-derived (tmp+rename+mode preserve) - extract writeAtomic into a shared lib both import | Q4 | template-phrase-cleanup.mjs + shared lib | S | Low: behavior-preserving | cleanup mjs, new/shared lib, repair-derived.cjs | finding 4 | CONFIRMED |
| R11.3 | Reconcile Gate 3 wording: either render menus from GATE_3_CHOICE_* constants (delete the inline variants) or rename constants to what they are (terse labels) and document the intentional split | Q4 | spec-gate-core.mjs (+ spec-gate-enforce.ts, test if wording changes) | S | Low: display text only; test pins may need update | spec-gate-core.mjs, test | finding 5 | CONFIRMED divergence |
| R11.4 | Keep advisory-vs-rebuild split as the documented model: advisory reports drift, the rebuild job repairs it on integration branches; add the same pair-rule for any future generated artifact | Q4, Q5 | .github/workflows/README.md | S | Low: docs | README | finding 6 | CONFIRMED as design intent |

Idempotency/reversal/meaning: R11.1 keeps dry-run-first and only removes/reseeds template phrases (structure, not prose). R11.2 is mechanical safety. R11.3 is display text. R11.4 docs. None changes document meaning.

## Sources Consulted

- `steer.md`
- `template-phrase-cleanup.mjs` (full), `template-phrase-census.mjs` (full)
- `create.sh` (:391-490 seeder)
- `create-root-numbering.vitest.ts` (:205-324)
- `phrase-judge.mjs` (:1-55)
- `git show 4af470d1531` (stat list + spec-gate-core.mjs diff)
- `.github/workflows/advisory-checks.yml` (full)
- `templates/` trigger_phrases census via grep

## Assessment

- New information ratio: 0.85 (all findings new evidence)
- Questions addressed: Q4 (phrase tools, seeder, Gate 3 wording) + residual CI question folded into Q5
- Questions answered: Q1, Q3, Q4 (all five named branch-change areas audited: rebuild job+token in iter 10, cleanup/census+seeder+Gate 3 here)

## Reflection

- What worked: `git show <commit> -- <path>` gave the exact Gate 3 diff; the constant-vs-inline divergence was visible only in the diff, not the final file's grep.
- What did not: nothing.
- Do differently: the vitest file answered the "who pins the triplication" question faster than reading create.sh end-to-end would have.

## Recommended Next Focus

Iteration 12 (Q4 close + Q5 open): the remaining branch changes - `7fe1cbeda87`/`bdd678bccff` corpus application commits (375-packet phrase replacement), `b36842de3c1` (21 packets strict repair), `d727cf94fe1` (phase 012 close + index rebuild) - what each teaches about corpus-scale writes; then Q5's check placement via `changed-packet-validation.yml` and `spec-kit-check.yml`.
