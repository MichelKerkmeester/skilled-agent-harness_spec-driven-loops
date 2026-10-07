# Iteration 6: Q1 mapping, one-off scripts against the existing toolchain

## Focus

Decide, per one-off repair script, whether a permanent tool already owns it, whether it needs a new capability inside an existing tool, or whether it should stay a human lane. The evidence is the existing pipeline in `upgrade-legacy.mjs`, its three stage tools (`heal-spec-docs.cjs`, `repair-derived.cjs`, `migrate-generated-json.ts`), and the scratchpad one-offs.

## Actions Taken

- Read `upgrade-legacy.mjs` header, constants and step order.
- Read `heal-spec-docs.cjs` boundary and refusal classes.
- Read `repair-derived.cjs` repair set and its DERIVABLE/REDERIVABLE tables.
- Checked `migrate-generated-json.ts` for the recorded `specFolder` rewrite and `frontmatter-migration.ts` for field filling.
- Read the scratchpad one-offs `add-fm-fields.mjs` and `fix-specfolder.mjs` fully.

## Findings

1. `upgrade-legacy.mjs` is already the safe old-tree migrator, and it is explicitly designed for trees "written under the earlier rules": it validates every packet, runs only failing packets through a fixed step order, records whatever the tools cannot clear in the packet's `upgrade-baseline.json`, and the validator then reports a recorded finding as a warning while anything unlisted stays an error. No language model is involved. Dry by default; `--apply` writes; archived snapshots are only ever recorded, never rewritten; exit codes 0 (all pass), 1 (dry run found failures), 2 (rejected argument or still failing after apply). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] CONFIRMED
2. The pipeline order is `fill-frontmatter` then `heal-spec-docs` then `repair-derived` then `migrate-generated-json`, each step running only for packets that still fail; the dry run prints exactly that sequence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:589] CONFIRMED
3. The `fill-frontmatter` step adds missing frontmatter keys through `frontmatter-migration.ts` and "never rewrites one it has"; that is exactly the job the one-off `add-fm-fields.mjs` did. The one-off's field-copy-from-spec.md rule is a stricter variant of the same derived value (importance_tier, contextType). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:307] CONFIRMED
4. `heal-spec-docs.cjs` restores only values a template literally defines: default trigger phrases per document class, and a `SPECKIT_TEMPLATE_SOURCE` header only when the document's own anchors match that template's anchor set. It refuses documents with no frontmatter ("nothing to restore into") and reports refusals; the dry run doubles as the census. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:8] CONFIRMED
5. `repair-derived.cjs` repairs the description level (only from the packet's own declaration, never the validator's fallback), the recorded location (Spec Folder row and frontmatter packet_pointer), and re-derives graph metadata; its DERIVABLE and REDERIVABLE sets name exactly which rules each class can settle, and authored rules are refused by construction. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:75] CONFIRMED
6. `migrate-generated-json.ts` computes `specFolder` from where the folder actually sits under the specs root and rewrites the generated JSON; that is the permanent owner of the one-off `fix-specfolder.mjs`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:358] CONFIRMED (rewrite behavior inferred from the computed value plus the migrate step being an apply step; confirm by reading its write block)
7. Two capabilities have no permanent owner. First, anchor-structure repair: `fix-dup-anchors.mjs` deletes stray glued template pairs, numbers isolated duplicates and reports the rest, but no pipeline step edits anchors; `heal-spec-docs` only READS anchors as template provenance evidence. Second, missing required-document reconstruction: `upgrade-legacy` records the failure but cannot rebuild a document, and phase 013's reconstructions were lane work with dated notes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:1] CONFIRMED for the absence, from the pipeline step list
8. The verdict per one-off script is therefore: `fix-specfolder.mjs` and `add-fm-fields.mjs` are already owned by pipeline steps; `fix-dup-anchors.mjs` needs a new prose-preserving anchor step; missing-document reconstruction should stay a recorded, human-lane defect because no algorithm can supply what a document says. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392] CONFIRMED for the owned two, INFERRED for the reconstruction recommendation

## Ruled Out

- Building a second migration pipeline beside `upgrade-legacy.mjs`: it already has the step order, dry-run default, grandfathering record and archive protection a pre-v4 migration needs; new repairs belong as steps inside it.
- Auto-reconstructing missing documents in the heal pipeline: reconstruction asserts what a document says, and both `repair-derived` and `heal-spec-docs` refuse authored facts on principle. Phase 013's dated-note lane stays the model.

## Dead Ends

- Looking for an anchor-repair invocation name in the pipeline: the step list contains no anchor editing at all, which is the finding rather than a missing script path.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the README repair boundary and the pipeline's staged design agree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-specfolder.mjs`

## Assessment

- New information ratio: 0.90 (7 of 8 findings fully new; 1 is the owned-script verdict consolidating prior reads and counts as half new)
- Questions addressed: Q1 substantially, Q3 partially (the pipeline is the migration substrate)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-014 | Add an anchor-structure repair as a pipeline step, using the rules proven in `fix-dup-anchors.mjs`: delete only stray glued+overlapping template pairs, number isolated duplicates, leave ambiguous cases reported and untouched; run it after `heal-spec-docs` so provenance evidence is read before markers move | Q1, Q2 | New `repair-anchors` behavior (step in `upgrade-legacy.mjs`, rules shared with `heal-spec-docs.cjs` or a small module) | M | Med; anchor markers are structural but an eager delete could hide a real duplicate, so the leave-ambiguous rule is mandatory | New module plus pipeline step and tests | No pipeline step edits anchors today; fix-dup-anchors.mjs already encodes safe rules and reports the rest | CONFIRMED gap | Yes (idempotent rules: second run finds nothing) | Revert the repair commit | No; anchor marker lines only, never prose |
| R-015 | Keep missing-document reconstruction out of automation: extend `upgrade-baseline.json` reporting with the level-required document name and let a reviewed lane reconstruct with the dated note, because a tool cannot restore what a document said | Q1, Q3 | `upgrade-legacy.mjs` reporting (already writes the baseline) | S | Low; reporting only | `upgrade-legacy.mjs` docs and baseline schema | `upgrade-legacy` records but cannot rebuild; phase 013 used dated-note lanes | CONFIRMED | Yes (report only) | Delete the report line | No |
| R-016 | Wire the two owned one-offs into documentation instead of code: `fix-specfolder.mjs` and `add-fm-fields.mjs` are covered by `migrate-generated-json` and `fill-frontmatter`; a regression test should pin one real old-packet fixture through the pipeline so the coverage cannot silently regress | Q1, Q5 | `upgrade-legacy.mjs` tests area | S | Low | Test file | The step order at upgrade-legacy.mjs:589 names both steps | CONFIRMED | n/a | n/a | No |

## Reflection

- What worked and why: reading the pipeline header first gave the step architecture, then each step tool confirmed its own boundary in one read each; the one-off mapping fell out mechanically.
- What did not work and why: searching for anchor repair by tool name found nothing until the step list was read; absence of a step is only visible in the pipeline definition.
- What I would do differently: for gap claims, always read the orchestrator's step list rather than grepping for expected tool names.

## Recommended Next Focus

Iteration 7: finish Q1 with the remaining one-off classes (duplicate/overlapping anchor survey, link repair, generic phrase cleanup, level declaration fixes) and the archive-side gap, then move to Q3 in iteration 8 with the doctor update path.
