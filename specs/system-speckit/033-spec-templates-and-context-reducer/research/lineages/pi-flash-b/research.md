# Deep Research Report — Reducer Engineering & $1.2M Agent Engineering Harness vs. system-speckit

**Lineage:** pi-flash-b | **Session:** fanout-pi-flash-b-1786517927558-l9mbmd | **Executor:** cli-pi (deepseek-v4-flash)
**Spec folder:** specs/system-speckit/033-spec-templates-and-context-reducer
**Loop:** 2/2 iterations, stopPolicy=max-iterations | **Convergence telemetry:** ratios 0.95 → 0.85 (newInfoRatio; stop policy override, telemetry only)

## 1. EXECUTIVE SUMMARY

The two external concepts were tested against three in-repo surfaces (templates, documentation logic, memory system). Verdict: **the Agent-Engineering harness patterns and the memory-system reducer already exist in production code** (5 of 7 findings classified `already-exists`); the genuine, quantified optimization opportunity is at the **template source surface**, where ~40% of the ~150 KB manifest tree is exact cross-level duplication that no gate currently measures or prevents.

Top recommendation: restructure the four multi-level manifest templates to a single ungated shared core + per-level gated addenda — the renderer already emits ungated content for every level, so the fix is authoring-only, zero renderer changes, ~40% template-source reduction, and it eliminates the variant-drift hazard.

## 2. METHOD

Two iterations, in-repo evidence only (no web). Iteration 1: measured template duplication with scripts over `templates/manifest/*.tmpl`; traced the scaffolding pipeline (`copy_template` → `inline-gate-renderer`); verified staleness governance. Iteration 2: audited the memory server (envelope token budgets, compact-merger), mapped the four harness patterns to in-repo equivalents, corrected iteration-1 classification, built shortlist + refutation. Every finding classified {already-exists / genuine-gap / not-applicable} with file:line evidence.

## 3. KEY QUESTIONS & ANSWERS

| Question | Answer | Evidence |
|---|---|---|
| Q1: Where do templates carry reducible weight? | Cross-variant core duplication: spec.md.tmpl L2/L3/L3+ = 72/60/53% exact L1-core dup; plan.md.tmpl = 73/58/49%; implementation-summary variants = 95/95/99%; checklist = 70/67% | spec.md.tmpl:1,146,345,592; plan.md.tmpl:202,341,625,1007; implementation-summary.md.tmpl:28,165,302,439; checklist.md.tmpl:28,178,400 |
| Q2: Which harness patterns exist vs gap? | All four exist: Default-FAIL → validate.sh `--strict`; fresh evaluator → deep-review + deterministic gates; handoff memory → `_memory.continuity` + handover.md; feature-at-a-time → plan phases + tasks.md | validate.sh:106,1252,1282; implementation-summary.md.tmpl:13; handover.md.tmpl:96 |
| Q3: What does the memory system already reduce? | Pre-merge selection (compact-merger) + envelope token budgets: overflow rows rendered compact (`compact:true`), never deleted, telemetried | context-server.ts:531-589; shared/compact-merger.ts |
| Q4: Shortlist + refutation? | S1-S4 shortlist (§11); R1-R5 refutations (§12) | iteration-002.md |

## 4. FINDINGS (tagged: axis × surface × classification)

### AXIS: token-reduction | SURFACE: templates/manifest

- **F1 — GENUINE-GAP:** Cross-level variant duplication is the dominant template weight driver. Four gated variants per file, each embedding a full copy of the shared core. Measured: spec.md.tmpl 72/60/53%; plan.md.tmpl 73/58/49%. Mechanism to fix already exists: `renderInlineGates()` emits all ungated lines for every level (inline-gate-renderer.ts:182-233), so a single ungated core + gated addenda works with zero renderer change. Caveat: `pendingInactiveGateBoundary` skips the first blank line after an inactive gate (inline-gate-renderer.ts:190-192) — cosmetic, needs a non-blank separator or one-line tweak.
- **F2 (corrected from iteration 1) — GENUINE-GAP:** Duplication extends to ALL four multi-level templates. implementation-summary.md.tmpl variants 2/3/4 = **95/95/99%** exact duplicates (547-line file with ~110 lines of real content); checklist.md.tmpl variants = **70/67%**. Combined: ~1,245 of ~3,093 manifest lines (~40%) are exact duplicates.
- **F5 — ALREADY-EXISTS:** The memory system implements the reducer playbook: compact-merger pre-merge selection + `compactEnvelopeResultRow` token-budget enforcement (overflow → identity+ranking only, stamped `compact:true`, never deleted, telemetried). Do not build a new context reducer.

### AXIS: plan-adherence | SURFACE: doc workflow / governance

- **F3 — GENUINE-GAP (small):** check-template-staleness.sh guards scaffold-vs-template drift only (SPECKIT_TEMPLATE_SOURCE version marker); it does NOT check intra-template variant agreement. A core edit applied to level:1 only silently produces level-divergent scaffolds. F1's restructure removes the failure mode; alternatively add a variant-agreement check.
- **F6 — ALREADY-EXISTS:** All four Agent-Engineering harness patterns map to production code (Default-FAIL / fresh evaluator / progress-handoff memory / feature-at-a-time) — see §3 Q2 table. No harness gap found.

### AXIS: general | SURFACE: governance / memory telemetry

- **F4 — ALREADY-EXISTS:** `copy_template` + `inline-gate-renderer` IS the deterministic reducer for the scaffolding path (one canonical source, code-only extraction, fail-closed). Do not reinvent.
- **F7 — GENUINE-GAP:** No declared template weight budget and no duplication metric anywhere in scripts/spec/. The reducer article's first playbook step ("measure raw input size") is unenforced for the repo's own template surface.

## 5. WHAT WORKED
- Exact-line duplication measurement across gated variants (scriptable, reproducible, file:line-evidenced).
- Tracing the renderer contract before recommending restructure (proved the ungated-core mechanism exists).
- Mapping harness patterns to concrete production files before claiming gaps.

## 6. WHAT FAILED
- Iteration-1 F2 classification ("not-applicable" for checklist/implementation-summary) was wrong — corrected in iteration 2 after measuring: they are the worst offenders (95-99% dup).

## 7. EXHAUSTED APPROACHES
- None (2-iteration budget; no approach repeated).

## 8. RULED OUT DIRECTIONS
- "Scaffolded docs inherit all 4 variants' token weight" — ruled out: renderer emits exactly one variant per level (inline-gate-renderer.ts:182-233).
- "Memory server needs a reducer" — ruled out: production compaction exists (F5).
- "Harness patterns missing" — ruled out: all four exist (F6).

## 9. DEAD ENDS (per-iteration)
- Iteration 1: naive cross-variant inheritance hypothesis refuted by renderer contract.
- Iteration 2: LLM-evaluator-for-docs and new-reducer proposals refuted by existing deterministic gates (R1, R2).

## 10. SATURATED DIRECTIONS & DIVERGENCE FRONTIER
- Saturated: template duplication measurement (all four multi-level templates quantified).
- Remaining frontier (not explored within budget): per-section necessity pass of the shared core prose (S3); sk-git commit integration for template restructure; sibling lineages' angles (composer/glm/grok/pi-flash-a/swe) for cross-validation.

## 11. RECOMMENDATIONS — RANKED IMPLEMENTABLE SHORTLIST

| Rank | Action | Axis | Surface | Expected impact | Classification |
|---|---|---|---|---|---|
| S1 | Restructure the 4 multi-level manifest templates: ONE ungated shared core + per-level gated addenda | token-reduction | templates/manifest | ~40% template-source cut (150→~90-95 KB); zero renderer change; removes variant-drift hazard (F3) | genuine-gap |
| S2 | Extend check-template-staleness.sh: (a) intra-template variant-agreement check; (b) declared template weight/dup-ratio budget with CI failure | plan-adherence + general | governance | Regressions visible; "measure raw input" enforced as a gate | genuine-gap |
| S3 | Post-S1 de-duplication of core guidance prose (keep placeholder intent, drop guidance restating SKILL.md) | token-reduction | templates/manifest | Additional core reduction; requires necessity pass, do not touch validated structure | genuine-gap |
| S4 | Export existing envelope-budget telemetry (rows compacted per query) as a metric | general | mcp-server | Makes memory_context reductions observable; machinery already exists | already-exists (metric missing) |

## 12. ELIMINATED ALTERNATIVES (refutation list)

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Fresh-context LLM evaluator agent for the doc workflow | Deterministic non-model gates (validate.sh --strict, staleness check) are stronger and cheaper for doc-shape verification; model review already exists in deep-review; new LLM evaluator adds cost + nondeterminism | validate.sh:106,1252,1282; deep-review skill | 2 |
| New deterministic reducer between deep-research workers and synthesis | reduce-state.cjs (3,170 L) + findings-registry + dashboard already implement the reducer contract (drop malformed, dedupe, surface agreement, delta refresh) | .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | 2 |
| Progress-file system for the doc workflow | `_memory.continuity` + handover.md + resume ladder + tasks.md already provide external memory surviving context windows | implementation-summary.md.tmpl:13; handover.md.tmpl:96 | 2 |
| Checkpoint git commits after every doc feature | Docs are not code; sk-git owns commits; deep-loop checkpoint commits are reference-only | loop-protocol.md §4b | 2 |
| More parallel workers for spec-kit scaffolding | Scaffolding is a single deterministic pipeline; fan-out adds cost, not coverage; the source article itself warns the fix is never more workers | scripts/lib/template-utils.sh:67-110 | 2 |
| "Scaffolded docs inherit all template variants' weight" | Renderer emits exactly one variant per level | inline-gate-renderer.ts:182-233 | 1 |

## 13. OPEN QUESTIONS
- Does the L1 core prose contain sections that duplicate SKILL.md guidance closely enough to cut (S3 necessity pass)? Not measured.
- Would sibling lineages (pi-flash-a, swe, glm, grok, composer) converge on the same S1/S2 ranking?

## 14. CONVERGENCE REPORT
- Stop reason: max_iterations (2/2), stopPolicy=max-iterations (convergence before that = telemetry only)
- Total iterations: 2 | Questions answered: 4/4
- Average newInfoRatio trend: 0.95 → 0.85 (declining, consistent with convergence toward a bounded finding set)

## 15. SOURCES
- .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1,146,345,592
- .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:202,341,625,1007
- .opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:28,165,302,439
- .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:28,178,400
- .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182-233
- .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:67-110
- .opencode/skills/system-spec-kit/scripts/spec/check-template-staleness.sh:1-30
- .opencode/skills/system-spec-kit/scripts/spec/validate.sh:106,1252,1282
- .opencode/skills/system-spec-kit/mcp-server/context-server.ts:531-589
- .opencode/skills/system-spec-kit/shared/compact-merger.ts
- .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs
- specs/system-speckit/033-spec-templates-and-context-reducer/context/Reducer Engineering.md
- specs/system-speckit/033-spec-templates-and-context-reducer/context/The $1.2M Agent Engineering skill.md

## 16. CONTAINMENT STATEMENT
All writes confined to specs/system-speckit/033-spec-templates-and-context-reducer/research/lineages/pi-flash-b/. No repository file outside the lineage dir was created, modified, renamed, or deleted. All investigation elsewhere was read-only.

## 17. HANDOFF NOTE
S1 requires only template-authoring work plus the renderer-blank-line caveat; S2 is a shell-script extension. Both are small, low-blast-radius follow-ups for the 033 packet's implementation phase. Nothing was implemented (report-only mandate).
