---
title: "Goal: Phase 6: measurement"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "measurement goal"
  - "quality gate measurement goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/006-measurement"
    last_updated_at: "2026-10-26T14:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Met all six completion criteria and closed the phase directive"
    next_safe_action: "Wait for the operator confirmation at program end"
    blockers: []
    key_files:
      - "evidence/measurement.json"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-measurement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: measurement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure the quality gate that phases 001 to 005 build, on seeded changes, a timing set and routing canaries, and record each catch rate, miss, false positive, wall time and intent recall against its target in one report.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase fixes no gate defect. A measured miss or false positive goes to the phase that owns the surface, as a new change. |
| D2 | Intent recall is recorded as found, with no target (ADR-007). |
| D3 | The report uses the existing seven-file set and names a repository-relative root (ADR-005). |
| D4 | The live report waits for a renderer owner. No hand-written report markdown is produced (ADR-008). |
| D5 | The three canaries are the three compiled-route prompts of design 6.5. The advisor replays belong to phase 005 acceptance. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The quality playbook holds the seven new scenarios: `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate` lists seven file paths. Evidence 2026-10-26: the listing printed seven paths, exit 0.
- [x] The three canaries replay to their expected routes: `rg -l '^id: CB-CR-00[678]$' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing` lists three file paths, and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` with `sk-code-quality`. Evidence 2026-10-26: the listing printed three paths and the route printed one target, both exit 0. The rails prompt and the CI prompt reran the same way.
- [x] The catch and false-positive record matches: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`, and `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0`. Evidence 2026-10-26: both reads printed their expected value, exit 0.
- [x] The timing record meets its target: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000`, and `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').readonly_invariant"` prints `true`. Evidence 2026-10-26: the reads printed `1661` and `true`, exit 0, on five full runs with both built-in checks running.
- [x] No live transcript makes a pass claim: `rg -l -i -e 'gate passed' -e 'all checks pass' -e '\bPASS\b' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts` lists no real claim, and every listed hit is read by hand and found to quote a schema word. Evidence 2026-10-26: five files are listed and every hit is a TAP `# pass N` summary line, read by hand, so `pass_claims` reads `0`.
- [x] The report folder holds the seven-file set with no absolute path, after OQ-1 is answered: `ls .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/` lists seven files, and `rg -l -e '/Users/' -e '/private/' -e '/home/' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live` lists no file. Evidence 2026-10-26: the listing printed seven names and the absolute-path scan listed no file, exit 0. `render-report.cjs --check` reproduced all seven files from the record.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Setup (T001 to T003) | Complete | The five earlier phases read Complete, the ROUTER citation printed `1` and `evidence/` holds the record and the transcripts |
| Scenarios CQ-002 to CQ-008 and their index (T004 to T011) | Complete | Seven ids in the playbook folder, seven section 7 headings, and `Total issues: 0` from the document validator |
| Canaries CB-CR-006 to CB-CR-008 (T012 to T015) | Complete | Each replays single to `sk-code-quality` and carries the live status evidence |
| Measurement record (T016 to T022) | Complete | `evidence/measurement.json` holds the six corpus axes, seven runs and the four measures, pinned to `716a1a8ac4e37478835e14e91b804811e686875d` |
| Report folder, index row and source rows (T023 to T025, T031) | Complete | Seven files rendered from the record, `--check` reproducing all seven, one index row, and the rendered README carrying AC-015's count of `5` |
| Verification (T026 to T030, T032) | Complete | The document validator and both package validators pass, the quality suite prints `# pass 100` and `# fail 0`, and the strict phase validator prints `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The live D4 report has no runner or renderer | Design 6.5 and section 7 require a report folder from a live D4 run. The Lane C harness and its renderer are retired, and no successor exists (`.skilled/skills/sk-code/benchmark/README.md:14,16`). Answered 2026-10-26 as ADR-008 option (a), so this phase built the renderer. |
| Open question: who owns the live D4 runner and the report renderer? | Answered 2026-10-26. The operator took option (a), sk-code owns the gap, and this phase built `benchmark/scripts/render-report.cjs`. T023 to T025 ran. |
| Design 6.5 "live D4" wording | Read as the benchmark's D4 usefulness dimension (`research.md:122`), not design decision D4. |
| The 50-file timing set | Not in the design fixture table (6.2). It is built at run time in a temporary repository and never committed. |
| Timing method | The first timing used `--no-run`, which starts neither built-in check, and recorded 178.6 ms. Review caught it. The record now holds five full runs, slowest 1661 ms, and NFR-P01 in spec.md names the full run. |
| "Real changes" in design 7 Phase 6 | Replaced by fixtures in temporary repositories, because the playbook rule says scenarios write nothing (`manual-testing-playbook.md`, section 2, rule 5). |
| The advisor replays and the stage-two node test in design 6.5 | Phase 005 acceptance runs them. Phase 6 covers the three compiled-route canaries only. |

<!-- /ANCHOR:log -->
