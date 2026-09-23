# Phase 050 evidence pack (orchestrator-verified facts, the only source for packet docs)

Every number below was observed by the orchestrator in worktree 061 unless marked HANDOVER.
Do not invent any fact that is not here. If a template section has no fact here, write
"N/A - insufficient source context" rather than guessing.

## Identity
- Packet: specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof, Level 2.
- Parent: specs/system-speckit/033-system-speckit-v4 (phase 50 of 50). Predecessor 049-gate-3-delivery-residue. Successor none.
- Title: "CI cleanup and Pi Gate-3 live proof".
- Created 2026-09-22. Work ran 2026-09-22 to 2026-09-23.
- Worktree .worktrees/061-ci-cleanup-pi-proof, branch worktrees/061-ci-cleanup-pi-proof, base commit 1cc5dfa692.
- Status now: In Progress. Nothing committed, merged or pushed yet.
- main's three commits past the base: 377a22e1a9 (LLM Gateway MiMo route), f5a89115b1 and 2c8f243607 (sk-design compiled routing, another session, local only).

## Problem and purpose
- Problem: phase 049 closed the Gate-3 residue but left two loose ends. The Pi Gate-3 dialog was proven only through
  the fake-ExtensionAPI suite (048: Pi extension suite 9/9 through the production handlers), never in a live Pi run.
  Six CI surfaces were red before this phase started.
- Purpose: prove the Pi Gate-3 contract in a live headless run and a live TUI run, and green the six CI surfaces
  without weakening any gate.

## The six CI surfaces (what was wrong, what changed, which workflow runs it)
1. Hermes mirror drift. Four Hermes skill copies (cli-hermes, cli-opencode, cli-pi, deep-ai-council) and the compiled
   deep-ai-council command contract (.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md, two sha256
   pins) were regenerated. Workflows: command-tree-parity.yml, deep-loop-runtime.yml.
2. Skill doc frontmatter. 14 cli-orca docs (13 under references/, plus assets/PROVENANCE.md) changed
   contextType: reference -> contextType: general. Workflow: skill-doc-frontmatter.yml.
3. Skill graph metadata. cli-orca/graph-metadata.json: category cli-tool -> cli-orchestrator, three derived entries
   kind doc -> reference, sibling weights to cli-external-orchestration and mcp-tooling 0.3 -> 0.4. Reciprocal sibling
   edges added in cli-external-orchestration, cli-jev, mcp-tooling and sk-git graph-metadata.json.
   Workflow: routing-registry-drift.yml.
4. Scorer eval baseline ratchet. See "Scorer regression" below. Workflow: routing-registry-drift.yml.
5. Markdown links. Six broken links repointed to their z_archive/ locations: cli-jev manual-testing-playbook (1),
   system-spec-kit runtime/hooks/cursor/README.md (1), runtime/hooks/devin/README.md (2),
   sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md (2).
   Workflow: markdown-link-integrity.yml.
6. Spec-kit CLI tests. recursive-child-manifest.vitest.ts had two hardcoded .opencode/specs paths, corrected to the
   tracked specs/ tree. Workflow: spec-kit-check.yml.

## Scorer regression (root cause and fix)
- Symptom: the ratchet baseline had been recaptured at 151/195 full-corpus and 26/32 memory_save, down from the
  committed 152/195 and 27/32 (captured at a9c4bc0abc). The ratchet header says a drop is a regression.
- Mechanism: cli-jev, added 2026-09-20 in commit 664317ef6a9, listed the bare word "run" in its SKILL.md Keywords
  comment (read by the explicit_author lane, raw 0.70) and in derived.key_topics (derived_generated lane, raw 0.53).
  Corpus row 26, "Resume iteration from the last state log entry, then continue the overnight run.", gold
  system-deep-loop, routed to cli-jev (score 0.393 vs system-deep-loop 0.169).
- Experiments on git-archive copies of the base tree (scratch copies, the worktree untouched):
  clean base 151/26; base with this phase's cli-jev edge only 151/26 (so this phase's edits did not cause it);
  base without cli-jev 152/27; base without the SKILL.md "run" keyword 152/27.
- Fix: removed "run" from .skilled/skills/cli-jev/SKILL.md line 8 Keywords and from derived.key_topics in
  .skilled/skills/cli-jev/graph-metadata.json, regenerated .hermes/skills/cli-jev/SKILL.md, restored
  scorer-eval-baseline.json to its committed content.
- Result: live 152/195 and 27/32; row 26 routes to system-deep-loop; row 157 moved from cli-jev to system-spec-kit
  (wrong both before and after, so no count change). A fresh capture equals the committed baseline on every metric and
  every fixture hash.
- Side effect, open: the SKILL.md edit changes cli-jev's compiled-routing policy hash, so
  compiled-route-guard.cjs reports cli-jev stale-manifest and CJ-001 serves through legacy routing.
  compiled-route-admission.cjs --hub cli-jev passes 3/3. Operator decision: re-mint after merging main, with
  node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev,
  then require the guard to report fresh and CJ-001 to route compiled before any push.

## Pi Gate-3 live proof
- Headless parent-mode probe (evidence/pi-headless-*.txt, evidence/pi-headless-delivery-marker.json):
  env AI_SESSION_CHILD=0 SYSTEM_SPEC_GATE_ENFORCE=0, pi -p --offline, model llmgateway/glm-5.3-flash, stdin closed.
  pi_rc=0; stdout exactly "HEADLESS PROBE ACK"; marker status open, questionDeliveredChannel classify-deferral,
  questionDeliveredCount 1; no spec-gate state residue; docs/hermes-notes.md absent.
  spec-gate-core.mjs:105 treats a session as a child only when AI_SESSION_CHILD is exactly 1, and :1782 enforces only
  when SYSTEM_SPEC_GATE_ENFORCE is exactly 1, so the probe ran the real parent classifier in advisory mode.
  The stderr line "CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out" came from the skill-advisor hook's CLI
  fallback (status fail_open, freshness unavailable), not from the model provider. A later run logged status ok.
- TUI run (evidence/pi-tui-select.txt, pi-tui-input.txt, pi-tui-final.txt, pi-tui-state.json, pi-tui-warning.log):
  select dialog, then path input, then the first write refused with "Spec gate: bound to
  specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof for this session. Retry the same call.",
  retry passed, later edits passed with no second question. State file status satisfied with that bound path.
  Warning log: 2026-09-22T15:10:47Z would-deny for write docs/gate3-probe.md. Probe files removed afterwards.
  The TUI capture carries a tmux extended-keys warning, so a future scripted drive may need tmux configured before
  Enter-key automation is trusted (HANDOVER).

## Verification observed (command -> result)
- node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check -> PASS: 70 Hermes skill copies in sync, exit 0
- node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check -> PASS: 33 prompts are in sync, exit 0
- system-deep-loop/runtime: vitest check-contract-drift + render-command-contract -> 2 files, 42 tests passed, exit 0
- bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage -> docs=101 violations=0, exit 0
- python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only -> VALIDATION PASSED (15 discovered, 1 route-excluded), exit 0
- node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs -> checked=15 fresh=15 stale=0 errored=0, exit 0
- node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs -> 7834 files, 13510 links, 0 broken, exit 0 (was 2 broken, exit 1)
- system-skill-advisor/runtime: vitest routing-registry-drift-guard, routing-parity-deep-skills, routing-parity-deep-council, parity/scorer-eval-baseline-ratchet -> 4 files, 28 tests passed (ratchet 7/7), exit 0
- system-spec-kit/runtime/cli: npx vitest run --config ../../vitest.config.ts --project cli -> clean full re-run:
  143 files passed, 3 skipped; 1441 tests passed, 19 skipped of 1460; exit 0; 485 s. An earlier full run in this session,
  1592 s under heavy concurrent load, failed 3 tests in tests/runtime-memory-inputs.vitest.ts; that file passes 24/24 alone
  and the same tree passed in full afterwards. Its failure messages were not captured, so load as the cause is inferred.
- the changed test alone: npx vitest run --config ../../vitest.config.ts --project cli tests/recursive-child-manifest.vitest.ts
  -> 1 file, 2 tests passed, exit 0
- re-score after the cli-jev fix -> 152/195 full corpus, 27/32 memory_save; row 26 routes to system-deep-loop
- node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev -> OK, all hard invariants passed, exit 0
- node .skilled/bin/compiled-route-admission.cjs --hub cli-jev -> pass, 3 pass 0 drift 0 stale, exit 0
- node .skilled/bin/compiled-route-guard.cjs -> cli-jev stale-manifest (the other five hubs fresh). Open until the post-merge re-mint.
- repair-derived.cjs --apply on this packet, on 048 and on the parent -> repaired=1 failed=0 each. The parent's
  children_ids went from 49 to 50 entries with 050 added. 048 and the parent only had their fingerprints refreshed.
- validate.sh --strict on this packet -> RESULT: PASSED, Errors 0, Warnings 0, exit 0 (before the closing edits).
- validate.sh --strict on 048 -> RESULT: PASSED, Errors 0, Warnings 0, exit 0.
- validate.sh --strict on the parent (auto-recursive over 50 phases) -> 50 folder results PASSED (the parent and 49
  phases), 1 FAILED, exit 2. The failure is 030-spec-kit-simplification-research, SPECDOC_SUFFICIENCY_005: its goal.md
  durable slice is 6498 characters against a 4000 limit. No file in 030 and no validator file changed in this worktree,
  so the failure predates this phase and sits outside its scope.
- check-completion.sh on this packet (before the closing edits) -> P0 13/13, P1 9/13, P2 1/1, 3 acceptance criteria
  unmet, RESULT: BLOCKED. Expected until the post-merge steps.

## Commits, merges and the cli-jev re-mint (2026-09-23)
- Seven owner-scoped commits on the worktree branch: 6b1141a307 (hermes), 83f42ed6ba (commands), 13bc85b318 (cli-orca),
  f0411552aa (cli-jev), 222e51a60f (system-spec-kit), 465dba4e38 (sk-doc), 57d26efd07 (specs). The repository's
  commit-msg hook forbids Co-Authored-By trailers, so none carries one.
- The route-remint pre-commit gate printed "[gate:route-remint] re-minted cli-jev and staged both manifests" during
  f0411552aa. The cli-jev effectivePolicyHash moved from 3240ebf5 to 178b10dd inside that commit, so the re-mint ran at
  commit time, before any merge. That commit's message still says the manifest stays stale until a re-mint after the merge.
- Merge 1, f127890ea7: local main 2c8f243607 into the worktree branch, clean.
- The other session then pushed: origin/main, origin/skilled/v4.0.0.0 and local main all moved to 80dc0a118d, which
  carries f5a89115b1, 2c8f243607, f2a90d7ac5, a6307ce69a and 80dc0a118d (fix(routing): re-mint the sk-doc manifest from
  its committed inputs). The earlier sk-doc stale-manifest on local main is fixed by that commit.
- Merge 2, 0b39a1f6c3: 80dc0a118d into the worktree branch. Conflicts in .hermes/skills/{cli-hermes,cli-opencode,cli-pi}/SKILL.md,
  because f2a90d7ac5 changed those skill sources and regenerated the mirrors while 6b1141a307 regenerated them from the
  older sources. The first attempt was aborted (the orchestrator had not gated on the dry-run result), then re-run with
  the operator's yes: main's copies taken, every mirror regenerated (1 of 70 written, the drifted sk-design mirror),
  sync --check PASS 70. The merge commit's route-remint gate re-minted cli-external-orchestration, which matches main's
  manifest byte for byte.
- Merged-tree checks on 0b39a1f6c3: Hermes skills 70 in sync, prompts 33, frontmatter 0 violations, graph compiler
  VALIDATION PASSED, freshness 15/15, links 0 broken, compiled-route-guard all seven hubs fresh (exit 0), deep-loop
  contract tests 42 passed, advisor routing and ratchet tests 28 passed, recursive-child-manifest 2 passed, packet
  validate strict PASSED. CJ-001 prompt through .skilled/bin/compiled-route.cjs routes compiled to cli-usage under
  178b10dd. compiled-route-admission --all: six hubs pass, sk-design 1 drift, identical on origin/main; CI runs it with
  --warn-only while the guard is blocking.
- Two stray full deep-loop runtime suite runs were started by orchestrator command mistakes and stopped (pids 81981 and
  87318). They changed no file.

## Evidence location
- The live-proof captures and the dispatch trail first lived in scratch/. They moved to evidence/ before the commit,
  because the packet docs cite them and system-spec-kit's folder-structure rules say scratch/ is disposable and must
  not be cited from permanent docs. scratch/ now holds only .gitkeep.

## Out of scope (with reasons)
- Re-minting the sk-design or sk-doc routing hubs: their bytes belong to another session.
- The full deep-loop runtime suite: its earlier baseline run exceeded 900 seconds (HANDOVER); the focused contract
  tests above are the evidence.
- Nine pre-existing run-all-drift-guards.sh errors (6 missing set -uo pipefail, 2 missing references/README.md,
  1 missing assets/voice-report-template.md): they match the pre-change baseline (HANDOVER) and are outside the six surfaces.

## Primary checkout residue (merge blocker, open)
- The scaffold for this packet ran against the primary checkout path, so the primary checkout holds this phase's own
  residue: specs/system-speckit/033-system-speckit-v4/spec.md modified with two placeholder rows only
  ("| 50 | 050-ci-cleanup-pi-proof/ | [Phase 50 scope] | Pending |" and the 049 -> 050 handoff row with [Criteria TBD]),
  and an untracked specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/ folder byte-identical to the
  original scaffold. Both block updating the primary checkout's main to the phase commit. Removing them touches the
  primary checkout, so it waits for the operator's yes at the merge step. The primary's other dirty entries belong to
  another session and are not touched.

## Parent and sibling records (done)
- Parent spec.md: phase map row 50 (status "in progress") and the 049 -> 050 handoff row added (wu6).
- 048 implementation-summary.md: one Verification row recording this live Pi proof (wu7).

## Environment note
- The worktree lacked .skilled/skills/sk-doc/node_modules/@spec-kit/shared, so parent-skill-check could not load its
  root-router library. The orchestrator mirrored the primary checkout's gitignored link
  (shared -> ../../../system-spec-kit/shared). No tracked file changed. sk-git's rule 8 names the full remedy for a
  fresh worktree: worktree-naming.sh provision.

## Delivery model
- Implementation edits ran through cli-pi with model llmgateway/mimo-v2.6-pro, one change per brief; the Claude
  session orchestrated, verified every handback independently and made the decisions below with the operator.
  Briefs and handbacks are in evidence/dispatch/: wu1-links, wu2-jev-run-topic, wu3-jev-run-keyword, wu4-baseline-restore,
  wu5-doc-* (the six packet documents), wu6-parent-rows, wu7-048-live-row, wu8-rev-* (the revision pass over the six
  documents) and wu9-close-* (the closing status edits), all against this evidence pack.

## Operator decisions (2026-09-23)
- Bring the two archived links into scope (their targets were tracked archive files, not another session's packet).
- Find the cause of the scorer drop before deciding, then fix it at cli-jev.
- Re-mint cli-jev's compiled-routing manifest after merging main.
- Push local main including the other session's two unpushed commits (f5a89115b1, 2c8f243607).
- Rebuild handover.md from the template. Reason: the earlier hand-written handover had no frontmatter, no template
  header and no anchors, which produced three of the five strict-validation errors.
- Reason for the push decision: the operator chose to publish local main as it stands, which carries the other
  session's two commits along with this phase.

## Requirement, criterion and task ids (use exactly these)
- REQ-001 P0 Pi headless live proof. AC-001. Met.
- REQ-002 P0 Pi TUI live proof. AC-002. Met.
- REQ-003 P0 The six CI surfaces pass locally without weakening a gate.
  AC-003 Hermes and deep-loop contract (Met). AC-004 frontmatter, graph compiler, freshness (Met).
  AC-005 Markdown links (Met). AC-006 spec-kit CLI project (Met).
- REQ-004 P1 Scorer drop root-caused and fixed at the producer; baseline equals the committed 152/27. AC-007. Met.
- REQ-005 P1 cli-jev compiled routing re-minted after the merge; guard fresh; CJ-001 routes compiled. AC-008. Unmet (post-merge).
- REQ-006 P1 Packet validates strict with RESULT: PASSED and the parent records are reconciled. AC-009. Met.
- REQ-007 P1 Merged-tree re-verification (Hermes sync, scorer ratchet, link check, route guard) before push. AC-010. Unmet (post-merge).
- Tasks: T001 worktree and scaffold; T002 pre-change baseline; T003 Pi headless probe; T004 Pi TUI drive;
  T005 Hermes and compiled contract regen; T006 cli-orca frontmatter; T007 graph metadata and sibling edges;
  T008 six link repoints; T009 recursive-child-manifest paths; T010 scorer root cause; T011 cli-jev "run" removal and
  Hermes regen; T012 baseline restore; T013 packet docs and parent records; T014 strict validation;
  T015 merge main and re-mint cli-jev; T016 merged-tree re-verification; T017 commit, push, CI watch, worktree removal.
  T001-T014 are done. T015-T017 are open.
