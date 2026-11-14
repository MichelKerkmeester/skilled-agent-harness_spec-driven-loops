---
title: "Feature Specification: Phase 1: parent-purpose-scaffold"
description: "A new phase parent ships with a Problem Statement and a Purpose that no check ever asks an author to fill. This phase turns the two hints into value tokens so the validator warns while the parent is a Draft and fails it once it is not."
trigger_phrases:
  - "parent purpose scaffold"
  - "phase 1 parent purpose scaffold"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: parent-purpose-scaffold

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `scaffold/001-parent-purpose-scaffold` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-resume-purpose-row |
| **Handoff Criteria** | A sandbox `create.sh --phase` parent shows two `[YOUR_VALUE_HERE:` tokens under Problem Statement and Purpose, and the four test files in `plan.md` section 5 pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: the phase-parent template, its manifest version, the dead generic-text lines in `create.sh`, the golden snapshot and one test assertion. The resume brief, the relaunch note, the compaction brief and the continuity block belong to phases 2 to 5.

**Dependencies**:
- None. The four later phases read a parent's purpose, and this phase only makes sure a new parent has one to read.

**Deliverables**:
- A phase-parent template whose Problem Statement and Purpose hints are value tokens, stamped `v2.3`
- A `create.sh` with no generic parent problem or purpose text in it
- One test assertion that a new parent reaches its author with the Purpose still open
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent packet exists so that a session crossing relaunch hops or compactions still knows why its work exists and whom it serves.

A new phase parent can reach Complete with no stated purpose, and no check notices. Today `create.sh --phase` leaves the template's plain hints `[One-paragraph problem statement ...]` and `[One-paragraph purpose ...]` in the parent. Those hints are not `[YOUR_VALUE_HERE:` tokens, so `PLACEHOLDER_FILLED` reports "No unfilled template placeholders found" (see Measured Behavior). The research named the generic sentence at `create.sh:1875-1876` as the cause. That code no longer fires: lines 1902-1903 match `[YOUR_VALUE_HERE: one-paragraph ...]`, and the template carries `[One-paragraph ...]`, so the substitution never matches. `git log --all -S 'YOUR_VALUE_HERE: one-paragraph purpose'` last finds that string changed in `e2712403ea` on 2026-09-07, "scaffold only known values", which is likely when the lines went dead. The five live parents that carry the generic sentence are all stamped `spec-core | v2.2`, from an older scaffold path. The gap that remains is that the purpose slot is unflagged, not that it is filled with layout text.

### Purpose
Make every new phase parent reach its author with Problem Statement and Purpose as value tokens, so `validate.sh --strict` warns while the parent is a Draft and fails it at any other status.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run in a throwaway git repository under the session scratchpad that links `.skilled` to this worktree, the same sandbox `scaffold-passes-its-own-gate.vitest.ts` builds.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --phase --phases 2 --phase-names first,second "purpose probe"; echo "create exit=$?"
create exit=0
$ grep -n -A1 -E "^### (Problem Statement|Purpose)" specs/001-purpose-probe/spec.md
63:### Problem Statement
64-[One-paragraph problem statement — what needs solving and why]
--
66:### Purpose
67-[One-paragraph purpose — what this phased decomposition achieves]
$ grep -c "Keep parent documentation lean" specs/001-purpose-probe/spec.md
0
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/001-purpose-probe --strict --no-recursive | grep -E "PLACEHOLDER_FILLED|ANCHORS_VALID|^Summary|^RESULT"
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ ANCHORS_VALID: Phase parent lean document set accepted
Summary: Errors: 0  Warnings: 1
RESULT: PASSED
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace the Problem Statement and Purpose hints in the phase-parent template with `[YOUR_VALUE_HERE: ...]` tokens.
- Raise the phase-parent template stamp and its manifest entry from `v2.2` to `v2.3`. Without it the validator reads a token in this template as an error even in a Draft, so every untouched parent fails its own gate.
- Delete the four `create.sh` lines that define and substitute the generic parent problem and purpose.
- Update the three golden-snapshot lines that pin the old stamp and hints.
- Add one assertion that a new parent's Purpose is still a token. Nothing catches a generator that fills it today, because the snapshot renders the template and not `create.sh` output.

### Out of Scope
- Rewriting the 5 live parents that carry the generic sentence - they are a follow-up packet, listed in Open Questions.
- Turning the other plain hints in the template into tokens (`[One-line description]`, `[YYYY-MM-DD]`, `[Predecessor-packet]`) - they do not hold the purpose.
- Changing `ANCHORS_VALID`, which still exempts a phase parent - the token gate flags the purpose without it.
- Any change to the resume brief, relaunch note, compaction brief or continuity block - phases 2 to 5 own them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` | Modify | Stamp `v2.2` to `v2.3`, and the two hints become value tokens |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | `phase-parent.spec.md.tmpl` version `v2.2` to `v2.3` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Delete lines 1875-1876 and 1902-1903 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Lines 3235, 3273 and 3276 follow the template |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modify | Assert the new parent's Purpose is a token |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new phase parent carries value tokens under Problem Statement and Purpose | In a sandbox, after `create.sh --phase --phases 2 --phase-names first,second "purpose probe"`, `grep -c '^\[YOUR_VALUE_HERE: ' specs/001-purpose-probe/spec.md` prints 2 |
| REQ-002 | An untouched new parent still passes its own gate, with the purpose flagged | `validate.sh specs/001-purpose-probe --strict --no-recursive` prints `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` and `Errors: 0` |
| REQ-003 | A new parent with an unfilled purpose fails once its status leaves Draft | With Status set to `In Progress`, the same command prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `create.sh` holds no generic parent purpose text | `rg -c 'Keep parent documentation lean\|_phase_parent_purpose\|_phase_parent_problem' create.sh` prints nothing and exits 1, and `bash -n create.sh` exits 0 |
| REQ-005 | The four affected test files pass | The vitest command in `plan.md` section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior run, repeated after the change, prints `[YOUR_VALUE_HERE: ...]` on lines 64 and 67 in place of the plain hints, and `PLACEHOLDER_FILLED` turns from `+` to `!`.
- **SC-002**: The vitest run in `plan.md` section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)` after the change, as it did at baseline.
- **SC-003**: `git diff --stat` lists only the five files in section 3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `template-version-parity.vitest.ts` compares the manifest version with the template stamp | The suite fails if only one of the two moves | Edit both in the same pass, then run the suite |
| Risk | A `v2.3` stamp makes `SCAFFOLD_NEVER_TOUCHED` read the parent's own frontmatter once it is Complete. A sandbox parent with a filled purpose at `v2.3` and Status Complete failed on `packet_pointer` starting with `scaffold/` and `recent_action: "Initialize phase-parent continuity block"`. At `v2.2` the same file passed that rule | Med | Only parents scaffolded after the change carry `v2.3`, since the 103 live parents keep their in-file `v2.2` stamp. `repair-derived.cjs --apply` rewrites the pointer. The `recent_action` line is a one-line edit at close. Open question 1 asks whether to accept that |
| Risk | The token wording could match a future `create.sh` substitution and be filled with generic text again | Low | The new test assertion fails if the Purpose line is no longer a token |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

1. Is the `SCAFFOLD_NEVER_TOUCHED` side effect in section 6 acceptable for new parents? The plan accepts it, because a parent marked Complete with untouched continuity is the kind of gap this packet targets. If not, a second template edit to `recent_action` is needed.
2. Follow-up, not this phase: rewrite the purpose of the 5 live parents that carry the generic sentence:
   - `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md` (In Progress)
   - `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md` (Draft)
   - `specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md` (Draft)
   - `specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md` (Draft)
   - `specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md` (Complete)
3. Follow-up, not this phase: `repo-era.mjs` has no alias for `phase-parent-spec`, so every phase parent classifies as legacy whatever the manifest says. The stamp change neither causes nor fixes that.

Settled during planning:
- The append path (`create.sh --phase --parent <existing>`) leaves the parent's purpose alone. The whole render block sits under `if [[ "$APPEND_TO_EXISTING_PARENT" != true ]]` at `create.sh:1866`. Append mode only adds Phase Documentation Map rows (`create.sh:1930-1937`).
- `v2.3`, not `v2.4`. `v2.3` is the lowest stamp that turns on the token gate (`orchestrator.ts:758-759`). The only `v2.4` gate is `MEASURED_BEHAVIOR`, which applies to spec-core alone (`measured-behavior-rule.vitest.ts:97`). A sandbox parent at `v2.4` gave the same verdict as `v2.3`.
<!-- /ANCHOR:questions -->

---

