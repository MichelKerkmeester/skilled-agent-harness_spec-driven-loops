# Review Iteration 003

## Dispatcher

- Run: `fanout-scorer-attach-2-1794570021136-noekp0` (lineage `scorer-attach-2`, pass two, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: traceability
- Review focus addressed: the operator focus names "docs that disagree with code". This iteration re-reads the two changed docs in this area against the code and generated data they describe, and re-checks the pass-one doc fix (`R3-P2-001--0e0d904eb571`, the 46-row count) in both places it was applied.
- Budget profile: `verify` (11-13 calls), used 12.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:1-79` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:1-134` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:395-464`, `:485-496`, `:690-720`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:190-245` (consumer of the row's `mutating` field)
- `.skilled/skills/system-skill-advisor/README.md:176` (shared doc, the other half of the pass-one count fix)
- Executed: counts over `command-bridges.generated.json` (63 entries, 46 TypeScript-enabled, 46 `embeddingText`, 69 policy records, 44 unique commands) and the strictest-route rollup.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`command-bridges/README.md` describes the `COMMAND_ROWS` row without the `mutating` field that the row actually carries and `render.ts` reads** -- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50` -- The sentence names three fields: "Each row carries the runnable slash command, its derived policy and the owning skill." The generated row also carries `mutating` (`command-attach.ts:51`, emitted at `derive-command-bridges.cjs:1164` and `:1199`) and `render.ts:237-239` reads exactly that field to decide whether a child session may see a `run` command. A maintainer reading the README to learn the block's shape would not know the field exists, and this doc is the declared human entry point for the generated block.
   Finding class: doc_code_field_drift
   Scope proof: the README is the changed doc for `runtime/scripts/command-bridges/*` (scorer-attach scope); the emitted field is at `derive-command-bridges.cjs:1164` in the same folder, and the interface at `command-attach.ts:48-53`.
   Affected surface hints: `COMMAND_ROWS` row shape; `render.ts` child-session downgrade; the deriver's generated-block documentation.
   Case: read `render.ts:237-240` with a recommendation whose row is `{ command: '/doctor:speckit', policy: 'run', mutating: 'add-only' }`; the printed policy depends on `row.mutating`, a field the README's row-shape sentence does not list.
   Claim: the doc enumerates the row's fields incompletely, and the omission hides the input to the child-session safety rule.
   Evidence refs: `command-bridges/README.md:50`, `derive-command-bridges.cjs:1159-1166`, `command-attach.ts:48-53`, `render.ts:237-240`
   Counterevidence sought: checked whether the same README names `mutating` elsewhere as a row field — it appears only as a risk key (`:82`, `:113`, `:124-125`), never as part of a `COMMAND_ROWS` row.
   Alternative explanation: the sentence is a summary, and the optional nature of `mutating` (`mutating?`) makes the omission defensible.
   Final severity: P2 (documentation completeness; no behaviour depends on the doc)
   Confidence: high
   Downgrade trigger: withdraw if the sentence is read as a summary of required fields only and the field list is documented in `command-attach.ts` prose the reader is expected to open.

## Pass-One Doc Fixes Re-Read

| Pass-one id | Claim | Verified |
|---|---|---|
| `R3-P2-001--0e0d904eb571` | 46 command rows in both places the count appears | Holds: `command-bridges.generated.json` has 46 TypeScript-enabled entries and 46 non-empty `embeddingText` values; `feature-catalog/scorer-fusion/command-meaning-matching.md:26` says 46; shared `README.md:176` says 46 |
| `Q2` (policy source) | the attach path takes policy from `TRACKED_COMMANDS` | Holds on this surface: `command-bridges/README.md:50` says "A surface that attaches a command reads its policy from `TRACKED_COMMANDS`", matching `advisor-recommend.ts:483`. The pass-one `advisor-recommend.md:45` half belongs to the render-hooks-plugin area and is not re-scored here |
| `R4-P2-001--d1528b81a2ca` (prose half) | the deleted `COMMAND_POLICIES` table must not be described as live | Holds: `command-bridges/README.md:128` describes only the JSON `commandPolicies` array and says "Nothing scores on it yet", which matches a repo-wide search finding no reader |

## Traceability Checks

- `feature_catalog_code` — partial. `command-meaning-matching.md` matches the code on every checked claim: constants `COMMAND_MEANING_MIN_COSINE = 0.72` and `COMMAND_MEANING_MARGIN = 0.02` (`fusion.ts:847-848`), function names `requireCommandPhraseAnchor` (`:886`), `commandMeaningEligible` (`:876`), `rankMeaningPassedCommandFirst` (`:1061`), the `NO_EDIT_REQUEST` examples, the "17 cases" count in `command-meaning-anchor.vitest.ts`, and the `capture-command-routing-baseline.mjs --real-embedding` claims (`:89`, `:159`, `:682-683`). One row-shape drift sits in the sibling doc, reported as `SA2-P2-004`.
- `spec_code` — partial. Generated `commandPolicies` holds 69 records over 44 unique commands (SC-001's 44) and the strictest-route rollup is 7 `run` / 20 `start` / 17 `ask` against phase 002's recorded 7 / 22 / 15. The difference was already recorded at phase close (`002/acceptance-criteria.md:65` printed ask 16, run 7, start 21 and explained `/design:extract`), and the current table shows one further start→ask move whose cause was not proven in this iteration; recorded under Ruled Out rather than reported.
- `checklist_evidence` — pending. No packet checklist claim was in focus.
- `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:237-240` reads `mutating` first from an id-keyed row and then from any row whose `command` matches the printed command; this is the consumer the README's field list omits.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:438-442` fails when a hub mode names a command with no file, which is the behaviour `command-bridges/README.md:50` promises.
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:36` and `fusion.ts:881` agree that `NO_EDIT_REQUEST` rules out a meaning pass; the vocabulary gap recorded as `SA2-P2-002` is therefore a doc-accurate statement of a narrow pattern, not a doc error.

## Edge Cases

- **Rollup count variance.** Phase 002's REQ-012 text (22 start / 15 ask) disagrees with both its own AC-012 snapshot (21 / 16) and the current table (20 / 17). Because AC-012 carries an explicit "or each difference is explained" clause and already exercised it, the residual one-command move was not converted into a finding without a named command and an undocumented-change proof.
- **Shared vs area docs.** The 46-row count lives in two docs; both were checked because pass one's fix named both. The shared `README.md` is reviewed here only for claims about this area, per the lineage's non-goals.

## Confirmed-Clean Surfaces

- `command-meaning-matching.md:30-40` — the meaning-pass description matches `fusion.ts:876-931` and `:1061-1086` including the two bars and the stand-in refusal.
- `command-meaning-matching.md:44` — the `--real-embedding` preconditions named in the doc exist in the script (`EMBEDDER_MODEL_PREFIX`, `COMMAND_VECTOR_TABLE_PREFIX`, the `--write` refusal at `:682-683`).
- `command-bridges/README.md:37-48` — the derivation flow diagram matches `modeCommandRecords` (`derive-command-bridges.cjs:396-452`) and the four input sources listed in section 1.
- `command-bridges/README.md:120-126` — the policy ladder matches `derivePolicy` (`derive-command-bridges.cjs:490-496`) step for step, including the `write_scope` conjunct.
- `command-bridges/README.md:26-31` — every file named in the contents table exists in the folder (`command-bridges.generated.json`, `derive-command-bridges.cjs`, `scoring-compatibility.json`, `shadow-diff.md`, `README.md`).

## Ruled Out

- **46-row count drift.** Ruled out by executed count: 46 TypeScript-enabled entries, 46 with `embeddingText`, both docs say 46.
- **`commandPolicies` described as a live input.** Ruled out: the README says nothing scores on it, and no source file reads it.
- **Policy-ladder doc drift.** Ruled out by direct comparison with `derivePolicy`; all five steps and the `write_scope` conjunct agree.
- **Stale `feature-catalog` count.** Ruled out: the doc's "17 cases" matches the 17 `it(` blocks in `command-meaning-anchor.vitest.ts`.
- **Phase 002 rollup as a reportable defect.** Not proven: AC-012 already records a variance and its explanation, the residual move has no named command yet, and the requirement allows explained differences.

## Next Focus

- Dimension: maintainability
- Focus area: the changed generator and handler code that is not yet line-read in this pass — `derive-command-bridges.cjs:1-395` and `:453-1100`, `advisor-recommend.ts:1-420` and `:540-737`, `advisor-tool-schemas.ts`, and the two remaining changed tests (`advisor-recommend-compiled-route-option.vitest.ts`, `command-attach-guards.vitest.ts` already read).
- Reason: correctness, security and traceability have each read their slice; maintainability is the last configured dimension and the largest unread surface in the changed set.
- Rotation status: correctness, security and traceability complete (all PASS); maintainability next.
- Blocked/productive carry-forward: traceability was productive (one P2); no blocked approach.
- Required evidence: direct reads of the unread changed regions, plus the schema field list against the emitted fields.

Review verdict: PASS
