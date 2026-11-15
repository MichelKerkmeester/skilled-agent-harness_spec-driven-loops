# Iteration 5: Standards Alignment for the Code, the Docs and the Record

## Focus

The same tree read against the standards it claims to meet: the sk-code-skilled surface checklist
over the hook sources (`universal-checklist.md` items on DRY, named constants and file headers) and
the sk-doc document standards over the concern's README, the environment reference and the packet
record that this research feeds.

## Actions Taken

1. Read the sk-code-skilled surface map and the universal checklist's priority sections
   (P0 file header and section invariant, P1 WHY comments, magic values, KISS/DRY/SOLID).
2. Read the session-relaunch README's test and directory sections against the folder itself.
3. Compared the concern's README frontmatter against every sibling hook README and its own tests
   README.
4. Read the `SKILLED_LOOP_*` and `SESSION_RELAUNCH_*` rows in the environment reference against the
   variables the wrapper exports and the readers consume.
5. Compared the `010-post-fix-research` packet's Branch field and placeholder text against its
   predecessor and its parent.

## Findings

1. **The README's test command omits the conformance suite, so the documented verification runs
   28 of the 66 cross-adapter cases.** Section 7 lists nine files
   (`[SOURCE: .skilled/hooks/session-relaunch/README.md:195]`) and leaves out
   `tests/adapter-conformance.test.cjs`, which is the only file that runs one case table through
   four adapters. Section 8's tree then says "tests/ nine Node test files plus payload fixtures"
   (`[SOURCE: .skilled/hooks/session-relaunch/README.md:235]`) while the folder holds ten. An
   operator following the README gets a green run that never exercises the table the concern's own
   test README calls its drift guard
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:46]`). This is the same omission
   phase 009 fixed for the OpenCode plugin suite in `tests/README.md`, repeated for the
   conformance file in the parent README. Fix: add the file to the command and change "nine" to
   "ten"; better, replace the file list with the glob `tests/*.test.cjs` so the next suite cannot
   be forgotten.

2. **The concern's README carries no frontmatter while every sibling hook README and its own tests
   README do.** `.skilled/hooks/session-relaunch/README.md` opens directly with its H1
   (`[SOURCE: .skilled/hooks/session-relaunch/README.md:1]`), whereas
   `.skilled/hooks/session-relaunch/tests/README.md` opens with a `title`/`description`/
   `trigger_phrases`/`version` block
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:1]`) and the twenty other
   `.skilled/hooks/*/README.md` files do the same. The block is what the trigger index reads, so
   the concern's main orientation page is invisible to keyed retrieval while its test page is
   found. Fix: add the four-field block, using the tests README's shape and phrases such as
   "session relaunch", "skilled loop wrapper" and "handoff note".

3. **The environment reference documents every caller-facing switch and no `SKILLED_LOOP_*`
   variable at all.** Rows exist for `SESSION_RELAUNCH_THRESHOLD` through
   `SESSION_RELAUNCH_REPO_ROOT`
   (`[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:108]`), for
   `SYSTEM_SPEC_FOLDER` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113]`)
   and for `CLAUDE_PID` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:114]`),
   including the phase 009 addition. Nothing documents the family the wrapper exports
   (`[SOURCE: .skilled/bin/skilled-loop:393]` exports the template, `:395` the id, `:396` the
   runtime, `:397` the hop count) or the ones it reads for the first launch
   (`SKILLED_LOOP_NAME` at `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:427]`,
   `SKILLED_LOOP_HOPS` at `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:394]`).
   These are the variables that answer "am I inside a loop", which every arm path branches on, so
   the one reference a reader is sent to is silent about them. Fix: one row per variable with the
   exporter named as the source, as the `CLAUDE_PID` row already does.

4. **The bounded process-table read is implemented three times with the same literal bound.** The
   core owns it once, with the reasoning in a comment, as
   `spawnSync('ps', ['-A', '-o', 'pid=,ppid='], { timeout: 2000 })`
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:772]`). The killer repeats the
   same call with the same argument vector and the same literal
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:188]`), and the CLI repeats it a third
   time with `comm` added (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:214]`).
   The three copies also disagree on failure: the core returns null so the hook can defer, while
   `isLoopAncestor` throws so the killer aborts. Against the universal checklist's "magic values
   are extracted to named constants"
   (`[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:193]`)
   and "DRY: repeated rules/constants consolidated"
   (`[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:210]`),
   the bound is a magic value and the read is a repeated rule. Fix: give
   `core.readProcessTable({ withCommand = false, timeoutMs = PROCESS_TABLE_TIMEOUT_MS })` the
   optional command column, have the CLI parse it through a shared parent map, and let the killer
   keep its throwing contract by translating the null the shared reader returns.

5. **The packet this research feeds names a branch its predecessor and its parent no longer use,
   and still carries scaffold placeholders.** `010-post-fix-research/spec.md` records
   `scaffold/010-post-fix-research`
   (`[SOURCE: specs/hooks/023-session-relaunch-loop/010-post-fix-research/spec.md:25]`) where the
   parent names `worktrees/148-session-relaunch-deep-review`
   (`[SOURCE: specs/hooks/023-session-relaunch-loop/spec.md:34]`) and the direct predecessor names
   the same worktree
   (`[SOURCE: specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation/spec.md:26]`).
   The same file keeps template text in `description`
   (`[SOURCE: specs/hooks/023-session-relaunch-loop/010-post-fix-research/spec.md:3]`), in Problem
   and Purpose, in Scope, and as `REQ-001` through `REQ-002`, which is what the strict validator's
   placeholder rule rejects. This is the L4 class phase 009 fixed at the parent, recreated one
   level down by the scaffold. Fix: set the Branch field to the parent's worktree, and author the
   Problem, Purpose, Scope and requirement rows from this run's synthesis before the packet goes
   through `validate.sh --strict`.

## Ruled Out

- Reporting the `opencode/session-relaunch.js` browsability symlink: its target
  (`../../../plugins/session-relaunch.js`) resolves to `.opencode/plugins/session-relaunch.js` and
  the README documents exactly that, so the two agree.
- Reporting the README's numbered ALL-CAPS section headers: sections 1 through 9 all follow
  `## N. NAME`, which the universal checklist's section invariant asks for
  (`[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:93]`),
  and every source file's module banner and numbered section banners match the style guide.

## Dead Ends

- Auditing comment density or line length across the hook sources: the files sit inside both
  bounds, and neither item is P0 or P1, so nothing there would change an outcome.

## Edge Cases

- Ambiguous input: "the packet records" could mean this packet's own docs or the parent's. Read
  both, reported only the child-to-parent disagreement.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: finding 1's consequence — 28 of 66 cases — is a count of the table's rows
  (4 adapters times 7 cases) against the ten files the folder holds, not a run.

## Sources Consulted

- `.skilled/hooks/session-relaunch/README.md:1`
- `.skilled/hooks/session-relaunch/README.md:195`
- `.skilled/hooks/session-relaunch/README.md:235`
- `.skilled/hooks/session-relaunch/tests/README.md:1`
- `.skilled/hooks/session-relaunch/tests/README.md:46`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:108`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:114`
- `.skilled/bin/skilled-loop:393`
- `.skilled/bin/skilled-loop:395`
- `.skilled/bin/skilled-loop:396`
- `.skilled/bin/skilled-loop:397`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:394`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:427`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:772`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:188`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:214`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:93`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:193`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:210`
- `specs/hooks/023-session-relaunch-loop/010-post-fix-research/spec.md:3`
- `specs/hooks/023-session-relaunch-loop/010-post-fix-research/spec.md:25`
- `specs/hooks/023-session-relaunch-loop/spec.md:34`
- `specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation/spec.md:26`

## Assessment

- New information ratio: 0.8
- Questions addressed: sk-code-skilled and sk-doc alignment across the sources, docs and record
- Questions answered: sk-code-skilled and sk-doc alignment across the sources, docs and record

## Reflection

- What worked and why: checking the documented test command against the folder's actual file list
  found an omission that no earlier iteration would have reached; the docs had been read for
  accuracy of claims, not for completeness of instructions.
- What did not work and why: reading comment density and line length produced nothing, because
  those are P2 and the files comply; the P1 items were where the defects were.
- What I would do differently: compare every documented command against the tree it names as a
  first pass; two of the three doc findings came from that one check.

## Recommended Next Focus

None within the five-iteration budget. The unfixed items this run did not reach: the killer's own
lock lifetime against the wrapper's freshness gate, the `cursor` and `devin` command-only paths
(covered by no adapter test at all), and the packet's `tasks.md` and `acceptance-criteria.md`
scaffolds.
