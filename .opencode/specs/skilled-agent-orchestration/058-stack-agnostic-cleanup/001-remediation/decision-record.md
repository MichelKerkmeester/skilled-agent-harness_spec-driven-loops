---
title: "Decision Record: Phase 071 verifier remediation"
description: "Decisions for scan artifact handling, parent metadata scope, and compiled sk-code-derived advisor graph content."
trigger_phrases:
  - "phase 071 remediation decisions"
  - "parent metadata repair"
  - "compiled skill graph aggregation"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation"
    last_updated_at: "2026-05-05T19:53:46Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded remediation ADRs"
    next_safe_action: "Update implementation summary with verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/.folder-list.txt"
      - ".opencode/skills/system-spec-kit/scripts/.scan-lines.txt"
      - "specs/skilled-agent-orchestration/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-001-remediation"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 071 Verifier Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Neutralize Tracked Scan Artifacts In Place

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | cli-codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

`.opencode/skills/system-spec-kit/scripts/.folder-list.txt` and `.scan-lines.txt` are tracked files introduced by `0d84e56212 chore: add cli-codex v1.4.0.0 changelog + spec-kit scan helper scripts`. They are scan outputs rather than source-of-truth code, but they are versioned and already had unrelated in-flight edits in this worktree.

### Constraints

- Preserve existing in-flight edits in the scan artifacts.
- Do not modify changelog or test fixture files.
- Remove real-client path terms from the tracked artifact content.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the tracked scan artifact files and neutralize the real-client path names in place.

**How it works**: The remediation replaces the client-specific folder slug and related path segments with generic example names. It avoids deleting tracked files or adding ignore rules outside the user-approved write scope.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Neutralize in place** | Preserves history and existing edits, fixes the leak | Leaves generated artifacts tracked | 8/10 |
| Delete artifacts | Removes generated content completely | Wider diff and may conflict with their tracked helper-script intent | 5/10 |
| Add ignore rule and untrack | Best long-term cache policy | `.gitignore` is outside this packet's allowed writes | 4/10 |

**Why this one**: Neutralizing in place is the narrowest fix that satisfies V-003 without crossing the approved file boundary.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The tracked artifacts no longer leak the real-client path names.
- Existing non-remediation artifact edits remain intact.

**What it costs**:
- The repository still tracks scan output. Mitigation: log ignore/untrack cleanup as a separate future maintenance packet if desired.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Generated artifacts become stale again | M | Keep future scans generic or move cache handling to a separate packet |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V-003 is a P0 verifier blocker |
| 2 | **Beyond Local Maxima?** | PASS | Deletion and ignore alternatives were considered |
| 3 | **Sufficient?** | PASS | A text replacement removes the leak |
| 4 | **Fits Goal?** | PASS | Scope stays inside the approved files |
| 5 | **Open Horizons?** | PASS | Future cache policy remains possible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Replace real-client slugs in `.folder-list.txt`.
- Replace real-client slugs in `.scan-lines.txt`.

**How to roll back**: Revert the two artifact text replacements only if a downstream scan tool depends on the exact historical slugs.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Parent Metadata Repair Is Out Of Phase 071 Scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | cli-codex |

---

<!-- ANCHOR:adr-002-context -->
### Context

V-008 reports that parent `specs/skilled-agent-orchestration/graph-metadata.json` fails strict validation. The verification report states this is pre-existing and not introduced by Phase 071.

### Constraints

- The user explicitly scoped this as out of 071.
- Parent metadata repair likely affects the broader track, not the 071 cleanup packet.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Treat V-008 as out of 071 scope and log it for a separate parent-metadata-repair packet.

**How it works**: This child packet documents the failure and reports the parent strict validation exit code, but it does not repair the broader `skilled-agent-orchestration` parent metadata.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer to separate packet** | Honors user scope and avoids broad metadata churn | Parent strict validation may still fail | 9/10 |
| Repair parent metadata now | Could make parent validation pass | Crosses the explicit V-008 scope boundary | 3/10 |

**Why this one**: The user specifically asked to document this as out of scope, not to repair it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The limitation is explicit and recoverable by a future packet.

**What it costs**:
- Parent strict validation may remain non-zero. Mitigation: report the exact exit code.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parent gate blocks a completion claim | M | Report it as an expected out-of-scope failure tied to V-008 |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V-008 requires documentation |
| 2 | **Beyond Local Maxima?** | PASS | Repair-now alternative considered |
| 3 | **Sufficient?** | PASS | Matches the user-requested handling |
| 4 | **Fits Goal?** | PASS | Keeps Phase 071 focused |
| 5 | **Open Horizons?** | PASS | Names the future repair packet |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- This ADR records the parent metadata repair deferral.
- The final summary reports parent strict validation separately from child validation.

**How to roll back**: Replace this ADR with an implementation note in the future parent-metadata-repair packet after that repair lands.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Compiled Skill Graph Keeps sk-code-Derived Metadata

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | cli-codex |

---

<!-- ANCHOR:adr-003-context -->
### Context

V-009 reports that compiled `skill-graph.json` contains a hyphenated stack-specific topic derived from sk-code metadata. The compiled graph aggregates skill metadata, so sk-code-owned terms can legitimately appear inside the sk-code node even though the compiled file lives under system-spec-kit.

### Constraints

- sk-code is the source of truth for stack-specific metadata.
- The user explicitly instructed that this compiled artifact should be documented as expected aggregation rather than edited.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Accept the compiled graph term as expected sk-code-derived aggregation.

**How it works**: The source metadata stays in sk-code. The compiled graph may carry that metadata because it is an aggregate runtime artifact, not authored system-spec-kit guidance.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document expected aggregation** | Preserves source-of-truth ownership | Broad grep may still flag the compiled file | 9/10 |
| Filter stack topics from compiled graph | Could quiet broad grep | Breaks fidelity of sk-code metadata aggregation | 4/10 |
| Edit sk-code metadata | Would remove the compiled term | Violates explicit no-sk-code-change rule | 0/10 |

**Why this one**: It matches the user rule: sk-code is allowed to contain the stack-specific source metadata.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The verifier decision is explicit and auditable.
- sk-code metadata fidelity is preserved.

**What it costs**:
- Broad grep gates need to classify compiled sk-code-derived graph hits correctly. Mitigation: report V-009 as documented, expected aggregation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future audit treats compiled graph content as authored leakage | M | Link this ADR from the implementation summary |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V-009 requires documentation |
| 2 | **Beyond Local Maxima?** | PASS | Filtering and source edits considered |
| 3 | **Sufficient?** | PASS | Matches user-requested handling |
| 4 | **Fits Goal?** | PASS | Keeps sk-code as the owner |
| 5 | **Open Horizons?** | PASS | Future auditors can classify compiled artifacts correctly |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- This ADR records V-009 as acceptable aggregation.
- No sk-code source metadata is changed.
- No compiled graph filtering is introduced.

**How to roll back**: Remove this ADR only if a later policy decides compiled aggregate files must filter sk-code-owned key topics.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
