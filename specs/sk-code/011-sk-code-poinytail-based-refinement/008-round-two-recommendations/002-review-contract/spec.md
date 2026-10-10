---
title: "Feature Specification: Phase 2: review-contract"
description: "Review findings carry the case that proves them, the review reads the connected code first, findings are numbered once across severity groups, and the review agent states its report order."
trigger_phrases:
  - "review contract"
  - "phase 2 review contract"
  - "review finding case"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: review-contract

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-restraint-routing |
| **Successor** | 003-agent-disclosure |
| **Handoff Criteria** | 001 goal criteria pass and 001 is committed. This phase passes its goal criteria and `validate.sh --strict` before 003 starts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Round two research recommendations specification.

**Scope Boundary**: The review contract of the `sk-code-review` mode and of the `@review` agent. It covers the case field on every finding, the connected-code read, one numbering across severity groups, the agent's report order, and a checker for the case field and the numbering.

**Dependencies**:
- Child 001-restraint-routing committed first, because its hub and canary edits change the inputs of the compiled sk-code manifest that this phase re-mints.
- The Ponytail review rules, read as data: `context/skills/ponytail-review/SKILL.md` lines 21 ("Read the diff, then the code it touches") and 59 ("Every finding needs a concrete case").

**Deliverables**:
- A `- Case:` sub-line on every finding in the three copies of the finding format (mode template, README example, review-core schema and shape).
- A Phase 1 step that reads the connected code, and a Phase 3 rule that numbers findings once.
- Reproducing case, connected-code read and report order in `.skilled/agents/review.md`, mirrored into the hand-kept Claude fork and the generated Codex, Pi and Hermes copies.
- `scripts/check-review-findings.js` with four harness cases in `check-rule-copies.test.sh`, and a row in `scripts/README.md`.
- A re-minted compiled sk-code manifest, with its archived copy identical, and a fresh leaf manifest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. No ../changelog/ folder exists under packet 011 yet, and phases 004 and 005 left this line unfilled. This phase follows that precedent, and the sk-code-review frontmatter stays at version 1.6.0.0 (plan decision D3).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A review finding needs no reproducing case, so a reader cannot tell a proven defect from a worry. The review never reads the callers, the called functions, the tests or the docs of a changed function, so a finding can miss the code that decides it. The template restarts numbering in each severity group, so "fix 2 and 5" is ambiguous, and the review agent states no report order.

### Purpose
Every finding states the case that proves it, the review reads the connected code before it reports, findings carry one numbering, and the agent states its report order. A checker proves the case and numbering rules on any review output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `- Case:` sub-line in each copy of the finding format inside `sk-code-review`: the SKILL.md template, the README example, and the review-core schema and suggested shape.
- A Phase 1 step that reads the connected code, and a Phase 3 numbering rule with a template that shows the P1 number continuing from the P0 group.
- A reproducing case on every row of the review agent's evidence table, a read-budget note for the connected-code reads, and a stated report order, in the canonical agent and in the Claude fork.
- The regenerated Codex, Pi and Hermes mirrors of the review agent, and the Hermes mirror of the sk-code-review mode.
- A new checker for the case field and numbering, its four harness cases and its scripts README row.
- A leaf manifest freshness check and a compiled sk-code manifest re-mint.

### Out of Scope
- The `deep-review` agent and its mirrors. Its finding block carries the same fields and gets no case rule here. A follow-up amendment would be needed.
- The `code`, `debug` and `orchestrate` agents, which child 003 changes. `code.md` also carries the same evidence and read-budget headings.
- Review-core sections 3 (evidence) and 4 (ordering), the README "orders by severity" sentence and `review-ux-single-pass.md` line 47. They state ordering without the new numbering rule and stay as they are.
- The manual testing playbook scenarios. They describe the finding schema and are not copies of the format.
- `AGENTS.md` and the repo rule files, which child 005 changes.
- A version bump and a changelog entry (plan decision D3).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Phase 1 step 4, Phase 3 step 5, the Case line and numbering in the output template |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modify | Case line in the findings example |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modify | Case row and renamed id row in the schema, Case line and numbering in the suggested shape |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js` | Create | Case and numbering checker, ES module, exit codes 0, 1 and 2 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | Four harness cases for the checker |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | Checker row, validation block and harness row |
| `.skilled/agents/review.md` | Modify | Evidence table, read-budget paragraph and report order |
| `.claude/agents/review.md` | Modify | The same three edits in the hand-kept fork |
| `.codex/agents/review.toml` | Regenerate | `sync-agents.cjs` output, never hand-edited |
| `.pi/agents/review.md` | Regenerate | `sync-agents-pi.cjs` output, never hand-edited |
| `.hermes/skills/agent-review/SKILL.md` | Regenerate | `sync-skills-hermes.cjs` output, never hand-edited |
| `.hermes/skills/sk-code-review/SKILL.md` | Regenerate | `sync-skills-hermes.cjs` output. Not named in the brief, but `--check` fails without it |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerate | Expected to keep its bytes, because the leaf walk covers references and assets only |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Re-mint | `compiled-route-manifest.cjs refresh`, after every edit under `.skilled/skills/sk-code` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Copy | Byte copy of the re-minted manifest, checked with `cmp`. Not named in the brief, but phase 002 did the same |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/002-review-contract/implementation-summary.md` | Modify | Builder records the evidence at close |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/002-review-contract/goal.md` | Modify | Builder sets each log row's State and Evidence |

Symlinks that need no edit, checked only: `.cursor/agents/review.md` and `.devin/agents/review/AGENT.md` point at `.claude/agents/review.md`, and `.opencode/agents` and `.opencode/skills` point at `.skilled`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each copy of the finding format carries a `- Case:` sub-line as the first sub-bullet of every finding, and the mode template says a finding with no case is not reported. | `rg -n '^\s*- Case: '` over the SKILL.md, README and review-core prints one hit in each file (goal criterion 2). |
| REQ-002 | Phase 1 of the mode reads the connected code, and anything unread goes on the `Not checked:` line. | `Read the connected code` is one hit inside the Phase 1 section (goal criterion 2). |
| REQ-003 | Findings are numbered once across the P0, P1 and P2 groups. The template shows the P1 number continuing from the P0 group. | `numbered once across all three groups` is one hit in Phase 3 (goal criterion 2), the first P1 finding line in the template starts with the number 2, and `P1-001` is gone from review-core. |
| REQ-004 | The review agent adds a reproducing case to each evidence row, makes its connected-code reads planned reads, and states its report order. The Claude fork carries the same text. | Three hits for `Reproducing case` per agent file, one `connected code` and one `Report order` per file, and three identical-range diffs (goal criterion 3). |
| REQ-005 | `check-review-findings.js` exits 0 on a valid review or one with no findings, exits 1 on a missing case or a numbering break, and exits 2 on a read error. Its four harness cases pass. | Harness run in goal criterion 1, and a direct run on an unreadable path exits 2. |
| REQ-006 | The Codex, Pi and Hermes copies regenerate, and the five mirror checks exit 0. | The five commands of goal criterion 4 exit 0. |
| REQ-007 | The sk-code leaf manifest reports fresh, and the compiled sk-code manifest is re-minted with its archived copy byte-identical. | Goal criterion 5. |
| REQ-008 | The rule canary `check-rule-copies.js` exits 0, and the harness passes all of its cases. | Goal criterion 1, which runs the canary on the real tree as its first case. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | `scripts/README.md` documents the checker and its exit codes. | `rg -c 'check-review-findings.js'` over the README prints 2. |
| REQ-010 | The edited Markdown and agent docs pass `validate_document.py --blocking-only` with no new blocking issue. | Exit 0 for the five files, and the review agent keeps its one non-blocking warning. |
| REQ-011 | Only the files in the Files to Change table change. | `git status --porcelain` over the touched paths, diffed against the scratch baseline, adds only the listed paths. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No finding reaches a review without a case. The checker exits 1 on a finding with no `- Case:` line and names the finding number.
- **SC-002**: Findings read as one sequence. The checker exits 1 on a restarted number and names the expected number.
- **SC-003**: The review reads the connected code before it reports, and the agent's read budget allows those reads.
- **SC-004**: The agent, the fork, the mirrors and the skill copies agree. The three identical-range diffs are empty, and the five mirror checks exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 001 committed first | Its hub and canary edits change the compiled sk-code input, so a re-mint before it lands goes stale | Build this phase after 001 is committed, as the parent handoff says |
| Risk | Codex write refused with EPERM in a sandbox (seen in child 005) | The Codex copy stays old and the mirror check fails | Stop and report. Never hand-edit `.codex` |
| Risk | The sync generators also rewrite a sibling's pending mirror change (child 003 edits `code.md`) | Scope creep into another child's files | Stop when the Codex or Pi run reports more than one written agent, or when Hermes lists any path other than the two named |
| Risk | The pre-commit `gate:route-remint` re-mints the compiled manifest at commit time (child 006 note) | The archived copy can drift after commit | The orchestrator reruns the `cmp` check after the commit |
| Risk | `verify_alignment_drift.py` lists git-tracked files only | The new checker is not in the scan until it is tracked | Report the scan count as observed. Do not stage |
| Risk | The review agent's per-format lists in section 8 order their sections differently from the new report-order paragraph | Two orders in one agent doc | Open question 1. The builder does not reorder those lists |
| Risk | The deep-review copies of the finding format have no case rule | Deep-review findings can lack a case | Open question 3. A follow-up amendment would cover them |

---

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Each question below carries the decision the builder follows. The operator can overturn any of them with an amendment.

1. **Section 8 ordering in the review agent.** The new report-order paragraph governs. The per-format lists below it keep their current order, and the mismatch is named in the build report. Decision: leave the lists as they are.
2. **Review-core id.** D4 changes the `id` row and the suggested-shape heading to the finding's list number, beyond the brief's file list. Decision: apply it. The operator can drop it.
3. **Deep-review copies.** The `deep-review` agent and its mirrors keep their finding format with no case rule. Decision: out of scope for this phase.
4. **Closing line of the harness.** The harness keeps `All rule-canary test cases passed`. Decision: the count is 54 PASS lines plus that closing line, and no line may begin with `FAIL`.
5. **Packet changelog.** No changelog is written, following the precedent of phases 004 and 005 and decision D3. Decision: the operator decides at parent close whether a packet changelog is created.
<!-- /ANCHOR:questions -->

---
