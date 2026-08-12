---
title: "Iteration 6 — Overlay Protocols + Final Checklist Closeout"
reviewTarget: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
sessionId: "2026-08-11T20:09:17.000Z"
iteration: 6
mode: review
budgetProfile: scan
toolCallsUsed: 14
timestamp: "2026-08-11T22:30:00.000Z"
---

# Iteration 6 — Overlay Protocols + Final Checklist Closeout

## Dispatcher

Dispatch prompt selected overlay protocol verification + final checklist closeout. All four core dimensions (correctness, security, traceability, maintainability) were substantively complete from prior iterations. This iteration closes the three pending overlay cross-reference protocols and performs final checklist evidence review.

## Files Reviewed

| File | Dimension | Purpose |
|------|-----------|---------|
| `.opencode/agents/deep-review.md` | overlay/skill_agent | Verify agent definition references lifecycle hooks |
| `.claude/hooks/user-prompt-submit.js` | overlay/agent_cross_runtime | Adapter shim parity |
| `.codex/hooks/user-prompt-submit.js` | overlay/agent_cross_runtime | Adapter shim parity |
| `.cursor/hooks/user-prompt-submit.js` | overlay/agent_cross_runtime | Adapter shim parity |
| `.devin/hooks/user-prompt-submit.js` | overlay/agent_cross_runtime | Adapter shim parity |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | overlay/playbook_capability | Scenario 457 evidence classes |
| `checklist.md` | closeout | CHK-124, CHK-140-142 |
| `evidence/whole-gate/comparison.json` | closeout | Regression-proof honesty re-verify |
| `implementation-summary.md` | closeout | CHK-140 — deep review mention |
| `handover.md` | closeout | CHK-142 — parent/phase metadata |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | comment-hygiene | CHK label scan |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-observation-sink.vitest.ts` | comment-hygiene | Cross-packet import scan |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Test case descriptions embed CHK-XXX checklist IDs — drift-prone documentation coupling** — `claude-user-prompt-submit-hook.vitest.ts:209,225` — Two test cases use checklist item identifiers (`CHK-021`, `CHK-028`) in `it()` description strings. Per constitutional comment-hygiene rule, ephemeral artifact labels should not be embedded in code. If the checklist is renumbered, these test descriptions become stale references without any mechanical enforcement. The constitutional rule specifically targets code comments; test descriptions sit in a grey zone but carry the same coupling risk.
   - Finding class: instance-only
   - Scope proof: `rg -n "CHK-\d+" .opencode/skills/system-skill-advisor/mcp-server/tests/ --include="*.ts"` yields exactly 2 matches, both in this file.
   - Affected surface hints: ["test descriptions", "checklist cross-reference", "comment hygiene"]
   - Recommendation: Replace `CHK-021`/`CHK-028` with descriptive names like `fails-open when Python missing` / `adapter cache-hit under budget` so the test's intent survives renumbering. The checklist.md reference can live in a one-line comment above the test block if needed.

2. **Cross-packet import from sibling phase 007 creates fragile dependency** — `policy-observation-sink.vitest.ts:7` — The test imports `evidenceBindsToCell` from `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix-evidence.mjs`. This creates a runtime dependency on another spec folder's evidence artifact. If phase 007's folder is archived, renamed, or restructured, this import breaks — and the failure is a test-infrastructure break, not a code-regression signal.
   - Finding class: instance-only
   - Scope proof: `rg -n "specs/hooks" .opencode/skills/system-skill-advisor/mcp-server/tests/ --include="*.ts"` yields 3 matches: 2 are phase-numbered test fixtures in migration-lineage-identity.vitest.ts, 1 is this cross-packet import.
   - Affected surface hints: ["test infrastructure", "cross-packet coupling", "spec folder dependency"]
   - Recommendation: Either inline the evidence helper into the test file, move it to a shared test utility outside any spec folder, or document the dependency as a known coupling with a fallback mock when the file is missing.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `skill_agent` | overlay | **pass** | Canonical `deep-review.md` agent definition is LEAF-only, review-only, and contains no hardcoded references to directive-lifecycle hooks or phase 018 spec paths. Hook injection passes through the runtime hook system, not the agent definition. No ephemeral artifact labels found in the agent file. |
| `agent_cross_runtime` | overlay | **pass** | All 4 runtime adapter shims (`.claude/hooks/user-prompt-submit.js`, `.codex/hooks/user-prompt-submit.js`, `.cursor/hooks/user-prompt-submit.js`, `.devin/hooks/user-prompt-submit.js`) follow a consistent pattern: resolve target via `runClaudeHookAdapter('user-prompt-submit.js', ...)`, normalize output per runtime, fail-open to `{}`. Cursor adapter correctly documents its delivery-unconfirmed status and the explicit `prompt` injection for advisor classification. Adapter parity test (`directive-lifecycle-adapter-parity.vitest.ts`) confirmed in comparison.json spec-kit-test-inventory as added (no lost tests). [SOURCE: `.claude/hooks/user-prompt-submit.js:32-51`, `.codex/hooks/user-prompt-submit.js:9-13`, `.cursor/hooks/user-prompt-submit.js:36-43`, `.devin/hooks/user-prompt-submit.js:9-13`] |
| `playbook_capability` | overlay | **pass** | `directive-lifecycle-dedup.md` scenario 457 defines four evidence rungs (unit, adapter-driven, registered-path, native-host-delivered), Cursor SKIP/unconfirmed status, and the pass/fail/skip verdict contract. Scenario contract is complete and internally consistent. [SOURCE: `directive-lifecycle-dedup.md:18-45`] |
| `checklist_evidence` | core | **conditional** | CHK-124 rollback evidence satisfied: kill-switch `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` forces full delivery, no DB migrations, file-only state, changes uncommitted (rollback = `git checkout`), evidence append-only with supersession. CHK-140-142 remain blocked by P1-001 (graph-metadata.json derived.status stale `"planned"` vs `"in_progress"`) — metadata regeneration required before final validation. |
| `regression_proof` | core | **pass** | Re-read `comparison.json`: same manifest hash `5480166ceeb4cf699f68961d825dd3605eca61c0ae6fabf0f4edb63f0b4c5666` in both baseline and post; zero blockers; zero new failures; one improvement (directive-negative-controls exit 1→0); stable infrastructure failures (spec-kit-full-suite ETIMEDOUT in both). The comparison is honest. [SOURCE: `comparison.json:6,10,12,26-47,99-116,302-303`] |

## Integration Evidence

- **Command**: `/deep:review` — the dispatcher that owns the review loop and dispatched this iteration
- **Agent**: `@deep-review` — the LEAF agent definition reviewed for skill_agent protocol
- **Skill**: `system-deep-loop/deep-review` — the owning skill for the review protocol
- **Runtime adapters**: `.claude/hooks/user-prompt-submit.js`, `.codex/hooks/user-prompt-submit.js`, `.cursor/hooks/user-prompt-submit.js`, `.devin/hooks/user-prompt-submit.js` — all verified for cross-runtime adapter parity
- **Playbook**: `directive-lifecycle-dedup.md` — manual testing playbook scenario 457
- **Reducer**: `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — owns registry/dashboard refresh; not modified by this iteration

## Edge Cases

1. **Test descriptions as "code comments"**: The constitutional comment-hygiene rule specifically bans ephemeral artifact labels in code comments. Test case description strings are ambiguous — they appear in code files but are documentation strings. Recorded as P2-006-001 with the grey-zone acknowledged.

2. **Cross-packet import fragility**: The import from phase 007's evidence module is technically valid today but creates a brittle dependency. This is a known risk in spec-kit's multi-packet architecture, not unique to phase 018.

3. **CHK-130 checkbox anomaly**: checklist.md:200 shows CHK-130 unchecked, but iteration 3's security review confirmed CHK-130 as verified. The checklist appears to have a stale checkbox state — this was noted in iteration 3 but the checkbox was not physically toggled in the file. Edge case: the security review evidence exists but the checklist checkbox lags behind.

4. **Convergence at threshold**: newFindingsRatio = 0.07, which is below the 0.10 threshold. However, this is iteration 6 of 7, and CHK-140-142 remain blocked by P1-001 (metadata staleness). Convergence is achieved on new findings, but checklist closeout is incomplete because metadata regeneration requires a canonical save path execution (not a review action).

## Confirmed-Clean Surfaces

- **Hook implementation files**: `directive-lifecycle.ts`, `directive-lifecycle-store.py`, `directive-lifecycle-file-store.ts` — all confirmed free of ephemeral artifact labels in code comments (grep for spec paths, CHK/REQ/RR/finding IDs, and phase numbers yielded zero matches)
- **`mk-skill-advisor.js`**: JS mirror — no ephemeral labels found
- **Plugin file**: `opencode-message-identity.js` — no ephemeral labels found (verified in iteration 1)
- **All 8 lifecycle adapters**: Clean of artifact labels (verified across iterations 1-5)

## Ruled Out

- **P0/P1 in overlay protocols**: All three overlay protocols (skill_agent, agent_cross_runtime, playbook_capability) pass cleanly. No new P0 or P1 findings.
- **CHK-124 as blocker**: Rollback verification is satisfied by existing evidence (kill-switch + file-only state + uncommitted changes + append-only evidence). Not a blocker.
- **Comment hygiene violations in core files**: Extensive grep across the advisor hooks/lib directory and the full test tree found zero ephemeral artifact labels in code comments. Only borderline cases are test description strings (P2-006-001) and cross-packet imports (P2-006-002).
- **Whole-gate dishonesty**: Re-confirmed — same manifest hash, zero regressions, stable timeouts, honest reporting.

## Next Focus

**Dimension:** closeout synthesis  
**Focus Area:** Metadata regeneration + final checklist satisfaction  
**Why:** P1-001 (graph-metadata.json status stale `"planned"` vs `"in_progress"`) is the single remaining active P1. It blocks CHK-140, CHK-141, and CHK-142. All code review is complete — no active P0, no new P1, convergence achieved (newFindingsRatio=0.07 < 0.10). The last action is metadata regeneration through the canonical save path (`generate-context.js` or equivalent), which is a maintenance action, not a review action.  
**Rotation Status:** Synthesis — all dimensions complete, overlay protocols complete, checklist evidence reviewed.  
**Blocked/Productive Carry-Forward:** Productive — P1-001 has a clear, non-code resolution path (regenerate metadata).  
**Required Evidence:** Run `validate.sh --strict` after metadata regeneration; verify CHK-140/141/142 can be checked; confirm P1-001 resolved.  
**Recovery Note:** N/A (not in recovery mode)
