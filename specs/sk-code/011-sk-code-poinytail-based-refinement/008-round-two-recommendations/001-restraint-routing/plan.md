---
title: "Implementation Plan: Phase 1: restraint-routing"
description: "Adds a restraint vocabulary class to the sk-code quality mode, one canary case with a re-minted manifest, and check 5k in the doctor's parent-skill check. Check 5k compares the registry aliases, description keywords and canary routes with the router vocabulary, fails on sk-code, and warns on the drift other hubs already carry."
trigger_phrases:
  - "restraint routing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: restraint-routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON hub data, Node.js CommonJS (`parent-skill-check.cjs`), Markdown, and Bash |
| **Framework** | None. Node built-ins `fs`, `path` and `child_process`, and `node:test` |
| **Storage** | None |
| **Testing** | `node --test` on the invariants suite, the compiled-route CLIs, the canary assertion in `scratch/canary-assert.cjs`, `run-all-drift-guards.sh`, and the advisor vitest suite for the checker |

### Overview
Stage two of the sk-code router has no restraint vocabulary. The fix adds one vocabulary class, attaches it to the quality signal, names the same words in the registry, the description and ROUTER.md, and adds one single-mode canary case. The compiled manifest is then re-minted, and check 5k in the doctor compares the lexical surfaces with each other.

Stakes read: low blast and reversible. Every edited file is tracked, so `git restore` returns the tree. The one generated file is the manifest, and the refresh command rebuilds it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place edits to hub data, one checker function with its tests, one fixture case, and a re-minted manifest.

### Key Components
- **`quality-restraint` class** (`hub-router.json`, `vocabularyClasses`): the eleven keywords the fix names, plus `over-engineering check`. The last keyword is required because leg (a) checks the alias of that name against the classes, and the fix names the alias without listing it as a keyword.
- **Quality signal** (`hub-router.json`, `routerSignals["sk-code-quality"].classes`): gains the class. This entry is the only link between the vocabulary and the mode.
- **Quality aliases** (`mode-registry.json`, the `sk-code-quality` mode): gains three aliases. They stay lowercase and unique across modes.
- **Description keywords** (`description.json`): gains four keywords. The file is the hub's advisor identity, as the comment on check 2b states. The recorded `source_docs` of the sk-code graph do not list it, so the keywords may not reach the advisor (see section 6).
- **Section 2 row** (`ROUTER.md`, the CODE_QUALITY row at line 58): gains the restraint and simplification words. Section 11 is a separate machine-readable block and stays unchanged.
- **Canary case** (`canary-cases.v1.json`): one single-mode case modeled on `single-quality`, with the authored copy kept byte-identical.
- **Check 5k** (`parent-skill-check.cjs`): three legs run from `main()` after `checkDescription`, which sets `ctx.description`.
  - Leg (a), `5k-alias`: each alias of a mode must appear, case-folded, among the keywords of the classes its routerSignal references.
  - Leg (b), `5k-packet`: each mode's packet name must appear among the description keywords, case-folded.
  - Leg (c), `5k-canary`: each routerSignals mode must be the expected route (`expectedAction` `route` and the mode in `expectedModes`) of at least one case in the hub's canary fixture.
- **Warn-only table** (`VOCABULARY_PARITY_WARN_ONLY`): maps hub names to the legs that warn instead of fail. Section 3 below lists its contents.

### Data Flow
Stage one is the advisor, which picks a hub from the graph built from the hub's source documents. Stage two is `compiled-route.cjs`, which reads the compiled policy and manifest and turns a prompt into a mode. This fix changes stage two (hub-router, registry, fixture, manifest) and the stage-one identity file (description.json). Check 5k reads the hub files directly and reports drift between them. It never reads the compiled tree except for leg (c).

### Canary fixture locator
Every hub that has `hub-router.json` also has a canary fixture at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/<NNN>-<hub>/fixtures/canary-cases.v1.json`. Leg (c) finds the directory by matching `^\d+-<hub basename>$`, so leg (c) is built, not deferred. A hub with no fixture reports INFO and skips the leg. The planning probe found the fixture for all seven hubs, and every leg (c) passes on all seven today.

### Warn-only drift (parent goal D4)

Check 5k fails on drift on every hub except the hub and leg pairs in `VOCABULARY_PARITY_WARN_ONLY`. Those pairs warn. `softFail` carries the failure, so it is a FAIL under the default canon setting, and a WARN under `PARENT_HUB_CHECK_STRICT=0`, the same as checks 5a to 5j. The warn path calls `warn()` directly.

The planning probe ran the three legs against the current tree on 2026-10-10. Only these items drift today, and each one warns:

| Hub | Leg | Count | Drift items |
|-----|-----|-------|-------------|
| `mcp-tooling` | alias | 4 | mcp-mobbin `screen examples`; mcp-obsidian `health`, `health-md`; mcp-notion `notion search` |
| `sk-design` | alias | 12 | sk-design-fundamentals `design fundamentals`, `what padding should this have`, `spacing scale`, `contrast ratio`, `colour decision`, `color decision`, `visual hierarchy`; sk-design-md-generator `extract design tokens`, `measure a surface`, `extract css`, `design tokens from a site`, `style guide from a url` |
| `sk-design` | packet | 2 | `sk-design-fundamentals` and `sk-design-md-generator` are missing from description keywords |
| `sk-doc` | alias | 3 | sk-create-manual-testing-playbook `release readiness`; sk-create-repo-rule `repo rule`, `add a rule` |
| `system-deep-loop` | alias | 4 | model-benchmark `model benchmark`, `benchmark a model`, `prompt framework benchmark`, `benchmark-harness` |

The table is the warn-only list: `{ 'mcp-tooling': ['alias'], 'sk-design': ['alias', 'packet'], 'sk-doc': ['alias'], 'system-deep-loop': ['alias'] }`. `sk-code`, `cli-classifier` and `cli-external-orchestration` drift nothing, so no entry is needed for them.

The warn is per leg, as the brief specifies. A new alias on one of these hubs under a listed leg therefore warns too. The trade-off is that the table could list single items instead, which would fail any new drift on those hubs. Section 7 of spec.md raises that choice for the orchestrator.

The test for the warn path uses `buildHub('sk-design')`. That hub also has a real canary fixture, so the canary leg fails on the demo modes in that test, and the test asserts on the alias line alone and not on the exit status.

---

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Setup**: record the before state of every check, and read the contracts named in T012 before the first edit.
- **Implementation**: edit the four hub files, the canary fixture and its copy, the checker and its tests. Re-mint the manifest only after every sk-code edit is in place, then copy it to its authored file.
- **Verification**: one task per requirement and success criterion, each with its command and its expected output.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Route**: `compiled-route.cjs --hub sk-code` on the canary prompt, read through `jq`. Expected `true`, exit 0. The before state is `defer`.
- **Canary**: `scratch/canary-assert.cjs`, which is the read-only assertion from `002-surface-contract-alignment/plan.md` section 5, with its require path anchored at the working directory. Expected `cases 11 failures 0`. The before state is `cases 10 failures 0`.
- **Checker**: the invariants suite gains one FAILING_CASES row for each of `5k-alias` and `5k-packet`, and two tests, one for `5k-canary` on a hub named `sk-code` and one for the warn-only severity on `sk-design`. Every existing invariant keeps passing. The before state is 91 of 91 passing.
- **Checker on sk-code**: `parent-skill-check.cjs .skilled/skills/sk-code` must print the three PASS lines for 5k, and `OK: parent-skill-check`.
- **Every hub**: the seven parent-skill checks must exit 0. The planning probe expected these warning counts after the change: sk-design 16 (2 before and 14 new), sk-doc 19 (16 before and 3 new), mcp-tooling 4, system-deep-loop 4, and 0 on the other three hubs. Any other count is a finding to report.
- **Drift guards**: `run-all-drift-guards.sh` prints `run-all-drift-guards: all 3 guards PASSED`. The planning run passed, so the earlier red baseline in 002 no longer applies.
- **Advisor vitest**: `parent-skill-check-fixtures.vitest.ts` uses sk-doc as its golden hub. sk-doc gains three alias warnings, which must not fail that golden. Expected `Tests 7 passed (7)`.
- **Stage-one probe**: the advisor output for the yagni prompt, before and after. The planner measured no hub at threshold 0.8 for that prompt. The sentence `Simplify this code, it is bloated and over-engineered` already reaches sk-code at 0.82.
- **Out-of-domain replay**: each new alias is run through `compiled-route.cjs` against a non-code phrase, as `.skilled/repo-rules/skill-hub-routing.md` section 4 requires. Any route is reported as a finding.
- **Doc validator**: `validate_document.py` on ROUTER.md before and after. The planning run returned exit 0 with one `document_type_fallback` warning.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Contracts**: the sk-code SKILL.md version authority (line 17) governs the hub JSON files and the checker, and the sk-doc SKILL.md governs ROUTER.md. Read both before the first edit (tasks.md T012). `skill-hub-routing.md` and `prevent-overengineering.md` are already loaded.
- **Version and changelog**: no bump and no changelog entry. The four hub-root artifacts must carry the version in SKILL.md (check 13a), and this child may not edit SKILL.md. The 002 and 004 phases bumped nothing either. The orchestrator owns any release.
- **Sibling children**: other children of 008 may edit files under the sk-code tree in parallel. Any sk-code byte change after the re-mint stales the manifest, so the guard in tasks.md T035 must run last.
- **Stage one**: the sk-code graph-metadata.json lists `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, the stack and phase references, and `ROUTER.md` as source documents, but not `description.json`. The keywords may therefore not change the advisor's answer. The fix does not regenerate the graph, and the stage-one probe records the result.
- **Leaf manifest**: `leaf-manifest.json` has no alias field (a grep count of zero), so the alias edits do not change its generated bytes.
- **Serving closure**: `serving-closure.manifest.json` lists file paths with no content hashes, so editing the canary fixture does not stale it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The edits are all tracked files, so the rollback is one restore. Restore the ten paths together, so the manifest and the hub files stay in step:

`git restore --source=HEAD -- .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/description.json .skilled/skills/sk-code/ROUTER.md .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`

No untracked file is created outside this folder, so nothing else needs removing. The folder's own scratch files stay as the record.

Nothing is committed or pushed by this phase. The operator's yes is needed before any commit.
<!-- /ANCHOR:rollback -->

---
