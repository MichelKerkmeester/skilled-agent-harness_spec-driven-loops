# Research Synthesis: Spec Templates & Context Reducer Concepts

**Lineage:** grok (`cli-cursor` / `cursor-grok-4.5-high`)  
**Session:** `fanout-grok-1786515199922-z0hium`  
**Spec:** `specs/system-speckit/033-spec-templates-and-context-reducer`  
**Stop reason:** `max_iterations` (3/3; `stopPolicy: max-iterations`; convergence was telemetry only)  
**Mode:** Report-only — no product implementation in this lineage.

---

## 1. Executive verdict

Most of **Reducer Engineering** and the **$1.2M Agent Engineering harness** checklist is **already implemented** in this repo — often more maturely than the source essays — on deep-loop reducers/findings-registry, Iron Law / Completion Verification, deep-review fresh evaluators, handover/continuity, Documentation Levels, `renderInlineGates`, and `memory_context` token budgets.

**Do not** port the Twitter `reduce_findings` function or rebuild Default-FAIL / fresh-evaluator / handoff as net-new frameworks.

Four **genuine-gap** opportunities survive prior-art filtering (ranked below). Everything else on the source checklists is **already-exists** or **not-applicable**.

---

## 2. Answers to key questions

### Q1 — Template weight after `renderInlineGates`
Raw `templates/manifest/*.tmpl` totals **5541 LOC**, but scaffolded agent context uses gated renders: e.g. `spec.md.tmpl` 875→144 (L1); combined core L1 set ≈ **558 lines**, not 5541. [SOURCE: measured renders via `inline-gate-renderer.ts:182`] [SOURCE: `create.sh:981`] [SOURCE: `SKILL.md:452`]

**Remaining gap:** ungated optional docs — especially `research.md.tmpl` (~945 lines / ~21.8k chars at L1/L2/L3).

### Q2 — Reducer Engineering vs prior art
Deterministic validate→dedup→contradiction before synthesis **already ships** in `system-deep-loop` (`reduce-state.cjs`, per-mode `*-reducers`, `contradiction-supersession`, findings-registry). Template IF-gating is the templates-surface analogue. **Class:** already-exists / not-applicable to reinvent.

### Q3 — Agent Engineering harness vs doc-logic
| Pattern | In-repo mapping | Class |
|---------|-----------------|-------|
| Default-FAIL | Iron Law + Completion Verification + `validate.sh --strict` | already-exists |
| Fresh-context evaluator | deep-review LEAF, read-only, fresh window | already-exists |
| Self-authored handoff | `handover.md` + continuity ladder | already-exists |
| Complexity-matches-task | Levels 1–3+ + `recommend-level` | already-exists |
| Machine scope adherence | Prompt SCOPE LOCK only; `validate.sh` has no In Scope path check | **genuine-gap** |

### Q4 — Memory token-budget / dedup
- `memory_context`: **already-exists** (`enforceTokenBudget`, mode budgets 800–3500). [SOURCE: `memory-context.ts:1107-1145,2014`]
- Dedup: RRF ID + session dedup + MMR — **already-exists**. [SOURCE: `rrf-fusion.js:110`] [SOURCE: `SKILL.md:427`]
- Direct `memory_search`: **genuine-gap** — no `enforceTokenBudget` despite L2 3500 advertisement. [SOURCE: negative grep on `memory-search.ts`; layer budget at `layer-definitions.ts:50-58`]

### Q5 — Shortlist + refutations
See §§3–4.

---

## 3. Ranked implementable shortlist

| Rank | Opportunity | Axis | Surface | Class | Blast-radius | Evidence |
|------|-------------|------|---------|-------|--------------|----------|
| **1** | Add level IF-gates / lean L1 stubs for ungated optional templates (`research.md.tmpl` first; consider `handover.md.tmpl` / `resource-map.md.tmpl`) | a context-reduction | templates | genuine-gap | Low–med | iter1: research.md.tmpl L1=945 lines |
| **2** | Apply shared `enforceTokenBudget` / `getTokenBudget('memory_search')` at end of `handleMemorySearch` | a context-reduction | context-system | genuine-gap | Low | memory-search lacks budget; memory-context.ts:2014 has it |
| **3** | Optional validate/CI gate: working-tree paths ⊆ `spec.md` In Scope / Files to Change | b plan-adherence | doc-logic | genuine-gap | Med | validate.sh has no scope rules; SCOPE LOCK is prompt-only |
| **4** | Authoring checklist/tooling: expose `--level N` rendered view; document raw `.tmpl` as maintainer-only | a+b | templates + doc-logic | genuine-gap | Low | SKILL.md:452,475 prompt-only |

**Go/no-go lean for a follow-up `/speckit:plan`:** CONDITIONAL-GO on ranks 1–2 (low blast, high clarity); rank 3 needs design for exemptions; rank 4 is documentation/tooling polish.

---

## 4. Refutation list (cargo-cult guards)

| Source idea | Class | Why (evidence) |
|-------------|-------|----------------|
| Port Twitter `reduce_findings` into speckit | already-exists / not-applicable | deep-loop reducers + findings-registry + contradiction-supersession |
| New Default-FAIL framework | already-exists | `AGENTS.md:11` Iron Law; Completion Verification |
| New fresh-context evaluator | already-exists | `deep-review/SKILL.md:298,372` |
| New self-authored progress/handoff file | already-exists | `handover.md.tmpl`; continuity ladder |
| New complexity-matches-task heuristic | already-exists | Levels + `recommend-level` + phase qualification `SKILL.md:466` |
| Cut 5541 LOC templates as primary win | not-applicable | `renderInlineGates` already collapses core docs |
| Add token budget to `memory_context` | already-exists | `memory-context.ts:2014` + mode budgets |
| Gate 3 as synthesis token reducer | not-applicable | `gate-3-classifier.ts:838` is write-boundary routing |
| Memory claim-normalize ledger | not-applicable | Overlaps MMR + deep-loop claim relationship reducers |

---

## 5. Classification index (all findings)

| ID | Finding | Class | Axis | Surface |
|----|---------|-------|------|---------|
| F1 | Raw 5541 ≠ scaffolded context | already-exists | a | templates |
| F2 | `renderInlineGates` collapses core docs | already-exists | a | templates |
| F3 | create.sh/SKILL mandate gated scaffold | already-exists | a+b | templates+doc-logic |
| F4 | Ungated `research.md.tmpl` (~945 lines all levels) | genuine-gap | a | templates |
| F5 | No machine gate vs raw `.tmpl` Read | genuine-gap | a+b | templates+doc-logic |
| F6 | Deep-loop reducers / contradiction-supersession | already-exists / n/a reinvent | c | context-system |
| F7 | Iron Law = Default-FAIL | already-exists | b | doc-logic |
| F8 | deep-review = fresh evaluator | already-exists | b | doc-logic |
| F9 | handover = self-authored handoff | already-exists | b | templates+doc-logic |
| F10 | Levels = complexity-matches-task | already-exists | c | doc-logic |
| F11 | Gate 3 write boundary (not token reducer) | already-exists / n/a | b | doc-logic |
| F12 | validate.sh lacks scope path allowlist | genuine-gap | b | doc-logic |
| F13 | Plan adherence mostly prompt-enforced | genuine-gap | b | doc-logic |
| F14 | memory_context budgets | already-exists | a | context-system |
| F15 | memory_search lacks enforceTokenBudget | genuine-gap | a | context-system |
| F16 | RRF/session/MMR dedup | already-exists | a | context-system |

---

## 6. Iteration trail

| # | Focus | newInfoRatio | Status |
|---|-------|--------------|--------|
| 1 | Template weight + Reducer prior art | 1.00 | complete |
| 2 | Harness ↔ Gate3/Levels/validate/Iron Law | 0.85 | complete |
| 3 | Memory budgets + shortlist/refutations | 0.55 | complete |

---

## 7. Non-goals honored

- No implementation outside lineage `artifact_dir`.
- No reinvention of deep-loop reducers or findings-registry.
- Forced depth to 3 iterations under `max-iterations` stop policy.

---

## 8. Handoff for parent merge / `/speckit:plan`

Prefer planning packets for **shortlist ranks 1–2** first. Treat refutation list as hard blockers against cargo-cult PRs. Parent fan-out merge should reconcile this lineage with sibling executors before any implementation packet is scoped.
