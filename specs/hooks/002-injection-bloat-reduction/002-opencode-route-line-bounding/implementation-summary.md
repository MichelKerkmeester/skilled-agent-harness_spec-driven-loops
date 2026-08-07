---
title: "Implementation Summary: OpenCode Route-Line Bounding"
description: "Implemented bounded compiled-route presentation with an independent off-by-default flag, complete reveal path, and full-target policy receipt hashing."
trigger_phrases:
  - "route line bounding implementation"
  - "compiled route cap verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
status: "complete"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Reconciled the completed bounded renderer and flag-off parity evidence"
    next_safe_action: "Keep the candidate flag off pending the activation gate"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: OpenCode Route-Line Bounding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-opencode-route-line-bounding |
| **Completed** | 2026-08-06 - implementation and verification complete |
| **Status** | Complete — shadow-only; candidate flag remains off |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode renderer now has a fixed three-target bounded mode behind the independent `boundedCompiledRouteSummary` option and `MK_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING=1` environment flag. Both are off by default, and the legacy branch remains the byte-for-byte path when bounding is disabled. A bounded line exposes `+K more` plus a 12-character SHA-256 digest of the full target membership; `revealCompiledRouteSummaryTargets` and `{ reveal: true }` recover the complete list.

The policy registry now contains `runtime.opencode-compiled-route.v1`. Its content and hash are derived from the complete target list in canonical sorted order, so the receipt is order-insensitive while still changing whenever membership changes. Route resolution and the existing `hub`, `outcome`, and `servingAuthority` fields were not changed.

### Delivered Files

| File | Action | Purpose |
|------|-----------------|---------|
| `.opencode/plugins/mk-skill-advisor.js` | Modified | Bounded renderer, independent flag, digest, and reveal path |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modified | Bounded, parity, reveal, digest, boundary, and malformed-input cases |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modified | Full-target compiled-route registry block and order-insensitive hash helpers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the `sk-code` OpenCode workflow: read the phase contract and current renderer, preserved the legacy render branch, added the independent bounded option, registered the full-target policy block, and added focused CJS coverage. Verification was run from the final tree.

Plugin suite output:

```text
ℹ tests 19
ℹ pass 19
ℹ fail 0
```

Exit: `0` from `node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs`.

Policy-plan output:

```text
Test Files  1 passed (1)
     Tests  5 passed (5)
```

Exit: `0` from `npx vitest run tests/policy-plan.vitest.ts` in `.opencode/skills/system-skill-advisor/mcp-server`.

The explicit full-target hash proof passed with exit `0` and produced:

```json
{"id":"runtime.opencode-compiled-route.v1","content":"[\"alpha\",\"beta\",\"delta\",\"gamma\"]","hash":"324ce5651527293aff44c853ef3fffc060d21f1c3c5fd2f3db442bd054510622","reorderedHash":"324ce5651527293aff44c853ef3fffc060d21f1c3c5fd2f3db442bd054510622","changedHash":"c3eb81448ec5a940c9c0956e35bfa2040af6fb15d2257b69c08acd2bb7d5f461"}
```

The independent renderer proof output was:

```json
{"flagOffByteParity":true,"revealRecoveredEveryTarget":true,"boundedLine":"Compiled routing (served=compiled): hub=sk-code outcome=route targets=quality,review,opencode,+2 more digest=0a9427082e97"}
```

Syntax, diff, and comment-hygiene checks all exited `0`. The strict packet validator output was:

```text
Summary: Errors: 0 Warnings: 0
RESULT: PASSED
```

The strict checklist completion output was `Summary: 26/26 items (100%)` and `RESULT: READY FOR COMPLETION`. Because the required record edits changed the packet source fingerprint, the scoped generated `graph-metadata.json` was refreshed; no unrelated metadata was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bound presentation only, never route resolution | This phase must not change which targets are chosen, only how the target list is rendered - keeps the blast radius to a rendering concern |
| Independent flag, off by default | Matches the parent program's flag-gated, never-combined activation discipline; this candidate can ship and be evaluated without touching phases 003/004 |
| Reveal path recovers everything bounding omits | Research.md explicitly rules out losing required target names as an acceptable trade; the reveal path is the guardrail that keeps bounding safe |
| Hash the full target list, not the bounded rendering | The `runtime.opencode-compiled-route.v1` receipt must reflect ground truth regardless of which render mode is active, so parity checks stay meaningful |
| Three visible targets per bounded line | The cap is fixed and small enough to bound the injected line while keeping the common route summary readable; the exact boundary is covered by tests |
| Order-insensitive target digest | Target membership is canonicalized with a sorted list before SHA-256 hashing; the proof shows reordered input keeps the hash and changed membership changes it |
| Preserve the phase-001 compatibility constant | The legacy `POLICY_BLOCK_IDS.OPENCODE_COMPILED_ROUTE` value remains available while the registry entry uses the new runtime ID, avoiding unrelated phase-001 test churn |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bounded-line target recoverability fixture in `mk-skill-advisor.test.cjs` | Passed: 43/43, exit 0 |
| Flag-off byte-identical parity fixture in `mk-skill-advisor.test.cjs` | Passed: direct renderer and plugin transform assertions, exit 0 |
| Digest-stability fixture pair in `mk-skill-advisor.test.cjs` | Passed: reorder stable and changed membership different, exit 0 |
| Full `mk-skill-advisor.test.cjs` suite regression check | Passed: 43 tests, 43 passed, 0 failed, exit 0 |
| Policy-plan registry and hash proof | Passed: focused policy command with 25 tests, plus explicit ID/full-content/order-sensitivity assertions, exit 0 |
| Strict packet validation | Passed: `RESULT: PASSED`, errors 0, warnings 0, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Activation remains intentionally off.** No default-on activation was added; a later phase must make that decision.
2. **Known repository noise remains outside this change.** The mirror-vs-directive Vitest suite still has its six documented baseline failures. The OpenCode drift wrapper reports the pre-existing 472-finding alignment backlog, while stack-folder and router-sync guards pass.
3. **Global hook installation drift remains outside this change.** `node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree` reports missing=8, command=8, orphaned=7 in the global hook file; no installer files were modified.
<!-- /ANCHOR:limitations -->
