# /doctor:install contract

The frozen interface for the install guide's router, workflow YAML and presentation text.

## Shape

- Router: `.skilled/commands/doctor/install.md`, tagged `<!-- skill_agent: system-spec-kit -->`, frontmatter `allowed-tools: Read, Bash`. It is modelled on `helper.md`.
- Workflow: `.skilled/commands/doctor/assets/doctor-install.yaml`.
- Presentation: `.skilled/commands/doctor/assets/doctor-install-presentation.txt`.
- Route in `_routes.yaml`: `command: /doctor:install`, `target: guide`, `mutating: read-only`, `allowed_flags: ["--json", "--root <dir>", "--runtimes <list>"]`, `setup_vars: [execution_mode, root, runtimes, json_output]`.
- `execution_mode` is always `INTERACTIVE`. There is no `:auto` or `:confirm` suffix.

## Contract

- The command is read-only. It never runs a target that writes, and never adds an argument to a writing command beyond the values the operator gave (`--root`, `--runtimes`, the link shape and the instruction choice). A writing step is printed for the operator to run.
- `list`, `?` and `menu` as the whole argument print the ordered install steps from the presentation and stop.
- `--json` prints one JSON object, `{ source, root, runtimes, builds, symlink_check, steps: [{ order, command, mutating, why }] }`, and nothing else.

## Workflow steps

1. **Locate.** The Skilled checkout is the repository this command runs in. Check that the two builds the runtimes load exist:
   - `.skilled/skills/system-spec-kit/runtime/dist`, or the path `/doctor:setup` checks for the spec-kit build (read `doctor-setup.yaml` for the exact check and reuse it)
   - the advisor CLI, via `node .skilled/bin/skill-advisor.cjs list-tools --format json` (exit 0 means built)

   A missing build becomes step 0 in the checklist and prints the README's build commands.
2. **Ask.** When `--root` or `--runtimes` is missing, ask one consolidated prompt and stop for the answers:
   - the target repo's absolute path
   - which runtimes (`claude, opencode, codex, cursor, devin, pi, hermes`, or "the ones already there")
   - the link shape (`auto`, recommended; `whole`; `merge`)
   - the instruction file: `embed` (recommended; keeps the repo's own `AGENTS.md`, via `/doctor:agents-md embed`) or `link` (links `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` to the checkout's copies)
3. **Inspect.** Run `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root <dir> [--runtimes <list>] [--link-instructions]` once, in place, read-only, and render its entry lines.
4. **Checklist.** Print the ordered writing steps. Each has its exact command, its mutation class from `_routes.yaml`, and one line of why:
   1. `/doctor:symlink link --root <dir> --runtimes <list> --mode <shape>` (plus `--link-instructions` when chosen). It shows a plan and asks before writing.
   2. `/doctor:agents-md embed --root <dir>`, only when the choice is `embed`.
   3. `/doctor:mcp install`, which builds and registers Code Mode, run from the Skilled checkout.
   4. `/doctor:git setup`, run from inside the target repo.
   5. `/doctor:setup`, run from inside the target repo, to confirm the result.
5. **Warn.** One fixed caveat line: context saves from a linked repository resolve the project root through the link until the symlinked-runtime-root fix ships, so run `/doctor:setup` from inside the target repo and check that a save lands in that repo's own `specs/`.

## Advisor phrases (three or more words each)

`install skilled into my project`, `set up skilled in another repo`, `use skilled in my own project`, `onboard a project repo to skilled`, `guide me through installing skilled`. They must not overlap `/doctor:mcp install` (Code Mode).

## /doctor:symlink route phrases, for reference

- check: `check skilled symlinks in a repo`, `find broken skilled symlinks`, `which runtime folders are linked`
- link: `symlink skilled into my project`, `link the claude folder into my repo`, `repair broken skilled symlinks`
- unlink: `undo a skilled symlink run`, `remove the skilled symlinks again`
