# Iteration 3: Every-turn decisions home without an MCP round-trip

## Focus
Angle (b): git-tracked auto-loaded file vs `render.ts` injection vs hybrid, given the active-bus evidence from iter 2 and the advisor hook matrix.

## Actions Taken
- Read `system-skill-advisor/hooks/skill-advisor-hook.md` (per-runtime delivery).
- Read `render.ts` directive append path (iter 1) and `directive-lifecycle-contract.ts` / `directive-lifecycle.ts` (cadence dedup).
- Read `.cursor/rules/skill-routing.md` dormancy note.
- Read `content-router.ts` decision routing (L3 → decision-record.md ADR insert).

## Findings

### F-B3.1 Three candidate every-turn homes, with different reliability
[SOURCE: .opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md:31-57]
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:103-117,449-461]
[SOURCE: .cursor/rules/skill-routing.md:16-17]
[SOURCE: https://cursor.com/docs/context/rules]
[SOURCE: https://code.claude.com/docs/en/memory.md]

| Home | How it loads | MCP? | Reliability in this fleet |
| --- | --- | --- | --- |
| A. Git-tracked auto-loaded file | Root `AGENTS.md`/`CLAUDE.md`, or a small `.cursor/rules/*.mdc` with `alwaysApply: true`, or Claude `@`-import (still launch-loaded) | No | Highest. Already how Gate 3 / hygiene reach the model. Pays token tax every request. |
| B. `render.ts` injection | Advisor UserPromptSubmit / beforeSubmitPrompt / OpenCode system.transform appends `Directives:` + 3 capsules | No (in-process or hook subprocess, not Spec Memory MCP) | High on Claude/OpenCode/Pi when hooks fire. **Cursor CLI: skill-routing.md says dynamic per-turn delivery is dormant** under the tested CLI build. Cadence dedup (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, default ON) suppresses identical directive re-delivery within a session — so it is not strictly "every turn" even when the hook works. |
| C. Hybrid | Tiny always-on file for the decisions digest + keep `render.ts` for the 3 dispositional capsules (hygiene/governor/proof) | No | Matches current split: AGENTS.md already carries the large framework; render.ts restates 3 lines; constitutional search is the failed third copy. |

MCP `memory_search` is disqualified as an every-turn home: it requires a tool call, is fail-open skipped when daemons are cold, and constitutional injection only happens inside that call (iter 1).

### F-B3.2 `render.ts` is the wrong store for *decisions*, right store for *disposition*
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:93-117]
[SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:37-40]
[SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:5-8]

The three hardcoded strings are thermostat lines (how to work), not a decision log (what we decided). They have no IDs, no supersession, no dates, no packet pointers. Putting ADRs into `render.ts` would require a TypeScript edit + advisor rebuild to record a product decision — the opposite of "more active."

Lifecycle dedup exists specifically because repeating the same directive block every turn is wasteful. A growing decisions digest would fight that dedup (either suppressed when unchanged, or bust cache every ADR).

**Recommendation (angle b):** Hybrid. Do not put the decisions store in `render.ts`. Put a **small git-tracked digest** on the always-on bus. Keep `render.ts` capsules as-is (or eventually fold them into AGENTS.md and delete the duplicate, but that is optional).

### F-B3.3 Where the digest should live (machine-contract-safe)
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/routing/content-router.ts:23-32,1086-1094]
[SOURCE: AGENTS.md:39-41,71-72,116,363]

Per-spec system of record already exists: `content-router` category `decision` → L3/L3+ `decision-record.md` + `insert-new-adr`; L2 `implementation-summary.md::decisions`. That path is versioned with the spec-doc contract (shared fact: anchors, not headings).

Global every-turn surface should **not** be a new spec-doc template (that trips the versioned manifest/content-router/spec-doc-structure/golden/dist set). Safer homes:

1. **Preferred:** a repo-root `DECISIONS.md` (or `.opencode/DECISIONS.md`) loaded via Cursor `alwaysApply: true` rule that says "read DECISIONS.md" **or** a Claude `@DECISIONS.md` import from CLAUDE.md — **but** Claude imports still load at launch and count toward the 200-line CLAUDE.md budget. Better: keep CLAUDE.md/`AGENTS.md` to a 10-line pointer ("active decisions: DECISIONS.md, keep under N lines") plus a Cursor alwaysApply rule whose **body is the digest** or `@`-references it (Cursor rules may `@filename`).
2. **Rejected as every-turn home:** `constitutional/*.md` (search bus), `render.ts` (code change per decision), Spec Memory MCP.

Size constraint from iter 2: digest must stay far under Cursor's 500-line rule cap and Claude's 200-line always-on target. That implies a **roll-up of recent/promoted decisions**, not all 1462 ADR headings.

## Questions Answered
Q-B2 answered with a ranked recommendation: hybrid, git-tracked small digest on the always-on bus; `render.ts` stays disposition-only; MCP is query-time only.

## Dead Ends
- Injecting the full ADR corpus through advisor `additionalContext` — token + rebuild + Cursor CLI dormancy + lifecycle dedup.
- Adding a new required spec-doc (`decisions.md` inside each packet) as the every-turn surface — versioned template contract; shipped packets would regress.

## Ruled Out
- MCP round-trip as the every-turn decisions path.
- `render.ts` as the decisions store.

## Assessment
- newInfoRatio: 0.70
- noveltyJustification: Hook-matrix reliability (Cursor CLI dormant; directive cadence dedup) plus content-router already owning per-spec ADRs changes the every-turn design from "pick one store" to "digest vs system-of-record split."
- confidence: high.

## Reflection
Official Cursor/Claude loaders plus this repo's own dormancy comment beat any plan that assumes advisor injection is universal.

## Recommended Next Focus
Angle (c): consolidate the four stores; per-spec ADR → global roll-up; cheap prior-decision query.
