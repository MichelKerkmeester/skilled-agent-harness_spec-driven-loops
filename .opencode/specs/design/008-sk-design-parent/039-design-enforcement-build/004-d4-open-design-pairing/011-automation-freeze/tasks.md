---
title: "Tasks: Headless Automation Freeze (D4-R11)"
description: "Task breakdown for authoring the Open Design automation-freeze contract: freeze rule, two escape paths, read-only exemption, named daemon residual, and token citation."
trigger_phrases:
  - "d4-r11 automation freeze"
  - "headless automation gate design build"
  - "automation freeze tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/011-automation-freeze"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all automation-freeze tasks complete with one-line evidence"
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
# Tasks: Headless Automation Freeze (D4-R11)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the home and record the lowest-duplication rationale: a new `## Automation Freeze` section in the guarded proxy contract reusing its boundary, classification, policy, token citation, and residual framing (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m]
  - **Evidence**: appended to `guarded_proxy.md`; the boundary, canonical request, classification, deny-by-default policy, and token citation already live there, so a standalone file was rejected
- [x] T002 [P] Draft the freeze-rule premise: a single-use, ~300s token cannot be minted or carried by an unattended automation fire (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m]
  - **Evidence**: premise written as "An unattended automation cannot mint or carry a live interactive single-use token at fire time", grounded in `DESIGN_PROOF_TOKEN` Section 2 (`singleUse: true`, ~300s `expiresAt`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Freeze Rule
- [x] T003 Write the freeze rule: a design-affecting automation (`od automation create`/`od automation run` triggering a design-mutating op, or a scheduled `start_run`) is FROZEN — DENIED by default (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [20m]
  - **Evidence**: "A design-affecting automation is FROZEN — DENIED by default" covering `od automation create`/`run` and scheduled `start_run`

### Escape Paths
- [x] T004 Document escape path A — per-execution fresh-mint: the automation pauses for a live operator to mint a fresh single-use token bound to that fire's outgoing payload (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m]
  - **Evidence**: Per-execution fresh-mint row — "pauses for a live operator to mint a fresh single-use token bound to that fire's actual outgoing payload ... converts a headless fire into an attended execution"
- [x] T005 Document escape path B — named, auditable pre-authorization: a create-time frozen binding (subject/payload digests + `maxRuns`/`reviewWindow`) replayed exactly at fire-time within the review window (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [20m]
  - **Evidence**: Named pre-authorization row — create-time frozen binding (subject digest, payload digests, `maxRuns`, `reviewWindow`); fire-time accepts only an exact replay inside the window and run budget; drift/missing/expired/exhausted → DENY

### Exemption, Residual, Citation
- [x] T006 [P] Document the read-only-automation exemption: `od automation list/view/show` feed/mutate no design decision and need no token (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: "`od automation list`, `od automation view`, and `od automation show` are inventory/status reads; with `openDesignPurpose: "openDesignExemption"`, they require no design token"
- [x] T007 [P] Name the residual: the bundled daemon's internal scheduler can fire a scheduled automation without traversing the agent-side adapter and cannot be frozen by this policy (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: "the bundled Open Design daemon's own internal scheduler ... can fire a scheduled automation without traversing the agent-side adapter, so agent-side policy cannot freeze it"
- [x] T008 Cite the token single-use/TTL section rather than restating field schema; reference the `od automation` verbs in-section (single-file scope held — no separate surface-doc edit) (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: cites `DESIGN_PROOF_TOKEN` Section 2 via the `#2-field-schema-v1` anchor; no token field schema restated; the `od automation` verbs are named directly in the section, and scope was held to the single `guarded_proxy.md` append
- [x] T009 Add acceptance scenarios: deny (no token), allow (fresh-mint), allow (valid replay in budget), allow (read-only exempt), unenforceable (daemon scheduler) (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: section Acceptance table with all five rows present

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Structural Checks
- [x] T010 Grep-confirm the freeze rule, both escape paths, and the read-only exemption are present (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: freeze rule, both escape-path rows, and the `od automation list`/`view`/`show` exemption all confirmed present in the appended section
- [x] T011 Grep-confirm the named daemon-scheduler residual and the token single-use/TTL citation are present (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [5m]
  - **Evidence**: daemon-internal-scheduler residual paragraph and the `DESIGN_PROOF_TOKEN` Section 2 citation both confirmed present

### Evergreen & Honesty
- [x] T012 Evergreen scan: no spec IDs, finding IDs, packet numbers, or spec-folder paths embedded in the durable section (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m]
  - **Evidence**: appended-section scan returns no spec/finding/phase IDs and no `specs/` paths
- [x] T013 Confirm the section claims agent/proxy-side policy scope only and makes no daemon-patch or code-change claim (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [5m]
  - **Evidence**: "This section is a prose policy contract at the agent/proxy boundary, not a daemon patch"; the daemon scheduler is named as the residual

### Documentation
- [x] T014 Mark all checklist items with evidence (`checklist.md`) [10m]
  - **Evidence**: `checklist.md` all P0/P1 items marked `[x]` with evidence; counts recomputed; Verification Date 2026-06-28
- [x] T015 Complete implementation-summary.md (`implementation-summary.md`) [10m]
  - **Evidence**: `implementation-summary.md` authored at Level 2 with the how-delivered anchor, the freeze contract, escape paths, named residual, and the §2-by-citation reuse

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Freeze rule + two escape paths + read-only exemption + named residual all present
- [x] Token single-use/TTL reused by citation, not duplicated
- [x] Evergreen scan clean (no IDs/paths in the durable section)
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
