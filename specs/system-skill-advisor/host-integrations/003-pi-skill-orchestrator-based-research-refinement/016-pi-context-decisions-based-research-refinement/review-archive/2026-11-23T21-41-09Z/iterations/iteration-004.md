# Review Iteration 4 - maintainability

## Dispatcher

- Route: mode=review, target_agent=deep-review, execution=single_review_iteration.
- Run: 2026-11-23T21:02:32.908Z, generation 4, iteration 4 of 5, dimension maintainability.
- Review target: `.skilled/skills/system-skill-advisor` (read-only). No source, doc, config, registry or reducer file was modified.
- Lineage: config declares `lineageMode` restart while the findings registry declares resume; recorded since iteration 1 and copied from config per contract.
- BINDING: target=.skilled/skills/system-skill-advisor
- BINDING: maxIterations=5
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement

## Dimension

maintainability. Operator focus addressed: the advisor logic in `runtime/` and `hooks/`, with the Python fallback `skill_advisor.py` read as maintained code. Prose docs were used only as claims about code, never as review subjects.

## Files Reviewed

- runtime/lib/scorer/fusion.ts:1104-1471 (`scoreAdvisorPrompt` full span), :648-769 (`primaryIntentBonus`), :562-643, :340-401, :493-561, :838-1009
- runtime/lib/command-attach.ts:257-373 (`typedCommandForTop`), :522-606 (`isNoEditRequest`), :668-743, :827-898
- runtime/lib/prompt-policy.ts:1-120, :245, :267-276
- runtime/schemas/advisor-tool-schemas.ts:257, :586-594
- runtime/lib/scorer/scoring-constants.ts:1-17, :180-240
- runtime/lib/policy-plan.ts:203-211, :228
- runtime/lib/df-idf.ts:124-136
- runtime/scripts/skill_advisor.py:52, :242-243, :5258-5305, :4038-4082, :4147-4148
- hooks/pi/prompt-advisor.ts:1-38, :96-190
- hooks/claude/user-prompt-submit.ts:182, :290-322
- hooks/lib/route-receipt.ts:100-120, :230-320
- hooks/lib/directive-lifecycle.ts:1-100, hooks/lib/directive-lifecycle-file-store.ts (helper spawn shape), hooks/lib/directive-lifecycle-store.py (376 lines, contract carrier)
- hooks/vibe/prompt-advisor.mjs:78-168, hooks/dsh/prompt-advisor.mjs:44-160
- runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25, runtime/tests/python/test_skill_advisor.py:2534
- Probes: repo-wide `rg` for `AdvisorToolInputSchemas`, `ADVISOR_INPUT_SCHEMAS`, `ablation`, comment-id patterns, embedding-lane vocabulary; perl/python line-span counter for function lengths (no repository file written).

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R2-P1-001 (fail-closed trusted-caller guarantee contradicted by the launcher default) remains active and is unchanged by this pass; no maintainability evidence downgrades or resolves it.

### P2 Findings

1. **`AdvisorToolInputSchemas` is exported and read by nothing** -- .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:588 -- The aggregate map `{ advisor_recommend, advisor_rebuild, advisor_status, advisor_validate }` is exported at :588-594 and has zero consumers: a repository-wide search for the identifier (dist excluded) returns only the definition line. The four per-tool schemas it wraps are consumed individually by the handler parsers, so the map is a fifth registry nobody reads. Keeping it invites a maintainer to treat it as the tool registry and to add a tool that the daemon itself never routes.
Finding class: dead export / duplicate registry
Scope proof: `rg -n "AdvisorToolInputSchemas" . -g '!**/dist/**'` returns exactly one hit, the definition; the separate name `ADVISOR_INPUT_SCHEMAS` does not exist anywhere in the tree, so the surface named in the prior strategy is in fact this symbol.
Affected surface hints: runtime/schemas/advisor-tool-schemas.ts:588 the map -> runtime/handlers/advisor-recommend.ts:641 and the three sibling handlers that parse the individual schemas -> runtime/tools/index.ts:39-46 `TOOL_DEFINITIONS`, the registry the server actually uses
Case: a maintainer adds a fifth advisor tool, updates `AdvisorToolInputSchemas` at :588 believing it is the tool surface, and the server never exposes it because `TOOL_DEFINITIONS` and the CLI manifest are the real registries; nothing fails, the new entry sits in a dead object.

2. **`scoreAdvisorPrompt` is a 368-line sequential pipeline with no stage seam** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1104-1471 -- One function spans 368 lines (:1104-1471) and interleaves roughly thirty ordered bonus, withhold and handoff steps (`primaryIntentBonus` :648-769 is itself 122 lines; `readOnlyRouteAllowed` :562-643 is 82; `keepPassingSkillsAboveDoctorBridges` :838-917 is 80). Order is behavior: each stage mutates the same recommendation list before the next one reads it, and no table, stage registry or per-stage return value records the intended order. In `command-attach.ts` the same shape appears at a smaller scale (`typedCommandForTop` :257-373 is 117 lines; `isNoEditRequest` :522-606 is 85).
Finding class: oversized function / implicit ordering invariant
Scope proof: line spans measured over the function-declaration list of each file (fusion.ts 1471 lines, command-attach.ts 942 lines); every stage listed is called from inside the `scoreAdvisorPrompt` body, so the ordering claim is structural rather than inferred from names.
Affected surface hints: runtime/lib/scorer/fusion.ts:1104-1471 the pipeline -> the exported withhold helpers at :1010, :1028, :1047, :1061 that the body calls in sequence -> runtime/lib/scorer/scoring-constants.ts:180-240 the knobs each stage reads -> runtime/handlers/advisor-recommend.ts:630-653 the only production caller
Case: a maintainer inserts a new withhold step after `withholdMentionedCommands` (:1010) instead of before it. Type-check passes, the withheld set differs, and ranking changes order for prompts that name a command; no test or type error identifies the insertion point as wrong because the sequence exists only as statement order in one body.

3. **The Pi adapter hard-copies the Claude hook's advisor budget and re-implements its parse rule** -- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22-38 -- `PI_ADVISOR_DEFAULT_BUDGET_MS = 2500` carries the comment "Mirrors the Claude hook's default budget, which Pi cannot import statically because it loads the hook lazily", and `advisorBudgetMs()` re-implements the env parse with the comment "The hook applies the same parse rule; diverging here would let Pi's deadline fire before the hook's own budget expires". The original is `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` at hooks/claude/user-prompt-submit.ts:182. Two constants and two parsers are kept equal by hand, and the comment itself names the drift as the failure mode, yet nothing compares them.
Finding class: hand-kept duplicate with no guard
Scope proof: both constants resolve to 2500 at the cited lines, and the Pi file's own import list (:1-13) holds only the extension API type, so the value cannot be imported today; the parse-rule duplication is stated at :29-30.
Affected surface hints: hooks/pi/prompt-advisor.ts:23 the copied default -> :30-38 the copied parser -> hooks/claude/user-prompt-submit.ts:182 the source constant and its parser -> hooks/pi/prompt-advisor.ts:211+ the deadline path that consumes the budget
Case: the Claude hook budget is raised to 3000. Pi keeps 2500, its deadline fires while the hook is still working, and Pi silently returns no brief for prompts where Claude delivers one; the divergence produces no error and no log.

4. **The prompt cap and the confidence floors are hard-coded once per language with no shared source** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52 -- `ADVISOR_PROMPT_MAX_CHARS = 10_000` mirrors `ADVISOR_PROMPT_MAX_CHARS = 10_000` at runtime/schemas/advisor-tool-schemas.ts:257, and `_LOOP_OWNER_CONFIDENCE_FLOOR = 0.82` at skill_advisor.py:4147 mirrors the three 0.82 knobs at scoring-constants.ts:185, :190, :192. The prompt-policy sets in the same feature are single-sourced in `runtime/data/prompt-policy.default.json`, which shows the shared-data pattern already exists in this skill; these numerics do not use it, and no test asserts the two languages agree on them.
Finding class: cross-language duplicated constant / drift-prone hand-kept list
Scope proof: each name exists exactly twice with the same value (one TS site, one Python site) as cited; scoring-constants.ts:1-17 declares itself "Single source of truth for the numeric tuning constants" without naming the Python mirror, so the stated single-source claim stops at the language boundary.
Affected surface hints: runtime/schemas/advisor-tool-schemas.ts:257 the TS cap -> runtime/skill-advisor-cli.ts prompt slicing -> runtime/scripts/skill_advisor.py:52 the Python cap -> scoring-constants.ts:185-192 the TS floors -> skill_advisor.py:4147-4148 the Python floors -> runtime/tests/parity/python-ts-parity.vitest.ts corpus parity, which compares top-1 outcomes rather than constants
Case: the prompt cap is tightened to 8_000 in the Zod schema. The daemon now rejects a 9_000-character prompt while the Python fallback still scores all 9_000 characters, so the same paste can route one way through the daemon and another through the fallback; the parity corpus does not contain a prompt in that band.

5. **The pasted-reply strip rule is maintained twice in two regex dialects, and its only cross-language guard sits in a legacy test folder** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5258 -- The Python regex `_PASTED_REPLY_CUE` (:5258-5268) and the TypeScript `PASTED_REPLY_CUE` (runtime/lib/prompt-policy.ts:245) encode the same cue vocabulary, and the Python comment states the parity rule explicitly ("re.ASCII keeps case folding to ASCII letters, as a JavaScript /i regex without the u flag does"). The shared fixture `pasted-reply-strip-cases.json` is read by `runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25` and by `runtime/tests/python/test_skill_advisor.py:2534`, so the fixtures do cover both implementations today, but the TypeScript side of the guard lives under `tests/legacy/`, the folder this repository uses for suites slated for retirement.
Finding class: manuscript duplication with a guard in a retirement path
Scope proof: the two implementations are cited at both ends; the two fixture consumers are cited at both test lines; the Python docstring at :5283-5287 states it must strip "as the native scorer does", which is the invariant the fixtures enforce.
Affected surface hints: runtime/lib/prompt-policy.ts:245 the TS cue -> :267-276 the TS loop -> runtime/scripts/skill_advisor.py:5258, :5282 the Python mirror -> runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25 the TS fixture guard -> runtime/tests/python/test_skill_advisor.py:2534 the Python fixture guard
Case: a new cue phrase ("the model answered:") is added to the TypeScript regex and its fixture rows. The Python suite still passes because no Python row exercises the new phrase, so the fallback keeps scoring the pasted reply's skill names; the drift is invisible until someone routes the same paste through both paths.

6. **The Gate-3 question lookup converts a load failure into "no question" with no diagnostic** -- .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203 -- `currentGateQuestion()` wraps `requireOwnerModule('.../spec-gate-core.mjs')` in a bare `catch { return undefined; }` (:209-211), and the only consumer uses that value as policy content at :228. An absent question and an unreachable owner module are the same value, so a renamed or relocated owner module silently removes the question from every policy plan instead of degrading loudly.
Finding class: swallowed failure / absent-versus-broken conflation
Scope proof: the function has exactly one call site (:228) and one exit for failure (:210); no diagnostic channel is written in the catch block, unlike the neighbouring metrics writers that record a best-effort miss.
Affected surface hints: runtime/lib/policy-plan.ts:203-211 the swallow -> :228 the sole consumer -> the owner module path it requires, which lives outside this skill and is therefore a cross-package contract with no compile-time link
Case: the spec-gate owner module renames `GATE_3_QUESTION`. The require resolves but the property is absent, the function returns undefined, and every advisor policy plan reports no Gate-3 question; the advisor keeps functioning and no log line distinguishes this from a configuration that intentionally has no question.

## Traceability Checks

No cross-reference protocol was run in this pass: maintainability is not a protocol-bearing dimension, and the two overlay protocols still unrun (`skill_agent`, `agent_cross_runtime`) need the agent-definition and runtime-mirror surfaces rather than the maintainability evidence gathered here. The result is recorded as an empty set rather than as `pending` or as a pass. Core protocols were recorded in iterations 1-3 (`spec_code` fail at iteration 3, `checklist_evidence` notApplicable at iteration 3) and are not restated here.

## Integration Evidence

Exact surfaces checked as consumers, not as nearby files:

- Pi extension adapter: `hooks/pi/prompt-advisor.ts:96-190` (`isPiDirectiveDedupEnabled`, `splitPiDirectiveBrief`, `decidePiDirectiveDelivery`) implements dedup locally and imports nothing from `hooks/lib/directive-lifecycle.ts`; the adapter's only import is the extension API type (:11).
- Claude hook: `hooks/claude/user-prompt-submit.ts:182` supplies the canonical budget constant that Pi copies; the same file reads `stripLeadingPastedReply` from `runtime/lib/prompt-policy.js`.
- Shared hook modules: `hooks/lib/directive-lifecycle.ts:14-33` re-exports `FileDirectiveLifecycleStore`, which spawns the Python helper `hooks/lib/directive-lifecycle-store.py` for every store operation, so that store is one implementation split by language rather than two copies.
- Receipt surfaces: `hooks/lib/route-receipt.ts` is consumed by the claude, dsh and vibe adapters, while vibe additionally keeps adapter-local head-receipt functions (`hooks/vibe/prompt-advisor.mjs:107-168`) — a second receipt shape inside one adapter, not a cross-adapter duplication.
- Python fallback: `runtime/scripts/skill_advisor.py:5258-5305` implements the strip rule the fixtures pin, and `:4147-4148` holds the loop-owner floors that parallel `scoring-constants.ts`.

## Edge Cases

- The prompt-policy sets and thresholds are NOT duplicated: `runtime/lib/prompt-policy.ts:43-46` loads `runtime/data/prompt-policy.default.json`, so those values are single-sourced in data. The duplication findings above are scoped to the numerics that are not in that file.
- The `directive-lifecycle-store.py` ↔ `directive-lifecycle-file-store.ts` pair was checked before filing duplication: the TypeScript store shells out to the Python helper, so it is a split implementation and was not filed.
- `ablation.ts` has no production importer, but it is imported by `runtime/tests/parity/python-ts-parity.vitest.ts` and by the stress suite, so it is test support rather than dead production code and was not filed.
- Four adapters (claude, pi, dsh, vibe) carry different receipt designs. Only the Pi budget pair has a constant that must agree numerically; the other receipt shapes differ by host capability, so they are recorded as cost, not filed as a defect.
- Function-length thresholds are a judgement call: the second finding cites the spans and the ordering risk, not a line-count rule. If a stage table or ordering test is added, the finding is satisfied without splitting the function.
- The Python/TS parity suite was again not executed; this pass compared constants and regexes by reading, which is what the findings claim. Execution remains deferred, not claimed clean.

## Confirmed-Clean Surfaces

- Comment hygiene: no artifact label appears in any code comment under `runtime/` or `hooks/` (excluding tests and dist). A scan for ADR/REQ/CHK/TSK/task/phase/packet/finding/iteration identifiers returns zero hits; the `specs/<packet>` mentions that do exist (e.g. `runtime/advisor-server.ts:103`, `runtime/lib/skill-graph/skill-graph-db.ts:241-242`, `runtime/lib/freshness/generation.ts:64-65`) describe why a cwd must be anchored and are durable WHY, not labels.
- Embedding-lane retirement: no reference to an embedding lane, vector lane or cosine scoring survives in `runtime/` or `hooks/` outside one generated command-bridge keyword row (`runtime/scripts/command-bridges/command-bridges.generated.json:2058`, a user-facing trigger phrase about cleaning up a retired lane) and prose. No dead embedding module, flag or branch was found.
- Prompt-policy data single-sourcing: `runtime/data/prompt-policy.default.json` supplies the sets and thresholds, with env overrides resolved in one place (`runtime/lib/prompt-policy.ts:43-63`), so the policy vocabulary is not hand-kept in two languages.
- Directive lifecycle store: one implementation (Python) driven by one TypeScript wrapper; no second copy exists in the adapters.
- `RESERVED_COMMANDS` and the CLI command set: the manifest remains the single registry for command names, with `RESERVED_COMMANDS` (`runtime/skill-advisor-cli.ts:42`) the only name list outside it, as recorded at iteration 3.

## Ruled Out

- Prompt-policy vocabulary duplication between TypeScript and Python: the sets and thresholds come from one JSON data file, and only the strip regex and the numerics with no data file are filed.
- A duplicate directive-lifecycle store in Python and TypeScript: the TypeScript store invokes the Python helper for every operation, so the pairing is a split implementation.
- Dead production code from the retired embedding lane: no embedding module, flag or branch remains outside one generated keyword row.
- Test-only ablation helpers as dead production code: imported by the parity and stress suites.
- Comment hygiene violations: zero artifact identifiers in comments under review.
- `AdvisorToolInputSchemas` having a consumer outside the skill: repository-wide search returns the definition only.

## SCOPE VIOLATIONS

None. No write was attempted outside the three permitted state files; all probes ran read-only and any scratch file was placed under the private temp directory.

## Next Focus

- Dimension: cross-reference / synthesis (no dimension remains unreviewed).
- Focus area: the five carried P2s that were raised before this pass (R1-P2-001 through R1-P2-005) plus R2-P2-001/R2-P2-002 and the two traceability P2s, checked for whether the maintainability evidence changes any of them; then the release-readiness statement for a run with one active P1 and no P0.
- Reason: all four configured dimensions are now reviewed. The fifth iteration is the closing pass, and its job is to re-verify carried findings rather than to open a new dimension.
- Rotation status: correctness, security, traceability and maintainability reviewed; 6 new P2 this pass, 15 P2 total, 1 active P1.
- Required evidence: a file:line recheck for every carried P2 that the verdict depends on, and an explicit statement of which overlay protocols remain unrun.
- Recovery note: if the closing pass cannot re-verify the carried P1, the run ends CONDITIONAL rather than PASS.
- Deferred: executing the Python/TS parity suite; `skill_agent` and `agent_cross_runtime` overlay protocols.

## Verdict

No active P0 and one active P1 (R2-P1-001), so the verdict is CONDITIONAL. The six new findings are maintainability debts with no runtime capability change.

Review verdict: CONDITIONAL
