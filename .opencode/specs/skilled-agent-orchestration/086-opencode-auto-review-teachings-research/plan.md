---
title: "Implementation Plan: 106 Upstream auto-review research (20 iter cli-devin SWE-1.6)"
description: "Plans the 20-iteration read-only deep-research investigation of the upstream dzianisv/opencode-plugins auto-review package. Pins an upstream commit SHA, dispatches 6 file-read + 9 mechanism-extraction + 3 gap-analysis + 2 synthesis iters, produces research/review-report.md."
trigger_phrases:
  - "106 upstream auto-review plan"
  - "auto-review research dispatch plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research"
    last_updated_at: "2026-05-16T06:00:00Z"
    last_updated_by: "claude-opus-4-7-106-scaffold"
    recent_action: "authored_level_1_plan_for_upstream_auto_review_research_dispatch"
    next_safe_action: "dispatch_iteration_001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/prompts/iteration-001.md..iteration-020.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-106-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 106 Upstream auto-review research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (research outputs) + Bash (dispatcher) |
| **Framework** | cli-devin SWE-1.6 (executor) + deep-research workflow |
| **Storage** | Per-iter Markdown files + JSONL state |
| **Testing** | This packet IS the test (read-only deep-research) |

### Overview
Run 20 cli-devin SWE-1.6 deep-research iterations against the upstream `auto-review` plugin package. Each iteration is read-only, scoped to one dimension, and writes a structured Markdown finding. After all 20 iterations complete, the main agent synthesizes `research/review-report.md` with executive verdict, per-mechanism extraction tables, gap-analysis vs our local skills, ranked teaching list, and remediation recommendation. Wall-clock estimate ~30-45 minutes (1-2 min per iter).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] 20 iteration prompts authored

### Definition of Done
- [ ] All 20 iter outputs present in `research/iterations/`
- [ ] `research/review-report.md` authored ≥ 200 lines
- [ ] Strict validate exit 0
- [ ] Memory save via generate-context.js
- [ ] Commit + push to main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential deep-research dispatch with main-agent synthesis fallback.

### Key Components

```text
Main agent (Claude Opus 4.7)
  |
  +--> Scaffold packet (spec/plan/tasks/impl-summary + 20 iter prompts + state.jsonl)
  |
  +--> /tmp/106-dispatch-loop.sh (bash)
  |     |
  |     +--> for i in 001..020:
  |     |     timeout 600 devin -p --prompt-file iteration-$i.md \
  |     |                       --model swe-1.6 --permission-mode dangerous </dev/null
  |     |     -> writes research/iterations/iteration-$i.md
  |     |     -> appends to research/deep-research-state.jsonl
  |     +--> sleep 3 between dispatches
  |
  +--> Synthesis: read 20 outputs, author research/review-report.md
  |
  +--> generate-context.js canonical save + strict validate + commit + push
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold (DONE during this planning step)
- Create packet directory + spec/plan/tasks/impl-summary docs
- Author 20 iteration prompts
- Initialize `research/deep-research-state.jsonl` with `campaign_start`
- Strict validate
- Generate `description.json` + `graph-metadata.json` via `generate-context.js`

### Phase 2: 20 cli-devin SWE-1.6 iterations (sequential)
- File reads (iters 001-006): pin SHA at iter 001, then read each of 6 files in upstream package
- Mechanism extraction (iters 007-015): one dimension per iter, structured-finding output
- Gap analysis (iters 016-018): compare each mechanism against our existing skills + plugins
- Synthesis prep (iter 019): ranked teaching table + reject list
- Final adjudication (iter 020): author `research/review-report.md` directly

### Phase 3: Main-agent synthesis fallback
If iter 020 fails to author `review-report.md` (cli-devin returns abbreviated stdout per the 015 pattern), main agent reads all 20 iter outputs and synthesizes directly.

### Phase 4: Close out
- Strict validate exit 0
- Memory save via generate-context.js
- Commit + push to main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This packet IS the test — there is no separate test suite. Validation surfaces:

| Surface | Validates |
|---------|-----------|
| Strict validate | Spec-doc structure + frontmatter + anchors |
| Per-iter output existence | Loop completion |
| Cross-AI hallucination check (in synthesis) | Findings backed by real upstream content |
| Gap-analysis grep evidence | Claims about our skills are backed by codebase grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Purpose | Failure mode |
|------------|---------|--------------|
| cli-devin SWE-1.6 | Primary executor for 20 iters | Cannot run; halts dispatch loop |
| Network access (GitHub raw + gh API) | Fetch upstream files in iters 001-006 | Iters fail; cached WebFetch may help |
| Local skills under comparison (sk-code-review, deep-*, plugins) | Required for gap analysis iters 016-018 | Iters skip those dimensions if grep returns nothing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Pure read-only research. No rollback needed unless an iteration mutates state outside `research/` (it shouldn't — prompt contracts explicitly forbid it). If a mutation occurs, `git checkout HEAD -- <path>` restores; if mutations span multiple files, `git reset --hard HEAD` on a clean working tree restores everything.
<!-- /ANCHOR:rollback -->
