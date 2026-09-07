---
title: "Acceptance Criteria: Phase 3: playbook-provenance-lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook provenance acceptance criteria"
  - "provenance line closure gate"
  - "no fabrication proof"
  - "playbook contract regression proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/003-playbook-provenance-lines"
    last_updated_at: "2026-09-07T15:05:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: playbook-provenance-lines

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/003-playbook-provenance-lines
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given all 85 files under `manual-testing-playbook/`, When each is read, Then every one carries a `Provenance:` line naming a suite path or "manual only" plus a command | `grep -rL "Provenance:" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md"` returns zero files | Unmet | - |
| AC-002 | REQ-002 | Given the new `playbook-provenance-paths.vitest.ts`, When run against the full tree, Then it fails if any cited suite path does not resolve on disk | `npx vitest run playbook-provenance-paths` from `runtime/cli/` | Unmet | - |
| AC-003 | REQ-003 | Given every suite-backed provenance line, When cross-checked against the runtime tree, Then each cited path is a real, existing file, not a name that resembles one | The same `playbook-provenance-paths.vitest.ts` run, plus a manual spot-check of 5 files across different categories | Unmet | - |
| AC-004 | REQ-004 | Given `.github/workflows/playbook-operator-contract.yml`, When run against the changed tree, Then the `validate-playbook-package.cjs` step still exits 0 | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` run locally against the changed tree | Unmet | - |
| AC-005 | REQ-005 | Given `manual-testing-playbook.md` Section 8, When read after this phase, Then it names the provenance-line convention alongside the two coverage mechanisms it already documents | Manual read of Section 8 against the two-form template in plan.md | Unmet | - |
| AC-006 | REQ-006 | Given the fixed provenance-line template, When applied across all 85 files, Then every line matches one of exactly two forms with no third variant | `grep -rhoE "Provenance: (manual only - .+\|[^ ]+\.(vitest\.ts\|test\.mjs\|test\.ts\|test\.cjs))" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md" \| wc -l` equals 85 | Unmet | - |

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

**Closeable:** No

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
