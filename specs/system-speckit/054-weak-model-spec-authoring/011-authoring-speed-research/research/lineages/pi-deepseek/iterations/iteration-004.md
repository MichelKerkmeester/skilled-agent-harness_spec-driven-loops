# Iteration 4: Derived metadata refresh and continuity saves

## Focus

Which derived-metadata refreshes after a doc edit (`description.json`, `graph-metadata.json` fingerprints, continuity saves) are mandatory, and which are pure overhead per edit? Read the writer contracts and the rule set that enforces them.

## Actions Taken

- Read a live packet's `description.json` and `graph-metadata.json`, and the track-level `graph-metadata.json`, then counted the derived fields and the shared index they live in.
- Counted the validator rules whose subject is a derived document, the graph, or continuity, and separated them from rule categories that judge authored content.
- Read the rule reference for `CONTINUITY_FRESHNESS` to see what the fingerprint is computed over and when it is active.
- Read `repair-derived.cjs` for its write contract and the documented repair loop in the structure reference.
- Read the continuity save workflow for which writer refreshes the derived files and which modes write continuity fields.
- Read the authoring card's forbidden-command list against the save workflow to see who performs the refresh.

## Findings

1. Each packet carries two derived documents that are recomputed from its prose: `graph-metadata.json` holds 17 derived fields including `trigger_phrases`, `key_topics`, `source_fingerprint`, `source_doc_hashes`, `causal_summary` and `save_lineage`, and `description.json` holds derived keywords, level and a `lastUpdated` stamp, so any wording edit invalidates them by design. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/graph-metadata.json:1] [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/description.json:1]
2. Derived-file and continuity rules are the largest single rule family: 16 of the 41 validator rules judge a description, a graph, a fingerprint or a continuity block rather than authored content. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
3. Strict mode turns that upkeep into a hard failure: `GENERATED_METADATA_DRIFT` is strict-only at error severity and re-derives the folder before comparing, so a wording edit can fail a strict check on metadata alone even when every sentence in the packet is correct. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
4. The refresh already belongs to the save, not to each edit: every planner mode of `generate-context.js` refreshes `description.json`, `graph-metadata.json` and the phase-parent pointers, and only `--full-auto` writes the continuity fields, so a per-edit metadata refresh duplicates work the save performs anyway. [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:257]
5. The authoring card pushes that refresh outside the author's window: its forbidden list names `generate-context.js` and `/speckit:save`, so the derived refresh and the continuity write happen after the authoring worker stops, at the exact moment nobody is reading the diff the refresh produces. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:25]
6. The continuity fingerprint is self-invalidating by construction: `CONTINUITY_FRESHNESS` recomputes a SHA-256 over `implementation-summary.md`'s own text with the fingerprint line zeroed and also requires packet paths clean, so every later edit to that document makes the stored value stale, and the rule is inert unless `SPECKIT_COMPLETION_FRESHNESS=true`. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:150]
7. The wall-clock stamps guarantee a diff on every save: `lastUpdated` in `description.json` and `last_save_at` plus `last_accessed_at` and `last_active_at` in the graph's derived block change on each save even when no prose changed, which costs reviewers a noisy diff and parallel workers a merge point for zero content information. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/description.json:8]
8. The structural repair loop has no changed-only mode: `repair-derived.cjs` is dry by default and prints an apply command, but the documented flow names one `--folder` per changed packet and then a separate track-root refresh, so repair cost scales with every packet a move touches rather than with the packets whose prose changed. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:16] [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:96]
9. The shared track index makes every new packet an edit to a shared file: `specs/system-speckit/graph-metadata.json` carries 20 `children_ids` in 2,890 bytes and `create.sh` appends the new packet to it, so parallel packet work converges on one small file again and again. [SOURCE: specs/system-speckit/graph-metadata.json:1] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:49]

## Questions Answered

- Which derived-metadata refreshes after a doc edit (description.json, graph-metadata.json fingerprints, continuity saves) are mandatory, and which are pure overhead per edit? Answered: none is mandatory per edit; the save owns the refresh, and the strict-only drift rules make it feel mandatory.

## Questions Remaining

- The final ranked change list.

## Ruled Out

- Recommending that authors run `repair-derived.cjs` after each document edit: the save already refreshes the same files, and the repair CLI's dry-run contract exists for structural moves, not for prose edits.
- Treating the continuity fingerprint as a live cost: it is opt-in and inert today, so pricing it as current overhead would overstate the time saved.
- Reading the refresh as free: it is cheap per run but it is a second write to two files per packet, so it is counted as churn and merge risk, not as compute.

## Dead Ends

- Searching for a documented "refresh only packets whose prose changed" mode in the repair tooling: the CLI takes explicit folders and roots, and no timestamp or hash filter exists, so the loop stays explicit.

## Reflection

**What worked and why**: reading the writer contract before the rule list. `save-workflow.md` states outright that every planner mode refreshes the derived pair, which reframes the whole question from "how often must we regenerate" to "who owns the regeneration".

**What did not work and why**: starting from `repair-derived.cjs`. It is the obvious tool for the question and the wrong one, because its documented use is structural repair, and following it first would have produced a fix loop recommendation that duplicates the save.

**What I would do differently**: for each upkeep rule, find its writer before reading its check. A rule without an owner is the finding; a rule with an owner is usually just a check.

## Sources Consulted

- specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/description.json
- specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/graph-metadata.json
- specs/system-speckit/graph-metadata.json
- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md
- .skilled/skills/system-spec-kit/references/memory/save-workflow.md
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs
- .skilled/skills/system-spec-kit/references/structure/phase-definitions.md

## Recommended Next Focus

Iteration 5: build the ranked change list. For each candidate change, state the time saved, the quality risk, the exact file it touches, and the evidence class behind the number; then separate the planning ceremony that small work does not need from the checks that earn their cost.

## SCOPE VIOLATIONS

- None executed. The derived files and the repair tooling were read, not run.
