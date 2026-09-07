---
title: "Acceptance Criteria: Rule headers, registry coverage and playbook paths"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "registry coverage test criteria"
  - "round three criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/020-rule-headers-registry-coverage-and-playbook-paths"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Rule headers, registry coverage and playbook paths

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/020-rule-headers-registry-coverage-and-playbook-paths
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh Level 2 scaffold, When validate.sh runs with --strict --json, Then every registry rule id appears once | `runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts:19` scaffolds and asserts; it failed on `AI_PROTOCOLS` until `runtime/cli/rules/check-ai-protocols.sh:131` reported the registry's id, then passed | Met | - |
| AC-002 | REQ-002 | Given the helper, When read, Then no allowlist, expiry or grandfather branch remains | `runtime/cli/rules/check-canonical-save-helper.cjs` has zero occurrences of the word; `node --check` passes | Met | - |
| AC-003 | REQ-003 | Given the four lanes and the program, When they run, Then all pass | the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 | Met | - |
| AC-004 | REQ-004 | Given the four playbook files and SKILL.md, When read, Then the commands name `system-deep-loop/runtime/tests` paths that exist and the routing sentence names a subset | `ls` on the three test paths; `SKILL.md:95` carries the corrected sentence | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met by observed output. Consciously left out: the routing sentence now says so; routing each needs a read of its body, which the round did not do.
<!-- /ANCHOR:closure -->
