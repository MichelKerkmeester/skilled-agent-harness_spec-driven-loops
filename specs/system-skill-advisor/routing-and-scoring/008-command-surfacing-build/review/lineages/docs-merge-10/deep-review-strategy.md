---
title: Deep Review Strategy - docs and merge resolutions, pass ten
description: Runtime strategy for the docs-merge-10 lineage, tracking claim accuracy against HEAD and merge-resolution integrity.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - docs-merge-10

## 1. OVERVIEW

### Purpose

Persistent state for the `docs-merge-10` lineage of review pass ten. It records which dimensions remain, what was found, which approaches worked, and where the next iteration focuses.

### Usage

- **Init:** populated from the review brief, the scope file and the diffs.
- **Per iteration:** read Next Focus, review the named area, record findings, mark dimensions, set the next focus.
- **Mutability:** updated in place by this lineage.

---

## 2. TOPIC

Review of the docs area and the merge resolutions for command surfacing pass ten. Docs: `.skilled/skills/system-skill-advisor/README.md`, `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md`, `.env.example`. Merge paths: `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md`, `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `.skilled/changelog/skilled/v4.0.2.1.md`, `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reviewing the attach/scorer code area assigned to `attach-scorer-10`; it is read-only context here.
- Re-reporting the recorded limits in `review-brief-10.txt` unless a new input breaks them.
- Running the repository build, test suite or any git write; this lineage reports only.
- Opening the prompt corpora except through the allowed aggregate paths; the holdout rule stays in force.

---

## 5. STOP CONDITIONS

- Composite convergence stop at threshold 0.10 with all four dimensions covered.
- `maxIterations` 8 reached without a legal convergence stop.
- A blocking stop from `convergence.cjs` naming an uncovered dimension or an unresolved active P0.

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
- P1 (Required): 1
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading both merge directions (`main..merge` and `branch..merge`) for the same path: the doctor-install asset looks clean from main's side and only the branch-to-merge diff shows the branch test that the merge left behind (iteration 1).
- Counting the generated command rows instead of trusting the prose: `command-bridges.generated.json` reports `typescriptActive: 47`, which closes the README's changed 46-to-47 sentence on evidence (iteration 1).
- Tracing each changed sentence to its gate: `hookHealth`, the fresh-prompt path and the no-edit summary each had a readable producer, so only the no-edit summary failed (iteration 1).
- Reading the persisted hook record's closed schema instead of the prose: `metrics.ts:50-64` and `:451-463` prove the record is prompt-free and is written without the debug flag, so the release's security claim closes on code (iteration 2).
- Checking the changelog's aggregate numbers against the committed capture: 24 of 44 typed, 0 of 35 false offers, 28 of 45 tuned and 8 of 24 sealed declines all match the baseline fields (iteration 2).

## 9. WHAT FAILED

- A first read of the doctor presentation treated the `outside the nine` sentence as a simple wording change; the accepted-runtime count only became checkable after reading the symlink manifest and the engine's unknown-name branch (iteration 1).
- The merge file `doctor-install-presentation.txt` has no `/create:` text, so the brief's "kept the /create:sk-skill name" test could not apply there; the merge question had to be reframed as a test/asset pair (iteration 1).
- The sealed-row fixture count of 1 in the changelog could not be tied to one baseline field; `plain.holdout` reports own 2 and combined 2, so the sentence was left unverified rather than turned into a finding (iteration 2).
- The iteration-3 convergence decision (`STUCK_RECOVERY`) was backfilled as a `graph_convergence_evaluated` row after synthesis, because the brief requires a decision row per iteration and the recovery event alone carried no decision or blockedBy. The row is scoped to `iteration-3`; it is a late provenance record, not a post-synthesis iteration.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A broken `hookHealth` claim:** the field is absent with no record, present with one, and never carries prompt text. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A broken `hookHealth` claim:** the field is absent with no record, present with one, and never carries prompt text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken `hookHealth` claim:** the field is absent with no record, present with one, and never carries prompt text.

### **A command count contradiction:** 44 command files, 47 scorer rows and 57 command-row ids are three named inventories, not three versions of one number. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A command count contradiction:** 44 command files, 47 scorer rows and 57 command-row ids are three named inventories, not three versions of one number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A command count contradiction:** 44 command files, 47 scorer rows and 57 command-row ids are three named inventories, not three versions of one number.

### **A contradictory exit taxonomy:** the same five codes in both advisor files and the contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A contradictory exit taxonomy:** the same five codes in both advisor files and the contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A contradictory exit taxonomy:** the same five codes in both advisor files and the contract.

### **A dropped `/create:sk-skill` in the sk-doc merge:** all three ROUTER mentions and the SKILL mode-table row carry the new name, and no `/create:skill` token remains in either file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A dropped `/create:sk-skill` in the sk-doc merge:** all three ROUTER mentions and the SKILL mode-table row carry the new name, and no `/create:skill` token remains in either file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dropped `/create:sk-skill` in the sk-doc merge:** all three ROUTER mentions and the SKILL mode-table row carry the new name, and no `/create:skill` token remains in either file.

### **A dropped main change in the sk-doc merge:** main's rewritten sk-create-readme row and its removal of the README template are both present; the template file is absent and every remaining asset the ROUTER names exists. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A dropped main change in the sk-doc merge:** main's rewritten sk-create-readme row and its removal of the README template are both present; the template file is absent and every remaining asset the ROUTER names exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dropped main change in the sk-doc merge:** main's rewritten sk-create-readme row and its removal of the README template are both present; the template file is absent and every remaining asset the ROUTER names exists.

### **A holdout outcome in the merged test's published maps:** the test's guard reads all four publication maps and the committed baseline carries no holdout id. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A holdout outcome in the merged test's published maps:** the test's guard reads all four publication maps and the committed baseline carries no holdout id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout outcome in the merged test's published maps:** the test's guard reads all four publication maps and the committed baseline carries no holdout id.

### **A missing or-list refusal:** the shared lead covers the list, and the changelog's example holds. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A missing or-list refusal:** the shared lead covers the list, and the changelog's example holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing or-list refusal:** the shared lead covers the list, and the changelog's example holds.

### **A missing parent-hub template:** every path the ROUTER's step tree names resolves under `assets/parent-skill/`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A missing parent-hub template:** every path the ROUTER's step tree names resolves under `assets/parent-skill/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing parent-hub template:** every path the ROUTER's step tree names resolves under `assets/parent-skill/`.

### **A parser that accepts any suffix:** the regex rejects a suffix outside its alternation, so the defect is the doc's narrower list, not an open parser. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A parser that accepts any suffix:** the regex rejects a suffix outside its alternation, so the defect is the doc's narrower list, not an open parser.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A parser that accepts any suffix:** the regex rejects a suffix outside its alternation, so the defect is the doc's narrower list, not an open parser.

### **A prompt leak through `hookHealth`:** the persisted record is built from a closed schema and strips the two debug fields unless the flag is set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A prompt leak through `hookHealth`:** the persisted record is built from a closed schema and strips the two debug fields unless the flag is set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt leak through `hookHealth`:** the persisted record is built from a closed schema and strips the two debug fields unless the flag is set.

### **A security surface in the docs diff:** the only added line is a test-only path, and no doc change introduces a command, secret or trust decision. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A security surface in the docs diff:** the only added line is a test-only path, and no doc change introduces a command, secret or trust decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A security surface in the docs diff:** the only added line is a test-only path, and no doc change introduces a command, secret or trust decision.

### **A stale `/create:skill` reachable from the docs:** no command file answers to the old name, and the docs only mention it as retired. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale `/create:skill` reachable from the docs:** no command file answers to the old name, and the docs only mention it as retired.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale `/create:skill` reachable from the docs:** no command file answers to the old name, and the docs only mention it as retired.

### **A third stale runtime claim:** the six-runtime lists in the two advisor files are the only two; the hook contract document already carries Vibe. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A third stale runtime claim:** the six-runtime lists in the two advisor files are the only two; the hook contract document already carries Vibe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A third stale runtime claim:** the six-runtime lists in the two advisor files are the only two; the hook contract document already carries Vibe.

### **A version-authority drift in sk-doc:** five files carry 2.10.0.0. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A version-authority drift in sk-doc:** five files carry 2.10.0.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A version-authority drift in sk-doc:** five files carry 2.10.0.0.

### **A Vibe handler that does not share the advisor chain:** the adapter imports the compiled Claude handler, as Pi and DSH do. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A Vibe handler that does not share the advisor chain:** the adapter imports the compiled Claude handler, as Pi and DSH do.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Vibe handler that does not share the advisor chain:** the adapter imports the compiled Claude handler, as Pi and DSH do.

### **A wrong command inventory in the README table:** the nine ids and their mutating flags match the contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong command inventory in the README table:** the nine ids and their mutating flags match the contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong command inventory in the README table:** the nine ids and their mutating flags match the contract.

### **A wrong command-row count:** the generated counts and the tracked table agree on 47. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A wrong command-row count:** the generated counts and the tracked table agree on 47.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong command-row count:** the generated counts and the tracked table agree on 47.

### **A wrong file-name rule:** the test and regex agree. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A wrong file-name rule:** the test and regex agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong file-name rule:** the test and regex agree.

### **A wrong fresh-prompt default:** the env var and default path match the scorer's own resolution. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A wrong fresh-prompt default:** the env var and default path match the scorer's own resolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong fresh-prompt default:** the env var and default path match the scorer's own resolution.

### **A wrong no-edit list:** every example and the counterexample resolve against the pattern. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A wrong no-edit list:** every example and the counterexample resolve against the pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong no-edit list:** every example and the counterexample resolve against the pattern.

### **A wrong query-type count:** ten names in both the README and the cookbook. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong query-type count:** ten names in both the README and the cookbook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong query-type count:** ten names in both the README and the cookbook.

### **A wrong retired-name mapping:** only the one retired key exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A wrong retired-name mapping:** only the one retired key exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong retired-name mapping:** only the one retired key exists.

### **A wrong small-edit command set:** exactly three commands, matching the three document families. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A wrong small-edit command set:** exactly three commands, matching the three document families.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong small-edit command set:** exactly three commands, matching the three document families.

### **A wrong vector-table name:** `vec_cmd_${dim}` in the schema. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong vector-table name:** `vec_cmd_${dim}` in the schema.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong vector-table name:** `vec_cmd_${dim}` in the schema.

### **A wrong weak-cue threshold:** both constants match the two sentences when read in their own cases. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A wrong weak-cue threshold:** both constants match the two sentences when read in their own cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong weak-cue threshold:** both constants match the two sentences when read in their own cases.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 2 (stuck recovery at iteration 3, converged at iteration 5)
- Failed pivots: 0
- Audited overrides: 0
- Swept: correctness, traceability, security, maintainability
- Pivot lineage: docs claims -> merge resolutions -> token-level parser claims
- Remaining frontier: none inside the nine scope files

## 11. RULED OUT DIRECTIONS

- **Dropped `/create:sk-skill` in the sk-doc merge:** all three ROUTER mentions and the SKILL row carry the new name (iteration 1).
- **Dropped main change in the sk-doc merge:** the rewritten sk-create-readme row and the README-template removal are present (iteration 1).
- **Stale `/create:skill` reachable from the docs:** no command file answers to the old name (iteration 1).
- **Broken `hookHealth` or prompt leak:** the field is conditional and the record is prompt-free by schema (iterations 1-2).
- **Wrong command-row count:** 47 scorer rows at HEAD (iteration 1).
- **Wrong fresh-prompt default:** the env var and default path match the scorer (iteration 1).
- **Vibe handler drift:** the adapter proxies the shared handler (iteration 2).
- **Holdout outcome published:** the merged guard reads all four publication maps (iteration 2).
- **Wrong query-type count, vector table or exit taxonomy:** all match their producers (iteration 3).
- **Wrong no-edit list, small-edit set or weak-cue threshold:** all match the gates (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining
- Focus area: synthesis of F001 (P1) and F002-F005 (P2)
- Reason: the loop converged at iteration 5 with all four dimensions covered and no new direction left inside the nine scope files
- Rotation status: complete
- Required evidence: `review-report.md` and the terminal-gates record
- Recovery note: the iteration-3 stuck decision was recovered by iteration 4 (F005); the loop then converged at iteration 5
- Stop reason: converged (composite_converged)

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the nine scope files in `review/review-scope-10.txt`; docs diff base `05f776202e0..5b2b062baef`, merge diff base `e91faf28b8c^2..e91faf28b8c`.
- Behavior claims: README's command-row count; SKILL's `hookHealth` sentence; the changelog's hook, no-edit and rename claims; `.env.example`'s fresh-prompt path.
- Reuse and conventions: the repo's generated command tables (`runtime/lib/command-attach.ts`, `command-bridges.generated.json`), the doctor symlink manifest, and the sk-doc hub version authority rule.
- Review risks and gaps: the merge combined main's DSH/Vibe runtime work with the branch's create-skill rename; a merged test may assert pre-merge text. The holdout corpus is out of bounds except through aggregate JSON.
- Out of scope: attach/scorer source assigned to `attach-scorer-10`, the recorded limits in the brief, and any file outside the nine scope paths.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | notApplicable | 1 | No spec.md implementation claim maps to the docs area; doc claims were checked against HEAD code per finding |
| `checklist_evidence` | core | notApplicable | 1 | No checklist.md at the packet root; the pass-ten brief and scope file were read |
| `skill_agent` | overlay | pass | 1 | sk-doc names /create:sk-skill; the command file exists |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent body in the docs scope |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog claim touched |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook claim touched |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/README.md` | D1, D2, D3, D4 | 5 | 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/SKILL.md` | D1, D2, D3, D4 | 2 | 0 | complete |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | D1, D2, D3, D4 | 5 | 2 P2 | complete |
| `.env.example` | D1, D2, D3, D4 | 2 | 0 | complete |
| `.skilled/skills/sk-doc/SKILL.md` | D1, D2, D3, D4 | 3 | 0 | complete |
| `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md` | D1, D2, D3, D4 | 3 | 0 | complete |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | D1, D2, D3, D4 | 3 | 1 P1, 1 P2 | complete |
| `.skilled/changelog/skilled/v4.0.2.1.md` | D1, D2, D3, D4 | 2 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | D1, D2, D3, D4 | 2 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-docs-merge-10-1794847584683-k2l24m, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 60 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T16:57:46.000Z
<!-- MACHINE-OWNED: END -->
