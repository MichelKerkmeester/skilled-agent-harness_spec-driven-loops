# Deep Review Strategy - fable-medium lineage

## 1. OVERVIEW

Persistent strategy for one fan-out lineage of the deep review of the history lookup handover packet. One iteration is allowed (`maxIterations: 1`, `stopPolicy: max-iterations`), so the single pass covers all four dimensions.

---

## 2. TOPIC
Review: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration` (spec-folder).

Operator review focus: the work in commits 198162c7f11 7973b80ab0b 50c5472789e de26d18cbdf 8cd3fa79da9 f320d9d9bcd 4cb3db7a787 cede6d301ab 70c47ad5e00, plus the section "A Claimed Note Offers the Sender History" added to `.skilled/changelog/skilled/v4.0.2.1.md` in merge commit 967a825df3a. Also the files the phase docs do not list: `.skilled/hooks/shared/session-readers/claude.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` and `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts`. No other commit in the surrounding history is reviewed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Commits outside the nine named ones and the named changelog section.
- Fixing anything: the review target is read-only.
- Running the repository test suites, validators or any git write.

---

## 5. STOP CONDITIONS
- The iteration cap of 1 is reached (terminal stop reason `maxIterationsReached`).

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the locator producer and its verifier as a pair: the handover mint against the lookup command and the shared reader. It found the store-root difference and the missing folder proof (iteration 1)
- A leftover search after the compaction removal: it showed no source file still names the removed plugin or mint (iteration 1)

---

## 9. WHAT FAILED
- Line-by-line reading of the catalog, playbook and README changes in f320d9d9bcd: the single iteration left no budget, so they got a stat-level read only (iteration 1)
- Confirming findings by running them: this lineage may not run the suites, so finding R1-P2-001 rests on reading both resolvers (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A stale `v4.0.2.2.md`: the file added in f320d9d9bcd no longer exists, and its text lives in the `v4.0.2.1.md` section. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale `v4.0.2.2.md`: the file added in f320d9d9bcd no longer exists, and its text lives in the `v4.0.2.1.md` section.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale `v4.0.2.2.md`: the file added in f320d9d9bcd no longer exists, and its text lives in the `v4.0.2.1.md` section.

### A turn id lost by the reader merge: later lines of one message drop their own ids, and nothing in the lookup hands out an id before the merge. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A turn id lost by the reader merge: later lines of one message drop their own ids, and nothing in the lookup hands out an id before the merge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A turn id lost by the reader merge: later lines of one message drop their own ids, and nothing in the lookup hands out an id before the merge.

### Missing child `description.json` files after the move: all six children carry one. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing child `description.json` files after the move: all six children carry one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing child `description.json` files after the move: all six children carry one.

### The test file's own state-path helper mirroring the hook-state hashing: a change to the real scheme fails the positive cases loudly, so it is not a silent gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The test file's own state-path helper mirroring the hook-state hashing: a change to the real scheme fails the positive cases loudly, so it is not a silent gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The test file's own state-path helper mirroring the hook-state hashing: a change to the real scheme fails the positive cases loudly, so it is not a silent gap.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- The adapter suite's own state-path helper: a change to the real scheme fails its positive cases loudly (iteration 1, evidence: `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts:43`)
- A turn id lost by the reader merge: nothing hands out an id before the merge (iteration 1, evidence: `.skilled/hooks/shared/session-readers/claude.mjs:158`)
- Shell injection through a note's session id: the id is single-quoted and three guards reject separators and control characters (iteration 1, evidence: `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:53`)
- A stale `v4.0.2.2.md` changelog file: it no longer exists and its text lives in the `v4.0.2.1.md` section (iteration 1)

### Open edge cases carried forward
- R1-P2-001 becomes P1 if `CLAUDE_CONFIG_DIR` is a supported setup for the lookup. A claim-then-redeem run in a sandbox would settle it.
- The catalog, playbook and README pages changed in f320d9d9bcd were not read line by line.
- The Claude, Pi, DSH and Devin compaction adapters were read as a stat plus a leftover search, not hunk by hunk.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none scheduled. The iteration cap is reached and the loop goes to synthesis. - Focus area if the review is reopened: run finding 1 against a sandbox with `CLAUDE_CONFIG_DIR` set, and read the catalog, playbook and README changes of f320d9d9bcd line by line. - Reason: finding 1 is the only one whose severity depends on a fact this pass could not run. - Rotation status: all four dimensions touched once. - Blocked or productive carry-forward: reading both the producer and the verifier of the locator was productive and found findings 1 and 2. - Required evidence: a claim-then-redeem run through `bin/history-lookup.mjs`. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- `resource-map.md` not present; skipping coverage gate.
- No `steer.md` existed in the lineage directory at init.
- Init deviations recorded for the dispatcher: the coverage graph seed (`upsert.cjs`) and the continuity save (`generate-context.js`) are not run, because both write outside the lineage directory, which is this lineage's whole write surface.

### Bounded Context Snapshot
- Target pointers: `.skilled/hooks/session-handover/lib/relaunch-core.cjs`, `.skilled/hooks/session-handover/bin/session-handover.cjs`, `.skilled/hooks/session-handover/bin/history-lookup.mjs`, `.skilled/hooks/shared/session-readers/claude.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/`, `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts`.
- Behavior claims: the parent `spec.md` and the six phase children, plus the changelog section.
- Review risks and gaps: one iteration only, so depth is traded for breadth.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-fable-medium-1794748073879-re9m5r, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-15T13:09:09Z
<!-- MACHINE-OWNED: END -->
