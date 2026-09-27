---
title: "Fix Phase: Trigger Index Rebuild, Freshness and Build Isolation"
description: "The trigger-index rebuild refuses two vendored model cards this packet added, so the committed index has gone stale. The save-time check warns only for the packet being saved, and the lookup never warns. A build aimed at another path still rewrites tracked fixtures, and a lookup miss prints 20 score-0 rows. This phase plans the owner fixes in system-spec-kit's retrieval lane."
trigger_phrases:
  - "trigger index rebuild refused"
  - "vendored model card exemption"
  - "trigger index staleness check"
  - "whole index freshness check"
  - "generator tracked fixture write"
  - "score-0 partial miss shape"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fix Phase: Trigger Index Rebuild, Freshness and Build Isolation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Owner** | `system-spec-kit`: `runtime/cli/retrieval/` and `runtime/data/trigger-index.json` |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 17 |
| **Predecessor** | 009-cli-jev-hub-move |
| **Successor** | 011-spec-validator-fixes |
| **Handoff Criteria** | `generate-trigger-index.mjs` exits 1 with `refused: 2 document(s)` before the fix and exits 0 after it, the regenerated index answers "deem local server" with `deem-local.md` at a nonzero score, and `validate.sh --strict` passes on this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the cli-jev workflow integration specification. It plans five owner fixes in the trigger-index lane that the classifier research and its runs exposed. Every file it changes belongs to `system-spec-kit` or to the repository's CI, so the build follows `system-spec-kit`'s `SKILL.md`, the retrieval `README.md` and the suite in `runtime/cli/tests/trigger-index.vitest.ts`. No step calls Jev or Deem, so parent decision D1 has nothing to gate here.

**Scope Boundary**: The trigger-index generator, its corpus exemption list, the committed index and its three generated fixtures, the save-time freshness comparison moved into a shared helper and extended to the whole index, and the lookup's miss shape: the owner chose an opt-in flag (option C), which the Gate 1 line in the root `AGENTS.md` passes. The frontmatter reader's YAML heuristic, the lookup's scoring and default output, and every other retrieval script stay as they are.

**Dependencies**:
- None from 008 or 009. The phase can start any time. Its first step reproduces the refused rebuild
- Phase 017 depends on this phase's regenerated index

**Deliverables**:
- Two exact-path exemptions that let the rebuild publish again
- A committed index rebuilt from committed content, with no document missing
- A whole-index `--check` mode built on the save-time freshness comparison, so staleness has one definition, and a measured choice of whether the lookup warns too
- A generator that writes no tracked file when `--out` points elsewhere
- The score-0 miss shape recorded as an owner decision with options and costs, and the chosen option C built as an opt-in `--scoring-only` lookup flag that the Gate 1 line passes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 1 with `refused: 2 document(s) carry an untrusted trigger declaration` (reproduced 2026-09-27, 22,968 documents scanned). Both rows are `non-yaml-frontmatter` at line 1: the vendored Hugging Face model cards `007-classifier-deep-research/context/deem-main/docs/MODEL_CARD_08B.md` and `MODEL_CARD_9B.md`. Their frontmatter is valid YAML, but it writes list items at column 0 (`tags:` then `- decision-model`), and the reader's heuristic accepts a continuation line only when it is indented (`lib/frontmatter.mjs:161`). Because the rebuild refuses, the committed index has gone stale: a scratch build found 124 documents it lacks (99 in this packet, of them 48 in the new 010 to 017 scaffolds, 17 in `system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement`, 7 in `sk-doc/060-create-goal-mode` and 1 skill doc) and none it holds in error. With the committed index, "deem local server" returns only score-0 `partial` rows. With the fresh build it is an exact hit on `deem-local.md`. One staleness signal exists, at save time: `generate-context.js` compares the saved packet's `spec.md` trigger phrases with the committed index and warns `Trigger index: STALE for spec.md` with the added and removed phrases and a regenerate hint (`runtime/cli/core/workflow.ts:1977-1995`, comparison in `checkTriggerIndexFreshness` at `:346-391`). It covers only the saved packet's `spec.md`. No check covers the whole index, so an added skill doc or another packet's drift goes unreported, and the lookup never warns. The generator also rewrites tracked fixtures when `--out` points elsewhere (`generate-trigger-index.mjs:64-67`, `:353-356`), and a miss such as "cli-classifier hub" prints 20 score-0 rows with `truncated: true` and exits 0.

### Purpose
The trigger index rebuilds again, matches the corpus it was built from, can say when it no longer does, never touches a tracked file from a build aimed elsewhere, and leaves the miss-shape choice with its owner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two exact-path entries in `IGNORED_PATHS` (`lib/corpus.mjs:81`) for the two vendored model cards, each with its reason
- One regeneration of the committed index and its three generated fixtures, built from a `git archive` of HEAD
- The save-time per-document comparison moved into one retrieval helper that the save path and a new generator `--check` mode both call. `--check` runs it over the whole corpus and writes nothing
- A measurement of lookup latency and corpus-walk cost that decides, by a rule written before the measurement, whether the lookup also warns or `--check` runs as a report-only CI step
- Sidecar defaults that follow `--out`, so a build aimed elsewhere writes no tracked file
- The score-0 miss shape recorded as an owner decision with options and their cost. The owner chose option C on 2026-09-27
- An opt-in lookup flag, `--scoring-only`, that drops score-0 rows and exits 1 when no row scores, with the default output and exit status unchanged
- The Gate 1 lookup command in the root `AGENTS.md` passing that flag, and the two pointer blocks `sync-gate1-pointers.cjs` generates from that line

### Out of Scope
- Widening the YAML heuristic in `lib/frontmatter.mjs` to accept column-0 list items. That fixes the root cause for every document but changes how the reader classifies the whole corpus and needs a `PARSER_VERSION` bump. It is recorded as an open question for the owner
- Editing the vendored model cards. They are verbatim upstream copies, and an edit makes them differ from the source they document
- Any change to the lookup's default output or exit status without the owner's yes
- Changing the `AGENTS.md` section 5 wording. That file is the operator's
- The same tracked-default pattern in `measure-cold-lookup.mjs` (`DEFAULT_REPORT_PATH`, `:41`, written at `:340-341`). The section this phase comes from names only the generator. The plan works around it by always passing `--out`
- Any Jev or Deem call

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Add two `IGNORED_PATHS` entries, one per model card, each with a reason |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs` | Create | The per-document phrase comparison now inside `checkTriggerIndexFreshness`: declared phrases against the phrases the index attributes to that path, returning added and removed |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modify | `checkTriggerIndexFreshness` calls the shared helper through its existing retrieval loader. Its result shape and save messages stay the same |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | Sidecar paths default next to `--out` when `--out` is not the default index. Add `--check`. Update the usage header. Exit codes stay 0, 1 and 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modify | Tests for the sidecar defaults, for `--check` and for the lookup's `--scoring-only` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-trigger-index-freshness.vitest.ts` | Unchanged | Its 7 tests must still pass after the save path calls the shared helper |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Document the sidecar rule and `--check` next to the fixture paragraph at `:78` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Regenerated |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Modify | Regenerated with the index |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Modify | Regenerated with the index |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Modify | Regenerated with the index |
| `.github/workflows/advisory-checks.yml` | Modify, only if the measurement selects a CI check | One report-only step that runs the generator's `--check` |
| `.github/workflows/README.md` | Modify, only with the step above | Name the new step in the `advisory-checks.yml` row |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | Add the opt-in `--scoring-only` flag. Default output and exit status unchanged |
| `AGENTS.md` | Modify, the Gate 1 line only | The lookup command passes `--scoring-only`, and exit 1 with no rows reads as a clean no-hit |
| `.codex/AGENTS.md` | Modify, generated | Gate 1 pointer block rewritten by `runtime-mirrors/sync-gate1-pointers.cjs` |
| `.cursor/rules/skill-routing.md` | Modify, generated | Gate 1 pointer block rewritten by `runtime-mirrors/sync-gate1-pointers.cjs` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Unblock the rebuild with the narrowest exemption. `IGNORED_PATHS` gains exactly two entries, the exact repository paths of `MODEL_CARD_08B.md` and `MODEL_CARD_9B.md`, each with a reason naming the column-0 YAML list. No directory pattern, no `EXCLUSIONS` row and no reader change. It is narrow enough because the exemption covers the refusal only: both documents are still walked and hashed and still produce their diagnostic row marked `ignored`. Any other untrusted document, including a new file in the same vendored folder, still refuses. A moved or deleted card shows up in `ignoredPathsUnmatched` |
| REQ-002 | Regenerate the committed index once REQ-001 lands, from a `git archive` of HEAD so no uncommitted file enters it, and commit the index with its three generated fixtures in one commit. The result lacks no document a fresh build of the same tree holds and holds none it lacks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Extend the save-time check to the whole index instead of adding a second definition. Move the per-document comparison in `checkTriggerIndexFreshness` (`workflow.ts:346-391`) into one retrieval helper, and have the save path call it with its result shape and messages unchanged. Add a generator `--check` mode that runs the same helper over every walked document, also counts index paths no longer in the corpus, writes no file and exits 0 when nothing differs, 1 when any document is stale or the corpus is untrusted and 2 on a bad invocation. Measure first: record the cold-lookup baseline and the cost of a path-only corpus walk, then apply the rule fixed in `plan.md` to decide whether the lookup warns too or `--check` runs as a report-only CI step |
| REQ-004 | A build aimed elsewhere touches no tracked file. When `--out` names a path other than the default index, every sidecar path not given explicitly (manifest, diagnostics, variants) defaults to a sibling of `--out`. That includes the diagnostics a refused build writes. Without `--out`, the defaults stay the tracked paths, so the routine rebuild is unchanged |
| REQ-005 | Record the score-0 miss shape as a decision for the owner, with each option and its cost, and plan no change to the lookup's default output or exit status without the owner's yes. Decided 2026-09-27: option C, with the `AGENTS.md` edit (REQ-006) |
| REQ-006 | Add an opt-in lookup flag, `--scoring-only`, that drops score-0 rows before the limit and exits 1 when no row scores. Without the flag the output and exit status stay exactly as they are, so the partial-row tests pass untouched. The Gate 1 line in the root `AGENTS.md` passes the flag and says that exit 1 with no rows is a clean no-hit. Nothing else in `AGENTS.md` changes. `sync-gate1-pointers.cjs` regenerates its pointer blocks from that line and `--check` then exits 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plain generator run exits 0 and reports `ignored malformed : 2`, where today it exits 1 with `refused: 2 document(s)`.
- **SC-002**: `lookup-trigger-index.mjs -- "deem local server"` lists `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md` with score `1.000` against the committed index.
- **SC-003**: `generate-trigger-index.mjs --check` run against a `git archive` of the final HEAD exits 0, and a build with only `--out` set leaves `git status --short` on the retrieval fixtures empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Main rebuilds the same four artifacts after most commits: six `rebuild the trigger index from committed content` commits on 2026-09-27 alone (`44dcdc2f82` to `eaa02a56f5`), none on this branch | A merge in either direction conflicts on all four files | Resolve those four files by regenerating from the merged tree, never by hand-merging JSON |
| Dependency | `/doctor speckit-retrieval` reads the committed pair (`doctor-speckit-retrieval.yaml:119`, `:185`) and `/doctor:update` runs the generator with no flags (`doctor-update.yaml:369`) | A change to the no-flag defaults would change both | REQ-004 changes defaults only when `--out` is given |
| Risk | The exemption hides a real defect in a card that later gains a `trigger_phrases` key | Low | The row stays in diagnostics with `ignored: true`, and any phrase the reader parses is still indexed |
| Risk | The index goes stale again with the next doc commit | Med | REQ-003 gives a check that says so. The regeneration is the last commit of the build |
| Risk | A content-only `--check` misses a manifest that drifted while no phrase changed | Low | The check prints the manifest hash difference as a note. `/doctor speckit-retrieval` already owns the committed-pair check |
| Risk | Moving the save-time comparison changes a save message or result | Low | `workflow-trigger-index-freshness.vitest.ts` (7 tests, passing on 2026-09-27) pins the result shape. The helper returns the same added and removed lists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The default lookup keeps its cold-start budget of 200 ms at p95 and max (`measure-cold-lookup.mjs:44`). Nothing in this phase adds work to a lookup unless the REQ-003 rule selects a per-lookup check.
- **NFR-P02**: `--check` costs one full build, about 20.6 s today (measured 2026-09-27, 22,968 documents). It runs in CI or by hand, never per lookup.

### Security
- **NFR-S01**: No step writes outside the worktree except to a scratch directory, and no build step reads `.env` or any credential.
- **NFR-S02**: The CI step, if added, runs with the workflow's existing `contents: read` scope and needs no secret.

### Reliability
- **NFR-R01**: Publication stays fail-closed. The exemption covers two named files, and every other untrusted document still refuses.
- **NFR-R02**: The exit contract stays 0, 1 and 2 for both scripts (`generate-trigger-index.mjs:31`, `lookup-trigger-index.mjs:23`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a corpus with no untrusted document leaves `IGNORED_PATHS` entries unmatched only if the cards are gone, and `ignoredPathsUnmatched` names them.
- Maximum length: not applicable. The phase adds no field with a size limit.
- Invalid format: `--check` with a bad flag exits 2. `--check` over an untrusted corpus exits 1 and names the rows.

### Error Scenarios
- External service failure: none. The generator and lookup make no network call.
- Network timeout: not applicable.
- Concurrent access: `publishJson` writes through a temporary file and a rename, so a build aimed elsewhere cannot leave a half-written tracked file.

### State Transitions
- Partial completion: if REQ-001 lands and REQ-002 does not, the index is still stale but rebuildable. The next routine rebuild fixes it.
- Session expiry: not applicable.
- `--out` equal to the default index path: sidecars keep their tracked defaults, because that invocation is the routine rebuild.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Five source files plus one new helper, four regenerated artifacts, up to two CI files. About 100 changed lines of code and tests |
| Risk | 8/25 | Touches the fail-closed publication gate and the committed index every Gate 1 lookup reads. Exit contracts stay |
| Research | 4/20 | Causes already reproduced. One measurement decides where the check runs |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Score-0 miss shape (owner decision, REQ-005). Decided 2026-09-27: option C, with the `AGENTS.md` edit, built as REQ-006.** The lookup keeps score-0 candidates on purpose (`lookup-trigger-index.mjs:53`, `:173`) so its output matches the retired lane's recorded results (`:5-7`), and `fixtures/semantic-probes.json:4-5` separates `returnedHit` from `scoringHit` for that reason. `AGENTS.md:202` says "A miss is a clean no-hit". Option A, keep today's shape: parity holds, but a miss prints up to 20 rows and exits 0, so every caller filters `score > 0` itself. Option B, drop score-0 rows by default and exit 1 when none score: the miss becomes clean, but parity with the recorded results breaks, the probe counts shift and any caller relying on exit 0 changes. Option C, keep the default and add an opt-in flag that drops score-0 rows and exits 1 on no scoring row: no caller changes, but Gate 1's instruction must pass the flag to get a clean miss. Option D, keep the code and have the operator reword `AGENTS.md` to say score-0 rows are not hits: no code change, but the noisy output stays. No option is built without the owner's yes. The owner said yes to C and to the `AGENTS.md` edit it needs.
- **Column-0 YAML lists (owner decision).** Should the reader accept `- item` at column 0 after a top-level key, as YAML allows? Today `lib/frontmatter.mjs:161` rejects it, and `trigger-index.vitest.ts:250` pins only the one-space form. Accepting it would let the two exemptions go, at the cost of a `PARSER_VERSION` bump and a reclassification pass over the corpus.
<!-- /ANCHOR:questions -->

---

