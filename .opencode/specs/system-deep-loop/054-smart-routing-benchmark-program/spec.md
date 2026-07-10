---
title: "Feature Specification: Smart-Routing Benchmark Program (both hubs, both modes)"
description: "Skill routing was only partially measured: sk-code children lacked their own parseable routers and gold, so per-child intra-routing recall and parent-to-child discoverability could not be scored uniformly across the sk-code and system-deep-loop hubs. This program builds reproducible per-target benchmarks on non-fabricated gold."
trigger_phrases:
  - "smart routing benchmark"
  - "skill benchmark"
  - "per-child routing recall"
  - "intra-routing"
  - "parent child discoverability"
  - "router mode-a mode-b"
  - "circularity meter"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program"
    last_updated_at: "2026-07-08T20:40:28Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the full 20-run routing benchmark matrix"
    next_safe_action: "Wire the Mode-A configs + drift guard into a CI job (only remaining follow-up)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Trim Mode-B to the representative-per-family sample, or run all 10 once the migration unblocks the deep-loop hub?"
    answered_questions:
      - "Both hubs, each child its own router+gold, both modes — locked by operator before build"
---
# Feature Specification: Smart-Routing Benchmark Program

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Skill routing has two distinct qualities that were only partially measured: **(Type 1)** once a child `SKILL.md` is loaded, does it route to the correct `references/assets`; and **(Type 2)** given a request, does the parent hub route to the correct child `SKILL.md`. The Lane C skill-benchmark engine already scores both, but the sk-code children were not uniformly benchmarkable — only `code-review` self-routed; `code-webflow`/`code-opencode` relied on the parent `smart_routing.md`; `code-quality` routes by target-path; and `deep-ai-council` used an unparseable tuple `INTENT_MODEL`. This program gives each of the 8 children its own parseable router + non-fabricated gold, keeps the sk-code parent as an enforced **union projection** of its children (so the working hub run stays byte-identical), and scores every target in a deterministic router-replay **Mode A** (the CI gate) corroborated by a live `cli-opencode` **Mode B** (advisory).

**Key Decisions**: decentralize sk-code surface-child routing into each child with the parent as a drift-guarded union projection; Type-1 gold is per-child sk-doc-shape playbooks (not fixtures), because contamination-lint hard-fails fixtures but treats playbooks as advisory.

**Critical Dependencies**: none outstanding. A concurrent `deep-loop-workflows -> system-deep-loop` content migration initially looked like it gated `deep-ai-council`, but its edits proved disjoint from the routing change — see decision-record ADR-006.

---

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (CI wiring follow-up) |
| **Created** | 2026-07-08 |
| **Branch** | `054-smart-routing-benchmark-program` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->

### Problem Statement
Skill routing quality was only partially measured. The two routing qualities that matter — per-child intra-routing recall (Type 1) and parent→child discoverability (Type 2) — could not be scored uniformly across the `sk-code` and `system-deep-loop` hubs, because the sk-code children lacked their own parseable inline routers and non-fabricated gold, and `deep-ai-council` used an `INTENT_MODEL` shape the harness could not parse.

### Purpose
Every routing target (8 children + 2 hubs) has a reproducible Mode-A gate score and a Mode-B live corroboration, built on non-fabricated gold, guarded so the sk-code parent projection stays `== union(children) + parent-owned tier`.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->

### In Scope
- Decentralize sk-code surface-child routing (`code-webflow`, `code-opencode`) into inline `INTENT_SIGNALS`/`RESOURCE_MAP` blocks over child-relative paths; rewrite the parent `smart_routing.md` `RESOURCE_MAP` as the mechanical union.
- Thin honest Type-1 router for `code-quality`; tighten `code-review` gold to exact `assets/*` paths.
- Per-child Type-1 gold as sk-doc-shape playbooks under each child's `manual_testing_playbook/10--intra-routing-recall/` (deep-loop children) or category folders (sk-code children).
- Extend the drift guard (`sk-code-router-sync.vitest.ts`) to assert parent `==` union(children) + parent-owned-tier allowlist, each child self-parseable, and every child path on disk.
- Mode-A (router-replay, CI gate) + Mode-B (live `cli-opencode gpt-5.5-fast`, advisory) runs; capture reproducible baselines.

### Out of Scope
- New benchmark engine code — the Lane C engine already scores both types; no engine change is needed.
- `code-quality` keyword-routing fiction — its real precision is target-path-keyed and stays a unit test, not a Mode-A dimension.
- CI job wiring for the Mode-A configs — the drift guard already runs as a vitest; a benchmark-gate workflow needs a CI-strategy decision and is left as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code/{code-webflow,code-opencode}/SKILL.md` | Modify | Add inline §2b `SMART ROUTING (machine-readable)` router |
| `sk-code/{code-quality,code-review}/SKILL.md` | Modify | Thin router / tightened gold |
| `sk-code/shared/references/smart_routing.md` | Modify | Rewrite `RESOURCE_MAP` as the union projection |
| `.../skill-benchmark/tests/sk-code-router-sync.vitest.ts` | Modify | Extend the drift guard |
| `{sk-code,system-deep-loop}/*/manual_testing_playbook/**` | Create | Per-child Type-1 recall playbooks |
| `{sk-code,system-deep-loop}/*/benchmark/**` | Create | Captured Mode-A / Mode-B baselines |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-code parent stays a faithful union projection of its children | Drift guard green; sk-code hub Mode-A byte-identical to the P0 baseline |
| REQ-002 | Each un-gated child has a parseable inline router | `router-replay --skill <child>` returns non-empty intents+resources; not `BLOCKED-BY-STRUCTURE` |
| REQ-003 | Each un-gated child has non-fabricated Type-1 gold | Real `resourceRecall` (no empty-gold fallback); contamination-lint advisory-clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Mode-B corroboration exists for both hub families | **Met** — all 8 children + both hubs scored live; A→B gap recorded per target |
| REQ-005 | `deep-ai-council` normalized + deep-loop hub Type-2 route-gold | **Met** — INTENT_SIGNALS normalization + gold shipped (clean origin-prose+INTENT commit); deep-loop hub scored both modes |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->

- **SC-001**: all 8 children score PASS in Mode-A on their own gold. — **met** (84–100; deep-ai-council 92)
- **SC-002**: sk-code parent `RESOURCE_MAP == union(children) + tier`, enforced by a green drift guard. — **met**
- **SC-003**: Mode-B live pipeline proven and corroborates every target, with the circularity meter (A→B gap) published. — **met** (full 20-run matrix)
- **SC-004**: `deep-ai-council` + deep-loop hub Type-2 landed. — **met** (deep-ai-council PASS 92/live 76; deep-loop hub Mode-A 100/live 93)
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Held `deep-loop-workflows -> system-deep-loop` migration | Blocks `deep-ai-council` commit + deep-loop hub Type-2 | Defer; commit only new, un-entangled files; resume when the tranche reaches origin |
| Risk | Breaking the working two-layer sk-code hub run | High | P0-vs-P3 byte-stable baseline gate |
| Risk | Path drift silently depressing `resourceRecall` | Medium | P0 drift reconciliation is a hard prereq for all downstream phases |
| Risk | Self-referential (overfit) Type-1 gold | Medium | Mandatory T2 blind-holdout intent + the circularity meter (large A→B gap flags overfit) |
| Risk | Mode-B cost / nondeterminism | Low | Advisory only, never a gate; trim to representative-per-family if needed |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Mode-A router-replay is deterministic and offline (no model dispatch); a re-run is byte-identical.

### Reliability
- **NFR-R01**: Commits use the scratch-index recipe with a blast-radius gate; no file outside the path-scoped set may appear in a commit.

---

## 8. EDGE CASES

### Data Boundaries
- Empty gold: a child with no playbook scores `NO-SCENARIOS` — the pre-program state this fixes.
- Contaminated fixture: `--fixtures-dir` hard-fails a router-keyword leak (score 0); the playbook corpus treats it as advisory — the reason Type-1 gold is playbooks, not fixtures.

### Error Scenarios
- Migration entanglement: a child whose `SKILL.md` carries concurrent-migration renames is deferred, not force-committed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 10 targets, ~50 new gold files across 2 hubs |
| Risk | 16/25 | Load-bearing router decentralization; byte-stable-hub invariant; migration entanglement |
| Research | 12/20 | Contamination-lint tension, parseRouter precedence, two-layer hub semantics |
| Multi-Agent | 6/15 | GPT-5.5-fast implements / Sonnet-5 verifies; drift-guard authored directly |
| Coordination | 8/15 | Migration + concurrent mode-registry edits gate two targets |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | sk-code hub run regresses from the projection rewrite | H | L | Byte-identical baseline gate (P0 vs P3) |
| R-002 | Overfit Type-1 router inflates Mode-A | M | M | T2 blind holdout + circularity meter |
| R-003 | Force-committing over concurrent-dirty files | H | L | Path-scoped scratch-index + blast gate; defer entangled files |

---

## 11. USER STORIES

### US-001: Measure per-child intra-routing (Priority: P0)

**As a** skill maintainer, **I want** each child skill scored on whether it recalls its own `references/assets`, **so that** a routing regression in one child is caught without hiding behind the parent hub.

**Acceptance Criteria**:
1. Given a loaded child `SKILL.md`, When the benchmark runs in Mode-A, Then it reports a real `resourceRecall` against that child's own gold.

### US-002: Keep the parent honest (Priority: P0)

**As a** hub maintainer, **I want** the sk-code parent `RESOURCE_MAP` to be a provable union of its children, **so that** decentralizing routing cannot silently drift the working hub run.

**Acceptance Criteria**:
1. Given the child routers, When the drift guard runs, Then `parent == union(re-prefixed children) + parent-owned tier` or the test fails.

---

## 12. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- Trim Mode-B to the representative-per-family sample permanently, or run all 10 configs once the migration unblocks the deep-loop hub?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
