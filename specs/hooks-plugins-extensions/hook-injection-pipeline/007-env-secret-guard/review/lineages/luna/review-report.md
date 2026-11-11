# Deep Review Report

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** 0 P0, 1 P1, 3 P2
- **Review scope:** shared env-secret-guard core, Claude/Codex/Cursor/Devin/Pi/DSH/OpenCode adapters, hook registry, CE-P06/CE-P07 and listed documentation.
- **Operator review focus:** The env-secret-guard change: core .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, its runtime adapters (Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode plugin), the hook-registry entry, CE-P06/CE-P07 playbook scenarios and the docs that list it. Hunt for dotenv reads or writes the guard misses, false denials, value leaks from the inspection tools, and doc claims the code does not back. Never open a real .env file.
- **Stop reason:** maxIterationsReached after four iterations; convergence was treated as telemetry.

## 2. Planning Trigger

`/speckit:plan` is required because an active P1 remains. The P1 Hunter/Skeptic/Referee recheck kept it at P1: the governing spec says the shell rule is not a full shell parser, but the finding uses the supported cat reader, a same-line assignment, and command-substitution/variable handling that the implementation already claims to cover. No code or test run was used for this final recheck; source evidence is cited.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R1-P1-001",
      "severity": "P1",
      "title": "Command-substitution path assignment can read .env without refusal",
      "dimension": "correctness",
      "file": ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs",
      "line": 270,
      "findingClass": "security",
      "evidenceRefs": [
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270-273",
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:430-478",
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:153-163",
        "specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard/spec.md:63-74"
      ],
      "impact": "A shell command can read .env and expose its values to an agent without the core refusing the call.",
      "fixRecommendation": "Resolve command-substitution output for supported assignment forms, or fail closed when a supported reader consumes an unresolved substitution-derived variable.",
      "scopeProof": "The packet includes shell reads passed to supported reading programs; cat is in the supported reader set.",
      "affectedSurfaceHints": [
        "shared core shell classifier",
        "Claude/Codex/Cursor/Devin command adapter",
        "Pi",
        "DSH",
        "OpenCode"
      ]
    },
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "Single-quoted variable reference is expanded and falsely denied",
      "dimension": "correctness",
      "file": ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs",
      "line": 200,
      "findingClass": "correctness",
      "evidenceRefs": [
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:184-222",
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270-273"
      ],
      "impact": "A shell read of a literal path can be denied as though it targeted .env.",
      "fixRecommendation": "Preserve single-quoted literal context during tokenization and variable expansion.",
      "scopeProof": "The shared classifier interprets quoted shell-reader arguments.",
      "affectedSurfaceHints": [
        "shared core shell tokenizer",
        "shell-reader decisions"
      ]
    },
    {
      "id": "R1-P2-002",
      "severity": "P2",
      "title": ".env* is denied when only the exempt .env.example exists",
      "dimension": "correctness",
      "file": ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs",
      "line": 305,
      "findingClass": "correctness",
      "evidenceRefs": [
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:104-108",
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:298-310"
      ],
      "impact": "A safe template-only directory can trigger a false denial.",
      "fixRecommendation": "Base glob denials on actual directory entries while applying the .env.example exemption.",
      "scopeProof": "The core explicitly exempts .env.example and resolves shell globs.",
      "affectedSurfaceHints": [
        "shared core glob matcher",
        "shell-reader decisions"
      ]
    },
    {
      "id": "R3-P2-001",
      "severity": "P2",
      "title": "The central DSH coverage table omits grep although the registered guard handles it",
      "dimension": "traceability",
      "file": ".skilled/hooks/env-secret-guard/README.md",
      "line": 77,
      "findingClass": "traceability",
      "evidenceRefs": [
        ".skilled/hooks/env-secret-guard/README.md:69-79",
        ".dsh/plugins/repo-guards/README.md:91",
        ".dsh/plugins/repo-guards/adapters/README.md:31",
        ".skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs:32-36",
        ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-36"
      ],
      "impact": "The central matrix understates DSH protection and can lead operators to assume grep calls are outside the guard.",
      "fixRecommendation": "Add grep to the DSH tools cell or describe the adapter as running on every tool with core filtering.",
      "scopeProof": "The central tools column enumerates runtime coverage; DSH documentation and code show grep is checked.",
      "affectedSurfaceHints": [
        "env-secret-guard README runtime matrix",
        "DSH plugin docs",
        "shared core FILE_TOOLS"
      ]
    }
  ],
  "remediationWorkstreams": [
    {
      "priority": 1,
      "title": "Close the command-substitution dotenv-read bypass",
      "findingIds": [
        "R1-P1-001"
      ],
      "actions": [
        "Add supported shell-path handling or refuse unresolved substitution-derived paths",
        "Add a focused regression case and verify all seven core-backed runtime integrations"
      ]
    },
    {
      "priority": 2,
      "title": "Remove false denials",
      "findingIds": [
        "R1-P2-001",
        "R1-P2-002"
      ],
      "actions": [
        "Preserve single-quote semantics",
        "Match globs against actual entries while respecting .env.example"
      ]
    },
    {
      "priority": 3,
      "title": "Align DSH documentation",
      "findingIds": [
        "R3-P2-001"
      ],
      "actions": [
        "Update the central runtime matrix to include DSH grep coverage"
      ]
    }
  ],
  "specSeed": [
    "State whether command-substitution-generated file paths are covered by the supported shell-reader contract.",
    "Require quoted-literal and template-only glob behavior to be explicit in the acceptance examples.",
    "Keep value-free inspection and .env.example exemption requirements explicit."
  ],
  "planSeed": [
    "Add regression coverage for f=\"$(printf .env)\"; cat \"$f\" and verify the call is denied.",
    "Preserve single-quoted literal arguments during shell analysis.",
    "Test .env* with only .env.example present and require an allow decision.",
    "Update the central DSH coverage table to include grep and verify the linked adapter/core evidence."
  ],
  "findingClasses": [
    "security",
    "correctness",
    "traceability"
  ],
  "affectedSurfacesSeed": [
    ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs",
    ".skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs",
    ".skilled/hooks/env-secret-guard/pi/env-secret-guard.ts",
    ".skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs",
    ".opencode/plugins/env-secret-guard.js",
    ".skilled/hooks/env-secret-guard/README.md",
    ".dsh/plugins/repo-guards/README.md"
  ],
  "fixCompletenessRequired": [
    "Update behavior tests for each finding and cite the observed result.",
    "Keep runtime adapter behavior aligned with the shared core.",
    "Update documentation claims from the registered source of truth."
  ]
}
```

## 3. Active Finding Registry

### R1-P1-001 — P1 — Command-substitution path assignment can read .env without refusal

- **Dimension / class:** correctness / security
- **Evidence:** .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270-273 and :430-478; existing shell test cases at .skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:153-163 do not cover a substitution-produced assignment.
- **Impact:** f="$(printf .env)"; cat "$f" reads .env in a shell while the guard retains the unevaluated substitution text.
- **Disposition:** active; P1 retained after synthesis self-check.
- **Scope proof:** supported shell reader cat is inside the packet contract.
- **Fix recommendation:** Resolve this supported substitution form or reject unresolved substitution-derived file paths.

### R1-P2-001 — P2 — Single-quoted variable reference is expanded and falsely denied

- **Evidence:** .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:184-222 and :270-273.
- **Impact:** a literal path can be denied as though it were .env.
- **Disposition:** active.
- **Fix recommendation:** preserve single-quote literal context.

### R1-P2-002 — P2 — .env* is denied when only the exempt .env.example exists

- **Evidence:** .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:104-108 and :298-310.
- **Impact:** template-only directories can trigger false denials.
- **Disposition:** active.
- **Fix recommendation:** match actual directory entries and apply the explicit template exemption.

### R3-P2-001 — P2 — The central DSH coverage table omits grep although the registered guard handles it

- **Evidence:** .skilled/hooks/env-secret-guard/README.md:69-79; .dsh/plugins/repo-guards/README.md:91; .dsh/plugins/repo-guards/adapters/README.md:31; the DSH adapter and core FILE_TOOLS at .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs:32-36 and .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-36.
- **Impact:** the central table understates DSH coverage.
- **Disposition:** active.
- **Fix recommendation:** add grep or say the DSH adapter observes every tool and the core filters calls.

## 4. Remediation Workstreams

1. Fix the P1 shell-path bypass and add a focused regression case across the shared core.
2. Fix the two P2 false-denial cases in shell tokenization and glob matching.
3. Correct the central DSH runtime coverage table.

## 5. Spec Seed

- State whether command-substitution-generated file paths are covered by the supported shell-reader contract.
- Require literal single-quote behavior and template-only glob behavior to be explicit.
- Preserve the value-free inspection and .env.example exemption requirements.

## 6. Plan Seed

- Add a regression case for f="$(printf .env)"; cat "$f".
- Preserve single-quoted literal arguments during shell analysis.
- Exercise .env* when only .env.example exists.
- Align the DSH tools matrix with the registered adapter and shared core.

## 7. Traceability Status

- **spec_code — partial:** active P1 and two correctness P2s remain in the shared core.
- **checklist_evidence — partial:** the checked shell evidence does not cover the substitution-produced path; broader test execution was not performed.
- **skill_agent — partial:** adapter source paths were traced, but no live runtime session was run.
- **agent_cross_runtime — partial:** named adapters delegate to shared policy; live cross-runtime behavior remains unverified.
- **feature_catalog_code — pass for inspected Cursor entry:** the documented preToolUse guard path matches the registered shared command adapter.
- **playbook_capability — not run:** CE-P06/CE-P07 were reviewed as documents only; runtime scenarios were not executed.
- **AC_COVERAGE — advisory-shortfall:** the Level 2 acceptance file marks 10/10 rows Met, but AC-003 does not cover the active substitution-path counterexample. Independent verified count and validation floor are UNKNOWN; validate.sh was not run.
- **Resource map:** a lineage-local resource map was emitted; the target packet reports resource_map_present=false, so the Resource Map Coverage Gate was not applicable.

## 8. Deferred Items

- Remediate the active P1 and P2 findings.
- Run the requested regression and cross-runtime validation after fixes are implemented.
- Reconcile the acceptance-criteria closure statement with the active P1 before declaring the packet closeable.
- The iteration 1 state row has reducer field-shape warnings; the workflow verifier accepted its narrative, route proof, and delta. Later records use the prompt-pack schema.
- Live CE-P06/CE-P07 execution remains unverified; no real .env file was opened.

## Dimension Expansion Map

- Correctness: completed in iteration 1.
- Security: completed in iteration 2.
- Traceability: completed in iteration 3.
- Maintainability: completed in iteration 4.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier: none; cross-reference analysis was performed after the four dimensions.

## Search Ledger

*No search-depth state captured (legacy v1 record).*

## 10. Audit Appendix

- **Convergence:** four iterations; no new findings in iteration 4; convergence score is telemetry only because stopReason is maxIterationsReached.
- **Coverage:** 4/4 review dimensions covered; verdict remains CONDITIONAL from the active P1.
- **Final active counts:** P0 0, P1 1, P2 3.
- **Cross-reference:** registry, four iteration records, and four deltas contain four active finding IDs. Each iteration narrative final line is Review verdict: CONDITIONAL.
- **Workflow boundaries:** synthesis event directory is inside the lineage to honor the write fence. Config status was not changed because the deep-review leaf contract marks config read-only after initialization. Git staging was skipped because the dispatch forbids Git write commands; phase_save was skipped because the dispatch prohibits generate-context.js.
- **Files not run:** no test suite, validate.sh, live runtime scenario, or real dotenv file was executed/read.

### Core Protocols

- spec_code: partial; active shared-core findings remain.
- checklist_evidence: partial; shell assignment evidence is incomplete for the active bypass.
- resource-map coverage: not applicable to the target packet; resource_map_present was false.

### Overlay Protocols

- skill_agent and agent_cross_runtime: partial; adapters were statically traced, runtime sessions were not executed.
- feature_catalog_code: pass for the inspected Cursor hook entry.
- playbook_capability: not run.

### Sources Reviewed

- Shared core, core tests, CLI, Claude/Codex/Cursor/Devin command adapter, Pi, DSH, OpenCode, hook registry/configuration, CE-P06/CE-P07, runtime READMEs, environment reference, changelog, packet spec, acceptance criteria, and implementation summary.

## Verdict

**Review verdict: CONDITIONAL**
