---
title: "Goal: chart versions below 1.0, and no surface naming a deleted file"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/039-prerelease-versioning-and-residue"
    last_updated_at: "2026-09-10T19:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Every completion criterion met and evidenced"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-chart-prerelease-versioning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: chart versions below 1.0, and no surface naming a deleted file

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The chart packet's releases carry pre-release numbers, and every live surface names a file that exists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The twenty-two releases renumber sequentially from `v0.1.0.0` in shipping order, so order and count survive and no second breaking boundary is encoded in the minor segment |
| D2 | Only a `v`-prefixed four-part number is this packet's own version. A bare one may belong to another tool and must survive untouched |
| D3 | Historical spec packets are records and keep naming the changelog files they named when they shipped |
| D4 | The version engine's own scope decides which child documents follow the anchor, and the apply is bounded to this packet rather than to the hub |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] The chart changelog directory holds twenty-two files named `v0.1.0.0` through `v0.22.0.0` with no gap
- [x] `SKILL.md` reads `version: 0.22.0.0` and the version engine's verify reports zero mismatches on the packet
- [x] `parent-skill-check.cjs` on the sk-design hub reports zero invariant failures
- [x] `check-corpus.cjs` reports `RESULT: PASSED` and `node --test scripts/tests/` reports zero failures
- [x] `check-frontmatter-versions.sh` exits zero repository-wide
- [x] No live surface names `assets/examples`, `assets/gallery.html`, `style-reference/cursor` or a count of twenty-six forms
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Leaf manifest re-minted | Done | `10b-byte-drift` and `10c-target-collision` PASS, both having failed before |
| Three scenarios repointed | Done | No `assets/examples` hit under `manual-testing-playbook/` |
| Counts corrected on hub and release draft | Done | No `26 forms` hit on a live surface |
| Twenty-two files renumbered | Done | Directory reads `v0.1.0.0` to `v0.22.0.0` |
| Anchor and child versions reset | Done | Engine verify `ok=20 skip-no-frontmatter=3` |
| Retrieval index regenerated | Done | Old paths 0, new paths 22, lookup resolves a chart document |
| Full gate rerun from final state | Done | Corpus PASSED, 84/84 tests, repository gate exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The first citation rewrite was wrong twice | Its pattern used a word boundary before the digits, which never matches after a `v`, so it moved no citation while moving every frontmatter field. The same pattern rewrote another tool's version in a provenance example. Reading the diff before the renames caught both, and the pass was reverted whole and redone against D2. |
| The version engine refused one explicit path | `manual-testing-playbook.md` is rejected because the guard tests every path segment, so the index file matches its own directory's prefix. That file was set by hand to the value the engine computed, and the defect is reported rather than patched inside a documentation packet. |
| One sk-doc test fixture is stale | `durable-directory-manifest.json` names a directory phase 36 removed. Confirmed stale at the commit before this work, so it belongs to that phase. Recorded, not fixed. |
| Eight historical spec packets name old changelog paths | Left intact under D3. Whether they should carry a pointer to the new names is an open operator question. |
<!-- /ANCHOR:log -->
