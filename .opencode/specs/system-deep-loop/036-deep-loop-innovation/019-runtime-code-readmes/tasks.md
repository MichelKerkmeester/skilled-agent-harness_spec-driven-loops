<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Planned — no task is started; this is a captured backlog phase.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] **Confirm findings against HEAD.** Findings are hypotheses. Re-verify the 14 recorded defects at current HEAD, recording
      confirmed / drifted / refuted per ID with file:line, and re-run the 56-missing census — it was taken 2026-07-29 and the
      036 tree is under active development, so both numbers may have moved.
- [ ] Enumerate every source-bearing folder under `runtime/` and its current README state.
- [ ] Pull the sk-doc create-readme code-README standard as the authoring contract, including the Directory-Tree ruling from
      `sk-doc/022-code-readme-coverage/001`.
- [ ] Confirm the `runtime/README.md` sequencing decision against WS1 `032`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Author READMEs for the shared substrate modules.
- [ ] Author READMEs per clone column (schema, reducers, sealed, certificates, resume, shadow, rollback) across the eight lanes.
- [ ] Author READMEs for any remaining runtime code folders in scope.
- [ ] Repair the 8 structural defects in `runtime/tests/**` and `runtime/scripts/lib`.
- [ ] Strip the migration-history bodies from `runtime/lib/receipts-and-effect-recovery` and `runtime/lib/deep-loop`.
- [ ] Fix the `## 9A.` heading sequence and the merge-history tagline in `runtime/README.md`, sequenced against WS1 `032`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Coverage sweep: zero in-scope folders without a README, driven by the manifest-based auditor.
- [ ] Conformance check over `.opencode/skills/system-deep-loop/runtime/**` → zero blocking, existing and authored alike.
- [ ] Durability grep over `runtime/**` → zero matches; it must catch the `9A` heading, the merge-history tagline, and the two
      migration-history bodies if any survive.
- [ ] Whole-runtime vitest + tsc unchanged (no-regression guard).
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Every in-scope runtime folder carries a conforming README.
- [ ] All 14 recorded defects in existing runtime READMEs are closed.
- [ ] No runtime code or test file changed.
- [ ] `validate.sh --strict` passes.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation`
- Standard: sk-doc create-readme (code-README format)
- Upstream, hard: `sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement`
- Coordination: WS1 child `032-docs-drift-and-p2-batch` (`runtime/README.md`)
- Successor: `020-sk-code-opencode-alignment`
<!-- /ANCHOR:cross-refs -->
