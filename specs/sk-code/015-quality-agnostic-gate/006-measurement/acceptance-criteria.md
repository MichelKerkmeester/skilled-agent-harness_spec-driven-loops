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
    last_updated_at: "2026-10-26T14:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from a live run of its command"
    next_safe_action: "Wait for the operator confirmation at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-measurement"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the quality-gate playbook folder, When its files are listed by id, Then seven files carry CQ-002 to CQ-008 | `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate` lists seven file paths. Observed 2026-10-26: the command printed seven paths, exit 0 | Met | - |
| AC-002 | REQ-001 | Given the scenario files, When each is searched for its pass and fail heading, Then every file in the folder has one `### Pass / Fail` | `rg -c '^### Pass / Fail$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate` lists eight files, each with count 1. Observed 2026-10-26: eight files, each with count 1, exit 0 | Met | - |
| AC-003 | REQ-002 | Given the root playbook index, When section 7 is searched, Then CQ-002 to CQ-008 each have a heading | `rg -c '^### CQ-00[2-8] ' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` prints `7`. Observed 2026-10-26: printed `7`, exit 0 | Met | - |
| AC-004 | REQ-003 | Given the compiled-routing folder, When its canary ids are listed, Then CB-CR-006 to CB-CR-008 exist | `rg -l '^id: CB-CR-00[678]$' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing` lists three file paths. Observed 2026-10-26: printed three paths, exit 0 | Met | - |
| AC-005 | REQ-003 | Given the two single-route canaries, When the agent-file prompt and the rails prompt replay, Then each route is single to `sk-code-quality` | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` and `sk-code-quality`, and the rails prompt prints the same. Observed 2026-10-26: both prompts printed `"selectionKind":"single"` with the one target `sk-code-quality`, exit 0 | Met | - |
| AC-006 | REQ-003 | Given the CI canary, When its prompt replays, Then stage one routes single to `sk-code-quality` and stage two carries `CI_WORKFLOW` with the four `sk-code-ci` references. Amended 2026-10-26 from a stage-one bundle, which the consumers phase waived under its ADR-006 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"single"` and `sk-code-quality`, and the `routeSkillResources` replay prints `["CI_WORKFLOW"]`. Observed 2026-10-26: stage one printed `"selectionKind":"single"` with `sk-code-quality`, and the stage-two replay printed `["CI_WORKFLOW"]` with the four `sk-code-ci` references, exit 0 | Met | - |
| AC-007 | REQ-004 | Given fixture F01 in a temporary repository, When the built-in runner measures it, Then all seven seeded exact labels match | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`. Observed 2026-10-26: printed `{"seeded":7,"matched":7,"misses":[]}`, exit 0 | Met | - |
| AC-008 | REQ-005 | Given fixture F02 in a temporary repository, When the built-in runner measures it, Then it reports zero findings | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0`. Observed 2026-10-26: printed `0`, exit 0 | Met | - |
| AC-009 | REQ-006 | Given the 50-file timing set, When built-in checks run three times, Then the slowest run is under 2000 ms | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000`. Observed 2026-10-26: printed `1661`, exit 0, against `target_ms` 2000, the largest of five full runs with both built-in checks at `RAN_CLEAN`. An earlier reading of `178.6` came from `--no-run` runs that started neither check, and is kept as `timing_no_run` | Met | - |
| AC-010 | REQ-007 | Given the live transcripts, When they are scanned for passing claims, Then no real claim remains | `rg -l -i -e 'gate passed' -e 'all checks pass' -e '\bPASS\b' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts` lists no file, or each listed hit is read by hand and found to quote a schema word. Observed 2026-10-26: the scan lists five files, every hit is a TAP summary line that counts a replayed subtest, each was read by hand, and the record sets `pass_claims` to `0` | Met | - |
| AC-011 | REQ-008 | Given four quality prompts, When intent is measured, Then the record holds the count with no target | `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').intent"` prints an object with `prompts: 4` and `targeted: false`. Observed 2026-10-26: printed `{"prompts":4,"matched":4,"targeted":false}`, exit 0 | Met | - |
| AC-012 | REQ-009 | Given the measurement record, When its false-positive keys are listed, Then the F02 and the unseeded F01 keys are named | `node -p "Object.keys(require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives)"` prints `[ 'f02_findings', 'f01_unseeded' ]`. Observed 2026-10-26: printed `["f02_findings","f01_unseeded"]`, exit 0 | Met | - |
| AC-013 | REQ-010 | Given the quality benchmark reports folder, When the new folder is listed, Then it holds the seven-file set | `ls .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/` lists seven file names. Observed 2026-10-26: seven names, exit 0 | Met | - |
| AC-014 | REQ-011 | Given the report's `source.md`, When the report folder is searched for absolute paths, Then none is found and the corpus row is filled | `rg -l -e '/Users/' -e '/private/' -e '/home/' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live` lists no file. Observed 2026-10-26: no file listed, `rg` exiting 1 with no output | Met | - |
| AC-015 | REQ-012 | Given the report's `README.md`, When the four measures are searched, Then each design 6.5 measure appears with its result | `rg -c -e 'catch rate' -e 'false positive' -e 'wall time' -e 'intent recall' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/README.md` prints a count of `4` or more. Observed 2026-10-26: printed `5`, exit 0 | Met | - |
| AC-016 | REQ-013 | Given the spec and the plan, When the five phase folder names are searched, Then both files name the dependencies | `rg -c -e '001-honest-checker' -e '002-builtin-runner' -e '003-config-and-doctor' -e '004-doctrine' -e '005-consumers-and-routing' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md` prints a nonzero count for each file. Observed 2026-10-26: printed `6` for spec.md and `11` for plan.md, exit 0 | Met | - |
| AC-017 | REQ-014 | Given the decision record, When the status line is searched, Then seven operator ADRs carry it | `rg -c 'Accepted, pending operator confirmation at program end' specs/sk-code/015-quality-agnostic-gate/006-measurement/decision-record.md` prints `7`. Observed 2026-10-26: printed `7`, exit 0 | Met | - |
| AC-018 | REQ-015 | Given the repository, When the gate paths are checked, Then nothing under them changed | `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing. Observed 2026-10-26: printed nothing, exit 0 | Met | - |
| AC-019 | REQ-016 | Given the landing step, When the quality changelog folder is listed, Then a new entry sorts after the last earlier entry, which phase 005 landed under `v1.11.0.0`. Amended 2026-10-26: the row named phase 004 as the last earlier phase to bump the mode, and three phases bumped it after 004 | `ls .skilled/skills/sk-code/sk-code-quality/changelog \| sort -V \| tail -1` prints a file whose version matches the landing version that `Q/SKILL.md` now carries. Observed 2026-10-26: printed `v1.12.0.0.md`, exit 0, and `Q/SKILL.md` reads `version: 1.12.0.0` | Met | - |
| AC-020 | REQ-017 | Given the phase folder, When evidence and scratch are listed, Then seven transcripts exist and scratch is empty | `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts` lists seven file names, and `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch` lists none. Observed 2026-10-26: the transcripts listing printed seven names and the scratch listing printed nothing, exit 0 | Met | - |
| AC-021 | REQ-018 | Given the live CQ runs, When the tree is read before and after the whole scenario replay, Then no run leaves a change behind. Amended 2026-10-26 from "every changed path sits under the phase folder or the reports folder", which no authored phase could satisfy, because the scenarios, the canaries, the renderer and the changelog entries sit outside both folders, and this worktree also carries another worker's edits | `git status --porcelain` captured before and after `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` differs in no line. Observed 2026-10-26: the status was identical at 36 lines each time, and the suite exited 0 | Met | - |

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

Every row is `Met`. No criterion carries a waiver. The measurement record holds each design 6.5 measure against its target, or as found where the design set no target, the report folder is rendered from that record, and the seven transcripts are saved in full. Two steps stay with the operator at program end: the read of those transcripts, and the confirmation of the seven operator decisions in `decision-record.md`.
<!-- /ANCHOR:closure -->
