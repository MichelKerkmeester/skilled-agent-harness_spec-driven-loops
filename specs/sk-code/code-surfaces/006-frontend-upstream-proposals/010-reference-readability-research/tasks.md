---
title: "Tasks: Phase 10: reference-readability-research"
description: "Record the baseline, land ten render checks as warnings, fix the sk-create-skill templates and guidance, clear the sk-code findings by script and four DeepSeek builds, promote render findings under package_skill.py --strict past a ledger, then rerun every gate."
trigger_phrases:
  - "reference readability research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: reference-readability-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is this phase's `scratch/`. `K` is `.skilled/skills/sk-code`. `D` is `.skilled/skills/sk-doc`. `C` is `.skilled/skills/sk-doc/sk-create-skill`. Finding ids (`HUB-1`, `TPL-2`, `VAL-3`) are the rows of `research/research.md`.

**Executors**: *script* is a Python script in `S/` that this session writes and runs. *build* is a DeepSeek V4.1 Flash max run through `opencode run -m opencode-go/deepseek-v4.1-flash#max --format json --dir <repo root> "<brief>" </dev/null` with `AI_SESSION_CHILD=1`. Its brief lives in `S/` and lists the allowed write paths. This session reads every build diff before the next task starts.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the two scratch gates (`S/render-gate.py`, `S/check-anchors.py`). `render-gate.py` runs `validate_document.py --json` on every tracked `.md` under `K` and `C` (skipping `manual-testing-playbook/`, `changelog/`, `benchmark/` and `feature-catalog/`), prints each hit, and ends `render_warnings=<n> invalid=<n>`. With `--fleet` it covers every skill and writes `S/fleet-render.json`. `check-anchors.py` is phase 009's `check-links.py` with its target set widened to `K` and `C`. Executor: script. Verify: `python3 S/check-anchors.py .` prints `broken=0`, and `python3 S/render-gate.py` prints `render_warnings=0 invalid=0`: no render check exists yet, and all 181 files are `valid: true` at HEAD.
- [x] T002 Record the baseline (`S/baseline.txt`). Capture: the full `bash D/scripts/tests/run-script-tests.sh` PASS and FAIL lines; `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`; `python3 D/scripts/package_skill.py <dir> --check --strict` for `K`, its five packets, `C` and `.skilled/skills/mcp-code-mode`; `bash K/sk-code-skilled/scripts/run-all-drift-guards.sh` and its exit code; `node --test .skilled/bin/tests/compiled-route-*.test.cjs`; `node --test K/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs`; `validate-playbook-package.cjs --package` for the `K`, `sk-code-review`, `sk-code-quality` and `sk-code-frontend` playbooks; the frontend rule ids from `rg -o '^### [A-Z]{1,4}[0-9]+\.' K/sk-code-frontend/references`; and the `valid: true` count from `python3 S/render-gate.py --fleet` over all 712 fleet docs. Executor: this session. Verify: the file holds one line per check, the link guard line reads `0 broken`, and there are 65 rule ids.
- [x] T003 Extract the known-bad controls (`S/fixtures/`): `web-cascade-and-selectors.md`, `web-markup-and-css.md` and `web-performance-and-loading.md`, each from `git show cd00629166:K/sk-code-frontend/references/<file>`. Executor: this session. Verify: `sed -n 19p S/fixtures/web-cascade-and-selectors.md` prints `## 1. OVERVIEW AND CASCADE AND SPECIFICITY`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Track B first: the checks that prove every fix

- [x] T010 Add the ten render checks as warnings (`D/shared/scripts/validate_document.py`, `D/shared/assets/template-rules.json`, new `D/scripts/tests/test_render_checks.py`, new fixtures under `D/scripts/tests/render/`). Add `render_bold_label_join`, `render_setext_underline`, `render_bare_url`, `render_overview_heading`, `render_overview_orientation`, `render_repeated_sentence`, `render_repeated_label`, `render_h2_numbering`, `render_section_order` and `render_intro_restates_purpose`, each defined as in research Section 5. Every check is fence-aware through `_fenced_line_numbers` and skips frontmatter. Each runs after `validate_general_structure` when the type's `renderChecks` is true (set it on reference, asset, skill and skill_router), and each finding is `severity: warning`. `render_section_order` also reads `firstSectionName` and `lastSectionPattern` for those four types, and adds `lastSectionPattern: "related"` to reference, asset and skill. The keys on `readme` and `security_policy` stay unread (research Section 8). A section matching the pattern must be the last H2, a trailing MACHINE ROUTER excepted. In a skill_router, a related section sits directly before MACHINE ROUTER. Fixtures: the three `S/fixtures` files as positives; negatives for list-item labels, a URL in a fence, in inline code and in `<...>`, `[Placeholder]` labels, two features sharing one browser triple (the HEAD `web-cascade-and-selectors.md:78` shape), `---` under a heading, a list item or a table row, and a router whose related section precedes MACHINE ROUTER. Covers VAL-1 to VAL-6. Executor: build (`S/brief-validator.md`). Verify: `ONLY_TESTS=test_render_checks.py bash D/scripts/tests/run-script-tests.sh` prints `PASS test_render_checks.py`; the full suite matches T002; `JEV_FEATURES=0 python3 -B D/scripts/validate_document.py S/fixtures/web-cascade-and-selectors.md --type reference --json` prints `"valid": true` with warnings of exactly the bold-label, bare-URL, overview-heading, overview-orientation and repeated-label types; `python3 S/render-gate.py` lists the sk-code and sk-create-skill hits in research Section 6 and no others; `python3 S/render-gate.py --fleet` leaves the T002 `valid: true` count unchanged.

### Track B: templates and guidance

- [x] T011 [P] Fix the reference and asset templates (`C/assets/skill/skill-reference-template.md`, `C/assets/skill/skill-asset-template.md`). Remove the §1 `### When to Create References` block (36-50) and keep §3 (TPL-4). Add a reference body skeleton to §2: the intro hook, `---`, then `## 1. OVERVIEW` with Purpose and When to Use first, followed by any Core Principle, Boundaries and Key Sources in that order. Content sections use integer numbers. Rule fields are `- **Label:** text` bullets, links are `[title](url)`, every `---` has a blank line above it, and a related section, when present, comes last (TPL-3). Make the Core Principle format example (236-243) follow that order. Rewrite both GOOD intro examples so the hook and the Purpose say different things (reference 94 and 101, asset 182 and 188; TPL-5). Turn the joined labels at asset 807-809, 822-824 and 838-840 into bullets (TPL-2). Executor: build (`S/brief-templates-a.md`). Verify: `python3 S/render-gate.py` shows no hit in either file; `rg -c '^### When to Create References' C/assets/skill/skill-reference-template.md` prints nothing.
- [x] T012 [P] Fix the skill, router and hub templates and the hub scaffold (`C/assets/skill/skill-md-template.md`, `C/assets/skill/skill-router-template.md`, `C/assets/parent-skill/parent-skill-hub-template.md`, `C/assets/parent-skill/scaffold/hub-skill-scaffold.md`). Fence the example frontmatter at 134-139 (TPL-1). Turn 857-858 into bullets (TPL-2). At 65, say numbered H2s use integers only and never a letter suffix (TPL-9; `package_skill.py:841` stays, because T010 and T030 catch the suffix). Change the router OVERVIEW prompt at 23 to name signal and resource families, and to leave exact keywords, paths and the default resource to INTENT MODEL (TPL-10). Add the surface packet section order to the hub template: 1 WHEN THE HUB BUNDLES THIS, 2 REFERENCE MAP, 3 SMART ROUTING, 4 SURFACE STANDARDS, then packet sections (TPL-8). Swap the scaffold's §6 RELATED RESOURCES and §7 INTEGRATION POINTS (TPL-6). Executor: build (`S/brief-templates-b.md`). Verify: `python3 S/render-gate.py` shows no hit in these files; `ONLY_TESTS="test_create_skill_contract.py test_routing_shape.py test_surface_packet_sections.py" bash D/scripts/tests/run-script-tests.sh` prints three PASS lines; `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` reports `fail 0`.
- [x] T013 [P] Fix the sk-create-skill references and guidance (`C/references/parent-skill/compiled-routing-architecture.md`, `C/references/parent-skill/parent-skills-nested-packets.md`, `C/references/shared/skill-root-metadata-contract.md`, `C/references/skill/creation-workflow.md`, `C/references/shared/validation-and-packaging.md`). The two compound headings at 21 become `## 1. OVERVIEW`, and their topic moves into an H3 (TPL-7). The heading behind `#why-the-leaf-router-stays-in-routermd` stays, because four hub routers link it. Swap the metadata contract's §7 RELATED RESOURCES and §8 AUTHORING NOTES (TPL-6). Beside the completion gate (`creation-workflow.md:325-329`), add a reference and asset content review: read the file rendered; the intro and the Purpose say different things; a governing decision comes before the steps it governs; an index lists every file of the directory it indexes; no status tokens appear in the body; a paragraph that packs several mechanisms becomes a list. Point the review at the render warnings from `validate_document.py --json` (TPL-11). Name the render checks as the deterministic half of content quality at `validation-and-packaging.md:117-125`. Executor: build (`S/brief-guidance.md`). Verify: `python3 S/render-gate.py` shows no hit under `C`; `python3 S/check-anchors.py .` prints `broken=0`.

### Track A: sk-code, mechanical first

- [x] T020 Apply the mechanical sk-code fixes (`S/mech-fixes.py` over `K`).
  - FE-1: drop the repeated sentence pair at `web-performance-and-loading.md:130` and `web-layout-and-sizing.md:126`.
  - CI-1: delete `job-shape-rules.md:91` and the blank line after it.
  - SK-5: merge `overview-structure-and-naming.md:170,172` into one `**Evidence**:` line that names both paths.
  - RV-3: add a `fix-completeness-checklist.md` row to `quick-reference.md` §3, using that asset's frontmatter `description` as its Purpose.
  - QA-4: append `[Trust boundary](#8-trust-boundary) says what makes a config trusted.` to the `quality-config.md:132` bullet.
  - HUB-3, FE-3, QA-5, SK-6: reorder the OVERVIEW H3 blocks of the nine files listed under those ids to Purpose, When to Use, When Not to Use, then the rest in their current order.
  - SK-4: swap §5 and §6 of `alignment-verification-automation.md`, with their dividers and numbers.

  Executor: script. Verify: `python3 S/render-gate.py` shows no `render_repeated_sentence`, `render_repeated_label` or `render_section_order` hit in these files; the script's `git diff --word-diff=porcelain` summary lists only the named edits; every touched file stays `valid: true`.
- [x] T021 Make the surface packet routing section consistent (`S/renumber-surface.py` over `K/sk-code-ci/SKILL.md`, `K/sk-code-skilled/SKILL.md`, `K/sk-code-frontend/SKILL.md`, `K/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs`). In ci, `## 2b. SMART ROUTING` becomes `## 3.` with a `---` above it, and §3 to §4 shift to §4 to §5. In skilled, 2b becomes 3, and §3 to §5 shift to §4 to §6, and the test literal at `quality-checklist-map.test.cjs:31` becomes `## 6. QUALITY CHECKLIST MAP`. In frontend, the §5 SMART ROUTING block moves to §3, and §3 and §4 shift to §4 and §5. Covers XS-1. Executor: script. Verify: `python3 S/render-gate.py` shows no `render_h2_numbering` hit; `node --test K/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` reports `fail 0`; `package_skill.py --check --strict` prints `Skill is valid!` for the three packets.

### Track A: sk-code, authored builds (file sets are disjoint)

- [x] T022 [P] Hub and CI (`K/ROUTER.md`, `K/SKILL.md`, `K/README.md`, `K/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md`, `K/shared/references/stack-detection.md`, `K/sk-code-ci/ROUTER.md`, `K/sk-code-ci/SKILL.md`, `K/sk-code-ci/references/job-shape-rules.md`, `K/sk-code-ci/references/trigger-and-filter-rules.md`, `K/sk-code-ci/references/protected-set.md`).
  - HUB-1: hub `ROUTER.md` reads §8 MACHINE-READABLE ROUTER, §9 HOW TO READ THIS, §10 RELATED RESOURCES, §11 MACHINE ROUTER. The seven §9 citations at `ROUTER.md:49,86,452,470`, `README.md:132,143` and `restraint-prompt.md:104` become §8.
  - HUB-2: move `SKILL.md:54-60` into §3 HOW IT WORKS and keep 47-53.
  - HUB-4: add Purpose and When to Use to `stack-detection.md`, keeping `#declaring-an-external-surface` (linked from the root `README.md:1582`).
  - CI-2: both intros become hooks, and the overview keeps the inventory.
  - CI-3: the ci router OVERVIEW names signal and resource families, and the ci `SKILL.md` SMART ROUTING points to §1 instead of restating its triggers.
  - CI-4: add Purpose and When to Use before The Profile.

  Executor: build (`S/brief-hub-ci.md`). Verify: `python3 S/render-gate.py` shows no hit in these files; `rg -n '§ ?9\b|[Ss]ection 9\b' K/ROUTER.md K/README.md K/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` prints nothing (seven lines at T002); `bash K/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0; the compiled-route tests and the `K` playbook match T002; `python3 S/check-anchors.py .` prints `broken=0`.
- [x] T023 [P] Frontend and quality (`K/sk-code-frontend/references/figma-to-code.md`, `K/sk-code-quality/references/runner-contract.md`, `K/sk-code-quality/references/quality-config.md`).
  - FE-2: §5's H3 order becomes Read-Only Inputs, Figma-Side Tool Ladder, Passes by Figma Transport, Five Passes, Capture Mechanics on the Web, Verdict and Report. `## 5. THE CHECK` and every H3 text stay unchanged.
  - QA-1: `runner-contract.md` §1 becomes `## 1. OVERVIEW` with Purpose and When to Use, and the synopsis and flag tables move under `### CLI`. Sections 2 to 8 keep their numbers.
  - QA-2: split the paragraphs at 53, 113, 182 and 265 into lists without changing a claim.
  - QA-3: `quality-config.md` gets an intro hook and a Purpose and When to Use overview.

  Executor: build (`S/brief-frontend-quality.md`). Verify: `python3 S/render-gate.py` shows no hit in these files; `rg -n '^## [0-9]+\.' K/sk-code-quality/references/runner-contract.md` prints numbers 1 to 8, with §1 reading `OVERVIEW`; the frontend rule ids match T002; the frontend and quality playbooks match T002; `python3 S/check-anchors.py .` prints `broken=0`.
- [x] T024 [P] Review (`K/sk-code-review/SKILL.md`, `K/sk-code-review/references/pr-state-dedup.md`, `K/sk-code-review/assets/fix-completeness-checklist.md`, and the playbook files `manual-testing-playbook.md`, `intra-routing-recall/on-demand-tier.md`, `intra-routing-recall/pr-state.md`, `efficiency-and-restraint/review-depth-alias.md`, `efficiency-and-restraint/minimum-evidence-gate.md`, `efficiency-and-restraint/pr-state-content-hash-dedup.md`).
  - RV-1: PR-STATE EFFICIENCY GATES becomes §8 with subsections 8.1 to 8.3, RELATED RESOURCES becomes §9, and Phase 1 gains a first step pointing at §8. The 18 lines that `rg -n '§ ?9|[Ss]ection 9\.' K/sk-code-review -g '!changelog/**' | grep -v review-core` prints at the start move to §8.
  - RV-2: `pr-state-dedup.md` gets an intro and an orienting overview, and sections 2 to 8 get ALL-CAPS numbered headings with dividers.
  - RV-4: the checklist intro becomes a hook.

  Executor: build (`S/brief-review.md`). Verify: the same `rg | grep` command prints nothing; `python3 S/render-gate.py` shows no hit in these files; the sk-code-review playbook matches T002; `package_skill.py --check --strict` prints `Skill is valid!` for `sk-code-review`.
- [x] T025 [P] Skilled (`K/sk-code-skilled/SKILL.md` and the 17 references under SK-1 and SK-2).
  - SK-1: each of the 14 rust references gets a Purpose and When to Use drawn from its own sections.
  - SK-2: the TypeScript, JavaScript and shell intros become hooks.
  - SK-3: the §5 heading (numbered after T021) names one topic and carries no dash.

  Executor: build (`S/brief-skilled.md`). Verify: `rg -l 'Provides focused Rust guidance for' K/sk-code-skilled/references` prints nothing; `python3 S/render-gate.py` shows no hit in these files; `bash K/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0.

### Track B last: block new render defects

- [x] T030 Promote render findings under `--strict`, past a known-debt ledger (`C/scripts/package_skill.py`, new `C/scripts/render-known-debt.json`, `D/scripts/tests/test_package_skill_regressions.py`). `validate_skill` runs the T010 render checks over `references/` and `assets/`. Each finding becomes a warning carrying `render check`, which is added to `STRICT_PROMOTED_MARKERS`. A finding recorded in the ledger is tolerated, under the same never-raise rule `routing-shape-known-debt.json` states. Seed the ledger from `python3 S/render-gate.py --fleet` with sk-code and sk-create-skill left out. Add tests: a fixture skill with a joined label fails `--strict` with the marker, passes without `--strict`, and passes `--strict` once ledgered. Executor: build (`S/brief-strict.md`). Verify: `ONLY_TESTS=test_package_skill_regressions.py bash D/scripts/tests/run-script-tests.sh` prints `PASS test_package_skill_regressions.py`; `package_skill.py --check --strict` prints `Skill is valid!` for `K`, its five packets and `C`; the `mcp-code-mode` result matches T002; the ledger holds no key under `sk-code/` or `sk-doc/sk-create-skill/`.
- [x] T031 Write the changelog entries (`changelog/` of `K`, its five packets, `D` and `C`), each at the next version the frontmatter-versioning standard gives, with the matching `SKILL.md` versions. Executor: build (`S/brief-changelogs.md`). Verify: `validate_document.py` reports each new entry `valid: true`; after the commit, `node D/shared/scripts/frontmatter-version.mjs bump --check --base main` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run the render gate on the final tree. Verify: `python3 S/render-gate.py` prints `render_warnings=0 invalid=0`, and `python3 S/render-gate.py --fleet` leaves the T002 `valid: true` count unchanged.
- [x] T041 Run the link, anchor and id checks. Verify: `check-markdown-links.cjs` prints `0 broken`; `python3 S/check-anchors.py .` prints `broken=0`; the frontend rule ids match T002; the T022 and T024 `rg` commands print nothing.
- [x] T042 Run the suites. Verify: the full `run-script-tests.sh` matches T002 plus the two new PASS lines; the compiled-route count matches T002; `run-all-drift-guards.sh` exits 0; `quality-checklist-map.test.cjs` reports `fail 0`; the four playbooks match T002.
- [x] T043 Run strict packaging. Verify: `package_skill.py --check --strict` prints `Skill is valid!` for `K`, its five packets and `C`.
- [x] T044 Prove the controls. Verify: `validate_document.py --json` on `S/fixtures/web-cascade-and-selectors.md` returns the five render warning types research Section 5 marks "Yes", and on `S/fixtures/web-markup-and-css.md` returns `render_setext_underline`.
- [x] T045 Read each authored diff in a Markdown preview, and confirm that no rule text changed beyond the named edits. Verify: `git diff --stat` lists only files named in T010 to T031; `git diff -U0 -- .skilled | rg '^\+.*(specs/[a-z-]+/[0-9]{3}|[Pp]hase [0-9]{3}|T0[0-9]{2}\b)'` prints nothing.
- [x] T046 Validate the phase folder. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/code-surfaces/006-frontend-upstream-proposals/010-reference-readability-research --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `S/render-gate.py` reports `render_warnings=0 invalid=0`, and strict packaging passes on all seven folders.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Acceptance criteria**: See `acceptance-criteria.md`

**Finding coverage** (each confirmed row in `research/research.md` maps to one task):

| Task | Findings |
|------|----------|
| T010 | VAL-1, VAL-2, VAL-3, VAL-4, VAL-5, VAL-6 |
| T011 | TPL-2 (asset), TPL-3, TPL-4, TPL-5 |
| T012 | TPL-1, TPL-2 (skill template), TPL-6 (scaffold), TPL-8, TPL-9, TPL-10 |
| T013 | TPL-6 (metadata contract), TPL-7, TPL-11 (guidance) |
| T020 | FE-1, CI-1, SK-5, RV-3, QA-4, HUB-3, FE-3, QA-5, SK-6, SK-4 |
| T021 | XS-1 |
| T022 | HUB-1, HUB-2, HUB-4, CI-2, CI-3, CI-4 |
| T023 | FE-2, QA-1, QA-2, QA-3 |
| T024 | RV-1, RV-2, RV-4 |
| T025 | SK-1, SK-2, SK-3 |
| T030 | TPL-11 (gate), VAL-2 (package path) |
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task records the failing command and its output, and the tasks after it wait.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The operator approved this plan (REQ-003).
- [x] CHK-002 [P0] `S/baseline.txt` exists and holds every T002 line.
- [x] CHK-003 [P1] The opencode-go DeepSeek route answers a one-line brief with `STATUS=OK`.
- [x] CHK-004 [P1] The operator ruled on the SC-002 wording (research Section 8).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `test_render_checks.py` and `test_package_skill_regressions.py` pass, and the full sk-doc suite matches T002.
- [x] CHK-011 [P0] The render checks import nothing outside the Python standard library.
- [x] CHK-012 [P1] Every render finding is `severity: warning` in `validate_document.py`. Only `package_skill.py --strict` promotes them.
- [x] CHK-013 [P1] No code comment or test name carries a spec path, phase number or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each render check flags its named known-bad fixture and none of its look-alike negatives.
- [x] CHK-022 [P0] `S/render-gate.py` prints `render_warnings=0 invalid=0` on sk-code and sk-create-skill.
- [x] CHK-023 [P1] The fleet `valid: true` count is unchanged from T002.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding carries a class. FE-1, SK-1 and HUB-3 are `class-of-bug`, proven by the same-class sweep in research Section 2. RV-1, HUB-1, XS-1 and QA-1 are `cross-consumer`, with their citing files named in T021 to T024. VAL-1 to VAL-6 are `algorithmic`. The rest are `instance-only`, shown by the fleet counts in research Section 6.
- [x] CHK-FIX-002 [P0] The same-class inventory is `S/fleet-render.json`, and the ledger is seeded from it.
- [x] CHK-FIX-003 [P0] The consumer inventory covers every file that cites a renumbered section: the 18 review lines, the seven hub router lines, `quality-checklist-map.test.cjs:31` and `init_skill.py:648`.
- [x] CHK-FIX-004 [P0] The render-check fixture table holds a positive and a negative row for each check, including the fence, inline-code, autolink, list-item and placeholder cases.
- [x] CHK-FIX-005 [P1] Matrix: four enabled document types by three scopes (sk-code, sk-create-skill, other), each counted in `S/fleet-render.json`.
- [x] CHK-FIX-006 [P1] The validator tests run with `JEV_FEATURES=0`, so the citation-drift advisory cannot change their output.
- [x] CHK-FIX-007 [P1] Evidence names each task's commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential path is read or written. The change is documentation, rule data and two scripts.
- [x] CHK-031 [P1] The render checks read document text only, and spawn no process.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `research/research.md` name the same tasks and findings.
- [x] CHK-041 [P1] Each changed packet has a changelog entry (T031).
- [x] CHK-042 [P2] `creation-workflow.md` names the render checks and the content review (T013).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Briefs, fixtures copies, gates and logs live in `scratch/` only.
- [x] CHK-051 [P1] `scratch/` holds no file the final diff needs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-04
<!-- /ANCHOR:summary -->

---
