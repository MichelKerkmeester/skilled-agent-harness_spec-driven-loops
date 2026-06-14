# Iteration 1: v0 by Vercel — distinctive design-relevant capabilities

## Focus
Survey **v0 by Vercel** (v0.app, formerly v0.dev) for distinctive, design-relevant capabilities — features, workflow, and quality mechanisms — that `sk-interface-design` or `mcp-magicpath` could adopt. Establish the cross-cutting frame for the lineage.

## Sourcing note (read first)
Live web search/fetch is permission-gated in this autonomous fan-out sandbox (WebSearch denied; WebFetch denied after the first cross-host redirect). Per the deep-research NEVER-ask-the-user rule and the packet spec's risk mitigation ("web access gated in a headless lineage → the host verifies key claims at synthesis"), findings below are drawn from model knowledge (claude-opus-4-8, knowledge cutoff 2026-01) and are tagged **UNVERIFIED** with the canonical doc URL so the host can verify at synthesis. This is recorded as negative knowledge in the strategy.

## Actions Taken
1. Attempted `WebSearch` (v0 features) — denied (no permission in sandbox).
2. Attempted `WebFetch` https://vercel.com/docs/v0 → 308 redirect to https://v0.app/docs/introduction; re-fetch denied.
3. Enumerated v0's design-relevant capabilities from model knowledge; mapped each to the two target skills and to the 005 dedup baseline.

## Findings

### F1 — Design Mode (inline direct-manipulation editing)
v0 added a **"Design Mode"**: click a rendered element and edit it directly (text, spacing, color, typography) via a visual inspector, with edits syncing back to the underlying React/Tailwind code — without spending a full AI generation turn. [SOURCE: model-knowledge claude-opus-4-8 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** A *non-AI, token-level* edit channel distinct from re-prompting. 005's revision routing was chat-vs-comment (both AI); this is the cheaper "tweak the tokens/markup directly" channel. NET-NEW angle vs 005.

### F2 — Project "Sources" / context attachments
v0 lets you attach **context sources** to a project — images, screenshots, URLs, Figma links, files — that ground subsequent generations; it can reproduce a screenshot/image as a UI. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** Overlaps 005's "design-context snapshot intake" and "image-as-visual-brief". Flag as OVERLAP; sharper angle is *persistent project-level* sources reused across turns (see Lovable Knowledge, iter 2).

### F3 — Figma import
Paste a Figma frame/link and v0 imports it as a starting point for generation. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** Figma-specific; the two CLI skills are not Figma plugins. Likely SKIP / out-of-scope (negative knowledge), but the *generalized* idea — "seed generation from an existing visual artifact" — already exists via mcp-magicpath repo import + image brief. OVERLAP.

### F4 — Build-error self-healing loop (agentic correctness)
v0 runs the generated code, observes build/runtime errors, and **auto-fixes** them before presenting the result — an agentic run→error→repair loop. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** **NET-NEW vs 005.** 005's loop is *fidelity to intent* (render→screenshot→compare). This is *correctness self-healing* (build/runtime errors), a distinct loop. Maps cleanly onto `mcp-magicpath`'s `code submit --wait` which already returns build status — adopt a "if build != completed, read error, fix within the editable boundary, resubmit" loop.

### F5 — Theming / shadcn design-system integration
v0 generates shadcn/ui + Tailwind and supports a **theme/design-system** setup so output conforms to a chosen token system; "v0 for teams" shares context/design across a workspace. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** Overlaps 005's "design-system inheritance" + token export. OVERLAP; sharper net-new variant is *constrain generation to a registered component set* (see Subframe, iter 3).

### F6 — Multiple generations / forking
Early v0.dev produced **3 variations per prompt**; current v0 emphasizes one strong result you fork/iterate, plus a community gallery to fork from. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** Multi-variant generation. DANGEROUS for `sk-interface-design` (a "pick-a-vibe" menu violates the anti-default mandate). Overlaps 005's "named bounded quality levers (variations)" ADAPT-cautious note. OVERLAP; carry the anti-default guardrail.

### F7 — Production code output + integrations (deploy, GitHub, API)
v0 outputs deployable Next.js/React, syncs to GitHub, and exposes a **v0 Platform API** for programmatic generation. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://v0.app/docs] 
- **Relevance:** Deploy/host/API are platform features → SKIP / out-of-scope for two CLI skills (negative knowledge).

## Questions Answered
- Q1 (partial): v0's distinctive capabilities enumerated (F1–F7).
- Q2 (partial): F1 (direct-manipulation token edits) and F4 (build-error self-healing) flagged NET-NEW vs 005; F2/F3/F5/F6 flagged OVERLAP; F7 out-of-scope.

## Questions Remaining
- Q1 for Lovable, Figma Make, Subframe, and the broader field.
- Q3/Q4/Q5 (per-skill ADOPT/ADAPT/SKIP verdicts, negative knowledge, prioritization) — deferred to iters 4–5.

## Assessment
- **newInfoRatio: 1.00** — first pass; the full v0 capability set and the cross-cutting frame are new to this lineage.
- **Novelty justification:** First iteration; F1 and F4 are genuinely net-new vs the 005 baseline.
- **Confidence:** Medium on feature existence (model knowledge, web-gated); HIGH on the mapping logic to the two skills.

## Reflection
- **Worked:** Anchoring each v0 feature to (a) net-new-vs-005 and (b) the two skills' boundaries kept the survey decision-relevant rather than a feature dump.
- **Failed:** Live web verification (WebSearch + WebFetch both permission-gated). Recorded as ruled-out for this lineage; host verifies at synthesis.
- **Ruled out:** v0 deploy/GitHub/Platform-API and Figma-plugin import as adoptable for two CLI skills (platform/integration scope).

## Recommended Next Focus
Iteration 2: **Lovable** (lovable.dev) + **Bolt.new** — focus on Visual Edits (select-element direct edit), the persistent "Knowledge" project-context file, and full-stack/in-browser features (to rule out). Contrast Lovable's Knowledge file against v0 Sources for the "persistent project context" net-new angle.
