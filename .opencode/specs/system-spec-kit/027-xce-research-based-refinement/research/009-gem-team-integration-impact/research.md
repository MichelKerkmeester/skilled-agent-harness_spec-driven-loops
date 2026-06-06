---
title: "027 Gem Team Integration & Impact — Phase 009 Synthesis"
iterations: "001-005 (5): P1-impact, P2-impact, P3-impact, cross-cutting/governance, command-workflow blast radius"
executor: "cli-opencode openai/gpt-5.5-fast --variant high (read-only); orchestrator-written state"
session: "2026-06-06-027-gem-team-integration-impact"
subject: "How to integrate 007's 3 proposals (P1 typed-agent-io-adapter/012, P2 scoped-gates/013, P3 planner-focus-drift/014) + full impact on existing skills/commands/agents/docs"
status: "complete; verdict = FEASIBLE, FULLY ADDITIVE — nothing breaks if every field stays optional; @orchestrate is the linchpin; roll out in 4 waves"
---

# 027 Gem Team Integration & Impact — Phase 009 Synthesis

**Question.** For 007's three proposals, *how* do we integrate each, and *what existing skills/commands/agents/docs* does each touch?

---

## 1. Executive Summary

**Integration is feasible and entirely additive — nothing existing breaks if every new field stays optional and the rich-markdown bodies stay canonical.** All three proposals collapse onto **one shared, versioned, advisory contract** (`agent-io-contract.md`) and one central hub (**`@orchestrate`**). The work is docs + agent-contract edits, not runtime rewrites. newInfoRatio stayed high across all 5 angles (0.72–0.86) — lots of concrete, file-level integration detail.

Three headline results:

1. **One contract, one hub.** P1's I/O envelope, P2's gate fields, and P3's advisory fields all live in a single grouped schema (`dispatch` / `result` / `handoff` / `pre_execution` / `advisory`) at `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`, emitted/consumed centrally by `@orchestrate`. *(iters 001, 004)*
2. **Governance and validators are barely touched.** The Four Laws, Gate 3, Logic-Sync, Completion-Verification, `validate.sh`, `check-completion.sh`, `spec-doc-structure`, and `system-skill-advisor` all stay **UNCHANGED** — the only governance edit is a small "these are optional/advisory" pointer in `AGENTS.md`. *(iter 004)*
3. **Rollout is the real design.** `@orchestrate` + `/speckit:plan` first (fastest payoff), `/speckit:implement` + debug-handoff second (highest-risk transition), `/speckit:complete` + `/deep:start-review-loop` third (after fixing a `/complete` Step-11 ambiguity), deep-loops + `/memory:save` last (header-only). *(iter 005)*

**Bottom line:** start with P1's contract doc + `@orchestrate` + the four `@context` dispatches in `/speckit:plan`. That delivers value with zero gates, zero governance change, zero validator change, and full backward-compat.

---

## 2. Consolidated Impact Matrix

Change = ADD (new) / MODIFY (additive edit) / NONE (touched-by-analysis but should not change). Every MODIFY is **additive & optional** unless noted.

### Agents (`.opencode/agents/`)
| Surface | P1 | P2 | P3 | Change | Severity | Note |
|---|:-:|:-:|:-:|---|---|---|
| **orchestrate.md** (194-214, 217-247, 438-452) | ✓ | ✓ | ✓ | **MODIFY** | **Critical/MED** | The linchpin: emits dispatch header + pre-mortem + reviewer_focus, consumes result envelope + spec_drift. Must tolerate output with NO envelope. |
| **code.md** (55-60, 117-128, 270-310) | ✓ | ✓ | ✓ | MODIFY | LOW-MED | Append `AGENT_IO_RESULT` *after* the §8 body (never before the first-line `RETURN:`); receiver-validate debug handoff; add optional `spec_drift` block. |
| **review.md** (241-245, 264-278, 328-335) | ✓ | — | ✓ | MODIFY | LOW | Map existing P0/P1/P2 + bands → envelope; accept `reviewer_focus` (steer attention only — never creates a finding without evidence). |
| **context.md** (52-59, 230-284) | ✓ | — | — | MODIFY | MED | Accept dispatch header + read-directives; **envelope must NOT count as a 7th Context-Package section** (6 required stay). |
| **debug.md** (91-128, 367-426, 479-499) | ✓ | ✓ | — | MODIFY | LOW | Add typed handoff fields only for cross-agent debug→implement; 5-phase method + checklist stay **NONE**. |

### Skills (`.opencode/skills/`)
| Surface | Change | Severity | Note |
|---|---|---|---|
| **system-spec-kit/references/workflows/agent-io-contract.md** | **ADD (new)** | LOW | The single advisory contract (versioned, grouped sections). NOT under `shared/contracts/` (that's for executable TS adapters). |
| **sk-code/SKILL.md** (35-45, 181-193, 226-238) | MODIFY | LOW | P2 boundary contract-first, scoped to API/schema/integration intent **only** (not universal TDD). |
| **system-spec-kit/SKILL.md** (80-92) + `AGENTS.md` routing | MODIFY (small) | LOW | One pointer to the new contract doc. |
| **system-skill-advisor/** | **NONE** | LOW | Typed I/O is downstream of routing; advisor untouched. |

### Templates & scripts (P2 debug-handoff)
| Surface | Change | Severity | Note |
|---|---|---|---|
| **templates/manifest/debug-delegation.md.tmpl** (44-106) | MODIFY | MED | Add `root_cause`/`target_files`/`fix_recommendations`/`confidence` inside existing sections (5-section consumers exist). |
| **scripts/spec/scaffold-debug-delegation.sh** (18-88, 261-339) | MODIFY | MED | CLI flags + JSON extraction for the typed fields; affects generator tests (has a stale schema-line comment at :343-347). |

### Memory / continuity (P3 spec_drift)
| Surface | Change | Severity | Note |
|---|---|---|---|
| **commands/memory/save.md** (71-104, 408-418) | MODIFY (docs) | LOW | Route drift rationale → `handover.md`; compact continuity gets short `recent_action`/`next_safe_action`. |
| **scripts/memory/generate-context.ts** (103-140) | ADD (optional) | LOW | Optionally accept `specDrift`/`reviewerFocus` JSON keys in JSON-mode. |
| **mcp_server `ThinContinuityRecord` / memory-save.ts / schemas** | **NONE (L1)** | — | Do NOT add raw `spec_drift` to the continuity schema without a later packet (record + validator + serializer + tests + resume reader). |

### Commands / workflows (rollout targets — iter 005)
| Surface | P1 | P2 | P3 | Change | Rollout wave |
|---|:-:|:-:|:-:|---|---|
| **speckit/plan** Step 5 (`speckit_plan_auto.yaml:521-568`) | ✓ | — | ✓ | MODIFY | **Wave 1** |
| **speckit/implement** Step 6 + debug (`..._auto.yaml:424-464`) | ✓ | ✓ | ✓ | MODIFY | **Wave 2** |
| **deep/start-review-loop** (`..._auto.yaml:133-302`) | ✓ | — | ✓ | MODIFY | Wave 3 |
| **speckit/complete** (`..._auto.yaml:561-966`) | ✓ | ✓ | ✓ | MODIFY | Wave 3 (⚠ has a Step-11 review-gate mismatch — fix first) |
| **deep/start-research-loop** (`..._auto.yaml:144-624`) | ✓ | — | — | MODIFY (header only) | Wave 4 |
| **memory/save** (654-683) | ✓ | — | — | MODIFY | Wave 4 |
| **deep/start-agent-improvement-loop**, **create/create_agent** (uses @context) | (✓) | — | — | NONE / small | later |

### Governance & validation — **stays authoritative & UNTOUCHED**
`AGENTS.md` Four Laws (21-26), Gate 3, Logic-Sync (312-314), Completion-Verification (247-258); `validate.sh`, `check-completion.sh`, `spec-doc-structure.ts`; `.claude/CLAUDE.md`. Only edit: a small "optional/advisory, does not replace the Gates" note in `AGENTS.md` (189-223, 322-357). *(iter 004)*

---

## 3. The shared contract (how P1+P2+P3 coexist)

One versioned doc, grouped optional sections so nothing flattens into top-level bloat *(iter 004)*:

```
agent-io-contract.md  (schema_version)
  dispatch:        dispatch_id, agent, task_definition (per-agent), context_snapshot, read_directives   ← P1
  result:          status, confidence{band,numeric}, failure_type, summary_ref                          ← P1
  handoff:         root_cause, target_files, fix_recommendations, confidence   (debug→implement only)   ← P2
  pre_execution:   pre_mortem{risk, failure_modes, assumptions}  (medium/high only) · boundary_contract (api/schema only)  ← P2
  advisory:        reviewer_focus, quality_score, spec_drift, update_recommended, target_docs            ← P3
```

Per-agent `task_definition` (lean): `@code`{mode,objective,allowed_files,success,verification}; `@review`{gate_type,artifact,scope,threshold,focus}; `@context`{focus,scope,retrieval_layers,output_size}; `@debug`{invocation_approval,error_summary,affected_files,prior_attempts_ref}.

---

## 4. Rollout roadmap (4 waves)

1. **Wave 1 — substrate + fastest payoff (P1 only):** write `agent-io-contract.md`; add the optional dispatch header + result envelope to `@orchestrate` + `@code`/`@review`/`@context`/`@debug`; wire `/speckit:plan` Step 5's four `@context` dispatches. No gates, no governance/validator change.
2. **Wave 2 — highest-risk transition (P2):** the three scoped gates (debug-handoff schema, boundary contract-first, pre-mortem) across `@debug`→`@orchestrate`→`@code` + `sk-code` + the debug-delegation template/scaffold; wire `/speckit:implement` Step 6 + debug path.
3. **Wave 3 — review steering + complete (P3 + reach):** `reviewer_focus` into `@review` and `/deep:start-review-loop`; `spec_drift` write-back via `/memory:save`; then `/speckit:complete` **after** resolving its Step-11 review-gate/checklist mismatch.
4. **Wave 4 — breadth, header-only:** `/deep:start-research-loop`, `/memory:save`, benchmarks — carry the P1 dispatch header but **not** the output envelope (deep-loop CLI executors consume raw prompt packs; an envelope requirement would break non-native executors).

---

## 5. Backward-compatibility contract (how nothing breaks)

Every consumer degrades gracefully *(iters 004, 005)*:
- No `AGENT_IO_RESULT` → parse the existing markdown contract (current behavior).
- No `reviewer_focus` → derive review scope from target/files.
- No `spec_drift` → record `spec_drift: none`.
- No debug-handoff schema (legacy `debug-delegation.md`) → **warn, don't fail**; require manual verification (only for new debug→implement crossings).
- Numeric `confidence` is *derived from* the HIGH/MED/LOW band, never a competing truth.

---

## 6. Top risks / watch-outs

- **`@orchestrate` must never reject envelope-less output** — that's the one change that would break everything.
- **Don't enforce in validators** (`validate.sh`/`check-completion.sh`/`spec-doc-structure`) — keep it advisory; otherwise every existing spec folder fails.
- **Keep P2 scoped** — universal pre-mortem/contract-first = ceremony creep, violates the proposal's intent.
- **`/speckit:complete` Step-11 ambiguity** (review-gate vs checklist) must be reconciled before wiring P3 there.
- **`quality_score` name collision** — already used in `/memory:save` (:359); don't introduce a second bare `quality_score` with a different scale (use `self_assessed_quality` or namespace it).
- **`spec_drift` must not bypass Logic-Sync** or auto-edit spec docs — it's a recommendation, not a mutation; `@code` emits it, the orchestrator/human decides.
- **Don't prepend the envelope before `@code`'s first-line `RETURN:`** — compact-first-line consumers exist.

---

## 7. Smallest-viable-first-step

**Ship Wave 1, P1-only, advisory:** (1) `agent-io-contract.md`; (2) optional dispatch-header + result-envelope sections appended to the 5 agents; (3) `/speckit:plan` Step 5 emits the header on its `@context` dispatches. Zero gates, zero governance/validator edits, fully backward-compatible — and it makes orchestration decisions machine-parseable where they're first knowable (planning fan-out). This maps to child **`001-typed-agent-io-adapter`** as an L1/L2 first slice; P2 (`013`) and P3 (`014`) build on the same contract afterward.

---

## 8. Open Questions (for `/speckit:plan`)

- Numeric confidence defaults: HIGH=0.90 / MED=0.70 / LOW=0.30? (iter 001)
- `context_snapshot` one-shot vs orchestrator-maintained progressive cache? (the 007 architectural fork; default one-shot.)
- `target_files` in debug handoff = `@code` edit allowlist, or recommendation orchestrator translates? (iter 002)
- `spec_drift`: continuity-only, or a blocking checkpoint when it contradicts `spec.md`? (default continuity-only; Logic-Sync owns contradictions.) (iters 003, 005)
- Legacy `debug-delegation.md` missing P2 schema: warn / block / one-time scaffold upgrade? (iter 002)

---

## 9. Convergence Report
- **Iterations:** 5 — 001 P1-impact, 002 P2-impact, 003 P3-impact, 004 cross-cutting/governance, 005 command/workflow blast radius. All gpt-5.5-fast --variant high, read-only.
- **newInfoRatio:** 0.78 / 0.82 / 0.76 / 0.72 / 0.86 (mean ≈0.79) — uniformly high; integration analysis surfaced dense file-level detail at every angle.
- **Confidence:** HIGH on the additive/optional integration model + the 4-wave rollout. Load-bearing claims carry `file:line` in `iterations/iteration-00N.md` + raw `prompts/iteration-00N.out`.
- **Next:** `/speckit:plan` on child `012` (Wave 1, P1 MVP), using §3 contract + §4 wave 1 + §7 first-step.

## 10. References
- Per-iteration: `iterations/iteration-001.md … 005.md` (+ raw `prompts/`).
- Subject proposals: `../007-gem-team-adoption-matrix/sub-packet-proposals.md` (P1/P2/P3 = children 012/013/014).
- State: `deep-research-state.jsonl`. Charter: `deep-research-strategy.md`.
