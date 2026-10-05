---
title: "Delivery Trace: Rule delivery debugging"
description: "How each executor receives the AGENTS.md rule mandates in an isolated test environment, compared with a live session in this repository."
trigger_phrases:
  - "rule delivery trace"
  - "isolated environment mandate delivery"
importance_tier: "normal"
contextType: "implementation"
---
# Delivery Trace: Rule delivery debugging

## 1. FINDING

The isolated environments that phases 007 and 008 used deliver the AGENTS.md mandates to Devin only. They carry no project-level `AGENTS.md`, so Codex and OpenCode run without either mandate and reach the rules only by finding the file `REPO RULES.md` in a directory listing. A live session in this repository loads the root `AGENTS.md` as a project document, so live delivery differs from what the environments measured.

## 2. PER EXECUTOR

- **Devin (DeepSeek V4.1 Flash, SWE-2 Max):** loads `~/.claude/CLAUDE.md`, a symlink to the repository `AGENTS.md`, as an always-on rule truncated at 16,384 bytes. The Gate 5 heading starts at byte 8,577 and the reply-rule load line at byte 14,907, both inside the cut. Both mandates are delivered.
- **Codex (GPT-6 Luna):** loads `~/.codex/AGENTS.md`, a symlink to the repository's `.codex/AGENTS.md` (10,361 bytes), which never mentions `REPO RULES`, `communication.md` or Gate 5. A Luna rollout's session metadata, turn context and instruction messages carry no mandate text. Neither mandate is delivered. In the 115 runs of the 008 `full` arm, the first mention of `REPO RULES` was Luna's own listing command in 99 runs (`ls`, `rg --files`, `find`), hook output in 11 and absent in 5. One run searched `find .. -name AGENTS.md` and found none.
- **OpenCode (DeepSeek V4.1 Flash through OpenCode Go and Cline):** the global config `~/.config/opencode/opencode.jsonc` holds only its schema line, and no global `AGENTS.md` sits beside it. Neither mandate is delivered. In the 30 OpenCode Go runs of 008, the first mention of `REPO RULES` came from the model's own `bash` listing in 23 runs, a `glob` in 6 and a `read` in 1.

## 3. CONSEQUENCES

- **For 009:** arms vary the instructions through a project-level `AGENTS.md`, a copy of the repository's root file placed in the environment, because that is how Codex and OpenCode receive it live. This settles REQ-008.
- **For 007 and 008:** both arms of each experiment shared the same environment, so their comparisons stand. Their delivery rates for Luna and the OpenCode strata measure discovery, not AGENTS.md delivery, and do not predict live delivery.
- **Misses in the 007 and 008 control arms:** a Luna or OpenCode miss there is `not delivered` by construction. A Devin miss is `seen and skipped` unless its transcript shows otherwise.
