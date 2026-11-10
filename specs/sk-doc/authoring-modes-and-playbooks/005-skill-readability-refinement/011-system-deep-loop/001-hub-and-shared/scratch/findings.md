### .skilled/skills/system-deep-loop/README.md

- [P2] .skilled/skills/system-deep-loop/README.md:31 | 1 | OVERVIEW opens with `### Why This Skill Exists` (31-33) before `### What It Does` (35-37); the skill README template says OVERVIEW starts with What It Does and takes its optional subsections after it. | Move lines 31-34 (heading, paragraph, trailing blank) to after line 37.
- [P2] .skilled/skills/system-deep-loop/README.md:77 | 8 | The Layout table (77-85) names neither `runtime/` nor `hub-router.json`, although line 99 points the reader to "Layout above" for `runtime/` and §2 calls `hub-router.json` the authored stage-one router. | Insert two rows after line 82: one keyed `hub-router.json` reading `Stage one's authored signals, vocabulary classes and tie-break order.`, and one keyed `runtime/` reading `The frozen, MCP-free backend layer every mode consumes: executor config, prompt-pack rendering, validation, atomic state, coverage graph and scoring.`
- [P2] .skilled/skills/system-deep-loop/README.md:103 | 10 | §6 RELATED DOCUMENTS is followed by §7 ADDING A WORKFLOW MODE, so the related-resources section is not last. | Swap the two section bodies (103-110 with 114-124), keep the `---` dividers at 101 and 112, and renumber: ADDING A WORKFLOW MODE becomes §6 and RELATED DOCUMENTS §7. The SKILL.md bullet then sits near line 110, so the inbound locator at README.md:121 must move with it.
- [P2] .skilled/skills/system-deep-loop/README.md:116 | 8 | The checklist claims it touches every surface a new mode needs but omits `leaf-manifest.json` (parent-skill-check 10b, 10c and 10d) and `description.json` (5k-packet keyword parity), both of which fail on a mode added without them. | Add after line 118: a `leaf-manifest.json` item that regenerates the manifest so the new leaves resolve to canonical `(workflowMode, leafResourceId)` pairs, and a `description.json` item that adds the new packet name as a description keyword.
- [P1] .skilled/skills/system-deep-loop/README.md:119 | 1 | The checklist tells the reader to add leaf files to `LOADING_LEVELS` in the hub `ROUTER.md`, but that file declares only `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP`; no `LOADING_LEVELS` block exists in the hub. | Replace "`RESOURCE_MAP` and `LOADING_LEVELS`" with "`RESOURCE_MAP`".

### .skilled/skills/system-deep-loop/ROUTER.md

- [P2] .skilled/skills/system-deep-loop/ROUTER.md:130 | 6 | The allowed-tools note (130-137) is wedged between the stage-two surface-router description (111-128) and the three-tier discriminator (139) plus routing rule (144), so a reader following the routing contract meets an unrelated frontmatter aside first. | Move lines 130-138 to the end of the file, after line 179.
- [P2] .skilled/skills/system-deep-loop/ROUTER.md:165 | 7 | Lines 165-179 render as one paragraph that packs the path guard, the fallback contract, the classification precedence and the per-mode invariants into 15 unbroken sentences. | Split into four bullets, sentences verbatim: 165-167 guard, 168-169 fallback, 171-174 classification, 176-179 per-mode invariants.

### .skilled/skills/system-deep-loop/SKILL.md

- [P2] .skilled/skills/system-deep-loop/SKILL.md:90 | 7 | The Backend paragraph (90-96) switches subject at line 92 from `runtime/` to `score-fanout-pairs.cjs` and then runs five separate behaviors of that script together. | Split at line 92 into two paragraphs, and turn lines 92-96 into five bullets with the sentences unchanged.

### .skilled/skills/system-deep-loop/shared/behavior-benchmark/README.md

- [P2] .skilled/skills/system-deep-loop/shared/behavior-benchmark/README.md:40 | 1 | The TESTS command block has no expected output, so a reader cannot tell a pass from a failure; the README template requires an expected result for every verification command. | Change line 44 to: "Runs hermetically against a fake executor leg. No live model session required. Expected: `behavior-bench-run.test.cjs: all assertions passed`. See `tests/README.md`."

### .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md

- [P1] .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:18 | 4 | The file has no H1, no intro and no OVERVIEW: it opens at `## PURPOSE`, and `JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py <file> --json` returns `valid:false` with a blocking `missing_required_section: overview`, both under auto-detect and under `--type reference`. | Insert before line 18: `# Deep-Loop Behavior Benchmark Framework`, the hook `Open this file before authoring a scenario, scoring a run or calibrating a benchmark round.`, then `---`. Replace `## PURPOSE` with `## 1. OVERVIEW` and put `### Purpose` above line 20. Insert `### When to Use` after line 27 with three bullets: authoring or reviewing a scenario contract, scoring a captured run against D1-D5 and assigning its terminal bucket, and calibrating budgets, watchdogs, reruns or fixture isolation. Put `### Boundaries` above line 29 so the charter table sits under it.
- [P2] .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:18 | 10 | No H2 carries an integer number, so the contract has no section addresses; the reference template requires integer-numbered content sections. | After the overview insert, number the H2s in this final order: 1 OVERVIEW, 2 SCENARIO CONTRACT SCHEMA, 3 DELEGATION EVIDENCE KINDS, 4 SCORING RUBRIC, 5 CLASSIFICATION TAXONOMY, 6 BUDGET POLICY, 7 RERUN POLICY, 8 POSTCONDITION PROBES, 9 FIXTURE ISOLATION, 10 PACKAGE CONVENTIONS, 11 RUNNER.
- [P2] .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:51 | 1 | `## SCHEMA VERSIONING` is an H2 peer of `## SCENARIO CONTRACT SCHEMA`, so the four H3s at 65-110 (machine-contract fields, entry-surface codes, clarity codes, human body) read as part of schema versioning rather than the scenario contract. | Change line 51 to `### Schema versioning`, leaving it and those H3s under `## 2. SCENARIO CONTRACT SCHEMA`.
- [P1] .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:244 | 5 | DELEGATION EVIDENCE KINDS decides how D3 is measured, but it sits 108 lines after D3 (136), so a scorer reads D3's task-event test as universal and flags every correct in-CLI council run as role absorption, the exact failure this section names at 255-259. | Move lines 244-260 to before the `---` at line 112, inserting a `---` and a blank line above the moved heading so the section is delimited like its peers.

### .skilled/skills/system-deep-loop/shared/progress/README.md

- clean

### .skilled/skills/system-deep-loop/shared/rollout/README.md

- [P2] .skilled/skills/system-deep-loop/shared/rollout/README.md:18 | 8 | The contents list (18-20) and the tests sentence (22) never name `validate-rollout.cjs`, the gate `promotion-rule.md` tells the reader to run. | Add after line 20: "- `validate-rollout.cjs` rejects any `fix` entry that is missing required evidence, and is the script to run before promotion."
- [P2] .skilled/skills/system-deep-loop/shared/rollout/README.md:26 | 9 | The H2 title "DEFERRED TODOS" is a progress token. | Replace line 26 with "## 2. DEFERRED SCOPE" and keep the two bullets verbatim, including the instruction not to stub fake capture or a synthetic comparator.

### .skilled/skills/system-deep-loop/shared/rollout/promotion-rule.md

- [P1] .skilled/skills/system-deep-loop/shared/rollout/promotion-rule.md:9 | 1 | The file has no H2 at all, so it has no OVERVIEW and no numbered sections; `validate_document.py` returns `valid:false` with a blocking `missing_required_section: overview`. | Insert after line 7: the hook `Read this before flipping a command to fix, and again when a fix entry is challenged.`, then `---`, `## 1. OVERVIEW`, `### Purpose` with "A command flips from `fallback` to `fix` only on green promotion evidence, and its JSON entry carries that evidence.", and `### When to Use` with two bullets (promoting a command from fallback to fix, checking an existing fix entry before it ships). Then add `## 2. PROMOTION EVIDENCE` before line 9, `## 3. EVIDENCE MECHANISM` before line 16 and `## 4. VALIDATION` before line 30.

### .skilled/skills/system-deep-loop/shared/synthesis/README.md

- clean

