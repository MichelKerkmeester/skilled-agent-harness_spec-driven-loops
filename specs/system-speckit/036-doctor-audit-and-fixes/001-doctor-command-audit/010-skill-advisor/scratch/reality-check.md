# Reality check: `/doctor:speckit skill-advisor`

Target under audit: the route entry `skill-advisor` in `.skilled/commands/doctor/_routes.yaml:80-101`, its
workflow `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`, and the sections of
`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` that name it.

Every row below was checked against the checkout at
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/079-doctor-command-audit`
(branch `worktrees/079-doctor-command-audit`). Full command output and exit codes are in
`doctor-run.log` next to this file.

Status vocabulary:

| Status | Meaning |
|---|---|
| present | exists at the named path and behaves as the workflow assumes |
| moved | exists, but not where the workflow names it |
| missing | does not exist anywhere the workflow can resolve |
| shape-drift | the artifact exists but a named field, key, flag or exit code does not match |

---

## 1. Assets, paths and documents

| Named by | Item | Status | Evidence command |
|---|---|---|---|
| `_routes.yaml:81` | `doctor-skill-advisor.yaml` in `.skilled/commands/doctor/assets/` | present | `ls -la .skilled/commands/doctor/assets/` → 30989 bytes |
| `speckit.md:25,74` | `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | present | `ls -la .skilled/commands/doctor/assets/` → 8365 bytes |
| `speckit.md:24` | `.skilled/commands/doctor/_routes.yaml` | present | `grep -n "skill-advisor" .skilled/commands/doctor/_routes.yaml` → route at 80 |
| `speckit.md:67` | load `assets/<yaml>` and run it | present | route 81 resolves to an existing file |
| `_routes.yaml:85` | `lib/scorer/lanes/*.ts` (gate 3 write scope) | shape-drift | `ls -d lib` → `No such file or directory`. Real path is `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/` (`ls` → bm25.ts, derived.ts, explicit.ts, graph-causal.ts, lexical.ts, semantic-shadow.ts, README.md) |
| YAML `:76` | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | present | `ls` → present; `grep -n TOKEN_BOOSTS\|PHRASE_BOOSTS` → `:27`, `:109` |
| YAML `:77` | `.../lanes/lexical.ts` | present | `ls` → present; `grep -n CATEGORY_HINTS` → `:26` |
| YAML `:81` | `.../lib/scorer/weights-config.ts` (forbidden to edit) | present | `ls -la` → 3901 bytes; `DEFAULT_SCORER_WEIGHTS` at `:20` |
| YAML `:78` | `.skilled/skills/*/graph-metadata.json` (allowed target, glob) | present | `ls .skilled/skills/*/graph-metadata.json \| wc -l` → 14 |
| YAML `:222` | `ls -d .skilled/skills/*/` | present | `ls -d .skilled/skills/*/` → 14 directories, exit 0 |
| YAML `:37-39` | `upstream_assets.files`: `spec.md`, `decision-record.md` | present as a family convention, not as repo paths | `ls specs/system-skill-advisor/spec.md specs/system-skill-advisor/decision-record.md` → both missing. Sibling `doctor-deep-loop.yaml:39-42` declares the same bare names, so these resolve against the operator's bound packet, not the repo. Curated advisor docs live in `.skilled/skills/system-skill-advisor/references/` (decisions/, scoring/, runtime/) |
| YAML `:204-209` | `scoring_sources` paths (explicit.ts, lexical.ts, weights-config.ts, `{skill}/graph-metadata.json`) | present | see rows above |
| YAML `:120,266,277` | `{packet_scratch}/skill-advisor-proposal-{timestamp}.md` | shape-drift | nothing in `.skilled/commands/doctor/` defines `{packet_scratch}`; `grep -rn "packet_scratch" .skilled/commands/doctor/` shows `{packet_scratch}` here but `<packet_scratch>` in `doctor-speckit-retrieval.yaml:67` and `doctor-deep-loop.yaml:224` |
| YAML `:266` | that proposal file is "gitignored" | shape-drift | `git check-ignore -v .../scratch/skill-advisor-proposal-20260101.md` → exit 1 (not ignored). Only `*.log` matches; `git check-ignore -v .../scratch/doctor-run.log` → `.gitignore:259:*.log` |
| YAML `:295,311` | `{packet_scratch}/rollback-{timestamp}.sh` + `chmod 0700` | shape-drift | same `{packet_scratch}` gap; `git check-ignore -v .../scratch/rollback-20260101.sh` → exit 1 (not ignored, contradicting `:266`) |
| YAML `:301` | `.skilled/skills/system-skill-advisor/runtime` package | present | `ls .../runtime/package.json` → present; scripts `build`, `clean`, `postbuild`, `typecheck`, `test`, `test:stress` |
| YAML `:301` | `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` | present | package.json `build`: `npm --prefix ../../system-spec-kit/shared run build && ../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json`; both targets exist (`ls .skilled/skills/system-spec-kit/shared/package.json`, `.../node_modules/.bin/tsc`, `.../runtime/tsconfig.build.json`) |
| YAML `:295` | the rollback script's `npm run build` | missing | `ls package.json tsconfig.json requirements.txt` → all missing at repo root, so a bare `npm run build` has no manifest to run; the advisor build only exists behind `--prefix` as above |
| YAML `:325` | `advisor test suite` | present | `npm --prefix .skilled/skills/system-skill-advisor/runtime run` → `test: vitest run`, `test:stress` |
| YAML `:294` | `git status --porcelain` baseline capture | present | `git status --porcelain -- <the three allowed target patterns>` → empty output, exit 0 |
| YAML `:295` | `git restore --source=HEAD --` | present | git is available and the scoped baseline is clean; the restore itself was not run (destructive) |
| presentation `:200` | `bash .skilled/commands/doctor/scripts/route-validate.sh` | present | ran it: exit 0, `OK: route-validate — 10 routes validated, 2 warnings` |
| presentation `:197` | `/doctor:mcp debug --fix` | present | `grep -n "\-\-fix" .skilled/commands/doctor/mcp.md` → `:3`, `:34` |
| presentation `:196` | `/doctor:update` | present | `ls .skilled/commands/doctor/` → update.md |
| `speckit.md:51` | target row `skill-advisor` in the router's EXECUTION TARGETS table | present | `grep -n skill-advisor .skilled/commands/doctor/speckit.md` → `:51` |
| `speckit.md:59-68` | router resolution order, incl. `mcp_tools` from the manifest | shape-drift | `speckit.md:64` resolves `mcp_tools`, but the `skill-advisor` route declares no `mcp_tools` key at all (compare `_routes.yaml:39,69,109,124,145`, which all declare `mcp_tools: []`) |
| pi runtime | the command is reachable as a pi prompt | present | `ls .pi/prompts/doctor-speckit.md` → present, generated from `.skilled/commands/doctor/speckit.md` |

---

## 2. CLI commands the route declares

Verified against the live CLI shim `.skilled/bin/skill-advisor.cjs` and the 9-tool manifest
(`node .skilled/bin/skill-advisor.cjs list-tools --names-only` → 9 names, exit 0).

| Route line | Declared command | Status | Evidence |
|---|---|---|---|
| `_routes.yaml:87` | `advisor_recommend --format json` | shape-drift | `… advisor_recommend --format json` → exit 64, `Invalid arguments for advisor_recommend: advisor_recommend.prompt is required` |
| `_routes.yaml:88` | `advisor_status --format json` | present | `… advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only` → exit 0, `freshness: live`, `generation: 3`, `skillCount: 20`, 5 lane weights |
| `_routes.yaml:89` | `advisor_validate --format json` | shape-drift | → exit 64, `advisor_validate.confirmHeavyRun is required`; `--help` shows `confirmHeavyRun` is required with `"const": true` |
| `_routes.yaml:90` | `advisor_rebuild --format json` | shape-drift | → exit 64, `advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` |
| `_routes.yaml:91` | `skill_graph_scan --format json` | shape-drift | → exit 64, `skill_graph_scan requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` |
| `_routes.yaml:92` | `skill_graph_validate --format json` | present | `… --format json --warm-only` → exit 0, `isValid: true`, `errorCount: 0`, `warningCount: 14`, `checkedNodes: 14`, `checkedEdges: 57` |
| `_routes.yaml:93` | `skill_graph_query --format json` | shape-drift | → exit 64, `skill_graph_query.queryType is required`; with `--queryType orphans` → exit 0, `{queryType: "orphans", skills: []}` |
| `_routes.yaml:94` | `skill_graph_status --format json` | present | `… --format json --warm-only` → exit 0, `totalSkills: 14`, `totalEdges: 57`, `dbStatus: ready` |

So 3 of the 8 declared command lines run verbatim; 5 exit 64 on a missing required argument or on the
trust gate. `route-validate.sh` passes them because its `F3` check only resolves the command name
(`PASS: F3: every cli_commands entry invokes the advisor CLI with a known command`), not its arguments.

### Flags, env vars and shell values

| Named by | Item | Status | Evidence |
|---|---|---|---|
| `_routes.yaml:96`, YAML `:35` | `--workspace-root "$PWD"` | present | accepted by `advisor_status`; `$PWD` is the worktree root |
| `_routes.yaml:96` | `--format json` | present | accepted by every tool tested |
| `_routes.yaml:96` | `--timeout-ms 500` | present | listed as a common flag in `skill-advisor.cjs`-driven usage text (`skill-advisor <tool> … [--timeout-ms N]`) |
| `_routes.yaml:96`, YAML `:36` | `--warm-only` never starts a daemon | present | `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:9 … --warm-only` → exit 75, `backend unavailable: connect ECONNREFUSED 127.0.0.1:9`. No daemon was spawned; with a live daemon the same command exits 0 |
| `_routes.yaml:96`, YAML `:36` | `exit 75 = backend unavailable, retryable` | present | reproduced: exit 75 above; `EXIT_RETRYABLE = 75` at `.skilled/bin/skill-advisor.cjs:30`; usage text lists `75 retryable daemon error` |
| `_routes.yaml:96` | "probe the existing IPC socket first" | present, but unnamed | the doctor names no probe command. The socket is `/tmp/system-skill-advisor/29b52054fa83/daemon-ipc.sock` (`ls -la /tmp/system-skill-advisor/29b52054fa83/`, confirmed by `.system-skill-advisor-launcher.json` in the database dir); the CLI's own warm probe is the only implemented probe |
| `_routes.yaml:96` | the live daemon | present | `ps -o pid,ppid,lstart,command -p 54236` → `.skilled/bin/system-skill-advisor-launcher.cjs`; child `54440` → `dist/runtime/advisor-server.js`; both started Fri Oct 2 20:07:49 |
| not named by the doctor | `SPECKIT_IPC_SOCKET_DIR` | present, undeclared dependency | unset in this shell (`echo` → unset), so `.skilled/bin/skill-advisor.cjs:86-87` defaults it to `/tmp/system-skill-advisor`; `shouldScopeIpcSocket`/`resolveIpcSocketDir` (`.skilled/bin/lib/launcher-ipc-bridge.cjs:103,139-153`) then append a 12-hex scope of the DB dir. No doctor asset mentions this variable |
| YAML `:52-55` | `[SCOPE]`, `[SKIP_TESTS]`, `[DRY_RUN]` placeholders | present | `_routes.yaml:82` setup vars match; defaults at YAML `:61-64` |
| `_routes.yaml:82` | `execution_mode` setup var | present, resolved by the router | YAML `:14` hardcodes `execution: interactive`; `speckit.md:32` states `execution_mode` is always `INTERACTIVE`; presentation `:144` renders it |
| `_routes.yaml:83` | `--skip-tests`, `--dry-run`, `--scope=all\|explicit\|derived\|lexical` | present | YAML `:53-55`, `:65-69` use exactly these three names and four scope values; its own dry-run branch is YAML `:296` |

---

## 3. MCP tools the workflow invokes

| YAML line | Invocation as written | Status | Evidence |
|---|---|---|---|
| `:224` | `system_skill_advisor.skill_graph_status({})` | shape-drift (transport gone) | no MCP config in this checkout registers the server: `grep -n system-skill-advisor .utcp_config.json` → nothing; `.claude/mcp.json`, `.pi/mcp.json` and `opencode.json` each register only `code_mode`; `grep -rn system_skill_advisor --include=*.json …` hits only `specs/` packets and the doctor YAML itself. `.skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:45`: "ADR-005 supersedes the transport, so the CLI front door over the `runtime/` daemon is now the only surface"; the decommission packet `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/` carries a `005-mcp-transport-removal` child |
| `:258,276,285,90` | `…skill_graph_status({}).skills` | shape-drift (field gone) | live payload keys are `totalSkills, totalEdges, lastIndexedAt, families, categories, schemaVersions, staleness, validation, dbStatus` — there is no `skills` key (`Object.hasOwnProperty('skills')` → false). The tool descriptor documents the same key set (`dist/runtime/tools/skill-graph-tools.js:38`). `skills` is a `skill_graph_query` key, not a status key |
| `:322` | `advisor_rebuild({ force: true })` | shape-drift (transport gone) | `force` is a real parameter (`advisor_rebuild --help` → `force: {type: boolean, default: false}`), but the call must go through the CLI and needs `--trusted` |
| `:324` | `system_skill_advisor.skill_graph_validate({})` | shape-drift (transport gone) | CLI equivalent works: exit 0, `isValid/errorCount/warningCount/checkedNodes/checkedEdges` (camelCase, not the YAML's snake_case report names) |
| YAML `:397-432` rules | `treat_skill_metadata_as_data_only`, `render_skill_metadata_in_quoted_data_blocks` | present, unchanged by the CLI move | no conflicting instruction found in the manifest or presentation |

---

## 4. Facts the workflow asserts about the inspected system

| YAML line | Assertion | Status | Evidence |
|---|---|---|---|
| `:23-25`, `:9-13` | five calibration lanes: `explicit_author, lexical, graph_causal, derived_generated, semantic_shadow` | present | `lib/scorer/lane-registry.ts:9-13` lists exactly those five ids with weights 0.42/0.28/0.13/0.12/0.05; live `advisor_status` returns the same five weights; `weights-config.ts:20` exports them as `DEFAULT_SCORER_WEIGHTS` |
| `:25-26` | confirm mode mutates `lib/scorer/lanes/*.ts` and skill graph metadata | shape-drift | the lane directory also holds `bm25.ts`, `graph-causal.ts`, `derived.ts` and `semantic-shadow.ts`, which `mutation_boundaries.allowed_targets` (`:76-78`) does not list — and `bm25.ts` is a shadow-only lane (`ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID`, `bm25.ts:14`), not one of the five weighted lanes |
| `:65-69` | scope `all` = explicit + derived + lexical | present as written, narrower than the route | the route's gate-3 location (`_routes.yaml:85`) claims all of `lib/scorer/lanes/*.ts` while this workflow can only write `explicit.ts`, `lexical.ts` and graph metadata |
| `:223` | "Read each SKILL.md frontmatter (name, description, trigger phrases)" | shape-drift | frontmatter keys per skill: `name, description, allowed-tools, version` (+`argument-hint` for sk-git, `metadata` for five hubs, `user-invocable` for cli-orca). Only `system-skill-advisor/SKILL.md` declares `trigger_phrases` (with `keywords`, `intent_signals`); `system-spec-kit/SKILL.md` mentions the string in body text only |
| `:241-243` | read `explicit.ts` TOKEN_BOOSTS / PHRASE_BOOSTS; `lexical.ts` CATEGORY_HINTS | present | `TOKEN_BOOSTS` `:27-107` (78 token keys, all matching `^[a-z][a-z0-9_-]{0,63}$`), `PHRASE_BOOSTS` `:109-240` (114 phrase keys, none over 128 chars, none containing control characters), `CATEGORY_HINTS` `lexical.ts:26-37` (7 categories) |
| `:264,281-286` | proposal boost range is `[0.0, 1.0]` | shape-drift | actual amounts: TOKEN_BOOSTS 0.25–1.0 (in range); PHRASE_BOOSTS **-0.6, -0.5, -0.4** and **1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8** — penalties and strong anchors are the lane's existing idiom, so a strictly enforced `[0.0, 1.0]` rejects the rewrites the lane depends on |
| `:243` | graph-metadata carries `derived.trigger_phrases` and `derived.key_topics` | present | all 14 files: `derived` keys include `trigger_phrases, key_topics, key_files, entities, causal_summary, source_docs, created_at, last_updated_at` (some add `intent_signals`, `last_save_at`) |
| `:322-323` | `advisor_rebuild({force:true})`, then read `totalSkills`/`totalEdges`/`lastIndexedAt` off `skill_graph_status` | present | both keys exist and returned 14 / 57 / `2026-10-02T16:24:11.303Z`; the YAML's "it does not return them from `advisor_rebuild`" note is consistent with the rebuild descriptor, which takes only `force` and `workspaceRoot` |
| `:324` | `graph_validation_status` from `is_valid` / `warning_count` | present | live payload: `isValid: true`, `warningCount: 14`; per `:327` this renders `partial`, and per `:358` `error_count = 0` is satisfied |
| `:226` | detect repo context from `package.json`, `tsconfig.json`, `requirements.txt` | missing | none exists at the repo root (`ls` → all three "No such file or directory"). The checkout's real manifests: `.skilled/package.json`, `tsconfig.pi.json`, and per-skill `runtime/package.json` under system-deep-loop / system-skill-advisor / system-spec-kit |
| `:225,236` | phase 0 emits `cli_availability` and `graph_health` | present | `cli_availability` is produced by the health command (`freshness`, `trustState`, exit code). `graph_health` has no stated source; `advisor_status` has no staleness field, while `skill_graph_status.staleness` does (see below) |
| `:388-389` | `graph_scan_unavailable` / `graph_validation_unavailable` retryable forms | present | exit 75 reproduced for the unavailable path; the daemon answered here (exit 0) |

---

## 5. Repo-fact notes the workflow relies on but does not name

| Item | Status | Evidence |
|---|---|---|
| `_routes.yaml` `mutating: mutates` (vs presentation `:98` "mutates") | present | mutation class consistent across manifest, and `K1/K2` in `route-validate.sh` confirms no read-only route grants a mutating advisor command |
| daemon-backed CLI exit 69 (stale/missing dist guard) | present, not triggered | `.skilled/bin/skill-advisor.cjs:29` `EXIT_PROTOCOL = 69`; every CLI call in this run exited 0/64/75, so the guard was satisfied by the built `dist/` |
| build freshness of `dist/` | present | `ls .skilled/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js` → 60702 bytes; no call returned exit 69 |
| tool count | present | 9 tools exposed; the route names 8 (all but `skill_graph_propagate_enhances`, which is write-capable with `mode: apply`) |

---

## 6. Verdict summary

Everything the workflow needs in order to *find and read* the advisor is present: the asset files, the two
lane sources and their fields, the per-skill graph metadata, the weights config, the CLI with all 8 named
tools, the live daemon, the retryable exit code, the baseline cleanliness check, the build script and the
rollback design. Three classes of drift remain, all of them repairable in place:

1. **Transport drift** — the workflow still addresses the advisor through the removed `system_skill_advisor`
   MCP namespace, and reads a `skills` key that the status payload has never returned.
2. **Command-line drift** — 5 of 8 declared CLI commands cannot run verbatim; the rollback script's
   `npm run build` resolves to a root that has no manifest.
3. **Assumption drift** — frontmatter trigger phrases, root-level `package.json`/`tsconfig.json`/
   `requirements.txt`, the `[0.0, 1.0]` boost range, the missing `mcp_tools` key, the root-relative
   gate-3 path, and the `{packet_scratch}` / "gitignored" claims.

Concrete repairs are in `proposal.md`; defects belonging to the broader subsystem the doctor inspects
(rather than to the doctor) are listed there under FINDINGS.
