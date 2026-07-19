---
title: "Implementation Plan: sqlite-to-turso [template:level_1/plan.md]"
description: "Two-phase research orchestration: a 10-iteration deep-context loop (MiMo v2.5 Pro pool) over the SQLite surfaces of the three daemon skills, then a 17-iteration deep-research revalidation (Fable 5 @ xhigh) of research docs 001-003 against turso-main v0.7.0-pre.6."
trigger_phrases:
  - "sqlite to turso plan"
  - "turso revalidation plan"
  - "deep context loop"
  - "deep research loop"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "z_future/sqlite-to-turso"
    last_updated_at: "2026-06-10T15:48:37Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Both loop phases executed to synthesis"
    next_safe_action: "Read research/research.md; plan adapter packet when ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/sqlite-to-turso"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sqlite-to-turso

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts + JSONL loop state; analyzed code is TypeScript (better-sqlite3) and Rust (turso-main) |
| **Framework** | deep-context + deep-research loop contracts (deep-loop-runtime scripts) |
| **Storage** | File-based loop state under `context/` and `research/`; coverage-graph via upsert.cjs |
| **Testing** | reduce-state.cjs + convergence.cjs per iteration; validate.sh strict at completion |

### Overview
Run the official deep-context loop (10 iterations, 3 parallel MiMo v2.5 Pro seats per iteration, host writes all state) to map current SQLite usage across system-spec-kit, system-code-graph, and system-skill-advisor including packet 027 storage changes. Then run the official deep-research loop (17 working Fable 5 @ xhigh iterations in 3-seat waves via the claude2 account) to revalidate every item in research docs 001-003 against the vendored turso-main v0.7.0-pre.6.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (reducer + convergence checks green each wave)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Host-orchestrated loop pattern: read-only CLI analyst seats, single-writer host for all state files, deterministic reducers.

### Key Components
- **Deep-context loop**: by-model-shared-scope sweep, agreement merge via `reduce-state.cjs`, convergence via `convergence.cjs`
- **Deep-research loop**: wave-batched iteration dispatch (max 3 parallel seats on disjoint questions), strategy with anchor-wrapped machine-owned sections

### Data Flow
Seat prompts → CLI dispatch (read-only) → host extracts findings → host writes iteration/state/delta files → reducer updates registry/dashboard/strategy → convergence verdict gates next iteration → synthesis compiles reports.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: research-only packet, no bug-fix surfaces. No production code is modified; all writes are packet-local loop artifacts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context/**`, `research/**` | Loop state + deliverables | Create | reduce-state.cjs idempotent re-run; validate.sh |
| `spec.md` | Packet contract | Findings write-back fence at synthesis | Targeted strict validate.sh |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet scaffolded (spec.md, plan.md, tasks.md, implementation-summary.md, description.json)
- [x] graph-metadata.json — skipped by design (z_future in EXCLUDED_FOR_MEMORY; warn-only)
- [x] validate.sh non-strict clean

### Phase 2: Core Implementation
- [x] Deep-context loop: init + 10 iterations + context-report.md
- [x] Deep-research loop: init + 17 working iterations (W1-W6) + research.md
- [x] Adversarial verification wave for changed verdicts (W5 + W6 pivot resolution)

### Phase 3: Verification
- [x] Reducer re-runs idempotent; state record counts match iteration files
- [x] All 16 gaps + paths A/B/C + P0-P4 carry explicit verdicts (research.md §9)
- [x] Continuity save (ADR-004 quick path; canonical save rejects z_future) + strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-iteration state integrity | reduce-state.cjs JSON output checks |
| Integration | Loop convergence + registry consistency | convergence.cjs, idempotent reducer re-run |
| Manual | Report citation spot-checks | Read vendored turso-main sources cited in verdicts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode `xiaomi/mimo-v2.5-pro` | External | Green (verified 2026-06-10) | Phase A cannot dispatch; fail closed |
| claude2 binary + account | External | Green (effort xhigh verified) | Phase B cannot dispatch; fail closed |
| Vendored `external/turso-main` v0.7.0-pre.6 | Internal | Green | Revalidation loses primary evidence source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop state corruption, or operator abort.
- **Procedure**: All writes are packet-local and additive; delete `context/` and/or `research/` state artifacts (preserving the frozen 001-003 docs) and re-init the affected loop with a fresh config.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
