# Symlink engine contract

The frozen interface every lane builds against: the engine, its tests, the workflow YAMLs, the routers and the presentation texts. Change it here first, never in one lane alone.

## Files

- Engine: `.skilled/commands/doctor/scripts/symlink-engine.cjs` (CommonJS, Node built-ins only, no new dependency)
- Data: `.skilled/commands/doctor/assets/symlink-manifest.json`
- Tests: `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` (`node:test`, temp trees under `os.tmpdir()`)

## Invocation

```
node .skilled/commands/doctor/scripts/symlink-engine.cjs <check|plan|apply|unlink> [flags]
```

| Flag | Subcommands | Meaning |
|---|---|---|
| `--root <dir>` | check, plan, apply | Target project repo. Required. Must exist and be a directory. |
| `--source <dir>` | all | Skilled checkout. Default: `fs.realpathSync(__dirname)` then four levels up (scripts → doctor → commands → .skilled → checkout root). |
| `--runtimes <csv>` | check, plan, apply | Any of `claude,opencode,codex,cursor,devin,pi,hermes`. Default: the runtimes whose primary entry already exists in the root (as a link or a real path). `core` (`.skilled`) is always included. |
| `--mode auto\|whole\|merge` | plan, apply | Default `auto`. |
| `--include <csv>` | check, plan, apply | Opt-in extras: `repo-rules,github,utcp,env`. |
| `--link-instructions` | check, plan, apply | Also link the instruction files (`AGENTS.md`, `CLAUDE.md`, `REPO RULES.md`). |
| `--ignore exclude\|gitignore\|none` | plan, apply | Where ignore lines go. Default `exclude` = `<git-dir>/info/exclude`. |
| `--plan-digest <d>` | apply | Required for apply. |
| `--run <dir>` | unlink | A run directory printed by apply. Required for unlink. |
| `--dry-run` | unlink | Print what unlink would do; write nothing. |
| `--yes` | unlink | Perform the unlink. Without `--dry-run` or `--yes`, unlink prints its plan and exits 2. |
| `--json` | all | Print exactly one JSON object on stdout and nothing else. |

Unknown flag, flag on the wrong subcommand, missing value, unknown runtime/extra/mode, or a second positional: exit 2 with a one-line `ERROR:` message on stderr.

Refusals (exit 2): root missing or not a directory; root equals the source, sits inside it, or contains it.

## Exit codes

- `0` the subcommand ran (check and plan report findings in output, not via exit code)
- `1` apply or unlink failed part-way (the error names the action; already-applied actions stay recorded in the run manifest)
- `2` bad invocation or refused root
- `3` apply digest mismatch (nothing written)

## Manifest (`assets/symlink-manifest.json`)

```json
{
  "schema_version": 1,
  "core": [{ "name": ".skilled", "kind": "dir" }],
  "runtimes": {
    "claude":   [{ "name": ".claude", "kind": "dir" }, { "name": ".mcp.json", "kind": "relative-link", "target": ".claude/mcp.json" }],
    "opencode": [{ "name": ".opencode", "kind": "dir" }],
    "codex":    [{ "name": ".codex", "kind": "dir" }],
    "cursor":   [{ "name": ".cursor", "kind": "dir" }],
    "devin":    [{ "name": ".devin", "kind": "dir" }],
    "pi":       [{ "name": ".pi", "kind": "dir" }],
    "hermes":   [{ "name": ".hermes", "kind": "dir" }]
  },
  "extras": {
    "repo-rules": [{ "name": "repo-rules", "kind": "dir" }],
    "github":     [{ "name": ".github", "kind": "dir", "merge_only": true }],
    "utcp":       [{ "name": ".utcp_config.json", "kind": "file" }],
    "env":        [{ "name": ".env", "kind": "file", "warning": "links the Skilled checkout's .env, so every tool started in this repository reads its secrets" }]
  },
  "instructions": [
    { "name": "AGENTS.md", "kind": "file", "source": "AGENTS.md" },
    { "name": "CLAUDE.md", "kind": "file", "source": "AGENTS.md" },
    { "name": "REPO RULES.md", "kind": "file", "source": "REPO RULES.md" }
  ]
}
```

- `kind: dir` and `kind: file` link to the absolute path `<source>/<source-or-name>`.
- `kind: relative-link` writes the given relative `target` text verbatim.
- `merge_only: true` never gets a whole-folder link; auto treats it as merge.
- An entry whose source path does not exist in the checkout is reported `source-missing` and planned as nothing.
- A runtime counts as present for detection when its first entry exists in the root.

## Entry status (check)

Every selected entry gets one `status`:

- `linked-whole`: a symlink whose realpath equals the realpath of its source path (or, for `relative-link`, whose link text equals the target).
- `linked-merge`: a real directory in which every source child is present as a link into the source, or a local path kept on purpose, recursively, with no broken source-pointing links.
- `partial-merge`: a real directory that is missing some source children or holds broken source-pointing links.
- `missing`: absent.
- `broken`: a symlink whose target does not exist.
- `foreign-link`: a symlink that resolves somewhere other than its source path.
- `local`: a real file or directory with no links into the source.
- `source-missing`: the checkout has no such path.

Each entry object: `{ name, group: "core"|"<runtime>"|"extra:<id>"|"instructions", kind, status, link_text?, missing_children: [], broken_links: [{path, link_text}], local_conflicts: [], ignored: true|false|null }` with paths relative to the root. `ignored` is `null` when the root is not a git work tree.

Repo-level fields in the report: `detected_runtimes`, `tracked_absolute_links` (from `git -C <root> ls-files -s`, mode `120000`, whose link text is absolute), `git: true|false`.

A broken link is "source-pointing" when its absolute link text, with its deepest existing ancestor canonicalized (so `/var/...` and `/private/var/...` agree), equals the canonical source path or sits under it on a path-segment boundary (a sibling such as `Skilled-old` is not inside `Skilled`). Only source-pointing broken links are ever replaced or removed; every other link and every real file is left alone.

## Merge semantics

Three source paths are never mirrored into a merged directory: any `.DS_Store`, the checkout's `.skilled/output` (run records and other per-checkout output) and `.claude/worktrees` (Claude Code's per-checkout session state).

Merge walks recursively:

- source child absent in root → `link` it (absolute target)
- root child is a link to that source child → nothing
- root child is a broken source-pointing link → `replace-link` when the source child exists
- root child is a real directory and the source child is a directory → recurse
- root child is any other real path → `local_conflicts` entry, kept, never touched
- root child is a broken source-pointing link whose source path no longer exists → `remove-broken`
- a root child with no source counterpart is local and is left alone, except a broken source-pointing link, which is `remove-broken`

## Plan

`plan` resolves an action list and writes nothing. Actions, sorted by `path`, then by op order `mkdir, replace-link, remove-broken, link, ignore-add`:

- `{ op: "mkdir", path }`
- `{ op: "link", path, target }`
- `{ op: "replace-link", path, from, target }`
- `{ op: "remove-broken", path, from }`
- `{ op: "ignore-add", file, lines: [] }` (`file` relative to the root, e.g. `.git/info/exclude` or `.gitignore`; skipped with a warning when the root is not a git work tree or `--ignore none`)
- `{ op: "refuse", path, reason }` is reported in `refusals`, never applied

Mode rules for a top-level entry:

| Root state | auto | whole | merge |
|---|---|---|---|
| absent | whole link (merge for `merge_only`: mkdir + child links) | whole link | mkdir + child links |
| link to its source | nothing | nothing | nothing (reported "already linked whole") |
| broken source-pointing link | replace-link | replace-link | replace-link |
| foreign or broken non-source link | refuse | refuse | refuse |
| real directory | merge | refuse ("a real folder exists; use --mode merge") | merge |
| real file (file kinds) | refuse | refuse | refuse |

Ignore lines: `/<name>` for each top-level whole link created or replaced, `/<path>` for each link created inside a merge directory, and only lines git does not already ignore (`git check-ignore -q`). Instruction files and `.mcp.json` follow the same rule.

Digest: lowercase hex sha256 of `JSON.stringify({ source, root, actions })` with both paths realpath-resolved. Text output ends with the line `PLAN DIGEST: <64 hex>`. An empty action list prints `NOTHING TO DO` and still prints the digest.

## Apply

`apply --plan-digest <d>` recomposes the plan with the same flags. A different digest prints `DIGEST MISMATCH` and exits 3 having written nothing. Otherwise it applies the actions in order and writes the run record before the first action and after each one:

`<source>/.skilled/output/doctor-symlink/<first 16 hex of digest>/manifest.json`

```json
{ "schema_version": 1, "root": "...", "source": "...", "digest": "...", "created_at": "<ISO>",
  "applied": [{ "op": "...", "path": "...", "target": "...", "from": "..." }],
  "created_dirs": ["..."],
  "ignore_added": { "file": "...", "lines": [] } }
```

Apply never deletes or overwrites a real file or directory; the only removals are source-pointing broken links. After the last action it reruns `check` and prints its summary, then prints the undo command:

`node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run <run dir> --dry-run`

## Unlink

Reads the run manifest. For each applied action in reverse order:

- `link`: remove the path only when it is still a symlink with the recorded target text
- `replace-link`: restore the recorded `from` text only when the path still holds the recorded target text
- `remove-broken`: recreate the link with the recorded `from` text when the path is absent
- `created_dirs`: remove deepest first, only when empty
- `ignore_added`: remove exactly the recorded lines from the recorded file

A path whose state no longer matches the record is skipped and reported as `changed since apply`. Unlink keeps the run directory.

## Text output

One human line per entry: `<status padded> <group> <name>` with indented detail lines for missing children, broken links and local conflicts. Then repo-level warnings (`tracked absolute link: <path> -> <text>`, extras warnings). Plan adds one line per action and per refusal. The presentation files own the framing around this output; the engine output stays plain.
