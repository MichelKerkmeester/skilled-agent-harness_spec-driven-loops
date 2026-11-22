---
title: "Decision Record: Phase 7: generated-surfaces"
description: "Seven decisions for regenerating the generated surfaces: the packet level, exact-path allowlist rows for the trigger index outputs, regenerating the scorer baseline, the cite-drift labels question, the regeneration order, the skill-graph export's check set and inline exploration."
trigger_phrases:
  - "generated surfaces decisions"
  - "trigger index allowlist decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Recorded the planning decisions for the generated surfaces"
    next_safe_action: "Get the conductor's answer on ADR-004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 7: generated-surfaces

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Paths use the abbreviations in `tasks.md`: `R` is the advisor runtime, `K` is `system-spec-kit`, `RT` is `$K/runtime/cli/retrieval` and `SD` is `sk-doc`. Every number here quotes `spec.md` Measured Behavior.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Level 2 for a phase the helper scores at Level 1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Plan author, under the conductor's brief |

### Context

The brief says to run `recommend-level.sh` and follow it, and also to give every requirement an Unmet acceptance row. The helper printed Level 0 for the hand-written lines (`--loc 24 --files 6`, score 11) and Level 1 for every changed line (`--loc 110300 --files 6`, score 43); the authoring card maps Level 0 to 1. The scaffold and all seven siblings are Level 3.

### Constraints

- `check-ac-closure.sh` prints "Acceptance closure gate not active below Level 2", and the acceptance template renders empty at Level 1.
- The authoring card says not to raise the level.

### Decision

**We chose**: Level 2, the lowest level at which acceptance rows can block closure.

**How it works**: The docs follow the Level 2 core templates; `acceptance-criteria.md` holds one row per requirement, and the decisions live here as a lazy add-on.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 2** | Unmet rows block closure, including AC-006, which waits on the conductor | One level above the helper | 8/10 |
| Level 1 with the acceptance file | Follows the helper exactly | Rows would gate nothing, so implement could close green over AC-006 | 4/10 |
| Level 3, like the siblings | Matches 005 and 006 | The helper gives no reason for it | 3/10 |

**Why this one**: Both instructions hold only at Level 2, and the helper still caps the level there.

### Consequences

**What improves**:
- `validate.sh --strict` refuses to close the packet while any row is Unmet.

**What it costs**:
- A named deviation from the card's "do not raise the level". Mitigation: the reason is quoted in `spec.md` and here.

### Implementation

**What changes**: `SPECKIT_LEVEL: 2` in every doc; `description.json` and `graph-metadata.json` follow through `validate.sh`'s derived repair.

**How to roll back**: Re-render the docs at Level 1 with `inline-gate-renderer.sh --level 1` and drop `acceptance-criteria.md` and this file.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Allowlist the four trigger index outputs by exact path, guarded by the derived check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Plan author; the conductor may override |

### Context

Phase 006's plan expected regeneration to clear the trigger index and its three fixtures. It does not: the generator reads every doc, `specs/` included, and parent decision D1 keeps `specs/` as history. In a fresh generation, 1,068 of 1,070 lane-term paths and 384 of 394 lane-term phrase keys trace only to `specs/`, and the rest are docs 006 changes or the allowlisted `case-studies.md`. The residue check greps the raw files, so repo mode cannot exit 0 on regeneration alone, and goal criterion 3 requires it.

### Constraints

- Allowlist rows are exact paths with reasons; folder and glob rows are refused.
- Goal decision D1 forbids hand edits to generated files; the allowlist is not generated.
- Research 4.5 designed repo mode to regenerate the index and assert that no lane phrase resolves outside `specs/`; phase 001's check does not do this.

### Decision

**We chose**: four exact-path rows, one per output, each added only after `derived` prints `outside=0` on a fresh generation.

**How it works**: `derived` reads the fresh index and its fixtures, follows every lane-term path and phrase to the documents it came from, and fails on any that sits outside `specs/` and outside the allowlist. A phrase in the index comes from a doc, and the residue check already greps that doc at its source, so the rows hide nothing the check cannot see elsewhere.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four exact-path rows plus `derived`** | Data only; meets criterion 3; `derived` keeps the guard | Rows are permanent until 008 replaces them | 8/10 |
| Teach the residue check to read the index | The guard runs on every repo-mode run | Code in the check phase 008 changes; outside "regenerate" | 6/10 |
| Exclude `specs/` from the generator | Clean index | Breaks retrieval over spec packets; not this packet's file | 1/10 |

**Why this one**: It meets the binding criterion with no code change, and the stronger form is proposed to phase 008 rather than absorbed here (`spec.md` open question 2).

### Consequences

**What improves**:
- Repo mode exits 0 with every generated file regenerated, not edited.

**What it costs**:
- The rows exempt whole files. Mitigation: `derived` runs in T002, T010 and T019, and the source docs stay checked.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later lane phrase in a non-spec doc reaches the index unseen | M | The doc itself is live in the residue check; 008 can make `derived` part of repo mode |

### Implementation

**What changes**: four rows in `$RT/fixtures/lane-residue-allowlist.json`, with these reasons:

| Path | Reason |
|------|--------|
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Written by generate-trigger-index.mjs from the trigger phrases of every doc, specs/ included. Each lane term in it is a spec packet path or phrase, kept as history, or a phrase of a file this allowlist already exempts. Regenerate it; never edit it. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Written by generate-trigger-index.mjs beside the trigger index: the path of every doc it read. Each lane term in it is a spec packet path, kept as history. Regenerate it; never edit it. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Written by generate-trigger-index.mjs beside the trigger index: frontmatter diagnostics per doc. Each lane term in it is a spec packet path, kept as history. Regenerate it; never edit it. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Written by generate-trigger-index.mjs beside the trigger index: the raw spellings of each phrase. Each lane term in it spells a spec packet phrase, kept as history, or a phrase of a file this allowlist already exempts. Regenerate it; never edit it. |

**How to roll back**: Remove the four rows; repo mode returns to exit 1 with the four paths live.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Regenerate the scorer eval baseline through its generator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Goal decision D2; confirmed by measurement |

### Context

`$R/scripts/routing-accuracy/scorer-eval-baseline.json` line 9 records `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, the residue check's only match in the file. Score baselines must not move. The ratchet reads `capturedAt`, the three fixture hashes and the `correct` and `value` counts; five other readers take `capturedAt` and score fields; none reads `env` or `capturedAtSha`. The capture script at `cf702d3fb9e` no longer writes the key.

### Constraints

- The capture imports the built `dist/`, so a stale build would score old code.
- `--write` stamps `capturedAtSha` with the current `HEAD` and replays the recorded `capturedAt`.

### Decision

**We chose**: `capture-scorer-eval-baseline.mjs --write` after a clean build, with the two scoring-date and private-root variables unset.

**How it works**: A stdout run measured the result: 30 fields, 2 differing (`capturedAtSha` and the dropped key), 21 of 21 score fields equal, and 0 residue lines against 1. The `--write` run must reproduce that.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Regenerate** | Matches D2; clears the match; scores proven equal | `capturedAtSha` moves to the start commit | 9/10 |
| Exact-path allowlist row | The file stays byte-identical | Keeps a dead key in a frozen file; D2 rejects it | 4/10 |
| Delete line 9 by hand | Two-line diff | Breaks goal decision D1 | 1/10 |

**Why this one**: No score field moves, so the decision's guard holds and D2 applies as written.

### Consequences

**What improves**:
- The baseline matches its generator again and holds no lane term.

**What it costs**:
- `capturedAtSha` names the start commit, not `62a9359e60a`. No reader compares it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A metric differs on the `--write` run | H | Halt: restore the file from `S`, recapture nothing, and use the fallback row below |

### Implementation

**What changes**: `capturedAtSha` and the dropped `env` key; `git diff --numstat` prints `1` and `2`.

**Fallback, only on a metric difference**: restore the file and add one exact-path row with the reason "Frozen score baseline. Its env block records a flag no code reads; regenerating it would move a score the ratchet holds, so it stays byte-identical."

**How to roll back**: `git restore --source "$S" -- <file>`; the ratchet then reads the old file, whose scores are the same.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Repair the five cite-drift label rows (conductor chose option A)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | The conductor |

### Context

Goal criterion 2 asks the cite-drift labels' check mode to exit 0, and the goal objective says to regenerate them. The labels file has no check flag. The command that validates it is `cite-drift-scan.mjs`'s default run, which reads each row at its pinned commit `ebcc68e8edb` and exits 2 on a hash mismatch. It exits 2 at `cf702d3fb9e` and on `main` at `22e5257fcb5`, on row `live-03`. Five rows fail because `be234e6f946` renamed their `doc` field from `sk-code/sk-code-opencode/` to `sk-code/sk-code-skilled/`, a path their pinned commit does not hold. All five hash-match at the old path, and with them restored on a scratch copy the scan exits 0. The two lane rows, `live-14` and `constructed-16`, read `semantic-shadow.ts` at the pinned commit, hold no residue term and are unaffected by the removal. CI never runs the scan's default mode; `cite-drift-gate.mjs` checks skill-doc citations and does not read the labels.

### Constraints

- `--draw` refuses to overwrite a file holding operator labels, so the labels cannot be regenerated.
- The five-row failure is not the lane, and scope discipline says to name an adjacent defect rather than fix it without a yes.
- Goal decision D1 forbids hand edits to generated files. The labels are drawn by a script, then labeled by hand by design, so D1's reach here is the conductor's call.

### Decision

**We chose**: option A, chosen by the conductor: restore the five `doc` fields to `sk-code/sk-code-opencode/`, the path their pinned commit holds.

**How it works**:
- Option A: restore the five `doc` fields to the path at their pinned commit. The scan exits 0 and AC-006 can be Met.
- Option B: no edit. Amend criterion 2's labels clause to "no new label-gate failure, and neither lane row fails", and waive AC-006 through this ADR with the answer recorded.
- Option C: change the scanner to read rows through the rename redirects, in an sk-doc packet of its own; AC-006 is waived here as in B.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: restore five fields** | Meets criterion 2 as written; proven on a scratch copy; reverses one bulk rename's edit | A data fix outside the lane | 8/10 |
| B: amend and waive | Keeps the phase to the lane | Leaves a broken label gate on `main` | 6/10 |
| C: fix the scanner | Survives future renames | Code in sk-doc, its own packet | 5/10 |
| Regenerate with `--draw` | The objective's wording | Refused by the tool; would discard operator labels | 0/10 |

**Why this one**: Option A is five fields with hash proof, and it turns the only red check mode green. It still needs a yes because it lies outside the lane.

### Consequences

**What improves**:
- Under A, every check mode the goal names exits 0.

**What it costs**:
- Under A, the labels file's sha256 changes; only `--jev` reports record it, and no gate reads them.

### Implementation

**What changes**: under A, rows `live-03`, `live-10`, `live-17`, `constructed-06` and `constructed-17` in `$SD/shared/scripts/cite-drift-labels.jsonl`; under B or C, nothing.

**How to roll back**: `git restore --source "$S" -- $SD/shared/scripts/cite-drift-labels.jsonl`.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Regenerate the index after the last new doc and phrase edit; prove the final tree by content

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Plan author |

### Context

`--check` compares phrases per document and only notes a manifest hash difference, so it cannot vouch for the three fixtures. CI's `trigger-index-rebuild.yml` therefore byte-compares all four outputs with a fresh `--out` generation. The fixtures hash every corpus byte, and this packet's own docs are in the corpus. A body edit to two of them changed all four outputs byte for byte, and with `manifestHash` and `corpusHash` removed all four stayed equal.

### Constraints

- Ticking a task box is a markdown write, so a strict byte compare can never be the last recorded step.
- A new markdown file or a `trigger_phrases` edit changes real content, and `--check` reports it as stale.

### Decision

**We chose**: regenerate after the last new markdown file and the last phrase edit; run CI's strict `cmp` right after, before any doc edit; prove the final tree with `--check` and `samecontent`.

**How it works**: T008 regenerates, T009 runs the strict compare, T017 fills the docs as body edits only, and T019 regenerates a fresh copy and compares content with the two hash fields removed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Strict compare first, content compare last** | Honest at every step; matches CI's method where it can hold | Two compare helpers | 9/10 |
| Regenerate after the final tick | Strictly fresh at commit | The tick that records it is another write; never terminates | 2/10 |
| `--check` alone | One command | Cannot see stale fixtures | 3/10 |

**Why this one**: It proves everything a fresh generation would change, and the generator itself says no lookup depends on the manifest hash.

### Consequences

**What improves**:
- The committed index and fixtures equal a fresh generation in every field a lookup reads.

**What it costs**:
- The committed hash fields may trail by this packet's last doc edits until `trigger-index-rebuild.yml` refreshes them after merge.

### Implementation

**What changes**: the T008 to T019 order and the order rule in `tasks.md`.

**How to roll back**: Not applicable; the rule orders tasks and writes no file of its own.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The skill-graph export's check mode is its two CI steps and a scratch compare

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Plan author |

### Context

Goal criterion 2 names the export's check mode. `skill_graph_compiler.py` takes only `--validate-only`, `--output`, `--pretty` and `--export-json`. `routing-registry-drift.yml` checks the export with `--validate-only` and `skill-graph-freshness.cjs --strict`. Phase 006 regenerates the export in the commit that removes four `intent_signals` (006 `plan.md` ADR-005), and those four are the export's only lane matches.

### Constraints

- The export carries `generated_at`, so two exports never match byte for byte.

### Decision

**We chose**: the two CI steps plus an `--export-json --output $T/...` copy compared with `generated_at` removed; this phase writes nothing to the export.

**How it works**: T013 runs the three, and `hits` on the export prints `lines=0` after 006.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two CI steps plus a scratch compare** | Same as CI; proves content freshness | Three commands | 9/10 |
| Regenerate the export again here | Fresh `generated_at` | Rewrites a file 006 owns, for no content change | 3/10 |

**Why this one**: 006 owns the write, and these three commands are what CI and a fresh compile can say about it.

### Consequences

**What improves**:
- The export's freshness is proven without a second writer.

**What it costs**:
- None beyond the run time.

### Implementation

**What changes**: nothing on disk.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Exploration ran inline, not as four parallel context agents

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-21 |
| **Deciders** | Plan author |

### Context

`speckit-plan.yaml` step 5 dispatches four `@context` agents. This plan was written by a leaf worker that may not dispatch agents.

### Constraints

- The worker's brief forbids dispatching another agent.

### Decision

**We chose**: the step's inline fallback: every generator and check run directly in this worker, with its output in `spec.md` Measured Behavior.

**How it works**: Each command there can be rerun from the repository root.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline runs** | Allowed; every claim has a command | One reader's view | 7/10 |
| Dispatch the agents | Four views | Forbidden by the brief | 0/10 |

**Why this one**: It is the workflow's own fallback.

### Consequences

**What improves**:
- Every number in the packet has a command beside it.

**What it costs**:
- One reader's view. Mitigation: the commands are there to be rerun.

### Implementation

**What changes**: nothing on disk.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-007 -->
