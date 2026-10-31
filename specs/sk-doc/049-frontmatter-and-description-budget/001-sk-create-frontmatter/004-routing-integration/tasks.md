---
title: "Tasks: Phase 4: routing-integration"
description: "The 17-keyword collision check, the seven surfaces that carry the registration, the canary case and its two re-pins, and the seven checks that proved a frontmatter request now reaches the frontmatter mode."
trigger_phrases:
  - "routing integration tasks"
  - "keyword collision check"
  - "canary single route case"
  - "compiled routing publish tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: routing-integration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design 17 qualified keywords for the mode, deliberately excluding a bare `frontmatter` token because `AGENT_CREATION` already owns "agent frontmatter" and a bare token would tie with it
- [x] T002 Check all 17 candidates for substring collision against every existing keyword in both `.opencode/skills/sk-doc/ROUTER.md` and `.opencode/skills/sk-doc/hub-router.json`: zero collisions in either
- [x] T003 [P] Capture the pre-registration canary topology: destinations, projection rows and distinct identity tuples at 14, distinct packets at 13, and the harness's pinned sha256 per authored hub source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the fifteenth mode with `packetKind: workflow`, `command: null`, `advisorRouting.routingClass: "metadata"` and the 17 aliases (`.opencode/skills/sk-doc/mode-registry.json`)
- [x] T005 Add the `create-frontmatter-aliases` vocabulary class with the same 17 keywords, a `routerSignals` entry at weight 4 pointing at `sk-create-frontmatter/SKILL.md`, and a `routerPolicy.tieBreak` slot (`.opencode/skills/sk-doc/hub-router.json`)
- [x] T006 Wire the prose side of stage two: an intent-model bullet, a `FRONTMATTER` entry in `INTENT_SIGNALS`, a `FRONTMATTER` entry in `RESOURCE_MAP` naming the mode's three leaves, and the same leaves added to `FULL_INVENTORY`, which enumerates the whole hub (`.opencode/skills/sk-doc/ROUTER.md`)
- [x] T007 Add the mode-table row required by hub invariant 6b (`.opencode/skills/sk-doc/SKILL.md`)
- [x] T008 Regenerate the leaf index rather than hand-editing it: `generate-leaf-manifest.cjs --write` adds the mode's three leaves (`.opencode/skills/sk-doc/leaf-manifest.json`)
- [x] T009 Add the frontmatter vocabulary to the hub's stage-one advisor surfaces, and correct four "thirteen packets" claims to fourteen across `SKILL.md`, the generated description and the causal summary (`.opencode/skills/sk-doc/graph-metadata.json`, `.opencode/skills/sk-doc/description.json`)
- [x] T010 Add the `single-create-frontmatter` canary case with the prompt `yaml frontmatter block`, and re-pin the two authored hub sources the harness pins by sha256: first `packets/sk-create-feature-catalog/SKILL.md` and `packets/sk-create-manual-testing-playbook/SKILL.md`, which phase 003 had edited, then the hub `SKILL.md` after the packet-count correction. Each re-pin was preceded by a run that proved the pin still fires
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Prove stage one: `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "I need to add a yaml frontmatter block and work out the description budget" --threshold 0.5` returns `sk-doc` at confidence 0.95 with `"reason": "Matched: !description budget(signal), !frontmatter block(signal), !yaml frontmatter(signal), create, frontmatter"`. The three signal names are exactly the ones added to the hub's graph metadata, so the match is the new vocabulary and not a coincidence (REQ-001, SC-001)
- [x] T012 Prove stage two: the canary case `single-create-frontmatter` resolves to `"selectionKind":"single","targets":["sk-create-frontmatter"]` with `realEvaluateRouteGoldPass: true` (REQ-001, SC-001)
- [x] T013 Run the connectivity gate: `d5-connectivity.cjs --skill .opencode/skills/sk-doc/sk-create-frontmatter` reports `score: 100`, `gateFailed: false`, `routerParseable: true`, `hubStageTwoRouted: 3`, and empty `deadResourcePaths`, `deadIntentKeys`, `orphanReferences`, `pathEscapes` and `findings`. The same script on the hub reports zero of each (REQ-002)
- [x] T014 Confirm coverage: the canary's coverage guard reports `modesWithSingleRouteCase: 15`, derived from the live registry rather than from a written list (REQ-003, SC-002)
- [x] T015 Confirm no sibling regression: all 22 canary rows are green and the 14 pre-existing single-route cases still resolve to their own modes. A separate intent-scorer replay confirms the separation directly, with "create an agent with agent frontmatter and a permission object" scoring `AGENT_CREATION: 12` and FRONTMATTER zero, "write release notes since the last version" scoring `CHANGELOG: 8` and FRONTMATTER zero, and "yaml frontmatter block" scoring `FRONTMATTER: 8` alone (REQ-004, SC-003)
- [x] T016 Confirm the hub gate is restored: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` reports `OK: parent-skill-check — all hard invariants passed, 0 warnings` at exit 0, closing the deviation phase 002 recorded as ADR-001
- [x] T017 Publish the compiled routing through its documented sequence: `compiled-route-manifest.cjs refresh --hub sk-doc`, then `compiled-route-sync.cjs`, then the status, verify and canary gates, then `--finalize`. A first attempt left a publication lock held by an exited process, which blocked the next sync with `EEXIST`; `--revert` on the retained rollback cleared it and a clean sync from the current sources succeeded. Final state: all five hubs `compiled-serving`, `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`, all five canaries exit 0, no lock and no rollback directory left behind
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T017 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — acceptance-criteria.md AC-001 through AC-007 are all `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Superseded criteria this phase closes**: See `../002-mode-scaffold/decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-004 in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md — the two-stage model, the seven wired surfaces and the qualified-vocabulary rule are in plan.md §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — the phase 002 packet, the phase 003 content behind its three leaves, the canary corpus and the compiled-routing publish sequence were all in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no code was written. The four JSON files parse and every gate that reads them ran clean, which is the equivalent structural check
- [x] CHK-011 [P0] No console errors or warnings — the final `parent-skill-check.cjs` run reports 0 warnings, and `d5-connectivity.cjs` reports an empty `findings` array
- [x] CHK-012 [P1] Error handling implemented — Not applicable: this phase adds configuration entries, not control flow
- [x] CHK-013 [P1] Code follows project patterns — the registry entry, vocabulary class and router entries follow the shape the fourteen existing modes already use, and the leaf manifest was regenerated rather than hand-edited
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-007 in acceptance-criteria.md are all `Met`
- [x] CHK-021 [P0] Manual testing complete — both routing stages were replayed by hand with real prompts, not inferred from the presence of a registry entry
- [x] CHK-022 [P1] Edge cases tested — the collision edge was the one that mattered: a bare `frontmatter` token would tie with `AGENT_CREATION`'s "agent frontmatter", so all 17 candidates were checked for substring collision before any was written
- [x] CHK-023 [P1] Error scenarios validated — two real failures were produced and handled: two canary red runs from stale source pins, each fixed by a re-pin only after a run proved the pin still fires, and an `EEXIST` on sync from a publication lock held by an exited process, cleared with `--revert` on the retained rollback
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — `matrix/evidence`: the risk is a vocabulary collision, and the only honest answer is the full candidate-against-existing matrix plus a replay on real prompts
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Every vocabulary class in `hub-router.json` and every `INTENT_SIGNALS` entry in `ROUTER.md` is a same-class producer, and all 17 candidates were checked against every one of them
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — plan.md's Affected Surfaces table lists all nine consuming surfaces, from the advisor down to the compiled routing manifest
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable in the security sense. The nearest equivalent, path escape, is covered: `d5-connectivity.cjs` reports an empty `pathEscapes` array, and the publish check reports `0 reads under .opencode/specs`
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Two axes: 17 candidate keywords crossed with every existing keyword in two files. Result recorded before writing any of them: zero collisions in either
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — The relevant global state is the compiled-routing publication lock, and the hostile variant occurred for real: a lock left by an exited process. It was cleared through the documented `--revert` path rather than by deleting the lock file
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is pinned to named commands with quoted output, and the canary harness itself pins a sha256 per authored hub source, which is what surfaced both stale-pin runs
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: every added value is a keyword, a weight, a routing class or a relative path
- [x] CHK-031 [P0] Input validation implemented — Not applicable: no input-handling code was added. The routing scorers that consume these entries were not modified
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: routing has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001 through REQ-004 and SC-001/002/003
- [x] CHK-041 [P1] Code comments adequate — Not applicable: no code was written. The one comment worth noting belongs to the harness, whose own code comment states that registering a mode refreshes its live-topology counts in the same change
- [x] CHK-042 [P2] README updated (if applicable) — `ROUTER.md` and the hub `SKILL.md` are the hub's navigational documents and both were updated, including the four packet-count claims that were stale by one
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — confirmed: `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` is empty aside from `.gitkeep`, and the publish sequence left no lock and no rollback directory behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — no `decision-record.md` exists for this phase and none is required at this level; the one architecture decision, that every keyword is qualified and no bare `frontmatter` token enters the vocabulary, is ADR-001 in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 records both rejected options, adding the bare token and accepting the tie, and narrowing the sibling's vocabulary to free it
- [x] CHK-103 [P2] Migration path documented (if applicable) — the compiled-routing publish sequence in T017 is the migration path from `stale-manifest` to `compiled-serving`, and plan.md §7 is its reversal
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: no latency target governs routing configuration, and no scorer code was changed
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no throughput surface exists
- [x] CHK-112 [P2] Load testing completed — Not applicable: there is no runtime service to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: this phase makes no performance claim. The nearest measured number is the routing score, which is a correctness measure
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7, and its compiled-routing leg was exercised for real: `--revert` on the retained rollback cleared the stale publication lock
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable: a mode is registered or it is not, and the coverage guard reads the live registry rather than a toggle
- [x] CHK-122 [P1] Monitoring/alerting configured — the canary harness, the coverage guard and `d5-connectivity.cjs` are the standing monitoring; all three now count this mode, which means a future regression fails a gate instead of going unnoticed
- [x] CHK-123 [P1] Runbook created — T017 records the publish sequence in order, including the lock incident and how it was cleared
- [x] CHK-124 [P2] Deployment runbook reviewed — confirmed by the final state: all five hubs `compiled-serving`, all five canaries exit 0, no lock and no rollback directory left behind
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030 and CHK-031, plus the empty `pathEscapes` array and `0 reads under .opencode/specs` from the publish check
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new external dependency is introduced; every tool used is an existing internal script
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface is involved
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: the added entries are keywords, weights and relative paths, with no personal or customer data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md trace to the same requirement and success-criterion ids, and this phase's closure is cited from `../002-mode-scaffold/acceptance-criteria.md`
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: no API surface is added. The routing entries are configuration, not an interface
- [x] CHK-142 [P2] User-facing documentation updated — `ROUTER.md` gained an intent-model bullet and full-inventory entries, and the hub `SKILL.md` gained a mode-table row, so the mode is now visible to a reader as well as to the router
- [x] CHK-143 [P2] Knowledge transfer documented — the qualified-vocabulary rule, the two legitimate canary re-pins, and the publication-lock recovery are all recorded in implementation-summary.md, because each would otherwise be rediscovered the hard way
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable. No formal named-approver sign-off process governs this internal spec-folder phase.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->
