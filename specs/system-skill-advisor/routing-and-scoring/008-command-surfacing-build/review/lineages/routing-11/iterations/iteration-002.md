# Review Iteration 002

## Dispatcher

- Mode: `review`; target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`; lineage `routing-11`; iteration 2 of 8; status `complete`.
- Review focus: brief 11's routing area; this iteration covers the security relevance of the retained vocabulary and the maintainability of the propagation contract behind the router edit. Holdout rule observed: no prompt corpus opened.
- Dimensions this iteration: `security`, `maintainability`.

## Files Reviewed

- `.skilled/skills/sk-doc/ROUTER.md:126-142` and `:218-220` (narrowed prose and keyword lists)
- `.skilled/skills/sk-doc/graph-metadata.json:340-395` (committed signal bag)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1` (all 14 hub signal bags)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:12-122`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:7-35` (tokenize and stop words)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:60-105`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:6-18`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/scratch/readme-probes.txt:1-11`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/spec.md:60-111`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

4. **The narrowing removes the git and gate words but leaves the same cross-hub token class from the other named hooks** -- `.skilled/skills/sk-doc/ROUTER.md:219` -- The prose at `ROUTER.md:136-137` says the `git-*` and `spec-gate` hooks are not named because their names carry "git", "hooks" and "gate", which belong to git and spec work. After the removal the committed sk-doc signal bag has no `git` and no `gate` token, but `hooks` remains because `codex-global-hooks-check hook readme` is still named (`graph-metadata.json:358-359`), and the other retained names still inject tokens that belong to other hubs: `env` and `secret` (env-secret-guard, `graph-metadata.json:368`), `session` and `handover` (session-handover, `:382`), `decision` and `capture` (decision-capture, `:362`), `dispatch` and `subagent` (subagent-dispatch-guard), `advisor` and `freshness` (skill-advisor, dist-freshness), `overlay`, `completion` and `quality`. The current probe is still correct (`readme-probes.txt:8` shows `git hooks => sk-git`), so this is an incomplete principle and a latent ambiguity, not a present misroute.
   Finding class: class-of-bug
   Scope proof: Tokenized all 345 committed sk-doc signals with the scorer's `tokenize` rule (`text.ts:31-35`) and intersected the 39 tokens carried by the 44 hook phrases with the 13 other hubs' signal bags. Collisions exist for cli-classifier, cli-external-orchestration, sk-code, sk-design, sk-git, sk-prompt, system-skill-advisor, system-skilled-doctor and system-spec-kit.
   Affected surface hints: `.skilled/skills/sk-doc/ROUTER.md` `HOOK_README` list, `.skilled/skills/sk-doc/graph-metadata.json`, `system-spec-kit` and `cli-external-orchestration` vocabularies
   Case: "check the env secret guard hook" shares `env`, `secret`, `guard`, `check` and `hook` with sk-doc, and "check the git hooks" shares `hooks` and `check`; neither is a README request. The lexical lane's weight is 0.28 (`lane-registry.ts:10`), so shared tokens alone do not prove the advisor's 0.8 surfacing threshold is crossed; the finding is the unapplied principle, not a proven route failure.

5. **The generator's carry rule and its `--check` gate share a blind spot for dotted phrases** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:57` -- `declaredPhrases` keeps only phrases that contain a space, so `security.md` and `sync.md` are never candidates for `intent_signals`. `--check` therefore reports `missing=0` even though `SECURITY_POLICY` declares `security.md` as its only keyword (`ROUTER.md:218`) and neither generated artifact contains it. The packet probe shows a `SECURITY.md` request still tops sk-doc (`readme-probes.txt:7`), so reach is not broken; the defect is that the gate cannot verify the contract this change relies on.
   Finding class: matrix/evidence
   Scope proof: Computed the declared vocabularies with and without the `k.includes(' ')` filter: 381 total phrases, 328 multi-word, and `security.md` plus `sync.md` appear only in the excluded set. Ran `--check --hub sk-doc` and read `missing=0`.
   Affected surface hints: `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`, `.skilled/skills/sk-doc/ROUTER.md` `SECURITY_POLICY` and `RUNTIME_FOLDER`, `.skilled/skills/sk-doc/graph-metadata.json`
   Case: a future router edit relies on `security.md` or `sync.md` as its only phrase; `--check` passes and the advisor vocabulary silently lacks the intent, so only a live probe catches it.

## Traceability Checks

- `spec_code` -- status `pass`. The narrowed vocabulary matches the phase's scope; the generator blind spot in finding 5 is a contract gap in a named integration surface, not a divergence in the changed files.
- `checklist_evidence` -- status `notApplicable`, `applicable: false`. Same reason as iteration 1: this review has no packet checklist of its own.
- `skill_agent` -- status `pass`. No agent definition is touched, and the probe file still routes the three README families to sk-doc.
- `agent_cross_runtime` -- status `notApplicable`, `applicable: false`.
- `feature_catalog_code` -- status `partial`. The two-stage contract holds for every multi-word phrase, but finding 5 names the dotted-phrase case the gate cannot see.
- `playbook_capability` -- status `pass`. The committed probes cover the security-adjacent prompts and the bare git, rules, standards and runtime-mirror prompts; no playbook scenario was executed, so the status rests on the packet's recorded probes plus the local reproduction.

## Integration Evidence

- Token intersection from the committed graph: 44 hook phrases carry 39 tokens; the tokens that also appear in another hub's bag include `env`, `secret` (system-spec-kit), `session`, `handover` (system-spec-kit), `dispatch`, `subagent` (cli-external-orchestration), `advisor`, `freshness` (system-skill-advisor), `decision`, `capture` (system-spec-kit, sk-code, sk-design), `completion`, `quality` (sk-code) and `hooks` (system-skill-advisor, sk-git).
- `generate-router-intent-signals.cjs --check --hub sk-doc` -> `declared=328 signals=345 missing=0 orphans=0`, `RESULT: PASSED`. The 328 count is exactly the phrases that contain a space; `security.md` and `sync.md` are outside it.
- The packet probe records `create a SECURITY.md for this repo => sk-doc, system-spec-kit` and `git hooks => sk-git`, so both the security reach and the bare-git exclusion are currently correct.
- Lexical lane weight `0.28` from `lane-registry.ts:10`; token overlap is one lane, not the whole confidence, so no finding here claims a route failure from token overlap alone.

## Edge Cases

- A retained named hook phrase can be the only reason a foreign token enters the sk-doc bag, yet the owning hub still wins on exact-phrase evidence. The finding is recorded as a latent ambiguity, not as a present wrong route, because no probe shows a misroute.
- `hooks` is the one word the prose names that survives the removal. `codex-global-hooks-check` is a named shared hook and was not part of the phase's removal set, so the prose's reason is only two-thirds true; a reader cannot tell that from the sentence.
- The generator's docstring says "Single words are left behind deliberately" (`generate-router-intent-signals.cjs:27-28`); a dotted filename is not a single word in the matching sense, so the filter's effect on `security.md` is broader than the stated rationale.
- The `security policy` phrase removal is security-positive: a generic security-policy request no longer shares the `security` token with sk-doc. The probe line 7 confirms the retained `SECURITY.md` path still reaches the hub.

## Confirmed-Clean Surfaces

- No `git` or `gate` token remains in the committed sk-doc signal bag; the three words the prose names are reduced to `hooks` only.
- Bare `git hooks`, `git rules`, `git standards` still reach sk-git (probe lines 8-10), and `runtime mirror drift` still reaches `command-doctor-runtime-mirrors` (line 11).
- `SECURITY_POLICY` still reaches sk-doc for a `SECURITY.md` request (probe line 7) despite its phrase being absent from the generated signals.
- The retained plugin, runtime-folder and named-hook phrases still select their specific leaves under the documented stage-two scorer.

## Ruled Out

- A present misroute from the residual tokens: no probe or scorer result shows sk-doc beating the owning hub for a bare env, session, decision or dispatch prompt; the lexical lane alone carries 0.28 (iteration 2).
- A broken security reach after dropping `security policy`: probe line 7 tops sk-doc; ruled out in iteration 1 and rechecked here (iteration 2).
- A carried dotted phrase in either generated artifact: `grep` over `graph-metadata.json` and `skill-graph.json` returns no `security.md` or `sync.md`; recorded as finding 5, not as parity failure (iteration 2).

## Next Focus

- Dimension: all four, cross-reference and verification.
- Focus area: close the loop on the six traceability protocols, recheck the three P2 surfaces against the final registry, and decide whether the two maintainability advisories change the release verdict.
- Reason: correctness and traceability are covered from iteration 1, security and maintainability from this iteration; the remaining work is protocol closure and consistency of the final artifacts.
- Rotation status: cross-reference pass, no new dimension.
- Productive carry-forward: exact signal-set parity, the packet probe, and the documented stage-two scorer.
- Required evidence: registry counts, final state log records, and the same three integration checks.
- Recovery note: none.

Review verdict: PASS
