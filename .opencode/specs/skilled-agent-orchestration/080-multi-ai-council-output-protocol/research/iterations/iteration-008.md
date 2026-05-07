# Iteration 8: Q8 /memory:save council-completion anchoring

## Focus

Answer Q8: decide whether `/memory:save` should learn to anchor council-completion events, including whether `council_complete` or `council-report.md` should map to a canonical `ANCHOR:council-report-{packet}`-style reference.

## Actions Taken

- Confirmed the iteration number from `deep-research-state.jsonl`: seven completed iteration records make this iteration 8.
- Read the strategy, findings registry, and iteration 7 narrative to preserve the Q1-Q7 decisions and follow Section 11 Next Focus.
- Inspected `/memory:save`, `generate-context.ts`, `content-router.ts`, and the thin continuity writer to understand the current canonical save surface.
- Compared the current council output contract and packet 080 smoke-test artifacts against the save router's existing categories and anchors.
- Checked git history for packet 080 commits to confirm the council protocol was recently added as a lightweight convention, not as a save-substrate feature.

## Findings

### 1. Do not add `ANCHOR:council-report-{packet}` as a canonical save target

The current save router is deliberately category-based, not artifact-name based. `/memory:save` documents eight routed categories at `.opencode/commands/memory/save.md:90` through `.opencode/commands/memory/save.md:103`: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. The implementation mirrors that fixed target set in `buildTarget()` at `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1062` through `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1085`.

Adding a packet-specific `ANCHOR:council-report-{packet}` family would be a new ninth semantic destination or a dynamic sub-anchor system. That would fight the router prompt, which tells Tier 3 to classify into exactly the eight categories and never invent a new category, doc, anchor, or merge mode at `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1280` through `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1298`.

The better rule is: a completed council can be summarized through existing save categories, but the raw `ai-council/council-report.md` remains the packet artifact source of truth.

### 2. `/memory:save` already has the right destination for council completion metadata

The command's purpose is to route session context into canonical packet docs and `_memory.continuity`, not to index every packet artifact as its own anchor. Its canonical model names `handover.md`, `_memory.continuity`, `implementation-summary.md`, and `decision-record.md` as the main destinations at `.opencode/commands/memory/save.md:71` through `.opencode/commands/memory/save.md:80`. The direct workflow guide says all paths feed `generate-context` and update canonical packet continuity docs at `.opencode/skills/system-spec-kit/references/memory/save_workflow.md:14` through `.opencode/skills/system-spec-kit/references/memory/save_workflow.md:20`.

That means the council completion should be represented as compact routed context:

- `narrative_delivery`: "Council completed round N with convergence true; report at ai-council/council-report.md."
- `decision`: "Council recommended option B because..."
- `handover_state`: "Next safe action: implement packet 081 follow-up items."
- `metadata_only`: compact `_memory.continuity` fields such as recent action and key files.

No special anchor is needed to recover the raw report path. The `council_complete` event already records `final_report_path`, and packet 080 has two such events at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-state.jsonl:7` and `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-state.jsonl:14`.

### 3. A helper-emitted save payload is the right integration point

`generate-context.ts` expects the AI or caller to provide structured JSON. Its help text says the preferred path is `--stdin`, `--json`, or a JSON temp file at `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:89` through `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:94`, and its JSON shape accepts `observations`, `recent_context`, `toolCalls`, `exchanges`, `preflight`, and `postflight` at `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:101` through `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:144`.

The follow-on council helper from Q1 should therefore optionally emit a small save payload after it writes artifacts. Shape:

```json
{
  "specFolder": "skilled-agent-orchestration/080-multi-ai-council-output-protocol",
  "observations": [
    {
      "type": "council_completion",
      "title": "Multi-AI Council completed",
      "narrative": "Round 2 converged; final report at ai-council/council-report.md; recommendation option-b-orchestrator-mediated.",
      "files": ["ai-council/council-report.md", "ai-council/ai-council-state.jsonl"]
    }
  ],
  "recent_context": [
    {
      "request": "Persist multi-ai-council result",
      "completed": "council_complete event emitted and report persisted",
      "learning": "Use existing memory save categories; do not create council-specific anchors"
    }
  ],
  "routeAs": "narrative_delivery"
}
```

The caller may pipe this through `generate-context.js --stdin` only when the session actually needs memory continuity. Artifact persistence itself should not require a memory save to be considered successful.

### 4. Treat `council_complete` as evidence, not as the save trigger

The agent body defines `council_complete` as the final JSONL event with `final_report_path` at `.opencode/agents/multi-ai-council.md:621` through `.opencode/agents/multi-ai-council.md:637`. The state-format reference says that if `council_complete` exists, the council is done unless the user requests another round at `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:60`.

That event is a strong evidence source for save payload generation, but it should not automatically fire `/memory:save`. Automatic save-on-complete would couple a planning artifact to the canonical continuity substrate and add hidden writes to a convention whose current design is explicit, caller-mediated persistence. The packet 080 council report also says the agent remains planning-only and the dispatching orchestrator owns persistence at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:121`.

### 5. Thin continuity budget argues for pointers, not embedded report content

The thin continuity writer serializes only the compact `_memory.continuity` frontmatter envelope at `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:778` through `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:790`. It compacts or rejects oversized continuity blocks at `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:895` through `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:915`.

Council reports are long deliberative artifacts. Embedding them into `_memory.continuity` would be the wrong granularity. Store only a pointer plus the winning recommendation, convergence status, round number, and next action. Leave the full plan in `ai-council/council-report.md`.

## Questions Answered

- Q8 answered: `/memory:save` should not learn a new `ANCHOR:council-report-{packet}` destination. Council completion should be summarized through existing routed categories, preferably via an optional helper-emitted JSON save payload. `council_complete` is evidence for that payload and for resume/audit, not an automatic save trigger or a new anchor family.

## Questions Remaining

- Q9 remains: ADD-1 through ADD-6 risk mitigation should now include the Q8 boundary: helper persistence may offer an optional save payload, but canonical memory anchoring stays generic.
- Q10 remains: lightweight-bound revisit conditions should be answered last, after Q9 clarifies whether the follow-on helper and optional save payload still fit the no-skill-folder constraint.

## Next Focus

Iteration 9 should answer Q9: identify concrete risks in ADD-1 through ADD-6 and define mitigation strategies, including the Q8 decision that memory save integration must stay optional and routed through existing categories.
