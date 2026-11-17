---
title: Deep Review Strategy - render-hooks-plugin lineage (pass two)
description: Session tracking for the render-hooks-plugin pass-two fan-out lineage of the command-surfacing review.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `render-hooks-plugin` pass-two fan-out lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- Read by the executor at every iteration.
- Updated in place after each iteration; machine-owned blocks stay inside their anchors.

---

## 2. TOPIC

Pass-two code review of command surfacing for the `render-hooks-plugin` area of
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.
Scope files are the `render-hooks-plugin` rows of `review/review-scope-2.txt`
(59 files), plus shared docs that describe them
(`.skilled/agents/orchestrate.md`, `.skilled/skills/sk-doc/*`,
`system-skill-advisor` root docs and runtime READMEs).

Pass one is closed. Its 43 findings, verdicts and fixes are in
`review/review-report-pass-1.md`; section 3.1 is the table and section 8 the
deferred items. This lineage checks that the pass-one fixes in its area hold,
reviews every file marked `yes` in `review-scope-2.txt` line by line, and then
looks for new defects.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- Implementing or editing any reviewed file. The review is observation-only.
- Re-reporting a pass-one finding whose fix holds, a deferred item from the
  pass-one report section 8, R4-P2-003 (an AGENTS.md edit that waits on the
  operator) or the refuted finding.
- Reading or reproducing holdout prompt text. Counts only.
- Reviewing areas owned by sibling lineages (`scorer-attach`, `accuracy-runner`,
  `doctor-install`) beyond the shared docs that describe this area's surfaces.

---

## 5. STOP CONDITIONS

- Convergence threshold 0.1 on the weighted new-findings ratio, minimum 2 iterations, stop policy `convergence`.
- Hard ceiling `maxIterations = 7`.
- A P0 that would need immediate operator action ends the loop early with `FAIL` and an escalation note.

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
- Resolved: 1

<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED

- Reading the committed diff of each pass-one fix against its owning test, rather than the old report text, showed all three `render.ts` fixes intact in one pass (iteration 1). The deleted 35-entry `DOCTOR_COMMAND_STRINGS` map could have silently dropped a doctor bridge; a key-set comparison against `COMMAND_ROWS` proved it did not.
- Comparing duplicate command strings in `COMMAND_ROWS` before trusting the new class lookup avoided a false finding (iteration 1): the only two duplicates carry the same class.
- Measuring the CLI with and without the new compiled-route request settled a latency suspicion with numbers (88-98 ms vs 134-160 ms warm) instead of inference (iteration 2).

---

## 9. WHAT FAILED

- Treating the new stderr cap as a pure win missed its cost until the test itself showed the busy marker disappearing past the cap (iteration 2). Reading the test's own assertion is what surfaced finding 2.
- Withdrawing `iter2-P2-hook-health-doc-scope` in iteration 4 after checking the Codex/Cursor/Devin shims kept the report honest: a doc claim about "hook runs" does not cover the OpenCode plugin's separate delivery path (iteration 4).

---

## 18. SYNTHESIS

Synthesis completed at 2026-11-13T12:10:58Z with stop reason `converged`: verdict PASS, hasAdvisories true, 0 P0, 0 P1, 5 active P2, 1 resolved, release-readiness `converged`. The lineage report is `review-report.md` in this directory. The merge reads `deep-review-findings-registry.json` for the authoritative counts.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`getStatus` reporting an inert flag is harmless.** It is harmless to the brief, but it is the observable half of finding 1 and is cited there, not as a separate finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`getStatus` reporting an inert flag is harmless.** It is harmless to the brief, but it is the observable half of finding 1 and is cited there, not as a separate finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`getStatus` reporting an inert flag is harmless.** It is harmless to the brief, but it is the observable half of finding 1 and is cited there, not as a separate finding.

### **`metadataSkillLabel` can leak a row id into a `needs a mode` head.** It reads `sharedPayload.metadata.skillLabel` only (`render.ts:315-318`); the golden `needs a mode` case exercises the fallback chain without that field and asserts no `command-` prefix. No reachable producer sets it to a row id. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`metadataSkillLabel` can leak a row id into a `needs a mode` head.** It reads `sharedPayload.metadata.skillLabel` only (`render.ts:315-318`); the golden `needs a mode` case exercises the fallback chain without that field and asserts no `command-` prefix. No reachable producer sets it to a row id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`metadataSkillLabel` can leak a row id into a `needs a mode` head.** It reads `sharedPayload.metadata.skillLabel` only (`render.ts:315-318`); the golden `needs a mode` case exercises the fallback chain without that field and asserts no `command-` prefix. No reachable producer sets it to a row id.

### **`readSession` dropping `injected` hides a fix.** The README states the split (`README.md:31`), and the two consumers that need injection text use the raw `loadSession` path. No caller is left guessing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`readSession` dropping `injected` hides a fix.** The README states the split (`README.md:31`), and the two consumers that need injection text use the raw `loadSession` path. No caller is left guessing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`readSession` dropping `injected` hides a fix.** The README states the split (`README.md:31`), and the two consumers that need injection text use the raw `loadSession` path. No caller is left guessing.

### **`recommendationFromCli` loses an unknown `kind`.** It maps anything outside `skill`/`command` to `skill` (`:369-371`), which is the documented behavior and the safe default for a renderer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`recommendationFromCli` loses an unknown `kind`.** It maps anything outside `skill`/`command` to `skill` (`:369-371`), which is the documented behavior and the safe default for a renderer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`recommendationFromCli` loses an unknown `kind`.** It maps anything outside `skill`/`command` to `skill` (`:369-371`), which is the documented behavior and the safe default for a renderer.

### **A missing policy word makes a command unprintable.** `policyWord` returns `null` for `policy === undefined` and the head prints `owner → command` without a parenthesis; the golden case at `command-brief-golden.vitest.ts:130-141` pins it. Not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A missing policy word makes a command unprintable.** `policyWord` returns `null` for `policy === undefined` and the head prints `owner → command` without a parenthesis; the golden case at `command-brief-golden.vitest.ts:130-141` pins it. Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing policy word makes a command unprintable.** `policyWord` returns `null` for `policy === undefined` and the head prints `owner → command` without a parenthesis; the golden case at `command-brief-golden.vitest.ts:130-141` pins it. Not a defect.

### **A seventh iteration would find something new.** The remaining unread artifacts are generated declaration maps and tests already read; the changed set is exhausted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A seventh iteration would find something new.** The remaining unread artifacts are generated declaration maps and tests already read; the changed set is exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A seventh iteration would find something new.** The remaining unread artifacts are generated declaration maps and tests already read; the changed set is exhausted.

### **Any of the five open findings is a P0/P1.** Each is advisory: no data loss on a default path, no security boundary crossed, and each has a named concrete input. Verdict PASS. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Any of the five open findings is a P0/P1.** Each is advisory: no data loss on a default path, no security boundary crossed, and each has a named concrete input. Verdict PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any of the five open findings is a P0/P1.** Each is advisory: no data loss on a default path, no security boundary crossed, and each has a named concrete input. Verdict PASS.

### **Devin's fallback masks `session_not_found`.** A missing transcript after a damaged database is the `store_unreadable` case the README names; the database failure is the primary condition. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Devin's fallback masks `session_not_found`.** A missing transcript after a damaged database is the `store_unreadable` case the README names; the database failure is the primary condition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Devin's fallback masks `session_not_found`.** A missing transcript after a damaged database is the `store_unreadable` case the README names; the database failure is the primary condition.

### **Removing the compiled-route summary line drops a documented feature.** The plugin README describes `lib/skill-advisor-render.js` as the fallback and compiled-route renderers "shared by the advisor plugin and its tests" (`README.md:76`); the fallback half is still shared, so the sentence is not false. The dead renderer itself sits outside this area's changed set and is noted as an affected surface of finding 1 rather than a separate finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Removing the compiled-route summary line drops a documented feature.** The plugin README describes `lib/skill-advisor-render.js` as the fallback and compiled-route renderers "shared by the advisor plugin and its tests" (`README.md:76`); the fallback half is still shared, so the sentence is not false. The dead renderer itself sits outside this area's changed set and is noted as an affected surface of finding 1 rather than a separate finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing the compiled-route summary line drops a documented feature.** The plugin README describes `lib/skill-advisor-render.js` as the fallback and compiled-route renderers "shared by the advisor plugin and its tests" (`README.md:76`); the fallback half is still shared, so the sentence is not false. The dead renderer itself sits outside this area's changed set and is noted as an affected surface of finding 1 rather than a separate finding.

### **The catalog's `command` field claim overstates the schema.** `command: z.string().min(1).optional()` exists at `advisor-tool-schemas.ts:321`; only its citation is wrong. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The catalog's `command` field claim overstates the schema.** `command: z.string().min(1).optional()` exists at `advisor-tool-schemas.ts:321`; only its citation is wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog's `command` field claim overstates the schema.** `command: z.string().min(1).optional()` exists at `advisor-tool-schemas.ts:321`; only its citation is wrong.

### **The documented `includeCompiledRoute` default contradicts the hook's explicit `true`.** Not a contradiction: the option defaults to true and the hook states its explicit value and why, in both `claude-hook.md:26` and `skill-advisor-hook.md:38`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The documented `includeCompiledRoute` default contradicts the hook's explicit `true`.** Not a contradiction: the option defaults to true and the hook states its explicit value and why, in both `claude-hook.md:26` and `skill-advisor-hook.md:38`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The documented `includeCompiledRoute` default contradicts the hook's explicit `true`.** Not a contradiction: the option defaults to true and the hook states its explicit value and why, in both `claude-hook.md:26` and `skill-advisor-hook.md:38`.

### **The DSH decoder/reader path split is a new defect.** `decodeSessionLog` selected its format from the locator name before this change too; the fix changed only which path's bytes are read. A mismatched link extension fails identically on the base commit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The DSH decoder/reader path split is a new defect.** `decodeSessionLog` selected its format from the locator name before this change too; the fix changed only which path's bytes are read. A mismatched link extension fails identically on the base commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The DSH decoder/reader path split is a new defect.** `decodeSessionLog` selected its format from the locator name before this change too; the fix changed only which path's bytes are read. A mismatched link extension fails identically on the base commit.

### **The health record's new fields break older consumers.** `AdvisorHookHealthSection` is a structural type read by `advisor-status.ts`; adding fields cannot break a reader that ignores them, and the record validator treats `degraded` as optional. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The health record's new fields break older consumers.** `AdvisorHookHealthSection` is a structural type read by `advisor-status.ts`; adding fields cannot break a reader that ignores them, and the record validator treats `degraded` as optional.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The health record's new fields break older consumers.** `AdvisorHookHealthSection` is a structural type read by `advisor-status.ts`; adding fields cannot break a reader that ignores them, and the record validator treats `degraded` as optional.

### **The hook's health record misses a prompt path.** All six emit sites precede their returns, so skipped, delivered, fallback and exception paths all persist. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The hook's health record misses a prompt path.** All six emit sites precede their returns, so skipped, delivered, fallback and exception paths all persist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hook's health record misses a prompt path.** All six emit sites precede their returns, so skipped, delivered, fallback and exception paths all persist.

### **The new compiled-route request leaks the prompt.** `enrichCompiledRoutes` receives the prompt inside the already-spawned CLI; it adds no new transport. The env and argv surfaces are unchanged. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The new compiled-route request leaks the prompt.** `enrichCompiledRoutes` receives the prompt inside the already-spawned CLI; it adds no new transport. The env and argv surfaces are unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The new compiled-route request leaks the prompt.** `enrichCompiledRoutes` receives the prompt inside the already-spawned CLI; it adds no new transport. The env and argv surfaces are unchanged.

### **The new scan over `COMMAND_ROWS` is a hot-path cost.** 54 rows, one pass per rendered head, on a prompt-time path that already runs a scorer; no measurement justifies a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The new scan over `COMMAND_ROWS` is a hot-path cost.** 54 rows, one pass per rendered head, on a prompt-time path that already runs a scorer; no measurement justifies a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The new scan over `COMMAND_ROWS` is a hot-path cost.** 54 rows, one pass per rendered head, on a prompt-time path that already runs a scorer; no measurement justifies a finding.

### **The OpenCode plugin's missing health record is a doc defect.** Withdrawn above: the changed sentence is about hook runs, and the plugin is a separate delivery path with its own playbook step. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The OpenCode plugin's missing health record is a doc defect.** Withdrawn above: the changed sentence is about hook runs, and the plugin is a separate delivery path with its own playbook step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The OpenCode plugin's missing health record is a doc defect.** Withdrawn above: the changed sentence is about hook runs, and the plugin is a separate delivery path with its own playbook step.

### **The plugin's orphaned summary changes the emitted brief.** It is stored on the internal metadata object and never reaches `output.system`; the only cost is the per-prompt build recorded in finding 1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The plugin's orphaned summary changes the emitted brief.** It is stored on the internal metadata object and never reaches `output.system`; the only cost is the per-prompt build recorded in finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The plugin's orphaned summary changes the emitted brief.** It is stored on the internal metadata object and never reaches `output.system`; the only cost is the per-prompt build recorded in finding 1.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile the lineage report from the registry and the six iterations; no further code review. - Reason: convergence reached with all four dimensions covered and five active P2 advisories. - Rotation status: all four dimensions complete. - Blocked/productive carry-forward: none. - Required evidence: the reducer-owned registry, the six iteration files and their deltas. Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 59 `render-hooks-plugin` rows of `review/review-scope-2.txt`, chiefly `.opencode/plugins/system-skill-advisor.js`, `.skilled/hooks/shared/session-readers/*`, `.skilled/skills/system-skill-advisor/hooks/*`, `.skilled/skills/system-skill-advisor/runtime/lib/{render,subprocess,metrics}.ts`, the runtime tests for those surfaces, the runtime-mirror scripts and `AGENTS.md`.
- Behavior claims: the hook/plugin renders a command brief per runtime; the child-session downgrade is `(parent-named only)`; stdout/stderr are capped; session readers fall back to the transcript; runtime mirrors are generated.
- Reuse and conventions: `sk-code-review/references/review-core.md` severity doctrine; pass-one report section 3.1 fixes and section 8 deferred items.
- Review risks and gaps: the worktree's compiled dist may be stale; test execution must not write outside the lineage (vitest cache is repository-local, so runs are read-only observations of source under review only when they do not mutate tracked files).

---

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | - |

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | - | - | - | pending |
| `.skilled/hooks/shared/session-readers/*.mjs` | - | - | - | pending |
| `.opencode/plugins/system-skill-advisor.js` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | - | - | - | pending |

---

## 16. REVIEW BOUNDARIES

- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-render-hooks-plugin-2-1794570021136-noekp0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T12:40:00.000Z
