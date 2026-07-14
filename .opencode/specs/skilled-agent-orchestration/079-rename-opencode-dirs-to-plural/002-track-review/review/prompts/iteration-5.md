# Deep-Review Iteration 5 Prompt Pack

## STATE

Iteration: 5 of 10
Dimension: maintainability (deep pass)
Prior Findings (cumulative): P0=1 P1=8 P2=6 (15 total)
Dimension Coverage: [correctness:complete, security:complete, traceability:complete] (3/4)
Coverage Age: 0
Last 2 ratios: 0.31 -> 0.30
Stuck count: 0
Provisional Verdict: FAIL (active P0)
Convergence Score: 0.70

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

Active findings (read prior iterations for full packets):
- P0-001 (P1-001): dist code-graph globs stale; live runtime
- P1-002: Command YAML sk-deep-* drift
- P1-003: skill_advisor.py writes .opencode/skill/.advisor-state
- P1-004: 096 validate.sh failure (parent + 004-symlinks)
- P1-005: artifact resolver accepts malformed spec_folder
- P1-006: Claude Stop hook env-selected autosave precedence
- P1-007: Completed packets have unchecked required checklist evidence
- P1-008: OpenCode deep-loop leaf-agent mirrors cite non-existent sk-deep-* paths
- P1-009: Codex @review mirror weakens P1 blocking contract
- P2-001..006: doc-only drift across various surfaces

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- Config / State Log / Findings Registry / Strategy under `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-005.md`
- Delta target: `deltas/iter-005.jsonl`

## TASK FOR THIS ITERATION (D4 Maintainability)

Per strategy §12 NEXT FOCUS:

1. **Doc anchors and dead refs** after the bulk plural rename:
   - Stale `sk-deep-*` prose outside the command/agent hot paths already covered.
   - Narrative casualties like resource-map tautologies (`.opencode/skills/ → .opencode/skills/`) introduced by sed running over its own input.
   - Broken links/anchors in packet 096 parent + child docs (`001-skills`, `002-agents`, `003-commands`, `004-symlinks`).

2. **Active doc/script sweep** for singular-root references not already covered by P0/P1/P2 findings:
   - Install guides (already P2-001), Barter root helpers (already P2-003), dist fixtures (already P2-002).
   - Look for any NEW surface: `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, top-level shell scripts, GitHub workflows (`.github/workflows/`), README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT in repo root.

3. **Source/dist rebuild hygiene**:
   - Determine the scope of dist drift. Is it isolated to `code_graph/` (P0-001 / P2-002) and `scripts/tests/` or broader?
   - Sample 5-7 source `.ts` files under `mcp_server/lib/` and `mcp_server/code_graph/lib/` and `mcp_server/skill_graph/`, compare against their `dist/` counterparts. Surface any surface where source uses plural and dist uses singular.

4. **Maintenance guard recommendation**:
   - Identify the smallest verification guard that would catch the family of bugs this review surfaced (e.g., a CI grep that fails on `\.opencode/(skill|agent|command)/` outside an allowlist, or a `npm run build` step before commit on packets that touch `mcp_server/lib/`).

5. **Naming consistency**:
   - The skill folder names mix `sk-*` (sk-code, sk-doc, sk-git, sk-prompt, sk-code-review) with bare names (cli-codex, cli-gemini, deep-review, deep-research, deep-agent-improvement, mcp-*, system-spec-kit). Is this intentional (per project convention) or accidental drift? Check the skill description budget and routing tables.

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 9 tool calls, soft 12, hard 13.
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with `findingDetails` array.
- Mark D4 Maintainability `[x]` if pass converges. Update §12 NEXT FOCUS for iter-6 (likely re-pass on least-covered dimension OR adversarial re-verification of P0/P1 candidates).

## OUTPUT CONTRACT

1. **iteration-005.md**: Dimension, Files Reviewed, Findings by Severity (with adjudication packets), Traceability Checks, Verdict, Next Dimension.

2. **State log iteration record** APPENDED:

```json
{"type":"iteration","iteration":5,"mode":"review","run":"run-5","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":["..."],"findingsCount":<cumulative>,"findingsSummary":{"P0":<cum>,"P1":<cum>,"P2":<cum>},"findingsNew":[/*new ids*/],"findingDetails":[/*all touched this iter*/],"traceabilityChecks":{"summary":{...},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-07T14:46:56Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

3. **iter-005.jsonl** — matching iteration record + finding records + classifications + ruled-out.

`newFindingsRatio` formula: P0=10/P1=5/P2=1, max(calc, 0.50) on new P0; 0.0 if no new findings.

Begin.
