# Council Report: Packet 080 v1.1+ default — agent-side writes vs orchestrator-mediated writes

**Spec folder**: `skilled-agent-orchestration/080-multi-ai-council-output-protocol`
**Last updated at**: 2026-05-06T13:33:00.000Z
**Convergence**: TRUE (round 1: converged on direction; round 2: converged on amendment)
**Recommended direction**: option (b) — orchestrator-mediated writes
**Round-2 verdict**: round-1 amended with addendum (ADD-1 through ADD-6)
**Confidence**: 84/100 (round-2 final, slightly below round-1's 85/100 because amendment surfaced previously hidden gaps; direction is better-grounded but delivery surface is larger than round-1 estimated)

---

> **AMENDMENT NOTE**: Round 2 (adversarial critique of round-1) confirmed the direction but found three material gaps. The round-1 plan below is preserved as the directional recommendation; the **Round-2 Addendum** at the end of this report supersedes round-1 implementation specifics. Packet 081 scope MUST incorporate the addendum.

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

Path: `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.sh` (or `.js` if matching existing scripts/ conventions). Input: `<packet-spec-folder> <agent-output-text-or-file> [--round NNN]`. Behavior: parse the agent output's §-headers (Council Composition, per-seat sections, Deliberation Notes, Recommended Plan), then write `ai-council/seats/round-NNN/seat-<lens>.md` (one per seat), `ai-council/deliberations/round-NNN.md`, and `ai-council/council-report.md` (appended/superseded on subsequent rounds).

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

---

## ROUND-2 ADDENDUM — Required Refinements (Amendment to Round-1 Plan)

Round-2 critique (3 seats: Critical / Holistic / Research) confirmed round-1's direction but found 3 material implementation gaps that require addressing before packet 081 begins. Six additions are folded into packet-081 scope.

### ADD-1 — Caller enumeration (replaces falsified "callers concentrated" assumption)

Round-1's central assumption *"callers are concentrated to `/spec_kit:*` commands"* was falsified by Seat 3's grep evidence. Actual dispatchers include:

- **(a)** Top-level Task dispatch (Claude Code or any AI assistant invoking `@multi-ai-council` directly)
- **(b)** `@orchestrate` agent at Depth 1 (codified in `.opencode/agents/orchestrate.md` line 97, 192, 749 as LEAF target)
- **(c)** `/spec_kit:*` command YAMLs (zero current commands actually dispatch the council; future-target)
- **(d)** CLI-skill manual dispatch (cli-claude-code, cli-codex, cli-opencode, cli-gemini playbooks and references)

Section §17 (Caller Persistence Protocol) MUST enumerate ALL four caller patterns. Each gets a copy-paste recipe. The helper MUST be standalone-invokable (not only YAML-wired) so callers (a) and (d) work without command infrastructure.

### ADD-2 — Helper graceful-degradation contract

The helper script's parser MUST:
- Treat as **strict-required**: §8 sections "Council Composition", "Per-seat sections", "Recommended Plan", "Plan Confidence".
- Treat as **optional**: "Cross-References", "Dropped Alternatives", "Deliberation Notes details", "Risks & Mitigations details".
- Exit code 0 when strict-required sections present and parsed.
- Exit code 1 only when strict-required sections are missing.
- Optional sections missing → write seat/deliberation/report files with empty placeholders or omit those subfiles entirely (configurable via `--strict-output` flag).

This protects against §8 evolution and ADR-004 free-form variation without breaking persistence.

### ADD-3 — §8 OUTPUT FORMAT promoted to shared schema artifact

Create `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md` (or a JSON-schema fixture in `scripts/tests/fixtures/multi-ai-council-output-schema.json`) as the **single source of truth** for §8 OUTPUT FORMAT. Both the agent body's §8 prose AND the helper's parser reference this artifact. Schema change requires updating both in lockstep.

### ADD-4 — Depth-1 helper invocation note (parent owns it, not LEAF)

§17 must clarify: *"When `@multi-ai-council` runs at Depth 1 (LEAF dispatched by another agent), the **dispatching parent** owns helper invocation post-return, not the LEAF itself. The LEAF returns its plan as a chat message; the parent persists via the helper."* This is consistent with §0 planning-only invariant.

### ADD-5 — Legacy / pre-convention scope clarification (forward-only)

§17 explicitly states: *"This persistence convention applies to council dispatches from this point forward. Legacy `@multi-ai-council` outputs in earlier packets (pre-080) remain in their original locations and are NOT migrated retroactively. Packets are immutable history."*

### ADD-6 — Packet 081 sequencing safeguard

If packet 081 lands while existing `/spec_kit:*` commands have not yet been wired (round-1 Step 3 partial state), the helper MUST work with manual invocation. Recommended packet-081 sequence:
1. Author helper + fixture tests (Step 1) — standalone usable immediately.
2. Add §17 + output-schema.md (Step 2) — documented for human/AI callers.
3. Wire YAML invocations into `/spec_kit:*` commands (Step 3) — convenience, not requirement.

This sequencing means callers (a), (b), (d) get value from Step 2 even if Step 3 lags.

---

### Updated Risks & Mitigations (round-1 + round-2 combined)

| Risk | Severity | Source | Mitigation |
|------|----------|--------|------------|
| R1 | MEDIUM | round-1 | Orchestrators bypass helper → §17 with caller enumeration (ADD-1); validator hint flagging missing council-report.md |
| R2 | LOW | round-1 | Helper as new maintenance surface → small (~150 LOC), fixture-tested |
| R3 | LOW | round-1 | Distributed friction → §17 copy-paste recipes per caller pattern |
| R4 | LOW | round-1 | Path-scoping verification may fail → acceptable; option (b) is complete |
| R5 | LOW | round-2 (F8) | Depth-1 caller cannot invoke helper → ADD-4 "dispatching parent owns invocation" |
| R6 | MEDIUM | round-2 | §8 evolution breaks helper → ADD-2 graceful degradation + ADD-3 shared schema artifact |
| R7 | MEDIUM | round-2 | Caller-enumeration gap leaves dispatchers unaware → ADD-1 §17 enumeration covering all 4 caller patterns |
| R8 | LOW | round-2 | Packet 081 lands partially, leaving inconsistent persistence → ADD-6 sequencing |

---

## Cross-References

- Spec: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/spec.md`
- ADRs: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md`
- Agent body: `.opencode/agents/multi-ai-council.md` (§12 Output Protocol, §13 Invocation Contract, §14 State Schema, §15 Convergence Signal)
- Round-1 per-seat reasoning: `seats/round-001/seat-{001,002,003}-*.md`
- Round-1 deliberation: `deliberations/round-001.md`
- Round-2 per-seat reasoning: `seats/round-002/seat-{001-cli-codex,002-cli-claude-code,003-deep-research}.md`
- Round-2 deliberation: `deliberations/round-002.md`
- Round-2 critique log: `critiques/round-002-critique.md`
- State log: `ai-council-state.jsonl` (14 events: 7 round-1 + 7 round-2, append-only)
