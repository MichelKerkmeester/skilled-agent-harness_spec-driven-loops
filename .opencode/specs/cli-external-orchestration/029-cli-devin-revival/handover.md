---
title: "Session Handover Document: cli-devin revival (029)"
description: "Devin hooks are LIVE - the long-standing dormancy finding was a hooks.v1.json registration-schema bug, now fixed, verified firing, committed and pushed. Remaining work is a documentation retraction sweep across 7 READMEs and 17 spec docs that still assert the false dormancy."
trigger_phrases: ["cli-devin handover", "029 handover", "devin hooks dormancy retraction", "devin hook schema fix"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival"
    last_updated_at: "2026-07-24T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed hooks.v1.json schema; hooks verified LIVE; code headers retracted"
    next_safe_action: "Retract dormancy claims in 7 devin READMEs, then 17 spec docs"
    blockers: []
    key_files: ["hook-testing-results.md", ".devin/hooks.v1.json", "004-devin-hook-adapter-layer/implementation-summary.md", "008-devin-hook-parity/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-hook-dormancy-fix", parent_session_id: null }
    completion_pct: 60
    open_questions: ["Do PermissionRequest and PostCompaction fire? Neither event occurred in any test session yet.", "Does run_subagent dispatch produce the tool_name this packet assumes? Not yet observed live."]
    answered_questions: ["The -p dormancy was NOT a Devin limitation - it was an invented hooks.v1.json schema on our side. Fixed and verified firing.", "Adapter tool-vocabulary assumptions (exec, edit, file_path) are all confirmed correct against real captured payloads."]
---
# Session Handover Document: cli-devin revival (029)

## 1. Handover Summary

**The headline: Devin hooks were never dormant. The bug was ours.**

For most of this packet's life, phases 001/004/008 concluded that `devin -p` never fires hooks under any registration path, and every adapter was built, committed, and documented as permanently dormant. That conclusion was wrong.

`.devin/hooks.v1.json` had been written in an **invented shape** — a `{"version": 1, "hooks": {...}}` wrapper containing flat `{type, command, matcher}` entries. Devin's documented schema puts **event names at the top level**, each holding an array of **nested** `{matcher, hooks: [{type, command, timeout}]}` groups — the same nesting Claude and Codex already use. Devin silently discards a config it cannot map to that schema.

The strongest earlier "evidence" for dormancy — *deliberately malformed JSON produced zero parse errors* — was misread. It was never proof the file goes unread; it was proof the file is read and then discarded. That single misinterpretation propagated into three phases of documentation.

After rewriting to the documented schema, hooks fire immediately and the real adapters reach the model.

## 2. Context Transfer

### What is DONE, committed, and pushed to `origin/skilled/v4.0.0.0`

| Commit | Content |
|---|---|
| `2fadd849f0` | All 32 hook entrypoints across 4 runtimes aligned to per-language `code-opencode` P0 (box header for `.cjs`/`.mjs`, numbered section bands, `'use strict'` dropped from 9 `.mjs`). Proven comment-only. |
| `74e2ec1bbd` | SWE-1.7 re-test recorded (this was still under the old broken schema, so its negative result is superseded). |
| `3b90e8e3c1` | **The fix.** `.devin/hooks.v1.json` rewritten to the documented schema, all 19 command entries preserved verbatim, plus the corrected evidence doc. |
| `8ed586f8e2` | `STATUS: DORMANT` retracted in all 14 Devin adapter headers, replaced with confirmed LIVE status + root-cause note. |

Working tree is clean of this packet's work; nothing of mine is uncommitted.

### Live verification evidence (devin 3000.2.17, `glm-5-2` free tier)

- **6 of 8 events fired** in a single dispatched session: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`.
- `PermissionRequest` and `PostCompaction` did **not** fire because neither event occurred (no permission prompt, no compaction) — not evidence of breakage, and still unproven either way.
- GLM-5.2 quoted the injected Gate-3 text verbatim: `"SPEC FOLDER QUESTION: this turn looks like it will mutate a file..."`.
- The real (non-probe) `session-start.js` adapter delivered the genuine Spec Kit startup brief — Memory status, Code Graph status, Recovery Tools, CLI fallbacks — into the model's context.
- **Captured real payload fields**: `hook_event_name`, `session_id`, `prompt_id`, `tool_use_id`, `tool_name` (`exec` / `edit` / `read`), `tool_input.command`, `tool_input.file_path`, `tool_response`, `stop_hook_active`, `source`, `reason`. Every field the adapters already read — the adapters themselves needed no change.

### What REMAINS — the documentation retraction sweep

This is the entire remaining scope. It is documentation-only; no code or config changes are needed.

**Tier 1 — 7 Devin READMEs** (each has a single `**STATUS: DORMANT**` line, except the two large ones):

| File | Note |
|---|---|
| `cli-opencode/scripts/hooks/devin/README.md` | Single line 14. `PreToolUse`/`PostToolUse(^exec$)` now confirmed firing; `tool_name: "exec"` confirmed. |
| `sk-code/code-quality/scripts/hooks/devin/README.md` | Single line 14. `^edit$` confirmed; `tool_input.file_path` confirmed. |
| `system-code-graph/runtime/hooks/devin/README.md` | Single line 14. Same as above. |
| `system-deep-loop/runtime/hooks/devin/README.md` | Single line 16. Hooks are live, but `run_subagent` itself is still **not** observed — keep that caveat. |
| `mcp-code-mode/runtime/hooks/devin/README.md` | Single line 14. **Careful**: its *second* dormancy reason is still genuinely true — no external non-`mk_` MCP family is registered under Devin. Retract only the `-p` reason, keep the MCP-family one. |
| `system-spec-kit/mcp-server/hooks/devin/README.md` | **Large.** Has a full `§2 STATUS: DORMANT -- LIVE-VERIFIED, NOT ASSUMED` section with a 4-row evidence table. Needs a real rewrite, not a line swap. This file is cross-referenced as the canonical dormancy source by every other README, so fix it before or with the others. |
| `system-spec-kit/runtime/hooks/devin/README.md` | **Large.** Same shape — `§2 STATUS` section plus per-file status column in `§3 CONTENTS`. |

**Tier 2 — 17 spec docs under this packet** (all still assert dormancy):

- `spec.md` (parent — phase map rows for 004/008 say "Complete (dormant)", plus continuity fields)
- `004-devin-hook-adapter-layer/` — `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- `008-devin-hook-parity/` — `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- `006-devin-manual-testing-playbook/spec.md` (REQ-009 / SC-007 / risks table reference the dormancy status)
- `010-devin-feature-catalog/` — `spec.md`, `checklist.md`, `decision-record.md` (REQ-004's status enum is built around `built, confirmed dormant` — that enum value must change)

**Recommended framing for the retraction** (used already in the code headers and `hook-testing-results.md`): supersede rather than delete. Keep the original reasoning visible, add a dated correction explaining that the observations were accurate but the inference drawn from them was wrong. This packet's own convention has been to preserve superseded reasoning, and the misread-malformed-JSON lesson is worth keeping legible.

### Reference: the already-corrected wording

`hook-testing-results.md` §2a is the canonical corrected record and contains the full resolution table (tests 10-14). The 14 adapter headers use this block, which is a good template for the READMEs:

> `STATUS: LIVE. Verified firing 2026-07-24 against devin 3000.2.17 under devin -p: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop and SessionEnd all fire, and the real adapters' output reaches the model. An earlier revision of this file claimed the hook system was dormant; that was a registration-schema bug in .devin/hooks.v1.json (events must be top-level with nested {matcher, hooks:[...]} entries), not a limitation of the CLI.`

## 3. Packet Status

| Phase | Status | Note |
|---|---|---|
| 001 contract pin | Complete | Contract facts still valid; its dormancy-adjacent conclusions superseded |
| 002 deep-loop executor | Planned | Untouched |
| 003 skill packet | Planned | Untouched |
| 004 hook adapter layer | Complete — **status label now wrong** | Built + working; docs still say "Complete (dormant)" |
| 005 model registry | Planned | Untouched |
| 006 manual-testing playbook | Planned | Spec references dormancy; scenarios not yet authored |
| 007 docs/governance closeout | Planned | Untouched |
| 008 hook parity | Complete — **status label now wrong** | Built + working; docs still say "Complete (dormant)" |
| 009 MCP host integration | Planned | Untouched; still gated on `devin auth login` |
| 010 feature catalog | Planned | REQ-004 status enum needs updating before authoring |

## 4. Validation Checklist

Before claiming the retraction sweep complete:

- [ ] `grep -rl "dormant\|DORMANT" .opencode/specs/cli-external-orchestration/029-cli-devin-revival/` returns only intentional historical references
- [ ] `grep -rl "DORMANT" --include="README.md" .opencode/skills | grep devin` returns nothing, except `mcp-code-mode`'s surviving MCP-family caveat
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/029-cli-devin-revival --recursive --strict` → 0 errors / 0 warnings across all 11 folders
- [ ] Re-run the live confirmation before signing off: `devin --model glm-5-2 -p "Answer in one line: did you receive injected context containing the words SPEC FOLDER QUESTION? Say YES or NO."` → expect `YES`
- [ ] `.devin/hooks.v1.json` still has top-level event names (no `version`/`hooks` wrapper): `python3 -c "import json;d=json.load(open('.devin/hooks.v1.json'));print('hooks' not in d and 'version' not in d)"` → `True`

## 5. Session Notes

### CRITICAL — concurrent sessions are actively reverting working-tree edits

This is the single most important operational warning. During this session another agent working the same clone **silently reverted all 14 of my code-comment edits** between applying and staging them. It was caught only because the staged-file count came back as 2 instead of 16.

Mitigations that proved necessary:
- Always re-check `git status --short | grep "^A\|^M "` immediately **after** staging and **before** committing. Never trust that `git add` stuck.
- Commit high-value work in small batches as soon as it is verified, rather than accumulating a large uncommitted set.
- Never select files via `git diff --name-only` for a scripted sweep — it pulls in the other session's dirty files. An early draft of the section-band script did exactly this and picked up `.opencode/bin/compiled-route-status.cjs`. Use an explicit target list.
- Files observed touched by the other session this session: `.cursor/*`, `030-cli-cursor-creation/**`, `sk-code/code-opencode/references/shared/hooks.md`, `sk-doc/019-*`, `.opencode/bin/compiled-route-status.cjs`, and the shared `030` parent `graph-metadata.json`.

### Methodology lessons worth carrying forward

- **A negative result needs its instrument proven.** The dormancy probe was only trustworthy once the probe script itself was verified to write when invoked directly. That check is what separated "hooks are silent" from "my probe is broken" — run it before believing any silence.
- **Absence of an error is not evidence of absence.** "Malformed JSON produced no parse error" was treated as proof the file was unread. It actually meant the file was read and discarded. When an experiment's result is a *non-event*, enumerate every mechanism that produces that non-event before picking one.
- **Verify a schema against the vendor's docs before inventing one.** The whole failure traces to writing a config shape from research notes instead of the documented contract, and then documenting the invented shape as if it were the standard.
- **The vendor's own migration tooling reveals canonical formats.** `devin migrate hooks` converts Windsurf configs and, when fed a real input, emits Devin's canonical `hooks.v1.json` — a fast way to discover exact schemas without guessing.
- **Escalate contradictions rather than resolving them silently.** A separate fork this session: the request was to apply one uniform header style to every hook, but `javascript-checklist.md` and `typescript-checklist.md` prescribe *different* P0 headers per language. Surfacing that rather than picking a side avoided putting 32 files into documented violation.

### Environment facts confirmed this session

- `devin 3000.2.17`; free-tier models available: `swe-1-7` (SWE-1.7 Max), `swe-1-7-medium`, `glm-5-2` (GLM-5.2 High), `swe-1-6`. Note `swe-1-7-lightning` is **paid** despite the family name.
- Correct invocation form: `devin --model <id> -p "<prompt>"`. Putting `--model` after `-p` fails argument parsing.
- File edits require `--permission-mode dangerous` (or interactive approval); `auto` refuses them.
- `RUST_LOG=debug|trace` produces no hook diagnostics — not a usable debugging channel.
- True interactive mode remains untested (no TTY available in this environment).

---

## RELATED DOCUMENTS
- `hook-testing-results.md` — canonical evidence, §2a holds the corrected resolution
- `spec.md` — parent packet map (phase status labels need the retraction)
- `004-devin-hook-adapter-layer/implementation-summary.md`, `008-devin-hook-parity/implementation-summary.md` — the two phases whose conclusions are superseded
- `.devin/hooks.v1.json` — the corrected registration
