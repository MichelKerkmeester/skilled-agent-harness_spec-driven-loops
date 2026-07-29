<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Combo Test Matrix + Ambient-Config Isolation

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: In Progress — leaf 1 (pi extension isolation) built and gated; leaves 2-3 pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Confirm read-only pi never invokes skills (its tool allowlist is read-only file ops), so disabling extensions/skills/templates is behavior-preserving.
- [x] Confirm pi supports `--no-extensions`/`--no-skills`/`--no-prompt-templates` (from `pi --help`).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Leaf 1 — add `--no-extensions --no-skills --no-prompt-templates` to the read-only branch of the shared pi builder.
- [x] Leaf 1 — update the exact-arg pi read-only assertions in the fan-out, model-benchmark, and ai-council suites.
- [ ] Leaf 2 — build the combo coverage matrix (every kind × model × mode; assert construction or log a skip).
- [ ] Leaf 3 — cursor/devin/MCP ambient-config isolation for read-only leaves/seats.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Leaf 1: fan-out 93/93, model-benchmark 35/35, ai-council 106/106; whole-runtime tsc 0.
- [x] Leaf 1: live pi accepts the new flags (no rejection) and writes nothing (git status unchanged).
- [ ] Leaf 2-3 built + verified.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Read-only pi is hermetic against auto-loaded extensions/skills/templates.
- [ ] The combo matrix logs every combination and skip; ambient-config isolation is verified for all read-only executors.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/043-cli-executor-fanout-parity`
- Predecessor: `004-per-mode-executor-parity`; successor: `006-docs-closeout`
- Code: `runtime/scripts/fanout-run.cjs` (pi read-only builder) + the three exact-arg suites
<!-- /ANCHOR:cross-refs -->
