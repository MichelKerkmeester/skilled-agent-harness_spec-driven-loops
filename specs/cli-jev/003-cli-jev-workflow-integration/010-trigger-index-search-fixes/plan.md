---
title: "Implementation Plan: Trigger Index Rebuild, Freshness and Build Isolation"
description: "Exempt the two vendored model cards by exact path, fix the generator's sidecar defaults, extend the save-time freshness comparison to a write-free whole-index --check mode, measure before deciding whether the lookup warns, then rebuild the committed index from committed content. The score-0 miss shape stays an owner decision."
trigger_phrases:
  - "trigger index fix plan"
  - "ignored paths exemption plan"
  - "generator check mode"
  - "staleness check measurement"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Trigger Index Rebuild, Freshness and Build Isolation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, standard library only (`generate-trigger-index.mjs`, `lib/corpus.mjs`) |
| **Framework** | None. The owner is `system-spec-kit`'s retrieval lane |
| **Storage** | Committed JSON: `runtime/data/trigger-index.json` and three fixtures under `runtime/cli/retrieval/fixtures/` |
| **Testing** | Vitest: `runtime/cli/tests/trigger-index.vitest.ts` (49 tests) and `runtime/cli/tests/workflow-trigger-index-freshness.vitest.ts` (7 tests), all passing on 2026-09-27 |

### Overview
Five items, in the order the build runs them. First, two exact-path exemptions let the refused rebuild publish. Second, the generator's sidecar paths follow `--out`, so no scratch build writes a tracked file again. Third, the per-document comparison the save path already runs moves into a shared helper, a `--check` mode runs it over the whole corpus and a measurement decides whether the lookup warns too. Fourth, the committed index is rebuilt from a `git archive` of HEAD as the last commit. The fifth item, the score-0 miss shape, is recorded for the owner and not built.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batch generator plus a stateless lookup. The generator walks the corpus and publishes one index with three sidecars. It fails closed on an untrusted trigger declaration. The lookup reads the committed index cold on every call.

### Key Components
- **`lib/corpus.mjs` `IGNORED_PATHS` (`:81`)**: the documented escape from the fail-closed refusal, one exact path and one reason per entry.
- **`generate()` in `generate-trigger-index.mjs` (`:350`)**: resolves the four output paths (`:353-356`), writes diagnostics before the refusal check (`:369`), refuses at `:371` and publishes the rest at `:392-394`.
- **`lookup()` in `lookup-trigger-index.mjs` (`:129`)**: keeps score-0 candidates as class `partial` (`:53`, `:173`).
- **`checkTriggerIndexFreshness` in `core/workflow.ts` (`:346-391`)**: the existing save-time check. It compares the saved packet's `spec.md` trigger phrases with the phrases the index attributes to that path and returns added and removed lists, which the save logs as `Trigger index: STALE` (`:1977-1995`).
- **`measure-cold-lookup.mjs`**: times cold lookups in fresh processes against a 200 ms budget at p95 and max (`:44`).

### Data Flow
Corpus markdown under `specs`, `.skilled/skills` and `.skilled/hooks` goes to `walkCorpus`, then `readTriggerPhrases` per file, then the in-memory index. `generate()` writes it to the index path and the three sidecars. `--check`, new here, walks and reads the corpus the same way, then runs the shared per-document comparison for every document against the index file on disk and lists index paths the corpus no longer holds. It publishes nothing.

### Decisions fixed before the build

| ID | Decision | Why |
|----|----------|-----|
| PD-1 | Exempt the two cards by exact path in `IGNORED_PATHS`, not by a directory pattern or a reader change | A directory rule would drop the seven other vendored docs from the manifest and fold a new `EXCLUSIONS` row into every manifest hash. A reader change reclassifies the whole corpus. The exact-path entry touches two files and nothing else |
| PD-2 | Sidecars follow `--out` only when `--out` differs from the default index path | Keeps the no-flag rebuild used by `/doctor:update` and the `git archive` recipe byte-for-byte the same |
| PD-3 | A document is stale when its declared phrases differ from the phrases the index attributes to its path, the definition `checkTriggerIndexFreshness` already uses. The index is also stale when it lists a path the corpus no longer holds. A manifest hash difference alone is printed as a note and exits 0 | One definition for the save and the whole index. A doc edit that changes no phrase changes the corpus hash but no lookup answer. The committed-pair check stays with `/doctor speckit-retrieval` |
| PD-7 | Move the comparison out of `workflow.ts` into `lib/freshness.mjs` and load it through the existing `loadTriggerIndexRetrievalLibrary`. The save's result shape and messages stay as they are | A second copy of the comparison would let the save check and `--check` disagree. The loader already imports two `lib/` modules, so a third follows its pattern |
| PD-4 | Placement rule: the lookup warns about staleness per call only if the measured cold-lookup p95 plus the measured p95 of a path-only `walkCorpus` stays at or under 200 ms. Otherwise `--check` runs in CI as a report-only step | A per-lookup check must at least list the corpus to see an added document. The rule is fixed now so the measurement cannot be read to fit a preferred answer. Indicative: three path-only walks took 1,853, 2,376 and 1,575 ms on 2026-09-27 |
| PD-5 | If PD-4 selects a per-lookup check, stop and amend this spec before building | That choice changes `lookup-trigger-index.mjs` and its latency budget, which this spec does not list |
| PD-6 | The CI step is report-only (`continue-on-error: true`) in `advisory-checks.yml` | That workflow is the home for checks that "must not block" and keeps each step green with `continue-on-error` (`advisory-checks.yml:8`, `:14`). Making it a gate is the owner's call |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/corpus.mjs` `IGNORED_PATHS` | Producer of the refusal exemption | Update: two entries | Generator exits 0 with `ignored malformed : 2` |
| `generate()` output path defaults | Producer of every write | Update: sidecars follow `--out` | New vitest cases and `git status --short` on the fixtures after a scratch build |
| `generate-trigger-index.mjs` CLI | Parses flags, maps publication to exit codes | Update: add `--check`, same three exit codes | New vitest case for fresh and stale, plus a bad-flag run exiting 2 |
| `runtime/data/trigger-index.json` and three fixtures | Committed artifacts every lookup and `/doctor` reads | Regenerate | `--check` exits 0 against a `git archive` of HEAD |
| `lib/freshness.mjs` (new) | Producer of the one staleness definition | Create | Called by both the save path and `--check`. The `--check` vitest cases exercise it |
| `checkTriggerIndexFreshness` in `core/workflow.ts` | Existing save-time consumer of the comparison | Update: call the helper | `workflow-trigger-index-freshness.vitest.ts` stays 7 of 7 |
| `lookup-trigger-index.mjs` | Consumer of the index | Unchanged | Existing lookup tests stay green |
| `doctor-speckit-retrieval.yaml`, `doctor-update.yaml` | Consumers of the committed pair and of the no-flag generator | Unchanged | PD-2 keeps the no-flag paths |
| `measure-cold-lookup.mjs` | Latency harness, writes a tracked report by default | Unchanged, always run with `--out` | `git status --short` on `fixtures/latency-report.json` stays empty |
| `retrieval/README.md` | Documents the fixtures and the generator | Update | `rg -n -- '--check' README.md` finds the new text |

Required inventories:
- Same-class producers: `rg -n 'DEFAULT_(INDEX|MANIFEST|DIAGNOSTICS|VARIANTS|REPORT)_PATH' .skilled/skills/system-spec-kit/runtime/cli/retrieval` lists every tracked default. Only the generator's four are in scope. `measure-cold-lookup.mjs:41` is the one other and is out of scope.
- Consumers of changed symbols: `rg -n 'IGNORED_PATHS|generate\(|DEFAULT_VARIANTS_PATH' .skilled --glob '*.{mjs,cjs,ts,js,md,yaml}'` found the generator, `corpus.mjs`, `trigger-index.vitest.ts` and docs only on 2026-09-27. `rg -ln checkTriggerIndexFreshness .skilled/skills/system-spec-kit` found `core/workflow.ts` and `tests/workflow-trigger-index-freshness.vitest.ts` as the code users.
- Matrix axes: `--out` given or absent, `--out` equal to the default or not, each sidecar flag given or absent, corpus trusted or refused. Required rows: no flags (tracked defaults), `--out` elsewhere alone (all sidecars beside it), `--out` elsewhere with `--manifest` given (explicit path wins), `--out` elsewhere on a refused corpus (diagnostics beside it), `--out` equal to the default (tracked defaults).
- Algorithm invariant: a run whose `--out` resolves to a path other than the default index writes no file under the skill's tracked `runtime/` tree. Adversarial cases: a relative `--out`, an `--out` that resolves to the default path through `..` segments, and a refused corpus.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Observable check per step:

| Step | Check |
|------|-------|
| Reproduce the refusal | Scratch-path build exits 1 and prints `refused: 2 document(s)` |
| Add the exemptions | Scratch-path build exits 0 and prints `ignored malformed : 2` |
| Sidecar defaults | Vitest cases pass, and `git status --short` on the retrieval fixtures is empty after an `--out`-only build |
| Shared helper | `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7 with the save path calling `lib/freshness.mjs` |
| `--check` | Exit 0 on a fresh tree, 1 after adding one phrase-bearing doc to a temp corpus, 2 on an unknown flag |
| Measure and place | Two numbers recorded in `implementation-summary.md` and the PD-4 verdict stated |
| Regenerate | `--check` against a `git archive` of HEAD exits 0, and the "deem local server" lookup prints `1.000  exact` on `deem-local.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Save-time freshness: the existing 7 cases in `workflow-trigger-index-freshness.vitest.ts` pass unchanged after the move. Sidecar defaults: happy path (`--out` alone puts all three sidecars beside it and leaves the tracked fixtures' sha256 unchanged) and one edge (a refused corpus with `--out` alone writes diagnostics beside it). `--check`: happy path (fresh returns exit 0) and one edge (an added phrase-bearing doc returns exit 1) | Vitest, `trigger-index.vitest.ts` |
| Integration | The real generator over the worktree, with every output in a scratch directory, before and after the exemption | `node generate-trigger-index.mjs` with all four paths set |
| Manual | Lookup of "deem local server" and of "cli-classifier hub" against the committed index after the rebuild | `node lookup-trigger-index.mjs` |

The exemption needs no new test: `trigger-index.vitest.ts:462`, `:493`, `:509` and `:523` already cover a listed path, an unlisted one, a dead entry and a reason on every entry.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Main's routine index rebuilds (`44dcdc2f82` to `eaa02a56f5`, 2026-09-27) | Internal | Yellow | Merge conflicts on four artifacts. Regenerate from the merged tree to resolve |
| `system-spec-kit` node_modules (vitest 4.1.11) | Internal | Green | Tests cannot run |
| Owner's answer on the miss shape | Internal | Yellow | Nothing built. REQ-005 closes when the options are recorded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the exemption lets through a document it should not, `--check` reports stale on a fresh tree, a lookup test fails or a Gate 1 lookup returns fewer scoring rows than before the rebuild.
- **Procedure**: `git revert` the offending commit. The code commit and the regeneration commit are separate, so each reverts alone. After reverting the code commit, run the no-flag generator from a `git archive` of HEAD so the committed artifacts match the restored code.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (reproduce, baseline) ──► Exemptions ──► Sidecar defaults ──► Shared helper + --check ──► Measure ──► Regenerate ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Exemptions |
| Exemptions | Setup | Regenerate |
| Sidecar defaults | Setup | Shared helper and `--check` (scratch builds must be safe first) |
| Shared helper and `--check` | Sidecar defaults | Measure |
| Measure | Shared helper and `--check` | Regenerate |
| Regenerate | Exemptions, `--check`, Measure | Verify |
| Verify | Regenerate | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 3 to 4 hours |
| Verification | Low | 1 hour |
| **Total** | | **4.5 to 5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The code commit and the regeneration commit are separate, so either reverts alone
- [ ] `trigger-index.vitest.ts` passes on the code commit before the regeneration runs
- [ ] No push and no merge: every commit stays on the worktree branch

### Rollback Procedure
1. If the CI step misreports, revert the commit that added it. It is report-only, so nothing waits on it.
2. `git revert` the code commit, then the regeneration commit if that is the one at fault.
3. Rerun `trigger-index.vitest.ts` and the "deem local server" lookup to confirm the restored state.
4. No stakeholder notice. Nothing is pushed or merged in this phase.

### Data Reversal
- **Has data migrations?** No. The index and fixtures are generated files.
- **Reversal procedure**: rerun the no-flag generator from a `git archive` of HEAD after the revert.
<!-- /ANCHOR:enhanced-rollback -->

---
