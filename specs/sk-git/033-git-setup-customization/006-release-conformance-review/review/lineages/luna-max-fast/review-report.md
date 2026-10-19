# Deep Review Report

- Session: fanout-luna-max-fast-1792125954096-ldhndm
- Target: specs/sk-git/033-git-setup-customization/006-release-conformance-review
- Generated: 2026-10-16T05:34:55Z
- Stop reason: maxIterationsReached

## Executive Summary

**Verdict: CONDITIONAL**

- Active findings: P0 0, P1 1, P2 17 (18 total).
- hasAdvisories: false. This flag is reserved for PASS reviews with remaining P2 findings.
- Scope: shipped v4.0.0.11 /doctor:git setup command and hardening, including the manifest targets and cross-repository command listings specified by the lead steer.
- The review reached the configured 5 of 5 iterations. The latest pass added no findings; the stop was the iteration cap, not an early convergence stop.
- Release readiness: release-blocking until the active P1 package gate finding is resolved and the remediation is re-reviewed.

## Planning Trigger

A CONDITIONAL verdict with one active P1 routes to remediation planning. Use /speckit:plan before changelog creation.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "nextCommand": "/speckit:plan",
  "reason": "One active P1 finding makes remediation planning required.",
  "activeFindings": [
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "The hook check accepts an installed target without confirming it is executable",
      "dimension": "correctness",
      "fileLine": ".skilled/commands/doctor/scripts/git-setup-check.cjs:351",
      "impact": "UNKNOWN",
      "findingClass": "false-healthy setup diagnostic",
      "affectedSurfaceHints": [
        "hooks result",
        "overall setup status"
      ]
    },
    {
      "id": "R1-P2-002",
      "severity": "P2",
      "title": "OpenCode and Pi hook checks can mistake matching text for a registered handler",
      "dimension": "correctness",
      "fileLine": ".skilled/commands/doctor/scripts/git-setup-check.cjs:891",
      "impact": "UNKNOWN",
      "findingClass": "false-healthy adapter diagnostic",
      "affectedSurfaceHints": [
        "OpenCode ai-tool-hooks result",
        "Pi ai-tool-hooks result"
      ]
    },
    {
      "id": "R2-P2-001",
      "severity": "P2",
      "title": "The required-input gate does not bind the documented --target alias",
      "dimension": "correctness",
      "fileLine": ".skilled/commands/doctor/git.md:16",
      "impact": "UNKNOWN",
      "findingClass": "conflicting argument contract",
      "affectedSurfaceHints": [
        "/doctor:git invocation",
        "setup target"
      ]
    },
    {
      "id": "R2-P2-002",
      "severity": "P2",
      "title": "The mandatory input gate appears after other command content",
      "dimension": "maintainability",
      "fileLine": ".skilled/commands/doctor/git.md:6",
      "impact": "UNKNOWN",
      "findingClass": "command-structure nonconformance",
      "affectedSurfaceHints": [
        "initial command rendering",
        "required-input handling"
      ]
    },
    {
      "id": "R2-P2-003",
      "severity": "P2",
      "title": "Visible command prose violates the Human Voice Rules punctuation standard",
      "dimension": "maintainability",
      "fileLine": ".skilled/commands/doctor/assets/doctor-git-presentation.txt:262",
      "impact": "UNKNOWN",
      "findingClass": "documentation-standard failure",
      "affectedSurfaceHints": [
        "user-visible next-step suggestions",
        "command documentation"
      ]
    },
    {
      "id": "R2-P2-004",
      "severity": "P2",
      "title": "The command description exceeds the documented 110-character target",
      "dimension": "maintainability",
      "fileLine": ".skilled/commands/doctor/git.md:2",
      "impact": "UNKNOWN",
      "findingClass": "frontmatter budget nonconformance",
      "affectedSurfaceHints": [
        "command discovery",
        "menu readability"
      ]
    },
    {
      "id": "R3-P1-001",
      "severity": "P1",
      "title": "The sk-git skill fails its package size gate",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/SKILL.md:1",
      "impact": "UNKNOWN",
      "findingClass": "package validation failure",
      "affectedSurfaceHints": [
        "skill package validation",
        "release packaging"
      ]
    },
    {
      "id": "R3-P2-001",
      "severity": "P2",
      "title": "The skill playbook summary reports an obsolete scenario range and category count",
      "dimension": "traceability",
      "fileLine": ".skilled/skills/sk-git/SKILL.md:573",
      "impact": "UNKNOWN",
      "findingClass": "stale inventory reference",
      "affectedSurfaceHints": [
        "scenario discovery",
        "release coverage claims"
      ]
    },
    {
      "id": "R3-P2-002",
      "severity": "P2",
      "title": "The playbook validation example cannot run as written",
      "dimension": "correctness",
      "fileLine": ".skilled/skills/sk-git/SKILL.md:573",
      "impact": "UNKNOWN",
      "findingClass": "invalid documented command",
      "affectedSurfaceHints": [
        "playbook validation",
        "operator instructions"
      ]
    },
    {
      "id": "R3-P2-003",
      "severity": "P2",
      "title": "The playbook wave plan double-books GIT-042 and omits GIT-044 through GIT-046",
      "dimension": "traceability",
      "fileLine": ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161",
      "impact": "UNKNOWN",
      "findingClass": "incomplete orchestration plan",
      "affectedSurfaceHints": [
        "scenario execution order",
        "evidence coverage"
      ]
    },
    {
      "id": "R3-P2-004",
      "severity": "P2",
      "title": "The skill prose has widespread HVR punctuation blockers",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/SKILL.md:220",
      "impact": "UNKNOWN",
      "findingClass": "documentation-standard failure",
      "affectedSurfaceHints": [
        "skill instruction prose",
        "published guidance"
      ]
    },
    {
      "id": "R3-P2-005",
      "severity": "P2",
      "title": "The playbook index has widespread HVR punctuation blockers",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:14",
      "impact": "UNKNOWN",
      "findingClass": "documentation-standard failure",
      "affectedSurfaceHints": [
        "operator scenario guidance",
        "release readiness instructions"
      ]
    },
    {
      "id": "R3-P2-006",
      "severity": "P2",
      "title": "The README repeats the worktree reaper outcome",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/README.md:57",
      "impact": "UNKNOWN",
      "findingClass": "proofreading defect",
      "affectedSurfaceHints": [
        "README safety summary"
      ]
    },
    {
      "id": "R4-P2-001",
      "severity": "P2",
      "title": "The setup documentation omits the status counters emitted by the command",
      "dimension": "correctness",
      "fileLine": "README.md:1507",
      "impact": "UNKNOWN",
      "findingClass": "documented output contract mismatch",
      "affectedSurfaceHints": [
        "setup output guidance",
        "operator parsing"
      ]
    },
    {
      "id": "R4-P2-002",
      "severity": "P2",
      "title": "The feature catalog skips section 3",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/feature-catalog/feature-catalog.md:105",
      "impact": "UNKNOWN",
      "findingClass": "document structure warning",
      "affectedSurfaceHints": [
        "feature inventory navigation"
      ]
    },
    {
      "id": "R4-P2-003",
      "severity": "P2",
      "title": "The feature catalog fails the Human Voice Rules punctuation scan",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/feature-catalog/feature-catalog.md:31",
      "impact": "UNKNOWN",
      "findingClass": "documentation standard failure",
      "affectedSurfaceHints": [
        "catalog prose conformance"
      ]
    },
    {
      "id": "R4-P2-004",
      "severity": "P2",
      "title": "The hooks README fails the Human Voice Rules punctuation scan",
      "dimension": "maintainability",
      "fileLine": ".skilled/skills/sk-git/scripts/hooks/README.md:31",
      "impact": "UNKNOWN",
      "findingClass": "documentation standard failure",
      "affectedSurfaceHints": [
        "hook documentation conformance"
      ]
    },
    {
      "id": "R4-P2-005",
      "severity": "P2",
      "title": "The command index contains two Human Voice Rules punctuation blockers",
      "dimension": "maintainability",
      "fileLine": ".skilled/commands/README.txt:54",
      "impact": "UNKNOWN",
      "findingClass": "documentation standard failure",
      "affectedSurfaceHints": [
        "command discovery documentation"
      ]
    }
  ],
  "remediationWorkstreams": [
    {
      "title": "P1 release gate: bring the sk-git skill package below its size limit and correct the verification claim.",
      "findingIds": [
        "R3-P1-001"
      ],
      "order": 1,
      "class": "P1 blocking"
    },
    {
      "title": "P2 setup behavior and command contract: executable readiness, adapter registration, target alias binding, and gate placement.",
      "findingIds": [
        "R1-P2-001",
        "R1-P2-002",
        "R2-P2-001",
        "R2-P2-002"
      ],
      "order": 2,
      "class": "P2 follow-up"
    },
    {
      "title": "P2 skill and playbook accuracy: scenario totals, runnable validation example, wave assignments, and README duplication.",
      "findingIds": [
        "R3-P2-001",
        "R3-P2-002",
        "R3-P2-003",
        "R3-P2-006"
      ],
      "order": 3,
      "class": "P2 follow-up"
    },
    {
      "title": "P2 writing standards: clear HVR blockers and shorten the command description.",
      "findingIds": [
        "R2-P2-003",
        "R2-P2-004",
        "R3-P2-004",
        "R3-P2-005",
        "R4-P2-003",
        "R4-P2-004",
        "R4-P2-005"
      ],
      "order": 4,
      "class": "P2 follow-up"
    },
    {
      "title": "P2 cross-reference accuracy: repair feature-catalog numbering and document the emitted setup status counters.",
      "findingIds": [
        "R4-P2-001",
        "R4-P2-002"
      ],
      "order": 5,
      "class": "P2 follow-up"
    }
  ],
  "specSeed": [
    {
      "requirement": "The setup check reports ready only when installed hook targets are executable and handler registration is evidenced structurally or by a focused runtime contract.",
      "findingIds": [
        "R1-P2-001",
        "R1-P2-002"
      ]
    },
    {
      "requirement": "The required-input gate accepts each documented target form and runs before command instructions.",
      "findingIds": [
        "R2-P2-001",
        "R2-P2-002"
      ]
    },
    {
      "requirement": "Release documentation matches current package limits, scenario inventory, runnable commands, output fields, catalog structure, and HVR standards.",
      "findingIds": [
        "R3-P1-001",
        "R3-P2-001",
        "R3-P2-002",
        "R3-P2-003",
        "R2-P2-003",
        "R2-P2-004",
        "R3-P2-004",
        "R3-P2-005",
        "R3-P2-006",
        "R4-P2-001",
        "R4-P2-002",
        "R4-P2-003",
        "R4-P2-004",
        "R4-P2-005"
      ]
    }
  ],
  "planSeed": [
    {
      "task": "Reduce the sk-git SKILL.md package below 5,000 words, align its README verification claim, and rerun the package gate.",
      "findingIds": [
        "R3-P1-001"
      ],
      "targetFiles": [
        ".skilled/skills/sk-git/SKILL.md",
        ".skilled/skills/sk-git/README.md"
      ]
    },
    {
      "task": "Correct setup readiness checks and target binding, then add regression cases for non-executable hooks, non-registration text, and the --target path.",
      "findingIds": [
        "R1-P2-001",
        "R1-P2-002",
        "R2-P2-001",
        "R2-P2-002"
      ],
      "targetFiles": [
        ".skilled/commands/doctor/scripts/git-setup-check.cjs",
        ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs",
        ".skilled/commands/doctor/git.md"
      ]
    },
    {
      "task": "Reconcile the skill playbook inventory, validator command, wave assignments, and duplicated README outcome.",
      "findingIds": [
        "R3-P2-001",
        "R3-P2-002",
        "R3-P2-003",
        "R3-P2-006"
      ],
      "targetFiles": [
        ".skilled/skills/sk-git/SKILL.md",
        ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md",
        ".skilled/skills/sk-git/README.md"
      ]
    },
    {
      "task": "Resolve HVR punctuation findings and shorten the command description to the documented limit.",
      "findingIds": [
        "R2-P2-003",
        "R2-P2-004",
        "R3-P2-004",
        "R3-P2-005",
        "R4-P2-003",
        "R4-P2-004",
        "R4-P2-005"
      ],
      "targetFiles": [
        ".skilled/commands/doctor/assets/doctor-git-presentation.txt",
        ".skilled/commands/doctor/git.md",
        ".skilled/skills/sk-git/SKILL.md",
        ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md",
        ".skilled/skills/sk-git/feature-catalog/feature-catalog.md",
        ".skilled/skills/sk-git/scripts/hooks/README.md",
        ".skilled/commands/README.txt"
      ]
    },
    {
      "task": "Restore catalog section numbering and make setup STATUS examples match emitted output.",
      "findingIds": [
        "R4-P2-001",
        "R4-P2-002"
      ],
      "targetFiles": [
        "README.md",
        ".skilled/skills/sk-git/feature-catalog/feature-catalog.md",
        ".skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md"
      ]
    }
  ],
  "findingClasses": [
    "command-structure nonconformance",
    "conflicting argument contract",
    "document structure warning",
    "documentation standard failure",
    "documentation-standard failure",
    "documented output contract mismatch",
    "false-healthy adapter diagnostic",
    "false-healthy setup diagnostic",
    "frontmatter budget nonconformance",
    "incomplete orchestration plan",
    "invalid documented command",
    "package validation failure",
    "proofreading defect",
    "stale inventory reference"
  ],
  "affectedSurfacesSeed": [
    "/doctor:git invocation",
    "OpenCode ai-tool-hooks result",
    "Pi ai-tool-hooks result",
    "README safety summary",
    "catalog prose conformance",
    "command discovery",
    "command discovery documentation",
    "command documentation",
    "evidence coverage",
    "feature inventory navigation",
    "hook documentation conformance",
    "hooks result",
    "initial command rendering",
    "menu readability",
    "operator instructions",
    "operator parsing",
    "operator scenario guidance",
    "overall setup status",
    "playbook validation",
    "published guidance",
    "release coverage claims",
    "release packaging",
    "release readiness instructions",
    "required-input handling",
    "scenario discovery",
    "scenario execution order",
    "setup output guidance",
    "setup target",
    "skill instruction prose",
    "skill package validation",
    "user-visible next-step suggestions"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

All 18 entries remain active in the reduced registry. Each entry includes evidence, impact, recommendation, disposition, finding class, scope proof, and affected surfaces. Missing impact values are marked UNKNOWN.

### R1-P2-001 — P2: The hook check accepts an installed target without confirming it is executable

- ID: R1-P2-001
- Severity: P2
- Dimension: correctness
- File:line: .skilled/commands/doctor/scripts/git-setup-check.cjs:351
- Evidence: The check tests existence and real path only before returning PASS; the installer separately applies chmod +x.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Check executable readiness and add a non-executable accepted-target regression case.
- Disposition: active
- Finding class: false-healthy setup diagnostic
- First / last seen: iteration 1 / 5
- Scope proof: The source file is present in the review manifest.
- Affected surface hints: hooks result, overall setup status

### R1-P2-002 — P2: OpenCode and Pi hook checks can mistake matching text for a registered handler

- ID: R1-P2-002
- Severity: P2
- Dimension: correctness
- File:line: .skilled/commands/doctor/scripts/git-setup-check.cjs:891
- Evidence: The detector checks event and module tokens anywhere in source text; current fixtures test only an empty stub and the real adapter.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Validate registration structurally or through a focused runtime contract and add comment-only/dead-string negative cases.
- Disposition: active
- Finding class: false-healthy adapter diagnostic
- First / last seen: iteration 1 / 5
- Scope proof: The source file and its regression test are present in the review manifest.
- Affected surface hints: OpenCode ai-tool-hooks result, Pi ai-tool-hooks result

### R2-P2-001 — P2: The required-input gate does not bind the documented --target alias

- ID: R2-P2-001
- Severity: P2
- Dimension: correctness
- File:line: .skilled/commands/doctor/git.md:16
- Evidence: The gate requires a positional target and handles the missing-target branch before the later table that advertises --target as a compatibility alias.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Recognize --target inside the mandatory input gate before the missing-target check, or remove the alias from the documented surface.
- Disposition: active
- Finding class: conflicting argument contract
- First / last seen: iteration 2 / 5
- Scope proof: The router and route manifest are listed in the bound review manifest.
- Affected surface hints: /doctor:git invocation, setup target

### R2-P2-002 — P2: The mandatory input gate appears after other command content

- ID: R2-P2-002
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/commands/doctor/git.md:6
- Evidence: A marker comment, H1 title and descriptive paragraph precede the required input gate.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Move the blocking gate immediately after frontmatter.
- Disposition: active
- Finding class: command-structure nonconformance
- First / last seen: iteration 2 / 5
- Scope proof: The router is listed in the bound review manifest.
- Affected surface hints: initial command rendering, required-input handling

### R2-P2-003 — P2: Visible command prose violates the Human Voice Rules punctuation standard

- ID: R2-P2-003
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/commands/doctor/assets/doctor-git-presentation.txt:262
- Evidence: The HVR scan found four semicolons in visible next-step prose; the presentation's mechanical ceiling was 80/100, below the 85-point publish threshold.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Replace semicolons with sentence breaks or conjunctions and remove Oxford commas where they do not carry meaning.
- Disposition: active
- Finding class: documentation-standard failure
- First / last seen: iteration 2 / 5
- Scope proof: The presentation, router and scripts README are listed in the bound review manifest.
- Affected surface hints: user-visible next-step suggestions, command documentation

### R2-P2-004 — P2: The command description exceeds the documented 110-character target

- ID: R2-P2-004
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/commands/doctor/git.md:2
- Evidence: The command validator reports 133 characters and the command authoring contract targets 110 or fewer.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Shorten the description while retaining the three target families and read-only setup purpose.
- Disposition: active
- Finding class: frontmatter budget nonconformance
- First / last seen: iteration 2 / 5
- Scope proof: The router is listed in the bound review manifest.
- Affected surface hints: command discovery, menu readability

### R3-P1-001 — P1: The sk-git skill fails its package size gate

- ID: R3-P1-001
- Severity: P1
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/SKILL.md:1
- Evidence: validate_skill_package.py exited 1 and reported 5038 words against the 5000-word cap; README verification currently says the check reports PASS.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Trim SKILL.md below 5000 words and rerun the package validator before release.
- Disposition: active
- Finding class: package validation failure
- First / last seen: iteration 3 / 5
- Scope proof: SKILL.md and the README are listed in the bound review manifest.
- Affected surface hints: skill package validation, release packaging

### R3-P2-001 — P2: The skill playbook summary reports an obsolete scenario range and category count

- ID: R3-P2-001
- Severity: P2
- Dimension: traceability
- File:line: .skilled/skills/sk-git/SKILL.md:573
- Evidence: The skill says GIT-001..GIT-042 across 8 categories; the playbook validator reports 46 scenarios and 9 categories, and GIT-044 through GIT-046 appear in the index.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Update the summary range and category count to match the package inventory.
- Disposition: active
- Finding class: stale inventory reference
- First / last seen: iteration 3 / 5
- Scope proof: The skill and playbook index are listed in the bound review manifest.
- Affected surface hints: scenario discovery, release coverage claims

### R3-P2-002 — P2: The playbook validation example cannot run as written

- ID: R3-P2-002
- Severity: P2
- Dimension: correctness
- File:line: .skilled/skills/sk-git/SKILL.md:573
- Evidence: The command runs a Python validator through bash and combines a repository-root validator path with a skill-relative target path, so no single working directory resolves both.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Invoke the validator with Python and make both paths relative to one declared working directory.
- Disposition: active
- Finding class: invalid documented command
- First / last seen: iteration 3 / 5
- Scope proof: The skill is listed in the bound review manifest.
- Affected surface hints: playbook validation, operator instructions

### R3-P2-003 — P2: The playbook wave plan double-books GIT-042 and omits GIT-044 through GIT-046

- ID: R3-P2-003
- Severity: P2
- Dimension: traceability
- File:line: .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161
- Evidence: Wave 5 includes GIT-042 in its inclusive range, wave 6 assigns GIT-042 again, and indexed scenarios GIT-044 through GIT-046 occur in no suggested wave.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Assign each scenario to one wave and add GIT-044 through GIT-046 to the plan.
- Disposition: active
- Finding class: incomplete orchestration plan
- First / last seen: iteration 3 / 5
- Scope proof: The playbook index is listed in the bound review manifest.
- Affected surface hints: scenario execution order, evidence coverage

### R3-P2-004 — P2: The skill prose has widespread HVR punctuation blockers

- ID: R3-P2-004
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/SKILL.md:220
- Evidence: HVR scan reports 61 hard punctuation findings and 314 mechanical deductions across 579 lines, a density of 54.2 deductions per 100 lines under the long-document rule.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Revise authored prose to remove prohibited punctuation, then rerun the scan and assess the long-document density.
- Disposition: active
- Finding class: documentation-standard failure
- First / last seen: iteration 3 / 5
- Scope proof: SKILL.md is listed in the bound review manifest.
- Affected surface hints: skill instruction prose, published guidance

### R3-P2-005 — P2: The playbook index has widespread HVR punctuation blockers

- ID: R3-P2-005
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:14
- Evidence: HVR scan reports 53 hard punctuation findings and 268 mechanical deductions across 1024 lines, a density of 26.2 deductions per 100 lines under the long-document rule.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Revise authored prose to remove prohibited punctuation and rerun the scan.
- Disposition: active
- Finding class: documentation-standard failure
- First / last seen: iteration 3 / 5
- Scope proof: The playbook index is listed in the bound review manifest.
- Affected surface hints: operator scenario guidance, release readiness instructions

### R3-P2-006 — P2: The README repeats the worktree reaper outcome

- ID: R3-P2-006
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/README.md:57
- Evidence: The row says “Keeps the rest and keeps and reports the rest,” repeating the outcome and obscuring the report-only behavior.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: State once that qualifying wrapper worktrees are reaped and all other worktrees are reported without removal.
- Disposition: active
- Finding class: proofreading defect
- First / last seen: iteration 3 / 5
- Scope proof: The README is listed in the bound review manifest.
- Affected surface hints: README safety summary

### R4-P2-001 — P2: The setup documentation omits the status counters emitted by the command

- ID: R4-P2-001
- Severity: P2
- Dimension: correctness
- File:line: README.md:1507
- Evidence: README.md:1507 and doctor-git-settings.md:29 describe the final line as a bare STATUS value. git-setup-check.cjs:1007, 1009, and 1011 append checks=11 or degraded/failed/skipped/unknown counts to each status.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Document the status-line counters or change the command output to match the stated exact line.
- Disposition: active
- Finding class: documented output contract mismatch
- First / last seen: iteration 4 / 5
- Scope proof: The root README and catalog leaf are listed in the bound manifest.
- Affected surface hints: setup output guidance, operator parsing

### R4-P2-002 — P2: The feature catalog skips section 3

- ID: R4-P2-002
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:105
- Evidence: The catalog headings move from section 2 at line 25 to section 4 at line 105; validate_document.py reports non_sequential_numbering, expected section 3 and found 4.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Restore the missing section or renumber the remaining sections and update the overview.
- Disposition: active
- Finding class: document structure warning
- First / last seen: iteration 4 / 5
- Scope proof: The feature catalog is listed in the bound manifest.
- Affected surface hints: feature inventory navigation

### R4-P2-003 — P2: The feature catalog fails the Human Voice Rules punctuation scan

- ID: R4-P2-003
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:31
- Evidence: The HVR scan exits 1 with 12 hard punctuation blockers and 61 mechanical deductions across 233 lines; its mechanical ceiling is 39.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Revise authored prose to remove prohibited punctuation and rerun the HVR scan.
- Disposition: active
- Finding class: documentation standard failure
- First / last seen: iteration 4 / 5
- Scope proof: The feature catalog is listed in the bound manifest.
- Affected surface hints: catalog prose conformance

### R4-P2-004 — P2: The hooks README fails the Human Voice Rules punctuation scan

- ID: R4-P2-004
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/skills/sk-git/scripts/hooks/README.md:31
- Evidence: The HVR scan exits 1 with 32 hard punctuation blockers and 161 mechanical deductions across 219 lines; its mechanical ceiling is 0.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Revise authored prose to remove prohibited punctuation and rerun the HVR scan.
- Disposition: active
- Finding class: documentation standard failure
- First / last seen: iteration 4 / 5
- Scope proof: The hooks README is listed in the bound manifest.
- Affected surface hints: hook documentation conformance

### R4-P2-005 — P2: The command index contains two Human Voice Rules punctuation blockers

- ID: R4-P2-005
- Severity: P2
- Dimension: maintainability
- File:line: .skilled/commands/README.txt:54
- Evidence: The HVR scan exits 1 with two hard semicolon blockers at lines 54 and 203 and 11 mechanical deductions across 349 lines; its mechanical ceiling is 89.
- Impact: UNKNOWN (not separately recorded in the finding detail).
- Fix recommendation: Replace the two semicolons with sentence breaks or conjunctions, then rerun the HVR scan.
- Disposition: active
- Finding class: documentation standard failure
- First / last seen: iteration 4 / 5
- Scope proof: The command index is listed in the bound manifest.
- Affected surface hints: command discovery documentation

## Remediation Workstreams

Execute the active P1 release gate first. The P2 items follow as non-blocking remediation workstreams.

1. **P1 release gate: bring the sk-git skill package below its size limit and correct the verification claim.** — R3-P1-001.
2. **P2 setup behavior and command contract: executable readiness, adapter registration, target alias binding, and gate placement.** — R1-P2-001, R1-P2-002, R2-P2-001, R2-P2-002.
3. **P2 skill and playbook accuracy: scenario totals, runnable validation example, wave assignments, and README duplication.** — R3-P2-001, R3-P2-002, R3-P2-003, R3-P2-006.
4. **P2 writing standards: clear HVR blockers and shorten the command description.** — R2-P2-003, R2-P2-004, R3-P2-004, R3-P2-005, R4-P2-003, R4-P2-004, R4-P2-005.
5. **P2 cross-reference accuracy: repair feature-catalog numbering and document the emitted setup status counters.** — R4-P2-001, R4-P2-002.

## Spec Seed

The follow-on remediation spec should preserve these acceptance requirements:

- The setup check reports ready only when installed hook targets are executable and handler registration is evidenced structurally or by a focused runtime contract. (R1-P2-001, R1-P2-002)
- The required-input gate accepts each documented target form and runs before command instructions. (R2-P2-001, R2-P2-002)
- Release documentation matches current package limits, scenario inventory, runnable commands, output fields, catalog structure, and HVR standards. (R3-P1-001, R3-P2-001, R3-P2-002, R3-P2-003, R2-P2-003, R2-P2-004, R3-P2-004, R3-P2-005, R3-P2-006, R4-P2-001, R4-P2-002, R4-P2-003, R4-P2-004, R4-P2-005)

## Plan Seed

Create tasks that retain finding IDs and verify each changed surface:

1. **Reduce the sk-git SKILL.md package below 5,000 words, align its README verification claim, and rerun the package gate.**
   - Findings: R3-P1-001
   - Targets: .skilled/skills/sk-git/SKILL.md, .skilled/skills/sk-git/README.md
2. **Correct setup readiness checks and target binding, then add regression cases for non-executable hooks, non-registration text, and the --target path.**
   - Findings: R1-P2-001, R1-P2-002, R2-P2-001, R2-P2-002
   - Targets: .skilled/commands/doctor/scripts/git-setup-check.cjs, .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .skilled/commands/doctor/git.md
3. **Reconcile the skill playbook inventory, validator command, wave assignments, and duplicated README outcome.**
   - Findings: R3-P2-001, R3-P2-002, R3-P2-003, R3-P2-006
   - Targets: .skilled/skills/sk-git/SKILL.md, .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md, .skilled/skills/sk-git/README.md
4. **Resolve HVR punctuation findings and shorten the command description to the documented limit.**
   - Findings: R2-P2-003, R2-P2-004, R3-P2-004, R3-P2-005, R4-P2-003, R4-P2-004, R4-P2-005
   - Targets: .skilled/commands/doctor/assets/doctor-git-presentation.txt, .skilled/commands/doctor/git.md, .skilled/skills/sk-git/SKILL.md, .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md, .skilled/skills/sk-git/feature-catalog/feature-catalog.md, .skilled/skills/sk-git/scripts/hooks/README.md, .skilled/commands/README.txt
5. **Restore catalog section numbering and make setup STATUS examples match emitted output.**
   - Findings: R4-P2-001, R4-P2-002
   - Targets: README.md, .skilled/skills/sk-git/feature-catalog/feature-catalog.md, .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md

## Traceability Status

### Core Protocols

| Protocol | Class | Result | Evidence and unresolved drift |
|---|---|---|---|
| spec_code | core | partial | .skilled/commands/doctor/git.md:16, .skilled/commands/doctor/git.md:62, .skilled/commands/doctor/_routes.yaml:276 — The documented positional gate and later --target alias table do not define one binding path. |
| checklist_evidence | core | partial | .skilled/commands/doctor/git.md:2, .skilled/commands/doctor/assets/doctor-git-presentation.txt:262, .skilled/commands/doctor/scripts/README.md:65 — Route validation passed; command validation emitted one soft description warning; HVR rejected the presentation; fixture tests were not run because they write outside the lineage boundary. |

### Overlay Protocols

| Protocol | Class | Result | Evidence and unresolved drift |
|---|---|---|---|
| changelog_authoring | overlay | pass | .skilled/skills/sk-git/changelog/v1.9.0.0.md:1, .skilled/changelog/skilled/v4.0.0.11.md:1 — Both changelogs pass validate_document.py with zero issues. Their HVR scans report zero hard blockers. |
| cross_repo_setup_listing | overlay | pass | README.md:1258, .skilled/commands/doctor/_routes.yaml:237, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17 — Final repository search and route validation found the setup target consistently listed. The route validator reports 14 valid routes and two informational duplicate-flag warnings. |
| cross_target_output_contract | overlay | partial | .skilled/skills/sk-git/feature-catalog/feature-catalog.md:163, README.md:1507 — The setup documentation's exact STATUS-line mismatch from R4-P2-001 remains active; the changelogs introduce no new output claim. |
| feature_catalog_and_output_contract | overlay | partial | .skilled/skills/sk-git/feature-catalog/feature-catalog.md:155, .skilled/commands/doctor/scripts/git-setup-check.cjs:1007 — The catalog package validator passes with zero violations; its feature-catalog structure check warns that section 3 is missing, and the documented final status line omits emitted counters. |
| human_voice_conformance | overlay | partial | .skilled/skills/sk-git/feature-catalog/feature-catalog.md:31, .skilled/skills/sk-git/scripts/hooks/README.md:31, .skilled/commands/README.txt:54 — The three scoped HVR scans returned hard punctuation blockers; counts and line locations are recorded in this iteration's findings. |
| playbook_capability | overlay | partial | .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161, .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:1 — The playbook package validator passes with 46 scenarios and 9 categories; the wave plan still duplicates GIT-042 and omits GIT-044 through GIT-046. |
| readme_reference_resolution | overlay | partial | .skilled/skills/sk-git/scripts/hooks/README.md:18, README.md:1507 — Readme reference checks reported path errors for seven documents and the hooks code-folder check reported 18 unresolved inline paths. Manual inspection found the checker treats slash commands and repo-root examples as local paths; no concrete broken setup reference was confirmed. |
| setup_regression_tests | overlay | pass | .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .github/scripts/tests/check-gate-inputs.test.sh — The Node suite passes 44/44 and the shell suite passes 50/50 with test temp roots and the Apple tool cache directed into this lineage. |
| sk_code_drift_guards | overlay | pass | .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs — All four individual sk-code drift guards pass. Alignment drift has zero errors and 278 non-blocking warnings across 23,361 scanned files; stack folders pass for six language folders, router sync passes 5/5, and doc claims passes 4/4. |
| skill_agent | overlay | partial | .skilled/skills/sk-git/SKILL.md:1, .skilled/skills/sk-git/README.md:272 — The skill package validator fails the 5000-word cap; the README verification row says the package check passes. |

AC_COVERAGE: exempt for this review because the lead steer excludes the spec-folder scaffold documents; no acceptance-criteria coverage claim is made.

## Deferred Items

- The active P1 and P2 findings are carried into the remediation plan; none is advisory-only.
- No traceability protocol is marked blocked in the final recorded results. cross_target_output_contract remains partial because the STATUS-line mismatch is active.
- The optional Resource Map Coverage Gate is omitted because the init record has no resource_map_present field. The reducer-generated lineage resource-map.md was emitted after initialization.
- AC_COVERAGE is exempt from this scoped review because the lead steer excludes the spec scaffold docs.
- Workflow boundary conflict: the prescribed continuity save and strict packet validator would write outside the lineage. The dispatcher explicitly prohibited out-of-lineage writes, so continuity save and validate.sh were not run.
- Synthesis closeout warning: The lineage-local synthesis-closeout command recorded a warning event, synthesis_incomplete, with stopReason maxIterationsReached. Its invariant check found 57 iteration finding instances and 36 registry entries (18 open plus 18 repeated), with 0 missing structured matches, 0 parse failures, and no missing artifacts. The iteration state records contain cumulative findingDetails snapshots, so the checker counts repeated snapshots across iterations. The final active verdict remains based on the deduplicated registry: P0 0, P1 1, P2 17. The append-only iteration records were preserved.

## Dimension Expansion Map

Reducer-owned divergence state:
```json
{
  "started": [],
  "completed": [],
  "failed": [],
  "overrides": [],
  "saturatedDirections": [],
  "remainingFrontier": [],
  "currentFocus": ""
}
```

Selected review directions recorded by iteration:
| Iteration | Focus | Dimensions |
|---:|---|---|
| 1 | correctness and security: setup hook readiness and advisory registration diagnostics | correctness, security, traceability |
| 2 | command surface: target binding, route parity, presentation prose, and documentation contracts | correctness, traceability, maintainability |
| 3 | sk-git skill docs: package size, playbook references and plan, and documentation standards | correctness, maintainability, traceability |
| 4 | cross-repo references, setup discoverability, and documentation conformance | correctness, maintainability, traceability |
| 5 | release changelogs and final cross-target consistency | correctness, traceability, maintainability |

Council artifact references: none recorded.

## Search Ledger

Reducer-owned search state. Search debt is empty; search coverage and candidate coverage are recorded.

```json
{
  "searchCoverage": {
    "requiredBugClasses": [
      "changelog_structure",
      "hvr_punctuation",
      "doctor_target_discovery",
      "route_contract",
      "setup_runtime_behavior",
      "cross_iteration_consistency"
    ],
    "covered": [
      "changelog_structure",
      "hvr_punctuation",
      "doctor_target_discovery",
      "route_contract",
      "setup_runtime_behavior",
      "cross_iteration_consistency"
    ],
    "ruledOut": [
      "changelog_metadata_or_structure_defect",
      "changelog_hvr_blocker",
      "setup_target_name_drift",
      "route_manifest_drift",
      "new_changelog_output_contract_conflict"
    ],
    "deferred": [],
    "blocked": [],
    "graphCoverageMode": "graphless_fallback"
  },
  "candidateCoverage": {
    "covered": [
      "adapter_registration_detection",
      "argument_alias_gate",
      "changelog_structure",
      "command_description_budget",
      "cross_iteration_consistency",
      "cross_repo_command_discovery",
      "doctor_target_discovery",
      "document_structure",
      "documented_output_contract",
      "documented_validator_invocation",
      "gate_first_structure",
      "hook_execution_readiness",
      "human_voice_rules",
      "hvr_long_document_punctuation",
      "hvr_punctuation",
      "playbook_inventory_drift",
      "readme_proofreading",
      "route_contract",
      "setup_runtime_behavior",
      "skill_package_size_gate",
      "wave_plan_uniqueness_and_completeness"
    ],
    "ruledOut": [
      "changelog_hvr_blocker",
      "changelog_metadata_or_structure_defect",
      "changelog_structure",
      "doctor_target_discovery",
      "hvr_punctuation",
      "new_changelog_output_contract_conflict",
      "playbook package structure and local references: validator reports 0 violations",
      "README, setup scenario, and playbook index formatting: validators report 0 issues",
      "route_manifest_drift",
      "setup_runtime_behavior",
      "setup_target_name_drift",
      "setup_target_name_inconsistency"
    ],
    "deferred": [],
    "blocked": [],
    "byBugClass": {
      "hook_execution_readiness": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          1
        ]
      },
      "adapter_registration_detection": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          1
        ]
      },
      "argument_alias_gate": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          2
        ]
      },
      "gate_first_structure": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          2
        ]
      },
      "hvr_punctuation": {
        "covered": true,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          2,
          5
        ]
      },
      "command_description_budget": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          2
        ]
      },
      "skill_package_size_gate": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "playbook_inventory_drift": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "documented_validator_invocation": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "wave_plan_uniqueness_and_completeness": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "hvr_long_document_punctuation": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "readme_proofreading": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "playbook package structure and local references: validator reports 0 violations": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "README, setup scenario, and playbook index formatting: validators report 0 issues": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          3
        ]
      },
      "cross_repo_command_discovery": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "documented_output_contract": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "document_structure": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "human_voice_rules": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "setup_target_name_inconsistency": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "readme_reference_integrity": {
        "covered": false,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          4
        ]
      },
      "changelog_structure": {
        "covered": true,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "doctor_target_discovery": {
        "covered": true,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "route_contract": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "setup_runtime_behavior": {
        "covered": true,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "cross_iteration_consistency": {
        "covered": true,
        "ruledOut": false,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "changelog_metadata_or_structure_defect": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "changelog_hvr_blocker": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "setup_target_name_drift": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "route_manifest_drift": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      },
      "new_changelog_output_contract_conflict": {
        "covered": false,
        "ruledOut": true,
        "deferred": false,
        "blocked": false,
        "iterations": [
          5
        ]
      }
    }
  },
  "searchDebt": [],
  "ruledOutCandidates": [
    {
      "iteration": 5,
      "id": "SL-019",
      "dimension": "traceability",
      "targetRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md",
        ".skilled/changelog/skilled/v4.0.0.11.md"
      ],
      "bugClass": "changelog_structure",
      "disposition": "ruled_out",
      "rationale": "The structural validator passes both release entries.",
      "evidenceRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md:1",
        ".skilled/changelog/skilled/v4.0.0.11.md:1"
      ],
      "reason": "Both changelog validators returned VALID with zero issues."
    },
    {
      "iteration": 5,
      "id": "SL-020",
      "dimension": "maintainability",
      "targetRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md",
        ".skilled/changelog/skilled/v4.0.0.11.md"
      ],
      "bugClass": "hvr_punctuation",
      "disposition": "ruled_out",
      "rationale": "Neither release entry has a hard HVR blocker.",
      "evidenceRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md:23",
        ".skilled/changelog/skilled/v4.0.0.11.md:21"
      ],
      "reason": "Both HVR scans reported hardBlockers=0."
    },
    {
      "iteration": 5,
      "id": "SL-021",
      "dimension": "traceability",
      "targetRefs": [
        "README.md",
        ".skilled/commands/doctor/_routes.yaml",
        ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md",
        ".skilled/skills/sk-git/feature-catalog/feature-catalog.md"
      ],
      "bugClass": "doctor_target_discovery",
      "disposition": "ruled_out",
      "rationale": "The final search found consistent setup naming in the listed surfaces.",
      "evidenceRefs": [
        "README.md:1258",
        ".skilled/commands/doctor/_routes.yaml:237",
        ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17"
      ],
      "reason": "No setup target naming drift was observed in the cross-target search."
    },
    {
      "iteration": 5,
      "id": "SL-022",
      "dimension": "correctness",
      "targetRefs": [
        ".skilled/commands/doctor/scripts/git-setup-check.cjs",
        ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs",
        ".github/scripts/tests/check-gate-inputs.test.sh"
      ],
      "bugClass": "setup_runtime_behavior",
      "disposition": "ruled_out",
      "rationale": "Both specified regression suites pass when fixtures are isolated within the lineage boundary.",
      "evidenceRefs": [
        ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs",
        ".github/scripts/tests/check-gate-inputs.test.sh"
      ],
      "reason": "The final bounded runs both exited 0 with zero failed cases."
    }
  ],
  "cleanSearchProof": [
    {
      "iteration": 5,
      "id": "SL-019",
      "dimension": "traceability",
      "targetRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md",
        ".skilled/changelog/skilled/v4.0.0.11.md"
      ],
      "bugClass": "changelog_structure",
      "disposition": "ruled_out",
      "rationale": "The structural validator passes both release entries.",
      "evidenceRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md:1",
        ".skilled/changelog/skilled/v4.0.0.11.md:1"
      ],
      "proof": "Both changelog validators returned VALID with zero issues."
    },
    {
      "iteration": 5,
      "id": "SL-020",
      "dimension": "maintainability",
      "targetRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md",
        ".skilled/changelog/skilled/v4.0.0.11.md"
      ],
      "bugClass": "hvr_punctuation",
      "disposition": "ruled_out",
      "rationale": "Neither release entry has a hard HVR blocker.",
      "evidenceRefs": [
        ".skilled/skills/sk-git/changelog/v1.9.0.0.md:23",
        ".skilled/changelog/skilled/v4.0.0.11.md:21"
      ],
      "proof": "Both HVR scans reported hardBlockers=0."
    },
    {
      "iteration": 5,
      "id": "SL-021",
      "dimension": "traceability",
      "targetRefs": [
        "README.md",
        ".skilled/commands/doctor/_routes.yaml",
        ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md",
        ".skilled/skills/sk-git/feature-catalog/feature-catalog.md"
      ],
      "bugClass": "doctor_target_discovery",
      "disposition": "ruled_out",
      "rationale": "The final search found consistent setup naming in the listed surfaces.",
      "evidenceRefs": [
        "README.md:1258",
        ".skilled/commands/doctor/_routes.yaml:237",
        ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17"
      ],
      "proof": "No setup target naming drift was observed in the cross-target search."
    },
    {
      "iteration": 5,
      "id": "SL-022",
      "dimension": "correctness",
      "targetRefs": [
        ".skilled/commands/doctor/scripts/git-setup-check.cjs",
        ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs",
        ".github/scripts/tests/check-gate-inputs.test.sh"
      ],
      "bugClass": "setup_runtime_behavior",
      "disposition": "ruled_out",
      "rationale": "Both specified regression suites pass when fixtures are isolated within the lineage boundary.",
      "evidenceRefs": [
        ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs",
        ".github/scripts/tests/check-gate-inputs.test.sh"
      ],
      "proof": "The final bounded runs both exited 0 with zero failed cases."
    }
  ]
}
```

## Audit Appendix

### Iteration replay

| Iteration | Focus | Dimensions | New findings P0/P1/P2 | Active P0/P1/P2 after pass | Ratio | Duration | Verdict |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | correctness and security: setup hook readiness and advisory registration diagnostics | correctness, security, traceability | 0/0/2 | 0/0/2 | 1 | 7.7 min | PASS |
| 2 | command surface: target binding, route parity, presentation prose, and documentation contracts | correctness, traceability, maintainability | 0/0/4 | 0/0/6 | 0.6667 | 4.3 min | PASS |
| 3 | sk-git skill docs: package size, playbook references and plan, and documentation standards | correctness, maintainability, traceability | 0/1/6 | 0/1/12 | 0.5385 | 5.8 min | CONDITIONAL |
| 4 | cross-repo references, setup discoverability, and documentation conformance | correctness, maintainability, traceability | 0/0/5 | 0/1/17 | 0.2778 | 7.0 min | PASS |
| 5 | release changelogs and final cross-target consistency | correctness, traceability, maintainability | 0/0/0 | 0/1/17 | 0 | 11.3 min | PASS |

### Coverage

- Dimensions covered across the run: correctness, security, traceability, maintainability (4/4).
- Five iterations were executed; iteration 5 added no new findings and rechecked the P1 and status-output mismatch.
- Reducer telemetry after iteration 5: 18 open findings, 0 resolved, convergence score 1, graph convergence 0, search debt 0, corruption 0. These are telemetry only; stop reason remains maxIterationsReached.

### File coverage

The review selected 25 manifest/cross-reference targets over five passes. Iteration-specific reviewed paths are recorded in each JSONL iteration row and its paired delta; the finding evidence above identifies every active finding location.

### Terminal synthesis

- Required stop reason recorded for terminal synthesis: maxIterationsReached.
- Final aggregate verdict: CONDITIONAL; no active P0, one active P1, and 17 active P2 findings.
- Terminal write-boundary resolution: event staging is lineage-local; no state outside this directory was written.

### Convergence summary

```json
{
  "stopReason": "maxIterationsReached",
  "iterationCount": 5,
  "convergenceScore": 1,
  "graphConvergenceScore": 0,
  "searchDebt": [],
  "corruptionWarnings": [],
  "dimensionCoverage": {
    "correctness": true,
    "security": true,
    "traceability": true,
    "maintainability": true
  }
}
```

### Cross-reference appendix

#### Core Protocols

- spec_code: partial — .skilled/commands/doctor/git.md:16, .skilled/commands/doctor/git.md:62, .skilled/commands/doctor/_routes.yaml:276. The documented positional gate and later --target alias table do not define one binding path.
- checklist_evidence: partial — .skilled/commands/doctor/git.md:2, .skilled/commands/doctor/assets/doctor-git-presentation.txt:262, .skilled/commands/doctor/scripts/README.md:65. Route validation passed; command validation emitted one soft description warning; HVR rejected the presentation; fixture tests were not run because they write outside the lineage boundary.

#### Overlay Protocols

- changelog_authoring: pass — .skilled/skills/sk-git/changelog/v1.9.0.0.md:1, .skilled/changelog/skilled/v4.0.0.11.md:1. Both changelogs pass validate_document.py with zero issues. Their HVR scans report zero hard blockers.
- cross_repo_setup_listing: pass — README.md:1258, .skilled/commands/doctor/_routes.yaml:237, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17. Final repository search and route validation found the setup target consistently listed. The route validator reports 14 valid routes and two informational duplicate-flag warnings.
- cross_target_output_contract: partial — .skilled/skills/sk-git/feature-catalog/feature-catalog.md:163, README.md:1507. The setup documentation's exact STATUS-line mismatch from R4-P2-001 remains active; the changelogs introduce no new output claim.
- feature_catalog_and_output_contract: partial — .skilled/skills/sk-git/feature-catalog/feature-catalog.md:155, .skilled/commands/doctor/scripts/git-setup-check.cjs:1007. The catalog package validator passes with zero violations; its feature-catalog structure check warns that section 3 is missing, and the documented final status line omits emitted counters.
- human_voice_conformance: partial — .skilled/skills/sk-git/feature-catalog/feature-catalog.md:31, .skilled/skills/sk-git/scripts/hooks/README.md:31, .skilled/commands/README.txt:54. The three scoped HVR scans returned hard punctuation blockers; counts and line locations are recorded in this iteration's findings.
- playbook_capability: partial — .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161, .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:1. The playbook package validator passes with 46 scenarios and 9 categories; the wave plan still duplicates GIT-042 and omits GIT-044 through GIT-046.
- readme_reference_resolution: partial — .skilled/skills/sk-git/scripts/hooks/README.md:18, README.md:1507. Readme reference checks reported path errors for seven documents and the hooks code-folder check reported 18 unresolved inline paths. Manual inspection found the checker treats slash commands and repo-root examples as local paths; no concrete broken setup reference was confirmed.
- setup_regression_tests: pass — .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .github/scripts/tests/check-gate-inputs.test.sh. The Node suite passes 44/44 and the shell suite passes 50/50 with test temp roots and the Apple tool cache directed into this lineage.
- sk_code_drift_guards: pass — .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs. All four individual sk-code drift guards pass. Alignment drift has zero errors and 278 non-blocking warnings across 23,361 scanned files; stack folders pass for six language folders, router sync passes 5/5, and doc claims passes 4/4.
- skill_agent: partial — .skilled/skills/sk-git/SKILL.md:1, .skilled/skills/sk-git/README.md:272. The skill package validator fails the 5000-word cap; the README verification row says the package check passes.

### Ruled-out claims

- SL-019 (iteration 5, changelog_structure): The structural validator passes both release entries.
- SL-020 (iteration 5, hvr_punctuation): Neither release entry has a hard HVR blocker.
- SL-021 (iteration 5, doctor_target_discovery): The final search found consistent setup naming in the listed surfaces.
- SL-022 (iteration 5, setup_runtime_behavior): Both specified regression suites pass when fixtures are isolated within the lineage boundary.

### Sources reviewed

- Iteration 1: .skilled/commands/doctor/scripts/git-setup-check.cjs:314; .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:68; .github/workflows/gate-inputs.yml:16; .github/scripts/check-gate-inputs.sh:126; .github/scripts/tests/check-gate-inputs.test.sh:14
- Iteration 2: .skilled/commands/doctor/git.md:1; .skilled/commands/doctor/assets/doctor-git-setup.yaml:1; .skilled/commands/doctor/assets/doctor-git-presentation.txt:1; .skilled/commands/doctor/_routes.yaml:237; .skilled/commands/doctor/scripts/README.md:1
- Iteration 3: .skilled/skills/sk-git/SKILL.md:1; .skilled/skills/sk-git/README.md:1; .skilled/skills/sk-git/assets/commit-message-template.md:1; .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:1; .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:1; specs/sk-git/033-git-setup-customization/006-release-conformance-review/review/lineages/luna-max-fast/steer.md
- Iteration 4: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:29; .skilled/skills/sk-git/feature-catalog/feature-catalog.md:31; .skilled/skills/sk-git/feature-catalog/feature-catalog.md:105; .skilled/skills/sk-git/scripts/hooks/README.md:31; README.md:1507; .skilled/commands/README.txt:54; .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17; .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26; .hermes/skills/sk-git/SKILL.md:578; specs/sk-git/033-git-setup-customization/006-release-conformance-review/review/lineages/luna-max-fast/steer.md
- Iteration 5: .skilled/skills/sk-git/changelog/v1.9.0.0.md:1; .skilled/changelog/skilled/v4.0.0.11.md:1; README.md:1258; .skilled/commands/doctor/_routes.yaml:237; .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17; .skilled/skills/sk-git/feature-catalog/feature-catalog.md:163; .skilled/commands/doctor/scripts/git-setup-check.cjs:1007; specs/sk-git/033-git-setup-customization/006-release-conformance-review/review/lineages/luna-max-fast/steer.md

### Terminal synthesis

- Required stop reason is present on the appended synthesis_incomplete warning record: maxIterationsReached.
- Final aggregate verdict: CONDITIONAL; active counts are P0 0, P1 1, P2 17.
- Terminal write-boundary resolution: synthesis event staging and all generated artifacts remain inside the authorized lineage.
- The lineage-local synthesis-closeout command recorded a warning event, synthesis_incomplete, with stopReason maxIterationsReached. Its invariant check found 57 iteration finding instances and 36 registry entries (18 open plus 18 repeated), with 0 missing structured matches, 0 parse failures, and no missing artifacts. The iteration state records contain cumulative findingDetails snapshots, so the checker counts repeated snapshots across iterations. The final active verdict remains based on the deduplicated registry: P0 0, P1 1, P2 17. The append-only iteration records were preserved.
