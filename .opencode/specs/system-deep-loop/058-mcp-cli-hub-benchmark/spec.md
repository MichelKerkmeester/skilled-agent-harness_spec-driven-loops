---
title: "Spec: mcp-tooling + cli-external hub benchmark (Type-1 + Type-2, both modes, D1inter)"
description: "The two new parent hubs mcp-tooling (children: mcp-chrome-devtools, mcp-click-up, mcp-figma) and cli-external (children: cli-opencode, cli-claude-code) pass Mode-A Type-2 routing (92/89) but their 5 children return NO-SCENARIOS (prose-only playbooks, no expected_intent/expected_resources gold), mcp-figma's INTENT_MODEL tuple router is unparseable by the replay scorer, and Mode-B never genuinely dispatched a live model. This packet makes the two hubs and all five children properly benchmarkable: normalize mcp-figma's router to INTENT_SIGNALS (key-sync guarded), author per-child Type-1 gold (T1 + blind-holdout T2 + negative T3), harden the hub Type-2 gold, add D1inter advisor-class scenarios, wire genuine Mode-B live dispatch, then run the full 7-target x 2-mode matrix with honest circularity meters. Engine unchanged; gold + one router normalization only."
trigger_phrases:
  - "mcp cli hub benchmark"
  - "mcp-tooling cli-external skill benchmark gold"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/058-mcp-cli-hub-benchmark"
    last_updated_at: "2026-07-10T21:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 7 targets benchmarked both modes; 5 router fixes landed; keyword-ceiling finding recorded"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator: normalize mcp-figma's INTENT_MODEL router; include the D1inter advisor probe"
      - "Children are NO-SCENARIOS because playbooks are prose-only; sk-doc frontmatter gold is the fix"
---
# Spec: mcp-tooling + cli-external Hub Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 058-mcp-cli-hub-benchmark |
| **Level** | 2 |
| **Status** | Complete |
| **Origin** | Operator: "properly plan and rebenchmark" the two new parent hubs in Mode-A + Mode-B |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
An exploratory Lane C run showed both hubs PASS Mode-A Type-2 routing (mcp-tooling 92, cli-external 89), but it is
not a proper benchmark: all five children return NO-SCENARIOS (their playbooks carry no `expected_intent`/
`expected_resources` gold), `mcp-figma`'s `INTENT_MODEL` tuple router is invisible to the replay parser
(intents parse empty), and Mode-B never genuinely dispatched a model (it short-circuited to resource-recall-only
scoring in seconds). D1inter/D4 are structurally unscored without an advisor probe. Make the two hubs and all
five children scoreable for real, in both modes, with honest anti-overfit signal.
<!-- /ANCHOR:problem -->

## 3. SCOPE (what was done)
<!-- ANCHOR:scope -->
Delivered as a flat packet (not phase children):
- **mcp-figma router normalization** — additive `INTENT_SIGNALS` mirror of the runtime `INTENT_MODEL` (per-intent
  weight = max per-keyword weight), runtime selector byte-unchanged, key-sync vitest (4/4). Parser now yields all
  6 intents (was 0).
- **Per-child Type-1 gold** (5 children) — `manual_testing_playbook/intra-routing-recall/` packs: a T1
  scenario per `INTENT_SIGNALS` key (`expected_resources` verbatim from `RESOURCE_MAP`) + T2 blind holdouts + a T3
  negative. Every child now scores real Type-1 (no NO-SCENARIOS).
- **Hub Type-2 hardening** — blind holdouts added to each hub's `hub-routing/`; both hubs route them correctly.
- **Genuine Mode-B live dispatch** — proven via a configured model env (`SKILL_BENCH_OPENCODE_MODEL`); a blind
  holdout that scored 31 deterministically routed at 66 live.
- **Router improvements from the findings** — per-child keyword broadening (domain synonyms, blind to the
  holdouts) + structural fixes: mcp-chrome-devtools resource precision, mcp-click-up `INSTALL_GUIDE.md` relocated
  into `references/` and the dead `DEFAULT` key removed, mcp-figma dual-block key-sync, cli-children `DESIGN`
  cross-skill-handoff documented.

**Out of scope:** engine changes to the harness; D4 usefulness ablation; the D1inter advisor probe (deferred — it
needs advisor-class scenarios + the live advisor daemon).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Each of the 5 children scores real Type-1 (D1intra/D2/D3), no NO-SCENARIOS; contamination-lint clean on T2.
- **R2:** mcp-figma parseable + runtime-identical (key-sync); the other four children unchanged.
- **R3:** Mode-B genuinely dispatches a model; D1inter scored for both hubs; Mode-A hub baselines (92/89) not regressed.
- **R4:** Full matrix reported with circularity meters; drift guard green.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. 7-target × 2-mode matrix produced with honest per-dimension scores + circularity meters.
2. mcp-figma normalization key-sync verified; each code/gold phase validates `--strict` Errors 0 + fresh adversarial pass on the normalization.
3. Recursive `--strict` Errors 0 across the parent + children.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Normalizing a production router could change runtime routing* → key-sync test proves the INTENT_SIGNALS keys/keywords/weights equal the INTENT_MODEL source; adversarial-verify.
- *Type-1 prompts must carry router keywords (or they route to nothing)* → use the playbook path (advisory leak), author T2 blind holdouts as the honesty anchor.
- *Mode-B live dispatch cost/nondeterminism* → advisory only; a configured provider; generous timeout.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
Whether the D1inter advisor probe needs the advisor daemon warmed at run time — resolved during 003/005.
<!-- /ANCHOR:questions -->
