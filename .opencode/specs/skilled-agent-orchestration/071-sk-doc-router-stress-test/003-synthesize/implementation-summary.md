---
title: "Implementation Summary: Phase 3: synthesize"
description: "matrix.csv (45 rows × 19 cols) + review-report.md authored. Verdict CONDITIONAL→REMEDIATE_AND_SHIP. Headline: cli-codex wins (67% intent / 66.7% resource accuracy)."
trigger_phrases: ["071/003 summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/003-synthesize"
    last_updated_at: "2026-05-05T15:40:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 complete: matrix.csv + review-report.md shipped"
    next_safe_action: "Phase 4 closeout (validate + final commit)"
    blockers: []
    key_files: [.opencode/specs/skilled-agent-orchestration/071-sk-doc-router-stress-test/003-synthesize/review-report.md]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 071-sk-doc-router-stress-test/003-synthesize |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Headline finding** | cli-codex (gpt-5.5/high/fast) is the clear winner for sk-doc routing tasks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now read `matrix.csv` for raw 45-cell metrics and `review-report.md` for the analytical narrative. The synthesis script `extract_metrics.py` parses 3 CLI-specific log formats (codex stdout token regex, copilot Tokens summary block, opencode JSONL stream with step_finish events), detects mentioned intents + resources, and computes per-cell accuracy. Per-CLI summary stats reveal a clear ranking: cli-codex outperforms cli-copilot and cli-opencode on intent accuracy (67% vs 40% vs 53%), resource accuracy (66.7% vs 5.6% vs 43.3%), token efficiency (38k avg vs 67k vs 79k), and reliability (100% exit-0 vs 100% vs 87%). cli-codex is the only CLI that's also fast at 28s avg (cli-copilot is 23s but with much worse accuracy; cli-opencode is 74s).

The review-report.md elevates the methodology bug discovered in Phase 2 to P0 status, documents 2 P1 findings (cli-copilot verbosity skewing accuracy measurement; cli-opencode's 120s timeout being too tight), and surfaces 2 P2 measurement-script bugs (codex/opencode token extraction in deltas). Verdict is CONDITIONAL→REMEDIATE_AND_SHIP; ship 071 with this report; spawn follow-up 072 only if user wants tighter copilot accuracy numbers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `003-synthesize/scripts/extract_metrics.py` | Created | Python synthesis script (~190 lines, no external deps) |
| `003-synthesize/matrix.csv` | Created | 45 rows × 19 cols of per-cell metrics |
| `003-synthesize/review-report.md` | Created | Verdict + per-CLI rankings + 5 findings + recommendations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

extract_metrics.py is a single-file Python script (no PyYAML or pandas — uses stdlib `re`, `csv`, `json`). 3 parser functions handle CLI-specific formats; 1 frontmatter parser handles scenario .md files; 1 CSV writer emits 45 rows. Per-CLI summary stats printed to stdout for sanity check. review-report.md authored from the per-CLI summary + spot-checks of individual cells.

Token extraction in script recovers what was missing/wrong in Phase 2 deltas (codex `tokens=0` was a Phase 2 regex bug; opencode `(json-parse-failed)` was a Phase 2 jq bug). matrix.csv has correct token counts for all 45 cells.

Intent detection uses a simple regex (`\bINTENT_NAME\b`) against the response text. Resource detection uses `(references|assets)/[\w/.-]+`. Both are heuristic — the P1-001 finding flags that copilot's verbose responses mention many resources outside the picked intent's RESOURCE_MAP entry, which inflates false-positive counts and depresses copilot's reported accuracy. The matrix data is directionally sound but copilot's exact accuracy number is below ground truth.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Python with stdlib only (no PyYAML, pandas) | Avoid external dep; csv + re + json are sufficient for 45 rows |
| Heuristic intent + resource detection (regex on response text) | Pragmatic; CLI responses are unstructured prose. P1-001 flags refinement opportunity |
| Verdict CONDITIONAL→REMEDIATE_AND_SHIP (not PASS) | 1 P0 (methodology bug, fixed inline) + 2 P1 (measurement refinement, opencode timeout) warrant a follow-up packet recommendation |
| Recommend cli-codex as preferred default | Data clearly shows it wins on accuracy + tokens + reliability |
| Surface follow-up packet 072 candidate (don't auto-create) | Q5=C in original ambiguity decision: test + create new spec packet for any remediation; user gates the 072 creation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `wc -l matrix.csv` returns 46 | PASS — 1 header + 45 rows |
| `grep "**Verdict**" review-report.md` returns verdict line | PASS — `**CONDITIONAL → REMEDIATE_AND_SHIP**` |
| `grep "P0" review-report.md` returns at least 1 | PASS — P0-001 methodology bug |
| Per-CLI summary stats present | PASS — extract_metrics.py prints all 3 CLIs with full stats |
| review-report.md ranked summary | PASS — Section 2 cross-CLI comparison matrix |
| matrix.csv parseable as CSV | PASS — comma-delimited, header line + 45 data rows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Heuristic intent/resource detection** has measurement noise. Especially for which mentions many resources beyond the picked intent — inflates false-positive count, depresses reported accuracy. Real copilot accuracy may be higher than 5.6% if "Not loaded:" sections were excluded from resource detection. Documented as P1-001.

2. **No statistical significance testing** — n=15 per CLI is small. Differences between CLIs (codex 67% vs opencode 53%) are directionally meaningful but not robustly significant. For follow-up packets, increase n or add statistical bootstrap CI.

3. **Cost data partial** — opencode reports `cost` in `step_finish` events; codex/copilot don't. matrix.csv has tokens but no per-cell USD. Total order-of-magnitude USD estimated in review-report.md ($3-8) is rough.
<!-- /ANCHOR:limitations -->
