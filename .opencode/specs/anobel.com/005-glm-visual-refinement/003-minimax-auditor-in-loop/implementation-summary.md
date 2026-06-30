---
title: "Implementation Summary: minimax-auditor-in-loop"
description: "Planning baseline for the minimax-auditor-in-loop phase. No code is written yet; this records the intended change, the key planning decisions, and the planning-doc validation state."
trigger_phrases:
  - "minimax auditor in loop summary"
  - "minimax auditor in loop status"
  - "003-minimax-auditor-in-loop planning baseline"
  - "a4 planning baseline"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/003-minimax-auditor-in-loop"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel refinements: re-sequence via FIX-type tally, audit-boolean routing"
    next_safe_action: "Tally the 18 FIX by defect-type; build standalone A4 only if justified"
    blockers:
      - "Hard predecessor: phase 001 gate + failure-JSON surface must ship first"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/a4-adapter.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-minimax-auditor-in-loop |
| **Completed** | Pending, planning baseline only (authored 2026-06-29) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing ships yet. This is the planning baseline for angle A4 (pipeline step 10): an in-loop MiniMax-M3 auditor whose free-text findings become typed fix-JSON that GLM-5.2 repairs in a failure-only round-2. The spec, plan, and tasks are authored and validated; implementation waits on phase 001.

### Planned change

The work adds a `classifyFixes` adapter and an `a4RepairContract` round-2 prompt to the existing 004 generation harness, wired behind an `A4_ARM` switch so the auditor runs only on round-1 FIX tiles. GLM stays the generator and MiniMax stays the auditor, so the model never grades its own output. The phase-001 deterministic gate is paired in to catch the overflow and contrast facts MiniMax can miss.

### Files Changed

None yet. Planned surface (per `plan.md`):

| File | Action | Purpose |
|------|--------|---------|
| `004-bento-visuals/research/inputs/a4-adapter.mjs` | Created (planned) | `classifyFixes` RC-regex classifier + `a4RepairContract` prompt builder |
| `004-bento-visuals/research/inputs/gen-tile.mjs` | Modified (planned) | A4 arm switch, failure-only round-2, `.r2-a4.html` + `.meta.json` outputs |
| `004-bento-visuals/research/inputs/a4-rescore.mjs` | Created (planned) | MiniMax rescore + 001 gate; round-2 audit rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The planning docs were validated with `validate.sh --strict`; implementation, the A/B run, and the FIX->SHIP measurement happen in a later session once phase 001 lands.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep generator and auditor as separate models | GLM-5.2 confabulates audits (invented a non-existent orange CTA and `#cccccc` text in vision-audit-benchmark.md §3), so MiniMax-M3 is the only trustworthy critique channel |
| Run round-2 failure-only | The 27 SHIP tiles need no repair; spending a second GLM call on them only adds cost and false-fix risk (iter-r2-A4, iter-r3 arms) |
| Pair MiniMax with the phase-001 deterministic gate | MiniMax false-negatived a subtle clip in the benchmark; the deterministic gate owns the hard overflow/contrast facts |
| Cap at 3 typed fixes per tile | Instruction density above the cliff causes omissions (IFScale), so the contract stays short and the rest moves into JSON/gates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | PASS expected at planning baseline (graph-metadata warning only; generate-description.js intentionally not run) |
| FIX->SHIP conversion on the 18 FIX tiles | PENDING, runs after implementation |
| `false_fix_rate <= 1/18` | PENDING, runs after implementation |
| T1 structured beats T0 generic | PENDING, A/B run after implementation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocked on phase 001.** The adopt-if gate cannot verify geometry or contrast until phase 001 ships the deterministic gate and the failure-JSON measurement surface.
2. **Marginal contribution is uncertain.** A4 converts 5-7 tiles standalone but only +1-3 net within the integrated pipeline once A1/A3 capture the overflow and title wins; whether the added latency is worth it is an open question carried in `spec.md`.
3. **Adapter is regex-based.** Free-text issue strings can be misclassified; raw evidence is kept in the JSON and failed fix IDs are logged as the mitigation.
<!-- /ANCHOR:limitations -->
