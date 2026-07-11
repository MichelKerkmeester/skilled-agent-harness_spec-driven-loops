# Research: Plugin & Hook Opportunities from Existing Skills

> **Lineage:** glm52 (GLM-5.2) | **Spec:** `.opencode/specs/skilled-agent-orchestration/132-plugin-hook-implementation/000-plugin-hook-opportunities`
> **Iterations:** 5 | **Converged:** 2026-07-11 | **Candidates:** 18

---

## 1. Executive Summary

This research identifies 18 candidate OpenCode plugins and Claude hooks that could be built based on behaviors already present in the repo's 12 skills under `.opencode/skills/`. Every candidate is grounded in a real skill file and names its concrete runtime surface. The candidates cluster around two dominant patterns:

1. **PostToolUse / `tool.execute.after` validation hooks** — promoting existing validation scripts (comment hygiene, frontmatter versions, flowchart validation, link checking, spec placeholder detection) from manual/CI-only execution to immediate post-write feedback. This is the single largest opportunity: the `tool.execute.after` surface is **completely unused** by all 7 existing plugins.

2. **`tool.register` custom tools** — exposing skill-owned state (spec completion status) as queryable tools. The `tool.register` surface is also **completely unused**.

The portfolio is overwhelmingly observe/advise (17 of 18 candidates), with exactly one enforce candidate (git-commit guard). No candidates propose autonomous mutation via hooks.

---

## 2. Research Topic

What additional OpenCode plugins and Claude hooks could we build based on existing repo skills? Ground every candidate in a real skill under `.opencode/skills/` and name its concrete runtime surface (OpenCode plugin hook: `tool.execute.before/after`, `session.*`, `experimental.*`; or Claude hook: `PreToolUse/PostToolUse/SessionStart/UserPromptSubmit/Stop/SessionEnd`).

---

## 3. Methodology

Iterative deep-research loop with fresh-context-per-iteration, externalized JSONL state, and convergence detection. Each iteration inventoried one or more skill families, identified promotable behaviors, and assessed blast radius. The loop converged after 5 iterations when all 5 key questions had evidence-backed answers and the newInfoRatio trend fell below diminishing-returns threshold.

**newInfoRatio trend:** 1.0 → 0.8 → 0.7 → 0.5 → 0.3

---

## 4. Existing Infrastructure Inventory

### 4.1 Existing OpenCode Plugins (7)

| Plugin | Hook Surface | Role |
|--------|-------------|------|
| mk-skill-advisor.js | `experimental.chat.system.transform` | Prompt-time skill recommendation |
| mk-code-graph.js | session integration | Code-graph context injection |
| mk-spec-memory.js | `experimental.chat.system.transform` | Spec-kit memory continuity brief |
| mk-goal.js | `experimental.chat.system.transform` + `event()` | Per-session goal state + continuation |
| mk-deep-loop-guard.js | `tool.execute.before` + `event` | Deep-loop dispatch guard |
| mk-dist-freshness-guard.js | `tool.execute.before` + `event` + `experimental.chat.system.transform` | Dist staleness prevention |
| session-cleanup.js | dispose lifecycle | MCP descendant cleanup |

### 4.2 Existing Claude Hooks (8)

| Hook | Matcher | Script |
|------|---------|--------|
| PreToolUse | Bash | dispatch-preflight-lint.mjs (cli dispatch hard_rules) |
| PreToolUse | Task | task-dispatch-guard.cjs (deep-loop guard) |
| UserPromptSubmit | — | user-prompt-submit.js (spec-kit priming) |
| PreCompact | — | compact-inject.js (spec-kit continuity) |
| SessionStart | — | session-prime.js + worktree-guard.sh + check-git-hooks.sh + check-dist-staleness.sh |
| Stop | — | session-stop.js (spec-kit async save) |
| SessionEnd | — | session-cleanup.sh (MCP cleanup) |
| PostToolUse | Write\|Edit | claude-posttooluse.sh (dist freshness) |

### 4.3 Hook Surface Gap Analysis

| Surface | Plugins Using | Status |
|---------|--------------|--------|
| `tool.execute.before` | 2 | Well-covered |
| `tool.execute.after` | **0** | **Entirely unused** |
| `tool.register` | **0** | **Entirely unused** |
| `experimental.chat.system.transform` | 4 | Saturated |
| `session.created` / `event` | 6 | Saturated |
| disposed lifecycle | 1 | Adequate |

---

## 5. Candidate Backlog (Ranked)

### Tier 1: High Value, Low Blast Radius, Proven Script (Immediate)

#### C-15: Unified PostToolUse Quality Gate
- **Source skills:** sk-code (`check-comment-hygiene.sh`), sk-doc (`check-frontmatter-versions.sh`, `validate_flowchart.sh`), system-spec-kit (`check-placeholders.sh`, `quality-audit.sh`)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit` + OpenCode `tool.execute.after`
- **Blast radius:** Low (observe/advise)
- **Rationale:** Single hook dispatches the right validation check based on edited file path. Reduces hook-registration overhead from 5 hooks to 1. Extends the existing `claude-posttooluse.sh` pattern.
- **Evidence:** [SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh] [SOURCE: .claude/settings.json:112-123]

#### C-2: Comment Hygiene PostToolUse Hook
- **Source skill:** sk-code (`check-comment-hygiene.sh`, 215 lines)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe/advise)
- **Rationale:** Detects ephemeral artifact labels in code comments at write-time rather than quality-gate time. Supports JS/TS/Python/Shell/JSONC with escape hatch.
- **Evidence:** [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:1-215]

#### C-5: Frontmatter Version Validator Hook
- **Source skill:** sk-doc (`check-frontmatter-versions.sh` + `frontmatter-version.mjs`)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe/advise)
- **Rationale:** Validates 4-part version in skill doc frontmatter immediately after edit. Currently CI-only.
- **Evidence:** [SOURCE: .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:1-13]

#### C-4: Code-Graph Re-index Trigger
- **Source skill:** system-code-graph (`code_graph_scan({ incremental: true })`)
- **Runtime surface:** OpenCode `tool.execute.after` + Claude `PostToolUse/Write|Edit`
- **Blast radius:** Low (background observe)
- **Rationale:** Triggers incremental re-index of edited file, keeping the graph fresh without full rescans. Must debounce.
- **Evidence:** [SOURCE: .opencode/skills/system-code-graph/SKILL.md] [SOURCE: opencode.json:69-86]

#### C-1: Git Commit Message Guard
- **Source skill:** sk-git (commit workflows, safety refusals)
- **Runtime surface:** Claude `PreToolUse` matcher `Bash` + OpenCode `tool.execute.before`
- **Blast radius:** Medium (enforce/block, fail-open)
- **Rationale:** Validates conventional-commit format, blocks `--no-verify`, blocks force-push to main, warns on amend of published commits. Matches 4 documented safety-refusal scenarios.
- **Evidence:** [SOURCE: .opencode/skills/sk-git/manual_testing_playbook/safety-refusals/] [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:42-67]

### Tier 2: Medium Value, Low Blast Radius, New Surface (Near-term)

#### C-11: CLI Dispatch Audit Trail
- **Source skill:** cli-external (dispatch-preflight-lint.mjs)
- **Runtime surface:** OpenCode `tool.execute.after`
- **Blast radius:** Low (log)
- **Rationale:** First use of `tool.execute.after`. Captures completed `opencode run`/`claude -p` dispatches to a structured audit log for observability and cost tracking.
- **Evidence:** [SOURCE: .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:1-80]

#### C-3: Spec Validation PostToolUse Hook
- **Source skill:** system-spec-kit (`validate.sh`, `check-placeholders.sh`)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe/advise)
- **Rationale:** Lightweight spec-folder validation (placeholders, anchors) on spec-doc edits. Scoped to `specs/**/` paths.
- **Evidence:** [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:1-60]

#### C-13: Spec-Kit Completion State Exposer
- **Source skill:** system-spec-kit (`check-completion.sh`, `calculate-completeness.sh`)
- **Runtime surface:** OpenCode `tool.register`
- **Blast radius:** Low (read-only tool)
- **Rationale:** First use of `tool.register`. Exposes spec completion state (level, checklist, validation status) as a queryable tool.
- **Evidence:** [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh]

#### C-12: Deep-Loop State Cleanup on SessionStart
- **Source skill:** system-deep-loop (pause sentinels, advisory locks)
- **Runtime surface:** OpenCode `session.created`
- **Blast radius:** Low (cleanup)
- **Rationale:** Cleans orphaned pause sentinels and stale locks from crashed sessions. Extends mk-deep-loop-guard.js's existing sweep.
- **Evidence:** [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md:181-198]

#### C-10: Code-Mode Tool Budget Advisor
- **Source skill:** mcp-code-mode
- **Runtime surface:** OpenCode `tool.execute.before`
- **Blast radius:** Low (advise)
- **Rationale:** Warns when external MCP tools are called natively instead of via Code Mode (98% context reduction).
- **Evidence:** [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:1-60]

### Tier 3: Specialized or Higher Complexity (Future)

#### C-16: Skill Advisor Effectiveness Tracker
- **Source skill:** system-skill-advisor
- **Runtime surface:** OpenCode `tool.execute.after`
- **Blast radius:** Low (log)
- **Rationale:** Closed-loop tracking of whether advisor recommendations were followed. Data collection only.
- **Evidence:** [SOURCE: .opencode/plugins/mk-skill-advisor.js]

#### C-14: Git Worktree Health Monitor
- **Source skill:** sk-git (`worktree_workflows.md`)
- **Runtime surface:** OpenCode `session.created` + Claude `SessionStart`
- **Blast radius:** Low (observe)
- **Rationale:** Extends worktree-guard.sh with stale-worktree detection, unmerged-branch warnings, and orphaned-directory cleanup.
- **Evidence:** [SOURCE: .claude/settings.json:71] [SOURCE: .opencode/bin/worktree-guard.sh]

#### C-7: Small-Model Dispatch Advisory
- **Source skill:** sk-prompt (`prompt-models/SKILL.md`)
- **Runtime surface:** OpenCode `experimental.chat.system.transform`
- **Blast radius:** Low (advise)
- **Rationale:** Injects model-specific prompt-craft gotchas when a small-model dispatch is detected. Differentiates from mk-skill-advisor by focusing on model-dispatch context.
- **Evidence:** [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:1-50]

#### C-8: Design Anti-Slop PostToolUse Advisor
- **Source skill:** sk-design (`design-audit/SKILL.md`)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe)
- **Rationale:** Detects AI-generated design tells (hard-coded colors, generic gradients, cookie-cutter layouts) after frontend file writes.
- **Evidence:** [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:1-70]

#### C-6: Flowchart Validator Hook
- **Source skill:** sk-doc (`validate_flowchart.sh`, 149 lines)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe)
- **Rationale:** Validates ASCII flowchart structure (box alignment, connectors) when flowchart-containing markdown is edited.
- **Evidence:** [SOURCE: .opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:1-50]

#### C-17: Smart Router Integrity Check on SessionStart
- **Source skill:** system-spec-kit (`check-smart-router.sh`, `validate-command-tree-parity.sh`)
- **Runtime surface:** Claude `SessionStart` + OpenCode `session.created`
- **Blast radius:** Low (observe)
- **Rationale:** Detects smart-router and command-tree drift at session start.
- **Evidence:** [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh]

#### C-18: Broken Link Checker PostToolUse
- **Source skill:** system-spec-kit (`check-links.sh`)
- **Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`
- **Blast radius:** Low (observe)
- **Rationale:** Detects broken internal links in markdown immediately after edit.
- **Evidence:** [SOURCE: .opencode/skills/system-spec-kit/scripts/check-links.sh]

#### C-9: DQI Quality Score Live Feedback
- **Source skill:** sk-doc (`create-quality-control/SKILL.md`)
- **Runtime surface:** OpenCode `tool.execute.after`
- **Blast radius:** Low (observe)
- **Rationale:** Lightweight DQI sub-check on edited markdown under specs/. Differs from C-3 by scoring documentation quality, not structural validity.
- **Evidence:** [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md]

---

## 6. Cross-Cutting Patterns

### Pattern A: PostToolUse Validation Promotion

The dominant pattern (Candidates 2, 3, 5, 6, 8, 9, 15, 18). The repo has 30+ validation scripts under `system-spec-kit/scripts/rules/`, `sk-doc/scripts/`, and `sk-code/code-quality/scripts/` that run only in CI or on manual invocation. Promoting a subset to PostToolUse/`tool.execute.after` provides immediate feedback at the moment a violation is introduced, when it is cheapest to fix.

**Recommendation:** Build C-15 (Unified PostToolUse Quality Gate) first, as it subsumes Candidates 2, 3, 5, 6, and 9 into a single hook with path-based dispatch.

### Pattern B: Unused Surface Activation

Two OpenCode plugin surfaces are entirely unused: `tool.execute.after` (0 plugins) and `tool.register` (0 plugins). Candidates 4, 11, 13, 15, 16 activate `tool.execute.after`; Candidate 13 activates `tool.register`. This is the highest-leverage finding because it identifies greenfield surface with zero crowding risk.

### Pattern C: Closed-Loop Observability

Candidates 11 (CLI dispatch audit), 16 (advisor effectiveness tracker), and 10 (code-mode budget advisor) create observability loops that don't exist today. The current plugin portfolio is strong at injection (system.transform) and enforcement (tool.execute.before) but has no post-execution telemetry.

---

## 7. Surface Mapping Summary

| Surface | Candidates |
|---------|-----------|
| Claude `PostToolUse`/Write\|Edit | C-2, C-3, C-5, C-6, C-8, C-15, C-18 |
| OpenCode `tool.execute.after` | C-4, C-9, C-11, C-13, C-15, C-16 |
| OpenCode `tool.execute.before` | C-1, C-10 |
| Claude `PreToolUse`/Bash | C-1 |
| OpenCode `tool.register` | C-13 |
| OpenCode `session.created` / Claude `SessionStart` | C-12, C-14, C-17 |
| OpenCode `experimental.chat.system.transform` | C-7 |

---

## 8. Blast-Radius Distribution

| Blast Radius | Count | Candidates |
|-------------|-------|-----------|
| Low (observe/advise) | 17 | All except C-1 |
| Medium (enforce/block, fail-open) | 1 | C-1 |
| High (mutate) | 0 | — |

---

## 9. Skill Coverage Matrix

| Skill | Candidates Derived | Primary Surfaces |
|-------|-------------------|-----------------|
| sk-code | C-2, C-15 | PostToolUse |
| sk-doc | C-5, C-6, C-9, C-15 | PostToolUse, tool.execute.after |
| sk-git | C-1, C-14 | PreToolUse/Bash, SessionStart |
| sk-design | C-8 | PostToolUse |
| sk-prompt | C-7 | experimental.chat.system.transform |
| system-spec-kit | C-3, C-13, C-15, C-17, C-18 | PostToolUse, tool.register, SessionStart |
| system-code-graph | C-4 | tool.execute.after, PostToolUse |
| system-deep-loop | C-12 | session.created |
| system-skill-advisor | C-16 | tool.execute.after |
| mcp-code-mode | C-10 | tool.execute.before |
| cli-external | C-11 | tool.execute.after |
| mcp-tooling | — | (covered by /doctor) |

---

## 10. Feasibility Assessment

| Feasibility | Candidates | Rationale |
|------------|-----------|-----------|
| **Immediate** (script exists, pattern proven) | C-1, C-2, C-3, C-4, C-5, C-6, C-15, C-17, C-18 | Existing script + existing hook pattern (PostToolUse/dist-freshness or tool.execute.before/deep-loop-guard) |
| **Near-term** (pattern proven, new surface) | C-10, C-11, C-12, C-13, C-14 | New surface use but follows existing plugin architecture |
| **Future** (specialized or complex) | C-7, C-8, C-9, C-16 | Requires new analysis logic or closed-loop design |

---

## 11. Recommendations

1. **Build C-15 (Unified PostToolUse Quality Gate) first.** It subsumes 5 other candidates (C-2, C-3, C-5, C-6, C-9) into a single hook with path-based dispatch. Extends the proven `claude-posttooluse.sh` pattern. Immediate ROI.

2. **Activate `tool.execute.after` with C-11 (CLI Dispatch Audit Trail).** This is the simplest possible use of an entirely unused surface — a non-blocking audit log — and establishes the pattern for Candidates 4, 9, 15, 16.

3. **Activate `tool.register` with C-13 (Spec-Kit Completion Exposer).** Another entirely unused surface, with a clear read-only use case. Low risk, high discoverability value.

4. **Build C-1 (Git Commit Guard) as the sole enforce candidate.** It is the only candidate that blocks rather than advises, and it matches 4 documented safety-refusal scenarios. Use fail-open design identical to mk-deep-loop-guard.js.

5. **Defer Tier 3 candidates** until Tier 1 and 2 are built and their effectiveness is measured.

---

## 12. Open Questions

1. **Should candidates be limited to skills with a runtime footprint?** This research included purely interactive skills (sk-design audit, sk-prompt profiles) and found promotable behaviors (C-7, C-8). Recommendation: include both, as the promotion path from interactive → always-on is the entire point.

2. **What is the appetite for hooks that mutate vs. observe?** The evidence strongly favors observe/advise (17 of 18 candidates). The one enforce candidate (C-1) uses fail-open design. Recommendation: maintain the observe-first posture; add enforce hooks only with explicit opt-in env vars (matching MK_DEEP_LOOP_GUARD_REJECT pattern).

3. **Should C-15 (unified quality gate) be a Claude hook, an OpenCode plugin, or both?** Both runtimes have the PostToolUse/tool.execute.after surface. Building both doubles maintenance but covers both agent surfaces. Recommendation: build the Claude hook first (simpler settings.json integration), then port to OpenCode plugin.

---

## 13. References

- `.opencode/plugins/README.md` — existing 7 plugin inventory
- `.claude/settings.json` — existing 8 Claude hooks
- `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`
- `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh`
- `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh`
- `.opencode/skills/sk-git/SKILL.md`
- `.opencode/skills/sk-git/manual_testing_playbook/safety-refusals/`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
- `.opencode/skills/system-spec-kit/scripts/check-links.sh`
- `.opencode/skills/system-spec-kit/scripts/validate-command-tree-parity.sh`
- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md`
- `.opencode/skills/mcp-code-mode/SKILL.md`
- `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/plugins/mk-deep-loop-guard.js`
- `.opencode/plugins/mk-dist-freshness-guard.js`
- `opencode.json`
- `iterations/iteration-001.md` through `iterations/iteration-005.md`

---

## 14. Convergence Report

| Field | Value |
|-------|-------|
| Stop reason | converged |
| Total iterations | 5 |
| Questions answered | 5/5 |
| Average newInfoRatio (last 3) | 0.50 |
| newInfoRatio trend | 1.0 → 0.8 → 0.7 → 0.5 → 0.3 (descending) |
| Total candidates identified | 18 |
| Quality guard: source diversity | PASS (12 skill families, 50+ scripts) |
| Quality guard: focus alignment | PASS (all candidates cite real skill paths) |
| Quality guard: no weak single source | PASS (all candidates cite ≥1 script + ≥1 pattern) |

---

## 15. Appendix: Candidate Quick-Reference Table

| ID | Candidate | Skill | Surface | Tier | Blast |
|----|-----------|-------|---------|------|-------|
| C-1 | Git Commit Message Guard | sk-git | PreToolUse/Bash + tool.execute.before | 1 | Medium |
| C-2 | Comment Hygiene PostToolUse | sk-code | PostToolUse/Write\|Edit | 1 | Low |
| C-3 | Spec Validation PostToolUse | system-spec-kit | PostToolUse/Write\|Edit | 2 | Low |
| C-4 | Code-Graph Re-index Trigger | system-code-graph | tool.execute.after + PostToolUse | 1 | Low |
| C-5 | Frontmatter Version Validator | sk-doc | PostToolUse/Write\|Edit | 1 | Low |
| C-6 | Flowchart Validator | sk-doc | PostToolUse/Write\|Edit | 3 | Low |
| C-7 | Small-Model Dispatch Advisory | sk-prompt | experimental.chat.system.transform | 3 | Low |
| C-8 | Design Anti-Slop Advisor | sk-design | PostToolUse/Write\|Edit | 3 | Low |
| C-9 | DQI Quality Score Feedback | sk-doc | tool.execute.after | 3 | Low |
| C-10 | Code-Mode Tool Budget Advisor | mcp-code-mode | tool.execute.before | 2 | Low |
| C-11 | CLI Dispatch Audit Trail | cli-external | tool.execute.after | 2 | Low |
| C-12 | Deep-Loop State Cleanup | system-deep-loop | session.created | 2 | Low |
| C-13 | Spec-Kit Completion Exposer | system-spec-kit | tool.register | 2 | Low |
| C-14 | Git Worktree Health Monitor | sk-git | session.created + SessionStart | 3 | Low |
| C-15 | Unified PostToolUse Quality Gate | sk-code+sk-doc+spec-kit | PostToolUse + tool.execute.after | 1 | Low |
| C-16 | Skill Advisor Effectiveness Tracker | system-skill-advisor | tool.execute.after | 3 | Low |
| C-17 | Smart Router Integrity Check | system-spec-kit | SessionStart + session.created | 3 | Low |
| C-18 | Broken Link Checker | system-spec-kit | PostToolUse/Write\|Edit | 3 | Low |
