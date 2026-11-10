---
title: "Implementation Summary: Phase 5: stale-index-fallback"
description: "A trigger lookup that finds nothing in the committed index now scores the declared phrases of spec docs the index does not list yet, inside the 200 ms budget."
trigger_phrases:
  - "stale index fallback implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback"
    last_updated_at: "2026-11-09T21:10:00Z"
    last_updated_by: "conductor"
    recent_action: "Built, aligned, benchmarked and closed"
    next_safe_action: "Start phase 6 rg-flood-control"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-stale-index-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stale-index-fallback |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A packet written since the last index build is now findable by Gate 1. `lookup-trigger-index.mjs --scoring-only -- "retrieval feature design research"` used to exit 1; it now exits 0 with the phase 3 spec and prints `fallback   : 197 unindexed doc(s) read, 5 match(es)`.

### Phase 5: stale-index-fallback

When the committed index scores nothing, the lookup walks `specs/` with the generator's own folder pruning, keeps the spec docs whose path the index does not list, and scores their declared `trigger_phrases` with the same scorer. The JSON answer gains `staleFallback`; `--no-stale-fallback` and an explicit `--index` keep the old index-only answer. A lookup that already matches never runs the walk, and its output is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/retrieval/lib/unindexed-docs.mjs` | Created | Async `specs/` walk, index-paths diff, scope containment, phrase scoring, 500-file cap |
| `runtime/cli/retrieval/lib/corpus.mjs` | Modified | Exports `isExcludedResearchPath` so the walk and the generator exclude the same files |
| `runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | `lookupWithFallback()`, shared rank comparator, `--no-stale-fallback`, `fallback :` line, async `main` |
| `runtime/cli/tests/stale-fallback.vitest.ts` | Created | 22 cases, including sub-tracks and two scope-escape cases |
| `references/retrieval/retrieval-conventions.md` | Modified | Section 4 fallback contract, section 5 determinism scope |
| `SKILL.md`, system-spec-kit `README.md`, retrieval `README.md`, root `README.md` | Modified | Describe the fallback, its exit meaning and the working-tree boundary; version 2.12.42.0 |
| `.skilled/commands/speckit/README.txt`, `assets/search-presentation.txt` | Modified | `/speckit:search` renders the fallback line and marks results `[not yet in index]` |
| `feature-catalog/retrieval/stale-index-fallback.md`, `feature-catalog.md` | Created, Modified | Catalog entry and index block |
| `manual-testing-playbook/retrieval/stale-index-fallback.md`, `manual-testing-playbook.md` | Created, Modified | Conversational scenario 490 and its row |
| `changelog/v2.12.42.0.md` | Created | Changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

In worktree 335 on top of the phase 4 commit `aed771daa9`. The designed `git status` discovery measured 0.8-1.1 s, so the conductor measured an index-paths diff instead (40-60 ms walk, 3-17 ms reads) and recorded the change in `spec.md` section 10. Devin DeepSeek ran the before benchmark, then built the module and the CLI wiring in parallel; codex Luna wrote the test matrix and three doc passes in parallel. The conductor ran every test, fixed a fixture that broke under a global gitignore, and added the sub-track cases the operator asked for. `/local-skilled-alignment` on the codex preset found 7 lane findings and 5 critic findings; the fixes were a scope-escape guard with two regression tests, a scenario reseeded into a scratch git work tree, and five wording corrections. Devin walked scenario 490 (PASS), and the conductor ran the after benchmark, the full suite and the recheck.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Discover by diffing a `specs/` walk against the index `paths`, not `git status` | `git status --untracked-files=all` cost 0.8-1.1 s per zero-hit and the 200 ms budget is frozen; the diff also finds docs committed since the last build, which `git status` cannot see |
| Read only packet document names (`SPEC_DOC_NAMES`) | All 41 unindexed docs that declare phrases had one of these names; filtering by name cut reads from 2,631 files to 197 |
| Hold the scope's real path inside the real `specs/` path | A prefix test let `specs/../.skilled/skills` read 372 files outside the tree; normalize plus realpath closes both the `..` and the link route |
| Seed scenario 490 with a synthetic packet in a scratch git work tree | The scratch copy could not see `specs/`, so the first version proved the fallback only against the source checkout; a made-up phrase also never goes stale after a rebuild |
| Walk the tree the index belongs to, and skip the scan when the index lives outside it | Main gained host-repo index selection while this phase was in review. On the rebase, a host's index spells its paths against the host, so the scan walks the host; the packaged index of a linked install names other documents, and a host-repo test showed the scan would otherwise pass every host packet off as a match |
| Leave `AGENTS.md` Gate 1 wording unchanged (CR-3, P2) | It is the cross-repo framework contract and outside this phase's file list; "it reads the committed index" stays true, since the fallback adds to that read |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Fallback test file | `stale-fallback.vitest.ts`: 22 passed |
| Retrieval test files | `trigger-index`, `host-trigger-index`, `retrieval-coverage-parity`, `retrieval-repo-root`, `trigger-index-root-mismatch`: 105 passed |
| Full system-spec-kit suite | 4099 passed, 33 skipped, 0 failed, 334 files (baseline 4071 passed, 0 failed; phase 4 left 4077) |
| Catalog and playbook validators | `validate_catalog_package.py` exit 0; `validate-playbook-package.cjs` exit 0 |
| Scenario 490 on devin | PASS 1/1; the agent's own lookup returned the seeded packet through `staleFallback` (`benchmark/scenario-490/`) |
| `/local-skilled-alignment` recheck | Recheck 2: resolved 2, still open 1 (S9, P2, kept with reason), new 0, needs review 6, all reviewed below (`alignment/recheck.md`) |
| `validate.sh --strict` on this phase | RESULT: PASSED |
| Benchmark: stale phrases found | 0/10 before, 10/10 after |
| Benchmark: matching queries unchanged | 10/10 identical JSON and human output |
| Benchmark: undeclared phrases exit 1 | 5/5 before, 5/5 after |
| Benchmark: median time, matching queries | 73.6 ms before, 71.6 ms after (-2.8%) |
| Benchmark: prompt-set p95 | 121.1 ms before, 151.6 ms after (budget 200 ms); `measure-cold-lookup.mjs` p95 66.9 ms |

Needs-review findings, resolved by the conductor: CR-1, CR-2 and CR-5 fixed with the wording above; CR-4 closed by this closeout; PRB-01 is probe P02, which main routes the same way. Open P2 findings, kept with a reason: CR-3 (see Key Decisions); BAT-02, `S9-command-references` names a gitignored generated SQLite file that exists in the main checkout but not in this fresh worktree, and this change does not touch it. Probe P02 routes to `command-doctor-helper` on main too, so this change did not cause it.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A phrase edited inside an already indexed doc is not covered.** The index answers for that path. Run `generate-trigger-index.mjs --check` to see stale entries, and rebuild.
2. **No fallback outside a git work tree.** The answer says `fallback   : unavailable (not a git work tree)`; the ripgrep recipes still find the doc by body text.
3. **A zero-hit costs more.** About 135-155 ms for the whole process instead of about 75 ms; a matching lookup pays nothing.
<!-- /ANCHOR:limitations -->

---
