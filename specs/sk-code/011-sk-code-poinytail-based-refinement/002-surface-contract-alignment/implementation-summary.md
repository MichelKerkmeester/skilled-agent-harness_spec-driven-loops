---
title: "Implementation Summary"
description: "Every live sk-code document now states one surface precedence, OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN, names Obsidian wherever the other surfaces appear, and compiled routing serves sk-code again after a re-mint."
trigger_phrases:
  - "surface contract alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment"
    last_updated_at: "2026-10-09T19:20:50Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase built by cli-codex and independently verified"
    next_safe_action: "Start phase 003 doctrine pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-surface-contract-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-surface-contract-alignment |
| **Completed** | 2026-10-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two files that load on every sk-code route used to disagree about surface precedence. They now agree, and Obsidian sits next to Webflow and OpenCode everywhere the hub lists surfaces.

### Phase 2: surface-contract-alignment

You get one precedence order across the hub, the shared standards, the router and the playbook, with Motion.dev described as a resource intent loaded after the surface rather than as a surface. The stack-folder scenario now matches what its validator actually prints. The routing canary has a tenth case, a review of an Obsidian plugin, and the advisor probe battery has two Obsidian probes. Because the hub `SKILL.md` feeds the routing policy hash, the sk-code manifest was re-minted so compiled routing keeps serving sk-code instead of falling back to the legacy path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modified | Precedence line |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Contiguous surface table, Motion.dev note |
| `.skilled/skills/sk-code/shared/README.md` | Modified | Surface list |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Precedence, Obsidian in mode keys, clarifying question, layout, surface packets |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Obsidian in detection, overview and fallback lines |
| `.skilled/skills/sk-code/manual-testing-playbook/` (six scenario files and the index) | Modified | Precedence wording, DR-004, stack-folder output, two Obsidian probes |
| `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md` | Created | SD-004 Obsidian detection scenario |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` and its archived copy | Modified | Workflow-plus-Obsidian surface bundle case |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived copy | Regenerated | Re-mint after the `SKILL.md` edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex ran the task list with GPT-6 Luna at max effort under the `markdown` persona, in the numbered worktree `worktrees/092-sk-code-ponytail-refinement`. A first dispatch under the `code` persona refused, because that persona does not edit skill or packet docs. The second stopped at T028 on a conflict between the brief's em-dash rule and a byte-exact copy of validator output; the rule was clarified and the run resumed from T028. The orchestrator then reran every goal criterion itself, including an independent advisor run on the two new probes, before marking anything done.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the `markdown` persona for this phase | Almost every edit is a skill or playbook document, which the `code` persona refuses |
| Keep packet docs with the orchestrator | Both personas assign packet docs to the main agent, and the orchestrator reruns every criterion anyway |
| Copy validator output byte-exact, em dash included | The scenario must match what the validator prints; the em-dash rule covers new prose, not quoted output |
| Exclude changelog entries from the precedence search | Changelogs record history and are not live guidance |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Precedence search (criterion 1) | PASS: 0 lines with another order, 9 with the right one, no stale surface list |
| Routing canary and fixture copies (criterion 2) | PASS: cases 10 failures 0, new case routes surfaceBundle sk-code-review,sk-code-obsidian; cmp exit 0 |
| Re-mint (criterion 3) | PASS: compiled-route has no servingAuthority, guard shows sk-code fresh, status compiled-serving with hash 01f648d7, admission passes, manifest copies identical |
| Advisor probes (criterion 4) | PASS: worse_or_failed=0; P16 0.9283 and P17 0.9412 confirmed by an independent advisor run; two-stage probe diff empty |
| Obsidian coverage (criterion 5) | PASS: counts 8, 1, 2; SD-004 present; playbook package PASS, scenarios 33, violations 0 |
| Stack-folder scenario (criterion 6) | PASS: validator exit 0, MATCH, no stale text |
| Hub check and strict validation (criterion 7) | PASS: parent-skill-check 0 warnings; validate.sh --strict on this folder RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisor battery still fails its own pass rule.** It failed before this phase (11 of 15 positives, 2 of 5 negatives won by sk-code) and this phase changes no advisor input. It is a separate advisor-accuracy issue.
2. **The re-mint is tied to the current `SKILL.md` bytes.** Any later edit to the hub `SKILL.md`, `hub-router.json` or `mode-registry.json` needs another re-mint, or compiled routing falls back to legacy.
<!-- /ANCHOR:limitations -->

---
