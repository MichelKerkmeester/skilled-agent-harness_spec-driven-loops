# Iteration 5: Final Ranking, Preserve Set & Baseline Sanity Check

## Focus
Consolidate all findings into a deduped, ranked removal/reduction list with defensible physical-line arithmetic; define the preserve set; sanity-check against the 555-line baseline.

## Findings

1. **F5-1. Verified physical-line arithmetic (all spans recounted via nl -ba, iter 4/5).**
Audited spans: L62–77 (16), L138 (1), L165–167 (3), L181–187 (7), L193–212 (20), L214–216 (3), L227–270 (44), L283+L340+L343–361+L364–375 (33), L383–404 (22), L406–414+L416–431+L499–501+L516–527+L531+L543–552 (51) — every count matches the candidate claims. Deduped by line range, the physical-line total is **~75 lines (≈13.5% of 555)** with ±5 confidence (F4-1 scoped to routing prose only — the Iron Law at L11 is preserve-set); plus ~35–40 line-equivalents of byte-only compression (F3-*) and ~20 tokens of emoji decoration (F4-2). [SOURCE: command: nl -ba recounts, iter-4/5]

2. **F5-2. RANKED CANDIDATE LIST (savings ÷ risk).**

Tier 1 — pure internal dedup / pointer substitution (low risk, ~55 lines):
- 1. **F2-4** §3 Spec Folder Documentation → pointer to system-spec-kit SKILL.md — **~14 lines**
- 2. **F1-2/F2-2** Daemon CLI guidance (L138 + L358–361 + L416–431) → one merged table — **~11 lines**
- 3. **F2-3** §5 MCP Tool Routing → compact table + pointer to the three runtime configs — **~10 lines**
- 4. **F1-3** Final-State + Completion Verification gates merged (L193–212) — **~7 lines**
- 5. **F4-7/F3-6** §9 advisor-metadata paragraph → 6 lines + pointer — **~5 lines**
- 6. **F4-3** §1 Dispatch Rules rows → rule + pointer per row (fixes F1-1 paths) — **~4 lines**
- 7. **F4-4** §10 rows → drop inline mechanics, keep command + outcome — **~4 lines**

Tier 2 — cross-file duplication, keep salience (moderate risk, ~17 lines):
- 8. **F1-5** ask-first paragraph merged with VIOLATION RECOVERY (L165–167 + L214–216) — **~3 lines**
- 9. **F2-1** Git Workspace Safety 6 rows → 3 rows (keep worktree-choice + push-allowlist) — **~3 lines**
- 10. **F2-5** Gate 3 edge paragraphs (L181–187) — **~3 lines**
- 11. **F4-1** header routing prose (L7–9) → 1 line + pointer; Iron Law L11 untouched — **~2 lines**
- 12. **F1-6** code-search bullet L375 removed (table L364–372 stays) — **~2 lines**
- 13. **F1-8** §9 validate.sh block → pointer to §2 L204 — **~2 lines**
- 14. **F4-6** Directive Capsule → 2 lines — **~2 lines**

Tier 3 — small fixes (~4 lines):
- 15. **F1-7** memory_search note L373 — **~1 line**; 16. **F1-4** resume row L531 — **~1 line**; 17. **F4-5** comment-hygiene row → pointer — **~1 line**

Byte-only (0 physical lines): F3-1..F3-8 (~35–40 line-equivalents), F4-2 emoji (~20 tokens).

3. **F5-3. PRESERVE SET (do not remove).**
- Four Laws (L22–30), PLAN-WORKFLOW LOCK (L32–39), Halt Conditions (L41–46) — unique normative hard blockers, no authoritative copy.
- Gate 1–4 prose (L127–170) — prompt-time companion contract; classifier is TS (ruled out iter 2).
- §1 Verification Standards + Task-specific proof tables (L90–108) — high decision value, unique.
- §4 Anti-Patterns + Analysis Lenses (L305–335) — unique normative content.
- §7 Confidence Framework (L433–455), §8 Communication Quality (L456–488) — unique.
- §10 Quick Reference rows as pointers (F2-7, 0 savings).
- ALL content whose referenced files are broken (F1-1) gets pointer FIXES, never deletion — removing rule text would orphan the rules.

4. **F5-4. Staleness flag (not bloat):** §2 Post-Save Review (L188–191) describes a POST-SAVE QUALITY REVIEW output that generate-context.js does not emit (F2-6). Either the MCP `memory_save` path emits it (UNKNOWN — needs human verification) or the block is stale and should be removed/rewritten. 4 lines at risk. [SOURCE: command: grep generate-context.js]

5. **F5-5. Sanity check vs baseline.** 555 − 75 = ~480 lines (−13.5%) from physical-line removals alone; byte-compression (F3-*) adds token savings without changing the line count. Risk-adjusted recommendation: Tier 1+2 only (~71 lines) for the first pass; Tier 3 + byte-compression as follow-up. No candidate touches the Four Laws, gates, or verification tables; the Iron Law (L11) is preserve-set.

## Sources Consulted
- commands: nl -ba recounts (iter 4/5); grep anchors; all prior iterations' evidence
- file:AGENTS.md full read

## Assessment
- **newInfoRatio: 0.15** — analytical consolidation iteration; the ranked list, preserve set, and verified arithmetic are the deliverable itself. Status: complete (the ranking adds decision value beyond prior evidence).
- Confidence: high on arithmetic (recounted); ranking judgment is mine — savings ±1 line per item.

## Reflection
What worked: the recount audit (50+44+33+22+51 lines) made the aggregate defensible — the advisory's pressure was correct.
What failed / ruled out: F2-6 remains unresolved (staleness vs MCP-side feature — flagged F5-4 for human verification). No new evidence surfaced; the mapped territory is exhausted.

## Recommended Next Focus
Loop complete (maxIterations=5). Synthesis: compile research.md with ranked report, eliminated-alternatives table, preserve set, and convergence report.
