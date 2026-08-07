---
title: "Feature Specification: Close retirement residue from audit/foundations + finish interrupted design-interface leaf docs"
description: "Confirmed retired-mode vocabulary (foundations, audit) still lives in five non-design-motion sites the earlier retirement missed, plus five design-interface leaf packets (005-009 under sibling 002) whose implementation-summary.md/checklist.md were left mid-write while their corresponding skill-file edits already landed on disk."
trigger_phrases:
  - "retirement residue"
  - "audit foundations vocabulary cleanup"
  - "design-interface leaf docs finish"
  - "interrupted packet docs"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec covering confirmed residue sites + interrupted leaf docs"
    next_safe_action: "Re-confirm the five Track A residue sites before editing any of them"
    blockers:
      - "005-009 doc completion should wait until 010-motion-merge lands, since design-motion/README.md and corpus-map.md residue is superseded by that merge"
    key_files:
      - ".opencode/skills/sk-design/design-motion/README.md"
      - ".opencode/skills/sk-design/design-motion/references/corpus-map.md"
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json"
      - ".opencode/install-guides/README.md"
      - ".opencode/skills/sk-doc/create-command/assets/command-contract.json"
      - ".opencode/skills/sk-design/manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md"
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/007-feature-catalog/"
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/008-manual-testing-playbook/"
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/009-changelog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Close retirement residue from audit/foundations + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (Track A: 5/6 sites fixed, 1 explicitly deferred to sibling scope; Track B: all 4 leaves verified+reconciled, 2 findings left open for operator decision) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `010-motion-merge` |
| **Successor** | `012-remaining-mode-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two unrelated kinds of residue survived this session's earlier retirements. First, confirmed leftover vocabulary from the `audit`/`foundations` mode retirement lives in five sites the earlier cleanup missed: `design-motion/README.md` (`:36`, `:40`, `:80`, `:88`, `:89`) and `design-motion/references/corpus-map.md:48` still cite `audit`/`foundations`; `design-md-generator/SKILL.md:246` and its procedure-card inventory still list four modes including both retired ones; `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json` still asserts `foundations`/`audit` test cases; `.opencode/install-guides/README.md` and `sk-doc/create-command/assets/command-contract.json:81` still list the retired commands; `manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md:34` still claims five workflow modes. Second, sibling `002-design-interface`'s per-leaf packets 005-009 had their corresponding `design-interface` skill-file edits (in `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/`) land on disk, but the leaf packets' own `implementation-summary.md`/`checklist.md` were interrupted mid-write: `005-corpus` correctly shows Completed/3/3 verified, while `006-scripts`, `007-feature-catalog`, `008-manual-testing-playbook`, and `009-changelog` still show Status Planned and 0/N verified in their checklists, even though the corresponding skill-file edits already exist on disk (confirmed by file mtimes clustered in this session's working window).

### Purpose

Close both kinds of residue: sweep and fix the five confirmed vocabulary sites (excluding anything inside `design-motion/`, which `010-motion-merge` resolves as part of the merge, not this packet), and reconcile `006-009`'s documentation to accurately reflect the skill-file work already done — verifying what's actually on disk against each leaf's own requirements before marking anything complete, never rubber-stamping.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Removing retired-mode vocabulary from `design-md-generator/SKILL.md:246`'s procedure-card inventory (four-mode list including `foundations`/`audit`).
- Updating `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json`'s test cases that assert `foundations`/`audit` as live modes.
- Updating `.opencode/install-guides/README.md`'s sk-design row listing retired commands/modes.
- Updating `sk-doc/create-command/assets/command-contract.json:81`'s `invocation_aliases` list (drops `/interface:foundations`, `/interface:audit`).
- Updating `manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md:34`'s five-mode claim to the current mode count.
- Verifying (against each leaf's own `spec.md`/`checklist.md` requirements) that the on-disk skill-file edits in `design-interface/scripts/`, `feature-catalog/`, `manual-testing-playbook/`, and `changelog/` actually satisfy `006-scripts`, `007-feature-catalog`, `008-manual-testing-playbook`, and `009-changelog`.
- Finishing `006-009`'s `implementation-summary.md` (What Was Built, Files Changed) and `checklist.md` (marking items `[x]` with real evidence) to match the verified on-disk state.

### Out of Scope

- `design-motion/README.md:36,40,80,88,89` and `design-motion/references/corpus-map.md:48` — these live inside `design-motion/`, which `010-motion-merge` deletes or rewrites wholesale; fixing them here would be redundant with, and could conflict with, that merge.
- Re-doing or second-guessing the actual skill-file edits already on disk for `006-009` — this packet verifies and documents, it does not re-implement.
- `009-aesthetics-retirement`'s and `010-motion-merge`'s own scope.
- Any other sibling's (`003`-`008`) conformance work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/SKILL.md:246` | Modify | Drop `foundations`/`audit` from the four-mode procedure-card inventory line |
| `compiled-routing/.../006-sk-design/fixtures/canary-cases.v1.json` | Modify | Retire `foundations`/`audit` test cases (`:5,7,8,10,12` per earlier audit) |
| `.opencode/install-guides/README.md` | Modify | Update sk-design row to current mode/command list |
| `sk-doc/create-command/assets/command-contract.json:81` | Modify | Drop retired command aliases from `invocation_aliases` |
| `manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md:34` | Modify | Update mode-count claim |
| `002-design-interface/006-scripts/implementation-summary.md`, `checklist.md` | Modify | Reconcile to verified on-disk state |
| `002-design-interface/007-feature-catalog/implementation-summary.md`, `checklist.md` | Modify | Reconcile to verified on-disk state |
| `002-design-interface/008-manual-testing-playbook/implementation-summary.md`, `checklist.md` | Modify | Reconcile to verified on-disk state |
| `002-design-interface/009-changelog/implementation-summary.md`, `checklist.md` | Modify | Reconcile to verified on-disk state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `design-md-generator/SKILL.md:246`'s procedure-card inventory no longer lists `foundations` or `audit` | `rg -n "foundations\|audit" design-md-generator/SKILL.md` returns nothing outside legitimate historical/changelog mentions |
| REQ-002 | `canary-cases.v1.json`'s `foundations`/`audit` test cases are retired or updated to reflect current modes | `rg -n "\"foundations\"\|\"audit\"" .../canary-cases.v1.json` returns nothing, or the file is confirmed out of scope because `010-motion-merge` supersedes it |
| REQ-003 | Each of `006-009`'s on-disk skill-file edits is independently verified against its own `spec.md`/`checklist.md` requirements before any doc is marked complete | Verification note (what was checked, what passed) recorded per leaf in `implementation-summary.md` |
| REQ-004 | `006-009`'s `checklist.md` items are marked `[x]` only where verification in REQ-003 actually passed, with real evidence, never rubber-stamped from the sibling `005` pattern | Each `[x]` checklist item cites a real command/file, not a copy-pasted "planned" placeholder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `.opencode/install-guides/README.md`'s sk-design row reflects the current mode/command count | Row lists only live modes/commands as of this packet's execution time |
| REQ-006 | `command-contract.json:81`'s `invocation_aliases` drops retired command aliases | `rg -n "foundations\|audit" sk-doc/create-command/assets/command-contract.json` returns nothing |
| REQ-007 | `shared-base-not-workflow.md:34`'s mode-count claim is updated | Line states the correct current mode count, not "five" |
| REQ-008 | Anything inside `design-motion/` is explicitly deferred to `010-motion-merge`, not duplicated here | Spec and checklist both state this exclusion; no edit is made inside `design-motion/` by this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No confirmed residue site outside `design-motion/` still asserts retired `foundations`/`audit` vocabulary.
- **SC-002**: `006-009`'s documentation accurately reflects their real, verified on-disk completion state — no packet claims Planned when the work is done, and no packet claims done without genuine verification.
- **SC-003**: `design-motion/`-internal residue is explicitly named as `010-motion-merge`'s responsibility, not silently dropped or duplicated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marking `006-009` checklist items `[x]` without genuinely verifying the on-disk skill-file edits against each leaf's own requirements | Rubber-stamped completion claims (a "finding is a hypothesis" violation) | Verify each leaf's actual on-disk state against its own `spec.md` before touching its checklist |
| Risk | Fixing `design-motion/`-internal residue here duplicates or conflicts with `010-motion-merge`'s wholesale rewrite | Wasted work or a merge conflict between siblings | Explicit out-of-scope carve-out; re-confirm `010` has landed before considering any `design-motion/` site closed |
| Dependency | `010-motion-merge` landing before this packet's final sweep | The `design-motion/README.md`/`corpus-map.md` sites remain open until then | Sequence this packet's `design-motion`-adjacent verification after `010` lands; the non-motion sites can proceed independently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No leaf's `checklist.md` or `implementation-summary.md` is marked complete without a real, cited verification against its own `spec.md` requirements — this packet exists specifically to prevent rubber-stamped completion claims.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **On-disk skill-file edits for `006`/`007`/`008`/`009` don't actually satisfy their own leaf's requirements when checked**: do not mark the checklist complete — record the gap in `implementation-summary.md` as a genuine finding and leave the item unchecked, rather than closing the doc to match a false "already done" assumption.
- **A residue site named here turns out to already be fixed by concurrent work** (e.g. another sibling touched it first): verify with a fresh `rg` before editing; if already clean, note it as confirmed-clean rather than re-editing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding — the residue sites and the doc-reconciliation scope are both confirmed by direct inspection at authoring time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../010-motion-merge/`
- **Successor**: `../012-remaining-mode-conformance/`
- **Affected sibling**: `../002-design-interface/006-scripts/`, `007-feature-catalog/`, `008-manual-testing-playbook/`, `009-changelog/`
