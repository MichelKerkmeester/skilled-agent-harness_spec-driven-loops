---
title: "Decision Record: Parent-skill native invocability mechanism"
description: "Records the accepted parent-skill native invocability mechanism. ADR-001 chooses Option E, invokable-hub routing, after comparing options A through E. This packet has no source build; NFR-S01 is resolved in phase 002 as union-grant accepted."
trigger_phrases:
  - "parent skill mechanism decision"
  - "native invocation tradeoffs"
  - "shim versus single identity"
  - "runtime enhancement option"
  - "command agent shim runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Accepted Option E invokable-hub routing and recorded A/B fallback surfaces"
    next_safe_action: "Use 002's accepted hub union-grant decision for NFR-S01"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Option E is the accepted mechanism."
      - "A/B commands and agents are fallback complementary surfaces; C/D are not required."
      - "NFR-S01 is resolved in 002: union-grant accepted."
---
# Decision Record: Parent-skill native invocability mechanism

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Mechanism for native parent-skill mode invocation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-26 |
| **Deciders** | User + Claude (this session) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need a way to invoke a parent skill's nested mode without breaking the one-`graph-metadata.json` single-identity invariant. The runtime `Skill` tool resolves top-level `.opencode/skills/*/` directories by their `SKILL.md` name; nested mode packets are invisible to it. A `Skill(ai-council)` call returns `Error: Unknown skill: ai-council` for exactly this reason. The Skill Advisor keys identity on the presence of `graph-metadata.json`, and the parent-skill pattern allows exactly one such file per parent skill. The accepted mechanism therefore uses the top-level parent hub as the invocable skill and keeps mode routing inside that hub.

### Constraints

- Exactly one `graph-metadata.json` per parent skill, `skill_id == folder`, and zero `graph-metadata.json` anywhere below it. Adding one to a packet either throws at build (when `skill_id` does not equal the folder) or registers a second skill identity.
- No in-repo runtime extension point is required for the accepted path.
- Legacy public surfaces can differ from packet folder/name identity; phase 002 resolves the deep-loop packet folder while preserving the command and agent surfaces.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option E - invokable-hub routing. Reach a parent skill's modes through the invocable parent hub, not via `Skill(mode)`.

**How it works**: `Skill(<parent>)` is invocable because the hub is a top-level skill carrying the one `graph-metadata.json`. When invoked with a mode hint or a domain request, the hub classifies the request and loads the matching nested mode packet. The advisor routes domain queries to the hub, and the hub selects the mode internally. This needs no runtime change and no advisor merged-identity extension for invocation, because mode selection happens inside the invoked hub rather than as an advisor-level projection. Per-mode commands and agents (options A and B) remain available as fallback complementary surfaces; shim skills (C) and a runtime change (D) are not required.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

The five mechanism options. Option E is accepted; A and B remain fallback complementary surfaces.

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Per-mode commands** (for example `/design:interface`) | Works today; established pattern; keeps one advisor identity | Command surface rather than `Skill()` | Fallback complement |
| **B. Per-mode agents** (agent types, like deep-loop's ai-council and deep-research agents) | Works today; keeps one advisor identity | Agent surface rather than `Skill()` | Fallback complement |
| **C. Thin top-level shim skills per mode** that delegate into the packet | Restores direct `Skill(mode)` spelling | Each shim needs its own `graph-metadata.json`, re-introducing N skill identities and conflicting with the one-hub invariant | Rejected |
| **D. Runtime enhancement** (teach the `Skill` tool to resolve `parent:mode` or recurse into packets, or add a manifest the runtime honors) | True native invocation | Lives in the OpenCode / Claude-Code binary, which is out of repo control | not needed |
| **E. Invokable-hub routing** (`Skill(parent[,args])` -> hub routes to the nested packet) | Achievable in-repo today; single identity preserved; no advisor merged-identity or runtime change needed | Invocation is `Skill(parent)` + request/args, not `Skill(mode)` directly | CHOSEN |

**Why this one**: Option E achieves native reachability with zero runtime dependency and zero identity cost. It leverages the parent hub's existing invocability and keeps mode selection internal to the invoked hub. It reduces A and B to optional complements, avoids C's identity cost, and removes D's out-of-repo dependency.

**Option E fallback**: If hub invocation is insufficient for a specific operator flow, keep using the existing command and agent surfaces (A/B). Do not add shim skills unless a future packet explicitly accepts the identity cost.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The single-identity invariant is treated as a hard constraint, so the chosen mechanism does not create a second skill identity.
- Parent hubs stay invocable through the existing runtime behavior.
- Commands and agents remain available as fallback complementary surfaces.

**What it costs**:
- Invocation is `Skill(parent)` plus a request or mode hint, not direct `Skill(mode)`.
- The hub `allowed-tools` contract is a union of the tools its modes need; per-mode tool narrowing is not proven here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Option E is insufficient for an operator flow | M | Use commands and agents (A/B) as the fallback complementary surfaces |
| The chosen mechanism creates a second skill identity | H | Keep exactly one hub `graph-metadata.json` and zero packet graph files |
| NFR-S01 permission language overclaims per-mode narrowing | M | Resolved in 002: union-grant accepted and documented as the hub permission contract |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nested parents regress `Skill()` invocability; the `sk-design` conversion needs this resolved first |
| 2 | **Beyond Local Maxima?** | PASS | Five mechanisms are framed; the chosen one avoids the identity and runtime costs |
| 3 | **Sufficient?** | PASS | The decision record is sufficient for 001; downstream packets own implementation and validation |
| 4 | **Fits Goal?** | PASS | The goal is native reachability without invariant regression, which this decision serves directly |
| 5 | **Open Horizons?** | PASS | A/B remain fallback surfaces and NFR-S01 is carried forward rather than falsely closed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Nothing in source for this packet. It authors documentation only and records ADR-001 as Accepted.
- Downstream packets may apply Option E to specific parent families and must document their permission-contract semantics.

**How to roll back**: Revert the 001 authored markdown docs. No source, runtime, or configuration changed in 001, so nothing else reverts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
