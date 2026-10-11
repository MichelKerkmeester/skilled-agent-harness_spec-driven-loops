# Iteration 009 — Maintainability: sk-code docs commits (stale names, dead anchors, wrong paths)

## Dispatcher
- Mode review, dimension maintainability, iteration 9 of 10; budget profile: verify.
- Focus commits: ceb8ff216c, 52c31dcc12, f3377faef9, bcf0dfa653, 16641fcf05, 644cabc980 (sk-code docs).
- Known items to confirm or refute: (a) 36 HVR hard blockers in `.skilled/skills/sk-code/SKILL.md`; (b) the advisor battery "passes 13 of 17 with 2 of 5 false positives".
- Resolved artifact directory: `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/`.

## Files Reviewed
- .skilled/skills/sk-code/SKILL.md (v2.2.7.0; whole file in the mechanical scan)
- .skilled/skills/sk-code/ROUTER.md:82
- .skilled/skills/sk-code/sk-code-quality/SKILL.md:97,116,144,335
- .skilled/skills/sk-code/sk-code-quality/README.md:61,131
- .skilled/skills/sk-code/sk-code-quality/scripts/README.md
- .skilled/skills/sk-code/sk-code-obsidian/SKILL.md
- .skilled/skills/sk-code/sk-code-webflow/SKILL.md
- .skilled/skills/sk-code/shared/references/stack-detection.md:65,145
- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:11,44,70,128
- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md:11,43,65,99
- .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md:35
- .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md:375,376
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:60,61
- .claude/settings.json:200,206
- .skilled/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py (tool run, read-only)
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/advisor-battery.cjs (tool run, read-only)

## Findings

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **Manual-testing scenarios present the unregistered shell hook as the live Claude PostToolUse hook** -- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:11 -- line 11 (repeated at :44, :70, :128, and in check-dist-staleness-hook.md:11,:43,:65,:99) calls `.skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh` "the shared Claude Code PostToolUse hook that fires on every `Write`/`Edit`", while sk-code-quality/SKILL.md:97 (rewritten by in-range commit f3377faef9) says that script "is the legacy write-time hook, kept for direct tests and registered in no runtime" and names `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` as the live adapter; .claude/settings.json:200-206 wires the Write|Edit matcher to the .cjs adapter.
   Repro: `sed -n '11p' .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`; `sed -n '97p' .skilled/skills/sk-code/sk-code-quality/SKILL.md`; `sed -n '200,206p' .claude/settings.json`.
   Finding class: stale-name
   Scope proof: comment-hygiene-hook.md is touched by in-focus commit ceb8ff216c (git show --name-only ceb8ff216c -- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/ names it) and sits in the 012 review scope.
   Affected surface hints: check-dist-staleness-hook.md, manual-testing-playbook.md:345, sk-code-opencode/references/shared/hooks.md:89, the sk-code-quality resource table.
   Case: an operator executes scenario TH-002 by hand and exercises the unregistered .sh; the scenario reports green while the registered .cjs adapter and its .claude/settings.json wiring are never tested, so a live regression reaches review unnoticed.

2. **stack-detection.md names a preview-server path that exists nowhere in the tree** -- .skilled/skills/sk-code/shared/references/stack-detection.md:145 -- the mixed-marker table row cites "changed `.skilled/skills/sk-doc/scripts/preview-server.js`" as the OPENCODE marker; the same path appears in routing-disambiguation/mixed-marker-ambiguity.md:35. Repro: `test -e .skilled/skills/sk-doc/scripts/preview-server.js` (false) and `git ls-files | grep -i preview-server` (empty); the directory .skilled/skills/sk-doc/scripts/ exists and has no preview server in it.
   Finding class: wrong-path (documentation)
   Scope proof: stack-detection.md is touched by in-focus commit ceb8ff216c (git show --name-only ceb8ff216c -- .skilled/skills/sk-code/shared/references/stack-detection.md).
   Affected surface hints: mixed-marker-ambiguity.md:35; the 010-004 convention that unresolvable paths are defects.
   Case: a tester staging the mixed-marker scenario cannot materialize the cited file, and a doc-claims scan reads the row as an unresolvable path.

3. **Webflow debugging evidence list points at two spec memories that do not resolve** -- .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md:375,376 -- the "Memory Files (Evidence)" list cites `specs/005-example.com/z_archive/004-table-of-content/003-icon-animation-isolation/memory/2024-12-14_toc-scroll-lenis-fix.md` and `specs/03--commands-and-skills/001-commands/005-subagent-delegation/implementation-summary.md`; neither resolves at HEAD (`test -e` false for both, and no such tracks exist under specs/).
   Finding class: wrong-path (documentation)
   Scope proof: touched by in-focus commit 16641fcf05 (git show --name-only 16641fcf05 names it), which rewrote link labels in this file and kept these two pointers.
   Affected surface hints: sibling debugging workflows under the same directory.
   Case: a debugging agent following the evidence pointers cannot open either memory; the "evidence" claim is not verifiable.

## Traceability Checks
- core `spec_code`: partial — both dispatched claims walked against their phase records (010-001 baseline table, 011-003/008 REQ-005 rows, 002-surface-contract-alignment summary) and re-run live.
- core `checklist_evidence`: not exercised this iteration; maintainability focus only.
- overlay `playbook_capability`: covered — SA-001 replayed live from 008-session-aware-tie-break/scratch/advisor-battery.cjs (exit 0).
- overlay `skill_agent`: partial — HVR scan across the five sk-code SKILL.md/README files and the hub.
- overlay `agent_cross_runtime`, `feature_catalog_code`: pending (iteration 10 row).

### Claim adjudications (known items)
- "36 HVR hard blockers in .skilled/skills/sk-code/SKILL.md" — **confirmed live**: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md | grep 'hard blockers'` prints `hard blockers: 36`; the phase-010 record carried 36 as the post-remediation baseline (down from a plan-time 37), and no sibling count rose. No finding.
- "the advisor battery passes 13 of 17 with 2 of 5 false positives" — **numbers confirmed, "passes" refuted**: the live replay prints `positives 13/17 negatives-false-positive 2/5` at exit 0; SA-001 §2 (advisor-probe-battery.md:60,61) defines PASS as positive accuracy >= 0.80 (>=14 of 17) AND a 0/5 negative false-positive rate, and this run fails both. The epic holds the battery to a no-worse bar (011-003 REQ-005; 002 implementation-summary.md:111 calls it "a separate advisor-accuracy issue"), so the gap is a documented known limitation, not a new defect.

## Integration Evidence
- .claude/settings.json:200-206 — live PostToolUse Write|Edit matcher executes `node .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`; this is the ground truth the scenario docs contradict.
- .skilled/plugins resolves to ../.opencode/plugins (readlink), so the router precondition files exist on disk even though a git-tracked-set scanner reports them missing.

## Edge Cases
- The mechanical scanner's first pass produced two false-positive classes: directory links with trailing slashes (7 hits) and a JavaScript snippet read as a markdown link (ACTIONS[action](target)). Both classes were eliminated before any finding was drafted.
- git-tracked path sets miss files under symlinked directories (.skilled/plugins -> ../.opencode/plugins); every such candidate was re-verified with fs.existsSync/test -e.
- The obsidian reference `specs/public/HANDOVER.md` (SKILL.md:171) is explicitly qualified "in the plugin repository", so it is a cross-repo pointer, not a dead in-tree path.
- The strategy NEXT FOCUS line carried a stray "Review verdict: PASS" suffix from a prior write; this iteration replaced the block cleanly.

## Confirmed-Clean Surfaces
- 360 sk-code markdown files scanned: 0 dead anchors and 0 dead file links after the false-positive classes are removed.
- Obsidian SKILL.md's seven named checklist assets all exist; Webflow's webflow-debugging-checklist.md, webflow-verification-checklist.md and all four assets/patterns/* files exist; quality's scripts/ceiling-report.sh and scripts/ceiling-report.test.sh exist, so 644cabc980's listed report resolves.
- The six commits' name migrations left no residue: no workflow_*.md underscore spans remain (files are workflow-implement/debug/verify.md), and no bare code-webflow/code-opencode skill names remain (only the code-quality-checklist.md filename matches).
- .skilled/skills/sk-code/README.md (1) and shared/README.md (3) hard-blocker counts equal their phase-010 baselines.

## Ruled Out
- Dead markdown anchors in sk-code docs — 0 across 360 files (heading-slug comparison).
- Dead file links — the 10 raw hits all resolve to existing directories or are non-link code examples.
- .skilled/plugins/... references as dead paths — the symlink target files exist.
- .skilled/prompts/ mentions — command-authoring.md:43 states the path is not present in this workspace.
- HVR count regression — 36 equals the recorded baseline and sibling counts held or fell.
- "The advisor battery passes" — refuted by SA-001's own aggregate rule; the gap is documented.

## Next Focus
- Dimension: traceability (core spec_code and checklist_evidence; overlay skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).
- Focus area: agents, repo rules and runtime mirrors: commits 3617968e35, 8fdb66cc1b, 864a3bccd8, 40fc64d9cd, b5927055b0 (iteration plan row 10).
- Required evidence: named agent, repo-rule and mirror files with file:line refs and live sync-check commands; overlay rows resolved against the reviewed commit range.

## Verdict
- New findings this iteration: 3 P2, 0 P1, 0 P0. Active totals: 0 P0, 0 P1, 16 P2. No binary gate failed. `hasAdvisories=true`.

Review verdict: PASS
