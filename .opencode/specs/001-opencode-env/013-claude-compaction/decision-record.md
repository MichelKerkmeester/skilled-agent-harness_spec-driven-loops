# Decision Record: Claude Code Compaction Resilience

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: CLAUDE.md as Primary Location (Not MEMORY.md)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | Michel Kerkmeester, Claude Opus 4.6 (research agent) |

---

### Context

Compaction resilience instructions need a persistent location that survives compaction events and is loaded into the system prompt. Two candidate locations exist: CLAUDE.md (project-level, team-shareable, loaded in full) and MEMORY.md (per-user auto-memory, first 200 lines loaded). The instructions must have maximum behavioral weight post-compaction.

### Constraints
- MEMORY.md has a 200-line hard limit for auto-loading into the system prompt
- MEMORY.md is per-user and per-project (not team-shareable via git)
- CLAUDE.md is designed for behavioral rules; MEMORY.md is designed for factual recall
- Both persist architecturally across compaction (part of system prompt)

---

### Decision

**Summary**: Use CLAUDE.md as the primary location for compaction resilience instructions; use MEMORY.md only as a 2-line secondary reinforcement pointer.

**Details**: The ~20-line instruction section goes into CLAUDE.md where it benefits from full loading (no line limit), git-based team sharing, and semantic alignment with CLAUDE.md's purpose (behavioral rules). MEMORY.md gets a 2-line entry that points back to CLAUDE.md, providing a secondary attention anchor in case the model's attention to CLAUDE.md instructions degrades.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CLAUDE.md primary + MEMORY.md pointer** | Full loading, team-shareable, no line limit, dual-layer reinforcement | Adds ~500 tokens to system prompt | 9/10 |
| MEMORY.md primary | Per-user customizable, auto-loaded | 200-line limit, not team-shareable, wrong semantic purpose | 4/10 |
| MEMORY.md only (no CLAUDE.md) | Simplest, minimal token cost | Single point of failure, wrong purpose, per-user only | 3/10 |
| Both locations with full content | Maximum redundancy | Duplication, maintenance burden, wastes tokens | 5/10 |

**Why Chosen**: CLAUDE.md is architecturally designed for behavioral instructions, has no line limit, and is team-shareable. MEMORY.md's 200-line cap and per-user scope make it unsuitable as a primary location for behavioral rules. The dual-layer approach (primary + pointer) maximizes salience without duplication.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Post-compaction instruction loss is documented in 5+ GitHub issues affecting production users |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives evaluated (CLAUDE.md, MEMORY.md, both full, MEMORY.md only) |
| 3 | **Sufficient?** | PASS | Simplest viable approach -- text in existing file, no code, no new systems |
| 4 | **Fits Goal?** | PASS | Directly addresses the compaction resilience requirement (REQ-001 through REQ-005) |
| 5 | **Open Horizons?** | PASS | Self-contained section; easily updated or replaced if Claude Code improves compaction handling |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Instructions persist across compaction by architecture (system prompt is re-sent every API call)
- Team-shareable via git -- all contributors benefit
- No line limit concern; ~20 lines is well within budget

**Negative**:
- Adds ~500 tokens to every system prompt - Mitigation: Monitor total CLAUDE.md size; keep section lean

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| CLAUDE.md grows too large overall | M | Periodic audit; section is self-contained and removable |
| Model ignores CLAUDE.md post-compaction anyway | H | MEMORY.md pointer provides secondary reinforcement; CRITICAL/STOP markers maximize salience |

---

### Implementation

**Affected Systems**:
- CLAUDE.md (project root)
- MEMORY.md (~/.claude/projects/<project>/memory/MEMORY.md)

**Rollback**: Remove the "# Context Compaction Behavior" section from CLAUDE.md and the "## Compaction Recovery" entry from MEMORY.md. Both are self-contained additions.

---

## ADR-002: "Stop and Confirm" Pattern Over Hook-Based Automation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | Michel Kerkmeester, Claude Opus 4.6 (research agent) |

---

### Context

Post-compaction, Claude needs to be prevented from taking autonomous actions before the user can verify its understanding. Two approaches exist: (1) instruction-based "Stop and Confirm" pattern written in CLAUDE.md, or (2) hook-based automation using PreCompact/PostCompact hooks that programmatically save and restore state.

### Constraints
- Hook API is still evolving (PreCompact exists, PostCompact is limited)
- Solution must work today without additional setup
- Solution must be portable across machines and users
- OpenCode Env already has a prevention-first approach (prompt compression, Context Window Budget)

---

### Decision

**Summary**: Use the instruction-based "Stop and Confirm" pattern. Defer hook-based automation as a future enhancement.

**Details**: Write numbered imperative steps in CLAUDE.md that instruct Claude to: (1) STOP, (2) re-read CLAUDE.md, (3) summarize state, (4) wait for user confirmation, (5) not assume the summary's implied next steps. This provides ~80% of the benefit of hook-based automation with ~10% of the complexity.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **"Stop and Confirm" instructions** | Zero code, works today, portable, simple | Relies on model compliance (not deterministic) | 8/10 |
| PreCompact/PostCompact hooks | Deterministic state save/restore, scriptable | Complex setup, hooks API evolving, machine-specific | 6/10 |
| Custom compaction API instructions | Controls the summary content directly | Requires API-level access, replaces default prompt entirely | 5/10 |
| No mitigation (rely on Anthropic fix) | Zero effort | Problem persists indefinitely; no timeline for fix | 2/10 |

**Why Chosen**: The instruction-based approach delivers immediate value with zero implementation risk. It works with existing Claude Code infrastructure, requires no code, and is portable. Hook-based automation can be layered on later as an enhancement if needed.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Users report autonomous post-compaction actions causing lost work |
| 2 | **Beyond Local Maxima?** | PASS | Four approaches evaluated including hooks, API instructions, and no-action |
| 3 | **Sufficient?** | PASS | Zero-code solution; hooks would add complexity without proportional benefit |
| 4 | **Fits Goal?** | PASS | Directly prevents post-compaction autonomous drift |
| 5 | **Open Horizons?** | PASS | Hook-based enhancement remains available; instruction approach is non-blocking |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Works immediately, no setup required
- Portable across all machines and Claude Code versions
- Easy to understand, modify, and remove
- Aligns with OpenCode's prevention-first philosophy

**Negative**:
- Not deterministic -- relies on model compliance - Mitigation: CRITICAL/STOP markers + MEMORY.md reinforcement maximize compliance

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Model ignores Stop instruction | H | Multi-layer reinforcement (CLAUDE.md + MEMORY.md); CRITICAL marker has highest salience |
| Pattern becomes obsolete if Anthropic fixes compaction | L | Self-contained section; easy to remove when no longer needed |

---

### Implementation

**Affected Systems**:
- CLAUDE.md (instruction content)

**Rollback**: Remove the numbered steps from the CLAUDE.md section. No code to revert.

---

## ADR-003: Structured Numbered Format Over Narrative Prose

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | Michel Kerkmeester, Claude Opus 4.6 (research agent) |

---

### Context

The compaction resilience instructions need a text format that maximizes model compliance when the model's attention is degraded post-compaction. Research shows that after compaction, the model's attention to system prompt instructions drops significantly. The format must cut through this degraded attention state.

### Constraints
- Post-compaction attention to system prompt is reduced (rich context replaced with sparse summary)
- Instructions must be unambiguous -- no room for interpretation
- Format must be scannable (model processes tokens sequentially)
- CRITICAL and STOP are known high-salience markers in LLM instruction following

---

### Decision

**Summary**: Use numbered imperative steps with CRITICAL/STOP markers, not narrative prose or bullet lists.

**Details**: The section opens with `CRITICAL: After any context compaction event:` followed by numbered steps (1. STOP, 2. Re-read, 3. Summarize, 4. Present and WAIT, 5. Do NOT assume). Each step is a single imperative sentence. The "When compacting, always preserve:" subsection uses a bullet list for the preservation checklist.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Numbered steps with CRITICAL/STOP** | Highest salience, unambiguous sequence, clear action boundaries | Slightly more rigid | 9/10 |
| Narrative prose paragraph | Natural reading flow | Ambiguous boundaries, lower salience, easy to skim past | 3/10 |
| Bullet list (unnumbered) | Scannable | No sequence implied, lower salience than numbered + CRITICAL | 6/10 |
| ALL CAPS throughout | Maximum visual salience | Reads as shouting, may reduce overall CLAUDE.md credibility | 4/10 |

**Why Chosen**: Numbered steps create unambiguous action boundaries. CRITICAL/STOP markers are known to have high attention weight in LLM instruction following. The combination of sequential numbering + imperative voice + salience markers provides maximum behavioral anchoring in a degraded attention context.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Format directly impacts whether the model follows the instructions post-compaction |
| 2 | **Beyond Local Maxima?** | PASS | Four format alternatives evaluated |
| 3 | **Sufficient?** | PASS | Uses existing markdown; no special tooling needed |
| 4 | **Fits Goal?** | PASS | Maximizes the probability of model compliance when attention is degraded |
| 5 | **Open Horizons?** | PASS | Format is easily modified if research reveals better patterns |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- CRITICAL marker has highest known salience in LLM instruction following
- Numbered sequence eliminates ambiguity about action order
- Imperative voice is direct and unambiguous

**Negative**:
- Rigid format may feel prescriptive - Mitigation: Users can customize while preserving the numbered structure and CRITICAL marker

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Future models respond differently to formatting | L | Monitor and adapt format as model behavior evolves |

---

### Implementation

**Affected Systems**:
- CLAUDE.md section content formatting

**Rollback**: Reformat the section. No functional changes needed.

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
