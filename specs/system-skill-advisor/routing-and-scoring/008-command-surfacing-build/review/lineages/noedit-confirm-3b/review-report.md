# Review Report - Command Surfacing, Pass Three Confirming Round (noedit-confirm-3b lineage)

- Run: `fanout-noedit-confirm-3b-1794595021404-69frey`
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Base / HEAD: `860610d783cb75e496eb97cd0808355512e547a2` (the confirming-round fix commit itself)
- Lineage artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/noedit-confirm-3b`
- Stop reason: `maxIterationsReached` (3 of 3; all dimensions covered, an active P1 remains)

## Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: **true** (two active P2)
- Active findings: P0 0, P1 1, P2 2
- Review scope: the two source files commit `860610d783` changed under `.skilled` plus their two test files, and the callers of each changed function.
- Operator review focus: "Code review of command surfacing, PASS THREE confirming round. FIRST read the full instructions in /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3b.txt and follow them exactly. Scope: commit 860610d783 and the two source files it changed. Say whether each of the two fixes holds and whether it introduced a defect. Every finding is P0, P1 or P2 with file:line and a concrete input you ran. Never open holdout-prompts.jsonl. Change no code, write only inside your lineage folder. This lineage reviews the no-edit pattern fix first and deepest and the doctor hook check once."

### The two fixes, judged

| Fix | Holds? | Introduced defect? | Evidence |
|-----|--------|--------------------|----------|
| No-edit pattern `(?! (?:to\|in)\b)` in `command-attach.ts:289` | Partly. The reported case is closed. | Yes: the mirror direction is now misread, and the guard covers one separator only. | `refactor the parser and make no changes to its public api` -> `false` (fixed). `make no changes to the tests` -> `false`, and `attachCommand` returns `/create:agent` (regression). `make no changes` -> `true`. |
| `nodeFlagSkipsScript` in `hook-wiring-check.cjs:231-237` | Yes. Every attached spelling it names now prints `hook-missing`, and no working form is misread. | No new defect found. | `node -e1`, `node --eval=1`, `node --print=1`, `node --check=1`, `node -p1` all print `hook-missing` exit 1; ten working forms print `ok claude` exit 0. One residual window predates the commit (`NE3-P2-003`). |

## Planning Trigger

`/speckit:plan` is required for this lineage: the verdict is CONDITIONAL because `NE3-P1-001` is active. The P1 is a one-line fix on the same pattern plus its missing test cases; the two P2 are advisories that can ride along.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "NE3-P1-001",
      "severity": "P1",
      "title": "`make no changes to` reads a genuine no-edit request as a change request",
      "dimension": "correctness",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289",
      "findingClass": "class-of-bug",
      "scopeProof": "lookahead on changed line command-attach.ts:289; read at command-attach.ts:335, scorer/text.ts:150, scorer/fusion.ts:677 and scorer/fusion.ts:881",
      "affectedSurfaceHints": ["hub command attachment", "read-only explainer gate", "read-only route gate", "command-meaning eligibility"],
      "evidence": "isNoEditRequest('make no changes to the tests') is false; attachCommand with a single-mode sk-create-agent route returns /create:agent",
      "disposition": "required"
    },
    {
      "id": "NE3-P2-002",
      "severity": "P2",
      "title": "The guard matches a literal single space, so line-break and punctuation variants keep the pass-three defect",
      "dimension": "correctness",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289",
      "findingClass": "class-of-bug",
      "scopeProof": "separator is fixed on the changed line; command-attach.ts:294 normalises only case and apostrophes",
      "affectedSurfaceHints": ["hub command attachment", "read-only explainer gate", "command-meaning eligibility"],
      "evidence": "refactor the parser and make no changes\\nto its public api returns isNoEditRequest true and attachCommand undefined, as do the two-space, tab, colon and comma variants",
      "disposition": "advisory"
    },
    {
      "id": "NE3-P2-003",
      "severity": "P2",
      "title": "A long flag whose value is attached by shell quoting still reports ok for a command node refuses to run",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:232",
      "findingClass": "class-of-bug",
      "scopeProof": "name split on changed line hook-wiring-check.cjs:232; readWords:133-147 merges a quoted value into the flag word",
      "affectedSurfaceHints": ["doctor-setup.yaml:61 delivery leg", "doctor-symlink-check.yaml:60 symlink route"],
      "evidence": "node --eval\"1\" <marker> prints ok claude exit 0 while node --eval\"1\" exits 9 with bad option: --eval1",
      "disposition": "advisory"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P1",
      "findings": ["NE3-P1-001"],
      "action": "Keep the phrase when it is the reader's own instruction and drop it only when it constrains a change: separate the object form from the scope-limit form, or require a change verb in the same sentence, then add a genuine no-edit case with an object to command-attach-guards.vitest.ts."
    },
    {
      "order": 2,
      "severity": "P2",
      "findings": ["NE3-P2-002", "NE3-P2-003"],
      "action": "Widen the separator to \\s+ and allow the punctuation forms; read the long-flag name before the `=` or quote-merge boundary."
    }
  ],
  "specSeed": [
    "Record the rule the pattern must honour: a phrase that rules out a change is a no-edit marker only when the reader did not also ask for one; an object after the phrase never decides it alone.",
    "Record that the hook check reads a command the way a shell does, including values attached by `=` and by quoting."
  ],
  "planSeed": [
    "Add the four failing probes as cases: make no changes to the tests (no-edit), make no changes to its public api (change), make no changes\\nto its public api (change), make no changes to the tests, just explain (no-edit).",
    "Add a hook case for node --eval\\\"1\\\" <marker> expecting hook-missing.",
    "Re-run the two single test files named in the review focus, not the full suite."
  ],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/commands/doctor/scripts/hook-wiring-check.cjs"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Dimension | Title | File:line | Evidence | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|-------|-----------|----------|--------------------|-------------|---------------|-------------|------------------------|
| NE3-P1-001 | P1 | correctness | `make no changes to` reads a genuine no-edit request as a change request | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | `isNoEditRequest('make no changes to the tests')` false; `attachCommand` returns `/create:agent`; bare `make no changes` true | Keep the phrase when it is the instruction; do not let the preposition alone decide | required | class-of-bug | lookahead on the changed line; four read sites | hub attachment, explainer gate, read-only route gate, command-meaning eligibility |
| NE3-P2-002 | P2 | correctness | The guard matches a literal single space, so line-break and punctuation variants keep the pass-three defect | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | newline, two-space, tab, colon and comma variants all return `true` | Use `\\s+` and allow the punctuation forms | advisory | class-of-bug | separator fixed on the changed line; no prompt normalisation beyond case and apostrophes | hub attachment, explainer gate, command-meaning eligibility |
| NE3-P2-003 | P2 | correctness | A long flag whose value is attached by shell quoting still reports ok for a command node refuses to run | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:232` | `node --eval"1" <marker>` prints `ok claude` exit 0; node exits 9 on the same command | Split the long-flag name at the quote-merge boundary too | advisory | class-of-bug | name split on the changed line; `readWords:133-147` merges the quoted value | `doctor-setup.yaml:61`, `doctor-symlink-check.yaml:60` |

## Remediation Workstreams

### P0

None.

### P1

1. `NE3-P1-001` -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289`. Decide the phrase by its role, not by the following preposition. Cheapest complete shape: keep `make no changes` out of the pattern when it introduces an object AND a change verb appears elsewhere in the prompt; otherwise keep it as a no-edit marker. Add the genuine no-edit cases to `tests/command-attach-guards.vitest.ts` so the mirror direction cannot regress again.

### P2 advisories

1. `NE3-P2-002` -- widen the separator to `\\s+` and allow a punctuation mark between the phrase and its object, so a multi-line prompt behaves like a single-line one.
2. `NE3-P2-003` -- when the flag word starts with `--`, read the name up to the first `=` or merged quote mark, so a value attached by shell quoting is read as a value.

## Spec Seed

- The no-edit rule is symmetric: a phrase that rules out change must not fire when the same words limit a change. Neither direction may be decided by the preposition alone.
- The hook check reads a command as a shell runs it: word splitting, quoting, and attached flag values are all part of the command.

## Plan Seed

- Add the failing probes from this report as test cases before touching the pattern.
- Keep the fix on the changed line; no new module or option is needed.
- Verify with `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` and `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | pass | Both fixes present at the cited lines; commit message describes both | The behavior gaps are the recorded findings |
| `checklist_evidence` | pass | 26 vitest tests and 32 node tests pass; each added case fails when its fix is reverted | None |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No agent file in the changed set |
| `agent_cross_runtime` | notApplicable | No agent file in the changed set |
| `feature_catalog_code` | notApplicable | No catalog page in the changed set |
| `playbook_capability` | notApplicable | No playbook in the changed set |

AC_COVERAGE: exempt (the packet is a Level 1 spec folder with no `acceptance-criteria.md` and no `implementation-summary.md`).

## Deferred Items

- The commit message's full-suite figure (184 files, 1798 passed; doctor 1215) is unverified: the review focus forbids the full suite and a build. Not a finding; recorded so nobody mistakes it for review evidence.
- The multi-runtime hook matrix (codex, cursor, devin) was not re-probed: the changed function is runtime-agnostic and the fixtures exercised the claude file, which is the same code path.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Selected review directions: the no-edit gate (correctness, security), the hook check (correctness), traceability and maintainability of the changed lines.
- Remaining frontier: none recorded.

## Search Ledger

*No search-depth state captured (legacy v1 record)*

## Audit Appendix

### Convergence Summary

| Iteration | Focus | New findings | Ratio | Status |
|-----------|-------|--------------|-------|--------|
| 1 | correctness, no-edit gate | 1 P1, 1 P2 | 1.00 | complete |
| 2 | correctness, hook check | 1 P2 | 1.00 | complete |
| 3 | security, traceability, maintainability | 0 | 0.00 | complete |

Stop: `maxIterationsReached` at 3 of 3. The "all dimensions clean" stop could not fire because `NE3-P1-001` is active; the composite vote was not reached before the cap.

### Coverage Summary

- Dimensions covered: correctness, security, traceability, maintainability (4 of 4).
- Files reviewed: `command-attach.ts`, `command-attach-guards.vitest.ts`, `hook-wiring-check.cjs`, `hook-wiring-check.test.cjs`, plus the callers `scorer/text.ts`, `scorer/fusion.ts`, `handlers/advisor-recommend.ts`, and the two doctor YAML consumers.

### Ruled-Out Claims

- A `lastIndex` defect from the new lookahead (no `g`/`y` flag).
- A gate that reads `NO_EDIT_REQUEST` directly (only the helper and its four call sites).
- An apostrophe-folding regression (fold unchanged; curly case passes).
- A working hook command newly reported `hook-missing` (ten forms print `ok`).
- A non-launch reported `ok` for the attached short or `=`-attached long forms.
- A loop that consumes the script word as a flag argument.
- A command-injection path through a hook settings file (the check reads JSON and prints; no spawn/exec/write).
- A holdout leak in this commit (numstat touches neither prompt file).

### Holdout Hygiene

Counts only, no row text read: `scripts/routing-accuracy/holdout-prompts.jsonl` 65 rows, `command-prompts.jsonl` 176 rows. `git show --numstat 860610d783` lists four source/test files and two scratch files, and neither prompt file.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (287-295, 314-339)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` (147-163)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (674-690, 876-887)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (474)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (25-80)
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` (1-100, 100-190, 193-357)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` (1-60, 200-268)
- `.skilled/commands/doctor/assets/doctor-setup.yaml` (40, 61)
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` (37, 60)
- `review-instructions-3b.txt`; pass-three findings `AR3-P2-001`, `DR3-P1-001`; `convergence.md` (150-292)
