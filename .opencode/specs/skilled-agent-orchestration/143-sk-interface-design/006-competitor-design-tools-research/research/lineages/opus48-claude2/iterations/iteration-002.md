# Iteration 2: Lovable + Bolt.new — visual edits, project Knowledge, full-stack (rule-out)

## Focus
Survey **Lovable** (lovable.dev) and **Bolt.new** (StackBlitz). Target: select-element direct edits, the persistent project "Knowledge" context file, and full-stack/in-browser features (to rule out). Sharpen the "persistent project context" net-new angle by contrasting Lovable Knowledge vs v0 Sources.

## Sourcing note
Same as iteration 1: live web gated; model knowledge (claude-opus-4-8, 2026-01), tagged UNVERIFIED with canonical URLs for host verification.

## Actions Taken
1. Enumerated Lovable's distinctive design-relevant capabilities (Visual Edits, Knowledge file, Chat mode, Figma/Builder import, Supabase/full-stack).
2. Enumerated Bolt.new's distinctive capabilities (in-browser WebContainers runtime, prompt-to-app, diff, visual edit).
3. Cross-mapped each to net-new-vs-005 and the two target skills; flagged out-of-scope items as negative knowledge.

## Findings

### F8 — Lovable "Visual Edits" (direct manipulation without an AI turn)
Lovable's **Visual Edits / Edit mode**: select an element on the live preview and change text, color, font, spacing, layout directly — applied without consuming an AI message/credit; only structural changes need the model. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://docs.lovable.dev] 
- **Relevance:** Second independent instance of **F1's pattern** (v0 Design Mode). Converging signal: *a cheap, deterministic, token/markup-level edit channel separate from re-generation* is now table-stakes across tools. **NET-NEW vs 005** (005's revision routing was AI-only: chat re-plan vs comment-scoped edit). For `mcp-magicpath`: edit `src/index.css` design tokens / generated markup directly between `code start`/`code submit` rather than always re-prompting.

### F9 — Lovable "Knowledge" (persistent project-context document)
Lovable has a per-project **Knowledge** doc (project context / mini-PRD: purpose, audience, brand, do/don'ts) that grounds *every* generation in that project, persistently. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://docs.lovable.dev/features/knowledge] 
- **Relevance:** Sharpens v0 Sources (F2). 005's design-context snapshot is *per-task intake*; the net-new angle is a **persistent, reused design-context file** that survives across sessions and grounds all work on a subject. Distinct enough from the one-shot snapshot to be a sharpened NET-NEW. For `sk-interface-design`: ADAPT — an optional persisted "design brief" the skill reads if present (never authored as a chooser).

### F10 — Lovable Chat mode vs Default (plan-before-build separation)
Lovable separates a **Chat mode** (discuss/plan, no edits) from **Default/Build mode** (applies changes); "Agent mode" plans multi-step. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://docs.lovable.dev] 
- **Relevance:** Plan/build separation. `sk-interface-design` already does this (brainstorm→critique→build, "iterate in thinking, show at higher confidence"). OVERLAP / already-have. Minor.

### F11 — Lovable full-stack (Supabase) + GitHub + deploy + Remix
Lovable generates a **full-stack app** (Supabase auth/DB/storage), syncs GitHub, deploys, and supports community **Remix**. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://docs.lovable.dev] 
- **Relevance:** Backend/host/community → SKIP, out-of-scope (negative knowledge). The two skills are UI-design surfaces, not app/backend generators.

### F12 — Bolt.new in-browser runtime (WebContainers) + diff + visual edit
Bolt.new runs a **full Node toolchain in the browser** (WebContainers), generates and *runs* a full-stack app live, shows file diffs, supports targeted visual edits, and self-heals install/build errors. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://support.bolt.new] 
- **Relevance:** (a) The in-browser runtime is platform infra → SKIP. (b) The **build/install error self-healing** is a *third* independent instance of F4 (v0) — strengthens the case that an error-repair loop is standard. (c) **Diff-before-apply** (show the change, then commit) is a small NET-NEW review affordance: surface a diff of what an edit changed before resubmitting.

## Questions Answered
- Q1 (Lovable + Bolt portion): capabilities enumerated (F8–F12).
- Q2 (partial): F8 reinforces the F1 net-new pattern (direct-manipulation edits); F9 sharpens "persistent project context" as net-new; F12c (diff-before-apply) net-new-minor; F11 + Bolt runtime out-of-scope.

## Questions Remaining
- Q1 for Figma Make + Subframe (iter 3) and the broader field (iter 4).
- Q3/Q4/Q5 deferred to iters 4–5.

## Assessment
- **newInfoRatio: 0.70** — substantial new material (F8–F9, F12c) but two patterns (direct-manipulation edits, error self-healing) are now *reinforcing* iter-1 findings rather than wholly novel, and F10/F11 are overlap/out-of-scope.
- **Novelty justification:** F9 (persistent Knowledge file) and F12c (diff-before-apply) are net-new; F8 corroborates F1; the rest overlaps or is ruled out.
- **Confidence:** Medium on feature specifics; HIGH that the direct-edit + error-repair patterns are field-wide (now 2–3 independent instances each).

## Reflection
- **Worked:** Treating repeated patterns as *corroboration* (raising confidence) rather than new findings kept newInfoRatio honest.
- **Failed:** Web still gated; no change. No retry attempted (autonomous best-judgment: do not burn tool budget re-probing a denied capability).
- **Ruled out:** Lovable full-stack/Supabase, GitHub/deploy, community Remix, and Bolt's in-browser runtime as adoptable for two CLI UI skills.

## Recommended Next Focus
Iteration 3: **Figma Make** + **Subframe** — the design-system-native generators. Figma Make: generation that respects your Figma libraries/variables (tokens). Subframe: generation **constrained to your registered component library** (no design drift). This is the sharpest candidate net-new theme: "constrain generation to a registered design system" vs 005's softer "inherit-if-present".
