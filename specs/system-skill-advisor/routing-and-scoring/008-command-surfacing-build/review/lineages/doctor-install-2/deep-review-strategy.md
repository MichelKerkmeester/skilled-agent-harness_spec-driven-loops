# Deep Review Strategy - Doctor Install Pass Two

## 1. OVERVIEW

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder), area `doctor-install`.
- Purpose: verify every pass-one doctor-install fix holds, review every file changed since pass one line by line, then look for new defects.
- Mutability: updated by the orchestrator and by each iteration; reducer-owned counts are refreshed after every iteration.

---

## 2. TOPIC

Review: command surfacing pass two, doctor-install lineage. Scope is the doctor install, setup, symlink, runtime-mirrors and AGENTS.md routes plus the scripts and tests they own.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-report a pass-one finding whose fix holds, a deferred item from report section 8, R4-P2-003, or the refuted finding.
- Review any file outside the 30 doctor-install area paths.
- Read or print holdout prompt text. The doctor-install area opens no holdout file.
- Change code. This lineage writes only its own review packet.

---

## 5. STOP CONDITIONS

- Composite convergence score at or above 0.60 with all four dimensions covered, or seven iterations.
- A P0 or P1 finding keeps the verdict at FAIL or CONDITIONAL; it never blocks recording the iteration.

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

- Reading the remediation diff beside the pass-one one-line fix, then running the owning test file, kept every verdict tied to the bytes as they are now (iteration 1).
- Running the check engine against this checkout and its test file beside the changed verdict branches proved the five check-engine fixes without a fixture-only claim (iteration 2).
- Probing `hook-wiring-check.cjs` with temporary hook fixtures exposed wrapper shapes the unit tests do not cover (iteration 3).
- Comparing the setup leg's hook-health claim against `metrics.ts` and `ARCHITECTURE.md` found a surviving pass-one doc defect (iteration 4).
- Reading the remaining route manifest and the A10 JSON entries found two docs-versus-code gaps the changed rows did not cover (iteration 5).
- Re-reading every cited finding line and the owning test files confirmed all five findings and no pass-one regression (iteration 6).

---

## 9. WHAT FAILED

- The new exit-3 contract covers `restored:` and `nothing was restored` but not the engine's `the restore failed` path, so the route has no branch for a partly written tree (iteration 1).
- No check-engine fix failed in iteration 2. The one recorded limitation is the header assumption in `parseTableRows`, which every shipped router satisfies.
- The narrowed hook-wiring matcher does not recognise `env node ...`, `node --no-warnings ...` or `bash -lc "node ..."` wrappers (iteration 3).
- The pass-one Q3 repair names `SKILL_ADVISOR_DEBUG` as the switch that turns hook-health records on; the writer records every prompt by default and the flag only adds two fields (iteration 4).
- A10 still counts report-only INFO entries as "copies as expected", and the embed route names the backup folder `<timestamp>` where the engine uses the plan digest (iteration 5).
- No new defect appeared in the final consistency pass; the remaining debt is the five P2 findings, not a failed fix.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`setup.md` documents an out-of-repository write the workflow forbids** -- ruled out: the workflow invariant names the socket directory and the setup.md prose names the same directory (iteration 4, evidence: `doctor-setup.yaml:28`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`setup.md` documents an out-of-repository write the workflow forbids** -- ruled out: the workflow invariant names the socket directory and the setup.md prose names the same directory (iteration 4, evidence: `doctor-setup.yaml:28`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`setup.md` documents an out-of-repository write the workflow forbids** -- ruled out: the workflow invariant names the socket directory and the setup.md prose names the same directory (iteration 4, evidence: `doctor-setup.yaml:28`).

### **A flag value can still swallow the next option** -- ruled out: both checks refuse a value starting with `-` (iteration 3, evidence: `codex-hook-approval-check.cjs:58-62`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A flag value can still swallow the next option** -- ruled out: both checks refuse a value starting with `-` (iteration 3, evidence: `codex-hook-approval-check.cjs:58-62`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A flag value can still swallow the next option** -- ruled out: both checks refuse a value starting with `-` (iteration 3, evidence: `codex-hook-approval-check.cjs:58-62`).

### **A hash-mismatched backup is still copied over the tree** -- ruled out: the pre-verification returns `null` before the copy loop, and the test asserts the damaged bytes never reach the root file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A hash-mismatched backup is still copied over the tree** -- ruled out: the pre-verification returns `null` before the copy loop, and the test asserts the damaged bytes never reach the root file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hash-mismatched backup is still copied over the tree** -- ruled out: the pre-verification returns `null` before the copy loop, and the test asserts the damaged bytes never reach the root file.

### **A malformed router row still reads as missing** -- ruled out: the row is kept, `missingRows` still finds its rule cell, and A11 prints the malformed line with its line number and width (iteration 2, evidence: `agents-md-check.cjs:803-826`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A malformed router row still reads as missing** -- ruled out: the row is kept, `missingRows` still finds its rule cell, and A11 prints the malformed line with its line number and width (iteration 2, evidence: `agents-md-check.cjs:803-826`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A malformed router row still reads as missing** -- ruled out: the row is kept, `missingRows` still finds its rule cell, and A11 prints the malformed line with its line number and width (iteration 2, evidence: `agents-md-check.cjs:803-826`).

### **A marker mentioned in a description still counts as wired** -- ruled out: `collectCommands` reads `command` only, and the description-only test reports `hook-missing` (iteration 3, evidence: `hook-wiring-check.cjs:114-122`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A marker mentioned in a description still counts as wired** -- ruled out: `collectCommands` reads `command` only, and the description-only test reports `hook-missing` (iteration 3, evidence: `hook-wiring-check.cjs:114-122`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A marker mentioned in a description still counts as wired** -- ruled out: `collectCommands` reads `command` only, and the description-only test reports `hook-missing` (iteration 3, evidence: `hook-wiring-check.cjs:114-122`).

### **A new P0 or P1 exists in the area** -- ruled out: the five findings are documentation, diagnostic-count or diagnostic-matcher defects with no write-path or security consequence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A new P0 or P1 exists in the area** -- ruled out: the five findings are documentation, diagnostic-count or diagnostic-matcher defects with no write-path or security consequence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new P0 or P1 exists in the area** -- ruled out: the five findings are documentation, diagnostic-count or diagnostic-matcher defects with no write-path or security consequence.

### **A pass-one fix regressed** -- ruled out: each fix was re-read and its owning test file passed in this lineage. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A pass-one fix regressed** -- ruled out: each fix was re-read and its owning test file passed in this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pass-one fix regressed** -- ruled out: each fix was re-read and its owning test file passed in this lineage.

### **A symlink at an absent-only path still passes** -- ruled out: `expectsAbsent` is read before the symlink verdict and returns FINDING (iteration 2, evidence: `agents-md-check.cjs:713-719`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A symlink at an absent-only path still passes** -- ruled out: `expectsAbsent` is read before the symlink verdict and returns FINDING (iteration 2, evidence: `agents-md-check.cjs:713-719`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlink at an absent-only path still passes** -- ruled out: `expectsAbsent` is read before the symlink verdict and returns FINDING (iteration 2, evidence: `agents-md-check.cjs:713-719`).

### **A10's 5/6 count is only the pointer-missing decision** -- ruled out: the pointer-missing fix is correct, but two report-only entries remain in the numerator (iteration 5, evidence: `agents-md-check.cjs:651`). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A10's 5/6 count is only the pointer-missing decision** -- ruled out: the pointer-missing fix is correct, but two report-only entries remain in the numerator (iteration 5, evidence: `agents-md-check.cjs:651`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A10's 5/6 count is only the pointer-missing decision** -- ruled out: the pointer-missing fix is correct, but two report-only entries remain in the numerator (iteration 5, evidence: `agents-md-check.cjs:651`).

### **An absent Codex entry still routes to a command that only reads** -- ruled out: the check prints the copy-and-approve repair, and the setup and runtime-mirrors text route to that line (iteration 3, evidence: `codex-hook-approval-check.cjs:171-183`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An absent Codex entry still routes to a command that only reads** -- ruled out: the check prints the copy-and-approve repair, and the setup and runtime-mirrors text route to that line (iteration 3, evidence: `codex-hook-approval-check.cjs:171-183`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An absent Codex entry still routes to a command that only reads** -- ruled out: the check prints the copy-and-approve repair, and the setup and runtime-mirrors text route to that line (iteration 3, evidence: `codex-hook-approval-check.cjs:171-183`).

### **Holdout text was read** -- ruled out: no holdout file was opened in this lineage. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Holdout text was read** -- ruled out: no holdout file was opened in this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Holdout text was read** -- ruled out: no holdout file was opened in this lineage.

### **The backup always lands under `.skilled/output`** -- not ruled out: `backupBase` falls back to `os.tmpdir()/doctor-agents-md` when the output base is not ignored; this is part of the route finding above. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The backup always lands under `.skilled/output`** -- not ruled out: `backupBase` falls back to `os.tmpdir()/doctor-agents-md` when the output base is not ignored; this is part of the route finding above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The backup always lands under `.skilled/output`** -- not ruled out: `backupBase` falls back to `os.tmpdir()/doctor-agents-md` when the output base is not ignored; this is part of the route finding above.

### **The embedder start and pull ignore the resolved host** -- ruled out: both steps bind `OLLAMA_HOST` and the refusal comes first (iteration 4, evidence: `doctor-skill-advisor-embedder.yaml:125-127`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The embedder start and pull ignore the resolved host** -- ruled out: both steps bind `OLLAMA_HOST` and the refusal comes first (iteration 4, evidence: `doctor-skill-advisor-embedder.yaml:125-127`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The embedder start and pull ignore the resolved host** -- ruled out: both steps bind `OLLAMA_HOST` and the refusal comes first (iteration 4, evidence: `doctor-skill-advisor-embedder.yaml:125-127`).

### **The five findings contradict each other** -- ruled out: they name five separate surfaces (exit-3 route text, hook matcher, setup health repair, A10 count, embed backup path). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The five findings contradict each other** -- ruled out: they name five separate surfaces (exit-3 route text, hook matcher, setup health repair, A10 count, embed backup path).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The five findings contradict each other** -- ruled out: they name five separate surfaces (exit-3 route text, hook matcher, setup health repair, A10 count, embed backup path).

### **The install route still says "the seven"** -- ruled out: the presentation names the six runtimes and the test rejects the count phrase (iteration 4, evidence: `doctor-install-presentation.txt:78`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The install route still says "the seven"** -- ruled out: the presentation names the six runtimes and the test rejects the count phrase (iteration 4, evidence: `doctor-install-presentation.txt:78`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The install route still says "the seven"** -- ruled out: the presentation names the six runtimes and the test rejects the count phrase (iteration 4, evidence: `doctor-install-presentation.txt:78`).

### **The manifest report-only entries are written by the engine** -- ruled out: `copyVerdict` returns INFO before any path join, and the embed allowlist does not include `~/.claude` or `.cursorrules`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The manifest report-only entries are written by the engine** -- ruled out: `copyVerdict` returns INFO before any path join, and the embed allowlist does not include `~/.claude` or `.cursorrules`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The manifest report-only entries are written by the engine** -- ruled out: `copyVerdict` returns INFO before any path join, and the embed allowlist does not include `~/.claude` or `.cursorrules`.

### **The pointer-missing count still includes the missing pointer** -- ruled out: `expected` subtracts `pointerMissing`, and the test asserts `5/6` (iteration 2, evidence: `agents-md-check.cjs:649-653`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The pointer-missing count still includes the missing pointer** -- ruled out: `expected` subtracts `pointerMissing`, and the test asserts `5/6` (iteration 2, evidence: `agents-md-check.cjs:649-653`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pointer-missing count still includes the missing pointer** -- ruled out: `expected` subtracts `pointerMissing`, and the test asserts `5/6` (iteration 2, evidence: `agents-md-check.cjs:649-653`).

### **The README still says three children** -- ruled out: both the row and the module header say four and name A12 (iteration 2, evidence: `README.markdown:102`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The README still says three children** -- ruled out: both the row and the module header say four and name A12 (iteration 2, evidence: `README.markdown:102`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README still says three children** -- ruled out: both the row and the module header say four and name A12 (iteration 2, evidence: `README.markdown:102`).

### **The setup leg omits the absent hook-health state** -- ruled out: the YAML prints the absent message; the wrong repair is the markdown sentence, reported above (iteration 4, evidence: `doctor-setup.yaml:61`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The setup leg omits the absent hook-health state** -- ruled out: the YAML prints the absent message; the wrong repair is the markdown sentence, reported above (iteration 4, evidence: `doctor-setup.yaml:61`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The setup leg omits the absent hook-health state** -- ruled out: the YAML prints the absent message; the wrong repair is the markdown sentence, reported above (iteration 4, evidence: `doctor-setup.yaml:61`).

### **The symlink refusal misses a link the run would remove** -- ruled out: the action filter includes `remove`, and `restoreFromBackup` re-checks every path through `assertWritable`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The symlink refusal misses a link the run would remove** -- ruled out: the action filter includes `remove`, and `restoreFromBackup` re-checks every path through `assertWritable`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The symlink refusal misses a link the run would remove** -- ruled out: the action filter includes `remove`, and `restoreFromBackup` re-checks every path through `assertWritable`.

### **The symlink-check output block still omits the hook-wiring exits** -- ruled out: WARN, FAIL and the worse-status rule are all present (iteration 3, evidence: `doctor-symlink-check.yaml:69-72`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The symlink-check output block still omits the hook-wiring exits** -- ruled out: WARN, FAIL and the worse-status rule are all present (iteration 3, evidence: `doctor-symlink-check.yaml:69-72`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The symlink-check output block still omits the hook-wiring exits** -- ruled out: WARN, FAIL and the worse-status rule are all present (iteration 3, evidence: `doctor-symlink-check.yaml:69-72`).

### **The write-failure fix is incomplete** -- ruled out for the write path: the engine restores, prints `backup:` and `undo:` and exits 3. The surviving defect is the route text for the second fault, not the restore itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The write-failure fix is incomplete** -- ruled out for the write path: the engine restores, prints `backup:` and `undo:` and exits 3. The surviving defect is the route text for the second fault, not the restore itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The write-failure fix is incomplete** -- ruled out for the write path: the engine restores, prints `backup:` and `undo:` and exits 3. The surviving defect is the route text for the second fault, not the restore itself.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- The write-failure fix is incomplete -- ruled out for the write path: the engine restores, prints `backup:` and `undo:` and exits 3. The surviving defect is the route text for a second restore fault, not the restore itself (iteration 1, evidence: `agents-md-embed.cjs:1425-1439`).
- The symlink refusal misses a link the run would remove -- ruled out: the action filter includes `remove`, and `restoreFromBackup` re-checks every path through `assertWritable` (iteration 1, evidence: `agents-md-embed.cjs:819-829`).
- A hash-mismatched backup is still copied over the tree -- ruled out: the pre-verification returns `null` before the copy loop (iteration 1, evidence: `agents-md-embed.cjs:1313-1321`).
- A malformed router row still reads as missing -- ruled out: the row is kept, its rule cell still resolves, and A11 prints the malformed line with its width (iteration 2, evidence: `agents-md-check.cjs:803-826`).
- The pointer-missing count still includes the missing pointer -- ruled out: the count subtracts it and the test pins `5/6 ... 1 pointer missing` (iteration 2, evidence: `agents-md-check.cjs:649-653`).
- A symlink at an absent-only path still passes -- ruled out: `expectsAbsent` is read before the symlink verdict (iteration 2, evidence: `agents-md-check.cjs:713-719`).
- A marker mentioned only in a description still counts as wired -- ruled out: `collectCommands` reads `command` entries, and the description-only test reports `hook-missing` (iteration 3, evidence: `hook-wiring-check.cjs:114-122`).
- An absent Codex entry still routes to a command that only reads -- ruled out: the check prints the copy-and-approve repair and the setup text routes to it (iteration 3, evidence: `codex-hook-approval-check.cjs:171-183`).
- The symlink-check output block still omits the hook-wiring exits -- ruled out: WARN, FAIL and the worse-status rule are present (iteration 3, evidence: `doctor-symlink-check.yaml:69-72`).
- The install route still says "the seven" -- ruled out: the presentation names the six runtimes and the contract test rejects the count phrase (iteration 4, evidence: `doctor-install-presentation.txt:78`).
- The embedder start and pull ignore the resolved host -- ruled out: both bind `OLLAMA_HOST` and the non-local refusal comes first (iteration 4, evidence: `doctor-skill-advisor-embedder.yaml:125-127`).
- `setup.md` documents an out-of-repository write the workflow forbids -- ruled out: both name the socket directory (iteration 4, evidence: `doctor-setup.yaml:28`).
- The manifest report-only entries are written by the engine -- ruled out: `copyVerdict` returns INFO before any path join and the embed allowlist excludes those paths (iteration 5, evidence: `agents-md-check.cjs:658-663`).
- A10's 5/6 count is only the pointer-missing decision -- ruled out: the pointer fix is correct, but two report-only entries remain in the numerator (iteration 5, evidence: `agents-md-check.cjs:651`).
- A pass-one fix regressed -- ruled out: each fix was re-read and its owning test file passed (iteration 6, evidence: `iteration-001.md` to `iteration-005.md`).
- A new P0 or P1 exists in the area -- ruled out: the five findings are documentation or diagnostic defects with no write-path or security consequence (iteration 6, evidence: `deep-review-findings-registry.json`).
- The five findings contradict each other -- ruled out: they name five separate surfaces (iteration 6, evidence: `deep-review-findings-registry.json`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the loop converges here. - Focus area: synthesis of the five P2 findings into the lineage report. - Reason: all four dimensions have coverage, the last two ratios are 0.40 and 0.00, and the composite vote clears 0.60. - Rotation status: complete. - Blocked/productive carry-forward: none. - Required evidence: the synthesis report, the closeout events and the release-readiness state. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

- The pass-one report (`review/review-report-pass-1.md`) lists 43 merged findings; 17 belong to this area, all P2 after verification.
- The remediation range is `320e7b64d4..HEAD` (HEAD `087888ec4a`); 21 doctor-install files changed.
- The pass-one lineage (`review/lineages/doctor-install/`) stopped at its five-iteration cap with a last novelty ratio of 0.125, so this pass exists to verify the fixes and converge.
- The doctor-install area touches four prompt-hook runtimes (claude, codex, cursor, devin); opencode, pi and dsh have no advisor hook entry in this checkout, and `hook-wiring-check.cjs` skips them by design.
- Holdout files belong to the accuracy-runner area. This lineage opened none and reports counts only where a doc mentions them.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 4, 5 | Parent scope and phase map place doctor routes and install reach in phases 013-015; the phase-007 open item is pass-one and not re-reported |
| `checklist_evidence` | core | notApplicable | 4 | The parent has no acceptance-criteria file; phase children own theirs |
| `skill_agent` | overlay | notApplicable | - | No skill or agent definition in this area |
| `agent_cross_runtime` | overlay | pass | 3, 4 | claude, codex, cursor and devin wired; opencode, pi and dsh have no advisor hook entry; install names the six manifest runtimes and excludes dsh |
| `feature_catalog_code` | overlay | notApplicable | 4 | The advisor feature catalog does not describe the doctor routes |
| `playbook_capability` | overlay | notApplicable | - | No playbook file in this area |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | correctness, security, traceability | 6 | 1 P2 (DR2-P2-004) | complete |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | correctness, traceability | 6 | 1 P2 (DR2-P2-007) | complete |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` | correctness, security | 6 | 1 P2 (DR2-P2-005) | complete |
| `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs` | correctness, security | 6 | 0 | complete |
| `.skilled/commands/doctor/setup.md` | traceability, maintainability | 6 | 1 P2 (DR2-P2-006) | complete |
| `.skilled/commands/doctor/_routes.yaml` | traceability, maintainability | 5 | 1 P2 (DR2-P2-008) | complete |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` | correctness, traceability | 6 | 1 P2 (DR2-P2-004) | complete |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | correctness, traceability | 6 | 1 P2 (DR2-P2-004) | complete |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | correctness, traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | correctness, traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | correctness, traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` | correctness, security | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | correctness, security | 4 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/scripts/README.markdown` | traceability | 2 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | correctness | 1 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | correctness | 5 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` | correctness, security | 3 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/codex-hook-approval-check.test.cjs` | correctness, security | 3 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs` | traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | traceability | 4 | 0 | complete |
| `.skilled/commands/doctor/agents-md.md` | maintainability | 5 | 0 | complete |
| `.skilled/commands/doctor/skill-advisor.md` | maintainability | 5 | 0 | complete |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | traceability | 5 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt` | maintainability | 5 | 0 | complete |
| `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | traceability | 4 | 0 | complete |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | maintainability | 5 | 0 | complete |
| `INSTALL-SKILLED.md` | traceability | 4 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-doctor-install-2-1794570021136-noekp0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T12:40:00.000Z
<!-- MACHINE-OWNED: END -->
