# Iteration 5: Removal order, user-machine cleanup and the residue check

## Focus

Build the three deliverables from the four inventories: a removal order with a gate after each step, a user-machine cleanup design that deletes and never backs up, and a residue check that proves nothing is left. Settle the open checks the earlier iterations carried forward, and state the remaining operator decisions as explicit options.

Selected interpretation: the strategy's Next Focus is cut off after "`scoring-compatib...`". The full text is iteration 4's Recommended Next Focus, and that is the scope used here.

Nothing was changed outside `research/`. The order below is derived from dependency evidence and from gate commands that exist today. It was not executed, so "green" is a prediction until each gate is run at each step.

Path shorthand: `R/` is `.skilled/skills/system-skill-advisor/runtime/`, `K/` is `.skilled/skills/system-spec-kit/`, `D/` is `.skilled/commands/doctor/`. Every source tag carries the full path. Line numbers were read at commit `44251c5befd`.

## Actions Taken

1. Read config, state log, strategy, iterations 1 to 4 and `research.md`. Four iteration records exist, so this is iteration 5; `iteration-005.md` and `iter-005.jsonl` did not exist.
2. Read the gate commands: the three `package.json` script blocks, the CI workflow run lines, the global pre-commit hook, the doctor test runner, and the check modes of the bridge and trigger-index generators.
3. Read the vector schema code and the migration block, then queried the live `skill-graph.sqlite` read-only for its `sqlite_master` rows and table counts.
4. Read the existing memory residue sweeper (header, exit codes, allowlist shape), the doctor rebuild asset's backup steps and the update-apply phase list.
5. Checked this machine, read-only: the Ollama model store, running processes, the model server directory, compiled output, installed modules, runtime config files and the key names of `.env`.
6. Measured the residue baseline with both patterns over tracked files, and ran one grep each for the open checks.
7. Fetched the Ollama delete API page and the HuggingFace cache guide.

## Findings

### F1. The gates that exist today

These are the commands each step below is checked against. None is new.

| Gate | Command | Source |
| --- | --- | --- |
| Advisor typecheck, tests, clean build | `npm run typecheck`, `npm test`, `npm run clean` then `npm run build` in `R/` | [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:12] |
| Shared package build and tests | `tsc --build`, then the `tests/*.test.ts` glob | [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:15] [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:17] |
| Doctor suites | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | [SOURCE: .skilled/commands/doctor/scripts/tests/README.markdown:83] |
| Command bridges in sync | `derive-command-bridges.cjs --check` | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1312] |
| Trigger index in sync | `generate-trigger-index.mjs --check` (CI runs it report-only) | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:33] [SOURCE: .github/workflows/advisory-checks.yml:80] |
| Markdown links | `check-markdown-links.cjs` | [SOURCE: .github/workflows/markdown-link-integrity.yml:54] |
| Routing ratchets | golden prompts, scorer-eval baseline, local-native divergence, holdout | [SOURCE: .github/workflows/routing-registry-drift.yml:276] [SOURCE: .github/workflows/routing-registry-drift.yml:288] [SOURCE: .github/workflows/routing-registry-drift.yml:306] [SOURCE: .github/workflows/routing-registry-drift.yml:315] |
| Advisor stress and full suite in CI | `npm run test:stress`, `npm test` | [SOURCE: .github/workflows/skill-advisor-stress.yml:97] [SOURCE: .github/workflows/skill-advisor-stress.yml:109] |
| Leaf manifest in sync | `generate-leaf-manifest.cjs --check <skill root>` | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:44] |

The advisor's `typecheck`, `test` and `clean` scripts and spec-kit's root `typecheck` and `test` scripts were read from the `scripts` blocks by command; only the build line has a known line number. [INFERENCE: `jq .scripts` output over the two package.json files this run]

The pre-commit hook lives outside the repository, at the global hooks path `~/.config/git/hooks/pre-commit`. On every commit it runs the mirror sync scripts with `--check` (437 onward), the leaf manifest generator with `--check` for each touched skill (526, generator path at 495), the doc version bump check (309) and the parent-skill doctor (543). So these four fire per commit, not once at the end. [INFERENCE: read from the hook file this run; it is outside the repository, so it has no repo-relative source tag]

### F2. Eight groups of edits that cannot be split across commits

1. **The lane id.** `ScorerLaneId` and both weight records derive from the registry array, so deleting the row changes the type everywhere. Every `Record<ScorerLane, number>` literal in sources and tests drops the key in the same commit or the compile fails. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:197]
2. **The install checklist.** The contract test resolves each checklist step to a manifest route, so the route block, the install asset, the install presentation and the test entry change together. [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:101]
3. **The status flag.** The status input schema is strict. Doctor steps that pass `--include-semantic-health` change before the key is removed, or in the same commit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:393]
4. **The ablation test and the holdout list.** `holdout-independent.vitest.ts` 95 lists the ablation test's path, and CI runs that suite by name. Deleting the ablation test without editing line 95 turns a CI job red. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:95] [SOURCE: .github/workflows/routing-registry-drift.yml:315]
5. **Generator input, then output.** `scoring-compatibility.json` is hand-edited first, then the bridge generator runs, then `--check` passes. All in one commit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:266]
6. **A deleted or renamed routed doc and its leaf manifest.** The pre-commit hook checks the manifest per commit, so the manifest is regenerated with `--write` in the commit that deletes the doc. This also answers iteration 4's open question: the writer is `generate-leaf-manifest.cjs`. Whether the same script writes `leaf-aliases.json` was not read. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:44]
7. **The shared package folder and `shared/types.ts`.** The type import at line 5 breaks the shared build if the folder goes first. [SOURCE: .skilled/skills/system-spec-kit/shared/types.ts:5]
8. **The dependency and its two checks.** `scripts/doctor.sh` 58 requires the HuggingFace module and `INSTALL-GUIDE.md` 105 imports the built lane file. Both change with, or before, the code they test. [SOURCE: .skilled/skills/system-skill-advisor/scripts/doctor.sh:58] [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:105]

### F3. The removal order

Eight steps. Each is one commit unless the step says otherwise. The file and line lists for each step are in iterations 1 to 4; this table names what lands and why it lands there.

| Step | What lands | Why here | Gate |
| --- | --- | --- | --- |
| 0. Baseline | Add the residue check in report-only mode with its allowlist, and the machine cleanup tool, not yet wired. Record the count of passing tests per gate and the ratchet outputs. | The check must be seen failing before it can be trusted passing. The cleanup tool must exist before step 4 removes the code that recognizes a stray model server. | The check exits 1 and reports 332 files at the base commit (F10). Every gate in F1 is green and its numbers are written down. |
| 1. Doctor surface | Embedder route block, workflow asset, presentation section 8 and menu item 5 (items 6 and 7 become 5 and 6), setup leg, install step 5, the vector coverage lines in update, overlay and symlink, route contract test section 4, install contract entry, `measure-embedder-cost.mjs`. Hand-edit `scoring-compatibility.json`, regenerate the bridges. `INSTALL-SKILLED.md` and `INSTALL-GUIDE.md` section 12, because they tell users to run a route that no longer exists. | It removes every caller of the status flag while the advisor still accepts it, so no order problem exists inside the step (F2 items 2, 3 and 5). | `run-all.sh`; bridges `--check`; `command-bridges-drift-guard.vitest.ts`; mirror `--check`; link check; advisor `npm test`. |
| 2. Lane feeders | Startup and watcher vector refresh, the scan response's `embeddings` field, the prompt embedding wrapper, the exact rerank flag, the command meaning path, `embeddingText` in the generator (then regenerate), the `--real-embedding` capture mode, the launcher's three forwarded keys and the CI env line. The tests dedicated to these. The two catalog files `background-vector-refresh.md` and `command-meaning-matching.md` with their inbound links and leaf manifest. | At weight 0 these only feed a lane that contributes nothing to the live score, so removing them first shrinks step 3 without changing the lane type. | Advisor typecheck, tests, clean build; bridges `--check`; the four ratchets pass with score baselines untouched (F13); leaf `--check`; link check. |
| 3. Lane id and contract | The registry row, `semantic-shadow.ts`, the fusion and handler remnants, both status diagnostics and their schema, tool and CLI rows, projection staleness, `lib/embedders/`, the symlink and its two tsconfig excludes, the vector DDL and the three legacy columns, the schema version rule from F4. `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at every writer site. All remaining lane tests, lane-key fixtures, the Python test and the stress tests. The four playbook expected-output lines and `INSTALL-GUIDE.md` 105. | Compiler-forced (F2 item 1). The playbook lines and the install check go here because they assert an output shape this commit changes. | Advisor typecheck (it names every missed literal), tests, clean build; stress config; ratchets with score values unchanged; contract probes R7 in F11. |
| 4. Shared package, model server, dependency | `K/shared/embeddings/`, the `shared/types.ts` section, 4 shared tests, 24 spec-kit runtime tests and 6 edits, `hf-model-server.cjs`, `model-server-supervision.cjs`, the launcher's supervision section and `MEMORY_DB_PATH` block, the orphan check's model-server class with its tests, wording, trigger phrase and fixtures, the sweeper's two model-server lines, the sk-doc validator with its four callers, `@huggingface/transformers` in two `package.json` files and three lockfiles, `scripts/doctor.sh`, `env-reader-table.mjs` and the regenerated env table, `embedder-pluggability.md` with its router lines and leaf manifest, the env reference sections, the bin READMEs, the sk-doc README baselines. | After step 3 the package has no importer. | Shared build and tests; spec-kit typecheck and tests; advisor clean build and tests; `run-all.sh`; sk-doc script tests; `npm ci` from a clean tree in both packages; leaf `--check`; link check. |
| 5. Prose and identity | The 45 files that say five lanes, the rename decision for the three "five-lane" files, advisor references, catalog and playbook prose, `ARCHITECTURE.md`, `SKILL.md` 20, `ROUTER.md` 42 and 175, the four `graph-metadata.json` trigger phrases, the create-command assets, root `README.md`, the changelog decision and the new changelog entry. | Descriptive text has no compile dependency. Instructions that would fail and expected outputs already moved with their code in steps 1, 3 and 4. | Link check; leaf `--check`; frontmatter check; doc version bump check; parent-skill doctor; ratchets again, because the trigger phrases route prompts to the advisor today. |
| 6. Derived artifacts | Trigger index and its fixtures, the `skill-graph.json` export, the two cite-drift label rows. | Every earlier step changes their inputs, and the trigger index check is report-only in CI, so it can wait. | Each generator's check mode; the diff holds generated files only. |
| 7. Wire and flip | Wire the machine cleanup into `/doctor:update apply` after its rebuild prompt (F5). Flip the residue check from report-only to gating. | Last, so the check gates a tree that can pass. | Repo mode exits 0 at HEAD; machine mode exits 0 on the developer machine after cleanup; the planted-term fixture still exits 1. |

Three notes on the table:

- The split between steps 2 and 3 is a recommendation, not something read from the code. After step 2 the lane file still exports functions nobody calls; no gate known to this research rejects unused exports. If the compiler disagrees, steps 2 and 3 merge into one commit. [INFERENCE: based on the import and call sites in iteration 1 F2 and F3; not compiled]
- Before step 1, grep the routing corpora for the embedder route's six trigger phrases. A corpus row that expects the embedder command would fail once the bridge is gone. This was not checked.
- The sk-doc README baselines are rebuilt in the commit that deletes a README, not deferred to step 6, because the sk-doc script tests run in CI on every change. [INFERENCE: based on iteration 4 F11 naming `test_readme_verdict_parity.py` and `test_readme_manifest.py` as the owners]

The skill graph export has a named writer: `skill_graph_compiler.py` with `--export-json`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1181]

### F4. The vector tables are plain tables in a derived database, so the cleanest drop is to discard the file

- `vec_<dim>` and `vec_cmd_<dim>` are ordinary tables with a BLOB column, and the driver is `better-sqlite3`. No extension is loaded. So nothing has to stay installed for the tables to be droppable. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:119] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:14]
- The live `sqlite_master` confirms it: `vec_metadata`, `vec_768`, `vec_1024` and `vec_cmd_768` are all `CREATE TABLE`, none virtual. Row counts: `vec_768` 15, `vec_cmd_768` 47, `vec_1024` 0, `vec_metadata` 3. [INFERENCE: direct observation from a read-only `sqlite3` query this run, exit 0; the database is gitignored]
- The database is derived state. The rebuild workflow says so and names the checked-in `graph-metadata.json` files as the source of truth. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:23]
- The three legacy columns are re-added on every open by the migration function, and the schema version is only stamped upward. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:364] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:533]

Two ways to remove the objects from existing databases:

1. **Discard and rescan (recommended).** Raise `SCHEMA_VERSION` from 1 to 2 and add one generic rule at open: a stored version below the current one means the file is closed, the main file and its `-wal` and `-shm` are deleted, and a fresh database is created. The rule names no table and no column, so it carries no lane vocabulary and never needs removing. It takes the tables, the indexes, the columns and the pointer rows in one move, and it leaves no freed pages behind.
2. **Drop in place.** Drop every table whose name matches `vec_*` by reading `sqlite_master`, drop the two `idx_skill_nodes_embedding_*` indexes, drop the three columns, then `VACUUM` and truncate the WAL. This keeps lane names in migration code for as long as old databases may exist. Without the `VACUUM` the dropped rows stay readable in the file's free pages. [INFERENCE: SQLite puts freed pages on a freelist and does not zero them unless secure delete is on; not tested on this file]

Two things to confirm before choosing option 1. First, that a fresh empty database is rescanned on its own at daemon start; start the daemon against an empty database directory and read `advisor_status`. Second, that `skill_graph_metadata` (3 rows here) holds nothing that a scan cannot rebuild; list its keys. Neither was read this run.

### F5. Backup and quarantine copies carry the vectors, and the rebuild route makes a new copy each run

- The rebuild workflow copies the database to `skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.<timestamp>.bak` before rebuilding and keeps that copy on success. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:91] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:106]
- `/doctor:update apply` prompts for that rebuild as its sixth phase. A user who accepts it on the update that delivers the removal gets a fresh backup of the old database, vectors included, unless the database was already discarded. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:205]
- The database directory also ignores `*.corrupt`, `*.corrupt-shm` and `*.corrupt-wal`, the runtime's quarantined copies. They are a third place a copy of the vector tables can sit. None exists on this machine. [SOURCE: .skilled/skills/system-skill-advisor/runtime/database/.gitignore:18]

Consequence: the machine cleanup runs after the update's rebuild prompt, not before it, and deletes every `.bak` and `.corrupt` sibling of the database by name pattern. Under "delete, never back up" these are deleted, not moved. The rebuild route's own backup step is a separate decision the operator may want to revisit; it is not lane code.

### F6. What this machine holds today

Read-only observation, so it describes one developer machine and not every user's.

- Compiled lane output is present: `R/dist/runtime/lib/scorer/lanes/semantic-shadow.js` with its map, `R/dist/runtime/lib/embedders/`, and `K/shared/dist/embeddings/`.
- `@huggingface` and `onnxruntime-node` are installed under both `R/node_modules` and `K/node_modules`.
- Ollama is installed at `/opt/homebrew/bin/ollama`. Its model store has one library entry, `nomic-embed-text` with tag `v1.5`. No `ollama` process and no `hf-model-server` process is running, and `/tmp/system-hf-embed` does not exist.
- `.env` has 11 keys and none belongs to the lane. `.mcp.json`, `opencode.json`, `.codex/config.toml`, `.utcp_config.json`, `.cursor/mcp.json`, `.claude/settings.json` and the untracked `.claude/settings.local.json` have zero matches for the lane's env vocabulary.

[INFERENCE: direct observation from `ls`, `pgrep`, `command -v`, a per-file match count and the env key listing this run]

The pulled model being the only entry in the store does not prove this repo pulled it. Nothing records the pull (iteration 3 F12).

### F7. Dotenv files cannot be read by the cleanup the ordinary way

A pre-tool hook blocks any shell command that reads `.env` and names the sanctioned route: `env-secret.cjs keys|validate|fingerprint <file>`, which returns key names without values. Two probes in this run were refused before that route was used, and the third returned the key list. The CLI has no write mode among the three named. So the cleanup detects stale lane keys through `keys`, and it reports them for the user to remove, unless `/doctor:env` has a remove mode. That command exists but its modes were not read. [SOURCE: .skilled/hooks/env-secret-guard/cli/env-secret.cjs:1] [INFERENCE: the three modes are taken from the hook's refusal message; the CLI source was not read]

### F8. How the two external stores delete a model

- Ollama: `DELETE /api/delete` on the local server with a required `model` field, answered with 200 "Model successfully deleted". The page says nothing about what happens to layers shared with other models. [SOURCE: https://docs.ollama.com/api/delete]
- HuggingFace cache: the default root is `~/.cache/huggingface/hub`, moved by `HF_HOME` or `HF_HUB_CACHE`. A model sits in one folder named `models--<org>--<name>`. `hf cache rm model/<org>/<name>` removes one repo and supports `--dry-run` and `--yes`. The cache is described as "the central cache shared across libraries", which is why ownership cannot be assumed. [SOURCE: https://huggingface.co/docs/huggingface_hub/guides/manage-cache]

The `hf` CLI is a Python tool and may not be installed. The fallback is deleting the one exact folder under the resolved root.

### F9. The user-machine cleanup design

One tool with a report mode and an apply mode. It runs per checkout. Every action deletes; none copies or moves.

| Leftover | How it is found | Action | Asks first |
| --- | --- | --- | --- |
| Vector tables, indexes, legacy columns, pointer rows in `skill-graph.sqlite` | `sqlite_master` names matching `vec_*` or containing `embedding`; `table_info(skill_nodes)` | Discard the file with its `-wal` and `-shm`, then rescan (F4 option 1) | No. Derived state. |
| `.bak` and `.corrupt` copies beside the database | The name patterns in F5 | Delete | No, but each path is printed in the plan the update flow shows before its approval |
| Vector shards `vectors/context-vectors__*.sqlite` | Exact glob under the advisor database directory | Delete | No |
| A running `hf-model-server` and `/tmp/system-hf-embed` | The pid file, plus a process whose command line ends in this checkout's `hf-model-server.cjs` | Stop that pid, delete the directory | No. The script path proves ownership. A socket directory moved by env is reported only. |
| Compiled lane output | The three paths in F6 | `npm run clean` and rebuild in `R/`; delete `K/shared/dist` and rebuild | No |
| Installed `@huggingface/transformers` tree | `node_modules/@huggingface` in both packages | `npm ci` after the lockfiles change | No |
| HuggingFace cache folder `models--nomic-ai--nomic-embed-text-v1.5` | The exact folder under the resolved cache root | `hf cache rm` when available, else delete that one folder | Yes. Shared cache. Never a `models--nomic*` glob (iteration 2 F9). |
| Pulled Ollama model `nomic-embed-text:v1.5` | `/api/tags` on a local host, else the manifest path under `OLLAMA_MODELS` or `~/.ollama/models` | `DELETE /api/delete` | Yes. Shared store, no record of who pulled it. |
| A running `ollama serve` | Process list | None. The route never recorded the pid it started, so the process cannot be attributed. | Reported only |
| Lane env keys in `.env` and `.env.local` | `env-secret.cjs keys` (F7) | Report the key names and the file | Reported only, pending the `/doctor:env` check |

Supporting evidence for individual rows: the model server's directory and default model [SOURCE: .skilled/bin/hf-model-server.cjs:29] [SOURCE: .skilled/bin/hf-model-server.cjs:30]; the route's pull and its unrecorded background server [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:71] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:131]; the shard path [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:450].

Design points the table does not show:

- **Shared build has no clean script, and a build-tool clean would miss the files.** The shared package's scripts are build, typecheck and test only. A compiler clean removes the outputs of sources that still exist, and the embedding sources will not. So `K/shared/dist` is deleted by path. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:15] [INFERENCE: TypeScript's build-mode clean works from the current project inputs; not run here. The machine check M1 in F11 confirms the result either way.]
- **The env key list.** Remove: `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS`, `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK`, `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, the `SPECKIT_HF_MODEL_SERVER_*` keys, `HF_EMBEDDINGS_MODEL`, `HF_EMBED_SERVER_URL`, `MEMORY_DB_PATH`, and the provider keys of `.env.example` section 7. Keep: `SPEC_KIT_DB_DIR` (F12), and Ollama's and HuggingFace's own `OLLAMA_HOST`, `OLLAMA_MODELS`, `HF_HOME`, `HF_HUB_CACHE`, which this repo never owned.
- **Linked worktrees.** `worktree-session.sh` gives each worktree its own database directory, so each can hold its own copy of the database and its own build output. The tool repeats its database and build steps for every path in `git worktree list`. [SOURCE: .skilled/bin/worktree-session.sh:495] [INFERENCE: that the advisor database follows that variable was not read]
- **The ask is not remembered.** Persisting a "keep this model" answer would write a new state file about the lane onto the user's machine. So the tool asks once per run, and a kept model is asked about again on the next update until it is gone.

### F10. The residue baseline

Both patterns over tracked files with `specs/` excluded, at commit `44251c5befd`: the identifier pattern matches 279 files, the prose pattern 163, and their union is 332. Of those, 23 sit in changelog folders. By area: advisor 175, spec-kit 82, `.skilled/commands` 24, sk-doc 9, sk-design 9, `.skilled/changelog` 9, `.skilled/bin` 6, sk-code 4, deep-loop 3, and nine areas with one or two each. Under `specs/`, 7,541 tracked files match. [INFERENCE: `git grep -l -i -E` counts this run, exit 0]

Two cautions on these numbers. The identifier pattern here uses `vec_cmd_` where iteration 4 used `vec_cmd_768`, and it includes the doctor folder, so 279 does not equal iteration 4's 262. And one file under `.skilled/skills/cli-classifier` matches; it is in no earlier inventory and was not opened.

### F11. The residue check design

Build it as a sibling of the memory residue sweeper, which already solves the same problem for another retired surface. It reuses that script's contract: exit 0 for clean, 1 for live hits, 2 for an invocation error, and exemptions kept as data rows with a written reason. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:58] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:363] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json:5]

**Repo mode**

- R1. Tracked content: both patterns over `git ls-files`, `specs/` excluded by path. Live hits after the allowlist must be 0, from a baseline of 332.
- R2. Tracked names: no path contains `embedders`, `semantic-shadow`, `model-server`, `.embeddings-cache` or, if the operator renames them, `five-lane`.
- R3. Generated artifacts are current: the bridge, trigger index, leaf manifest and mirror generators all pass their check mode.
- R4. Trigger index: regenerate, parse it as data, and assert that no matching phrase resolves to a path outside `specs/` (iteration 4 F15). Never grep the raw file.
- R5. Dependency: `@huggingface/transformers` is in neither `package.json` and in none of the three lockfiles.
- R6. Symlink: no tracked link under `R/lib/shared/` points at an embeddings folder.
- R7. Behavior, which a grep cannot prove: `advisor_status --include-semantic-health true` is refused; the status output's lane weights have exactly four keys; the scan response has no `embeddings` field; `/doctor:skill-advisor` lists six targets.
- R8. The check can fail: a fixture tree with one planted term exits 1.

**Machine mode**

- M1. No match for the identifier pattern under `R/dist` or `K/shared/dist`, and the three paths in F6 are absent.
- M2. No `@huggingface` or `onnxruntime-node` folder under either `node_modules`.
- M3. Every SQLite file in the database directory: no `sqlite_master` name matching `vec_*` or containing `embedding`, no `embedding*` column on `skill_nodes`, and the string `nomic-embed` does not occur in the file's bytes. No `.bak` or `.corrupt` sibling exists.
- M4. No process whose command line contains `hf-model-server.cjs`; no `/tmp/system-hf-embed`.
- M5. The exact HuggingFace cache folder is absent under the resolved root.
- M6. The Ollama model is absent from `/api/tags`, or from the manifest path when no server answers.
- M7. No lane key among the key names of `.env` and `.env.local`.
- M8. M1 to M3 hold for every linked worktree.

**The allowlist.** By exact path, never by folder: the fourteen-odd files of iteration 4 F14, `auto-note.md` 19 (F12), the orphan sweeper if its `ollama-preserve` guard stays, and the check's own three files (script, allowlist, test). The memory sweeper exempts itself the same way, with the reason "The sweep itself. Its term list is the thing being searched for." A path-prefix count this run gave 22 candidates, but that count used whole folders for sk-design and sk-code and is an upper bound.

**What it cannot prove.** A model pulled onto a remote Ollama host. A HuggingFace cache that an env value pointed somewhere else in the past. The log file of a background `ollama serve`, whose path was never recorded. Any other clone or machine until its owner updates.

"Zero remnants" therefore has one built-in exception: the check has to name what it looks for. One script, one allowlist and one test keep the vocabulary. Putting the cleanup's apply mode in the same script keeps it at one.

### F12. Open checks from earlier iterations, closed

- **Leaf manifest writer:** `generate-leaf-manifest.cjs`, with `--write` and `--check`. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:44]
- **RSS watchdog env subsection:** it goes. Under `.skilled/bin`, the `SPECKIT_LAUNCHER_RSS` keys appear in one file only, the model server's supervision library. [SOURCE: .skilled/bin/lib/model-server-supervision.cjs:109]
- **`SPEC_KIT_DB_DIR`:** it stays. Outside the package it is exported by the worktree script and set by deep-loop tests before they open the coverage graph, which means a deep-loop reader exists. The grep output was capped at 24 lines and showed setters only, so the reader itself was not seen. [SOURCE: .skilled/bin/worktree-session.sh:495] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-db.vitest.ts:26]
- **Menu renumbering:** the skill-advisor menu has seven items; item 5 at line 16 goes, and items 6 and 7 with their mapping rows at 32 and 33 become 5 and 6. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:16] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:32]
- **`SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`:** still no reader. Five more sites name it without assigning a literal: a capture script's env list, two Python scripts that hold it as a flag name, a test's env list and a test that saves and restores it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:89] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:274] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py:36] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:48] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts:103]
- **Two undecided tests, by title:** `conflict-query-rerank.vitest.ts` is an edit. Its tests at 160 and 179 cover the semantic cutoff and the exact rerank and go; those at 97 and 124 cover graph conflicts and query-class routing and stay. `lane-weight-sweep.vitest.ts` is also an edit: the test at 578 covers weight overrides, while 607 and 645 sweep "with seeded embeddings" and depend on a fixture iteration 1 deletes. Bodies were not read. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts:160] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:607]
- **Spec-kit `tests/embedders/` listing:** a plain `ls` shows nine test files, a README and a fixtures folder with two files. It matches iteration 2's list, so no file was missed there. [INFERENCE: `ls` output this run]
- **Three unread doc hits:** `daemon-lease-contract.md` 138 says a launcher "runs its own model server" when no `HF_EMBED_SERVER_URL` is given, so it is an edit. `auto-note.md` 19 says Ollama is a future provider of the ClickUp tool, so it is not a remnant. `watcher.md` 22 shows no lane word in its first 260 characters, so its match is still unread. [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:138] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/cupt-task-completion/auto-note.md:19]
- **Code files only on the prose pattern:** `prompt-policy.ts` 265 and `skill-advisor-cli-manifest.ts` 87 are both already in iteration 1's inventory. `content-normalizer.ts` and `trigger-extractor.vitest.ts` returned no line; the pathspec may be at fault, so they stay unclassified. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:265] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:87]

### F13. The ratchets can prove the removal is routing-neutral

No tracked JSON or JSONL file under the advisor runtime contains the lane id, `"cosine:` evidence or `meaningPassed`. So no committed baseline records a per-lane contribution from this lane. [INFERENCE: a `git grep -c` over the runtime's JSON and JSONL files returned no line; a pathspec fault would give the same empty result, so treat this as likely, not certain]

With a live weight of 0 the lane adds nothing to the live score. The two paths that could change a result are the command meaning path, which accepts only real cosine evidence and so never fires under the test fixtures, and the exact rerank, which is opt-in. That gives the removal a strong gate: the four CI ratchets must pass in steps 2 and 3 with their score baselines untouched. A ratchet that needs recapturing means the removal changed routing, and that is a finding to investigate, not a baseline to refresh. One field does change by design: `scorer-eval-baseline.json` 9 records the dead env flag as part of its regime. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:9] [INFERENCE: based on iteration 1 F3 for the two paths; no capture was run]

### F14. Operator decisions, each with a recommended default

1. **Released changelog entries.** Rewrite 23 files, or exclude changelog folders from the check. Recommended: exclude them. They are release history, and the new entry that announces the removal must name the lane anyway.
2. **Shadow weights.** They sum to 0.95 after the removal. Renormalize to 1.00, or leave them. Recommended: leave them. The live weights already sum to 0.95, and leaving them keeps the change a pure deletion and the shadow telemetry comparable with history. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9]
3. **The three "five-lane" file names.** Rename, or keep the names. Recommended: rename to a name without a count, so the next change in lane count renames nothing.
4. **The sweeper's `ollama-preserve` guard.** Keep it with an allowlist row, or remove it. Recommended: keep it. It protects a process the user owns and is not lane code. [SOURCE: .skilled/scripts/orphan-mcp-sweeper.sh:491]
5. **A pulled model nobody can attribute.** Remove silently, ask each run, or ask and remember. Recommended: ask each run (F9).
6. **`shared/chunking.ts` and `shared/utils/retry.ts`.** Delete with their tests in step 4, or leave. Recommended: delete. Their last production importer goes with the package, and the check would not flag them because they are not lane-named.
7. **Existing databases.** Discard and rescan, or drop in place. Recommended: discard (F4), after the two confirmations named there.

## Questions Answered

- **What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?** Answered by F1 to F3 (order and gates), F4 to F9 (cleanup), F10 and F11 (check). The order is a design built on existing gates and was not run.
- From the carried-forward list: the leaf manifest writer, the RSS watchdog subsection, `SPEC_KIT_DB_DIR`, the menu items after item 5, the two undecided tests, the spec-kit `tests/embedders/` listing and two of three unread doc hits (F12).

## Questions Remaining

All five key questions are answered. These checks are for the implementer:

- Does a fresh empty database get rescanned on its own at daemon start, and what do the three `skill_graph_metadata` rows hold (F4)?
- Does any routing corpus row expect the embedder command (F3)?
- Does `/doctor:env` have a remove mode (F7)?
- Does `generate-leaf-manifest.cjs` also write `leaf-aliases.json` (F2)?
- Unread: `watcher.md` 22, the one `cli-classifier` match, `content-normalizer.ts` and `trigger-extractor.vitest.ts` (F10, F12).
- The seven operator decisions in F14.

## Ruled Out

- Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward.
- A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script.
- Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only.
- Persisting a "keep the model" answer: it writes new lane state onto the user's machine.

## Dead Ends

- Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths.

## Edge Cases

- Ambiguous input: the truncated Next Focus; iteration 4's full text was used.
- Contradictory evidence: the first probe for compiled lane output looked under `dist/lib/` and reported it absent. The build writes to `dist/runtime/lib/`, and a second probe at that path found the files. F6 reports the second result.
- Missing dependencies: none.
- Partial success: two probes were refused by the dotenv guard before the sanctioned CLI was used on its own. Four items stay unread and are listed under Questions Remaining.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/package.json`, `.skilled/skills/system-spec-kit/package.json`, `.skilled/skills/system-spec-kit/shared/package.json`
- `.github/workflows/` (run lines of advisory-checks, routing-registry-drift, skill-advisor-stress, markdown-link-integrity, command-tree-parity)
- `~/.config/git/hooks/pre-commit` (outside the repository)
- `.skilled/commands/doctor/scripts/tests/README.markdown`, `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml`, `doctor-update-apply.yaml`, `doctor-skill-advisor-presentation.txt`
- `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts` (60 to 130), `lib/skill-graph/skill-graph-db.ts` (388 to 460, 522 to 545), `lib/scorer/lane-registry.ts` (7 to 15), `database/.gitignore`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` (1306 to 1320), `scripts/skill_graph_compiler.py`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs` (1 to 40, 112 to 128, structure lines), `fixtures/residue-allowlist.json`, `generate-trigger-index.mjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`
- `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` (run in `keys` mode)
- The live `skill-graph.sqlite`, read-only; this machine's process list, Ollama model store, build output and `node_modules`
- https://docs.ollama.com/api/delete
- https://huggingface.co/docs/huggingface_hub/guides/manage-cache
- Prior packet evidence: iterations 1 to 4

## Assessment

- New information ratio: 0.79
- Basis: 14 findings. Eight are fully new (F1, F4, F6, F7, F8, F10, F12, F13). Six are built mostly from the earlier inventories with new evidence added (F2, F3, F5, F9, F11, F14). (8 + 0.5 x 6) / 14 = 0.79.
- Questions addressed: the removal order, cleanup and residue check question; nine carried-forward checks.
- Questions answered: the removal order, cleanup and residue check question.

## Reflection

- What worked and why: reading the gates before drafting the order. The pre-commit hook checks leaf manifests and mirrors on every commit, and CI runs the sk-doc tests on every change, so two regenerations iteration 4 had placed at the end have to happen inside the commits that cause them.
- What worked and why: querying `sqlite_master` instead of assuming the tables were vector-extension tables. They are plain tables in a derived database, which turns a migration problem into "discard the file".
- What did not work and why: probing compiled output at `dist/lib/`. The build nests under `dist/runtime/`, a path `INSTALL-GUIDE.md` 105 already showed, so the first result was a false absence and cost one call.
- What did not work and why: listing dotenv keys with `grep`. The guard refuses any shell read of the file, and it refused a second attempt that wrapped its own CLI in a loop with a pipe.
- What I would do differently: run the allowlist count with exact paths from iteration 4 F14 instead of folder prefixes, so the expected post-removal number is exact and not an upper bound.

## Recommended Next Focus

The research run is at its last iteration and all five key questions are answered. The next step is planning, not more research: turn F3 into a phased implementation packet with one child per step, carry the seven decisions in F14 to the operator before the scope is frozen, and run the six implementer checks under Questions Remaining during step 0, since two of them (the rescan on an empty database and the routing corpus rows) can change the content of steps 1 and 3.
