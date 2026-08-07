---
title: "Deep-Research Remediation"
description: "Verify-first remediation of every deep-research and adherence finding across nine lanes: a Fable 5 agent (claude2) re-verifies each issue against current code during phase creation, gpt-5.5-fast high implements the confirmed ones, and a fresh Fable pass re-checks before each lane commits."
trigger_phrases:
  - "deep research remediation"
  - "027 remediation lanes"
  - "tri-system finding fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation"
    last_updated_at: "2026-06-12T12:10:00Z"
    last_updated_by: "claude-fable-orchestrator"
    recent_action: "L1 (6/6) + L8 lanes shipped, Fable-verified, deployed live"
    next_safe_action: "Continue Goal B at L2 code-graph apply safety"
    blockers: []
    key_files:
      - "backlog/remediation-backlog.json"
      - "L1-security-safety/disposition.md"
      - "L8-command-adherence/disposition.md"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "027-remediation-resume-2026-06-12"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Deep-Research Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-06-12 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The tri-system deep-research program (`../028-tri-system-deep-research`) and the command-adherence research (`../011-command-presentation-workflow-separation/006-presentation-adherence-research`) produced 239 findings. The 48 confirmed and 8 canonical adherence recommendations are actionable now; the 53 downgraded and 92 unadjudicated P2/P3 findings still need direct verification before they become work. Nothing is fixed unverified.

### Purpose
Remediate every real finding across all severities — critical, high, medium, low, and decorative — through a verify-first pipeline. The 2 refuted findings are excluded by definition.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### Lanes (phase children)

| Lane | Theme | Backlog count |
|------|-------|---------------|
| L1 | Security & safety (the P0s + cold-spawn enforcement) | 6 |
| L2 | Code-graph apply safety | 29 |
| L3 | Idempotency flag-ON blockers | 5 |
| L4 | Launcher lifecycle parity | 15 |
| L5 | Advisor correctness | 36 |
| L6 | Save & continuity truth | 17 |
| L7 | Shadow & feedback honesty | 19 |
| L8 | Command-dashboard adherence (8 canonical recs) | 8 |
| L9 | P2/P3 sweep (remaining) | 68 |

### Pipeline (per finding)
1. **Fable 5 verification (claude2):** re-read the cited code; classify STILL-REAL / ALREADY-FIXED / NOT-REAL / DUPLICATE with file:line. Native-Fable fallback on a claude2 session limit.
2. **Implement (gpt-5.5-fast high):** minimal fix + regression test for STILL-REAL items only; Gate-3 baked; comment-hygiene clean.
3. **Re-verify (Fable):** confirm the fix against the original proof.
4. Scoped lane commit; backlog disposition updated.

### Out of Scope
- The 2 refuted findings.
- Merging or pushing to main.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every backlog finding receives a Fable verification verdict | `verify/` holds a verdict per finding |
| REQ-002 | Every STILL-REAL finding is implemented and re-verified | backlog disposition is terminal for all items |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each lane validates strict and commits scoped | per-lane validate.sh --strict pass + scoped commit |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 203 backlog items terminally dispositioned (fixed / already-fixed / not-real / duplicate).
- **SC-002**: Command-dashboard adherence re-verified by re-running the bare-command probes.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | claude2 session limit mid-wave | Fable verification stalls | Native-Fable fallback in the driver |
| Risk | Analyst findings over-claim | Wasted implementation | Fable verify-first gate; refuted/not-real items dropped before implementation |
| Dependency | Warm spec-memory daemon, single instance | Seats misread live state | Single-daemon discipline after the recovery |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
