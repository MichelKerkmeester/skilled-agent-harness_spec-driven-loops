---
title: "Decision Record: Parent-skill native invocability mechanism"
description: "Frames the four candidate mechanisms for making parent-skill nested mode packets natively reachable by the operator, with explicit tradeoffs, and records the choice as pending Phase 1 research. The central tension is invocability versus the one-graph-metadata single-identity invariant."
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
    recent_action: "Framed the A-D mechanism options with tradeoffs; choice deferred"
    next_safe_action: "Await user gate; Phase 1 probe then selects one option"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is option D achievable in-repo, or is the fallback to A/B or C?"
    answered_questions: []
---
# Decision Record: Parent-skill native invocability mechanism

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

We need a way to invoke a parent skill's nested mode without breaking the one-`graph-metadata.json` single-identity invariant, and we do not yet know whether the runtime supports it. The runtime `Skill` tool resolves only top-level `.opencode/skills/*/` directories by their `SKILL.md` name; nested mode packets are invisible to it. A `Skill(ai-council)` call returns `Error: Unknown skill: ai-council` for exactly this reason. The Skill Advisor keys identity on the presence of `graph-metadata.json` and the parent-skill pattern allows exactly one such file per parent skill, so packets are advisor-invisible by construction. This decision frames the candidate mechanisms and records that the choice is deferred to Phase 1 research, so the runtime is probed before any mechanism is committed.

### Constraints

- Exactly one `graph-metadata.json` per parent skill, `skill_id == folder`, and zero `graph-metadata.json` anywhere below it. Adding one to a packet either throws at build (when `skill_id` does not equal the folder) or registers a second skill identity.
- No in-repo runtime extension point is known: `opencode.json` has no skills config, `.opencode/plugin/` is empty, and there is no skill manifest the runtime reads for invocation.
- A grandfathered folder-vs-name mismatch exists (`ai-council` folder, `deep-ai-council` packet name), so a mechanism cannot assume folder equals name.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option E — invokable-hub routing. Reach a parent skill's modes through the invocable parent hub, not via `Skill(mode)`.

**How it works**: `Skill(<parent>)` is invocable because the hub is a top-level skill carrying the one `graph-metadata.json`. When invoked (optionally with args, e.g. `"motion: <request>"`), the hub's smart router classifies the request and loads the matching nested mode packet (Reads `<parent>/<mode>/SKILL.md`). The advisor routes domain queries to the hub (one identity; hub trigger_phrases aggregate every mode's keywords) and the hub selects the mode internally. This needs NO runtime change and NO advisor merged-identity extension (the deep-loop-specific `nl_ID`/`nl` projection and its drift-guard), because mode selection happens inside the invoked hub rather than as an advisor-level projection — which removes the heaviest blocker. Per-mode commands and agents (options A and B) remain available as optional complementary surfaces; shim skills (C) and a runtime change (D) are not required. The Phase 1 runtime-extensibility probe is therefore unnecessary: native reachability is achieved through the already-invocable parent.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

The four mechanism options. Scores are preliminary and research-gated; Phase 1 sets the final scores against the probe evidence.

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Per-mode commands** (for example `/design:interface`) | Works today; the established deep-loop pattern; keeps one advisor identity | It is the command surface, not `Skill()`; not native `Skill()` invocation | pending/10 |
| **B. Per-mode agents** (agent types, like deep-loop's ai-council and deep-research agents) | Works today; keeps one advisor identity | Agents, not `Skill()`; not native `Skill()` invocation | pending/10 |
| **C. Thin top-level shim skills per mode** that delegate into the packet | Restores `Skill()`-invocability | Each shim needs its own `graph-metadata.json`, re-introducing N skill identities and directly conflicting with the one-hub invariant and the advisor's single-identity routing | pending/10 |
| **D. Runtime enhancement** (teach the `Skill` tool to resolve `parent:mode` or recurse into packets, or add a manifest the runtime honors) | True native invocation | Lives in the OpenCode / Claude-Code binary, which is out of repo control | not needed |
| **E. Invokable-hub routing** (`Skill(parent[,args])` -> hub routes to the nested packet) | Achievable in-repo today; single identity preserved; no advisor merged-identity or runtime change needed | Invocation is `Skill(parent)` + request/args, not `Skill(mode)` directly | CHOSEN |

**Why this one**: Option E achieves native reachability with zero runtime dependency and zero identity cost — it leverages the parent hub's existing invocability and keeps mode selection internal to the invoked hub. It reduces A and B to optional complements, avoids C's identity cost, and removes D's out-of-repo dependency.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The mechanism is chosen against evidence from a real runtime probe rather than an assumption.
- The single-identity invariant is treated as a hard constraint, so the chosen mechanism will not silently create a second skill identity.

**What it costs**:
- One research phase precedes any implementation. Mitigation: the research is bounded to a runtime probe, a prototype, and this decision record.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Option D is not achievable in-repo | H | Pre-commit a fallback to options A and B, or option C with the identity cost recorded |
| The chosen mechanism creates a second skill identity | H | Verify the prototype against the one-hub invariant before any Phase 2 work |
| Deep-loop-specific advisor coupling blocks a generic solution | M | Phase 1 confirms generality and scopes any per-parent layer needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nested parents regress `Skill()` invocability; the `sk-design` conversion needs this resolved first |
| 2 | **Beyond Local Maxima?** | PASS | Four distinct mechanisms are framed; the choice is not anchored to the first idea |
| 3 | **Sufficient?** | PASS | A research phase plus a decision record is the minimum needed before committing a mechanism |
| 4 | **Fits Goal?** | PASS | The goal is native reachability without invariant regression, which this decision serves directly |
| 5 | **Open Horizons?** | PASS | Deferring keeps option D open while pre-committing a fallback if it is out of reach |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Nothing in this packet. It authors documentation only and frames the decision as pending research.
- A Phase 2 mechanism, once chosen, would change the surface the selected option names (commands, agents, shim skills, or a runtime path).

**How to roll back**: Delete the `155-parent-skill-native-invocability/` folder. No source, runtime, or configuration changed, so nothing else reverts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
