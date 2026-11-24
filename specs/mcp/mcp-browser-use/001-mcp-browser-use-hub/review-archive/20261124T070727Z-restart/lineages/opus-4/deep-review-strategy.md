---
title: "Deep Review Strategy: mcp-browser-use hub (fan-out lineage opus-4)"
description: "Session tracking for the opus-4 deep-review lineage over the mcp-browser-use hub epic, phases 001-013."
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder, 13 phase children). Operator focus: every phase's shipped work against its goal criteria. Scope: 470 files pre-bound by the fan-out root (review-scope-files.txt).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Re-litigating the prior generation's deferred, operator-owned items (hub-router.json policy edits, Bladebro consent defaults) unless the shipped state now contradicts a goal criterion.
- Shared spec-kit infrastructure outside the hub (create.sh, track-roots.mjs).
- Running repo tooling that writes (validate.sh, generate-context.js, git writes).

---

## 5. STOP CONDITIONS
- All four dimensions covered and rolling weighted new-findings ratio below 0.10 after at least 2 iterations.
- Hard ceiling: 7 iterations.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Checking the validator's AC_CLOSURE contract settled the severity of the 003 closure drift (iteration 7)
- 010 and 007 goal commands re-run as written held (iteration 6)
- Stabilization re-read of open findings plus untouched goal surfaces (009, 012, 005) (iteration 5)
- Comparing shipped examples with the playbook scenarios that were rewritten and verified live found a stale default (iteration 4)
- Cross-checking each child's goal checkboxes and closure line against criteria already re-run surfaced doc-state drift (iteration 3)
- Reading installer scripts line by line against R-SEC-3 wording confirmed each gate (iteration 2)
- Running each goal criterion as its literal command (registry counts, rg pairs, compiled-route replay, results.csv tallies) gave fast pass/fail evidence (iteration 1)

---

## 9. WHAT FAILED
- Severity escalation found no P1 (iteration 7)
- No new defects; blocker set unchanged (iteration 6)
- No new defects on the remaining surfaces; checklist_evidence stays partial (iteration 5)
- Version/changelog parity sweep produced no finding (iteration 4)
- Iterations 1-2 checked shipped artifacts only and missed the packet-doc state surface (iteration 3)
- Generic secret-pattern sweeps of the run reports found nothing; low yield (iteration 2)
- Advisor stage-one replay and validate.sh could not run inside lineage write limits; relied on recorded evidence (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `eval` in Chrome `_utils.sh verify_command`: called only with script-internal literal commands, no external input reaches it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `eval` in Chrome `_utils.sh verify_command`: called only with script-internal literal commands, no external input reaches it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `eval` in Chrome `_utils.sh verify_command`: called only with script-internal literal commands, no external input reaches it.

### Dangling changelog links under the 007 topology: none found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Dangling changelog links under the 007 topology: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dangling changelog links under the 007 topology: none found.

### Drift between the authored compiled-routing bundle and its .skilled/bin copy: byte-identical. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Drift between the authored compiled-routing bundle and its .skilled/bin copy: byte-identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Drift between the authored compiled-routing bundle and its .skilled/bin copy: byte-identical.

### P1 upgrade of O4-I3-P2-001: the machine closure gate reads Met rows, so no completion claim is invalid; only prose is stale. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1 upgrade of O4-I3-P2-001: the machine closure gate reads Met rows, so no completion claim is invalid; only prose is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1 upgrade of O4-I3-P2-001: the machine closure gate reads Met rows, so no completion claim is invalid; only prose is stale.

### Parent metadata "Complete" vs phase-map 005 "Partial": the status line itself names the three unmet 005 requirements, so the two agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Parent metadata "Complete" vs phase-map 005 "Partial": the status line itself names the three unmet 005 requirements, so the two agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent metadata "Complete" vs phase-map 005 "Partial": the status line itself names the three unmet 005 requirements, so the two agree.

### Stale stage-one command in 005's goal: skill_advisor.py still exists. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Stale stage-one command in 005's goal: skill_advisor.py still exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale stage-one command in 005's goal: skill_advisor.py still exists.

### Teardown `rm -rf` on an arbitrary BLADE_HOME: guarded by the step-2 `ls -la` plus operator confirmation before removal. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Teardown `rm -rf` on an arbitrary BLADE_HOME: guarded by the step-2 `ls -la` plus operator confirmation before removal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Teardown `rm -rf` on an arbitrary BLADE_HOME: guarded by the step-2 `ls -la` plus operator confirmation before removal.

### Top-level `await` in Code Mode examples: the hits under mcp-aside-devtools/feature-catalog are Aside REPL snippets, where top-level await is the documented form, not Code Mode. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Top-level `await` in Code Mode examples: the hits under mcp-aside-devtools/feature-catalog are Aside REPL snippets, where top-level await is the documented form, not Code Mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Top-level `await` in Code Mode examples: the hits under mcp-aside-devtools/feature-catalog are Aside REPL snippets, where top-level await is the documented form, not Code Mode.

### Top-level await in hub Code Mode guidance: hub docs describe call_tool_chain usage without top-level-await code blocks. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Top-level await in hub Code Mode guidance: hub docs describe call_tool_chain usage without top-level-await code blocks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Top-level await in hub Code Mode guidance: hub docs describe call_tool_chain usage without top-level-await code blocks.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Synthesis: maxIterationsReached expected at the next convergence check. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Prior generation (review-archive/20261124T044326Z-restart/review-report.md): verdict CONDITIONAL, P1=4, P2=17. Remediation section claims C2-I1-P1-001, R2-P1-001, R4-P1-001 fixed; R1-P1-001 downgraded to P2; several P2s deferred to the operator.
- resource-map.md not present; skipping coverage gate.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
470 files listed in review-scope-files.txt (277 under .skilled/skills/mcp-browser-use, 75 packet docs, the rest routing, advisor, mcp-tooling and doc surfaces).
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-4-1795495435655-lf6jf3, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-24T04:46:08Z
<!-- MACHINE-OWNED: END -->
