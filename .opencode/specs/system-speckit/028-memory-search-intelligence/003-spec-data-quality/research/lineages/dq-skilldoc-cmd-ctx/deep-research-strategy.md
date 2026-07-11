---
title: Deep Research Strategy - dq-skilldoc-cmd-ctx lineage
description: Session tracking for the fan-out lineage drilling into per-surface DQ automation for SKILL DOCS, COMMANDS, and CONTEXT-ENGINEERING.
trigger_phrases:
  - "dq skilldoc cmd ctx strategy"
  - "skill doc command context dq automation"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — dq-skilldoc-cmd-ctx

## 2. TOPIC
Deep-dive data quality for the SKILL DOCUMENTS, COMMANDS, and CONTEXT-ENGINEERING layer specifically — the surfaces the operator emphasized beyond spec docs + JSONs + code. Find granular out-of-the-box automated on-write and retroactive features to perfect data quality across these three surfaces. Build on the prior finding (live default-ON `quality-loop.ts` should extend to the authored surface; a standing scheduled DQ sweep with guarded auto-fix is the most-automated layer). Recommend MORE features and MORE out-of-the-box automation per surface; go deeper and more specific than the prior lineages, do not repeat them.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1 (SKILL DOCS): granular per-skill on-write checks — RESOLVED (S1 hub frontmatter+version grammar+field uniformity; S2 skill-graph drift).
- [x] KQ2 (SKILL DOCS, cross-skill): RESOLVED (S3 signal collision; S4 three-surface keyword coherence; S5 enhances reciprocity; corrected dq-probe F5).
- [x] KQ3 (COMMANDS): RESOLVED (C1 generalize route-validate's 8 assertions; C2 argument-grammar; C3 workflow-YAML schema; C4 corpus-wide mutation_class).
- [x] KQ4 (CONTEXT-ENGINEERING): RESOLVED (X1 triple-copy trigger-vocab coherence; X2 automate hook playbook; X3 template parity; X4 resource-map freshness; X5 telemetry→refine retrieval-class).
- [x] KQ5 (synthesis): RESOLVED (three-tier timing topology, empty cron tier is the multiplier; one scheduled sweep running S/C/X detectors).
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-deriving the truncation law or the parent's retrieval tiering (inherited as settled).
- Repeating dq-deep's high-level keystones (extend quality-loop.ts; standing scheduled sweep) or dq-probe's headline (wire the sk-doc DQI scorer into a gate). These are the FLOOR this lineage builds ON; the job is MORE and MORE-GRANULAR features per surface.
- Building anything; this is a research verdict deliverable.
- Spec-doc-only or metadata-JSON-only findings (covered by parent + dq-deep).

---

## 5. STOP CONDITIONS
- All 5 key questions answered with file:line grounding.
- A per-surface feature set assembled that is demonstrably more granular than and non-overlapping with the prior lineages.
- Convergence (rolling newInfoRatio < 0.05) OR maxIterations=15, whichever first.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1–KQ5 all answered with file:line grounding. See `research.md` §2 per-surface table and §5 Eliminated Alternatives.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reconciling each candidate against the actual enforcement substrate (pre-commit + CI workflows) — turned vague "wire it up" into surgical, mis-scoped-not-missing gaps (iter 5).
- Adversarial grep of CI+hooks for each proposed gate's keywords — confirmed gaps and surfaced reuse-first mechanisms (rule-canary-sync) (iter 6).
- Counting frontmatter/version census directly rather than asserting (iter 1).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Initial assumption that the retroactive tier was absent (dq-deep premise) — disproven by 8 CI workflows; corrected in iter 5.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Re-spec'ing validators that already ship (wikilink, DQI scorer) — confirmed built; only timing/scope gaps remain.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- See `research.md` §5 Eliminated Alternatives (11 entries) and `findings-registry.json` ruledOutDirections.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Stage-0 corpus-wide per-detector failure counts (deferred to build).
- X5 telemetry→refine: unblocks only on a prod-mode completeRecall@3 read (inherited from parent).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Converged — synthesis complete in `research.md`. No further iterations.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Inherited from parent + sibling lineages (settled, do not re-derive):
- **Truncation law:** prod retrieval truncates to a 3-result floor (`confidence-truncation.ts:35` DEFAULT_MIN_RESULTS=3). Retrieval-class candidates need a prod-mode completeRecall@3 proof; write-time/adherence/logic candidates bypass the floor and ship on cost.
- **Automation asymmetry (dq-deep):** authored surface is gate-rich (38-rule validator registry) but refinement-poor; memory surface has a live default-ON verify-fix-verify `quality-loop.ts` (`search-flags.ts:180,393` both default TRUE). Keystones: extend that loop to the authored surface (score+suggest); standing scheduled DQ sweep with guarded auto-fix = the "most automated" layer.
- **Bifurcation (dq-probe):** spec docs get the 33-rule `validate.sh` (manual completion-time); code/MCP get 5 on-write commit gates; skill/command/context docs get NOTHING on the DQ axis. Highest-ROI named lever: wire the already-built sk-doc DQI scorer (`validation.md:177-310`) into an on-write gate + retroactive sweep. Also named: extend post-save-review trigger check; EARS linter to skill RULES; wikilink integrity to skill `[[name]]` graph; inject→refine telemetry loop (retrieval-class).
- This lineage's job: go BELOW those headlines into granular, per-surface primitives the siblings only named.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 15
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-06-21T08:34:51Z
