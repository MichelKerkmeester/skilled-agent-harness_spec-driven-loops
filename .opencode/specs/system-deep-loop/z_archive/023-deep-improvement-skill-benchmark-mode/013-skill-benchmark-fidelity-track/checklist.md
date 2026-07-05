---
title: "Verification Checklist: Skill-Benchmark D3/D4 Fidelity Track"
description: "QA checklist for the fidelity-track build: intent synonyms holding the D2 floors, the deferred-asset lane, the two-number D4 split, the D4-R task-outcome run, schema v1 preservation, and honest real-vs-artifact labelling."
trigger_phrases:
  - "skill-benchmark fidelity track checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Implement, then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-fidelity-track"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill-Benchmark D3/D4 Fidelity Track

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- Suite: `cd .opencode/skills/deep-improvement/scripts && npx vitest run` (251 + new).
- Replay: `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router --outputs-dir <dir>` (synonym D2 floors).
- D4-R: `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode live --d4 --scenarios LS-001,LS-002,LS-003,LS-004,SD-002` (paid; opt-in).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-01 [P1] Baseline diffed against `router-final`; schema v1 fields inventoried before the additive changes.
- [x] CHK-02 [P1] 011 round-2 recommendation (§16) re-read; the two-number D4 contract confirmed (never collapse hallucination + task-outcome).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-03 [P1] New report fields are additive (`advisorySignals` block + per-row `assetRecall`/`d4TaskOutcome`); `schemaVersion: skill-benchmark-report.v1` unchanged.
- [x] CHK-04 [P1] No spec-folder paths / packet ids / finding ids in code comments — scanned all 6 changed code files, clean.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-05 [P0] Full vitest suite green (295/295, 24 files; +5 new: asset lane, D4-R, advisory aggregate).
- [x] CHK-06 [P1] `sk-code-router-sync.vitest.ts` drift guard green (4/4).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-07 [P0] **REQ-001** D4-R integrated (opt-in `--d4` → `augmentWithD4R`); `D4_task_outcome` advisory, separate from `D4_hallucination`; run on LS-001/002/003/004 + SD-002 → aggregate **54/100**, per-scenario evidence in `sk-code/benchmark/d4r-live/`.
- [x] CHK-08 [P0] **REQ-002** `expectedAssets` scored as a separate `assetRecall` (router: deferred + visible; live: recall lane); D3 stays stated-reference efficiency; un-merge removes the stated-asset D3 waste artifact.
- [x] CHK-09 [P1] **REQ-003** synonyms recognize the CS-001/SD-001 wording; D2 rises with no floor breach. Evidence: SD-001 D2 0.455→0.636, CS-001 D2 0.200→0.500, 0 regressions/24, drift 4/4, suite 251/251.
- [x] CHK-10 [P0] **REQ-004** suite 295/295 + drift 4/4 green; `skill-benchmark-report.v1` preserved (advisory fields additive).
- [x] CHK-11 [P1] **REQ-005** real-vs-fidelity labelled: synonyms = real recall gain; asset lane + un-merge = fidelity fix; D4-R = the real usefulness instrument replacing the artifact 49.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-12 [P2] D4-R skill-off keeps the contamination guard (hook disabled + `observedReads==0`, else the pair is dropped `unscored`); no fabricated score (absent data renders `unscored`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-13 [P2] `sk-code/benchmark/d4r-live/README.md` documents the D4-R instrument, the n=5 result, the two-number split, and reproduction.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-14 [P2] Changes confined to the skill-benchmark harness (5 `.cjs`) + the new grader prompt + sk-code INTENT_SIGNALS; live result artifact under `sk-code/benchmark/d4r-live/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
- Complete. Synonyms held D2 floors (0 regressions/24); `assetRecall` scored + un-merge fixes the D3 artifact; real `D4_task_outcome` 54/100 over n=5; suite 295/295 + drift 4/4 green; schema v1 intact. CHK-12/14 (security/file-org) hold by construction (pure scoring logic; changes confined to the harness + grader prompt + INTENT_SIGNALS).
<!-- /ANCHOR:summary -->
