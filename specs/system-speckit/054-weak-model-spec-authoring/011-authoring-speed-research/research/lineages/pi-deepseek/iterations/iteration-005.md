# Iteration 5: The ranked change list and the ceremony small work does not need

## Focus

Which ranked changes save the most time per unit of quality risk, and which file does each touch? Turn the measured evidence of iterations 1-4 into a ranked list, separate planning ceremony from protection, and state the evidence class behind every number.

## Actions Taken

- Compared the Level-1 example packet section by section to count what a sub-100-LOC change is asked to author, and to identify sections the level model attributes to higher levels.
- Re-checked the measured wall-clock delta and the anchor contract against each candidate change, so every saving is labelled measured or inferred.
- Located the exact file each change edits, including the sync guard that holds the authoring card and the drift guard that holds the examples.
- Ranked the candidates by time saved per unit of quality risk, and listed the ceremony items that small work carries without protection value.

## Findings

1. Rank 1, add a required-anchor check to the strict gate: the highest time saved per unit of risk, because three of four benchmark rounds failed on anchors that strict validation never checks, so each occurrence costs a full re-run round of three authoring runs plus audit, while the check itself exists as a template contract already. Time saved: one re-run round per occurrence, measured at 3 of 4 rounds. Risk: low, it surfaces a defect that review already finds. File: `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` plus the rule script it names. [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:26] [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/implementation-summary.md:64]
2. Rank 2, make the examples demonstrate the Verify clause: the template makes `Verify: <command> prints <expected output>` mandatory while the template frontmatter and all three shipped examples omit it, so the single most expensive per-task element has no worked model. Time saved: 16 to 42 command-plus-output pairs become copyable at exactly the level where they are demanded, measured as a 0-of-3 example gap. Risk: low, the change is additive and the example drift guard enforces it. Files: `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` line 15, and `templates/examples/level-1|level-2|level-3/tasks.md`. [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:15] [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md:54]
3. Rank 3, cut FILL notes to one imperative sentence plus a single good example: FILL text is 33.2% of the composed Level-1 spec, 35.5% of the plan and 41.3% of the tasks template, and the only measured authoring-speed win on record came from rewriting two such notes, at 252.3 s to 193.7 s mean. Time saved: the read volume share is measured, the wall-clock transfer is inferred from the note-rewrite precedent. Risk: medium, because the good-versus-weak contrast is the design that cut leftover hints, so keep one example and drop the contrast deliberately rather than by accident. Files: `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl`. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:59] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:116]
4. Rank 4, add a single-document quick packet for sub-25-point work: the biggest raw saving on the list, four documents to one, and the lowest rank among the big items because it is the only proposal that removes a protection surface. Time saved: at Level 1 the four documents are 26 sections across 14.6 KB, so the saving is roughly three quarters of the write volume for the smallest changes; measured volume, inferred time transfer. Risk: high, it is a level downgrade and the small-task definition exists precisely to prevent it. Files: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (a new `--level` value), `references/structure/folder-structure.md` level table, `references/templates/level-specifications.md`. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-1/spec.md:24] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:258]
5. Rank 5, give the authoring card a short path for Level 1 and retire its step-count tripwire: the card asks for 11 sections and 22 acceptance-or-verify slots before the first write, and it tells the author to stop and write an open question when a change needs a fifth plan step. Time saved: six sections and one stop-and-ask loop for small work, inferred from section counts. Risk: low to medium, because the same card is the surface that made the weak-model runs pass. Files: `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, with its sync guard in `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh`. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:162] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:168]
6. Rank 6, stop writing a wall-clock stamp into derived files on every save: `lastUpdated`, `last_save_at`, `last_accessed_at` and `last_active_at` guarantee a diff per save and a shared merge point, while carrying no content information. Time saved: reviewer and merge time only, inferred, not authoring wall clock. Risk: low, but any consumer that reads those stamps must be found first. Files: the description writer `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts` and the graph-metadata writer it feeds. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/description.json:8] [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/graph-metadata.json:1]
7. Rank 7, delete the published LOC targets: they are unenforced, contradicted by the Level-3-plus figure being lower than the Level-3 figure, and they invite a self-check loop that no script performs. Time saved: small but real, one invented conformance task per packet removed. Risk: low, no validator reads them. File: `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` lines 55 to 61. [SOURCE: .skilled/skills/system-spec-kit/references/templates/level-specifications.md:55]
8. Rank 8, resolve the inert continuity rule one way or the other: `CONTINUITY_FRESHNESS` is strict-only and does nothing unless `SPECKIT_COMPLETION_FRESHNESS=true`, yet its fingerprint invalidates on every later edit to `implementation-summary.md`, so today it costs documentation and buys no protection. Time saved: small, but it removes a false assurance that a completion claim is checked. Risk: low. Files: `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` around line 150, and the registry entry. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:150]
9. The ceremony small work does not need is nameable and mostly level-inherited: the Level-1 example still carries architecture, quality-gates and rollback sections, a 13-row acceptance table for a handful of requirements, four documents with four overlapping verification sections, and a 45-anchor contract, which together are the inherited plan for a sub-100-LOC change. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-1/plan.md:43] [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:39]

## Questions Answered

- Which ranked changes save the most time per unit of quality risk, and which file does each touch? Answered: eight ranked changes, each with its file and its evidence class, and the three top items are gate coverage, example parity and fill-note length.

## Questions Remaining

- None outstanding for the ranked list. The residual is evidence class: only the fill-note wall-clock effect is measured directly, and the rest are inferred from volume and round counts.

## Ruled Out

- Ranking the single-document quick packet first on raw saving: it removes a protection surface, so it loses to changes that save less and risk less.
- Proposing a rewrite of the validator rule set: 16 of 41 rules police derived files, but each has a writer, and the cost is the round trips, not the rule count.
- Recommending that authors run the metadata repair CLI after each edit: the save already refreshes those files.

## Dead Ends

- Looking for a per-change time measurement beyond the one benchmark brief series: no other authoring session in the repository was timed, so every saving outside the fill-note result is inferred from volume, round count or section count.

## Reflection

**What worked and why**: ranking by saved time per unit of risk rather than by raw saving. It put the anchor-coverage change first even though its saving is the smallest in minutes, because its risk is near zero and its measured recurrence is three of four rounds.

**What did not work and why**: treating every candidate as comparable. The wall-clock evidence exists for one change only, so the other seven had to be labelled inference, which changes the order a careful reader would trust.

**What I would do differently**: ask for one measured brief per level early, because a single Level-1 timing would have converted three of the eight rankings from inferred to measured.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/examples/level-1/spec.md
- .skilled/skills/system-spec-kit/templates/examples/level-1/plan.md
- .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md
- .skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md
- .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl
- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
- .skilled/skills/system-spec-kit/references/workflows/quick-reference.md
- .skilled/skills/system-spec-kit/references/templates/level-specifications.md
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md
- .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/implementation-summary.md

## Recommended Next Focus

Synthesis: compile the ranked list with its evidence classes into `research.md`, record the divergence map and the convergence report, and state plainly which numbers are measured and which are inferred from volume.

## SCOPE VIOLATIONS

- None executed. No template, validator, card or derived file was modified; every candidate change is named by path only.
