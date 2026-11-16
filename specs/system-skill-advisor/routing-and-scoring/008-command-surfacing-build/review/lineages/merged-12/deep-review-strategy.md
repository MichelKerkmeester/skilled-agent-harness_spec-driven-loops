# Deep Review Strategy - merged-12

## 1. OVERVIEW

### Purpose

Persistent review state for the detached fan-out lineage `merged-12` of review pass twelve on `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.

### Usage

- Per iteration: read Next Focus, review the assigned dimension/files, update findings, mark dimensions complete, and set the next focus.
- Mutability: mutable inside this lineage directory only.

---

## 2. TOPIC

Review of the two merges of `origin/main` (`640cd0a2499`) into the command-surfacing branch: `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/SKILL.md` and `.skilled/skills/sk-doc/graph-metadata.json` must equal main except the branch's README phrase narrowings and the `/create:sk-skill` command name; the generated intent signals must follow the router; and `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` must check the presentation and the workflow against the link manifest.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the recorded limits named in `review/review-brief-12.txt` (suffix-plus-extension reads as command, `node -e` arrow redirect, macOS-only isolation check, underscore emphasis, moved baseline rows judged without text, the open P2 list of `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md`, and the open P2 of review passes ten and eleven).
- Re-reviewing the `mention` area (`command-attach.ts` and its guards) except where a merged-file claim depends on it.
- Reading or printing holdout fixture content; the holdout gate is read by count only.

## 5. STOP CONDITIONS

- `config.stopPolicy: convergence` with `config.convergenceThreshold: 0.1` and `config.maxIterations: 8`, whichever the `convergence.cjs` stop decision reaches first.
- A failed required quality gate (evidence, scope, coverage) blocks STOP and must be answered or reported.

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Diffing each merged sk-doc file against `origin/main 640cd0a2499` and classifying every hunk (iteration 1): it makes "only the narrowings and the rename differ" a checkable claim instead of a reading.
- Running `generate-router-intent-signals.cjs --check --hub sk-doc --json` (iteration 1): it converts the router-versus-intent-signal obligation into one mechanical result (`added=0, orphans=0`).

## 9. WHAT FAILED

- Reading the doctor contract-test title as evidence of its assertions (iteration 1): the workflow half asserts a phrase that the inspected field could never contain, so the title over-claims. The failure is now recorded as the iteration 1 P2.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A dead `RESOURCE_MAP` path.** All 134 paths resolve; checked path by path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A dead `RESOURCE_MAP` path.** All 134 paths resolve; checked path by path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dead `RESOURCE_MAP` path.** All 134 paths resolve; checked path by path.

### **A false AC-006 mark.** AC-006's evidence is the contract's pass count, which the run reproduces (17/17); it does not claim workflow-name coverage, so it is not a false acceptance claim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A false AC-006 mark.** AC-006's evidence is the contract's pass count, which the run reproduces (17/17); it does not claim workflow-name coverage, so it is not a false acceptance claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false AC-006 mark.** AC-006's evidence is the contract's pass count, which the run reproduces (17/17); it does not claim workflow-name coverage, so it is not a false acceptance claim.

### **A graph-freshness drift introduced by the merge.** `--strict` exits 0 with no drift row. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A graph-freshness drift introduced by the merge.** `--strict` exits 0 with no drift row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A graph-freshness drift introduced by the merge.** `--strict` exits 0 with no drift row.

### **A graph-node naming collision across sessions.** The namespace is session-scoped; the duplicate ids are same-session, so the repair is an edge add, not a cross-session merge. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A graph-node naming collision across sessions.** The namespace is session-scoped; the duplicate ids are same-session, so the repair is an edge add, not a cross-session merge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A graph-node naming collision across sessions.** The namespace is session-scoped; the duplicate ids are same-session, so the repair is an edge add, not a cross-session merge.

### **A missing-evidence checklist row.** Both doctor `[x]` rows cite a command result that exists. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A missing-evidence checklist row.** Both doctor `[x]` rows cite a command result that exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing-evidence checklist row.** Both doctor `[x]` rows cite a command result that exists.

### **A post-merge edit to the four scope paths.** The `05475f9d044..HEAD` diff is empty. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A post-merge edit to the four scope paths.** The `05475f9d044..HEAD` diff is empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A post-merge edit to the four scope paths.** The `05475f9d044..HEAD` diff is empty.

### **A REQ-005 regression.** Neither mechanical check reports a defect. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A REQ-005 regression.** Neither mechanical check reports a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A REQ-005 regression.** Neither mechanical check reports a defect.

### **A second command-name divergence.** `/create:sk-skill` is the only command token changed from main, and it matches the live command file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A second command-name divergence.** `/create:sk-skill` is the only command token changed from main, and it matches the live command file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second command-name divergence.** `/create:sk-skill` is the only command token changed from main, and it matches the live command file.

### **A second drift between the two intent lists.** The generator check reports no missing phrase and no orphan. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A second drift between the two intent lists.** The generator check reports no missing phrase and no orphan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second drift between the two intent lists.** The generator check reports no missing phrase and no orphan.

### **A second finding in the doctor test.** Re-read all 17 tests; only the workflow half of the runtime-name test under-reaches. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A second finding in the doctor test.** Re-read all 17 tests; only the workflow half of the runtime-name test under-reaches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second finding in the doctor test.** Re-read all 17 tests; only the workflow half of the runtime-name test under-reaches.

### **A shell surface added by the test diff.** The changed hunk adds one `assert.doesNotMatch`, with no spawn or eval. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A shell surface added by the test diff.** The changed hunk adds one `assert.doesNotMatch`, with no spawn or eval.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A shell surface added by the test diff.** The changed hunk adds one `assert.doesNotMatch`, with no spawn or eval.

### **A stale `intent_signals_generated` orphan.** The generator check would fail on one; it exits 0. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale `intent_signals_generated` orphan.** The generator check would fail on one; it exits 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale `intent_signals_generated` orphan.** The generator check would fail on one; it exits 0.

### **A stale derived timestamp.** The stamp is block-scoped and the block did not change. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A stale derived timestamp.** The stamp is block-scoped and the block did not change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale derived timestamp.** The stamp is block-scoped and the block did not change.

### **A stale generated-signal orphan introduced by the merge.** The generator check exits 0 with `orphans=0`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale generated-signal orphan introduced by the merge.** The generator check exits 0 with `orphans=0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale generated-signal orphan introduced by the merge.** The generator check exits 0 with `orphans=0`.

### **A test-side path injection.** No reviewed test input is caller-supplied; all reads resolve under `__dirname`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A test-side path injection.** No reviewed test input is caller-supplied; all reads resolve under `__dirname`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A test-side path injection.** No reviewed test input is caller-supplied; all reads resolve under `__dirname`.

### **A third branch-local merge of main.** Only `2394e8f797c` and `05475f9d044` are on this branch's first-parent path. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A third branch-local merge of main.** Only `2394e8f797c` and `05475f9d044` are on this branch's first-parent path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A third branch-local merge of main.** Only `2394e8f797c` and `05475f9d044` are on this branch's first-parent path.

### **P2 escalation to P1.** Re-read `doctor-install-contract.test.cjs:239-240`, `doctor-install.yaml:46,60` and `symlink-manifest.json:5-13`: the three artifacts agree today, so the defect is guard coverage only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **P2 escalation to P1.** Re-read `doctor-install-contract.test.cjs:239-240`, `doctor-install.yaml:46,60` and `symlink-manifest.json:5-13`: the three artifacts agree today, so the defect is guard coverage only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P2 escalation to P1.** Re-read `doctor-install-contract.test.cjs:239-240`, `doctor-install.yaml:46,60` and `symlink-manifest.json:5-13`: the three artifacts agree today, so the defect is guard coverage only.

### **The narrowing removes a security guard.** The removed phrases are README intent keywords (`security policy`, the `git-*` hook README names, `hook mirror readme`); the `SECURITY_POLICY` intent still fires on `security.md` and its template stays mapped at `ROUTER.md:298-300`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The narrowing removes a security guard.** The removed phrases are README intent keywords (`security policy`, the `git-*` hook README names, `hook mirror readme`); the `SECURITY_POLICY` intent still fires on `security.md` and its template stays mapped at `ROUTER.md:298-300`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The narrowing removes a security guard.** The removed phrases are README intent keywords (`security policy`, the `git-*` hook README names, `hook mirror readme`); the `SECURITY_POLICY` intent still fires on `security.md` and its template stays mapped at `ROUTER.md:298-300`.

### **The sk-doc merge dropped a mode.** The `INSTALL_GUIDE` intent and its resource-map entry are absent in both the merge result and `origin/main`; the removal comes from main, not from a branch edit, so it is not a merge regression. `sk-create-readme/assets/install-template.md` still exists and is listed by `leaf-manifest.json`, which is allowed because the resource map need not mirror every leaf. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The sk-doc merge dropped a mode.** The `INSTALL_GUIDE` intent and its resource-map entry are absent in both the merge result and `origin/main`; the removal comes from main, not from a branch edit, so it is not a merge regression. `sk-create-readme/assets/install-template.md` still exists and is listed by `leaf-manifest.json`, which is allowed because the resource map need not mirror every leaf.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The sk-doc merge dropped a mode.** The `INSTALL_GUIDE` intent and its resource-map entry are absent in both the merge result and `origin/main`; the removal comes from main, not from a branch edit, so it is not a merge regression. `sk-create-readme/assets/install-template.md` still exists and is listed by `leaf-manifest.json`, which is allowed because the resource map need not mirror every leaf.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles investigated and eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; review complete. - Focus area: stop decision and synthesis. - Reason: coverage, protocols, and graph are all in the state a legal STOP needs. - Required evidence: `stop_decision.decision` and `graphDecision`. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/graph-metadata.json`, `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`.
- Comparison bases: branch commits `2f3f893c153` (pre-merge) and `05475f9d044` (post-merge), `origin/main` `640cd0a2499`.
- Behavior claims: the two sk-doc merges equal main except the branch's README phrase narrowings and `/create:sk-skill`; generated intent signals follow the router; the doctor contract test checks presentation and workflow against the link manifest.
- Reuse and conventions: prior lineage `fixes-11` raised the doctor-contract workflow-coverage gap and the retired-name delivery gap; pass twelve reports both.

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

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/sk-doc/ROUTER.md` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/sk-doc/SKILL.md` | D1 | 1 | none | partial |
| `.skilled/skills/sk-doc/graph-metadata.json` | D1 | 1 | none | partial |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-merged-12-1794856957949-n58dw7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 40 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T19:24:26.000Z
<!-- MACHINE-OWNED: END -->
