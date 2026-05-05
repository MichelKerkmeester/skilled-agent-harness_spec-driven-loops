---
title: "Implementation Plan: Phase 3: synthesize"
description: "Python script parses 3 CLI-specific log formats; emits matrix.csv (45 rows). Claude authors review-report.md with verdict + findings."
trigger_phrases: ["071/003 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/003-synthesize"
    last_updated_at: "2026-05-05T15:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 plan authored"
    next_safe_action: "(Phase 3 complete)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: synthesize

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (no external deps) + Markdown |
| **Framework** | CSV + scenario frontmatter parser |
| **Storage** | matrix.csv + review-report.md + scripts/ |
| **Testing** | row-count check + verdict line grep |

### Overview
extract_metrics.py reads each scenario's frontmatter (expected_intent, expected_resources), parses each cell's log file (CLI-specific format), detects intent + resources mentioned, computes accuracy. Writes matrix.csv. Claude authors review-report.md from the data.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 45 cell logs available
- [x] 3 delta JSONL files available
- [x] 15 scenario frontmatters parseable

### Definition of Done
- [x] matrix.csv shipped
- [x] review-report.md shipped
- [ ] One commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single Python script with 3 CLI-specific log parsers + 1 frontmatter parser + 1 CSV writer. Simple iteration: 15 scenarios × 3 CLIs = 45 rows.

### Data Flow
```
scenario.md (frontmatter: expected_intent, expected_resources)
  + cell log (codex/copilot/opencode)
  -> parse_codex_log / parse_copilot_log / parse_opencode_log
  -> detect_intent (regex match against 12 intent names)
  -> detect_resources (regex match references/* and assets/*)
  -> accuracy: intent_match, false_positive, true_positive, accuracy_pct
  -> append to rows[]
  -> writer.writerow(row)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Sample 1 log per CLI to understand format
- [x] Author extract_metrics.py with 3 parsers + frontmatter reader

### Phase 2: Core Implementation
- [x] Run extract_metrics.py → matrix.csv (45 rows) + per-CLI summary stats
- [x] Author review-report.md with verdict + findings + recommendations

### Phase 3: Verification
- [x] wc -l matrix.csv = 46
- [x] grep "Verdict" review-report.md present
- [ ] Commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each CLI's log parser | sample log + assertion (~spot-check) |
| Aggregate | 45-row CSV completeness | wc -l |
| Manual | review-report.md narrative | spot-read + verdict check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 logs at logs/SD-NNN/{cli}.log | Internal | Green | Cannot extract |
| Python 3 stdlib | External | Green | All parsing uses re/csv/json |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: matrix.csv malformed; review-report.md missing verdict
- **Procedure**: rm matrix.csv + review-report.md; iterate extract_metrics.py; re-run
- **Granularity**: cheap (~10s); no commits to revert
<!-- /ANCHOR:rollback -->
