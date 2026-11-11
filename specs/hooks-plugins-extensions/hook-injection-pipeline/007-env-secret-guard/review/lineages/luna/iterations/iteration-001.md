# Review Iteration 001

## Dispatcher

- Run: fanout-luna-1794335564064-t156gg; lifecycle: new; lineage mode: auto.
- Focus dimension: correctness. Operator review_focus: The env-secret-guard change: core .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, its runtime adapters (Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode plugin), the hook-registry entry, CE-P06/CE-P07 playbook scenarios and the docs that list it. Hunt for dotenv reads or writes the guard misses, false denials, value leaks from the inspection tools, and doc claims the code does not back. Never open a real .env file.
- This pass traced shell path classification and the template-file exemption against core code, tests, and CE-P06/CE-P07 contracts. It addresses a dotenv-read bypass, false denials, inspection-value claims, and named integrations.
- Budget profile: verify.

## Files Reviewed

- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs
- .skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs
- .skilled/hooks/env-secret-guard/pi/env-secret-guard.ts
- .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs
- .opencode/plugins/env-secret-guard.js
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json
- specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard/spec.md
- specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard/implementation-summary.md
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-inspect-without-values-conversation.md (CE-P06)
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-protect-from-edit-conversation.md (CE-P07)

## Findings - New

### Findings by Severity

#### P0 Findings

None.

#### P1 Findings

1. **Command-substitution path assignment can read .env without refusal** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270 -- The classifier expands only simple variable references from its local assignment map and does not evaluate command-substitution output. With f="$(printf .env)"; cat "$f", the shell sets f to .env and reads it, but the classifier retains the substitution text and does not recognize a dotenv path.
{"type":"claim-adjudication","claim":"A supported shell reader can read .env through a path variable populated by command substitution while evaluateToolCall allows the call.","evidenceRefs":[".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270-273",".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:430-478",".skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:153-163","specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard/spec.md:63-74"],"counterevidenceSought":"Checked packet scope and core tests for substitutions, assignments, direct reads, and supported readers. Tests cover direct assignment and fallback variables, not a command-substitution-produced path.","alternativeExplanation":"The classifier handles a bounded shell subset, so generated paths could be outside contract. The spec includes direct shell reads, the code parses substitutions and assignments, and cat is a supported reader; this path form is within the stated guard surface.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"Downgrade if the governing shell contract excludes command-substitution paths or a focused behavior check shows this exact form is rejected."}
Finding class: security
Scope proof: The packet includes direct shell reading programs and cat is supported; the gap is in the shared core.
Affected surface hints: Shared core shell classification; Claude, Codex, Cursor, Devin, Pi, DSH, and OpenCode integrations that delegate to the core.
Case: f="$(printf .env)"; cat "$f" reads .env in a shell but is not recognized as a dotenv read.

#### P2 Findings

2. **Single-quoted variable reference is expanded and falsely denied** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:200 -- Tokenization removes quote context before variable expansion; the guard can treat '$f' as f's value although a shell passes literal $f to cat.
Finding class: correctness
Scope proof: The classifier handles quoted arguments and variable expansion for supported shell-reader paths.
Affected surface hints: Shared core shell tokenizer and reader decisions.
Case: With f=.env, cat '$f' targets a literal file named $f, while the guard expands it to .env and denies it.

3. **.env* is denied when only the exempt .env.example exists** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:305 -- Glob matching tests a synthetic .env candidate before directory entries; a directory with only the exempt template can still trigger a denial.
Finding class: correctness
Scope proof: The core has an explicit .env.example exemption and evaluates globs through globMatchesDotenv.
Affected surface hints: Shared core glob matching and reader decisions.
Case: With .env.example and no .env, cat .env* matches only the exempt template but is denied by the synthetic candidate.

## Traceability Checks

- spec_code: partial. Packet scope and implementation summary describe direct shell reads and template exemption; these edge cases are absent from inspected tests.
- checklist_evidence: partial. Existing tests cover direct dotenv reads, direct assignment, fallback expansion, and a glob with a real .env fixture; they do not establish generated-variable or template-only glob behavior.
- playbook_capability: not run. CE-P06 documents five runtimes and scratch fixtures; CE-P07 documents edit refusal and .env.example follow-up. Scenarios were reviewed, not executed.
- Value-free inspection: static review found list/validate/fingerprint helpers return key names, validity/line metadata, and digests rather than parsed values. Runtime evidence was not run.

## Integration Evidence

- The hook-registry entry at .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1681 names Claude, Codex, Cursor, Devin, and Pi registrations.
- The Claude/Codex/Cursor/Devin command hook, Pi adapter, DSH adapter, and OpenCode plugin delegate tool decisions to shared evaluateToolCall.
- CE-P06 is .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-inspect-without-values-conversation.md; setup creates fixtures only in scratch and checks history for canary values.
- CE-P07 is .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-protect-from-edit-conversation.md; it documents edit refusal followed by an allowed .env.example edit.
- steer.md was absent before this iteration.

## Edge Cases

- No real .env was opened; CE-P06 fixture commands were read as documentation and not executed.
- Graph bootstrap/upsert was not run because its target-spec write paths exceed the lineage-only fence; graph traceability remains unverified.
- Adapters were traced to the shared core, not exercised in live runtimes.

## Confirmed-Clean Surfaces

- Reviewed inspection helpers return key names, validity/line metadata, and fingerprints rather than dotenv values.
- Existing tests cover direct .env reads, direct assignment, fallback expansion, and patch-looking write payloads.

## Ruled Out

- Direct cat .env, f=.env; cat "$f", and the tested fallback form are covered by core tests.
- Patch-looking content in a write payload does not select the target path in tested classification.

## Next Focus

- dimension: security
- focus area: Recheck the command-substitution bypass through adapters and inspect tool return paths for value exposure or fail-open branches.
- reason: Iteration 1 found a shared-core shell bypass and inspection claims that need adapter traceability.
- rotation status: rotate from correctness to security.
- blocked/productive carry-forward: Productive: correlate core branches with tests and adapters. Blocked: graph-backed traceability writes exceed lineage authority; do not retry.
- required evidence: adapter error/refusal behavior, tool return shapes, exact hook registration, and P1 counterevidence.
- recovery note: Keep runtime execution and real dotenv fixtures out of scope.

Review verdict: CONDITIONAL
