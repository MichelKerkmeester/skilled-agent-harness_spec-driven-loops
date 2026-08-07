---
title: "Spec: Research + Refactor the sk-design /interface:* Design Commands"
description: "Evidence-based deep research (web-enabled, mixed GPT-5.6-SOL-fast + Opus-4.8-max executors) into how leading tools structure design/UI commands, then refactor or re-author the five /interface:* commands to be genuinely useful, tested, and benchmarked — hard-aligned with the sk-doc create-command standard."
trigger_phrases:
  - "interface command research refactor"
  - "design command deep research sol-fast opus"
  - "sk-design interface commands useful tested benchmarked"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/004-interface-command-research-refactor"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Scaffolded the research packet; launching the mixed-executor deep-research loop."
    next_safe_action: "Run 10 SOL-fast + 2-3 Opus-max research iterations, then synthesize + refactor."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/creation-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-009-interface-command-research-session"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Research + Refactor the sk-design /interface:* Design Commands

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-interface-command-research-refactor |
| **Level** | 1 |
| **Status** | Complete — research + thin-router refactor + usefulness improvements applied + verified |
| **Verification** | research.md evidence-cited; refactored commands tested + benchmarked + verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The five `/interface:*` commands (`design`, `foundations`, `motion`, `audit`, `design-reference`) had their
bodies rewritten (packet `012/008`) but are unverified, unbenchmarked, and may not be genuinely useful.
This packet runs evidence-based deep research into how leading tools structure design/UI commands, then
refactors or re-authors the commands so they are useful, tested, and benchmarked — hard-aligned with the
`sk-doc` create-command standard. `/design:*` aliases stay retired; design taste stays in the sk-design modes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the 5 command bodies + `shared/creation-contract.md` + `command-metadata.json` + the
presentation `.txt` files + the `*-{auto,confirm}.yaml` + `mode-registry.json`; web research into
design-command patterns; refactor/re-author aligned with `sk-doc` create-command; test + benchmark + verify.

**Out of scope:** the sk-design mode internals (taste authority stays there); resurrecting `/design:*`
aliases; the styles-library READMEs (parallel sibling workstream).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — Deep research: 10 forced iterations (cli-opencode `openai/gpt-5.6-sol-fast`, high) + 2-3 native Opus-4.8-max iterations, web-informed, producing an evidence-cited `research.md` with ranked findings + concrete refactor recommendations.
- **REQ-002** — Refactor/re-author every command hard-aligned with the `sk-doc` create-command skill/mode; one `@`-include of the shared contract per body; no command-owned taste.
- **REQ-003** — Commands ship tested (contract suite green), benchmarked, and verified against real invocation.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research.md` with ranked, source-cited findings on what makes a design command useful/invokable/verifiable.
- Refactored commands conform to the create-command contract; the interface-command test suite is green.
- A benchmark result demonstrates the commands behave as designed on real invocation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Web research thin (agent WebFetch-only) | The Opus/cli-claude-code lineage adds WebSearch; fetch known design-tool docs |
| Refactor drifts from create-command standard | Route authoring through `sk-doc` create-command; conform to its templates |
| Altering shipped command contract untested | Keep the contract test suite green; benchmark before shipping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the five commands be refactored in place, consolidated, or re-authored from the create-command template? (Research decides.)
<!-- /ANCHOR:questions -->
