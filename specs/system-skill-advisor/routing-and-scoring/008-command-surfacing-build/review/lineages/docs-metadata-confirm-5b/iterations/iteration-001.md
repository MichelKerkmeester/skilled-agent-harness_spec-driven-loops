# Deep Review Iteration 001 - docs-metadata confirm 5b

## Dispatcher

BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=3
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build

- Lineage: `docs-metadata-confirm-5b`, a detached fan-out lineage of review pass five, round 5b. Executor: `cli-opencode` model `opencode-go/deepseek-v4.1-flash`, this process runs each iteration inline.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/docs-metadata-confirm-5b`.
- Dimension this iteration: **traceability**. Operator review focus, bound as `review_focus`: confirming round 5b of code review pass five; read `review/review-brief-5b.txt` first and follow it; review the `docs-metadata` area files of `review/review-scope-5b.txt` plus docs that describe them; every finding P0/P1/P2 with file:line and a concrete input; holdout rule; change no code; write only inside the lineage folder.
- How this iteration addressed the focus: it read the brief, the scope file, the focus file, the verifier's `verify-5/report.md`, the remediation plan's D10 and D13 rows, and both re-review reports (`scratch/review/report-2.txt`, `report-3.txt`) before any review action, then checked each claim the `docs-metadata` fix changed against the artifact or code it names. The holdout rule held: no prompt corpus file was opened, and no prompt text is quoted. No code was changed and every write landed inside the lineage folder.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-5b.txt:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-5b.txt:3`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-focus-5b.txt:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-5/report.md:29`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/plan.md:1`
- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176`
- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:26`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:8`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1366`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:214`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2263`
- `.skilled/skills/system-skill-advisor/leaf-scopes.json:7`
- `.skilled/skills/system-skill-advisor/leaf-manifest.json:52`
- `.skilled/skills/system-skill-advisor/leaf-aliases.json:239`
- `.skilled/skills/system-skill-advisor/ROUTER.md:103`
- `.skilled/skills/system-skill-advisor/README.md:176`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The skill README still states 46 command rows while the fixed catalog states 47** -- `.skilled/skills/system-skill-advisor/README.md:176` -- The sentence "the bridge deriver writes an `embeddingText` for each of the 46 command rows the TypeScript scorer serves" was not updated when the feature-catalog leaf was corrected to 47. The generated artifact that both sentences describe carries 47 TypeScript-active rows, so the skill README now disagrees with the catalog and with the generated file it names.
   Case: a maintainer reads `README.md` to learn how many command rows the bridge deriver covers, sees 46, and concludes one TypeScript-served row has no `embeddingText`; `command-bridges.generated.json` reports 47 TypeScript-active rows, and the fixed leaf at `command-meaning-matching.md:26` says 47.
   Finding class: instance-only.
   Scope proof: `rg -n "command rows the TypeScript scorer serves"` over `.skilled` returns exactly this README line and the fixed catalog line; `rg -n "\b46\b"` over the changed-markdown set leaves only this line for command rows (`feature-catalog/feature-catalog.md:20` is a 46-feature count backed by 46 feature files, and `changelog/v1.0.0.0.md:101` is a historical 45-row entry).
   Affected surface hints: skill README command-bridge paragraph; feature-catalog command-meaning-matching leaf; `command-bridges.generated.json` counts.

2. **The router still says the hook scope names five hook docs after the fix added a sixth** -- `.skilled/skills/system-skill-advisor/ROUTER.md:103` -- `leaf-scopes.json:7` now lists `hooks/dsh/README.md` beside the five earlier entries, and six `hooks/**` Markdown leaves exist, so the router's "the scope names its five hook docs" is one behind the scope it describes.
   Case: a maintainer enumerates the hook leaves to check that DSH documentation is routable, counts six entries in `leaf-scopes.json` and five in the router sentence, and cannot tell from the doc whether the sixth is intentional or the scope has drifted.
   Finding class: instance-only.
   Scope proof: `jq -r '.modes[0].leaves[] | select(startswith("hooks/"))' leaf-manifest.json` prints six paths; `rg -n "five hook"` over `.skilled/skills/system-skill-advisor --glob '!**/changelog/**'` returns only this line, so no other live doc carries the stale count.
   Affected surface hints: `ROUTER.md` typed leaf projection; `leaf-scopes.json`; `leaf-manifest.json`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | The packet's top-level `spec.md` does not claim these docs; phase child `032-review-pass-five-remediation` owns the fix intent (`plan.md` D10 lists exactly the playbook lines changed). |
| `checklist_evidence` | core | notApplicable | No top-level `checklist.md`; the phase children carry their own checklists. |
| `skill_agent` | overlay | pass | The ROUTER and SKILL leaf projection reads the same `leaf-manifest.json`; both hook-leaf claims were checked against that manifest (finding 2 is the one drift). |
| `agent_cross_runtime` | overlay | pass | The changelog's Vibe/Claude/Codex/OpenCode/Devin claims were not changed by this fix; no cross-runtime doc claim was altered by the diff. |
| `feature_catalog_code` | overlay | partial | DM5-P2-001 is fixed at the catalog leaf (`47`), and the generated artifact agrees (`counts.typescriptActive: 47`); the same claim survives uncorrected in `README.md` (finding 1). |
| `playbook_capability` | overlay | partial | The playbook vocabulary, wave plan and category-folder fixes were read and are carried to iteration 2 for their own line-by-line confirmation. |

Summary: required 6, executed 6, pass 2, partial 3, fail 0, blocked 0, notApplicable 1.

## Integration Evidence

- **Producer to generated artifact:** `derive-command-bridges.cjs:1366` writes `counts.typescriptActive: compatibility.typescript.size`; `command-bridges.generated.json:8` holds `47`. `scoring-compatibility.json` carries 38 raw TypeScript rows and `activateStandaloneCommands` adds the standalone records, which is why the row count is 47 rather than 38.
- **Retired command path:** `command-attach.ts:214` defines `RETIRED_COMMANDS['/create:skill'] = '/create:sk-skill'`, and `.skilled/commands/create/` holds `sk-skill.md` with no `skill.md`, so the changelog's new sentence at `v1.1.0.0.md:251` is true.
- **Load-rate owner:** `score-command-transcripts.mjs:2263` defines `loadRate` as `command + skill` over the six path counts, so the changelog's sentence at `v1.1.0.0.md:176` matches the code.
- **Leaf metadata gate:** the alias projection contract at `ci-skill-root-metadata.cjs:425-437` builds one row per manifest leaf in order; the committed `leaf-aliases.json` matches that projection byte for byte (24479 bytes), so the DSH leaf addition is generator-consistent.

## Confirmed-Clean Surfaces

- `changelog/v1.1.0.0.md:176` `loadRate` wording now matches `score-command-transcripts.mjs:2263`: `command + skill` in the numerator, all six path counts in the denominator, `otherMode` denominator-only.
- `changelog/v1.1.0.0.md:251` retired-name wording now matches `command-attach.ts:214` and the absence of a command file.
- `command-meaning-matching.md:26` `47 rows` matches `command-bridges.generated.json:8`.
- `leaf-scopes.json`, `leaf-manifest.json` and `leaf-aliases.json` agree: 120 leaves in the manifest, 120 aliases, identical order, identical `diskPath`, no duplicate ids, and every leaf present on disk.
- `runtime/tests/README.md` section 4 lists all 106 top-level entries of the tests folder (91 files plus 14 folders plus README), with no listed-but-absent and no present-but-unlisted entry.

## Edge Cases

- `README.md:176` predates this fix commit (`git diff --name-only 2a1a42263cc d21dbc1cafe` does not list it), so finding 1 is a second site of DM5-P2-001 rather than a regression the fix introduced. It is reported because the fixed catalog and the README now state different counts for the same generated artifact.
- `ROUTER.md:103` is a doc that describes the changed leaf metadata, not a file in the fix diff; finding 2 is drift the fix created by adding the sixth scope entry without its describing sentence.
- The coverage graph seed (`upsert.cjs`) was not run because it writes its database outside this lineage's write boundary; the loop therefore stops on the iteration cap rather than a graph-backed convergence decision. Recorded here and in the strategy.
- The holdout corpora (`command-prompts.jsonl`, `holdout-prompts.jsonl`, `behaviour-fresh-prompts.jsonl`) were not opened at all in this iteration; no prompt text or row id is quoted.

## Ruled Out

- "`feature-catalog.md:20` states 46 and is therefore stale": ruled out; it counts 46 feature files, and `find feature-catalog -mindepth 2 -name '*.md'` prints 46.
- "`changelog/v1.0.0.0.md:101` states 45 command rows and is stale": ruled out; it is a historical release note describing the state at v1.0.0.0, not the current count.
- "The leaf metadata trio is stale or hand-diverged": ruled out; manifest and alias projections agree byte for byte and the added DSH leaf resolves on disk.
- "The tests README tree invents or omits an entry": ruled out; the 106 doc entries and the 106 disk entries match one for one.

## Next Focus

- Dimension: maintainability, with the correctness half of the playbook vocabulary.
- Focus area: `manual-testing-playbook/manual-testing-playbook.md` sections 5, 6, 8 and 18.5, and `runtime/tests/README.md` section 3, checked for residual lists that disagree with the live inventory after the fix.
- Reason: iteration 1 closed the two traceability drifts at the count level; the remaining DM5 fixes are inventory and vocabulary edits whose failure mode is a second stale list in the same document.
- Rotation status: traceability reviewed; maintainability and correctness next; security last.
- Blocked/productive carry-forward: productive direction is doc-list versus live-inventory comparison; no blocked approach yet.
- Required evidence: the nine category folders, the 53 scenario files and their frontmatter ids, the validator's `REQUIRED_OUTCOME_VOCABULARY`/`FORBIDDEN_VERDICTS`, and the tests folder listing.
- Recovery note: none.

Review verdict: PASS
