# Review Report — render-hooks-plugin pass-four lineage

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (three active P2 findings)
- **Findings:** P0 = 0, P1 = 0, P2 = 3 (active only)
- **Review scope:** the `render-hooks-plugin` rows of `review/review-scope-4.txt` — `.opencode/plugins/lib/skill-advisor-render.js`, `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/hooks/shared/session-readers/codex.mjs`, `.skilled/hooks/shared/tests/session-readers/codex.test.mjs`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` — plus the shared docs that state their contract.
- **Operator review focus:** Code review pass four of command surfacing. FIRST read and follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4.txt: it names the scope file, which files your lineage reviews, the checks and the severity rules. HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through jq 'del(.prompt)', never run git diff, show or log -p over a path that includes command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage folder.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this lineage: the verdict is PASS and no P0/P1 finding remains. The three P2 advisories are suitable follow-up work.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    "R4-P2-001",
    "R4-P2-002",
    "R4-P2-003"
  ],
  "remediationWorkstreams": [
    "P2 advisory: open the Codex reader on containment.path, matching the other path-locator readers",
    "P2 advisory: decide whether the top-only route lookup follows the first passing row or stays on row 0, and align the phase 025 top-only sentence with that decision",
    "P2 advisory: state the child form (`parent-named only`) in the advisor README's companion sentence"
  ],
  "specSeed": [
    "Codex reader: read the resolved containment path, not the caller's transcriptPath",
    "Top-only route enrichment: make the lookup follow the row the renderer leads with, or document the row-0 limit as intended",
    "Advisor README: name `parent-named only` alongside run, start and ask"
  ],
  "planSeed": [
    "Add a codex symlink/read-path case that proves the opened path equals source.storePath",
    "Add a handler case where row 0 fails and row 1 passes, then assert the head command for both request shapes",
    "Update the advisor README companion sentence and the phase 025 top-only sentence in the same doc patch"
  ],
  "findingClasses": [
    "security-hardening",
    "cross-consumer",
    "documentation-gap"
  ],
  "affectedSurfacesSeed": [
    ".skilled/hooks/shared/session-readers/codex.mjs",
    ".opencode/plugins/system-skill-advisor.js",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/render.ts",
    ".skilled/skills/system-skill-advisor/README.md",
    ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R4-P2-001 | P2 | Codex opens the caller's locator after containment resolved a different path | correctness / security-hardening | `.skilled/hooks/shared/session-readers/codex.mjs:167` | `storePath = containment.path` at `:163`; `source.storePath` at `:188`; `readFileSync(transcriptPath)` at `:167`; `README.md:28` states the contained-open rule | A repointed link between check and read can return records from a file the check never approved while reporting the checked path | Read `storePath` (the `resolveInside` result), as `claude.mjs:219`, `devin.mjs:356` and `dsh.mjs:313` do | open | security-hardening | `rg -n "readFileSync\(transcriptPath"` returns only `codex.mjs:167` | `loadCodexSession`, `source.storePath`, `score-command-transcripts.mjs --runtime codex` |
| R4-P2-002 | P2 | The OpenCode top-only request can strip the head command from the first passing row | correctness / cross-consumer | `.opencode/plugins/system-skill-advisor.js:858` | `compiledRouteTopOnly: true` at `:858`; `advisor-recommend.ts:462` returns early for index > 0; `render.ts:530-540` leads with the first passing row | A failing row 0 spends the single route lookup and a passing row 1 leads without its command | Make `enrichCompiledRoutes` follow the first passing row, or keep the row-0 limit and document it in the phase 025 top-only sentence | open | cross-consumer | the three cited lines and the phase 021 Known Limitation 1 | `advisorCliRequest`, `enrichCompiledRoutes`, `renderAdvisorBrief` head selection, phase 025 docs |
| R4-P2-003 | P2 | The advisor README calls the companion policy run/start/ask and omits the child form the renderer prints | traceability / documentation-gap | `.skilled/skills/system-skill-advisor/README.md:121` | README sentence; `render.ts:216` returns `PARENT_NAMED_POLICY`; `doctor-brief-render.vitest.ts:84` pins `Also: /doctor:update (parent-named only)` | A child reader is told the parenthesized word is only run/start/ask, while the page's own test pins a fourth form | Name the child form in the companion sentence | open | documentation-gap | `rg -n -F 'where the policy is run, start or ask' README.md` prints line 121 | advisor README, hook reference child sentence, `render.ts` child branch, phase 025 doc sync |

All three findings carry concrete `file:line` evidence; none relies on inference alone. No active P0/P1 exists, so no claim-adjudication packet is required for STOP.

## 4. Remediation Workstreams

### P0 — none

### P1 — none

### P2 advisories (ordered)

1. **Codex contained open (R4-P2-001).** Open the resolved path in `loadCodexSession`, matching the other readers. Add a test that a store file reached through a link still reports and reads the resolved target.
2. **Top-only head command (R4-P2-002).** Decide whether the single route lookup follows the first passing row. If it does, change the handler and add the failing-row-0 case; if it does not, keep the current behaviour and make the phase 025 sentence state the row-0 limit.
3. **README child form (R4-P2-003).** Add `parent-named only` to the companion sentence, or link to the hook reference's child rule.

## 5. Spec Seed

- The Codex reader contract: "a reader opens the path its containment check resolved" applies to every path-locator reader, including Codex.
- The top-only option: state whether the lookup is tied to index 0 or to the first row that passes the threshold.
- The companion line: name all printed policy forms, including the child marker.

## 6. Plan Seed

- T1: `codex.mjs` reads `storePath`; add the symlink/read-path test.
- T2: Add the `advisor-recommend` handler case where row 0 fails and row 1 passes; update the preferred behaviour.
- T3: Update `README.md:121` and the phase 025 `advisor-recommend.md` top-only paragraph together.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | partial | Phase 021's companion and head requirements are implemented in `render.ts`; the adapter README's child sentence is narrower than the code (R4-P2-003); the top-only row-0 limit is R4-P2-002. | Two active P2; no P0/P1. |
| `checklist_evidence` | notApplicable | This is a code pass; the phase 021 `tasks.md` rows are the change record. | None. |

`AC_COVERAGE`: **exempt** — the review target is the phase-parent folder; it has no root `acceptance-criteria.md` or `implementation-summary.md`, and the child phases carry their own acceptance evidence. The signal does not change the verdict.

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | notApplicable | No agent definition changed in this area. | None. |
| `agent_cross_runtime` | pass | The shared renderer, child rule and plugin top-only request agree across claude, codex, opencode, pi, devin and dsh; `render-child-session.vitest.ts:146-153` compares the child flag with the spec-gate core. | The Codex path finding is reader-local, not a runtime-brief divergence. |
| `feature_catalog_code` | partial | `advisor-recommend.md:33` is accurate for `includeCompiledRoute`; its top-only sentence is the open phase 025 item. | Open doc task, not a new finding. |
| `playbook_capability` | notApplicable | No playbook surface changed. | None. |

## 8. Deferred Items

- The phase 025 doc-sync tasks for the top-only sentence and the two companion pages remain open; they are already in the packet's backlog.
- Phase 021 Known Limitations 3 (needs-mode fallback) and 5 (Claude label fallback) remain structural/known and are not reachable through this area's current producers.
- No runtime-mirror edit is proposed; mirrors are downstream packaging surfaces.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Selected review directions: correctness (iteration 1), security (iteration 2), traceability (iteration 2), maintainability (iteration 3), stabilization (iteration 4)
- Remaining frontier: none; the changed set is exhausted for this area.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* `searchDebt` is empty and `hasSearchDebt` is false.

## 10. Audit Appendix

### Convergence summary

| Iteration | Focus | New findings | Ratio | Notes |
|---|---|---|---|---|
| 1 | correctness | 2 P2 | 1.0 | Codex contained-open and top-only head-command findings |
| 2 | security + traceability | 1 P2 | 0.3333 | README child form; no new code security defect |
| 3 | maintainability | 0 | 0.0 | Changed tests and renderer module split clean |
| 4 | stabilization | 0 | 0.0 | Three active P2 re-read; registry and iterations agree |

Stop reason: **converged** on the fourth (coverage-stabilization) pass, at the configured four-iteration cap. Latest new-findings ratio 0.0; all four dimensions covered; no P0/P1.

### Coverage summary

- Dimensions: correctness, security, traceability, maintainability — 4/4 covered.
- Files reviewed: all seven changed files plus the shared docs that state their contract.
- Holdout hygiene: no changed file names or opens `command-prompts.jsonl` or `holdout-prompts.jsonl`; no holdout prompt text was read.

### Ruled-out claims

- The prompt cache cannot carry a lower-row command into a top-only request: it stores the un-enriched scorer output and re-enriches on every hit.
- A child cannot start a mutating command through the companion line: every mutating class prints `parent-named only`; read-only `run` stays visible by design.
- The ambiguous partner-command suppression is defensive: doctor commands are unique and the partner skill is already excluded.
- The compiled-route summary line is not dead code to remove: it is documented as kept for future wiring and its behavior is pinned by tests.

### Sources reviewed

- `.opencode/plugins/system-skill-advisor.js`
- `.opencode/plugins/lib/skill-advisor-render.js`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs`
- `.skilled/hooks/shared/session-readers/codex.mjs`
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/hooks/shared/session-readers/README.md`
- `.opencode/plugins/README.md`
- `.skilled/skills/system-skill-advisor/README.md`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`
- `021-brief-head-parity/spec.md`, `implementation-summary.md`, `tasks.md`

### Cross-reference appendix

- **Core Protocols:** `spec_code` partial; `checklist_evidence` notApplicable.
- **Overlay Protocols:** `skill_agent` notApplicable; `agent_cross_runtime` pass; `feature_catalog_code` partial; `playbook_capability` notApplicable.

Review verdict: PASS
