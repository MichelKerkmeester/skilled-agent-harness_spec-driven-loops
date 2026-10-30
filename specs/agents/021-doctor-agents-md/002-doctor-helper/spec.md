---
title: "Feature Specification: /doctor:helper"
description: "An operator who can describe a problem in plain words has no entry point that names the doctor command which fits, and the advisor's doctor bridges are tuned never to outrank a skill. This packet builds a deterministic matcher that ranks doctor commands and hands every writing command back to its own gate."
trigger_phrases:
  - "doctor helper command"
  - "which doctor command"
  - "deterministic route matcher"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/002-doctor-helper"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the packet from the approved design"
    next_safe_action: "Re-measure the route, phrase and bridge counts, then write the failing suites first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: /doctor:helper

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-doctor-agents-md |
| **Successor** | None |
| **Handoff Criteria** | The matcher clears its held-out bar, the helper route validates and the contract suite pins reach for every doctor router |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `agents/021-doctor-agents-md`.

**Scope Boundary**: One read-only routing command, its matcher, its two suites and its plumbing. It adds no children and no writing workflow.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then. Its own route and bridge shift the counts this packet quotes.
- The route manifest `_routes.yaml` is the only phrase table; the packet adds no second one.

**Deliverables**:
- `doctor/helper.md`, `assets/doctor-helper.yaml` and `assets/doctor-helper-presentation.txt`.
- `scripts/doctor-helper-match.cjs` with `loadEntries` and `rankProblem` exported.
- Two suites: the matcher suite with a frozen held-out set, and the reach contract suite.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor family now carries nineteen routes across twelve commands, and the only way to find the right one is to read the manifest. The advisor cannot fill that gap: its doctor bridges are tuned never to outrank a skill and never to move a skill's score, and in a measured run forty realistic paraphrases reached the gold doctor bridge in the top three zero times, against thirty-three of forty top-1 for a local token matcher over the same phrases. A fleet of doctor commands with no entry point is a fleet nobody uses.

### Purpose
Give the family one read-only command that takes a problem in plain words and ranks the doctor commands that fit, with the class and the reason on every line. A read-only pick runs in place; a writing pick is printed as a line for the operator to run, so each writer's own plan and yes still govern its change.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the packet starts on, and recorded in `scratch/baseline.txt` before the first edit. This packet shares those counts with the sibling phase, so whichever lands second rebases them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this packet's criteria are read against, and the shipped command counts shift by one for every sibling route that lands first.
```text
$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 19 routes validated, 3 warnings

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] node:test (35 files): tests 699, pass 699, fail 0
[run-all] 7 suite(s) passed, 0 failed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One route, `command: /doctor:helper`, `target: helper`, class `read-only`, with three or more words per trigger phrase.
- A deterministic matcher over `_routes.yaml` sections `routes`, `standalone` and `mcp_subroutes`, plus standalone action phrases as their own entries.
- A frozen held-out set of at least forty positive phrasings and ten negatives, authored before tuning and pinned by sha256.
- A contract suite that makes every doctor router reachable through the helper and every helper entry equal to the deriver's own entries.

### Out of Scope
- Any second phrase table: a vocabulary gap is fixed by adding a phrase in `_routes.yaml`.
- Running a writing target: the helper prints the line and stops.
- Any flag on a runnable: no `--apply`, `--fix`, `--state=off`, `--variable=` or `--yes`.
- Root README counts the sibling phase also edits, except the doctor count and the missing entry this packet must correct.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/helper.md` | Create | Router with the six canonical sections and the free-text binding |
| `.skilled/commands/doctor/assets/doctor-helper.yaml` | Create | Read-only single-step workflow that runs the matcher |
| `.skilled/commands/doctor/assets/doctor-helper-presentation.txt` | Create | Argument failure, prompt, ranked list, offer, no-match and summary templates |
| `.skilled/commands/doctor/scripts/doctor-helper-match.cjs` | Create | The matcher, with `loadEntries` and `rankProblem` exported |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | Create first, red | Unit, self-recall and held-out accuracy |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` | Create first, red | Reach, self-recall, derivation parity and setup-row coverage |
| `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl` | Create | Frozen held-out set, sha256 pinned in the suite |
| `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl` | Create | The only set tuning may read |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The helper route, the header router list and the vocabulary phrases |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | One helper row |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Helper entry, plus the missing router paths |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | One entry per route |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerate | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerate | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Regenerate | The generated command list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify only under the bridge decision | Activation lives here, not in the route |
| `.claude/commands/doctor/helper.md`, `.cursor/commands/doctor-helper.md`, `.codex/prompts/doctor-helper.md`, `.pi/prompts/doctor-helper.md`, `.hermes/prompts/doctor-helper.md` | Generate | Never hand-written |
| `.skilled/commands/README.txt` | Modify | Group count, the word Twelve and one table row |
| `README.md` | Modify | Doctor count, the helper entry, the missing sibling entry and the onboarding prose |
| `.skilled/commands/doctor/scripts/README.markdown` | Modify | Script and suite rows |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modify | One helper row |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` | Create | Two scenarios on the next free DOC numbers, plus the registry rows |
| `.skilled/changelog/` entries | Create | One for the skill that owns the router, one framework note, one for the advisor's regenerated blocks |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:decisions -->
## DECISIONS

Copied from the approved design with the reasons that decided them. A change to any row is an amendment to this packet.

| ID | Decision | Reason |
|----|----------|--------|
| D1 | The name is `/doctor:helper`. | The route validator requires `/doctor:<name>`, so a bare `/doctor` cannot be a route, and `help` collides with the built-in every runtime already has. |
| D2 | It is a single route in `_routes.yaml`, not a `standalone` entry. | Only `routes` get the full assertion set, and the setup list, the contract and the deriver then treat it like every sibling. |
| D3 | Routing is a deterministic local matcher, not the advisor. | It measured thirty-three of forty against zero of forty, and the advisor's doctor rules forbid doctor-versus-doctor ranking. |
| D4 | `_routes.yaml` trigger phrases are the only phrase table. | One table feeds both consumers, and a second table would drift from the advisor's own ranking. |
| D5 | The helper skips its own entry and every local-only name, and reports a count only. | A helper that recommends itself is a loop, and a private name must never reach tracked output. |
| D6 | A read-only pick runs in place; a writing pick is handed off as a typed line. | Each writer's plan and yes must run under its own frontmatter, and the helper never holds write tools. |
| D7 | The helper never emits a flag. | Flags such as `--apply` and `--fix` are decisions the target's own gate owns. |
| D8 | The class shown is the manifest's verbatim, with the standalone-action rule. | It is honest and machine-checkable; splitting one target into its own class would be a schema change. |
| D9 | Free text goes after `--`, and a leading `--json` is the only flag. | Pasted error text must never fail as an unknown flag. |
| D10 | At most three questions in one prompt, with the area list generated from the manifest. | It follows the consolidated question protocol, and a new command appears with no helper edit. |
| D11 | No match falls back to the read-only setup command. | Setup lists every doctor command and writes nothing, so it is the one safe fallback. |
| D12 | The helper's own advisor bridge is activated only if the reach probe, the routing slice, the bridge isolation suite and the ratchet all pass. | An advisor answer to "which doctor command" is useful, but it must not cost a passing prompt. |
| D13 | Two existing drifts are fixed here: the contract's missing router paths and the root README doctor count with its missing sibling entry. | Both sentences are rewritten by this packet anyway, and leaving a false count would break the precedent that a count must match. |
| D14 | The plan is Level 2 with no children. | `recommend-level.sh --loc 900 --files 24` returns level 2 and no phases. |
| D15 | No helper edit is needed for the sibling command, in either landing order. | The helper reads the manifest at run time, so its acceptance counts shift by one and the success criteria state the baseline plus one. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"` exits 0 and its first candidate line starts `1) /doctor:git hooks`. |
| REQ-002 | `--json -- "is this skill in the skilled format"` exits 0 with `candidates[0].runnable == "/doctor:sk-skill"` and `candidates[0].mutating == "read-only"`, which proves an inactive bridge stays routable. |
| REQ-003 | `-- "write me a poem about cats"` exits 1 and its last line reads `STATUS=NO_MATCH FALLBACK=/doctor:setup`. |
| REQ-004 | `--table --json` exits 0, no runnable starts with the helper's own name, and the output contains no local-only name. |
| REQ-005 | The held-out set clears top-1 at least 0.80, top-3 at least 0.90 and negatives returning no match at least 0.90, with the pinned sha256 unchanged. |
| REQ-006 | Every doctor router, except the helper's own and any local-only name, owns at least one helper entry, and every manifest entry's phrases self-recall top-1. |
| REQ-007 | The helper's ids and runnables equal the doctor entries in the generated bridge file, plus only the standalone action extras. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The route validates, the setup presentation gains one helper row, and the command contract gains the helper entry. |
| REQ-009 | Every generated surface is regenerated by its own script: the advisor blocks, the mirrors and the three prompt stub sets. |
| REQ-010 | The helper's own advisor bridge is either active with the reach probe, routing slice and isolation suite passing, or inactive with the reason recorded. |
| REQ-011 | The two drifts named by the decision are corrected: the contract's router paths and the root README doctor count with its missing sibling entry. |
| REQ-012 | Exit codes are 0 for a match, 1 for no candidate above the floor and 2 for a bad argument, an unreadable manifest or a missing `yaml` package. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0, and its node:test file count and test count equal the re-measured baseline plus this packet's additions.
- **SC-002**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and its summary names the re-measured route count and command count.
- **SC-003**: `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"` with a `doctorRoutes` count one above the re-measured baseline.
- **SC-004**: `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` prints the held-out bar line and reports `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The route manifest's phrases | The matcher has no vocabulary without them | Every gap is fixed by a phrase, and the reach probe gates each added one |
| Risk | A confident wrong top-1 for a writing command | High: the operator runs the wrong repair | The class is on every line, the tie-break prefers read-only, and a writing pick is handed off rather than run |
| Risk | Shared counts shift when the sibling phase lands | Medium: two suites then disagree | Every criterion states baseline plus one rather than an absolute |
| Risk | The contract test on the setup list fails on day one | Medium: an existing command may lack a row | Run it in task 1 and add the row or narrow the test, recording which |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A match run finishes in under a second, because it reads one YAML file and scores in process.

### Security
- **NFR-S01**: The matcher writes nothing, starts no daemon and makes no model call.

### Reliability
- **NFR-R01**: Two runs over the same input print byte-identical JSON.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a bare invocation asks three questions in one prompt and stops.
- Maximum input: a pasted error line with flags is treated as problem text, and only a leading `--json` is read as a flag.
- Failure path: an unreadable manifest exits 2 with a named cause, and a second unparseable reply ends `STATUS=FAIL ERROR="unknown_selection"`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One matcher, two suites, three command files and the docs rows |
| Risk | 10/25 | A wrong writing pick costs more than a wrong read-only one |
| Research | 8/20 | The measured prototype already fixes the scoring shape |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the helper's own bridge activated? It depends on four checks the design names, and the answer is recorded either way.
- Does the setup-list contract test pass on the first run? The design counted nineteen rows over twelve commands but not every target of every command, so the check runs in task 1.
<!-- /ANCHOR:questions -->

---
