---
title: "Feature Specification: Retirement Read-Path Closure"
description: "Five places where the checklist retirement left a check reporting green while doing nothing: an id filter that exempts every fix-verification item, a level inference reading a file that no longer exists in two modules, a flag parser that fails to disabled, authoring docs still naming the retired document, and a scaffold that emits packets with no verification region at all."
trigger_phrases:
  - "retirement read path closure"
  - "chk-fix evidence exempt"
  - "level two inference dead"
  - "verification region missing from scaffold"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/013-retirement-read-path-closure"
    last_updated_at: "2026-08-30T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored from a fresh-model review plus one defect found while scaffolding this packet"
    next_safe_action: "Plan the five fixes; each is independent"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/parse-bool-flag.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-retirement-read-path-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retirement Read-Path Closure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-fingerprint-docset-enforcement |
| **Successor** | - |
| **Handoff Criteria** | No check in the retirement's blast radius reports green while doing nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13**, and the last of the parent. Phase 010 retired the standalone verification
checklist and moved verification into `tasks.md`. Five read-paths never followed.

**Scope Boundary**: Only the paths the retirement broke or left behind. The retirement decision
itself is settled and is not reopened.

**Dependencies**:
- Independent of 012; different files, no shared surface.

**Deliverables**:
- Five independent fixes, each with its own negative control.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Each of these was reproduced against the live tree.

**Nothing verifies that verification items cite evidence.** The rule that did was found to
exempt every fix-verification item — its id filter matched three digits after the prefix, so the
seven `FIX`-family items the shipped template defines, all P0 or P1, never reached the check. A
concurrent packet then deleted that rule outright, along with eight others, on the grounds that
they were advisory and nothing read them. That is the cheaper answer and it stands. What it
leaves open is a question, not a regex: the retirement's premise was that verification moved into
the tasks document, and nothing now holds the items in it to any standard.

**Level 2 can no longer be inferred, in two modules.** Re-measured after a concurrent packet
that aligned a different pair of level engines; this pair is unchanged. `completion-state.cjs` still reads
`filesPresent.checklist` after that key was removed from the canonical filenames, so `inferLevel`
returns only 1 or 3. `shared/parsing/spec-doc-health.ts` has the identical dead branch and was
never touched by the retirement at all. Neither gained `acceptance-criteria.md` as the
replacement signal.

**An unrecognized flag value silently disables a blocking rule.** `parse-bool-flag.sh` returns
false for anything it does not recognize. Both of its consumers default to enabled and gate a
hard failure, so a typo in either enforcement variable downgrades a validation failure to a pass.

**The authoring documentation still teaches the retired document as required.** Phase 011 swept
the dead links, which is a different thing: the level contract still describes the document as
what Level 2 adds. `level-specifications.md` still records "Hard block if `checklist.md` missing"
and links `templates/addons/checklist.md.tmpl`, which no longer exists; `quick-reference.md` still
defines Level 2 as "Level 1 + checklist.md" and gives it as the 1-to-2 upgrade step. A reader
following the documentation would build a packet around a document the tooling deleted.

**The scaffold emits packets with no verification region.** The template gates that region on
level 2 and above, `create.sh` hardcodes phase children to level 1, and `upgrade-level.sh` does
not re-assemble `tasks.md` when raising the level. A phase child is therefore born without the
merged verification document and cannot gain it through the sanctioned upgrade — which leaves the
coverage rule with no traceability source and the evidence rule with nothing to check.

### Purpose

Every check in the retirement's blast radius either does its job or says it cannot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Whether the deleted evidence rule needs a successor.
- Level inference in both modules that carry the dead branch.
- The shared boolean flag parser and the two rules that consume it.
- The eight reference documents that still teach the retired document.
- The scaffold and upgrade paths that decide whether a packet has a verification region.

### Out of Scope
- Re-litigating the retirement — the decision stands.
- The two path-containment findings from the same review, which belong to their own packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (no file) | Decide | Whether the deleted evidence rule needs a successor, or its absence is the correct end state |
| `scripts/lib/completion-state.cjs` | Modify | Infer level 2 from the document that replaced the checklist |
| `shared/parsing/spec-doc-health.ts` | Modify | Same fix in the module the retirement never touched |
| `scripts/lib/parse-bool-flag.sh` | Modify | Fail loudly on an unrecognized value |
| `scripts/spec/create.sh` | Modify | Stop hardcoding phase children to level 1 |
| `scripts/spec/upgrade-level.sh` | Modify | Re-assemble `tasks.md` when raising the level |
| `references/**` | Modify | Correct the level contract, which still names the retired document as what Level 2 adds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The consequence of deleting the evidence rule is recorded deliberately: either something holds verification items to a standard, or the packet states plainly that nothing does and why that is acceptable. |
| REQ-002 | Level 2 is inferable again in both modules, keyed on the document that replaced the checklist. |
| REQ-005 | A packet at level 2 or above has the merged verification region, whether it was scaffolded at that level or upgraded to it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An unrecognized value for a rule's enable flag is an error, not a silent disable. |
| REQ-004 | No reference document defines a level in terms of the retired document, asserts a hard block on it, or links its deleted template. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet records a decision on evidence checking, with the reasoning, rather than leaving the gap undocumented.
- **SC-002**: Both level-inference functions return 2 for a level-2 packet.
- **SC-003**: A typo in either enforcement variable is reported rather than obeyed.
- **SC-004**: A freshly scaffolded phase child at level 2 has a verification region and a usable traceability source.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reinstating an evidence rule relitigates another packet's deliberate deletion | Med | Start from why it was deleted — advisory and unread — and only propose a successor that blocks |
| Risk | Failing loudly on an unknown flag value breaks a caller relying on the current silence | Med | Inventory the callers first; the two known consumers both default enabled |
| Risk | Changing the scaffold affects every future packet | Med | The change restores the template's own level gating rather than inventing behaviour |
| Dependency | The template's level gating is the source of truth for what a level-2 packet contains | Low | In-repo and stable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No rule gains a full-tree scan; all five fixes are local.

### Security
- **NFR-S01**: None of these changes widen what any path may write.

### Reliability
- **NFR-R01**: A rule that cannot determine its own enablement reports that, rather than choosing a default silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Ids with a trailing colon, four digits, or a lettered family segment — the shapes the deleted rule missed, and the shapes any successor would have to handle.
- A packet with no verification region at all: the coverage rule must say so rather than pass.

### Error Scenarios
- Flag value empty versus unset versus misspelled: unset keeps the default, misspelled is an error.
- A reference document that mentions the retired document historically rather than instructionally: keep the history, remove the instruction.

### State Transitions
- A packet scaffolded at level 1 and later upgraded: must end in the same shape as one scaffolded at level 2.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Seven code files plus eight documents |
| Risk | 10/25 | Each fix is local; the scaffold change has the widest reach |
| Research | 4/20 | All five reproduced before authoring |
| **Total** | **28/70** | **Level 2** |

The deterministic scorer returned Level 0. Level 2 was chosen deliberately: these are five
unrelated defects that each need their own evidence row, and the shared property of all of them
is that something reported green while doing nothing — which is the failure an acceptance-criteria
document exists to catch.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The evidence rule was deleted as advisory. Does verification-item evidence want a rule that actually blocks, or is the acceptance-criteria document already the enforcing surface and the old rule genuinely redundant?
- Should `parse-bool-flag.sh` fail loudly for every consumer, or report and keep the default for read-only rules while failing for blocking ones?
<!-- /ANCHOR:questions -->
