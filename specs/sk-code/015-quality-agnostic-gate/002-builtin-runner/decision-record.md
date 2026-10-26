---
title: "Decision Record: Phase 2: builtin-runner"
description: "The decisions this phase relies on: the runner's engine, roots, scope, verdict and surfaces, the phase boundary, six operator decisions taken with the design's default and two decisions taken during the build."
trigger_phrases:
  - "builtin runner decision record"
  - "quality runner ADR"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/002-builtin-runner"
    last_updated_at: "2026-10-26T03:35:41Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added ADR-017 for --no-run and ADR-018 for the empty generated list"
    next_safe_action: "Confirm ADR-011 to ADR-018 at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-builtin-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: builtin-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

This record holds the decisions that Phase 2 relies on. The requirements these decisions serve are in [spec.md](spec.md), the steps are in [plan.md](plan.md), and the proof that closes them is in [acceptance-criteria.md](acceptance-criteria.md). ADR-001 to ADR-010 are design decisions with a settled default. ADR-011 to ADR-016 are operator decisions. The operator gave a standing instruction to build autonomously and to take each open decision at the design's recommended default. Those six carry the status line the instruction names, so the operator can confirm or reverse each one at program end. ADR-017 and ADR-018 settle two questions the build met that no document answered, each with the most conservative option, and they carry the same status line. Labels such as D6 in the text refer to the synthesized quality design. That design is not committed in this tree, so each ADR states its decision in full.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Node runner over a Python hygiene engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-001-context -->
### Context

The framework already runs Node. The post-edit router is `.cjs` (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:15-23`). The setup battery is `.cjs` (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:1`). CI already runs `node --test` (`.github/workflows/sk-code-script-tests.yml:48`). The hygiene engine is Python. CI calls it with `python3` (`.github/workflows/comment-hygiene.yml:42`), and pre-commit calls it directly (`.skilled/scripts/git-hooks/pre-commit:158`).

### Constraints

- Two engines that check the same rule drift apart, and the engine that blocks must be the one that is tested.
- A Python runner would run nothing at all on a machine without `python3`.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The runner is a Node entry point. The hygiene engine stays Python, and the runner calls it once per run with `--json`.

**How it works**: The runner spawns `python3 -B -I check-comment-hygiene.sh --json <files>` as an argv array. One engine decides what blocks in the author gate, CI and pre-commit. A machine without `python3` still gets the runner's own sensors, and hygiene reports UNVERIFIED (REQ-016).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Node runner, Python engine (chosen)** | One blocking engine, runner works on the framework's own Node stack | Two languages in one run | 8/10 |
| Python runner, Python engine | One language, matches the engine | Runs nothing without `python3` | 5/10 |
| Node runner, Node engine | One language across the run | A second engine drifts from the one that blocks | 4/10 |

**Why this one**: It keeps one engine that blocks, and the runner stays useful where `python3` is absent.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One checker decides every hygiene result, so the author gate and CI cannot disagree.
- The runner reports UNVERIFIED rather than clean when `python3` is missing (F17).

**What it costs**:
- Two languages run in one verdict. Mitigation: argv arrays only, and one Python process per run (NFR-P02).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| This machine runs Python 3.9.6, which has no `tomllib` | L | TOML parsing reads SKIPPED_ABSENT there. The check needs no other change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The runner needs a home, and the framework already runs Node tools |
| 2 | **Beyond Local Maxima?** | PASS | A Python runner and a Node engine were both assessed |
| 3 | **Sufficient?** | PASS | One spawn per engine per run |
| 4 | **Fits Goal?** | PASS | The goal needs one verdict that does not depend on a second engine |
| 5 | **Open Horizons?** | PASS | A second engine is the drift risk the goal avoids |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `quality-gate.cjs` and `lib/run-check.cjs` are new (Step 1 and Step 2 of `plan.md`).
- `check-comment-hygiene.sh` is consumed with `--json`. Phase 1 changes it, and this phase changes nothing in it.

**How to roll back**: Revert the Phase 2 commits with `git revert`, newest first. The checker from Phase 1 stays in place, and its CI rows stay as they are.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Two roots, resolved separately

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-002-context -->
### Context

The roots are tangled today. `ceiling-report.sh` takes the repository from its own folder (`.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:153-163`). `check-dist-staleness.sh` tries the working directory, then falls back to its own repository (`check-dist-staleness.sh:94-100`). The post-edit router joins the checker path to the project folder (`post-edit-router.cjs:35-42,208`).

A compiled entry point reached through a link compares the path it was invoked with against the location it derives from its own file, finds them different, and exits 0 without doing its work (`.skilled/skills/sk-git/references/worktree-workflows.md:537-539`, `.skilled/skills/sk-git/scripts/worktree-naming.sh:470-471`). Downstream repositories reach the hub through links (`.skilled/skills/sk-code/shared/references/stack-detection.md:109`).

### Constraints

- A run in a downstream repository must read that repository's files and the hub's declarations.
- The entry point must work when the hub is reached through a symlink.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: The repository root comes from `git rev-parse --show-toplevel` in the working directory. The hub root comes from the real path of the runner file. The entry point guards its CLI with `require.main === module`, which compares module identity and never compares paths.

**How it works**: The runner resolves the repository first, then the hub. The hub's declarations are read from the hub's own files, and the repository's files are read from the repository. A symlinked hub resolves to the same hub folder as its target.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two roots, resolved separately (chosen)** | Works through links and in downstream repositories | Two resolution paths to test | 8/10 |
| Working directory for both roots (today) | One path to reason about | A link to the hub reads the wrong code | 3/10 |
| Hub path for both roots | Always reads the hub's own code | A downstream repository is checked against the wrong tree | 4/10 |

**Why this one**: The two roots answer different questions, so one resolution cannot serve both.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A downstream repository gets its own changes checked, with the hub's checklists.

**What it costs**:
- Every entry point needs both resolutions tested. Mitigation: the unit case `unit: real-path guard` covers symlinks and `..` segments (AC-010).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A symlink points at another repository's `.skilled/` tree | M | The real-path guard resolves the link before it classifies the file (`stack-detection.md:105-115`) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The sk-git rule shows the failure a link causes today |
| 2 | **Beyond Local Maxima?** | PASS | The working-directory and hub-only roots were assessed |
| 3 | **Sufficient?** | PASS | Two resolutions, no config |
| 4 | **Fits Goal?** | PASS | A foreign repository must get a verdict on its own files |
| 5 | **Open Horizons?** | PASS | The same two roots serve the config layer in Phase 3 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `quality-gate.cjs` resolves both roots and passes them to every stage.

**How to roll back**: Revert the commit that adds the entry point. Nothing else depends on the roots until Phase 4 names the runner.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Changed-line scope, the whole-file layer rule and the no-git case

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-003-context -->
### Context

CI and pre-commit scan whole files (`.skilled/scripts/git-hooks/pre-commit:145-158`, `.github/workflows/comment-hygiene.yml:36-48`). A commit that touches a file with an old comment on an unchanged line fails there anyway. A downstream repository should not be punished for comments it did not write.

### Constraints

- The author gate must not block a change for debt it did not add, unless the commit would fail in a whole-file layer anyway.
- A folder outside git has no diff, so the runner needs one rule for it.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A finding on a changed line is P0 and blocks. A finding on an unchanged line of a touched file blocks only when a whole-file layer is present, and its reason names that layer. With no such layer it is P1 debt that does not block. Outside git, every line of a named file counts as changed. A named file that does not exist exits 3 with `FILE_NOT_FOUND`.

**How it works**: The scope stage collects changed-line hunks from `git diff -U0`. The hygiene findings join those hunks by file and line. The layer probe (task T013 in `tasks.md`) says whether a whole-file layer is present.

The no-git rule is a judgment. A folder without git has no diff to compare, so the runner treats every line as new. That is the stricter reading. The operator can relax it later.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Changed-line blocks, touched-file blocks with a layer (chosen)** | Blocks only what the change adds, and matches what the commit would fail on | Two rules to explain | 8/10 |
| Whole-file scope everywhere | One rule | Old comments block unrelated edits | 4/10 |
| Changed lines only, never blocking on unchanged lines | Simplest | Hides a finding that the commit would fail on anyway | 5/10 |

**Why this one**: The gate blocks what the change would fail on, and no more.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A downstream repository sees its own new violations first.

**What it costs**:
- A touched-file finding reads P1 on a repository with no layer, so a team may ignore it. Mitigation: the verdict counts open P1 items in its summary (`spec.md` section 4, REQ-005).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A layer probe reads "present" when the hook is inert | M | The probe checks that the hook calls the checker, and `pre-commit` trust rules still apply (`.skilled/scripts/git-hooks/pre-commit:43-49`) |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a rule, the author gate blocks on debt it did not add |
| 2 | **Beyond Local Maxima?** | PASS | Whole-file and changed-line-only were assessed |
| 3 | **Sufficient?** | PASS | Two rules, both testable with F03 and F04 |
| 4 | **Fits Goal?** | PASS | The goal is a verdict on a change |
| 5 | **Open Horizons?** | PASS | ADR-014 keeps CI and pre-commit whole-file, so the rule can be revisited there |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The scope stage and the finding origin field (`changed-line` or `touched-file`) in `quality-gate.cjs`.

**How to roll back**: Revert the scope commit. The verdict then reads every finding as changed-line, which is the strictest state.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Five exit codes, a gate field and no pass value

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-004-context -->
### Context

Today exit 1 hides exit 3 (`.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:219-224`). The checker's usage error uses exit 2 (`:216-218`), and exit 2 already means that every file was skipped (`:13`). Exit 1 mixes "fix the code" with "prove or install something", and verification needs that difference. The mode still never claims a pass (`.skilled/skills/sk-code/sk-code-quality/SKILL.md:245`), and its envelope status stays advisory (`:224`).

### Constraints

- Exit codes must mean one thing each.
- No output may read as a pass, because the envelope and the mode forbid that claim.

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Five exit codes. 0 is `NO_BLOCKER_FOUND`. 1 is `BLOCKED`. 2 is `NOTHING_CHECKED`. 3 is `ERROR`. 4 is `UNVERIFIED`. The precedence is 3, then 1, then 4, then 2, then 0. The `gate` field is the only verdict word, and no output carries a pass value.

**How it works**: The runner collects every fact into the verdict and then picks the gate by precedence. The JSON keeps every fact, so a reader sees a usage error even when a P0 also fired. The checker's usage error moves from exit 2 to exit 3 in Phase 1, which the spec names as a dependency.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Five codes with precedence (chosen)** | Each code means one thing, and no code reads as a pass | Five values to document | 8/10 |
| Fold UNVERIFIED into exit 1 | Fewer codes | "Fix the code" and "prove something" share one exit | 4/10 |
| Keep the checker's codes unchanged | No change to the checker | Exit 1 hides exit 3, and exit 2 means two things | 3/10 |

**Why this one**: Each code names one next action for the reader.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A reader knows whether to fix code, prove something, or do nothing.

**What it costs**:
- Consumers must read `gate`, not only the exit code. Mitigation: the envelope renders the gate word beside the exit code (`runner-contract.md` section 4).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer treats exit 0 as a pass | H | The gate word and the advisory status both say otherwise, and `Q/SKILL.md:245` forbids the claim |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Exit 1 already hides exit 3 in the checker today |
| 2 | **Beyond Local Maxima?** | PASS | Folding and keeping the codes were assessed |
| 3 | **Sufficient?** | PASS | Five codes, one precedence list |
| 4 | **Fits Goal?** | PASS | A verdict that can be acted on needs distinct next actions |
| 5 | **Open Horizons?** | PASS | Phase 3 adds configured checks under the same codes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The exit mapping in `quality-gate.cjs`, and the table in `runner-contract.md` section 2.
- The checker's usage exit moves from 2 to 3, in Phase 1.

**How to roll back**: Revert the exit mapping commit. The checker's usage exit change is part of Phase 1, so it reverts with that phase.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The envelope keeps its schema, and the machine verdict is separate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-005-context -->
### Context

The envelope already exists (`.skilled/skills/sk-code/sk-code-quality/SKILL.md:210-222`), with `schema_version: code-quality/v1`. Its `checker_outputs` line says "or N/A" (`:217`), which the runner can now fill. The review mode reads run evidence as input, and it keeps its own severity ids (`.skilled/skills/sk-code/sk-code-review/references/review-core.md:20`).

### Constraints

- Renaming the schema breaks every reader of the envelope.
- The machine verdict needs keys the envelope does not carry, such as the check list and the coverage report.

<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: The envelope keeps the `code-quality/v1` keys, with no key added or removed. `checker_outputs` gets a grammar. The machine verdict is a separate document, `code-quality-run/v1`, printed as JSON, and the renderer copies its machine fields into the envelope.

**How it works**: The runner prints the verdict. The envelope renderer reads the verdict and writes `checker_outputs` in the fixed grammar. The judgment fields read `PENDING_AGENT_JUDGMENT` until the agent fills them.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the envelope, add a separate verdict (chosen)** | Readers of v1 keep working, and the verdict has its own schema | Two documents to keep in step | 8/10 |
| Rename to a v2 envelope | Clean break | Every reader changes at once | 3/10 |
| Only the envelope, no JSON verdict | One document | Review and the machine readers have no structured input | 5/10 |

**Why this one**: It adds the data the readers need and breaks none of them.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A reader of the envelope sees the gate and the counts in one line.

**What it costs**:
- The grammar must stay in step with the verdict. Mitigation: the renderer test in `unit: envelope` reads both.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The verdict schema changes after Phase 3 adds config | M | A key change becomes a new schema id. The v1 keys do not move |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The envelope has blank fields that only a runner can fill |
| 2 | **Beyond Local Maxima?** | PASS | A v2 rename and an envelope-only design were assessed |
| 3 | **Sufficient?** | PASS | One added document and one grammar |
| 4 | **Fits Goal?** | PASS | The verification handoff needs machine fields |
| 5 | **Open Horizons?** | PASS | A later schema can read the same keys |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `runner-contract.md` sections 3 and 4 define the verdict and the grammar.
- The envelope section of `sk-code-quality/SKILL.md` names the grammar and the PENDING rule.

**How to roll back**: Revert the renderer commit. The envelope keeps its v1 keys throughout, so the readers do not change.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Checklists are declared by surfaces and read through the shared reader

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-006-context -->
### Context

`declaredSurfaces` is exported from `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:773`. It orders hub-specific, outside and fallback surfaces (`:522-539`, `stack-detection.md:42-50`), and each entry carries its `packet` or `skillId` (`:516`, `:527`). `surfaceEntry` merges the three marker kinds into one list (`:496-503`).

The registry compiler validates `surfaceDetection` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:250-278`). The metadata gate rejects unknown top-level keys (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:463`) and allows `surface_detection` by name (`:87`). It skips `local-*` folders (`stack-detection.md:103`). The shared folder ships reference files only (`.skilled/skills/sk-code/shared/README.md:26`). No tracked artifact may name a `local-*` skill (`.skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md:16`).

### Constraints

- A hub's declarations live in its registry, beside `surfaceDetection` (`.skilled/skills/sk-code/mode-registry.json:78-84`).
- The shared folder cannot hold a script, so the reader stays where it is.

<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Checklists are declared as `quality.checklists` rows. Each row holds a selector (`paths`, `extensions` or `contentMarkers`) and a `file`. A hub surface declares its rows in its registry entry, beside `surfaceDetection`. `sk-code-ci` has no `surfaceDetection`, so its rows apply by path alone. The runner reads the rows through `declaredSurfaces`, which keeps the three marker lists apart for each surface. The envelope names a private surface by its label only.

**How it works**: The compiler validates each `quality` block (`QUALITY_DECLARATION_INVALID`). The reader returns each surface with its per-kind lists. A row joins for each file whose resolved surfaces include its surface, and the selector narrows it further.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Declarations in the registry, read by the shared reader (chosen)** | One source per hub, and the reader already exists | The registry grows a block per surface | 8/10 |
| A `shared/scripts/surface-detect.cjs` reader | Its own file | `shared/` ships reference files only | 4/10 |
| A separate checklist config | Keeps the registry small | A second source of truth beside `surfaceDetection` | 5/10 |

**Why this one**: The declaration sits beside the marker it depends on, and one reader serves the runner.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Adding a surface's checklist needs one registry edit, and the compiler checks it.

**What it costs**:
- The metadata gate needs its own change for outside skills, which is Phase 5. Mitigation: outside rows are not read in this phase, and F15 covers them later.
- The advisor plugin keeps its own copy of the reader (ADR-016), so two readers exist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A registry edit changes what the advisor routes | M | `compiled-route-sync.cjs --check` runs after each registry edit (REQ-011) |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The runner has no checklist source without a declaration |
| 2 | **Beyond Local Maxima?** | PASS | A shared script and a separate config were assessed |
| 3 | **Sufficient?** | PASS | Two rows of schema, one reader extension |
| 4 | **Fits Goal?** | PASS | Repository and surface checklists must come from the framework's own declarations |
| 5 | **Open Horizons?** | PASS | Outside skills join in Phase 5 through the same row shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `mode-registry.json` gains `quality.checklists` for SKILLED and `sk-code-ci`.
- `registry-compiler.cjs` gains `QUALITY_DECLARATION_INVALID`.
- `router-replay-lib.cjs` gains the per-kind lists in `surfaceEntry`, and the exports stay the same.

**How to roll back**: Revert the three commits in the order they landed. Then run `compiled-route-sync.cjs --check`.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The dist adapter runs per file, for declared generated paths only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-007-context -->
### Context

The per-file mode never rebuilds (`.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:204-212`). Auto-rebuild is on at session start, and its switch is at line 139 (`:134-140`). Four runtime hooks depend on that self-heal: `.claude/settings.json:168`, `.codex/hooks.json:37`, `.cursor/hooks.json:26` and `.devin/hooks.v1.json:23`.

In per-file mode the script exits 0 on every path (`:208-213`). The banner text is the only signal (`print_stale` and `print_error`, `:122-133`, and `surface_result`, `:169-175`). The script also returns silently when the `dist-freshness` switch is off (`:60`, `:183-184`), so silence does not prove a file is current.

### Constraints

- The session-start self-heal must not change, because four runtimes depend on it.
- The runner must never read silence as clean.

<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: The runner calls `check-dist-staleness.sh <file>` only for generated paths that a declaration names. It sets `SPECKIT_DIST_AUTO_REBUILD=0` and reads the banner. Empty output with no stderr and the switch on is `RAN_CLEAN`. A `STALE DIST WARNING:` banner is `RAN_FAIL` at P1. A `DIST FRESHNESS CHECK ERROR:` banner, any stderr, or a silent exit with the switch off is `ERROR`. The session-start self-heal stays unchanged.

**How it works**: The adapter reads the switch the same way the script does, and it reports `SKIPPED_BY_FLAG` when the switch is off. An unknown stdout line counts as `ERROR`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per file, declared paths only, rebuild off (chosen)** | No writes during a gate, and the self-heal stays | The banner parse must track the script's output | 8/10 |
| Flip the default to opt-in `--rebuild` | Explicit | Changes all four runtimes without notice | 3/10 |
| Run `--all` on every gate | Covers every package | Rebuilds stale packages, which writes files during a gate | 2/10 |

**Why this one**: It answers the per-file question without writing files or changing other runtimes.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- A stale generated file reads as a P1 finding, and the gate writes nothing.

**What it costs**:
- The adapter depends on the banner text. Mitigation: unit case `unit: dist adapter` pins each banner prefix (AC-025).
- No fixture drives the adapter end to end in this phase. The design has no fixture for it. Phase 3 adds the first declared generated path, so its fixture belongs there.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The checker changes its banner text | M | An unknown line reads as ERROR, never as clean |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A generated file can drift without a gate catching it |
| 2 | **Beyond Local Maxima?** | PASS | Opt-in rebuild and `--all` were assessed |
| 3 | **Sufficient?** | PASS | One call per declared path, with the switch set |
| 4 | **Fits Goal?** | PASS | The goal reports drift without changing files |
| 5 | **Open Horizons?** | PASS | Phase 3 adds declared paths, and their fixture |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- The dist adapter in `quality-gate.cjs`, with its banner table in `runner-contract.md` section 8.

**How to roll back**: Revert the adapter commit. The session-start hooks never change, so they keep their behavior.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Syntax follows the shebang before the extension

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-008-context -->
### Context

This repository ships Python programs with a `.sh` extension. `check-comment-hygiene.sh` begins with `#!/usr/bin/env python3` (`.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1`). Running `bash -n` by extension would raise a false P0 on that file. `py_compile` writes `__pycache__`. A plain `.js` file may hold JSX or Flow, so a parse error there is not proof of a fault.

### Constraints

- The parse must not write files.
- A plain `.js` parse failure must not block by itself.

<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: The language follows the shebang first and the extension only when no shebang exists. Python parses with `ast.parse` in one `python3 -B -I` process. Shell parses with `bash -n`. `.mjs` parses with `node --check`. CommonJS compiles in-process with `vm.Script` and does not run. Plain `.js` gives a heuristic finding that does not block.

**How it works**: The syntax floor reads the first line for `#!`, maps it to a language, and runs the matching parser. YAML and TOML run only when a parser imports.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shebang first, then extension (chosen)** | Matches what the file runs as | One more read per file | 8/10 |
| Extension only | Simplest | Raises a false P0 on `.sh` Python programs | 3/10 |
| `py_compile` for Python | Standard tool | Writes `__pycache__` | 4/10 |

**Why this one**: It parses each file as the interpreter reads it, and it writes nothing.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A Python program named `.sh` passes, and a broken bash script fails.

**What it costs**:
- One more file read per file. Mitigation: the read is the first line only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A `.js` file holds JSX and the heuristic misreads it | L | The heuristic does not block, and F18 pins that |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The repository ships Python under `.sh` names |
| 2 | **Beyond Local Maxima?** | PASS | Extension-only and `py_compile` were assessed |
| 3 | **Sufficient?** | PASS | One first-line read and one parser per language |
| 4 | **Fits Goal?** | PASS | The gate must be honest on this repository |
| 5 | **Open Horizons?** | PASS | A new language is one row in the map |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- The syntax floor in `quality-gate.cjs`, with fixtures F13 and F18.

**How to roll back**: Revert the syntax commit. Hygiene still runs, and the parse findings disappear with it.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: No console.log sensor and no commented-out-code sensor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-009-context -->
### Context

CLI scripts print with `console.log`, so a sensor would flag correct output. Commented-out code needs judgment, because an example in a comment can be valid documentation. The floor already lists "No commented-out code" as a P0 item (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:81`).

### Constraints

- A sensor must not flag output that is correct.
- The judgment items must reach the agent, not disappear.

<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: Neither has a sensor in this version. Both stay in `judgment_required`, and the agent checks them against the floor.

**How it works**: The verdict lists `judgment_required` as a fixed array. The envelope renders it as `PENDING_AGENT_JUDGMENT` until the agent answers each item.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Judgment only (chosen)** | No false positives from output or examples | The agent does the check | 8/10 |
| A heuristic sensor for each | Automatic | Noise on correct CLI output and documentation | 4/10 |

**Why this one**: A wrong block costs more trust than a missed item, and the agent owns the judgment.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- The verdict carries no output-style false positives.

**What it costs**:
- Commented-out code depends on the agent. Mitigation: the item is listed in every verdict.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The agent skips the judgment list | M | The envelope keeps the PENDING fields, and the verification handoff reads them (`workflow-verify.md`) |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The judgment items exist in the floor |
| 2 | **Beyond Local Maxima?** | PASS | Heuristic sensors were assessed |
| 3 | **Sufficient?** | PASS | A list, no code |
| 4 | **Fits Goal?** | PASS | The goal is an honest verdict |
| 5 | **Open Horizons?** | PASS | A sensor can be added later as a new rule id |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- The `judgment_required` array in the verdict, with its items in `runner-contract.md` section 3.

**How to roll back**: Not needed. A sensor is an addition, so it can be added without reverting anything.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Phase 2 runs built-in checks only, and `--config` waits for Phase 3

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-010-context -->
### Context

The design puts config discovery, configured checks and suggestions in Phase 3. The design's CLI section lists `--config`, which needs that discovery. `run-check.cjs` (argv, timeout and the content-hash guard) belongs to Phase 2 because the built-in hygiene call goes through it. The design's Phase 1 scope lists "the two CI workflow rows" without naming them. The `node --test` row needs this phase's test folder, which does not exist before this phase.

### Constraints

- Phase 2 must not read repository config or run a repository command.
- A spawn is a spawn, built-in or not, and the same guard applies to it.

<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: Phase 2 runs built-in checks only. It reads no repository config. It rejects `--config` with a usage error and exit 3. Each spawn, including the built-in hygiene call, goes through `run-check.cjs` with an argv array, a timeout and the content-hash guard. The `node --test` CI row lands in this phase (REQ-024), and Phase 1 adds only its shell suite rows.

**How it works**: Configured checks, suggested checks and the `--config` flag arrive in Phase 3 under the same spawn module. The mutation guard for configured commands is tested with F08 in Phase 3.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Built-in only, `--config` rejected (chosen)** | Keeps trust work in Phase 3, and Phase 2 stays one size | The CLI section of the design is partly deferred | 8/10 |
| Full CLI with a config layer in Phase 2 | Matches the design's CLI section at once | Phase 2 grows past size L and mixes trust work into it | 4/10 |
| Built-in only, `--config` absent | No usage error to test | The flag disappears from the documented CLI | 5/10 |

**Why this one**: The config layer carries the trust boundary, so it lands with its own tests in Phase 3.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- Phase 2 runs no command that a repository named.

**What it costs**:
- The CLI in the design is partly deferred. Mitigation: `runner-contract.md` marks `--config` as Phase 3, and AC-023 pins the usage error.
- The node test row runs before Phase 1 is finished if Phase 1 adds it first. Mitigation: REQ-024 places the row here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 3 finds the guard does not fit configured commands | M | The guard is tested for built-in spawns here, so Phase 3 only adds commands |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The trust boundary needs its own phase |
| 2 | **Beyond Local Maxima?** | PASS | Full CLI and no flag were assessed |
| 3 | **Sufficient?** | PASS | A rejected flag and one spawn module |
| 4 | **Fits Goal?** | PASS | The goal is a verdict with built-in checks |
| 5 | **Open Horizons?** | PASS | Phase 3 extends the same spawn module |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- The `--config` usage branch in `quality-gate.cjs`, pinned by AC-023.
- The CI row in `.github/workflows/sk-code-script-tests.yml`, pinned by AC-026.

**How to roll back**: Revert the flag branch and the CI row. Phase 3 then adds `--config` on a clean slate.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: Amend Iron Law 3 as the design words it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-011-context -->
### Context

Iron Law 2 makes the quality gate mandatory before a Phase 1 completion claim (`.skilled/skills/sk-code/shared/references/phase-detection.md:108`). Iron Law 3 forbids any standard on an UNKNOWN surface (`phase-detection.md:109`). A repository with no surface packet therefore never completes. The goal names that case.

### Constraints

- Iron Law 3 must not become a licence for surface standards on an unknown surface.
- The operator's standing instruction takes this open decision at the design's default.

<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: Iron Law 3 reads: "No claim about an unsupported surface. An UNKNOWN surface gets only the universal floor in `code-quality-standards.md` and the quality runner's built-in checks until the operator names its surface and commands, in a declared surface or in the repository's committed `.sk-code/quality.json`. No other standard or verification command applies to it."

**How it works**: Phase 4 writes the text into `phase-detection.md:109`, and it updates the UNKNOWN rows in `stack-detection.md:32`. Phase 2 ships the runner that the text names. Until Phase 4 lands, the current text stays in force.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend as the design words it (chosen)** | An unknown repository gets a verdict, and no surface standard leaks in | Needs the operator to confirm the wording | 8/10 |
| Keep Iron Law 3 unchanged | No edit | A foreign repository never completes | 3/10 |
| Drop Iron Law 3 | Simplest | Verification would have no floor on an unknown surface | 2/10 |

**Why this one**: It opens the runner's floor without opening surface standards.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- A foreign repository gets a verdict from the floor and the built-in checks.

**What it costs**:
- Verification commands still need the operator for an unknown surface. Mitigation: `workflow-verify.md` keeps asking for them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The wording is read as permission for surface standards | M | The text names the floor and the config, and nothing else (design risk 4) |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, a foreign repository cannot complete |
| 2 | **Beyond Local Maxima?** | PASS | Keeping and dropping the law were assessed |
| 3 | **Sufficient?** | PASS | One sentence of text |
| 4 | **Fits Goal?** | PASS | The goal names the unknown-repository case |
| 5 | **Open Horizons?** | PASS | Phase 3 adds the config the text names |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- Phase 4 edits `phase-detection.md:109`, `stack-detection.md:32` and the UNKNOWN row in `code-quality-standards.md`.

**How to roll back**: Restore the current text of `phase-detection.md:109` and `stack-detection.md:32` from the commit before Phase 4.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: Scope universal-checklist.md to SKILLED

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-012-context -->
### Context

`universal-checklist.md` describes itself as serving "the OpenCode development environment" (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:3,16`). It is loaded on every quality gate today (`.skilled/skills/sk-code/sk-code-quality/SKILL.md:100`). Its P0 rows force this framework's header form and spec roots. An earlier operator ruling split the quality floor into a baseline and a web overlay (`specs/sk-code/014-code-modes-research/003-review-remediation/implementation-summary.md:26,103`).

### Constraints

- A foreign repository must not get this framework's header rules.
- The shared floor must stay universal.

<!-- /ANCHOR:adr-012-context -->

---

<!-- ANCHOR:adr-012-decision -->
### Decision

**We chose**: `universal-checklist.md` loads only when SKILLED is a resolved surface, as the SKILLED house checklist. The universal floor for every surface is `code-quality-standards.md`. Phase 2 declares the SKILLED row. Phase 4 retitles the file.

**How it works**: The SKILLED row in `mode-registry.json` names the file, so the runner loads it only for SKILLED files. The loading table in `sk-code-quality/SKILL.md` stops listing it as ALWAYS.
<!-- /ANCHOR:adr-012-decision -->

---

<!-- ANCHOR:adr-012-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to SKILLED (chosen)** | No foreign repository gets house rules | The file keeps its name until Phase 4 | 8/10 |
| Keep it universal | No change | Foreign repositories get this framework's header and spec rules | 3/10 |
| Split into a universal file and a house file | Clean names | A new file and a second loading path | 6/10 |

**Why this one**: It keeps one file and moves the house rules to the surface that owns them.
<!-- /ANCHOR:adr-012-alternatives -->

---

<!-- ANCHOR:adr-012-consequences -->
### Consequences

**What improves**:
- A foreign repository's checklist list holds the floor and the runner's checks only.

**What it costs**:
- The file name still says "universal" until Phase 4. Mitigation: the Phase 4 retitle, and the SKILLED row's comment.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A SKILLED file fails to load the house checklist | M | F16 asserts that the house checklist is listed for a file inside `.skilled/` |
<!-- /ANCHOR:adr-012-consequences -->

---

<!-- ANCHOR:adr-012-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Foreign repositories get the wrong rules today |
| 2 | **Beyond Local Maxima?** | PASS | Keeping it and splitting it were assessed |
| 3 | **Sufficient?** | PASS | A row in the registry |
| 4 | **Fits Goal?** | PASS | The goal is a verdict that fits the repository |
| 5 | **Open Horizons?** | PASS | Phase 4 retitles the file to match |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-012-five-checks -->

---

<!-- ANCHOR:adr-012-impl -->
### Implementation

**What changes**:
- The SKILLED row in `mode-registry.json` (Phase 2). The retitle of the file (Phase 4).

**How to roll back**: Remove the SKILLED row and restore the ALWAYS entry in the `sk-code-quality/SKILL.md` loading table.
<!-- /ANCHOR:adr-012-impl -->
<!-- /ANCHOR:adr-012 -->

---

<!-- ANCHOR:adr-013 -->
## ADR-013: The repository config is `.sk-code/quality.json`, with the design's merge rule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-013-context -->
### Context

The repository keeps its sk-git settings in `.sk-git/` (`.skilled/skills/sk-git/SKILL.md:261`). Its resolver takes `--config`, then git config, then the file, then the defaults. It reads the git config value only from file scope (`.skilled/skills/sk-git/scripts/lib/message-contract.mjs:283-291`), and it treats a missing path as a broken install (`:292-296`).

Every design proposed a local override file. This one does not, because an absent optional tool is already non-blocking and a required check must not be disabled silently.

### Constraints

- The name must match the existing `.sk-git/` convention.
- No command may come from a surface or a manifest.

<!-- /ANCHOR:adr-013-context -->

---

<!-- ANCHOR:adr-013-decision -->
### Decision

**We chose**: The config is `.sk-code/quality.json` at the repository root, committed. Discovery order: `--config`, then git config `skcode.qualityConfig` at file scope, then `.sk-code/quality.json`, then the shipped defaults. A named path that does not exist exits 3 with `CONFIG_PATH_MISSING`. Merge rules: `checks` come only from the repository layer, and a duplicate id is an error. `checklists` and `generated` append. `commentHygiene` lists append, and the core patterns cannot be removed. `sensors` merge per sensor, and an exact sensor can narrow with `exclude` but never disable. `schemaVersion` must be 1, and an unknown key is an error. No local override file exists.

**How it works**: Phase 3 writes `lib/quality-config.cjs` and the template. Phase 2 implements none of it (ADR-010).
<!-- /ANCHOR:adr-013-decision -->

---

<!-- ANCHOR:adr-013-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.sk-code/quality.json` (chosen)** | Matches `.sk-git/`, and sits beside the skill it configures | One more root folder | 8/10 |
| `.sk-quality.json` at the root | One file at the root | Breaks the `.sk-git/` folder pattern | 5/10 |
| A key in `package.json` | No new file | Ties a gate that must work in any repository to Node packaging | 3/10 |

**Why this one**: The name follows the convention a reader already knows from sk-git.
<!-- /ANCHOR:adr-013-alternatives -->

---

<!-- ANCHOR:adr-013-consequences -->
### Consequences

**What improves**:
- A repository's checks live in one committed file, and a missing file means defaults.

**What it costs**:
- One more folder at the repository root. Mitigation: `sk-code-quality/references/quality-config.md` names it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A configured command is repository code | H | Only the repository layer names commands, and each runs as an argv array under the guard (ADR-010) |
<!-- /ANCHOR:adr-013-consequences -->

---

<!-- ANCHOR:adr-013-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 3 needs a name before it writes a file |
| 2 | **Beyond Local Maxima?** | PASS | A root file, a `package.json` key and a local override were assessed |
| 3 | **Sufficient?** | PASS | One file and one discovery order |
| 4 | **Fits Goal?** | PASS | A repository states its own commands |
| 5 | **Open Horizons?** | PASS | The same order serves a future override, if the operator adds one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-013-five-checks -->

---

<!-- ANCHOR:adr-013-impl -->
### Implementation

**What changes**:
- Phase 3 adds `lib/quality-config.cjs`, the template and `references/quality-config.md`.

**How to roll back**: Delete the config module and the discovery branch. No data depends on it, because no repository has a config file until `init --apply` writes one.
<!-- /ANCHOR:adr-013-impl -->
<!-- /ANCHOR:adr-013 -->

---

<!-- ANCHOR:adr-014 -->
## ADR-014: CI and pre-commit keep whole-file scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-014-context -->
### Context

CI scans whole files (`.github/workflows/comment-hygiene.yml:36-48`). Pre-commit scans the staged blobs in a temporary copy (`.skilled/scripts/git-hooks/pre-commit:142-158`), so it cannot read the working-tree config safely. Each layer is a HARD BLOCK, and changing one changes what blocks a commit or a pull request. Pre-commit also inherits the wider language set through the checker, and Phase 1 measures that set.

### Constraints

- A HARD BLOCK layer must not change scope inside this build.
- The author gate's changed-line rule must not weaken the whole-file layers.

<!-- /ANCHOR:adr-014-context -->

---

<!-- ANCHOR:adr-014-decision -->
### Decision

**We chose**: CI and pre-commit keep whole-file scope. This phase changes neither. The author gate uses changed-line scope (ADR-003). The additions reach CI and pre-commit only through the checker, so Phase 1's baseline decides whether they block.

**How it works**: Nothing in this phase edits the CI or pre-commit scope. The workflow file changes only its test row (REQ-024).
<!-- /ANCHOR:adr-014-decision -->

---

<!-- ANCHOR:adr-014-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep whole-file (chosen)** | No change to a HARD BLOCK layer | Old comments can still block a pull request | 8/10 |
| Move CI to changed-line scope | Blocks only new violations | Changes a HARD BLOCK layer and needs its own review | 4/10 |

**Why this one**: The layers are outside this phase's scope, and the operator owns the call.
<!-- /ANCHOR:adr-014-alternatives -->

---

<!-- ANCHOR:adr-014-consequences -->
### Consequences

**What improves**:
- The blocking layers do not change in this build.

**What it costs**:
- A pull request can fail on an old comment that the author gate reports as debt. Mitigation: the author gate shows the same finding as P1 first, so the author sees it before the push.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The wider language set blocks a large number of old comments | M | Phase 1 runs the baseline before merge, and its halt rule applies (design section 6.4) |
<!-- /ANCHOR:adr-014-consequences -->

---

<!-- ANCHOR:adr-014-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision is open, and the operator owns it |
| 2 | **Beyond Local Maxima?** | PASS | Moving the layers to changed-line was assessed |
| 3 | **Sufficient?** | PASS | No change in this phase |
| 4 | **Fits Goal?** | PASS | The goal does not require changing a blocking layer |
| 5 | **Open Horizons?** | PASS | A later ADR can move the layers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-014-five-checks -->

---

<!-- ANCHOR:adr-014-impl -->
### Implementation

**What changes**:
- Nothing in the CI or pre-commit scope. The workflow row for the node tests is in ADR-010.

**How to roll back**: Not needed in this phase. Changing the scope later needs a new ADR and a CI change.
<!-- /ANCHOR:adr-014-impl -->
<!-- /ANCHOR:adr-014 -->

---

<!-- ANCHOR:adr-015 -->
## ADR-015: The benchmark report follows the existing report layout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-015-context -->
### Context

Rank 13 in the research synthesis asks that every benchmark run record a repository-relative target root and its scenario corpus (`specs/sk-code/014-code-modes-research/001-quality-mode-research/research/synthesis-v1.md:207`). Two report folders already exist under `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/`. Phase 6 writes the live D4 report, and it needs a layout.

### Constraints

- The report layout must match what readers already open.
- The harness owner's call on rank 13 belongs to the operator.

<!-- /ANCHOR:adr-015-context -->

---

<!-- ANCHOR:adr-015-decision -->
### Decision

**We chose**: Phase 6 writes its report in the layout of the existing report folders. The report records a repository-relative root and the scenario corpus. The harness owner can move the rule later.

**How it works**: Phase 6 creates one new folder under `benchmark/reports/`, named by date and mode, with the same files the existing folders carry.
<!-- /ANCHOR:adr-015-decision -->

---

<!-- ANCHOR:adr-015-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing layout (chosen)** | Readers already know it | Its files may not carry every field rank 13 asks for | 8/10 |
| A new layout with a metrics table and JSON | Carries every field | A third layout beside two existing ones | 4/10 |

**Why this one**: One layout is easier to read than three.
<!-- /ANCHOR:adr-015-alternatives -->

---

<!-- ANCHOR:adr-015-consequences -->
### Consequences

**What improves**:
- Phase 6 reports sit beside the earlier runs, and they compare directly.

**What it costs**:
- If the existing layout lacks a field, Phase 6 adds it to the new folder only. Mitigation: the report names what it adds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The rank 13 owner rejects the layout | L | The operator owns the call, and the layout can change before Phase 6 runs |
<!-- /ANCHOR:adr-015-consequences -->

---

<!-- ANCHOR:adr-015-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 6 needs a layout before it writes a report |
| 2 | **Beyond Local Maxima?** | PASS | A new layout was assessed |
| 3 | **Sufficient?** | PASS | The existing layout, plus the added fields |
| 4 | **Fits Goal?** | PASS | The goal reports catch rate and misses on a comparable basis |
| 5 | **Open Horizons?** | PASS | A later layout change can move the rule without rewriting old reports |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-015-five-checks -->

---

<!-- ANCHOR:adr-015-impl -->
### Implementation

**What changes**:
- Phase 6 adds one report folder under `benchmark/reports/`.

**How to roll back**: Delete the Phase 6 report folder. The two earlier folders are not touched.
<!-- /ANCHOR:adr-015-impl -->
<!-- /ANCHOR:adr-015 -->

---

<!-- ANCHOR:adr-016 -->
## ADR-016: The advisor plugin keeps its own copy of declaredSurfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-016-context -->
### Context

The advisor plugin has its own `declaredSurfaces` (`.skilled/plugins/system-skill-advisor.js:747-772`). The shared reader lives in `router-replay-lib.cjs:773`. Folding the copy into the shared reader would touch the live advisor routing path, in a phase that does not own that path.

### Constraints

- This phase must not change advisor routing.
- The copy and the shared reader may drift apart.

<!-- /ANCHOR:adr-016-context -->

---

<!-- ANCHOR:adr-016-decision -->
### Decision

**We chose**: The plugin keeps its copy. This phase extends only the shared reader.

**How it works**: The shared reader gains the per-kind lists, and its exports stay the same. The plugin's copy does not read them and keeps its own shape.
<!-- /ANCHOR:adr-016-decision -->

---

<!-- ANCHOR:adr-016-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the copy (chosen)** | No change to live advisor routing | Drift is possible, and no test ties the copies | 7/10 |
| Fold the copy into the shared reader now | One reader | Touches advisor routing in a phase that does not own it | 4/10 |

**Why this one**: The advisor path belongs to a different owner, and this phase has no need to change it.
<!-- /ANCHOR:adr-016-alternatives -->

---

<!-- ANCHOR:adr-016-consequences -->
### Consequences

**What improves**:
- The advisor's routing is unchanged by this phase.

**What it costs**:
- Two readers exist. Mitigation: the advisor's own replays stay the check for its routing, and this phase does not change them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The copy drifts from the shared reader | M | Phase 5 may add a test that compares the two. The operator decides |
<!-- /ANCHOR:adr-016-consequences -->

---

<!-- ANCHOR:adr-016-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Only the shared reader needs the per-kind lists |
| 2 | **Beyond Local Maxima?** | PASS | Folding the copy was assessed |
| 3 | **Sufficient?** | PASS | No change to the advisor |
| 4 | **Fits Goal?** | PASS | The goal does not require advisor changes |
| 5 | **Open Horizons?** | PASS | A later fold is one ADR away |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-016-five-checks -->

---

<!-- ANCHOR:adr-016-impl -->
### Implementation

**What changes**:
- Nothing in the advisor plugin.

**How to roll back**: Not needed. The shared reader's change is reverted with ADR-006.
<!-- /ANCHOR:adr-016-impl -->
<!-- /ANCHOR:adr-016 -->

---

<!-- ANCHOR:adr-017 -->
## ADR-017: `--no-run` lists spawning checks and makes the run UNVERIFIED

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-017-context -->
### Context

REQ-020 names a `--no-run` flag but no document says what it prints or how it exits. A caller uses it to see what a run would start without starting it. The open question is whether a listed check counts as evidence, and whether the in-process checks still run.

### Constraints

- No gate value may mean pass, so a check that produced no evidence cannot read clean.
- The in-process checks start no process, so running them costs no trust.

<!-- /ANCHOR:adr-017-context -->

---

<!-- ANCHOR:adr-017-decision -->
### Decision

**We chose**: Every spawning check reads `LISTED` with its argv template, the in-process checks still run, and a required check in `LISTED` makes the run `UNVERIFIED` with exit 4.

**How it works**: `LISTED` joins `SKIPPED_ABSENT`, `SKIPPED_BY_FLAG`, `TIMEOUT` and `ERROR` as an unverified state. A blocking finding from an in-process sensor still exits 1, because precedence puts `BLOCKED` before `UNVERIFIED`.
<!-- /ANCHOR:adr-017-decision -->

---

<!-- ANCHOR:adr-017-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **List spawns, run in-process checks, exit 4 (chosen)** | Honest exit, and a conflict marker or secret still blocks | A dry run never exits 0 | 8/10 |
| Skip every check and exit 2 | Simple | Hides in-process blockers the run could find for free | 5/10 |
| List spawns and exit 0 | A dry run looks clean | Reads as a pass with no evidence behind it | 1/10 |

**Why this one**: It is the most conservative choice that still reports what the run can see without starting a process.
<!-- /ANCHOR:adr-017-alternatives -->

---

<!-- ANCHOR:adr-017-consequences -->
### Consequences

**What improves**:
- A caller sees each argv the run would start, and no listed check can be mistaken for a clean one.

**What it costs**:
- A dry run on a clean change exits 4. Mitigation: `runner-contract.md` section 2 lists `LISTED` as an unverified state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller reads exit 4 from a dry run as a fault | L | The verdict names each listed id in `summary.unverified` |
<!-- /ANCHOR:adr-017-consequences -->

---

<!-- ANCHOR:adr-017-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-020 names the flag without its semantics |
| 2 | **Beyond Local Maxima?** | PASS | Three behaviors were compared |
| 3 | **Sufficient?** | PASS | `unit: flags` checks the state, the argv and that no process started |
| 4 | **Fits Goal?** | PASS | No exit code means pass |
| 5 | **Open Horizons?** | PASS | Phase 3 configured checks take the same state |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-017-five-checks -->

---

<!-- ANCHOR:adr-017-impl -->
### Implementation

**What changes**:
- `quality-gate.cjs` sets `LISTED` on each spawning check when the flag is present, and `decideGate` treats it as unverified.

**How to roll back**: Drop `LISTED` from the unverified states and from the flag parser, then rerun `unit: flags`.
<!-- /ANCHOR:adr-017-impl -->
<!-- /ANCHOR:adr-017 -->

---

<!-- ANCHOR:adr-018 -->
## ADR-018: No generated path is declared while the dist checker can write a cache

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-018-context -->
### Context

REQ-023 has the dist adapter run on declared generated paths. The per-file mode of `check-dist-staleness.sh` calls the freshness library in the hub's repository, and that library writes a cache record beside a dist entry (`.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:329-334`). The workspace guard watches the target repository only, and it does not list ignored files, so that write would go unseen while the runner promises to write nothing.

### Constraints

- The runner writes no file anywhere.
- REQ-023 still needs the adapter built and tested.

<!-- /ANCHOR:adr-018-context -->

---

<!-- ANCHOR:adr-018-decision -->
### Decision

**We chose**: Build and test the adapter against a stand-in checker, and ship `quality-defaults.json` with an empty `generated` list, so no real run reaches the adapter in this phase.

**How it works**: `runDistAdapter` is exported and covered by `unit: dist adapter`, which drives a stand-in script through every banner, the hook switch, `--no-run` and a missing `python3`. A real run reads `dist-staleness` as `NOT_APPLICABLE`.
<!-- /ANCHOR:adr-018-decision -->

---

<!-- ANCHOR:adr-018-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Empty list, stand-in tests (chosen)** | The no-write promise holds | No real dist check runs yet | 8/10 |
| Declare the system-spec-kit dist paths now | Real coverage | A cache write the guard cannot see breaks the promise | 3/10 |
| Change the freshness library to skip its cache | Closes the gap at the source | Edits another skill's runtime in a phase that does not own it | 4/10 |

**Why this one**: It keeps the invariant and leaves the cache decision to the library's owner.
<!-- /ANCHOR:adr-018-alternatives -->

---

<!-- ANCHOR:adr-018-consequences -->
### Consequences

**What improves**:
- Every real run keeps the no-write promise.

**What it costs**:
- Generated drift stays unchecked by the runner. Mitigation: the quality mode's P0 table reads unchecked generated drift as UNVERIFIED, and the hooks still run the dist checker.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later phase declares a path without closing the cache write | M | `runner-contract.md` section 8 names the limit next to the `generated` list |
<!-- /ANCHOR:adr-018-consequences -->

---

<!-- ANCHOR:adr-018-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The cache write conflicts with the no-write invariant |
| 2 | **Beyond Local Maxima?** | PASS | Three options were compared |
| 3 | **Sufficient?** | PASS | The adapter's banner contract is tested in full |
| 4 | **Fits Goal?** | PASS | The goal requires that the runner writes nothing |
| 5 | **Open Horizons?** | PASS | Declaring a path later is a one-line defaults change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-018-five-checks -->

---

<!-- ANCHOR:adr-018-impl -->
### Implementation

**What changes**:
- `quality-defaults.json` holds `"generated": []`, and `runner-contract.md` section 8 records the cache limit.

**How to roll back**: Add `paths` rows to `generated` once the cache write is closed, then extend `unit: dist adapter` with a run against the real checker.
<!-- /ANCHOR:adr-018-impl -->
<!-- /ANCHOR:adr-018 -->
