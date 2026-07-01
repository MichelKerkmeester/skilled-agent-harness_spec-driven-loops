---
title: "Changelog: Phase 10: security-and-correctness-fixes [032-goal-opencode-plugin/010-security-and-correctness-fixes]"
description: "Chronological changelog for the security and correctness remediation phase of the /goal plugin."
trigger_phrases:
  - "phase changelog"
  - "goal plugin security fixes"
  - "mk-goal correctness fixes"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/010-security-and-correctness-fixes` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
> Commit: `3cb6d1bff9` fix(mk-goal): land phase 010 security + correctness fixes

### Summary

The shipped `/goal` plugin closed all five P1 security and correctness defects a 15-iteration deep review found in the conditional-verdict audit: unredacted verifier exceptions, a bypassable prompt-injection sanitizer, an injection block that could exceed its own character cap, a stale-verifier race that could let continuation act on a replaced goal, and a missing RICCE metadata field phase 007 already required.

### Added

- `ricce: { name: "RICCE", structure: [...] }` field on `promptEnhancement`, alongside the existing DEPTH, CRAFT/TIDD-EC and CLEAR score metadata

### Changed

- Verifier exception reasons now pass through `redactEvidence` before becoming `lastVerifierReason` or rendering through `mk_goal_status`
- User-authored objective text now normalizes with NFKC, strips bidi/invisible controls, neutralizes active-goal markers and fenced code, rewrites raw role labels, and redacts broader instruction-override phrasing
- `renderGoalInjection` now clamps the final returned block to `maxInjectionChars`, falling back to a compact block that preserves the active marker, `goal_prompt`, `last_check`, directive and closing marker under tight caps
- `maybeVerifyGoal` now returns an explicit envelope (`goalId`, `currentGoalId`, `verifierRunID`, `stale`); `session.idle` passes it to `maybeContinueGoal`, which suppresses continuation when the result is stale or belongs to a different goal

### Fixed

- DR-006: verifier exception secrets no longer leak into stored state or status output
- DR-005: prompt-injection sanitizer no longer bypassable via bidi/homoglyph or broader instruction-override phrasing
- DR-001: injection block could previously exceed `maxInjectionChars` after the prompt subsection was already clamped
- DR-003: continuation could act on a stale verifier result after the goal was replaced mid-verification
- DR-004-P1: `promptEnhancement` was missing the RICCE field phase 007's own acceptance criterion required

### Verification

- `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` (baseline and post-edit) - PASS: 6/6 exit 0
- `node --check .opencode/plugins/mk-goal.js` - PASS: no output
- REQ-001/DR-006 verifier-exception redaction repro - PASS: `storedLeaks: false`, `statusLeaks: false`, `redacted: true`
- REQ-002/DR-005 sanitizer-hardening repro (bidi + role label + instruction override + goal-marker injection) - PASS: all four attack vectors neutralized
- REQ-003/DR-001 total-injection-clamp repro at a 220-char cap - PASS: `length: 220`, `withinCap: true`, structural markers intact
- REQ-004/DR-003 stale-verifier-continuation repro - PASS: `decision: "suppressed"`, `reason: "stale_verifier_result"`, `promptAsyncCalls: 0`
- REQ-005/DR-004-P1 RICCE metadata repro - PASS: `hasLiteralRicce: true`, `hasSixSections: true`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | All five security and correctness fixes: redaction, sanitizer hardening, injection clamp, stale-verifier guard, RICCE metadata. |
| `010-security-and-correctness-fixes/{tasks,implementation-summary}.md` | Modified | Task completion and delivery evidence. |

### Follow-Ups

- None recorded. All five findings closed with reproduced, pasted evidence rather than cited from a prior run.
