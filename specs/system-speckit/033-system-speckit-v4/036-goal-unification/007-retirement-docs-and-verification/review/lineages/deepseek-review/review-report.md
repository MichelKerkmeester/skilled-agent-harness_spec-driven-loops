---
title: "Deep Review Report — Goal Unification Build"
trigger_phrases: []
---
# Deep Review Report — Goal Unification Build

## Executive Summary

**Verdict: CONDITIONAL**
**Release readiness:** `release-blocking` (P1 findings required before PASS)
**hasAdvisories:** `false`
**Active findings:** P0=0, P1=5, P2=10 (15 total, 0 resolved)

This three-iteration independent review covered correctness, security, traceability, and maintainability across the goal-unification build that phase 007 verifies: the shared slice module, the packet-backed core, the manage CLI, the pi/cursor/devin adapters, the OpenCode plugin's parallel implementation, the spec-kit validator's goal rules, the speckit command goal steps, and the always-on posture documents.

Five P1 findings block a PASS. Three are frozen-contract contradictions: pointer-less records still inject their stored objective although ADR-001 and ADR-002 say they must not (F002); the set-time budget check ADR-006 promises does not exist and over-budget objectives truncate silently (F003); and the OpenCode injection carries no resend reminder although ADR-004 says the reminder rides the injection path (F010). Two are reproducible defects: a fence with trailing whitespace leaks the frontmatter, including `session_id`, into every goal surface because the runtime extractor's regex is stricter than the validator's (F001), and a symlinked packet path escapes the workspace so `bind` reads and `log` writes a `goal.md` outside it (F005).

Ten P2 findings cover cache-key, lock-scope, capability-surface, lifecycle-history, workspace-normalization, parity-coverage and documentation-coherence gaps; each names the decision it bears on.

No reviewed source was changed. All writes are review artifacts in this lineage directory.

## Remediation Trigger

Planning is required for the five P1 findings before the phase-007 verification sweep can pass. The P1 set splits into two workstreams: contract reconciliation (ADR text versus executable behavior for F002, plus the ADR-004/README wording for F010 and the ADR-006 enforcement gap for F003) and the two code defects (F001 extractor boundary, F005 symlink refusal). The P2 set can ride the same plan as follow-ons.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"F001","severity":"P1","findingClass":"extractor-boundary-drift","title":"Opening or closing fence with trailing whitespace leaks frontmatter into every goal surface"},
    {"id":"F002","severity":"P1","findingClass":"contract-vs-executable-contract","title":"Pointer-less records still inject their stored objective, contradicting ADR-001/ADR-002 and the hook README"},
    {"id":"F003","severity":"P1","findingClass":"missing-promised-enforcement","title":"ADR-006's set-time consumer length check is absent; over-budget objectives truncate silently"},
    {"id":"F005","severity":"P1","findingClass":"path-escape-via-symlink","title":"Symlinked packet path escapes the workspace: bind reads and log writes a goal.md outside it"},
    {"id":"F010","severity":"P1","findingClass":"runtime-parity-gap","title":"OpenCode injection carries no resend reminder although ADR-004 says the reminder rides the injection path"}
  ],
  "remediationWorkstreams": [
    "WS1 slice boundary and workspace containment (F001, F005)",
    "WS2 frozen-contract reconciliation: render fallback, set-time budget check, reminder path (F002, F003, F010)",
    "WS3 OpenCode plugin surface and lifecycle parity (F004, F007, F008, F009, F013, F014)",
    "WS4 documentation and requirement coherence, lock-scope note, Cursor hint (F006, F011, F012, F015)"
  ],
  "specSeed": [
    "Define one extractor boundary both the runtime and the validator import or test against, and realpath packet targets before read or write.",
    "Decide the truth for pointer-less records and the OpenCode reminder, then amend ADRs/README/changelog or the code and tests together.",
    "Implement the promised set-time budget check or scope ADR-006 to the validator, and expose log/unbind on OpenCode."
  ],
  "planSeed": [
    "WS1 is code-only and test-pinned; WS2 is a decision-and-text change with code follow-ups; WS3 is plugin work; WS4 is documentation.",
    "Phase 007's verification sweep (validate.sh --strict on 036, node --test goal suites, plugin tests, hygiene) is the gate after remediation."
  ]
}
```

## Findings

### P0 — Blockers

- None.

### P1 — Required

- **F001** — Opening or closing fence with trailing whitespace leaks frontmatter into every goal surface — `.opencode/hooks/goal/lib/goal-slice.cjs:22` (ADR-003). `FRONTMATTER_PATTERN` requires `---\n` exactly while `continuity-freshness.ts:17` allows `---\s*\r?\n`; observed through the shipped module, a `--- ` fence yields `frontmatter: null` and `renderChatSlice()` returns the YAML block including `session_id: SECRET`, while the validator regex treats the same bytes as frontmatter. The golden parity test ADR-003 promises does not exist.
- **F002** — Pointer-less records still inject their stored objective, contradicting ADR-001/ADR-002 and the hook README — `.opencode/hooks/goal/lib/goal-core.cjs:394` (ADR-001, ADR-002). Both render paths fall through to `goal.objective`; ADR-001 says "no injection, no fallback", ADR-002 says "a record without a pointer injects nothing until a bind", and `README.md:37` lists unbound as producing no block, while `goal-core.test.cjs:824` and `goal-pi.test.mjs:227` pin the fallback.
- **F003** — ADR-006's set-time consumer length check is absent; over-budget objectives truncate silently — `.opencode/hooks/goal/lib/goal-core.cjs:1115` (ADR-006). `clampText` truncates with an ellipsis and no signal at both set and bind sites in core and plugin; the only tiered enforcement is the TypeScript validator.
- **F005** — Symlinked packet path escapes the workspace: bind reads and log writes a `goal.md` outside it — `.opencode/hooks/goal/lib/goal-slice.cjs:131` (ADR-001). The guard is lexical only; observed with the shipped CLI on a fixture, `bind` accepted the symlinked packet and `log` appended the row into the outside file.
- **F010** — OpenCode injection carries no resend reminder although ADR-004 says the reminder rides the injection path — `.opencode/plugins/opencode-goal.js:2707` (ADR-004). `renderResendReminder` has callers only in pi, cursor and devin; the plugin's tool output carries `resend_pending=` instead, and 005's summary documents the narrower scope without an ADR/README/changelog amendment.

### P2 — Suggestions

- **F004** — Plugin brief cache keys on state-file `mtimeMs:size`, not the packet slice hash ADR-004 requires — `.opencode/plugins/opencode-goal.js:2790` (ADR-004 constraint; benign today because the packet is re-read at render).
- **F006** — Log serialization is stateDir-scoped and the durable-slice guard is an advisory pre-write check — `.opencode/hooks/goal/lib/goal-core.cjs:1046` (README "per-packet lock").
- **F007** — OpenCode plugin exposes no `unbind` and no `log`, so ADR-007's log authority is unreachable through the primary tool — `.opencode/plugins/opencode-goal.js:168` (ADR-005, ADR-007).
- **F008** — Setting a new objective on a bound record silently drops the packet pointer — `.opencode/plugins/opencode-goal.js:1792` (ADR-001).
- **F009** — Rebinding never archives the prior record: core's replace branch is dead code and the plugin has no archive path — `.opencode/hooks/goal/lib/goal-core.cjs:937` (ADR-002 store rationale).
- **F011** — Changelog contradicts itself on Devin: adapter regained (line 303) versus "deliberately decommissioned" (line 305) — `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:305` (ADR-005).
- **F012** — 009 REQ-010 still requires docs to call Devin decommissioned; ADR-005's promised amendment is absent — `specs/hooks/009-goal-isolation/spec.md:150` (ADR-005).
- **F013** — Plugin bind stores an unresolved workspace through a dead ternary, drifting from core's repo-root resolution — `.opencode/plugins/opencode-goal.js:1838` (ADR-005 parity).
- **F014** — No parity test between core `renderGoalBrief` and plugin `renderGoalInjection` despite the byte-for-byte claim — `.opencode/hooks/goal/README.md:37` (ADR-003 shared-renderer intent).
- **F015** — Cursor command hint advertises actions the command contract fails closed on — `.cursor/commands/goal-cursor.md:3` (ADR-005 degraded-capability decision).

## Dimension Coverage

| Dimension | Status | Findings |
|-----------|--------|----------|
| correctness | covered | F001, F002, F003, F008 |
| security | covered | F005, F006 |
| traceability | covered | F007, F010, F011, F012, F015 |
| maintainability | covered | F004, F009, F013, F014 |

## Traceability Checks

- `spec_code` (core): **fail** — four frozen-ADR contradictions (F002, F003, F005, F010).
- `checklist_evidence` (core): **partial** — phase 007 is a scaffold (T001-T009 unchecked, `Status: Draft`, no verification evidence); no false completion claim found.
- `skill_agent` (overlay): **notApplicable** — spec-folder target.
- `agent_cross_runtime` (overlay): **fail** — OpenCode diverges on actions (F007), reminder (F010) and workspace normalization (F013); the Cursor hint mismatches its contract (F015); Pi and Devin match their rows.
- `feature_catalog_code` (overlay): **partial** — feature catalog `:784-788` already describes the packet-bound plugin; the 009 requirement row is stale (F012).
- `playbook_capability` (overlay): **partial** — playbook, template and manifest carry the same 3000/4000 pair; the runtime set path does not enforce them (F003).

## Ruled Out

- Budget arithmetic inconsistency: preview 576 characters, prompt objective budget 1200, pointer-first projection.
- Validator goal-budget and binding-rule absence: warn/error tiers and the binding-row existence rule are implemented and tested.
- Happy-path frontmatter leak: well-formed documents strip frontmatter in both runtime and plugin tests.
- Log row injection altering the durable slice: newlines collapse and the handler refuses a changed durable hash.
- Lexical path escape (`../outside`, absolute, empty): refused; only symlinks bypass the guard.
- Resend hash instability: a log append or reflow does not change the hash; a criterion change does.
- Devin adapter wiring absence: both hook events invoke the adapter; the injection-only fallback is documented and pre-authorized.
- AGENTS.md posture block absence: block and Quick Reference row present.
- Resume surfaces mutating goals: both resume yamls are read-only and carry `never_halts`.
- Speckit goal-step wiring absence: plan/implement/complete expose `goal_prompt_choice` and per-runtime `packet_goal` bind with the durable-hash resend trigger.

## Sources Reviewed

- Slice and core: `lib/goal-slice.cjs`, `lib/goal-core.cjs`, `bin/goal.cjs`, all goal test suites.
- Adapters: `pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs`, `.devin/hooks.v1.json`.
- Plugin: `.opencode/plugins/opencode-goal.js` and its tool-path test suite.
- Validator: `spec-doc-structure.ts`, `level-contract-resolver.ts`, `continuity-freshness.ts`, `spec-doc-structure.vitest.ts`, `spec-kit-docs.json`, `goal.md.tmpl`, `goal-set-string-playbook.md`.
- Commands: speckit plan/implement/complete/resume-auto/resume-confirm, `/goal-opencode`, `/goal-cursor`.
- Claims: `decision-record.md` (eight ADRs), 003-006 implementation summaries, `README.md`, changelog, 009 REQ-010, `AGENTS.md`.

## Stop Summary

- Stop reason: `maxIterationsReached` (3 of 3 iterations; stop policy `max-iterations`, convergence threshold 0.05 treated as telemetry only).
- Lineage: `sessionId=fanout-deepseek-review-1789117367422-11rap2`, `generation=1`, `lineageMode=auto`, executor `cli-pi` / `deepseek-v4.1-flash`.
- Artifacts: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `resource-map.md`, `iterations/iteration-00{1,2,3}.md`, `deltas/iter-00{1,2,3}.jsonl`.
- Every iteration file ends with its verdict line; this report's verdict is the final synthesis verdict.

Review verdict: CONDITIONAL
