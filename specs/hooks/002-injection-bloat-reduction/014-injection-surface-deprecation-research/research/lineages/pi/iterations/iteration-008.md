# Iteration 8: Surface Closure — Remaining Injection Candidates Checked

## Focus

Close the last unopened injection candidates: session-stop context, sk-code router, memory-context resume path, and the OpenCode bridge fallback emitter.

## Findings

### F1. session-stop / shutdown: side effects only, no injection (confirmed)

`session-stop-context.ts:10`: "Fire-and-forget: session-stop.js performs side effects, not context injection." No additional surface. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10]

### F2. sk-code skill: on-demand skill content, not an injection surface

The sk-code SKILL.md smart router (`load_if_available`, registry routing) loads skill packets when the skill is invoked via Gate 2 routing — it is on-demand context, activated by the advisor recommendation, not a per-turn injected surface. The inventory stands: the skill layer is the CONSUMER of the advisor line, not a separate bloat source. [SOURCE: .opencode/skills/sk-code/SKILL.md]

### F3. Memory-context resume: lives only in the continuity/compaction briefs (already inventoried)

The only Pi hook touching `memory_context(mode=resume)` is `session-compact-context.ts` — the post-compaction recovery brief from iteration 1 finding 8. No separate memory-context injection surface exists on Pi. [SOURCE: hooks/pi/ listing, session-compact-context.ts]

### F4. NEW drift finding: the OpenCode bridge's LOCAL fallback mirror emits only TWO of the three directives

`mk-skill-advisor-bridge.mjs:368-373`: the local mirror appends `DIRECTIVES_LABEL + HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE` — **TERMINAL_PROOF_DIRECTIVE (proof-over-appearance) is missing** versus the canonical `renderAdvisorBrief` (render.ts:444-452 emits all three). This mirror engages only when the compiled canonical renderer cannot be imported (`loadCanonicalRenderer` catch path, bridge.mjs:377-382), but when it does, the guardrail set differs. injection-contract.md §2's "mirrors the same three directives locally" claim is inaccurate for the fallback path. Small, real, fixable drift; relevant to any deprecation work on the directives (single-source the block instead of mirroring). [SOURCE: mk-skill-advisor-bridge.mjs:355-382, render.ts:444-452]

## Sources Consulted

- session-stop-context.ts:10; hooks/pi/ listing
- .opencode/skills/sk-code/SKILL.md (smart router)
- mk-skill-advisor-bridge.mjs:355-382; render.ts:444-452
- injection-contract.md §2

## Assessment

- **newInfoRatio: 0.25** — three closure confirmations plus one small drift finding (F4). The injection inventory is now closed on every runtime.
- **Confidence:** high.

## Reflection

- What worked: systematic enumeration of the remaining unopened files.
- What failed: nothing.
- Ruled out: any additional per-turn or per-session injection surface beyond the nine candidates + tool-time hooks inventoried in iteration 1; a separate memory-context injection on Pi.

## Recommended Next Focus

Iteration 9: Final numerical cross-check of every load-bearing figure used in the synthesis (806/767/554/42/521/389 B, 13/17/30 matrix, 82.2%, ratios) and preparation of the convergence report.
