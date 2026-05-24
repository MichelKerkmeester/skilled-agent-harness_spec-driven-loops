## Multi-AI Council Report: Deep Skills Reference And Asset Alignment — Release Audit

### Task Classification
- **Type**: Release readiness audit (custom — release gate check)
- **Council Seats Dispatched**: 3: Analytical / DeepSeek, Critical / DeepSeek, Pragmatic / DeepSeek
- **Dispatch Mode**: In-CLI, single round, three internal seats
- **Vantage Integrity**: All seats are DeepSeek v4 pro via OpenCode CLI. No external AI systems participated. Honest single-vantage deliberation.

---

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| Seat 001 | Analytical | DeepSeek v4 pro | Contract auditor: verify every cross-reference claim against file inventory with line-level evidence | 95 |
| Seat 002 | Critical | DeepSeek v4 pro | Failure-mode reviewer: find the worst plausible consequence of every inconsistency | 90 |
| Seat 003 | Pragmatic | DeepSeek v4 pro | Release integrator: assess from operator workflow perspective; can someone ship this today? | 95 |

---

## Strategy Comparison

| Dimension | Weight | Seat 001 (Analytical) | Seat 002 (Critical) | Seat 003 (Pragmatic) |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 28 | 27 | 30 |
| Completeness | 20% | 20 | 19 | 19 |
| Elegance | 15% | 14 | 13 | 14 |
| Robustness | 20% | 18 | 19 | 17 |
| Integration | 15% | 14 | 13 | 14 |
| Pre-Critique Total | 100% | 94 | 91 | 94 |
| Post-Critique Adjustment | +/-10 | -1 | -2 | 0 |
| Final Total | 100% | 93 | 89 | 94 |

---

## Deliberation Notes

### Round 1 Independent Findings

**Seat 001 (Analytical)**: Six contract checks across all three skills. Three findings: F1 (convergence signal string mismatch in JSON template vs all other surfaces), F2 (registry name declared v(next) but not yet migrated), F3 (archive path drift in config template). All three are cosmetic template inconsistencies. Found the target packet, deep-ai-council, deep-research, and deep-review to be internally consistent on all material contracts. Verdict: READY AS-IS.

**Seat 002 (Critical)**: Worst-case failure-mode analysis on all three findings. No plausible failure chain leads to broken operator workflows. The convergence signal mismatch could theoretically confuse a hand-crafted config parser, but canonical scripts don't read the template. The triple-failure scenario (all three drifts simultaneously) is contrived. Verdict: READY AS-IS.

**Seat 003 (Pragmatic)**: Operator's-eye workflow verification. All three skills' documented quick-start paths work correctly. At no point does an operator following the docs encounter any of the three drifts. Optional 2-line patch available for operators who want absolute cleanliness. Verdict: READY AS-IS.

### Round 2 Cross-Critique

**Seat 002 → Seat 001**: The convergence signal mismatch is MINOR-DOC, not MATERIAL. The script hardcodes the correct value; the JSON template is an example that scripts overwrite. → Seat 001 accepted downgrade. (-1 adjustment)

**Seat 003 → Seat 002**: The triple-failure scenario (all three drifts striking simultaneously) is analytically correct but operationally irrelevant — it requires ignoring workflow tooling for all three skills. → Seat 002 acknowledged it was a completeness check, not a practical argument. (-2 adjustment)

**Convergence check**: All three seats agree on the material plan. No unresolved high-severity disagreements. The convergence is genuine — each seat approached from a fundamentally different angle and independently arrived at the same conclusion.

---

## Recommended Plan

### READY AS-IS

The documentation and resource alignment work across all three deep skills is release-ready. Phase 8 validation passes all gates. The three cosmetic template drifts found during this audit are documentation-only inconsistencies in JSON config templates — they do not affect runtime behavior, script correctness, or operator workflows. The Phase 9 deep-research gate is correctly in place, waiting for human approval.

**For operators who want absolute template cleanliness before tagging**, two optional one-line patches are available (see Implementation Steps). These are cosmetic only and can be applied before or after tagging without changing behavior.

**No blockers exist.** The alignment work achieved its goal: three deep skills now present a predictable, comparable resource family while preserving distinct council, research, and review domain vocabulary.

---

## Implementation Steps

### Optional cosmetic patches (not required for release):

1. **Patch deep-ai-council config template** — `assets/deep_ai_council_config.json` line 11: Change `"two-of-three-agree-with-no-surviving-blocker"` to `"two-of-three-agree"` to match all other surfaces (references, README, SKILL.md, persist-artifacts.cjs). (Source: All three seats)

2. **Patch deep-research config template** — `assets/deep_research_config.json` line 59: Change `"archiveRoot": "research/archive"` to `"archiveRoot": "research_archive"` to match README, workflow YAML, and v1.6.2.0 changelog. (Source: All three seats)

### Release steps (apply regardless of patches):

3. **Approve Phase 9 gate** — The Phase 9 deep-research loop is correctly gated. After human approval, the `CHK-151` checklist item should be marked complete. (Source: Seat 001, verified against spec.md, plan.md, checklist.md, implementation-summary.md)

4. **Tag the release** — The three skill versions (deep-ai-council 2.2.0.0, deep-research 1.13.0.0, deep-review 1.10.1.0) are ready to tag. (Source: All three seats)

---

## Prerequisites

- [x] All three skills pass sk-doc quick validation
- [x] All three skills pass sk-doc document validation
- [x] JSON/YAML assets parse correctly
- [x] Resource-map paths resolve
- [x] Strict spec validation passes for target packet
- [x] Skill advisor routes all three skills above threshold 0.8
- [ ] Human approval for Phase 9 (CHK-151)

---

## Plan Confidence

- **Overall**: 93%
- **Strategy Agreement**: All three seats (100%) agree the release is ready
- **Consensus Quality**: STRONG — genuine cross-perspective convergence, not artificial agreement
- **Risk Level**: LOW — three cosmetic template drifts with zero operational impact

---

## Dropped Alternatives

- **BLOCKED — perfect templates before release** (rejected by all seats): Would delay Phase 9 for cosmetic template fixes that change zero behavior. The 2-line patch can be applied opportunistically.
- **READY AFTER SMALL PATCH** (Seat 001 initially considered, then accepted READY AS-IS): The patch is valid but not a blocker. The release's value is in the documentation alignment, not in template example strings.

---

## Risks & Mitigations

| Risk | Class | Mitigation |
| --- | --- | --- |
| Operator copies stale JSON template for hand-crafted config | MINOR-DOC | Scripts write canonical config; templates are examples. This report documents the drift so operators are aware. |
| Future developer builds against v(next) registry name before migration | DOCUMENTED-FUTURE | SKILL.md explicitly labels it v(next). The reducer writes the current name. No consumer is broken today. |
| Archive path mismatch on restart lifecycle with hand-crafted config | MINOR-DOC | YAML workflow auto-generates config with correct path. Hand-crafted config users would need to override. |
| Phase 9 starts without approval | GATED | CHK-151 remains unchecked; spec, plan, checklist, and implementation-summary all carry the gate. |

---

## Planning-Only Boundary

- No files outside `ai-council/**` were modified by this council run.
- The three findings (F1, F2, F3) are documented here for operator awareness; no patches were applied.
- This report is a recommendation for operator review. Implementation (patches, tagging, Phase 9 approval) remains with the operator or implementation agents.

---

## Artifact Map

| Artifact | Path |
| --- | --- |
| Config | `ai-council/ai-council-config.json` |
| Strategy | `ai-council/ai-council-strategy.md` |
| State log | `ai-council/ai-council-state.jsonl` |
| Seat 001 | `ai-council/seats/round-001/seat-001-analytical-contract-auditor.md` |
| Seat 002 | `ai-council/seats/round-001/seat-002-critical-failure-mode-reviewer.md` |
| Seat 003 | `ai-council/seats/round-001/seat-003-pragmatic-release-integrator.md` |
| Deliberation | `ai-council/deliberations/round-001.md` |
| Council report | `ai-council/council-report.md` |
