---
title: "cli-adapter: Hermetic CLI Adapter and Fan-Out Stress Coverage"
description: "Hermetic stress suites for the external CLI adapters and the fan-out scheduler, with the matrix manifest and playbook bijection validator that index them."
trigger_phrases:
  - "cli adapter stress tests"
  - "fanout scheduler stress matrix"
  - "adapter playbook bijection validator"
---

# cli-adapter: Hermetic CLI Adapter and Fan-Out Stress Coverage

---

## 1. OVERVIEW

`cli-adapter/` owns the hermetic stress coverage for the external CLI adapters (`cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, `cli-cursor`, `cli-hermes`) and for the fan-out scheduler. Each case drives a shim binary or a fixture process instead of a real provider, so the suites pin shipped command, process, artifact, budget, gate and recursion contracts without network access.

The fourteen edge-case rows in `matrix-manifest.ts` are the spine of the folder. Every suite registers tests named after those rows, and `validate-playbook-package.cjs` proves that each row resolves to exactly one running test and one manual playbook snippet.

Current state:

- One suite file per adapter subject, plus `fanout.vitest.ts` for the scheduler and its manifest integrity.
- The codex suite asserts the dispatch contracts directly. The other six adapter suites register the shared factory in `fixtures/adapter-suite.ts`.
- Test names are fixed strings, so a renamed or removed test breaks the bijection check instead of passing silently.
- Live provider probes stay skipped unless their opt-in flag is set.

---

## 2. DIRECTORY TREE

```text
cli-adapter/
+-- cli-codex.vitest.ts            # Codex dispatch, fan-out lineage and manifest integrity
+-- cli-opencode.vitest.ts         # Shared suite entry for the opencode adapter
+-- cli-pi.vitest.ts               # Shared suite entry for the pi adapter
+-- cli-claude-code.vitest.ts      # Shared suite entry for the claude code adapter
+-- cli-devin.vitest.ts            # Shared suite entry for the devin adapter
+-- cli-cursor.vitest.ts           # Shared suite entry for the cursor adapter
+-- cli-hermes.vitest.ts           # Shared suite entry for the hermes adapter
+-- fanout.vitest.ts               # Fan-out scheduler contracts and manifest integrity
+-- matrix-manifest.ts             # Edge-case rows, subjects and the bound matrix
+-- live-contracts.json            # Recorded scheduler contract statements
+-- validate-playbook-package.cjs  # Bijection validator over matrix, tests and playbooks
+-- fixtures/                      # Shared shim, suite, process and worktree fixtures
+-- shims/                         # Hermetic stand-in binaries for the external CLIs
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `cli-codex.vitest.ts` | Asserts codex binary preflight, flag and stdin construction, sandbox defaults, timeout reaping, cleanup scope, worktree isolation and recursion refusal, and checks that the shipped external executor roster matches the workflow mode registry. |
| `cli-opencode.vitest.ts` | Registers the shared adapter stress suite for the opencode subject. |
| `cli-pi.vitest.ts` | Registers the shared adapter stress suite for the pi subject. |
| `cli-claude-code.vitest.ts` | Registers the shared adapter stress suite for the claude code subject. |
| `cli-devin.vitest.ts` | Registers the shared adapter stress suite for the devin subject. |
| `cli-cursor.vitest.ts` | Registers the shared adapter stress suite for the cursor subject. |
| `cli-hermes.vitest.ts` | Registers the shared adapter stress suite for the hermes subject. |
| `fanout.vitest.ts` | Scheduler contracts and the fan-out manifest audit. Covers diagnostic passthrough, rate-limit rejection, timeout reaping, stdin closure, child gate variables, flat-pool expansion under a concurrency cap, transport and budget refusal, partial lineage death, orphan cleanup without a blanket sweep, worktree claims, node_modules isolation, recursion refusal, containment advisories, stop-policy enforcement, required artifacts and the lineage prompt write boundary. |
| `matrix-manifest.ts` | Declares the fourteen edge-case rows, the eight subjects, the playbook path pattern, the per-subject rows and the audit flags that the validator and the codex suite read. |
| `live-contracts.json` | Records the scheduler contract statements for assignment model, concurrency, count, iterations, timeout, stdin, budgets, cleanup, artifacts, completion markers, recursion guard, child environment and incident verdicts. |
| `validate-playbook-package.cjs` | Checks manifest counts, cell and playbook uniqueness, test and playbook discovery, orphan entries and playbook snippet structure, then prints a PASS or FAIL summary with a gap list. |

---

## 4. MATRIX CONTRACT

The matrix is the product of the fourteen edge-case rows and the eight subjects, so it holds one hundred and twelve cells. The current matrix keeps the codex row bindings and swaps in the implemented row set for every remaining adapter and for the fan-out scheduler.

The audit object that `matrix-manifest.ts` exports enforces three properties, and the validator fails the package when any of them is false.

| Property | Meaning |
|---|---|
| `allAdapterBound` | Every adapter subject carries all fourteen rows with a named, implemented test. |
| `allSubjectBound` | Every subject, including the fan-out scheduler, carries all fourteen rows with a named, implemented test. |
| `forbiddenOverclaims` | No test name claims behavior classification or a full process-tree reap that the shipped code does not perform. |

---

## 5. VALIDATION

Run from the repository root. The validator loads the manifest, discovers the registered tests through the runtime Vitest configuration, walks the sibling playbook trees and fails on any gap.

```bash
node .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs
```

Expected result: a `PASS: CLI adapter stress matrix bijection` line followed by the cell, test and playbook counts, and exit code 0. Gaps are listed after a `Gaps:` heading and set a non-zero exit code.

Run the suites themselves with the runtime test configuration.

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts
```

Expected result: the hermetic suites pass. Live provider probes report as skipped unless their opt-in environment variable is set.

---

## 6. RELATED

- [`tests` overview](../../README.md)
- [`runtime` overview](../../../README.md)
- [`system-deep-loop` skill](../../../../README.md)
- [`cli-external-orchestration` skill](../../../../../cli-external-orchestration/README.md)
