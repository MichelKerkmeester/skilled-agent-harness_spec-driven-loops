---
title: "Official CLI versus Obsidian MCP — Measured Comparison"
description: "A measured, command-by-command comparison of the two app-backed vault surfaces — the official obsidian CLI and the cyanheads obsidian-mcp-server — across both app states, with the resulting default for agent work in this skill."
trigger_phrases:
  - "cli versus mcp"
  - "obsidian cli or mcp"
  - "which obsidian surface"
  - "obsidian surface comparison"
  - "obsidian mcp latency"
  - "obsidian default surface"
importance_tier: "important"
contextType: "implementation"
version: 0.1.0.0
---

# Official CLI versus Obsidian MCP, Measured

Two surfaces drive a running Obsidian vault: the official `obsidian` CLI and the cyanheads `obsidian-mcp-server` over the Local REST API plugin. Both were exercised against the same live vault, in both app states, on 2026-09-02. This document records what each one did and which one the skill reaches for first.

---

## 1. OVERVIEW AND VERDICT

This reference answers one question: given a running Obsidian app, which of the two surfaces should an agent drive, and when should it switch. Section 2 records the machine and vault the numbers came from. Sections 3 and 4 hold the per-capability results in each app state, Section 5 the timings, Section 6 the rule that follows, and Section 7 what stayed unproven.

**Default to the official `obsidian` CLI, wrapped in a stdout error check.** Reach for the MCP server only for section-scoped editing, tag-list management, or a batch of more than roughly twenty calls, and only after confirming the Local REST API plugin is enabled.

Three measurements decided it.

| What decided it | The CLI | The MCP server |
|---|---|---|
| **Prerequisites** | The running app, nothing else | The running app **plus** an enabled Local REST API plugin, a bearer token, Node and `npx` |
| **Surface size** | 106 commands | 12 tools |
| **Worked on this machine as configured** | Yes | **No**. The plugin was installed but disabled, so every vault call failed |

The MCP server is better designed for an agent. It gives typed errors, a mandatory explicit target, and a create that refuses collisions. It still loses on the two things that decide a default: it does less, and it was not switched on. Section 6 states the rule that follows.

---

## 2. TEST CONDITIONS

| Item | Value |
|---|---|
| Machine | macOS, Obsidian desktop **1.13.7 (installer 1.13.4)** |
| Vault | One vault, 234 markdown files, 1582 files total, before and after |
| CLI | `/usr/local/bin/obsidian`, a root-owned symlink into the app bundle |
| MCP server | `npx -y obsidian-mcp-server@latest` resolved to **v0.12.3** over stdio |
| REST plugin | `obsidian-local-rest-api` **v5.1.0** ("Local REST API with MCP"), found **disabled** |
| Base URL | `https://127.0.0.1:27124` (the plugin's TLS port, not the documented `http://…:27123`) |
| App state | Found **closed**, opened for the app-up half, quit afterwards |

Every command wrote its stdout, stderr, exit status and elapsed time to separate files. Nothing was measured through a pipe, because the CLI exits 0 on failure and a pipe hides the status that already means nothing.

Scratch notes created and removed: `zz-cli-scratch` (renamed, moved, deleted), `zz-cli-tagtest`, `zz-mcp-scratch`. One `zz-cli-scratch-renamed 1.md` arrived by collision and was deleted. File counts match the baseline exactly.

---

## 3. APP CLOSED

Ten CLI commands spanning every family were run with the app down.

```bash
obsidian version        # exit 1, stderr, 76 ms
obsidian help           # exit 1, stderr, 47 ms
obsidian vaults         # exit 1, stderr, 42 ms
obsidian files total    # exit 1, stderr, 45 ms
obsidian read file=Home # exit 1, stderr, 43 ms
obsidian tags           # exit 1, stderr, 44 ms
obsidian backlinks file=Home  # exit 1, stderr, 38 ms
obsidian daily:read     # exit 1, stderr, 38 ms
obsidian bogusnonsense  # exit 1, stderr, 38 ms
```

All ten printed the same line to **stderr** and exited **1**:

```
The CLI is unable to find Obsidian. Please make sure Obsidian is running and try again.
```

`pgrep -x Obsidian` after all ten confirmed the app was **still closed**. The CLI does not launch it, contradicting the vendor page. App-down is the one case where `$?` carries a meaning.

The MCP server behaves differently, and the difference is useful. `npx -y obsidian-mcp-server@latest` **starts** with the app down: `initialize` and `tools/list` both succeed, because neither touches the vault. Every tool call then fails:

```json
{"result":{"content":[{"type":"text","text":"Error: fetch failed (failed after 4 attempts)"}],
 "structuredContent":{"error":{"code":-32603,"message":"fetch failed (failed after 4 attempts)"}},
 "isError":true}}
```

A client sees `isError: true` and a JSON-RPC code. That is a machine signal, not a string to match. The retry loop costs about two seconds per failed call (1965 ms for `obsidian_list_notes`), against the CLI's 40 ms.

---

## 4. APP OPEN

### 4.1 What each surface exposes

`obsidian help` printed **106 commands**, counted from the binary. The MCP server's `tools/list` returned **12 tools**. Its startup log names 14 constructed, with `obsidian_list_commands` and `obsidian_execute_command` withheld because `enableCommands` is false. Calling either withheld tool returns a JSON-RPC `-32602 Tool not found`, so the gate is visible to a caller.

The 12 exposed tools, all confirmed by a live call:

`obsidian_get_note` · `obsidian_list_notes` · `obsidian_list_tags` · `obsidian_open_in_ui` · `obsidian_search_notes` · `obsidian_write_note` · `obsidian_append_to_note` · `obsidian_patch_note` · `obsidian_replace_in_note` · `obsidian_manage_frontmatter` · `obsidian_manage_tags` · `obsidian_delete_note`

### 4.2 Capability by capability

Every cell below is backed by a call that was run and read. `n/a` means the surface has no command or tool for it.

| Capability | Official CLI | MCP server |
|---|---|---|
| **Read a note** | `read file=X` → raw content incl. frontmatter, 40 ms | `obsidian_get_note format=content` → content plus resolved path, 3 ms |
| **Read part of a note** | `outline file=X` → heading tree only | `format=section` returns one heading, block or frontmatter field. `format=document-map` catalogs headings and block IDs |
| **Read with metadata** | `file file=X` → path, size, ctime, mtime | `format=full` → content, parsed frontmatter, tags, stat, optional link parse |
| **Create** | `create name=X content=…` → `Created: X.md`. **Collides silently:** a second create made `zz-cli-scratch-renamed 1.md`, exit 0 | `obsidian_write_note` **refuses** a collision (`Error: Note 'X' already exists`) and names the three repair tools. Passing `overwrite: true` replaces |
| **Append** | `append file=X content=…` → `Appended to: X.md` | `obsidian_append_to_note`, which creates the file when absent |
| **Prepend** | `prepend file=X content=…` → `Prepended to: X.md` | Whole-file prepend n/a. `obsidian_patch_note operation=prepend` prepends inside a named section |
| **Edit in place** | n/a, no patch or replace command | `obsidian_patch_note` (replace a heading/block/frontmatter body) and `obsidian_replace_in_note` (literal or regex, ordered, body and frontmatter) |
| **Search** | `search query=… format=json` → bare path array, 271 ms cold. `search:context format=json` → `[{file,matches:[{line,text}]}]`, 43 ms | `obsidian_search_notes mode=text` → paginated hits with match offsets and a total, 7 ms. `mode=jsonlogic` takes a `logic` tree, not `query` |
| **Empty search result** | `No matches found.` on stdout, exit 0 | `0 on this page · 0 total`, `isError: false` |
| **List notes and folders** | `files [folder=][ext=][total]`, `folders`, which lists empty directories | `obsidian_list_notes` with `depth` and extension filters. **Returned `Not found: Tags`** for an empty directory the CLI lists |
| **Frontmatter read/write** | `property:read` / `property:set` / `property:remove` / `properties`, 43–57 ms. Values are written as scalars | `obsidian_manage_frontmatter` get/set/delete, JSON-typed values (string, number, boolean, array, object), 3–10 ms |
| **Tags on a note** | **No add or remove command.** `tag` and `tags` are read-only. `property:set name=tags value=zzprobe` writes the scalar `tags: zzprobe`, not a YAML list | `obsidian_manage_tags` add/remove/list, writes a real list, idempotent, and reports applied versus skipped. `location` targets frontmatter, inline or both |
| **Vault-wide tag index** | `tags total` → `8`. `tag name=X verbose` → count plus file list | `obsidian_list_tags` → counts descending, limit-aware |
| **Delete** | `delete file=X` → `Moved to trash`, no prompt, 54 ms. `permanent` → `Deleted permanently`, 40 ms | `obsidian_delete_note` is **permanent only** and **requires MCP elicitation**: a client that does not declare the capability gets `Cannot request input 'confirm'`. With it declared, 202 ms |
| **Move and rename** | `rename file=X name=Y`, `move file=X to=Folder`. Move **fails** into a non-existent folder (`ENOENT`) at exit 0 | n/a |
| **Open in the UI** | `open`, `tab:open`, `random`, `search:open` | `obsidian_open_in_ui`, with `failIfMissing` controlling open-or-create |
| **Resolved link graph** | `backlinks` `links` `orphans` `unresolved` `deadends`, each with `total` and `format=json\|tsv\|csv`. Measured: 220 orphans, 216 dead ends, 2 unresolved | **n/a** |
| **Tasks** | `tasks total` → `3`. `task` toggles, marks done or sets a status character | **n/a** |
| **Aliases** | `aliases total` → `0` | **n/a** |
| **Daily notes** | `daily` `daily:read` `daily:append` `daily:prepend` `daily:path` | Only through `obsidian_get_note target={type:periodic}`, which returned `No daily note found` and does **not** create one |
| **Bases** | `bases` `base:views` `base:query format=json\|csv\|tsv\|md\|paths` | **n/a** |
| **Sync and file history** | `sync:status` → `disconnected`. `history:list` → 16 files. Also `history:read` and `diff` | **n/a** |
| **Plugins, themes, snippets, workspaces** | `plugins:enabled` → 46. Also `plugin:enable\|disable\|install`, `theme:set`, `snippet:enable`, `workspace:save\|load` | **n/a** |
| **App commands and hotkeys** | `commands filter=app`, `command id=…`, `hotkeys` | Present in the build but **gated off** (`enableCommands` false) |
| **Templates** | `templates`, `template:read`, `template:insert` | **n/a** |
| **Arbitrary JavaScript** | `eval code=…` → `=> 237`, unsandboxed, 46 ms. Plus `dev:cdp`, `dev:dom`, `dev:screenshot` | **n/a** |
| **Vault stats** | `vault` → name, path, files, folders, size as TSV | Derivable from `obsidian_list_notes`, not reported directly |

### 4.3 Failure detection

This is where the two surfaces diverge most, and it is why the CLI needs a wrapper.

| Failure | CLI output | CLI exit | MCP result |
|---|---|---|---|
| Missing file | `Error: File "ZZZ-does-not-exist" not found.` on **stdout** | **0** | `isError: true`, `Error: Not found: …` plus a recovery sentence naming the tool to try |
| Unknown command or tool | `Error: Command "bogusnonsense" not found.` on **stdout** | **0** | JSON-RPC `-32602 Tool … not found` |
| Unknown vault | `Vault not found.` on **stdout**, **no `Error:` prefix** | **0** | n/a |
| Bad arguments | Silently ignored or reported as prose | **0** | `Input validation error: … expected object, received undefined` |
| Backend unreachable | app-down only: stderr, exit 1 | 1 | `isError: true`, code `-32603` |

An agent scripting the CLI must capture stdout and test its content for a leading `Error:` **and** for the bare `Vault not found.`. The MCP client reads one boolean.

### 4.4 Two hazards the CLI carries and the MCP server does not

**`obsidian read` with no target dumps the note the human has open.** Measured: a bare `obsidian read` returned **38176 bytes** of the operator's active note. `obsidian help` says most commands default to the active file, so `append`, `prepend`, `property:set` and `delete` write there too. The MCP tools make this impossible by construction: omitting `target` returns `Input validation error: target: Invalid input: expected object, received undefined`, and reaching the active file requires the explicit discriminator `{"type":"active"}`.

**`obsidian daily:read` creates today's daily note.** Isolated and reproduced: with `2026-09-02.md` removed, `daily:path` printed the path and created nothing, then `daily:read` returned empty output and the file existed. A read-shaped command mutated the vault. Use `daily:path` to test for a daily note, then `read path=<that>` to read one.

---

## 5. LATENCY

Ten reads of the same note through each surface, each call timed on its own.

| Surface | Startup | Per call (min / median / max) |
|---|---|---|
| Official CLI | none | **34 / 38 / 52 ms** |
| MCP, warm session | 724 ms once | **3 / 3 / 15 ms** |

The CLI spawns a process per invocation and pays roughly 38 ms every time. The MCP server pays its cost once, 724 ms on the fastest observed start and 2945 ms on the slowest, then answers in about 3 ms.

**Break-even is about 21 calls:** `724 / (38 − 3) ≈ 21`. Below that the CLI finishes first. Well above it, a warm MCP session wins by roughly twelve to one per call. A cold MCP call, which is what a one-shot script gets, costs 670–2800 ms against the CLI's 40.

---

## 6. THE RULE THIS SKILL FOLLOWS

**Among the two app-backed surfaces, the official `obsidian` CLI is the default.** Headless work is unaffected and still routes to `notesmd-cli`, which needs no app at all.

Reach for the CLI when:

- The task is anything file-shaped against a running app: read, create, append, prepend, move, rename, delete, search.
- The outcome needs the resolved link graph, tasks, aliases, Bases, sync, file history, templates, plugin or theme state, hotkeys, or the UI. The MCP server exposes none of these.
- The task is a handful of calls rather than a long batch.

Reach for the MCP server when **all** of these hold:

- The caller is already an MCP client, and it declares the `elicitation` capability if it needs to delete.
- The Local REST API plugin is enabled and answering (see the preflight below).
- The work is section-scoped editing, tag-list management, JSON-typed frontmatter, or more than about twenty calls in one session.

Never use `eval` where a named command exists. It runs unsandboxed JavaScript in the operator's live app, and a named command is inspectable where `eval` is not.

### The wrapper the CLI requires

Two things every script needs: a preflight that tests output rather than status, and a result check that reads stdout.

```bash
# Preflight. Exit status is meaningful ONLY here.
command -v obsidian >/dev/null 2>&1 || { echo "CLI not registered" >&2; exit 1; }
obsidian version 2>/dev/null | grep -qE '^[0-9]+\.[0-9]+' || { echo "Obsidian is not running" >&2; exit 1; }

# Every later call. The CLI exits 0 on failure, so test the text.
obs() {
  local out
  out="$(obsidian "$@" 2>/dev/null)"
  case "$out" in
    "Error: "*|"Vault not found."*) echo "obsidian: $out" >&2; return 1 ;;
  esac
  printf '%s\n' "$out"
}

obs append file="Project Log" content="- entry"   # always name the target
```

### The preflight the MCP server requires

`tools/list` succeeds with the app down and with the plugin off, so it proves nothing. Probe the plugin instead:

```bash
obsidian plugin id=obsidian-local-rest-api        # look for: enabled  true
curl -sk -o /dev/null -w '%{http_code}\n' "$OBSIDIAN_BASE_URL/"   # expect 200
```

---

## 7. WHAT WAS NOT SETTLED

| Unknown | The check that settles it |
|---|---|
| Where `delete` without `permanent` puts the file. It reported `Moved to trash`, and the file was in neither `<vault>/.trash` nor `~/.Trash` | Set the vault's trash option explicitly, delete a scratch note, and locate the file under each of the three settings |
| Whether `obsidian property:remove` can stall. One invocation was killed at 120 s during app startup, and two later runs returned in 43 and 57 ms | Run it against a scratch note during indexing and time it repeatedly |
| Why `obsidian_list_notes` returns `Not found` for an empty directory. The REST API answers 404 for `/vault/Tags/` while the CLI's `folders` lists it | Add a file to the directory and repeat both calls |
| Whether the withheld command tools work when enabled | Set `OBSIDIAN_ENABLE_COMMANDS=true` for the manual and re-run `tools/list` |
| The output shape of the sync, history, bases and dev command groups | Call each with `format=json` where offered and record the shape |
| Behavior with more than one vault open | Open a second vault and repeat the `vault=` targeting tests. This machine has one vault |
| Whether `daily:append` and `daily:prepend` create the daily note like `daily:read` | Remove today's daily note and run each in isolation. Both write to the operator's vault, so they were not exercised here |

---

## 8. RELATED

- Official CLI agent contract, preflight and safety invariants: [`official-cli-agent-usage.md`](official-cli-agent-usage.md)
- Both CLI profiles and the headless `notesmd-cli` surface: [`obsidian-cli-commands.md`](obsidian-cli-commands.md)
- MCP tool surface, Code Mode invocation and auth: [`mcp-tools.md`](mcp-tools.md)
- Failure diagnosis: [`troubleshooting.md`](troubleshooting.md)
