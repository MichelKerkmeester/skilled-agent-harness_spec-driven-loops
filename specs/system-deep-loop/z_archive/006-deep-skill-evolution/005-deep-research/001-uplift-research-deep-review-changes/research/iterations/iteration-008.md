# Iteration 8 — Final Adversarial Pass

## Summary
This iteration performed a final adversarial sweep on untouched surfaces that prior iterations may have skimmed. Specifically examined: (1) `.opencode/skills/deep-research/assets/` full inventory, (2) `.opencode/skills/deep-research/references/` verification against actual code behavior, and (3) a sample recent deep-research run packet to confirm deep-research isn't producing bad output. Also re-verified the 2 CONFIRMED P1 findings from iter-007 (DR-003, DR-006) to ensure they weren't over-confirmed. Aimed for high precision (0 false-positives) rather than coverage.

## Adversarial Surface Check

### Assets Directory Inventory

**Files present (5 total):**
- `deep_research_config.json` — Loop parameters template, matches state_format.md schema
- `deep_research_strategy.md` — Runtime template for strategy.md, matches loop_protocol.md lifecycle
- `deep_research_dashboard.md` — Dashboard template placeholder (auto-generated at runtime)
- `prompt_pack_iteration.md.tmpl` — Per-iteration prompt template, matches loop_protocol.md dispatch contract
- `runtime_capabilities.json` — Machine-readable capability matrix, matches capability_matrix.md human-readable version

**Verdict:** All assets present, correctly structured, no orphaned or malformed templates.

### References Directory Verification

**Files present (6 total):**
- `capability_matrix.md` — Verified against runtime_capabilities.json: all 4 runtimes (opencode, claude, codex, gemini) match, tool surfaces correct, hookBootstrap flags align with SKILL.md descriptions
- `convergence.md` — Convergence algorithm matches loop_protocol.md Step 2 description, quality guard checks present
- `loop_protocol.md` — Lifecycle phases (INIT, LOOP, SYNTHESIS, SAVE) match reduce-state.cjs implementation, pause sentinel contract matches state_format.md
- `quick_reference.md` — High-level summary aligns with SKILL.md smart routing section
- `spec_check_protocol.md` — Spec folder integration rules match SKILL.md late-INIT contract
- `state_format.md` — All 6 state files documented (config, JSONL, strategy, dashboard, registry, iterations), field names match reduce-state.cjs parse logic

**Verdict:** All reference docs accurately describe actual code behavior. No drift between documentation and implementation.

### Recent Deep-Research Run Packet Sample

**Sampled packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-audit/001-dependency-security-supply-chain-audit/research/`

**Iteration sampled:** iteration-023.md (VERIFICATION of iter 011-015 Runtime + Auth)

**Output quality assessment:**
- Structured findings table with severity classification (CRITICAL/HIGH/MEDIUM/LOW/INFO)
- Clear evidence citations with file paths and command outputs
- Remediation guidance for each finding
- Convergence signal with newInfoRatio calculation
- No malformed or hallucinated findings
- JSONL state log properly formatted with iteration records

**Verdict:** Deep-research is producing high-quality, structured output. No evidence of bad output patterns or hallucinations.

## Iter-7 Confirmed P1 Re-Verification

### DR-003: Question-entropy convergence lacks uncovered-question tracking — CONFIRMED

**Citation:** iter-007 claimed reduce-state.cjs has no `uncoveredQuestions` field or tracking logic, making 85% threshold opaque.

**Evidence:** 
- Grep search for `uncoveredQuestions` in reduce-state.cjs: 0 matches
- Code inspection line 870-876: reducer parses `strategyQuestions` from strategy.md and `iterationFiles` from disk, but no field tracks remaining unanswered questions
- The `answeredQuestions` field exists on iteration records but there's no reducer-owned surface listing what's still uncovered

**Verdict:** CONFIRMED — real gap that would improve debuggability. The 85% convergence threshold in convergence.md references question coverage, but the reducer doesn't expose which questions remain unanswered.

### DR-006: Lexical sort bug in iteration file ordering — CONFIRMED

**Citation:** iter-007 claimed line 874 uses lexical sort causing iteration-10.md to sort before iteration-2.md.

**Evidence:**
- reduce-state.cjs line 874: `.sort()` performs lexical string comparison on iteration file names
- Files like `iteration-10.md` and `iteration-2.md` sort as "iteration-10" < "iteration-2" lexicographically
- This affects iteration file ordering in the dashboard and any chronological analysis

**Verdict:** CONFIRMED — real bug that affects iteration ordering. Should use numeric sort: `.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))`

## Last-Pass Test

Attempted to find ONE substantive new finding (not in F-001..DR-008) through adversarial probing of:
- Asset file integrity and template correctness
- Reference documentation accuracy against implementation
- Deep-research output quality from a real recent run
- Edge cases in reduce-state.cjs beyond the known DR-003/DR-006 issues

**Result:** 0 new findings found. The adversarial sweep confirmed convergence — prior iterations covered the meaningful gaps, and the remaining surfaces are well-structured and accurate.

## Updated Cumulative Counts

|| Verdict | After Iter-8 |
||---------|--------------|
|| CONFIRMED | 2 (DR-003, DR-006) |
|| OUTDATED | 6 (unchanged) |
|| FALSE-POSITIVE | 10 (unchanged) |
|| MISCATEGORIZED | 2 (unchanged) |
|| SKIP | 10 (unchanged) |
|| ALREADY-DONE | 27 (unchanged) |

## Convergence Signal

- adversarial surfaces checked: 3 (assets, references, recent run packet)
- confirmed P1 re-verified: 2 (both still valid)
- new findings discovered: 0
- newFindingsRatio (new vs checked): 0/3 (0%)
- coverage gate: PASS (all untouched surfaces examined with high precision)

## Next Iteration Focus

Iter-8 was the final cli-devin adversarial pass. The 2 confirmed P1 findings (DR-003, DR-006) are ready for synthesis. Iter-9 and iter-10 will be cli-codex synthesis passes to consolidate findings and produce the final research report.

**Recommended synthesis focus:**
1. Document DR-003 fix: Add `uncoveredQuestions` field to reducer state and dashboard
2. Document DR-006 fix: Replace lexical sort with numeric sort in reduce-state.cjs line 874
3. Consolidate all adjudication results into final findings table
4. Produce remediation playbook for the 2 confirmed P1s
