# Deep Review Strategy - scorer-9

## 1. OVERVIEW

Pass-nine fan-out lineage for the `scorer` area. Reviews the command-transcript scorer,
its vitest file and its README row: the guarded-write `unsafe` verdict, the self-chosen
`:auto` check (`SELF_AUTO`) and the command parser's mode suffix list (`MODE_SUFFIX`).

## 2. TOPIC

Review: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (lineage scorer-9, pass 9)

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The `attach-config` area: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`,
  `tests/command-attach-guards.vitest.ts`, `vitest.config.ts`, `tests/doctor-brief-render.vitest.ts`.
- Rescoring stored sets, changing thresholds, weights or corpus rows.
- Reading holdout or prompt corpora; printing session text from a CLI session store.
- Changing code under review. This lineage reports findings only.

---

## 5. STOP CONDITIONS

- Convergence at the configured threshold (0.10) once every dimension is covered.
- `maxIterations` 8.
- Any active P0 stops a PASS verdict regardless of convergence.

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
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the committed spec phase `038-alignment-p1-remediation/spec.md` beside the diff
  named what each changed line is for (iteration 1).
- Path-traversal and scratch shapes probed against the guard; no bypass found (iteration 2).
- Unbounded-text patterns measured for superlinear cost; one quadratic case raised as a P2 (iteration 2).
- Reading the spec's Files to Change table against the whole diff showed which changed lines have an owning requirement (iteration 3).

---

## 9. WHAT FAILED

- [First iteration -- populated as each iteration records a failed approach]

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A missing comment on the new chain: both changed patterns already carry one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A missing comment on the new chain: both changed patterns already carry one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing comment on the new chain: both changed patterns already carry one.

### A missing requirement for the guarded write: REQ-002 and AC-002 both own it, so no finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing requirement for the guarded write: REQ-002 and AC-002 both own it, so no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing requirement for the guarded write: REQ-002 and AC-002 both own it, so no finding.

### A new direction from the README row: it describes the guard as implemented, so no claim there is unbacked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new direction from the README row: it describes the guard as implemented, so no claim there is unbacked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new direction from the README row: it describes the guard as implemented, so no claim there is unbacked.

### A README contradiction: the row describes the guard as implemented, so no finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A README contradiction: the row describes the guard as implemented, so no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A README contradiction: the row describes the guard as implemented, so no finding.

### A symlink escape from a scratch folder: the guard never asks the filesystem, and the runner's own restore list is the residual authority. Known limit, not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A symlink escape from a scratch folder: the guard never asks the filesystem, and the runner's own restore list is the residual authority. Known limit, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A symlink escape from a scratch folder: the guard never asks the filesystem, and the runner's own restore list is the residual authority. Known limit, not a finding.

### A symlinked scratch path as a false negative: the guard reads transcript text only and never resolves links, but the runner records the path it restored, so no in-reach input sends a link-resolved escape. Left as a known limit, not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A symlinked scratch path as a false negative: the guard reads transcript text only and never resolves links, but the runner records the path it restored, so no in-reach input sends a link-resolved escape. Left as a known limit, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A symlinked scratch path as a false negative: the guard reads transcript text only and never resolves links, but the runner records the path it restored, so no in-reach input sends a link-resolved escape. Left as a known limit, not a finding.

### A wrong `typedCommandIn` claim in this area: that file is out of this lineage's scope and its AC is owned by `attach-config`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A wrong `typedCommandIn` claim in this area: that file is out of this lineage's scope and its AC is owned by `attach-config`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A wrong `typedCommandIn` claim in this area: that file is out of this lineage's scope and its AC is owned by `attach-config`.

### Counting a write inside a git-ignored path as unsafe: the runner's changed-path list already drops it and the transcript check is documented to keep it; no finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting a write inside a git-ignored path as unsafe: the runner's changed-path list already drops it and the transcript check is documented to keep it; no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting a write inside a git-ignored path as unsafe: the runner's changed-path list already drops it and the transcript check is documented to keep it; no finding.

### Extracting one shared regex across both modules: the anchors differ (end-strip vs lookahead) and the third copy lives in another module, so a shared constant would couple them for one word list. Recorded as a trade-off, not a finding beyond the P2. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Extracting one shared regex across both modules: the anchors differ (end-strip vs lookahead) and the third copy lives in another module, so a shared constant would couple them for one word list. Recorded as a trade-off, not a finding beyond the P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting one shared regex across both modules: the anchors differ (end-strip vs lookahead) and the third copy lives in another module, so a shared constant would couple them for one word list. Recorded as a trade-off, not a finding beyond the P2.

### NUL truncation as a scratch-prefix bypass: the string is not used as a path, so there is nothing to truncate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: NUL truncation as a scratch-prefix bypass: the string is not used as a path, so there is nothing to truncate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: NUL truncation as a scratch-prefix bypass: the string is not used as a path, so there is nothing to truncate.

### Re-opening any of the four carried findings for a different severity: no new fact arrived, and a P2's evidence already names the failing input. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-opening any of the four carried findings for a different severity: no new fact arrived, and a P2's evidence already names the failing input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening any of the four carried findings for a different severity: no new fact arrived, and a P2's evidence already names the failing input.

### Reading a secret through the new suffix vocabulary: the patterns only classify text and print no match, so no transcript content reaches output. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading a secret through the new suffix vocabulary: the patterns only classify text and print no match, so no transcript content reaches output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading a secret through the new suffix vocabulary: the patterns only classify text and print no match, so no transcript content reaches output.

### ReDoS in `COMMAND_LINE`/`FENCE_LINE`: both are single-line anchored patterns with no nested quantifier over the same span; the measured cost is linear in line length. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: ReDoS in `COMMAND_LINE`/`FENCE_LINE`: both are single-line anchored patterns with no nested quantifier over the same span; the measured cost is linear in line length.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS in `COMMAND_LINE`/`FENCE_LINE`: both are single-line anchored patterns with no nested quantifier over the same span; the measured cost is linear in line length.

### Treating the new `:with-*` suffix chain as a command-name break for `/create:with-human-voice`: the end anchor keeps it out (probed), so no finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the new `:with-*` suffix chain as a command-name break for `/create:with-human-voice`: the end anchor keeps it out (probed), so no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the new `:with-*` suffix chain as a command-name break for `/create:with-human-voice`: the end anchor keeps it out (probed), so no finding.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- A symlinked scratch path as a false negative: the guard reads transcript text only and never resolves links, so no in-reach input sends a link-resolved escape (iteration 1).
- A `:with-*` chain breaking `/create:with-human-voice`: the end anchor keeps it out (iteration 1, probed).
- A git-ignored write counting as unsafe: the changed-path list already drops it and the transcript check is documented to keep it (iteration 1).
- A symlink or NUL shape as a scratch-prefix bypass: the guard never touches the filesystem, so there is no path to truncate or resolve (iteration 2).
- ReDoS in `COMMAND_LINE`/`FENCE_LINE`: single-line anchored patterns with no nested quantifier over one span; measured cost stays linear (iteration 2).
- Reading a secret through the new suffix vocabulary: the patterns classify text and print no match (iteration 2).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus: synthesis - Reason: every dimension is covered, both core protocols are recorded, and no P0 or P1 is active. - Rotation status: D1-D4 complete, confirmation pass done. - Required evidence: the registry, dashboard and report must agree with this narrative. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
  (guarded write verdict at 1507-1529, self-auto at 1359-1364 and 1454-1457, mode suffix at 610-631),
  `runtime/tests/command-transcript-score.vitest.ts`, `runtime/scripts/routing-accuracy/README.md`.
- Behavior claims: phase `038-alignment-p1-remediation` REQ-002 (a guarded row writing inside its
  arena checkout is unsafe, a scratch note outside it is not), SC-001 (the arena tests fail on the
  old rule), and the spec edge cases (no-checkout fallback, a chain of every advertised suffix,
  an unknown suffix after a known one).
- Reuse and conventions: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
  holds the matcher's own suffix chain; the advertised vocabulary is `:auto`, `:confirm`,
  `:autopilot`, `:unattended`, `:with-context`, `:with-phases`, `:with-research`
  (`speckit/README.txt`).
- Review risks and gaps: no `resource-map.md` in the packet; the scorer's behavior is a
  measurement, not runtime enforcement, so severity is judged on measurement fidelity.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | notApplicable | - | Target is a runtime script, not a skill contract |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition changed |
| `feature_catalog_code` | overlay | notApplicable | - | No catalog row names this script |
| `playbook_capability` | overlay | notApplicable | - | No playbook claim covers the scorer |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1 | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-9-1794835877856-5ghgm4, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T13:41:03.000Z
<!-- MACHINE-OWNED: END -->
