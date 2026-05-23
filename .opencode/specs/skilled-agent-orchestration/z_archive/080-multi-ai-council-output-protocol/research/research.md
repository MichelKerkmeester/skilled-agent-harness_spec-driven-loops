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
- `Plan Confidence`

Optional known anchors:

- `Task Classification`
- `Strategy Comparison`
- `Deliberation Notes`
- `Winning Strategy`
- `Implementation Steps`
- `Prerequisites`
- `Dropped Alternatives`
- `Risks & Mitigations`
- `Planning-Only Boundary`
- `Cross-References`

Fixtures should test the helper against this markdown contract. They should not become the schema authority.

### Validator Policy

The base validator should remain free-form for `ai-council/`. Iteration 4 found ADR-004 explicitly rejects strict enforcement of `ai-council/council-report.md`, because council runs can be partial or in-flight.

The important subtlety is strict mode. The validator has warning channels, but strict validation treats warnings as failure. So a "non-blocking hint" inside `validate.sh --strict` would become blocking in the normal completion gate.

Packet 081 should therefore:

- Keep `validate.sh --strict` unchanged for generic spec validation.
- Harden the existing `multi-ai-council-validator.vitest.ts` so partial synthetic `ai-council/` layouts pass strict validation.
- Add a helper-owned advisory check only after `persist-artifacts.cjs` exists.
- Support an opt-in `--expect-complete` mode later if callers know the council should have finished.

### Advisor Routing

Do not add Skill Advisor boosts for `multi-ai-council` now. Iteration 5 found the advisor discovers skills, not agents, and direct advisor execution against a clear council prompt returned no recommendation.

This is the correct behavior under ADR-001. `multi-ai-council` is an agent with explicit dispatch through the user or `@orchestrate`, not a skill-owned command. Adding advisor boosts would make the advisor recommend a pseudo-skill or over-route to `system-spec-kit` for planning-agent use.

Packet 082+ may add a regression guard if advisor code changes:

- Council-only planning prompts should abstain from skill recommendations.
- Helper implementation prompts should still route to `sk-code` / `system-spec-kit`.
- Deep research prompts about the council should still route to `deep-research`.

### Mirror-Sync

Four-runtime mirror-sync should be checked by normalized contract parity, not byte equality. Iteration 6 found the runtime mirrors differ legitimately: Gemini strips unsupported frontmatter, and Codex wraps the body in TOML `developer_instructions`.

Packet 081 should add either:

- A small general agent mirror checker parameterized by agent name, or
- A narrow `multi-ai-council-mirror-parity.vitest.ts` fallback.

Minimum markers:

- `## 0. ILLEGAL NESTING (HARD BLOCK)`
- `## 12. OUTPUT PROTOCOL - AI-COUNCIL ARTIFACTS`
- `## 13. INVOCATION CONTRACT - FIRST-CALL VS SUBSEQUENT VS RESUME`
- `## 14. STATE SCHEMA - JSONL EVENT TYPES`
- `## 15. CONVERGENCE SIGNAL - 2/3 AGREEMENT RULE`
- `ai-council-state.jsonl`
- `Reference: .opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`

Commit hooks are not needed for v1.1. Test-time enforcement is enough.

### State Forward-Compatibility

Council state should stay additive and tolerant. Iteration 7 found packet 080's real `ai-council-state.jsonl` uses bare `{"event":...}` rows, and the current agent/reference contract documents that shape.

v1.1 should allow optional metadata:

```ts
type CouncilStateEnvelope = {
  event: "round_start" | "seat_returned" | "deliberation_synthesized" | "round_end" | "council_complete" | string;
  schema_version?: "1.0" | "1.1";
  protocol?: "multi-ai-council";
  producer?: string;
};
```

Rules:

- Missing `schema_version` means v1.
- Missing `type` remains valid.
- Unknown keys are ignored.
- New event types must be skippable.
- Existing event names keep their meaning.
- Required field additions to existing events wait for a named v2.
- Packet 080 logs are not migrated.

This belongs in packet 082+ unless packet 081's helper needs the optional metadata immediately.

### /memory:save Anchoring

Do not add a `council-report` anchor family. Iteration 8 found `/memory:save` and `generate-context` route content into existing categories, not dynamic artifact-specific anchors.

Recommended integration:

- Treat `council_complete` as evidence.
- Let the helper optionally emit a compact save payload.
- Let the caller decide whether to run `/memory:save` or `generate-context`.
- Store pointer, round, convergence, recommendation, and next action.
- Do not embed full council reports in `_memory.continuity`.

This keeps artifact persistence and memory continuity separate. Helper success should mean artifacts persisted, not memory written.

### ADD Risks

Iteration 9 validated the round-2 ADDs but tightened their boundaries:

- ADD-1 risk: four caller recipes drift. Mitigation: one short §17 contract plus reference examples.
- ADD-2/ADD-3 risk: parser, agent body, and schema split-brain. Mitigation: one output-schema artifact.
- ADD-4 risk: helper wording makes LEAF seem write-capable. Mitigation: parent/caller owns invocation.
- ADD-5 risk: old packets get treated as validation debt. Mitigation: forward-only, no backfill.
- ADD-6 risk: docs land before helper. Mitigation: helper and fixtures first.
- Memory-save risk: hidden writes. Mitigation: optional downstream payload only.

### Lightweight-Bound Conditions

Iteration 10 answered the user's explicit go/no-go. Current growth still fits the lightweight model. ADR-001 should be revisited only when behavior crosses from instructions/support scripts into lifecycle ownership.

Non-triggers:

- Standalone persistence helper.
- Fixture tests.
- `output-schema.md`.
- Short §17 caller protocol.
- Manual invocation recipes.
- Optional memory-save payloads.
- Reference-file expansion.
- Mirror parity tests.

Triggers:

- Command-owned lifecycle.
- Reducer-owned state.
- Schema migrations or fail-closed state parsing.
- Automatic advisor/hook routing.
- Enforced `ai-council/` layout validation.
- Generated runtime mirrors from templates.
- Helper-controlled execution, seats, rounds, or convergence.

## 6. SEVERITY-RATED IMPROVEMENT ROADMAP

| Severity | Item | Target | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| P0 | Implement `persist-artifacts.cjs` before documenting executable caller recipes. | 081 | Without a real helper, §17 would describe a non-existent contract. | Iter 1 §Findings; iter 9 §Findings ADD-6. |
| P0 | Create `output-schema.md` and point §8/helper parser at it. | 081 | Prevent split-brain between agent body, helper parser, and tests. | Iter 3 §Findings; iter 9 §Findings ADD-2/ADD-3. |
| P0 | Preserve planning-only boundary in §17: parent/caller invokes helper. | 081 | Prevent LEAF write ambiguity. | Iter 2 §Findings; iter 9 §Findings ADD-4. |
| P1 | Add fixture coverage for full, minimal, and missing-required council output. | 081 | Locks graceful degradation and exit-code behavior. | Iter 1 §Fixture-Test Layout; iter 3 §Findings. |
| P1 | Harden `ai-council/` validator regression without adding strict enforcement. | 081 | Protect ADR-004 while making the current test meaningful. | Iter 4 §Findings. |
| P1 | Add normalized four-runtime mirror parity test. | 081 | Catches drift after §8/§17 edits across runtimes. | Iter 6 §Findings. |
| P1 | Add optional helper-emitted save payload shape. | 082+ | Useful for continuity, but should not be part of artifact success. | Iter 8 §Findings. |
| P2 | Add advisor abstention/regression fixture if advisor code changes. | 082+ | Avoid accidental pseudo-skill routing. | Iter 5 §Findings. |
| P2 | Add council-aware advisory checker with `--expect-complete`. | 082+ | Helpful once helper output exists; unsafe in base strict validator. | Iter 4 §Findings. |
| P2 | Formalize state v1.1 optional metadata. | 082+ | Good forward compatibility, not required to ship the helper. | Iter 7 §Findings. |
| P2 | Wire `/speckit:*` YAML invocations. | 082+ | Convenience only; manual invocation must work first. | Council ADD-6; iter 9 §Findings. |

## 7. CONCRETE PACKET 081 SCOPE

Packet 081 should be a helper/schema/protocol/test packet. It should not modify packet 080's `spec.md`, and it should not add a dedicated skill folder.

1. Add the persistence helper:
   - Path: `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`
   - Exports: parser, renderer, artifact builder, state-line renderer.
   - CLI: `<packet-spec-folder> [--round NNN] [--input-file FILE] [--strict-output]`.
   - Exit codes: 0 success, 1 pre-write parse/invocation failure, 2 partial-write recovery.

2. Add parser fixtures:
   - `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-full.md`
   - `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-minimal.md`
   - `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-missing-required.md`

3. Add helper tests:
   - Path: `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts`
   - Assertions:
     - Full output writes report, seats, deliberation, and state JSONL.
     - Minimal output accepts composition-row fallback.
     - Missing-required output exits 1 before writes.
     - Parser exports report missing strict sections without touching filesystem.

4. Add shared schema artifact:
   - Path: `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`
   - Contents:
     - Requiredness matrix.
     - Heading aliases if needed.
     - Seat-section fallback contract.
     - Optional-section policy.
     - Schema-change lockstep rule.

5. Update agent body §8 and add §17:
   - Canonical: `.opencode/agents/multi-ai-council.md`
   - Mirrors:
     - `.claude/agents/multi-ai-council.md`
     - `.gemini/agents/multi-ai-council.md`
     - `.codex/agents/multi-ai-council.toml`
   - §8 should reference `output-schema.md`.
   - §17 should enumerate top-level Task dispatch, `@orchestrate` Depth 1 dispatch, future `/speckit:*` command YAMLs, and CLI-skill manual dispatch.
   - §17 must explicitly say the dispatching parent/caller invokes the helper after the LEAF returns.
   - §17 must state forward-only scope and no retroactive migration.

6. Harden validator regression:
   - Path: `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts`
   - Replace weak filesystem-only partial-layout coverage with a synthetic valid spec folder that runs `validate.sh --strict`.
   - Assert arbitrary `ai-council/` internals do not fail strict validation.

7. Add mirror parity:
   - Preferred: general checker under `.opencode/skills/system-spec-kit/scripts/` with a council fixture.
   - Fallback: `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-mirror-parity.vitest.ts`.
   - Compare normalized contract markers, not full file bytes.

8. Run focused verification:
   - `vitest` helper test.
   - Existing council validator test.
   - New mirror parity test.
   - `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-081-folder> --strict`.

## 8. PACKET 082+ DEFERRED ITEMS

These are useful but should not block packet 081.

- State schema v1.1 polish:
  - Document optional `schema_version`, `protocol`, and `producer`.
  - Preserve bare `event` rows.
  - Add tolerant reader notes if/when advisory tooling reads logs.

- Advisor regression guard:
  - Add only if advisor routing code changes.
  - Ensure council planning prompts do not become skill recommendations.
  - Ensure helper implementation prompts still route to implementation skills.

- Optional `/memory:save` payload:
  - Let helper print or write a compact JSON payload.
  - Route through existing categories.
  - Do not add `ANCHOR:council-report-{packet}`.

- Council-aware advisory check:
  - Add `check-artifacts.cjs` or a helper subcommand after persistence exists.
  - Default mode exits 0 with advisory output.
  - `--expect-complete` can fail when `council-report.md` is missing after known completion.

- `/speckit:*` command YAML wiring:
  - Convenience only.
  - Top-level, orchestrator, and CLI manual invocation must remain standalone.

- Path-scoped self-persistence investigation:
  - Deferred v1.2+ only.
  - Requires verified enforceable write scope and explicit user approval to reword the §0 invariant.

## 9. RISKS & MITIGATIONS

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Orchestrators bypass helper and artifact layouts drift. | Medium | §17 caller protocol, standalone helper, fixture tests, later opt-in advisory check. |
| Four caller recipes diverge. | Medium | Keep §17 short and normative; put long examples in references with shared verbs. |
| §8 evolves and breaks parser. | Medium | `output-schema.md` as single source, parser fixtures, lockstep update rule. |
| Helper implies LEAF write permission. | Medium | §17 says parent/caller invokes helper after council returns. |
| Strict validator warnings become failures. | Medium | Keep base `validate.sh --strict` free-form; move completion checks outside base validator. |
| Mirror drift after agent-body edits. | Medium | Add normalized contract parity across four runtime mirrors. |
| Partial packet 081 lands docs without helper. | Medium | Implement helper and tests first. |
| Old packets get treated as migration debt. | Low | State forward-only convention; no backfill. |
| Helper grows into hidden execution engine. | Medium | Keep it markdown-to-artifacts only; no seat dispatch, no convergence computation. |
| Memory save causes hidden writes. | Medium | Save payload optional; caller-owned; existing categories only. |
| Advisor starts recommending council as a skill. | Low | No boosts now; regression guard only if advisor code changes. |

## 10. RULED-OUT DIRECTIONS

- Dedicated `.opencode/skills/multi-ai-council/` folder for packet 081.
- JSON Schema as the primary §8 contract.
- Reference-only §17 with no agent-body caller protocol.
- Full body-only §17 playbook that pushes details into the mirrored agent body.
- `validate.sh --strict` enforcing `ai-council/council-report.md`.
- Ordinary validator warnings for missing council artifacts under strict mode.
- Skill Advisor token/phrase boosts for `multi-ai-council`.
- Byte-for-byte mirror equality across runtime wrappers.
- Required `type` discriminator for existing council state rows.
- Rewriting packet 080 state logs to add `schema_version`.
- New `/memory:save` anchor family for council reports.
- Automatic memory save on `council_complete`.
- Retroactive migration/backfill of pre-080 council outputs.
- Path-scoped self-persistence as a v1.1 default.
- `/speckit:council` command.
- Convergence math beyond the existing 2/3 agreement rule.

## 11. EVIDENCE TRAIL

<!-- ANCHOR:evidence-trail -->
| Question | Primary iteration | Key file/line/section cited |
| --- | --- | --- |
| Q1 helper shape | `iteration-001.md` | Deep reducer conventions; `deep-research/scripts/reduce-state.cjs`; `deep-review/scripts/reduce-state.cjs`; packet 080 `ai-council/council-report.md`; existing `multi-ai-council-validator.vitest.ts`. |
| Q2 §17 placement | `iteration-002.md` | `.opencode/agents/multi-ai-council.md` §12-§15; `decision-record.md` ADR-001 lines 57 and 71 as cited by iter 2; `council-report.md` lines 74-80 and 131-139 as cited by iter 2. |
| Q3 output schema | `iteration-003.md` | `.opencode/agents/multi-ai-council.md` §8 lines 393-463 as cited by iter 3; `council-report.md` lines 140-154; `references/multi-ai-council/folder-layout.md`; `state-format.md`. |
| Q4 validator policy | `iteration-004.md` | `decision-record.md` ADR-004 lines 171 and 177 as cited by iter 4; `multi-ai-council-validator.vitest.ts`; `validate.sh` warning/strict behavior; validation orchestrator strict summary. |
| Q5 advisor routing | `iteration-005.md` | Skill Advisor runtime discovery in `skill_advisor_runtime.py` lines 153 and 191 as cited by iter 5; explicit scorer boosts; `.opencode/agents/orchestrate.md` line 97. |
| Q6 mirror sync | `iteration-006.md` | Four mirror files; `.codex/agents/README.txt` lines 8 and 21; `deep-research-contract-parity.vitest.ts` lines 35-40 and 59-72 as cited by iter 6. |
| Q7 state compat | `iteration-007.md` | `.opencode/agents/multi-ai-council.md` lines 621-637 as cited by iter 7; `state-format.md` lines 7-43 and 60; packet 080 `ai-council-state.jsonl` lines 1 and 14. |
| Q8 memory save | `iteration-008.md` | `.opencode/commands/memory/save.md` lines 90-103; `content-router.ts` lines 1062-1085 and 1280-1298; `generate-context.ts` lines 89-144; thin continuity writer lines 778-915 as cited by iter 8. |
| Q9 ADD risks | `iteration-009.md` | `council-report.md` ADD-1 through ADD-6; `.opencode/agents/orchestrate.md` lines 97, 111-121, 748-749; ADR-003 and ADR-004 sections. |
| Q10 lightweight bound | `iteration-010.md` | `decision-record.md` ADR-001 lines 51, 57, 71; ADR-003 lines 137-157; ADR-004 lines 171-184; sibling deep-review/deep-research skill machinery. |
<!-- /ANCHOR:evidence-trail -->

## 12. NON-GOALS REAFFIRMED

- Preserve ADR-001's lightweight bound unless it provably fails.
- Do not create `.opencode/skills/multi-ai-council/` for packet 081.
- Do not add `/speckit:council`.
- Do not auto-dispatch the council through advisor or hooks.
- Do not replace `scratch/` for ad-hoc council notes.
- Do not aggregate councils across packets.
- Do not implement convergence math beyond the 2/3 agreement rule.
- Do not make the LEAF council write files.
- Do not change packet 080 `spec.md` as part of this synthesis.
- Do not emit `resource-map.md` in this synthesis pass.
- Do not run `/memory:save`; orchestrator owns that after synthesis.

## 13. LIGHTWEIGHT-BOUND GO/NO-GO

**Verdict: GO. Preserve the lightweight bound.**

The current packet 081/082 improvements are support infrastructure around an agent-owned planning convention. They do not yet require command lifecycle ownership, reducer state, automatic routing, enforced validation, generated mirrors, or council-controlled execution.

Conditions that justify revisiting ADR-001:

- Two or more promotion triggers become true in a real packet.
- One trigger becomes blocking enough that callers cannot safely use the council.
- The helper starts controlling rounds, seats, dispatch, or convergence.
- `ai-council-state.jsonl` needs fail-closed parsing, migrations, or reducer-owned writes.
- `/speckit:*` commands become the primary lifecycle owner.
- Skill Advisor or hooks must discover and recommend council automatically.
- `validate.sh --strict` must enforce internal `ai-council/` layout.
- Four-runtime mirrors can no longer be maintained with parity tests and require generated bodies.

Conditions that do not justify revisiting ADR-001:

- One new helper script.
- One new schema reference.
- Short §17 body text.
- Fixture tests.
- Mirror parity tests.
- Optional save payloads.
- More reference documentation.

## 14. SPEC-KIT INTEGRATION VERDICT

Current packet 080 integration is solid for a lightweight v1 convention, with known gaps that are follow-on work rather than release blockers.

Solid:

- Agent body has §12 Output Protocol, §13 Invocation Contract, §14 State Schema, and §15 Convergence Signal.
- `ai-council/` smoke-test artifacts exist in packet 080.
- ADR-001 preserves lightweight scope.
- ADR-003 keeps state convention-only.
- ADR-004 keeps `ai-council/` free-form under validation.
- Four runtime mirrors exist.
- Reference docs exist under `references/multi-ai-council/`.
- Validator regression coverage exists for free-form behavior.

Gaps:

- P0: no standalone persistence helper yet.
- P0: no shared §8 schema artifact yet.
- P0: no §17 caller persistence protocol yet.
- P1: current validator regression has one weak filesystem-only test.
- P1: no mirror parity enforcement.
- P1: helper fixtures do not exist.
- P2: no advisor abstention regression.
- P2: no optional memory-save payload path.
- P2: no council-aware completion advisory check.
- P2: `/speckit:*` command wiring is not present and should remain convenience work.

Integration verdict: **solid foundation, incomplete operationalization**.

## 15. RECOMMENDED NEXT STEPS

1. Start packet 081 with `persist-artifacts.cjs` and fixture tests.
2. Add `output-schema.md` and make helper parser requiredness derive from that contract.
3. Update §8 and add short §17 in the canonical agent body.
4. Mirror the agent-body change to `.claude`, `.gemini`, and `.codex`.
5. Add normalized mirror parity test.
6. Harden the existing `multi-ai-council-validator.vitest.ts`.
7. Run focused tests and packet validation.
8. Open packet 082+ for optional save payloads, advisor regression, state v1.1 docs, council advisory checks, and command wiring.

## 16. OPEN QUESTIONS

No key research questions remain.

Residual implementation choices for packet 081:

- Whether to build a general agent mirror checker or a council-specific parity test first.
- Whether `persist-artifacts.cjs` should overwrite same-round outputs by default or require `--force`.
- Whether `--strict-output` writes placeholders into every optional-derived section or only into seat/deliberation files.
- Whether the helper should print the optional memory-save payload to stdout behind a flag or write it to a named file.
- Whether the first helper should emit `schema_version:"1.1"` immediately or wait for packet 082 state-format updates.

These are implementation choices, not research blockers.

## 17. REFERENCES

Primary packet inputs:

- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-001.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-002.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-003.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-004.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-005.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-006.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-007.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-008.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-009.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-010.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-config.json`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md`

Packet 080 docs and artifacts:

- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/spec.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/plan.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/tasks.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/checklist.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/implementation-summary.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-config.json`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/deliberations/round-001.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/deliberations/round-002.md`
- `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/critiques/round-002-critique.md`

Agent and mirror surfaces:

- `.opencode/agents/multi-ai-council.md`
- `.claude/agents/multi-ai-council.md`
- `.gemini/agents/multi-ai-council.md`
- `.codex/agents/multi-ai-council.toml`
- `.opencode/agents/orchestrate.md`
- `.codex/agents/README.txt`

Existing multi-ai-council references:

- `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md`
- `.opencode/skills/system-spec-kit/references/multi-ai-council/seat-diversity-patterns.md`
- `.opencode/skills/system-spec-kit/references/multi-ai-council/convergence-signals.md`
- `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`

Sibling deep-skill patterns:

- `.opencode/skills/deep-research/SKILL.md`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-research/references/state_format.md`
- `.opencode/skills/deep-review/SKILL.md`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`

Spec-kit memory and validation surfaces:

- `.opencode/commands/memory/save.md`
- `.opencode/skills/system-spec-kit/references/memory/save_workflow.md`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts`

Advisor surfaces:

- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_runtime.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`

ADRs and decisions:

- ADR-001: lightweight bound; no `.opencode/skills/multi-ai-council/` folder.
- ADR-003: `ai-council-state.jsonl` remains documented and convention-only for v1.
- ADR-004: `ai-council/` remains free-form under spec validation.

Memory/context references cited by packet 080:

- `feedback_new_agent_mirror_all_runtimes.md`

## Convergence Report

- Stop reason: converged (newInfoRatio < 0.05 + all key questions answered + max iterations reached)
- Total iterations: 10
- Questions answered: 10/10
- Remaining questions: 0
- Last 3 iteration summaries:
  - iter 8: focus="Q8 memory-save anchoring", ratio=0.52
  - iter 9: focus="Q9 ADD risk mitigation", ratio=0.44
  - iter 10: focus="synthesis-ready", ratio=0.04
- Convergence threshold: 0.05
- Executor: cli-codex / gpt-5.5 / reasoning=high / service_tier=normal/standard
