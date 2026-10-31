---
title: "Implementation Summary: The Empty Frontmatter Mode Packet"
description: "Four files created a conforming sk-doc mode packet with nothing in it, so the strict packaging gate could pass on the file shape alone. The packet's own first gate failure was a description one character class too long, a violation of the very contract this mode is being built to own, and the hub gate disproved the phase's premise that an unregistered packet is inert."
trigger_phrases:
  - "empty mode packet summary"
  - "packaging gate first failure"
  - "unregistered packet not inert"
  - "sk-create-repo-rule shape parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/002-mode-scaffold"
    last_updated_at: "2026-09-01T08:42:57Z"
    last_updated_by: "implementation"
    recent_action: "Built the empty sk-create-frontmatter packet; packaging gate reports PASS"
    next_safe_action: "Proceed to phase 003 (content migration)"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-mode-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-mode-scaffold |
| **Completed** | 2026-09-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.opencode/skills/sk-doc/sk-create-frontmatter/` now exists as a conforming sk-doc mode packet with no
content in it. That emptiness is the point: the strict packaging gate's verdict is a statement about the
file shape and nothing else, so when content arrives in the next phase, a gate failure cannot be
ambiguous between the two. The phase also disproved one of its own spec's premises, which is the finding
worth carrying forward.

### The Packet

Four files were authored from the `sk-create-skill` templates and shaped on `sk-create-repo-rule`, the
most recently built sibling mode: `SKILL.md` carries the packet identity, description, allowed tools,
version and routing keywords; `README.md` is the human entry point; `references/README.md` indexes a
reference tree that holds nothing yet; and `changelog/v1.0.0.0.md` opens the packet changelog at its
first version so later phases append rather than create.

`python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py
.opencode/skills/sk-doc/sk-create-frontmatter --check --strict` reports `Result: PASS` with exactly two
warnings, `Missing recommended section: INTEGRATION POINTS` and `Missing recommended section: RELATED
RESOURCES`. Those are the same two warnings `sk-create-repo-rule` reports under the same command, which
is what makes the shape claim checkable rather than asserted. Link integrity on the packet reports
`SUMMARY files_examined=4 entries_examined=2 failures=0 excluded_anchor=0 excluded_external=0`.

### The First Gate Failure Was the Contract Itself

The first packaging run did not pass. It reported `Strict mode: 1 contract requirement(s) unmet —
Description 132 chars exceeds soft target of 130`, and the fix was to trim the `SKILL.md` description to
127 characters. The description budget is one of the three things this mode is being built to own. The
packet violated it on its first run, before it held a single line of the contract text.

### An Unregistered Packet Is Not Inert

spec.md §3 states that "an unregistered packet is inert, which is what makes this phase safe", and
REQ-002 and SC-002 are both built on that sentence. It is false for this hub. Before the packet existed,
`node .opencode/commands/doctor/scripts/parent-skill-check.cjs` exited 0 with every invariant passing.
After the four files landed it reported:

```
FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]
FAIL: parent-skill-check — 1 invariant failures, 0 warnings
```

The cause was read from the source, not inferred.
`.opencode/commands/doctor/scripts/parent-skill-check.cjs:1003` filters every hub child directory against
`DIRECTORY_ALLOWLIST` and `registeredPackets`, and sends anything in neither set to `softFail`, which is
a hard failure unless `PARENT_HUB_CHECK_STRICT=0`. `DIRECTORY_ALLOWLIST` at lines 76-80 is a fixed set of
support-directory names, `shared`, `changelog`, `benchmark`, `manual-testing-playbook`,
`feature-catalog`, `references`, `assets`, `node_modules`, `scripts`, `templates`, `dist`, `runtime` and
`styles`. It is not an allowlist for mode packets, so there is no honest way to use it here.

Registration is what makes a hub child directory legal, not merely what makes it reachable. So the phase
could not both build the packet and leave the hub gate untouched. Partial registration is worse than
none: invariant 6b requires every registered mode to appear in the hub `SKILL.md` mode table, and 10d
requires the leaf manifest and the registry to reach each other in both directions, so a registry-only
entry produces two failures where there was one. The decision was to follow the spec, build empty,
register nothing, and record the deviation. It is transient by construction, it reverses with one
`rm -rf`, and phase 004 closed it: after registration the same command reports `OK: parent-skill-check —
all hard invariants passed, 0 warnings` at exit 0. The other four parent hubs stayed at exit 0 throughout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | Created | Packet identity, routing keywords and workflow prose; its description was trimmed to 127 characters to pass strict packaging |
| `.opencode/skills/sk-doc/sk-create-frontmatter/README.md` | Created | The packet's human entry point |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/README.md` | Created | The reference-tree index, deliberately indexing nothing yet |
| `.opencode/skills/sk-doc/sk-create-frontmatter/changelog/v1.0.0.0.md` | Created | The packet changelog opened at its first version |

No file outside that directory was created or edited. The registration surfaces named in phase 004's
scope were deliberately left untouched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The hub-gate baseline was captured before anything was written, which is the only reason the later
failure could be attributed to the new directory rather than argued about. The four files were then
authored against the create-skill templates with `sk-create-repo-rule` open beside them, so shape parity
was a comparison rather than a claim. Four gate runs closed the phase: strict packaging on the new
packet, the same command on the sibling for the warning-list comparison, link integrity scoped to the
packet, and the hub check. Three of the four were used as evidence of success. The fourth was recorded
as a deviation, with its cause traced into the source and its closing phase named, rather than
suppressed with `PARENT_HUB_CHECK_STRICT=0`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the packet empty, with a reference index and no reference documents | A packet that gains shape and content at once cannot tell you which of the two broke a gate; an empty pass is a statement about shape alone |
| Model the shape on `sk-create-repo-rule` rather than on the templates alone | It is the most recently built sibling, so its warning list gives the shape claim a comparison instead of an assertion |
| Register nothing, and carry the hub-gate failure between phases | Registration is phase 004's scope, the failure is bounded to one invariant on one hub, and it reverses with a single `rm -rf`. Recorded as ADR-001 |
| Leave `PARENT_HUB_CHECK_STRICT` at its default | Setting it to 0 demotes a true finding to a warning without changing anything about the tree, and leaves the next operator a gate that no longer means what it says |
| Do not add the directory to `DIRECTORY_ALLOWLIST` | That set names support directories such as `shared` and `references`; adding a mode to it would assert something untrue and permanently exempt it from the registration invariant |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` | PASS — `Result: PASS`, exactly 2 warnings: missing INTEGRATION POINTS and RELATED RESOURCES sections (REQ-001, SC-001) |
| Same command against `sk-create-repo-rule` | PASS — identical 2-warning list, so the new packet carries the sibling's file shape (REQ-003) |
| Link integrity on the new packet | PASS — `SUMMARY files_examined=4 entries_examined=2 failures=0 excluded_anchor=0 excluded_external=0` |
| First strict packaging run | FAIL, then fixed — `Description 132 chars exceeds soft target of 130`; description trimmed to 127 characters |
| `parent-skill-check.cjs` on the sk-doc hub | FAIL — `6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]`, 1 invariant failure. Recorded as ADR-001, closed in phase 004 (REQ-002, SC-002) |
| `parent-skill-check.cjs` on the other four hubs | PASS — each stayed at exit 0 throughout the phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hub gate is red for the duration of this phase.** `parent-skill-check.cjs` reports one
   invariant failure on the sk-doc hub from the moment the directory exists until phase 004 registers
   the mode. It is not a defect in the packet and it is not suppressible without lying about the tree;
   ADR-001 records the reasoning, and the rollback is `rm -rf
   .opencode/skills/sk-doc/sk-create-frontmatter/`.
2. **REQ-002 and SC-002 cannot be met as written, by anyone.** They are not merely unfinished. Any
   phase that creates a hub child directory without registering it trips invariant 6a, so the two
   criteria are recorded as `Superseded` rather than `Unmet`, and the requirement text itself is what
   should change if this packet is ever used as a model.
3. **The packet is unreachable.** Nothing routes to it: no registry entry, no router intent, no leaf
   manifest entry, no command. Reaching it is phase 004's work, and until then the packet exists only
   on disk.
4. **The two packaging warnings remain open by design.** `INTEGRATION POINTS` and `RELATED RESOURCES`
   are recommended sections that an empty packet has nothing true to say in. They are matched by the
   sibling and were left rather than filled with placeholder prose.
<!-- /ANCHOR:limitations -->

---
