---
title: "Implementation Summary: Validate.sh Template-Scaffold Detection"
description: "Summary of the SCAFFOLD_NEVER_TOUCHED validate.sh rule and the discovery that new registry-backed rules are invisible to the default Node-orchestrator validation path."
trigger_phrases:
  - "validate.sh template detection implementation summary"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection"
    last_updated_at: "2026-07-01T16:55:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh, verified by Sonnet 5"
    next_safe_action: "Phase complete; move to child 011-synthesis-integrity-and-orchestrator-watchdog (last child)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Added a new standalone `validate.sh` rule, `SCAFFOLD_NEVER_TOUCHED`, registered the same way as `COMMENT_HYGIENE_MARKER` (shipped earlier in this remediation phase, `009/003`): for each required doc in a folder (`plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`), it checks for a title containing `[template:`, a `_memory.continuity.packet_pointer` starting with `"scaffold/"`, or `_memory.continuity.last_updated_by` equal to `"template-author"` — flagged as an error only when that folder's own `spec.md` status is Complete-prefixed. A folder whose own status genuinely isn't Complete is never flagged, even if it legitimately still has scaffold markers (verified against a real existing Review-status fixture).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh` (new) | Created | The new rule |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | New `SCAFFOLD_NEVER_TOUCHED` registry entry |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/072-scaffold-never-touched-violation/`, `073-scaffold-never-touched-clean/` (new) | Created | Fail-case and pass-case fixtures |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modified | New harness block for the rule |
| `008-loop-systems-remediation/plan.md`, `spec.md` (by this orchestrating session, before dispatch) | Modified | Fixed 008's own remaining scaffold (`plan.md`, never touched by child 007's narrower scope) and a stale "001-006 shipped" wording, so child 010's own acceptance check (008 passes the new rule) wasn't guaranteed to fail on a precondition outside its scope |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode`, pre-grounded by this orchestrating session's own prior discovery (and fix) of 008's remaining plan.md scaffold, and an explicit heads-up about a large, separate, pre-existing condition: dozens of legitimately-shipped leaf children across phases 002-007 still carry genuine scaffold markers in their own `plan.md`/`tasks.md`, deliberately out of scope to fix in this phase (matching the parent's own Tier-3-deferred framing). The dispatch correctly identified that `check-comment-hygiene.sh` (not the Node-orchestrator-internal `PLACEHOLDER_FILLED`) was the right structural reference, built the rule, added fixtures including a false-positive guard (a Review-status folder with legitimate scaffold markers must still pass), and — because the `SPECKIT_RULES` routing fix from child 003 already generically covers new standalone rules — did not need to touch `validate.sh` at all this time.

This orchestrating session independently re-verified: re-ran the full extended harness (112/112), re-ran the new rule explicitly against `008-loop-systems-remediation`'s own docs (passes, confirming this session's earlier plan.md fix was both necessary and sufficient) and against its recursive children (surfacing a genuine, previously-undetected instance in `008/003-model-benchmark-reducer-ledger` — real proof the detector works, correctly left unfixed as out of scope). Investigating why the default `validate.sh` invocation (no `SPECKIT_RULES`) never showed this new rule's output led to a significant discovery: the Node orchestrator (`mcp_server/lib/validation/orchestrator.ts`, ~530 lines) is a separate, hand-written TypeScript implementation with its own fixed set of validator functions — it does not read `validator-registry.json` or the shell `rules/*.sh` files at all. This means `SCAFFOLD_NEVER_TOUCHED` and the earlier `COMMENT_HYGIENE_MARKER` are both invisible to the default invocation path used by the vast majority of real `validate.sh` calls (including every "clean packet" check performed throughout this whole remediation phase) — only reachable via explicit `SPECKIT_RULES=<name>` or `SPECKIT_VALIDATE_LEGACY=1`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fixed 008's remaining plan.md scaffold before dispatching**, rather than letting the dispatch discover a guaranteed-to-fail precondition — matches this remediation phase's established pattern of proactively closing small, clearly-scoped gaps rather than leaving known drift for a dispatch to stumble into.
- **Did not expand scope to fix 008/003-model-benchmark-reducer-ledger's own scaffold docs**, even though the new detector found it — this is the same class of pre-existing, deliberately-deferred drift already known to exist across many other leaf children in this packet; fixing one instance without a plan to address the rest would be inconsistent scope creep.
- **Did not attempt to fix the Node-orchestrator/shell-registry divergence.** This is a genuinely separate, larger architectural gap (porting or dynamically wiring registry rules into a 530-line hand-written TypeScript validator) affecting the whole spec-kit tool, not just this packet — documented prominently instead as a high-value finding for a future, properly-scoped phase.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **Full extended validation harness**, independently re-run: `bash scripts/tests/test-validation-extended.sh` → **112/112 pass** (up from 110/110 before this rule, confirming the 2 new fixture tests both run and pass with no regressions to any existing rule).
2. **008-loop-systems-remediation (parent-level)**, independently re-run via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED`: **passes** — "No scaffold-signature markers found in required docs for Complete spec".
3. **008's own recursive children**, independently re-run via the same explicit invocation: 6 of 7 pass; `003-model-benchmark-reducer-ledger` correctly fails with 3 real scaffold-signature hits (`plan.md:2`, `tasks.md:2`, `implementation-summary.md:2`, all `title contains [template:`) — a genuine, real-world confirmation the detector works, not a synthetic-only pass.
4. **Default (no `SPECKIT_RULES`) invocation**, independently checked: confirmed neither `SCAFFOLD_NEVER_TOUCHED` nor the earlier `COMMENT_HYGIENE_MARKER` produce any output line at all — both are structurally invisible to the Node orchestrator's fixed validator-function list (read directly in `mcp_server/lib/validation/orchestrator.ts`, confirmed no reference to either rule or to the registry/rules-directory mechanism anywhere in that file).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The rule (and `COMMENT_HYGIENE_MARKER`) is only reachable via explicit `SPECKIT_RULES=<name>` or `SPECKIT_VALIDATE_LEGACY=1`.** The default `validate.sh` invocation path (the Node orchestrator) has its own separate, hardcoded set of validator functions and does not consult the shell rule registry at all. This significantly limits the practical, "catches drift automatically going forward" value the parent spec intended — a real, unscoped-in-this-phase architectural gap worth a dedicated follow-up (either port these rules into the Node orchestrator, or make the orchestrator dynamically discover registry-backed rules).
- `008/003-model-benchmark-reducer-ledger`'s own scaffold docs remain unfixed — same class as the many other pre-existing, deliberately-deferred instances across phases 002-007, correctly out of scope for this phase.
<!-- /ANCHOR:limitations -->
