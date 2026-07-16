# Deep Research Strategy — glm lineage

> Fan-out detached lineage for packet 006-global-spec-drift-deep-research.
> sessionId: `fanout-glm-1784206807603-dm75z2` | executor: cli-opencode / zai-coding-plan/glm-5.2 | generation 1.

## 2. TOPIC
Spec drift and prior context-optimization efforts across all `.opencode/specs/*` — a full-tree sweep (165 packets, 12 tracks) to surface residual drift the five renumber/reconstruct phases (001-005) did not directly target, plus documented prior context-optimization efforts (compaction, pruning, summarization, continuity-shrinking) usable as evidence by phase 007's gated memory-DB teardown.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 [status-drift]: Where does residual **completion-state drift** remain? **ANSWERED (iter 1+5):** systemic ~45 raw/~23 semantic mismatches; splits into intentional draft-pending-verification (sk-design) vs genuine drift (spec over-states complete/blocked while graph says in_progress/planned).
- [x] Q2 [numbering-drift]: **ANSWERED (iter 2):** dual-scheme (local vs global-offset) + uncompacted gaps; collisions are namespaced, not drift.
- [x] Q3 [naming]: **ANSWERED (iter 3):** 61 snake_case dirs in 4 clusters; 032 kebab program unenforced (planned); convention flip-flopped 027↔032; primary numbered slugs clean.
- [x] Q4 [context-opt]: **ANSWERED (iter 4):** 6 mechanisms; cyclical lifecycle; deprecation-pruning precedes phase 007.
- [x] Q5 [structural]: **ANSWERED (iter 5):** mostly intended design (descriptions.json=generated index; changelog=phase-parent); genuine anomaly only z_archive=planned (7/8) + 999/changelog deviations.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Not remediating any drift found (research-only; triage/fix is a follow-on packet per the parent's scope rules).
- Not modifying phases 001-005 content, scope, or numbering decisions.
- Not executing phase 007's teardown.
- Not assessing non-specs paths (`.opencode/skills`, `.opencode/commands`) — the `.opencode/specs/*` tree is the sweep target.
- Not narrowing to the five phases-001-005 tracks; the sweep is explicitly full-tree.

## 5. STOP CONDITIONS
- All five key questions (Q1-Q5) have evidence-backed answers, OR
- newInfoRatio sustained below 0.05 across the required consecutive evidence iterations AND legal-stop gates (convergence, coverage, quality) pass, OR
- maxIterations (10) reached, OR
- 3 consecutive stuck iterations → one recovery attempt → synthesis with gaps documented.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 (iter 1+5): Status drift systemic (~45 raw/~23 semantic); splits intentional draft-pending-verification (sk-design) vs genuine spec-over-states-complete drift.
- Q2 (iter 2): Numbering drift = dual-scheme (local vs global-offset) + uncompacted gaps; collisions namespaced, not drift.
- Q3 (iter 3): 61 snake_case dirs in 4 clusters; 032 kebab program unenforced; convention flip-flopped 027↔032; primary slugs clean.
- Q4 (iter 4): 6 context-optimization mechanisms; cyclical lifecycle; deprecation-pruning precedes phase 007.
- Q5 (iter 5): Mostly intended design (descriptions.json=generated index; changelog=phase-parent); genuine anomaly only z_archive=planned (7/8).

**ALL 5 KEY QUESTIONS ANSWERED — legal convergence reached at iteration 5 (stopReason=converged).**
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Mechanical spec.md-vs-graph-metadata status diff (iteration 1): cheap, high-signal, canonical drift detector (iteration 1)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration — populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Consolidated from iteration dead-end data]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
STOP — legal convergence reached (5/5 questions answered, composite stop > 0.60, trend descending). Proceeding to phase_synthesis: compile `research/research.md`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot (init-seeded, pointer-based)

**Surface scale:** 165 packets across 12 tracks: cli-external-orchestration (29), mcp-tooling (8), sk-code (5), sk-design (10), sk-doc (21), sk-git (9), sk-prompt (8), system-code-graph (12), system-deep-loop (16), system-skill-advisor (20), system-speckit (18), z_future (9).

**Pre-identified drift signals (seed pointers):**
- **Status drift (Q1):** Phase `005-sk-design-reconstruct` is narrated "complete/shipped" in the 006 spec, but `sk-design/*/graph-metadata.json` all read `draft`/`planned` (005 parent + child both `draft`). Evidence: 006 spec.md §EXECUTIVE SUMMARY + sk-design graph-metadata scan.
- **z_archive status drift (Q5):** 7 of 8 `z_archive` folders report `planned` (sk-code, sk-design, sk-doc, system-code-graph, system-deep-loop, system-skill-advisor, system-speckit); only `sk-git/z_archive` = `complete`. Archives reporting `planned` is anomalous.
- **Numbering collisions (Q2):** slug `026` appears in cli-external-orchestration, system-code-graph, system-speckit (per-track may be valid — verify scheme). system-deep-loop has large gaps (029-033 then jump to 063+). sk-doc jumps 018→032 and has `999-create-diff-mode`.
- **Naming violations (Q3):** z_future slugs are snake_case/unnumbered (`agent-memory`, `sqlite-to-turso`); `system-skill-advisor/changelog` is a non-numbered packet.
- **Structural (Q5):** a 2.8MB stray `.opencode/specs/descriptions.json` sits at the specs root (not per-packet).

**Context-optimization keyword hits (Q4):** 9,834 line-matches across specs for `compaction|context-optimization|pruning|prune|continuity-shrink|summariz`; heavy clusters in cli-external-orchestration/015, /022 (devin deprecation `context/` tree), /019 minimax deep-research, and sk-code/017 phase children. Needs de-duplication in iteration.

**Constraints/risks:** 9,834 raw hits are noisy (many are research-iteration `summarize`); must de-dupe to real optimization efforts. z_future + z_archive are partially out-of-scope convention but must be characterized, not silently dropped.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (newInfoRatio)
- Composite stop floor: 0.60
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output (this lineage writes to `research/lineages/glm/research.md`)
- Lifecycle branches: new (this lineage)
- Current generation: 1
- Started: 2026-07-16T15:00:07Z
