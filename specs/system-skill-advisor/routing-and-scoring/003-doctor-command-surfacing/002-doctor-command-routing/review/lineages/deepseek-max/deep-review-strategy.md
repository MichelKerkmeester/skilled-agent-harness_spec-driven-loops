# Deep Review Strategy - v4.0.0.12 doctor-command routing

## 1. OVERVIEW

### Purpose

Persistent brain for the deepseek-max fan-out lineage reviewing the v4.0.0.12 release of the skill-advisor doctor-command routing, the `/doctor:setup` hint, and the new `/doctor:setup` command. Read at every iteration; updated after every iteration.

### Usage

- **Init:** populated from the lineage steer.md and the parent review config.
- **Per iteration:** read Next Focus, review the assigned scope group, update findings, mark dimensions complete, set new Next Focus.
- **Mutability:** mutable; machine-owned blocks wrapped in ownership markers.
- **Ownership:** orchestrator (this executor) and iteration passes.

---

## 2. TOPIC

v4.0.0.12 release review: skill-advisor doctor-command routing (advisor code changes), the new `/doctor:setup` command and its five runtime mirrors, the `/doctor:setup` hint in Claude/Pi/OpenCode hooks and plugin, skill docs (playbook DOC-385..DOC-391, feature catalog leaves, hooks docs, README/SKILL), cross-repo references (root README, system-spec-kit catalog and SKILL), and the three changelogs. Standards: sk-doc authoring contracts and sk-code checklists. Security secondary.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Running vitest/tsc/npm installs (forbidden; tests are read, not run).
- Editing any file under review (observation only).
- Re-reviewing the packet's own spec docs (spec.md/plan.md/tasks.md) except as traceability context.
- Deep security audit (secondary only).

---

## 5. STOP CONDITIONS

- stopPolicy=max-iterations: run all 5 iterations; convergence before the cap is telemetry only.
- No convergence-based early stop is permitted to skip an iteration.

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
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Drift check `derive-command-bridges.cjs --check` (fresh) plus the doctor reach probe (82/82) gave reproducible coverage of the generated doctor surface without running the test suite (iteration 1)
- Driving the built scorer plus `renderAdvisorBrief` from a read-only probe reproduced the 40-row slice and exposed the real second-line forms (ambiguous vs Also) instead of relying on prose (iteration 1)
- Running the four mirror/catalog checkers plus the two setup batteries gave direct in-sync and exit-code evidence for the command group without a test runner (iteration 2)
- Executing the new playbook scenarios verbatim against the built runtime turned `playbook_capability` from a prose claim into observed evidence (6/7 scenarios matched exact expected lines) (iteration 3)
- Following the sibling READMEs' own pointer to the DOC-number registry exposed the one cross-repo omission of the release (iteration 4)
- Re-running the recorded task counters against artifacts gave six independent number matches, and the git log confirmed the review target never moved (iteration 5)

---

## 9. WHAT FAILED
- Nothing failed; test execution stays out of scope by directive, so runtime behavior was verified by the read-only probes and the built `dist` instead (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"`/doctor:setup` is missing from a doctor command table that should list it."** Ruled out for -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"`/doctor:setup` is missing from a doctor command table that should list it."** Ruled out for
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`/doctor:setup` is missing from a doctor command table that should list it."** Ruled out for

### **"A changelog overstates shipped behavior."** Ruled out for the three entries: each headline -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"A changelog overstates shipped behavior."** Ruled out for the three entries: each headline
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A changelog overstates shipped behavior."** Ruled out for the three entries: each headline

### **"A new scenario is unrunnable or mis-specified."** Ruled out by executing six of the seven -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"A new scenario is unrunnable or mis-specified."** Ruled out by executing six of the seven
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A new scenario is unrunnable or mis-specified."** Ruled out by executing six of the seven

### **"Doctor bridges leak into non-doctor commands."** Ruled out: ordering and anchoring checks -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"Doctor bridges leak into non-doctor commands."** Ruled out: ordering and anchoring checks
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Doctor bridges leak into non-doctor commands."** Ruled out: ordering and anchoring checks

### **"Mirror drift after adding `/doctor:setup`."** Ruled out by four independent checks: 185 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"Mirror drift after adding `/doctor:setup`."** Ruled out by four independent checks: 185
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Mirror drift after adding `/doctor:setup`."** Ruled out by four independent checks: 185

### **"The Also/companion line is truncated mid-command."** Ruled out by construction: the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The Also/companion line is truncated mid-command."** Ruled out by construction: the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The Also/companion line is truncated mid-command."** Ruled out by construction: the

### **"The catalog leaf describes behavior the code does not have."** Ruled out: each mechanism -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"The catalog leaf describes behavior the code does not have."** Ruled out: each mechanism
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The catalog leaf describes behavior the code does not have."** Ruled out: each mechanism

### **"The category overview points `/doctor:setup` scenarios at the wrong playbook."** Ruled out: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The category overview points `/doctor:setup` scenarios at the wrong playbook."** Ruled out:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The category overview points `/doctor:setup` scenarios at the wrong playbook."** Ruled out:

### **"The doctor bridge can out-rank a matching skill."** Ruled out by the slice probe: all 20 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The doctor bridge can out-rank a matching skill."** Ruled out by the slice probe: all 20
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The doctor bridge can out-rank a matching skill."** Ruled out by the slice probe: all 20

### **"The five-leg set drifts from the presentation."** Ruled out: the YAML steps, the router's -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"The five-leg set drifts from the presentation."** Ruled out: the YAML steps, the router's
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The five-leg set drifts from the presentation."** Ruled out: the YAML steps, the router's

### **"The playbook inventory test and the docs disagree on the scenario count."** Ruled out: -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"The playbook inventory test and the docs disagree on the scenario count."** Ruled out:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The playbook inventory test and the docs disagree on the scenario count."** Ruled out:

### **"The release's task evidence is fabricated or unreproducible."** Ruled out where -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The release's task evidence is fabricated or unreproducible."** Ruled out where
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The release's task evidence is fabricated or unreproducible."** Ruled out where

### **"The review target moved under the review."** Ruled out: zero commits in the review window. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The review target moved under the review."** Ruled out: zero commits in the review window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The review target moved under the review."** Ruled out: zero commits in the review window.

### **"The root README lists a doctor command that does not exist."** Ruled out: all ten listed -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The root README lists a doctor command that does not exist."** Ruled out: all ten listed
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The root README lists a doctor command that does not exist."** Ruled out: all ten listed

### **"The umbrella writes to the tree."** Ruled out: every leg is a check-only invocation, and the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"The umbrella writes to the tree."** Ruled out: every leg is a check-only invocation, and the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The umbrella writes to the tree."** Ruled out: every leg is a check-only invocation, and the

### `agent_cross_runtime`, `skill_agent`, `feature_catalog_code`, `playbook_capability`: unchanged -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime`, `skill_agent`, `feature_catalog_code`, `playbook_capability`: unchanged
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `skill_agent`, `feature_catalog_code`, `playbook_capability`: unchanged

### `agent_cross_runtime`: pass for the command mirror trees. The canonical command content -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`: pass for the command mirror trees. The canonical command content
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: pass for the command mirror trees. The canonical command content

### `checklist_evidence` / `feature_catalog_code` / `playbook_capability`: pending, later iterations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` / `feature_catalog_code` / `playbook_capability`: pending, later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` / `feature_catalog_code` / `playbook_capability`: pending, later iterations.

### `checklist_evidence`: partial this iteration, `tasks.md` evidence rows are read in the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial this iteration, `tasks.md` evidence rows are read in the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial this iteration, `tasks.md` evidence rows are read in the

### `checklist_evidence`: partial; `tasks.md` evidence rows are read in iteration 5. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: partial; `tasks.md` evidence rows are read in iteration 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial; `tasks.md` evidence rows are read in iteration 5.

### `checklist_evidence`: partial. `tasks.md` evidence rows are read in the changelog iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: partial. `tasks.md` evidence rows are read in the changelog iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. `tasks.md` evidence rows are read in the changelog iteration.

### `checklist_evidence`: pass. The release's `tasks.md` evidence rows name real artifacts and -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: pass. The release's `tasks.md` evidence rows name real artifacts and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass. The release's `tasks.md` evidence rows name real artifacts and

### `feature_catalog_code`: pass. The new leaf's implementation table resolves to real files, the -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: pass. The new leaf's implementation table resolves to real files, the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass. The new leaf's implementation table resolves to real files, the

### `playbook_capability`: pass. Six of the seven new scenarios were executed end-to-end and -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: pass. Six of the seven new scenarios were executed end-to-end and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pass. Six of the seven new scenarios were executed end-to-end and

### `skill_agent`: the router `skill_agent: system-spec-kit` tag on `setup.md` matches the generated -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: the router `skill_agent: system-spec-kit` tag on `setup.md` matches the generated
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: the router `skill_agent: system-spec-kit` tag on `setup.md` matches the generated

### `spec_code`: no change from iterations 1-3; REQ-016's "root README lists `/doctor:setup`" and -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: no change from iterations 1-3; REQ-016's "root README lists `/doctor:setup`" and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: no change from iterations 1-3; REQ-016's "root README lists `/doctor:setup`" and

### `spec_code`: pass for the reviewed group. REQ-005 ordering and REQ-006 brief rendering are -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: pass for the reviewed group. REQ-005 ordering and REQ-006 brief rendering are
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass for the reviewed group. REQ-005 ordering and REQ-006 brief rendering are

### `spec_code`: pass for this group. REQ-007 (read-only single-route umbrella) and REQ-014 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: pass for this group. REQ-007 (read-only single-route umbrella) and REQ-014
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass for this group. REQ-007 (read-only single-route umbrella) and REQ-014

### `spec_code`: pass to the extent the changelog claims were exercised; the release's REQ-level -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: pass to the extent the changelog claims were exercised; the release's REQ-level
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass to the extent the changelog claims were exercised; the release's REQ-level

### `spec_code`: unchanged from iterations 1-2 (REQ-016's playbook/catalog/README claims are the -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: unchanged from iterations 1-2 (REQ-016's playbook/catalog/README claims are the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: unchanged from iterations 1-2 (REQ-016's playbook/catalog/README claims are the

### All four overlay protocols: pass (iterations 2-4). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: All four overlay protocols: pass (iterations 2-4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: All four overlay protocols: pass (iterations 2-4).

### Overlay protocols: deferred to later iterations (`feature_catalog_code` in iteration 3, -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols: deferred to later iterations (`feature_catalog_code` in iteration 3,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: deferred to later iterations (`feature_catalog_code` in iteration 3,

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the v4.0.0.12 release file list in `review/lineages/deepseek-max/steer.md` §1; advisor code under `.skilled/skills/system-skill-advisor/`; command under `.skilled/commands/doctor/`; mirrors under `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.hermes/`; cross-repo references in root `README.md`, `.skilled/commands/README.txt`, `.skilled/skills/system-spec-kit/`.
- Behavior claims: `/doctor:setup` command exists and is routed; the advisor surfaces a doctor-setup hint when the doctor phrase matches; command bridges derive from commands; runtime mirrors match the canonical setup.md.
- Reuse and conventions: sk-doc command/playbook/catalog/README/skill/changelog contracts; sk-code TypeScript/JavaScript/Python checklists; repo authoring standards.
- Review risks and gaps: no test execution allowed, so claims about runtime behavior rely on reading code plus validators; power outage risk none; graph metadata may be stale.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass (groups 1-4) | 4 | REQ-005/006/007/009/010/011/012/014/016 evidenced; validators, executed scenarios and cross-repo checks |
| `checklist_evidence` | core | pass | 5 | tasks.md rows name real artifacts; 6 counters independently reproduced (14 routes, 82/15 phrases, 20/30/16/43, 185 mirrors, lost-0) |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pass | 2 | canonical setup.md reaches all five mirrors; 185 mirrors + 37 prompts in sync |
| `feature_catalog_code` | overlay | pass | 3 | new leaf maps to verified code sites; index counts match the tree; catalog validator 0 violations |
| `playbook_capability` | overlay | pass | 3 | DOC-385..390 executed as written; DOC-391 legs in iteration 2; package validator 61 scenarios/0 violations |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | D1, D3 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | D1, D3 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | D1 | 1 | 0 | complete |
| `runtime/scripts/command-bridges/` (deriver, compat, generated, README) | D1, D3 | 1 | 0 | complete |
| `hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts` | D1 | 1 | 0 | complete |
| `.opencode/plugins/system-skill-advisor.js`, `lib/skill-advisor-render.js` | D1 | 1 | 0 | complete |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | D1 | 1 | 0 | complete |
| doctor tests (`doctor-*.vitest.ts`, hooks/scorer tests, lease stress) | D1 | 1 | 0 | complete |
| `.skilled/commands/doctor/setup.md` + setup assets | D1, D4 | 2 | 1 P2 | complete |
| `_routes.yaml` setup/skill-advisor routes; router-reach + rebuild YAMLs | D1, D3 | 2 | 0 | complete |
| five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.pi`, `.hermes`) | D3 | 2 | 0 | complete |
| playbook DOC-385..DOC-391 + root playbook index | D3, D4 | 3 | 0 | complete |
| feature catalog leaves + index | D3, D4 | 3 | 0 | complete |
| `hooks/skill-advisor-hook.md`, `hooks/pi/README.md`, advisor `README.md` + `SKILL.md` | D4 | 3 | 0 | complete |
| root `README.md` + `.skilled/commands/README.txt` | D3, D4 | 4 | 0 | complete |
| spec-kit `category-overview.md` + doctor playbook README registry | D3, D4 | 4 | 1 P2 | complete |
| three release changelogs + SKILL version bumps | D3, D4 | 5 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1 (telemetry only; stopPolicy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1792125949812-grdnrc, parentSessionId=dr-20261016T044517Z, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-16T04:46:00.000Z
<!-- MACHINE-OWNED: END -->

---

## 17. INTEGRATION TOUCHPOINTS

- `/deep:review` fan-out runner: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (owns dispatch/completion).
- Gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (single state-log writer).
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (registry/dashboard).
