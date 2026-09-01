---
title: "Decision Record: Build the frontmatter mode empty and unregistered"
description: "Records why this phase built a conforming but unregistered mode packet and carried a known hub-gate failure between phases instead of suppressing it, and why that makes REQ-002 and SC-002 superseded rather than unmet."
trigger_phrases:
  - "unregistered mode packet decision"
  - "parent hub check deviation"
  - "hub gate transient failure"
  - "directory allowlist not for modes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/002-mode-scaffold"
    last_updated_at: "2026-09-01T08:42:57Z"
    last_updated_by: "implementation"
    recent_action: "Recorded ADR-001: build empty and unregistered, carry the hub-gate failure"
    next_safe_action: "Proceed to phase 003 (content migration)"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-mode-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Build the frontmatter mode empty and unregistered

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build empty and unregistered, and record the hub-gate failure rather than suppress it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-01 |
| **Deciders** | Packet implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

spec.md §3 lists, as an in-scope statement, "Nothing in the routing surfaces yet: an unregistered packet
is inert, which is what makes this phase safe." REQ-002 ("The hub check still reports OK, because an
unregistered packet must not disturb it") and SC-002 ("The hub gate is unchanged from before the packet
existed") are both built on that sentence.

The sentence is false for this hub. Before the packet existed, `parent-skill-check.cjs` exited 0 with
every invariant passing. After the four files landed, the same command reported:

```
FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]
FAIL: parent-skill-check — 1 invariant failures, 0 warnings
```

The cause is in the source, not in the packet. `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
line 1003 filters every hub child directory against `DIRECTORY_ALLOWLIST` and `registeredPackets`, and
sends anything in neither set to `softFail`, which is a hard failure unless `PARENT_HUB_CHECK_STRICT=0`.
`DIRECTORY_ALLOWLIST` at lines 76-80 is a fixed set of support-directory names: `shared`, `changelog`,
`benchmark`, `manual-testing-playbook`, `feature-catalog`, `references`, `assets`, `node_modules`,
`scripts`, `templates`, `dist`, `runtime`, `styles`. It is not an allowlist for mode packets.

Registration is what makes a hub child directory legal, not merely what makes it reachable. So the phase
cannot both build the packet and leave the hub gate untouched. One of the two has to give.

### Constraints

- Partial registration does not rescue the premise. Invariant 6b requires every registered mode to appear in the hub `SKILL.md` mode table, and 10d requires the leaf manifest and the registry to reach each other in both directions. A registry-only entry produces two failures where there was one.
- Registration is phase 004's declared scope. Pulling it forward would merge two phases and destroy the property this phase exists to establish: a packaging verdict about file shape alone.
- The other four parent hubs must stay green throughout, because they share the same gate.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Follow the spec's scope, build the four files without registering them, and record the
resulting hub-gate failure as a known transient deviation rather than working around it.

**How it works**: The packet ships as `SKILL.md`, `README.md`, `references/README.md` and
`changelog/v1.0.0.0.md` with no registry entry, no router entry and no manifest entry. The hub gate
reports one invariant failure for the duration, and phase 004's registration returns it to
`OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0. REQ-002 and SC-002 are marked
`Superseded` in `acceptance-criteria.md` rather than `Met`, because their premise, not their outcome, is
what failed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Build unregistered, record the deviation** | Keeps the packaging verdict meaningful; single-command rollback; the failure names a real, true fact about the tree | Carries one red invariant between two phases | 9/10 |
| Register the mode in this phase | Hub gate stays green | Destroys the phase's purpose, merges phase 004 into phase 002, and needs the router, manifest and mode table too, so it is not a small addition | 3/10 |
| Set `PARENT_HUB_CHECK_STRICT=0` | Hub gate reports green immediately | Demotes a true finding to a warning without changing anything about the tree; the next operator inherits a gate that no longer means what it says | 1/10 |
| Add `sk-create-frontmatter` to `DIRECTORY_ALLOWLIST` | One-line change, gate green | The allowlist holds support-directory names, not modes; the entry would assert the directory is something it is not, and would permanently exempt a real mode from the registration invariant | 1/10 |

**Why this one**: it is the only option that leaves every gate saying something true. The failure is real,
it is bounded to one invariant on one hub, it reverses with `rm -rf` on a single directory, and the phase
that closes it was already planned.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `package_skill.py --check --strict` reports `Result: PASS` on a packet with no content in it, so the verdict is unambiguously about the file shape. Adding content later cannot be confused with fixing the shape.
- The packet's warning list matches `sk-create-repo-rule`'s exactly, giving REQ-003 a real comparison rather than a claim.
- A false premise in the spec is now recorded with the source lines that disprove it, instead of being carried forward into later packets.

**What it costs**:
- One hub invariant is red between phase 002 and phase 004. Mitigation: the failure is named here and in the acceptance criteria, it is reversible with one command, and phase 004 closed it with the same command reporting exit 0.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader treats the red hub gate as a defect in the packet rather than a recorded deviation | M | The failure text, its cause and its closing phase are stated in acceptance-criteria.md, implementation-summary.md and here |
| The deviation is forgotten and never closed | H | Closure is a P0 requirement of phase 004 (REQ-001), and its verification cites the same command returning exit 0 |
| A future contributor closes the gate by widening `DIRECTORY_ALLOWLIST` | M | This record states plainly what that set is for, so the shortcut has a documented answer |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet has to exist before content can move into it, and the hub gate has to be answered one way or the other |
| 2 | **Beyond Local Maxima?** | PASS | Four options were weighed, including the two that would have turned the gate green immediately |
| 3 | **Sufficient?** | PASS | Four files and no registration is the smallest thing that makes the packaging gate speak about shape |
| 4 | **Fits Goal?** | PASS | Every later phase in the packet depends on this directory existing and conforming |
| 5 | **Open Horizons?** | PASS | Nothing is exempted, suppressed or grandfathered, so the registration invariant keeps its full force for every future mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-doc/sk-create-frontmatter/`: created with `SKILL.md`, `README.md`, `references/README.md` and `changelog/v1.0.0.0.md`.
- Nothing else. No registry, router, manifest, mode table or allowlist is edited by this phase.

**How to roll back**: `rm -rf .opencode/skills/sk-doc/sk-create-frontmatter/`, then rerun
`node .opencode/commands/doctor/scripts/parent-skill-check.cjs` and confirm it reports all hard
invariants passing at exit 0.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
