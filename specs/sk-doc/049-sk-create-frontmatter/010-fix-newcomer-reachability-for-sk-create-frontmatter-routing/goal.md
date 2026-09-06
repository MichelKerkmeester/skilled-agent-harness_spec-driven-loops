---
title: "Goal: Fix newcomer reachability for sk-create-frontmatter routing"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "phase 010 goal"
  - "newcomer reachability directive"
  - "reachability criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed every criterion"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-049-010-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Fix newcomer reachability for sk-create-frontmatter routing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A person describing a frontmatter problem in their own words reaches the mode, measured on a fixed prompt set, without any added phrase pulling in prompts that belong elsewhere.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every phrase lands on all five routing surfaces at once. A phrase on one stage only produces a hub-only hit, which is the failure being fixed |
| D2 | Every phrase is replayed against an out-of-domain prompt before it stays. A capture drops the phrase |
| D3 | No default mode in the hub router. The hub doctrine forbids a silent default |
| D4 | Digest drift is re-pinned only where the pinned file is at HEAD |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

This is a leaf phase and binds no child goal. The parent directive in `../goal.md`
outranks it.

**Precedence.** Decisions above outrank the detail in `spec.md`, and that detail
outranks any summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] At least five of the ten newcomer prompts resolve to `sk-create-frontmatter` with a compiled target, measured before and after with the advisor generation recorded
- [x] Every one of the eighteen declared triggers still resolves to the mode
- [x] No out-of-domain replay prompt resolves to the mode
- [x] The mode keyword line and the registry aliases are identical
- [x] `compiled-route-guard.cjs` reports every hub fresh and the authored sk-doc canary reports `REAL-GREEN`
- [x] `validate.sh --strict` prints `RESULT: PASSED` for the parent and this phase
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
| Baseline | Done | Generation 605, zero of ten newcomer prompts resolved to the mode, eighteen of eighteen triggers did |
| Ten phrases on five surfaces | Done | Parity check empty at 28 entries |
| Over-capture dropped | Done | `missing a field` replaced, the form prompt returns nothing |
| Compile refresh | Done | Manifest `9b9fc1f0...`, three authored digests re-pinned, guard fresh, sync verify OK |
| Tool digests | Done | Two scripts moved at HEAD in `2f21545e3e`, re-pinned in six files, sk-doc canary `REAL-GREEN` 23 of 23 |
| After replay | Done | Six of ten resolve to the mode at 0.85 to 0.94 |

### Deviations and findings

| Item | Note |
|------|------|
| A replacement pass touched historical evidence | The first search for the stale scorer hash rewrote nine evidence files in another packet's closeout. Restored from HEAD before anything else ran. Evidence records what was true when written |
| The version phrases were refused | Probed first. Both already reach the hub on a Node version question and a changelog prompt, so they stay out. Two newcomer prompts remain hub-only for that reason |
| Two prompts still return nothing | A 500-character description warning and an edit-count question. The vocabulary is present. This is the scorer dilution every earlier phase recorded |
<!-- /ANCHOR:log -->
