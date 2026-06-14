---
title: "Implementation Summary: sk-prompt design-tool usecases"
description: "Assessed sk-prompt against the mcp-magicpath and mcp-open-design design-generation usecases. Verdict was yes: a real gap existed for the grounded anti-default brief, the seed-of-thought variation technique, and the multi-turn discovery-form pre-answer. Closed it with one new reference plus router wiring, and the sk-code handoff was deferred to claude_design_parity.md by pointer."
trigger_phrases:
  - "sk-prompt design tool summary"
  - "design generation prompt outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/006-sk-prompt-design-tool-usecases"
    last_updated_at: "2026-06-14T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assessment plus improvement shipped and validated inside sk-prompt"
    next_safe_action: "Orchestrator registers the 006 child in the 150 parent"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-006-sk-prompt-design-tool-usecases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/006-sk-prompt-design-tool-usecases |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet first asked an honest question: does `sk-prompt` already serve the design-generation usecases of `mcp-magicpath` and `mcp-open-design`, or is there a real gap. The answer was a gap, so the packet closed it with the smallest change that fits the skill.

### The Assessment Verdict
`sk-prompt` is a generic text-prompt engine: seven frameworks, a five-phase DEPTH pass, CLEAR scoring, and three format guides. Its only usecase templates were software development and data analysis. It had no design-generation usecase. Checked against the four needs:

- **(a) Grounded anti-default brief: gap.** COSTAR, CRISPE, and CRAFT can carry a creative brief, and DEPTH has assumption-audit and constraint-reversal, but none of it knows the design-generation shape (subject grounding, design-system reuse-before-generate, an explicit avoid-list, the one aesthetic risk, a fidelity target). A plain COSTAR brief would faithfully produce the median AI look.
- **(b) Seed-of-thought variation: gap.** Perspective inversion and "generate N options" exist, but there was no anti-median forcing mechanism. The String Seed of Thought was absent.
- **(c) Multi-turn discovery-form pre-answer: gap.** Open Design's `start_run` is multi-turn (a GenUI discovery form on fidelity, data, and behaviour, answered via `od ui respond`), and the visible output is prompt-driven. `sk-prompt` had nothing about pre-answering a tool's discovery form.
- **(d) Design-to-sk-code handoff: mostly owned elsewhere.** `claude_design_parity.md` §6 already owns the handoff manifest and the README already names `sk-code`, so this need takes a pointer, not a duplicated schema.

### The Improvement
A single new reference, `references/design_generation_patterns.md`, layers design-specific slots onto the existing frameworks rather than inventing a new one. It covers the grounded brief, the seed-of-thought (with the no-preset guardrail), the discovery-form pre-answer, and the handoff pointer. The smart router gained a `DESIGN_GEN` intent so the reference loads on design-generation signals. No new pipeline, no new `$` mode, no scoring change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/references/design_generation_patterns.md` | Created | The design-generation prompt reference |
| `.opencode/skills/sk-prompt/SKILL.md` | Updated | `DESIGN_GEN` intent and resource map, resource domains, loading levels, §1 use case, §5 and §9 references, version 2.2.0.0 |
| `.opencode/skills/sk-prompt/README.md` | Updated | RELATED DOCUMENTS row for the new reference |
| `.opencode/skills/sk-prompt/changelog/v2.2.0.0.md` | Created | Changelog entry for the addition |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-first across `sk-prompt` and the three usecase skills, with the multi-turn flow grounded in the `mcp-open-design` references rather than assumed. The change is additive and isolated to `sk-prompt`: the new reference mirrors the structure of `patterns_evaluation.md`, and the router wiring mirrors how `patterns_evaluation.md` loads for the `FRAMEWORK` intent. Each edit was gated by `package_skill.py --check`. The README change was gated by the README structure check. The packet docs were gated by `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Improve rather than leave as-is | sk-prompt had no design-generation usecase, and generic briefs yield the median look the design skill resists |
| One reference plus router intent, no new mode | Leanest fit that keeps the format-and-energy mode table stable and avoids a parallel pipeline |
| Build on COSTAR, CRISPE, CRAFT, not a new framework | Design generation is creative plus precision, which the existing frameworks already cover when given the right slots |
| Seed-of-thought indexes grounded directions only | A style-menu version would re-create the templated default, so the guardrail keeps it anti-default |
| Handoff is a pointer, not a schema | `claude_design_parity.md` §6 already owns the handoff manifest, and duplicating it would cause drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` on sk-prompt | PASS, 1 pre-existing framework-registry.json naming warning, no new errors |
| README structure check | PASS, 0 issues |
| `validate.sh --strict` on this packet | PASS, 0 errors |
| Router consistency | DESIGN_GEN present in INTENT_MODEL, RESOURCE_MAP, resource domains, loading levels, §5, §9 |
| `sk-interface-design` unchanged | PASS, no diff in the skill dir |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Static guidance, no automated test.** The reference is prose guidance loaded by the router, and its effect on real generation quality is verified by judgment, not a fixture suite. The skill's manual-testing playbook was not extended in this packet.
2. **Pre-existing asset-naming warning persists.** `framework-registry.json` triggers a snake_case naming warning that predates this packet and is out of scope.
3. **Handoff depends on the parity protocol.** The sk-code handoff relies on `claude_design_parity.md` §6 staying the owner of the manifest, and if that moves the pointer needs updating.
<!-- /ANCHOR:limitations -->
