---
title: "Tasks: Polish Readiness Gate"
description: "Ordered implementer items to add a Polish Readiness subsection (verdict vocabulary ready/blocked/not-assessed, report-row shape, unfinished-marker scan, verdict-mapping rule) to critique_hardening.md and create polish_readiness_check.py, the deterministic gate that refuses a ready verdict while TODO/FIXME markers remain or without a scan."
trigger_phrases:
  - "polish readiness gate tasks"
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
    recent_action: "Mark all tasks complete with evidence; set canonical phase headers"
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
      - "Deterministic bite resolved to a new stdlib checker mirroring perf_evidence_check.py, not prose alone"
      - "The report row is defined in critique_hardening.md; pre-printing it into audit_report_template.md is out of scope"
---
# Tasks: Polish Readiness Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [30-45m]

- [x] T001 Re-read `critique_hardening.md` §6 Polish Checks and §7 Evidence Limits to confirm the exact end-of-section anchor ("Polish As Trust") the new subsection will sit beneath and the §7 boundary it precedes (`.opencode/skills/sk-design/design-audit/references/critique_hardening.md`) [10m] — §6 ends with "Polish As Trust" at line 101, §7 Evidence Limits begins at line 124
- [x] T002 Re-read the model the subsection binds to: §6 Polish Checks (design-system discovery, state quality) and §7 Evidence Limits ("a clean detector result is not proof of a strong design") so the subsection restates the live intent rather than inventing one (`critique_hardening.md`) [10m] — subsection's necessary-not-sufficient line traces to §7, not a fresh claim
- [x] T003 Insert a `### Polish Readiness` subsection at the end of §6, after "Polish As Trust" and before §7, naming the three-token verdict vocabulary — `ready`, `blocked`, `not-assessed` — each with a one-line definition (`critique_hardening.md`) [15m] — subsection lands at line 107 with the three tokens defined
- [x] T004 Add the report-row shape and the unfinished-marker scan: a markdown row an auditor emits (`| Polish readiness | <verdict> | scan evidence | judgment evidence |`) plus the deterministic scan for `\b(TODO|FIXME|XXX|HACK|WIP)\b`, documented as a re-runnable command and the checker invocation (`critique_hardening.md`) [15m] — row + scan documented with the `polish_readiness_check.py --scan` run-hint
- [x] T005 Add the verdict-mapping rule and the honest boundary: markers present ⇒ at most `blocked`; `ready` requires a clean scan AND the §6 rendered/state review; scan not run ⇒ `not-assessed`; state in plain words that a clean scan plus `ready` is necessary not sufficient (skill-relative paths only) (`critique_hardening.md`) [10m] — rule + necessary-not-sufficient line present, skill-relative paths only
- [x] T006 Verify additivity: every existing §§1-7 and its prose is preserved verbatim; only a new subsection was inserted; no `specs/` path or packet/phase ID embedded (`critique_hardening.md`) [10m] — 7 numbered H2 sections intact, 0 removed; evergreen grep over the subsection clean

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [1-1.5h]

- [x] T007 [P] Create `design-audit/scripts/polish_readiness_check.py` (Python 3 stdlib only) with a `main()` arg parser accepting a positional report path, a `--scan <surface>` option, and an optional `--json`, mirroring `perf_evidence_check.py` / `shared/scripts/proof_check.py` (`.opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py`) [15m] — checker created with `argparse`, positional `report`, `--scan`, `--json`; `py_compile` OK
- [x] T008 Implement the unfinished-marker scan: given `--scan <path>` (file or directory walk), count word-boundary matches of `\b(TODO|FIXME|XXX|HACK|WIP)\b` and record locations; when no `--scan` is given, treat the scan as not run (`polish_readiness_check.py`) [25m] — `_scan_surface` walks file or dir, counts `MARKER_PATTERN` hits; `ran=False` when no `--scan`
- [x] T009 Implement the verdict parse: locate the polish-readiness row/verdict in the passed report, extract and clean the verdict token, lowercase it, and reject any token outside `{ready, blocked, not-assessed}` (`polish_readiness_check.py`) [20m] — `_extract_verdict` finds the row, strips backticks, lowercases; invalid token → exit 1
- [x] T010 Implement the gate: `ready` + markerCount > 0 → fail (`ready claimed with N unfinished markers present`); `ready` + scan not run → fail (`ready claimed without a scan`); `blocked` → pass; `not-assessed` → pass; `ready` + clean scan → pass (`polish_readiness_check.py`) [20m] — `check()` implements all five branches; verified on scratch fixtures
- [x] T011 Wire the exit contract and output: exit 0 satisfied, 1 missing/invalid verdict or `ready` contradicted by the scan, 2 usage/unreadable/missing-surface; emit a human summary and an optional `--json` payload (verdict, markerCount, markerLocations, reason) mirroring `proof_check.py` (`polish_readiness_check.py`) [10m] — exit 0/1/2 wired; human summary + `--json` payload emitted

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [45m]

### Acceptance
- [x] T012 Build a filled report fixture with a polish-readiness row, verdict `ready`, over a clean surface fixture; run the checker with `--scan <clean>`; confirm exit 0 [10m] — exit 0 confirmed on the real `| Polish readiness |` row over a clean scanned surface
- [x] T013 Tamper test: introduce a `TODO` marker into the scanned surface, keep the `ready` verdict; confirm exit 1 naming `ready claimed with N unfinished markers present`; restore the surface [10m] — exit 1, "ready claimed with N unfinished markers present"; the gate bites
- [x] T014 Blocked + not-assessed: markers present with verdict `blocked` → exit 0; verdict `not-assessed` with no `--scan` → exit 0 [10m] — both exit 0; honest blocked and honest un-assessment pass
- [x] T015 Ready-without-scan + invalid verdict: `ready` with no `--scan` → exit 1 (`ready claimed without a scan`); a verdict token outside the three, or a missing row → exit 1 (`polish readiness row missing or verdict not in {ready, blocked, not-assessed}`) [10m] — ready-no-scan and invalid/missing verdict each exit 1
- [x] T016 Robustness: unreadable report, missing `--scan` path when required, ragged row → exit 2 deterministically with no false pass [10m] — no-argument call and unreadable report each exit 2, no false pass

### Consistency
- [x] T017 Confirm the subsection's verdict vocabulary equals the spec's three tokens (`ready`, `blocked`, `not-assessed`), the scan equals the spec's static `TODO`/`FIXME` scan, and the report row feeds the verdict (no invented requirement) (`critique_hardening.md`) [15m] — vocabulary, scan regex, and row all match the spec; `ALLOWED_VERDICTS` mirrors the subsection

### Audits
- [x] T018 Evergreen audit: grep the subsection + checker for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — evergreen grep over both returns clean
- [x] T019 Scope-lock audit: confirm the change set is exactly the one reference edit + the one new checker, and no other audit doc/reference/asset/script (notably `audit_report_template.md`) is modified [5m] — change set is `critique_hardening.md` + new `polish_readiness_check.py`; `audit_report_template.md` / `perf_evidence_check.py` / `audit_contract.md` untouched

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T019 complete
- [x] No `[B]` blocked tasks remaining — none
- [x] A clean-surface `ready` report passes; the same report with a `TODO` introduced into the surface fails (deterministic) — exit 0 clean, exit 1 with a marker
- [x] `blocked`, `not-assessed`, ready-without-scan, and invalid-verdict cases all behave as specified — 0 / 0 / 1 / 1
- [x] The subsection's vocabulary, scan, and row match the spec and the existing §6/§7 model — three tokens, marker scan, and row all consistent
- [x] Additive only — `critique_hardening.md` loses no prose; only the checker is a new file; `audit_report_template.md` untouched — §§1-7 intact, 0 removed
- [x] Evergreen + scope-lock audits pass — both files clean; change set is the one edit + the one new checker
- [x] `checklist.md` fully verified — all P0/P1 items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence model**: `.opencode/skills/sk-design/design-audit/references/critique_hardening.md` §6 Polish Checks, §7 Evidence Limits; `.opencode/skills/sk-design/design-audit/references/audit_contract.md` §5 Report Order
- **Gate convention**: `.opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py`; `.opencode/skills/sk-design/shared/scripts/proof_check.py` (stdlib checker pattern)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit acceptance + tamper + blocked + not-assessed + ready-without-scan + robustness tasks)
-->
