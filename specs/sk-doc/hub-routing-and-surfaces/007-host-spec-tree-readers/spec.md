---
title: "Feature Specification: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree"
description: "A host repository vendors Skilled under a `.skilled` symlink and its `specs/` holds none of Skilled's packets. Two checks then fail on a missing Skilled spec folder and one advisor test imports a file from Skilled's spec tree. The two checks skip with a named reason in a host and the imported file moves under the advisor tests."
trigger_phrases:
  - "host spec tree readers"
  - "let the route sync check the route gold"
  - "compiled route sync host skip"
  - "route gold host repository"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/368-host-tree-portability-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled is vendored into host repositories. A host's `.skilled` is a symlink to a vendored checkout and the host's `specs/` holds none of Skilled's packets. Three readers assume Skilled's own spec tree. `compiled-route-sync.cjs --check` fails because the authored compiled-routing folder is missing. Leg 3 of `verify-router-sync.cjs` fails because the route gold is missing. `policy-observation-sink.vitest.ts` imports `evidenceBindsToCell` from a file inside a Skilled spec packet, so it cannot load in a host.

### Purpose
Both checks pass in a host with a named skip and still fail in Skilled's own checkout when their input is missing, and the advisor test imports nothing from `specs/`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
A throwaway host: `git archive HEAD .skilled | tar -x -C vendor`, then `host/` with `git init`,
`host/.skilled -> ../vendor/.skilled` and an empty `host/specs/`. Run from `host/`:

$ node .skilled/bin/compiled-route-sync.cjs --check
SYNC FAILED: authored compiled-routing source is missing; restore specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program
exit 1
$ node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 3
FAIL check 3: compiled destinations, leaf-manifest and code-skilled RESOURCE_MAP agree (1 problem(s))
  - route-gold not found, tried: specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json, specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json
router-sync: 0/1 checks passed
exit 1

Baselines in Skilled's own checkout (this worktree):

$ node --test .skilled/bin/tests/
tests 180
pass 179
fail 0
skipped 1
$ node .skilled/bin/compiled-route-sync.cjs --check | tail -2
all 7 hubs resolve
all 55 served copies match their authored files
$ node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
router-sync: 5/5 checks passed
exit 0
$ node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs
tests 13
pass 13
fail 0
$ (cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/policy-observation-sink.vitest.ts)
Test Files  1 passed (1)
     Tests  5 passed (5)
$ node --test specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs
tests 5
pass 4
fail 1
The one failure is `activated cells require the shipped validator`: ERR_MODULE_NOT_FOUND, Cannot find package 'ajv'.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `compiled-route-sync.cjs --check` print `SKIP: host repository; the authored compiled-routing source ships only in Skilled's own checkout` and exit 0 when the authored folder is missing and the caller's repository is a host.
- Add one exported function `authoredRootState(repoRoot, callerRoot)` to `compiled-route-sync.cjs` that returns `present`, `host-skip` or `missing`, so a test can drive the decision with temp directories.
- Make leg 3 of `verify-router-sync.cjs` print a `skip:` line under its status line instead of a `route-gold not found` problem when the gold is missing and the caller's repository is a host.
- Move `activation-matrix-evidence.mjs` with `git mv` into `.skilled/skills/system-skill-advisor/runtime/tests/helpers/` and repoint its two importers.
- Add a test file for `authoredRootState` and one host case to `verify-router-sync.test.cjs`. Without them nothing fails when a later edit drops the host skip or makes it fire in Skilled's own checkout.

### Out of Scope
- `compiled-route-guard.cjs:40` and the pre-commit hook lines 708 to 710 that read the same authored folder - neither is reported failing in a host.
- A served copy of the route gold under `.skilled/` - the skip removes the failure without shipping Skilled's gold to every host.
- The no-argument rebuild of `compiled-route-sync.cjs` - it writes the served tree from the authored folder, so it keeps throwing in every repository when the folder is missing.
- Any Barter-side change - Barter picks this up when it re-pins to the Skilled commit that carries it.
- The docs of the guardrail packet that name `activation-matrix-evidence.mjs` by its bare file name - they are that packet's history, and the schema `$comment` still names the right file.

### Files to Change

`S` is `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation`. `H` is `.skilled/skills/system-skill-advisor/runtime/tests/helpers`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/compiled-route-sync.cjs` | Modify | Add `authoredRootState`, the host skip in the `--check` branch and the export |
| `.skilled/bin/tests/compiled-route-sync-host.test.cjs` | Create | Host temp dir returns `host-skip`, own-checkout temp dir returns `missing` |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Add `callerIsHostRepository` and `skipNotes`, skip the missing gold in a host and print the notes |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | One leg 3 case that runs the guard from a host and from its own checkout |
| `S/activation-matrix-evidence.mjs` | Move | `git mv` to `H/activation-matrix-evidence.mjs` |
| `.skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts` | Modify | Import from `./helpers/activation-matrix-evidence.mjs` |
| `S/activation-matrix.test.mjs` | Modify | Import from the new location |
| `H/README.md` | Modify | Add the moved file to its contents and consumers |
| `.skilled/skills/system-skill-advisor/runtime/tests/README.md` | Modify | Name the moved file in the `helpers/` line of the tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | In a host the route sync check skips | From the throwaway host, `node .skilled/bin/compiled-route-sync.cjs --check` prints `SKIP: host repository; the authored compiled-routing source ships only in Skilled's own checkout` and exits 0 |
| REQ-002 | In Skilled's own checkout the route sync check is unchanged | `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`, and `authoredRootState(own, own)` returns `missing` for a temp checkout with a real `.skilled` and no authored folder |
| REQ-003 | In a host leg 3 skips the missing gold with a named reason | From the throwaway host, `verify-router-sync.cjs --checks 3` prints `PASS check 3` and `  skip: route-gold not checked: host repository; the compiled route gold ships only in Skilled's own checkout` and exits 0 |
| REQ-004 | The advisor test imports nothing from `specs/` | `rg -n 'specs/' .skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts` prints nothing, and the vitest file reports `5 passed (5)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The bin tests pass with the new file | `node --test .skilled/bin/tests/` reports `tests 182` and `fail 0` |
| REQ-006 | The router-sync tests pass with the new case | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` reports `tests 14` and `fail 0`, and the full guard still prints `router-sync: 5/5 checks passed` |
| REQ-007 | The activation matrix test still finds the moved file | `node --test S/activation-matrix.test.mjs` reports `pass 4`, and its one failure is still the missing `ajv` package |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From the throwaway host both checks exit 0 and each prints its named skip, while the no-argument rebuild still prints `SYNC FAILED` and exits 1.
- **SC-002**: In this worktree every baseline in the Measured Behavior block holds, with 182 bin tests and 14 router-sync tests, and `fail 0` for both.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `isHostRepository` and `callerRepoRoot` in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs`, an ES module loaded with `require()` | A Node that cannot `require()` an ES module would skip nothing | Both loads sit in `try`/`catch`, so a failed load falls back to today's failure. Node v26.13.0 loads it, checked in the throwaway host |
| Risk | Skilled's own checkout misread as a host would hide a missing authored folder or gold | Med | `isHostRepository` needs a `.speckit-index` folder or a `.skilled` that resolves outside the root. Neither exists in the main checkout or this worktree, and the edge tests pin `missing` and `route-gold not found` for an own checkout |
| Risk | Detection on the script's own root would never see a host | High | Detection runs on `callerRepoRoot()`, the git root of the working directory, because Node resolves the script's symlink and `REPO_ROOT` then names the vendored checkout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where does the evidence file go? Decision: the existing `tests/helpers/` folder, not a new `tests/support/`. It already holds test-only helpers, the production build excludes `tests/`, and the vitest include `tests/**/*.vitest.ts` does not match an `.mjs` file.
- Can `verify-router-sync.test.cjs` drive the host skip cheaply? Decision: yes. One case builds the existing fixture, copies `host-index.mjs` into it, makes two temp git repositories and runs in about 120 ms.
- Is the `ajv` failure in `activation-matrix.test.mjs` caused by this change? Decision: no, it fails the same way before any edit. This packet keeps the other four passing and does not fix it.
<!-- /ANCHOR:questions -->

---
