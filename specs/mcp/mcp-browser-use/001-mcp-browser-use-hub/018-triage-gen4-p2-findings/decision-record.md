---
title: "Decision Record: Phase 18: triage-gen4-p2-findings"
description: "Why the Aside wrapper refuses a changed download source, and why the bdg version pin is kept without a content digest."
trigger_phrases:
  - "triage gen4 p2 findings decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/018-triage-gen4-p2-findings"
    last_updated_at: "2026-11-24T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded ADR-001 and ADR-002"
    next_safe_action: "None; the epic is closed apart from 005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-triage-gen4-p2-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 18: triage-gen4-p2-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The Aside wrapper refuses a changed download source

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q011), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

The wrapper checks the vendor installer script against a pinned sha256. That script then downloads an archive the wrapper cannot check, and it honors `ASIDE_CLI_BASE_URL`, so the environment could point the download anywhere.

### Constraints

- The vendor publishes no checksum for the archive.
- Installs stay operator-invoked.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: exit with an error when `ASIDE_CLI_BASE_URL` is set, before any download.

**How it works**: the check runs after the platform and existing-binary checks and before `curl`. The message says to unset the variable or run the vendor installer by hand after reading it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refuse the override** | The wrapper only installs from the vendor's own source | A mirror user must run the vendor script by hand | 8/10 |
| Unset it silently | Install proceeds | Surprises an operator who set it on purpose | 5/10 |
| Pin the archive digest | Verifies the binary | No published checksum; breaks on every vendor release | 3/10 |

**Why this one**: it keeps the source the pin was taken against, and says so.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The environment cannot redirect the binary download through the wrapper.

**What it costs**:
- A mirror needs a manual install. Mitigation: the error names the way out.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The vendor archive changes | M | Still unverified; recorded as a known limitation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The override was passed straight to the vendor script |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One check before the download |
| 4 | **Fits Goal?** | PASS | The operator asked to fix every open item |
| 5 | **Open Horizons?** | PASS | An archive checksum can be added if the vendor publishes one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/install.sh`, `INSTALL-GUIDE.md` and the install catalog entry.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The bdg install keeps its version pin without a content digest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Claude |

---

<!-- ANCHOR:adr-002-context -->
### Context

P2 #1 says the Chrome DevTools installer pins `browser-debugger-cli@0.6.10` by version only, unlike Bladebro, whose installer checks SHA-256 digests.

### Constraints

- bdg ships as an npm package. Bladebro also fetches a native binary outside npm.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep the version pin and add no digest.

**How it works**: the npm registry refuses to republish a version, and npm checks each tarball against the integrity hash the registry records for it.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the version pin** | npm already ties the version to one tarball | Trusts the registry's record | 7/10 |
| Pack and hash the tarball first | Independent of the registry record | A second install path to maintain | 4/10 |

**Why this one**: the finding's risk, a changed artifact under the same version, is the case npm already blocks.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No new install path.

**What it costs**:
- A compromised registry record is not caught. Mitigation: none beyond npm's own checks; recorded here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Registry compromise | L | Out of this packet's reach |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The finding is held as stated |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared |
| 3 | **Sufficient?** | PASS | No change needed |
| 4 | **Fits Goal?** | PASS | Every finding gets a verdict |
| 5 | **Open Horizons?** | PASS | A digest can be added later without changing the pin |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Nothing in code; this record.

**How to roll back**: N/A.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q011 | Fix and build every open item, with the P2 triage as phase 018 of this epic. | Not stated. | None | spec.md scope, ADR-001 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q011
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:fleet-stdin-017:0 -->

Question (condensed from the text asked):
```text
After that, which open item should come next?
```

Options:
```text
Stop here | Triage the 24 P2s | Build advisor 014 | Fix sk-doc drift
```

Answer:
```text
fix build all
```
<!-- /ANCHOR:operator-answers-verbatim -->
