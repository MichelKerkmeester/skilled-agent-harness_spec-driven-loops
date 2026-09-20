---
title: "Implementation Summary: design agent alignment"
description: "The design agent now routes between deciding UI values and measuring an existing surface, instead of declining every authoring request."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/017-design-skill/002-agent-alignment"
    last_updated_at: "2026-08-28T12:28:51Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Rewrote the design agent across its runtime copies"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files:
      - ".opencode/agents/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-agent-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-agent-alignment |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `design` agent was written when extraction was the only design capability left standing. It called itself an extraction specialist, loaded `sk-design-md-generator` unconditionally, and sent anyone asking it to decide a value away — routing that work to "a separate design-spec decision" that did not exist when the line was written. `sk-design` is now that decision, so the agent was declining requests it is meant to serve.

### Routing before loading

The agent now answers one question first: which artifact does the request want as its deliverable? A style reference or `tokens.json` to be produced routes to measurement; a value, critique or change to an interface routes to `sk-design`; a request needing both measures first. Existence is deliberately not the test — a running dashboard someone calls ugly exists, and a reference authored from a brief does not. That choice is named in the result, so a misroute is visible rather than silent.

### Two paths, one precedence

The measure path preserves the existing pipeline behavior unchanged — phase detection, readiness check, extract-write-validate, fidelity gate. The decide path is new: load `sk-design`, detect build versus improve versus review, load only the references the intent scores for, and answer with scale steps rather than adjectives.

Where both apply, one rule settles it, worded as both skills already word it: a measurement outranks a default for the surface it covers. The agent also carries the reading-versus-authoring caveat, so a measured type ratio is treated as an observation rather than an instruction to generate the next size by multiplication.

### Conformance to the agent contract

The first rewrite renamed `## 1. CORE WORKFLOW` to `## 1. ROUTING`, which dropped a section the agent document type requires. The validator caught it in every runtime copy; the pre-change agent had been valid, so the regression was introduced here rather than inherited.

The body was restructured to the canonical order the template and the other fleet agents use — hard boundary at `## 0`, `CORE WORKFLOW` at `## 1`, then capability scan, quality gates, output format, rules, output verification, anti-patterns and related resources. Three required sections the original never had were added: the capability scan, an explicit output-verification checklist, and a named anti-patterns table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/design.md` | Modified | Canonical agent: new description and full body |
| `.claude/agents/design.md` | Modified | Same body, Claude frontmatter preserved |
| `.cursor/agents/design.md` | Inherited | A symlink to the Claude file; it resolves the change rather than carrying a copy |
| `.pi/agents/design.md` | Modified | Same body, Pi frontmatter preserved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime copies share a body except one deliberately per-runtime line, the Path Convention pointer, so the body was authored once and spliced into each real file with that line and its own permission or tool block preserved. `.cursor` is a symlink to the Claude file and needed no edit; three files were written, not four. The description line is what the advisor reads, so it was rewritten in all four to name both skills.

Verification was cheap and concrete: every reference the agent cites was checked against disk — nine under `sk-design`, three under `sk-design-md-generator` — and the post-frontmatter body was diffed across runtimes to prove it stayed in sync.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route before loading a skill | Loading the wrong skill first wastes the turn and biases the answer toward that skill's job |
| Keep the measure path unchanged | It works; the gap was the missing half, not the existing one |
| State precedence in the agent, not only in the skills | An agent that has loaded one skill will not read the other's boundary note |
| Author the body once and splice | The four copies were already identical below the frontmatter; editing them separately invites drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Agent contract | PASS. All four report VALID against `--type agent`, each with the single `## 0.` numbering warning every fleet agent carries |
| Cited paths resolve | PASS. Every backticked token that is a filesystem path resolves; the remainder are bare artifact names, a command token and a glob |
| Command contract | PASS. `/design:extract` reports VALID against `--type command`, zero issues, so the command surface needed no change |
| Cross-runtime body sync | PASS. Bodies identical below frontmatter except the Path Convention line, which is per-runtime by design and was verified against each runtime's sibling agents |
| Command mapping intact | PASS. `/design:extract` still resolves and maps to the measure path |
| Authoring no longer declined | PASS. No rule sends a decide request out of scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Routing is judgment, not a scorer.** The agent decides measure versus decide from the request text. A prompt that names a URL but wants new direction could route to measurement first; the both-apply branch covers it, but nothing enforces the choice.
2. **No dispatch test exercises the new path.** The checks are static: paths resolve and bodies match. Whether a real dispatch picks the right path has not been measured.
<!-- /ANCHOR:limitations -->

---
