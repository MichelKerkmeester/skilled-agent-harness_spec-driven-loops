---
title: "Decision Record: R1 R5 R9 adoption decisions D1 to D4"
description: "The four decisions phases 003 to 006 build on: the contextType policy, the shape of R1, the go or no-go threshold for phase 006, and enforcement scope with the home of the shared resolver."
trigger_phrases:
  - "decision record"
  - "contexttype policy"
  - "source tag resolver"
  - "anchor citation threshold"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions"
    last_updated_at: "2026-10-04T08:33:14Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded operator approval with the UX and command-surface condition; D3 condition 3 deferred"
    next_safe_action: "Carry the condition into phases 003 to 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: R1 R5 R9 adoption decisions D1 to D4

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: D1, the contextType policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted with changes |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, approved 2026-10-04 with the condition "Make sure the ux is perfecr also for docs and specs before the update, also reference doctor, speckit and deep loop and sk doc commands". Drafted by claude-opus-5-5. Owner: system-spec-kit, with sk-doc consuming its list |
| **Amended** | 2026-10-04 by `011-frontmatter-values-to-sk-doc/decision-record.md` ADR-001: the document values and tiers move to `sk-create-frontmatter`, and the session list stays in spec-kit |

---

<!-- ANCHOR:adr-001-context -->
### Context

One key name, `contextType`, carries two meanings. The document list lives in `.skilled/skills/system-spec-kit/shared/context-types.ts:16-31`: four canonical values plus the aliases `decision` to `planning` and `discovery` to `general`. Its only runtime importer is `runtime/cli/lib/frontmatter-migration.ts:15`, which writes the value into doc frontmatter (`:1365`). The 10-value list at `runtime/cli/utils/input-normalizer.ts:1133-1136` and the 11-value list at `runtime/cli/extractors/session-extractor.ts:576-588` validate a save payload and classify the session. They feed the project phase (`collect-session-data.ts:1396-1408`), the importance tier (`session-extractor.ts:150`) and the memory type (`core/memory-metadata.ts:78,81`). No writer was found that copies the session value into a doc.

The corpus at commit `5285608745` does not follow any of the lists. Spec docs carry 33 distinct values and skill docs 6. The spec-kit template itself emits `contextType: "review"` (`templates/packet-types/review.spec.md.tmpl:9`).

### Constraints

- Session behavior must not change. Deriving the session lists from the four document values would reject `debugging`, `review`, `architecture`, `configuration` and `documentation` at `input-normalizer.ts:1159-1164` and stop the `debugging` and `review` project phases.
- Resolving `decision` to `planning` on the session side would change its memory type from semantic to episodic (`memory-metadata.ts:81`).
- The skill advisor stores doc `context_type` but no scorer reads it, so a document-side change cannot move advisor ranking. `importance_tier` does change ranking (`doc-frontmatter.ts:41-55`, `scorer/lanes/derived.ts:46`).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: two named lists in one file. `context-types.ts` keeps the document list and adds an exported session list, and every checker imports the list for its own meaning.

**How it works**: The document list stays the four canonical values. Its alias table grows to cover the observed outliers, so a doc that uses `review`, `reference`, `spec`, `specification`, `plan` or `tasks` is legal and maps to a canonical value: `review` to `research`, `reference` and `documentation` to `general`, and `spec`, `specification`, `plan` and `tasks` to `planning`. Anything else draws a warning. The two CLI lists import the new session constant, which keeps the 11 values they accept today. On the session side aliases are accepted, never resolved, so `decision` and `discovery` keep their current behavior. `importance_tier` keeps its six values with aliases: `high` to `important`, and `supporting`, `useful`, `medium` and `standard` to `normal`.
**What writes these values**: the generators must emit a canonical value or a legal alias before any warning lands, so a new doc never warns. They are the spec-kit templates (`templates/packet-types/review.spec.md.tmpl:9` emits `review`, now a legal alias), the sk-doc frontmatter contract, and the `/create:*` workflow assets that state required fields and seed values (`.skilled/commands/create/assets/create-skill-auto.yaml:203`, `create-changelog-auto.yaml:541`, `create-readme-auto.yaml:609-629`). The `/speckit:save` tail (`.skilled/commands/speckit/assets/speckit-save-context-tail.yaml:28-32`) names session context types, including `files`, which is in no list today. Phase 003 checks whether that is a session value or a mistake.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two named lists in one file, aliases for document outliers** | One source file, no behavior change, outliers stay legal | Two lists to explain | 8/10 |
| Collapse everything to the four document values | Simplest list | Breaks session phases and memory types, and rejects a value a shipped template emits | 3/10 |
| Leave the code lists alone and only document them | No code change | Three hand-typed lists keep drifting, which is the problem R5 exists to fix | 4/10 |

**Why this one**: It is the only option that ends the retyped lists without changing a session behavior or failing a doc that a shipped template wrote.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every checker reads one file. The distinct document values in use can fall to the four canonical values plus the aliases still present.
- Template-emitted values such as `review` become legal aliases instead of silent outliers.

**What it costs**:
- Mapping `high` to `important` raises the advisor weight of those docs from 0.7 to 0.85 if they are harvested. Mitigation: phase 003 runs the advisor suite before and after, and leaves `high` unmapped in skill docs if the result moves.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A writer that copies the session value into a doc exists and was missed | M | Phase 003 runs the save path end to end on a fixture before cleanup |
| `post-save-review.ts:733-741` compares doc frontmatter with the payload value | L | Whether it reads a real file is UNKNOWN (`workflow.ts:2000` passes a folder path). Phase 003 confirms it before relying on either reading |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three hand-typed lists and 33 values in use |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One file and an alias table, no new key |
| 4 | **Fits Goal?** | PASS | Root goal criterion on contextType warnings |
| 5 | **Open Horizons?** | PASS | Any later OKF `type` mapping reads the same file |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `shared/context-types.ts` gains the session list and the larger document alias table.
- `input-normalizer.ts`, `session-extractor.ts`, `frontmatter-migration.ts` and `check-skill-doc-frontmatter.mjs` import from it.

**How to roll back**: Revert the phase 003 commits. The lists are additive, so no doc needs rewriting back.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: D2, the shape of R1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted with changes |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, approved 2026-10-04 with the condition "Make sure the ux is perfecr also for docs and specs before the update, also reference doctor, speckit and deep loop and sk doc commands". Drafted by claude-opus-5-5. Owner: system-spec-kit |

---

<!-- ANCHOR:adr-002-context -->
### Context

Phase 001 reshaped R1 from a hand-typed `sources:` frontmatter block into a check on the `[SOURCE:]` tags authors already write. The census at `5285608745` (`baseline.md`) found 26,061 `path:line` citations inside `[SOURCE:]` tags in spec docs. Only 4,755 resolve directly and in range. 10,722 point at files that moved, 6,487 at files that are gone, and 3,827 resolve only by basename or not at all. Skill docs hold 5 such tags.

### Constraints

- The history is mostly moved files, so checking old packets would flood authors with warnings about moves they did not make.
- Root decision D1 makes any new check warn-only.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a warn-only resolver for `[SOURCE:]` tags in the research and review artifacts of packets created after a recorded cutoff, with no new frontmatter key and no generated `sources` list.

**How it works**: The rule reads `research.md`, iteration files and review reports. It reports gone, moved and past-end tags as separate classes, and says in its output that a pass means the path and line exist and nothing more. The cutoff follows the `SPECKIT_AC_CLOSURE_CUTOFF` precedent in `validation-rules.md:76`: a date compared with the `Created` row of the packet's `spec.md`.
**Where authors meet it**: the citation format the rule checks is the one the commands already teach: `[SOURCE: file.md:lines]` in `/speckit:plan` (`.skilled/commands/speckit/assets/speckit-plan.yaml:621`) and `/speckit:complete` (`speckit-complete.yaml:545`). The rule runs inside the `validate.sh --strict` call those commands and `/speckit:implement` already make (`speckit-implement.yaml:265`), so no new command is needed. `/deep:research` and `/deep:review` write the research and review artifacts it reads, so their references document the check, and `/doctor:deep-loop` reports a lineage whose artifacts carry unresolved tags.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Resolver on existing tags, new packets only** | Uses the habit authors already have, additive | Proves existence, not support | 8/10 |
| Resolver plus a generated `sources` list from delta `evidence` arrays | Machine-readable provenance | No consumer reads it yet, which is the same reason R2 was deferred | 5/10 |
| Hand-typed `sources:` frontmatter | Matches OKF closely | Second copy of what the body already cites, rejected in phase 001 | 2/10 |

**Why this one**: It catches invented and stale tags, which phase 001 saw in practice, at the lowest cost and with no new data to keep in sync.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- An invented line number in a new research doc draws a warning at validation time.

**What it costs**:
- A pass can still hide a claim the line does not support. Mitigation: the output says so, and phase 004's labeled sample measures how often it happens.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Authors read warnings on moved files as noise | M | Moved is its own, lower class |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 18% of tags resolve directly and in range |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared |
| 3 | **Sufficient?** | PASS | One rule, no new key |
| 4 | **Fits Goal?** | PASS | Root goal criterion on an invented `[SOURCE:]` line |
| 5 | **Open Horizons?** | PASS | A generated list can be added later without changing the rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- A new warn rule in `validator-registry.json` and its rule file, built in phase 005.

**How to roll back**: Remove the registry entry. The rule writes nothing.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: D3, the go or no-go threshold for phase 006

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded 2026-10-04: the operator removed phase 006, so this threshold has nothing left to decide. Before that: accepted in part, conditions 1 and 2 accepted, condition 3 deferred to phase 006. Threshold fixed at 2026-10-04T08:33:14Z, before any label in the enlarged sample existed |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, 2026-10-04: "Defer to phase 006". Drafted by claude-opus-5-5. Owner: phase 006 applies it |

---

<!-- ANCHOR:adr-003-context -->
### Context

An anchor-ID citation form only helps when a citation into a markdown file misses because the text moved within the same file, and the file has anchors to point at. The only evidence so far is 20 live skill-doc labels with one labeler family (`cite-drift-labels.jsonl`).

### Constraints

- The threshold must be stated before the enlarged sample is labeled, so the data cannot shape it.
- Code and JSON targets cannot carry anchors and do not count.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: build phase 006 only if all three conditions hold. Otherwise phase 006 closes as not built.

**How it works**:
1. **Sample size.** At least 30 in-range citations with a markdown target carry labels from two labelers of different model families.
2. **Relocatable misses.** At least 20% of those rows are relocatable misses: both labelers say the cited lines do not support the claim (contradicts or partial), and both find the supporting text elsewhere in the same file.
3. **Anchor coverage.** At least half of the relocatable-miss target files already carry anchor markers (`<!-- ANCHOR:` comments) that a citation could name.

Disagreements count against go: a row is a relocatable miss only when both labelers say so.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three conditions on relocatable misses** | Measures the exact failure anchors fix | Needs a labeler to search the whole file | 8/10 |
| Any contradiction rate above a bar | Easy to label | Counts misses an anchor would not fix | 4/10 |
| Build regardless | No labeling cost | A new citation form with no evidence of need | 2/10 |

**Why this one**: It answers whether anchors would have saved the citation, which is the only question that justifies a new form.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Phase 006 starts with a yes or no that the data decides, not taste.

**What it costs**:
- Two labelers per row. Mitigation: the sample is small and its rows are recorded for reuse.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Both labelers share a blind spot | M | Spot-check a share of rows by hand and record the result |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 006 has no basis without it |
| 2 | **Beyond Local Maxima?** | PASS | Three rules compared |
| 3 | **Sufficient?** | PASS | Three numbers decide it |
| 4 | **Fits Goal?** | PASS | Root goal criterion that phase 006 is shipped or recorded as not built |
| 5 | **Open Horizons?** | PASS | The labeled rows feed phase 004 too |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Nothing ships here. Phase 006 records go or no-go against these three conditions.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: D4, enforcement scope and the home of the shared resolver

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted with changes |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, approved 2026-10-04 with the condition "Make sure the ux is perfecr also for docs and specs before the update, also reference doctor, speckit and deep loop and sk doc commands". Drafted by claude-opus-5-5. Owner: system-spec-kit for its rules, sk-doc for the scanner |

---

<!-- ANCHOR:adr-004-context -->
### Context

Today one script checks `contextType` and `importance_tier` values on skill docs: `system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:36-39,128-136`. It fails with an error on any value outside its lists. CI runs it (`.github/workflows/skill-doc-frontmatter.yml:42`). It reads only the `references/` and `assets/` folders of the top-level skills, 101 of the 724 such docs. It passes today with 0 violations. `validate_document.py` checks presence only, for changelog entries, and `package_skill.py:108-110` deliberately skips values.

`cite-drift-scan.mjs` already exports `resolveCitation`. That function accepts a unique basename match as resolved (`cite-drift-scan.mjs:246-248`), which hides a moved file behind a success.

### Constraints

- Root decision D1: new checks are warn-only.
- A spec-kit rule that imports an sk-doc script creates a cross-skill dependency. The repo has a precedent: `sk-create-goal/scripts/check-goal.cjs:15-19` imports from `.skilled/hooks/goal/lib`.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: warn-only new checks on both sides, the existing advisor checker kept at its current severity but importing the shared list, and one resolver exported from `sk-doc/shared/scripts/` that the spec-kit rule imports.

**How it works**:
- The new `contextType` and `importance_tier` checks warn in spec-kit `validate.sh` and in `validate_document.py`. The `validate_document.py` check covers nested mode-packet docs too.
- The advisor checker keeps its error level and reach, since it passes today. It imports the shared list, so the only change is that aliases become legal there.
- The resolver lives in `cite-drift-scan.mjs` or a module beside it. Phase 004 adds the moved class and reports a basename-only match as its own class instead of a success. Phase 005 imports it, and both READMEs record the dependency.
**Rollout and user experience** (operator condition):
1. **Zero new noise on day one.** Outlier cleanup and generator fixes land before a warning is switched on. Before the warning ships, `validate.sh --strict` on every existing packet and the sk-doc validator on every skill doc must print no new warning. The citation rule only reads packets created after the cutoff, so it starts silent.
2. **Every warning says how to fix itself.** A warning names the file, the key or citation, the value found, and the canonical value or the path the file moved to. A moved citation names its new path. A pass on the citation rule says it proves existence, not support.
3. **Commands carry the change.** Each phase updates the command surfaces it touches, and phase 007 documents them all:
   - **sk-doc:** the `/create:*` workflow assets that seed frontmatter, under `.skilled/commands/create/assets/`.
   - **speckit:** `/speckit:plan`, `/speckit:implement` and `/speckit:complete`, whose assets teach the citation format and run `validate.sh`, and `/speckit:save` for session context types.
   - **deep loop:** `/deep:research` and `/deep:review`, whose artifacts the citation rule reads.
   - **doctor:** `/doctor:skill-advisor` and `/doctor:skill-graph-freshness` after any advisor list change, `/doctor:deep-loop` for lineage citation health, and `/doctor:speckit` for a read-only citation-drift summary from the phase 004 scanner.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Resolver in sk-doc, imported by spec-kit** | One copy, extends code that exists | Cross-skill import | 7/10 |
| A neutral shared module outside both skills | No skill depends on another | A new home to maintain, and moving code that works | 5/10 |
| Copy the resolver into spec-kit | No dependency | Two copies drift, which is the R9 problem itself | 3/10 |
| Demote the advisor checker to warn | One severity everywhere | Weakens a check that passes today | 3/10 |

**Why this one**: It keeps one resolver and one list without weakening the one value check that already works.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Nested skill docs get a value check for the first time, as a warning.
- A moved file stops passing as resolved.

**What it costs**:
- spec-kit depends on an sk-doc module. Mitigation: a stable exported function and a test in each skill that imports it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A scanner refactor breaks the spec-kit rule | M | The rule skips and warns once when the module is missing, as phase 005 already specifies |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phases 003 and 005 cannot place their checks without it |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared |
| 3 | **Sufficient?** | PASS | Reuses the scanner and the advisor checker |
| 4 | **Fits Goal?** | PASS | Root decision D1 and the warn criteria |
| 5 | **Open Horizons?** | PASS | Moving the resolver later is a single import change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Phase 003: the warn checks and the advisor checker import.
- Phase 004: the resolver classes. Phase 005: the import.

**How to roll back**: Revert the phase commits. Every check is additive.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
