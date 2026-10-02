---
title: "Deep Research: a release-aware /doctor:update"
description: "Synthesis of ten deep-research iterations on redesigning /doctor:update into a release-aware updater that updates uncustomized skills, proposes alignment for customized ones, and keeps today's database rebuild as its own command."
trigger_phrases:
  - "release-aware doctor update"
  - "doctor update redesign research"
  - "doctor rebuild split"
  - "skill customization alignment proposal"
importance_tier: important
contextType: research
---

# Deep Research: a release-aware /doctor:update

<!-- ANCHOR:deep-research-release-aware-doctor-update -->

## 1. EXECUTIVE OVERVIEW

The release-aware updater should be several commands, not one. Today's `/doctor:update` is a database rebuild whose mutation boundary forbids writing skill content, so it cannot host a release apply. The research converged on this split:

- `/doctor:update` becomes the release family's front door, with three actions: `check` (read-only), `align` (writes proposal and decision artifacts only, never a skill file) and `apply` (the only writer of skill bodies, consuming align's accepted decisions, rolled back through git).
- The current database rebuild is kept unchanged under its own name, proposed `/doctor:rebuild`, with its flock, VACUUM snapshots and phases. Release `apply` composes it as a final reindex phase instead of merging the two mutation classes.
- Release identity comes from git tags and GitHub releases, never from changelog filenames or docs. Customization is decided per update unit (a hub or one direct child skill) by a base, local and release comparison. A locally changed file is never overwritten; it becomes a proposal.

The main uncertainty is Q2: the customization signal set was only partly researched. The base manifest the updater must record (no in-file provenance markers exist) and the divergence ledger's location are open.

Iterations: 10 of 10, all on `cli-pi` with `opencode-go/deepseek-v4.1-flash`. Stop reason: `maxIterationsReached` (stop policy `max-iterations`).

## 2. BACKGROUND & CONTEXT

Phase 3 of packet 048 audits `/doctor:update`. The packet's own `scratch/proposal.md` gave the current workflow a "fix" verdict with minimal edits to its database-rebuild phases, and `scratch/reality-check.md` inventories every path it names. This research asked a different question: what `/doctor:update` should become when it is redesigned as a release-aware updater for the framework. Every claim below comes from an iteration narrative under `research/iterations/`, which cite the repository paths read.

## 3. RESEARCH QUESTIONS

- Q1: How does the updater find the operator's current release and the latest upstream release, and compute the delta between them?
- Q2: How does it detect that a skill is customized or overridden locally, and which signals does the repository already produce?
- Q3: For a customized skill, how is an alignment proposal built, presented, approved and applied while keeping the override specifics?
- Q4: One command or several, and what happens to today's database-rebuild behaviour?
- Q5: What does each resulting command look like under the sk-create-command contract, and how does it reuse the install and sync scripts?

Sub-questions raised along the way: Q1a (degradation without git or `gh` auth), Q1b (composite child skills as update units), Q1c (a suspected frontmatter and changelog version mismatch), Q3a (`provenance_fingerprint` hash input), Q3b (divergence ledger location), Q4a (rename mechanics and reference sweep), Q5a (flag surface).

## 4. METHODOLOGY

Ten fresh-context `@deep-research` leaf iterations, each dispatched headless through `cli-pi` (`pi -p --offline --model opencode-go/deepseek-v4.1-flash --thinking max`) by the `/deep:research:auto` workflow. Each leaf read externalized state, did read-only repository investigation (file reads, `rg`, git plumbing, anonymous `git ls-remote` and GitHub REST calls), wrote one narrative and one delta, and recorded its iteration record through the append gateway. Every iteration passed the post-dispatch verifier on its first attempt. The stop policy forced all ten iterations; convergence was telemetry only.

## 5. KEY FINDINGS SUMMARY

1. A release is three artifacts: an annotated tag, a GitHub release and a framework changelog entry `.skilled/changelog/skilled/vX.Y.Z.W.md`. The tag and the GitHub release prove publication. Changelog entries can exist before their tag (`v4.0.0.3.md` exists with no tag) (iterations 1, 6).
2. The operator's position is `git describe --tags --dirty` against tags matching the four-part release pattern, excluding `backup/*` and non-version tags. Latest upstream works without `gh` auth through `git ls-remote --tags origin` or the anonymous REST `releases/latest` endpoint (iterations 1, 6).
3. Versions must be compared numerically by segment. A lexical sort produced a false mismatch in iteration 1 that iteration 2 retracted. The repository's own check 13b in `parent-skill-check.cjs` already sorts numerically and fails a real divergence by default (iteration 2).
4. Update units are exactly 14 hubs and 45 direct child skills. No deeper nesting exists. Children carry their own version and changelog lines and are routinely committed without the hub (iterations 3, 10).
5. Runtime mirrors are symlinks onto `.skilled/`, so there is one physical copy per skill and no copy-sync step (iterations 3, 4).
6. The repository already ships a whole-file three-way transaction with fingerprint guards: `.skilled/bin/compiled-route-sync.cjs` (stage, carry, finalize, revert). Its rule never overwrites the newer side, which is the policy align and apply need (iteration 5).
7. Today's `doctor-update.yaml` forbids writes to `.skilled/skills/**/SKILL.md` and `graph-metadata.json`. Its rollback is VACUUM snapshots, so it cannot host a skill-content apply (iterations 4, 7).
8. The flag and consent idioms already exist: `--dry-run` is opt-in and never a mode, read-only routes do not advertise it, and accept and ship are separate phases with a decision file as the consent channel (`deep-improvement`'s `promote-candidate.cjs --phase=accept|ship`) (iteration 8).

## 6. FINDINGS: Q1 RELEASE DETECTION AND DELTA

- Publication contract: `/create:changelog` tags with `git tag -a`, pushes the tag and runs `gh release create`, all approval-gated (`create-changelog-confirm.yaml`, `create-changelog-auto.yaml`). `PUBLIC-RELEASE.md` section 4 says tags alone do not appear as releases (iteration 1).
- Live state at research time: GitHub latest `v4.0.0.2` (2026-09-28). Local and remote top tag `v4.0.0.2`. This worktree described as `v4.0.0.2-259-g...-dirty`, later `-261-`. `.skilled/changelog/skilled/README.md` prose and `PUBLIC-RELEASE.md` section 5 are stale, so docs are never the release oracle (iterations 1, 6).
- No manifest carries a version. `.skilled/package.json` is `{}`, and `doctor-update.yaml` Phase 8 already records that `package.json` is a build-time placeholder (iterations 1, 6, 7).
- Parsing hazards: `ls-remote` emits peeled `^{}` refs. Prerelease tags (`v4.0.0.0-beta.1`) sort above their release under version sort. The tag namespace holds `backup/*` and one non-version tag (iterations 1, 6).
- Three checkout classes: at-tag, ahead-of-tag (development, as this worktree is) and behind-tag (a consumer needing the update). Report ahead, behind and dirty separately (iterations 1, 6).
- Delta per unit: `git log` and `git diff <base>..<release> -- .skilled/skills/<hub>/[<child>/]`, plus the unit's frontmatter version change and the changelog entries between the two versions. A release that never touched a unit leaves it byte-identical (iterations 1, 6).
- Degradation ladder (Q1a): `gh` auth is never required for a public upstream. Without `.git`, local truth falls back to frontmatter and the changelog inventory, release bytes come from the release archive, and the delta is a path and sha256 inventory comparison. Without network, upstream is UNKNOWN, never "up to date" (iteration 6).
- Per-unit version truth is wider than `SKILL.md`. Check 13a requires `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` to carry the same version. The sk-doc engine `frontmatter-version.mjs` anchors on `max(frontmatter, newest changelog)`. A unit whose artifacts disagree should be reported as blocked by reconciliation, not updated (iteration 2).

## 7. FINDINGS: Q2 CUSTOMIZATION DETECTION

Partly answered. No iteration took Q2 as its main focus; the signals below came out of the Q3 and Q1 work.

- Git history is live and cheap where git metadata exists: path-scoped `git log` and `git diff <release-tag>..HEAD -- <unit>` (iteration 5).
- `provenance_fingerprint` in a skill's `graph-metadata.json` derived block is a schema-locked `sha256:` value, deterministic from source bytes and preserved by `regenerate-skill-derived.cjs`. It covers the derived block only, not the whole tree, and its exact hash input is unverified (Q3a) (iteration 5).
- No in-file provenance markers exist. Nothing in the tree states that a file is release-X bytes, so the updater must record its own base manifest of `(path, sha256)` per unit (iterations 5, 6).
- Base bytes are always obtainable, from `git show <tag>:<path>` or the release archive, so a per-file base manifest can be built even on a first run (iteration 6).
- A hub projection that differs from its generator output (`generate-leaf-manifest.cjs --check <hub>`) is a structural-drift signal that needs no git history (iterations 3, 4).

## 8. FINDINGS: Q3 ALIGNMENT PROPOSALS FOR CUSTOMIZED SKILLS

- Precedent: `compiled-route-sync.cjs` keeps base, ours and theirs as fingerprint-verified states. It carries source-only entries forward, leaves a target-present entry alone, refuses a write when the bytes no longer match the expected fingerprint, and has symmetrical resumable `finalize` and `revert`. A test asserts that a serving-only edit survives a full cycle (iteration 5).
- Per-file classification of base, local and release: unchanged locally takes the release. Changed locally becomes a proposal. Local-only files are carried forward. Local deletions are respected and never resurrected. This is whole-file, not line-granular, and merged text is never auto-written (iteration 5).
- Guided resolution follows sk-git's merge-conflict idiom (`references/finish-workflows.md`): list conflicts, offer resolve, abort or keep, show `git diff`, and the human resolves (iteration 5).
- Evidence card per conflicted file: base, local and release blob references, sha256 fingerprints, diff hunks and the release's changelog entry as rationale. A proposal whose evidence no longer matches the tree is stale and refused at apply time (iteration 5).
- Decision vocabulary: per file `adopt-release`, `keep-local` or `keep-local-and-record-divergence`, and per unit `defer`. A divergence ledger records `{path, baseFingerprint, localFingerprint, releaseFingerprint, decision, decidedAt}` so the next run has an explicit base (iteration 5).
- Align is the accept phase and apply is the ship phase, matching `deep-improvement`'s two-phase promotion. Accept leaves canonical files untouched. Ship writes only the accepted snapshot and exits 1 on drift since acceptance (E2E-050) (iteration 8).

## 9. FINDINGS: Q4 ONE COMMAND OR SEVERAL, AND THE DATABASE REBUILD

Decision record DR-Q4-001 (iteration 7):

1. Keep the rebuild unchanged and give it its own name, proposed `/doctor:rebuild`, preserving all flags (`--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`, `--resume-bootstrap`), phases 0 to 10, flock, snapshots, SIGINT contract, migration manifest and `restart_required` bootstrap.
2. Repurpose `/doctor:update` as the release front door with `check`, `apply` and `align`. The trigger phrase "spec-kit version migration" moves to it, and "rebuild all spec-kit databases" stays with the rebuild.
3. Compose, do not merge. Release `apply` invokes the rebuild as its final reindex phase, or tells the operator to run it, and records `reindex: rebuilt|skipped|failed`. A skipped or failed reindex ends in a stale-index warning, never a silent success.
4. Migration and bootstrap travel with the rebuild. Release apply consults the migration manifest only for version-skip gating.

Why the rebuild must survive: `doctor-deep-loop.yaml:30` and `doctor-speckit-presentation.txt:206` name `/doctor:update` as the rebuild owner. Changelog `v3.4.1.0` records "Keep. `/doctor:update` is unchanged", and `v3.5.0.0` already calls the rebuild a "cross-subsystem alignment". That earlier use of "alignment" is a naming hazard for the release family's `align` (iterations 4, 7).

## 10. FINDINGS: Q5 COMMAND SHAPES UNDER THE SK-CREATE-COMMAND CONTRACT

- The doctor family is a `subaction-route-manifest` router (`command-contract.json` `families.doctor`). It is confirm-only (`supported_modes: []`), and its presentation is owned by `-presentation.txt` assets. Adding a target means a route in `_routes.yaml`, a `doctor-<name>.yaml`, a `doctor-<name>-presentation.txt`, then `route-validate.sh` (iteration 4).
- The thin-router anatomy to copy is `update.md`: frontmatter, Router Contract, Owned Assets, Mode Routing constants, Execution Targets ("load the YAML only after every setup value is bound"), Presentation Boundary and Workflow Summary (iteration 4).
- The workflow YAML grammar to mirror: `role`, `purpose` and `action`; `operating_mode`; a named invariant block; `upstream_assets` with `pass_policy`; `user_inputs` and `field_handling`; `mutation_boundaries` with `allowed_targets`, `forbidden_targets` and a canonical path validator; `state_log_schema`; and numbered phases with per-phase approval gates (iteration 4).
- Flag surface (Q5a, iteration 8): `argument-hint: "[check|apply|align] [--json] [--dry-run] [--release=<tag>] [--decisions=<path>] [--scope=all|<skill,...>]"`.

| Action | Flags | Mutation class | Rollback and gates |
|---|---|---|---|
| `check` | `--json`, `--release=<tag>` | read-only | No `--dry-run`, because read-only routes do not advertise it. Reports UNKNOWN when upstream is unreachable. |
| `align` | `--dry-run`, `--release=<tag>`, `--scope=all\|<skill,...>` | add-only (run-state proposals and decision file) | Never writes a skill file. One consolidated decision batch per unit. Hands off with `/doctor:update apply --decisions=<path>`. |
| `apply` | `--dry-run`, `--decisions=<path>` | mutates skill bodies | Startup confirmation before the first write. With no decision file, applies only to uncustomized units and leaves customized ones untouched. Refuses on drift since acceptance. Git-based rollback. |

- Apply transaction order (iteration 4): flock and snapshot. Write the release delta for uncustomized units and accepted decisions. Regenerate projections, dry-run first (`generate-leaf-manifest.cjs --write`, `regenerate-skill-derived.cjs --write`, `compiled-route-sync.cjs`, `frontmatter-version.mjs apply`). Run the post-apply battery (every generator in `--check`, the `ci-*` freshness gates, `route-validate.sh`, the `.opencode/SYNC.md` section 4 symlink integrity loop). Rebuild the advisor graph. Write the state log and release the lock on every terminal path.
- Install and sync reuse (iteration 4): no copy-sync step, since `.opencode` entries are symlinks. Re-run the hook installers (`install-git-hooks.sh`, `install-codex-hooks.mjs`) only when a release touches hook definitions, gated by their check counterparts. Run `npm ci` in `.opencode` only when the release moves the plugin SDK pin. `git-sync.sh` and `git-primary-reconcile.sh` publish session work and do not fetch releases, so the updater adds its own fetch step (iteration 6).
- Composite children (Q1b, iterations 3 and 10): units are per hub or per direct child. A customized child blocks only itself. A child update that changes leaf inventory or routing text regenerates the hub's `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` in the same transaction, detected by `generate-leaf-manifest.cjs --check <hub>`.
- Rename and reference sweep (Q4a, iteration 9): the registration lives in the `standalone:` block of `_routes.yaml`. Runtime mirrors are regenerated by `sync-runtime-mirrors.cjs`. `command-catalog-mirror-check.cjs` is the structural gate for `.skilled/commands/README.txt` rows and counts. Live docs to sweep: root `README.md`, `system-deep-loop/runtime/references/integration-points.md` (its line-number anchors into `update.md` break on rewrite), feature catalog and playbook doctor files, `db-path-policy.md`, and the `command-contract.json` doctor selector and aliases. Generated retrieval fixtures are regenerated, never hand-edited.

## 11. RECOMMENDATIONS

1. Implement the split in DR-Q4-001: rename the current trio to `/doctor:rebuild` without behaviour change, then build `/doctor:update` with `check`, `align` and `apply` as a separate mutation class.
2. Build `check` first. It is read-only, has the full data path (local base, upstream latest, per-unit delta) and makes the degradation invariant testable: unreachable upstream is UNKNOWN, never OK.
3. Base `align` and `apply` on `compiled-route-sync.cjs`'s carry, fingerprint-guard and resumable-revert machinery and on `deep-improvement`'s accept and ship split, not on new merge code. Never auto-write merged text.
4. Have the updater record a per-unit base manifest of `(path, sha256)` at each applied release, because the tree carries no provenance markers.
5. Make apply's post-verification battery the existing generator `--check` modes and `ci-*` gates, and invoke `/doctor:rebuild` as the last phase.
6. Settle the open naming question before the rename: either keep "align" with a qualifier, or rename the action, because "alignment" already names the rebuild in `v3.5.0.0`.

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Take the latest release from changelog files or from `PUBLIC-RELEASE.md` | Untagged `v4.0.0.3.md` exists, and both docs are stale. Only tags and GitHub releases prove publication | `.skilled/changelog/skilled/README.md` section 1, `git tag --list` | 1, 6 |
| Lexical sort of tags or changelog filenames | Produced a false mismatch (`v0.9.0.0` over `v0.14.1.0`). Peeled refs, prereleases and non-version tags also break a naive sort | `parent-skill-check.cjs` check 13b numeric sort | 1, 2 |
| Treat a frontmatter and changelog version divergence as accepted practice | No divergence exists today. Check 13b fails a real one by default | `parent-skill-check.cjs:1470-1536`, commit `96ee85d5b79` | 2 |
| Update composite children only through their hub | Children have their own version and changelog lines and are committed without the hub | child-scoped commits, `mode-registry.json` pins hub version only | 3, 10 |
| Fold release apply into `doctor-update.yaml` as a new phase | Its forbidden targets ban skill and doctor-command writes, and its invariant is a DB-rebuild flock chain | `doctor-update.yaml:102-133` | 4, 7 |
| Copy or sync `.skilled/` into `.opencode/` during apply | Entries are symlinks, drift is impossible, and a copy would create a second source of truth | `.opencode/SYNC.md` sections 1 and 2 | 4 |
| `:auto` or `:confirm` suffixes on the new actions | The doctor family is confirm-only with `supported_modes: []` | `command-contract.json` `families.doctor` | 4, 8 |
| Line-granular automatic three-way merge into customized files | No in-repo safety idiom. Precedent is whole-entry carry plus human resolution | `compiled-route-sync.cjs`, sk-git `finish-workflows.md` | 5 |
| Retire the rebuild, or fold it silently into release apply | Orphans owner references and merges two mutation classes and two rollback disciplines | `doctor-deep-loop.yaml:30`, `doctor-speckit-presentation.txt:206` | 7 |
| Keep `/doctor:update` as the rebuild and name the release family `/doctor:release` | Leaves "update" meaning "rebuild" and strands the version-migration trigger phrase | `_routes.yaml:234` | 7 |
| `--accept=<proposal>` or `--accept=all` flags | No precedent. The decision unit is per file and consent travels in a decision file | `promote-candidate.cjs --acceptance-file` | 8 |
| `--dry-run` as default or as a mode | The repository defines it as an opt-in workflow input | `deep/research.md:128`, `doctor/env.md:33` | 8 |
| `--force` past apply's drift refusal | Drift since acceptance is a changed contract. The ship precedent exits 1 | E2E-050 | 8 |
| Align applying adopted files itself | Would duplicate apply's staging, rollback and drift machinery and merge mutation classes | F-008-2, F-iter007-001 | 8 |
| Hand-editing generated retrieval fixtures in the rename sweep | They are generated and their hits come from spec-packet titles | `trigger-index.json` and siblings | 9 |

## DIVERGENCE MAP

- Saturated directions: none recorded. The registry's `divergence` block is empty.
- Pivots taken: none. Convergence mode was `default` and no divergent pivot ran.
- Pivot failures and audited overrides: none.
- Remaining frontier: Q2 customization signals beyond git history and `provenance_fingerprint`, the Q3a hash input, the Q3b ledger location, and the registration shape for a three-action family.
- Breadth note: all ten iterations stayed on the five key questions and their sub-questions. Stopping at the iteration cap says nothing about whether the topic converged.

## 12. OPEN QUESTIONS

- Q2 (partial): the full customization signal set. Missing: how a first run with no recorded base manifest separates customized from merely behind files beyond `git diff` (for example on a non-git checkout), and whether `provenance_fingerprint` is usable as a pre-filter.
- Q3a: the exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts` was never read).
- Q3b: whether the divergence ledger is git-tracked (audit, merge-conflict risk) or gitignored run state (clean tree, weaker audit).
- Registration shape, where the iterations disagree. Iterations 7 and 8 put `check`, `align` and `apply` as actions of one `/doctor:update` router, while iteration 9 counts a one-to-three split taking the doctor command count from 4 to 6. The `standalone:` entry and `README.txt` count depend on which is chosen.
- Trigger phrase partition, where the iterations disagree. Iteration 7 keeps "rebuild all spec-kit databases" with the rebuild, while iteration 9 assigns it and "doctor full sync" to `apply`. DR-Q4-001 should govern, but the conflict needs an explicit decision.
- Whether `/doctor:update` keeps a deprecated rebuild alias for one release (iteration 9).
- Naming of the `align` action, given that "alignment" already names the rebuild in `v3.5.0.0`.
- Prerelease policy for latest-upstream resolution (iterations 1, 6).

## 13. REFERENCES

Iteration narratives: `research/iterations/iteration-001.md` through `iteration-010.md`. Structured deltas: `research/deltas/iter-001.jsonl` through `iter-010.jsonl`.

Main repository sources cited by the iterations: `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update.yaml`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/commands/doctor/scripts/route-validate.sh`, `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `.skilled/changelog/skilled/README.md`, `.skilled/bin/compiled-route-sync.cjs`, `.skilled/skills/sk-git/references/finish-workflows.md`, `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `.opencode/SYNC.md`, `PUBLIC-RELEASE.md`, and `deep-improvement`'s `promote-candidate.cjs`.

## 14. SOURCES CONSULTED (aggregate)

Read-only repository reads, `rg` searches, git plumbing (`describe`, `tag`, `for-each-ref`, `ls-remote`, `log`, `show`, `ls-files`, `cat-file`), `gh release list`, and one anonymous GitHub REST call to `releases/latest`. The registry holds 142 key findings across 10 iterations.

## 15. RESOURCE MAP

`resource-map.md` was absent at init, so no packet-level map is cited. The workflow emitted `research/resource-map.md`, but it lists 0 references: the leaves' delta findings carry no `path`, `source_path`, `sources` or `citations` fields, which are what the resource-map extractor reads.

## 16. CONVERGENCE REPORT

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 0 / 5 (as counted from the strategy's key-question checkboxes, which the reducer never ticked; by the narratives Q1, Q3, Q4 and Q5 are answered and Q2 is partial, see iteration 10's note on why the registry's `resolvedQuestions` stays empty)
- Remaining questions: 5 (by the same strategy count)
- Last 3 iteration summaries: run 8: Q5a flag surface and whether align ever applies (0.6); run 9: Q4a rename mechanics and reference sweep (0.62); run 10: Q1b composite child skills as independent update units (0.45)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- newInfoRatio by iteration: 0.85, 0.72, 0.6, 0.7, 0.7, 0.75, 0.6, 0.6, 0.62, 0.45. The inline vote at the cap scored 0 (rolling average 0.557, MAD noise floor 0.089, question coverage 0), so the run would not have stopped on convergence either.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 17. APPENDIX: EXECUTION LOG

| Iteration | Focus | newInfoRatio | Executor model | Verify |
|---|---|---|---|---|
| 1 | Q1 how releases are marked | 0.85 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 2 | Q1c frontmatter and changelog mismatch | 0.72 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 3 | Q1b composite children as units | 0.6 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 4 | Q5 command shapes and install or sync reuse | 0.7 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 5 | Q3 alignment-proposal mechanics | 0.7 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 6 | Q1 and Q1a release detection and degradation | 0.75 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 7 | Q4 rebuild disposition (DR-Q4-001) | 0.6 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 8 | Q5a flag surface and align handoff | 0.6 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 9 | Q4a rename mechanics and reference sweep | 0.62 | opencode-go/deepseek-v4.1-flash | pass, first attempt |
| 10 | Q1b decision closure | 0.45 | opencode-go/deepseek-v4.1-flash | pass, first attempt |

<!-- /ANCHOR:deep-research-release-aware-doctor-update -->
