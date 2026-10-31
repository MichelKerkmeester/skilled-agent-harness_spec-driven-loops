---
title: "Acceptance Criteria: Phase 5: command-and-playbook"
description: "The five criteria that decide whether this phase may close: the package validator passing with every scenario inside the operator contract, the benchmark loader seeing all eleven, and the command requirement satisfied vacuously because no command ships."
trigger_phrases:
  - "command and playbook acceptance"
  - "playbook validator evidence"
  - "scenario loader visibility"
  - "vacuous command requirement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/005-command-and-playbook"
    last_updated_at: "2026-09-01T08:43:01Z"
    last_updated_by: "implementation"
    recent_action: "Closed all five criteria: no command ships, and both playbook gates are green"
    next_safe_action: "Proceed to phase 006 (verification and closeout)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: command-and-playbook

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/005-command-and-playbook
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the authored playbook package, When its own validator runs at the fail-closed tier, Then it passes with no violation and no warning | `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0`. The `operator=11` and `routing_gold_excluded=0` pair is the load-bearing part: it says every scenario was examined rather than filtered out | Met | - |
| AC-002 | REQ-002 | Given the same package, When the benchmark scenario loader reads it, Then it reports the authored count rather than falling through to an empty read | The loader reports `shape=sk-doc scenarios=11 warnings=[]`, with a parsed prompt, `expectedIntent`, `expectedResources` and typed leaf gold on every scenario | Met | - |
| AC-003 | REQ-003 | Given the requirement that a shipped command carries the workflow assets its siblings carry, When the command question is settled against the registry test, Then no command ships and the requirement holds vacuously | Satisfied vacuously: its antecedent is false. `.opencode/skills/sk-doc/mode-registry.json` keeps `command: null` for this mode, matching `sk-create-quality-control`, the one sibling that also operates on an existing document rather than producing a new artifact. Reasoning and rejected alternatives: plan.md ADR-001 | Met | - |
| AC-004 | SC-001 | Given the package on disk, When the validator verdict is taken as the phase's pass signal, Then that signal is enforced rather than incidental | The package is enrolled in `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`, and the fleet run after enrolment reports 39 PASS packages and zero FAIL. Link integrity on the package reports `failures=0` | Met | - |
| AC-005 | SC-002 | Given 11 scenario files in 3 category directories on disk, When the loader counts them, Then the reported number equals the number authored | `scenarios=11` from the loader matches the 11 files under `field-and-class-resolution/` (FMC-001 to FMC-003), `description-budget/` (FMB-001 to FMB-003) and `version-derivation/` (FMV-001 to FMV-005), and `categories=3` from the validator matches the three directories | Met | - |

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

All five criteria are Met. The command question was answered against a test read off the registry rather
than argued from the sibling count, and it landed on no command: every mode carrying a `/create:*` command
produces a new artifact, while the two carrying `command: null` are the two that operate on something that
already exists. REQ-003 is therefore satisfied vacuously, and is recorded as `Met` rather than as an
omission, because its antecedent is false and nothing was skipped.

The two P0 requirements could not both be met by the frontmatter shape the obvious reading suggests. With
all six routing keys present the package validator filtered every scenario out of the operator set and
returned `SKIP` at exit 0, which a fleet sweep grepping for `FAIL` would read as clean. Omitting only the
`expected_workflow_mode` scalar satisfies both consumers, and the reasoning is written into the package
itself so nobody re-adds the key. That resolution costs one check, and the cost was verified rather than
assumed: `requireRouteDeclaration` stays false at `codex-executor.cjs:145`, so a missing route declaration
is not recorded as a failure.

Consciously left out: five defects found in the surrounding tooling while pricing the scenarios are
recorded in implementation-summary.md and none was repaired. Each belongs to the script that owns it, not
to a phase about authoring a playbook, and every scenario was repriced onto a command that holds.
<!-- /ANCHOR:closure -->
