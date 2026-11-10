---
title: "Iteration 2: Candidate (a) advisor-brief pointer and candidate (b) trigger-index corpus inclusion"
trigger_phrases: []
---
# Iteration 2: Candidate (a) advisor-brief pointer and candidate (b) trigger-index corpus inclusion

## Focus

Measure what candidates (a) and (b) would actually emit, their silence conditions, per-turn context cost, and match key — then test both against the 022 injection bar and the `retrieval-conventions.md:284` exclusion decision.

## Actions Taken

- Read `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` in full (brief composition, token caps, directive append sites, fallback paths).
- Read `hooks/lib/directive-lifecycle.ts` decision logic (suppression conditions, fail-open behavior).
- Read `lookup-trigger-index.mjs` (artifact loading, result shape, exit codes).
- Measured the committed `trigger-index.json` artifact and ran a live `--scoring-only` lookup on a rule-shaped prompt.

## Findings

### Candidate (a): pointer line in the advisor brief

1. **Emission shape.** `renderAdvisorBrief` emits `Advisor: {live|stale}; use {skill} {conf}/{unc} pass.` (route block), then unconditionally appends `DIRECTIVES_LABEL` + `HYGIENE_DIRECTIVE` [SOURCE: render.ts:438-449]. A repo-rules pointer would be a second constant directive under `Directives:`, registered as a new policy id — `directiveBlockIds()` currently carries only `POLICY_COMMENT_HYGIENE_ID` [SOURCE: render.ts:102-106]. It would also ride the three fallback heads (`outage`, `skipped`, `no-match`), which append the same directive block [SOURCE: render.ts:476-489]. Emitted text ≈ one additional ~120–200-char line.

2. **Silence condition: none of its own.** The directive is constant; it has no condition beyond the brief itself. Its delivery is governed by the lifecycle dedup, not by relevance: full delivery on first proven message, every lifecycle boundary, directives-payload change, transcript reset, or any fail-open doubt [SOURCE: directive-lifecycle.ts:139-153,165-178]. On suppressed turns the model gets only `parts.head` (the Advisor line, ~43 bytes: `ROUTE_ONLY_ESTIMATED_BYTES`) [SOURCE: render.ts:99; directive-lifecycle.ts:149,179].

3. **Per-turn cost.** Zero on suppressed turns; the directive's full bytes on every full-delivery turn. `HYGIENE_DIRECTIVE` is ~230 chars [SOURCE: render.ts:112]; a comparable rules pointer adds roughly that once per delivery episode. The route block is capped at 80 tokens (320 chars), ambiguous at 120 [SOURCE: render.ts:90-93,131-137] — a directive is NOT token-capped; it is appended after `capText` [SOURCE: render.ts:438-449].

4. **Match key: none — constant.** It cannot condition on action or topic; it appears on every delivered brief including pure-read turns, so it fires precisely where Gate 5 deliberately does not.

5. **022 bar test.** The hygiene directive survives the bar because it "names a specific prohibition a pre-commit gate enforces" [SOURCE: injection-contract.md:52-54; render.ts:110-112]. A Gate-5 pointer restates `AGENTS.md:93-101` — content the always-loaded document already carries verbatim — and no mechanical gate enforces the trigger-table load (no hook denies a write that skipped it). It fails the bar's duplication prong unless framed for runtimes where `AGENTS.md` is absent — the exact reason hygiene exists [SOURCE: render.ts:110-112] — and even then it lacks the enforcement prong.

### Candidate (b): `.skilled/repo-rules` in `CORPUS_ROOTS`

6. **Emission shape.** The Gate 1 lookup returns rows of `{matchClass, path, phrases[], score}` from the committed artifact `runtime/data/trigger-index.json` [SOURCE: lookup-trigger-index.mjs:51,129]. Indexed rules would surface as `.skilled/repo-rules/<rule>.md` candidate rows — a context suggestion naming a file to read. Live check: `lookup-trigger-index.mjs --json --scoring-only -- "name the rollback first before force pushing"` returns `"results": []` today; with the root added, `blast-radius.md` would match on `"name the rollback first"` + `"force push"` [SOURCE: .skilled/repo-rules/blast-radius.md:6-8].

7. **Silence condition.** `--scoring-only` drops score-0 partials; a no-match prompt exits 1 with empty output [SOURCE: lookup-trigger-index.mjs:22-26]. So (b) IS self-silencing per turn — but only on vocabulary mismatch, not on action irrelevance. A read-only prompt containing "rollback" still surfaces the rule, inverting Gate 5's deliberate read-only exemption [SOURCE: AGENTS.md:94].

8. **Per-turn cost.** Marginal: 13 docs × ~17–30 phrases ≈ +~300 phrases onto a committed artifact that already holds 33,688 phrases across 3.7 MB — under 1% growth; parse cost per lookup is unchanged in shape (the artifact is parsed cold each call) [SOURCE: trigger-index.json measured; lookup-trigger-index.mjs:77-93]. The real cost is a row added to Gate 1's surfaced context whenever phrases match — a suggestion the model may then spend a Read on.

9. **The recorded decision it must overturn.** `retrieval-conventions.md:284` decided against BOTH lanes with a stated reason — "indexing them would surface a rule as a context candidate" at Gate 1 when they are meant to bind at Gate 5. `CORPUS_ROOTS` confirms the exclusion is live [SOURCE: corpus.mjs:30]. The divergence table is enforced by `retrieval-coverage-parity.vitest.ts` [SOURCE: retrieval-conventions.md:271]. Adding the root = reversing a recorded decision + updating the conventions table + regenerating a committed artifact — not a config tweak.

10. **Match key: prompt topic.** The lookup scores normalized query tokens against `trigger_phrases` — pure vocabulary matching [SOURCE: lookup-trigger-index.mjs:132-134; normalize.mjs scoring]. The trigger table it would duplicate is action-keyed [SOURCE: REPO RULES.md:12]. A rule surfaced because the prompt *mentions* rollbacks arrives on turns where the model takes no mutating action at all.

11. **Portability trap shared by (b) and any corpus-level surface.** The walker dedupes by resolved path and refuses a symlink whose target lands outside the repo root: `'symlink target outside the repository'` [SOURCE: corpus.mjs:299-310,334-342]. In sibling repos the shared rule files are symlinks INTO this checkout [SOURCE: specs/agents/010-repo-rule-system-integration/research/synthesis.md:13,31] — so an index built in a sibling would either skip them as out-of-root links or index duplicates, and `corpusRootsFor` only rewrites the `.skilled/` spelling anyway [SOURCE: corpus.mjs:44-51]. The federation shape works against a corpus-rooted surface.

## Questions Answered

- (a) emission/cost/silence: constant second directive; ~0 on suppressed turns, ~150–250 chars per full-delivery turn; never silenceable on its own.
- (b) emission/cost/silence: candidate rows in Gate 1 JSON/text output; <1% index growth + a row per matching turn; silent only on vocabulary miss.
- Neither matches on action; (b) matches on prompt topic, (a) matches on nothing.

## Questions Remaining

- Can candidate (c) — an action-keyed PreToolUse advisory — match on action like the trigger table does, and what does the hook infrastructure cost/emit? (iteration 3)
- Is the Gate 5 coverage gap (read-only turns, later actions in long sessions) a real problem worth a surface, or is (d) correct?

## Ruled Out

- A constant repo-rules directive in the advisor brief as the primary surface: it restates always-loaded `AGENTS.md` §2 content with no mechanical gate behind it — fails both prongs of the 022 bar. Residual: the `AGENTS.md`-absent runtime case survives as a narrower variant (carried to synthesis as a scoped form, not a general answer).
- Trigger-index inclusion as a small change: it is a recorded-decision reversal enforced by a parity test, and its failure mode is topic-matched surfacing on turns where rules deliberately don't bind.

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: converted both candidates from descriptions into measured emission shapes with real costs; ran the live lookup proving the exclusion; found the directive-lifecycle mechanics that set (a)'s true cost (dedup-gated, never self-silent); found the walker's out-of-root symlink refusal that breaks (b) under federation.
- Confidence: high for emission shapes and costs (code-measured); medium-high for the 022-bar application (the bar is documented but its application to a constant directive is judgment grounded in the retired-directives precedent).

## Reflection

- Worked: running the actual lookup on a rule-shaped prompt turned "would surface as a context candidate" from a predicted failure into an observed one (empty today by design).
- Worked: reading `directive-lifecycle.ts` instead of estimating gave the real cost model — suppression vs full delivery, not per-turn constant.
- Limitation: no per-runtime measurement of how often full-delivery vs suppressed turns occur in practice — that is a log question, flagged rather than estimated per the 022 rule.

## Recommended Next Focus

Iteration 3: candidate (c) action-keyed PreToolUse advisory — inventory `.skilled/hooks/` registration and `.claude/settings.json` wiring, what a Write/Edit-time advisory could emit, its silence condition, whether action-keying survives the trigger table's own semantics, plus candidate (d) and the sibling-repo symlink check.

## Sources Consulted

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts]
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:100-179]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:15-134]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json] (measured: 3,738,528 bytes, 33,688 phrases)
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:30,44-51,299-342]
- [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:271,280-285]
- [SOURCE: .skilled/hooks/injection-contract.md:50-68]
- [SOURCE: AGENTS.md:94-96]
- [SOURCE: REPO RULES.md:12]
- [SOURCE: .skilled/repo-rules/blast-radius.md:4-20]
- [SOURCE: specs/agents/010-repo-rule-system-integration/research/synthesis.md:13,31]
