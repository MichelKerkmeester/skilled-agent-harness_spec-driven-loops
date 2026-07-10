# Iteration 006 — command + MCP authoring checklists (Facet 5b)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 6 findings — command + MCP authoring checklists

The two checklists (`command_authoring.md` v3.5.0.9, `mcp_server_authoring.md` v3.5.0.8) teach a **stale hand-authored model** for commands and a **bare-MCP-server model** for servers. Neither matches how commands or MCP servers are actually built today.

### Command checklist

**[P1] Checklist teaches a generic hand-authored-command model; reality is two distinct router architectures it describes neither.**
- **code-opencode doc:** `command_authoring.md:45-50` — steps are "Author the OpenCode command markdown", "Add or update execution-path YAML", "Mirror into `.claude/commands/` and `.opencode/prompts/`".
- **reality — Architecture A (contract-rendered router, `deep/` commands):** `.opencode/commands/deep/research.md:9` is a 9-line file whose *entire body* is one `!`backtick injection: `!`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/research -- '$ARGUMENTS'`. The renderer (`render-command-contract.cjs:66-73`) reads a **compiled contract** at `.opencode/commands/deep/assets/compiled/deep_research.contract.md` (479 lines, header at `:1` declares `"generatedBy": "...compile-command-contracts.cjs"` with ~10 `sourceDigests` carrying sha256 hashes), resolves a rollout mode (`fallback`/`fix` via `resolve-injection-mode.cjs:10-13`, governed by `command-injection-rollout.json` + `SPECKIT_COMMAND_INJECTION_MODE` env override `command:mode`), builds an **INVOCATION MESSAGE prelude** (`render-command-contract.cjs:79-96` — `ARGS_PRESENT`, `MESSAGE:` passthrough so the model sees raw `$ARGUMENTS`), and **appends an audit row to `manifest.jsonl`** (`render-command-contract.cjs:98-114`). None of this — compiled contract, compiler, source digests, rollout mode, invocation prelude, manifest audit — appears in the checklist.
- **reality — Architecture B (presentation+workflow router, `create/` commands):** `.opencode/commands/create/skill.md:9` declares "This command is a thin router" with a routing-asset *table* (`:17-21`: presentation.txt + `_auto.yaml` + `_confirm.yaml`) and numbered load/resolve instructions (`:25-33`). Again unmentioned.
- **recommendation:** Replace §3 STEPS with the two real architectures, naming the contract-renderer path (provisional: `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` — mid-migration from `deep-loop-workflows`) and the presentation+YAML router pattern. Add a decision step: "Does this command need a compiled contract (deep-loop family) or a presentation router (create/speckit family)?"

**[P1] Checklist cites dead `argument-hint` / `:auto`/`:confirm` reality only obliquely; PRE-BOUND SETUP ANSWERS schema is invisible.**
- **code-opencode doc:** `command_authoring.md:28,45` — mentions `:auto`/`:confirm` only as "behavior through YAML execution files" and "supported suffixes". No mention of `argument-hint` frontmatter or PRE-BOUND SETUP ANSWERS.
- **reality:** Both architectures use rich `argument-hint` frontmatter. `deep/research.md:3` and `create/skill.md:3` both carry `(:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)`. The `allowed-tools:` frontmatter (`deep/research.md:4`) pins the exact MCP tool allowlist. These are load-bearing authoring fields.
- **recommendation:** Add a frontmatter-authoring step documenting `argument-hint`, `allowed-tools`, and the PRE-BOUND SETUP ANSWERS convention (non-interactive setup via prompt-body block under `:auto`).

**[P2] Cross-runtime mirroring into `.claude/commands/` and `.opencode/prompts/` is a dead practice.**
- **code-opencode doc:** `command_authoring.md:38,49,58` — "Check mirror destinations: `.claude/commands/` and `.opencode/prompts/`"; "Mirror the command into `.claude/commands/` and `.opencode/prompts/`"; "Cross-runtime mirror parity check".
- **reality:** Both `.claude/commands/` and `.opencode/prompts/` **do not exist** (glob: no files found). Commands live only under `.opencode/commands/`. The `.claude/` runtime mirror is gone.
- **recommendation:** Delete the mirror steps/parity check, or restate as "verify `.opencode/commands/` is the sole source" with a note that historical `.claude/commands/` mirrors are deprecated.

### MCP checklist

**[P1] Checklist teaches a bare-MCP-server model; reality is a three-tier launcher + daemon + warm-CLI-front-door + socket-IPC architecture.**
- **code-opencode doc:** `mcp_server_authoring.md:26,46-52` — "authoring a new MCP server under `.opencode/skills/<skill-name>/mcp_server/`"; steps are choose language, add schemas, register tools, implement handlers, error envelope.
- **reality (skill-advisor exemplar):** An MCP server is a 3-piece assembly:
  1. **TS server** in `mcp_server/` built to gitignored `dist/` — `package.json:8` `tsc -p tsconfig.build.json`, `main: ./dist/mcp_server/advisor-server.js` (`package.json:5`).
  2. **Launcher** registered in `opencode.json` — `mk_skill_advisor` (`opencode.json:47-52`) points to `.opencode/bin/mk-skill-advisor-launcher.cjs` (NOT the dist), with `SPECKIT_IPC_SOCKET_DIR: /tmp/mk-skill-advisor`.
  3. **Warm CLI front door** `.opencode/bin/skill-advisor.cjs` that checks dist freshness (`skill-advisor.cjs:49-62`), ensures socket dir with macOS sun_path 104-char guard (`:64-74`), spawns `dist/mcp_server/skill-advisor-cli.js` over stdio (`:80-84`), and exits **69 = protocol, 75 = retryable IPC-unavailable** (`:16-17`; `--warm-only` maps stale-dist to 75, `:56-57`).
- **recommendation:** Rewrite §3 STEPS around the real 3-tier assembly: server (TS→dist) + launcher (`mk-<name>-launcher.cjs`, registered in `opencode.json`) + warm CLI (`<name>.cjs` front door). Document the socket dir + sun_path constraint and the exit-code taxonomy (69/75).

**[P1] `opencode.json` registration is absent from the checklist entirely.**
- **code-opencode doc:** `mcp_server_authoring.md` — no mention of `opencode.json`, `mcp.<name>` registration, launchers, or environment wiring anywhere.
- **reality:** `opencode.json:10-96` registers all four native MCP servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`), each via a launcher `.cjs`, each with a `environment` block (socket dirs, feature flags, DB paths). Registration is mandatory and non-obvious (launcher, not dist, is the entry).
- **recommendation:** Add a registration step: "Register in `opencode.json` under `mcp.<name>` → `.opencode/bin/mk-<name>-launcher.cjs`; pin `SPECKIT_IPC_SOCKET_DIR`."

**[P2] Code Mode / `.utcp_config.json` registration path for EXTERNAL MCP tools is absent.**
- **code-opencode doc:** no mention of Code Mode, `.utcp_config.json`, `code_mode` server, or the external-vs-native split.
- **reality:** `opencode.json:87-96` registers `code_mode` with `UTCP_CONFIG_FILE: .utcp_config.json`; `.utcp_config.json:14-31` defines `manual_call_templates` (chrome-devtools, figma, etc.) as a **separate** external-MCP registration path. AGENTS.md §5 documents this native-vs-Code-Mode split.
- **recommendation:** Add a decision step: "Is this a native daemon-backed server (own `mcp_server/`) or an external tool routed via Code Mode (`.utcp_config.json` `manual_call_templates`)?" — the checklist currently can't tell an author which path applies.

**[P2] Dist freshness + build requirement is invisible; directly relevant given the live stale-dist warning.**
- **code-opencode doc:** `mcp_server_authoring.md:60` — only "Run the targeted … package test command."
- **reality:** `skill-advisor.cjs:49-62` calls `checkPackageFreshness` and **hard-fails warm CLIs on stale dist**. The repo currently has 2 stale-dist warnings (`@spec-kit/system-code-graph`, `@spec-kit/scripts`). The `npm run build` → `dist/` → launcher contract is mandatory and load-bearing.
- **recommendation:** Add a build/freshness step and cross-reference the dist-freshness guard.

### Dead-link inventory

| # | Cited in | Dead/wrong path | Reality |
|---|----------|-----------------|---------|
| 1 | `command_authoring.md:35,65` | `.opencode/commands/create/sk-skill.md` | actual file is `.opencode/commands/create/skill.md` (no `sk-` prefix) |
| 2 | `command_authoring.md:64` | `sk-doc assets/command/command_template.md` | actual path is `.opencode/skills/sk-doc/create-command/assets/command_template.md` (missing `create/` dir + `sk-doc/` prefix) |
| 3 | `command_authoring.md:38,49,58` | `.claude/commands/` mirror | directory does not exist |
| 4 | `command_authoring.md:38,49,58` | `.opencode/prompts/` mirror | directory does not exist |
| 5 | `mcp_server_authoring.md:67,68` | `sk-doc references/skill_creation.md` | does not exist (glob: no files) |

Confirmed-live cross-refs: `universal_checklist.md`, `typescript_checklist.md`, `python_checklist.md`, `.opencode/commands/speckit/complete.md`, and all three canonical MCP servers (`system-spec-kit`, `system-code-graph`, `system-skill-advisor` `mcp_server/`) all resolve.

### Used-but-undocumented (worth ADDING)

1. **Contract compilation pipeline** — `compile-command-contracts.cjs` → `compiled/*.contract.md` (GENERATED_COMMAND_CONTRACT_HEADER + sha256 sourceDigests) → `render-command-contract.cjs` render → `manifest.jsonl` audit. The entire `deep/` command family depends on it.
2. **Rollout mode resolver** — `resolve-injection-mode.cjs` (`fallback` default vs `fix`), governed by `command-injection-rollout.json` + `SPECKIT_COMMAND_INJECTION_MODE=command:mode`. A staged roll-forward mechanism the checklist ignores.
3. **INVOCATION MESSAGE prelude** — `ARGS_PRESENT`/`MESSAGE:` passthrough (`render-command-contract.cjs:79-96`) that re-surfaces `$ARGUMENTS` to the model. Critical for `:auto` non-interactive runs.
4. **PRE-BOUND SETUP ANSWERS schema** — declared in `argument-hint` frontmatter on *both* command families (`deep/research.md:3`, `create/skill.md:3`).
5. **MCP launcher + warm-CLI-front-door + socket-IPC** — `mk-<name>-launcher.cjs` (opencode.json entry) + `<name>.cjs` (warm CLI) + `/tmp/mk-<name>/daemon-ipc.sock` + macOS sun_path 104-char guard.
6. **Exit-code taxonomy** — 69 (protocol) / 75 (retryable IPC-unavailable); `--warm-only` flag semantics.
7. **Dist-freshness guard** — `checkPackageFreshness` hard-fails warm CLIs; `npm run build` → gitignored `dist/` is mandatory.
8. **opencode.json registration** — `mcp.<name>` entry → launcher `.cjs` + `environment` block (socket dir, feature flags, DB path).
9. **Code Mode external-MCP split** — `.utcp_config.json` `manual_call_templates` for chrome-devtools/figma/etc., a wholly separate registration path from native daemon servers.
10. **Plugin bridges** — `mcp_server/plugin_bridges/` (e.g. `mk-skill-advisor-bridge.mjs`) wiring MCP servers to the OpenCode plugin system — absent from the checklist.

### Angles to pursue next

- **Iteration 7 (next):** Audit `command_authoring.md` §4 POST-CHECKS grep patterns against the real frontmatter/tooling (`rg "assets/.+_(auto|confirm)\\.yaml"` will *miss* compiled-contract and renderer concerns; no grep covers `argument-hint` / `allowed-tools` / `render-command-contract`). The verification recipe is stale.
- **Iteration 8:** Cross-check the `create-command` sk-doc packet's `command_template.md` — does the *template* itself encode the thin-router + argument-hint + PRE-BOUND SETUP ANSWERS model, or is it also stale? (If stale, the checklist inherits its staleness from the template.)
- **Iteration 9:** Verify the MCP checklist's "Python vs TypeScript" framing (§2, §3.1) against actual server languages — all four native servers here are TypeScript (`code_mode` dist, skill-advisor, code-graph, spec-memory); is there *any* Python MCP server left, or is the Python guidance dead weight?
- **Iteration 10:** Synthesis pass — does the parent `code-opencode/SKILL.md` itself reference these checklists in a way that amplifies the staleness, or is the staleness contained to the checklist files?

**Note on mid-migration:** The `deep-loop-workflows` → `system-deep-loop` rename is live. The compiled contract header (`deep_research.contract.md:39,44,49`) still cites `deep-loop-workflows/...` source paths in its digests, while the renderer lives at `system-deep-loop/runtime/scripts/`. Treat all deep-loop paths cited above as **provisional** pending migration completion; the `render-command-contract.cjs` path inside `deep/research.md:9` is the authoritative current location.

*(Read 13 files; no edits.)*
