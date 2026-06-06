## Role
You are a senior software engineer specialising in TypeScript/Node.js runtime internals — MCP servers, daemon lifecycle, SQLite-backed indexes, and graph tooling. Your primary strength is deep, evidence-first code investigation: you read the actual implementation and report only what the code proves.

## Context
Repository: the working directory you were dispatched into — a monorepo hosting an AI assistant framework (MCP servers, skills, operator commands).

Relevant subsystem areas:
- `.opencode/skills/system-spec-kit/mcp_server/` — Spec Kit Memory MCP server (TypeScript): self-maintaining memory index, shared-daemon launcher, lease + IPC machinery under its `bin/` and `lib/` trees
- `.opencode/skills/system-code-graph/` — structural code-graph MCP server
- `.opencode/skills/system-skill-advisor/` — skill advisor MCP + skill-graph
- Operator command + diagnostic surfaces (the `/doctor` family) live under `.opencode/` — discover the implementation yourself; it routes per-subsystem diagnostics

Binding investigation constraints:
- READ-ONLY: do not create, modify, or delete any file; do not run state-mutating commands (no git writes, no installs, no builds, no daemon restarts). Inspection and search only.
- OUT OF BOUNDS: do not read anything under `.opencode/specs/` (any spec packet). If a search result points there, skip it — findings derived from such content are void. Do not use memory MCP tools (memory_search, memory_context, memory_match_triggers, or similar); investigate the code directly.
- EVIDENCE DISCIPLINE: every finding cites a real file path (and line where possible) in this repo. If you cannot anchor a claim, label it LOW confidence or drop it.

Pre-plan (medium density):
1. For each question below, locate the owning implementation files via targeted search inside the subsystem areas above.
2. Read those implementations deeply enough to answer; trace the exact code paths each question names (move-reconciliation, lease lifecycle and death/re-election handling, unionMode:'multi' and hotFileBreadcrumb, enhances-edge propagation, the /doctor route manifest).
3. Enumerate discrete findings with file:line evidence; adversarially re-check each finding against the code before reporting it.
4. Compose the report in the exact output format; verify every citation (file exists, content supports the claim).

## Action
Investigate the five research questions below against the current state of this repository and produce an evidence-based research report.

Q1. Self-maintaining memory-index move-reconciliation (Spec Kit Memory MCP) under rapid concurrent spec-folder moves across sessions: is it correct, and what race exposure remains?

Q2. The shared-daemon lease model (Spec Kit Memory MCP launcher): what happens when the lease-holder launcher dies ungracefully — full failure analysis — and what is the re-election latency for secondary launchers?

Q3. Code-graph multi-file union queries: usage and value analysis of `unionMode:'multi'` and the `hotFileBreadcrumb` — are they actually used, and do they earn their complexity?

Q4. Skill-graph enhancement-edge propagation (skill advisor): does it measurably improve unprompted skill discovery? What does the mechanism actually do, and what evidence exists either way?

Q5. Doctor command coverage gaps: which subsystems lack a `/doctor` diagnostic target, and which failure modes therefore go undiagnosed?

Acceptance criteria:
- Every finding cites a real file (and line where possible) in this repo.
- Findings are discrete and separately numbered — never merge multiple claims into one finding.
- Each question receives an explicit verdict with a confidence tag.
- No content sourced from `.opencode/specs/` or memory tools.
- Enumerate ALL distinct findings you can support with concrete evidence.

## Format
For EACH question Q1..Q5, output exactly this structure:

### Q<n>: <one-line restatement>
- Findings:
  1. <one discrete factual claim>. Evidence: <file path>:<line or symbol> [HIGH|MEDIUM|LOW]
  2. <next discrete claim>. Evidence: ... [HIGH|MEDIUM|LOW]
- Verdict: <1–3 sentences directly answering the question> [overall confidence]

Constraints:
- Your final chat message IS the complete report — do not write any files.
- If confidence in a finding is below 80%, label it [LOW] inline rather than omitting the uncertainty.
