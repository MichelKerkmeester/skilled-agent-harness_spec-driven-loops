---
title: "Spec: Skill-Router Improvements (act on the benchmark findings)"
description: "The 058 benchmark measured a real gap: parent hubs route natural language correctly (blind holdouts D2 100) but the five children's in-skill routers are keyword-brittle (T2 blind holdouts ~31, D1intra/D2 0) and one live-mode holdout jumped 31->66, proving the content is routable and the keyword lists are just too narrow. This phase applies the measured fixes per child: broaden each INTENT_SIGNALS keyword bag with genuine domain synonyms (BLIND to the T2 holdout prompts — no overfitting), tighten mcp-chrome-devtools' over-sharing RESOURCE_MAP (D3 71), relocate mcp-click-up's root-level INSTALL_GUIDE.md into references/ (dropped by the loader path regex) and resolve its DEFAULT asymmetry, keep mcp-figma's INTENT_MODEL<->INTENT_SIGNALS mirror in key-sync while broadening, and document the intentional DESIGN cross-skill handoff in the two cli children. Each fix re-benchmarked to prove an honest T2 lift with no D5/D2/D3 regression and unchanged runtime routing on the T1 set."
trigger_phrases:
  - "skill router improvements"
  - "broaden intent keywords benchmark findings"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/058-mcp-cli-hub-benchmark/007-skill-router-improvements"
    last_updated_at: "2026-07-10T22:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Findings triaged; per-child fix scope frozen; Sonnet agents to implement"
    next_safe_action: "Dispatch per-child Sonnet agents, re-benchmark, adversarial-verify"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Keyword broadening must be blind to the T2 holdout prompts or it is overfitting"
      - "mcp-figma keeps INTENT_MODEL runtime + the INTENT_SIGNALS mirror (key-sync); do NOT migrate runtime"
---
# Spec: Skill-Router Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 007-skill-router-improvements |
| **Level** | 2 |
| **Status** | In progress |
| **Origin** | 058 benchmark findings (per-child keyword brittleness + resource/structure fixes) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The benchmark proved the children's in-skill routers only fire on exact keywords: every child's blind holdout
scored ~31 deterministically, and a live model routed one to 66 — the content is routable, the keyword lists are
too narrow. Fix the routers so real user phrasing routes correctly, tighten measured over-routing, and clean up
two structural issues the benchmark surfaced — without changing runtime routing on the keyword-rich cases or
overfitting to the test holdouts.
<!-- /ANCHOR:problem -->

## 3. SCOPE (per-child, one Sonnet agent each)
<!-- ANCHOR:scope -->
- **mcp-chrome-devtools:** broaden `INTENT_SIGNALS` keywords (domain synonyms, blind to holdouts); tighten
  `RESOURCE_MAP` so `CLI`/`MCP`/`AUTOMATION` stop over-sharing `cdp_patterns.md`+`session_management.md` (D3 71).
- **mcp-click-up:** broaden keywords; relocate root `INSTALL_GUIDE.md` -> `references/install_guide.md` (update
  the SKILL.md `RESOURCE_MAP` + the INSTALL gold's `expected_resources`); resolve the `DEFAULT` resource key
  that has no matching intent.
- **mcp-figma:** broaden keywords in BOTH `INTENT_MODEL` (runtime) and the mirror `INTENT_SIGNALS`, keeping the
  key-sync test green; do NOT migrate the runtime selector.
- **cli-opencode / cli-claude-code:** broaden keywords; document the intentional `DESIGN` intent-only
  cross-skill handoff (no `RESOURCE_MAP` entry) so it reads as deliberate, not a dead end.

**Discipline:** keyword additions come from domain knowledge, authored BLIND to the `10--intra-routing-recall`
T2 holdout prompt text. Re-benchmark each child; when a resource path moves, update its gold in lockstep.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** T2 blind-holdout D1intra/D2 improve honestly (not by copying holdout words); T1 scenarios still route
  correctly; D3 (over-routing) does not regress; D5 gate stays pass; each child stays PASS/CONDITIONAL.
- **R2:** Any moved resource path is reflected in both the SKILL.md and the gold; mcp-figma key-sync stays green;
  runtime routing on keyword-rich prompts is unchanged.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Each child re-benchmarked before/after with the honest T2 lift reported and no regression.
2. An adversarial pass confirms the broadened keywords are genuine domain synonyms, not holdout-prompt words.
3. validate.sh --strict Errors 0 on this phase; recursive --strict Errors 0 across the 058 parent.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Broadening keywords can cause over-routing or intent collision* → re-benchmark catches it (T1 mis-route, D3 drop); each agent verifies.
- *Overfitting to the test holdouts* → blind-authoring discipline + adversarial check that added keywords are not holdout words.
- *Moving a resource path breaks the router or gold* → update SKILL.md + gold together; confirm paths exist.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
Whether to fully migrate mcp-figma runtime to INTENT_SIGNALS — deferred; the mirror + key-sync is sufficient and lower-risk.
<!-- /ANCHOR:questions -->
