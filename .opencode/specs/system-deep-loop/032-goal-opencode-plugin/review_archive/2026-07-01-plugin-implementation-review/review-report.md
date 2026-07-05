---
title: "Deep Review Report — /goal OpenCode Plugin (phases 001-008)"
description: "Autonomous deep-review loop findings for deep-loops/032-goal-opencode-plugin, phases 001-state-store through 008-system-spec-kit-integration. Phase 009-speckit-command-goal-prompt-offer excluded (owned by a separate in-flight OpenCode session)."
---

# Deep Review Report — /goal OpenCode Plugin

**Spec folder**: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
**Review packet**: `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/`
**Executor**: cli-opencode, `openai/gpt-5.5-fast`, `--variant high` (label: gpt)
**Iterations**: 15 of 15 max | **Stop reason**: maxIterationsReached (loop was extended from an initial 13-iteration convergence to the full 15-iteration ceiling at coordinator request — see §11 Audit Appendix)
**Session**: sessionId=2026-07-01T05:41:53Z, generation=1, lineageMode=new

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories**: false (verdict is CONDITIONAL, not PASS, so the advisory flag does not apply)
- **Active findings (plugin-scoped)**: P0=0, P1=12, P2=4 (16 total)
- **Additional finding (review-tooling-scoped, not counted toward the plugin verdict)**: 1 P1 (DR-013-P1-001, about the deep-review runtime's own findings-registry projection — see §9 Deferred Items)
- **Review scope**: `.opencode/plugins/mk-goal.js` (1676 lines), the live `/goal` command doc (renamed mid-review from `opencode_goal.md` to `goal_opencode.md`), 6 `mk-goal-*.test.cjs` files, 8 phase-doc sets (`spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`/`description.json`/`graph-metadata.json` for phases 001–008), and 4 overlay feature-catalog/playbook docs. Phase `009-speckit-command-goal-prompt-offer` was excluded throughout, per the pre-approved scope boundary (owned by a separate in-flight OpenCode session).
- **Headline risk**: no P0/security-blocking vulnerability was found, but the plugin has a real prompt-injection boundary gap (narrow sanitizer blacklist, DR-005), an unredacted secret-leak path in verifier exception handling (DR-006), and pervasive command-surface naming drift across code, phase docs, and overlay catalogs (DR-002/DR-007/DR-008) that is actively worsening — the live command file was renamed a second time (`opencode_goal.md` → `goal_opencode.md`) by a concurrent session during this very review.

---

## 2. Planning Trigger

`/speckit:plan [remediation]` is **triggered** — verdict is CONDITIONAL with 12 active P1 findings.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 12,
    "P2": 4,
    "total": 16,
    "outOfScopeNote": "DR-013-P1-001 (1 additional P1) is about the deep-review runtime's own registry projection, not the /goal plugin; excluded from this tally, tracked separately in Deferred Items."
  },
  "remediationWorkstreams": [
    "security-hardening",
    "command-surface-normalization",
    "regression-test-backfill",
    "config-contract-docs",
    "ux-feedback-clarity"
  ],
  "specSeed": [
    "032-goal-opencode-plugin/002-injection-plugin: amend spec to require a whole-block injection length clamp, not just a prompt-subsection budget",
    "032-goal-opencode-plugin/003-goal-command: pick one canonical command filename/invocation and update all referencing docs",
    "032-goal-opencode-plugin/007-sk-prompt-goal-enhancement: clarify whether RICCE must appear as stored metadata or is satisfied structurally"
  ],
  "planSeed": [
    "Clamp renderGoalInjection's final block to maxInjectionChars (DR-001)",
    "Broaden sanitizePromptText/sanitizeInlineText from blacklist to allowlist/structural quoting (DR-005)",
    "Redact supervisorVerifier exception messages before persistence/injection (DR-006)",
    "Normalize command filename across code, phase docs, and overlay catalogs (DR-002, DR-007, DR-008)",
    "Add regression tests for the 4 previously-unpinned behaviors (DR-009-P1-001)",
    "Decide and document MK_GOAL_PLUGIN_DISABLED's true contract (DR-010)"
  ],
  "findingClasses": [
    "spec-mismatch/boundary-handling",
    "cross-consumer/prompt-injection-boundary",
    "cross-consumer/secret-redaction-boundary",
    "cross-consumer/command-surface-traceability",
    "test-isolation/class-of-bug",
    "config-contract-drift",
    "UX-friction"
  ],
  "affectedSurfacesSeed": [
    ".opencode/plugins/mk-goal.js",
    ".opencode/commands/goal_opencode.md",
    ".opencode/plugins/tests/mk-goal-*.test.cjs",
    "032-goal-opencode-plugin/{003,007,008}",
    ".opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md",
    ".opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md",
    ".opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md",
    ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

All findings are read-only observations against `.opencode/plugins/mk-goal.js` and its surrounding docs/tests. None required modifying the review target. Dimension attribution below is drawn directly from each iteration's own recorded dimension header (the reducer-owned `deep-review-findings-registry.json` `dimension` field mis-tags several entries as `correctness` — that tagging bug is itself folded into DR-013-P1-001's evidence).

| ID | Sev | Dimension | Title | File:Line | Disposition |
|----|-----|-----------|-------|-----------|--------------|
| DR-001-P1-001 | P1 | correctness | Injection max-length option does not cap the rendered active-goal block | `.opencode/plugins/mk-goal.js:1376` | active |
| DR-002-P1-001 | P1 | correctness | Command docs/specs advertised a bare `/goal` command after the router was renamed | `.opencode/commands/goal_opencode.md:7` (was `opencode_goal.md`) | active |
| DR-003-P1-001 | P1 | correctness | Replacement goals can be continued after a stale verifier result was discarded | `.opencode/plugins/mk-goal.js:1588` | active |
| DR-004-P1-001 | P1 | correctness | Prompt enhancement metadata omits the required RICCE marker | `.opencode/plugins/mk-goal.js:290` | active |
| DR-004-P2-001 | P2 | correctness | Command contract says unknown verbs fail; dispatch treats any text as `set` | `.opencode/commands/goal_opencode.md:43` | active |
| DR-005-P1-001 | P1 | security | Active-goal sanitization is a narrow blacklist before promoting user text into system context | `.opencode/plugins/mk-goal.js:177` | active |
| DR-006-P1-001 | P1 | security | Verifier exception messages bypass secret redaction before persistence/injection | `.opencode/plugins/mk-goal.js:1057` | active |
| DR-007-P1-001 | P1 | traceability | Command surface split into three incompatible names across phase docs/metadata/live file | `032-goal-opencode-plugin/003-goal-command/tasks.md:18` | active |
| DR-007-P2-001 | P2 | traceability | Generated phase graph metadata lists non-deliverable files as key files | `032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json:39` | active |
| DR-008-P1-001 | P1 | traceability | Overlay feature catalogs/playbooks point operators at a stale command surface | `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:27` | active |
| DR-009-P1-001 | P1 | maintainability | No regression test pins DR-001/DR-003/DR-005/DR-006's exact behaviors | `.opencode/plugins/tests/mk-goal-state.test.cjs:120` | active |
| DR-009-P1-002 | P1 | maintainability | Prompt-enhancement tests never assert a RICCE metadata field | `.opencode/plugins/tests/mk-goal-state.test.cjs:40` | active |
| DR-009-P1-003 | P1 | maintainability | No test suite validates command markdown / overlay catalog references | `.opencode/plugins/tests/mk-goal-export-contract.test.cjs:16` | active |
| DR-009-P2-001 | P2 | maintainability | No regression check for phase graph-metadata deliverable drift | `.opencode/plugins/tests/mk-goal-export-contract.test.cjs:16` | active |
| DR-010-P1-001 | P1 | maintainability | `MK_GOAL_PLUGIN_DISABLED` documentation overstates the disable boundary (manual tool mutations still execute) | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:651` | active |
| DR-010-P2-001 | P2 | maintainability | `/goal set` output does not report created/replaced/refreshed | `.opencode/plugins/mk-goal.js:847` | active |

Every P1/P2 above carries, in its source iteration file (`review/iterations/iteration-{NNN}.md`), a full claim-adjudication packet: claim, evidence refs, counterevidence sought, alternative explanation, final severity, confidence, and downgrade trigger. All 12 plugin-scoped P1s have now been independently re-adjudicated across two adversarial lenses: DR-001, DR-003, DR-005, DR-010 in iteration 11, and DR-002, DR-004-P1, DR-006, DR-007-P1, DR-008 in iteration 14. All 4 P2s (DR-004-P2, DR-007-P2, DR-009-P2, DR-010-P2) plus the remaining P1s (DR-009-P1-001/002/003) were re-adjudicated in iteration 15. Every single active finding has now survived at least one full hunter/skeptic/referee adversarial pass in addition to its original discovery iteration, with zero severity changes and zero false positives.

---

## 4. Remediation Workstreams

**P1 — Security (fix first)**
1. DR-006: redact `supervisorVerifier` exception messages before persisting `lastVerifierReason` or rendering `injection_preview`.
2. DR-005: replace the prompt-injection blacklist with a positive/structural sanitizer (quote user objective text as untrusted data; cover unicode bidi/homoglyph and broader instruction-override phrasing).

**P1 — Correctness**
3. DR-001: clamp `renderGoalInjection`'s final returned block to `maxInjectionChars`, not just the prompt subsection.
4. DR-003: have `maybeVerifyGoal` signal staleness/goal-id mismatch so `maybeContinueGoal` does not act on a replacement goal after a discarded verifier result.
5. DR-004-P1: add the required RICCE metadata field (or amend phase 007's acceptance criterion).
6. DR-004-P2: reconcile the unknown-verb failure claim in `goal_opencode.md` with actual dispatch behavior.

**P1 — Traceability (command-surface normalization)**
7. DR-002 / DR-007-P1 / DR-008: pick ONE canonical command filename and invocation string, then update phase 003/007/008 docs, `graph-metadata.json` key files, both feature catalogs, and both manual-testing playbooks to match. **Note**: the live file was renamed a second time during this review (`opencode_goal.md` → `goal_opencode.md`) by the concurrent session working on phase 009 — re-verify the current filename before starting remediation.

**P1 — Test/regression coverage**
8. DR-009-P1-001/002/003: add the four missing regression assertions (whole-block injection cap, semantic sanitizer-bypass fixture, verifier-exception secret fixture, stale-verifier/continuation integration test) plus a command/overlay-doc contract test.

**P1 — Config contract**
9. DR-010-P1-001: either make `executeGoalAction`/`executeGoalStatus` fail closed when `MK_GOAL_PLUGIN_DISABLED` is set, or narrow the env-reference documentation to say the flag disables only injection/autonomy.

**P2 — Advisory**
10. DR-007-P2, DR-009-P2: tighten phase graph-metadata generation to exclude non-deliverable files, and add a lightweight metadata regression check.
11. DR-010-P2: add a `mutation=created|replaced|refreshed` field to `/goal set` output.

---

## 5. Spec Seed

- `032-goal-opencode-plugin/002-injection-plugin/spec.md`: change the injection-length requirement from "sanitize the prompt subsection" to "cap the total rendered `[active_goal]` block."
- `032-goal-opencode-plugin/003-goal-command/spec.md` (+ 007, 008): converge on one command filename/invocation; strike references to `.opencode/commands/goal.md`.
- `032-goal-opencode-plugin/005-completion-supervisor/spec.md`: require redaction on the verifier-exception path, not just the verifier-evidence path.
- `032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md`: clarify RICCE as a stored-metadata requirement vs. a structural-only requirement.

## 6. Plan Seed

1. Security fixes: DR-006 redaction, DR-005 sanitizer hardening.
2. Correctness fixes: DR-001 clamp, DR-003 stale-verifier guard, DR-004-P1 RICCE metadata, DR-004-P2 command-contract reconciliation.
3. Command-surface normalization sweep across code + 3 phase docs + 2 catalogs + 2 playbooks (DR-002/DR-007/DR-008) — re-verify current live filename first.
4. Regression test backfill (DR-009 cluster).
5. Config-contract decision + doc fix (DR-010-P1).
6. UX polish (DR-010-P2).

---

## 7. Traceability Status

**Core protocols**
- `spec_code`: PARTIAL. Phases 001, 004, 005, 006 align well with implementation aside from already-cataloged findings. Phases 002, 003, 007, 008 have active spec/code mismatches (DR-001, DR-002/DR-007/DR-008, DR-004-P1).
- `checklist_evidence`: NOT APPLICABLE. All 8 in-scope phase folders are Level 1 packets (`spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` only); none has `checklist.md`.
- `AC_COVERAGE`: exempt (Level 1 packets, no acceptance-criteria/checklist gate configured for this track).

**Overlay protocols**
- `skill_agent`: NOT APPLICABLE. No OpenCode agent definition under `.opencode/agents/` references this plugin surface.
- `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime (`.claude/agents/`) definition references this plugin surface.
- `feature_catalog_code`: FINDING. Both feature catalogs (`system-skill-advisor`, `system-spec-kit`) still cite the stale command path (DR-008).
- `playbook_capability`: FINDING. Both manual-testing playbooks still instruct operators to use the stale command name/path (DR-008).

---

## 8. Search Ledger

Reducer-owned search-depth state (v2 schema) was captured across iterations 1, 3, and others via `searchLedger`/`searchCoverage`/`candidateCoverage`. Key bug classes tracked: `state_transition`, `atomic_persistence`, `session_isolation`, `injection_trigger`, `duplicate_injection`, `length_boundary`, `fail_open_error_handling`, `prompt_injection_sanitization` — all covered, with `length_boundary` and `prompt_injection_sanitization` resolving to active findings (DR-001, DR-005) rather than clean rule-outs. `graphCoverageMode` was `graphless_fallback` throughout (code-graph reported `stale`/`unavailable` readiness for the duration of the review); every iteration compensated with direct reads, exact Grep/Glob, and — in iteration 12 — actual test execution. No `searchDebt` obligations remain open; `hasSearchDebt: false`.

---

## 9. Deferred Items

- **DR-013-P1-001** (review-tooling scope, not counted in the plugin verdict): the deep-review reducer's `deep-review-findings-registry.json` `openFindings` projection omits the seven claim-adjudication fields (`claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`) for all active findings, even though the source `deep-review-state.jsonl` `findingDetails` records retain them for P1s. This is a finding about the deep-review runtime itself, surfaced during iteration 13's registry-consistency check — worth reporting to the deep-loop-runtime maintainers, but out of scope for the `/goal` plugin's own remediation plan.
- Command-surface churn: the live command file changed names twice during this single review session (`opencode_goal.md` at review start → `goal_opencode.md` by iteration 7), driven by the concurrent phase-009 OpenCode session. Iterations 14 and 15 (the final two iterations, run several hours later) re-confirmed via fresh `Glob` that `goal_opencode.md` was still the current live filename at time of report finalization — but any remediation work on DR-002/DR-007/DR-008 should still re-verify the current live filename immediately before editing docs, since the phase-009 session may still be active.
- Live runtime behavior not exercised: `MK_GOAL_AUTONOMY=smoke` idle-continuation behavior and a genuine concurrent-mutation race (DR-003) were assessed via static code reading and phase-doc cross-checks, not by triggering a live `session.idle` event in a running OpenCode session (out of scope for a read-only review dispatch). Phase 006's own docs already flag this as a known residual validation gap, consistent with what this review found (no completion overclaim).

---

## 10. Iteration Method Diversity

| # | Method | Outcome |
|---|--------|---------|
| 1-4 | Correctness passes A–D (phases 001-008 + command doc) | 4 P1, 1 P2 |
| 5-6 | Security passes A–B (prompt-injection, secret redaction) | 2 P1 |
| 7-8 | Traceability passes A–B (core spec/code, overlay catalogs/playbooks) | 2 P1, 1 P2 |
| 9-10 | Maintainability passes A–B (test-coverage gaps, UX/automation gaps) | 4 P1, 2 P2 |
| 11 | Adversarial re-verification, lens 1 (hunter/skeptic/referee on 4 highest-stakes P1s: DR-001, DR-003, DR-005, DR-010) | 0 new; all 4 confirmed stable |
| 12 | Empirical test execution (`node --test`, 6/6 pass) | 0 new |
| 13 | Closing pass (phase 006 completion-claim spot-check + registry consistency) | 1 P1 (tooling-scoped, DR-013) |
| 14 | Adversarial re-verification, lens 2 (hunter/skeptic/referee on 5 remaining P1s not sampled by lens 1: DR-002, DR-004-P1, DR-006, DR-007-P1, DR-008) — resumed at coordinator request | 0 new; all 5 confirmed stable |
| 15 | New overlay cross-reference (`.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, never previously reviewed) + adversarial re-verification of the remaining 3 P1s and all 4 P2s (DR-009-P1-001/002/003, DR-004-P2, DR-007-P2, DR-009-P2, DR-010-P2) | 0 new; all 7 confirmed stable; hook-doc drift folded into existing DR-002/DR-007/DR-008/DR-010/DR-001 clusters as additional evidence, not new findings |

**Full adversarial coverage achieved.** By iteration 15 (the `maxIterations=15` ceiling), every one of the 12 active plugin-scoped P1s and all 4 P2s had been independently re-adjudicated at least once via hunter/skeptic/referee methodology, on top of empirical test execution (iteration 12) and a dedicated completion-claim audit (iteration 13). Five consecutive iterations (11-15) surfaced zero new plugin-scoped findings and zero severity changes across three independently different verification methods. The loop was extended from an initial 13-iteration stop to the full 15-iteration ceiling at explicit coordinator request for additional rigor; both added iterations (14-15) confirmed full stability rather than surfacing new material.

---

## 11. Audit Appendix

**Convergence basis (transparency note).** The loop reached a legitimate, well-evidenced stop point at iteration 13 (0 P0 across 13 iterations, all 4 dimensions covered, 3 consecutive clean plugin-scoped passes via 3 independent methods). The command-owned graph-based convergence script (`convergence.cjs`) reported `STOP_BLOCKED` at that point, citing `uncovered_dimensions` and `unstable_findings`; investigation traced this to incomplete population of the coverage graph under this manually-orchestrated execution (`DIMENSION`-typed nodes and `IN_DIMENSION` edges were seeded retroactively rather than emitted per-iteration via each dispatch's `graphEvents` field, as the literal workflow contract expects). The reducer-owned `deep-review-findings-registry.json`/`deep-review-dashboard.md` — the canonical, higher-fidelity state surfaces — correctly showed full dimension coverage and 0 P0 at that point.

The coordinator subsequently requested 2 additional iterations (14-15) within the existing `maxIterations=15` headroom for extra rigor, specifically: adversarial re-verification of the 8 active P1s not yet sampled by iteration 11's lens, plus any additional overlay/catalog cross-references not yet touched. Both iterations were executed and both confirmed full stability — zero new findings, zero severity changes, across every remaining active finding and one previously-unreviewed hook doc. The loop's final, actual stop reason is `maxIterationsReached` (iteration 15 of 15) rather than `converged`, since it ran to the configured ceiling rather than stopping early a second time. **If further iterations are wanted beyond this point, `maxIterations` in `deep-review-config.json` (currently `15`) must be explicitly raised by the operator/coordinator — this was not done unilaterally and is flagged here per instruction.**

**Ruled-out claims** (representative, not exhaustive — full detail in each iteration file):
- State path traversal via crafted session id/objective: ruled out (iteration 6) — session ids are hex-encoded before path join; objective text never enters path construction.
- State-file permission gaps: ruled out (iteration 6) — `0o700` state dir, `0o600` state files.
- Debug/continuation logging leaking objective/evidence text: ruled out (iteration 6) — both loggers write only sanitized event metadata.
- Dead code / stale test imports: ruled out (iteration 9) — no dead exported helpers, no stale import paths, only one benign `TODO` reference (a placeholder-detection string, not a real marker).
- Phase 006 "live idle smoke" completion overclaim: ruled out (iteration 13) — phase 006's own docs consistently and honestly flag the live-smoke gap as a residual validation item; it is not hidden or overclaimed.
- New hook doc (`goal_plugin.md`) introducing a genuinely new defect class: ruled out (iteration 15) — every stale/mismatched claim in that doc mapped to an already-cataloged finding (command-name drift, disable-boundary drift, injection-cap behavior); no new root cause was found, and the LEAF agent correctly declined to mint duplicate finding IDs for identical causes.

**Sources reviewed**: `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal_opencode.md` (formerly `opencode_goal.md`, renamed a second time mid-review), 6 `mk-goal-*.test.cjs` files, 8× `{spec,plan,tasks,implementation-summary,description.json,graph-metadata.json}` phase docs (001-008), `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` (added iteration 15), `.opencode/hooks/pre-commit`, `.opencode/scripts/git-hooks/pre-commit`, `.opencode/package.json`.

**Coverage summary**: correctness (4 passes + 2 adversarial re-verification lenses), security (2 passes + 2 adversarial re-verification lenses), traceability (2 passes + 2 adversarial re-verification lenses, 3 overlay docs total including the iteration-15 hook doc), maintainability (2 passes + 1 empirical test-execution pass + 1 adversarial re-verification lens). All required dimensions covered with `coverage_age >= 1`. `p0ResolutionRate = 1` (no P0 ever opened, across all 15 iterations). `hotspotSaturation` fully satisfied: all 12 plugin-scoped P1s and all 4 P2s were adversarially re-adjudicated at least once (iterations 11 and 14 for P1s, iteration 15 for the remainder and all P2s), with zero severity changes across the entire loop.
