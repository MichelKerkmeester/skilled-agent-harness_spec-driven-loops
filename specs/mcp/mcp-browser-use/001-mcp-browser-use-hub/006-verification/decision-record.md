---
title: "Decision Record: Phase 6: verification"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-verification operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification"
    last_updated_at: "2026-11-21T15:58:34.267Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 6: verification

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the mcp-browser-use compiled-routing engine inside 005, making it the eighth compiled hub. | Not stated. | None | 005-routing-and-surfaces REQ-002, T019, implementation-summary.md Known Limitations 1 |
| Q002 | Run one real-browser probe of Bladebro on Aside signed-in Work profile, example.com only, using cookies only and never the password manager. | Not stated. | None | 006-verification T008, T009, goal.md log |
| Q003 | Change hub-routing holdout MT-H04 gold from mcp-aside-devtools to defer. | Not stated. | None | 006-verification T012, .skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md |
| Q004 | Keep Bladebro 4.8.2 installed with its data folder; the step 14 uninstall is declined. | Not stated. | None | 006-verification T010, goal.md log |
| Q005 | Delete the three moved .backup-20260505-* snapshot folders under specs/mcp/mcp-tooling/z_archive/003-mcp-figma-transfer/. | Not stated. | None | T015, implementation-summary.md Key Decisions |
| Q006 | Route DevTools phrasing without 'Chrome' to the Chrome DevTools mode; carried by five verb-attached phrases because bare 'devtools' broke the two-tool bundle canary. | Not stated. | None | T015, .skilled/skills/mcp-browser-use/hub-router.json, implementation-summary.md Key Decisions |
| Q007 | Add a Browser Use section to the open v4.2.0.0 release notes on branch 505. | Not stated. | None | T015, .skilled/changelog/skilled/v4.2.0.0.md |
| Q008 | Tune the advisor so 'browser automation' phrasing reaches mcp-browser-use. | Not stated. | None | T015, system-skill-advisor lib/scorer/lanes/explicit.ts |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:84103bdd-4074-43a6-b7db-ab9ef93e3535:toolu_01YYTYdDEAFQ1Pk8uswxzzwj:0 -->

Question:
```text
mcp-browser-use has no compiled routing engine, so `compiled-route.cjs --hub mcp-browser-use` always returns the 'legacy' fallback. Phase 005's REQ-002 and goal criterion 2 require that command to print `action: route` for each mode. Every other hub (7 of 7) has an engine. Building one means adding mcp-browser-use as an eighth hub across the shared compiled-routing cohort lists: about eight runtime files, a new engine child modelled on mcp-tooling's, an activation manifest, and byte-identical authored copies in the archived sk-doc routing program tree. Should I build it inside this packet?
```

Options:
```text
Build it in 005 (Recommended)
Amend 005, follow-up packet
```

Answer:
```text
Build it in 005 (Recommended)
```

### Q002
<!-- source: claude:84103bdd-4074-43a6-b7db-ab9ef93e3535:toolu_01LXxRUguciDoeiPTXMQ1QSi:0 -->

Question:
```text
Should I try Bladebro on Aside's signed-in 'Work' profile now? It would use clone mode with the Aside binary, read-only against example.com only, then `rb off` + `rb forget`. This lifts your earlier 'agent profile only' limit for this one probe, and its output would fill 006's real-browser steps 11-13.
```

Options:
```text
Later, follow-up packet (Recommended)
Try it now, example.com only
Try attach mode instead
```

Answer:
```text
Try it now, example.com only
```

### Q003
<!-- source: claude:84103bdd-4074-43a6-b7db-ab9ef93e3535:toolu_01Gdjm3BzLWEcosz9TQ9koMe:0 -->

Question:
```text
Hub-routing holdout MT-H04, "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes", now defers. Its gold answer `mcp-aside-devtools` dates from the old hub, before Bladebro existed. The prompt mixes agentic wording ("on its own", which the new hub gives to Bladebro) with signed-in proof (Aside). The defer turns admission red for mcp-browser-use (6 pass, 1 drift); CI runs that check warn-only. How should it be resolved?
```

Options:
```text
Gold to defer (Recommended)
Route it to Aside
Leave the drift
```

Answer:
```text
Gold to defer (Recommended)
```

### Q004
<!-- source: claude:84103bdd-4074-43a6-b7db-ab9ef93e3535:toolu_01Gdjm3BzLWEcosz9TQ9koMe:1 -->

Question:
```text
Bladebro 4.8.2 is still installed globally, with its data folder `~/.local/state/blade` (62 MB, created by this run). The plan's step 14 uninstalls it after your approval. Since attach mode now works with your Aside, do you want to keep it?
```

Options:
```text
Keep it installed (Recommended)
Uninstall now
```

Answer:
```text
Keep it installed (Recommended)
```

### Q005
<!-- source: claude:123e1c5d-fd97-4045-b198-d3b23df4bbdd:toolu_01DV59HrfGMcpsisGJchuCjz:0 -->

Question:
```text
The committed spec move carried three old .backup-20260505-* snapshot folders (5 files each) into specs/mcp/mcp-tooling/z_archive/003-mcp-figma-transfer/. Each fails strict validation, and the CI packet check counts a moved packet as a new failing one, so it would block this branch on merge. What should happen to them?
```

Options:
```text
Move into scratch/ (Recommended)
Delete them
Leave as is
```

Answer:
```text
Delete them
```

### Q006
<!-- source: claude:123e1c5d-fd97-4045-b198-d3b23df4bbdd:toolu_01DV59HrfGMcpsisGJchuCjz:1 -->

Question:
```text
Requests that name DevTools without 'Chrome' ('Open DevTools and inspect the console logs') reach the mcp-browser-use hub, but the hub then defers instead of picking Chrome DevTools. Fixing it means editing the hub's aliases, rebuilding and re-minting its compiled routing engine, and adding a test case. Which way?
```

Options:
```text
Add bare 'devtools' (Recommended)
Add devtools and console logs
Keep deferring
```

Answer:
```text
Add bare 'devtools' (Recommended)
```

### Q007
<!-- source: claude:123e1c5d-fd97-4045-b198-d3b23df4bbdd:toolu_01DV59HrfGMcpsisGJchuCjz:2 -->

Question:
```text
The open v4.2.0.0 release notes (.skilled/changelog/skilled/v4.2.0.0.md, drafted on main) don't mention the new mcp-browser-use hub, the Bladebro mode or the move of Chrome DevTools and Aside out of mcp-tooling. Add them on this branch?
```

Options:
```text
Add a section now (Recommended)
Leave for release time
```

Answer:
```text
Add a section now (Recommended)
```

### Q008
<!-- source: claude:123e1c5d-fd97-4045-b198-d3b23df4bbdd:toolu_01DV59HrfGMcpsisGJchuCjz:3 -->

Question:
```text
The probe 'Route my MCP browser automation work to the right browser tool.' goes to sk-code, not mcp-browser-use. The prompt is meta phrasing ('route ... to the right tool'), and even reaching the hub, generic browser automation would defer per your earlier MT-H04 decision. How should it count?
```

Options:
```text
Hold as probe phrasing (Recommended)
Tune the advisor
```

Answer:
```text
Tune the advisor
```

<!-- /ANCHOR:operator-answers-verbatim -->
