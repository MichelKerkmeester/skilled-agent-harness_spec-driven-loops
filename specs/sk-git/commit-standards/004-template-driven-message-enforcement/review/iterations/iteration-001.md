# Deep Review — Iteration 1: Correctness (with inventory pass)

- Run: review-i1-g1 · Session: 2026-10-02T11:19:37Z · Generation: 1 · Mode: review · Target agent: @deep-review (leaf)
- Review target: uncommitted sk-git message-contract upgrade (scope aliases, 80-char subject warning, required breaking-commit sections)
- Diff base: main 03afeb4552 · Prior findings: P0=0 P1=0 P2=0
- Doctrine loaded: review-core.md (severity contract); REPO RULES.md trigger table with evidence-and-proof.md and uncertainty-and-honesty.md before reporting

## DIMENSION

Correctness — logic errors, boundary handling, regression risk and contract safety of the three new
template keys (`subject.scopeAliases` error, `subject.warnLength` warning, `body.breakingSections`
error) plus their validator, tests, template, SKILL.md and CI wiring.

Evidence tiers (per evidence-and-proof.md):

- OBSERVED by read: every changed hunk (git diff over the six target files), the full validator
  library (message-contract.mjs, 756 lines), the full unit test file, the hook harness, the
  template rules block, the workflow, and both unchanged consumers (validate-message.mjs,
  commit-msg hook).
- OBSERVED by command: `node --check` parses all three modified .mjs files (LIB_OK / TEST_OK /
  VALIDATOR_OK, exit 0); `git show -s` on the three recorded deviation commits 4ceef9d5e7,
  7488e80836, 4754d270ab confirms the subjects the new rules target; 4754d270ab's subject
  measures 82 characters; 4ceef9d5e7's first 10 body lines contain zero
  `Context:` / `Changes:` / `Verification:` lines.
- NOT RUN by design: `node --test` and commit-msg.test.sh. Tests are repo tooling outside this
  read-only iteration, so every pass-count in the packet's acceptance criteria remains INFERRED
  here and is handed to the traceability iteration.
- Non-goals honored: canonical-scope, always-three-sections and warn-at-80 are operator policy
  choices, not reviewed as defects.

## FILES REVIEWED

| File | Read |
|------|------|
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | full; new sites at :54, :69, :186-199, :345, :351, :356, :435-437, :462-464, :537-548 |
| .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs | full; new tests at :83-101, :118-128, :130-144, :161-184, :255-281 |
| .skilled/skills/sk-git/assets/commit-message-template.md | full; changed at :132, :159-167, :192-204, :227-239, :253 |
| .skilled/skills/sk-git/SKILL.md | changed hunks @@338, @@382, @@406-416 |
| .skilled/scripts/git-hooks/tests/commit-msg.test.sh | full; new case at :415-447 |
| .github/workflows/message-contract.yml | full; new step at :41-42 |
| .skilled/skills/sk-git/scripts/validate-message.mjs | full (unchanged consumer of the library; `report()` at :84-108) |
| .skilled/scripts/git-hooks/commit-msg | full (unchanged gate; validator call at :75-78) |

## FINDINGS BY SEVERITY

### P0 — none

### P1 — none

No P0/P1. The three new rules are inert for contracts that do not declare their keys (guarded by
`Object.hasOwn(...)`, `typeof === 'number'`, and `?.length`), and the shipped template declares
all three, so all three are active here. The warning path cannot block anything: `report()`
in validate-message.mjs returns non-zero only for `errors`, and the hook maps that to exit 1.
Every new rule id is registered in `commitRuleIds()` (message-contract.mjs :345, :351, :356) and
named in the template prose table, which `templateDriftErrors()` (:664-681) enforces — the drift
check cover the new ids, verified statically.

### P2 — suggestions (non-blocking)

#### R1-P2-001 — `warnLength` can be configured above `maxLength`, creating a warning that can never fire alone

- File: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:193 (shape check) with :459-464 (both thresholds)
- Evidence: `contractShapeErrors` rejects a non-positive or non-finite `warnLength` but accepts any
  positive value even when `maxLength` is smaller or equal. With `warnLength > maxLength`, every
  subject that could warn is already a `subject.max-length` error; with `warnLength === maxLength`
  the warning and the error co-fire on the same subject. The shipped pair (80, 100) is unaffected;
  the gap matters for repository-local contract copies, which this module explicitly supports
  (`.sk-git/` and `skgit.contractDir`).
- Finding class: instance-only
- Scope proof: `warnLength` is read only at message-contract.mjs:61 (shape), :193 (shape check),
  :351 (rule id) and :462 (warning); no other site can compare the two thresholds.
- Recommendation: when both keys are numbers, add a shape error for `warnLength > maxLength`
  (optionally `>=`), so a dead warning fails closed like every other malformed key.
- riskScore: 2 (advisory)

#### R1-P2-002 — alias canonical values are not validated against `scopePattern`

- File: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:186-192 (shape check) with :435-437 (error text)
- Evidence: the shape check requires each `scopeAliases` value to be a string and nothing more. If
  a canonical value cannot pass `subject.scopePattern` (for example `{"legacy": "Legacy Core"}`
  under the shipped `^[a-z0-9]+(-[a-z0-9]+)*$`), the alias error instructs the author to "use
  canonical scope 'Legacy Core'", which the same contract then rejects with `subject.format` —
  guidance that cannot be followed. All four shipped values (`system-spec-kit`,
  `system-skill-advisor`, `system-deep-loop`, `repo-rules`) do satisfy the pattern, and the four
  target directories exist (checked with `ls -d`).
- Finding class: instance-only
- Scope proof: `scopeAliases` is read only at message-contract.mjs:54 (shape), :186-192 (shape
  check), :345 (rule id) and :435-437 (validation); the shape check is the single place that
  could enforce the relationship.
- Recommendation: when both `scopePattern` and `scopeAliases` are present, reject a canonical
  value that does not match the pattern at contract-load time.
- riskScore: 2 (advisory)

## TRACEABILITY CHECKS

- **spec_code — pass (spot)**: REQ-013 maps to the alias error at message-contract.mjs:435-437
  plus the map at commit-message-template.md:227-232; REQ-014 maps to :462-464 plus
  `"warnLength": 80` at :239; REQ-015 maps to :537-548 plus `"breakingSections"` at :253;
  REQ-016 maps to the corrected example at :132 and the SKILL.md scope wording.
- **checklist_evidence — partial**: AC-013/014/015/016 rows map to tests that exist at the cited
  behaviors (message-contract.test.mjs:118-128, :130-144, :161-184; commit-msg.test.sh:415-447).
  The suites were not executed this iteration (containment), so the packet's pass counts are
  INFERRED here; the traceability iteration should confirm them by running `node --test` and
  commit-msg.test.sh.
- **agent_cross_runtime — pass (spot)**: `.hermes/skills/sk-git/SKILL.md` carries the identical
  three wording changes as the `.skilled` copy; the `.opencode` render mirror is content-identical
  for the changed library, template and hook (`diff -q` clean) though untracked by git.
- **feature_catalog_code / playbook_capability — deferred**: not exercised this iteration.

Directions ruled out with evidence:

- Boundary/off-by-one: `subjectLength` uses code points (`[...subject].length`, :458) and the
  warn check is `> s.warnLength` (:462); the new test constructs 80 (quiet) and 81 (warns).
- Regression: absent-key contracts keep every new rule inactive; the unit test "optional commit
  rules stay inactive when their contract keys are absent" (:83-101) asserts both the empty
  result and the absent rule ids. Guards verified at :186, :193, :345, :351, :356, :435, :462, :537.
- Input validation: non-string alias values throw at load (test :255-272); arrays fail shape;
  `Object.hasOwn` only ever tests own properties of a JSON-parsed object.
- State transition: `body.breaking-sections` and the existing `breaking.footer` share the same
  `breaking` flag, set only when the subject format is valid (:428-431), so a malformed subject
  is still caught by `subject.format`; non-breaking commits skip the new check.
- Regex safety: all new patterns pass through `checkRegex` (:169-175) and inputs are capped by
  `MAX_INPUT_CHARS` (:29-31); the new keys add no regex of their own beyond validation of
  existing patterns.
- Drift/CI integration: all three ids are registered and named; the workflow's new step
  (:41-42) runs the suite from the changed `.skilled` assets in place.
- Stale alias teaching: the only remaining `fix(spec-kit)` strings are historical references
  inside the 032 packet's own docs; no live guidance teaches a now-blocked scope.
- Deviation targets: 4ceef9d5e7 (breaking `!`, no required sections in its first 10 body lines),
  7488e80836 (`chore(spec-kit)`, alias), 4754d270ab (82-character subject) — each would now
  produce the corresponding new rule id.

## SCOPE VIOLATIONS

None. Writes were confined to the review packet's iteration file, delta file and the append
gateway.

## VERDICT

PASS with advisories: no P0 or P1; two P2 validation-completeness suggestions (R1-P2-001,
R1-P2-002). Test execution was out of scope for this read-only iteration; the P2s are
non-blocking.

## NEXT DIMENSION

security (iteration 2). Suggested focus: the new keys' attack surface — `scopeAliases` object-key
handling and prototype sensitivity, user-controlled values interpolated into error messages,
regex growth through `checkRegex`, and whether the CI wiring exposes anything (the PR body is
already passed through the environment, never the shell source).

Review verdict: PASS
