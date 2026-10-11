# Deep Review Strategy - Routing Parity CI

Tracks review progress across iterations for this session.

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
Commit f34b01bf0a on worktrees/115-rem-routing-parity-ci: the local-vs-native divergence ratchet (fresh skill-graph index, pinned scoring clock, regime header), the widened holdout independence check (declared scoring surfaces and allowed-overlap map), and the two new blocking steps in the golden-prompt-gate CI job

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The scorer, its lane weights, the release floors and the approved-divergence ledger entries: the packet freezes them (goal D1).
- Routing accuracy itself; the review checks the gates, not the routes they protect.
- The other three open-ends remediation phases, which run in their own worktrees.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 5 iterations; convergence is telemetry only.

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
- P1 (Required): 1
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Static producer/consumer tracing across the ledger pipeline: reading the capture script, the ratchet replay and the projection's module-load env capture together exposed a regime mismatch no single file shows (iteration 1).
- Replaying the holdout scan's exact extension, skip-directory and regex rules with rg over the live tree: confirmed the new gate is green on the current tree and complete against it (iteration 1).
- Pinning the semantics of the new clock against the scorer's age haircut and the Python scorer's time-invariance: established that the one-sided JavaScript pin is sound for the current implementation (iteration 1).
- Executing the goal's own completion criteria verbatim as the traceability probe: turned "checklist evidence deferred" into an executed pass/fail and exposed the missing skill bump/changelog deterministically (iteration 3).
- Replaying the derived clock against the fixture's 14 approval dates and against the sibling baseline ratchet's `capturedAt` pin separated the still-open capture-side regime gap from the new fixture-growth coupling (iteration 4).
- Reimplementing the widened gate's family/overlap logic in python3 over the live tree: confirmed the new blocking step is green as committed (0 undeclared, 0 stale, 0 labeled collisions) and verified each cross-corpus reason claim (iteration 5).
- Checking the capture script's `capturedAt` slice against the ratchet's `approvedAt` pin template: eliminated the format-mismatch hypothesis with fixture statistics before it could become a false positive (iteration 5).

---

## 9. WHAT FAILED
- Executing the two rewritten vitest gates: the dispatch is read-only, so pass/fail is asserted from code reading; SC-002 remains execution-unverified (iteration 1).
- Deferring checklist evidence twice as "packet completion validation": the deterministic REQ-005/D5 gap stayed unrecorded until the traceability pass ran the goal's own checks (iteration 3).
- The two rewritten vitest gates remain unexecuted in this read-only dispatch; the final correctness pass rests on code reads plus a faithful python3 replay of the declaration tests, so SC-002 stays execution-unverified (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `implementation-summary.md` holds none of the 9 ledger rows and no Tests table; `tasks.md` is the generic scaffold; the goal's three grep-based criteria return failing values. Registered as finding R3-P2-001; expected backfill slot is packet closure. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `implementation-summary.md` holds none of the 9 ledger rows and no Tests table; `tasks.md` is the generic scaffold; the goal's three grep-based criteria return failing values. Registered as finding R3-P2-001; expected backfill slot is packet closure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `implementation-summary.md` holds none of the 9 ledger rows and no Tests table; `tasks.md` is the generic scaffold; the goal's three grep-based criteria return failing values. Registered as finding R3-P2-001; expected backfill slot is packet closure.

### `manual-testing-playbook.md` contains no parity-gate capability entry to update (grep over ratchet/divergence/golden-prompt/parity gate/holdout: no hits); same scope rationale as the catalog. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `manual-testing-playbook.md` contains no parity-gate capability entry to update (grep over ratchet/divergence/golden-prompt/parity gate/holdout: no hits); same scope rationale as the catalog.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `manual-testing-playbook.md` contains no parity-gate capability entry to update (grep over ratchet/divergence/golden-prompt/parity gate/holdout: no hits); same scope rationale as the catalog.

### `SKILL.md` makes no contract claim about these internal CI gates, and the spec's frozen Files to Change admit no SKILL.md body edit; the only SKILL.md obligation is the REQ-005 version line, covered by R3-P1-001. Checked by grep over `SKILL.md` ("divergence ratchet", "holdout-independent", "golden-prompt-gate": no hits). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `SKILL.md` makes no contract claim about these internal CI gates, and the spec's frozen Files to Change admit no SKILL.md body edit; the only SKILL.md obligation is the REQ-005 version line, covered by R3-P1-001. Checked by grep over `SKILL.md` ("divergence ratchet", "holdout-independent", "golden-prompt-gate": no hits).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SKILL.md` makes no contract claim about these internal CI gates, and the spec's frozen Files to Change admit no SKILL.md body edit; the only SKILL.md obligation is the REQ-005 version line, covered by R3-P1-001. Checked by grep over `SKILL.md` ("divergence ratchet", "holdout-independent", "golden-prompt-gate": no hits).

### agent_cross_runtime: notApplicable — carried from iteration 3; no agent definition references the changed paths. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: agent_cross_runtime: notApplicable — carried from iteration 3; no agent definition references the changed paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: notApplicable — carried from iteration 3; no agent definition references the changed paths.

### checklist_evidence: fail, carried from iteration 3 and unchanged: `implementation-summary.md` is still the template with no ledger rows and no Tests table, and nothing in this iteration's commit touched it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checklist_evidence: fail, carried from iteration 3 and unchanged: `implementation-summary.md` is still the template with no ledger rows and no Tests table, and nothing in this iteration's commit touched it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail, carried from iteration 3 and unchanged: `implementation-summary.md` is still the template with no ledger rows and no Tests table, and nothing in this iteration's commit touched it.

### checklist_evidence: fail, carried from iterations 3-4 and unchanged: implementation-summary.md is still the template with no ledger rows and no Tests table, so SC-001 and REQ-002/003/004 have no recorded evidence (R3-P2-001). The commit touches none of it (git show --stat f34b01bf0a: three files). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence: fail, carried from iterations 3-4 and unchanged: implementation-summary.md is still the template with no ledger rows and no Tests table, so SC-001 and REQ-002/003/004 have no recorded evidence (R3-P2-001). The commit touches none of it (git show --stat f34b01bf0a: three files).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail, carried from iterations 3-4 and unchanged: implementation-summary.md is still the template with no ledger rows and no Tests table, so SC-001 and REQ-002/003/004 have no recorded evidence (R3-P2-001). The commit touches none of it (git show --stat f34b01bf0a: three files).

### Commit scope drift (extra or missing files vs spec.md:80–82): ruled out by `--name-status`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Commit scope drift (extra or missing files vs spec.md:80–82): ruled out by `--name-status`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Commit scope drift (extra or missing files vs spec.md:80–82): ruled out by `--name-status`.

### Cross-runtime agent reference drift: ruled out — no references to the changed paths in any agent directory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Cross-runtime agent reference drift: ruled out — no references to the changed paths in any agent directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-runtime agent reference drift: ruled out — no references to the changed paths in any agent directory.

### Doc/code divergence in SKILL.md, feature catalog or playbook: ruled out — none of the three documents makes a claim about the two gates, and the spec freezes the file set. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Doc/code divergence in SKILL.md, feature catalog or playbook: ruled out — none of the three documents makes a claim about the two gates, and the spec freezes the file set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doc/code divergence in SKILL.md, feature catalog or playbook: ruled out — none of the three documents makes a claim about the two gates, and the spec freezes the file set.

### feature_catalog_code: notApplicable — the catalog's only related claim (the holdout top-1 percentage) is untouched; no floor changed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: feature_catalog_code: notApplicable — the catalog's only related claim (the holdout top-1 percentage) is untouched; no floor changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: notApplicable — the catalog's only related claim (the holdout top-1 percentage) is untouched; no floor changed.

### Gap: REQ-005 (skill bump/changelog) has no matching change — finding R3-P1-001. Status: partial. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Gap: REQ-005 (skill bump/changelog) has no matching change — finding R3-P1-001. Status: partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gap: REQ-005 (skill bump/changelog) has no matching change — finding R3-P1-001. Status: partial.

### No agent definition under `.pi/agents`, `.opencode/agents`, `.claude/agents`, `.codex/agents` references the changed test files or the workflow job; nothing pins expectations the change could break. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No agent definition under `.pi/agents`, `.opencode/agents`, `.claude/agents`, `.codex/agents` references the changed test files or the workflow job; nothing pins expectations the change could break.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No agent definition under `.pi/agents`, `.opencode/agents`, `.claude/agents`, `.codex/agents` references the changed test files or the workflow job; nothing pins expectations the change could break.

### playbook_capability: notApplicable — no parity-gate capability entry exists to update. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: playbook_capability: notApplicable — no parity-gate capability entry exists to update.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: notApplicable — no parity-gate capability entry exists to update.

### R1 (blocking step, outside warn-only admission): the two steps are blocking `run:` steps in the `golden-prompt-gate` job [SOURCE: .github/workflows/routing-registry-drift.yml:278] [SOURCE: .github/workflows/routing-registry-drift.yml:289]; no `continue-on-error` in the file; `working-directory: .opencode/skills/system-skill-advisor/runtime` resolves through the tracked `.opencode/skills → ../.skilled/skills` symlink and matches the existing baseline-ratchet step's convention. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: R1 (blocking step, outside warn-only admission): the two steps are blocking `run:` steps in the `golden-prompt-gate` job [SOURCE: .github/workflows/routing-registry-drift.yml:278] [SOURCE: .github/workflows/routing-registry-drift.yml:289]; no `continue-on-error` in the file; `working-directory: .opencode/skills/system-skill-advisor/runtime` resolves through the tracked `.opencode/skills → ../.skilled/skills` symlink and matches the existing baseline-ratchet step's convention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R1 (blocking step, outside warn-only admission): the two steps are blocking `run:` steps in the `golden-prompt-gate` job [SOURCE: .github/workflows/routing-registry-drift.yml:278] [SOURCE: .github/workflows/routing-registry-drift.yml:289]; no `continue-on-error` in the file; `working-directory: .opencode/skills/system-skill-advisor/runtime` resolves through the tracked `.opencode/skills → ../.skilled/skills` symlink and matches the existing baseline-ratchet step's convention.

### R3 (pinned clock): `ledgerScoringInstant`/`vi.setSystemTime` in the ratchet plus a self-check test that the clock equals the pinned instant (ratchet diff at new lines ~219–341). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: R3 (pinned clock): `ledgerScoringInstant`/`vi.setSystemTime` in the ratchet plus a self-check test that the clock equals the pinned instant (ratchet diff at new lines ~219–341).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R3 (pinned clock): `ledgerScoringInstant`/`vi.setSystemTime` in the ratchet plus a self-check test that the clock equals the pinned instant (ratchet diff at new lines ~219–341).

### R5 (every scoring surface + allowed-overlap map): `SCORING_SURFACES` with per-surface `allowedOverlap` and reasons, a stale-declaration test, and the undeclared-corpus reader scan in `holdout-independent.vitest.ts` (new lines ~50–201, ~303–360). The spec's worked example (holdout-harder may overlap the lane-weight sweep and the divergence ratchet) is declared in both surfaces. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: R5 (every scoring surface + allowed-overlap map): `SCORING_SURFACES` with per-surface `allowedOverlap` and reasons, a stale-declaration test, and the undeclared-corpus reader scan in `holdout-independent.vitest.ts` (new lines ~50–201, ~303–360). The spec's worked example (holdout-harder may overlap the lane-weight sweep and the divergence ratchet) is declared in both surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R5 (every scoring surface + allowed-overlap map): `SCORING_SURFACES` with per-surface `allowedOverlap` and reasons, a stale-declaration test, and the undeclared-corpus reader scan in `holdout-independent.vitest.ts` (new lines ~50–201, ~303–360). The spec's worked example (holdout-harder may overlap the lane-weight sweep and the divergence ratchet) is declared in both surfaces.

### R8 (regime header): the header addition states harness-regime parity, not live-daemon parity (ratchet diff, new lines 14–21). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: R8 (regime header): the header addition states harness-regime parity, not live-daemon parity (ratchet diff, new lines 14–21).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R8 (regime header): the header addition states harness-regime parity, not live-daemon parity (ratchet diff, new lines 14–21).

### skill_agent: notApplicable — no SKILL.md contract about these internal gates; the only obligation is the REQ-005 version line (R3-P1-001). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: skill_agent: notApplicable — no SKILL.md contract about these internal gates; the only obligation is the REQ-005 version line (R3-P1-001).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: notApplicable — no SKILL.md contract about these internal gates; the only obligation is the REQ-005 version line (R3-P1-001).

### spec_code: pass for this dimension. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82], and R3/R5/R8 remain implemented as iteration 3 recorded. New findings map to the changed code, not to untouched packet docs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code: pass for this dimension. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82], and R3/R5/R8 remain implemented as iteration 3 recorded. New findings map to the changed code, not to untouched packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: pass for this dimension. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82], and R3/R5/R8 remain implemented as iteration 3 recorded. New findings map to the changed code, not to untouched packet docs.

### spec_code: pass. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; R1, R3, R5 and R8 remain implemented as iterations 1-3 recorded. REQ-005 has no matching change (R3-P1-001). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: pass. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; R1, R3, R5 and R8 remain implemented as iterations 1-3 recorded. REQ-005 has no matching change (R3-P1-001).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: pass. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; R1, R3, R5 and R8 remain implemented as iterations 1-3 recorded. REQ-005 has no matching change (R3-P1-001).

### Stale spec evidence pointers: the spec's pre-change line citations (`ratchet:5/31/200`, `holdout:92/108`, `workflow:268`) were probed at HEAD; they land in the same regions they named (header, imports, surface declarations) because the change appends rather than thins those regions. Research-time pointers, not content claims — no reader is misled. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Stale spec evidence pointers: the spec's pre-change line citations (`ratchet:5/31/200`, `holdout:92/108`, `workflow:268`) were probed at HEAD; they land in the same regions they named (header, imports, surface declarations) because the change appends rather than thins those regions. Research-time pointers, not content claims — no reader is misled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale spec evidence pointers: the spec's pre-change line citations (`ratchet:5/31/200`, `holdout:92/108`, `workflow:268`) were probed at HEAD; they land in the same regions they named (header, imports, surface declarations) because the change appends rather than thins those regions. Research-time pointers, not content claims — no reader is misled.

### The commit modifies exactly the three files the spec's Files to Change names [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; `git show f34b01bf0a --name-status` lists only the workflow and the two vitest files. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The commit modifies exactly the three files the spec's Files to Change names [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; `git show f34b01bf0a --name-status` lists only the workflow and the two vitest files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The commit modifies exactly the three files the spec's Files to Change names [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; `git show f34b01bf0a --name-status` lists only the workflow and the two vitest files.

### The skill's `feature-catalog.md` touches the holdout only via "Holdout top-1 accuracy | 77.5%" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39], and the commit changes no baseline/floor, so no catalog claim goes stale. Catalog truth for this phase is owned by phase 003-doc-and-catalog-truth and is outside the frozen Files to Change. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The skill's `feature-catalog.md` touches the holdout only via "Holdout top-1 accuracy | 77.5%" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39], and the commit changes no baseline/floor, so no catalog claim goes stale. Catalog truth for this phase is owned by phase 003-doc-and-catalog-truth and is outside the frozen Files to Change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The skill's `feature-catalog.md` touches the holdout only via "Holdout top-1 accuracy | 77.5%" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39], and the commit changes no baseline/floor, so no catalog claim goes stale. Catalog truth for this phase is owned by phase 003-doc-and-catalog-truth and is outside the frozen Files to Change.

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
- Commit scope drift vs spec.md:80-82: ruled out by `git show --name-status`; exactly the three Files to Change (iteration 3, evidence: commit f34b01bf0a).
- Doc-code divergence in SKILL.md / feature-catalog / manual-testing-playbook: no document claims anything about the two parity gates; the Files to Change freeze excludes doc edits; phase 003 owns catalog truth (iteration 3, evidence: rg + spec.md:80-82).
- Cross-runtime agent reference drift: no agent definition under .pi/.opencode/.claude/.codex references the changed paths (iteration 3, evidence: rg over four agent dirs).
- Stale spec evidence pointers (ratchet:5/31/200, holdout:92/108, workflow:268): pre-change citations probed at HEAD land in the same named regions; the change appends (iteration 3, evidence: sed probes).
- Fresh-graph regime self-verification: the wiring is sound but unasserted; registered as R4-P2-001 rather than re-litigating the iteration-1 cleared capture-order direction (iteration 4).
- Holdout temp-dir leak: pre-existing, OS-temp scoped, no user impact (iteration 4, evidence: no rmSync/afterAll in holdout-independent.vitest.ts).
- Duplicated env-freeze/temp-db setup across parity tests: established per-file pattern; extraction would edit frozen test files (iteration 4, evidence: holdout and baseline-ratchet freeze helpers).
- Full-tree corpus scan cost (314 source files, reads only) and comment hygiene in the new comments: no finding (iteration 4).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Source research: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/research.md (R1, R3, R5, R8 built; R2, R4, R6, R7, R9 closed).
- Found during the build: the ratchet passed only where a daemon had built skill-graph.sqlite; on a clean runner it failed 2 of 6. lib/scorer/projection.ts reads SYSTEM_SKILL_ADVISOR_DB_DIR once at module load, so the native scorer is imported only after the temporary graph directory is set.
- The derived lane decays by age (lib/lifecycle/age-haircut.ts); at 2027-01-01 the unpinned ratchet flipped rr-iter3-166.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Commit matches the three Files to Change and implements R1/R3/R5/R8; REQ-005 skill bump/changelog missing (R3-P1-001). |
| `checklist_evidence` | core | fail | 3 | implementation-summary.md still the v2.2 template: no ledger rows, no Tests table; goal completion greps fail at HEAD (R3-P2-001). |
| `skill_agent` | overlay | notApplicable | 3 | SKILL.md carries no contract about these internal gates; only the REQ-005 version line is owed (R3-P1-001). |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No agent definition across .pi/.opencode/.claude/.codex references the changed files. |
| `feature_catalog_code` | overlay | notApplicable | 3 | Catalog's only related claim (holdout top-1 77.5%) stays consistent; catalog updates are phase 003's scope. |
| `playbook_capability` | overlay | notApplicable | 3 | No parity-gate capability entry to update; same frozen-scope rationale. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.github/workflows/routing-registry-drift.yml` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | correctness | 1 | 2 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs` | correctness | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | correctness | 1 | 1 | reviewed |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md` | correctness | 1 | 0 | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-021-004-routing-parity-20261011T193333Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-11T19:34:08Z
- Stop policy: max-iterations
<!-- MACHINE-OWNED: END -->
