---
title: Deep Review Strategy - Session Tracking
description: Review strategy for the 034-spec-template-context-optimizations fan-out review lineage.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. TOPIC
Review of spec folder `specs/system-speckit/034-spec-template-context-optimizations` (spec-folder target, Level 2 planning packet): six 033-recommendation optimizations across templates, validation rules, and the MCP memory search handler. Planning-stage packet — the review checks document coherence, traceability of claims to the referenced implementation surfaces, and plan readiness.

---

## 2. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 3. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

## 4. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 16
- P2 (Suggestions): 18
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 5. WHAT WORKED
- [none yet]

## 6. WHAT FAILED
- [none yet]

## 7. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "All REQs equally traceable in checklist": [measured mention counts 0-3], [grep] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "All REQs equally traceable in checklist": [measured mention counts 0-3], [grep]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "All REQs equally traceable in checklist": [measured mention counts 0-3], [grep]

### "Budget truncation is non-deterministic": [min-scan drop keeps determinism; test asserts order], [test 1] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Budget truncation is non-deterministic": [min-scan drop keeps determinism; test asserts order], [test 1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Budget truncation is non-deterministic": [min-scan drop keeps determinism; test asserts order], [test 1]

### "Completion-pct drift across docs": [all six docs carry completion_pct 5 consistently], [grep] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Completion-pct drift across docs": [all six docs carry completion_pct 5 consistently], [grep]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Completion-pct drift across docs": [all six docs carry completion_pct 5 consistently], [grep]

### "Consolidation is complete per REQ-002": [gate markers remain inline in each template; the shared-core architecture is partial], [grep IF level counts] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Consolidation is complete per REQ-002": [gate markers remain inline in each template; the shared-core architecture is partial], [grep IF level counts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Consolidation is complete per REQ-002": [gate markers remain inline in each template; the shared-core architecture is partial], [grep IF level counts]

### "git-diff mode resolves the contract": [no scope_base contract defined; MK_SCOPE_BASE env var default empty → rule skips], [check-scope-adherence.sh:31-44] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "git-diff mode resolves the contract": [no scope_base contract defined; MK_SCOPE_BASE env var default empty → rule skips], [check-scope-adherence.sh:31-44]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "git-diff mode resolves the contract": [no scope_base contract defined; MK_SCOPE_BASE env var default empty → rule skips], [check-scope-adherence.sh:31-44]

### "L3 savings equal L1 savings": [measured 944 vs 175], [renderer output line counts] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "L3 savings equal L1 savings": [measured 944 vs 175], [renderer output line counts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "L3 savings equal L1 savings": [measured 944 vs 175], [renderer output line counts]

### "OQ1 genuinely unanswerable pre-implementation": [0 template-consumer hits in system-deep-loop; SKILL.md workflow-owned declaration], [grep + SKILL.md:303/340] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "OQ1 genuinely unanswerable pre-implementation": [0 template-consumer hits in system-deep-loop; SKILL.md workflow-owned declaration], [grep + SKILL.md:303/340]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "OQ1 genuinely unanswerable pre-implementation": [0 template-consumer hits in system-deep-loop; SKILL.md workflow-owned declaration], [grep + SKILL.md:303/340]

### "Phase naming is unambiguous": [plan.md Phase N ≠ tasks.md Phase N], [heading comparison] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Phase naming is unambiguous": [plan.md Phase N ≠ tasks.md Phase N], [heading comparison]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Phase naming is unambiguous": [plan.md Phase N ≠ tasks.md Phase N], [heading comparison]

### "REQ-004 satisfied by default flip alone": [the acceptance requires an observable warn on under-covered packets; the rule never sets warn status], [grep RULE_STATUS] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "REQ-004 satisfied by default flip alone": [the acceptance requires an observable warn on under-covered packets; the rule never sets warn status], [grep RULE_STATUS]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-004 satisfied by default flip alone": [the acceptance requires an observable warn on under-covered packets; the rule never sets warn status], [grep RULE_STATUS]

### "REQ-006 unbudgeted": [budget applied at memory-search.ts:2417 with layer budget 3500], [observed code + passing tests] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "REQ-006 unbudgeted": [budget applied at memory-search.ts:2417 with layer budget 3500], [observed code + passing tests]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "REQ-006 unbudgeted": [budget applied at memory-search.ts:2417 with layer budget 3500], [observed code + passing tests]

### "research.md renders are covered by the snapshot suite": [lazyAddonDocs excluded from the iteration loop], [vitest source inspection] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "research.md renders are covered by the snapshot suite": [lazyAddonDocs excluded from the iteration loop], [vitest source inspection]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "research.md renders are covered by the snapshot suite": [lazyAddonDocs excluded from the iteration loop], [vitest source inspection]

### "Rule correctly warns on packet doc changes": [the packet's own completion protocol mandates those doc updates (CHK-015/016/018)], [checklist.md sections] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "Rule correctly warns on packet doc changes": [the packet's own completion protocol mandates those doc updates (CHK-015/016/018)], [checklist.md sections]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Rule correctly warns on packet doc changes": [the packet's own completion protocol mandates those doc updates (CHK-015/016/018)], [checklist.md sections]

### "The rule is advisory so pass status is correct": [REQ-004 acceptance explicitly requires a warn observable], [spec.md:110] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The rule is advisory so pass status is correct": [REQ-004 acceptance explicitly requires a warn observable], [spec.md:110]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The rule is advisory so pass status is correct": [REQ-004 acceptance explicitly requires a warn observable], [spec.md:110]

### "Uncommitted changes are unrelated drift": [every changed path is listed in spec §3 Files to Change or is the direct artifact of those requirements (test + rule file)], [git status --short vs spec.md Files to Change] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Uncommitted changes are unrelated drift": [every changed path is listed in spec §3 Files to Change or is the direct artifact of those requirements (test + rule file)], [git status --short vs spec.md Files to Change]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Uncommitted changes are unrelated drift": [every changed path is listed in spec §3 Files to Change or is the direct artifact of those requirements (test + rule file)], [git status --short vs spec.md Files to Change]

### "Under-covered packets warn via message text": [validate.sh gates on RULE_STATUS, not message content], [observed + prefix] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Under-covered packets warn via message text": [validate.sh gates on RULE_STATUS, not message content], [observed + prefix]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Under-covered packets warn via message text": [validate.sh gates on RULE_STATUS, not message content], [observed + prefix]

### Claiming REQ-002 satisfied: [byte-identical proof is explicitly the acceptance gate and it is failing], [vitest output] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Claiming REQ-002 satisfied: [byte-identical proof is explicitly the acceptance gate and it is failing], [vitest output]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming REQ-002 satisfied: [byte-identical proof is explicitly the acceptance gate and it is failing], [vitest output]

### Command injection via scope rule env var: [MK_SCOPE_CHANGED_FILES is split with tr into an array; no eval; git -C "$repo_root" with quoted args], [check-scope-adherence.sh:35-44] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Command injection via scope rule env var: [MK_SCOPE_CHANGED_FILES is split with tr into an array; no eval; git -C "$repo_root" with quoted args], [check-scope-adherence.sh:35-44]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command injection via scope rule env var: [MK_SCOPE_CHANGED_FILES is split with tr into an array; no eval; git -C "$repo_root" with quoted args], [check-scope-adherence.sh:35-44]

### None — all evidence paths resolved. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None — all evidence paths resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None — all evidence paths resolved.

### None. -- BLOCKED (iteration 10, 9 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Renderer gate injection via template content: [fenced-code blocks skip gate parsing; unbalanced markers throw fail-closed], [inline-gate-renderer.ts:200-236] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Renderer gate injection via template content: [fenced-code blocks skip gate parsing; unbalanced markers throw fail-closed], [inline-gate-renderer.ts:200-236]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Renderer gate injection via template content: [fenced-code blocks skip gate parsing; unbalanced markers throw fail-closed], [inline-gate-renderer.ts:200-236]

### Secret exposure in new code: [all new imports resolve to internal lib modules; no external calls], [memory-search.ts imports] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secret exposure in new code: [all new imports resolve to internal lib modules; no external calls], [memory-search.ts imports]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret exposure in new code: [all new imports resolve to internal lib modules; no external calls], [memory-search.ts imports]

### Template-consolidation output correctness by manual inspection: [Snapshot mismatch already proves output changed at Level 1/2/3/3+; manual diff inspection of 2,300+ changed template lines would not change the verdict.], [snapshot failure output] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Template-consolidation output correctness by manual inspection: [Snapshot mismatch already proves output changed at Level 1/2/3/3+; manual diff inspection of 2,300+ changed template lines would not change the verdict.], [snapshot failure output]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Template-consolidation output correctness by manual inspection: [Snapshot mismatch already proves output changed at Level 1/2/3/3+; manual diff inspection of 2,300+ changed template lines would not change the verdict.], [snapshot failure output]

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 8. RULED OUT DIRECTIONS
[None yet]

## 9. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis — dedup findings, replay convergence, compile review-report.md. Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 10. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** the packet's own docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md) plus the referenced implementation surfaces: `.opencode/skills/system-spec-kit/templates/manifest/{research,spec,plan,tasks,implementation-summary,checklist}.md.tmpl`, `spec-kit-docs.json`, `scripts/templates/inline-gate-renderer.ts`, `scripts/rules/check-ac-coverage.sh`, `scripts/rules/check-scope-adherence.sh` (new), `scripts/spec/validate.sh`, `mcp-server/handlers/memory-search.ts`.
- **Behavior claims to verify:** REQ-001 level-gating of research.md.tmpl (944→smaller); REQ-002 byte-identical render after consolidation; REQ-003 rendered-view read guard; REQ-004 AC_COVERAGE default-on; REQ-005 scope-adherence rule; REQ-006 memory_search token budget.
- **Critical observation (working-tree state):** the worktree contains **uncommitted implementation changes** to exactly the surfaces the packet plans to change (templates restructured, AC_COVERAGE default flipped to `true`, SCOPE_ADHERENCE rule + registry entry added, memory-search token budget added + test). The packet docs claim "Planned — no implementation yet". The review must adjudicate whether the docs are stale or the changes are out-of-scope/premature.
- **Reuse/convention pointers:** renderer contract `inline-gate-renderer.ts:182` (strips `<!-- IF level:N -->` blocks), `renderInlineGates`; validate.sh registry-backed rule loop (validator-registry.json); memory-context.ts `enforceTokenBudget` as the shared budget helper (memory-search.ts currently has a local `enforceSearchTokenBudget`).
- **Review risks/gaps:** no resource-map.md present at init (coverage gate skipped); implementation not committed, so git-blame provenance is unavailable for the uncommitted changes; 033 research report is the evidence source.

---

## 11. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Verify normative claims (REQ-001..006) against referenced implementation |
| `checklist_evidence` | core | pending | - | Checklist CHK-001..019: all unchecked (pre-impl); verify no false completion marks |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog for this target |
| `playbook_capability` | overlay | notApplicable | - | No manual-testing playbook for this target |
<!-- /ANCHOR:cross-reference-status -->

---

## 12. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-speckit/034-.../spec.md | - | - | - | pending |
| specs/system-speckit/034-.../plan.md | - | - | - | pending |
| specs/system-speckit/034-.../tasks.md | - | - | - | pending |
| specs/system-speckit/034-.../checklist.md | - | - | - | pending |
| specs/system-speckit/034-.../implementation-summary.md | - | - | - | pending |
| specs/system-speckit/034-.../decision-record.md | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/*.tmpl | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/references/templates/template-guide.md | - | - | - | pending (ref surfaces) |
| .opencode/skills/system-spec-kit/references/validation/validation-rules.md | - | - | - | pending (ref surfaces) |
| specs/system-speckit/033-spec-templates-and-context-reducer/research/research.md | - | - | - | evidence source |
<!-- /ANCHOR:files-under-review -->

---

## 13. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 10 (stop-policy=max-iterations; convergence telemetry only)
- Convergence threshold: 0.10 | Rolling STOP threshold: 0.08 | No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-flash-review-1786551828250-nkwps1, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-08-12T16:30:48Z
- Artifact dir: specs/system-speckit/034-spec-template-context-optimizations/review/lineages/pi-flash-review (fan-out override; resolveArtifactRoot NOT run)
<!-- /ANCHOR:review-boundaries -->
