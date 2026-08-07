---
title: "Goal: sk-design hallmark design-system adoption"
description: "Structured objective, decision record, per-lane build status, quality-pass results, and prioritized remaining work for the sk-design hallmark design-system adoption. The 5-lane build + deep-review + remediation are shipped to v4; the deep-alignment conformance pass is partially complete."
trigger_phrases:
  - "hallmark goal"
  - "hallmark objective and status"
  - "hallmark adoption progress"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system"
    last_updated_at: "2026-07-23T07:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the structured hallmark goal"
    next_safe_action: "Finish the deep-alignment conformance pass"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hallmark-goal-session"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---

# Goal: sk-design hallmark design-system adoption

## 1. Objective & origin

**Objective:** adopt the useful patterns of the external (MIT-licensed) Hallmark design skill into `sk-design`, clean-room (adapt/learn, never verbatim copy), as five themed lanes under `012-sk-design-program/004-hallmark-design-system/`.

**Origin:** the 012-program merge produced a program retrospective that flagged the hallmark-design-system theme as **entirely Planned, never built** — despite a Complete research packet backing it. This goal is the build of that theme, plus a quality pass (deep-review + deep-alignment) over the result.

**Grounding:** `001-research/004-hallmark-design-skill-research` (Complete; dual 10-iteration GPT-5.6-SOL research lineages; a reuse matrix + an MIT verdict = "prefer clean-room ADAPT/LEARN over COPY; external assets are SKIP"). The five lanes each trace to a ranked research recommendation.

## 2. Decisions (operator, this program)

| # | Decision | Choice |
|---|---|---|
| D1 | Add a 5th phase for the research's ranked #4-5 compositionDNA gap (unplanned by the original 4 lanes)? | **Spec + build it** → `005-measured-composition-and-retrieval-facets` |
| D2 | Lane 4 (brand-first) — research-ranked last, highest boundary risk, unmet demand question | **Build last, extra boundary rigor** (adversarial tests as the gate) |
| Scope | What the deep-loops examine | Hallmark build + the sk-design surfaces it touched |
| Authority | Deep-alignment conformance authority | sk-design canon + spec-kit templates → resolved to **sk-doc** (docs) + **sk-code** (code) lanes |
| Workspace | Where the build runs | Isolated worktrees from v4 (build `0099`; fix + audits `0101`) |
| Execution | Build + verify model | **GPT-5.6-SOL-high-fast** builds (cli-codex, file-authoring, no git) → **Sonnet-5-xhigh** adversarial verify (Agent tool) → orchestrator runs gates + commits |

## 3. Build status — five lanes (all shipped to v4)

| Lane | Delivered | Commit | Verify verdict |
|---|---|---|---|
| **1 · surgical-fixes** | 5 clean-room heuristics into 9 existing design-mode reference files; preserves evidence-first P0-P3, forbids Hallmark's all-or-nothing gate | `b986789b8c` | PASS (fixed an honesty-framing defect; ai-fingerprint checkers pass) |
| **2 · evidence-envelopes** | Owned-asset manifest + motionCharacter handoff + evidence-gated measured Motion section through the design-md-generator backend | `0d62a3c5f2` | PASS · vitest 171/171 (tests proven non-vacuous) |
| **3 · authored-cards** | 7 distinct abstract structural-fingerprint cards + load-one index + Lane-2 stamp reuse | `13c2613d39` | PASS · zero defects · zero Hallmark leakage |
| **4 · brand-first** | Hard authored/measured boundary + provenance + signed-review gate, nested under `shared/` | `01a3bfd53c` | PASS · 26-vector attack + guard-removal mutation testing · boundary suite 7/7 |
| **5 · measured-composition** | Measured deterministic `compositionDNA` + opt-in retrieval facets in the style DB (additive, backward-compat) | `525a4cca7a` | PASS · DB suite 73/73 (+4, zero regressions) · byte-compat hash-verified |

Phase-0 cross-ref fixes (stale `014-`/`016-` refs the merge left) folded into Lane 1.

## 4. Quality pass over the build

1. **Deep-alignment framework fix** — `a17df48298`, packet `system-deep-loop/038-deep-alignment-multi-executor`. Enabled cli-opencode alignment leaves + `--convergence-mode=off` + reconciled a doc contradiction (which had also left the shipped cli-codex path unreachable). Contained; no shared-runtime edits; Sonnet-verified guard-for-guard.
2. **Deep review** — 3 models × 3 iters (GLM 5.2 · MiniMax-M3 · LUNA-xhigh), 14 findings (P0=2, P1=5, P2=7), cross-lineage adjudicated.
3. **Remediation** — `ef5157ca72`, all 14 fixed:
   - **P0 · symlink boundary hole closed** — the Lane-4 allowlist checked only the basename; a symlink could redirect a permitted write into measured data. Now realpath+lstat-rejects symlink destinations; **independently probe-confirmed** (write refused, measured file intact). This was the gap the per-lane verification missed.
   - Atomic authored-export refresh (temp+rename).
   - **Doc-honesty reconcile** — the parent theme spec (Planned→Complete, 4→5 lanes) and the program retrospective (hallmark Planned→Shipped) now truthfully reflect the built lanes.
4. **Deep alignment (LUNA)** — 3 iterations, **SEALED**: **sk-doc lane PASS**, 15 artifacts audited, 0 conformance findings. Validated the multi-executor fix end-to-end.

## 5. Current status

**Completion ≈ 85%.** Core build (100%) + quality pass review/remediation (100%) are done and on v4. Open: deep-alignment conformance completeness + housekeeping.

## 6. Remaining work (prioritized)

**P1 — deep-alignment conformance completeness**
- **sk-code lane not yet audited** — the LUNA run's 3 iterations only reached the sk-doc lane (15 of 54 artifacts). Re-run LUNA (cli-codex, works from opencode) at `--max-iterations=12` to cover the 39 sk-code artifacts.
- **GLM + MiniMax lineages** — cli-opencode leaves cannot run from an opencode orchestrator (self-invocation guard). Run via **Skill-tool orchestration** (Claude as the non-opencode orchestrator → cli-opencode leaf = cross-runtime = allowed). Models: `zai-coding-plan/glm-5.2` (variant max), `minimax/MiniMax-M3`.

**P2 — housekeeping**
- Reconcile the primary tree to v4 (`git merge --ff-only origin/skilled/v4.0.0.0`).
- Remove worktrees `0098`, `0099`, `0101` once v4 is confirmed.

**P3 — disclosed follow-ups (non-blocking)**
- Register Lane-1's 2 AI-nav/footer hypothesis probes if checker enforcement is wanted.
- Add a shipped test for Lane-5's incremental-backfill branch (probe-verified correct, untested).

**Framework gaps (separate packets, not hallmark scope)**
- Deep-review fan-out cli-leaves don't write route-proof-conformant iteration records → command FAILs despite valid findings.
- `fanout-run.cjs` hardcodes `review_target=spec_folder` + drops `--convergence-mode`.
- Alignment reducer mislabels an untouched-but-nonempty lane `NOT_APPLICABLE`.

## 7. Execution model & lessons

- **Layered verification is what made the work trustworthy:** per-lane Sonnet-xhigh adversarial verify caught a real defect on every lane; the cross-model deep-review then caught the **P0 the per-lane pass missed**. Neither layer alone was sufficient.
- **SOL agent contract:** builds/authors files only — no git, no spec metadata (orchestrator owns commits + `generate-description.js`/`backfill-graph-metadata.js`); SOL correctly halts on validate `GENERATED_METADATA_INTEGRITY`.
- **Daemon hazard:** a worktree memory daemon truncated tracked source docs twice — always `pkill` the worktree `context-server` + revert out-of-scope corruption after each dispatch, before verify/commit.
- **Deep-loop mechanics:** review fan-out is runtime-driven (reliable); single-executor alignment is orchestrator-driven; cli-opencode leaves need a non-opencode orchestrator; use `--stop-policy=max-iterations` / `--convergence-mode=off` for no-early-convergence (and note the review fan-out hardcodes its target to the spec-folder).
- **Freshness:** sync `last_updated_at`→now + backfill per packet before commit.

## 8. Key artifacts

- Commits on v4: `b986789b8c` · `0d62a3c5f2` · `13c2613d39` · `01a3bfd53c` · `525a4cca7a` (5 lanes) · `a17df48298` (fix) · `ef5157ca72` (remediation).
- Review findings registry: `004-hallmark-design-system/review/deep-review-findings-registry.json`.
- Alignment record: `004-hallmark-design-system/006-deep-alignment-and-review/alignment/`.
- Correct alignment lane-config: `scratchpad/hallmark-align-lanes-v2.json`.
- Handover: `handover.md` (this folder). Claude-native goal memory: `goal_hallmark-design-system-adoption.md`, `goal_deep-alignment-fix-and-hallmark-deep-loops.md`.
