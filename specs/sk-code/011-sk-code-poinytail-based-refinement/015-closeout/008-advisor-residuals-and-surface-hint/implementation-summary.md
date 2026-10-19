---
title: "Implementation Summary"
description: "The three residual battery misses are closed with the rule that wins each, and the OpenCode advisor plugin now sends the workspace's sk-code surface as `surfaceHint`."
trigger_phrases:
  - "advisor residuals and surface hint implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/008-advisor-residuals-and-surface-hint"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-015-008-advisor-residuals-and-surface-hint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-advisor-residuals-and-surface-hint |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three residual battery misses are closed with the rule that wins each, and the OpenCode advisor plugin now sends the workspace's sk-code surface as `surfaceHint`.

### Phase 8: advisor-residuals-and-surface-hint

P4 (`Write a Vitest covering classifyPrompt() for the resume deep review phrase`) reaches system-deep-loop at 0.94 through the Python scorer's deep-routing layer, which fires on the literal `deep review`, and the native fusion applies the deep-review penalty to sk-code (0.84). N3, a real deep-review resume, depends on the same signal. P7 (`Add a packet-local helper that formats Gate 3 confusion-matrix rows ...`) is won on the CLI by system-spec-kit: sk-code scores 0.7186 against 0.6179, but primaryIntentBonus gives spec-kit the corpus-study bonus for `packet-local` and `confusion matrix`, a rule calibrated on the gate-3 routing study. P15 (`Add a --threshold flag to verify_alignment_drift.py ...`) names a script of the sk-code-skilled surface, and no scorer lane maps a script name to its skill, so sk-code sits at 0.72 behind sk-doc and sk-design at 0.82. Lifting any of the three means weakening a rule other probe sets rely on or adding a file index to the scorer for one probe, which the overengineering rule rejects. For the hint, the Claude and Codex hook briefs render no compiled targets, so a hint would change nothing they show. The OpenCode plugin knows the session directory and renders the compiled route line, so detectWorkspaceSurface reads that directory once, cached: OPENCODE inside a `.skilled` folder, OBSIDIAN for a `manifest.json` with `minAppVersion` or an `esbuild.config.mjs`, WEBFLOW for `src/2_javascript` or `wrangler.toml`, and nothing otherwise. The request carries `surfaceHint` only when one is found.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-skill-advisor.js` | Modify | Surface detection, request option |
| system-skill-advisor-plugin.vitest.ts | Modify | Five cases |
| `system-skill-advisor SKILL.md, changelog/v0.15.1.0.md, Hermes copy` | Modify, Create | Version 0.15.1.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests first: three of the four seeded workspaces failed before the plugin change. The fifth case, a folder inside the hub, was added with the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Root markers only | Grep-based markers from the detection reference would scan source trees before every uncached advisor call |
| No hint from Claude and Codex | Their brief shows no compiled targets, so the hint has no visible effect there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/system-skill-advisor-plugin.vitest.ts` | 3 of 4 surface cases failed before; 71 passed after |
| `npx vitest run` in the advisor runtime | 137 files, 1035 passed, 6 skipped |
| `advisor-battery.cjs` and `advisor-battery.py` | 15/17 and 14/17 with 0/5 false positives, the same winner per probe as the phase 001 baseline |
| `skill_advisor.py <probe> --force-native --show-rejections` for P4 and P15, and the CLI for P7 | the scores and rules quoted above |
| `package_skill.py system-skill-advisor --check --strict` | Result: PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. None.
<!-- /ANCHOR:limitations -->

---
