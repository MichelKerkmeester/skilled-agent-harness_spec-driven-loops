---
title: "Implementation Plan: Phase 14: unused-dependency-removal"
description: "Remove two unused npm packages from the sk-design-md-generator backend manifest, regenerate the lockfile and install clean. Let the output rule accept the documented specs/ folder, correct the usage text, and prove the backend is otherwise unchanged."
trigger_phrases:
  - "unused dependency removal plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: unused-dependency-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 26 with npm 11 (engines `>=20`), TypeScript 5.9 |
| **Framework** | Playwright 1.62 for the crawl, Vitest 4.1 for tests |
| **Storage** | None |
| **Testing** | `npm run typecheck`, `npm run build`, `npm test` (vitest) in `backend/` |

### Overview
Delete two lines from `backend/package.json`, regenerate the lockfile with `npm install --package-lock-only`, then install from it with `npm ci`. Prove the removal with `npm ls deepmerge`, and prove nothing needed the packages by running typecheck, build and the full suite on the clean install. Then fix the output rule at its cause, a hard-coded `.opencode/specs` root, so it also accepts `specs/`, and correct the usage text that echoed the old root. Fix the doc lines that named the packages or `ts-node` wrongly, sweep the wrong skill path and the `.opencode/specs` examples out of the other docs, and release the change as v1.1.6.0.
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
- [x] `npm ls deepmerge` in `backend/` prints `(empty)`, and typecheck and build exit 0
- [x] `npm test` prints `Test Files  20 passed (20)` and `Tests  178 passed (178)`, the 176 baseline plus two policy tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-only dependency removal, plus one allowlist root added to a shared path rule.

### Key Components
- **`backend/package.json`**: declares the runtime and dev dependencies; two entries leave.
- **`backend/package-lock.json`**: pins the tree; npm recomputes it and drops the 42 entries only those two packages needed.
- **`backend/scripts/output-policy.ts`**: the single place every writing script resolves its output path. Its spec root moves from `.opencode/specs` to `specs`, and `.opencode/specs` stays as a second allowed root. Callers are `extract.ts`, `guided-run.ts`, `report-gen.ts`, `preview-gen.ts` and `proof.ts`, and none of them reads the root directly.
- **`backend/scripts/extract.ts`, `backend/scripts/cli.ts`**: print the usage text and hints that name the root.
- **The 13 docs that print the wrong skill path**: two references and 11 playbook pages. The playbook package validator checks their shape, so the sweep must leave its result unchanged.

### Data Flow
`package.json` edit, then `npm install --package-lock-only` rewrites the lockfile, then `npm ci` rebuilds `node_modules` from that lockfile alone. Separately, a requested `--output` goes through `resolveOutputPath`, which refuses the skills directory first, then accepts either spec root or the sandbox.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The dependency removal changes no behavior, so it gets no new test. A test that asserts the two names are absent from `package.json` would only restate the manifest. The proof is a before and after pair on the same command. `npm ls deepmerge` printed the stealth chain before and prints `(empty)` after. The existing 176 tests, typecheck and build then run on a `node_modules` built by `npm ci` from the new lockfile, where neither package exists, so any hidden use would fail there.

The output rule does change behavior, so it gets two tests in `tests/output-policy.test.ts`. One resolves `specs/demo-packet/output` against the repo root and fails on the old rule (`expected false to be true`). The other resolves `.opencode/specs/demo-packet/output` and keeps the legacy root from being dropped by accident. No test covers the usage text, so its proof is the before and after `--help` output, diffed. The `guided-run` case for a path inside the skill now uses the real skill path, so it reaches the skills-directory branch it names.

The doc sweep is prose, so its proof is a count that falls to zero, checked with a positive control. `rg` for the wrong skill path found 49 lines in 13 files before and finds none after, while the same search for the correct path finds 89 lines in 24 files, which shows the search reads the tree. A stricter lookbehind search for any `sk-design-md-generator/` not preceded by `sk-design/` leaves one hit, a skill-name reference (`sk-design-md-generator/SKILL.md`) that is correct. The playbook package validator and `validate_document.py` then confirm no page lost its shape.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The npm registry, reached by `npm install --package-lock-only`, `npm ci` and `npm audit`. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a consumer turns out to import either package, or a path under `specs/` or `.opencode/specs` should not be writable. Revert the one commit that touches the backend, then run `npm ci` in `backend/` to restore `node_modules`.
<!-- /ANCHOR:rollback -->

---
