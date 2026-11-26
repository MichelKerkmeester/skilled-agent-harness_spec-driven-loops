---
title: "Deep Review Strategy: 016 epic, generation 2"
description: "Live strategy for the second five-pass review of the whole 016 pi-context-decisions epic."
trigger_phrases:
  - "016 epic review strategy"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - 016 Epic, Generation 2

Live strategy for the second five-pass review of the whole 016 epic.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review of the whole 016 pi-context-decisions epic, phases 001 to 027, as the code stands at HEAD `ea73ab54056`. Target type: spec-folder. Focus: Review the code and docs the whole epic shipped across phases 001 to 027 as they stand at HEAD: pasted-reply stripping, crash fallback, route receipts, the Ollama and embedding lane removal and its residue tool, the doctor cleanup, and the third-round fixes (bridge env parity, deep-loop offer gate, exclusion reload). Judge from code and tests; treat packet evidence and verdict tables as claims to check, not facts.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not a re-review of the Nov 19 run's findings as such; that run is archived under `review-archive/2026-11-23T05-50-33Z/`.
- Not the cut or research-only items in the epic spec (R1, R4, R6, R7, R8, N5, N6, N7).
- Not code outside the files the epic touched, except where a finding needs a caller or callee read.
- No fixes: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 5 iterations run; convergence is telemetry only.
- Halt on a P0 that needs operator attention before more passes.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading code paths end to end then running the targeted vitest and pytest suites over the shared fixtures gave proof beyond the packet tables (iteration 1)
- Comparing each spawn site against its sibling (CLI fallback vs subprocess.ts) exposed the one missing guard; exact-key allowlist diff plus the drift test settled env parity (iteration 2)
- Rerunning each AC row's own grep or test command verbatim at HEAD, plus a status grep over every child spec.md, surfaced drift that strict validation passes (iteration 3)
- Loading the TS gate under Node type stripping beside the Python module and running both on off-fixture prompts gave a direct parity check and exposed shared defects (iteration 4)
- Rerunning each carried finding's grep, read or probe at HEAD confirmed all six P2s. A verbatim-slice fuzz of the strip (14,013 probes) found 0 TS/Python diffs (iteration 5)

---

## 9. WHAT FAILED
- Nothing failed; budget left bridge env parity, crash fallback, residue tool and doctor cleanup unread (iteration 1)
- Nothing failed; doctor cleanup YAML wiring left for traceability (iteration 2)
- Strict validation as a status oracle: it passed child 007 with a stale Planned status (iteration 3)
- Nothing failed; the pasted-reply strip mirror was left unprobed for budget (iteration 4)
- Importing `prompt-policy.ts` under type stripping fails (`shared/unicode-normalization.js` unresolved, no dist build), so the strip ran as a source slice. The call-site parity check was not run (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Env leak of unrelated secrets to the daemon or bridge child: ruled out, exact-key allowlists with no prefix match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Env leak of unrelated secrets to the daemon or bridge child: ruled out, exact-key allowlists with no prefix match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Env leak of unrelated secrets to the daemon or bridge child: ruled out, exact-key allowlists with no prefix match.

### Ephemeral ids in code comments of the epic's files: none found. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ephemeral ids in code comments of the epic's files: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ephemeral ids in code comments of the epic's files: none found.

### Lane weights left unnormalized after the semantic lane removal: no sum-to-one contract exists, and the catalog states the values. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Lane weights left unnormalized after the semantic lane removal: no sum-to-one contract exists, and the catalog states the values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lane weights left unnormalized after the semantic lane removal: no sum-to-one contract exists, and the catalog states the values.

### Live Ollama or embedding lane code left in the advisor after phase 024: ruled out by grep; only an env-prefix scrub entry remains. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Live Ollama or embedding lane code left in the advisor after phase 024: ruled out by grep; only an env-prefix scrub entry remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live Ollama or embedding lane code left in the advisor after phase 024: ruled out by grep; only an env-prefix scrub entry remains.

### Prompt disclosure through the process table: ruled out, every prompt-carrying spawn uses stdin. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt disclosure through the process table: ruled out, every prompt-carrying spawn uses stdin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt disclosure through the process table: ruled out, every prompt-carrying spawn uses stdin.

### Receipt store permission failure on an existing base dir: the live `$TMPDIR/speckit-advisor` tree is 0700 and owned by the user, and `mkdirSync` creates it 0700. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Receipt store permission failure on an existing base dir: the live `$TMPDIR/speckit-advisor` tree is 0700 and owned by the user, and `mkdirSync` creates it 0700.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Receipt store permission failure on an existing base dir: the live `$TMPDIR/speckit-advisor` tree is 0700 and owned by the user, and `mkdirSync` creates it 0700.

### Residue tool deleting outside its root through a symlink or traversal: ruled out by `resolveContainedTarget`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Residue tool deleting outside its root through a symlink or traversal: ruled out by `resolveContainedTarget`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residue tool deleting outside its root through a symlink or traversal: ruled out by `resolveContainedTarget`.

### Residue tool signalling another checkout's or another user's process: ruled out by the ownership check on the script folder realpath. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Residue tool signalling another checkout's or another user's process: ruled out by the ownership check on the script folder realpath.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residue tool signalling another checkout's or another user's process: ruled out by the ownership check on the script folder realpath.

### Strip non-idempotence between hook and scorer: ruled out, the function loops to a fixed point [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267-273]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Strip non-idempotence between hook and scorer: ruled out, the function loops to a fixed point [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267-273].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Strip non-idempotence between hook and scorer: ruled out, the function loops to a fixed point [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267-273].

### TS/Python offer-gate drift beyond the shared fixture: 32 off-fixture probes agree in both copies. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: TS/Python offer-gate drift beyond the shared fixture: 32 off-fixture probes agree in both copies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: TS/Python offer-gate drift beyond the shared fixture: 32 off-fixture probes agree in both copies.

### TS/Python offer-gate drift: 127 TS tests and 18 Python tests pass over the shared fixtures. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: TS/Python offer-gate drift: 127 TS tests and 18 Python tests pass over the shared fixtures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: TS/Python offer-gate drift: 127 TS tests and 18 Python tests pass over the shared fixtures.

### TS/Python pasted-reply strip drift on off-fixture input: 0 diffs over 14,013 probes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: TS/Python pasted-reply strip drift on off-fixture input: 0 diffs over 14,013 probes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: TS/Python pasted-reply strip drift on off-fixture input: 0 diffs over 14,013 probes.

### Unchecked 003 tasks hiding missing evidence: they are conditional on a ship decision that was not taken. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Unchecked 003 tasks hiding missing evidence: they are conditional on a ship decision that was not taken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unchecked 003 tasks hiding missing evidence: they are conditional on a ship decision that was not taken.

### Unmet or waived AC rows hidden in the seven AC files: none, all 117 read Met. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Unmet or waived AC rows hidden in the seven AC files: none, all 117 read Met.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unmet or waived AC rows hidden in the seven AC files: none, all 117 read Met.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- Strip non-idempotence between hook and scorer: fixed-point loop (iteration 1, evidence: runtime/lib/prompt-policy.ts:267-273)
- TS/Python offer-gate drift: shared fixtures pass in both suites (iteration 1)
- Receipt invalidated by directive delivery: clock moves only on lifecycle advance (iteration 1, evidence: hooks/lib/directive-lifecycle-file-store.ts:75-81)
- Prompt in argv, env leak to daemon/bridge child, residue tool traversal or foreign-process kill (iteration 2)
- Live Ollama/embedding lane code left after phase 024; unmet or waived AC rows in the seven AC files (iteration 3)
- Off-fixture TS/Python gate drift (32 probes agree), unnormalized lane weights after removal, ids in epic code comments (iteration 4)
- Off-fixture TS/Python pasted-reply strip drift (0 diffs over 14,013 probes). The unchecked 003 T009 to T014 rows are conditional on a ship decision that was not taken (iteration 5)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none, the rotation is complete (5 of 5 iterations). - Focus area: synthesis. Six P2s are active and no P0 or P1. - Reason: the iteration cap has been reached, and every carried finding was confirmed at HEAD. - Carry-forward: `checklist_evidence` final partial (AC-006); `feature_catalog_code` partial (R3-P2-002); the strip call-site parity check was not run. - Required evidence: none further for this run. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work on this target, from the epic's spec.md, decision-record.md and child packets:
- Nov 19 five-pass review (native Opus medium) of phases 001 to 013 code: 0 P0, 0 P1, 9 P2; fixed in phase 014.
- Phase 021: Fable 5.2 high verification, 1 P1 and 10 P2, fixed in 022.
- Phase 024 removed the Ollama and embedding lane whole; phase 025 fixed its review P2s; phase 026 aligned the doctor surface.
- Phase 027 fixed a fresh Fable review (rounds one and two) and an Opus high third review (`027-epic-review-fixes/evidence/opus-third-review.md`): bridge env parity, the deep-loop offer gate in TS and Python, exclusion-file reload. Known limitation: "research iterative deepening search algorithms" still ranks the loop hub first.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Target pointers: the 113 files in reviewScopeFiles (epic spec docs plus every existing non-spec file the epic's commits touched); the child packets 001 to 027 under this folder.
- Behavior claims: each child's spec.md requirements and acceptance-criteria.md rows; the parent phase map in spec.md.
- Reuse and conventions: TS scorer under `runtime/lib/scorer/`, Python mirror in `runtime/scripts/skill_advisor.py`, shared fixtures under `runtime/tests/fixtures/`.
- Review risks and gaps: the scope list is derived from commit trailers, so a commit without a `Spec:` trailer is missed; deleted files are out of scope by construction.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md` | none | 0 | 0 | pending |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/decision-record.md` | none | 0 | 0 | pending |
| `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/goal.md` | none | 0 | 0 | pending |
| `.env.example` | none | 0 | 0 | pending |
| `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/bin/launcher-threshold-env.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | none | 0 | 0 | pending |
| `.skilled/changelog/skilled/v4.1.0.0.md` | none | 0 | 0 | pending |
| `.skilled/changelog/skilled/v4.2.0.0.md` | none | 0 | 0 | pending |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.1.0.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/changelog/v1.2.0.0.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-validate.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/executor-delegation.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/leaf-manifest.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/weak-follow-up-route-receipt-guard.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/hub-command-attachment.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/pasted-reply-stripping.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/bench/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon/liveness.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-brief-producer.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-registry-env-override.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/runtime-lane-health.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/SKILL.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-warm-only-no-spawn.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/setup/README.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | none | 0 | 0 | pending |
| `README.md` | none | 0 | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-23T05:51:03.170Z, parentSessionId=2026-11-19T04:18:26.591Z, generation=2, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Stop policy: max-iterations
- Started: 2026-11-23T05:51:03.170Z
<!-- MACHINE-OWNED: END -->
