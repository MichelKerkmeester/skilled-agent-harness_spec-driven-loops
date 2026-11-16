# Iteration 17: The Command-Count Partition and the Last §5D Anchors

## Focus

All five key questions are answered and strategy §11 reads "[All tracked questions are resolved]", so no dispatch focus was supplied. Two bounded follow-ups were left open by iteration 16, and both bear directly on a rewrite:

1. Name the two utilities in the 45-command sentence, or drop the 43 + 2 partition.
2. Verify the remaining §5D line anchors a rewrite would quote — install, RELATED DOCUMENTS, the 149-line positioning block and the 50.6% catalog share.

Item 1 was chosen as the primary focus because it is the one numeric claim the packet still describes as unreproducible, and item 2 was carried as a second, cheap verification pass in the same iteration. Deferred alternatives: a broad Q4 re-audit (blocked since iteration 10) and an independent re-count of skills and templates (blocked in iterations 6, 11 and 14).

## Actions Taken

1. Read `deep-research-config.json`, the 16 iteration records in `deep-research-state.jsonl`, `deep-research-strategy.md`, the registry's top-level keys and `iteration-016.md`.
2. Read `README.md` line counts, every H1-H3 heading with its line number, and the regions 155-172, 1168-1180, 1745-1775.
3. Read `research.md` §5C and §5D (lines 95-172) to recover the exact claims under test.
4. Depth-banded `git ls-files` over `.skilled/commands` at `NF==4` (group/command), separating markdown command documents from `README.txt`, `_routes.yaml`, `scripts/` helpers and depth-7+ fixtures.
5. Enumerated the runtime command surfaces (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`) and tracked file counts per surface; read the frontmatter of both runtime-specific goal commands.
6. Extracted every distinct `` `/group:command` `` token from `README.md` §12 and grouped it by the H4 heading it appears under.
7. Re-derived the four catalogs' line spans from the heading line numbers and recomputed the share.

## Findings

### F1 (P1) — The six group folders hold 44 command documents, not 43

`README.md:1174` says "45 commands: 43 in six groups plus two utilities". The tree does not support the 43. `.skilled/commands/` holds six group folders — `create`, `deep`, `design`, `doctor`, `prompt`, `speckit` — and their tracked markdown at `group/command.md` depth totals 44: create 13, deep 2, design 3, doctor 17, prompt 1, speckit 8. The 44 is not an inference from a directory listing: `git ls-files` at `NF==4` returns 49 entries, and removing the five non-command files (`create/README.txt`, `doctor/_routes.yaml`, `scripts/README.markdown`, `scripts/validate-command-references.cjs`, `speckit/README.txt`) leaves exactly 44 markdown command documents. [SOURCE: README.md:1174] [SOURCE: .skilled/commands/prompt/improve.md:1]

The README's own §12 corroborates the 44: extracting every distinct `` `/group:command` `` token from lines 1178-1454 returns exactly 44 names, and those names map one-to-one onto the 44 tracked files. So §12 documents 44 group commands while its opening sentence claims 43. [SOURCE: README.md:1178] [SOURCE: README.md:1219] [SOURCE: README.md:1237] [SOURCE: README.md:1295] [SOURCE: README.md:1304] [SOURCE: README.md:1314]

### F2 (P1) — The "two utilities" are `/prompt:improve` and `/goal-opencode`, and one of them is already inside the 44

The two utilities are named, not implied: `README.md:1443` opens a `#### UTILITY` heading whose only two entries are `/prompt:improve` (`README.md:1445`) and `/goal-opencode` (`README.md:1449`). [SOURCE: README.md:1443] [SOURCE: README.md:1445] [SOURCE: README.md:1449]

That naming resolves the arithmetic but exposes a double count. `/prompt:improve` is not an extra document — it is `.skilled/commands/prompt/improve.md`, one of the 44 group files, and the `prompt` folder is a first-class group folder beside `doctor` and `create`. The README files it under UTILITY because its own taxonomy splits the disk's `speckit` folder into SPEC KIT and CONTINUITY and has no PROMPT group, so its six headings cover only five disk folders. [SOURCE: .skilled/commands/prompt/improve.md:1] [SOURCE: README.md:1174]

The consequence is precise: 43 + 2 = 45 lands on the correct total through two compensating errors — the group count is one low (44) and the utility count includes one file already in the groups. A rewrite that restates "43 in six groups plus two utilities" inherits both errors even though its total is right.

### F3 (P1) — The shipped unique command surface is 46 documents, not 45

`/goal-cursor` is a tracked, authored slash command at `.cursor/commands/goal-cursor.md`, with its own frontmatter, argument hint and purpose section, and it has no canonical counterpart: there is no `goal` command anywhere under `.skilled/commands/`. `/goal-opencode` is the same shape in `.opencode/commands/`. Both are authored per-runtime, so neither is a mirror of a canonical file. [SOURCE: .cursor/commands/goal-cursor.md:1] [SOURCE: .opencode/commands/goal-opencode.md:1]

`README.md:1174` names `/goal-opencode` explicitly and never mentions `/goal-cursor`; a grep of the whole README for `goal-cursor` returns no hit. So the stated 45 = 44 group documents + `/goal-opencode` is correct for the canonical-plus-OpenCode scope, and it is one short of the shipped unique command count of 46. The rewrite has to choose its scope explicitly rather than carry a bare 45. [SOURCE: README.md:1174] [SOURCE: README.md:1449]

### F4 (P2) — §5D's four remaining anchors verify; the citation drift is confined to two lines

Iteration 16 found two wrong line numbers in §5D and flagged four more as unverified. All four verify:

| §5D claim | Measured | Verdict |
| --- | --- | --- |
| Install starts at line 160 | `README.md:160` is `## 4. QUICK START`; the `### Install` subsection is `README.md:162`; 160/1773 = 9.0% | Accurate at section level |
| 149 lines of positioning precede it | Lines 11-159 = 149, with 10 front-matter lines before them | Exact |
| RELATED DOCUMENTS is the last section at 1751 | `README.md:1751` is `## 17. RELATED DOCUMENTS` | Exact |
| The four catalogs are 898 lines, 50.6% | 304 + 283 + 162 + 149 = 898; 898/1773 = 50.65% | Exact |

The spans re-derive from the heading line numbers alone (§6 260-563, §12 1172-1454, §9 799-960, §11 1023-1171), so the share is measured rather than sampled. The rewrite can quote these four; it must still re-derive §5D's two wrong ones. [SOURCE: README.md:160] [SOURCE: README.md:162] [SOURCE: README.md:1751] [SOURCE: README.md:1172] [SOURCE: README.md:1023]

### F5 (P2) — Each runtime's command surface has a different shape, so one number cannot describe all of them

Measured from the git index: `.claude/commands` holds 44 flat markdown mirrors of the canonical groups; `.cursor/commands` holds 45 flat files (the same 44 plus `goal-cursor.md`); `.opencode/commands` holds 9 tracked entries because its six group folders are links to the canonical tree and only `goal-opencode.md` is an authored file; `.pi/prompts/goal-pi.md` is a prompt rather than a slash command; and `.codex`, `.devin`, `.dsh` and `.vibe` have no command directory at all. [SOURCE: .pi/prompts/goal-pi.md:1] [SOURCE: .cursor/commands/goal-cursor.md:1]

A rewrite that states one number without naming the surface will be wrong in at least one runtime. The defensible forms are "44 canonical commands in six groups under `.skilled/commands/`" and "plus one authored command per runtime that needs one: `/goal-cursor`, `/goal-opencode`". [SOURCE: README.md:1174]

## Questions Answered

None newly. Q1-Q5 were answered in iterations 1-8 and remain answered; this iteration resolved the last open numeric partition among those answers.

## Questions Remaining

None tracked. One bounded follow-up is handed to the rewrite owner:

- State the command surface as 44 canonical group commands plus the two authored runtime commands (`/goal-cursor`, `/goal-opencode`), or pick a scope and name it. Do not restate "43 in six groups plus two utilities".

## Ruled Out

- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list.
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here.
- **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything.

## Dead Ends

- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44.
- **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated.

## Edge Cases

- Ambiguous input: no dispatch focus was supplied. Selected interpretation recorded in Focus; the blocked alternatives are listed under Ruled Out.
- Contradictory evidence: `README.md:1174`'s "43 in six groups" against the tree's 44. Both sides cited in F1; resolved in favour of `git ls-files` at a declared depth band plus §12's own 44-name enumeration.
- Missing dependencies: none.
- Partial success: none for this iteration's evidence. The synthesis update remains blocked by write scope and is recorded under SCOPE VIOLATIONS.

## Sources Consulted

- `README.md:160`, `:162`, `:1023`, `:1172`, `:1174`, `:1178`, `:1219`, `:1237`, `:1295`, `:1304`, `:1314`, `:1443`, `:1445`, `:1449`, `:1751`
- `.skilled/commands` (depth-banded `git ls-files`, per-group counts, non-command file separation)
- `.skilled/commands/prompt/improve.md:1`
- `.cursor/commands/goal-cursor.md:1`
- `.opencode/commands/goal-opencode.md:1`
- `.pi/prompts/goal-pi.md:1`
- Runtime command directories `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` (tracked-file counts per surface)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:118`, `:146`, `:148`

## Assessment

- New information ratio: 0.70
- Questions addressed: none new; the last open numeric partition among Q2's answers was resolved.
- Questions answered: none — Q1-Q5 were already answered and remain answered.

## Reflection

- What worked and why: naming the two utilities from the README's own headings before counting them is what exposed the double count. A count-first pass would have produced "43 + 2 = 45, consistent" and stopped; reading `README.md:1443` first showed that one of the two utilities is a file the group count already contains. The same ordering resolved the goal-command question — listing the runtime surfaces before totalling showed that `goal-cursor` exists and has no canonical twin.
- What did not work and why: the first depth band used `NF==3` and returned 1, because a group command document is three path segments below the repo root but four below nothing — the band was measured against the wrong base. It is the third depth-band slip of the run and the same class as iteration 16's pathspec error: the counting instrument, not the tree.
- What I would do differently: declare the depth band as an explicit `NF==` predicate and print the per-group breakdown in the same call, so a wrong band shows up as a zero group rather than a plausible small number.

## Recommended Next Focus

None required — all key questions are answered and the last open partition is resolved. If the workflow continues, the highest-value remaining action is the synthesis fold: iterations 6-16 exist only as iteration files, and `research.md` stops at §5D, so a rewrite brief assembled from `research.md` alone still misses the hook map, the claim audit, the runtime matrix, the MCP topology, the install path, the link audit and every count correction from iterations 15-17.

## SCOPE VIOLATIONS

- **`research.md` synthesis update not executed.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-017.md` and `deltas/iter-017.jsonl`. The corrected command partition, the 46-document count and the four verified §5D anchors are ready to fold into §5C and §5D.
