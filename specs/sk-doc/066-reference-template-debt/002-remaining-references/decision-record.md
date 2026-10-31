---
title: "Decision Record: Phase 2: remaining-references"
description: "Why four sample DESIGN.md files and design-md-format.md leave the validator's failing list through one exact-suffix exemption list, and what that list costs."
trigger_phrases:
  - "remaining references decision record"
  - "design md sample exemption"
  - "design md format numbering"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/074-reference-template-debt/002-remaining-references"
    last_updated_at: "2026-10-29T23:59:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Accepted ADR-001 and ADR-002 as one exact-suffix exemption list in validate_document.py"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_format_spec_exclusion.py"
      - "scratch/validate-after-exemption.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-277-reference-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The sample DESIGN.md files leave the failing list by exact path suffix, not by a folder pattern"
      - "design-md-format.md is exempted by exact path suffix and keeps its 0 to 16 numbering"
---
# Decision Record: Phase 2: remaining-references

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Exempt the Sample DESIGN.md Files by Exact Path Suffix

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase, which implemented the change |

---

<!-- ANCHOR:adr-001-context -->
### Context

Four files, `references/examples/{linear,stripe,supabase,vercel}/DESIGN.md` under `sk-design-md-generator`, each failed `validate_document.py` with one issue: a missing overview section. They are not references in the sense the format means. Each is a finished sample of what the md-generator produces, kept as study material, and its shape is the one `design-md-format.md` prescribes: an H1, a short blockquote, an unlabeled intro paragraph and unnumbered sections for the color and type tokens. The validator typed them as `reference` only because their path holds `/references/`.

Fixing them as references would change the sample. `design-md-format.md` line 66 says the intro paragraph is unlabeled and sits directly under the header, so a labeled `## 1. OVERVIEW` would contradict the format the sample teaches.

### Constraints

- Before this change the validator skipped a path by three mechanisms: the `FIXTURE_TREE_PATTERNS` list of path substrings, the `INSTRUCTION_FILE_NAMES` list of exact file names such as `AGENTS.md`, and folders named `fixture` or `fixtures`. None of them names one file by its path.
- The brief for this phase forbids a new validator feature without a test.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A new list, `FORMAT_SPEC_FILES`, in `validate_document.py`, holding five exact path suffixes: the four sample `DESIGN.md` files and `design-md-format.md` (ADR-002). `should_exclude_path` skips a path that ends with `/` plus one of them, with the reason `Format spec: its section numbers are the DESIGN.md format's ids`.

**Amended from the proposal**: The proposal was one folder-wide substring, `'sk-design-md-generator/references/examples/'`, appended to `FIXTURE_TREE_PATTERNS`. That entry would also have skipped the four `writing-notes.md` files beside the samples, which this phase fixed and which pass today. Matching each sample by its exact suffix keeps those notes validated, so the cost the proposal named does not arise. A separate list also gives these files their own skip reason, so the report no longer calls a format spec a fixture tree.

**How it works**: The test `.skilled/skills/sk-doc/scripts/tests/test_format_spec_exclusion.py` holds two tests. The first asserts that `design-md-format.md` and `examples/stripe/DESIGN.md` are skipped with a reason that starts `Format spec`. The second asserts that `examples/stripe/writing-notes.md` is not excluded, which shows the match stops at the named files. `/usr/bin/python3 -m pytest -q` over this file and `test_instruction_file_exclusion.py` printed `4 passed`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exact path suffixes in a new list** | Five lines, a reason the next reader can check, and the `writing-notes.md` siblings stay validated | A new sample needs its own line | 9/10 |
| One folder pattern in `FIXTURE_TREE_PATTERNS` (the original proposal) | One line and an existing mechanism | The four `writing-notes.md` files stop being validated, and the skip reason calls them a fixture tree | 7/10 |
| Add `DESIGN.md` to `INSTRUCTION_FILE_NAMES` | One line, and the notes stay validated | The list is for runtime instruction files and its reason text says so, and every future file with that name is skipped | 5/10 |
| Add an overview and numbered sections to the four samples | Needs no validator change | The samples stop matching the format they demonstrate | 2/10 |

**Why this one**: Only an exact list keeps the samples as the format defines them while every other file in the folder stays under the validator.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The failing list over the 454 tracked references drops from 5 files to 0, and the four samples stay as they are.
- The four `writing-notes.md` files still report `Total issues: 0` and are not skipped.

**What it costs**:
- A new sample under `examples/` is validated as a reference until someone adds its suffix. Mitigation: it then fails with a missing overview, which points straight at this list.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A sample is renamed or moved and its old suffix lingers | L | A stale suffix skips nothing, and the moved sample fails visibly until the list is updated |
| The list grows into a general escape hatch | M | Its comment and skip reason name the DESIGN.md format, so an unrelated entry stands out in review |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four files failed and no edit clears them without changing the sample |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared above |
| 3 | **Sufficient?** | PASS | One list, one check and one test file |
| 4 | **Fits Goal?** | PASS | The goal says to record the smallest exemption where a doc is a sample output |
| 5 | **Open Horizons?** | PASS | A later sample needs one more suffix, which is visible in review |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changed**:
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py`: the `FORMAT_SPEC_FILES` list of five suffixes and one check in `should_exclude_path`.
- `.skilled/skills/sk-doc/scripts/tests/test_format_spec_exclusion.py`: the two tests above.

**Observed result**: The sweep over all 454 tracked references reads 445 OK, 0 FAIL and 9 SKIPPED (`scratch/validate-after-exemption.tsv`). The only rows that changed against `scratch/final-validate.tsv` are the five named files, each from FAIL to SKIPPED.

**How to roll back**: Remove the list, the check and the test file. The four samples return to one issue each and `design-md-format.md` to two.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep the Schema Numbers in design-md-format.md and Exempt It by Exact Path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase, which implemented the change |

---

<!-- ANCHOR:adr-002-context -->
### Context

`design-md-format.md` failed with 2 issues: a missing overview section and a warning that numbering starts at 0. The numbering is deliberate. The doc defines the v3 Style Reference schema, and its section numbers 0 to 16 are the schema's identifiers: `## 0. CARDINAL RULES`, `## 3.` for the color tokens, `## 8. SURFACES`, `## 9. ELEVATION` and `## 13. AGENT PROMPT GUIDE`. Four TypeScript scripts in the generator's backend cite them in comments (`formatters-v3.ts`, `validate.ts`, `cluster.ts` and `extract.ts`, 9 hits for `§N` or `Section N`). Twenty-nine markdown files in the same skill carry 69 such hits, including the cardinal rules card, the authoring boundary, the anti-patterns reference and several playbook scenarios. At least one hit, `validate.ts` line 284 ("Section 2.5"), cites the older v2 numbering, so the hits are not all about this file.

The overview error cannot be cleared on its own. A copy of the doc with an unnumbered `## OVERVIEW` ahead of section 0 still reported both issues, recorded in `scratch/adr-checks/option-c-unnumbered-overview.txt`. A numbered overview has to be section 1, and that shifts every schema identifier.

### Constraints

- Renumbering moves identifiers that code comments, the cardinal rules card and playbook checks rely on, and no script can tell which of the 78 hits cite this file, `SKILL.md` or the v2 schema.
- The validator had no per-file exemption, as ADR-001 records.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Leave the doc as it is and exempt it by exact path suffix, `'sk-design-md-generator/references/design-md-format.md'`, as one entry of the `FORMAT_SPEC_FILES` list ADR-001 adds.

**How it works**: The suffix matches this one file. The first test in `test_format_spec_exclusion.py` asserts that it is skipped with the `Format spec` reason, and the sibling test from ADR-001 shows the match stops at the named files. The proposal put this entry in `FIXTURE_TREE_PATTERNS`, and it moved to the new list for the same reason ADR-001 gives.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exempt by exact path, together with ADR-001** | No schema identifier moves, and the cost is one list entry | The schema doc is no longer checked for format drift | 7/10 |
| Renumber 0 to 16 as 1 to 17 and sweep all 78 hits by hand | The doc passes with no exemption | A missed or wrong hit points a code comment or the cardinal rules card at the wrong section, and the validator cannot see it | 3/10 |
| Add an unnumbered overview only | Smallest edit | Tested: both issues remain | 1/10 |

**Why this one**: The only gain from renumbering is a green row, and the price is the risk of silently moving a schema identifier that other files cite.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The failing list drops to zero now that ADR-001 and this entry have landed together.
- Schema identifiers keep their meaning in every comment and card.

**What it costs**:
- The doc is no longer checked for the rest of the format, such as capitalised titles. Mitigation: the two issues it reported before are its full baseline, so a run with `--no-exclude` shows whether an edit added a third.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The doc drifts from the reference format unseen | L | Run the validator with `--no-exclude` to see the full list, which before this change was the two issues above |
| An operator later wants it renumbered | M | The option stays open, with the 78-hit inventory above as the starting list |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The doc failed and cannot be fixed without moving identifiers |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above, one of them run |
| 3 | **Sufficient?** | PASS | One list entry |
| 4 | **Fits Goal?** | PASS | The goal says no section reference may break |
| 5 | **Open Horizons?** | PASS | Renumbering stays possible later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changed**:
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py`: the `design-md-format.md` entry in `FORMAT_SPEC_FILES`.
- `test_format_spec_exclusion.py`: the doc is one of the two paths the first test asserts as skipped.

**Observed result**: `design-md-format.md` reports SKIPPED in `scratch/validate-after-exemption.tsv`.

**How to roll back**: Remove the entry. The doc returns to 2 issues.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
