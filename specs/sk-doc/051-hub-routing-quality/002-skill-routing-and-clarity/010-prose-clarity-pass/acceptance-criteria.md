---
title: "Acceptance Criteria: Phase 10: Prose clarity pass"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "prose clarity pass acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/010-prose-clarity-pass"
    last_updated_at: "2026-10-28T18:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran the prose sweep over every SKILL.md, command and agent doc; all four criteria met"
    next_safe_action: "Run 011-regeneration-and-verification"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: Prose clarity pass

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/010-prose-clarity-pass`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `check-rule-copies.js`, `package_skill.py --strict` and `verify-doc-claims.cjs` pass after the pass. | Met, read after the sweep on the final tree. `rule-copies` exits 0 at `scratch/sweep.md:75`, `package_skill.py --check --strict` prints `Result: PASS` on every skill folder at `scratch/sweep.md:76`, and `verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed` at exit 0 at `scratch/sweep.md:77`, all from the full gate run on the final tree. | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: No line in a skill `SKILL.md` exceeds 400 characters outside code blocks and tables. | Met. The scan counts 0 prose lines over 400 characters across the 54 tracked `SKILL.md` files, down from 335, and 0 across the command and agent docs, down from 106, at `scratch/sweep.md:19` and `scratch/sweep.md:20`. The lines still over 400 characters are pinned: keyword comments the advisor parses, `Keyword triggers:` lines, and the compiled-routing blockquote a parity test holds identical. `spec.md` leaves pinned lines and machine blocks unchanged, and §1 lists each one. | Met | - |
| AC-003 | REQ-003 | Given a new skill or parent skill created through `/create:skill` or `/create:skill-parent`, When creation finishes, Then: its `SKILL.md` follows the clarity rules with no later clarity pass. | Met. The nine rules live once at `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:153`, and the sentence `Put instructions before background` matches one file under `.skilled/`. Nine files link them rather than restate them: the four create workflow activity files at `.skilled/commands/create/assets/create-skill-auto.yaml:343`, `.skilled/commands/create/assets/create-skill-confirm.yaml:362`, `.skilled/commands/create/assets/create-skill-parent-auto.yaml:428` and `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:467`, and five sk-create-skill documents at `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:1013`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md:98`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:29`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:58` and `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:69`. The count is `scratch/after.md:95`. The scaffold proof created both skill kinds from the shipped assets with no token and no heading lost. | Met | - |
| AC-004 | REQ-004 | Given either default flow, `/create:skill` or `/create:skill-parent`, runs, When it writes `SKILL.md` and `README.md`, Then: it scores both using `sk-create-with-human-voice`, reports the results and reports zero hard-rule violations. The skill defines no numeric passing threshold. | Met. Four workflow files carry the step and the gate: `.skilled/commands/create/assets/create-skill-auto.yaml:405` with `H4b_human_voice_gate` at `:258` and `blocking: true` at `:423`, `.skilled/commands/create/assets/create-skill-confirm.yaml:432` with `H4b` at `:274`, `.skilled/commands/create/assets/create-skill-parent-auto.yaml:453` with `H6` at `:303`, and `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:495` with `H6` at `:332`. Both presentation contracts print the per-target result, `.skilled/commands/create/assets/create-skill-presentation.txt:143` and `.skilled/commands/create/assets/create-skill-parent-presentation.txt:151`. The targets are the documents that exist, so a skill with no `README.md` is not a dead end: `.skilled/commands/create/assets/create-skill-auto.yaml:411`. The gate blocks completion on a hard blocker, which is what makes zero the number reported when creation finishes. The skill states publish bands and no pass bar of its own, and the 85 the flow enforces is the flow's value, read from those bands. The contract table is `scratch/after.md:147`. Residual, recorded not fixed: the two `SKILL.md` templates still carry hard blockers, so an author meets the gate on the first generated document, counted at `scratch/after.md:183`. | Met | - |

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

All four criteria are met. The writing side landed first, so a new skill starts clear. The sweep ran after phases 008 and 009 had finished rewriting the same files, and it brought every skill `SKILL.md`, command and agent doc under the line limit with the facts unchanged.
<!-- /ANCHOR:closure -->
