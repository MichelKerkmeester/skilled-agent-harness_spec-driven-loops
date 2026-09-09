---
title: "Acceptance Criteria: cli hub doc version reconciliation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/054-cli-hub-doc-version-reconciliation"
    last_updated_at: "2026-09-09T06:42:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: cli hub doc version reconciliation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** [Draft/In Progress/Complete]
**Date:** 2026-09-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 350 docs declared a wrong era, when the generator runs, then every doc's `X.Y` matches its skill anchor | `verify --skill cli-external-orchestration`, era mismatches 350 -> 0 | Met | - |
| AC-002 | REQ-002 | Given the enforced check is `gate`, when the run completes, then it stays green | `gate --skill cli-external-orchestration` -> `ok=363`, exit 0 | Met | - |
| AC-003 | REQ-003 | Given a 355-file sweep, when the diff is inspected, then no document content changed | `git diff` over the hub: 710 of 710 changed lines match `^[+-]version: N.N.N.N$` | Met | - |
| AC-004 | REQ-004 | Given a concurrent session on the same branch, when the commit is made, then only hub files are included | Hub had 0 dirty files pre-run; commit path-scoped to `.opencode/skills/cli-external-orchestration` plus this packet | Met | - |
| AC-005 | REQ-005 | Given the branch is already pushed, when reconciling, then no `--amend` second pass runs | Single `apply` pass; residual build drift accepted and recorded | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes — all five rows are `Met` against observed command output.

**What this packet deliberately does not claim.** `verify` is not green after the commit, and was
never going to be: the build segment counts commits, so writing these versions restales them. The
packet's claim is narrower and checkable — the era mismatches are gone and the enforced gate is
green.
<!-- /ANCHOR:closure -->
