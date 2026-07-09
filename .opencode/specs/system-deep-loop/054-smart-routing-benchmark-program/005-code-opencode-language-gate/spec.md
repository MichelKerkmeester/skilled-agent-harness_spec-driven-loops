---
title: "Spec: code-opencode Language-Slice Intent Gate"
description: "Split code-opencode's single LANGUAGE_STANDARDS intent into per-language intents (JAVASCRIPT/TYPESCRIPT/PYTHON/SHELL) so a single-language task stops routing all four languages' guides; mirror the split into the sk-code parent projection under the existing drift guards."
trigger_phrases:
  - "code-opencode language gate"
  - "language slice intent split"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/005-code-opencode-language-gate"
    last_updated_at: "2026-07-09T10:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Split shipped + verified: 3 drift guards 20/20, child 84->87, hub 85->85"
    next_safe_action: "Commit code + packet via scratch-index onto origin/skilled/v4"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Split code-opencode only; code-webflow spans css+html+js by design"
---
# Spec: code-opencode Language-Slice Intent Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 005-code-opencode-language-gate |
| **Level** | 2 |
| **Parent** | 054-smart-routing-benchmark-program |
| **Origin** | Deferred Phase-3 intent-gate of `../004-cross-skill-routing-sweep` |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
code-opencode's router lumps all four languages under one `LANGUAGE_STANDARDS` intent, so a
single-language task loads every language's guides (a TypeScript task routes 18 resources against a
designed 3 — 12 of the waste is the cross-language load). This contradicts the surface's own
documented design ("slices evidence by the detected language so a TypeScript task never pulls the
Python/shell/config guides") and the parent `smart_routing.md` prose, which already names per-language
maps. Gold-aligning would be dishonest; the honest fix is a per-language intent split. Full diagnosis:
`../004-cross-skill-routing-sweep/assets/code-opencode-language-split-design.md`.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Split code-opencode `LANGUAGE_STANDARDS` → `JAVASCRIPT` / `TYPESCRIPT` / `PYTHON` / `SHELL`
  (INTENT_SIGNALS + RESOURCE_MAP), each mapping only its own `references/<lang>/` trio.
- Mirror into the sk-code parent `shared/references/smart_routing.md` machine block: move the 12
  code-opencode language files out of `LANGUAGE_STANDARDS` into the four new intents; keep
  code-webflow's css/html/js in `LANGUAGE_STANDARDS` (Webflow spans all — no sub-slice, per design).
- Update the three code-opencode `01--language-standards` scenarios' `expected_intent`.

**Out of scope:** code-webflow's language keywords (a separate pre-existing mismatch); the residual
`IMPLEMENTATION`/`CODE_QUALITY` keyword co-activation on "implement"/"standards" (documented,
keyword-collision, not split-fixable).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** code-opencode child router parses; a single-language task routes only that language's trio.
- **R2:** The parent projection stays a mechanical union of the children (`sk-code-router-sync`).
- **R3:** No cross-surface leak (`surface-slice-sync`); advisor vocab unchanged (`parent-hub-vocab-sync`).
- **R4:** The sk-code hub Mode-A run does not regress.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A TypeScript task routes only the TypeScript trio for the language slice (no Python/shell/JS files).
2. All three drift guards green.
3. Hub baseline re-captured; the delta is the intended reduction, not a regression.
4. The three language scenarios' gold matches the post-split per-language designed load.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Parent projection drift* → `parent == union(children)` guard fails closed; run after every edit.
- *Hub regression* → before/after hub baseline gate.
- *Residual co-activation* is a separate keyword collision, out of scope — not a reason to force D3=100.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None — the split scope and the code-webflow no-sub-slice decision are settled by the surface's design.
<!-- /ANCHOR:questions -->
