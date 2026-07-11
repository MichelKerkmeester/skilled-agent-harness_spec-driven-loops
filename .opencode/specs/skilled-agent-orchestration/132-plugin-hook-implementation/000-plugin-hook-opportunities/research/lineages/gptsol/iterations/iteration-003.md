# Iteration 3: Claude Mapping and Prioritization

## Focus

Map skill-grounded opportunities to Claude's checked-in hook surfaces, identify cross-runtime parity limits, prioritize the combined set, and close remaining questions.

## Actions Taken

1. Re-read lineage config, state, and strategy.
2. Inspected live `.claude/settings.json` wiring for all requested Claude surfaces.
3. Read the current PostToolUse quality hook, CLI dispatch PreToolUse hook, and deep-loop Task PreToolUse hook.
4. Read the OpenCode hook reference's parity and ownership rules.

## Findings

### Candidate CL-1: Spec Mutation Gate

- **Source skill:** `system-spec-kit`.
- **Surface:** Claude `UserPromptSubmit` for advisory classification plus `PreToolUse` matchers `Write|Edit|Bash` for enforcement at actual mutation.
- **Behavior:** persist the session's Gate 3 answer from the prompt hook; at mutation time deny only when no valid answer exists. This two-stage design preserves the hard "ask first" rule without blocking read-only turns on prompt keywords alone. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:28-61]
- **Parity:** direct timing parity with OpenCode OC-1 only at `PreToolUse`; Claude additionally has a first-class prompt hook for classification.

### Candidate CL-2: Git Safety Guard

- **Source skill:** `sk-git`.
- **Surface:** Claude `PreToolUse` matcher `Bash`.
- **Behavior:** extend the existing dispatch-only preflight into a composable Bash policy chain that catches unambiguous destructive git forms and emits deny/advisory JSON using the established hook contract. [SOURCE: .opencode/skills/sk-git/SKILL.md:291-317] [SOURCE: .opencode/skills/sk-git/SKILL.md:459-469]
- **Feasibility evidence:** the current CLI preflight already fast-exits unrelated Bash, fails open on internal errors, and returns `permissionDecision: deny` for hard violations. [SOURCE: .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:1-85]

### Candidate CL-3: Expanded Post-Edit Quality Router

- **Source skill:** `sk-code/code-quality`.
- **Surface:** Claude `PostToolUse` matcher `Write|Edit` (extend the existing hook; do not register a second competing entry).
- **Behavior:** retain comment-hygiene and dist-staleness checks, then add cheap target-path validators for skill/agent/command/config/spec files. Keep it warn-only and deadline-aware.
- **Feasibility evidence:** the existing hook already parses stdin, bounds itself to nine seconds, runs two shared checkers, and always exits zero. [SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:1-28] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:44-136]
- **Parity:** direct timing parity with OpenCode OC-3 `tool.execute.after`.

### Candidate CL-4: External MCP Route Guard

- **Source skill:** `mcp-code-mode`.
- **Surface:** Claude `PreToolUse` with matchers for registered external MCP tools or a generated matcher set.
- **Behavior:** advise or deny direct external MCP calls that bypass Code Mode, using a manifest-based native-family allowlist. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:14-42]
- **Parity:** direct timing parity with OpenCode OC-4, but Claude's matcher registration may require regeneration when MCP inventory changes.

### Candidate CL-5: Completion Evidence Sentinel

- **Source skills:** `system-spec-kit` and `sk-code/code-quality`.
- **Surface:** Claude `Stop`.
- **Behavior:** inspect the just-finished turn for completion language and verify the session recorded the required strict validation/checklist/verification evidence. Return a bounded warning or block only when an unequivocal completion claim lacks a mandatory gate. Compose with the existing async `session-stop.js`; do not replace accounting. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:59-65] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:162-175]
- **Live wiring:** `Stop` already invokes `session-stop.js`; an extension should share that owner rather than add an unordered competitor. [SOURCE: .claude/settings.json:87-99]
- **Parity:** approximate parity with OpenCode `session.idle`; event semantics differ and must not share transport code.

### Candidate CL-6 / OC-7: Incremental Code-Graph Freshness

- **Source skill:** `system-code-graph`.
- **Surfaces:** Claude `PostToolUse` matcher `Write|Edit`; OpenCode `tool.execute.after`.
- **Behavior:** invalidate graph freshness for changed source files and queue a bounded warm-daemon incremental scan. Never cold-start the daemon from a prompt-time path.
- **Grounding:** code-graph SessionStart wiring intentionally lives under `system-spec-kit` and crosses a stable boundary; a new post-edit adapter should preserve that ownership asymmetry rather than invent a second graph hook home. [SOURCE: .opencode/skills/system-code-graph/references/runtime/naming_conventions.md:77-87]
- **Parity:** direct post-mutation timing parity, implemented through runtime-specific adapters over one shared classifier.

## Prioritization

| Rank | Candidate | Value | Feasibility | False-positive / blast-radius posture |
|---:|---|---|---|---|
| 1 | Git Safety Guard (OC-2 / CL-2) | Very high | High | Block only exact destructive forms; warn nuanced cases |
| 2 | Spec Mutation Gate (OC-1 / CL-1) | Very high | Medium | Requires reliable per-session Gate 3 state; fail closed only at actual mutation |
| 3 | Expanded Post-Edit Quality Router (OC-3 / CL-3) | High | High | Warn-only, cheap checks, strict deadline |
| 4 | Incremental Code-Graph Freshness (OC-7 / CL-6) | High | Medium | Warm-only, debounce, changed-file scope |
| 5 | Completion Evidence Sentinel (OC-5 / CL-5) | High | Medium | Advisory first; completion-language classifier can overmatch |
| 6 | External MCP Route Guard (OC-4 / CL-4) | Medium | Medium | Manifest allowlist required; warn-first |
| 7 | Session Readiness Primer (OC-6) | Medium | High | High overlap with current advisor/memory/graph startup briefs |

## Questions Answered

- Which Claude hooks are justified and which exact surfaces should host them?
- How should the combined candidates be prioritized?
- Which attractive ideas should be ruled out?

## Questions Remaining

- Implementation-time smoke tests must confirm matcher composition, `tool.execute.after` output shape, Stop blocking semantics, and incremental graph debounce behavior.

## Ruled Out

- **A second Claude PostToolUse entry for quality:** extend the existing owner to avoid duplicate checks and ordering ambiguity. [SOURCE: .claude/settings.json:112-123]
- **A second UserPromptSubmit advisor:** the live hook already owns prompt-time advice; Gate 3 classification should be a bounded extension or shared module. [SOURCE: .claude/settings.json:36-47]
- **SessionEnd completion verification:** SessionEnd is too late to correct a false completion claim and already owns cleanup. [SOURCE: .claude/settings.json:100-110]
- **Stop-time test execution:** Stop fires at turn boundaries; broad tests would add unpredictable latency and re-entrancy. The sentinel should verify recorded evidence, not generate it.
- **One shared transport implementation across Claude and OpenCode:** hook entrypoints are runtime-loaded and runtime-specific; share policy/checker cores only. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:50-70] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:166-175]

## Dead Ends

- No `.claude/settings*.json` glob match was returned by the initial pattern despite the exact file existing; exact Grep/Read resolved the live wiring.
- Broad hook search again included archived and sibling lineage records; live settings and source files were treated as authoritative.

## Edge Cases

- Ambiguous input: parity means equivalent lifecycle timing, not identical event names or shared adapter code.
- Contradictory evidence: the hook reference's Stop command includes combined cleanup prose while current settings split Stop and SessionEnd; current `.claude/settings.json` is the live wiring source. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:74-88] [SOURCE: .claude/settings.json:87-110]
- Missing dependencies: implementation smoke tests were intentionally not run in research-only mode.
- Partial success: all research questions are answered, with implementation validation gaps explicitly retained.

## Sources Consulted

- `.claude/settings.json:13-123`
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:1-136`
- `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:1-85`
- `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs:1-78`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:14-175`
- `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:77-87`

## Assessment

- New information ratio: 0.72
- Novelty justification: Six Claude mappings, one added cross-runtime code-graph candidate, a ranked roadmap, and five additional eliminations were new; the underlying candidate families partially reused earlier findings.
- Questions addressed: Claude surfaces, parity, prioritization, overlap, false-positive risk, and blast radius.
- Questions answered: all five charter questions.

## Reflection

- What worked and why: live `.claude/settings.json` plus skill-owned hook sources exposed real matcher, timeout, output, and ownership contracts.
- What did not work and why: repository-wide search remained noisy; exact live wiring was decisive.
- What I would do differently: implementation planning should begin with shared policy cores and one adapter per runtime, not paired copy-paste scripts.

## Recommended Next Focus

Legal convergence: synthesize the combined roadmap, preserve implementation-time validation gaps, and avoid a fourth iteration that would only restate already-mapped candidates.
