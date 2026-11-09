---
title: "Goal: Phase 5: zero-hit fallback to git-changed spec docs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback"
    last_updated_at: "2026-11-09T18:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: zero-hit fallback to git-changed spec docs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let a zero-hit trigger lookup find packets the committed index has not caught up with by scoring the declared phrases of git-changed spec docs, inside the existing latency budget, shipped with docs, an alignment pass and a measured benchmark.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `lookup()` keeps its behavior; the fallback lives only in the CLI path behind `lookupWithFallback()`. |
| D2 | The 200 ms p95 cold-lookup budget is frozen. The fallback shrinks to fit (file cap, cheaper git call, spec-folder scope) or the phase fails. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `npx vitest run` from `.skilled/skills/system-spec-kit` on `stale-fallback.vitest.ts` and `trigger-index.vitest.ts` exits 0
- [ ] Before any index rebuild, `lookup-trigger-index.mjs --scoring-only -- "retrieval feature design research"` exits 0 and lists `003-retrieval-feature-design-research/spec.md`
- [ ] Cold-lookup p95 over `runtime/cli/retrieval/fixtures/prompt-set.json` is at or under 200 ms
- [ ] `benchmark/results.md` shows 10/10 stale phrases found, 10/10 matching queries unchanged and 5/5 undeclared phrases still exiting 1
- [ ] Both package validators exit 0 with scenario 490 present, and the `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings
- [ ] `validate.sh` on this phase prints `RESULT: PASSED` and every `acceptance-criteria.md` row is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning docs | Done | Level 2 spec, plan, tasks, acceptance criteria |
| Build | Pending |  |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
