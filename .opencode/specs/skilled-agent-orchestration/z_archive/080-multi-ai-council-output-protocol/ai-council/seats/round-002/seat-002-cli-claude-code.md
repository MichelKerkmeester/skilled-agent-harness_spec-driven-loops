---
round: 2
seat: seat-002
executor: cli-claude-code
lens: holistic
vantage: cli-claude-code (simulated)
status: ok
timestamp: 2026-05-06T13:30:30.000Z
simulated: true
score_pre_critique: 76
score_post_critique: 79
---

# Seat 002 — Holistic / cli-claude-code (simulated)

## Distinct Mandate (Round 2)

System-wide fit. Helper as circular dependency. Packet 081 integration risk with sibling skills.

## Findings

### Helper as circular dependency — bounded

The helper is a Bash/JS script invoked via shell, not via agent dispatch. So it is NOT recursively dependent on `@multi-ai-council`. ✓ Round-1 implicitly assumed this; should be made explicit in §17.

The deeper risk: §17 documents the helper, and the helper parses §8 OUTPUT FORMAT. A §8 schema change must update the helper in lockstep. **Single source of truth for §8 shape MUST be codified as a schema artifact** (`output-schema.md` or a tested fixture), referenced by both agent body and helper.

### Packet 081 sequencing risk — moderate

If 081 lands while 080 is still being adopted, dispatchers may produce free-form output (§8 valid per ADR-004) that the helper then attempts to parse. The helper MUST tolerate §8-conformant output that lacks optional sections (e.g., "Cross-References", "Dropped Alternatives"). Round-1's helper spec ("parse the agent output's §-headers") is too imprecise.

**Helper MUST define a strict-required vs optional section contract** with graceful degradation for missing optional sections. Specifically:
- Strict-required: "Council Composition", "Per-seat sections", "Recommended Plan", "Plan Confidence"
- Optional: "Cross-References", "Dropped Alternatives", "Deliberation Notes details", "Risks & Mitigations details"
- Exit code 0 when strict-required parsed; exit code 1 only when strict-required missing
- Optional missing → empty placeholder or omission (configurable via `--strict-output` flag)

### Integration with sibling skills

- **sk-doc**: Generates documentation; does NOT dispatch `@multi-ai-council`. Low risk.
- **system-spec-kit**: Hosts validators and templates. Round-1's location for the helper at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/` is correct architecturally (centralizes spec-folder lifecycle scripts). ✓
- **deep-research / deep-review**: Do NOT dispatch `@multi-ai-council` (verified). Low risk for now. BUT both are autonomous loops with iteration-state writers; a future "deep-council" loop would need a different persistence pattern (multi-iteration, per-iter folders) that the round-1 single-helper does NOT support.
  - **Open**: helper should accept an optional `--iteration NNN` or `--loop-mode` flag for forward compat.
- **`@orchestrate`**: `orchestrate.md` lists `@multi-ai-council` as LEAF dispatch target (verified line 97 + 749). When `@orchestrate` dispatches at Depth 1, `@orchestrate` itself is responsible for helper invocation. Round-1 did NOT call this out; §17 must document orchestrator-side helper invocation explicitly, not just `/spec_kit:*` command-side.
- **Hooks**: No active hooks dispatch `@multi-ai-council` (verified). ✓ No hook-surface risk currently.

## Risks & Trade-offs

- §8 schema artifact is new maintenance surface. Mitigation: small, fixture-tested, single source of truth.
- Helper standalone-invocability requirement adds complexity but covers caller patterns Seats 1 and 3 surfaced.
- Forward-compat flag is speculative (no current need).

## Assumptions and Evidence Gaps

- **Assumption**: §8 OUTPUT FORMAT will evolve over time (new councils, new lenses, etc.). **Evidence**: agent bodies generally evolve; locking §8 too tightly is brittle.
- **Assumption**: Mirror discipline holds across 4 runtimes for §8. **Evidence**: existing `feedback_new_agent_mirror_all_runtimes.md` workflow.

## Alternative Challenged

**"Helper parses §8 directly without a shared schema"** — challenged. This is round-1's implicit position. Without a shared schema, §8 evolution silently breaks the helper. Mitigation requires the schema artifact (ADD-3).

## Confidence

**76/100** (pre-critique) → **79/100** (post-critique). +3 for §8 shared-schema proposal and orchestrate dispatch case.

## Verdict

Round-1 direction CONFIRMED. Implementation needs ADD-2 (graceful degradation), ADD-3 (shared schema artifact), and clearer §17 §17 caller patterns including `@orchestrate` and forward-compat flag.
