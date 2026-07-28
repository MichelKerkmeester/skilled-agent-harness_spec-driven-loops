---
title: "CU-019 -- Composer RCAF template dispatch"
description: "This scenario validates Composer's RCAF prompt-craft profile for `CU-019`, dispatching a filled scaffold against --model composer-2.5 and confirming the output matches the Format contract, while the profile itself remains honestly labeled default-unverified."
version: 1.0.0.0
---

# CU-019 -- Composer RCAF template dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-019`.

---

## 1. OVERVIEW

This scenario validates Composer's RCAF prompt-craft profile (`sk-prompt/sk-prompt-models/references/models/composer-2.5.md`) for `CU-019`. It focuses on filling the profile's own scaffold for a small, concrete task and dispatching it with `--model composer-2.5`, confirming the output matches the Format contract the scaffold specifies.

### Why This Matters

Composer has zero prior empirical dispatch data in this repo - `composer-2.5.md` §4 records `status: "default-unverified"`, `benchmark: null`, `confidence: "low"`. This scenario generates the first real, first-hand dispatch evidence against that scaffold, while explicitly NOT updating the profile's benchmark status itself (that update is out of scope for this phase - a future model-registry benchmark pass owns that decision).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify a task filled into Composer's RCAF scaffold and dispatched with `--model composer-2.5` produces a working generation matching the scaffold's Format contract.
- Real user request: `Use Cursor's own Composer model specifically for this small utility function.`
- Prompt (RCAF-filled from `composer-2.5.md` §5 scaffold): `## Role\nYou are a senior software engineer working in this repository's existing conventions.\n\n## Context\nRepository: cli-cursor manual-testing playbook scratch task.\nActive files in scope:\n  - /tmp/cli-cursor-playbook-cu019/format.ts - does not exist yet, to be created\n\nRelevant background: A small, isolated formatting utility is needed; no existing code to preserve.\n\nPre-plan (medium density):\n1. Create /tmp/cli-cursor-playbook-cu019/format.ts.\n2. Implement titleCase(s: string): string that capitalizes the first letter of each word.\n3. Export the function as the sole export.\n\n## Action\nImplement titleCase so it satisfies every acceptance rule below.\n\nAcceptance criteria:\n- Handles multi-word strings correctly.\n- Handles a single-word string correctly.\n- Exported as a named export.\n\n## Format\nOutput ONLY the corrected file/function - no prose, no markdown fence. Write it to /tmp/cli-cursor-playbook-cu019/format.ts.\n\nConstraints:\n- Do not modify files outside the scope list above.\n- Do not introduce new dependencies.`
- Expected execution process: Operator pre-cleans the target temp directory -> fills the composer-2.5.md §5 scaffold verbatim for the `titleCase` task -> dispatches with `--model composer-2.5 --auto-review --sandbox enabled` -> inspects the generated file against the Format contract (a single exported function, no extraneous prose file) and the acceptance criteria.
- Expected signals: `cursor-agent -p ... --model composer-2.5` exits 0. `/tmp/cli-cursor-playbook-cu019/format.ts` exists, exports a `titleCase` function, and correctly handles multi-word and single-word inputs. No files outside the scope list are touched.
- Desired user-visible outcome: A working generation from Composer's own scaffold, recorded as real first-time empirical dispatch data against a profile the registry still honestly labels `default-unverified` - this scenario does not itself update that benchmark status.
- Pass/fail: PASS if exit code is 0 AND the generated file matches the Format contract AND the function satisfies the stated acceptance criteria. FAIL if the dispatch errors, the file is missing/misplaced, or the function does not satisfy the acceptance criteria.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `composer-2.5.md` §5 "Tuned Template Snippet" and fill it verbatim for the `titleCase` task.
2. Pre-clean `/tmp/cli-cursor-playbook-cu019/`.
3. Dispatch the filled scaffold with `--model composer-2.5 --auto-review --sandbox enabled`.
4. Inspect the generated file against the Format contract and acceptance criteria.
5. Return a PASS/FAIL verdict naming the observed output shape and whether the acceptance criteria were met, without asserting any change to the profile's `default-unverified` status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-019 | Composer RCAF template dispatch | Verify a filled Composer RCAF scaffold produces a working generation matching its Format contract | (RCAF-filled scaffold - see §2 above, targeting `titleCase` in `/tmp/cli-cursor-playbook-cu019/format.ts`) | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu019 && mkdir -p /tmp/cli-cursor-playbook-cu019` -> 2. `cursor-agent -p "## Role\nYou are a senior software engineer working in this repository's existing conventions.\n\n## Context\nActive files in scope: /tmp/cli-cursor-playbook-cu019/format.ts (does not exist yet).\n\n## Action\nImplement titleCase(s: string): string that capitalizes the first letter of each word, handling both multi-word and single-word input. Write it to /tmp/cli-cursor-playbook-cu019/format.ts as the sole export.\n\n## Format\nOutput only the file path written and a one-line confirmation - no prose explanation of the implementation itself." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu019-stdout.txt 2>&1` -> 3. `bash: cat /tmp/cli-cursor-playbook-cu019/format.ts` -> 4. `bash: grep -E "export.*titleCase" /tmp/cli-cursor-playbook-cu019/format.ts` -> 5. `bash: node -e "const {titleCase}=require('/tmp/cli-cursor-playbook-cu019/format.ts'.replace('.ts','.js')); " 2>/dev/null; npx tsc --outDir /tmp/cli-cursor-playbook-cu019/dist /tmp/cli-cursor-playbook-cu019/format.ts && node -e "const {titleCase}=require('/tmp/cli-cursor-playbook-cu019/dist/format.js'); console.log(titleCase('hello world'), '\|', titleCase('hello'))"` | Step 2: exit 0; Step 3: file exists; Step 4: named export `titleCase` found; Step 5: compiles and returns `Hello World \| Hello` | Generated `format.ts` contents, dispatched stdout, exit code, compiled/executed function output for both test inputs | PASS if exit 0 AND `titleCase` is exported AND it correctly title-cases both a multi-word and a single-word input; FAIL if the export is missing, the function mishandles either input case, or the dispatch errors | (1) Re-confirm `--model composer-2.5` was accepted (not silently substituted); (2) re-check `cursor-agent --list-models` still lists `composer-2.5` for this account; (3) inspect stdout for a truncated or partial generation |

### Optional Supplemental Checks

- Re-run the identical scaffold with `--model composer-2.5-fast` and compare output quality/latency, recording (not asserting in the registry) any observed difference.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../../../sk-prompt/sk-prompt-models/references/models/composer-2.5.md` (§5 Tuned Template Snippet) | Authoritative RCAF scaffold this scenario fills verbatim |
| `../../SKILL.md` (§3 Model Selection) | Documents Composer as Cursor's own native model |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../sk-prompt/sk-prompt-models/references/models/composer-2.5.md` | §3 Recommended Framework (RCAF), §4 Benchmark Evidence (`default-unverified`), §5 scaffold |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing/implementation-summary.md` | Live confirmation Composer is dispatchable end-to-end (`pong` smoke test) |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CU-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/composer-rcaf-template-dispatch.md`
