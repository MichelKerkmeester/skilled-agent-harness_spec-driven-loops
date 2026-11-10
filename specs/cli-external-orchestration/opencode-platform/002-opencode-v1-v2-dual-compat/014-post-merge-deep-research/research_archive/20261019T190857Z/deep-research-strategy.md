---
title: Deep Research Strategy - post-merge dual-compat research
description: Session tracking for the ten steered post-merge iterations of packet 082 phase 014.
trigger_phrases:
  - "post merge deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - post-merge dual-compat research

## 2. TOPIC
What drift, bugs and refinements remain in the work four branches merged to main on 2026-10-19 (OpenCode v1/v2 dual compatibility, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner), what is the best dual-version architecture, and where do the changed code and docs miss the sk-code-skilled and sk-doc contracts

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry. Add external or late questions through `{spec_folder}/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [ ] Why does a plain `pi --help` in the trusted main checkout register no `--fast`, and what claim design registers exactly one copy in every layout?
- [ ] Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list?
- [ ] Which sk-vision OpenCode 2 runtime paths can still misbehave (registration, grace, close, interpreter checks, venv race)?
- [ ] Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main?
- [ ] Where do the changed code and docs miss sk-code-skilled and sk-doc, and what dual-version architecture should the remediation converge on?
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
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Approaches that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])
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
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
A21 Pi fast-mode claim in a trusted project: why does a plain `pi --offline --help` in the trusted main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, trusted in `~/.pi/agent/trust.json`) list no `--fast` while `-a`, `-na` and the git worktrees list it once, given `claimPackage` in `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`? Test the hypothesis that Pi's resource loader reuses one event bus across a pre-trust load and the trusted load, so the first pass's claim listener survives and every later copy stands down: read `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/resource-loader.js` (`loadCurrentExtensionSet`, `loadExtensionsCached`, `this.eventBus`, the trust passes) and `dist/core/extensions/loader.js` (`createExtensionRuntime`, `invalidate`, `trackEventBusSubscription`), and find where the extension's flags are taken from (which pass's runtime). Output: a confirmed or refuted root cause with file:line evidence, the exact load sequence for a trusted project, and a claim design (for example scoped to the runtime or load) that registers exactly one copy in the trusted main checkout, a worktree and an untrusted folder. Check: read the two dist files and `pi --offline --help` output counts; never edit `~/.pi`, `trust.json` or any repo file outside this research packet.

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
- Max iterations: 10
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
- Started: 2026-10-19T18:20:15.000Z
