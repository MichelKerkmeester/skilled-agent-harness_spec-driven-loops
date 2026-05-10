---
title: "Implementation Plan: 072 Refined Extractor + Re-extraction"
description: "Author extract_metrics_v2.py with basename-matching + negative-segment filtering; re-extract from 071 raw logs; ship matrix_v2.csv + review-report-v2.md."
trigger_phrases: ["072 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/072-sk-doc-router-rerun-refined-extraction"
    last_updated_at: "2026-05-05T16:05:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Plan authored after v2 extractor revealed copilot hallucination"
    next_safe_action: "Author tasks + impl-summary, commit, push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "072-authoring"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 072 Refined Extractor + Re-extraction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Python 3 stdlib (re, csv, json, pathlib) |
| **Source data** | 071's 45 raw cell logs (read-only) |
| **Output** | matrix_v2.csv + review-report-v2.md |
| **Testing** | per-CLI summary stats + spot-check sample |

### Overview
extract_metrics_v2.py iterates on 071's extract_metrics.py with two heuristic improvements: (1) skip paragraphs that lead with negative markers ("Not loaded:", "would NOT load", "excluded:", etc.), (2) match short filename mentions against expected_resources basenames (not just full paths). Re-runs against 071's 45 raw logs (no new dispatches). Author review-report-v2.md with v1 vs v2 deltas.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 071 packet shipped (commit 46a63f9c1)
- [x] 071's 45 raw logs available at logs/SD-NNN/{cli}.log
- [x] 071's extract_metrics.py available as v1 baseline

### Definition of Done
- [x] extract_metrics_v2.py shipped
- [x] matrix_v2.csv shipped
- [x] review-report-v2.md shipped
- [ ] One commit on main + push to remote
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iteration on 071's extractor. Same 3 CLI parsers, refined `detect_resources_v2(text, expected_resources)`. Output schema unchanged so matrix_v2.csv is directly comparable to 071's matrix.csv.

### Data Flow
```
071's logs/SD-NNN/{cli}.log + scenarios manual_testing_playbook/*/*.md
  -> parse_codex_log / parse_copilot_log / parse_opencode_log (unchanged)
  -> detect_resources_v2(response, expected_resources)
       -> drop negative-marker paragraphs
       -> match full paths AND filename basenames against expected
  -> compute basename-vs-basename accuracy metrics
  -> matrix_v2.csv
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify 071's logs accessible
- [x] Sample SD-001/copilot.log to identify why v1 missed copilot's mentions

### Phase 2: Core Implementation
- [x] Author extract_metrics_v2.py with negative-segment filtering
- [x] Discover that path-only matching missed bare filenames; add basename matching
- [x] Re-run; produces matrix_v2.csv with 45 rows

### Phase 3: Verification
- [x] v1 vs v2 deltas computed (codex unchanged; copilot 5.6%->11.1%; opencode 43.3%->47.2%)
- [x] Spot-check on SD-001 reveals copilot HALLUCINATION (cites dqi_rubric.md which doesn't exist)
- [x] Author review-report-v2.md with new finding (P1-072-001 hallucination)
- [ ] Commit on main + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | detect_resources_v2 on synthetic positive/negative text | inline test (manual) |
| Aggregate | per-CLI summary stats | extract_metrics_v2.py main() output |
| Manual | spot-read SD-001/copilot.log | Read tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 071 logs at logs/SD-NNN/{cli}.log | Internal | Green | Cannot re-extract |
| Python 3 stdlib | External | Green | All parsing uses stdlib |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: matrix_v2 numbers regress vs v1 (e.g., codex accuracy drops); review-report-v2 contradicts v1 ranking unsupportedly
- **Procedure**: `git reset --hard HEAD~1`
- **Granularity**: One commit
<!-- /ANCHOR:rollback -->
