---
title: "Implementation Summary: Spec-Folder Naming-Convention Guard [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard/implementation-summary]"
description: "Summary of the naming-guard feasibility research: what was investigated, the PARTIAL verdict, and the recommended layered design."
trigger_phrases:
  - "naming guard summary"
  - "naming guard research summary"
  - "feasibility verdict partial"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard"
    last_updated_at: "2026-06-06T05:50:56Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Summarized research findings and PARTIAL feasibility verdict"
    next_safe_action: "Operator review before opening an implementation packet"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "naming-guard-research-2026-06-06"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-spec-folder-naming-guard |
| **Completed** | 2026-06-06 |
| **Level** | 2 |
| **Actual Effort** | 2 hours (estimated: 2 hours) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This is a research/design packet, not an implementation. It delivers a feasibility study and a recommended design for a cross-runtime spec-folder naming guard, prompted by the operator hitting the `028-026-program-research` mis-location defect. No guard code, hook, or script was written or modified. The deliverable is the documented analysis (`research.md`) plus the canonical spec docs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Problem, scope, requirements, success, risks, open questions |
| `plan.md` | Created | Research approach + recommended-design plan |
| `tasks.md` | Created | Research task breakdown across three phases |
| `research.md` | Created | Findings, PARTIAL verdict, layered design, risks |
| `checklist.md` | Created | Level 2 verification of research completeness |
| `implementation-summary.md` | Created | This summary |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research was delivered in three phases: a convention audit (reading `create.sh`, `is-phase-parent.ts`, and `validation_rules.md` directly), a hook-parity audit (cross-checking `hook_system.md` §8 against live config and hook source), and a verdict-and-design synthesis. Confidence rests on first-hand evidence: the defect folder was reproduced on disk, and every claim is pinned to a file:line citation. Verification was the packet itself passing `validate.sh --strict`. No code, hook, or config was shipped; the artifact is the documented analysis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Verdict is PARTIAL, not yes | A single pre-write hook cannot guarantee enforcement; parity is uneven and raw mkdir/Write bypasses hooks |
| `create.sh` is the guarantee point | It is the canonical creation path; a hard gate there covers the common case deterministically |
| `validate.sh` semantic rule as catch-later | Defense-in-depth for folders created outside `create.sh` |
| Per-runtime pre-write hooks are best-effort | Only Codex has a working deny hook today; others vary |
| Reuse `is-phase-parent` regex via shared module | Single source of truth; do not re-derive the phase-child pattern |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Evidence verification | Pass | 100% | Every cited file:line read directly |
| Defect reproduction | Pass | - | `028-026-program-research` confirmed at track root |
| Packet validation | Pass | 100% | `validate.sh --strict` returns PASSED |
| Checklist | Pass | 100% | All P0/P1/P2 items verified |

### Evidence Summary

| Claim | Source |
|-------|--------|
| Phase-child regex | `is-phase-parent.ts:8`, `shell-common.sh:57` |
| Loose create.sh basename regex | `create.sh:681-687` |
| FOLDER_NAMING is syntax-only | `validation_rules.md:586` |
| Only Codex pre-write deny hook | `hooks/codex/pre-tool-use.ts` |
| Claude has no PreToolUse registered | `.claude/settings.local.json` |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | create.sh check < 50ms | Design-only (parent-dir read) | N/A - not implemented |
| NFR-P02 | hook within 1800ms budget | Design-only | N/A - not implemented |
| NFR-S01 | No eval of slug content | Design specifies regex-only | Pass (design) |
| NFR-S02 | Fail open on guard error | Design specifies allow + warn | Pass (design) |
| NFR-R01 | Shell/TS agreement | Reuses is-phase-parent dual-impl | Pass (design) |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Research-only scope** - No guard exists yet; this packet only justifies and designs it.
2. **No raw-mkdir guarantee** - No prompt-time or pre-write hook can catch folders created by hand outside the tracked tools; only `validate.sh` catches those later.
3. **Heuristic semantic checks** - Mis-location detection is high-confidence for embedded sibling numbers but heuristic for generic slugs; false positives are possible.
4. **Gemini parity gap** - Gemini has no checked-in project hook, so it gets no pre-write enforcement even in the recommended design.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Findings in research.md | research.md created alongside implementation-summary.md | Operator requested research.md capturing findings + design |

<!-- /ANCHOR:deviations -->
