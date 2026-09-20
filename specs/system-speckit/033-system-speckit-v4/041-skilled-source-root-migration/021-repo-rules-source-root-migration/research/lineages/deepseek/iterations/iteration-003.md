---
title: "Iteration 3: External consumers and checker portability"
trigger_phrases: []
---
# Iteration 3: External consumers and checker portability

## Focus

Q3 — what the sibling repositories link into, and how `check-repo-rules.cjs` probes `.skilled/repo-rules` before `repo-rules` while keeping its nine checks and resolving router rows by link target.

## Actions Taken

- Read the sibling-federation contract in `references/agents-md-integration.md` §8 (lines 139-194).
- Inspected the live sibling tree under `MEGA/Development` for `repo-rules` directories and read a link target with `readlink`.
- Read the packet `plan.md` §3-§5, which carries the authoritative checker contract and verify-command list.
- Re-checked the checker's coupling points against the plan contract (iteration-1 citations).
- Inspected `check-markdown-links.cjs` roots and CLI to establish which surfaces that gate actually walks.
- Confirmed the phase's farm-integrity script is planned but not yet present in `scratch/`.

## Findings

### A. What the sibling repositories link into

1. The documented sibling contract: a sibling's `repo-rules/<rule>.md` is a symlink pointing at the source repository's rule file, for example `../../Code_Environment/Public/repo-rules/<rule>.md`; the sibling adds a `.gitignore` entry for the link, a trigger row, and an index row, and retires in reverse order. The stated verification is to follow each link to a real file, confirm both rows resolve, and confirm count parity — "A link that resolves in one repository is not evidence for another." [SOURCE: references/agents-md-integration.md:141-144,156-181]

2. The one sibling repository visible at this snapshot, `MEGA/Development/Obsidian Plugin`, holds ten symlinks into the main checkout plus three local rules: `blast-radius.md`, `communication-decisions.md`, `communication-handoff.md`, `communication-prose.md`, `communication.md`, `delegation-and-orchestration.md`, `evidence-and-proof.md`, `prevent-overengineering.md`, `root-cause-and-debugging.md`, `scope-discipline.md`, `skill-hub-routing.md`, `uncertainty-and-honesty.md` are links; `screenshot-currency.md`, `spec-tree-layout.md`, `verification-gates.md` are local real files. `readlink communication.md` returns `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/repo-rules/communication.md` — the links actually use **absolute** targets, not the relative shape the skill documents. Both resolve to the same main-checkout path. [SOURCE: `ls -la "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/repo-rules/"`; `readlink` output]

3. The sibling's links point at the **main checkout**, `MEGA/Development/Code_Environment/Public/repo-rules/<rule>.md`, which currently holds real files. After the move + farm, that same path resolves through `repo-rules/<rule>.md -> ../.skilled/repo-rules/<rule>.md`, so every sibling link keeps resolving and content stays single-sourced; this is exactly the farm's purpose and why sibling worktrees (each with their own `repo-rules/` directories) are not re-pointed in this phase. Parent-phase risk row: siblings "resolve through the main checkout, not the worktree... They stay live during the phase and are proven after merge; the farm is what keeps them resolving." [SOURCE: parent spec.md:145] [SOURCE: phase spec.md:164-165] [SOURCE: find over MEGA/Development showing worktree copies]

4. The parent spec and phase spec both say **three** sibling repositories link into `Public/repo-rules`; this snapshot yields one repository-level `repo-rules` directory (plus that repository's worktrees). I could not enumerate all three from this machine state, so the third-party count is UNKNOWN; the load-bearing fact is the path shape, which is proven by the observed links and the specs. Re-pointing siblings at `.skilled/repo-rules/...` is recorded as out of scope and needs the operator's go-ahead. [SOURCE: parent spec.md:145 (three siblings)] [SOURCE: phase spec.md:95-97,221-222] [SOURCE: find result: one repo-level match]

5. Why per-entry links rather than one directory symlink: a whole-directory link "collapses in the GitHub web view and degrades to a single text file in a clone without symlink support"; the settled shape is 13 individual tracked symlinks, one per rule, plus nothing else in `repo-rules/`. [SOURCE: plan.md:59-61,66]

### B. The checker's dual-root probe and row resolution

6. The authoritative contract is stated in `plan.md` §5.4: "The checker resolves its rules directory by probing `.skilled/repo-rules` and then `repo-rules`, and fails with both probed paths named when neither exists. Router rows are identified by resolving each link and requiring it to land inside the chosen rules directory, not by string prefix. The nine checks and their output format stay unchanged, so the phase's claim is a verdict delta on the same instrument." [SOURCE: plan.md:144-150]

7. Mapped onto the current 437-line script, the change set is four coupled edits: (a) `RULES_DIR = 'repo-rules'` (line 26) becomes a probe pair with the canonical path preferred; (b) `findRepoRoot`'s `hasRules` test (lines 46-48) and the missing-root error (line 412) become probe-aware, with the error naming both probed paths (NFR-R01); (c) `loadContext` reads the chosen directory (lines 182, 186); (d) the two prefix tests that identify router rows — `checkWiring` line 233 and `checkIndexSummaries` line 377 — become resolved-target containment tests. The nine checks (lines 397-407) and the `RESULT: PASSED (9/9 checks)` line (line 426) are untouched. [SOURCE: check-repo-rules.cjs:26,46-48,182-186,233,377,397-407,412,426] [SOURCE: plan.md:144-150]

8. "Not by string prefix" plus the mid-move edge case fixes the resolution mechanics: the spec requires the checker to **pass** when "files moved, farm not yet committed", i.e. while the router rows may still name `repo-rules/<rule>.md`; a lexical-prefix test against `.skilled/repo-rules` would fail every row in that state. Resolving the target and following the farm symlink (`realpath`-style containment) lands those rows inside the canonical directory and passes, while a row that resolves into an unrelated directory is skipped as the spec's edge case requires. The realpath detail is INFERRED from the mid-move requirement plus the "not by string prefix" wording; the plan does not name the syscall. [SOURCE: phase spec.md:194,201] [SOURCE: plan.md:144-150]

9. Body-link resolution (check 7) follows the chosen directory: `path.resolve(root, chosenRulesDir, target)` (current line 327-328). In the canonical layout, `../../REPO%20RULES.md` from `.skilled/repo-rules/<rule>.md` resolves to the root router; in a legacy-only checkout, `../REPO%20RULES.md` from `repo-rules/<rule>.md` resolves to the same router. Both layouts satisfy the same nine checks, which is what REQ-003 and the portability fixture assert: `PASSED (9/9 checks)` in this repository and in a checkout carrying only `repo-rules/` with no `.skilled/` tree. [SOURCE: check-repo-rules.cjs:327-328] [SOURCE: phase spec.md:130,194] [SOURCE: plan.md:146-150 (probe contract)]

10. Invocation paths do not disturb the probe: the CI workflow runs the script through `.opencode/skills/.../check-repo-rules.cjs` (which resolves through the `.opencode` farm to the same file), while the phase verification uses `.skilled/skills/...`. `findRepoRoot` walks up from `__dirname` and finds the router at the repository root under either spelling. [SOURCE: repo-rules-corpus.yml:32,39] [SOURCE: plan.md:156 (verification command)]

### C. Farm integrity and the verification surfaces

11. The farm-integrity check is **not** one of the checker's nine checks — REQ-003 pins the 9/9 verdict in both layouts — and the plan places it in the phase verification script `bash "$PKT/scratch/verify.sh"` (farm integrity, rescan, derivation freshness), which does not exist yet (`scratch/` holds only `baseline/`, `research-dispatch.sh`, `research-run.log`). [SOURCE: plan.md:159] [SOURCE: `ls scratch/`] [SOURCE: phase spec.md:130 (REQ-003 9/9)]

12. What the farm check must assert, from the spec's own words: every rule file is covered by exactly one root symlink and no extra symlink exists; every farm target is `../.skilled/repo-rules/<rule>.md` and no symlink leaves the repository root; a dangling link is reported; and each uncovered rule file is listed. Operationally it also underwrites SC-002: `ls -L repo-rules` lists the 13 rule files, in this checkout and in the siblings after merge. [SOURCE: phase spec.md:91-92,162,181,198] [SOURCE: phase spec.md:151-152 (SC-002)]

13. The other verification surfaces named by the plan are `check-repo-rules.cjs` itself, `check-gate-inputs.sh`, `check-markdown-links.cjs`, and the scratch verify script. Measured at HEAD, `check-markdown-links.cjs` walks only the skills/commands/agents family — specifically `ROOTS = ['.skilled/skills', '.skilled/commands', '.skilled/agents', '.claude/agents', '.claude/commands']` — and has no CLI argument to extend them; it therefore checks the two authored agent files' corpus links but does **not** walk `AGENTS.md` or `REPO RULES.md`. The plan's AGENTS.md verification row names this checker, yet the file is outside its roots and outside the `markdown-link-integrity.yml` path filters; the AGENTS.md re-point is verified by manual inspection and the phase's own rescan. This mismatch is observed, not inferred. [SOURCE: check-markdown-links.cjs:23-26,185,189-190] [SOURCE: markdown-link-integrity.yml:7-27] [SOURCE: plan.md:88,91]

14. Because the farm keeps `repo-rules/**` resolving, no link checker can detect a *missed re-point*: `check-markdown-links.cjs` passes both before and after, since the root path resolves either way; a missed canonical re-point in the 26 rows, the 9 AGENTS.md instances or the 13 backlinks is a REQ-002 consistency defect caught by the phase rescan, not by a resolution check. This is the structural reason the plan carries a "required inventory" of every tracked file outside `specs/` that names `repo-rules`, with a disposition per remaining hit. [SOURCE: plan.md:96-99] [SOURCE: check-markdown-links.cjs:14-17 (resolves against file dir OR repo root)]

## Questions Answered

- Q3 (external consumers): the one observable sibling uses absolute symlinks into `Public/repo-rules/<rule>.md`; the documented shape is a relative sibling link; the farm keeps all of them resolving after the move; re-pointing siblings is out of scope. The "three repositories" count could not be fully enumerated — UNKNOWN beyond the observed one.
- Q3 (portable checker): probe `.skilled/repo-rules` then `repo-rules`, fail naming both when neither exists; keep nine checks and output; identify router rows by resolved containment (following farm symlinks so mid-move passes) instead of the `repo-rules/` string prefix; resolve body links against the chosen directory.
- Farm integrity: separate phase-verification script asserting one link per rule, target shape `../.skilled/repo-rules/<rule>.md`, no extras, no dangling links, and full coverage reporting.

## Questions Remaining

- Which three sibling repositories the specs count, and whether the other two will be created or linked later — UNKNOWN from this snapshot.
- Whether the implementation chooses `realpath`-based containment or an equivalent (e.g. resolving through the farm by comparing realpaths of the link and the chosen directory); both satisfy the contract, only the mid-move edge case discriminates. Flagged for the implementer.

## Ruled Out

- Re-pointing sibling repositories in this phase: explicitly out of scope, operator go-ahead required.
- A whole-directory `repo-rules -> .skilled/repo-rules` link: rejected in the settled layout decision (web-view collapse, clone degradation).
- Making farm integrity a tenth checker check: REQ-003 pins the 9/9 verdict and the plan locates the farm check in the phase verification script.
- Using `check-markdown-links.cjs` as proof that the AGENTS.md re-point happened: the checker does not walk AGENTS.md, and the farm makes both spellings resolve anyway.
