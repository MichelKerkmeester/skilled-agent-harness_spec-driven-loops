---
title: "Implementation Plan: Devin agents/skills/rules parity"
description: "Document Devin's already-working skills/rules discovery and build the first real .devin/agents/*/AGENT.md profile, gated on a live-docs format verification."
trigger_phrases:
  - "devin agents skills rules parity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Fetch live AGENT.md format before writing any file."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (AGENT.md profile), documentation |
| **Framework** | Devin CLI `run_subagent`/`skills`/`rules` subcommands |
| **Testing** | Live CLI probe |

### Overview
Fetch the live-confirmed `.devin/agents/[name]/AGENT.md` format, build one real profile, verify it resolves via a live `run_subagent` probe, and document the two already-working discovery mechanisms (`devin skills list`, `devin rules list`) plus the commands non-applicability decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` distinguishes the two working mechanisms from the one genuine gap.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines five command/probe-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: phase 008 established the live-probe-before-build discipline.]

### Definition of Done
- [ ] All acceptance criteria met. [EVIDENCE: pending implementation.]
- [ ] Live-docs format citation present before any file write. [EVIDENCE: pending implementation.]
- [ ] Live probe confirms the new profile resolves. [EVIDENCE: pending implementation.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Live-docs-first build discipline, mirroring the phase 008 precedent that corrected the original "Devin hooks are dormant" false finding.

### Key Components
- **Live-docs fetch**: confirm the actual `AGENT.md` format before writing anything — never assume the Claude/Codex agent-profile shape transfers.
- **One real profile**: `.devin/agents/<name>/AGENT.md`, format matching the confirmed live spec.
- **Documentation update**: `cli-devin/SKILL.md` gains a section citing live `devin skills list`/`devin rules list` output and the commands non-applicability decision.

### Data Flow
`devin -p` dispatches `run_subagent` with a target name; Devin resolves it against `.devin/agents/<name>/AGENT.md` if the mechanism works as documented. A live probe is the only way to confirm resolution — this mirrors exactly how the original hooks-dormancy bug was caught and fixed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.devin/agents/<name>/AGENT.md` | Does not exist | Create (format live-verified first) | Live `run_subagent` probe |
| `cli-external-orchestration/cli-devin/SKILL.md` | Documents the mechanism, no live evidence cited | Add cited evidence + commands-decision note | Manual review |

Matrix axes: mechanism (skills/rules/agents/commands), status (working/gap/non-concept).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Live-docs verification
- [ ] Fetch the current Devin CLI docs for `.devin/agents/[name]/AGENT.md` format.
- [ ] Cite the confirmed format (URL or `--help` output) in `implementation-summary.md` before writing any file.
- [ ] If the fetch contradicts the mechanism's existence, halt and escalate per the Logic-Sync Protocol instead of building.

### Phase 2: Build and document
- [ ] Build one real `.devin/agents/<name>/AGENT.md` profile matching the confirmed format.
- [ ] Document `devin skills list`/`devin rules list` working behavior in `cli-devin/SKILL.md`, citing live command output.
- [ ] Record the commands non-applicability decision explicitly.

### Phase 3: Verification and closeout
- [ ] Live-probe `devin -p` dispatching `run_subagent` targeting the new profile; confirm resolution.
- [ ] Run phase 015 strict and recursive parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live | `run_subagent` resolution against the new profile | Manual `devin -p` probe |
| Live | `devin skills list`/`devin rules list` output citation | Manual CLI invocation |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 (devin-hook-parity) | Internal | Complete | Established the live-probe-before-build discipline this phase follows. |
| Live Devin CLI docs access | External | Available | Needed to confirm the `AGENT.md` format before writing. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The live probe shows the new profile does not resolve, or the live-docs fetch contradicts the mechanism's documented existence.
- **Procedure**: Delete the unverified `.devin/agents/<name>/AGENT.md` file; document the contradiction in `cli-devin/SKILL.md` instead of leaving a non-functional file in place.
<!-- /ANCHOR:rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`
