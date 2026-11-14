---
title: Deep Review Strategy - Subtrack proposal and archive reach
description: Runtime review strategy for the 005-subtrack-proposal-and-archive-reach packet, focused on manifest-scoped documentation alignment against phases 006-010 behaviour.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach` (spec-folder). Scope is exactly `goal-file-manifest.txt`: 74 files changed by phases 001-010 outside `specs/`. Operator focus: documentation alignment, with the highest-yield target the stale docs against phases 006-010 behaviour (relocate.mjs exit 3, resume late-step ledger marks, case-folded duplicate refusal, phase-map bare-name and re-parent rewrites, pre-archive id rewrite, mixed-track restore refusal, archive-aware phase numbering, archivedPaths in path JSON, suggest-subtracks refusing non-NNN-slug packets, reworded archive signal).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing any finding; this review is observation-only.
- Reviewing files outside `goal-file-manifest.txt` except as the declared standards yardstick (sk-code-skilled, sk-create-skill, sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-command, sk-create-readme).
- Re-running the repository's validation, test, or generation tooling.
- The two 2026-11-14 review files themselves and the packet's `specs/` documents (context only).

---

## 5. STOP CONDITIONS
- `maxIterations` 5 reached, or composite convergence with all four dimensions covered and no active P0/P1.
- Stop early only when the manifest has no unreviewed documentation surface with a plausible gap.

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
- P1 (Required): 4
- P2 (Suggestions): 11
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Pairing each phase 006-010 code behaviour with its doc line found three observable contradictions in one pass (iteration 1).
- Reading the CLI README first separated the stale pages from the current ones instead of treating the docs as one block (iteration 1).
- Auditing the restore and archive-search guards against the docs found the code clean and one operator-surface gap, so the security dimension did not inflate into a code finding (iteration 2).
- Pairing the retrieval contract with the `rg-wrapper` path record found the `archivedPaths` field in one pass and let the same omission be traced across four command surfaces (iteration 3).
- Reading the feature catalog and playbooks as authoring contracts, not prose, turned five missing scenario/claim lines into concrete P2s (iteration 4).
- Replaying the four active P1s against their code anchors in the consolidation pass confirmed none could be downgraded and kept the final report from over-claiming (iteration 5).

---

## 9. WHAT FAILED
- Treating the whole documentation set as stale was rejected: the CLI README is current, so the gap is page-specific (iteration 1).
- Treating the case-folded duplicate refusal as a separate security finding failed: the generic "named by two entries" wording reaches the guard (iteration 2).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`AGENTS.md` as stale**: its Option C line is current; no phase 006-010 behaviour is stated there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`AGENTS.md` as stale**: its Option C line is current; no phase 006-010 behaviour is stated there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`AGENTS.md` as stale**: its Option C line is current; no phase 006-010 behaviour is stated there.

### **`phase-definitions.md:82` as a numbering contradiction**: it describes creating the parent, and the parent-number path also counts the archive; no observable mismatch. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`phase-definitions.md:82` as a numbering contradiction**: it describes creating the parent, and the parent-number path also counts the archive; no observable mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`phase-definitions.md:82` as a numbering contradiction**: it describes creating the parent, and the parent-number path also counts the archive; no observable mismatch.

### **`worked-examples.md` as stale**: its only relevant text is the Option C line, which phase 002 already updated. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`worked-examples.md` as stale**: its only relevant text is the Option C line, which phase 002 already updated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`worked-examples.md` as stale**: its only relevant text is the Option C line, which phase 002 already updated.

### **A finding for the reworded archive signal**: the signal lives in generated `graph-metadata.json`, which the manifest excludes; no in-scope doc restates it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A finding for the reworded archive signal**: the signal lives in generated `graph-metadata.json`, which the manifest excludes; no in-scope doc restates it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the reworded archive signal**: the signal lives in generated `graph-metadata.json`, which the manifest excludes; no in-scope doc restates it.

### **A finding for the root README, AGENTS.md, worked-examples, track-root page, validation-rule-engine page or validation playbook**: each was checked against the phase 006-010 behaviours it could state, and each is current or out of the affected surface. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A finding for the root README, AGENTS.md, worked-examples, track-root page, validation-rule-engine page or validation playbook**: each was checked against the phase 006-010 behaviours it could state, and each is current or out of the affected surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the root README, AGENTS.md, worked-examples, track-root page, validation-rule-engine page or validation playbook**: each was checked against the phase 006-010 behaviours it could state, and each is current or out of the affected surface.

### **A general "all docs are stale" finding**: the CLI README is current, so the gap is specific pages, not the whole documentation set. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A general "all docs are stale" finding**: the CLI README is current, so the gap is specific pages, not the whole documentation set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A general "all docs are stale" finding**: the CLI README is current, so the gap is specific pages, not the whole documentation set.

### **A missing feature-catalog registration**: the root catalog registers both features at `:678-694` and `:1082`; the problem is current-state text, not discovery. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing feature-catalog registration**: the root catalog registers both features at `:678-694` and `:1082`; the problem is current-state text, not discovery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing feature-catalog registration**: the root catalog registers both features at `:678-694` and `:1082`; the problem is current-state text, not discovery.

### **A path-traversal or symlink-following defect in the restore path**: the guards exist and are ordered before the first write; no reachable bypass was found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A path-traversal or symlink-following defect in the restore path**: the guards exist and are ordered before the first write; no reachable bypass was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A path-traversal or symlink-following defect in the restore path**: the guards exist and are ordered before the first write; no reachable bypass was found.

### **A playbook voice or format violation**: the scenarios have the prompt, commands, expected output and Pass/Fail sections; the gap is missing coverage, not missing shape. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A playbook voice or format violation**: the scenarios have the prompt, commands, expected output and Pass/Fail sections; the gap is missing coverage, not missing shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A playbook voice or format violation**: the scenarios have the prompt, commands, expected output and Pass/Fail sections; the gap is missing coverage, not missing shape.

### **A separate finding for the feature-catalog root summaries**: the per-feature page is the source of truth and the root entry repeats it; one finding per behaviour is enough. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A separate finding for the feature-catalog root summaries**: the per-feature page is the source of truth and the root entry repeats it; one finding per behaviour is enough.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A separate finding for the feature-catalog root summaries**: the per-feature page is the source of truth and the root entry repeats it; one finding per behaviour is enough.

### **A single consolidated "phase 006-010 docs are stale" finding**: the operator asked for exact file:line per gap, and the surfaces have different owners and fixes; one umbrella finding would hide them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A single consolidated "phase 006-010 docs are stale" finding**: the operator asked for exact file:line per gap, and the surfaces have different owners and fixes; one umbrella finding would hide them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A single consolidated "phase 006-010 docs are stale" finding**: the operator asked for exact file:line per gap, and the surfaces have different owners and fixes; one umbrella finding would hide them.

### **A structural README violation**: the system README and root README have the required sections, links and verification rows; the gaps are behavioural, not structural. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A structural README violation**: the system README and root README have the required sections, links and verification rows; the gaps are behavioural, not structural.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A structural README violation**: the system README and root README have the required sections, links and verification rows; the gaps are behavioural, not structural.

### **A wrong assertion that `archivedPaths` replaces `paths`**: `rg-wrapper.mjs:380` keeps `paths` as plain strings, and the docs' statement about `paths` remains true; the finding is the missing new field, not a type change. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong assertion that `archivedPaths` replaces `paths`**: `rg-wrapper.mjs:380` keeps `paths` as plain strings, and the docs' statement about `paths` remains true; the finding is the missing new field, not a type change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong assertion that `archivedPaths` replaces `paths`**: `rg-wrapper.mjs:380` keeps `paths` as plain strings, and the docs' statement about `paths` remains true; the finding is the missing new field, not a type change.

### **An `--apply` rollback claim**: `relocate.mjs:34` says status 0 after apply means every step landed; status 3 is explicitly a landed move, so the code does not invite a destructive retry. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **An `--apply` rollback claim**: `relocate.mjs:34` says status 0 after apply means every step landed; status 3 is explicitly a landed move, so the code does not invite a destructive retry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An `--apply` rollback claim**: `relocate.mjs:34` says status 0 after apply means every step landed; status 3 is explicitly a landed move, so the code does not invite a destructive retry.

### **Archive search leaking live-only state**: the flag only drops the archive exclusion; it does not add roots, raise the limit, or change the ranking function. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Archive search leaking live-only state**: the flag only drops the archive exclusion; it does not add roots, raise the limit, or change the ranking function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Archive search leaking live-only state**: the flag only drops the archive exclusion; it does not add roots, raise the limit, or change the ranking function.

### **Case-fold duplicate as a security issue**: it is a data-integrity guard, and the generic doc wording reaches it; no security severity. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Case-fold duplicate as a security issue**: it is a data-integrity guard, and the generic doc wording reaches it; no security severity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Case-fold duplicate as a security issue**: it is a data-integrity guard, and the generic doc wording reaches it; no security severity.

### **P0 classification for the stale exit status**: no data loss or security breach follows; the cost is a misdiagnosed exit, so P1 is the supported ceiling. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **P0 classification for the stale exit status**: no data loss or security breach follows; the cost is a misdiagnosed exit, so P1 is the supported ceiling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P0 classification for the stale exit status**: no data loss or security breach follows; the cost is a misdiagnosed exit, so P1 is the supported ceiling.

### **P0 escalation of the doc/code contradictions**: the failures cost a misdiagnosed exit or an undiscovered field; none is data loss, a security breach, or a hard-gate failure. P1 remains the supported ceiling. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **P0 escalation of the doc/code contradictions**: the failures cost a misdiagnosed exit or an undiscovered field; none is data loss, a security breach, or a hard-gate failure. P1 remains the supported ceiling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P0 escalation of the doc/code contradictions**: the failures cost a misdiagnosed exit or an undiscovered field; none is data loss, a security breach, or a hard-gate failure. P1 remains the supported ceiling.

### **Reopening the accepted `Phase N` residual**: `decision-record.md` records the phase-column residual as out of scope; this review keeps that decision. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Reopening the accepted `Phase N` residual**: `decision-record.md` records the phase-column residual as out of scope; this review keeps that decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reopening the accepted `Phase N` residual**: `decision-record.md` records the phase-column residual as out of scope; this review keeps that decision.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Whole-documentation staleness: the CLI README is current, so the gap is page-specific. (iteration 1, evidence: runtime/cli/spec/README.md:120)
- `--apply` rollback: status 3 is a landed move, not a failed one, so the code does not invite a destructive retry. (iteration 1, evidence: relocate.mjs:34-38)
- Renumber-resume doc claim: `relocate.mjs:1746-1749` returns before the ledger when a renumber pass finds no entries, so `changelog:221` remains true for `--renumber`. (iteration 1)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None. Four dimensions are covered; the loop reached `maxIterations` 5 with four active P1 findings and eleven P2 advisories. Synthesis should route the P1 set to `/speckit:plan` and carry the P2 set as closing doc updates.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/goal-file-manifest.txt` (74 files); child goals 006-010; parent `spec.md` and `goal.md`; `scratch/review-20261114-*.md` for reviewer A/B findings.
- Behavior claims to verify: relocate exit statuses 0/1/2/3, resume late-step marks, case-folded duplicate refusal, bare-name and pre-archive rewrites, mixed-track restore refusal, archive-aware phase numbering, archivedPaths path JSON, suggest-subtracks NNN-slug refusal, reworded archive signal.
- Reuse and conventions: `sk-doc` authoring contracts (feature catalog, manual-testing playbook, command, README, skill), `sk-code-skilled` structure standards, `system-spec-kit` reference style.
- Review risks: the manifest omits generated JSON and fixtures by design; docs may be stale by omission rather than by false statement.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1-3 | Behaviour and guards match the code; F001-F005 are doc-side gaps |
| `checklist_evidence` | core | pass | 1-4 | phase 005-010 tasks and summaries match the shipped code |
| `skill_agent` | overlay | notApplicable | 2 | no agent definition is in the manifest |
| `agent_cross_runtime` | overlay | notApplicable | 2 | no mirrored agent file in the manifest |
| `feature_catalog_code` | overlay | partial | 1-5 | F002, F003, F010, F011, F015 |
| `playbook_capability` | overlay | partial | 2-5 | F004, F012, F013, F014 |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope: all 74 `goal-file-manifest.txt` paths. The review read the five code producers and every manifest documentation page that states a phase 006-010 behaviour. Coverage summary:

| Surface | Status |
|---|---|
| `runtime/cli/spec/relocate.mjs`, `create.sh`, `archive.sh`, `suggest-subtracks.mjs` | read; behaviour mapped to docs |
| `runtime/cli/retrieval/rg-wrapper.mjs`, `rg-lane.mjs` | read; archive boundary and path JSON mapped |
| `SKILL.md`, structure/workflow/retrieval references | read; findings F001, F005-F008 |
| feature catalog pages (relocation, lifecycle, proposal, archive search, catalog root) | read; findings F002, F003, F010, F011, F015 |
| manual-testing playbooks 492-494 and 237 | read; findings F004, F012-F014 |
| system-spec-kit README, root README, AGENTS.md | read; judged current (no change) |
| tests, fixtures, generated JSON, presentation assets | only supporting anchors; declared coverage limit |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-dsh-2-1794652127582-mfqldk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T10:30:10Z
<!-- MACHINE-OWNED: END -->
