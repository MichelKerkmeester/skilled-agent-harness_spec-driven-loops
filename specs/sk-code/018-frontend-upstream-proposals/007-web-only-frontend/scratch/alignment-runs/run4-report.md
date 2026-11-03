# Alignment report: 1f9a9dea41~1..9cbd8540e8

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: range, file set first-parent
- Target: `1f9a9dea41~1..9cbd8540e8`
- Commits: `f829fa7be51cb2facae98b0cbf63aa157b0779cb` to `9cbd8540e8ce76d7e077c857da10cd9563086d97`, 3 first-parent commits
- Files: 62, of which 0 uncommitted or untracked
- Owners: 10
- Findings: 18 (P0 0, P1 7, P2 11), 15 literal, 0 inferred, 7 outside the scope; 3 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | no | 0 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 36 | 7 |
| S3 | Feature catalog entries | yes | 36 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 36 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 38 | 3 |
| S6 | Changelogs updated or created | yes | 36 | lens only |
| S7 | Skill routing is right | yes | 11 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 11 | 1 |
| S9 | Commands aligned | no | 0 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 6 | 9 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | no | 0 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 12 | 1 |
| S15 | CI parity | yes | 0 | 19 |

## Battery

pass 79, fail 0, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code` | 0 | 642 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code/sk-code-frontend` | 0 | 105 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code/sk-code-review` | 0 | 118 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 344 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 719 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code` | 0 | 34 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code/sk-code-frontend` | 0 | 30 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code/sk-code-review` | 0 | 32 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 35 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 31 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 4131 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 30 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 4174 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-code` | 0 | 73 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 56 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 76 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/README.md` | 0 | 146 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/ROUTER.md` | 0 | 146 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/SKILL.md` | 0 | 140 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/changelog/v3.10.0.0.md` | 0 | 140 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-alone-frontend-compiled-routing.md` | 0 | 143 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md` | 0 | 147 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/phase-detection.md` | 0 | 150 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | 0 | 148 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/README.md` | 0 | 143 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | 0 | 141 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/SKILL.md` | 0 | 138 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.0.0.md` | 0 | 140 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md` | 0 | 146 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/figma-check.md` | 0 | 145 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-web.md` | 0 | 145 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md` | 0 | 146 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` | 0 | 149 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | 0 | 154 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-review/README.md` | 0 | 148 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1294 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-code` | 0 | 67 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 82 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 174 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-code` | 0 | 36 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 37271 |
| pass | P2 | no | `S5-derived-counts` | 0 | 153 |
| pass | P2 | no | `S5-readme-references` | 0 | 3225 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 28 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-code` | 0 | 436 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-code` | 0 | 23 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-code` | 0 | 6235 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 83 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 172 |
| pass | P2 | no | `S8-advisor-status` | 0 | 68 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 231 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 38 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 34 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 35 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 34 |
| pass | P0 | yes | `S11-hermes-prompts` | 0 | 32 |
| pass | P0 | yes | `S11-hermes-skills` | 0 | 162 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 28 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 51 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals` | 0 | 1407 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode` | 0 | 1446 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend` | 0 | 1457 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 80 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 4454 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1547 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 42 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 43 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 30 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 38 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1433 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 465 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 31 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 142 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 41 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1541 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3590 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 225 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1209 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .hermes/skills/sk-code-frontend/ROUTER.md
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/skills/sk-code/README.md
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .hermes/skills/sk-code-frontend/ROUTER.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/sk-code/ROUTER.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json
- `sk-code-script-tests.yml`: pull_request: paths match .skilled/skills/sk-code/README.md
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-advisor-stress.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/sk-code/README.md
- `spec-kit-check.yml`: push: paths match .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S2 Skill docs match sk-create-skill

- **B-R1** P1 literal `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:21`: The surface's own SKILL.md describes only the paired case and asserts it unconditionally: the hub bundles the packet beside sk-code-quality or sk-code-review, and 'The paired workflow mode applies the guidance it loads'. The packet also routes alone, and that route is pinned by a gold scenario, so the sentence is false on a real path. Reach: the exact prompt 'fix the keyboard focus order in this w...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix the keyboard focus order in this web form"` exit 0: ...e","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-frontend","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-frontend"}],"effectivePolicyHash":"d00612e36da7d06624894f7ed8150f4783368d67148e6ef559195d2cd99f2b1d","generation":2}

### S5 READMEs match sk-create-readme, root included

- **C-06** P2 literal `.skilled/skills/sk-code/sk-code-review/README.md:203`: The FAQ sentence enumerates the surface packets that carry the implement, debug and verify doctrine while leaving out sk-code-ci. The branch edited this exact line to add sk-code-frontend and kept the omission, and shared/README.md says all three surface packets read the doctrine through their symlinks, so the enumeration is still incomplete.
  - Evidence: `grep -n "The surface packets" .skilled/skills/sk-code/sk-code-review/README.md` exit 0: 203:A: The surface packets (`sk-code-skilled`, `sk-code-frontend`) carry the implement to debug to verify workflow doctrine the acting agent applies to fix accepted findings.

### S6 Changelogs updated or created

- **C-07** P2 literal `.skilled/skills/sk-code/changelog/v3.10.0.0.md:14`: The entry records a release that has spec folders behind it and carries no spec-folder blockquote, which sk-create-changelog SKILL.md section 5 item 4 requires when the release has one. 50 of the 61 sk-code entries carry it. The same omission runs through the other new entries on this branch: sk-code-frontend v1.0.0.0 and v1.0.1.0, mcp-figma v1.2.0.0, sk-design-fundamentals v1.1.0.0 and sk-create-...
  - Evidence: `ls .skilled/skills/sk-code/changelog/*.md | wc -l; grep -rl "> Spec folder" .skilled/skills/sk-code/changelog/*.md | wc -l` exit 0: 61 50
- **E-004** P2 literal `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md:33`: The rewritten bullet keeps the count at three aliases by promoting an alias that shipped one release earlier. It says '`figma frame check` joins `FIGMA_TO_CODE`' as part of v1.0.1.0, but that phrase is already in the packet ROUTER in the commit that created the surface and its v1.0.0.0 entry, so v1.0.1.0 added two aliases and the third named here is not an addition. The rewrite dropped the two nat...
  - Evidence: `git -c core.fsmonitor=false show c0c83e54bcd:.skilled/skills/sk-code/sk-code-frontend/ROUTER.md | grep -c "figma frame check"; git -c core.fsmonitor=false show c0c83e54bcd:.skilled/skills/sk-code/sk-c...` exit 0: 2 title: "sk-code-frontend v1.0.0.0, the frontend surface is established"

### S8 Skill integrated in system-skill-advisor

- **D-03** P1 judgment `.skilled/skills/sk-code/hub-router.json:87`: The new surface is reachable only through 22 exact phrases, so two requests inside the packet's own declared concerns never reach it. A stylesheet review phrased as css cascade and specificity problems compiles to sk-code-review alone with no frontend evidence, although web-cascade-and-selectors.md is the file ROUTER.md line 29 names for cascade and specificity work. A request for missing labels a...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this landing page CSS for cascade and specificity problems"` exit 0: {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"packetId":"sk-code-review","workflowMode":"sk-code-review"}],...} (no sk-code-frontend target)
  - Critic override: severity P2 to P1. This is a failing integration probe, not a coverage wish: probe P06 routes nothing at all, and the packet ROUTER's own load-when column names 'accessible name, focus behavior' as concerns of web-accessibility-patterns.md while the hub vocabulary carries no phrase for either. Two runs confirm it: `compiled-route.cjs --hub sk-code --prompt "check this form markup for missing labels and broken tab or...
- **PRB-01** P1 judgment: Probe P06 "check this form markup for missing labels and broken tab order" expected sk-code/sk-code-frontend; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check this form markup for missing labels and broken tab order"}' --format json` exit 0: top-1 was nothing

### S14 Spec packets validate (changed-packet-validation replay)

- **E-001** P1 literal `specs/sk-code/018-frontend-upstream-proposals/spec.md:142`: The phase parent still records the reversed operator decision as an answered question. Section 4 says 'the React Native question was answered by the operator: canonical sk-code carries stack-agnostic React Native practice' and cites 001 ADR-001, while phase 007's ADR-001 in this same change marks exactly that decision Superseded and ships the opposite rule. The frontmatter repeats the same superse...
  - Evidence: `grep -n "stack-agnostic React Native practice" specs/sk-code/018-frontend-upstream-proposals/spec.md; grep -n "| 7 | 007-web-only-frontend/" specs/sk-code/018-frontend-upstream-proposals/spec.md` exit 0: ...-03; 001 ... 142:- None open. The React Native question was answered by the operator: canonical sk-code carries stack-agnostic React Native practice and the `ROUTER.md` sect... 116:| 7 | 007-web-only-frontend/ | Remove the React Native layer from canonical sk-code: the frontend surface keeps web ...
- **E-002** P2 literal `specs/sk-code/018-frontend-upstream-proposals/spec.md:77`: The parent's In Scope bullet still says the surface 'carries the core practice page, the web and native stack layers', which is the phase 001 shape. At head the packet has one stack layer, the six web topic files and the Figma check, and the six native reference files are deleted in this change. The same file records phase 7 as Complete and its re-pin section now says every React Native file stays...
  - Evidence: `grep -n "web and native stack layers" specs/sk-code/018-frontend-upstream-proposals/spec.md; ls .skilled/skills/sk-code/sk-code-frontend/references | grep -c native` exit 0: 77:- A dedicated `sk-code-frontend` surface packet in sk-code: a peer of `sk-code-ci`, not part of `sk-code-quality`. It carries the core practice page, the web and native stack layers, the topic files, the five-pass Figma check and the per-mode Frontend overrides contract (ranks 1 to 3). 0
- **E-003** P2 literal `specs/sk-code/018-frontend-upstream-proposals/spec.md:134`: The phase 6 to phase 7 handoff row cites `006-open-items-and-alignment/scratch/final-suites.txt` and `reach-final.txt` as the proof that 'every routing gate is green and no finding is open'. Those two files were written at 17:58 and 18:05, before the web-only refactor at 19:40: their reach run prints sk-code `declared=101` and `advisor generation: 69`, while the final state prints `declared= 92` a...
  - Evidence: `grep -n "006-open-items-and-alignment/scratch/final-suites.txt" specs/sk-code/018-frontend-upstream-proposals/spec.md; grep -h "sk-code " specs/sk-code/018-frontend-upstream-proposals/006-open-items-a...` exit 0: ...s open | `006-open-items-and-alignment/scratch/final-suites.txt` and `reach-final.txt` | OK sk-code declared=101 wrong-hub= 0 outranked= 0 no-reach= 0 allowed= 0 probe-error= 0 operator-local= 0 OK sk-code declared= 92 wrong-hub= 0 outranked= 0 no-reach= 0 allowed= 0 probe-error= 0 operator-local= 0
- **E-005** P2 judgment `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/acceptance-criteria.md:56`: AC-001's Then clause is 'Then it prints nothing', and its own Verification cell records that the command prints a line, the advisor fallback banner `NATIVE_DIST_MISSING` in `manual-testing-playbook/manual-testing-playbook.md:70`. The row is marked Met with that contradiction written into it, so the closure gate for REQ-001 is passed on evidence that fails its stated check. The intent holds (the ba...
  - Evidence: `rg -n "NATIVE_|react-native-layout|native-(accessibility|inputs|layout|lists|platform)" .skilled/skills/sk-code` exit 0: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:70:- The **local fallback** prints `source: "local"`, no `score`, and a stderr banner reading `Native advisor unavailable (NATIVE_DIST_MISSING; freshness=unavailable); falling back to local Python scorer.`

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **C-02** P1 literal `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:100`: The tie-break section names two surface packets for sk-code in the wrong order relative to the live hub, and the routerPolicy JSON 30 lines above lists four of the five registry modes in tieBreak (line 69, plus includeSurfaces at line 123). The live hub ranks sk-code-frontend third. This branch edited the same file (v1.2.6.0 to v1.2.7.0, three surfaces in the worked example at line 27, all five pa... [S5, C]
  - Evidence: `node -e "console.log(require('./.skilled/skills/sk-code/hub-router.json').routerPolicy.tieBreak.join(', '))"` exit 0: sk-code-quality, sk-code-review, sk-code-frontend, sk-code-ci, sk-code-skilled
  - Critic override: pre-existing, lane severity P1. The file is not in the reviewed range: `git log -1 -- parent-hub-router-schema.md` gives dddc000f7e, an ancestor of the range base, and `git diff --name-only 1f9a9dea41~1..9cbd8540e8` does not list it, so the claim that this branch bumped it to v1.2.7.0 and edited the worked example is wrong. The omission was already stale at the base: `git show 1f9a9dea41~1:.skilled/skills/sk-code/hub-router.json...
- **C-04** P2 literal `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:195`: The extension matrix row that holds sk-code up as the canonical live example still lists two surface packets. It was correct before this branch and went stale when the hub gained a third surface, and the branch did not touch this file. The registry now declares three surfaces. [S5, C]
  - Evidence: `node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').extensions['surface-axis'].surfaces.join(', '))"` exit 0: sk-code-ci, sk-code-frontend, sk-code-skilled
  - Critic override: pre-existing, lane severity P2. The finding states the branch did not touch the file, and sk-code-frontend already existed at the range base, so the two-surface row was stale before this change.
- **C-05** P2 literal `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:75`: The adopter case describes the live repo in the present tense with two surface packets. That was accurate on main and went stale when the hub gained a third surface, and the branch did not touch this file. [S5, C]
  - Evidence: `node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').extensions['surface-axis'].surfaces.join(', '))"` exit 0: sk-code-ci, sk-code-frontend, sk-code-skilled
  - Critic override: pre-existing, lane severity P2. Same as C-04: untouched file, and the third surface predates the range, so the present-tense example was already wrong at 1f9a9dea41~1.

### unchanged in range

- **B-R2** P1 literal `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:26`: The feature entry the branch edited to add sk-code-frontend tells the reader a surface is 'reached only when the hub bundles them alongside a workflow mode via routerPolicy.outcomes.surfaceBundle'. The hub's own router declares a second reach: hub-router.json line 9 defines outcomes.single as 'routes to one packet: a workflow mode, or a surface alone when no workflow mode scores', and the compiled... [S3, B]
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix the keyboard focus order in this web form"` exit 0: ...e","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-frontend","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-frontend"}],"effectivePolicyHash":"d00612e36da7d06624894f7ed8150f4783368d67148e6ef559195d2cd99f2b1d","generation":2}
- **A-002** P2 literal `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:55`: The catalog states the replay runs over 'the 65-row committed gold' and that 'sk-code's eight gold rows' print surface slice not replayed. The tool prints total gold=66 and hub=sk-code gold=9. Cause confirmed rather than restated: the figures were correct when written in 70547d083a, then 2c721cea1b added the ninth sk-code gold scenario (surface-alone-frontend-compiled-routing.md, absent at 70547d0... [doc-coherence, A]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep -E "^hub=sk-code|^total gold"` exit 0: hub=sk-code gold=9 unscored=9 surface slice not replayed total gold=66 scored=57 tied=4 mean_f1=0.9156 exact=49
- **A-003** P2 literal `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:24`: This reference repeats the stale 65-row figure and additionally quotes an output line the tool no longer prints: `hub=sk-code gold=8 unscored=8 surface slice not replayed`, described as 'sk-code's eight gold rows'. The live run prints gold=9 unscored=9 and total gold=66. Same confirmed cause as A-002: the ninth gold scenario landed in 2c721cea1b, after the paragraph was written. Case: a reader rep... [doc-coherence, A]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep -E "^hub=sk-code|^total gold"` exit 0: hub=sk-code gold=9 unscored=9 surface slice not replayed total gold=66 scored=57 tied=4 mean_f1=0.9156 exact=49
- **D-01** P2 literal `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:242`: The comment above the near-miss test still says the frontend surface keys on 'web, native and Figma phrases'. The native half was deleted by the web-only refactor in this branch: the packet ships no native reference, its ROUTER carries no native intent, and mode-registry has no native alias. A maintainer extending the near-miss list reads a three-family contract where the code now implements two, ... [S7, D]
  - Evidence: `grep -n "native" .skilled/bin/tests/compiled-route-surface-hint.test.cjs; grep -c "native" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` exit 0: 242:// code, so the surface keys on its own web, native and Figma phrases and these | 0 (ROUTER.md, exit 1, no match)

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C-01** P1 literal `README.md:831`: The Frontend surface feature list still claims native layout after the surface went web-only at 1f9a9dea41, and the same sentence repeats at README.md:1576. The packet ships no native reference: references/ holds six web topic files, the practice core, the markup layer, figma-to-code and three workflow links. The phrase is the last remnant of the deleted references/native-layout-and-text.md, and i... [S5, C]
  - Evidence: `ls .skilled/skills/sk-code/sk-code-frontend/references; git -c core.fsmonitor=false log --oneline -S "native layout" -- README.md` exit 0: ...md web-elements-and-attributes.md web-internationalization.md web-layout-and-sizing.md web-markup-and-css.md web-performance-and-loading.md workflow-debug.md workflow-implement.md workflow-verify.md | dddc000f7e docs(sk-code): align the frontend references and every surface count with three surfaces
  - Critic override: duplicate, lane severity P1. Same defect as A-001: README.md:831 and :1576 still say the Frontend surface carries 'native layout'. A-001 names both lines, this one names 1576 as well.
- **C-03** P1 literal `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:24`: The entry states a 65-row committed gold and quotes the transcript hub=sk-code gold=8 unscored=8, then calls them sk-code's eight gold rows. The replay prints gold=9 for sk-code and a total of 66. The branch added the CB-CR-009 gold scenario in this same series and raised the figure from 64 to 65, so the new number was already one short when it was written. The same two figures appear at .skilled/... [S5, C]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` exit 0: hub=sk-code gold=9 unscored=9 surface slice not replayed | total gold=66 scored=57 tied=4 mean_f1=0.9156 exact=49
  - Critic override: duplicate, lane severity P1. Same defect as A-003: leaf-route-replay.md:24 quotes gold=8 and a 65-row gold where the tool prints gold=9 of 66 (verified: total gold=66, hub=sk-code gold=9). The one site this finding adds that A-003 does not name is .skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md:24, which also carries 65.
- **D-02** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:21`: The packet's own contract describes only the bundled case: line 19 says the hub 'bundles this surface beside sk-code-quality for authoring and sk-code-review for review', and line 21 says 'the paired workflow mode applies the guidance it loads'. The hub routes the surface alone whenever no workflow mode scores (hub SKILL.md line 39, and the hub's gold scenario CB-CR-009 is titled 'sk-code keyboard... [S7, D]
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix the keyboard focus order in this web form"` exit 0: {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-frontend","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-frontend"}],...}
  - Critic override: duplicate, lane severity P2. Same defect as B-R1 at the same file and line (sk-code-frontend/SKILL.md:21, paired-only framing with README.md:23 and :25). B-R1 carries the P1 grade and the replacement sentence.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P02 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P03 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P04 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P05 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P06 | sk-code/sk-code-frontend | - | fail |
| P07 | sk-doc/sk-create-skill | sk-doc/sk-create-skill | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-native.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md`
- `.skilled/skills/sk-code/sk-code-frontend/references/react-native-layout-and-a11y.md`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/decision-record.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/decision-record.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/.gitignore`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/.gitkeep`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/brief-n1-packet.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/brief-n2-hub.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/brief-n3-docs.md`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/scratch/reach-final.txt`
- `specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/spec.md`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`

