# Tasks: Research-Driven Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending.
- Each task names its verification (build + targeted suite).
- `[P*]` priority tag: P0 blocker, P1 required.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1 [P0] Verify all four findings against the current source (locate file:line, confirm or refute).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T2 [P0] Causal link/unlink call `runPostMutationHooks` + align stale relation vocabulary to canonical `RELATION_TYPES`.
- [x] T3 [P0] Remove the stale MiniMax `--variant` suppression (after live-confirming acceptance).
- [x] T4 [P1] Copy the `lib/` tree in `launcher-ipc-bridge.vitest.ts` (the one suite with the gap).
- [x] T5 [P0] Add the code-graph `depthTruncated` completeness signal + regression test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T6 [P0] Build affected dists; run targeted suites (293 causal, 35 playbook, 35+15 code-graph, launcher un-skip proof).
- [x] T7 [P1] Review every diff for scope creep; disclose the one verified in-file bonus fix.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All fixes committed (`e42232428e`) and pushed with green verification. Runtime activation (daemon recycle, code-graph reconnect) tracked separately.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings source: `028-026-program-research/research/research.md`.
- Implementation detail: `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
