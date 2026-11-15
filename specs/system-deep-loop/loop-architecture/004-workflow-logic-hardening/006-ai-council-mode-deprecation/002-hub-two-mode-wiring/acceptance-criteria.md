---
title: "Acceptance Criteria: Phase 2: hub-two-mode-wiring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub two mode wiring acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/002-hub-two-mode-wiring"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-hub-two-mode-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: hub-two-mode-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-ai-council-mode-deprecation/002-hub-two-mode-wiring
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. AC ids come from the criteria list this phase had before it was split, so a criterion keeps its id in the child that owns it. Ids from AC-018 up were added at the split. A new row takes the highest AC-ID across the five children plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the registry modes are printed, Then only research and review remain | `node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'` prints `research review`. Observed: prints `research review`, exit 0. Evidence at `tasks.md:52` | Met | - |
| AC-002 | REQ-002 | Given the hub router and root router, When they are searched for the council, Then the tieBreak is research and review and no stage-two key names the council | `rg -n -i 'council' .skilled/skills/system-deep-loop/hub-router.json` prints nothing and `rg -n 'AI_COUNCIL' .skilled/skills/system-deep-loop/ROUTER.md` prints nothing. Observed: command 1 prints nothing, exit 1; command 2 prints nothing, exit 1. Evidence at `tasks.md:53` | Met | - |
| AC-003 | REQ-003 | Given the final tree, When the per-hub gate runs with the hub path, Then its subject line names the hub, it counts 2 modes and it passes | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` prints `INFO: Parent skill: .skilled/skills/system-deep-loop`, `declares 2 modes` and `OK: parent-skill-check`. Observed: prints 61 lines ending `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0. Evidence at `tasks.md:76` | Met | - |
| AC-010 | REQ-010 | Given the final tree, When the deep command set and its mirrors are listed, Then none exist and the mirror checkers pass | `git ls-files .skilled/commands/deep/ai-council.md` prints nothing, and `validate-command-tree-parity.sh` plus the Codex, Pi and DSH prompt generators with `--check` exit 0. Observed: `git ls-files .skilled/commands/deep/ai-council.md` prints nothing. `validate-command-tree-parity.sh` prints `PASS: 256 mirrors across 10 trees are in sync`, and the Codex, Pi and DSH prompt generators with `--check` each print PASS for 45 prompts and exit 0. Evidence at `tasks.md:49` | Met | - |
| AC-018 | REQ-018 | Given the final tree of this child, When the mode packet and its changelog path are listed, Then the packet is gone and the changelog is a real folder with every file | `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing, `git ls-files -s .skilled/changelog/system-deep-loop/deep-ai-council \| rg '^120000' \| wc -l` prints 0 and `ls .skilled/changelog/system-deep-loop/deep-ai-council \| wc -l` prints 20. Observed: command 1 prints nothing, exit 0; command 2 prints `0`, exit 0; command 3 prints `20`, exit 0. Evidence at `tasks.md:58` | Met | - |

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

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
