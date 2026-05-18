---
title: "Plan: Phase D 3-pass root README realignment"
description: "3-pass pipeline: cli-devin context, cli-opencode cross-check, sonnet @markdown writer."
trigger_phrases:
  - "055 plan"
  - "phase D plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/055-root-readme-realignment"
    last_updated_at: "2026-05-15T12:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote 3-pass plan"
    next_safe_action: "Dispatch Pass 1"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:93542e449671a623a4567fbd5130bdbae15f6b7a08b3cf6b3a29b02124ecbc96"
      session_id: "055-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase D 3-pass root README realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown only; root-level README |
| **Framework** | Task-tool @markdown for writes; cli-devin + cli-opencode for context |
| **Storage** | n/a |
| **Testing** | Strict-validate on packet; manual review of root README |

### Overview

3-pass pipeline (different from A/B/C because the writer is sonnet @markdown, not deepseek):

1. **Pass 1 (cli-devin SWE 1.6)**: read current root README + 3 SKILL.md + architecture docs + recent 30d commits. Emit drift inventory: every factual claim in the README mapped to a status (CURRENT / DRIFTED / UNVERIFIED).
2. **Pass 2 (cli-opencode deepseek-v4-pro)**: independent second read of the same inputs. Verify the drift inventory (catch what Pass 1 missed; reject what Pass 1 over-flagged). Produce `root-readme-delta-verified.md`.
3. **Pass 3 (Task tool @markdown sonnet)**: surgical edits per verified delta. Preserve voice/structure; rewrite only drifted sections. Capture before/after evidence.

Convergence: strict-validate, optional README check, commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases A/B/C shipped and validated
- [x] cli-devin authenticated; cli-opencode + DeepSeek API ready
- [x] Sonnet @markdown via Task tool proven (used in Phase A double-check)
- [x] Recent 30-day commit history accessible via `git log --since`

### Definition of Done
- [ ] Pass 1 drift inventory persisted
- [ ] Pass 2 verified delta persisted
- [ ] Pass 3 edit evidence persisted
- [ ] `./README.md` updated with surgical edits to drifted sections
- [ ] Non-drifted sections byte-identical to baseline
- [ ] Strict-validate on packet exits 0
- [ ] Single commit on `main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

3-pass externalized pipeline. Pass 1 + 2 are READ-ONLY (research). Pass 3 is the only write phase, scoped to drifted sections only.

### Key Components

- **Pass 1 dispatcher**: `devin -p --prompt-file /tmp/devin-055-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null`
- **Pass 2 dispatcher**: `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions </dev/null`
- **Pass 3 dispatcher**: `Agent({ subagent_type: 'markdown', prompt: '...' })` via Task tool
- **Drift inventory schema**: JSON list of `{ claim, location, status, evidence, suggested_rewrite }` per line
- **Cross-check schema**: same as Pass 1 schema with added `confirm_status` field per item
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet scaffold
- [x] All 7 packet files created

### Phase 2: Pass 1 — cli-devin drift audit
- [ ] Compose prompt at `/tmp/devin-055-pass1.md`
- [ ] Dispatch cli-devin
- [ ] Verify `research/root-readme-context-bundle.json` exists

### Phase 3: Pass 2 — cli-opencode cross-check
- [ ] Compose prompt at `/tmp/opencode-055-pass2.md` (input: Pass 1 bundle + same source files)
- [ ] Dispatch cli-opencode + deepseek-v4-pro
- [ ] Verify `research/root-readme-delta-verified.md` exists

### Phase 4: Pass 3 — sonnet @markdown surgical writer
- [ ] Dispatch Task tool with subagent_type=markdown
- [ ] Input: verified delta + current README + voice-preservation directive
- [ ] Sonnet writes scoped Edits to `./README.md`
- [ ] Capture before/after in `research/root-readme-edit-evidence.md`

### Phase 5: Validation
- [ ] Strict-validate on packet (exit 0)
- [ ] Manual review of `./README.md` for voice preservation
- [ ] git diff shows surgical edits only

### Phase 6: Commit
- [ ] Stage `./README.md` + packet files
- [ ] Commit on main: `docs(014/055): realign root README with post-extraction reality`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift inventory completeness | All factual claims captured | Pass 1 + Pass 2 |
| Cross-check soundness | Pass 1's findings verified | Pass 2 |
| Voice preservation | Sonnet's edits don't homogenize | Manual review |
| Surgical-edit discipline | git diff scoped to drifted sections | git diff inspection |
| Strict-validate | Packet level | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phases A/B/C closure | Internal | Met |
| cli-devin SWE 1.6 | External | Met |
| DeepSeek API via cli-opencode | External | Met |
| Sonnet @markdown via Task tool | Internal | Met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any pass dispatch hangs > 15 min, OR sonnet @markdown rewrites a non-drifted section, OR Pass 1/2 disagree on majority of items.
- **Procedure**:
  - Pass 1 fails: retry with cli-codex
  - Pass 2 fails: retry; if still fails, accept Pass 1 with `(unverified)` markers
  - Sonnet over-edits: reject, re-dispatch with tighter scope
- **Recovery baseline**: HEAD before this packet commits. `git restore README.md` if catastrophic.
<!-- /ANCHOR:rollback -->
