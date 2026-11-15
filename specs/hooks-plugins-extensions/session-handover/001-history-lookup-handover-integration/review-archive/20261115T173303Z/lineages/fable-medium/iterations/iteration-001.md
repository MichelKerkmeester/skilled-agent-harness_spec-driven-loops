# Iteration 001 - all four dimensions, one pass

## Dispatcher

- Lineage: `fable-medium`, session `fanout-fable-medium-1794748073879-re9m5r`, generation 1, lineage mode `new`.
- Resolved route: mode=review target_agent=deep-review. This process ran the iteration inline. No nested dispatch.
- Iteration 1 of 1 (`stopPolicy: max-iterations`). The state log held zero iteration rows before this one, so the derived number matches the dispatched one.
- `steer.md`: not present in the lineage directory at init or before this iteration.

## Dimension

Correctness, security, traceability and maintainability in one pass, because the cap is one iteration.

**Operator review focus and how this iteration addressed it.** The focus names nine commits, one changelog section and three files the phase docs do not list. Each commit was inspected with `git show`:

| Commit | What was read |
|---|---|
| 198162c7f11 | `bin/history-lookup.mjs`, `history.ts`, `lookup-offer.ts`, the entry test |
| 7973b80ab0b | `mintHandoverLocator` in `relaunch-core.cjs`, the `prepare` call, the schema enum |
| 50c5472789e | `handoverLookupSection`, `sameCheckout`, the `claim` call, `handoff.md` receiver steps |
| de26d18cbdf | `recordsFromEntries` in the Claude reader and its new test |
| 8cd3fa79da9 | The Vibe detector diff in full, the stat of the other adapters, leftover-reference search |
| f320d9d9bcd | `compaction-adapters.vitest.ts`, the changelog hunk, the phase 006 summary, the run results |
| 4cb3db7a787 | The one-line comment change in `cli.ts` |
| cede6d301ab | The sub-track `description.json` and `graph-metadata.json` |
| 70c47ad5e00 | The move stat, the parent and child `graph-metadata.json` links |

The changelog section "A Claimed Note Offers the Sender's History" was read at `.skilled/changelog/skilled/v4.0.2.1.md:163-169`. The three unlisted files were read: `claude.mjs` (the changed function and its callers' contract), the Vibe `compaction-context.mjs` (whole diff plus a leftover search) and `compaction-adapters.vitest.ts` (header and every case name). No commit outside the nine was reviewed.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:685-694`, `:798-821`, `:854-995`, `:1637-1656`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:603-607`, `:712-724`
- `.skilled/hooks/session-handover/bin/history-lookup.mjs:1-34`
- `.skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs` (whole file, from the commit)
- `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` (case names at 497-560 and 3410-3476, environment setup lines)
- `.skilled/hooks/shared/session-readers/claude.mjs:139-175`, `:205-250`
- `.skilled/hooks/shared/tests/session-readers/claude.test.mjs` (the new case)
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (commit diff, remaining references)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:1-145`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/locator-digest.ts` (whole file)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:150-470`, `:513-567`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/history.ts:330-336`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:228-325`
- `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts:1-75` and all case names
- `.skilled/commands/speckit/handoff.md:218-228`
- `.skilled/changelog/skilled/v4.0.2.1.md:163-169`
- `.skilled/hooks/session-handover/README.md:197`
- Packet docs: parent `spec.md`, `003-mint-locator-at-prepare/spec.md`, the implementation summaries of phases 004, 005 and 006, the run results under `001-hop-recall-baseline/scratch/runs/`
- `specs/hooks-plugins-extensions/session-handover/description.json`, `graph-metadata.json`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The mint and the lookup command look for a Claude transcript in different places when `CLAUDE_CONFIG_DIR` is set** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:687` -- `claudeSessionLogPath` reads the transcript from `$CLAUDE_CONFIG_DIR/projects` and the mint hashes that path into the handle (`relaunch-core.cjs:914`). The lookup command resolves the store as `join(environment.home, '.claude', 'projects')` (`cli.ts:289`, home from `homedir()` at `cli.ts:513`) and the reader does the same (`claude.mjs:38`). Neither reads `CLAUDE_CONFIG_DIR`. The claim then prints a section whose command finds no transcript and refuses. The handover suite itself runs with `CLAUDE_CONFIG_DIR` set (`session-handover-cli.test.cjs:2542`), so its claim cases prove that the section prints, not that it redeems. A second difference sits in the same function: the mint takes the first project folder that holds the id, while the command refuses with `session_ambiguous` when two folders hold it (`cli.ts:400`).
   Case: a sender started with `CLAUDE_CONFIG_DIR=/elsewhere`, then a claim in the same checkout. The section prints and its command answers `session_not_found`.
   Finding class: producer-verifier-drift
   Scope proof: confirmed by reading both resolvers; not run. The refusal is fail-closed, which is why this stays P2. It becomes P1 if `CLAUDE_CONFIG_DIR` is a supported setup for the lookup.
   Affected surface hints: `relaunch-core.cjs` `claudeSessionLogPath` and `mintHandoverLocator`; `cli.ts` `storeRootFor`; `claude.mjs` store root; a claim test that redeems through the entry.

2. **A claim mints a locator for whatever session id the note names, without proving that session ran in the note's folder** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:984` -- `handoverLookupSection` takes `session_id`, `runtime` and `cwd` from the note's frontmatter. `claudeSessionLogPath` searches every project folder for the id (`relaunch-core.cjs:689-692`), and the only checkout test compares the note's `cwd` with the receiver's (`relaunch-core.cjs:988`). The command side does not close the gap: it also lists every project folder (`cli.ts:250-262`) and the reader checks containment in the store and the recorded id only (`claude.mjs:219`, `:250`). Before this packet the transcript path came from the host's hook payload. Now it comes from a file in the repository.
   Case: a note whose `session_id` is a session from another project on the same machine and whose `cwd` is the receiver's checkout. The claim prints the section and the command reads that other project's transcript.
   Finding class: trust-boundary
   Scope proof: confirmed by reading the mint, the command and the reader. The reach needs someone who can write a note and knows a session id, which is a random UUID, so this is hardening and stays P2.
   Affected surface hints: `relaunch-core.cjs` `mintHandoverLocator`; a check that the transcript's project key matches the note's folder; a claim test with a foreign session id.

3. **The locator `prepare` stores has no reader** -- `.skilled/hooks/session-handover/bin/session-handover.cjs:606` -- `prepare` mints and stores a locator, and `claim` always mints again (`relaunch-core.cjs:984`) and overwrites it. No code path prints or redeems the one `prepare` stored, and when the claim mint fails the section is withheld rather than falling back to it. The phase 003 spec says the stored locator is there "so a later claim can redeem it" (`003-mint-locator-at-prepare/spec.md:38`), and the phase 004 summary records that one function now covers both cases (`004-offer-lookup-at-claim/implementation-summary.md:80`). Each `prepare` therefore lists every Claude project folder and writes hook state for nothing.
   Case: any `prepare` by a Claude or Codex sender. The stored locator is replaced at claim and never read in between.
   Finding class: dead-write
   Scope proof: inferred from a search of the two callers and the claim path; a search for any other reader of a `handover` locator would confirm it.
   Affected surface hints: `session-handover.cjs` `prepare`; `003-mint-locator-at-prepare/spec.md`; the three `prepare` locator tests; the session handover README sentence that `prepare` stores a locator.

4. **The lookup stops working 30 minutes after the claim, with no way to renew it, and the changelog and the receiver step do not say so** -- `.skilled/changelog/skilled/v4.0.2.1.md:165` -- The command refuses a locator older than 30 minutes (`cli.ts:37`, `:216`). A claim is the only mint the receiver gets, and a claimed note cannot be claimed again (`relaunch-core.cjs:1644`). The README states the window (`.skilled/hooks/session-handover/README.md:197`). The changelog section and receiver step 3 (`.skilled/commands/speckit/handoff.md:221`) tell the receiver to run the command for a missing detail and name no limit. The live proof asked its question right after the claim, so it never met the limit.
   Case: a receiver that works for 45 minutes and then needs a detail the note left out. The printed command answers `locator_stale` and nothing mints a new one.
   Finding class: undocumented-limit
   Scope proof: confirmed by reading the freshness check and the claim guard; the wording gap is confirmed by reading both documents.
   Affected surface hints: the changelog section; `handoff.md` receiver step 3; the sentence the claim prints after the section; a renewal path for a claimed note, if one is wanted.

5. **The entry reports a broken build as a bad operation** -- `.skilled/hooks/session-handover/bin/history-lookup.mjs:32` -- The entry catches every failure of the import and of the run and prints `{"ok":false,"code":"operation_invalid"}`. `lookupRunsFrom` only checks that the compiled core file exists (`lookup-offer.ts:97-101`), so a core that exists but cannot load reaches this branch. The code it prints is the one the command uses for malformed operation arguments (`cli.ts:349-351`).
   Case: `dist/hooks/lib/history/cli.js` exists but one of its imports is missing after a partial build. The model is told its arguments are wrong and retries with other arguments.
   Finding class: misleading-error
   Scope proof: confirmed by reading the entry and the offer guard; not run against a broken build.
   Affected surface hints: `history-lookup.mjs` catch branch; the refusal code list in `cli.ts`; the entry test.

## Traceability Checks

- `spec_code` (core): **pass with notes.** The parent spec's phase map matches the code: the entry under the handover concern, the `handover` provenance source, the mint at `prepare`, the section at `claim`, the removed compaction offer. Finding 3 is the one place the phase 003 purpose and the phase 004 code no longer agree.
- `checklist_evidence` (core): **partial.** The "3 of 3" claim matches the phase 006 summary and the seven `lookup-after` run folders exist. Test counts in the summaries (984, 1610, 102) were not rerun: this lineage may not run the suites.
- `skill_agent` (overlay): not applicable. No agent contract changed.
- `agent_cross_runtime` (overlay): **partial.** Claude and Codex senders get the section. Codex is covered by unit tests only, which the phase 006 summary states and the changelog does not.
- `feature_catalog_code` (overlay): not checked in depth. The catalog and playbook pages changed in f320d9d9bcd were not read line by line.
- `playbook_capability` (overlay): not checked in depth, same reason.

## Integration Evidence

- `/speckit:handoff` command doc, `.skilled/commands/speckit/handoff.md:218-228`: receiver step 3 names the `## History Lookup` section and renumbers the later steps consistently.
- Sub-track metadata: `specs/hooks-plugins-extensions/session-handover/graph-metadata.json` lists the packet as its one child, the track root lists the sub-track, and the packet lists all six phase children under the new path.
- Removed OpenCode plugin: no reference to `session-history-lookup` remains outside `specs/` history, and no source file still imports a compaction mint.

## Edge Cases

- One iteration covers four dimensions, so depth was traded for breadth. The catalog, playbook, README and trigger-index changes in f320d9d9bcd got a stat-level read only.
- Nothing was executed against the target. Every finding rests on reading both sides of a contract, and each says whether it is confirmed or inferred.
- The compaction removal across the Claude, Pi, DSH and Devin adapters was read as a stat plus a leftover search, not hunk by hunk. The Vibe adapter was read in full because the focus names it.
- Workflow conflicts recorded for the dispatcher: the coverage graph steps (`upsert.cjs`), the continuity save (`generate-context.js`) and `step_stage_artifact_dir` are not run, because each writes outside the lineage directory or is a git write.
- Tool budget: the config allows 24 calls per iteration. Init and this iteration together used about that many before the writes, so analysis stopped here.

## Confirmed-Clean Surfaces

- **Claude reader, split messages** (`claude.mjs:139-175`): consecutive lines of one message id join into one turn. A user record between them closes the message, so an interleaved call-result-call order still reads as answered turns. Empty assistant lines and skipped sidechain lines do not disturb the open message.
- **Shell safety of the printed command** (`lookup-offer.ts:53-75`, `hook-state.ts:290-296`): the session id and handle are single-quoted, the schema rejects separators, `..` and control characters, and `claudeSessionLogPath` accepts only `[A-Za-z0-9._-]`.
- **Fail-open at `prepare` and `claim`** (`session-handover.cjs:603-607`, `:712-724`): both calls sit in a `try` with an empty `catch`, and both core functions also return `null` on any error.
- **Working folder handling** (`locator-digest.ts:66-97`): the temporary `chdir` is synchronous and restored in `finally`.
- **Vibe detector** (`compaction-context.mjs`): the history imports, constants, the `now` option and the section are gone together. `transcriptPath`, `isAbsolute` and `payload.cwd` are still used by the journal and watermark code.
- **Restored adapter suite** (`compaction-adapters.vitest.ts`): twelve cases, matching the phase 006 summary, each adapter with one case that asserts no lookup section.
- **Paging detection** (`history.ts:330-336`): the pattern matches both the new entry and the old compiled path.
- **Changelog numbers** (`v4.0.2.1.md:165`): "six of six" and "three of three" match the phase 005 and 006 summaries.

## Ruled Out

- The test file's own state-path helper mirroring the hook-state hashing: a change to the real scheme fails the positive cases loudly, so it is not a silent gap.
- A turn id lost by the reader merge: later lines of one message drop their own ids, and nothing in the lookup hands out an id before the merge.
- A stale `v4.0.2.2.md`: the file added in f320d9d9bcd no longer exists, and its text lives in the `v4.0.2.1.md` section.
- Missing child `description.json` files after the move: all six children carry one.

## Verdict

PASS with advisories. No P0 or P1. Five P2 findings: one correctness, one security, one traceability, two maintainability.

## Next Focus

- Dimension: none scheduled. The iteration cap is reached and the loop goes to synthesis.
- Focus area if the review is reopened: run finding 1 against a sandbox with `CLAUDE_CONFIG_DIR` set, and read the catalog, playbook and README changes of f320d9d9bcd line by line.
- Reason: finding 1 is the only one whose severity depends on a fact this pass could not run.
- Rotation status: all four dimensions touched once.
- Blocked or productive carry-forward: reading both the producer and the verifier of the locator was productive and found findings 1 and 2.
- Required evidence: a claim-then-redeem run through `bin/history-lookup.mjs`.

Review verdict: PASS
