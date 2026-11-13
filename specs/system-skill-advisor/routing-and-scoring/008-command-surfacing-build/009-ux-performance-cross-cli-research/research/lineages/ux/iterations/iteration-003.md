# Iteration 3: The command discovery surface on each of the six runtimes

## Focus

How many of the 44 tracked commands a model can actually find on each CLI, what the `skill.md` collision costs beyond Claude, and what static check would catch a collapsed or missing command surface before a user does. Chosen as the first unchecked key question after KQ2; the reducer's Next Focus line continued on an iteration-1 detail, so the key-question ladder was used as the protocol allows.

## Actions Taken

1. Counted the canonical command tree with the mirror generator's own walk rules: 45 files, 1 private, 44 tracked, 13 in the `create` folder.
2. Counted each runtime's command or prompt surface: `.claude/commands` 45, `.cursor/commands` 46, `.opencode/commands` 91 followed through symlinks, `.codex/prompts` 45, `.pi/prompts` 46, `.devin/commands` absent.
3. Searched every command root, case-insensitively, for a file named `skill.md`.
4. Read the mirror generator's command rules: Claude and OpenCode get folder trees, Cursor gets flat dash-joined files, and `REAL_COMMAND_ROOTS` checks link shape only.
5. Re-read `g5/result.txt` for what the collision does to the Skill tool listing.

## Findings

1. **Claude's Skill-tool surface loses 12 of the 44 tracked commands.** `.claude/commands/create/skill.md` collapses the 13-file `create` folder into one entry named `create`, so the visible set is 44 - 13 + 1 = **32 of 44**. The same file is mirrored into `.opencode/commands/create/skill.md`, because OpenCode mirrors each top-level directory, and whether OpenCode applies the same folder rule has never been tested; the g5 probe ran Claude Code only. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:2] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:48]

2. **The same command has three different native spellings, and the brief carries only one.** Claude and OpenCode use a folder tree (`create/readme.md`), so the command reads `/create:readme`; Cursor, Codex and Pi get flat dash-joined files (`create-readme.md`), so the native prompt is `create-readme`; Devin has no command surface at all (14 skills, no prompts). A person who learns `/create:readme` from the brief cannot type it on three runtimes, and a model told to "read its document" has to ignore the native name and use the canonical path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:202] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:207]

3. **No committed check measures per-runtime command visibility.** `sync-runtime-mirrors.cjs --check` verifies that the Claude and OpenCode roots are real filtered directories and that links resolve; it never asks whether a folder collapses, how many commands a runtime exposes, or whether a runtime has a surface at all. The `REAL_COMMAND_ROOTS` list covers two of the six runtimes. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:53]

## Recommendations

1. **Print a per-runtime visibility count in the mirror check, with a one-entry allowlist for the known collision.** In `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, add a check row that, for each runtime root, counts command files and flags a folder containing a lowercased `skill.md`; allowlist `create/skill.md` for Claude until the naming decision lands, and fail on any new one. Print `command-discovery claude 32/44 cursor 44/44 codex 44/44 pi 44/44 opencode 44/44 devin 0/44`. Gain: the largest single discovery loss in the build becomes visible on every check, and a new collision cannot ship silently; it also gives phase 007's G5 finding a standing regression guard. Verify: the row prints the counts on today's tree, and adding a second `skill.md` under `create/` makes `--check` exit 1 with the folder named.
2. **Add a native-spelling column to the surface table phase 006 plans.** In the `### Starting a surfaced command` table in `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, add `Native spelling` beside `Runtime` and `Model can start a command itself`: `/create:readme` for Claude and OpenCode, `create-readme` for Cursor, Codex and Pi, `none` for Devin. Gain: a person can type the command on each CLI instead of only the canonical form, and the model knows which native name to try before falling back to the document path. Verify: a test reads the table and asserts each non-`none` spelling resolves to a file in that runtime's root (`.claude/commands/create/readme.md`, `.cursor/commands/create-readme.md`, `.codex/prompts/create-readme.md`, `.pi/prompts/create-readme.md`).
3. **Extend the g5 listing probe to OpenCode as the second folder surface.** The existing probe is two Claude runs in throwaway folders; add one `opencode run` listing prompt against a folder with `create/skill.md` and one with it renamed, and record both in `g5/result.txt`. Gain: settles whether the 12-command loss is Claude-only or shared by the second folder runtime, which decides whether the allowlist in recommendation 1 is one entry or two. Verify: two new listing files exist and each names whether `create:readme` is offered.

## Ruled Out

- **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename.
- **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there.

## Dead Ends

- Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227]
- Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory.

## Edge Cases

- Ambiguous input: the key-question ladder was used because the reducer's Next Focus line pointed at an iteration-1 finding rather than a focus area; recorded rather than silently re-planned.
- Contradictory evidence: none. The 45/44/13 counts agree between the mirror generator's walk and a direct count.
- Missing dependencies: OpenCode's actual discovery rule could not be verified without a live run, which this lineage's rules and phase ownership put out of scope; recorded as an untested half of finding 1.
- Partial success: the Claude number is measured from the g5 listing; the other five runtimes' counts are file counts, not live listings.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:48,53,202,207`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt`
- `.skilled/commands/doctor/_routes.yaml:227`
- Directory counts for `.claude/commands`, `.cursor/commands`, `.opencode/commands`, `.codex/prompts`, `.pi/prompts`, `.devin/skills`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md`

## Assessment

- New information ratio: 0.83
- Questions addressed: KQ3 (which discovery defects exist and what detects them)
- Questions answered: KQ3 — one confirmed collision costing 12 commands on Claude, three native spellings, no visibility check

## Reflection

- What worked and why: counting each runtime's actual mirror root rather than assuming the six runtimes share one surface turned the naming difference into a person-facing problem and found Devin's missing surface.
- What did not work and why: relying on the parent packet's "44 tracked commands" without counting the folder contents would have hidden that the loss is 12, not 1.
- What I would do differently: run the OpenCode listing probe in this iteration if a live run were in scope; it is the one measurement that decides the size of the allowlist.

## Recommended Next Focus

The install and first-run path for an external repository after phase 008: what a new user sees when the hook is wired but the embedder is absent, whether the setup path proves itself, and which failure is still silent.
