# Iteration 003 — KQ3: The safety and governance model

## Focus

The consolidated safety model that governs every detector and fix from every lineage. Four components: the `fixClass` taxonomy (safe / guarded / report-only), the per-stage rollback, the human-in-the-loop boundaries, and the idempotency + drift guards.

## Component 1 — The `fixClass` taxonomy (one classification, every detector)

The classification is a property of the FIX, not the detector (dq-automation-impl: "deny-by-default allow-list"). Three classes, frozen in `detector-registry.ts`:

- **safe** = deterministic, length-neutral, metadata-only. Auto-applies in local `--apply` / `--confirm`. Members: HVR em-dash/semicolon/Oxford swaps (fence-aware, length-neutral), anchor close, enum case-normalize, frontmatter→description trigger propagation. **Never touches an authored body.**
- **guarded** = deterministic but higher blast radius; requires `--confirm` or a human approval gate. Members: warn→error gate flips, batched backfill apply, the `/doctor data-quality` APPLY tier. `--confirm` unlocks the safe tier ONLY, never the risky tier (dq-automation-impl B2 rail).
- **report-only** = anything touching an authored BODY, anything LLM-generated, anything retrieval-class. NEVER auto-applies; produces a queue item or a candidate diff a human commits. Members: cross-doc contradiction findings (N5a), drift alerts (N6a), the refinement_queue (B3), suggest-only rewrite diffs (N3b), test/example generation (N6b), LLM-judge governance scores (N2a), every retrieval candidate until C2.

**The two structural invariants** (RAIL-1 + RAIL-2, made mechanical):
- INV-1: a fix touching an authored body ⇒ never `safe`. Enforced structurally: the `computeAuthoredDocQuality` wrapper throws on `full-auto`; `quality-loop.ts:463-468` budget-trim stays quarantined to memory-save (dq-automation-impl §5).
- INV-2: a retrieval-class change ⇒ never promoted without a prod@3 read (C2 gate, S14).

## Component 2 — Per-stage rollback (every stage names its undo before it runs)

Consolidated from the per-stage rollback columns of parent §4 and dq-automation-impl §4. The rollback class is a function of what the stage lands:

| Stage class | Lands as | Rollback |
|---|---|---|
| Census (S0) | read-only | none needed (mutates nothing) |
| Engine/modules (S1) | dormant code | delete modules (dormant if unwired) |
| Corpus sweep of known defect (S2) | tracked file edits | git revert |
| On-write warn wiring (S3) | hook lines | revert hooks (single commit) |
| New CI workflow (S4) | `.github/workflows/*.yml` | delete workflow |
| Safe-fix batch apply (S5, S7) | git commits | `git revert` the fix batch |
| New doctor route (S6) | `_routes.yaml` + asset | drop route + asset, re-run `route-validate.py` |
| Warn→error flip (S8) | strict failure | revert to warn + restore bypass (single commit) |
| Novel report-only detector (S9-S11) | telemetry / queue items | flag off / disable detector / clear queue |
| Retrieval re-index (S16) | new vectors | `embedding_context_version` fallback to prior vectors (no data migration) |

The governance rule: **name the rollback before the stage runs.** A stage with no clean single-step rollback does not ship; it is re-scoped until it has one. Every retrieval stage's rollback is a version-field fallback specifically so a bad re-index never strands the corpus.

## Component 3 — Human-in-the-loop boundaries

Four boundaries, from fully-automated to always-human:

1. **Fully automated (no human):** safe-class fixes in local `--apply`; CI report generation. **CI NEVER auto-commits** — a corpus-wide fix in CI is an unbounded blast radius (dq-automation-impl: "CI stays report-only").
2. **Human-gated (`--confirm` / approval):** guarded-class — gate error-flips, backfill batch apply, doctor APPLY. A human triggers; the fix is still deterministic.
3. **Always human-authored final:** anything touching an authored body — test-gen, suggest-only diffs, contradiction resolutions, LLM-judge-driven edits. These produce a candidate/queue item; a human writes the commit. This is RAIL-1 expressed as a workflow boundary.
4. **Release-reviewer gate:** retrieval promotion. A human reviewer MUST read the prod-mode completeRecall@3 column, never eval-mode at K (parent: "a release reviewer must read the prod-mode column or repeat the 028 saturation mistake"). This is RAIL-2 expressed as a review boundary.

## Component 4 — Idempotency + drift guards

**Idempotency** (a sweep re-run on a clean corpus is a no-op):
- skip-if-conformant + `content_hash` guard (`memory-save.ts:546`) + atomic writes (`generate-context.ts:398`) + batched git commits (dq-automation-impl B1).
- The property: running the sweep twice produces zero diffs the second time. This is what makes the standing scheduled sweep safe to run on cron.

**Drift guards** (four standing instruments, each watching a different drift):
- **Embedding drift (N6a):** per-chunk `embedding_context_version` + model/normalizer fingerprint; alert on a mixed-regime corpus. Protects every prod@3 read. (S9.)
- **Coverage drift:** refuse to trust recall while coverage < threshold (the coverage guard, S16 dependency).
- **Storage drift:** read-time `content_hash` integrity verification — recompute on read, catch silent DB/migration corruption inside the existing trust boundary (parent GO-on-cost; `vector-index-schema.ts:771-785`).
- **Cross-copy drift:** the triple-copy trigger-vocabulary (CLAUDE.md prose / `gate-3-classifier.ts:67-72` / advisor `prompt-policy.json` WORK_INTENT_VERBS) guarded by the `rule-canary-sync` cross-copy pattern with a sanctioned-delta allow-list (dq-skilldoc X1).

## The governance model in one sentence

Every fix is classified by its blast radius (safe/guarded/report-only) with two structural invariants (no body auto-fix, no retrieval promotion without prod@3); every stage names its single-step rollback before it runs; four human boundaries escalate from auto-safe-fix to release-reviewer; and four standing drift guards keep the corpus and its measurement honest over time.

## Dead Ends

- Per-detector ad-hoc safe/risky flags. Classification is a property of the FIX; a per-detector flag lets two detectors disagree on the same fix shape. One frozen deny-by-default registry (dq-automation-impl iter 2).
- Letting `--confirm` unlock risky/body-touching fixes. `--confirm` gates the safe tier only; risky/none always report-only (dq-automation-impl iter 3).

## Sources

- `../dq-automation-impl/research.md` §3 (one engine), §5 (two hard rails), §4 (rollback column)
- `../../research.md` §4 (per-stage rollback), §2 (read-time content_hash GO-on-cost)
- `../dq-novel-oob/research.md` §4 (report-only/additive/human-gated novel slate), N6a drift monitor
- `../dq-skilldoc-cmd-ctx/research.md` X1 (rule-canary-sync cross-copy); `memory-save.ts:546`; `generate-context.ts:398`; `vector-index-schema.ts:771-785`

## Assessment

newInfoRatio 0.72 — the safety model consolidates into four named components. The key consolidation: the `fixClass` taxonomy unifies EVERY detector from all four building-block lineages under one frozen registry, and the two rails become two structural invariants (INV-1, INV-2) plus two workflow boundaries (always-human-authored, release-reviewer). Drift is not one guard but four standing instruments.
