# Iteration 19: The Synthesis Surface a Rewrite Brief Is Assembled From

## Focus

All five key questions are answered and strategy §11 reads "[All tracked questions are resolved]", so no dispatch focus was supplied. Iterations 16-18 left one gap that is neither a README claim nor a count: the packet's own synthesis, `research/research.md`, which is the artifact a rewrite owner reads first. Iteration 18 named the fold as workflow-owned and out of write scope; this iteration took the read-only half of that gap.

The selected interpretation: audit `research.md` as a **claim surface**, not as a summary. Every count, line anchor and open-question row it publishes was checked against the oracle iterations 15-18 established and against the tree. If the synthesis still carries a corrected number or a dead anchor, a brief assembled from it inherits the error even though every iteration file is right.

Deferred alternatives: a broad Q4 re-audit (blocked in strategy §9 since iteration 10), an independent re-count of skills and templates (blocked in iterations 6, 11 and 14), and editing `research.md` to fold the corrections (outside this dispatch's write scope, recorded under SCOPE VIOLATIONS).

## Actions Taken

1. Read `deep-research-config.json`, the 44-line `deep-research-state.jsonl` (18 iteration records plus `iteration_start` rows), `deep-research-strategy.md`, `findings-registry.json` (zero open questions), `research.md` in full (172 lines) and `iteration-015.md` / `iteration-017.md` for the settled counts.
2. Counted tracked skill directories from the git index at `NF==4` and listed the tracked set.
3. Probed the link form of `local-webflow` with `git check-ignore` and `git ls-files`, after `ls -ld .skilled/skills/*/` returned a false directory reading.
4. Counted `ROUTER.md` presence per tracked skill in one shell loop.
5. Reproduced the command count at `NF==4` with a per-group breakdown and located the two authored runtime commands with `git ls-files`.
6. Read the exact README lines the synthesis anchors: `:15`, `:16`, `:86`, `:160`, `:184`, `:801`, `:805`, `:1174`, `:1443`, `:1751`.
7. Verified every cited line number in this file against the current tree before writing.

## Findings

### F1 (P1) — The synthesis publishes 15 skills where the shipped tree has 14

`research.md:91` states "Top-level skills | 15 | `.skilled/skills/*/`" and `:92` states "Skills with `SKILL.md` | 15 | every skill dir". The git index disagrees: `git ls-files .skilled/skills` at `NF==4` yields exactly 14 unique skill directories, and `.skilled/skills/local-webflow` has zero tracked files. `git check-ignore .skilled/skills/local-webflow/SKILL.md` fails with `fatal: pathspec ... is beyond a symbolic link`, which proves the 15th entry is an operator symlink resolving outside the repository, not a shipped skill. This reproduces iteration 15's finding 1 on a fresh call. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:91] [SOURCE: .skilled/skills/local-webflow/SKILL.md:1] [INFERENCE: based on the `NF==4` git-index count of 14 and the `check-ignore` symlink error]

The instrument note is the new part: `ls -ld .skilled/skills/*/` printed `drwxr-xr-x@` for all 15 entries, because the trailing slash dereferences each symlink before `ls` reports its type. The obvious confirmation call therefore reproduces the wrong number while looking authoritative. This is the fourth instance of the run's recurring class — the counting instrument, not the tree, produces the anomaly — and it is the one instance where the instrument agrees with the error rather than with the tree. [INFERENCE: based on the `ls -ld` output for the 15 entries against the `check-ignore` symlink error on the same path]

### F2 (P2) — The ROUTER exception row is stale: 14 of 14 tracked skills carry `ROUTER.md`

`research.md:93` states "Skills with `ROUTER.md` | 14 | `local-webflow` is the exception". Checked per skill against the index, all 14 tracked skills carry a sibling `ROUTER.md`; the only entry without one is the operator symlink, which is not part of the shipped set. The correct rewrite statement is "every tracked skill routes through a sibling `ROUTER.md`", without an exception clause. The synthesis sentence is true only if the operator symlink is counted as a skill, which is the same error as F1. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:93] [INFERENCE: based on a per-skill `git ls-files <skill>/ROUTER.md` loop over the 14 tracked directories, which returned 14 hits and no misses]

### F3 (P1) — §5D's skill conclusion is inverted and its anchor points at a heading

`research.md:154` says "The root README asserts 14 skills at line 805, so the catalog undercounts by one". Two defects in one sentence. First, `README.md:805` is `#### SYSTEM`, a catalog subheading, not a count; the 14-skills claim is `README.md:801` ("14 skills in `.skilled/skills/`"). Second, the 14 is correct for the shipped tree (F1), so the catalog does not undercount by one — there is no fifteenth entry for it to omit. A rewrite brief that trusts this sentence would either raise the catalog to 15 and publish an operator-private path, or treat a correct section as a defect to repair. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:154] [SOURCE: README.md:801] [SOURCE: README.md:805]

### F4 (P2) — §5D's six-runtime anchor is off by one; the claim itself is real

`research.md:148` says "runtime support is stated as six runtimes at line 15 and eight at line 184". `README.md:15` is blank; the six-runtime sentence is `README.md:16` ("Built for Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI"). The eight-runtime anchor is exact — `README.md:184` opens "Open the repository in any of the eight runtimes". So this is a one-line anchor correction, not a claim correction: the ordering defect the synthesis describes is real, and the rewrite still needs a runtime matrix to resolve it. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:148] [SOURCE: README.md:15] [SOURCE: README.md:16] [SOURCE: README.md:184]

### F5 (P1) — §5B and §5C understate the command surface and leave its depth label ambiguous

`research.md:96` states "Commands | 44 `.md` files | `.skilled/commands/`, depth 3". The count reproduces: `git ls-files .skilled/commands` at `NF==4` returns 44 markdown command documents — create 13, deep 2, design 3, doctor 17, prompt 1, speckit 8. But the row presents 44 as the whole command surface. Two authored runtime commands are tracked outside that tree: `.cursor/commands/goal-cursor.md` and `.opencode/commands/goal-opencode.md`, so the shipped unique surface is 46 and 44 is the canonical group subset. `research.md:118`'s "44 total" repeats the same scope collapse without naming it. The depth label compounds it: group documents are four path segments, so "depth 3" is only true under a directory-depth convention that the row does not state — the same unstated-band ambiguity that cost iterations 16-18 one call each. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:96] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:118] [SOURCE: .cursor/commands/goal-cursor.md:1] [SOURCE: .opencode/commands/goal-opencode.md:1]

### F6 (P2) — The synthesis's open-questions block still shows Q3 and Q4 as open

`research.md:164` lists "**Q3:** every hook, plugin and extension per runtime" and `:165` lists "**Q4:** claim audit of the current 1,773-line `README.md`" as open items. Strategy §3 marks all five questions `[x]` and §6 lists them answered; Q4 closed in iteration 6 and Q3 across iterations 7-11. A brief assembled from the synthesis's closing block therefore treats two answered questions as live work and cannot tell that the packet already holds their bodies in iteration files. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:164] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:165] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:34]

### F7 (P1, structural) — The synthesis has no Q3 or Q4 body at all

Section inventory of `research.md`: 1 Release line, 2 Where release history lives, 3 What `v4.0.2.1` changed, 4 What changed after the tag, 5A `v4.0.1.0`/`v4.0.2.0`, 5B inventory, 5C Q2 close-out, 5D Q5 close-out, 5 Open questions, 6 Method notes. There is no hook/plugin/extension map (Q3) and no README claim audit (Q4); the content ends at §5D on line 159. Iteration 18 recorded this as the fold gap; the citable form is that the two answered questions with the largest rewrite impact exist only as iteration files, and the synthesis's own open-questions block is their only trace. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:159] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:160]

## Questions Answered

None newly. Q1-Q5 were answered in iterations 1-8 and remain answered; this iteration audits the synthesis that restates them.

## Questions Remaining

None tracked. Two hand-offs for the rewrite owner, both about reading the packet correctly:

- Treat `research.md` as a claim surface: its §5B skill rows (15), §5D skill conclusion, §5B command row and §5 open-questions block are stale against iterations 15-18 and must not be copied.
- Read the iteration files for Q3 and Q4; the synthesis has no body for either.

## Ruled Out

- **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS.
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors.
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count.
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it.

## Dead Ends

- **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle.
- **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything.
- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments.

## Edge Cases

- Ambiguous input: no dispatch focus was supplied. The selected interpretation — audit the synthesis surface rather than re-open a README claim — is recorded in Focus, with the blocked alternatives under Ruled Out.
- Contradictory evidence: three synthesis rows (F1, F3, F5) contradict the tree and the iteration files. Resolved in favour of the git index and the current README lines, both cited. The contradiction is carried forward as a rewrite hazard rather than smoothed over, because the synthesis file itself cannot be edited from this dispatch.
- Missing dependencies: none. The registry carries zero open questions; every path measured existed.
- Partial success: the read-only audit is complete; the fold is blocked by write scope and recorded under SCOPE VIOLATIONS.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md` (full, 172 lines; cited `:91`, `:92`, `:93`, `:96`, `:118`, `:148`, `:154`, `:159`, `:160`, `:164`, `:165`)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:34`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-015.md`, `iteration-017.md`
- `README.md:15`, `:16`, `:86`, `:160`, `:184`, `:801`, `:805`, `:1174`, `:1443`, `:1751`
- `.skilled/skills` (git index at `NF==4`; per-skill `ROUTER.md` loop)
- `.skilled/skills/local-webflow/SKILL.md:1` (symlink target outside the repo)
- `.skilled/commands` (git index at `NF==4`, per-group breakdown)
- `.cursor/commands/goal-cursor.md:1`, `.opencode/commands/goal-opencode.md:1`

## Assessment

- New information ratio: 0.71
- Questions addressed: none new; the synthesis surface is now measured as a claim set.
- Questions answered: none — Q1-Q5 were already answered and remain answered.

## Reflection

- What worked and why: reading the synthesis as a claim list instead of as prose turned a document the run had treated as settled into seven measurable statements. The file had been read in iterations 5 and 17 only for the sections a finding needed; reading all 172 lines against the settled oracles is what exposed the inverted §5D conclusion and the stale open-questions block, neither of which any iteration had recorded.
- What did not work and why: the first skill-count call reused `NF==3`, the exact band blocked in iterations 16-18, and returned 1. The band was copied from the command work without re-deriving it for a file listing. The second instrument error was `ls -ld .skilled/skills/*/`, which dereferenced the symlink and agreed with the wrong number — the first case in the run where the instrument failed toward the error rather than toward a visible anomaly.
- What I would do differently: state the `NF` band against its base before running it, and never use a trailing slash when the question is link form.

## Next Focus

None required. Every tracked question is answered, every numeric claim a rewrite would publish has an oracle or a documented correction, and the synthesis surface is now audited. The one remaining action is the synthesis fold — updating `research.md` §5B/§5D/§5 and adding §5E-§5H for Q3, Q4 and the iterations 15-18 corrections. It is workflow-owned and outside this dispatch's write scope; the exact replacement text is listed under SCOPE VIOLATIONS.

## SCOPE VIOLATIONS

- **`research.md` synthesis update not executed.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. No mutation was executed. The replacement text is ready:
  - §5B rows: "Top-level skills | 14 (15 directories on disk; `local-webflow` is an operator symlink outside the index)" and "Skills with `ROUTER.md` | 14 (no exception in the tracked set)".
  - §5B command row: "44 canonical group command documents + 2 authored runtime commands (`goal-cursor`, `goal-opencode`) = 46 shipped unique commands".
  - §5D: replace "asserts 14 skills at line 805, so the catalog undercounts by one" with "asserts 14 skills at `README.md:801`; the count is correct and the catalog covers all 14".
  - §5D: change the six-runtime anchor from line 15 to `README.md:16`.
  - §5: move Q3 and Q4 from open to answered, citing iterations 7-11 and 6.
