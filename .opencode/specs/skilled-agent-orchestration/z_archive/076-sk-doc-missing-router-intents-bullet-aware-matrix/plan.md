---
title: "Implementation Plan: 076 sk-doc Router Coverage v3"
description: "Add 2 missing-intent scenarios (OPTIMIZATION + INSTALL_GUIDE), build markdown-bullet-aware v3 extractor, run matrix on 6 new cells, re-extract all 51 cells uniformly, ship review-report-v3.md."
trigger_phrases: ["076 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/076-sk-doc-missing-router-intents-bullet-aware-matrix"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "v3 matrix complete"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "076-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 076 sk-doc Router Coverage v3

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

sk-doc's smart router has 11 intents in its RESOURCE_MAP. Packet 071 covered 9 of those 11 across 15 scenarios. Packet 072 refined the extractor (v2) and surfaced cli-copilot's resource hallucination behavior (P1-072-001). Packet 075 documented the caveat in cli-copilot/SKILL.md + sk-doc/SKILL.md.

This packet (076) closes the remaining intent-coverage gap with 2 new scenarios — SD-016 (OPTIMIZATION) and SD-017 (INSTALL_GUIDE) — adds a markdown-bullet-aware v3 extractor, and re-extracts all 17 scenarios × 3 CLIs = 51 cells uniformly. Outcome: matrix_v3.csv + review-report-v3.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | SD-016 + SD-017 scenario files exist with reflective-framing prompts and pass frontmatter checks |
| G2 | All 6 new cells exit_code 0; correct intent picked |
| G3 | extract_metrics_v3.py runs cleanly across 51 cells; matrix_v3.csv is 52 lines incl header |
| G4 | review-report-v3.md surfaces v2-vs-v3 delta + per-intent findings |
| G5 | validate.sh --strict on 076 → exit 0 |
| G6 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Directory layout (under 076/)
- `scripts/run-matrix-076.sh` — variant of 071 dispatcher; scenario filter restricted to `01--intent-detection/00[45]-*.md`; logs/deltas redirected to 076
- `scripts/extract_metrics_v3.py` — extends 072 v2 with 3-pass `detect_resources_v3()` (Pass A full paths, Pass B bullet items, Pass C prose fallback)
- `logs/{SD-016,SD-017}/{codex,copilot,opencode}.log` — 6 raw CLI captures
- `deltas/{codex,copilot,opencode}.jsonl` — per-CLI delta records
- `matrix_v3.csv` — 51-row metrics matrix (17 scenarios × 3 CLIs)
- `review-report-v3.md` — synthesis + recommendations

### v3 extractor approach
v3 reads:
- 071 logs/deltas for SD-001..SD-015 (15 scenarios × 3 CLIs = 45 cells)
- 076 logs/deltas for SD-016..SD-017 (2 scenarios × 3 CLIs = 6 cells)

This split-source design keeps 071's stored logs as immutable historical record while extending the matrix with new cells. Re-extracting from stable logs (rather than re-running) is the methodology-correct way to compare extraction methods.

### Bullet-aware parsing
3 passes with union semantics:
- Pass A: regex matches `(references|assets)/[\w/.-]+\.md` paths
- Pass B: bullet-line basenames matching expected_resources basenames
- Pass C: prose-fallback basenames (same as v2's flat substring)

Net effect on the 51-cell sweep: numbers shift by less than ±5pp from v2, confirming v2 was already accurate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Authoring (SD-016, SD-017)
- Write `01--intent-detection/004-optimization.md`
- Write `01--intent-detection/005-install-guide.md`
- Update `manual_testing_playbook.md` Categories table (row 1) + Scenario Index list

### Phase 2: Dispatcher + Matrix Run (6 cells)
- Copy run-matrix.sh from 071 → run-matrix-076.sh; adjust scenario filter + log paths
- Execute: ~5-10 min wall-clock for 6 cells

### Phase 3: v3 Extractor + Re-extraction (51 cells)
- Author extract_metrics_v3.py (extends v2)
- Run extractor across 51 cells → matrix_v3.csv

### Phase 4: Review-Report + Spec Docs
- Author review-report-v3.md
- Author spec/plan/tasks/implementation-summary

### Phase 5: Validate + Commit + Push
- validate.sh --strict on 076 → exit 0
- One commit on main + push origin/main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|---|---|
| Frontmatter validity | `yamllint` or visual inspection on SD-016 + SD-017 |
| Dispatcher scenario filter | run with `--dry-run` flag; expect to enumerate 2 scenarios |
| Extractor correctness | hand-spotcheck 3 random cells against raw logs |
| matrix_v3.csv shape | `wc -l` = 52; `head -1` shows expected column header |
| validate.sh --strict | exit 0 on 076 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| 071 logs (45 files at `071/002-matrix-execute/logs/`) | Green | Required for 51-cell re-extraction; immutable historical record |
| 071 deltas (3 JSONL files) | Green | Required for duration + exit_code data |
| 072 extract_metrics_v2.py | Green | Reference for v3 extension |
| Python3 | Green | system default; v3 uses csv + json + re from stdlib |
| run-matrix-076.sh executable bit | Green | `chmod +x` after copy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If matrix run produces invalid logs or v3 extractor crashes on edge cases:
- The packet is purely additive (no edits to 071/072 logs)
- `rm -rf 076/` removes all packet artifacts cleanly
- The 2 new scenario files at `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/00[45]-*.md` can be deleted
- `manual_testing_playbook.md` index update can be reverted via git revert

Per memory rule: DELETE not archive. No `.bak`, no `_deprecated`, no commented-out paths.
<!-- /ANCHOR:rollback -->
