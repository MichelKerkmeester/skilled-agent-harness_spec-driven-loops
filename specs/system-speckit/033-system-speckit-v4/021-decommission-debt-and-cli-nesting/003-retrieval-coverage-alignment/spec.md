---
title: "Feature Specification: Phase 3: retrieval-coverage-alignment"
description: "The trigger-index corpus walker and the documented ripgrep recipes maintain two independent exclusion lists and root sets, so the same query can return different results depending on which lane answers it."
trigger_phrases:
  - "retrieval coverage alignment spec"
  - "corpus walker ripgrep drift"
  - "install guides trigger index"
  - "root readme mirrors excluded"
  - "research lineages documented divergence"
  - "parity test coverage agreement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: retrieval-coverage-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 7 |
| **Predecessor** | `../002-scripts-into-runtime-nesting/spec.md` |
| **Successor** | `../004-save-and-resume-freshness/spec.md` |
| **Handoff Criteria** | A single exclusion manifest exists (or every divergence is documented), a parity test enforces it, and two consecutive index runs hash identically |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the decommission debt fixes specification.

**Scope Boundary**: `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs`'s corpus walker and `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`'s documented ripgrep recipes. No change to the ripgrep binary invocation shape itself, only to which roots and exclusions the two lanes agree on.

**Dependencies**:
- None on the other six phases.

**Deliverables**:
- One documented exclusion/root policy both lanes read from, or a table of every divergence and why it exists.
- A decision on whether root `README.md`, the five runtime mirrors, and `.opencode/install-guides` join the corpus.
- A parity test that fails when the two lanes diverge without a recorded reason.
- Two `generate-trigger-index.mjs` runs proven to hash identically.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trigger-index corpus walker (`.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:20-31`) sets `CORPUS_ROOTS = ['specs', '.opencode/skills']` and excludes `z_archive`, `node_modules`, `scratch`, `research/lineages` (pruned only directly under a `research` parent), `tests/fixtures`, and any `fixtures`/`__fixtures__`/`test-fixtures`/`*-fixtures` directory name outside `specs/`. The documented ripgrep recipes in `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (section 2, lines 92-115) instead run over the roots `specs .opencode` - a broader positional scope that reaches `.opencode/commands`, `.opencode/agents` and `.opencode/install-guides`, none of which the trigger index walks - while excluding only `z_archive`, `node_modules` and `.git`, none of `scratch`, `research/lineages`, `tests/fixtures`, or packet-fixture directories. Neither lane's roots reach repository-root `README.md` or the five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`), since those sit outside both `specs`/`.opencode/skills` and `specs .opencode`. The generated `corpus-manifest.json` fixture (`.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/corpus-manifest.json:4-10`) records the trigger-index's own exclusion list as of the last regeneration, but nothing compares it against the ripgrep documentation's list, so the two can drift silently.

### Purpose
One exclusion and root policy governs both retrieval lanes - either literally shared, or documented with a stated reason for every difference - a parity test catches future drift, the install-guides/root-README/mirror coverage decision is made explicitly rather than by omission, and two trigger-index regenerations over an unchanged corpus hash identically.

### Resolution

**Coverage decision (REQ-002).** `.opencode/install-guides` joins the trigger-index corpus (`CORPUS_ROOTS` now `['specs', '.opencode/skills', '.opencode/install-guides']`): both its documents already carry well-formed `trigger_phrases` frontmatter and ripgrep already reached them, so the trigger index missing them was a pure asymmetry, not a deliberate scope choice. Root `README.md` and the five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) join **neither** lane: `README.md` is public-facing project marketing content with no `trigger_phrases` convention, and the mirrors are mostly symlinks onto documents already indexed under `.opencode` plus a handful of hand-authored sync-manifest docs (`SYNC.md`, `AGENTS.md`, `PLUGINS.md`) that describe CLI-specific sync mechanics rather than retrieval content.

**Divergence table (REQ-001, SC-001).** The full table with reasons lives in `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` Section 9 (`COVERAGE AND EXCLUSION POLICY`), enforced going forward by `scripts/tests/retrieval-coverage-parity.vitest.ts`. Summary:

| Axis | Trigger index | Ripgrep | Status |
|------|:---:|:---:|--------|
| Roots `specs`, `.opencode/skills` | Yes | Yes (subset of `.opencode`) | Same |
| Root `.opencode/install-guides` | Yes | Yes (subset of `.opencode`) | **Converged this phase** |
| Rest of `.opencode` | No | Yes | Documented divergence - the trigger index is a committed, size-tracked, fail-closed generated artifact; ripgrep carries no such artifact |
| Root `README.md` | No | No | Decided against for both lanes |
| Five runtime mirrors | No | No | Decided against for both lanes |
| `z_archive`, `node_modules`, `.git` | Excluded | Excluded | Same |
| `scratch` | Excluded | Excluded | **Converged this phase** - ripgrep's lane now excludes it too (`GLOBS` in `lib/rg-lane.mjs` and `rg-wrapper.mjs`, plus the documented recipes), matching the trigger index, the repository's own scratch convention, and the existing precedent in `sweep-memory-residue.mjs` |
| `research/lineages` (under a `research` parent) | Excluded | Reachable | Documented divergence - ripgrep is a raw evidence lane that must still reach the corpus's thousands of lineage transcripts; converging would be a real coverage loss for a curated-index noise concern that does not apply to a scan |
| Fixture-named directories outside `specs/` | Excluded | Reachable | Documented divergence - the trigger index's exemption is scoped to outside `specs/` because hundreds of real specification documents live under packet directories named for fixtures; replicating that exact scoping in ripgrep's glob engine risks silently dropping that real content |

**Result (REQ-004, SC-002).** Two consecutive `generate-trigger-index.mjs` runs after this change produced identical `indexSha256` (`959b3263cecdae12c1b23bc99141b29f302b1c7d20bcffcaaadbb30def535790`) and `manifestHash`. Isolating the root change alone (same tree, `walkCorpus` called with the old and the new root list) shows exactly two documents added - `.opencode/install-guides/README.md` and `.opencode/install-guides/install-scripts/README.md` - both parsing as the `ok` diagnostic category, zero new `malformedDocuments`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Produce a single table comparing `corpus.mjs`'s `CORPUS_ROOTS`/`EXCLUSIONS`/`isExcludedDirectory` against `retrieval-conventions.md`'s documented roots (`specs .opencode`) and glob exclusions (`z_archive`, `node_modules`, `.git`), naming every divergence. **Done** - see the Resolution subsection under Problem & Purpose and Section 9 of `retrieval-conventions.md`.
- Decide, for each of root `README.md`, the five runtime mirrors, and `.opencode/install-guides`: join the trigger-index corpus, join neither lane, or stay ripgrep-only. **Decided**: `.opencode/install-guides` joins the trigger-index corpus; `README.md` and the five mirrors join neither lane.
- Either converge the two lanes onto one exclusion manifest both read (a shared JSON or JS module), or update `retrieval-conventions.md`'s documented recipe to add the missing `scratch`/`research/lineages`/`tests/fixtures`/packet-fixture exclusions explicitly, whichever the decision favors - record which was chosen and why. **Decided**: converge `scratch` into the ripgrep lane's code and docs; document `research/lineages` and the fixture-directory pattern as permanent, reasoned divergences rather than converging them, since both hold real content ripgrep must keep reaching.
- Add a parity test (vitest or a script under `scripts/retrieval/`) that walks both lists and fails when they diverge without a matching entry in the divergence table. **Done** - `scripts/tests/retrieval-coverage-parity.vitest.ts`.
- Regenerate the trigger index twice consecutively and confirm `corpusHash` and `indexSha256` match between runs. **Done**.

### Out of Scope
- Changing the ripgrep recipe's flags or output-mode contract (`--json`, `--files-with-matches`, etc.) - only the roots and exclusions are in scope.
- Adding a new retrieval lane or replacing either existing one.
- The parent packet's `data/trigger-index.json` → `runtime/data/trigger-index.json` move - already complete; `runtime/data/trigger-index.json` exists and no `data/` directory remains at the skill root.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs` | Modify | Widened `CORPUS_ROOTS` to add `.opencode/install-guides`; exported `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` for the parity test |
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs` | Modify | Added the converged `scratch` exclusion glob to `GLOBS` |
| `.opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs` | Modify | Mirrored the same `scratch` exclusion glob, keeping `assertRecipeParity` true |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Added the `scratch` exclusion to every Section 2 recipe; added Section 9 (coverage and exclusion policy) |
| `.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, `../../runtime/data/trigger-index.json` | Regenerate | Reflects the widened root and converged exclusion after two-run hash confirmation |
| `.opencode/skills/system-spec-kit/scripts/tests/retrieval-coverage-parity.vitest.ts` | Create | New parity test walking both lanes' root and exclusion lists against the divergence table |
| `.opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts` | Modify | Updated the three hardcoded glob-list expectations and the corpus fixture for the converged `scratch` exclusion |
| `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts` | Modify | Added coverage for the new `.opencode/install-guides` root |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One exclusion/root policy governs both the trigger-index corpus walker and the documented ripgrep recipes, or every divergence between them is named in a table with a stated reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The coverage decision for root `README.md`, the five runtime mirrors, and `.opencode/install-guides` is recorded explicitly for each of the two lanes, replacing today's silent omission |
| REQ-003 | A parity test walks `corpus.mjs`'s roots/exclusions and `retrieval-conventions.md`'s documented roots/exclusions and fails when they diverge without a matching divergence-table entry |
| REQ-004 | Two consecutive `generate-trigger-index.mjs` runs over an unchanged corpus produce identical `corpusHash` and `indexSha256` values |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The divergence table (or the converged single manifest) accounts for every current difference between `corpus.mjs` and `retrieval-conventions.md` - `scratch`, `research/lineages`, `tests/fixtures`, packet-fixture directories, and the `.opencode/skills`-versus-`.opencode` root scope.
- **SC-002**: `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` run twice in a row over an unchanged tree reports the same `corpusHash` and `indexSha256` both times.
- **SC-003**: The new parity test fails when a test fixture introduces an undocumented divergence, and passes on the current (post-fix) state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the trigger-index corpus to include `.opencode/install-guides` or the runtime mirrors changes `includedPathCount` (currently 28,116 in the last recorded manifest) and every downstream consumer of the index size | Med | Regenerate and re-run the parity test and the two-hash-run check before and after; report the delta count explicitly rather than silently absorbing it |
| Dependency | `.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/corpus-manifest.json` is a checked-in fixture other tests may assert against | Low | `rg -n "corpus-manifest.json" .opencode/skills/system-spec-kit/scripts/tests` before regenerating, to confirm which suites read it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Widening the corpus roots must not push a single `generate-trigger-index.mjs` run past a wall-clock budget the operator considers acceptable for a Gate-1 lookup dependency; report the before/after run time.
- **NFR-P02**: The parity test itself runs in well under a second - it walks two small in-memory lists, not the filesystem.

### Security
- **NFR-S01**: No new environment variable or credential surface.
- **NFR-S02**: Widening the corpus never indexes a path outside the repository root.

### Reliability
- **NFR-R01**: The two-run hash check (SC-002) is the authoritative determinism proof; a single run's hash alone does not satisfy this phase.
- **NFR-R02**: A parity-test failure must name the specific divergent path or exclusion, not just report "mismatch".
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a corpus root that resolves to zero files (e.g., if `.opencode/install-guides` is added but is empty in some future state) is walked without error, per `walkCorpus`'s existing `skipped.push({ path: root, reason: 'root does not exist' })` branch.
- Maximum length: the corpus already spans 28,116+ paths; a widened root set is expected to add hundreds, not another order of magnitude - report the actual delta.
- Invalid format: a symlinked mirror directory (e.g. `.claude/skills` → `.opencode/skills`) must not be double-counted if a widened root set were to include it; `corpus.mjs`'s existing `byRealPath` dedup-by-resolved-path handles this, and the parity test should assert it still does.

### Error Scenarios
- External service failure: not applicable - no network call.
- Network timeout: not applicable.
- Concurrent access: two processes running `generate-trigger-index.mjs` against the same tree do not corrupt each other's output; each writes its own hash independently and SC-002 compares two sequential (not concurrent) runs.

### State Transitions
- Partial completion: if only the trigger-index side of the policy is updated before the ripgrep documentation side, the parity test must fail loudly rather than silently pass on a half-converged state.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two files own the current divergence directly; the parity test and manifest regeneration are additive |
| Risk | 6/25 | Widening the corpus changes a generated artifact's size and hash, but the two-run determinism check catches any instability immediately |
| Research | 3/20 | Both lanes' current roots and exclusions were confirmed by direct source reading before this spec was written |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Resolved: `.opencode/install-guides` joins the trigger-index corpus; root `README.md` and the five runtime mirrors join neither lane. See the Resolution subsection under Problem & Purpose.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
