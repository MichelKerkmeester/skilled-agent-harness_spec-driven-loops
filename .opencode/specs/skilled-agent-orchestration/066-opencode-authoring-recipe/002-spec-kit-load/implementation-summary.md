---
title: "Implementation Summary: 078/002 /speckit:complete Authoring-Time sk-code Load"
description: "Phase 2 of 078: cross-skill authoring-time load contract documented in both /speckit:complete YAMLs (auto + confirm) and both SKILL.md surfaces (system-spec-kit pull-side + sk-code push-side). sk-code bumps 3.2.0.0 → 3.2.1.0 (patch). Closes 4 P1 findings from 077."
trigger_phrases: ["078/002 summary", "sk-code v3.2.1.0", "cross-skill authoring-time"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/066-opencode-authoring-recipe/002-spec-kit-load"
    last_updated_at: "2026-05-05T18:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 complete; ready to commit"
    next_safe_action: "Commit + push + start Phase 3"
    blockers: []
    key_files:
      - .opencode/commands/speckit/assets/speckit_complete_auto.yaml
      - .opencode/commands/speckit/assets/speckit_complete_confirm.yaml
      - .opencode/skills/system-spec-kit/SKILL.md
      - .opencode/skills/sk-code/SKILL.md
      - .opencode/skills/sk-code/changelog/v3.2.1.0.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-002-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 078-opencode-authoring-recipe/002-spec-kit-load |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Parent** | 078-opencode-authoring-recipe |
| **Predecessor** | 078/001 sk-code v3.2.0.0 (foundation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/speckit:complete` now loads sk-code at TWO distinct points instead of one. The previous behavior (sk-code loaded only at Step 11 review-time as part of `Pre-Commit code review`) is preserved verbatim. Newly added: when any task in `tasks.md` targets a path under `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, or `.opencode/specs/`, the orchestrator now loads the matching sk-code authoring checklist (`assets/opencode/checklists/{surface}_authoring.md`) plus the `spec_folder_write` recipe (when target is under `.opencode/specs/`) BEFORE the first write. The contract is documented from both sides: pull-side in system-spec-kit/SKILL.md §17 (the consumer documenting WHEN to consult sk-code), push-side in sk-code/SKILL.md (the producer declaring what it surfaces). Implementation dispatched via cli-codex; both YAMLs parse cleanly; validate.sh --strict + alignment-verifier PASS.

### Authoring-time vs review-time split

The `/speckit:complete` workflow had a documentation gap that mapped 1:1 to a behavior gap: sk-code's full surface was only consulted post-write, after errors that the authoring checklists would have prevented had already been committed. Phase 2 closes both gaps simultaneously by adding a `cross_skill_authoring_load` block (parallel to the existing `agent_dispatch.review` block) that names available_at_step 10, target detection condition, resource list, precedence, and not_for negative cases. The first activity in `step_10_development.activities` is now an explicit instruction to load these resources before any other Step 10 work.

### Cross-Skill Consumption table (sk-code/SKILL.md)

A new sub-section under §1 WHEN TO USE declares from sk-code's side which authoring checklist + recipe surface for each `.opencode/` target type. The table makes the contract symmetric and discoverable from either skill.

### 077 findings closed (4 P1 in this phase)

F-009-001 (review-time vs authoring-time load timing), F-009-002 (no first-class SPEC_FOLDER load path — now documented in cross_skill_authoring_load.condition), F-008-004 (spec-folder writes named in verification but not loaded — now loaded at Step 10 authoring-time), F-006-004 (system-spec-kit integration named at path-safety level only — now extended to loading-recipe level).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modified | step_10 activity prepend; cross_skill_authoring_load block added |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` | Modified | Mirror of auto edits |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Authoring-time vs review-time paragraph appended below rule 17 |
| `.opencode/skills/sk-code/SKILL.md` | Modified | Cross-Skill Consumption block added; version 3.2.0.0 → 3.2.1.0 |
| `.opencode/skills/sk-code/description.json` | Modified | Version 3.2.0.0 → 3.2.1.0 |
| `.opencode/skills/sk-code/changelog/v3.2.1.0.md` | Created | Compact-format patch-release changelog |
| `078/002/{spec,plan,tasks,implementation-summary}.md` | Created | Phase 2 child docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex (gpt-5.5/high/fast, sandbox=workspace-write) handled all 5 file modifications + 1 new changelog via a single stdin-piped exec call. The prompt at `/tmp/078-002-codex-prompt.md` enumerated 7 work items with exact insertion points and symmetric edits across auto/confirm YAMLs. Codex completed in ~30 seconds wall-clock (exit 0) and self-reported `yaml.safe_load` PASS for both YAMLs, validate.sh --strict PASS on 078/002, and alignment-verifier PASS on sk-code. Claude orchestrator re-verified all three checks in fresh shell. REQ-004 (system-spec-kit/SKILL.md authoring-time paragraph) initially appeared to fail a case-sensitive grep but the text was present (capital "Authoring-time"); case-insensitive recheck PASS.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Activity-prepend over new step number | Less invasive; preserves existing step numbering. The activity is the directive; the cross_skill_authoring_load block is the contract |
| Patch bump (3.2.0.0 → 3.2.1.0) not minor (3.3.0.0) | Doc-only declaration of an existing-but-undocumented contract; no new public surfaces or functions |
| Symmetric auto + confirm YAML edits | Both modes need the same authoring-time load instruction; asymmetric drift would cause orchestrators to behave differently in confirm-mode walkthroughs |
| Pull-side and push-side documentation | Either skill alone is incomplete; system-spec-kit declares WHEN to consult sk-code, sk-code declares WHAT it surfaces. Both required for cross-skill discoverability |
| Preserve existing review-time block verbatim | Review-time behavior is unchanged; the new contract is purely additive at authoring-time |
| Stay on main, no feature branch | Per memory rule (`feedback_stay_on_main_no_feature_branches`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| speckit_complete_auto.yaml parseable | PASS (yaml.safe_load exit 0) |
| speckit_complete_confirm.yaml parseable | PASS |
| step_10 activity references sk-code authoring (auto) | PASS (grep returns 2) |
| step_10 activity references sk-code authoring (confirm) | PASS (grep returns 2) |
| cross_skill_authoring_load block (both YAMLs) | PASS (1 hit each) |
| system-spec-kit/SKILL.md authoring-time paragraph | PASS (case-insensitive grep returns 1) |
| sk-code/SKILL.md Cross-Skill Consumption block | PASS |
| sk-code/SKILL.md version 3.2.1.0 | PASS |
| description.json version 3.2.1.0 | PASS |
| changelog/v3.2.1.0.md exists | PASS |
| validate.sh --strict on 078/002 | PASS (errors:0 warnings:0) |
| alignment-verifier on sk-code | PASS (24 files, 0 findings) |
| Existing review-time block preserved | PASS (diff shows no changes to lines 311-318 review block) |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Doc-as-instruction model.** The cross_skill_authoring_load block and step_10 activity are YAML directives the orchestrator reads and follows. There's no runtime mechanism that enforces the load (no Skill tool auto-invocation, no hard preflight gate). This is consistent with how the existing review block works — both are documentation-as-contract that orchestrators consult.

2. **Target detection is path-prefix-based.** The condition `target under .opencode/{skill,agent,command,specs}` is a heuristic; mixed targets (one task touches `.opencode/`, another touches Webflow `src/`) load both authoring-time + review-time sk-code, which is the correct behavior but produces some redundancy.

3. **Phase 2 alone closes 4 of 22 P1 findings.** Combined with Phase 1's 9 closures, 13 of 22 P1 findings are addressed. Phases 3 (CocoIndex canonical-priority — 5 closures) and 4 (validator/MCP cleanup — 4+ closures) remain.

4. **Mirror parity.** The cross_skill_authoring_load block exists only in the OpenCode-native YAML. The .claude/, .codex/, .gemini/ runtime mirrors aren't direct duplicates of these YAML assets — they reference the same YAML at runtime via path resolution. No mirror update needed for this phase.
<!-- /ANCHOR:limitations -->
