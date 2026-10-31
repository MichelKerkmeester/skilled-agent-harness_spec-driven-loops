# Proposal — `/doctor:speckit skill-graph-freshness`

Audited at `83616db9ba` on node `v26.8.2`. Full command transcript with output and exit codes:
`scratch/doctor-run.log`. Reference table: `scratch/reality-check.md`. Every claim below is either a
`file:line` citation or a line from that log; log sections are named so the reader can rerun them.

---

## Verdict: **keep**

The doctor still matches the system it inspects. Its script, its three data sources, its routed command, its
flags, its mutation class and its presentation rows all exist and behave as the workflow assumes, and the
check still works: it was observed firing on real three-way disagreement, not only on a clean checkout.

### Evidence

| # | Claim | Evidence |
|---|---|---|
| 1 | Every asset the workflow names exists | `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (118 lines, 5747 bytes), `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (18421 bytes), `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` (286720 bytes), and the `.skilled/skills/*/graph-metadata.json` glob resolving to exactly 14 files — log §1a, §10 |
| 2 | The route entry, the router table and every presentation display agree about this target | `route-validate.sh` → exit 0, `B1: .routes has 10 entries`, `D1: all route YAML assets exist`, `I1: all route script_invocations resolve to existing local scripts`, `J1: _routes.yaml routes, speckit.md table, and all 3 presentation displays are in parity`, `K1/K2: no read-only route declares a write or grants a mutating advisor command` — log §5 |
| 3 | The routed command runs as written and exits 0 | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` → the panel, `exit=0`, twice, identical output — log §2c, §2d |
| 4 | The panel's verdict is not an artifact of its own implementation | An independently written 3-way comparison over the same three sources produced the same result: `ZOMBIE none`, `MISSING none`, `GHOST none`, both family comparisons `none`, both key sets identical, `compiled=sqlite=disk=14` — log §7 |
| 5 | Detection still fires | With the database source pointed at another checkout's 15-node database, the panel reported `ZOMBIE: cli-jev, sk-communication` and `MISSING: cli-classifier`; against a 17-node database, four zombies — log §3b, §3c. `SYSTEM_SKILL_ADVISOR_DB_DIR` (`skill-graph-freshness.cjs:47`) is the script's own single source override, and it stayed read-only on those foreign databases (`{ readOnly: true }` at `:52`) |
| 6 | Degradation is graceful rather than a crash | With an absent database directory the panel printed `SQLite skill-graph.sqlite : absent`, dropped the three SQLite-derived sets, kept the compiled-vs-disk sets, and exited 0 — log §3d, `skill-graph-freshness.cjs:98-110` |
| 7 | The read-only claim is true in fact, not only in prose | Compiled json shasum (`68a974e7…`), sqlite shasum (`ca53cd29…`, mtime `1790964469`, size `286720`) and all 14 disk mtimes/sizes identical at baseline (§2a) and after the last run (§11); no tracked file modified — §2f covering the first three runs, §2g and §11 the rest. The workflow's own boundary declares `read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]` (`doctor-skill-graph-freshness.yaml:64-69`) |
| 8 | `allowed_flags: []` is honest | `grep -c process.argv skill-graph-freshness.cjs` → `0`; passing `--json` produced byte-identical output — log §2e, §6a |
| 9 | `mcp_tools: []` is honest | The script's whole import surface is `fs`, `path`, `node:sqlite` — log §6a |
| 10 | `node:sqlite` still exists and reads the live database | `node -e "require('node:sqlite')"` → `node:sqlite OK` on v26.8.2; the panel printed `SQLite skill-graph.sqlite : 14 nodes`, which is the success branch, not the `unreadable` catch at `:57-58` — log §6a, §2c |
| 11 | The three representations are still the three that matter | The running advisor daemon in this worktree holds the exact sqlite open (fd `13u`) and the exact compiled json open (fd `231r`) — `lsof -p 54440`, log §4. The compiled json's producer is the Python compiler the YAML names: `skill_graph_compiler.py:33` `DEFAULT_OUTPUT = os.path.join(SCRIPT_DIR, "skill-graph.json")` |
| 12 | The data shapes the script assumes all still hold | `families` as `{family: [ids]}` and `generated_at` in the compiled json (`:38-42`); `skill_nodes(id, family)` in SQLite (`:54`); `skill_id`, `family` and `derived.last_updated_at` in every disk file (`:75-77`) — log §2a, §8 |

### Why not `fix`

One named thing does not resolve: `contract: "local command design contract"` (`doctor-skill-graph-freshness.yaml:42`).
No file in the repository carries that title, and no consumer reads the key — the router resolves `yaml`,
`setup_vars`, `allowed_flags`, `mutating`, `mcp_tools` and script invocations (`speckit.md:64,67`), and
`route-validate.py` has no assertion for it. Eight of the fourteen YAML assets in
`.skilled/commands/doctor/assets/` carry the same key (log §11), so a per-target edit would leave this file
inconsistent with its siblings without removing the dangling reference anywhere. That is a family-level change,
not a correction to this doctor, and it does not justify `fix` here.

Two prose imprecisions also exist and are cosmetic:

- `doctor-skill-graph-freshness.yaml:87` says the report shows "source sizes"; the panel shows counts (`14 skills`, `14 nodes`) — log §2c.
- `.skilled/commands/doctor/_routes.yaml:152` advertises the phrase "reindex staleness check" while the five
  sets computed at `skill-graph-freshness.cjs:99-111` are membership-and-family sets plus a null-stamp check.
  A phrase-set change would be a wording edit with routing consequences, not a repair. See FINDING 1 for what the
  phrase can hide.

### Why not `retire`

Nothing has been superseded. No other doctor route or CLI verb covers the same ground: `advisor_status`
(the embeddings route's command, `_routes.yaml:52`) reports runtime health, and `getAdvisorFreshness`
(`runtime/lib/freshness.ts:330`) computes a workspace-level freshness verdict, but neither enumerates the
zombie / ghost / missing / family-mismatch / null-stamp sets this panel exists to name. The route is live,
cheap (exit 0 always, no writes, no daemon start) and passes validation.

### Non-blocking observations (no edit proposed)

Recorded for the family-level pass; each would be an enhancement, not a correction.

1. The script honours `SYSTEM_SKILL_ADVISOR_DB_DIR` (`skill-graph-freshness.cjs:47`), a variable the advisor
   launcher and eight runtime modules also read (log §6b, inventory in `reality-check.md` row 32), yet neither the
   route entry nor the workflow YAML mentions it. The workflow says "no arguments" (YAML `:78`) and that is exactly
   what the route runs, so nothing is broken; an operator would only learn about the override by reading the script.
2. The presentation menu (`doctor-speckit-presentation.txt:10-23`) offers rows `1,2,3,6,7,8,9,10,11,0,H,X`
   while the accepted-answer table two lines below offers `12` (`runtime-mirrors`) and `13` (`router-reach`)
   (`:39-40`), and the help block closes with "Press 1-11, 0, or X" (`:70`). Sibling targets are reachable only
   by naming them. This does not affect target `10`, which is present in both the menu and the answer table.
3. `route-validate.sh` reports `B1: .routes has 10 entries` at audit time. A concurrent audit worker is adding
   an `env` target in this same worktree (`doctor-env.yaml` untracked, `git status`), so that count will move;
   the parity assertions above were evaluated against the 10-route manifest.

---

## FINDINGS

Defects in the subsystem the doctor inspects — recorded here, deliberately not fixed.

### FINDING 1 — the compiled graph is older than one of the sources it compiles, and the panel cannot see it

The compiled artifact carries `generated_at: 2026-09-29T07:49:34.068437+00:00`
(`.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, value read in log §8).
`.skilled/skills/cli-classifier/graph-metadata.json` carries `derived.last_updated_at: 2026-09-29T09:00:00Z` —
1 h 10 min later, and that file's last commit `2026-09-30T19:50:05+02:00` is a day after the compiled json's
last commit `2026-09-29T11:53:36+02:00` (log §8). So the newest source stamp postdates the last compile.

The panel reports nothing, and not by mistake: `cli-classifier` is present in all three sources with family
`cli`, so every set at `skill-graph-freshness.cjs:99-111` is legitimately `none` (log §2c). The subsystem's own
freshness model does name stale-artifact states — `SOURCE_NEWER_THAN_SKILL_GRAPH` at
`runtime/lib/freshness.ts:281,291`, `JSON_FALLBACK_ONLY` at `:261`, `SKILL_GRAPH_SQLITE_MISSING` at `:269` —
but those compare the source snapshot against the **SQLite** artifact's mtime/signature, never against the
compiled JSON. Result: an id-invisible staleness of the compiled JSON is reported by neither layer, while the
route advertises "reindex staleness check" (`_routes.yaml:152`). The phrase and the coverage disagree.
Caveat recorded in fairness: `derived.last_updated_at` is the stamp the panel itself treats as the freshness
stamp (`skill-graph-freshness.cjs:63-64,77`), so the panel and the finding use one definition.

### FINDING 2 — the SQLite half of the three-way diff is untracked runtime state, so a fresh checkout silently becomes a two-way diff

`.skilled/skills/system-skill-advisor/runtime/database/.gitignore` ignores `*.sqlite`, and
`git ls-files --error-unmatch .../skill-graph.sqlite` fails with `pathspec ... did not match any file(s) known
to git` (log §6d). The database that made this checkout's 3-way diff complete exists only because a daemon or a
prior `/doctor:update` materialised it: `Oct  2 20:07:49 2026 (mtime epoch 1790964469)`, and the worktree itself
was created at `18:07` (log §12, §10). On a checkout without it — a fresh clone, or a worktree where the advisor
has never run — the panel prints `SQLite skill-graph.sqlite : absent`, omits the ZOMBIE / MISSING / SQLite-family
sets entirely, and still exits 0 with no degraded marker (log §3d).

The subsystem does distinguish that state: `runtime/lib/freshness.ts:257-261` returns mode `json` with
diagnostic `JSON_FALLBACK_ONLY` when only the JSON artifact exists. Nothing in the panel's read-out carries an
equivalent signal, so a summary reader cannot tell a complete three-way check from a two-way one. This is a
coverage gap in the drift signal, not drift itself.

### FINDING 3 — the disk scan's `z_archive` exclusion is inert, and depth-1 coverage is currently complete

`skill-graph-freshness.cjs:62-64` excludes a nested `z_archive/` tier. No such directory exists anywhere under
`.skilled/skills` (0 archive directories against 14 skill directories, log §10), so the exclusion does nothing
today. Meanwhile 20 `graph-metadata.json` files exist under `.skilled/skills`, of which 14 are the depth-1 skill
roots and 6 are system-spec-kit CLI test fixtures at depths 7 and 9 (log §8, §10). Depth-1 is therefore the
correct rule for this checkout and loses no real skill — recorded because the rule's safety depends on that
distribution staying true.

### FINDING 4 — family names and skill ids share one namespace

The compiled graph's families are `cli [3]`, `deep-loop [1]`, `mcp [2]`, `sk-code [1]`, `sk-util [5]`,
`system [2]` (log §12), and `.skilled/skills/sk-code/graph-metadata.json` carries `family: "sk-code"` — so
`sk-code` is simultaneously a family name and the sole skill id inside it. A genuine family-mismatch line for that
skill would read `sk-code (disk:sk-code compiled:sk-util)`, which is ambiguous to a reader and to any text
processing that treats the two namespaces alike. Low severity, purely a naming collision.

---

## Method and limits

- Read-only throughout. The workflow names exactly one script and runs it with no arguments, so that is what was
  run (`doctor-skill-graph-freshness.yaml:78`, `_routes.yaml:147`). Nothing was rebuilt, rewritten, installed or
  deleted. The workflow declares no report or state file (`:64-69`), so the scratch-redirection instruction had
  nothing to redirect; the only files written are the three in this packet's `scratch/`.
- The one extra intervention was the script's own environment override, used to model source disagreement with
  real databases from sibling checkouts instead of writing fixtures (log §3). It is read-only on both sides, and
  the foreign databases' hashes and mtimes confirm it (log §3e).
- Not exercised, therefore inference rather than observation: the **family-mismatch** sets and the
  **null-stamp** set never fired. No pair of available sources disagrees on a family, and every disk file carries
  `derived.last_updated_at`. Those code paths were read (`skill-graph-freshness.cjs:101-109,111`), not run.
  Building fixtures to force them was rejected because this audit may write only the three named files.
- Not exercised: `node:sqlite` against a corrupt database (the `unreadable` catch at `:57-58`). Doing so required
  writing a file outside the permitted three.
- The panel's clean report is a statement about the three sources' identity sets and families at `83616db9ba`,
  and it is corroborated by an independent implementation (log §7). It is not a statement that
  `/doctor:update` has been run in this worktree, and it says nothing about the age of the compiled artifact —
  see FINDING 1.
