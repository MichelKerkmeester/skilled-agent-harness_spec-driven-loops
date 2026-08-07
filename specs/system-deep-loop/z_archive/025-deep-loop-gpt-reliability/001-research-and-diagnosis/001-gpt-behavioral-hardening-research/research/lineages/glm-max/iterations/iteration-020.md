# Iteration 20: Propagation Scope: File Path Enumeration (KQ8)

**Focus track:** propagation | **Status:** complete

## Focus
Enumerate concretely (file paths) which commands/skills beyond orchestrate.md and deep.md need the same literal-safe hardening treatment.

## Findings
- **Path #1: .opencode/agents/orchestrate.md (deep-dispatch path :95-105,:207) — KQ4 hardening.** [SOURCE: orchestrate.md:95-105,207]
- **Path #2-5: the 4 deep command entry points — .opencode/commands/deep/{research,review,context,ai-council}.md — each needs a mandatory Resolved-route header at its seam (../001 §3 specified; verify landed + enforce as mandatory not optional).** [SOURCE: ../001/research.md §3; commands/deep/*.md]
- **Path #6: .opencode/agents/deep.md — already literal-safe, but its Deep Route header (deep.md:69-75) is the canonical template the others copy; keep as the reference.** [SOURCE: deep.md:69-75]
- **Path #7: the CLI executor prompt seam in cli-opencode (no agent flag, positional message) — the route header is the only identity carrier; make it structurally mandatory there.** [SOURCE: ../001/research.md §3.1; cli-opencode/SKILL.md]
- **Path #8 (new): system-skill-advisor hook surface — co-locate the KQ5 enforcement plugin here so route-proof is asserted at dispatch against mode-registry.json.** [SOURCE: mode-registry.json:10-16; iter 14]
- **Cross-runtime mirrors: .claude/agents/{orchestrate,deep,ai-council}.md must receive the SAME edits; Codex parity is blocked (TOML-location contradiction, ../001 §8) and stays out of scope.** [SOURCE: ../001/research.md §8; .claude/agents/*.md]

## Sources Consulted
- orchestrate.md
- commands/deep/*.md
- deep.md
- cli-opencode/SKILL.md
- mode-registry.json
- system-skill-advisor
- ../001/research.md §3,§3.1,§8
- .claude/agents/*.md

## Assessment
- **newInfoRatio:** 0.58
- **Novelty justification:** Produces a concrete 8-path propagation list (6 in-scope, mirrors required, Codex explicitly deferred) with the command-seam mandatory-not-optional distinction.
- **Confidence:** 0.85
- **Key questions considered:** KQ8
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Enumerating paths before scoping keeps the propagation list auditable.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Codex (.codex/agents or .opencode/agents/*.toml) parity in this work**: mirror-location contradiction unresolved (../001 §8); out of scope [SOURCE: ../001/research.md §8]

## Recommended Next Focus
KQ8 deepening: audit the deep-loop command/agent family for additional routing seams the list may have missed.
