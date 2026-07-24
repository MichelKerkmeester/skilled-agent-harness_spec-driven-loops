---
title: "Feature Specification: sk-doc Routing Foundation Research"
description: "Deep-research packet that diagnosed why sk-doc scored 20/100 on the Tier-2 gpt-5.6-luna skill-benchmark. Falsified the ~34-alias-gap premise (113/113 equality) and isolated the real defect: a three-part path-contract problem. Hands a dependency-ordered fix plan to sibling packet 012-sk-doc-routing-fixes."
trigger_phrases:
  - "sk-doc routing research"
  - "hub router alias coverage"
  - "skill benchmark recall sk-doc"
  - "path contract handoff sk-doc"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/010-sk-doc-routing-research"
    last_updated_at: "2026-07-16T08:08:19Z"
    last_updated_by: "claude"
    recent_action: "Closed research packet with dependency-ordered fix plan"
    next_safe_action: "Plan 012-sk-doc-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-052950-sk-doc-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: alias coverage gap falsified, 113/113 match"
      - "Q2: two coordinate systems, no handoff contract"
      - "Q3: 19-row failure classification complete"
      - "Q4: drift guard scoped to deep-loop only"
      - "Q5: 9-item dependency-ordered fix plan delivered"
---
# Feature Specification: sk-doc Routing Foundation Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (research) |
| **Created** | 2026-07-16 |
| **Branch** | `010-sk-doc-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Type** | Research packet (deep-research loop, 10/10 iterations complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tier-2 gpt-5.6-luna skill-benchmark scored sk-doc at 20/100 with roughly 19% exact-resource recall. Misses correlated with wrong path-root answers (`create-*` packet prefixes instead of root-relative `references/...` paths) and with over-bundling, including one scenario that routed 65 resources and wasted every one. Going in, the working theory was that around 34 `mode-registry.json` aliases had no literal `hub-router.json` `vocabularyClass` counterpart, making them invisible to the scorer.

### Purpose
Diagnose why sk-doc scored 20/100 against the benchmark and hand a prioritized, implementable fix plan to the packet that will build it. This is the foundation phase: findings must be actionable before the remaining skills get their own routing research.

### Outcome
The starting premise did not survive contact with the data. The current tree has 113 of 113 literal alias-to-vocabularyClass matches with zero gaps, so alias invisibility cannot explain the recall number. The ~34 figure traced back to a stale sentence in create-skill canon describing a configuration state that no longer exists.

The real defect, classified across all 19 benchmark rows, is a three-part path-contract problem: 6 rows return the wrong path root, 6 rows return the wrong or a missing leaf resource, 5 rows over-bundle (one primary failure plus four "passing" rows that hide the same waste), and 2 rows already come back clean. The root cause behind the wrong-root class is an undefined handoff between two coordinate systems that sk-doc's own authoring stack teaches side by side: packet routers emit packet-root-relative leaf IDs while the parent-hub schema declares hub-root-relative, packet-qualified addresses, and nothing says which one the public answer should use. The routing-registry-drift-guard does not catch any of this. It is scoped to system-deep-loop's own advisor projections and never inspects sk-doc.

The dependency-ordered fix plan, verification commands, and 19-row acceptance matrix live in `research/research.md` Section 8 through Section 10. Implementation is out of scope for this packet and hands off to sibling packet `012-sk-doc-routing-fixes`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: whether the ~34 uncovered mode-registry aliases are under-scored or invisible to the benchmark scorer
- Q2: whether create-skill's routing templates steer models toward the wrong path-root convention
- Q3: how the skill-benchmark scorer (`router-replay.cjs`) reads router config, gold, and the D1intra/D2/D3/D5 dimensions for a hub skill
- Q4: whether `routing-registry-drift-guard` catches the alias-coverage gap
- Q5: a prioritized, implementable fix list tied to each benchmark failure mode

### Out of Scope
- Routing research for skills other than sk-doc, a follow-on phase covered by sibling packet `011-skill-advisor-routing-research`
- Applying the fixes. The deliverable here is findings. The build goes to `012-sk-doc-routing-fixes`
- Re-running the full Tier-2 benchmark suite or redesigning the scorer

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-001 | Determine whether the ~34 uncovered mode-registry aliases are under-scored or invisible to the benchmark scorer | Evidence from `router-replay.cjs` code paths tied to sk-doc's recall number | Falsified: 113/113 alias-to-vocabularyClass equality, zero gaps (iterations 1-2) |
| REQ-002 | Determine whether create-skill routing templates steer toward the wrong path-root convention | Concrete template lines identified with corrected convention proposed | Confirmed: two coordinate systems taught side by side with no handoff contract (iteration 4). Fix specified in research.md Section 8 item 8 |
| REQ-003 | Explain scorer dimensions D1intra/D2/D3/D5 for hub skills and locate where sk-doc loses points | Per-dimension loss attribution with file:line evidence | 19-row classification: 6 wrong-root, 6 missing-leaf, 5 over-bundle, 2 clean (iteration 3) |
| REQ-004 | Assess whether routing-registry-drift-guard catches the alias-coverage gap | Yes/no with the specific missing check named if no | No. Guard is deep-loop-only, and four missing boundary checks are named (iteration 5) |
| REQ-005 | Deliver a prioritized, implementable fix list for hub-router.json, mode-registry.json, command-metadata.json, and templates | Each fix tied to a benchmark failure mode | 9-item dependency-ordered plan in research.md Section 8, acceptance matrix in Section 10 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five key research questions answered with file:line evidence in `research/research.md`. Met, 5/5 across iterations 2-6
- **SC-002**: A prioritized fix list exists where every item is implementable without further research. Met, research.md Section 8 plus the six verification commands in Section 9
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Resolution |
|------|------|--------|------|
| Dependency | Tier-2 gpt-5.6-luna benchmark artifact (`tier2-sk-doc-luna-opencode.report.json`) | Findings need grounding in a scored run | Located under `system-deep-loop/068-skill-benchmark-codex-executor` and cited throughout. It predates today's configs and carries no config fingerprints, so a fresh live run is required after the fix lands to claim repair |
| Risk | Scorer internals change during research | Findings could target stale scorer behavior | Every claim carries a file:line citation pinned to the current scorer chain (`router-replay.cjs`, `live-executor.cjs`, `score-skill-benchmark.cjs`, and siblings) |
| Risk | `memory_context` timed out at init | Prior packet findings (001-009) not auto-loaded | Iterations read sibling packets directly instead |
| Dependency | Implementation packet `012-sk-doc-routing-fixes` | The fix plan has no effect until it is built | Section 8's Layer A names the smallest safe file set, and research.md Section 17 lists the four next steps in order |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking research. Two operator-policy calls are deferred to `012-sk-doc-routing-fixes`: when the legacy dual-read bridge for path-contract migration gets cut off, and whether the manifest `--check` runs path-filtered pre-commit or unconditional CI-only (research recommends unconditional CI).
- Historical scenario SD-016 stays provenance-inconclusive by design. The benchmark report truncates responses at 300 characters, so its two-candidate contradiction cannot be reconstructed after the fact. It becomes attributable only once future runs carry provenance.

### Research Status
Complete: 10 of 10 iterations, 5 of 5 key questions answered, zero remaining research frontier within scope. `research/research.md` is the canonical synthesis. See its Section 8 for the dependency-ordered fix plan handed off to `012-sk-doc-routing-fixes`.
<!-- /ANCHOR:questions -->
