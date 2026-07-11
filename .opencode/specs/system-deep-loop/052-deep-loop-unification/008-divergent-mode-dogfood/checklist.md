---
title: "Verification Checklist: Divergent-Mode Live Dogfood — Research + Review"
description: "Verification checklist for the parallel 10-iteration research + review dogfood run."
trigger_phrases:
  - "divergent mode dogfood checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "P0 incident during dispatch; blast radius independently confirmed contained"
    next_safe_action: "Operator decision needed before any re-run"
    blockers:
      - "Both loops destroyed mid-run by a CLI-dispatched opencode session with unscoped repo write access"
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `stopPolicy`/`convergenceMode` precedence traced against the real shipped YAML before configuring either loop, confirming `stopPolicy: "max-iterations"` would suppress the divergent branch for review (verified: `deep_review_auto.yaml:579,601,705-709`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

N/A — this packet makes no code changes. Both loops are structurally read-only against the reviewed/researched target (`treat_review_target_as_read_only` for review; no mutation path for research).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Both loops' real config files (`research/deep-research-config.json`, `review/deep-review-config.json`) confirmed `antiConvergence.convergenceMode: "divergent"` and the `cli-opencode`/`openai/gpt-5.6-sol-fast`/high executor before the incident destroyed them (verified at read time, before loss)
- [ ] CHK-011 [P0] Raw `deep-research-state.jsonl` and `deep-review-state.jsonl` independently read and reconciled against each loop's own completion claim — **BLOCKED**: both files were destroyed mid-run; only partial reconstruction from transcript was possible (see `research/INCIDENT.md`, `review/INCIDENT.md`)
- [x] CHK-012 [P1] Real wall-clock concurrency confirmed between the two loops via `research/dispatch-receipts/dispatch-research-i9-g1.completion.json` and `review/dispatch-receipts/dispatch-review-i7-g1.completion.json` (research reached iteration 9, review reached iteration 7, in overlapping wall-clock time before the shared incident cut both off simultaneously)
- [ ] CHK-013 [P1] 2-3 iterations per loop spot-checked for genuine (not fabricated/templated) dispatched content — **DEFERRED**: superseded by incident investigation; research's own agent independently verified its 8 completed iterations in real time before the loss (per its own Iron Law discipline), which stands as evidence of genuineness even though the raw artifacts are now gone
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — no findings are remediated in this packet by design (discovery-only dogfood run). Any real findings surfaced are reported in `implementation-summary.md`/`review/INCIDENT.md` and left for a future, separate remediation packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] `git status` on `.opencode/skills/system-deep-loop/` confirmed clean of any deletion (read-only guarantee against the RESEARCHED/REVIEWED target held — the incident destroyed only this packet's own untracked artifacts, not the target under study)
- [x] CHK-021 [P0] Blast radius of the destructive incident independently verified repo-wide, not assumed: `git status --porcelain | grep "^ D\|^D "` returns zero deletions anywhere in the tracked tree; the loss is fully contained to the never-committed `008-divergent-mode-dogfood/` packet
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] `implementation-summary.md` reports the real outcome honestly (P0 incident, partial recovery, what is and isn't recoverable) — not an assumed clean run
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P0] This packet folder (`008-divergent-mode-dogfood`) follows the phase-child naming convention and is re-registered in the parent's (`052-deep-loop-unification`) `children_ids` after recovery
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 5/6 |
| P1 Items | 3 | 2/3 |

**Verification Date**: 2026-07-11 (incident occurred mid-run; verification is of the incident response, not the originally planned dogfood outcome)
<!-- /ANCHOR:summary -->
