# Iteration 4 — Deep-Research-Specific Gaps Audit

## Summary
This iteration identified deep-research-specific quality gaps that the 118 deep-review audit would not have surfaced. The audit focused on research-loop semantics that differ intentionally from review-loop semantics, including single-dimension constraint enforcement, progressive synthesis behavior, negative knowledge tracking, question-entropy convergence, and research-specific quality guards. Found 3 P1 gaps and 2 P2 gaps requiring research-specific adaptations.

## Deep-Research vs Deep-Review Structural Comparison

### Canonical Companions Status

| Surface | Deep-Research | Deep-Review | Verdict |
|---------|---------------|-------------|---------|
| feature_catalog/ | ✅ 16 files (5 lifecycle, 3 state, 4 convergence, 2 research output) | ✅ 23 files (5 lifecycle, 5 state, 4 dimensions, 4 severity, 5 quality gates) | Both present, research has research-specific category |
| manual_testing_playbook/ | ✅ 34 scenarios across 6 categories | ✅ 63 scenarios across 8 categories | Both present, research has research-specific scenarios |
| references/ | ✅ 6 files (capability_matrix, convergence, loop_protocol, quick_reference, spec_check_protocol, state_format) | ✅ 4 files (convergence, loop_protocol, quick_reference, state_format) | Research has 2 extra references (capability_matrix, spec_check_protocol) |

**Verdict:** Canonical companions are present and at appropriate depth. No uplift needed for structure (C-020, C-021, C-022 from iter-2 are ALREADY-DONE).

### Reference Content Drift Analysis

| Reference | Deep-Research Signal | Deep-Review Signal | Drift? |
|-----------|---------------------|-------------------|--------|
| convergence.md | Question entropy (0.35 weight, 85%+ coverage) | Dimension coverage (0.45 weight, all 4 dimensions) | Intentional difference |
| convergence.md | Quality gates: source diversity, focus alignment, no single weak source | Quality gates: finding stability, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adjudication, fix completeness replay | Intentional difference |
| state_format.md | `newInfoRatio` (self-assessed novelty) | `newFindingsRatio` (severity-weighted) | Intentional difference |
| state_format.md | `answeredQuestions` (question coverage) | `findingsSummary` / `findingsNew` (severity counts) | Intentional difference |
| state_format.md | `ruledOut` (negative knowledge) | `findingDetails` (structured findings with disposition) | Intentional difference |

**Verdict:** All documented differences are intentional research-vs-review design choices. No drift found.

## Deep-Research-Specific Gaps

### DR-001 | P1 | Missing single-dimension constraint enforcement in reducer

**Scope:** reducer state validation

**File:** `.opencode/skills/deep-research/scripts/reduce-state.cjs`

**Evidence:** The reducer does not validate that iteration records adhere to the single-dimension constraint documented in v1.11.0.0 changelog. The changelog states "deep-research is single-dimension by design and does not produce the cross-dimension restatements," but the reducer accepts any `dimensions` array without validation.

**Fix:** Add a validation step in `reduce-state.cjs` that checks iteration records for multi-dimension patterns and either (a) rejects them with a clear error or (b) normalizes them to single-dimension before processing. This should be documented in `references/state_format.md` as a reducer invariant.

### DR-002 | P1 | Progressive synthesis lacks reducer guard for workflow ownership violation

**Scope:** progressive synthesis contract

**File:** `.opencode/skills/deep-research/scripts/reduce-state.cjs` + `references/state_format.md`

**Evidence:** The state_format reference says `research/research.md` is "workflow-owned canonical synthesis output" and "Updated incrementally only when `progressiveSynthesis` is enabled," but the reducer does not validate that the file's structure remains compliant with the 17-section canonical format when agents perform progressive updates. An agent could corrupt the structure during progressive writes, and the reducer would not detect it before final synthesis.

**Fix:** Add a reducer guard that validates `research/research.md` structure after each iteration when `progressiveSynthesis` is enabled. The guard should check for the 17 required sections and fail fast if the structure is corrupted. Document this guard in `references/loop_protocol.md` under the synthesis phase.

### DR-003 | P1 | Question-entropy convergence lacks uncovered-question tracking

**Scope:** convergence detection

**File:** `.opencode/skills/deep-research/references/convergence.md` + reducer

**Evidence:** The convergence reference defines question entropy as "85%+ questions answered signals saturation," but the reducer does not track which questions remain uncovered across iterations. The `answeredQuestions` field exists on iteration records, but there is no reducer-owned surface that lists the current set of unanswered questions to guide the next iteration's focus. This makes the 85% threshold opaque and hard to debug.

**Fix:** Add an `uncoveredQuestions` array to `findings-registry.json` that the reducer maintains by comparing the original `keyQuestions` from config against the cumulative `answeredQuestions` from all iterations. Surface this in the dashboard and use it to drive the "answer missing questions" recovery strategy in the legal-stop gate.

### DR-004 | P2 | Research charter validation (Non-Goals + Stop Conditions) not enforced in reducer

**Scope:** initialization validation

**File:** `.opencode/skills/deep-research/scripts/reduce-state.cjs` + `references/loop_protocol.md`

**Evidence:** The loop_protocol reference says initialization Step 7a validates that strategy.md contains "Non-Goals" and "Stop Conditions" sections (may be empty but must exist), and appends empty placeholders if missing. However, the reducer does not validate that these sections remain present after initialization. An agent could delete them during a strategy update, and the reducer would not detect the violation.

**Fix:** Add a reducer validation that checks for the presence of "## 4. Non-Goals" and "## 5. Stop Conditions" sections in strategy.md after each iteration. If missing, restore empty placeholders and emit a `guard_violation` event. Document this in `references/loop_protocol.md` as a reducer invariant.

### DR-005 | P2 | Negative knowledge (ruledOut) lacks cross-iteration deduplication

**Scope:** negative knowledge tracking

**File:** `.opencode/skills/deep-research/scripts/reduce-state.cjs` + `references/state_format.md`

**Evidence:** The state_format reference defines `ruledOut` as an array on iteration records with `approach`, `reason`, and `evidence` fields. The reducer promotes these into strategy and registry state, but it does not deduplicate across iterations. If iteration 3 rules out "HTTP/3 multiplexing" and iteration 5 also rules out "HTTP/3 multiplexing" with different evidence, both entries survive in the registry. This creates noise in the "Eliminated Alternatives" table during synthesis.

**Fix:** Add deduplication logic in the reducer that normalizes `approach` strings (slugify) and merges multiple `ruledOut` entries for the same approach, preserving all evidence sources. Document this merge behavior in `references/state_format.md` under the Negative Knowledge section.

## Research-Only Constructs Verified Healthy

### Progressive synthesis
- ✅ Documented in `state_format.md` as workflow-owned
- ✅ Config template sets `progressiveSynthesis: true` by default
- ✅ Manual playbook scenario DR-010 validates the contract
- ✅ Feature catalog entry 04--research-output/01-progressive-synthesis.md exists

### Negative knowledge
- ✅ Documented in `state_format.md` with `ruledOut` array schema
- ✅ Required in iteration files (Ruled Out + Dead Ends sections)
- ✅ Reducer promotes to strategy and registry
- ✅ Manual playbook scenario DR-026 validates synthesis survival
- ✅ Feature catalog entry 04--research-output/02-negative-knowledge.md exists

### Single-dimension constraint
- ✅ Documented in v1.11.0.0 changelog as design choice
- ✅ Anti-repetition rule added to SKILL.md CONSTRAINTS section
- ✅ H-7 dedup intentionally NOT applied (cross-dimension restatements don't exist)
- ⚠️ Missing reducer enforcement (DR-001)

### Question-entropy convergence
- ✅ Documented in `convergence.md` with 0.35 weight and 85% threshold
- ✅ Differs from deep-review's dimension coverage (intentional)
- ⚠️ Missing uncovered-question tracking (DR-003)

### Research-specific quality guards
- ✅ Source diversity, focus alignment, no single weak source documented
- ✅ Differ from deep-review's 7-gate bundle (intentional)
- ✅ Integrated into legal-stop gate bundle in `convergence.md`

## Recent Deep-Research Run Artifact Health

Sampled recent deep-research packet: `026-graph-and-context-optimization/000-release-cleanup/006-research/002-automation-reality-supplemental-research/`

### Artifact Structure
- ✅ Canonical state files present (config, state.jsonl, strategy, dashboard, registry)
- ✅ Iterations folder with 5 iteration files
- ✅ Deltas folder with 5 JSONL files
- ✅ Prompts folder with 5 prompt files
- ✅ Final `research-report.md` (not `research.md` - naming drift)

### Naming Drift Found
- ⚠️ Packet uses `research-report.md` instead of canonical `research.md`
- This is a packet-local drift, not a skill-level issue
- The workflow YAML may have been customized for this packet
- No action needed for skill-level uplift

### Content Health
- ✅ Iteration files have Focus, Findings, Sources, Reflection, Next Focus sections
- ✅ JSONL records have type, iteration, status, focus, newInfoRatio, noveltyJustification
- ✅ Convergence signals appear in later iterations
- ✅ Ruled Out sections present in iteration files
- ✅ Final synthesis consolidates findings into research-report.md

## Updated Cumulative Counts

| Verdict | After Iter-4 |
|---------|--------------|
| APPLY | 0 (all C-020/021/022 already done) |
| ADAPT | 5 (DR-001 through DR-005) |
| SKIP | 10 (unchanged from iter-3) |
| ALREADY-DONE | 27 (unchanged from iter-3) |
| NEW (research-specific) | 5 |

## Convergence Signal

- newFindings (research-specific gaps): 5 (3 P1 + 2 P2)
- newFindingsRatio (vs cumulative): 5/52 (9.6%)
- coverage gate: PASS (research-specific surfaces sampled)

## Next Iteration Focus

Iter-5 should:
1. Execute the 3 P1 research-specific fixes (DR-001, DR-002, DR-003)
2. Execute the 2 P2 research-specific fixes (DR-004, DR-005)
3. Validate that the fixes do not break existing deep-research runs
4. Consider whether any deep-review 118 learnings apply to the research-specific constructs (e.g., reducer validation patterns from deep-review's state_format.md)
