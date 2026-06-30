---
title: "Plan: 058 — 20-iter cli-devin deep-review + sonnet @markdown batched rewrite"
description: "5 phases: scaffold, 20 iter, synthesis, 3-batch sonnet rewrite (SKILL.md/mcp_server READMEs/new references), verify + commit."
trigger_phrases:
  - "058 plan"
  - "skill md realignment plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/058-skill-md-realignment"
    last_updated_at: "2026-05-15T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote 5-phase plan"
    next_safe_action: "Compose iter template"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:aeeb59598c00ee96588b33fa45385bbdeb8200cd4caa5ee64cac122855153b1a"
      session_id: "058-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 058 SKILL.md realignment + mcp_server READMEs + references audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; cli-devin SWE 1.6 (research); sonnet @markdown via Task tool (writing) |
| **Framework** | Custom orchestration (cli-devin not native deep-review executor); 056/057 pattern |
| **Storage** | n/a (docs only) |
| **Testing** | sk-doc validate per file + audit_readmes.py bulk + strict-validate packet |

### Overview

Five phases:

1. **Scaffold** — 7 packet files + iter template + 8 track seeds; strict-validate.
2. **20 cli-devin iter** — 8 thematic tracks; per-iter immediate commit.
3. **Synthesis** — One cli-devin pass writes research.md + delta-verified.md.
4. **Sonnet @markdown rewrites** — 3 batches (SKILL.md / mcp_server READMEs / new references).
5. **Verify + commit** — Per-file validate, audit sweep, sonnet double-check, final commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 056 + 057 packets shipped on main
- [x] sk-doc skill_md_template located: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
- [x] system-spec-kit/mcp_server/README.md confirmed as 9-anchor model
- [x] User confirmed: anchor tags + sk-doc template authority + all-recommended-docs scope

### Definition of Done
- [ ] 20 iter markdown files
- [ ] research.md + delta-verified.md
- [ ] Phase 4 Batch A: 3 SKILL.md realigned
- [ ] Phase 4 Batch B: 3 mcp_server READMEs aligned
- [ ] Phase 4 Batch C: 7+ new references docs
- [ ] All modified/created files pass sk-doc validate
- [ ] audit_readmes.py bulk sweep: 0 blocking errors
- [ ] Strict-validate packet PASS
- [ ] Sonnet @markdown + @review final: 0 P0
- [ ] Single primary commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Externalized state deep-review loop + batched sonnet rewriter. Same custom orchestration as 056/057.

### Key Components

- **Per-iter dispatcher**: `devin -p --prompt-file /tmp/devin-058-iter-NNN.md --model swe-1.6 --permission-mode auto </dev/null`
- **Iter template**: `assets/iter-template.md` (STAR/RCAF/BUILD per cli-devin SKILL contract)
- **Synthesis**: same cli-devin shape, consumes 20 iter files
- **Phase 4 dispatcher**: `Agent({ subagent_type: 'markdown', prompt: ... })` Task tool, 3 batches
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold
- [x] 7 packet files + assets + research + scratch dirs
- [ ] Compose `assets/iter-template.md`
- [ ] Compose `research/track-seeds.md` (8 tracks)
- [ ] Strict-validate PASS

### Phase 2: 20 cli-devin SWE 1.6 iter
For each iter 1..20:
- Substitute placeholders in template → `/tmp/devin-058-iter-NNN.md`
- Dispatch cli-devin with `--permission-mode auto`
- Capture stdout → `research/iterations/iteration-NNN.md` + append state.jsonl row
- git add + commit (`research(058/NNN): iter NNN on Track T`)

### Phase 3: Synthesis
- [ ] Compose synthesis prompt
- [ ] Dispatch cli-devin → write `research/research.md` + `research/delta-verified.md`
- [ ] Main agent verifies delta shape

### Phase 4 Batch A: 3 SKILL.md realignments
- [ ] Compose Task-tool prompt with sk-doc template + delta + HVR rules + 3 current SKILL.md files
- [ ] Dispatch `Agent({ subagent_type: 'markdown' })`
- [ ] Verify per-file sk-doc validate
- [ ] Commit `docs(058/4a): align 3 SKILL.md to sk-doc skill_md_template`

### Phase 4 Batch B: 3 mcp_server READMEs
- [ ] Compose Task-tool prompt
- [ ] Dispatch sonnet @markdown
- [ ] Verify per-file sk-doc validate
- [ ] Commit `docs(058/4b): align 3 mcp_server READMEs to system-spec-kit model`

### Phase 4 Batch C: 7+ new references docs
- [ ] Compose Task-tool prompt
- [ ] Dispatch sonnet @markdown
- [ ] Verify per-file sk-doc validate
- [ ] Commit `docs(058/4c): author 7 new references docs across system-skill-advisor + system-code-graph`

### Phase 5: Verify + commit
- [ ] `validate_document.py` per modified/created file
- [ ] `audit_readmes.py` over 3 system skills — 0 blocking
- [ ] Strict-validate packet PASS
- [ ] Sonnet @markdown + @review parallel final double-check
- [ ] Patch any P0
- [ ] Backfill implementation-summary.md
- [ ] Final primary commit `docs(014/058): align 3 SKILL.md + 3 mcp_server READMEs + 7+ references from 20-iter deep-review`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Iter markdown frontmatter + state.jsonl rows | jq + grep |
| Citation | Delta EDIT/NEW entries reference at least one iter | grep |
| sk-doc compliance | Per-file modified/created | `validate_document.py` |
| Bulk audit | 3 system skills | `audit_readmes.py` |
| Strict-validate | Packet | `validate.sh --strict` |
| Independent review | Sonnet eyes | Task tool @markdown + @review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 057 packet shipped | Internal | Met |
| cli-devin SWE 1.6 | External | Met |
| sk-doc skill_md_template | Internal | Met |
| sk-doc validator | Internal | Met |
| Sonnet @markdown via Task tool | Internal | Met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any phase produces malformed output, sonnet voice-drifts, or validate regresses.
- **Procedure**:
  - cli-devin iter fails: retry max 2; fall back to direct capture
  - Phase 4 batch over-edits: revert files to baseline, redispatch with tighter scope contract
  - validate regresses: investigate which edit broke; manual fix
- **Recovery baseline**: HEAD = `3a6f7f624` (packet 057 final commit).
<!-- /ANCHOR:rollback -->
