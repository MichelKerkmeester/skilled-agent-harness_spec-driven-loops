---
title: "999: 026 graph-and-context-optimization restructure research"
description: "Temporary research packet — 40-iter cli-devin SWE-1.6 deep-research analyzing the current 026 phase parent and its 22 children to propose a consolidated restructure (merge / remove / regroup / rename) optimized for historic recall. Packet is deleted after the resulting restructure ships."
trigger_phrases:
  - "999 spec"
  - "026 restructure"
  - "spec-restructure-research"
  - "phase consolidation research"
  - "historic recall optimization"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-15T21:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 999 packet for 40-iter deep-research dispatch"
    next_safe_action: "Invoke /spec_kit:deep-research:auto with cli-devin / swe-1.6 / 40 iter"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/description.json"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:5e54e0a4c0a4f08a9f9eaa6f4f88b6e2b5fb1c5d4c2a8f7e2e0c8a5d4f3b2a1c"
      session_id: "999-spec-restructure-scaffolded"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which 026 children are stale and can be deleted vs which carry irreplaceable historic context worth keeping?"
      - "Which children represent the same underlying initiative and should merge?"
      - "What is the optimal phase grouping for best historic recall — by surface (memory / graph / hooks / executor), by chronology, or by problem-domain?"
      - "How should the phase-parent spec.md, resource-map.md, and graph-metadata.json be restructured so resume / search / graph traversal land on the right phase first?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 999: 026 graph-and-context-optimization restructure research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Lifespan** | Temporary — DELETE after restructure ships |
| **Executor** | cli-devin / SWE-1.6 |
| **Iterations** | 40 (fixed, no early convergence) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 026 graph-and-context-optimization phase parent currently has 22 children (children numbered 000-015 plus phase-parent metadata files). The recent shotgun arc (~ 60+ packets shipped across 2026-04 / 2026-05) added many narrow follow-on packets, audit packets, and remediation packets that solved real problems but left 026's organization cluttered. Historic recall is suboptimal: a future operator searching for "how was X done" lands on the wrong packet, the same initiative appears under multiple numbers, and the phase-parent spec.md does not surface the most important children first.

### Purpose

Produce a verified restructure proposal that consolidates 026 into a smaller set of clearly-named child phases, with each phase grouping its associated work (research + implementation + remediation + audit) under one roof. Optimize for best historic recall — a future operator should be able to find any past work in 026 within two lookups (parent spec.md or resource-map.md → the right phase).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (the deep-research run)

- Read every direct child of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` — there are 22 today
- Read each child's `spec.md`, `description.json`, `graph-metadata.json`, `implementation-summary.md` (when present), and any phase-parent control files for nested children
- Cross-reference shipping evidence via git log against each packet
- Score each child on three axes: still-load-bearing / merge-candidate / delete-candidate
- Propose a target restructure: merge groups, delete clusters, rename phases for clarity, regroup by canonical domain
- Synthesize the proposal into a single architecture / resource-map document

### In Scope (this packet's deliverables)

- `research/research.md` — synthesized findings ledger (from 40 iter)
- `research/iterations/iteration-NNN.md` — 40 individual iter outputs
- `research/deep-research-state.jsonl` — per-iter state delta
- `resource-map.md` — the architecture / target-state document

### Out of Scope (deferred to follow-on packet)

- Actually executing the merge / delete / rename — that is a separate packet that consumes this packet's resource-map
- Cross-026 restructure (other 0NN parents like 027, 028 — not in scope)
- Modifying any 026 child packet contents — read-only research
- Deleting this 999 packet — the follow-on restructure packet handles its own cleanup
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | 40 iter outputs exist at `research/iterations/iteration-001.md` through `iteration-040.md`, each ≥ 1000 bytes with file:line citations |
| REQ-002 | `research/deep-research-state.jsonl` has 40 rows, one per iter, with required fields per the iter contract |
| REQ-003 | `research/research.md` consolidates all 40 iter findings, grouped by domain / theme, with provenance (iter number → finding mapping) |
| REQ-004 | `resource-map.md` proposes a target 026 layout naming every retained / merged / deleted child explicitly, with rationale per move |
| REQ-005 | The resource-map identifies at minimum: which children to merge, which to delete (with reason), which to rename, and the proposed final phase count (target: significantly fewer than current 22) |
| REQ-006 | Every recommendation in the resource-map cites the iter number that surfaced it |
| REQ-007 | The packet's strict-validate exits 0 |
| REQ-008 | All iter dispatches use cli-devin / SWE-1.6 / `--permission-mode auto` and pin the agent-config-deep-research-iter.json recipe (per the deep-loop iter contract from packet 059) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 40 iter ran to completion; per-iter commit lineage visible in `git log --oneline`
- Synthesis pass produced `research/research.md` citing every iter
- `resource-map.md` proposes a target 026 layout that a follow-on restructure packet can execute mechanically
- Strict-validate exits 0 on the 999 packet
- The proposal materially improves historic recall — at least 3 sample queries demonstrate the target-state layout finds the right packet faster than the current state
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Iter dispatch hangs on a particular packet (large `implementation-summary.md`) | Medium | Medium | Per-iter timeout (1200s); per-iter immediate commit so a hang loses at most one iter |
| SWE-1.6 hallucinates structure not present in the read evidence | Medium | High | Iter contract requires file:line citations for every claim; synthesis pass validates citation density |
| Restructure proposal is too aggressive (proposes deleting load-bearing context) | Medium | High | Resource-map marks every delete with the iter that justified it; main-agent reviews before the follow-on restructure executes |
| 40 iter is overkill and produces redundant findings | Low | Low | Synthesis pass deduplicates; overkill is preferable to undercoverage for meta-analysis |
| Parallel session corrupts this packet's research/ dir | Low | High | Per-iter immediate commit on `main`; user runs no parallel deep-loop in 026 during this run |

### Dependencies

- cli-devin SWE-1.6 deep-loop iter contract (packet 059): `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`
- `agent-config-deep-research-iter.json` recipe (packet 059)
- `spec_kit_deep-research_auto.yaml` `if_cli_devin:` branch with `--agent-config` wiring (packet 059 + follow-on commit `40eaf8007`)
- `executor-config.ts` validator accepts cli-devin (already shipped)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Cost**: SWE-1.6 dispatches are inexpensive — 40 iter × ~5 min/iter ≈ 3-4 hours wall-clock; cost dominated by Devin units, not API tokens
- **Safety**: read-only on the rest of the codebase; only writes happen inside `999-spec-026-restructure-research/research/`
- **Idempotency**: per-iter commits are atomic; resume-after-crash works by re-reading state.jsonl and continuing from the last logged iter
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Child has no spec.md** (legacy child or scratch): iter logs the absence and moves on; the resource-map proposal must classify how to handle these
- **Child is a phase parent itself** (e.g. 014-local-llama-cpp): iter must recurse into nested children when scoring the parent
- **Empty / orphan packets** (created but never populated): classify as delete-candidate by default
- **In-progress packets** (status=in_progress per graph-metadata): mark as "preserve as-is" until they complete; restructure proposal must not assume completion
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which 026 children are stale and can be deleted vs which carry irreplaceable historic context worth keeping?
- Which children represent the same underlying initiative and should merge?
- What is the optimal phase grouping for best historic recall — by surface (memory / graph / hooks / executor), by chronology, or by problem-domain?
- How should the phase-parent spec.md, resource-map.md, and graph-metadata.json be restructured so resume / search / graph traversal land on the right phase first?
<!-- /ANCHOR:questions -->
