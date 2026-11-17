---
title: "Implementation Summary"
description: "The 47 runtime adapter READMEs now follow the hook template runtime folder scaffold and were fact-checked against their adapters and registration entries."
trigger_phrases:
  - "hook runtime readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/004-hook-runtime-readmes"
    last_updated_at: "2026-11-17T10:59:59Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 004: blocking review findings confirmed and applied, packet docs Complete"
    next_safe_action: "Review the staged phase 004 paths, commit, merge origin/main and push, then start phase 005"
    packet_purpose: "Purpose: Each of the 47 runtime adapter READMEs follows the runtime folder scaffold, passes the validator and the voice scan with zero hard blockers, and names the event, registration file and failure behavior the code confirms."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/004-hook-runtime-readmes/implementation-summary.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/004-hook-runtime-readmes/tasks.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/004-hook-runtime-readmes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:b8809d5b220aa2e7cf6f923a92c696b844e32c193688ab6145b06e18d5bfc00c"
      session_id: "scaffold-004-hook-runtime-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7be91f15-0ff9-421e-8bb3-fd9a453daa38"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T10:59:59Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hook-runtime-readmes |
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every runtime adapter README under `.skilled/hooks/<concern>/<runtime>/` now follows the hook template's runtime folder scaffold: an H1 naming the runtime, the concern and the event, then OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED. Each one names the event, the registration file, the failure behavior and the switch, and a session that did not write it checked those against the code.

### Phase 4: hook-runtime-readmes

The phase covers 47 READMEs across the claude, codex, cursor, devin, dsh, pi and vibe runtime folders. All 47 already printed `VALID` with no hard blocker before the rewrite, so the work was structure and facts. Before, the files ran from 37 to 119 lines and held whatever sections their authors chose. After, they run from 50 to 91 lines and all 47 carry the same four sections. Reviewers checked 2,922 claims. The main session confirmed each finding against the code and applied 35 fixes, 24 from reviewers and 11 it found itself while confirming them. The blocking review added eight more, so 43 fixes landed in all. No finding was rejected.

Two corrections matter beyond wording. The Cursor adapters for subagent-dispatch-guard and cli-dispatch exit 2 on a deny, and their `.cursor/hooks.json` entries wrap them in a `||` drift fallback, so a deny is followed by an allow envelope. Both READMEs now say so. Several adapters check only their concern switch, so `SYSTEM_HOOKS_DISABLED` is named the master switch only where the adapter reaches the shared hook-flags resolver.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/<concern>/<runtime>/README.md` (47 files) | Modified | Rewritten to the runtime folder scaffold and checked against each adapter, its tests and its registration entry |
| `003-hook-folder-readmes/tasks.md` | Modified | T013, CHK-051 and its two completion rows ticked after the 003 push |
| `004-hook-runtime-readmes/` packet docs | Modified | Tasks, checklist, acceptance rows and this summary closed |
| `../goal.md` | Modified | D4 names the OpenCode Go route and fits the 4,000-character slice budget |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One README went to each writer session, and a separate reviewer session checked it. A reviewer never checked a file it wrote. The canary, mcp-route-guard/pi, ran on GPT-6 Luna through cli-codex. When the codex usage limit stopped the first wave, the operator moved writers and reviewers to DeepSeek V4.1 Flash Max through cli-devin, with a devin canary on mcp-route-guard/devin. When devin's daily quota ran out, the operator moved them to DeepSeek V4.1 Flash at max through cli-opencode on the OpenCode Go route, with a canary on decision-capture/dsh. The decision record holds these as Q006 to Q009.

The drive ran writers and then reviewers per wave of four, never overlapping. After each wave the main session read every handback, opened the cited code, applied the confirmed fixes with exact one-occurrence replacements and reran every per-file check. It also reran every VALIDATION block, and each printed the result its README states. For the Claude and Cursor READMEs it read each registration entry to confirm the drift fallback wording. It ran the registered Cursor command on a deny payload, which printed the deny, an `mk-hook-drift` line and an allow envelope, and exited 0.

The blocking review asked for changes on two sentences that misstated failure behavior: mcp-route-guard/codex left out its drift fallback, and cli-dispatch/devin said a failed start prints nothing, when Node exits 1 with its module error on stderr. The main session reproduced both, confirmed the six P2 findings in the code and applied all eight.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| All 47 keep four sections, VALIDATION included | The plan kept VALIDATION only where a test exists, but goal D2 is frozen and outranks it. Every adapter has a real command: its own test, a suite that drives it, a stdin smoke or the registration parity suite |
| The frontmatter title equals the H1 | The scaffold's title is the H1 text, and nothing in the repository keys on these titles |
| Master switch named only where the resolver is reached | Phase 003 found adapters that check only their concern switch, and phase 004 found more: shared/dsh, session-lifecycle/vibe |
| Drift fallback behavior stated, not fixed | Goal D3 keeps adapters and registration files unchanged in this phase, so the README states what the entry does and the defect is listed below |
| mcp-route-guard/pi's smoke replaced with the path parity suite | The writer's smoke ran node on a `.ts` module that reads no stdin. The parity suite resolves `.pi/extensions/mcp-route-guard.ts` and passed 153 of 153 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-004-before.tsv`, taken before the first writer ran. After numbers come from `baseline-004-after.tsv`, taken on the final tree. The enumeration in `plan.md` printed the same 47 paths at both ends.

| Check | Result |
|-------|--------|
| `baseline.sh` on the 47 files | Before: 47 of 47 `✅ VALID`, `hard=0`. After: 47 of 47 `✅ VALID`, `issues=0`, `hard=0` and `emojiH=0` |
| Voice ceilings, before then after | 44 files 100 to 100. decision-capture/vibe 99 to 100, session-lifecycle/vibe 99 to 100, mcp-route-guard/dsh 99 to 99. None ends below its baseline |
| Line counts, before then after | Range 37 to 119 before, 50 to 91 after. The largest drop is session-lifecycle/vibe, 119 to 91. The largest rise is mcp-route-guard/devin, 40 to 59 |
| `h2model.py` against the runtime scaffold | `EXACT` for all 47, with `---` above every H2 |
| `chk004.py` | `OK` for all 47: the title equals the H1 and every command block has its expected result |
| `check_readme_references.py` and `check_derived_readme_counts.py` | `SUMMARY files=47 pass=47 fail=0` for each |
| `readme_links.py . <47 files>` | `checked 260 outbound and 0 inbound anchored links across 47 files, 0 problems` |
| VALIDATION blocks | `vrun.py` reran all 47. Each exit status and output matches its README's expected result |
| `check-markdown-links.cjs` | `7816 files, 15099 links checked, 0 broken`, exit 0 |
| `hook-wiring-check.cjs --root .` | `ok` for claude, codex, cursor and devin, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty` over 1,246 READMEs, exit 0, so the verdict baseline needed no rebuild |
| sk-doc `run-script-tests.sh` | Exit 0, 57 PASS and 0 FAIL |
| Secret scan over the 47 files | 2 hits on token, secret or API key, both prose. No key-shaped string, no user path and no scratchpad path |
| Scope of the change | `git status` under `.skilled/hooks` shows exactly the 47 READMEs and no adapter or registration file |
| Blocking `@review` | CHANGES REQUESTED, advisory 86/100, no P0. It sampled about 120 claims in 41 READMEs. The main session confirmed all eight findings against the code and applied them: two P1 failure-behavior sentences and six P2 wording fixes. All eight files then printed `✅ VALID`, `hard=0`, `EXACT` and `OK` again, and the full 47-file baseline was rerun |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per README. Every reviewer session was separate from the writer of the file it checked, and every finding was confirmed against the code before it was applied.

- **classifier-injection-screen/claude:** 61 claims. Applied 1 (the other runtimes on the same core are Devin, DSH, OpenCode, Pi and Vibe, confirmed by an rg of classifier-injection-advisory importers). Rejected 0.
- **classifier-injection-screen/devin:** 66 claims. Applied 0. Rejected 0 (no findings). Blocking review: applied 1 P2 (`JEV_FEATURE_INJECTION_SCREEN=0` turns screening off and an unset variable leaves it on, classifier-injection-screen-posttooluse.test.mjs:53-61 and 124-130).
- **classifier-injection-screen/dsh:** 49 claims. Applied 0. Rejected 0 (no findings).
- **classifier-injection-screen/pi:** 58 claims. Applied 0. Rejected 0 (no findings, the writer's UNSURE note on Pi discovery from .pi/extensions/ is backed by the hook-adapter-path-parity suite, which reads those entries).
- **cli-dispatch/claude:** 50 claims. Applied 0. Rejected 0 (no findings) Addendum: Applied 1 more by the main session: the template asks OVERVIEW for any fallback, and both .claude/settings.json entries carry the drift fallback.
- **cli-dispatch/codex:** 62 claims. Applied 1 from review (the preflight is never given a tool_response, codex-shell-tool.test.mjs:60 vs :92-95) plus 1 by the main session (one audit line per call that matches a dispatch shape, not per dispatch: matchDispatchShape takes the first packet, lib/dispatch-audit.mjs:562). Rejected 0.
- **cli-dispatch/cursor:** 76 claims. Applied 0. Rejected 0 (no findings) Addendum: Applied 1 more by the main session: both .cursor/hooks.json entries carry the drift fallback with an allow envelope Addendum: Applied 1 more by the main session: dispatch-preflight-lint.mjs:108 exits 2 on a deny inside the same || wrapper, so the deny is followed by the drift line and an allow envelope. Blocking review: applied 1 P2 (the proxy forwards the child's raw stdout, a JSON envelope, as `agent_message`, post-tool-use.mjs:70 and 117-122).
- **cli-dispatch/devin:** 81 claims. Applied 3 (one audit line per matching call, lib/dispatch-audit.mjs:562, the suite clears six named switches, devin-dispatch-audit.test.mjs:21-34, the concern README has a runtime coverage table, not a rule list, cli-dispatch/README.md:38). Rejected 0. Blocking review: applied 1 P1 (a failed start exits 1 with Node's module error on stderr, reproduced here, so it is not silent).
- **cli-dispatch/dsh:** 52 claims. Applied 0. Rejected 0 (no findings).
- **cli-dispatch/pi:** 78 claims. Applied 0. Rejected 0 (no findings).
- **decision-capture/claude:** 51 claims. Applied 1 by the main session (the folder holds fixtures/, so DIRECTORY TREE gets the text tree the scaffold asks of a non-flat folder). Rejected 0 (reviewer found nothing).
- **decision-capture/devin:** 60 claims. Applied 0. Rejected 0 (no findings).
- **decision-capture/dsh:** 66 claims. Applied 0. Rejected 0 (no findings).
- **decision-capture/pi:** 86 claims. Applied 0. Rejected 0 (no findings, the writer's UNSURE notes rest on .pi/extensions/README.md and sweep-pi.mjs, which the reviewer confirmed).
- **decision-capture/vibe:** 60 claims. Applied 1 (the suite deletes only three switch names, decision-capture-post-tool.test.mjs:27-34, and env-aliases.cjs:30 bridges MK_ names, so MK_DECISION_CAPTURE_DISABLED still turns the adapter off). Rejected 0.
- **goal/cursor:** 72 claims. Applied 0. Rejected 0 (no findings).
- **goal/devin:** 89 claims. Applied 2 (the adapter binds the handed-over packet itself, goal-inject.mjs:71 and goal-devin.test.mjs:116-126, the envelope nests under hookSpecificOutput, goal-inject.mjs:82-87). Rejected 0.
- **goal/dsh:** 90 claims. Applied 0. Rejected 0 (no findings).
- **goal/pi:** 64 claims. Applied 0. Rejected 0 (no findings).
- **goal/vibe:** 62 claims. Applied 1 (goal-core passes through the chat slice that goal-slice.cjs builds, goal-core.cjs:1286-1300 and goal-slice.cjs:91). Rejected 0.
- **mcp-route-guard/claude:** 51 claims. Applied 1 (only cwd falls back to CLAUDE_PROJECT_DIR then process.cwd(), tool_name has no fallback, mcp-route-guard.cjs:47-48). Rejected 0.
- **mcp-route-guard/codex:** 51 claims. Applied 0. Rejected 0 (no findings). Blocking review: applied 1 P1 (the `.codex/hooks.json:113` entry wraps the adapter in a drift fallback the OVERVIEW left out).
- **mcp-route-guard/cursor:** 47 claims. Applied 1 (the .cursor/hooks.json entry wraps the adapter in a drift fallback that prints mk-hook-drift on stderr and an allow envelope asking for a rebuild). Rejected 0. Blocking review: applied 1 P2 (the spawn runs for a packed or a bare name, mcp-route-guard.mjs:86-92).
- **mcp-route-guard/devin:** 47 claims. Applied 0. Rejected 0 (no findings, main session reran both smokes, exit 0 with the clickup advisory and silent on bad JSON, and read the PreToolUse entry in .devin/hooks.v1.json: matcher ^mcp__.*$, timeout 5).
- **mcp-route-guard/dsh:** 63 claims. Applied 0. Rejected 0 (no findings).
- **mcp-route-guard/pi:** 39 claims. Applied 1 by main session before review (VALIDATION smoke ran node on a .ts module that reads no stdin, replaced with the hook-adapter-path-parity suite, 153 passed here, which resolves .pi/extensions/mcp-route-guard.ts). Reviewer: no findings, confirmed event, registration, file table, switch.
- **overlay-guard/claude:** 62 claims. Applied 1 (the path comes from file_path, then filePath, then path, lib/overlay-guard.cjs:143-150). Rejected 0.
- **overlay-guard/codex:** 73 claims. Applied 0. Rejected 0 (no findings, the main session checked it does not repeat the three sibling errors).
- **overlay-guard/cursor:** 50 claims. Applied 1 (strictWrites can refuse an unowned vendored path, overlay-guard.test.cjs:200). Rejected 0 (the entry has no drift fallback, and the README already says so).
- **overlay-guard/devin:** 48 claims. Applied 2 findings as 3 pairs (an engine error, timeout or unreadable setting writes a stderr note, lib/overlay-guard.cjs:121,134 and devin/overlay-guard.cjs:54, the suite covers five adapters, overlay-guard.test.cjs:6). Rejected 0.
- **overlay-guard/dsh:** 62 claims. Applied 0. Rejected 0 (no findings).
- **overlay-guard/pi:** 57 claims. Applied 0. Rejected 0 (no findings).
- **post-edit-quality/claude:** 62 claims. Applied 1 from review (OpenCode also keeps an adapter, the opencode/ symlink) plus 1 by the main session (a missing checker adds a quality-notice finding, lib/post-edit-router.cjs:474-488, which this adapter prints at claude/post-edit-quality.cjs:130). Rejected 0.
- **post-edit-quality/codex:** 51 claims. Applied 1 (a missing checker prints a quality-notice, lib/post-edit-router.cjs:474-488 and codex/post-edit-quality.cjs:155-159, reworded without the suggested semicolon). Rejected 0. Blocking review: applied 1 P2 (Cursor's folder holds only a link to the shared proxy, not its own adapter).
- **post-edit-quality/devin:** 64 claims. Applied 1 by the main session (a missing checker adds a quality-notice finding, lib/post-edit-router.cjs:474-488, printed at devin/post-edit-quality.cjs:138-142). Rejected 0 (reviewer found nothing).
- **post-edit-quality/dsh:** 65 claims. Applied 2 from review (apply_patch is in FILE_TOOLS but a patch-body call names no path field, so it is skipped, dsh/post-edit-quality.mjs:14,57-58, the concern README holds a coverage matrix and a switch table, not a dispatch table) plus 1 by the main session (the quality-notice exception, dsh/post-edit-quality.mjs:65-69). Rejected 0.
- **post-edit-quality/pi:** 52 claims. Applied 1 by the main session (the quality-notice exception, pi/post-edit-quality.ts:32-36). Rejected 0 (reviewer found nothing).
- **session-handover/claude:** 70 claims. Applied 1 (skilled-loop never sets AI_SESSION_CHILD, worktree-session.sh:503, it exports the claim seed for a Claude session started on the goal command, skilled-loop:1239-1244 and 1439-1444). Rejected 0. Blocking review: applied 1 P2 (the compact pointer checks only the master and kill switches before stdin, handover-compact-pointer.mjs:171-176).
- **session-handover/codex:** 44 claims. Applied 0. Rejected 0 (no findings). Blocking review: applied 1 P2 (the `PostToolUse` fallback also prints `additionalContext`, `.codex/hooks.json:164`).
- **session-handover/pi:** 75 claims. Applied 0. Rejected 0 (no findings).
- **session-lifecycle/vibe:** 68 claims. Applied 2 findings as 3 pairs (the description now names the post_tool adapter registered at .vibe/hooks.toml:127-130, SYSTEM_HOOKS_DISABLED is the master switch only for parts that call the resolver, compaction-context.mjs imports no hook flags). Rejected 0.
- **shared/dsh:** 53 claims. Applied 1 (goal-context.mjs and spec-gate-classify.mjs check no switch, grep count 0, git-preflight-advisory.mjs and prompt-advisor.mjs check inside their handlers). Rejected 0.
- **subagent-dispatch-guard/claude:** 67 claims. Applied 1 (fable-subagent-guard.mjs imports only readStdin and parses with JSON.parse, fable-subagent-guard.mjs:19 and 75, parseJsonFailOpen is the deep-loop guard's, task-dispatch-guard.cjs:25). Rejected 0.
- **subagent-dispatch-guard/cursor:** 60 claims. Applied 1 by the main session (a deny exits 2 and trips the .cursor/hooks.json drift fallback, the registered command run on the README's deny payload printed the deny, the mk-hook-drift line and an allow envelope, exit 0). Rejected 0 (reviewer found nothing).
- **subagent-dispatch-guard/devin:** 80 claims. Applied 0. Rejected 0 (no findings).
- **subagent-dispatch-guard/dsh:** 75 claims. Applied 0. Rejected 0 (no findings).
- **subagent-dispatch-guard/pi:** 53 claims. Applied 0. Rejected 0 (no findings, the main session confirmed the adapter calls the hook-flags resolver before the master switch wording).
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two Cursor registrations follow a deny with an allow.** `subagent-dispatch-guard/cursor/task-dispatch-guard.mjs` and `cli-dispatch/cursor/dispatch-preflight-lint.mjs` exit 2 on a deny inside a `||` drift fallback in `.cursor/hooks.json`, so the entry prints the deny, then an `mk-hook-drift` line and an allow envelope, and exits 0. Which envelope Cursor acts on is unconfirmed. Goal D3 keeps registrations unchanged in this phase, so the READMEs state the behavior and the fix belongs to the owners of `.cursor/hooks.json`.
2. **The Fable guard has no catch on `main()`.** `subagent-dispatch-guard/claude/fable-subagent-guard.mjs` would exit nonzero on an unexpected throw, which trips its drift fallback instead of approving quietly. Its parsing and transcript reads catch their own errors, so no path is known to throw. The README makes no claim either way.
3. **The Cursor post-tool proxy forwards a JSON envelope as text.** `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` passes the Claude post-edit adapter's raw `hookSpecificOutput` JSON as `agent_message`, so Cursor sees the findings inside JSON text. The Cursor dispatch preflight already unwraps its child's `additionalContext`, and the proxy could do the same in a separate code change.
4. **Fact checks sampled each README's claims.** Every claim a reviewer named was checked, but prose can still hold a claim nobody tested.
<!-- /ANCHOR:limitations -->
