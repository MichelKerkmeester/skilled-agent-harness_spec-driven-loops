---
title: "Acceptance Criteria: Phase 13: sk-prompt framework docs"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs"
    last_updated_at: "2026-09-27T12:01:40Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: sk-prompt framework docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the registry holds five code-task scaffolds, When the build rewrites its `description`, Then the description names CRISPE and CRAFT as frameworks without a scaffold and the five ids and entries are unchanged | `node -p '((r)=>r.frameworks.map(f=>f.id).join(",")+" "+/CRISPE/.test(r.description)+" "+/CRAFT/.test(r.description))(require("./.skilled/skills/sk-prompt/assets/framework-registry.json"))'` prints `rcaf,race,cidi,tidd-ec,costar true true` (baseline 2026-09-27: `... false false`), and `git diff --numstat -- .skilled/skills/sk-prompt/assets/framework-registry.json` shows 1 line added and 1 deleted | Unmet | - |
| AC-002 | REQ-001 | Given the owner's sources define seven frameworks, When the build finishes, Then the seven-framework prose and both matrix rows for CRISPE and CRAFT stay in `SKILL.md` | `grep -c -e 'Creativity *. CRISPE' -e 'Comprehensive *. CRAFT' .skilled/skills/sk-prompt/SKILL.md` prints 2 and `grep -c '7 frameworks' .skilled/skills/sk-prompt/SKILL.md` prints 4 (both baselines 2026-09-27) | Unmet | - |
| AC-003 | REQ-002 | Given a run loads `patterns-evaluation.md`, When `SKILL.md` gives the loading rule, Then both the resource loading section and the agent rules name the three sections to read | `grep -c 'FRAMEWORK DEEP DIVES' .skilled/skills/sk-prompt/SKILL.md` prints at least 2 and `grep -c 'CLEAR EVALUATION MASTERY' .skilled/skills/sk-prompt/SKILL.md` prints at least 2 (baseline 2026-09-27: 0 and 0) | Unmet | - |
| AC-004 | REQ-002 | Given a request carries an on-demand keyword, When the rule is in place, Then the whole file still loads for it | `grep -c '"all frameworks"' .skilled/skills/sk-prompt/SKILL.md` prints 1, and the rule's text names the on-demand keywords as the full-read case | Unmet | - |
| AC-005 | REQ-003 | Given the before read is 59,661 bytes, When the build measures the section read, Then the largest read set of the two files is at most 34,000 bytes | `wc -c < .skilled/skills/sk-prompt/SKILL.md` prints at most 24000, and the `sed` range counts in `plan.md` section 5 print 3066, 3950, 2670 (CRAFT) and 538 (TIDD-EC), recorded in `implementation-summary.md` with the before total 59,661 | Unmet | - |
| AC-006 | REQ-004 | Given the owner's validators and consumers pass today, When the two edits land, Then they all still pass | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/SKILL.md` prints `VALID` with exit 0, `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/sk-prompt` exits 0, `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh .` prints `GUARD PASS` with exit 0 and `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` from `.skilled/skills/system-deep-loop/deep-improvement/scripts` exits 0 | Unmet | - |
| AC-007 | REQ-005 | Given the owner records docs changes in its changelog, When the build commits, Then the changed sk-prompt files are the two edited files and one changelog file | `git diff --name-only 00480a8d5c..HEAD -- .skilled/skills/sk-prompt` prints exactly `SKILL.md`, `assets/framework-registry.json` and one file under `changelog/` (0 lines at planning time. T001 moves the base past any later owner commit) | Unmet | - |

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

Nothing is built yet. The phase is Planned, and every row above is `Unmet` until the build records its evidence.
<!-- /ANCHOR:closure -->
