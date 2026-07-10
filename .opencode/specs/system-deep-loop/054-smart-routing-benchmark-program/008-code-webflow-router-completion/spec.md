---
title: "Spec: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords"
description: "Land code-webflow's inline INTENT_SIGNALS/RESOURCE_MAP router on skilled/v4 (the parent already declares the webflow surface; the child block is absent, so the drift guard fails on the webflow side) and correct its LANGUAGE_STANDARDS keywords from ts/py/shell to css/html/js, co-rewriting the WF-013 gold prompt."
trigger_phrases:
  - "code-webflow router completion"
  - "webflow language keyword fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/008-code-webflow-router-completion"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Land webflow inline router + css/html/js keywords + WF-013 prompt; run 3 guards"
    blockers: []
    completion_pct: 5
    open_questions:
      - "Exact keyword tokens + WF-013 prompt wording — low-stakes operator confirm"
    answered_questions: []
---
# Spec: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 008-code-webflow-router-completion |
| **Level** | 1 |
| **Status** | Planned |
| **Sequencing** | After 005 (already landed the parent webflow projection + opencode split) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
On `origin/skilled/v4.0.0.0` the parent `smart_routing.md` already projects the full webflow surface
(~85 `code-webflow/…` paths across 13 intents), but `code-webflow/SKILL.md` has **no inline router
block** (it exists natively on 028 + in the working tree). So `sk-code-router-sync.vitest.ts` fails on
the webflow side (`childResourceMap('code-webflow')` empty; ~85 parent paths uncovered). Separately,
code-webflow's `LANGUAGE_STANDARDS` keywords are `ts/py/shell/…` over css/html/js FILES — a copy-paste
artifact in three places (child `SKILL.md:79`, parent machine `smart_routing.md:334`, parent prose
`:65`). Per the surface's design, webflow does NOT sub-slice by language (a frontend task spans
css+html+js) — so the files stay lumped; only the KEYWORDS are wrong.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Land the code-webflow inline router (content == 028/working-tree) on the target branch.
- Fix `LANGUAGE_STANDARDS` keywords → css/html/js in the three places.
- Co-rewrite the WF-013 scenario prompt to css/html/js (its `expected_resources` are already correct;
  the prompt is the copy-paste artifact that would otherwise regress the standalone benchmark).

**Out of scope:** the broader operator-sweep working-tree changes; any opencode files; the 028→v4
migration itself (path-scope to webflow only).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** `sk-code-router-sync` green — child parses non-empty; parent == union(children) + tier.
- **R2:** `surface-slice-sync` green — no webflow↔opencode leak (the fix removes a cross-surface
  keyword overlap, so it is net-safer).
- **R3:** `parent-hub-vocab-sync` green.
- **R4:** Standalone code-webflow router-replay on WF-013 routes the 9 css/html/js gold paths.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. All three drift guards green.
2. WF-013 routes exactly its gold under the new keywords + prompt.
3. No bare `js` token (substring false-match on `commonjs`/`jsonc`).
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Child RESOURCE_MAP must exactly equal the parent webflow projection (13 intents)* → verified by the
  vitest, not by eye.
- *Fixing keywords without co-rewriting WF-013 regresses the standalone benchmark* → co-fix mandatory.
- Depends on 005; low blast radius, single surface.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
**DECISION NEEDED (low-stakes) —** (1) commit scope: land router + keyword fix as one webflow
commit (recommended — the only way the guard goes green); (2) tokens: `["css",".css","html",".html",
"javascript",".js"]` (recommended, extension-inclusive, no bare `js`); (3) WF-013 wording, e.g.
"Review the CSS, HTML, and JavaScript for the Webflow site before publishing."
<!-- /ANCHOR:questions -->
