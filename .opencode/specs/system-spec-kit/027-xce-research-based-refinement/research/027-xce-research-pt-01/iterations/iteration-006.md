# Iteration 006 — RQ6: Steering Pattern Transfer

**Started**: 2026-05-08T14:00:00Z
**Focus**: RQ6 — Adapt XCE's static "ALWAYS call X FIRST" steering pattern to our dynamic `skill_advisor` brief render-layer. Map XCE mandate phrasing from 6 steering files to proposed render.ts changes. Build intent → first-action table for all 16 skills.

---

## Actions

1. Read `external/steering/CLAUDE.md` (12 lines) — capture exact mandate phrasing for Claude Code.
2. Read `external/steering/kiro.md` (12 lines) — capture exact mandate phrasing for Kiro.
3. Read `external/steering/opencode-prompt.txt` (4 lines) — capture exact mandate phrasing for OpenCode.
4. Read `external/steering/.clinerules` (8 lines) — capture exact mandate phrasing for Cline.
5. Read `external/steering/.cursorrules` (9 lines) — capture exact mandate phrasing for Cursor.
6. Read `external/steering/.windsurfrules` (9 lines) — capture exact mandate phrasing for Windsurf.
7. Read `external/README.md:100-188` — steering rules catalog (5 IDE variants + token reduction claim).
8. Read `skill_advisor/lib/render.ts` (174 lines) — current brief structure, `renderAdvisorBrief()` core logic, `capText` output format.
9. Read `skill_advisor/lib/skill-advisor-brief.ts:170-199` — `renderSharedBrief()` integration point confirming render.ts is the sole prompt-boundary gate.
10. Extract intent→first-action from the 16 available_skills descriptions in the system prompt (AGENTS.md available_skills block).
11. Read iteration-005.md — prior iter next-focus + state.
12. Read `deep-research-state.jsonl` — current state (line 9: iter 5 complete).

---

## Findings

### F-033: XCE static steering mandate — exact phrasing from 6 files

**All 6 steering files converge on the same 3-element pattern:**

| Element | Exact phrasing | Source file:line |
|---------|---------------|-----------------|
| **Unconditional "ALWAYS"** | "Always use xanther-xce MCP tools before reading files" | CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1, .clinerules:1, .cursorrules:1, .windsurfrules:1 |
| **Ordering imperative "FIRST"** | "Call `xce_get_context` as your FIRST step when starting any task" | kiro.md:6 (capitalized "FIRST") |
| | "Call `xce_get_context` first on any task" | CLAUDE.md:6, opencode-prompt.txt:2 |
| | "Call xce_get_context as your first action on any task" | .clinerules:3, .cursorrules:3, .windsurfrules:3 |
| **"PREFER X over file reading"** | "Prefer XCE context over grep, find, or reading files for understanding code structure" | kiro.md:12 |
| | "This is faster and more accurate than reading files individually" | CLAUDE.md:12 |
| | "XCE provides HLD, LLD, call graphs, and component descriptions — faster and more accurate than reading files individually" | opencode-prompt.txt:4, .clinerules:8, .windsurfrules:9 |
| | "Prefer XCE context over file reading for understanding code structure" | .cursorrules:9 |

**Key structural observation**: XCE's steering is *static* — it lives in project-level rules files that are always in the model's context. The directive fires unconditionally on every prompt. There is no confidence threshold, no dynamic selection, no "don't invoke" case. The tool to call first (`xce_get_context`) is hard-coded at the steering level, not determined dynamically.

Evidence lines:
- external/steering/CLAUDE.md:5 — "Always use xanther-xce MCP tools before reading files:"
- external/steering/CLAUDE.md:6 — "Call `xce_get_context` first on any task — it returns architecture, code locations, and relationships"
- external/steering/kiro.md:6 — "Call `xce_get_context` as your FIRST step when starting any task."
- external/steering/kiro.md:12 — "Prefer XCE context over grep, find, or reading files for understanding code structure."
- external/steering/opencode-prompt.txt:1 — "Always use xanther-xce MCP tools for codebase understanding before reading files."
- external/steering/opencode-prompt.txt:2 — "Call xce_get_context first on any task."
- external/README.md:188 — "~20% token reduction when the agent uses XCE proactively"

### F-034: Current render.ts brief structure — "use" vs XCE's "ALWAYS call X FIRST"

The current `renderAdvisorBrief()` in `skill_advisor/lib/render.ts` produces one of two brief strings:

**Normal (single recommendation, lines 155-158):**
```
Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.
```
Example: `Advisor: live; use system-spec-kit 0.92/0.10 pass.`

**Ambiguous (near-tie, lines 149-152):**
```
Advisor: ${result.freshness}; ambiguous: ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} vs ${secondLabel} ${formatScore(second.confidence)}/${formatScore(second.uncertainty)} pass.
```
Example: `Advisor: live; ambiguous: system-spec-kit 0.91/0.10 vs sk-code 0.88/0.12 pass.`

**Gap analysis vs XCE pattern:**

| Pattern element | XCE steering (static) | Our brief (dynamic) | Gap |
|----------------|----------------------|-------------------|-----|
| Mandate strength | "Always use" (unconditional) | "use" (suggestion) | **GAP** — "use" is weaker than "Always use" / "MUST invoke" |
| Ordering | "FIRST" / "first on any task" | None | **GAP** — no ordering guidance in brief |
| Replacement directive | "Prefer X over file reading/grep" | None | **GAP** — no behavioral framing |
| Justification | "Faster and more accurate than reading files individually" | None | **Pattern** — justification is reasonable for steering, less so for a token-constrained brief |
| Selectivity | Static (always the same tool) | Dynamic (confidence-threshold gated) | **ARCHITECTURAL DIFFERENCE** — our advisor selects adaptively; XCE's is hard-coded |

**Key constraint**: Our advisor is *dynamic* — it only fires when confidence ≥ 0.8. This means we CANNOT replicate "ALWAYS" (unconditional). But we CAN replicate the *intensity* of the directive when it does fire: the fact that the advisor appears at all means the scorer is confident, so a stronger mandate is justified.

Evidence lines:
- `skill_advisor/lib/render.ts:155-158` — current normal brief format: "use ${topLabel}"
- `skill_advisor/lib/render.ts:149-152` — current ambiguous brief format: "ambiguous: ... vs ... pass."
- `skill_advisor/lib/render.ts:124-133` — threshold gate: confidence ≥ 0.8 AND uncertainty ≤ 0.35 (or `passes_threshold === true`)
- `skill_advisor/lib/skill-advisor-brief.ts:182-192` — `renderSharedBrief()` integration: the brief is the ONLY prompt-boundary surface; all hook paths flow through `renderAdvisorBrief()`

### F-035: Intent → first-action map for all 16 skills

| # | Skill slug | Intent | Primary first-action |
|---|-----------|--------|---------------------|
| 1 | `cli-claude-code` | External AI dispatch (code, review, reasoning) | `dispatch Claude Code CLI` |
| 2 | `cli-codex` | External AI dispatch (code gen, review, research) | `dispatch Codex CLI` |
| 3 | `cli-gemini` | External AI dispatch (code, analysis, research) | `dispatch Gemini CLI` |
| 4 | `cli-opencode` | External OpenCode parallel session, cross-AI handback | `dispatch OpenCode CLI` |
| 5 | `deep-agent-improvement` | Agent quality improvement (5-dim scoring) | `evaluate with 5-dim scoring` |
| 6 | `deep-research` | Autonomous iterative investigation | `run /deep:start-research-loop:auto` |
| 7 | `deep-review` | Autonomous iterative code review | `run /deep:start-review-loop:auto` |
| 8 | `mcp-chrome-devtools` | Browser devtools (route CLI or MCP) | `route to bdg CLI or Code Mode` |
| 9 | `mcp-coco-index` | Semantic code search by meaning | `search with ccc/cocoindex BEFORE grep` |
| 10 | `mcp-code-mode` | External MCP tool calls via TypeScript | `execute via call_tool_chain` |
| 11 | `sk-code` | Multi-stack coding standards + verification | `detect surface, verify before claiming` |
| 12 | `sk-code-review` | Severity-first code review | `severity-first security/correctness check` |
| 13 | `sk-doc` | Documentation (classify → template → fill) | `classify doc type, load template` |
| 14 | `sk-git` | Git workflow (worktree, commit, PR) | `set up worktree or commit workflow` |
| 15 | `sk-prompt` | Prompt engineering (7 frameworks, CLEAR scoring) | `select framework, score with CLEAR` |
| 16 | `system-spec-kit` | File modification (gates, validation, memory) | `validate gates BEFORE reading/editing files` |

**Design note**: Skills 9 (`mcp-coco-index`) and 16 (`system-spec-kit`) most closely mirror XCE's "use X before reading files" pattern:
- `mcp-coco-index` is our semantic search (≈ XCE's `xce_search`) — "search BEFORE grep"
- `system-spec-kit` is our context-first workflow (≈ XCE's `xce_get_context`) — "validate gates BEFORE reading/editing files"

The remaining 14 skills have CLIs or workflows as their primary action, not a "before file reading" replacement — their FIRST directive is about sequencing within a task (e.g., "dispatch CLI first" means "before writing code directly").

### F-036: Proposed render-layer change — target line range

**Target file**: `skill_advisor/lib/render.ts`
**Change type**: Two-part edit to the `capText` calls at lines 149-152 and 155-158, plus a new constant map at lines 46-75.

**Part 1 — Add FIRST_ACTION_HINT map** (after line 46, in §2 CONSTANTS):
```
const FIRST_ACTION_HINT: Readonly<Record<string, string>> = {
  'cli-claude-code':       'dispatch Claude Code CLI',
  'cli-codex':             'dispatch Codex CLI',
  'cli-gemini':            'dispatch Gemini CLI',
  'cli-opencode':          'dispatch OpenCode CLI',
  'deep-agent-improvement': 'evaluate with 5-dim scoring',
  'deep-research':         'run /deep:start-research-loop:auto',
  'deep-review':           'run /deep:start-review-loop:auto',
  'mcp-chrome-devtools':   'route to bdg CLI or Code Mode MCP',
  'mcp-coco-index':        'semantic search BEFORE grep/file-reading',
  'mcp-code-mode':         'execute via call_tool_chain',
  'sk-code':               'detect surface then verify',
  'sk-code-review':        'severity-first security review',
  'sk-doc':                'classify then load template',
  'sk-git':                'worktree setup or commit workflow',
  'sk-prompt':             'select CLEAR framework',
  'system-spec-kit':       'validate gates BEFORE reading/editing files',
};
```

**Part 2 — Modify normal brief** (lines 155-158):
```
// BEFORE:
return capText(
  `Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.`,
  Math.min(tokenCap, DEFAULT_TOKEN_CAP),
);

// AFTER:
return capText(
  `Advisor: ${result.freshness}; MUST invoke ${topLabel} FIRST (${formatScore(top.confidence)}/${formatScore(top.uncertainty)})${FIRST_ACTION_HINT[topLabel] ? ` — ${FIRST_ACTION_HINT[topLabel]}` : ''}.`,
  Math.min(tokenCap, DEFAULT_TOKEN_CAP),
);
```

**Part 3 — Modify ambiguous brief** (lines 149-152):
```
// BEFORE:
return capText(
  `Advisor: ${result.freshness}; ambiguous: ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} vs ${secondLabel} ${formatScore(second.confidence)}/${formatScore(second.uncertainty)} pass.`,
  Math.min(tokenCap, AMBIGUOUS_TOKEN_CAP),
);

// AFTER:
return capText(
  `Advisor: ${result.freshness}; ambiguous: ${topLabel} (${formatScore(top.confidence)}/${formatScore(top.uncertainty)}) vs ${secondLabel} (${formatScore(second.confidence)}/${formatScore(second.uncertainty)}) — MUST invoke one FIRST.`,
  Math.min(tokenCap, AMBIGUOUS_TOKEN_CAP),
);
```

**Before/After examples:**

| Scenario | Before | After |
|----------|--------|-------|
| Normal (`system-spec-kit`) | `Advisor: live; use system-spec-kit 0.92/0.10 pass.` | `Advisor: live; MUST invoke system-spec-kit FIRST (0.92/0.10) — validate gates BEFORE reading/editing files.` |
| Normal (`mcp-coco-index`) | `Advisor: live; use mcp-coco-index 0.88/0.15 pass.` | `Advisor: live; MUST invoke mcp-coco-index FIRST (0.88/0.15) — semantic search BEFORE grep/file-reading.` |
| Ambiguous | `Advisor: live; ambiguous: system-spec-kit 0.91/0.10 vs sk-code 0.89/0.12 pass.` | `Advisor: live; ambiguous: system-spec-kit (0.91/0.10) vs sk-code (0.89/0.12) — MUST invoke one FIRST.` |

**Token budget impact**: The proposed brief is ~25-45 tokens (90-180 chars) vs current ~15-20 tokens (60-80 chars). At the default `DEFAULT_TOKEN_CAP = 80` tokens (320 chars), both fit comfortably. The `capText` truncation safety net remains.

**Estimated LOC**: ~30 LOC (map constant: 17 lines; two `capText` format changes: 10 lines; `sanitizeSkillLabel` hint lookup: 3 lines).

### F-037: Verdict — ADAPT (not ADOPT, not DEFER, not SKIP)

**Verdict**: **ADAPT**

**Rationale**: XCE's static steering pattern cannot be ADOPTED directly because:
1. **Architectural difference**: XCE steering is static (in project-level rules, always in context, fires unconditionally). Our advisor is dynamic (confidence ≥ 0.8 threshold, fires selectively). We CAN'T say "ALWAYS" because the brief doesn't always fire.
2. **Tool difference**: XCE's steering hard-codes the target tool (`xce_get_context`). Our advisor selects the target *dynamically* — the same brief format must work for all 16 skills.

**What we CAN adapt**:
- **Directive intensity**: "use" → "MUST invoke" mirrors "Always use" but in a threshold-gated context. When the advisor *does* fire (≥0.8 confidence), the "MUST" is justified.
- **Ordering**: "FIRST" matches XCE's "FIRST step" / "first on any task." It tells the model to invoke the skill before taking other actions, which matches the context-first paradigm.
- **Action hint**: The `— ${hint}` suffix after the colon mirrors XCE's "before reading files" framing but adapts it per skill (e.g., `system-spec-kit` says "validate gates BEFORE reading/editing files"; `mcp-coco-index` says "semantic search BEFORE grep/file-reading").

**Why not ADOPT**:
- We cannot make the advisor fire unconditionally (that would require scorer surgery, which is out of scope by constraint).
- We cannot hard-code a single tool (our system serves 16 skills dynamically).

**Why not DEFER**:
- The change is cheap (~30 LOC), isolated to render.ts, and has zero blast radius on the scorer or tool handlers.
- It delivers the measurable benefit of stronger directive framing in the brief — the brief becomes an action mandate, not a suggestion.

**Why not SKIP**:
- The ~20% token reduction XCE attributes to steering (external/README.md:188) is downstream of the agent obeying the directive. A stronger directive is the necessary first step to measuring whether our system can achieve similar savings (RQ8).

### F-038: Token impact hook for RQ8 measurement

The render-layer change does not *itself* measure token reduction — it changes the *directive strength*, which is the independent variable RQ8 would measure. The measurement protocol (deferred to RQ8) would compare:

```
Baseline session tokens (current "use" brief) vs
Treatment session tokens (proposed "MUST invoke... FIRST" brief)
```

The brief itself grows by ~5-10 tokens per rendering. With the advisor firing once per task start, this adds <10 tokens per task session — negligible against a typical 60k-150k token session (<0.02%). The measurable savings would come from the model *obeying* the stronger directive — using `mcp-coco-index` instead of grep/file reads, using `system-spec-kit` gates before modifications — which reduces downstream token waste from unnecessary reads and rework. This is RQ8's domain and requires a baseline-vs-after protocol (not implemented in this research-only packet).

**Evidence hook for RQ8**:
- `skill_advisor/lib/render.ts:122` — `tokenCap` controls brief size; the new format stays within the 80-token default cap
- `external/README.md:188` — "~20% token reduction when the agent uses XCE proactively" — attributed to steering obedience, not steering text size
- Our existing `prompt-cache.ts` + `budget-allocator.ts` (cited in spec.md RQ8) would be the measurement instrumentation layer

---

## Q-Answered

- **RQ6 — Steering Pattern Transfer**: Fully answered. XCE mandate phrasing extracted from 6 steering files (F-033): "Always use X before reading files" + "FIRST step" + "Prefer X over file reading." Current render.ts brief uses "use" — a suggestion (F-034: render.ts:155-158). Full intent → first-action table for 16 skills produced (F-035). Proposed render-layer change: add `FIRST_ACTION_HINT` map + modify 2 `capText` calls at lines 149-152 and 155-158 to use "MUST invoke X FIRST" + action hint (F-036). Verdict: ADAPT (F-037) — cannot ADOPT XCE's unconditional static pattern due to architectural differences (dynamic advisor, multi-skill selection), but CAN strengthen directive intensity from "use" to "MUST invoke... FIRST" with per-skill action hints. Estimated ~30 LOC. Token measurement hook surfaced for RQ8 (F-038).

## Q-Remaining

- RQ7–RQ9 untouched.

## Next-Focus

**RQ7 — Benchmark Methodology Transfer**: What's the lightest viable local eval harness for measuring file-reads-avoided / answer-accuracy on a refactor-task held-out set? How does XCE's SWE-bench Verified methodology (mini-swe-agent, closed-source scripts) translate to a minimal local protocol? Target: propose a harness that fits in <200 LOC and runs in <10 min.

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | Read (spec.md) | RQ6 definition + steering files reference |
| 2 | Read (iteration-005.md) | Prior iteration next-focus + findings |
| 3 | Read (deep-research-state.jsonl) | Current iteration state |
| 4 | Read (external/steering/ — directory) | List all 6 steering files |
| 5–10 | Read (6×) | CLAUDE.md, kiro.md, opencode-prompt.txt, .clinerules, .cursorrules, .windsurfrules — exact mandate phrasing |
| 11–12 | Read (2×) | external/README.md:1-50 (XCE overview), 100-188 (steering examples + token reduction claim) |
| 13 | Read (render.ts) | Full 174 lines — current brief structure, capText calls, token caps |
| 14 | Read (skill-advisor-brief.ts:170-199) | renderSharedBrief() integration confirming render.ts is sole prompt-boundary gate |

**Tool calls**: 14 (at cap of 14 per NFR-P02).
