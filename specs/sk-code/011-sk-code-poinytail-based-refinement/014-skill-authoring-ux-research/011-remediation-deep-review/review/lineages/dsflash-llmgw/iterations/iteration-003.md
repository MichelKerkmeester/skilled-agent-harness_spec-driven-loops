# Review Iteration 003 — Advisor mention scoring + surfaceHint (479186cfed, eeb6285a8e)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` (executor: `cli-pi` model=deepseek-v4.1-flash, detached fan-out lineage `dsflash-llmgw`).
- Focus source: `steer.md` §Iteration focus 3 (lead ruling) — explicit-lane path-token and doc-target rules for false negatives, the Python mirror's coverage, `surfaceHint` validation, the `engines` field, and both vitest files.
- Sources consulted include `steer.md` (unchanged since iteration 1; md5 6378b13f87a1707004b4e2705d9a5da3). Ruling respected: the Python battery ratio itself is out of scope; this iteration reviews mirror coverage, not the battery number.

## Dimension

- Primary: correctness (rule behavior and false-negative reach of the new mention gates).
- Secondary: traceability (TS/Python parity, schema/manifest/engines claims against their sources).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:266-412` (hasPlainMention, targetsOwnDocFile, doc-surface regex, findings removal) and `lib/scorer/executor-delegation.ts:82-86` (negative guard).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4296-4310` (explicit-name boosts), `:2673-2690` (phrase boundary), `:3606-3612` (guard mirror), `:1798-1801` (findings booster removal).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:361-440,543-622`; `tools/advisor-recommend.ts`; `schemas/advisor-tool-schemas.ts:246-252`; `skill-advisor-cli-manifest.ts:55-60`; `package.json:1-12`.
- Front door: `.skilled/bin/compiled-route.cjs:36-46`; engine `014-runtime-engine/lib/compiled-route.cjs` (surfaceHint reorder); test `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:79-84,105-112`.
- Tests: `tests/name-mention-scoring.vitest.ts` (all 115 lines), `tests/advisor-surface-hint.vitest.ts` (all 115 lines); parity fixture `tests/parity/fixtures/local-native-approved-divergences.json`.
- Phase docs `007-advisor-name-mention-scoring/implementation-summary.md`, `008-advisor-surface-hint/implementation-summary.md`; commit diffs of both commits; lockfile engines (`runtime/package-lock.json` root; `system-spec-kit/package-lock.json` rolldown/vite entries).
- Probe (read-only, no writes): reproduction of the Python boundary regex against the path prompt.

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The path-token and doc-target mention rules exist only in the TypeScript lane; the mirrored Python fallback still lifts a skill from a path or a doc-file target** -- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4296-4299` -- the Python explicit-name boost still calls `_matches_phrase_boundary` directly, whose flank class is `[a-z0-9_-]` (`:2677`), so `/` is a boundary and `system-spec-kit` matches inside `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`. Reproduced with the exact pattern: `python3 -c` over the lowercased prompt prints `True`, while the new TS lane returns no `explicit:` evidence for the same prompt (vitest case 1). The phase summary is explicit that only the guard and the findings removal were mirrored ("Same guard and findings removal for parity"), so this is a scoped partial mirror rather than an oversight — but the class of prompts the commit was made to fix still routes from the fallback scorer, and the parity corpus (`labeled-prompts.jsonl`, 195 prompts) contains no `.skilled/` path prompt and no approved-divergence entry covers this class, so the ratchet cannot see it.
Finding class: incomplete mirrored behavior / unrecorded divergence
Scope proof: the divergence is between the reviewed commit's new TS rules and its explicitly partial Python mirror; the battery ratio itself (lead-ruled out) is not the subject.
Affected surface hints: `scripts/skill_advisor.py` (mention boost + boundary helper); `tests/parity/fixtures/local-native-approved-divergences.json`; `scripts/routing-accuracy/labeled-prompts.jsonl`.
Case: `--force-local` (or daemon-down fallback) on "Add a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh" still boosts system-spec-kit; native no longer does.

2. **The declared `engines.node` is wider than the build toolchain it cites as its source** -- `.skilled/skills/system-skill-advisor/runtime/package.json:6-8` -- the phase summary says the field records "the floor its build dependencies need", but those dependencies declare a disjoint range: `rolldown` and `vite` in `system-spec-kit/package-lock.json` use `"node": "^20.19.0 || >=22.12.0"`, which excludes Node 21.x and 22.0–22.11. The written `>=20.19.0` accepts exactly those excluded versions, so an install/build under Node 21 or 22.5 passes the engine gate and then fails in the toolchain. The lockfile root repeats the same value.
Finding class: metadata accuracy / unsupported-version claim
Scope proof: both the manifest field and the lockfile root were changed by eeb6285a8e; the dependency ranges are read from the committed lockfiles.
Affected surface hints: `runtime/package.json` engines; `runtime/package-lock.json` root engines.
Case: `nvm use 22.5 && npm install && npm run build` in `runtime/` — engine check passes, vite/rolldown refuse to run.

## Traceability Checks

| Check | Protocol | Status | Evidence |
|-------|----------|--------|----------|
| surfaceHint schema ↔ manifest ↔ test | `spec_check` | pass | `advisor-tool-schemas.ts` `z.string().min(1).max(64).optional()`; CLI manifest minLength/maxLength 1/64; vitest accepts `WEBFLOW`, rejects `''` and 65 chars. |
| surfaceHint bad values | `checklist_evidence` | pass | Engine reorders only surfaces the prompt already matched; front-door test asserts `['OBSIDIAN','UNKNOWN','not-a-surface','']` change nothing (`compiled-route-surface-hint.test.cjs:79-84`). |
| surfaceHint injection safety | `spec_code` | pass | Handler builds an argv array (`args.push('--surface-hint', surfaceHint)`) and calls `execFileSync` without a shell (`handlers/advisor-recommend.ts:370-382`). |
| Mention rules ↔ tests | `checklist_evidence` | pass | Vitest cases 1-2 assert path and doc-target exclusions with same-skill controls; case 3 keeps the bare name at score 1; case 4 pairs the findings removal with a `token:vitest` control; case 5 pairs the guard with a live positive control. |
| TS ↔ Python mention parity | `spec_code` | fail | Finding I3-P2-001: Python retains the path/doc-target lift; no approved-divergence entry. |
| Engines field ↔ dependency engines | `checklist_evidence` | fail | Finding I3-P2-002: `>=20.19.0` vs `^20.19.0 || >=22.12.0`. |

## Integration Evidence

- `advisor_recommend` surfaces the hint through both callers: the tool schema (`tools/advisor-recommend.ts`) and the CLI manifest (`skill-advisor-cli-manifest.ts`), both reaching `handleAdvisorRecommend` → `enrichCompiledRoutes` → `compiled-route.cjs --surface-hint`.
- The compiled-route front door resolves the engine from the coherent layout and silently degrades to the legacy sentinel on any failure (`compiled-route.cjs:26-52`), so a rejected hint cannot break routing.
- `resolve.cjs:105-106` documents the pass-through contract: "uses it only to reorder surfaces the prompt already matched".
- Advisory fan-out: the lane evidence string prefixes (`explicit:`, `author:`, `token:`, `write-doc-surface`) are the same strings the vitest cases assert, so the tests read the real lane, not a copy.

## Edge Cases

- False-negative trade-offs in the new rules, examined deliberately: a markdown link like `[sk-doc](references/x.md)` no longer counts as a plain mention (the `/` token rule); a hyphen-suffixed compound like `sk-code-extra` still counts in TS (its flank check is `\w`), while Python rejects it — both pre-existing or deliberate shapes, no active finding.
- Doc-target skip removes a skill's author phrases entirely when its own doc file is the target; the doc lanes still push `sk-doc` at 0.7 for `skill.md`/`router.md`/readme/docs prompts, so the route stays populated (vitest case 2 asserts this).
- `hasPlainMention` keeps scanning after a rejected occurrence, so a second plain occurrence still scores (verified by reading the loop; covered indirectly by case 3's control).
- Cache path re-enriches per request (`handlers/advisor-recommend.ts:543-554,612-622`), so a cached recommendation is not pinned to a stale hint.
- `.skilled/skills/sk-code/graph-metadata.json` dropped the `findings` intent signal; the compiled skill graph refresh is phase 009's job (iteration 4), so the advisor graph may lag until then — recorded by the phase itself.

## Ruled Out

- surfaceHint "bad values" handling: unknown or empty values are ignored by design and asserted in the front-door test; the handler forwards verbatim — no finding.
- Executor guard `.skilled/` extension producing false negatives on genuine handoffs: the vitest case includes a positive control (`use cli-opencode for this task` still resolves), and the guard only applies when a project path appears next to the executor name.
- Engines interpretation as "runtime-only floor": considered as counterevidence to I3-P2-002; the phase text itself cites the build dependencies, and the field's practical effect is install/build gating, so the mismatch stands as P2 rather than being dismissed.

## Next Focus

- Dimension: correctness / traceability
- Focus area: freshness and validators (`827e44abc8`, `03e31f902b`) — the CI workflow steps (paths, working directory, exit codes), the freshness panel's failure path, and whether each validator exemption could hide a real failure.
- Reason: `steer.md` §Iteration focus 4.
- Required evidence: `git show` of both commits; `.github/workflows/routing-registry-drift.yml`; `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; `runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`; `sk-create-feature-catalog/scripts/validate_catalog_package.py`; `sk-create-skill/scripts/package_skill.py`; `runtime/scripts/skill-graph.json`; `graph-metadata.json` diffs.

## Verdict

Iteration 3 raises 2 P2 findings; the surfaceHint option is validated, injection-safe and unknown-value-tolerant, and both vitest files carry controls. The Python mirror's partial coverage and the engines range are the open items.

Review verdict: CONDITIONAL
