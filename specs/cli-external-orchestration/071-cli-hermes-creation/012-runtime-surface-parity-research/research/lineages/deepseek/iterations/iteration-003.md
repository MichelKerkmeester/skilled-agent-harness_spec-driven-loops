# Iteration 3: Skills Surface

## Focus

Why do Devin, Cursor and Codex carry no skills mirror? For each, determine whether the runtime has a
skill loader at all, whether the repo could feed it, and whether the absence is correct by nature or
an unclosed gap. Cite each runtime's own loading contract.

## Findings

### F1. Three runtimes carry a skills mirror, and each mirror's *shape* is a runtime constraint

| Runtime | Mirror | Mechanism | Why that shape |
|---|---|---|---|
| Claude | `.claude/skills` | whole-dir symlink → `../.opencode/skills` | Claude resolves the directory; nothing to maintain |
| Pi | `.pi/skills` | whole-dir symlink → `../.opencode/skills` | same target as Claude's |
| Hermes | `.hermes/skills` (68 dirs) | **generated markdown-only copies** | the static scanner quarantines symlinked directories |

The Hermes constraint is recorded with its cost: "a symlinked directory is scanned in full, so the
whole-tree link cost ten minutes per session and quarantined every hub, and even one linked skill
directory was quarantined on its scripts and references."
[SOURCE: file:.claude/SYNC.md:27] [SOURCE: file:.pi/SYNC.md:34] [SOURCE: file:.hermes/SYNC.md:16]

**A parity recommendation must therefore name a shape, not just a target directory.** "Mirror the
skills" means a symlink for Claude and Pi, generated markdown for Hermes, and nothing at all for the
three runtimes below.

### F2. Hermes's 68 directories are 56 skill copies plus 12 persona skills, and 56 verifies

`sync-skills-hermes.cjs` reads two sources: `SOURCE_DIR = .opencode/skills` and
`AGENTS_DIR = .opencode/agents`, because "Hermes has no flag that loads an agent file, and a plugin
prompt section is capped at 4000 characters, so each shared agent persona is also mirrored as a
preloadable skill named `agent-<name>`".

- `.hermes/SYNC.md:24` claims "all 56" canonical `SKILL.md` plus 12 `agent-<name>/`.
- Live count: `find .opencode/skills -name 'SKILL.md' -not -path '*/node_modules/*' | wc -l` → **56**.
- `.hermes/skills/` holds **68** directories.
- 56 + 12 = 68. ✓

[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:24-27]
[SOURCE: file:.hermes/SYNC.md:24] [SOURCE: shell `find` count, 2026-09-15]

This is a *translation* mirror, not a copy mirror: an agent becomes a skill because the runtime has
no agent loader. That is the same class of move Devin's retired command surface used (command →
skill), which reinforces iteration 2's shape rule.

### F3. Hermes has a live partial failure inside its own mirror: 7 of 68 skills never load

`hermes skills list` shows 61 of 68 as loadable `local` rows. "The other seven are quarantined
because Hermes's prose scanner rates their own text dangerous, which excludes them from the listing
AND from `-s` (`Unknown skill(s)`, exit 1)."
[SOURCE: file:.hermes/SYNC.md:24]

This is the only place in the census where a mirror exists, is generated, passes `--check`, and still
does not reach the runtime. The generator cannot detect it: the failure is in Hermes's own scanner,
not in the file. So `sync-skills-hermes.cjs --check` is a **false-positive generator of confidence** —
green `--check` does not mean "68 skills load".

### F4. Cursor: no `.cursor/skills/` — correct by nature, with a real compensating gap next to it

The manifest states the mechanism, not merely the absence: "No `.cursor/skills/` — Cursor's own
skills live in `~/.cursor/skills-cursor/` and are managed by Cursor itself."
[SOURCE: file:.cursor/SYNC.md:39]

The repo still routes skills in Cursor, by a different surface: `.cursor/rules/skill-routing.md` is a
hand-authored rule that names canonical packet paths directly
(`.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-design/SKILL.md`, `.opencode/skills/sk-git/SKILL.md`, …).
So the skill *capability* is served; the `skills/` directory is not how Cursor serves it.

The adjacent gap is documented in the same manifest: "`rules/skill-routing.md`'s packet list has no
generator and is not derived from the skill registry, so a new skill packet will not appear in it
automatically. Only its Gate 1 pointer block is generated, from the root `AGENTS.md` line, by
`sync-gate1-pointers.cjs` (`--check` reports drift)."
[SOURCE: file:.cursor/SYNC.md:114] [SOURCE: file:.cursor/rules/skill-routing.md:9-16]

**Verdict:** absence correct by nature; the *maintenance* of the compensating surface is an unclosed
gap with a named, cheap detector already half-built (`sync-gate1-pointers.cjs` extends to the packet
list).

### F5. Codex: no `.codex/skills/`, and the equivalent surface is `prompts/` + `AGENTS.md`

`.codex/SYNC.md`'s surface inventory enumerates seven surfaces — agents (13 `.toml`), prompts (35),
hooks (16 symlinks), `hooks.json`, `config.toml`, `AGENTS.md`, `manual-testing-playbook/` — and then
states flatly: "There is no `.codex/commands/` — prompts serve that role. There is no
`.codex/skills/`."
[SOURCE: file:.codex/SYNC.md:26-36]

Each prompt is "a ~750-byte stub that points at the canonical file rather than duplicating it",
carrying `Read that file in full and follow it exactly` — which is the same job a skill preload does
in Claude/Pi/Hermes, routed through the one loader Codex does have.
[SOURCE: file:.codex/SYNC.md:41-47]

**Verdict:** correct by nature. **Inferred, not confirmed:** that Codex has no skill loader at all.
The manifest asserts the absent directory but never names the missing capability, and this iteration
did not enumerate Codex's own CLI surface. Confirming would mean listing Codex's config/loader
surfaces (its `config.toml` was read here and carries only `[features]` and MCP servers) or the
runtime's documented skill mechanism.

### F6. Devin: no mirror and no need for one — native discovery already reaches the skills

Established in iteration 2 and re-confirmed here: `.devin/SYNC.md:20` records discovery of the
repo's `.opencode/skills/` packets as `/sk-doc`, `/sk-git` and so on, with "no `.devin/skills/` mirror
authored". **Verdict:** correct by nature; the runtime walks the canonical tree itself.

### F7. Documentation drift found: `.cursor/SYNC.md` overcounts its own command mirror

`.cursor/SYNC.md:32` states `` `commands/*.md` (36) ``. The live tree holds **35** entries
(33 symlinks + `goal-cursor.md` + `vision.md`). `.codex/SYNC.md:26` states `prompts/*.md (35)` and is
correct. The off-by-one is in the manifest a maintainer would trust when checking parity, and it is
precisely the residue of the retired Devin-era count.
[SOURCE: file:.cursor/SYNC.md:32] [SOURCE: shell census, iteration 1]

### F8. The Hermes skills generator has a `--check` mode that no gate runs

`sync-skills-hermes.cjs --check` exists and is documented (`.hermes/SYNC.md:67`), and the manifest
tells maintainers to re-run it after any `SKILL.md` change. Like
`sync-prompts-hermes.cjs --check` and `sync-prompts-pi.cjs --check` from iteration 1, it is in
neither `.opencode/scripts/git-hooks/pre-commit:147-150` nor
`.github/workflows/spec-kit-check.yml:142-145`. Three `--check` modes exist for mirrors whose drift
would be invisible.
[SOURCE: file:.hermes/SYNC.md:67] [SOURCE: file:.opencode/scripts/git-hooks/pre-commit:147-150]

## Sources Consulted

- `file:.claude/SYNC.md:14,27,51`; `file:.pi/SYNC.md:34,103-104`; `file:.hermes/SYNC.md:16,24,27,31,67,79`
- `file:.cursor/SYNC.md:32,39,68,70,81,114`; `file:.cursor/rules/skill-routing.md:9-27`
- `file:.codex/SYNC.md:26-47,118-124`; `file:.codex/config.toml`
- `file:.devin/SYNC.md:20`; `file:.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:24-30`
- Shell: `.claude/skills`/`.pi/skills` symlink targets, `.hermes/skills` directory count, canonical
  `SKILL.md` count, `.cursor/commands` census.
- `file:.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:257-275`

## Assessment

`newInfoRatio: 0.80` — The charter's fact 2 listed the mirror counts; this iteration supplies the
mechanism behind each and, more usefully, the two cases the counts conceal: Hermes's 7
scanner-quarantined skills (a mirror that exists and still does not load) and Cursor's compensating
`rules/skill-routing.md` (a surface that serves skills without a skills directory). Also new: the
codex skills absence has a named equivalent (`prompts/` stubs) and Codex's own surface inventory
enumerates seven surfaces with no skills row.

Confidence: **high** on F1–F4, F6–F8 (direct reads plus live counts that reconcile exactly:
56 + 12 = 68). **Moderate** on F5's causal half — Codex having no skill loader is inferred from a
manifest that asserts the absence without stating the reason. `.codex/SYNC.md`'s inventory is
consistent with it, and nothing in the repo contradicts it, but the runtime's own contract was not
read.

## Reflection

Worked: reconciling the manifest's own arithmetic against the filesystem. `56 + 12 = 68` verified
`.hermes/SYNC.md:24` in one command, which is what earned the right to trust the same line's
"61 of the 68" figure as a separate finding rather than repeating it as boilerplate.

Failed: `.codex/SYNC.md` asserts an absence without a reason, and this iteration read it as an
answer rather than as a claim needing a second source. Codex's loader contract remains the one
unconfirmed cell in the skills row.

Ruled out: proposing a `.cursor/skills/` mirror. Cursor's skills directory is user-level and
Cursor-managed; a repo mirror would not be read. The gap worth closing there is the ungenerated
packet list in `rules/skill-routing.md`, not the missing directory.

## Recommended Next Focus

Iteration 4: Goal parity — for all seven runtimes, state how a packet goal reaches a session, by
which file and hook, and what happens when it does not. Identify the runtimes with no path and decide
whether each needs an adapter, a native equivalent, or nothing. Include what a missing adapter costs
an operator mid-session. Carry forward the two confirmed halves (Devin's adapter exists and is
registered on `SessionStart`/`UserPromptSubmit`; Hermes binds through its repo plugin at
`.hermes/plugins/repo-guards/__init__.py:119-129`) and settle Cursor, Pi, OpenCode, Claude and Codex.
