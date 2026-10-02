# Reality check: `/doctor:speckit speckit-retrieval`

Worktree audited: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/079-doctor-command-audit` at `83616db9ba221a80d271b2b924b3a32664962ffd`.
Node `v26.8.2`, ripgrep `15.2.0 (rev e89fff89ac)`.
Every row below was produced by a command whose output is in `doctor-run.log` next to this file. Nothing here was inferred from memory or from another document.

Sources read in full: `.skilled/commands/doctor/_routes.yaml` (§ the route block, lines 33–51), `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` (260 lines), `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (202 lines), `.skilled/commands/doctor/speckit.md` (87 lines).

Legend: **present** = exists here and behaves as the workflow assumes; **moved** = exists at a different path than the one named; **missing** = the named thing does not exist; **stale claim** = the thing exists but the workflow's description of it no longer matches.

---

## 1. Route entry — `_routes.yaml` lines 33–51

| Named item | Kind | Status | Command that showed it |
|---|---|---|---|
| target `speckit-retrieval` | route target | present | `bash .skilled/commands/doctor/scripts/route-validate.sh` → `PASS: J1: _routes.yaml routes, speckit.md table, and all 3 presentation displays are in parity` |
| `doctor-speckit-retrieval.yaml` | workflow asset | present | `ls .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` |
| `setup_vars: [execution_mode, intent, incremental]` | setup variables | present (bound by the router); `incremental` is a diagnostic input only | `.skilled/commands/doctor/speckit.md:64` resolves them from the route; `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:53` labels `incremental` "informational; no regeneration in this command" |
| `allowed_flags: ["--incremental=true\|false"]` | flag schema | declared, no consumer anywhere | `rg -n -- "--incremental" .skilled` → two hits only: `_routes.yaml:36` and `route-validate.sh:131` (the validator's own copy). No script in the repository accepts it |
| `mutating: add-only` | mutation class | present | `route-validate.sh` → `PASS: E1: all mutation classes valid` |
| `gate3_location: "<packet_scratch>/doctor-speckit-retrieval-report.<timestamp>.md + <packet_scratch>/doctor-speckit-retrieval-state.<timestamp>.json"` | declared write targets | consistent with the workflow | `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:67-68,242` name the same two paths |
| `mcp_tools: []` | MCP tools | n/a — none named | `route-validate.sh` → `PASS: F2: all route mcp_tools are subsets of router allowed-tools union` |
| `lookup-trigger-index.mjs --json -- "<prompt>"` | script invocation | present, runs | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "resume work session context"` → exit 0, `candidatePhraseCount` 1051, `indexHash` `c2b9c6b7…`, `manifestHash` `6c0344fd…` |
| route entry's exit-class claim: "exit 0 = hits, 1 = clean no-hit, 2+ = missing or unreadable index" | behaviour claim | present, holds | 23 prompts from `fixtures/prompt-set.json` all exited 0 or 1; `--index /nonexistent/trigger-index.json` → exit 2 with `ENOENT: no such file or directory` on stderr |
| rg recipe (path-only, `--no-config`, five globs, `--max-count 1`) | script invocation | present, runs | the literal line from `_routes.yaml:44` → exit 0, 15 paths |
| `trigger_phrases` (4 rows) | routing phrases | present but inert by design | `_routes.yaml:14` states the advisor harvesters never read this file ("retained for a possible future doctor-routes harvester but is inert today") |

---

## 2. Workflow YAML — paths and scripts

| Named item | Status | Command that showed it |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | present | `test -f …` → exit 0; `stat -f '%m %z' …` → `1790964386 3649759` |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | present | `ls` → 23761 bytes; `rg -n "^#{1,3} " …` → §2.2 at line 90, §7 at 220, §8 at 235 |
| `lookup-trigger-index.mjs` | present | `ls .skilled/skills/system-spec-kit/runtime/cli/retrieval/` → 14272 bytes |
| `generate-trigger-index.mjs` | present | same `ls` → 30303 bytes; header comment lines 28–41 document `--repo-root`, `--allow-malformed`, `--json`, `--quiet`, `--out`, `--manifest`, `--diagnostics`, `--variants`, `--check` |
| `measure-cold-lookup.mjs` | present | same `ls` → 14870 bytes; header lines 15–19 document `--index --lookup --manifest --runs --warmup --out --json --quiet` |
| `sync-gate1-pointers.cjs` | present | `ls .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/` → 5842 bytes |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` | present | `ls -la …` → 7116 bytes, `Status: Complete` on line 30 |
| `fixtures/latency-report.json` | present | `ls …/fixtures/` → 2465 bytes |
| `fixtures/prompt-set.json` | present | same `ls` → 11868 bytes. **Shape is not what the YAML implies:** the file's top-level keys are `cases` (18 entries), `daemonProbe.prompts` (3) and `recipeProbe`; there is no `prompts` key. The YAML's "once per prompt in fixtures/prompt-set.json" still resolves, to 23 prompts in total |
| `fixtures/corpus-manifest.json` | present, hash matched | 3215524 bytes; `manifestHash` `6c0344fd…` |
| `fixtures/generation-diagnostics.json` | present, hash matched | 3045564 bytes; `manifestHash` `6c0344fd…` |
| `fixtures/phrase-variants.json` | present, hash matched | 2728114 bytes; `manifestHash` `6c0344fd…` |
| the four-way pair compare (index + 3 generator-written fixtures) | holds | all four `manifestHash` values are `6c0344fd7582f89d7247d6f9815da371d30c5ce4390b4bc316c110a744984d7c`; `committed_pair_mismatch` does not fire |
| `AGENTS.md` | present | `grep -c lookup-trigger-index.mjs AGENTS.md` → `1` (line 65) |
| `.codex/AGENTS.md` | present, in sync | `node …/sync-gate1-pointers.cjs --check` → exit 0, `PASS: 2 instruction files carry the root Gate 1 lookup`; block at lines 124–132 |
| `.cursor/rules/skill-routing.md` | present, in sync | same check; block at lines 20–28 |
| `CLAUDE.md` symlink | **missing** | `ls -la CLAUDE.md` → `No such file or directory`, in this worktree *and* in the main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. `git show --stat 0c40639821` → "chore(repo): remove the CLAUDE.md link to AGENTS.md", `CLAUDE.md \| 1 -`, dated 2026-09-24. `README.md:1396` now reads "Claude Code reads it directly, so the repository ships no `CLAUDE.md`" |
| `.skilled/agents/**/*.md` (forbidden target) | present | `ls -d .skilled/agents` → exists |
| `.skilled/commands/doctor/*.md` (forbidden target) | present | `ls .skilled/commands/doctor/*.md` → `env.md`, `mcp.md`, `speckit.md`, `update.md` |
| `.skilled/commands/doctor/assets/doctor_*.yaml` (forbidden target) | **matches nothing** | `ls .skilled/commands/doctor/assets/doctor_*.yaml \| wc -l` → `0`; the real assets use a hyphen: `ls .skilled/commands/doctor/assets/doctor-*.yaml \| wc -l` → `14` |
| `<active-spec-folder>/description.json`, `<active-spec-folder>/graph-metadata.json` (forbidden targets) | present in the tree | `rg --files -g 'graph-metadata.json' -g 'description.json' specs` → many, under every track |
| `.skilled/commands/doctor/scripts/route-validate.sh` (named by the presentation, §6) | present, passes | `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `OK: route-validate — 10 routes validated, 2 warnings` |
| `/doctor:update` (the regeneration target the workflow recommends) | present | `ls .skilled/commands/doctor/update.md` (3760 bytes) and `assets/doctor-update.yaml` (27734 bytes); `_routes.yaml:242-244` describes it as a standalone command, not a route target |
| `/doctor:update --migrate` (named by the presentation, §1) | present | `.skilled/commands/doctor/update.md:3,34,46` declares and documents `--migrate` |
| `/doctor:mcp install` and `/doctor:mcp debug --fix` (named by the presentation, §6) | present | `.skilled/commands/doctor/mcp.md:3` `argument-hint: "<install [--runtime <name>]\|debug [--fix]>"`; lines 34, 49–53 |
| `upstream_assets.contract: "local command design contract"` | no document by that name | `rg -l -F 'local command design contract' .skilled` returns the 8 doctor YAMLs that each name it; no file defining it |

---

## 3. Workflow YAML — commands, env vars, flags and signals

| Named item | Status | Command that showed it |
|---|---|---|
| `test -f <index>` | present | exit 0 |
| `stat -f '%m %z' <index>` | present (BSD form works on this host) | `1790964386 3649759` |
| `grep -c lookup-trigger-index.mjs AGENTS.md` | present, count 1 | exit 0, `1` |
| `node -e` reading the index's `paths` array and stat-ing each entry | present, `paths` is a plain array of path strings | 12700 paths, 0 missing, 29 newer than the index mtime |
| the 23 prompt-set lookups | present | all exited 0 or 1, zero exits ≥ 2 |
| `measure-cold-lookup.mjs --json --out <packet scratch>` | present, works, exit 1 = over budget as documented | exit 0, `p95Ms 104.256` against `budgetMs 200`, `withinBudget true`, 36 samples; the committed `fixtures/latency-report.json` was left untouched (`git status --porcelain .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/` → empty) |
| the 2.2 recipe run with and without `--no-config` | present; **the YAML's "five exclusion globs" is wrong — section 2.2 lists four exclusions plus one include** | `rg -n "^#{1,3} " …/retrieval-conventions.md` → §2.2 at line 90; lines 95–98 show `--glob '*.md'` plus `!**/z_archive/**`, `!**/node_modules/**`, `!**/.git/**`, `!**/scratch/**`. Both runs returned the same 15 paths; `RIPGREP_CONFIG_PATH` is unset and `~/.ripgreprc` is absent, so no ambient-config signal exists here |
| the recipe re-run with a nonexistent root | present, exit 2 with stderr | `rg: no-such-root-xyz: No such file or directory (os error 2)` |
| `RIPGREP_CONFIG_PATH` (the only environment variable the workflow names) | present as a name, unset in this environment | `printenv RIPGREP_CONFIG_PATH` → exit 1 |
| `--no-config`, `--hidden`, `--fixed-strings`, `--ignore-case`, `--files-with-matches`, `--max-count 1` | present | the verbatim recipe ran, exit 0 |
| `schema_version_mismatch` signal: "the index schema version does not match the version the lookup script expects" | present and enforceable | `runtime/cli/retrieval/lib/artifact.mjs:146` `TRIGGER_INDEX_SCHEMA_VERSION = 2`; `:164` throws on mismatch; `lookup-trigger-index.mjs:30` imports it and `:84` calls `assertTriggerIndexShape`. Index `schemaVersion` is `2`, so no mismatch |
| `committed_pair_mismatch` signal | present, does not fire | four-way hash compare above |
| `index_older_than_corpus` signal | present, fires | 29 indexed files have an mtime newer than the index (all within 24 ms of `2026-10-02T18:06:26.402Z`, i.e. checkout noise); `generate-trigger-index.mjs --check --json` → exit 1, `fresh: false`, 86 stale documents — so the medium-severity verdict is correct for this checkout even though the mtime sample alone is noise |
| `ripgrep_ambient_config` signal | present, does not fire | same-15-path comparison above |
| `trigger_phrase_drift` signal | present; ran over all 29 candidates rather than the 5 the YAML samples | 0 files whose declared `trigger_phrases` are not owned by the index for that path |
| `anchor_marker_drift` signal | present; 0 imbalances over the 29 candidates | opener/closer counts and per-id pairing compared per file |
| `corpus_pollution` signal, named classes: `single-token, numeric-only, generic-workflow-word, stop-word-only, prose-sentence, editor-fallback and folder-token-fallback` | six of the seven are readable; **`folder-token-fallback` can never appear** | committed `fixtures/generation-diagnostics.json` `phraseQuality.phrases` = `{editor-fallback: 2, generic-workflow-word: 3, numeric-only: 33, ok: 32984, prose-sentence: 25, single-token: 237, stop-word-only: 2}`; `phraseQuality.documents` = `{editor-fallback: 3, generic-workflow-word: 95, numeric-only: 52, prose-sentence: 16, single-token: 508, stop-word-only: 10}`. No `folder-token-fallback` key in either. Cause, read directly: `generate-trigger-index.mjs:260` calls `judgeTriggerPhrase(normalized)` with no context, and `lib/phrase-judge.mjs:100-103` returns that class only when `context.folderTokens` contains the token — the default `context = {}` at `:62` makes it unreachable at generation. The validator at `runtime/cli/rules/check-grep-convention-helper.mjs:187` does pass `{ folderTokens }`, so the class exists and fires there |
| `gate1_instruction_parity` signal, Claude half: "Claude reads the root AGENTS.md through the CLAUDE.md symlink" | **stale claim** | `CLAUDE.md` absent (row above); `sync-gate1-pointers.cjs` line 7 states "Claude reads that file directly" |
| `gate1_instruction_parity` signal, Codex/Cursor half | present and passing | `sync-gate1-pointers.cjs --check` → exit 0 |
| `gate1_instruction_parity` signal, Pi half: "Pi's context-file loading no longer lists AGENTS.md" | present | `dist/core/resource-loader.js:116` in the installed `@earendil-works/pi-coding-agent` → `const candidates = ["AGENTS.override.md", "AGENTS.md", "AGENTS.MD", "CLAUDE.md", "CLAUDE.MD"]`. Also documented at `.pi/SYNC.md:93` |
| `pass_policy.index_regenerates_byte_identical: true` | declared policy, not checkable inside the workflow's own write boundary | the workflow's `allowed_targets` (`doctor-speckit-retrieval.yaml:67-68`) permit only the report and state log; proving it needs two generator runs, which `--out <path>` could direct at scratch but the doctor does not do |
| `pass_policy.lookup_exit_class` | holds | 23 exits, all 0 or 1 |
| `pass_policy.cold_lookup_p95_budget_ms: 200` | holds when measured fresh | 104.256 ms. The committed evidence file is a captured-once snapshot and is *expected* to mismatch: its `manifestHash` is `c0806077…`, its `indexPath` names a deleted worktree (`/Users/michelkerkmeester/worktrees/public/017-memory-decommission/…`) and a deleted layout (`.opencode/skills/system-spec-kit/data/trigger-index.json`; the layout is now `runtime/data/`). `runtime/cli/retrieval/README.md:79` states the five frozen fixtures pin their snapshot hash and that a mismatch is not a staleness signal, so this is not a defect |

---

## 4. Presentation sections

| Named item | Status | Command that showed it |
|---|---|---|
| startup menu row `2) Debug retrieval index (trigger index, ripgrep conventions)` → `speckit-retrieval` | present | `doctor-speckit-presentation.txt:13,31`; `route-validate.sh` → `PASS: J1` parity across the manifest, the router table and all 3 presentation displays |
| subsystem manifest row `speckit-retrieval \| doctor-speckit-retrieval.yaml \| add-only` | present, matches the route | `doctor-speckit-presentation.txt:95` vs `_routes.yaml:33-40`; `PASS: J1` |
| unknown-target list containing `speckit-retrieval` | present | `doctor-speckit-presentation.txt:77`; `_routes.yaml` has 10 routes, all named on that line |
| §3 Trigger-Index Regeneration Preference prompt (`Incremental` default / `Full`) | present, but it offers a mode that does not exist | `doctor-speckit-presentation.txt:112-120`. `.skilled/commands/doctor/assets/doctor-update.yaml:369` says the generator runs a "full regeneration … with no daemon and no incremental mode"; the workflow's own phase 2 rule (`doctor-speckit-retrieval.yaml:209`) recommends "an incremental regeneration via /doctor:update" |
| §3 second prompt block (`stale / missed / bloat / all / excludes`) with the line "Ask this only when `--scope` was not passed" | **orphaned — belongs to no target** | `doctor-speckit-presentation.txt:123-133`. No route in `_routes.yaml` accepts those values: `--scope` is `research\|review\|council\|both\|all` for deep-loop (`:66`) and `all\|explicit\|derived\|lexical` for parent-skill (`:83`); `speckit-retrieval` does not accept `--scope` at all. The block has no target heading and sits directly under the speckit-retrieval prompt, so it reads as that target's |
| §4 setup dashboard naming `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | present | file exists (202 lines); `PASS: J1` |
| §5 read-only diagnostic summary template | present, consistent with the target's `mutating: add-only`/read-only diagnostic shape | `doctor-speckit-presentation.txt:156-165` |
| §6 troubleshooting rows: `/doctor:update`, `/doctor:mcp debug --fix`, `/doctor:mcp install`, `bash .skilled/commands/doctor/scripts/route-validate.sh` | all present | rows above in §2/§3 of this document |

---

## 5. Deliberately not run

| Step | Why |
|---|---|
| `generate-trigger-index.mjs` without `--check` (the publish path) | writes the committed index and its three sidecars; the workflow's `forbidden_targets` name the index explicitly, and `/doctor:update` owns regeneration |
| `generate-trigger-index.mjs --out <scratch>` twice, to test byte-identical regeneration | permitted by the generator's own scratch-build contract, but it is a corpus-wide rebuild rather than a diagnostic read; the doctor does not name it and it is outside this audit's read-only remit |
| any MCP tool call | the route declares `mcp_tools: []`; this target is file-and-script only |
| the interactive gates (`before_phase_1_analysis`, `before_phase_2_recommendation`) | no operator is present in a dispatched worker; phases were run end to end in diagnostic order |
| writing the phase 3 report and state log | the audit's outputs are the three files named in its brief, not the doctor's own report; the doctor's report/state paths were treated as the only sanctioned write targets |

Raw evidence, per-command output and exit codes: `doctor-run.log` in this directory.
