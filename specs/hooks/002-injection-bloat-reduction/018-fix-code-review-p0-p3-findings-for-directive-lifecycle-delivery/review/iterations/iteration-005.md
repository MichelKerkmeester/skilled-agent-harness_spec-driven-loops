# Review Iteration 005 — Maintainability

## Dispatcher

- **Iteration:** 5 of 7
- **Dimension:** maintainability
- **Focus:** Test hygiene, pattern consistency, documentation quality, overlay protocols, metadata reconciliation
- **Budget Profile:** verify (11-13 calls; 14 used — budget overrun)
- **Status:** complete

## Files Reviewed

| File | Lines | Focus |
|------|-------|-------|
| `.opencode/skills/sk-code/sk-code-review/references/review-core.md` | 127 | Severity doctrine |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/directive-lifecycle.vitest.ts` | 459 | Test teardown hygiene |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | 480 | Test teardown hygiene |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts` | 861 | Test teardown hygiene, plugin patterns |
| `specs/.../018-.../implementation-summary.md` | 140 | Documentation accuracy |
| `specs/.../018-.../handover.md` | 167 | Documentation accuracy |
| `specs/.../018-.../decision-record.md` | 157 | Documentation accuracy, residual risks |
| `specs/.../018-.../graph-metadata.json` | 239 | Metadata reconciliation |
| `specs/.../018-.../description.json` | 27 | Metadata reconciliation |
| `specs/.../018-.../spec.md` (partial, lines 1-60 + grep) | 363 | RR-001/RR-002 disposition |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts` | 385 | Adapter pattern sample |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | 30 | Adapter pattern sample |

## Findings — New

### P0 Findings

None.

### P1 Findings

None new. P1-001 (graph-metadata.json derived.status is "planned" vs "in_progress") from iteration 4 is **re-confirmed** — the status field at `graph-metadata.json:50` still reads `"status": "planned"` while all implementation docs (spec.md, implementation-summary.md, handover.md, decision-record.md) consistently report `status: "in_progress"` at 95% completion. The timestamp fields `last_save_at` (2026-08-11T18:48:32.751Z) and `last_active_at` (null) are also stale and must be regenerated together.

### P2 Findings

1. **description.json description field is a stale problem statement** — `description.json:4` — The `description` field reads: "Before this phase, the canonical decision recorded transcript size only when it delivered the full directive block". This is the pre-implementation problem statement, not a current-state description. The implementation is 95% complete with focused suites passing (advisor 87/87, registered adapters 23/23, Pi 55/55, persistence 9/9, negative controls 5/5), whole-gate comparison zero-blocker, and only fresh review + metadata closeout remaining. A stale description degrades memory-search discoverability and graph-traversal accuracy.
   - Finding class: instance-only
   - Scope proof: `rg -n "description" description.json` shows only one description field at line 4; no other description artifacts exist at this packet level.
   - Affected surface hints: ["description.json regeneration", "canonical save path", "memory search indexing"]
   - Recommendation: Regenerate `description.json` through the canonical `generate-context.js` save path after metadata reconciliation, or manually update the description to reflect the current implemented state.

2. **graph-metadata.json timestamps predate final implementation state** — `graph-metadata.json:214,236-237` — `last_save_at` is "2026-08-11T18:48:32.751Z" which predates the final Pi repeat fix and identical-manifest comparison. `last_active_at` is null. `last_accessed_at` is null. These timestamps must reflect the current state for graph traversal accuracy.
   - Finding class: instance-only
   - Scope proof: `rg -n "last_save_at|last_active_at|last_accessed_at" graph-metadata.json` shows these are the only timestamp fields affected.
   - Affected surface hints: ["graph-metadata regeneration", "parent metadata", "canonical save path"]
   - Recommendation: Regenerate graph-metadata.json through the canonical save path which will set `status` to "in_progress", update `last_save_at`, and populate `last_active_at`. This also resolves P1-001 and unblocks CHK-140.

## Traceability Checks

| Check | Status | Detail |
|-------|--------|--------|
| Test teardown hygiene | PASS | All three test files (`directive-lifecycle.vitest.ts`, `claude-user-prompt-submit-hook.vitest.ts`, `mk-skill-advisor-plugin.vitest.ts`) have proper `afterEach` blocks that restore env vars, temp directories, mock state, timers, and plugin instances. No cross-test state leakage detected. |
| RR-001 (duplicate JS mirror) disposition | SATISFIED | Spec.md §4 lines 186-187 register RR-001 with owner ("Skill Advisor maintainer") and reopen criteria ("Any contract-vector mismatch, separator/epoch schema change, or production behavior divergence"). Contract vectors are shared between TypeScript core and JS mirror via `directive-lifecycle-vectors.json`. |
| RR-002 (spawnSync latency) disposition | SATISFIED | Spec.md §4 lines 187-188 register RR-002 with owner ("Hook performance owner") and reopen criteria ("Any stale suppression, state corruption, cleanup residue, unbounded eviction work, or p99 above 100 ms"). Current measurement: p99 65.706 ms under 100 ms budget, 16/16 writes preserved. CHK-113 verified. |
| Documentation consistency | PASS | implementation-summary.md, handover.md, and decision-record.md all consistently report `status: "in_progress"` and `completion_pct: 95`. All three agree: fresh deep review pending, metadata regeneration needed, final validation remaining. No contradictions found. |
| Overlay protocols (skill_agent, agent_cross_runtime, playbook_capability) | DEFERRED | Budget exhausted before overlay cross-reference could be evaluated. These remain pending for a future iteration or final closeout. |

## Integration Evidence

None this iteration — maintainability review focused on internal test hygiene, documentation, and metadata within the spec folder. Overlay protocols deferred due to budget constraint.

## Edge Cases

1. **Stale description may confuse memory search**: The description.json description field is a pre-implementation problem statement. If memory_search indexes this field, search results may incorrectly suggest the phase is unimplemented.
2. **Metadata reconciliation requires canonical-save-path regeneration**: graph-metadata.json, description.json, and continuity fingerprints cannot be manually edited — they must be regenerated through the canonical `generate-context.js` path. This is a hard dependency on the save infrastructure, not a code fix.
3. **Comment hygiene not checked this iteration**: Budget exhaustion prevented searching for ephemeral artifact labels (REQ-/CHK-/ADR-/task-ids) in code comments. Previous iterations covered code but this was not re-verified.

## Confirmed-Clean Surfaces

- Test teardown hygiene across all three test files (directive-lifecycle, claude-user-prompt-submit-hook, mk-skill-advisor-plugin)
- Documentation consistency across implementation-summary, handover, decision-record
- RR-001/RR-002 residual risk registration with owners and reopen criteria
- FileDirectiveLifecycleStore afterEach properly cleans directories, restores env vars, and resets default store
- Plugin test afterEach properly disposes instances and restores all tracked env vars

## Ruled Out

None this iteration.

## Next Focus

**Dimension:** maintainability (continued) or cross-reference synthesis
**Focus Area:** Overlay cross-reference protocols (skill_agent, agent_cross_runtime, playbook_capability), comment hygiene verification, final checklist closeout (CHK-044, CHK-124, CHK-140-142)
**Why:** Maintainability is mostly complete — test hygiene PASS, documentation consistent, RR-001/RR-002 satisfied. Remaining work: overlay protocols were deferred due to budget; comment hygiene (ephemeral artifact labels in code) was not verified; CHK-124 (rollback review) and CHK-140-142 remain pending. The P1-001 metadata staleness finding can only be resolved by regeneration through the canonical save path — not by review.
**Rotation Status:** Maintainability core is substantively complete; overlay protocols and final checklist items are the last coverage gaps.
**Blocked/Productive Carry-Forward:** Productive — core maintainability findings are clean. P1-001 is self-contained and requires metadata regeneration (not a code fix). CHK-140 is blocked by P1-001 resolution but P1-001 itself is actionable.
**Required Evidence:** Read overlay protocol files (skill_agent, agent_cross_runtime, playbook_capability), run comment hygiene grep for ephemeral labels, review CHK-124 rollback evidence.
