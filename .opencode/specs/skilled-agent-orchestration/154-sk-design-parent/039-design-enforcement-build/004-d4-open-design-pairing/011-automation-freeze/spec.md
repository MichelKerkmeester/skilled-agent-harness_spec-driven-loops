---
title: "D4-R11 — Freeze the design-affecting Open Design automation surface at the agent/proxy boundary"
description: "Append an Automation Freeze contract to guarded_proxy.md: a design-affecting automation is DENIED by default because the proof token is single-use + ~300s TTL; two escape paths (per-execution fresh-mint, named pre-authorized replay) and a read-only exemption; the daemon-internal scheduler is a named residual."
trigger_phrases:
  - "d4-r11 automation freeze"
  - "headless automation gate design build"
  - "open design automation deny by default"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/011-automation-freeze"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record the automation-freeze contract and named residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R11 — Freeze the design-affecting Open Design automation surface at the agent/proxy boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable (agent/proxy boundary); prose policy contract |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A headless automation fires with no interactive operator present. The Open Design guarded proxy denies a design-affecting call unless it carries a valid `DESIGN_PROOF_TOKEN`, and that token is single-use with a short `expiresAt` window of approximately 300 seconds. An unattended automation — `od automation create` or `od automation run` that triggers a design-mutating operation, or a scheduled `start_run` — cannot mint or carry a live single-use token at fire time. Without an explicit freeze contract, the automation surface is an unhandled gap: the boundary documents per-call enforcement but says nothing about how a scheduled, operator-absent fire is supposed to satisfy a single-use token.

### Purpose
Append an `## Automation Freeze` contract to the existing guarded-proxy boundary so the automation subset is deny-by-default and the two legitimate escape paths are explicit. A design-affecting automation is FROZEN — denied by default — and may only proceed by (A) per-execution fresh-mint, where the automation pauses for a live operator to mint a fresh single-use token bound to that fire's outgoing payload, or (B) a named, auditable pre-authorization, where a create-time frozen binding (subject digest, payload digests, `maxRuns`, `reviewWindow`) is accepted at fire time only as an exact replay inside the review window and remaining run budget. Read-only inventory automation stays exempt. The contract reuses the token single-use/TTL rules by citation rather than restating them, and names the daemon-internal scheduler it cannot reach instead of implying it away.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append an `## Automation Freeze` section to the existing `.opencode/skills/mcp-open-design/references/guarded_proxy.md`
- State the freeze rule: a design-affecting automation (`od automation create`/`od automation run` triggering a design-mutating op, or a scheduled `start_run`) is DENIED by default
- Document escape path A — per-execution fresh-mint (a live operator mints a fresh single-use token bound to the fire's outgoing payload)
- Document escape path B — named, auditable pre-authorization (create-time frozen binding of subject/payload digests + `maxRuns`/`reviewWindow`; fire-time replay only)
- Document the read-only-automation exemption (`od automation list`/`view`/`show` with `openDesignPurpose: "openDesignExemption"`, no token)
- Name the residual: the bundled Open Design daemon's own internal scheduler can fire without traversing the agent-side adapter
- Reuse the token single-use/TTL basis by citation to `DESIGN_PROOF_TOKEN` Section 2 — no second field schema
- Add the section-level Acceptance table (deny / fresh-mint allow / replay allow / exempt allow / residual unenforceable)

### Out of Scope
- Any edit to the bundled Open Design daemon or its internal scheduler — that scheduler is named as the residual, not patched
- Redefining the `DESIGN_PROOF_TOKEN` internals — the freeze rationale references the token contract by citation
- Shipping a running two-phase validator or `automationBinding` data structure — the deliverable is a prose policy contract at the agent/proxy boundary, not executable enforcement code
- Any edit to a second file; the change is a pure append to one existing reference

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Modify (append) | Append a new `## Automation Freeze` section: the freeze rule, the two escape paths, the read-only exemption, the named daemon-scheduler residual, the `DESIGN_PROOF_TOKEN` Section 2 citation, and a section Acceptance table — 25 insertions, 0 deletions (pure append) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze rule denies a design-affecting automation by default | The section states a design-affecting automation (`od automation create`/`run` triggering a design-mutating op, or a scheduled `start_run`) is FROZEN — DENIED by default, grounded in the single-use/~300s token constraint |
| REQ-002 | Escape path A documented | Per-execution fresh-mint: the automation pauses for a live operator to mint a fresh single-use token bound to that fire's actual outgoing payload |
| REQ-003 | Escape path B documented | Named, auditable pre-authorization: a create-time frozen binding (subject digest, payload digests, `maxRuns`, `reviewWindow`) accepted at fire time only as an exact replay inside the review window and run budget; drift/expiry/exhaustion → DENY |
| REQ-004 | Read-only-automation exemption documented | `od automation list`/`view`/`show` carrying `openDesignPurpose: "openDesignExemption"` require no design token |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Token single-use/TTL reused by citation | The freeze rationale cites `DESIGN_PROOF_TOKEN` Section 2 (`singleUse: true`, ~300s `expiresAt`); no token field schema is re-specified in this section |
| REQ-006 | Daemon-internal scheduler named as the residual | The section names the bundled daemon's own internal scheduler as able to fire without traversing the agent-side adapter, and states agent-side policy cannot freeze it |
| REQ-007 | Append-only, scope held | The change is a pure append to `guarded_proxy.md` (0 deletions); the prior content — deny-by-default inversion, `openDesignPurpose`, the od-CLI cross-reference — is preserved |
| REQ-008 | Evergreen authoring | No spec, packet, or phase IDs and no `specs/` paths embedded in the appended section |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A design-affecting automation that fires with no live per-execution token and no valid pre-authorized replay binding resolves to DENY; a fresh-mint at execution and a faithful replay inside the budget/window both resolve to ALLOW.
- **SC-002**: Read-only inventory automation (`od automation list`/`view`/`show`) with `openDesignPurpose: "openDesignExemption"` is ALLOWED without a token; mutating create/run stays guarded.
- **SC-003**: The freeze rule, both escape paths, the read-only exemption, the named daemon-scheduler residual, and the `DESIGN_PROOF_TOKEN` Section 2 citation are all present; the change is append-only with prior content preserved; the appended section carries no spec/packet/phase IDs or `specs/` paths.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Daemon-internal scheduler bypass | The bundled daemon's own scheduler can fire a scheduled automation without traversing the agent-side adapter, so agent-side policy cannot freeze it | Named plainly as the residual in the section; the honest boundary is agent-side enforcement across wired adapters. No taste claim |
| Risk | Prose policy contract, not running code | The freeze is an evergreen reference section, not an executed two-phase validator; a runtime that ignores the contract is not mechanically stopped by it | This refines the guarded-proxy precondition the downstream enforcement spine consumes; it ships no `automationBinding` runtime and claims none |
| Risk | Read-only exemption over-blocks or under-blocks | Tightening or loosening the automation axis could newly block legitimate inventory reads or leak a mutating fire | The exemption is scoped to `od automation list`/`view`/`show` under a positive `openDesignExemption`; mutating create/run stays guarded |
| Risk | Escape path B replay drift | A pre-authorized binding replayed outside its window or budget could re-authorize stale design work | Fire-time accepts only an exact replay inside the review window and remaining run budget; any digest drift, missing binding, expiry, or exhausted budget is DENY |
| Dependency | `DESIGN_PROOF_TOKEN` single-use/TTL contract (Section 2) | Green | Cited as the freeze basis (`singleUse: true`, ~300s `expiresAt`); not redefined here |
| Dependency | Guarded proxy boundary, classification, and policy | Green | The host contract the freeze section extends; the `od automation` guarded/exempt split already lives there |
| Dependency | Open Design tool-surface automation verbs (guarded create/run vs exempt list/view/show) | Green | The classification basis for the automation subset |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The automation surface fails closed — a design-affecting automation with no live fresh-mint and no valid pre-authorized replay is DENIED, never silently allowed. Operator-absent fires cannot launder design work past the single-use token requirement.
- **NFR-S02**: Escape path B is bounded and auditable — a pre-authorization is a named, create-time frozen binding accepted only as an exact replay inside its review window and run budget, so a stale or drifted binding cannot re-authorize new design work.

### Defense-in-Depth
- **NFR-DD01**: The freeze is a contract-level refinement of the existing deny-by-default precondition, scoped to the headless-automation subset. It cites rather than re-specifies the token contract, so the single-use/TTL defense has exactly one source of truth, and it names the daemon-scheduler residual rather than claiming a closure the agent side cannot enforce.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Fire-time Authorization
- **No token, no binding**: A design-affecting automation fires with neither a live per-execution token nor a valid pre-authorized replay → DENY.
- **Fresh-mint at execution**: The automation pauses, a live operator mints a fresh single-use token bound to that fire's outgoing payload → ALLOW if the normal token validator passes.
- **Faithful replay in budget**: The fire exactly replays a named pre-authorized binding inside the review window and remaining run budget → ALLOW.
- **Replay drift**: A replay whose subject/payload digest drifts, whose binding is missing, whose window has expired, or whose run budget is exhausted → DENY.

### Read-only Automation
- **Inventory read with exemption**: `od automation list`/`view`/`show` carrying `openDesignPurpose: "openDesignExemption"` → ALLOW without a token.
- **Inventory read reused for design**: an exemption whose returned inventory is reused to decide design work forfeits the exemption under the host Exemption Model → guarded.

### Residual
- **Daemon-internal scheduler fire**: the bundled daemon's own scheduler fires a scheduled automation without traversing the agent-side adapter → not enforceable by this proxy; named as the residual.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One edited doc — a single appended `## Automation Freeze` section in the guarded-proxy contract (freeze rule, two escape paths, read-only exemption, named residual, token citation, Acceptance table). No source code, daemon, hook, or policy-file change.
- **Risk concentration**: The single material gap is the daemon-internal scheduler, which can fire without traversing the agent-side adapter — named as the residual rather than claimed closed.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should this phase patch the bundled daemon's internal scheduler so a scheduled fire cannot bypass the freeze? **RESOLVED: No. The daemon ships inside the Mac app and is not modified by this contract. Its internal scheduler is named as the residual in the section; agent-side policy at the proxy boundary cannot freeze a fire that never traverses the adapter. Stating it keeps the boundary honest; no taste claim.**
- Should the section ship a running two-phase validator and an `automationBinding` data structure? **RESOLVED: No. The deliverable is a prose policy contract at the agent/proxy boundary — an evergreen reference section that refines the guarded-proxy precondition. It cites the existing single-use/TTL token contract and defines the freeze rule, escape paths, exemption, and acceptance in prose; it does not ship executable enforcement code and claims none.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Automation Freeze: a design-affecting Open Design automation is DENIED by default because the proof token is single-use + ~300s TTL; two escape paths (per-execution fresh-mint, named pre-authorized replay) + a read-only exemption
- Prose policy contract appended to guarded_proxy.md; DESIGN_PROOF_TOKEN Section 2 cited (no second schema); the daemon-internal scheduler named as the residual; prose-contract nature and the residual recorded in RISKS/OPEN QUESTIONS. No taste claim
-->
