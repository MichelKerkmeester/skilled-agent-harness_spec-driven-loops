STEP 1 - fill P/spec.md (Level 2 feature specification)
Shape model (read-only): specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/spec.md
- Title in frontmatter and H1: "Feature Specification: CI Cleanup and Pi Gate-3 Live Proof" (drop "Phase 1").
- Metadata table: Priority P0. Status In Progress. Created 2026-09-22. Branch worktrees/061-ci-cleanup-pi-proof.
  Parent Spec ../spec.md. Phase 50 of 50. Predecessor 049-gate-3-delivery-residue. Successor None.
  Handoff Criteria: "N/A - final phase of the parent".
- Phase Context: one sentence naming this as phase 50 of the system-speckit v4 parent, then scope boundary,
  dependencies and deliverables drawn from evidence.md.
- Problem and Purpose from evidence.md. Scope In: the six CI surfaces, both Pi proofs, the scorer fix, the parent
  records. Scope Out: the three out-of-scope items with their reasons. Files to Change: one row per group in
  evidence.md "The six CI surfaces" plus the cli-jev rows and the packet docs.
- Requirements: REQ-001, REQ-002, REQ-003 under P0. REQ-004 to REQ-007 under P1. One row each.
- Success criteria: SC-001 the six surfaces pass on the worktree and again on the merged tree. SC-002 the Pi
  contract is proven live twice, headless and TUI.
- Risks: the advisor fallback exit 75, the tmux extended-keys warning, the re-mint refusing while the scorer freeze
  is stale, pushing the other session's two commits.
- NFR, edge cases, complexity: fill only from evidence, otherwise "N/A - insufficient source context".
- Open questions: "None open. The operator decisions of 2026-09-23 are recorded in implementation-summary.md."
Accept when: only P/spec.md changed and every rule above holds.
