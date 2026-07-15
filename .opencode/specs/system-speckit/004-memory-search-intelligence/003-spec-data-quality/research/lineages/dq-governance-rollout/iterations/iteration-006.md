# Iteration 006 — KQ6: Cross-lineage reconciliation into one governance spine

## Focus

The four building-block lineages contain three direct conflicts/corrections. A consolidated program cannot carry both sides. Governance must reconcile each into the survived fact, so the rollout is built on the corrected framing, not the superseded one.

## Conflict 1 — "extend quality-loop.ts" (dq-deep A1) vs "do NOT" (dq-automation-impl)

- **dq-deep A1 (literal):** extend the live default-ON `quality-loop.ts` to the authored surface.
- **dq-automation-impl (correction):** `runQualityLoop`'s `attemptAutoFix` trims content by `substring` (`:463-468`, 8000-char budget) — destructive on any 8KB+ authored doc (005 spec.md is 10.6KB). Reuse the PURE scorer `computeMemoryQualityScore` (`:392`, exported `:747`) + the non-mutating `reviewPostSaveQuality` (`:573`) instead; never run the destructive loop on an authored body.
- **RESOLUTION (governance fact):** dq-automation-impl wins. The destructive loop stays quarantined to memory-save. The authored surface uses the pure scorer + non-mutating reviewer in score+suggest mode. This becomes INV-1 (no body auto-fix) made mechanical. dq-deep's INTENT (extend the quality machinery to the authored surface) survives; its LITERAL machine choice is corrected.

## Conflict 2 — "no retroactive automation exists" (dq-deep B1 premise) vs "8 CI workflows exist" (dq-skilldoc)

- **dq-deep B1 (premise):** "no scheduled/hook invocation exists today; all retroactive tools are operator-run."
- **dq-skilldoc (correction):** 8 GitHub Actions exist, every one `on: pull_request` with `paths:` filters. The retroactive tier is NOT empty wholesale.
- **RESOLUTION (governance fact):** the PR-time (CI) tier is rich; the SCHEDULED (cron) tier specifically is empty (`grep "schedule:|cron:" .github/workflows` → empty). dq-deep B1's premise is false but its CONCLUSION (build the standing scheduled sweep) survives and sharpens: the sweep fills the ONE empty tier and its value is catching the three escape classes the change-triggered tiers structurally miss (measurement Tier 2). This is why the master sequence frames S4 as "the empty cron tier filled," not "the first retroactive automation."

## Conflict 3 — "build a skill wikilink validator" (dq-probe F5) vs "already built + CI-wired" (dq-skilldoc)

- **dq-probe F5 (proposal):** build/extend a wikilink/anchor integrity validator to the skill `[[name]]` graph.
- **dq-skilldoc (correction):** `check-links.sh:5,25` is already fence-aware + exit-coded AND CI-wired via `markdown-link-integrity.yml`. Only the pre-commit (instant) timing is missing.
- **RESOLUTION (governance fact):** do not re-spec the validator. The only governed work is adding the instant pre-commit timing. This folds into the rebuild-shipped-machinery anti-pattern (#6): grep before building. The corpus census (S0) confirms what already ships before any detector is authored.

## The single governance spine (what all three reconciliations produce)

The three reconciliations converge on one principle that becomes the spine's first rule: **the corpus already half-builds most of the program; governance's first job is to confirm what ships before authoring anything.** Concretely:

- The PURE scorer ships (don't rebuild it; don't run the destructive sibling).
- The CI retroactive tier ships (build only the empty cron tier).
- The wikilink validator ships + is CI-wired (add only the missing timing).
- The dual-mode prod@3 harness ships (`run-eval-v2.mjs`; author only the goldens + the gate).
- The entity extractor, FSRS decay, causal graph, envelope token budget, quality multiplier all ship (enrich; never duplicate).

So the spine's ordering rule (census-before-gate, S0 first) is not just a safety rule — it is the reconciliation mechanism: the census is what catches a "build X" proposal that should be "wire the existing X." Every cross-lineage conflict was a build-vs-wire disagreement, and the census resolves all of them by counting what exists first.

## The reconciled program statement

The consolidated program is: ONE shared safe-fix engine over a frozen fixClass registry, wired through three front doors (on-write / scheduled / interactive), filling the one empty timing tier, gating every authored-body and retrieval change to report-only/human/C2, migrated warn→backfill→re-measure→error per gate, measured one-reader-one-metric, with the retrieval half frozen behind a prod-mode completeRecall@3 read it does not yet have. Nothing in it is green-field that the census shows already ships.

## Dead Ends

- Carrying both sides of a conflict "to be safe." A program that both extends the destructive loop AND quarantines it is incoherent; governance must pick the survived fact.
- Treating the conflicts as open questions. They are settled by file:line in the building-block lineages; reconciliation is selection, not re-research.

## Sources

- `../dq-deep/research.md` A1, B1 premise
- `../dq-automation-impl/research.md` §1 (the two-machinery correction), iter 1
- `../dq-skilldoc-cmd-ctx/research.md` §1, §4 (the two prior-lineage corrections), §5 (wikilink)
- `../dq-probe/research.md` F5; `quality-loop.ts:392,463-468,573,747`

## Assessment

newInfoRatio 0.30 — reconciliation is selection among known facts, so novelty is modest. The new contribution is recognizing that all three cross-lineage conflicts share ONE shape (build-vs-wire) and that the census (S0) is their common resolver. This ties the reconciliation directly to the master sequence's first stage and the rebuild-shipped-machinery anti-pattern.
