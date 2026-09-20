---
title: "Implementation Plan: headless model-matrix hardening for the deep-alignment loop"
description: "Three-phase plan — (A) alignment-only driver execution-forcing to kill the narrate-then-stop stall, (B) external GPT-executor wiring ported from deep-review including a shared fanout-run loop-type extension, (C) a bounded representative model-matrix e2e proof — with quality gates, affected surfaces, testing strategy, and rollback."
trigger_phrases:
  - "deep-alignment hardening plan"
  - "deep-alignment executor wiring plan"
  - "deep-alignment model matrix plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/015-headless-model-matrix-hardening"
    last_updated_at: "2026-07-14T08:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored implementation plan (3 phases, affected surfaces, gates, rollback)"
    next_safe_action: "On approval, execute Phase A"
---
# Implementation Plan: headless model-matrix hardening for the deep-alignment loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fix the deep-alignment loop in three ordered phases, cheapest-and-lowest-blast first:

- **Phase A — Driver execution-forcing (low blast, alignment-only, live path).** Add a forcing function so a headless GPT-5.6 session model executes the YAML loop rather than narrating a handoff. This alone satisfies the driver axis and unblocks the downstream audit.
- **Phase B — External-executor wiring (med-high blast, shared runtime).** Graft deep-review's executor-resolution / audit / dispatch-branch into deep-alignment, author the missing prompt-pack, extend the shared `fanout-run.cjs` for `loop-type alignment`, and only then unlock the command-surface executor flags.
- **Phase C — Model-matrix proof (premium budget).** Prove the loop e2e across a bounded, representative driver + leaf-executor subset; iterate Phase A/B until the subset passes.

The engine scripts and adapters are unchanged and proven; this plan touches only the orchestration and dispatch surface plus two shared runtime files (additively).

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command / Evidence | Must Pass |
|------|--------------------|-----------|
| Contract drift | `node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | OK for touched commands |
| Doc validate (command) | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type command .opencode/commands/deep/alignment.md` | exit 0 |
| Runtime unit tests | deep-loop runtime vitest (`fanout-run`, `executor-config`, `executor-audit`) | green, incl. new alignment cases |
| Sibling regression baseline | deep-review / deep-research existing gates re-run before + after Phase B | no delta |
| Live driver smoke (Phase A) | `opencode run --command deep/alignment :auto …` reaches REPORT + writes `alignment/` | ≥1 real finding, non-empty state |
| Spec strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | Errors:0 |

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The router (`alignment.md`) is a thin, hand-authored, live surface (the compiled-contract injection layer is dormant). In `:auto` the session model IS the loop runner: it must Read `deep_alignment_auto.yaml` and emit each step's tool calls, dispatching the `deep-alignment` leaf per iteration. Today that dispatch is native-only.

Phase A makes execution mandatory at the router boundary (forced first tool call + a side-effecting step-0) so a stalled driver is impossible-to-miss (leaves partial `alignment/` state) rather than silent.

Phase B mirrors deep-review's proven executor topology: `config.executor` → `parseExecutorConfig` → `branch_on kind` (native Task dispatch | `cli-codex` / `cli-opencode` audited CLI dispatch) → `verify-iteration` + executor audit. Codex participates only as a leaf executor (no `codex exec --command` driver path exists); opencode participates as driver (via `--command`) and as leaf (only via parallel-detached fan-out, per the self-invocation guard). The shared `fanout-run.cjs` gains an `alignment` loop-type branch so codex/opencode leaf lineages can run.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Phase | Blast | Change |
|---------|-------|-------|--------|
| `commands/deep/alignment.md` | A, B | Low (alignment-only, live) | Forcing directive (A); executor flags in argument-hint + mode-routing (B, last) |
| `commands/deep/assets/deep_alignment_auto.yaml` | A, B | Low (alignment-only, live) | Mandatory step-0 (A); executor-resolution + prompt-pack render + dispatch-branch + audit steps (B) |
| `deep-alignment/assets/alignment_prompt_pack.md.tmpl` | B | New file | Prompt-pack for CLI leaf executors |
| `runtime/scripts/fanout-run.cjs` | B | **Med-High (shared: research/review)** | Additive `alignment` loop-type + alignment convergence flags |
| `runtime/lib/deep-loop/executor-config.ts` | B | **Med (shared)** | Additive `ultra` reasoning-effort enum value |
| `runtime/lib/deep-loop/executor-audit.ts` | B | None | Reused as-is (no change) |

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Driver execution-forcing
1. Rewrite the `AUTONOMOUS EXECUTION DIRECTIVE` in `alignment.md` (~72-84): (a) forced first tool call — next output MUST be a `Read` of the auto YAML followed immediately by executing its steps, no prose first; (b) delete the defer-able "the YAML owns the loop" phrasing, replace with "YOU execute the YAML yourself; there is no separate runner."
2. Add a mandatory side-effecting step-0 in `deep_alignment_auto.yaml` (surfaced in the directive) so a driver that starts leaves detectable `alignment/` state.
3. Live-smoke with 2-3 driver slugs to confirm REPORT is reached; confirm sibling loops untouched.

### Phase B — External-executor wiring
1. `executor-config.ts`: add `ultra` to the reasoning-effort enum (additive).
2. `deep_alignment_auto.yaml` `step_dispatch_alignment_iteration`: add `resolve_executor`, prompt-pack render, `pre_dispatch_audit` (skip native), `branch_on kind` (native | cli-codex | cli-opencode audited dispatch with `--sandbox workspace-write`), `post_dispatch_validate` (alignment route-proof), `record_executor_audit`.
3. Author `alignment_prompt_pack.md.tmpl`; wire the render step to populate `{prompt_dir}/iteration-{N}.md`.
4. `fanout-run.cjs`: add `alignment` to the active fan-out loop-types + state-log/lineage-path maps + alignment prompt builder + alignment convergence flags.
5. `alignment.md`: unlock executor flags in argument-hint + mode routing (LAST — only after 2-4 land, honoring contract-must-match-dispatch).

### Phase C — Model-matrix proof
1. Drivers (axis A, via `opencode run --command`): `{gpt-5.6, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna} × {medium, xhigh}` + the exact `gpt-5.6-luna-fast` repro = **9 runs**.
2. Leaves (axis B, via `fanout-run.cjs`): codex `{gpt-5.5 medium, gpt-5.6-sol xhigh, gpt-5.6-luna max}` + opencode `{gpt-5.6-sol-fast xhigh}` = **4 runs**.
3. **Documented skips (bound cost):** the four Pro-tier drivers reduce to one `gpt-5.6-sol-pro` smoke; `-fast` vs base tested once per family (latency-only difference); terra treated ≈ luna ceiling unless a terra-specific defect appears. Skips are logged, not silent.
4. Capture pass/fail per combo; iterate Phase A/B wording until the representative subset is all-pass.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Unit**: extend deep-loop runtime vitest for the new `fanout-run` alignment loop-type and the `executor-config` `ultra` value; assert `research`/`review` paths unchanged.
- **Integration (live)**: the Phase C matrix is the integration test — each combo must reach REPORT (driver) or complete one audited iteration (leaf) with real findings and non-empty state.
- **Regression baseline**: capture deep-review / deep-research gate results before Phase B and re-run after; require zero delta (additive-only guarantee).
- **Negative**: confirm a `native` executor still rejects non-null model/effort flags (config gating intact).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Proven `deep-review` executor path (port source): `executor-config.ts`, `fanout-run.cjs`, `executor-audit.ts`, `deep_review_auto.yaml`.
- Sound deep-alignment engine substrate: `scoping.cjs`, `partition-corpus.cjs`, `check-convergence.cjs`, adapters (`sk-doc` etc.), `reduce-alignment-state.cjs`, `loop-lock.cjs`, `upsert.cjs`.
- cli-opencode + cli-codex rosters (model/effort ceilings) for the matrix.
- No new third-party dependency.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- All edits are git-tracked; rollback = `git revert` / restore the pre-change `alignment.md`, `deep_alignment_auto.yaml`, `fanout-run.cjs`, `executor-config.ts` and delete the new prompt-pack template.
- Phase A and Phase B are separately committable; Phase A can ship and stand alone (driver axis) if Phase B is deferred.
- Shared-runtime edits (Phase B) are additive; reverting the `alignment` loop-type branch restores the exact prior `research`/`review` behavior. The regression baseline is the proof of a clean revert.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

```
Phase A (driver forcing) ──▶ Phase C driver-axis runs
Phase B (executor wiring) ──▶ Phase C leaf-axis runs
  ├─ executor-config.ts (ultra)  ──▶ deep_alignment_auto.yaml dispatch branch
  ├─ alignment_prompt_pack.tmpl  ──▶ dispatch render step
  └─ fanout-run.cjs (alignment)  ──▶ leaf fan-out lineages
Phase A is independent of Phase B and can ship alone.
```

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

`Phase A directive + step-0` → live driver smoke → (if green, unblocks the downstream audit) → `Phase B executor-config ultra` → `yaml dispatch branch` → `fanout-run alignment` → `command-surface flag unlock` → `Phase C matrix`. The single longest chain is Phase B's dispatch-branch + fanout-run extension feeding the Phase C leaf matrix; Phase A short-circuits to value early.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M1 — Driver drives | ≥2 GPT-5.6 driver slugs reach REPORT headless; siblings unregressed |
| M2 — Executor wired | `cli-codex` leaf dispatch + `fanout-run --loop-type alignment` land; runtime vitest green |
| M3 — Matrix proven | Representative driver + leaf subset all-pass; results table captured |
| M4 — Shipped | strict validate Errors:0; 059 parent rolled up; FF-pushed |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:ai-execution -->
## 11. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read the target file before editing; confirm the pre-change snapshot exists.
- Confirm the regression baseline (deep-review/deep-research gates) is captured before any shared-runtime edit.
- Confirm Gate 3 is answered (this packet) and the change is in scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Additive-only shared edits | `fanout-run.cjs` / `executor-config.ts` edits must not alter existing `research`/`review` branches |
| Contract-matches-dispatch | Do not advertise executor flags in `alignment.md` until the YAML branch exists |
| No custom dispatcher | Reuse the shared runtime; never fork a parallel lane/iteration dispatcher |
| Sandbox discipline | CLI leaf dispatch uses `--sandbox workspace-write`; every `opencode run` uses `</dev/null` |

### Status Reporting Format
Report per phase: what changed (file:line), gate results (command + outcome), matrix pass/fail table, and confirmed-vs-inferred separation for every load-bearing claim.

### Blocked Task Protocol
On a failing gate, an unproven-loop wiring bug, or a model that will not drive after wording iteration: HALT, record the exact symptom + command output, and escalate with the decision needed — do not silently substitute a manual workaround for the named workflow.

<!-- /ANCHOR:ai-execution -->
