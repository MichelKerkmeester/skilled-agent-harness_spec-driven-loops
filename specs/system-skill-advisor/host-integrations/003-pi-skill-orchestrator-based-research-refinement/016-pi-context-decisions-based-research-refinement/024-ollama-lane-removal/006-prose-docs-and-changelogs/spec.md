---
title: "Feature Specification: Phase 6: prose-docs-and-changelogs"
description: "After phase 005, 79 tracked files outside specs/ still name the retired lane only in prose: skill docs, catalogs, playbooks, env references, identity files, three five-lane file names and 23 released changelog entries. This phase rewrites, renames or deletes each one, writes the removal's own changelog entry, and leaves only generated files and allowlist candidates for the residue check."
trigger_phrases:
  - "prose docs and changelogs"
  - "phase 6 prose docs and changelogs"
  - "rewrite released changelog entries"
  - "rename the lane fusion files"
  - "removal changelog wording"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 6: prose-docs-and-changelogs

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

At `cf702d3fb9e` the residue check lists 172 live files. Once phase 005 lands, 99 remain by this plan's classification, and 79 of those are prose this phase owns: 53 docs, identity files and assets, 23 released changelog entries and three generated files whose sources change here. This phase rewrites each doc so it describes the four-lane advisor that exists, deletes the two catalog leaves that describe only the lane, renames the three five-lane files to `lane-fusion` names, rewrites all 23 changelog entries with a fixed glossary that keeps every version, date and fact, and writes `system-skill-advisor` v2.0.0.0 to announce the removal. Afterwards the check lists 20 paths: 5 generator outputs for phase 007 and 15 allowlist candidates for phase 008, `git ls-files | grep five-lane` prints nothing, and the link, leaf manifest, frontmatter, doc version, catalog and playbook checks, the four routing ratchets and the skill-graph freshness check pass as they did at the start commit.

**Key Decisions**: rewrite every changelog match with one glossary and never delete history; word the removal entry without any lane term, its spec-folder line naming the `016` parent as `v4.2.0.0` already does, so it needs no allowlist row; rename to `lane-fusion.md` and `lane-fusion-stress.vitest.ts`; regenerate the advisor leaf manifest, leaf aliases and `skill-graph.json` inside this phase's commit because a pre-commit gate and a CI gate fail without them; fold the removal into the untagged `v4.2.0.0` framework entry; leave published GitHub release bodies and tags to the operator after merge.

**Critical Dependencies**: phase 005 committed, so no code, test or lockfile still names the lane; the `sk-create-changelog` workflow for the new entry; the conductor's answer to open question 1 before phase 007 is planned.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-shared-embeddings-package |
| **Successor** | 007-generated-surfaces |
| **Handoff Criteria** | The residue check lists only this spec's 007 and 008 paths; link, leaf manifest, frontmatter and doc version checks and the four ratchets pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Ollama lane removal specification.

**Scope Boundary**: Prose only: every doc, identity file, playbook, catalog leaf, command asset, env reference and trigger phrase that names the lane, the two catalog leaves deleted whole, the three five-lane renames with every referrer, all 23 released changelog entries that name the lane, the new changelog entry for the removal, and the three generated files whose sources change here (the advisor leaf manifest, its leaf aliases and the skill-graph export).

**Dependencies**:
- 005-shared-embeddings-package: no code, test, manifest or lockfile names the lane, and the shared package, the model server and `MEMORY_DB_PATH`'s readers are gone
- `../../023-ollama-deprecation-research/research/research.md` sections 4.1 to 4.6, 5.2 step 5, 5.5 and 5.6, and decisions Q002 and Q004 in `../../023-ollama-deprecation-research/decision-record.md`

**Deliverables**:
- The residue check lists only the 20 paths in section 3's 007 and 008 lists
- Link, leaf manifest, frontmatter and doc version checks, the catalog and playbook validators and the four ratchets pass
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002 to 005 delete the lane's code, but the docs still teach it. The advisor README, ARCHITECTURE and SKILL.md describe five lanes and a semantic health flag the status tool now refuses; 22 catalog and playbook files show `semantic_shadow` weights, Ollama probes and a five-lane fusion leaf; `.env.example` and `ENV-REFERENCE.md` document an embedding section whose readers 005 deletes; three files carry "five-lane" in their names; and 23 released changelog entries still tell readers to set a lane weight, run the embedder route or stop a vector refresh that no longer exists.

### Purpose
Every doc describes the four-lane advisor that ships, the release history stays true without the lane's vocabulary, and the residue check is left with only generator output and allowlist candidates.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured at `cf702d3fb9e` (phase 004's commit). The residue run below came first, while `git status` listed no tracked change. Phase 005 began deleting files in this worktree during the later runs, so the link check below shows 005's half-applied state, and the 005 class is projected from `../005-shared-embeddings-package/spec.md`, not observed.

```text
$ git rev-parse --short=11 HEAD
cf702d3fb9e
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo | grep -E '^(files|allowlisted|live) '; echo "exit=$?"
files       : 201 (identifier 152, prose 123, path 21, symlink 0)
allowlisted : 29
live        : 172
exit=1
$ node <classifier over the --json live list, the rules in section 3>
005            73
006            53
006-changelog  23
006-regen      3
006+008        1
007            5
008            14
total          172 (live 172)
$ <for each live path under a changelog/ folder: wc -l, and lines matching the check's IDENTIFIER_PATTERN|PROSE_PATTERN case-insensitively>
.skilled/changelog/skilled/v3+/v3.1.2.0.md lines=348 hits=1
.skilled/changelog/skilled/v3+/v3.4.0.0.md lines=348 hits=1
.skilled/changelog/skilled/v3+/v3.4.1.0.md lines=652 hits=1
.skilled/changelog/skilled/v3+/v3.5.0.0.md lines=366 hits=5
.skilled/changelog/skilled/v3+/v3.5.0.3.md lines=86 hits=2
.skilled/changelog/skilled/v3+/v3.6.0.0.md lines=457 hits=1
.skilled/changelog/skilled/v4.0.0.0.md lines=1143 hits=2
.skilled/changelog/skilled/v4.1.0.0.md lines=879 hits=11
.skilled/changelog/skilled/v4.2.0.0.md lines=413 hits=16
sk-doc/changelog/v1.6.0.0.md lines=135 hits=1
system-skill-advisor/changelog/v0.11.0.0.md lines=46 hits=2
system-skill-advisor/changelog/v0.17.6.0.md lines=38 hits=3
system-skill-advisor/changelog/v0.2.0.0.md lines=66 hits=5
system-skill-advisor/changelog/v1.0.0.0.md lines=493 hits=22
system-skill-advisor/changelog/v1.2.0.0.md lines=38 hits=9
system-skill-advisor/changelog/v1.3.0.0.md lines=39 hits=11
system-skilled-doctor/changelog/v1.1.7.0.md lines=62 hits=2
system-spec-kit/changelog/v0+/v0.2.10.0.md lines=147 hits=2
system-spec-kit/changelog/v0+/v0.2.21.0.md lines=50 hits=1
system-spec-kit/changelog/v1+/v1.4.2.0.md lines=269 hits=3
system-spec-kit/changelog/v1+/v1.7.0.0.md lines=722 hits=3
system-spec-kit/changelog/v2.0.0.0.md lines=183 hits=3
system-spec-kit/changelog/v2.12.12.0.md lines=47 hits=1
$ <check_changelog_shape.py, validate_document.py and hvr_scan.py on the 23 entries> | sort | uniq -c
  16 shape=0 validate=0 hvr=0
   7 shape=1 validate=0 hvr=0
$ for v in v3.1.2.0 v3.4.0.0 v3.4.1.0 v3.5.0.0 v3.5.0.3 v3.6.0.0 v4.0.0.0 v4.1.0.0 v4.2.0.0; do git rev-parse -q --verify refs/tags/$v >/dev/null && echo "$v tagged" || echo "$v untagged"; done
v3.1.2.0 tagged
v3.4.0.0 tagged
v3.4.1.0 tagged
v3.5.0.0 tagged
v3.5.0.3 tagged
v3.6.0.0 tagged
v4.0.0.0 tagged
v4.1.0.0 tagged
v4.2.0.0 untagged
$ git ls-remote --tags origin refs/tags/v4.2.0.0 refs/tags/v4.1.0.0
93e875708d0e63bd128f5538a237f32ae40cce1e	refs/tags/v4.1.0.0
$ grep -n '^version' .skilled/skills/system-skill-advisor/SKILL.md; ls .skilled/skills/system-skill-advisor/changelog | sort -V | tail -1
5:version: 1.3.0.0
v1.3.0.0.md
$ git ls-files | grep five-lane
.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md
.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md
.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts
$ git grep -l five-lane-fusion -- ':!specs' | wc -l
      25
$ git grep -l -E '\]\([^)]*(five-lane-fusion|background-vector-refresh|command-meaning-matching)\.md' -- specs/ | wc -l
      21
$ node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | grep -v '^$' | head -7
check-markdown-links: 7684 files, 15249 links checked, 5 broken
Broken markdown links (target resolves under neither the file dir nor repo root):
  .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md  ](../../shared/embeddings/registry.ts)
  .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md  ](../../shared/embeddings/adapter.ts)
  .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md  ](../../shared/embeddings/auto-select.ts)
  .skilled/skills/system-spec-kit/shared/README.md  ](./embeddings/README.md)
  .skilled/skills/system-spec-kit/shared/algorithms/README.md  ](../embeddings/README.md)
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skill-advisor; echo "exit=$?"
leaf-manifest.json OK (dedd8320b72b7f7bb6ce4f2cab37e893d999c2619f9e91ce31c5260b5773185b)
exit=0
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1
checked=14 passed=14 failed=0 fixed=0
$ bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage | tail -1
PASS mode=coverage scope=all-skills docs=103 carrying-detailed-block=103 violations=0
$ node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs gate | tail -1
[gate] 5599 files | ok=3006  skip-no-frontmatter=2593
$ python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-skill-advisor | tail -1
PASS: 0 violations (all enforced catalog checks).
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skill-advisor | grep '^PASS'
PASS package=system-skill-advisor tier=FAIL_CLOSED scenarios=55 categories=9 operator=28 routing_gold_excluded=27 violations=0 warnings=0
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check | tail -1
[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check | grep -E 'stale documents|obsolete paths'; echo "exit=$?"
  stale documents   : 65 (64 missing from the index)
  obsolete paths    : 3
exit=1
$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict | grep -E 'STALE COMPILED|SIGNAL DRIFT'; echo "exit=$?"
  STALE COMPILED: none (generated_at 2026-11-20T09:04:25.683339+00:00, newest source stamp 2026-11-14T00:00:00Z)
  SIGNAL DRIFT compiled vs disk: none
exit=0
$ python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only | tail -1
VALIDATION PASSED: all metadata files are valid
```

Every one of the five broken links points into `shared/embeddings/`, which phase 005 had just deleted, and a deletion cannot repair a link, so the start commit had 0 broken links, as 005 recorded at `0c2ab52b3b3`. The trigger index was already stale at the start commit: a later `--check` during 005's build printed 6 obsolete paths. The seven shape failures at the start commit are `v3.4.0.0`, `v3.6.0.0`, sk-doc `v1.6.0.0`, advisor `v1.2.0.0` and `v1.3.0.0`, and spec-kit `v0.2.10.0` and `v2.0.0.0`. The 21 spec docs that link to the moved files sit under `specs/`, which the link check does not walk and the parent's decision D1 keeps as history.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

"Only generated paths still match" means, for this phase: every live path the residue check lists after 006 is on the 007 list or the 008 list below, no path on the 006 lists is live, and the new removal entry is neither live nor allowlisted (open question 1 states why the 008 list is not yet allowlisted).

### Classified residue list at `cf702d3fb9e`

`A/` is `.skilled/skills/system-skill-advisor/`, `K/` is `.skilled/skills/system-spec-kit/`, `C/` is `.skilled/changelog/skilled/` and `D/` is `.skilled/skills/sk-doc/`. The 172 live paths split as follows. The rules: a path 005 deletes or edits is 005 class; a path a generator writes is 007 class unless its source changes here, which makes it 006-regen; a frozen baseline, a refusal test or a match that is not the lane is 008 class; every other doc, identity file, asset or changelog is 006 class.

| Class | Count | Paths |
|-------|-------|-------|
| 005, in flight | 73 | `K/shared/embeddings/` (12), `K/runtime/tests/embedders/` (12), `K/runtime/tests/local-llm-features/` (7), `K/shared/chunking.ts`, `K/shared/scripts/env-reader-table.mjs`, `K/shared/tests/README.md`, `auto-select.test.ts`, `model-server-constants.test.ts`, `profile.test.ts`, `registry.test.ts`, `K/runtime/tests/README.md`, `api-key-validation`, `api-validation`, `factory-auto-resolution`, `launcher-ipc-bridge-probe`, `model-server-demand-probe`, `model-server-respawn-lock-atomic`, `orphan-sweeper-temp-path` (each `.vitest.ts`), `K/runtime/cli/tests/memory-pipeline-regressions.vitest.ts`, `sweep-memory-residue.vitest.ts`, `K/ROUTER.md`, `K/references/memory/memory-system.md`, `embedder-pluggability.md`, `K/leaf-manifest.json`, `K/leaf-aliases.json`, `K/package.json`, `K/package-lock.json`, `A/runtime/package.json`, `A/runtime/package-lock.json`, `A/scripts/README.md`, `A/scripts/doctor.sh`, `A/runtime/tests/launcher-bootstrap.vitest.ts`, `launcher-model-server-default.vitest.ts`, `.skilled/skills/system-deep-loop/package-lock.json`, `D/scripts/validate-doc-model-refs.js`, `D/scripts/tests/code-folder/baseline-readme-verdicts.json`, `durable-directory-manifest.json`, `.skilled/scripts/orphan-mcp-sweeper.sh`, `.skilled/commands/doctor/scripts/orphan-process-check.cjs` and its test, `.skilled/bin/system-skill-advisor-launcher.cjs`, `hf-model-server.cjs`, `README.md`, `lib/README.md`, `lib/model-server-supervision.cjs` |
| 006, prose | 53 | Listed in Files to Change below |
| 006, changelog | 23 | The 23 entries in Measured Behavior |
| 006-regen | 3 | `A/leaf-manifest.json`, `A/leaf-aliases.json`, `A/runtime/scripts/skill-graph.json` |
| 006 then 008 | 1 | `K/feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md`: its model-server sentence is rewritten here, and its "preserves Ollama" sentence (the guard decision Q005 keeps) and a cited spec path stay for an allowlist row |
| 007, generated | 5 | `K/runtime/data/trigger-index.json`, `K/runtime/cli/retrieval/fixtures/phrase-variants.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `A/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` |
| 006, allowlist rows | 14 | Refusal tests `A/runtime/tests/cli-exit-taxonomy.vitest.ts` and `handlers/advisor-status.vitest.ts`; frozen baseline `A/runtime/tests/parity/fixtures/local-native-approved-divergences.json`; not the lane: `K/runtime/cli/ops/process-memory-harness.ts`, `K/runtime/cli/tests/process-memory-harness.vitest.ts` and `process-sweep.vitest.ts` (an operator-managed Ollama daemon), `K/runtime/cli/retrieval/sweep-memory-residue.mjs` and `K/runtime/cli/tests/workflow-invariance.vitest.ts` (the retired memory tools' names), `K/runtime/cli/retrieval/fixtures/semantic-probes.json` (a frozen capture of spec paths), three `K/runtime/cli/tests/fixtures/anchor-repair-sample/*_spec.md` fixtures, and two `K/manual-testing-playbook/` entries whose only match is a cited spec-folder path |

Projected numbers: 99 live at 006's start commit (172 less 005's 73), 5 live after 006 (the 007 list), and 46 allowlisted: 30 at the start plus this phase's 16 REQ-014 rows. [DEVIATION: the conductor moved the non-lane allowlist rows into this phase, so the projection of 20 live and no new row no longer holds.]

### In Scope
- Rewrite every prose match in the 53 docs, identity files and assets, so each describes the four-lane advisor and names no deleted setting, file, flag or route; delete the two catalog leaves that describe only the lane with their index rows and inbound links.
- Rename the three five-lane files to `lane-fusion` names (decision D1) and update every referrer outside `specs/`, then regenerate the advisor leaf manifest and leaf aliases.
- Edit the advisor's `intent_signals` and router keywords that name the lane, then regenerate `skill-graph.json` in the same commit.
- Rewrite all 23 released changelog entries with the glossary in `plan.md` ADR-001, renaming anchors and their in-file links together.
- Write `A/changelog/v2.0.0.0.md` for the removal through the `sk-create-changelog` workflow, raise the advisor's `SKILL.md` version to `2.0.0.0`, and fold the removal into the untagged `C/v4.2.0.0.md`; neither entry needs an allowlist row.
- Fix the non-vocabulary leftovers the earlier phases routed here: `MEMORY_DB_PATH` prose, the deleted sweep test named in `lane-weight-tuning.md`, the model-server flag in two playbooks, the sk-code examples naming a deleted interface, `K/runtime/core/README.md` 20 and the spec-kit catalog index line on the sweeper.

### Out of Scope
- The five 007 paths. Their generators run in phase 007, and `generate-trigger-index.mjs --check` stays at exit 1 until then, as it already is at the start commit.
- None of the 14 allowlist-row paths or the sweeper catalog leaf's guard sentence is edited; each gets an exact-path allowlist row here (REQ-014, resolved open question 1).
- Packets under `specs/`, including the 21 spec docs that link to the moved files, per the parent's decision D1.
- Republishing a tag or editing a published GitHub release body. Parent decision D2 forbids pushing, so the operator does both after merge (`plan.md` ADR-006).
- Secondary changelog entries for `system-spec-kit`, `system-skilled-doctor` and `sk-doc`. `sk-create-changelog` reports them as candidates and writes one primary entry.
- Changelog lines that name the model server, the CI install setting or a provider without any residue term (`C/v4.0.2.0.md` 397, advisor `v0.12.0.0` 180 and `v0.17.27.0` 43, spec-kit `v2.9.2.0` 3, 15 and 21 and `v2.12.22.0` 44): each records what its release did, and widening the rewrite past decision Q002's 23 entries widens the drift from published release bodies.
- Test code that snapshots `MEMORY_DB_PATH` as harness scaffolding (`K/runtime/cli/tests/auto-detection-fixes.vitest.ts`, `test-integration.vitest.ts`, `K/shared/tests/config.test.ts`, `.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts`): code, not prose, and none matches the residue vocabulary.

### Files to Change

Line numbers are at `cf702d3fb9e`. Phase 005 edits none of these files except `K/shared/README.md`, so the numbers hold at 006's start commit; `tasks.md` names the text beside each number.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `A/feature-catalog/daemon-and-freshness/background-vector-refresh.md`, `A/feature-catalog/scorer-fusion/command-meaning-matching.md` | Delete | Describe only the lane's refresh and its paraphrase path (goal decision D2, the last two of the eleven docs) |
| `A/feature-catalog/feature-catalog.md` | Modify | Description 3; group rows 26 and 29 (counts 8 to 7 and 10 to 9, scope cells); "49 features" to 47; delete rows 54 and 102; row 95 to the renamed leaf |
| `A/feature-catalog/scorer-fusion/doctor-command-routing.md` 31, `pasted-reply-stripping.md` 52 and 53 | Modify | Drop the sentence and the link to the deleted leaf; relink the renamed leaf |
| `A/feature-catalog/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md` | Rename, Modify | Title "Analytical Lane Fusion"; four weights; delete the `semantic_shadow` row 30 and the enable sentence 32; RRF sentence 38; playbook link 66 and path 74 |
| `A/manual-testing-playbook/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md` | Rename, Modify | Title "SC-001 Analytical Lane Fusion"; four weights; no status flag at 47; delete expectations 63 to 67 and failure rows 76 and 77 for the deleted lane; feature link 85 and path 95 |
| `A/runtime/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts` to `lane-fusion-stress.vitest.ts` | Rename, Modify | The two strings at 25 and 36 drop "five-lane" |
| Catalog referrers `auto-indexing/df-idf-corpus.md` 53, `doc-frontmatter-harvest.md` 60, `provenance-and-trust-lanes.md` 72, `lifecycle-routing/age-haircut.md` 52, `scorer-fusion/ablation.md` 52, `ambiguity.md` 60, `attribution.md` 57, `executor-delegation.md` 73, `projection.md` 67, `weights-config.md` 45 and 57 | Modify | Link and label to `lane-fusion.md` |
| Playbook referrers `lifecycle-routing/age-haircut.md` 85, `manual-testing-playbook.md` 277, `scorer-fusion/ablation.md` 97, `lane-attribution.md` 202, `projection.md` 90 | Modify | Link and label to `lane-fusion.md` |
| `A/runtime/stress-test/skill-advisor/README.md` | Modify | Tree line 55 and row 101 |
| `A/leaf-manifest.json`, `A/leaf-aliases.json` | Regenerate | `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor`, two paths deleted and two renamed |
| `A/README.md`, `A/ARCHITECTURE.md`, `A/SKILL.md`, `A/ROUTER.md` | Modify | README 38, 46, 48, 90, 92, 113; ARCHITECTURE 22, 79, 126, 130, 160; SKILL 111 and `version` 5 to `2.0.0.0`; ROUTER 42 and 175 drop the "five-lane" keyword |
| `A/graph-metadata.json` | Modify | Delete four `intent_signals` entries (106, 107, 114, 115) |
| `A/runtime/scripts/skill-graph.json` | Regenerate | `skill_graph_compiler.py --export-json`, so the CI freshness check sees no signal drift |
| `A/references/scoring/advisor-scorer.md`, `lane-weight-tuning.md`, `validation-baselines.md` | Modify | advisor-scorer 3, 25, 47, 55, 65, 79 to 83; lane-weight-tuning 58, 79, 161; validation-baselines 147 |
| `A/references/runtime/freshness-contract.md` 146, `daemon-lease-contract.md` 138, `A/references/config/db-path-policy.md` 89, 90, 94 to 98 | Modify | Drop the refresh, the model-server socket and `MEMORY_DB_PATH` |
| `A/feature-catalog/cli-surface/advisor-status.md` 23, 31, 33; `daemon-and-freshness/lifecycle.md` 28, `watcher.md` 22; `lifecycle-routing/age-haircut.md` 22, `archive-handling.md` 26; `scorer-fusion/ablation.md` 24, `attribution.md` 23, `weights-config.md` 22, 24 | Modify | Four lanes, no semantic health block, no refresh |
| Advisor playbooks `auto-update-daemon/daemon-lifecycle-shutdown.md` 71, 107; `watcher-narrow-scope.md` 87; `lifecycle-routing/age-haircut.md` 3, 19, 26, 56; `native-cli-tools/native-status-transitions.md` 51, 77; `operator-h5/degraded-daemon.md` 44, 53, 61, 62, 115, 181; `scorer-fusion/ablation.md` 58, 59; `lane-attribution.md` 58, 59, 70, 104; `compat-and-disable/daemon-absent-fallback.md` 48, 55, 88 | Modify | Expected JSON shows four lane keys; no Ollama, refresh or model-server step |
| `.env.example` | Modify | Delete 96 (`MEMORY_DB_PATH`) and section 7 (228 to 275); rewrite 363, 374; delete 409 and 411 |
| `README.md` (repository root) | Modify | 26 and 204 |
| `K/runtime/ENV-REFERENCE.md` | Modify | 18, 166 to 174, row 188; section 6 (293 to 360) and the cascade probe section (447 to 458) deleted; advisor rows 376, 382, 383, 391, 392, 394 to 396, 399; quick start 593 to 602 |
| `K/references/config/environment-variables.md` | Modify | 38, 43, 59 to 92, 133 to 136 |
| `K/ARCHITECTURE.md` 160, 200; `K/runtime/core/README.md` 20; `K/shared/README.md` 159, 226 | Modify | `MEMORY_DB_PATH`, the cascade ADR row, the "five-lane" row; the shared README's table row 217 is `env-reader-table.mjs` output and stays with its generator |
| `K/feature-catalog/feature-catalog.md` 370, `K/feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md` 37 | Modify | The sweeper no longer names a model server; the Ollama guard sentence stays |
| `K/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md` 100, `K/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` 48, 83 | Modify | Name the deleted package in words; drop the dead model-server flag |
| `.skilled/commands/create/assets/create-command-auto.yaml` 472, `create-command-confirm.yaml` 484, `create-command-presentation.txt` 168 | Modify | The daemon picks up a new command on its next start; nothing embeds it |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md` 192 to 205, `quick-reference/template-naming-and-types.md` 162, `style-guide/formatting-imports-and-coexistence.md` 185 | Modify | No `I`-prefixed interface is left once 005 deletes `IEmbeddingProvider`; the import example names a type `shared/types.ts` still exports |
| The 23 changelog entries | Modify | Rewritten by the glossary and rules in `plan.md` ADR-001; `C/v4.2.0.0.md` also folds in the removal (ADR-004) |
| `A/changelog/v2.0.0.0.md` | Create | The removal entry, major bump, made by the `sk-create-changelog` workflow (ADR-003) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After the phase commit, `sweep-lane-residue.mjs repo --json` lists as live exactly the 5 paths on section 3's 007 list, none of the 79 paths classed 006, no path a REQ-014 row names, and neither `A/changelog/v2.0.0.0.md` nor any other new path, and `counts.allowlistRows` changes only by the REQ-014 rows. [DEVIATION: conductor decision moved the non-lane allowlist rows into this phase] |
| REQ-002 | Each of the 23 changelog entries keeps its path and file name, matches neither residue pattern (0 lines, case-insensitive), changes only lines that matched, the anchors and in-file links renamed with them and upgrade steps that point at the removal (except `C/v4.2.0.0.md`, which absorbs the removal as the open release), and fails no validator it passed at the start commit: `check_changelog_shape.py` exits 0 on the 16 that passed, `validate_document.py` and `hvr_scan.py` exit 0 on all 23. |
| REQ-003 | `A/changelog/v2.0.0.0.md` exists with the five frontmatter keys in contract order and both identity phrases; the whole file, spec-folder line included, matches neither pattern; `check_changelog_shape.py`, `validate_document.py` and `hvr_scan.py` exit 0; every path it names exists; and `A/SKILL.md` reads `version: 2.0.0.0`. |
| REQ-004 | `git ls-files \| grep -c five-lane` prints 0; `A/feature-catalog/scorer-fusion/lane-fusion.md`, `A/manual-testing-playbook/scorer-fusion/lane-fusion.md` and `A/runtime/stress-test/skill-advisor/lane-fusion-stress.vitest.ts` are tracked; and `git grep -l five-lane-fusion -- ':!specs'` prints only `K/runtime/data/trigger-index.json` and `K/runtime/cli/retrieval/fixtures/corpus-manifest.json`. |
| REQ-005 | The two deleted catalog leaves are untracked, `git grep -n -E 'background-vector-refresh\|command-meaning-matching' -- .skilled ':!**/trigger-index.json' ':!**/corpus-manifest.json' ':!**/generation-diagnostics.json' ':!**/phrase-variants.json'` prints nothing, and `A/feature-catalog/feature-catalog.md` states 47 features with daemon-and-freshness at 7 and scorer-fusion at 9. |
| REQ-006 | The docs gates pass: the link check prints `0 broken`; `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK` for the advisor and spec-kit; `ci-skill-root-metadata.cjs` prints `failed=0`; the frontmatter guard prints `violations=0`; `frontmatter-version.mjs gate` exits 0 and `bump --check --base <start commit>` exits 0; the catalog and playbook validators print `PASS` for the advisor with 0 violations; and the mirror check prints `PASS`. |
| REQ-007 | Routing does not move: the scorer-eval, local-native and holdout ratchets print the start commit's passed counts (7, 9 and 6 at phase 001's baseline), the routing corpus scorer exits 0 with `overall_pass: true`, `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none`, and no score baseline file changes. |
| REQ-008 | The advisor still builds and tests: in `A/runtime/`, `npm run typecheck` exits 0, `npm test` reports the start commit's file and case counts with 0 failed, and the stress suite reports the start commit's counts with `lane-fusion-stress.vitest.ts` among its files; in `K/runtime/`, `env-reference-drift.vitest.ts` passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The non-vocabulary leftovers are gone: `git grep -n -E 'MEMORY_DB_PATH\|lane-weight-sweep\|SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED\|include-semantic-health\|IEmbeddingProvider\|IVectorStore\|EmbeddingProfile\|hf-model server' -- '*.md' '.env.example' ':!specs' ':!**/changelog/**'` prints only `K/shared/tests/README.md`'s `config.test.ts` row, which describes test scaffolding that still clears the variable, and `K/shared/README.md`'s generated table row if phase 005's generator kept it. |
| REQ-010 | `bash D/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed`, and `validate_document.py` exits no worse than at the start commit on every edited Markdown file outside `changelog/`. |
| REQ-011 | The boundary holds: `git diff --name-only <start>..HEAD` lists no path on the 005 or 007 lists, touches the 006 allowlist-row paths only through `lane-residue-allowlist.json`, no file under `A/runtime/lib/`, `K/shared/` other than `README.md`, or `specs/` outside this folder; and no added line names a spec, phase, task, requirement or decision id. |
| REQ-012 | No tag or release changes: `git ls-remote --tags origin` prints the same lines before and after the phase, no `gh release` write runs, and `implementation-summary.md` lists the eight tagged framework entries rewritten here with the commands the operator runs after merge. |
| REQ-013 | `generate-trigger-index.mjs --check` still exits 1, and every stale or obsolete path it adds beyond the start commit's report is a doc this phase edited, renamed or deleted; regeneration stays with phase 007. |
| REQ-014 | Each of the 14 allowlist-row paths and the sweeper catalog leaf has one exact-path row in `K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` with a reason that says why its match is not the advisor lane, and `sweep-lane-residue.mjs repo --json` lists none of them as live. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live residue drops from 99 at the start commit to 20, every one on the 007 or 008 list, and no tracked file outside `specs/` has "five-lane" in its path.
- **SC-002**: All 23 changelog entries hold 0 residue lines with every version, date and fact kept, and the removal entry announces the change with no lane term in any line.
- **SC-003**: Every docs gate, the four ratchets, the freshness check, the advisor tests and the stress suite print what they printed at the start commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005's commit | Without it 73 code and test paths stay live and several docs would describe files that still exist | T001 reruns the check and halts if a 005-list path or an unlisted path is live; a 006 path that 005 already cleaned is recorded, not a halt |
| Risk | The `intent_signals` edit moves a routing result | High | No routing corpus row uses the four removed phrases; the four ratchets run in T018, right after the export regenerates, and a moved ratchet halts the phase with no recapture |
| Risk | A rename or delete leaves a stale leaf manifest and the pre-commit skill-authoring gate blocks the commit | Med | T011 regenerates both leaf files in the same commit and T048 checks them |
| Risk | The glossary rewrite turns a true history line false | Med | ADR-001 keeps every fact and number and only swaps the term; T041 diffs each entry and allows only matched lines, their anchors and pointed upgrade steps |
| Risk | `v4.2.0.0` gets tagged before this branch merges, so its folded removal describes a release that still had the lane | Low | Open question 4: the operator swaps the folded section for the glossary-only rewrite if the tag lands first |
| Risk | Published release bodies drift from the rewritten entries | Med | ADR-006: the operator runs `build_release_notes.py` and `gh release edit` after merge; no tag moves without a yes |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the phase changes prose and three generated files; no runtime path runs differently.

### Security
- **NFR-S01**: No edited doc reads or prints a dotenv value, token or key, and the `.env.example` deletions remove the model server's auth-token and remote-bind settings from the template.

### Reliability
- **NFR-R01**: Every gate that passed at the start commit passes afterwards with the same counts, and `generate-trigger-index.mjs --check` stays at its start-commit exit 1 until phase 007.

---

## 8. EDGE CASES

- Empty input: a changelog entry whose only match is inside a fenced example or a table cell is rewritten the same way; an entry with no match after 005 is left untouched and drops out of the 23.
- Maximum input: `system-skill-advisor/changelog/v1.0.0.0.md` holds 22 matching lines, a whole H2 and two anchors; it is rewritten as one unit and its glance links are checked against its anchors.
- Failure path: a doc still names the lane after its task; T045's residue run lists it as live and the phase does not commit until it is gone or the conductor moves it to the 008 list.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 87 edited, deleted or renamed and 1 created; about 500 changed prose lines; Systems: advisor docs, spec-kit docs, sk-code docs, command assets, five changelog folders, two generators |
| Risk | 9/25 | Auth: N, API: N, Breaking: N; routing inputs change in `graph-metadata.json` and `ROUTER.md`, guarded by the ratchets |
| Research | 6/20 | Research section 4 inventories the docs; this plan re-ran the check at `cf702d3fb9e`, read every match and baselined every validator |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 11/15 | Dependencies: phase 005's commit, the 007 and 008 ownership lines, the conductor's answer to open question 1, the operator's release edits |
| **Total** | **48/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Removing the four `intent_signals` phrases moves a ratchet | H | L | Ratchets in T018 and T049; halt on a move, never recapture |
| R-002 | The CI freshness gate fails on signal drift between 006 and 007 | M | H | ADR-005 regenerates `skill-graph.json` in this commit |
| R-003 | A changelog rewrite breaks an in-file anchor link | M | M | T041 checks every `#c-` link resolves to an anchor in the same file |
| R-004 | The removal entry has to name the lane's parts to say what left, and a plain word trips the check | M | M | ADR-003's word list is tested against the exported patterns before drafting; T043 runs the patterns on the draft and T045 the residue check on the file |
| R-005 | A deleted env row still has a `SPECKIT_*` reader, and the drift test fails | M | L | T028 lists each variable's readers, T030 deletes only rows with none, and `env-reference-drift.vitest.ts` runs in T030 and T049 |

---

## 11. USER STORIES

### US-001: The docs describe the advisor that ships (Priority: P0)

**As a** reader of the advisor's README, catalog or env reference, **I want** four lanes and no lane setting I cannot use, **so that** nothing I follow points at deleted code.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The release history stays true without the lane's vocabulary (Priority: P0)

**As a** reader of a past changelog, **I want** each entry to keep its version, date and facts, and to stop telling me to set a removed weight or run a removed route, **so that** history reads right and no instruction fails.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Phase 007 starts from a short, named list (Priority: P1)

**As** the conductor, **I want** the residue check to list only generator output and named allowlist candidates, **so that** phase 007 regenerates and phase 008 allowlists without another inventory.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

These sit here rather than in `goal.md`, as the authoring card asks, because this run may not edit `goal.md`.

- **Resolved by the conductor: the allowlist rows land in this phase.** Goal criterion 1 says only generated paths remain after 006, and phase 007's goal says the check exits 0 in repo mode, while phase 008's goal never mentions allowlist rows. So the 14 allowlist candidates and the sweeper catalog leaf get exact-path rows here (REQ-014, T056), and the child goals hold as written. Phase 005's plan routed them to 008; the goals outrank that plan.
- **Resolved: the removal entry is worded, with no allowlist row.** `sk-create-changelog` closes an entry with its spec-folder line, and the folder of packet `024-ollama-lane-removal`, which holds this work, matches the check. The entry names the `016` track folder one level above it instead, as `C/v4.2.0.0.md` already does for its advisor work, so the whole file is clean. If the conductor wants the child path, one exact-path row is the fallback (`plan.md` ADR-003).
- **Operator, open: published release bodies.** Eight tagged framework entries change. `sk-create-changelog` section 8 says to bring each published release in step in the same run, and parent decision D2 says nothing is pushed, so the release edits wait for the operator after merge (`plan.md` ADR-006). No tag moves without the operator's yes.
- **Operator, open: `v4.2.0.0` folds in the removal.** Origin has no `v4.2.0.0` tag, so the entry is the open release and absorbs the removal (`plan.md` ADR-004). If the operator tags `v4.2.0.0` before merging this branch, replace the folded section with the glossary-only rewrite in ADR-001.
- **Conductor, open: one phase where the upgrade step runs ahead of the code.** The removal entry tells users to run `/doctor:update apply` to clear the lane's leftovers, which phase 008 wires. Nothing merges before 008, so the plan writes the step here and phase 008 checks it against the wired cleanup.
- **Resolved: the skill-graph export moves from 007 into 006.** CI runs `skill-graph-freshness.cjs --strict`, which fails on `intent_signals` drift, so the export regenerates in the commit that edits its source (`plan.md` ADR-005). Phase 007 still runs its check mode.
- **Resolved: `C/v4.0.2.0.md` 397 stays.** Phase 005 routed its `ONNXRUNTIME` line here. It holds no residue term, records what that release did and is not one of decision Q002's 23.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 4 and 5, `../../023-ollama-deprecation-research/decision-record.md` Q002 and Q004, and `../005-shared-embeddings-package/plan.md` (its 006 rows)
