---
title: "Feature Specification: Phase 8 — routing benchmark and review"
description: "Benchmark the hub's routing with the deterministic skill-benchmark and run a family deep-review; remediate what both surface. The review found zero real router defects; the low first score was a measurement artifact, so the harness was re-layered for thin hubs and its negative-scoring corrected, taking the honest router-mode verdict from a flat-era 44 to 71, plus a merge-blocking canary gate and four cheap defects were repaired."
trigger_phrases:
  - "sk-code routing benchmark"
  - "sk-code family deep-review"
  - "skill-benchmark hub re-layer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/008-routing-benchmark-and-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Benchmarked hub routing, ran a three-lens family deep-review, re-layered the skill-benchmark harness for hubs + fixed its negative-scoring, and repaired a merge-blocking canary gate"
    next_safe_action: "phase 009 cutover-and-rollout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8 — routing benchmark and review

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` integration work |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | ../007-advisor-and-integration/spec.md |
| **Successor** | ../009-cutover-and-rollout/spec.md (planned) |
| **Handoff Criteria** | Router-mode benchmark scored honestly against the hub; family deep-review complete with every P0/P1 confirmed against the real files and either remediated or documented as deferred; the merge-blocking canary gate restored; zero net-new harness-test failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-code parent-skill conversion — the **routing-benchmark-and-review step** after 007 integrated the advisor node and repaired the reference breakage. Its job is to prove the restructured hub routes correctly and to remediate whatever the benchmark and a family deep-review surface, before the 009 cutover removes the safety-net alias.

Two verification instruments were run:

1. **The deterministic routing benchmark** (deep-improvement Lane C, router mode). This is the offline CI gate: `router-replay.cjs` reads the real `hub-router.json` + `mode-registry.json` and replays the manual-testing-playbook scenarios with no model in the loop. D5 connectivity independently confirms zero orphaned routable docs.
2. **A three-lens family deep-review** — three independent read-only agents over (a) structural contracts + invariants, (b) folded doctrine + reference integrity, (c) routing root-cause.

The review's central finding: **the routing itself is correct.** In 9 of 10 apparent benchmark failures the router selected the right mode; the low first-run aggregate (51) was a *measurement* artifact of scoring a thin hub at the wrong layer. That produced a scope decision (accepted by the user): fix the shared harness inside this packet rather than defer it.

Two harness corrections followed:

1. **Resource recall at the surface layer.** A thin hub defers resources to its mode packets and emits only packet pointers, so router-mode resource recall read as ~0 for a correct hub. The retained surface router (`shared/references/smart_routing.md`) still holds the per-surface `INTENT_SIGNALS`/`RESOURCE_MAP`. The replay now picks the mode from the hub router (mode telemetry preserved) and recalls resources from the surface router — reviving the existing surface-slicing. The branch is add-only and gated on surface-router presence, so every flat skill and any sibling hub without such a doc is a verified no-op.
2. **Negative-activation scoring.** The scorer treated a scenario's positive "should-load" set as the *forbidden* set, so a scenario that routed exactly what it should scored 0. The "Expected NOT loaded" block is now parsed into a real forbidden set (glob-prefix matched); a suppression scenario is credited on recall of its positive set and fails only on an actual forbidden leak.

The review also found one **P1 merge-blocker**: the folded review package's Iron-Law canary (`check-rule-copies.js`) still pointed at the thin hub's `SKILL.md`, where the relocated Iron-Law statement no longer lives, so the CI canary (wired on PR→main) was failing closed and would have redded the merge PR. Repointed and restored.

**Scope Boundary**: benchmark, review, and remediate routing + the harness that measures it. Do NOT run the live-mode benchmark (needs model dispatch; router mode is the deterministic gate). Do NOT migrate the pre-existing flat-layout harness-test failures (009 regression pass). Do NOT generalize the design-family vocab guard or change the CS-003 matcher (009).

**Deferred to later phases**:
- **Eight pre-existing harness-test failures** (flat/pre-fold-layout casualties, red since 004/005) → 009 regression pass.
- **`parent-hub-vocab-sync` generalization** (design-hardcoded → registry-derived) and the **CS-003 word-boundary matcher** → 009. Neither moves the verdict.
- **Advisor rebuild + memory reindex** → main post-merge (unchanged from 007).

**Deliverables**:
- Official router-mode benchmark record (aggregate 71) captured under `benchmark/router-final/`.
- Harness re-layer + negative-scoring fix with vitest coverage, zero net-new failures.
- The P1 canary gate restored; four cheap in-family defects fixed.
- Phase 008 documentation and metadata.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The restructured hub had never been benchmarked or reviewed as a family. The first benchmark scored a CONDITIONAL 51 — but that number conflated a correct hub with a harness that measured resources at the flat layer the restructure had abandoned, and a scorer that inverted the negative-activation gold. Shipping to 009 on an artifact score, or on an unreviewed hub, would remove the alias safety-net without a trustworthy signal that routing works.

### Purpose
Produce an honest routing verdict: run the deterministic benchmark, review the family with independent lenses, separate real defects from measurement artifacts, and remediate both the one real merge-blocker and the harness that was lying — so 009 can cut over on a signal that reflects the hub, not the old layout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the deterministic router-mode skill-benchmark against the hub; capture the official record.
- Run a three-lens family deep-review; confirm every finding against the real files.
- Re-layer the shared skill-benchmark harness so a thin hub's resource recall is measured at the surface-router layer (add-only, presence-gated).
- Fix the harness negative-activation scoring (parse a real forbidden set; credit positive-set recall) with vitest coverage.
- Restore the P1 Iron-Law canary gate (`check-rule-copies.js`): repoint to `code-verify`, relax the matcher.
- Fix four cheap in-family defects (a broken fixture placeholder, a broken link, stale router paths, a stale count).
- Document the phase.

### Out of Scope
- The live-mode benchmark (model dispatch; router mode is the deterministic gate).
- Migrating the eight pre-existing flat-layout harness-test failures (009).
- Generalizing `parent-hub-vocab-sync` off the hard-coded design family (009).
- Changing the CS-003 substring matcher to word-boundary (009).
- Advisor-graph rebuild + memory reindex (main post-merge).

### Files Changed
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Update | Two-layer hub routing: surface-router resource recall + packet/shared existence roots (add-only, presence-gated) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Update | Score suppression scenarios against a real forbidden set; credit positive-set recall |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Update | Parse the "Expected NOT loaded" block into a forbidden-prefix set |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Update | Correct the negative-scoring test; add a positive-set regression test |
| `.opencode/skills/sk-code/code-review/scripts/check-rule-copies.js` | Update | **P1**: repoint the Iron-Law canary to `code-verify/SKILL.md`; relax the matcher to "≥1 line carries both concepts" |
| `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/opencode-config.md` | Update | Fix an unsubstituted `<spec-folder>` fixture placeholder |
| `.opencode/skills/sk-code/code-review/manual_testing_playbook/manual_testing_playbook.md` | Update | Fix a broken CR-018 link |
| `.opencode/skills/sk-code/benchmark/README.md` | Update | Repoint two stale `smart_routing.md` paths to `shared/references/` |
| `.opencode/skills/sk-code/code-review/SKILL.md` | Update | Fix a stale sub-file count |
| `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.{md,json}` | Update | Regenerated official router-mode record (aggregate 71) |
| `.opencode/specs/sk-code/001-sk-code-parent/008-routing-benchmark-and-review/` | Create | Phase 008 documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Honest routing verdict | The official router-mode record is generated by the real hub configs (`hub-router.json` + `mode-registry.json`), not a flat-layout stand-in, and the aggregate reflects post-fix scoring |
| REQ-002 | Restore the canary gate | `check-rule-copies.js` exits 0 against the current tree (was exit 1, CI-wired on PR→main) |
| REQ-003 | No net-new test failures | The harness changes add zero failures vs a pristine-harness baseline |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Re-layer is add-only | The hub branch is a verified no-op for every skill without a surface router (only `sk-code` has one); mode telemetry (`workflowMode`) is preserved |
| REQ-005 | Negative-scoring corrected | Suppression scenarios are scored against a parsed forbidden set; a scenario that routes exactly its positive set is not penalized; a no-positive/no-forbidden disambiguation scenario stays neutral |
| REQ-006 | Findings confirmed, not assumed | Every review P0/P1 is verified against the real files before action; artifacts are distinguished from defects |
| REQ-007 | Deferrals documented | The eight pre-existing test failures, the vocab-sync generalization, and the CS-003 matcher are recorded as 009 work with rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `benchmark/router-final/skill-benchmark-report.{md,json}` records `verdict=CONDITIONAL aggregate=71 scenarios=29`, generated via `loop-host.cjs --mode=skill-benchmark --skill=sk-code --trace-mode=router`.
- **SC-002**: Aggregate rose 44 (flat) → 71 (hub): D1-intra 73→87, D2 55→79, D3 27→47, D5 100.
- **SC-003**: `check-rule-copies.js` exits 0; the Iron-Law canary resolves against `code-verify/SKILL.md`.
- **SC-004**: A pristine-harness baseline (my three files stashed) = 8 failures; with the changes = 8 failures (99 tests) — zero net-new.
- **SC-005**: The re-layer is a no-op for every skill without `shared/references/smart_routing.md`; only `sk-code` has one.
- **SC-006**: Comment-hygiene passes on all four edited `.cjs`/`.js` files (the restored pre-commit gate).
- **SC-007**: Phase 008 docs record the benchmark delta, the re-layer + negfix, the P1 canary fix, and the deferrals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- Not a research phase; the benchmark + review supply the evidence.

### Track C — deep-context
- Confirm the router selects the correct mode for the apparent benchmark failures (root-cause: artifact vs defect).
- Confirm the harness re-layer preserves mode telemetry and is a no-op for non-hub skills.
- Confirm the negative-scoring fix credits a correct positive-set route and only fails a real forbidden leak.
- Confirm the eight remaining test failures pre-date this phase (pristine-harness baseline).
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gaming the benchmark by flattening the gold | ~100 score that erases surface/language discrimination | Re-layer the harness to measure the hub honestly instead of rewriting the gold |
| Risk | Harness change breaks other skills' scores | Silent regression across the suite | Add-only, presence-gated hub branch; verified only `sk-code` has a surface router; pristine baseline confirms zero net-new failures |
| Risk | Acting on an unverified review finding | Wrong fix | Finding = hypothesis; every P0/P1 confirmed against the real files; ran the canary directly |
| Risk | Scoring correct routing as a leak | False negatives persist | Parse a real forbidden set; credit positive-set recall; neutral for no-positive/no-forbidden scenarios |
| Dependency | 007 advisor integration | Complete | Hub router + registry are the benchmark inputs |
| Dependency | deep-improvement Lane C harness | In-repo | Router-mode replay + scorer are the instrument (and the thing repaired) |
| Dependency | 009 cutover | Pending | Consumes this honest verdict before removing the alias |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- The live-mode verdict (D1-inter routing under real dispatch + D4 usefulness) is unmeasured here by design; router mode is the deterministic gate and the live pass is a separate, model-dispatched run out of this phase's scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- Add L2/L3 addendums for complexity
-->
