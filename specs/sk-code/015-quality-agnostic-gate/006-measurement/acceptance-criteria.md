---
title: "Acceptance Criteria: Phase 6: measurement"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "measurement acceptance criteria"
  - "phase 6 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/006-measurement"
    last_updated_at: "2026-10-25T23:21:54Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Answer OQ-1, then execute tasks T001 to T003 and Steps 1 and 2"
    blockers:
      - "OQ-1: owner of the live D4 runner and renderer (ADR-008)"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-measurement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 6: measurement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/006-measurement
**Level:** 2
**Status:** Draft
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the quality-gate playbook folder, When its files are listed by id, Then seven files carry CQ-002 to CQ-008 | `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate` lists seven file paths | Unmet | - |
| AC-002 | REQ-001 | Given the scenario files, When each is searched for its pass and fail heading, Then every file in the folder has one `### Pass / Fail` | `rg -c '^### Pass / Fail$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate` lists eight files, each with count 1 | Unmet | - |
| AC-003 | REQ-002 | Given the root playbook index, When section 7 is searched, Then CQ-002 to CQ-008 each have a heading | `rg -c '^### CQ-00[2-8] ' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` prints `7` | Unmet | - |
| AC-004 | REQ-003 | Given the compiled-routing folder, When its canary ids are listed, Then CB-CR-006 to CB-CR-008 exist | `rg -l '^id: CB-CR-00[678]$' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing` lists three file paths | Unmet | - |
| AC-005 | REQ-003 | Given the two single-route canaries, When the agent-file prompt and the rails prompt replay, Then each route is single to `sk-code-quality` | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` and `sk-code-quality`, and the rails prompt prints the same | Unmet | - |
| AC-006 | REQ-003 | Given the CI canary, When its prompt replays, Then stage one routes single to `sk-code-quality` and stage two carries `CI_WORKFLOW` with the four `sk-code-ci` references. Amended 2026-10-26 from a stage-one bundle, which the consumers phase waived under its ADR-006 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"single"` and `sk-code-quality`, and the `routeSkillResources` replay prints `["CI_WORKFLOW"]` | Unmet | - |
| AC-007 | REQ-004 | Given fixture F01 in a temporary repository, When the built-in runner measures it, Then all seven seeded exact labels match | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }` | Unmet | - |
| AC-008 | REQ-005 | Given fixture F02 in a temporary repository, When the built-in runner measures it, Then it reports zero findings | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0` | Unmet | - |
| AC-009 | REQ-006 | Given the 50-file timing set, When built-in checks run three times, Then the slowest run is under 2000 ms | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000` | Unmet | - |
| AC-010 | REQ-007 | Given the live transcripts, When they are scanned for passing claims, Then no real claim remains | `rg -l -i -e 'gate passed' -e 'all checks pass' -e '\bPASS\b' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts` lists no file, or each listed hit is read by hand and found to quote a schema word | Unmet | - |
| AC-011 | REQ-008 | Given four quality prompts, When intent is measured, Then the record holds the count with no target | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').intent"` prints an object with `prompts: 4` and `targeted: false` | Unmet | - |
| AC-012 | REQ-009 | Given the measurement record, When its false-positive keys are listed, Then the F02 and the unseeded F01 keys are named | `node -p "Object.keys(require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives)"` prints `[ 'f02_findings', 'f01_unseeded' ]` | Unmet | - |
| AC-013 | REQ-010 | Given the quality benchmark reports folder, When the new folder is listed, Then it holds the seven-file set | `ls .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/` lists seven file names | Unmet | - |
| AC-014 | REQ-011 | Given the report's `source.md`, When the report folder is searched for absolute paths, Then none is found and the corpus row is filled | `rg -l -e '/Users/' -e '/private/' -e '/home/' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live` lists no file | Unmet | - |
| AC-015 | REQ-012 | Given the report's `README.md`, When the four measures are searched, Then each design 6.5 measure appears with its result | `rg -c -e 'catch rate' -e 'false positive' -e 'wall time' -e 'intent recall' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/README.md` prints a count of `4` or more | Unmet | - |
| AC-016 | REQ-013 | Given the spec and the plan, When the five phase folder names are searched, Then both files name the dependencies | `rg -c -e '001-honest-checker' -e '002-builtin-runner' -e '003-config-and-doctor' -e '004-doctrine' -e '005-consumers-and-routing' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md` prints a nonzero count for each file | Unmet | - |
| AC-017 | REQ-014 | Given the decision record, When the status line is searched, Then seven operator ADRs carry it | `rg -c 'Accepted, pending operator confirmation at program end' specs/sk-code/015-quality-agnostic-gate/006-measurement/decision-record.md` prints `7` | Unmet | - |
| AC-018 | REQ-015 | Given the repository, When the gate paths are checked, Then nothing under them changed | `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing | Unmet | - |
| AC-019 | REQ-016 | Given the landing step, When the quality changelog folder is listed, Then a new entry sorts after the entry of phase 004, the last earlier phase to bump the quality mode | `ls .skilled/skills/sk-code/sk-code-quality/changelog \| sort -V \| tail -1` prints a file whose version is above the `Q/SKILL.md` version read at T001 (1.7.1.0 once phases 001 to 005 land) | Unmet | - |
| AC-020 | REQ-017 | Given the phase folder, When evidence and scratch are listed, Then seven transcripts exist and scratch is empty | `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts` lists seven file names, and `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch` lists none | Unmet | - |
| AC-021 | REQ-018 | Given the live CQ runs, When git status is read, Then every changed path sits under the phase folder or the reports folder | `git status --porcelain` lists only paths under `specs/sk-code/015-quality-agnostic-gate/006-measurement/` and `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/` | Unmet | - |

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

Every row is `Unmet`. No criterion carries a waiver. The packet cannot close until the measurements run and the report rows (AC-013, AC-014 and AC-015) record their results.
<!-- /ANCHOR:closure -->
