---
title: "Verification Checklist: Polish Readiness Gate"
description: "Verification items for the Polish Readiness subsection added to critique_hardening.md and the polish_readiness_check.py deterministic gate, including existence, vocabulary, report-row, acceptance/tamper, blocked/not-assessed, ready-without-scan, advisory-honesty, evergreen, and scope-lock checks."
trigger_phrases:
  - "polish readiness gate checklist"
  - "todo fixme scan verdict design build"
  - "polish_readiness_check deterministic gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/010-polish-readiness-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all checklist items verified; recompute counts and set verification date"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/critique_hardening.md"
      - ".opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py"
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Marker-scan floor is enforceable (ready needs a fresh clean scan); polish quality stays advisory under §7"
      - "Checker grades a filled report against a re-run scan, never the blank subsection's self-reported count"
---
# Verification Checklist: Polish Readiness Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec target re-read: `critique_hardening.md` §6 Polish Checks narrates polish today with no verdict, no vocabulary, and no unfinished-marker scan
  - **Evidence**: the prior §6 ended with "Polish As Trust" prose (line 101) and carried no `ready/blocked/not-assessed` verdict and no `TODO`/`FIXME` scan before this edit
- [x] CHK-002 [P0] Existing model re-read so the subsection restates it, not a new invention (§6 Polish Checks, §7 Evidence Limits; impeccable `polish.md` mark-with-TODOs + clean-script-is-not-proof)
  - **Evidence**: the subsection's necessary-not-sufficient line restates §7 ("a clean detector result is not proof of a strong design"), not a fresh claim
- [x] CHK-003 [P0] Scope frozen to one additive reference edit + one new checker; no other audit file touched, in particular `audit_report_template.md`
  - **Evidence**: the change set is `critique_hardening.md` modified + `scripts/polish_readiness_check.py` added under `.opencode/skills/sk-design/design-audit/`; `audit_report_template.md` / `perf_evidence_check.py` / `audit_contract.md` untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `critique_hardening.md` carries a `### Polish Readiness` subsection naming the three-token verdict vocabulary — `ready`, `blocked`, `not-assessed` — each with a one-line definition
  - **Evidence**: the three tokens appear with one-line definitions inside §6 (line 107), before §7, in the file's house style
- [x] CHK-011 [P0] The subsection defines the report-row shape and the deterministic unfinished-marker scan (`\b(TODO|FIXME|XXX|HACK|WIP)\b`) and the verdict-mapping rule
  - **Evidence**: the `| Polish readiness | <verdict> | scan evidence | judgment evidence |` row is shown, the scan is documented as a re-runnable command, and the rule maps markers ⇒ at most `blocked`, `ready` ⇒ clean scan, no scan ⇒ `not-assessed`
- [x] CHK-012 [P0] `polish_readiness_check.py` runs the unfinished-marker scan over `--scan` and FAILS when a `ready` verdict is asserted while markers were found (not merely on a missing row)
  - **Evidence**: a `ready` report over a surface with a `TODO` exits 1, "ready claimed with N unfinished markers present"; the gate bites on the marker, not just a missing row
- [x] CHK-013 [P1] The checker classifies `blocked`, `not-assessed`, ready-without-scan, and invalid/missing verdicts correctly (pass / pass / fail / fail)
  - **Evidence**: verified — `blocked` with markers → exit 0; `not-assessed` with no `--scan` → exit 0; `ready` with no `--scan` → exit 1; verdict outside the three or missing row → exit 1

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: a polish-readiness row with verdict `ready` over a clean scanned surface exits 0
  - **Evidence**: deterministic exit 0 on the clean-surface `ready` report
- [x] CHK-021 [P0] ACCEPTANCE: the same report with a `TODO` introduced into the scanned surface exits non-zero
  - **Evidence**: exit 1 with "ready claimed with N unfinished markers present"
- [x] CHK-022 [P0] ACCEPTANCE: a `blocked` verdict with markers and a `not-assessed` verdict with no scan both exit 0
  - **Evidence**: both exit 0; the honest blocked path and the honest un-assessment path pass
- [x] CHK-023 [P1] ROBUSTNESS: an unreadable report, a missing `--scan` path when required, and a ragged row each exit 2 with no false pass
  - **Evidence**: a no-argument call and an unreadable report each exit 2; usage/parse failures are deterministic and never a clean pass

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only — this phase adds one reference subsection plus one stdlib gate and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one reference edit + one new checker, and an evergreen grep over both returns clean
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the only consumer of the Polish Readiness subsection is `polish_readiness_check.py`; no existing audit doc, asset, or script reads it, so nothing downstream changes; `audit_report_template.md` is intentionally not edited
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial matrix executed — `ready`+clean, `ready`+markers, `ready`+no-scan, `blocked`+markers, `not-assessed`+no-scan, invalid/missing verdict, and unreadable report all behave deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 7 gate cases (ready-clean / ready-markers / ready-no-scan / blocked / not-assessed / invalid-or-missing-verdict / usage-or-unreadable) yielding exits 0/1/1/0/0/1/2, plus the vocabulary+scan consistency check against the spec
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the gate reads only the target report text and the scanned surface, and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Evidence**: evidence pins to the `### Polish Readiness` subsection in `critique_hardening.md` and the `check()` / `_scan_surface` functions in `polish_readiness_check.py`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No false trust signal: the subsection and the checker both state the bite is structural (markers absent + an allowed verdict consistent with the scan); whether a clean `ready` surface is actually polished stays advisory
  - **Evidence**: neither artifact claims the checker verifies the surface is well-designed; the necessary-not-sufficient boundary is written in the subsection and the checker docstring, echoing §7 and impeccable `polish.md`
- [x] CHK-031 [P1] Integrity: the subsection restates the existing §6/§7 model and relocates no logic out of `critique_hardening.md`
  - **Evidence**: the subsection references §6/§7 and copies/moves none of their content; it does not duplicate `audit_report_template.md`

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the subsection or the checker
  - **Evidence**: an evergreen grep over both returns no `specs/` paths and no packet-phase IDs; only skill-relative paths appear
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the three-token verdict vocabulary, the static `TODO`/`FIXME` scan, and the deterministic ready-cannot-stand-with-markers acceptance
  - **Evidence**: spec, plan, tasks, checklist, and implementation-summary all carry the same vocabulary (`ready`, `blocked`, `not-assessed`), the same `\b(TODO|FIXME|XXX|HACK|WIP)\b` scan, and the same exit 0/1/1/0/0/1/2 matrix

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `critique_hardening.md` edited and `scripts/polish_readiness_check.py` added; no existing audit file modified; the reference edit deletes/rewords no existing prose
  - **Evidence**: the change set is exactly those two paths; the reference change is a pure insertion (§§1-7 byte-preserved, 7 numbered H2 sections, 0 removed)
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: the acceptance fixtures (clean surface, marker surface, sample reports) lived only in a `mktemp` scratch dir and were removed; the working tree carries only the edited reference + the new checker

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator — verified against the delivered Polish Readiness subsection + `polish_readiness_check.py` (exit 0 on a clean-surface `ready` report, exit 1 when a `TODO` is introduced and when `ready` is claimed with no scan, exit 0 on `blocked`/`not-assessed`, exit 1 on missing/invalid verdict, exit 2 on usage)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
