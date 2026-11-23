# Iteration 003 - Traceability and Maintainability, plus recheck

## Dispatcher

- Generation 5, iteration 3 of 3, native executor (opus), lineageMode restart, sessionId 2026-11-23T21:41:17.101Z.
- Iteration number derived from the state log: two prior `type:"iteration"` records, so this is iteration 3 (matches the dispatch).
- Worktree HEAD 4eda64f6c27; last commit touching the skill tree 54322bd4bbe; `git status --porcelain` over the skill tree was empty, so the rechecks read committed code.

## Dimension

Traceability (core spec_code, overlay feature_catalog_code) and maintainability (the deferred TypeScript/Python duplication question). Operator focus addressed: all four jobs. (1) spec_code ran against the tool schemas, the CLI manifest and the skill-graph status and validate handlers carried from iteration 2; feature_catalog_code ran against the 48 catalog files. (2) The duplication question was settled per vocabulary below. (3) All eight open findings of this generation were rechecked at HEAD. (4) Every citation uses its full repo-relative path.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts (1-140)
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts (36-60, 118-197)
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts (33, 744-750, 1095-1101)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts (50-150, grep over 150-244)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/validate.ts (grep over 1-345)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/response-envelope.ts (1-53)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/propagate-enhances.ts (19-70), scan.ts (42-60)
- .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts (37-51)
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts (40-56), lib/derived/extract.ts (40)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts, lib/skill-graph/skill-graph-db.ts, advisor-server.ts, lib/shadow/shadow-sink.ts, hooks/lib/skill-advisor-cli-fallback.ts (recheck lines only)
- .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts, rollback.ts, schema-migration.ts (caller grep)
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py (43-52, 206-215, 301-341, 1784, 5038-5039; AST probe)
- .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts (15-45), tests/python/test_skill_advisor.py (1001), tests/routing-registry-drift-guard.vitest.ts (16-17) — test reading only
- .skilled/skills/system-skill-advisor/feature-catalog/ (48 files; path sweep plus claim reads in cli-surface/skill-advisor-cli.md, cli-surface/skill-graph-scan.md, lifecycle-routing/*.md) — context evidence

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The low-information and slash predicates are hand-copied into the Python fallback with no shared fixture pinning them** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5038 -- The Python fallback restates the TypeScript abstention predicate by hand: `meaningful = [token ... if len(token) > 1]` and `if len(meaningful) > 3 or ... or "/" in prompt_lower` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5038-5039], against `meaningfulTokenCount ... token.length > 1` and `<= 3` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1303-1305] and the slash test [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255]. Unlike the deep-routing projection (hash-pinned at skill_advisor.py:341 and checked by tests/routing-registry-drift-guard.vitest.ts) and the thresholds (read from schemas/compat-contract.json at skill_advisor.py:212-213), nothing generates or pins this predicate; iteration 2's parity suites pass only because both copies carry the same defects. The two copies even tokenize differently (Python `\b\w+\b`, TypeScript whitespace split), so "src/a.ts" is one token in TypeScript and three in Python. Both copies carry G5-I1-P2-002 and G5-I1-P2-004, so a fix to fusion.ts alone leaves the fallback behind and no test will flag the split.
   Finding class: hand-duplicated-logic-without-guard
   Scope proof: skill_advisor.py and fusion.ts are both in reviewScopeFiles.
   Affected surface hints: runtime/scripts/skill_advisor.py low-info branch, runtime/lib/scorer/fusion.ts lowInfoPrompt and command-penalty predicate, tests/parity corpus.
   Case: a maintainer fixes G5-I1-P2-004 in fusion.ts by filtering stop words, and the prompt "do it to me" then abstains on the native path but still routes on the Python fallback, with every parity test still green because the corpus holds no stop-word-only prompt.

2. **The feature catalog presents supersession routing, rollback and v2 backfill as live behaviour, but no production code calls them** -- .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:39 -- `routeSupersession` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:39], `rollbackGraphMetadataFile` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts:60], `backfillDerivedV2` and `readMixedVersion` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts:32] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts:45] have exactly one caller each outside their own module: runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts (grep over runtime/ and hooks/, excluding tests and dist, finds nothing else). The catalog says supersession.ts "reads supersession fields from each skill's graph-metadata.json, demotes the superseded" skill (feature-catalog/lifecycle-routing/supersession.md:22) and that rollback.ts "reverts lifecycle metadata changes atomically" (feature-catalog/lifecycle-routing/rollback.md:22), and lists both under Source Files. The router never runs either, so the catalog describes behaviour the advisor does not have, and the maintainability cost is four exported modules kept alive only by a stress test. Iteration 1 carried this to the maintainability pass; confirmed here by grep.
   Finding class: documented-capability-without-production-caller
   Scope proof: the lifecycle modules are in reviewScopeFiles; the catalog lines are context evidence, cited because code contradicts them.
   Affected surface hints: runtime/lib/lifecycle/supersession.ts, rollback.ts, schema-migration.ts; feature-catalog/lifecycle-routing/supersession.md, rollback.md, schema-migration.md; runtime/lib/scorer/projection.ts (the place a live call would go).
   Case: a skill declares itself superseded in graph-metadata.json, and the catalog promises the advisor demotes it, but the live scorer still ranks it normally because no production path calls routeSupersession.

## Recheck of open findings (job 3)

| Finding | Outcome at HEAD | Evidence |
|---|---|---|
| G5-I1-P1-001 scoped scan deletes unseen skills | Still holds | skill-graph-db.ts:745 `DELETE ... NOT IN`, :976 call in tx; scan.ts:44-60 any sub-root, state 'live' |
| G5-I1-P2-001 RRF scale mismatch | Still holds | fusion.ts:1189-1191 score = rrfScore under the flag |
| G5-I1-P2-002 any slash disables tie-break | Still holds | fusion.ts:1254-1255, :1360; also copied at skill_advisor.py:5039 (see new P2-001) |
| G5-I1-P2-003 ambiguous on doctor-inclusive list | Still holds | fusion.ts:1462 `isAmbiguousTopTwo(ranked)` |
| G5-I1-P2-004 stop words count as meaningful | Still holds | fusion.ts:1303-1305; Python copy at skill_advisor.py:5038 |
| G5-I2-P1-001 fixed /tmp socket, no owner check | Still holds | skill-advisor-cli.ts:33, :1097-1100 (mode check only); skill-advisor-cli-fallback.ts:210 |
| G5-I2-P2-001 trust default contradicts comment | Still holds, refined | advisor-server.ts:239-248 and :324-326; launcher :74 still `'trusted'`. The catalog repeats the contradiction: feature-catalog/cli-surface/skill-advisor-cli.md:3 calls the gate "fail-closed" and :24 says the daemon defaults untrusted "unless" the env var is set, which the shipped launcher always sets |
| G5-I2-P2-002 shadow sink path not ignored | Still holds | shadow-sink.ts:50-53 default path, :135-139 append; `git check-ignore` exit 1 |

## Duplication between the TypeScript runtime and the Python fallback (job 2)

| Vocabulary or constant | Python | TypeScript | Pinned? |
|---|---|---|---|
| Confidence and uncertainty thresholds | skill_advisor.py:212-213 read from schemas/compat-contract.json | same contract | Yes, single source file |
| Disabled and force-local env names | skill_advisor.py:210-211 from the contract (literals at :46-47 are overwritten) | same contract | Yes; the :46-47 literals are dead duplicates |
| Deep-routing projection (deep-review, deep-research lexical and aliases) | generated block, hash at skill_advisor.py:341 | lib/scorer/aliases.ts generated block | Yes, tests/routing-registry-drift-guard.vitest.ts:16-17 |
| Native bridge env allowlist | skill_advisor.py:214 | launcher keys | Yes, BRIDGE-PARITY (37 keys, iteration 2 run) |
| Prompt max chars 10_000 | skill_advisor.py:52 | schemas/advisor-tool-schemas.ts:257, manifest literal | Partly: manifest pinned to TOOL_DEFINITIONS by tests/skill-advisor-cli-manifest-parity.vitest.ts:21-31; Python pinned only by a literal 10000 in tests/python/test_skill_advisor.py:1001 |
| Non-deep SKILL_ALIAS_GROUPS entries | skill_advisor.py:309 hand-kept | lib/scorer/aliases.ts | Partly; only the generated deep block is hash-checked |
| STOP_WORDS | skill_advisor.py:1784, 106 words | lib/prompt-policy.ts:55 via data/prompt-policy.default.json (17 words) and lib/derived/extract.ts:40 | Not duplicated: probe shows the sets serve different roles and differ by design (89 Python-only words, 0 TypeScript-only); no parity claim to pin |
| INTENT_BOOSTERS / PHRASE_INTENT_BOOSTERS | skill_advisor.py:1933, :2172 | lib/scorer/lanes/explicit.ts:91 PHRASE_BOOSTS | Behaviour-pinned only through the shared parity corpus, no table-level guard |
| Low-information and slash predicates | skill_advisor.py:5038-5039 | fusion.ts:1254-1255, :1303-1305 | No guard: new P2-001 |

Probe: /private/tmp/dr530-iter3/dup.py (AST read of the Python set against the policy JSON), exit 0.

## Traceability Checks

- spec_code (core): partial. Pass on the descriptor surfaces: the CLI manifest is byte-pinned to TOOL_DEFINITIONS (.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:21-31); skill_graph_status returns every field its description names (.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts:142-150 against .skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts:56) and reads through getDbReadOnly as its comment promises (status.ts:78); skill_graph_validate implements schema-version, broken-edge, weight-band, symmetry and two-node cycle checks as described (.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/validate.ts:69-112, :212-230 against skill-graph-tools.ts:62); propagate_enhances' "Default mode: report (no writes)" holds (.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/propagate-enhances.ts:44, .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:39). Stays partial because two comment-versus-code contradictions remain open: advisor-server.ts:324-326 (G5-I2-P2-001) and the empty-root preservation intent at skill-graph-db.ts:921-922 (G5-I1-P1-001).
- checklist_evidence (core): notApplicable. The target is a skill code tree with no checklist rows.
- feature_catalog_code (overlay): partial. All 123 runtime/ and hooks/ paths named across the 48 catalog files exist (path sweep, no MISSING line). The "9 commands" claim matches the manifest's nine tools (.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:41-164). Two behaviour claims fail: lifecycle supersession and rollback (new P2-002, .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:39) and the "fail-closed" daemon gate (G5-I2-P2-001, .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:248).
- skill_agent (overlay): notApplicable. No agent definition is in reviewScopeFiles, and the operator focus limits the review to runtime/ and hooks/ code; there is no skill-to-agent contract inside the declared target to check.
- agent_cross_runtime (overlay): notApplicable. No agent file or runtime agent mirror is in the declared target; the per-runtime hooks (claude, pi, vibe, dsh) are code, covered under correctness and security, not agent mirrors.
- playbook_capability (overlay): not run this iteration; left out rather than recorded as pending.

## Integration Evidence

- Parity guard: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-31.
- Drift guard: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:16-17.
- Shared contract: .skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json (read at skill_advisor.py:207-213).
- Stress test as sole caller: .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts:17-19.

## Edge Cases

- skill_graph_propagate_enhances with mode=apply and dryRun omitted: the CLI and the handler treat it as a mutation needing trust (skill-advisor-cli.ts:744, propagate-enhances.ts:45), while the library treats an omitted dryRun as true and writes nothing (cross-skill-edges/index.ts:39, :51). The mismatch fails closed (an untrusted no-op is refused), so it is ruled out, not a finding.
- `toMCP` in tools/skill-graph-tools.ts:93-96 drops `isError`, but the skill-graph handlers never set it (errorResponse at response-envelope.ts:42-52 signals through `status:'error'`), so nothing is lost.
- The strategy's TOPIC names HEAD 82af76f6754; the worktree is at 4eda64f6c27. Every recheck line was re-read at the current HEAD, so the outcomes above are current.

## Confirmed-Clean Surfaces

- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts: read-only DB access and the corrupt/absent branches match the comment at :58-63.
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts: test-pinned to the server descriptors.

## Ruled Out

- Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust.
- isError loss in toMCP: the skill-graph handlers never set isError.
- STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree.

## Next Focus

- Dimension: none remaining; all four dimensions are covered (3 of 3 iterations used).
- Focus area: synthesis. Carry G5-I1-P1-001 and G5-I2-P1-001 as the two active P1s, eight P2s.
- Reason: max-iterations stop policy reached.
- Rotation status: correctness, security, traceability, maintainability covered (4/4).
- Blocked/productive carry-forward: do not reopen parity or the cross-skill-edges symlink path; playbook_capability was never run.
- Required evidence: synthesis rechecks the two P1s at file:line before the verdict.

Review verdict: CONDITIONAL
