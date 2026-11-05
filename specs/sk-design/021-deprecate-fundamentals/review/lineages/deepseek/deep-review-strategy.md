---
title: Deep Review Strategy - 021-deprecate-fundamentals
description: Externalized review strategy for the deepseek fan-out lineage of the sk-design 021 change set review.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - 021 Deprecate Fundamentals

## 2. TOPIC

Review of `specs/sk-design/021-deprecate-fundamentals`, the phased packet that retires
`sk-design-fundamentals`, moves its screen value guidance into `sk-code-frontend`, and removes
research citations from `sk-design-chart`. The reviewed change set is the worktree state against
baseline `10474a9567`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Reworking the retired guidance itself, beyond checking that no rule was lost.
- Re-running repo gates that write outside this lineage: `validate.sh`, `generate-context.js`,
  `compiled-route-sync`, mirror sync tools, and any git write.
- Judging historical changelog entries, the dated benchmark run report, or style-library site
  descriptions that mention research: the packet explicitly keeps them as records.
- Treating the untracked `specs/` packet or recovery scratch logs as production code.

---

## 5. STOP CONDITIONS

- `stopPolicy` is `max-iterations`: the lineage runs iterations 1 through 5, then synthesizes with
  `stopReason: maxIterationsReached`. Convergence ratios are telemetry only.
- Any confirmed active P0 forces the terminal verdict `FAIL`; a P1 without a P0 yields
  `CONDITIONAL`; P2-only yields `PASS` with advisories.
- A scope or evidence gate failure also blocks PASS and is recorded in the iteration.

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
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the compiled-route decision for exact prompts exposed a route the prose claimed but the
  contract did not produce (iterations 1 and 5).
- `git show 10474a9567:<path>` against the current tree mapped every retired reference heading to
  its new V/H/M item and found the one missing section (iteration 3).
- Comparing every changed-file row against `git status` isolated the single false summary row
  (iteration 2).
- Running the reducer after each gateway append kept the registry, dashboard and strategy in step
  with the five iteration records.

---

## 9. WHAT FAILED

- Treating a documented keyword as reachable. The hub vocabulary listed the phrase; the tie-break
  sent it to a different mode (iteration 1, confirmed in iteration 5).
- Treating the packet's changed-file table as an audit trail before checking it (iteration 2).
- Assuming the consolidated references carried every retired section; one performance technique
  had no successor (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A chart rule that lost its supporting figure.** Ruled out by reading the three rule groups -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A chart rule that lost its supporting figure.** Ruled out by reading the three rule groups
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A chart rule that lost its supporting figure.** Ruled out by reading the three rule groups

### **A fundamentals path in any live doc.** Ruled out in iteration 1; the only hits are records and -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A fundamentals path in any live doc.** Ruled out in iteration 1; the only hits are records and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fundamentals path in any live doc.** Ruled out in iteration 1; the only hits are records and

### **A leaked research path in the chart references.** Ruled out in iteration 2; the remaining -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A leaked research path in the chart references.** Ruled out in iteration 2; the remaining
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A leaked research path in the chart references.** Ruled out in iteration 2; the remaining

### **A leftover live path to the deleted folder.** Ruled out by a repository-wide grep; remaining -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A leftover live path to the deleted folder.** Ruled out by a repository-wide grep; remaining
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A leftover live path to the deleted folder.** Ruled out by a repository-wide grep; remaining

### **A live "four modes" string.** Ruled out by grep over live docs; only changelog and benchmark -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A live "four modes" string.** Ruled out by grep over live docs; only changelog and benchmark
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live "four modes" string.** Ruled out by grep over live docs; only changelog and benchmark

### **A missing changelog or a version that disagrees with its changelog.** Ruled out by `ls` and -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A missing changelog or a version that disagrees with its changelog.** Ruled out by `ls` and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing changelog or a version that disagrees with its changelog.** Ruled out by `ls` and

### **A missing compiler change on the authored copy.** Ruled out by a byte comparison of the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A missing compiler change on the authored copy.** Ruled out by a byte comparison of the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing compiler change on the authored copy.** Ruled out by a byte comparison of the

### **A path-traversal entry in a manifest.** Ruled out by the JSON string scan. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A path-traversal entry in a manifest.** Ruled out by the JSON string scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A path-traversal entry in a manifest.** Ruled out by the JSON string scan.

### **A prompt-injection directive in the reviewed docs.** Ruled out by the directive scan. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A prompt-injection directive in the reviewed docs.** Ruled out by the directive scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt-injection directive in the reviewed docs.** Ruled out by the directive scan.

### **A second active P1 hiding in the load-set or canary findings.** Ruled out: both are coverage -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A second active P1 hiding in the load-set or canary findings.** Ruled out: both are coverage
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second active P1 hiding in the load-set or canary findings.** Ruled out: both are coverage

### **A secret embedded in the moved token file.** Ruled out by scan; the file is HSL values, -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A secret embedded in the moved token file.** Ruled out by scan; the file is HSL values,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A secret embedded in the moved token file.** Ruled out by scan; the file is HSL values,

### **A stale chart citation.** Ruled out in iterations 2 and 3; the remaining "research" hits are -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A stale chart citation.** Ruled out in iterations 2 and 3; the remaining "research" hits are
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale chart citation.** Ruled out in iterations 2 and 3; the remaining "research" hits are

### **A stale default mode in `sk-design`.** Ruled out by `hub-router.json` (`defaultMode: null`) and -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale default mode in `sk-design`.** Ruled out by `hub-router.json` (`defaultMode: null`) and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale default mode in `sk-design`.** Ruled out by `hub-router.json` (`defaultMode: null`) and

### **A wholesale false-files table in every phase.** Ruled out by row-by-row comparison; only one -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A wholesale false-files table in every phase.** Ruled out by row-by-row comparison; only one
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wholesale false-files table in every phase.** Ruled out by row-by-row comparison; only one

### **A wholesale loss of the retired references.** Ruled out by the heading-to-item mapping; eight -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wholesale loss of the retired references.** Ruled out by the heading-to-item mapping; eight
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wholesale loss of the retired references.** Ruled out by the heading-to-item mapping; eight

### **Stale versions across the surfaces.** Ruled out by version greps on all four hubs/modes; the -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Stale versions across the surfaces.** Ruled out by version greps on all four hubs/modes; the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale versions across the surfaces.** Ruled out by version greps on all four hubs/modes; the

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11A. RULED OUT DIRECTIONS

- **Live path to the deleted folder:** repository-wide grep leaves only historical changelogs, the
  dated benchmark report, retrieval fixtures and the untracked packet (iteration 1).
- **Stale default mode:** `hub-router.json` sets `defaultMode: null` and the compiled replay
  defers a no-signal prompt (iteration 1).
- **Wholesale false changed-file table:** one false row across three summaries (iteration 2).
- **Wholesale loss of the retired references:** eight of nine retired references have complete
  successors (iteration 3).
- **Secret, path traversal or prompt injection in the new files:** the three scans are clean
  (iteration 4).
- **A second active P1 in the load-set or canary gaps:** both are coverage mismatches with no
  wrong route beyond R1-P1-001 (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None. The stop policy is `max-iterations` and iteration 5 of 5 is complete. Synthesis compiles the
report with the active registry: P0=0, P1=1, P2=8, verdict CONDITIONAL, stopReason
`maxIterationsReached`.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `specs/sk-design/021-deprecate-fundamentals/spec.md` and its three phase
  children (`001-frontend-upgrade`, `002-retire-fundamentals`, `003-chart-research-cleanup`);
  the worktree diff against `10474a9567`.
- Behavior claims: the sk-design hub registers exactly three modes with no default; no live hub
  file names the deleted folder; the five baseline value prompts and the new value, hierarchy and
  motion prompts reach `sk-code-frontend`; the four chart files keep every rule without a research
  citation; each phase validates under `--strict`.
- Reuse and convention pointers: `.skilled/skills/sk-design/mode-registry.json` and
  `hub-router.json` as the authored routing truth; `.skilled/bin/compiled-route.cjs` as the
  read-only replay front door; `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` as stage two.
- Review risks and gaps: the change set is doc- and routing-heavy, so correctness is mostly
  contradiction and reach analysis; `specs/` is untracked in this worktree; generated metadata can
  drift from its source; compiled manifests are hash-pinned.
- Out of scope: any write outside
  `specs/sk-design/021-deprecate-fundamentals/review/lineages/deepseek`.

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
| [scope files in deep-review-config.json] | [D1, D3] | [N] | [0 P0, 0 P1, 0 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1793872885543-931fzb, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-05T10:09:34Z
<!-- MACHINE-OWNED: END -->
