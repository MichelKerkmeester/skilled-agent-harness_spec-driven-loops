---
title: "Tasks: Trigger Index Rebuild, Freshness and Build Isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "trigger index fix tasks"
  - "ignored paths exemption task"
  - "generator check mode task"
  - "trigger index regeneration task"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Trigger Index Rebuild, Freshness and Build Isolation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every command runs from the worktree root. `$SCRATCH` is a directory outside the repository, and `$ARCHIVE` is an empty temp directory that receives `git archive HEAD | tar -x -C $ARCHIVE`. `G` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` and `L` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reproduce the refusal with every output in scratch: `node $G --out $SCRATCH/idx.json --manifest $SCRATCH/man.json --diagnostics $SCRATCH/diag.json --variants $SCRATCH/var.json`. Expect exit 1, `refused: 2 document(s)` and two `non-yaml-frontmatter` rows naming the model cards (`generate-trigger-index.mjs`)
- [ ] T002 Baseline the suite: `trigger-index.vitest.ts` passes 49 of 49 and `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7. Record `git log -5 --format='%h %ad %s' --date=short` on the owner paths and `git log HEAD..main` on the four artifacts, so the build knows which rebuild commits main holds (`runtime/cli/tests/trigger-index.vitest.ts`)
- [ ] T003 [P] Record the gap: repeat T001 with `--allow-malformed` and count paths in the scratch index that the committed index lacks, and the reverse. Planning saw 124 and 0 on 2026-09-27 (`runtime/data/trigger-index.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add two `IGNORED_PATHS` entries, the exact paths of `MODEL_CARD_08B.md` and `MODEL_CARD_9B.md`, each with a reason naming the column-0 YAML list the reader rejects. No comment names a spec path or phase number (`runtime/cli/retrieval/lib/corpus.mjs`)
- [ ] T005 Rerun T001. Expect exit 0 and `ignored malformed : 2`, with both rows in `$SCRATCH/diag.json` carrying `ignored: true` (`generate-trigger-index.mjs`)
- [ ] T006 In `generate()`, when the index path is given and resolves to something other than `DEFAULT_INDEX_PATH`, default each unset sidecar path to a sibling of it. Apply the rule before the diagnostics write, so a refused build is covered too. Update the usage header (`runtime/cli/retrieval/generate-trigger-index.mjs`)
- [ ] T007 Add two vitest cases: `--out` alone writes all three sidecars beside it and leaves the sha256 of the tracked fixtures unchanged. A refused corpus with `--out` alone writes its diagnostics beside it (`runtime/cli/tests/trigger-index.vitest.ts`)
- [ ] T008 Move the per-document comparison out of `checkTriggerIndexFreshness` into an exported helper that takes a loaded index, a document path and its declared normalized phrases and returns added and removed. Load it through `loadTriggerIndexRetrievalLibrary` beside the two `lib/` modules it already imports. Result shape and save messages stay the same. `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7 (`runtime/cli/retrieval/lib/freshness.mjs`, `runtime/cli/core/workflow.ts`)
- [ ] T009 Add `--check`: walk and read the corpus as a build does, run the T008 helper for every document against the index at `--out` or the default, count index paths the corpus no longer holds, print stale document and obsolete path counts with up to 20 examples and print a manifest hash difference as a note. Write nothing. Exit 0 when nothing differs, 1 when any document is stale or the corpus is untrusted, 2 on a bad invocation. Update the usage header (`runtime/cli/retrieval/generate-trigger-index.mjs`)
- [ ] T010 Add two vitest cases for `--check`: a fresh temp corpus exits 0, and the same corpus plus one phrase-bearing doc exits 1. Confirm no file under the temp output directory changed (`runtime/cli/tests/trigger-index.vitest.ts`)
- [ ] T011 Measure: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs --out $SCRATCH/latency.json --json` for the lookup p95, and five timed in-process `walkCorpus` runs for the walk p95. Apply the placement rule PD-4 in `plan.md` and record both numbers and the verdict in `implementation-summary.md`. A per-lookup verdict stops the build until `spec.md` is amended, because the lookup's change and budget are not planned here
- [ ] T012 [P] Document the sidecar rule and `--check` beside the fixture paragraph (`runtime/cli/retrieval/README.md`)
- [ ] T013 With a CI verdict from T011, add one report-only step with `continue-on-error: true` that runs `node $G --check`, and name it in the workflow's README row (`.github/workflows/advisory-checks.yml`, `.github/workflows/README.md`)
- [ ] T014 Commit T004 to T013 as one path-scoped code commit. No push, no merge
- [ ] T015 Regenerate from committed content: `git archive HEAD | tar -x -C $ARCHIVE`, then `node $G --repo-root $ARCHIVE`. Commit the index and its three fixtures as one separate commit (`runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/`)
- [ ] T016 Put the four miss-shape options in `spec.md` section 10 to the owner. Record the answer in `goal.md`'s log. A yes to any option other than A becomes an amendment to this phase before it is built
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run `trigger-index.vitest.ts` and `workflow-trigger-index-freshness.vitest.ts`. Expect 49 plus the new cases and 7 of 7, all passing
- [ ] T018 Extract the final HEAD into a fresh `$ARCHIVE` and run `node $G --check --repo-root $ARCHIVE`. Expect exit 0
- [ ] T019 `node $L --no-index-hash -- "deem local server"` lists `deem-local.md` at `1.000  exact`. `node $L --no-index-hash -- "cli-classifier hub"` still prints its rows unchanged, since the default stays until the owner answers
- [ ] T020 `git status --short .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures .skilled/skills/system-spec-kit/runtime/data` prints nothing after every scratch build, every `--check` run and T011
- [ ] T021 `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exits 0 on each changed `.mjs` and `.ts` file, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. The phase is Planned
<!-- /ANCHOR:summary -->

---
