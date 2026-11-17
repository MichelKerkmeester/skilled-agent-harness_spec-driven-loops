# Deep Review Strategy - Command Surfacing (doctor-install lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for the doctor-install fan-out lineage of the command-surfacing review. Records dimension coverage, findings, exhausted approaches, and next focus.

### Usage

- Init populated review charter, dimensions, and boundaries.
- Per iteration the reviewer updates completed dimensions, running counts, and next focus.

---

## 2. TOPIC

Review of command surfacing in the changed-file set listed by `review-scope.txt`, restricted to the `doctor-install` area plus shared docs that describe it. Focus: behaviour on claude, codex, opencode, pi, devin and dsh; safety of offering a mutating command; holdout hygiene; docs that disagree with code.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not assessing unchanged doctor surfaces outside the declared scope list.
- Not assessing accuracy metrics quality beyond holdout hygiene and doc/code agreement.
- No implementation or fix work; findings only.

---

## 5. STOP CONDITIONS

- Convergence at weighted new-finding ratio below 0.10, or 5 iterations.
- Any confirmed P0 halts the PASS verdict regardless of convergence.

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
- P1 (Required): 2
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the runtime tables against the repository's own runtime hook directories settled the cross-runtime question in one pass: `.opencode/hooks/skill-advisor/` lists exactly the four runtimes `hook-wiring-check.cjs` names, so the apparent omission is correct rather than a gap (iteration 1).
- Tracing the one mutating engine from `writeBackup` through the write loop to `restoreFromBackup` located a recovery gap that a row-by-row reading of the plan output would not show (iteration 1).
- Executing the two hook checks read-only against this checkout confirmed the delivery leg's PASS/DEGRADED mapping without guessing at their exit codes (iteration 2).

---

## 9. WHAT FAILED

- Four changed files carried a claim their own new code did not honour: counts, repair lines and a status mapping (iteration 3).
- Reading each sibling in isolation hid the argument-parsing and marker-matching differences; only the paired read surfaced them (iteration 5).
- Treating every manifest `expect` value as enforced: `expectsAbsent` is read only in the absent branch, so the symlink branch needed a separate read to see the bypass (iteration 1).
- Reading the presentation contracts alone: the runtime list and the approval claims only became checkable once `_routes.yaml`, `symlink-manifest.json` and `doctor-mcp-install.yaml` were read beside them (iteration 2).
- Comparing two readers of one grammar side by side found a divergence that neither file shows alone: the check drops a malformed row the embed keeps (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`/doctor:agents-md` bare invocation can reach a writing target** — ruled out: the `check` route carries `default_target: true` in `_routes.yaml`, matching `agents-md.md:36`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`/doctor:agents-md` bare invocation can reach a writing target** — ruled out: the `check` route carries `default_target: true` in `_routes.yaml`, matching `agents-md.md:36`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`/doctor:agents-md` bare invocation can reach a writing target** — ruled out: the `check` route carries `default_target: true` in `_routes.yaml`, matching `agents-md.md:36`.

### **`/doctor:runtime-mirrors` does not run the approval check** — ruled out: `doctor-runtime-mirrors.yaml:41,150` wires and runs it, so `INSTALL-SKILLED.md:69` names a command that does invoke the check. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`/doctor:runtime-mirrors` does not run the approval check** — ruled out: `doctor-runtime-mirrors.yaml:41,150` wires and runs it, so `INSTALL-SKILLED.md:69` names a command that does invoke the check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`/doctor:runtime-mirrors` does not run the approval check** — ruled out: `doctor-runtime-mirrors.yaml:41,150` wires and runs it, so `INSTALL-SKILLED.md:69` names a command that does invoke the check.

### **`/doctor:setup` accepts a `--tool` value the battery refuses** — ruled out: `git-setup-check.cjs:64` accepts all seven names the workflow lists, dsh included. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`/doctor:setup` accepts a `--tool` value the battery refuses** — ruled out: `git-setup-check.cjs:64` accepts all seven names the workflow lists, dsh included.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`/doctor:setup` accepts a `--tool` value the battery refuses** — ruled out: `git-setup-check.cjs:64` accepts all seven names the workflow lists, dsh included.

### **`agents-md-manifest.test.cjs` is documented but missing** — ruled out: the file exists in `scripts/tests/`, and `tests/fixtures/agents-md/` exists too. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`agents-md-manifest.test.cjs` is documented but missing** — ruled out: the file exists in `scripts/tests/`, and `tests/fixtures/agents-md/` exists too.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`agents-md-manifest.test.cjs` is documented but missing** — ruled out: the file exists in `scripts/tests/`, and `tests/fixtures/agents-md/` exists too.

### **`expect: ["absent"]` is dead for `.codex/AGENTS.md` in every state** — narrowed, not ruled out: a regular identical copy is still a FINDING at `:720-722`; only the symlink branch bypasses the expectation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`expect: ["absent"]` is dead for `.codex/AGENTS.md` in every state** — narrowed, not ruled out: a regular identical copy is still a FINDING at `:720-722`; only the symlink branch bypasses the expectation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`expect: ["absent"]` is dead for `.codex/AGENTS.md` in every state** — narrowed, not ruled out: a regular identical copy is still a FINDING at `:720-722`; only the symlink branch bypasses the expectation.

### **`parseTableRows` and `routerTable` can both be replaced by one helper without behavior change** — not claimed: the embed reader needs line positions for insertion while the check reader does not, so a shared helper must return positions as well as cells. Recorded as a recommendation, not a finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`parseTableRows` and `routerTable` can both be replaced by one helper without behavior change** — not claimed: the embed reader needs line positions for insertion while the check reader does not, so a shared helper must return positions as well as cells. Recorded as a recommendation, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`parseTableRows` and `routerTable` can both be replaced by one helper without behavior change** — not claimed: the embed reader needs line positions for insertion while the check reader does not, so a shared helper must return positions as well as cells. Recorded as a recommendation, not a finding.

### **Codex approval check parses only the nested hook shape** — ruled out: `.codex/hooks.json` wraps its events in `hooks`, and `codex-hook-approval-check.cjs:108` reads that shape; the broader top-level acceptance in `hook-wiring-check.cjs` is a superset, not a disagreement. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Codex approval check parses only the nested hook shape** — ruled out: `.codex/hooks.json` wraps its events in `hooks`, and `codex-hook-approval-check.cjs:108` reads that shape; the broader top-level acceptance in `hook-wiring-check.cjs` is a superset, not a disagreement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Codex approval check parses only the nested hook shape** — ruled out: `.codex/hooks.json` wraps its events in `hooks`, and `codex-hook-approval-check.cjs:108` reads that shape; the broader top-level acceptance in `hook-wiring-check.cjs` is a superset, not a disagreement.

### **Holdout prompts leak through a doctor path** — ruled out: no file under `.skilled/commands/doctor` matches `holdout`, and the doctor commands never read the routing-accuracy corpora. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Holdout prompts leak through a doctor path** — ruled out: no file under `.skilled/commands/doctor` matches `holdout`, and the doctor commands never read the routing-accuracy corpora.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Holdout prompts leak through a doctor path** — ruled out: no file under `.skilled/commands/doctor` matches `holdout`, and the doctor commands never read the routing-accuracy corpora.

### **Holdout text is printed by a scoring error message** — ruled out at the code level: refusal messages carry the row id and reason only (`run-command-behaviour.mjs:589`), not the prompt. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Holdout text is printed by a scoring error message** — ruled out at the code level: refusal messages carry the row id and reason only (`run-command-behaviour.mjs:589`), not the prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Holdout text is printed by a scoring error message** — ruled out at the code level: refusal messages carry the row id and reason only (`run-command-behaviour.mjs:589`), not the prompt.

### **Hook wiring omits opencode/pi/dsh** — ruled out: `.opencode/hooks/skill-advisor/` contains adapter directories for claude, codex, cursor and devin only, so the four-runtime table matches the advisor hook's actual reach in this repository. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Hook wiring omits opencode/pi/dsh** — ruled out: `.opencode/hooks/skill-advisor/` contains adapter directories for claude, codex, cursor and devin only, so the four-runtime table matches the advisor hook's actual reach in this repository.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hook wiring omits opencode/pi/dsh** — ruled out: `.opencode/hooks/skill-advisor/` contains adapter directories for claude, codex, cursor and devin only, so the four-runtime table matches the advisor hook's actual reach in this repository.

### **Install guide claims every writing step asks its own yes** — ruled out: `/doctor:mcp install` carries `approvals: per_mutation` and per-phase approvals, and the other four writing steps each own a plan or approval phase. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Install guide claims every writing step asks its own yes** — ruled out: `/doctor:mcp install` carries `approvals: per_mutation` and per-phase approvals, and the other four writing steps each own a plan or approval phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Install guide claims every writing step asks its own yes** — ruled out: `/doctor:mcp install` carries `approvals: per_mutation` and per-phase approvals, and the other four writing steps each own a plan or approval phase.

### **The backup directory can be chosen by the caller** — ruled out: `backupBase` derives it from the root and `planFor` refuses an existing directory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The backup directory can be chosen by the caller** — ruled out: `backupBase` derives it from the root and `planFor` refuses an existing directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The backup directory can be chosen by the caller** — ruled out: `backupBase` derives it from the root and `planFor` refuses an existing directory.

### **The install guide's step order disagrees with the workflow** — ruled out: both list symlink, agents-md, mcp, git, embedder, setup. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The install guide's step order disagrees with the workflow** — ruled out: both list symlink, agents-md, mcp, git, embedder, setup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The install guide's step order disagrees with the workflow** — ruled out: both list symlink, agents-md, mcp, git, embedder, setup.

### **The two hook checks duplicate a whole implementation** — ruled out: they share only the marker constant's text; one checks presence, the other approval state, and their outputs do not overlap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The two hook checks duplicate a whole implementation** — ruled out: they share only the marker constant's text; one checks presence, the other approval state, and their outputs do not overlap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two hook checks duplicate a whole implementation** — ruled out: they share only the marker constant's text; one checks presence, the other approval state, and their outputs do not overlap.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Hook wiring omits opencode/pi/dsh: ruled out, no advisor hook entry exists for those runtimes in this repository (iteration 1, evidence: `.opencode/hooks/skill-advisor/`).
- Codex approval check reads only the nested hooks shape: ruled out, `.codex/hooks.json` uses the nested shape (iteration 1, evidence: `.codex/hooks.json`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: this is the final iteration under `maxIterations: 5`. Synthesis follows. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `review-scope.txt` `doctor-install` rows (28 files) plus shared docs `INSTALL-SKILLED.md`, `.skilled/agents/orchestrate.md`, and system-skill-advisor SKILL/README/ARCHITECTURE.
- Behavior claims: doctor command surfaces install/setup/agents-md/skill-advisor workflows consistently across six runtimes; mutating offers stay safe; holdout rows are never read by doctor or scoring paths; docs match code.
- Reuse and conventions: existing doctor assets under `.skilled/commands/doctor/assets/`, shared helper scripts under `.skilled/commands/doctor/scripts/`.
- Review risks and gaps: review scope spans four areas; this lineage only owns `doctor-install`; cross-area claims cite shared docs as context evidence only.
- Prior context: no prior review session for this packet (`review/` holds only the fan-out config, scope list, and lineage directories).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | install/setup route mutation classes compared against the route manifest; packet docs deferred |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | notApplicable | - | no skill or agent file in this lineage scope |
| `agent_cross_runtime` | overlay | pass | 2 | hook-wiring ok for claude, codex, cursor, devin; codex approval reports the documented unapproved state |
| `feature_catalog_code` | overlay | partial | 3 | install checklist compared with the route rows; catalog entry not read |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` | correctness | 1 | 0 | complete |
| `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs` | correctness | 1 | 0 | complete |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | correctness | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | correctness | 1 | 0 P0, 1 P1, 1 P2 | partial |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | correctness | 2 | 0 | partial |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | correctness | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | correctness | 2 | 0 | partial |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` | correctness | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/setup.md` | correctness | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | traceability | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | traceability | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/commands/doctor/scripts/README.markdown` | traceability | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `INSTALL-SKILLED.md` | traceability | 3 | 0 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-doctor-install-1794550137809-1ecgc7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T10:15:00.000Z
<!-- MACHINE-OWNED: END -->
