---
title: "Implementation Summary: Phase 10: asset-templates-and-folder-readmes"
description: "sk-create-goal now has a checked blank for each goal kind, README coverage for its code folders and no references index."
trigger_phrases:
  - "goal templates summary"
  - "template parity evidence"
  - "create-goal readme evidence"
  - "phase 010 closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/010-asset-templates-and-folder-readmes"
    last_updated_at: "2026-09-26T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped the goal templates and closed phase 010"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md"
      - ".skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md"
      - ".skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-child-template.md"
      - ".skilled/skills/sk-doc/sk-create-goal/scripts/tests/template-parity.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Template relation to goal.md.tmpl: checked per-kind copies (operator, 2026-09-26)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-asset-templates-and-folder-readmes |
| **Status** | Complete |
| **Updated** | 2026-09-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An author now starts a goal from a blank that already fits its kind. `assets/` holds a top-level, a phase-parent and a phase-child template, each carrying the system-spec-kit goal template word for word apart from placeholders written for that kind. A parity test keeps them in step with `goal.md.tmpl`, and the checker now rejects an unfilled copy of any of them. Before this change, an unfilled top-level copy passed all four checks. The two code folders have READMEs, and the references index is gone.

### Phase 10: asset-templates-and-folder-readmes

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-goal/assets/goal-{top-level,phase-parent,phase-child}-template.md` | Created | One blank per goal kind |
| `sk-create-goal/assets/.gitkeep`, `references/README.md` | Deleted | No longer wanted |
| `sk-create-goal/scripts/check-goal.cjs` | Modified | Reads the templates' placeholder wording |
| `sk-create-goal/scripts/tests/template-parity.test.cjs` | Created | Four parity and drift tests |
| `sk-create-goal/scripts/tests/check-goal.test.cjs` | Modified | Three unfilled-template tests |
| `sk-create-goal/scripts/README.md`, `scripts/tests/fixtures/README.md` | Created | Code-folder READMEs |
| `sk-create-goal/{SKILL.md,README.md,references/parent-and-nested-goals.md}`, playbook | Modified | Template workflow, links, 1.1.0.0 |
| `sk-create-goal/changelog/v1.1.0.0.md` | Created | Release notes |
| `.skilled/commands/create/goal.md` and its three assets | Modified | The command copies the template for the goal's kind |
| `sk-doc/ROUTER.md`, `leaf-manifest.json`, both sk-doc route manifests | Modified | Goal-authoring resources and the republished route |
| `.hermes/skills/sk-create-goal/SKILL.md` | Regenerated | Generated copy |
| `../goal.md`, `../spec.md` | Modified | D2 amended, phase 010 bound, template criterion added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator did this phase directly. It rendered `goal.md.tmpl` at level 2 and at the `phase` level, then generated the three template blocks from those renders by script, so the fixed text could not be retyped wrong. The checker change was tested against the live corpus by running the HEAD checker and the new one side by side. The route was republished with the phase 007 sequence: refresh both manifests, sync, run the gates, then finalize.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Checked per-kind copies | The operator's choice. Authors get a real blank, and the parity test keeps system-spec-kit the source |
| Placeholders are brackets with content | `blockers: []` and the `[ ]` checkbox are fixed text and must still be compared |
| The checker reads the templates at load time | Hard-coding the new wording would let the templates and the checker drift apart |
| Keep step IDs in the command YAMLs | Only descriptions changed, so nothing that references a step ID breaks |
| Remove `assets/.gitkeep` | The hub listed it as a routable resource, and the folder now holds real files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | 15 of 15 pass |
| `check-goal.cjs --all`, HEAD checker versus new | Identical reports, 302 goals scanned |
| Code-folder READMEs | 0 issues each; HVR 0 hard blockers |
| Templates | 0 issues as `asset`; the one HVR hard blocker in each is the semicolon in `goal.md.tmpl`'s own sentence, which parity keeps |
| Changelog | Shape checker 0 errors; validator 0 issues; HVR 0 hard blockers |
| `SKILL.md`, README, command router | 0 issues each; HVR 0 hard blockers |
| Package, playbook, parent-skill check | `Result: PASS`; `PASS ... scenarios=8 ... violations=0`; all hard invariants passed |
| Routing | Guard fresh, verify OK, all hubs `compiled-serving`, kill-switch legacy, sk-doc admission `pass`, canary 22 of 22, finalize exit 0 |
| Mirror checks | 170 mirrors, 34 prompts each for Codex, Pi and Hermes, 71 Hermes skill copies |
| Parent goal | `packet_budget=ok` at 3,901; `check-goal.cjs` 4/4 on the parent and on this phase |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict` | `RESULT: PASSED` for all 11 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Each template carries one voice finding it cannot fix.** The semicolon is in `goal.md.tmpl`'s own sentence, and changing it would break parity. The fix belongs in system-spec-kit.
2. **`references/parent-and-nested-goals.md` still lacks an Overview section.** The validator already flagged it before this phase.
3. **The v1.0.0.0 changelog keeps the older layout.** v1.1.0.0 uses the current one.
4. **sk-design admission drift remains.** It predates this packet, and the sk-doc row passes.
<!-- /ANCHOR:limitations -->
