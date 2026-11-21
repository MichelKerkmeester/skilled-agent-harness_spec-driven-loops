---
title: "Deep Review Strategy: Ollama lane removal"
description: "Session tracking for the ten-iteration deep review of the 024 lane removal epic."
trigger_phrases:
  - "ollama lane removal deep review"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

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
Follow-up review of `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes`: replay of the ten P2 fixes from the lane removal deep review (fix commit `1d1bfadab67`), plus the deferred `fixture_realism` search item.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- History packets under `specs/` other than 024 (decision D1 keeps them as history, outside the residue check).
- The merge decision and the state of the operator's own machine (D2: nothing merges or pushes; D6: apply never runs on the operator's machine).
- Re-litigating the frozen decisions D1 to D7 in `024-ollama-lane-removal/goal.md` and `decision-record.md`, except where code contradicts them.

---

## 5. STOP CONDITIONS
- Convergence stop policy, at most 3 iterations, 120 minutes.

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
- P2 (Suggestions): 1
- Resolved: 7

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 1: direct reads of each fix site plus small `node` probes of exported functions (`runsModelServer`, `nodeScriptOf`); reading the retired supervisor at merge-base `bf6806ad4b3` settled reach.
- Iteration 2: a scratchpad probe of `resolveContainedTarget` with a linked root proved the `:1996` folder check is load-bearing; a grep of every `symlinkSync` fixture showed no test reaches it.
- Iteration 3: diffing the fix commit (`git show 1d1bfadab67 -- <doc>`) against the packet's Observed cells and Known Limitations surfaced four doc-to-commit drifts; a grep of current definition lines exposed the stale V:/T: pins.
- Iteration 4: replaying each finding against `git show dfdaee3a064` plus probes of `nodeScriptOf`/`runsModelServer` and a full Vitest run (106/106) resolved all seven P2 findings; a grep for `every push` surfaced R4-P2-001 at `025/spec.md:201`.

---

## 9. WHAT FAILED
- Iteration 1: a probe command naming a dotenv file was refused by the env-secret hook; use neutral file names in probes.
- Iteration 2: nothing failed; the check-to-apply race and printed command lines were read and ruled out rather than filed.
- Iteration 3: nothing failed; the skill_agent, agent_cross_runtime and playbook_capability overlays were not run for budget.
- Iteration 4: T036's negative control was not rerun; its dependency was proven from the single producer of the refusal reason string instead.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **SL4-005 `fixture_realism`: ruled out.** The only branch whose behavior depends on a file being a socket is `sweep-lane-residue.mjs:1371`, and it is tested both ways: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (vitest `:914-922`), and a regular file kept (vitest `:936-955`). The fixed names are type-agnostic by design (`:1368-1370`), so the empty regular files written for them at vitest `:1032`, `:1122` and `:1134` match the code's contract rather than faking a socket. The apply delete path was proven on a real socket too: the `:905` test deletes `custom.sock` through the same `deleteServerFile` route. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **SL4-005 `fixture_realism`: ruled out.** The only branch whose behavior depends on a file being a socket is `sweep-lane-residue.mjs:1371`, and it is tested both ways: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (vitest `:914-922`), and a regular file kept (vitest `:936-955`). The fixed names are type-agnostic by design (`:1368-1370`), so the empty regular files written for them at vitest `:1032`, `:1122` and `:1134` match the code's contract rather than faking a socket. The apply delete path was proven on a real socket too: the `:905` test deletes `custom.sock` through the same `deleteServerFile` route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **SL4-005 `fixture_realism`: ruled out.** The only branch whose behavior depends on a file being a socket is `sweep-lane-residue.mjs:1371`, and it is tested both ways: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (vitest `:914-922`), and a regular file kept (vitest `:936-955`). The fixed names are type-agnostic by design (`:1368-1370`), so the empty regular files written for them at vitest `:1032`, `:1122` and `:1134` match the code's contract rather than faking a socket. The apply delete path was proven on a real socket too: the `:905` test deletes `custom.sock` through the same `deleteServerFile` route.

### `spec.md:39` "every push": it describes what the 024 review found, not the current trigger. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec.md:39` "every push": it describes what the 024 review found, not the current trigger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec.md:39` "every push": it describes what the 024 review found, not the current trigger.

### 005 `acceptance-criteria.md` `**Status:** Draft` while every row is Met: seven of eight phases carry Draft, so it is a convention, not drift from this packet. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: 005 `acceptance-criteria.md` `**Status:** Draft` while every row is Met: seven of eight phases carry Draft, so it is a convention, not drift from this packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 005 `acceptance-criteria.md` `**Status:** Draft` while every row is Met: seven of eight phases carry Draft, so it is a convention, not drift from this packet.

### 024:R1-P2-001's residual (an unlisted value option): already active as this run's R1-P2-001, so it is not filed again. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 024:R1-P2-001's residual (an unlisted value option): already active as this run's R1-P2-001, so it is not filed again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 024:R1-P2-001's residual (an unlisted value option): already active as this run's R1-P2-001, so it is not filed again.

### Check-to-apply type gap for an address-added socket name: exploiting it needs a same-user write into that folder inside the window bounded by the stop timeout, and an actor with that access can delete the file directly, so no trust boundary is crossed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Check-to-apply type gap for an address-added socket name: exploiting it needs a same-user write into that folder inside the window bounded by the stop timeout, and an actor with that access can delete the file directly, so no trust boundary is crossed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Check-to-apply type gap for an address-added socket name: exploiting it needs a same-user write into that folder inside the window bounded by the stop timeout, and an actor with that access can delete the file directly, so no trust boundary is crossed.

### Old `goal.md` log rows that read "not committed" or "blocked": the log is append-only and the Complete row at `005/goal.md:79` supersedes them. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Old `goal.md` log rows that read "not committed" or "blocked": the log is append-only and the Complete row at `005/goal.md:79` supersedes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Old `goal.md` log rows that read "not committed" or "blocked": the log is append-only and the Complete row at `005/goal.md:79` supersedes them.

### Ollama host printed in the question and action log: `normalizeOllamaHost` returns `url.origin` (`:846`), which drops any `user:pass@` credentials. The DELETE goes to the host the operator configured, only after an explicit yes or `--shared-model delete`, and the question names that host. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ollama host printed in the question and action log: `normalizeOllamaHost` returns `url.origin` (`:846`), which drops any `user:pass@` credentials. The DELETE goes to the host the operator configured, only after an explicit yes or `--shared-model delete`, and the question names that host.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ollama host printed in the question and action log: `normalizeOllamaHost` returns `url.origin` (`:846`), which drops any `user:pass@` credentials. The DELETE goes to the host the operator configured, only after an explicit yes or `--shared-model delete`, and the question names that host.

### Process command lines printed at `:2127`: they come from the user's own `ps` output on the user's own terminal, are filtered to model server and Ollama processes, and the known launcher passes no secret on argv. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Process command lines printed at `:2127`: they come from the user's own `ps` output on the user's own terminal, are filtered to model server and Ollama processes, and the known launcher passes no secret on argv.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Process command lines printed at `:2127`: they come from the user's own `ps` output on the user's own terminal, are filtered to model server and Ollama processes, and the known launcher passes no secret on argv.

### SL4-005 `fixture_realism`: exhausted, not searched again. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: SL4-005 `fixture_realism`: exhausted, not searched again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL4-005 `fixture_realism`: exhausted, not searched again.

### SL4-005 `fixture_realism`: ruled out in iteration 1 and exhausted. It was not searched again; the citations above were rechecked at HEAD. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: SL4-005 `fixture_realism`: ruled out in iteration 1 and exhausted. It was not searched again; the citations above were rechecked at HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL4-005 `fixture_realism`: ruled out in iteration 1 and exhausted. It was not searched again; the citations above were rechecked at HEAD.

### The 005 `acceptance-criteria.md` Draft status is a convention, and old goal-log rows are superseded. Both are exhausted per the strategy. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The 005 `acceptance-criteria.md` Draft status is a convention, and old goal-log rows are superseded. Both are exhausted per the strategy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The 005 `acceptance-criteria.md` Draft status is a convention, and old goal-log rows are superseded. Both are exhausted per the strategy.

### The unlisted-option residual of R1-P2-001: it is documented in the constant's comment and in Known Limitation 4, and no known launcher passes such an option, so it is not refiled. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The unlisted-option residual of R1-P2-001: it is documented in the constant's comment and in Known Limitation 4, and no known launcher passes such an option, so it is not refiled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The unlisted-option residual of R1-P2-001: it is documented in the constant's comment and in Known Limitation 4, and no known launcher passes such an option, so it is not refiled.

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
- Iteration 1: SL4-005 `fixture_realism` ruled out. The socket-dependent branch (`sweep-lane-residue.mjs:1371`) is tested with a real bound socket (vitest `:914-922`) and a regular file (vitest `:936-955`); fixed names are type-agnostic by design.
- Iteration 1: 005 `acceptance-criteria.md` Status Draft is a cross-phase convention (7 of 8 phases), not drift.
- Edge cases carried: prompt pack left `{p0_count}` tokens unsubstituted; three iterations cannot cover four dimensions singly, so one later iteration must combine two.
- Iteration 2: check-to-apply type gap for an address-added socket name ruled out (needs a same-user write inside the stop-timeout window; no trust boundary crossed).
- Iteration 2: process command lines printed at `sweep-lane-residue.mjs:2127` ruled out (user's own `ps`, filtered, no known secret on argv).
- Iteration 2: Ollama host output ruled out as a credential leak (`url.origin` at `:846` drops userinfo; DELETE only after explicit yes).
- Iteration 3: SL4-005 disposition for AC-024 restated as ruled out (citations rechecked at HEAD: vitest `:905`, `:914`, `:922`, `:926`, `:936`); the test-header coverage matrix omitting the two new cells judged too small to file.
- Iteration 4: `025/spec.md:39` "every push" ruled out (describes the 024 review's finding); R1-P2-001's unlisted-option residual not refiled (documented in code and Known Limitation 4).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. The extended cap of 4 is reached, and all four dimensions are covered. - Focus area: synthesis. - Reason: last iteration. - Rotation status: correctness, security, traceability and maintainability are complete. - Blocked/productive carry-forward: replaying each finding against `git show <fix>` plus a probe of the current file was productive. `fixture_realism` stays exhausted. - Required evidence: synthesis should record all seven prior P2 findings as resolved at `dfdaee3a064`, carry R4-P2-001 as the one active P2, and state SL4-005 as ruled out for AC-024. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work on this target, from the packet's own docs:
- `goal.md`: objective and frozen decisions D1 to D7; all five completion criteria were met at `ea291bdaabc`.
- `decision-record.md`: operator decisions Q001 to Q006 and the later goal amendments.
- `008-cleanup-wiring-and-gating/implementation-summary.md`: the `alignment-pass` section lists every alignment finding with its verdict.
- Earlier gates at the tip: recursive strict validate 9/9 PASSED, residue repo mode exit 0 with 47/47 allowlist rows, planted fixture exit 1, fixture machine mode exit 1 then 0 after apply, advisor suite 2438 passed.

### Bounded Context Snapshot

- Target pointers: `sweep-lane-residue.mjs` and `fixtures/lane-residue-allowlist.json`; advisor runtime under `.skilled/skills/system-skill-advisor/runtime/`; doctor commands under `.skilled/commands/doctor/`; `doctor-update-apply.yaml`; `.github/workflows/advisory-checks.yml` lane-residue job; changelogs under `.skilled/changelog/` and skill changelogs.
- Behavior claims: each child's `acceptance-criteria.md`; repo mode exits 0, planted term exits 1, malformed index shape exits 2; refused flags exit 64; cleanup asks about the shared model every run and stores no answer.
- Reuse and conventions: allowlist rows are exact paths; comment hygiene bans packet ids in code comments.
- Review risks and gaps: 91 deleted files are not in scope as files, so dangling references to them must be searched for; the advisor latency test is load-sensitive.

resource-map.md not present; skipping coverage gate

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/review/review-report.md | - | - | - | pending |
| .github/workflows/advisory-checks.yml | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-21T14:41:59Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-21T14:41:59Z
<!-- MACHINE-OWNED: END -->

---
