---
title: "Implementation Summary: Scorer P0 Routing Fixes (F1b) — Complete"
description: "Implemented model-B explicit-slash routing, code-mode disambiguation, and low-information ambiguity abstention across both scorers (TS + Python). All P0 regression cases pass in both; corpus parity improved 45→62 with zero lost rows."
trigger_phrases:
  - "F1b implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Implemented and verified all P0 routing fixes in both scorers"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-code-mode routes (not relabelled)"
      - "abstain only on ambiguous-keyword-driven winners"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes |
| **Completed** | 2026-05-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The genuine P0 scorer/routing failures from the 028 playbook run, fixed in BOTH the
TypeScript scorer (`lib/scorer/*`) and the Python scorer (`scripts/skill_advisor.py`)
so the two implementations stay at behavioral parity on the regression contract.

**Model B — explicit `/X:y` routes to the owning skill (P0-CMD-003).** An explicit
`/memory:save` now routes to the owning skill `system-spec-kit`, not the
`command-memory-save`/`memory:save` bridge. In TS this was already the behavior; the
Python `COMMAND_BRIDGE_OWNER_NORMALIZATION` mapped the bridge to `memory:save` (a sibling
bridge alias) instead of the real owner, so it was corrected to `system-spec-kit`. The
pre-model-B unit test (T243-SA-017) was updated to the parity-correct owner, confirmed
against live TS behavior.

**Code-mode disambiguation + low-information abstention (P0-UNC-001 / P0-UNC-002).**
Toolchain-shaped vocabulary ("api chain", "call_tool_chain", "code mode", "tool chain")
now disambiguates toward `mcp-code-mode` over the generic code skill. A low-information
ambiguity rule floors the uncertainty of an under-specified prompt's ambiguity cluster
above the strict threshold, so strict callers abstain ("api chain mcp" → no result) while
confidence-only callers still surface the disambiguated best guess (`mcp-code-mode`). The
rule fires only when the winner's lead is built from ambiguous shared keywords rather than
a distinctive phrase/intent anchor — so terse-but-anchored prompts ("code audit") still
route.

**Parity fixes surfaced in passing.** The Python `command-prompt-improver` bridge fired on
the bare word "prompt" (mis-routing "improve this prompt …" away from `sk-prompt`); its
slash marker was narrowed to the literal `/prompt`. A read-only-explainer floor in TS
abstained on genuine devtools tasks ("inspect network waterfall in browser"); a
`readOnlyRouteAllowed` rule lifts `mcp-chrome-devtools` off the floor for devtools
vocabulary (P0-CHROME-002, a TS-only divergence).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../lib/scorer/fusion.ts` | Modify | code-mode disambiguation bonus; low-info abstention (phrase-anchor guarded); chrome-devtools read-only route allow |
| `.../lib/scorer/scoring-constants.ts` | Modify | `mcpToolchain*` bonuses + `lowInfoAmbiguityFloor` calibration constants |
| `.../scripts/skill_advisor.py` | Modify | memory-save owner normalization (model B); prompt-improver bare-marker fix; code-mode disambiguation; low-info abstention (ambiguous-ratio guarded) |
| `.../tests/python/test_skill_advisor.py` | Modify | T243-SA-017 owner updated to parity-correct `system-spec-kit` |
| `.../tests/parity/python-ts-parity.vitest.ts` | Modify | corpus baseline 45→62 (verified pure improvement, 0 lost rows) |
| `.../tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | corpus baseline 45→62 (verified pure improvement, 0 lost rows) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented one mechanism at a time, lowest-risk first (Python model-B + prompt-improver
parity → TS chrome parity → shared abstention/disambiguation), re-running BOTH regression
harnesses after each step and watching for any previously-passing case regressing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `/memory:save` owning skill = `system-spec-kit` (not `memory:save` bridge) | Matches the CLAUDE.md Memory Save Rule, the P0-CMD-003 contract, and live TS behavior; `memory:save` is a bridge alias, not a real skill |
| Abstain only when winner is ambiguous-keyword-driven | Prevents over-abstention on terse-but-anchored prompts ("code audit"); keeps the rule principled, not a per-prompt hack |
| Disambiguate via ranking (TS) / confidence lift keeping sk-code in cluster (Python) | Mirrors each scorer's sort model while preserving the ambiguity cluster the abstention needs |
| Update parity baselines 45→62 | Verified strict improvement (0 lost rows); the assertions are drift detectors, the regression guards (`regressions=0`) still pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression P0 pass rate (TS) | 12/12 |
| Regression P0 pass rate (Python) | 12/12 |
| Previously-passing regression cases | 0 regressed (both scorers) |
| Python corpus accuracy (strict gold) | 45 → 62 correct, 0 lost rows |
| TS↔Python parity tests | pass (regressions=0, tsAbstainsOnPythonCorrect=0) |
| Python unit suite | 57/57 pass |
| TS vitest | 448 pass, 7 skipped (1 pre-existing unrelated failure: `lane-weight-sweep` stale 026 path) |
| `tsc --noEmit` | clean |
| `verify_alignment_drift.py` | PASS (0 violations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Out-of-scope P1 alias drift remains** — regression/corpus cases labelled `sk-deep-research`/`sk-deep-review`/`sk-deep-agent-improvement` still fail strict matching against the live `deep-*` IDs in the regression harness (the F1a alias fix covered `advisor_validate`, not these harnesses). Tracked separately.
2. **`lane-weight-sweep.vitest.ts` fails on a stale 026-packet path** — pre-existing, unrelated to this phase (the referenced `005-skill-advisor-scoring-engine/` packet was renamed in the 026 reorg).
<!-- /ANCHOR:limitations -->
