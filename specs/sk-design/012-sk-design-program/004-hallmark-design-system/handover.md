---
title: "Handover: sk-design hallmark design-system adoption"
description: "Briefing for a fresh session to finish the hallmark work: the 5-lane build is shipped + verified + deep-reviewed + remediated on v4; what remains is the deep-alignment conformance pass (sk-code lane coverage + the GLM/MiniMax lineages via a non-opencode orchestrator) plus light housekeeping. Everything shipped is on origin/skilled/v4.0.0.0; nothing is half-committed."
trigger_phrases:
  - "hallmark handover"
  - "hallmark design system remaining work"
  - "finish hallmark deep-alignment"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system"
    last_updated_at: "2026-07-23T07:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the hallmark handover"
    next_safe_action: "Finish the deep-alignment conformance pass"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hallmark-handover-session"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

# Handover: sk-design hallmark design-system adoption

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

The hallmark design system — the theme the 012-merge retrospective flagged as **Planned, never built** — is now **built, verified, deep-reviewed, remediated, and shipped to `origin/skilled/v4.0.0.0`**. Five lanes were each authored by a GPT-5.6-SOL agent and adversarially verified by a Sonnet agent; a 3-model deep-review found 14 findings that were all remediated (including a real P0). What remains is finishing the **deep-alignment conformance pass** (one lane audited so far) plus light housekeeping. Nothing is half-committed; every shipped change is on v4.

**Overall completion: ~85%.** The core deliverable (the 5-lane build) and the quality pass (review + remediation) are 100% done. The open ~15% is the alignment conformance completeness (sk-code lane coverage + the GLM/MiniMax lineages) and housekeeping.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

**What the hallmark work is.** Adoption of patterns from the external (MIT) Hallmark design skill into `sk-design`, clean-room (adapt/learn, no verbatim copy), grounded in the Complete research packet `001-research/004-hallmark-design-skill-research` (dual 10-iteration SOL lineages, reuse matrix + MIT verdict).

**The 5 lanes — all shipped on v4 (commits `b986789b8c` … `525a4cca7a`):**
- `001-surgical-fixes` (`b986789b8c`) — 5 clean-room heuristics into 9 existing sk-design design-mode reference files (hero/media contract, multi-page coherence lock, ~11 anti-slop probes, fallback-font CLS proof, responsive proof matrix). Preserves the evidence-first P0-P3 model. ai-fingerprint checkers pass; validate 0/0.
- `002-evidence-envelopes` (`0d62a3c5f2`) — owned-asset manifest + motionCharacter handoff (2 new `shared/evidence-envelopes/` docs) + a conditional measured Motion section wired through the design-md-generator backend, strictly evidence-gated on `MotionSystem.durationScale` (never phrase-triggered). vitest 171/171.
- `003-authored-cards` (`13c2613d39`) — 7 independently-authored, abstract structural-fingerprint cards + a load-one index + a diversification stamp reusing the Lane-2 evidence-envelope pattern. Zero Hallmark catalog leakage. SKILL.md registration.
- `004-brand-first-lane` (`01a3bfd53c`) — a hard authored/measured boundary: a distinct `AUTHORED-DESIGN.md` + authored tokens with `origin: authored` provenance, an allowlist enforcement chokepoint, and a signed human-reviewed conversion gate; nested under `shared/` (no new top-level dirs). Adversarially verified with a 26-vector attack + guard-removal mutation testing.
- `005-measured-composition-and-retrieval-facets` (`525a4cca7a`) — the 5th phase (research-ranked #4-5): a measured, deterministic `compositionDNA` summary + opt-in retrieval facets in `styles/lib/database/`. Strictly additive + backward-compatible. DB suite 73/73 (+4, zero regressions).

**The quality pass:**
- **Deep-alignment framework fix** (`a17df48298`, packet `system-deep-loop/038-deep-alignment-multi-executor`) — gave `/deep:alignment` cli-opencode leaf support + `--convergence-mode=off` + reconciled a doc contradiction (which had also left the shipped cli-codex path unreachable). Contained, no shared-runtime edits, Sonnet-verified.
- **Deep review** — 3 models × 3 iters (GLM 5.2 + MiniMax-M3 + LUNA-xhigh) → **14 findings** (P0=2, P1=5, P2=7), cross-lineage adjudicated. Registry: `004-hallmark-design-system/review/deep-review-findings-registry.json`.
- **Remediation** (`ef5157ca72`) — all 14 fixed: **P0 symlink boundary hole closed** (realpath+lstat guard, independently probe-confirmed; the earlier verification tested path-traversal but not symlinks); atomic authored-export refresh; reconciled the stale parent spec (Planned→Complete, 4→5 lanes) + program retrospective (hallmark Planned→Shipped) that had been left after building the lanes; P2 doc-staleness.
- **Deep alignment (LUNA)** — ran 3 iterations and **SEALED**: the **sk-doc lane PASSED**, 15 artifacts audited, 0 conformance findings (hallmark docs conform to sk-doc canon). This validated the multi-executor fix end-to-end.

**Load-bearing constraints (do NOT drift):**
- **cli-opencode single-executor alignment is cross-runtime only.** An opencode orchestrator dispatching a cli-opencode leaf is refused by the self-invocation guard. GLM/MiniMax alignment lineages therefore require a **non-opencode orchestrator** — drive `/deep:alignment` via the Skill tool (Claude = non-opencode orchestrator; Claude→opencode leaf = cross-runtime = allowed). cli-codex (LUNA) runs fine from the opencode orchestrator.
- **The build is byte-preserving on shipped work content;** the alignment/review are read-only audits.
- **A worktree memory daemon corrupts tracked source docs** (it truncated `mcp-tooling/research.md` twice this program) — after any codex/opencode dispatch, `pkill` the worktree `context-server` + revert any out-of-scope corruption before verifying/committing.
- **`--dangerously-skip-permissions` mitigation** for cli leaves: isolated worktree + clean primary + BANNED-OPS markers in the rendered prompt (built into the fixed branch).

**Verified state (2026-07-23):** origin/skilled/v4.0.0.0 tip advances via concurrent merges; the hallmark chain `b986789b8c..ef5157ca72` is in v4. The five lanes + `006-deep-alignment-and-review` are present. Primary tree was ~2 commits behind (transient). Worktrees: `0098` (merge), `0099` (build), `0101` (fix + review + remediation + alignment runs).
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

**A. Finish the deep-alignment conformance pass (the main open item).**
1. **Full-coverage LUNA re-run** — the LUNA run's 3 iterations only reached the sk-doc lane (15 of 54 artifacts); the sk-code lane (39 artifacts) is unaudited. Re-run with a higher iteration budget:
   `opencode run --command deep/alignment "sk-design hallmark conformance :auto --restart --executor-kind=cli-codex --model=gpt-5.6-luna --reasoning-effort=xhigh --convergence-mode=off --max-iterations=12 --lane-config <lanes-v2> --spec-folder=<006>" --model openai/gpt-5.6-sol-fast --variant high --format json --dir <0101-worktree> </dev/null`
   (lanes-v2 = the sk-doc + sk-code lane-config; sk-design/designs was wrong — 0 artifacts.)
2. **GLM + MiniMax lineages** — these are cli-opencode leaves; they CANNOT run from the opencode orchestrator (self-invocation). Drive `/deep:alignment` via the **Skill tool** (Claude orchestrates, dispatches the cli-opencode leaf cross-runtime), lanes-v2, `--convergence-mode=off`. Model IDs: `zai-coding-plan/glm-5.2` (variant max), `minimax/MiniMax-M3`.
3. After each alignment lineage: `pkill` the worktree daemon + revert corruption; the reducer currently mislabels an untouched-but-nonempty lane `NOT_APPLICABLE` (a real reducer bug) — do not treat a partial-coverage `PASS` as a full-conformance verdict.

**B. Housekeeping.**
4. **Reconcile the primary tree:** `git merge --ff-only origin/skilled/v4.0.0.0` (touches no dirty file; left for the operator re: concurrent sessions).
5. **Remove worktrees** once v4 is confirmed: `git worktree remove .worktrees/{0098-sk-design-012-program-merge,0099-sk-design-hallmark-adoption-build,0101-system-deep-loop-deep-alignment-multi-executor}`.

**C. Optional / disclosed follow-ups (non-blocking).**
6. Lane-1's 2 AI-nav/footer probes are disclosed hypothesis probes (not machine-registered) — register them if checker enforcement is wanted.
7. Lane-5's incremental-backfill branch is probe-verified correct but not covered by a shipped test.

**D. Framework gaps this program surfaced (their own packets, not hallmark scope).**
8. Deep-review fan-out cli-leaves don't write route-proof-conformant iteration records → command validates FAIL despite valid findings.
9. `fanout-run.cjs` hardcodes `review_target=spec_folder` + drops `--convergence-mode`.
10. The alignment reducer mislabels an untouched-but-nonempty lane `NOT_APPLICABLE`.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All 5 lanes built + Sonnet-verified + committed + pushed to v4.
- [x] Deep-review run (3 models × 3 iters), 14 findings produced + remediated + pushed.
- [x] P0 symlink boundary hole closed + independently probe-confirmed.
- [x] Stale parent spec + program retrospective reconciled to reflect the built lanes.
- [x] Deep-alignment framework fix shipped + Sonnet-verified.
- [x] Deep-alignment validated (LUNA sealed; sk-doc lane PASS).
- [ ] Deep-alignment sk-code lane audited (full coverage).
- [ ] GLM + MiniMax alignment lineages run (via Skill-tool orchestration).
- [ ] Primary tree reconciled to v4.
- [ ] Worktrees removed.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Key files (entry points):**
- Boundary enforcement: `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs` (symlink guard at ~lines 200-214) + `shared/scripts/brand-first-boundary.test.mjs` (9 tests).
- Lane surfaces: `sk-design/design-{interface,audit,foundations}/` (Lane 1), `shared/evidence-envelopes/` + `design-md-generator/backend/scripts/` (Lane 2), `shared/references/structural-fingerprint-cards/` (Lane 3), `shared/authored-brand/` (Lane 4), `styles/lib/database/` (Lane 5).
- Review record: `004-hallmark-design-system/review/deep-review-findings-registry.json`.
- Alignment record: `004-hallmark-design-system/006-deep-alignment-and-review/alignment/`.
- Alignment lane-config (v2, correct): `scratchpad/hallmark-align-lanes-v2.json` (sk-doc + sk-code).

**Lessons:**
- SOL-high-fast builds + Sonnet-xhigh adversarial verification caught a real defect on every lane (honesty-framing L1, stale §-ref L2, boundary test-vacuity L4, DB coverage gap L5); the deep-review then caught the **P0 symlink hole the per-lane verification missed** — the layered verification (per-lane Sonnet → cross-model deep-review) is what made the boundary trustworthy.
- SOL agents do NOT run git or generate spec metadata; the orchestrator owns commits + `generate-description.js`/`backfill-graph-metadata.js`. SOL agents correctly HALT on validate `GENERATED_METADATA_INTEGRITY` (their build is done; metadata is the orchestrator's job).
- Freshness: sync `last_updated_at`→now + backfill per packet before commit, else `CONTINUITY_FRESHNESS` warns.
- Deep-loop mechanics: fan-out (review) is runtime-driven (reliable); single-executor (alignment) is orchestrator-driven; cli-opencode leaves need a non-opencode orchestrator.

**Related:** `goal.md` (this folder — structured objective + progress), `goal_hallmark-design-system-adoption.md` + `goal_deep-alignment-fix-and-hallmark-deep-loops.md` (Claude-native goal memory), `system-deep-loop/038-deep-alignment-multi-executor` (the framework fix packet).
<!-- /ANCHOR:session-notes -->
