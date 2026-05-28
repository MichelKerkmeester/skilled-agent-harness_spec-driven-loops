# Deep Review Report — Session 120 + 121 Work

> Workflow-owned synthesis. Compiled from 10 dual-executor iterations (gpt-5.5 high/fast + MiniMax M2.7) + 1 Opus 4.8 arbiter capstone. Three independent models. Stop reason: converged (convergenceScore 0.94). Synthesized by Opus 4.8.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL** — no release-blocking P0; genuine but non-blocking P1 correctness/security defects remain that warrant fix-before-promote.
- **hasAdvisories: true** (11 active P2).
- **Active findings (post-arbitration): P0 = 0 · P1 = 4 (3 unique after dedup) · P2 = 11.**
- **Scope reviewed:** 29 curated files — the 121/003 model-benchmark build (loop-host.cjs, dispatch-model.cjs, the ported scorer/ tree, mode-field edits, two vitest suites) + the 120 MiniMax skill edits (cli-opencode, sk-prompt, sk-prompt-small-model) + 3 authored design/research/build docs.
- **Headline call:** the "model-benchmark route ships the dispatcher + 5-dim scorer as *available* but does not wire them into the default `run-benchmark` path" finding — raised as P1 by both gpt-5.5 and MiniMax — was **downgraded to P2 by the Opus arbiter** as an intended, spec-documented deferral (003 spec.md §7 + 002 research §10). REQ-003/REQ-004 require the dispatcher/scorer to be *decoupled and available*, which they are; defaulting run-benchmark to them is explicit opt-in follow-on work.

## 2. Planning Trigger

`/speckit:plan` is **recommended** (CONDITIONAL verdict + 3 unique P1 defects) for a remediation packet. Not release-blocking, but the P1s should be fixed before the model-benchmark mode is relied on in anger.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 4, "P1_unique": 3, "P2": 11 },
  "remediationWorkstreams": [
    "WS1: executor cwd propagation (dispatch-model.cjs)",
    "WS2: path-boundary guard (cwd-check.cjs)",
    "WS3: scorer integrity hardening (grader clamp + criteria exec policy)",
    "WS4: P2 follow-ons (wire 5-dim scorer opt-in, dashboard mode, REQ-004 wording, busy-wait, test depth)"
  ],
  "specSeed": "Remediation of 3 unique P1 correctness/security defects in the deep-agent-improvement model-benchmark mode + 11 P2 advisories",
  "planSeed": ["Fix cwd-check prefix boundary", "Forward cwd to all 5 dispatch-model executors", "Clamp grader score to [0,1] + parse-status gate", "Decide trusted-author policy for criteria execSync"],
  "findingClasses": ["correctness/contract-mismatch", "correctness/security-signal-evasion", "security/command-injection-surface", "correctness/integrity"],
  "affectedSurfacesSeed": ["dispatch-model.cjs", "scorer/deterministic/cwd-check.cjs", "scorer/score-model-variant.cjs", "scorer/grader/harness.cjs"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1 — confirmed defects (fix before promote)

| ID | Sev | Title | File:line | Evidence | Fix |
|----|-----|-------|-----------|----------|-----|
| F-P1-1 | P1 | Dispatcher ignores requested cwd for 4 of 5 executors | `dispatch-model.cjs:122,173` | Only `cli-opencode` forwards `--dir`; `cli-claude-code/cli-codex/cli-gemini/cli-devin` never pass `dir`, and `spawnSync` is called with no `cwd` option → those four run in the host process cwd | Add `cwd: dir` to the `spawnSync` opts (one-line fix covering all executors) |
| F-P1-2 | P1 | cwd-check prefix test misclassifies sibling paths | `scorer/deterministic/cwd-check.cjs:86,92` | `resolved.startsWith(fixtureCwdAbs)` → `/repo/proj-evil` matches `/repo/proj`; a traversal/outside path is scored as in-cwd, defeating the D3 guard | Use separator-terminated prefix (`fixtureCwdAbs + path.sep`) + exact-equality |
| F-P1-3 | P1 | Acceptance criteria run arbitrary shell, can escape scorer cwd | `scorer/score-model-variant.cjs:103` | `type:'deterministic'` criteria pass raw `a.command` to `execSync`; criteria are data flowing into a shell (latent — profiles trusted-author today) | Allowlist/validate commands or sandbox; document trusted-author boundary |
| F-P1-4 | P1 | D4 grader accepts unbounded model scores | `scorer/grader/harness.cjs:63` | Model-returned numeric score is not clamped/validated before feeding the weighted total → a model can poison benchmark integrity | Clamp to `[0,1]` + parse-status gate before use |

> F-P1-2 ≡ the merged DR-001-P1-003 / DR-002-P1-003 (both gpt-5.5 and MiniMax independently found it — strong cross-model signal). "4 P1" counts the raw confirmed set; **3 unique defects** after dedup.

### P2 — advisories (11 active)

| ID | Title | File:line | Class |
|----|-------|-----------|-------|
| F-P2-1 | model-benchmark default path doesn't invoke dispatch-model.cjs (intended deferral) | `loop-host.cjs:71-76` | documented-deferral |
| F-P2-2 | HEADLINE: run-benchmark uses pattern matcher, not the ported 5-dim scorer (intended §7 opt-in) | `run-benchmark.cjs:114-178` | documented-deferral |
| F-P2-3 | det-check scripts don't literally accept `--cwd` (decoupling achieved via absolute virtual-fixture cwd) | `cwd-check.cjs:142` | doc/wording-drift |
| F-P2-4 | promote-candidate mode contract (marked RESOLVED in spec; out-of-scope to re-verify) | `promote-candidate.cjs:168` | verify-in-remediation |
| F-P2-5 | reducer/dashboard doesn't surface new `mode` metadata (data persisted, display gap) | `reduce-state.cjs:608` | observability |
| F-P2-6 | grader cache persists raw model output (possible sensitive echo) | `scorer/grader/harness.cjs:219` | security/privacy |
| F-P2-7 | dispute.cjs uses a global `fs` monkey-patch | `scorer/grader/dispute.cjs:71` | maintainability/testability |
| F-P2-8 | scorer tests assert shape, not deterministic scoring behavior | `tests/scorer.vitest.ts:55` | test-depth |
| F-P2-9 | rate-limit backoff is a synchronous busy-wait (burns a core 60-240s) | `dispatch-model.cjs:193` | performance/testability |
| F-P2-10 | `delta` mixes a 0..1 ratio with a raw threshold delta, units unlabeled (NEW, Opus) | `run-benchmark.cjs:283` | maintainability |
| F-P2-11 | (reserved — DR-002-P1-001 dispatcher-dup downgrade, merged into F-P2-1) | — | dedup-artifact |

## 4. Remediation Workstreams

1. **WS1 — Executor cwd propagation (P1, ~1 line + test):** add `cwd: dir` to `dispatch-model.cjs` `spawnSync`; add a test asserting cwd reaches all 5 executor branches.
2. **WS2 — Path-boundary guard (P1, small):** fix `cwd-check.cjs` `startsWith` → separator-bounded + exact-equality; add the `/repo/proj-evil` sibling-prefix regression case.
3. **WS3 — Scorer integrity (P1):** clamp grader score `[0,1]` + parse-status gate (F-P1-4); decide + enforce a trusted-author/allowlist policy for criteria `execSync` (F-P1-3).
4. **WS4 — P2 follow-ons (advisory):** the intended scorer/dispatcher opt-in wiring (F-P2-1/2), dashboard `mode` surfacing (F-P2-5), REQ-004 `--cwd` wording reconcile (F-P2-3), async backoff (F-P2-9), deterministic scorer tests (F-P2-8), grader-cache privacy (F-P2-6), dispute.cjs DI (F-P2-7), delta units (F-P2-10), promote-candidate re-verify (F-P2-4).

## 5. Spec Seed

- Remediation packet scope: 3 unique P1 correctness/security defects in the deep-agent-improvement model-benchmark mode, all in `dispatch-model.cjs` + `scorer/`.
- Reconcile 003 REQ-004 acceptance wording ("det-checks accept `--cwd`") with the shipped absolute-virtual-fixture-cwd decoupling mechanism.

## 6. Plan Seed

- T: `dispatch-model.cjs` — add `cwd: dir` to spawnSync opts; test all 5 executors honor cwd.
- T: `cwd-check.cjs` — separator-bounded prefix + exact-equality; sibling-prefix regression test.
- T: `scorer/grader/harness.cjs` — clamp model score `[0,1]` + parse-status gate.
- T: criteria `execSync` — trusted-author policy decision + guard.
- T (P2): wire `score-model-variant.cjs` as opt-in model-benchmark scorer; surface `mode` in reduce-state dashboard.

## 7. Traceability Status

### Core Protocols
- **spec_code (REQ-001/TST-1):** PASS — TST-1 byte-identity gate asserts default vs `--mode=agent-improvement` produce identical plans + identical unknown-mode fallback (`loop-host.vitest.ts:44-71`).
- **spec_code (REQ-002):** PASS — materialize → run-benchmark → `benchmark-complete` record produced (`loop-host.cjs:71-76` + `run-benchmark.cjs:288-339`).
- **spec_code (REQ-003):** PASS — dispatcher routes via executor map, never loads in agent-improvement mode.
- **spec_code (REQ-004):** PASS with WARN — scorer is decoupled (primitive criteria, absolute-cwd guard, `buildGraderFn`); the literal "det-checks accept `--cwd`" wording diverged from the absolute-virtual-fixture mechanism (doc-drift, F-P2-3).
- **checklist_evidence:** N/A — Level 1 packets, no checklist.md required; TST-1 + planning + EC tests present.

### Overlay Protocols
- **skill_agent (120 edits):** reviewed (iter 6 MiniMax pass degraded); MiniMax slug/context-length/variant guidance internally consistent per the valid passes. No P1 raised against the 120 skill edits.

## 8. Deferred Items

- F-P2-1, F-P2-2 (dispatcher + 5-dim scorer opt-in wiring) — explicitly deferred in 003 spec §7; adopt when a benchmark run needs fresh model generation + rubric scoring rather than fixture pattern-matching.
- F-P2-4 (promote-candidate.cjs:168) — re-verify in the remediation packet's scope (was out-of-scope for the arbiter's 29-file window).

## 9. Search Ledger

- **searchCoverage:** correctness, security, traceability, maintainability all covered by ≥1 valid pass; correctness + the 4 confirmed P1s cross-checked by ≥2 models.
- **ruledOutCandidates:** unknown-mode fallback regression (ruled out by `resolveMode()` + TST-1); EC-5 materialize-before-benchmark ordering (ruled out by planInvocation order + test); hard-gate weighted-score arithmetic (no defect in `applyHardGate()` + rubric summation).
- **searchDebt:** `promote-candidate.cjs` + `reduce-state.cjs` were outside the 29-file curated scope; their findings (F-P2-4, F-P2-5) carry a verify-in-remediation flag. hasSearchDebt: true → contributes to the CONDITIONAL gate.

## 10. Audit Appendix

### Convergence summary
- Iterations: 10 loop (gpt-5.5 ×5 valid, MiniMax ×2 fully valid + ×2 degraded-empty + ×1 missing) + 1 Opus 4.8 arbiter. convergenceScore 0.94. newFindingsRatio fell to 0.06 at the arbiter pass.

### Cross-model signal
- **gpt-5.5 (high/fast):** 5/5 valid passes; produced the full v2 review contract every time; surfaced most P1s.
- **MiniMax M2.7:** 2/5 fully valid (iters 4, 10), 2/5 degraded (missing `findingDetails`), 1/5 missing — **struggles with the richer deep-review v2 structured-output contract** (a real reliability finding; consistent with the 5/7 contract-hold rate seen in 121/002 deep-research, degrading further under the heavier review schema). Independently corroborated F-P1-2 (cross-model agreement).
- **Opus 4.8 (arbiter):** confirmed 5 P1, downgraded 6 P1→P2 with spec evidence, 0 false-positives, +1 new P2. Decided the headline finding as an intended deferral.

### Cross-reference appendix
- **Core:** spec_code PASS (REQ-001/002/003), PASS-with-WARN (REQ-004 wording); checklist_evidence N/A.
- **Overlay:** skill_agent reviewed, no P1.
