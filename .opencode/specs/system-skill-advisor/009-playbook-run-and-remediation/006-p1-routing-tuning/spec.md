---
title: "Feature Specification: Skill Advisor P1 Routing & Abstention Tuning"
description: "Remediate the residual non-alias P1 regression failures across both scorers (TS + Python), grouped into 5 root-cause classes: missing terse-phrase routing, CLI-vs-skill, over-confident greenfield, deep-loop syntax, and review-target disambiguation."
trigger_phrases:
  - "p1 routing tuning"
  - "skill advisor p1 failures"
  - "scorer routing abstention tuning"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/006-p1-routing-tuning"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p1-tuning"
    recent_action: "All 5 classes implemented and verified; both scorers 0 regression failures"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Class A confidence via direct-evidence anchors plus ranking bonus"
      - "Class D colon-syntax routes to deep-review; bare auto review stays code-review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill Advisor P1 Routing & Abstention Tuning

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-27 |
| **Completed** | 2026-05-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-finding-remediation |
| **Successor** | None |
| **Handoff Criteria** | Each class lifts its P1 rows in both scorers (or documents an intentional abstention) with zero P0 regression and TS<->Python parity preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the 028 skill-advisor playbook packet — a focused scorer-tuning effort, separate from the 005 finding-remediation. It targets the P1 regression failures that remain after the P0 fixes (phase 005/002) and the alias-awareness fix (005/007). None are alias drift; each is a genuine routing or abstention decision.

**Scope Boundary**: Routing/abstention signals in both scorers (`fusion.ts` + `skill_advisor.py`) plus, where a fix is parity-only, the matching booster/signal in the lagging scorer. No change to P0 behavior or the alias layer.

**Dependencies**:
- The regression harnesses and TS<->Python parity tests are the regression guard.

**Deliverables**:
- Per-class routing/abstention fixes that lift the P1 rows without P0 regression.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the P0 routing fixes and alias-awareness work, the regression suite still has non-alias P1 failures: ~6 in the Python harness and ~11 in the TS harness (the extra TS failures are mostly TS abstaining where Python routes). They fall into 5 root-cause classes (see §3 table). Each is a genuine scorer behavior gap, not a harness or alias issue.

### Purpose
Lift the residual P1 rows in both scorers — by adding the missing routing signal, the abstention trigger, or the disambiguation rule per class — without regressing any P0 case and while preserving TS<->Python parity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Root-Cause Classes (per-case evidence)

| Class | Cases | Live behavior | Intended | Root cause |
|-------|-------|---------------|----------|------------|
| **A. Missing/under-confident terse-phrase routing** | MCP-002 ("fetch webflow cms collection"), PHRASE-004 ("integration scan"), PHRASE-007 ("structural search"), SEARCH-001 ("find code that handles auth"), PHRASE-002 ("5d scoring"), PHRASE-005 ("dynamic profile") | Correct skill scores < 0.8 or does not surface (Python abstains / TS abstains) | mcp-code-mode / deep-agent-improvement / system-code-graph | No domain signal lifts the correct skill past threshold; several are TS<->Python parity gaps (Python has phrase boosters TS lacks) |
| **B. CLI-vs-skill** | OPENCODE-001 ("update python script following opencode standards") — Python only | cli-opencode wins (sk-code uncertainty 0.39 fails) | sk-code | "opencode" keyword routes to the CLI executor over the code skill in a code-edit context |
| **C. Over-confident, should abstain** | FULLSTACK-001 ("build full stack typescript service"), ABSTAIN-002 ("optimize skill_advisor.py execution speed and recommendation quality") | sk-code routes confidently | abstain | Broad greenfield / multi-concern prompts route to a single skill instead of abstaining |
| **D. Deep-loop syntax** | REVIEW-004 (":review:auto security audit") | sk-code-review wins | sk-deep-review | ":review:auto" loop syntax is not recognized as a deep-review signal |
| **E. Review-target disambiguation** | AUDIT-001 ("audit skill advisor recommendations and speed"), PHRASE-001 ("code audit") | system-skill-advisor / deep-review edge out sk-code-review | sk-code-review | "audit" review intent loses a near-tie to the advisor-self or deep-review skills |

### In Scope
- The 5 classes above, fixed in both scorers (or the lagging scorer for parity-only cases).
- A regression fixture/guard per class where a new behavior is introduced.

### Out of Scope
- P0 routing behavior (frozen — shipped in phase 002).
- The alias layer (shipped in phase 007).
- Broad scorer-weight retuning beyond these targeted signals.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../lib/scorer/fusion.ts` | Modify | Class A/C/D/E routing + abstention signals (TS) |
| `.../lib/scorer/scoring-constants.ts` | Modify | Any new calibration constants |
| `.../scripts/skill_advisor.py` | Modify | Class A/B/C/D/E signals (Python); close parity gaps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No P0 regression | Both scorers stay 12/12 on P0 after every class change |
| REQ-002 | Parity preserved | TS<->Python parity tests stay green; no Python-correct corpus row regresses |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Class A routing | The terse-phrase rows route to their intended skill in both scorers (>= 0.8 confidence) |
| REQ-004 | Class B/D/E disambiguation | OPENCODE-001 -> sk-code; REVIEW-004 -> sk-deep-review; AUDIT-001/PHRASE-001 -> sk-code-review |
| REQ-005 | Class C abstention | FULLSTACK-001 and ABSTAIN-002 abstain in strict mode without over-abstaining on neighbouring routable prompts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ✅ Met — both regression harnesses reach **0 failures across all 50 cases** (P0 12/12 each), with zero P0 regression and green parity/corpus tests.
- **SC-002**: ✅ Met — each class is a principled bounded signal (direct-evidence anchors, code-edit context, colon-syntax discriminator, narrowly-gated breadth abstention), and two adversarial routable guards (`P2-BREADTH-GUARD-001/002`) were added so future changes cannot silently over-abstain.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-abstention (Class C) suppresses real routable prompts | High | Gate breadth detection narrowly; add adversarial routable fixtures |
| Risk | New terse-phrase signals (Class A) over-fire on unrelated prompts | Med | Scope signals to specific multi-word phrases / domain tokens |
| Risk | Overfitting to fixtures | Med | Prefer domain-meaningful signals; verify against the broader corpus, not just the fixture rows |
| Dependency | Regression + parity harnesses | Internal | The regression guard for every change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Class C: what is the principled signal for "too broad to route" (token count + multi-concern + no dominant intent), and how is over-abstention bounded?
- Class A: add signals in both scorers, or close the TS<->Python parity gap by porting Python's existing phrase boosters to TS first, then add the genuinely-missing ones to both?
- Is `:review:auto` (Class D) a stable, documented command syntax worth a dedicated rule, or an artifact of the fixture wording? **BLOCKER (found during implementation):** `skill_advisor.py` deliberately omits "auto review" from deep-review disambiguation because the corpus treats "auto review this PR" as sk-code-review (see the note above `DEEP_REVIEW_DISAMBIGUATION_PHRASES`). Routing `:review:auto` to deep-review must not regress that; resolve the colon-syntax-vs-natural-language distinction before implementing Class D.
<!-- /ANCHOR:questions -->
