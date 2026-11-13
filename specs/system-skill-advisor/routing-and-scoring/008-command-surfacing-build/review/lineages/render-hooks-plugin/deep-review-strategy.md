---
title: Deep Review Strategy - render-hooks-plugin lineage
description: Session tracking for the render-hooks-plugin fan-out lineage of the command-surfacing review.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `render-hooks-plugin` fan-out lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- Read by the executor at every iteration.
- Updated in place after each iteration; machine-owned blocks stay inside their markers.

---

## 2. TOPIC

Review of command surfacing for the `render-hooks-plugin` area of
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.
Scope files are the `render-hooks-plugin` rows of `review/review-scope.txt` (53 files),
plus shared docs that describe them (`.skilled/agents/orchestrate.md`,
`.skilled/skills/sk-doc/*`, `system-skill-advisor` root docs).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Implementing or editing any reviewed file. The review is observation-only.
- Re-tuning the advisor scorer, embedders or the command corpus.
- Reading or reproducing holdout prompt text. Counts only.
- Reviewing areas owned by the sibling lineages (`scorer-attach`, `accuracy-runner`, `doctor-install`) beyond the shared docs that describe this area's surfaces.

---

## 5. STOP CONDITIONS

- Convergence threshold 0.1 on the weighted new-findings ratio, minimum 2 iterations, stop policy `convergence`.
- Hard ceiling `maxIterations = 5`.
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
- P2 (Suggestions): 11
- Resolved: 2

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading each session reader against its own test file surfaced contract drift faster than reading the reader alone (iteration 1).
- Following the hook path from the plugin into `hooks/lib/skill-advisor-cli-fallback.ts` found the degraded-mode contract in one pass (iteration 1).
- Mapping the operator's six runtime names onto four concrete reader files and one dispatcher prevented a generic cross-runtime finding (iteration 2).
- Pairing every document claim with the code it names, one row per claim, turned an open-ended "do the docs match" question into a finite table (iteration 3).
- Comparing the runtime tuple with every other list of runtime names found the one copy no test covers (iteration 4).
- Re-reading each active finding's cited line before closing it caught two entries that documentary evidence no longer supported (iteration 5).

---

## 9. WHAT FAILED

- Treating `.d.mts` declaration files as independent evidence produced only "consistent by construction" results (iteration 1).
- Assuming the plugin README describes runtime coverage; it documents hooks, not per-runtime readers (iteration 2).
- Reading `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` as a dead knob: it is live in `subprocess.ts:119`, and the README line was about the hub rather than the plugin (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`.opencode/plugins/README.md:177` documents a variable the plugin never reads, so the knob is dead": ruled out. The variable is read by `runtime/lib/subprocess.ts:119`, which the same line names as a consumer; the README's sentence is about the hub, not about the plugin. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "`.opencode/plugins/README.md:177` documents a variable the plugin never reads, so the knob is dead": ruled out. The variable is read by `runtime/lib/subprocess.ts:119`, which the same line names as a consumer; the README's sentence is about the hub, not about the plugin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`.opencode/plugins/README.md:177` documents a variable the plugin never reads, so the knob is dead": ruled out. The variable is read by `runtime/lib/subprocess.ts:119`, which the same line names as a consumer; the README's sentence is about the hub, not about the plugin.

### "`decodeSessionLog` silently truncates a log": ruled out. `dsh.mjs:52-80` throws on a truncated frame header or block, and `:94` throws on an unknown magic; only a 1-3 byte tail that cannot be a frame is skipped. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`decodeSessionLog` silently truncates a log": ruled out. `dsh.mjs:52-80` throws on a truncated frame header or block, and `:94` throws on an unknown magic; only a 1-3 byte tail that cannot be a frame is skipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`decodeSessionLog` silently truncates a log": ruled out. `dsh.mjs:52-80` throws on a truncated frame header or block, and `:94` throws on an unknown magic; only a 1-3 byte tail that cannot be a frame is skipped.

### "`spec-gate-core.mjs` duplicates the advisor's render logic": ruled out. The overlap is the child marker alone (finding 2), and the core's receipt and sweep code has no counterpart in the advisor tree. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`spec-gate-core.mjs` duplicates the advisor's render logic": ruled out. The overlap is the child marker alone (finding 2), and the core's receipt and sweep code has no counterpart in the advisor tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`spec-gate-core.mjs` duplicates the advisor's render logic": ruled out. The overlap is the child marker alone (finding 2), and the core's receipt and sweep code has no counterpart in the advisor tree.

### "`sync-gate1-pointers.cjs` writes a third block": ruled out. It defines two end markers (`:25`, `:27`) and one source file (`:28`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "`sync-gate1-pointers.cjs` writes a third block": ruled out. It defines two end markers (`:25`, `:27`) and one source file (`:28`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`sync-gate1-pointers.cjs` writes a third block": ruled out. It defines two end markers (`:25`, `:27`) and one source file (`:28`).

### "A command the brief offers can start itself": ruled out. The brief is text pushed into `output.system`; nothing in the plugin or the hook executes a command it renders. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A command the brief offers can start itself": ruled out. The brief is text pushed into `output.system`; nothing in the plugin or the hook executes a command it renders.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A command the brief offers can start itself": ruled out. The brief is text pushed into `output.system`; nothing in the plugin or the hook executes a command it renders.

### "A recommendation can relabel a mutating command as `read-only` to escape the child downgrade": ruled out. `command-attach.ts:50-51` is the only `mutating` vocabulary, `render.ts:233` reads it from the generated row, and the CLI response has no `mutating` field (verified against `skill-advisor-cli-fallback.ts:228-245` and `advisor-recommend.ts:356-359`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A recommendation can relabel a mutating command as `read-only` to escape the child downgrade": ruled out. `command-attach.ts:50-51` is the only `mutating` vocabulary, `render.ts:233` reads it from the generated row, and the CLI response has no `mutating` field (verified against `skill-advisor-cli-fallback.ts:228-245` and `advisor-recommend.ts:356-359`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A recommendation can relabel a mutating command as `read-only` to escape the child downgrade": ruled out. `command-attach.ts:50-51` is the only `mutating` vocabulary, `render.ts:233` reads it from the generated row, and the CLI response has no `mutating` field (verified against `skill-advisor-cli-fallback.ts:228-245` and `advisor-recommend.ts:356-359`).

### "An env-secret value reaches the advisor through argv": ruled out. The payload is written to stdin. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "An env-secret value reaches the advisor through argv": ruled out. The payload is written to stdin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "An env-secret value reaches the advisor through argv": ruled out. The payload is written to stdin.

### "Declaration files disagree with their implementations": ruled out as a review direction — the `.d.mts` bodies are type-only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Declaration files disagree with their implementations": ruled out as a review direction — the `.d.mts` bodies are type-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Declaration files disagree with their implementations": ruled out as a review direction — the `.d.mts` bodies are type-only.

### "Holdout rows reach a tune, fix or report path in this area": ruled out, twice. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Holdout rows reach a tune, fix or report path in this area": ruled out, twice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Holdout rows reach a tune, fix or report path in this area": ruled out, twice.

### "Session readers re-read the whole transcript on every call": ruled out. `claude.mjs:228-232` and `pi.mjs:261-266` parse a single file per call and `pi.mjs:56-65` probes only a bounded 64 KiB header prefix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Session readers re-read the whole transcript on every call": ruled out. `claude.mjs:228-232` and `pi.mjs:261-266` parse a single file per call and `pi.mjs:56-65` probes only a bounded 64 KiB header prefix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Session readers re-read the whole transcript on every call": ruled out. `claude.mjs:228-232` and `pi.mjs:261-266` parse a single file per call and `pi.mjs:56-65` probes only a bounded 64 KiB header prefix.

### "The child downgrade is inverted for a read-only `run`": ruled out. `parentNamedOnly` returns false for `run` with `read-only`, which is the intended full-visibility case. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The child downgrade is inverted for a read-only `run`": ruled out. `parentNamedOnly` returns false for `run` with `read-only`, which is the intended full-visibility case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The child downgrade is inverted for a read-only `run`": ruled out. `parentNamedOnly` returns false for `run` with `read-only`, which is the intended full-visibility case.

### "The hook fallback leaves an advisor grandchild running after a timeout": ruled out. `skill-advisor-cli-fallback.ts:279-292` kills the process group. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The hook fallback leaves an advisor grandchild running after a timeout": ruled out. `skill-advisor-cli-fallback.ts:279-292` kills the process group.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hook fallback leaves an advisor grandchild running after a timeout": ruled out. `skill-advisor-cli-fallback.ts:279-292` kills the process group.

### "The manifest restates the CLI schema": ruled out. The manifest is derived at `:189`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The manifest restates the CLI schema": ruled out. The manifest is derived at `:189`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The manifest restates the CLI schema": ruled out. The manifest is derived at `:189`.

### "The plugin passes the raw CLI stdout into model context": ruled out. `cliRecommendations` (`system-skill-advisor.js:558-591`) copies only `skillId`, numeric scores, `command`, `policy`, `ownerSkillId`, `needsMode` and `ambiguousWith`, each type-checked. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The plugin passes the raw CLI stdout into model context": ruled out. `cliRecommendations` (`system-skill-advisor.js:558-591`) copies only `skillId`, numeric scores, `command`, `policy`, `ownerSkillId`, `needsMode` and `ambiguousWith`, each type-checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The plugin passes the raw CLI stdout into model context": ruled out. `cliRecommendations` (`system-skill-advisor.js:558-591`) copies only `skillId`, numeric scores, `command`, `policy`, `ownerSkillId`, `needsMode` and `ambiguousWith`, each type-checked.

### "The plugin re-implements the brief renderer": ruled out. `.opencode/plugins/lib/skill-advisor-render.js` carries the fallback and compiled-route renderers only, and the plugin consumes the CLI-rendered `brief` (`system-skill-advisor.js:1554-1557`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The plugin re-implements the brief renderer": ruled out. `.opencode/plugins/lib/skill-advisor-render.js` carries the fallback and compiled-route renderers only, and the plugin consumes the CLI-rendered `brief` (`system-skill-advisor.js:1554-1557`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The plugin re-implements the brief renderer": ruled out. `.opencode/plugins/lib/skill-advisor-render.js` carries the fallback and compiled-route renderers only, and the plugin consumes the CLI-rendered `brief` (`system-skill-advisor.js:1554-1557`).

### "The plugin reads the prompt from the session on every turn": ruled out. `system-skill-advisor.js:1473` fetches session messages only when `extractPrompt` returned nothing. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The plugin reads the prompt from the session on every turn": ruled out. `system-skill-advisor.js:1473` fetches session messages only when `extractPrompt` returned nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The plugin reads the prompt from the session on every turn": ruled out. `system-skill-advisor.js:1473` fetches session messages only when `extractPrompt` returned nothing.

### "The recommendation contract documents `mutating` under another name": ruled out. `advisor-recommend.md:41-47` names four fields and `command-attach.ts:50-51` has five. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The recommendation contract documents `mutating` under another name": ruled out. `advisor-recommend.md:41-47` names four fields and `command-attach.ts:50-51` has five.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The recommendation contract documents `mutating` under another name": ruled out. `advisor-recommend.md:41-47` names four fields and `command-attach.ts:50-51` has five.

### "The runtime tuple and the hook reference table disagree": ruled out. `advisor-runtime-list-parity.vitest.ts:100-128` would fail. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The runtime tuple and the hook reference table disagree": ruled out. `advisor-runtime-list-parity.vitest.ts:100-128` would fail.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The runtime tuple and the hook reference table disagree": ruled out. `advisor-runtime-list-parity.vitest.ts:100-128` would fail.

### "The session-reader README overstates the injected guarantee": ruled out. All four readers return `injected` and `readSession` ignores it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The session-reader README overstates the injected guarantee": ruled out. All four readers return `injected` and `readSession` ignores it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The session-reader README overstates the injected guarantee": ruled out. All four readers return `injected` and `readSession` ignores it.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

The reducer consolidates each iteration's ruled-out direction into §9 above, one entry per direction with its evidence line. No direction was ruled out twice, and no ruled-out direction was revisited.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis. - Reason: all four dimensions are covered, one dimension of adjudication is complete, and no active P0 or P1 remains. Further discovery would exceed `maxIterations = 5`. - Rotation status: complete. - Blocked/productive carry-forward: nothing blocked except the coverage gaps listed under Edge Cases. - Required evidence: the report's active registry must reproduce the eleven confirmed P2 entries and the two closures above. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 53 `render-hooks-plugin` rows of `review/review-scope.txt`. The area is the hook/plugin rendering surface: `.opencode/plugins/system-skill-advisor.js`, `.skilled/hooks/shared/session-readers/*` (`claude`, `devin`, `dsh`, `pi`, `index`), the advisor runtime render/embedder/subprocess modules, the advisor CLI, and the runtime-mirror sync scripts.
- Behaviour claims to verify: the advise hook must offer at most one command and must never auto-run a mutating command; each runtime reader must be isolated so one runtime's transcript cannot inject text into another's brief; holdout rows are never read by tune/fix/report paths.
- Reuse and conventions: `sk-code` review doctrine; `system-deep-loop` deep-review packet; the sibling lineages own scorer, accuracy-runner and doctor-install surfaces.
- Review risks and gaps: no `resource-map.md` at init, so the coverage gate is skipped; `codex` has no session reader in this area, so its behaviour is evidenced through the plugin/CLI path only.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 5 | Offer contract, degraded path, failure envelope and timeout variable all match their code paths; the one drift is R3-P2-001. |
| `checklist_evidence` | core | notApplicable | 5 | No checklist rows exist for this area. |
| `skill_agent` | overlay | partial | 5 | `skill-advisor-hook.md:88` names the Claude shim chain; the source half resolves, the dist half was not read. |
| `agent_cross_runtime` | overlay | pass | 4 | Six adapters plus one plugin; seven runtimes in the tuple and the same seven in the capability table. |
| `feature_catalog_code` | overlay | pass | 3 | Compiled-route options, one-command-per-label and the typed-command degraded entry confirmed. |
| `playbook_capability` | overlay | notApplicable | 5 | No manual-testing playbook row covers this area. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/plugins/system-skill-advisor.js` | D1, D2, D3 | 3 | 0 P0, 1 P1 (closed), 1 P2 | reviewed |
| `.opencode/plugins/README.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/index.mjs` | D1, D2, D4 | 4 | 0 P0, 0 P1, 2 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/claude.mjs` | D1, D2 | 2 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/pi.mjs` | D1 | 1 | clean | reviewed |
| `.skilled/hooks/shared/session-readers/devin.mjs` | D1, D2 | 2 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/dsh.mjs` | D1, D2 | 2 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/hooks/shared/session-readers/README.md` | D3 | 3 | clean | reviewed |
| `.skilled/hooks/shared/tests/session-readers/injected-text.test.mjs` | D1, D4 | 4 | one uncovered branch (R1-P2-003) | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | D1, D2, D3 | 5 | 0 P0, 0 P1, 2 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | D2, D4 | 4 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | D2, D3 | 3 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | D2 | 2 | clean | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | D3 | 3 | clean | reviewed (degraded path) |
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts` | D4 | 4 | clean | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2 | 2 | producer context | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts` | D4 | 4 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | D4 | 4 | clean | reviewed |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | D3 | 3 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | D3 | 3 | 0 P0, 0 P1, 1 P2 | reviewed |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | D4 | 4 | 0 P0, 0 P1, 1 P2 | partial (`:71-310`) |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs` | D3 | 3 | clean | reviewed |
| `AGENTS.md` | D3, D4 | 4 | 0 P0, 0 P1, 1 P2 | reviewed (Gate 2 section) |
| remaining 30 scope files | - | - | - | not read (see Deferred Items) |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-render-hooks-plugin-1794550137809-1ecgc7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T06:12:00.000Z
<!-- MACHINE-OWNED: END -->
