# Iteration 2: OpenCode Plugin Candidates

## Focus

Map net-new plugin ideas to exact OpenCode surfaces, using current plugin implementation patterns and skill-owned deterministic contracts.

## Actions Taken

1. Re-read lineage config, state, and strategy before research.
2. Inspected existing `tool.execute.before`, `session.created/deleted`, and `experimental.chat.system.transform` implementations.
3. Confirmed `tool.execute.after` is recognized by the repository's plugin purity test and installed SDK evidence.
4. Read additional source skills for OpenCode implementation, external MCP routing, and design audit evidence boundaries.

## Findings

### Candidate OC-1: Spec Mutation Gate

- **Source skill:** `system-spec-kit`.
- **Surface:** OpenCode `tool.execute.before` for `write`, `edit`, `patch`, `apply_patch`, and mutation-shaped `bash` calls.
- **Behavior:** classify the session's established spec-folder choice and block only when a mutation is attempted with no Gate 3 answer. Keep prompt classification advisory; enforce at the first actual mutation to reduce false positives.
- **Why this fits:** the source skill makes spec documentation mandatory for file modifications but explicitly exempts read-only work and operator skip, which is naturally evaluated at mutation time. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:28-61]
- **Pattern evidence:** current guards already normalize tool names and inspect `output.args` in `tool.execute.before`. [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:57-89]

### Candidate OC-2: Git Safety Guard

- **Source skill:** `sk-git`.
- **Surface:** OpenCode `tool.execute.before` for `bash`.
- **Behavior:** parse high-confidence git command shapes and reject direct branch creation, force-push to main/master, broad `git add -A` in dirty/shared trees, or commit attempts lacking the required inspection sequence. Start warn-only except for unambiguous destructive patterns.
- **Why this fits:** the blocking core is deterministic and source-owned; nuanced authorization cases remain advisory. [SOURCE: .opencode/skills/sk-git/SKILL.md:291-317] [SOURCE: .opencode/skills/sk-git/SKILL.md:459-469]
- **Pattern evidence:** the dist guard already safely extracts Bash command text and applies a regex before execution. [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:24-44] [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:172-183]

### Candidate OC-3: Post-Edit Quality Router

- **Source skill:** `sk-code/code-quality`.
- **Surface:** OpenCode `tool.execute.after` for mutating file tools.
- **Behavior:** after a successful write/edit/patch, resolve the target-path checklist and run only cheap checks: comment hygiene for comment-capable files, descriptor/schema checks for `.opencode/`, and dist-cache invalidation when a watched source changed. Surface a bounded brief on the next `experimental.chat.system.transform` rather than writing to stdout/stderr.
- **Why this fits:** `code-quality` already has deterministic target-path routing and a Claude PostToolUse counterpart. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:54-136]
- **Runtime feasibility:** `tool.execute.after` is a recognized valid plugin hook in repository tests, and existing plugin standards require user-visible output through context/tools/logs rather than terminal output. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts:25] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125]

### Candidate OC-4: External MCP Route Guard

- **Source skill:** `mcp-code-mode`.
- **Surface:** OpenCode `tool.execute.before` for external `mcp__*` calls, excluding native MCP allowlisted families.
- **Behavior:** warn when an external MCP call bypasses Code Mode; optionally block only after the tool-family classifier proves the target is external. Include the exact Code Mode callable naming hint in a bounded context notice.
- **Why this fits:** the skill mandates Code Mode for external MCPs while explicitly exempting native file/search/shell and continuity surfaces. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:14-42]
- **Risk control:** do not infer from every `mcp__` prefix; use the registered native-vs-external manifest, because false blocking would break Spec Memory and native reasoning tools.

### Candidate OC-5: Completion Evidence Sentinel

- **Source skills:** `system-spec-kit` and `sk-code/code-quality`.
- **Surface:** OpenCode `session.idle` event, with `experimental.chat.system.transform` for the next-turn warning.
- **Behavior:** when the latest assistant turn contains a completion claim, check whether required validation/checklist evidence exists in session telemetry; log and inject a warning if not. Never run broad tests automatically at idle.
- **Why this fits:** both source skills distinguish quality/advisory gates from final verification and require evidence before completion claims. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:59-65] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:162-175]
- **Pattern evidence:** `mk-goal` already consumes `session.idle` and message evidence, proving the event is usable for bounded turn-end supervision. [SOURCE: .opencode/plugins/mk-goal.js:2868-2901]

### Candidate OC-6: Session Readiness Primer

- **Source skills:** `system-spec-kit`, `system-skill-advisor`, and `system-code-graph` integration contracts.
- **Surface:** OpenCode `session.created`, with `experimental.chat.system.transform` to inject one bounded readiness status.
- **Behavior:** perform a cheap warm-daemon readiness probe and disclose degraded memory/graph/advisor status once per session. It must not duplicate full memory or advisor briefs.
- **Why this fits:** current plugins already use `session.created` for bounded refresh and `session.deleted` for cache cleanup. [SOURCE: .opencode/plugins/mk-spec-memory.js:288-309] [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:185-205]
- **Overlap control:** emit only health/degraded-state facts; continuity and recommendations remain owned by existing plugins.

## Questions Answered

- Which additional OpenCode plugins are justified, and which exact supported surfaces should host them?

## Questions Remaining

- Which Claude hooks provide equivalent timing for these contracts?
- Which candidates should ship first?
- Which semantic or overlapping ideas should be eliminated?

## Ruled Out

- **Automatic full quality suite on every `tool.execute.after`:** too expensive and likely to create edit latency; only cheap path-specific checks belong there. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:87-110]
- **Design-audit auto-scoring after UI edits:** the skill requires visual evidence, register context, and explicit evidence labels; a file-write hook cannot prove those conditions. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-117] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:136-169]
- **Blocking all `mcp__*` calls:** native MCP exemptions make that classifier incorrect. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:32-42]

## Dead Ends

- Reading a mid-file slice of `mk-goal.js` exposed evidence extraction but not the hook return block; exact event names from repository search were sufficient for this iteration.

## Edge Cases

- Ambiguous input: `session.*` is represented by event types such as `session.created`, `session.idle`, and `session.deleted`, not object keys named `session.*`.
- Contradictory evidence: an archived document says `tool.execute.after` could not intercept results, while current repository tests and newer installed-SDK evidence recognize it; current evidence wins. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts:25]
- Missing dependencies: no runtime smoke test was performed because this is research-only.
- Partial success: OpenCode mappings are complete; Claude parity remains.

## Sources Consulted

- `.opencode/plugins/mk-deep-loop-guard.js:1-92`
- `.opencode/plugins/mk-dist-freshness-guard.js:24-218`
- `.opencode/plugins/mk-spec-memory.js:270-309`
- `.opencode/skills/system-spec-kit/SKILL.md:28-65`
- `.opencode/skills/sk-code/code-quality/SKILL.md:54-175`
- `.opencode/skills/sk-code/code-opencode/SKILL.md:120-125`
- `.opencode/skills/sk-git/SKILL.md:291-317,459-469`
- `.opencode/skills/mcp-code-mode/SKILL.md:14-42`
- `.opencode/skills/sk-design/design-audit/SKILL.md:95-169`

## Assessment

- New information ratio: 0.86
- Novelty justification: Six concrete OpenCode candidates and three eliminated variants were newly mapped; one candidate family partially reused the iteration-1 quality finding.
- Questions addressed: OpenCode surfaces, feasibility, overlap, and initial risk controls.
- Questions answered: exact OpenCode candidate mappings.

## Reflection

- What worked and why: implementation reads of existing plugins provided concrete adapter, caching, and no-console patterns.
- What did not work and why: broad `tool.execute.after` search included archived and sibling-lineage artifacts, so current tests and source skills were privileged.
- What I would do differently: read checked-in Claude hook configuration and shared hook scripts first in the next pass.

## Recommended Next Focus

Map equivalent Claude hooks, distinguishing true timing parity from runtime-specific approximations, then rank the combined candidate set.
