---
title: "CU-020 -- spec-gate-prebind.mjs (authored by a concurrent session, uncommitted, not yet reviewed or tested)"
description: "This documentation-only scenario records the designed sessionStart Gate-3 prebind intent of spec-gate-prebind.mjs, authored by a concurrent session, uncommitted, and not yet reviewed or tested."
version: 1.0.0.0
---

# CU-020 -- spec-gate-prebind.mjs (authored by a concurrent session, uncommitted, not yet reviewed or tested)

This document captures the documentation-only contract, designed purpose, execution flow, source anchors and metadata for `CU-020`.

---

## 1. OVERVIEW

This scenario documents `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`, authored by a concurrent session, uncommitted, and not yet reviewed or tested. It does not execute the adapter or make any claim about runtime behavior. Reading the file records its designed purpose: run at `sessionStart`, satisfy Gate 3 when a valid `MK_SPEC_FOLDER` is declared, or open the Gate-3 spec-folder enforcement state when `MK_SPEC_GATE_ENFORCE=1`, because `beforeSubmitPrompt` never fires under `cursor-agent`.

### Why This Matters

The fifth Cursor hook adapter must remain clearly separated from the four paths already covered by `CU-013` and `CU-014`. The feature catalog is the status authority: `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested. This scenario preserves that wording and keeps the normal verdict at `SKIP` with the specific blocker `pending review of a concurrent session's uncommitted work`.

---

## 2. SCENARIO CONTRACT

Operators perform documentation-only inspection for `CU-020`; they do not invoke the adapter, wire it into `hooks.json`, or infer runtime behavior from its source text.

- Objective: Confirm the file exists, read its stated `sessionStart` Gate-3 prebind design intent, and confirm the repository's documentation retains the status wording that it was authored by a concurrent session, uncommitted, and not yet reviewed or tested.
- Real user request: `Document the fifth Cursor hook adapter without treating a concurrent session's uncommitted work as reviewed or runtime-tested.`
- Prompt: `Read spec-gate-prebind.mjs, authored by a concurrent session, uncommitted, and not yet reviewed or tested, and document its designed sessionStart Gate-3 prebind intent without executing it.`
- Expected execution process: Operator checks that `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`, authored by a concurrent session, uncommitted, and not yet reviewed or tested, exists -> reads the file text for its `sessionStart`, `MK_SPEC_FOLDER`, `MK_SPEC_GATE_ENFORCE`, and `beforeSubmitPrompt` design notes -> searches repository Markdown for every mention and checks that no mention overstates the adapter's runtime status -> records `SKIP` with the blocker `pending review of a concurrent session's uncommitted work`.
- Expected signals: The file exists. Its source text describes session-start prebinding/opening intent without runtime evidence. Every documentation mention retains the wording that it was authored by a concurrent session, uncommitted, and not yet reviewed or tested. No command executes the adapter or asserts that the gate opens.
- Desired user-visible outcome: An auditable documentation record for the fifth adapter that explains the intended Gate-3 timing correction while preserving the explicit unreviewed status and the default `SKIP` verdict.
- Pass/fail: Default verdict is `SKIP` with the named blocker `pending review of a concurrent session's uncommitted work`. A documentation-only PASS is permitted only when the file and status-wording checks succeed; it must not assert runtime behavior. FAIL if the file is absent, the design intent cannot be read, or any documentation overstates the adapter's runtime status.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Check that `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`, authored by a concurrent session, uncommitted, and not yet reviewed or tested, exists without running it.
2. Read the source text and record only its designed `sessionStart` Gate-3 prebind/opening intent.
3. Search repository Markdown for every mention of the adapter and retain the required unreviewed status wording.
4. Do not dispatch `cursor-agent`, modify `.cursor/hooks.json`, invoke the adapter, or infer whether the runtime gate opens.
5. Return `SKIP` with the blocker `pending review of a concurrent session's uncommitted work`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-020 | spec-gate-prebind.mjs (authored by a concurrent session, uncommitted, not yet reviewed or tested) | Confirm the file and its documented design intent without runtime execution | `Read spec-gate-prebind.mjs, authored by a concurrent session, uncommitted, and not yet reviewed or tested, and document its designed sessionStart Gate-3 prebind intent without executing it.` | 1. `bash: test -f .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` -> 2. `bash: sed -n '1,220p' .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` -> 3. `bash: rg -n -i -C 2 "spec-gate-prebind|authored by a concurrent session|not yet reviewed or tested" . --glob '*.md'` -> 4. `bash: rg -n -i -P '\bspec-gate-prebind\.mjs\b.{0,240}\b(live|operational|runtime-tested)\b|\b(live|operational|runtime-tested)\b.{0,240}\bspec-gate-prebind\.mjs\b' . --glob '*.md' --glob '!spec-gate-prebind-unreviewed.md'` (expect no matches) | Step 1: file exists; Step 2: source text describes only the designed sessionStart intent; Step 3: documentation mentions retain the required status wording; Step 4: no unhedged runtime-status claim is returned | File existence result, source excerpt, repository Markdown search output, empty output from the unhedged-status search | Default verdict is SKIP with blocker `pending review of a concurrent session's uncommitted work`; documentation-only PASS is allowed when all four checks succeed, and neither verdict may assert runtime behavior; FAIL if the file is absent or documentation overstates its status | (1) Re-read the feature-catalog entry for the authoritative status wording; (2) remove any unhedged status claim from documentation; (3) do not add a runtime assertion or execute the adapter while the concurrent session's work remains unreviewed and uncommitted |

### Optional Supplemental Checks

- None. Runtime execution, hook registration, and live Gate-3 behavior are outside this documentation-only scenario while the concurrent session's work remains unreviewed and uncommitted.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [`cursor-hooks-and-spec-gate.md`](../../../feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md) | Authoritative status language for all five Cursor hook adapters, including the statement that `spec-gate-prebind.mjs` was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Source text for the designed `sessionStart` Gate-3 prebind/opening intent; authored by a concurrent session, uncommitted, and not yet reviewed or tested |
| `../../../../system-spec-kit/runtime/hooks/cursor/README.md` | Runtime hook status documentation; the prebind entry must retain the wording that it was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested |
| `../../../../system-spec-kit/mcp-server/hooks/cursor/README.md` | Cursor event-delivery and shared-configuration reference for the `beforeSubmitPrompt` non-delivery premise |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: CU-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/spec-gate-prebind-unreviewed.md`
- Feature catalog source: [`cursor-hooks-and-spec-gate.md`](../../../feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md)
- Default verdict: `SKIP` — pending review of a concurrent session's uncommitted work
