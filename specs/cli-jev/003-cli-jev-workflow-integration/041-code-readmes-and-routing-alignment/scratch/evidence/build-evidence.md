# Build evidence: code READMEs and routing alignment

Start HEAD `d2e2a333cd` on worktree 071. Every writer was DeepSeek V4.1 Flash on cli-pi (Cline `xhigh`). No fallback to OpenCode Go was needed. The session ran every check below and wrote no skill doc.

## Briefs

| Brief | Files | Result |
|---|---|---|
| r01 to r11 | the eleven code-folder `README.md` files | DONE, 79 to 397 s each |
| s1 | this phase's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, plus 040 `spec.md` Successor | DONE |
| b1 | hub `ROUTER.md` promoted to `router_state: active` | DONE |
| b-jev, b-deem | `cli-jev/SKILL.md` and `cli-deem/SKILL.md` section 2 reshaped to the template | DONE |
| b4 | `hub-router.json` class rename plus 13 stage-one phrases, the playbook class name, hub `SKILL.md` stale bullet removed and Surface Router subsection added | DONE |
| f1 | baseline loads first in both mode routers (`DEFAULT_RESOURCES`), and each hub intent lists its mode baseline first | DONE |
| v1 | versions hub 0.6.0.0, cli-jev 0.1.4.0, cli-deem 0.1.1.0, three changelogs | DONE |
| f2 | stage-two keywords rewritten so every phrase names its backend (reach check) | DONE |
| f3 | packet-name keywords (`cli-jev`, `cli-usage`, `cli-deem`) and gold `expected_leaf_resources` in four hub-routing scenarios | DONE |

## Deviations from the plan, with the reason

1. **Baseline loading (f1).** The first reshape gave each mode an ALWAYS row for its baseline while its pseudocode loaded the baseline only on the judgment intent, and the hub map loaded it only there too. The template loads the default first on every route, so all three routers now load the mode baseline first.
2. **Stage-two keywords (f2).** Promoting `ROUTER.md` brought its phrases under `ci-router-vocabulary-reach.cjs`. The intent-map phrases failed it: `cli-classifier` declared 41, wrong-hub 2 (`mcp host` to sk-code, `which commit` to sk-git), outranked 1, no-reach 16. Each candidate was probed through `skill-advisor.cjs advisor_recommend` (`reach-candidates-1.txt`). `deem commit`, `deem model commit`, `deem serving commit`, `deem commit pair` and `deem source commit` reach sk-git, and `roll deem back` reaches nothing, so they are not used. Final set: every phrase names Jev or Deem.
3. **Gold leaves (f3).** With the router active, the leaf-route replay found 0 gold rows for the hub, because all five scenarios declared `expected_leaf_resources: []`. Four now name the leaves their prompt should load. The alias scenario's prompt names only `cli-usage`, so the packet names joined the judgment intents.

## Checks from the final state

| Check | Result |
|---|---|
| `validate_document.py` on the 22 changed skill docs | 22 VALID, 0 invalid |
| The eleven READMEs' documented test commands | all exit 0: node --test 34, 40 and 22 tests plus the two benchmark suites, both Python suites ALL PASS, vitest 24, 23 and 31 |
| `parent-skill-check.cjs .skilled/skills/cli-classifier` | `OK: parent-skill-check — all hard invariants passed, 0 warnings` (12a, 13a, 13b PASS) |
| `validate_skill_package.py` hub, cli-jev, cli-deem | PASS, PASS, PASS |
| `compiled-route-guard.cjs` | exit 0, all hubs fresh, after `compiled-route-manifest.cjs refresh --hub cli-classifier` on both roots |
| `compiled-route-sync.cjs --check` / `compiled-route-admission.cjs --all` | all 7 hubs resolve / every hub passes |
| `ci-leaf-manifest-freshness.cjs` / `ci-skill-derived-freshness.cjs` / `ci-skill-root-metadata.cjs` | 15 of 15 each |
| `ci-router-vocabulary-reach.cjs` (fleet) | RESULT: PASSED, cli-classifier declared 49 with 0 failing |
| `sync-skills-hermes.cjs --check` | PASS: 72 Hermes skill copies in sync, after regenerating 3 |
| Ten-prompt compiled-route probe | 8 rows identical to `probe-before.txt`; `which provider and model id does jev use` and `roll deem back to the previous commit` moved from defer to cli-jev and cli-deem (`probe-after.txt`) |
| `leaf-route-replay.cjs` | `hub=cli-classifier gold=4 f1=1.000 exact=4`; fleet mean F1 0.9209 to 0.9262 |
| Router parity (session script) | hub INTENT_SIGNALS equal to both mode INTENT_MODELs key for key and phrase for phrase; every RESOURCE_MAP path is a leaf-manifest leaf; executing both mode pseudocode blocks loads the hub map's leaves on all nine sample prompts |
| Moved text (session script) | cli-jev Transport Guard and Transport Selection byte-identical after the move; all other sections of both mode files byte-identical to HEAD |
| `validate-compiled-routing-scenarios.cjs --strict` on hub-routing | fail 5 of 5 on evidence fields, the same at HEAD and on the canon-clean `cli-external-orchestration` hub, so pre-existing and fleet-wide |

## Review

Round 1, SWE 2 max on cli-devin, read-only, 652 s: `VERDICT: FAIL` with five P1s and five P2s. It confirmed the green checks above, all ten probes, the gold leaves, the 8 leaf paths, keyword parity and the moved-text claim.

| Finding | Disposition |
|---|---|
| P1 hub `SKILL.md` layout tree and companion line still said `stage1-only` | Fixed by brief f4 |
| P1 `cli-jev/SKILL.md` section 7 said the hub router is `stage1-only` and empty | Fixed by brief f4 |
| P1 hub `README.md` and the playbook index kept "runs over the packet folder `cli-jev`" | Fixed by brief f4; README line 72 also called the router `stage1-only`, fixed by brief f5 |
| P1 `cli-deem/SKILL.md` section 6 called `cli-deem` the hub's only transport (stale since the hub gained `cli-jev`) | Fixed by brief f4 |
| P1 the phase `scratch/` folder was empty | Timing: this evidence and the probe recordings were written while the review ran. They sit in `scratch/evidence/` |
| P2 hub changelog link pointed to v0.4.0.0 | Fixed by brief f4, now v0.6.0.0 |
| P2 `ROUTER.md` path parenthetical omitted `cli-jev/assets/...` | Fixed by brief f4 |
| P2 `ROUTER.md` section 2 used a table where the root-router template line 52 asks for one bullet per intent | Fixed by brief f4: seven bullets, each naming its firing phrases and leaves; a session script confirms each bullet's leaves equal its `RESOURCE_MAP` entry |
| P2 `description.json` `lastUpdated` predated the bump | Fixed by brief f5 |
| P2 `spec.md` Files to Change listed one hub-routing scenario where four changed | Recorded for the closure pass |

After the fixes the session re-ran every check in the table above from the final state: all pass, 24 changed skill docs VALID, the probe still differs from baseline only on the two intended rows, replay `hub=cli-classifier gold=4 f1=1.000`.

## Open

- A read-only Luna 6 max audit was tried twice. Try 1 hit a codex host timeout before reading any file. Try 2 hit the 2,400 s alarm with no output. Cross-family review goes to SWE 2 max instead.
- Out of scope and untouched: `.skilled/hooks/dispatch/lib`, `.skilled/hooks/goal/bin`, `.skilled/hooks/goal/lib`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib`, which predate this packet and also lack a README.

## Review round 2

SWE 2 max, read-only, 155 s: all ten round-1 items `FIXED` at their current lines, and `VERDICT: PASS`. One new P2: the hub `README.md` changelog table stopped at v0.5.0.0 and said "The two `v0.x` entries" over five rows. Fixed by brief f6: a v0.6.0.0 row, and the sentence now names `v0.1.0.0` and `v0.2.0.0`, which the changelog descriptions show are the pre-merge Jev hub releases. `validate_document.py` VALID after the fix.

## Negative check: a router path that is not a leaf

The session copied the hub to its scratchpad, linked `sk-doc` beside the copy so the checker finds its libraries, and added `cli-deem/references/not-a-leaf.md` to the copy's `DEEM_LIFECYCLE` map. `parent-skill-check.cjs` on the copy exited 1 with `FAIL: 12a-router-contract: RRC-006 — resource path "cli-deem/references/not-a-leaf.md" (intent DEEM_LIFECYCLE) does not resolve on disk` (`negative-leaf-check.txt`). The same check on the real hub prints `PASS: 12a-router-contract` and `OK: parent-skill-check`. The copy was deleted after the run.

## Landing prep: merging main (2026-10-01)

Main had moved 13 commits ahead with another session's runtime-alignment work. `git merge --no-ff main` into the worktree branch (`eeefe0c074`) conflicted on seven files: four generated index files and the three READMEs both sides had added in `system-spec-kit/runtime/scripts/{compaction-recall,completion-claim-audit,debug-next-check}/`. All seven take main's version: the READMEs are the runtime owner's, VALID, and document the moved test layout, and the index was then rebuilt from the merged tree. So this phase's own READMEs land in eight folders, and main's owner versions cover the other three.

From the merged tree: guard, sync, admission, `parent-skill-check` (0 warnings), the three freshness checks and every README test command pass. Two findings:
1. Main moved `runtime/lib/hooks/completion-evidence-sentinel.cjs` to `runtime/hooks/lib/`, but `score-completion-claims.mjs:41` and its catalog row kept the old path, so `completion-claim-audit.vitest.ts` failed on main itself (`Cannot find module`). A DeepSeek brief repointed both, and the suite passes 23 of 23. A static check of every relative import in the packet's 186 named files then found none unresolved.
2. `sync-skills-hermes.cjs --check` reports 8 drifted copies (sk-code, sk-code-obsidian, sk-code-opencode, sk-doc, sk-create-readme, system-deep-loop, system-skill-advisor, system-spec-kit). Main's checkout at `d7c90f663c` reports the same 8 with no change from this branch, so the drift comes from main's runtime-alignment work and is left to its owner.

In this worktree `npm test` in the system-spec-kit runtime cannot find `runtime/node_modules/.bin/vitest`. `npx vitest run` passes the same three suites (24, 23, 31).
