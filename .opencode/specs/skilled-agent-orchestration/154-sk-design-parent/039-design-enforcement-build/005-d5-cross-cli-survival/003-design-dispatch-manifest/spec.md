---
title: "D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through"
description: "Define the DESIGN_DISPATCH_MANIFEST in sk-design/shared/context_loading_contract.md and pass it like the Gate-3 spec folder: present + pre-approved, or ASK."
trigger_phrases:
  - "d5-r3 design dispatch manifest"
  - "dispatch manifest design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through

## 1. OBJECTIVE
Define a `DESIGN_DISPATCH_MANIFEST v1` (surface, taskType, skDesignLoaded, registry-valid workflowModes, register, dials, loadedFiles, proofDemandBack) in `sk-design/shared/context_loading_contract.md`, and pass it across dispatch with the same present-or-ASK discipline the cli-* already use for the Gate-3 spec folder.

## 2. WHY
A dispatched child cannot know which register, mode bundle, or files the parent resolved. The Gate-3 spec-folder pass-through already proves this handoff pattern survives dispatch; design needs the same structured carry or the child reconstructs context by guesswork.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/context_loading_contract.md` + the present-or-ASK pass-through in the 3 cli-* SKILLs
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Specify the manifest fields + validity rules (workflowModes must be registry-valid; register must be resolved, not `unknown`).
- Add a present-or-ASK pass-through to each cli-* modeled on the Gate-3 spec-folder rule: present + pre-approved, else ASK before launch.
- Bind the manifest to the inline payload so the child receives it without resolving cross-skill paths.

## 5. ACCEPTANCE
- A static token lint finds the `DESIGN_DISPATCH_MANIFEST` block with all required fields in dispatch payloads; a dispatch missing the manifest triggers an ASK rather than a silent launch.

## 6. EVIDENCE
- `.opencode/skills/cli-opencode/SKILL.md:319` — the existing Gate-3 spec-folder present-or-ASK pass-through (the model to clone for the manifest).
- Source: `research/research.md` §8 (D5-R3); manifest-field evidence `research/iterations/iteration-047.md:31`.

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
