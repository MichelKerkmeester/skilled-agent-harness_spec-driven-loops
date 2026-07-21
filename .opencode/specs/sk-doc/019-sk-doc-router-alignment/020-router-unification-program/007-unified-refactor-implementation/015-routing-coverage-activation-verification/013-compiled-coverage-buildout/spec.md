---
title: "Feature Specification: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "Build full compiled-router coverage for the thin/stale hubs (sk-code, cli-external-orchestration, mcp-tooling, sk-prompt, then sk-doc/system-deep-loop post-remint) so compiled routing matches legacy on every scenario, fix two over-detection bugs, re-mint two stale manifests, then stage the per-hub default-on flip."
trigger_phrases:
  - "compiled routing coverage buildout"
  - "compiled router default-on flip"
  - "compiled-serving parity"
  - "sk-code compiled router coverage"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:49:16Z"
    last_updated_by: "claude"
    recent_action: "Reconciled spec.md status to Complete (matches implementation-summary.md; 7dfffa0c93)"
    next_safe_action: "None; 011-activation-cutover-p4 (P4, operator-gated) consumes this coverage"
    blockers: []
    key_files:
      - ".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs"
      - ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs"
      - "system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the safe defer-to-legacy contract (root cause 4) need a fix before Path 1, or is it a Path-2-only concern?"
    answered_questions:
      - "Path 1 (build full coverage) vs Path 2 (byte-identical via fallback): Path 1 chosen, no concessions."
---
# Feature Specification: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The compiled skill-router mechanism is byte-identical to legacy where it has coverage, but coverage was only built out for sk-design (36 matches, 0 defers, verified real parity run). The other six hubs are thin or stale, so none meets the program's own flip gate: `compiled-serving`, meaning compiled routes match legacy on every scenario in the hub's route-gold set. This packet builds full compiled-routing coverage for the thin hubs (sk-code, cli-external-orchestration, mcp-tooling, sk-prompt), fixes two over-detection bugs (sk-design TV-003, mcp-tooling MT-008), re-mints two stale manifests (sk-doc, system-deep-loop) and builds their coverage, then stages the per-hub default-on flip.

**Key Decisions**: Path 1 (build full coverage, no concessions) chosen over Path 2 (byte-identical via legacy fallback) and Path 3 (hold, rejected by operator). See `decision-record.md` ADR-001.

**Critical Dependencies**: sk-design's `006-parent-hub-rollout/006-sk-design` compiler as the proven reference implementation; the frozen scorer trio (read-only); the non-frozen route-gold parity harness.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete. All 7 hubs (sk-code, sk-design, sk-doc, sk-prompt, mcp-tooling, system-deep-loop, cli-external-orchestration) reached `compiled-serving` parity (0 drift each) and the staged default-on flip landed — `DEFAULT_ON_HUBS` populated in both resolver copies, commit `7dfffa0c93`. See `implementation-summary.md` for the full 6-commit delivery record. |
| **Created** | 2026-07-21 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A real parity run (`SPECKIT_COMPILED_ROUTING=1`, route-gold on) shows the compiled router mechanism works and is byte-identical to legacy on covered prompts, but compiled routing **coverage** was only built out for sk-design. sk-code matches 3 scenarios and safe-defers 19; cli-external-orchestration matches 3 and defers the rest; mcp-tooling matches 1, safe-defers 8, and has one unsafe over-detection (MT-008); sk-prompt matches 0; sk-doc and system-deep-loop have stale manifests and cannot even be evaluated. None of the seven hubs meets the flip gate (`compiled-serving`) today, not because the router is broken, but because the thin hubs defer most real prompts back to legacy.

### Purpose

Grow every thin or stale hub's compiled policy to the same production-grade coverage sk-design already has, fix the two known over-detection bugs, then stage the default-on flip only for hubs that are genuinely `compiled-serving`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build compiled routing coverage for sk-code, cli-external-orchestration, mcp-tooling, and sk-prompt (thin today: 3, 3, 1, and 0 matches respectively) so each reaches `compiled-serving`.
- Fix the sk-design TV-003 over-detection bug (compiled adds `foundations` when legacy routes only `[interface]`).
- Fix the mcp-tooling MT-008 over-detection bug (compiled adds `md-generator` when legacy routes only `[mcp-refero]`; compiled currently fails gold).
- Re-mint the sk-doc (generation 5) and system-deep-loop (generation 3) stale manifests, then build their compiled coverage once fresh.
- Stage the per-hub default-on flip once every hub reaches `compiled-serving` parity: persist `DEFAULT_ON_HUBS` in both resolver copies, move the 7 `SKILL.md` directives and both create-skill parent templates and catalog wording lockstep.
- Level-3 verification documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) and generated metadata for this packet.

### Out of Scope

- Editing the 3 frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) - never in scope, any phase.
- Changing what legacy routes - coverage is built to match legacy, never by changing legacy's decisions.
- Flipping any non-hub skill (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode) - these are not part of the seven-hub cohort.
- Touching the 2 pre-existing strays (`mcp-tooling/008-mcp-aside/…`, `system-deep-loop/032-…`) - explicitly out of scope per the goal doc.
- Merging this worktree to v4 - operator-gated, out of scope for this packet.
- The `defer` contract fix (root cause 4) and the harness bar fix (root cause 5) - these are Path-2-only concerns; Path 1 converts defers into real matches instead (see `decision-record.md` ADR-001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/lib/registry-compiler.cjs` | Modify | Grow detectors per hub so compiled routes reach legacy parity |
| `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/lib/router.cjs` or `canary-router.cjs` | Modify | Route the newly compiled destinations |
| `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/fixtures/canary-cases.v1.json` | Modify | Extend canary coverage to the hub's full scenario set |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Modify | Add a safe re-mint/refresh path (write current `{gen+1, hash}`) |
| sk-design `006-sk-design/lib/registry-compiler.cjs` (TV-003) and mcp-tooling's compiler (MT-008) | Modify | Remove the extra over-detected target |
| `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` (+ authored twin) | Modify | Persist `DEFAULT_ON_HUBS` per hub at flip time |
| 7 hub `SKILL.md` files + 2 create-skill parent templates + catalog wording | Modify | Move the default-on directive lockstep with the flip |
| This packet's `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` | Create | Level-3 documentation for the build-out program |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Build compiled coverage for sk-code, cli-external-orchestration, mcp-tooling, and sk-prompt so each reaches `compiled-serving`. | Route-gold parity run shows compiled == legacy on every scenario for the hub; 0 unsafe-misroute; 0 defer-on-covered. |
| REQ-002 | Fix the sk-design TV-003 over-detection bug. | Compiled routes `[interface]` (not `[interface, foundations]`) on the TV-003 scenario; both gold-pass. |
| REQ-003 | Fix the mcp-tooling MT-008 over-detection bug. | Compiled routes `[mcp-refero]` (not `[md-generator, mcp-refero]`) on the MT-008 scenario; compiled passes gold. |
| REQ-004 | Re-mint the sk-doc and system-deep-loop manifests. | Manifest `{generation, effectivePolicyHash}` equals `compileCanonicalParent(current authored inputs)` for both hubs. |
| REQ-005 | Build compiled coverage for sk-doc and system-deep-loop after re-mint. | Both hubs reach `compiled-serving` on their full scenario sets. |
| REQ-006 | Never change what legacy routes while building coverage. | Legacy decision output is byte-identical before and after every hub's build-out. |
| REQ-007 | Keep the 3 frozen scorer files untouched. | SHA-256 of `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` unchanged start to end. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Persist the staged per-hub default-on flip once every hub is `compiled-serving`. | `DEFAULT_ON_HUBS` populated in both resolver copies; 7 `SKILL.md` directives + 2 create-skill parent templates + catalog wording moved lockstep. |
| REQ-009 | Prove per-hub reversibility. | `SPECKIT_COMPILED_ROUTING=0` restores fleet-wide legacy behavior; per-hub cohort removal restores that hub byte-for-byte. |
| REQ-010 | Keep the fleet vitest suite green throughout. | 18-file / 247-test vitest suite passes after each hub's build-out. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 hubs report parity sub-verdict `compiled-serving` (compiled == legacy on every scenario, 0 unsafe-misroute, 0 defer-on-covered).
- **SC-002**: The staged default-on flip lands for all 7 hubs with `SPECKIT_COMPILED_ROUTING=0` as the documented fleet-wide kill-switch.
- **SC-003**: `validate.sh --strict` reports Errors:0 for this packet and for every touched hub's own packet.
- **SC-004**: The 3 frozen scorer SHA-256 hashes are unchanged from start to end of the program.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-design `006-sk-design` compiler (562 lines, 36 matches, 0 defers) | No proven reference pattern to copy per hub | Model every hub's detectors and router directly on sk-design's structure. |
| Dependency | Non-frozen parity harness (`compiled-routing-parity.cjs`) | Cannot measure `compiled-serving` without it | Treat it as editable infrastructure; never touch the 3 frozen scorer files it wraps. |
| Risk | Manifest re-mint has no existing refresh tool (`mint` is create-if-absent only) | sk-doc/system-deep-loop stay unevaluable | Build a safe refresh path (write current `{gen+1, hash}`) or hand-regenerate and verify via the freshness check. |
| Risk | Growing detectors accidentally adds a target legacy does not route | New unsafe-misroute bugs, same class as TV-003/MT-008 | Route-gold parity after every detector change; block on any unsafe-misroute before moving to the next hub. |
| Risk | Flipping a hub before it is genuinely `compiled-serving` | Silent behavior drift from legacy | Flip gate is hard: no hub flips until its own parity run is 100% `compiled-serving`. |
| Risk | Session context is heavy or post-compaction (noted in the diagnosis handoff) | Execution quality degrades mid-program | Run each hub's build-out as a fresh session using `compiled-routing-coverage-diagnosis.md` as the technical handoff. |
| Risk | sk-doc and system-deep-loop `SKILL.md` lack the literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array the shared compiler requires (discovered during a real refresh attempt) | Re-mint fails closed with `FALLBACK_CHECKLIST_MISSING`; REQ-004/REQ-005 blocked | Add the array to both `SKILL.md` files, modeled on `sk-code/SKILL.md:70`, as its own reviewed change (touches legacy routing surface) before retrying re-mint. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Route-gold parity runs complete in bounded time per hub; detector growth does not introduce runaway matching complexity.

### Security
- **NFR-S01**: No runtime routing path reads under `.opencode/specs` at any point during or after the build-out.
- **NFR-S02**: Compiled routing never adds a target that legacy would not route (compiled route set stays a subset of legacy's).

### Reliability
- **NFR-R01**: `SPECKIT_COMPILED_ROUTING=0` restores fleet-wide legacy behavior with zero code changes required.
- **NFR-R02**: Per-hub cohort removal restores that hub's behavior byte-for-byte, independent of the other six hubs.

---

## 8. EDGE CASES

### Data Boundaries
- Ambiguous prompt (ties between two destinations): compiled must clarify or defer, matching legacy's own tie-break behavior, not silently pick a target.
- Forbidden or out-of-scope prompt: compiled must reject or defer before scoring, matching legacy.
- Prompt with zero routing signal: compiled must defer (fall back to legacy), never guess a destination.

### Error Scenarios
- Manifest re-mint fails freshness check: treat sk-doc/system-deep-loop as still stale; do not attempt coverage build-out until `{generation, effectivePolicyHash}` matches `compileCanonicalParent(current inputs)`.
- Route-gold parity finds a new unsafe-misroute after a detector change: block that hub's progress; fix before moving to the next phase.
- A hub's `SKILL.md` directive is moved to default-on before its parity run is `compiled-serving`: treat as a hard failure of the flip gate; revert that hub's cohort entry immediately.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 6 hubs x {compiler, router, fixtures} + manifest refresh path + resolver/sync/SKILL.md/templates; Systems: 7 compiled-routing packages |
| Risk | 20/25 | Auth: N/A; API: N/A; Breaking: Y - default-on flip changes live routing behavior for 7 production skill hubs |
| Research | 12/20 | Reference pattern proven (sk-design); root causes already diagnosed; per-hub detector research still required |
| Multi-Agent | 10/15 | Workstreams: sk-code pilot, 3-hub replicate, TV-003 + re-mint, sk-doc/system-deep-loop coverage, staged flip |
| Coordination | 12/15 | Dependencies: staged flip blocked on all 6 hub build-outs completing; stop-on-first-failure ordering |
| **Total** | **76/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Growing a hub's detectors introduces a new unsafe-misroute (over-detection), same class as TV-003/MT-008 | H | M | Route-gold parity after every detector change; block before moving to the next hub |
| R-002 | Re-mint mechanism does not exist yet; hand-regeneration risks a wrong freshness hash | M | M | Verify manifest `{generation, effectivePolicyHash}` against `compileCanonicalParent` before trusting re-mint output |
| R-003 | A hub's default-on directive moves before genuine `compiled-serving` parity | H | L | Hard flip gate: 100% `compiled-serving` required per hub before its `SKILL.md` directive moves |
| R-004 | Frozen scorer files edited by accident during harness work | H | L | SHA-256 diff check on the 3 frozen files before every commit |
| R-005 | Session context heavy or post-compaction degrades multi-hub build quality | M | M | Run each hub's build-out fresh, using the diagnosis doc as technical handoff |

---

## 11. USER STORIES

### US-001: Genuine Compiled Coverage (Priority: P0)

**As a** router-unification program owner, **I want** every hub's compiled router to route identically to legacy on its full scenario set, **so that** the default-on flip changes zero observable routing behavior.

**Acceptance Criteria**:
1. Given a hub's route-gold scenario set, When compiled routing runs with `SPECKIT_COMPILED_ROUTING=1`, Then every scenario matches legacy with 0 unsafe-misroute and 0 defer-on-covered.

### US-002: Reversible Default-On (Priority: P1)

**As a** maintainer auditing the fleet after the flip, **I want** a documented, per-hub reversible kill-switch, **so that** any hub can fall back to legacy without redeploying.

**Acceptance Criteria**:
1. Given `SPECKIT_COMPILED_ROUTING=0` or a per-hub cohort removal, When routing runs again, Then behavior is byte-for-byte identical to pre-flip legacy.

---

## 12. OPEN QUESTIONS

- Does the `defer` contract inconsistency (root cause 4: the engine intends `defer` to mean legacy fallback, but `sk-code/SKILL.md:56` maps `defer` to disambiguate) need a fix under Path 1, or is it strictly a Path-2-only concern? Current read: Path 1 does not require it, since Path 1 converts defers into real `match` outcomes rather than relying on the defer-to-legacy fallback contract.
- RESOLVED: What is the exact re-mint mechanism for sk-doc/system-deep-loop? A `refresh` verb was built on `compiled-route-manifest.cjs` (16/16 tests pass), following the `mint` verb's safety-helper pattern. Applying it surfaced a new, real blocker: both hubs' `SKILL.md` lack the `UNKNOWN_FALLBACK_CHECKLIST` array the compiler requires (see the new risk row in section 6).
- Should the `SKILL.md` fallback-checklist fix land as its own reviewed change ahead of Phase 3, or fold into Phase 4 as its first task? Tracked as `tasks.md` T013b; not yet decided.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
