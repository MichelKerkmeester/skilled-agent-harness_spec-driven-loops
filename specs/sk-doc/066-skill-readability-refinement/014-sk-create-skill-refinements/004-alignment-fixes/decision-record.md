---
title: "Decision Record: Phase 4: alignment-fixes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-alignment-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes"
    last_updated_at: "2026-11-05T19:19:56.373Z"
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
# Decision Record: Phase 4: alignment-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Wait for the Codex usage limit to reset at 12:26 rather than switch executor. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals |
| Q002 | Amend REQ-006 so native topic files cite their React Native check instead of a web-features Baseline status. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals REQ-006 |
| Q003 | Make the orphan-signal check track only generated router signals, so hand-curated signals are never flagged. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/002-tooling-fixes |
| Q004 | Normalise hyphen and space in every routing matcher, not only the one that surfaced the bug. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/005-inferred-confirmations rank 11 |
| Q005 | Make generate-trigger-index.mjs warn when the caller's git root differs from its own checkout, keeping the default root. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/005-inferred-confirmations rank 12 |
| Q006 | Resolve the generated-file conflicts by re-minting the manifests and copies after the merge. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals |
| Q007 | Regenerate both conflicted generated files from the merged tree instead of picking a side. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals |
| Q008 | Remove the Angular-specific rules from the generic web layer. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals, sk-code-frontend web layer |
| Q009 | Split the 15 research iterations into 8 on DeepSeek V4.1 Flash max and 7 on Luna 6 xhigh. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/010-reference-readability-research |
| Q010 | Run every research iteration instead of stopping at convergence. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/010-reference-readability-research |
| Q011 | After the research, write a plan and ask before building. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/010-reference-readability-research |
| Q012 | Approve the research findings and build every fix it proposed. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/010-reference-readability-research |
| Q013 | Accept SC-002 reworded so only the checks that can flag the old cascade file must do so. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals SC-002 |
| Q014 | Have Luna audit and DeepSeek fix in each skill or mode phase. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/plan.md |
| Q015 | Finish and commit phase 010 before starting the per-skill phases. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/010-sk-prompt |
| Q016 | Read the restriction as executors only: work runs on cli-pi, cli-opencode and cli-codex, never Devin. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/goal.md |
| Q017 | Fix the two Style Reference DESIGN.md files by adding an overview section. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q018 | Run an independent review on every skill's diff before its commit. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q019 | Keep the dispatcher at 5 leaf workers. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q020 | Send the evilcharts DESIGN.md conflict to a fresh opus-medium investigation before deciding. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q021 | Narrow the style-reference rule so hash-pinned DESIGN.md files are skipped rather than edited. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q022 | Fix the drift between the sk-create-goal asset templates and spec-kit's goal template. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement |
| Q023 | Exempt the four deep-loop runtime asset files whose exact text code depends on. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement, render-known-debt.json exempt |
| Q024 | Build every sk-create-skill refinement from the review, P1 through P3. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/spec.md |
| Q025 | Skill READMEs open with OVERVIEW, not AT A GLANCE. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet |
| Q026 | Protect code-pinned docs from rewrites while their render checks still run. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard ADR-002 |
| Q027 | Keep the new render checks advisory until phase 003 enforces them. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate |
| Q028 | Keep the five format-spec files as a validator skip instead of exempt entries. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard ADR-003 |
| Q029 | Map each hard guard finding on the templates to the task that required it. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet ADR-003 |
| Q030 | Allow an intro-only edit to the pinned code-quality-standards.md. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet |
| Q031 | Run the local alignment check over the whole program range. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes |
| Q032 | Move the v4.0.1.0 tag to the new main head and replace its release notes. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes, .skilled/changelog/skilled/v4.0.1.0.md |
| Q033 | Add one short line naming every skill and mode with a changelog entry to the v4.0.1.0 notes. | Not stated. | None | .skilled/changelog/skilled/v4.0.1.0.md |
| Q034 | Record the session's operator answers in the 014/004 decision record. | Not stated. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes/decision-record.md |
| Q035 | Bring both web and native guidance into canonical sk-code. | Not stated. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/001-frontend-surface-mode |
| Q036 | Remove React Native from canonical Skilled, reversing the earlier choice to carry web and native guidance. | Not stated. Evidence: alternative, option True, overlap 1, imperative False, shift False. | None | specs/sk-code/code-surfaces/005-frontend-upstream-proposals/001-frontend-surface-mode |
| Q037 | Fold the frontend work into the v4.0.1.0 notes and widen the alignment check so a missed entry is caught. | Not stated. Evidence: open_value, option not_applicable, overlap 1, imperative False, shift False. | None | .skilled/changelog/skilled/v4.0.1.0.md |
| Q038 | Fix every upheld alignment finding, using DeepSeek Flash on LLM Gateway where an executor is needed. | Not stated. Evidence: yes_no, option True, overlap 1, imperative False, shift False. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes |
| Q039 | Fix the items first left unfixed, including the alignment command's repo-root resolution. | Not stated. Evidence: yes_no, option False, overlap 0, imperative True, shift False. | None | specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes REQ-007 to REQ-009 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
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

### Q002
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

### Q003
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

### Q004
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

### Q005
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

### Q006
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

### Q007
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

### Q008
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

### Q009
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

### Q010
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

### Q011
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

### Q012
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

### Q013
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

### Q014
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_018KR2ix6ep43EVeSRt1QRww:1 -->

Question:
```text
How should the two executors split each skill or mode phase? Luna 6 xhigh fast runs on cli-codex; DeepSeek V4.1 Flash high runs on cli-pi as llmgateway/deepseek-v4.1-flash-1017 (DevPass, metered per token).
```

Options:
```text
Luna audits, DeepSeek fixes (Recommended)
Both audit, DeepSeek fixes
Split the skills
```

Answer:
```text
Luna audits, DeepSeek fixes (Recommended)
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
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01X1LongPfu82MCdURM3ogxd:0 -->

Question:
```text
"Only cli pi, opencode and codex": do you mean which CLIs run the work, or which cli-external-orchestration mode docs get refined? Right now no Devin CLI is used: every call is cli-opencode (DeepSeek max, audit/review) or cli-pi (DeepSeek high, fixes); 'cli-devin' is only the name of the mode whose docs are being refined.
```

Options:
```text
Executors only
Mode scope
Both
```

Answer:
```text
Executors only
```

### Q017
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:0 -->

Question:
```text
Two DESIGN.md Style References fail validation for a missing overview section: sk-design-chart's `assets/style-reference/evilcharts/DESIGN.md` and sk-design-diagram's `assets/style-reference/harness-diagram/DESIGN.md`. Both are unchanged from HEAD, and the DESIGN.md format has no overview section. `validate_document.py` already exempts the format spec and its four example DESIGN.md files for this reason (FORMAT_SPEC_FILES). The completion criteria need invalid=0. How should I handle them?
```

Options:
```text
Exempt in validator (Recommended)
Add an overview section
Leave them invalid
```

Answer:
```text
Add an overview section
```

### Q018
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:1 -->

Question:
```text
The first round of independent opus-medium reviews found misses my own diff reads didn't catch: a reordered procedure in system-spec-kit and a dropped paragraph in cli-jev. Should every remaining skill get one opus-medium review of its diff before its commit?
```

Options:
```text
Yes, every skill (Recommended)
Only large skills
No, my read only
```

Answer:
```text
Yes, every skill (Recommended)
```

### Q019
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:2 -->

Question:
```text
The dispatcher holds total leaf workers at 5. At 5 there have been no 429s and no slowdown per step. Should I raise the cap? The long leaves left are sk-code-skilled (73 files), sk-design-diagram (62) and sk-doc's 15 modes.
```

Options:
```text
Keep 5
Raise to 7
```

Answer:
```text
Keep 5
```

### Q020
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01RjkmzAfDLwusgAxxKfFMvA:0 -->

Question:
```text
I tried adding the overview to evilcharts/DESIGN.md and found a conflict. A `## 1. OVERVIEW` heading makes the file valid, but then it has 5 render warnings, 'unnumbered H2 among numbered peers'. Numbering the other sections would break `sk-design-chart/scripts/apply-design-md.cjs`, which finds sections by exact text such as `## Tokens — Colors`, and the DESIGN.md format the generator writes. I've put the file back to HEAD. Which way should I go?
```

Options:
```text
Exempt in validator (Recommended)
Number all and update parser
Leave them invalid
```

Answer:
```text
ask fresh opus medium to investigate
```

### Q021
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_017QQNs46jXPxojcAtAh83w9:0 -->

Question:
```text
The investigation found that evilcharts/DESIGN.md is hash-pinned in palettes.json and origin.md (I confirmed it), so any edit, an overview included, fails the chart corpus gate. The DESIGN.md format spec also says these headings are rendered verbatim and read by both apply-design-md.cjs scripts. Its recommendation: a narrow rule in validate_document.py that skips any DESIGN.md under assets/style-reference/<name>/, plus a test. That rule matches exactly these 2 files, and the 1,290 styles/library bundle DESIGN.md files are not matched. Should I make that change?
```

Options:
```text
Narrow style-reference rule (Recommended)
List the two paths
Leave them invalid
```

Answer:
```text
Narrow style-reference rule (Recommended)
```

### Q022
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_019hAZLpfdmWDZb4tAceNiim:0 -->

Question:
```text
sk-create-goal's template-parity test fails 3 of 32 because its three goal asset templates lack the FILL line system-spec-kit's goal.md.tmpl gained on 2026-10-26 (fails at the program's base commit too). Its README row claims a green run, and that row now blocks the sk-create-goal leaf and the sk-doc commit. How should I handle it?
```

Options:
```text
Fix the drift (Recommended)
Record as known failure
Restore HEAD wording
```

Answer:
```text
Fix the drift (Recommended)
```

### Q023
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01JZ1UqLhp6tUXLBACfufnFg:0 -->

Question:
```text
Four deep-loop asset files can't reach 0 render warnings through doc edits alone, because code depends on their exact text: (1) the lettered H2s 6A/10A/11A in deep-research's dashboard and strategy templates and 2A/10A in deep-review's, which reduce-state.cjs writes verbatim and vitest asserts; (2) deep-review's review-mode-contract-snapshot.md, generated by render-contract-snapshot.cjs, which emits no overview; (3) deep-ai-council's prompt-pack-round.md, sent whole as every seat's prompt, which has no overview and unnumbered H2s. The goal requires an empty debt object, which conflicts with D2 (form only; tests are out of scope). How should these be handled?
```

Options:
```text
Keep as debt (Recommended)
Change the code
Exempt runtime files
```

Answer:
```text
Exempt runtime files
```

### Q024
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01D9r9WJyw2G7WP8Mimv6wph:0 -->

Question:
```text
Which of the sk-create-skill refinements from the review should be built? (P1: overview-subsection check, one strict gate, wider scan plus CI, ledger ratchet, one exempt mechanism, shipped rewrite guard. P2: §N reference check, intro template fixes and checks, README first section plus README checks, one REFERENCES section, related-last fix. P3: size table, small check defects, fence-aware section scan.)
```

Options:
```text
P1 + P2 (Recommended)
All of P1–P3
P1 only
Nothing yet
```

Answer:
```text
All of P1–P3
```

### Q025
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01D9r9WJyw2G7WP8Mimv6wph:2 -->

Question:
```text
Should skill READMEs open with AT A GLANCE or OVERVIEW? The skill and parent-skill README templates use AT A GLANCE, while the validator rule and the sk-create-readme template expect OVERVIEW.
```

Options:
```text
OVERVIEW (Recommended)
AT A GLANCE
```

Answer:
```text
OVERVIEW (Recommended)
```

### Q026
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01D9r9WJyw2G7WP8Mimv6wph:3 -->

Question:
```text
Docs whose exact strings code pins (for example check-rule-copies.js reading code-quality-standards.md): how should they be handled?
```

Options:
```text
Protect, still check (Recommended)
Exempt them
```

Answer:
```text
Protect, still check (Recommended)
```

### Q027
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01VAHHZsCSKwpcEtRWxBAWjC:0 -->

Question:
```text
Phase 001 adds new render checks (overview subsections, section references, intro checks, number gaps) and widens the scan to SKILL.md, ROUTER.md and hub shared/ trees. That will raise findings across the fleet, for example the 80 references without a Purpose, and strict packaging would fail for several skills until phase 003 clears them. The ledger's own rule says never add an entry to excuse a new finding. How should phase 001 land?
```

Options:
```text
Advisory until 003 (Recommended)
Seed the ledger
Fix fleet in 001
```

Answer:
```text
Advisory until 003 (Recommended)
```

### Q028
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_0193XA7i8QBFSD37NpkRxbNN:0 -->

Question:
```text
Phase 002 task T005 says to move the validator's two hard-coded skips into the render ledger's exempt map. One of them doesn't fit. Every exempt entry must name a code file (the consumer) that reads or generates the doc and that contains the doc's name (REQ-002). The 2 Style Reference DESIGN.md files fit: apply-design-md.cjs reads them. The 5 DESIGN.md format-spec files (design-md-format.md and the linear/stripe/supabase/vercel examples) have no code consumer at all. They are skipped because other docs cite their section numbers. How should those 5 be handled?
```

Options:
```text
Keep as validator skip (Recommended)
Allow a doc consumer
Validate them normally
```

Answer:
```text
Keep as validator skip (Recommended)
```

### Q029
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01XAyhJfStaWZPYNEyhsznBw:0 -->

Question:
```text
Phase 003's T010 says the rewrite guard must report no hard finding on the changed templates. But T005, T006 and T009 require edits inside fenced scaffolds (the README scaffolds, the description placeholder, the size diagrams, the '800 words' example), and the guard treats any fenced-block edit as hard. All 10 flagged blocks are those intended edits. How should T010 be checked?
```

Options:
```text
Map each hard finding (Recommended)
Undo fenced edits
Stop here
```

Answer:
```text
Map each hard finding (Recommended)
```

### Q030
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013TTrCHky16Cdnv3QperZUY:0 -->

Question:
```text
The pinned doc sk-code/shared/references/universal/code-quality-standards.md carries one render finding: its intro (line 17) repeats its description. check-rule-copies.js pins six rule strings in that doc, and the intro sentence is none of them. The rewrite guard refuses any edit to a pinned doc, and the finding must clear before the staged sets can empty. How should it be handled?
```

Options:
```text
Allow intro-only edit (Recommended)
Move it to the exempt map
Leave it for you
```

Answer:
```text
Allow intro-only edit (Recommended)
```

### Q031
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01NKf6vDTZP6Xbx1WP2Z7JDb:0 -->

Question:
```text
I haven't run /local-skilled-alignment on this branch yet. It writes a report outside the checkout and only edits files if you pass --fix. It uses the default deepseek lanes (DeepSeek on cli-pi), which fit the executor rule (D1). Which range should it check?
```

Options:
```text
Phase 003 range (Recommended)
Whole program
Final switch only
```

Answer:
```text
Whole program
```

### Q032
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01HWjfmGPZQ1L8fnPpBvTCi8:1 -->

Question:
```text
After the merge, republishing the live release means: rewrite v4.0.1.0.md through sk-create-changelog (sort order and wording, plus this branch's work), edit the GitHub release notes, and move the v4.0.1.0 tag from d1c57bb81d to the new main head. Moving a published tag rewrites what anyone already fetched for v4.0.1.0. Go ahead?
```

Options:
```text
Move tag + notes (Recommended)
Notes only
```

Answer:
```text
Move tag + notes (Recommended)
```

### Q033
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01BLfhByGrBsNMsZbdoRGEY5:0 -->

Question:
```text
The shorter v4.0.1.0 notes no longer name each skill and mode that got a changelog entry. The release-coverage check in your local /local-skilled-alignment command needs those names, so it now reports 48 of 55 missing. What should I do?
```

Options:
```text
Leave it out (Recommended)
Add one short line
Relax the check
```

Answer:
```text
Add one short line
```

### Q034
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01BLfhByGrBsNMsZbdoRGEY5:1 -->

Question:
```text
A hook reports 33 answers from this session that no decision record holds yet. Should I record them?
```

Options:
```text
Save to 014/004 (Recommended)
Skip
```

Answer:
```text
Save to 014/004 (Recommended)
```

### Q035
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

### Q036
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

### Q037
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

### Q038
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:chat:b02feafc-719e-4a93-bc92-3ae8829ea52c:a3e175aa-407f-4c2e-83ba-69f2a3a11c71 -->

Question:
```text
Do you want me to fix these? I'd start with X-01 and X-02, since they break CI, then do the rest under the same commit-per-skill rule. That's edits in about eight skills plus the doctor command tests, followed by a `--recheck` of this run.
```

Options: none

Answer:
```text
yes fix all use deepseek flash llmgateway as needed
```

### Q039
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:chat:e67219bc-f1fc-4284-97a5-b62443f7478f:8392e48e-79a5-42cc-ad4a-d516ea746f28 -->

Question:
```text
**Your call:**
- Pushing or merging `worktrees/315-frontend-reference-restructure` needs your instruction.
- Should I make the alignment scripts work out the repo root from the current directory? I'd need a yes to edit that file.
```

Options: none

Answer:
```text
fix not fixed
```

<!-- /ANCHOR:operator-answers-verbatim -->
