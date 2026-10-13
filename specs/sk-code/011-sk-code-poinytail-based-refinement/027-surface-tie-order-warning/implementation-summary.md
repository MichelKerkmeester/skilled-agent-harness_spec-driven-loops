---
title: "Implementation Summary: Surface tie order warning"
description: "The parent-skill doctor now reports, as check 5l, a sk-code surface that a user placed by hand after sk-code-opencode in tieBreak, unless it is one of the two shipped examples, and names the fix."
trigger_phrases:
  - "surface tie order warning implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning"
    last_updated_at: "2026-10-13T16:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and closed the phase"
    next_safe_action: "Operator merges worktrees/131-tieorder-warning to main after review"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Surface tie order warning

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-surface-tie-order-warning |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
| **Branch** | `worktrees/131-tieorder-warning`, from origin/main c62d7d1399 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

If you edit `.skilled/skills/sk-code/hub-router.json` by hand and list your own surface after `sk-code-opencode` in `routerPolicy.tieBreak`, the doctor now tells you. Before this phase that surface lost every keyword tie to the native surface and every check passed.

### Check 5l

`checkNativeSurfaceLast` in `.skilled/commands/doctor/scripts/parent-skill-check.cjs` runs on the sk-code hub only, right after 5i. It finds `sk-code-opencode` in `tieBreak` and lists each surface mode after it that is not `sk-code-obsidian` or `sk-code-webflow`. Any such mode is a soft failure:

```
FAIL: 5l: tieBreak places surface(s) [sk-code-acme] after the native surface "sk-code-opencode", so they lose every keyword tie to it; move them ahead of "sk-code-opencode" in routerPolicy.tieBreak, or re-add them with /create:skill-parent update --surfaces
```

With none, it prints `PASS: 5l: tieBreak places no added surface after the native surface "sk-code-opencode"`. Under `PARENT_HUB_CHECK_STRICT=0` the failure prints as WARN. A tree without `sk-code-opencode` and every other hub print no 5l line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Check 5l with its two constants; the section heading names 5a-5l |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | `addNamedSurfaces` and four 5l tests |
| `README.md` | Modified | One sentence in the sk-code guide's "Add your own surface" step 1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every edit outside this folder came from DeepSeek V4.1 Flash at max through cli-devin (`deepseek-v4-1-flash-max`), one literal change per brief, each diff read before commit. Devin accepted the worktree and never ran out of quota, so the cli-pi fallback was not needed.

Commits: `a682c06d3d` (build), `c69ada168f` (review fix and review packet), and the closeout commit that carries this file.

### Tests

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | 5l fails when a hand-added sk-code surface sorts after sk-code-opencode | before: fail | after: pass |
| T2 | 5l passes on the shipped sk-code order, with both examples after sk-code-opencode | before: fail | after: pass |
| T3 | 5l passes when the examples are removed and an added surface sorts ahead of sk-code-opencode | before: fail | after: pass |

The three ran against the checker from `c62d7d1399` (copied aside, run, restored): T1 failed with `expected "FAIL: 5l: ...sk-code-acme"`, T2 and T3 with `expected "PASS: 5l:"`. After the build all three pass. The review added a fourth, `5l prints nothing on an sk-code tree whose tieBreak has no sk-code-opencode`, under RV-3.

### Review

A five-iteration `/deep:review :auto` ran over `c62d7d1399..a682c06d3d` on cli-devin `deepseek-v4-1-flash-max`, single-executor path, stop policy `max-iterations`. Verdict PASS with advisories: 0 P0, 0 P1, 6 P2. Artifacts are in `review/`.

| ID | Sev | Disposition | Proof or reason |
|----|-----|-------------|-----------------|
| RV-1 | P2 | Fixed | R1-P2-002: the T1 assertion now also matches `move them ahead of "sk-code-opencode"` and `/create:skill-parent update --surfaces`; with the message trimmed, T1 fails (`c69ada168f`) |
| RV-2 | P2 | Rejected | R1-P2-001: dropping the sk-code basename gate changes no output on a hub without `sk-code-opencode`, because the `nativeAt < 0` return still fires, so the claimed regression cannot occur; RV-3 pins that return. A clean-fixture absence assertion was tried and removed because that mutation left it green |
| RV-3 | P2 | Fixed | R3-P2-001: a new test asserts no 5l line on an sk-code tree without `sk-code-opencode`; with the early return removed, it fails (`c69ada168f`) |
| RV-4 | P2 | Rejected | R2-P2-001: `hub-router.json` is repository config at the checker's own trust level, the exit code is unaffected, and 5b, 5c, 5d, 5e, 5f and 5i interpolate config strings the same way, so a sanitiser belongs in the shared emit helpers as its own change |
| RV-5 | P2 | Rejected | R4-P2-001: two copies of a one-line `packetKind` map are not a pattern; each check stays self-contained, as the file's other checks are |
| RV-6 | P2 | Rejected | R5-P2-001: every 5l assertion reads only the 5l line, and an sk-code fixture stays red from 5k-canary whatever the helper writes, so canon-cleaning it adds writes no assertion reads |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Native and example names are constants in the doctor (ADR-001) | Three fixed names on one hub do not earn a registry field that the scaffold, the schema references and every hand-editing user would have to keep right |
| `softFail`, like 5e and 5i (ADR-002) | A WARN exits 0, so the README's verify step, which says the sk-code doctor must exit 0, would pass and the gap would stay silent |
| Surface modes only | 5i already reports a workflow mode out of order; 5l never double-reports it |
| One README sentence | Step 1 covered only the update command; a hand edit had no instruction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Invariants suite | 103 of 103 (baseline 99 of 99) |
| Seven hub doctors | All exit 0 (baseline all exit 0); the only new line is `PASS: 5l` on sk-code |
| Mutations | Trimmed message fails T1; dropped early return fails the RV-3 test |
| `/deep:review :auto`, 5 iterations | PASS; 0 P0, 0 P1, 6 P2; three fixed, three rejected. See `review/review-report.md` |
| Gate battery | Listed in `goal.md`'s log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Renaming the native or an example surface means editing two constants.** The README tells users to keep `sk-code-opencode`, and a rename touches many other files anyway.
2. **The review's graph-convergence rows are not in its state log.** `convergence.cjs` ran before every iteration, but the append gateway refused the hand-built event for its payload shape. Under stop policy `max-iterations` those rows decide nothing.
<!-- /ANCHOR:limitations -->
