---
title: "Plan: 056 — 20-iter cli-devin deep research + sonnet @markdown rewrite"
description: "5-phase plan: scaffold + iter template, 20 cli-devin iterations across 7 tracks, synthesis, sonnet @markdown rewrite, verify + commit."
trigger_phrases:
  - "056 plan"
  - "deep research plan root readme"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research"
    last_updated_at: "2026-05-15T13:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote 5-phase plan"
    next_safe_action: "Compose iter template"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:52e9c3ba237bb2b763c76cc4cc5972688aa7db919d529da93d637a0fa11d3341"
      session_id: "056-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 056 deep-research realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; cli-devin SWE 1.6; sonnet @markdown via Task tool |
| **Framework** | Standard deep-research artifact shape (iterations + state.jsonl + research.md synthesis), but custom orchestration since /spec_kit:deep-research doesn't natively support cli-devin |
| **Storage** | n/a (docs only) |
| **Testing** | sk-doc validate with HVR scoring; strict-validate on packet |

### Overview

Five phases:

1. **Scaffold** — Packet (7 files) + sk-prompt-blessed iter template + 7 track seeds.
2. **20 iterations** — cli-devin SWE 1.6 across 7 thematic tracks. Per-iter commit.
3. **Synthesis** — One cli-devin dispatch reads 20 iter files, writes research.md + delta-verified.md.
4. **Rewrite** — Sonnet @markdown Task dispatch applies verified delta with HVR scoring.
5. **Verify + commit** — HVR validate, strict-validate, sonnet @markdown + @review parallel double-check, single commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase D 055 packet shipped (2d4086743 + 458b0e6b3 on main)
- [x] cli-devin SKILL v1.0.2.0 + sk-prompt skill available
- [x] HVR rules at `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- [x] Sonnet @markdown via Task tool proven (Phase D Pass 3)
- [x] Writer choice confirmed (sonnet @markdown sole writer)
- [x] Iteration scope confirmed (7 thematic tracks x ~3 iter)

### Definition of Done
- [ ] 20 iter markdown files exist
- [ ] state.jsonl covers all 20 iter
- [ ] research.md + delta-verified.md written
- [ ] ./README.md surgically edited per delta
- [ ] HVR score >= 85
- [ ] Strict-validate exit 0
- [ ] Sonnet double-check PASS (0 P0)
- [ ] Single commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Externalized state deep-research loop. Custom orchestration (main agent owns the loop, cli-devin owns per-iter research). Synthesis collapses 20 iter into one delta. Sonnet @markdown applies the delta.

### Key Components

- **Per-iter dispatcher**: `devin -p --prompt-file /tmp/devin-056-iter-NNN.md --model swe-1.6 --permission-mode auto </dev/null`
- **Iter template**: `assets/iter-template.md` (sk-prompt blessed; STAR/RCAF/BUILD + CLEAR 5-check + pre-planning)
- **Per-iter prompt generator**: substitute `{RQ}`, `{TRACK}`, `{ITER_NUM}` placeholders into the template; cap 3 KB
- **State recorder**: main agent appends one row per iter to `research/deep-research-state.jsonl`
- **Synthesis dispatcher**: same cli-devin shape, prompts reads all 20 iter files
- **Rewrite dispatcher**: `Agent({ subagent_type: 'markdown', prompt: ... })` Task tool
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold + iter template
- [x] L1 packet skeleton (7 files + assets/ + research/ + scratch/)
- [ ] Compose `assets/iter-template.md` via sk-prompt (STAR/RCAF/BUILD)
- [ ] Compose `research/track-seeds.md` (7 thematic tracks, initial RQs)
- [ ] Strict-validate packet PASS

### Phase 2: 20 iterations
For each iter 1..20:
- [ ] Substitute placeholders in template → `/tmp/devin-056-iter-NNN.md`
- [ ] Dispatch cli-devin SWE 1.6 with `--permission-mode auto`
- [ ] Parse stdout → write `research/iterations/iteration-NNN.md`
- [ ] Append row to `research/deep-research-state.jsonl`
- [ ] git add + commit (`research(056/NNN): iter NNN on Track <T>`)

### Phase 3: Synthesis
- [ ] Compose synthesis prompt at `/tmp/devin-056-synth.md`
- [ ] Dispatch cli-devin (or main agent) to write `research/research.md` + `research/delta-verified.md`
- [ ] Verify delta shape: each EDIT has FROM/TO/REASON + iter citation

### Phase 4: Rewrite via sonnet @markdown
- [ ] Compose Task-tool prompt with verified delta + voice directive + HVR rules path
- [ ] Dispatch `Agent({ subagent_type: 'markdown', prompt: ... })`
- [ ] Verify `./README.md` edited; `research/edit-evidence.md` written

### Phase 5: Verify + commit
- [ ] `validate_document.py ./README.md --type readme --json` → hvr_score >= 85
- [ ] Strict-validate packet PASS
- [ ] Sonnet @markdown + @review parallel Task dispatches → 0 P0
- [ ] Patch any P0 findings
- [ ] Backfill `implementation-summary.md`
- [ ] Final commit: `docs(014/056): deep-research realignment of root README (20 iter cli-devin + sonnet @markdown)`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Per-iter markdown frontmatter + state.jsonl row | sed + jq |
| Citation | Each delta EDIT references at least one iter | grep |
| HVR scoring | ./README.md post-rewrite | `validate_document.py --json` |
| Strict-validate | Packet level | `validate.sh --strict` |
| Surgical-edit discipline | git diff scope | `git diff README.md` |
| Independent review | Sonnet eyes | Task-tool @markdown + @review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase D 055 shipped | Internal | Met |
| cli-devin SWE 1.6 + sk-prompt | External | Met |
| HVR rules + sk-doc validator | Internal | Met |
| Sonnet @markdown via Task tool | Internal | Met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: cli-devin returns malformed output 3 iter in a row, OR synthesis produces empty delta, OR sonnet @markdown rewrites non-drifted prose.
- **Procedure**:
  - cli-devin failures: retry with tighter prompt; if still fails, fall back to main-agent direct research for that iter
  - Empty delta: accept as "no new drift found", commit a note rather than rewrite
  - Sonnet over-edit: revert README.md to baseline; re-dispatch with tighter scope
- **Recovery baseline**: HEAD = `652f7ef25` (tagline expansion). Any phase rolls back here.
<!-- /ANCHOR:rollback -->
