---
title: "Implementation Plan: Phase 13: advisory-checks-blocking-gates"
description: "Add one blocking job to .github/workflows/advisory-checks.yml that installs and builds the spec-kit workspace, then runs the 11 gate-critical node suites that pass locally. The four report-only steps keep continue-on-error: true; the two suites that fail locally stay out of the job and are named in the run record."
trigger_phrases:
  - "advisory checks blocking gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: advisory-checks-blocking-gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (GitHub Actions); Node 22 in CI, Node 26.13.0 locally |
| **Framework** | GitHub Actions; `node:test` with the TAP reporter |
| **Storage** | None |
| **Testing** | `node --test --test-reporter=tap`, `rg`, `awk`, `ruby -ryaml` |

### Overview
Add one blocking job to `.github/workflows/advisory-checks.yml` that installs and builds the spec-kit workspace, then runs the 11 gate-critical `.test.mjs` suites that pass locally. The four existing report-only steps keep `continue-on-error: true`; the two suites that fail locally, `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs`, stay out of the job and are named in `scratch/gate-critical-run.md`. Prove it with the recorded per-suite run and a job block that holds zero `continue-on-error`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/gate-critical-run.md` has 13 suite rows, 11 `pass` and 2 `fail`
- [ ] The `gate-critical` job block prints 0 `continue-on-error` and 11 `.test.mjs` paths
- [ ] `rg -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` prints `4`
- [ ] The local 11-path run prints `# fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One blocking job beside four report-only steps.

### Key Components
- **`gate-critical` job**: checkout, Node 22, `npm ci` and build for `.skilled/skills/system-spec-kit`, then the 11 passing suites in one `node --test` invocation. No `continue-on-error`.
- **`advisory` job**: the four existing report-only steps. Unchanged; each keeps `continue-on-error: true`.
- **`scratch/gate-critical-run.md`**: the 13-suite census, the per-suite pass and fail counts, and the 11/2 split.
- **`.github/workflows/README.md`**: the workflow inventory row, updated so it no longer says the workflow reports without gating.

Without the blocking job, a regression in any of the 11 suites runs only in the report-only step and the workflow stays green. Without the install and build steps, a fresh runner has neither `js-yaml` nor `shared/dist/gate-3-classifier.js`, and the suites fail or skip before they test anything.

### Data Flow
A push or pull request starts the workflow. The `advisory` job runs the four report-only steps and stays green by design. The `gate-critical` job installs and builds the spec-kit workspace, then runs the 11 suites in one `node --test` invocation. A failure in any of the 11 exits non-zero and turns the job red. The two suites that fail today never enter the job.

### Suite Inventory

The 13 files are every `.test.mjs` suite under `.skilled/skills/system-spec-kit/runtime`. The counts are the local run in `spec.md`'s Measured Behavior block.

| File | Local pass/fail | In blocking job |
|------|-----------------|-----------------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs` | 3/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs` | 3/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` | 6/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs` | 5/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs` | 1/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | 53/3 | no |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | 17/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs` | 2/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs` | 13/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs` | 15/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | 57/50 | no |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs` | 17/0 | yes |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs` | 17/0 | yes |

The 11 `yes` rows are the job's path list. The 2 `no` rows stay in the report-only step and are named in `scratch/gate-critical-run.md`.

### Job Shape

The job copies the `advisory` job's switch so both jobs turn on and off together, and it copies the pinned action revisions already in the workflow.

```yaml
  gate-critical:
    name: Gate-critical node suites (blocking)
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version: '22'
      - name: Install and build the spec-kit workspace
        run: |
          set -euo pipefail
          npm --prefix .skilled/skills/system-spec-kit ci
          npm --prefix .skilled/skills/system-spec-kit run build
      - name: Gate-critical node suites
        run: |
          set -euo pipefail
          node --test --test-reporter=tap \
            .skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs \
            .skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs \
            .skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs \
            .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs \
            .skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs \
            .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: run the 13 gate-critical suites locally and record pass and fail per suite in `scratch/gate-critical-run.md`; confirm the workflow's four `continue-on-error: true` lines and its single `run-node-tests.mjs` caller.
- **Implementation**: add the `gate-critical` job to `.github/workflows/advisory-checks.yml` for the 11 suites that pass, with `npm ci` and a build first and no `continue-on-error`; revise the header comment and the `.github/workflows/README.md` row.
- **Verification**: run the 11 paths locally and confirm `# fail 0`; confirm the job block has 11 paths and 0 `continue-on-error`; confirm the workflow still has four report-only lines; parse the YAML and confirm `gate-critical` is present.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The local dry run uses the job's own invocation, from the repository root:

```text
node --test --test-reporter=tap \
  .skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs \
  .skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs \
  .skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs \
  .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs \
  .skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs \
  .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs
```

It passes when the TAP summary prints `# fail 0`.

The census is the 13-suite loop in `spec.md`'s Measured Behavior block. It is the only place the two failing suites are counted, and it proves the job's list is the 11 that pass.

The workflow checks are static. The job block is extracted with:

```text
awk '/^  gate-critical:/{f=1;next} f && /^  [a-z][a-z-]*:$/{exit} f' .github/workflows/advisory-checks.yml
```

The extraction must hold 11 `.test.mjs` paths, no `hook-stdin-deadline` or `spec-gate-core`, and no `continue-on-error`. The whole file must still hold exactly four `continue-on-error: true` lines. `ruby -ryaml -e 'puts YAML.load_file(".github/workflows/advisory-checks.yml")["jobs"].keys.join(",")'` must print `advisory,gate-critical`.

No test file changes. The phase changes CI configuration and the run record only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node 22 in CI and npm, with the spec-kit workspace lockfile at `.skilled/skills/system-spec-kit/package-lock.json`.
- `tsc` from the spec-kit dev dependencies, reached through `npm --prefix .skilled/skills/system-spec-kit run build`.
- The pinned `actions/checkout` and `actions/setup-node` revisions already in `.github/workflows/advisory-checks.yml`.
- `ruby` with the `yaml` standard library for the parse check. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the new job fails on a suite that passed locally, or the install or build step fails on the runner.

Procedure: delete the `gate-critical` job from `.github/workflows/advisory-checks.yml`, restore the header comment, and restore the `advisory-checks.yml` row in `.github/workflows/README.md`. The four report-only steps were never changed, so the workflow returns to its current all-green behavior. Re-run the 13-suite local record; it still shows 11 pass and 2 fail.
<!-- /ANCHOR:rollback -->

---
