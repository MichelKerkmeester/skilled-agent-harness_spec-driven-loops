---
title: Deep Review Strategy - Jev killed-code deletion
description: Review strategy for verifying the killed Jev feature code is gone and no reference outside spec folders remains.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Verify the killed and retired Jev feature code is fully deleted and nothing outside `specs/` still references or depends on it. Deleted scorers: `score-jev-tiebreak.mjs`, `score-suggested-order.mjs` (system-skill-advisor), `score-goal-lint.cjs` (sk-doc sk-create-goal), `score-stop-rater.cjs`, `score-stop-hint.cjs`, `score-severity-replay.cjs` (system-deep-loop runtime), `score-residue-flagger.cjs` (deep-review), `score-completion-claims.mjs`, `score-debug-next-check.mjs` (system-spec-kit runtime). The Jev arm was stripped from `leaf-route-replay.cjs` and `hvr_reader_lens.py`, and a Jev gate line from `score-verifier-labeled-set.cjs`. Eight helpers moved into `cli-classifier/benchmark/pi-transport/replay-helpers.mjs`. Commits ec7be335a2, 0141a86303, 89a42bc0cd, 0fed879630, b01717623e, 0e0ba04131, d48913df93, d4d3d0e0b4.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Anything under `specs/`: phase folders, goal logs and research keep the record by design.
- `changelog/` files: release history stays as written.
- Labeled data rows (`*.jsonl` label files, `~/.skilled/.labels`) that cite old paths as data.
- The quality of the surviving features beyond whether the deletion broke them.
- Security: no auth, input or secret surface changed.

---

## 5. STOP CONDITIONS
- Three iterations, stop policy max-iterations: one pass each for correctness, traceability and maintainability.
- A P0 (a live script that imports or spawns a deleted file) is reported at once and does not end the session.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 1
- Resolved: 1

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Cross-checking a live count against the owning script run beat grepping docs (iteration 2)
- Running the fleet metadata gate in check mode isolated the sole stale root and cleared the other four (iteration 2)

---

## 9. WHAT FAILED
- `timeout` is absent on this macOS host; run the script directly (iteration 2)
- `rg -E` is invalid ripgrep syntax (it means --encoding); use default regex (iteration 2)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Stale generated metadata in sk-doc/system-deep-loop/system-spec-kit/cli-classifier: check-mode gate passes all four (iteration 2)
- Deleted scenario ids in routing gold/benchmark files: no DLR-056/DLR-057/DLR-058/DRV-069 outside specs//changelog/ (iteration 2)
- Generated retrieval fixtures and README baselines pointing at dead .skilled paths: rows key to surviving spec folders (iterations 1-2)
- Broken markdown links to deleted targets: zero across the in-scope docs (iteration 2)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- The deleting session ran a done-check grep per skill and cleared it except for generated files, which it then regenerated (trigger index, retrieval fixtures, Hermes copies, compiled-route manifests, sk-doc README baselines).
- Suites passed after the deletion. A cross-family review found one stale count, fixed in d4d3d0e0b4, and one pre-existing stale gold count (the sk-doc catalog says 56 leaf-route gold rows, the replay reports 59).
- 005's compaction harness had no Jev arm. Its Jev mentions describe the vendored compaction procedure and are expected.
- Runtime mirrors exist beyond `.skilled/`: `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/` and `.hermes/` may hold symlinks or generated copies. Check whether each is a link or a copy before reporting it.

### Deleted paths (search the whole repo outside specs/ for each basename)

- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/tie-break-eval.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/tie-break-eval.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md`
- `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs`
- `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/residue-flagger-measurement.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md`
- `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`
- `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-rater-replay.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs`
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/README.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-edge.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-bad-value.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-class-gate.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-headroom.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-unknown-id.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/per-word-split-edge.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/per-word-split-happy.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/verdict-keep-labels.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/verdict-kill-labels.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/verdict-kill-rows.jsonl`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | replay + disk counts verified; deleted basenames absent |
| `checklist_evidence` | core | partial | 2 | no packet checklist names a deleted artifact; commits cross-checked |
| `skill_agent` | overlay | pass | 2 | SKILL.md/README/commands/agents clean |
| `agent_cross_runtime` | overlay | pass | 2 | mirrors carry no deleted file or independent stale copy |
| `feature_catalog_code` | overlay | partial | 2 | R2-P2-001: two sk-doc catalog docs claim 56 gold rows, replay reports 59 |
| `playbook_capability` | overlay | pass | 2 | no surviving playbook names a deleted scorer or scenario |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/runtime/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-deep-loop/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-skill-advisor/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-spec-kit/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/skills/system-spec-kit/SKILL.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10 (stop policy max-iterations, telemetry only)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-04T07:44:47.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence. overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-04T07:44:47.000Z
<!-- MACHINE-OWNED: END -->

---

resource-map.md not present; skipping coverage gate.
