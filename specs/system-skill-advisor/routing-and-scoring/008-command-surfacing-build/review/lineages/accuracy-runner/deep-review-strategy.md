# Deep Review Strategy - accuracy-runner Lineage

## 1. REVIEW CHARTER

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder target)
- Fan-out lineage: `accuracy-runner` (artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/accuracy-runner`)
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: legal convergence at `convergenceThreshold=0.10`, or `maxIterations=5`, whichever comes first
- Success criteria: every accuracy-runner scoped file reviewed at least once; findings carry `file:line`; holdout hygiene verified by counts only
- Review focus (operator bound): command-surfacing review of routing-accuracy runners and their corpora; cross-runtime behaviour (claude, codex, opencode, pi, devin, dsh); safety of offering a mutating command; holdout hygiene; docs that disagree with code
- Resource map: `resource-map.md` not present; skipping coverage gate

---

## 2. TOPIC

Command surfacing behavior for the routed skill/command advisor, restricted to the `accuracy-runner` area: the routing-accuracy measurement harness (`runtime/scripts/routing-accuracy/`), prompt corpora and fixtures, cost-measurement benches, transcript scoring, transcript/offer tests, and the legacy fidelity tests plus the manual-testing playbook that documents how to run them.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not reviewing `scorer-attach`, `render-hooks-plugin`, or `doctor-install` area files except as read-only context when a cross-area contract is required
- Not reviewing the spec packet docs as an authorship target; they are traceability context
- Not fixing anything: the review is observation-only
- Not reading or printing holdout prompt text; holdout coverage is counts-only

---

## 5. STOP CONDITIONS

- Legal convergence (all dimensions covered plus stabilization) at or below `convergenceThreshold`
- `maxIterations=5` reached (`stopReason: maxIterationsReached`)
- Any active P0 blocks a PASS verdict but does not stop iteration dispatch by itself; the P0 override keeps `newFindingsRatio >= 0.50`

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
- P2 (Suggestions): 9
- Resolved: 4

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the invariant at both ends (holdout guard in scorer/runner vs. report publication in baseline) surfaced a leak a single-file read would miss (iteration 1).
- Counting corpus splits through `split`/`row_type` tallies instead of prompt text kept the review holdout-safe while still proving composition (iteration 1).
- Checking every renderer head shape against `BRIEF_PATTERN` eliminated a suspected false-negative instead of reporting it (iteration 1).
- Building a per-runtime permission matrix from the six `buildArgv` entries turned "the arena contains it" into a checkable claim and exposed which runtimes have no OS-level bound (iteration 2).
- Comparing the header threat model against `childEnv` caught an overclaim that no single function read would show (iteration 2).
- Re-deriving every numeric floor in `spec.md` from the committed baseline turned traceability into arithmetic instead of a prose comparison, and all four held (iteration 3).
- Checking a playbook's failure-triage symbols against the tree proved that chapter executable rather than assuming it (iteration 3).
- Reading the independent-holdout gate as doctrine, not just as another test, produced the evidence that reclassified a P1 honestly instead of carrying an overstated claim to synthesis (iteration 4).
- Checking how a bench is included (vitest env switch plus tsconfig exclusion) explained why a seven-runtime matrix with two keys survives CI (iteration 4).

---

## 9. WHAT FAILED
- An early suspicion that the README named a non-existent Python file was wrong; the file exists, so the finding was narrowed to the real inventory drift (iteration 1).
- Trying to promote the "no arena assertion" gap to P1 failed the reach test: the documented operator path runs from the arena clone, whose empty remote list satisfies the guard, so it stays P2 hardening (iteration 2).
- A first reading of the runner README's restore sentence looked like a code defect; the code path is deliberate (exit 3, no restore), so the finding was narrowed to the documentation gap (iteration 3).
- A bench typed against the full runtime tuple silently fails for five runtimes because both the type-check and the test glob exclude it by default (iteration 4).
- Re-adjudicating two P1 findings to P2 after reading the independent-holdout gate's own doctrine and the runner's enumerated network claim (iteration 4); both stay active so the merge still sees them.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--auto` on OpenCode as an unconditional finding: the arena plus the no-remote guard is the documented containment model, and auto-approval is required to observe an ask row at all (`:176-178`). Folded into finding 1 as a contributing runtime, not reported separately. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `--auto` on OpenCode as an unconditional finding: the arena plus the no-remote guard is the documented containment model, and auto-approval is required to observe an ask row at all (`:176-178`). Folded into finding 1 as a contributing runtime, not reported separately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--auto` on OpenCode as an unconditional finding: the arena plus the no-remote guard is the documented containment model, and auto-approval is required to observe an ask row at all (`:176-178`). Folded into finding 1 as a contributing runtime, not reported separately.

### `--dry-run` is not side-effect free: it still replays the Claude hook (`run-command-behaviour.mjs:1043-1047`), which spawns a process. Ruled out as a finding because the code comments state the replay explicitly and no documentation claims a dry run spawns nothing; recorded as a behavior note only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `--dry-run` is not side-effect free: it still replays the Claude hook (`run-command-behaviour.mjs:1043-1047`), which spawns a process. Ruled out as a finding because the code comments state the replay explicitly and no documentation claims a dry run spawns nothing; recorded as a behavior note only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--dry-run` is not side-effect free: it still replays the Claude hook (`run-command-behaviour.mjs:1043-1047`), which spawns a process. Ruled out as a finding because the code comments state the replay explicitly and no documentation claims a dry run spawns nothing; recorded as a behavior note only.

### `console.log` in the bench: it mirrors the documented bench log shape (`:109-110`) and creates no defect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `console.log` in the bench: it mirrors the documented bench log shape (`:109-110`) and creates no defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `console.log` in the bench: it mirrors the documented bench log shape (`:109-110`) and creates no defect.

### `measure-embedder-cost.mjs` "starts nothing" wording: the run spawns the advisor CLI to time end-to-end calls, but the claim is about the model server and the run writes no artifact; not a defect worth a finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `measure-embedder-cost.mjs` "starts nothing" wording: the run spawns the advisor CLI to time end-to-end calls, but the claim is about the model server and the run writes no artifact; not a defect worth a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `measure-embedder-cost.mjs` "starts nothing" wording: the run spawns the advisor CLI to time end-to-end calls, but the claim is about the model server and the run writes no artifact; not a defect worth a finding.

### Any remaining unreviewed scope file: the scope list's accuracy-runner files have each been read at least once across iterations 1-5. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Any remaining unreviewed scope file: the scope list's accuracy-runner files have each been read at least once across iterations 1-5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any remaining unreviewed scope file: the scope list's accuracy-runner files have each been read at least once across iterations 1-5.

### Bench "signal" being defined as a non-empty brief: the file is explicitly a signal/noise boundary bench and the definition is documented at `:65-69`; no phantom assertion. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Bench "signal" being defined as a non-empty brief: the file is explicitly a signal/noise boundary bench and the definition is documented at `:65-69`; no phantom assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Bench "signal" being defined as a non-empty brief: the file is explicitly a signal/noise boundary bench and the definition is documented at `:65-69`; no phantom assertion.

### Claude/codex/pi/devin/dsh brief detection false negatives: every renderer head shape and every reader branch was checked against `render.ts:581-638`; no mismatch found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Claude/codex/pi/devin/dsh brief detection false negatives: every renderer head shape and every reader branch was checked against `render.ts:581-638`; no mismatch found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude/codex/pi/devin/dsh brief detection false negatives: every renderer head shape and every reader branch was checked against `render.ts:581-638`; no mismatch found.

### Codex approval gate bypass via `--print-argv`/`--list`: those modes spawn no turn (`:1126-1133`), so the gate is irrelevant there. No finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Codex approval gate bypass via `--print-argv`/`--list`: those modes spawn no turn (`:1126-1133`), so the gate is irrelevant there. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Codex approval gate bypass via `--print-argv`/`--list`: those modes spawn no turn (`:1126-1133`), so the gate is irrelevant there. No finding.

### Corpus path duplication across four files (`measure-brief-cost.mjs:37`, `run-command-behaviour.mjs:66`, `score-command-transcripts.mjs:915`, `capture-command-routing-baseline.mjs:58`): all four resolve the same file and fail loudly on a move, so no silent failure mode exists. Not actionable enough for a finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Corpus path duplication across four files (`measure-brief-cost.mjs:37`, `run-command-behaviour.mjs:66`, `score-command-transcripts.mjs:915`, `capture-command-routing-baseline.mjs:58`): all four resolve the same file and fail loudly on a move, so no silent failure mode exists. Not actionable enough for a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus path duplication across four files (`measure-brief-cost.mjs:37`, `run-command-behaviour.mjs:66`, `score-command-transcripts.mjs:915`, `capture-command-routing-baseline.mjs:58`): all four resolve the same file and fail loudly on a move, so no silent failure mode exists. Not actionable enough for a finding.

### Documentation of the arena precondition: `prepare-behaviour-arena.mjs:36-37` documents the `--source/--dest` invocation, so the missing piece is enforcement (iteration 2), not documentation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Documentation of the arena precondition: `prepare-behaviour-arena.mjs:36-37` documents the `--source/--dest` invocation, so the missing piece is enforcement (iteration 2), not documentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Documentation of the arena precondition: `prepare-behaviour-arena.mjs:36-37` documents the `--source/--dest` invocation, so the missing piece is enforcement (iteration 2), not documentation.

### NC-011 stale triage: ruled out; `MODE_COMMANDS`, `DEPTH_WORDING` and the `command-speckit-save` owner row all exist at the cited locations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: NC-011 stale triage: ruled out; `MODE_COMMANDS`, `DEPTH_WORDING` and the `command-speckit-save` owner row all exist at the cited locations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: NC-011 stale triage: ruled out; `MODE_COMMANDS`, `DEPTH_WORDING` and the `command-speckit-save` owner row all exist at the cited locations.

### Packet floor misstatement: ruled out; all four claimed floors match the committed artifact. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Packet floor misstatement: ruled out; all four claimed floors match the committed artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet floor misstatement: ruled out; all four claimed floors match the committed artifact.

### Prompt leak via argv: corpus prompts are not secret and holdout ids are refused before a prompt reaches argv (`:583-594,724-727`). No finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt leak via argv: corpus prompts are not secret and holdout ids are refused before a prompt reaches argv (`:583-594,724-727`). No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt leak via argv: corpus prompts are not secret and holdout ids are refused before a prompt reaches argv (`:583-594,724-727`). No finding.

### Re-raising the two closed P1 findings at their original severity: rejected because the independent-holdout doctrine and the enumerated GitHub claim are new evidence that the blocking reach bar is not met. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-raising the two closed P1 findings at their original severity: rejected because the independent-holdout doctrine and the enumerated GitHub claim are new evidence that the blocking reach bar is not met.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-raising the two closed P1 findings at their original severity: rejected because the independent-holdout doctrine and the enumerated GitHub claim are new evidence that the blocking reach bar is not met.

### README claim that `unsafe` counts a loop without init: ruled out as drift; `score-command-transcripts.mjs:1205` and `README.md:111` agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: README claim that `unsafe` counts a loop without init: ruled out as drift; `score-command-transcripts.mjs:1205` and `README.md:111` agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: README claim that `unsafe` counts a loop without init: ruled out as drift; `score-command-transcripts.mjs:1205` and `README.md:111` agree.

### Staged-new-file restoration: `restorePath` drops the index entry and deletes the file, covering the case a restore-from-index would miss (`worktree-restore.mjs:61-84`). No finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Staged-new-file restoration: `restorePath` drops the index entry and deletes the file, covering the case a restore-from-index would miss (`worktree-restore.mjs:61-84`). No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Staged-new-file restoration: `restorePath` drops the index entry and deletes the file, covering the case a restore-from-index would miss (`worktree-restore.mjs:61-84`). No finding.

### Untracked-directory collapse in `git status --porcelain`: considered as a restore gap, but the runner refuses a dirty worktree outside the run-log folder before the first live turn (`run-command-behaviour.mjs:994-1000`), so a pre-existing untracked directory cannot silently absorb turn writes in the measured arms. Not promoted without a reachable case. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Untracked-directory collapse in `git status --porcelain`: considered as a restore gap, but the runner refuses a dirty worktree outside the run-log folder before the first live turn (`run-command-behaviour.mjs:994-1000`), so a pre-existing untracked directory cannot silently absorb turn writes in the measured arms. Not promoted without a reachable case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Untracked-directory collapse in `git status --porcelain`: considered as a restore gap, but the runner refuses a dirty worktree outside the run-log folder before the first live turn (`run-command-behaviour.mjs:994-1000`), so a pre-existing untracked directory cannot silently absorb turn writes in the measured arms. Not promoted without a reachable case.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `--dry-run` spawn-free claim: the replay is explicit in code comments and no doc claims otherwise; behavior note only (iteration 1, evidence: `run-command-behaviour.mjs:1043-1047`).
- Staged-new-file restore gap: `restorePath` drops the index entry and deletes the file (iteration 1, evidence: `worktree-restore.mjs:61-84`).
- Untracked-directory collapse as a silent restore gap: the pre-turn dirty guard makes it unreachable in measured arms (iteration 1, evidence: `run-command-behaviour.mjs:994-1000`).
- Brief-detection false negatives across claude/codex/pi/devin/dsh: every head shape matches `BRIEF_PATTERN` (iteration 1, evidence: `render.ts:581-638`).
- OpenCode `--auto` as a standalone finding: required to observe an ask row and covered by the arena model; folded into the environment finding (iteration 2, evidence: `run-command-behaviour.mjs:176-178`).
- Prompt leakage through argv: corpus prompts are not secret and holdout ids are refused before a prompt reaches argv (iteration 2, evidence: `run-command-behaviour.mjs:583-594,724-727`).
- NC-011 stale failure triage: ruled out; `MODE_COMMANDS`, `DEPTH_WORDING` and the `command-speckit-save` owner row exist at the cited locations (iteration 3, evidence: `command-attach.ts:15,306`, `projection.ts:893-900`).
- Packet floor misstatement: ruled out; typed 44/44, plain tune 23/45, false offers 0/35 and holdout 1/44 all meet the recorded floors (iteration 3, evidence: `command-routing-baseline.json`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - Focus area: none; the loop stops at `maxIterations=5` without legal convergence. - Reason: `maxIterations` cap reached; synthesis follows. - Rotation status: D1-D4 complete plus stabilization pass. - Blocked/productive carry-forward: blocked (no live execution evidence for the cross-runtime proof); productive (holdout doctrine and severity re-adjudication). - Required evidence: none for iteration dispatch; synthesis reads the registry and iteration files. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 29 `accuracy-runner` files from `review-scope.txt` (routing-accuracy runners/corpora, cost benches, transcript/offer tests, legacy fidelity tests, manual-testing playbook). Shared docs: `system-skill-advisor/SKILL.md`, `README.md`, `ARCHITECTURE.md`, `runtime/scripts/README.md`, `runtime/tests/README.md`, `feature-catalog/*`, `sk-doc` docs.
- Behavior claims to verify: routed command surfacing must be cross-runtime correct (claude, codex, opencode, pi, devin, dsh); a mutating command must never be offered unsafely (no implicit `:auto` invocation of a writing workflow); holdout rows must never be read by tune/fix/report paths; documentation must match runner behavior.
- Reuse and conventions: append-gateway state recording, `validate.sh --strict` evidence discipline, P0/P1/P2 severity ladder, three-artifact iteration contract.
- Review risks and gaps: holdout prompt text is out of read scope (counts only); fan-out containment forbids running repo tooling that writes outside the lineage, so runners are audited by reading, not by execution; coverage graph seed skipped by containment (see edge cases).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | All four numeric floors re-derived from the committed baseline: typed 44/44, plain tune 23/45, false offers 0/35, holdout 1/44. |
| `checklist_evidence` | core | partial | 3 | Parent packet has no checklist; owning phase 007 closing tasks remain open. |
| `skill_agent` | overlay | notApplicable | 3 | No agent definition owns the accuracy-runner area. |
| `agent_cross_runtime` | overlay | partial | 2 | Six runtime argv tables read; three bypass approvals; end-to-end proof still open in phase 007. |
| `feature_catalog_code` | overlay | pass | 3 | `--real-embedding` refuses `--write` as documented. |
| `playbook_capability` | overlay | pass | 3 | NC-011 executable as written; all triage symbols resolve. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` (12 files) | D1, D2 | 2 | 1 P1, 2 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`, `measure-embedder-cost.mjs` | D1, D2 | 2 | 0 | partial |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl`, `skill-advisor-regression-cases.jsonl` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts`, `command-routing-slice.vitest.ts`, `command-transcript-score.vitest.ts` | D1 (slice) | 1 | 1 P1 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/` (5 files) | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`, `native-cli-tools/hub-command-attachment.md` | D3 | 3 | 0 | partial (chapter verified, root playbook pending maintainability pass) |

<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-1794550137809-1ecgc7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T06:12:20Z
<!-- MACHINE-OWNED: END -->
