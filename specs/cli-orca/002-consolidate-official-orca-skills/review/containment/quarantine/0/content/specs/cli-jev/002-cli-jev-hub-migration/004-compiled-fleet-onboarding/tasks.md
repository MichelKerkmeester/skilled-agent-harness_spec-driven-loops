---
title: "Tasks: Phase 4: compiled-fleet-onboarding"
description: "Ordered task list for the hub's compiled-fleet onboarding: freeze the hub's routing inputs, build and verify its rollout child, wire the six fleet surfaces, mint both activation trees, prove serving and rollback with the fleet's own tools, and re-run the hub's gates after its doc pass."
trigger_phrases:
  - "phase tasks"
  - "compiled fleet onboarding"
  - "verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/004-compiled-fleet-onboarding"
    last_updated_at: "2026-09-20T15:55:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Task list authored at closeout from the executed phase"
    next_safe_action: "Run phase 005: re-run the hub and transport playbooks from the new home"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-004-compiled-fleet-onboarding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: compiled-fleet-onboarding

<!-- SPECKIT_LEVEL: 1 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the fleet baseline read-only before touching anything: the foundation suite at 4 failed / 33 passed, the manifest suite at 16 failed / 26 passed with all sixteen names recorded, admission green on five hubs, status listing five, and the guard reporting `sk-doc stale-manifest` (`.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/bin/tests/compiled-route-manifest.test.cjs`, `.skilled/bin/compiled-route-{admission,status,guard}.cjs`)
- [x] T002 Read the cloned model and the fleet surfaces' exact shapes: the 004 child's harness, compiler, router, policy card and fixture, the engine's `HUB_CHILD`, the resolver's cohort, the advisor flag source and its dist twin, the guard and sync hub lists, and the serving-closure record (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/`)
- [x] T003 Establish the two constraints that shape the build: the generic `001-sk-code` compiler's `PACKET_AUTHORITY` map knows only `workflow` and `surface`, so the CLI's `mint` verb cannot compile a transport-only hub, while the freshness and refresh paths prefer the hub's own shadow child and therefore can (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`, `.skilled/bin/lib/compiled-route-manifest.cjs`)
- [x] T004 Replay the hub's authored gold through the compiled contract before editing anything: CJ-001's shipped prompt deferred rather than routed, CJ-003's `expected_workflow_mode: null` parses as a mode named null instead of a no-route label, and CJ-002 resolved as declared (`.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Freeze the hub's routing inputs: version `0.2.0.0` across `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json` and `description.json`, the changelog link repointed, and the scaffold paragraph removed from `SKILL.md` because the directive it declared inert is now live (`.skilled/skills/cli-jev/`)
- [x] T006 Fix the two hub-routing gold defects the replay exposed: CJ-001 asks with a phrase the hub vocabulary carries and states the served expectation, and CJ-003's gold names the `none` label (`.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md`, `out-of-domain-resolves-nothing.md`)
- [x] T007 Clone the rollout child from the 004 model and repoint every hub identity mechanically across the harness, the compiler, the router and the policy card, then hand-repoint the harness's source list to the hub's four inputs and give the hub its own policy-card marker, clarify text and budget reference (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/`)
- [x] T008 Author the canary corpus: four judgment requests that must route `cli-usage`, a defer, an alias-narrowness defer and a forbidden reject, at activation generation 1 (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/fixtures/canary-cases.v1.json`)
- [x] T009 Build the child's artifacts and correct its authority assertion: the harness reports six compiled and five activation artifacts at `status: built`, the policy hash is `3240ebf5…` with graph hash `fda05c50…`, and all seven canary cases match their authored expectations (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/harness/build-artifacts.cjs`)
- [x] T010 Wire the engine dispatch map and the resolver cohort, with the cohort prose distinguishing the five that cut over together from the hub that joined at its own first activation (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`, `resolve.cjs`)
- [x] T011 Wire the advisor flag source's eligibility set and default-on cohort and rebuild its gitignored twin through the package's own build rather than by hand, then verify both sets carry the sixth hub (`.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`, `runtime/dist/runtime/lib/compiled-routing-flag.js`)
- [x] T012 Wire the guard's and the sync tool's hub lists, and update the serving-closure record to six hubs and 55 files with the child's five source files and the two activation files (`.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`)
- [x] T013 Move the fleet lockstep assertions from five hubs to six: the cohort length, the order-identity comment, the file's own header, the move-simulation message, seven `all N hubs resolve` expectations and the cohort-size assertion (`.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/bin/tests/compiled-route-manifest.test.cjs`)
- [x] T014 Mint the live activation pair through the library's canonical bytes: manifest at generation 1 with `servingAuthority: "compiled"` and a fence epoch of 1, matching the policy the engine computes (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json`, `fence-state.json`)
- [x] T015 Write the authored mirror — manifest and fence state byte-identical, the pre-activation manifest, the rollback copy, the activation record with the four real source hashes, and the flip record — and verify freshness plus refresh idempotence (`.skilled/bin/lib/compiled-routing/013-live-activation/`, `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-jev/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run admission over the fleet: every hub passes, `cli-jev` records 3 scenarios with 0 drift and 0 stale under complete `cli-usage` coverage, and the tool exits 0 (`.skilled/bin/compiled-route-admission.cjs`)
- [x] T017 Run status and the guard: the fleet lists six hubs with `cli-jev compiled-serving` at generation 1 and fence epoch 1, and the guard reports the new hub `fresh` alongside the five incumbents (`.skilled/bin/compiled-route-status.cjs`, `compiled-route-guard.cjs`)
- [x] T018 Probe the front door three ways: a compiled route for a judgment request under an unset flag, a compiled defer for an out-of-domain prompt, and the legacy sentinel under `SPECKIT_COMPILED_ROUTING=0` (`.skilled/bin/compiled-route.cjs`)
- [x] T019 Rehearse the rollback against the recorded copy: write `manifest.serving-prior.json` over the live manifest, confirm status reports `legacy-authority` and the front door the sentinel, then restore the recorded bytes and confirm byte-identity and `compiled-serving` again (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json`)
- [x] T020 Re-run both fleet suites and diff against the baseline: the foundation suite still reports the same four failures and the manifest suite the same sixteen, with no assertion that passed before now failing (`.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/bin/tests/compiled-route-manifest.test.cjs`)
- [x] T021 Run the hub's own gates after its doc pass: the doctor exits 0 with 42 `PASS` and 0 warnings including the version rules, and the package validator passes all three sub-checks with `compiled-ready` where it previously reported `legacy (no manifest)` (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`)
- [x] T022 Write the hub's `v0.2.0.0` changelog entry and re-check the version rules against it (`.skilled/skills/cli-jev/changelog/v0.2.0.0.md`)
- [x] T023 Record the limitations with their evidence: the archived authored resolver, sk-doc's stale manifest, the four fleet-count prose sites owned by other hubs, the `.hermes` mirror, and the two deliberate deviations from the cloned child (repo root)
- [x] T024 Author the phase documents, update the parent packet's phase map and continuity, then run `repair-derived.cjs --apply` and the recursive strict validator (`.skilled/skills/system-spec-kit/runtime/cli/spec/`, `specs/cli-jev/002-cli-jev-hub-migration/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
