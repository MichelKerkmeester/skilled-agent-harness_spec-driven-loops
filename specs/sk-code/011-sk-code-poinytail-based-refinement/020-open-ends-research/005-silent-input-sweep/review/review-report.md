---
title: "Review Report: silent input sweep"
description: "Ten-iteration deep review of 273 CLI scripts under .skilled for silently accepted options and exit 0 on detected problems; 14 P1 and 50 P2 findings, every one reproduced by the orchestrator."
---
# Review Report: Silent Input Sweep

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0 0, P1 14, P2 50
- **Scope:** 273 argv-parsing CLI entry points under `.skilled/bin`, `.skilled/skills/**/scripts`, `.skilled/skills/*/runtime/cli` and `.skilled/commands/*/scripts`, split into ten LOC-balanced slices, one per iteration. The scope list is `reviewScopeFiles` in `deep-review-config.json`.
- **Defect class 1** (unknown or misspelled option accepted silently): 54 findings. The worst shape is a mode switch read with `argv.includes('--check')`: a typo of the check flag falls into the write path and exits 0 (F2, F4, F7, F11, F14).
- **Defect class 2** (exit 0 on a detected problem, or a header documenting an option the parser rejects): 10 findings, all of the exit-0 kind. No script was found whose header documents an option its parser rejects.
- Every row below was rerun by the orchestrator from the repository root. 8 executor findings were dropped and 4 downgraded; section 9 lists them with the reason.
- The two prior instances named in `spec.md` are fixed: `regenerate-skill-derived.cjs --dry-run --bogus-xyz` now prints "Unknown argument" and exits 2, and `spec/create.sh` drew no finding.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL with 14 active P1 findings.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F1",
      "sourceId": "R1-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/bin/check-agent-mirror-sync.cjs:74"
    },
    {
      "id": "F2",
      "sourceId": "R2-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:174"
    },
    {
      "id": "F3",
      "sourceId": "R3-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:102"
    },
    {
      "id": "F4",
      "sourceId": "R4-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:228"
    },
    {
      "id": "F5",
      "sourceId": "R5-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:387"
    },
    {
      "id": "F6",
      "sourceId": "R6-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:151"
    },
    {
      "id": "F7",
      "sourceId": "R6-P1-002",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507"
    },
    {
      "id": "F8",
      "sourceId": "R6-P1-004",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:680"
    },
    {
      "id": "F9",
      "sourceId": "R6-P1-005",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77"
    },
    {
      "id": "F10",
      "sourceId": "R7-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/status.cjs:121"
    },
    {
      "id": "F11",
      "sourceId": "R7-P1-003",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387"
    },
    {
      "id": "F12",
      "sourceId": "R8-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962"
    },
    {
      "id": "F13",
      "sourceId": "R9-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103"
    },
    {
      "id": "F14",
      "sourceId": "R10-P1-001",
      "severity": "P1",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116"
    },
    {
      "id": "F15",
      "sourceId": "R1-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/bin/speckit-completion.cjs:40"
    },
    {
      "id": "F16",
      "sourceId": "R1-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/bin/compiled-route.cjs:28"
    },
    {
      "id": "F17",
      "sourceId": "R1-P2-004",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/commands/doctor/scripts/parent-skill-check.cjs:1931"
    },
    {
      "id": "F18",
      "sourceId": "R2-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:197"
    },
    {
      "id": "F19",
      "sourceId": "R2-P2-002",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:56"
    },
    {
      "id": "F20",
      "sourceId": "R2-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:37"
    },
    {
      "id": "F21",
      "sourceId": "R2-P2-004",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:100"
    },
    {
      "id": "F22",
      "sourceId": "R2-P2-005",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:160"
    },
    {
      "id": "F23",
      "sourceId": "R2-P2-006",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3519"
    },
    {
      "id": "F24",
      "sourceId": "R3-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:108"
    },
    {
      "id": "F25",
      "sourceId": "R3-P2-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317"
    },
    {
      "id": "F26",
      "sourceId": "R3-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:377"
    },
    {
      "id": "F27",
      "sourceId": "R3-P2-005",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:190"
    },
    {
      "id": "F28",
      "sourceId": "R4-P2-001",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs:588"
    },
    {
      "id": "F29",
      "sourceId": "R4-P2-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:54"
    },
    {
      "id": "F30",
      "sourceId": "R4-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:34"
    },
    {
      "id": "F31",
      "sourceId": "R4-P2-004",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:77"
    },
    {
      "id": "F32",
      "sourceId": "R4-P2-005",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:61"
    },
    {
      "id": "F33",
      "sourceId": "R4-P2-006",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:167"
    },
    {
      "id": "F34",
      "sourceId": "R5-P1-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:483"
    },
    {
      "id": "F35",
      "sourceId": "R5-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:75"
    },
    {
      "id": "F36",
      "sourceId": "R5-P2-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:46"
    },
    {
      "id": "F37",
      "sourceId": "R5-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:29"
    },
    {
      "id": "F38",
      "sourceId": "R6-P1-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106"
    },
    {
      "id": "F39",
      "sourceId": "R6-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs:31"
    },
    {
      "id": "F40",
      "sourceId": "R6-P2-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:95"
    },
    {
      "id": "F41",
      "sourceId": "R7-P1-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48"
    },
    {
      "id": "F42",
      "sourceId": "R7-P2-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22"
    },
    {
      "id": "F43",
      "sourceId": "R7-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29"
    },
    {
      "id": "F44",
      "sourceId": "R7-P2-005",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129"
    },
    {
      "id": "F45",
      "sourceId": "R8-P1-002",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882"
    },
    {
      "id": "F46",
      "sourceId": "R8-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:412"
    },
    {
      "id": "F47",
      "sourceId": "R8-P2-002",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970"
    },
    {
      "id": "F48",
      "sourceId": "R8-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:913"
    },
    {
      "id": "F49",
      "sourceId": "R8-P2-004",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197"
    },
    {
      "id": "F50",
      "sourceId": "R8-P2-005",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:357"
    },
    {
      "id": "F51",
      "sourceId": "R8-P2-006",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249"
    },
    {
      "id": "F52",
      "sourceId": "R9-P2-001",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:199"
    },
    {
      "id": "F53",
      "sourceId": "R9-P2-002",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109"
    },
    {
      "id": "F54",
      "sourceId": "R9-P2-003",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315"
    },
    {
      "id": "F55",
      "sourceId": "R9-P2-004",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49"
    },
    {
      "id": "F56",
      "sourceId": "R9-P2-005",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155"
    },
    {
      "id": "F57",
      "sourceId": "R10-P2-001",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258"
    },
    {
      "id": "F58",
      "sourceId": "R10-P2-002",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56"
    },
    {
      "id": "F59",
      "sourceId": "R10-P2-003",
      "severity": "P2",
      "defectClass": "exit-0-on-detected-problem",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456"
    },
    {
      "id": "F60",
      "sourceId": "R10-P2-004",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114"
    },
    {
      "id": "F61",
      "sourceId": "R10-P2-005",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141"
    },
    {
      "id": "F62",
      "sourceId": "R10-P2-006",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80"
    },
    {
      "id": "F63",
      "sourceId": "R10-P2-007",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:657"
    },
    {
      "id": "F64",
      "sourceId": "R10-P2-008",
      "severity": "P2",
      "defectClass": "unknown-option-accepted",
      "location": ".skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473"
    }
  ],
  "remediationWorkstreams": [
    "WS1: reject unknown options in the 14 P1 parsers (mode-switch typos first)",
    "WS2: return non-zero on the 10 class-2 exit sites",
    "WS3: reject unknown options in the remaining P2 parsers"
  ],
  "specSeed": [
    "Every CLI under .skilled rejects an unknown or misspelled option with usage on stderr and exit 2",
    "A script that detects a problem never exits 0 on that path"
  ],
  "planSeed": [
    "Fix the P1 rows F1-F14 one script per change, each with a test that passes the misspelled flag and asserts exit 2",
    "Then the class-2 rows, each with a test that feeds the failing input and asserts a non-zero exit"
  ],
  "findingClasses": [
    "unknown-option-accepted",
    "exit-0-on-detected-problem"
  ],
  "affectedSurfacesSeed": [
    ".skilled/bin",
    ".skilled/commands/doctor/scripts",
    ".skilled/skills/sk-code/sk-code-quality/scripts",
    ".skilled/skills/sk-code/sk-code-review/scripts",
    ".skilled/skills/sk-code/sk-code-webflow/assets/scripts",
    ".skilled/skills/sk-design/shared/scripts",
    ".skilled/skills/sk-design/sk-design-chart/scripts",
    ".skilled/skills/sk-design/sk-design-diagram/scripts",
    ".skilled/skills/sk-design/sk-design-md-generator/backend/scripts",
    ".skilled/skills/sk-doc/scripts",
    ".skilled/skills/sk-doc/shared/scripts",
    ".skilled/skills/sk-doc/sk-create-goal/scripts",
    ".skilled/skills/sk-doc/sk-create-repo-rule/scripts",
    ".skilled/skills/sk-doc/sk-create-skill/scripts",
    ".skilled/skills/system-deep-loop/deep-ai-council/scripts",
    ".skilled/skills/system-deep-loop/deep-review/scripts",
    ".skilled/skills/system-deep-loop/runtime/scripts",
    ".skilled/skills/system-skill-advisor/runtime/scripts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy",
    ".skilled/skills/system-spec-kit/runtime/cli",
    ".skilled/skills/system-spec-kit/runtime/cli/codex",
    ".skilled/skills/system-spec-kit/runtime/cli/continuity",
    ".skilled/skills/system-spec-kit/runtime/cli/lib",
    ".skilled/skills/system-spec-kit/runtime/cli/observability",
    ".skilled/skills/system-spec-kit/runtime/cli/ops",
    ".skilled/skills/system-spec-kit/runtime/cli/rules",
    ".skilled/skills/system-spec-kit/runtime/cli/setup",
    ".skilled/skills/system-spec-kit/runtime/cli/spec",
    ".skilled/skills/system-spec-kit/runtime/cli/spec-folder",
    ".skilled/skills/system-spec-kit/runtime/cli/sweep",
    ".skilled/skills/system-spec-kit/runtime/cli/templates",
    ".skilled/skills/system-spec-kit/runtime/cli/validation",
    ".skilled/skills/system-spec-kit/shared/scripts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Findings

Ordered by severity. Every row was reproduced by the orchestrator; placeholders in braces stand for a scratch path or the run's own packet and session id. Moves follow the reversal-cost order in `.skilled/repo-rules/prevent-overengineering.md`.

| ID | Severity | Location | Reproduction | Recommendation | Move | Why the cheaper move fails |
|----|----------|----------|--------------|----------------|------|----------------------------|
| F1 | P1 | `.skilled/bin/check-agent-mirror-sync.cjs:74` | Repro: node .skilled/bin/check-agent-mirror-sync.cjs --bogus-xyz -> 'agent-mirror-sync: no agent files to check - nothing verified', exit 0 (a `--al` typo for `--all` does the same) | Reject any argument that is neither --all nor an agent path with usage and exit 2, so a typo cannot turn the pre-commit and CI mirror gate into a vacuous pass | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F2 | P1 | `.skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:174` | Repro: node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs {tmp dir holding page.html} {tmp out} --check -> 'RESULT: FAILED', exit 1; the same command with --chek -> 'rendered 1, failed 0 / RESULT: PASSED', exit 0, and page.png written | Reject every --flag other than --check and --full-page with usage and exit 2 before the mode is chosen | Extend in place | Build nothing keeps a misspelled mode flag on the write path at exit 0; Change a value fails because the mode is derived from the flag test itself, not from a setting. |
| F3 | P1 | `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:102` | Repro: node --import {tsx} --input-type=module -e "import { parseGuidedRunArgs } from './.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts'; ..." with ['https://example.com','--output','/tmp/x','--dryru'] -> dryRun=false, no error, exit 0 (with --dry-run -> dryRun=true) | Throw the usage error for any --flag outside VALUE_FLAGS and BOOLEAN_FLAGS instead of skipping it, so a --dry-run typo cannot start a live extraction | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F4 | P1 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:228` | Repro: node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs --root {tmp root with one rule file} --check -> 'RESULT: FAILED (1 card problems)', exit 1; with --chekc -> 'cards=1 written=1 unchanged=0 deleted=0', exit 0, cards/ written | Reject flags other than --root and --check with usage and exit 2 before line 228 picks the write path | Extend in place | Build nothing keeps a misspelled mode flag on the write path at exit 0; Change a value fails because the mode is derived from the flag test itself, not from a setting. |
| F5 | P1 | `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:387` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs --dir {tmp dir with one malformed scenario} --strict -> 'pass=0 fail=1', exit 1; with --strct -> 'pass=0 fail=1', exit 0 | Add an unknown-option branch to parseArgs that prints usage and exits 2, so a --strict typo cannot leave detected FAILs at exit 0 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F6 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:151` | Repro: cd {tmp} && node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs acquire --lock-path {tmp}/lock.json --packet-id demo --ttl-msx 1800000 -> acquired with "ttlMs":300000, exit 0 | Validate parsed flag names against the subcommand's known set and exit 2 on any other, so a --ttl-ms typo cannot silently shorten the lock lease | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F7 | P1 | `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507` | Repro: node .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --check -> 'is up to date', exit 0; with --chek -> 'wrote .../review-mode-contract-snapshot.md', exit 0 | Reject any argument other than --check with usage and exit 2 before run() chooses the write path | Extend in place | Build nothing keeps a misspelled mode flag on the write path at exit 0; Change a value fails because the mode is derived from the flag test itself, not from a setting. |
| F8 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:680` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder {packet} --loop-type review --session-id {sid} --read-onyl -> normal result, exit 0; the read-write path at line 680 runs and appends observability events | Reject parsed keys outside the documented flag set with an INPUT_VALIDATION error, so a --read-only typo from /doctor:deep-loop cannot write to the graph store | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F9 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77` | Repro: cd {tmp} && printf '{"type":"iteration","iteration":1,"mode":"review"}' > rec.json && node .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs --bogus-xyz { rec.json -} 'appended 89 bytes to --bogus-xyz', exit 0, file named --bogus-xyz created | Exit 2 with usage when the state-log argument starts with --, so a flag-shaped token never becomes the output path | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F10 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs:121` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/status.cjs --spec-folder {packet} --loop-type review --session-id {sid} --read-onl -> normal status, exit 0; readOnly stays false, so lines 168 and 199 append status events | Reject parsed keys outside the documented flag set with an INPUT_VALIDATION error, the same branch convergence.cjs needs | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F11 | P1 | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387` | Repro: node -e '{stub fs.writeFileSync, set argv, require derive-command-bridges.cjs}' -- --chek -> STUB_WRITES=["command-bridges.generated.json"], exit 0; with --check -> STUB_WRITES=[] | Reject any argument other than --check with usage and exit 2 before main() chooses the write path | Extend in place | Build nothing keeps a misspelled mode flag on the write path at exit 0; Change a value fails because the mode is derived from the flag test itself, not from a setting. |
| F12 | P1 | `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962` | Repro: node --input-type=module -e "import { parseArguments } from './.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js'; ..." with ['--json','{...}',{folder},'--sesion-id','abc'] -> sessionId=null, no error, exit 0 (with --session-id -> sessionId=abc) | Throw on any unrecognized --flag in parseArguments instead of pushing it to filteredArgv, so a misspelled --session-id or --planner-mode stops the save | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F13 | P1 | `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js {tmp}/999-x {tmp} --descriptoin CUSTOM-TEXT -> 'description.json created', exit 0, description 'Spec'; with --description -> 'CUSTOM-TEXT' | Reject flags other than the documented ones with usage and exit 2, so a --description typo cannot silently overwrite caller text with derived text | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F14 | P1 | `.skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116` | Repro: copy env-reader-table.mjs to {tmp}/shared/scripts beside a README without the table, then node {tmp}/shared/scripts/env-reader-table.mjs --check -> drift message, exit 1; with --chek -> table printed, exit 0 | Accept only --check, --write and --print (or no argument) and exit 2 with usage on anything else | Extend in place | Build nothing keeps a misspelled mode flag on the write path at exit 0; Change a value fails because the mode is derived from the flag test itself, not from a setting. |
| F15 | P2 | `.skilled/bin/speckit-completion.cjs:40` | Repro: node .skilled/bin/speckit-completion.cjs {spec folder} --strcit -> completion payload, exit 0, strict mode not applied | Treat any token that starts with -- and is not a known flag as a usage error (exit 2) instead of a positional | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F16 | P2 | `.skilled/bin/compiled-route.cjs:28` | Repro: node .skilled/bin/compiled-route.cjs --hub sk-code --prompt hello --bogus-xyz -> routing JSON, exit 0 | Reject unknown flags in main() with usage and exit 2; resolve.cjs, compiled-route-guard.cjs and compiled-route-status.cjs share the indexOf pattern | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F17 | P2 | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1931` | Repro: node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code --bogus-xyz -> full audit, exit 0 | Exit 2 with usage when more than one argument is passed or the argument starts with -- | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F18 | P2 | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:197` | Repro: python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --bogus-xyz -> no output, exit 0 | Reject an argument that starts with -- and is not --all with usage and exit 2 before it is treated as a file path | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F19 | P2 | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:56` | Repro: python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh {tmp}/missing.py -> 'WARNING: cannot read ...', exit 0 | Return a non-zero code from check_file when the file cannot be read, so an unreadable input is not counted as clean | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F20 | P2 | `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:37` | Repro: cd {tmp tree with src/2_javascript/x.js} && node .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs --forse -> 'Mode: NORMAL (skip unchanged)', exit 0 | Reject any argument other than --force with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F21 | P2 | `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:100` | Repro: node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js {valid review file} --bogus-xyz -> 'OK: review output ends on the exact status line', exit 0 | Exit 2 with usage when more than one argument is passed; check-review-findings.js:87 needs the same branch | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F22 | P2 | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:160` | Repro: node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js --bogus-xyz -> full OK report against the working directory, exit 0 | Reject flags other than --root, and a --root with no value, with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F23 | P2 | `.skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3519` | Repro: node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --bogus-xyz -> 'RESULT: PASSED', exit 0 (verify-router-sync.cjs --bogus-xyz -> '5/5 checks passed', exit 0) | Reject flags outside --families, --render and --extra with usage and exit 2; verify-router-sync.cjs needs the same branch | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F24 | P2 | `.skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:108` | Repro: node .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs --exta /nonexistent -> 'RESULT: PASSED', exit 0 (with --extra /nonexistent -> exit 2) | Reject flags other than --extra with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F25 | P2 | `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317` | Repro: node .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js --bogus-xyz -> no output, exit 0 | Reject flags other than --verbose and --help with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F26 | P2 | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:377` | Repro: node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs gate --bogus-xyz -> '[gate] 2909 files ok=2902', exit 0 | Add a final else to the option loop that throws on an unknown flag, so the post-edit hook's gate rejects typos | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F27 | P2 | `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:190` | Repro: node --import {tsx} .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts .skilled/skills/sk-design/sk-design-md-generator/references/examples/stripe/tokens.json --study-context /nonexistent.json -> 28187-byte prompt, no warning, exit 0 | Print the read error and exit 1 in the --study-context catch instead of dropping the context silently | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F28 | P2 | `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs:588` | Repro: node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --alu -> stderr 'ERROR unknown option: --alu', lint not run, exit 0 | Return 2 from the argument-parse catch at line 588 so a usage error is not a pass; line 635 then must not force exitCode 0 on that path | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F29 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:54` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --bogus-xyz -> 'checked=14 fresh=14 failed=0', exit 0 | Add an else branch to parseArgs that prints usage and exits 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F30 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:34` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --bogus-xyz -> 'checked=14 fresh=14 stale=0', exit 0 | Add an else branch to the argv loop that prints usage and exits 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F31 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:77` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --bogus-xyz -> 'checked=14 passed=14 failed=0', exit 0 | Add an else branch to parseArgs that prints usage and exits 2, and validate --format values | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F32 | P2 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:61` | Repro: node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs --bogus-xyz -> 'RESULT: PASSED (11/11 checks)', exit 0 | Reject flags other than --root with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F33 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:167` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --bogus-xyz --limit 1 -> 'RESULT: PASSED', exit 0 | Reject flags outside --hub, --limit, --json and --concurrency with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F34 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:483` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-doc --strct -> 'verdict=PASS valid=26 blocked=0', exit 0 | Add an unknown-option branch to the parser that prints usage and exits 2 (downgraded from P1: the tree has no blocked case, so the gate bypass did not reproduce) | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F35 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:75` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --bogus-xyz -> 'RESULT: PASSED', exit 0 | Reject unknown flags and a --hub with no value with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F36 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:46` | Repro: node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc --bogus-xyz -> 'leaf-manifest.json OK', exit 0 | Add an else branch to parseArgs that prints usage and exits 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F37 | P2 | `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:29` | Repro: node .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs --bogus-xyz -> 'no council artifacts at .../--bogus-xyz/ai-council', exit 0 | Reject a packet argument that starts with -- with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F38 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder {packet} --loop-type review --session-id {sid} --query-type coverage_gaps --read-onyl -> status ok, exit 0, read-write open | Reject parsed keys outside the documented flag set (downgraded from P1: the effect is a read-write open of a gitignored store, not a write) | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F39 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs:31` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --bogus-xyz -> normal result JSON, exit 0 (check-projection-coverage.cjs and check-protocol-append-sites.cjs the same) | Reject flags outside the documented set with usage and exit 2 in all three checkers | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F40 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:95` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir {empty tmp} --bogus-xyz -> '{"status":"ok",..."merged":0}', exit 0 | Reject parsed keys outside the documented flag set with an input error | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F41 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48` | Repro: node .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs --spec-folder {packet} --loop-type review --session-id {sid} --nodes '[{one DIMENSION node}]' --edges '[]' --seed-sorce scope_discovery -> exit 0, seed source dropped | Reject parsed keys outside the documented flag set (downgraded from P1: the effect is lost seed telemetry, not a gate) | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F42 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22` | Repro: bash .skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh --bogus-xyz -> no output and no flag diagnostic, exit 1, identical to the no-argument run | Add a default case that prints usage and exits 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F43 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29` | Repro: bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh . --bogus-xyz -> 'GUARD PASS', exit 0 | Exit 2 with usage when more than one argument is passed | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F44 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129` | Repro: node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs --wrtie -> summary printed, nothing written, exit 0 | Reject flags other than --write with usage and exit 2; the sibling routing-accuracy helpers share the includes('--write') shape | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F45 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/dist/observability/smart-router-measurement.js --workspace-root /nonexistent --no-record-telemety -> parse passes, run fails later on ENOENT, exit 1, no unknown-option error | Reject flags outside the documented set with usage and exit 2 (downgraded from P1: the telemetry re-enable effect was read in code, not run) | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F46 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:412` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --bogus-xyz -> 'routers=33 clean=33', exit 0 | Reject flags other than --write with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F47 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package not-a-real-package -> 'DIST FRESHNESS CHECK ERROR: Unknown dist package', exit 0 | Exit 1 when the result carries an error, not only when it is stale | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F48 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:913` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all --bogus-xyz -> normal report, exit 0 | Reject a --flag that reaches the positional branch with usage and exit 64, as the command-position check already does | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F49 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs --bogus-xyz -> 'OK - 0 broken markdown links', exit 0 | Reject arguments other than --self-test with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F50 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:357` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/dist/observability/smart-router-analyze.js --workspace-root {tmp} --bogus-xyz -> report written under {tmp}, exit 0 | Reject flags outside the documented set with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F51 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/dist/ops/process-sweep.js plan --bogus-xyz -> plan JSON, exit 0 (process-memory-harness.js snapshot --bogus-xyz the same) | Reject flags after the subcommand other than --pretty with usage and exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F52 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:199` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec/is-phase-parent.js check -> no output, exit 0, which the check contract reads as 'is a phase parent' (bogus-command {dir} -> exit 0 too) | Exit 2 with usage when the command or folder is missing or the command is unknown, instead of returning | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F53 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs --bogus-xyz -> no output, exit 0 | Report an unreadable input on stderr and exit 2 instead of continue | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F54 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs {empty tmp dir} --bogus-xyz -> 'SKIP no Created date...', exit 0 | Exit 2 with usage when more than one argument is passed | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F55 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49` | Repro: copy check-native-modules.sh three levels into {tmp} and run it with no .node-version-marker -> 'Marker: [FAIL] not found', exit 0 | Track a failure flag in the [FAIL] branches (lines 46, 49, 61) and exit 1 at the end when it is set | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F56 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155` | Repro: source the rule and run run_check {tmp parent with an unlisted 001-child} with SPECKIT_CHILD_SCANNER={scanner that throws} -> RULE_STATUS=pass 'children_ids matches the on-disk phase children'; a working scanner -> warn | Treat any drift_rc other than 0 and 9 like 20 and 21 (warn under enforce), so a scanner crash is not reported as no drift | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F57 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258` | Repro: bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level 2 {tmp}/in.tmpl --bogus-xyz -> output byte-identical to the run without the flag, exit 0 | Reject unknown -- options with usage and exit 2 in both renderers | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F58 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs does-not-exist.md --bogus-xyz -> '0 unactioned recorded failure(s)', exit 0 | Exit 2 on an unknown flag and on an unreadable input file instead of filtering and swallowing them | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F59 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs --bogus-xyz -> '0 ephemeral-pointer violation(s)', exit 0 | Exit 2 when a target is flag-shaped or does not exist, instead of counting it clean | Change a value | Build nothing keeps reporting success after the script has already detected the problem. |
| F60 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114` | Repro: bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh --left {tmp dir} -> runs the default mirror check ('181 mirrors ... in sync'), exit 0 | Exit 2 with usage when exactly one of --left and --right is given | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F61 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs --help -> 'checked 0 staged Markdown file(s)', exit 0 (the lint ran) | Answer --help with usage and reject any other argument with exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F62 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80` | Repro: node --import {tsx} .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts --roots --baseline=base.json -> "roots": [], "inspected": 0, exit 0 | Reject a --roots value that starts with -- with usage and exit 2, as the unknown-argument branch already does | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F63 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:657` | Repro: node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs --help -> JSON report for root '.../--help', packetCount 0, exit 0 | Answer --help with usage and reject a flag-shaped root with exit 2 | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |
| F64 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473` | Repro: node --import {tsx} .skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts --folder={tmp} --bogus-xyz -> report, exit 0 (the space form --folder {tmp} is ignored and falls to the default root) | Reject unknown flags and accept or reject the space form of --folder explicitly, exit 2 on misuse | Extend in place | Build nothing leaves the typo at exit 0; Change a value fails because no existing value or setting controls option validation, so the parser itself needs the rejecting branch. |

## 4. Remediation Workstreams

1. **P1, mode-switch typos (F2, F4, F7, F11, F14):** a misspelled `--check` runs the write path. Reject unknown flags before the mode is chosen.
2. **P1, other silent options (F1, F3, F5, F6, F8, F9, F10, F12, F13):** a typo disables a gate, a dry run, a read-only open or a caller value at exit 0.
3. **P2, class 2 exit sites (10 rows):** return a non-zero status where the script already detects the problem.
4. **P2, remaining parsers:** add the rejecting branch. The deep-loop runtime scripts (`convergence.cjs`, `status.cjs`, `query.cjs`, `upsert.cjs`, `fanout-merge.cjs`, `loop-lock.cjs`) share one `parseArgs` shape; if the same fix lands in three or more of them, a shared validator becomes the Add a function move, and not before.

## 5. Spec Seed

- Every CLI under `.skilled` rejects an unknown or misspelled option with usage on stderr and exit 2.
- A flag that selects a mode is validated before the mode is chosen, so a typo never reaches a write path.
- A script that detects a problem exits non-zero on that path; a warning line alone is not a pass.

## 6. Plan Seed

- One fix phase per workstream, one script per change, each with a test that passes the misspelled flag (or the failing input) and asserts the exit code.
- Start with F2, F4, F7, F11 and F14, where a typo writes files.
- Re-run this sweep's repro commands from section 3 as the acceptance check.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | `spec.md` section 3 scope matched to 273 files; both defect classes reviewed in every slice |
| `checklist_evidence` | notApplicable | Level 1 packet, no checklist |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` | notApplicable | The target is CLI parsers, not skill or agent contracts |

`AC_COVERAGE`: exempt (Level 1).

## 8. Deferred Items

- The four "Not reproduced" rows in section 9 are plausible defects whose only repro mutates git, rebuilds a store, spawns another CLI or needs branch state this repository lacks. A fix phase can prove them inside a throwaway worktree.
- Valueless flags that fall back to a default (`check-ledger-stem-producers.cjs --repo-root`, `check-skill-doc-frontmatter.mjs --skill`) are outside both classes; they are noted, not rated.

## 9. Dropped and Downgraded Findings

| Source ID | Outcome | Evidence |
|-----------|---------|----------|
| R1-P2-002 | Dropped | git-sync.sh:56 prints "git-sync: unknown arg" to stderr, so the option is not accepted silently; outside both classes. |
| R5-P1-002 | Downgraded to P2 | validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-doc --strct -> verdict=PASS exit 0, so the typo is accepted (class 1 confirmed), but the tree has blocked=0, so the claimed gate bypass (FAIL at exit 0) did not reproduce. Exit site lines 483-486. |
| R5-P2-004 | Dropped | worktree-naming.sh create (line 403) puts an unknown token into base, which git worktree add then rejects, so the typo is not accepted silently; the create path mutates git and was not run. |
| R5-P2-005 | Not reproduced | worktree-naming.sh:418 downgrades a failed provision to a stderr message with an or-echo fallback; the only repro creates a worktree and installs packages, which this read-only run may not do. |
| R5-P2-006 | Not reproduced | migrate-legacy-branch-names.sh --dry-run -> "no legacy owner-first worktree branches found" exit 0; the collision path the finding names is unreachable in this repo. |
| R6-P1-003 | Downgraded to P2 | query.cjs ... --query-type coverage_gaps --read-onyl -> status ok, exit 0, so the typo is accepted; the effect is only a read-write open of a gitignored query DB, not a write, so P1 does not hold. Line 106. |
| R6-P2-003 | Dropped | check-ledger-stem-producers.cjs rejects unknown flags ("unknown flag: --bogus-xyz", exit 1); a valueless --repo-root falling back to the default is outside both defect classes. |
| R6-P2-004 | Not reproduced | codex-dispatch.cjs (line 171) spawns the codex CLI; no safe run exists. |
| R7-P1-002 | Downgraded to P2 | upsert.cjs ... --nodes '[{dim node}]' --edges '[]' --seed-sorce scope_discovery -> exit 0, seed source silently dropped; the child's own repro failed on an unrelated required field, and the effect is graph telemetry, not a gate. Parser line 48. |
| R7-P2-001 | Not reproduced | init-skill-graph.sh:57 rebuilds the advisor SQLite store on any invocation; not run. |
| R7-P2-004 | Dropped | check-skill-doc-frontmatter.mjs rejects unknown options (line 66 "unknown option"); a valueless --skill widening scope is outside both classes. |
| R8-P1-002 | Downgraded to P2 | smart-router-measurement.js --workspace-root /nonexistent-o5-root --no-record-telemety -> parsing passes and the run fails later on ENOENT (exit 1), so the misspelled flag is not rejected; the telemetry re-enable effect is code-read (line 882) and was not run, so P1 is not proven. |

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Directions: ten scope slices, one per iteration, with the dimension label rotating correctness, security, traceability, maintainability. Both defect classes were checked in every slice.
- Remaining frontier: none inside the declared scope.

## Search Ledger

- `graphCoverageMode`: graphless_fallback
- Required bug classes: unknown_option_silent, exit0_on_detected_problem, documented_option_rejected
- Covered: unknown_option_silent, exit0_on_detected_problem. Ruled out: documented_option_rejected (no header was found documenting an option its parser rejects).
- `searchDebt`: 0 items. hasSearchDebt: false.
- Ruled-out candidates: 22. Clean search proofs: 25.

## 10. Audit Appendix

- **Convergence:** stopPolicy max-iterations; all 10 iterations ran; stop reason maxIterationsReached. Reducer convergence score after iteration 10: 0.91 (telemetry only).
- **Coverage:** 4 of 4 dimensions; 273 of 273 scope files assigned to a slice.
- **Executor:** cli-pi, model `deepseek-v4.1-flash` on the DevPass (llmgateway) route, reasoning effort max, for all 10 iterations. No usage limit was hit, so the cline-pass fallback was never used.
- **Adversarial self-check:** every P1 was re-run by the orchestrator. Four P1 claims did not hold at P1 and were downgraded (section 9).
- **Sources:** `iterations/iteration-001.md` to `iteration-010.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`.
- **Raw executor output:** 72 findings (P1 18, P2 54 by the executor's own rating); after adjudication 64 active (P1 14, P2 50), 8 dropped.

### Core Protocols

`spec_code` pass; `checklist_evidence` not applicable.

### Overlay Protocols

All four overlay protocols not applicable.
