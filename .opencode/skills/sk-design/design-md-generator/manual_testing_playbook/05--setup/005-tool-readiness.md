---
title: "SETUP-001 -- Tool Readiness From A Fresh Checkout"
description: "This scenario validates tool setup for SETUP-001. It focuses on confirming npm install and npx playwright install chromium prepare the embedded tool, and a missing Chromium binary is reported clearly rather than as a crash."
version: 1.0.0.6
expected_intent: EXTRACT_WRITE
expected_resources:
  - references/extraction_workflow.md
  - references/troubleshooting.md
---

**Exact prompt**

```
Set up the design extractor tool so I can extract a design system from a URL.
```

# SETUP-001 -- Tool Readiness From A Fresh Checkout

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SETUP-001`.

---

## 1. OVERVIEW

This scenario validates tool setup for `SETUP-001`. It focuses on confirming a fresh checkout of the `backend/` directory requires `npm install` and `npx playwright install chromium` before any extraction or validation can run, and that a missing Chromium binary is reported clearly as a setup requirement, not as a crash or cryptic error.

### Why This Matters

Every extraction, validation, and report command depends on the tool's Node.js dependencies and the Playwright Chromium binary. If the setup instructions fail or produce cryptic errors, operators cannot reach any other scenario. The failure mode this guards against is a `browserType.launch: Executable doesn't exist` crash presented as an extraction failure rather than a setup gap.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `SETUP-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the tool setup path works end to end and errors before setup are clear and actionable
- Real user request: `Set up the design extractor tool so I can extract a design system from a URL.`
- Prompt: `Set up the design extractor tool so I can extract a design system from a URL.`
- Expected execution process: confirm Node 20+; run `cd backend && npm install` and verify zero errors; run `cd backend && npx playwright install chromium` and verify it completes; smoke-test with `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help` to confirm the CLI parses; attempt `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` and confirm it runs (or fails with a clear crawl error, not a missing-binary crash)
- Expected signals: `npm install` exits 0; `npx playwright install chromium` exits 0 (or reports "already installed"); `--help` prints usage; extraction either succeeds or fails with a crawl-specific error, never `Executable doesn't exist` or `command not found: ts-node`
- Desired user-visible outcome: the agent confirms the tool is ready and the operator can proceed to EXTRACT-001
- Pass/fail: PASS if all setup steps complete without errors AND the smoke test either succeeds or fails with a crawl-specific error (not a missing-binary crash); FAIL if `npm install` or `playwright install` fails fatally OR the smoke test crashes with `Executable doesn't exist` OR `ts-node` is not found after install

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Setup stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Node.js 20+ must be on PATH. The working directory is the skill root `.opencode/skills/sk-design/design-md-generator/`. For a true "fresh checkout" test, delete `backend/node_modules/` and the Playwright Chromium cache before starting.

1. `bash: node --version`  # -> v18.x.x or higher
2. `cd .opencode/skills/sk-design/design-md-generator/backend && npm install`  # -> exits 0, no errors, node_modules populated
3. `cd .opencode/skills/sk-design/design-md-generator/backend && npx playwright install chromium`  # -> exits 0, Chromium installed or "already installed"
4. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help`  # -> prints usage text with --fast, --max-pages, --concurrency, --output, --no-dark-mode, --no-interaction, --with-interaction, --fast-no-interaction, --wait-for, etc.
5. smoke: `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output`  # -> runs; exits 0 (success) or exits non-zero with a crawl-specific error (e.g., timeout, 403); never `Executable doesn't exist`
6. agent reports tool readiness and smoke-test result

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SETUP-001 | Tool readiness | Verify `npm install` + `npx playwright install chromium` prepare the tool, and missing Chromium is reported clearly | `Set up the design extractor tool so I can extract a design system from a URL.` | 1. `bash: node --version` -> 2. `cd backend && npm install` -> 3. `cd backend && npx playwright install chromium` -> 4. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help` -> 5. smoke: `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` | Step 1: Node 20+. Step 2: npm install exits 0, no errors. Step 3: Playwright Chromium installed or confirmed. Step 4: --help prints usage. Step 5: extract runs (success or clear crawl error, never `Executable doesn't exist`) | Transcript of install steps, `--help` output, and smoke-test outcome | PASS if all setup steps complete without errors AND the smoke test either succeeds or fails with a crawl-specific error (not a missing-binary crash). FAIL if `npm install` or `playwright install` fails fatally OR the smoke test crashes with `Executable doesn't exist` OR `ts-node` is not found after install | 1. If `npm install` fails, check `backend/package.json` for version requirements. 2. If Chromium install fails (disk space, network), note as an environment blocker. 3. If the smoke test crashes with a missing binary, confirm `npx playwright install chromium` completed. 4. If `ts-node` is not found, confirm `npm install` ran in the `backend/` directory. |

### Optional Supplemental Checks

Run `cd backend && npx vitest run` after setup to confirm the clustering and validation unit tests pass — this validates the tool is intact beyond the binary check. Delete `backend/node_modules/` and run `npx ts-node scripts/extract.ts --help` — confirm the error is `command not found: ts-node`, not a cryptic module-resolution error. Re-run `npm install` and confirm the tool recovers.

> Interaction-capture default note: extraction captures interaction state by default (`noInteraction = false`). The CLI accepts `--no-interaction` and `--fast-no-interaction` to opt out, plus the now-redundant `--with-interaction`. The printed `--help` wording for the interaction flags may lag the parsing logic; the parsing logic is authoritative, so trust the flag behavior over the help string.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/package.json` | Node.js dependency declarations — defines ts-node, playwright, vitest, and all runtime deps |
| `../../backend/scripts/extract.ts` | Extraction orchestrator — the primary CLI entry point |
| `../../backend/scripts/crawl.ts` | Playwright crawler — the consumer of the Chromium binary |
| `../../references/troubleshooting.md` | §2 Setup Failures — Chromium/Playwright missing and ts-node not found fixes |
| `../../references/extraction_workflow.md` | §2 Phase 1: EXTRACT — setup prerequisites |
| `../../SKILL.md` | §3 Invocation (setup commands), §4 ALWAYS rule 8, §7 INTEGRATION POINTS (external tools) |

---

## 5. SOURCE METADATA

- Group: Setup
- Playbook ID: SETUP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--setup/tool-readiness.md`
