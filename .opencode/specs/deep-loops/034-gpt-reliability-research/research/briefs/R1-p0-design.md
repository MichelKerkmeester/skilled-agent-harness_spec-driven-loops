# Research Brief R1 — P0 design: exact text for the Gate-3 precedence bridge + autonomous execution profile

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the design.

## Context (established by prior verified research)

The single most replicated GPT failure in this repo: on autonomous deep-loop
command invocations, GPT halts with the repo's Gate-3 spec-folder question
instead of executing. Root mechanisms, already verified: (1) the Gate-3 text is
an unconditional priority hard stop and its recovery block contains the exact
halt template GPT reproduces; (2) the machine classifier lists `/deep:*` and
`:auto` as Gate-3 triggers; (3) the `:auto` setup flow binds a spec_folder but
NO text anywhere states that binding satisfies Gate 3; (4) no "autonomous
execution profile" exists that scopes repo-wide gates for command-scoped runs.

## Your task — produce READY-TO-APPLY design text (before/after blocks)

Read first (repo-root relative):
1. `AGENTS.md` — the section "GATE 3: SPEC FOLDER QUESTION" (~lines 126-138)
   and "VIOLATION RECOVERY" (~176-181). (CLAUDE.md is a symlink to this file.)
2. `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` — the
   exported API and the resume-trigger inventory.
3. `.opencode/commands/deep/assets/deep_review_presentation.txt` lines 1-70 —
   the `:auto` three-tier setup that binds spec_folder.

Then draft, as fenced before/after blocks with exact file targets:

### Deliverable 1 — Gate-3 autonomous-precedence rule
The minimal text insertion into the Gate-3 section (and the one-line
adjustment to VIOLATION RECOVERY if needed) that establishes: a command
contract declaring autonomous execution whose setup flow has validly bound a
spec_folder (flags / PRE-BOUND SETUP ANSWERS / target-path resolution) HAS
answered Gate 3 for that run; the generic A-E prompt is only for interactive
sessions with unknown ownership. Keep the rule tight enough that interactive
sessions and ambiguous write prompts still ask.

### Deliverable 2 — classifier "triggered-but-satisfied" API sketch
The TypeScript signature + result-shape change for `classifyPrompt()` (or a
wrapper) expressing satisfied-by: 'prebound_spec_folder' | 'prior_answer' |
null, with the exact inputs the caller must pass (executionMode,
boundSpecFolder, commandContract) and 4-6 test-case one-liners covering:
autonomous+bound → satisfied; autonomous+unbound → triggered; interactive
write → triggered; read-only research → not triggered.

### Deliverable 3 — the autonomous execution profile prelude
Max 8 numbered rules, <= 120 words total, that an autonomous command-scoped
GPT session receives FIRST (before any repo policy): command contract
authority, write boundary, read-before-edit, scope lock, no documentation
questions when the contract binds ownership, verify-if-code-changed, halt
condition, output contract pointer. Word it so it cannot be read as licensing
scope creep.

## Output contract (strict)
Markdown, no preamble. Three sections titled DELIVERABLE 1/2/3, each with
before/after fenced blocks (or signature sketch + tests for D2). No
meta-commentary. Precision over breadth.
