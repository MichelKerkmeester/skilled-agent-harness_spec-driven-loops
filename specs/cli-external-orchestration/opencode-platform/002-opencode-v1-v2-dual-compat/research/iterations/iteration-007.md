# Iteration 007 — A6: Commands on OpenCode v1 1.19.3 and v2 2.0.32

## Focus

Command discovery and semantics on both hosts: which files under the commands tree each version
registers, whether any convention excludes non-command Markdown, what each frontmatter key actually
does, which template features survive, and what replaces `opencode run --command` on v2.

## Actions Taken

1. **v1 discovery ground truth (runtime).** Started `opencode serve --port 4599` and called
   `GET /command?directory=<repo root>`. 127 entries returned: 53 with `source:"command"`,
   73 with `source:"skill"`, 1 with `source:"mcp"`. Of the 53, `init` and `review` are builtins, so
   **51 project commands** — exactly the 51 `.md` files on disk under `.skilled/commands`.
2. **v1 filter probe (synthetic tree, `/tmp/cmdprobe`).** Created
   `.opencode/command/foo.md` (singular), `.opencode/commands/bar.md` (plural),
   `.opencode/commands/sub/nofm.md` (no frontmatter), `assets/readme.txt`, `assets/note.md.txt`,
   `assets/data.md.json`, then re-queried `/command?directory=/tmp/cmdprobe`.
3. **v1 frontmatter semantics probe (`/tmp/fmprobe`).** Two commands: one carrying
   `agent`, `model`, `subagent`, `allowed-tools`, `command: false`, `disable: true`; the other
   carrying `subtask`, `argument-hint`. Read the returned command objects.
4. **v2 discovery probe.** `opencode2 api GET /api/command` with
   `--param "location[directory]=<path>"` against the repo root, `/tmp/cmdprobe`, and `$HOME`, then
   again with `--standalone` for the repo root and `/tmp/cmdprobe`.
5. **v2 schema read.** `v2-openapi.json`: `/api/command` (`command.list`), `Command.Info`,
   `Config.CommandEncoded`, and `POST /api/session/{sessionID}/command` (`session.command`).
6. **Binary string census, both versions.** `$ARGUMENTS`, `argument-hint`, `allowed-tools`,
   `subtask` in `opencode.exe` (1.19.3) and `@opencode/cli` 2.0.32, plus a scan for v2's
   leading-slash argument parser.
7. **Repo-side census.** Frontmatter key frequency, `$ARGUMENTS` / `$1..$N` / `` !`cmd` `` / `@path`
   usage across all 51 command files.

## Findings

### F1 — v1 registers every `.md` file under the commands tree, exactly like v2 (P1)

The non-command registration seen on v2 is **not a v2 regression**. v1 1.19.3 registered all 51
on-disk `.md` stems with zero omissions, including `scripts/README`, `doctor/scripts/README`,
`doctor/scripts/tests/README`, `deep/assets/compiled/README`,
`deep/assets/compiled/deep-research.contract`, `deep/assets/compiled/deep-ai-council.contract`,
`deep/assets/compiled/deep-review.contract`, `deep/assets/legacy/README`,
`deep/assets/legacy/deep-research.body`, `deep/assets/legacy/deep-ai-council.body`,
`deep/assets/legacy/deep-review.body`. Probe output: `ON DISK BUT NOT REGISTERED: []`.

Consequence: the exclusion problem is **version-independent**, so a repo-side convention fixes both
hosts at once, and no version guard is needed for it. It also means the orchestrator's v2 list of
"54 commands" is consistent with the v1 list of 51 project commands plus builtins, not evidence of a
v2-specific deficiency.

### F2 — The only discovery filter on v1 is the `.md` suffix (P1)

In the synthetic tree, `foo` (from `.opencode/command/`) and `bar` and `sub/nofm` (from
`.opencode/commands/`) all registered. `assets/readme.txt`, `assets/note.md.txt` and
`assets/data.md.json` did **not** register. `sub/nofm.md` registered with `description: null`,
proving that **frontmatter is not required either**.

Two independent conclusions: (a) both `command/` (singular) and `commands/` (plural) are scanned by
v1, so the singular/plural split is *not* a v1 compatibility problem; (b) the extension is the
selector, and renaming away from a bare `.md` suffix de-registers a file.

### F3 — No frontmatter opt-out exists on v1 (P1)

The probe command carrying `command: false` **and** `disable: true` still registered with
`"subtask": null` and no suppression. There is no documented, observable "hide this file" flag, so
no frontmatter convention can be relied on for either host. Only relocation or extension change
works.

### F4 — Frontmatter semantics differ in ways the repo currently does not touch (P2)

Measured v1 behaviour, from the returned command objects:

| Key | v1 1.19.3 | v2 2.0.32 (schema) |
|---|---|---|
| `description` | surfaced; absent → `null` | `Config.CommandEncoded.description` |
| `agent` | surfaced verbatim (`"build"`) | `Config.CommandEncoded.agent` |
| `model` | surfaced verbatim, `#variant` kept as string | string `provider/model#variant` **or** object `{providerID, model, variant}` |
| `subtask` | honored (`subtask: true`) | present, described as *"Deprecated alias for subagent"* |
| `subagent` | **ignored** (`subtask` stayed `null`) | the canonical key |
| `argument-hint` | surfaced as `hints: ["<x>"]` | absent from the schema → presentation-only on v1 |
| `allowed-tools` | ignored (not in the command object) | absent from the schema → ignored |
| `title`, `trigger_phrases`, `importance_tier`, `version` | ignored | ignored |

So `allowed-tools` is decorative on **both** versions: it is not in either schema, and no tool
restriction was observed. Any repo doc claiming `allowed-tools` restricts a command is wrong.
`subagent` versus `subtask` is a real divergence, but it is currently inert — see F6.

### F5 — v1's command object is 8 fields; v2's `Command.Info` is 2 (P0 for verification tooling)

v1 returns `{name, description, agent, model, source, template, subtask, hints}` plus a `source`
discriminator that separates `command` / `skill` / `mcp` entries. v2's `GET /api/command` response
schema is `Command.Info {name, description}` with `additionalProperties: false`.

Therefore any `cli-opencode`-side registration check written against v1 (asserting `agent`, `model`,
`hints`, or `source`) cannot be reused on v2, and any check asserting `source === "command"` silently
mis-classifies on v2 because that field does not exist. Verification must be per-version.

### F6 — Contradiction: v2 2.0.32's `/api/command` returns no project commands at all (P0)

Every v2 probe returned builtins only:

- repo root, `--param location[directory]=<repo root>` → `{"location":{…},"data":[]}`
- repo root, `--standalone` → `{"location":{…},"data":[]}`
- `/tmp/cmdprobe` (which holds both `command/foo.md` and `commands/bar.md`), `--standalone` →
  `{"location":{"directory":"/private/tmp/cmdprobe"},"data":[]}`
- `$HOME` with no location → `data:[{init…},{review…}]`, i.e. builtins only

This directly contradicts the orchestrator's earlier probe, which reported 54 commands registered on
v2 including slash names such as `deep/research`. Recorded as a contradiction, not a halt. Two
readings remain open: the endpoint is builtins-only in 2.0.32, or its project-command path needs a
project state that `api`/`--standalone` does not establish. Either way, **`GET /api/command` must not
be used as the v2 registration oracle**. The decisive oracles that remain are
`POST /api/session/{sessionID}/command` (a 404 `CommandNotFoundError` proves name lookup against the
registry) and a behavioural `run` probe.

### F7 — v2 has no `--command`; two candidate replacements, one schema-confirmed (P0)

v1 `run --help` offers `--command "the command to run, use message for args"`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-run-help.txt:14].
v2 `run --help` has no such flag and no `--command`; its only input is `message...`, with `--format
default|json` retained.

- **Confirmed by schema:** `POST /api/session/{sessionID}/command` takes
  `{name, text, files?, agents?, skills?, delivery?}` (`name` and `text` required) and documents
  `CommandNotFoundError` (404) and `CommandExecutionError` (500). The `{name, text}` split is v1's
  `--command` + `message` pair restated, so the API is the faithful non-interactive replacement.
- **Plausible but UNVERIFIED:** `/name args` as the `run` message. 2.0.32's binary contains a
  parser of the shape `if(!o.startsWith("/"))return; let[s,...a]=o.slice(1).split(/\s+/); return
  {name:s,args:a.join(…)}`, and a send path that calls `session.command({sessionID, name, …})`.
  That is a leading-slash parser, but the strings census cannot prove it is wired into `run` rather
  than only the TUI. Confirming it costs one cheap run and is carried forward.

### F8 — Repo blast radius of template features is one file (P2)

Across the 51 command files: 40 use `$ARGUMENTS`, **0** use `$1..$N`, exactly **1** uses a leading
`` !`cmd` `` shell injection, exactly **1** uses an `@path` include.

- Shell injection: [SOURCE: .skilled/commands/speckit/search.md:15] — a single `!`bash -c …' --
  '$ARGUMENTS'`` line inside the template. If v2 dropped shell injection this is the whole exposure.
- `@path`: [SOURCE: .skilled/commands/design/extract.md:12] — `@.skilled/skills/…/creation-contract.md`.

So a v1→v2 command-template port is a one-file decision, not a 51-file rewrite. `$ARGUMENTS` is
present in both binaries' string tables (17 hits in v1, 4 in v2), so it is the portable placeholder.

### F9 — Frontmatter key census: the divergent keys are unused (P1)

45 `description`, 39 `argument-hint`, 39 `allowed-tools`, 7 `title`, 6 `trigger_phrases`,
5 `importance_tier`, 1 `version` — and **zero** `agent`, `model`, `subtask` or `subagent`
declarations anywhere in `.skilled/commands`. Typical frontmatter:
[SOURCE: .skilled/commands/deep/research.md:1] (`description`, `argument-hint`, `allowed-tools`
only).

The F4 divergences therefore cost nothing today, and the cheapest dual-compat rule is to keep them
unused: do not start declaring per-command `agent` / `model` / `subtask` / `subagent` while both
hosts must work.

### F10 — Recommended exclusion convention: extension change, not flags, and not a version guard (P1)

Because no suppression flag exists on v1 and none is proven on v2, and because both hosts scan
recursively for `.md` only, the portable rule is:

1. Non-command `.md` files under a commands tree must **not end in `.md`**. Renaming
   `README.md` → `README.txt` (the repo already does this for `commands/README.txt` and
   `create/README.txt`, which is why those never appeared as commands) and
   `*.contract.md` → `*.contract.md.txt` de-registers them on both hosts with no version guard.
2. The cleaner variant is relocation: compiled contracts and legacy bodies live under a commands
   tree only because the tree doubles as an asset store. Moving them under the owning skill's
   `assets/` removes them from both hosts' discovery permanently.
3. **Do not** add a frontmatter flag: unproven on v2 and demonstrably absent on v1 (F3).

Scope hazard for the implementation step (not executed here): `.opencode/commands` is a symlink to
`.skilled/commands`, so every rename or move also rewrites repo-internal references and the
`create` command's own asset paths.

## Questions Answered

None fully. This iteration supplies the command half of key question 2 but does not close it; the
question now reduces to agent, skill and `opencode.json` parity only.

## Questions Remaining

- Does v2 `run` expand a `/name args` message end-to-end, or is `POST /api/session/{id}/command` the
  only reliable non-interactive route? (F7, one cheap run settles it)
- Does v2 scan `.opencode/command` (singular), `.opencode/commands` (plural), or both? v1 does both;
  v2 discovery returned nothing either way, so the singular/plural question is still open.
- Why does v2 `/api/command` return no project commands while the earlier orchestrator probe saw 54?
  (F6)
- Does v2 still support `` !`cmd` `` shell injection and `@path` includes in command templates?
  Only one repo file depends on each, but the answer decides whether it needs a rewrite.
- Does v2 tolerate unknown frontmatter keys (`argument-hint`, `allowed-tools`, `title`,
  `trigger_phrases`, `importance_tier`) given `Config.CommandEncoded` is
  `additionalProperties: false`? 39 repo commands carry two unsupported keys each.

## Next Focus

A7: agents on both versions — discovery directories (`agent/` versus `agents/`), the
`.opencode/agents` symlink to `.skilled/agents` (16 files), frontmatter semantics (`description`,
`mode`, `model`, `tools`, `permission`, `temperature`, `top_p`, `hidden`), and the
`opencode2 debug agents` output as the v2 registration oracle, which also tests whether the
v1-versus-v2 oracle asymmetry found in F5 recurs for agents.
