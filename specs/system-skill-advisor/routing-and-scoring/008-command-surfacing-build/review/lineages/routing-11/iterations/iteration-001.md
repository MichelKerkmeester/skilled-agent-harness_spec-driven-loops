# Review Iteration 001

## Dispatcher

- Mode: `review`; target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`; lineage `routing-11`; iteration 1 of 8; status `complete`.
- Review focus: read `review/review-brief-11.txt` first, took area `routing` from `review/review-scope-11.txt`, diffed each listed path with the scope file's command between `6d50afe6f39` and `2f3f893c153`, then read the whole file at `2f3f893c153`. The holdout rule was observed: no prompt corpus was opened.
- Dimensions this iteration: `correctness`, `traceability`.

## Files Reviewed

- `.skilled/skills/sk-doc/ROUTER.md:1-591` (diff and whole file)
- `.skilled/skills/sk-doc/graph-metadata.json:340-395` and `:870-925` (both signal lists; whole-file key and count checks)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1` (single-line compiled graph; `.signals["sk-doc"]` and all 14 skill entries)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:51-122`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:160-250`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:31-150`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:60-105`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:1-20`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/spec.md:1-140`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/acceptance-criteria.md:40-64`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/tasks.md:40-62`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/implementation-summary.md:45-70`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/scratch/readme-probes.txt:1-11`
- `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md:18-50` (context for the phase's files-to-change row)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The accepted probe proves hub reach only, while two dropped phrase families now load the generic README leaves** -- `.skilled/skills/sk-doc/ROUTER.md:136` -- The phase evidence at `039-main-sk-doc-routing-repair/scratch/readme-probes.txt:3` records `write a README for the git-preflight hook => sk-doc, sk-git`, which proves the advisor still tops sk-doc. Stage two then scores only `README_CREATION=12` for that prompt, so the kept intents are just `README_CREATION` and the loaded leaves are `sk-create-readme/references/README.md` and `readme-template.md`, not `hook-readme-template.md`. The same happens for `write a hook mirror readme`: after the `RUNTIME_PLUGIN_README` phrase was dropped, it scores `README_CREATION=4` only and does not load `runtime-plugin-readme-template.md`. `AC-003` at `acceptance-criteria.md:56` asserts `top=sk-doc`, so the acceptance criterion is met at the hub level, but the phase purpose at `spec.md:61` ("README requests keep reaching their templates") is not shown for these two families.
   Finding class: matrix/evidence
   Scope proof: Scored every generic and named hook phrase declared in `INTENT_SIGNALS` with the rule in `leaf-route-replay.cjs:214-250` (intent weight per hit, intents within one point of the top). The retained names (`codex-global-hooks-check`, `session-handover`, `plugins folder`, `runtime folder`) still select `HOOK_README`, `RUNTIME_PLUGIN_README` and `RUNTIME_FOLDER`; only the dropped families fall through.
   Affected surface hints: `.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`, `.skilled/skills/sk-doc/sk-create-readme/assets/runtime-plugin-readme-template.md`, `.skilled/skills/sk-doc/ROUTER.md` `README_CREATION` keyword list
   Case: a user asks "write a README for the git-preflight hook" or "write a hook mirror readme"; the request reaches sk-doc, but the authored README starts from the generic readme template instead of the hook or runtime-plugin template.

2. **The named skill-advisor hook phrase ties the skill README and hook README intents** -- `.skilled/skills/sk-doc/ROUTER.md:219` -- The retained phrase `readme for the skill-advisor hook` contains the `SKILL_README` keyword `readme for the skill` (`ROUTER.md:215`), so the documented scorer gives `SKILL_README=16` and `HOOK_README=16`. Both are within one point of the top and both leaf sets load: `skill-readme-template.md` beside `hook-readme-template.md`.
   Finding class: instance-only
   Scope proof: Ran the same scoring over all 20 `readme for the ... hook` phrases. Only `skill-advisor` produces a second top-score intent; the other named hooks load only `HOOK_README`.
   Affected surface hints: `.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md`, `.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`
   Case: a user asks "write a README for the skill-advisor hook"; two templates load and the skill template is not the artifact the request names.

3. **The 039 spec still lists `sk-create-readme/ROUTER.md` as a file to change, but the delivered work deliberately left it untouched** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/spec.md:105` -- The Files to Change table says `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md` gets "The same where the mode router repeats them", but `tasks.md:46` records "sk-create-readme/ROUTER.md carries no advisor intent, left as is", and `implementation-summary.md:57-63` omits the file. The packet router still declares the `security policy` and `sync.md` keywords at `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md:109`, so the table and the tree disagree about what the phase changed.
   Finding class: matrix/evidence
   Scope proof: Compared the spec table, the task evidence and the implementation-summary table; `git diff --name-only 2d36805ea61^ 2d36805ea61` confirms the packet router is not in the commit. The hub router gates advisor entry, so no runtime caller reaches this packet through the dropped phrase.
   Affected surface hints: `039-main-sk-doc-routing-repair/spec.md`, `039-main-sk-doc-routing-repair/tasks.md`, `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md`
   Case: a maintainer follows the phase's Files to Change table and edits the packet router, or a later review reads the table as the delivered scope; the table names a change the phase explicitly declined to make.

## Traceability Checks

- `spec_code` -- status `pass`. The three changed files match the phase scope and the phase's own rules: `ROUTER.md:218` keeps only `security.md` for `SECURITY_POLICY`, `ROUTER.md:219` drops the 12 `git-*` and 2 `spec-gate` phrases, `ROUTER.md:220` drops `hook mirror readme`, and the prose at `ROUTER.md:126-142` says why. The remaining mismatch is the Files to Change row recorded as finding 3.
- `checklist_evidence` -- status `notApplicable`, `applicable: false`. The review target is a review pass over another phase's files, not a packet with its own checklist to certify; the phase's `acceptance-criteria.md:56-58` was read as evidence instead.
- `skill_agent` -- status `pass`. The change stays inside the sk-doc skill and its advisor projection; no agent definition or runtime mirror is part of the diff.
- `agent_cross_runtime` -- status `notApplicable`, `applicable: false`. No agent file is touched.
- `feature_catalog_code` -- status `pass`. The routing feature's two-stage contract is intact: `generate-router-intent-signals.cjs:51-97` carries the router vocabulary into `graph-metadata.json`, and `skill-graph.json` carries the same signals for the advisor. `generate-router-intent-signals.cjs --check --hub sk-doc` prints `declared=328 signals=345 missing=0 orphans=0` and `RESULT: PASSED`.
- `playbook_capability` -- status `partial`. The packet's committed probe file was read and matches the change, but no routing playbook scenario was executed this iteration; the stage-two scores are a local reproduction of the documented rule, not a playbook run.

## Integration Evidence

- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-doc` -> `OK sk-doc declared=328 signals=345 missing=0 orphans=0`, `RESULT: PASSED`, exit 0.
- `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` -> exit 0; `STALE COMPILED: none`, `GHOST (in compiled json, not on disk): none`, `MISSING (in compiled json): none`, `FAMILY MISMATCH compiled vs disk: none`, `SIGNAL DRIFT compiled vs disk: none`.
- Exact array equality between `.skilled/skills/sk-doc/graph-metadata.json` `.intent_signals` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` `.signals["sk-doc"]`; the same equality holds for all 14 hubs in the compiled graph.
- No dropped phrase survives in either generated artifact: `git-preflight`, `git-hooks-check`, `git-live-follow`, `git-message-gate`, `git-primary-reconcile`, `git-worktree-guard`, `spec-gate`, `hook mirror readme` and `security policy` each return no match in `graph-metadata.json` and `skill-graph.json`.
- The advisor probes at `039-main-sk-doc-routing-repair/scratch/readme-probes.txt:2-11` show sk-doc topping the session-handover, git-preflight and spec-gate hook README requests, the runtime and plugins folder requests and `create a SECURITY.md for this repo`, while `git hooks`, `git rules`, `git standards` reach sk-git and `runtime mirror drift` reaches `command-doctor-runtime-mirrors`.
- Stage-two scores reproduced from `leaf-route-replay.cjs:160-250`: `write a readme for the plugins folder` -> `RUNTIME_PLUGIN_README=16`; `write a readme for the runtime folder` -> `RUNTIME_FOLDER=16`; `write the sync.md for the runtime folder` -> `RUNTIME_FOLDER=16`; `write a readme for the codex-global-hooks-check hook` -> `HOOK_README=16`; `git status`, `git rebase my branch`, `mirror the runtime folder`, `gate the spec before merge` and `run the spec gate` -> no sk-doc intent.

## Edge Cases

- A README request for the dropped git-* and spec-gate hooks still tops sk-doc (probe line 3) but its stage-two leaf set is `README_CREATION`; recorded as finding 1, not as a hub-reach failure.
- `write a readme for SECURITY.md` scores `README_CREATION=12` and `SECURITY_POLICY=4`, so only `README_CREATION` is within one point and the security template does not load with the README template. A bare `write a SECURITY.md for this repository` scores `SECURITY_POLICY=4` alone and does load it; the advisor probe at line 7 shows that request still tops sk-doc even though `security.md` is absent from `graph-metadata.json`, so the missing phrase is not a reach failure.
- `document for clarity` is a declared multi-word phrase in `intent_signals` but absent from `intent_signals_generated`; it predates the generated list and `--check` reports no orphan, so it is hand-curated, not stale provenance.
- `graph-metadata.json` `derived.last_updated_at` still reads `2026-09-26` while the signal list changed. The freshness panel compares the compiled `generated_at` against source stamps, not this field, and it reports no drift; not raised as a finding.
- The `sk-create-readme` packet router was read only as context for finding 3; its own keyword list was not scored because the hub router gates entry.

## Confirmed-Clean Surfaces

- `.skilled/skills/sk-doc/ROUTER.md:218-220`: the three narrowed intents and no dropped phrase.
- `.skilled/skills/sk-doc/graph-metadata.json`: no orphaned generated phrase; both signal lists end at the same declared vocabulary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`: all 14 hub signal arrays equal their on-disk `graph-metadata.json` source, and the strict freshness panel agrees.
- Bare git, mirror and gate prompts: no sk-doc intent under the documented scorer.
- Retained named hooks, plugins folder, runtime folder and `sync.md`: still select their specific leaves.

## Ruled Out

- Stale compiled graph or signal drift: `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none` (iteration 1).
- Orphaned generated phrases after the 16-phrase removal: `generate-router-intent-signals.cjs --check` reports `orphans=0` (iteration 1).
- A broken SECURITY.md reach path: the packet probe shows `create a SECURITY.md for this repo => sk-doc` despite `security.md` being absent from the generated signals (iteration 1).
- A missing router changelog entry: `ROUTER.md` versions are file-local (`2.4.13.0`) while `sk-doc/changelog/` is skill-level (`v2.10.0.0`), so no changelog row is required for a router-only version bump (iteration 1).

## Next Focus

- Dimension: `security`, `maintainability`.
- Focus area: the token footprint the retained named hook phrases still seed into the advisor's lexical lane, and whether the prose's stated reason for the git-* removal holds for the words it names.
- Reason: iteration 1 covered correctness and traceability; the retained `env-secret-guard`, `subagent-dispatch-guard`, `decision-capture` and `session-handover` names still carry other hubs' vocabulary, which is the mechanism the change cites for the phrases it removed.
- Rotation status: first pass for both dimensions.
- Productive carry-forward: exact phrase-set diff plus the documented stage-two scorer; a token-level reproduction of the lexical lane.
- Required evidence: tokenize the committed sk-doc signal bag with the scorer's rule, quote the lexical lane weight, and name a concrete prompt per collision.
- Recovery note: none.

Review verdict: PASS
