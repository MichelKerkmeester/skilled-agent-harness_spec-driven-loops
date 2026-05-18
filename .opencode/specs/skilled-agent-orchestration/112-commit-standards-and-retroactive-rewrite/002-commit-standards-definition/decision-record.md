---
title: "Phase 002 Decision Record: Commit Standards"
description: "Seven ADRs locking the canonical commit-message standard deliberated via structured reasoning on 20-commit sample plus merges + co-authored + packet-ID-prefix samples."
trigger_phrases:
  - "112-commit-standards-decision-record"
  - "commit standards ADRs"
importance_tier: "important"
contextType: "implementation"
---
# Phase 002 Decision Record: Commit Standards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> Deliberation method: structured reasoning organized in 3 groups (A: Q1+Q7; B: Q2+Q3+Q4; C: Q5+Q6) per the Phase 002 plan. The `sequential_thinking` MCP tool is registered in this repo's opencode runtime but is not wired into the Claude Code runtime; equivalent rigor applied via explicit-thought reasoning grounded in concrete sample data from `evidence/sample-*.txt`.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Subject Format

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group A deliberation (Q1) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-20.txt` — 20 random HEAD commits; ~80% already follow `type(scope): subject` form |
| **Supersedes** | sk-git SKILL.md §3 type/scope priority (lines 177–196) — will be replaced in Phase 003 |

### Context

Existing repo log shows strong adoption of conventional-commit-style subjects. The 20-commit random sample yields concrete data:
- 16/20 use `type(scope): subject` form
- 1/20 uses bare packet-ID prefix (`111 W3.E: …`) — wave-designator style
- 2/20 use packet-ID + descriptive subject (`111 W3.D-B: renumber …`)
- 1/20 uses bare `docs:` no scope — legacy form

Beyond the standard 8 types (`merge, release, docs, fix, feat, refactor, test, chore`), the log contains 5 additional types in active use with clear semantic distinctions: `review, iter, research, remedy, scaffold`.

### Decision

**Subject form**: `<type>(<scope>): <subject>`

- Lowercase `<type>` from the canonical 13-type taxonomy.
- Lowercase `<scope>` chosen via first-match scope-derivation rules (`derivation-heuristics.md` §2).
- `<subject>` is a short description, **no trailing period**, imperative mood for new commits (retroactive rewrites preserve original tense per ADR-004).
- Single space after the colon.

**Canonical type taxonomy** (priority order for first-match selection):

1. `merge` — commits created by `git merge` (regardless of `--no-ff`)
2. `revert` — commits created by `git revert`
3. `release` — version bumps, release announcements
4. `scaffold` — creating new spec folder, new skill, new directory tree
5. `remedy` — closing a finding from a deep-review or research output (subset of `fix` with explicit finding-list intent)
6. `iter` — explicit deep-loop iteration outputs (cli-devin / cli-codex / cli-opencode dispatches)
7. `research` — deep-research outputs and convergence artifacts
8. `review` — deep-review outputs and convergence artifacts
9. `fix` — bug fixes
10. `feat` — new features
11. `refactor` — non-feature, non-fix code restructure
12. `test` — test-only changes
13. `docs` — documentation-only changes
14. `chore` — everything else (build, tooling, config, low-stakes maintenance)

**Scope shapes** (lowercase, ASCII slugs):

- **Skill scope**: `<skill-name>` (`sk-git`, `cli-devin`, `mcp-code-mode`) when all changes are under `.opencode/skills/<skill-name>/...`
- **Spec scope**: `<NNN>` (`017`, `026`) when all changes are under one packet
- **Hierarchical spec scope**: `<NNN>/<MMM>[/<KKK>…]` (`026/041`, `056/008-010`) for nested phase children
- **Multi-spec scope**: `<NNN>/<NNN>[/<NNN>…]` (`013/009/008`) when one commit spans multiple specs
- **Release scope**: `<NNN>.<MMM>` dot form (`release(026.018)`) only for `release` type
- **Fallback scopes**: `agents`, `commands`, `config`, `readme`, `docs`, `repo` per current sk-git rules

### Alternatives Considered

1. **Keep sk-git's 8-type taxonomy verbatim** — would require remapping `review`, `iter`, `research`, `remedy`, `scaffold` into existing buckets. Rejected: loses semantic information that's actively used by repo conventions.
2. **Adopt Conventional Commits 1.0.0 verbatim (no extensions)** — would lose the spec-folder-aware scope derivation that's load-bearing for this codebase. Rejected.
3. **Allow free-form types** — rejected: defeats the purpose of standardization.

### Consequences

- Phase 003 must update sk-git's §3 type-priority list to the 13-type taxonomy.
- Phase 004 derivation-heuristics must encode the first-match scope rules.
- Subjects ≤72 chars (ADR-007).
- The packet-ID prefix style (`111 W3.X:`) is NOT a sanctioned subject form — it's handled retroactively per ADR-002.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Packet-ID Prefix Policy

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group B deliberation (Q2) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-packet-id.txt` — 5 representative commits from packet 111's W3.x sub-waves |

### Context

Packet 111's restructure work produced ~131+ commits prefixed `111 W{wave}.{sub-wave-letter}{-suffix}:` (e.g., `111 W3.A:`, `111 W3.D-B:`). The wave designator is operationally meaningful — it identifies the sub-wave within packet 111's 17+-task restructure plan. But it leaks an internal packet-management vocabulary into the public-facing log, and it bypasses the type/scope discipline established by ADR-001.

### Decision

**Strip the `<NNN> W{wave}.{sub-wave-letter}{-suffix}:` prefix from the subject. Derive type and scope from path analysis per `derivation-heuristics.md`. Preserve the wave designator as a `Wave:` body trailer when present.**

Examples:
- Before: `111 W3.A: author phase-parent base files for 006-skill-advisor/004-hardening`
- After (subject): `scaffold(006-skill-advisor/004-hardening): author phase-parent base files`
- After (body, last block): `Wave: 111-W3.A`

- Before: `111 W3.D-B: renumber 014-local-embeddings-migration/_047-handover-anchor-naming -> 047-handover-anchor-naming`
- After (subject): `refactor(014-local-embeddings-migration): renumber 047-handover-anchor-naming`
- After (body, last block): `Wave: 111-W3.D-B`

### Alternatives Considered

1. **Strip entirely (no preservation)** — Rejected: loses traceability from commit to wave plan.
2. **Fold into scope `feat(111-w3a):`** — Rejected: creates a parallel scope namespace that conflicts with spec-folder scope rules; `111-w3a` isn't a real path.
3. **Preserve verbatim** — Rejected: the prefix is exactly the leakage problem this packet exists to fix.

### Consequences

- Affects all `NNN W{wave}.{sub}:` prefixed commits across HEAD (roughly all of packet 111's restructure work, ~131+ commits).
- Phase 004's `derivation-heuristics.md` rule #1 handles the prefix extraction.
- Phase 004 must include the `Wave:` trailer in the mapping output schema.
- A future spec packet's internal wave nomenclature must NOT leak into subjects — that's a documentation convention going forward.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Existing Co-Authored-By Trailer Policy

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group B deliberation (Q3) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-coauthor.txt` — 5 commits already carrying trailers; recent commits use canonical GIT-007 form |

### Context

The Plan agent confirmed ~3,498 HEAD commits already carry `Co-Authored-By` trailers in various forms (different model names across eras). The current sk-git GIT-007 manual test mandates the canonical string `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`, which matches all 5 recent samples. Older commits authored by Opus 4.5 or 4.6 carry historically accurate trailers.

### Decision

**Format-normalize only. Preserve the actual model name / version / context / email exactly as authored. Normalize:**

1. Header case: `Co-Authored-By:` (exact). Reject `Co-authored-by:` and `Co-authored-By:` variants — rewrite to the canonical case.
2. Exactly one space after the colon.
3. Strip duplicate trailers (same name + email appearing twice in the same commit).
4. Strip trailers with empty values.
5. Collapse trailing whitespace.
6. Preserve all other content verbatim — `(1M context)`, `(200K context)`, different email handles, etc.

**For new commits** (going forward): use the canonical GIT-007 string with current model.

### Alternatives Considered

1. **Preserve verbatim, no normalization** — Rejected: leaves case/spacing inconsistency.
2. **Canonicalize all trailers to current Opus 4.7 form** — Rejected: factually wrong. Old commits weren't authored by 4.7. Loses historical accuracy.
3. **Date-based canonicalization (lookup model from commit date)** — Rejected: complex and brittle; introduces a date-to-model table that decays.

### Consequences

- The 3,498 historical commits will get format-normalized trailers but keep their actual model attribution.
- Phase 003 must keep GIT-007 expected-string check focused on *new* commits, not historical. The standard documents both states.
- Phase 004 derivation-heuristics §4 implements the normalization algorithm.
- Phase 005's filter-repo callback applies the normalization deterministically.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Imperative-Mood Enforcement (Retroactive)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group B deliberation (Q4) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-20.txt` — most subjects are imperative or noun-phrase; few are past-tense |

### Context

Modern sk-git mandates imperative mood. Of the 20-commit sample, ~12 use imperative ("amend", "ship", "reorganize", "scaffold", "move", "restore"), ~6 use noun-phrase subjects ("Tool Allignment", "research-findings-remediation — ship R1-R11", "T-SGC-04 arbitrary-length depends_on cycle detection"), and ~2 use past tense ("merged 013/014", "indexed"). Rewriting noun-phrase to imperative is mechanical (drop the article, verb-prefix). Rewriting past-tense is interpretive — "merged X" could become "merge X" or "integrate X" with different connotation.

### Decision

**Preserve original tense in retroactive rewrites. Imperative mood is the standard going forward but is NOT retroactively enforced.**

The retroactive rewrite mutates these aspects of historical subjects:
- Add/correct type prefix (if missing) per ADR-001
- Add/correct scope (if missing or wrong) per ADR-001
- Strip packet-ID prefixes per ADR-002
- Apply length cap per ADR-007 (trim verbose subjects)
- Fix typos when obvious (e.g., "Allignment" → "alignment")

The rewrite does NOT mutate verb form / tense.

### Alternatives Considered

1. **Rewrite all subjects to imperative** — Rejected: interpretive risk; could change meaning of past-tense entries ("integrated" vs "integrate" carry different finality connotations).
2. **Add a `Historical-Rewrite:` trailer marking pre-standard commits** — Rejected: visual noise; the rewrite is repo-wide so the trailer would be on every commit. The bundle + backup branch serve the same audit purpose.
3. **Only enforce imperative on subjects we're already rewriting** — Same as the chosen decision but framed as opt-in. Implicit in the chosen decision.

### Consequences

- Phase 004 cli-devin prompts must NOT include "rewrite to imperative mood" as a step.
- Phase 003 sk-git §3 documents imperative mood as a forward-going rule, with a note that retroactive rewrites preserve original tense.
- Hand-sample-validation will show this: noun-phrase subjects in the sample stay as noun-phrase in the rewrite output.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Body Policy When Diff Is Unrecoverable

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group C deliberation (Q5) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | Sample of bodies in `sample-coauthor.txt` shows existing-body commits have rich multi-paragraph structure; many sample-20 commits have no body at all |

### Context

Some commits have diffs too thin to support an authored body (pure renames, whitespace, content-less). Some have rich diffs but no body was authored at the time. The retroactive rewrite must decide whether to:
- Auto-author bodies (interpretive, risky — cli-devin would invent context)
- Preserve original body state (mechanical, safe)
- Flag for human review (deferred work)

### Decision

**Preservation-only. The retroactive rewrite does not author bodies.**

Specifically:
1. If original body is present → preserve verbatim (with trailer normalization per ADR-003 applied to the trailer block).
2. If original body is empty AND the diff is trivial (single file, ≤10 lines changed, mechanical) → leave body empty.
3. If original body is empty AND the diff is substantial (≥10 lines OR multi-file OR sensitive paths like SKILL.md / spec.md) → preserve empty body, emit `body_augmentation_recommended: true` flag in the rewrite mapping. **Phase 005 does not act on the flag** — it's deferred work for a future packet.

### Alternatives Considered

1. **Auto-author minimal bodies from `git show --stat`** — Rejected: introduces noise and ambiguous attribution. "Modified 5 files in sk-git" is less useful than empty body.
2. **Block phase close on any body-augmentation flag** — Rejected: would halt the rewrite indefinitely; the body absence is pre-existing, not introduced by this packet.
3. **Use cli-devin to interpret the diff and write the body** — Rejected: this is exactly the interpretive risk the rewrite is trying to minimize; produces non-reproducible mappings.

### Consequences

- Phase 004 cli-devin prompts must NOT include body-authoring as a step.
- Phase 004 output contract (`mapping.jsonl`) includes a `body_augmentation_recommended` boolean field, default false.
- A future packet can use the flagged commits as input for targeted body-authoring work.
- Phase 005 verification report should count flagged commits as a metric.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Merge / Revert / Fixup / Release Special Cases

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group C deliberation (Q6) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-merges.txt` — 5 merges show two forms in active use: `Merge branch 'X'` (git-default) and `merge: <descriptive>` (type-prefix); `release(NNN.MMM)` observed in main sample |

### Context

Standard git operations produce conventional message forms (`Merge branch 'X'`, `Revert "Y"`, `fixup! Z`) that are recognized by tooling. The repo also uses authored type-prefix forms (`merge: <descriptive>`, `release(NNN.MMM): …`). Special-cases need explicit rules so the rewrite doesn't mangle them.

### Decision

**Merge commits**:
- Accept both `Merge branch 'X' [into Y]` (git-default) and `merge: <descriptive>` (authored).
- Normalize whitespace only; don't restructure.
- Body preserved verbatim (often contains conflict resolution notes).

**Revert commits**:
- Form: `Revert "<original-subject>"` — preserve exactly.
- Body should explain WHY (regression, plan change). Phase 004 does NOT auto-author bodies for reverts (per ADR-005).

**Fixup commits**:
- Form: `fixup! <original-subject>` — preserve exactly.
- These ideally get squashed pre-merge; if they survive into history, leave them alone.

**Release commits**:
- Accept `release(<NNN.MMM>): <subject>` (preferred for spec-folder releases).
- Accept `release: v<X.Y.Z>` (preferred for semver-style version bumps).
- Body should reference the release notes if present in the original.

### Alternatives Considered

1. **Type-prefix ALL special cases** (`merge: <auto-generated content>`) — Rejected: would override git-default merges and require message restructuring during filter-repo apply.
2. **Strip git-default merge subjects** (`Merge branch 'X'` → `merge: branch 'X'`) — Rejected: low value, breaks tooling that recognizes `Merge ` prefix.
3. **Reject `release: vX.Y.Z` in favor of `release(repo): vX.Y.Z`** — Rejected: the explicit form `release: vX.Y.Z` is conventional and recognized by changelog tooling.

### Consequences

- Phase 004 derivation-heuristics has explicit recognition rules for each special case (§5 of that doc).
- Phase 005 verification: confirm 24 HEAD merges preserved post-filter-repo, none flattened.
- The `filter-repo` invocation in Phase 005 plan §4 Stage 7 must NOT include `--prune-empty=always` (would flatten merges with no diff after message change).
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Length Caps

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decided By** | Group A deliberation (Q7) |
| **Decided On** | 2026-05-16 |
| **Reasoning Anchor** | `evidence/sample-20.txt` lengths: shortest 32, median 70, max 101 chars |

### Context

Current sk-git template: subject <50 chars, body wrap 72. Observed reality: median 70, ~5% exceed 100. Hierarchical scope prefix alone can consume 22+ chars. Strict 50-char cap is too tight given the codebase's spec-folder discipline.

### Decision

**Subject**:
- **Hard cap**: 72 characters (Conventional Commits 1.0.0 reference line length).
- **Soft guidance**: 50 characters for happy-path commits (single-skill, single-spec, no finding refs).
- Measured in display characters (not bytes). UTF-8 em-dashes count as 1.
- Trim during retroactive rewrite when length exceeds 72; preserve information by moving detail to body.

**Body**:
- **Wrap**: 72 characters per line.
- **Max length**: no hard cap.
- **Guidance**: bodies exceeding 30 lines warrant considering whether the commit should be split — informational, not enforced.

### Alternatives Considered

1. **50-char hard subject cap** (current sk-git) — Rejected: too tight for spec-folder scope notation; would force every multi-spec commit to have a body just to capture detail that fits in 72.
2. **100-char hard subject cap** — Rejected: hurts `git log --oneline` readability in narrow terminals.
3. **No hard cap, only guidance** — Rejected: the retroactive rewrite needs a clear gate; without one, "trim long subjects" becomes an interpretive decision per commit.

### Consequences

- Phase 003 sk-git §3 documents both the 72-char hard cap and the 50-char soft guidance.
- Phase 004 derivation-heuristics §6 enforces 72 during rewrite (and §6 specifies the trim algorithm: move trailing parenthetical refs and finding IDs to the body if they push past 72).
- Roughly 5% of HEAD subjects exceed 72 and will be trimmed.
- Subject trimming MAY require body augmentation per ADR-005 — flagged but not auto-fixed.
<!-- /ANCHOR:adr-007 -->

---

## ADR Index

| ADR | Group | Decision | Status |
|-----|-------|----------|--------|
| ADR-001 | A | Subject format: `type(scope): subject` with 13-type taxonomy + 5 scope shapes | Accepted |
| ADR-002 | B | Packet-ID prefix → strip from subject, preserve as `Wave:` body trailer | Accepted |
| ADR-003 | B | Co-Authored-By → format-normalize only, preserve actual model attribution | Accepted |
| ADR-004 | B | Imperative-mood: forward-only; retroactive rewrites preserve original tense | Accepted |
| ADR-005 | C | Body: preservation-only, no auto-authoring; flag-don't-fix for augmentation candidates | Accepted |
| ADR-006 | C | Special cases: accept both git-default and authored forms for merge/revert/fixup/release | Accepted |
| ADR-007 | A | Length: 72-char subject hard cap (50-char soft), 72-char body wrap, no body max | Accepted |
