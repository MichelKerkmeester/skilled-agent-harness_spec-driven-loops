# Iteration 016 - design-md-generator backend traceability + maintainability + sk-doc conformance

## Dimension

- Focus: traceability, maintainability, sk-doc structural conformance.
- Scope: `.opencode/skills/sk-design/design-md-generator/backend/**`, plus the required `package_skill.py .opencode/skills/sk-design/design-md-generator --check` structural validator output.
- Prior registry check: existing `P1-001` covers standalone report/preview/proof output-boundary bypass in this backend area; this iteration does not recount that finding.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:11`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:32`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/sk-design/mode-registry.json:124`
- `.opencode/skills/sk-design/design-md-generator/backend/README.md:20`
- `.opencode/skills/sk-design/design-md-generator/backend/README.md:28`
- `.opencode/skills/sk-design/design-md-generator/backend/README.md:32`
- `.opencode/skills/sk-design/design-md-generator/backend/README.md:90`
- `.opencode/skills/sk-design/design-md-generator/backend/package.json:10`
- `.opencode/skills/sk-design/design-md-generator/backend/package-lock.json:18`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/README.md:17`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/README.md:174`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:7`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:55`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:232`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:5`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:3`

## Findings by Severity

### P0

None.

### P1

#### P1-016-001 - sk-doc package check fails because `design-md-generator/SKILL.md` exceeds the skill word limit

- Claim: The required sk-doc structural checker fails this mode packet, so the package is not structurally conformant until the root skill file is reduced or split under the sk-doc limit.
- Evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-md-generator --check` returned `Result: FAIL` with `SKILL.md exceeds word limit (5759 words, max: 5000)`.
- Evidence refs: `.opencode/skills/sk-design/design-md-generator/SKILL.md:1` (validator target), `.opencode/skills/sk-design/design-md-generator/backend/README.md:22` (backend says the parent skill drives the pipeline), package-check command output.
- Counterevidence sought: Checked the validator output for warnings-only or advisory wording; it emits a red failure and `Result: FAIL`, not a pass with warning.
- Alternative explanation: The checker may be intentionally conservative, but the prompt explicitly required reporting any package-check error/warning, and this one is a hard checker failure.
- Finding class: matrix/evidence.
- Affected surface hints: `design-md-generator/SKILL.md`, `sk-doc package_skill.py`, `design-md-generator backend docs`.
- Recommendation: Trim or decompose the parent packet instructions so `package_skill.py --check` passes, while keeping backend-specific operational detail in backend-local README/reference files.
- Final severity: P1.
- Confidence: 0.95.
- Downgrade trigger: Downgrade to P2 only if `package_skill.py` documents this word-limit failure as advisory for mode packets or the checker threshold is intentionally disabled for `design-md-generator`.

### P2

#### P2-016-001 - Backend docs and lockfile claim a `design-system-extractor` bin that `package.json` no longer declares

- Claim: The backend's package/CLI traceability is stale: user-facing docs and `package-lock.json` advertise a bin entry, but the source manifest that maintainers edit has no `bin` field.
- Evidence: `backend/README.md:32` names `design-system-extractor` as the bin and `backend/README.md:92` says `package.json` contains the design-system-extractor bin. The actual `backend/package.json:10` through `backend/package.json:18` has scripts but no `bin`; the only bin claim is stale lockfile metadata at `backend/package-lock.json:18` through `backend/package-lock.json:20`.
- Finding class: matrix/evidence.
- Scope proof: `backend/scripts/cli.ts:7` through `backend/scripts/cli.ts:18` still defines a CLI wrapper, so the issue is manifest/documentation drift rather than absence of CLI code.
- Recommendation: Either restore the `bin` field in `package.json` or remove the bin claims from backend docs and regenerate the lockfile so the package surface has one source of truth.
- Final severity: P2.
- Confidence: 0.9.

#### P2-016-002 - `guided-run.ts` is executable and tested but missing from the documented/package entrypoint surface

- Claim: `guided-run.ts` has become an orphaned maintainer surface: it exposes a direct CLI, plans extract/write/validate/report, and has tests, but it is absent from package scripts and the scripts README entrypoint table.
- Evidence: `backend/scripts/guided-run.ts:55` through `backend/scripts/guided-run.ts:60` define CLI usage, `backend/scripts/guided-run.ts:151` through `backend/scripts/guided-run.ts:170` build the extract/write/validate/report plan, and `backend/scripts/guided-run.ts:232` through `backend/scripts/guided-run.ts:239` execute as `require.main`. Tests import it at `backend/tests/guided-run.test.ts:3`, but `backend/package.json:10` through `backend/package.json:18` exposes only `extract`, `write-prompt`, and `validate`, and `backend/scripts/README.md:174` through `backend/scripts/README.md:185` omits `guided-run.ts` from the entrypoint table.
- Finding class: instance-only.
- Scope proof: The grep scan found `guided-run` references only in backend comments/docs and `tests/guided-run.test.ts`, not in the package script surface.
- Recommendation: Decide whether `guided-run.ts` is a supported maintainer CLI. If yes, add it to `package.json` scripts and the scripts README entrypoint table; if no, remove the executable wrapper and keep only the tested helper functions needed by supported callers.
- Final severity: P2.
- Confidence: 0.88.

## Traceability Checks

- `mode-registry.json` backend claim: PASS. `mode-registry.json:124` through `mode-registry.json:127` declares `workflowMode: md-generator` and `backendKind: playwright-extract`; backend docs describe Playwright extraction at `backend/README.md:20`, and package dependencies include Playwright at `backend/package.json:22`.
- Pipeline documentation vs call graph: PASS for the documented core flow. `backend/scripts/README.md:17` documents extract/write/validate plus optional report artifacts; `guided-run.ts:157` through `guided-run.ts:166` plans `extract.ts`, `build-write-prompt.ts`, optional `validate.ts`, and optional `report-gen.ts` accordingly.
- Optional report branch traceability: PARTIAL. Docs mention `report-gen.ts`, `preview-gen.ts`, and `proof.ts` at `backend/README.md:72`, while `guided-run.ts:164` through `guided-run.ts:166` only orchestrates `report-gen.ts`; this is acceptable as a guided-run limitation because report/preview/proof remain separately documented entrypoints, not a new finding.
- Output boundary documentation: PASS. `output-policy.ts:5` through `output-policy.ts:9`, `output-policy.ts:44` through `output-policy.ts:46`, and `output-policy.ts:82` through `output-policy.ts:84` explain central write-location and overwrite rules clearly enough for future artifact writers.
- Existing output-boundary issue: NOT RECOUNTED. Prior `P1-001` already covers standalone artifact writers bypassing the central output boundary in this directory.
- Dead-code/orphan check: PARTIAL. No genuinely dead backend file was proven; `guided-run.ts` is executable and tested, but its supported-entrypoint status is unclear and recorded as P2-016-002.
- sk-doc package check: FAIL. `package_skill.py --check` reports `SKILL.md exceeds word limit (5759 words, max: 5000)` and `Result: FAIL`.

## Verdict

CONDITIONAL. This iteration found one new P1 structural-conformance failure and two P2 traceability/maintainability advisories.

## Next Dimension

Continue with Wave 4/5 md-generator coverage without duplicating the existing `P1-001` output-boundary finding. Suggested follow-up: verify whether the root `design-md-generator/SKILL.md` can be decomposed into backend-local references without changing runtime behavior, and reconcile backend package manifest/docs around the CLI/bin surface.

Review verdict: CONDITIONAL
