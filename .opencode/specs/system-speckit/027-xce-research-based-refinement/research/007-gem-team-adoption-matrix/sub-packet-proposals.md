---
title: "Gem Team Adoption — Sub-Packet Proposals (027)"
packet: "specs/system-spec-kit/027-xce-research-based-refinement"
research_phase: "research/007-gem-team-adoption-matrix"
totalProposals: 3
deferredItems: 6
created: "2026-06-06"
verdict: "VALIDATE-AND-INCREMENTALLY-REFINE — 3 small adapter/gate packets; everything else → tags/aliases/notes"
---

# Sub-Packet Proposals — Gem Team Adoption

Derived from the 19-iteration phase-007 study (13 analysis + 5 adversarial-verify + 1 completeness critic). The adversarial round downgraded all 9 first-pass candidates to narrow slices; the critic converged the worthwhile set to **three** sub-packets plus a defer list. Full reasoning: `research.md`.

**Placement + cross-phase numbering (RECONCILED).** Phase 007 ran alongside two operator-launched sibling research packets — `006-peck-source-deep-mining` and `008-caura-memclaw-fleet-memory-teachings` — which each also proposed new 027 children. 027's implementation children currently run `000-008`; the new proposals continue at `009` in this reconciled, collision-free sequence:

| # | From | Proposed child |
|---|------|----------------|
| `009` | 006-peck | `009-peck-verification-discipline` |
| `010` | 006-peck | `010-reviewer-prompt-benchmark-substrate` |
| `011` | 006-peck | `011-acceptance-coverage-gate` |
| `012` | **007-gem-team (this packet)** | `001-typed-agent-io-adapter` |
| `013` | **007-gem-team (this packet)** | `002-scoped-preexec-and-handoff-gates` |
| `014` | **007-gem-team (this packet)** | `003-planner-review-focus-and-drift-hint` |
| `010` | 008-caura-memclaw | `007-memclaw-derived-memory-hardening` |

This packet's `009` are **final** (no longer tentative). **Scaffolded (2026-06-06) as a single phase-parent `027/006-gem-team-adoption/` (renumbered from `012` on 2026-06-06 to free slot 009 for peck’s 009→001 merge) with the three proposals as nested phases — `001-typed-agent-io-adapter` (was 012) / `002-scoped-preexec-and-handoff-gates` (was 013) / `003-planner-review-focus-and-drift-hint` (was 014)** — i.e. one phased spec, not three sibling children. (Sibling packets 006/008 still occupy `001` / `010` as separate top-level children.) These refine the **agent runtime** (agent I/O contracts, dispatch, gates) — a different subsystem from 027's memory-internal children `002-008`; the operator may alternatively place them on a dedicated agent-runtime track. **Note (updated 2026-06-06 by the research/009 cross-impact follow-up):** 006's `009-peck-verification-discipline` and this packet's P2 both edit `sk-code/SKILL.md`, but they are **distinct rules on different predicates — NOT a merge** (peck = root-cause/escalation gates; P2 = boundary contract-first on `change_class ∈ {api,schema,integration}`). Handling: **coordinate the shared `sk-code/SKILL.md` edit window** (whoever lands first records its line ranges; the second references them), and confirm peck's `CLAUDE.md` Logic-Sync edits don't change the semantics P3's `spec_drift` defers to. Everything else (memory phases 002-008, peck 010/011, caura 010, `generate-context.ts`) is orthogonal.

**Governing principle (from the critic's counter-argument).** The spec-kit is mature and markdown/governance-rich. Every item below is an **adapter, optional mode, or advisory field** — never a replacement for existing evidence-rich contracts. Reject anything that flattens agent outputs into brittle protocol compliance.

---

## Proposal P1: `001-typed-agent-io-adapter` — Typed Dispatch + Output Envelope (Adapter)

**Scope summary.** Add a **typed agent-I/O adapter layer** over the existing agent contracts: (1) a normalized output envelope exposing machine-parseable `status` / `confidence` (numeric 0.0-1.0 *alongside* HIGH/MED/LOW) / `failure_type`, emitted as a small fenced block that **precedes or follows the existing rich markdown body** (never replacing it); (2) a typed **dispatch header** for sub-agent calls (stable `dispatch_id`, `task_definition` field set per agent type, and a lean `context_snapshot` header + read-directive buckets — `safe_to_assume` / `verify_before_use` / `do_not_re_read` — layered on the existing @context Context Package). Maps existing `@code` escalation classes (`UNKNOWN_STACK`/`SCOPE_CONFLICT`/`LOGIC_SYNC`/`VERIFY_FAIL`) and `@review` P0/P1/P2 into a normalized `failure_type` enum — does NOT import Gem's taxonomy wholesale.

**Why (net-new).** Gem's single biggest contribution: a uniform typed envelope + per-agent input schema makes orchestration decisions machine-parseable. The spec-kit does this in scattered prose today *(iter 011, ratio 0.83 — highest of the run; iter 018)*.

**Cross-model refinement (MiMo, iter 024).** The OUTPUT side is *less* of a gap than first stated — `@code` RETURN already carries typed escalation enums (`UNKNOWN_STACK`/`SCOPE_CONFLICT`/`LOGIC_SYNC`/`VERIFY_FAIL`) + confidence bands [code.md:275-310] and 7 typed dispatch *modes* [code.md:117-128]. **Re-weight: the dispatch-INPUT header (`dispatch_id` / typed `task_definition` / `context_snapshot`) is the PRIMARY gap; output-envelope normalization is secondary.** Also add an explicit **architectural decision** to this packet's plan: Gem's `context_envelope.json` is a *progressive, orchestrator-maintained* cache enriched between waves [gem AGENTS.md rule 9], whereas our Context Package is *one-shot retrieval* [context.md:230-232] — decide (and record as a ruled-out alternative if rejected) whether the dispatch header should carry a progressive snapshot or stay per-invocation. MiMo's view: keeping one-shot retrieval is defensible; just make it a conscious choice.

**Level estimate:** L2 (~180-260 LOC, mostly docs/contract; optional tiny validator).
**Files:** `.opencode/agents/code.md`, `review.md`, `context.md`, `debug.md` (add an "Output Envelope" + "Dispatch Header" section each, ~30-40 LOC); 1 new shared contract doc `.opencode/skills/system-spec-kit/references/agent-io-contract.md`; `orchestrate.md` (consume the envelope for routing).

**Dependencies.**
- Requires (already shipped): `@code` RETURN contract [code.md:270-310], `@review` gate I/O [review.md:237-245], `@context` Context Package [context.md:230-284].
- Feeds into: P2 and P3 (their fields live in this envelope).

**Risk register.**
| Risk | Severity | Mitigation |
|------|----------|------------|
| Flattening evidence-rich markdown into JSON-only | High | Envelope is an **adjunct block**; rich markdown body stays canonical [iter 011 ruled-out]. |
| Over-specification / schema churn across agents | Med | Minimal field set (status/confidence/failure_type/dispatch_id + read-directives); one shared contract doc, not per-agent divergence. |
| Numeric+qualitative confidence divergence | Low | Numeric is derived-from/aligned-with the band; band stays human-canonical. |

**Out of scope.** JSON-only outputs; replacing the Context Package; a runtime enforcement gate (advisory first).

---

## Proposal P2: `002-scoped-preexec-and-handoff-gates` — Debug-Handoff Schema + Boundary Contract-First + Pre-Mortem

**Scope summary.** Three **scoped, optional-mode** gates (each fires only in its narrow condition, to avoid universal ceremony):
1. **Debug-handoff schema** — when a diagnosis crosses agents (debug → implement), require a typed handoff carrying `root_cause`, `target_files`, `fix_recommendations`, `confidence`; the receiving agent validates presence before fixing. Keeps @debug's 5-phase method as-is *(iter 006; iter 014 narrowed)*.
2. **Boundary contract-first check** — for **API / schema / integration** changes only, require a contract/acceptance check be identified before production edits. NOT universal TDD *(iter 005 ADOPT→ iter 014 scoped)*.
3. **Pre-execution pre-mortem field** — for **medium/high** complexity work, a mandatory short pre-mortem (risk level + top 2-3 failure modes + assumptions), reusing existing Risk/fallback fields *(iter 010; iter 016 narrowed)*.

**Why (net-new).** Each adds a machine-checkable discipline at a specific seam the spec-kit currently handles in prose; together they harden the highest-risk transitions without new agents.

**Cross-model refinement (MiMo, iter 024) — frame honestly.** The debug-handoff schema is a **downscale of an existing Gem mechanism, not a novel invention**: Gem's orchestrator pre-wave gate already *machine-checks* `debugger_diagnosis` (root_cause/target_files/fix_recommendations, conf<0.85→escalate) [gem AGENTS.md rule 5] — P2 deliberately adopts a *narrower, advisory* version. Present it that way in the plan. (Also: before claiming OWASP/secrets coverage parity elsewhere in this study, verify `sk-code-review/references/security_checklist.md` actually covers the same OWASP categories Gem's reviewer scans — that downgrade was asserted without content-coverage evidence.)

**Level estimate:** L2 (~150-220 LOC, docs/contract + checklist updates).
**Files:** `.opencode/agents/debug.md` (handoff schema), `.opencode/agents/orchestrate.md` (pre-mortem field + handoff verification at dispatch), `.opencode/skills/sk-code/SKILL.md` (boundary contract-first gate), `.opencode/skills/system-spec-kit/templates/debug-delegation.md` (schema fields).

**Dependencies.**
- Requires: `@debug` 5-phase [debug.md:142-159], `@code` verification discipline [code.md:180-188], P1's envelope (the `confidence`/`failure_type` fields).
- Feeds into: more reliable multi-agent debug/implement handoffs.

**Risk register.**
| Risk | Severity | Mitigation |
|------|----------|------------|
| Universal ceremony / latency | High | Hard scope: handoff-only, API/schema-only, med/high-only. LOW/typo work untouched. |
| False confidence from a filled-in schema | Med | Schema is a checklist, not a correctness guarantee; reviewer still verifies. |
| Overlap with existing @debug/@review | Med | Add only the typed seam; do not duplicate the 5-phase method or review gates. |

**Out of scope.** Universal TDD; a full Gem-style failure taxonomy; replacing @debug.

---

## Proposal P3: `003-planner-review-focus-and-drift-hint` — Reviewer-Focus + Requirements-Drift Write-Back (Lowest Cost)

**Scope summary.** Two advisory planning/output fields (the completeness critic's net-new find, iter 019):
1. **`reviewer_focus` / `quality_score` hint** — let a planning/decomposition step emit a short "where review attention should go" hint (high-risk files/areas + a self-assessed quality score), so @review/@orchestrate route attention without adding gates [gem-planner.agent.md:108-110; CHANGELOG.md:65-74].
2. **`spec_drift` / `update_recommended` write-back** — let task agents flag when implementation reveals the spec/plan should change (a requirements-drift recommendation), surfaced into continuity rather than silently diverging [gem-planner.agent.md:106-107].

**Why (net-new).** Both are cheap, advisory, and route human/agent attention; the spec-kit has Logic-Sync for *contradictions* but no lightweight *drift-recommendation* or *review-focus* signal.

**Level estimate:** L1 (~80-130 LOC, advisory fields in agent/output contracts).
**Files:** `.opencode/agents/orchestrate.md`, `.opencode/agents/code.md` / `review.md` (emit/consume the fields via P1's envelope), continuity note in `system-spec-kit` save path docs.

**Dependencies.** Pairs with P1 (fields live in the envelope). Requires Logic-Sync [CLAUDE.md §4] to remain the authority for hard contradictions.

**Risk register.**
| Risk | Severity | Mitigation |
|------|----------|------------|
| Advisory fields ignored / noise | Low | Keep optional + short; only surface on genuine drift/high-risk. |
| Conflates with Logic-Sync | Low | Drift hint is a *recommendation*; Logic-Sync stays the halt authority for contradictions. |

**Out of scope.** Adopting PRD.yaml as a control surface (we have richer spec folders); auto-applying drift changes.

---

## Deferred — tags / aliases / notes (NOT sub-packets)

Each was downgraded below sub-packet threshold by the adversarial round and/or the critic. Track as small follow-ups, not packets:

| Item | Disposition | Evidence |
|------|-------------|----------|
| `gotcha` / `failure_mode` memory labels | Add as retrieval **tags/learned-triggers** only — NOT canonical `memory_type` | iter 002; iter 015 (ADAPT-XS) |
| OWASP / secrets standing scan | Add OWASP **naming/preset** + `/security-review` discoverability; coverage already exists | iter 005; iter 018; security_checklist.md:24 |
| Knowledge-source precedence | One-paragraph cross-source **arbitration note**; Logic-Sync already arbitrates | iter 004; iter 017 |
| Auto-skills extraction | **Proposal-only shadow** trigger that feeds /create + deep-improvement gates; no autonomous creation | iter 007; iter 017 |
| Specialized-agent mode checklists (simplifier / browser-tester / devops) | Optional **sk-code surface presets**, future | iter 019 |
| Distribution / APM packaging | **Drop**; at most a future drift-control generator for runtime dirs | iter 013; iter 019 |

---

## Recommended sequence

`P1` (the envelope is the substrate P2/P3 fields live in) → `P2` ‖ `P3` (independent once P1 lands). Each is independently shippable and L1-L2; none requires touching the memory MCP (027's 002-008 children). Total surface is small and low-risk by design — consistent with the run's core finding that the spec-kit needs **polish, not new subsystems**.

**Next step:** cross-phase reconciliation of the 006/007/008 proposal sets into a unified 027 child sequence (007's tentative `009`, watch for P2 ↔ 006's `009-peck-verification-discipline` merge), then `/speckit:plan` on P1 (highest value, enables the others).
