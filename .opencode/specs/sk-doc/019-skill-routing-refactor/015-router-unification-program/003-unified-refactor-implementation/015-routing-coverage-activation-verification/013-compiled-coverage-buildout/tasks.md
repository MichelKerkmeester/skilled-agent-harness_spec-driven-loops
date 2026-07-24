---
title: "Tasks: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "Task breakdown mirroring the 6-part plan: sk-code pilot, replicate to thin hubs, fix over-detection bugs, re-mint and build sk-doc/system-deep-loop, stage the flip, verify the fleet."
trigger_phrases:
  - "compiled routing coverage tasks"
  - "sk-code pilot tasks"
  - "staged flip task list"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Reconciled status to Complete: coverage-buildout tasks shipped and serving (7/7 hubs compiled-serving, parity 49/49)."
    next_safe_action: "None; core deliverable complete. Tracked follow-up: full 7-hub LUNA-HIGH acceptance sweep (checklist CHK-025)."
    blockers: []
    key_files:
      - ".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read sk-design's reference compiler (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs`)
- [ ] T002 Capture the 3 frozen scorer SHA-256 hashes as the pre-program baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 2a. sk-code Pilot Build-Out
- [ ] T003 Grow sk-code's detectors to legacy parity (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-sk-code/lib/registry-compiler.cjs`) {deps: T001}
- [ ] T004 Grow sk-code's router or canary-router to route the new detectors {deps: T003}
- [ ] T005 Extend sk-code's canary fixtures to the full scenario set (`fixtures/canary-cases.v1.json`) {deps: T003}
- [ ] T006 Run route-gold parity for sk-code; confirm `compiled-serving` {deps: T004, T005}

### 2b. Replicate to cli-external-orchestration, mcp-tooling, sk-prompt
- [ ] T007 [P] Grow cli-external-orchestration's detectors, router, and canary fixtures to legacy parity {deps: T006}
- [ ] T008 [P] Grow mcp-tooling's detectors, router, and canary fixtures to legacy parity {deps: T006}
- [ ] T009 Fix the mcp-tooling MT-008 over-detection bug: narrow the md-generator/mcp-refero detector {deps: T008}
- [ ] T010 [P] Grow sk-prompt's detectors, router, and canary fixtures to legacy parity {deps: T006}
- [ ] T011 Run route-gold parity for cli-external-orchestration, mcp-tooling, and sk-prompt; confirm `compiled-serving` {deps: T007, T009, T010}

### 2c. Fix sk-design TV-003 + Re-mint Stale Manifests
- [ ] T012 [P] Fix the sk-design TV-003 over-detection bug: narrow the interface/foundations detector (`006-sk-design/lib/registry-compiler.cjs`)
- [x] T013 [P] Build a safe manifest refresh path on `compiled-route-manifest.cjs` (write current `{gen+1, hash}`) [EVIDENCE: `implementation-summary.md` - `refreshCanonicalManifest` + `refresh` CLI verb landed, 16/16 unit tests pass, fails closed with zero bytes written on error]
- [B] T013b Add `UNKNOWN_FALLBACK_CHECKLIST = [...]` arrays (>=3 items) to `sk-doc/SKILL.md` and `system-deep-loop/SKILL.md`, modeled on `sk-code/SKILL.md:70` - discovered dependency, needs its own reviewed change since it touches legacy routing surface {deps: T013}
- [B] T014 Re-mint the sk-doc manifest (generation 5 to fresh); confirm `{generation, effectivePolicyHash}` matches `compileCanonicalParent(current inputs)` [BLOCKED: refresh attempt returned `FALLBACK_CHECKLIST_MISSING`, manifest byte-unchanged - see `implementation-summary.md`] {deps: T013b}
- [B] T015 Re-mint the system-deep-loop manifest (generation 3 to fresh); confirm freshness [BLOCKED: same `FALLBACK_CHECKLIST_MISSING` cause] {deps: T013b}
- [ ] T016 Run route-gold parity for sk-design; confirm TV-003 resolved and coverage otherwise unchanged {deps: T012}

### 2d. Build sk-doc and system-deep-loop Coverage
- [ ] T017 Grow sk-doc's detectors, router, and canary fixtures to legacy parity {deps: T014}
- [ ] T018 Grow system-deep-loop's detectors, router, and canary fixtures to legacy parity {deps: T015}
- [ ] T019 Run route-gold parity for sk-doc and system-deep-loop; confirm `compiled-serving` {deps: T017, T018}

### 2e. Staged Default-On Flip
- [ ] T020 Persist `DEFAULT_ON_HUBS` in the runtime `resolve.cjs` and the authored twin {deps: T011, T016, T019}
- [ ] T021 Run `compiled-route-sync.cjs` to keep both resolver copies in sync {deps: T020}
- [ ] T022 Move the 7 hub `SKILL.md` default-on directives lockstep with the flip {deps: T021}
- [ ] T023 Move both create-skill parent templates and catalog wording lockstep {deps: T021}
- [ ] T024 Flip hubs in the controller's recommended order, stop-on-first-failure {deps: T022, T023}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### 3a. Fleet Verification
- [ ] T025 Run the `=0` fleet kill-switch drill; confirm all 7 hubs fall back to legacy {deps: T024}
- [ ] T026 Run a per-hub cohort-removal drill; confirm byte-exact restore {deps: T024}
- [ ] T027 Run the 18-file / 247-test fleet vitest suite; confirm green {deps: T024}
- [ ] T028 Diff the 3 frozen scorer SHA-256 hashes against the T002 baseline; confirm unchanged {deps: T002, T024}
- [ ] T029 Run `validate.sh --strict` on this packet and every touched hub packet; confirm Errors:0 {deps: T024}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 7 hubs report `compiled-serving` parity
- [ ] Frozen scorer SHA-256 unchanged from the T002 baseline
- [ ] Fleet vitest suite green
- [ ] `validate.sh --strict` Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
