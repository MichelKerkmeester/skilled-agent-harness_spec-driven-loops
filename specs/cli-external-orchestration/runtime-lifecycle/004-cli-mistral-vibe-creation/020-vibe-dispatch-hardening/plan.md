---
title: "Implementation Plan: Phase 20: vibe-dispatch-hardening"
description: "Add a render-step hard rule for Vibe dispatches, record the lineage posture decision, put the repo-guards tests in CI and document the lineage dist-rebuild switch."
trigger_phrases:
  - "vibe dispatch hardening plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: vibe-dispatch-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (rule engine), JSON (hard rules), GitHub Actions YAML |
| **Framework** | The dispatch rule engine and the deep-loop fan-out runner |
| **Storage** | None |
| **Testing** | `node --test` rule and audit suites; the deep-loop Vibe unit and stress cases if the posture tightens |

### Overview
One new rule in the existing Vibe rule family closes the unguarded hand-composed dispatch. The lineage posture becomes a recorded decision before any flag changes. The CI hook node:test job widens to the `.vibe/` tree, and two doc lines name the dist-rebuild switch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 013's `isolated-vibe-home` fix is in, and `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0`
- [ ] The operator has the posture options from T004

### Definition of Done
- [ ] `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0` and `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` reports every test passed
- [ ] The parent's `decision-record.md` holds the approved posture
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-text dispatch rule.

### Key Components
- **`rendered-home-hooks` check** (`dispatch-rule-checks.mjs`): without it, nothing ties a dispatch's `VIBE_HOME` to a rendered `hooks.toml`.
- **Posture decision** (the parent's `decision-record.md`): without it, the lineage's auto-approve and spec-gate settings are an unrecorded default.

### Data Flow
A Bash call carrying `vibe -p` reaches the dispatch preflight, which resolves each Vibe dispatch segment and runs every Vibe rule. The new check looks in the same command for `render-home-hooks.cjs` chained before the run with a home argument textually equal to the dispatch's `VIBE_HOME` value, literal or variable, and refuses the call when it is absent.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the rule and audit suites as the baseline, records whether the pre-commit hook runs hook tests, and prepares the posture options with evidence. Implementation adds the rule, its row and tests, records the operator's posture decision and applies it, widens the CI job and documents the switch. Verification reruns the suites, the CI collection command and, if the posture tightened, the Vibe lineage cases. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` gains refuse cases (literal home with no render, variable home with the render removed, render naming a different home) and an accept case (the documented shape with a variable home). The three sync-generator suites run locally and are listed in `advisory-checks.yml`. The CI collection command is run locally to show it lists the repo-guards files. A tightened posture reruns the deep-loop Vibe unit and stress cases.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js, phase 013's rule-file fix and the operator's posture decision. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the new rule refuses the documented dispatch shape in real use. Remove the `rendered-home-hooks` row from `hard-rules.json`, which turns the check off, then revert the phase's commit.
<!-- /ANCHOR:rollback -->

---
