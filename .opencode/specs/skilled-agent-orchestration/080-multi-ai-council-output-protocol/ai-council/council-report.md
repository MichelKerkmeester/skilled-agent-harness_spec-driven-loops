# Council Report: Packet 080 v1.1+ default — agent-side writes vs orchestrator-mediated writes

**Spec folder**: `skilled-agent-orchestration/080-multi-ai-council-output-protocol`
**Final at**: 2026-05-06T13:04:00.000Z
**Convergence**: TRUE (round 1)
**Recommended direction**: option (b) — orchestrator-mediated writes
**Confidence**: 85/100

---

## Task Classification

- **Type**: Architecture / convention-default decision
- **Council Seats Dispatched**: 3 — Analytical / cli-claude-code, Critical / cli-codex, Pragmatic / cli-copilot
- **Dispatch Mode**: Sequential Depth 1 (NDP-compliant, `sequential_thinking` inline)
- **Vantage Integrity**: Simulated lenses; no live external CLI execution

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|-----------|
| seat-001 | Analytical | cli-claude-code (simulated) | Decompose architectural-symmetry; verify (a) consistency with sibling deep-skills | 70 → 53 |
| seat-002 | Critical | cli-codex (simulated) | Attack option (a) hard; enumerate failure modes | 78 → 87 |
| seat-003 | Pragmatic | cli-copilot (simulated) | What ships fastest, minimizes 4-runtime mirroring tax | 82 → 83 |

## Strategy Comparison

| Dimension | Weight | Seat 1 (a) | Seat 2 (b) | Seat 3 (b) |
|-----------|--------|------------|------------|------------|
| Correctness | 30% | 18 | 26 | 25 |
| Completeness | 20% | 11 | 16 | 15 |
| Elegance | 15% | 8 | 13 | 13 |
| Robustness | 20% | 11 | 17 | 15 |
| Integration | 15% | 8 | 14 | 14 |
| Pre-Critique Total | 100% | **56** | **86** | **82** |
| Post-Critique Adjustment | ±10 | -3 | +1 | +1 |
| Final Total | 100% | **53** | **87** | **83** |

## Winning Strategy

- **Leader**: Seat 2 (Critical / cli-codex), 87/100
- **Key Strength**: Concrete failure-mode enumeration (F1-F7); helper-script proposal that neutralizes F5-F7 while preserving the §0 invariant verbatim
- **Complementary Elements Merged**:
  - From Seat 3 (Pragmatic, 83): location `scripts/multi-ai-council/`, command-side YAML wiring, multi-runtime cost reasoning
  - From Seat 1 (Analytical, 53): path-scoping verification deferred as v1.2+ investigation, NOT a v1.1 blocker

## Recommended Plan

**Adopt option (b) — keep `@multi-ai-council` planning-only (`write: deny`) as the long-term v1.1+ default.** Formalize the orchestrator-mediated persistence pattern via a shared helper script and explicit caller-responsibility documentation. Defer option (a) as a v1.2+ optional mode pending opencode write-scope verification.

### Why this direction

- Preserves the §0 "Planning-only architect" invariant verbatim across §1, §7, §8, §9, §11 — no semantic-identity rewrite, no contradiction across 5+ load-bearing sections.
- Avoids the 4-runtime mirroring tax (per memory `feedback_new_agent_mirror_all_runtimes.md`).
- Helper script captures ~90% of option (a)'s benefit at ~10% of the cost.
- Pattern proven functional in this very dispatch.
- Path-scoping verification is decoupled from v1.1 ship.

## Implementation Steps (3-step roadmap for follow-on packet 081)

### Step 1 — Author the persistence helper

Path: `.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.sh` (or `.js` if matching existing scripts/ conventions). Input: `<packet-spec-folder> <agent-output-text-or-file> [--round NNN]`. Behavior: parse the agent output's §-headers (Council Composition, per-seat sections, Deliberation Notes, Recommended Plan), then write `ai-council/seats/round-NNN/seat-<lens>.md` (one per seat), `ai-council/deliberations/round-NNN.md`, and `ai-council/council-report.md` (appended/superseded on subsequent rounds).

Idempotent: re-running same round overwrites; new round increments NNN. Exit codes: 0 success, 1 parse error before any write, 2 partial-write recovery needed. Include a fixture-driven vitest test that dispatches a sample council report through the helper and asserts artifact layout.

(Source: Seats 2 + 3.)

### Step 2 — Update agent body §13 + add §17 Caller Persistence Protocol

§13 (Invocation Contract): add "Artifact Persistence Responsibility" subsection — caller MUST persist artifacts to `<packet>/ai-council/`; recommended via `persist-artifacts.sh`.

§17 (new): "Caller Persistence Protocol" — copy-paste shell snippet showing helper invocation, expected exit codes, and the resulting `seats/`, `deliberations/`, `council-report.md` layout. Preserve §0 invariant verbatim. No edits to §1, §7, §8, §9, §11.

Mirror to all 4 runtimes per `feedback_new_agent_mirror_all_runtimes.md`: `.opencode/.md`, `.claude/.md`, `.gemini/.md`, `.codex/.toml` plus 4 README.txt and root README.md count.

(Source: Seats 1 invariant preservation + 2 doc updates + 3 multi-runtime accounting.)

### Step 3 — Wire helper into commands and open path-scoping follow-on

Update `/spec_kit:complete`, `/spec_kit:deep-research`, `/spec_kit:deep-review`, and any other commands that dispatch `@multi-ai-council` to invoke `persist-artifacts.sh` post-dispatch (1-line YAML/shell call).

Open follow-on investigation: "Verify opencode `write: allow` path-scoping syntax. If supported and enforceable, draft a v1.2+ optional mode where `@multi-ai-council` may self-persist within `ai-council/` scope. Reword §0 from 'does not write' to 'does not modify production code' ONLY after verification confirms path-scoped writes are enforceable AND user approves the invariant reword."

Do NOT implement option (a) until verification completes.

(Source: Seats 1 verification question + 3 command integration.)

## Prerequisites

- Packet 080 shipped: `ai-council/` subfolder convention, agent body §12-§15, four reference files, ADR-001 lightweight bound, ADR-004 free-form validator.
- Existing scripts/ folder convention available.
- Existing 4-runtime mirroring workflow operational.
- This dispatch demonstrates write: deny + orchestrator-mediated persistence is functional.

## Plan Confidence

- **Overall**: 85/100
- **Strategy Agreement**: STRONG — Seats 2 and 3 converge on (b) via independent reasoning; Seat 1 acknowledged its verification gap.
- **Consensus Quality**: Strong, validated by adversarial cross-critique.
- **Risk Level**: LOW. The plan is purely additive.

## Dropped Alternatives

- **Seat 1 option (a) — grant `write: allow`** (Score: 53/100): would require rewording §0/§7/§8/§9/§11 across 4 runtimes plus README mirrors, depends on unverified opencode path-scoping. Rejected as v1.1+ default; deferred as v1.2+ candidate ONLY after path-scoping verification succeeds AND user approves the §0 reword.

## Risks & Mitigations

- **R1**: Orchestrators may bypass the helper, causing artifact-layout drift across packets. **Mitigation**: §17 caller protocol + 1-line YAML in `/spec_kit:*` commands + validator hint flagging post-dispatch packets missing `council-report.md`.
- **R2**: Helper script becomes new maintenance surface. **Mitigation**: keep small (~150 LOC), fixture-tested, located in shared scripts/.
- **R3**: Distributed friction — every new caller must rediscover the helper. **Mitigation**: §17 copy-paste recipe; dispatch examples in agent body and reference docs.
- **R4 (deferred)**: Path-scoping verification may fail, blocking v1.2+ option (a). **Mitigation**: acceptable. Option (b) is complete on its own.

## Planning-Only Boundary

The Multi-AI Council did NOT write any files. The dispatching orchestrator (Claude Code) wrote the canonical `ai-council/` artifacts based on this report. The `@multi-ai-council` agent retained `write: deny` throughout — preserving the §0 "Planning-only architect" invariant.

## Cross-References

- Spec: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/spec.md`
- ADRs: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md`
- Agent body: `.opencode/agent/multi-ai-council.md` (§12 Output Protocol, §13 Invocation Contract, §14 State Schema, §15 Convergence Signal)
- Per-seat reasoning: `seats/round-001/seat-{001,002,003}-*.md`
- Deliberation notes: `deliberations/round-001.md`
- State log: `ai-council-state.jsonl`
