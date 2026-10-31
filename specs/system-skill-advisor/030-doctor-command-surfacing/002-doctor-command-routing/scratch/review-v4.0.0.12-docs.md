# Documentation and drift review of v4.0.0.12 and v4.0.0.13

Read-only review on 2026-10-16 at HEAD `22a33af6d9` on `main`, with a clean working tree. Every path below is relative to the repository root.

Verdict: nothing is broken (no P0). Two claims would send a reader the wrong way (P1), and 19 places have drifted from the code or from each other (P2). Every validator in scope passed.

## 1. How the review ran

Each validator below was run and its output and exit status read.

- `validate_document.py` over the nine changelog entries (`--type changelog`), the doctor routing catalog page, DOC-385 to DOC-391, `setup.md`, the hook doc, the root and advisor READMEs, the advisor SKILL.md and the spec-kit doctor docs: all VALID, exit 0.
- `hvr_scan.py` over the same docs: 0 hard blockers on every file this release added. Two older files keep blockers that predate it, the advisor `SKILL.md` (29) and the advisor playbook root (8).
- `validate_catalog_package.py --package system-skill-advisor --package system-spec-kit`: PASS, 0 violations, exit 0.
- `validate-playbook-package.cjs`: SKIP for system-skill-advisor (see P2-14) and PASS for system-spec-kit with one older warning, both exit 0.
- `sync-runtime-mirrors.cjs --check`: "PASS: 185 mirrors across 8 trees are in sync.", exit 0.

Not run: the live advisor (it creates its `/tmp` socket directory), the sk-code drift guards, `parent-skill-check.cjs` and `validate.sh`. The brief allowed no other writes and did not list them.

## 2. Findings

### P1

**P1-1. The advisor changelog says a new doctor target needs no hand-written advisor entry.**

- Where: `.skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md:26`, and the add-a-target steps in `.skilled/commands/doctor/_routes.yaml:35-37`.
- Defect: a doctor bridge routes only after someone hand-writes its activation entry in `scoring-compatibility.json`, once in the TypeScript list and once in the Python list.
- What a reader gets wrong: a maintainer adds a route, runs `route-validate.sh` as the manifest header says, and the advisor never suggests the new command. Nothing flags it, because the reach probe checks only activated phrases and the bridge test checks only active bridges. The header also skips rerunning the bridge deriver and adding the row to the `/doctor:setup` target list.
- Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:58` says "An entry in `scoring-compatibility.json` activates a doctor bridge", and `feature-catalog/scorer-fusion/doctor-command-routing.md:27` says the same. `scoring-compatibility.json` holds one `command-doctor-*` entry per bridge in each list, with setup at lines 123 and 374. `/doctor:deep-loop` sits in the inventory without one and stays inactive (command-bridges `README.md:64`). `runtime/tests/doctor-command-bridges.vitest.ts:139` and `:173` test active bridges only.

**P1-2. Six spec-kit docs give an `advisor_status` command that exits 64.**

- Where: six lines under `.skilled/skills/system-spec-kit/`. They are `feature-catalog/feature-catalog.md:34`, `manual-testing-playbook/manual-testing-playbook.md:51`, `references/config/environment-variables.md:125`, `references/config/environment-variables.md:129`, `references/memory/embedder-pluggability.md:113` and `references/memory/embedder-pluggability.md:177`.
- Defect: each runs `node .skilled/bin/skill-advisor.cjs advisor_status --format json` without a workspace root, the form this release found broken in the doctor workflows.
- What a reader gets wrong: someone checking advisor or embedding health gets a usage error instead of a status.
- Evidence: `AdvisorStatusInputSchema` makes `workspaceRoot` required (`.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:309-311`). The CLI's usage exit is 64 (`runtime/skill-advisor-cli.ts:55`). The packet recorded that exact failure (`implementation-summary.md:147`). This is inferred from the schema and the recorded run, because I did not run the command. These lines predate the release, which fixed only the eight doctor copies, and all eight now pass `--workspace-root`.

### P2: changelog entries

**P2-1. The v4.0.0.13 entry says the sk-git check names its AI tool on Hermes.**

- Where: `.skilled/changelog/skilled/v4.0.0.13.md:21`.
- Defect: it says the check names the AI tool it runs in and lists Hermes among the runtimes it fixed.
- What a reader gets wrong: a Hermes user expects a healthy install to pass. It always shows DEGRADED there, because the leg runs without `--tool` and the AI-tool check stays UNKNOWN.
- Evidence: `.skilled/commands/doctor/assets/doctor-setup.yaml:53`, `.skilled/commands/doctor/scripts/git-setup-check.cjs:956` and the presentation's own note at `doctor-setup-presentation.txt:84`. "No longer FAIL" holds on Hermes. "Names the tool" does not.

**P2-2. Two entries say all nine commands with an input gate follow the one position.**

- Where: `.skilled/changelog/skilled/v4.0.0.13.md:24` and `.skilled/skills/sk-doc/sk-create-command/changelog/v1.0.4.0.md:25`.
- Defect: four of the nine put the gate inside `## 1. ROUTER CONTRACT`: `deep/research.md:38`, `deep/review.md:21`, `deep/ai-council.md:18` and `prompt/improve.md:13`, all under `.skilled/commands/`.
- What a reader gets wrong: a command author who copies one of these four copies a position the router template rejects.
- Evidence: `sk-create-command/assets/command-router-template.md:53-54` puts the gate "before ROUTER CONTRACT". `deep/research.md:31` also tells the agent to load the workflow YAML before its gate, and `sk-create-command/SKILL.md:225` puts the gate before asset loading.

**P2-3. The system-spec-kit v2.8.1.0 entry names one spec folder for work from two.**

- Where: `.skilled/skills/system-spec-kit/changelog/v2.8.1.0.md:17`.
- Defect: it names only the 035 packet. Two of its five bullets, the Hermes header and the probe's new test, shipped from `specs/sk-git/033-git-setup-customization/008-out-of-scope-cleanup` in commit `144d0bdeb6`.
- What a reader gets wrong: someone tracing those two changes opens the wrong packet.
- Evidence: `git show --stat 144d0bdeb6` and its `Spec:` trailer.

**P2-4. The sk-doc ROUTER.md took the release version its contract says it keeps for itself.**

- Where: `.skilled/skills/sk-doc/ROUTER.md:11`.
- Defect: commit `85168a25fb` moved it from 2.3.9.0 to 2.3.10.0 with no other change, so the four hub carriers agree only because ROUTER.md broke its own rule.
- What a reader gets wrong: a maintainer reads the agreement as the correct state and keeps bumping ROUTER.md on each release, against the changelog workflow.
- Evidence: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261` says a release never writes a hub `ROUTER.md`. `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1862-1863` says ROUTER.md "keeps its own version, raised by the per-doc bump". The v2.3.9.0 release (`1caad4a529`) did the same. The other three carriers and SKILL.md correctly carry 2.3.10.0.

### P2: root README and the commands index

**P2-5. The root README gives `/doctor:setup` the old verdict list and an unqualified "writes nothing".**

- Where: `README.md:1235`.
- Defect: it says the command prints PASS, FAIL or SKIP and writes nothing.
- What a reader gets wrong: a user who sees DEGRADED finds no explanation, and nobody told "writes nothing" expects `/tmp/system-skill-advisor` to appear.
- Evidence: `doctor-setup-presentation.txt:43` lists PASS, FAIL, SKIP and DEGRADED. `setup.md:61` and `v2.8.1.0.md:24-25` state the `/tmp` write.

**P2-6. The root README counts eight routed doctor commands.**

- Where: `README.md:1233`.
- Defect: the manifest routes seven.
- What a reader gets wrong: the wrong router count when adding or auditing one.
- Evidence: the manifest header lists seven routers (`.skilled/commands/doctor/_routes.yaml:4-12`), and its `routes:` block names the same seven commands.

**P2-7. The root README counts 21 doctor YAML workflows.**

- Where: `README.md:1283`.
- Defect: `.skilled/commands/doctor/assets/` holds 23 `doctor-*.yaml` files.
- Evidence: `doctor-setup.yaml` (`1996cf02a6`) and `doctor-git-setup.yaml` (`8d40b8c128`) both landed on 2026-10-15, and the count last moved on 2026-10-14.

**P2-8. The root README leaves `/doctor:setup` and the doctor routing out of the places a new user reads.**

- Where: `README.md:185-193` and `README.md:670`.
- Defect: Verify Installation never mentions `/doctor:setup`, though both release entries pitch it as the first thing to run on a fresh clone. The advisor section's no-brief line lists three status lines without the setup hint, and section 7 never says the advisor now suggests doctor commands or adds an `Also:` line.
- What a reader gets wrong: a new user who follows the Quick Start never learns the command exists, because its only mention sits deep in section 11.
- Evidence: `grep -n 'doctor:setup' README.md` returns line 1235 only.

**P2-9. The commands index tree leaves out `setup.md`.**

- Where: `.skilled/commands/README.txt:102-113`.
- Defect: the `doctor/` tree lists nine command files, while line 158 of the same file says ten.
- Evidence: `ls .skilled/commands/doctor/*.md` lists ten.

### P2: advisor docs

**P2-10. Two advisor docs still say "types" where the code now checks "starts with".**

- Where: `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:31` and `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:62`.
- Defect: both say a doctor bridge outranks a passing skill when the prompt "types" a doctor slash command. Since v0.16.1.0 only a prompt that starts with `/doctor:` counts.
- What a reader gets wrong: they expect a command quoted mid-prompt to promote the bridge, which is the exact case v0.16.1.0 removed.
- Evidence: `runtime/lib/scorer/fusion.ts:680` and `runtime/scripts/skill_advisor.py:887` both test for a leading `/doctor:`.

**P2-11. The advisor README, SKILL.md and hook doc do not describe what doctor routing shows in a brief.**

- Where: the advisor `README.md:99`, the advisor `SKILL.md` and `hooks/skill-advisor-hook.md:41`.
- Defect: the README lists the three fallback lines without the setup hint, and neither the README nor SKILL.md mentions doctor bridges. The hook doc says the brief "names the recommended skill(s)" and says nothing about a doctor command as the top line or the `Also:` second line.
- What a reader gets wrong: someone reading the advisor's own docs cannot tell why a brief shows `/doctor:env list` or an `Also:` line.
- Evidence: `runtime/lib/render.ts:476-489` renders the doctor top line and the `Also:` line. A case-insensitive search for "doctor" in the advisor README finds only the `/doctor:skill-advisor` row at line 194.

**P2-12. The Pi catalog entry and the routing page's source table miss the setup-hint wiring.**

- Where: `feature-catalog/hooks-and-plugin/pi-prompt-advisor.md:26` and `feature-catalog/scorer-fusion/doctor-command-routing.md:47-56`.
- Defect: the Pi entry says the deadline path delivers `renderAdvisorFallbackDirective()` and never mentions the setup check v0.16.0.0 added there. The routing page's source table leaves out the Pi hook and the OpenCode plugin's render file, though section 2 of the same page says both compute the setup flag.
- Evidence: `hooks/pi/prompt-advisor.ts:285` passes `setupWording`, and `.skilled/plugins/lib/skill-advisor-render.js:28` holds the OpenCode copy of the check.

**P2-13. DOC-387 contradicts itself on the brief's line count.**

- Where: `manual-testing-playbook/doctor-commands/doctor-routing-contested-second-line.md:27-28`.
- Defect: it says the step 1 brief has two lines, while line 73 of the same file says the rest of the brief holds the `Directives:` line and the comment hygiene directive.
- What a reader gets wrong: a tester who checks the line count fails a correct four-line brief.
- Evidence: the two places in the same file disagree. DOC-389 (`doctor-routing-setup-hint.md:53`) also counts the directive block as part of its brief.

**P2-14. The packet cites a playbook-validator pass for scenarios the validator skipped.**

- Where: `specs/system-skill-advisor/035-doctor-command-routing/implementation-summary.md:191` and `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json:12`.
- Defect: the summary cites `violations=0` from the playbook validator as evidence for DOC-385 to DOC-391, but the validator skips the whole advisor playbook.
- What a reader gets wrong: they believe the operator-scenario contract checked the new scenarios. It checked none of them.
- Evidence: `validate-playbook-package.cjs --package system-skill-advisor` prints `SKIP ... operator=0 routing_gold_excluded=61 violations=0`, because the manifest lists the advisor playbook as a routing-gold root. Only `validate_document.py` checks the structure of those seven files.

### P2: spec-kit docs, command docs and the packet

**P2-15. The spec-kit README lists four doctor commands and leaves out `/doctor:setup`.**

- Where: `.skilled/skills/system-spec-kit/README.md:550`.
- Defect: `/doctor:setup` shipped in system-spec-kit v2.8.0.0 and carries `skill_agent: system-spec-kit` (`.skilled/commands/doctor/setup.md:6`), yet the README's doctor table omits it.
- What a reader gets wrong: someone reading the docs of the skill that owns the command does not find it.

**P2-16. Two spec-kit catalog pages still describe four routers and nine workflows.**

- Where: lines 820 and 838 of `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`. Lines 3, 17 and 50 of `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md` in the same skill.
- Defect: they describe four routers and nine workflows, and `setup` is missing from the mutation-class list.
- What a reader gets wrong: the catalog disagrees with itself, because `doctor-commands/category-overview.md:17` and `:25` were updated for `/doctor:setup` and these pages were not.
- Evidence: `_routes.yaml` now has seven routers and 14 routes. These pages already missed the sk-code and git routers before this release.

**P2-17. `setup.md` says "It writes nothing" without its own exception.**

- Where: `.skilled/commands/doctor/setup.md:10`.
- Defect: line 61 of the same file says the advisor CLI may create its `/tmp` socket directory, and line 10 drops that exception.

**P2-18. The doctor scripts README leaves out the new reach probe.**

- Where: `.skilled/commands/doctor/scripts/README.md:29-44` and its key-file table at lines 54 to 68.
- Defect: it lists 15 scripts and skips `doctor-phrase-reach.cjs`, the 16th, which this release added.
- Evidence: the folder holds 16 `.cjs`, `.py` and `.sh` scripts, and the README never names `phrase-reach`.

**P2-19. The packet's implementation summary describes a state that later commits replaced.**

- Where: `specs/system-skill-advisor/035-doctor-command-routing/implementation-summary.md:49-50`, `:175` and `:213-218`.
- Defect: it still says "Complete, not committed", while `spec.md:25` says Complete and the work is committed from `1996cf02a6` onward. Known Limitations 1, 2 and 4 describe a stale trigger index, two README.txt voice blockers and a failing drift guard, and later commits fixed all three (README.txt now scans 0 hard blockers). The list is numbered 1, 2, 4, 5, 6 then 3. The `### Mutation checks` heading at line 175 is empty.
- What a reader gets wrong: someone resuming the packet thinks the work is uncommitted and three problems are still open.

## 3. Checked and sound

- Versions: each SKILL.md matches its newest changelog entry (system-skill-advisor 0.16.1.0, system-spec-kit 2.8.1.0, sk-code-skilled 1.2.6.0, sk-create-command 1.0.4.0, sk-doc 2.3.10.0 and sk-git 1.9.1.0). The Hermes copies match. The sk-doc `description.json`, `hub-router.json` and `mode-registry.json` carry 2.3.10.0.
- Code claims hold: the 17-row target list, the five legs and their repair commands, exit 3 read as DEGRADED and exit 75 as SKIP, the starts-with rule in both scorers and one setup regex shared by Claude, Pi and OpenCode. Codex, Cursor and Devin reach that regex through the Claude hook. All eight doctor `advisor_status` calls pass `--workspace-root`, the probe exits 2 on a stale build, the drift guard skips evidence copies and matches the Hermes marker, and the generated header line in all 68 Hermes copies has no semicolon.
- Counts: the 39 command entry points (`README.md:80` and `:1074`) and the per-group counts in `.skilled/commands/README.txt` match the files. The advisor catalog's 43 features and its 7 scorer-fusion entries match the files on disk.
- Links and mirrors: no broken relative link in the 36 docs checked, and every doctor command has a mirror in all five runtime trees.
- DOC numbers: DOC-385 to DOC-391 belong to the advisor playbook. DOC-384 is sk-git's `/doctor:git setup` scenario, and the shared registry in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26` lists both correctly.

## 4. Recommendations

Shipped changelog entries stay as written in this repository (commit `85168a25fb` says so), so each changelog fix below goes into the next patch entry rather than an edit of the old one.

### Required

- **P1-1.** Rewrite the add-a-target steps in `_routes.yaml:35-37` to list every step: append the route, add the target to its router, its presentation and the `/doctor:setup` target list, add the two activation entries in `scoring-compatibility.json`, then rerun `derive-command-bridges.cjs`, `route-validate.sh` and `doctor-phrase-reach.cjs`. Say in the next advisor entry that activation is a hand-written step.
- **P1-2.** Add `--workspace-root "$PWD"` to the six `advisor_status` commands, the same form the doctor workflows now use. Keep the `EMBEDDINGS_PROVIDER=hf-local` prefix at `environment-variables.md:125`.
- **P2-2.** Move the gate in the four commands above `## 1. ROUTER CONTRACT`, where `design/extract.md`, `create/goal.md` and the three doctor commands already put it. In `deep/research.md`, also move the EXECUTION PROTOCOL block below the gate. The claim then becomes true without a correction.
- **P2-5, P2-6 and P2-7.** In `README.md`, change line 1235 to "PASS, FAIL, SKIP or DEGRADED" and "writes nothing in the repository", line 1233 to "The seven routed ones" and line 1283 to "The 23 underlying YAML workflows".
- **P2-13.** In DOC-387, replace "has two lines" with "starts with two lines" at lines 27 and 28.

### Should do

- **P2-1.** Add `hermes` to the `--tool` names `git-setup-check.cjs` accepts, which is sk-git's change, so the leg can name Hermes and the v4.0.0.13 claim becomes true. Until then, say in the next entry that Hermes shows DEGRADED on a healthy install.
- **P2-8 and P2-9.** Add `/doctor:setup` as the last step of Verify Installation in `README.md`. Add the setup hint to line 670 and one bullet to section 7 saying the advisor suggests doctor commands, with an `Also:` line when a skill also fits. Add `setup.md` to the `doctor/` tree in `.skilled/commands/README.txt`.
- **P2-10, P2-11 and P2-12.** Replace "types" with "starts with" in the two docs from P2-10. Add one short paragraph on doctor bridges, the `Also:` line and the setup hint to the advisor README and to section 2 of the hook doc, plus one line in the advisor SKILL.md. Add the setup check to the Pi catalog entry, and add `hooks/pi/prompt-advisor.ts` and `.skilled/plugins/lib/skill-advisor-render.js` to the routing page's source table.
- **P2-14.** Correct `implementation-summary.md:191` to say the playbook validator skipped the advisor package. Removing the advisor root from `routingGoldRoots` would let per-file classification check the scenarios, but it would put all 61 advisor scenarios under the operator contract at once, so run the validator in report mode first and fix what it finds.
- **P2-15 and P2-16.** Add `/doctor:setup` to the spec-kit README table and make it "Five doctor commands". Update the two catalog pages to seven routers and 14 routes, and add `setup` to the read-only list at `doctor-router-and-manifest-dispatch.md:50`.
- **P2-17 and P2-18.** Change `setup.md:10` to "It writes nothing in the repository." Add `doctor-phrase-reach.cjs` to the scripts README tree and key-file table.
- **P2-19.** Set the summary's status to Complete, drop or mark resolved Known Limitations 1, 2 and 4, renumber the list and move the mutation-check paragraph under its empty heading.

### Optional

- **P1-1.** Add a test that fails when a manifest route has no activation entry and is not on an explicit inactive list holding `/doctor:deep-loop`. No current test catches a forgotten activation.
- **P2-3.** List both spec folders in the v2.8.1.0 spec line, if editing that metadata line is acceptable under the frozen-entry practice.
- **P2-4.** Leave `ROUTER.md` at 2.3.10.0, since moving a version backwards adds churn, and stop bumping it in release commits. If the hub router should track releases after all, change `sk-create-changelog/SKILL.md:261` and the `parent-skill-check.cjs` comment instead, so the rule and the practice agree.
- Clear the older voice blockers in the advisor `SKILL.md` (29) and the advisor playbook root (8) in a separate pass. Neither came from this release.
