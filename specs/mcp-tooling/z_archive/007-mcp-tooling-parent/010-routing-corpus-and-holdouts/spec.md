---
title: "Feature Specification: Phase 10: routing-corpus-and-holdouts"
description: "The mcp-tooling hub grew to six modes but its blind-holdout suite covered only two of them and the advisor's labeled routing corpus carried no natural-language phrasings for the three new transports or aside. This phase closes both gaps: 4 new blind holdouts (6/6 mode coverage), an explicit chrome-vs-aside boundary contract in MT-H01, 7 new labeled corpus rows, and a re-captured scorer baseline with the ratchet gate green."
trigger_phrases:
  - "routing corpus and holdouts"
  - "six mode holdout coverage"
  - "chrome vs aside boundary"
  - "hub routing blind holdouts"
  - "scorer baseline recapture"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase recorded complete; all gates green"
    next_safe_action: "None; phase complete. Hub program tail is 007 Lane-C benchmark (still deferred)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_task_tracking.md"
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-010-routing-corpus-and-holdouts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: routing-corpus-and-holdouts

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-incumbent-inventory-parity |
| **Successor** | None |
| **Handoff Criteria** | Blind holdouts cover 6/6 hub modes; labeled corpus rows for all new modes land with all lines valid JSON; scorer baseline re-captured and the fixture-hash ratchet gate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the mcp-tooling hub completion: routing corpus expansion and blind-holdout coverage for the six-mode hub.

**Scope Boundary**: Only the hub's `manual_testing_playbook/hub_routing/` holdout files, the advisor's `routing-accuracy/labeled-prompts.jsonl` corpus, and its `scorer-eval-baseline.json` fixture (re-captured via the owning script). No packet SKILL.md, no `mode-registry.json`, no scorer code, no advisor runtime change.

**Dependencies**:
- The six-mode hub state (three incumbent modes plus `mcp-aside-devtools`, `mcp-refero`, `mcp-mobbin`) that phases 004, 005, and later hub work delivered.
- The scorer-eval baseline capture script and ratchet test owned by `system-skill-advisor`.

**Deliverables**:
- 4 new blind holdouts (MT-H03 task tracking to mcp-click-up, MT-H04 agentic browser to mcp-aside-devtools, MT-H05 web design reference to mcp-refero, MT-H06 mobile pattern research to mcp-mobbin), bringing holdout coverage to 6/6 modes.
- MT-H01 (`holdout_browser_inspect.md`) bumped to v1.1.0.0 with a "Boundary (six-mode hub)" section pinning the chrome-vs-aside contract.
- 7 labeled corpus rows (`rr-hub6-201` to `rr-hub6-207`) covering clickup, figma, aside (x2), refero, and mobbin (x2) phrasings, corpus grown 193 to 200 rows.
- Scorer baseline re-captured (`capture-scorer-eval-baseline.mjs --write`) and the ratchet gate green (7/7), which also healed a pre-existing fixture-hash drift.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub grew from three modes to six, but the blind-holdout suite in `hub_routing/` covered only mcp-chrome-devtools (MT-H01) and mcp-figma (MT-H02), so routing regressions in the four other modes had no blind detection. The advisor's labeled corpus had no natural-language rows for the aside, refero, or mobbin surfaces at all. Separately, the scorer-eval baseline fixture had drifted: the July 10 hub-merge relabel of corpus rows landed without a baseline re-capture, so the fixture-hash ratchet test was failing before this phase started.

### Purpose
Every hub mode has a blind holdout, the chrome-vs-aside boundary is an explicit written contract, the labeled corpus exercises all six modes, and the scorer baseline fixture matches the corpus again with the ratchet gate green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New blind holdouts for the four uncovered modes, mirroring the existing MT-H01/MT-H02 frontmatter and structure (`blindToRouterKeywords: true`, expected_intent, expected_resources).
- A boundary section in MT-H01 defining when chrome wins and when aside wins, and naming aside-or-defer on the MT-H01 prompt as a regression.
- 7 new `skill_routing_prompts` rows in `labeled-prompts.jsonl`, all with `skill_top_1: "mcp-tooling"`.
- One baseline re-capture via the owning script and one ratchet-gate run.
- This spec child (Level 2 docs, checklist, implementation summary).

### Out of Scope
- Scorer or advisor code changes - the corpus and fixtures are data-only surfaces.
- Running the deferred phase 007 Lane-C benchmark - holdout files enable it, they do not run it.
- Hub packet content (SKILL.md, mode-registry.json) - routing evidence only, no routing behavior change.
- Fixing the July 10 relabel itself - it was already correct content; only its missing baseline re-capture is healed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_task_tracking.md` | Create | MT-H03 blind holdout, expected_intent mcp-click-up |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md` | Create | MT-H04 blind holdout, expected_intent mcp-aside-devtools |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_web_design_reference.md` | Create | MT-H05 blind holdout, expected_intent mcp-refero |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_mobile_pattern_research.md` | Create | MT-H06 blind holdout, expected_intent mcp-mobbin |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md` | Modify | v1.0.0.0 to v1.1.0.0; add "Boundary (six-mode hub)" section |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` | Modify | Append rows rr-hub6-201 to rr-hub6-207 (193 to 200 rows) |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Re-captured baseline (script-owned, `--write`) |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts/**` | Create/Modify | This packet's Level 2 docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Blind holdout coverage reaches 6/6 hub modes | `hub_routing/` contains one `stage: holdout` file per mode: MT-H01 chrome, MT-H02 figma, MT-H03 click-up, MT-H04 aside, MT-H05 refero, MT-H06 mobbin; each new file carries `blindToRouterKeywords: true` and a prompt free of the target mode's router aliases |
| REQ-002 | MT-H01 pins the chrome-vs-aside boundary | `holdout_browser_inspect.md` at v1.1.0.0 has a "Boundary (six-mode hub)" section stating developer-driven inspection stays chrome, autonomous/sign-in-and-do vocabulary is aside, and aside-or-defer on this prompt is a regression |
| REQ-003 | Labeled corpus covers all six modes with valid rows | `labeled-prompts.jsonl` gains ids `rr-hub6-201` to `rr-hub6-207` in bucket `skill_routing_prompts` with `skill_top_1: "mcp-tooling"`; file is 200 lines, every line valid JSON |
| REQ-004 | Scorer baseline re-captured and ratchet green | `capture-scorer-eval-baseline.mjs --write` run against the 200-row corpus; `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` passes 7/7 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Pre-existing baseline drift is healed and documented as pre-existing | The re-captured fixture's `corpusSha256` matches the current corpus; the record states explicitly that the ratchet was already failing before this phase (July 10 relabel landed without re-capture), distinct from this phase's row additions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 6-of-6 hub modes have a blind holdout in `hub_routing/` (frontmatter `expected_intent` enumerates all six mode ids).
- **SC-002**: `labeled-prompts.jsonl` parses 200-of-200 lines as JSON and contains the 7 new `rr-hub6-2xx` ids.
- **SC-003**: The ratchet gate reports 7 passed tests against the re-captured `scorer-eval-baseline.json`.
- **SC-004**: This spec child passes `validate.sh --strict --no-recursive` with 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `capture-scorer-eval-baseline.mjs` + ratchet test (system-skill-advisor owned) | Baseline unverifiable without them | Use the owning script with `--write`; never hand-edit the fixture |
| Risk | New corpus rows shift headline scorer metrics | Med | Baseline re-capture records the honest post-addition numbers (full corpus top-1 0.765); the ratchet pins fixture-hash consistency, not a fixed accuracy floor |
| Risk | Holdout prompts leak router keywords and stop being blind | Med | Each prompt avoids the target mode's aliases; `blindToRouterKeywords: true` declared; expected-behavior text names which adjacent mode must NOT win |
| Risk | Baseline heal conflated with this phase's additions | Low | REQ-005 requires the pre-existing drift to be called out as distinct from the row additions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime behavior change in the advisor or the hub (data and fixture surfaces only).

### Security
- **NFR-S01**: No credentials or tokens in any holdout prompt or corpus row.

### Reliability
- **NFR-R01**: `labeled-prompts.jsonl` stays machine-parseable end to end (a single invalid line breaks every downstream consumer of the corpus).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Refero vs mobbin adjacency: both are design-research transports; MT-H05 anchors on web products and styles, MT-H06 on phone apps and first-run flows. A defer between the two is documented as a tolerable secondary outcome; mcp-figma or a workflow mode winning is a failure.
- Chrome vs aside adjacency: MT-H01 (developer-driven inspection stays chrome) and MT-H04 (autonomous sign-in-and-do goes aside) are written as inverses of each other.

### Error Scenarios
- Corpus corruption: verified programmatically, 200-of-200 lines parse as JSON after the append.
- Fixture drift: the ratchet test compares `corpusSha256`/`holdoutSha256`/`ambiguitySha256` against the live files, so any un-captured corpus edit fails the gate immediately.

### State Transitions
- MT-H01's version bump (1.0.0.0 to 1.1.0.0) marks the boundary-contract addition so a stale copy is detectable at a glance.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 7 files across 2 skills + spec child; data/doc surfaces only |
| Risk | 8/25 | Fixture re-capture touches a shared ratchet gate; no runtime code |
| Research | 8/20 | Read of existing holdouts, corpus schema, capture script, and ratchet test |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The one measurement question this phase surfaced (headline full-corpus top-1 sits at 0.765 after re-capture) is recorded honestly in implementation-summary.md; raising it is phase 007 Lane-C benchmark territory, still deferred.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
