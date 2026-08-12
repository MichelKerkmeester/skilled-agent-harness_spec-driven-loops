---
title: "Implementation Plan: Spec-Kit Template & Context Reducer Research"
description: "Execution plan for the 10-iteration, 4-model deep-research loop: exact launch command, executor matrix, forced-depth mechanics, verification, and the post-research path."
trigger_phrases:
  - "spec templates context reducer plan"
  - "deep research launch matrix speckit"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-templates-and-context-reducer"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored launch plan and executor matrix"
    next_safe_action: "Launch deep-research with 4-lineage matrix"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-033-templates-context-reducer"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Spec-Kit Template & Context Reducer Research

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run one forced-depth `/deep:research` loop as **4 independent lineages** (one per model), summing to **10 iterations**, over the `system-speckit` template + documentation-logic + context/memory surface. The two `context/*.md` docs are the seed concepts. Output is a ranked, evidence-cited shortlist of in-repo optimizations (plus a refutation list), report-only — no runtime changes in this packet.

Mechanics verified against live contracts, not assumed:
- Multi-lineage fan-out is supported (`deep-research/SKILL.md` §"Multi-lineage fan-out is SUPPORTED").
- Per-`--executor` `--iters=N` sets that lineage's iteration cap (`fanout-run.cjs:1105`).
- `--stop-policy=max-iterations` makes convergence telemetry-only, forcing full depth (`fanout-run.cjs:1107`; command `research.md` §"Stop Policy Flag").
- Model ids verified in `cli-devin/SKILL.md` §"Model Selection" and `cli-cursor/SKILL.md` §"Model Selection — Enforced Allowlist".
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Loop completeness | 10/10 iterations on disk across 4 lineages; convergence report stopReason `maxIterationsReached` |
| Finding provenance | every finding cites `file:line` or `url` |
| Prior-art classification | every recommendation tagged {already-exists / genuine-gap / not-applicable} with evidence |
| No-mutation proof | `git status` clean outside `research/**` + the single spec findings fence |
| Executor fidelity | no unapproved model substituted; each lineage ran its assigned model id |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Executor matrix (10 iterations, no early convergence)

| Lineage label | Executor | Model id (verified) | Iters | User request |
|---------------|----------|---------------------|-------|--------------|
| `glm` | cli-devin | `glm-5-2-max` | 3 | "GLM 5.2 max through cli devin" |
| `grok` | cli-cursor | `cursor-grok-4.5-high` | 3 | "grok 4.5 max through cli cursor" (max → high, top tier) |
| `composer` | cli-cursor | `composer-2.5` | 2 | "Composer 2.5 for 2 iterations" |
| `swe` | cli-devin | `swe-1-7` | 2 | "swe 1.7 for 2 iterations" (full SWE tier) |
| **Total** | | | **10** | |

`--concurrency=2` keeps 2 lineages in flight; `--max-iterations=3` is the ceiling (largest single lineage). cli-devin autonomy is set via `--permission-mode` (no reasoning-effort flag); cli-cursor effort is baked into the enumerated id (no bracket syntax).

### Launch command (embedded in the goal prompt)

```
/deep:research:auto "<research charter — see goal prompt>" \
  --spec-folder=specs/system-speckit/033-spec-templates-and-context-reducer \
  --stop-policy=max-iterations --max-iterations=3 --concurrency=2 \
  --executor=cli-devin  --model=glm-5-2-max          --iters=3 --label=glm \
  --executor=cli-cursor --model=cursor-grok-4.5-high --iters=3 --label=grok \
  --executor=cli-cursor --model=composer-2.5         --iters=2 --label=composer \
  --executor=cli-devin  --model=swe-1-7              --iters=2 --label=swe
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Set goal** — operator sets the goal prompt (< 4k chars) as the active objective.
2. **Launch** — invoke the command above via `/deep:research:auto` (direct invocation; not pasted inline). `:auto` pre-resolves Gate 3 to the bound spec folder.
3. **Monitor** — watch the 4 lineages; confirm each runs its assigned model and no child stalls at 0% CPU. 3 consecutive failures → stuck recovery.
4. **Synthesis** — the workflow synthesizes `research/research.md`, refreshes `findings-registry.json` + dashboard, and writes the single findings fence into `spec.md`.
5. **Review** — operator + a fresh pass review the ranked shortlist and refutation list.
6. **Next** — if opportunities survive review, `/speckit:plan` scopes a separate implementation packet. This packet does NOT implement.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification is the deep-research quality-gate suite (not unit tests): per-iteration markdown + JSONL + reducer refresh; final convergence report; source-diversity / focus / no-weak-single-source guards. Post-run, `git status` proves no runtime file changed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `/deep:research` command + `system-deep-loop/deep-research` workflow YAML.
- `cli-devin` + `cli-cursor` skills, authenticated.
- The two `context/*.md` seed docs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research is additive and report-only. Rollback = delete `research/**` and revert the single `spec.md` findings fence. No runtime state to unwind. No commit/push without explicit operator go-ahead.
<!-- /ANCHOR:rollback -->
