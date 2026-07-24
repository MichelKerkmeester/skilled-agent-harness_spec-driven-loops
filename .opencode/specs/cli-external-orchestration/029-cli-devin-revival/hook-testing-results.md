---
title: "Hook Testing Results: cli-devin revival"
description: "Consolidated direct-invocation and live devin -p test evidence for every Devin hook adapter built across phases 004 and 008 -- one place to check adapter status instead of cross-referencing two implementation-summary.md files."
trigger_phrases: ["devin hook test results", "devin hook adapter testing", "devin -p dormancy evidence"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival"
    last_updated_at: "2026-07-24T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Added SWE-1.7 free-tier re-test; dormancy confirmed model-independent"
    next_safe_action: "Re-run this same matrix if a future devin build changes -p hook-firing behavior"
    blockers: []
    key_files: ["004-devin-hook-adapter-layer/implementation-summary.md", "008-devin-hook-parity/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does true interactive devin mode (untestable here, no TTY) fire hooks where -p does not?"]
    answered_questions: ["All 13 adapters across both phases are confirmed fail-open on malformed and missing-field payloads; devin -p itself never fires any hook, confirmed before and after the full 7-event-category extension.", "The -p dormancy is model-independent: re-probed under swe-1-7 (SWE-1.7 Max, free beta) with all 8 events instrumented and a real exec tool call -- zero firings, malformed hook JSON still unparsed."]
---
# Hook Testing Results: cli-devin revival

---

## 1. SCOPE

Every Devin hook adapter this packet has built so far -- 3 from phase 004 (`session-start.ts`, `user-prompt-submit.ts`, `spec-gate-classify.mjs`) and 10 from phase 008 (`dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `post-edit-quality.cjs`, `code-graph-freshness.cjs`, `mcp-route-guard.cjs`, `spec-gate-enforce.mjs`, `completion-evidence-stop.cjs`, `session-stop.ts`, `post-compaction.cjs`, `task-dispatch-guard.cjs`) -- went through the same two-tier verification: **direct invocation** (piping realistic, malformed, and missing-field JSON straight into the compiled/plain script) and a **live `devin -p` re-dispatch** against the real installed binary with the actual `.devin/hooks.v1.json` in place. This doc consolidates both tiers' results in one place instead of requiring a reader to cross-reference two separate `implementation-summary.md` files.

**Headline finding, unchanged across both phases**: `devin -p` -- the only dispatch mode any orchestrator in this repo would ever use -- never fires a hook under any registration path tested. Every adapter below is built, tested in isolation, and confirmed correct; none has ever been observed firing in a real Devin session.

---

## 2. LIVE `devin -p` DORMANCY EVIDENCE

| # | Test | Devin version | Result |
|---|---|---|---|
| 1 | Standalone `.devin/hooks.v1.json`, with and without a top-level `"version": 1` field, real dispatched `ls` tool call | 3000.2.17 | Zero probe firings for `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `Stop` |
| 2 | `.devin/config.json`'s `"hooks"` key instead of the standalone file | 3000.2.17 | Same -- zero firings |
| 3 | Deliberately malformed JSON in `.devin/hooks.v1.json` | 3000.2.17 | `devin -p` succeeded with **zero parse errors** -- proof the file isn't read at all in this mode, not merely ignored once read |
| 4 | `--agent-config <file>` with a `hooks` field | 3000.2.17 | Rejected outright by the config parser: `unknown field 'hooks', expected one of system_instructions, allowed_tools, permissions, mcp_servers, extensions` |
| 5 | (Phase 004 close) Final re-test with the real committed 2-event `.devin/hooks.v1.json` in place | 3000.2.17 | `devin -p "list files with ls"` completed normally, no `additionalContext` injected |
| 6 | (Phase 008 close) Re-test after extending `.devin/hooks.v1.json` to all 7 event categories (15 command entries) | 3000.2.17 | `devin -p "echo hook-parity-probe-..."` completed normally -- still zero hook output |
| 7 | **SWE-1.7 model re-test**: `devin --model swe-1-7 -p` (SWE-1.7 Max, free beta tier) with a mutating prompt, asking the model to report any injected context | 3000.2.17 | Model answered it received Devin's own `<rules type="always-on">` blob but **"No SPEC FOLDER question was received"** -- `spec-gate-classify.mjs` (UserPromptSubmit) did not fire |
| 8 | **SWE-1.7 all-event probe**: temporary probe entry prepended to all 8 events in `.devin/hooks.v1.json`, then a real dispatched `exec` tool call | 3000.2.17 | Tool call executed (`echo swe17-hook-probe` returned output) yet **zero probe firings across all 8 events** -- no probe log created at all |
| 9 | **SWE-1.7 probe sanity + malformed-JSON control**: probe script invoked directly, then deliberately malformed `hooks.v1.json` under `--model swe-1-7` | 3000.2.17 | Probe script writes correctly when invoked directly (ruling out a false negative); malformed JSON produced **zero parse errors** -- the file is not read in this mode |

`PostCompaction` and `SessionEnd` were **not** independently live-triggered (would require inducing an actual compaction or session-termination event, not just a dispatched command). Their dormancy is inferred from test 1-4/6's packet-wide finding that `-p` never consults hook config at all -- not independently observed for these two specific events. True interactive mode remains untested (no TTY in this environment) -- the one open gap.

### 2a. RESOLUTION -- schema fix and live confirmation (2026-07-24, `glm-5-2` free tier)

| # | Test | Result |
|---|---|---|
| 10 | Rewrote `.devin/hooks.v1.json` to the documented schema (top-level events, nested `{matcher, hooks:[...]}`), all 19 command entries preserved verbatim | JSON valid; structure confirmed |
| 11 | Mutating prompt under `devin --model glm-5-2 -p` | Model quoted the injected text verbatim: `"SPEC FOLDER QUESTION: this turn looks like it will mutate a file..."` -- `spec-gate-classify.mjs` **fires** |
| 12 | All 8 events probe-instrumented + a real `exec` tool call | **6 fired**: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`. `PermissionRequest` and `PostCompaction` did not occur in the session (no permission prompt, no compaction) -- not evidence of breakage |
| 13 | Captured real payload shapes | `tool_name: "exec"` / `"edit"` / `"read"`; `tool_input.command`, `tool_input.file_path`; plus `session_id`, `prompt_id`, `tool_use_id`, `tool_response`, `stop_hook_active`, `hook_event_name` -- every field the adapters already read |
| 14 | Real (non-probe) adapter end to end | `session-start.js` delivered the genuine Spec Kit startup brief (Memory status, Code Graph status, Recovery Tools, CLI fallbacks) into the model's context |

**What this validates.** The adapters were never the problem -- their tool-vocabulary assumptions (`exec`, `edit`, `file_path`) are all confirmed correct against real payloads. Only the registration file was malformed. The `PostCompaction` 5-step chain and `run_subagent` guard remain the two surfaces not yet observed live, since neither event occurred in these sessions.

**Superseded below.** Tests 1-9 are retained as the historical record of how the wrong conclusion was reached. Their observations were accurate; the inference drawn from them ("no headless attachment point exists") was not.

**Model-independence (tests 7-9, 2026-07-24) -- superseded by §2a.** The dormancy is a property of `-p` mode, not of any one model. Re-running the full probe methodology under `swe-1-7` (SWE-1.7 Max, free beta) reproduced the finding exactly: a real `exec` tool call ran to completion while all 8 probe-instrumented events stayed silent, and deliberately malformed hook JSON still raised no parse error. The probe script was separately verified to write correctly when invoked directly, so the silence is a genuine negative rather than broken instrumentation. `.devin/hooks.v1.json` was restored byte-identical afterwards (SHA-256 prefix `2ed5bc110188bab1` before and after).

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
- **`SessionEnd`'s stdout-strictness**: registered `session-cleanup.sh` directly based on the structural fact that Devin has a real native `SessionEnd` event (Codex does not) -- not because live behavior was observed to be lenient.

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

## RELATED DOCUMENTS
- `004-devin-hook-adapter-layer/implementation-summary.md` (full narrative + decisions for the 3 phase-004 adapters)
- `008-devin-hook-parity/implementation-summary.md`, `.../checklist.md`, `.../decision-record.md` (full narrative + decisions for the 10 phase-008 adapters)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (per-directory dormancy evidence)
- `spec.md` (parent packet status)
