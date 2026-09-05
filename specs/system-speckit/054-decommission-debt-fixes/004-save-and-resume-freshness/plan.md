---
title: "Implementation Plan: Phase 4: save-and-resume-freshness"
description: "Replace the save workflow's reminder-only trigger-index log with an actual staleness check, and narrow the resume ladder's trust so a malformed or unbound signal can no longer outrank validated, packet-bound continuity."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: save-and-resume-freshness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) |
| **Framework** | None - a save-workflow step and a resume-ladder comparison |
| **Storage** | `runtime/data/trigger-index.json` (read at save time), spec-folder markdown frontmatter (read at resume time) |
| **Testing** | Vitest (workflow suite for the staleness signal, resume-ladder suite for the trust-ranking fixes) |

### Overview
Two independent, both load-bearing seams: (1) `workflow.ts`'s save-completion step gains a real comparison against `runtime/data/trigger-index.json` instead of a static reminder string; (2) `resume-ladder.ts`'s `parseContinuitySignal` stops falling back to a manual field extraction when strict validation fails, and its handover-versus-continuity comparison stops letting a merely-newer, unbound handover outrank a validated, packet-bound continuity record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (workflow staleness test, resume-ladder trust-ranking tests)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two additive guards on existing pipelines: a read-only comparison inserted into the save-completion step, and a stricter rejection branch inserted into an existing parse function - neither replaces the surrounding pipeline shape.

### Key Components
- **Save-time staleness check** (`workflow.ts`, replacing lines 1578-1587): reads the saved packet's `trigger_phrases` frontmatter and the corresponding entry (if any) in `runtime/data/trigger-index.json`, reports a delta.
- **`parseContinuitySignal` strict rejection** (`resume-ladder.ts:632-663`): removes the manual-extraction fallback branch; a failed `readThinContinuityRecord` now returns `null` directly.
- **Handover-vs-continuity trust ranking** (`resume-ladder.ts:1063`): adds a packet-identity/fingerprint check before letting `handoverSignal.updatedAtMs` outrank `continuitySignal.updatedAtMs`.

### Data Flow
Save: packet frontmatter (`trigger_phrases`) → staleness comparison against `runtime/data/trigger-index.json`'s recorded entry for that packet → staleness result surfaced in `generate-context.ts`'s CLI output. Resume: `handover.md` and `implementation-summary.md` → `parseHandoverSignal`/`parseContinuitySignal` → (new) packet-identity/fingerprint gate → freshness comparison → `primary` resume signal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `workflow.ts:1578-1587` | Logs a static "run the generator manually" reminder | update: replace with an actual comparison against `runtime/data/trigger-index.json` | New vitest case in the workflow suite asserting the signal fires only on a phrase change |
| `resume-ladder.ts:632-663` (`parseContinuitySignal`) | Falls back to manual field extraction when `readThinContinuityRecord` fails | update: return `null` on validation failure | New resume-ladder test with a malformed `session_dedup.fingerprint` |
| `resume-ladder.ts:1063` (handover-vs-continuity comparison) | Picks whichever signal's `updatedAtMs` is later, no identity check | update: prefer continuity unless the handover verifies against the resolved packet | Two new resume-ladder tests (unbound-newer-handover loses; bound-newer-handover wins) |
| `resume-ladder.ts:587` (`parseHandoverSignal`) | Builds a signal from `handover.md` with no packet binding | unchanged directly; consumed by the new comparison logic at line 1063 | Covered by the same two tests above |

Required inventories:
- Same-class producers: `rg -n "readThinContinuityRecord\|parseContinuitySignal\|parseHandoverSignal" .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts` - confirms these are the only three functions in the seam this phase touches.
- Consumers of changed symbols: `rg -n "resume-ladder" .opencode/skills/system-spec-kit --glob '*.ts' -l` - every caller of the ladder (the `/speckit:resume` command path and any test harness) must still resolve after the trust-ranking change.
- Matrix axes: signal presence (handover only / continuity only / both) × continuity validity (valid / malformed) × handover binding (unbound / packet-bound-and-verified) × relative freshness (handover newer / continuity newer) - the test suite covers the load-bearing corners named in Success Criteria, not the full cross product.
- Algorithm invariant: a resume signal's precedence must never be decided by timestamp alone when one candidate is unvalidated or unbound and the other is validated and packet-bound; timestamp only breaks ties between two candidates of equal trust standing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseContinuitySignal` rejection path; handover-vs-continuity trust ranking; save-time staleness comparison | Vitest |
| Integration | Full `/speckit:resume` path against a fixture packet with a deliberately malformed continuity record and a newer unbound handover | Vitest, resume-ladder test harness |
| Manual | Run a real save on a packet whose `trigger_phrases` were just edited and confirm the staleness signal appears in the CLI output | `node scripts/dist/memory/generate-context.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/lib/continuity/thin-continuity-record.ts`'s `readThinContinuityRecord`/`buildError` contract | Internal | Green - already the validation surface `parseContinuitySignal` calls | The strict-rejection change is additive on top of an existing, stable contract |
| Phase 3's trigger-index coverage decision | Internal | Should land first or in parallel | The staleness check's notion of "current" phrases depends on which corpus the index actually walks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A real resume flow starts failing to find continuity that previously resolved (e.g., a handover-only packet with no continuity at all stops resuming).
- **Procedure**: Revert the `resume-ladder.ts` and `workflow.ts` changes in one commit; the strict-rejection and trust-ranking changes are independent enough to revert separately if only one regresses.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm exact line ranges + existing test baselines) ──► Core (staleness check + ladder rejection + trust ranking) ──► Verify (new tests + manual save/resume runs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Line ranges and current behavior already confirmed by direct source reading |
| Core Implementation | Med | Two independent seams, three functions total |
| Verification | Med | Five to six new/extended test cases across two suites, plus a manual save/resume smoke check |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline resume-ladder test suite run captured before this change
- [ ] Baseline workflow save-completion test run captured before this change
- [ ] A real resume against an existing continuity-bearing packet confirmed to still work before this change

### Rollback Procedure
1. Revert the `resume-ladder.ts` and `workflow.ts` commits.
2. Re-run both baseline test suites and confirm identical pass counts.
3. Re-run the manual resume smoke check against the same packet used in the pre-deployment checklist.
4. No stakeholder notification needed - internal continuity-tooling change with no external contract.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no persisted schema changes, only save-workflow and resume-ladder logic
<!-- /ANCHOR:enhanced-rollback -->

---
