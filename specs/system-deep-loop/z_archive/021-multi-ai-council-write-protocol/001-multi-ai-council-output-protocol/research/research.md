# Deep Research Synthesis — Packet 080 Multi-AI Council Improvements

## 1. EXECUTIVE SUMMARY

The 10-iteration research loop converged on a clear answer: preserve ADR-001's lightweight bound for `@multi-ai-council`, and improve the convention through caller-owned persistence, shared schema documentation, fixture-tested helpers, and mirror parity checks.

Go on lightweight-bound preservation. Packet 081 should ship five tightly scoped improvements: helper script, short §17 caller protocol, shared `output-schema.md`, parser/validator fixtures, and four-runtime mirror parity. Packet 082+ should defer lifecycle-heavy work: state schema versioning beyond optional metadata, advisor regression guards, optional `/memory:save` payload anchoring, council-aware advisory checks, and any `/speckit:*` command wiring.

- Verdict: **GO** on preserving the lightweight bound.
- Packet 081 headline recommendation count: **5**.
- Packet 082+ headline recommendation count: **6**.
- Promotion to a dedicated skill: **NO-GO** unless lifecycle ownership, reducer-owned state, automatic routing, enforced validation, generated mirrors, or helper-controlled execution becomes necessary.

## 2. RESEARCH TOPIC

How to further improve the multi-ai-council agent (`.opencode/agents/multi-ai-council.md`) and the `ai-council/` output protocol convention introduced in packet 080. Reference deep-research and deep-review skill patterns as inspiration for iteration mechanics, convergence detection, state schema, resume semantics, and quality gates — BUT do NOT promote multi-ai-council into a dedicated skill folder unless the lightweight bound (ADR-001) provably fails.

Investigate three threads:

- (1) Concrete improvements landable in follow-on packet 081 / 082+ (helper script shape, §17 caller protocol, §8 shared schema artifact, validator hints, advisor wiring, state.jsonl forward-compat, mirror-sync automation).
- (2) Whether existing spec-kit integration is solid: agent body §12-§15, 4-runtime mirrors, validator regression test, references/multi-ai-council/, packet-080 ai-council/ smoke-test artifacts. Or whether gaps exist (validator awareness, advisor scoring, /speckit:* wiring, hook integration, council-aware /memory:save anchoring).
- (3) Risks the round-2 amendments (ADD-1..ADD-6) introduce and mitigations.

## 3. METHODOLOGY

- Method: iterative deep research synthesis from 10 independent `cli-codex` iteration narratives.
- Executor: `cli-codex`.
- Model: `gpt-5.5`.
- Reasoning effort: `high`.
- Service tier: `standard` in config and state; convergence appendix records `normal/standard` to match the prompt's mixed wording.
- Inputs read: all 10 iteration files, strategy, findings registry, state log, config, and round-2 amended council report.
- Evidence rule: findings below cite the iteration narratives and the primary files/sections those iterations inspected.
- Boundary: LEAF synthesis only; no sub-agents dispatched.
- No memory save performed; this synthesis leaves handoff routing to the orchestrator as requested.
- Reducer status: `findings-registry.json` was refreshed manually because the reducer was out of scope for this synthesis pass.

## 4. KEY QUESTIONS RESOLVED

| Question | One-line answer |
| --- | --- |
| Q1 | Use a Node CJS helper at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`, with exported parser/render functions, fixture tests, and exit codes 0/1/2. |
| Q2 | Add §17 to the agent body as the short normative caller protocol; put long examples and schema details in references. |
| Q3 | Create `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md` as the markdown source of truth for §8 output shape and parser requiredness. |
| Q4 | Keep `validate.sh --strict` free-form for `ai-council/`; use opt-in helper-owned advisory checks only after persistence exists. |
| Q5 | Do not add Skill Advisor boosts for `multi-ai-council` while it remains an agent; direct user/orchestrator dispatch is the clean boundary. |
| Q6 | Add test-time normalized mirror parity across `.opencode`, `.claude`, `.gemini`, and `.codex`; do not require byte-for-byte equality. |
| Q7 | Keep `ai-council-state.jsonl` additive and tolerant: bare `event` rows remain v1, optional `schema_version`/`protocol`/`producer` may appear in v1.1. |
| Q8 | Do not add `ANCHOR:council-report-{packet}` to `/memory:save`; use optional helper-emitted save payloads routed through existing categories. |
| Q9 | ADD-1 through ADD-6 are valid, but need caller-owned helper invocation, one schema source, forward-only scope, and helper-first sequencing. |
| Q10 | Revisit ADR-001 only when council needs skill-like lifecycle ownership, reducer state, enforced validation, generated mirrors, or automatic routing. |

Per strategy §6, all 10 questions are answered. Per iteration 10 §Questions Answered, no key questions remain.

## 5. CONSOLIDATED FINDINGS

### Helper Script

The helper should be a Node CJS script, not Bash. Iteration 1 found the helper is parser-heavy and needs exported parser/render functions plus fixture-driven tests, matching sibling reducer conventions without importing their lifecycle machinery.

Recommended path:

```text
.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs
```

Recommended CLI:

```bash
node .opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs \
  <packet-spec-folder> \
  [--round NNN] \
  [--input-file FILE] \
  [--strict-output]
```

The helper should:

- Read markdown from `--input-file` or stdin.
- Parse required sections from the shared output schema.
- Accept explicit per-seat sections or parseable `Council Composition` rows.
- Build all artifacts in memory before writing.
- Write `ai-council/council-report.md`.
- Write `ai-council/seats/round-NNN/seat-*.md`.
- Write `ai-council/deliberations/round-NNN.md`.
- Append `ai-council/ai-council-state.jsonl`.
- Emit `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, and `council_complete`.
- Exit 0 on successful artifact persistence.
- Exit 1 on invocation or parse failure before writes.
- Exit 2 only after partial writes.

Packet 081 should implement this first. Per iter 9 §Findings, landing docs before a real helper would create a contract callers cannot execute.

### §17 Placement

§17 belongs in the agent body. Iteration 2 found the agent body already owns operator-visible protocol sections: §12 Output Protocol, §13 Invocation Contract, §14 State Schema, and §15 Convergence Signal. A caller loading the agent body must see the persistence responsibility without chasing references.

The body section should stay short:

- The council remains planning-only.
- The caller or dispatching parent owns persistence.
- Four caller patterns are enumerated.
- The helper invocation is shown once.
- Exit-code handling is summarized.
- Long recipes point to references.

Reference-only placement was ruled out because ADR-001 keeps the agent body plus references as the lightweight source of truth. A long body-only section was also ruled out because ADR-001 already says body growth should spill details to references before becoming a skill.

### Output-Schema Artifact

The schema should be markdown, not JSON Schema. Iteration 3 found the council report is a markdown contract with headings, tables, and prose blocks; a JSON Schema would either miss the real contract or become a brittle markdown-AST proxy.

Recommended path:

```text
.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md
```

The artifact should define:

- Required top-level report heading pattern.
- Strict-required parse anchors.
- Optional known anchors.
- Accepted seat section formats.
- Composition-table fallback rules.
- Missing-required behavior.
- Missing-optional behavior.
- Schema-change lockstep rule.

Strict-required anchors:

- `Council Composition`
- Per-seat sections or compatible composition rows
- `Recommended Plan`