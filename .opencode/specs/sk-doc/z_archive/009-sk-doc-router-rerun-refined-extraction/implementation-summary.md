---
title: "Implementation Summary: 072 Refined Extractor + Re-extraction"
description: "extract_metrics_v2.py + matrix_v2.csv + review-report-v2.md shipped. New finding: cli-copilot HALLUCINATES resource paths (cites nonexistent files). Qualitative ranking from 071 holds: cli-codex > cli-opencode > cli-copilot."
trigger_phrases: ["072 summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/060-sk-doc-router-rerun-refined-extraction"
    last_updated_at: "2026-05-05T16:10:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "072 final: matrix_v2 + review-report-v2 shipped; ready to commit + push"
    next_safe_action: "(packet final after commit + push)"
    blockers: []
    key_files: [.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-doc-router-rerun-refined-extraction/review-report-v2.md]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "072-complete"
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
| **Spec Folder** | 072-sk-doc-router-rerun-refined-extraction |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Predecessor** | 071-sk-doc-router-stress-test (commit 46a63f9c1) |
| **Headline** | cli-copilot hallucinates resource paths (NEW finding from refined extraction) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now read `matrix_v2.csv` for refined per-cell metrics on the same 45 cells captured in 071, plus `review-report-v2.md` for the v1-vs-v2 delta analysis. The big new finding: cli-copilot doesn't just over-list resources verbosely (071's hypothesis) — it actively HALLUCINATES file names that don't exist in sk-doc's actual filesystem. Spot-check on SD-001 (DOC_QUALITY) shows copilot citing `dqi_rubric.md`, `dqi_checklist.md`, `dqi_score_template.md` — none of which exist in `.opencode/skills/sk-doc/`. cli-codex and cli-opencode stick to real paths under `references/global/` and `assets/documentation/`.

The v2 extractor combined two heuristic improvements: (1) skip paragraphs that lead with negative markers ("Not loaded:", "would NOT load", etc.) and (2) match basenames in addition to full paths — many CLIs cite resources as bare `foo.md` after a `References (references/):` section header rather than as full paths. The basename-matching change moved the needle on copilot accuracy (5.6% → 11.1%) and opencode accuracy (43.3% → 47.2%); cli-codex was already using full paths so its number was unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `072/scripts/extract_metrics_v2.py` | Created | Refined extractor (~210 lines) |
| `072/matrix_v2.csv` | Created | 45 rows × 19 cols |
| `072/review-report-v2.md` | Created | Verdict + v1-vs-v2 deltas + hallucination finding |
| `072/{spec,plan,tasks,implementation-summary}.md` | Created | Packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Iteration on 071's extract_metrics.py. First v2 attempt only added negative-segment filtering — produced near-identical numbers because the bigger gap was basename mismatch. Sampled SD-001/copilot.log directly: copilot's response uses `core_standards.md` (basename), not `references/global/core_standards.md` (full path), so v1's path-only regex never matched. Refined v2 to extract bare filenames and compare against basename(expected_resources). Re-run produced corrected numbers: copilot 11.1%, opencode 47.2%, codex 66.7% (unchanged).

The hallucination discovery was a side effect of looking at copilot's actual response text for the basename-matching fix. Once the matcher was fair, copilot's mentions of `dqi_rubric.md`/`dqi_checklist.md`/etc. became visible as false positives. A quick `find .opencode/skills/sk-doc -name 'dqi_*'` confirmed those files don't exist.

No new matrix dispatches: 072 read-only-consumed 071's logs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Iterate on 071's extractor (not rewrite from scratch) | 071's parser logic is sound; only detect_resources() needed refinement. Reuse keeps the matrix schema consistent for direct v1-vs-v2 comparison |
| Basename matching, not just full paths | Spot-check revealed CLIs cite resources by basename after section headers. Full-path-only matching produced false 5.6% accuracy for copilot |
| Negative-segment filter (paragraph-level, leading-marker check) | Catches "Not loaded:" enumerations that 071's matcher captured as false positives. Effect is small (FP went from 4.33 → 3.73 for copilot) but right direction |
| File hallucination flagged as P1-072-001, not P0 | It's a model behavior issue, not a sk-doc router defect. Mitigation is already in 071's recommendation (prefer cli-codex). 072 sharpens the recommendation by making the hallucination signature explicit |
| Single Level-1 packet (no phase decomposition) | Scope is narrow: 1 script + 1 csv + 1 report. Phase decomposition would be over-engineering |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| extract_metrics_v2.py runs without error | PASS — produced 45 rows |
| `wc -l matrix_v2.csv` returns 46 | PASS |
| Per-CLI v2 numbers differ from v1 in expected direction | PASS — copilot +5.5pp, opencode +3.9pp, codex unchanged |
| review-report-v2.md verdict line present | PASS — `**PASS hasAdvisories=true**` |
| Hallucination finding documented | PASS — P1-072-001 with SD-001 spot-check evidence |
| No router code changes | PASS — sk-doc/SKILL.md unmodified |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **detect_resources_v2 still imperfect** — markdown bullet list parsing could be tighter (P2-072-001 follow-up). Current heuristic catches most cases but bare-filename regex could over-match (e.g., `foo.md` mentioned in narrative prose without intent of routing). Acceptable for cross-CLI comparison; would need refinement for absolute-accuracy claims.

2. **No statistical bootstrap** — n=15 per CLI is small. Differences (codex 67% vs opencode 53% vs copilot 40%) are directionally meaningful but not formally significant. Future packet candidate.

3. **OPTIMIZATION + INSTALL_GUIDE intent coverage gap** carries forward from 071. 072 doesn't address it. Future packet candidate.

4. **Hallucination behavior is provider/model-specific** — claude-opus-4.7's behavior on sk-doc's "DQI" terminology may not generalize to other Anthropic models. Result captures this session's data; broader claim about "cli-copilot always hallucinates" needs more samples.
<!-- /ANCHOR:limitations -->
