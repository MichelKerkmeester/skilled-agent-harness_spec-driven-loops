---
title: "Acceptance Criteria: Phase 6: playbook-and-closeout"
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
    packet_pointer: "sk-doc/051-sk-create-chart/006-playbook-and-closeout"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-6-closeout"
    recent_action: "Filled every criterion from observed gate output"
    next_safe_action: "Act on the open items in implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-6-playbook-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Families do not each need a scenario; the coverage table carries them"
      - "Five of eight scenarios run headless; two name a browser blocker"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: playbook-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/006-playbook-and-closeout
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
| AC-001 | REQ-001 | Given the finished playbook package, When the operator-scenario validator runs against it, Then the report names a nonzero operator scenario count and zero violations | `validate-playbook-package.cjs --package sk-doc/sk-create-chart` reports `PASS package=sk-doc/sk-create-chart tier=FAIL_CLOSED scenarios=8 categories=3 operator=8 routing_gold_excluded=0 violations=0 warnings=0` | Met | - |
| AC-002 | REQ-001 | Given the same run, When its status is read, Then the status is `PASS` rather than `SKIP`, and the operator count rather than the exit status is what carries the claim | The same report line. The exit status is 0 in both the passing and the skipping state, which is why it is not the evidence | Met | - |
| AC-003 | REQ-002 | Given a scenario file, When its frontmatter is read, Then it carries only `title`, `description`, `stage` and a four-part `version` | `routing_gold_excluded=0` in the report, plus the frontmatter of all eight files under `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/` | Met | - |
| AC-004 | REQ-002 | Given the finished package, When routing-gold fields are injected into all eight scenarios, Then the validator reports `SKIP` with `operator=0` at exit 0, and a checksum-verified restore returns the passing state | Negative control run: `SKIP package=sk-doc/sk-create-chart ... operator=0 routing_gold_excluded=8 violations=0` at exit 0, then a `shasum -a 256` comparison of all nine files before and after the restore reported no difference | Met | - |
| AC-005 | REQ-003 | Given the final state of the packet, When `validate.sh --strict --recursive` runs over it, Then every folder prints `RESULT: PASSED` with its rule lines present rather than absent | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/051-sk-create-chart --strict --recursive`, seven `RESULT: PASSED` lines each preceded by its rule block | Met | - |
| AC-006 | REQ-004 | Given the final state, When the fleet skill-root metadata check runs across every root, Then no root reports a violation | `ci-skill-root-metadata.cjs` reports `checked=14 passed=13 failed=1` at exit 1. `sk-doc` is `OK [H]`. The one failure is a stale `mcp-tooling` leaf manifest that predates this packet and lies outside its write authority | Waived | ADR-003 |
| AC-007 | REQ-005 | Given six chart families, When the root index is read, Then every family is named with the scenario that covers it and the reason that scenario is the one | The Family Coverage table in `manual-testing-playbook.md` section 1, six rows | Met | - |
| AC-008 | REQ-005 | Given the three colour systems, When the corpus-integrity scenarios are read, Then the palette source and the colour-literal rule each carry a scenario with a negative control | `corpus-integrity/colour-comes-from-one-source.md`, two breaks against two named checks | Met | - |
| AC-009 | REQ-005 | Given a scenario, When it is read, Then it names the failure it would catch, and that failure is one no other scenario in the package catches | All eight scenario files, each with a Why This Matters section naming its own failure. The mapping is the coverage table plus the three category groupings | Met | - |
| AC-010 | REQ-006 | Given the parent phase map, When it is read after this phase, Then no phase is listed as Pending that has shipped | `spec.md` Phase Documentation Map, six rows all `Complete` | Met | - |
| AC-011 | REQ-006 | Given the packet's documents, When their status fields are compared, Then no document claims a completion state another contradicts, or the disagreement is recorded as an open item rather than left to be discovered | Five child `spec.md` files carry `Complete`. `004-native-chart-build/spec.md` stays `Draft` because its acceptance criteria are an unfilled template, and that is recorded in `implementation-summary.md` as an open item rather than flipped | Met | - |
| AC-012 | REQ-006 | Given the corpus and the hub, When their gates run from the final state, Then the corpus check passes with rendering on and the hub check passes with the hub path supplied | `check-corpus.cjs --render` reports `RESULT: PASSED` with a `render` row of 29 assertions. `parent-skill-check.cjs .opencode/skills/sk-doc` reports all hard invariants passed with 0 warnings | Met | - |

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

Eleven criteria are met on observed output and one is waived through ADR-003. The two that
carried the packet are AC-004, which reproduced the routing-gold trap on the finished package and
reversed it, and AC-009, which is the bar that kept the scenario count at eight rather than at
one per chart family. What was consciously left out is a green fleet metadata number, because the
one failing root belongs to another hub and turning it green would have been an unreviewed edit
outside this packet.
<!-- /ANCHOR:closure -->
