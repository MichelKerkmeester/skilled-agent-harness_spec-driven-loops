# Seat opus-memory-track-002 — iteration 4 (global #33)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-memory-track-002
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

## Review — seat opus-memory-track-002

**Angle:** Feedback retention reducer — tier basement enforcement; no over-eviction of protected tiers. **Lens:** correctness.

### What I traced

I read the reducer (`feedback-retention-reducer.ts`), the sweep that consumes it (`governance/memory-retention-sweep.ts`), the signal source (`feedback/batch-learning.ts`), the edge-floor sibling (`edge-tier-basement.ts`), and both dedicated test suites. I then verified the protected-tier sets directly.

### Protected-tier basement is double-gated in every sweep mode

The protected basement is `{constitutional, critical}` plus pinned, defined identically in the reducer (`feedback-retention-reducer.ts:14`, `:153`) and the sweep (`memory-retention-sweep.ts:177`, `:185-193`). I confirmed a protected row cannot be deleted on any of the three paths:

1. **Feature disabled** (`feedbackRetention === null`): deletion is gated solely by `isProtectedFromRetentionDelete(currentCandidate)` (`:543`), which protects constitutional/critical/pinned. Verified by test at `memory-retention-feedback-learning.vitest.ts:98-118` (constitutional id 2 survives).
2. **Shadow / active-blocked**: early return at `:464-490` deletes nothing — `swept:0`, `deletedIds:[]`. This under-deletes (safe direction for my angle), gated default-OFF behind `SPECKIT_FEEDBACK_RETENTION_LEARNING`.
3. **Active + gate passed**: reducer assigns `protect` to constitutional/critical/pinned *first* (`:153`), and even if a `delete` decision reached a protected row (only possible via concurrent tier promotion after selection), the sweep re-checks `isProtectedFromRetentionDelete(currentCandidate)` against the **freshly re-fetched** row (`:543`) and denies it (`decision:'deny'`, `reason:'retention_tier_protected'`). Verified at `:193-230` (constitutional id 2 → `delete_after=NULL`, never deleted).

### Edge cases I checked and cleared

- **TOCTOU**: `getCurrentExpiredRow` (`:198-235`) re-validates expiry inside the transaction; a row un-expired by a concurrent writer returns null → `continue` (`:502-505`), so `extend`/`delete` cannot clobber a now-live row. The basement re-check uses the fresh row, not the stale candidate — concurrent *promotion* to a protected tier is still caught.
- **Signal id typing**: reducer keys signals by `String(memoryId)` (`:77`, `:143`) and matches decisions by numeric `candidate.id` (`:508`); both are internally consistent. Crucially, protect is *tier-based*, not signal-based, so any signal-lookup miss cannot cause a protected-tier deletion.
- **Pinned coercion**: `Number(isPinned)` NaN/malformed values resolve to "protected" (`:153`, `:192`) — conservative.
- **`important` tier**: intentionally `EXTENDABLE_TIERS` only (`:15`), deleted on expiry without positive feedback. This matches the pre-feature baseline (the disabled path already deletes expired `important`), so the feature adds protection (`extend`), never new eviction. No spec invariant claims `important` is basement-protected — the `{constitutional, critical, important}` set in `batch-learning.ts:66` belongs to a clearly-labeled *future* demotion guard (`isFutureFeedbackDemotionPermitted`) not wired into retention, so it is not a contradiction in active code.
- **Extend timestamp** (`buildExtendedDeleteAfter`, `:96-99`): `max(runAt, lastSeen)+30d` is always future — no immediate re-eviction.

No over-eviction path for protected tiers exists, and no documented invariant is violated. Findings from prior passes are not re-raised.

```json
{"seat":"opus-memory-track-002","model":"claude-opus-4-8","angle":"Feedback retention reducer: retention tier basement enforcement; no over-eviction of protected tiers.","verdict":"PASS","summary":"Protected basement {constitutional,critical,pinned} is double-gated (reducer protect + fresh-row sweep re-check) across all three modes; TOCTOU caught; important is extendable-only by design. No over-eviction path found.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-retention-reducer.ts",".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts",".opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts",".opencode/skills/system-spec-kit/mcp_server/lib/feedback/edge-tier-basement.ts",".opencode/skills/system-spec-kit/mcp_server/tests/feedback-retention-reducer.vitest.ts",".opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-feedback-learning.vitest.ts"],"findings":[]}
```
