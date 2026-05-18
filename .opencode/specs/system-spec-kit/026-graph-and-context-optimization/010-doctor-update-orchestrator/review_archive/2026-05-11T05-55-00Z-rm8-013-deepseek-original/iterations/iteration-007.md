# Iteration 7 — traceability overlay (skill_agent + agent_cross_runtime + playbook_capability)

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| 001-doctor-commands/spec.md:352 | skill_agent source | Commands: memory, causal-graph, deep-loop, cocoindex, update (5 new) |
| 001-doctor-commands/implementation-summary.md:309 | skill_agent + agent_cross_runtime | 34 files authored; no @agent creation mentioned |
| 002-sandbox-testing-playbook/spec.md:356 | playbook_capability | 23 scenarios, scope + SC-001 inconsistency |
| 002-sandbox-testing-playbook/decision-record.md:269 | playbook_capability | ADR-008: DOC-337 + DOC-343 intentionally gapped |
| .opencode/commands/doctor/*.md (10 files) | skill_agent | All 10 doctor command entrypoints exist |
| .opencode/skills/doctor-*/ (glob, 0 hits) | skill_agent | No doctor-* skill directories exist |
| .opencode/skills/system-spec-kit/SKILL.md | skill_agent | No doctor command ownership declaration |
| .opencode/agents/ (12 files) | agent_cross_runtime | 11 agents + README.txt |
| .claude/agents/ (12 files) | agent_cross_runtime | 11 agents + README.txt — mirror of .opencode |
| .codex/agents/ (12 files) | agent_cross_runtime | 11 agents + README.txt — TOML format mirror |
| .gemini/agents/ (12 files) | agent_cross_runtime | 11 agents + README.txt — mirror complete |
| README.md | agent_cross_runtime | Docs 11 agents with mirror policy; no @doctor entry |
| 23 playbook .md scenarios | playbook_capability | All scenarios exercise doc/cmd pairs |
| 23 scenario shell wrappers (.sh) | playbook_capability | 1:1 mapping to scenario .md files |
| resource-map.md (parent aggregate) | skill_agent | Confirms 5 new command .md + 5 new YAML on disk |

## Findings by Severity

### P1

#### R7-P1-001 [P1] Doctor commands lack skill_agent traceability mapping

- File: `.opencode/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md`
- Evidence: `glob .opencode/skills/doctor-*/SKILL.md` returns zero matches. None of the 5 doctor commands introduced by 013 (`/doctor:memory`, `/doctor:causal-graph`, `/doctor:deep-loop`, `/doctor:cocoindex`, `/doctor:update`) have a corresponding SKILL.md file under `.opencode/skills/doctor-*/`. The `system-spec-kit/SKILL.md` contains no explicit ownership declaration for `/doctor:*` commands. The 001 spec at spec.md:276-277 claims "NFR-R01: All 5 commands follow the canonical `/doctor:code-graph` shape" but even `/doctor:code-graph` has no skill mapping. The same gap exists for 5 pre-existing doctor commands (code-graph, skill-advisor, skill-budget, mcp_debug, mcp_install) but those are outside 013 scope.
- Finding class: class-of-bug
- Scope proof: `glob .opencode/skills/doctor-*/**/SKILL.md` and `glob .opencode/skills/*doctor*/SKILL.md` both return zero hits. `grep -r "doctor.*SKILL\|/doctor:.*owns" .opencode/skills/system-spec-kit/SKILL.md` returns zero matches. All 10 doctor commands (5 new + 5 pre-existing) are unowned by any skill SKILL.md.
- Affected surface hints: ["skill_agent traceability", "doctor commands", "system-spec-kit ownership"]
- Recommendation: Either (a) create `.opencode/skills/doctor-*/SKILL.md` stub files for the 5 new commands declaring system-spec-kit ownership, or (b) add an explicit `/doctor:*` ownership section to `system-spec-kit/SKILL.md` declaring that all doctor commands are owned by the system-spec-kit skill. The latter is preferred since doctor commands are part of the system-spec-kit command surface, not standalone skills.

### P2

#### R7-P2-001 [P2] No @doctor agent exists in any runtime directory

- File: `.opencode/agents/` (no @doctor definition)
- Evidence: All 4 runtime agent directories (.opencode, .claude, .codex, .gemini) contain identical agent sets (11 agents + README.txt). No `@doctor` agent exists in any directory. The repo `README.md:859` documents 11 agents with cross-runtime mirror policy. 013 did not introduce a `@doctor` agent. The 5 new doctor commands (34 files total) have no agent dispatch surface, making them inaccessible via the agent routing system (unlike `@code`, `@review`, `@debug`, etc.).
- Finding class: instance-only
- Scope proof: `glob .opencode/agents/@doctor*`, `.claude/agents/@doctor*`, `.codex/agents/@doctor*`, `.gemini/agents/@doctor*` all return zero hits.
- Affected surface hints: ["agent dispatch", "doctor command surface", "cross-runtime mirror"]
- Recommendation: Consider creating a `@doctor` agent stub in `.opencode/agents/` with mirroring to all 4 runtime directories + README.txt entries + root README.md update. This would enable `@doctor` dispatch for operator-initiated health checks and rebuilds. Defer to follow-on packet.

#### R7-P2-002 [P2] SC-001 in 002 spec claims 25 scenarios but only 23 exist

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md:193`
- Evidence: SC-001 reads "25 scenario .md files exist + each passes validate_document.py --type playbook_feature". However, the specification body (lines 3, 43, 99-100) correctly states 23 scenarios. ADR-008 in `decision-record.md` documents that DOC-337 and DOC-343 were intentionally dropped during mode-reduction, reducing 25 planned IDs to 23 active. The SC-001 count was never updated to reflect this reduction.
- Finding class: instance-only
- Scope proof: `ls .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/*.md | wc -l` returns 23. ADR-008 confirms intentional gaps.
- Affected surface hints: ["002 spec", "success criteria", "documentation consistency"]
- Recommendation: Update SC-001 from "25" to "23" and add a parenthetical "(2 IDs retired per ADR-008: DOC-337 + DOC-343)" for clarity.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | partial | 5 new doctor commands have no SKILL.md mapping or explicit system-spec-kit ownership declaration. Command files exist at `.opencode/commands/doctor/` but no skill-level traceability. |
| agent_cross_runtime | clean | No new @agent introduced by 013. All 4 runtime agent directories are in sync (11 agents + README.txt each). Root README.md correctly documents 11 agents with mirror policy. |
| playbook_capability | clean | All 23 scenarios exercise distinct capabilities of the 5 doctor commands. Zero dead scenarios. Each scenario tests a unique command, flag, operational state, or failure mode. 2 intentional gaps (DOC-337, DOC-343) documented in ADR-008. |

### Playbook Capability Matrix (23 scenarios → 5 commands)

| Command | Scenarios | Distinct Capabilities Exercised |
|---------|-----------|-------------------------------|
| `/doctor:memory` | DOC-323..327 (5) | bootstrap, drift detect, long-pole rebuild, SIGINT cancel, disk-pressure refusal |
| `/doctor:causal-graph` | DOC-328..330 (3) | low-coverage diagnostic, confidence-threshold apply, add-only mutation boundary |
| `/doctor:deep-loop` | DOC-331..333 (3) | lazy-init from folders, empty-graph diagnostic, convergence gold-battery |
| `/doctor:cocoindex` | DOC-334..336 (3) | healthy reindex, zombie restart, unreachable refusal |
| `/doctor:update` | DOC-338..342,344 (6) | G5 failure/rollback, G6 concurrent refusal, G7 SIGINT, G8 migration gap, G9 dashboard, tier-aware prompting |
| Version migration | DOC-345..347 (3) | two-hop 3.3→3.4.1, cleanup-legacy, same-version no-op |

## Verdict

**CONDITIONAL** — 1 open P1 (R7-P1-001: skill_agent mapping gap) blocks clean PASS. Agent cross-runtime mirroring is clean. Playbook capability is clean (23/23 scenarios distinct). Two P2 advisories (no @doctor agent, SC-001 count mismatch) are non-blocking.

## Next Dimension

Iteration 8 should focus on **maintainability** per the strategy plan: cross-runtime mirror consistency (already partially verified clean for agents), doc-code drift between spec and implementation, and resource-map accuracy. Key files: `resource-map.md` (parent + both children), `implementation-summary.md` (both children), `checklist.md` (both children), plus the actual command YAML assets for doc-code alignment checks.
