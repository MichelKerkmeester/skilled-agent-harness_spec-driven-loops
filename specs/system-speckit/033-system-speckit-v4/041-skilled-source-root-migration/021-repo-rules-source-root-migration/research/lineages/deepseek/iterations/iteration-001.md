---
title: "Iteration 1: In-repo consumer census outside specs/"
trigger_phrases: []
---
# Iteration 1: In-repo consumer census outside specs/

## Focus

Q1 — which tracked files outside `specs/` name a rule file or the rules directory as a live path, at file:line, and what changes for each when the corpus moves from `repo-rules/` to `.skilled/repo-rules/` with a per-entry farm left at the root.

## Actions Taken

- Read `REPO RULES.md` end to end (114 lines) and counted its router links.
- Grepped `repo-rules` across the tree, excluding `specs/`, `node_modules/`, `.git/` and the runtime mirror directories.
- Grepped all 13 rule bodies for `../REPO%20RULES.md` backlinks.
- Read `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` in full (437 lines).
- Read `.skilled/skills/sk-communication/benchmark/reply-harness/generate-prompts.mjs` lines 55-134.
- Read the packet `spec.md` §2-§4 to anchor the migration semantics (REQ-001 to REQ-006, edge cases, NFRs).
- Confirmed `.opencode/` is a per-entry symlink farm into `.skilled/` (e.g. `.opencode/skills -> ../.skilled/skills`), so `.opencode/skills/...check-repo-rules.cjs` and `.skilled/skills/...check-repo-rules.cjs` are one file.

## Findings

### A. `REPO RULES.md` router — 26 live links

1. `REPO RULES.md` carries exactly 26 `repo-rules/<rule>.md` link instances: 13 trigger rows at lines 40-52 and 13 index rows at lines 60-72. Every target is relative to the repository root (`repo-rules/prevent-overengineering.md`, ...). [SOURCE: REPO RULES.md:40-52,60-72] [SOURCE: `rg -o "repo-rules/[a-z-]+\.md"` count = 26]

2. The intended change is all 26 links to the canonical `.skilled/repo-rules/<rule>.md`. The farm keeps the root path resolving either way, so this change is a REQ-002 "every live reference names the canonical path" obligation, not a resolution fix. [SOURCE: ../spec.md:109 §3 Files to Change; REQ-002 at ../spec.md:129]

### B. `AGENTS.md` — 9 live link instances on 5 lines

3. `AGENTS.md` carries 9 `repo-rules/<rule>.md` link instances across 5 lines: line 28 (`scope-discipline.md`), line 116 (`blast-radius.md`), line 144 (`prevent-overengineering.md`), line 209 (`blast-radius.md`), and line 261, which carries five links in one sentence (`communication.md`, `communication-prose.md`, `communication-decisions.md`, `communication-handoff.md`, `answer-the-actual-request.md`). [SOURCE: AGENTS.md:28,116,144,209,261]

4. The packet spec counts "`AGENTS.md` (5)" and the phase's task brief repeats "AGENTS.md's five links", while the measured file carries 9 link instances. The "5" most plausibly counts link *sites/lines* (or the five-link §8 sentence), not instances; this is INFERRED, since neither the spec nor the corpus defines the counting rule. The implementation must re-point all 9 instances regardless. [SOURCE: ../spec.md:109] [SOURCE: AGENTS.md:261]

### C. The 13 rule-body backlinks

5. All 13 rule bodies carry exactly one `../REPO%20RULES.md` backlink each: `evidence-and-proof.md:32`, `uncertainty-and-honesty.md:28`, `communication-decisions.md:35`, `communication.md:37`, `prevent-overengineering.md:32`, `scope-discipline.md:30`, `communication-prose.md:25`, `root-cause-and-debugging.md:29`, `communication-handoff.md:41`, `skill-hub-routing.md:29`, `answer-the-actual-request.md:30`, `blast-radius.md:28`, `delegation-and-orchestration.md:32`. [SOURCE: rg over repo-rules/ for `REPO%20RULES`]

6. When a body lands at `.skilled/repo-rules/<rule>.md`, `../REPO%20RULES.md` resolves to `.skilled/REPO RULES.md`, which does not exist; the backlink must become `../../REPO%20RULES.md`. [SOURCE: path arithmetic from the farm target shape `repo-rules/<rule>.md -> ../.skilled/repo-rules/<rule>.md`, ../spec.md:84-85]

7. The checker resolves each body link relative to the *rules directory* (`path.resolve(context.root, RULES_DIR, target)`, check 7), not relative to the file; after the move the resolution base becomes the resolved canonical directory, so `../../REPO%20RULES.md` resolves correctly in this repository, while a legacy-layout repository (`repo-rules/` only) keeps `../REPO%20RULES.md`. This is the layout-aware resolution the migration needs. [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:327-328]

### D. The corpus checker

8. `check-repo-rules.cjs` hardcodes the layout in four places: `RULES_DIR = 'repo-rules'` (line 26); `findRepoRoot` requires both `REPO RULES.md` and `repo-rules/` before ascending (lines 46-48); `loadContext` reads `path.join(root, RULES_DIR)` (lines 182, 186); and the error path names only the hardcoded expectation (line 412). REQ-003 requires the checker to pass both in this repository and in a checkout with only `repo-rules/` and no `.skilled/` tree. [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:26,46-48,182-186,412] [SOURCE: ../spec.md:130 (REQ-003)]

9. Router-row identification is a string-prefix test: `checkWiring` counts a link as a rule row when `target.startsWith(`${RULES_DIR}/`)` (line 233), and `checkIndexSummaries` finds the rule link the same way (line 377). Once router rows name `.skilled/repo-rules/...`, that prefix no longer matches `RULES_DIR = 'repo-rules'`; the fix is to resolve each row link against the repository root and classify it by whether it lands inside the detected rules directory ("router rows by link target"), which also satisfies the spec edge case that a row resolving inside another directory is not a router row. [SOURCE: check-repo-rules.cjs:233,377] [SOURCE: ../spec.md:194]

10. The nine checks are `count parity`, `row coverage`, `phrase uniqueness`, `line ceiling`, `frontmatter keys`, `divider parity`, `rule links`, `fires-when sections`, `index summaries` (lines 397-407); output is `RESULT: PASSED (9/9 checks)` (line 426). The migration keeps the check set; only the directory probe, row classification and body-link base are layout-aware. [SOURCE: check-repo-rules.cjs:397-407,426]

11. The checker is currently red at HEAD on divider parity: `answer-the-actual-request.md` carries 3 dividers against 8 numbered sections, so `FAILED (8/9)` is the pre-move baseline; the packet fixes the defect in its own commit. [SOURCE: ../spec.md:69-70,90,149-150]

### E. sk-create-repo-rule skill, playbook, command, agents, generator

12. The skill surface names `repo-rules/` in: `SKILL.md:170` (checker invocation — already canonical `.skilled/...` script path), `README.md:26,86,177,178,179` (usage line, structural-invariant awk recipes, router-parity awk, phrase-collision grep), `references/rule-anatomy.md:17,22`, `references/creation-standards.md:75`, and `references/agents-md-integration.md:134,141,156,158,161,174`. [SOURCE: rg hits listed]

13. `references/agents-md-integration.md` documents the *sibling-repository* sharing shape — a relative symlink in the sibling's `repo-rules/` pointing at `../../Code_Environment/Public/repo-rules/<rule>.md` plus a `.gitignore` entry. That surface describes external consumers of the farm, so it should keep the root farm path for siblings while this repository's own references go canonical; the spec lists the skill docs under "canonical path" without carving out this file, so the boundary is a judgment call flagged for the implementation. INFERRED that the sibling-shape lines stay as-is; they are the documented external contract. [SOURCE: references/agents-md-integration.md:141,156-161,174] [SOURCE: ../spec.md:111]

14. The manual-testing-playbook carries live `repo-rules/` paths in `manual-testing-playbook.md:34`, `rule-decision/{always-loaded-refusal,existing-owner-refusal,no-observed-failure-refusal,routing-refusal}.md` (lines 32,46,52-53,61,65), `lifecycle-and-wiring/{router-bootstrap,rule-retirement}.md` (48,52-55,59,96), and `rule-authoring/{full-rule-authoring,standards-gate-rejection,trigger-phrase-collision}.md` (22,34,46-56,76,78). These are runnable commands and expected-signal text, so they change with the canonical path. [SOURCE: rg hits listed]

15. The `/create:repo-rule` command surface: `.skilled/commands/create/repo-rule.md:2,13`; `assets/create-repo-rule-auto.yaml:31,103,113,114,131,136,172,188,222,239`; `assets/create-repo-rule-confirm.yaml:44,116,126,127,144,149,187,205,241,258`; `assets/create-repo-rule-presentation.txt:103,108`; `.skilled/commands/README.txt:149`; `.skilled/commands/create/README.txt:57`. The `rules_dir: repo-rules/` bindings (auto:113, confirm:126) and the presentation output strings (`PATH=repo-rules/{name}.md`, auto/confirm `validation:` lines) are the load-bearing ones: they must become layout-aware so the command writes to the canonical corpus in this repository while still creating `repo-rules/` in a repository that has no `.skilled/`. [SOURCE: rg hits listed] [SOURCE: ../spec.md:112]

16. The two authored agent files name the corpus exactly once each: `.skilled/agents/orchestrate.md:850` (`repo-rules/delegation-and-orchestration.md`) and `.skilled/agents/markdown.md:203` (`/create:repo-rule` row: "Repo rule under `repo-rules/`..."). Both change to the canonical path; their runtime mirrors are regenerated through their owners (Q2). [SOURCE: .skilled/agents/orchestrate.md:850] [SOURCE: .skilled/agents/markdown.md:203] [SOURCE: ../spec.md:113]

17. The sk-communication benchmark generator reads the corpus on two lanes: the working-tree "after" lane walks `path.join(repoRoot, "repo-rules")` (line 69) and labels sections `repo-rules/${rel}` (line 127), while the "before" lane reads the rule-set commit via `git ls-tree ... -- repo-rules/` (lines 108-113). The spec's change is "canonical working-tree lane, historical before-lane": line 69's walk target becomes `.skilled/repo-rules`, and the before-lane stays on the historical `repo-rules/` commit path. `cases.json:18,27,54` mention `repo-rules/` only inside operator prompt text (a `check-repo-rules.cjs` review request and a "list every rule file under repo-rules/" prompt), which reads as benchmark input data rather than a live path; INFERRED that cases.json stays unless the harness requires prompt consistency. [SOURCE: generate-prompts.mjs:69,108-109,113,127] [SOURCE: .skilled/skills/sk-communication/benchmark/reply-harness/cases.json:18,27,54] [SOURCE: ../spec.md:116]

18. No-change surfaces confirmed against spec §3 Out of Scope: the hub registries' keyword lists (`sk-doc/hub-router.json:372`, `sk-doc/mode-registry.json:515`, `sk-doc/ROUTER.md:161`), the `leaf-manifest.json:144` asset filename, the `repo-rules-router-template.md` asset (`:75,83`), `graph-metadata.json:319`, and the token-cost baseline (`manual-testing-playbook/token-cost-baseline/max-load.md:116,294`) keep their historical or portable meaning. Changelogs are frozen (`sk-create-with-human-voice/changelog/v1.1.0.0.md:30` stays byte-identical). [SOURCE: ../spec.md:98-101]

### F. What breaks if the move happens without re-pointing

19. Three concrete breakages, distinct from cosmetic path freshness: (a) all 13 body backlinks resolve to a nonexistent `.skilled/REPO RULES.md` once bodies move, so checker check 7 fails unless both the links and the resolution base change; (b) the CI path filter `repo-rules/**` (`.github/workflows/repo-rules-corpus.yml:7,14`) stops firing on corpus edits made under `.skilled/repo-rules/**`, so the gate goes silently stale; (c) the checker's prefix test (line 233) stops recognizing canonical router rows and would report every rule as "no trigger row / no index row". The farm itself keeps the 26 router links and the 9 AGENTS.md links resolving, so those break only against REQ-002, not at read time. [SOURCE: check-repo-rules.cjs:233,327-328] [SOURCE: repo-rules-corpus.yml:7,14] [SOURCE: path arithmetic on `../spec.md:84-85`]

## Questions Answered

- Q1: the census is complete for the enumerated surfaces — 26 router links, 9 AGENTS.md instances on 5 lines, 13 body backlinks, the checker's 4 layout couplings and 9 checks, the skill/README/references/playbook lines, the command and its three assets, the two agent files, and the benchmark generator's two lanes.
- Q1a: 26 = 13 trigger rows (40-52) + 13 index rows (60-72).
- Q1b: 13/13 bodies carry exactly one backlink; all must gain one `../` level.
- Q1c: 5 lines / 9 instances; the spec's "5" is most plausibly a line count.

## Questions Remaining

- Q2: mirror generation ownership, CI/gate-input keying, byte-identical regeneration.
- Q3: sibling-repository link targets and the checker's probe-order design.
- The exact treatment of `references/agents-md-integration.md` and `cases.json` (canonical vs. portable) is flagged for the implementation as a judgment call, not fully settled by the spec's wording.

## Ruled Out

- Treating the 26 router links and the 9 `AGENTS.md` links as breakage: the farm keeps both resolving, so they are REQ-002 consistency changes, not resolution fixes.
- Counting `AGENTS.md` as 5 total links: measured 9 instances; the spec number counts something else.
- Changing the hub registries' keyword lists, the leaf-manifest filename, or the router-template asset: all are spec-declared portable/historical surfaces that stay.
