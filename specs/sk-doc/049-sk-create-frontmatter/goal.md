---
title: "Goal: Sk Create Frontmatter"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "phase-9-contract-drift-remediation"
    recent_action: "Closed the criteria after phase 010"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-049-sk-create-frontmatter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Sk Create Frontmatter

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the frontmatter contract an owning mode, so the spec six modes read is accountable to one of them rather than to nobody.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The contract moves into a mode named for it. Shared reach was right, shared ownership was not |
| D2 | No alias is added to make a moved reference resolve. A reference that breaks gets repointed |
| D3 | Reachability is proved in both routing stages, not asserted from a registry entry |
| D4 | A documented number the repository contradicts is remeasured, not softened |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 008-utilization-review | `008-utilization-review/goal.md` |
| 009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract | `009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract/goal.md` |
| 010-fix-newcomer-reachability-for-sk-create-frontmatter-routing | `010-fix-newcomer-reachability-for-sk-create-frontmatter-routing/goal.md` |

Phases 001 through 007 closed before this addon existed and carry no goal
document. Their scope is the phase map in `spec.md`.

**Precedence.** Decisions above outrank child detail, and child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `validate.sh --strict --recursive` over this packet prints `RESULT: PASSED` for every folder
- [x] The mode owns the frontmatter spec and no consumer still resolves through an alias added to paper over the move
- [x] Every keyword trigger the mode declares resolves through the hub, measured rather than assumed, with the one the advisor cannot score recorded against the scorer
- [x] Every phase reports its acceptance criteria closeable
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
| Phases 001 to 006, mode built and closed out | Done | `7589536feb feat(sk-doc): give the frontmatter contract an owner, and every mode a playbook` |
| Phase 007, voice playbook | Done | Planned in `c8eda6a356`, shipped with the same sweep |
| Phase 008, utilization review | Done | `8ad1f98d09` ran the playbook and fixed four defects. `8a9c5af8a3` closed the five open criteria: eight aliases in the hub, the `--help` fix, the fixtures, the index tables and the canary re-pin |
| Phase 010, newcomer reachability | Done | Ten plain-language phrases on all five routing surfaces, one dropped for over-capture. Newcomer prompts resolving to the mode moved from 0 of 10 to 6 of 10, the sk-doc canary is green at 23 of 23 after the re-pin, and the tool-digest drift the canaries had carried since a benchmark commit was re-pinned |
| Validator repairs the packet exposed | Done | `d229b0a24d fix(sk-doc): make the validators look where they were not looking` |
| Phase 009, contract drift remediation | Done | Working tree at the close of the 2026-09-05 session. The contract's section 1, 4 and 5 enforcement claims corrected to what the validators do, the engine usage text lists `gate`, the spaced alias and `version field` in both routing stages, the hub description trimmed to 130 characters with the compiled-routing refresh carried, and this file, the parent `spec.md` and phase 008's documents reconciled |

### Deviations and findings

| Item | Note |
|------|------|
| Declared reachability outran real reachability | The mode registered cleanly and still answered nothing to eight of its own seventeen triggers. Registration and routing are two measurements, and only the second one counts |
| The phase map disagreed with phase 008 | `spec.md` listed phase 8 as `Pending` while the child reported Complete. Reconciled in phase 008's follow-up commit, and this file was not, until phase 009 |
| One repaired alias regressed | `trigger_phrases` routed at the floor when phase 008 closed and returns nothing at advisor generation 593, while `importance_tier`, `contextType` and `X.Y.Z.W` still route. The advisor scores it at zero in every lane with the vocabulary present in every hub file. Phase 009 added the spaced form `trigger phrases`, which routes, and recorded the underscore form against the scorer |
| The contract overstated its enforcement | A delimiter rule no parser checks, length limits no validator applies, a spec rule contradicted in section 5, and a coverage claim behind a checker that walks top-level skills only in a mode that passes files with no block. Each corrected in phase 009 to what the code does |
| The hub hosting the mode was the largest budget consumer | The project sat 115 characters under the 8,000 cutoff the mode documents as a silent discovery drop, and the hub description alone was 639 of them. Trimmed to 130 in phase 009 |
<!-- /ANCHOR:log -->
