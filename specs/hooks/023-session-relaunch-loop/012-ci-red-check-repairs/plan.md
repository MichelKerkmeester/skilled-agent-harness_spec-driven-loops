---
title: "Implementation Plan: Phase 12: ci-red-check-repairs"
description: "Three repairs bring the checks that main turned red back to passing locally: 11 wording tightenings in AGENTS.md pull the Blast-Radius Management section end from byte 16626 back to 16323, inside the 16384-byte delivery prefix, the SESSION_RELAUNCH_REPO_ROOT line in hook-flags.env.example becomes the export its heading describes, and the two session-relaunch playbook files get the provenance form and wording the Spec-Kit Check tests accept. No rule is removed or weakened."
trigger_phrases:
  - "ci red check repairs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: ci-red-check-repairs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and .env.example wording edits (AGENTS.md, .skilled/hooks/hook-flags.env.example) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Existing repo checks: check-rule-copies.js, pytest (test_validation_switch.py), run-script-tests.sh and the Spec-Kit Check CLI vitest project |

### Overview
Three CI checks turned red on main, and all three failures were wording only. This plan restores them with 11 tightenings in AGENTS.md that move the section end from byte 16626 back to 16323 without removing or weakening any rule, with one example line in hook-flags.env.example written in export form so the switch-line test no longer reads it as a switch, and with provenance and wording fixes in the two session-relaunch playbook files so the Spec-Kit Check tests pass locally (scratch/after/spec-kit-check-vitest.txt); Spec-Kit Check had been red on main since 47371b495f.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - wording-only repairs to four repository files, verified by the existing CI scripts.

### Key Components
- **AGENTS.md tightenings**: 11 wording edits, no rule removed or weakened; ten restate the same rule in fewer words, and one makes Gate 2 refer to the gitignored runtime state Gate 3 exempts.
- **hook-flags export line**: the SESSION_RELAUNCH_REPO_ROOT line becomes the export its heading describes, which the validation-switch test no longer reads as a switch.
- **Playbook provenance and wording**: the two session-relaunch playbook files carry `Provenance: <path>` bare and the Hermes sentence names .hermes/SYNC.md, which documents both steps at line 41, so the provenance and invariance tests pass.

### Data Flow
CI on main runs the canary over AGENTS.md and the script tests over the hooks examples. The validation-switch test parses every `# NAME=value` line in the example as a switch that must take effect once uncommented, so the export form passes; the tightened wording puts every delivery-prefix anchor back inside byte 16384. The Spec-Kit Check workflow runs the CLI vitest project, whose provenance test requires exactly one Provenance line per playbook file in an accepted form and whose invariance test bans private taxonomy words such as manifest on public surfaces, so the bare provenance form and the .hermes/SYNC.md wording pass. Before and after evidence is kept in scratch/before and scratch/after.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

