# Iteration 009: RQ9 token-efficiency mechanisms

**Focus:** RQ9 token-efficiency mechanisms  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.31.  
**Raw output:** prompts/iteration-009.out  ·  **Prompt:** prompts/iteration-009.prompt

### FINDINGS
| Sub-feature | gem-team mechanism (file:line) | spec-kit equivalent or GAP (file:line) | Verdict | Effort(S/M/L) | Net-new value |
|---|---|---|---|---|---|
| Concise output / no preamble | Explicit “No preamble, no meta commentary, no verbose explanations” [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/README.md:100] | Equivalent discipline exists but is distributed: “Concise Expression: Maximum clarity, minimum tokens” [SOURCE: .opencode/skills/sk-prompt/assets/format_guide_markdown.md:35] and “Prefer simplicity” / avoid over-engineering [SOURCE: AGENTS.md:126] | ADAPT | S | Low: make “no preamble/meta” more explicit where missing, but avoid adding ceremony. |
| File-based reusable context | Researcher/Planner save reusable YAML context [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/README.md:101]; rules require file-based outputs [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:71] | Equivalent is stronger: `/spec_kit:resume` prioritizes `handover.md`, `memory_context`, breadcrumbs, anchored search, and recent candidates [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:290]; canonical saves store `_memory.continuity` in spec docs [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:320] | REJECT | S | None: YAML-by-default would duplicate spec-folder continuity and memory handback. |
| Self-validating context cache | Progressive context envelope cache enriched after waves; read from disk once, write after each update to avoid stale reads/races [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:72] | Partial equivalent: `memory_search` caches per parameter combination and runs session dedup after cache [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:104]; save path has PE gating and semantic dedup quality gate [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:330] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:332] | ADAPT | M | Medium: useful as a lightweight “context package validation” pattern for multi-agent waves, not as a new cache store. |
| 80-90% token reduction claim | Marketing-level claim: concise outputs, file-based context, and caching reduce usage 80-90% vs naive prompting [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/README.md:61] | We already have narrower measured mechanisms: Code Mode reduces 47 tool definitions from ~141k to 1.6k tokens [SOURCE: .opencode/skills/mcp-code-mode/README.md:89] and reports 98.7% reduction [SOURCE: .opencode/skills/mcp-code-mode/README.md:150]; advisor briefs hard-cap at 80/120 tokens [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:40] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:64] | REJECT | S | Negative: do not adopt the broad number; keep measured, mechanism-specific claims. |

- [F-009-01] Gem Team’s concise-output rule is directionally aligned, but not novel enough to import wholesale: gem explicitly bans preamble/meta-commentary [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/README.md:100], while spec-kit already encodes token-efficient concise expression and simplicity discipline [SOURCE: .opencode/skills/sk-prompt/assets/format_guide_markdown.md:38] [SOURCE: AGENTS.md:126].
- [F-009-02] File-based YAML outputs are not worth adopting as a new default: gem uses file-based Researcher/Planner outputs [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:71], but spec-kit already has file-backed continuity and canonical recovery through resume anchors and spec docs [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:290] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:320].
- [F-009-03] The only meaningful candidate is a lightweight adaptation of “context envelope validation”: gem’s envelope is progressively enriched and guarded against stale reads/races [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:72], while spec-kit has cache-plus-session-dedup and save-quality validation but no single named subagent context-envelope artifact [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:104] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:332].
- [F-009-04] Reject the 80-90% aggregate claim as non-portable: gem states the broad reduction against “naive single-pass prompting” [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/README.md:61], while spec-kit’s stronger evidence is scoped and measurable through Code Mode’s 141k-to-1.6k comparison and advisor token caps [SOURCE: .opencode/skills/mcp-code-mode/README.md:89] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:109].

### NEGATIVE / RULED-OUT
- Do not adopt YAML file-based output as a blanket default; spec-kit’s spec-folder continuity, memory handback JSON path, and `/spec_kit:resume` ladder already cover the same token-efficiency goal.
- Do not repeat Gem Team’s 80-90% token-reduction claim without benchmark parity; our defensible claims are mechanism-specific.
- Do not add a new cache layer unless it validates freshness better than existing `toolCache`, session dedup, PE gating, semantic dedup, and mutation-triggered cache invalidation.

### OPEN QUESTIONS
- Should multi-agent wave workflows get a small “context envelope manifest” derived from existing memory_context output, or is current spec-folder continuity sufficient?
- Should “no preamble / no meta-commentary” be promoted from style guidance into a citable spec-kit rule for agent outputs?

### METRICS
newInfoRatio: 0.31
novelty: Gem Team adds one useful packaging idea, a progressive context envelope, but most token-efficiency mechanisms already exist in spec-kit in more specific and measurable forms.
status: complete
focus: RQ9 token-efficiency mechanisms
