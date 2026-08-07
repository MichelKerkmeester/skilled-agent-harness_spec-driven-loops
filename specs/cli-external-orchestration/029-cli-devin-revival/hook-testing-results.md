---
title: "Hook Testing Results: cli-devin revival"
description: "Consolidated direct-invocation and live devin -p evidence for every Devin hook adapter built across phases 004 and 008, including the corrected registration schema, six observed lifecycle events and explicitly superseded negative tests."
trigger_phrases: ["devin hook test results", "devin hook adapter testing", "devin hook live evidence"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival"
    last_updated_at: "2026-07-24T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected the registration schema and observed six lifecycle events under devin -p"
    next_safe_action: "Exercise PermissionRequest, PostCompaction, run_subagent and the deny branch when those conditions become available"
    blockers: []
    key_files: ["004-devin-hook-adapter-layer/implementation-summary.md", "008-devin-hook-parity/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events actually occur?", "Does run_subagent emit the registered tool name and expected payload shape?", "Does the deny branch block a real tool call when a block-severity fixture exists?"]
    answered_questions: ["All 13 adapters across both phases fail open on malformed and missing-field payloads.", "With the documented top-level event schema, devin -p fires SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop and SessionEnd.", "The earlier zero-firing result came from an unsupported registration wrapper, not a CLI limitation."]
---
# Hook Testing Results: cli-devin revival

---

## 1. SCOPE

Every Devin hook adapter this packet has built so far -- 3 from phase 004 (`session-start.ts`, `user-prompt-submit.ts`, `spec-gate-classify.mjs`) and 10 from phase 008 (`dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `post-edit-quality.cjs`, `code-graph-freshness.cjs`, `mcp-route-guard.cjs`, `spec-gate-enforce.mjs`, `completion-evidence-stop.cjs`, `session-stop.ts`, `post-compaction.cjs`, `task-dispatch-guard.cjs`) -- went through direct invocation with realistic, malformed and missing-field JSON. After the registration schema was corrected, a live `devin -p` session also proved the registration path and six lifecycle events end to end.

**Current finding**: Devin hooks are live under `devin -p`. With top-level event arrays and nested `{matcher, hooks:[...]}` groups, `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd` all fired, and real adapter output reached the model. `PermissionRequest` and `PostCompaction` remain unobserved because neither event occurred.

---

## 2. SUPERSEDED NEGATIVE TESTS AGAINST THE INVALID SCHEMA

Tests 1-9 are retained as historical evidence. Their observations were accurate for the unsupported wrapper shape, but their packet-wide dormancy inference was wrong and is superseded by tests 10-14.

| # | Test | Devin version | Result |
|---|---|---|---|
| 1 | Standalone `.devin/hooks.v1.json`, with and without a top-level `"version": 1` field, real dispatched `ls` tool call | 3000.2.17 | Zero probe firings for `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `Stop` |
| 2 | `.devin/config.json`'s `"hooks"` key instead of the standalone file | 3000.2.17 | Same -- zero firings |
| 3 | Deliberately malformed JSON in `.devin/hooks.v1.json` | 3000.2.17 | `devin -p` succeeded with zero parse errors. This was originally misread as proof the file was unread; tests 10-14 showed the invalid shape was silently discarded. |
| 4 | `--agent-config <file>` with a `hooks` field | 3000.2.17 | Rejected outright by the config parser: `unknown field 'hooks', expected one of system_instructions, allowed_tools, permissions, mcp_servers, extensions` |
| 5 | (Phase 004 close) Final re-test with the real committed 2-event `.devin/hooks.v1.json` in place | 3000.2.17 | `devin -p "list files with ls"` completed normally, no `additionalContext` injected |
| 6 | (Phase 008 close) Re-test after extending `.devin/hooks.v1.json` to all 7 event categories (15 command entries) | 3000.2.17 | `devin -p "echo hook-parity-probe-..."` completed normally -- still zero hook output |
| 7 | **SWE-1.7 model re-test**: `devin --model swe-1-7 -p` (SWE-1.7 Max, free beta tier) with a mutating prompt, asking the model to report any injected context | 3000.2.17 | Model answered it received Devin's own `<rules type="always-on">` blob but **"No SPEC FOLDER question was received"** -- `spec-gate-classify.mjs` (UserPromptSubmit) did not fire |
| 8 | **SWE-1.7 all-event probe**: temporary probe entry prepended to all 8 events in `.devin/hooks.v1.json`, then a real dispatched `exec` tool call | 3000.2.17 | Tool call executed (`echo swe17-hook-probe` returned output) yet **zero probe firings across all 8 events** -- no probe log created at all |
| 9 | **SWE-1.7 probe sanity + malformed-JSON control**: probe script invoked directly, then deliberately malformed `hooks.v1.json` under `--model swe-1-7` | 3000.2.17 | Probe script writes correctly when invoked directly. The no-error result did not distinguish unread input from silently discarded invalid configuration. |

This historical pass did not independently trigger `PostCompaction` or `SessionEnd`. The corrected-schema pass later observed `SessionEnd`; `PostCompaction` still has not occurred. True interactive mode remains untested, but `-p` support is now directly confirmed.

### 2A. CURRENT RESOLUTION: SCHEMA FIX AND LIVE CONFIRMATION (2026-07-24, `glm-5-2` free tier)

| # | Test | Result |
|---|---|---|
| 10 | Rewrote `.devin/hooks.v1.json` to the documented schema (top-level events, nested `{matcher, hooks:[...]}`), all 19 command entries preserved verbatim | JSON valid; structure confirmed |
| 11 | Mutating prompt under `devin --model glm-5-2 -p` | Model quoted the injected text verbatim: `"SPEC FOLDER QUESTION: this turn looks like it will mutate a file..."` -- `spec-gate-classify.mjs` **fires** |
| 12 | All 8 events probe-instrumented + a real `exec` tool call | **6 fired**: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`. `PermissionRequest` and `PostCompaction` did not occur in the session (no permission prompt, no compaction) -- not evidence of breakage |
| 13 | Captured real payload shapes | `tool_name: "exec"` / `"edit"` / `"read"`; `tool_input.command`, `tool_input.file_path`; plus `session_id`, `prompt_id`, `tool_use_id`, `tool_response`, `stop_hook_active`, `hook_event_name` -- every field the adapters already read |
| 14 | Real (non-probe) adapter end to end | `session-start.js` delivered the genuine Spec Kit startup brief (Memory status, Code Graph status, Recovery Tools, CLI fallbacks) into the model's context |

**What this validates.** The adapters were never the problem -- their tool-vocabulary assumptions (`exec`, `edit`, `file_path`) are all confirmed correct against real payloads. Only the registration file was malformed. The `PostCompaction` 5-step chain and `run_subagent` guard remain the two surfaces not yet observed live, since neither event occurred in these sessions.

**Superseded below.** Tests 1-9 are retained as the historical record of how the wrong conclusion was reached. Their observations were accurate; the inference drawn from them ("no headless attachment point exists") was not.

**Superseded model comparison (tests 7-9, 2026-07-24).** Re-running the invalid schema under `swe-1-7` reproduced the same silence. This proves the invalid registration failed consistently across those models, not that valid `-p` hooks are model-dependent or unavailable.

---

## 3. PHASE 004 ADAPTERS -- DIRECT INVOCATION

| Adapter | Test | Result |
|---|---|---|
| `session-start.ts` (compiled) | Real `SessionStart`-shaped payload | PASS -- returned a valid envelope carrying the actual Spec Kit Memory startup brief |
| `user-prompt-submit.ts` (compiled) | Mutation-triggering prompt | PASS -- returned a valid envelope relaying the delegated Claude hook's context |
| `spec-gate-classify.mjs` | Mutation-triggering prompt | PASS -- returned the Gate-3 question, wrapped in Devin's envelope |
| `spec-gate-classify.mjs` | Non-mutating prompt | PASS -- no output, exit 0 |
| All 3 above | Malformed stdin / missing required field | PASS -- fail-open confirmed, exit 0, no crash |

`tsc --noEmit -p tsconfig.json` (full `mcp-server` project): 0 errors. `npm run build` produced `dist/hooks/devin/{session-start,user-prompt-submit,shared}.js`.

---

## 4. PHASE 008 ADAPTERS -- DIRECT INVOCATION

| Adapter | Happy-path | Malformed JSON | Missing field (`{}`) |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | PASS -- a real dispatch-shaped `opencode run` command returned an actual `stdin-redirect-required` advisory | PASS, exit 0 | PASS, exit 0 |
| `dispatch-audit-posttooluse.mjs` | PASS, exit 0 (non-dispatch command, correct no-op) | PASS, exit 0 | PASS, exit 0 |
| `post-edit-quality.cjs` | PASS, exit 0 (real file edit) | PASS, exit 0 | PASS, exit 0 |
| `code-graph-freshness.cjs` | PASS, exit 0 (real file edit) | PASS, exit 0 | PASS, exit 0 |
| `mcp-route-guard.cjs` | PASS, exit 0 (mcp tool call) | PASS, exit 0 | PASS, exit 0 |
| `spec-gate-enforce.mjs` | PASS, exit 0 across non-mutating/`exec`/`edit`-with-`file_path` cases | PASS, exit 0 | n/a (tested with `exec`/`edit` variants instead, all PASS) |
| `completion-evidence-stop.cjs` | PASS, exit 0 (completion-claim payload) | PASS, exit 0 | PASS, exit 0 |
| `session-stop.js` (compiled from `session-stop.ts`) | PASS, exit 0 | PASS, exit 0 | PASS, exit 0 |
| `post-compaction.cjs` | PASS -- with a real `summary` field, emitted `"## Post-Compaction Summary\n..."`; without one, exit 0 no output (fallback chain correctly found nothing to report in this synthetic test) | PASS, exit 0 | n/a (summary-absent case above covers this) |
| `task-dispatch-guard.cjs` | PASS, exit 0 (`run_subagent` call, correct allow) | PASS, exit 0 | n/a (tested with a full payload; missing-field tolerance is in the field-fallback design, not separately fixture-tested) |

Full matrix: 10 adapters x {malformed-JSON, missing-field} = 20/20 fail-open cases confirmed exit 0 during phase 008's own closing verification pass (see `008-devin-hook-parity/checklist.md` CHK-011/CHK-022).

`tsc --noEmit` (for `session-stop.ts`): 0 errors. `node --check` clean for every `.cjs`. Every `.mjs` executes without a syntax error.

### 4a. What was NOT behaviorally proven

- **`dispatch-preflight-lint.mjs`'s deny path**: only the warn path was exercised live (a real advisory was returned). The deny branch itself is structurally identical to the already-proven Claude/Codex sibling branches and calls the same `dispatch-rule-checks.mjs` core, whose own unit tests (`dispatch-rule-checks.test.mjs`, 6/6 passing) cover `severity: 'block'` classification directly -- but no skill in this repo currently declares a `severity: block` hard rule, so there was nothing to trigger an end-to-end deny against, independent of the dormancy finding.
- **`SessionEnd`'s stdout-strictness**: the event fired under the corrected schema, but no dedicated adverse stdout-shape test was run. Direct registration remains structurally justified because Devin has a native `SessionEnd` event and Codex does not.

---

## 5. `git diff` REGRESSION CHECK

`git diff --stat` confirmed empty across all 9 runtime-neutral guard cores both adapters layers wrap: `dispatch-rule-checks.mjs`, `dispatch-audit.mjs`, `post-edit-router.cjs`, `freshness-core.cjs`, `mcp-route-guard.cjs` (core), `completion-evidence-sentinel.cjs`, `dispatch-guard.cjs`, `spec-gate-core.mjs`, and the Claude-side `session-stop.js`/`session-prime.js`/`user-prompt-submit.js` implementations phase 004's adapters delegate to. No adapter has ever modified a shared core -- only translated its inputs/outputs.

---

## 6. `.devin/hooks/` SYMLINK CONVENIENCE FOLDER

Devin's own docs (`docs.devin.ai/cli/extensibility/hooks/overview`, `.../lifecycle-hooks`, fetched 2026-07-24) document no conventional folder name for hook scripts -- their own example commands use a project-root `./scripts/` path, not anything nested under `.devin/`. `.devin/hooks/` was chosen to match this repo's existing `.codex/`/`.cursor/` sibling-folder convention rather than an upstream standard; neither `.codex/` nor `.cursor/` has an equivalent symlink folder today, so this is a new pattern, not a mirrored one.

Contains one relative symlink per adapter phases 004 and 008 actually built and registered in `.devin/hooks.v1.json` -- 13 files, 1:1 with the registration, excluding the 5 pre-existing wiring-only scripts (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh`, `install-codex-hooks.mjs`, `session-cleanup.sh`) since those are shared repo hygiene scripts, not Devin-specific adapters.

Symlinks are **relative** (`../../.opencode/skills/...`), not absolute -- absolute paths would hardcode this machine's checkout location and break across git worktrees or a different developer's clone. Verified empirically before wiring: Node resolves both CommonJS `require()` and ESM `import` relative specifiers against the symlink's REAL target directory, not the symlink's own directory, so no adapter's relative import to a shared `lib/` core or to `shared.js` needed a second symlink alongside it. All 13 symlinks were then directly invoked through their `.devin/hooks/` path with realistic payloads and returned identical results to invoking the real file directly.

The three `.js` symlinks (`session-start.js`, `user-prompt-submit.js`, `session-stop.js`) point into the gitignored `mcp-server/dist/` build output, not their `.ts` source -- that matches what `.devin/hooks.v1.json` itself invokes. Git tracks only the symlink (a `120000`-mode blob storing the target path string), not the gitignored target's content, so this is safe to commit; a fresh checkout still needs `npm run build` in `mcp-server/` before those three resolve to real content, matching the existing `.devin/hooks.v1.json` fallback message.

---

## 7. POST-RESEARCH HARDENING + Q3 LIVE-VERIFICATION (2026-07-27)

Follow-up to `research/research.md`'s recommendations (§7) and open questions (Q3-Q6, §10). Actioned directly rather than via another deep-research pass, since each item was independently well-scoped. **Note (2026-07-27, later same day)**: the code fixes described in §7a were reverted by an unrelated concurrent session's destructive git operation on this shared branch and had to be re-applied a second time; the content below describes the fix as it stands after that recovery, verified again at that point.

### 7a. `||`-truthiness precedence fix (research §5 F4, §7 recommendation 1)

Both alias-bearing adapter families picked the first *truthy* value, not the first *valid string* -- a truthy non-string in an earlier field (e.g. a malformed object) could suppress a valid string in a later alias and still resolve to `null`/`undefined`, silently discarding real data. Fixed in all 4 affected files with a `firstNonBlankString(...)` helper (first non-blank string wins, confirmed-canonical field first, behavior otherwise unchanged):
- `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` (`filePathFrom`)
- `system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` (`filePathFrom`)
- `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` (`subagentType` resolution)
- `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` (`subagentType` resolution) -- fixed here, not just Devin, because Cursor's own `task-dispatch-guard.mjs` has no independent alias logic of its own; it spawns this exact file as a subprocess and forwards its payload unchanged, so fixing "Cursor's" behavior required fixing the file it delegates to.

**No alias was retired** -- research §7 recommendation 2 explicitly warned that removing `filePath`/`path` before a caller audit risks a silent enforcement bypass (a missing/blank path is treated as an *exempt* target, which allows rather than denies). All existing aliases remain exactly as tolerant as before; only the selection logic changed.

**Not touched** (confirmed identical bug, out of the stated Devin+Cursor scope): `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` and `.../codex/spec-gate-enforce.mjs` have the same `file_path || filePath || path` pattern independently (not via delegation). Tracked as phase `014-hook-adapter-shared-boilerplate-and-claude-codex-fix`, not silently fixed here.

Verified: `node --check` clean on all 4; direct-invocation smoke tests confirmed canonical fields, alias fields, and the specific masking scenario (`{file_path: {nested:'object'}, path: 'valid.js'}`) all resolve correctly post-fix; regression tests added to `spec-gate-devin.test.mjs` (15/15) and `spec-gate-prebind.test.mjs` (16/16); `claude-task-dispatch-guard.test.cjs` unaffected.

### 7b. New regression test coverage (research §5 F6, §7 recommendation 3)

Added to `system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs` (5 new tests, 15/15 total passing) and `system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` (5 new tests, 16/16 total passing): `filePath`-alias recognition, generic-`path`-alias recognition, canonical-field-first precedence (constructed so the choice is observable -- `file_path` points at an exempt target while the aliases point at a real file), missing/blank-path resolving to an **exempt allow, not a deny** (locking in the corrected safety understanding from the research as a regression gate), and the exact truthy-non-string-masking scenario the `||`-chain fix closed.

### 7c. Q3 -- live-verified: `PermissionRequest` DOES fire; `PostCompaction` still unconfirmed

Reused the controlled-probe methodology (temporary unconditional-log hook, restored after) to test both events directly against `devin 3000.2.17`.

**`PermissionRequest`: confirmed firing, real payload captured.** Dispatching `devin -p "Create a new file at /tmp/..."` under the default `--permission-mode auto` (which auto-approves only read-only tools) produced a real `PermissionRequest` event:
```json
{"hook_event_name":"PermissionRequest","tool_name":"write","tool_input":{"file_path":"...","content":"..."},"tool_use_id":"...","session_id":"...","prompt_id":"..."}
```
`tool_name: "write"` and `tool_input.file_path` match this packet's existing field-name assumptions exactly -- no surprise there. **Actionable consequence**: `.devin/hooks.v1.json` currently registers `"PermissionRequest": []` (explicit empty, no handler, on the prior assumption that Claude has no equivalent source to port). That assumption is now known to be incomplete for Devin specifically -- with no handler, every real `PermissionRequest` under a non-`dangerous` permission mode is silently rejected (the CLI itself reported: *"the write was rejected -- the session is running in non-interactive mode without dangerous permission mode, so tool calls that need approval can't be auto-approved"*), with no chance for a smart, policy-driven auto-approval hook. Tracked as phase `013-devin-permission-request-handler`.

**`PostCompaction`: still not verified live.** The same probe dispatch produced no `PostCompaction` firing, as expected -- a single short command cannot fill a context window enough to trigger real compaction. This remains genuinely open; forcing it deliberately would need a long-running session, which was out of scope for this pass.

### 7d. Q4 -- `mcp-route-guard.cjs` dormancy: reconfirmed, unchanged, for both runtimes

Live commands (`devin mcp list`, `cursor-agent mcp list`) both show only this repo's own 5 internal `mk_`-prefixed servers registered -- no external, non-`mk_` family for either runtime. Dormancy holds. Cursor's own `mcp-route-guard.mjs` did get a **real, separate fix** in an already-completed prior phase (`030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix`) -- a dead field-parsing bug (Cursor sends split `mcp_server_name`/`tool_name` fields the guard never matched) is now fixed and the guard genuinely fires, but the *observable outcome* is still silence, since no native external MCP family exists to match against yet.

### 7e. Q5 -- upstream feature drift: nothing new for either CLI

Live-refetched `docs.devin.ai`'s hooks docs and changelog (newest entry: v3000.2.17, 2026-07-19 -- the exact build already tested against) and Cursor's changelog/forum (newest hook-relevant entry: 2026-07-10, and explicitly scoped to **cloud agents only**, not the local CLI this packet targets). Neither upstream surface has changed anything that affects either packet's current hook inventory or schema assumptions.

### 7f. Q6 -- dedup opportunity: narrow recommendation, tracked as phase 014

Sampled `spec-gate-enforce`, `task-dispatch-guard`, and `mcp-route-guard` across all 4 runtimes. Tool-name maps, field-extraction, and envelope-emit blocks are irreducibly runtime-specific (or short enough that shared-helper indirection would cost more than it saves) and should stay as-is -- extracting them would break the "read one file top-to-bottom to know exactly what a security-relevant hook does" property every adapter currently has. The one safe, low-risk extraction candidate is the `readStdin()` + JSON.parse-fail-open boilerplate, which is byte-identical across every sampled file. Tracked as phase `014-hook-adapter-shared-boilerplate-and-claude-codex-fix`, not actioned here.

---

## RELATED DOCUMENTS
- `004-devin-hook-adapter-layer/implementation-summary.md` (full narrative + decisions for the 3 phase-004 adapters)
- `008-devin-hook-parity/implementation-summary.md`, `.../checklist.md`, `.../decision-record.md` (full narrative + decisions for the 10 phase-008 adapters)
- `011-hook-truth-and-runtime-readmes/`, `012-devin-hook-hardening/` (schema-correction and hardening phases)
- `013-devin-permission-request-handler/`, `014-hook-adapter-shared-boilerplate-and-claude-codex-fix/`, `015-devin-agents-skills-rules-parity/` (follow-on phases from this section's findings)
- `research/research.md` (the 5-iteration deep-research pass this section responds to)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (per-directory live wiring and caveats)
- `spec.md` (parent packet status)
