---
title: "Tasks: Phase 13: advisory-checks-blocking-gates"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisory checks blocking gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: advisory-checks-blocking-gates

<!-- SPECKIT_LEVEL: 1 -->

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

Every path is written from the repository root. `W` is `.github/workflows/advisory-checks.yml`. `R` is `specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md`. Commands spell both in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the 13 gate-critical suites and record pass and fail per suite (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md`). Use the loop in `spec.md`'s Measured Behavior block and write one row per suite in the form `| <path> | <pass> | <fail> | <pass or fail> |`. Verify: `bash -c 'r=specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md; printf "pass=%s fail=%s named=%s\n" "$(rg -c "\| pass \|$" "$r")" "$(rg -c "\| fail \|$" "$r")" "$(rg -c "^\| .*(hook-stdin-deadline|spec-gate-core).*\| fail \|$" "$r")"'` prints `pass=11 fail=2 named=2`.
- [ ] T002 Confirm the four report-only steps and the single runner caller (`.github/workflows/advisory-checks.yml`). Verify: `bash -c 'printf "continue=%s callers=%s\n" "$(rg -c "continue-on-error: true" .github/workflows/advisory-checks.yml)" "$(rg -l "run-node-tests\.mjs" .github/workflows/ | wc -l | tr -d " ")"'` prints `continue=4 callers=1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the blocking `gate-critical` job with checkout, Node 22, `npm --prefix .skilled/skills/system-spec-kit ci`, `npm --prefix .skilled/skills/system-spec-kit run build`, and one `node --test --test-reporter=tap` step over the 11 passing suites (`.github/workflows/advisory-checks.yml`). No `continue-on-error` at job or step level. Verify: `awk '/^  gate-critical:/{f=1;next} f && /^  [a-z][a-z-]*:$/{exit} f && /continue-on-error/{c++} END{print c+0}' .github/workflows/advisory-checks.yml` prints `0`.
- [ ] T004 Revise the workflow header comment so it says the four steps are report-only and the `gate-critical` job blocks (`.github/workflows/advisory-checks.yml`). Verify: `awk '/^jobs:/{exit} /gate-critical/{f=1} END{print (f ? "HEADER_OK" : "HEADER_MISSING")}' .github/workflows/advisory-checks.yml` prints `HEADER_OK`.
- [ ] T005 Replace the `advisory-checks.yml` row's closing sentence with the blocking job description (`.github/workflows/README.md`). Verify: `bash -c '! rg -q "Reports without gating" .github/workflows/README.md && echo README_OK'` prints `README_OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Run the 11 passing suites in one invocation, using the path list from the job block (`.github/workflows/advisory-checks.yml`). Verify: `bash -c 'files=(); while IFS= read -r f; do files+=("$f"); done < <(awk "/^  gate-critical:/{f=1;next} f && /^  [a-z][a-z-]*:\$/{exit} f" .github/workflows/advisory-checks.yml | rg -o "\.skilled/[^ ]+\.test\.mjs"); node --test --test-reporter=tap "${files[@]}" | rg "^# fail 0$"'` prints `# fail 0`.
- [ ] T007 Confirm the job block lists 11 suites and neither failing suite (`.github/workflows/advisory-checks.yml`). Verify: `bash -c 'b=$(awk "/^  gate-critical:/{f=1;next} f && /^  [a-z][a-z-]*:\$/{exit} f" .github/workflows/advisory-checks.yml); n=$(printf "%s\n" "$b" | rg -c "\.test\.mjs"); x=$(printf "%s\n" "$b" | rg -c "hook-stdin-deadline|spec-gate-core" || true); printf "paths=%s excluded=%s\n" "$n" "${x:-0}"'` prints `paths=11 excluded=0`.
- [ ] T008 Confirm the four report-only steps still carry `continue-on-error: true` (`.github/workflows/advisory-checks.yml`). Verify: `rg -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` prints `4`.
- [ ] T009 Confirm the workflow parses and the job is present (`.github/workflows/advisory-checks.yml`). Verify: `ruby -ryaml -e 'puts YAML.load_file(".github/workflows/advisory-checks.yml")["jobs"].keys.join(",")'` prints `advisory,gate-critical`.
- [ ] T010 Confirm the README no longer says the workflow reports without gating (`.github/workflows/README.md`). Verify: `bash -c '! rg -q "Reports without gating" .github/workflows/README.md && echo README_OK'` prints `README_OK`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md` records 13 suites, 11 pass and 2 fail
- [ ] The `gate-critical` job block prints 0 `continue-on-error` and 11 paths
- [ ] `rg -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` prints 4
- [ ] The local 11-path run prints `# fail 0`
- [ ] `git status --short -- .github/workflows/advisory-checks.yml .github/workflows/README.md` lists exactly those two paths, and the packet folder holds the scratch record
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../007-test-and-ci-bloat-research/research/research.md` section 4, rank 6
- **Workflow**: See `.github/workflows/advisory-checks.yml`
- **Runner**: See `.skilled/scripts/run-node-tests.mjs`
<!-- /ANCHOR:cross-refs -->

---
