# Iteration 011 — Track 4: Agent Network Diagram Accuracy

## Summary

Verified the Agent Network section in README.md against actual agent definition files in `.opencode/agents/*.md`. Confirmed dispatch boundaries and orchestrate-only convention for @code per ADR-3.

## Findings

### Finding 1: Agent Naming Discrepancy (LOW)
- **Location**: README.md lines 944-949
- **Issue**: README lists "Create" agent, but actual file is `markdown.md`
- **Evidence**: 
  - README: "**Create** - Dedicated LEAF executor for the `/create:*` command family"
  - File system: `.opencode/agents/markdown.md` exists, no `create.md`
  - markdown.md line 3: "description: Template-first markdown/documentation executor; handles /create:* commands, spec docs, and scoped markdown authoring"
- **Impact**: Naming inconsistency only; functional description matches
- **Recommendation**: Rename README section from "Create" to "Markdown" for consistency

### Finding 2: Agent Count Match (VERIFIED)
- **Location**: README.md line 907
- **Claim**: "11 custom specialist agents"
- **Evidence**: 
  - README lists: Orchestrate, Code, Context, Review, Debug, Create, Prompt-Improver, Deep AI Council, Deep Research, Deep Review, Agent Improver (11 total)
  - File system contains: orchestrate.md, code.md, context.md, review.md, debug.md, markdown.md, prompt-improver.md, deep-ai-council.md, deep-research.md, deep-review.md, deep-agent-improvement.md (11 total)
- **Status**: ✅ Verified

### Finding 3: Orchestrate-Only Dispatch Convention for @code (VERIFIED)
- **Location**: README.md line 924
- **Claim**: "Dispatched ONLY by `@orchestrate` via convention-floor caller-restriction"
- **Evidence**: 
  - code.md lines 28-32: "⛔ **DISPATCH GATE (§0 caller-restriction, D3 convention-floor):** @code MUST be dispatched by @orchestrate. If invoked without an orchestrator-context marker... HALT and return: 'REFUSE: @code is orchestrator-only. Dispatch via @orchestrate. (D3 caller-restriction convention; see specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md ADR-3.)'"
  - orchestrate.md lines 98-100: Routing table shows @code at priority 6, dispatched by orchestrator
- **Status**: ✅ Verified - README description matches ADR-3 convention

### Finding 4: Dispatch Boundary Descriptions (VERIFIED)
Verified dispatch boundaries for all agents against their definition files:

| Agent | README Dispatch Boundary | Agent File Boundary | Match |
|-------|-------------------------|---------------------|-------|
| Orchestrate | "Senior task commander with full authority" | orchestrate.md: "THE SENIOR ORCHESTRATION AGENT with FULL AUTHORITY" | ✅ |
| Code | "Dispatched ONLY by @orchestrate" | code.md: "@code MUST be dispatched by @orchestrate" | ✅ |
| Context | "Memory-first retrieval specialist - always checks memory before codebase" | context.md: "The exclusive entry point for exploration tasks" | ✅ |
| Review | "Code quality guardian with strict read-only permissions" | review.md: "Read-only code review specialist" | ✅ |
| Debug | "Fresh-perspective debugger that receives structured context handoff" | debug.md: "User-invoked fresh-perspective debugging specialist" | ✅ |
| Create (markdown) | "Dedicated LEAF executor for the `/create:*` command family" | markdown.md: "handles `/create:*` commands, orchestrator-scoped spec-doc creation" | ✅ |
| Prompt-Improver | "Prompt-escalation specialist for high-stakes external CLI invocations" | prompt-improver.md: "Read-only prompt-engineering specialist for high-stakes external CLI prompt construction" | ✅ |
| Deep AI Council | "Multi-strategy planning architect dispatching diverse AI vantage points" | deep-ai-council.md: "Multi-AI Council is a scoped-write planning architect that seeks diverse AI vantage points" | ✅ |
| Deep Research | "Autonomous research agent executing single LEAF iterations" | deep-research.md: "Executes exactly ONE research iteration" | ✅ |
| Deep Review | "Autonomous code quality auditor using LEAF architecture" | deep-review.md: "Executes ONE review iteration within an autonomous review loop" | ✅ |
| Agent Improver | "Proposal-only mutator for bounded agent improvement experiments" | deep-agent-improvement.md: "Proposal-only mutator for bounded deep-agent-improvement experiments" | ✅ |

### Finding 5: Network Topology Representation (NOTE)
- **Location**: README.md lines 905-1001
- **Observation**: Agent Network section is prose-only, not a visual diagram with arrows/edges
- **Evidence**: No mermaid graphs, ASCII art, or visual topology found in the Agent Network section
- **Impact**: No visual arrows/edges to verify; dispatch relationships described textually
- **Status**: Textual dispatch boundaries verified; no visual diagram to check

## Conclusion

The README Agent Network section is functionally accurate with one naming discrepancy ("Create" vs "markdown"). All dispatch boundary descriptions match the actual agent definition files. The orchestrate-only dispatch convention for @code (ADR-3) is correctly documented in both the README and the code.md agent file. No visual network diagram with arrows/edges exists in the README to verify topology.

ITER_011_COMPLETE: 3 findings, newInfoRatio=0.15
