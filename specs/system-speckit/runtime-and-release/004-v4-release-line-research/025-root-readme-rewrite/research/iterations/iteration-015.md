# Iteration 15: Skill Catalog Copy Source and the Skill-Mirror Delivery Model

## Focus

All five key questions are answered and the registry carries zero open questions, so focus selection fell to the lowest-coverage area. The §9 SKILL LIBRARY is the single largest block of the current README — iteration 5 measured it at 50.6% of the file — and its raw material had never been measured: the per-skill frontmatter `description` that a shortened catalog must paste, and the mapping from the 14 tracked skills to the 14 catalog entries.

The dispatch's strategy `Next Focus` line reads `[All tracked questions are resolved]`. Rather than re-audit a blocked surface, this iteration measured the one artifact the rewrite must reproduce verbatim: the catalog copy. The measurement immediately surfaced a count conflict (15 skill directories on disk against the README's 14), which became the spine of the iteration — the same untracked-operator trap iteration 6 hit on the command count, this time on skills.

## Actions Taken

1. Extracted `name :: description` for every `.skilled/skills/*/SKILL.md` in one shell loop, which returned 15 rows rather than the 14 the README claims.
2. Mapped the README's H2 structure (`grep -n '^## ' README.md`) and read the §9 span (799-958) in full to count catalog entries against the description list.
3. Reconciled the count with git rather than with disk: `git ls-tree --name-only HEAD .skilled/skills/`, `git log --diff-filter=A`, `git status --porcelain`, `git ls-files`.
4. Resolved the link form of every runtime's skill mirror with `ls -ld`, following iteration 7's method for hooks and iteration 10's for commands.
5. Decomposed the 55-entry DSH/Vibe mirrors by set difference against the tracked skill names (`comm`), and checked tracking depth with `git ls-files` per mirror.
6. Read the `/doctor:runtime-mirrors` router's workflow summary to test the README's own description of what that command checks.

## Findings

1. **The 14-skill count is correct for a clone; the 15th directory on disk is an operator symlink that resolves outside the repository.** `git ls-tree --name-only HEAD .skilled/skills/` lists exactly 14 skill directories plus `.state` and `README.txt`, and the HEAD tree is byte-identical to the `v4.0.2.1` tree for that path. The working tree shows 15 because `.skilled/skills/local-webflow` is a symlink to `/Users/michelkerkmeester/MEGA/Development/Websites/A. Nobel & Zn./local-skills/local-webflow`, which is outside the repo, absent from the index (`git ls-files` returns nothing) and invisible to `git status --porcelain`. Its `SKILL.md` carries a real description ("sk-code WEBFLOW surface: frontend evidence ... plus shared implement/debug/verify workflow doctrine"), so a description harvest cannot distinguish it from a shipped skill. [SOURCE: .skilled/skills/local-webflow/SKILL.md:1] [INFERENCE: based on the HEAD tree listing and the `ls -ld` target of the symlink]

2. **Every "14 skills" claim in the current README is accurate and must not be raised to 15.** `README.md:801` ("14 skills in `.skilled/skills/`"), `README.md:226` ("The other 13 skills work in any codebase") and `README.md:1689` ("Must all 14 skills be installed") all agree with the tracked count. This is the third occurrence of the same trap class in the run — iteration 6's command count (46 apparent, 45 tracked) and iteration 10's Pi command count (`rg` skipping gitignored and symlinked entries) were the first two. The rewrite inherits a rule, not just a number: verify a count against `git ls-files`, never against `ls`. [SOURCE: README.md:801] [SOURCE: README.md:226] [SOURCE: README.md:1689]

3. **The catalog's silence on `local-webflow` is deliberate and consistent, not an omission.** `README.md:835` already names the concept it belongs to — "A declared specific surface, including an operator-private surface skill, ranks ahead of Skilled" — and describes it inside the `sk-code` entry as the Frontend surface rather than as a 15th catalog entry. A rewrite that lists 15 skills would publish an operator-private path as shipped content. [SOURCE: README.md:835]

4. **§9's catalog is a complete one-to-one map of the 14 tracked skills, so its size problem is verbosity, not inventory.** The section names 14 skills across six groups (SYSTEM, CODE WORKFLOW, DEEP LOOP, CROSS-AI CLI, JUDGMENT TRANSPORT, MCP INTEGRATION, DESIGN, DOCUMENTATION, PROMPTING, OTHER) with no missing and no phantom entry. Two placements are non-standard and would break a naive heading count: `system-deep-loop` appears inside the DEEP LOOP prose block rather than as its own bold heading, and `cli-orca` sits under `#### OTHER`. The rewrite can shrink this section by shortening entries; it cannot shrink it by deleting skills. [SOURCE: README.md:799] [SOURCE: README.md:857] [SOURCE: README.md:951]

5. **Skill delivery takes four distinct forms across the eight runtimes, and the README implies only one.** Measured with `ls -ld`:
   - **Directory link (4 runtimes):** `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` are each a single tracked symlink to `../.skilled/skills`, one path in the index apiece. All 15 on-disk entries appear through the link, which is why `local-webflow` shows up in all four.
   - **Flattened per-entry links (2 runtimes):** `.dsh/skills` and `.vibe/skills` are real directories holding 55 tracked symlinks each, pointing at `../../.skilled/skills/<name>`. Because they enumerate entries rather than link a directory, the operator `local-webflow` is absent from both.
   - **No skills surface (2 runtimes):** `.codex/` carries `prompts/` and no skills directory; `.cursor/` carries `commands/` and `rules/` and no skills directory.
   `README.md:871` says only that "Each bridge mirrors them into the runtime's own config", which is true of intent and silent on form. [SOURCE: README.md:871] [SOURCE: .claude/skills/sk-code/SKILL.md:1] [SOURCE: .dsh/skills/sk-code/SKILL.md:1]

6. **The 55 entries in each flattened mirror decompose exactly into 14 skills plus 41 mode directories.** A set difference against the tracked skill names leaves 41 names, all of which are hub modes rather than skills: 9 `cli-*` bridges (`cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-deepseek-harness`, `cli-devin`, `cli-jev`, `cli-mistral-vibe`, `cli-opencode`, `cli-pi`), `deep-research` and `deep-review`, 8 `mcp-*` modes, 5 `sk-code-*` surfaces, 14 `sk-create-*` modes and 3 `sk-design-*` modes. The arithmetic 14 + 41 = 55 reconciles with no remainder, which is what makes the mirror readable as "skills plus flattened modes" rather than as an unexplained count. [SOURCE: .dsh/skills/sk-code/SKILL.md:1] [INFERENCE: based on the `comm` set difference against `git ls-tree HEAD .skilled/skills/`]

7. **`/doctor:runtime-mirrors` checks skill mirrors only for DSH and Vibe, and the link form is the reason.** Its workflow runs "runtime command and agent links, the Codex and Pi prompt and agent mirrors, the DSH and Vibe skill, prompt and agent mirrors, the agent roster, the command catalog, and the Codex hook install" [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:59]. The two runtimes whose skill mirrors it inspects are exactly the two that hold per-entry links and can therefore drift one entry at a time; the four directory-link runtimes cannot partially drift, because a single link either resolves or does not. The README describes the command as checking "the agent, command, prompt and hook mirrors" at `README.md:237` and `README.md:1378`, omitting skills. The README is understated rather than wrong, and the accurate rewrite sentence is "checks every mirror that can drift" — link form, not surface list, is what decides checkability. [SOURCE: README.md:237] [SOURCE: README.md:1378]

8. **The prompt and command mirrors carry the same untracked-operator surplus as the skill count.** `.codex/prompts` holds 46 entries against 44 tracked, and `.cursor/commands` holds 47 against 45 tracked. The 45 tracked figure matches iteration 6's settled command count exactly, so the +2 on each is operator-local state and not a shipped surface. A rewrite that quotes 46 or 47 would overstate the public tree. [INFERENCE: based on `ls -1` and `git ls-files` counts over `.codex/prompts` (46 on disk, 44 tracked) and `.cursor/commands` (47 on disk, 45 tracked), reconciled to iteration 6's settled 45-command count]

## Questions Answered

None. All five strategy key questions were answered in earlier iterations, and this iteration adds evidence under existing questions rather than closing a new one.

## Questions Remaining

None. The strategy §5 stop condition (all key questions answered plus Q3 cross-checked against every runtime directory) was met at iteration 8 and is unchanged.

## Next Focus

The skill surface is now fully measured at every level a README needs: count, tracked set, catalog coverage, delivery form per runtime, and doctor coverage. The remaining unmeasured copy surface is the **command catalog** — `.skilled/commands/` frontmatter descriptions for the 45 tracked commands against the §12 COMMAND LIBRARY entries (1172-1454), which is the README's second-largest catalog block and has only ever been counted, never compared entry-for-entry. That is the same measurement this iteration performed for skills, on the other 283-line block.

## Ruled Out

- **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1.
- **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries.
- **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call.

## Dead Ends

- **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count.

## Edge Cases

- **Ambiguous input:** the strategy's `Next Focus` is `[All tracked questions are resolved]`, which names no surface. Interpreted as "lowest-coverage area", narrowed to the catalog copy source because iteration 5 measured that section at 50.6% of the file and no iteration had measured its source text. The command catalog is the deferred alternative, recorded under Next Focus.
- **Contradictory evidence:** resolved, not carried. Disk (15 skill directories) contradicted the README (14). The `v4.0.2.1` and HEAD trees both list 14, and the 15th is an out-of-repo symlink, so the README prevails and the disk reading was the artifact. Both readings are cited above.
- **Missing dependencies:** none. Every path measured existed; the two absent write targets were confirmed absent before writing, as the protocol requires.
- **Partial success:** none. Every action produced usable evidence.

## Sources Consulted

- `README.md:226`, `README.md:237`, `README.md:799`, `README.md:801`, `README.md:835`, `README.md:857`, `README.md:871`, `README.md:951`, `README.md:1378`, `README.md:1689`
- `.skilled/commands/doctor/runtime-mirrors.md:59`
- `.skilled/skills/*/SKILL.md` — frontmatter `description` for all 15 on-disk directories
- `.skilled/skills/local-webflow/SKILL.md:1` (symlink target outside the repo)
- `git ls-tree --name-only HEAD .skilled/skills/` and the same command against `v4.0.2.1`
- `git ls-files` for `.devin/skills`, `.claude/skills`, `.opencode/skills`, `.pi/skills`, `.dsh/skills`, `.vibe/skills`, `.codex/prompts`, `.cursor/commands`
- `ls -ld` on all six skill-mirror parents plus one entry inside each
- `comm` set difference between `.dsh/skills` entries and tracked skill names

## Assessment

- New information ratio: 0.9
- Questions addressed: none new; evidence added under Q2 (inventory), Q3 (per-runtime surfaces) and Q4 (claim audit)
- Questions answered: none

## Reflection

- What worked and why: harvesting the descriptions *first* and counting second is what surfaced the conflict. A count-first pass would have reported "15 skills" and moved on, because the loop's own output looked like an inventory. Reading the README span afterwards is what made the two numbers collide rather than one silently replacing the other. The same ordering paid in the mirror work: `ls -ld` before `git ls-files` would have shown the four parents as links and saved the misread of the "1 tracked file" result.
- What did not work and why: the `jq '.modes[]? | .name'` probe returned zero across seven registries. It is the third schema guess of the run (iteration 3 `workflowModes`, iteration 8 `rules` key, now `modes[].name`) and the root cause is identical each time — probing a guessed key instead of printing `keys` first. The directory listing already answered the question, so the call was pure waste.
- What I would do differently: print `ls -ld` for every mirror parent before any `git ls-files` count, and never run `jq` against an unread registry shape in a measuring iteration.

## Recommended Next Focus

Measure the §12 COMMAND LIBRARY (README.md:1172-1454) the way this iteration measured §9: harvest the frontmatter `description` for the 45 tracked commands under `.skilled/commands/`, diff the README's entries against that set for missing and phantom rows, and state the tracked-versus-disk delta before quoting any number. The command surface has been counted three times and compared zero times.

## SCOPE VIOLATIONS

- **Intended write refused: `research/research.md`.** `progressiveSynthesis` is `true` in `deep-research-config.json`, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-015.md` and `deltas/iter-015.jsonl`. No mutation was executed. This is the fifth consecutive iteration to record the same mismatch; the material below is ready to paste as a §5J.
  - §5J would carry: the 14-tracked-versus-15-on-disk reconciliation, the four-form skill delivery model, the 14 + 41 = 55 mirror decomposition, and the link-form-explains-checkability rule for `/doctor:runtime-mirrors`.
