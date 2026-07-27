# Research: cli-devin and cli-cursor Hook Adapter Refinements, Hardening, and Dedup Opportunities

## Executive Summary

This deep-research run (generation 2, session `research-cli-hook-adapters-2026-07-27`, executor `cli-opencode`/`openai/gpt-5.6-sol` reasoning-effort `high`, 5 forced iterations under `--stop-policy=max-iterations`) investigated six questions about the `cli-devin` and `cli-cursor` hook adapter layers now that Devin's hooks are confirmed to fire live and Cursor's independent hook layer is wired.

**Only two of the six questions received substantive investigation.** Iteration 1 fully answered Q1 (coverage-gap inventory). Iterations 2 through 5 all converged back onto Q2 (Devin field-fallback hardening) instead of advancing to Q3-Q6 as the strategy's "Next Focus" instructed after iteration 1 — each pass deepened and, in one case (iteration 5), **corrected a materially wrong safety claim** made by the immediately preceding iteration. Q3 (PermissionRequest/PostCompaction live-verification), Q4 (`mcp-route-guard.cjs` dormancy), Q5 (upstream Devin/Cursor feature drift), and Q6 (cross-packet dedup opportunities) were **not investigated in this run** and remain fully open. This is reported honestly rather than papered over — see §6 and §10.

The single highest-value finding is a **safety correction**, not a new capability: iteration 4 claimed that losing a `spec-gate-enforce.mjs` path alias (`filePath`/`path`) would stay "enforcement-conservative" (fail toward deny/advise). Iteration 5 re-read `spec-gate-core.mjs` and proved the opposite — `isExemptTargetPath()` treats a missing/blank path as **exempt** (`return true`), and `evaluateMutation()` treats an exempt non-bash target as **allow**. Removing a still-load-bearing path alias would therefore silently convert a would-be gated edit into an unconditional allow. This has been independently re-verified against `spec-gate-core.mjs:751,906-970` during synthesis of this report (see §5 F2, §7).

---

## 1. OVERVIEW & SCOPE

### Purpose

Determine what further hook refinements, upgrades, or additions the `cli-devin` and `cli-cursor` hook adapter layers should get now that:
- Devin's hooks are confirmed to fire live under the corrected `.devin/hooks.v1.json` nested schema (each event is an array of `{matcher, hooks:[{type,command,timeout}]}`, no top-level `version`/`hooks` wrapper), with 6 of 8 lifecycle events observed firing with real payloads (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`); `PermissionRequest` and `PostCompaction` did not fire in that session.
- Cursor's hook layer is independently built and wired via `.cursor/hooks.json`, with its `009-cursor-hooks-lifecycle/` phase-parent recently reorganized into 6 phase children (superseding the flat 009-015 numbering) and 016-018 renumbered to 011-013.

### Scope

In scope: coverage-gap analysis against the full Claude/Codex hook inventory for both runtimes; hardening of the three named Devin guard adapters' field-name fallbacks; the PermissionRequest/PostCompaction non-firing question; `mcp-route-guard.cjs` dormancy; upstream Devin/Cursor feature drift since the original research; cross-packet dedup opportunities.

Out of scope (per this session's strategy Non-Goals): implementing any code change (research-only); re-deriving facts already settled in `hook-testing-results.md` or the 008/011/012 (Devin) and 009/010 (Cursor) implementation summaries; investigating runtimes other than Devin and Cursor.

### Ground Truth Sources Read

- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/` (all 6 phase children, current reorganized structure)
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/010-hook-code-style-cross-runtime/`
- Live registration files: `.claude/settings.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`
- Adapter source: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`, `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs`, and the shared `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` core.

---

## 2. KEY QUESTIONS

| # | Question | Status this run |
|---|----------|------------------|
| Q1 | Coverage gaps for cli-devin/cli-cursor against the full Claude/Codex hook inventory | **Answered** (iteration 1) |
| Q2 | Can Devin's tolerant field-name fallbacks be tightened without losing fail-open safety | **Answered, with a mid-run self-correction** (iterations 2-5) |
| Q3 | Is PermissionRequest/PostCompaction non-firing expected, and how to design a live-verification follow-up | **Not investigated this run** |
| Q4 | `mcp-route-guard.cjs` dormancy status for Devin and Cursor | **Not investigated this run** |
| Q5 | Devin/Cursor CLI features shipped since original research that these packets haven't accounted for | **Not investigated this run** |
| Q6 | Concrete dedup opportunities between the two packets' hook adapters | **Not investigated this run** (iteration 1 F5 provides a partial structural hint only) |

Formal reducer bookkeeping note: `findings-registry.json` and `deep-research-strategy.md`'s Key Questions section still show all six as unchecked (`- [ ]`) and the "Next Focus" anchor never advanced past Q2 across all 5 iterations, even though iterations self-report "Questions Answered" in their own narratives. This is a loop-mechanism observation, not a finding about the research topic — see §6.

---

## 3. METHODOLOGY

Each of the 5 iterations was dispatched as an isolated `cli-opencode` process (`opencode run --model openai/gpt-5.6-sol --variant high --format json --dangerously-skip-permissions --pure --dir <repo-root>`), receiving only the externalized state (strategy, prior iteration summaries, state log tail) via a rendered prompt pack — no shared in-process context between iterations. Each iteration was required to write an iteration narrative (`iterations/iteration-NNN.md`), append a canonical JSONL record (`newInfoRatio`, `status`, `focus`, optional `graphEvents`), and a per-iteration delta file; all 5 passed the mechanical `verify-iteration.cjs` leaf-reliability gate (iteration file + state append + delta + route-proof present) on first dispatch. `--stop-policy=max-iterations` forced all 5 iterations regardless of the graph-convergence telemetry signal, which reported `STOP_BLOCKED` (source-diversity and evidence-depth guards) on every check from iteration 2 onward — i.e. the loop's own convergence gates never certified this topic as safely stoppable within 5 iterations, independent of the operator override.

---

## 4. FINDINGS — HOOK COVERAGE INVENTORY (Q1, iteration 1)

### F1. The comparison baseline is 7 Claude event keys + Codex guard parity, not one shared 8-event inventory

The 8-event set (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, `SessionEnd`) is Devin's own native contract. Current Claude wiring (`.claude/settings.json`) has 7 keys and no `PermissionRequest`; its compaction hook is `PreCompact`. Codex contributes 8 tool-level guard-adapter rows over lifecycle-like events, not an independent 8-event lifecycle. Coverage must therefore be assessed on two separate axes — normalized lifecycle coverage and guard-capability coverage — or Devin's empty (by design) `PermissionRequest` array gets misclassified as a failed port. [SOURCE: `.claude/settings.json:14-180`] [SOURCE: `cli-codex/references/hook-contract.md:81-106`]

### F2. Devin: complete registration, 6 observed categories, 1 intentional gap, 1 unobserved-but-implemented event

| Normalized event | Devin state | Verdict |
|---|---|---|
| SessionStart | 5 handlers registered; observed live | Covered |
| UserPromptSubmit | Advisor + spec-gate classification registered; observed live | Covered |
| PreToolUse | Exec/edit/subagent/MCP matchers registered; observed live | Covered at event level; `run_subagent` and some MCP branches unobserved |
| PostToolUse | Edit quality/freshness + exec audit registered; observed live | Covered |
| PermissionRequest | Explicit empty array; no Claude source handler | Intentional gap, not an adapter failure |
| Stop | Session accounting + completion evidence registered; observed live | Covered |
| Compaction | Native `PostCompaction` adapter registered | Structurally covered; live behavior unobserved |
| SessionEnd | Cleanup registered; observed live | Covered |

[SOURCE: `.devin/hooks.v1.json:1-166`] [SOURCE: `hook-testing-results.md:51-61`] [SOURCE: `008-devin-hook-parity/implementation-summary.md:48-54`]

### F3. Cursor: covers active session/tool lifecycle, but with 2 material and 2 confidence gaps

| Normalized event/capability | Cursor state | Verdict |
|---|---|---|
| SessionStart | 6 handlers wired; base event live; spec-gate prebind now committed + tested | Covered |
| UserPromptSubmit | 2 `beforeSubmitPrompt` handlers wired, event confirmed dormant | **Material gap**: prompt-time advisor/classification unavailable |
| PreToolUse | Spec-gate enforcement + task dispatch guard wired and live | Covered for those guards; no Cursor equivalent of Codex's dispatch-preflight lint |
| PostToolUse | Write/Shell proxy wired and live | Covered, minor audit-provenance drift only |
| PermissionRequest | No generic Cursor equivalent | Native-lifecycle gap (Claude has no source handler either); `beforeMCPExecution` is not a substitute |
| Stop | Cursor CLI `stop` non-delivering; `sessionEnd` proxies accounting | Partial: completion-evidence sentinel deliberately absent (no `last_assistant_message`) |
| Compaction | `preCompact` proxy wired, no CLI-reachable trigger observed | Structural coverage only |
| SessionEnd | Accounting + cleanup wired; observed live | Covered |

Cursor's later phases materially **supersede** the historical phase-009 snapshot: `beforeMCPExecution` is now wired and live-observed, and `spec-gate-prebind.mjs` is committed, registered, and covered by an 11-row process suite. Use the current `009-cursor-hooks-lifecycle/` reorganized-phase state, not older phase-009-only summaries. [SOURCE: `.cursor/hooks.json:4-93`] [SOURCE: `030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:42-55`] [SOURCE: `030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix/implementation-summary.md:37-64`] [SOURCE: `030-cli-cursor-creation/013-cursor-spec-gate-prebind/implementation-summary.md:57-80`]

### F4. Guard-capability parity narrows the actionable backlog to two items

Devin has adapters for all 7 shared guard cores plus its native task-dispatch path; remaining issues are branch-level live evidence, not missing files. Cursor covers spec-gate enforce/classify, post-edit quality, code-graph freshness, dispatch audit, task dispatch, and MCP routing. The two substantive **missing capabilities** are: (1) dispatch-preflight lint before `Shell` execution, and (2) completion-evidence checking at turn/session completion — the latter is not a thin port because Cursor's `sessionEnd` payload supplies `transcript_path`, not `last_assistant_message`, requiring a transcript reader and new state contract. [SOURCE: `cli-codex/references/hook-contract.md:88-102`] [SOURCE: `008-devin-hook-parity/implementation-summary.md:39-54`]

### F5. Registration must not be counted as behavioral coverage

The recurring failure mode across both packets' documentation is flattening "wired," "event observed," and "branch behavior observed" into one status. Future coverage matrices should keep these three states distinct — Cursor's `beforeMCPExecution` and spec-gate prebind are now *stronger* than registration-only (real payload capture / discriminating test suite), while Devin's `run_subagent` PreToolUse branch is still registration-only. [SOURCE: `011-hook-truth-and-runtime-readmes/implementation-summary.md:106-111`] [SOURCE: `030-cli-cursor-creation/009-cursor-hooks-lifecycle/004-hooks-manual-testing-results/implementation-summary.md:39-48`]

**Q1 answer:** Devin's only event-level functional hole is the intentionally empty `PermissionRequest`; `PostCompaction` is implemented but unobserved; several `PreToolUse` branches need live evidence. Cursor's material gaps are dormant prompt-time delivery, missing dispatch-preflight lint, and missing completion-evidence behavior; compaction is registration-only. Session lifecycle, tool enforcement, post-tool quality/freshness/audit, task dispatch, and MCP routing are otherwise covered in the current on-disk state for both runtimes.

---

## 5. FINDINGS — DEVIN FALLBACK HARDENING (Q2, iterations 2-5)

This question was investigated four times in a row (the loop never advanced past it — see §6). The findings below are presented as a single reconciled narrative, with the iteration-5 correction of iteration-4's error called out explicitly, since presenting them as four independent iterations would obscure the self-correction.

### F1. The current adapters already use the confirmed canonical Devin envelope — the fallback concern is narrower than the research premise assumed

All three named adapters (`task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, `mcp-route-guard.cjs`) consume `payload.tool_name` and `payload.tool_input` directly. None accepts `toolName`, `toolInput`, `input`, `arguments`, or `args`. The live capture in `hook-testing-results.md` confirms this snake_case envelope and the observed `exec`/`edit` argument names. There is no envelope-level fallback to remove — tightening is not a three-adapter rewrite. [SOURCE: `hook-testing-results.md:55-61`] [SOURCE: `task-dispatch-guard.cjs:45-64`] [SOURCE: `spec-gate-enforce.mjs:59-80`] [SOURCE: `mcp-route-guard.cjs:41-57`]

### F2. `task-dispatch-guard.cjs`'s subagent-type aliases must be retained until a real `run_subagent` payload is captured

The adapter maps `subagent_type`, `subagentType`, `agent_type`, `agentType` into the shared core. None was validated live — no `run_subagent` event occurred in the one observed session. Cursor's independently-observed live `Task` payload confirms `subagent_type` **for Cursor**, which raises confidence that snake_case is the cross-runtime canonical spelling but is *not* evidence of Devin's exact `run_subagent` contract. Removing the untested aliases based on adjacent-tool (`exec`/`edit`) or cross-runtime (Cursor) evidence would be an invalid extrapolation — if Devin ever emits a removed spelling, the adapter still exits successfully but forwards no identity, a silent fail-open bypass. [SOURCE: `task-dispatch-guard.cjs:52-67`] [SOURCE: `008-devin-hook-parity/implementation-summary.md:96-103`] [SOURCE: `030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:54-68`]

### F3. `spec-gate-enforce.mjs` path aliases: one confirmed field (`file_path`), two unconfirmed compatibility aliases (`filePath`, generic `path`) — **and a corrected safety verdict**

- **Iteration 4's original claim** (superseded): losing a path alias would remain "enforcement-conservative" — worst case a false-deny or a false-advise on an actually-exempt edit, never a silent allow bypass.
- **Iteration 5's correction, independently re-verified during this synthesis** against the live `spec-gate-core.mjs` source: `isExemptTargetPath(filePath, projectDir)` returns `true` when `filePath` is not a string or is blank (`spec-gate-core.mjs:751-752`). `evaluateMutation()` then short-circuits to `{ decision: 'allow' }` for any non-`bash` tool whose target is exempt (`spec-gate-core.mjs:958-960`). **Therefore losing `filePath`/`path` resolution for an alias-only caller does not fail toward deny/advise — it fails toward silent allow**, because an unresolved path is treated as an exempt target. This is the single most safety-relevant finding in this research run and directly informs the answer to the research topic's item (2).
- Practical consequence: generic `path` is still the strongest retirement candidate on ambiguity grounds (Cursor's independently-live-verified adapter carries the same three-name helper, and no actual conflicting Devin payload was observed), but it and `filePath` must not be removed until (a) real-payload fixtures exist for every accepted spelling, (b) a caller/telemetry audit proves zero live use, or (c) the fail-open contract is deliberately renegotiated. [SOURCE: `spec-gate-core.mjs:745-779` `isExemptTargetPath`] [SOURCE: `spec-gate-core.mjs:906-970` `evaluateMutation`] [SOURCE: `spec-gate-enforce.mjs:49-53,80-87`] [SOURCE: `cursor/spec-gate-enforce.mjs:50-53,68-88`]

### F4. The `||` truthiness chains need type-aware, first-nonblank-string precedence before any alias retirement

Both alias-bearing adapters select the first *truthy* property, not the first valid *string*. A truthy non-string `file_path` can suppress a later valid `filePath`/`path` and still resolve to `null`; a truthy malformed `subagent_type` can suppress later valid aliases and forward garbage to the core. This precedence defect exists independent of which aliases are eventually retired — fixing it (ordered, first-nonblank-string resolution, confirmed snake_case field first) is safe hardening on its own and should happen *before* any vocabulary reduction. [SOURCE: `spec-gate-enforce.mjs:49-53,80-87`] [SOURCE: `task-dispatch-guard.cjs:54-67`]

### F5. `mcp-route-guard.cjs` has no tool-input field-name fallback to tighten

The MCP adapter forwards only canonical `payload.tool_name`; it never reads `tool_input`. Its only fallback chain is workspace-root resolution (`payload.cwd` → `DEVIN_PROJECT_DIR` → `process.cwd()`), a tested project-root invariant from phase 012, not payload-schema uncertainty. There is no Q2-scoped change to make here; its dormancy/applicability is a separate, unanswered question (Q4). [SOURCE: `mcp-route-guard.cjs:41-60`] [SOURCE: `012-devin-hook-hardening/implementation-summary.md:47-55,75-85`]

### F6. Current process tests prove canonical `file_path`, not alias-retirement safety

The Devin process suite (`spec-gate-devin.test.mjs`) constructs every enforce payload with `tool_input.file_path`, exercising deny/advise/satisfied/whitespace-cwd/missing-cwd behavior — but has zero rows for `filePath`, generic `path`, conflicting-field, malformed-canonical-then-valid-alias, or missing-path scenarios. Phase 012 accurately describes this as high-risk spec-gate coverage, but it is not evidence the compatibility spellings are unused. [SOURCE: `spec-gate-devin.test.mjs:53-63,175-205,253-286`] [SOURCE: `012-devin-hook-hardening/implementation-summary.md:44-75,93-115`]

### Recommended hardening order (Q2 answer, reconciled)

1. Replace truthiness (`||`) chains in both alias-bearing adapters with a tested first-nonblank-string resolver, keeping the confirmed snake_case field first (canonical-first, not canonical-only).
2. Add real-payload process fixtures for every currently-accepted spelling (`file_path`, `filePath`, `path`; `subagent_type`, `subagentType`, `agent_type`, `agentType`) plus conflicting-alias and missing-value rows.
3. Do **not** retire `filePath`/`path` until fixture/caller audit proves zero use — the corrected finding above (F3) means premature removal is an enforcement-bypass risk, not merely a false-advise risk.
4. Do **not** retire any task-identity alias until a real Devin `run_subagent` payload is captured live and a marker-free direct-caller audit exists.
5. Make no field-name or project-root change to `mcp-route-guard.cjs` under this question.

---

## 6. UNINVESTIGATED QUESTIONS AND A LOOP-MECHANISM OBSERVATION

Q3, Q4, Q5, and Q6 were never investigated in this 5-iteration run. Each iteration's own "Next Focus" narrative field correctly named the next question (Q4 after iteration 1, then repeatedly Q4 as the pending item after iterations 2, 3, and 4), but every dispatched iteration nonetheless reopened Q2. Two independent, verifiable observations from this run's own state files explain why, without needing to guess at model behavior:

1. **The externalized `deep-research-strategy.md` "## 11. NEXT FOCUS" anchor never advanced past Q2** across all 5 iterations, even though 4 of 5 iteration narratives titled their own "Next Focus" field as Q4. Since each iteration's prompt pack is built from the *current* `strategy.md` file (fresh-context-per-iteration by design), and that file's machine-owned Next-Focus anchor stayed pinned to Q2, each fresh iteration was handed Q2 as its assigned focus regardless of what the previous iteration's own narrative had recommended.
2. **None of the 6 Key Questions checkboxes were ever flipped to `[x]`, and `findings-registry.json.resolvedQuestions` stayed at 0/6** through all 5 reduce-state passes, despite every iteration narrative explicitly stating "Q_: Answered" in prose. The reducer's finding-registry population also captured "Ruled-Out Directions" bullets as `keyFindings` entries rather than the substantive `### F1.`-`### F5.` findings, suggesting the reducer's narrative-parsing heuristics did not recognize this run's iteration-file structure as fully as expected.

Both observations point at the same root cause candidate: **the reducer did not advance the Next-Focus anchor or check off questions after iterations that self-reported "Answered"** for this particular topic/run. This is a deep-research runtime-mechanism finding, not a finding about the cli-devin/cli-cursor hook adapters, and is reported here for the operator's awareness rather than investigated further (out of scope for this research topic). It means **Q3, Q4, Q5, and Q6 require a dedicated follow-up research pass** (or a manually-seeded strategy.md with a locked focus per iteration) before they can be considered answered.

Partial hint toward Q6 (not a full answer): iteration 1 F5 already established that Devin and Cursor now share three of the same guard cores (spec-gate, task-dispatch, and — per iteration 1 F4 — the same 7 shared guard-adapter shapes against Codex), which is suggestive of shared-core extraction potential, but this run did not investigate concrete dedup mechanics, boundaries, or risk.

---

## 7. RECOMMENDATIONS

1. **Fix `||`-chain precedence before touching vocabulary** in `task-dispatch-guard.cjs` and `spec-gate-enforce.mjs` (F4, §5): first-nonblank-string resolution, confirmed field first. This is safe, low-risk hardening independent of any alias-retirement decision.
2. **Do not retire any Devin adapter alias yet.** The corrected safety analysis (F3, §5) shows path-alias loss in `spec-gate-enforce.mjs` risks a silent enforcement bypass (exempt-path allow), not a conservative fail-toward-deny. Task-identity aliases in `task-dispatch-guard.cjs` remain unvalidated pending a live `run_subagent` capture.
3. **Add missing test coverage** for every accepted alias spelling, conflicting-alias precedence, and missing/blank-path cases in the Devin process suite before any future retirement decision (F6, §5).
4. **Leave `mcp-route-guard.cjs` untouched** for Q2 purposes; its actual dormancy/applicability (Q4) needs its own investigation.
5. **Run a dedicated follow-up research pass for Q3, Q4, Q5, and Q6** — this run did not reach them. Recommend seeding a fresh `deep-research-strategy.md` with the focus locked per-iteration (or explicitly forcing focus rotation) so the loop-mechanism issue in §6 cannot repeat.
6. **Design the Q3 live-verification follow-up** (not executed here, but scoped): force a real Devin `PermissionRequest`-shaped and `PostCompaction`-shaped event (e.g. an operation requiring interactive approval, and a context-window-filling session) in an isolated Devin session, capture the raw payload, and diff against the corrected `.devin/hooks.v1.json` schema to distinguish "genuinely didn't occur" from "handler exists but doesn't fire."

---

## 8. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treating Cursor `beforeMCPExecution` as a `PermissionRequest` equivalent | It is MCP-specific route advice, not a generic approval-lifecycle surface | `030-cli-cursor-creation/011-.../implementation-summary.md:86-105` | 1 |
| Treating phase-009's "unwired" MCP/prebind statements as current truth | Later phases 011 and 013 explicitly supersede those historical states | `030-cli-cursor-creation/011-.../implementation-summary.md`, `013-.../implementation-summary.md` | 1 |
| Treating the 8 normalized events as 8 currently-registered Claude keys | `.claude/settings.json` has 7 keys and no `PermissionRequest` | `.claude/settings.json:14-180` | 1 |
| Tightening `run_subagent` identity fields from observed `exec`/`edit` samples | Different tools with different argument contracts; no `run_subagent` payload was ever observed | `task-dispatch-guard.cjs:52-67` | 2 |
| Removing the `cwd`/env/`process.cwd()` fallback as "payload cleanup" | It is a tested project-root resolution invariant from phase 012, not a field-name alias | `012-devin-hook-hardening/implementation-summary.md:47-55` | 2 |
| Treating all 3 named Devin adapters as equally fallback-heavy | The MCP adapter has zero argument aliases; all 3 already use the canonical snake_case envelope | iteration-002.md F1, F4 | 2 |
| Removing every non-snake_case alias immediately | `run_subagent` remains unobserved; deletion does not fix the underlying precedence defect | iteration-003.md | 3 |
| Treating missing spec-gate path data as a silent-allow bypass (iteration 3's own original framing) | **Superseded by iteration 5**: the shared core does treat a missing/blank path as an allow-capable exemption for non-bash tools | `spec-gate-core.mjs:751-752,958-960` | 3, corrected by 5 |
| Tightening the MCP adapter's project-directory fallback as payload-schema cleanup | Unrelated to tool-input field spelling; it is a verified workspace-root invariant | `mcp-route-guard.cjs:41-60` | 3, 4, 5 |
| Changing unknown/missing paths to `deny` by default merely to enable alias deletion | Would be a deliberate, separate fail-open-contract change, not a side effect of alias cleanup | iteration-005.md | 5 |
| Immediate canonical-only parsing for either alias-bearing adapter | Removes untested compatibility spellings without proof of non-use; risks silent bypass | iteration-004.md, iteration-005.md | 4, 5 |

---

## 9. DIVERGENCE MAP

Not applicable. This run used `convergence_mode: default` (not `divergent`); no pivot was triggered or eligible at any point. `deep-research-strategy.md` §10A shows 0 completed pivots, 0 failed pivots, 0 audited overrides, and no saturated directions recorded.

---

## 10. OPEN QUESTIONS

- **Q3** (unanswered): Is `PermissionRequest`/`PostCompaction` non-firing in the one observed Devin session expected, or does it warrant a live-verification pass? See §7 recommendation 6 for a scoped follow-up test design.
- **Q4** (unanswered): What is `mcp-route-guard.cjs`'s dormancy status for Devin and Cursor now that MCP servers may be independently registrable per runtime?
- **Q5** (unanswered): What Devin/Cursor CLI features have shipped since the original packet research (docs.devin.ai / docs.cursor.com) that these packets don't account for? (Not investigated — no live web research was performed on either question in this run.)
- **Q6** (unanswered, partial hint only): Concrete, safe dedup boundaries between the cli-devin and cli-cursor hook adapters, given their shared 4-runtime hook-directory pattern, fail-open contract, and guard-core wrapping (iteration-1 F4/F5 establish that the shared-core wrapping already exists for spec-gate and task-dispatch, but did not analyze extraction boundaries or risk).
- Whether the reducer/loop-mechanism issue described in §6 (Next-Focus anchor pinned to Q2, questions never checked off) is specific to this run's topic phrasing or a general deep-research reducer gap — flagged for the operator, out of scope for this research topic.
- Whether generic `path` and `filePath` in `spec-gate-enforce.mjs` have any live caller today — no caller/telemetry audit was performed in this run; this is a prerequisite named in §5/§7 before any retirement.

---

## 11. WHAT WORKED

- Reusing already-settled packet evidence (`hook-testing-results.md`, 008/011/012 for Devin; the reorganized `009-cursor-hooks-lifecycle/` children + 010 for Cursor) instead of re-deriving hook-firing facts from scratch, per the strategy Non-Goals.
- Re-reading the actual shared core (`spec-gate-core.mjs`) at the exact line ranges cited by a prior iteration's claim, which caught and corrected a real safety-relevant error (iteration 5 vs. iteration 4).
- Distinguishing "registered," "event observed," and "branch behavior observed" as three separate coverage states (iteration 1 F5) — this framing held up and was reused correctly through iteration 5.

## 12. WHAT FAILED

- The loop never advanced its own machine-owned "Next Focus" anchor past Q2, so 4 of 5 available iterations were spent re-answering the same question instead of covering Q3-Q6 (§6).
- No live web research (`docs.devin.ai`, `docs.cursor.com`) was performed for Q5 in any iteration, despite Q5 explicitly requiring it.
- No caller/telemetry audit of the `path`/`filePath`/subagent-alias fields was performed — every iteration recommended one as a prerequisite for retirement, but none executed it (this is legitimately future implementation work, not a research-loop failure, but is noted here for completeness).

## 13. RULED OUT DIRECTIONS

See §8 (Eliminated Alternatives) for the consolidated table with evidence and iteration references.

---

## 14. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` (operator `--stop-policy=max-iterations` override; convergence signals were telemetry-only for this run and never allowed a legal STOP — every graph-convergence check from iteration 2 onward returned `STOP_BLOCKED` on `source_diversity_guard` and `evidence_depth_guard`, scores 0.73 → 0.73 → 0.48 → 0.48).
- Total iterations: 5 of 5 (max).
- Questions answered (formal registry count): 0/6 (see §6 loop-mechanism observation — narratively, Q1 and Q2 were substantively answered; Q3-Q6 were not).
- Remaining questions: 4 (Q3, Q4, Q5, Q6) fully open; Q2 is answered but flagged for implementation-time test coverage before any code change.
- Last 3 iteration summaries: run 3: Q2 refinement (0.54, insight); run 4: Q2 verification (0.38, insight); run 5: Q2 correction of run 4 (0.46, insight).
- Convergence threshold: 0.05 (newInfoRatio).
- Divergence summary: not applicable (§9).
- newInfoRatio trend: 0.88 → 0.76 → 0.54 → 0.38 → 0.46 (a genuine uptick on the final iteration, driven by the safety correction in F3/§5 — high-value findings did not monotonically decay even as the same question was re-investigated).
- Key findings recorded by the reducer: 33 (findings-registry.json; see §6 caveat on what the reducer actually captured into this field for this run).
- Executor actually invoked: `cli-opencode`, model `openai/gpt-5.6-sol`, reasoningEffort `high`, serviceTier default (not fast) — confirmed via `deep-research-state.jsonl` `iteration_start`/`iteration` executor blocks and `dispatch-receipts/dispatch-research-i{1..5}-g2.{intent,completion}.json` for all 5 iterations.

---

## 15. SPEC.MD WRITE-BACK

A bounded generated findings block was written under the `## 4. OPEN QUESTIONS` host anchor in `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/spec.md`, replacing the prior generation-1 (`devin-as-mcp-host-feasibility`) generated fence with this run's findings, consistent with the spec-check protocol (one generated fence per host anchor, machine-owned, `research/research.md` remains canonical). See the fence content in `spec.md` for the abridged operator-facing summary.

---

## 16. REFERENCES

- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/004-hooks-manual-testing-results/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/implementation-summary.md`
- `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`
- `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs`
- `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs`
- `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md`
- `.claude/settings.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`

Note: `resource-map.md` was not present at init for this packet, so it is not cited as a coverage-gate source; a fresh `resource-map.md` was emitted at synthesis time from converged research deltas.

---

## 17. ARTIFACT INDEX

- `research/deep-research-config.json` — loop config, executor binding, lineage (generation 2, restart from prior `devin-as-mcp-host-feasibility` session)
- `research/deep-research-state.jsonl` — full append-only event/iteration log (config, restart, spec_check, 5x iteration_start/iteration, 5x graph_convergence, telemetry heartbeats)
- `research/deep-research-strategy.md` — final strategy state (Next Focus, Key Questions, Known Context)
- `research/findings-registry.json` — reducer-owned registry (33 keyFindings, 0/6 formally resolved — see §6)
- `research/deep-research-dashboard.md` — auto-generated operator dashboard
- `research/resource-map.md` — emitted at synthesis from converged deltas
- `research/iterations/iteration-001.md` through `iteration-005.md` — full iteration narratives
- `research/deltas/iter-001.jsonl` through `iter-005.jsonl` — per-iteration structured deltas
- `research/dispatch-receipts/dispatch-research-i{1..5}-g2.intent.json` and `.completion.json` — executor dispatch provenance (10 files)
- `research_archive/20260727T040816Z/` — the prior generation-1 `devin-as-mcp-host-feasibility` research packet, archived intact before this run started
