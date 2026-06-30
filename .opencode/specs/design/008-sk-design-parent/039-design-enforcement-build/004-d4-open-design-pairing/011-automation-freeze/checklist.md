---
title: "Verification Checklist: Headless Automation Freeze (D4-R11)"
description: "Verification checklist for the Open Design automation-freeze contract: freeze rule, two escape paths, read-only exemption, named residual, token citation, and evergreen authoring."
trigger_phrases:
  - "d4-r11 automation freeze"
  - "headless automation gate design build"
  - "automation freeze checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/011-automation-freeze"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the appended freeze contract; recompute counts"
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
# Verification Checklist: Headless Automation Freeze (D4-R11)

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

- [x] CHK-001 [P0] Home decided and rationale recorded (guarded_proxy.md section, lowest duplication)
  - **Evidence**: appended `## Automation Freeze` section in `guarded_proxy.md`; the boundary, canonical request, classification, deny-by-default policy, and token citation already live there, so a standalone file was rejected
- [x] CHK-002 [P0] Freeze premise grounded in the single-use/short-TTL token constraint
  - **Evidence**: "An unattended automation cannot mint or carry a live interactive single-use token at fire time", tied to `DESIGN_PROOF_TOKEN` Section 2 (`singleUse: true`, ~300s `expiresAt`)
- [x] CHK-003 [P1] Token single-use/TTL section identified for citation (not restatement)
  - **Evidence**: cites `DESIGN_PROOF_TOKEN` Section 2 via the `#2-field-schema-v1` anchor (resolves to `## 2. FIELD SCHEMA (v1)`); no token field schema restated

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Freeze rule states a design-affecting automation is DENIED by default
  - **Evidence**: "A design-affecting automation is FROZEN — DENIED by default" covering `od automation create`/`run` triggering a design-mutating op and a scheduled `start_run`
- [x] CHK-011 [P0] Escape path A (per-execution fresh-mint) documented
  - **Evidence**: "pauses for a live operator to mint a fresh single-use token bound to that fire's actual outgoing payload ... converts a headless fire into an attended execution"
- [x] CHK-012 [P0] Escape path B (named, auditable pre-authorization with create-time frozen binding + fire-time replay) documented
  - **Evidence**: create-time frozen binding (subject digest, payload digests, `maxRuns`, `reviewWindow`); fire-time accepts only an exact replay inside the window and run budget; drift/missing/expired/exhausted → DENY
- [x] CHK-013 [P1] Read-only-automation exemption (`od automation list/view/show`) documented
  - **Evidence**: "`od automation list`, `od automation view`, and `od automation show` are inventory/status reads; with `openDesignPurpose: "openDesignExemption"`, they require no design token"

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance scenarios present (deny / fresh-mint allow / replay allow / exempt allow / residual unenforceable)
  - **Evidence**: section Acceptance table carries all five rows
- [x] CHK-021 [P0] Grep-confirm freeze rule, both escape paths, and exemption are present in the durable section
  - **Evidence**: freeze rule, both escape-path rows, and the `od automation list`/`view`/`show` exemption all confirmed present in the appended section
- [x] CHK-022 [P1] Read-only exemption does not over-block; mutating create/run stays guarded
  - **Evidence**: exemption scoped to `od automation list`/`view`/`show` under a positive `openDesignExemption`; `od automation create`/`run` remain on the guarded path per the host Policy JSON `cliVerbs`
- [x] CHK-023 [P1] Escape path B replay stays inside the bounded run budget / review window
  - **Evidence**: "Fire-time accepts only an exact replay of that binding within the review window and remaining run budget. Any drift, missing binding, expired window, or exhausted budget is `DENY`"

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; one new contract section is appended to the single guarded-proxy boundary doc, and the daemon-internal scheduler is named as a residual class rather than a producer to be fixed here
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: the automation surface is governed at exactly one boundary doc (`guarded_proxy.md`); the `od automation` verbs already live in its Policy JSON, so no second producer of the automation contract exists to mirror
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the freeze cites the `DESIGN_PROOF_TOKEN` Section 2 contract (single source of truth for single-use/TTL); the daemon-internal scheduler is the named downstream consumer that cannot be reached and is flagged as the residual
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser/redaction code ships — the section Acceptance table covers the adversarial cases (no token, fresh-mint, replay drift/expiry/exhaustion, read-only exempt, daemon-scheduler bypass)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; documentation-only deny contract with no test matrix — the authorization outcomes are documented as the five-row Acceptance table
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase — the deliverable is a prose policy contract
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: pinned to the single-file delta — `guarded_proxy.md` +25/-0 (pure append)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Deny-by-default preserved: absence of a valid token denies the automation fire
  - **Evidence**: "A design-affecting automation is FROZEN — DENIED by default"; the Acceptance table denies a fire with no live per-execution token and no valid pre-authorized replay binding
- [x] CHK-031 [P0] No new bypass introduced; the section refines, not weakens, the guarded-proxy precondition
  - **Evidence**: append-only (0 deletions); the two escape paths are bounded (attended fresh-mint, or exact replay inside window/budget) and the read-only exemption is scoped to inventory reads — no looser path is added
- [x] CHK-032 [P1] Named residual present: daemon-internal scheduler explicitly out of agent-side scope
  - **Evidence**: "the bundled Open Design daemon's own internal scheduler ... agent-side policy cannot freeze it. This section is a prose policy contract at the agent/proxy boundary, not a daemon patch"

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Token single-use/TTL reused by citation; no field-schema duplication
  - **Evidence**: cites `DESIGN_PROOF_TOKEN` Section 2 (`singleUse: true`, ~300s `expiresAt`); no token field schema restated in the section
- [x] CHK-041 [P1] Cross-reference to the `od automation` surface folded in-section (single-file scope held; no separate surface-doc edit)
  - **Evidence**: the appended section names the `od automation` create/run/list/view/show verbs directly and cites `DESIGN_PROOF_TOKEN` Section 2; scope was held to the single `guarded_proxy.md` append, so no second surface doc was edited
- [x] CHK-042 [P1] Evergreen: no spec IDs, finding IDs, packet numbers, or spec-folder paths embedded in the durable section
  - **Evidence**: scan over the appended section returns no spec/finding/phase IDs and no `specs/` paths

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edit confined to the named target (guarded_proxy.md `## Automation Freeze` section)
  - **Evidence**: single append to `.opencode/skills/mcp-open-design/references/guarded_proxy.md`; no other live skill, daemon, hook, CLI, or `.codex` file touched
- [x] CHK-051 [P1] No daemon patch or code change made; deliverable is prose-only
  - **Evidence**: the section is an evergreen reference contract; it ships no `automationBinding` runtime, no two-phase validator, and names the daemon scheduler as the residual

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification of the appended Automation Freeze contract against `guarded_proxy.md`)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - complete
- Automation Freeze: a design-affecting Open Design automation is DENIED by default (single-use + ~300s token); two escape paths (per-execution fresh-mint, named pre-authorized replay) + read-only exemption
- DESIGN_PROOF_TOKEN Section 2 reused by citation; daemon-internal scheduler named as the residual; pure append to guarded_proxy.md (+25/-0)
- GENERATED_METADATA (description.json / graph-metadata.json) regenerated by the orchestrator; not hand-written
-->
