# Iteration 020 — A17: the final v1 + v2 gap ledger

## Focus

A17 irreducible gaps and the closest workaround for each: build the final gap ledger for perfect v1 + v2 compatibility, from this run's own evidence only. Classify every v1 feature the repo uses as (a) portable as-is, (b) portable with a mechanical change, (c) portable only with a behavioural workaround, or (d) irreducible on v2 or on v1. Synthesis iteration: no new host probes.

## Actions Taken

1. Read `research/steering-log.md` in full (all six batch entries, spot checks 1-3, the incident note, the rejection list at line 236) to establish which child findings the orchestrator overrode.
2. Read the findings blocks of `research/iterations/iteration-001.md` through `iteration-019.md` (47 finding headings plus the four surviving `- [ ]` question blocks).
3. Grepped all iterations and the steering log for the six candidates the focus named but the early phases may never have covered: `small_model`, `text.complete`, `autocontinue`, `vscode`, `lsp`, `CLAUDE.md`, `temperature`.
4. Classified each row against the overriding rule set, then counted the buckets.

No files outside this packet were read for evidence, nothing was installed, and no `opencode2 service` verb was run.

## Findings

### F1 — The ledger is 47 rows: 9 (a), 21 (b), 4 (c), 9 (d), 4 UNKNOWN

The v1 feature surface this repo actually uses is overwhelmingly *mechanically* portable. The interesting result is the shape of the two small buckets: every (d) row is either an **install-channel* property or a **v2 platform gap**, and every (c) row is a **state or timing** problem. None is a repo-code defect that a cleverer implementation would fix. Citations per row in the ledger below.

### F2 — The two worst gaps are not in the plugin API at all

They are (i) reading message parts, because v2's plugin context has no `client` and the message list carries no `parts` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-018.md], and (ii) the global form of `command.execute.before` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-003.md:61]. Both hit plugins whose *entire* behaviour is a side observation, which is why they read as irreducible: there is no destination for "watch everything the user runs".

### F3 — `permissions` in one `opencode.json` is a total-failure class, not a degradation

v1 1.19.3 does not ignore the v2 key: it exits 1 with "V2 permissions are not supported by OpenCode V1" and the project never starts — confirmed by the orchestrator [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/steering-log.md:157]. Every other config divergence in this run degrades; this one blocks. The consequence for the ledger is that the single-file config promise is (d), and the workaround — author the v1 `permission` map only — *caps* what v2 can express, because v2's rule list is rewritten into that map rather than the reverse [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-008.md:147].

### F4 — `run --standalone` is a (b) with a scalability cost nobody priced

The env-propagation fix is a flag, so it is mechanical. But the underlying reason is that on v2 the plugin runs inside a long-lived daemon shared by every concurrent client, with a frozen environment, while on v1 it runs in a child of the CLI process and inherits that invocation's env [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-014.md]. Mandating `--standalone` buys per-child env and pays for it with a private server per child: no plugin state — counters, locks, caches — can be shared between concurrent children on v2 unless it is persisted outside the process. `system-deep-loop-guard` and `system-completion-sentinel` both hold such state.

### F5 — Four of the focus's candidates have zero evidence in this run

`VS Code extension`, `LSP` and `CLAUDE.md` appear nowhere in iterations 1-19 (LSP only as an unrelated key in the v2 config schema listing, [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-008.md:14], and as a v1 `debug` subcommand, [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-002.md:116]). Skill permission keys and `allowed-tools` were opened and left open. The ledger marks these UNKNOWN rather than guessing — a classification invented here would be the one row a reader could not check.

### F6 — `experimental.*` is 5 rows, not 1: two have destinations, three do not

The migrate page gives `shell.env`, `chat.*` and most of `experimental.*` a home, but names five genuinely irreducible items: `experimental.compaction.autocontinue`, `experimental.provider.small_model`, `experimental.text.complete`, the global `command.execute.before`, and `$` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-003.md:61]. The repo uses none of the three `experimental.*` items today, so their (d) class costs nothing *now*; it is a ceiling on what the plugin tree can grow into on v2.

## The ledger

Class key: **a** portable as-is · **b** mechanical change · **c** behavioural workaround · **d** irreducible · **?** not established by this run.

### A. Plugin runtime

| # | v1 feature | Class | User-visible effect on the other host | Closest workaround | Citation |
|---|---|---|---|---|---|
| 1 | Dual default export `{ id, setup, server }` | **a** | none | none needed | steering-log.md:106 (spot check 1), iteration-002.md, iteration-014.md |
| 2 | Module-level singletons, counters, caches | **c** | per-invocation on v1, cross-client-global on v2: guard/sentinel state leaks between concurrent users | key all state by sessionID, reset in `setup`'s Cleanup | iteration-003.md, iteration-014.md |
| 3 | `import @opencode-ai/plugin/tool` and `tool()` | **b** | tool never registers on v2 | drop the import (it is an identity function), declare a plain object; v2 uses `ctx.tool.transform` | iteration-011.md, iteration-018.md |
| 4 | `zod` as a phantom dependency | **b** | plugin crashes on a clean install | declare zod; emit the v2 JSON Schema with `z.toJSONSchema` | iteration-011.md |
| 5 | Flat `.opencode/plugins/*.js` discovery | **a** | none — v2 discovers flat, singular-plural and directory layouts | none; the plugin tree needs no layout migration | iteration-014.md |
| 6 | `.opencode/hooks/` as a loaded surface | **a** | none — it is not a host concept on either version | none; it stays plugin-consumed data | iteration-010.md |

### B. Events and session triggers

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 7 | `session.idle` | **b** | silent if unsubscribed | subscribe via `ctx.event.subscribe`; `session.status` is a second, richer idle signal | iteration-012.md (overturns iteration-004.md) |
| 8 | `session.compacted` | **b** | compaction actions never re-arm | same, plus the four `session.compaction.*` events | iteration-012.md |
| 9 | `session.created`, `session.execution.*` | **b** | per-turn bookkeeping stops | pull subscription with the same names | iteration-012.md |
| 10 | `permission.*`, `question.*` | **b** | questions arrive as forms, prompts stall | `permission.*` keeps v1 names; map `question.*` → `form.*` | iteration-004.md, iteration-012.md |
| 11 | Reading message parts (completion sentinel, spec gate) | **c** | sentinel loses the final assistant text so completion actions misfire; spec gate cannot see the prompt | read `session.hook("context")`'s `SessionContext` and `session.hook("prompt")` and cache per session — the list has no `parts` and there is no `ctx.client` to fetch them | iteration-006.md, iteration-018.md |
| 12 | Global `command.execute.before` | **d** | a plugin can no longer observe commands it did not register | no equivalent; register a transform per command, or move the check into a tool/`context` hook | iteration-003.md:61, iteration-018.md |

### C. UI

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 13 | Server-side `client.tui.showToast` (`sk-vision`, 2 call sites) | **d** | no visible feedback on v2 — the vision tool succeeds silently | emit `tui.toast.show` on the bus (string proven present in the 2.0.32 binary, plugin-facing route unproven) or move the notice to a client-side TUI plugin, which runs on v2 | iteration-012.md, iteration-016.md, iteration-018.md |

### D. Agents

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 14 | Per-agent `temperature` | **d** | 9 low-temperature agents are less deterministic on v2; the value is carried into `request.body` and never sent | keep the field (harmless, forward-compatible) and add the determinism instruction to the body text | iteration-005.md:41 |
| 15 | `permission:` map | **b** | v1 refuses to start if `permissions:` is used instead | author the v1 map only; v2 translates it one way, `bash`→`shell`, `task`→`subagent` | iteration-008.md:147 |
| 16 | `chrome_devtools: deny` | **b** | protects nothing on v2 (inert action name) | add `browser: deny` beside it | iteration-005.md |
| 17 | Bodies naming the `Task` tool | **b** | agents instruct a tool v2 does not have under that name | body ships verbatim; name both (`Task`/`subagent`) | iteration-005.md |
| 18 | v1's derived `tools` gate | **c** | per-agent tool restriction is advisory only on v2 | express it as permission rules, or accept the wider surface | iteration-005.md |
| 19 | `steps`, `hidden`, `color`, `disabled` | **b** | leak into v1 `options` / v2 `request.body` | omit them; they are not needed for parity | iteration-008.md:14, iteration-008.md:20 |

### E. Config

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 20 | One `opencode.json` carrying `permissions` | **d** | v1 exits 1 with "V2 permissions are not supported by OpenCode V1" — the project will not start | one authored file in the v1 shape, or generate the v2 file; v2-side richness is unreachable | steering-log.md:157, iteration-008.md |
| 21 | `plugin` vs `plugins` key | **a** | none — the repo declares zero config plugins; v2 honours the singular form if one is ever added | none | iteration-003.md, iteration-014.md |
| 22 | MCP server spelling | **a** | none — `mcp.servers.<name>` is the one shape v1 unwraps | use `mcp.servers` alone | iteration-008.md |
| 23 | Non-command `.md` under the commands tree registers as a command | **b** | spurious slash commands appear on *both* versions — an existing defect, not a v2 regression | change the suffix (`.txt`, `.contract`) or move the file out of the tree; no frontmatter opt-out exists on either version | iteration-007.md |

### F. Skills

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 24 | Skill discovery, ids, nested packets, symlinked roots | **a** | none — both versions expose the same 60 repo skills | none | iteration-009.md |
| 25 | `allowed-tools`, `disable-model-invocation` | **?** | unknown; used in 57 files, so a v2 meaning change would be a silent behaviour break | re-read both frontmatter keys against each host before shipping | iteration-009.md |
| 26 | Vendored `node_modules` inside the skills root | **c** | dependency packages appear in the skill catalog on both versions | move the vendored tree out of the skills root; no suppression key is established | iteration-009.md |

### G. Install, dispatch and runtime environment

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 27 | Client env reaching plugins | **b** | `AI_SESSION_CHILD`-gated rules are silently off inside a shared v2 daemon | dispatch children with `run --standalone`; a plugin can never rely on the daemon's env | steering-log.md:210, iteration-014.md |
| 28 | Shared `OPENCODE_DB` | **b** | v1 dies fatally, "Database is not empty and has no session table" | one database per version; the launcher already defaults `opencode-v2.db` | iteration-014.md |
| 29 | `opencode upgrade` | **d** | `--major` is documented as "upgrade to OpenCode 2 and remove OpenCode 1" — it deletes the v1 install | never run `--major`; pin, and keep the two installs in separate npm prefixes | iteration-015.md |
| 30 | Homebrew channel | **d** | there is no v1 formula; a brew install cannot be v1 | npm prefix for v1, brew for v2 only | iteration-015.md |
| 31 | `opencode debug config`-style version guards | **b** | the guard at `SKILL.md:134` fails on v2 because `--version` formats differ (`1.19.3` vs `opencode v2.0.32`) | parse both shapes, detect by parsed version not binary name | iteration-013.md, iteration-015.md, [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134] |
| 32 | Dispatch hard-rules | **b** | they fail open on `opencode2`, and `command-flag-for-slash-prompt` hard-blocks a correct v2 run | one version-aware matcher; v2 path uses `session.command` | iteration-010.md |
| 33 | `run --command` | **b** | slash prompts do not expand | `POST /api/session/{id}/command`, or a `/name args` message | iteration-007.md, iteration-013.md |
| 34 | Seven `run` flags (`--attach`, `--port`, `--dir`, `--pure`, `--share`, `--variant`, `--command`) | **b** | documented recipes fail on v2 | v2 equivalents per the flag matrix; positional directory unverified | iteration-013.md |
| 35 | `-m provider/model#variant` | **b** | one string may not serve both | v2 form is schema-legal; the v1 half is still inconclusive | iteration-012.md, steering-log.md:210 |
| 36 | `--dangerously-skip-permissions` | **a** | hidden alias of `--auto` in both binaries | none for existence; whether v2 `run` inherits it is unverified | steering-log.md (batch-4 checks) |

### H. Tooling traps

| # | Trap | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 37 | `opencode2 api --param` and deepObject query params | **b** | the location is silently dropped and the query resolves to home — two commands instead of 54 | use the raw, percent-encoded query string | steering-log.md:157 |
| 38 | Piping `opencode2 api` output | **b** | truncation mid-string at ~63 KB and ~290 KB | redirect to a file, then parse the file | steering-log.md:157, iteration-017.md |
| 39 | v1 per-plugin load oracle | **a** | none — it exists and works | `debug config </dev/null` for discovery plus the `msg="loading plugin"` / `failed to load plugin` log lines for outcome | iteration-017.md |

### I. The remaining v1 hook surface

| # | v1 feature | Class | Effect | Workaround | Citation |
|---|---|---|---|---|---|
| 40 | `experimental.compaction.autocontinue` | **d** | auto-continue after compaction does not happen | the `compaction` hook is the closest hook point; re-prompt yourself | iteration-003.md:61 |
| 41 | `experimental.provider.small_model` | **d** | no cheap-model routing | pin the model per call site instead | iteration-003.md:61 |
| 42 | `experimental.text.complete` | **d** | no side-call text completion | no route; make an ordinary provider call | iteration-003.md:61 |
| 43 | `$` shell helper | **a** | none — no repo plugin uses it | if ever needed, manage the process API directly (node `child_process`) | iteration-003.md:61 |
| 44 | `shell.env`, `chat.*` | **b** | rewritten hook names | per the migrate page; the pin itself was not re-verified for a `shell` domain | iteration-003.md, iteration-018.md |

### J. Never established by this run (honest holes)

| # | Feature | Class | Why it matters | What would settle it | Citation |
|---|---|---|---|---|---|
| 45 | VS Code extension | **?** | zero mentions in iterations 1-19 | read the v2 docs' extension surface and test one attach | none — absent from this run |
| 46 | LSP | **?** | only seen as a v2 config key and a v1 `debug` subcommand | diff `opencode debug lsp` against the v2 equivalent | iteration-008.md:14, iteration-002.md:116 |
| 47 | `CLAUDE.md` | **?** | zero mentions; the repo relies on host-loaded instruction files | check whether either host reads it | none — absent from this run |

Counts: 47 rows — 9 (a), 21 (b), 4 (c), 9 (d), 4 UNKNOWN.

## What "perfect compatibility" can honestly mean here

Perfect compatibility for this repo means **one plugin tree, one agent frontmatter shape, one command tree and one skill tree that load and behave on both versions, with a small, named, documented list of features that only one version honours** — not identical behaviour. On this run's evidence that is achievable: 30 of the 47 rows are (a) or (b), including every structural surface that would otherwise force a fork (the dual default export, flat plugin discovery, agent frontmatter, commands, skills, MCP spelling). What cannot be promised is behavioural identity, because nine rows are (d) and not one of them is repairable in this repository: two are install-channel facts (`upgrade --major`, the missing v1 formula), three are v2 platform gaps in sampling and auxiliary model calls, one is the absence of a server-side UI channel, one is the v1 refusal of `permissions` that caps v2's permission expressiveness, and one is the global command observer that has no v2 destination. Add the four rows this run never established, and the honest claim is: *loads and runs on both, with a documented capability delta that the docs and the doctor check report rather than hide*. Anything stronger — including "we test it, so it works" — would overstate a contract the v2 side does not itself guarantee.

## Questions Answered

- A17: the gap ledger is complete for every feature this run has evidence about, classified and cited row by row, with four rows explicitly marked unestablished.
- Implicit in F4: the cost of the `--standalone` mandate is loss of cross-client plugin state — a follow-on design constraint for `system-deep-loop-guard` and `system-completion-sentinel`.

## Questions Remaining

Carried open, unchanged by this iteration: v1 tolerance for `plugins` (plural) input; `sk-vision.js` symlink following on either host; `run --format json` schema and `--standalone`'s effect on it; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1 1.19.3; hidden `--dangerously-skip-permissions` inheritance by v2 `run`; `models <provider>` on v2; `#`-in-model shell safety across zsh/fish/`sh -c`; skill permission key, root precedence, `disable-model-invocation`, `allowed-tools`, the `node_modules` leak; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`; v2 `run` positional-directory behaviour; `SessionHooks.context` firing for compaction and title kinds; the `tui` RPC id and method set; `Tool.ValueSchema`; `POST /api/plugin/check` accepting a callable with extra keys; whether `@opencode/plugin@2.0.32` re-exports zod; the two scope-package relationship; `opencode --version` exact output on the v2 binary; v1's build-suffix format; `bun`/`pnpm` global two-prefix support; v2 service survival across `uninstall`.

## Next Focus

The A17 ledger closes the run. The next unit of work is not research: it is (1) the four UNKNOWN rows, each a one-probe question now that the rest of the ledger is stable, and (2) the implementation packet this ledger implies — the dual-export template, the version-aware dispatch matcher, the v1-shape config, and the `/doctor:opencode` check list. Both belong to a follow-up action, not to a further research iteration.

## SCOPE VIOLATIONS

None. All writes are under this packet's `research/` directory.
