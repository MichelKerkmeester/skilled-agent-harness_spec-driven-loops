---
title: "Implementation Plan: Phase 5: opencode-and-guards"
description: "A new CommonJS guard, verify_doc_claims.cjs, reads the sk-code Markdown and JSON for dead paths, retired packet names, two-surface counts and unbacked load-tier claims, and joins the drift umbrella as its fourth guard. The router-sync guard reads the ROUTER.md shared-controls block, the doctor gains README and packet-changelog version parity, the canary gains an OBSIDIAN-versus-WEBFLOW case, and the OpenCode packet is cleaned and bumped to 1.2.0.0."
trigger_phrases:
  - "opencode and guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: opencode-and-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js CommonJS), bash, Markdown, JSON |
| **Framework** | None. Node built-ins `fs`, `path`, `child_process`, `node:test` |
| **Storage** | None |
| **Testing** | `node --test` for both guard tests, the doctor invariants test, the canary assertion, `run-all-drift-guards.sh` |

### Overview
Round three found 27 or more drift instances that all live in prose no guard reads (f-iter020-003). This phase builds the guard the research ranked first: `assets/scripts/verify_doc_claims.cjs`, modelled on the rule-copy canary, with four checks (paths, names, surfaces, tiers) and an allowlist for deliberate legacy lines. It then makes the existing guards read their facts from the declared source: router-sync check 2 reads the `ROUTER.md` `SHARED_CONTROL_RESOURCES` block, and the doctor's version parity covers the hub README and each packet's newest changelog. The canary gains the one untested precedence case, and the OpenCode packet is cleaned so the checker reports nothing inside it.

Every Phase 2 edit is one unit in `scratch/dispatch-units.json`, with its OLD text quoted exactly and its check command. The planner applied all 79 units to a mirror of the tree on 2026-10-10 and every unit check passed (section 5).
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
New read-only CLI guard plus in-place edits to two existing guards, one fixture and packet prose.

### Key Components
- **`verify_doc_claims.cjs`** (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/`). Walks every `.md` and `.json` under the hub, skipping folders named `changelog` or `node_modules`, any folder ending in `benchmark/reports`, and symlinked files. Options: `--root <hub dir>` (default: the hub three levels above the script) and `--checks paths,names,surfaces,tiers`. Output mirrors the router-sync guard: one `PASS check <id>` or `FAIL check <id>` line per check, every problem listed, then `doc-claims: N/M checks passed`. Exit 0 or 1, and 2 on a bad `--checks` value. Exact content: `scratch/units/verify_doc_claims.cjs`.
  - **paths**: outside fenced code, a Markdown link target, a link label that starts with `./` or `../` and is a file path, and a backticked path must resolve. Backticked paths count only when they contain `/`, end in a known extension and hold no placeholder character. `.skilled/skills/sk-code/...` and `sk-code-*/...` or `shared/...` resolve from the hub, `./` and `../` from the file, and `references/`, `assets/`, `manual-testing-playbook/` or `feature-catalog/` from the file's packet, then the hub, then the file. Other `.skilled/` paths and relative paths that leave the hub are skipped, because they point at other skills or other projects. JSON files check string values that start with a hub prefix.
  - **names**: `code-webflow` and `code-opencode` anywhere, and `code-quality` or `code-review` only in backticks or after `sk-code:`, because the bare words are also plain English and routing keywords (`hub-router.json:53`, `:62`).
  - **surfaces**: count claims only, `two surfaces`, `two supported surfaces` and `both supported surfaces`. A list that names two surface packets is not matched.
  - **tiers**: every `shared/` file the `ROUTER.md` ALWAYS row or the bullets under `### Surface-aware loading` say loads on every route must be in `DEFAULT_RESOURCE`. A folder or `/*` glob expands to its Markdown files. A missing ALWAYS row or an empty `DEFAULT_RESOURCE` is itself a problem, so the check cannot pass vacuously.
  - **ALLOWED**: a data block of rows `{ check, file, line, reason }`. A line in `file` that contains `line` is skipped for `check`. It ships with the two rows the orchestrator named: `schema_version: code-quality/v1` and the keyword comment in `sk-code-quality/SKILL.md`. Neither is flagged by today's rules, and the rows keep them safe if a rule widens.
- **`verify_doc_claims.test.cjs`** (`scripts/tests/`). Builds a throwaway hub in `os.tmpdir()` and runs the checker with `--root`. Six tests: a clean hub passes 4/4 with retired wording in its `changelog/` and `benchmark/reports/` and in an allowlisted line, an allowlisted line only exempts its own file, and one known-bad case each for paths, names, surfaces and tiers that asserts the exact FAIL line. Known-bad inputs live in the test, not on disk, so the live checker never scans them. Exact content: `scratch/units/verify_doc_claims.test.cjs`.
- **Router-sync check 2** (`verify_router_sync.cjs:34-44`, `:177-179`). `PARENT_TIER_ALLOWLIST` goes. `sharedControlResources()` reads the `ROUTER.md` `SHARED_CONTROL_RESOURCES` list and its `DEFAULT_RESOURCE` preamble, which together are the declared shared controls (child 001's handoff: the root-router contract rejects a listed control that no RESOURCE_MAP entry references, so the preamble files stay out of the list). It uses the same list grammar as `parseSharedControlResources` in `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:323-326`. A non-surface parent-map path passes when the block declares it or when `leaf-manifest.json` lists it as a leaf of the packet its first segment names. That second rule replaces the old ninth entry, `sk-code-review/assets/code-quality-checklist.md`, which the block cannot hold because the root-router contract allows only `shared/` paths there (`root-router-contract.cjs:85-89`).
- **Umbrella** (`scripts/run-all-drift-guards.sh`). A `DOC_CLAIMS` path, a fourth `run_guard` after the router-sync note, the header counting four guards and `all 4 guards PASSED`.
- **Doctor 13c and 13d** (`.skilled/commands/doctor/scripts/parent-skill-check.cjs:1757-1831`, the script that owns hub version parity). 13c compares a hub README `version:` with the SKILL.md authority. 13d checks that each registry packet's SKILL.md version equals its newest `changelog/v*.md` and that the entry's own `version:` line matches its file name.
- **Canary case** `surface-collision-obsidian-over-webflow`, prompt `code review my obsidian plugin that embeds a webflow site`, expected `surfaceBundle` of `sk-code-review` and `sk-code-obsidian`, inserted after `surface-bundle-obsidian` (`canary-cases.v1.json:78-90`). The precedence comes from `shared/references/stack-detection.md:77`.

### Data Flow
The umbrella runs four guards in turn and exits 1 if any fails. The checker reads files only and never writes. Router-sync check 2 now reads `ROUTER.md` and `leaf-manifest.json` at run time instead of a constant.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | The checker lives at `sk-code-opencode/assets/scripts/verify_doc_claims.cjs` beside the router-sync guard, and its test under `scripts/tests/` | The other drift guards live there; the test folder is outside the leaf roots and outside leg 1b's walk |
| D2 | Known-bad inputs are written by the test into a temp hub, not kept as fixture files | A Markdown fixture under the hub would be scanned by the live checker and by leg 1b, and would fail both |
| D3 | `code-quality` and `code-review` count as retired names only in backticks or after `sk-code:` | The bare words are routing keywords and plain English in `hub-router.json`, `description.json` and `graph-metadata.json`; flagging them would force removing live routing vocabulary |
| D4 | The tier check reads the ALWAYS row and the `### Surface-aware loading` bullets, and only `shared/` paths | Those are the two prose claims f-iter016-002 names; surface paths there are conditional on detection |
| D5 | The router-sync orphan allowlist drops `ROUTER.md`, `references/stack-detection.md` and `references/phase-detection.md` | They can never match a walked doc, whose path always starts with a packet folder, so removing them changes no verdict; the three workflow docs and their comment stay |
| D6 | Check 2 reads both the `SHARED_CONTROL_RESOURCES` list and the `DEFAULT_RESOURCE` preamble, and a workflow-mode leaf passes through `leaf-manifest.json` instead of a constant | The `ROUTER.md` block may hold only `shared/` paths, so the review checklist cannot move there |
| D7 | 13c warns instead of failing for `cli-classifier`, `cli-external-orchestration`, `sk-doc` and `system-deep-loop`, whose READMEs already lag | Same pattern as `VOCABULARY_PARITY_WARN_ONLY` (`parent-skill-check.cjs:1291`); every other hub keeps its `OK` verdict |
| D8 | The OpenCode version goes 1.1.1.0 to 1.2.0.0 | A new guard is a feature, the minor bump in `sk-create-changelog/SKILL.md:155-160` |
| D9 | f-iter004-002 (`Carry-over from 139`) is fixed here although the brief does not list it | It is in a file only this child owns, so no other child can fix it |
| D10 | Every hit inside the OpenCode packet is fixed, not only the rows the research named | The checker's own packet must pass it; the checker found 39 name hits and 3 path hits there, against the 2 rows f-iter014-002 named |
| D11 | Six OpenCode comment-budget rows are labelled: the shared-tier rule and the five language style guides | The shared decision names the style guides; checklists keep their rows unchanged |
| D12 | f-iter003-003 is a real move: this phase creates `sk-code-opencode/references/shared/workflow-guardrails.md` with the three "OpenCode Surface Only" subsections (`## 2. IMPLEMENTATION GUARDRAILS`, `## 3. VERIFICATION REALITY`, `## 4. RUNTIME BUILD TRAPS`), and child 001 replaces the originals with pointers to those headings | Orchestrator decision; one copy of the text, in the tier that owns it. The file is routed through the OpenCode `DEFAULT_RESOURCE`, not `RESOURCE_MAP`, because router-sync check 2 would then need a parent-map row in 001's `ROUTER.md`. The text is verbatim except the per-subsection scope paragraph, which the overview replaces, and `./` links rewritten to `../` |

### Handoffs

Checker hits in files this child does not own, from a run over the mirror with every unit applied (`scratch/plan-doc-claims-after-own-edits.txt`, 153 lines). The owner fixes them, or adds an `ALLOWED` row with a reason through the orchestrator.

| Owner | Files | Hits |
|-------|-------|------|
| 001 | `ROUTER.md` (6 tier claims at `:111`, `:604`; 2 stale labels at `:300-301`), `shared/README.md` (5 names), `shared/references/phase-detection.md:16` (two-surface), `shared/references/stack-detection.md:104` (2 paths), `universal-verification-checklist.md` (5 paths), `universal/code-quality-standards.md` (4 paths), `universal/code-style-guide.md` (2 paths), `universal/multi-agent-research.md` (2 paths), `feature-catalog/` (10 names) | 39 |
| 002 | `sk-code-review/SKILL.md` (20 names), `README.md` (13), `references/review-core.md` (2), `scripts/README.md` (1) | 36 |
| 003 | `sk-code-quality/SKILL.md` (9 names), `manual-testing-playbook/` (4), `scripts/README.md` (1), `scripts/lib/README.md:26-27` (2 paths) | 16 |
| 004 | `sk-code-webflow/` (SKILL.md 5, README.md 7, playbook 2 names; 9 path or label hits in references); `sk-code-obsidian/` (SKILL.md 3, README.md 2, playbook 12, `release-verification.md:109` 1 paths). The Obsidian playbook honesty note names the phantom files on purpose and must be reworded or allowlisted | 41 |
| Unowned | Hub-root `manual-testing-playbook/` (18: names and four `sk-code-webflow/assets/checklists/` paths) and `graph-metadata.json:282` (3 names) | 21 |

Other handoffs:
- **001**: set the hub `README.md` `version:` to the hub `SKILL.md` version, or doctor 13c fails on sk-code. Put the comment-density rule in `shared/references/universal/code-style-guide.md`, which the OpenCode budget labels link to.
- **003**: the quality packet's changelog entry must match its SKILL.md version, or doctor 13d fails (observed mid-plan: `SKILL.md` at 1.1.1.0, newest entry v1.1.0.0, a sibling build in progress).
- **Orchestrator**: regenerate Hermes after all builds; rerun `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` after all builds, since child 001's asset deletions also move the manifest; assign the unowned hits.
- **001, f-iter003-003**: replace the "OpenCode Surface Only" subsections at `shared/references/workflow-implement.md:78` and `workflow-verify.md:76`, `:92` with pointers to `../../sk-code-opencode/references/shared/workflow-guardrails.md` anchors `#2-implementation-guardrails`, `#3-verification-reality` and `#4-runtime-build-traps` (D12). Until then the text exists twice.
- **Not a defect here, recorded**: the prompt `obsidian plugin webflow implementation` routes to `orderedBundle` `sk-code-webflow,sk-code-obsidian`, Webflow first (probe, 2026-10-10). The canary case uses review phrasing, where Obsidian wins. Whether implementation phrasing should also put Obsidian first is a hub-router question for 001.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planner dry run.** All 79 units applied to a mirror (`sk-code`, `sk-doc`, `bin`, the doctor folder and the canary copy, with links to `system-spec-kit` and `system-skill-advisor`). Rerun on 2026-10-10 after child 001's `ROUTER.md` edit landed (7 listed controls). Results: router-sync 5/5; its test 5 of 5; checker test 6 of 6; the checker reports 0 lines under `sk-code-opencode/`; leaf manifest fresh after `--write` (new hash `5d16ff95...`); canary `cases 12 failures 0`; doctor test 98 of 98; the five other hubs keep `OK` with 13c WARN on the four warn-only hubs; edited Markdown keeps its `validate_document.py` issue counts and its voice-scan hard-blocker counts; every unit check printed its expected text.
- **Negative controls.** The two new check 2 tests fail against the unedited guard (`fail 2`) and the three new doctor tests fail against the unedited doctor (`fail 3`). Tasks T017 and T033 rerun both.
- **Interim state.** Until children 001 to 004 land, the checker exits 1 over the real tree and the umbrella exits 1 on the doc-claims guard alone, and doctor sk-code fails on 13c. The builder records the hit list, not a failure of this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js (v26.8.2 observed) and Python 3 for `validate_document.py` and `hvr_scan.py`.
- Baselines at plan time: router-sync 5/5; umbrella `all 3 guards PASSED`, exit 0; canary 11 of 11; compiled routing `sk-code fresh`, policy hash `a59ec9ff...`; leaf manifest `fab6eb86...`, `checked=14 fresh=14 failed=0`; doctor sk-code `OK`, 0 warnings, and its test 95 of 95; Hermes `--check` already `FAIL: 2 drifted` from sibling builds.
- The compiled-route hash reads only the hub `SKILL.md`, `hub-router.json` and `mode-registry.json`, none of which this phase edits, so no re-mint is planned. If it reads stale, the cause is a sibling's hub edit and the orchestrator re-mints.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore every modified tracked file with `git restore` on the Files to Change paths in `spec.md`.
- Delete the three new files: `verify_doc_claims.cjs`, `verify_doc_claims.test.cjs` and `changelog/v1.2.0.0.md`. Then rerun `generate-leaf-manifest.cjs --write .skilled/skills/sk-code`.
<!-- /ANCHOR:rollback -->

---
