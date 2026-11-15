---
title: "Implementation Plan: Phase 12: playbook-docs-and-closeout"
description: "Write the cli-mistral-vibe manual testing playbook and run it, add the mode to the cross-runtime docs and feature catalog, regenerate derived manifests, reconcile completion state and close the parent with recursive strict validation."
trigger_phrases:
  - "playbook docs and closeout plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: playbook-docs-and-closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, JSON manifests, Bash and Node.js generators |
| **Framework** | sk-doc playbook and feature catalog conventions, system-spec-kit validation |
| **Storage** | None |
| **Testing** | Playbook scenarios against `vibe 3.1.2`, `validate.sh --strict --recursive` |

### Overview
Write the playbook following the `cli-deepseek-harness` playbook layout, run each scenario and record its result. Then update every doc that lists runtimes, regenerate the derived manifests and the trigger index, and reconcile completion metadata. Recursive strict validation on the parent is the closing proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"` (phase 010 handoff)
- [ ] `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0` (phase 011 handoff)
- [ ] `MISTRAL_API_KEY` is exported in dispatched shells

### Definition of Done
- [ ] `validate.sh <parent> --strict --recursive --quiet` prints `RESULT: PASSED`
- [ ] Every playbook scenario carries a dated result
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs and closeout pass.

### Key Components
- **Playbook**: the only end-to-end record that the built phases work together on a real dispatch.
- **Runtime lists**: `CROSS-CLI.md`, `AGENTS.md`, the root `README.md`, the feature catalog and the sibling mode tables. Without them a reader cannot find the eighth runtime.

### Data Flow
Each scenario runs a dispatch or a check and writes its result into its scenario file. The doc edits feed the generators, whose output feeds the trigger index, and the recursive validation reads the reconciled metadata.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the phase 010 and 011 handoffs and the key, and reads the `cli-deepseek-harness` playbook layout. Implementation writes and runs the playbook, then edits the catalog and the runtime lists and regenerates the derived files. Verification reconciles completion metadata and runs recursive strict validation on the parent. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The playbook is the test for runtime behavior, with one dated result per scenario. The closing check is `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation --strict --recursive --quiet`, which must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2` at `~/.local/bin/vibe`, `MISTRAL_API_KEY`, the doctor and sk-doc manifest generators and `generate-trigger-index.mjs`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a scenario shows a built phase does not work. Record the failing result, reopen that phase's packet for the fix, and revert only the doc lines that describe the broken behavior.
<!-- /ANCHOR:rollback -->

---
