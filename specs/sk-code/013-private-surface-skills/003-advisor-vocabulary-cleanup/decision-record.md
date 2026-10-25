---
title: "Decision Record: Phase 3: advisor-vocabulary-cleanup"
description: "The decisions that fix how the advisor treats a local-* private skill, why the tracked fallback graph is regenerated rather than edited, and why one CI gate is screened instead of changed."
trigger_phrases:
  - "advisor vocabulary cleanup decision record"
  - "private skill scan containment decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup"
    last_updated_at: "2026-10-23T20:25:50.125Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored seven decision records for the phase"
    next_safe_action: "Execute the tasks against these decisions"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-003-advisor-vocabulary-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Contain a followed private-skill link with realpath against trusted roots

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-001-context -->
### Context

A top-level `local-*` symlink is how a private skill enters the advisor's tree. The Level 2 plan checked only `statSync(target).isDirectory()`. That proves the target is a directory, not that it belongs to the operator's private skills, so a link could point at any readable directory and the graph scan would index it. The research synthesis upheld the gap as `f-iter002-004` and `f-iter005-003`.

### Constraints

- The advisor runtime is plain TypeScript on `node:fs`, with no configuration service.
- Phase 4 links each private skill to a `local-skills/` folder in an external repository (Obsidian public by operator choice, Webflow private).
- A scan must stay green when a link target is missing or unreadable.
- The rule must be identical in the graph scan and the source signature.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: follow a `local-*` symlink only when `realpathSync` resolves it to a directory inside the resolved skills root or a path listed in `SPECKIT_PRIVATE_SKILL_ROOTS`.

**How it works**: one helper, `isTrustedPrivateSkillLink(entryPath, skillsRoot)`, resolves the whole link chain, rejects a non-directory or a missing target, and tests containment with `path.relative` against each trusted root. Both the graph scan and the source signature call it, so the rule cannot drift between them.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Realpath containment against the skills root plus declared roots** | Bounds the target; one helper; a real folder needs no configuration | An external link needs `SPECKIT_PRIVATE_SKILL_ROOTS` | 9/10 |
| `statSync(target).isDirectory()` only | One line; no configuration | Proves shape, not location; follows any readable directory | 3/10 |
| Trust the repository root only | No environment variable | Rejects a legitimate private checkout outside the repo | 6/10 |
| Trust `$HOME` | Most operator paths work | Too broad; trusts unrelated directories | 4/10 |

**Why this one**: it is the narrowest rule that still supports both phase-4 modes, and it keeps the default safe with no configuration.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A link cannot make the advisor read an arbitrary directory.
- The graph scan and the signature share one containment rule.

**What it costs**:
- An external repository needs one environment variable. Mitigation: ADR-006 records the constraint for phase 4, and a real folder needs nothing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator sets the variable too broadly | M | The variable names roots, not files; the helper still requires a directory inside one of them |
| A link chain escapes through a relative hop | L | `realpathSync` resolves the whole chain before containment is tested |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The research synthesis upheld the gap; a bare directory check cannot bound a target |
| 2 | **Beyond Local Maxima?** | PASS | Four policies were scored, including the repo-only and home-directory boundaries |
| 3 | **Sufficient?** | PASS | One helper covers both follow paths; five unit cases plus the graph and signature cases prove it |
| 4 | **Fits Goal?** | PASS | A private skill stays visible locally and cannot pull in an unrelated tree |
| 5 | **Open Horizons?** | PASS | A future private root is a configuration entry, not a code change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `runtime/lib/private-skill-target.ts` is created with the helper.
- `skill-graph-db.ts:733` and `freshness.ts:143` call it for a top-level `local-*` symlink.

**How to roll back**: delete the helper, restore the bare `entry.isDirectory()` filter in both files, and delete the new tests. The tracked graph is unaffected because the compiler never followed a link.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Eight scans include `local-*`, eight exclude it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-002-context -->
### Context

One directory, `.skilled/skills/`, feeds both the local advisor and eight tracked-artifact writers or gates. A single policy cannot serve both: the advisor must see the private skill, and the tracked graph, Hermes mirror, CI gate, doctor report, bridge files, regenerated metadata, hub signals and propagated edges must not. The plan counted seven scans. The Python conflict-declaration reader was the seventh, flagged by the research synthesis because it scans every top-level skill directory with no filter. The review follow-ups found nine more, and the inventory in `spec.md` section 3 lists all sixteen.

### Constraints

- The local graph already indexes a trusted `local-*` skill.
- The Python reader returns an in-memory map and writes no file.
- The tracked writers must not read a private byte, not merely avoid writing one.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: eight scans include a `local-*` entry and follow a symlink only inside a trusted root. They are the graph scan, the source signature, the Python conflict-declaration reader, the Python signal-map reader, the Python skill-record discovery, the daemon watcher, the filesystem projection and the status metadata scan. Eight scans skip it by name. They are the compiler, the Hermes sync, the CI root gate, the doctor panel, the command-bridge deriver, the skill-metadata regenerator, the router-signal generator and the cross-skill edge loader.

**How it works**: the TypeScript follow paths use ADR-001's helper and the Python ones use its mirror in `skill_advisor_runtime.py`. The Python conflict reader keeps its inclusion and has a characterization test, because the graph it cross-checks already contains the private node. Each excluding scan tests `entry.name.startsWith('local-')` before any filesystem probe.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eight include, eight exclude, chosen per artifact** | Each consumer gets the rule its output needs | Sixteen decisions to document and test | 9/10 |
| Exclude everywhere | One rule; no private read anywhere | The private skill never routes, defeating phase 4 | 2/10 |
| Include everywhere | One rule; the advisor sees everything | A private skill enters the tracked graph and the Hermes mirror | 1/10 |
| One shared policy with a caller flag | One implementation | Hides the decision at each call site; an accidental include is one character | 5/10 |

**Why this one**: the artifact decides the policy, and every decision has a test that names it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The local advisor routes the private skill while every tracked artifact stays clean.
- The Python reader's inclusion is a recorded decision rather than an accident.

**What it costs**:
- Sixteen scan behaviors to keep aligned. Mitigation: the scanner inventory in `spec.md` section 3 names each one, and AC-039 prints the files so the count can be re-derived.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader copies the wrong neighbor's policy | M | The table names the include set and the exclude set; a new reader must state which it follows |
| The Python inclusion is mistaken for a leak | L | It returns an in-memory map and writes no file; ADR-002 and AC-024 say so |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The local advisor and the tracked writers cannot share one answer |
| 2 | **Beyond Local Maxima?** | PASS | Exclude-all, include-all and a caller flag were scored |
| 3 | **Sufficient?** | PASS | Sixteen scans, each with one test or a recorded screen |
| 4 | **Fits Goal?** | PASS | The phase's purpose is exactly this split |
| 5 | **Open Horizons?** | PASS | A new reader has a documented pattern to follow |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The eight including scans follow a trusted private skill and no other link.
- The eight excluding scans skip the name. `spec.md` section 3 names every one.
- Each decision gains a test or a recorded screen.

**How to roll back**: restore each filter to its Level 2 form and delete the new cases. The tracked graph returns on the next compiler run.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Skip by name before any filesystem probe

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-003-context -->
### Context

The compiler, the Hermes walk, the CI gate and the doctor panel each write or gate a tracked artifact. A `local-*` entry is local-only, so none of them may read it. A check that resolves first and skips second still reads the target.

### Constraints

- The compiler's `os.path.isfile` and `json.load` follow a symlink.
- The Hermes walk sees a symlink Dirent as neither a directory nor a file.
- The CI gate and the doctor panel already exclude a symlink because `Dirent.isDirectory()` is false, but not a real folder.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: each skip tests the name before a `statSync`, `realpathSync`, `isfile` or content read, and the Hermes skip also requires the top-level directory.

**How it works**: the compiler inserts `if entry.startswith("local-"): continue` immediately after the listing loop line. The Hermes walk inserts `if (current === directory && entry.name.startsWith('local-')) continue;` immediately after the joined path. The CI gate adds the name to its filter chain. The doctor panel returns early on the name.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skip by name before any probe** | Never reads the target; one condition per writer | Repeats the name test in four files | 9/10 |
| Rely on `.gitignore` | No code change | Ignore rules govern staging, not a filesystem walk | 3/10 |
| Resolve first, then skip | Reuses the helper | Reads the target before deciding, which is the leak path | 2/10 |
| Filter at the output | One place per writer | The private bytes are already in memory and may already be mirrored | 4/10 |

**Why this one**: the only safe skip is the one that happens before the first read.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A real folder and a symlink are both excluded without a read.
- The rule holds even on a checkout where the ignore rules are bypassed.

**What it costs**:
- Four small name checks instead of one shared filter. Mitigation: each has its own test and the plan's table names all four.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A nested `local-*` folder changes behavior | M | The Hermes condition requires `current === directory`; the other three read only the top level |
| A writer is added later without the check | M | The affected-surfaces table and ADR-002 make the policy explicit |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A resolved-then-skipped target has already been read |
| 2 | **Beyond Local Maxima?** | PASS | Ignore rules, resolve-first and output filters were scored |
| 3 | **Sufficient?** | PASS | Four writers, four checks, four tests |
| 4 | **Fits Goal?** | PASS | No private byte reaches a tracked artifact |
| 5 | **Open Horizons?** | PASS | The name test is stable as new writers appear |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `skill_graph_compiler.py:200`, `sync-skills-hermes.cjs:56`, `ci-skill-root-metadata.cjs:144` and `skill-graph-freshness.cjs:147` gain the name test.
- Each writer's suite gains a real-folder case; the compiler and Hermes also gain a symlink case.

**How to roll back**: delete the four inserted conditions and their cases.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Screen `ci-leaf-manifest-freshness.cjs` instead of changing it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-004-context -->
### Context

The gate walks the skills tree for every committed `leaf-manifest.json`. The research synthesis listed it as a gap and then screened it: neither private source tree at `42b41dd286` carries a manifest. The fleet has 14 manifests, all at top-level skill roots.

### Constraints

- A private skill restored in phase 4 comes from `42b41dd286` and inherits no manifest.
- Adding a filter with no evidence would hide a future manifest instead of reporting it.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: make no change. Record the screen with the command that proves 14 fleet manifests and zero in either private tree, and re-run the gate in verification.

**How it works**: T046 runs `git ls-tree` over the fleet and over the two private trees, then runs the gate. AC-025 repeats the three commands. Phase 5's fresh-clone proof is the backstop if a future private skill adds a manifest.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Screen and record, no change** | No unproven code; the gate keeps reporting a future manifest | A future private manifest would fail the gate | 8/10 |
| Add a `local-*` filter | The gate ignores a private manifest | Hides a real failure; no evidence requires it | 4/10 |
| Change the generator | Fixes the source | Outside this phase's scope; no evidence requires it | 3/10 |

**Why this one**: the gate is correct for the tree it governs, and the screen is cheaper and more honest than an unproven filter.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One less file in a phase that already touches 31.
- The decision is recorded with its proof rather than left as an omission.

**What it costs**:
- A future private leaf manifest would fail the gate. Mitigation: that is the gate doing its job; the operator regenerates the manifest or revisits this ADR.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 4 adds a manifest the screen did not foresee | L | The gate fails loudly and phase 5's fresh-clone proof catches it |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The gate is in the research inventory and must be dispositioned |
| 2 | **Beyond Local Maxima?** | PASS | Filter and generator change were scored |
| 3 | **Sufficient?** | PASS | Three commands prove the fleet and both private trees |
| 4 | **Fits Goal?** | PASS | No private content reaches the gate |
| 5 | **Open Horizons?** | PASS | The gate stays a truthful signal |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Nothing in `ci-leaf-manifest-freshness.cjs`.
- `implementation-summary.md` records the screen.

**How to roll back**: delete the recorded screen. No code changed.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Regenerate the tracked fallback graph, never hand-edit it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-005-context -->
### Context

`runtime/scripts/skill-graph.json` is generated from per-skill `graph-metadata.json`. Phase 2 removes the surface folders and their signals. The current file carries five sk-code entries matching `webflow` or `obsidian`: `webflow`, `obsidian plugin`, `obsidian plugin source`, `obsidian plugin design system` and `obsidian plugin conventions`.

### Constraints

- The compiler writes the file with `--export-json` and prints the skill count.
- A hand edit is overwritten by the next regeneration.
- The diff must not remove an `mcp-tooling` signal, because D6 keeps that vocabulary.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: run the compiler after the skip lands, and accept only removed sk-code surface signals plus `generated_at` and `skill_count`.

**How it works**: T048 runs `python3 .../skill_graph_compiler.py --export-json`. T049 checks the `sk-code` slice with an `mcp-tooling` positive control. T050 rejects any diff that touches `mcp-tooling` or a second file.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Regenerate with the compiler** | Reproducible; matches CI | The diff depends on phase 2 having landed | 9/10 |
| Hand-edit the JSON | Precise control | Overwritten on the next compile; not reproducible | 2/10 |
| Skip regeneration | No diff | The tracked graph keeps the removed surfaces' phrases | 1/10 |

**Why this one**: the artifact must equal what a clean checkout would produce.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The tracked graph loses the surface phrases in the same way CI would.
- A surprising diff points at phase 2 or at the skip, not at a hand edit.

**What it costs**:
- The diff includes a `generated_at` stamp. Mitigation: T050 accepts that field by name.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The compiler runs before phase 2 lands | H | T002 stops the phase; T050 rejects a diff with a surviving surface signal |
| The diff removes an `mcp-tooling` signal | M | T050's `mcp-tooling` grep must print `0` |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The tracked graph is a handoff artifact and still names the surfaces |
| 2 | **Beyond Local Maxima?** | PASS | Hand edit and skip were scored |
| 3 | **Sufficient?** | PASS | One command, two checks, one diff gate |
| 4 | **Fits Goal?** | PASS | The tracked vocabulary loses the removed surfaces |
| 5 | **Open Horizons?** | PASS | The generator stays the only writer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `runtime/scripts/skill-graph.json` is regenerated.
- T049 and T050 prove the signal removal and the diff scope.

**How to roll back**: `git checkout -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, then re-run the compiler only if the skip is still in place.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: A phase-4 external link requires `SPECKIT_PRIVATE_SKILL_ROOTS`

> Numbering note: `plan.md` carries this decision under the same number, ADR-006. Neither document has an ADR-007, so the sequence runs from ADR-006 to ADR-008, which covers the agent fallback.

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-006-context -->
### Context

Phase 4 uses a symlink per private skill to a `local-skills/` folder in an external repository: Obsidian in a public repository by operator choice, Webflow in a private one. ADR-001 rejects a link that leaves the checkout unless the operator declares the target root. Without a recorded constraint, a link without the variable would stay invisible to the advisor.

### Constraints

- This phase may not edit phase 4's documents.
- The default must be safe with no configuration.
- A real folder under `.skilled/skills/local-*` must keep working with no variable.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: record the variable as an inter-phase constraint in this phase's spec Open Questions and in this ADR. Phase 4 sets `SPECKIT_PRIVATE_SKILL_ROOTS` to both external `local-skills/` parents, joined with `:`, in every advisor process; a real folder or a link inside the skills root still needs no configuration.

**How it works**: the helper reads the variable on every call, splits it on `path.delimiter`, resolves each entry and adds it to the trusted roots. Phase 4 records the symlink mode and both roots.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Declare the root through the environment** | Default is safe; external links are possible | One setup step for the operator | 8/10 |
| Trust every link | No setup | Defeats containment | 1/10 |
| Hard-code the operator's private path | No setup for this machine | Wrong on every other checkout | 2/10 |
| Forbid external links entirely | Simplest rule | Rejects a phase-4 mode the parent spec allows | 5/10 |

**Why this one**: it keeps the default safe and leaves the external mode available with one explicit declaration.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- No configuration is needed for the common case.
- An external link is a deliberate act, not an accident.

**What it costs**:
- Phase 4 must set one variable for an external link. Mitigation: the constraint is recorded in `spec.md` §12 and here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 4 creates an external link and forgets the variable | M | The advisor simply does not route it; phase 4's handoff probe would notice a missing top result |
| The variable names a broad directory | M | It names roots, not files, and the helper still requires a directory inside one |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 4 has two supported modes and only one works without configuration |
| 2 | **Beyond Local Maxima?** | PASS | Trust-all, hard-code and forbid were scored |
| 3 | **Sufficient?** | PASS | One variable, read at call time, plus the five helper cases |
| 4 | **Fits Goal?** | PASS | The private skill stays local and the tracked tree stays clean |
| 5 | **Open Horizons?** | PASS | A new external repository is a configuration entry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `private-skill-target.ts` reads the variable.
- `spec.md` §12 records the inter-phase constraint.

**How to roll back**: remove the variable from the helper and the constraint from the spec. A real folder still works.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Agents fall back to an advisor-named local-* skill when sk-code returns UNKNOWN

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-008-context -->
### Context

After phase 2 removes the Webflow and Obsidian surfaces and this phase removes their vocabulary, `sk-code` has no route for those two projects. In the anobel.com checkout, a Webflow task returns UNKNOWN; in the Obsidian Plugin checkout, an Obsidian task does. `.skilled/agents/code.md` hard-stops with `UNKNOWN_ROUTE` at step 3, and `.skilled/agents/review.md` reviews only baseline minimums. The advisor can still name `local-webflow` or `local-obsidian` once phase 004 links them, so the agents need a fallback that trusts only a `local-*` pick.

### Constraints

- `.claude/agents` is hand-kept and must match `.skilled`; `.codex` and `.pi` are generated and never hand-edited.
- A non-local advisor pick must not override sk-code's route or the existing escalation.
- No agent line may name a packet, phase, ADR or task id.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: when `sk-code` returns UNKNOWN or ambiguous routing, `@code` and `@review` run the advisor CLI on the task text. When `.data.recommendations[0].skillId` starts with `local-`, they read that skill's `SKILL.md` as the standards overlay and cite it. Any other pick leaves the existing behavior: `@code` escalates `UNKNOWN_ROUTE`, and `@review` reviews against baseline security/correctness minimums.

**How it works**: the code agent's step 3, stack-delegation contract and precedence list state the same rule; the review agent's route selection states it; the `.claude` twins carry identical bodies; the `.codex` and `.pi` mirrors are regenerated.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisor `local-*` fallback** | Private work proceeds; a non-local pick cannot override routing | Agents depend on the advisor CLI | 9/10 |
| Keep the hard stop | No new dependency | Webflow and Obsidian work escalates even when the private skill is present | 2/10 |
| Guess a default route | No CLI call | Violates the never-guess rule and can load the wrong standards | 1/10 |
| Accept any advisor pick | Simple | A `sk-code` or unrelated pick would silently replace the route | 3/10 |
| Hard-code surface names | No advisor call | Reintroduces the retired vocabulary into tracked agent files | 1/10 |

**Why this one**: it keeps the fallback local-only and leaves the non-local branch exactly as it is.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A Webflow or Obsidian task routes to the private skill once phase 004 links it.
- The non-local branch keeps the existing escalation and baseline review.

**What it costs**:
- The agents depend on `skill-advisor.cjs` being callable on an UNKNOWN route. Mitigation: the CLI already ships in the checkout, and a failure leaves the existing escalation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A non-local pick is treated as local | H | The `local-` prefix test is explicit in all five statements (four in `code.md`, one in `review.md`); AC-030 to AC-032 prove it |
| A runtime mirror drifts from `.skilled` | M | T070d1 and T070d2 hand-edit the `.claude` twins and T070e1 and T070e2 regenerate `.codex` and `.pi`; T070e3 runs the four drift checks |
| The private skill does not exist yet | L | AC-035 is deferred to phase 004 under this ADR and does not gate this phase |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The removed surfaces leave sk-code with no route, while the advisor can still name the private skill |
| 2 | **Beyond Local Maxima?** | PASS | Hard stop, guess, accept-any and hard-code were scored |
| 3 | **Sufficient?** | PASS | Five agent statements (four in `code.md`, one in `review.md`) plus the three mirror families are covered |
| 4 | **Fits Goal?** | PASS | Private work routes locally without tracked vocabulary |
| 5 | **Open Horizons?** | PASS | A new private skill needs no agent change if the advisor names it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `.skilled/agents/code.md` and `.skilled/agents/review.md` gain the fallback.
- `.claude/agents/code.md` and `.claude/agents/review.md` carry the same body.
- `.codex` and `.pi` are regenerated.
- `implementation-summary.md` records the deferred phase-004 probe.

**How to roll back**: restore the fallback lines in the four agent files and regenerate the `.codex` and `.pi` mirrors; delete the deferred-probe block.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

## Amendments (2026-10-24)

Plan counts and anchors were taken at an older base. Within D6 the Proof's end state wins over a task's Change line list, a stale pre-edit control is re-measured and its observed value recorded, and a Change line that contradicts another line keeps the file's intent. No amendment conflicts with D1 through D7.

- T001: the proof's `tail -3` drops the `advisor_rebuild: rebuilt` line, because the command prints five lines. The full output shows `advisor_rebuild: rebuilt` and `skillCount: 14`. The orchestrator ran it outside the Codex sandbox, where the advisor daemon cannot start.
- T017: the helper suite ran only after `npm run build`, because the advisor `dist/` was stale. `dist/` is generated and gitignored output, not part of the change.
- T021: the new signature case sits above the `// drift: verified against shipped behavior` comment so the comment stays attached to the test it describes.
- T022: the real closing block is `join(skills, '.private', 'private-beta', ...)`, the shape T021 wrote, not the `join(skills, 'private-beta', ...)` the anchor quoted.
- T023: the task expected 20 passed and 1 failed with this case passing. The case asserts `not.toBe(before)` on a link nothing follows yet, so it is red like T021's. Observed 19 passed and 2 failed before T024. AC-013 and the red-first table therefore count eight red-first cases and three guards (T019, T022, T029), not seven and four.
- T035: the specified body uses `advisor`, which is function-local to `test_advisor_module`. The new test loads it with `advisor = load_module("skill_advisor", "skill_advisor.py")` and adds no `ok()` of its own on load success. The phase adds three `ok()` calls in all (T025, T026 and T035), taking the count from 69 to 72.
- T039: the unused `writeFileSync` import was removed together with the three deleted detection rows.
- T045 and T067: the control `rg -c -i 'obsidian' skill_advisor.py` was expected to print `1` and prints nothing (exit 1) at `42b41dd286`, at `HEAD` and now: the file holds no `obsidian`. Its one surface-word line is the D6-kept `webflow cms` entry at line 2181. The control is corrected to `rg -c -i 'webflow|obsidian'`, which prints `1`, and the zero check over the three surface-id files still prints `0`. AC-016's proof is corrected the same way.
- T050 and AC-012: `skill-graph.json` is one JSON line, so `rg '^[-+].*mcp-tooling'` matches both diff lines and the `sk-code` count is `2`. A semantic compare against `HEAD` shows only `generated_at` differs, because `1218b94938` had already removed the sk-code surface signals. The intent holds and is stricter than the plan, which allowed `skill_count` and removed sk-code signals to change.
- T015, T047 and T069: the table-line proofs were written to count to the end of the file, so they hold only while the block is the last one. At the final state each block is counted to the next heading: Baseline 14, No-change decisions 4, Red-first rows 11, Final counts 16.
- T064: the sweep prints exactly `fusion.ts:600`, `fusion.ts:602` and `explicit.ts:131`, which are D6-kept `webflow cms` lines.
- T055 and T058: this Node prints `ℹ fail 0`, not `# fail 0`, so `node --test` proofs are judged by exit status and the `ℹ` lines.
- T063: the ambiguity slice exits non-zero by design (`live=17/24 baseline=19`); the proof is the `live=` value, not the exit status.
- T070b: the limitations anchor in `implementation-summary.md` sat at line 112, not 92, so the summary blocks were inserted by text, not by line. Line 392 is a NEVER-list bullet, so the plan's replacement ("escalate `UNKNOWN_STACK` only when the advisor's top pick is not a `local-*` skill") would invert it. It now reads "Pick a default overlay when stack is uncertain and the advisor's top pick is not a `local-*` skill — escalate `UNKNOWN_STACK`", which keeps the prohibition and carries the `local-` qualifier the proof counts.
- T070c: the sentence to replace sits on line 90 of `review.md`, as the task already notes.
- T070d1 and T070d2: the twin lines were copied by a script that first asserted each `.claude` line matched `HEAD`'s `.skilled` line at the mapped position, so no other line could change.
- AC-013: the proof expects `11` rows and `3` lines reading `passes before and after`, not `4`, per the T023 amendment.
- Environment: during this session `git diff`, `git status` and the child `git check-ignore` of the root-metadata contract hung. With `core.fsmonitor` disabled for the process they ran, so the runs used `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. No file or setting changed.
- T070e3: `sync-skills-hermes.cjs --check` reported `DRIFT agent-code` and `DRIFT agent-review`, because the Hermes mirror carries each agent body as a preloadable `agent-<name>` skill. The task's four drift checks pass without it, but a stale `.hermes/skills/agent-code/SKILL.md` and `agent-review/SKILL.md` would fail the repository's Hermes parity gate. They were regenerated with `sync-skills-hermes.cjs` (`Wrote 2 of 66 Hermes skill copies`) and `--check` now prints `PASS: 66 Hermes skill copies in sync`. This extends T070e within D6's boundary; the phase commit stages the two files.

### Review follow-up amendments (2026-10-24)

Round 1 of the independent review failed the phase. The two P1 findings enforce frozen decisions D4 and D5, so extending scope to the files below is required, not optional. Each extension sits under ADR-002 (which scans include and which exclude a `local-*` entry) and is added to `spec.md` section 3.

- Scope extension, P1-1 (D4): `skill_advisor.py`. `_load_source_graph_signal_map` and `_load_source_conflict_declarations` followed any symlink through `os.scandir` and `entry.is_dir()`; a `local-evil` link to an out-of-root directory declaring `conflicts_with alpha` was returned. Both loops now call `_is_scannable_skill_entry`: a symlink is followed only when its name starts with `local-` and its realpath is a directory inside the skills root or a root in `SPECKIT_PRIVATE_SKILL_ROOTS`. This also makes the Python side obey D4's "no other link is followed", which the original ADR-002 text did not spell out for these two readers. Four `T246-TRUST` tests cover it; the suite goes from `pass=72` to `pass=76`.
- Scope extension, P1-2 (D5): `derive-command-bridges.cjs` reads `command-metadata.json` from every entry of the skills root and writes the tracked bridge files, so it skips a `local-*` name first. `regenerate-skill-derived.cjs` lists skill roots and rewrites each `graph-metadata.json`; its `Dirent.isDirectory()` already refused a symlink, but a real `local-*` folder would have been rewritten, so `listSkillRoots` skips the name too. Neither script has a unit seam; a probe folder `.skilled/skills/local-zzprobe/command-metadata.json` kept `derive-command-bridges.cjs --check` at `fresh` with 19 entries, and without the skip the same probe made it `stale` with 20.
- Scope extension, P2-6: `watcher.ts`, `projection.ts` and `advisor-status.ts` skipped a symlinked private skill, so an edit to a private skill triggered no rebuild, the fallback projection missed it and the status count disagreed with the graph scan. All three now follow a trusted top-level `local-*` link through the shared check; each has a test. No file from P2-6 is left as an exception.
- P2-5: the helper rejects a link to the skills root itself (it would make a scan re-enter its own tree) and tests the parent step as `..` or `..` plus a separator, so a folder named `..dotted` inside the root is accepted. A declared external root may still be linked directly. Three tests added; the helper suite is now 8 tests. `dist/` is gitignored; it was rebuilt locally.
- P2-9: the trusted roots are resolved once per scan, and only when the first `local-*` link is met, by `createPrivateSkillLinkCheck`. NFR-P01 is reworded to say so.
- P2-8: the graph-scan link fixture moved out of `node_modules`, to `.cache`. The review suggested `.private/`, but the graph scan walks dot folders, so a skill placed there would be indexed without the link and the test would prove nothing. `.cache` is skipped by name, so only the link reaches it.
- P2-4: `review.md` line 90 now reads "If the route is UNKNOWN or ambiguous", matching `code.md` lines 66 and 73 and REQ-014. The `.claude` twin was copied; the Codex, Pi and Hermes mirrors were regenerated. AC-032 says the same.
- P2-1, P2-2: AC-010 counts six skip-scan and five follow-scan tests. AC-012 drops the historic-commit proof block and keeps the semantic compare.
- P2-7: the phase 002 `implementation-summary.md` Deviations table and `graph-metadata.json` were reconciled in this phase's working tree, not in phase 002's commit. The Deviations table records that T103 closed at commit time, that the compiled graph was regenerated by a follow-up commit, and that three push gates were authorized; the `graph-metadata.json` change is its re-derived metadata. Both ride in this phase's commit set.
- P2-10: `plan.md` numbered the Python reader as ADR-006 and the phase-4 link as ADR-007, while `decision-record.md` holds the reader under ADR-002 and the link under ADR-006. `plan.md` now follows the decision record, and `implementation-summary.md` carries a Status field.
- New criteria: AC-036 (Python trust), AC-037 (the two generators) and AC-038 (watcher, projection, status). Counts after the follow-up: containment helper 8, advisor-status 22, Python `pass=76`.
- Full runtime vitest run after the follow-up: `Test Files  6 failed | 140 passed (146)`, `Tests  9 failed | 1202 passed | 8 skipped`. None is attributed to this phase. The ambiguity slice is the recorded baseline red. The three `settings-driven-invocation-parity` hook-count cases (expected 7, 2 and 2 hooks) concern hook settings, not the advisor. The parity case reports one regression beyond its accepted list (`rr-iter3-151`, a deep-loop prompt) and fails identically with `lexical.ts` restored to `HEAD`. The two `skill_graph_scan` job cases time out at 180 seconds and fail identically with the five runtime files this follow-up touched (`freshness.ts`, `skill-graph-db.ts`, `watcher.ts`, `projection.ts`, `advisor-status.ts`) restored to `HEAD` and the build redone. `cli-exit-taxonomy` and `daemon-watcher-new-root-ingestion` failed only under full-suite load (daemon launcher exit 1 and a chokidar timing case) and pass when run alone (6 and 5 tests).

### Review follow-up amendments, round 2 (2026-10-24)

A second independent review found one P1 and several P2 findings. The P1 enforces frozen decision D4, so the fix extends scope to the files below. Each extension sits under ADR-002 and is added to `spec.md` section 3. The scanner inventory there is now the authority for how many scans exist. The earlier counts of seven, and the split of three including and four excluding, describe the plan as first written.

- P1-A (D4): `skill_advisor_runtime.py` `_discover_skill_files` used `glob.glob("*/SKILL.md")`, which follows any symlinked top-level folder. Its records reach `get_skills` and the `--force-local` and native-unavailable paths of `main()`. Discovery now scans the skills root and keeps an entry only through `is_scannable_skill_entry`: a real folder, or a `local-*` link inside a trusted root. A hidden folder is still skipped, as the glob skipped it. The containment check moved into the runtime module, because `skill_advisor.py` loads that module and the reverse import would be circular. `skill_advisor.py` calls it through `_runtime_module` and no longer holds a copy of the rule. Six Python tests cover it: an untrusted `local-*` link, a trusted one, a non-local link (both into the skills root and outside it), a real folder, a declared external root and the single root resolution. With the old glob swapped in, three of the discovery cases failed.
- P2-1: the Python check resolved `realpath(SKILLS_DIR)` and split the environment variable on every call. `create_private_skill_link_check` now returns a closure that resolves the trusted roots at most once, and only when the first link is met, mirroring `createPrivateSkillLinkCheck`. A test counts one resolution for a scan that meets two links. This satisfies NFR-P01 for Python.
- P2-2 (D5): `generate-router-intent-signals.cjs` `hubs()` scanned the skills root with no `local-*` skip and `write()` rewrites each hub's `graph-metadata.json`. `hubs()` now skips the name before its first probe. The script cannot be required, so its test runs a copy of it inside a temporary tree. With the skip removed the test failed.
- P2-3 (D4): `skill_graph_compiler.py` and `derive-command-bridges.cjs` followed any non-`local-*` top-level symlink. Both now skip a symlinked top-level entry. Before changing behavior, `git ls-files -s .skilled/skills | awk '$1==120000'` printed 39 tracked symlinks, with path depths of 5, 6, 7 and 8 only, and the filter for depth 3 (a top-level skill folder) printed 0. No tracked top-level skill is a symlink, so the change alters no tracked behavior.
- P2-5: `derive-command-bridges.cjs` ran `main()` on require and exported nothing, so round 1 proved its skip by hand with a probe folder. `metadataEntries` now takes the skills root and is exported, and `main()` runs only as the entry point. The probe-folder proof in the round 1 amendment is superseded. `command-bridges-drift-guard.vitest.ts` gains one case that builds a temporary skills root with a real folder, a `local-*` folder and a linked folder, and expects only the real one. `regenerate-skill-derived.cjs` `listSkillRoots` now takes the skills root, and `skill-derived-regenerator.test.cjs` gains one case with a `local-*` folder. Each case failed with its skip removed.
- P2-6: the cross-skill edge loader (`runtime/lib/cross-skill-edges/metadata-loader.ts`) has its own recursive discovery. It reads through `Dirent.isDirectory()`, so it never follows a symlink and the link question does not arise. It does read a real `local-*` folder, and `propagateInboundEnhances` in apply mode writes a candidate's `graph-metadata.json`. That is a tracked write: an applied edge from a private skill would put its name into a tracked skill's metadata. The loader now skips a top-level `local-*` folder, and one vitest case proves it, failing with the skip removed. The skip is top level only, so a nested folder that merely starts with the prefix is still read.
- P2-4, accepted in round 2 and reversed in round 3: `regenerate-skill-derived.cjs --root <path>` first bypassed the `local-*` skip on the reading that an operator path is deliberate. D3 and D5 allow no such exception, so round 3 makes `--root` refuse a private skill (see the round 3 amendment below). The skip now governs `--all` and `--root` alike.
- P2-11: the phase `goal.md` decision ids D1 to D6 are local to that file and differ from the parent's D1 to D7. They are not renumbered. Phase D2 restates parent D4 (containment) and phase D3 restates parent D5 (skip before the first probe), and phase D1 is the split that applies both.
- P2-12: `private-skill-target.ts` refuses a link that resolves to the skills root itself, while a declared external root may be linked directly. This narrows parent D4, which says a link must resolve inside the skills root. It is deliberate, because such a link would make a scan re-enter its own tree. The Python mirror applies the same refusal.
- P2-7: every occurrence of "seven scans, three include and four exclude" in `spec.md`, `plan.md`, this record, `implementation-summary.md`, `acceptance-criteria.md` and `goal.md` now says sixteen scans, eight including and eight excluding. The list is the scanner inventory in `spec.md` section 3, and AC-039 prints the files holding them.
- P2-8: `acceptance-criteria.md` AC-012 no longer holds the three `git log -1 --format=%H -- ...skill-graph.json` commands. They read the last commit that touched the file, which is history rather than this phase's output. The semantic compare against `HEAD` is the only proof.
- P2-9: the numbering note on ADR-006 said the decision is ADR-007 in `plan.md`. `plan.md` has no ADR-007 and numbers this decision ADR-006, so the note now says that.
- P2-10: `private-skill-target.vitest.ts` has eight `it()` cases, so the Files Changed row in `implementation-summary.md` says eight.
- Adjacent, recorded and not changed: `command-bridges-drift-guard.vitest.ts` `metadataProjection` lists every top-level skill folder including `local-*` ones, so it would report drift on a checkout whose private skill carries a `command-metadata.json`. No such file exists today. It reads the live tree and was outside the findings.
- New criteria: AC-039 (the scanner inventory and the Python discovery), AC-040 (the symlink skip in the compiler and the deriver) and AC-041 (the three added skip cases). Counts after round 2: Python `pass=83`, cross-skill edges 15, command-bridges drift guard 5.

### Operator ruling: pre-existing advisor suite failures fixed before commit (2026-10-24)

The operator ruled that the seven failing runtime cases must be fixed before this phase is committed. They fail identically on a clean copy of `origin/main` at `b2a1663ee9`, so none comes from this phase, and this ruling supersedes the earlier amendment lines that call the ambiguity slice "red by design" and the full run "not attributed to this phase". Each case below was reproduced alone, traced to its mechanism and fixed at the producer unless the test's own expectation was stale. No timeout was lengthened, no retry added and no case skipped.

- Hook counts, three cases in `tests/hooks/settings-driven-invocation-parity.vitest.ts` (stale expectation). The committed `.claude/settings.json` gained hooks after the test last matched. Counted at each commit, `b830fd0276` (session relaunch loop) took `UserPromptSubmit` from 2 to 3 and `Stop` from 2 to 3, and `8ebd4b76d6` (handoff note outside the loop) took `SessionStart` from 7 to 8. `PreCompact` stayed at 1. `EXPECTED_HOOK_COUNTS` now reads 3, 1, 8 and 3, and the header contract no longer says `hooks[]` is a single-element array. The settings file is untouched.
- Python and TypeScript parity, `tests/parity/python-ts-parity.vitest.ts` (test read the real clock). The derived lane discounts each skill by the age of its derived block against the current time, in `lib/scorer/lanes/derived.ts` through `applyAgeHaircutToLane`. The pinned counts (107 and 100) were derived on 2026-10-03, and on the real clock of 2026-10-24 the committed files at `b2a1663ee9` score `tsAlsoCorrect=99`, because `rr-iter3-151` ("Kick off another deep-review wave for the packet docs...") then ranks `sk-doc` over `system-deep-loop` by 0.003 in the test's no-graph regime. An archive of `f8afb2def6e` on the same clock scores 98. Proof: an archive of `f8afb2def6e` (the commit that wrote the numbers) fails today and passes with the date fixed at 2026-10-03, and an archive of `b2a1663ee9` passes with the date fixed at any of 2026-10-03, 2026-10-07 and 2026-10-11 and fails at 2026-10-24. The commit `5a7da044a3` already fixed this class of drift for the baseline ratchet by scoring at the capture instant. The parity test now does the same at `2026-10-03T00:00:00Z` through `vi.useFakeTimers({ toFake: ['Date'] })`. The expectations and the accepted-regression ledger are unchanged.
- Ambiguity slice, `tests/scorer/ambiguity-slice.vitest.ts` (same cause, not red by design). The slice read the real clock while `scorer-eval-baseline.json` (captured 2026-10-11 by `da194dccdb`) was captured at a fixed instant, so `17/24` against `19` measured the calendar. The earlier amendment calling it "red by design" was a misreading. With the clock pinned to the baseline's `capturedAt`, the live count is `19/24`, equal to the baseline, with this phase's scorer changes in the tree. The committed baseline is correct and the scorer needed no change. The slice and the ratchet now score at the same instant.
- Scan job cases, two cases in `tests/skill-advisor-cli-job-semantics.vitest.ts` (a producer defect, exit 128 means the 180 second shim timeout killed the CLI). The test scope runs the launcher with `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0`, so no embedding server exists, and the fresh database has no active embedder pointer, so `refreshSkillEmbeddingsLegacy` asks the provider once per skill. Each ask reaches `HfLocalProvider.waitForReady` in `.skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`. The launcher hands its daemon a `MEMORY_DB_PATH` inside the advisor database directory (`advisorDbPath()` in `.skilled/bin/system-skill-advisor-launcher.cjs`), so the launcher's own live owner lease `.skill-advisor-owner.json` counted as spawn authority and every ask waited the full 45 second readiness timeout for a server the disabled launcher would never start. Fourteen skills at 45 seconds is far over 180. Observed: the CLI idle on the daemon socket, the daemon idle with no network connection, `advisor_status` answering over the socket and `skill_graph_scan` never answering. Two fixes. First, `hasLiveHfSpawnAuthority` counts the advisor owner lease only when the launcher supervises the model server (the flag empty or `1`, the launcher's own rule), so a disabled launcher fails each ask after the 5 second grace, with `advisorLauncherSupervisesModelServer` and `hasLiveAdvisorOwnerLease` as the split helpers. Second, the legacy refresh path gains the outage short-circuit the adapter path already had (`EMBEDDING_BACKEND_OUTAGE_STREAK`, 3 straight failures), so a dead backend costs three asks, not one per skill. Measured: the scan CLI went from 180 seconds and killed, to 78 seconds with the first fix alone, and the three-case file now passes in about 36 seconds in total. Two new tests: `fails fast on a live owner lease when the launcher does not supervise the model server` in `hf-local-client.vitest.ts` (red with the supervision check removed) and `tests/skill-graph-embedding-outage.vitest.ts` (a happy path and a dead-backend case that asserts three calls).
- Not in scope and unchanged. `cli-exit-taxonomy` and the rebuild wall-time case failed once under full-suite load and passed on re-run, which is the same note as the earlier amendment.
- Operator note, not changed here. Because the derived lane really does discount by age, the no-graph scorer today ranks `rr-iter3-151` to `sk-doc` by 0.003. That is the product working as designed on older derived blocks, and regenerating the derived blocks (`regenerate-skill-derived.cjs`) is the fix if the operator wants it, in a separate change.

### Review follow-up amendments, round 3 (2026-10-24)

A third independent review found one P1 and five P2 findings. The P1 was verified in the code. Nothing here changes a frozen decision. Round 3 reverses one round 2 acceptance (P2-4) because it contradicted D3 and D5.

- P1, embedding refresh outage (class-of-bug, both refresh loops): once the three-failure streak tripped, the outage branch ran before the up-to-date check, so every later row was counted failed and lost its stored vector, including rows that were current and never needed the backend. The legacy loop wrote `null` for the vector, model id and hash, and the adapter loop (the same order at `HEAD`) deleted the row. Both loops now read the description, apply the empty-description rule and the up-to-date check first, and only then test the outage flag. During an outage a row that needed embedding is counted failed and gets exactly what a failed ask writes in that loop: the legacy loop writes a null vector with the model id and content hash, the adapter loop deletes the vec row. A current row is skipped as before, an empty description keeps its existing handling. `tests/skill-graph-embedding-outage.vitest.ts` gains two cases with six pre-embedded skills, four made stale and two left current: after the outage trips, the two current rows keep their vector and the four stale rows hold none, on the legacy column and on the `vec_3` table (the adapter case mocks `getAdapter` and sets the active embedder pointer). With the old order both cases failed (`failed: 6, skipped: 0` against `failed: 4, skipped: 2`).
- P2-1 (D3, D5): `regenerate-skill-derived.cjs --root` rewrote a private skill when given a `local-*` path, which contradicts parent D5 and phase D3 and the "Exclude" row of the `spec.md` scanner inventory. `--root` now refuses a path whose own name, or whose real target's name, starts with `local-`, with an input error and exit code 2, before any read or write. The round 2 line that accepted the bypass is replaced by a pointer to this outcome. The regenerator test spawns the script on a `local-private` folder and on a differently named link to it, expects exit 2 and an unchanged file, and failed with the guard removed (`0 !== 2`).
- P2-2, spawn authority: `hf-local.ts` read the consumer's own `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, but the launcher that owns the lease may run with another setting. The launcher's `buildOwnerLease` now writes `supervisesModelServer`, set from the launcher's own `isModelServerEnabled()` (empty or `1` on, anything else off, so the flag rule is the launcher's alone and is no longer duplicated). `hasLiveAdvisorOwnerLease` reads the field from the lease: `false` is no authority, `true` or a lease without the field (an older launcher) counts as before, so an upgrade cannot newly skip a wait. The respawn lock and pid file checks are unchanged, and `advisorLauncherSupervisesModelServer` is removed because nothing else called it. The field name is declared in both packages, so `shared/tests/model-server-constants.test.ts` gains a drift check beside the lease file name check. This supersedes the flag-reading rule in the operator ruling amendment below. Tests: three lease cases in `hf-local-client.vitest.ts` (true, false, absent) and five in `launcher-model-server-default.vitest.ts` (flag unset, empty, `1`, `0`, `off`) that acquire a real lease and read the field back. With the false check removed the false case failed, and with the field not written all five launcher cases failed. Callers: `hasLiveAdvisorOwnerLease` has one caller, `hasLiveHfSpawnAuthority`, which has one caller in `waitForReady`. The lease is written only by `buildOwnerLease` (called from `acquireOwnerLeaseFile` and the dead-socket respawn path), kept across heartbeats by the spread in `refreshOwnerLeaseFile`, and read only by `hf-local.ts` and the launcher's own `readOwnerLeaseFile`, whose shape check ignores extra fields.
- P2-3, clock pins: the pins in `ambiguity-slice.vitest.ts` and `python-ts-parity.vitest.ts` stay. One new case in `lifecycle-derived-metadata.vitest.ts` applies `applyAgeHaircutToLane` to one block at two explicit dates and expects the later date to score lower, so the calendar-driven behavior keeps its own coverage.
- P2-4a: `test_skill_advisor.py` gains a `.hidden/SKILL.md` fixture and `T246-DISCOVER-007`, which expects the hidden folder's skill to be absent. With the hidden-folder skip removed from `_discover_skill_files` the case failed (`records=['alpha', 'hidden-skill', 'local-beta']`). Python goes from `pass=83` to `pass=84`.
- P2-4b: the "many links against one resolution" case in `private-skill-target.vitest.ts` now wraps `realpathSync` in a pass-through spy and counts calls on the skills root: none before the first link, one after three links through `createPrivateSkillLinkCheck`, and two after two calls to the per-link helper. It failed (`expected 3 to be 1`) when the check resolved the roots on every link. The helper's public behavior is unchanged.
- P2-5: AC-037 described a probe folder its proof never created. It now cites the drift-guard test and the regenerator test as its proof. The probe-folder sentence in the round 1 follow-up amendment is superseded by the round 2 automated case and by this rewrite.
- New criteria: none. AC-036, AC-037 and AC-039 were updated. Counts after round 3: Python `pass=84`, advisor runtime `Tests  1223 passed | 8 skipped (1231)`, spec-kit embedders `Tests  104 passed | 2 skipped (106)`.

### Review follow-up amendments, round 4 (2026-10-24)

A fourth independent review found no P0 or P1 and three P2 findings plus a documentation nit. The scope stays inside the files already listed in `spec.md` section 3.

- P2-1: `buildOwnerLease` wrote `supervisesModelServer` from `isModelServerEnabled()` alone, but the launcher starts the model server only when the flag is on and the supervision library loaded (`hfControl` is null otherwise). A launcher that skipped the spawn therefore advertised a server that would never come, and the client waited for it. The field is now `isModelServerEnabled() && Boolean(hfControl)`, so the lease equals the start decision. An explicit `1` with the library absent makes the launcher throw at start, so no lease outlives that case and `false` is the consistent value. The launcher copies into a temporary `bin/` with no `lib/` directory and loads without the supervision module, which is the shape of a package that shipped without it, so the test needs no mocking. `launcher-model-server-default.vitest.ts` gains two cases (flag unset and flag `1`, library absent) that expect `false`. Both failed with the old expression.
- P2-2: the lease cases did not unset `SYSTEM_SKILL_ADVISOR_DB_DIR`, which `resolvedAdvisorDbDir()` prefers over the configured directory, so a value in the shell redirected the lease away from the temp directory. The block now deletes the variable before each case and restores the saved value after it. The resolver reads no other environment variable.
- P2-3 (D3): the `--root` guard in `regenerate-skill-derived.cjs` compared the name against `local-` case-sensitively, and a case-insensitive disk resolves `LOCAL-foo` to the same directory as `local-foo`. `isPrivateSkillPath` now lowercases both the typed basename and the real target's basename before the prefix test. The regenerator test adds a `LOCAL-Shouted` folder and expects `isPrivateSkillPath` true, exit 2 and an unchanged file. It failed with the case-sensitive test. The `listSkillRoots` filter keeps its case-sensitive prefix and is outside this round.
- Doc nit: `implementation-summary.md` listed the third review before the second. The order is now round 1, second, third, fourth.
- New criteria: none. Counts after round 4: advisor runtime `Tests  1225 passed | 8 skipped (1233)`.
