---
title: "Feature Specification: Phase 2: review-mode"
description: "The sk-code-review mode detects surfaces with a private rule that sends any package.json or src/ repository to Webflow, has no Obsidian surface, and its findings checker passes the heading-shaped findings its own doctrine prescribes without checking them."
trigger_phrases:
  - "review mode"
  - "phase 2 review mode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: review-mode

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
| **Branch** | `scaffold/002-review-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-shared-and-hub-docs |
| **Successor** | 003-quality-mode |
| **Handoff Criteria** | The detector probe prints UNKNOWN for both generic Node inputs and OBSIDIAN for the plugin prompt, the canary harness prints 68 PASS lines, and the review packet carries version 1.7.0.0 with its changelog |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Round-three remediation child specification.

**Scope Boundary**: Everything under `.skilled/skills/sk-code/sk-code-review/`. The review agent files are owned by this child but are not edited (plan decision D9).

**Dependencies**:
- Round-three findings f-iter006-001, f-iter006-002, f-iter007-001, f-iter007-002, f-iter007-003, f-iter008-001, f-iter009-001, f-iter009-002, f-iter010-001, f-iter010-002, f-iter011-001, f-iter011-002, f-iter019-001, f-iter019-002 and f-iter019-003 in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/`
- The shared detection contract `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2, read-only here

**Deliverables**:
- A surface detector that restates the shared contract, with an OBSIDIAN branch and surface tokens named after the contract's surfaces
- A findings checker that reads both documented finding shapes, a four-file review-output fixture, and new canary and harness cases
- Doc fixes: cache location, deep-review ownership rule, one status vocabulary, removal-plan scale note, playbook ID range and validator rule set, README folder convention and current mode names
- Version 1.7.0.0 and its changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review mode's `detect_surface_evidence` (`sk-code-review/SKILL.md:220-230`) returns Webflow for any changed path containing `package.json` or `src/`, while the shared contract says generic Node stays UNKNOWN, and it has no Obsidian branch, so an Obsidian plugin review gets `sk-code:unknown`. Its findings checker matches only list-item findings, so the heading shape `references/review-core.md` prescribes passes as "no numbered findings". Smaller drift sits around them: a cache written into the reviewed repository's `.skilled/` folder, two documents claiming the deep-review taxonomy, two status vocabularies, a removal plan reusing P0 to P2, a playbook ID range naming a scenario that does not exist, a validator command that falls back to README rules, a forbidden folder convention, and pre-rename mode names.

### Purpose
A review of any repository gets the surface the shared contract assigns, every documented finding shape is checked, and the packet's docs agree with each other and with the tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the private detector with one that restates `stack-detection.md` section 2, returns `OPENCODE`, `OBSIDIAN`, `WEBFLOW` or `UNKNOWN`, and point the mode to the shared contract
- Name the Obsidian surface in the output contract and in `review-core.md`
- Teach `check-review-findings.js` the heading shape, accept extra spaces after `Not checked:` in `check-review-final-line.js`, add a review-output fixture and harness cases, and pin the new invariants in the canary
- Move the M-1 cache to the user cache directory and state its side effect
- Add the deep-review ownership rule, unify the status vocabulary, add the removal-plan sentence, fix the CR-019 range, the playbook validator command and the README folder convention
- Replace pre-rename mode names in the packet's prose, including the SKILL.md rows of the same family
- Bump the packet to 1.7.0.0 with a changelog entry

### Out of Scope
- `.skilled/agents/review.md`, `.claude/agents/review.md` and their mirrors - no finding needs an agent edit (plan decision D9)
- `.skilled/skills/sk-code/shared/`, `mode-registry.json` and the deep-review contract YAML - owned elsewhere; see the plan's Handoffs
- The frontmatter `description`, `Keywords` comment and `trigger_phrases` that say `code-review` - routing inputs, kept (plan decision D10)
- The pre-existing `missing_required_section: overview` error in `references/pr-state-dedup.md` - not in the findings
- Hermes regeneration and compiled-manifest re-mint - the orchestrator's

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Version, detector, shared pointer, Obsidian token, status tokens, cache path, playbook validator, mode names |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modify | Version, mode names, surface token, cache path, playbook validator, folder convention |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modify | Ownership rule, surface tokens and shared pointer |
| `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md` | Modify | Deep-review YAML described as an external consumer |
| `.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md` | Modify | Status-line tokens for the gate recommendation |
| `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md` | Modify | Cache path and rationale |
| `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md` | Modify | Urgency-scale sentence |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scenario ID range without CR-019 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js` | Modify | Heading shape and column-0 Case line |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modify | Extra spaces after `Not checked:` |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modify | New exact-string pins |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | Seeded UX file, 14 new PASS lines |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | Checker, fixture and canary rows, expected count, mode name |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/` | Create | Four review outputs, two shapes, good and bad |
| `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generic Node is UNKNOWN | `python3 -I specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode/scratch/detect-probe.py` prints `generic-node-src: UNKNOWN` and `dependency-bump: UNKNOWN`, and its controls print `hub-file: OPENCODE` and `webflow-path: WEBFLOW` |
| REQ-002 | Obsidian surface | The probe prints `obsidian-prompt: OBSIDIAN` and `obsidian-manifest: OBSIDIAN`; SKILL.md's output contract and `review-core.md` name `OBSIDIAN` |
| REQ-003 | Both finding shapes checked | `check-review-findings.js` passes both valid fixtures with the "numbered once" OK line, fails `heading-shape-missing-case.md` and `heading-shape-restart.md` with exit 1, and `check-rule-copies.test.sh` prints 68 PASS lines and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cache outside reviewed repositories | `rg -n 'code-review-cache' SKILL.md README.md references` over the packet prints nothing and exits 1; SKILL.md, README.md and `pr-state-dedup.md` each carry one `XDG_CACHE_HOME` line |
| REQ-005 | Deep-review ownership rule | `review-core.md` carries one `external consumer` line; `quick-reference.md` no longer says `source of truth` |
| REQ-006 | One status vocabulary | `rg -n '\bAPPROVE\b|\bREQUEST_CHANGES\b|\bCOMMENT\b'` over SKILL.md, README.md, `references/`, `assets/` and `manual-testing-playbook/` prints nothing and exits 1 |
| REQ-007 | Removal scale disambiguated | `assets/removal-plan.md` carries one `rank removal urgency only` line |
| REQ-008 | No phantom CR-019 | The playbook index no longer says `CR-001..CR-024 or` and carries `CR-019 is not assigned` once |
| REQ-009 | Playbook rule set | SKILL.md and README.md each name `--type playbook` once, and that command prints `Document type: playbook` and `Total issues: 0` |
| REQ-010 | Extra spaces after `Not checked:` | A review whose `Not checked:` line has two spaces after the colon passes `check-review-final-line.js` with exit 0 |
| REQ-011 | Shared-layer pointer | SKILL.md has two lines and `review-core.md` one line containing `shared/references/stack-detection.md` |
| REQ-012 | README folder convention | `rg -n '<NN>' README.md` prints nothing and exits 1 |
| REQ-013 | Current mode names | The pre-rename name search over the packet's prose prints only the three frontmatter lines kept by decision D10 |
| REQ-014 | Version and changelog | SKILL.md and README.md say `version: 1.7.0.0`, and `changelog/v1.7.0.0.md` validates with `Total issues: 0` |
| REQ-015 | Ripple checks green | Canary, drift guards, leaf manifest and the agent mirror checks keep their baselines; Hermes `--check` reports only the `sk-code-review` copy pending the orchestrator |
| REQ-016 | Scope | `git status --porcelain` over the owned paths differs from the Phase 1 copy only by the files in the table above |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three foreign inputs from the research reproduce their defect before the build and print `UNKNOWN`, `UNKNOWN` and `OBSIDIAN` after it
- **SC-002**: Each documented finding shape has a known-good and a known-bad review output that both checkers grade, so a vacuous pass fails the harness
- **SC-003**: Every new invariant (assessment tokens, gate-recommendation tokens, shared-contract pointer) is pinned by the canary and has a failing tamper case or pin
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 001 edits `shared/references/universal/code-quality-standards.md` and `workflow-verify.md`, which the canary pins | Med | Builds run in parallel; if the canary fails only on those two files, record it as the sibling's and rerun after the orchestrator merges |
| Dependency | `mode-registry.json:50` still names the old cache path | Low | Handoff to child 001 in plan.md |
| Risk | The SKILL.md edit stales the compiled sk-code manifest | Low | The guard read fresh after body edits in an earlier phase; if stale, hand the re-mint to the orchestrator |
| Risk | A consumer matched the old `sk-code:code-*` tokens | Low | No consumer outside the packet and its Hermes copy (searched 2026-10-10); the changelog's Upgrade note names the new tokens |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Design choices are recorded as decisions D1 to D13 in plan.md.
<!-- /ANCHOR:questions -->

---
