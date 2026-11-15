---
title: "Deep Review Strategy: session relaunch loop"
description: "Session tracking for the deep review of the session relaunch loop packet."
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Relaunch Loop

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

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
Review of `specs/hooks/023-session-relaunch-loop` (spec-folder): the self-relaunching session loop committed as b830fd0276. The loop writes a handoff note near the context limit, ends the session and restarts the runtime seeded to claim the note. Scope: the 89 implementation, test, registration and doc files the commit adds or changes outside `specs/`.
---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Pre-existing code the commit did not touch, except where a new file calls into it.
- Changing `autoCompactEnabled` or `autoCompactWindow` (frozen operator decision).
- Runtimes beyond Claude Code, Codex, Pi, OpenCode, Hermes, Cursor and Devin.
- Generated runtime mirrors, except to check they match the generator.
---

## 5. STOP CONDITIONS
- Legal convergence under stop policy `convergence`, or 10 iterations, whichever comes first.
- An active P0 that blocks release is recorded and the loop continues to cover remaining dimensions.
- Three consecutive iteration errors halt the loop into synthesis.
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
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Whole-file contract diff: reading the four core files against interface-contract sections 4/7/9/11.5-11.11 produced exact claim-to-code deltas and confirmed the binding amendments (iteration 1).
- Test-name inventory before deep reads: showed which failure modes are already asserted, e.g. only sequential appendLog calls and no transcript-read-error case (iteration 1).
- End-to-end escape audit of both manual-command builders before severity calls: proved the seed escaping and spec_folder pattern safe and isolated the lock and state-dir defects (iteration 2).
- Static adapter sweep (`rg` for exec/eval/shell:true/process.kill across .claude, .codex, .opencode, .pi, .hermes hooks) bounded the adapter payload surface without a full multi-file read (iteration 2).
- Binding-by-index parity check: resolving each `hook-registry.json` binding to its rendered row by event, group and hook index (rather than by script name) proved the six Claude/Codex `session-relaunch` rows match and closed runtime parity in four reads (iteration 3).
- One falsifiable claim per document: the session-id regex, `NUDGE_STEP`, the Devin `seed_option` and the four documented relaunch argv forms each mapped to one exact grep, so five overlay protocols closed inside the budget (iteration 3).
- Treating reducer-labelled `BLOCKED` entries whose text says "deferred to D3" as deferrals and executing them produced both of this iteration's findings (iteration 3).
- Function-inventory grep before body reads: one `grep -nE "^(export )?(async )?function"` over the five producers exposed five `plannedNotePath` definitions, four `relaunchThreshold` definitions and three `notePathFromSeed` definitions, which anchored all three D4 findings without a full multi-file read (iteration 4).
- Comment-hygiene grep as a falsifiable check: the negative result (zero ephemeral labels) closed that direction in one call and let the iteration spend its budget on duplication (iteration 4).
- Reading all five stop/session-end adapters and `arm()` in two batched calls isolated the one missing pending-status guard without re-reviewing the rest of the adapters (iteration 5).
- One `ls -l` plus `cmp` closed two deferrals at once: the mirror-link shape (SL-205) and the real-file direction of the OpenCode plugin (iteration 5).
- One batched range read over the eleven cited file:line pairs re-confirmed ten findings and narrowed one inside a single call, and the same call produced the five `plannedNotePath` and three `notePathFromSeed` counts that back M4-P2-001/M4-P2-003 (iteration 6).
- Declared-fallback check as the parity test: reading the registry's `"fallback": "none"` rows before judging the generated settings turned an apparent missing-fallback drift into a clean result (iteration 6).
- Search-debt discharge against constants: resolving each obligation against its cited file closed four of five rows inside one batched read, and the fifth surfaced a two-location documentation drift (`bin/README.md:177` and the command-runtimes playbook:40) that no pointer check would have found (iteration 7).

---

## 9. WHAT FAILED
- No failing approach yet. The one dead end was treating the wrapper section 7 opening order statement (consume, hops, cd) as binding; the section 7 amendment (cd before consume) supersedes it (iteration 1).
- Adapter payload depth was not line-audited in D2: the sweep found no shell/eval/exec surface but could not prove the two `spawn(` sites pass argv arrays; carried to D3/D4 (iteration 2).
- A content diff cannot distinguish a mirror copy from a followed symlink, so the README's "symlink" wording for `.cursor/commands/speckit-handoff.md` stayed unproven; a link-mode read is required (iteration 3, deferred as SL-205).
- Reading the contract's section 7 opening bullet without its amendment block produced a false code defect in D1; the contradiction is documentation, not implementation (iteration 3).
- The OpenCode adapter body (414 lines) was not read in D4; only its function inventory and duplication surface were checked, so its internal maintainability stays unverified and the dimension's test-coverage limb is a deferral rather than a confirmed-clean result (iteration 4).
- README accuracy was spot-checked, not exhausted: the symlink-shape claims need a link-mode read and the killer quantitative claims need a killer.cjs reread, both of which did not fit the iteration budget (iteration 4, carried as SL-205/SL-208).
- `killer.cjs` was only partially re-read (lock and transcript sections), so R1-P2-003 stays carried rather than re-confirmed (iteration 5).
- Packet docs were not re-read, so T3-P2-001/T3-P2-002 remain carried for a documentation pass (iteration 5).
- Adversarial re-verification adds no convergence signal: no new finding and no severity change, so the residual surfaces were read in full (not sampled) to make the iteration worth its budget (iteration 6).
- SL-209's evidenceRef points at `tasks.md:56` (the T008 playbook row) while the pointer defect it describes sits on the T009 row at `:58`; the row is recorded as-is rather than silently renumbered (iteration 7).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Catalog drift on the four sampled behavioral claims** (session-id pattern, +0.05 re-nudge, Claude event surface, Devin seed form). Ruled out against `nudge.cjs:19,21`, the registry and `skilled-loop:62` (SL-206). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Catalog drift on the four sampled behavioral claims** (session-id pattern, +0.05 re-nudge, Claude event surface, Devin seed form). Ruled out against `nudge.cjs:19,21`, the registry and `skilled-loop:62` (SL-206).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Catalog drift on the four sampled behavioral claims** (session-id pattern, +0.05 re-nudge, Claude event surface, Devin seed form). Ruled out against `nudge.cjs:19,21`, the registry and `skilled-loop:62` (SL-206).

### **Checked-but-unevidenced tasks.** Ruled out for resolvability of the sampled pointers; the two that fail became T3-P2-001 rather than a general claim (SL-201). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Checked-but-unevidenced tasks.** Ruled out for resolvability of the sampled pointers; the two that fail became T3-P2-001 rather than a general claim (SL-201).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Checked-but-unevidenced tasks.** Ruled out for resolvability of the sampled pointers; the two that fail became T3-P2-001 rather than a general claim (SL-201).

### **Missing or divergent command surfaces for `/speckit:handoff`.** Ruled out: six surfaces exist and agree on the canonical path (SL-204). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Missing or divergent command surfaces for `/speckit:handoff`.** Ruled out: six surfaces exist and agree on the canonical path (SL-204).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Missing or divergent command surfaces for `/speckit:handoff`.** Ruled out: six surfaces exist and agree on the canonical path (SL-204).

### **Playbook relaunch-form drift for the four command-runtime verdicts.** Ruled out against the wrapper arms and the stub case (SL-207). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Playbook relaunch-form drift for the four command-runtime verdicts.** Ruled out against the wrapper arms and the stub case (SL-207).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Playbook relaunch-form drift for the four command-runtime verdicts.** Ruled out against the wrapper arms and the stub case (SL-207).

### **Runtime parity drift between the hook registry and the generated Claude/Codex config.** Ruled out by resolving each registry binding to its rendered row by event, group and hook index (SL-203). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Runtime parity drift between the hook registry and the generated Claude/Codex config.** Ruled out by resolving each registry binding to its rendered row by event, group and hook index (SL-203).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Runtime parity drift between the hook registry and the generated Claude/Codex config.** Ruled out by resolving each registry binding to its rendered row by event, group and hook index (SL-203).

### `agent_cross_runtime` (overlay): **pass** — re-confirmed at row level in iteration 6; the registry and generated configs were not touched since. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): **pass** — re-confirmed at row level in iteration 6; the registry and generated configs were not touched since.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): **pass** — re-confirmed at row level in iteration 6; the registry and generated configs were not touched since.

### `agent_cross_runtime` (overlay): carried pass from D3; no registry or generated-config file was re-read. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): carried pass from D3; no registry or generated-config file was re-read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): carried pass from D3; no registry or generated-config file was re-read.

### `agent_cross_runtime` (overlay): re-run at the row level (event, group, slot, async, fallback) rather than the index level used in D3 -- pass; the earlier pass is re-confirmed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): re-run at the row level (event, group, slot, async, fallback) rather than the index level used in D3 -- pass; the earlier pass is re-confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): re-run at the row level (event, group, slot, async, fallback) rather than the index level used in D3 -- pass; the earlier pass is re-confirmed.

### `appendLog` O(n) whole-file cost as a standalone finding: bounded by the 10-hop cap and event count; folded into finding 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `appendLog` O(n) whole-file cost as a standalone finding: bounded by the 10-hop cap and event count; folded into finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `appendLog` O(n) whole-file cost as a standalone finding: bounded by the 10-hop cap and event count; folded into finding 1.

### `checklist_evidence` - not checked (deferred to D3). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` - not checked (deferred to D3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` - not checked (deferred to D3).

### `checklist_evidence` (core): **partial** — T3-P2-001 remains active and now carries the T009 pointer evidence; T008's playbook pointer resolves. Run-ledger receipts outside the packet were not re-verified. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence` (core): **partial** — T3-P2-001 remains active and now carries the T009 pointer evidence; T008's playbook pointer resolves. Run-ledger receipts outside the packet were not re-verified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **partial** — T3-P2-001 remains active and now carries the T009 pointer evidence; T008's playbook pointer resolves. Run-ledger receipts outside the packet were not re-verified.

### `checklist_evidence` (core): carried partial (T3-P2-001); packet task lists were not re-read. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence` (core): carried partial (T3-P2-001); packet task lists were not re-read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): carried partial (T3-P2-001); packet task lists were not re-read.

### `checklist_evidence` (core): not checked this iteration (deferred to D3). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): not checked this iteration (deferred to D3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): not checked this iteration (deferred to D3).

### `checklist_evidence` (core): partial -- T3-P2-001 remains the standing pointer defect; the task lists were read only at `tasks.md:143-145`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence` (core): partial -- T3-P2-001 remains the standing pointer defect; the task lists were read only at `tasks.md:143-145`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial -- T3-P2-001 remains the standing pointer defect; the task lists were read only at `tasks.md:143-145`.

### `ENV-REFERENCE.md` documenting a dead `SESSION_RELAUNCH_WINDOW_TOKENS` switch: refuted at `context-usage.cjs:147,164`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `ENV-REFERENCE.md` documenting a dead `SESSION_RELAUNCH_WINDOW_TOKENS` switch: refuted at `context-usage.cjs:147,164`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `ENV-REFERENCE.md` documenting a dead `SESSION_RELAUNCH_WINDOW_TOKENS` switch: refuted at `context-usage.cjs:147,164`.

### `feature_catalog_code` (overlay): **pass** — SL-208 discharged; every code-backed catalog claim now matches its constant. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): **pass** — SL-208 discharged; every code-backed catalog claim now matches its constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): **pass** — SL-208 discharged; every code-backed catalog claim now matches its constant.

### `feature_catalog_code` (overlay): carried partial; SL-208 quantitative claim remains deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): carried partial; SL-208 quantitative claim remains deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): carried partial; SL-208 quantitative claim remains deferred.

### `findCodexPid` (`codex/stop-arm.mjs:67-88`) and `findHermesPid` (`hermes/session-end-arm.mjs:49-70`) are byte-identical. Real duplication, but the same root cause as M4-P2-001/M4-P2-003; folded into their shared-helper remediation instead of opening a fifth duplication finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `findCodexPid` (`codex/stop-arm.mjs:67-88`) and `findHermesPid` (`hermes/session-end-arm.mjs:49-70`) are byte-identical. Real duplication, but the same root cause as M4-P2-001/M4-P2-003; folded into their shared-helper remediation instead of opening a fifth duplication finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `findCodexPid` (`codex/stop-arm.mjs:67-88`) and `findHermesPid` (`hermes/session-end-arm.mjs:49-70`) are byte-identical. Real duplication, but the same root cause as M4-P2-001/M4-P2-003; folded into their shared-helper remediation instead of opening a fifth duplication finding.

### `hook-flags.env.example` naming a flag the code never derives: refuted; `CONCERN = 'session-relaunch'` derives the documented name. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `hook-flags.env.example` naming a flag the code never derives: refuted; `CONCERN = 'session-relaunch'` derives the documented name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hook-flags.env.example` naming a flag the code never derives: refuted; `CONCERN = 'session-relaunch'` derives the documented name.

### `osascript` notification injection: argv spawn plus JSON quoting. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `osascript` notification injection: argv spawn plus JSON quoting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `osascript` notification injection: argv spawn plus JSON quoting.

### `playbook_capability` (overlay): **partial** — argv and capability claims pass, but the playbook's process-contract sentence is finding F7-P2-001. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability` (overlay): **partial** — argv and capability claims pass, but the playbook's process-contract sentence is finding F7-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): **partial** — argv and capability claims pass, but the playbook's process-contract sentence is finding F7-P2-001.

### `playbook_capability` (overlay): carried partial from D3. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability` (overlay): carried partial from D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): carried partial from D3.

### `skill_agent` (overlay): **partial** — carried; no command surface was re-read this iteration. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent` (overlay): **partial** — carried; no command surface was re-read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): **partial** — carried; no command surface was re-read this iteration.

### `skill_agent` (overlay): carried partial from D3. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent` (overlay): carried partial from D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): carried partial from D3.

### `skill_agent`, `feature_catalog_code`, `playbook_capability` (overlays): carried partial; no new evidence this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `skill_agent`, `feature_catalog_code`, `playbook_capability` (overlays): carried partial; no new evidence this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `feature_catalog_code`, `playbook_capability` (overlays): carried partial; no new evidence this iteration.

### `SKILLED_LOOP_MANUAL_TEMPLATE` injection: wrapper-produced, exactly one `@@HANDOFF@@` token required, seed escaped before substitution. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `SKILLED_LOOP_MANUAL_TEMPLATE` injection: wrapper-produced, exactly one `@@HANDOFF@@` token required, seed escaped before substitution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SKILLED_LOOP_MANUAL_TEMPLATE` injection: wrapper-produced, exactly one `@@HANDOFF@@` token required, seed escaped before substitution.

### `skilled-loop` shell-function ordering and `start_directory` timing: previously ruled out (iteration 1); no new evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skilled-loop` shell-function ordering and `start_directory` timing: previously ruled out (iteration 1); no new evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skilled-loop` shell-function ordering and `start_directory` timing: previously ruled out (iteration 1); no new evidence.

### `spec_code` - partial. D2 verified the security behavior against contract section 9 anchors (state dir line 22, ancestry line 126, lock lines 129-130); sections 11.10-11.11 and the packet docs were not re-read this pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` - partial. D2 verified the security behavior against contract section 9 anchors (state dir line 22, ancestry line 126, lock lines 129-130); sections 11.10-11.11 and the packet docs were not re-read this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` - partial. D2 verified the security behavior against contract section 9 anchors (state dir line 22, ancestry line 126, lock lines 129-130); sections 11.10-11.11 and the packet docs were not re-read this pass.

### `spec_code` (core): **partial** — carried; interface-contract sections 11.10-11.11 remain unread and no claim in this iteration depends on them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code` (core): **partial** — carried; interface-contract sections 11.10-11.11 remain unread and no claim in this iteration depends on them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **partial** — carried; interface-contract sections 11.10-11.11 remain unread and no claim in this iteration depends on them.

### `spec_code` (core): carried partial. This pass re-checked the code side of the ten P2 claims only; sections 11.10-11.11 of the interface contract remain unread from D1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code` (core): carried partial. This pass re-checked the code side of the ten P2 claims only; sections 11.10-11.11 of the interface contract remain unread from D1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): carried partial. This pass re-checked the code side of the ten P2 claims only; sections 11.10-11.11 of the interface contract remain unread from D1.

### `spec_code` (core): partial -- sections 11.10-11.11 of the interface contract remain unread; no code claim in this iteration depends on them. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code` (core): partial -- sections 11.10-11.11 of the interface contract remain unread; no code claim in this iteration depends on them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial -- sections 11.10-11.11 of the interface contract remain unread; no code claim in this iteration depends on them.

### `spec_code` (core): partial. The four core files match interface-contract sections 4 (record transitions), 7 (wrapper argv/exit codes/130 and decline paths), 9 (killer anchors, lock, timeout) and 11.5-11.9 (manual command, model/provider/extension/name carry, spec-folder suffix, supersede) on every checked claim except the three findings above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): partial. The four core files match interface-contract sections 4 (record transitions), 7 (wrapper argv/exit codes/130 and decline paths), 9 (killer anchors, lock, timeout) and 11.5-11.9 (manual command, model/provider/extension/name carry, spec-folder suffix, supersede) on every checked claim except the three findings above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial. The four core files match interface-contract sections 4 (record transitions), 7 (wrapper argv/exit codes/130 and decline paths), 9 (killer anchors, lock, timeout) and 11.5-11.9 (manual command, model/provider/extension/name carry, spec-folder suffix, supersede) on every checked claim except the three findings above.

### `targetIsRunning` EPERM behavior: unchanged from the D1 rule-out (no observable outcome change). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `targetIsRunning` EPERM behavior: unchanged from the D1 rule-out (no observable outcome change).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `targetIsRunning` EPERM behavior: unchanged from the D1 rule-out (no observable outcome change).

### `targetIsRunning` EPERM inconsistency: no observable outcome change (see Edge Cases). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `targetIsRunning` EPERM inconsistency: no observable outcome change (see Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `targetIsRunning` EPERM inconsistency: no observable outcome change (see Edge Cases).

### Absence of the pending guard as a P1: the redundant killer exits on the live lock; bounded to P2. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Absence of the pending guard as a P1: the redundant killer exits on the live lock; bounded to P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Absence of the pending guard as a P1: the redundant killer exits on the live lock; bounded to P2.

### Adapter payload injection: previously ruled out (iteration 2); maintainability read surfaced no new shell/eval surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Adapter payload injection: previously ruled out (iteration 2); maintainability read surfaced no new shell/eval surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adapter payload injection: previously ruled out (iteration 2); maintainability read surfaced no new shell/eval surface.

### Adapter shell injection: the static sweep found no shell/eval surface; the two `spawn(` sites are the killer launch path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adapter shell injection: the static sweep found no shell/eval surface; the two `spawn(` sites are the killer launch path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adapter shell injection: the static sweep found no shell/eval surface; the two `spawn(` sites are the killer launch path.

### Contract self-inconsistency (not a code finding): the section 7 opening says "consume, increments hops, cd to the recorded cwd" while the binding amendment says the wrapper changes to the recorded cwd before it consumes. The code follows the amendment; the opening sentence should be reconciled in the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Contract self-inconsistency (not a code finding): the section 7 opening says "consume, increments hops, cd to the recorded cwd" while the binding amendment says the wrapper changes to the recorded cwd before it consumes. The code follows the amendment; the opening sentence should be reconciled in the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Contract self-inconsistency (not a code finding): the section 7 opening says "consume, increments hops, cd to the recorded cwd" while the binding amendment says the wrapper changes to the recorded cwd before it consumes. The code follows the amendment; the opening sentence should be reconciled in the traceability iteration.

### Deferrals carried: SL-205 (mirror link shape), SL-208 (catalog quantitative claims), SL-209 (`tasks.md` T009 README pointers). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deferrals carried: SL-205 (mirror link shape), SL-208 (catalog quantitative claims), SL-209 (`tasks.md` T009 README pointers).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferrals carried: SL-205 (mirror link shape), SL-208 (catalog quantitative claims), SL-209 (`tasks.md` T009 README pointers).

### Dimension is maintainability; traceability was closed in D3 and is not re-run here. Carried status: core `spec_code` partial (sections 11.10-11.11 unread), `checklist_evidence` partial (two evidence pointers fail, T3-P2-001), overlays as recorded in strategy §14. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Dimension is maintainability; traceability was closed in D3 and is not re-run here. Carried status: core `spec_code` partial (sections 11.10-11.11 unread), `checklist_evidence` partial (two evidence pointers fail, T3-P2-001), overlays as recorded in strategy §14.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dimension is maintainability; traceability was closed in D3 and is not re-run here. Carried status: core `spec_code` partial (sections 11.10-11.11 unread), `checklist_evidence` partial (two evidence pointers fail, T3-P2-001), overlays as recorded in strategy §14.

### Dropping non-carried argv on relaunch: documented intended behavior (contract 11.6-11.7); not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Dropping non-carried argv on relaunch: documented intended behavior (contract 11.6-11.7); not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dropping non-carried argv on relaunch: documented intended behavior (contract 11.6-11.7); not a defect.

### Ephemeral artifact labels in code comments: none present (grep evidence above). This direction is closed for the touched files. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ephemeral artifact labels in code comments: none present (grep evidence above). This direction is closed for the touched files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ephemeral artifact labels in code comments: none present (grep evidence above). This direction is closed for the touched files.

### Generated settings drifting from the hook registry: refuted; all six rows match by event, group, slot and async, and the registry declares no other session-relaunch binding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Generated settings drifting from the hook registry: refuted; all six rows match by event, group, slot and async, and the registry declares no other session-relaunch binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generated settings drifting from the hook registry: refuted; all six rows match by event, group, slot and async, and the registry declares no other session-relaunch binding.

### Integration surfaces named this iteration: `.skilled/bin/skilled-loop`, the four nudge adapters, `lib/nudge.cjs`, the Pi extension, the OpenCode plugin, and the two READMEs in scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Integration surfaces named this iteration: `.skilled/bin/skilled-loop`, the four nudge adapters, `lib/nudge.cjs`, the Pi extension, the OpenCode plugin, and the two READMEs in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Integration surfaces named this iteration: `.skilled/bin/skilled-loop`, the four nudge adapters, `lib/nudge.cjs`, the Pi extension, the OpenCode plugin, and the two READMEs in scope.

### Library-level `claimHandoff`/`completeHandoff` without containment: the exported core functions are reached through the CLI that validates first, and the state record's handoff path was validated at `prepare`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Library-level `claimHandoff`/`completeHandoff` without containment: the exported core functions are reached through the CLI that validates first, and the state record's handoff path was validated at `prepare`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Library-level `claimHandoff`/`completeHandoff` without containment: the exported core functions are reached through the CLI that validates first, and the state record's handoff path was validated at `prepare`.

### Pi/OpenCode `notePathFromSeed` accepting the marker anywhere is gated by `isSeedPrompt` before use (`pi:330`, `opencode:337`), so quoted text alone cannot trigger a seed on the message path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Pi/OpenCode `notePathFromSeed` accepting the marker anywhere is gated by `isSeedPrompt` before use (`pi:330`, `opencode:337`), so quoted text alone cannot trigger a seed on the message path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pi/OpenCode `notePathFromSeed` accepting the marker anywhere is gated by `isSeedPrompt` before use (`pi:330`, `opencode:337`), so quoted text alone cannot trigger a seed on the message path.

### PID reuse between the ancestry check and SIGTERM: the window is one synchronous record read; SIGTERM is same-user-bounded and portable Node lacks a pidfd identity check. Residual risk accepted. `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:322]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:336]`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: PID reuse between the ancestry check and SIGTERM: the window is one synchronous record read; SIGTERM is same-user-bounded and portable Node lacks a pidfd identity check. Residual risk accepted. `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:322]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:336]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: PID reuse between the ancestry check and SIGTERM: the window is one synchronous record read; SIGTERM is same-user-bounded and portable Node lacks a pidfd identity check. Residual risk accepted. `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:322]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:336]`.

### README matrix drift on trigger/seed form: the seven rows agree with the wrapper arms and the adapter surfaces read in D3. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: README matrix drift on trigger/seed form: the seven rows agree with the wrapper arms and the adapter surfaces read in D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: README matrix drift on trigger/seed form: the seven rows agree with the wrapper arms and the adapter surfaces read in D3.

### Shell-function ordering or `start_directory` timing in the wrapper: `start_directory` is set before any scan that resolves pi extensions; no defect found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Shell-function ordering or `start_directory` timing in the wrapper: `start_directory` is set before any scan that resolves pi extensions; no defect found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell-function ordering or `start_directory` timing in the wrapper: `start_directory` is set before any scan that resolves pi extensions; no defect found.

### SL-108 adapter payload argv audit: all five spawn sites construct argv arrays and never enable a shell, so the deferred D2 direction is closed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: SL-108 adapter payload argv audit: all five spawn sites construct argv arrays and never enable a shell, so the deferred D2 direction is closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-108 adapter payload argv audit: all five spawn sites construct argv arrays and never enable a shell, so the deferred D2 direction is closed.

### SL-205 mirror link shape: both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate. Deferral closed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: SL-205 mirror link shape: both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate. Deferral closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-205 mirror link shape: both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate. Deferral closed.

### SL-208 catalog drift: no quantitative mismatch found. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: SL-208 catalog drift: no quantitative mismatch found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-208 catalog drift: no quantitative mismatch found.

### SL-209 as a new finding: line 56 resolves; the T009 positions fold into T3-P2-001. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: SL-209 as a new finding: line 56 resolves; the T009 positions fold into T3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-209 as a new finding: line 56 resolves; the T009 positions fold into T3-P2-001.

### SL-406 coverage gap: the suite exercises every named adapter behavior. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: SL-406 coverage gap: the suite exercises every named adapter behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-406 coverage gap: the suite exercises every named adapter behavior.

### SL-502 as a separate finding: the fold is a remediation-scope decision from iteration 5. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: SL-502 as a separate finding: the fold is a remediation-scope decision from iteration 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SL-502 as a separate finding: the fold is a remediation-scope decision from iteration 5.

### The `SESSION_RELAUNCH_THRESHOLD` documented default (0.80) disagreeing with code: refuted; four copies, all 0.8. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The `SESSION_RELAUNCH_THRESHOLD` documented default (0.80) disagreeing with code: refuted; four copies, all 0.8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `SESSION_RELAUNCH_THRESHOLD` documented default (0.80) disagreeing with code: refuted; four copies, all 0.8.

### The catalog's `0.12` live-run sentence as a code drift: it is an operator-set threshold recorded from a live run, not a constant. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The catalog's `0.12` live-run sentence as a code drift: it is an operator-set threshold recorded from a live run, not a constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The catalog's `0.12` live-run sentence as a code drift: it is an operator-set threshold recorded from a live run, not a constant.

### The missing `mk-hook-drift` wrapper on the six session-relaunch rows being drift: refuted by `"fallback": "none"` on exactly those bindings. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The missing `mk-hook-drift` wrapper on the six session-relaunch rows being drift: refuted by `"fallback": "none"` on exactly those bindings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The missing `mk-hook-drift` wrapper on the six session-relaunch rows being drift: refuted by `"fallback": "none"` on exactly those bindings.

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
- Relaunch drops first-launch flags other than model/provider/extensions/name: documented intended behavior (interface-contract.md 11.6-11.7; wrapper test "second invocation uses only the seed and name") (iteration 1).
- targetIsRunning EPERM throw versus isProcessAlive EPERM-alive: no observable outcome because the runtime pid has already exited when a foreign owner can hold it; log-only noise (iteration 1, evidence: killer.cjs:103, killer.cjs:200).
- appendLog O(n) whole-file rewrite cost: bounded by the 10-hop cap and event count; tracked only as part of R1-P2-001 (iteration 1).
- Pi extension start_directory ordering: start_directory is set before the option scan that resolves extension paths (iteration 1, evidence: skilled-loop).
- PID reuse between isLoopAncestor and SIGTERM: the window is one synchronous armed-record read, SIGTERM is same-user-bounded, and portable Node has no pidfd identity check (iteration 2, evidence: killer.cjs:322, killer.cjs:336).
- `SKILLED_LOOP_MANUAL_TEMPLATE` injection: the template is built and exported by skilled-loop, must contain exactly one `@@HANDOFF@@` token, and the seed is escaped before substitution (iteration 2, evidence: skilled-loop:231, relaunch-core.cjs:519).
- Manual-command shell escaping bypass: backslash, double quote, dollar, backtick and bang are escaped in both builders, `spec_folder` is pattern-validated, and the relaunch seed is passed as an argv element (iteration 2, evidence: relaunch-core.cjs:519, skilled-loop:42-46).
- Notification injection through `osascript`: argv spawn plus `JSON.stringify` quoting keeps the handoff path inside the AppleScript string literal (iteration 2).
- `consume`/`should-relaunch` missing a `SKILLED_LOOP_ID` equality check: same-user boundary, robustness rather than a security finding (iteration 2, evidence: session-relaunch.cjs consume/should-relaunch).
- Comment hygiene: no spec paths, ADR/REQ ids, task ids or phase numbers appear in comments across `lib/`, the adapters, the Pi extension or `skilled-loop` (iteration 4, evidence: grep scan).
- Mirror link shape: `.cursor/commands/speckit-handoff.md`, `.claude/commands/speckit/handoff.md` and `.pi/extensions/session-relaunch.ts` are symlinks; `.opencode/plugins/session-relaunch.js` is the regular file and `.skilled/hooks/session-relaunch/opencode/session-relaunch.js` is its symlink (iteration 5, evidence: ls -l and cmp).
- Adapter payload argv: all five killer spawn sites pass argv arrays with no shell, closing SL-108 (iteration 5, evidence: claude/stop-arm.mjs:44, codex/stop-arm.mjs:92, hermes/session-end-arm.mjs:124, pi/session-relaunch.ts:265, opencode/session-relaunch.js:250).
- Process-tree resolver duplication (`findCodexPid`/`findHermesPid`) is folded into the M4-P2-001/M4-P2-003 shared-helper remediation rather than a separate finding (iteration 5).
- Generated-settings drift from the hook registry: all six session-relaunch rows match by event, group, slot and async, and no additional row exists in either generated file (iteration 6, evidence: hook-registry.json:1035, .claude/settings.json:126,192,247, .codex/hooks.json).
- Missing `mk-hook-drift` fallback on the six session-relaunch rows as drift: the registry declares `fallback: none` for exactly those bindings, so the omission is declared behavior (iteration 6).
- A dead `SESSION_RELAUNCH_WINDOW_TOKENS` switch in ENV-REFERENCE: read in production at context-usage.cjs:147,164 (iteration 6).
- `SESSION_RELAUNCH_THRESHOLD`, `SESSION_RELAUNCH_MAX_HOPS` and `SESSION_RELAUNCH_MAX_AGE_MIN` documented defaults disagreeing with code: four `DEFAULT_THRESHOLD` constants are 0.8 and both wrapper defaults are 10 (iteration 6, evidence: claude/context-nudge.mjs:23, codex/shared.mjs:31, hermes/context-nudge.mjs:18, pi/session-relaunch.ts:81, bin/session-relaunch.cjs:372-373).
- `hook-flags.env.example` naming a flag the code never derives: `CONCERN = 'session-relaunch'` derives `SYSTEM_SESSION_RELAUNCH_DISABLED` through hook-flags.cjs:201 (iteration 6).
- SL-208 catalog quantitative drift: no mismatch; 100 ms poll, 3000/30000/5000 killer defaults, five-second lock, zero hop/age acceptance, 10/10 limits and the 200k window default all match their constants (iteration 7, evidence: killer.cjs:11-14,34,35,193, relaunch-core.cjs:384,390,401, session-relaunch.cjs:51,372-373, context-usage.cjs:177).
- SL-209 as a new pointer finding: `tasks.md:56` (T008) resolves to the playbook's four automatable and four live sections; the adjacent T009 `.skilled/hooks/README.md` pointers are all off by position and remain the active T3-P2-001 class (iteration 7, evidence: tasks.md:58, README.md:30,186,278).
- SL-406 OpenCode coverage gap: the 27-test suite covers kill switch, repeated nudge, pending/armed/stale records, zero max age, session isolation, restart, seed lifecycle, window override, Bun spawn and malformed events (iteration 7, evidence: .opencode/plugins/tests/session-relaunch.test.cjs:143,292,731,826).
- SL-502 as a separate duplication finding: `findCodexPid`/`findHermesPid` stay folded at the remediation level into M4-P2-001/M4-P2-003; the shared helper must take the pid resolvers with it or they should be promoted (iteration 7).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis / adjudication (all four dimensions are covered; this was the adversarial re-verification pass). - Focus area: reconcile strategy section 14, the findings registry and the dashboard; no new code direction remains. - Reason: zero new findings and zero severity changes give `newFindingsRatio` 0.0, below the 0.10 convergence threshold; no P0/P1 is active. - Rotation status: post-coverage; dimension rotation complete. - Blocked/productive carry-forward: T3-P2-001 and T3-P2-002 carried (packet docs re-read but not repaired); R2-P2-002 narrowed; SL-208 remains deferred. - Required evidence: reducer-refreshed registry and dashboard, plus the two carried packet-doc findings. - Recovery note: none; iteration state is coherent.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior context from the continuity ladder: the packet is Complete. All four phases validate strict, 26/26 acceptance rows are Met and recursive strict validation passed. The final gate was green: 328 node tests, 62 pytest, 14 Pi vitest, tsc 0, shellcheck 0, sync checks PASS and drift guards at baseline. Earlier cross-model reviews (SWE and Luna) closed every confirmed finding through lanes 9a-9s, so expect residual findings to be subtle.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

- Target pointers: `.skilled/hooks/session-relaunch/` (lib, bin, adapters per runtime, tests), `.skilled/bin/skilled-loop`, `.opencode/plugins/session-relaunch.js`, `.pi/extensions/session-relaunch.ts`, `.hermes/plugins/repo-guards/`, `.skilled/commands/speckit/handoff.md`, the hook registry and generated settings rows, and the docs listed in scope.
- Behavior claims: phase acceptance criteria and `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` sections 11.x (seed format, spec_folder rule, supersede, manual template, killer guards).
- Reuse and conventions: sk-code-opencode JavaScript, shell and TypeScript checklists. Node built-ins only, no build step.
- Review risks and gaps: the killer signals processes, so descendant-only targeting and the SKILLED_LOOP_ID gate are the highest-risk paths. Hermes and Cursor had no live run. The Claude live hop predates the last Claude seed-adapter change.
---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | D1 checked sections 4/7/9/11.5-11.9 on the four core files; D3 re-read section 7 and raised the unresolved consume/cd contradiction as T3-P2-002. Sections 11.10-11.11 remain unread |
| `checklist_evidence` | core | partial | 7 | T3-P2-001 active; T009's three `.skilled/hooks/README.md` pointers are off by position (:28 -> :30, :186 is the task-dispatch row, :274 -> :278) and fold into it. T008's playbook pointer at `tasks.md:56` resolves (4 automatable + 4 live sections). Run-ledger receipts outside the packet were not re-verified |
| `skill_agent` | overlay | partial | 3 | Six `/speckit:handoff` surfaces exist and agree on the canonical `.skilled/commands/speckit/handoff.md`; per-command body routing not traced to the CLI |
| `agent_cross_runtime` | overlay | pass | 6 | Three Claude and three Codex bindings match the registry by event, group, slot, async flag and declared `fallback: none`; Pi extension registered; Cursor and Devin carry no bindings, consistent with COMMAND-ONLY. Re-verified at the row level in D6 |
| `feature_catalog_code` | overlay | pass | 7 | SL-208 discharged: session-id regex, +0.05 re-nudge, Claude event surface, Devin seed form, 100 ms poll, 3000/30000/5000 killer defaults, zero hop/age acceptance and the 200k window default all match code; the `0.12` sentence is a recorded live-run observation |
| `playbook_capability` | overlay | partial | 7 | Four documented relaunch argv forms match the wrapper arms and `skilled-loop.test.cjs:120-124`; live-run claims not re-exercised; the playbook's exit-contract sentence is F7-P2-001 |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .claude/commands/speckit/handoff.md | - | - | - | pending |
| .claude/hooks/README.md | - | - | - | pending |
| .claude/hooks/context-nudge.mjs | - | - | - | pending |
| .claude/hooks/stop-arm.mjs | - | - | - | pending |
| .claude/settings.json | - | - | - | pending |
| .codex/hooks.json | - | - | - | pending |
| .codex/hooks/README.md | - | - | - | pending |
| .codex/hooks/context-nudge.mjs | - | - | - | pending |
| .codex/hooks/prompt-seed.mjs | - | - | - | pending |
| .codex/hooks/stop-arm.mjs | - | - | - | pending |
| .codex/prompts/speckit-handoff.md | - | - | - | pending |
| .cursor/commands/speckit-handoff.md | - | - | - | pending |
| .hermes/SYNC.md | - | - | - | pending |
| .hermes/plugins/repo-guards/__init__.py | - | - | - | pending |
| .hermes/plugins/repo-guards/plugin.yaml | - | - | - | pending |
| .hermes/plugins/repo-guards/tests/test_repo_guards.py | - | - | - | pending |
| .hermes/plugins/repo-guards/tests/test_session_relaunch.py | - | - | - | pending |
| .hermes/prompts/speckit-handoff.md | - | - | - | pending |
| .opencode/plugins/README.md | - | - | - | pending |
| .opencode/plugins/session-relaunch.js | - | - | - | pending |
| .opencode/plugins/tests/session-relaunch.test.cjs | - | - | - | pending |
| .pi/extensions/session-relaunch.ts | - | - | - | pending |
| .pi/prompts/speckit-handoff.md | - | - | - | pending |
| .pi/types/node-globals.d.ts | - | - | - | pending |
| .pi/types/pi-coding-agent.d.ts | - | - | - | pending |
| .skilled/bin/README.md | - | - | - | pending |
| .skilled/bin/skilled-loop | - | - | - | pending |
| .skilled/commands/README.txt | - | - | - | pending |
| .skilled/commands/speckit/README.txt | - | - | - | pending |
| .skilled/commands/speckit/handoff.md | - | - | - | pending |
| .skilled/hooks/README.md | - | - | - | pending |
| .skilled/hooks/hook-flags.env.example | - | - | - | pending |
| .skilled/hooks/injection-contract.md | - | - | - | pending |
| .skilled/hooks/session-relaunch/README.md | - | - | - | pending |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/prompt-seed.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/shared.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/stop-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/hermes/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/killer.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/opencode/session-relaunch.js | - | - | - | pending |
| .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts | - | - | - | pending |
| .skilled/hooks/session-relaunch/pi/session-relaunch.ts | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/context-usage.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-rollout-token-count.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-spawn-recorder.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-user-prompt-submit.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-end.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-finalize.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-start.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-post-api-request.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-api-request.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-verify.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-usage.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/opencode-assistant-message-updated.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-post-tool-use.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-user-prompt-submit.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/transcript-usage.jsonl | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/nudge.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts | - | - | - | pending |
| AGENTS.md | - | - | - | pending |
| README.md | - | - | - | pending |
| tsconfig.pi.json | - | - | - | pending |
<!-- MACHINE-OWNED: END -->
---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Stop policy: convergence
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-18T12:41:21.177Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Executor: cli-pi, model deepseek-v4.1-flash (DevPass llmgateway), thinking max
- Started: 2026-10-18T12:41:21.177Z
<!-- MACHINE-OWNED: END -->
---
