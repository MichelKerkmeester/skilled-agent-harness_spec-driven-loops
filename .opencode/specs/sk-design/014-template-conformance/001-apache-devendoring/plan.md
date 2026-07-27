---
title: "Implementation Plan: De-vendor design-interface's Apache-2.0 dependency"
description: "Ordered plan: rewrite the vendored guidance in original words first, verify intent is preserved, only then git rm LICENSE.txt and every citing site, and record the change in changelog/."
trigger_phrases:
  - "apache devendoring plan"
  - "design-interface license removal plan"
  - "design principles rewrite plan"
  - "vendored guidance de-vendor plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T14:52:12.976Z"
    last_updated_by: "spec-author"
    recent_action: "Authored ordered de-vendor-then-delete plan"
    next_safe_action: "Execute Phase 1 rewrite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/LICENSE.txt"
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: De-vendor design-interface's Apache-2.0 dependency
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content + git |
| **Framework** | sk-design `design-interface` mode |
| **Storage** | Git-tracked files only; no database or generated artefact |
| **Testing** | Manual grep sweep + `package_skill.py --check` |

### Overview
This is a two-phase, strictly ordered change. Phase 1 rewrites `design-principles.md`'s guidance in original words and verifies the rewrite preserves intent — this is load-bearing: until it lands, the Apache-2.0 license may not be removed. Phase 2 removes `LICENSE.txt` via `git rm` and every site that cites it (SKILL.md, README.md, the manual-testing playbook), then records the change in `changelog/`. If Phase 1 cannot genuinely preserve intent in original words, the packet halts before Phase 2 and escalates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `design-principles.md` current text has been read in full, section by section.
- [ ] Every citing site (`SKILL.md:9,295,345`; `README.md:166,199`; `design-principles.md:17`; the manual-testing playbook) has been located and line-confirmed.

### Definition of Done
- [ ] The rewritten `design-principles.md` carries no verbatim Apache-2.0 sentence and preserves the original guidance's intent.
- [ ] `LICENSE.txt` is removed via `git rm` (not a plain `rm`).
- [ ] All six citing sites plus the manual-testing scenario are updated.
- [ ] `changelog/` has a new entry recording the de-vendor.
- [ ] `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` (excluding `changelog/`) returns nothing.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential two-phase change with a hard-stop gate between phases — the "de-vendor first, delete second" ordering is itself the safety mechanism, not an implementation detail.

### Key Components
- **design-principles.md rewrite**: preserves core principle, grounding, two-pass process (direction then critique), restraint, and interface-writing guidance, in original phrasing.
- **License removal**: `git rm LICENSE.txt`, staged so it cannot be silently restored by a later checkout without a corresponding re-add.
- **Citation cleanup**: `SKILL.md` frontmatter + two provenance notes, `README.md` Q&A + resource-table row, `design-principles.md`'s own attribution line.
- **Manual-testing correction**: ID-007's PASS condition no longer depends on `LICENSE.txt` existing; either deleted or inverted to check the de-vendored state.
- **Changelog entry**: records the rewrite and removal as a versioned, dated change.

### Data Flow
Read current `design-principles.md` in full -> draft original-words rewrite preserving section-by-section intent -> compare against original to confirm no rule was lost -> commit the rewrite -> `git rm LICENSE.txt` -> edit `SKILL.md`, `README.md`, `design-principles.md:17` -> update or remove ID-007 and its two playbook summary references -> author `changelog/` entry -> sweep-grep to confirm zero remaining citations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: De-vendor (load-bearing; must land before Phase 2)
- [ ] Read `design-principles.md` in full and list every guidance point it makes.
- [ ] Draft an original-words rewrite that preserves each point.
- [ ] Compare rewrite against the original point-by-point; confirm no guidance was lost or altered in meaning.
- [ ] HARD STOP CHECK: if any point cannot be genuinely rewritten without losing intent, halt here and escalate to the operator — do not proceed to Phase 2.

### Phase 2: Delete the license and its citations (only after Phase 1 passes)
- [ ] `git rm .opencode/skills/sk-design/design-interface/LICENSE.txt`
- [ ] Remove `license: Apache-2.0; see LICENSE.txt` from `SKILL.md:9`
- [ ] Remove provenance citations from `SKILL.md:295` and `SKILL.md:345`
- [ ] Remove the licensing Q&A from `README.md:166`
- [ ] Remove the resource-table row from `README.md:199`
- [ ] Rewrite the attribution line at `design-principles.md:17`
- [ ] Delete or invert manual-testing scenario `licensing-and-provenance-integrity.md` (ID-007)
- [ ] Update the two ID-007 summary references in `manual-testing-playbook.md:68,349,355`
- [ ] Author a new `changelog/` entry recording the de-vendor
- [ ] Confirm `.gitignore` is untouched

### Phase 3: Verification
- [ ] `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` (excluding `changelog/`) returns nothing
- [ ] `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` still reports the skill valid
- [ ] `validate.sh .opencode/specs/sk-design/014-template-conformance/001-apache-devendoring --strict` passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Confirm zero remaining Apache/LICENSE.txt references outside changelog history | `rg -n` |
| Structural | Skill still packages/validates after removal | `package_skill.py --check` |
| Manual comparison | Rewritten guidance preserves original intent | Side-by-side read, no tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 rewrite quality | Internal | Not started | Blocks all of Phase 2 — this is the load-bearing gate |
| `changelog/` naming convention | Internal | Existing (`v1.0.0.0*.md`) | New entry must match or the packet is inconsistent with prior releases |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rewrite is later found to have dropped guidance, or a citing site was missed and the skill still claims Apache-2.0 without the license.
- **Procedure**: Revert the de-vendor commit(s); `LICENSE.txt` and its citations return via git history; re-attempt Phase 1 with the missing guidance restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (De-vendor) ──(HARD GATE)──> Phase 2 (Delete license + citations) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| De-vendor | None | Delete |
| Delete | De-vendor (must pass intent-preservation check) | Verify |
| Verify | Delete | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Rewrite comparison recorded (point-by-point, not just "looks fine")
- [ ] All six citing sites plus the manual-testing scenario identified before any deletion

### Rollback Procedure
1. **Immediate**: If the rewrite is found lossy after the fact, do not delete `LICENSE.txt` retroactively-restore it via git revert.
2. **Revert code**: `git revert` the de-vendor commit(s).
3. **Verify**: Confirm `LICENSE.txt` and all citations are back, then re-attempt Phase 1.

### Data Reversal
- **Has data migrations?** No — this is a documentation/licensing change only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Ordered, gated two-phase change
- Hard-stop condition documented explicitly
-->
