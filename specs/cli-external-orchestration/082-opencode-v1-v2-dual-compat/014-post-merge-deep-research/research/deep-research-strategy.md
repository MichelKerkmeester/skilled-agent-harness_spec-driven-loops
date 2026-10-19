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
- [x] Why does a plain `pi --help` in the trusted main checkout register no `--fast`, and what claim design registers exactly one copy in every layout?
- [ ] Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list?
- [x] Which sk-vision OpenCode 2 runtime paths can still misbehave (registration, grace, close, interpreter checks, venv race)?
- [x] Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main?
- [x] Where do the changed code and docs miss sk-code-skilled and sk-doc, and what dual-version architecture should the remediation converge on?

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
- Why does a plain `pi --help` in the trusted main checkout register no `--fast`, and what claim design registers exactly one copy in every layout?
- Which sk-vision OpenCode 2 runtime paths can still misbehave (registration, grace, close, interpreter checks, venv race)?
- Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main?
- Where do the changed code and docs miss sk-code-skilled and sk-doc, and what dual-version architecture should the remediation converge on?

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
- Does the duplicate-flag conflict diagnostic surface visibly to users in coexistence layouts (worktree + user alias) if flags register unconditionally, and is any severity above "diagnostic"? (iteration 1)
- Do claim-gated `/fast` command and session-start side effects need the same un-gating, or a final-pass-aware claim (requires an eviction/takeover primitive that today's bus API lacks)? (iteration 1)
- Does the same alias-pruning interaction affect other packages that ship both a user-level symlink and a project copy (e.g. pi-cache-optimizer)? (iteration 1)
- Which **generator scripts** still assume one OpenCode version or a fixed file list (the unexamined sub-angle of the open key question)? (iteration 2)
- Does the OpenCode 2.0.32 host in fact emit the pass-through event names the plugins gate on (`session.created`, `server.instance.disposed`, `global.disposed`)? README:65 concedes this is unverified; closing it needs a read-only live observation, not edits. (iteration 2)
- Should `skippedKeys` become loud (asserted empty per bridged plugin, exceptions manifest-gated) — sequencing question for the remediation phase. (iteration 2)
- Where do the changed code and docs miss sk-code-skilled and sk-doc, and what dual-version architecture should the remediation converge on? (iteration 3)
- Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list? — generators closed here; cross-branch docs sweep remains. (iteration 3)
- Which sk-vision OpenCode 2 runtime paths can still misbehave (registration, grace, close, interpreter checks, venv race)? (iteration 3)
- Carried from iteration 1: does the duplicate-flag conflict diagnostic surface visibly in coexistence layouts; do claim-gated `/fast` and session-start side effects need un-gating; does the alias-pruning interaction affect other packages (pi-cache-optimizer)? (iteration 3)
- Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main? (partial input from F-03: listing batteries must subtract built-ins and normalize the walk-up effect) (iteration 3)
- Carried from iteration 2: does the OpenCode 2.0.32 host emit the pass-through event names the plugins gate on (`session.created`, `server.instance.disposed`, `global.disposed`); should `skippedKeys` become loud. (iteration 3)
- Carried from iterations 1–3 (unchanged): does the duplicate-flag conflict diagnostic surface visibly in coexistence layouts if flags register unconditionally, and is anything above "diagnostic"; do claim-gated `/fast` and session-start side effects need un-gating or a final-pass-aware claim (eviction primitive absent); does the alias-pruning interaction affect other user-symlink+project-copy packages (e.g. pi-cache-optimizer); the event-name live-delivery observation (row 8); the `skippedKeys` loudness sequencing decision (row 7). (iteration 4)
- "Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list?" — plugins/tests/generators enumerated (this session, iterations 2–3); remaining tail: the wide changed-docs sweep outside 018's focus set (~227 docs with their own mode validators), i.e. the last limb of Q2. (iteration 4)
- Sibling open questions folded into the record (owner: operator probes or later checks): 015 — does OpenCode 2.0.32's `@opencode/plugin` context declare `session`/`tool` domains (retires f-004); how often does a real `ctx.session.get` fail (weights f-002). 016 — does 1.19.3 accept `--share` at runtime; which agent directory does the binary read; which plugin failed the v1 import harness at `6d7f6b8499` (the `battery-v1` artifact of run 39308825187 holds it). 017 — does any repo gate run the `.pi` extension packages' tests (weights row 2); are the `mcp-code-mode` and `sk-design-md-generator/backend` lockfiles tracked; should the hooks tree join the existing guard workflow or get its own. 018 — does the vitest run report 80; does a dedicated adapter-suite runner already cover `.pi` (retires row 32); do the remaining ~227 docs pass their validators. (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Sibling open questions folded into the record (owner: operator probes or later checks): 015 — does OpenCode 2.0.32's `@opencode/plugin` context declare `session`/`tool` domains (retires f-004); how often does a real `ctx.session.get` fail (weights f-002). 016 — does 1.19.3 accept `--share` at runtime; which agent directory does the binary read; which plugin failed the v1 import harness at `6d7f6b8499` (the `battery-v1` artifact of run 39308825187 holds it). 017 — does any repo gate run the `.pi` extension packages' tests (weights row 2); are the `mcp-code-mode` and `sk-design-md-generator/backend` lockfiles tracked; should the hooks tree join the existing guard workflow or get its own. 018 — does the vitest run report 80; does a dedicated adapter-suite runner already cover `.pi` (retires row 32); do the remaining ~227 docs pass their validators.

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
- Current generation: 2
- Started: 2026-10-19T19:08:58.499Z
