---
title: "Implementation Plan: Eval Rig"
description: "Build fixtures + grader harness + cache layer + deterministic-check library; dry-run gate before any SWE 1.6 dispatch."
trigger_phrases:
  - "114/002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/002-eval-rig"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Materialize fixtures from council-report.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114021"
      session_id: "114-002-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Eval Rig

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (.cjs scripts) + JSON fixtures |
| **Framework** | None — standalone scripts, invokable from 003 |
| **Storage** | `002-eval-rig/cache/` (jsonl index + blob files) |
| **Testing** | `scripts/dry-run.cjs` exit 0 on canned outputs |

### Overview
Build 4 deterministic check scripts, a grader harness with dispute detection, a sha256-keyed cache with atomic writes, 5–10 fixture files materialized from the council-ratified catalog, and a dry-run gate that proves the scoring pipeline works on canned outputs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001-council-design `council-report.md` ratified
- [ ] Rubric + fixture catalog + grader model decided
- [ ] Node.js >= 18 available

### Definition of Done
- [ ] All P0 requirements (REQ-001..006) satisfied
- [ ] `scripts/dry-run.cjs` exit 0
- [ ] strict-validate exit 0 on this packet
- [ ] Operator confirms rig ready for 003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Packet-local infrastructure: standalone scripts callable from 003 via `require()` or shell. No daemons, no shared state outside the cache directory.

### Key Components
- **Fixture loader**: reads `fixtures/*.json`, returns task descriptors
- **Deterministic library**: 4 scripts under `scripts/deterministic/`, each takes (output, fixture) → score
- **Grader harness**: dispatches grader CLI, parses JSON, optional dual-grader with dispute detection
- **Cache layer**: append-only index + blob files; mkdir locks; reconstruct script

### Data Flow
`(variant, fixture)` → cache key → cache hit? return cached score : run scoring pipeline (deterministic → grader) → cache write → return score
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — greenfield packet. No existing surfaces affected.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `002-eval-rig/` | New (does not exist) | Create | `ls 002-eval-rig/` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read 001-council-design `council-report.md`; extract rubric, fixture catalog, grader model choice, budget envelope
- [ ] Create directory tree: `fixtures/`, `grader/`, `cache/det/`, `cache/grader/`, `scripts/deterministic/`
- [ ] Initialize `cache/index.jsonl` empty
- [ ] Add `.gitignore` entries for `cache/{det,grader}/*.out.md` blobs IF they grow large (operator decision)

### Phase 2: Core Implementation
- [ ] Materialize fixtures from council catalog; one `fix-NNN-*.json` per fixture
- [ ] Author `scripts/deterministic/bundle-gate.cjs` (3-layer check: imports grep, exports grep, smoke-run validation_commands)
- [ ] Author `scripts/deterministic/cwd-check.cjs` (path regex against stated CWD)
- [ ] Author `scripts/deterministic/preplanning-regex.cjs` (block presence + step ordering)
- [ ] Author `scripts/deterministic/hallucination-flag.cjs` (allowlist check)
- [ ] Author `grader/harness.cjs` (dispatch + parse + dispute detection)
- [ ] Author cache layer: key derivation, atomic temp+rename, mkdir lock, blob storage
- [ ] Author `scripts/cache-reconstruct.cjs` (rebuild index from blobs)
- [ ] Author canned outputs for dry-run (`scripts/dry-run-fixtures/*.canned.md`)

### Phase 3: Verification
- [ ] Run `scripts/dry-run.cjs --test-cache` (REQ-003)
- [ ] Run `scripts/dry-run.cjs --test-deterministic` (REQ-004)
- [ ] Run `scripts/dry-run.cjs --test-grader-stub` (no real grader call; mock parser)
- [ ] Run full `scripts/dry-run.cjs` end-to-end (REQ-005)
- [ ] Verify REQ-006: grep for cli-devin/devin dispatch — none found
- [ ] strict-validate (T038 of 001 pattern)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deterministic check scripts on canned inputs | Node.js |
| Integration | Full scoring pipeline (det + grader stub + cache) | dry-run.cjs |
| Manual | Operator review of fixture quality vs council catalog | Read fixtures/*.json |
| Validate | Spec-folder validator | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-council-design council-report.md | Internal | Pending council run | Hard blocker |
| Node.js >= 18 | External | Green | Hard blocker |
| Grader CLI (cli-claude-code OR cli-codex per council) | Internal | Green | Hard blocker for real grader calls (stub works in dry-run) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rig flawed, dry-run can't pass, or council-report.md revised mid-build
- **Procedure**: `rm -rf 002-eval-rig/{fixtures,grader,cache,scripts}/`; rebuild from Phase 1
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verification)
                       │
                       ├─► fixtures/   (parallel within Phase 2)
                       ├─► scripts/deterministic/
                       ├─► grader/
                       └─► cache layer
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001 ratified | Core |
| Core | Setup | Verification |
| Verification | Core | 003-eval-loop start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Core (4 det scripts + grader + cache + fixtures + canned outputs) | High | 6-8 hr |
| Verification | Med | 1 hr |
| **Total** | | **~8-10 hr** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No prior fixtures/grader/cache/scripts directories
- [ ] Council-report.md confirmed final
- [ ] Operator approves fixture grounding

### Rollback Procedure
1. `rm -rf 002-eval-rig/{fixtures,grader,cache,scripts}/`
2. Verify only spec docs remain
3. Restart Phase 1

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — packet-local
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌────────────────────────────┐     ┌──────────────────┐
│   Phase 1   │────►│   Phase 2 Core             │────►│   Phase 3 Verify │
│   Setup     │     │  ├─ fixtures              │     │   Dry-run gate   │
└─────────────┘     │  ├─ deterministic scripts │     └──────────────────┘
                    │  ├─ grader harness         │
                    │  └─ cache layer            │
                    └────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Fixtures | Council catalog | fix-*.json | Deterministic scripts (need fixture schema) |
| Deterministic | Fixture schema | 4 .cjs scripts | Dry-run |
| Grader harness | Council grader choice | harness.cjs | Dry-run |
| Cache layer | None (pure infra) | index + blobs | Grader, deterministic (callers) |
| Dry-run | All above | Pass/fail gate | 003-eval-loop start |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **001 council-report.md** - Upstream - CRITICAL
2. **Fixtures + deterministic scripts** - 4 hr - CRITICAL (parallel-able)
3. **Grader harness** - 2 hr - CRITICAL
4. **Cache layer** - 2 hr - CRITICAL
5. **Dry-run gate** - 1 hr - CRITICAL

**Total Critical Path**: ~9 hr

**Parallel Opportunities**:
- Fixtures, deterministic scripts, grader, cache layer can run in parallel after Phase 1 Setup
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Directory tree exists, index.jsonl empty | Phase 1 end |
| M2 | Core components built | Deterministic + grader + cache + fixtures present | Phase 2 end |
| M3 | Dry-run green | scripts/dry-run.cjs exit 0 | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Separate caches for deterministic vs grader results

**Status**: Proposed

**Context**: A single cache keyed only on (variant_hash, fixture_id) would invalidate every entry when the grader model changes, even though deterministic scores (regex-checkable) are grader-independent. Wastes free-tier credits.

**Decision**: Split into `cache/det/` and `cache/grader/`. Det cache survives grader swaps. Grader cache invalidates on rubric or grader-model change.

**Consequences**:
- Improves: cheaper re-runs after grader model changes
- Costs: more cache files; reconstruct script handles both directories

**Alternatives Rejected**:
- Single cache with composite key including grader model: invalidates det results unnecessarily
- No cache (always recompute): burns free-tier credits

---
