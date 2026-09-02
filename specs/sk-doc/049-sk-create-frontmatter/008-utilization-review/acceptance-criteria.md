---
title: "Acceptance Criteria: Phase 1: utilization-review"
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
    packet_pointer: "sk-doc/049-sk-create-frontmatter/008-utilization-review"
    last_updated_at: "2026-09-02T18:55:24Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the measured outcome of every criterion"
    next_safe_action: "Review the two written-up items in implementation-summary.md section 7"
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
# Acceptance Criteria: Phase 1: utilization-review

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/008-utilization-review
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given eleven playbook scenarios that had never been executed, When each is run as written, Then each carries a recorded outcome of passed, failed with evidence, or could not run with the reason | `implementation-summary.md` section 3 records all eleven, 11 PASS | Met | - |
| AC-002 | REQ-001 | Given the playbook package, When the operator contract is checked, Then it reports PASS with a nonzero operator count | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook` prints `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 | Met | - |
| AC-003 | REQ-002 | Given eight realistic newcomer prompts, When each is routed through the advisor, Then the reachability of the mode from natural language is measured rather than assumed | `implementation-summary.md` section 4: 6 of 8 return no recommendation, 2 route to the wrong hub | Met | - |
| AC-004 | REQ-002 | Given the seventeen keyword triggers the manifest declares, When each is routed, Then the count that reaches nothing is measured after the routing pass | `implementation-summary.md` section 4: 8 of 17 return no recommendation, matching the pre-pass count | Met | - |
| AC-005 | REQ-003 | Given the four class templates added for readme, feature catalog, testing playbook and agent, When a real document of each class is checked against its template, Then every required field the template names is present | `implementation-summary.md` section 6: 8 real documents across the 4 classes, all conform | Met | - |
| AC-006 | REQ-004 | Given the versioning tool, When it is invoked with a lone `--help`, Then the behavior is observed and its ownership stated | `node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs --help --skill sk-vision` prints `Unknown mode: --help` and exits 64. Unscoped it walks git history past 120s first. Owned by the shared tier, not this mode | Met | - |
| AC-007 | REQ-005 | Given the documented 3-5x edit-count inflation, When it is measured over the in-scope corpus, Then the mode's editable documents carry the measured figure | 1,214 docs measured, aggregate 1.06-1.09x, max 2.25x and zero files at 3x. Corrected in `references/frontmatter-versioning.md`, `README.md`, the playbook root and `numstat-gate.md` | Met | - |
| AC-008 | REQ-006 | Given the field reference's rule that spec documents use inline metadata, When a spec document's frontmatter is removed, Then the validator's response settles whether the rule is correct | `validate.sh --strict` reported `SPECDOC_FRONTMATTER_001: malformed YAML frontmatter` and `RESULT: FAILED` at exit 2. Nine sites in `assets/frontmatter-templates.md` corrected | Met | - |
| AC-009 | REQ-006 | Given the `By Document Type` table, When the blockquote interrupting it is moved below the last row, Then all eight class rows sit inside one table | `assets/frontmatter-templates.md` lines 118-128, blockquote now at line 130 | Met | - |
| AC-010 | REQ-007 | Given every file this phase wrote, When the human-voice scanner runs, Then no file gains a hard blocker against its committed baseline | 6 files scanned, deltas 0, 0, 0, 0, 0 and -1, with the asset scanned using `--include-code` | Met | - |
| AC-011 | REQ-007 | Given every file this phase wrote, When `validate_document.py` runs on it, Then it exits 0 | 6 files, all exit 0 | Met | - |
| AC-012 | REQ-007 | Given this phase folder, When the spec validator runs strict, Then it prints `RESULT: PASSED` with rule lines visible | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/049-sk-create-frontmatter/008-utilization-review --strict` | Met | - |

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

AC-001 and AC-003 carried the packet. Running the playbook proved the mode answers the questions it claims to, and routing eight newcomer prompts proved almost nobody reaches it by describing their problem. Four documentation defects found on the way were fixed in place. Left out deliberately: the routing repair itself, which lives in hub files this phase was barred from editing, and the `--help` defect in the shared-tier engine, which this mode does not own. Both are written up in `implementation-summary.md` section 7 with the change each needs.
<!-- /ANCHOR:closure -->
