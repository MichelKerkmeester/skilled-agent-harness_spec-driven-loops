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
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Sequenced the minter foundation into implementation and verification tasks"
    next_safe_action: "Capture baselines, then implement the shared module before its consumers"
    blockers:
      - "All implementation tasks are pending."
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 0
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

All tasks are Planned. A checked item requires a command, artifact, or file citation in `implementation-summary.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current compiled-routing test baseline and per-suite counts. (`.opencode/bin/lib/compiled-routing/`)
- [ ] T002 Capture SHA-256 values for `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs`. (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`)
- [ ] T003 [P] Build a temporary create-skill parent fixture with final `SKILL.md`, `mode-registry.json`, and `hub-router.json`. (`.opencode/bin/tests/fixtures/` or test temp root)
- [ ] T004 [P] Capture the existing `compiled-route-status.cjs` record for all seven hubs to enforce additive schema compatibility. (`.opencode/bin/compiled-route-status.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `canonicalManifestPath({hubId})` with hyphen-case validation and canonical store containment. (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [ ] T006 Add `loadCanonicalRouterInputs({hubId, skillRoot})` to validate root identity and load exact final bytes. (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [ ] T007 Add `compileCanonicalParent({hubId, skillRoot, generation})` as a thin call to the existing 006 `compileRegistry()`. (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [ ] T008 Add `evaluateManifestFreshness({hubId, currentPolicy})` and `checkCanonicalManifestFreshness({hubId, skillRoot})` with structural validation, exact generation/hash comparison, stable causes, and no writes. (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [ ] T009 Add `mintCanonicalManifest({hubId, skillRoot})` with generation `1`, V1 legacy-authority bytes, atomic create-if-absent, and post-write freshness validation. (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [ ] T010 Add the `mint` and `freshness` JSON verbs, argument validation, and `0|1|2` exit mapping. (`.opencode/bin/compiled-route-manifest.cjs`)
- [ ] T011 Extend `baseRecord()` and `computeHubStatus()` with nested `manifestFreshness`; use specialized engine snapshots for the existing seven and generic compilation for new registry-driven hubs. (`.opencode/bin/compiled-route-status.cjs`)
- [ ] T012 Extend `knownHubs()` to return the union of `HUB_CHILD` keys and safe activation directory names without changing serving eligibility. (`.opencode/bin/compiled-route-status.cjs`)
- [ ] T013 Add `captureExternalActivationManifests()` and `restoreExternalActivationManifests()` around `build()` root replacement. (`.opencode/bin/compiled-route-sync.cjs`)
- [ ] T014 Keep `resolve.cjs`, `compiled-route.cjs`, `COMPILED_ROUTING_HUBS`, `DEFAULT_ON_HUBS`, and all frozen scorers unchanged. (scope audit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Add unit coverage for valid, missing, malformed, unsafe-path, hub-mismatch, compile-error, and stale inputs. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`)
- [ ] T016 Add integration coverage for first mint, immediate freshness, duplicate mint byte preservation, and input drift. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`)
- [ ] T017 Add status coverage for all seven current hubs, an explicit new hub, union discovery, and stale freshness. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`)
- [ ] T018 Add sync coverage proving byte-identical preservation and fail-closed invalid/conflicting entries. (`.opencode/bin/tests/compiled-route-manifest.test.cjs`)
- [ ] T019 Run current routing parity and fallback suites and report baseline-to-final delta. (existing compiled-routing tests)
- [ ] T020 Prove a newly minted hub still returns the legacy sentinel and no current hub routing field changes. (`.opencode/bin/compiled-route.cjs`)
- [ ] T021 Recompute frozen scorer hashes and prove exact equality with T002. (frozen scorer trio)
- [ ] T022 Run `validate.sh --strict` and reconcile all packet completion metadata only after implementation succeeds. (`012-p3-canonical-minter-foundation/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T022 tasks are checked with evidence.
- [ ] No blocker remains and no requirement is silently deferred.
- [ ] The canonical result reports fresh after mint and stale after any router-input change.
- [ ] Sync retains the exact manifest bytes.
- [ ] Existing and new-hub routing remain on their pre-change decisions.
- [ ] Strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **QA gate**: `checklist.md`
- **Architecture decisions**: `decision-record.md`
- **Planned-state record**: `implementation-summary.md`
- **Downstream consumer**: `../../013-create-skill-alignment/`
<!-- /ANCHOR:cross-refs -->
