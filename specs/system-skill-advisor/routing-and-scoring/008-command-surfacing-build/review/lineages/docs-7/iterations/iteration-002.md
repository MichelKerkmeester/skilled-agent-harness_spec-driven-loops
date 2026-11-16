# Review Iteration 002

## Dispatcher

- Lineage: `docs-7`, area `docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: correctness and maintainability, with security and traceability lenses retained. The pass-seven operator focus is the docs area: the branch's net change to the root `README.md` against `origin/main` (the `/create:skill` to `/create:sk-skill` rename at `README.md:269` and `:603`). This iteration tests the two changed lines as *claims*, not names: the counts, the mode sentence, the command's actual behaviour, and the reach of the renamed name on the runtime surfaces the README promises.
- Diff base: `git -c core.fsmonitor=false diff origin/main 1c3d62def5a -- README.md` (scope line 1); still 2 insertions and 2 deletions.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- Recorded limits and the holdout rule were honoured: no prompt corpus opened, no `git diff`/`show`/`log -p` over a path containing one, no `--summary` scoring run, no CLI session store read.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `README.md` | 266-271 | The changed extending-Skilled paragraph as a set of claims: rename, sibling commands, and the `:auto`/`:confirm` sentence |
| `README.md` | 597-613 | The commands overview and six group rows, including every count and the changed Create list |
| `.skilled/commands` (inventory) | directory | Mechanical recount of the six group folders: 13 + 2 + 3 + 17 + 1 + 8 |
| `.skilled/commands/create/*.md` | frontmatter | The thirteen argument hints, checking `[:auto\|:confirm]` on each |
| `.skilled/commands/create/assets/create-skill-auto.yaml` | 100-125 | The resolved `skill_path` and the operation set the command actually serves |
| `.skilled/commands/create/assets/create-skill-confirm.yaml` | 20-45, 610-650 | The confirm-mode approvals and the completion actions that name the command |
| `.opencode/commands/create/*.md` | whole files | Byte equality with the canonical create commands and correct command names |
| `.claude/commands/create/sk-skill.md` | symlink | Link target resolves to the canonical renamed file, not a deleted `skill.md` |
| `.codex/prompts`, `.cursor/commands`, `.pi/prompts`, `.dsh/prompts`, `.vibe/prompts` | filenames | The renamed command's runtime mirrors carry `create-sk-skill`, not `create-skill` |

Context evidence (read-only): `.skilled/skills/sk-doc/README.md:67,194`, `.skilled/commands/README.txt:21-35`, `.skilled/commands/create/README.txt:57,88,119-180`.

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
| `spec_code` | pass | The changed Create row says thirteen and the folder holds thirteen (`README.md:603`; `.skilled/commands/create` inventory). The changed mode sentence holds for all thirteen argument hints, and the renamed command's `skill_path: .skilled/skills/` matches the README's "creates or updates a skill". |
| `checklist_evidence` | notApplicable | No `checklist.md` at the target root; the pass-seven brief and scope file are the operative checklist and both were read again for this iteration. |
| `skill_agent` | pass | The renamed command's confirm workflow and presentation contract both use `/create:sk-skill`, so the README's pointer and the command's own behaviour agree. |
| `agent_cross_runtime` | notApplicable | No agent body is in the docs scope; the command mirrors are integration evidence, not an agent-parity claim. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the two changed lines. |
| `playbook_capability` | notApplicable | No manual-testing-playbook claim is touched by the two changed lines. |

## Integration Evidence

- `.opencode/commands/create/sk-skill.md` is byte-identical to `.skilled/commands/create/sk-skill.md` (diff empty), and every `.opencode/commands/create/*.md` file matches its canonical sibling, so the README name resolves on the OpenCode surface as well as in the source tree.
- `.claude/commands/create/sk-skill.md` is a symlink to `../../../.skilled/commands/create/sk-skill.md`, and a broken-link sweep over `.claude/commands`, `.cursor/commands` and `.opencode/commands` returns nothing.
- `.codex/prompts/create-sk-skill.md`, `.cursor/commands/create-sk-skill.md`, `.pi/prompts/create-sk-skill.md`, `.dsh/prompts/create-sk-skill.md` and `.vibe/prompts/create-sk-skill.md` all exist; no runtime tree holds a `create-skill.md` that would leave the README name unreachable.
- `.skilled/commands/create/assets/create-skill-auto.yaml:113` sets `skill_path: .skilled/skills/`, and the same workflow carries the four operations (`full-create`, `full-update`, `reference-only`, `asset-only`), so "creates or updates a skill" describes the shared skill tree rather than a single runtime copy.
- `.skilled/commands/create/assets/create-skill-confirm.yaml:30,39-40` sets `approvals: step_by_step`, and `:626-630` prints restart actions as `/create:sk-skill ...`, matching the README's "pause at each step" and the new name.

## Edge Cases

- Iteration numbering: the state log held one iteration record before this pass, so `iteration-002.md` is correct.
- Recount scope: the six-group total counts only `.md` files inside the six group folders. `.skilled/commands/local-skilled-alignment.md` is a command file at the tree root; the README's sentence is scoped to the six groups, and its own runtime-goal note at `README.md:613` explains commands that live outside them, so the root file is context rather than a count error.
- Runtime surfaces: only `.opencode` and `.claude` keep a `commands/create` folder. The other runtimes mirror commands as prompts or skills; the sweep therefore checked filenames in each runtime's prompt/hook tree rather than assuming a uniform folder.
- Security lens: the changed lines add no executable content, path, environment variable or secret. The one trust-relevant surface is the command name a user types, and the renamed token is inert text in a Markdown file; no candidate arose, which is a clean result rather than skipped coverage.
- Maintainability lens: the new spelling appears in the root README, the create group index, the sk-doc hub README, the presentation contract and the confirm workflow's completion actions, so a future rename has one vocabulary to search.

## Confirmed-Clean Surfaces

- **Count integrity:** the six group folders hold 13 + 2 + 3 + 17 + 1 + 8 = 44 command Markdown files, matching `README.md:599`'s "Forty-four commands ship in six groups"; the Doctor table at `README.md:646-662` lists the same seventeen files the doctor folder holds.
- **Mode integrity:** all thirteen create command files carry `[:auto|:confirm]`, and each owns an `-auto.yaml` and a `-confirm.yaml` asset; the renamed command resolves mode from `$ARGUMENTS` or the setup answer, so the `:269` sentence is true for it and its siblings.
- **Runtime reach:** the renamed command exists in every runtime surface that mirrors the create group (`.claude` symlink, `.opencode` copy, and `create-sk-skill` prompts under `.codex`, `.cursor`, `.pi`, `.dsh`, `.vibe`), with no stale `create-skill` filename remaining.
- **Copy integrity:** the `.opencode` copy of the renamed command is byte-identical to the canonical file, and every `.opencode/commands/create/*.md` file matches its canonical sibling, so the README cannot point at an OpenCode copy that drifts from the documented workflow.
- **Prose consistency:** the root README, `.skilled/commands/create/README.txt:57,88`, `.skilled/skills/sk-doc/README.md:67,194` and the command's own presentation all name `/create:sk-skill`; the only surviving "skill" tokens are the sibling `/create:skill-parent` and the underlying `create-skill-*` asset filenames, neither of which is a command name.

## Ruled Out

- **A stale `.opencode` copy of the renamed command:** all thirteen create command copies match the canonical files byte for byte.
- **A broken `.claude` symlink after the rename:** the link resolves to the canonical `sk-skill.md`, and no link under the three command trees is broken.
- **A runtime prompt still named `create-skill`:** every non-command mirror carries `create-sk-skill`.
- **A false count in the changed Create row:** thirteen listed names, thirteen files, and the same number in the create group's own index.
- **A false mode claim for the renamed command:** the confirm workflow's `approvals: step_by_step` and the `:auto` workflow both exist and are routed by the command's execution-target table.
- **A behaviour narrower than the README says:** the renamed command writes the shared `.skilled/skills/` tree, so the unqualified "a skill" is accurate.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis only
- Reason: all four dimensions have a second read, the docs area's only changed facts are verified, and no new finding remains
- Rotation status: traceability complete in iteration 1; correctness, security and maintainability complete in iteration 2
- Required evidence: none outstanding; synthesis reads the registry and the two iteration files
- Recovery note: none

Review verdict: PASS
