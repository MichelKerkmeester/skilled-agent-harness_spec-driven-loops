---
title: "Implementation Plan: Phase 10: open-ends-cleanup"
description: "Verify four open ends against the code, then fix each with the smallest in-place change and a test that fails on the old logic. Luna makes every edit outside the spec folder, one dispatch at a time."
trigger_phrases:
  - "open ends cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: open-ends-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, Markdown docs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test (doctor runner), vitest (deep-loop runtime), `hvr_scan.py`, `validate_document.py` |

### Overview
Each of the four items was checked against the code before planning, and all four hold, item 2 in a different direction than the brief proposed. The fixes extend the existing functions in place. Luna (`gpt-6-luna`, max, fast) makes every edit outside this folder, one dispatch per change, and the orchestrator diffs, tests and mutation-checks each one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)

### Baselines (2026-10-17, before any change)

| Gate | Result |
|------|--------|
| `run-all.sh` (doctor) | 7 suites passed, node:test 346/346, unittest 10, bash 18 + 21, vitest 18 |
| `git-setup-check.cjs --tool=claude` / `--tool=hermes` | `STATUS=OK checks=11` both |
| `parent-skill-check.cjs` on the seven hubs | OK, 0 warnings each |
| `parent-skill-check.cjs .skilled/skills/sk-prompt` | FAIL, 5 invariant failures, exit 1 |
| `compiled-route-guard.cjs` | all hubs fresh or excused, exit 0 |
| `compiled-route-admission.cjs --all --warn-only` | every hub passes |
| `ci-skill-root-metadata.cjs` | checked=14 passed=14 failed=0, sk-prompt `[S]` |
| deep-loop suites covering the close-out (8 files) | 142/142 |
| `package_skill.py --check` sk-create-command / sk-prompt | PASS / PASS |
| `sync-skills-hermes.cjs --check` | PASS: 68 |
| `sync-runtime-mirrors.cjs --check` | PASS: 185 mirrors across 8 trees |
| `run-all-drift-guards.sh` | all 4 guards PASSED |
| `hvr_scan.py` hard blockers | SKILL.md 31, common-pitfalls 2, worked-example 2, argument-hints-and-modes 1, 033 spec 5 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of existing check functions. No new module, option or dependency.

### Key Components
- **Item 1, `checkAiToolHooks` (git-setup-check.cjs:1050-1085)**: today three regexes run over the whole comment-stripped file (lines 1064-1067). An unused `{ 'tool.execute.before': fn }` or an uncalled `function f(pi) { pi.on('tool_call', h) }` beside an empty default export passes. Confirmed by reading, and the comment at lines 1060-1061 states it. Fix: locate the `export default` function, scan its body with a small brace matcher that skips strings, template literals, comments and regex literals, and require the OpenCode key at the top level of the object that body returns, or a Pi `<param>.on('tool_call', <handler>)` call inside the body on the function's first parameter. Text is read, never executed. A full parser would add a dependency the battery cannot assume in an inspected repository, and the scanner covers the two adapter shapes the repository ships.
- **Item 2, sk-prompt**: rejected as a hub. `changelog/v3.0.0.0.md` retired the hub shape, `SKILL.md` declares no modes, and `skill-root-metadata-contract.cjs:98-107` forbids `description.json`, `mode-registry.json` and `hub-router.json` on a class S root, so adding hub files would fail `ci-skill-root-metadata.cjs`, which today passes sk-prompt as `[S]`. Nothing automated runs the hub check on it: the pre-commit hook (`pre-commit:375`) and CI (`routing-registry-drift.yml:188`) select only roots with `mode-registry.json`. The check ran on it by hand in phase 9 (009 `tasks.md` T033), and the checker answered with five hub failures instead of saying the root is not a hub. Fix: when a root carries neither discriminator file, the checker prints that it is a class S root, names `ci-skill-root-metadata.cjs` as the right gate, and exits 2, which the doctor already maps to ERROR. A green exit would certify a hub nobody has.
- **Item 3, `closeOut` (synthesis-closeout.cjs:280-340)**: two double counts. The state side sums finding groups across iteration records, and review records carry cumulative `findingDetails` snapshots, so the 006 Luna lineage counted 2+6+13+18+18 = 57 for 18 distinct findings. The registry side adds `repeatedFindings`, which `reduce-state.cjs:1672` builds as a subset of `openFindings`, so the same lineage counted 36 for 18. The comparison at line 323 then raised a false warning there, and it passes a registry that collapses two distinct state findings into one entry when that entry is also repeated. Fix: count distinct identities (the first key `findingKeys` returns) on both sides before comparing, and count missing findings once each.
- **Item 4, Human Voice Rules**: 41 hard blockers, all em dashes and semicolons in prose. None sits in a table row or code span. Rewrite each as a colon, comma, period or split sentence with the same meaning.

### Data Flow
Each check reads files and prints rows. None of the four changes adds a write path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Item 1: failing fixtures for an unused OpenCode object, an OpenCode handler on an object the default export does not return, and an uncalled Pi helper. Passing fixtures come from the real adapters. Mutation: restore the whole-file regex and the unused-binding test must fail.
- Item 2: a class S fixture root must exit 2 with the standalone reason. Mutation: remove the guard and the test must fail.
- Item 3: a cumulative-snapshot review fixture must close `synthesis_complete`, and a registry that covers fewer distinct findings must close `synthesis_incomplete`. Both fail on the old logic. Mutation: restore the summed counts.
- Item 4: `hvr_scan.py` 0 hard blockers and `validate_document.py` clean on each doc, and `package_skill.py --check` on sk-create-command.
- Fixtures for the mutation checks go under a fresh `mktemp -d` and are deleted afterwards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The parallel 036 packet owns the advisor runtime, `_routes.yaml`, bridge files, playbook validator and manifest, and launcher. `git diff` runs on each shared file before editing.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each target is backed up to the build scratch directory as `before-N.*` before its dispatch. Nothing is committed, so reverting one item means restoring its backups.
<!-- /ANCHOR:rollback -->

---
