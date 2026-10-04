---
title: "Acceptance Criteria: Jev features on by default when a key is stored"
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
    packet_pointer: "cli-jev/006-jev-feature-auto-enable"
    last_updated_at: "2026-10-04T20:12:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
# Acceptance Criteria: Jev features on by default when a key is stored

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/006-jev-feature-auto-enable
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a stub `jev` that passes auth, When `validate_document.py` checks a doc with a citation, a WebFetch hook payload arrives, and the reviewer and 5dim scorers run with no `--grader`, Then each path logs its measured Jev call | Stubbed tests per path pass: cite drift 52, hook 17, verdict fallback and D4 grader within model benchmark 273. Live Jev hook run flagged the planted section at p=0.99 | Met | - |
| AC-002 | REQ-002 | Given the same stub, When `JEV_FEATURES=0` or the one `JEV_FEATURE_<NAME>=0` is set in the env or in `hook-flags.env`, Then the stub logs no classifier call for the switched-off paths | `jev-features.test.mjs` 16 pass. Live hook run with `JEV_FEATURES=0` printed nothing | Met | - |
| AC-003 | REQ-003 | Given no `jev` on PATH, or a stub whose auth fails, When every changed path runs, Then its output matches the run before this packet and no call is logged | Per-path tests with no `jev` or failing auth pass, and every baseline suite holds its count or more | Met | - |
| AC-004 | REQ-004 | Given each live path, When it calls Jev, Then the question and options are the constants its scorer measured, imported rather than copied | Hook imports `INSTRUCTION` and `FLAG_AT` from the injection scorer, reviewer requires `QUESTION` and `OPTION_PAIRS` from `score-verdict-fallback.cjs`, D4 imports `QUESTION` from `score-d4-agreement.cjs` | Met | - |
| AC-005 | REQ-005 | Given the changed code, When searched for key reads and stdin handling, Then no path reads or prints `TYPESAFE_API_KEY` and every `jev` spawn has stdin closed or piped | `grep TYPESAFE_API_KEY` over the changed source prints nothing. `jevReady` spawns with stdin ignored and every call pipes stdin | Met | - |
| AC-006 | REQ-006 | Given the env template, env reference, hook flag template and hooks README, When read, Then each names all five switches with default and effect, and `/doctor:env list` parses the new reference rows | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:427` table uses the doctor's modern header and its 7 rows parse with 5 cells each. `.env.example` section 17, `hook-flags.env.example` and the hooks README name every switch | Met | - |
| AC-007 | REQ-007 | Given the repository outside `specs/`, When searched for each killed or unshipped feature, Then no file presents one as available | Killed-tool grep outside `specs/` prints nothing | Met | - |
| AC-008 | REQ-008 | Given the code files this program created or changed, When the sk-code-opencode verifier runs, Then it reports no errors | `verify_alignment_drift.py` reports 0 errors on `injection-screen`, `cli-classifier` and the four changed benchmark files | Met | - |
| AC-009 | REQ-009 | Given the root README and changelog v4.0.0.3, When validated, Then both describe the current classifier features and pass `validate_document.py` | `validate_document.py` reports 0 issues on the root README and on `v4.0.0.3.md` | Met | - |
| AC-010 | REQ-010 | Given the research run, When it ends, Then each executor completed 5 iterations and `research/research.md` ranks a next step for 017, 020 and 022 | Each lineage state log holds 5 iteration records. `research/research.md` section 8 ranks one next step each for 017, 020 and 022 | Met | - |

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

All ten criteria are Met with observed evidence. No row is waived or superseded.
<!-- /ANCHOR:closure -->
