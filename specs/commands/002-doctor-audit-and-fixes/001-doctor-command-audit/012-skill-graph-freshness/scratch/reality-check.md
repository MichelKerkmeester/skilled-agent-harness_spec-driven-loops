# Reality check — `/doctor:speckit skill-graph-freshness`

Audited at `83616db9ba` (branch `worktrees/079-doctor-command-audit`), node `v26.8.2`, cwd the worktree root.
Every row below was produced by a command run in this checkout; the full transcript, with commands, output
and exit codes, is `scratch/doctor-run.log`. Log section numbers are given so the row can be checked against
the run rather than trusted.

Sources read for this table:

- route entry — `.skilled/commands/doctor/_routes.yaml:139-152`
- router — `.skilled/commands/doctor/speckit.md:54` (and `:59-68` for the resolution steps)
- workflow — `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` (97 lines)
- presentation — `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (`:19`, `:37`, `:61`, `:77`, `:101`, `:152-165`, `:200`)
- script — `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (118 lines)
- scripts index — `.skilled/commands/doctor/scripts/README.md:40,57,103,119,139`

Status vocabulary: **present** (exists and behaves as the doctor assumes), **moved** (exists elsewhere; new path
given), **missing** (named resource does not exist), **inert** (exists but nothing consumes it), **unresolvable
reference** (prose, not a path, and no document of that title exists).

---

## 1. The four upstream assets the workflow names

| # | Named resource | Named at | Status | Command run that showed it (log section) |
|---|---|---|---|---|
| 1 | `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | YAML `:43`; route `:147`; README `:57` | **present** — 118 lines, 5747 bytes, executable by `node` | `test -e`; `wc -l`; `stat -f '%z'`; `node --check` exit 0 (§1a, §2b, §10) |
| 2 | `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | YAML `:44` | **present** — 18421 bytes, `families` + `generated_at`, `skill_count` 14; git-tracked | `test -e`; `git ls-files --error-unmatch` succeeded (§1a, §6d) |
| 3 | `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` | YAML `:45` | **present** — 286720 bytes, `skill_nodes` 14 rows. Not git-tracked: `*.sqlite` is ignored runtime state | `test -e`; `git ls-files --error-unmatch` → `pathspec ... did not match any file(s) known to git`; `cat .gitignore` (§1a, §6d) |
| 4 | `.skilled/skills/*/graph-metadata.json` (disk truth) | YAML `:46` | **present** — the glob resolves to exactly 14 files, one per skill directory, and no other skill-metadata file exists at depth 2–3 | `ls -d .skilled/skills/*/graph-metadata.json \| wc -l` → 14; `find .skilled/skills -name graph-metadata.json` → 14 real + 6 test fixtures at depth 7/9 (§1a, §8) |
| 5 | `contract: "local command design contract"` | YAML `:42` | **unresolvable reference** — no file, directory or document carries that title; 8 of the 14 YAML assets in `.skilled/commands/doctor/assets/` carry the key and none defines it. No consumer resolves it: the router resolves `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools` and script invocations (`speckit.md:64,67`), and `route-validate.py` never reads a `contract` key | `grep -l 'local command design contract' .skilled/commands/doctor/assets/*.yaml \| wc -l` → 8 of 14 (§11) |

## 2. Route-entry fields (`_routes.yaml:139-152`)

| # | Field as declared | Status | Evidence (log section) |
|---|---|---|---|
| 6 | `target: skill-graph-freshness` | **present** on all four surfaces the validator checks: route, router table, presentation menu, presentation manifest | `grep -n skill-graph-freshness` over `_routes.yaml:_139`, `speckit.md:54`, `doctor-speckit-presentation.txt:19,37,61,77,101`, `scripts/README.md:40,57,103,119,139`; `route-validate.sh` **PASS J1** parity (§6c, §5) |
| 7 | `yaml: doctor-skill-graph-freshness.yaml` `:140` | **present** | `ls .skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml`; `route-validate.sh` PASS D1 (§5) |
| 8 | `setup_vars: [execution_mode]` `:141` | **present** — the YAML consumes exactly that one variable and requires the literal `INTERACTIVE` (YAML `:51-52`, `:58-59`) | `sed -n '139,152p' _routes.yaml`; YAML read (§6c) |
| 9 | `allowed_flags: []` `:142` | **present and honest** — the script has no flag parser at all | `grep -c process.argv skill-graph-freshness.cjs` → `0`; passing `--json` changed nothing (§2e, §6a) |
| 10 | `mutating: read-only` `:143` | **present and confirmed** — sources byte-identical before and after all seven runs recorded in the log | `shasum -a 256` on the compiled json and sqlite, `stat -f '%m %z'` on all 14 disk files, identical in §2a and §2f; the script opens SQLite with `{ readOnly: true }` (`:52`). Run inventory: log §10 |
| 11 | `gate3_location: "n/a (read-only diagnostic; ... writes nothing)"` `:144` | **present and confirmed** — the workflow declares `read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]` (YAML `:64-69`) | YAML read; no file created anywhere by the runs (§2f, §9) |
| 12 | `mcp_tools: []` `:145` (comment: "script-only read; no MCP calls") | **present and confirmed** — the script's entire import surface is `fs`, `path`, `node:sqlite` | `grep -nE "^const \|require\(..." skill-graph-freshness.cjs` → 3 requires, no MCP client (§6a) |
| 13 | `script_invocations: ['node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs']` `:146-147` | **present** — the exact command runs and exits 0 | log §2c; `route-validate.sh` **PASS I1** ("all route script_invocations resolve to existing local scripts") (§5) |
| 14 | `cli_commands` — absent from this route | **absent by design** — the script spawns no CLI; nothing to declare. Legal: the route declares its tool surface through `mcp_tools` instead (`route-validate.py:56 TOOL_DECLARATION_KEYS`) | `sed -n '139,152p' _routes.yaml`; `route-validate.sh` **PASS F3** (§6c, §5) |
| 15 | `trigger_phrases:` — four phrases `:148-152` | **present but inert** — the manifest's own header says the field is "retained for a possible future doctor-routes harvester but is inert today" (`_routes.yaml:6-17`) | `sed -n '1,60p' _routes.yaml`; routes parsed by the router from argv, not from phrases (`speckit.md:61-62`) |

## 3. What the workflow says it will execute, print and write

| # | Workflow statement | Status | Evidence (log section) |
|---|---|---|---|
| 16 | `:78` "Execute upstream_assets.diagnostic_script via Bash (no arguments)." | **present and executed** — run with no arguments, as written | §2c |
| 17 | `:79` "Capture stdout and exit code." | **present** — stdout captured verbatim, exit `0` recorded | §2c, §2d, §3a |
| 18 | `:80-82` outputs `drift_report`, `exit_code` | **present** — the panel prints source counts plus the five named sets, then the report-only footer (`skill-graph-freshness.cjs:90-114`) | §2c |
| 19 | `:87` "Print the drift report (source sizes + zombie/ghost/mismatch/missing/null-stamp sets)." | **present, wording loose** — the panel prints source *counts* (`14 skills`, `14 nodes`), never byte sizes. Cosmetic only; the five sets print exactly as named | §2c |
| 20 | `:94` `STATUS=OK always (informational diagnostic; the script exits 0)` | **present and confirmed** in all seven runs, including two foreign databases and an absent database | §2c, §2d, §2e, §3a–§3d (all `exit=0`); run inventory §10 |
| 21 | `:35` / `:64-69` read-only invariant ("NEVER writes, NEVER re-indexes, NEVER self-heals") | **present and confirmed** — nothing written, and the check to reindex (`advisor_rebuild`, `skill_graph_scan`) is nowhere in the route's tool surface | §2a vs §2f hashes; §6a import surface |
| 22 | `:26` "It reads via stdlib node:sqlite (read-only)" | **present** — `require('node:sqlite')` loads, `DatabaseSync` opens with `readOnly: true` | §6a (`node:sqlite OK`), §2c (`SQLite skill-graph.sqlite : 14 nodes` proves the read succeeded rather than failing into the `unreadable` branch at `:57-58`) |
| 23 | `:5` "the Python-compiled scripts/skill-graph.json" | **present and accurate** — the producer is `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`, whose default output is exactly that path | `skill_graph_compiler.py:33 DEFAULT_OUTPUT = os.path.join(SCRIPT_DIR, "skill-graph.json")`; `:1054` description "Compile skill graph-metadata.json files into skill-graph.json" |
| 24 | `:5` / `:26` "the SQLite skill-graph.sqlite the daemon reads" | **present and confirmed live** — the running advisor daemon in this worktree holds that exact file open (fd `13u`), and holds the compiled json open too (fd `231r`) | `cat .../database/.system-skill-advisor-launcher.json` → `childPid 54440`; `lsof -p 54440 \| grep sqlite` (§4) |
| 25 | `:5` / `:27` "depth-1 on-disk graph-metadata.json files (the source of truth)" | **present** — depth-1 is complete for this checkout: every one of the 14 skill directories carries metadata, and the only deeper metadata files are system-spec-kit's CLI test fixtures | §8 (`find` depth histogram: 14 real files + 6 fixtures); `find ... \| wc -l` → 20 total, §10 |
| 26 | `:63-64` script comment "excludes `z_archive/`, which is a nested tier" | **present but currently inert** — no `z_archive` directory exists anywhere under `.skilled/skills` today (14 skill directories, 0 archive tiers), so the exclusion has nothing to exclude | `find .skilled/skills -name z_archive -type d \| wc -l` → 0; `ls -d .skilled/skills/*/ \| wc -l` → 14 (§10) |

## 4. Data shapes the script assumes

| # | Assumption | Where | Status | Evidence |
|---|---|---|---|---|
| 27 | compiled JSON has `families` as `{ family: [ids] }` | script `:38-41` | **present** — 6 family keys (`cli`, `deep-loop`, `mcp`, `sk-code`, `sk-util`, `system`) | `node -e` key dump (§2a context); §7 |
| 28 | compiled JSON has `generated_at` | script `:42` | **present** — `2026-09-29T07:49:34.068437+00:00` | §8 |
| 29 | SQLite has table `skill_nodes` with `id`, `family` | script `:54` | **present** — 14 rows; all 13 columns listed | `PRAGMA table_info(skill_nodes)` via read-only `DatabaseSync` (§2a context) |
| 30 | disk metadata has `skill_id` (string) and `family` | script `:75-76` | **present** — all 14 files carry both | §8 |
| 31 | disk freshness stamp is `derived.last_updated_at`, with `derived.generated_at` as fallback | script `:63-64,77` | **present as written** — all 14 files carry `derived.last_updated_at`; **none** carries `derived.generated_at`, so the fallback branch never fires here | §8 stamp dump |
| 32 | `SYSTEM_SKILL_ADVISOR_DB_DIR` overrides the database directory | script `:47-48` | **present and honoured** — the launcher and eight runtime modules read the same variable. It is named **nowhere** in the route entry or the workflow YAML; the doctor contract documents no source override | `rg -n SYSTEM_SKILL_ADVISOR_DB_DIR .skilled` → `.skilled/bin/system-skill-advisor-launcher.cjs:131,336,368,1001`; `.skilled/bin/lib/launcher-ipc-bridge.cjs:95`; `hooks/lib/skill-advisor-cli-fallback.ts:177`; `runtime/skill-advisor-cli.ts:220`; `runtime/lib/skill-graph/skill-graph-db.ts:271`; `runtime/lib/freshness/generation.ts:54`; `runtime/lib/daemon/lease.ts:101`; `runtime/lib/daemon/watcher.ts:316`; `runtime/lib/scorer/projection.ts:70` (§6b) |

## 5. Presentation and router surfaces that name this target

| # | Surface | Status | Evidence |
|---|---|---|---|
| 33 | `speckit.md:54` workflow-asset table row | **present** | `grep -n` (§6c); `route-validate.sh` PASS J1 (§5) |
| 34 | `doctor-speckit-presentation.txt:19` menu row `10) Check Skill-Graph freshness` | **present** | same |
| 35 | `:37` accepted answer `10` → `skill-graph-freshness` | **present** | same |
| 36 | `:61` help row "Compiled/sqlite/disk skill-graph disagree -> 10" | **present** | same |
| 37 | `:77` "Valid targets:" list | **present** | same |
| 38 | `:101` manifest row (workflow file, `read-only`, one-line purpose) | **present** and matches `_routes.yaml:140,143` | same |
| 39 | `:152-165` shared read-only result template, status vocabulary `OK\|DEGRADED\|STALE\|MISSING\|ATTENTION\|EMPTY\|CANCELLED\|FAIL` | **present**, and explicitly subordinate: `:152` gives precedence to "the target workflow output contract when it provides a stricter report shape", and this workflow's contract is `STATUS=OK` (`YAML:94`) | presentation read |
| 40 | `:200` troubleshooting row pointing at `route-validate.sh` | **present and runnable** | `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, 13 PASS, 0 FAIL (§5) |

## 6. Behavioural checks (does it still do what the workflow assumes?)

The checkout is clean, so the default run cannot demonstrate detection. Read-only probes were used instead:
a second database source, an absent database source, an independent recomputation, the route validator, and
before/after hashes of every source.

| # | Check | Result | Evidence (log section) |
|---|---|---|---|
| 41 | Baseline run, exact route command, no arguments | 14/14/14, all five sets `none`, exit 0 | §2c; identical on re-run §2d |
| 42 | Independent recomputation of the same three sets (separate implementation, same sources) | identical: `ZOMBIE none`, `MISSING none`, `GHOST none`, both family comparisons `none`, both key sets equal | §7 |
| 43 | ZOMBIE / MISSING detection with a genuinely different database (15-node database from `.worktrees/064-save-writer-continuity-fields`) | fires — `ZOMBIE: cli-jev, sk-communication`; `MISSING: cli-classifier` | §3b |
| 44 | Same probe with a 17-node database (`barter/ai-speckit/coder`) | fires — `ZOMBIE: cli-jev, sk-bartender-endpoint-interpreter, sk-bo-notifications-templates, sk-communication`; `MISSING: cli-classifier` | §3c |
| 45 | Degradation when the database is absent | `SQLite skill-graph.sqlite : absent`; the three SQLite-derived sets disappear; compiled-vs-disk sets still print; exit 0 | §3d |
| 46 | Read-only on foreign databases too | `DatabaseSync(..., { readOnly: true })`; probe databases' hashes recorded after the probes, mtimes older than the probe window | §3e |
| 47 | Route validator over the live manifest | exit 0, `OK: route-validate — 10 routes validated, 2 warnings`, including **K1/K2** (no read-only route declares a write or grants a mutating advisor command) and **J1** (three-way display parity) | §5 |
| 48 | No write outside scratch | compiled json shasum, sqlite shasum + mtime + size, and all 14 disk mtimes/sizes unchanged at baseline (§2a) and after the last run (§11); no tracked file modified | §2a vs §2f, §2g, §11 |
| 49 | The four upstream assets resolve from the workflow's own working directory (repo root, since the script walks up to `.git` at `skill-graph-freshness.cjs:17-26`) | resolves — `.git` is a *file* in this linked worktree and `fs.existsSync` accepts it, so `REPO` is the worktree root and all four relative paths resolve inside it | `ls -la .git` → `-rw-r--r--@ 1 ... 114 Oct  2 18:07 .git` (§10); every run printed the expected sources rather than `absent` (§2c) |

## 7. Verdict of this table

Every path, script, command, flag, tool and environment variable this doctor names exists and behaves as the
workflow assumes, with one exception of form rather than function: `contract:` (row 5) names a document that
does not exist and that no consumer reads. Nothing is moved. Nothing that the workflow depends on is missing.
The panel's verdict was reproduced by a second implementation, and the panel was observed firing on genuine
three-way disagreement instead of only reporting a clean checkout.
