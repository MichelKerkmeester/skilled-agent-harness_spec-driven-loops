---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic (specs/sk-code/011-sk-code-poinytail-based-refinement phases 002-011), the merge 144b1d339e and its 8 hand-resolved conflicts, then 9a74576ccc and 5d9c970447. Full scope list: review/scope-files.txt (275 files).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing anything: review only, fixes become ranked recommendations.
- The 45 upstream commits on their own merits; only their interaction with the epic.

---

## 5. STOP CONDITIONS
- stopPolicy max-iterations: run all 10 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 18
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 1: per-file diffs of the merge result against BOTH parents isolated each side's intended change before judging resolution; regenerated artifacts were validated by their own check modes (generate-trigger-index --check, sync-skills-hermes --check).
- Iteration 2: cross-checked the deadline sweep's blanket claim against the four runtime configs' registered adapter inventory and git symlink modes; inline probes pinned settle/exit and post-deadline-write behavior of the CJS reader without writing files.
- Iteration 3: ran the admission and hint suites instead of trusting the commit's stated verification, and separated 'the advisor never passes the hint' from 'the hint is ignored' by reading the probe spawn argv and the tool schema.
- Iteration 4: recomputed the reducer claim from the packet probes instead of the commit text (per-folder sums: 146 folders, 1906 -> 1207, raised=0) and audited one restatement pair (luna-max F004-F006 narrative bullets vs iter-002.jsonl findingDetails) before accepting the drop as deduplication.
- Iteration 5: executed live stdin probes against the real shared reader (partial resolve at the deadline; 30 MB buffered with no cap) instead of trusting the reader's documented intent, and diffed the Webflow fix commit to attribute the depth cap and the callback-error path to 82d297a374 before judging the checker's blind spot.
- Iteration 6: ran the rule canary against the real tree (exit 0) with its 19-case self-test (exit 0), confirmed the known 004 jev-transport-single red by live run (all-canaries FAIL line; front-door action defer) and bounded it with fixture provenance (01829ed9e4, outside the reviewed range); re-ran the admission suite live and compared the pin set against the standards document to open the never-cut coverage gap (R6-COR-002).

- Iteration 7: ran every manifest/guard suite live instead of trusting the dispatched 26-pass/16-fail claim (42 pass, 0 fail) and counted the alignment leg's WARN lines to pin the umbrella gate's warn-only ambiguity (R7-MNT-001).
- Iteration 9: resolved both dispatched claims with live runs (hvr_scan.py prints the 36 SKILL.md hard blockers; the SA-001 battery prints 13/17 with 2/5 false positives and fails its own >=14/17 and 0/5 pass rule), then scanned all 360 sk-code markdown files for link, anchor and path drift with a symlink-aware checker and opened three P2 wrong/stale-path findings.
- Iteration 10: ran the whole mirror stack live before judging it (agent mirrors 12/12, runtime mirrors 187 across 8 trees, Hermes 70+37, Pi 12, pre-commit harness 71/0, checker vitest 6/6) and resolved three dispatched directions to ruled-out, leaving one P2 claim residue (recorded markers=0 at b5927055b0) and one banner-drift P2.
---

## 9. WHAT FAILED
- Iteration 7: none; the dispatched manifest 26/16 claim did not reproduce and was recorded as refuted.
- Iteration 9: the dispatched wording "the advisor battery passes" did not survive SA-001 section 2; the run itself is green (exit 0) and no-regression, so this is a dispatch-wording gap, not a tree defect.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### .skilled/plugins/... references as dead paths — the symlink target files exist. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: .skilled/plugins/... references as dead paths — the symlink target files exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .skilled/plugins/... references as dead paths — the symlink target files exist.

### .skilled/prompts/ mentions — command-authoring.md:43 states the path is not present in this workspace. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: .skilled/prompts/ mentions — command-authoring.md:43 states the path is not present in this workspace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .skilled/prompts/ mentions — command-authoring.md:43 states the path is not present in this workspace.

### 'fixed-routing count 7 vs 6' — no such assertion exists in the reviewed focus paths; only a stale reading of 'fixed path' wording matches. Not a finding; no reproducer exists. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: 'fixed-routing count 7 vs 6' — no such assertion exists in the reviewed focus paths; only a stale reading of 'fixed path' wording matches. Not a finding; no reproducer exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 'fixed-routing count 7 vs 6' — no such assertion exists in the reviewed focus paths; only a stale reading of 'fixed path' wording matches. Not a finding; no reproducer exists.

### 'leaf manifest tests 26 pass 16 fail' — refuted by six live suite runs (42 pass, 0 fail). 26+16=42 suggests the claim was a projection over this same suite set, but every suite is green at HEAD. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: 'leaf manifest tests 26 pass 16 fail' — refuted by six live suite runs (42 pass, 0 fail). 26+16=42 suggests the claim was a projection over this same suite set, but every suite is green at HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 'leaf manifest tests 26 pass 16 fail' — refuted by six live suite runs (42 pass, 0 fail). 26+16=42 suggests the claim was a projection over this same suite set, but every suite is green at HEAD.

### 'This epic introduced the jev canary red': refuted by fixture provenance (01829ed9e4 outside ba56b03412..5d9c970447) and the phase 003 Known Limitation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: 'This epic introduced the jev canary red': refuted by fixture provenance (01829ed9e4 outside ba56b03412..5d9c970447) and the phase 003 Known Limitation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 'This epic introduced the jev canary red': refuted by fixture provenance (01829ed9e4 outside ba56b03412..5d9c970447) and the phase 003 Known Limitation.

### "010-001 limitations 1-3 still open": disproved by the live guard run, both fixture suites, and both mirror checks (see Files Reviewed). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "010-001 limitations 1-3 still open": disproved by the live guard run, both fixture suites, and both mirror checks (see Files Reviewed).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "010-001 limitations 1-3 still open": disproved by the live guard run, both fixture suites, and both mirror checks (see Files Reviewed).

### "010-007's excluded sixteenth reader still blocks": `readSync` is gone from `claude/user-prompt-submit.ts`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "010-007's excluded sixteenth reader still blocks": `readSync` is gone from `claude/user-prompt-submit.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "010-007's excluded sixteenth reader still blocks": `readSync` is gone from `claude/user-prompt-submit.ts`.

### "011-002's 59-label repair is incomplete": live `rg` finds 0 remaining underscore-form link labels under `.skilled/skills/sk-code/sk-code-webflow` (changelog excluded). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "011-002's 59-label repair is incomplete": live `rg` finds 0 remaining underscore-form link labels under `.skilled/skills/sk-code/sk-code-webflow` (changelog excluded).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "011-002's 59-label repair is incomplete": live `rg` finds 0 remaining underscore-form link labels under `.skilled/skills/sk-code/sk-code-webflow` (changelog excluded).

### "011-006 left `scratch/before/reduce-state.cjs` in the packet": `scratch/before` is absent and nothing under it is tracked. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "011-006 left `scratch/before/reduce-state.cjs` in the packet": `scratch/before` is absent and nothing under it is tracked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "011-006 left `scratch/before/reduce-state.cjs` in the packet": `scratch/before` is absent and nothing under it is tracked.

### "36 HVR hard blockers in .skilled/skills/sk-code/SKILL.md" — **confirmed live**: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md | grep 'hard blockers'` prints `hard blockers: 36`; the phase-010 record carried 36 as the post-remediation baseline (down from a plan-time 37), and no sibling count rose. No finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "36 HVR hard blockers in .skilled/skills/sk-code/SKILL.md" — **confirmed live**: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md | grep 'hard blockers'` prints `hard blockers: 36`; the phase-010 record carried 36 as the post-remediation baseline (down from a plan-time 37), and no sibling count rose. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "36 HVR hard blockers in .skilled/skills/sk-code/SKILL.md" — **confirmed live**: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md | grep 'hard blockers'` prints `hard blockers: 36`; the phase-010 record carried 36 as the post-remediation baseline (down from a plan-time 37), and no sibling count rose. No finding.

### "F### double counting persists": no; the structured-id match at line 1002 resolves it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "F### double counting persists": no; the structured-id match at line 1002 resolves it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "F### double counting persists": no; the structured-id match at line 1002 resolves it.

### "The 011 children's version claims are stale": all five SKILL.md versions match the newest summary claims. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The 011 children's version claims are stale": all five SKILL.md versions match the newest summary claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 011 children's version claims are stale": all five SKILL.md versions match the newest summary claims.

### "The 1906 -> 1207 drop is mass finding loss": refuted for the remaining drop — same-id restatements, a recovery inside the same commit, and no folder increased. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The 1906 -> 1207 drop is mass finding loss": refuted for the remaining drop — same-id restatements, a recovery inside the same commit, and no folder increased.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 1906 -> 1207 drop is mass finding loss": refuted for the remaining drop — same-id restatements, a recovery inside the same commit, and no folder increased.

### "the advisor battery passes 13 of 17 with 2 of 5 false positives" — **numbers confirmed, "passes" refuted**: the live replay prints `positives 13/17 negatives-false-positive 2/5` at exit 0; SA-001 §2 (advisor-probe-battery.md:60,61) defines PASS as positive accuracy >= 0.80 (>=14 of 17) AND a 0/5 negative false-positive rate, and this run fails both. The epic holds the battery to a no-worse bar (011-003 REQ-005; 002 implementation-summary.md:111 calls it "a separate advisor-accuracy issue"), so the gap is a documented known limitation, not a new defect. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "the advisor battery passes 13 of 17 with 2 of 5 false positives" — **numbers confirmed, "passes" refuted**: the live replay prints `positives 13/17 negatives-false-positive 2/5` at exit 0; SA-001 §2 (advisor-probe-battery.md:60,61) defines PASS as positive accuracy >= 0.80 (>=14 of 17) AND a 0/5 negative false-positive rate, and this run fails both. The epic holds the battery to a no-worse bar (011-003 REQ-005; 002 implementation-summary.md:111 calls it "a separate advisor-accuracy issue"), so the gap is a documented known limitation, not a new defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "the advisor battery passes 13 of 17 with 2 of 5 false positives" — **numbers confirmed, "passes" refuted**: the live replay prints `positives 13/17 negatives-false-positive 2/5` at exit 0; SA-001 §2 (advisor-probe-battery.md:60,61) defines PASS as positive accuracy >= 0.80 (>=14 of 17) AND a 0/5 negative false-positive rate, and this run fails both. The epic holds the battery to a no-worse bar (011-003 REQ-005; 002 implementation-summary.md:111 calls it "a separate advisor-accuracy issue"), so the gap is a documented known limitation, not a new defect.

### "The advisor battery passes" — refuted by SA-001's own aggregate rule; the gap is documented. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The advisor battery passes" — refuted by SA-001's own aggregate rule; the gap is documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor battery passes" — refuted by SA-001's own aggregate rule; the gap is documented.

### "The margin rule breaks the shared parser callers": the packet probe reports 8,552 files, changed=0; not independently rerun here (packet evidence). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The margin rule breaks the shared parser callers": the packet probe reports 8,552 files, changed=0; not independently rerun here (packet evidence).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The margin rule breaks the shared parser callers": the packet probe reports 8,552 files, changed=0; not independently rerun here (packet evidence).

### *"b592 diverged the two pre-commit hook copies."* Refuted: the untouched copy is a documented legacy helper for direct tests, so only the installed hook needed the Hermes gate. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: *"b592 diverged the two pre-commit hook copies."* Refuted: the untouched copy is a documented legacy helper for direct tests, so only the installed hook needed the Hermes gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: *"b592 diverged the two pre-commit hook copies."* Refuted: the untouched copy is a documented legacy helper for direct tests, so only the installed hook needed the Hermes gate.

### *"Mirror bodies drifted from `.skilled`."* Refuted by the live gate runs plus the `Case:`-rule grep across all five dialects and the symlink verification for `.cursor`/`.devin`/`.opencode`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: *"Mirror bodies drifted from `.skilled`."* Refuted by the live gate runs plus the `Case:`-rule grep across all five dialects and the symlink verification for `.cursor`/`.devin`/`.opencode`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: *"Mirror bodies drifted from `.skilled`."* Refuted by the live gate runs plus the `Case:`-rule grep across all five dialects and the symlink verification for `.cursor`/`.devin`/`.opencode`.

### *"Pi agent mirrors are unguarded."* Refuted for the reporting bar: CI runs both Pi checks on pull_request and push with `.pi/**` in the path filters; the local roster check covers presence; live `--check` passes. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: *"Pi agent mirrors are unguarded."* Refuted for the reporting bar: CI runs both Pi checks on pull_request and push with `.pi/**` in the path filters; the local roster check covers presence; live `--check` passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: *"Pi agent mirrors are unguarded."* Refuted for the reporting bar: CI runs both Pi checks on pull_request and push with `.pi/**` in the path filters; the local roster check covers presence; live `--check` passes.

### agent_cross_runtime: .hermes mirror verified by sync-skills-hermes.cjs --check (exit 0, 70 copies). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: agent_cross_runtime: .hermes mirror verified by sync-skills-hermes.cjs --check (exit 0, 70 copies).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: .hermes mirror verified by sync-skills-hermes.cjs --check (exit 0, 70 copies).

### checklist_evidence: not exercised this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: not exercised this iteration.

### checklist_evidence: partial - deadline suites' assertions encode the checklist (settle at deadline, exit 0, fail-open output, short-host bound); suites not re-executed (build required). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: partial - deadline suites' assertions encode the checklist (settle at deadline, exit 0, fail-open output, short-host bound); suites not re-executed (build required).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial - deadline suites' assertions encode the checklist (settle at deadline, exit 0, fail-open output, short-host bound); suites not re-executed (build required).

### checklist_evidence: the admission suite's pinned count is the checklist artifact for corpus edits; it fails at HEAD and the phase's own before/after scratch shows the failure was observed and not repaired (R3-COR-001). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: the admission suite's pinned count is the checklist artifact for corpus edits; it fails at HEAD and the phase's own before/after scratch shows the failure was observed and not repaired (R3-COR-001).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: the admission suite's pinned count is the checklist artifact for corpus edits; it fails at HEAD and the phase's own before/after scratch shows the failure was observed and not repaired (R3-COR-001).

### Core (spec_code, checklist_evidence): not exercised this iteration; correctness focus only, core protocol rows remain on the strategy rotation for later iterations. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core (spec_code, checklist_evidence): not exercised this iteration; correctness focus only, core protocol rows remain on the strategy rotation for later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core (spec_code, checklist_evidence): not exercised this iteration; correctness focus only, core protocol rows remain on the strategy rotation for later iterations.

### Core (spec_code, checklist_evidence): not exercised this iteration; security focus only, core rows remain on the rotation for later iterations. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core (spec_code, checklist_evidence): not exercised this iteration; security focus only, core rows remain on the rotation for later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core (spec_code, checklist_evidence): not exercised this iteration; security focus only, core rows remain on the rotation for later iterations.

### core `checklist_evidence`: **partial** — T121's orchestrator evidence re-verified live (both sk-doc README suites exit 0); T125's deviation re-confirmed as documented at `010-.../001-shared-and-hub-docs/spec.md:141` and `tasks.md:194`. Per-task re-runs across all 15 children were not repeated at this budget. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: core `checklist_evidence`: **partial** — T121's orchestrator evidence re-verified live (both sk-doc README suites exit 0); T125's deviation re-confirmed as documented at `010-.../001-shared-and-hub-docs/spec.md:141` and `tasks.md:194`. Per-task re-runs across all 15 children were not repeated at this budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `checklist_evidence`: **partial** — T121's orchestrator evidence re-verified live (both sk-doc README suites exit 0); T125's deviation re-confirmed as documented at `010-.../001-shared-and-hub-docs/spec.md:141` and `tasks.md:194`. Per-task re-runs across all 15 children were not repeated at this budget.

### core `checklist_evidence`: not exercised this iteration; maintainability focus only. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: core `checklist_evidence`: not exercised this iteration; maintainability focus only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `checklist_evidence`: not exercised this iteration; maintainability focus only.

### core `spec_code`: **partial** — all 15 phase-010/011 child summaries walked against code on main; two mismatches registered (R8-TRA-001 for the parent goal; R8-TRA-002 for the suite count). Every other spot check held (versions, deletions, hook constants, parser, routes). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: core `spec_code`: **partial** — all 15 phase-010/011 child summaries walked against code on main; two mismatches registered (R8-TRA-001 for the parent goal; R8-TRA-002 for the suite count). Every other spot check held (versions, deletions, hook constants, parser, routes).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `spec_code`: **partial** — all 15 phase-010/011 child summaries walked against code on main; two mismatches registered (R8-TRA-001 for the parent goal; R8-TRA-002 for the suite count). Every other spot check held (versions, deletions, hook constants, parser, routes).

### core `spec_code`: partial — both dispatched claims walked against their phase records (010-001 baseline table, 011-003/008 REQ-005 rows, 002-surface-contract-alignment summary) and re-run live. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: core `spec_code`: partial — both dispatched claims walked against their phase records (010-001 baseline table, 011-003/008 REQ-005 rows, 002-surface-contract-alignment summary) and re-run live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `spec_code`: partial — both dispatched claims walked against their phase records (010-001 baseline table, 011-003/008 REQ-005 rows, 002-surface-contract-alignment summary) and re-run live.

### Core checklist_evidence: not exercised this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Core checklist_evidence: not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: not exercised this iteration.

### Core spec_code: partial — the phase 003 record for this slice confirms the jev Known Limitation against the live runner; the phase 010/011 spec-vs-code walk remains iteration 8's scope. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Core spec_code: partial — the phase 003 record for this slice confirms the jev Known Limitation against the live runner; the phase 010/011 spec-vs-code walk remains iteration 8's scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial — the phase 003 record for this slice confirms the jev Known Limitation against the live runner; the phase 010/011 spec-vs-code walk remains iteration 8's scope.

### core: spec_code pending; checklist_evidence pending (traceability dimension is assigned to the next iteration). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: core: spec_code pending; checklist_evidence pending (traceability dimension is assigned to the next iteration).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core: spec_code pending; checklist_evidence pending (traceability dimension is assigned to the next iteration).

### Dead file links — the 10 raw hits all resolve to existing directories or are non-link code examples. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Dead file links — the 10 raw hits all resolve to existing directories or are non-link code examples.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead file links — the 10 raw hits all resolve to existing directories or are non-link code examples.

### Dead markdown anchors in sk-code docs — 0 across 360 files (heading-slug comparison). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Dead markdown anchors in sk-code docs — 0 across 360 files (heading-slug comparison).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead markdown anchors in sk-code docs — 0 across 360 files (heading-slug comparison).

### Deadline-truncated stdin reaching a security gate as a valid payload: ruled out (again) — the reader resolves partial bytes and consumers fail open via parseJsonFailOpen returning null; probe1 reconfirmed bytes=6 json=null. This direction was already ruled out in iteration 2 and is not re-reported [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:54]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Deadline-truncated stdin reaching a security gate as a valid payload: ruled out (again) — the reader resolves partial bytes and consumers fail open via parseJsonFailOpen returning null; probe1 reconfirmed bytes=6 json=null. This direction was already ruled out in iteration 2 and is not re-reported [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:54].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deadline-truncated stdin reaching a security gate as a valid payload: ruled out (again) — the reader resolves partial bytes and consumers fail open via parseJsonFailOpen returning null; probe1 reconfirmed bytes=6 json=null. This direction was already ruled out in iteration 2 and is not re-reported [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:54].

### git-ignore mapping drift: check-ignore output is matched back by index against the exact repo-relative paths sent on stdin, and any other git failure falls back to name rules [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: git-ignore mapping drift: check-ignore output is matched back by index against the exact repo-relative paths sent on stdin, and any other git failure falls back to name rules [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: git-ignore mapping drift: check-ignore output is matched back by index against the exact repo-relative paths sent on stdin, and any other git failure falls back to name rules [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129].

### HVR count regression — 36 equals the recorded baseline and sibling counts held or fell. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: HVR count regression — 36 equals the recorded baseline and sibling counts held or fell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: HVR count regression — 36 equals the recorded baseline and sibling counts held or fell.

### Manifest write-through-symlink: refused before writing [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:518]; the write is an O_EXCL temp file plus rename over the destination [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478]; walk symlinks are resolved and refused when they escape the skill root or target a non-file [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Manifest write-through-symlink: refused before writing [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:518]; the write is an O_EXCL temp file plus rename over the destination [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478]; walk symlinks are resolved and refused when they escape the skill root or target a non-file [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest write-through-symlink: refused before writing [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:518]; the write is an O_EXCL temp file plus rename over the destination [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478]; walk symlinks are resolved and refused when they escape the skill root or target a non-file [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188].

### Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration. -- BLOCKED (iteration 6, 3 attempts)
- What was tried: Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration.

### overlay `agent_cross_runtime`, `feature_catalog_code`: pending (iteration 10 row). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: overlay `agent_cross_runtime`, `feature_catalog_code`: pending (iteration 10 row).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `agent_cross_runtime`, `feature_catalog_code`: pending (iteration 10 row).

### overlay `agent_cross_runtime`: **covered** — `check-agent-mirror-sync.cjs --all` exit 0 (12 agents in sync); `sync-runtime-mirrors.cjs --check` exit 0 (187 mirrors, 8 trees). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: overlay `agent_cross_runtime`: **covered** — `check-agent-mirror-sync.cjs --all` exit 0 (12 agents in sync); `sync-runtime-mirrors.cjs --check` exit 0 (187 mirrors, 8 trees).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `agent_cross_runtime`: **covered** — `check-agent-mirror-sync.cjs --all` exit 0 (12 agents in sync); `sync-runtime-mirrors.cjs --check` exit 0 (187 mirrors, 8 trees).

### overlay `feature_catalog_code`: **not covered** — planned for iterations 9/10. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: overlay `feature_catalog_code`: **not covered** — planned for iterations 9/10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `feature_catalog_code`: **not covered** — planned for iterations 9/10.

### overlay `playbook_capability`: **partial** — the two playbook-root overview additions and the surviving `document_type_fallback` warnings confirmed from summaries and validators; capability walk stays for the follow-up. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: overlay `playbook_capability`: **partial** — the two playbook-root overview additions and the surviving `document_type_fallback` warnings confirmed from summaries and validators; capability walk stays for the follow-up.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `playbook_capability`: **partial** — the two playbook-root overview additions and the surviving `document_type_fallback` warnings confirmed from summaries and validators; capability walk stays for the follow-up.

### overlay `playbook_capability`: covered — SA-001 replayed live from 008-session-aware-tie-break/scratch/advisor-battery.cjs (exit 0). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: overlay `playbook_capability`: covered — SA-001 replayed live from 008-session-aware-tie-break/scratch/advisor-battery.cjs (exit 0).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `playbook_capability`: covered — SA-001 replayed live from 008-session-aware-tie-break/scratch/advisor-battery.cjs (exit 0).

### overlay `skill_agent`: **partial** — the five sk-code-family SKILL.md versions and the hub release chain (2.2.5.0 → 2.2.6.0 → 2.2.7.0) confirmed; canary pin set read but not re-run. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: overlay `skill_agent`: **partial** — the five sk-code-family SKILL.md versions and the hub release chain (2.2.5.0 → 2.2.6.0 → 2.2.7.0) confirmed; canary pin set read but not re-run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `skill_agent`: **partial** — the five sk-code-family SKILL.md versions and the hub release chain (2.2.5.0 → 2.2.6.0 → 2.2.7.0) confirmed; canary pin set read but not re-run.

### overlay `skill_agent`: partial — HVR scan across the five sk-code SKILL.md/README files and the hub. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: overlay `skill_agent`: partial — HVR scan across the five sk-code SKILL.md/README files and the hub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `skill_agent`: partial — HVR scan across the five sk-code SKILL.md/README files and the hub.

### overlay: not exercised this iteration; skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability remain for later iterations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: overlay: not exercised this iteration; skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability remain for later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay: not exercised this iteration; skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability remain for later iterations.

### overlay: skill_agent partial — the sk-code-skilled scripts README claims were cross-checked against the live guard behavior in this iteration; agent_cross_runtime pending; feature_catalog_code pending; playbook_capability partial — router-sync check 4 (playbook expected_resource emitted by the router) ran live and passed. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: overlay: skill_agent partial — the sk-code-skilled scripts README claims were cross-checked against the live guard behavior in this iteration; agent_cross_runtime pending; feature_catalog_code pending; playbook_capability partial — router-sync check 4 (playbook expected_resource emitted by the router) ran live and passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay: skill_agent partial — the sk-code-skilled scripts README claims were cross-checked against the live guard behavior in this iteration; agent_cross_runtime pending; feature_catalog_code pending; playbook_capability partial — router-sync check 4 (playbook expected_resource emitted by the router) ran live and passed.

### Review-output checker contract holes (final-line, findings, rule-copies): no hole found inside the documented contract; the suites pass 19/19 and the source read matched the README contract. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Review-output checker contract holes (final-line, findings, rule-copies): no hole found inside the documented contract; the suites pass 19/19 and the source read matched the README contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Review-output checker contract holes (final-line, findings, rule-copies): no hole found inside the documented contract; the suites pass 19/19 and the source read matched the README contract.

### Route-gold literal duplication: only one candidate file lists route-gold.typed.json outside the harness tooling, so no duplicated-constant finding is raised. The single literal's coupling to the nested specs/sk-doc packet path is a watch item only. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Route-gold literal duplication: only one candidate file lists route-gold.typed.json outside the harness tooling, so no duplicated-constant finding is raised. The single literal's coupling to the nested specs/sk-doc packet path is a watch item only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Route-gold literal duplication: only one candidate file lists route-gold.typed.json outside the harness tooling, so no duplicated-constant finding is raised. The single literal's coupling to the nested specs/sk-doc packet path is a watch item only.

### Shell injection via interpolated paths in checker or drift-guard scripts: all child_process call sites use argv arrays with no shell — generate-leaf-manifest.cjs:105 and :123, regenerate-skill-derived.cjs:73, minify-webflow.mjs:105, task-dispatch-guard.mjs:84 — and run-all-drift-guards.sh runs under set -euo pipefail with every expansion quoted [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:20] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:49]. verify_stack_folders.py resolves its tree from its own file location, not from cwd or argv [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_stack_folders.py:13]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shell injection via interpolated paths in checker or drift-guard scripts: all child_process call sites use argv arrays with no shell — generate-leaf-manifest.cjs:105 and :123, regenerate-skill-derived.cjs:73, minify-webflow.mjs:105, task-dispatch-guard.mjs:84 — and run-all-drift-guards.sh runs under set -euo pipefail with every expansion quoted [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:20] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:49]. verify_stack_folders.py resolves its tree from its own file location, not from cwd or argv [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_stack_folders.py:13].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection via interpolated paths in checker or drift-guard scripts: all child_process call sites use argv arrays with no shell — generate-leaf-manifest.cjs:105 and :123, regenerate-skill-derived.cjs:73, minify-webflow.mjs:105, task-dispatch-guard.mjs:84 — and run-all-drift-guards.sh runs under set -euo pipefail with every expansion quoted [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:20] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:49]. verify_stack_folders.py resolves its tree from its own file location, not from cwd or argv [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_stack_folders.py:13].

### skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: not exercised this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: not exercised this iteration.

### skill_agent, feature_catalog_code, playbook_capability: not exercised this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: skill_agent, feature_catalog_code, playbook_capability: not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent, feature_catalog_code, playbook_capability: not exercised this iteration.

### spec_code: partial - the four commits' reader, deadline, cap and margin claims were checked against code and tests at HEAD for this slice; the fleet-wide coverage claim is refuted at registered entrypoints (R2-COR-001). The phase 010/011 spec-versus-code walk remains iteration 8's scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: partial - the four commits' reader, deadline, cap and margin claims were checked against code and tests at HEAD for this slice; the fleet-wide coverage claim is refuted at registered entrypoints (R2-COR-001). The phase 010/011 spec-versus-code walk remains iteration 8's scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial - the four commits' reader, deadline, cap and margin claims were checked against code and tests at HEAD for this slice; the fleet-wide coverage claim is refuted at registered entrypoints (R2-COR-001). The phase 010/011 spec-versus-code walk remains iteration 8's scope.

### spec_code: partial for this slice - merge output traced against both parents; SKILL.md version against changelog v2.7.2.0; regenerated artifacts against their sources via the owning check modes. Phase 010/011 spec-vs-code remains for iteration 8. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: partial for this slice - merge output traced against both parents; SKILL.md version against changelog v2.7.2.0; regenerated artifacts against their sources via the owning check modes. Phase 010/011 spec-vs-code remains for iteration 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial for this slice - merge output traced against both parents; SKILL.md version against changelog v2.7.2.0; regenerated artifacts against their sources via the owning check modes. Phase 010/011 spec-vs-code remains for iteration 8.

### spec_code: REQ-005 (hub caller step present in SKILL.md:63 and ROUTER.md:37) and REQ-009 (hint suite 6/6 pass; guard exit 0, all hubs fresh) verified. The front door -> resolve -> engine chain is closed and test-covered. The 008 spec does not cover the advisor's compiled-route probe (R3-COR-002). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: REQ-005 (hub caller step present in SKILL.md:63 and ROUTER.md:37) and REQ-009 (hint suite 6/6 pass; guard exit 0, all hubs fresh) verified. The front door -> resolve -> engine chain is closed and test-covered. The 008 spec does not cover the advisor's compiled-route probe (R3-COR-002).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: REQ-005 (hub caller step present in SKILL.md:63 and ROUTER.md:37) and REQ-009 (hint suite 6/6 pass; guard exit 0, all hubs fresh) verified. The front door -> resolve -> engine chain is closed and test-covered. The 008 spec does not cover the advisor's compiled-route probe (R3-COR-002).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- AGENTS.md SYSTEM_SPEC_GATE_ENFORCE=0 removal: upstream 939a037bb5 deliberately made AI_SESSION_CHILD=1 the only child-dispatch marker; the merge kept it and kept the epic's separate close-out-status line 8fdb66cc1b (iteration 1, evidence: git show of both sides + git log -S).
- "merge dropped one side of generate-leaf-manifest.cjs": both feature sets present at HEAD, node --check OK, five suites exit 0 (iteration 1, evidence: diffs vs both parents + test runs).
- 500 ms short-host deadline margin: 500 ms read plus test-asserted exit < 2500 ms against the 3 s host kill leaves >= 500 ms headroom; no margin defect (iteration 2, evidence: shared-stdin.ts:15-23, lib/hook-stdin-deadline.test.mjs:35-41,142-143).
- stdin timer leak: release() clears the timer and listeners on end, error and overflow paths in all three readers (iteration 2, evidence: hook-adapter-shared.cjs:39-45, shared-stdin.ts:53-59, user-prompt-submit.ts:93-99).
- partial-input handling: readers resolve with bytes read so far and callers fail open via parseJsonFailOpen -> null (iteration 2, evidence: hook-adapter-shared.cjs:27-52, shared-stdin.ts:61-66).
- post-deadline write crash: probes A/B show late writes are discarded after settle with no crash; the coverage gap is recorded as R2-COR-002 (iteration 2, evidence: inline node probes).
- Review-output checker drift (final-line and findings contracts): both checkers pass every fixture case and a direct read found no hole inside the documented contract (iteration 6, evidence: 19/19 test cases, exit 0; source read).
- "This epic introduced the 004 jev-transport-single canary red": the fixture case predates the reviewed range; git log -S points to 01829ed9e4, which is not in ba56b03412..5d9c970447, and phase 003 documents it as a baseline failure (iteration 6, evidence: git log + implementation-summary.md:123).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: traceability (core spec_code and checklist_evidence; overlay skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability). - Focus area: agents, repo rules and runtime mirrors: commits 3617968e35, 8fdb66cc1b, 864a3bccd8, 40fc64d9cd, b5927055b0 (iteration plan row 10). - Required evidence: named agent, repo-rule and mirror files with file:line refs and live sync-check commands; overlay rows resolved against the reviewed commit range.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
### Iteration focus plan (orchestrator-owned)

| Iter | Dimension | Focus |
|------|-----------|-------|
| 1 | correctness | Merge 144b1d339e resolution: generate-leaf-manifest.cjs (git-ignore filter plus symlink containment, dot-dir skip, atomic write), system-spec-kit SKILL.md 2.7.2.0, changelog v2.7.1.0 and v2.7.2.0, trigger index, 3 retrieval fixtures, .hermes copy. Compare with `git show 144b1d339e^1:<path>` and `^2:<path>` |
| 2 | correctness | Hook stdin deadline: c33f9d1984, 60d7e5d15b, 6842756e2d, 3163ee231e. Known item: 500 ms deadline on 3 s hosts, no late-write test |
| 3 | correctness | Compiled routing and session-aware tie-break: 5cf062b021, 83ff844329, ee78fc56b9. Known items: advisor_recommend never passes --surface-hint to compiled-route.cjs; compiled-route-admission test pins LIVE_CORPUS_SIZE 80 against 86 scenarios |
| 4 | correctness | Deep-loop reducer and findings parser: 0221336dd4, 900d0bcf85, 77df558665. Known item: reducer change lowered open findings in 146 review folders 1906 to 1207 |
| 5 | security | Path containment and untrusted input: leaf manifest symlink handling, hook stdin readers, Webflow runtime check 82d297a374, drift-guard scripts that shell out |
| 6 | correctness | sk-code-review checkers and canary: 637eeaeb2e, da9ded3b36, 26df6c4a8a, 4dab32444c, 3cf65c519e, eda0cb91e4. Known item: canary jev-transport-single defers |
| 7 | maintainability | sk-code-skilled drift guards and doc-claim checks: 817ff5b2a7, d2701afc3b, e9ecf8bb5f, 07189a66f8, 0da902346a. Known item: manifest tests 26 pass 16 fail (cli-classifier closure, fixed-routing count 7 vs 6) |
| 8 | traceability | Spec versus code for phases 010 and 011 and every 011 child's Known Limitations; parent goal criteria after the merge |
| 9 | maintainability | sk-code docs: ceb8ff216c, 52c31dcc12, f3377faef9, bcf0dfa653, 16641fcf05, 644cabc980. Known items: 36 HVR hard blockers in sk-code SKILL.md; advisor battery 13/17 with 2/5 false positives |
| 10 | traceability | Agents, repo rules and runtime mirrors: 3617968e35, 8fdb66cc1b, 864a3bccd8, 40fc64d9cd, b5927055b0 |

Every finding needs a reproducing command or a file:line read. Known items are to be confirmed or refuted, not repeated without evidence.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-012-post-merge-20261010T184241Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-10T18:42:41Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```


### Iteration 10 refuted directions (do not retry)
- "b592 diverged the two pre-commit hook copies" — the untouched `.skilled/hooks/git/pre-commit` is a documented legacy helper, not the installed hook.
- "Pi agent mirrors are unguarded or drifted" — CI runs both Pi checks on pull request and push with `.pi/**` paths; roster presence is local; live `--check` passes.
- "Mirror bodies of the changed agents diverge from `.skilled/agents`" — refuted by live gate runs and the `Case:`-rule grep across all five dialects.
