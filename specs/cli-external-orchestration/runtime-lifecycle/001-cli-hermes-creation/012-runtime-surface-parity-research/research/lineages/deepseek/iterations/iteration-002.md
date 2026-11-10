# Iteration 2: Devin Command Surface

## Focus

What does the Devin CLI actually load: slash commands, prompt files, a template flag, nothing? Cite
the CLI reference and the installed binary's help. Decide whether a Devin command mirror is loadable
at all, and if it is, what shape it must take. If it is not, name the equivalent affordance and its
cost.

## Findings

### F1. The installed binary has no command surface — `skills` IS the slash-command surface

`devin --help` on the installed binary (v3000.10.27, `bcbe88c7`) lists no `commands` subcommand. The
relevant line is:

```
skills     Manage agent skills (slash commands and agent-triggered context blobs)
```

`devin skills --help` confirms the subcommand set is `list | show | paths | help` — there is no
`devin commands`, no `devin prompts`, and no flag that registers a directory of command templates.
The reference packet agrees: `devin skills` "Manage agent skills (slash commands and context blobs)".
[SOURCE: shell `devin --help`, `devin skills --help`, `devin version` → `devin 3000.10.27 (bcbe88c7)`]
[SOURCE: file:.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:567]

### F2. The only non-skill prompt-injection surfaces are `--prompt-file` and the `--` separator

The help text exposes `--prompt-file <FILE>` — "Load the initial prompt from a file" — alongside
`[PROMPT]...`, whose usage note is "Your prompt (use -- before the prompt)". That is a one-shot
prompt loader, not a command registry: it names no command, exposes no slash namespace, and creates
no discoverable entry point for an operator.
[SOURCE: shell `devin --help` option block; file:.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:118,186,337]

### F3. The retired Devin command mirror was a **skill-shaped** mirror, which proves loadability

The commit that removed it is explicit and dated:

```
feat(goal)!: decommission Devin commands + goal hook   (a2241041b0, Wed Jul 29 2026)

- Drop devin-skills generation in sync-runtime-mirrors.cjs and the
  .devin/skills exemption in command-scope.cjs; the mirror's orphan
  cleanup removes all 35 .devin/skills/<cmd>/SKILL.md mirrors. Devin keeps
  its 13 agent mirrors and natively-discovered .opencode/skills/ packets.

BREAKING CHANGE: the Devin CLI no longer exposes any mirrored slash-command
or a passive session-goal hook.
```

Three facts follow directly:

1. Devin's command mirror was never `.devin/commands/` — it was **`.devin/skills/<command>/SKILL.md`**,
   one directory per command, because that is the only command-shaped surface the runtime loads.
2. It held **35** entries at removal (the commit's own count), and the `.devin/skills` exemption that
   had to be deleted from `command-scope.cjs` is the policy hook that once allowed a runtime-native
   tree at that path.
3. Removal was **operator-directed**, not drift: "per operator directive. Reverses packet 032/003
   (devin-goal-hooks) and the goal-devin command added earlier the same day."
   [SOURCE: shell `git show --stat a2241041b0`]

**Answer to the angle:** a Devin command mirror *is* loadable, but only in skill shape
(`.devin/skills/<name>/SKILL.md`), and it was deliberately retired. `git log --diff-filter=D --name-only -- .devin/commands`
and the same for `.devin/prompts` both return nothing — no command-tree mirror at that path ever
existed in this history.

### F4. The July decommission was partially reversed in September for the goal hook only

`.devin/skills/` does not exist today (`ls -d .devin/skills` → No such file or directory), but the
goal adapter does:

- `.opencode/hooks/goal/devin/` holds `goal-inject.mjs` and `goal-devin.test.mjs` (mtime 2026-09-11).
- `.devin/hooks/goal-inject.mjs -> ../../.opencode/hooks/goal/devin/goal-inject.mjs`.
- `.devin/hooks.v1.json:33` and `:55` register `goal-inject.mjs` on `SessionStart` and
  `UserPromptSubmit`, each wrapped in an `mk-hook-drift` fallback for a host that cannot resolve the
  adapter.

So the current state is *commands stay removed, goal hook restored*, and the removal was not a
general retreat from Devin parity. That distinction matters for ranking: the goal surface has a
maintainer path back, while the command surface has none.
[SOURCE: file:.devin/hooks.v1.json:33,55; shell `ls .opencode/hooks/goal/`, `ls .devin/hooks/ | grep goal`]

### F5. The equivalent affordance is native skill discovery — and it does not cover the 35 commands

`.devin/SYNC.md:20` names the replacement: Devin "discovers the repo's `.opencode/skills/` packets on
its own — exposed as `/sk-doc`, `/sk-git`, and so on — with no `.devin/skills/` mirror authored."
The cli-devin packet records the live `devin skills list` output: 12 repo-local `.opencode/skills/*`
packets surfaced as slash commands with `[user,model]` scope, e.g. `/sk-doc (./.opencode/skills/sk-doc)`
and `/system-deep-loop (./.opencode/skills/system-deep-loop)`.
[SOURCE: file:.devin/SYNC.md:20]
[SOURCE: file:.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:257-275]

**Cost of the absence, stated plainly:** none of the 35 authored `.opencode/commands/*` entry points
(`/speckit:plan`, `/speckit:save`, `/speckit:resume`, `/deep:research`, `/deep:review`,
`/create:*`, `/doctor:*`) has any Devin representation. An operator working in Devin loses the
`/speckit:*` lifecycle entirely and must either name the skill directly or move the session to
OpenCode, Cursor or Pi. Devin keeps what the *skills* namespace covers, which is coarser: one entry
per skill packet, not one per command.

### F6. Two stale artifacts still describe the removed surface

The decommission commit deferred cleanup: "cli-devin playbook COMMANDS scenarios (DV-014..DV-016) +
'36 roster' note + SYNC.md section 5 anecdote still mention the removed mirrored-command surface — a
broader playbook rewrite." `.devin/SYNC.md:74` still carries that anecdote in the present tense as
the strict-YAML teaching example ("This hid 12 of 36 commands from Devin"). It is a true historical
record and a false description of today's surface.
[SOURCE: shell `git show a2241041b0` (body, "Deferred" paragraph); file:.devin/SYNC.md:74]

## Sources Consulted

- Installed binary: `devin --help`, `devin skills --help`, `devin version` (v3000.10.27, `bcbe88c7`).
- `file:.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:118,186,293,555-576`
- `file:.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:257-296`
- `file:.devin/SYNC.md:20,74`
- `file:.devin/hooks.v1.json:33,55`
- Read-only git: `git show --stat a2241041b0`, `git log --diff-filter=D -- .devin/commands`,
  `git log -- .devin/prompts`, `git log -- .pi/prompts/goal-pi.md`.

## Assessment

`newInfoRatio: 0.85` — The charter's "Devin carries zero of the 46 authored commands" is now
answered at the mechanism level, which the charter did not attempt. Genuinely new: Devin's slash
surface *is* its skills surface; the retired mirror was skill-shaped (35 `.devin/skills/<cmd>/SKILL.md`
directories); removal was an operator directive with a BREAKING CHANGE note; and the September goal
restoration shows the removal was scoped, not general.

Confidence: **high** on F1–F5 (binary output, commit body, four file reads). **Moderate** on one
sub-claim: that the 35 removed `.devin/skills/<cmd>/` entries correspond one-to-one with today's 35
authored commands. The commit states the count, not the roster; the exact roster is in
`git show a2241041b0 --stat`. Confirming would mean listing that commit's deleted paths and diffing
them against the current command tree — recorded as the check that would settle it.

## Reflection

Worked: going to the binary and the git history instead of reasoning about Devin's documented
behavior. `devin --help` settles "does a command surface exist" in one call, and the decommission
commit answers "gap or decision" with a quotation rather than an inference from the current state.

Failed: the first search attempt used `rg -rn`, which ripgrep reads as `--replace n` for an
in-place-looking search. Output came back with every match text replaced and was unusable. Search
flags were re-derived from the pattern rather than assumed.

Ruled out: treating the absent `.devin/commands/` directory as an unclosed port. Two independent
sources — the SYNC manifest and a committed BREAKING CHANGE — say the surface was removed on purpose,
and the runtime's own help shows no loader that a `.devin/commands/` tree could feed.

## Recommended Next Focus

Iteration 3: Skills surface — why Devin, Cursor and Codex carry no skills mirror. For each, determine
whether the runtime has a skill loader at all, whether the repo could feed it, and whether the absence
is correct by nature or an unclosed gap, citing each runtime's own loading contract. Devin's answer is
now half-known (native discovery of `.opencode/skills/*`); iteration 3 must settle Cursor and Codex
and pin the mechanism for all three.
