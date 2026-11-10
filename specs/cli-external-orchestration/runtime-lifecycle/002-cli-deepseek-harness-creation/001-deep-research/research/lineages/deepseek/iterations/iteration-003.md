# Iteration 3: Profiles, `$DSH_HOME` and repo-local configuration

## Focus

Angle 3: what the harness reads from the working directory and its parents, what lives only under
`$DSH_HOME`, whether a repository can carry a project profile or patch overlay the way `.pi/` and
`.hermes/` carry runtime configuration, and what a repo-root `.dsh/` folder should contain.

## Actions Taken

- Read the `agent-instructions` package reference for the workspace instruction chain.
- Read the `home-paths` and `app-boot` references for home resolution and profile layout.
- Read the `settings` reference to establish what is profile-scoped and what is not.
- Inspected the profile a live `dsh headless --help`/smoke initialized on this machine and the
  lineage-local one.
- Compared the `.pi/` and `.hermes/` surface inventories and their `SYNC.md` manifests.

## Findings

1. The harness home resolves explicit configuration first, then `$DSH_HOME`, then `~/.dsh`; an
   empty or whitespace-only `$DSH_HOME` is treated as unset. The shared agents root resolves the
   same way from `$DSH_AGENTS_HOME` or `~/.agents` and is deliberately outside the harness home
   because other agent tools share it. [SOURCE: dsh-src/packages/util/home-paths/README.md:34-52]
2. A profile is a directory at `$DSH_HOME/profiles/<name>` containing `cordis.yml`,
   `cordis.patch.yml`, `package.json` and `pnpm-workspace.yaml` (the four files observed in a
   first boot), plus a shared `profiles/node_modules`. There is no project-level profile lookup:
   the composition comes from the harness home, never from the checkout.
   [SOURCE: dsh-src/packages/boot/app-boot/README.md:52]
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.dsh-home/profiles/headless/cordis.patch.yml]
3. Workspace instructions are the one project-surface the harness reads natively. The first request
   carries a baseline of `$DSH_HOME/AGENTS.md`, then `<agentsHome>/AGENTS.md`, then every project
   candidate from the `.git` root down to the session working directory, broad to specific.
   Candidates default to `AGENTS.md` and `CLAUDE.md`, with `AGENTS.local.md` and
   `CLAUDE.local.md` as additive local overlays; identical content renders once.
   [SOURCE: dsh-src/packages/context/agent-instructions/README.md:34-38]
4. Each instruction chain gets its own `maxBytes` budget, 65,536 bytes in `dsh-base`; broader files
   are dropped before the most specific file is truncated, and an over-budget broad file is ignored.
   The repo's root `AGENTS.md` is 27,891 bytes, so it fits, but a nested chain could still be
   truncated. Loading refreshes on a working-directory change and on first-party `read`, `write` or
   `edit` touches; shell navigation does not participate.
   [SOURCE: dsh-src/packages/context/agent-instructions/README.md:30-40]
   [SOURCE: dsh-src/packages/context/agent-instructions/README.md:74-76]
   [SOURCE: AGENTS.md:1]
5. `--patch <path>` is the only repo-local configuration lever: a repeatable overlay list applied
   after the profile layer, with the same row grammar as `cordis.patch.yml` (`id`, `disabled`,
   `config`). It can replace the default-model row, enable a route, or disable a plugin per
   dispatch, which is exactly the "project overlay" role `.pi/settings.json` plays for Pi.
   [SOURCE: dsh-src/docs/cli-help.md:41-42]
   [SOURCE: dsh-src/apps/cli/config/examples/ptc.yml:1-4]
   [SOURCE: dsh-src/apps/cli/config/examples/team-mode.yml:1-2]
6. `$DSH_HOME` can be relocated per lineage; pointing it at a lineage subdirectory produced a
   self-contained `headless` profile, its own session tree and its own storages, with no dependency
   on `~/.dsh`. That is the state-isolation mechanism a fan-out lineage needs, and it also means the
   repo folder must not itself be `$DSH_HOME` by default, or every checkout would own a profile and
   package tree. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.dsh-home/profiles/headless/cordis.yml]
7. A `.dsh/` repo folder therefore has a smaller configuration surface than `.pi/` or `.hermes/`:
   `patches/` for route and behavior overlays, `SYNC.md` for the derivation inventory, generated
   `skills/`, `agents/` and `prompts/` trees where the later angles show the loader needs them, and
   a hand-authored `plugins/` bridge for guards. It has no `settings.json` analogue, because
   defaults are an `agent-default-model` config row and settings persist into the active profile
   patch. [SOURCE: dsh-src/packages/settings/settings/README.md:12-24]
   [SOURCE: .pi/settings.json:1-40]
   [SOURCE: .hermes/SYNC.md:20-40]
8. The `.pi/` precedent splits generated from authored exactly where the harness forces it: agents
   and prompts are generated compiler output, skills are a whole-directory symlink, extensions are
   hand-authored bridges, and `settings.json`/`models.json`/`mcp.json` are hand-authored. `.hermes/`
   generates markdown-only skill copies because its scanner quarantines symlinked trees. `.dsh/`
   should follow the Pi split for generated trees and reserve hand authoring for the patch files
   and the plugin bridge. [SOURCE: .pi/SYNC.md:18-40]
   [SOURCE: .hermes/SYNC.md:20-40]

## Ruled Out

- A repo-local profile directory: profile lookup is `$DSH_HOME`-only, and a checked-in profile would
  need `node_modules` and a package install per checkout.
- A `.dsh/settings.json` analogue: settings persist through the active profile's Cordis patch, and
  the defaults a Pi settings file carries live in an `agent-default-model` row.

## Dead Ends

- Trying to discover a project config folder: none is documented in `settings`, `boot` or the
  config catalog; the only project reads found are the instruction chain and a cwd `.env`.

## Edge Cases

- Ambiguous input: "what the harness reads from the working directory" could include the sandbox
  workspace root; the instruction chain and `.env` are the two confirmed reads, the sandbox root is
  a write boundary rather than a config source.
- Contradictory evidence: the resource map said no `~/.dsh` existed; a read-only `dsh headless
  --help` created `~/.dsh/profiles/headless` on its own, which the angle's read-only allowance
  permits. The map's statement was true when it was recorded and is now stale, not wrong.
- Missing dependencies: none.
- Partial success: the profile file list is observed from a first boot, not from documentation.

## Sources Consulted

- `dsh-src/packages/util/home-paths/README.md:34-52`
- `dsh-src/packages/boot/app-boot/README.md:52`
- `dsh-src/packages/context/agent-instructions/README.md:30-76`
- `dsh-src/packages/settings/settings/README.md:12-24`
- `dsh-src/docs/cli-help.md:41-42`
- `dsh-src/apps/cli/config/examples/ptc.yml`, `team-mode.yml`
- `AGENTS.md:1` (27,891 bytes)
- `.pi/SYNC.md:18-40`, `.hermes/SYNC.md:20-40`, `.pi/settings.json:1-40`
- Lineage-local `.dsh-home` profile and session tree

## Assessment

- New information ratio: 0.86 (five fully new findings, two that extend the resource map's
  `$DSH_HOME` and `--patch` facts)
- Questions addressed: Angle 3 profiles, home, project configuration and repo folder shape
- Questions answered: What does the harness read from the working directory and `$DSH_HOME`, and what should a repo-local runtime folder contain?

## Reflection

- What worked and why: inspecting the profile a real boot created answered the "what does a
  profile contain" question faster than the boot README, which describes the composition rather
  than the file list.
- What did not work and why: searching for a project config folder returned nothing, which is
  itself the answer but needed corroboration from three package references before it was safe to
  state.
- What I would do differently: record the first-boot side effect (`~/.dsh`) in iteration 1, so the
  resource map's now-stale line is traceable to a specific command.

## Recommended Next Focus

Angle 4: the skill loader, its directories and frontmatter contract, and whether `.dsh/skills`
should be a symlink or a generated copy tree.
