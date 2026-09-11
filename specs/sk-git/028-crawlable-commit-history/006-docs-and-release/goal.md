---
title: "Goal: Phase 6: docs and release"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/006-docs-and-release"
    last_updated_at: "2026-09-11T09:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: docs and release

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Document and release the capability: sk-git README, changelog v1.6.0.0, advisor vocabulary, leaf manifest, skill-root metadata gate, and the parent packet closeout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | README follows sk-doc create-readme and SKILL.md follows create-skill. Both pass validate_document.py. |
| D2 | sk-git stays class S: no description.json, mode-registry.json or hub-router.json at its root. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] changelog/v1.6.0.0.md exists and SKILL.md version matches it
- [ ] validate_document.py exits 0 for README.md and SKILL.md
- [ ] package_skill.py --check and ci-skill-root-metadata.cjs exit 0 for sk-git
- [ ] validate.sh specs/sk-git/028-crawlable-commit-history --strict --recursive prints RESULT: PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| README, changelog, version | Done | `dcdf2f8441`, VALID x3, package PASS |
| Vocabulary and manifests | Done | `8d5acf93d5`, gate 13/13 |
| Rule and AGENTS.md | Done | `581e2862a5` |

### Deviations and findings

| Item | Note |
|------|------|
| Advisor probe | Ran after the merge: sk-git 0.95, score 0.80 |
<!-- /ANCHOR:log -->
