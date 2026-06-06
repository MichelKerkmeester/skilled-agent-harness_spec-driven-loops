## Context
You are dispatched into the root of a monorepo hosting an AI assistant framework (MCP servers, skills, operator commands). Relevant subsystem areas: `.opencode/skills/system-spec-kit/mcp_server/` (Spec Kit Memory MCP server, TypeScript — self-maintaining memory index, shared-daemon launcher, lease + IPC machinery under its `bin/` and `lib/` trees); `.opencode/skills/system-code-graph/` (structural code-graph MCP server); `.opencode/skills/system-skill-advisor/` (skill advisor MCP + skill-graph); operator command + diagnostic surfaces (the `/doctor` family) live under `.opencode/` — discover the implementation yourself; it routes per-subsystem diagnostics.

Binding constraints: READ-ONLY — do not create, modify, or delete any file; no state-mutating commands (no git writes, installs, builds, daemon restarts); inspection and search only. OUT OF BOUNDS — do not read anything under `.opencode/specs/` (any spec packet); if a search result points there, skip it — findings derived from it are void; do not use memory MCP tools (memory_search, memory_context, memory_match_triggers, or similar). EVIDENCE — every finding cites a real file path (and line where possible); unanchorable claims are labelled [LOW] or dropped.

## Objective
Answer the five research questions below about this repository's current code, as an evidence-based research report delivered entirely in your final chat message.

Q1. Self-maintaining memory-index move-reconciliation (Spec Kit Memory MCP) under rapid concurrent spec-folder moves across sessions: is it correct, and what race exposure remains?

Q2. The shared-daemon lease model (Spec Kit Memory MCP launcher): what happens when the lease-holder launcher dies ungracefully — full failure analysis — and what is the re-election latency for secondary launchers?

Q3. Code-graph multi-file union queries: usage and value analysis of `unionMode:'multi'` and the `hotFileBreadcrumb` — are they actually used, and do they earn their complexity?

Q4. Skill-graph enhancement-edge propagation (skill advisor): does it measurably improve unprompted skill discovery? What does the mechanism actually do, and what evidence exists either way?

Q5. Doctor command coverage gaps: which subsystems lack a `/doctor` diagnostic target, and which failure modes therefore go undiagnosed?

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — your output will be parsed directly; prose wrapping beyond the required structure is harmful

## Response
For EACH question Q1..Q5, exactly this structure — nothing before the first `### Q1` heading, nothing after the final verdict:

### Q<n>: <one-line restatement>
- Findings:
  1. <one discrete factual claim>. Evidence: <file path>:<line or symbol> [HIGH|MEDIUM|LOW]
  2. <next discrete claim>. Evidence: ... [HIGH|MEDIUM|LOW]
- Verdict: <1–3 sentences directly answering the question> [overall confidence]

Enumerate ALL distinct findings you can support with concrete evidence — one discrete claim per numbered finding, never merged. Do not write any files; the final chat message is the deliverable.

---
Pre-plan (lean):
1. Locate the owning implementation for each question via targeted search → per-question file list; acceptance: every question maps to ≥1 real implementation file.
2. Deep-read those paths, trace the named code paths (move-reconciliation, lease lifecycle, unionMode/hotFileBreadcrumb, enhances-edge propagation, /doctor routing), and enumerate discrete findings with file:line evidence → all five questions answered.
3. Verify: re-open each cited location and confirm it supports the claim → drop or downgrade anything that fails.
