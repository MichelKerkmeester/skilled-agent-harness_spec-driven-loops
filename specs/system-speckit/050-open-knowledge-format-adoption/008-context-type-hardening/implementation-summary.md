---
title: "Implementation Summary: Phase 8: context-type-hardening"
description: "Both contextType and importance_tier warnings caught every planted off-list value with no false alarm, the corpus raised none, and no generator seeds an off-list value; cold model writers pick an off-list contextType in 8 of 30 docs."
trigger_phrases:
  - "context type hardening summary"
  - "planted matrix result"
  - "off-list rate result"
  - "model writer off-list rate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening"
    last_updated_at: "2026-10-04T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Measured both warnings four ways"
    next_safe_action: "None for this phase; the parent closes after phases 009 and 010"
    blockers: []
    key_files:
      - "measurement-protocol.md"
      - "scratch/matrix-result.json"
      - "scratch/corpus-result.json"
      - "scratch/generator-seeds.json"
      - "scratch/model-writers-result.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 8: context-type-hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-context-type-hardening |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two warnings on `contextType` and `importance_tier` now carry measured numbers instead of a claim. Both caught all 180 planted off-list values and raised nothing on the 1,008 rows that should pass. Across 22,754 existing docs they printed no warning at all, and no template or command asset seeds an off-list value. The one place off-list values do appear is a fresh writer with no template: Luna 6 picks one in half its docs.

### Phase 8: context-type-hardening

This phase changed no product code. It fixed a dated protocol first, then measured the spec-kit rule `FRONTMATTER_VALUES` (W1) and sk-doc `validate_document.py` (W2) four ways. No measurement found a defect, so no fix, regression test or D1 rerun was triggered: the protocol makes the D1 rerun conditional on a fix landing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `measurement-protocol.md` | Created | Sets, sizes, seed 20261004 and thresholds, fixed at 2026-10-04T12:22Z before any result file |
| `scratch/matrix.py`, `scratch/matrix-result.json` | Created | Planted matrix of 1,188 docs and its scores |
| `scratch/corpus.py`, `scratch/corpus-result.json` | Created | False-alarm sweep over every tracked doc with frontmatter |
| `scratch/generator-seeds.raw.txt`, `scratch/generator-seeds.json` | Created | Every literal seed in the generators and its list status |
| `scratch/model-writers/`, `scratch/model-writers-score.py`, `scratch/model-writers-result.json` | Created | 30 cold-written docs and their scores |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each number below comes from a script in `scratch/` run once, after the protocol's file time.

**Planted matrix** (`python3 scratch/matrix.py`). 44 values (4 canonical, 9 alias and 10 off-list `contextType`; 6 canonical, 5 alias and 10 off-list `importance_tier`) crossed with three quotings, three letter cases and three positions gives 1,188 docs, of which 180 should warn. W1 and W2 each scored 180 true positives, 0 false positives, 0 misses and 1,008 true negatives: recall 100% (Wilson 95% 97.9–100%) and specificity 100% (99.6–100%). Rows 0012, 0300–0302, 0351, 0352 and 1161 were rerun through the real CLIs and matched.

**Corpus** (`python3 scratch/corpus.py`). 22,754 tracked docs with a frontmatter block under `specs/` (no `z_archive/`) and `.skilled/skills/`: W1 printed 0 warnings in 12.3 s, W2 printed 0 in 11.5 s. With no warning there is nothing to list by cause; the false-alarm rate is 0 (Wilson upper bound 0.02%).

**Generators** (`rg -n "(contextType|importance_tier):\s*\S"` over the create assets, speckit assets and spec-kit templates). 90 literal seeds, 45 per key, 0 off-list (Wilson 0–4.1%; per key 0–7.9%).

**Model writers** (`python3 scratch/model-writers-score.py <repo>`). The protocol brief, 10 fixed topics, run from an empty folder so no repository template or value list reached the model:

| Model | Route | Off-list `contextType` | Wilson 95% | Off-list `importance_tier` | Fenced output |
|---|---|---|---|---|---|
| DeepSeek V4.1 Flash max | cli-opencode, `opencode-go` | 1/10 (`development`) | 1.8–40.4% | 0/10 | 3/10 |
| Luna 6 max fast | cli-codex | 5/10 (`design`, `guideline`, `procedural`, `process`, `workflow`) | 23.7–76.3% | 0/10 | 0/10 |
| SWE 2 max | cli-devin | 2/10 (`chore`, `feature`) | 5.7–51.0% | 0/10 | 7/10 |
| All three | | 8/30 | 14.2–44.4% | 0/30 (0–11.4%) | 10/30 |

No run failed, so none counts as missing. Ten docs came back wrapped in a ` ```markdown ` fence; their values were read after unwrapping, and W1 on the raw files warned on 7 docs, because a fenced file shows the checker no frontmatter.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the model writers from an empty folder | The protocol measures cold behavior, and inside the repository each CLI would load AGENTS.md and could read the templates |
| Pass Devin `--respect-workspace-trust false` | Devin refuses an untrusted folder in print mode; the first two attempts failed in under a second and are kept as `runs-attempt1.log` and `runs-attempt2.log` |
| Count fenced docs by their unwrapped value | The protocol measures the value a writer picks; what the checker sees is reported beside it |
| Make no source change | No measurement found a defect, and the protocol ties a fix and the D1 rerun to a measured defect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Protocol precedes data | PASS. Protocol sha256 `9dde5cd11e235d2b…` unchanged; file time 12:22:43Z, first result file 12:24:27Z |
| Matrix recall and precision, W1 and W2 | PASS. 180/180 and 0 false positives each; threshold 100% |
| Corpus false alarms | PASS. 0 warnings over 22,754 docs; threshold no unexplained warning |
| Generator off-list rate | PASS. 0/90; threshold 0 |
| Model-writer rates | Reported, no threshold. 8/30 `contextType`, 0/30 `importance_tier` |
| Regression tests | `npx vitest run --config ../../vitest.config.ts --project cli` in `runtime/cli`: 160 files, 1,670 tests passed, 0 failed, 19 skipped |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ten docs per model is a small sample.** The intervals are wide (Luna 23.7–76.3%); they say a cold writer trips the warning often, not how often to within ten points.
2. **The warning cannot see a fenced file.** 10 of 30 cold docs were wrapped in a code fence. A writer that does this escapes both checks, and that is outside what a frontmatter check can know.
3. **Each model writer ran once per topic.** Cold sampling at max effort is not deterministic, so a rerun can give different values.
<!-- /ANCHOR:limitations -->
