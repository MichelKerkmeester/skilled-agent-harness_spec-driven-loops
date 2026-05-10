---
title: "Decision Record: Phase 071 Stack-Agnostic Cleanup"
description: "ADR-001 documents the rule that only sk-code may carry stack, library, CMS, or repo-specific guidance."
trigger_phrases:
  - "agnostic skill layer rule"
  - "stack agnostic cleanup adr"
  - "sk-code boundary"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/071-stack-agnostic-cleanup"
    last_updated_at: "2026-05-05T19:14:28Z"
    last_updated_by: "cli-codex"
    recent_action: "Accepted ADR-001 agnostic skill layer rule"
    next_safe_action: "Apply ADR rule to non-sk-code skill cleanup"
    blockers: []
    key_files:
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      session_id: "phase-071-stack-agnostic-cleanup"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 071 Stack-Agnostic Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Agnostic Skill Layer Rule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | User, cli-codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

This repository is published as a public template. Users should customize their stack-specific code standards in one place, not chase frontend stack names, library examples, CMS examples, or repo-specific paths across CLI, MCP, documentation, git, review, and spec workflow skills.

### Constraints

- `.opencode/` directory paths remain valid framework conventions.
- Runtime CLI skill names such as `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-copilot` remain valid runtime-layer names.
- `sk-code` remains the user-facing customization layer for stack and code-surface specifics.
- Historical changelogs, specs, and test fixtures preserve their original evidence unless explicitly in scope.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Only `sk-code` may name specific frontend stacks, animation libraries, CMS systems, or repo-specific paths.

**How it works**: All other skills use generic examples such as external services, frontend components, code surfaces, or `<surface>` placeholders. When a workflow needs stack-specific conventions, it points to `sk-code` as the source of truth.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Agnostic non-`sk-code` layer** | Public template stays portable; customization has one home | Requires cleanup across many docs | 9/10 |
| Allow examples everywhere | Concrete examples can be vivid | Users inherit irrelevant stack bias and maintenance burden | 4/10 |
| Remove all examples | Avoids specific stacks entirely | Makes workflow docs too abstract to use | 5/10 |

**Why this one**: A single customization boundary gives users clarity without making the rest of the skill suite vague.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Non-`sk-code` skills become reusable in any project.
- Stack-specific maintenance stays localized to `sk-code`.
- Skill examples keep their shape while dropping project-specific names.

**What it costs**:
- Some examples become less concrete. Mitigation: use neutral service names and `<surface>` placeholders.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Generic wording loses operational clarity | Medium | Keep concrete neutral API shapes such as `myservice.myservice_get_items({})` |
| Hidden metadata keeps stack terms | Medium | Include JSON/TOML in grep and recompile skill graph |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User requested public-template portability |
| 2 | **Beyond Local Maxima?** | PASS | Compared single-boundary, everywhere-examples, and no-examples options |
| 3 | **Sufficient?** | PASS | Content cleanup plus grep/compiler validation covers the failure mode |
| 4 | **Fits Goal?** | PASS | Directly supports stack-agnostic template reuse |
| 5 | **Open Horizons?** | PASS | Keeps `sk-code` customizable for future stacks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Non-`sk-code` skill docs and metadata stop naming specific frontend stacks, libraries, CMS products, or repo paths.
- Cross-skill references use `sk-code` as the source of truth for available surfaces.

**How to roll back**: Revert Phase 071 content edits in non-`sk-code` skill files and rerun the scoped grep plus skill graph validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
