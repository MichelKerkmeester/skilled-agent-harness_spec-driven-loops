---
title: "Implementation Plan: CI Cleanup and Pi Gate-3 Live Proof"
description: "Level 2 implementation plan for phase 050. It proves the Pi Gate-3 contract in a live headless run and a live TUI run and greens six red CI surfaces without weakening a gate. It also root-causes the scorer drop at the cli-jev run keyword and restores the committed baseline."
trigger_phrases:
  - "ci cleanup pi proof"
  - "pi gate-3 live proof"
  - "cli-jev run keyword"
  - "scorer baseline restore"
  - "compiled route re-mint"
  - "hermes mirror drift"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CI Cleanup and Pi Gate-3 Live Proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and TypeScript tests with Node CLI scripts |
| **Framework** | spec-kit, the skill advisor and the Pi CLI |
| **Storage** | None |
| **Testing** | vitest and the node check scripts named in section 5 |

### Overview
Phase 049 closed the Gate-3 residue but left two loose ends. The Pi Gate-3 dialog was proven only through the fake-ExtensionAPI suite and six CI surfaces were red before this phase started. This plan proves the Pi Gate-3 contract in a live headless run and a live TUI run and greens the six CI surfaces without weakening any gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (AC-001 to AC-010 are Met)
- [x] Tests passing (if applicable) (the worktree runs and the merged-tree runs pass)
- [x] Docs updated (spec/plan/tasks) (T013 and T014 are done)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: repair per surface with a live Pi proof flow

### Key Components
- **CI surface repair flow**: one repair per red surface at its producer, then the matching check.
- **Scorer producer fix at cli-jev**: removes the bare word run and restores the committed baseline.
- **Pi Gate-3 live proof flow**: a headless parent-mode probe and a TUI drive with state capture.
- **Post-merge re-mint**: refreshes the cli-jev compiled-route manifest after the merge.

### Data Flow
The repair flow runs one surface at a time and each repair lands at the producer first. Regenerated copies follow their producer and then the matching check from section 5 runs. The Pi proof flow runs the headless probe first and the TUI drive second. The run reads the state file at the end to confirm the binding.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Producer: `cli-jev` SKILL.md Keywords comment | Feeds the explicit_author lane at raw 0.70 | Update. Remove the bare word run | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev` -> OK, all hard invariants passed, exit 0 |
| Producer: `cli-jev` graph-metadata.json `derived.key_topics` | Feeds the derived_generated lane at raw 0.53 | Update. Remove the bare word run | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` -> VALIDATION PASSED (15 discovered, 1 route-excluded), exit 0 |
| Consumer: the scorer projection `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` and the ratchet baseline `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | The projection reads the keyword and the topic into route scores, and the baseline pins the expected counts | Update. Restore the baseline to its committed content, the projection is unchanged | vitest `parity/scorer-eval-baseline-ratchet` -> 7/7 with live 152/195 and 27/32 |
| Consumer: Hermes mirror `.hermes/skills/cli-jev/SKILL.md` | Mirrors the cli-jev skill copy | Update. Regenerate | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` -> PASS: 70 Hermes skill copies in sync, exit 0 |
| Consumer: cli-jev compiled-routing policy hash and manifest | Drives CJ-001 compiled routing | Unchanged until the post-merge re-mint | `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` -> pass, 3 pass 0 drift 0 stale, exit 0 and `node .skilled/bin/compiled-route-guard.cjs` -> cli-jev stale-manifest |

Required inventories:
- Same-class producers: `rg -n 'run' .skilled/skills/cli-jev/SKILL.md .skilled/skills/cli-jev/graph-metadata.json` to list the bare keyword and topic entries at the producer.
- Consumers of changed symbols: `rg -n 'cli-jev' .skilled/skills/system-skill-advisor .hermes/skills/cli-jev .skilled/bin` to list the scorer projection, the Hermes mirror and the compiled-routing manifest.
- Matrix axes: the two producer lanes (SKILL.md Keywords and derived.key_topics) and the two touched corpus rows (row 26 and row 157). The observed rows are clean base 151/26, base with this phase edge 151/26, base without cli-jev 152/27, base without the SKILL.md run keyword 152/27.
- Algorithm invariant: a skill keyword comment and its derived key topics must never carry a bare generic verb such as run because it inflates the explicit_author and derived_generated lanes. The adversarial case is a corpus sentence that repeats the verb, as in the overnight run sentence of row 26.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
T001 through T012 are done. T013 through T017 are open.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | system-deep-loop contract drift and render command contract (2 files, 42 tests) | vitest |
| Unit | system-skill-advisor routing guards and scorer ratchet (4 files, 28 tests) | vitest |
| Unit | spec-kit CLI project incl. recursive-child-manifest (1460 tests) | `npx vitest run --config ../../vitest.config.ts --project cli` |
| Integration | Hermes skill and prompt sync | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` |
| Integration | frontmatter, graph compiler and derived freshness | `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage` and `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` |
| Integration | Markdown links, parent skill invariants and compiled routing | `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev` and `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` and `node .skilled/bin/compiled-route-guard.cjs` |
| Manual | Pi Gate-3 live proof (headless probe and TUI drive) | `pi -p --offline` and a tmux TUI drive |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Newer commits on main | External | Green | Merged in T015. The other session pushed main to 80dc0a118d before the second merge. They are 377a22e1a9 (LLM Gateway MiMo route), f5a89115b1 and 2c8f243607 (sk-design compiled routing from another session, local only) |
| cli-jev compiled-route re-mint after the merge | Internal | Yellow | REQ-005 and AC-008 stay Unmet and CJ-001 serves through legacy routing until the re-mint |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the merged-tree re-verification in T016 fails or the scorer baseline leaves the committed 152/195 and 27/32.
- **Procedure**: revert the phase commit. For cli-jev routing re-run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev` or restore the committed manifest.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T002) ──────┐
                        ├──► Core (T003-T012) ──► Verify (T013-T017)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (T001-T002) | None | Core |
| Core (T003-T012) | Setup | Verify |
| Verify (T013-T017) | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | N/A - insufficient source context | N/A - insufficient source context |
| Core Implementation | N/A - insufficient source context | N/A - insufficient source context |
| Verification | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | | **N/A - insufficient source context** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): N/A - no data storage in scope
- [ ] Feature flag configured: N/A - insufficient source context
- [ ] Monitoring alerts set: N/A - insufficient source context

### Rollback Procedure
1. Revert the phase commit.
2. For cli-jev routing run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev` or restore the committed manifest.
3. Verify the rollback with `node .skilled/bin/compiled-route-guard.cjs` and expect cli-jev fresh.
4. Notify stakeholders: N/A - insufficient source context.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

