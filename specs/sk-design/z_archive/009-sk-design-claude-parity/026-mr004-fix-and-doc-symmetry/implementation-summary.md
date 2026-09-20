---
title: "Implementation Summary"
description: "Closed out every remaining item from the post-024 fresh audit: fixed MR-004's live-daemon advisor conflict, fixed AI-004's pre-existing negation-matching bug, applied both declined doc-symmetry findings, and aligned sk-design's version numbers with a changelog entry. One new small finding (audit-mode Bash usage) surfaced and flagged, not fixed."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 026 implementation summary"
  - "MR-004 fix summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/026-mr004-fix-and-doc-symmetry"
    last_updated_at: "2026-07-08T03:36:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mr004-fix-doc-symmetry-026"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-mr004-fix-and-doc-symmetry |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 025 closed `PB-002` but left 4 items open or explicitly declined: `MR-004`'s newly-discovered live-daemon-path advisor conflict, `AI-004`'s pre-existing negation-matching bug, and two "fix-now, improvement" findings from the fresh audit (parent version-number alignment, the transform-verb-precedence doc-symmetry gap). This phase closed all 4, reusing the `graph-metadata.json` fix pattern phase 025 established for the advisor-routing fix and applying targeted, low-risk edits for the rest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/graph-metadata.json` | Edited | `intent_signals` += `"design slop"`, `"anti-slop UI audit"`, `"contrast and keyboard focus"` (MR-004 fix) |
| `.opencode/skills/sk-design/SKILL.md` | Edited | Removed bare `design-review` keyword (AI-004 fix); added `harden`/`polish` transform-verb-precedence exception to the `audit` guardrail bullet; version 1.4.2.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/mode-registry.json` | Edited | `transformVerbRouting.note` extended with the `taskProjections`-vs-`excludedAliases` layering clarification; version 1.4.0.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/hub-router.json` | Edited | Version 1.4.0.0 → 1.4.3.0 (alignment only) |
| `.opencode/skills/sk-design/description.json` | Edited | Version 1.4.2.0 → 1.4.3.0 |
| `.opencode/skills/sk-design/changelog/v1.4.3.0.md` | Created | Net-cumulative changelog entry covering v1.3.0.0 through v1.4.3.0 |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md` | Edited | Fresh audit's remaining items closed out; new `Bash`-usage finding flagged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Started with the cheap, low-risk items: the `taskProjections`-vs-`excludedAliases` layering note (extended `mode-registry.json`'s existing free-text `note` field, confirmed no validator constrains its content), the mirrored `harden`/`polish` exception on the `audit` guardrail bullet (matching the exact precedence-language pattern the `foundations` bullet already used for `typeset`/`colorize`), and version alignment across all 4 files plus a changelog entry summarizing the substantial net change across phases 013-025 since the changelog's last entry (v1.2.0.0).

For `AI-004`'s bug, traced the false match to a single bare `design-review` keyword in `SKILL.md`'s Keywords comment matching even inside a negation clause ("...not a... design review"). Considered adding negation-awareness to the shared keyword-matching function but rejected it as too broad a blast radius — that function serves every skill in the system, not just sk-design. Confirmed 4 more specific existing keywords (`design-quality-audit`, `design-qa`, `audit-the-design`, `review-the-ui`) already cover the legitimate "design review" intent, so removed the redundant, risky one. Verified both directions: `AI-004`'s prompt now resolves `sk-code` (0.8814, was `sk-design` 0.95), and a genuine "do a design review of this landing page" prompt still resolves `sk-design` (0.9096) — confirmed via the live daemon path in both cases, not just the local fallback.

For `MR-004`, re-tested the exact scenario prompt first and confirmed it still failed exactly as phase 025's regression sweep found (`sk-code` 0.8719 top-1). Applied the same fix pattern phase 025 used for `PB-002`: iteratively added design-scoped `intent_signals` phrases to `graph-metadata.json`, re-testing after each addition. The first addition (`"design slop"`, `"anti-slop UI audit"`) only produced a 0.0016 margin — technically a win but not a robust one, the kind of gap that gets flagged `ambiguous` by the scorer's own tolerance, exactly as `MR-004` had been flagged before. A second addition (`"contrast and keyboard focus"`) pushed the margin to a stable 0.032, confirmed across 3 repeated calls. Regression-checked `AI-002`, `AI-004`, `PB-002`, and an unrelated mode-routing prompt — all clean.

Dispatched a live re-verification through the real orchestrator to confirm downstream behavior, not just the isolated advisor number. This surfaced a genuine testing-methodology complication: the live dispatch's own internal `mk_skill_advisor_advisor_recommend` tool call echoed the dispatch-recipe's addendum text ("standalone evaluation call, not a tracked change...") into its own query, pulling `sk-doc` into contention as an unrelated confound and making that specific run's advisor-tool-call result inconclusive for grading purposes. Rather than treating this as a fix failure, distinguished it clearly: the standalone probe on the literal, unpolluted scenario prompt (which is what `MR-004`'s own "advisor probe" methodology step specifies, separately from the live dispatch) is unambiguous and repeatable, and the live dispatch's downstream behavior (mode resolved to `sk-design`/`audit`, packet `design-audit` loaded, all 5 expected mode resources cited, a findings-first evidence-bounded report matching the PASS shape) was fully correct despite the advisor-tool-call confound. This is documented explicitly, not silently smoothed into an unqualified PASS.

That same verification also surfaced a small, new, previously-undiscovered finding: the `audit` mode's live dispatch made 2 non-mutating `Bash` calls (`node -e` WCAG contrast-ratio computations) despite `mode-registry.json` explicitly forbidding `Bash` for `audit` (`forbidden: [Write, Edit, Bash]`, `bashAllowlist: []`). This doesn't trip `MR-004`'s own literal FAIL clause (the calls were non-mutating, not "mutating tools are used"), but it's a genuine tool-surface deviation. Flagged in `verdict-matrix.md` rather than fixed — investigating whether this needs a registry change, a stronger prose rule, or is acceptable model-initiative computation is out of this phase's scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Iterate the `graph-metadata.json` fix until the margin was decisive, not just directionally correct | The first addition's 0.0016 margin would likely still be flagged `ambiguous` by the scorer — the same failure mode `MR-004` originally had; stopping there would have been a false claim of "fixed" |
| Treat the standalone probe on the literal prompt as authoritative when the live dispatch's own advisor-tool-call was confounded | The confound (dispatch-recipe addendum text leaking into the model's own tool-call construction) is a property of this session's testing recipe, not of the fix under test; `MR-004`'s own methodology treats the advisor probe and the live dispatch as separate checks, and the probe check is unambiguous |
| Remove the `design-review` keyword rather than add negation-awareness to the shared matcher | The shared keyword-matching function serves every skill in the system; a narrow, low-priority, sk-design-scoped bug does not justify a system-wide algorithm change with unknown regression surface across every other skill |
| Surface the new `audit`-mode `Bash`-usage finding without fixing it | Genuinely new, discovered as a side effect of this phase's own verification work, not part of the original scope; fixing it would need its own investigation into intent (model initiative vs. a resource implicitly condoning it) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| MR-004 standalone probe (literal prompt) | `sk-design` 0.9078 vs `sk-code` 0.8761, stable across 3 repeats |
| MR-004 live re-dispatch (downstream behavior) | Correct mode/packet/resources/report; advisor-tool-call confounded by dispatch-recipe artifact, documented not absorbed |
| AI-004 standalone probe | `sk-code` 0.8814 top-1 (was `sk-design` 0.95) |
| Legitimate design-review prompt regression | `sk-design` 0.9096 top-1, unaffected |
| Regression: AI-002 | `sk-code` 0.913, clean |
| Regression: PB-002 | `sk-design` 0.9094, clean |
| Regression: TV-004 mode-level | `sk-design` 0.82 (top-level advisor check), unaffected |
| Version alignment | All 4 files confirmed at 1.4.3.0 |
| `opencode.json` mutation check | Clean (SHA-256 identical) |
| `git status --porcelain` | Diff attributed to a confirmed-unrelated concurrent session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The new `audit`-mode `Bash`-usage finding is documented but not fixed.** Two non-mutating `node -e` calls occurred during a live `MR-004` dispatch despite `audit`'s registry forbidding `Bash`. Whether this needs a registry/prose fix or is acceptable is not decided here.
2. **`MR-004`'s live-dispatch advisor-tool-call confound was not independently re-tested with a different addendum wording** to confirm whether a differently-worded dispatch note would avoid the `sk-doc` pollution. The standalone-probe evidence was judged sufficient without spending further verification cycles on this.
3. **The full 56-dispatch playbook has still not been re-run end-to-end** to confirm the Tier-3 release verdict has moved from `NOT READY` — every fix across phases 024-026 has been verified at the individual-scenario level, not via a full re-run. A separate future phase would be needed for that.
<!-- /ANCHOR:limitations -->
