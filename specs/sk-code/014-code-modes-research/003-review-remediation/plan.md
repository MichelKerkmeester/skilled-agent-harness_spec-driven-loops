---
title: "Implementation Plan: Phase 3: review-remediation"
description: "Apply the deep review's confirmed findings in two passes: re-close the research documents against ADR-002 and a new ADR-003, then fix the sk-code-quality and sk-code-review docs and scripts the review named."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3 behind `.sh` names, Node ESM, Bash |
| **Framework** | system-spec-kit packet documents, sk-doc playbook template, sk-code-skilled checklists |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, sk-doc validators, `check-rule-copies.js` and the mode test suites |

### Overview

The packet-side pass writes ADR-003 first, because the goal criteria, AC-009 and CHK-032 all cite its command. It then amends the three goals, the acceptance rows, the task evidence and the research text. The skill-side pass rebuilds the quality playbook root from the template, fixes the review census, adds the COMPONENT headers and adds the Extension Floors section with its canary assertion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation and canary maintenance, no runtime code path changes.

### Key Components
- **ADR-003**: the record that scopes the `.skilled` boundary check to the two mode folders over `f8671e07c2..ee8c7e6f24`.
- **Extension Floors**: one list in `sk-code-review/SKILL.md` section 4, pinned line by line by `check-rule-copies.js`.

### Data Flow
`check-rule-copies.js` reads `SKILL.md`, finds the `### Extension Floors` heading, collects the lines up to the next heading or divider and requires each pinned floor inside them.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`check-rule-copies.test.sh` gains one case that rewords a floor and expects the canary to fail with the floor named. The other changes are documents and headers, covered by the existing validators and suites.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the closed research phases and the review report.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's working-tree changes with `git checkout` on the listed files, and restore the four deleted scratch drafts from `git show` where one was tracked.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum covers the second pass, which changes a routing contract and a shared verifier.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code/hub-router.json` `code-skilled-runtime` | Producer of the stage-two vocabulary for `sk-code-skilled` | Update: `bash`, `.ts` and `bug` added | `compiled-route.cjs --hub sk-code` replays of both prompts and five controls |
| Compiled activation manifest, served and authored twin | Consumer that pins the policy hash the router serves | Update: refreshed, then the twin copied | `compiled-route-sync.cjs --check` reports 55 served copies match |
| `ROUTER.md` `INTENT_SIGNALS` and `graph-metadata.json` `intent_signals` | Resource intents and the advisor's stage-one vocabulary | Unchanged. `ROUTER.md` already lists `bash` and `.ts` as resource signals, and the intent-signal generator carries only multi-word phrases | `generate-router-intent-signals.cjs --check --hub sk-code` reports missing 0 |
| `sk-code-skilled/SKILL.md` keyword comment | Discovery comment, read by no generator | Not a consumer | `rg` over `.skilled/bin` and `sk-create-skill/scripts` finds no reader of it |
| `verify_alignment_drift.py` `is_exact_header_exempt_path` | Producer of the exact-header exemption | Update: name-based exemption for test suffixes | `test_verify_alignment_drift.py` passes 30 tests |
| Compiled-routing playbook and admission test | Consumers that count and replay scenarios | Update: CB-CR-005 added, CB-CR-001 field fixed, corpus 88 to 89 | Scenario validator 5 of 5 PASS, admission test 29 of 29 pass |

Required inventories:
- Same-class producers: `rg -n "containsSignal" .skilled/bin/lib` shows the sk-code canary router matches by substring, with word boundaries only for `review`, `lcp`, `inp` and `cls`.
- Consumers of changed symbols: `rg -n "is_exact_header_exempt_path"` finds one caller, `check_exact_header`.
- Matrix axes: prompt class (target, out-of-domain, control) by route outcome. Rows: two targets, three out-of-domain phrases and five controls.
- Algorithm invariant: a file whose name ends with a test suffix is exempt from the exact-header check wherever it sits, and a non-test sibling is still checked.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 2 hours over both passes |
| Verification | Med | 45 minutes |
| **Total** | | **About 3 hours, an assumption rather than a measurement** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, no data changes
- [x] Feature flag configured: not applicable, routing serves from the compiled manifest
- [x] Monitoring alerts set: not applicable, nothing is deployed

### Rollback Procedure
1. Trigger: a routing control changes route, or a gate the second pass names fails.
2. Revert the commit that carries the second pass.
3. Rerun `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copy the served manifest over its authored twin.
4. Rerun `compiled-route-sync.cjs --check` and the five control replays.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
