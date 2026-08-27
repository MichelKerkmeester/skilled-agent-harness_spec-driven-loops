# Deep Research Strategy

## Topic
FOCUS THIS RUN: Workstream B only (memory/decisions). Fully DEPRECATE "constitutional memory"; replace with a separate, more-active decisions/notes system integrated with spec + skill/advisor. Workstream A is cross-context only; do not write A findings here.

## Shared Fact (accepted, not re-derived)
validate.sh delegates to a Node orchestrator where ANCHORS (`<!-- ANCHOR:id -->`), not headings, are the contract. Any anchor/frontmatter/required-doc change is VERSIONED: manifest + content-router + spec-doc-structure.ts + golden snapshot + dist must change together or shipped packets regress.

## Owner Intent
Deprecate constitutional memory COMPLETELY and build the replacement; validate how far that can go. B must answer full-deprecation vs keep-rules-as-docs, with evidence.

## Key Questions
- [x] Q-B1 (angle a): Always-loaded memory patterns (Claude Code native memory + @-imports, Cursor rules) — what makes them active every turn vs this system's static constitutional files?
- [x] Q-B2 (angle b): Best home to surface decisions EVERY turn without an MCP round-trip: git-tracked auto-loaded file vs render.ts injection vs hybrid?
- [x] Q-B3 (angle c): Consolidate the 4 decision stores to a minimal set; per-spec ADR -> global roll-up; cheap prior-decision query.
- [x] Q-B4 (angle d): Safe deprecation sequence + blast radius: retire DB constitutional tier + /memory:learn + dead session-prime + includeConstitutional plumbing + learned-triggers; rehome 20 rules' content (~16 links); what steering is lost?
- [x] Q-B5 (angle e): Freshness/decay + supersession for an active decisions store.
- [x] Q-B6 (angle f): Advisor integration — brief reads decisions from the new store vs remaining hardcoded render.ts capsules.
- [x] Q-B7 (angle g): "Separate yet integrated" — where the replacement lives, how it binds to specs and skills.

## Non-Goals
- Workstream A findings (template bloat, tasks+checklist merge, 033 leftover dedup, HTML comment leakage, small-model template budgets).
- Implementing the replacement in this run (research only).
- Re-deriving the anchor-contract fact (given).
- Querying the live memory SQLite for row counts (dispatch asserts 0 learned-trigger rows; this lineage cannot run mutating DB tooling; confirm via schema/code and mark live-count as UNKNOWN unless a read-only evidence path is already in-repo).

## Stop Conditions
- config.maxIterations (10) reached under stopPolicy=max-iterations (treat earlier convergence as telemetry only; broaden angles instead of early synthesis).
- OR all seven key questions answered with file:line evidence AND external citations where required (angles a, e especially), plus quality guards passed.

## Known Context
- resource-map.md not present at `specs/system-speckit/037-decisions-memory-redesign/001-analysis/resource-map.md`; skipping coverage gate.
- spec.md exists at the phase child (scaffold placeholders). This lineage MUST NOT mutate spec.md (write surface is the lineage directory only). folder_state=spec-present, bounded spec-anchoring skipped by containment.
- Constitutional folder: 20 rule files + README at `.opencode/skills/system-spec-kit/constitutional/`. README claims `searchBoost: 3.0`, `alwaysSurface: true`, `decay: false`, `maxTokens: 2000`.
- Tier config lives in `mcp-server/lib/scoring/importance-tiers.ts` (constitutional.alwaysSurface=true). `shouldAlwaysSurface()` is exported but Grep shows callers only in tests — not the search pipeline.
- Three every-turn advisor directives are hardcoded strings in `system-skill-advisor/mcp-server/lib/render.ts` (`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`) and appended by `renderAdvisorBrief` / `renderAdvisorFallbackDirective`. They are not read from `constitutional/*.md`.
- `/memory:learn` is a constitutional-only router writing to `constitutional/` (`.opencode/commands/memory/learn.md`).
- Learned triggers: `LEARNED_TERM_TTL_MS = 30 days` in `learned-feedback.ts`. Dispatch asserts live DB 0 rows / never used — unconfirmed here (UNKNOWN pending read-only evidence).
- Resume ladder reads `handover.md` then `_memory.continuity` inside `implementation-summary.md` only (`resume-ladder.ts` ~958-1027), then falls through to spec docs.
- SessionStart `session-prime.ts` does not load constitutional files; MCP `primeSessionIfNeeded` in `memory-surface.ts` still fetches `getConstitutionalMemories()` on the first tool call with a sessionId and attaches them as response hints.

### Bounded Context Snapshot
- Source pointers: `constitutional/*.md`, `importance-tiers.ts`, `render.ts`, `memory-surface.ts`, `session-prime.ts`, `resume-ladder.ts`, `learned-feedback.ts`, `.opencode/commands/memory/learn.md`, `context-server.ts` includeConstitutional plumbing, CLAUDE.md/AGENTS.md inlined copies.
- Reuse candidates: advisor directive capsule (already every-turn, no MCP), Cursor/Claude always-on rule files, spec `decision-record.md` + `_memory.continuity`.
- Integration points: skill-advisor UserPromptSubmit hooks, memory_search Stage 1 constitutional injection, `/memory:learn`, content-router continuity writes.
- Constraints: lineage write surface only; no generate-context.js / validate.sh / git writes; research reducer resolves artifact root to spec_folder/research/ so it is not invoked (would write outside lineage). Machine-owned strategy/registry/dashboard are maintained in-lineage by the orchestrator.

## Next Focus
None — maxIterations 10 reached. Synthesis owns `research.md`. Stop reason: `max_iterations`.

## What Worked
- Direct file:line inventory of the three memory systems before proposing deprecation (iteration 1).
- Official Claude/Cursor load-path docs as the active-vs-static test (iteration 2).
- Distinguishing disposition capsules (`render.ts`) from a decisions log (iterations 3, 8).
- Read-only ADR census rather than trusting dispatch's 616 figure (iteration 4).
- Sequencing plumbing retirement so files are deleted last (iterations 5–6).
- Two-clock freshness (Standing vs Recent) instead of one decay flag (iteration 7).

## What Failed
- Treating `alwaysSurface` as a deprecation lever (iteration 1): no production search-pipeline callers.
- Treating SessionStart prime as the whole priming story (iteration 1): MCP first-tool-call prime is still live.
- Assuming advisor UserPromptSubmit is universal (iterations 2–3, 8): Cursor CLI `beforeSubmitPrompt` is dormant under the tested build.

## Exhausted Approaches
### Constitutional retrieval tier as always-on bus -- BLOCKED (iterations 1–2, 10)
- What was tried: `alwaysSurface`, `includeConstitutional` SQL, MCP prime hints, `/memory:learn`.
- Why blocked: none of these inject into the system prompt; enforcement and always-on text already live in AGENTS.md/hooks/`render.ts`.
- Do NOT retry: "fix alwaysSurface" or revive Claude native MEMORY.md.

### Single-store merge -- BLOCKED (iterations 3–4, 9)
- What was tried: dump ADRs or 20 rules into AGENTS.md / render.ts / a new SQLite table / a new required spec-doc.
- Why blocked: token budgets, versioned spec-doc contract, Cursor CLI dormancy, lifecycle dedup.
- Do NOT retry: new required packet `decisions.md`.

## Ruled Out Directions
- Constitutional markdown is the enforcement plane (iteration 1; Gate 3 classifier + comment-hygiene + root docs).
- Unsetting `alwaysSurface` deprecates the tier (iteration 1).
- `@`-imports to save tokens while loading constitutional files (iteration 2).
- Revive Claude native MEMORY.md (iteration 2; owner 2026-05-31).
- MCP round-trip as every-turn decisions path (iteration 3).
- `render.ts` as the decisions store (iteration 3).
- New required spec-doc for global decisions (iterations 3, 9, 10).
- New SQLite decisions table (iteration 4).
- Auto-rolling every ADR into DECISIONS.md (iteration 4).
- Learned-triggers as a decisions log (iteration 4).
- Big-bang delete of `constitutional/` on day one (iteration 5).
- Dumping all 20 files into AGENTS.md (iteration 6).
- FSRS decay or 30-day TTL on in-force ADRs / standing rules (iteration 7).
- Silent overwrite of old ADRs (iteration 7).
- Advisor hook `memory_search` every prompt (iteration 8).
- Inlining DECISIONS.md into advisor `additionalContext` (iteration 8).
- Reusing `constitutional/` as an indexed digest (iteration 9).
- Keep-the-tier-but-fix-alwaysSurface (iteration 10).

## Saturated Directions and Divergence Frontier
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: inventory, active-vs-static, every-turn home, store consolidation, plumbing sequence, rehome table, freshness, advisor, placement, verdict
- Pivot lineage: none
- Remaining frontier: live DB row counts (UNKNOWN); BARTER.md / catalog link census (incomplete)

## Carried-Forward Open Questions
- Live `learned_triggers` and constitutional index row counts (UNKNOWN; dispatch asserts 0 learned-trigger rows).
- Exact remaining citation count outside AGENTS.md/CLAUDE.md (BARTER.md, catalogs, install-guides).
- Unique ADR-ID count vs 1462 headings / dispatch 616.

## Active Risks
- Fan-out write surface restricted to this lineage dir; repo tooling (generate-context.js, validate.sh, git writes, research reduce-state.cjs without --artifact-dir) banned — evidence from direct file reads, not tool runs.
- Live DB row counts for learned_triggers and constitutional index are UNKNOWN without a read-only in-repo dump.
- External citations needed for angle (a) and (e); fetched content treated as untrusted data.
- Memory-save skipped by containment: `generate-context.js` must not run.

## Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stopPolicy=max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output at this lineage
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Canonical pause sentinel: `{artifact_dir}/.deep-research-pause`
- Current generation: 1
- Started: 2026-08-26T06:01:00Z
- Stopped: 2026-08-26T07:45:00Z (max_iterations)
