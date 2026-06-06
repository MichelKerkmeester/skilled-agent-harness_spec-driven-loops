# Iteration 004: RQ4 cross-cutting & governance — integration & impact

**Focus:** RQ4 cross-cutting & governance — integration & impact  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.72.  
**Raw output:** prompts/iteration-004.out

### IMPACT
| Existing surface (file:line) | Change (ADD/MODIFY/NONE) | What changes | Severity (LOW/MED/HIGH) | Backward-compat risk |
|---|---:|---|---:|---|
| `.claude/CLAUDE.md:3-5` | NONE | Workspace Claude file only enforces search routing; no Gates/Four Laws surface to update here. Governance source is `AGENTS.md`. | LOW | None. |
| `AGENTS.md:21-26` | NONE | Four Laws stay unchanged. Typed I/O and scoped gates are agent-contract refinements, not new universal hard blockers. | LOW | None unless made mandatory. |
| `AGENTS.md:189-223` | MODIFY | Add a small note that typed agent-I/O fields and P2 scoped gates are agent-local optional/advisory gates and do not replace Gate 1-4 or Gate 3. | LOW | Low if worded advisory; medium if framed as hard pre-tool gates. |
| `AGENTS.md:247-258` | NONE | Completion Verification remains strict spec validation + checklist evidence + metadata reconciliation. P3 `spec_drift` is only a recommendation signal. | LOW | None. |
| `AGENTS.md:322-357` | MODIFY | Add one pointer from agent routing/distributed governance to the shared optional agent-I/O contract; preserve `@debug` exclusive `debug-delegation.md` boundary. | LOW | Low. |
| `.opencode/agents/orchestrate.md:194-214` | MODIFY | Add optional `AGENT_IO_DISPATCH` header fields: `dispatch_id`, `agent`, typed `task_definition`, lean `context_snapshot`, read directives, and optional P2/P3 sections. | MED | Low if optional; high if old task format is rejected. |
| `.opencode/agents/orchestrate.md:292-303`, `.opencode/agents/orchestrate.md:440-452` | MODIFY | Let branch/output review consume `AGENT_IO_RESULT` when present while continuing to accept existing `output.confidence`, `output.status`, evidence, and quality checks. | MED | Medium if parser assumes all agents emit the new block. |
| `.opencode/agents/code.md:270-310` | MODIFY | Add optional result envelope mapping existing `RETURN: PASS/FAIL/BLOCKED`, confidence bands, and escalation classifiers into `status`, numeric confidence, and `failure_type`. | LOW | Low; current RETURN remains canonical. |
| `.opencode/agents/review.md:241-245` | MODIFY | Add optional `reviewer_focus`, `quality_score`, and envelope mapping for gate output. Keep P0/P1/P2 report format intact. | LOW | Low. |
| `.opencode/agents/context.md:230-284` | MODIFY | Document that `context_snapshot` is a lean dispatch adapter over the existing six-section Context Package, not a replacement. | LOW | Low if Context Package stays unchanged. |
| `.opencode/agents/debug.md:91-128` | MODIFY | Add optional typed handoff fields for cross-agent diagnosis: `root_cause`, `target_files`, `fix_recommendations`, `confidence`. Existing Debug Context Handoff remains valid. | LOW | Low. |
| `.opencode/skills/system-spec-kit/SKILL.md:80-92` | ADD | Add a new discovered reference doc under the workflows domain: `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`. | LOW | None; new reference only. |
| `.opencode/skills/system-spec-kit/shared/contracts/README.md:16-23`, `.opencode/skills/system-spec-kit/shared/contracts/README.md:75` | NONE | Do not put the agent prompt contract here; this folder is for typed retrieval-code contracts and warns to add fields only when all callers tolerate them. | LOW | Avoids runtime-code coupling. |
| `.opencode/skills/system-skill-advisor/SKILL.md:57-73` | NONE | Advisor routing still selects skills; typed agent I/O is downstream dispatch/output shape after routing. | LOW | None. |
| `.opencode/skills/system-skill-advisor/SKILL.md:278-295`, `.opencode/skills/system-skill-advisor/SKILL.md:303-315` | NONE | Stable advisor tool IDs and package rules are unaffected. Do not rename or add advisor tools for this contract. | LOW | None. |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:94-110`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:620-711` | NONE | `validate.sh` validates spec folders and rule scripts; it should not require agent envelope fields. | LOW | None if left untouched. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:610-759` | NONE | Spec-doc validation checks `_memory.continuity` required fields and size; optional P3 drift hints should not become required frontmatter fields. | LOW | Low; watch 2048-byte continuity budget if adding notes. |
| `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:46-69` | NONE | Completion checks checklist priority/evidence only; no agent-I/O validation needed. | LOW | None. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md:29-35` | NONE | Governing principle already says adapter/optional/advisory, preserving rich markdown. Treat this as the compatibility constraint. | LOW | None unless ignored. |

### INTEGRATION
1. Place the shared contract at `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`, not under `shared/contracts/`, because this is a human/agent workflow contract rather than a TypeScript retrieval-runtime contract.

2. Use one versioned adjunct schema with grouped optional sections: `schema_version`, `dispatch`, `result`, `handoff`, `pre_execution`, and `advisory`. Keep base P1 fields small: `dispatch_id`, `agent`, `task_definition`, `context_snapshot`, `status`, `confidence`, and `failure_type`.

3. Let P2 coexist by scoping fields to narrow conditions: `handoff` only for debug-to-implement transfer, `boundary_contract` only for API/schema/integration changes, and `pre_mortem` only for medium/high complexity.

4. Let P3 coexist as `advisory`: `reviewer_focus`, `quality_score`, `spec_drift`, `update_recommended`, and optional `target_docs`. These fields guide review and continuity; they do not mutate specs automatically.

5. Update governance lightly: `AGENTS.md` should mention the optional shared contract in Gate/Agent Routing language, but Four Laws, Gate 3, Logic-Sync, and Completion Verification remain authoritative and unchanged.

6. Update agent docs additively: `@orchestrate` emits/reads optional envelope blocks; `@code`, `@review`, `@context`, and `@debug` document how their current structured markdown maps into the envelope. Missing envelope means old behavior.

7. Leave `system-skill-advisor` core untouched. If discoverability is desired, add trigger phrases/source-doc pointers to `system-spec-kit` metadata or the new contract doc, not new advisor tool IDs or scorer behavior.

8. Leave `validate.sh`, `check-completion.sh`, and `spec-doc-structure` untouched for enforcement. Validate the new contract doc with documentation validation only; add parser/golden tests only if an executable adapter is implemented.

9. Preserve backward compatibility by making every new field optional, accepting legacy prose contracts, and treating the rich markdown body as canonical evidence.

### BREAKS / WATCH-OUTS
- A breaking change occurs if `@orchestrate` rejects sub-agent output that lacks `AGENT_IO_RESULT`.

- A breaking change occurs if `validate.sh` or `check-completion.sh` starts requiring agent envelope fields from existing spec folders.

- A breaking change occurs if P2 scoped gates become universal pre-execution gates instead of narrow optional modes.

- Contract bloat risk is highest if P1/P2/P3 fields are flattened into top-level fields; group them by purpose.

- `spec_drift` must not bypass Logic-Sync or auto-edit spec docs.

- Debug handoff fields must not allow non-`@debug` agents to write `debug-delegation.md`.

- Do not put this prompt contract in `shared/contracts/` unless executable TypeScript adapters are added later.

### OPEN QUESTIONS
- Should `context_snapshot` remain one-shot per dispatch, or become an orchestrator-maintained progressive cache?

- Should `reviewer_focus` be free text, an array, or constrained to review rubric dimensions?

- Where should `spec_drift` be surfaced when no `/memory:save` or continuity update happens?

- Is an executable parser needed now, or is a documented fenced-block contract enough for the first packet?

### METRICS
newInfoRatio: 0.72
novelty: The main new cross-cutting finding is that governance and validators mostly stay untouched; the clean integration point is one optional workflow contract plus small agent-doc adapters.
status: complete
focus: RQ4 cross-cutting & governance — integration & impact
