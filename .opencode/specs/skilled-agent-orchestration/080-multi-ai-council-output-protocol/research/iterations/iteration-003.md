# Iteration 3: Q3 output-schema artifact

## Focus

Answer Q3: define the shared schema artifact for `.opencode/agents/multi-ai-council.md` §8 OUTPUT FORMAT, including format, location, and relationship to the future persistence helper's parser tests.

This question depends on iteration 2's answer: §17 should live in the agent body as the normative caller protocol, while longer details can spill to references. Q3 applies the same split to output shape.

## Actions Taken

- Read the current deep-research strategy, state log, findings registry, and latest iteration narrative to confirm iteration 3 and avoid repeating Q1/Q2.
- Inspected `.opencode/agents/multi-ai-council.md` §8 and §12-§15 to compare the chat report template with the packet artifact contract.
- Inspected the existing `.opencode/skills/system-spec-kit/references/multi-ai-council/*.md` files to match reference-document style and cross-reference conventions.
- Inspected packet 080's `ai-council/council-report.md` round-2 ADD-3 and ADD-2 requirements for strict-required versus optional output sections.
- Compared sibling reducer/test conventions in deep-research, deep-review, and `scripts/tests` to decide whether schema data belongs in markdown, JSON schema, or fixtures.

## Findings

### 1. The canonical artifact should be markdown, not JSON Schema

The current §8 template is a markdown report contract, not a machine JSON payload. The agent body defines the report as markdown at `.opencode/agents/multi-ai-council.md:393` through `.opencode/agents/multi-ai-council.md:463`, with sections such as `Task Classification`, `Council Composition`, `Strategy Comparison`, `Deliberation Notes`, `Recommended Plan`, `Plan Confidence`, `Dropped Alternatives`, `Risks & Mitigations`, and `Planning-Only Boundary`.

A JSON Schema would be the wrong primary source of truth for that surface because the parser will consume headings, tables, and prose blocks. It can validate derived metadata later, but it cannot express the useful parts of the report without becoming a brittle markdown-AST schema. The stronger fit is `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`.

### 2. The schema artifact should be the single normative contract for section names and requiredness

Round-2 ADD-3 explicitly asks for `output-schema.md` or a JSON-schema fixture as the single source of truth, and says both the agent body's §8 prose and the helper parser must reference it at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:151` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:154`.

ADD-2 already defines the strict parser boundary: strict-required sections are `Council Composition`, per-seat sections, `Recommended Plan`, and `Plan Confidence`; optional sections include `Cross-References`, `Dropped Alternatives`, `Deliberation Notes` details, and `Risks & Mitigations` details at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:140` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:149`.

The artifact should therefore define:

- Required top-level report heading pattern: `## Multi-AI Council Report: <task summary>`.
- Required parse anchors: `Council Composition`, at least one per-seat section or a compatible composition row set, `Recommended Plan`, and `Plan Confidence`.
- Optional-but-known anchors: `Task Classification`, `Strategy Comparison`, `Deliberation Notes`, `Winning Strategy`, `Implementation Steps`, `Prerequisites`, `Dropped Alternatives`, `Risks & Mitigations`, `Planning-Only Boundary`, and `Cross-References`.
- Degradation rule: missing required anchors is exit code 1; missing optional anchors is not fatal.
- Change rule: modifying section names or requiredness requires updating §8, the helper parser, and parser fixtures in the same packet.

### 3. Keep fixtures under tests; do not make fixture JSON the schema authority

The repository already keeps reference docs as short markdown contracts under `.opencode/skills/system-spec-kit/references/multi-ai-council/`. For example, `folder-layout.md` defines the artifact tree and cross-references the agent body and ADRs at `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md:1` through `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md:38`. `state-format.md` does the same for event types and validation policy at `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:1` through `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:68`.

Tests and fixtures belong with executable behavior. Existing system-spec-kit tests use `scripts/tests/fixtures/` for many behavior fixtures, while the packet 080 validator regression lives at `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts:1` through `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts:38`.

So packet 081 should add a parser fixture only when implementing the helper:

- `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/sample-report.md`
- Optional derived expectations file, e.g. `sample-report.expected.json`
- A vitest file near the helper, e.g. `multi-ai-council-persist-artifacts.vitest.ts`

Those fixtures test the helper against the markdown contract. They should not replace the contract.

### 4. The agent body should shrink §8 slightly and point to the artifact

ADR-001 says all logic stays in the agent body plus references, and if the body crosses roughly 750 LOC, detail should spill to references rather than becoming a skill folder at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:45` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:74`.

The current agent body is already 683+ LOC and §8 is a long embedded template. Packet 081 should keep §8 as a short operator-visible outline, then add: `Reference: .opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`. The full requiredness matrix and parser degradation contract should live in the reference file.

This preserves the "agent body is the source of truth" consequence by keeping the mandatory pointer in §8, while preventing the body from becoming the schema manual.

### 5. Parser implementation should use markdown heading extraction, not a general schema validator

The sibling reducers use small markdown and JSONL parsers rather than broad schema frameworks. Deep-research's reducer reads UTF-8 files, parses JSONL line-by-line, and extracts sections by heading names at `.opencode/skills/deep-research/scripts/reduce-state.cjs:20` through `.opencode/skills/deep-research/scripts/reduce-state.cjs:31` and `.opencode/skills/deep-research/scripts/reduce-state.cjs:147` through `.opencode/skills/deep-research/scripts/reduce-state.cjs:199`. Deep-review follows the same pattern at `.opencode/skills/deep-review/scripts/reduce-state.cjs:29` through `.opencode/skills/deep-review/scripts/reduce-state.cjs:40` and `.opencode/skills/deep-review/scripts/reduce-state.cjs:173` onward.

That pattern supports a simple `parseCouncilReport(markdown)` helper with exported parser functions and fixture tests. It should normalize `##`/`###` heading depth if needed, accept optional sections, and fail only when strict-required anchors are absent.

## Questions Answered

- Q3 answered: express the §8 shared schema as `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`, a markdown contract with a requiredness matrix, heading aliases if needed, parser degradation rules, and cross-references. Use parser fixtures under `scripts/tests/fixtures/multi-ai-council/` only as executable examples for the helper, not as the schema authority.

## Questions Remaining

- Q4 remains: the validator currently has only free-form `ai-council/` regression coverage, so it still needs a decision on hints versus recommended-file checks versus continued non-awareness.
- Q5 remains: skill advisor trigger scoring has not been inspected.
- Q6 remains: four-runtime mirror-sync automation still needs investigation, especially if §8 and §17 change the mirrored agent body.
- Q7 remains: state.jsonl forward-compat policy is separate from the markdown report schema.

## Next Focus

Iteration 4 should answer Q4: decide whether the validator should stay free-form for `ai-council/`, add non-blocking hints for missing `council-report.md`, or enforce recommended files only under explicit council-aware validation.
