---
title: "Decision Record: Phase 3: v1-docs-and-playbooks-sweep"
description: "Decision records for phase 003: zero-match checks that deliberate dated survivors cannot meet, and ordering checks whose before-edit condition was missed."
trigger_phrases:
  - "v1 docs and playbooks sweep decision record"
  - "dated opencode 1 survivors"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep"
    last_updated_at: "2026-11-19T18:00:00Z"
    last_updated_by: "review-fix-run"
    recent_action: "Recorded ADR-001 (dated survivors) and ADR-002 (ordering checks) after the deep review"
    next_safe_action: "None for this phase; the decisions close with phase 003"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "scratch/justified.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-fix-003-v1-docs-and-playbooks-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Phase 3: v1-docs-and-playbooks-sweep

<!-- ANCHOR:adr-001 -->
## ADR-001: Dated OpenCode 1 survivors supersede the zero-match checks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-19 |
| **Deciders** | Operator, approving the deep-review fix plan |

### Context

AC-002, AC-006 and AC-008 each expect a v1-term search to list no file. Some files keep an OpenCode 1 term on purpose. `variant-levels-comparison.md` records ranges that were observed on OpenCode 1. The version-dispatch catalog entry describes the OpenCode 1 refusal, and its trigger phrase carries the term into the trigger index. The review rule that such observations keep their version tag makes these survivors required. The deep review (DR3-P2-001) found the three rows marked `Met` with no waiver while their printed commands did not print 0.

### Decision

AC-002, AC-006 and AC-008 are superseded by this decision. Every survivor is listed with its reason in `scratch/justified.txt`, and a full-repository sweep must equal that list. These are the replacement checks, and each prints `0`:

- AC-002: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook --glob '!**/changelog/**' | grep -v -x -F -f <(cut -f1 scratch/justified.txt) | wc -l`
- AC-006: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' .skilled/skills/cli-external-orchestration/feature-catalog | grep -v -x -F -f <(cut -f1 scratch/justified.txt) | wc -l`
- AC-008: `python3 scratch/check-index-v1.py`, which counts trigger-index sources that carry a v1 phrase and are neither history nor a listed survivor

### Consequences

- A new v1 mention outside `justified.txt` fails the replacement checks, so the list stays the single place a survivor is allowed.
- Renaming or moving a survivor means updating `justified.txt` in the same change, as the version-dispatch rename showed.

### Alternatives Considered

| Option | Why not chosen |
|--------|----------------|
| Strip the version tag from the dated observations to meet the zero-match checks | Turns an OpenCode 1 observation into an untagged claim that reads as current |
| Keep `Met` with a prose closure note, as before | Leaves a printed command that fails as written, which the review flagged |
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Waive the ordering checks the closure missed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-19 |
| **Deciders** | Operator, approving the deep-review fix plan |

### Context

T001, CHK-001 and CHK-003 require a record to exist before the edits: the v1 baseline count, the locations file and the live version. The docs sweep started before those files were written. Each record was written afterwards and is correct: the baseline came from the unchanged main HEAD with `git grep` (62 files), and the live version is `opencode v2.3.2`. Only the "before" condition is missed, and it cannot be met after the fact.

### Decision

T001, CHK-001 and CHK-003 are waived. Their records stay as written, labelled as taken after the edits, and no file is backdated.

### Consequences

- The before-and-after comparison rests on main HEAD, which these edits did not change, so the count is still a valid baseline.
- A later sweep phase writes its baseline as its first task.

### Alternatives Considered

| Option | Why not chosen |
|--------|----------------|
| Backdate the records | Fabricates when the evidence was taken |
| Revert the sweep and redo it in order | Repeats reviewed and verified work to satisfy a timestamp |
<!-- /ANCHOR:adr-002 -->
