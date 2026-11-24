# Review Iteration 005 — maintainability

- Iteration: 5 of 5 (terminal: `stopPolicy: max-iterations`)
- Dimension: maintainability
- Operator review focus: the sixth-round code shape and the closure record that carries it; also the final state of `spec_code` and `checklist_evidence`.
- How this iteration addressed the focus: it read the two gate copies for shared vocabulary and shared constants, checked that the comments state the durable why rather than an artifact label, and reviewed the closure-doc structure that a later round has to extend.

## Dispatcher

Executed inline as `@deep-review` for lineage `deepseek-max-3`. No nested dispatch.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-620`, `:1000-1070` (word lists, lead patterns, window constant)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:40-60`, `:880-900`, `:4470-4520`, `:4860-4900`, `:5020-5290` (copies and constants)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:55-235` (parity guard scope)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:990-1010` (`refinesSameLocation`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:219-248` (limitations list)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` (limitation 8 contradicts the served fallback) is rechecked below and stays active, so the terminal verdict is CONDITIONAL.

### P2 Findings

5. **The two cross-runtime constants are duplicated literals with no parity assertion** — `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592` — the lead window is `400` on the native side `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592]` and `_LEAD_WINDOW = 400` on the Python side `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886]`; the prompt head is `ADVISOR_PROMPT_MAX_CHARS = 10_000` in the schema `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]` and a second literal `10_000` in the Python module `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52]`. The vocabulary guard compares word lists only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62]`, so raising one window or head keeps every test green while the two copies answer differently on a long prompt, which is the exact failure REQ-030's bounded-window work exists to prevent.
   Finding class: duplicated-constant
   Scope proof: both constants, both readers and the guard that omits them are reviewed scope files; the mismatch is readable without executing anything.
   Affected surface hints: the deep-loop refusal gate on both runtimes; any future tuning of the long-prompt cost.
   Case: a developer raises the native window to 800 to catch a longer refusal lead and leaves Python at 400; the suite still passes, and a 600-character lead withholds natively but offers the command through the fallback.
   ```json
   {"type":"claim_adjudication","claim":"the 400-character lead window and the 10,000-unit prompt head are duplicated across the two gate copies with no test asserting they agree","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886",".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62"],"counterevidenceSought":"looked for a generated schema or a shared constant module, and for a test that reads the Python literals","alternativeExplanation":"a Python process cannot import a TypeScript constant without a build step, so duplication is expected; only the missing assertion is the defect","finalSeverity":"P2","confidence":"high","downgradeTrigger":"none; it closes with a parity assertion or a generated constant"}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence | Note |
|----------|-------|--------|----------|------|
| `spec_code` | core | partial | `spec.md:223`; `hub-router.json:34`; `command-attach.ts:274`; `reduce-state.cjs:995` | Final state: REQ-001 to REQ-034 mapped; one requirement (REQ-011, third alias) is partial and one (REQ-033) is satisfied by this run's own synthesis. |
| `checklist_evidence` | core | partial | `acceptance-criteria.md:105`; `tasks.md:291` | Final state: 42 acceptance rows resolved (38 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet`); one P2 records thirteen drifted evidence pointers. |
| `skill_agent` | overlay | notApplicable | - | The review target is a spec-folder packet plus code; no skill or agent definition is claimed by this packet's acceptance rows. |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent mirror is named in the packet's requirements or acceptance rows. |
| `feature_catalog_code` | overlay | notApplicable | - | No feature-catalog entry is claimed. |
| `playbook_capability` | overlay | notApplicable | - | No playbook entry is claimed. |

## Integration Evidence

- Both gate copies build their patterns from named lists that the drift guard pairs `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62]`.
- The reducer's refinement boundary is a single predicate with a readable name `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995]`.
- The closure record keeps its limitation list in one anchored block a later round can extend `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:245]`.

## Edge Cases

- **`refinesSameLocation`'s declared-dimension branch.** When the target finding never declared a dimension, a refinement that declares a different one still folds, because the predicate returns false only on a known-different declared dimension `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:999]`. REQ-032's wording names "a different file or dimension"; the test file covers the declared-dimension case, and the undeclared-target case is outside the requirement's stated case. Recorded as an edge case, not a finding.
- **The closure limitation list mixes rounds.** Limitation 8 was added in the sixth round and describes the Python fallback; it is the active P1 rather than a maintainability point.
- **Terminal stop.** The iteration cap is reached, so the loop stops with `maxIterationsReached`; the convergence signals were never the stop condition under `max-iterations`.

## Confirmed-Clean Surfaces

- Every interpolated word is escaped before it becomes a regex, so a list entry cannot silently become a wildcard `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:469]`.
- The new gate branches open behind `skillId === 'system-deep-loop'`, so no other hub consults the loop vocabulary `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1319]`.
- The comments state the durable why (why loop wording opens the gate, why a subject loop name is blanked, why the window is bounded) rather than a packet or round label.
- The reducer keeps a refinement at another file or another declared dimension as its own entry with its `refines` link, and still folds a same-file refinement `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995]`.
- The vocabulary guard reads the Python tuples out of the source instead of importing them, so a renamed list fails rather than comparing empty `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:227]`.

## Ruled Out

- **A dead or unreachable sixth-round branch.** Ruled out: every new predicate is reachable from `attachCommand`, `withholdDeepLoopDoctorWithoutRun`, `degradedRecommendations` or the Python gate.
- **A comment that has gone stale in the code.** Ruled out for the gate comments; the stale prose lives in the closure record (the active P1).
- **An unbounded new read on every prompt.** Ruled out: the two windows bound the new scans, and the 10,000-unit head bounds the Python gate.

## Next Focus

- None. This is the terminal iteration: the cap is reached and synthesis follows.
- Rotation status: correctness, security, traceability (`spec_code` and `checklist_evidence`) and maintainability all reviewed.
- Carry-forward for synthesis: `R1-P1-001` active (docs claim), `R1-P2-002`, `R3-P2-003`, `R4-P2-004` and `R5-P2-005` active; protocol statuses `spec_code: partial`, `checklist_evidence: partial`.
- Required evidence for the report: the five finding ids, the protocol table, the acceptance counts, and this run's own terminal gates.

Review verdict: CONDITIONAL
