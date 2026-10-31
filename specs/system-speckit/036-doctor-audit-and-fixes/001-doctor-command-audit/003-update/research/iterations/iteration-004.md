# Iteration 004 — Q5: Command Shapes Under the sk-create-command Contract; Install/Sync Reuse

## Focus

Q5: what each resulting command (check, apply, align) looks like under the sk-create-command contract (thin router, `-presentation.txt`, workflow YAML with approval gates, rollback, dry-run), and how it reuses the existing install and sync scripts.

Q1b sub-item: whether hub-projection regeneration belongs in the same apply transaction as the child update.

## Actions Taken

1. Read the doctor family entry in `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` (topology, mode matrix, owned assets, destructive policy, loader requirements, invocation aliases) and the governing `command-contract.schema.json`.
2. Read the current `/doctor:update` thin router (`.skilled/commands/doctor/update.md`) and the head of its workflow YAML (`.skilled/commands/doctor/assets/doctor-update.yaml`, 423 lines) to extract the family's de facto router and workflow anatomy, including mutation boundaries and safety invariants.
3. Read `.skilled/commands/doctor/_routes.yaml` (route schema + every route's mutation class and gate-3 location) and the route-add/remove instructions in its header.
4. Read `.opencode/SYNC.md` — the runtime sync manifest — to settle how `.skilled/` updates reach the runtime tree.
5. Surveyed the update-support scripts: `.skilled/bin/compiled-route-sync.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` + `check-frontmatter-versions.sh`, the `ci-*` freshness checkers, `.skilled/scripts/install-git-hooks.sh`, `.skilled/bin/check-git-hooks.sh`, `.skilled/bin/install-codex-hooks.mjs`, `.skilled/commands/doctor/scripts/route-validate.sh`.

All researched paths were read-only. No out-of-scope writes were attempted.

## Findings

### F1 — The doctor family is a `subaction-route-manifest` router; new commands are new routes, not a new topology

Evidence: `command-contract.json` `families.doctor`: `topology: subaction-route-manifest`; `router_path` is an explicit array (`.skilled/commands/doctor/speckit.md`, `mcp.md`, `update.md`, `env.md`); `mode_matrix.default_policy: confirm-only` with `supported_modes: []`; `routing_source: manifest`; `presentation.owner: presentation-asset` with no exceptions; `owned_assets` = `_routes.yaml` (route_manifest), `doctor-<entry>-presentation.txt`, per-route `doctor-<target>.yaml`, `route-validate.sh` (script). `_routes.yaml` header states the procedure verbatim: "To add a new target: append a route here, then re-run route-validate.sh" and "To remove a target: delete the route AND its corresponding assets/doctor-<target>.yaml."

Consequence for check/apply/align: each becomes (a) a thin router `.skilled/commands/doctor/<name>.md`, (b) a `_routes.yaml` entry with `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating` class and `gate3_location`, (c) `assets/doctor-<name>.yaml`, (d) `assets/doctor-<name>-presentation.txt`, and (e) a re-run of `route-validate.sh`. The `command-contract.json` doctor entry must then be extended: `router_path` array, `execution_targets`, `owned_assets`, `destructive_policy.operations`, `invocation_aliases`, and the `argument_hint` composite. Precedent for a read-only checker route already exists: the `runtime-mirrors` route is `mutating: read-only`, `gate3_location: "n/a (read-only mirror-parity diagnostic; every checker runs in its check-only form and writes nothing)"` — exactly the class `/doctor:check` belongs to.

### F2 — Thin-router anatomy is uniform in this family and must be copied exactly

Evidence: `.skilled/commands/doctor/update.md`. Frontmatter: `description`, `argument-hint`, `allowed-tools: Read, Bash, Grep, Glob`, plus a `<!-- skill_agent: system-spec-kit -->` comment. Body sections in order: (1) Router Contract — "Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command."; (2) Owned Assets table (presentation source of truth + workflow YAML); (3) Mode Routing constants (flock, snapshots, restart-required handling, state-log requirement, missing-asset stop rule, "the YAML owns workflow behavior; the presentation Markdown owns visible wording"); (4) Execution Targets — a numbered sequence: read presentation contract → parse `$ARGUMENTS` for supported flags → bind setup values → initial confirmation unless `--force` → load the YAML "only after every setup value is bound" → execute phase by phase → render through the presentation contract; (5) Presentation Boundary — enumerated content that lives only in the `.txt`; (6) Workflow Summary.

The contract schema corroborates: `presentation.owner` is canonically `presentation-asset`; `loader_requirements` for doctor include reading the presentation asset and `_routes.yaml` before dispatch, parsing the positional target before any flag, and exposing each route's mutation class and gate-3 location before acting.

### F3 — The family's workflow YAML contract (as practiced) is richer than the named schema reference

Evidence: `command-contract.json` sets `workflow_schema_ref: null` for doctor, yet `doctor-update.yaml` carries a stable, load-bearing section grammar that any new workflow must mirror:

- Header: `role`, `purpose`, `action` (single dependency/step chain).
- `operating_mode`: `workflow: sequential_orchestrator`, `compliance: MANDATORY`, `execution: interactive`, `approvals: per_phase_boundary`, `tracking: phase_by_phase`, `validation: post_run_gold_battery`, plus `state_dir` / `state_log` (currently under `.skilled/skills/system-skill-advisor/runtime/database/`).
- A named invariant block: flock-protected single instance, per-DB snapshot before mutation unless waived, restore failed plus downstream DBs on retry exhaustion, SIGINT settle window, "Every abort path … MUST `rm -f .doctor-update.flock` before exit".
- `upstream_assets`: contract + spec/decision-record/checklist pointers + `pass_policy` (`flock_required: true`, `full_snapshot_required: true`, `retry_backoff_seconds: 5`, `sigint_settle_seconds: 5`, `snapshot_retention_days: 30`).
- `user_inputs` and `field_handling` (per-flag defaults + explicit true/false policy sentences).
- `mutation_boundaries`: `allowed_targets` (absolute paths), `forbidden_targets`, and `validator: canonical_path_validator` with the rule "validate allowed_targets and forbidden_targets before snapshot, mutation, rollback, and state-log write".
- `state_log_schema`, then numbered phases with per-phase approval gates and exit taxonomy.

Approval gates, rollback and dry-run therefore have an existing, testable idiom: per-phase confirmation from the presentation contract; rollback via snapshots plus a guaranteed lock release on every abort; dry-run as an explicit flag whose policy text is enumerated in `field_handling` (e.g. `--no-snapshot`'s "rollback is unavailable" warning is the moral equivalent for degraded modes).

### F4 — Install/sync reuse: the symlink model removes the copy-sync step entirely

Evidence: `.opencode/SYNC.md` §1–§2. `.skilled/` is the source of truth; `.opencode/skills`, `commands`, `agents`, `bin`, `scripts`, `hooks`, `repo-rules` are relative per-entry symlinks onto `.skilled/`. Verbatim: "Drift is not possible for the linked entries: a symlink has no content of its own." The non-linked surfaces are narrow: `.opencode/plugins` (authored there, bound to the OpenCode SDK installed beside them), tracked `package.json` / `package-lock.json`, OpenCode-written `node_modules` / `.gitignore`, and two hand-maintained docs. §4 gives a ready-made 3-line integrity check (broken entry / off-tree target / runtime load probe).

Consequences: apply edits `.skilled/` and runtime paths resolve with no copy step; a sync phase for skill trees would be a second source of truth and is unnecessary. The reusable pieces are the §4 integrity loop as a post-apply check, and (only when the release moves the plugin SDK pin) an `npm ci` in `.opencode` — never a blanket mirror rewrite. Install scripts present in the repo are hook-scoped, not tree-sync: `.skilled/scripts/install-git-hooks.sh` with its verifier `.skilled/bin/check-git-hooks.sh`, and `.skilled/bin/install-codex-hooks.mjs` (with a source-root regression test). Reuse rule: re-run them only when the release touches hook definitions, gated by their check counterparts.

### F5 — Projection regeneration machinery exists, and every projection family is byte-drift-checked

Evidence (generator → checker pairs):

| Projection | Generator (write path) | Freshness gate |
|---|---|---|
| `leaf-manifest.json` per hub | `generate-leaf-manifest.cjs --write <skillDir>` (from `mode-registry.json` + aliases/scopes); `--check` fails on byte drift | `ci-leaf-manifest-freshness.cjs` |
| `graph-metadata.json` `derived` block | `regenerate-skill-derived.cjs --all [--write]` — dry-run by default; preserve-first (`trigger_phrases`, `key_topics`, `causal_summary`, `provenance_fingerprint`, … survive untouched); prunes dead structural path refs, gitignored paths treated valid | `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs` |
| Compiled-routing closure under `.skilled/bin/lib/compiled-routing` | `compiled-route-sync.cjs` traces the authored closure (SKILL.md, `mode-registry.json`, `hub-router.json` inputs) and promotes byte-identical copies; `--check` prints without writing, `--verify` asserts the promoted graph never reads under `specs/`; publication state in `.compiled-route-publication.json` | its own `--check` / `--verify` modes |
| Router intent signals | `generate-router-intent-signals.cjs` | `ci-router-vocabulary-reach.cjs` |
| 4-part `version` frontmatter | `frontmatter-version.mjs apply` (compute/apply/verify subcommands) | `frontmatter-version.mjs verify`, wrapper gate `check-frontmatter-versions.sh` |

### F6 — Q1b sub-item answered: hub-projection regeneration belongs in the SAME apply transaction

A child-skill update changes the file paths, routing vocabulary and versions that these projections encode, and each projection has a byte-drift checker that fails on stale state (F5). A transaction that writes skill files but leaves projections stale lands the tree failing its own gates — that is a broken transaction, not a partially useful one.

Recommended transaction order for `/doctor:apply`:

1. flock + snapshot (covers skill writes AND projection writes).
2. Write the release delta for un-customized skills.
3. Regenerate projections deterministically, dry-run first, then `--write`: `generate-leaf-manifest.cjs --write`, `regenerate-skill-derived.cjs --write`, `compiled-route-sync.cjs`, `frontmatter-version.mjs apply`.
4. Post-verification battery: every generator in `--check` mode, all `ci-*` freshness gates, `route-validate.sh` for `_routes.yaml`, and the SYNC.md §4 symlink integrity loop.
5. Rebuild the advisor skill graph (today's DB-rebuild behavior) so the graph indexes final bytes.
6. State log; release lock on every terminal path.

### F7 — Today's update cannot host the release apply without rewriting its safety contract

Evidence: `doctor-update.yaml` `mutation_boundaries.forbidden_targets` explicitly lists `.skilled/skills/**/SKILL.md`, `.skilled/skills/**/graph-metadata.json`, `.skilled/commands/doctor/*.md`, `.skilled/commands/doctor/assets/doctor_*.yaml`; `allowed_targets` are runtime DB / dist / lock / state-log paths only; the orchestrator invariant is a DB-rebuild flock chain with per-DB snapshots. So the release-aware apply must be a separate route with its own mutation boundaries and a git-based rollback discipline, and the DB rebuild should be retained — either as the standalone `/doctor:update` or as apply's final phase (F6 step 5) — because updated skill content invalidates `skill-graph.sqlite`. The house pattern of one concern per route (`runtime-mirrors`, `skill-graph-freshness`) supports separation.

### F8 — Destructive-policy and mode-matrix updates required by the contract

`command-contract.json` `destructive_policy.operations` currently says "update rebuilds spec-kit SQLite databases (snapshotted first unless --no-snapshot)". A release-aware apply adds "rewrites un-customized skill trees from a release (snapshotted first)" and align adds "writes proposal artifacts only". The family's `mode_matrix` is `confirm-only` with no mode suffixes; nothing in the schema forces `:auto`/`:confirm` here (`overrides` exists but no doctor command uses it), so the new routes stay confirm-gated per phase boundary.

## SCOPE VIOLATIONS

None. All writes were confined to this run's research directory; all researched paths were read-only.

## Questions Answered

- **Q5 (core)**: Shape is now grounded — three new routes under the existing `subaction-route-manifest` topology, each with thin router + `_routes.yaml` entry + `doctor-<name>.yaml` + `doctor-<name>-presentation.txt`, plus `route-validate.sh` and `command-contract.json` mirror updates (F1–F3, F8). Install/sync reuse is settled by the symlink model: no copy-sync step; reuse the §4 integrity loop and hook-scoped install/check pairs (F4). The post-apply verification battery is the existing `--check`/freshness suite (F5).
- **Q1b (sub-item)**: Yes — projection regeneration belongs in the same apply transaction, because each projection is byte-gated; the transaction order is specified in F6.

## Questions Remaining

- **Q1**: release detection (local tag / changelog / frontmatter version vs latest upstream) — consumed by the proposed `/doctor:check`; needs the degradation path from Q1a.
- **Q2**: customization/override detection signals (three-way merge against release base, provenance markers, hashes, git history) — next focus.
- **Q3**: alignment-proposal mechanics for customized skills; the align route shape is sketched (proposals only, hand application to apply) but merge machinery is ungrounded.
- **Q4**: final disposition of DB rebuild — evidence now favors retain-as-route or apply's final phase; needs a decision record.
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>`?), and whether align ever applies or always hands off to apply.
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning (carried).

## Next Focus

Q2: which customization/override signals this repository produces or can produce cheaply (three-way merge against the release base, provenance markers, hashes, git history).
