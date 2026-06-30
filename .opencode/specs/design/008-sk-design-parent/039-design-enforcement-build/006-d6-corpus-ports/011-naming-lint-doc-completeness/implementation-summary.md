---
title: "Implementation Summary: D6-R11 Naming lint + doc completeness contract"
description: "Post-build record for the conditional design-system artifact contract: a new reference page (token tiers, per-tier naming regexes, required doc headings), a deterministic naming_doc_check.py lint with an applicability gate, and a committed compliant/violating fixture pair. token_starter.md passes (exit 0), the violating fixture bites (exit 1), non-system docs incl. the 22-file OVERVIEW backlog stay exempt, and only 3 NEW files were added."
trigger_phrases:
  - "d6-r11 naming lint implementation summary"
  - "naming doc check build record"
  - "design-system artifact contract summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/011-naming-lint-doc-completeness"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the naming/doc lint build and the pass/bite/exempt verification"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py"
      - ".opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/compliant.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-naming-lint-doc-completeness |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverables** | A new `design_system_artifact_contract.md` reference page + the deterministic `naming_doc_check.py` lint with a conditional applicability gate + a committed `fixtures/naming_doc/{compliant.md,violating.md}` pair |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

sk-design had a token-category vocabulary and a fill-in token scaffold, but no enforceable contract for how design-system outputs must be named or which sections they must carry. A token or component artifact could ship with inconsistent names or a missing handoff section and nothing would bite. This phase ports a conditional naming + doc-completeness contract that applies only to design-system artifacts and backs it with a deterministic lint. A malformed token name (camelCase, underscore, or an off-allowlist category) or a missing required heading on an applicable artifact now fails closed, while every non-system document stays exempt. It ships three NEW additive files; no existing file was edited.

### The contract reference page

`design_system_artifact_contract.md` is the human-readable single source of the rules. It defines eight token tiers (neutral ramp, color role, spacing base, surface, text, type, elevation/shape, motion/state) each with one naming regex, and the required doc headings per artifact kind: `token` needs COLOR RAMP, TYPE SCALE, SPACING SCALE, and HAND OFF; `component` and `library` headings are defined but dormant because no such artifact exists on the surface yet. Names are lowercase CSS custom properties, category-led, kebab-case, hyphen-not-underscore. The page carries a compliant worked shape and a labelled anti-example, and is evergreen (no spec id or path).

### The deterministic lint with a conditional applicability gate

`naming_doc_check.py` takes a target markdown path plus optional `--json` and exits 0 (clean or not applicable), 1 (naming/doc violation), or 2 (usage/read error), matching the sibling foundations checkers. Its applicability gate runs the lint only on a design-system artifact: a document is linted when it declares `artifactKind: token|component|library` in frontmatter, or when it carries both a markdown token table and the full token-artifact heading set. Anything else returns `NOT_APPLICABLE` and exits 0. This gate is what exempts screen/flow notes, reference theory, vocabulary pages, and skill docs, so the queued 22-file `## OVERVIEW`-template backlog is correctly never reached. On an applicable artifact the lint extracts declared `--token` names, binds each to its tier regex, reports any offender with a reason, then checks each required heading is present (numeric-prefix and alias tolerant) and reports any missing heading.

### The committed fixture pair

`fixtures/naming_doc/{compliant.md,violating.md}` makes the bite permanently provable. `compliant.md` is a marked token artifact whose names and headings all conform; `violating.md` is a marked token artifact that packs three malformed names (`--PrimaryColor`, `--color_primary`, `--clr-primary`) and omits the SPACING SCALE heading, so it exercises both the naming bite and the doc-completeness bite in one run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md` | Created | The contract page: token tiers, per-tier naming regexes, required doc headings per artifact kind, compliant + anti examples |
| `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` | Created | The lint: applicability gate, token-name extraction + per-tier regex check, required-heading presence check, text/`--json` output, exit 0/1/2 |
| `.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/compliant.md` | Created | A marked token artifact that passes (evergreen regression guard) |
| `.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/violating.md` | Created | A marked token artifact with three malformed names + a missing heading (the permanent bite) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) created the three new files; the orchestrator then verified acceptance independently rather than trusting the claim, and every number below was re-confirmed at doc time by running the lint directly without pipe-masking.

On the real artifact `assets/token_starter.md` the lint detects `artifact kind: token (token table with token-artifact headings)`, reads 25 declared token names, confirms all four required headings, and prints PASS at exit 0. The committed `fixtures/naming_doc/compliant.md` also exits 0. The bite is proven on `fixtures/naming_doc/violating.md`: detected as a token artifact via its `artifactKind` frontmatter, it reports `--PrimaryColor` (camelCase/uppercase), `--color_primary` (underscore), and `--clr-primary` (off-allowlist category) plus a missing SPACING SCALE heading, and exits 1. The applicability gate is proven on two non-system inputs: `shared/design_token_vocabulary.md` returns `NOT_APPLICABLE - no design-system artifact marker` at exit 0, and a sk-design `SKILL.md` (a representative of the 22-file OVERVIEW backlog) likewise returns NOT_APPLICABLE at exit 0, so the backlog is never flagged. Usage and read errors both return exit 2 (no argument; unreadable path). `python3 -m py_compile scripts/naming_doc_check.py` exits 0.

No-regression holds by construction, not by a suite run. `git status` shows exactly three new untracked entries under sk-design (the contract page, the lint script, and the `fixtures/` directory) and nothing else; `assets/token_starter.md`, `shared/design_token_vocabulary.md`, `design-foundations/SKILL.md`, and `sk-design/SKILL.md` are all byte-unchanged. The lint never writes, so it cannot mutate the artifact it lints.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the lint conditional behind an applicability gate | Pointing the lint at any file or sweeping it over the tree must never false-positive on screen/flow, reference, vocabulary, or skill docs; only a marked design-system artifact is in scope |
| Detect an artifact by `artifactKind` frontmatter OR a token table plus the full token-heading set | The frontmatter marker is explicit; the table-plus-headings path lets the existing `token_starter.md` scaffold pass without editing it |
| Derive the tier regexes to pass `token_starter.md` as-shipped | The one artifact on the surface must stay valid, so the regexes accept its 25 names and bite a malformed one rather than forcing a rename |
| Commit a fixture pair instead of a scratch-only probe | A permanent `compliant.md` / `violating.md` keeps the bite provable on every future run without re-deriving a probe |
| Keep the lint report-only, no auto-fix | The gate enforces name shape and heading presence; rewriting an artifact is out of scope and would risk silent mutation |
| Scope the 22-file OVERVIEW backlog out by construction | Those docs carry no artifact marker, so the applicability gate exempts them; OVERVIEW template-conformance is a separate concern |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m py_compile scripts/naming_doc_check.py` | PASS, exit 0 |
| Pass-on-clean (real artifact `assets/token_starter.md`) | PASS, `artifact kind: token`, 25 token names, all 4 required headings, exit 0 |
| Pass-on-clean (`fixtures/naming_doc/compliant.md`) | PASS, exit 0 |
| Naming bite (`fixtures/naming_doc/violating.md`) | PASS, exit 1, reports `--PrimaryColor` / `--color_primary` / `--clr-primary` with reasons |
| Doc-completeness bite (same fixture) | PASS, exit 1, reports `missing heading SPACING SCALE` |
| Non-system exemption (`shared/design_token_vocabulary.md`) | PASS, `NOT_APPLICABLE - no design-system artifact marker`, exit 0 |
| OVERVIEW-backlog non-flag (sk-design `SKILL.md` representative) | PASS, NOT_APPLICABLE, exit 0, so the 22-file backlog is never reached |
| Usage/read errors | PASS, no-arg and bad-path both exit 2 |
| NO-REGRESSION: additive by construction | PASS, `git status` shows the 3 new files untracked; `token_starter.md` / `design_token_vocabulary.md` / both `SKILL.md` byte-unchanged |
| Scope clean (only 3 NEW files) | PASS, no live `.opencode/skills` file was edited by this phase folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Code-enforced is name SHAPE plus heading PRESENCE only.** The lint guarantees that, on an applicable artifact, every declared token name matches its tier regex and every required heading exists. It cannot certify that a well-formed name is the right concept (whether `--color-primary` is the tasteful role is human judgment) or that a present heading documents complete, correct content. Naming taste and doc substance stay advisory.
2. **Only the token artifact kind is exercised on the current surface.** `component` and `library` tiers and required headings are defined in the contract but dormant because no component or library artifact exists yet; they activate when such an artifact ships with its `artifactKind` marker.
3. **The 22-file OVERVIEW template-conformance backlog is deliberately out of scope.** Those skill/reference docs carry no artifact marker, so the applicability gate exempts them; closing that backlog is a separate template-conformance effort, not part of this contract.
4. **Target-derivation honesty.** spec §3 named only the `references/` directory as the target, but spec §4/§5 mandate an executable lint over names and headings, so the lint script and the fixtures are in-scope enforcement targets the same spec demands, mirroring how the sibling foundations checkers pair a reference page with an executable check.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the conditional design-system artifact contract + naming_doc_check.py + the fixture pair
- Additive by construction (3 NEW files, zero edits); token_starter.md passes, the violating fixture bites, non-system docs incl. the OVERVIEW backlog stay exempt
- Name + heading SHAPE code-enforced; naming taste + doc substance advisory
-->
