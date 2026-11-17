# Iteration 2: (e) Options that restore Claude's 44 of 44 without renaming a command

## Focus

Question (e): Claude Code lists 32 of 44 tracked commands because a command file named `skill.md` collapses its folder. Enumerate every option that keeps each operator-facing command name intact, with its cost per runtime and the check that would prove 44 of 44.

## Actions Taken

1. Read the mirror synchronizer and its policy module: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` and `command-scope.cjs`.
2. Ran `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` (read-only) for the authoritative count.
3. Counted the canonical command files and asked, per runtime tree, how many of them resolve: `.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts`, `.opencode/commands`.
4. Read the phase-007 g5 measurement that established the collapse mechanism, and inspected `.claude/skills` and the skill frontmatter rules.

## Findings

1. **The 32-of-44 number is reproduced exactly, and the whole gap is one folder.** `--check` prints `visibility claude 32/44, cursor 44/44` and passes with `256 mirrors across 10 trees`. `.claude/commands/create/` holds 13 command files and Claude shows one entry for the folder; the other 31 foldered commands sit outside `create/` and all show. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:254] [output of `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`, 2026-11-13]

2. **No other runtime hides a command, so every Claude-side option costs them nothing.** Of the 45 canonical command files (44 tracked plus the private root file), each tree resolves 45 of 45: cursor and codex and pi and dsh through flat `<folder>-<name>.md` files, opencode through a top-level folder entry, Claude through the folder path. Only Claude's `create/` entry reads as one. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:200] [per-runtime resolution count run 2026-11-13]

3. **The trigger is the exact basename, and today's single visible entry is the skill `create`.** The g5 measurement put `create/readme.md` beside `create/skill.md` and Claude listed one entry, `create`; with `create/new-skill.md` instead of `skill.md` it listed `create:new-skill` and `create:readme`. So the name that must survive is `create`, and the twelve names to restore are `create:agent`, `create:benchmark`, `create:changelog`, `create:command`, `create:diff`, `create:feature-catalog`, `create:goal`, `create:manual-testing-playbook`, `create:readme`, `create:repo-rule`, `create:skill-parent`, `create:with-human-voice`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt]

4. **The count function undercounts by design and would certify a false 44.** `commandVisibility` skips any command whose folder is `.`, so the root-level `local-skilled-alignment.md` is in neither the numerator nor the denominator, and the "44" is the foldered set only. It also counts a folder holding `skill.md` as exactly one, whatever Claude does with it — so a case-only rename would print 44/44 from the script whether or not Claude still collapses. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:246] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:254]

5. **Option 1 — skill mirror beside the command tree (recommended).** Skip the `create/skill.md` command link in the Claude tree and generate `.claude/skills/create/SKILL.md` from the canonical file's frontmatter with `name: create`. Claude then shows the twelve `create:*` commands that g5 proved visible plus the `create` skill it shows today: 44 of 44 with every displayed name unchanged. Cost: `.claude/skills` is currently a single symlink to `../.skilled/skills`, so the tree must become a managed directory (or the skill must be added to the canonical inventory, where all six runtimes and the advisor graph would index it and where the floors could move). Other runtimes: 0, because neither their trees nor the canonical command folder changes. Check: `commandVisibility` counts command links plus skill links and asserts 44, and one fixture listing shows `create:readme` and `create` together. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:206] [SOURCE: .claude/skills (symlink to ../.skilled/skills)]

6. **Option 2 — case-only mirror name `SKILL.md`.** Emit the one Claude link as `.claude/commands/create/SKILL.md` instead of `skill.md`. Cheapest possible change (one special case in `buildExpectedLinks`, no canonical edit, no other runtime). Unmeasured: g5 tested `skill.md` against `new-skill.md`, never the uppercase spelling, so whether Claude's collapse rule is case-sensitive is UNKNOWN. If it is not, the script would print a false 44/44. Check: one throwaway Claude folder listing, exactly the g5 harness, before the rule changes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt] (inference for the case sensitivity)

7. **Option 3 — nested entrypoint `create/skill/index.md`.** If Claude resolves a folder's `index.md` as the command for that folder, `/create:skill` survives and the collapse disappears with no new surface. UNKNOWN resolution: it may render as `/create:skill:index`. Cost: one path special case, 0 elsewhere. Check: the same listing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:239] (inference)

8. **Option 4 — colon-named flat mirror `create:skill.md` at the command root.** A root-level file needs no folder and therefore cannot collapse. UNKNOWN whether Claude derives `/create:skill` from that filename, and a colon is illegal on Windows, so the mirror would not survive a Windows checkout. Cost: 1 file, 0 elsewhere if it works. Check: listing plus a path-portability test. (inference)

9. **Option 5 — drop the collapsed file from the Claude mirror.** Claude then shows the twelve siblings and no `create` entry: 43 of 44, an honest loss of one surface rather than a false 44. Cost: 1 link removed; 0 elsewhere. Check: the count prints 43/44 and the check must fail the 44 assertion, which is the point. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:273]

10. **Excluded by the question, recorded so it is not re-proposed: renaming the canonical file.** Any rename of `.skilled/commands/create/skill.md` changes the command name on all six runtimes at once — the largest possible rename — and the 011 allowlist already names this as the reason the case stays open. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36]

## Ruled Out

- Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number.
- Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only.

## Dead Ends

- Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure.

## Edge Cases

- Ambiguous input: "44 of 44" could mean the 44 tracked foldered commands or all 45 canonical files. Selected the tracked foldered set, the number the check and every summary already quote, and noted the root file separately.
- Contradictory evidence: none; the script's count and the g5 listing agree on the mechanism.
- Missing dependencies: no live Claude session is available in this lane, so Options 2, 3 and 4 are marked UNKNOWN rather than measured. Option 1's skill mechanism is already exercised by the 12 skills in `.claude/skills`.
- Partial success: the option list is complete for file-placement options; the per-runtime costs for Options 2-4 are zero by construction and were not separately measured.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/spec.md`
- `.claude/skills` (symlink target), `.claude/commands/create/`
- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` output
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent; not present at the time of this iteration)

## Assessment

- New information ratio: 0.75
- Questions addressed: (e)
- Questions answered: (e)

## Reflection

- What worked and why: running the committed check first made the per-folder arithmetic undeniable, and counting resolution per runtime turned "Claude is different" into "Claude is the only tree that mirrors folders". The g5 file supplied the mechanism without a new model run.
- What did not work and why: the first resolution count read 45/45 everywhere including Claude, because it tested file existence rather than the resolved command name. Claude has all 45 files on disk; it just does not show them. Existence is not visibility.
- What I would do differently: check `.claude/skills` before ranking the skill-mirror option, since the symlink changes that option's cost from one file to a managed tree.

## Recommended Next Focus

Whether phase 013's delivery and attribution now read true per runtime: score the committed after arm, reconcile `briefDelivered` against each runtime's own store, and separate what the arm can now answer from what it still cannot.
