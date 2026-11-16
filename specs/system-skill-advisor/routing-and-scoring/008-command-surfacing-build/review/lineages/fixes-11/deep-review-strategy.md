---
title: Deep Review Strategy - fixes-11
description: Review progress, dimension coverage, findings, and outcomes for the fixes-11 fan-out lineage of review pass eleven.
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent state for the `fixes-11` detached fan-out lineage of review pass eleven. Read by the iteration executor at the start of every pass.

### Usage

- **Init:** populated from `deep-review-config.json`, `review-brief-11.txt` and `review-scope-11.txt`.
- **Per iteration:** the executor reads Next Focus, reviews one dimension, writes `iterations/iteration-NNN.md`, updates this file, and hands the state record to the append gateway.

---

## 2. TOPIC

Review pass eleven, area `fixes`, of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.

Scope (area TAB path from `review-scope-11.txt`):

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
- `.skilled/commands/doctor/assets/doctor-install-presentation.txt`
- `.skilled/commands/doctor/assets/doctor-install.yaml`
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`

Diff base: `git -c core.fsmonitor=false diff 6d50afe6f39 2f3f893c153 -- <path>`; whole file read at `2f3f893c153`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No code changes; findings only.
- Not re-reporting the recorded limits in `review-brief-11.txt`: the `:auto.md` suffix reading, the `node -e` arrow as a redirect, `isolation-check.sh` macOS-only, underscore emphasis not dropped, the two moved baseline rows judged without text, the open P2 list in `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md`, and review pass ten's open P2 in `review-report.md` — unless a new input breaks them.
- Not reading or printing holdout prompt text; holdout gates are read by count only.
- Not reviewing the `routing` area (README intents main, hook mirror, security phrase) — owned by lineage `routing-11`.
- Not running repo tooling that writes (`validate.sh`, `generate-context.js`, git writes).

---

## 5. STOP CONDITIONS

- `convergence.cjs` stop decision STOP_ALLOWED, or `maxIterations` 8 reached, whichever comes first.
- Escalate instead of looping if three consecutive iterations fail, or if state files are corrupt.

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
- P1 (Required): 2
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Compiled-module probing: running the gitignored `runtime/dist` module against hand-built prompts proved the guard's real behavior instead of inferring it from source (iteration 1).
- Manifest-anchored membership check: reading `symlink-manifest.json` and `symlink-engine.cjs:435-438` settled whether `dsh` is offerable (iteration 1).
- Typed-name vs mapped-name control: guarding the retired `/create:skill` returns true while guarding `/create:sk-skill` returns false, which isolated the delivery bypass root cause (iteration 3).

---

## 9. WHAT FAILED
- Testing one shape only: the new quote tests wrap a single command, so the or-list shape the lead table already supports was not exercised (iteration 1).
- Retired-name control missing: the guard tests exercise the canonical command only, so the mapped-name bypass at `command-attach.ts:259` was never probed (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A further review direction inside this scope** — the last four passes produced no new finding, and the recovery replay tested the P2 set for upgrades without success. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A further review direction inside this scope** — the last four passes produced no new finding, and the recovery replay tested the P2 set for upgrades without success.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A further review direction inside this scope** — the last four passes produced no new finding, and the recovery replay tested the P2 set for upgrades without success.

### **A guard failure on the canonical names** — both canonical controls return `true`; the failures are specific to the quoted or-list and the retired alias. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A guard failure on the canonical names** — both canonical controls return `true`; the failures are specific to the quoted or-list and the retired alias.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A guard failure on the canonical names** — both canonical controls return `true`; the failures are specific to the quoted or-list and the retired alias.

### **A missing core protocol** — both core protocols have recorded results in this run (`spec_code`, `checklist_evidence`), both `partial` with file:line evidence. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A missing core protocol** — both core protocols have recorded results in this run (`spec_code`, `checklist_evidence`), both `partial` with file:line evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing core protocol** — both core protocols have recorded results in this run (`spec_code`, `checklist_evidence`), both `partial` with file:line evidence.

### **A missing dimension or scope file** — all four dimensions and all five scope paths are covered; the only gap is remediation of the active findings. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A missing dimension or scope file** — all four dimensions and all five scope paths are covered; the only gap is remediation of the active findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing dimension or scope file** — all four dimensions and all five scope paths are covered; the only gap is remediation of the active findings.

### **A missing finding in the registry** — seven active findings, matching iterations 1-4 and the deltas. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A missing finding in the registry** — seven active findings, matching iterations 1-4 and the deltas.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing finding in the registry** — seven active findings, matching iterations 1-4 and the deltas.

### **A new defect at line granularity** — the fold, the lead grammar, the or-list grammar, the retired-name mapping and the doctor assertions were re-read at line level; no new defect surfaced. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A new defect at line granularity** — the fold, the lead grammar, the or-list grammar, the retired-name mapping and the doctor assertions were re-read at line level; no new defect surfaced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new defect at line granularity** — the fold, the lead grammar, the or-list grammar, the retired-name mapping and the doctor assertions were re-read at line level; no new defect surfaced.

### **A registry/narrative mismatch** — counts and ids agree across registry, iterations and deltas. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A registry/narrative mismatch** — counts and ids agree across registry, iterations and deltas.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A registry/narrative mismatch** — counts and ids agree across registry, iterations and deltas.

### **A regression introduced between iterations 5 and 6** — the reviewed bytes are unchanged and both probes reproduce identically. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A regression introduced between iterations 5 and 6** — the reviewed bytes are unchanged and both probes reproduce identically.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A regression introduced between iterations 5 and 6** — the reviewed bytes are unchanged and both probes reproduce identically.

### **A second quoted-shape evasion** — beyond the quoted or-list shape already recorded as `FIX11-P1-001`, the tested quote permutations either refuse correctly or are the documented sentence-boundary case. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A second quoted-shape evasion** — beyond the quoted or-list shape already recorded as `FIX11-P1-001`, the tested quote permutations either refuse correctly or are the documented sentence-boundary case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second quoted-shape evasion** — beyond the quoted or-list shape already recorded as `FIX11-P1-001`, the tested quote permutations either refuse correctly or are the documented sentence-boundary case.

### **A stale review artifact** — every active finding was re-read at the current bytes and still holds. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A stale review artifact** — every active finding was re-read at the current bytes and still holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale review artifact** — every active finding was re-read at the current bytes and still holds.

### **A state inconsistency at closure** — registry counts, iteration narratives and deltas agree. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A state inconsistency at closure** — registry counts, iteration narratives and deltas agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A state inconsistency at closure** — registry counts, iteration narratives and deltas agree.

### **Curly/double quote handling regressed by the new fold** — `“`/`”` are still removed whole and `‘`/`’` normalized before the fold; the compiled module returns `true` for both quoted refusal cases. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Curly/double quote handling regressed by the new fold** — `“`/`”` are still removed whole and `‘`/`’` normalized before the fold; the compiled module returns `true` for both quoted refusal cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Curly/double quote handling regressed by the new fold** — `“`/`”` are still removed whole and `‘`/`’` normalized before the fold; the compiled module returns `true` for both quoted refusal cases.

### **Doctor membership mismatch** — the manifest, engine, presentation and workflow all carry `claude, codex, cursor, devin, dsh, opencode, pi, vibe`; no missing or extra runtime was found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Doctor membership mismatch** — the manifest, engine, presentation and workflow all carry `claude, codex, cursor, devin, dsh, opencode, pi, vibe`; no missing or extra runtime was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doctor membership mismatch** — the manifest, engine, presentation and workflow all carry `claude, codex, cursor, devin, dsh, opencode, pi, vibe`; no missing or extra runtime was found.

### **Doctor printed command as an injection path** — an unaccepted runtime name is refused by the engine at execution (`symlink-engine.cjs:435-438`) and the presentation instructs a re-ask (`presentation:78`); no reviewed code substitutes an unvalidated value into an executed command. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Doctor printed command as an injection path** — an unaccepted runtime name is refused by the engine at execution (`symlink-engine.cjs:435-438`) and the presentation instructs a re-ask (`presentation:78`); no reviewed code substitutes an unvalidated value into an executed command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doctor printed command as an injection path** — an unaccepted runtime name is refused by the engine at execution (`symlink-engine.cjs:435-438`) and the presentation instructs a re-ask (`presentation:78`); no reviewed code substitutes an unvalidated value into an executed command.

### **Guard bypass through curly or double quotes** — the fold removes `“”` whole and normalizes `‘’` before the quote rule; both refusal shapes return `true`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Guard bypass through curly or double quotes** — the fold removes `“”` whole and normalizes `‘’` before the quote rule; both refusal shapes return `true`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Guard bypass through curly or double quotes** — the fold removes `“”` whole and normalizes `‘’` before the quote rule; both refusal shapes return `true`.

### **Guard bypass through the canonical successor name** — refusing `/create:sk-skill` by its current name returns `undefined` from `typedCommandForTop`; the bypass is specific to the retired alias. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Guard bypass through the canonical successor name** — refusing `/create:sk-skill` by its current name returns `undefined` from `typedCommandForTop`; the bypass is specific to the retired alias.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Guard bypass through the canonical successor name** — refusing `/create:sk-skill` by its current name returns `undefined` from `typedCommandForTop`; the bypass is specific to the retired alias.

### **Longer command read as the shorter one** — `commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')` returns `false`, matching the existing test at `command-attach-guards.vitest.ts:287-289`; the negative lookahead at `command-attach.ts:431` holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Longer command read as the shorter one** — `commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')` returns `false`, matching the existing test at `command-attach-guards.vitest.ts:287-289`; the negative lookahead at `command-attach.ts:431` holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Longer command read as the shorter one** — `commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')` returns `false`, matching the existing test at `command-attach-guards.vitest.ts:287-289`; the negative lookahead at `command-attach.ts:431` holds.

### **Manifest membership drift** — the manifest, engine check, both doctor docs and the contract test agree on the eight names. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Manifest membership drift** — the manifest, engine check, both doctor docs and the contract test agree on the eight names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Manifest membership drift** — the manifest, engine check, both doctor docs and the contract test agree on the eight names.

### **Naming inconsistency as a defect** — the presentation's two orders (manifest order in the prompt, sorted order in the accepted-answer sentence) are both complete and readable; only the test coverage differs, already recorded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Naming inconsistency as a defect** — the presentation's two orders (manifest order in the prompt, sorted order in the accepted-answer sentence) are both complete and readable; only the test coverage differs, already recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Naming inconsistency as a defect** — the presentation's two orders (manifest order in the prompt, sorted order in the accepted-answer sentence) are both complete and readable; only the test coverage differs, already recorded.

### **Over-abstraction of the fold** — the one-line fold matches the surrounding chain of `.replace` calls; extracting a helper would add indirection for a single use. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Over-abstraction of the fold** — the one-line fold matches the surrounding chain of `.replace` calls; extracting a helper would add indirection for a single use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Over-abstraction of the fold** — the one-line fold matches the surrounding chain of `.replace` calls; extracting a helper would add indirection for a single use.

### **P2 → P1 upgrades under the recovery directive** — each was tested against the P1 definition and none met it; the table records the rationale. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **P2 → P1 upgrades under the recovery directive** — each was tested against the P1 definition and none met it; the table records the rationale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P2 → P1 upgrades under the recovery directive** — each was tested against the P1 definition and none met it; the table records the rationale.

### **ReDoS in the mention guard** — 7,115-character adversarial input returned in 2 ms; the regexes are bounded by prompt size and no catastrophic backtracking was observed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **ReDoS in the mention guard** — 7,115-character adversarial input returned in 2 ms; the regexes are bounded by prompt size and no catastrophic backtracking was observed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **ReDoS in the mention guard** — 7,115-character adversarial input returned in 2 ms; the regexes are bounded by prompt size and no catastrophic backtracking was observed.

### **Stale compiled advisor build** — `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:369-378` carries the new fold; source and shipped build agree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Stale compiled advisor build** — `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:369-378` carries the new fold; source and shipped build agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale compiled advisor build** — `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:369-378` carries the new fold; source and shipped build agree.

### **Stale shipped build** — the gitignored `runtime/dist` copy carries the new fold; the fix is not source-only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Stale shipped build** — the gitignored `runtime/dist` copy carries the new fold; the fix is not source-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale shipped build** — the gitignored `runtime/dist` copy carries the new fold; the fix is not source-only.

### **Test title drift as a maintainability finding** — already recorded once as `FIX11-P2-001` under traceability; repeating it here would double-count the same defect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Test title drift as a maintainability finding** — already recorded once as `FIX11-P2-001` under traceability; repeating it here would double-count the same defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Test title drift as a maintainability finding** — already recorded once as `FIX11-P2-001` under traceability; repeating it here would double-count the same defect.

### **Unbacked implementation summary** — `implementation-summary.md:62` describes only the behaviour the code has; the missing or-list handling is not claimed there. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Unbacked implementation summary** — `implementation-summary.md:62` describes only the behaviour the code has; the missing or-list handling is not claimed there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Unbacked implementation summary** — `implementation-summary.md:62` describes only the behaviour the code has; the missing or-list handling is not claimed there.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- **Dimension:** none. **Focus area:** remediation and a protocol pass, not another review direction. **Reason:** the iteration cap is reached; the synthesis verdict is FAIL because the coverage gate is failing (both core protocols partial), while the finding counts are 0 P0, 2 P1 and 5 P2. **Rotation status:** complete. **Blocked/productive carry-forward:** nothing blocked; scope saturated. **Required evidence:** `review-report.md`, the findings registry and the terminal gates row.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `command-attach.ts` (`commandOnlyMentioned` at 422-453, call sites at 259, 504), `command-attach-guards.vitest.ts` (markup cases at 172-190), `doctor-install-presentation.txt` (accepted answers at 65-78), `doctor-install.yaml` (inputs at 46, ask step at 58), `doctor-install-contract.test.cjs` (runtime assertion at 238-244).
- **Behavior claims:** `commandOnlyMentioned` returns true when every occurrence of a command name carries a refusal or question lead, so `attachCommand` withholds an offer on a refusal/question. The doctor presentation must name the runtimes `symlink-manifest.json` offers, and the contract test derives that list from the manifest.
- **Reuse and conventions:** quote folding already normalizes `“”‘’` to straight quotes; tests use `it.each` tables; the doctor contract test reads assets by path and parses YAML with `yaml`.
- **Review risks and gaps:** the manifest carries eight runtimes including `dsh`; the engine rejects unknown runtime names at `symlink-engine.cjs:435-438`; `command-attach.ts` has a gitignored compiled copy under `runtime/dist/` that already carries the new line.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | REQ-006: quoted single-command form met; quoted or-list form diverges from the plain form. Doctor half met on membership. |
| `checklist_evidence` | core | partial | 2 | T010/T011 evidence observed; AC-006 is Met on a given narrower than REQ-006, so closure evidence misses the quoted or-list shape. |
| `skill_agent` | overlay | notApplicable | 3 | No agent definition changed in this scope; the reviewed files are runtime code, tests and command assets. |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No runtime mirror or agent mirror surface changed. |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D3 | 2 | 1 P1 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1, D3 | 2 | 0 | partial |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | D1, D3 | 2 | 0 | partial |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | D1, D3 | 2 | 1 P2 | partial |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | D1, D3 | 2 | 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-fixes-11-1794851543294-mlt3r6, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 40 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T17:58:16.000Z
<!-- MACHINE-OWNED: END -->
