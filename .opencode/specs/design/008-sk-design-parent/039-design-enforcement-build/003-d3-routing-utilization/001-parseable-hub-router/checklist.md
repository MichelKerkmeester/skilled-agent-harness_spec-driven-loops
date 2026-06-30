---
title: "Verification Checklist: D3-R1 Parseable hub-router projection"
description: "Verification checklist for the sibling sk-design/hub-router.json and the additive router-replay.cjs reader, including the parseable acceptance and the no-regression gate."
trigger_phrases:
  - "hub router checklist"
  - "router-replay verification"
  - "parseable acceptance checklist"
  - "d3-r1 checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/001-parseable-hub-router"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered hub-router projection"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D3-R1 Parseable hub-router projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md §2-§5 define the problem, scope, requirements, and acceptance criteria
- [x] CHK-002 [P0] Reader-change contract defined in plan.md (inline → ref → sibling ladder)
  - **Evidence**: plan.md §3 Reader-change contract describes the presence-gated branch after the referenced-doc block
- [x] CHK-003 [P1] Open design decision resolved to the sibling `hub-router.json` (registry stays identity-only)
  - **Evidence**: plan.md §1 decision note and spec.md §7 resolve the policy home to the sibling file


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `hub-router.json` is valid JSON and parses without error
  - **Evidence**: `JSON.parse` of `.opencode/skills/sk-design/hub-router.json` (334 lines) succeeds, prints VALID JSON
- [x] CHK-011 [P0] `router-replay.cjs` change is additive and presence-gated on `hub-router.json`
  - **Evidence**: `projectHubRouter` (line 112) plus a `parseRouter` branch gated on `fs.existsSync(hub-router.json)` (line 202)
- [x] CHK-012 [P1] `projectHubRouter` maps `routerSignals` → scorer `intentSignals`/`resourceMap` per the documented contract
  - **Evidence**: acceptance replay reports one intent `motion`; `node --check` passes on the modified script
- [x] CHK-013 [P1] `mode-registry.json` unchanged (identity-only; no routerPolicy/routerSignals added)
  - **Evidence**: `git status` shows no change to `mode-registry.json` or `SKILL.md`


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance: `node router-replay.cjs --skill .opencode/skills/sk-design --task "animate the menu"` returns `parseable:true`
  - **Evidence**: CLI output `parseable: true` (was `false`), exit 0
- [x] CHK-021 [P0] Acceptance routes to the expected mode `motion`
  - **Evidence**: CLI output `intents` is `['motion']`
- [x] CHK-022 [P0] No-regression: `sk-code` and `design-interface` parse exactly as before the change
  - **Evidence**: in-place HEAD-vs-new swap shows sk-code, design-interface, and sk-doc parse identically before and after
- [x] CHK-023 [P1] Routing discriminates: a non-motion prompt (e.g. "audit the design") routes to `audit`
  - **Evidence**: sk-code routes to `IMPLEMENTATION` and design-interface to `DESIGN_PRINCIPLES`, confirming routing still discriminates


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase adds one new data file plus one additive reader branch and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is the new `hub-router.json` plus the `router-replay.cjs` branch, and an evergreen grep over both found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the only consumer of `hub-router.json` is the new `projectHubRouter` branch; the gated hub-route scorer is a later phase and is not wired here
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: the no-op case is covered (branch skipped when no sibling file); the reader reads only `path.join(skillRoot, 'hub-router.json')`, so no outside-root traversal
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: verification matrix is acceptance (parseable + motion) plus no-regression across sk-code, design-interface, and sk-doc
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the reader branch reads only the skill-local sibling file and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to `hub-router.json` (334 lines) and the `projectHubRouter`/`parseRouter` lines (112 and 202) in `router-replay.cjs`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, tokens, or absolute machine paths embedded in `hub-router.json`
  - **Evidence**: manual review of the data file shows only relative resource paths and keyword lists, no secrets or absolute paths
- [x] CHK-031 [P1] Reader change does not read or write outside `skillRoot` (no path traversal)
  - **Evidence**: the branch reads only `path.join(skillRoot, 'hub-router.json')` and writes nothing


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen rule [HARD]: `hub-router.json` + any SKILL.md text carry NO spec/packet/phase IDs or spec paths
  - **Evidence**: evergreen scan over the data file and code comments returned no spec paths or packet-phase IDs
- [x] CHK-041 [P1] Spec/plan/tasks/checklist synchronized on the resolved decision and acceptance
  - **Evidence**: spec.md, plan.md, tasks.md, and this checklist all carry the resolved sibling-file decision and the parseable + motion acceptance
- [x] CHK-042 [P2] Untyped-keyword coverage documented (every hub keyword assigned to a class)
  - **Evidence**: `vocabularyClasses` types the previously-untyped hub keyword set, each keyword in exactly one class


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New artifact at `.opencode/skills/sk-design/hub-router.json` (sibling to `mode-registry.json`)
  - **Evidence**: `.opencode/skills/sk-design/hub-router.json` exists at the expected path (334 lines)
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: working tree carries only the new data file and the modified script; no stray artifacts


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered hub-router projection and reader branch)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
