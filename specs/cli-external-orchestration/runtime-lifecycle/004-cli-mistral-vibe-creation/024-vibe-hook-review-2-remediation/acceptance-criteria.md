---
title: "Acceptance Criteria: Phase 24: vibe-hook-review-2-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vibe hook review 2 remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 24: vibe-hook-review-2-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-cli-mistral-vibe-creation/024-vibe-hook-review-2-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a shell payload, When its `tool_name` is `process.start` or `file_system.bash`, Then env-secret-guard and git-message-gate and dispatch-preflight deny it and spec-gate annotates it, the same for both names | `.vibe/plugins/repo-guards/lib/hook-io.mjs:56`; `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs:89`, `.vibe/plugins/repo-guards/tests/git-message-gate.test.mjs:41`, `.vibe/plugins/repo-guards/tests/dispatch-preflight.test.mjs:48`, `.vibe/plugins/repo-guards/tests/spec-gate.test.mjs:92`: 28 pass with the map key, 4 fail on `process.start` without it; `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:13` and `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:245` spell the payload name | Met | - |
| AC-002 | REQ-002 | Given the spec-gate advise branch, When its comment is read, Then it says `observe()` is not called, why, and that the note repeats until a model-facing delivery | `.vibe/plugins/repo-guards/spec-gate.mjs:75` | Met | - |
| AC-003 | REQ-003 | Given the binding fixes, When the part tests run, Then a subagent gets no compaction text, overlay-guard matches write tools only, the startup-guard spawn gets more than 8250 ms, and a throw under the nudge claim returns '' | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:371` with `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:300`; `.vibe/hooks.toml:63`; `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:52` with `.skilled/hooks/session-lifecycle/vibe/session-start.test.mjs:56`; `.skilled/hooks/session-handover/vibe/handover-parts.mjs:315` with `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs:626`; each case fails on the old file | Met | - |
| AC-004 | REQ-004 | Given a payload cwd, When a writer and its reader resolve it, Then both use `sessionDirFor`, and a folder that does not exist is never created | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:54` and `:81`, `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs:45`, `.vibe/plugins/repo-guards/dist-freshness.mjs:80`, `.vibe/plugins/repo-guards/dispatch-preflight.mjs:25`; `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:126` and `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:112` with `.skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs:496` and `:506`, which fail on the old adapters | Met | - |
| AC-005 | REQ-005 | Given a missing OpenCode module or a multi-line command, When session-cleanup runs or the renderer renders, Then the hook exits 0 with one stderr line and the renderer refuses the substitution | `.vibe/plugins/repo-guards/session-cleanup.mjs:77`: a scratch copy without the module exited 0 with `session-cleanup: Cannot find module`, the old file exited 1; `.vibe/plugins/repo-guards/render-home-hooks.cjs:40` with `.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs:105`, which fails on the old renderer | Met | - |
| AC-006 | REQ-006 | Given the reference and the README, When each is read against `.vibe/hooks.toml` and the Vibe source, Then they state the strict `post_tool` binding, the reply fields, the unported tool registrations and the goal switch | `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37`, `:122`, `:131`, `:215` and the rows around it; `.skilled/hooks/session-lifecycle/vibe/README.md:29` | Met | - |
| AC-007 | REQ-007 | Given the testability fixes, When the suites run, Then session-start's parts are called in-process, no lifecycle entry point keeps its own stdin reader, deep-loop-guard is driven with `agents.spawn`, and the receipts follow the injected env | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:31` and `:177`, `.skilled/hooks/session-lifecycle/vibe/session-start.test.mjs:23`; `rg -n "async function readStdin" .skilled/hooks/session-lifecycle/vibe` prints nothing; `.vibe/plugins/repo-guards/tests/deep-loop-guard.test.mjs:51`; `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:166` with `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs:88`; `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:87`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:108` | Met | - |
| AC-008 | REQ-008 | Given a live Vibe session on `deepseek-flash`, When the model starts `cat .env` with the background process tool, Then the journal holds a `process.start` effect, an env-secret-guard `Denied tool 'start'` notice and no placeholder value | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/024-vibe-hook-review-2-remediation/scratch/live/VIB-HK-029/vibe/turns/background-read/check.txt:2` (`background-call-refused`) and `turns/no-leak/check.txt:2` (`guard-logged-and-value-absent`) | Met | - |
| AC-009 | REQ-009 | Given a clean background shell started with `bash -i`, When the model types `cat .env` into it with `process.write`, Then env-secret-guard denies the write and no placeholder value reaches the journal, and the unit cases deny the same text and its base64 bytes while a control key and a plain line pass | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/024-vibe-hook-review-2-remediation/scratch/live/VIB-HK-030/vibe/turns/typed-read/check.txt:2` (`typed-command-refused`), `turns/start-shell/check.txt:2` (`shell-started`), `turns/no-leak/check.txt:2` (`value-absent`); `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs` write cases | Met | - |
| AC-010 | REQ-010 | Given the real flag reader, When a caller injects an env holding the skill-advisor kill switch, or a live session finds a kill switch in `hook-flags.env`, Then the advisor, ask-surface and completion parts contribute nothing, and with an empty flag file the ask-surface part denies and the completion part records its advisory | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:178`, `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:90`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:111`; `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs:127` and `:138`, `.skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs:572`, `:576`, `:588` and `:592` | Met | - |
| AC-011 | REQ-011 | Given a checkout reached through a symlink, When session-start runs from the symlinked path, Then it prints its context as it does from the real path, and the shared check names a symlinked entry script as the entry and an imported module as not | `.skilled/hooks/shared/cli-entry.mjs:30`, `.skilled/hooks/shared/tests/cli-entry.test.mjs:41` and `:46`; session-start through a symlinked checkout printed 0 bytes on the old code and 1139 bytes on the new | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met. The unit suites prove each fix, and the live VIB-HK-029 run showed a background `cat` of a dotenv file denied in a real Vibe session, with the payload name `process.start` read from the session journal.
<!-- /ANCHOR:closure -->
