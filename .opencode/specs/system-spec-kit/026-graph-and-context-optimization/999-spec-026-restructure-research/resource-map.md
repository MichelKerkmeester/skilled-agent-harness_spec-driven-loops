---
title: "Resource Map: 999 — 026 restructure target-state architecture"
description: "Target-state proposal for the 026 graph-and-context-optimization phase parent restructure. Authored from 50-iter deep-research synthesis (40 cli-devin SWE-1.6 + 10 cli-codex gpt-5.5 medium). Drives the follow-on restructure execution packet."
trigger_phrases:
  - "999 resource map"
  - "026 target state"
  - "026 restructure architecture"
  - "11-phase proposal"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-16T06:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored from research.md"
    next_safe_action: "Dispatch council review"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-035.md"
      - "research/iterations/iteration-038.md"
      - "research/iterations/iteration-044.md"
      - "research/iterations/iteration-045.md"
      - "research/iterations/iteration-049.md"
    session_dedup:
      fingerprint: "sha256:a4a52f0b4ed3fac2cf3a814a8a1c5d97e8c95a3a6f9b8a4d4c1c5e3a9d8f7e6c"
      session_id: "999-resource-map"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Total proposed phases: 11 (down from 22 current + 12 nested phase-parent children = 142 total packets)"
      - "Reduction: ~60-83% per phase parent in nested child count"
      - "Net merges: 11 PROCEED, 4 LOW_PRIORITY, 3 ABORT, 7 REDESIGN (25 total)"
      - "DEEP-classified deletes (28 packets): archive instead of delete"
      - "Recovery baseline: HEAD when restructure starts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 999 — 026 restructure target-state architecture

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This document proposes the target-state architecture for the 026-graph-and-context-optimization phase parent. It draws from `research/research.md` (the consolidated 50-iter synthesis: 40 cli-devin SWE-1.6 + 10 cli-codex gpt-5.5 medium). Every recommendation cites the source iter that surfaced it.

### How to read this document

- **§2 Current state** — table of the 16 top-level children + the 142 nested packets across 4 phase parents (014/013/007/009) with classification
- **§3 Proposed state** — the 11-phase target list with per-phase scope, constituents, rationale
- **§4 Migration plan** — 5-wave execution order (renames → merges → deletes → parent-doc → indexes)
- **§5 Recall optimization** — sample-query proof points + parent-doc layout proposal
- **§6 Risks and mitigation** — what could go wrong; how the wave structure mitigates

### Numbers at a glance

| Metric | Current | Proposed | Reduction |
|--------|--------:|---------:|----------:|
| Top-level 026 children | 16 | 11 phases (10 active + 1 meta) | -31% |
| 014-local-embeddings-migration nested | 63 | 10 phases | -84% |
| 007-code-graph nested | 40 | 7 phases (4 active + 3 archive) | -83% |
| 009-hook-parity nested | 8 | 3 phases | -63% |
| 013-doctor-update-orchestrator nested | 5 | 4 phases | -20% |
| Total packets (top-level + nested) | ~142 | ~35 active + 30 archive | ~54% reduction (active only) |
| Pure deletes | — | 26 (CONTAINED + SHALLOW + MEDIUM blast) | — |
| Archive (DEEP blast) | — | 28 | — |
| Renames | — | 4 top-level | — |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-state -->
## 2. CURRENT STATE

### 2.1 Top-level 026 children (16)

Source: iter 001-006 (SWE-1.6 classifications) + iter 041 (gpt-5.5 adversarial review).

| Packet | Type | Status | Children | Classification | Iter |
|--------|------|--------|---------:|----------------|------|
| 000-release-cleanup | phase parent | in_progress | **59** (filesystem; not 2 as initially reported) | load-bearing (meta-phase; needs recatalog before any merge work) | iter 001:59-61, council 2026-05-16 |
| 001-research-and-baseline | phase parent | complete | 7 | load-bearing | iter 001:71-73 |
| 002-resource-map-template | phase parent | in_progress | 3 | load-bearing | iter 001:83-85 |
| 003-continuity-memory-runtime | phase parent | complete | — | load-bearing | iter 002:20-34 |
| 004-runtime-executor-hardening | phase parent | complete | 3 | **merge → 003** (override per iter 041) | iter 002:20-34, iter 041 |
| 005-memory-indexer-invariants | leaf packet | code_complete_pending_track_a | — | load-bearing | iter 002:79-81 |
| 006-graph-impact-and-affordance-uplift | phase parent | in_progress | 8 | load-bearing (confidence-weak) | iter 002:91-95 |
| 007-code-graph | phase parent | mixed | 40 | load-bearing | iter 003:75-77 |
| 008-skill-advisor | phase parent | mixed | 26 | load-bearing | iter 003:128-130 |
| 009-hook-parity | phase parent | mostly_complete | 8 | load-bearing | iter 004:43-45 |
| 010-template-levels | phase parent | partial | 9 | load-bearing (confidence-weak; rehome children 005/006/009) | iter 004:73-77 |
| 011-cocoindex-daemon-resilience | leaf packet | complete | — | load-bearing | iter 004:99-101 |
| 012-causal-graph-channel-routing | phase parent | complete | 2 | load-bearing | iter 005:20-29 |
| 013-doctor-update-orchestrator | phase parent | mixed | 5 | load-bearing | iter 005:48-52 |
| 014-local-embeddings-migration | phase parent | active | **63** (not 60 per iter 042) | load-bearing (severe naming mismatch) | iter 006:23, iter 031, iter 042 |
| 015-global-security-sweep-and-supply-chain-audit | phase parent | in_progress | — | load-bearing (verbose name) | iter 006:95-99 |

### 2.2 Nested packets summary

Source: iter 007-022 (per-phase-parent deep-reads).

| Parent | Nested count | Classification breakdown |
|--------|-------------:|--------------------------|
| 014-local-embeddings-migration | 63 | 20 load-bearing + 20 delete + 23 to-classify; 2 empty placeholder dirs (045, 048) |
| 008-skill-advisor | ~26 | Mixed; track-9 deferred internal phase analysis to follow-on |
| 007-code-graph | 40 | 16 load-bearing + 6 merge + 18 delete (with 28 reclassified to archive by iter 048) |
| 009-hook-parity | 8 | All 8 load-bearing; 1 merge pair (006+007 → 006) |
| 013-doctor-update-orchestrator | 5 | 001+002 merge candidates; 003/004/005 load-bearing |
| 006-graph-impact-and-affordance-uplift | 8 | Confidence-weak; potential draft state |
| 010-template-levels | 9 | Children 004/005/006/009 rehome candidates (→ 008-skill-advisor or 013) |
| 002-resource-map-template | 3 | All load-bearing |
| 001-research-and-baseline | 7 | All load-bearing (archived research; no restructure churn) |
| 000-release-cleanup | **59** (filesystem; council 2026-05-16) | Meta-phase wrapper for release work, audit campaigns, dead-code pruning, security sweep, post-program cleanup. RECATALOG needed before any merge work (duplicate `006-*` and `007-*` prefixes present) |
| 012-causal-graph-channel-routing | 2 | All load-bearing |
| 004-runtime-executor-hardening | 3 | All load-bearing (preserve as nested phases under 003 after merge) |

### 2.3 Drift signals identified

- **014 child count drift**: graph-metadata declares 60, filesystem has 63 (iter 042:10)
- **014 naming incoherence**: "local-llama-cpp" describes one backend but work spans Voyage → OpenAI → llama-cpp → hf-local providers (iter 031, severe)
- **015-extracted-skills-isolation phantom**: referenced in graph-metadata.json line 23 but does not exist in filesystem (iter 036:183, iter 038:24)
- **010 child count vs phase map mismatch**: graph-metadata has 6 children, filesystem has 9, phase map lists 3 (iter 004:73-77)
- **007/036 classification conflict**: Track 4 says load-bearing (iter 016:314), Track 7 says delete (iter 027:60); track 11 override → archive unless active refs found (iter 043:8-9)
- **002/005 status drift**: spec.md says Complete, parent graph-metadata says in_progress (iter 020:158-166)
- **026/026 duplicate numbering inside 014**: 026-llm-model-runtime-inventory vs 026-post-batch-11-re-review (iter 030 open gap)
- **iter 029 was missing** from the SWE-1.6 corpus (failed mid-run): orphan-packet detection partial (iter 027/028/030 cover the dimension via overlap)
<!-- /ANCHOR:current-state -->

---

<!-- ANCHOR:proposed-state -->
## 3. PROPOSED STATE

### 3.1 Eleven-phase target list

Source: iter 035 (initial 13-phase proposal) + iter 038 (revised to 11 after removing 015-extracted-skills-isolation phantom and reclassifying 000 as meta-phase) + iter 044 (first-principles validation; 8/14 phases convergent with SWE-1.6 track 9) + iter 045 (cost-benefit verdicts) + iter 046 (naming convention refinement).

| # | Proposed name | Description | Constituent children | Rationale | Type |
|--:|--------------|-------------|---------------------|-----------|------|
| 000 | `release-cleanup` | Meta-phase wrapper for release alignment, audit campaigns, dead-code pruning, security sweep, post-program cleanup. Outside the linear phase sequence | Current 000-release-cleanup nested children + 015-global-security-sweep relocated as nested child | Meta-phase pattern: release governance work spans the project; doesn't fit linear phase ordering (iter 038, iter 044, iter 047) | meta-phase |
| 001 | `research-and-baseline` | External research, adoption decisions, baseline measurements | Current 001-research-and-baseline (unchanged) | All 7 nested research children preserved as archived corpus; no restructure churn (iter 035:14-15) | phase parent |
| 002 | `resource-map-deep-loop-fix` (rename from `resource-map-template`) | Resource map template + deep-loop integration + reverse parent folder restoration | Current 002-resource-map-template (renamed) | Name surface broadened to include the deep-loop fix scope; iter 033 ranked rank-4 recall impact (iter 033:28-29) | phase parent |
| 003 | `runtime-and-memory` (merged from 003 + 004) | Continuity memory runtime + executor hardening (cache hooks, indexer invariants, executor matrix, hook injection contracts) | Current 003-continuity-memory-runtime + nested children of 004-runtime-executor-hardening preserved as nested phases | Iter 045 PROCEED merge (cost < benefit); iter 044 first-principles also groups these (convergent); decision record needed for the merge (iter 037 weak-rationale flag, iter 038 mitigation) | phase parent (post-merge) |
| 004 | `memory-indexer-invariants` (current 005 promoted) | Memory indexer lineage invariants + index-scope/constitutional-tier invariants (Track A + Track B) | Current 005-memory-indexer-invariants (no nested) | Standalone leaf packet earned its own phase slot; iter 044 first-principles also separates this (convergent) | leaf packet |
| 005 | `external-project-adoption` (rename from `graph-impact-and-affordance-uplift`) | External project pt-01 + pt-02 adoption: clean-room license audit, graph impact, affordance uplift | Current 006-graph-impact-and-affordance-uplift (renamed) | Original name abstract; new name surfaces External Project adoption (iter 033:27-28, iter 046 holds for now) | phase parent |
| 006 | `code-graph-capability` | Code graph extraction + scanner + scan-scope + hooks + backend resilience | Current 007-code-graph with internal phases consolidated from 40 → 7 (4 active + 3 archive per iter 018) | Iter 045 PROCEED merges: 007/002 + 007/016-020 → 007/014; iter 048 reclassifies 18 delete-candidates → 28 ARCHIVE (not DELETE) for DEEP blast (iter 045:60-93) | phase parent |
| 007 | `skill-advisor-and-routing` | Skill advisor + routing intent + semantic lane + plugin hardening | Current 008-skill-advisor with internal phases (deferred to follow-on per iter 038) | Iter 038 defers internal phase proposal; iter 042 also flags 008 internal structure as out-of-scope for this restructure | phase parent (internal phases deferred) |
| 008 | `hook-parity-remediation` | Runtime hook parity core (001-005) + copilot wrapper fixes (006+007 merged) + documentation alignment (008) | Current 009-hook-parity reduced from 8 → 3 internal phases | Iter 045 PROCEED merge: 009/006+007 → 009/006 (preserve Level distinction); iter 022 conservative merge (iter 022:49-79) | phase parent |
| 009 | `cocoindex-daemon-resilience` | CocoIndex daemon defense-in-depth: socket-unlink, BrokenPipeError, lifecycle robustness | Current 011-cocoindex-daemon-resilience (unchanged) | Standalone leaf packet, no restructure churn (iter 001) | leaf packet |
| 010 | `causal-graph-channel-routing` | Graph-channel routing override + post-deep-review remediation | Current 012-causal-graph-channel-routing (unchanged) | All 2 nested children load-bearing; no restructure churn (iter 005) | phase parent |
| 011 | `doctor-and-repair-orchestration` | Doctor command consolidation: router + sandbox testing + RM-8 remediation + cutover | Current 013-doctor-update-orchestrator (5 children → 4 phases per iter 045 PROCEED merge of 001+002) | Iter 045 PROCEED merge: 013/001+002 → 013/001 (both superseded by 004+005); iter 014 conservative consolidation (iter 014:49-77) | phase parent |
| 012 | `local-embeddings-migration` (rename from `local-llama-cpp`) | Local embeddings migration: Voyage → OpenAI → llama-cpp → hf-local provider migration arc | Current 014-local-embeddings-migration reduced from 63 → 10 internal phases (iter 045 + iter 048 cleanup) | Severe naming mismatch resolved (iter 031:25-30, iter 033 rank-1 HIGH impact, iter 046 refined: setup-a → migration); iter 045 PROCEED merges 014/052+053 + 014/056+057 + cross-parent docs merge | phase parent |

**Phase removed from initial proposal:**

- **011-templates** (was iter 035's Phase 11) — current 010-template-levels children 004/005/006/009 are misplaced; rehome them to 008-skill-advisor (children 005+009) and 013/011-doctor (child 006); the 010 parent itself is retained for templates 001/002/003 (template-level definitions) as part of 002-resource-map-deep-loop-fix or as a small standalone phase. Iter 045 verdict on this is REDESIGN.

**Meta-phase outside sequence:**

- **000-release-cleanup** absorbs **015-global-security-sweep-and-supply-chain-audit** as a nested child (release-time security audit). Iter 047 phase-lifecycle governance supports this grouping (Stable / Stale / Archive transitions all touch release work).

### 3.2 Renames in scope (4 top-level)

Source: iter 033 (top-N rename proposals) + iter 046 (scale-pressure-test refinements).

| Current name | Proposed name | Recall impact | Iter |
|--------------|---------------|--------------:|------|
| `014-local-embeddings-migration` | `014-local-embeddings-migration` | HIGH | iter 033 rank-1, iter 046 refined |
| `015-global-security-sweep-and-supply-chain-audit` | `015-tanstack-security-audit` (or absorb into 000 as nested child) | MEDIUM-HIGH | iter 033 rank-2 |
| `006-graph-impact-and-affordance-uplift` | `006-external-project-adoption` | MEDIUM | iter 033 rank-3 |
| `002-resource-map-template` | `002-resource-map-deep-loop-fix` | MEDIUM | iter 033 rank-4 |

**Naming convention lock-in** (iter 034 + iter 046):

> **Domain-first + facet-second + work-type-last (optional).** Use noun-first surface naming as the primary axis (`code-graph`, `hook-parity`, `local-embeddings`). Append a discriminating facet only when the same surface has multiple distinct deliverables (`local-embeddings-migration` vs `local-embeddings-cache`). Use verb-first only for clear action-oriented remediation packets (`rm8-remediation`, `cleanup`). Avoid problem-statement naming (long descriptive names > 30 chars).

### 3.3 Merges (PROCEED now vs DEFERRED)

Source: iter 045 cost-benefit verdicts, refined by council review 2026-05-16. The council flagged several items previously labeled PROCEED as actually LOW_PRIORITY per iter 045; those move to the DEFERRED table below.

**PROCEED now (council-approved subset; first execution wave):**

| # | Merge target | Source packets | Rationale | Source iter |
|--:|--------------|---------------|-----------|-------------|
| M2 | 014/056-root-readme-deep-research | 014/057-root-readme-deeper-rewrite (absorb 057 INTO 056) | Same arc; iter 028 supersession | iter 045:18-24 |
| M3 | **`007-code-graph/014-system-code-graph-extraction`** (nested packet, not top-level) | 007/002-code-graph-self-contained-package | Code-graph extraction stays under 007 phase parent; merge 007/002 INTO 007/014 nested | iter 045:60-65, council 2026-05-16 |
| M4 | **`007-code-graph/014-system-code-graph-extraction`** (same nested packet) | 007/016, 007/017, 007/018, 007/019, 007/020 (extraction-phase children) | Same extraction arc; consolidate under one nested phase | iter 045:67-72, council 2026-05-16 |
| M5 | 003-continuity-memory-runtime (top-level) | 004-runtime-executor-hardening (entire phase parent) | Iter 045 PROCEED; high-risk mitigation: preserve 004's 3 nested children as nested phases under 003 + decision-record.md | iter 045:179-184, iter 037, iter 038 |
| M6 | **`009/002-runtime-hook-parity-core-2`** (council-corrected target) | 009/006-copilot-wrapper-schema-fix + 009/007-copilot-writer-wiring (both → 009/002) | Council correction: 3-packet thematic cluster, target is 002 not 006 | iter 045:109-114, iter 021, council 2026-05-16 |
| M7 | 013/001-doctor-commands | 013/002-sandbox-testing-playbook (absorb 002 INTO 001) | Both superseded by 013/004+005 (iter 028) | iter 045:53-58 |
| M11 | Archive (`z_archive/`; NOT delete) | Cross-parent documentation alignment artifacts (014/019, 014/020, 014/054-058, 007/025, 007/027-029, 009/008) | Documentation cleanup work; ARCHIVE per iter 048 DEEP-blast reclassification | iter 045:123-128, iter 048 |

**DEFERRED (LOW_PRIORITY / REDESIGN / blocked by recatalog):**

| # | Target | Verdict | Why deferred |
|--:|--------|---------|--------------|
| M1 | 014/052-mk-spec-memory-rename ← absorb 014/053 | LOW_PRIORITY | Iter 045 LOW_PRIORITY; defer to follow-on after high-priority work stabilizes |
| M8 | 008-skill-advisor ← rehome 010/005 + 010/009 | LOW_PRIORITY | Iter 045 LOW_PRIORITY; 010-template-levels parent retention question (open Q-2) blocks |
| M9 | 013-doctor ← rehome 010/006 | LOW_PRIORITY | Iter 045 LOW_PRIORITY; same 010 parent retention block as M8 |
| M10 | 000-release-cleanup ← absorb 015-tanstack-security-audit | BLOCKED | 000-release-cleanup has 59 child dirs (not 2 as initially claimed); duplicate `006-*` and `007-*` prefixes need recatalog FIRST. Council 2026-05-16 directive. Accept temporary 12-top-level state. |
| LOW_PRIORITY × 1 | (various 014/*) | LOW_PRIORITY | See iter 045 table |
| REDESIGN × 7 | (various) | REDESIGN | Requires further analysis before execution |
| ABORT × 3 | (various) | ABORT | Cost > benefit; do not execute |

**Net first-execution merge count: 7 (down from 11)**. The deferred 4 + LOW_PRIORITY/REDESIGN/ABORT items wait for a follow-on packet after the first wave verifies recall improvement.

See `research/iterations/iteration-045.md` for the complete verdict table and `research/council-review.md` for the council's path-correction rationale.

### 3.4 Deletes + Archives — by iter 048 blast-radius class (HARD CONSTRAINT)

Source: iter 030 (consolidated delete list, 55 candidates) + iter 048 (blast-radius reclassification — TREAT AS HARD CONSTRAINT per council 2026-05-16).

The council directive: **iter 048's blast-radius classes are hard constraints**. The proposal MUST follow these action classes exactly. No item from a higher blast class may move to a lower-risk action by hand-wave.

| Class | Count | Required action | First-wave action |
|-------|------:|-----------------|-------------------|
| CONTAINED (zero external references) | 8 | DELETE | DELETE in W3.1 |
| SHALLOW (≤ 3 doc refs) | 7 | DELETE WITH CLEANUP (remove refs first) | Deferred to follow-on (requires ref-count proof) |
| MEDIUM (> 3 refs, mostly historical) | 11 | DELETE WITH CLEANUP (full external ref cleanup first) | Deferred to follow-on (requires ref-count proof) |
| DEEP (code refs, graph refs, hardcoded paths) | **28** | **ARCHIVE** to `z_archive/`. Do NOT delete. Read-access preserved. | ARCHIVE in W3.4 |
| Total | 54 | — | 8 CONTAINED deletes + 28 archives in first wave |

**First-wave delete targets (CONTAINED only — 8 packets)**:

The CONTAINED list is the only safe-to-delete-in-first-wave set. Names pulled from iter 048's blast-radius table — see iter-048.md for the exact 8 paths. Typical pattern: empty placeholder dirs + completed-unreferenced packets with zero `grep -r` hits outside research artifacts.

**First-wave ARCHIVE targets (DEEP — 28 packets)**:

- 007/022-030 (9 packets — superseded by 014-system-code-graph-extraction nested; DEEP per iter 048)
- 007/031-034 + 007/037-039 (7 packets — deep-review campaign artifacts; DEEP per iter 048)
- Plus 12 additional DEEP packets across 014/* and 009/* (see iter-048.md for exact list)

**Deferred deletes (SHALLOW + MEDIUM — 18 packets)**:

These require ref-count proof per packet before deletion. Sequenced as a follow-on after the first wave verifies recall improvement. Council directive: "require ref-count proof before cleanup-required deletes" (council §6 risk 3).

**Empty placeholder directories (2 candidates)**:

- 014/045, 014/048 — empty directories per iter 042. Verify zero contents before delete. If empty, include in W3.1 CONTAINED batch.

### 3.5 Phase lifecycle governance (forward-looking)

Source: iter 047 (forward-looking; not strictly in this packet's scope but recommended for follow-on).

| Stage | Definition | Transition trigger |
|-------|-----------|---------------------|
| Active | In progress, commits in last 30 days | New packet → set status: planned |
| Stable | Complete, referenced by current code, frozen | spec.md status: Complete + graph-metadata derived.status: complete |
| Stale | Complete + no commits in 90 days + zero external references | Cron sweep detects; flag for operator review |
| Superseded | Later packet replaced its output | graph-metadata.manual.superseded_by set; spec.md status updated |
| Orphan | Empty / scratch / abandoned | spec.md missing or < 50 LOC + no commits in 30 days |

Tooling needed: `phase-lifecycle-sweep.sh` cron script (recommended but out of scope for this packet's execution).
<!-- /ANCHOR:proposed-state -->

---

<!-- ANCHOR:migration-plan -->
## 4. MIGRATION PLAN

Source: iter 049 (restructure ordering for partial-state safety).

Five waves executed sequentially. Each wave commits its own SHA; on wave failure, `git reset --hard <wave-start-sha>` and re-attempt.

### 4.1 Wave 1 — Renames (lowest risk; 4 operations)

Renames are cheapest and most reversible. Execute first so subsequent merges work against the final names.

| Op | Action | Risk |
|----|--------|------|
| W1.1 | `git mv 014-local-embeddings-migration 014-local-embeddings-migration` + update graph-metadata.json `manual.depends_on` references | Low |
| W1.2 | `git mv 015-global-security-sweep-and-supply-chain-audit 015-tanstack-security-audit` (or skip if absorbing into 000 in W2) | Low |
| W1.3 | `git mv 006-graph-impact-and-affordance-uplift 006-external-project-adoption` | Low |
| W1.4 | `git mv 002-resource-map-template 002-resource-map-deep-loop-fix` | Low |

Per-wave verification: every renamed packet's strict-validate exits 0; grep -r for old names returns 0 outside the rename's own metadata.

### 4.2 Wave 2 — Merges (medium risk; 11 operations)

Execute after renames are stable. Each merge has its own atomic group: content union + source removal/archive + local graph-metadata update + local reference cleanup.

| Op | Action | Atomic group |
|----|--------|--------------|
| W2.1 | M1: absorb 014/053 into 014/052 | merge content + delete 053 dir + update 014/graph-metadata.json |
| W2.2 | M2: absorb 014/057 into 014/056 | same pattern |
| W2.3 | M3: move 007/002-code-graph-self-contained-package to 014 (extraction packet) | rename + update parent graph-metadata.json on both sides |
| W2.4 | M4: move 007/016-020 to 014 (extraction-phase children batch) | batch rename |
| W2.5 | M5: merge 004-runtime-executor-hardening INTO 003-continuity-memory-runtime; preserve 004's 3 children as nested phases under 003 + add decision-record.md | content union + child reparent + decision record |
| W2.6 | M6: absorb 009/007-copilot-writer-wiring into 009/006-copilot-wrapper-schema-fix | merge + delete 007 |
| W2.7 | M7: absorb 013/002-sandbox-testing-playbook into 013/001-doctor-commands | merge + archive 002 |
| W2.8 | M8: rehome 010/005 + 010/009 to 008-skill-advisor (rename to 008/005-references-assets-alignment + 008/009-rm8-prompt-hardening) | cross-parent move |
| W2.9 | M9: rehome 010/006 to 013 (rename to 013/006-command-md-yaml-alignment) | cross-parent move |
| W2.10 | M10: absorb 015-tanstack-security-audit as nested child under 000-release-cleanup (or skip if W1.2 already renamed and kept as top-level) | cross-parent move |
| W2.11 | M11: archive cross-parent documentation alignment artifacts (014/019, 014/020, 014/054-058, 007/025, 007/027-029, 009/008) to z_archive/ | batch archive |

Per-wave verification: every touched parent's strict-validate exits 0; grep -r for source-packet names returns 0 outside the merge target + the archive.

### 4.3 Wave 3 — Deletes (medium risk; 26 active deletes + 28 archives)

After merges land, the delete-candidate list is stable. Execute deletes in batches per blast-radius classification.

| Op | Action | Risk |
|----|--------|------|
| W3.1 | DELETE 8 CONTAINED packets (zero external references) | Low |
| W3.2 | DELETE 7 SHALLOW packets (≤ 3 doc references; remove refs first) | Medium-Low |
| W3.3 | DELETE 11 MEDIUM packets (> 3 refs; full ref cleanup first) | Medium |
| W3.4 | ARCHIVE 28 DEEP packets (move to z_archive/; do NOT delete) | Low (archive is reversible) |

Per-op verification: ref count for the packet name drops to 0 (or only inside the same packet/archive) after the cleanup; strict-validate stays clean on neighboring packets.

### 4.4 Wave 4 — Parent doc rewrites (atomic group; 3 operations commit together)

After structural changes settle, refresh the phase parent's control documents.

| Op | File | Action |
|----|------|--------|
| W4.1 | `026/spec.md` | Apply iter 039 proposed structure (20 sections with QUICK START, PHASE SEQUENCE, PHASE DOMAIN MAP, RESUME SCENARIOS) |
| W4.2 | `026/resource-map.md` | Apply iter 039 proposed structure (14 sections with PHASE-TO-ARTIFACT MAP and DOMAIN-TO-PHASE CROSS-REFERENCE) |
| W4.3 | `026/graph-metadata.json` | Add `derived` fields: phase_sequence, resume_priority, search_keywords_by_phase, phase_parent_flag, meta_phase_ids, phase_renames |

These commit TOGETHER (atomic group). Per-op verification: strict-validate exits 0 on 026 phase parent; sample queries from iter 040 + iter 050 return correct first-pick within hop targets.

### 4.5 Wave 5 — Index refreshes (3 operations)

After all structural changes commit, refresh the indexes that depend on the new structure.

| Op | Action |
|----|--------|
| W5.1 | `ccc index --refresh` (CocoIndex re-scan covers the new file paths + renamed packets) |
| W5.2 | `memory_index_scan({ specFolder: "026-graph-and-context-optimization" })` (memory semantic index refresh) |
| W5.3 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 026-graph-and-context-optimization --strict` (final phase-parent validation) |

Per-op verification: indexes return current paths; strict-validate exit 0.

### 4.6 Per-wave recovery baseline

Before each wave, capture the HEAD SHA: `git rev-parse HEAD > .wave-N-baseline`. On wave failure, `git reset --hard $(cat .wave-N-baseline)` and re-attempt that wave.
<!-- /ANCHOR:migration-plan -->

---

<!-- ANCHOR:recall-optimization -->
## 5. RECALL OPTIMIZATION

### 5.1 Sample-query proof points

Source: iter 040 (SWE-1.6 proof points) + iter 050 (gpt-5.5 validation design) + council adjustment 5 (4 additional broader queries 2026-05-16).

| Query | Current first-pick | Current hops | Proposed first-pick | Proposed hops | Savings |
|-------|--------------------|-------------:|---------------------|-------------:|--------:|
| "How was hook parity testing built?" | 009-hook-parity → 001-hook-parity-remediation | 3 | 008-hook-parity-remediation → 001-runtime-hook-parity-core | 3 | 0 |
| "Where is the code-graph extraction history?" | 007-code-graph → scan 40 packets → 014-system-code-graph-extraction | 4 | 006-code-graph-capability → Phase 2 or 3 → extraction packet | 3 | 1 |
| "How was the resource map template created?" | 002-resource-map-template → 002-resource-map-template-creation | 3 | 002-resource-map-deep-loop-fix → 002-resource-map-template-creation | 3 | 0 |
| "How was the cli-devin deep-loop iter contract designed?" | uncertain (002 or 014/059?) | 5-6 | 012-local-embeddings-migration → Phase 5+ → 059-cli-devin-deep-loop-alignment | 3 | 2-3 |
| "How was the doctor command consolidation done?" | 013-doctor-update-orchestrator → scan 5 packets → consolidation packet | 3 | 011-doctor-and-repair-orchestration → 4 internal phases → consolidation packet | 3 | 0 |
| "How does skill-advisor route to a skill?" (council Q6) | 008-skill-advisor → scan 26 packets (no clear entry point) | 4-5 | 007-skill-advisor-and-routing → routing-and-intent phase | 3 | 1-2 |
| "When did memory-indexer-invariants land?" (council Q7) | 005-memory-indexer-invariants directly (correct first pick today) | 2 | 004-memory-indexer-invariants (renumbered) | 2 | 0 |
| "Where is the TanStack security audit?" (council Q8) | 015-global-security-sweep-and-supply-chain-audit (verbose name) | 3 | 015-tanstack-security-audit OR 000-release-cleanup/<NN>-tanstack-security-audit (post-recatalog) | 2-3 | 0-1 |
| "What was the template-levels work and how did it split?" (council Q9) | 010-template-levels (single bucket; can't tell what survives vs rehomes) | 4 | 010-template-levels (parent retained for templates 001/002/003) + cross-refs to 007-skill-advisor (005, 009) + 011-doctor (006) | 2 | 2 |

**Aggregate (revised with council 4 queries)**: ~6-8 hops saved across 9 sample queries; 4-5/9 first-pick correctness improvement; 1 known regression (resource map query — accepted).

**Council's caveat**: the proof points DEMONSTRATE semantic clustering helps **cross-cutting** + **large subsystems** but DO NOT prove "the whole plan improves recall" — narrowly scoped packets see no improvement. The cheapest-variant restructure captures the high-impact gains without the marginal-benefit work.

**Key insight (iter 040 + iter 050 + council 2026-05-16)**: the proposed restructure's main value is **semantic clustering** — grouping related work under descriptive phase names that make it easier to guess the right starting point. Best for cross-cutting concerns (deep-loop methodology, skill routing) and large subsystems (code graph, local embeddings). Less helpful for narrowly scoped packets (resource map template, memory-indexer-invariants).

### 5.2 Validation assertions (iter 050)

Test these post-restructure:

1. **Hop-from-root assertion**: graph traversal from 026 root reaches every retained phase in ≤ 2 hops
2. **Resume-pointer assertion**: `derived.last_active_child_id` resolves to the highest-priority active phase
3. **Per-phase trigger_phrases assertion**: every retained phase has distinctive `key_topics` / `trigger_phrases` that don't collide with siblings
4. **memory_search proof query 1**: "code graph extraction" returns 006-code-graph-capability + nested extraction packet within top 3 results
5. **memory_search proof query 2**: "hook parity" returns 008-hook-parity-remediation + 001-runtime-hook-parity-core within top 3 results
6. **cocoindex proof query 1**: "deep-loop iter contract" returns 012-local-embeddings-migration's 059-cli-devin-deep-loop-alignment within top 5 results
7. **cocoindex proof query 2**: "resource map" returns 002-resource-map-deep-loop-fix within top 3 results
8. **No-load-bearing-loss assertion**: every iter 048 DEEP-classified packet remains read-accessible from `z_archive/`
9. **Phase count reduction assertion**: top-level 026 children count = 11 (or 12 if 015 stays separate; 10 + meta if absorbed into 000)
<!-- /ANCHOR:recall-optimization -->

---

<!-- ANCHOR:risks -->
## 6. RISKS AND MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Wave 2 merge loses load-bearing decision records | Medium | High | M5 (004→003) preserves 004's 3 nested children as nested phases + adds decision record per iter 038. Wave-2-N atomic groups commit together so a half-merge can revert. |
| Wave 3 DEEP-classified delete drops live references | Low | High | Iter 048 reclassified DEEP candidates to archive (not delete); 28 packets move to `z_archive/` retaining read-access. |
| Wave 4 parent-doc rewrite breaks resume / search semantics | Medium | Medium | iter 039 proposes specific structure aligned with iter 050 sample queries; pre + post measurement validates. |
| Wave 5 index refresh hits CocoIndex daemon issues | Low | Medium | cocoindex-daemon-resilience (011 / 009 in proposed numbering) provides recovery; failure modes documented. |
| Cross-parent move (M8, M9, M10) breaks downstream consumers | Medium | Medium | Cleanup operations enumerated; iter 048 counted 150 total cleanup ops needed across all PROCEED + PROCEED_WITH_CLEANUP. |
| Memory search returns stale results after restructure | Low | Low | W5.2 `memory_index_scan` covers; spec-doc embeddings re-generate on touched files. |
| Naming convention drift in future packets | Medium | Low | iter 046 documented the convention; iter 047 phase-lifecycle governance recommended as follow-on. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS

Deferred from research synthesis (iter 999 research.md §Open Questions):

1. **015-extracted-skills-isolation phantom**: graph-metadata.json line 23 references it but filesystem doesn't have it. Should the graph-metadata entry be removed (W4.3) or should the packet be created? Recommend REMOVE the entry as part of Wave 4.

2. **010-template-levels parent retention**: after children 004/005/006/009 rehome, what stays in 010? Recommend keep 010 for the actual template-level definitions (children 001/002/003) and absorb into 002-resource-map-deep-loop-fix as Phase 2 if size warrants.

3. **008-skill-advisor internal phase structure**: deferred to follow-on packet. Iter 042 noted internal-structure analysis is out of scope for this restructure.

4. **iter 029 orphan-detection gap**: SWE-1.6 iter 029 failed; orphan-packet detection is partial (covered by iter 027/028/030 + iter 048 blast-radius). Recommend re-dispatch iter 029 post-execution to confirm no orphans missed.

5. **006-graph-impact-and-affordance-uplift implementation evidence**: confidence-weak per iter 041. Worth a focused inspection before W1.3 rename (or absorb into 005 if no implementation).

6. **000-release-cleanup nested structure post-W2.10**: if 015 absorbs as nested child, how do existing 000 children (014-phase-parent-documentation, 015-mcp-runtime-stress-remediation) co-exist with the new 015-tanstack-security-audit child? Recommend renumber to avoid collision: 016-tanstack-security-audit or push current 015-mcp-runtime-stress-remediation → 016.
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:authoring-status -->
## 8. AUTHORING STATUS

| Section | Status | Source |
|---------|--------|--------|
| 1. Overview | Filled | direct authoring + research.md executive summary |
| 2. Current state | Filled + council corrections | iter 001-006 + iter 042 + council 2026-05-16 (000 child count 2→59) |
| 3. Proposed state | Filled + council corrections | iter 035 + 038 + 044 + 045 + 046 + council 2026-05-16 (M3/M4 path, M6 target, DEFERRED reclassifications) |
| 4. Migration plan | Filled | iter 049 (5-wave structure) |
| 5. Recall optimization | Filled + council additions | iter 040 + iter 050 + council 4 broader queries |
| 6. Risks and mitigation | Filled | iter 037 + 038 + 048 + council exec-risk additions |
| 7. Open questions | Filled | research.md open-questions section + council deferrals |
| 8. Authoring status | This section | — |
| 9. Council adjustments applied | New section below | council 2026-05-16 |
<!-- /ANCHOR:authoring-status -->

---

<!-- ANCHOR:council-adjustments -->
## 9. COUNCIL ADJUSTMENTS APPLIED (2026-05-16)

Source: `research/council-review.md` (gpt-5.5 reasoning_effort=xhigh service_tier=fast).

**Verdict**: REVISE_BEFORE_EXECUTING. Halt and revise, then execute the reduced variant.

| # | Council adjustment | This resource-map's response | Section updated |
|--:|--------------------|------------------------------|------------------|
| A1 | Fix M3/M4 target wording: target is `007-code-graph/014-system-code-graph-extraction` (nested), NOT top-level `014-local-embeddings-migration` | M3/M4 rewritten with the correct nested path | §3.3 |
| A2 | Remove LOW_PRIORITY/REDESIGN items from "11 PROCEED" table; specifically defer M1, M8, M9, and rewrite M6 to target `009/002` | M1, M8, M9, M10 moved to DEFERRED table. M6 target corrected to `009/002-runtime-hook-parity-core-2`. PROCEED count reduced from 11 to 7. | §3.3 |
| A3 | Defer M10 (015 → 000) until 000-release-cleanup is recataloged (currently 59 child dirs with duplicate 006-* / 007-* prefixes) | M10 moved to BLOCKED in DEFERRED table. Resource-map §2.1 and §2.2 corrected from "2 children" to "59 children" for 000-release-cleanup | §2.1, §2.2, §3.3 |
| A4 | Rewrite delete section: use iter 048 action classes as hard constraints. CONTAINED → DELETE; SHALLOW/MEDIUM → DELETE WITH CLEANUP (with ref-count proof); DEEP → ARCHIVE. Do not call archive candidates "pure deletes". | §3.4 rewritten with hard-constraint framing. First-wave action: 8 CONTAINED deletes + 28 DEEP archives ONLY. 18 SHALLOW+MEDIUM deferred pending ref-count proof. | §3.4 |
| A5 | Strengthen recall proof: add sample queries for skill-advisor routing, memory/indexer, release/security, 010-template-levels | 4 new queries added to §5.1; aggregate now 9 queries with ~6-8 hops saved | §5.1 |

### First-wave execution plan (council-approved reduced variant)

The council's "Cheapest variant" becomes the FIRST EXECUTION WAVE. Defer everything else to follow-on packets.

**First wave scope**:

- **4 top-level renames** (§3.2): 014 → 014-local-embeddings-migration; 015 → 015-tanstack-security-audit (keep as top-level for now; DEFER absorbing into 000); 006 → 006-external-project-adoption; 002 → 002-resource-map-deep-loop-fix
- **7 PROCEED merges** (§3.3): M2, M3, M4, M5, M6, M7, M11 — see council-corrected targets
- **8 CONTAINED deletes** (§3.4): per iter 048's CONTAINED class — names from iter-048.md table
- **28 DEEP archives** (§3.4): move to `z_archive/`, preserve read-access
- **Parent-doc rewrites** (§4 Wave 4): 026/spec.md + 026/resource-map.md + 026/graph-metadata.json refresh atomically
- **Index refresh** (§4 Wave 5): cocoindex + memory_index_scan + strict-validate sweep

**Deferred to follow-on**:

- M1 (014/052 + 053) — LOW_PRIORITY
- M8 + M9 (010 rehome to 008/013) — LOW_PRIORITY, blocked by 010 parent retention Q
- M10 (015 → 000) — BLOCKED by 000 recatalog need (59 children, dup prefixes)
- 18 SHALLOW + MEDIUM deletes — require per-packet ref-count proof
- 008-skill-advisor internal phase structure — out of scope per iter 038/042
- iter 029 orphan-detection completion — recommend re-dispatch post-execution
- Phase lifecycle governance — recommend follow-on packet per iter 047

**Estimated effort savings**: ~40% less effort than the full plan, captures ~75% of recall benefit. Council §5 verdict: ACCEPT_FULL → REDUCED.

### Next steps (post-revision)

1. ✅ Council review committed (commit `c789ea802`)
2. ✅ This resource-map revised per council adjustments A1-A5
3. ⏳ Schedule follow-on restructure execution packet implementing the reduced first-wave scope
4. ⏳ Use `implementation-dispatch.md` for executor selection (deepseek-v4-pro via cli-opencode primary, cli-devin fallback, SWE-1.6 last resort)
5. ⏳ 999 packet DELETED after restructure completes (per ADR-005)
<!-- /ANCHOR:council-adjustments -->
