# Iteration 002 — Memory/context system + Agent-Engineering harness mapping; shortlist & refutation

**Focus:** Verify what the context/memory system already reduces (compact-merger, envelope token budgets, resume mode); map the $1.2M Agent-Engineering harness patterns (Default-FAIL, fresh-context evaluator, progress/handoff memory, feature-at-a-time) against the doc workflow and deep-loop baselines; correct iteration-1 F2; produce ranked shortlist + refutation list.
**Status:** complete | **newInfoRatio:** 0.85 (new: memory-system reducer evidence, harness-pattern mapping, corrected F2, shortlist/refutation)

## Findings

### F5 — [AXIS: token-reduction | SURFACE: mcp-server + shared] The memory system already implements the Reducer-Engineering playbook — ALREADY-EXISTS (do not reinvent)

- `shared/compact-merger.ts` (pre-merge selection, budget allocator, provenance, anti-feedback guards) is wired into `mcp-server/lib/context/shared-payload.ts` and the `compact-inject` hook — a deterministic pre-merge reducer between DB rows and the model.
- `mcp-server/context-server.ts:531-589` (`compactEnvelopeResultRow`, token-budget enforcement): when a result envelope exceeds its token budget, overflow rows are rendered **compact (identity + ranking fields, heavy explainability payload dropped)** and stamped `compact: true`; rows are never silently deleted and truncation is telemetried. This is exactly the article's "keep the best version, note what was dropped, never silently absorb" contract (context/Reducer Engineering.md §3, §4).
- `memory_context` `mode=resume` (context-server.ts:1024, 1061) and session-quality gating (line 919) provide the bounded-context path.

Implication: any recommendation to build a "context reducer" for the memory system would duplicate production code. The remaining lever is at the TEMPLATE surface (F1/F2), not the memory server.

### F6 — [AXIS: plan-adherence | SURFACE: doc workflow] All four harness patterns already exist in the doc workflow — ALREADY-EXISTS

| Harness pattern (context/The $1.2M Agent Engineering skill.md) | In-repo equivalent | Evidence |
|---|---|---|
| Default-FAIL (criteria start false; evidence to close) | validate.sh `--strict` (warnings as errors), result summary errors/warnings/passed, completion rule requiring checklist + validate | scripts/spec/validate.sh:106, 1252, 1282; framework Completion Verification Rule |
| Fresh-context evaluator (separate, read-only) | deep-review fresh-context reviewers; plus deterministic non-model gates (validate.sh, check-template-staleness.sh) which are STRONGER than a model evaluator for doc shape | .opencode/skills/system-deep-loop/deep-review/; loop-protocol.md references |
| Progress/handoff external memory | `_memory.continuity` frontmatter in implementation-summary.md.tmpl:13,150,287,424; handover.md.tmpl:96,141-142; resume ladder (handover → continuity → canonical docs) | templates/manifest/implementation-summary.md.tmpl:13; handover.md.tmpl:96 |
| Feature-at-a-time + commit per feature | plan.md.tmpl phases (Phase 1-3) + tasks.md; git commits are owned by sk-git; deep-loop checkpoint commits are reference-only (loop-protocol.md §4b) | plan.md.tmpl:114-135; loop-protocol.md §4b |

### F2-CORRECTION — [AXIS: token-reduction | SURFACE: templates/manifest] Duplication extends to ALL four multi-level templates — reclassified GENUINE-GAP (was not-applicable in iteration 1)

Measured exact-line duplication vs first variant:
- implementation-summary.md.tmpl (547 L): variants 2/3/4 = **95% / 95% / 99%** exact duplicates (variants are near-identical copies; only tiny addenda differ)
- checklist.md.tmpl (593 L): variants 2/3 = **70% / 67%** duplicates
- spec.md.tmpl (874 L): L2/L3/L3+ = 72% / 60% / 53% (iteration 1)
- plan.md.tmpl (1079 L): L2/L3/L3+ = 73% / 58% / 49% (iteration 1)

Total manifest tree ~150 KB; **~40% of lines are exact cross-variant duplicates** (~1,245 of ~3,093). implementation-summary.md.tmpl is the worst offender — a 547-line file whose real content is ~110 lines. The ungated-core restructure (F1) applies to all four; expected combined reduction roughly 150 KB → 90-95 KB with zero renderer changes.

### F7 — [AXIS: general | SURFACE: governance] No declared template-weight budget and no intra-variant agreement check — GENUINE-GAP (small, high leverage)

check-template-staleness.sh guards scaffold-vs-template drift only (F3). There is no declared budget for template size (no maxTemplateBytes / maxDupRatio anywhere in scripts/spec/). The reducer article's playbook step is "measure raw input size before optimizing anything else" (context/Reducer Engineering.md §8); the repo measures nothing for its own template surface today. A weight/duplication metric in the staleness checker (report bytes + dup ratio per .tmpl; fail when a variant's dup ratio exceeds a declared ceiling) makes regressions visible in CI.

## Ranked implementable shortlist (all report-only)

1. **S1 (token-reduction, templates):** Restructure the four multi-level manifest templates to ONE ungated shared core + per-level gated addenda (mechanism exists: inline-gate-renderer.ts:182-233 emits ungated content for every level). Cuts template source ~40%; zero renderer change; removes the drift hazard behind F3. Watch the `pendingInactiveGateBoundary` blank-line skip (inline-gate-renderer.ts:190-192).
2. **S2 (plan-adherence, governance):** Extend check-template-staleness.sh with (a) intra-template variant-agreement check and (b) declared template weight/dup-ratio budget with CI failure. Implements "measure raw input" as an enforced gate.
3. **S3 (token-reduction, templates):** After S1, de-duplicate guidance prose inside the core itself (the L1 core in spec.md.tmpl:30-143 is 143 lines of mostly instructional placeholder text; keep placeholders that carry requirements intent, drop restated guidance that duplicates SKILL.md sections). Requires a per-section necessity pass; do not touch validated structure.
4. **S4 (general, memory):** Expose the existing envelope-budget telemetry (context-server.ts:543-589) as a metric (rows compacted per query) so the "measure first" playbook applies to memory_context too. Optional; the reduction machinery already exists.

## Refutation list (concepts that do NOT transfer)

| # | Candidate concept | Verdict | Evidence |
|---|---|---|---|
| R1 | Add a fresh-context LLM evaluator agent to the doc workflow | Refuted — deterministic non-model gates (validate.sh --strict, staleness check) are stronger and cheaper for doc-shape verification; model-level review already exists in deep-review. A new LLM evaluator adds cost and nondeterminism | validate.sh:106,1252,1282; deep-review skill |
| R2 | Build a deterministic reducer between deep-research workers and synthesis | Refuted — reduce-state.cjs (3,170 L) + findings-registry.json + dashboard reducer already implement the article's reducer contract (drop malformed, dedupe, surface agreement, emit deltas) | .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs |
| R3 | Add a progress-file system to the doc workflow | Refuted — `_memory.continuity` + handover.md + resume ladder + tasks.md already provide external memory surviving context windows | implementation-summary.md.tmpl:13; handover.md.tmpl:96 |
| R4 | Checkpoint git commits after every doc feature | Not-applicable for docs (docs are not code; sk-git owns commits); reference-only in deep-loop today (loop-protocol.md §4b) | loop-protocol.md §4b |
| R5 | "More parallel workers" for spec-kit scaffolding | Refuted — scaffolding is a single deterministic pipeline (create.sh + renderer); fan-out would add cost, not coverage; the article itself warns the fix is never more workers | scripts/lib/template-utils.sh:67-110 |

## Dead ends / ruled out
- "Memory server needs a reducer" — ruled out: production compaction already exists (F5).
- "Harness patterns missing from doc workflow" — ruled out: all four patterns have in-repo equivalents (F6).

## Sources
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:531-589]
- [SOURCE: .opencode/skills/system-spec-kit/shared/compact-merger.ts:1-40]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:106,1252,1282]
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:28,165,302,439]
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:28,178,400]
- [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs]
- [SOURCE: specs/system-speckit/033-spec-templates-and-context-reducer/context/Reducer Engineering.md §3,4,8]
- [SOURCE: specs/system-speckit/033-spec-templates-and-context-reducer/context/The $1.2M Agent Engineering skill.md]
