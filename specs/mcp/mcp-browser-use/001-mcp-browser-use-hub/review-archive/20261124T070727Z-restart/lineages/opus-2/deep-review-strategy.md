---
title: Deep Review Strategy - opus-2 lineage
description: Session tracking for the opus-2 fan-out lineage reviewing the mcp-browser-use hub epic.
---

# Deep Review Strategy - opus-2 lineage

## 2. TOPIC
Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder, phases 001-013). Operator focus: every phase's shipped work against its goal criteria.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Re-running live browser sessions (Bladebro/Aside/bdg) — evidence is read from recorded runs only.
- Running validate.sh, generate-context.js or any repo-wide tooling (lineage write surface forbids it).
- Reviewing the other six mcp-tooling modes beyond the D3 "unchanged" claim.

---

## 5. STOP CONDITIONS
- Convergence (weighted newFindingsRatio < 0.10 after all four dimensions covered, min 2 iterations).
- maxIterations = 7.
- An active P0 that blocks release is confirmed (still continue coverage, verdict FAIL).

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
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Live replay of canaries and advisor prompts through compiled-route.cjs / skill-advisor.cjs: cheap, confirms criteria 2/3/5 directly (iteration 1)

---

## 9. WHAT FAILED
- Piping advisor output through head before JSON.parse lost the payload; write to a temp file first (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Changelog duplication between skill folders and `.skilled/changelog/`: symlinks, single source. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Changelog duplication between skill folders and `.skilled/changelog/`: symlinks, single source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog duplication between skill folders and `.skilled/changelog/`: symlinks, single source.

### Doctor/installer pin drift for Bladebro: identical constants. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Doctor/installer pin drift for Bladebro: identical constants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doctor/installer pin drift for Bladebro: identical constants.

### Observed out of scope: sk-code's own compiled route returns `reject` for the 403 Forbidden prompt at stage one (advisor second recommendation). sk-code's router is not in this review's scope files, so it is not a finding here. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Observed out of scope: sk-code's own compiled route returns `reject` for the 403 Forbidden prompt at stage one (advisor second recommendation). sk-code's router is not in this review's scope files, so it is not a finding here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Observed out of scope: sk-code's own compiled route returns `reject` for the 403 Forbidden prompt at stage one (advisor second recommendation). sk-code's router is not in this review's scope files, so it is not a finding here.

### Parent spec "Complete" vs 005 "Partial": the parent status row names the three unmet REQs explicitly, so it is disclosed, not hidden. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Parent spec "Complete" vs 005 "Partial": the parent status row names the three unmet REQs explicitly, so it is disclosed, not hidden.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent spec "Complete" vs 005 "Partial": the parent status row names the three unmet REQs explicitly, so it is disclosed, not hidden.

### Prompt-text "forbidden" reject regression in the browser hub: fixed and canaried. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Prompt-text "forbidden" reject regression in the browser hub: fixed and canaried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-text "forbidden" reject regression in the browser hub: fixed and canaried.

### Re-raising prior P2s (bare `aside` substring, sudo suggestion, uniform weights): already in the prior registry, not re-counted. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Re-raising prior P2s (bare `aside` substring, sudo suggestion, uniform weights): already in the prior registry, not re-counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-raising prior P2s (bare `aside` substring, sudo suggestion, uniform weights): already in the prior registry, not re-counted.

### Real-browser scenarios running without operator selection: manual-testing-playbook.md:37 gates BB-010..012 and BB-015 on the operator picking browser and profile. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Real-browser scenarios running without operator selection: manual-testing-playbook.md:37 gates BB-010..012 and BB-015 on the operator picking browser and profile.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Real-browser scenarios running without operator selection: manual-testing-playbook.md:37 gates BB-010..012 and BB-015 on the operator picking browser and profile.

### Secrets in UTCP browser manuals: none. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets in UTCP browser manuals: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets in UTCP browser manuals: none.

### Unconditional `rm -rf` of the Bladebro data root: fixed (playbook steps 1-6). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unconditional `rm -rf` of the Bladebro data root: fixed (playbook steps 1-6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unconditional `rm -rf` of the Bladebro data root: fixed (playbook steps 1-6).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- (none yet)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (maxIterations reached) - Focus area: synthesis. - Reason: iteration cap of 7 reached; all four dimensions covered with only P2 advisories active. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Prior generation (review-archive/20261124T044326Z-restart/review-report.md) merged P0=0, P1=4, P2=17; remediation section says C2-I1-P1-001, R2-P1-001, R4-P1-001 fixed, R1-P1-001 downgraded to P2 and left unchanged.
- Phase 013 fixed 012's alignment findings (91 doc + 21 skilled).
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot
- Target pointers: parent goal.md §3 (7 criteria), 13 child goal.md files, `.skilled/skills/mcp-browser-use/` hub, compiled-routing 010-mcp-browser-use lib, mcp-tooling registry.
- Behavior claims: parent goal completion criteria; each child goal's criteria.
- Review risks: parent spec.md status "Complete" vs phase map 005 "Partial"; 006→007 handoff row TBD.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
470 files from review-scope-files.txt: .skilled/skills/mcp-browser-use (277), specs packet (75), system-spec-kit (25), system-skill-advisor (19), mcp-tooling (19), compiled-routing lib (13), sk-doc (12), others (30).
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Session lineage: sessionId=fanout-opus-2-1795495435655-lf6jf3, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T04:45:15Z
<!-- MACHINE-OWNED: END -->
