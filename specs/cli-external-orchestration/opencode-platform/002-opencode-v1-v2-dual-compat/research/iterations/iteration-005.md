# Iteration 005 — A5: one agent frontmatter for both OpenCode v1 and v2

## Focus

Can a single `.skilled/agents/*.md` frontmatter block serve OpenCode v1 (1.19.3) and v2 (2.0.32) with identical intent, given `.opencode/agents -> ../.skilled/agents` (verified: `.opencode/agents` is a symlink to `../.skilled/agents`, 12 agent `.md` files plus `README.txt`).

## Actions Taken

1. **v1 ground truth, in place, no probe project.** Ran `opencode debug agent <name>` against the real repo for `orchestrate`, `code` and `markdown` (v1 `debug agent` exists — see `scratch/cli-help/v1-debug-help.txt`). This resolves each agent through v1's loader and prints the *post-resolution* object, which is the authoritative statement of which frontmatter fields v1 keeps.
2. **v2 ground truth, in place, read-only.** Ran `opencode2 api GET "/api/agent?location%5Bdirectory%5D=<url-encoded repo>"` and captured the `code` and `ai-council` records. This is v2's post-load representation of the *same files*.
3. **v2 field vocabulary, from the committed OpenAPI dump.** Read `components.schemas` out of `scratch/cli-help/v2-openapi.json` for agent-shaped schemas.
4. **Body-text census.** Counted occurrences of the bare token `Task` across the 12 agent bodies to size the v1-Task-tool naming problem.
5. **No probe project was created.** The iteration contract's allowed-write list is this run directory only; standing up `scratch/a5-probe/` with new agent files would have been an out-of-scope mutation. See `## SCOPE VIOLATIONS`. The two questions that genuinely need a throwaway project are carried forward as open, with the exact probe command recorded.

## Findings

### F-A5-1 (P1) — v1 and v2 use different agent field namespaces, and v2 translates *from* v1

v1's resolved object for an agent carries these keys: `name, mode, permission, options, native, prompt, description, temperature, tools`. Observed directly on `opencode debug agent markdown`:

```
["name","mode","permission","options","native","prompt","description","temperature","tools"]
```

v2's encoded agent schema carries only: `model, request, system, description, mode, hidden, color, steps, disabled, permissions` (`Config.AgentEncoded` in `scratch/cli-help/v2-openapi.json`; `Agent.Info` is the same set plus `id`).

The overlap is `description` and `mode`. Every other field is named differently (`permission`→`permissions`, `prompt`→`system`, `temperature`→`request.body.temperature`) or exists on one side only (`options`, `native`, `tools` on v1; `model`, `request`, `hidden`, `color`, `steps`, `disabled` on v2).

Crucially, v2 does **not** parse our v1-shaped frontmatter as v2 keys — it translates it. The v2 record for `code` shows `write`, `edit` and `patch` collapsing into a single `edit` action, `bash` becoming `shell`, and `task` becoming `subagent`. The translation also appends allowances/denials our frontmatter never declared (a trailing `browser: deny`, plus `read`/`question`/`doom_loop` rules inherited from v1 defaults). So the *effective authority* of an agent differs between hosts even when the source file is identical.

Consequence: a single frontmatter block is viable **only** in the v1 shape, with v2-only fields added as tolerated extras. A v2-shaped block (`permissions:` list) is not a safe common denominator, because nothing demonstrates v1 translating in the other direction.

### F-A5-2 (P1) — `temperature` survives to v2 but is inert there

v2 keeps the value and files it under `request.body`:

```
"id":"code" ... "request":{"settings":{},"headers":{},"body":{"temperature":0.1}}
```

whereas the built-in `build` agent has `"request":{"body":{}}`. Per the v2 agents documentation already recorded in this run, `request.body` is not yet sent upstream. So `temperature: 0.1` is honoured on v1 and carried-but-ignored on v2. This is not a divergence that can be fixed in frontmatter; it is a v2 platform gap. Recommendation: keep the field (harmless, forward-compatible), and stop treating per-agent sampling as a cross-version guarantee — agents whose behaviour depends on low temperature (`ai-council`, `deep-research`, `deep-review`, `review`, `orchestrate`, `code`, `context`, `markdown`, `prompt-improver`, all at `0.1`) will be less deterministic on v2.

### F-A5-3 (P0 for parity) — `chrome_devtools: deny` protects nothing on v2; add `browser: deny`

v2's action vocabulary, read off the built-in agents in `/api/agent`, is: `*`, `read`, `question`, `edit`, `shell`, `webfetch`, `doom_loop`, `external_directory`, `browser`, `subagent`. Our frontmatter uses `chrome_devtools`, and v2 carries it through as a rule with `action: "chrome_devtools"` — a name no v2 tool answers to. The observed `ai-council` v2 record contains `{"action":"chrome_devtools","resource":"*","effect":"deny"}`; the only reason that agent also ends up with a `browser: deny` is v2's own appended default, not our file.

The same class of inert rule affects `grep`, `glob`, `list` and `patch` on v2 (`patch` at least collapses into `edit`, which is the intended effect).

The decisive observation for a fix: **v1 has no fixed permission-key enum.** v1 emitted rules named `chrome_devtools`, `list` and `patch` verbatim from our frontmatter, because any key under `permission:` becomes a rule with that name. So adding `browser: deny` next to `chrome_devtools: deny` is a real denial on v2 and a harmless inert rule on v1 — a strictly-improving dual-version edit that needs no fork. The same argument applies to any future v2-only action name.

### F-A5-4 (P1) — v1 auto-derives a `tools` gate that v2 has no equivalent for

None of the 12 agents declares a `tools:` map. v1 nevertheless resolves one:

```
"tools":{"invalid":true,"question":false,"bash":true,"read":true,"glob":true,"grep":true,
         "edit":true,"write":true,"task":false,"webfetch":false,"todowrite":true,"skill":true,...}
```

i.e. v1 projects the `permission:` map onto a tool-enable map (`task: false` follows `task: deny`, `webfetch: false` follows `webfetch: deny`). v2 has no `tools` key at all in `Config.AgentEncoded`; tool-level disablement is expressible only as a permission rule. Any future agent that wants to switch a tool off *without* a permission rule can do so on v1 and cannot on v2. No action needed for the current 12, because their behaviour is already permission-encoded.

### F-A5-5 (P1) — agent bodies name the v1 Task tool; v2's port is `subagent`, and the body ships verbatim

`Task` occurrences per body: `orchestrate` 30, `ai-council` 12, `debug` 7, `deep-review` 4, `markdown` 4, `context` 3, `deep-research` 3, `code` 2, `design` 2, `review` 2, `prompt-improver` 1. v2 hands the body through unchanged as `system` (the `code` record's `system` is the body text character-for-character, including the `permission.task: deny` sentence).

Two problems, both reproducible from the files:

- `.skilled/agents/code.md:54` states "`permission.task: deny` blocks the Task tool at the OpenCode runtime layer." On v2 that guarantee comes from `permission.task` mapping to the `subagent` action — the record proves the mapping, but the sentence names a key and a tool that do not exist under those names on v2. An agent reading its own instructions on v2 gets a factually wrong statement about how it is constrained.
- `.skilled/agents/orchestrate.md:35` already solved this generically — "The delegation tool is named differently in each runtime — `task` in OpenCode, `Agent` in Claude Code, `spawn_agent` in Codex, `subagent` in Pi". That table lists four runtimes and gets OpenCode *wrong for v2*: inside OpenCode the name is now version-dependent (`task` on 1.19.x, `subagent` on 2.0.x). The convention exists; the table needs a fifth row and the prose needs to stop treating "the Task tool" as a proper noun.

This is the highest-value, lowest-risk body fix: generalize the noun, keep one body, and let the per-runtime table carry the name. It needs no version fork.

### F-A5-6 (P2) — v2-only fields are unusable as a common denominator without a tolerance probe

`hidden`, `color`, `steps` and `disabled` are legitimate v2 agent fields and have no v1 counterpart in v1's resolved key set. `markdown.md` already uses `mode: all`, which v1 resolves to `"mode":"all"` without complaint; whether v2 accepts `all` (the built-ins show only `primary` and `subagent`) was not captured this iteration.

`steps` is the one field with no dual-version story at all: v1's resolved agent has no step-cap key, so a per-agent step limit can be expressed on v2 and not on v1. Recorded as an irreducible divergence unless a later iteration finds a v1 config-level equivalent.

## Recommended frontmatter shape (answered for the agent slice)

Base = the current v1 shape, unchanged; it is the form v2 demonstrably translates from. Then:

1. **Keep** `name`, `description`, `mode`, `temperature`, `permission:` map, `mode: all` where already used.
2. **Add** `browser: deny` (or `allow`) to the `permission:` map of every agent that constrains `chrome_devtools`, so the v2 action actually lands. Inert on v1 by construction.
3. **Do not** convert anything to a v2 `permissions:` list; nothing shows v1 reading that form.
4. **Do not** rely on `temperature` for behaviour on v2 (F-A5-2), and do not add `steps`/`hidden`/`color`/`disabled` until v1's tolerance for unknown keys is probed (open question below).
5. **Rewrite** body prose that names "the Task tool" as a proper noun to a runtime-neutral noun, and extend the `.skilled/agents/orchestrate.md:35` table with the v1/v2 split.

## Questions Answered

- **A5, agent slice — can one `.skilled/agents/*.md` frontmatter block serve v1 and v2 with identical intent?** Yes, with two conditions: the block must stay in the v1 shape (v2 translates v1→v2 one way only), and v2-only action names must be added alongside their v1 equivalents (`browser` beside `chrome_devtools`). Behavioural parity is *not* achievable for `temperature` (v2 carries and drops it) or for a per-agent `steps` cap (v2 only).

The strategy-level key question "Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?" is **not** answered — this iteration settles agents only; commands, skills and `opencode.json` remain open. `answeredQuestions` is therefore empty on the record.

## Questions Remaining

Carried forward, not touched here:

- Does v1 tolerate a v2-shaped `permissions:` list, or unknown frontmatter keys such as `steps` / `hidden` / `color` / `disabled` — strip silently, ignore, or misread?
  **Probe:** create `.opencode/agents/a5-probe.md` in a throwaway project with a `permissions:` list plus `steps`, `hidden`, `color`, `disabled`, then `opencode debug agent a5-probe`; read whether the keys vanish, survive, or appear in `options`.
- Does v1 forward unknown frontmatter keys to the model as provider `options`? (`options` resolved to `{}` for `markdown`, which had no unknown keys — inconclusive by construction.)
- Does v2 accept `mode: all` for `markdown`, or coerce it?
- Does 2.0.32 still expose `hidden`/`color`/`steps` in `/api/agent` responses when set, or only in the input schema?
- All prior open questions from iterations 1-4 remain open (plugin default-export shapes, `plugins` vs `plugin` config key, v2 event scheme, `session.messages` signature, `ctx.tui`, v2 flat-plugin discovery).

## Next Focus

A6 — commands, the same one-file question applied to `.skilled/commands/**` and the generated `.opencode/commands` surface: argument placeholders, frontmatter (`agent`, `model`, `description`, `subtask`), and whether v2's command loader reads the same shape.

## SCOPE VIOLATIONS

No mutation was executed. One would-be mutation was declined on the rules:

- **Would-be write:** create `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a5-probe/` with a throwaway `.opencode/` project containing v2-shaped agent frontmatter, in order to settle the v1-tolerance question by direct observation.
- **Why declined:** the iteration contract restricts writes to this run directory (`research/iterations/iteration-005.md`, `research/deltas/iter-005.jsonl`, and the append gateway's own ledger writes). `scratch/` is outside that list, so the probe is out of scope for a research iteration. Its exact command is recorded above for the implementation phase.

## Sources

- [SOURCE: .skilled/agents/orchestrate.md:35]
- [SOURCE: .skilled/agents/code.md:54]
- [SOURCE: .skilled/agents/code.md:17]
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json` (`components.schemas.Config.AgentEncoded`, `Agent.Info`)
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-debug-help.txt`
- Observed commands: `opencode debug agent {orchestrate,code,markdown}` (v1.19.3); `opencode2 api GET "/api/agent?location%5Bdirectory%5D=…"` (v2.0.32); `.opencode/agents` symlink target read via `ls -ld`.
