---
title: "Implementation Summary: Routing Regression Diagnosis and Disposition"
description: "The reproduced -2 on holdout top-1/top-3 and the delegation bucket was attributed to a stale hardcoded model-profiles path in the delegation scorer, orphaned by a mode-packet rename, and fixed in one line; all three metrics restored to their pins on a native worktree build with no re-pin."
trigger_phrases:
  - "routing regression diagnosis summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T12:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Diagnosed and fixed the routing regression"
    next_safe_action: "Proceed to phase 014"
    blockers: []
    key_files:
      - "diagnosis-results.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Caused, not inherited"
      - "Disposition is fix, not accept"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 3 |
| **Completion** | 100% — diagnosed, attributed, fixed, restored to pin |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reproduced measurement of the `-2` regression, a full attribution of it to a single root cause, and a one-line fix that restores every affected metric to its pinned value — with no baseline artifact re-pinned. The measurement detail and per-prompt enumeration live in `diagnosis-results.md`; the disposition and its alternatives in `decision-record.md` (ADR-004).

### Reproduction

The capture script (no `--write`) reproduced the drop against a corpus whose hashes are byte-identical to the pins: `holdout_top1` 51/72 (pin 53/72), `holdout_top3` 53/72 (pin 55/72), delegation 8/11 (pin 10/11); `full_corpus`, `ambiguity`, `review` and `memory_save` all held at their pins.

### Root cause

`loadFilesystemAliasData` in `lib/scorer/executor-delegation.ts` read the small-model registry from a hardcoded path `sk-prompt/prompt-models/assets/model-profiles.json`. Commit `9efb3fc5612` renamed that mode packet directory to `sk-prompt-models` without updating the scorer, so at HEAD `existsSync` was false, the model-alias table was empty, and `MiniMax-M3` and `Kimi` stopped routing to their `cli-opencode` executor. Exactly two prompts moved — no four-cancelling-to-two.

### The fix

One path literal, `prompt-models` → `sk-prompt-models`, plus a durable comment coupling it to the on-disk mode-packet directory so a future rename fails loudly. Confined to the one file named in scope.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Modified | Corrected the model-profiles registry path; added the coupling comment |
| `013-routing-regression-diagnosis/diagnosis-results.md` | Created | Durable measurement + per-prompt enumeration + attribution |
| `013-routing-regression-diagnosis/evidence/*.json`, `*.txt` | Created | Raw before-fix and after-fix captures with corpus hashes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduce → enumerate → bisect the two surfaces independently → attribute → fix → re-measure. The two changed surfaces (eighteen metadata files; three scorer sources) were separated by reverting only the scorer path while the metadata stayed at HEAD: the full drop closed, proving the metadata surface contributed zero. The worktree has no build toolchain (gitignored), so the fix was compiled natively by borrowing the shared toolchain via locally-excluded symlinks; the after-fix capture ran against the resulting worktree dist (`capturedAtSha: ba7e798843`). The capture was never run with `--write`; `002-baseline-capture/` is byte-identical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix, not accept | The cause is a stale path orphaned by a rename — a plain defect, not the deliberate trade-off that ADR-003 reserves accept for |
| Attribute by reverting one surface at a time | Reverting only the scorer path closed the whole drop, isolating the cause from the metadata surface without a confounded joint bisect |
| Treat the recorded baseline-sha capture as REQ-004's measurement | The pin's `capturedAtSha` is the baseline sha; a live rebuild there is infeasible (gitignored, untracked `package.json`) and redundant — recorded as spec Amendment A-001 |
| Verify natively rather than by dist proxy | Building the committed worktree source and capturing from its dist gives first-class evidence the fix compiles and behaves, not just that a patched literal would |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduce regression (capture, no `--write`) | `holdout_top1` 51/72, `holdout_top3` 53/72, delegation 8/11 — matched the spec figures |
| Corpus hashes vs pin | corpus `9f30cc..`, holdout `88a7f7..`, ambiguity `07cd2c..` — byte-identical, comparison valid |
| Changed prompts enumerated | Exactly two: `MiniMax-M3` and `Kimi`, both expected `cli-opencode` |
| Attribution | `executor-delegation.ts` stale path (rename `9efb3fc5612`); metadata surface contributed zero |
| Post-fix capture (native worktree dist) | `holdout_top1` 53/72, `holdout_top3` 55/72, delegation 10/11; full/ambiguity/review/memory_save unchanged |
| No other metric regressed | full 151/195, full-top3 176/195, ambiguity 17/24, review 24/31, memory_save 27/32 — all held |
| `002-baseline-capture/` untouched | `git status` clean for that folder; no `--write` ever run |
| `validate.sh <this-folder> --strict` | Errors:0 (below) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `delegate to codex` abstain miss is pre-existing and out of scope.** The pin was already 10/11 (one miss), and that miss is the codex case (expected `none`, predicted `cli-codex`). It is unchanged by this fix and is recorded for phase 018, not addressed here.
2. **The ratchet's own committed baseline remains stale.** `scorer-eval-baseline.json` is pinned to an older 200/78/25-row corpus and still fails its hash and count checks independently of this regression; wiring and re-baselining the ratchet is phase 014's scope, and this fix deliberately does not touch it.
3. **Operator sign-off is not a gate for a fix disposition.** ADR-003/CHK-020 require sign-off only when a regression is *accepted*; here it is fixed and fully restored, so the sign-off line is informational.
<!-- /ANCHOR:limitations -->
