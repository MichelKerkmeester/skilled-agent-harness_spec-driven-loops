---
title: "Implementation Summary"
description: "deep-context ships as the 4th deep loop and 3rd deep-loop-runtime consumer: a heterogeneous-parallel, inward codebase-context loop with a loop_type='context' coverage-graph extension and cross-executor-agreement convergence that produces a reuse-first Context Report."
trigger_phrases:
  - "deep-context implementation"
  - "context loop summary"
  - "implementation"
  - "summary"
  - "impl summary core"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering"
    last_updated_at: "2026-06-06T23:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 5: skill-advisor registered + synced to Barter v3.5 mirror"
    next_safe_action: "Operator: run a live /deep:start-context-loop on a real feature"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/graph-metadata.json"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
    session_dedup:
      fingerprint: "sha256:1aecb6c05c8afddbea2821d951fa97eec42d3241a133b2c0cd0c60677edc6667"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Coverage-graph context layer + convergence implemented and tested"
      - "deep-context skill, command, and agent shipped"
      - "Phase 4 alignment, catalog/playbook, and Barter integration verified"
      - "Phase 5: skill-advisor returns deep-context #1 in Public and Barter v3.5"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 134-deep-context-gathering |
| **Status** | Complete |
| **Completed** | 2026-06-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

deep-context is now the fourth deep loop and the third consumer of `deep-loop-runtime`. It runs an inward, iterative sweep of the existing codebase, dispatching a heterogeneous pool of executors in parallel over a shared scope, and synthesizes a reuse-first Context Report you can feed straight into `/speckit:plan` or `/speckit:implement`. Where research looks outward and review audits, deep-context answers "what already exists that I should reuse, and where does this change plug in."

### Heterogeneous-parallel context loop

You can now run `/deep:start-context-loop` to map the repository surface relevant to a feature. The loop seeds a frontier from the code graph, partitions it into slices, and dispatches native Task seats together with cli-opencode and cli-codex executors over the shared scope by-model. Native seats run as a parallel batch through the council scaffold `dispatchCouncilSeats` concurrently with the CLI pool, so a heterogeneous sweep finishes in roughly the slowest-executor time rather than the sum. Each executor is framed for its strengths via the new `promptFramework` lineage field.

### Cross-executor-agreement convergence

Convergence is distinct from the other loops. Instead of research's novelty signal or review's severity weighting, deep-context stops when a heterogeneous pool has independently agreed on the relevant surface and noise is not inflating progress. Five context signals drive this: `sliceCoverage`, `reuseCatalogCoverage` (weighted highest, because reusing existing code is the repo principle), `newCoverage/agreementRate` cross-executor agreement (a blocking guard requiring at least 2 executors), `relevanceFloor` (a blocking guard with a 0.55 gate), and `dependencyCompleteness`. The saturation threshold is 0.10, with a max-iteration cap and deadlock detector as legal stops.

### loop_type='context' coverage-graph extension

The shared coverage graph now expresses a third loop type. `coverage-graph-db.ts` adds `'context'` to the `LoopType` union, `VALID_KINDS`, `VALID_RELATIONS`, and the CHECK constraints, defines `ContextNodeKind`/`ContextRelation` and `CONTEXT_WEIGHTS`, and bumps `SCHEMA_VERSION` from 2 to 3. `coverage-graph-signals.ts` gains `computeContextSignals` and `computeContextSignalsFromData`; `coverage-graph-query.ts` gains a context gap branch; `convergence.cjs` gains `evaluateContext`. Because the graph is a regenerable per-session cache, the version bump uses the runtime's existing drop-and-recreate migration with no durable data at risk.

### The deep-context skill, command, and agent

deep-context ships as a full runtime consumer mirroring deep-research: a `SKILL.md` (DQI 88) with references and assets, the `/deep:start-context-loop` command with auto and confirm workflow YAMLs, and a `@deep-context` LEAF read-only analyzer agent. The seats are read-only by contract and the host writes all merged state (the report, attribution, cross-lineage graph upserts, convergence), so the consumed report can never be corrupted by a sub-agent and the design stays Gate-3-safe.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build was staged behind the ownership ADR. We authored `decision-record.md` first (ADR-001 through ADR-008) to authorize the shared-schema change, then extended the coverage-graph layer, then layered convergence and the skill/command/agent on top. Every context addition dispatches on `loop_type='context'` so research and review paths stay inert.

Verification ran at three levels. The coverage-graph vitest suite passes 99/99 with the context kinds, relations, weights, and signal math confirmed by unit tests. The executor-config suite passes 36/36 with the `promptFramework` field. An end-to-end convergence smoke run is green, exercising `evaluateContext` with its agreement and relevance guards. The one remaining step before a 100% claim is a heterogeneous smoke run on a real target that produces a code-graph-verified Context Report, plus the final `validate.sh --strict` reconcile across these docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Register deep-context as the 3rd deep-loop-runtime consumer | Reuses 10 tested libs, one executor pool, and one coverage-graph contract instead of duplicating the machinery |
| Extend the coverage graph with `loop_type='context'`, SCHEMA_VERSION 2 to 3 | The graph is a regenerable cache, so the drop/recreate migration loses no durable data while keeping research/review rows valid |
| Converge on by-model shared-scope cross-executor agreement + a relevance gate | Agreement-on-relevant-surface is what "enough context" means; novelty and severity are the wrong signals for an inward task |
| Realize native parallelism via `dispatchCouncilSeats` concurrent with the CLI pool | Gets true native-parallel for deep-context now without regressing research/review's tested sequential fan-out (backport is a tracked follow-up) |
| Add a `promptFramework` lineage field | A mixed-model pool needs per-model framing (COSTAR vs TIDD-EC) from one config knob, not a forked prompt pack |
| Read-only analyzer seats + host-writes-state | The consumed report must have a single uncorrupted writer; this is the reducer-owned-files pattern and is Gate-3-safe |
| No new MCP tools | The runtime isolation ADR forbids it; Code Graph MCP + Grep/Read fully cover seeding and ref resolution |
| Defer cli-devin agent-config wiring out of the default pool | A validated default pool (native + cli-opencode + cli-codex) matters more than maximal diversity for the first real runs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Coverage-graph vitest suite | PASS, 99/99 |
| Context signal unit math | PASS, confirmed against expected values |
| Executor-config vitest suite | PASS, 36/36 (promptFramework field) |
| e2e convergence smoke (`evaluateContext`) | PASS, green |
| SCHEMA_VERSION + LoopType in coverage-graph-db.ts | PASS, SCHEMA_VERSION = 3, LoopType includes `'context'` |
| Heterogeneous smoke run on a real target | PENDING (follow-on operator step) |
| `validate.sh --strict` doc reconcile | PASS (0 errors, 0 warnings; 2026-06-06) |
| Skill-advisor returns deep-context #1 (Public + Barter v3.5) | PASS |
| Barter v3.5 mirror sync (skill/agent/command/runtime/advisor) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Heterogeneous smoke run on a real target is pending.** The unit and e2e convergence suites are green, but the end-to-end `/deep:start-context-loop` run that emits a code-graph-verified Context Report has not yet been executed, so SC-001 and SC-003 remain unconfirmed in the field.
2. **Native-parallel is realized via the council scaffold, not the shared fan-out.** deep-context gets true native parallelism through `dispatchCouncilSeats`, but research and review keep their sequential-native fan-out. The backport to a single unified dispatch path is a tracked follow-up, deliberately out of scope here to avoid regressing their tested workflows.
3. **Convergence threshold (0.10) is a calibration default.** Slice granularity and the threshold/bands need tuning against 2-3 real targets; the shipped values are reconciled defaults, not final calibrations.
4. **cli-devin is not in the default pool.** Its agent-config wiring is deferred until validated for the read-only analyzer role. The default pool is native + cli-opencode + cli-codex, which satisfies the minimum-2-executor agreement requirement.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:phase-alignment -->
## Phase: Alignment, Catalog/Playbook & Barter Integration (Complete)

With the loop itself built and verified, this phase makes deep-context look and behave like its sibling deep skills and carries it into Barter. All work is complete and verified. Nothing here changes loop behavior or the coverage-graph schema.

### Aligning the skill to sk-doc and sk-code conventions

deep-context shipped functional but ahead of the convention pass the other deep skills already went through. We are adding the smart-router section to its SKILL.md so it routes and reads like the sk-doc layout, giving every `references/` and `assets/` markdown file the required frontmatter, authoring a skill-root `README.md` and a `scripts/README.md`, and bringing the `reduce-state.cjs` header and the skill `config` in line with sk-code `:opencode` conventions. The point is that a reader who knows deep-research or deep-review should find deep-context laid out the same way.

### Feature Catalog and Manual Testing Playbook packages

The sibling deep skills each ship a Feature Catalog and a Manual Testing Playbook. deep-context is getting both, mirroring those package shapes, so operators have a capability catalog to scan and a repeatable manual test procedure to run.

### Barter integration

deep-context is being propagated into Barter. We refresh Barter's `@deep-context` agent and `/deep:start-context-loop` command to match the finalized Public versions, then wire deep-context as an AI-offered optional add-on step into Barter's `/speckit:complete` and `/speckit:plan` so a planning or completion run can opt into a context loop. Finally we sync the finalized Public deep-context skill and the deep-loop-runtime into Barter and verify that Barter's runtime accepts `loop_type='context'` and that Barter's speckit commands carry the optional step.

### Status

Complete. All CHK-200 through CHK-210 verification items passed. Verification evidence:

- SKILL.md: DQI 99 ("excellent") with smart-router section (`route_deep_context_resources` and sibling routing functions); `version: 1.0.0`.
- `references/{loop_protocol,convergence}.md` + `assets/context_report_template.md`: reframed to sk-doc template (frontmatter + 1-2 sentence intro + `## 1. OVERVIEW`).
- `README.md` (skill_readme_template) and `scripts/README.md` (code-README pattern) created.
- `scripts/reduce-state.cjs`: sk-code boxed header; `node --check` OK. `assets/deep_context_config.json`: pure JSON (parseable).
- `feature_catalog/`: 21 files (root + 6 categories + 20 per-feature), each with frontmatter + trigger_phrases + OVERVIEW/HOW IT WORKS/SOURCE FILES/SOURCE METADATA.
- `manual_testing_playbook/`: 21 files (root + 6 categories + 20 scenarios FS/SWEEP/MERGE/CONV/SYN/CG), each with OVERVIEW/SCENARIO CONTRACT/TEST EXECUTION/SOURCE FILES/SOURCE METADATA; root has EXECUTION POLICY + cross-ref index; 0 packet-number leaks.
- deep-loop-runtime vitest: 287/287 pass (clean glob).
- Barter integration: `Barter/.opencode` is a symlink to `Public/.opencode`; skill/command/agent/runtime are shared automatically; `:with-context` optional deep-context add-on is live on `/speckit:complete` + `/speckit:plan`.
- Packet `validate.sh --strict`: PASSED (0 errors, 0 warnings).
<!-- /ANCHOR:phase-alignment -->

---

<!-- ANCHOR:phase-advisor-barter -->
## Phase: Skill-Advisor Registration & Barter v3.5 Mirror Sync (Complete)

After the alignment phase, two integration gaps remained: deep-context was not registered in the skill-advisor graph, and the standalone `Barter | v3.5` mirror (a separate rsync mirror, distinct from the symlinked AI_Systems Barter) did not carry the skill. Both are now closed.

### Skill-advisor registration (Public)

deep-context was invisible to the advisor because it had no `graph-metadata.json` and no Keywords line. We authored `skills/deep-context/graph-metadata.json` (schema 2, family `deep-loop`, category `autonomous-loop`, with every edge target a known skill and every key_files, source_docs, and entities path verified to exist), added the `<!-- Keywords: -->` line to SKILL.md, and added reciprocal deep-context sibling edges to deep-research, deep-review, deep-ai-council, and deep-loop-runtime (plus a runtime `enhances` edge) so the graph stays symmetric. Recompiling and re-indexing the live SQLite brought the graph to 22 skills with deep-context as a hub skill, and the advisor now returns deep-context as the #1 recommendation for context-gathering prompts (confidence 0.85 to 0.92).

### Barter v3.5 mirror sync

We synced the full deep-context skill (52 files, full parity), the `@deep-context` agent, the `/deep:start-context-loop` command with both workflow YAMLs, and the changelog symlink into `Barter | v3.5/coder/.opencode`. Because deep-context depends on the runtime's context support, we also synced the 12 content-changed `deep-loop-runtime` files (the `loop_type='context'` coverage-graph, convergence, and script changes) and the three sibling `graph-metadata.json` files (verified to differ from Barter only by the new deep-context edges). The mirror's advisor graph is SQLite-only with no JSON runtime fallback, so we re-indexed its SQLite directly with `indexSkillMetadata`. Barter's advisor now reports healthy with deep-context as the #1 recommendation (a stale `cli-gemini` node was pruned in the process). Finally we copied the `:with-context` speckit add-on into Barter's `/speckit:complete` and `/speckit:plan`.

### Status

Complete. All CHK-300 through CHK-309 items passed. Both the Public and Barter v3.5 advisors return deep-context as the top recommendation, all synced scripts pass `node --check`, the changelog symlink resolves, and `validate.sh --strict` is green.
<!-- /ANCHOR:phase-advisor-barter -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
