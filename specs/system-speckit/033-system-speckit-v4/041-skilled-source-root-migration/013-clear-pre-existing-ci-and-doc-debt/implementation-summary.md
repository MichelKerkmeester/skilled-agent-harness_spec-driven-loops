---
title: "Implementation Summary: Phase 13: clear-pre-existing-ci-and-doc-debt"
description: "The two CI workflows that were red before the migration pass locally, a new job compares every Hermes copy with its source, and the retired skill-benchmark lane no longer has a route, a script or a run instruction."
trigger_phrases:
  - "pre-existing ci debt summary"
  - "routing ratchet fixed"
  - "skill-benchmark lane removed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/013-clear-pre-existing-ci-and-doc-debt"
    last_updated_at: "2026-09-18T13:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Pushed the phase, rewrote the retired-lane residue and fixed the validator CLI"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/SKILL.md"
      - ".github/workflows/command-tree-parity.yml"
      - ".skilled/skills/sk-doc/sk-create-benchmark/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The write-set conflict census keeps its retired workstream as a record of its spec program"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-clear-pre-existing-ci-and-doc-debt |
| **Completed** | 2026-09-18 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two workflows that failed on every push now pass on this branch, so the next red run will mean something new broke. Both failures predate the migration. Phase 012 recorded them and left them alone.

### The routing ratchet

A cleanup of the deep-loop hub removed six keywords for families the tree no longer has. They were dead words, but they still carried weight, and one labeled prompt fell to sk-doc by 0.007: a request to start another deep-review wave while keeping the iteration history. Putting the dead words back would have fixed the score and left the hub describing things that do not exist. The hub now names what a deep-review wave actually produces, `iteration-files` and `iteration-history`, and all 289 prompts in a per-row dump route as they did before the cleanup. sk-design's `ROUTER.md` said version 1.0.0.0 while its release authority says 2.0.0.0, the last invariant keeping the structural check red.

The keyword change had one consumer the commit hooks do not test. The compiled contracts for `deep/research`, `deep/review` and `deep/ai-council` record the digest of the hub's `SKILL.md`, so all three went stale, and in its fix injection mode the contract renderer refuses a stale contract. The deep-loop suites under `runtime/vitest.config.ts` caught it, and the three contracts were recompiled. Only their recorded digest changed.

### The playbook contract

The fail-closed gate reported eleven violations in five scenario files. A Devin scenario carried the date of one run as part of its truth. A communication scenario lacked its source-metadata section. Two scenarios used SKIP without naming what blocks the run. A git scenario quoted the hook's refusal banner, whose first word is a forbidden verdict, so it now names the refusal by its gate tag. A deep-loop containment scenario described its check in prose, and now carries the full operator contract, with its signals taken from what the fan-out runner records.

### The Hermes mirrors

Nothing compared the Hermes copies of skills and prompts with their sources, and phase 012 found four stale copies by hand. Command Tree Parity now runs both sync scripts in check mode on every push and pull request. It was the right host because it already runs on every push and already installs the package the scripts need.

### The retired skill-benchmark lane

The authoring packet lost the lane's README template, storage guide and serving-snapshot schema, two scripts that could no longer start because they imported the lane, and two scenarios built on them. The lane's section, routing and alias are gone from the packet and the sk-doc hub. Eleven benchmark READMEs lost their re-run sections and keep their run indexes. The skill scaffolder stopped writing the retired run command into new skills. While verifying this phase, three more live pointers turned up and were fixed: `/create:benchmark` still offered `skill_benchmark` as a choice, and two authoring references said a deleted scenario loader required three frontmatter fields. Those fields are still required, by the two routing-gold gates, so the references now name those gates.

The operator then asked for the rest of the description residue. Twelve holdout scenarios said the skill-benchmark gates scored them; the routing-gold gates check them. Eight skill docs said the retired router-replay consumed their routing blocks, and one named a guard test that was deleted with the lane. Seven benchmark READMEs described the harness in the present tense, and one told the reader to add rows when the next run lands. The compiled-routing reference still told a hub author to pass Lane C parity to reach `compiled-serving`; it now says that no tool runs that step today, which means a new hub cannot reach `compiled-serving` until one does. One live defect turned up on the way: `validate-compiled-routing-scenarios.cjs` required an argument parser the lane's retirement deleted, so its command line crashed on start. It now parses its own arguments, and a new test runs it from the command line.

The root README slipped through that rewrite. The search looked for `skill-benchmark` and `Lane C`, and the README wrote "model/skill benchmarking" and "three co-equal lanes", so nothing matched. It still said the improvement family had three lanes and six `/deep:*` commands, and the deep-loop `SKILL.md` and deep-review README said the same. All three now describe two lanes and five commands, which recompiled the three deep command contracts once more. The same pass fixed two README claims that predate this phase: the prompt command is `/prompt:improve`, not `/prompt-improve`, and the commands sit in seven groups since the memory group folded into speckit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/SKILL.md` | Modified | Vocabulary for what a deep-review wave produces |
| `.skilled/skills/sk-design/ROUTER.md` | Modified | Version matches the release authority |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Modified | Seven-model Hermes roster |
| Five playbook scenarios | Modified | Back inside the operator contract |
| `.github/workflows/command-tree-parity.yml`, `.github/workflows/README.md` | Modified | `hermes-mirror` job |
| `.skilled/skills/sk-doc/sk-create-benchmark/**` | Deleted/Modified | Family, assets, references, scripts and scenarios removed |
| sk-doc hub registry, router and leaf manifest | Modified | Alias and leaves removed |
| Eleven benchmark READMEs, the chart scenario, two parity scenarios, six reference docs, `init_skill.py` | Modified/Deleted | No live instruction for the lane |
| `create-benchmark-presentation.txt`, the playbook snippet template, the frontmatter reference | Modified | The three pointers found while verifying |
| `.skilled/commands/deep/assets/compiled/deep-{research,review,ai-council}.contract.md` | Regenerated | Record the hub's new `SKILL.md` digest |
| Twelve holdout scenarios, nine skill docs, seven benchmark READMEs, three playbook roots, two feature catalogs, one playbook scenario, the compiled-routing reference, `init_skill.py` help, comments in four code files | Modified | No live file describes the retired lane as present |
| `validate-compiled-routing-scenarios.cjs` and its test | Modified | The CLI no longer requires a deleted module |
| `README.md`, `.skilled/skills/system-deep-loop/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/README.md` | Modified | Two improvement lanes and five `/deep:*` commands, the real prompt command name and group count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four commits on `worktrees/055-skilled-source-root-migration`, each through the git hooks with no bypass variable: `71aaaa8b95` (routing and the two hub records), `30b2981762` (playbooks), `c4b83f6648` (the Hermes job) and `cafeff809e` (the lane's removal), then `b1105386ab` for the three pointers found while verifying and `7e74623188` for the three command contracts. A seventh commit carries these docs. The first regression check ran only the spec-kit CLI project, 143 test files, and missed the contracts. `runtime/vitest.config.ts` also collects the deep-loop suites, 260 files in all, and it found them. No CI workflow runs that config. Each red workflow was diagnosed from its CI failure log, and the routing regression from a dump of every prompt's top skill at the commit before the cleanup and at the tip. The main checkout moved to `6cbaf58d3b` after phase 012, so the commits were rebased onto it, which gave them the IDs cited here, and `a22897b1af` was pushed to both branches. The residue work followed in `8a9ce45ee2` (the validator CLI) and `02589c0bfd` (the rewrite, the Hermes copies and two re-minted hub manifests).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name what the hub produces instead of restoring the dead keywords | The dead words fixed the score by describing families that no longer exist. The new words are true, and the dump shows they move no other prompt |
| Host the mirror check in Command Tree Parity | It runs on every push and pull request and installs the scripts' dependencies. The mirror job in Spec-Kit Check has a path filter that misses edits to other skills |
| Delete the two parity scenarios rather than mark them SKIP | Only the retired lane could run them, so SKIP would be permanent and would hide a real skip later |
| Leave the write-set conflict census as it is | The operator first approved removing its retired workstream, on my claim that it lists shipped modes. It models one spec program's folders instead, which still hold that workstream, and nothing outside its tests calls it. Given the corrected facts, the operator chose to keep it |
| Keep the `'skill-benchmark'` mode id in ledger schemas and reducers | Persisted records carry it. Removing it would break replay of old ledgers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Node runner | 88 files, 1001 pass, 1 fail. The failure is the baseline's `create-journey-proof.test.cjs` |
| Spec-kit `root` and `cli` projects, as Spec-Kit Check runs them, 254 files | 2,723 pass, 32 skipped, 0 fail |
| `runtime/vitest.config.ts`, which adds the deep-loop suites, 260 files | 3,928 pass, 21 skipped, 0 fail. The same config at `cafeff809e` failed 6 tests in 3 files: the 5 stale-contract failures fixed by `7e74623188`, and a stale local build of the gitignored `dist` |
| Contract drift | `check-contract-drift.cjs` exits 0. Contract tests 42/42, compiler tests 13/13. Hermes, Codex and Pi prompt mirrors in sync, 168 runtime mirrors in sync |
| Scorer ratchet | 7/7, failing since the cleanup before this phase |
| Per-row routing dump | All 289 prompts route as before the cleanup, checked at `cafeff809e`. The later edits touch no file the advisor reads |
| Playbook validator `--strict`, root-discovery step | Exit 0, 0 failing packages. All 44 fail-closed roots discovered |
| Hermes sync `--check` | 68 skill copies and 33 prompts in sync, both exit 0 |
| Hub checks | `parent-skill-check` passes on all six hubs. Leaf-manifest and derived-metadata freshness 13/13 |
| Markdown links, frontmatter | 0 broken links. Frontmatter clean |
| CI at `10742789a1`, the residue push | all 25 runs green, among them Routing Registry Drift Guard 35360099934 and 35360102705, Playbook Operator Contract 35360099937 and 35360102901, and Command Tree Parity 35360100027 and 35360102852. Spec-Kit Check did not run because the push touched none of its paths |
| CI at `a22897b1af` | All 27 runs on both branches green, Spec-Kit Check included (35358039078 and 35358038833). Routing Registry Drift Guard 35358038757 and 35358038847, Playbook Operator Contract 35358038681 and 35358038874, Hermes mirror job in 35358038672 and 35358038808 |
| Per-row routing dump after the residue rewrite | All 289 prompts route as in the known-good dump |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No tool can admit a new hub to `compiled-serving`.** Lane C parity was the admission test, and it was retired with the lane. The five hubs already admitted keep their measured verdict. This said seven until phase 16 corrected it: sk-design and sk-prompt had already left the cohort.
2. **The write-set conflict census still declares the retired workstream** (`.skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:14`, `shipped-census.ts:107`). It models the child folders of one spec program, which still hold that workstream, and it already omits the shipped deep-alignment mode, so it is a record of that program rather than a list of shipped modes. The operator chose to keep it, given these facts.
3. **The frozen durable-directory manifest has eleven stale entries in each direction.** They predate this work, and its test was failing before this phase.
4. **`create-journey-proof.test.cjs` still fails** on a version mismatch in the sk-create-skill scaffold, the same failure as the baseline.
5. **No CI workflow runs the deep-loop runtime suites.** Spec-Kit Check runs the spec-kit package's `root` and `cli` projects. The contract-drift and renderer tests that caught this phase's stale contracts run only under `runtime/vitest.config.ts`, locally.
6. **The deep-loop test suite rewrites a tracked file.** Each run leaves `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` modified. It was restored after both runs here.
7. **The trigger index was not regenerated.** It still lists the deleted files. No gate checks its freshness, and the main checkout holds another session's uncommitted edits to it.
<!-- /ANCHOR:limitations -->

---
