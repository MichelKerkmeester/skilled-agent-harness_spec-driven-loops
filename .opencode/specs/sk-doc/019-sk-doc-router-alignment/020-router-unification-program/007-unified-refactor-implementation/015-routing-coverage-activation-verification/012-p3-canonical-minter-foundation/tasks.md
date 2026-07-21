---
title: "Tasks: P3 Canonical Manifest Minter Foundation"
description: "Execution tasks for the shared initial minter, exact freshness predicate, status integration, sync preservation, and byte-identical safety evidence."
trigger_phrases:
  - "canonical minter tasks"
  - "manifest freshness implementation tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T05:29:04Z"
    last_updated_by: "codex"
    recent_action: "Completed the canonical minter implementation and verification tasks"
    next_safe_action: "Hand the verified CLI contract to the create-skill consumer"
    blockers:
      - "No implementation blockers remain; later serving changes stay explicitly deferred."
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Future refresh ownership remains outside this task list."
    answered_questions:
      - "Status integration is additive and does not register a serving hub."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-architecture | v2.2 -->
# Tasks: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

All tasks are complete. Each checked item is backed by the evidence ledger in `implementation-summary.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the current compiled-routing test baseline and per-suite counts. (`.opencode/bin/lib/compiled-routing/`) [Evidence: `implementation-summary.md` records 33/33 baseline tests]
- [x] T002 Capture SHA-256 values for `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs`. (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`) [Evidence: `implementation-summary.md` records all three start hashes]
- [x] T003 [P] Build a temporary create-skill parent fixture with final `SKILL.md`, `mode-registry.json`, and `hub-router.json`. (`.opencode/bin/tests/fixtures/` or test temp root) [Evidence: focused test creates and compiles the three-input parent fixture]
- [x] T004 [P] Capture the existing `compiled-route-status.cjs` record for all seven hubs to enforce additive schema compatibility. (`.opencode/bin/compiled-route-status.cjs`) [Evidence: `implementation-summary.md` records seven baseline `flag-off` causes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `canonicalManifestPath({hubId})` with hyphen-case validation and canonical store containment. (`.opencode/bin/lib/compiled-route-manifest.cjs`) [Evidence: unsafe-ID and traversal matrix passes]
- [x] T006 Add `loadCanonicalRouterInputs({hubId, skillRoot})` to validate root identity and load exact final bytes. (`.opencode/bin/lib/compiled-route-manifest.cjs`) [Evidence: root, file, symlink, and hub mismatch cases pass]
- [x] T007 Add `compileCanonicalParent({hubId, skillRoot, generation})` as a thin call to the existing 006 `compileRegistry()`. (`.opencode/bin/lib/compiled-route-manifest.cjs`) [Evidence: source assertion and compiled fixture verify the unchanged import]
- [x] T008 Add `evaluateManifestFreshness({hubId, currentPolicy})` and `checkCanonicalManifestFreshness({hubId, skillRoot})` with structural validation, exact generation/hash comparison, stable causes, and no writes. (`.opencode/bin/lib/compiled-route-manifest.cjs`) [Evidence: fresh, stale, missing, malformed, and compiler failure tests pass]
- [x] T009 Add `mintCanonicalManifest({hubId, skillRoot})` with generation `1`, V1 legacy-authority bytes, atomic create-if-absent, and post-write freshness validation. (`.opencode/bin/lib/compiled-route-manifest.cjs`) [Evidence: first-mint, duplicate, and concurrent-writer tests pass]
- [x] T010 Add the `mint` and `freshness` JSON verbs, argument validation, and `0|1|2` exit mapping. (`.opencode/bin/compiled-route-manifest.cjs`) [Evidence: compact, pretty, failure, and usage exit assertions pass]
- [x] T011 Extend `baseRecord()` and `computeHubStatus()` with nested `manifestFreshness`; use specialized engine snapshots for the existing seven and generic compilation for new registry-driven hubs. (`.opencode/bin/compiled-route-status.cjs`) [Evidence: seven-hub and explicit new-hub status assertions pass]
- [x] T012 Extend `knownHubs()` to return the union of `HUB_CHILD` keys and safe activation directory names without changing serving eligibility. (`.opencode/bin/compiled-route-status.cjs`) [Evidence: union discovery sees the fixture while `HUB_CHILD` excludes it]
- [x] T013 Add `captureExternalActivationManifests()` and `restoreExternalActivationManifests()` around `build()` root replacement. (`.opencode/bin/compiled-route-sync.cjs`) [Evidence: isolated root replacement restores exact bytes]
- [x] T014 Keep `resolve.cjs`, `compiled-route.cjs`, `COMPILED_ROUTING_HUBS`, `DEFAULT_ON_HUBS`, and all frozen scorers unchanged. (scope audit) [Evidence: scoped diff is empty for frozen runtime sources and scorer hashes match]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Add unit coverage for valid, missing, malformed, unsafe-path, hub-mismatch, compile-error, and stale inputs. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`) [Evidence: focused contract suite passes 13/13]
- [x] T016 Add integration coverage for first mint, immediate freshness, duplicate mint byte preservation, and input drift. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`) [Evidence: CLI integration and three-axis drift assertions pass]
- [x] T017 Add status coverage for all seven current hubs, an explicit new hub, union discovery, and stale freshness. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`) [Evidence: additive status integration assertions pass]
- [x] T018 Add sync coverage proving byte-identical preservation and fail-closed invalid/conflicting entries. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`) [Evidence: sync round-trip and conflict assertions pass]
- [x] T019 Run current routing parity and fallback suites and report baseline-to-final delta. (existing compiled-routing tests) [Evidence: final 33/33 equals baseline 33/33]
- [x] T020 Prove a newly minted hub still returns the legacy sentinel and no current hub routing field changes. (`.opencode/bin/compiled-route.cjs`) [Evidence: pre/post sentinel bytes are identical in the focused suite]
- [x] T021 Recompute frozen scorer hashes and prove exact equality with T002. (frozen scorer trio) [Evidence: start and end hash table is identical in `implementation-summary.md`]
- [x] T022 Run `validate.sh --strict` and reconcile all packet completion metadata only after implementation succeeds. (`012-p3-canonical-minter-foundation/`) [Evidence: final strict validator reports 0 errors and 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T022 tasks are checked with evidence. [Evidence: `tasks.md` contains 22 checked task IDs]
- [x] No blocker remains and no requirement is silently deferred. [Evidence: limitations name all deferred serving work explicitly]
- [x] The canonical result reports fresh after mint and stale after any router-input change. [Evidence: focused suite tests all three input axes]
- [x] Sync retains the exact manifest bytes. [Evidence: isolated capture/restore round-trip compares buffers]
- [x] Existing and new-hub routing remain on their pre-change decisions. [Evidence: 33/33 regression suite plus byte-identical fixture sentinel]
- [x] Strict packet validation reports zero errors and warnings. [Evidence: final `validate.sh --strict` result]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **QA gate**: `checklist.md`
- **Architecture decisions**: `decision-record.md`
- **Implementation record**: `implementation-summary.md`
- **Downstream consumer**: `../../013-create-skill-alignment/`
<!-- /ANCHOR:cross-refs -->
