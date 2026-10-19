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
What runtime bugs and drift remain in sk-vision's OpenCode 2 support after the 2026-10-19 merge to main: tool registration through ctx.tool.transform and the SK_VISION_AUTOINSPECT switch, the 2-second grace path, RuntimeClient.close(), the interpreter checks and the venv mkdir race

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which sk-vision OpenCode 2 runtime paths (registration, grace, close, interpreter checks, venv race) can still misbehave, and what fix does each need?

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
[None yet]

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
A23 sk-vision OpenCode 2 runtime bugs: which runtime paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2 after phases 012 and 013 of packet 082? Cover tool registration in `plugin.ts` `setup` (the `ctx.tool.transform` path, the `SK_VISION_AUTOINSPECT` switch, ordering after the prompt hook, fail-open behaviour), `opencode/tools.ts` `toV2Tools`, the 2-second grace path for models off the text-only list, and `runtime/client.ts` `close()`, the 5-second interpreter checks and the venv `mkdir` race that phase 013 left open (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md`). Output: a ranked bug list with file:line evidence, each labelled confirmed, documented or inferred, and the fix each needs. Check: read the sources and tests and run `bun test` in `vision-runtime` read-only; never edit files outside this research packet.

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
- Current generation: 1
- Started: 2026-10-19T18:32:01.259Z
