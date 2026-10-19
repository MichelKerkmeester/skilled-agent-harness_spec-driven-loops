---
title: Deep Research Strategy - post-merge dual-compat research
description: Session tracking for a parallel post-merge research phase of packet 082.
trigger_phrases:
  - "post merge deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - post-merge dual-compat research

## 2. TOPIC
What bugs and drift remain in worktree dependency provisioning (worktree-naming.sh provision_worktree, worktree-provision-paths.txt, the bun and npm choice) and in the dispatch adapter suite runner and hooks vitest config after the 2026-10-19 merge to main

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which provisioning and adapter-suite-runner paths can still fail, drift or mislead after the merge?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing code or docs; fixes land in later phases.
- Re-running the original 20-iteration run in `../../research/`.
- Mutating `~/.pi`, `trust.json`, global installs or the shared OpenCode 2 service (PID 46220).

---

## 5. STOP CONDITIONS
- All 10 steered iterations have run (stop policy max-iterations, convergence off).
- A credential or quota error from llmgateway stops the session at the next boundary.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which provisioning and adapter-suite-runner paths can still fail, drift or mislead after the merge?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Whether the mcp-code-mode and sk-design-backend lockfiles are git-tracked (manifests confirmed tracked; lockfile tracked-status not separately checked). (iteration 1)
- Whether any repo gate actually runs the two `.pi` extension packages' test scripts (their `check` scripts exist; no consuming gate found) — determines F1's real impact. (iteration 1)
- Whether the hooks vitest tree should join `dispatch-enforcement-guard.yml` or a new workflow (design decision, out of research scope). (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- The original 20-iteration run and its synthesis: `../../research/research.md` and `../../research/steering-log.md` (packet 082).
- Merged to main on 2026-10-19: 143 `fe1f8a9a53` (dual compat, sk-vision phases 012-013), 146 `8e8e95e8e6` (Pi fast-mode copy claim), 147 `6358d81eba` (worktree provisioning, adapter suite runner as `hooks/024`).
- Merge-time faults: `session-relaunch.js` lacked `dualPlugin` (fixed in `fe1f8a9a53`, evidence `../011-two-version-proof-and-closeout/scratch/main-merge/`); duplicate `hooks/023` numbering (renumbered to 024); main's global-only fast-mode check left no `--fast` in the main checkout (`specs/system-deep-loop/040-cli-pi-worktree-extension-clash/scratch/main-merge/fast-flag-matrix.txt`).
- Open: a plain `pi --offline --help` in the trusted main checkout still lists no `--fast` with the copy claim, while `-a`, `-na` and worktrees list it once.
- resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 1
- Convergence threshold: 0 (convergence mode off, stop policy max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 1800 s)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-10-19T19:09:11.320Z
