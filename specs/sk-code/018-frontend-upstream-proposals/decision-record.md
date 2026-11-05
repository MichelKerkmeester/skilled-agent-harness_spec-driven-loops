---
title: "Decision Record: Frontend upstream proposals from Barter's frontend practice program"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "018-frontend-upstream-proposals operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals"
    last_updated_at: "2026-11-05T05:22:55.512Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Frontend upstream proposals from Barter's frontend practice program

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Phase 001 builds sk-code-frontend for web and React Native. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode |
| Q002 | The build waited for the Codex usage reset instead of finishing the router work in-session. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/goal.md |
| Q003 | REQ-006 is amended so native topic files cite React Native documentation instead of a web-features Baseline. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/spec.md REQ-006 |
| Q004 | The orphan-phrase check tracks only generated intent signals, so hand-curated signals are never pruned. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes |
| Q005 | Hyphen and space folding is normalised in every duplicated signal matcher, not only sk-code's. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations (rank 11) |
| Q006 | generate-trigger-index.mjs warns when the corpus resolves to another checkout than the caller's. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations (rank 12) |
| Q007 | The main merge went ahead and the conflicting activation manifests were re-minted afterwards. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/goal.md (worktree merge) |
| Q008 | The final main merge went ahead with the conflicting Hermes mirror and skill graph regenerated. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/goal.md (worktree merge) |
| Q009 | The Angular-specific rules are removed from the generic web layer. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/sk-code-frontend web layer |
| Q010 | The readability research runs 15 iterations in total, 8 on DeepSeek and 7 on Luna. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research |
| Q011 | The readability research runs every iteration, with convergence as telemetry only. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research |
| Q012 | After the research comes a plan, then an operator decision before any build. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research |
| Q013 | The research plan is approved in full: the sk-code fixes and the template and validator prevention track. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research |
| Q014 | SC-002 is reworded so each new validator check flags at least one named known-bad file. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research SC-002 |
| Q015 | Phase 010 is finished and committed before the readability program starts. | Not stated. | None | specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research |
| Q016 | React Native support is removed from Skilled, leaving sk-code-frontend web-only. | Barter is the only React Native consumer and overlays the native guidance anyway. Evidence: alternative, option True, overlap 1, imperative False, shift False. | the web-and-native answer to the phase 001 question | specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend |
| Q017 | The packet's release coverage folds into v4.0.1.0, and the alignment command checks more broadly so untouched docs are not missed again. | Not stated. Evidence: open_value, option not_applicable, overlap 1, imperative False, shift False. | None | specs/sk-code/018-frontend-upstream-proposals/008-release-coverage |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_0135RHfb7psivQPaUayQZ29V:0 -->

Question:
```text
sk-code/ROUTER.md:171 says canonical sk-code must not load React Native resources ("those surfaces live in the Barter sk-code fork"). Rank 1 brings a React Native stack layer plus five native topic files into sk-code-frontend. Which way should phase 001 go?
```

Options:
```text
Web and native (Recommended)
Web only
```

Answer:
```text
Web and native (Recommended)
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Lo954PqqmzRGFNtaAHSb1A:0 -->

Question:
```text
Codex (gpt-6-luna) hit its ChatGPT usage limit; the message says to try again at 12:26. Its last dispatch did finish the router work before it stopped: router-sync passes 5/5 and intent-signals --check passes. Two parent-skill-check failures remain (no changelog, no canary case), plus the docs brief, the activation hash and the Hermes mirror. Your standing rule says to stop and ask on quota, never re-route. How should phase 001 continue?
```

Options:
```text
Wait for 12:26 (Recommended)
Finish in this session
```

Answer:
```text
Wait for 12:26 (Recommended)
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_014u7XzkDB3WAwvfXtRrmkru:0 -->

Question:
```text
LOGIC-SYNC REQUIRED: REQ-006 says every topic file cites a web-features Baseline status, but five native topic files cite "Checked against React Native 0.83 documentation and source" instead. Baseline only covers web platform features, and REQ-006 was written before ADR-001 added native. Which truth prevails?
```

Options:
```text
Amend REQ-006 (Recommended)
Keep REQ-006 as written
```

Answer:
```text
Amend REQ-006 (Recommended)
```

### Q004
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Y7hMNu5GHuJhbiNqqrvVe3:0 -->

Question:
```text
Phase 002's orphan check, as specced (any intent_signal no router declares), flags 151 live signals across 7 hubs, mostly hand-curated. `routing-registry-drift.yml` runs `--check`, and D2 forbids pruning live graph-metadata, so CI would go red. How should an orphan be defined?
```

Options:
```text
Track generated signals (Recommended)
Seed keep lists now
Report-only by default
```

Answer:
```text
Track generated signals (Recommended)
```

### Q005
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01NjuYNeBnKF8TvfN7DFmtuw:0 -->

Question:
```text
Rank 11 is confirmed: "widget-panel layout bug" and "widget panel layout bug" route differently. But the matcher (`containsSignal`) is duplicated in five hub routers (sk-code, sk-doc, sk-design, mcp-tooling, system-deep-loop), two policy cards, the compiler projection and the leaf replay, all serving code with parity tests. Which fix?
```

Options:
```text
Normalise in sk-code only (Recommended)
Normalise in every matcher
Compiler warning only
```

Answer:
```text
Normalise in every matcher
```

### Q006
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01NjuYNeBnKF8TvfN7DFmtuw:1 -->

Question:
```text
Rank 12 is half-confirmed: run plainly from a project that links the Skilled source in, generate-trigger-index.mjs indexes the source checkout's specs/ and says nothing. With `--repo-root .` it works. Which fix?
```

Options:
```text
Warn on root mismatch (Recommended)
Default to the caller's root
```

Answer:
```text
Warn on root mismatch (Recommended)
```

### Q007
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01MY21L4g8DgqGTQgwmq275k:0 -->

Question:
```text
Merging main into the worktree branch (to get the next system-spec-kit changelog version) stopped on conflicts in 4 files: the sk-doc and mcp-tooling activation manifest.json, both the authored and served copies. Each conflict is one line, the generated effectivePolicyHash; both sides changed the routing sources, so neither hash is right for the merged tree. I aborted the merge, and the branch is clean at e34a1469d3. How should I go on?
```

Options:
```text
Re-mint after merge (Recommended)
Skip the merge
```

Answer:
```text
Re-mint after merge (Recommended)
```

### Q008
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_011U9Yn2CxAJXSbPMD4nJCKX:0 -->

Question:
```text
The final merge of main (b478953ab7) into the branch stopped on 2 conflicts, both in generated files: the Hermes mirror .hermes/skills/system-spec-kit/ROUTER.md (main changed the source ROUTER.md's version and DECISION wording) and the compiled skill-graph.json (main and the branch both recompiled it). Neither file is hand-edited; each is produced from merged sources. The merge is paused, not committed. How should I go on?
```

Options:
```text
Regenerate both (Recommended)
Abort the merge
```

Answer:
```text
Regenerate both (Recommended)
```

### Q009
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_018LJcsiYnSv9iUJSXydG5JK:2 -->

Question:
```text
What should happen to the Angular-specific rules (CS3, A15, A16, I8, the Angular locale section) in the generic web layer?
```

Options:
```text
Generalize them (Recommended)
Remove them
Leave as is
```

Answer:
```text
Remove them
```

### Q010
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013yAMEmFbi8XrZpYHJUUsEb:1 -->

Question:
```text
How should the 15 iterations split across DeepSeek V4.1 Flash max and Luna 6 xhigh (normal speed)?
```

Options:
```text
15 each, two lineages (Recommended)
15 total, 8 + 7
```

Answer:
```text
15 total, 8 + 7
```

### Q011
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013yAMEmFbi8XrZpYHJUUsEb:2 -->

Question:
```text
Should the run stop early at convergence, or always run every iteration?
```

Options:
```text
Run all iterations (Recommended)
Allow early stop
```

Answer:
```text
Run all iterations (Recommended)
```

### Q012
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013yAMEmFbi8XrZpYHJUUsEb:3 -->

Question:
```text
What happens after the research?
```

Options:
```text
Research, then plan, then ask (Recommended)
Research, then implement
Research only
```

Answer:
```text
Research, then plan, then ask (Recommended)
```

### Q013
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_014eETmT6Q6Fq6yohcCVr1Ws:0 -->

Question:
```text
The research found no rendering breakage left in sk-code, but 27 structure and order defects (5 P1) in all six areas, and the root cause upstream: sk-create-skill's own templates teach joined bold labels and setext headings, and validate_document.py never reads body text. The plan adds ten render checks to the validator first (as warnings), fixes the templates and guidance, fixes the sk-code files (mechanical by script, authored by DeepSeek builds), then blocks new defects under package_skill.py --strict with a known-debt ledger for other skills. Approve the plan?
```

Options:
```text
Approve, build all (Recommended)
Prevention track only
sk-code fixes only
Not yet
```

Answer:
```text
Approve, build all (Recommended)
```

### Q014
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_014eETmT6Q6Fq6yohcCVr1Ws:1 -->

Question:
```text
SC-002 said every new validator check must flag the old cascade file, but only five of the ten can, since that file has no setext headings, numbering or order defects. Accept the reworded criterion: each check flags at least one named known-bad file, and none flags a file the research confirmed clean?
```

Options:
```text
Accept the rewording (Recommended)
Drop the five checks
```

Answer:
```text
Accept the rewording (Recommended)
```

### Q015
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_018KR2ix6ep43EVeSRt1QRww:2 -->

Question:
```text
The phase 010 build is almost done: it adds the ten render checks, the fixed templates and the strict gate. Finish and commit it first, so every new phase is measured against those checks?
```

Options:
```text
Finish 010 first (Recommended)
Fold 010 into the new program
```

Answer:
```text
Finish 010 first (Recommended)
```

### Q016
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:chat:7fe26c90-9f5a-4044-9b46-48f96babb903:4901a9db-5236-40cd-841f-fd9fa558d260 -->

Question:
```text
Do you want me to remove it, or keep it as is?
```

Options: none

Answer:
```text
Remove it dor skilled
```

### Q017
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:chat:16852fe3-f4c6-49b9-9421-f11f195396c8:7edaa4db-028d-45ea-b678-3003fc0aca5f -->

Question:
```text
I'd follow the decision-capture precedent and fold all of it into v4.0.1.0, as a short "Frontend Surface" section plus bullets in Skill Routing and Spec Kit. I'd also add those README entries, all from DeepSeek briefs, then run the doc validators and commit. The other option is a new release-notes entry instead of extending v4.0.1.0. Shall I go ahead with folding it into v4.0.1.0?
```

Options: none

Answer:
```text
Update alignment command to also chrck more broadly so it doesnt happed, and yes fold into
```

<!-- /ANCHOR:operator-answers-verbatim -->
