---
title: "GPT Deep-Agent Routing Fidelity in OpenCode — Research Synthesis"
description: "Ten-iteration deep-research synthesis on GPT-backed OpenCode deep-loop mis-routing, slowness, workflow drift, and repo-resident fixes."
status: synthesis-complete
session_id: dr-010-gpt-routing-1782801010
iterations: 10
date: 2026-06-30
importance_tier: important
contextType: research
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research"
    last_updated_at: "2026-06-30T10:05:30Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Synthesized 10-iteration GPT deep-agent routing research"
    next_safe_action: "Use 011-gpt-routing-fixes for implementation planning"
    blockers: []
    key_files:
      - "research/iterations/iteration-010.md"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-010-gpt-routing-1782801010"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether narrative file hash linkage belongs in first implementation patch"
    answered_questions:
      - "Validator-first research/review status enum hardening is the recommended first implementation."
---

# GPT Deep-Agent Routing Fidelity in OpenCode — Research Synthesis

> Synthesized from iterations 001-010. This phase is research-only; implementation belongs in follow-on phase `011-gpt-routing-fixes`.

---

## 1. Executive Summary

<!-- ANCHOR:summary -->
GPT-backed OpenCode deep-loop runs mis-route because the native deep command path relies on prose/prompt contracts rather than a hard runtime identity boundary. The orchestrator runs as `@general`, then the YAML asks it to dispatch a deep LEAF agent; under the native branch that dispatch is soft prompt/YAML prose, while all custom agent dispatch through `@orchestrate` uses the universal `subagent_type: "general"` wrapper with identity carried by injected prompt text. GPT-backed models can therefore absorb the LEAF role as general/build, re-dispatch incorrectly, or advance state without a real leaf.

The strongest repo-resident first fix is validator hardening, not host-runtime attribution. Iterations 8-10 validate FIX-4a against real drift packets and make it implementation-ready: strengthen `validateIterationOutputs` for research/review iteration records by enforcing canonical iteration file presence/non-empty, canonical JSONL shape, and a six-value status enum (`complete | timeout | error | stuck | insight | thought`). Deep-context and deep-ai-council should be deferred because their artifact/state shapes differ. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/iterations/iteration-010.md:12-19]
<!-- /ANCHOR:summary -->

---

## 2. Scope and Evidence Base

The research covered both reproduction surfaces: `@orchestrate` dispatch and build-primary/general execution. It inspected command YAML, agent files, reducer state, prior drift packets, validator code/tests, and cross-skill command assets.

Primary synthesized sources:
- Iterations 001-004 establish root cause, role boundary, workflow drift taxonomy, and surface-agnostic reproduction.
- Iterations 005-007 rank fixes, verify load-bearing anchors, characterize Claude baseline, and analyze latency/workflow overhead.
- Iterations 008-010 validate the FIX list against empirical drift packets and close implementation planning for status-enum/FIX-4a hardening.
- Resource map: `research/resource-map.md`.

---

## 3. Root Cause

Root cause is two-part:

1. Native deep-loop dispatch is a soft prose contract. In `deep_research_auto.yaml`, native dispatch resolves to `agent: deep-research`, `model: opus`, `context_source: rendered_prompt_pack`, and `wait_for_completion: true`, but enforcement is not equivalent to a process boundary. Iteration 1 identified this native-vs-CLI distinction, and later iterations repeatedly observed injected dispatch prose reaching the leaf prompt.
2. `@orchestrate` dispatches every custom agent through `subagent_type: "general"`; the specialized identity is prompt-injected, not enforced by a dedicated runtime type. Iteration 4 cites `orchestrate.md` and concludes that `@deep-research` and `@general` share the same runtime wrapper.

This combination lets GPT-backed execution misread "orchestrate this loop" as "be the leaf" or "call another Task". Claude appears more faithful because it weights the role/protocol contract more strongly, not because the repo contains a hard enforcement boundary.

---

## 4. Mis-Route Modes

The research identifies three modes:

| Mode | Signature | Consequence | Evidence |
|---|---|---|---|
| Mode A | General/build absorbs the leaf role and writes as the wrong actor | Workflow appears to progress but provenance/role contract is false | Iteration 3 Mode A taxonomy |
| Mode B | Leaf obeys injected sub-agent/task prose and re-dispatches | Nested-dispatch regression; Task fingerprints may appear | Iterations 1-4 OBS captures |
| Mode C | Loop advances through fabricated JSONL state without a canonical narrative file | Most severe: counter advances with no real iteration artifact | Iteration 8 packet 122 analysis |

Mode C was the key late discovery. Packet 122 had five JSONL iteration records, no `iterations/` directory, and a fabricated `complete-salvaged` status. This directly motivated status-enum enforcement plus canonical file validation. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/iterations/iteration-008.md:13-23]

---

## 5. Workflow Drift Observed In This Run

This run itself exhibited several drift signals:

- `.deep-research.lock` heartbeat froze at init time while later iterations continued, leaving a stale lock that had to be reclaimed before iteration 9.
- The reducer dashboard showed 0/6 resolved questions even after iteration records claimed KQ1-KQ9/KQ12 were substantively answered.
- A schema mismatch event was already recorded for iteration 6: `iter-006` initially used `iteration_delta` instead of canonical `iteration`.
- Iterations repeatedly logged injected sub-agent-dispatch text and ignored it under the LEAF contract.

These are not blockers for the synthesis; they are additional in-vivo evidence that the deep-loop workflow needs stronger state/validator invariants.

---

## 6. Latency Findings

The slowness gap is mostly structural rather than a single slow command. Iteration 7 separates fixed orchestrator steps from scaling leaf-side costs. Native Mode A/role absorption grows context and reasoning overhead because the orchestrator can repeatedly carry YAML, state, reducer, and prompt-pack material rather than isolating work in a fresh process/leaf context. FIX-5 (CLI subprocess executor) remains the structural prevention for role absorption, but it has broader operational blast radius than validator hardening.

---

## 7. Fix Ranking

The research ranked five fix families, then added one invariant:

| Rank | Fix | Role | Current recommendation |
|---|---|---|---|
| 1 | FIX-5 native -> CLI subprocess | Structural prevention | Keep as follow-up; highest prevention, larger blast radius |
| 2 | FIX-1 dispatch manifest/frontmatter invariant | Process/role audit | Needs host cooperation for full value |
| 3 | FIX-4a file-before-JSONL + hash/status validator | Repo-resident detector | Implement first with status enum; highest low-risk coverage |
| 4 | FIX-3 `sub_agent_dispatch_in_leaf_prompt` failure reason | Mode-B detector | Useful but not triggered by empirical packets 122/116 |
| 5 | FIX-2 terminator sentinel | Leaf self-defense | Useful defense-in-depth, cannot create a missing leaf |
| Additive | Status enum validation | Catches fabricated statuses | Implement with FIX-4a |

Iteration 8 validates this ranking against packets 122 and 116. FIX-5 prevents both; FIX-4a detects both; FIX-3 and FIX-2 do not catch the observed packet signatures.

---

## 8. Implementation-Ready First Patch

Phase 011 should begin with a validator-only patch in `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`:

1. Add a `jsonl_invalid_status` failure reason.
2. Define allowed research/review iteration statuses: `complete`, `timeout`, `error`, `stuck`, `insight`, `thought`.
3. Enforce status membership after required field validation and before delta validation.
4. Preserve existing canonical file checks (`existsSync(input.iterationFile)` and non-empty `statSync(...).size`) and consider hash linkage separately.
5. Update validator tests that currently accept `status: "continue"`.

Iteration 9 identifies the insertion point in `validateIterationOutputs`: existing canonical file presence/non-empty checks sit before canonical type/field/delta validation, while status is only required as a field today. Iteration 10 concludes the first status-enum patch should cover deep-research and deep-review only.

---

## 9. Cross-Skill Boundary Decision

Deep-research and deep-review should share the first status enum hardening because both define the same LEAF status vocabulary and use the shared `validateIterationOutputs` post-dispatch validator.

Deep-context should be deferred: it currently records host-written context evidence with `status: "evidence"` and does not share the same `iteration-NNN.md` + `deltas/iter-NNN.jsonl` validation shape.

Deep-ai-council should also be deferred: it uses council session/topic artifacts and `session-state.jsonl`, not research/review-style iteration narratives. It likely needs an analogous council-specific validator rather than reuse of the research/review enum.

---

## 10. Tests To Add Or Update

Phase 011 should use a test-first patch:

- Add unit coverage that rejects a state-log iteration record with `status: "continue"`.
- Add unit coverage accepting all six canonical statuses.
- Update existing `post-dispatch-validate.vitest.ts` fixtures that currently use `continue`.
- Update review-depth integration fixtures that use `continue` if they flow through the shared validator.
- Confirm deep-review `thought` and `insight` semantics remain valid because its convergence logic special-cases those statuses.

---

## 11. Explicit Deferrals

Do not include these in the first implementation patch:

- Host-runtime source kill for trailing prompt injection.
- Per-agent `subagent_type` runtime identity enforcement.
- Definitive model/provenance attribution of archived drift packets.
- Empirical latency measurement, because captured Claude-vs-GPT timing logs were not found.
- Deep-context validator normalization.
- Deep-ai-council session/topic validator design.
- Narrative file hash linkage unless a minimal local SHA-256 helper is chosen; existing `computeIntegrityHash` is JSON-state integrity tooling, not a drop-in stream/file helper.

---

## 12. Open Questions

Remaining questions are implementation-design boundaries, not blockers for phase 011 planning:

- Should deep-context eventually normalize to the six-status vocabulary, or should it keep `evidence` behind a mode-specific validator?
- Should deep-ai-council validate seat/session artifact statuses through a dedicated council validator?
- Should narrative file hash linkage be part of the first validator patch or a follow-on integrity sidecar design?

---

## 13. Recommended Phase 011 Scope

Recommended new phase: `011-gpt-routing-fixes`.

Initial scope:
- Harden `validateIterationOutputs` for research/review status enum.
- Preserve existing canonical file existence and non-empty checks.
- Add `jsonl_invalid_status` diagnostics.
- Update unit/integration tests.
- Document context/council deferrals in the plan.

Follow-up scope:
- Consider optional narrative file hash linkage.
- Consider dispatch manifest/role-audit work if host cooperation is available.
- Consider CLI-subprocess executor hardening (FIX-5) after validator hardening lands.

---

## 14. Risk Assessment

Blast radius for the first patch is medium-low: it touches shared deep-loop runtime validation and tests, with direct effect on deep-research and deep-review. The main risk is breaking fixtures or historical records that used `continue`; the correct response is to update fixtures or isolate mode-specific status vocabularies, not to keep accepting arbitrary statuses.

The first patch does not prevent all clean Mode A cases. A general/build actor that writes a correctly named, non-empty narrative file and valid JSONL status can still pass the file/status validator. Structural prevention still requires FIX-5 or a dispatch manifest/role audit.

---

## 15. Convergence Report

- Stop reason: `maxIterationsReached` (operator requested exactly two more iterations, cap 10).
- Total iterations: 10.
- Reducer questions answered: 0/6 due legacy-import/resolution drift.
- Substantive questions answered in iteration records: KQ1-KQ9 and KQ12, including KQ6 implementation-readiness close-out.
- Last 3 ratios: 0.88 -> 0.90 -> 0.83.
- Convergence threshold: 0.05.
- Interpretation: research did not converge by novelty ratio; it stopped by explicit operator cap after enough implementation-planning evidence was gathered.

---

## 16. References

- `research/iterations/iteration-001.md` through `research/iterations/iteration-010.md`.
- `research/deep-research-state.jsonl`.
- `research/deep-research-dashboard.md`.
- `research/resource-map.md`.
- `.opencode/commands/deep/assets/deep_research_auto.yaml`.
- `.opencode/commands/deep/assets/deep_review_auto.yaml`.
- `.opencode/commands/deep/assets/deep_context_auto.yaml`.
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml`.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`.
- `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`.

---

## 17. Next Action

Create and plan phase `011-gpt-routing-fixes` under the `156-agent-loops-improved` parent, scoped to the validator-first implementation path above. Keep this phase (`010`) research-only.
