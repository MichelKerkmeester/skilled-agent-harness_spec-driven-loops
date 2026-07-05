AGENTS DIRECTORY
================

This directory contains agent definitions for the Claude Code runtime.
Each .md file defines one agent surface with frontmatter (tools, permissions, model)
and behavioral instructions.

Sibling runtimes: .opencode/agents/ (.md) and .codex/agents/ (.toml)
Inventory rule: if an agent file is not present in this directory, it is not a live runtime surface here.

Agents:
  ai-council:       multi-strategy AI Council planning, writes only ai-council artifacts
  code:             application-code implementation via sk-code, write-capable LEAF dispatched only by orchestrate
  context:          retrieval-first context agent with canonical continuity recovery, read-only
  debug:            user-invoked fresh-perspective debugger, 5-phase root-cause method, never auto-dispatched
  deep-improvement: proposal-only mutator for bounded agent improvement, evaluator-first
  deep-research:    autonomous deep-research iterations with externalized state
  deep-review:      deep-review iteration agent, one dimension per pass with P0/P1/P2 findings
  markdown:         template-first markdown and documentation executor for /create:* commands and spec docs
  orchestrate:      senior multi-agent orchestration, decomposition, delegation and synthesis
  prompt-improver:  prompt-engineering specialist, framework selection and CLEAR validation
  review:           read-only code-review specialist, pattern validation and quality scoring
