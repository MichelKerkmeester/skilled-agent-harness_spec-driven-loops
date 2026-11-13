# Deep Research Strategy - ux lineage

## 1. TOPIC

Find further improvements to command surfacing after the planned phases 005 to 008, on the UX angle: what the hook brief says and how a model reads it, when a command is offered, asked or started, the install and setup path for an external repository, and the performance and token cost the person pays for the brief. The cross-CLI question is the spine: whether a model on claude, codex, opencode, pi, devin or dsh actually starts an offered command, and what stops it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What does the hook brief actually put in front of a model today, and can a model on each of the six CLIs act on it without guessing the command id, its policy, the document to read and whether it was already offered?
- [x] Which before-arm runtime behaviour explains the start rates (claude 3 of 12, codex 0 of 12, pi 0 of 12, devin 2 of 12 or 12, opencode 4 of 9, dsh 3 of 8), and what stops a model from starting an offered command?
- [ ] Which command-discovery surface defects (the g5 `skill.md` collision and its siblings) keep a command from being offered or found on each runtime, and what detects them before a user hits one?
- [x] What does a person installing Skilled into an external repository see on first run, and where does the setup path still fail silently after the embedder work phase 008 plans?
- [x] What is the measured cost of the brief and of the hook (latency, tokens, cold start, embedder), and which part of that cost is invisible to the person paying it?

<!-- /ANCHOR:key-questions -->

---

## 3. NON-GOALS

- Changing how skills are scored against each other, or re-deciding any operator answer recorded in `../../decision-record.md` (D1 to D5, Q001 to Q039).
- Re-recommending anything phases 005 to 008 already plan. The lineage recommends only what comes after them or what they miss.
- Editing or implementing anything. Findings and recommendations only; every recommendation names the file, the gain and the verification, and stops there.
- Reading holdout prompt text. Corpus rows are read by the committed scripts only, never by this lineage.
- Running pi, starting or stopping ollama, killing processes, running the full vitest suite, or any git write.

---

## 4. STOP CONDITIONS

- Five iterations completed, or newInfoRatio below 0.05 after the three-iteration floor.
- A source needed for a measurement cannot be read under the hard rules; the gap is recorded rather than guessed.
- Any write would land outside `research/lineages/ux`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which before-arm runtime behaviour explains the start rates (claude 3 of 12, codex 0 of 12, pi 0 of 12, devin 2 of 12 or 12, opencode 4 of 9, dsh 3 of 8), and what stops a model from starting an offered command?
- What does a person installing Skilled into an external repository see on first run, and where does the setup path still fail silently after the embedder work phase 008 plans?
- What is the measured cost of the brief and of the hook (latency, tokens, cold start, embedder), and which part of that cost is invisible to the person paying it?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- measuring the real hook rather than reading the renderer produced the character and line counts, and the greeting probe exposed the unconditional directive cost that no document states. The synthetic scorer call turned a reading of `commandParts` into a reproduced false negative. (iteration 1)
- re-scoring per row instead of trusting the aggregate turned a flat 3 of 12 into 3 of 4 read-only and 0 of 8 mutating, which is a different story and a different recommendation. Reading the changed paths showed devin producing the command's exact artifacts, which exposed the metric's path-versus-outcome confusion. (iteration 2)
- counting each runtime's actual mirror root rather than assuming the six runtimes share one surface turned the naming difference into a person-facing problem and found Devin's missing surface. (iteration 3)
- following the person's path step by step instead of reading the phase plans exposed that "Confirms the whole setup works" is literally false on a cold install, and reading the target-side merge rule found the hook-wiring hole. (iteration 4)
- a fresh 40-sample run with byte measurement produced both halves of the cost in one pass, and reading the timeout resolver prevented a false "250 ms cliff" claim that the p95 would otherwise have suggested. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- looking for an existing offer ledger assumed the diagnostics schema had evolved with phase 005; it has not, because 005 only adds recommendation fields. (iteration 1)
- joining on an aggregate first produced a "claude starts 3 of 12" claim that would have hidden the class inversion; the aggregate is only useful after the split exists. (iteration 2)
- relying on the parent packet's "44 tracked commands" without counting the folder contents would have hidden that the loss is 12, not 1. (iteration 3)
- trying to find a recorded cold-start number failed; the repository records warm numbers only, which is itself the finding. (iteration 4)
- the committed probe in the phase 004 scratch depends on a row file that is not in the checkout, so it cannot be rerun as-is; the measurement had to be rebuilt inline. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point.

### **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162]

### **Re-running the before arm to stabilise the numbers.** The arm is still growing (devin 16, opencode 14, dsh 12 at 23:01) and phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Re-running the before arm to stabilise the numbers.** The arm is still growing (devin 16, opencode 14, dsh 12 at 23:01) and phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the before arm to stabilise the numbers.** The arm is still growing (devin 16, opencode 14, dsh 12 at 23:01) and phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs.

### **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation.

### **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename.

### **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename.

### **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them.

### **Treating the low claude start rate as a briefing failure.** The per-row split shows claude starts every read-only doctor row it meets (3 of 4) and no mutating one; a wording change would have to explain why the same brief works for one class and not the other, so the cause is the model's judgment about its own capability, not the text alone. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the low claude start rate as a briefing failure.** The per-row split shows claude starts every read-only doctor row it meets (3 of 4) and no mutating one; a wording change would have to explain why the same brief works for one class and not the other, so the cause is the model's judgment about its own capability, not the text alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the low claude start rate as a briefing failure.** The per-row split shows claude starts every read-only doctor row it meets (3 of 4) and no mutating one; a wording change would have to explain why the same brief works for one class and not the other, so the cause is the model's judgment about its own capability, not the text alone.

### **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there.

### **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected.

### **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation.

### Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands.

### Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227]

### Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout.

### Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed.

### Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory.

### Looking for a per-policy figure in the existing summary: `--summary` prints one aggregate per arm and no policy breakdown, so the split had to be recomputed per session in this iteration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a per-policy figure in the existing summary: `--summary` prints one aggregate per arm and no policy breakdown, so the split had to be recomputed per session in this iteration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-policy figure in the existing summary: `--summary` prints one aggregate per arm and no policy breakdown, so the split had to be recomputed per session in this iteration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640]

### Looking for a rule that binds a command's policy to its skill path: Gate 2 has no command clause today, and the phase 006 bullet draft binds only "a brief or advisor result that names a command". [SOURCE: AGENTS.md:63] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a rule that binds a command's policy to its skill path: Gate 2 has no command clause today, and the phase 006 bullet draft binds only "a brief or advisor result that names a command". [SOURCE: AGENTS.md:63]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a rule that binds a command's policy to its skill path: Gate 2 has no command clause today, and the phase 006 bullet draft binds only "a brief or advisor result that names a command". [SOURCE: AGENTS.md:63]

### Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store.

### Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5.

### Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename. (iteration 1)
- **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation. (iteration 1)
- Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5. (iteration 1)
- Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85] (iteration 1)
- **Re-running the before arm to stabilise the numbers.** The arm is still growing (devin 16, opencode 14, dsh 12 at 23:01) and phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs. (iteration 2)
- **Treating the low claude start rate as a briefing failure.** The per-row split shows claude starts every read-only doctor row it meets (3 of 4) and no mutating one; a wording change would have to explain why the same brief works for one class and not the other, so the cause is the model's judgment about its own capability, not the text alone. (iteration 2)
- Looking for a per-policy figure in the existing summary: `--summary` prints one aggregate per arm and no policy breakdown, so the split had to be recomputed per session in this iteration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640] (iteration 2)
- Looking for a rule that binds a command's policy to its skill path: Gate 2 has no command clause today, and the phase 006 bullet draft binds only "a brief or advisor result that names a command". [SOURCE: AGENTS.md:63] (iteration 2)
- **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename. (iteration 3)
- **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there. (iteration 3)
- Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227] (iteration 3)
- Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory. (iteration 3)
- **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point. (iteration 4)
- **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them. (iteration 4)
- Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed. (iteration 4)
- Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store. (iteration 4)
- **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162] (iteration 5)
- **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation. (iteration 5)
- **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected. (iteration 5)
- Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands. (iteration 5)
- Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout. (iteration 5)

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
Follow up on: **No session-total cost is recorded.** The pieces are measured separately — hook per call, embedder per call, CLI per call — and no committed script reports a session-shaped total of N prompts plus one daemon start pl...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 11. KNOWN CONTEXT

Bounded pointer snapshot from the parent packet and its children. Read-only.

- **Parent packet**: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/`. Phases 001 to 004 are Complete; 005 to 008 are Planned, not built. `spec.md`, `decision-record.md` (Q001 to Q039) and `goal.md` bind this lineage.
- **005-recommendation-contract-and-brief**: one generated `COMMAND_ROWS` table in `ADV/lib/command-attach.ts`; `command`, `policy`, `ownerSkillId` in the public recommendation; the brief head becomes `use <owner> → <command> (<policy>)`; degraded path shows a command only when the prompt typed it; six golden heads.
- **006-gate-2-binding-and-runtime-pointers**: one Gate 2 bullet in `AGENTS.md` (`COMMAND: [/name] → [started|offered|declined]`, read the document in full, `start` runs without `:auto`, `ask` asks once), a generated Cursor pointer block, a Gate 3 notice naming `/speckit:plan`, and `(parent-named only)` in a child brief.
- **007-per-runtime-behaviour-proof**: transcript scorer and one-turn runner already built; before arm in flight. `scratch/runs-pre.jsonl` scored 2026-11-12: claude start 3 of 12, codex 0 of 12, pi 0 of 12, devin 2 of 12, opencode 4 of 9, dsh 3 of 8; `COMMAND:` line 0 of 24 on every runtime except dsh 1 of 8; pi unsafe 3.
- **008-embedder-setup-and-cost**: `measure-embedder-cost.mjs`, a `commandVectorCoverage` and `backend` status field, a 750 ms prompt-embedding deadline, a `semantic_lane_off:<reason>` JSON warning, one `/doctor:skill-advisor embedder` route behind a yes, a sixth `/doctor:setup` leg, and install-guide cost tables. The hook brief stays unchanged by operator decision Q037.
- **g5**: `scratch/g5/result.txt` records that a command file named `skill.md` makes Claude Code read its folder as one skill named after the folder, hiding every sibling command. `.claude/commands/create/skill.md` exists as a symlink to `.skilled/commands/create/skill.md`; 13 siblings share that folder.
- **Measured cost, 2026-11-12**: warm embed median 6.57 ms, p95 10.99 ms; advisor CLI 62.7 to 71.3 ms end to end; hook latency median about 200 ms, p95 about 260 ms over 44 probes; `OLLAMA_QUERY_TIMEOUT_MS` 5,000; Claude hook budget 2,500 ms; CLI fallback budget 250 ms; brief token cap 80 (120 when ambiguous).
- **Write surface**: this lineage only, `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/`.

### Bounded Context Snapshot

- **Source pointers**: `ADV/lib/render.ts` (brief head, directive block, caps), `ADV/lib/metrics.ts` (closed diagnostic schema), `ADV/handlers/advisor-recommend.ts`, `AGENTS.md` Gate 2, `.skilled/commands/doctor/_routes.yaml`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `INSTALL-SKILLED.md`, `DOC/assets/doctor-setup.yaml`.
- **Reuse candidates**: `ADV/scripts/routing-accuracy/score-command-transcripts.mjs`, `ADV/scripts/measure-embedder-cost.mjs`, `005/scratch/brief-heads.mjs`, `007/scratch/hook-first-line.sh`.
- **Integration points**: the model-visible brief, the closed-schema diagnostics record, the runtime mirror generators, the `/doctor:setup` legs, the install guide.
- **Constraints**: no holdout text; read-only git; no pi; no ollama control; no process kills; no full vitest; writes only inside this lineage.

---

## 12. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls (self-capped at 12), 12 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 2, 5, 6-10A
- Canonical pause sentinel: `.deep-research-pause` (this lineage)
- Current generation: 1
- Started: 2026-11-12T22:54:00Z
