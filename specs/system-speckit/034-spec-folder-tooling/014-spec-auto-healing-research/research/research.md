# Spec auto-healing research: hardening the spec folder tooling and healing old corpora

Merged synthesis of a `/deep:research` fan-out run on 2026-10-07: three lineages of 15 iterations each (DeepSeek V4.1 Flash on cli-pi, SWE-2 Max on cli-devin, GPT-6 Luna at max reasoning on the fast tier through cli-codex), reviewed by the orchestrator. Every executor claim was treated as a hypothesis. Section 10 lists what the orchestrator re-read, confirmed, downgraded or refuted. The lineage files under `lineages/` hold the full per-iteration record.

---

## 1. Executive summary

The branch's failures come from a handful of producers, and most of them still run today. Healing tools already exist for most classes, so the gaps are a few defects at the source plus some coverage seams.

- **Archive moves are the largest producer.** `archive.sh` moves a packet with `cp -R`, `mv` and `rm -rf`, then refreshes only the track root, so every archived packet keeps its pre-archive `description.json` `specFolder` and `graph-metadata.json` path fields. That one gap produced the bulk of the 2,898 `METADATA_DISK_PATH_CONSISTENCY` occurrences and the 260 `GRAPH_METADATA_CHILD_IDENTITY` ones in the baseline.
- **Five tools hold five different archive policies.** `repair-derived.cjs` freezes `z_archive`, `heal-spec-docs.cjs` skips it, `migrate-generated-json.ts` rewrites it, `upgrade-legacy.mjs` only records it as warnings (pinned by a test) and Phase 13 rewrites it. This needs one written decision before any archive automation ships.
- **Two scaffold defects mint failures in new packets.** The core `spec.md` template wraps the Level 2 and 3 NFR, edge-case and complexity sections inside the `questions` anchor (549 spec.md files carry it today, 405 of them live). Separately, `create.sh --phase` exits before the graph-metadata derivation, so every phase scaffold starts with a stub that fails strict validation on `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`. Neither is caught: the validator only flags same-id nesting, and the golden snapshot test pinned the nesting as expected output.
- **The healers write what the checkers reject.** `heal-spec-docs.cjs` refills empty trigger lists with the exact phrases `phrase-judge.mjs` grades `template-default`. `upgrade-legacy.mjs` runs it with `--apply`. `check-template-staleness.sh --auto-upgrade` and `heal-spec-docs.cjs` both stamp a template version onto documents that never came from it. That breaks the never-invent-history rule the operator set.
- **The pre-v4 path exists but nobody can reach it.** `upgrade-legacy.mjs` already does dry run, fail-closed apply, per-packet recorded debt in `upgrade-baseline.json` and v3 layout detection. No command, hook or workflow calls it, and `/doctor:update` only covers `.skilled/`, while its route manifest binds the phrase "spec-kit version migration".
- **The CI rebuild job needs hardening.** It keeps a ruleset-bypass token in `.git/config` while it runs repository code on any push to `main` or `skilled/**`. It stages one of the four files the generator writes. It runs without `set -e`, and it builds from the event SHA without a rebase retry.

The top five fixes are all small (S) and stop new failures at their source: fix the template anchor, finalize phase scaffolds, settle the archive policy and re-derive on move, harden the rebuild workflow and stop the healer writing judge-rejected phrases. Section 11 ranks 16 recommendations.

---

## 2. Method and evidence base

- **Run shape.** One fan-out, three concurrent lineages, 15 iterations each with no early stop (`stopPolicy: max-iterations`), each lineage writing state through the append gateway into `lineages/<label>/`. A lead brief (`lineages/<label>/steer.md`) fixed the five Key Questions, the write scope and the citation format.
- **Evidence read.** The branch commits `4b33313bd4c` to `d727cf94fe1` (`git log origin/main..HEAD`), the phase packets `006` to `013` of `034-spec-folder-tooling`, Phase 13's one-off scripts, 43 lane briefs and rule-by-rule failure reports in the orchestrating session's scratchpad, the spec CLI, the validator, the templates, `/doctor:update`, `/doctor:speckit`, the git hooks and the CI workflows.
- **Concurrency.** Phase 13's repair lanes edited `specs/` during the whole run. Corpus counts from the working tree are snapshots and say so.
- **Orchestrator review.** The orchestrator read every iteration file as it landed, re-read each load-bearing citation and recorded 47 verification notes. One mid-run steer (Section 14) pointed the two running lineages at five unexamined areas, phrased as questions.
- **Not run.** No repair tool, validator sweep, test or git write ran against the corpus. Every claim about tool behavior comes from reading source, tests and recorded reports.

---

## 3. What the branch changed

| Commit | Change | Files |
|--------|--------|-------|
| `4b33313bd4c` | Review and research of the series parent rule | 147 |
| `4af470d1531` | Series parent in every Gate 3 menu, `GATE_3_CHOICE_*` constants, the trigger-index rebuild workflow and advisory checks | 79 |
| `bdd678bccff` | Template trigger phrases replaced in 375 packets | 898 |
| `01b0773d067` | Rebuild pushes with a fine-grained token | 6 |
| `5e4164bfac9` | Every template's default phrases cleaned: `create.sh` seeder, census, cleanup, `phrase-judge.mjs` sets, tests | 7 |
| `7fe1cbeda87` | Template default phrases removed from live packets | 1,856 |
| `b36842de3c1` | 21 packets that failed strict validation repaired by hand | 67 |
| `d727cf94fe1` | Phase 12 closed, trigger index rebuilt | 26 |

The two Claude 5.5 roster commits (`75c78afa045`, `e9935e99bbc`) touch no spec tooling. Phase 13 is uncommitted: a baseline over 4,371 packets found 2,046 failing strict validation (1,935 of 2,198 archived, 111 of 2,173 live) plus 37 non-packet folders [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60]. Scripts cleared the derivable classes, and 43 lane briefs carrying one identical nine-rule playbook took the 474-folder long tail (the orchestrator hashed all 43 briefs after normalizing the batch number: one digest).

---

## 4. Failure-class taxonomy

Rule occurrences in the baseline report (`all-detail.txt`, 2,083 folder headings = 2,046 packets plus 37 non-packets) and in the latest report (`detail3.txt`, 474 folders). Occurrences are not packets: one missing Level 2 document pair is reported under both `FILE_EXISTS` and `LEVEL_MATCH` [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-002.md:7].

| Class | Rules | Baseline | Latest | Producer (Section 5) |
|-------|-------|----------|--------|----------------------|
| Recorded path drift | `METADATA_DISK_PATH_CONSISTENCY`, `GRAPH_METADATA_CHILD_IDENTITY` | 2,898 and 260 | near 0 | Archive and restore moves, unsaved scaffold pointers |
| Anchor structure | `ANCHORS_VALID` | 510 | 235 | Pre-anchor documents (392 "no anchors found"), duplicate template copies, the nested `questions` template |
| Links and doc integrity | `SPEC_DOC_INTEGRITY` | 417 | 62 | Relative links broken by the extra archive depth, stale Spec Folder rows |
| Missing or thin documents | `FILE_EXISTS`, `LEVEL_MATCH`, `SPEC_DOC_SUFFICIENCY` | 180, 180, 261 | 131, 131, 108 | Packets older than their level's document set |
| Frontmatter and phrases | `GREP_CONVENTION`, `FRONTMATTER_VALID` | 195 and 95 | 152 and fewer | Documents with no frontmatter, uppercase basenames, single-token phrases |
| Template provenance | `TEMPLATE_SOURCE` | 99 | 76 | Documents with no marker at all (a version is never compared) |
| Generated metadata | `GENERATED_METADATA_INTEGRITY` | 119 | low | Stub `graph-metadata.json` from phase scaffolds, stale fingerprints |

---

## 5. Q2: what causes each failure class at the source

**5.1 Archive and restore moves (path drift).** `archive.sh` copies to a temp directory under `z_archive/`, renames it, deletes the source and then calls only `refresh_track_root` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:294]. `restore_spec` has the same shape [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:403]. Nothing re-derives the moved packet's recorded paths (the `description.json` `specFolder`, the `graph-metadata.json` `spec_folder` and `packet_id` and the frontmatter `packet_pointer`), which `METADATA_DISK_PATH_CONSISTENCY` compares against the real path [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99]. The extra directory level also breaks relative links (`README.md` to `../README.md`) and leaves child identities stale. Phase-parent `children_ids` are deliberately not pruned ("a reviewed prune") [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:296]. Confirmed by all three lineages and by the orchestrator.

**5.2 The nested `questions` anchor.** `templates/core/spec.md.tmpl` opens `<!-- ANCHOR:questions -->` at line 184, before the `level:2,3,3+` block, and closes it at line 399 (levels 1, 2, 3) or 425 (level 3+) [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:399]. A Level 2 render nests `nfr`, `edge-cases` and `complexity` inside it [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt:128]. Three checkers miss it:
- `ANCHORS_VALID` is computed in `validateAnchorIntegrity`, which collects opens and closes as id lists and flags only no anchors, a duplicate open, an open never closed and a close never opened [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692]. `validation-rules.md` still documents "No nesting" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:389] and the registry promises "order" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:109].
- `parseAnchoredSections` in `template-structure.js` jumps past a whole anchor once it finds its close, so the nested sections never appear in the template-derived contract [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js:462].
- The golden snapshot test renders every level and pinned the nested layout as the expected Level 2 output [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:1211].

So a fresh scaffold passes `ANCHORS_VALID`, but anchor-based retrieval and merges return the wrong region. 549 spec.md files carry the layout (405 live, 144 archived, working tree count).

**5.3 Phase scaffolds skip graph derivation.** In `--phase` mode `create.sh` writes heredoc stubs for the parent and each child, then `exit 0` at line 1919, before the backfill at about lines 2006 to 2021 that root scaffolds reach [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919]. The stub has no `source_fingerprint`, and a byte copy of this packet's own fresh scaffold fails strict validation with `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` (orchestrator probe outside the repo). `scaffold-passes-its-own-gate.vitest.ts` covers root scaffolds for levels 1 to 3, not `--phase`. Full post-create validation runs only with `SPECKIT_POST_VALIDATE=1` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1226]. The orchestrator found this first, and Codex confirmed it independently after the steer [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-012.md:4].

**5.4 Scaffold pointers that are never saved.** A fresh document carries `packet_pointer: "scaffold/<slug>"` as a not-yet-filed marker [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/implementation-summary.md.txt:9]. A packet that never gets a save or a repair keeps a pointer that is not its path. `bdd678bccff` records that a re-derive "also replaced 18 leftover scaffold packet pointers".

**5.5 Old document generations.** Pre-anchor documents (392 "no anchors found"), documents with no frontmatter (tasks.md 22, plan.md 22, spec.md 12, implementation-summary.md 9 in `detail3.txt`), packets older than their level's document set and drifting header spellings (three names for the implementation summary, `impl-summary-core`, `implementation-summary-core` and `implementation-summary`, plus `resource-map` v1.1 outnumbering v2.2 by 249 to 134 occurrences). `TEMPLATE_SOURCE` checks only that a marker exists in the first 60 lines, never its version [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:58], so an old version is not a failure and `MIGRATION.md` keeps legacy markers readable indefinitely [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24].

**5.6 Healers and checkers that disagree.** `heal-spec-docs.cjs` `TEMPLATE_DEFAULTS` holds the plan, tasks and implementation-summary phrase quartets [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:45], which `phrase-judge.mjs` grades `template-default` ("placeholder trigger phrases, which name no topic") [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:121]. The healer fills only empty lists, and `upgrade-legacy.mjs` runs it with `--apply` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]. So an old packet with an empty list comes out of the upgrade carrying phrases the convention rejects. The cleanup's normal path seeds a non-empty slug list, so it does not empty lists itself [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-011.md:5]. The three-way pin test covers templates, judge sets and `create.sh` arrays [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:224]. `heal-spec-docs.cjs` is the unpinned fourth copy with no test of its own.

**How to stop new instances.** Fix each producer (5.1 to 5.4 and 5.6) rather than healing downstream. The heal tools already exist, and nothing currently stops the template, the phase scaffold or the archive move from minting new failures. Devin's ranking rule holds: a source fix outranks a sink fix [SOURCE: research/lineages/devin-swe-2-max/iterations/iteration-015.md:6].

---

## 6. Q1: which one-off fixes become permanent tooling, and where

| One-off (Phase 13) | What it does | Permanent owner | Gap to close |
|--------------------|--------------|-----------------|--------------|
| `fix-specfolder.mjs` | Rewrites `description.json` `specFolder` from disk | `migrate-generated-json.ts` `regenDescriptionScoped`, already a step in `upgrade-legacy.mjs`, which regenerates the whole description from disk and walks `z_archive` on purpose [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:25] | `repair-derived.cjs` does not write `specFolder` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:84], so the archive post-move step must call the description generator too |
| `add-fm-fields.mjs` | Fills `importance_tier` and `contextType` from the packet's spec.md, no dry run | `upgrade-legacy.mjs` `fill-frontmatter` step, which never rewrites a value it has [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:313] | Value source order. The lead ruling is the document class's template literal first and the spec.md copy only where the template leaves the field to the author, because `goal.md` uses `important` and `planning` |
| `fix-dup-anchors.mjs` | Deletes stray glued template pairs, numbers isolated duplicates, reports the rest | None. No pipeline step edits anchors | A new anchor-repair mode, fixed first: dry run writes nothing (today it always writes a leftovers TSV), suffix collision check, atomic write, fence-aware pairing |
| Lane rules 2, 4, 6, 8, 9 | Anchor wrap, link repoint-or-unlink, continuity placeholders, level from the packet's own docs, missing template header | `heal-spec-docs.cjs` modes plus `upgrade-legacy.mjs` steps | Each needs a "refuse when not derivable" rule and a second-run-is-zero test |
| Lane rule 3 | Missing document reconstructed from spec.md and git history with a dated note and "Not recorded" | Stays reviewed lane work | Offer exact git restoration when one unique blob exists, keep a reconstruction only when it passes validation, otherwise record `FILE_EXISTS` in `upgrade-baseline.json` |
| Lane rule 7 | implementation-summary status follows spec.md | Stays reported | It changes an authored assertion, so a "prose never changes" contract cannot automate it without carving status out explicitly |
| `val-one.sh`, `val-detail.sh`, `fix-queue.sh` | Worker pool and `### folder / x RULE` grouped report | `upgrade-legacy.mjs` (validate-all with a pool) | A grouped-detail report mode, since `validate.sh --json` already carries the data |

The census and cleanup pair is the reference shape every permanent repair should copy. It reads defaults from the source templates, shows an exact dry run, writes only under `--apply` and treats "second run reports zero" as the idempotence gate. Phase 11 and Phase 12 both proved that gate at corpus scale [SOURCE: specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md:77].

The operator's three Q1 examples:
- **Widening `repair-derived.cjs`'s allow-list.** Partly right. Its refusal boundary (derived facts only) is the correct one, but `specFolder` belongs to the description generator, and anchors are not derived facts. Widen it only for the archive scope once Section 7.4's decision is made.
- **An anchor repair mode.** Confirmed as the largest unowned capability.
- **A template-phrase reseed on archive.** Rejected for now. The cleanup excludes archives by default and the archive policy is unsettled. Reseeding at move time would edit an archived document's metadata as a side effect of moving it [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-011.md:6].

---

## 7. Q3: detecting and healing older or pre-v4 repos

**7.1 What already exists.** `upgrade-legacy.mjs` is the shipped no-model upgrade for trees "written under v3.x" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113]:
- It validates every packet and repairs only failing, non-archived packets in a fixed order: fill-frontmatter, heal-spec-docs, repair-derived, migrate-generated-json.
- It refuses `--apply` entirely when any first validation is unreadable [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:478].
- It never records a packet that a repair step broke.
- It records leftovers in a per-packet `upgrade-baseline.json`, which the validator reads to turn exactly the listed findings into warnings while anything new stays an error [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:930].
- It detects a v3 `.opencode/specs` home and stops with the move recipe before any write [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:151].

Tests pin all of this, including "only records an archived packet and never rewrites its documents" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:206].

**7.2 Why external users never meet it.** Nothing calls it: rg finds it only in itself, its README, its tests and a changelog. `/doctor:update` is a release engine scoped to `.skilled/` units (`root`, `skill`, `command`, `directory`) with no spec-corpus step [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:129]. Its route still carries the trigger phrase "spec-kit version migration" [SOURCE: .skilled/commands/doctor/_routes.yaml:312]. The release apply writes `rollback.json` before the first target write and limits rollback to its plan's units [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-010.md:6], so a specs move or corpus repair cannot ride inside that transaction.

**7.3 Detection by evidence, not a version string.** "Pre-v4" is several independent eras:
- the v3 layout (`.opencode/specs` as a real directory)
- documents with no frontmatter
- documents with no or legacy template markers, under drifting header names
- packets with no generated metadata
- packets older than their level's document set

Each signal already exists in a different tool with a different output shape [SOURCE: research/lineages/devin-swe-2-max/iterations/iteration-009.md:7]. One read-only report should combine them, normalize header names through an alias table and route each class to the stage that owns it. It should use one shared packet classifier with an explicit exclusion list. A raw `find` over `specs/` counted this run's own containment copies and inflated the archived directory count from 2,281 to 8,198 [SOURCE: research/lineages/pi-deepseek-flash-max/iterations/iteration-010.md:10].

**7.4 The archive decision (Logic-Sync).** The tools disagree:

| Tool | Archive behavior | Evidence |
|------|------------------|----------|
| `archive.sh` | Moves and leaves recorded paths stale | archive.sh:277 |
| `repair-derived.cjs` | Frozen: rewriting the recorded location "destroys the very thing the copy was kept to preserve" | repair-derived.cjs:386 |
| `heal-spec-docs.cjs` | Skips `z_archive` in discovery, but `--folder` bypasses that | heal-spec-docs.cjs:40, :189 |
| `migrate-generated-json.ts` | Rewrites archives "like any other track" | migrate-generated-json.ts:25 |
| `upgrade-legacy.mjs` | `--include-archive` validates and records, never repairs | upgrade-legacy.mjs:491 |
| Validator | Fails archived packets on current-path rules | check-metadata-disk-consistency-helper.cjs:1 |
| Phase 13 | Rewrites archived paths so every packet passes | 013 spec.md:63 |

The orchestrator's recommendation is current-location semantics: recorded paths are derived facts, and git history keeps provenance. The deciding facts are three:
- Phase 13 has already moved most of the corpus to that state.
- The validator demands it.
- A recorded path is reproducible from disk, unlike prose.

Under that choice, `archive.sh` re-derives at move time and `repair-derived.cjs` gains an archive scope limited to derived fields. The frozen-tree comment, `README-repair-derived.md` section 6 and `upgrade-legacy.mjs`'s header and test change together. The alternative, snapshot semantics, keeps every tool's freeze, makes the validator exempt `z_archive` from the current-path rules and amends Phase 13's acceptance target. This is the operator's call (Section 12).

**7.5 The safe path for an external repo.**
1. `/doctor:update check` gains a read-only compatibility section: layout, the era report, an `upgrade-legacy` dry-run summary and the exact error-to-warning transitions a baseline would create.
2. A separate, explicitly approved action, not part of release apply or its rollback, runs the layout move (still the printed recipe, or a previewed mode with a path map and collision check). It then runs `upgrade-legacy --apply` after the current tooling is installed.
3. `upgrade-legacy --apply` requires a committed tree or writes a before-image manifest. A mandatory clean tree alone would have blocked Phase 13's own concurrent repair [SOURCE: research/lineages/devin-swe-2-max/iterations/iteration-014.md:6].
4. Provenance stays honest: no tool stamps a template version or reconstructs a document without exact evidence. Unknowns are recorded, not invented.

This keeps the operator's constraints: dry run first, idempotent (a second run is a no-op and an identical baseline is not rewritten), reversible (git plus the baseline file, whose deletion re-raises its errors) and no change to what a document says.

---

## 8. Q4: hardening this branch's own changes

**8.1 The trigger-index rebuild job** (`.github/workflows/trigger-index-rebuild.yml`):
- **Token exposure.** Checkout receives `secrets.TRIGGER_INDEX_PUSH_TOKEN`, a ruleset-bypass actor's token, with credential persistence at its default, and then runs `generate-trigger-index.mjs` from the pushed commit [SOURCE: .github/workflows/trigger-index-rebuild.yml:32] [SOURCE: .github/workflows/trigger-index-rebuild.yml:39]. The job triggers on `main` and `skilled/**` [SOURCE: .github/workflows/trigger-index-rebuild.yml:8], and `workflow_dispatch` has no branch filter. If `skilled/**` branches are less protected than `main`, a push there runs code beside a token that can bypass the `main` ruleset (INFERRED, branch protection not checked). Fix: `persist-credentials: false`, generate with no credential present, inject the token only into the push step, scope the secret to an environment limited to `main` and document the token's scope and rotation.
- **Incomplete commits.** The generator writes four tracked files, and the job diffs and stages only `trigger-index.json` [SOURCE: .github/workflows/trigger-index-rebuild.yml:44]. Stage all four and add a post-commit `--check`.
- **Silent green.** `set -uo pipefail` has no `-e` and the commit is unchecked, so a failed commit still pushes nothing and exits 0 [SOURCE: .github/workflows/trigger-index-rebuild.yml:43].
- **Race.** Checkout uses the event SHA and the push has no fetch-and-rebase retry, while the error text always blames the ruleset [SOURCE: .github/workflows/trigger-index-rebuild.yml:56]. Build at the branch tip, retry once and name non-fast-forward separately.
- **Loop guard.** The guard keys on the commit subject, so renaming the subject reopens the loop [SOURCE: .github/workflows/trigger-index-rebuild.yml:24].

**8.2 The cleanup tools.** `template-phrase-cleanup.mjs` writes with `fs.writeFileSync` while `repair-derived.cjs` writes atomically [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:420]. `TARGET_KINDS` covers five document kinds while 18 template files carry `trigger_phrases` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:32]. Documents skipped for missing frontmatter (21 in Phase 12) were routed to `fill-frontmatter` by hand.

**8.3 The seeder.** The phrase lists are triplicated across templates, `phrase-judge.mjs` and `create.sh`, and that is defended by a three-way pin test. The undefended copy is `heal-spec-docs.cjs` (5.6). The phase-parent template gets inline slug phrases outside `replace_template_default_trigger_phrases` [SOURCE: research/lineages/codex-luna-6-max-fast/iterations/iteration-012.md:5].

**8.4 Gate 3 wording.** `spec-gate-core.mjs` holds three wordings of option C, and the menus inline text instead of using `GATE_3_CHOICE_RELATED` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:151] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:158]. At least 12 short menus in presentation assets and compiled contracts drop "in the same track", which the series-parent rule requires [SOURCE: .skilled/commands/speckit/assets/speckit-plan-presentation.txt:73].

**8.5 Provenance stamping.** `check-template-staleness.sh --auto-upgrade` bumps the version token of any older marker in seven document kinds with no structural check [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:181]. That contradicts `MIGRATION.md` ("Do not rewrite old packets only to normalize marker style"). Its BSD-only `sed -i ''` is silenced by `|| true`, so on GNU sed it does nothing (INFERRED from GNU semantics, not run). `heal-spec-docs.cjs` stamps `v2.2` when a document carries a superset of a signature's anchors, although its comment claims "exactly these anchors" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:80].

---

## 9. Q5: which checks belong in CI or pre-commit

What exists is sound. Pre-commit re-mints derived metadata for staged packets [SOURCE: .skilled/scripts/git-hooks/pre-commit:535]. Pre-push guards the pushed tree. `changed-packet-validation.yml` blocks regressions against the merge base and fails closed [SOURCE: .github/workflows/changed-packet-validation.yml:48]. Advisory checks report trigger-index drift. The weekly sweep reports the corpus. The gaps:

| Check | Placement | Why there |
|-------|-----------|-----------|
| Render every level of every core template and assert anchor pairing, order and no nesting | `spec-kit-check.yml` test suite (extend `scaffold-golden-snapshots.vitest.ts`) | Deterministic and cheap. The existing snapshot test checks identity, which is how the nesting got in |
| `create.sh --phase` scaffold passes its own strict gate | Same suite (`scaffold-passes-its-own-gate.vitest.ts`) | Covers root scaffolds only today |
| Compare failing rule sets, not verdicts, for packets that already fail at base | `changed-packet-validation.yml` | A packet failing one rule at base and three at head passes as "pre-existing" today [SOURCE: .github/workflows/changed-packet-validation.yml:139] |
| Pass `--baseline` to the weekly sweep | `strict-pass-freshness-report.yml` | The regression warning reads a baseline that is never passed [SOURCE: .github/workflows/strict-pass-freshness-report.yml:56] |
| Era report and per-class counts | Weekly sweep or advisory suite | Corpus-wide work costs minutes and is a report, not a gate |
| Phrase-judge lint on staged frontmatter | Pre-commit | Pure read plus regex, within the hooks' quarter-second budget [SOURCE: research/lineages/devin-swe-2-max/iterations/iteration-013.md:7] |
| Strict validation of staged packets | Pre-commit, capped at about 20 packets and only when the validator's build is present and fresh, otherwise warn and pass | A stale build would otherwise block every spec commit [SOURCE: research/lineages/devin-swe-2-max/iterations/iteration-014.md:8] |
| Gate 3 wording parity across constants, presentation assets and compiled contracts | Runtime hook test suite | 12 copies already drifted |
| Trigger-index sidecar freshness | Inside the rebuild job and the advisory `--check` | Today only the index is compared |
| Healer output never graded negative by the judge | `upgrade-legacy.vitest.ts` | Pins 5.6 |

---

## 10. Orchestrator verification

The orchestrator re-read each load-bearing citation. Claims that changed standing:

| Claim (lineage, iteration) | Standing | What the orchestrator read |
|----------------------------|----------|----------------------------|
| The nested `questions` anchor makes every new Level 2 or 3 packet fail `ANCHORS_VALID` (Pi 4, Devin 3) | Refuted | `orchestrator.ts:692` does not check nesting or order. A byte copy of a fresh scaffold passes `ANCHORS_VALID` and fails only on generated metadata. Pi refuted itself in iteration 14 |
| The template's two `questions` closers produce an orphaned close (Devin 14, 15, rank 1) | Refuted | `inline-gate-renderer.ts:126` matches levels exactly, so the `1,2,3` closer (399) and the `3+` closer (425) never render together. The live defect is the nesting, so Devin's "one closer per level" fix changes nothing |
| `--include-archive` makes `upgrade-legacy` repair archives (Pi 9, R-018, R-025) | Refuted | The repair filter is `!packet.archived` (`upgrade-legacy.mjs:491`), and a test pins record-only |
| No workflow or hook renders the templates (Pi 13) | Downgraded | `scaffold-golden-snapshots.vitest.ts` renders them but asserts identity |
| 74 archived packets lack `description.json` (Pi 10) | Downgraded | 82 numbered archive directories lack it. 79 of them have no spec.md and 3 are packets |
| `fix-dup-anchors.mjs` writes LF line endings (Codex 14) | Downgraded | Lines split and re-join on `\n`, so `\r` survives |
| A stale `specFolder` breaks `completion-state.cjs` (Devin 14) | Downgraded to inferred | `resolveSpecFolder` resolves the string its caller passes, and no caller reading `description.json` was traced |
| Phase 13 repaired 1,935 archived packets (Devin 4) | Corrected | 1,935 failed at baseline, and the repair is in progress |
| `heal-spec-docs` restores judge-rejected phrases (lead, then Codex 11) | Confirmed | `heal-spec-docs.cjs:45`, `phrase-judge.mjs:121`, `upgrade-legacy.mjs:392` |
| Phase scaffolds skip graph derivation (lead, then Codex 12) | Confirmed | `create.sh:1919` before about lines 2006 to 2021, and the scaffold probe |
| The rebuild token sits in git config while repository code runs (lead, Devin 10, Codex 13) | Confirmed | `trigger-index-rebuild.yml:29` to `:39` |
| 43 lane briefs share one playbook over 474 folders (Devin 7) | Confirmed | One md5 after normalizing the batch number, 474 unique folders |
| The three-way phrase pin exists (Devin 11) | Confirmed | `create-root-numbering.vitest.ts:212` to `:324`. It corrected the orchestrator's earlier note |
| Verdict-only regression compare and the inert sweep baseline (Devin 12, 13) | Confirmed | `changed-packet-validation.yml:131` to `:147` and `strict-pass-freshness-report.yml:56` |
| The Gate 3 short menus drop "same track" (Codex 13) | Confirmed | 12 presentation and contract files |
| `TEMPLATE_SOURCE` ignores the marker version (Codex 5) | Confirmed | `check-template-source.sh:58` |

---

## 11. Recommendations (ranked, highest value first)

Effort: S under a day, M one to three days, L more. Every recommendation is idempotent unless it says otherwise, reverses by reverting its commit and changes no authored prose unless the last column says so.

| Rank | ID | Recommendation | Q | Where it lives | Effort | Risk | Evidence | Changes what a document says? |
|------|----|----------------|---|----------------|--------|------|----------|-------------------------------|
| 1 | SH-01 | Move the `questions` opener in `core/spec.md.tmpl` to just above each level's Open Questions heading and regenerate the Level 2, 3 and 3+ golden snapshots. Add a pairing, order and no-nesting assertion to the snapshot test for every level | Q2, Q5 | `templates/core/spec.md.tmpl`, `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` and its `.snap` | S | Low. New scaffolds only. Retrieval regions become correct | 5.2, V1, V30, V44 | No |
| 2 | SH-02 | Run the graph-metadata derivation for the phase parent and every child before `create.sh --phase` exits and refresh the parent's `children_ids`. Add a `--phase` case to `scaffold-passes-its-own-gate.vitest.ts` | Q2, Q4, Q5 | `runtime/cli/spec/create.sh`, that test | S | Low. Fails clearly if the deriver is missing | 5.3, V20 | No |
| 3 | SH-03 | Decide the archive policy (7.4), then make `archive.sh` and `restore_spec` re-derive the moved packet's description, graph metadata and pointer. Align `repair-derived.cjs` `FROZEN_TREES`, `README-repair-derived.md` section 6, `upgrade-legacy.mjs` and its archive test with the decision. Add an archive-then-validate fixture test | Q1, Q2, Q3 | `archive.sh`, `repair-derived.cjs`, `README-repair-derived.md`, `upgrade-legacy.mjs`, tests | M | Med. Changes verdicts for about 2,200 archived packets either way | 5.1, 7.4, V2, V25, V35 | No. Derived path fields only |
| 4 | SH-04 | Harden `trigger-index-rebuild.yml`: `persist-credentials: false`, no credential while the generator runs, token only in the push step, secret in an environment limited to `main`, `set -euo pipefail`, stage all four outputs, post-commit `--check`, build at branch tip with one rebase retry and a distinct non-fast-forward message | Q4, Q5 | `.github/workflows/trigger-index-rebuild.yml`, `.github/workflows/README.md` | S | Low. CI only | 8.1, V7, V18, V32 | No |
| 5 | SH-05 | Stop `heal-spec-docs.cjs` writing judge-rejected phrases: seed empty lists with the shared slug seeder (or record instead of refilling), drop `TEMPLATE_DEFAULTS` or pin it in the three-way test. Add a test that the upgrade output is never graded `template-default` | Q1, Q4 | `heal-spec-docs.cjs`, `create-root-numbering.vitest.ts`, `upgrade-legacy.vitest.ts` | S | Low | 5.6, V4b, V5b | Trigger metadata only |
| 6 | SH-06 | Make provenance stamping evidence-gated: retire `check-template-staleness.sh --auto-upgrade` (or require the exact anchor set and report otherwise), make `heal-spec-docs.cjs` require exact signature equality and keep markerless or old-marker documents as recorded unknowns | Q3, Q4 | `check-template-staleness.sh`, `heal-spec-docs.cjs`, `templates/MIGRATION.md` | S | Low. More documents stay "unknown provenance" by design | 8.5, V27, V33, V36 | No. It removes a history-inventing write |
| 7 | SH-07 | Fix the CI gates: compare failing rule sets instead of verdicts in `changed-packet-validation.yml` and pass `--baseline` (the previous artifact) to the weekly sweep | Q5 | `.github/workflows/changed-packet-validation.yml`, `strict-pass-freshness-report.yml` | S | Low. The weekly stays report-only | 9, V40, V41 | No |
| 8 | SH-08 | Wire the external-user path: a read-only compatibility section in `/doctor:update check` (layout, era report, `upgrade-legacy` dry-run summary and error-to-warning transitions) plus a separate approved action that runs the layout move and `upgrade-legacy --apply` outside the release transaction | Q3 | `.skilled/commands/doctor/` (`update.md`, `doctor-update-check.yaml`, a new action YAML, presentation), `upgrade-legacy.mjs` | M to L | Med. A wrong path map can strand a repo, so preview, collision check and path map are mandatory | 7.2, 7.5, V6, V15, V26 | No for detection. Structure and derived fields for apply |
| 9 | SH-09 | Build the era report as one read-only module with a shared packet classifier, an exclusion list (research lineages, containment, scratch, changelog) and a header alias table. Use it from doctor, the weekly sweep and `upgrade-legacy`'s preflight | Q3, Q5 | New `runtime/cli/spec/repo-era.mjs` (or `upgrade-legacy --detect`) | M | Low. Read-only | 7.3, V28, V29 | No |
| 10 | SH-10 | Give `upgrade-legacy --apply` a reversibility record (a committed tree or a before-image manifest) and make its dry run list every finding a baseline would downgrade | Q3 | `upgrade-legacy.mjs` | S to M | Low | 7.5 | No |
| 11 | SH-11 | Promote `fix-dup-anchors.mjs` into an anchor-repair mode (dry run writes nothing, collision-checked suffixes, atomic write, fence-aware pairing, ambiguous cases reported). Include the un-nesting of the old `questions` layout (549 files) as a recognized marker-only move | Q1, Q2 | `heal-spec-docs.cjs` mode plus an `upgrade-legacy.mjs` step | M | Med. Marker boundaries carry retrieval meaning, so only exact patterns move | 6, V45, V46 | Marker lines only. Prose untouched |
| 12 | SH-12 | Fold the remaining one-offs: archive and single-folder repairs call the description generator for `specFolder`, `fill-frontmatter` takes the document class's template literal before a spec.md copy, `fix-specfolder.mjs` and `add-fm-fields.mjs` retire and `upgrade-legacy` gains a grouped-detail report | Q1 | `upgrade-legacy.mjs`, `archive.sh` | S | Low | 6, V31, V36 | Frontmatter fields only |
| 13 | SH-13 | Align the anchor contract: decide whether `ANCHORS_VALID` checks order, nesting and duplicate closers, then make the code, the registry description and `validation-rules.md` agree. Baseline the corpus before tightening, since it regrades packets | Q2, Q5 | `runtime/lib/validation/orchestrator.ts`, `validator-registry.json`, `references/validation/validation-rules.md` | M | Med to High. Tightening fails historical packets | 5.2, V24b, V24c | No |
| 14 | SH-14 | Render every Gate 3 menu from the `GATE_3_CHOICE_*` constants, restore "in the same track" to the short menus and add a parity test across presentation assets and compiled contracts | Q4, Q5 | `spec-gate-core.mjs`, `.skilled/commands/**/assets/*-presentation.txt`, compiled contracts, hook tests | S to M | Low. Operator-facing wording | 8.4, V8, V42 | Command prompt wording only |
| 15 | SH-15 | Automate the deterministic lane rules as heal modes (link repoint-or-unlink with a unique target, continuity placeholders, level from the packet's own docs, header add on exact anchor match). Keep reconstruction verify-then-keep and status alignment reported | Q1, Q3 | `heal-spec-docs.cjs`, `upgrade-legacy.mjs` | M to L | Med. Touches many documents, so per-folder validation after apply is the control | 6, V22, V34 | Structure only. Reconstruction stays gated |
| 16 | SH-16 | Harden the cleanup family: atomic writes, add-on document kinds with seed recipes in the pin test, skipped no-frontmatter files routed to `fill-frontmatter` and a pre-commit phrase-judge lint on staged frontmatter | Q4, Q5 | `template-phrase-cleanup.mjs`, `template-phrase-census.mjs`, `.skilled/scripts/git-hooks/pre-commit` | M | Low to Med | 8.2, V39 | Trigger metadata only |

Order of work: SH-01, SH-02 and SH-04 are independent and can ship first. SH-03 waits on the archive decision. SH-05 and SH-06 should land before SH-08, so the doctor path never ships a healer that writes rejected phrases or invented provenance. SH-11 depends on SH-01 so the un-nesting target is the fixed template.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat the nested `questions` anchor as an `ANCHORS_VALID` failure and fix the validator report | The validator does not check nesting, so the failure claim was wrong. The defect is retrieval correctness plus a doc-versus-code gap | `orchestrator.ts:692`, scaffold probe | Pi 4, 14. Devin 3, 14 |
| "One closer per level" as the template fix | Each level already renders exactly one closer | `inline-gate-renderer.ts:126` | Devin 14, 15 |
| Reseed template phrases during archive or restore | Edits archived metadata as a move side effect while the archive policy is unsettled | Codex 11 | Codex 11 |
| Auto-stamp the current template version on old or markerless documents | Invents provenance and contradicts `MIGRATION.md` | `MIGRATION.md:24`, `check-template-staleness.sh:181` | Devin 5. Codex 5, 8 |
| Automate missing-document reconstruction | No tool can supply what a document said. A "Not recorded" skeleton can itself fail `SPEC_DOC_SUFFICIENCY` | Lane rule 3, Devin 14 F6 | Pi 6, 7. Devin 7, 14. Codex 7 |
| A mandatory clean tree before `upgrade-legacy --apply` | Would have blocked Phase 13's own concurrent repair. A committed tree or a before-image manifest is enough | Devin 14 F3 | Devin 8, 14 |
| Fail-closed strict validation in pre-commit | A stale or missing build would block every spec commit | `changed-packet-validation.yml` build steps | Devin 13, 14 |
| Put specs moves or corpus repair inside `/doctor:update apply` | The release engine's plan and rollback cover `.skilled/` units only | `release-update.cjs:129` | Pi 8. Devin 8. Codex 10 |
| Sum per-rule counts to estimate failing packets | One defect reports under two rules | `all-detail.txt` | Codex 2 |
| Convert phrase warnings to errors | Would force edits to author-declared phrases, which the judge refuses to rewrite | `phrase-judge.mjs` | Pi 5 |
| Copy `importance_tier` and `contextType` from spec.md for every document | Misclassifies documents whose template sets other values, such as `goal.md` | Codex 7 F1 | Devin 6. Codex 7 |
| A GitHub App token as the immediate fix for the rebuild push | Feasible but M effort. Scoping and not persisting the existing token gets most of the value at S | `01b0773d067` message | Devin 10, 14 |
| Treat the Claude 5.5 roster commits as spec tooling changes | They touch runtime roster files only | `git show --stat` | Codex 1 |

---

## Divergence Map

| Topic | Lineage positions | Orchestrator ruling |
|-------|-------------------|---------------------|
| Archive semantics | Devin: document "validated and baselined, never repaired". Pi: allow structural repair under `--include-archive`. Codex: choose snapshot or current-location first | No tool repairs archives today, and Phase 13 does. Choose explicitly (7.4). The recommendation is current-location |
| Template anchor defect | Pi and Devin first called it a validator failure, then both self-corrected. Devin ended on a double-closer theory. Codex named the parser that hides it | Nesting is the live defect. The double closer is a maintenance hazard only |
| `--auto-upgrade` provenance | Devin: invents history for old markers. Codex: avoids inventing it for markerless documents | Both hold for their case. The old-marker bump is the one that writes, so it goes |
| Frontmatter value source | Devin: copying from spec.md is an advantage. Codex: it misclassifies | Template literal per document class first, spec.md copy only where the template leaves the field to the author |
| Where `specFolder` repair lives | Devin: add it to `repair-derived.cjs`. Pi: `migrate-generated-json.ts` already owns it | Owner exists. The archive post-move step must call it, and `repair-derived.cjs` stays scoped to its rederivable set |
| Rebuild token | Devin: an App token is the clean answer at M. Codex: scope the token to the push step. Lead: also keep it away from repository code and non-`main` triggers | Scoping first (S), App token as a later upgrade |

Saturated directions: the archive producer, the template anchor and the existing heal fleet (all three lineages). Pivots taken: one lead steer at 21:35 UTC (Section 14), which Codex followed in iterations 11 to 13. Remaining frontier: Section 12.

---

## 12. Open questions

1. **Archive policy (operator decision).** Current-location semantics, which this synthesis recommends, or snapshot semantics with a validator exemption? Section 7.4 lays out both, and SH-03 waits on the answer.
2. **How protected are `skilled/**` branches?** The rebuild token risk depends on it, and this run did not check branch protection.
3. **Should `ANCHORS_VALID` tighten** to order and nesting (SH-13), knowing it regrades historical packets, or should the docs narrow to what the code checks?
4. **Is lane rule 7 (status follows spec.md) a derived fact?** If yes, it can be automated. If no, it stays a reported conflict.
5. **Does `--auto-upgrade` have any user** that relies on it? Nothing in `.skilled/` calls it, but external scripts might.

---

## 13. Ordered implementation plan

1. A follow-up packet for the source fixes: SH-01, SH-02 and SH-04, with their tests.
2. The operator answers question 1. Then SH-03 lands with its fixture test.
3. Healer honesty: SH-05 and SH-06.
4. CI precision: SH-07, then SH-14's parity test.
5. The external path: SH-09, SH-10, then SH-08.
6. Healing breadth: SH-11, SH-12, SH-15 and SH-16.
7. The contract decision, SH-13, last, after a corpus baseline.

---

## 14. Run record

| Lineage | Executor and model | Iterations | Duration | Attempts | Result |
|---------|--------------------|-----------|----------|----------|--------|
| `pi-deepseek-flash-max` | cli-pi, `opencode-go/deepseek-v4.1-flash`, thinking max | 15 of 15 | 2,652 s | 1 | `synthesis_complete`, `maxIterationsReached`, 5 of 5 answered |
| `devin-swe-2-max` | cli-devin, `swe-2-max` | 15 of 15 | 3,867 s | 1 | `synthesis_complete`, `maxIterationsReached`, 5 of 5 answered |
| `codex-luna-6-max-fast` | cli-codex, `gpt-6-luna`, reasoning max, fast tier | 15 of 15 | 4,815 s | 1 | `synthesis_complete`, `maxIterationsReached`, 5 of 5 answered |

- **Failures.** None. `orchestration-summary.json` reports 3 succeeded, 0 failed and every failure class at 0. There were no retries and no timeouts.
- **Containment.** Each lineage's terminal check listed out-of-scope changes (Pi 208, Devin 273, Codex 334, 370 unique paths), every one `preserved_in_head` or `preserved_untracked`, none reverted. 369 of the 370 sit inside folders on Phase 13's lane lists. The last, `specs/.backfill-graph-metadata-prune-report.json`, is a re-derive side effect. The parent `034` `graph-metadata.json` gained `013` and `014` in `children_ids` during the run through a `graph_only` re-derive. `034` is itself on a lane list, so the change is attributed to a lane (INFERRED, no lineage iteration shows a write command). The detector cannot tell a lineage write from a concurrent lane write in a shared checkout.
- **Steer.** At 21:35 UTC the lead appended five questions to the Devin and Codex steer files: the healer versus judge phrase lists, `create.sh --phase` control flow, the rebuild token's lifetime, generator outputs versus staging and where `ANCHORS_VALID` is computed. Pi had finished. Codex confirmed three of the five independently in iterations 11 to 13.
- **Presentation defects.** Codex iteration files print each Recommendations and Ruled Out header and row twice, and some scratchpad citations replace the hyphens in the scratchpad path with slashes. Line numbers still resolve.

---

## 15. References

- Lineage outputs: `lineages/pi-deepseek-flash-max/research.md`, `lineages/devin-swe-2-max/research.md`, `lineages/codex-luna-6-max-fast/research.md` and their `iterations/` and `deltas/`.
- Merged registry: `findings-registry.json` (74 key findings), `fanout-attribution.md`.
- Resource map: `resource-map.md`, emitted from 45 lineage delta files.
- Scaffold evidence: `scaffold-sample/*.txt`, a byte copy of this packet's docs exactly as `create.sh` produced them.
- Phase 13 inputs (session scratchpad, not in the repo): `fix-specfolder.mjs`, `add-fm-fields.mjs`, `fix-dup-anchors.mjs`, `fix-lanes/batch-NN.task`, `all-detail.txt`, `detail3.txt`.

---

## 16. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 45 (15 per lineage)
- Questions answered: 5 / 5
- Remaining questions: none of the five Key Questions. Five operator-level questions remain in Section 12
- Last 3 iteration summaries: Pi 15 ranked table (0.3), Devin 15 ranked table (0.4), Codex 15 final synthesis (0.05)
- Convergence threshold: 0.05
- Divergence summary: one lead steer, three self-corrections (Pi 14, Devin 14, Codex 14), six divergences ruled in the Divergence Map
- Convergence signals: no lineage emitted a convergence or stop-vote event. New-information ratios stayed between 0.7 and 1.0 through iteration 14 in every lineage (Pi 0.75 to 1.0, Devin 0.7 to 0.95, Codex 0.95 to 1.0) and fell only on each lineage's final ranking iteration. Under the default rule no lineage would have stopped early, so the max-iterations policy did not cut a converging run short.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

---

## 17. Appendix: orchestrator verification notes

The V-numbers cited in Section 11 refer to these notes. Each is something the orchestrator read itself. Working-tree counts were taken while Phase 13's lanes were editing `specs/`.

| ID | Observation | Source read |
|----|-------------|-------------|
| V1 | The `questions` anchor opens at line 184, before the `level:2,3,3+` block, and closes at 399 or 425. Same lines on `origin/main` | `templates/core/spec.md.tmpl:184`, `:399`, `:425` |
| V2 | `archive.sh` moves with `cp -R`, `mv` and `rm -rf` and refreshes only the track root. Baseline path drift sits almost entirely under `z_archive` | `runtime/cli/spec/archive.sh:269` to `:294`, `all-detail.txt` |
| V4b | `heal-spec-docs.cjs` restores exactly the phrases `phrase-judge.mjs` grades `template-default`, and `upgrade-legacy.mjs` runs it with `--apply` | `heal-spec-docs.cjs:45`, `phrase-judge.mjs:121`, `upgrade-legacy.mjs:392` |
| V5b | The three-way pin (template block, judge set, `create.sh` array) exists. `heal-spec-docs.cjs` has no test and is referenced only by itself, `upgrade-legacy.mjs` and `spec/README.md` | `create-root-numbering.vitest.ts:212` to `:324`, rg |
| V6 | The release engine covers `.skilled/` units only and its follow-ups have no corpus step | `release-update.cjs:129` |
| V7 | The rebuild job checks out with the bypass token and no `persist-credentials: false`, then runs repository code | `trigger-index-rebuild.yml:29` to `:39` |
| V8 | Gate 3 option C has three wordings, and the menus inline text rather than using `GATE_3_CHOICE_RELATED` | `spec-gate-core.mjs:151`, `:158`, `:172` |
| V15 | `upgrade-legacy.mjs` is dry by default and ships with v4.0.0.1. Nothing in `.skilled/commands`, the hooks or `.github` calls it. The repo has zero `upgrade-baseline.json` files | rg, `.skilled/changelog/skilled/v4.0.0.1.md:57` |
| V18 | The generator writes three sidecars beside the index. The CI job diffs and stages the index only | `generate-trigger-index.mjs:35`, `trigger-index-rebuild.yml:44` to `:52` |
| V20 | `create.sh --phase` exits at line 1919, before the graph backfill at about 2006 to 2021, and a byte copy of this packet's fresh scaffold fails strict validation on generated metadata | `create.sh:1357`, `:1919`, scaffold probe |
| V22 | The lane brief encodes nine fix policies, several deterministic and one (reconstruction) not | `fix-lanes/batch-01.task` |
| V24b | `ANCHORS_VALID` flags no anchors, duplicate opens, unclosed opens and unopened closes. No order or nesting check | `runtime/lib/validation/orchestrator.ts:692` to `:735` |
| V24c | The registry describes the rule as checking order, and `validation-rules.md` forbids nesting | `validator-registry.json:109`, `validation-rules.md:389` |
| V25 | `migrate-generated-json.ts` walks and rewrites `z_archive` on purpose and regenerates `description.json` from disk | `migrate-generated-json.ts:25`, `:72`, `:276` |
| V26 | The phrase "spec-kit version migration" routes to `/doctor:update` | `.skilled/commands/doctor/_routes.yaml:312` |
| V27 | `--auto-upgrade` seds a newer version into any older marker with no structural check and a BSD-only `sed -i ''` whose error is discarded | `check-template-staleness.sh:171` to `:186` |
| V28 | Header census: three spellings of the implementation summary header, `resource-map` v1.1 249 against v2.2 134. Only 3 real archived packets lack `description.json` | rg and find, working tree |
| V29 | The fan-out's containment snapshot copies `specs/` files into the lineage, so corpus walkers that do not skip it double count | Pi iteration 10, lead find |
| V30 | `parseAnchoredSections` skips anchors nested inside another anchor | `runtime/cli/utils/template-structure.js:462` |
| V31 | `repair-derived.cjs` never writes `description.json` `specFolder`. Its only description write is the level | `repair-derived.cjs:84` to `:94`, `:237` |
| V32 | The rebuild runs on `main` and `skilled/**`, and `workflow_dispatch` has no branch filter | `trigger-index-rebuild.yml:6` to `:9` |
| V33 | `TEMPLATE_SOURCE` checks marker presence in the first 60 lines, never the version | `check-template-source.sh:55` to `:64` |
| V34 | 43 lane briefs hash identical after normalizing the batch number, over 474 unique folders | md5 over `fix-lanes/*.task` |
| V35 | `upgrade-legacy.mjs` repairs only `!packet.archived` packets. `--include-archive` adds discovery and recording, never repair | `upgrade-legacy.mjs:12`, `:203`, `:491` |
| V36 | `heal-spec-docs.cjs` stamps `v2.2` on any anchor superset of a signature | `heal-spec-docs.cjs:56` to `:83` |
| V39 | The cleanup writes non-atomically and targets five document kinds while 18 templates carry `trigger_phrases` | `template-phrase-cleanup.mjs:32`, `:420`, rg over templates |
| V40 | The weekly sweep never receives `--baseline`, so its regression warning cannot fire | `strict-pass-freshness-report.yml:56` to `:80` |
| V41 | The changed-packet gate compares the base by verdict only | `changed-packet-validation.yml:131` to `:147` |
| V42 | At least 12 short Gate 3 menus drop "in the same track" | `.skilled/commands/**/assets/*-presentation.txt`, compiled contracts |
| V44 | The golden snapshot pins the nested Level 2 layout as expected output | `snapshots/scaffold-golden-snapshots.vitest.ts.snap:1211` to `:1270` |
| V45 | `fix-dup-anchors.mjs` writes its leftovers file on dry runs, does not check suffix collisions, writes non-atomically and pairs markers inside code fences | scratchpad `fix-dup-anchors.mjs:12`, `:60`, `:78`, `:83` |
| V46 | 549 spec.md files carry the nested layout, 405 live and 144 archived (research lineages and scratch excluded) | Node walk over `specs/`, working tree |
