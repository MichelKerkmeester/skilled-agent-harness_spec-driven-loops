---
title: "Implementation Summary: Mode-D Gate Fix + ai-council Route-Identity Fix"
description: "Replaced the self-classification gate in all 8 /deep:* command files with an evidence-based dispatch-context check, and reconciled the ai-council route-proof identity across orchestrate-topic.cjs and deep_ai-council_auto.yaml -- completing live in-flight work rather than duplicating it."
trigger_phrases:
  - "implementation"
  - "summary"
  - "mode d gate fix"
  - "ai-council route identity fix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/006-mode-d-ai-council-identity-fix"
    last_updated_at: "2026-07-01T13:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 009"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-008-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Discovered a pre-existing, unrelated in-flight WIP on both ai-council target files -- new route_fields/resolved_route_header scaffolding already using correct ai-council values for a different purpose (seat-dispatch context injection). Completed the round-completion record wiring rather than duplicating or conflicting with it."
---
# Implementation Summary: Mode-D Gate Fix + ai-council Route-Identity Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-mode-d-ai-council-identity-fix |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GPT-backed OpenCode was hitting two confirmed, code-traced defects from research/research.md: a self-classification gate that a capable agent could read as ambiguous and hard-block on (Mode D — already fired once, in phase 005), and an ai-council route-proof check that certified an artifact naming a non-existent agent (`deep-ai-council`) as valid, because the validator and the record it checked happened to agree with each other while both disagreed with the actual registry. Both are fixed now.

### Mode-D Gate Fix

All 8 `/deep:*` command files (`ai-system-improvement.md`, `skill-benchmark.md`, `context.md`, `review.md`, `ai-council.md`, `research.md`, `agent-improvement.md`, `model-benchmark.md`) previously opened with a "SELF-CHECK: Are you operating as the @general agent?" block — an abstract capability question ("can you orchestrate a workflow," "can you load skill references") that a model can't reliably answer about itself, and which defaulted to a hard block on "NO or UNCERTAIN." That default is exactly what fired incorrectly during phase 005's smoke test. Each file now opens with a "DISPATCH-CONTEXT CHECK" instead: a concrete question (was this content reached via a direct `/deep:*` invocation, or pasted inline into another agent's dispatch prompt as ad hoc instructions?) that defaults to PROCEED when there's no concrete evidence of the latter. The blocking case still exists, but it now requires actual evidence rather than an unanswerable self-assessment.

### ai-council Route-Identity Fix

`orchestrate-topic.cjs`'s round-completion record and `deep_ai-council_auto.yaml`'s `route_proof` validator both used to say `mode: council` / `target_agent: deep-ai-council` — internally consistent, but wrong: `mode-registry.json`'s actual entry is `workflowMode: ai-council`, `agent: ai-council`, and no agent named `deep-ai-council` exists. Both files now say `mode: ai-council` / `target_agent: ai-council`, matching the registry and the naming convention already used by the other three deep modes (`context`, `research`, `review` — where `route_proof.target_agent` carries no `@` prefix either).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/ai-system-improvement.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/skill-benchmark.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/context.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/review.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/ai-council.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/research.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/agent-improvement.md` | Modified | Phase-0 gate replaced |
| `.opencode/commands/deep/model-benchmark.md` | Modified | Phase-0 gate replaced |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Modified | Round-completion record's `mode`/`target_agent`/`resolved_route` corrected |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modified | `route_proof` block corrected to match |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 8 command files' Phase-0 blocks first and checksummed the extracted blocks — they turned out structurally identical but not byte-identical (each substitutes its own loop description and slash-command name; 4 of the 8, all under the `deep-improvement` skill, also carry an extra per-file action in the "YES" branch, like reading a specific operator guide). Preserved every per-file extra verbatim while replacing the shared self-classification structure with the evidence-based dispatch-context check, keeping the `general_agent_verified` output-variable name unchanged so the two presentation `.txt` assets that already reference it (`deep_model-benchmark_presentation.txt`, `deep_agent-improvement_presentation.txt`) needed no changes.

Before touching the ai-council files, ran `git status`/`git diff` on both and found live, uncommitted, unrelated in-flight work: new `COUNCIL_RESOLVED_ROUTE_HEADER`/`COUNCIL_ROUTE_FIELDS` constants in `orchestrate-topic.cjs` and matching new YAML outputs, both already using the *correct* `ai-council`/`@ai-council` values — but wired into a different code path (seat-dispatch context injection for prompt display), sitting right alongside the still-stale round-completion record emitter and validator block. Read `post-dispatch-validate.ts:619-665`'s `validateRouteProofRecord` directly to confirm the comparator does an exact per-field match (including `resolved_route` as an exact string), which settled the format question: rather than adopting the new long-form semicolon-delimited header (built for a different purpose), the round-completion record keeps the original short `"Resolved route: mode=X target_agent=Y"` format, just with corrected values — consistent with how `context`/`research`/`review`'s own `route_proof` blocks are already formatted.

Ran the actual `deep-ai-council` vitest suite rather than constructing a synthetic repro (a scratch vitest config was needed since the skill has no local `vitest.config.ts` of its own for `.vitest.ts`-suffixed files with `vitest run <path>` from the repo root; deleted immediately after the run). All 9 test files, 76 tests, passed clean — including `orchestrate-topic.vitest.ts` and `orchestrate-session.vitest.ts`, which exercise the exact code paths touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kept the `general_agent_verified` output-variable name unchanged | Two presentation `.txt` assets already reference this exact variable name for display; renaming it would have forced out-of-scope changes to files not in this phase's declared scope. |
| Kept `resolved_route` in the original short format (`"Resolved route: mode=X target_agent=Y"`) rather than adopting the new long-form header already added by the in-flight WIP | `validateRouteProofRecord` does an exact string match on `resolved_route`; the long-form header serves a different purpose (seat-dispatch prompt context) and mixing the two formats would have been an unnecessary, higher-risk deviation from research's minimal-fix recommendation. |
| Completed the discovered in-flight WIP's wiring instead of writing a parallel, independent fix | The WIP had already computed the correct `ai-council` values in a new location; duplicating that logic instead of finishing its wiring would have left two divergent sources of the "correct" identity in the same file. |
| No `@` prefix on `target_agent` in the round-completion record | Matches the established convention already used by `context`/`research`/`review`'s own `route_proof` blocks, confirmed by direct comparison of all three YAML files. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| grep: zero remaining self-classification prose across 8 command files | PASS |
| grep: zero remaining `mode: council`/`target_agent: deep-ai-council` values | PASS |
| `deep-ai-council/scripts/tests/` vitest suite (9 files) | PASS, 76/76 tests |
| `orchestrate-topic.vitest.ts` + `orchestrate-session.vitest.ts` + `integration-deep-mode-e2e.vitest.ts` (targeted) | PASS, 11/11 tests |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No test asserts the exact corrected literal values.** The vitest suite passed because nothing in it hardcoded the old `council`/`deep-ai-council` strings either — it's evidence the fix didn't break anything, not a regression test that would catch this specific mismatch recurring. A future phase could add one.
2. **The dispatch-context check is still prose, not code.** Markdown command files have no runtime API to definitively answer "was I Task-dispatched vs. directly invoked" — the fix changes what the model is asked to evaluate (concrete dispatch evidence vs. abstract self-capability) and flips the ambiguous-case default from block to proceed, but it cannot make the check deterministic in the way a type system or a real conditional would be.
3. **`.opencode/commands/prompt.md` has the identical pre-fix pattern** (`general_agent_verified`, same self-classification structure) but is outside this phase's declared scope (research's 8-file citation didn't include it). Flagging it here as a discovered-but-unfixed instance for a future phase, not silently leaving it undocumented.
<!-- /ANCHOR:limitations -->
