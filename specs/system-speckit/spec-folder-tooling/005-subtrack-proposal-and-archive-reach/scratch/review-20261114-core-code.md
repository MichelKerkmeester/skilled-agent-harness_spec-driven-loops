**Verdict: no data loss or corruption found, but two P1 defects in `relocate.mjs` and ten P2 items.** The happy path works with the real writers. The resume story is weaker than the handover says, and a phase renumber leaves the parent's phase map stale while exiting 0.

All runs were in a `mktemp` copy of the tooling, since deleted. The real checkout still shows only the two files from the other session. Paths below are under `.skilled/skills/system-spec-kit/runtime/cli/`.

## P1

**1. `spec/relocate.mjs:961-964`, with `:1122-1123` and `:1280`. A run that fails after the ledger step can never be resumed.**
- Defect: the work check does not count the redirect rebuild, the trigger index or the closing sweep and validation.
- Trigger: any `--map` or `--from/--to` apply where `cite-drift-scan` or `generate-trigger-index` fails. The tool prints "Rerun the same map to finish it".
- Result: the rerun skips those steps and exits 0, which the header at line 34 defines as "every step landed".
- CONFIRMED. First apply: `step ledger: ok (1 move(s))`, then `step redirect table (cite-drift-scan --rebuild-redirects): FAILED exit 1`, exit 2. Same command again: `moves=0 moved=1 rewrites=0 identity=0 roots=0 ledger=0`, `relocate: nothing to do`, exit 0.

**2. `spec/relocate.mjs:566-577`. Renumbering or re-parenting a phase leaves the parent's phase map naming a folder that is gone.**
- Defect: only full ids and markdown links are rewritten. The Phase Documentation Map and handoff table name siblings by bare folder name.
- Trigger: `relocate.mjs --renumber <phase parent> --apply` on a `create.sh --phase` scaffold after one phase was removed.
- Result: the run exits 0 and strict recursive validation passes, so nothing flags it. This contradicts decision D3, "no hand edits".
- CONFIRMED. Output: `move specs/omega/core/003-phased-thing/003-gamma -> .../002-gamma`, `close validate ...: RESULT: PASSED`, exit 0. Afterwards `spec.md:102` still reads `| 3 | 003-gamma/ |` and `:116` still reads `| 002-beta | 003-gamma |`. `validate.sh --strict --recursive` printed `RESULT: PASSED` for each folder.

## P2: resume and state detection

**3. `spec/relocate.mjs:1252-1268`. A move step interrupted halfway cannot be resumed with the same map.**
- Trigger: a two-entry map where one folder is already moved and uncommitted. I simulated this with one manual `git mv`.
- Result: the dirty-tree check refuses the tool's own half-finished output.
- CONFIRMED. `relocate: refused: specs/eps/sub/001-a/description.json: has uncommitted changes and would be rewritten`, exit 2.

**4. `spec/relocate.mjs:780-803`. A failed `migrate-generated-json` step is not retried when the folder keeps its name.**
- Trigger: a move into a sub-track where the migrate step fails once. The stale check does not read `parentChain`.
- Result: the rerun reports `identity=0`, skips the step and leaves `description.json` unmigrated.
- CONFIRMED. Run 1: `step description identity (migrate-generated-json --only): FAILED`, exit 2. Run 2 printed no such step, and `specs/delta/sub/001-a/description.json` still held `"parentChain": []`.

**5. `spec/relocate.mjs:474-477`. A missing source with an existing destination is read as "already moved".**
- Trigger: `--from zeta/999-typo --to zeta/001-a`, where the source never existed.
- Result: the plan would record a move that never happened in the relocation ledger, which feeds the redirect table.
- CONFIRMED on a dry run. `moved specs/zeta/999-typo -> specs/zeta/001-a (already at its destination)`, `ledger ... record 1 move(s)`, exit 1.

## P2: archive and numbering

**6. `spec/archive.sh:392-395`. A renumbering restore reports failure after it has fully succeeded.**
- Trigger: `archive.sh --restore` onto a taken number, for a packet that fails strict validation for its own reasons.
- Result: every relocate step lands, then the script prints "Restore did not finish" and exits 1.
- CONFIRMED. Ten `step ...: ok` lines, `close validate specs/zeta/005-old: RESULT: FAILED`, `ERROR: Restore did not finish`, exit 1, with `005-old` live and listed in the track. One of six real archived packets I sampled fails strict (`specs/sk-doc/z_archive/006-sk-doc-agent-template-alignment`).

**7. `spec/archive.sh:658-716`. Restoring a track-level archived packet into a grouped track creates a mixed track.**
- Trigger: apply a whole-track map, then restore a packet left in the track's own `z_archive/`.
- Result: the restore succeeds and the next sweep fails, against decision D2.
- CONFIRMED. `SUCCESS: Restored: ... -> .../specs/delta/009-old`, exit 0. Then `sweep-track-roots.mjs`: `flat packets beside sub-tracks: 009-old`, exit 1.

**8. `spec/archive.sh:361-397`. A renumbering restore leaves references written before the archive dangling.**
- Trigger: another packet names `zeta/001-old`, the id the packet had before it was archived.
- Result: only the `z_archive` spelling is rewritten.
- CONFIRMED. After the restore the referring file read ``See `specs/zeta/005-old/spec.md` and the earlier id zeta/001-old.``

**9. `spec/create.sh:1808-1821`. Phase numbering ignores the parent's `z_archive`.**
- Trigger: archive the highest phase, then append a phase with `--phase --parent`.
- Result: the new phase reuses the archived number, against decision D4. The phase 003 requirement only named track depth.
- CONFIRMED. `ls` showed live `002-delta` beside `z_archive/002-gamma`, create exit 0.

## P2: tests and minor

**10. `tests/relocate.vitest.ts:60-66` and `tests/archive-track.vitest.ts:130-136`. The suites stub every writer relocate drives.**
- The stubs cover `repair-derived`, migrate, validate, sweep, the trigger index and cite-drift.
- The assertions on `specFolder` and `packet_id` pass from text substitution alone, so no automated test exercises the real pipeline or any resume path.
- INFERRED from reading. Deleting the migrate call from `relocate.mjs` and seeing the suite stay green would confirm it.

**11. `retrieval/rg-wrapper.mjs:377-382`. The path recipe's `--json` output carries no archived label.**
- `paths` stays an array of plain strings, while results and counts get an `archived` field.
- INFERRED from reading.

**12. `spec/suggest-subtracks.mjs:177-181` and `:236-268`. Two inputs yield a map the relocate preflight refuses.**
- One is a proposed group name that matches an existing undeclared folder in the track.
- The other is a packet named `NNN_slug`.
- INFERRED from reading both name rules. Not run.

## The three handover claims

1. **Suite numbers.** The eight files pass: `Test Files 8 passed (8)`, `Tests 149 passed (149)`, exit 0, 30.7 s.
   - `./node_modules/.bin/vitest` does not exist in `runtime/cli`. I ran `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli <files>`.
   - The recorded outputs match the claim: 211 files and 2558 tests in `final-npm-test.txt`, 2567 in `post-review-npm-test.txt`. I did not rerun the full suite.
2. **Renumber resume limit.** Confirmed: after a stop at the repair step, the rerun printed `relocate: no moves to make; nothing to do`, exit 0. It is one of four resume gaps, with findings 1, 3 and 4.
3. **Criterion 4.** Reproduced: `specs/demo/008-next-one` was created beside `001-a` and `z_archive/007-b`. I did not capture that run's exit status. Later `create.sh` runs in the same setup exited 0.

## Checked and found sound

- **Goal criterion 1 with the real writers:** dry run exit 1, apply exit 0 with both packets `RESULT: PASSED`, second apply exit 0. `parentChain`, `parent_id`, the track's children list and the sweep were all correct.
- **Chained renumber** (003 to 002, 004 to 003) plans and moves correctly.
- **Resume after a newly declared sub-track** refreshes both root levels.
- **Moving a phase child between parents** updates both `children_ids` lists and the child's `parent_id`.
- **A renumbering restore** lands above the highest archived number (005 past archived 004).

The diffs to `folder-discovery.ts` and `orchestrator.ts` are comments only, and `spec-gate-core.mjs` changes three strings.

## Not checked

- I did not rerun the full CLI suite or goal criteria 3, 5 and 7, and I did not run `spec-gate-core.test.mjs`.
- `validate.sh --include-archive` was judged from its diff and its passing test file only.
- No relocate run touched the real tree, as instructed.
- My fixtures were hand-made packets and `create.sh` scaffolds. Two "stale dist" failures came from my copy, not the code. Findings 1 and 4 used late-step failures I induced or that came from my partial copy. The resume behaviour after them is the tool's own.
- Review standards: I loaded the review mode's `SKILL.md` and its resolver (surface SKILLED, one TODO-format override, not relevant here). I did not open `review-core.md` or the checklists.

Not checked: full 211-file suite, goal criteria 3, 5 and 7, spec-gate-core.test.mjs and review-core.md were not run or read. The eight named files and the scenarios above were.

Review status: REQUESTED_CHANGES
EXIT=0
