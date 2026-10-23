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
    last_updated_at: "2026-10-23T13:10:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored six decision records for the phase"
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
## ADR-002: Three scans include `local-*`, four exclude it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D1-D7 decisions |

---

<!-- ANCHOR:adr-002-context -->
### Context

One directory, `.skilled/skills/`, feeds both the local advisor and four tracked-artifact writers. A single policy cannot serve both: the advisor must see the private skill, and the tracked graph, Hermes mirror, CI gate and doctor report must not. The Python conflict-declaration reader is a fifth reader; the research synthesis flagged it as a gap because it scans every top-level skill directory with no filter.

### Constraints

- The local graph already indexes a trusted `local-*` skill.
- The Python reader returns an in-memory map and writes no file.
- The tracked writers must not read a private byte, not merely avoid writing one.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the graph scan, the source signature and the Python conflict-declaration reader include a `local-*` entry; the compiler, the Hermes sync, the CI root gate and the doctor panel skip it by name.

**How it works**: the two TypeScript follow paths use ADR-001's helper. The Python reader keeps its `os.scandir` inclusion and gains a characterization test, because the graph it cross-checks already contains the private node. The four tracked writers test `entry.name.startsWith('local-')` before any filesystem probe.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three include, four exclude, chosen per artifact** | Each consumer gets the rule its output needs | Seven decisions to document and test | 9/10 |
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
- Seven scan behaviors to keep aligned. Mitigation: the plan's affected-surfaces table names each one and its AC.

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
| 3 | **Sufficient?** | PASS | Seven scans, each with one test or a recorded screen |
| 4 | **Fits Goal?** | PASS | The phase's purpose is exactly this split |
| 5 | **Open Horizons?** | PASS | A new reader has a documented pattern to follow |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The graph scan, the signature and the Python reader include a trusted private skill.
- The compiler, Hermes, CI gate and doctor panel skip the name.
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
- One less file in a phase that already touches 23.
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
