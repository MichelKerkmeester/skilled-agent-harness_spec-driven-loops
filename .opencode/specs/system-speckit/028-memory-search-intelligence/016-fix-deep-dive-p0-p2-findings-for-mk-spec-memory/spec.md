---
title: "Feature Specification: Deep-Dive P0-P2 Remediation Program for mk-spec-memory"
description: "Phase parent for the 13-phase program fixing every P0/P1/P2 finding from the 2026-07-03 memory search deep dive: corpus repair, ranking truthfulness, performance, learning loop, ops, and presentation."
trigger_phrases:
  - "deep dive remediation program"
  - "016 fix deep dive findings"
  - "memory search fixes program"
  - "mk-spec-memory remediation phases"
  - "search fixes phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory"
    last_updated_at: "2026-07-03T10:15:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Review and remediation applied; all 14 folders strict-green"
    next_safe_action: "Begin implementation with phase 011 (daemon freshness) per the recommended execution order"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-dive-report.md"
      - "research/findings-ledger.md"
      - "research/phase-decomposition.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-deep-dive-remediation-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Phase 006 rescue-layer authority decision (Option A/B/C) — decided during implementation, recorded in its decision-record.md"
      - "Phase 004 chunking decision — wire scan-path chunking vs document single-vector policy"
    answered_questions:
      - "Gate 3: program lives under 028 as child 016 (operator answer E, 2026-07-03)"
      - "Known-open trackers (Group-A, 028/006/002, 028/006/004) are ABSORBED into phases 007/008/009/013 (operator decision)"
      - "Plan reviewed by 5 fresh reviewers; remediation applied — see research/plan-review-report.md. Absorbed 028/006/002 P1-2/P1-4/P1-5 were found already fixed in code, reclassified to verify-first-then-close"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-Dive P0-P2 Remediation Program for mk-spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (phase parent — working docs live in the 13 children) |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-07-03 deep dive (live production probing + eight code audits over ~96k lines) found ~150 defects across the mk-spec-memory search stack. Two systemic failures dominate: corpus rot (37% dead-path rows, 12k duplicate rows, a third of the corpus is archived material ranked as active, 43% of rows vector-invisible, 45% junk trigger phrases, 94% noise causal edges) and signal theater (a large fraction of the ranking stack is computed, reported as applied in telemetry, then discarded before it can influence results — rescue-layer overwrite, dead gates, dead scoring subsystems). Operationally, the memory surface was down at session start via a dist-freshness deadlock and a SIGBUS crash-loop, and the failure was silent to the user.

### Purpose
Fix every P0/P1/P2 finding from the deep dive — plus the absorbed open scopes from prior trackers — through 13 dependency-ordered phases, restoring corpus integrity, ranking truthfulness, measured performance, a working learning loop, trustworthy ops surfaces, and honest presentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All findings recorded in `research/deep-dive-report.md` (§3 bug inventory, §4 performance, §5 presentation) and `research/findings-ledger.md`, mapped to phases in `research/phase-decomposition.md`.
- Absorbed scopes: Group-A flag-read cluster (T-0211/T-0212/REQ-214, ex-031 tracker) → phase 007; `028/006-review-remediation/002` schema+concurrency items → phases 008/009; `028/006-review-remediation/004` 91-item P2 triage → phase 013.
- Data migrations over the production index (dead-row drain, identity heal, tier rewrites, trigger regeneration) with checkpoint-backed rollback.
- Two tooling defects found during this program's own scaffolding (create.sh `--phase` ignores `--level`; upgrade-level.sh references removed template paths) → tracked in phase 013.

### Out of Scope
- New retrieval features with no finding lineage (e.g. the citation-ledger reranker — remains data-gated per `028/001/024-reranker-research`).
- Code Graph / Skill Advisor / Deep Loop subsystems (own packets under 028) except where a finding names them.
- Editing packet `030-agent-loops-improved` or other done-evidence records.

### Files to Change
Per-phase Files-to-Change tables live in each child `spec.md`; the program's blast radius is concentrated in `.opencode/skills/system-spec-kit/mcp_server/` (handlers, lib/search, lib/cognitive, lib/feedback, lib/storage, formatters), `.opencode/bin/spec-memory.cjs`, `scripts/lib/dist-freshness.cjs`, and the memory command docs under `.opencode/commands/memory/` + `.claude/commands/memory/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three P0 defects are fixed and covered by tests: tombstone read-invisibility, full-auto canonical save self-reject, chunking safe-swap self-delete | Phase 002/003/004 checklists green with test evidence |
| REQ-002 | Corpus integrity restored: dead-path rows drained, cross-prefix identity healed, duplicate snapshots removed or excluded from every channel | Phase 001/002 success gates met on the production DB |
| REQ-003 | The daemon/CLI surface is trustworthy: a successful build clears the freshness gate, stale-dist is visibly surfaced, health diagnostics can actually fire | Phase 011 checklist green; live reproduction steps from the report no longer reproduce |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every P1 finding in the report §3 inventory is fixed or explicitly accepted with reason | Phase checklists + phase-013 completeness sweep show no unmapped P1 |
| REQ-005 | Ranking authority is decided (phase 006) and the ranking stack matches its documentation | 006 decision-record with A/B benchmark deltas on the eval-parity harness |
| REQ-006 | The learning loop can learn: access tracking, reinforcement lanes, term expiry, promotion/demotion all function | Phase 009 gates: repeat-query strengthening observable; promotion/demotion cycle test passes |
| REQ-007 | Absorbed trackers closed out with pointers (no duplicate tracking left behind) | Phase 013: 028/006/002+004 and ex-031 Group-A rows updated |

### P2 - Optional (as capacity allows within phases)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Every P2 finding is fixed in its phase or listed accept-as-is with reason in phase 013's mapping table | Phase-013 mapping table complete; no silent drops |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A known-answer query set (incl. the report's live reproductions) returns one row per document — no duplicate snapshots, no dead paths, no z_archive pollution in default searches.
- **SC-002**: memory_search p50 < 800ms and memory_match_triggers p50 < 300ms warm at current corpus scale, measured on the phase-010 baseline harness.
- **SC-003**: Telemetry honesty: no signal reports "applied" while contributing zero; envelope ≤ its token budget; eval harness measures the production pipeline.
- **SC-004**: `validate.sh --strict --recursive` green across the program parent and all 13 children at completion.
- **SC-005**: Embedding coverage ≥ 99% success on active rows with zero success-without-vector rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | One-shot migrations over the 1.3GB production index (phases 001/002/005) | High — data loss if wrong | checkpoint_create before each migration; separately revertible steps; dry-run counts first |
| Risk | Ranking changes shift result quality before eval-parity lands | Medium — unmeasurable regressions | Phase 006 Part 1 (eval parity) is a hard prerequisite for 006 Part 2, 007, 008 ranking work |
| Risk | Concurrent sessions writing the index during migrations | Medium | Run migrations under the maintenance marker; single-writer lease respected |
| Dependency | Phase 002's shared active-row predicate | Phases 001/005 exclusion behavior depends on it | Execution order places 002 before 005; 001's dedup honors the predicate |
| Dependency | GPT restructure commit `32aae18dc7` (013/014/015 adoption) | Absorption pointers in phase 013 reference the new paths | Landed and verified before this program was scaffolded |
| Risk | Scope creep across ~150 findings | Medium | Phase boundaries are frozen per `research/phase-decomposition.md`; new findings go to phase 013's sweep, not into open phases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Phase 006: rescue-layer ranking authority — Option A (lexical dominance is the contract), B (bounded additive delta), or C (floor-only hybrid). Decided during implementation with benchmark evidence.
- Phase 004: scan-path chunking vs documented single-vector policy for >50KB docs.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Evidence corpus: `research/deep-dive-report.md` (findings + live reproductions), `research/findings-ledger.md` (~150 raw findings), `research/phase-decomposition.md` (finding→phase mapping, authoritative).

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-orphan-sweep-cursor-and-corpus-identity-repair/ | Orphan-sweep cursor persistence; drain 12,352 dead-path rows; heal system-spec-kit vs system-speckit identity; dedup duplicate rows; projection repoint | Pending |
| 2 | 002-archived-tier-and-tombstone-read-exclusions/ | Implement archived tier end-to-end; ONE shared active-row predicate across all channels; P0 tombstone visibility; tier normalization + substring-tier fix | Pending |
| 3 | 003-content-hash-normalization-and-save-dedup-lanes/ | Normalize content hashes (kill snapshot churn); make PE UPDATE/REINFORCE lanes reachable; P0 canonical-save self-reject; save dedup lane fixes | Pending |
| 4 | 004-embedding-coverage-and-vector-shard-consistency/ | Reconcile 14k missing vectors; retry-drain writes active shard; embedder attribution; chunking decision + P0 safe-swap fix; scan lifecycle fixes | Pending |
| 5 | 005-trigger-phrase-quality-and-matcher-guards/ | Regenerate legacy word-soup trigger phrases; matcher stopword/prefix-scope guards; constitutional dedup + sandbox purge; match_triggers latency | Pending |
| 6 | 006-rescue-layer-ranking-authority-decision/ | Eval-parity prerequisite (measure production pipeline); THE rescue-layer authority decision with A/B evidence; dead-battery disposition | Pending |
| 7 | 007-ranking-filter-bypass-and-score-scale-fixes/ | Group-A flag-read root cause (absorbs T-0211/T-0212/REQ-214); filter-bypass battery; score-scale battery; gate fixes (HyDE, graph-FTS, intent) | Pending |
| 8 | 008-causal-graph-hygiene-and-entity-linker-noise/ | Reclassify 31k entity-linker 'supports' edges; edge-strength ratchet; absorbs 028/006/002 derived_id + schema-lock items; community lifecycle | Pending |
| 9 | 009-learning-feedback-loop-repair/ | trackAccess on cache hits; term expiry; reformulation sign; promotion demotion+hysteresis; ledger retention; absorbs 028/006/002 retention-snapshot item | Pending |
| 10 | 010-search-hot-path-performance/ | Rescue N+1 + full-table LIKE; adjacency/community/intent caching; envelope single-serialization; measured targets (search <800ms, triggers <300ms) | Pending |
| 11 | 011-daemon-freshness-and-health-truthfulness/ | FIRST in execution order: dist-freshness deadlock; exit-75 taxonomy; hook fallback visibility; health truthfulness; SIGBUS diagnosis | Pending |
| 12 | 012-envelope-presentation-and-command-doc-alignment/ | Kill envelope double-emission; budget-after-attach; cursor scope binding; render why; --format text rows; ~20-item command-doc drift battery; dual-tree sync | Pending |
| 13 | 013-absorb-028-006-review-remediation-closeout/ | LAST: update absorbed tracker pointers; 91-item P2 mapping table; findings-completeness sweep; record scaffolding tooling bugs; final recursive validation | Pending |

### Phase Transition Rules

- **Recommended execution order: 011 → 001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010 → 012 → 013.** Rationale: 011 restores surface trust first; 001–005 repair the corpus (biggest visible win, no algorithm churn); 006 lands eval-parity and the one architecture decision gating all ranking work; 007–008 are the ranking/graph batteries; 009 learning loop; 010 performance after correctness; 012 presentation; 013 closes the books.
- The numeric folder order groups by subsystem; it is NOT the execution order.
- Each phase MUST pass `validate.sh --strict` independently before the next phase begins; phase checklists' P0/P1 items gate completion.
- Ranking-behavior phases (006 Part 2, 007, 008) MUST NOT start before 006 Part 1 (eval parity) is green.
- Migration phases (001, 002, 005) begin with `checkpoint_create` and a dry-run count task.
- Parent spec tracks aggregate progress via this map; run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Scope note: the recommend-level.sh heuristic scored this work "Level 2, no phases" from LOC/file inputs alone; the operator-directed program overrides it — 13 subsystem scopes with ordering dependencies and independent rollback needs.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 011-daemon-freshness-and-health-truthfulness | 001-orphan-sweep-cursor-and-corpus-identity-repair | Build clears freshness gate; health diagnostics fire | 011 checklist P0/P1 green; `validate.sh --strict` exit 0 |
| 001-orphan-sweep-cursor-and-corpus-identity-repair | 002-archived-tier-and-tombstone-read-exclusions | Dead rows drained; identity healed; dedup done | 001 success gates on production DB; checkpoint recorded |
| 002-archived-tier-and-tombstone-read-exclusions | 003-content-hash-normalization-and-save-dedup-lanes | Shared active-row predicate live in all channels | 002 checklist green; channel exclusion tests pass |
| 003-content-hash-normalization-and-save-dedup-lanes | 004-embedding-coverage-and-vector-shard-consistency | Save lanes reachable; churn stopped | 003 checklist green; re-save tests pass |
| 004-embedding-coverage-and-vector-shard-consistency | 005-trigger-phrase-quality-and-matcher-guards | Vector coverage reconciled; drain scaled | 004 gates: success==vector counts |
| 005-trigger-phrase-quality-and-matcher-guards | 006-rescue-layer-ranking-authority-decision | Trigger corpus regenerated; matcher guards live | 005 gates incl. latency target |
| 006-rescue-layer-ranking-authority-decision | 007-ranking-filter-bypass-and-score-scale-fixes | Eval parity green; authority decision recorded | 006 decision-record + benchmark deltas |
| 007-ranking-filter-bypass-and-score-scale-fixes | 008-causal-graph-hygiene-and-entity-linker-noise | Bypass/scale batteries fixed with adversarial tests | 007 checklist green; eval deltas captured |
| 008-causal-graph-hygiene-and-entity-linker-noise | 009-learning-feedback-loop-repair | Graph relation histogram sane; ratchet fixed | 008 gates; absorbed 006/002 items closed |
| 009-learning-feedback-loop-repair | 010-search-hot-path-performance | Learning loop functional; ledgers bounded | 009 gates; cycle tests pass |
| 010-search-hot-path-performance | 012-envelope-presentation-and-command-doc-alignment | Latency targets met | 010 before/after benchmark table |
| 012-envelope-presentation-and-command-doc-alignment | 013-absorb-028-006-review-remediation-closeout | Envelope/doc drift battery complete | 012 checklist green; envelope size check |
| 013-absorb-028-006-review-remediation-closeout | (program complete) | All trackers pointed; completeness sweep clean | `validate.sh --strict --recursive` green; /memory:save closeout |
<!-- /ANCHOR:phase-map -->

---

## RELATED DOCUMENTS

- **Evidence**: `research/deep-dive-report.md`, `research/findings-ledger.md`, `research/phase-decomposition.md`
- **Absorbed trackers**: `../006-review-remediation/002-memory-schema-and-concurrency/`, `../006-review-remediation/004-p2-triage/`, `../014-manual-playbook-execution-sweep/001-findings-remediation/` (Group-A rows)
- **Adopted sibling packets** (same restructure, commit 32aae18dc7): `../013-validate-sh-dist-freshness-and-repo-remediation/`, `../014-manual-playbook-execution-sweep/`, `../015-deep-review-followup-hardening/`
- **Graph metadata**: `graph-metadata.json`
