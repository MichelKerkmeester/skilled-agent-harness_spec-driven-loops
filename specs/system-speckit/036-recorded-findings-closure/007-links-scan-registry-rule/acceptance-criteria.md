---
title: "Acceptance Criteria: Phase 7: links-scan-registry-rule"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "links scan registry rule acceptance criteria"
  - "run check adapter closure gate"
  - "memory name allowlist criterion"
  - "registry coverage ac"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/007-links-scan-registry-rule"
    last_updated_at: "2026-09-07T15:05:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: links-scan-registry-rule

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/007-links-scan-registry-rule
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `validator-registry.json`, When it is loaded, Then it lists a `LINKS_VALID` row that `validate.sh` sources for every folder | `python3 -c "import json; print('LINKS_VALID' in [r['rule_id'] for r in json.load(open('lib/validator-registry.json'))])"` prints `True` | Unmet | - |
| AC-002 | REQ-002 | Given `rename-pattern.md`, When `check-links.sh` scans the skill, Then none of its four memory-name citations report broken | `bash .opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh .opencode/skills/system-spec-kit` exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given a fresh Level 2 scaffold, When `validate.sh --strict --json` runs, Then `LINKS_VALID` appears in the report entries | `.opencode/skills/system-spec-kit/runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts` | Unmet | - |
| AC-004 | REQ-004 | Given `specs/system-speckit/`'s own packets, When `validate.sh --strict` runs against a sample including this closure program's siblings, Then none newly fails | manual `validate.sh --strict` run across the sample, output read | Unmet | - |
| AC-005 | REQ-005 | Given `.opencode/skills/mcp-tooling/mcp-obsidian`'s own broken `[[Website Relaunch]]` links, When `LINKS_VALID` runs against any folder, Then it never reports them | `bash rules/check-links.sh` with no argument still shows the finding, confirming the registry rule's fixed target never reaches it | Unmet | - |

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

Planning only. No criterion is met yet. The registry row, the rename-pattern.md fix and the adapter have not started.
<!-- /ANCHOR:closure -->
