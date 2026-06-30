# Iteration 017 — Track D (mimo)

## Focus
Grounded AI documentation (doc-as-view-over-tokens, drafting guardrails, anti-stale regenerate-tables, MCP token endpoint)

## Findings
1. **[P0] Doc-as-token-view (hybrid binding model)** — Supernova, Backlight, Zeroheight, and Knapsack all render docs FROM live token data — the doc is a view, not a free-write. Supernova ingests Figma Variables/Tokens Studio and generates code via deterministic rules; Backlight renders LIVE tokens via Style Dictionary integration; Zeroheight auto-syncs from Figma/Storybook/repo on component change; Knapsack manages source-of-truth tokens with multi-brand inheritance. The pattern is universal: value-tables are deterministic renders, prose is thin annotation. Our DESIGN.md WRITE phase currently AI-writes the ENTIRE doc including sections that are pure token tables (Colors §2, Typography §3, Spacing §7, Shadows §4, Radii §5). These 5 sections should be code-generated from tokens.json as markdown tables, not AI-prose-rendered.
   - Recommendation: Split WRITE phase into two sub-phases: (1) AUTO-RENDER — generate Sections 2-8 (Color Palette, Typography, Shadows, Radii, Spacing, Breakpoints, CSS Variables) as deterministic markdown tables directly from tokens.json via a new `render-tables.ts` script; (2) AI-ANNOTATE — AI writes only Sections 1, 9-17 (Voice/Tone, Components, Anti-Patterns, A11y, etc.) where judgment is required. File change: add `tool/scripts/render-tables.ts`, modify WRITE phase orchestration in `tool/scripts/extract.ts` or the skill's WRITE prompt in `assets/design_md_prompt_template.md`.
   - Evidence: Supernova (rule-based code gen from tokens), Backlight (Style Dictionary live render), Zeroheight (auto-sync on source change), Knapsack (source-of-truth token management)
2. **[P1] Cite-the-token guardrail for AI annotation sections** — Zeroheight's AI drafting + refinement constrains AI by coupling it to synced source data — AI drafts from live tokens, then human refines. The anti-fabrication mechanism is: AI never free-writes numeric values; it annotates around token-sourced data. Our WRITE phase currently has the cardinal rule ('copy verbatim from tokens.json') but it's enforced only by post-hoc validate.ts. The borrowable guardrail is: during AI-annotate phases, inject a SYSTEM prompt constraint that every numeric reference must include a `(from tokens.json: <exact-value>)` citation, and validate.ts checks that cited values match. This makes fabrication detectable at write-time, not just validate-time.
   - Recommendation: Modify `assets/design_md_prompt_template.md` to require inline token citations for any numeric value in AI-written sections. Enhance `tool/scripts/validate.ts` to parse citation annotations and verify them against tokens.json. This turns the cardinal rule from a style guideline into a machine-checkable contract.
   - Evidence: Zeroheight AI drafting constrained by synced source data + human refinement workflow
3. **[P1] Regenerate-values-preserve-annotations merge model** — Zeroheight's anti-stale-docs model auto-updates docs when source components change, preserving human-authored context. Our proof.ts detects drift (value mismatch between DESIGN.md and tokens.json) but the doc doesn't self-update — a human must manually reconcile. The borrowable merge model: on re-extraction, auto-regenerate the deterministic sections (value-tables) from fresh tokens.json while preserving any human-edited annotation blocks (delimited by HTML comments like <!-- human-annotation-start -->...<!-- human-annotation-end -->). Sections 9-17 (AI-annotated) get a staleness flag but aren't auto-overwritten.
   - Recommendation: Add `tool/scripts/merge-update.ts` that: (1) re-renders deterministic sections from fresh tokens.json; (2) preserves human annotation blocks via delimiter detection; (3) flags AI-annotated sections as 'stale — source tokens changed on <date>' if their underlying token dependencies shifted. Integrate into re-extraction workflow. Proof.ts triggers merge-update automatically when drift is detected.
   - Evidence: Zeroheight auto-update on component change with preserved human annotations
4. **[P2] MCP token endpoint for agent consumption** — Supernova exposes an AGENT-READY MCP endpoint so consuming agents read tokens directly rather than trusting prose descriptions. This is architecturally relevant: if DESIGN.md consumers (sk-code, AI coding agents) could query tokens.json via a structured endpoint instead of parsing markdown, prose drift becomes irrelevant for numeric lookups. The doc becomes documentation-of-record for humans; agents read the source.
   - Recommendation: Expose tokens.json as a lightweight MCP tool or structured query endpoint (even a CLI: `npx ts-node scripts/query-token.ts --key 'colors.primary' --format json`). This doesn't replace DESIGN.md but creates a parallel agent-consumption path where numeric fidelity is guaranteed by the data layer, not the prose layer. Lower priority than P0/P1 changes since our agents already read tokens.json directly in practice.
   - Evidence: Supernova AGENT-READY MCP endpoint

## Questions Answered
- Doc = a view over tokens is the correct model — 5 of 17 DESIGN.md sections (Colors, Typography, Shadows, Radii, Spacing) should be deterministic renders from tokens.json, not AI prose
- Zeroheight constrains AI by coupling drafts to synced source data + human refinement — borrowable as cite-the-token + draft-then-verify
- Anti-stale merge model: auto-regenerate value-tables, preserve delimited human annotations, flag stale AI sections — implementable as merge-update.ts
- MCP token endpoint is relevant but lower priority — agents already read tokens.json; the real win is fixing the WRITE phase split

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- deepen: design the render-tables.ts output format for deterministic sections — which markdown table structure best serves both human readers and agent parsers
- deepen: prototype the cite-the-token annotation format and validate.ts enhancement — what's the minimal change to make numeric citations machine-checkable
- deepen: design the human-annotation delimiter convention — HTML comments vs frontmatter vs a sidecar YAML — for the merge-update preservation model
- deepen: benchmark whether splitting WRITE into auto-render + AI-annotate actually reduces validate.ts failure rate on the four example sites (stripe, vercel, linear, supabase)

## Next Focus
- deepen: design the render-tables.ts output format for deterministic sections — which markdown table structure best serves both human readers and agent parsers
- deepen: prototype the cite-the-token annotation format and validate.ts enhancement — what's the minimal change to make numeric citations machine-checkable
- deepen: design the human-annotation delimiter convention — HTML comments vs frontmatter vs a sidecar YAML — for the merge-update preservation model
- deepen: benchmark whether splitting WRITE into auto-render + AI-annotate actually reduces validate.ts failure rate on the four example sites (stripe, vercel, linear, supabase)

## Summary
Every analyzed platform (Supernova, Backlight, Zeroheight, Knapsack) renders docs FROM tokens as live-bound views — the doc is a projection of data, not a free-write. The highest-value model to adopt is splitting DESIGN.md's WRITE phase into deterministic table-rendering (Sections 2-8, code-generated from tokens.json) and AI annotation (Sections 1, 9-17, where judgment is required). This eliminates the primary hallucination surface (AI writing numeric values) while preserving AI value for prose sections. The concrete pipeline change: add render-tables.ts for auto-render, require cite-the-token annotations in AI sections, and add merge-update.ts for re-extraction that regenerates value-tables while preserving human edits.
