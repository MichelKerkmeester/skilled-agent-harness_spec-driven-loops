---
title: "Feature Specification: Maintainability and Provenance"
description: "Implementation record for the four P2 items from 007's research: benchmark packaging, vendored-fork provenance, a test-scoped local boundary fixture, and evidence-led extraction triage. Benchmark packaging and provenance are complete; the local live boundary is deferred because this sandbox denies loopback binds; no optimizer seam met the measured low-coupling bar."
trigger_phrases:
  - "maintainability and provenance"
  - "pi-cache-optimizer monolith extraction"
  - "vendored fork drift check"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/003-maintainability-and-provenance"
    last_updated_at: "2026-08-08T10:16:05Z"
    last_updated_by: "codex"
    recent_action: "Completed packaging and provenance; recorded deferrals"
    next_safe_action: "Run the provenance check on demand after future fork edits; no extraction is queued"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md", ".opencode/scripts/check-vendored-fork-provenance.mjs", ".opencode/scripts/run-local-deep-pi-boundary.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extraction is sequenced last by explicit agreement across all four research lineages, including sol's own adversarial-prioritization pass."
      - "No candidate seam met the measured low-coupling bar: prompt transforms were lowest at 60 shared identifiers and zero extension-state references; persistence measured 145 shared identifiers and one state reference."
      - "The provenance check is on-demand because it reports drift without blocking legitimate local fork patches; CI or hook scheduling remains an operational choice."
      - "The local boundary fixture is test-scoped and credential-free, but a real session could not start because binding 127.0.0.1 returned EPERM in the sandbox."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Maintainability and Provenance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-observability-and-economics |
| **Successor** | None (last phase of the 008 decomposition) |
| **Handoff Criteria** | Both vendored forks have a re-runnable provenance check, deep-pi's benchmark entry point ships, the extraction decision is evidence-backed, and the local live-boundary limitation is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the 008 "Implement Fork Improvements" decomposition, owning the four P2 items (action-list items 10 through 13) from `../../007-research-fork-improvements/research/research.md`. Its defining constraint is not technical but ordinal: `research.md`'s closing line states that no lineage recommends starting maintainability or refactoring work before the correctness and contract items, and that this ordering is a genuine agreement across all four models rather than a single model's opinion. sol's own final adversarial-prioritization iteration independently ranked its monolith finding below the correctness and persistence work.

**Scope Boundary**: Implementation was authorized for the fixed phase folder. The deep-pi surface was limited to `package.json` and the new `scripts/live-benchmark.mjs`; no pi-cache-optimizer source, tests, or package metadata were changed because no seam met the measured extraction bar. Repository tooling was added under `.opencode/scripts/` for provenance and the test-scoped local boundary attempt.

**Hard precondition**: phases 001 and 002 must both be Complete and green before any extraction work starts. Refactoring a module whose correctness contract is still being repaired means the refactor and the repair land in the same diff, and neither can be attributed when something breaks. REQ-001 makes this a gate rather than advice.

**Dependencies**:
- Phase 001's combined-host composition test and hook-level guard tests are what make extraction safe to attempt at all — without them, moving code out of `index.ts` has no behavioral net beneath it
- Phase 002's REQ-007 crossover benchmark cannot run against the shipped package until this phase's REQ-007 fixes `benchmark:live`

**Deliverables**:
- Coupling measurements for all seven candidate seams, with no extraction selected because the lowest measured seam still shared 60 identifiers
- A re-runnable provenance check for both vendored forks
- A test-scoped local provider fixture and a recorded loopback-bind deferral
- A `benchmark:live` script that exists and ships in the deep-pi package
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**10. pi-cache-optimizer's entry module mixes unrelated concerns at scale** (research Tier 2 #9, luna `f-022`, sol `f-monolith` and `f-pco-staged-modularization`; action-list item 10). `.pi/extensions/pi-cache-optimizer/index.ts` is 8,390 lines (confirmed by `wc -l`) holding prompt transforms, provider adapters, persistence, routing, diagnostics, commands, and hooks in one file, against a single 887-line test file (`tests/review-findings.test.ts`). Both lineages that raised it recommended staged extraction by *characterized* seam rather than a big-bang refactor, and both ranked it below the correctness work. Two concrete constraints exist that the research did not name and that were confirmed directly while authoring this spec. First, packaging: `package.json:18-20` ships exactly `["index.ts"]`, `pi.extensions` points at `./index.ts` (`:21-26`), and an `imports` map aliases `#extension` to the same file (`:27-29`) — every extracted module must be added to the `files` allowlist or the package ships broken. Second, provenance: this is a vendored fork of an upstream repository (`package.json:45-48`), so extraction maximizes the conflict surface against any future upstream change. Neither constraint forbids the work; both change its cost, and neither is visible from the research alone.

**11. Vendored-fork provenance and drift are entirely manual** (research Tier 2 #8; sol `f-fork-build-identity` and `f-patch-ledger`, luna `f-025`, grok `f-vendor-drift`; action-list item 11). Both `../../003-fork-and-guard-cache-optimizer/` and `../../006-fork-and-improve-deep-pi/002-vendor-and-repoint/` document byte-identical vendored copies verified at vendoring time, and nothing re-checks that afterwards. `.pi/settings.json`'s `packages` array resolves both by local path (`extensions/pi-cache-optimizer`, `extensions/deep-pi`), which is what makes them need no network — and also what means no package manager will ever notice drift. deep-pi's provenance is a pinned upstream commit (`0f1cbd8124b4fb35df97f85aa943d730f4aae549`, recorded in 006/001); pi-cache-optimizer's is a fork commit recorded in the 039 parent spec. Both are prose in a document, not a check anything runs. This is a slow-burn risk, not an active bug — all three lineages that raised it said so.

**12. One boundary regression check was substituted rather than run, for want of a credential** (research Tier 3, sol `f-credential-independent-boundary-test`; action-list item 12). `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` disclosed that `opencode/deepseek-v4-flash-free` has no live credential in this environment, so its boundary regression check was replaced by a source-level test. sol's finding is that a local Pi or provider fixture would let that check run for real without needing the credential at all. This is distinct from phase 001's combined-host composition test, which uses a `FakePi` double to prove the *ownership contract*: this item is about a local *provider* so a real Pi session can exercise the boundary end to end. The two are complementary, and REQ-006 is scoped so it does not re-do 001's work.

**13. deep-pi's declared live-benchmark script is broken in two independent ways** (research Tier 2 #6 found by sol and luna; sharpened in Tier 4 by `f-benchmark-double-broken`; action-list item 13). `deep-pi/package.json:56` declares `"benchmark:live": "node scripts/live-benchmark.mjs"`. Both defects were confirmed directly while authoring this spec: `.pi/extensions/deep-pi/scripts/` does not exist, and the package's `files` allowlist (`package.json:36-41`) is `["LICENSE", "README.md", "extensions", "tsconfig.json"]` — no `scripts` entry — so writing the missing script would still not ship it. Fixing only the first defect produces a script that works in a checkout and silently vanishes from the published package.

### Purpose
Reduce the long-term cost of maintaining two vendored forks without disturbing the correctness guarantees phases 001 and 002 establish: extract only along characterized seams and only after the floor is green, make provenance a check rather than a claim, remove the credential dependency from one disclosed verification gap, and make the benchmark entry point real so phase 002's crossover design has somewhere to run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A hard sequencing gate: no extraction work begins until phases 001 and 002 are both Complete and green
- Characterizing extraction seams in `pi-cache-optimizer/index.ts` with tests *before* moving any code, then extracting at most one seam per verified step
- Keeping the package shippable through extraction: the `files` allowlist, `pi.extensions`, and the `#extension` import map all stay correct
- A re-runnable provenance check for both vendored forks, recording upstream identity and detecting local drift
- A credential-independent local provider fixture that lets the `opencode/deepseek-v4-flash-free` boundary check run for real
- Fixing `benchmark:live` both ways: the script exists, and the packaging ships it

### Out of Scope
- **Any code change during this planning pass.** No file under `.pi/extensions/` is touched while authoring this document set
- **Starting any extraction before 001 and 002 land.** This is the whole ordering agreement across four independent research lineages, encoded here as REQ-001 rather than left as advice
- A big-bang restructure of `index.ts`. Both lineages that raised the finding explicitly recommended staged, seam-characterized extraction, and the plan follows that
- Re-doing phase 001's composition test. REQ-006 adds a local *provider* so a real session can be driven; the ownership contract itself is 001's REQ-004
- **Running** phase 002's crossover benchmark. This phase makes it possible to run by fixing the packaging; deciding to run it belongs to whoever owns 002's REQ-007
- Upstreaming any patch to `jiangge/pi-cache-optimizer` or `christopherarter/deep-pi`

### Files to Change

> On authorized implementation. This planning pass changes none of them.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | No change | Coupling measurement found no seam low-coupled enough to extract safely |
| `.pi/extensions/pi-cache-optimizer/package.json` | No change | Existing `files`, `pi.extensions`, and `#extension` import map remain untouched |
| `.pi/extensions/pi-cache-optimizer/tests/` | No change | No characterization test was needed because no seam was selected |
| `.pi/extensions/deep-pi/package.json` | Modify | `files` allowlist gains `scripts` so `benchmark:live` actually ships |
| `.pi/extensions/deep-pi/scripts/live-benchmark.mjs` | Create | The declared but absent benchmark entry point |
| `.opencode/scripts/check-vendored-fork-provenance.mjs` and `.opencode/scripts/vendored-fork-provenance.json` | Create | Re-runnable upstream-identity and shipped-file drift check for both vendored forks |
| `.opencode/scripts/run-local-deep-pi-boundary.mjs` | Create | Credential-independent, test-scoped boundary fixture; live execution deferred by loopback permission |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

> This phase's research tier is P2, but its ordering constraint is not optional. REQ-001 is a hard blocker on this phase's own work.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No extraction work starts until phases 001 and 002 are both Complete and green | `../001-correctness-floor/checklist.md` and `../002-observability-and-economics/checklist.md` P0 items all pass, and both forks' suites are re-run green from their final state rather than trusted from either phase's own report. Recorded here with the actual command output before the first seam is touched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Extraction changes no observable behavior | **Deferred: no seam was extracted.** The final full suites and phase 001 contract tests remain green; characterization tests were not created because no candidate passed the low-coupling selection bar. |
| REQ-003 | The package stays shippable at every extraction step | **Deferred with extraction:** there was no extraction step. Final `npm pack --dry-run` lists all shipped files for both forks, and `pi list --approve` resolves both local extensions. |

### P2 - Optional (defer or cut without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Extraction proceeds one characterized seam at a time, not as a restructure | **Deferred by evidence:** the lowest-coupling candidate still shared 60 identifiers, so no seam was selected and no monolith diff was introduced. The source remains independently revertible by remaining untouched. |
| REQ-005 | Both vendored forks have a re-runnable provenance and drift check | **Complete:** `.opencode/scripts/check-vendored-fork-provenance.mjs` hashes each allowlisted shipped file plus `package.json`, records deep-pi at `0f1cbd8124b4fb35df97f85aa943d730f4aae549` and pi-cache-optimizer at `5132d137ce28cb91ec12a5475832df4d5154085a`, reports drift with exit 0, and passed both deliberate-edit and clean-tree checks. |
| REQ-006 | The `opencode/deepseek-v4-flash-free` boundary check runs without a live credential | **Complete (verified in a permitting environment):** the fixture was implemented but its live session was deferred here by `listen EPERM` in the build sandbox. A later HANDOFF-driven run in a sandbox that permits loopback binds executed the real fixture end to end and exposed a genuine logic bug: `deepPiDormant` checked only the stats file's presence, but `session_shutdown` flushes stats for every model regardless of ownership, so a real run where deep-pi correctly stayed dormant (`deepPiRecordedResponses: 0`) still failed with exit 1. Fixed to check content — the sum of `responses` across all sessions/models must be zero — and reverting to the old check reproduces the exact same false failure on the same live run. Loopback-bind permission remains environment-dependent; the fixed logic is what's proven, not universal sandbox portability. |
| REQ-007 | `benchmark:live` is fixed in both of its independent failure modes | **Complete:** the script runs in its safe default skip mode, `package.json` allowlists `scripts`, and `npm pack --dry-run` lists `scripts/live-benchmark.mjs`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The ordering agreement holds in practice, not just on paper — no seam is touched before the correctness floor and the observability work are both green and re-verified
- **SC-002**: Every extraction step is independently revertible and independently evidenced, so a regression can be attributed to one seam rather than to a restructure
- **SC-003**: Fork provenance becomes something a command answers rather than something a document asserts
- **SC-004**: `benchmark:live` is closed in both failure modes; the credential-free boundary fixture is prepared but its live execution remains deferred because this sandbox denies loopback binds, with the inherited limitation preserved rather than overstated
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Extraction begins before the correctness floor is green | A refactor and a repair land in the same diff, and neither can be attributed when something breaks | REQ-001 is a hard blocker with recorded command output, not a note in the plan |
| Risk | Extraction raises the merge cost against upstream on a vendored fork | Every future upstream change conflicts across more files | Measured before any move; no seam was extracted because the lowest candidate still shared 60 identifiers, so no additional conflict surface was introduced |
| Risk | An extracted module is not added to the `files` allowlist | The package ships broken while the checkout works, exactly the failure mode item 13 already demonstrates elsewhere in this packet | REQ-003 makes `npm pack --dry-run` a per-step gate rather than a final check |
| Risk | Characterization tests are written after the move | They then characterize the new behavior, including any bug introduced by the move | REQ-002's acceptance criterion requires the test green *before* the move and forbids editing an assertion to accommodate it |
| Risk | The local provider fixture drifts from the real provider's behavior | The boundary check passes locally and the real boundary is still broken | Scope the fixture to the ownership boundary only, and keep 006/003's disclosed limitation on record rather than deleting it once the fixture exists |
| Dependency | Phases 001 and 002 | Satisfied | Both predecessor checklists were Complete; their final suites and phase 001 contract tests were re-run here |
| Dependency | `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` | It disclosed the credential gap REQ-006 attempts to close | Complete and on record; the limitation remains because loopback bind was denied |
| Dependency | Phase 002's REQ-007 crossover benchmark design | REQ-007 here is what makes it runnable against the shipped package | Designed in 002, run by whoever owns that decision, not by this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Is extraction worth its cost on a vendored fork at all?** Not on this evidence. The lowest candidate, prompt transforms, still shared 60 lexical identifiers with the rest of the module; persistence — the plan's hypothesis — shared 145 and touched one extension-state variable. With no measured low-coupling seam, the source was left untouched and no upstream conflict surface was added.
- **Which seam first?** None. Prompt transforms ranked lowest by shared identifiers (60, zero tracked extension-state references), followed by routing (106), commands (101), and persistence (145); the counts were not low enough to justify a move in an 8,390-line vendored entry file. If future upstream churn creates a concrete maintenance need, prompt transforms is the first seam to re-measure.
- **Should the provenance check run in CI, as a pre-commit hook, or on demand?** On demand for now. The script intentionally reports drift with exit 0 so a legitimate local fork patch is visible without blocking a build; scheduling it in CI or a hook is an operational follow-up, not silently chosen here.
<!-- /ANCHOR:questions -->

## 8. IMPLEMENTATION EVIDENCE

The Step 1 gate was run before any implementation: deep-pi `npm test` passed 11 files/76 tests; pi-cache-optimizer `npm test` passed 34 tests in 8 suites. Final `npm test` and `npm run typecheck` exited 0 in both forks. The phase 001 focused contract run passed 3 deep-pi composition tests plus 9 optimizer composition/guard tests.

REQ-007 is complete: `npm run benchmark:live` exits 0 in safe skip mode, and deep-pi `npm pack --dry-run` lists `scripts/live-benchmark.mjs` in a 13-file package. REQ-005 is complete: the provenance check reports clean after reverting its one-character drift self-test, with baseline hashes recorded in `.opencode/scripts/vendored-fork-provenance.json`. `pi list --approve` resolves both local extensions.

REQ-006's live session was deferred in the build sandbox (`server.listen(0, "127.0.0.1")` returned `EPERM`) and again in the HANDOFF review sandbox (`mkdtemp` denied). In a sandbox permitting both, `node .opencode/scripts/run-local-deep-pi-boundary.mjs` ran a real Pi session end to end (`piExitCode: 0`, `loopbackOnly: true`, `optimizerActive: true`) and caught a real bug: `deepPiDormant` derived from file presence alone reported `false` (failing the run) even though `deepPiRecordedResponses` was genuinely `0` — session_shutdown had written the file regardless. Fixed to derive dormancy from summed `responses` in the file's content; the same live run then reports `deepPiDormant: true` and exits 0. The optimizer extraction was not pursued: prompt transforms ranked lowest at 60 shared identifiers/0 state references, while persistence measured 145/1, so no candidate met the low-coupling bar.

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../002-observability-and-economics/spec.md`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md` (Tier 2 #6/#8/#9, Tier 3, Tier 4, and action-list items 10-13)
- **Related**: `../../003-fork-and-guard-cache-optimizer/spec.md` and `../../006-fork-and-improve-deep-pi/002-vendor-and-repoint/spec.md` (the two vendoring records REQ-005's provenance check makes checkable)
- **Related**: `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/spec.md` (the disclosed credential gap REQ-006 closes)
