# Iteration 028 — traceability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:22:48.910Z
- New findings: 4 (of 4 reported; prior total 108)
- Coverage: {"filesExamined":26,"keyPaths":[".opencode/agents/ai-council.md",".opencode/agents/deep-alignment.md",".opencode/agents/deep-improvement.md",".opencode/agents/deep-research.md",".opencode/agents/deep-review.md",".claude/agents/ai-council.md",".claude/agents/deep-review.md",".codex/agents/ai-council.toml",".codex/agents/deep-review.toml",".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs",".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",".opencode/agents/orchestrate.md",".codex/agents/orchestrate.toml"]}

## Summary
Examined all five deep-loop agent definitions across OpenCode, Claude, and Codex, plus their generators, mirror checks, and council persistence path. The prose bodies are largely synchronized, but runtime capability surfaces are not: Codex collapses scoped or denied permissions into workspace-write, and Claude lacks the detect_changes capability advertised by deep-review. AI-council also has no executable direct persistence path in non-shell runtimes and contradictory leaf/parent writer ownership. The mirror gate compares token sets only, so reordered safety-critical instructions can pass as synchronized.

## Findings
- [P0] F-028-01 Codex ai-council conversion loses the no-shell and scoped-write boundary @ .codex/agents/ai-council.toml:5
  - evidence: The Codex agent runs with sandbox_mode = "workspace-write", while the source agent denies bash at .opencode/agents/ai-council.md:10 and states that it never runs shell commands or writes outside packet-local ai-council artifacts at lines 27 and 31. The generated body still says Bash is denied, but the runtime setting permits workspace mutation; sync-agents.cjs hardcodes this mode for ai-council instead of deriving the source deny.
  - recommendation: Preserve the per-agent deny boundary in the Codex runtime or execute the agent behind a host-enforced packet-scoped writer. Do not rely on the embedded prose to prevent shell or out-of-scope mutation.
- [P1] F-028-02 Deep-review requires detect_changes in runtimes that do not expose it @ .claude/agents/deep-review.md:4
  - evidence: The Claude tools allowlist contains Read, Write, Edit, Bash, Grep, Glob, and memory MCP only; detect_changes is absent. The same definition instructs the agent to use detect_changes for local diffs at line 157 and lists it as a required code-intelligence tool at line 254. OpenCode explicitly allows detect_changes in its frontmatter, while the mirror checker strips frontmatter and compares only body tokens, so the current tool-surface loss is reported as synchronized.
  - recommendation: Expose the same detect_changes tool in Claude and Codex, or remove the unconditional instruction and route through a runtime-neutral capability check. Extend mirror validation to compare normalized tool capabilities, not only body text.
- [P1] F-028-03 AI-council persistence has no single executable writer authority @ .opencode/agents/ai-council.md:722
  - evidence: The agent requires direct use of the JavaScript persistence library so each artifact write emits an artifact_written event, but its frontmatter denies Bash and exposes no code-execution tool. The CLI wrapper only invokes the library when executed as a process at scripts/persist-artifacts.cjs:13-14. The agent says the leaf owns persistence and the parent need not invoke the helper at line 731, while orchestrator.md:163 separately requires the parent to invoke that helper after the leaf returns.
  - recommendation: Choose one writer authority. Prefer a host-owned, scoped persistence step after the leaf returns, then remove the leaf-direct-write claim; alternatively expose a dedicated scoped persistence tool and remove the parent fallback. Update all runtime mirrors together.
- [P1] F-028-04 Agent mirror validation ignores instruction ordering @ .opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:71
  - evidence: tokenizeBody converts each body into a Set, and compareBodyTokens only checks missing and unexpected tokens at lines 83-95. A read-only probe showed that 'STEP READ STATE THEN WRITE FINDINGS' and 'STEP WRITE FINDINGS THEN READ STATE' return matches=true, so reordered load-bearing workflow instructions pass the mirror gate.
  - recommendation: Compare canonical bodies structurally or byte-for-byte after a narrow allowlist of runtime substitutions, and separately validate frontmatter/tool-surface parity.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 28,
  "dimension": "traceability",
  "summary": "Examined all five deep-loop agent definitions across OpenCode, Claude, and Codex, plus their generators, mirror checks, and council persistence path. The prose bodies are largely synchronized, but runtime capability surfaces are not: Codex collapses scoped or denied permissions into workspace-write, and Claude lacks the detect_changes capability advertised by deep-review. AI-council also has no executable direct persistence path in non-shell runtimes and contradictory leaf/parent writer ownership. The mirror gate compares token sets only, so reordered safety-critical instructions can pass as synchronized.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "traceability",
      "title": "Codex ai-council conversion loses the no-shell and scoped-write boundary",
      "file": ".codex/agents/ai-council.toml",
      "line": 5,
      "evidence": "The Codex agent runs with sandbox_mode = \"workspace-write\", while the source agent denies bash at .opencode/agents/ai-council.md:10 and states that it never runs shell commands or writes outside packet-local ai-council artifacts at lines 27 and 31. The generated body still says Bash is denied, but the runtime setting permits workspace mutation; sync-agents.cjs hardcodes this mode for ai-council instead of deriving the source deny.",
      "recommendation": "Preserve the per-agent deny boundary in the Codex runtime or execute the agent behind a host-enforced packet-scoped writer. Do not rely on the embedded prose to prevent shell or out-of-scope mutation."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Deep-review requires detect_changes in runtimes that do not expose it",
      "file": ".claude/agents/deep-review.md",
      "line": 4,
      "evidence": "The Claude tools allowlist contains Read, Write, Edit, Bash, Grep, Glob, and memory MCP only; detect_changes is absent. The same definition instructs the agent to use detect_changes for local diffs at line 157 and lists it as a required code-intelligence tool at line 254. OpenCode explicitly allows detect_changes in its frontmatter, while the mirror checker strips frontmatter and compares only body tokens, so the current tool-surface loss is reported as synchronized.",
      "recommendation": "Expose the same detect_changes tool in Claude and Codex, or remove the unconditional instruction and route through a runtime-neutral capability check. Extend mirror validation to compare normalized tool capabilities, not only body text."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "AI-council persistence has no single executable writer authority",
      "file": ".opencode/agents/ai-council.md",
      "line": 722,
      "evidence": "The agent requires direct use of the JavaScript persistence library so each artifact write emits an artifact_written event, but its frontmatter denies Bash and exposes no code-execution tool. The CLI wrapper only invokes the library when executed as a process at scripts/persist-artifacts.cjs:13-14. The agent says the leaf owns persistence and the parent need not invoke the helper at line 731, while orchestrator.md:163 separately requires the parent to invoke that helper after the leaf returns.",
      "recommendation": "Choose one writer authority. Prefer a host-owned, scoped persistence step after the leaf returns, then remove the leaf-direct-write claim; alternatively expose a dedicated scoped persistence tool and remove the parent fallback. Update all runtime mirrors together."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Agent mirror validation ignores instruction ordering",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs",
      "line": 71,
      "evidence": "tokenizeBody converts each body into a Set, and compareBodyTokens only checks missing and unexpected tokens at lines 83-95. A read-only probe showed that 'STEP READ STATE THEN WRITE FINDINGS' and 'STEP WRITE FINDINGS THEN READ STATE' return matches=true, so reordered load-bearing workflow instructions pass the mirror gate.",
      "recommendation": "Compare canonical bodies structurally or byte-for-byte after a narrow allowlist of runtime substitutions, and separately validate frontmatter/tool-surface parity."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 26,
    "keyPaths": [
      ".opencode/agents/ai-council.md",
      ".opencode/agents/deep-alignment.md",
      ".opencode/agents/deep-improvement.md",
      ".opencode/agents/deep-research.md",
      ".opencode/agents/deep-review.md",
      ".claude/agents/ai-council.md",
      ".claude/agents/deep-review.md",
      ".codex/agents/ai-council.toml",
      ".codex/agents/deep-review.toml",
      ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",
      ".opencode/agents/orchestrate.md",
      ".codex/agents/orchestrate.toml"
    ]
  }
}
```