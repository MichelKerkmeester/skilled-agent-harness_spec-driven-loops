# Review Iteration 003

## Dispatcher

- Lineage: `docs-7`, area `docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: recovery-provenance, with traceability, correctness, security and maintainability lenses. Iteration 2 closed on `STUCK_RECOVERY` (`stuckThresholdReached`) because two clean passes produced no new finding, so this pass changes approach rather than repeating the file inventory: it reviews the rename at commit level and proves the reviewed blob, the base blob and the introducing commit, instead of trusting the checkout.
- Diff base: `git -c core.fsmonitor=false diff origin/main 1c3d62def5a -- README.md`; both changed lines are still `README.md:269` and `:603`.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- Recorded limits and the holdout rule were honoured: no prompt corpus opened, no `git diff`/`show`/`log -p` over a path containing one, no `--summary` scoring run, no CLI session store read.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `git rev-parse HEAD` | - | The checkout is the reviewed revision `1c3d62def5afef558225e4175e42c0c34c472f7e`, so the working-tree reads describe the commit under review |
| `git status --porcelain README.md` | - | No uncommitted change to the reviewed file; the disk copy is the reviewed blob |
| `git show 1c3d62def5a:README.md` | 269, 603 | The reviewed blob itself carries `/create:sk-skill` in both places |
| `git show origin/main:README.md` | 269, 603 | The base blob carries `/create:skill` in both places, so the change is real relative to main |
| `git log -S"/create:sk-skill" -- README.md` | history | The introducing commit for the README rename |
| `git show --stat 74d3744e641` | whole stat | The rename commit's reach: README, command file rename, command indexes, runtime copies, presentation and both workflow YAMLs |
| `git ls-tree -r --name-only 1c3d62def5a .skilled/commands/create` | - | The reviewed revision's create folder holds thirteen files ending in `sk-skill.md` and no `skill.md` |
| `.claude/commands/create` | directory | The Claude Code command tree has no `skill.md`, the filename the rename commit names as the Claude Code visibility hazard |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 210-225 | The retired-command table maps a typed `/create:skill` to `/create:sk-skill`, so the old name is an intentional alias rather than a live command file |

Context evidence (read-only): `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:206,251`, `.skilled/commands/create/README.txt:57,88`, `.skilled/commands/README.txt:21-35`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The reviewed blob (`git show 1c3d62def5a:README.md:269,603`) and the reviewed tree's command folder (`git ls-tree … .skilled/commands/create`) agree: both name `/create:sk-skill`, and the base blob names `/create:skill`. |
| `checklist_evidence` | notApplicable | No `checklist.md` at the target root; the pass-seven brief and scope file are the operative checklist and both were read for this iteration. |
| `skill_agent` | pass | The introducing commit `74d3744e641` renames the command file, its index rows, its presentation contract and both workflow YAMLs together, so the README's new name and the command's own surfaces landed in one change. |
| `agent_cross_runtime` | notApplicable | No agent body is in the docs scope; the commit's agent edits are context for the rename's reach, not a docs claim under review. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the two changed lines. |
| `playbook_capability` | notApplicable | No manual-testing-playbook claim is touched by the two changed lines. |

## Integration Evidence

- `git show --stat 74d3744e641` lists the README alongside `.skilled/commands/create/{skill.md => sk-skill.md}`, `.claude/commands/create/sk-skill.md`, `.cursor/commands/create-sk-skill.md`, `.codex/prompts/create-skill.md => create-sk-skill.md`, `.pi/prompts/...`, `.dsh/prompts/...`, `.vibe/prompts/...`, `.skilled/commands/create/README.txt`, `.skilled/commands/README.txt`, the presentation contract and both workflow YAMLs, so the README rename is one part of a complete command rename rather than a docs-only edit.
- The same commit message states the reason for the rename: a command file named `skill.md` makes Claude Code read its folder as one skill and hide the other commands, and the new file name lists all 44 tracked commands. The reviewed tree's `.claude/commands/create` has no `skill.md`, so the README's `Create (13)` row and the runtime tree agree on the fix.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:217` maps `'/create:skill'` to `'/create:sk-skill'` in the retired-command table, and `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251` tells a user who types the old name to use the new one; the README names the canonical command, and the alias is documented where the advisor owns it.
- `git log -S"/create:sk-skill" -- README.md` shows the rename commit `74d3744e641` as the newest change to that string, and `git merge-base --is-ancestor 74d3744e641 1c3d62def5a` succeeds, so the reviewed revision contains the rename rather than a later revert.

## Edge Cases

- Recovery mode: iteration 2 ended on `STUCK_RECOVERY` because the stuck count reached two with no new finding. This iteration changes the unit of evidence from the file inventory to the commit graph, which is a genuinely different approach and not a restatement of iterations 1 and 2.
- Revert history: the repository renamed `/create:skill` to `/create:sk-skill` in `1ae148c0182`, renamed it back in `479aeabac40`, and renamed it again in `74d3744e641`. An endpoint read alone cannot prove which decision is final, so the pass checked that the last rename is in the reviewed revision's history and that the tree at that revision carries the new filename.
- `git log -S` counts occurrences rather than naming the first introduction; the endpoint blob and the merge-base test settle the final state, and the introducing commit is used only to explain the change's reach.
- The working tree is the reviewed commit (`HEAD=1c3d62def5a`) and `README.md` has no uncommitted edit, so the earlier iterations' working-tree reads and this iteration's blob reads describe the same file.
- Security lens: this pass touched no executable surface; the only trust-relevant object is a command name a user types, and `command-attach.ts` treats the retired name as a fixed mapping rather than as shell input, so no candidate arose.

## Confirmed-Clean Surfaces

- **Reviewed revision:** `HEAD` is `1c3d62def5a`, the commit the scope file names, and `README.md` is unmodified in the checkout, so no read in this lineage reviewed a different revision than the one dispatched.
- **Blob-level rename:** `git show 1c3d62def5a:README.md` line 269 and line 603 both carry `/create:sk-skill`; `git show origin/main:README.md` at the same lines carries `/create:skill`, so the net change is exactly the rename the brief describes.
- **Single-change provenance:** the introducing commit `74d3744e641` is an ancestor of the reviewed revision, and its stat moves the command file, its indexes, its runtime copies, its presentation and both workflows with the README, so the README cannot be ahead of the command tree.
- **Reviewed-tree command folder:** `git ls-tree -r --name-only 1c3d62def5a .skilled/commands/create` lists thirteen Markdown files including `sk-skill.md` and no `skill.md`, matching the README's `Create (13)` row at that revision.
- **Intentional alias:** the only live `create:skill` token in the advisor runtime is the retired-command mapping at `command-attach.ts:217`, and its changelog entry documents the break; the README is not required to carry the retired name.

## Ruled Out

- **A rename that exists only in the working tree:** the reviewed blob itself carries the new name at both lines.
- **A README ahead of the command tree:** the command folder at the same revision holds `sk-skill.md` and no `skill.md`.
- **A later revert of the rename:** `74d3744e641` is an ancestor of the reviewed revision and is the newest commit that changes the new string in `README.md`.
- **A stale retired-name reference in the README:** the old name appears nowhere in the reviewed README; the alias lives in the advisor runtime and its changelog where it is owned.
- **A Claude Code visibility regression the README would hide:** the reviewed `.claude/commands/create` tree has no `skill.md`, the filename the rename commit names as the hazard.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis only
- Reason: the recovery pass closed the provenance question at commit level; all four dimensions now have two or more reads and no new finding remains
- Rotation status: traceability, correctness, security and maintainability complete; recovery approach closed
- Required evidence: none outstanding; synthesis reads the registry, the three iteration files and the terminal gate rows
- Recovery note: iteration 2's `STUCK_RECOVERY` was answered by changing the evidence unit to the commit graph, and the approach produced no new finding

Review verdict: PASS
