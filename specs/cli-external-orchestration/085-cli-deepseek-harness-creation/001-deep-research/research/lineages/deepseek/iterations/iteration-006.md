# Iteration 6: Plugins, hooks and guards

## Focus

Angle 6: how a harness plugin is written, registered and loaded, which lifecycle seams exist, and
how each of this repo's Pi extensions should be handled — port, port later, or not relevant. The
question behind it is whether one repo plugin bundle is smaller than one plugin per guard.

## Actions Taken

- Read the Cordis primer's plugin definition and the plugin-manager install contract.
- Read the generated event producer/consumer matrix for the hook seam names.
- Read the Claude Code hook bridge's supported-event table, mapping section and matcher rules.
- Read the matcher implementation to check case sensitivity.
- Inventoried `.pi/extensions/` and `.claude/settings.json` hook coverage by event and matcher.

## Findings

1. A harness plugin is a Cordis object: a function with optional `inject` and an `apply(ctx)` field,
   or a `Service` subclass. It is registered as a profile row by package name (`id` + `name` +
   optional `config`), not discovered from a project folder; a repo-local plugin must be installed
   into the profile as a bundle (`dsh plugin --profile <name> add file:...` / `link:`), and without
   HMR a newly installed or changed plugin reports `restart-required`.
   [SOURCE: dsh-src/docs/cordis-primer.md:9]
   [SOURCE: dsh-src/packages/boot/plugin-manager/README.md:31]
   [SOURCE: dsh-src/packages/boot/plugin-manager/README.md:46]
2. The usable lifecycle seams are broader than the Pi extension API: `tools/pre-execute` (waterfall,
   can deny or ask), `tools/execute`, `tools/post-execute` (waterfall, can block with feedback or
   attach context), `tools/result` (emit), `agent/pre-step` (waterfall for prompt and context),
   `agent/turn-stopping` (serial, can force another step), `agent/created`, `agent/disposed`,
   `session/event`, `turn/start`, `turn/end`, `approval/request`, `fs/write-intent`,
   `fs/edit-intent`, `fs/delete-intent`, `compaction/start|summary|prune|end` and `commands/change`.
   [SOURCE: dsh-src/docs/event-producer-consumer.md:30]
   [SOURCE: dsh-src/docs/event-producer-consumer.md:32-54]
   [SOURCE: dsh-src/docs/event-producer-consumer.md:76]
   [SOURCE: dsh-src/docs/event-producer-consumer.md:86-91]
3. The shipped Claude Code hook bridge maps `SessionStart`, `UserPromptSubmit`, `PreToolUse`,
   `PostToolUse`, `Stop`, `SubagentStart` and `SubagentStop` onto those seams; it does not support
   `PreCompact` or `SessionEnd`. That leaves two Pi guards without a bridge point: the compact
   context injector and the session-end cleanup.
   [SOURCE: dsh-src/packages/experimental/hooks-claude-code/README.md:56-70]
4. Claude literal matchers are exact, case-sensitive pipe alternatives; only non-word patterns are
   regexes. Harness tool names are lowercase (`bash`, `read`, `write`, `edit`, `glob`, `grep`,
   `web_fetch`, `apply_patch`, `skill`, `subagent`), so the repo's existing `.claude/settings.json`
   matchers `Bash`, `Write|Edit`, `WebFetch`, `Task`, `Task|Agent` and `AskUserQuestion` will not
   select anything. A rewritten `.dsh/hooks.json` with harness tool names is required; the scripts
   themselves are already runtime-neutral Node entry points.
   [SOURCE: dsh-src/packages/experimental/hook-protocol/src/matcher.ts:60-68]
   [SOURCE: dsh-src/docs/tool-catalog.md:26-52]
5. The repo already carries the hook implementations this angle would otherwise port:
   `.claude/settings.json` wires 9 `PreToolUse` entries (dispatch preflight, spec gate, git
   preflight, git message gate, subagent guard, task dispatch guard twice, MCP route guard, spec
   gate on writes), 5 `PostToolUse` entries (post-edit quality, dispatch audit, classifier injection
   screen, context nudge, decision capture), 3 `UserPromptSubmit`, 8 `SessionStart`, 3 `Stop`,
   1 `SessionEnd` and 1 `PreCompact`. The Pi extensions are thin wrappers over the same scripts.
   [SOURCE: .claude/settings.json:1]
6. Verdict per Pi extension: 16 of the 19 top-level `.ts` extensions are bridge-served by a
   rewritten hook config (classifier injection screen, completion evidence, decision capture,
   dispatch audit, dispatch preflight lint, git message gate, git preflight advisory, MCP route
   guard, post-edit quality, prompt advisor, session relaunch, session-start advisories,
   session-start context, session-stop context, spec-gate classify, spec-gate enforce). `task
   dispatch guard` needs adaptation because the bridge's matcher subject is `subagent`, not `Task`,
   and the script parses a Claude Task payload. `goal context` and `session compact context` need a
   native plugin because the packet goal binding and `PreCompact` have no bridge point.
   [SOURCE: .pi/extensions/README.md:1]
   [SOURCE: dsh-src/packages/experimental/hooks-claude-code/README.md:94-102]
7. A single repo bundle is the smaller move only for the residual guards: the bulk arrives through
   the shipped bridge, so `repo-guards` would carry two plugins (goal context, compact context) and
   optionally a task-dispatch adapter, not eighteen. One bundle means one install, one `SYNC.md`
   entry and one upgrade path; one plugin per guard multiplies profile dependencies for no gain.
   [SOURCE: .hermes/SYNC.md:26-40]
   [SOURCE: dsh-src/packages/boot/plugin-manager/README.md:54]
8. Hooks run in the agent's current session directory, with `CLAUDE_PROJECT_DIR` set per run, so the
   repo's relative script paths work when the dispatch cwd is the repo root. A relative
   `configPath` resolves from the directory that launched the process, which is a second reason the
   dispatch builder must pin cwd. [SOURCE: dsh-src/packages/experimental/hooks-claude-code/README.md:72-80]
9. Headless disables HMR, so a plugin change cannot hot-reload in a dispatch: the profile reports
   `restart-required` and the next process picks the change up. A fan-out lineage therefore installs
   or updates the repo bundle before its run, never mid-run.
   [SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:35-36]
   [SOURCE: dsh-src/packages/boot/plugin-manager/README.md:126]

## Ruled Out

- Porting all eighteen Pi extensions to native plugins: the scripts already exist and most hook
  points are served by the shipped Claude Code bridge.
- Mounting `.claude/settings.json` unchanged: its capitalized tool matchers never match the
  harness's lowercase tool names.
- A project-local plugin folder: plugin resolution is profile-package based, so a repo bundle must
  be installed into the profile first.

## Dead Ends

- Looking for a `PreCompact` equivalent in the bridge: the supported-event table stops at Stop and
  the two subagent events.

## Edge Cases

- Ambiguous input: "not relevant" could mean irrelevant to dispatch or irrelevant to the harness;
  the verdicts use "not relevant to dispatch" only for the two third-party extensions deferred to
  Angle 7.
- Contradictory evidence: the bridge README says it is a compatibility adapter and the matcher
  source confirms exact matching, so "the repo's hooks already work" is false without a rewrite.
- Missing dependencies: the bridge package is not in base or headless, and it is not in the installed
  package's `node_modules`; mounting it needs a profile install.
- Partial success: coverage is counted from configuration, not from a live hook firing.

## Sources Consulted

- `dsh-src/docs/cordis-primer.md:9`
- `dsh-src/packages/boot/plugin-manager/README.md:31,46,54,126`
- `dsh-src/docs/event-producer-consumer.md:30-91`
- `dsh-src/packages/experimental/hooks-claude-code/README.md:56-102`
- `dsh-src/packages/experimental/hook-protocol/src/matcher.ts:60-68`
- `dsh-src/docs/tool-catalog.md:26-52`
- `dsh-src/packages/bundle/headless/cordis.patch.yml:35-36`
- `.claude/settings.json` hook inventory
- `.pi/extensions/README.md`
- `.hermes/SYNC.md:26-40`

## Assessment

- New information ratio: 0.88 (eight fully new findings, one that reframes the Hermes bundle
  precedent for a much smaller residual)
- Questions addressed: Angle 6 plugin seams and the Pi-extension port decision
- Questions answered: Which lifecycle seams exist for plugins and hooks, and which Pi extensions must be ported, deferred or dropped?

## Reflection

- What worked and why: the event matrix is the authoritative seam list, and the matcher source
  turned "the hooks should work" into a concrete case-sensitivity failure before any port was
  planned.
- What did not work and why: the Claude bridge README's supported-event table is easy to read as
  complete; checking the implementation's event map confirmed `PreCompact` is absent.
- What I would do differently: inventory `.claude/settings.json` before reading the Pi extensions,
  since the repo's own hook layer is the real integration surface.

## Recommended Next Focus

Angle 7: third-party Pi plugin migration, one verdict row per package in `.pi/PLUGINS.md` and
`.pi/settings.json`.
