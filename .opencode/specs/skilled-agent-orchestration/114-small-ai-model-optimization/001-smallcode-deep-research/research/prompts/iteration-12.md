DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 12 of 20 (SYNTHESIS PASS)

## STATE

state_summary: SYNTHESIS PASS. Convergence triggered iter 11 (all_questions_answered, 5/5 RQs resolved, 389 keyFindings, convergenceScore 0.15). Now compile the canonical research/research.md from iters 1-11.

Iteration: 12 of 20 (synthesis pass — no further deepening iters)

Focus Area: **SYNTHESIS — Compile research/research.md.** Read iters 1-11 + preflight context-card §Overview, then author the canonical `research/research.md` per the structure recommended in iter-011.md Synthesis Recommendations. The output MUST be patch-ready for follow-on remediation packets — every candidate delta needs a target file path + patch shape + acceptance criteria.

## STATE FILES

- Read inputs:
  - `.opencode/specs/.../research/iterations/iteration-001.md` through `iteration-011.md`
  - `.opencode/specs/.../research/deep-research-strategy.md`
  - `.opencode/specs/.../research/findings-registry.json` (389 keyFindings)
  - `.opencode/specs/.../preflight/context-card.md` (Overview section)
- Write output: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/research.md`
- Append to state log: `.opencode/specs/.../research/deep-research-state.jsonl`
- Write delta: `.opencode/specs/.../research/deltas/iter-012.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. ~5-7 actions (1 read per iter × ~12 read tool calls budget — be efficient with combined reads).
- Already-shipped 113 items: RCAF, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose; cite as "shipped baseline".
- Synthesis MUST cover all 5 RQs explicitly (no skipped sections, no hedging).
- Architecture verdict (HYBRID — distributed references + enhances edges, NO new skill) MUST be in research.md's executive summary.

## OUTPUT CONTRACT

1. **research.md** — Canonical synthesis. Structure:

   ```
   # Deep-Research Synthesis: smallcode-master Small-Model Pattern Extraction
   
   ## Executive Summary
   - Loop stats: iters completed, convergence trigger, key findings count
   - Architecture verdict (HYBRID — what + why in 3-5 sentences)
   - High-level delta inventory: # of patterns per RQ, # of follow-on packets recommended
   
   ## Method
   - Executor: cli-devin SWE-1.6 (free tier, dogfood)
   - Convergence: all_questions_answered at iter 11
   - Source corpus: external/smallcode-master/ (MIT, v0.2.2)
   - Preflight context-card cited per iter (631 lines, 6 sections, 56/45/34/22/11 citations per RQ)
   
   ## RQ1 — Context Budget Engine (Candidate Deltas)
   For each of 5 baseline patterns (iter 1) + 4 deepening artifacts (iter 6):
     - Pattern name + smallcode primitive (file:line + short quote)
     - Candidate target path (full repo-relative path)
     - Patch shape (new file vs section in existing file vs JSON addition)
     - Acceptance criteria (3-5 bullets, executable by follow-on packet author)
     - Confidence tag (high|medium|low) with rationale
     - Recommended follow-on packet ID (placeholder, e.g. "002-cli-devin-budget-engine")
   
   ## RQ2 — Output Verification Pipeline (Candidate Deltas)
   Same structure × 5 baseline + 4 deepening
   
   ## RQ3 — Per-Model Profiles & Escalation (Candidate Deltas)
   Same structure × 5 baseline + 4 deepening
   
   ## RQ4 — Structured Scope/Permissions (Candidate Deltas)
   Same structure × 5 baseline + 4 deepening
   
   ## RQ5 — Skill Architecture (HYBRID verdict + cross-cutting realization)
   - Verdict statement (HYBRID, no new skill)
   - Distributed target-path list (1 line per delta: where it lands)
   - Enhances-edge wiring (5 edges with weights + context strings)
   - AGENTS.md addition (literal text + insertion location)
   - Trigger_phrases additions per skill
   - 5-lane scoring simulation results
   - Confidence tag for the verdict
   
   ## Follow-on Packets Index
   Table: packet_id | scope | RQ coverage | priority | estimated complexity. Estimated ~5-7 follow-on packets covering the 41 artifacts.
   
   ## Excluded Patterns (Out of Scope / Dropped-RQ)
   - 2-stage tool routing + forgiving JSON parser (overlaps mcp-code-mode)
   - Auto-decompose (overlaps sk-prompt medium pre-plan, shipped 113)
   - With explicit rationale per iter-011.md
   
   ## Citations Index
   List of file:line citations used across the synthesis (deduplicated).
   ```

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":12,"newInfoRatio":0.05,"status":"complete","focus":"SYNTHESIS — research.md compilation","graphEvents":[]}`. Ratio is intentionally low (synthesis is consolidation, not discovery).

3. **deltas/iter-012.jsonl**: one iter record + one observation record summarizing the synthesis output.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read iter-001..011.md sequentially. Extract per-RQ artifact lists with their target paths, patch shapes, and acceptance criteria.
   b. Read iter-005.md (RQ5 verdict) + iter-010.md (cross-cutting AGENTS.md + enhances) + iter-011.md (synthesis recommendations) carefully — these drive the §RQ5 + Follow-on Packets sections.
   c. Author research.md per the structure above. Target length 800-1500 lines. No prose padding — every section densely populated with concrete deltas + acceptance criteria.
2. Execute. Stop after research.md is complete.
3. Append JSONL + delta. Stop.

Verification: research.md exists with all required sections; per-RQ sections contain ≥9 candidate deltas (5 baseline + 4 deepening each for RQ1-4, plus RQ5 verdict + cross-cutting); follow-on packets index has 5-7 rows.
