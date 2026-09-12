---
title: "Feature Specification: Smart rule injection via hooks"
description: "Decide from repository evidence which repo rules, if any, are better served by a prompt-time injection hook than by the Gate 5 load, and design the selectivity that keeps injection off most turns."
trigger_phrases:
  - "smart rule injection"
  - "inject a rule at prompt time"
  - "hook instead of gate 5"
  - "rule that binds on a read-only turn"
  - "injection selectivity"
  - "stop embedding on every message"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded the packet and launched phase 001 research"
    next_safe_action: "Read the ten iterations, verify citations, decide scope"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "REPO RULES.md"
      - "repo-rules/"
      - ".opencode/hooks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 0
---

# Feature Specification: Smart rule injection via hooks

## 1. PROBLEM

Repo rules load at Gate 5, which fires on the first write of a session. A read-only turn
never fires it, so a rule whose obligation binds while reading is silent at exactly the
moment it is needed. The prior research round hit this twice: a context-gathering rule and
a design-loading rule were both refused because a rule file cannot reach a read-only turn.

A prompt-time hook can reach those turns. The question is whether it should, and for which
rules.

## 2. THE CONSTRAINT THAT SHAPES THE ANSWER

Injection that fires on every message is noise, and noise trains the reader and the model
to skim the one message that mattered. Any design this packet accepts must say when the
hook stays silent, not only when it fires. A proposal without a silence condition is
incomplete regardless of how good its trigger is.

## 3. PORTABILITY

The rule corpus is shared by symlink across three repositories whose skills are independent
directories. A hook that injects rule content inherits that problem: it must work in a repo
whose layout differs. Hub names are stable across repos; paths inside hubs are not.

## 4. PHASES

- **001-deep-research** — ten iterations, no early convergence, DeepSeek V4.1 Flash at max
  thinking. Decide from evidence which rules qualify, what the silence condition is, and
  whether the existing hook surface can carry it.
- Later phases depend on what 001 returns and are deliberately not pre-named. A research
  round whose phases are fixed in advance has decided its answer.

## 5. ACCEPTANCE

- Every claim in the research carries a citation that resolves.
- A refusal is an acceptable outcome and must be recorded with the test that produced it.
- No phase past 001 is scaffolded before 001 is read.
