AGENTS DIRECTORY
================

This directory contains agent definitions for the Claude Code runtime.
Each .md file carries a `tools:` frontmatter line and behavioral instructions, and is
symlinked to by the .cursor and .devin trees.

Sibling runtime: .skilled/agents/ (.md)
Inventory rule: if an agent file is not present in this directory, it is not a live runtime surface here.

Translation contract: .skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md
  How every frontmatter declaration lands in each runtime tree, which differences are sanctioned,
  and what stands in for a declaration a runtime cannot carry.
Model and effort: no agent file here pins a model except context, markdown and Explore.
  All three declare `model: haiku`. That value is a default: a model passed on the Agent call wins over it, and so
  do dispatched routes, which pass model and effort explicitly. Every other agent inherits the
  runtime default, so a silent file means no pin, not an unowned setting.
Claude-only: Explore is not a roster agent. Claude Code resolves a subagent by exact name and lets
  a file here replace its built-in Explore, so the file carries `name: Explore` and has no
  mirror in the other runtimes. The roster check and the symlink sync both skip it.

Agents:
  ai-council:       multi-strategy AI Council planning, writes only ai-council artifacts
  code:             application-code implementation via sk-code, write-capable LEAF dispatched only by orchestrate
  context:          retrieval-first context agent with canonical continuity recovery, read-only
  debug:            user-invoked fresh-perspective debugger, 5-phase root-cause method, never auto-dispatched
  deep-improvement: proposal-only mutator for bounded agent improvement, evaluator-first
  deep-research:    autonomous deep-research iterations with externalized state
  deep-review:      deep-review iteration agent, one dimension per pass with P0/P1/P2 findings
  design:           design specialist across two skills: decides UI values via sk-design, measures a live surface into a Style Reference via sk-design-md-generator, LEAF
  markdown:         template-first markdown and documentation executor for /create:* commands and spec docs
  orchestrate:      senior multi-agent orchestration, decomposition, delegation and synthesis
  prompt-improver:  prompt-engineering specialist, framework selection and CLEAR validation
  review:           read-only code-review specialist, pattern validation and quality scoring
