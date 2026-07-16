# Deep Research Strategy - gpt55-fast-9

## 1. OVERVIEW

This detached fan-out lineage validates the proposed deep-loop unification design using the bound artifact directory as the state boundary.

## 2. TOPIC

Validate and stress-test the merge design for folding deep-loop-runtime into deep-loop-workflows as system-deep-loop: structural layout, bidirectional path-coupling repair, the system-spec-kit tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether fallback-router.ts should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Is the proposed `system-deep-loop/` layout with nested `runtime/` structurally coherent without creating duplicate skill identity or mode ambiguity?
- [x] Are the bidirectional path-coupling repair rules complete for workflow-to-runtime and runtime-to-workflow references after the move?
- [x] Is the `system-spec-kit` tooling-borrow repair complete, including hidden runtime seams and tests beyond the obvious package and tsconfig files?
- [x] What command, agent, README, graph metadata, advisor-corpus, and model-prompt references must migrate, and which should intentionally remain stable?
- [x] Should `fallback-router.ts` be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, or remain deferred/manual for this research phase?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not modify `deep-loop-workflows`, `deep-loop-runtime`, command assets, agents, advisor corpora, specs, or READMEs outside this lineage.
- Do not execute the merge or implement fallback routing.
- Do not write outside `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-9`.

## 5. STOP CONDITIONS

- Stop after legal convergence once all five key questions have evidence-backed answers and at least 3 iterations have completed.
- Stop at `maxIterations: 10` if convergence does not arrive earlier.
- Continue past a low-novelty STOP candidate if quality guards lack source diversity or question coverage.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Structural layout: coherent if `system-deep-loop` is the single public hub and `runtime/` is backend infrastructure with no routable skill identity or mode metadata (iteration 1; evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:12`, `.opencode/skills/deep-loop-runtime/SKILL.md:14-17`, `.opencode/skills/deep-loop-workflows/SKILL.md:64-67`).
- [x] Path-coupling: Class A and Class B repair directions are correct, but child 002's file table is incomplete; add research/review runtime-capability shims, council orchestrate-session, council replay graph, and a classified runtime-test inventory (iteration 2; evidence: `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:16-18`, `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-66`, `.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts:10-12`).
- [x] Tooling-borrow: the four planned compiler/test edits are necessary but incomplete; phase 002 should also cover runtime `artifact-root.cjs`, its test, and `test:council` anchor fixture paths if those gates run before child 003 (iteration 3; evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-19`, `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10-25`, `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:7-67`).
- [x] Reference migration: migrate executable command YAML, generated contracts, agent helper paths, README navigation, graph metadata, and advisor corpus/parity fixtures; keep `/deep:*` commands, OpenCode agent slugs, and `sk-prompt-models` model IDs/profile files stable (iteration 4; evidence: `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:39-52`, `.opencode/agents/orchestrate.md:161-206`, `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:525-531`).
- [x] Fallback-router: useful optional hardening but not a merge blocker; keep child 004 operator-gated unless GLM-heavy reruns require automatic substitution before closeout (iteration 5; evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628-653`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:69-105`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:101-124`).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Paired hub/runtime contract reads: verified the public hub plus frozen backend split and the one-graph-metadata invariant (iteration 1).
- Executable grep plus targeted reads: found omitted reverse-coupling files and separated imports from prose hits (iteration 2).
- Validation-gate tracing: starting from the named `test:council` and runtime gates exposed hidden path-sensitive seams (iteration 3).
- Bucketed reference classification: command/agent/README/graph/advisor/model-profile buckets separated executable migration from stable public API (iteration 4).
- Router-to-pool call-site tracing: reading `fallback-router.ts`, its tests, model profiles, and `fanout-pool.cjs` established optional fallback scope without implementation (iteration 5).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Code graph status: stale and scope-excluding commands/agents/specs, so it was not used as proof for structural claims (iteration 1).
- Broad workflow markdown grep: too noisy for actionable path-coupling classification due to playbooks, changelogs, feature catalogs, and benchmark outputs (iteration 2).
- Whole-system-spec-kit grep: useful for future child 003 inventory, but too broad for phase 002 blocker classification without gate ownership buckets (iteration 3).
- Whole-repo reference grep: useful for discovery but too noisy to be the migration plan without classifying live executable paths, generated artifacts, docs, advisor corpus, and historical records separately (iteration 4).
- Pure symbol search for `resolveFallback`: proved no production caller but did not itself answer fallback attribution/model-id normalization semantics (iteration 5).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Flattening workflow packets and runtime libraries into one directory: contradicts per-mode contract ownership and risks mode ambiguity (iteration 1, evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:64-67`).
- Keeping `runtime/SKILL.md` discoverable after the merge: contradicts runtime's non-user-facing contract (iteration 1, evidence: `.opencode/skills/deep-loop-runtime/SKILL.md:37-44`).
- Blind global replacement of `deep-loop-runtime` / `deep-loop-workflows`: unsafe because import depth, generated-contract literals, path expectation tests, and historical prose need separate treatment (iteration 2).
- Fully decoupling runtime compiler/test tooling from system-spec-kit during this merge: unnecessary and risky because production dependency self-containment is already guarded (iteration 3).
- Renaming `/deep:*` commands or OpenCode agent slugs as part of the merge: not needed for the one-skill-identity fix and would broaden public API blast radius (iteration 4).
- Editing `fallback-router.ts` itself or making fallback wiring a blocker for hub rename/runtime nesting: ruled out because the module is already tested and child 004 is optional/P2 (iteration 5).
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Deferring `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` to child 003 only: ruled out because it is an internal executable runtime-script lookup (iteration 2, evidence: `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-66`).
- Treating the four-row Stage 3b table as complete: ruled out because artifact-root and council anchor fixtures are load-bearing for the stated validation gates (iteration 3).
- Moving `sk-prompt-models` model IDs or profile files into `system-deep-loop`: ruled out because GLM/MiMo prompt profiles are model-executor assets, not workflow assets (iteration 4).
- Silent GLM to MiMo substitution: ruled out because fallback requires caller-approved model sets and explicit substituted-lineage attribution (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None]
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. Feed the corrections into child 002/003 before the physical move, and keep child 004 as optional operator-gated fallback-router hardening unless GLM-heavy fan-out reruns need automatic substitution.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Bound spec folder: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research`.
- Bound artifact directory: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-9`.
- Packet spec says this phase is read-only research over structural layout, coupling repair, reference migration, advisor-corpus handling, and fallback-router wiring [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:68-75].
- Packet plan defines the fan-out executor payload and notes `iterations` is the JSON field while `iters` is only a repeatable CLI flag alias [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:71-85].
- `resource-map.md` was not present in the spec folder at init; skipping coverage gate.
- Memory trigger lookup failed with `MCP error -32000: Connection closed`; this lineage uses direct file evidence plus stale-code-graph status as context.
- Code graph status is stale because git HEAD changed and the scope excludes commands/agents/specs, so structural claims must be verified by Grep/Read rather than graph-only evidence.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Min iterations before convergence: 3
- Convergence threshold: 0.05
- Stop policy: convergence
- Per-iteration budget: 12 tool calls maximum
- Progressive synthesis: true
- Session ID: `fanout-gpt55-fast-9-1783486518892-2qss01`
- Executor: `cli-opencode model=openai/gpt-5.5-fast`
- Current generation: 1
- Started: 2026-07-08T05:12:01Z
