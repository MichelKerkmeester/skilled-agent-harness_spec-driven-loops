---
title: "Decision Record: cli-devin extraction rerun"
description: "ADR-001: Sidecar augmentation of 113/002 score-variant; env-gated extraction call."
trigger_phrases:
  - "113/005 decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/005-extraction-rerun"
    last_updated_at: "2026-05-17T05:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded decision-record"
    next_safe_action: "Add ADRs as design surfaces them"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000116004"
      session_id: "113-005-decisions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-devin extraction rerun

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Sidecar extraction (env-gated modification of 113/002 score-variant)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-17 |
| **Deciders** | Main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The extraction layer must run BEFORE deterministic checks because checks like `bash -n wrapper.sh` and `npx vitest run` need the files on disk. Two architectural options exist: (a) modify 113/002 score-variant.cjs to add an env-gated extraction call, or (b) build a separate 113/005 wrapper that reimplements scoring with extraction included.

### Constraints

- 113/002 ships with verified dry-run gate (do not break)
- 113/003 mock mode must continue working unchanged
- 113/005 should reuse 113/002 + 113/003 infrastructure (not duplicate)
- Future packets may also want to opt into extraction
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add an env-gated extraction call to 113/002 score-variant.cjs. `EVAL_LOOP_EXTRACT=true` triggers extraction; unset/false preserves the 003 mock-mode behavior.

**How it works**: score-variant.cjs imports `113/005/scripts/extract-files-from-markdown.cjs` via relative path; calls it inside `scoreVariantFixture` before running deterministic checks when the env flag is set; takes a seed snapshot beforehand for restore between variants.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Env-gated 113/002 modification (chosen)** | Single source of truth; reusable; minimal change | 113/002 surface area widens slightly | 9/10 |
| Wrapper in 113/005 that reimplements scoring | 113/002 stays untouched | Duplication; risk of drift | 5/10 |
| Fork 002 into 002-v2 | Clean separation | Heavy; not justified for one-script addition | 3/10 |

**Why this one**: The change is minimal (one if-block) and the env flag preserves backward compatibility. Other packets opting into extraction get the same behavior without further work.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- 113/005 + future packets can opt into extraction with one env var
- Single scoring code path (no drift risk)

**What it costs**:
- 113/002 score-variant.cjs surface widens slightly. Mitigation: env-off path tested to confirm 003 behavior unchanged.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 003 re-runs accidentally trigger extraction | L | Default env unset; explicit opt-in only |
| Extraction breaks fixture seeds across variants | M | Pre-extraction snapshot + restore cycle in score-variant.cjs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 003's file-extraction gap is the dominant limitation; closing it is real value |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives considered |
| 3 | **Sufficient?** | PASS | Env flag is the minimum coupling needed |
| 4 | **Fits Goal?** | PASS | Directly enables D1 unlock for re-ranking |
| 5 | **Open Horizons?** | PASS | Extraction layer reusable for future eval packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- 113/002 score-variant.cjs: add `if (process.env.EVAL_LOOP_EXTRACT === 'true') { require('113/005/scripts/extract-files-from-markdown.cjs').extract(...) }` before det checks
- 113/005/scripts/extract-files-from-markdown.cjs: new file, exported `extract(swe16OutputText, fixtureCwdAbs)` function
- 113/005/scripts/loop-v2.cjs: thin wrapper setting env vars before invoking 113/003 loop

**How to roll back**: `git checkout HEAD -- 113/002/scripts/score-variant.cjs` reverts the env-gated call; 113/005 contents can be discarded.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
