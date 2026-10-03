# Proposal: `/doctor:speckit skill-advisor`

## VERDICT: **fix**

The target is alive and worth keeping. Its subject — the skill advisor's scoring lanes — exists exactly where
the workflow says it does: `explicit.ts` with `TOKEN_BOOSTS`/`PHRASE_BOOSTS`, `lexical.ts` with
`CATEGORY_HINTS`, `weights-config.ts` as a read-only weights surface, 14 per-skill `graph-metadata.json`
files with `derived.trigger_phrases`/`derived.key_topics`, and a five-lane registry whose ids and weights match
the workflow's invariant line for line. All eight CLI tools it names exist and are reachable, the daemon is
live, the retryable exit code is real, the scoped baseline is clean, the build script it names resolves, and
the family's own manifest validator passes.

What has drifted is the *addressing*, not the subject. The workflow still talks to the advisor through the
`system_skill_advisor` MCP namespace that a later decommission removed, reads a `skills` key the status payload
has never returned, and declares five command lines that exit 64 when run verbatim. None of that requires
retiring the target: the CLI it should use is already listed in its own route entry, and the workflow's phases,
gates, rollback design and lane model survive unchanged.

### Evidence for keeping (not retiring)

| Claim | Evidence |
|---|---|
| The subject of the doctor exists | `ls .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/` → `explicit.ts, lexical.ts, graph-causal.ts, derived.ts, semantic-shadow.ts, bm25.ts`; `grep -n TOKEN_BOOSTS\|PHRASE_BOOSTS explicit.ts` → `:27`, `:109`; `lexical.ts:26` `CATEGORY_HINTS` |
| The lane model matches | `lane-registry.ts:9-13` → `explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05`; live `advisor_status` returns the same five weights |
| The evidence surface works | `advisor_status … --warm-only` → exit 0, `freshness: live`, `generation: 3`, `skillCount: 20`; `skill_graph_status … --warm-only` → exit 0, `totalSkills: 14`, `totalEdges: 57`, `dbStatus: ready`; `skill_graph_validate … --warm-only` → exit 0, `isValid: true`, `checkedNodes: 14` |
| The retryable contract is real | `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:9 … --warm-only` → exit 75, `backend unavailable`; `EXIT_RETRYABLE = 75` at `.skilled/bin/skill-advisor.cjs:30` |
| Mutating class is coherent | `mutating: mutates` (`_routes.yaml:84`) matches `mutation_boundaries.allowed_targets` and `route-validate.sh` `K1/K2`; the scoped pre-write baseline (`git status --porcelain -- <targets>`) is empty |
| The manifest is internally consistent | `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `J1` parity PASS |

### Evidence for fixing (drift, in three groups)

1. **Removed transport.** No MCP config in this checkout registers the advisor server: `grep -n system-skill-advisor .utcp_config.json` → nothing; `opencode.json`, `.claude/mcp.json` and `.pi/mcp.json` each register only `code_mode`. `.skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:45` states the CLI front door is now the only surface, and `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/` holds a transport-removal child. The workflow still calls `system_skill_advisor.skill_graph_status({})` (`:224`), `.skill_graph_validate({})` (`:324`), `advisor_rebuild({ force: true })` (`:322`) and reads `.skills` off the status payload (`:90`, `:258`, `:276`, `:285`) — a field the live payload does not have (`data keys: totalSkills, totalEdges, lastIndexedAt, families, categories, schemaVersions, staleness, validation, dbStatus`).
2. **Command-line drift.** Five of the eight `cli_commands` exit 64 verbatim: `advisor_recommend` (needs `prompt`), `advisor_validate` (needs `confirmHeavyRun`), `advisor_rebuild` and `skill_graph_scan` (need `--trusted`), `skill_graph_query` (needs `queryType`). The rollback script's bare `npm run build` (`:295`) has no manifest to resolve, since the repo root has no `package.json`.
3. **Assumption drift.** Frontmatter trigger phrases exist for 1 of 14 skills; the root has no `package.json`, `tsconfig.json` or `requirements.txt`; `boost_range: "[0.0, 1.0]"` contradicts a `PHRASE_BOOSTS` map whose amounts run from -0.6 to 1.8; gate 3 is declared against a root-relative `lib/scorer/lanes/*.ts` that does not exist; the route declares no `mcp_tools` key although the router resolves one; `{packet_scratch}` uses a different placeholder convention than its sibling workflows, and the proposal/rollback files it names are not gitignored.

---

## 1. Proposed edits

Priority: **P0** = the workflow cannot run as written without it; **P1** = it runs but reports or writes something
wrong; **P2** = clarity and consistency.

### P0 — address the advisor through its CLI

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`

**1.1 `:224`** — phase 0 graph status

- old: `"Check skill graph status: system_skill_advisor.skill_graph_status({})"`
- new: `"Check skill graph status: node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only"`

(`skill_graph_status` accepts no `workspaceRoot`; adding `--workspace-root` yields
`Invalid arguments for skill_graph_status: Unknown parameter(s): workspaceRoot`, exit 64.)

**1.2 `:322`** — phase 4 STEP 1 rebuild

- old: `Run advisor_rebuild({ force: true }) to refresh the native advisor skill graph`
- new: `Run node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --workspace-root "$PWD" --format json to refresh the native advisor skill graph`

**1.3 `:323`** — phase 4 STEP 2 status

- old: `Call skill_graph_status({}) and capture graph_scan_report`
- new: `Run node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only and capture graph_scan_report`

**1.4 `:324`** — phase 4 STEP 2.5 validation

- old: `Call skill_graph_validate({}) and capture graph_validation_report`
- new: `Run node .skilled/bin/skill-advisor.cjs skill_graph_validate --format json --warm-only and capture graph_validation_report`

**1.5 the four `.skills` reads.** The status payload has no `skills` array, so name the inventory the workflow
already builds in phase 0.

`:90`

- old: `glob match for .skilled/skills/<name>/graph-metadata.json where <name> exists in system_skill_advisor.skill_graph_status`
- new: `glob match for .skilled/skills/<name>/graph-metadata.json where <name> is a skill folder under .skilled/skills/`

`:258`

- old: `validate each name exists in system_skill_advisor.skill_graph_status({}).skills`
- new: `validate each name against the phase-0 skill inventory`

`:276`

- old: `"list of requested skill names that did not resolve to a real skill in system_skill_advisor.skill_graph_status({}).skills"`
- new: `"list of requested skill names that did not resolve to a real skill in the phase-0 inventory"`

`:285`

- old: `skill_id_check: "must exist in system_skill_advisor.skill_graph_status({}).skills"`
- new: `skill_id_check: "must exist as a skill_id in .skilled/skills/<name>/graph-metadata.json"`

### P0 — make the declared command lines runnable

File: `.skilled/commands/doctor/_routes.yaml`, route `skill-advisor` (`:80`)

| Line | old | new |
|---|---|---|
| `:87` | `advisor_recommend --format json` | `advisor_recommend --prompt "<prompt>" --format json --warm-only` |
| `:89` | `advisor_validate --format json` | `advisor_validate --confirm-heavy-run true --format json` |
| `:90` | `advisor_rebuild --format json` | `advisor_rebuild --trusted --force true --format json` |
| `:91` | `skill_graph_scan --format json` | `skill_graph_scan --trusted --format json` |
| `:93` | `skill_graph_query --format json` | `skill_graph_query --queryType <depends_on\|dependents\|enhances\|enhanced_by\|family_members\|conflicts\|transitive_path\|hub_skills\|orphans\|subgraph> --format json` |

`advisor_validate` also accepts the equivalent payload form `--json '{"confirmHeavyRun": true}'`; both resolve
`confirmHeavyRun` through the CLI's flag normalizer (`skill-advisor-cli.js:208-217`).

### P1 — the rollback script's build command

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`, `:295`

- old: `plus `npm run build`; chmod 0700`
- new: `plus `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`; chmod 0700`

The repo root has no `package.json`, so a bare `npm run build` cannot rebuild the advisor's `dist/`; the
`--prefix` form is the one the build script itself uses (`:301`).

### P1 — the boost range the proposal validator enforces

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`

`:264`

- old: `every boost amount is numeric in [0.0, 1.0]`
- new: `every token boost amount is numeric in [0.0, 1.0] and every phrase boost amount is numeric in [-1.0, 2.0]`

`:286`

- old: `boost_range: "[0.0, 1.0]"`
- new:

```yaml
      token_boost_range: "[0.0, 1.0]"
      phrase_boost_range: "[-1.0, 2.0]"
```

Reason: `TOKEN_BOOSTS` amounts run 0.25–1.0, but `PHRASE_BOOSTS` amounts run **-0.6 to 1.8** — penalties and
strong anchors are the map's existing idiom (e.g. `'/create:agent'` 1.6, `':review:confirm'` -0.6,
`'auto review release readiness'` 1.0). A strict `[0.0, 1.0]` would reject the lane's own vocabulary.

One judgment call is flagged for the operator: the observed envelope is exactly `[-0.6, 1.8]`, and
`[-1.0, 2.0]` is a deliberate envelope around it rather than a measured bound. If a tighter guard is wanted,
use `[-0.7, 1.9]`; if the intended governance is "the amounts the map already keeps", state that instead of a
range.

### P1 — phase 0 assertions that no longer hold

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`

`:223`

- old: `Read each SKILL.md frontmatter (name, description, trigger phrases)`
- new: `Read each SKILL.md frontmatter (name, description); trigger phrases live in graph-metadata.json, not frontmatter`

`:226`

- old: `Detect repo context: package.json, tsconfig.json, requirements.txt, language hints`
- new: `Detect repo context: .skilled/package.json, tsconfig.pi.json, each skill's runtime/package.json, plus language hints`

`:230` and `:231` — give the two unnamed outputs a source, because the natural-looking source is wrong:

- old: `      - skill_count: N`
  new: `      - skill_count: N   # count .skilled/skills/*/ folders; the advisor's skillCount counts graph-metadata.json files, which includes test fixtures`
- old: `      - graph_health: healthy|stale|missing`
  new: `      - graph_health: healthy|stale|missing   # from skill_graph_status.staleness: stale when changedSourceFiles or missingSourceFiles is non-zero`

This matters on the current checkout: `advisor_status` says `freshness: live` while
`skill_graph_status.staleness` says `freshSourceFiles: 0, changedSourceFiles: 14`. Reading `freshness` for
`graph_health` would report a healthy graph that is stale for every skill it tracks.

### P1 — gitignore claim and placeholder convention

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`

`:266`

- old: `(umask 077, repo-local, gitignored)`
- new: `(umask 077, written under the packet's scratch directory)`

`git check-ignore` exits 1 for a `.md` and a `.sh` under the scratch directory; only `*.log` is ignored
(`.gitignore:259`). If the workflow wants these files ignored, that is a `.gitignore` change, not a property of
the write.

`:120`, `:266`, `:277`, `:295`, `:296`, `:311` — replace `{packet_scratch}` with `<packet_scratch>`, the
placeholder spelling used by `doctor-speckit-retrieval.yaml:67` and `doctor-deep-loop.yaml:224`. Curly braces
read as runtime substitution (as with `{timestamp}` and `{rollback_script_path}`), and no resolver substitutes
`packet_scratch` in either spelling.

### P1 — route entry facts

File: `.skilled/commands/doctor/_routes.yaml`

**1.6 gate 3 location** (`:85`)

- old: `gate3_location: "lib/scorer/lanes/*.ts + .skilled/skills/*/graph-metadata.json"`
- new: `gate3_location: ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts + .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts + .skilled/skills/*/graph-metadata.json"`

`lib/` does not exist at the repo root, and the workflow's own `allowed_targets` (`:76-78`) covers only the two
author-lane files plus graph metadata — not `graph-causal.ts`, `derived.ts`, `semantic-shadow.ts` or `bm25.ts`.

**1.7 missing `mcp_tools` key.** Insert after `:85` (or immediately before `cli_commands:`):

```yaml
    mcp_tools: []   # CLI front door only: the advisor daemon is reached through node .skilled/bin/skill-advisor.cjs, not an MCP server
```

`speckit.md:64` resolves `mcp_tools` for every target, and every sibling route declares the key — either `[]`
or a list. With this route the key is absent, which is what let the workflow keep addressing a removed
transport.

### P2 — mutation-boundary clarity

File: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`, after `:78`

```yaml
    # graph_causal, derived_generated and semantic_shadow are read as context here;
    # only the two author-lane files and per-skill graph metadata are writable.
```

The invariant (`:22-28`) lists five calibration surfaces while `allowed_targets` covers two lane files, which
invites a reader to conclude the other three are in scope.

### P2 — the presentation's setup prompt for this target

File: `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`

The presentation owns "per-target setup prompts for unresolved fields" (`speckit.md:66`, `:77`), but the only
scope prompt it defines (`:123-133`) offers retrieval-graph options (`stale`, `missed`, `bloat`, `all`,
`excludes`) and carries no target label. A `/doctor:speckit skill-advisor` run without `--scope` therefore has
no matching prompt — it works today only because the workflow defaults `scope_empty` to `all` (`:62`).

**1.8** label the existing prompt so it cannot be consumed by another target: at `:123`, old
``Ask this only when `--scope` was not passed and the operation needs a scope.`` → new
``Retrieval-graph scope prompt. Ask this only when `--scope` was not passed for a retrieval-scope target and the workflow has no default for it.``

**1.9** add, after that block, a headed prompt so the target's four scope values have an owner:

````text
### Skill-Advisor Lane Scope

Ask only when `--scope` was not passed for the `skill-advisor` target and the operator wants to narrow the run. Empty defaults to `all`.

```text
   1) all       - tune explicit + derived + lexical lanes (default)
   2) explicit  - TOKEN_BOOSTS and PHRASE_BOOSTS only
   3) derived   - graph-metadata.json triggers and key topics only
   4) lexical   - CATEGORY_HINTS only
```

Accept `1-4`, or `all`, `explicit`, `derived`, `lexical`; empty defaults to `all`.
````

---

## 2. Order of application

1. **1.1–1.4** (MCP → CLI in the workflow) — without these, phase 0 and phase 4 cannot execute at all.
2. **1.5** (the `.skills` reads) — four places in the same file; do them with step 1 so the file stops
   referencing the removed namespace entirely.
3. **1.6 gate 3** and **1.7 `mcp_tools`** — manifest truth first, so a later reader sees the real write scope.
4. **P0 route `cli_commands`** — the declared surface should be runnable before anyone copies it.
5. **Rollback build command**, then **boost range**, then **phase 0 assertions**.
6. **P2 clarity edits** last; they change no behavior.

After applying, the two checks that should be rerun are:

- `bash .skilled/commands/doctor/scripts/route-validate.sh` → expect `OK: route-validate`, with the analysis
  unchanged (it validates structure, not runnability, which is why it never caught the `cli_commands` drift).
- `bash -c 'for c in advisor_status skill_graph_status skill_graph_validate; do node .skilled/bin/skill-advisor.cjs $c --format json --warm-only; echo "$c -> $?"; done'`
  → expect `0` for each, which is the three-command subset that already works.

---

## 3. FINDINGS — defects in the subsystem the doctor inspects

Recorded, not fixed. These are properties of the skill advisor itself, not of the doctor command.

### F-1 The skill graph is stale for every skill it tracks, while `advisor_status` calls it live

`skill_graph_status` reports `trackedSkills: 14, freshSourceFiles: 0, changedSourceFiles: 14, missingSourceFiles: 0`
and lists all 14 skill ids as stale. Directly confirmed at the hash level: the node row for `sk-git` stores
`content_hash e46a376b8d3245a3dcdccacb6e27f747d9437883a915264c04c3ed7798ff7552` while the file's current
`shasum -a 256` is `545b35268a1d0406285ed0f22ddcbfd5c0a427a25ef235b72d8c0dc82991b85c`. `indexed_at` is
`2026-10-02T16:24:11.3xxZ` for every node, older than the checkout's metadata files (mtime `18:07`).

`advisor_status`, the health surface the doctor probes first, returns `freshness: "live"` with
`trustState.state: "live"` for that same graph. The handler's own comment says a physical source change should
downgrade `live` to `stale`, but the comparison is mtime-based (`sourcesNewerThanArtifact`) and the database
(20:07) is newer than the sources (18:07), so the content-hash evidence never reaches the verdict. Two functions
on the same package disagree about the same artifact: `staleness` is content-hash based, `freshness` is not.

Impact: any consumer that treats `freshness: live` as "the graph matches the sources" — including this doctor's
`graph_health` output and its `cli_health` policy — will pass a graph whose every node is outdated.

### F-2 `advisor_status.skillCount` counts files, not skills

Live value: `skillCount: 20`. The checkout has 14 skill folders and 20 files named `graph-metadata.json`,
because `scanSkillMetadataFiles` walks the tree recursively and matches the filename at any depth, picking up
six `system-spec-kit` test fixtures (five under `test-fixtures/`, one under `tests/fixtures/phase-validation/`).
Source: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:208` (the walk) and
`:273`/`:332` (`skillCount: sourceScan.count`); the built copy shows the same match at
`dist/runtime/handlers/advisor-status.js:190`.

The field name is the problem: nothing in the payload says "metadata files scanned".

### F-3 Changes made outside the CLI process do not change what the advisor reports as fresh

The graph database and the health verdict use different clocks. The database carries per-node content hashes and
the daemon refreshes a generation signature; `advisor_status.freshness` reads the signature and an mtime
comparison, so a DB copied or indexed at a later wall-clock time than the source files reads as live even when
the hashes differ (see F-1). A content-hash comparison — the same one `skill_graph_status.staleness` already
performs — is the signal that would have caught it.

### F-4 `PHRASE_BOOSTS` amounts are unbounded and undeclared

The map uses `-0.6, -0.5, -0.4` as penalties and values up to `1.8` as anchors, while the sibling `TOKEN_BOOSTS`
stays inside `[0.0, 1.0]`. No constant, schema or doc in the package states the permitted range:
`grep -rn "BOOST_RANGE\|boostRange\|maxBoost\|MIN_BOOST"` over `runtime/lib/` and `runtime/schemas/` finds
nothing, and the only occurrence of a boost range anywhere in the repo is the doctor workflow's own (incorrect)
`[0.0, 1.0]`. The next consumer to read the map has to infer the contract from the data.

### F-5 The lane reference cites line ranges that have moved

`references/scoring/advisor-scorer.md:91` cites `runtime/lib/scorer/lanes/explicit.ts:8-90` for `TOKEN_BOOSTS`
and `:92-186` for `PHRASE_BOOSTS`. The maps actually occupy `:27-107` and `:109-240`. The neighbouring citation
for `lexical.ts:25-37` is accurate, so the drift is specific to the explicit-lane references.

### F-6 The mutating tools require a trust flag the docs never mention at CLI level

`advisor_rebuild` and `skill_graph_scan` — the documented repair path for a stale or missing graph — exit 64 with
`requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`. The advisor's own reference docs describe the CLI as
the only front door but do not state that these two tools are gated, so an operator following the docs reaches a
usage error at the moment they are trying to repair state. This is the subsystem-side counterpart of the route
edit above.

### F-7 Frontmatter trigger phrases exist for one skill out of fourteen

`system-skill-advisor/SKILL.md` declares `trigger_phrases` (with `keywords` and `intent_signals`) in frontmatter;
no other skill does, and `system-spec-kit/SKILL.md` mentions the string only in body text. Trigger phrases for
the rest live in `graph-metadata.json` (`derived.trigger_phrases`) and in body `Keywords:` comments. Any tool
that reads routing phrases from frontmatter — as this doctor's phase 0 assumed — sees coverage for 1 of 14
skills.
