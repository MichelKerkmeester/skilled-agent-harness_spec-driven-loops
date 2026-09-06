# Iteration 009 — Maintainability: external consumer resolution

## Focus

Audit live hooks and command workflow assets outside the moved package for
consumers that still resolve the retired `scripts/` entrypoints.

## Sources reviewed

- `.opencode/hooks/session-lifecycle/claude/session-stop.ts`
- `.opencode/hooks/session-lifecycle/claude/session-stop.js`
- `.opencode/hooks/session-lifecycle/README.md`
- `.opencode/commands/speckit/assets/speckit-plan-auto.yaml`
- `.opencode/commands/speckit/assets/speckit-plan-confirm.yaml`
- `.opencode/commands/speckit/assets/speckit-complete-auto.yaml`
- `.opencode/commands/speckit/assets/speckit-complete-confirm.yaml`

## Findings

### F014 — P1: Deployed Claude stop hook retains retired autosave candidates

- **Evidence:** `.opencode/hooks/session-lifecycle/claude/session-stop.js:57-60`
  probes `scripts/dist/memory/generate-context.js` candidates. The adjacent
  TypeScript source at `session-stop.ts:73-76` probes the current
  `runtime/cli/dist/continuity/generate-context.js` candidates instead.
- **Impact:** The session-lifecycle README identifies the `.js` sibling as
  the deployed compiled entrypoint. Until the runtime hook dist is rebuilt,
  Claude stop autosave cannot locate the moved continuity writer and silently
  reports `Auto-save skipped`; the source fix is not enough for the executed
  artifact.
- **Severity:** P1 because a live session-stop consumer remains on the
  retired path contract.
- **Proof:** direct source-versus-deployed-artifact comparison and the
  hook's documented compiled-entrypoint ownership.

### F015 — P1: Speckit command workflow assets still instruct retired create paths

- **Evidence:** the plan auto/confirm and complete auto/confirm YAML assets
  instruct `Run create.sh (scripts/spec/create.sh)` or
  `Run create.sh script (scripts/spec/create.sh)`. The current executable is
  `runtime/cli/spec/create.sh`.
- **Impact:** The active workflow definitions can direct an executor toward a
  path removed by the move. This is outside the package's own README and is
  therefore missed by package-local path checks while still affecting native
  plan and completion flows.
- **Severity:** P1 because the command assets are executable workflow
  instructions at a central orchestration boundary.
- **Proof:** direct search across all four active plan/complete YAML variants
  and existence of the current runtime CLI path.

## Coverage

- Files reviewed: 7
- New findings: F014, F015
- Resolved findings: none
- Dimension: maintainability

## Next focus

Perform the final tenth-pass coverage and adjudication sweep, checking that
all active findings have stable evidence and that no required review
dimension or cross-reference protocol was left unrepresented.

Review verdict: FAIL
