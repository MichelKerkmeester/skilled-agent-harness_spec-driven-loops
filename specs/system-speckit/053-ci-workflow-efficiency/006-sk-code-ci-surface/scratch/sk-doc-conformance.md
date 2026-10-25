# sk-doc conformance and routing pass for the sk-code hub, the CI surface and /doctor:ci

Date: 2026-10-25. Worktree branch `worktrees/218-ci-efficiency-build`. Nothing is staged or committed.
Raw validator output lives in the orchestrator scratchpad (`w1` to `w7`, `base`, `final`) and is not part of the tree.

## 1. Scope checked

Each path was confirmed in scope with `git log --oneline --since=2026-10-22`.

| Target | Recent commits |
|---|---|
| `.skilled/skills/sk-code/sk-code-ci/` | 028bd0f5cd, cc8d00a4ce |
| `.skilled/skills/sk-code/` hub | e3beac65f4, 028bd0f5cd, cc8d00a4ce |
| `.skilled/skills/system-skill-advisor/` (routing only) | 1218b94938, e00fef3e76, c903c0d103, e0f922b593 |
| `.skilled/commands/doctor/ci.md` | 10c6791341 |
| `local-webflow`, `local-obsidian` | audit only, outside the tracked tree |

Owner contracts read: `sk-doc/SKILL.md` and `ROUTER.md`, `sk-create-skill` with `parent-skills-nested-packets.md`, `sk-create-readme`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`, `sk-create-changelog`, `sk-create-command` and `sk-create-frontmatter/references/frontmatter-versioning.md`.

## 2. Version rule applied to the CI surface

Before: `sk-code-ci/SKILL.md` and `changelog/v0.1.0.0.md` said 0.1.0.0 and `README.md` said 1.0.0.0.

Rule applied: a `SKILL.md` carries the skill edition and equals its newest changelog entry (`frontmatter-versioning.md` section 3). A README carries its own edition, starting at 1.0.0.0 (section 4). A first changelog entry is `v1.0.0.0` (`sk-create-changelog/SKILL.md` line 145, `version-bump-rules.md` section 5). The parent-skill hub template also starts packets at 1.0.0.0, and so did every sibling sk-code packet.

Result: the changelog file was renamed to `v1.0.0.0.md` with its title, phrases, H1 and version updated, and `SKILL.md` moved to 1.0.0.0. The README kept its own edition and then rose to 1.0.1.0 because its body changed. Check 13d passed before the change and passes after it.

The phase docs of this spec folder (`spec.md` line 123 and REQ-001, `acceptance-criteria.md` AC-001, `tasks.md`) still name `changelog/v0.1.0.0.md`. They were left untouched and are listed as an operator item.

## 3. Per target: standards, validators, fixes

### 3.1 sk-code-ci surface packet

| Standard | Validator | Before | After |
|---|---|---|---|
| Document shape | `validate_document.py` on 9 docs with their `--type` | exit 0 | exit 0 |
| Skill package | `validate_skill_package.py <packet> --strict` | exit 0 | exit 0, PASS |
| Packaging | `package_skill.py --check --strict` | exit 0, description 158 chars over the 130 soft target | same warning |
| Playbook | `validate-playbook-package.cjs --package .../sk-code-ci/manual-testing-playbook` | exit 0, 1 warning | exit 0, 0 warnings |
| README references | `check_readme_references.py` | exit 1 on line 35 | exit 0, unresolved=0 |
| Versioning | `frontmatter-version.mjs gate --skill sk-code` | exit 0, 181 files ok=177 | exit 0, same |
| Hub gate | `parent-skill-check.cjs .skilled/skills/sk-code` | exit 0, 13d PASS | exit 0, 13d PASS |

Fixes:
- `SKILL.md`: version 0.1.0.0 to 1.0.0.0.
- `changelog/v0.1.0.0.md` renamed to `v1.0.0.0.md`, version strings updated, template spacer lines added.
- `README.md`: frontmatter quoted so it parses as YAML, related documents section added, full workflow path on line 35, version 1.0.1.0.
- `references/ci-workflow-standards.md`: stale workflow counts and line citations corrected, version 1.0.1.0.
- `references/trigger-and-filter-rules.md`: one stale citation corrected, version 1.0.1.0.
- `manual-testing-playbook/manual-testing-playbook.md`: result persistence marker and automated test cross-reference added, version 1.0.1.0.

Remaining:
- The 158 character description is a soft warning, left because it is routing wording.
- The root playbook lacks the review protocol and orchestration sections. All three sibling packet playbooks share that reduced shape.
- No validator covers the two YAML templates.

### 3.2 sk-code hub root

| Standard | Validator | Before | After |
|---|---|---|---|
| Document shape | `validate_document.py` on SKILL, README, ROUTER, shared and benchmark READMEs, catalog, playbook, all changelogs | exit 0 | exit 0, ROUTER keeps one numbering warning |
| Feature catalog | `validate_catalog_package.py --package sk-code --strict` | exit 0 | exit 0, 0 violations |
| Playbook | `validate-playbook-package.cjs` and `validate-playbook-topology.cjs` | exit 0 | exit 0, 18 scenarios, 0 violations |
| Skill package | `validate_skill_package.py .skilled/skills/sk-code` | exit 0 | exit 0 |
| Hub invariants | `parent-skill-check.cjs .skilled/skills/sk-code` | exit 0, 49 PASS, 0 warnings | exit 0, all hard invariants passed, 0 warnings |
| Doctor setup | `sk-code-setup-check.cjs` | STATUS=OK legs=8 | STATUS=OK legs=8 |
| README references | `check_readme_references.py`, `check_derived_readme_counts.py` | exit 1 | exit 1, same hits, heuristic and pre-existing |

Fixes:
- `README.md`: stale frontend sentence replaced by CI work, packet pointer column, wrong example counts corrected, version 2.2.19.0.
- `ROUTER.md`: removed the Animation, Motion.dev, Forms and Video prose rows and Motion.dev sentences, added a CI row mirroring the machine block, version 2.2.16.0.
- `shared/references/stack-detection.md`: Motion.dev paragraph removed, version 2.2.3.0.
- `manual-testing-playbook/manual-testing-playbook.md`: precondition lists `sk-code-ci/`, version 1.5.6.0.
- `.skilled/changelog/sk-code/`: removed the dangling `code-obsidian` and `code-webflow` links and added `code-ci`. `sk-create-changelog/SKILL.md` Global Component Discovery item 4 requires one link per member packet plus `parent`. No tool writes these links, so the change was made by hand.

Hub version authority holds: `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` all read 2.4.0.0, the newest changelog entry. No hub release was added.

Remaining:
- `ROUTER.md` jumps from section 3 to section 6. Renumbering fails the drift guard because `sk-code-skilled/assets/scripts/verify-router-sync.cjs:130` hardcodes `## 7. VERIFICATION COMMANDS`.
- The PERFORMANCE intent still routes web vitals words to `shared/references/performance-loading-checklist.md`, which is web content. Dropping the intent orphans that file under drift guard leg 1b, so deleting the file is an operator decision.
- The hub playbook has no CI scenario. No standard requires one scenario per surface.
- `sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` lines 171 and 284 still name `code-webflow` (outside scope).

### 3.3 /doctor:ci command

| Rule | Before | After |
|---|---|---|
| Description at most 110 chars | FAIL, 136 | PASS, 104 |
| Flags enumerated under execution targets | FAIL | PASS, argument table |
| Every visible output owned by the presentation file | FAIL, two messages missing | PASS |
| YAML setup names match `_routes.yaml` | FAIL (`json`, `no_gh`, `name`) | PASS (`json_output`, `use_gh`, `workflow_name`) |
| argument-hint, allowed-tools, router core sections, confirm before change | PASS | PASS |

| Validator | Before | After |
|---|---|---|
| `validate_document.py --type command` | exit 0, 1 warning | exit 0, 0 issues |
| `generate-command-routers.cjs --check` | exit 0, 34 routers, ci skipped | exit 0, 35 routers clean |
| `pi/sync-prompts-pi.cjs --check` | exit 1, missing `.pi/prompts/doctor-ci.md` | exit 0, 39 in sync |
| `validate-command-tree-parity.sh` | exit 0 | exit 0, 196 mirrors in sync |
| `command-catalog-mirror-check.cjs` | STATUS=OK | STATUS=OK |

Fixes: `ci.md` description and argument table, the four `doctor-ci-*` assets, `.pi/prompts/doctor-ci.md` written by its sync script, `command-contract.json` doctor family covers ci, `commands/README.txt` line 170 carries the new description.

Remaining: `ci.md` lines 32 and 38 keep two older semicolons. The generated Pi mirror header carries an em dash from the sync script template. The contract's doctor family lists no ci destructive operations or loader requirements.

### 3.4 system-skill-advisor routing

Fixes:
- `doctor/_routes.yaml`: narrow phrases for the ci report, scaffold and toggle routes.
- `command-bridges/derive-command-bridges.cjs`: emits `readOnly: true` for a doctor route marked `mutating: read-only`.
- `lib/scorer/fusion.ts`: a read-only command bridge whose phrase matches passes the read-only question gate. Mutating bridges stay gated.
- `lib/scorer/lanes/explicit.ts` and `lanes/lexical.ts`: sk-code web, frontend and motion tokens removed, except those still backing gold cases. The review loop pattern now needs the loop verb to govern review.
- Regenerated by the deriver: `command-bridges.generated.json`, the generated blocks in `projection.ts` and `skill_advisor.py`.
- Regenerated by `skill_graph_compiler.py --export-json`: `skill-graph.json`.
- Tests: `tests/doctor-command-bridges.vitest.ts` (one added case), new `tests/scorer/route-gates.vitest.ts` and `tests/scorer/sk-code-web-vocabulary.vitest.ts`.

| Gate | Start of pass | Final |
|---|---|---|
| `advisor_validate` corpus | 157/195 at HEAD, 156/195 mid-pass | 157/195 |
| holdout | 30/40 | 30/40 |
| regression suite | 84/84 | 84/84 |
| runtime vitest | 2 failures mid-pass from one corpus flip | 1232 passed, 0 failed, 8 skipped |
| `ci-router-vocabulary-reach.cjs` | exit 1, "review convergence" outranked by sk-code | exit 0, RESULT: PASSED |
| `doctor-phrase-reach.cjs` | STATUS=OK phrases=109 | STATUS=OK phrases=113 bridges=21 |
| `derive-command-bridges.cjs --check` | fresh | fresh, changed: [] |
| `skill-graph-freshness.cjs` | no drift | no drift |

The corpus and vitest start values above come from the delegated runs, not from an orchestrator rerun.

### 3.5 Derived artifacts and the tools that changed them

| Tool | Files changed |
|---|---|
| `generate-router-intent-signals.cjs --write --hub sk-code` | `sk-code/graph-metadata.json` |
| `compiled-route-manifest.cjs refresh --hub sk-code` | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` |
| the pre-commit hook's copy step (`pre-commit` line 668), run by hand | `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` |
| `skill_graph_compiler.py --export-json` | `system-skill-advisor/runtime/scripts/skill-graph.json` |
| `derive-command-bridges.cjs` | `command-bridges.generated.json`, generated blocks in `projection.ts` and `skill_advisor.py` |
| `pi/sync-prompts-pi.cjs` | `.pi/prompts/doctor-ci.md` |
| `npm run build` in the advisor runtime | `runtime/dist/` (gitignored) |

Not regenerated: `system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/corpus-manifest.json` still name the old changelog path. A CI job rebuilds them after push (commit cfd9285e32 is that job's rebuild).

Final cross-checks from the end state, all exit 0: `compiled-route-sync.cjs --check` (55 served copies match), `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`.

## 4. Routing probe table

Stage one is the advisor top pick with score and confidence. Stage two is the compiled route for `--hub sk-code`.

| Prompt | Expected | Before | After |
|---|---|---|---|
| review this github actions workflow diff | sk-code, review plus ci | sk-code 0.776, review+ci | same |
| add a timeout to a ci job | sk-code, ci | sk-code 0.223 ambiguous, defer | sk-code 0.663, ci |
| fix a failing vitest in the spec kit runtime | sk-code | spec-kit 0.744 vs sk-code 0.729 ambiguous, skilled | same |
| review my typescript module | sk-code, review plus skilled | sk-code 0.787, review+skilled | same |
| implement a responsive webflow animation module | not sk-code | sk-code 0.666, defer | sk-code 0.488 ambiguous, defer (see 6) |
| list every ci workflow switch state | /doctor:ci bridge | empty list | command-doctor-ci-report 0.607 |
| which ci workflow switches are off | /doctor:ci bridge | bridge 0.700, sk-code ranked first | command-doctor-ci-report first |
| add a concurrency group to the release workflow yaml | sk-code, ci | sk-code 0.254 ambiguous, defer | sk-code 0.670, ci |
| scaffold a new github actions workflow for this repo | sk-code, ci | sk-code 0.601 vs sk-git 0.552, ci | same |
| review the obsidian plugin settings tab code | sk-code review | sk-code 0.795, review | sk-code 0.740 ambiguous with mcp-tooling, review |
| pin an action to a sha | sk-code, ci | no pick, defer | sk-code 0.607, ci |
| turn the ci switch for codeql off | toggle bridge | empty | command-doctor-ci-toggle |
| show the ci switch report | report bridge | empty | command-doctor-ci-report |
| review convergence | system-deep-loop | sk-code 0.7485 vs deep-loop 0.7474 | system-deep-loop |
| list every git branch, which feature flags are off in the app | no ci bridge | none | none |
| add a timeout to a database query, concurrency in a go program | not CI | unchanged | unchanged |

Known residue: "add path filters to a workflow" still defers at stage two because the only narrow term also matches file-watcher phrasing. "a concurrency group for the worker pool" reaches ci at stage two because matching is a plain substring.

## 5. Private skills (audit only, nothing edited)

Both are standalone skills (class S), not hub packets, and the hub carries no reference to them.

local-webflow (1.1.3.0):
- P1: `SKILL.md` fails required sections. `validate_skill_package.py` exits 1, missing WHEN TO USE, HOW IT WORKS, RULES and REFERENCES, and the description is 221 chars.
- P1: the metadata trio `leaf-manifest.config.json`, `leaf-manifest.json` and `leaf-aliases.json` is missing. The fleet fixer skips `local-*`.
- P1: 25 relative links into `../sk-code/` and `../sk-doc/` resolve only through the symlink.
- P2: 133 stale `sk-code-webflow` names, no relocation changelog entry, and `graph-metadata.json` family still `sk-code`.

local-obsidian (0.1.4.0):
- P1: `SKILL.md` fails required sections, missing WHEN TO USE, HOW IT WORKS and REFERENCES.
- P1: the same missing metadata trio.
- P1: broken playbook link at `surface-detection/negative-control-non-obsidian.md:122`.
- P1: `references/quality/doc-quality-gate.md` lacks an OVERVIEW.
- P2: 82 stale `sk-code-obsidian` names, `SKILL.md:11` claims the parent hub routes it, which `README.md:167` contradicts, and there is no relocation changelog entry.

Advisor discovery: with `SPECKIT_PRIVATE_SKILL_ROOTS` set, `skill_advisor.py --force-local` returns local-webflow at 0.95, but the default native path returns neither private skill. Whether the daemon runs without that variable is UNKNOWN.

## 6. sk-code-quality and sk-code-review (read only, nothing edited)

- sk-code-quality: every validator passes. `manual-testing-playbook/quality-gate/quality-checklist.md` lines 28 and 58 name a Webflow-only standard that no longer exists. Web vocabulary also remains in `README.md` and two quality checklists.
- sk-code-review: every validator passes. The playbook root carries a hand-typed census of 30 scenarios (HAND_TYPED_CENSUS warning), and `SKILL.md` keeps some web vocabulary.

## 7. Open items for the operator

1. The webflow expectation contradicts a test and gold rows. `native-scorer.vitest.ts:380-393` asserts that "implement a responsive webflow animation module" routes to sk-code, and gold rows P1-WEB-001, P1-WEB-002, P1-PHRASE-008 and doctor-control-10 expect sk-code for web prompts. sk-code dropped from 0.666 to 0.488 but stays top. Deciding whether that test and gold change is yours.
2. Delete `shared/references/performance-loading-checklist.md` and the PERFORMANCE intent, or keep them.
3. Update this spec folder's `spec.md`, `acceptance-criteria.md` and `tasks.md` for the changelog rename to `v1.0.0.0.md`.
4. Make `verify-router-sync.cjs` number-agnostic so `ROUTER.md` can be renumbered.
5. Apply the private-skill findings in their own repositories.

## 8. Commit split

Commit in this order. Each message file validated with `validate-message.mjs --commit` at exit 0.

1. `commit-message-sk-doc-docs.txt`: `sk-code/README.md`, `sk-code/manual-testing-playbook/manual-testing-playbook.md`, `sk-code/shared/references/stack-detection.md`, `sk-code/sk-code-ci/README.md`, `sk-code/sk-code-ci/references/ci-workflow-standards.md`, `sk-code/sk-code-ci/references/trigger-and-filter-rules.md`, `sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/changelog/sk-code/code-obsidian` (deleted), `.skilled/changelog/sk-code/code-webflow` (deleted), `.skilled/changelog/sk-code/code-ci` (new).
2. `commit-message-sk-doc-command.txt`: `.skilled/commands/doctor/ci.md`, the four `.skilled/commands/doctor/assets/doctor-ci-*` files, `.pi/prompts/doctor-ci.md` (new), `.skilled/commands/README.txt`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`.
3. `commit-message-sk-doc-scorer.txt`: `system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lanes/lexical.ts`, `tests/scorer/sk-code-web-vocabulary.vitest.ts` (new).
4. `commit-message-sk-doc-routing.txt`: `sk-code/SKILL.md`, `sk-code/hub-router.json`, `sk-code/ROUTER.md`, `sk-code/graph-metadata.json`, `sk-code/description.json`, `sk-code/sk-code-ci/SKILL.md`, `sk-code/sk-code-ci/changelog/v0.1.0.0.md` (deleted), `sk-code/sk-code-ci/changelog/v1.0.0.0.md` (new), the runtime and authored `sk-code/manifest.json` pair, `system-skill-advisor/runtime/scripts/skill-graph.json`.
5. `commit-message-sk-doc-bridges.txt`: `.skilled/commands/doctor/_routes.yaml`, `command-bridges/derive-command-bridges.cjs`, `command-bridges/command-bridges.generated.json`, `lib/scorer/projection.ts`, `scripts/skill_advisor.py`, `lib/scorer/fusion.ts`, `tests/doctor-command-bridges.vitest.ts`, `tests/scorer/route-gates.vitest.ts` (new).

Why the routing commit holds the version change: the pre-commit re-mint hook treats the hub `SKILL.md`, `hub-router.json`, `mode-registry.json` and every packet `SKILL.md` as one input set and refuses a half-staged set. The CI packet `SKILL.md` therefore rides with the hub routing files, and its changelog rename travels with it so check 13d holds at every commit. Scorer commit 3 lands before 5 because `route-gates.vitest.ts` tests the narrowed review pattern.

The cli-pi helper executor was not used. Every change came from Claude sub-agents with frozen write scopes and was verified from the final state.
