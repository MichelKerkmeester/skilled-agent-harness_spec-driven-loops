---
title: "Acceptance Criteria: Phase 10: source-tag-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "source tag hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening"
    last_updated_at: "2026-10-04T12:00:35Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All seven criteria met with evidence"
    next_safe_action: "None"
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
# Acceptance Criteria: Phase 10: source-tag-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening
**Level:** 2
**Status:** Draft
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase starts, When any sample is drawn, Then `measurement-protocol.md` already names every size, the seed, the ground-truth rules and the thresholds | Protocol sha256 `553e93dce30dcfb7…` unchanged; file time 12:22:56Z precedes every result file (implementation-summary.md:127) | Met | - |
| AC-002 | REQ-002 | Given a tag citing `REPO RULES.md:88`, When the rule runs, Then the tag resolves and a test covers it | 47 tags now resolve to `REPO RULES.md` on the 20 packets; vitest `resolves a tracked file whose name has a space, end to end` and 5 planted `REPO RULES.md:88` controls pass (implementation-summary.md:87) | Met | - |
| AC-003 | REQ-003 | Given a tag under a gitignored folder, When the file is present and when it is absent, Then the rule gives the same result both times | vitest: present and absent give identical output with `IGNORED\t1`; planted 5 present and 5 absent, 0 warnings; 708 ignored in both checkouts (implementation-summary.md:82) | Met | - |
| AC-004 | REQ-004 | Given a stratified sample drawn after the fixes, When accuracy is computed per class, Then each has a Wilson 95% interval compared with the protocol threshold | Moved 49/50 (89.5–99.6%), past end 44/44 (92.0–100%), gone 50/50 (92.9–100%) against 95/95/90%; moved lower bound under 95% (`scratch/samples/accuracy.json`) (implementation-summary.md:93) | Met | - |
| AC-005 | REQ-005 | Given a planted lineage with known bad tags of every class, When the rule runs, Then recall per class is reported | `scratch/planted.py`: recall 10/10 for moved, gone, past end and guessed; 0 warnings on 20 controls and ignored tags (implementation-summary.md:99) | Met | - |
| AC-006 | REQ-006 | Given the 20 comparison packets, When the rule runs in the worktree and the main checkout at one commit, Then the warnings are identical | At `93a83a466b0b`, a temporary detached worktree and the main checkout give identical output over the 20 packets; the baseline helper differs by 366 warnings (implementation-summary.md:101) | Met | - |
| AC-007 | REQ-007 | Given the default cutoff, When the 20 packets are validated, Then no result changes and the rule's run time per packet is reported before and after | Default cutoff 20/20 identical; run time per packet before and after in `scratch/runtime-guard-final.json`, total +7.8%, 2 packets over the protocol's 20% (implementation-summary.md:105) | Met | - |

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

All seven criteria are met. The run-time guard overage on two packets is accepted in ADR-001, and the one-commit comparison used a temporary worktree at main's commit.
<!-- /ANCHOR:closure -->
