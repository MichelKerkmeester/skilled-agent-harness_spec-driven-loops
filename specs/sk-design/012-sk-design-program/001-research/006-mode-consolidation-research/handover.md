---
title: "Handover: sk-design mode-consolidation research"
description: "State handover for the five-iteration mode-consolidation deep-research run: all iterations complete, synthesis pending, verdicts and resume path recorded."
importance_tier: "important"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/006-mode-consolidation-research"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Research complete: 5/5 iterations plus synthesis; packet committed"
    next_safe_action: "Consume research.md from the implementation packet; no further research work required"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/research/lineages/sol/iterations/"
    completion_pct: 100
    open_questions:
      - "Implementation reversed ranked recommendation 3: audit was embedded under interface, not extracted standalone"
    answered_questions:
      - "Foundations fate: fold into design-interface as a named subworkflow"
      - "Styles fate: stays hub-shared, engine facade is the compatibility boundary"
---

# Handover: sk-design mode-consolidation research

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## 1. OVERVIEW

A five-iteration `/deep:research` run investigating how to consolidate the `sk-design` hub from seven modes/assets down to a target four. **All five iterations completed with evidence; the synthesis step (`research.md`) has not run.** The loop was stopped deliberately by operator instruction, not by failure.

| Field | Value |
|-------|-------|
| **Packet** | `.opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/` |
| **Worktree** | `.worktrees/0103-sk-design-structure-naming-cleanup` |
| **Branch** | `sk-design/0103-structure-naming-cleanup` @ `0c4bfed57d` (0 ahead of `origin/skilled/v4.0.0.0`) |
| **Executor** | `cli-codex` · `gpt-5.6-sol` · `xhigh` · `standard` tier · `workspace-write` |
| **Iterations** | 5 of 5 complete (forced via `--stop-policy=max-iterations`) |
| **Synthesis** | Complete — `research/research.md` (280 lines) and `research/resource-map.md` (120 lines) |
| **Committed** | Yes, on `sk-design/0103-structure-naming-cleanup`. |

---

## 2. CURRENT STATE

### What exists

All artifacts live under `research/lineages/sol/`:

| Iteration | Focus | Lines | newInfoRatio |
|-----------|-------|-------|--------------|
| 001 | Physical inventory + structural utilization baseline | 95 | 1.00 |
| 002 | Styles query/hydration + ownership boundary | 50 | 0.84 |
| 003 | Foundations invocation + ownership boundary | 60 | 0.80 |
| 004 | Audit workflow fate + consolidation boundary | 96 | 0.78 |
| 005 | Build-ready migration plan | 319 | 0.65 |

Also present: `deep-research-state.jsonl` (5 iteration records, all `status: complete`), `deltas/iter-00{1,2}.jsonl`, `findings-registry.json`, `deep-research-strategy.md`, `deep-research-dashboard.md`, `prompts/`.

The new-info ratio decayed 1.00 → 0.65 and never approached the 0.05 convergence floor, so every iteration contributed genuine new evidence. No padding.

### Completed after this handover was first written

The loop was stopped at 5/5 iterations with synthesis pending; the synthesis subsequently ran. `research/research.md` (the converged, ranked synthesis) and `research/resource-map.md` both exist, and packet `description.json` / `graph-metadata.json` were backfilled. The packet is committed. Nothing is outstanding on the research side.

### Processes

All run processes were stopped with PID-scoped kills (driver tree of 11 PIDs, verified dead). One unrelated `codex exec` at `effort=high` belongs to a concurrent session and was deliberately left running.

---

## 3. RESEARCH VERDICTS

These are the substantive findings. They are evidence-cited in the iteration files; the citations are not reproduced here.

### The target-4 is contradicted on one point

The original goal was four survivors: `design-interface`, `design-motion`, `design-md-generator`, `design-mcp-open-design`. The research **agrees on three of four decisions but rejects folding `design-audit` away.**

| Surface | Verdict | Rationale |
|---------|---------|-----------|
| `design-interface` (62) | **Keep** as hub mode | unchanged |
| `design-motion` (39) | **Keep** as hub mode | unchanged |
| `design-md-generator` (115) | **Keep** as hub mode | unchanged |
| `design-mcp-open-design` (43) | **Keep** as paired transport | unchanged |
| `design-foundations` (48) | **Fold** into `design-interface/foundations/` as a named internal subworkflow; `/interface:foundations` survives as a staged alias | Its three procedure cards are invoked only by the foundations workflow, never by ordinary interface work. Distinct workflow, not a distinct skill identity. |
| `design-audit` (70) | **Extract to a standalone skill** at `.opencode/skills/design-audit/` — do NOT fold into interface | Owns a private P0–P3 severity model, a five-dimension `/20` score, the AI-fingerprint registry with fixture-parity contracts, and two Bash-dependent executable gates. Interface and motion both declare `toolSurface.forbidden: ["Bash"]`, so folding audit in would silently strip that seam. |
| `styles/` (7,812) | **Stays hub-shared** in place; the engine facade is the load-bearing boundary, not the directory | Five modes import the same `runQuery`/`runHydrate` facade. Moving it under md-generator would invert four sibling dependencies. |

**Net topology:** the hub keeps ONE advisor-visible `sk-design` identity with four modes, plus foundations folded under interface and styles as a shared non-mode package. Audit gains its own advisor entry as a standalone skill, with `/interface:audit` kept as a transition alias.

### Migration plan (iteration 5)

Six ordered stages with per-stage rollback conditions and verification gates:

- **Stage 0** — Preflight snapshot of every currently-green test (the rollback anchor).
- **Stage 1** — Fold foundations into interface; keep `/interface:foundations` alias. *Smaller blast radius; validates the staged-alias pattern Stage 2 reuses.*
- **Stage 2** — Extract audit to a standalone skill; keep `/interface:audit` alias. Move the AI-fingerprint catalogue and its two parity scripts **atomically**.
- **Stage 3** — Repoint sibling discriminators.
- **Stage 4** — Styles manifest policy (single shared manifest; no per-consumer per-bundle shims).
- **Stage 5** — Deprecation, after a minimum 30-day alias window with operator traffic observation.

Ordering is load-bearing: Stage 1 before Stage 2.

### Pre-existing defects found (independent of consolidation)

1. `SKILL.md` documents `styles/_engine` and `styles/_db`, but all five consumers import `styles/lib/engine` and `styles/lib/database`.
2. `hub-router.json` sets `defaultMode: null` while hub prose claims generic prompts default to interface.

---

## 4. NEXT STEPS

Research is finished. What remains is downstream consumption, tracked in the implementation packet `012-sk-design-program/006-design-mode-consolidation` (main tree):

1. **Add the 006 row** to the research-theme phase map in `001-research/spec.md` (it currently lists phases 1–5 only).
2. **Validate** — `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → expect Errors:0. Run from the MAIN tree; this worktree has no built `dist/`.
3. **Reconcile the audit divergence.** The implementation embedded audit as an interface-owned subworkflow, reversing ranked recommendation 3 (extract standalone). The reversal is defensible: the retired `design-audit` mode already declared `forbidden: [Write, Edit, Bash]` with an empty `bashAllowlist`, identical to the new subworkflow's `toolSurface`, so no Bash authority was lost. Record that ratification in the implementation packet's decision record rather than reopening the question.

### Resume command (synthesis only)

Run detached from the repo root of the 0103 worktree. `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` are required or the dispatched child halts on the documentation gate.

```bash
PKT=".opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research"
EXECUTORS='[{"kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":"xhigh","serviceTier":"standard","sandboxMode":"workspace-write","timeoutSeconds":3600,"iterations":5,"label":"sol"}]'
TOPIC="<charter> All 5 forced iterations are complete in lineages/sol. Do NOT run another research iteration. Run synthesis only: merge the lineage registry, emit resource-map.md, and compile the canonical research.md from the existing iteration findings."

MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run --command deep/research \
  "$TOPIC :auto --spec-folder=$PKT --max-iterations=5 --stop-policy=max-iterations --executors=$EXECUTORS --concurrency=1" </dev/null
```

---

## 5. KNOWN ISSUES AND GOTCHAS

These cost real time this session. Do not rediscover them.

| Issue | Detail |
|-------|--------|
| **Stray dependency bump** | `.opencode/package.json` and `package-lock.json` show `@opencode-ai/plugin` `1.15.12` → `1.18.4`. This is opencode runtime auto-update churn, NOT research work. Revert with `git checkout HEAD -- .opencode/package.json .opencode/package-lock.json` before committing. |
| **Session teardown kills detached work** | The first run died at 1/5 iterations with zero error events — heartbeats were clean right up to the kill. Cause: it was launched as a session-tied background task, and the previous session's teardown reaped the whole process tree. |
| **`setsid` does not exist on macOS** | Use the double-fork launcher at `scratchpad/detach-launch.py`, which does the `os.setsid()` dance and verifies `PPID=1`. A session-tied `nohup ... &` is NOT sufficient. |
| **One iteration per invocation** | The deep-research orchestrator has a bounded tool-call budget and advances roughly one iteration per `opencode run`, exiting `STATUS=OK` with a "continue iteration N" pointer. Reaching N iterations needs repeated sequential invocations — see `scratchpad/drive-research.sh` for the driver pattern (with a no-progress guard). |
| **`--executor=cli-codex` silently falls back to native** | The single `--executor` flag only accepts `native \| cli-opencode \| cli-claude-code`. `cli-codex` is reachable ONLY via the `--executors=<json>` fan-out escape hatch, which runs `parseExecutorConfig`. A first run silently executed on the native model because of this. Always verify the written `deep-research-config.json` shows `"kind": "cli-codex"`. |
| **Service tier values** | `SERVICE_TIERS = ['priority', 'standard', 'fast']`. "Normal speed" is `standard`, not `fast`. |
| **Executor provenance is not written to state records** | Iteration records in `deep-research-state.jsonl` carry `executor: null` despite a correct CLI dispatch. Route-proof must be confirmed from the run log (`[✓] Dispatch iteration N via cli-codex (...)`) or the process table — the JSONL does not self-evidence it. |
| **Stale lineage lock** | `research/lineages/sol/.deep-research.lock` may persist after a kill. Verify the owner PID is dead and the TTL (300000 ms) has expired before removing it. |
| **Validation needs the MAIN tree** | This worktree has no built `scripts/dist/`, so `validate.sh` reports false errors and `generate-context.js` is absent. Run both from the main working tree against this worktree's paths. |

---

## 6. RELATED DOCUMENTS

- **Charter and research questions:** `spec.md` in this packet.
- **Research theme parent:** `../spec.md` (its phase map still needs a row for this packet).
- **Program parent:** `../../spec.md`, `../../retrospective.md`.
- **Prior related research:** `../001-research-style-database/`, `../002-research-design-commands/`.
- **Iteration evidence:** `research/lineages/sol/iterations/iteration-00{1..5}.md`.
