---
title: "Resource Map: 998 — Wave 2 aggressive-variant target state"
description: "Wave 2 target-state proposal post 998 20-iter cli-devin SWE-1.6 research. Drives the follow-on Wave 2 execution packet — focuses on items the Wave 1 reduced variant correctly deferred (000 recatalog, 008 internal phases, parent-doc field updates, SHALLOW/MEDIUM reclassification)."
trigger_phrases:
  - "998 resource map"
  - "026 wave 2 target"
  - "aggressive variant architecture"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research"
    last_updated_at: "2026-05-16T08:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored from research.md"
    next_safe_action: "Wave 2 execution packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-001.md"
      - "research/iterations/iteration-003.md"
      - "research/iterations/iteration-005.md"
      - "research/iterations/iteration-015.md"
    session_dedup:
      fingerprint: "sha256:99844444555566667777888899990000111122223333444455556666777788c5"
      session_id: "998-resource-map"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Wave 2 PROCEED count: 4 NEW operations (Wave 1 already shipped 7 PROCEED merges)"
      - "Most impactful new finding: 000 + 008 internal phase structures + graph-metadata derived fields"
      - "SHALLOW/MEDIUM reclassification: admin-ref pollution → most are actually DEEP (archive only)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 998 — Wave 2 aggressive-variant target state

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Wave 2 target-state proposal. Post 998 20-iter cli-devin SWE-1.6 research (v1.0.4.1 recipe). The research validated Wave 1 (packet 107) as the right reduced variant, then surfaced 4 genuinely-new operations the council had deferred:

| Operation class | Wave 1 (shipped) | Wave 2 (this packet's NEW work) |
|----------------|-----------------:|--------------------------------:|
| Renames | 4 done | 4 additional (verbose-name corrections inside nested children) |
| Merges | 7 done (M2-M7+M11) | 1 NEW (003+005 Surface 3 consolidation) — REDESIGN-flagged |
| Internal-phase definitions | 0 (deferred) | **2 NEW**: 000 (6 sub-phases) + 008 (5 sub-phases) |
| Parent-doc derived fields | partial (post-restructure notes) | iter 039 + iter 015 fields (meta_phase_ids, phase_sequence, etc.) |
| Delete reclassification | per iter 048 (28 DEEP archived; 8 CONTAINED deleted; 18 SHALLOW+MEDIUM deferred) | All 18 SHALLOW+MEDIUM → DEEP (admin-ref pollution) per iter 009-010 |
| Cross-026 reorgs | none | 1 REDESIGN: 003 absorbs 005 (Surface 3); 1 ABORT: 012 absorbs 006 |

The 998 research **strongly validates the council's Wave 1 reduced variant** — most aggressive operations are REDESIGN or ABORT, confirming the council's caution was correct.

### Numbers at a glance

| Metric | Pre-Wave-1 | Post-Wave-1 (current) | Wave 2 target (this map) |
|--------|-----------:|----------------------:|-------------------------:|
| Top-level 026 children | 16 | 15 | 15 (no top-level changes) |
| 000 nested children | 59 (graph-metadata says 7) | 59 (mismatch persists) | **6 sub-phases** |
| 008 nested children | 26 (graph-metadata says 13) | 26 (mismatch persists) | **5 sub-phases** |
| Phase parent flag in graph-metadata | absent | absent | per iter 015 proposal |
| meta_phase_ids field | absent | absent | `["000"]` per iter 015 |
| phase_sequence array | absent | absent | per iter 015 proposal |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-state -->
## 2. CURRENT STATE (post-Wave-1)

Source: 999/research.md + 998 iter 001-020 + packet 107 impl-summary.

### 2.1 Top-level 026 children (15 active + 999 + 998)

Same as 999 resource-map §2.1 post-Wave-1 state. No top-level changes proposed in Wave 2.

### 2.2 Newly discovered drift signals (iter 001-010 of 998)

| Signal | Detail | Source iter |
|--------|--------|-------------|
| **000 graph-metadata 8× mismatch** | graph-metadata.json lists 7 children; filesystem has 59 | iter 001:1-11 |
| **000 duplicate prefixes** | 2 collisions at `006-*` and `007-*` prefixes | iter 001:79-85 |
| **000 missing description.json** | packets 041 + 048 lack description.json | iter 001:7-8 |
| **008 graph-metadata 2× mismatch** | lists 13 children; filesystem has 26 | iter 004:43-45 |
| **SHALLOW reclassification** | all 7 SHALLOW packets actually fail ≤3 ref threshold (9-18 refs from research tracking) | iter 009:1-4 |
| **MEDIUM reclassification** | 2 MEDIUM packets meet SHALLOW threshold (014/008: 2 refs; 014/023: 1 ref) | iter 010:22-30 |
| **006 taxonomy violation** | proposed rename "external-project-adoption" is a provenance fallacy; actual scope is affordance uplift | iter 011:96-104 |
| **015 placement ambiguity** | iter 008 says absorb into 000; iter 012 says preserve 015 prefix for incident-response continuity | iter 008:78-99, iter 012:74-78 |
<!-- /ANCHOR:current-state -->

---

<!-- ANCHOR:proposed-state -->
## 3. PROPOSED STATE (Wave 2)

### 3.1 PROCEED operations (4 NEW; council-grade analysis)

Wave 1 already shipped 7 PROCEED merges. These 4 are GENUINELY NEW — not in Wave 1.

| # | Operation | Source iter | Risk | Effort | Recall benefit |
|--:|-----------|-------------|------|--------|----------------|
| **W2.1** | **000-release-cleanup 6-sub-phase recatalog** + graph-metadata sync (7→59 child fix) + rename duplicate 006/007 prefixes | iter 001-003, iter 008 | Medium | High | Very High (000 currently invisible to search) |
| **W2.2** | **008-skill-advisor 5-sub-phase internal structure** + graph-metadata sync (13→26 child fix) | iter 004-006 | Medium | Medium-High | High (search "skill-advisor scorer" → direct hit) |
| **W2.3** | **Parent-doc derived fields** — add `meta_phase_ids: ["000"]`, `phase_sequence`, `phase_parent_flag`, `phase_renames` to 026/graph-metadata.json per iter 015 | iter 015:4-11, 54-166 | Low | Low | Medium (resume + search prioritization) |
| **W2.4** | **18 SHALLOW+MEDIUM reclassification → DEEP archive** (admin-ref pollution invalidates blast classes; all should ARCHIVE not delete) | iter 009-010 | Low | Low (re-tag only) | Low |

### 3.2 W2.1 detail: 000-release-cleanup recatalog (6 sub-phases)

Source: iter 002 + iter 003 (refined to 6 exclusive-classification sub-phases).

| # | Sub-phase | Packet count | Theme |
|--:|-----------|-------------:|-------|
| 1 | `001-release-readiness` | 4 | Release readiness + P1/P2 remediation |
| 2 | `002-audit` | 8 | System audits, runtime wiring, compliance |
| 3 | `003-cleanup` | 28 | General cleanup + technical debt + maintenance |
| 4 | `004-followup-post-program` | 6 | Followup quality + post-program work |
| 5 | `005-stress-test` | 7 | Stress test coverage + remediation |
| 6 | `006-research` | 3 | Deep research charters + investigations |

Plus 3 packets identified for separate disposition (cross-cutting; see iter 003:120-130).

**Side benefits**: M10 unblock (015 → 000/002-audit/<NN>-tanstack-security-audit) + 000's graph-metadata.json refresh + duplicate-prefix resolution.

### 3.3 W2.2 detail: 008-skill-advisor internal phases (5 sub-phases)

Source: iter 004 + iter 005.

| # | Sub-phase | Packet count | Theme |
|--:|-----------|-------------:|-------|
| 1 | `001-skill-graph` | 7 | Infrastructure, metadata, structural migration |
| 2 | `002-scorer` | 8 | Scoring system, evaluation harnesses, calibration |
| 3 | `003-router` | 5 | Intent routing, lane selection, dispatch |
| 4 | `004-hardening` | 4 | Plugin hardening + safety |
| 5 | `005-docs` | 2 | Documentation, README, references |

### 3.4 W2.3 detail: Parent-doc derived fields (per iter 015)

Add to `026/graph-metadata.json` under `derived`:

```json
"derived": {
  "phase_sequence": ["001", "002", "003", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014"],
  "meta_phase_ids": ["000"],
  "phase_parent_flag": {"000": true, "001": true, "003": true, "006": true, "007": true, "008": true, "009": true, "010": true, "012": true, "013": true, "014": true},
  "phase_renames": {
    "014-local-llama-cpp": "014-local-embeddings-migration",
    "015-global-security-sweep-and-supply-chain-audit": "015-tanstack-security-audit",
    "006-graph-impact-and-affordance-uplift": "006-external-project-adoption",
    "002-resource-map-template": "002-resource-map-deep-loop-fix",
    "004-runtime-executor-hardening": "→absorbed-into-003"
  },
  "resume_priority": ["999", "998", "005", "007", "014"]
}
```

### 3.5 W2.4 detail: SHALLOW+MEDIUM reclassification

Source: iter 009 (per-packet SHALLOW ref-count) + iter 010 (MEDIUM ref-count).

**Discovery**: iter 048's SHALLOW (7) and MEDIUM (11) blast classes were polluted by **administrative references** (research tracking files like `999/research/iterations/*.md` that mention packet names without functionally depending on them). Filtering out admin refs:

- 7 SHALLOW → 7 still fail ≤3 threshold; reclassify to DEEP-archive
- 11 MEDIUM → 9 stay MEDIUM; 2 actually meet SHALLOW threshold (014/008, 014/023)

**Wave 2 action**: ARCHIVE all 18 (treat as DEEP) per the council's hard-constraint that DEEP class doesn't delete. The 2 reclassified MEDIUM (014/008, 014/023) can still proceed to DELETE WITH CLEANUP in a later wave but not first wave.

### 3.6 REDESIGN / ABORT operations (NOT in Wave 2)

| # | Operation | Verdict | Reason |
|--:|-----------|---------|--------|
| — | 003 absorbs 005-memory-indexer-invariants | REDESIGN | Phase structure mismatch correction; iter 045 cost-benefit needs re-evaluation under aggressive variant |
| — | 012 absorbs 006-external-project-adoption | ABORT | Taxonomy violation (Surface 8 vs 5 alignment); council REDESIGN-flagged because too broad |
| — | 008 internal phase EXECUTION | DEFER | iter 023 says 26 children need deeper sequencing analysis; W2.2 ships the STRUCTURE, execution is a separate packet |
| — | Cross-parent deep-review quality gates | REDESIGN | Artificial parent too expensive (Wave 1 archive already addressed) |
| — | 010-template-levels parent dissolution | ABORT | iter 007 says keep parent for domain coherence; only 009-rm-8-prompt-hardening rehomes to 013 |
<!-- /ANCHOR:proposed-state -->

---

<!-- ANCHOR:migration-plan -->
## 4. MIGRATION PLAN (Wave 2 execution)

Same 5-wave pattern as Wave 1 (packet 107). Per-operation immediate commit + per-wave HEAD baseline.

### Wave 2.A: Graph-metadata sync (LOW RISK — start here)
- **Op 1**: Sync `000/graph-metadata.json` children_ids from 7 → 59 actual paths
- **Op 2**: Sync `008/graph-metadata.json` children_ids from 13 → 26 actual paths
- **Op 3**: Add iter 015 derived fields to `026/graph-metadata.json`

### Wave 2.B: 000-release-cleanup recatalog (HIGHEST IMPACT)
- **Op 4**: Resolve duplicate-prefix collisions (rename one of each `006-*`/`007-*` pair)
- **Op 5**: Create 6 sub-phase directories: `000/001-release-readiness/`, `000/002-audit/`, `000/003-cleanup/`, `000/004-followup-post-program/`, `000/005-stress-test/`, `000/006-research/`
- **Op 6**: Move 56 of 59 children into sub-phases per iter 003 classification (3 cross-cutting deferred)
- **Op 7**: Add description.json to 000/041 + 000/048 (currently missing)

### Wave 2.C: 015 absorption (POST W2.B)
- **Op 8**: Move `015-tanstack-security-audit` to `000/002-audit/<NN>-tanstack-security-audit` (M10 unblock — now possible after recatalog)

### Wave 2.D: 008-skill-advisor internal phases
- **Op 9**: Create 5 sub-phase directories under 008/
- **Op 10**: Move 26 children into the 5 sub-phases per iter 005 clustering
- **Op 11**: Add 008/spec.md sub-phase definitions per iter 005

### Wave 2.E: SHALLOW+MEDIUM reclassification → archive
- **Op 12**: Archive 16 SHALLOW+MEDIUM packets to `z_archive/wave-2-deep-reclassified/` (excludes 2 reclassified-as-SHALLOW)

### Wave 2.F: Parent-doc rewrites + index refresh
- **Op 13**: Update `026/spec.md` with the 5-section iter-039 structure (deferred from Wave 1)
- **Op 14**: Update `026/resource-map.md` with the 14-section iter-039 structure
- **Op 15**: cocoindex re-scan + memory_index_scan + strict-validate sweep
<!-- /ANCHOR:migration-plan -->

---

<!-- ANCHOR:recall-optimization -->
## 5. RECALL OPTIMIZATION

Source: iter 018 (extended hop-count validation; 5 NEW queries beyond iter 040's 5).

### 5.1 NEW sample queries (Wave 2 aggressive variant)

| Query | Wave-1 hops | Wave-2 hops | Savings |
|-------|------------:|------------:|--------:|
| "What 000-release-cleanup work is complete vs in-progress?" | 4 (open 000, scan 59 children, classify) | 2 (open 000, read 6-sub-phase summary) | 2 |
| "Where is skill-advisor scoring logic researched?" | 3 (open 008, scan 26, find scorer*) | 2 (open 008/002-scorer) | 1 |
| "Where is the TanStack security audit response?" | 2 (open 015) | 2 (open 000/002-audit/<NN>) | 0 (recall same) |
| "How is the doctor router phase structured?" | 3 (open 013, scan, open 004) | 3 (same; W2 doesn't change 013) | 0 |
| "What templates are defined in 010-template-levels?" | 3 (open 010, scan, identify) | 2 (open 010 — only 3 children after Wave 2 W2.B) | 1 |

**Aggregate**: 4 hops saved across 5 NEW queries (+ 3 from iter 040's 5) = ~7 total hops saved. Wave 2 captures most of the remaining recall delta the council deferred from Wave 1.

### 5.2 Validation assertions (post-Wave-2)

Same 9 assertions from iter 050 (Wave 1) + 3 new:

10. **000 graph-metadata sync**: `len(children_ids)` matches filesystem count (59)
11. **008 graph-metadata sync**: `len(children_ids)` matches filesystem count (26)
12. **No duplicate prefixes anywhere in 026**: `find 026 -mindepth 2 -maxdepth 2 -type d | awk -F/ '{print $NF}' | cut -d- -f1 | sort | uniq -d` returns empty
<!-- /ANCHOR:recall-optimization -->

---

<!-- ANCHOR:risks -->
## 6. RISKS AND MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Moving 56 children inside 000 breaks 200+ cross-references | High | High | Per-child grep-and-update pass after each batch; per-op immediate commit so rollback granular |
| 008 sub-phase clustering wrong; some children straddle 2 themes | Medium | Medium | iter 005 used 5-cluster topic analysis; for edge-case children, default to LARGER cluster (scorer or skill-graph) |
| Graph-metadata sync changes break resume/search semantics | Low | High | Wave 2.A is FIRST (lowest risk; informational); cocoindex + memory_index_scan in W2.F validates |
| Council might revise verdicts after seeing aggressive variant | Medium | Low | Optional council review before W2.B execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS (from synthesis)

1. **Surface 10 representation**: Should "extraction and package boundaries" become a new top-level packet, or stay nested under 007/008?
2. **006 naming correction**: 006-external-project-adoption is taxonomy-violation; rename to reflect actual affordance uplift, or reclassify under Surface 8?
3. **Council pre-W2.B**: should the aggressive 000 recatalog go through council review before execution?
4. **Surface 2 consolidation**: iter 007 says keep 010 separate; iter 011 says consolidate with 002. Decision pending.
5. **Phase numbering scheme**: 3 options (Preserve / Renumber / Hybrid); decision pending operator preference.
6. **iter 029 orphan-detection re-dispatch**: still gap from original 999 run; recommend post-execution.
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:authoring-status -->
## 8. AUTHORING STATUS

| Section | Status | Source |
|---------|--------|--------|
| 1. Overview | Filled | 998 research.md exec summary |
| 2. Current state | Filled | iter 001, 004, 008, 009, 010, 011, 012 |
| 3. Proposed state | Filled | iter 003, 005, 015 |
| 4. Migration plan | Filled | iter 020 Wave 2 verdicts |
| 5. Recall optimization | Filled | iter 018 |
| 6. Risks + mitigation | Filled | iter 019 |
| 7. Open questions | Filled | research.md §Open Questions |
| 8. Authoring status | This section | — |

### Next steps

1. Optional: council review of this Wave 2 resource-map before execution
2. Schedule follow-on Wave 2 execution packet (similar pattern to 107)
3. Most impactful single op: W2.B (000 recatalog) — execute first
4. Delete 998 + 999 packets after Wave 2 ships
<!-- /ANCHOR:authoring-status -->
