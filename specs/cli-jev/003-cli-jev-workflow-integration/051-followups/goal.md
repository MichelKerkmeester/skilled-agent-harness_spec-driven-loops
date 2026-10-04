---
title: "Goal: Jev feature follow-ups"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/051-followups"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
      - ".skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-051"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Jev feature follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every follow-up the 050 review left that needs no new labels and no hook that does not exist yet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | 032 is the one feature that runs without an explicit `--jev`, as a non-blocking check, by the operator's choice on 2026-10-03. Every other feature stays opt-in |
| D2 | No new labels. The 025 capture collects unlabeled outputs only, per 003 D4 |
| D3 | The session is master orchestrator. Fresh Opus 5.5 leads, one per stream, drive DeepSeek V4.1 Flash max workers on cli-pi and review their work. The session verifies and commits |
| D4 | A changed flag line, protocol, aggregation or question text is an amendment, logged before the re-measure, with the old verdict kept |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] 032 runs as a non-blocking check in sk-doc validation, with tests for the unchanged exit code, the silent no-auth path and the opt-out, and one live advisory run recorded
- [x] 032 R9's amendment and re-measure verdict line are in the log with the run folder
- [x] Pi-answered records in 032, 035, 024, 025 and 017 name Pi's model and token usage, and the input-wrapping measurement and decision are logged
- [x] The 025 capture writes unlabeled real reviewer outputs with a census, and 017 R8 is ported with 017's replay at K=256 A=97 and 0 dropped
- [x] 026, 029 and 031 are marked retired in their catalogs, playbooks and phase goal logs
- [x] The killed and retired features' code, tests and catalog and playbook entries are deleted, the four without headroom lose their Jev arm, and every remaining suite passes
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Source: the operator, 2026-10-03: "Fix all use deepseek v4.1 flash max agents orchestrated by fresh opus" and "You are master orchestrar" |
| Stream A (2026-10-03) | Done | Answering model and usage on transport outcomes; text framing measured and adopted; 035 keep A=84 B=68 FP=2 (run 051-035-jev-20261003); 025 keep A=24 B=8 with 13,452 tokens recorded |
| Stream B (2026-10-03) | Done | 032 advisory check, opt-out SKDOC_CITE_DRIFT_CHECK=0, exit code unchanged; R9 amendment logged 21:25:21Z, re-measure keep A=37 B=16 (run 051-032-r9-20261003); live advisory run 051-032-advise-20261003 |
| Stream C (2026-10-03) | Done | Capture census 3,539 outputs, 3,482 regex misses, 0 labels; 026, 029 and 031 retired |
| Stream E (2026-10-03) | Done | Retirement sweep of live-describing docs and stale counts |
| Stream D (2026-10-04) | Done | Shared report helper; 017, 035, 020 and 022 probability-aware arms and pins; 037 text amendment logged 2026-10-03T23:00:35Z, rerun stop (coverage) K=111 M=99 A=95 agreement 96.0 (run 051-037-paired-20261003) |
| Stream F (2026-10-04) | Done | Nine scorers deleted, two Jev arms and one gate line removed, generated surfaces regenerated; commits ec7be335a2 to d48913df93 |
| Deletion deep review (2026-10-04) | Done | Three DeepSeek V4.1 Flash iterations on cli-pi (correctness, traceability, maintainability), verdict PASS with one advisory. P1 R1-P1-001, a stale advisor leaf registry still listing the four deleted scorer-fusion docs, was fixed in `424cf11a5e` and confirmed resolved. P2 R2-P2-001, a 56 against 59 gold-row count, predates the deletion. Report: `review/review-report.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Delete killed feature code (2026-10-04) | Source: the operator: "Btw did we delete the code for all killed jev features" and "If not, we should". Amends the spec, which had kept retired scorers as the record. Runs as stream F after stream D, because both touch shared catalogs and caller docs |
| D3 amended (2026-10-04) | Source: the operator: "Dont us opus or sonnet from here" and "You take over as sole orchestrator". No Claude subagent after that point. The session orchestrates DeepSeek workers directly and Luna reviews cross-family |
| 037 amendment record | Written to the stream's scratch note at 2026-10-03T23:00:35Z before the rerun, and copied here at close |
| P2 open: capture script | An unreadable candidate aborts with exit 2, and --root deduplicates by path rather than real path |
| P2 open: 032 | adviseGate uses a 90 s timeout for version and auth, and the comparator rule is not in the requalify hashes |
| P2 open: transport tests | The stand-in Pi fixture is copied in three test files |
| P2 open: leaf-route gold count | Predates this phase: the sk-doc catalog says the gold has 56 rows, and the replay now reports 59. Found by the stream F cross-family review, which also caught one stale playbook count, fixed in d4d3d0e0b4 |
<!-- /ANCHOR:log -->
