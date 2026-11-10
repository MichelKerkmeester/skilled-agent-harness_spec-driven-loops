### .skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md

- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md:21 | 4 | §1 OVERVIEW is a bare paragraph: no `### Purpose` and no `### When to Use`, so the overview never opens with the two required headings and nothing tells a reader when to open the file. | Replace line 21 with:
  ```
  ### Purpose

  Hermes keeps shell hooks in the operator's user-level config and reads a repo plugin from `.hermes/plugins/`. This reference records both surfaces and the plugin hook map that carries the repo's guard cores into a Hermes session.

  ### When to Use

  - Deciding whether a guard belongs in a shell hook or the project plugin.
  - Checking which hook each repo guard core runs on.
  - Validating the plugin after a guard core changes.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md:35 | 7, 9 | "The hook-and-plugin phase" names spec phase `006-hermes-hook-and-plugin-layer` (a phase label in the body that goes stale), and the same sentence packs the plugin's location, delegation model and fail-open policy into one block. | Replace `The hook-and-plugin phase builds `.hermes/plugins/repo-guards/`, which re-implements nothing: each hook shells out to the existing `.mjs` or `.sh` core under `.skilled/hooks/` and maps its result to Hermes's block-or-continue contract, failing open on a core error as the `.pi/extensions/` adapters do.` with:
  ```
  The plugin at `.hermes/plugins/repo-guards/` re-implements nothing:

  - Each hook shells out to the existing `.mjs` or `.sh` core under `.skilled/hooks/`.
  - It maps the core's result to Hermes's block-or-continue contract.
  - It fails open on a core error, as the `.pi/extensions/` adapters do.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md:27 | 7 | One sentence packs four mechanisms — declaration path, consent allowlist, inspection command and the headless bypass — so a reader looking for the bypass must parse the whole line. | Replace line 27 with:
  ```
  Shell-script hooks:

  - **Declared:** under `hooks:` in `~/.hermes/config.yaml`.
  - **Gated:** by a per-command consent allowlist at `~/.hermes/shell-hooks-allowlist.json`.
  - **Inspected:** with `hermes hooks list|test|doctor`.
  - **Bypassed:** on a headless run by `--accept-hooks` or `HERMES_ACCEPT_HOOKS=1`; `hermes -z` sets it automatically.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md

- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:22 | 4 | §1 contains only `### Core Principle`: no Purpose and no When to Use, so the overview leads with a principle and gives no entry trigger. | Replace lines 20-22 with:
  ```
  ### Purpose

  The calling AI is the conductor; Hermes is the delegated executor.

  ### When to Use

  - Dispatching a write task to Hermes.
  - Running a read-only review through Hermes.
  - Cross-validating a finding against a sibling runtime.
  - Fanning out a research or review lineage.
  - Continuing a Hermes session.

  ### Core Principle

  Every pattern below ends with the conductor reading the exit code, stdout and stderr and verifying the result with the command the prompt named.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:46 | 7 | The fan-out paragraph packs five mechanisms — selection, the timeout floor with its evidence, MCP server naming, runtime behavior and the ceiling — into one block, so the 900-second floor is buried mid-paragraph. | Replace line 46 with:
  ```
  Use `--executor=cli-hermes` on `/deep:research` or `/deep:review`.

  - **Timeout:** set the lineage `timeoutSeconds` to 900 or more. The one live research iteration ran 1042 seconds against a 600-second setting and finished only because the runner's ceiling is twice `iterations × timeoutSeconds` (observed 2026-09-14).
  - **MCP servers:** a lineage may also name them in `liveTools.mcpServers`; the builder appends them to `-t`.
  - **Runtime:** builds the command, passes the prompt on stdin, applies write containment to the lineage directory, and treats exit 1 as failure.
  - **Ceiling:** keep `iterations × timeoutSeconds` under the four-hour lineage ceiling.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:71 | 7 | The handback paragraph folds a three-part report into one sentence, so the path audit — the item that catches an over-broad write — is easy to drop. | Replace line 71 with:
  ```
  Report three things:

  - What ran and what it returned (exit code, stdout head, `session_id:`).
  - What the verification command showed.
  - Which paths changed.

  A Hermes `COMPLETE` in stdout is a claim about itself until the verification command confirms it.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md

- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md:20 | 4 | §1 is a bare paragraph with no `### Purpose` or `### When to Use`, so the overview never opens with the two required headings. | Replace line 20 with:
  ```
  ### Purpose

  MCP servers reach a Hermes session only from the operator's user-level configuration; this reference records that boundary, the one operator step, the deny-by-default posture and what a dispatch may assume.

  ### When to Use

  - Working out whether a server is reachable from a Hermes dispatch at all.
  - Adding the repo's code-mode server as the operator.
  - Locking a newly added server down to the tools one task needs.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md:26 | 7 | One paragraph packs the config source, three command families, the per-run off switch and the cold-start cost, so the latency fact hides behind the management commands. | Replace line 26 with:
  ```
  - **Config source:** `mcp_servers:` is read from `~/.hermes/config.yaml` only (source-read: `hermes_cli/mcp_config.py`).
  - **Server management:** `hermes mcp add|remove|list|test|configure` manage it.
  - **Tool toggles:** `hermes tools list|disable|enable`, with `server:tool` notation.
  - **Per-run off switch:** `--safe-mode` disables all MCP servers for a run.
  - **Cold start:** the `chat` path waits for MCP cold start before its first tool snapshot, so a configured server adds startup latency to every dispatch.
  ```
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md:39 | 5 | `A dispatch never runs these.` is the skip gate for the operator command, but it sits after the command block, so a dispatch reader meets the command it must not run before it meets the prohibition. | Insert a new paragraph `A dispatch never runs these.` between line 32 and the code fence at line 34, and delete that sentence from line 39.
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md:39 | 7 | After the skip gate moves out, the remaining paragraph still packs three add-command observations into one clause chain. | Replace the paragraph with:
  ```
  Observed 2026-09-14:

  - `--args` must be the last option.
  - The command connects and discovers seven tools.
  - The "Enable all tools?" prompt needs an answer on stdin; a closed stdin cancels the add.

  A session reaches the server only when its name appears in the `-t` list (`-t search,todo,code_mode`).
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md

- [P1] .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:15 | 1 | The file has no H1: it opens with the intro paragraph, so the first heading is `## 1. OVERVIEW` and the title exists only in frontmatter, unlike every other reference in the directory. | Insert `# cli-hermes Providers, Models & Invocation` and a blank line before line 15.
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:21 | 4 | The overview opens with `### Core Principle` and has no `### Purpose`; the purpose sentence is folded into the principle. | Move lines 25-29 (`### When to Use` block) above line 21, insert `### Purpose` above it holding the first sentence of line 23 (`One place to answer "which provider, which model, which effort, how to dispatch" for cli-hermes.`), and leave the second sentence (`The roster is closed at five ids ...`) under `### Core Principle`.
- [P1] .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:62 | 9 | The body carries spec folder `071-cli-hermes-creation` (`amend the packet's spec (...)`), which sends a maintainer into a closed spec packet. | Replace `To add a model: amend the packet's spec (`071-cli-hermes-creation`), then` with `To add a model: amend the mode's spec, then`.
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:44 | 9 | `it never appears in a prompt, a repo file, or this packet` uses the container reference `this packet`, which rubric 9 names as a progress token. | Replace `it never appears in a prompt, a repo file, or this packet.` with `it never appears in a prompt or a repo file.`
- [P2] .skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:68 | 7 | One paragraph packs three mechanisms — the accepted level set, the fan-out pin and the direct-dispatch allowance — and the fan-out/direct split a reader must act on is buried. | Replace line 68 with:
  ```
  - **Accepted set:** `--reasoning` accepts `none minimal low medium high xhigh max ultra`, the same set as the runtime's `REASONING_EFFORTS`, so the builder forwards the effort without a map.
  - **Fan-out pin:** every Flash-family roster model is a reasoning model the runtime pins to `max` (`isFlashMaxPinnedModel`); a lower requested effort never reaches Hermes from the fan-out.

  A direct dispatch may pass any level; observed 2026-09-14 through the gateway:
  ```
