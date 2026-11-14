**Verdict: CONDITIONAL** — one P1 in `relocate.mjs`, eight P2, no P0. All twelve review findings are closed in code for the case each one named.

I did not rerun any vitest suite or `validate.sh`, so every test count below is the packet's recorded number, not mine. I ran two `relocate.mjs` dry runs on the real tree (both read-only). Paths are under `.skilled/skills/system-spec-kit/runtime/cli/` unless they start with `specs/`.

## Findings

**1. [P1] `spec/relocate.mjs:779` — a re-parented phase whose run stops after the move never gets its phase rows fixed on the rerun.**
- Case: `relocate.mjs --from <parentA>/003-x --to <parentB>/004-x --apply` stops after the `move` step (a `git mv` failure on a later entry, the `changed after planning` throw at `:1586-1588`, or a kill), then the same command is rerun.
- Evidence: `phaseRowEdits` plans rows only for `state === 'pending'` entries. On the rerun the entry is `done`, and `bareNameEdits` skips re-parents at `:691`, so nothing plans the row edits.
- Result: the old parent keeps its map, handoff and binding rows for a folder that is gone, the new parent gets none, and the rerun ends as finished.
- Why P1: the tool prints "Rerun the same map to finish it" (`:1805`) and `spec/README.md:120` promises "rerunning a map that stopped part-way finishes it". It is the same stale-map class as original finding 2.
- Confidence: from reading only, not executed. A re-parent case in `tests/relocate.vitest.ts` that fails the rewrite step once would confirm it; the existing cases at `:393` and `:430` cover only a clean run. Phase 007's `spec.md:41` scopes out "resume logic", so this fell between 006 and 007.

**2. [P2] `spec/relocate.mjs:1659-1666` — exit 3 also covers a validator that never ran.**
- Any non-zero `validate.sh`, including one that prints no `RESULT` line, sets status 3. `archive.sh:437-440` then reports `Restored:` and exits 0.
- Fix direction: return 3 only when a `RESULT: FAILED` line was read.

**3. [P2] `spec/archive.sh:381` — restores into a flat top-level track now pay a full relocate dry run.**
- Measured on this tree: a full, non-refused relocate dry run (a `z_archive` → sub-track move) took 27 s; the refused case took 0.05 s. A restore that is not refused pays that full plan build.
- Only the preflight verdict is read, so the plan build is wasted work.

**4. [P2] `spec/relocate.mjs:980-983` — the bare-name pass can rewrite a different packet's name.**
- The lookbehind allows `/`, so `other-track/003-gamma` written in the phase parent's `spec.md`, `goal.md` or a child's `spec.md` becomes `other-track/002-gamma` when the local `003-gamma` is renumbered.
- The case at `tests/relocate.vitest.ts:354` covers a second parent's own documents, not a foreign mention inside this parent's.

**5. [P2] `spec/relocate.mjs:534-536`, `:1301-1305` — an untracked packet stopped before the ledger step cannot be resumed by rerun.**
- Neither the ledger nor git records the move, so the rerun refuses and asks for a manual move back.
- This is intended (006 `tasks.md` T001) but missing from 006's Known Limitations, and `spec/README.md:120` still promises the rerun finishes.

**6. [P2] `spec/relocate.mjs:476-481` — the case-fold probe reads true when the specs folder name has no lowercase letter.**
- The flipped spelling then equals the original, so a case-sensitive volume would be treated as folding. The default `specs` is unaffected.

**7. [P2] Phase docs — each `tasks.md` still names evidence files that were never written.**
- Missing: `reproduce.txt` and `after.txt` in 006, 007 and 008; `bare-name-places.txt` in 007; `timing.txt` and `writer-inputs.txt` in 010.
- Each Evidence cell records the deviation honestly and points at `build-evidence.md`, so nothing is claimed falsely; the Verify commands simply cannot be rerun as written.
- No child has `acceptance-criteria.md`; they are Level 1 (`006-*/spec.md:22`), so none is required.

**8. [P2] `goal-file-manifest.txt` — the scope leaves out phase 009's whole routing change.**
- `.skilled/skills/system-spec-kit/graph-metadata.json` holds the hand-edited signal ("find" → "quote a phrase in archived spec packets"), and `scorer-eval-baseline.json` holds the accepted 161 → 160 drop (commit `0701a31ae5`, decision Q014).
- Both fall under the "generated JSON left out" header, so the review loop cannot judge B7 or B8.
- `deep-review-config.json` does not reference the manifest, so the 74-path scope reaches the loop only if the prompt carries it.
- Also absent, reasonably: `sk-doc/shared/scripts/relocation-ledger.json`, the trigger-index fixtures, and `baseline-contexts.json`.

**9. [P2] `specs/.../005-subtrack-proposal-and-archive-reach/decision-record.md:13` — the continuity line is stale.**
- It says "Q010 to Q013" while Q014 and Q015 are in the file (`:50-51`, `:272`, `:281`).

## Claims checked and found true

- Finding 1 (late steps): closed at `spec/relocate.mjs:1463`, `:1472`, `:1634-1636`, `:1651`; the real-pipeline case at `tests/relocate-real-pipeline.vitest.ts:151` asserts it.
- Finding 2 (renumber leaves a stale name): closed at `spec/relocate.mjs:680-705` and `:1093-1098`. The Phase column number staying old is declared in 007's `spec.md:97` and its Known Limitations.
- Finding 3 (half-finished move refused as dirty): closed at `spec/relocate.mjs:1785-1790`.
- Finding 4 (migrate step not retried): closed by the `parentChain` check in `staleIdentity`, asserted at `tests/relocate-real-pipeline.vitest.ts:175`.
- Finding 5 (missing source read as moved): closed at `spec/relocate.mjs:534-536`.
- Finding 6 (restore reported failed after success): closed at `spec/relocate.mjs:1661` and `spec/archive.sh:435-445`.
- Finding 7 (restore creates a mixed track): closed at `spec/archive.sh:362-396` and `:745`. I ran the dry run for `sk-doc/z_archive/001-sk-doc-rename`: it printed "would hold flat packets", exit 2.
- Finding 8 (pre-archive id left dangling): closed at `spec/relocate.mjs:659-672` and wired into the id map in `buildTransform`.
- Finding 9 (phase numbering ignores the archive): closed at `spec/create.sh:1811-1829`; the predecessor stays on a live phase.
- Finding 10 (stubbed writers): closed by `tests/relocate-real-pipeline.vitest.ts`, which drives the real writers and guards the checkout; `010-*/scratch/mutation.txt` records the suite failing with the migrate call removed.
- Finding 11 (no archived label on path hits): closed at `retrieval/rg-wrapper.mjs:382`; `paths` is unchanged.
- Finding 12 (proposed map refused by preflight): closed at `spec/suggest-subtracks.mjs:43`, `:293`, and `nameGroups`; the name rule matches `spec/relocate.mjs:87` exactly.
- A chained renumber cannot double-rewrite a bare name, because the preflight refuses a destination that is another entry's source (`spec/relocate.mjs:561`).
- `archive.sh` is the only non-test caller of `relocate.mjs`, as 008's summary says.
- Exit status 3 is stated in the script header and in `spec/README.md:120`, and the amendment to phase 001 is recorded in the parent `spec.md:100`.
- Case counts agree between commit messages and summaries: 006 adds 11, 007 adds 6, 008 adds 9, 009 adds 4, 010 adds 4.
- All six code commits are on `origin/main`, and the source files at HEAD match them; only two unrelated test files changed since.
- Every one of the 74 manifest paths exists, and every non-JSON file the remediation commits and the five earlier feature commits changed outside `specs/` is in it.
- Q010 to Q015 are all present in `decision-record.md`, and B8 is recorded as an accepted miss in 009's summary and Q014.
- All tasks in 006 to 010 are ticked, and every child `spec.md` I checked (006 to 009) reads Complete.

Not checked: suite reruns, `validate.sh` on any folder, the earlier phases 001 to 005, the second review file (`review-20261114-merge-fixes-and-hub-vocabulary.md`), and the `review/` folder beyond its config. `graph-metadata.json` in the spec folder changed on disk during this session (status to `complete`); that was another process, not one of my commands.

REVIEW_DONE
