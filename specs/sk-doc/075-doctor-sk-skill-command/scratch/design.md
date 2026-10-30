# /doctor:skill: convert a user skill to the Skilled format and wire it in

Read-only design. Nothing in the repository was edited. Path keys used below:
`SCS` = `.skilled/skills/sk-doc/sk-create-skill`, `DOC` = `.skilled/commands/doctor`,
`SSA` = `.skilled/skills/system-skill-advisor`, `RES` = `.skilled/skills/sk-code/sk-code-skilled/assets/scripts`.

## 0. Recommendation

> **Naming amendment (operator, 2026-10-30):** the command is `/doctor:sk-skill`, matching `/doctor:sk-code`.
> Every `skill`-prefixed command artifact below takes the `sk-skill` prefix instead: router `DOC/sk-skill.md`,
> assets `doctor-sk-skill-*`, scripts `sk-skill-check.cjs` and `sk-skill-convert.cjs`, libraries
> `lib/sk-skill-surface.cjs` and `lib/sk-skill-convert-transforms.cjs`, tests `sk-skill-*.test.cjs` and
> `doctor-sk-skill-contract.test.cjs`, and command mirrors `doctor-sk-skill.md`.
>
> **Authoring amendment (operator, 2026-10-30):** the command router, presentation file, workflow YAMLs and
> `families.doctor` contract entry are authored through sk-doc's sk-create-command mode (`/create:command`),
> from its router, presentation and command templates, and the contract entry validates against
> `command-contract.schema.json`.

Build one new doctor command, `/doctor:skill`, with two targets: `check` (default, read-only) and
`convert` (plan, then write after yes). Version 1 converts inputs (a) plain agent skills and (b) older
Skilled skills into a class S standalone root. It refuses hubs and refuses mode-into-hub work (c),
which it reports on but never writes. Two thin Node scripts orchestrate the existing validators,
generators, resolver and router parser. The only genuinely new logic is the text transforms
(frontmatter fill, router section move, link line, resource-doc frontmatter), a content-preservation
check, and the integration writes no script owns today (changelog link, intent-signal proposal).

## 1. Command name and targets

| Item | Decision | Why |
|---|---|---|
| Command | `/doctor:skill`, router `DOC/skill.md` | Doctor is the family whose contract is "read by default, write only after a printed plan and a yes" (`DOC/ci.md:38`, `DOC/_routes.yaml:370-384`), which is the operator's requirement verbatim. |
| `check [<name-or-path>] [--json]` | Route with `default_target: true`, `mutating: read-only` | A bare command must land on a read-only target (`DOC/_routes.yaml:36-40`); with no argument it prints a one-row-per-root fleet table, with an argument the deep report in section 2.1. |
| `convert <name-or-path> [--dry-run]` | Route with `mutating: mutates` | Writes the skill folder and its surfaces, after the plan and an explicit yes, modelled on `doctor-ci-scaffold.yaml` (`DOC/assets/doctor-ci-scaffold.yaml:25-36, 86-98`). |

Why not extend `/doctor:skill-advisor`: its input gate demands a bound target and forbids inferring one
(`DOC/skill-advisor.md:12-20`), and every one of its mutating routes writes advisor state, the scorer lanes
or `skill-graph.sqlite` (`DOC/_routes.yaml:98, 122`). Conversion writes a skill package, runtime copies and a
changelog link, a different mutation class and location; folding it in would make the advisor command own
skill authoring. Convert still calls the advisor CLI that command declares.

Why not extend `/create:skill`: it is a template-first authoring command with `:auto`/`:confirm` modes
(`.skilled/commands/create/skill.md:2-3`), its scaffolder refuses an existing folder
(`SCS/scripts/init_skill.py:327-329`), and the canon itself says there is no convert-in-place path
(`SCS/references/skill/upgrading-a-skill-to-v4.md:79, 95`). Neither create command touches mirrors, the
changelog index or the compiled skill graph. Convert reuses create's scripts, not its command.

### Which inputs version 1 handles

| Input | v1 | Reason |
|---|---|---|
| (b) older Skilled skill, router still in SKILL.md | Yes, first | Mechanical and provable. The fleet migration moved each final `MACHINE ROUTER` section verbatim into `ROUTER.md` under `## 3. MACHINE ROUTER` and added one link line (commit `ca10a236d2` message). I replayed it: the pre-migration `sk-git` copy resolves `skill-md`, fails `--strict` on exactly RS-002, RS-004, RS-005, and `parseRouter` returns identical intents, map and default before and after (section 7). |
| (a) plain agent skill | Yes, second | Most common adopter input, and class S needs only two authored files beyond `SKILL.md`: `graph-metadata.json` and `leaf-manifest.config.json` (`SCS/references/shared/skill-root-metadata-contract.md:167-169`). The section reshaping is authored prose, so it runs as an agent step bounded by a preservation check. |
| (c) mode under an existing hub | Report only | A mode lands on 11 surfaces and five of them (rows 4, 5, 6, 8, 10) have no gate, so "a hub can pass every check with a mode that no request can reach" (`SCS/references/parent-skill/parent-skills-nested-packets.md:245-264`). It also changes how the hub routes, which the constraint forbids. Phase 8 adds a read-only gap report. |
| Hub candidate (two or more jobs) | Refuse, point to `/create:skill-parent` | The canon's decision rule is "count distinct jobs" (`upgrading-a-skill-to-v4.md:52-60`), a judgment no script makes; the hub path is `/create:skill-parent` (`:95-140`). |

## 2. What `check` reports and what `convert` writes

### 2.1 `check` (read-only, writes nothing, exit 0 clean, 1 findings, 2 cannot run)

| # | Row | Existing code it calls | New code |
|---|---|---|---|
| C1 | Location: under `<repo>/.skilled/skills/<name>`, outside it, or nested in a hub | none | path test; the advisor only reads direct children of `.skilled/skills` holding `graph-metadata.json` (`SSA/runtime/lib/scorer/projection.ts:1536-1556`) |
| C2 | Input kind: plain, older Skilled, canon, dual declaration, hub | `resolveMachineRouter` verdicts `router-md`, `skill-md`, `dual-declaration`, `none` (`RES/router-file-resolver.cjs:116-131`); class from the gate's JSON `byClass` (`SCS/scripts/ci-skill-root-metadata.cjs:903-916`) | classifier glue; "plain" = no `allowed-tools`/`version` and resolver `none` |
| C3 | Format verdict and RS codes | `python3 SCS/scripts/package_skill.py <dir> --json --strict` (`package_skill.py:1696-1714`, strict markers `:238-251`, RS codes `:1018-1180`) | JSON parse only |
| C4 | Root metadata class contract, incl. ROUTER.md contract (RRC codes) and intent floor of 8 | `ci-skill-root-metadata.cjs --skills-dir <parent> --skill <name> --format json` (`:114-137, 876-899`, floor `:605-611`) | none |
| C5 | Slug-only routing defaults | none | compare `intent_signals` with the scaffold defaults `init_skill.py:381-390`; the canon forbids shipping them (`SCS/SKILL.md:89`) |
| C6 | Derived block freshness | `regenerate-skill-derived.cjs --root <dir>` (dry run by default, `:19-21`) | none |
| C7 | Router equivalence available | `parseRouter(null, dir)` (`RES/router-replay-lib.cjs:404-430, 856`) | report intents/map counts |
| C8 | Advisor home | `skill_graph_compiler.py --validate-only` (CI step, `.github/workflows/routing-registry-drift.yml:225`), `skill-graph-freshness.cjs --strict` (`DOC/scripts/skill-graph-freshness.cjs:7-19`), `advisor_recommend ... --warm-only` on up to three intent signals (`SCS/SKILL.md:90-94`; exit 75 = backend unavailable, `DOC/_routes.yaml:110`) | UNKNOWN when warm-only gets 75, never a pass |
| C9 | Runtime mirrors | `sync-skills-hermes.cjs --check`; `.claude/skills`, `.opencode/skills`, `.pi/skills`, `.devin/skills` are whole-dir links to `../.skilled/skills` (observed `ls -la`) | per-runtime row; `.codex` and `.cursor` print n/a (`.codex/SYNC.md:35`, `.cursor/SYNC.md:39`) |
| C10 | Changelog | none | real `changelog/` dir with a `v<version>.md`, and a resolving `.skilled/changelog/<name>` link |
| C11 | Description budget | `audit_descriptions.py --repo-root . --json` (`DOC/scripts/audit_descriptions.py:11-15, 198-208`) | pick this skill's row |
| C12 | Collisions | none | see section 4 R1 |
| C13 | Regression coverage | none | count rows naming the skill in `SSA/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl` and `gate2-golden-prompts.jsonl` (report only) |

Preconditions reported as exit 2: the root-router contract needs the built shared parser and exits on
`SHARED_NOT_BUILT` (`ci-skill-root-metadata.cjs:57-68`); Hermes sync needs `@spec-kit/shared`
(`sync-skills-hermes.cjs:18`); the resolver lives in a sk-code surface packet (decision D3).

### 2.2 `convert` (default prints the plan; `--apply` writes; the YAML adds `--apply` only after yes)

Every step that edits an existing file names it in the plan as an overwrite, and the pre-edit bytes are
copied to `.skilled/skills/.state/doctor-skill/<name>/<timestamp>/` first (gitignored, `.gitignore:132`).
A file that does not exist is created with an exclusive create, never a replace, as
`sk-code-quality-config.cjs` does (`DOC/scripts/sk-code-quality-config.cjs:21-22, 85`).

| Step | What it does | Existing code | Gap (new code) |
|---|---|---|---|
| V0 preflight | Run `check`; refuse dual declaration, any hub declaration, a half hub declaration (`skill-root-metadata-contract.md:37-46`), nested `SKILL.md` packets, `local-` names, collisions | `skill-check.cjs` | refusal table |
| V1 stage | Source outside `.skilled/skills`: copy (never move) to `.skilled/skills/<frontmatter-name>/`; refuse if that folder exists | none | copy with exclusive create |
| V2 frontmatter | Add four-part `version` (keep an existing one, else `1.0.0.0`); normalize `allowed-tools` to a YAML array; keep `name` and `description` bytes | none | YAML-safe edit; `name` must equal folder (`package_skill.py:1364`), so stage under the frontmatter name rather than renaming it |
| V3 router (b) | Move the trailing `## N. MACHINE ROUTER` section, and any machine block left inside SMART ROUTING (RS-002 causes, `package_skill.py:1157-1175`), verbatim into a new `ROUTER.md` built from `skill-router-template.md` frontmatter and heading, under `## 3. MACHINE ROUTER`; append the link line to SMART ROUTING | section text from `resolveMachineRouter(...).text` (`router-file-resolver.cjs:88-94`), template `SCS/assets/skill/skill-router-template.md:1-47` | the move; proof `parseRouter` before (staged snapshot) deep-equals after, else roll back the step |
| V3 router (a) | Render `ROUTER.md` with one intent whose keywords are the approved phrases (V6) and whose `RESOURCE_MAP` lists the `references/` docs the body already links, in body order | template `:58-64`; `init_skill.py:87-105` renders it | link harvest; the plan shows the map for approval |
| V4 sections (agent step) | Shape SKILL.md into WHEN TO USE, SMART ROUTING (at most 12 lines and 180 words, `SCS/assets/skill/skill-md-template.md:514-535`), HOW IT WORKS, RULES with ALWAYS/NEVER/ESCALATE IF, REFERENCES (`package_skill.py:67-73`) | the agent follows `SCS/SKILL.md:81-87`, loaded, not restated | `skill-convert.cjs preserve --snapshot <dir>`: every non-blank, non-heading body line of the original appears in the new SKILL.md, ROUTER.md or a `references/` file; a lost line fails the step |
| V5 resource docs | Add the five-field frontmatter plus `version` to `references/` and `assets/` markdown (strict-promoted, `package_skill.py:242-245`); rename non-kebab paths and rewrite their links | none | frontmatter insert; rename plus link rewrite, shown file by file |
| V6 metadata | Run `init_skill.py <name> --path <tmp>` and copy only absent files (`graph-metadata.json`, `leaf-manifest.config.json`, `manual-testing-playbook/`, `benchmark/`); replace the slug defaults with the approved phrases | `init_skill.py:310-466` | phrase proposal from description, keyword comment and old `INTENT_SIGNALS`, at least 8 (`ci-skill-root-metadata.cjs:605-611`) |
| V7 generated files | `ci-skill-root-metadata.cjs --fix --skills-dir .skilled/skills --skill <name>`, then `regenerate-skill-derived.cjs --root <dir> --write` | exactly as `init_skill.py:276-307` scopes it | none |
| V8 format gate | `package_skill.py <dir> --check --strict`, then `validate_skill_package.py <dir>` (`SCS/SKILL.md:95`) | both | stop on fail, no integration |
| V9 integration | Section 3 rows I1-I6, each its own plan line | listed there | listed there |
| V10 verify and undo | Rerun `check`; print every created path, every overwritten path with its backup, and the undo commands | `skill-check.cjs` | undo list |

New scripts (doctor scripts are named per target, like `ci-report.cjs`/`ci-scaffold.cjs`):

- `DOC/scripts/skill-check.cjs`: `check [<name-or-path>] [--json]`.
- `DOC/scripts/skill-convert.cjs`: `plan|apply|preserve`, `--apply` gate like `sk-code-quality-config.cjs`.
- `DOC/scripts/lib/skill-surface.cjs`: shared probes (locate, classify, collisions, spawn wrappers).
- `DOC/scripts/lib/skill-convert-transforms.cjs`: pure text transforms, unit-tested without a repo.

## 3. Integration surfaces (the real mechanism for each)

| # | Surface | Mechanism found | Convert does |
|---|---|---|---|
| I1 | Advisor discovery | Direct children of `.skilled/skills` with `graph-metadata.json` (`projection.ts:1536-1556`); the daemon watcher adds new top-level dirs at depth 0 (`SSA/runtime/lib/daemon/watcher.ts:153, 463, 656`) | `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` (`SCS/SKILL.md:93`); print `/doctor:skill-advisor rebuild` as the fallback, never run it unasked |
| I2 | Compiled skill graph | Tracked `SSA/runtime/scripts/skill-graph.json`, gated by `skill-graph-freshness.cjs --strict` in CI (`routing-registry-drift.yml:241-246`); regenerate command `skill_graph_compiler.py --export-json` (`skill-graph-freshness.cjs:195`) | run it, named in the plan as a tracked-file write |
| I3 | Router reach and budget | Reach probes hubs only (`SCS/scripts/ci-router-vocabulary-reach.cjs:107-114`); budget audit walks every root (`audit_descriptions.py:198-208`) | `advisor_recommend --warm-only` on three approved phrases, report rank; budget row. Phase 5 adds an opt-in `--skill <id>` to the reach script for a standalone root, default fleet output unchanged |
| I4 | Regression corpus | `skill_advisor_regression.py --dataset <jsonl>` (`SSA/runtime/scripts/skill_advisor_regression.py:8`); corpora in `SSA/runtime/scripts/fixtures/` | print proposed case rows; write only per decision D2 |
| I5 | Runtime mirrors | Claude, OpenCode, Pi, Devin: whole-dir links, nothing to write. Hermes: generated copies by frontmatter name (`sync-skills-hermes.cjs:150-152`), CI-checked (`.github/workflows/command-tree-parity.yml:121`) but absent from `/doctor:runtime-mirrors` (`DOC/_routes.yaml:216-224`). Codex, Cursor: no skills dir | `sync-skills-hermes.cjs` then `--check`; skip when `.hermes/` is absent (D4) |
| I6 | Changelog index | Standalone: `.skilled/changelog/<skill> -> ../skills/<skill>/changelog`; hub: `.skilled/changelog/<hub>/parent` plus one link per packet with a leading `sk-` dropped (observed `ls -la .skilled/changelog`). Inside the skill the folder must be real files (`parent-skills-nested-packets.md:298-303`). No script writes these links (search found none) | create `changelog/v<version>.md` when absent and the relative link; `create-changelog` then writes through it (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:24`) |

Surfaces the new command itself must land on (all in this repository, phases 2 and 6):

- Doctor plumbing: `DOC/_routes.yaml` (two routes, per its header steps `:44-48`), `DOC/skill.md`,
  `DOC/assets/doctor-skill-presentation.txt`, `DOC/assets/doctor-skill-check.yaml`,
  `DOC/assets/doctor-skill-convert.yaml`. `route-validate.py` enforces asset existence, mutation class,
  target parity with the router table and presentation menu, read-only policy and that every
  `script_invocations` script is invoked by the YAML (`DOC/scripts/route-validate.py:12-33`).
- Command contract: `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` `families.doctor`
  (`:194`): `router_path`, `input.argument_hint`, `execution_targets`, `loader_requirements`; read by
  `DOC/scripts/tests/doctor-update-contract.test.cjs:42-46`.
- Advisor bridge: `SSA/runtime/scripts/command-bridges/scoring-compatibility.json` (both lists), rerun
  `derive-command-bridges.cjs`, then `doctor-phrase-reach.cjs` (`DOC/_routes.yaml:47-48`).
- Setup list: `DOC/assets/doctor-setup-presentation.txt:19-37` (two rows).
- Command mirrors: `.claude/commands/doctor/skill.md` (link), `.cursor/commands/doctor-skill.md`,
  `.codex/prompts/doctor-skill.md`, `.pi/prompts/doctor-skill.md`, `.hermes/prompts/doctor-skill.md`, by the
  sync scripts, never by hand (`parent-skills-nested-packets.md:257-262`; the `/doctor:ci` addition touched the
  same set, commit `10c6791341`).
- Tests: `DOC/scripts/tests/skill-check.test.cjs`, `skill-convert.test.cjs`, `doctor-skill-contract.test.cjs`
  (picked up by the node glob in `DOC/scripts/tests/run-all.sh:87`).
- Docs: `README.md:213` (doctor list) and the Doctor section near `:1247-1257`;
  `.skilled/commands/README.txt:133-140`; `DOC/scripts/README.markdown`; `SCS/SKILL.md` section 6;
  `SCS/references/skill/upgrading-a-skill-to-v4.md` sections 1 and 5; `SCS/manual-testing-playbook/standalone-skill/`
  (new scenarios); `.skilled/skills/sk-doc/feature-catalog/` (one entry); the sk-create-skill changelog.
  Adding sk-doc docs changes the sk-doc leaf manifest, so `ci-skill-root-metadata.cjs --fix --skill sk-doc`
  follows, and the compiled-routing activation manifests may need a refresh (inferred from commit
  `10c6791341` touching `.skilled/bin/lib/compiled-routing/.../sk-doc/manifest.json`; confirm in phase 7).

## 4. Risks and edge cases

| # | Case | Handling |
|---|---|---|
| R1 | Name collisions | Refuse when `.skilled/skills/<name>` exists and is not the source. Refuse a frontmatter name equal to any other `SKILL.md` name in the tree, because Hermes flattens every SKILL.md by name and throws on a duplicate (`sync-skills-hermes.cjs:224-226`). Refuse an `agent-` prefix, which collides with the Hermes persona mirrors (`:239-244`). Refuse a `local-` prefix: every gate skips those roots (`ci-skill-root-metadata.cjs:169`, `regenerate-skill-derived.cjs:226, 270`, `audit_descriptions.py:205-208`, `sync-skills-hermes.cjs:59`), so a converted `local-` skill would pass by being invisible. Warn on a name a future release might ship, since `/doctor:update` tracks `skill` units (`DOC/scripts/release-update.cjs:30`; inferred, not traced further). |
| R2 | Skill already has `ROUTER.md` | Verdict `router-md`: skip V3. Verdict `dual-declaration`: refuse, since two maps disagreeing is a fault to report (`router-file-resolver.cjs:100-110, 128`). `ROUTER.md` present but declaring nothing while SKILL.md declares: refuse and print both; never overwrite. |
| R3 | Hub candidate | Nested `SKILL.md` packets, a `mode-registry.json` or `hub-router.json`: refuse. Otherwise the plan asks the one-job question from `upgrading-a-skill-to-v4.md:52-60` once; "several" stops with the `/create:skill-parent` command line. |
| R4 | Missing `graph-metadata.json` | V6 creates it from the `init_skill.py` shape. Slug-only defaults are never shipped (`SCS/SKILL.md:89`); with fewer than 8 approved phrases the plan stops (`INTENT_SIGNALS_BELOW_FLOOR`). |
| R5 | Skill outside `.skilled/skills` | Convert copies, never moves. The advisor cannot see it in place (I1); the routing-shape debt ledger only keys paths under the skills root (`skill-md-template.md:541-546`); `key_files` paths are repo-relative to `.skilled/skills/<name>` (`init_skill.py:394-400`). `check` on an outside path still runs C3 and C4 via `--skills-dir <its parent>`. |
| R6 | Description over 130 characters | `--strict` promotes "exceeds soft target" for a standalone (`package_skill.py:239, 1504-1511`), but the description is what native runtimes route on. Decision D1. |
| R7 | Kebab renames break references | V5 rewrites links it can parse; the plan lists every rename; V8 reruns the strict check, which catches a dangling path. |
| R8 | Routing drift during conversion | V3 proves map equality; V4 preserves content; V6 only adds the advisor home. Any parsed-router difference rolls the step back. |
| R9 | Adopter repo lacks a piece | No runtime dir: n/a row. No built shared parser or no resolver: exit 2 with the provision command, never a pass. |
| R10 | Private names in tracked files | Fixtures use invented names; tests assert no `local-` path appears in any tracked output. |

## 5. Phased plan

Baseline first (phase 1): record `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs`
results for every shipped root, so later phases report a delta, not a claim.

| Phase | Scope | Depends on | Closes on (tests and observable checks) |
|---|---|---|---|
| 1. Check engine | `skill-check.cjs`, `lib/skill-surface.cjs`, rows C1-C13, JSON and text | none | `node --test DOC/scripts/tests/skill-check.test.cjs` with fixtures: plain, pre-migration (trailing `MACHINE ROUTER`), canon, dual declaration, outside root, `local-` name, nested packets. Every shipped root reports the same verdict as the baseline. |
| 2. Check plumbing | `skill.md`, presentation, `doctor-skill-check.yaml`, route in `_routes.yaml`, contract JSON, setup row, command mirrors via sync scripts, `doctor-skill-contract.test.cjs` | 1 | `bash DOC/scripts/route-validate.sh` exit 0; `bash DOC/scripts/tests/run-all.sh` all PASS; `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `command-catalog-mirror-check.cjs` pass. |
| 3. Convert core for (b) | `skill-convert.cjs plan/apply`, transforms V2 and V3(b), backups, exclusive create, `parseRouter` proof | 1 | Golden test: converting a fixture copy of a pre-migration framework skill yields a `ROUTER.md` whose machine section is byte-equal to the post-migration file, `parseRouter` equal, strict PASS; a second `apply` is a no-op; an existing target file is never replaced. |
| 4. Convert for (a) | V1, V3(a), V4 preservation check, V5, V6, V7, V8 | 3 | Plain fixture ends `package_skill.py --check --strict` PASS, `ci-skill-root-metadata.cjs --skill <fixture>` exit 0, preservation check passes; a fixture with a dropped line fails it. |
| 5. Integration | I1-I6, opt-in `--skill` on the reach script | 4 | In a temp repo (Hermes honours `HERMES_SKILLS_OUTPUT_DIR`, `sync-skills-hermes.cjs:19-20`; freshness honours `SKILL_GRAPH_FRESHNESS_ROOT`): `sync-skills-hermes.cjs --check` PASS, `skill-graph-freshness.cjs --strict` exit 0, changelog link resolves; reach script output for the fleet is byte-identical with and without the change. |
| 6. Convert plumbing | `doctor-skill-convert.yaml` (read, refuse, plan, yes, write, re-read, undo), presentation states, bridge activation, contract test of refusal strings | 3, 5 | route-validate and run-all PASS; `derive-command-bridges.cjs` then `doctor-phrase-reach.cjs` reach `/doctor:skill`; a manual run on a scratch skill shows plan, then `CANCELLED` on "no", then `OK` on yes. |
| 7. Docs | Section 3 doc list; sk-doc leaf manifest regenerated | 2, 6 | `check_readme_references.py`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `generate-router-intent-signals.cjs --check` all exit 0. |
| 8. Hub gap report (optional) | `check --into-hub <hub>`: the 11-row table of `parent-skills-nested-packets.md:245-256`, rows filled from `parent-skill-check.cjs`, `compiled-route.cjs --hub`, `skill_advisor.py` (`:268-281`); writes nothing | 2 | Run against a shipped hub reports every row present; a fixture hub missing `routerSignals` for a mode reports row 2. |

## 6. Open decisions (with my recommended answer)

| # | Decision | Recommendation |
|---|---|---|
| D1 | A description over 130 characters fails `--strict` but drives native routing | Plan proposes a trim as a separately named routing change with its own yes; without it convert stops before V8. Never trim silently. |
| D2 | Where an adopter skill's advisor cases live | Framework skills in this repository: append to `SSA/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl`. Adopter skills: write nothing into that framework fixture (a later `/doctor:update` would see a customized unit) and print the rows plus the `--dataset` command. A sanctioned skill-local home is a follow-up, since `.jsonl` is not a valid asset type (`package_skill.py:98`). |
| D3 | The resolver and router parser live in sk-code's `sk-code-skilled` surface, which an adopter may drop (`upgrading-a-skill-to-v4.md:74-79`) | Use them in place and exit 2 with a named cause when absent. Moving them to `sk-doc/shared` is a separate change. |
| D4 | Hermes or another runtime absent | Skip with n/a when the runtime dir is absent; never create it. |
| D5 | `skill_graph_scan --trusted` versus `advisor_rebuild` | Scan, as the canon's step 28 does; print the rebuild route as fallback. |
| D6 | Who writes the reshaped SKILL.md prose | The convert workflow's agent step, bounded by the preservation check, rather than a hand-off to `/create:skill full-update`, so one command ends integrated. |
| D7 | `allowed-tools` for a plain skill that has none | No default. The plan proposes `[Read, Grep, Glob]`, plus `Bash` when `scripts/` exists, and the operator confirms, because it is a permission grant. |
| D8 | `/doctor:runtime-mirrors` lacks the Hermes skills check | Out of scope here; `check` calls it directly. Proposed amendment: add `sync-skills-hermes.cjs --check` to that route's `script_invocations` and YAML. |
| D9 | Template drift | `skill-leaf-manifest-config-template.json` still says "in-SKILL.md router". Proposed one-line fix: "the router in the sibling ROUTER.md". Not part of this build. |

## 7. Evidence I ran (read-only)

- `resolveMachineRouter` on `sk-git`, `sk-prompt`, `system-spec-kit`: `router-md`; on `sk-doc`: `none` (hub stage-two
  map, as `router-file-resolver.cjs:106-109` says).
- `package_skill.py .skilled/skills/sk-git --check --strict`: `Result: PASS`, exit 0.
  `ci-skill-root-metadata.cjs --skill sk-git`: `OK [S] sk-git`, `checked=1 passed=1 failed=0`.
- A scratch copy of `sk-git` at `ca10a236d2^`: resolver `skill-md`; `package_skill.py --json --strict` `valid: false`,
  "3 contract requirement(s) unmet": RS-002 (section at line 459), RS-004, RS-005.
- `parseRouter` on that copy (source `inline`, 5 intents) versus the current tree (source `ROUTER.md`, 5 intents):
  intents, resource map and default resource equal. The scratch copy was deleted afterwards.
