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
