# Review Iteration 001

## Dispatcher

- Lineage: `docs-merge-10`, area `docs-merge`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: correctness and traceability. The pass-ten operator focus is the docs area and the merge resolutions: every docs claim is checked against the code at HEAD, and every merge path is checked in both directions so neither side's content was dropped. `review/review-brief-10.txt` and `review/review-scope-10.txt` were read first, and this iteration covers the files they assign to `docs-merge`.
- Diff bases as the scope file names them: docs paths with `git -c core.fsmonitor=false diff 05f776202e0 5b2b062baef -- <path>`; merge paths with `git -c core.fsmonitor=false diff e91faf28b8c^2 e91faf28b8c -- <path>`. Each file was then read whole at HEAD. The reverse direction, `git diff 5b2b062baef e91faf28b8c -- <path>`, was read too, so a dropped branch line could not hide behind a clean main-to-merge diff.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- Recorded limits and the holdout rule were honoured: no prompt corpus was opened, no `git diff`/`show`/`log -p` ran over a path containing one, `score-command-transcripts.mjs --summary` was not run, no CLI session store was read, and `.skilled/hooks/hook-flags.env` was not read or created.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/skills/system-skill-advisor/README.md` | 1-280 | The changed version and 46-to-47 row count, the embedder paragraph, both runtime enumerations, the nine-command table |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 1-223 | The changed `hookHealth` sentence, the command ids, the runtime adapter paragraph, the package boundaries |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | 1-251 | The three changed lines and the claims they sit in: hook handler list, no-edit summary, rename notes |
| `.env.example` | 1-643 | The added fresh-prompt line and its neighbours, including the dotenv-guard section it must not leak into |
| `.skilled/skills/sk-doc/SKILL.md` | 1-153 | The merged mode table, the version authority rule, and the packet list |
| `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md` | 1-208 | The merged command names, the removed README template, the resource map and the parent-hub tree |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | 1-204 | The merged runtime list, the accepted-answer table, the ordered steps and the status lines |
| `.skilled/changelog/skilled/v4.0.2.1.md` | 1-405 | The merged Vibe section, the hook entry count, the create-skill rename notes, the spec-folder list |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | 1-373 | The merged holdout, fit-row, environment and host-capture tests as one file |

Context evidence (read-only, outside the nine scope paths): `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:235-242`, `.skilled/commands/doctor/assets/doctor-install.yaml:46`, `.skilled/commands/doctor/assets/symlink-manifest.json:runtimes`, `.skilled/commands/doctor/scripts/symlink-engine.cjs:428-444`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-187`, `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:counts`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:487-509`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1759-1760`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1220-1235`, `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:435-449`, `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-80`, `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:119`, `.vibe/hooks.toml:1-152`.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The merge left the doctor-install contract test pinning the pre-merge presentation text** -- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` -- The merge kept main's rewritten accepted-runtime sentence, which now reads "A runtime name outside the nine" and no longer carries the DSH refusal note, while the branch's new contract test at `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:240-241` still asserts the old sentence `outside claude, opencode, codex, cursor, devin and pi or the ones already there` and the removed line `DSH is not offered, because the link manifest has no DSH row.` At HEAD the first two assertions have no matching text in the asset, so that test fails. The same merge kept the branch's `doctor-install.yaml:46` line that still says DSH is not offered, although the merged symlink manifest has a `dsh` row, so the surviving pair also contradicts the manifest.
Finding class: merge-resolution-integration
Scope proof: The merge direction was read both ways: `git diff e91faf28b8c^2 e91faf28b8c -- .skilled/commands/doctor/assets/doctor-install-presentation.txt` is empty (the merge took main's asset whole), and `git diff e91faf28b8c^2 e91faf28b8c -- .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` adds the branch's 12-line test block. `grep -F` for either asserted sentence in the HEAD asset returns no match.
Affected surface hints: `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`, `.skilled/commands/doctor/assets/doctor-install.yaml`, `.skilled/commands/doctor/assets/symlink-manifest.json`
Case: `node --test .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` runs "the presentation and the workflow name the accepted runtimes instead of a count"; its `assert.ok(PRESENTATION.includes('outside claude, opencode, codex, cursor, devin and pi or the ones already there'))` fails against the merged asset, which says "outside the nine".

```json
{"type":"claim_adjudication","claim":"The merge kept main's rewritten doctor-install presentation and the branch's contract test that asserts the pre-merge text, so the committed test fails at HEAD.","evidenceRefs":[".skilled/commands/doctor/assets/doctor-install-presentation.txt:58",".skilled/commands/doctor/assets/doctor-install-presentation.txt:78",".skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239-242",".skilled/commands/doctor/assets/doctor-install.yaml:46",".skilled/commands/doctor/assets/symlink-manifest.json:runtimes"],"counterevidenceSought":"Checked main's version of the test (it holds no such assertions), the merge's own change to the test (the branch block is added), whether another copy of the presentation carries the old sentence (none), and whether the yaml assertion still passes (it does, because the branch's DSH line survived).","alternativeExplanation":"The contract test could be outside every CI or pre-commit gate, which would make the failure advisory rather than blocking.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If the doctor contract test is excluded from every CI and pre-commit gate, this falls to P2."}
```

### P2 Findings

2. **The merged accepted-runtime sentence says nine but lists eight** -- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` -- Line 58 lists eight runtimes (`claude, opencode, codex, cursor, devin, pi, vibe, dsh`), and `symlink-manifest.json` has exactly those eight keys under `runtimes`; the engine rejects any other name with `unknown runtime`. The merged sentence tells the operator that a name "outside the nine" is refused, so the stated count is one higher than the accepted set.
Finding class: doc-claim-accuracy
Scope proof: The presentation's own list at `:58`, the manifest's `runtimes` object, and the engine's unknown-name branch at `symlink-engine.cjs:435-438` were each read. The manifest reports eight keys, not nine.
Affected surface hints: `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `.skilled/commands/doctor/assets/symlink-manifest.json`
Case: An operator counts the eight names the prompt prints and asks whether `cursor` is the ninth; the document gives no ninth name, and the engine accepts only the eight manifest keys.

3. **Both advisor runtime enumerations omit Vibe** -- `.skilled/skills/system-skill-advisor/README.md:244` -- The README says the hook contract covers "every runtime" and then lists Claude, Codex, Cursor, Devin, Pi and DSH, while `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` is a Vibe adapter and `hooks/skill-advisor-hook.md:119` documents the Vibe row. `SKILL.md:205` has the same gap: it names the adapters for Claude, Codex, Cursor, Devin, Pi, DSH and the OpenCode plugin but not Vibe. The same release's changelog names seven hooks, Vibe included, so the three files do not agree on the runtime set.
Finding class: cross-doc-consistency
Scope proof: The Vibe adapter file was read at HEAD; the hook contract document's Vibe row was read; both advisor files were read whole. The changelog's seven-runtime sentence is at `changelog/v1.1.0.0.md:59`.
Affected surface hints: `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`
Case: A reader asks where the Vibe prompt hook is documented; `README.md:244` sends them to `hooks/skill-advisor-hook.md` with a six-runtime list, and neither advisor file names the adapter the repository ships.

4. **The no-edit release bullet claims more than the gate does** -- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:44` -- The at-a-glance bullet says "A no-edit prompt gets no command it did not type", but `withholdWritingCommandsOnNoEdit` keeps every read-only command on a no-edit prompt (`fusion.ts:1227-1229`), and the gate's own test asserts that `/doctor:env list` survives the prompt "the trigger index lookup returns nothing for my packet, do not change anything" (`command-meaning-anchor.vitest.ts:435-449`). The correct claim is that no *writing* command survives unless it was typed. The body at `:122` states the narrower rule, so the summary and the body disagree.
Finding class: doc-claim-accuracy
Scope proof: The changelog bullet, the gated function, and its test were read at HEAD; the test's expected list is exactly `['command-doctor-env', 'system-spec-kit']`.
Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts`
Case: A prompt that asks for no change and happens to match a read-only command, such as the test's `command-doctor-env` phrase row, is still offered that command although the reader never typed it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | The review target is a spec folder whose docs area is repo-level skill documentation; no `spec.md` claims are being implemented by the nine scope files. The operative traceability check is each doc claim against HEAD code, recorded per finding above. |
| `checklist_evidence` | notApplicable | The packet root has no `checklist.md`; `review-brief-10.txt` and `review-scope-10.txt` are the operative checklist and both were read. |
| `skill_agent` | pass | `.skilled/skills/sk-doc/SKILL.md:29` names `/create:sk-skill` and `/create:skill-parent`; both resolve under `.skilled/commands/create/` (`sk-skill.md`, `skill-parent.md`). The merged ROUTER's three `/create:sk-skill` mentions agree with the same files. No command file answers to `/create:skill`. |
| `agent_cross_runtime` | notApplicable | The docs area names no agent body; the runtime-mirror question is covered under Integration Evidence instead. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the changed lines. |
| `playbook_capability` | notApplicable | No manual-testing-playbook claim is touched by the changed lines. |

## Integration Evidence

- **Doctor contract pair:** `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:240-242` is the consumer of the presentation sentence and the yaml input; the merged asset at `:78` no longer satisfies two of the three assertions. `.skilled/commands/doctor/assets/symlink-manifest.json` holds eight runtime keys, so the branch's surviving `doctor-install.yaml:46` DSH refusal is stale.
- **Advisor row count:** `command-bridges.generated.json` reports `counts.typescriptActive: 47`, matching `README.md:176` and the 47 `scorerRow: true` entries in `command-attach.ts:123-187`. The 57-key `COMMAND_ROWS` table includes ten non-scorer and alias rows, so the README's "47 command rows the TypeScript scorer serves" is exact.
- **Hook health:** `advisor-status.ts:487-509` includes `hookHealth` only when `lastRecordAt !== null`, and `metrics.ts:497` builds that section from the workspace diagnostics; this matches `SKILL.md:108` and `changelog/v1.1.0.0.md:69`. `MAX_HEALTH_RECORDS` is 30 and the diagnostic log trims at 200 records after 300 lines, matching the changelog's "newest 30" and "passes 300" statements.
- **Fresh-prompt path:** `score-command-transcripts.mjs:1759-1760` resolves `SKILL_ADVISOR_FRESH_PROMPTS_PATH` and defaults to `behaviour-fresh-prompts.jsonl` beside the script, matching `.env.example:411`.
- **Hook handler set:** `hooks/vibe/prompt-advisor.mjs` proxies the compiled Claude `user-prompt-submit.js`; Pi and DSH lazily import the same advisor module, so the changelog's "share one handler" claim for Claude, Codex, Cursor, Devin, Pi, DSH and Vibe is supported.
- **Vibe hook count:** `.vibe/hooks.toml` holds exactly 18 `[[hooks]]` entries, matching `changelog/v4.0.2.1.md:215`.
- **sk-doc merge:** `git diff e91faf28b8c^2 e91faf28b8c` adds the branch's version bump and three `/create:sk-skill` replacements; `git diff 5b2b062baef e91faf28b8c` adds main's rewritten sk-create-readme row. HEAD holds both, and the removed `assets/skill/skill-readme-template.md` is absent while the eight remaining skill templates exist.
- **ROUTER merge:** HEAD holds main's removal of the README-template asset from the intent model, resource map and step tree, and the branch's `/create:sk-skill` name in the prose, intent model and pseudocode. The parent-skill templates the step tree names all exist.
- **Routing-test merge:** `git diff e91faf28b8c^2 e91faf28b8c` adds the branch's holdout, fit-row and environment tests; `git diff 5b2b062baef e91faf28b8c` adds main's `capturePath` host-selection tests. HEAD imports both and the two blocks are independent; `capture-command-routing-baseline.mjs` exports `assertFitRowsUnique` and emits `plain_stages` and `fit`, so the merged tests read real fields.
- **v4.0.2.1 merge:** the merge adds 98 main-side lines and keeps the branch's 16 Vibe and rename lines; HEAD's Vibe section sits whole beside main's Node, dotenv and handover sections.

## Edge Cases

- Merge direction: `e91faf28b8c^2` is `2005499d504` (main) and `e91faf28b8c^1` is `5b2b062baef` (branch). A main-to-merge diff alone would show only what the merge added, so every merge file was also diffed branch-to-merge; only then is a dropped branch line visible.
- The doctor presentation has no `/create:` text at all, so its merge had nothing of the branch's rename to keep. Its defect is the test/asset pair, not a dropped command name.
- The presentation's "nine" is not an artifact of counting the phrase "the ones already there": the engine has no ninth runtime, and `dsh` is the eighth manifest key.
- The changelog's 185-file / 2121-test measurement and the routing-baseline percentages were not re-run. They are recorded measurements, not code claims; this iteration neither confirms nor refutes them.
- The brief's recorded limits were not re-reported: file-extension suffixes, the `node -e` redirect read, the macOS-only isolation check, underscore emphasis, and the two moved baseline rows are all untouched by this area.
- The `.env.example` file is a template whose comments say no reader loads it; the added line is inert, so the security lens found no reachable exposure in it.
- Open P2 items from `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` were not re-opened.

## Confirmed-Clean Surfaces

- **README row count:** 47 scorer rows at HEAD, matching the changed sentence and the generated counts.
- **README embedder paragraph:** the 0.72 cosine, 0.02 lead, no-edit and read-only sentences each match `commandMeaningEligible` and `rankCommandByMeaning` behaviour.
- **SKILL `hookHealth` sentence:** the section is conditional on a record existing and adds no prompt text; the claim holds.
- **`.env.example` line:** the variable name, scope and default all match the scorer.
- **Changelog rename section:** `command-create-sk-skill` is the current row id and `/create:sk-skill` its command; the old id appears only in the migration instructions.
- **sk-doc version authority:** `SKILL.md` 2.10.0.0, `description.json`, `mode-registry.json`, `hub-router.json` and `changelog/v2.10.0.0.md` agree.
- **sk-doc mode table:** fourteen packets and fifteen modes are listed consistently with the packet folders that exist.
- **Routing-test merge:** the merged test file's imports, helper definitions and both `describe` blocks are mutually consistent; no duplicate helper or missing import.
- **Vibe claims:** 18 hook entries and the eighth-runtime rank are correct at HEAD.

## Ruled Out

- **A dropped `/create:sk-skill` in the sk-doc merge:** all three ROUTER mentions and the SKILL mode-table row carry the new name, and no `/create:skill` token remains in either file.
- **A dropped main change in the sk-doc merge:** main's rewritten sk-create-readme row and its removal of the README template are both present; the template file is absent and every remaining asset the ROUTER names exists.
- **A stale `/create:skill` reachable from the docs:** no command file answers to the old name, and the docs only mention it as retired.
- **A broken `hookHealth` claim:** the field is absent with no record, present with one, and never carries prompt text.
- **A wrong command-row count:** the generated counts and the tracked table agree on 47.
- **A wrong fresh-prompt default:** the env var and default path match the scorer's own resolution.
- **A Vibe handler that does not share the advisor chain:** the adapter imports the compiled Claude handler, as Pi and DSH do.

## Next Focus

- Dimension: security and maintainability
- Focus area: the same nine files under the remaining two lenses, plus the changelog measurement claims and the merged presentation's step table
- Reason: correctness and traceability are swept; security has no reachable surface yet and maintainability still holds the stale DSH line, the duplicated runtime enumerations and the merge's future-reader cost
- Rotation status: correctness and traceability covered in iteration 1; security and maintainability not yet covered
- Required evidence: per-file read with one concrete input per candidate, and an aggregate-only check of any baseline number
- Recovery note: none

Review verdict: CONDITIONAL
