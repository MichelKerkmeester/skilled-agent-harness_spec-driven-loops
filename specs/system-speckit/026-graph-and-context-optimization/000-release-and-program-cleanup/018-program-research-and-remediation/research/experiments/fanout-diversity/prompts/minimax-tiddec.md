## Task
Investigate five research questions about this repository's runtime subsystems and deliver an evidence-based research report as your final chat message.

## Instructions
1. Write a `<pre-plan>` block with 4–5 ordered steps (dense). Each step must include:
   - Input: what this step receives
   - Output: what this step produces
   - Acceptance criterion: the exact condition that proves this step is done
   - Verification: how you confirm it (for this read-only task: re-opening the cited files/locations)
   Suggested skeleton: (1) map each question to its owning implementation files via targeted search; (2) deep-read each implementation path and trace the named code paths; (3) enumerate discrete findings with file:line evidence per question; (4) adversarially re-check every finding against the code; (5) compose the report in the required output shape.
2. Then execute the plan, question by question.
3. End with a `## Verification` section attesting that you re-opened every Evidence citation and confirmed it supports the claim.

## Do's
- Stay strictly read-only: inspection and search commands only.
- Cite a real file path (and line where possible) for every finding.
- Enumerate ALL distinct findings separately — one discrete factual claim per numbered finding.
- Re-open every cited file:line and confirm it supports the claim before reporting it.
- Answer exactly the five questions asked — the question text is the full scope.
- Label any claim you cannot fully anchor [LOW] confidence.

## Don'ts
- Do not create, modify, or delete any file; do not run state-mutating commands (no git writes, installs, builds, daemon restarts).
- Do not read anything under `.opencode/specs/` (any spec packet) — if a search result points there, skip it; findings derived from it are void.
- Do not use memory MCP tools (memory_search, memory_context, memory_match_triggers, or similar) — investigate the code directly.
- Do not invent files, flags, line numbers, or behavior; mark uncertainty [LOW] instead.
- Do not merge multiple claims into one finding.
- Do not write your report to a file — the final chat message IS the deliverable.

## Examples
Output shape, per question:

### Q1: <one-line restatement>
- Findings:
  1. <one discrete factual claim>. Evidence: path/to/file.ts:123 [HIGH]
  2. <next discrete claim>. Evidence: path/to/other.cjs:45-60 [MEDIUM]
- Verdict: <1–3 sentences directly answering the question> [overall confidence]

## Context
- CWD: the repository root you were dispatched into — a monorepo hosting an AI assistant framework (MCP servers, skills, operator commands).
- Relevant subsystem areas:
  - `.opencode/skills/system-spec-kit/mcp_server/` — Spec Kit Memory MCP server (TypeScript): self-maintaining memory index, shared-daemon launcher, lease + IPC machinery under its `bin/` and `lib/` trees
  - `.opencode/skills/system-code-graph/` — structural code-graph MCP server
  - `.opencode/skills/system-skill-advisor/` — skill advisor MCP + skill-graph
  - Operator command + diagnostic surfaces (the `/doctor` family) live under `.opencode/` — discover the implementation yourself; it routes per-subsystem diagnostics
- The five questions:

Q1. Self-maintaining memory-index move-reconciliation (Spec Kit Memory MCP) under rapid concurrent spec-folder moves across sessions: is it correct, and what race exposure remains?

Q2. The shared-daemon lease model (Spec Kit Memory MCP launcher): what happens when the lease-holder launcher dies ungracefully — full failure analysis — and what is the re-election latency for secondary launchers?

Q3. Code-graph multi-file union queries: usage and value analysis of `unionMode:'multi'` and the `hotFileBreadcrumb` — are they actually used, and do they earn their complexity?

Q4. Skill-graph enhancement-edge propagation (skill advisor): does it measurably improve unprompted skill discovery? What does the mechanism actually do, and what evidence exists either way?

Q5. Doctor command coverage gaps: which subsystems lack a `/doctor` diagnostic target, and which failure modes therefore go undiagnosed?

- Acceptance criteria: every finding evidence-cited; all five questions answered with verdicts + confidence tags; zero content sourced from `.opencode/specs/` or memory tools; findings discrete and complete (enumerate ALL distinct findings you can support with concrete evidence).
