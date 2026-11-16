---
title: Deep Review Strategy - advisor intent signals, playbook prompt and ADR pass thirteen
description: Runtime strategy for the data-13 lineage, tracking the seven new advisor intent_signals phrases, the CL-009 playbook prompt change and ADR-001's stale-graph waiver.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - data-13

## 1. OVERVIEW

### Purpose

Persistent state for the `data-13` lineage of review pass thirteen. It records which dimensions remain, what was found, which approaches worked, and where the next iteration focuses.

### Usage

- **Init:** populated from the review brief, the scope file and the commit range.
- **Per iteration:** read Next Focus, review the named area, record findings, mark dimensions, set the next focus.
- **Mutability:** updated in place by this lineage.

---

## 2. TOPIC

Review of the data area for command surfacing pass thirteen. The area covers seven new phrases appended to `system-skill-advisor`'s `intent_signals` in `.skilled/skills/system-skill-advisor/graph-metadata.json` (skill graph is stale, rebuild the skill graph, vibe prompt hook, advisor briefs, behaviour arena, clean arena, routing arm), the CL-009 manual-testing playbook prompt change in `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md`, and ADR-001 in `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md`, which waives AC-004 for probe P05 and keeps the stale-graph prompt on `/doctor:helper`. The diff runs `b8ebee37d75..932aff4e437`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Reviewing the mention area (`command-attach.ts`, its guard tests) assigned to `mention-13`; read-only context only.
- Re-reporting the recorded limits in `review-brief-13.txt` unless a new input breaks them.
- Re-reporting the open P2 list of `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` and of review passes ten to twelve.
- Running the repository suite, the build, or any git write; this lineage reports only.
- Opening `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl` except through the allowed aggregate path; the holdout rule stays in force.

---

## 5. STOP CONDITIONS

- Composite convergence stop at threshold 0.10 with all four dimensions covered.
- `maxIterations` 8 reached without a legal convergence stop.
- A blocking stop from `convergence.cjs` naming an uncovered dimension or an unresolved active P0.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Init: reading the scope file, the three diffs, then the whole files at `932aff4e437` before choosing a focus. It separated the phrase delta (seven signals), the doc delta (one prompt) and the ADR delta (one row).

---

## 9. WHAT FAILED

- Init: none.
- Iteration 3: the synthesis closeout ran before the iteration-3 convergence event was appended, so the ledger holds `synthesis_complete` before that `graph_convergence` row. Both rows are correct and the latest convergence row is the STOP decision; only the commit order differs.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A change in the playbook or ADR behavior: both reproduce their expected lines and their recorded ranking. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A change in the playbook or ADR behavior: both reproduce their expected lines and their recorded ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A change in the playbook or ADR behavior: both reproduce their expected lines and their recorded ranking.

### A duplicate-signal amplification: the file has no duplicate intent signal. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A duplicate-signal amplification: the file has no duplicate intent signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplicate-signal amplification: the file has no duplicate intent signal.

### A holdout leak through command-bridge generation: the generator's input list has no corpus path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A holdout leak through command-bridge generation: the generator's input list has no corpus path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A holdout leak through command-bridge generation: the generator's input list has no corpus path.

### A JSON or shell injection through a signal string: every entry is plain lowercase text with no metacharacter. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A JSON or shell injection through a signal string: every entry is plain lowercase text with no metacharacter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A JSON or shell injection through a signal string: every entry is plain lowercase text with no metacharacter.

### A new defect in the seven-signal block between iteration 1 and this pass: the final-tree reproduction matches the recorded behavior exactly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new defect in the seven-signal block between iteration 1 and this pass: the final-tree reproduction matches the recorded behavior exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new defect in the seven-signal block between iteration 1 and this pass: the final-tree reproduction matches the recorded behavior exactly.

### A secret or environment exposure in the playbook's changed blocks: the payloads carry a prompt, cwd, hook event name and session id only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A secret or environment exposure in the playbook's changed blocks: the payloads carry a prompt, cwd, hook event name and session id only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A secret or environment exposure in the playbook's changed blocks: the payloads carry a prompt, cwd, hook event name and session id only.

### A secret, injection or ReDoS surface in the change: the signals are static author strings matched by substring/token rules, with no prompt-built regex and no filesystem or credential read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A secret, injection or ReDoS surface in the change: the signals are static author strings matched by substring/token rules, with no prompt-built regex and no filesystem or credential read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A secret, injection or ReDoS surface in the change: the signals are static author strings matched by substring/token rules, with no prompt-built regex and no filesystem or credential read.

### A stale `derived` block breaking routing: the fresh extractor does not add the seven phrases to `trigger_phrases`/`keywords`, so the derived lane is unaffected and the omission is not a routing defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale `derived` block breaking routing: the fresh extractor does not add the seven phrases to `trigger_phrases`/`keywords`, so the derived lane is unaffected and the omission is not a routing defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale `derived` block breaking routing: the fresh extractor does not add the seven phrases to `trigger_phrases`/`keywords`, so the derived lane is unaffected and the omission is not a routing defect.

### A state inconsistency: records, deltas, registry and strategy agree on iteration count, findings and coverage. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A state inconsistency: records, deltas, registry and strategy agree on iteration count, findings and coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A state inconsistency: records, deltas, registry and strategy agree on iteration count, findings and coverage.

### The playbook prompt itself: its parent and child labels reproduce exactly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The playbook prompt itself: its parent and child labels reproduce exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The playbook prompt itself: its parent and child labels reproduce exactly.

### The waived P05 coming back to the advisor through `skill graph is stale` / `rebuild the skill graph`: measured identical 0.8 `command-doctor-helper` ranking before and after; the helper handoff still wins. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The waived P05 coming back to the advisor through `skill graph is stale` / `rebuild the skill graph`: measured identical 0.8 `command-doctor-helper` ranking before and after; the helper handoff still wins.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The waived P05 coming back to the advisor through `skill graph is stale` / `rebuild the skill graph`: measured identical 0.8 `command-doctor-helper` ranking before and after; the helper handoff still wins.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining.
- Focus area: synthesis and stop.
- Reason: all four dimensions are covered, no new finding appeared in the final pass, and the only open findings are the recorded F001, F002 and F003.
- Rotation status: complete; the stop decision is `STOP` with reason `converged`.
- Blocked/productive carry-forward: F001 is the active P1 and keeps the verdict CONDITIONAL.
- Required evidence: the convergence script returned `STOP`, `converged`, score 1.0, blockedBy `[]`.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/graph-metadata.json` (intent_signals 33-39), `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` (commands 4-5 and Expected), `040-final-alignment-loop/decision-record.md` (ADR-001 row), `040-final-alignment-loop/acceptance-criteria.md` (AC-004), `040-final-alignment-loop/tasks.md` (T006), `040-final-alignment-loop/scratch/probes.json`.
- Claimed behavior: the four probe prompts P07/P08/P09 top `system-skill-advisor`; P05 stays on `/doctor:helper` under ADR-001; the CL-009 prompt renders `system-skilled-doctor → /doctor:update (ask)` in a parent and `(parent-named only)` in a child.
- Reuse and convention pointers: the explicit author lane reads `intent_signals` as exact declared phrases; the graph lane reads the compiled `runtime/scripts/skill-graph.json` signals; `declared-phrase-specificity.vitest.ts` states the specificity contract.
- Risk areas: generic two-word phrases matching ordinary prompts; the waived P05 remaining reachable by the advisor once graph-freshness phrases exist; stale `derived` block beside fresh `intent_signals`.
- Out of scope: the mention area, holdout corpora, and any source edit.
