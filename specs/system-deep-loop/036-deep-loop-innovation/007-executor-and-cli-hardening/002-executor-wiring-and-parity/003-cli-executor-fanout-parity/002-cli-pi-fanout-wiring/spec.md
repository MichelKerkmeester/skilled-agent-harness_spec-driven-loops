---
title: "Feature Specification: cli-pi fan-out lineage wiring"
description: "cli-pi was declared in EXECUTOR_KINDS but its fan-out lineage builder was a hard stub that threw, so no deep mode could dispatch through pi. This phase implements the real buildPiLineageCommand (pi -p --offline --model <provider>/<id> with --thinking for reasoning and a read-only tool allowlist), maps each allowlisted pi model to its provider, and adds reasoningEffort to the cli-pi flag-support table so the runtime forwards --thinking. Verified by unit tests over command construction and a live end-to-end dispatch of the builder's own output."
trigger_phrases:
  - "cli-pi fanout wiring"
  - "buildPiLineageCommand implementation"
  - "pi provider model mapping fanout"
  - "reasoningEffort to thinking cli-pi"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled cli-pi fanout packet docs to Complete"
    next_safe_action: "Commit the reconciled cli-pi packet docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Each pi model maps to a provider (openai-codex, deepseek, minimax, xiaomi) via pi --list-models"
      - "Pi reasoning is the first-class --thinking flag; pi has no sandbox or service-tier surface"
      - "The builder's own output dispatches successfully against real pi"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: cli-pi Fan-out Lineage Wiring

> Phase adjacency under the `043-cli-executor-fanout-parity` parent (grouping order, not a runtime dependency): predecessor `001-executor-matrix-audit`; successor `003-devin-cursor-exec-hardening`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`buildPiLineageCommand` in `fanout-run.cjs` was a hard stub that threw ("command construction is unavailable until its headless
invocation contract is confirmed"), so although cli-pi appeared in `EXECUTOR_KINDS` with a model allowlist, no deep mode could
dispatch through it. Direct `pi -p` dispatch worked, but the fan-out path did not. The cli-pi flag-support table also omitted
`reasoningEffort`, so even a wired builder could not forward pi's `--thinking` control.

### Purpose
Implement the real cli-pi fan-out lineage builder and let the runtime forward reasoning, so cli-pi is a first-class fan-out
executor for every model in its allowlist.

### Non-Goals
- Wiring cli-pi into any deep mode's auto-YAML (that is phase 004).
- New pi models beyond the confirmed allowlist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `buildPiLineageCommand`: real command construction (`pi -p --offline --model <provider>/<id>`, `--thinking` for reasoning, a read-only tool allowlist).
- A per-model provider map captured from `pi --list-models`.
- Adding `reasoningEffort` to the cli-pi entry of `EXECUTOR_KIND_FLAG_SUPPORT`.
- Unit tests for command construction and a live end-to-end dispatch check.

### Out of Scope
- Per-mode availability (phase 004); devin/cursor exec (phase 003); the full combo matrix (phase 005).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (REQ-FUNC-001) — The builder constructs `pi -p --offline --model <provider>/<id> [--thinking <effort>] [--tools read,grep,find,ls] <prompt>` for every allowlisted model, with the correct provider prefix.
- **R2** (REQ-FUNC-002) — `--offline` is always present; the prompt is the final positional argument; exit code is never treated as a success or auth signal (documented for callers).
- **R3** (REQ-FUNC-003) — `reasoningEffort` is forwarded as `--thinking` and validated against pi's level set; an invalid level fails closed.
- **R4** (REQ-FUNC-004) — A read-only leaf restricts the tool allowlist to reads; a write leaf is unrestricted.
- **R5** (REQ-FUNC-005) — `reasoningEffort` is a supported cli-pi config field; sandboxMode and serviceTier remain unsupported.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. `buildPiLineageCommand` constructs the correct command for all seven allowlisted models (provider-prefixed).
2. `reasoningEffort` maps to `--thinking`; an invalid level is rejected.
3. The builder's own output dispatches successfully against real pi (live end-to-end).
4. `fanout-run`, `executor-config`, and `executor-audit` vitest suites pass and whole-runtime tsc is 0.
5. `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Provider drift** — pi's provider roster can change; the map is captured from `pi --list-models` and must be re-checked if the allowlist changes.
- **Shared fan-out blast radius** — `fanout-run.cjs` is used by every deep mode; the full fanout/executor vitest suites gate the change.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the read-only tool allowlist be configurable, or is the fixed read set sufficient for read-only leaves?
<!-- /ANCHOR:questions -->
