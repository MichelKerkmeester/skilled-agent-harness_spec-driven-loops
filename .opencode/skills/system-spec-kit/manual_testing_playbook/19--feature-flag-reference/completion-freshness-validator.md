---
title: "445 -- Completion Freshness Validator"
description: "Manual check that completion freshness is disabled by default, warns on stale continuity when enabled, and promotes stale state to strict failure only with enforce mode."
version: 3.6.0.1
---

# 445 -- Completion Freshness Validator

## 1. OVERVIEW

This scenario validates the completion-freshness strict-rule rollout. The validator recomputes continuity fingerprints and packet-scoped dirty-path state. It is disabled by default, warn-first when the master flag is enabled, and blocking only when enforcement is explicitly enabled.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm default-off, warn-first, enforce, and disable behavior for completion freshness.
- Real user request: `Validate completion freshness so stale packet docs warn first and only fail when enforcement is enabled.`
- Prompt: `Validate SPECKIT_COMPLETION_FRESHNESS and SPECKIT_COMPLETION_FRESHNESS_ENFORCE with disabled, warn, enforce, and disabled rollback steps.`
- Expected execution process: Prepare a sandbox spec folder with a stale continuity fingerprint or dirty packet-scoped file, run strict validation with flags unset, enable freshness and rerun, enable enforce and rerun, then disable both flags and verify baseline behavior.
- Expected signals: Flags unset produce no freshness finding; freshness enabled emits a `CONTINUITY_FRESHNESS` warning or non-blocking finding; enforcement enabled exits with a validation error; disabling both flags restores the baseline result.
- Desired user-visible outcome: The operator can prove freshness is opt-in, warn-first, and enforce-gated.
- Pass/fail: PASS only when each validation mode produces its expected severity and exit behavior.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_COMPLETION_FRESHNESS and SPECKIT_COMPLETION_FRESHNESS_ENFORCE with disabled, warn, enforce, and disabled rollback steps.
```

### Commands

1. Copy a complete Level 1 spec folder into a disposable sandbox.
2. Modify an in-scope spec doc after the stored continuity fingerprint is present, or intentionally set a stale `session_dedup.fingerprint` in the sandbox frontmatter.
3. Unset both flags: `unset SPECKIT_COMPLETION_FRESHNESS SPECKIT_COMPLETION_FRESHNESS_ENFORCE`.
4. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <sandbox-spec-folder> --strict` and capture exit code plus output.
5. Enable warn mode: `export SPECKIT_COMPLETION_FRESHNESS=true`; `unset SPECKIT_COMPLETION_FRESHNESS_ENFORCE`; rerun validation.
6. Enable enforce mode: `export SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`; rerun validation.
7. Disable both flags, rerun validation, and compare with the baseline output.

### Expected

- Baseline disabled run has no `CONTINUITY_FRESHNESS` finding.
- Warn mode surfaces `CONTINUITY_FRESHNESS` with stale fingerprint or dirty-path evidence without making the run fail solely for freshness.
- Enforce mode makes stale continuity a strict validation error.
- Disabled rollback removes freshness findings.

### Evidence

BLOCKED before validation commands could be executed.

Blocking instruction conflict:

```text
BANNED OPERATIONS
- Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
- Do NOT touch any other manual testing playbook scenario file.

ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/completion-freshness-validator.md (this file only)
```

Scenario commands that require prohibited writes:

```text
1. Copy a complete Level 1 spec folder into a disposable sandbox.
2. Modify an in-scope spec doc after the stored continuity fingerprint is present, or intentionally set a stale `session_dedup.fingerprint` in the sandbox frontmatter.
```

Because creating a sandbox spec folder and modifying its contents would create and modify files outside the single allowed write path, no sandbox diff or validation command transcript was produced.

### Pass / Fail

- **BLOCKED**: the scenario requires creating and modifying a disposable sandbox spec folder, but the execution constraints allow writes only to this scenario file.

### Failure Triage

Inspect `scripts/validation/continuity-freshness.ts`, `scripts/spec/validate.sh`, and continuity freshness vitest suites. Confirm the sandbox actually contains a stale fingerprint or dirty packet-scoped path before judging a pass as false negative.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `19--feature-flag-reference/completion-freshness-validator.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/validation/continuity-freshness.ts` | Freshness rule implementation |
| `scripts/spec/validate.sh` | Strict validation flag wiring |
| `mcp_server/tests/continuity-freshness.vitest.ts` | MCP-side freshness coverage |
| `scripts/tests/continuity-freshness.vitest.ts` | Script-side freshness coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 445
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/completion-freshness-validator.md`
