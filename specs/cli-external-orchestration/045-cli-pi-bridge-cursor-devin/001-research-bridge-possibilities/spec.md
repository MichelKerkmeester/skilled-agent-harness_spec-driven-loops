---
title: "Research Specification: Native Bridge Paths for Cursor & Devin Models in cli pi"
description: "Deep-research phase investigating whether cli pi can authenticate against Cursor and Devin subscriptions and expose their CLI-backed models in its own /model picker; two-model forced-depth run reached a not-feasible-now verdict."
trigger_phrases:
  - "research cli pi bridge cursor devin"
  - "pi models oauth cursor devin feasibility"
  - "native pi model bridge research"
  - "expose cursor devin models in pi research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities"
    last_updated_at: "2026-08-17T11:46:00Z"
    last_updated_by: "claude"
    recent_action: "Two-model research complete; consolidated research.md authored"
    next_safe_action: "Close packet; open an implementation phase only if a vendor feature request ships"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/grok-cursor/research.md"
      - "research/lineages/glm-devin/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-045-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Specification: Native Bridge Paths for Cursor & Devin Models in cli pi

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli pi` lists models in its own `/model` picker from pi's provider roster. Cursor and Devin models are reachable only through their own paid-subscription CLIs (`cursor-agent`, `devin`). It was unknown whether pi could reuse the operator's Cursor/Devin OAuth/subscription auth and surface those subscription-backed models as first-class entries in pi's `/model` picker, and whether any such path is permitted by the vendors' Terms of Service.

### Purpose
Resolve feasibility before any implementation. Investigate every viable mechanism (token reuse, provider adapters, local gateway) and the ToS/account-safety boundaries, and produce a ranked, evidence-backed verdict grounded in the live pi/cursor/devin CLI surfaces.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- pi `/model` provider/model registration extension points.
- Cursor and Devin auth mechanisms and any reusable model APIs behind their subscriptions.
- Candidate bridge architectures and their ToS/risk posture.

### Out of Scope
- Implementing the bridge (gated on this verdict; the verdict is not-feasible-now).
- Modifying the existing `cli-devin` / `cli-cursor` executor shell-out path.
- Anything that violates a vendor ToS or endangers the operator's paid accounts.

### Files to Change
Research-only; writes are confined to this packet's `research/` artifact tree.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Consolidated two-model synthesis |
| `research/lineages/{grok-cursor,glm-devin}/` | Create | Per-model iteration artifacts and syntheses |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Answer all five sub-questions with first-hand evidence | Each question resolved against live CLI surfaces / official ToS in `research.md` |
| REQ-002 | Produce a ranked, evidence-backed verdict | Ranked P1–P5 path matrix with a permissible recommendation or a documented not-feasible conclusion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cross-model validation | Two independent executor lineages run to forced depth and their verdicts compared |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A consolidated `research/research.md` states a ranked feasibility verdict — achieved: **not-feasible-now**, keep `cli-cursor`/`cli-devin` shell-out.
- **SC-002**: Findings grounded in the actual pi/cursor/devin CLI surfaces, not speculation.
- **SC-003**: Two models (Grok-4.6-xhigh, GLM-5.2-High) independently corroborate the verdict.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vendor ToS currency | Terms change over time | Verdict records ToS dates; re-verify before any future implementation |
| Risk | Acting on the ruled-out paths | Account ban / suspension | Recommendation explicitly forbids token reuse and private-endpoint providers |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether consumer Devin Pro can mint v3 `cog_` service-user keys (residual UNKNOWN).
- Whether Cursor staff would bless a CLI-spawn gateway that fronts the official client rather than private endpoints.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Consolidated research**: `research/research.md`
- **Per-model syntheses**: `research/lineages/grok-cursor/research.md`, `research/lineages/glm-devin/research.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Spec**: `../spec.md`
