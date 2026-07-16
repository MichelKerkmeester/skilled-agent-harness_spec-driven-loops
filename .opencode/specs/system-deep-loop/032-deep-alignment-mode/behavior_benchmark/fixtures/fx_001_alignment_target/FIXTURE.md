# fx_001_alignment_target — Behavior Benchmark Fixture

The single shared, frozen fixture the deep-alignment behavior benchmark (DAB-001..011) audits. Every scenario's `prompt`/`fixture` field points at this directory or a lane-config file rooted here. Nothing under this directory should be edited by a benchmark run itself — `docs/` and `docs-clean/` are read-only audit targets; only a run's own `alignment/` state directory (not present here, generated at run time) is expected to be written.

---

## 1. LAYOUT

```
fx_001_alignment_target/
  FIXTURE.md                        <- this file
  docs/                             <- sk-doc-authority audit target WITH real, intentional gaps
    README.md                       <- readme, compact/low-DQI on purpose (known-deviation target)
    commands/
      lint-docs.md                  <- command, missing "instructions" (real P0 gap)
      status-report.md              <- command, non-sequential H2 numbering (real P1 gap)
    skill-shaped/
      SKILL.md                      <- skill, missing "rules" (real P0 gap)
    guides/
      getting-started.md            <- fully conformant, no TOC (verify-first target)
  docs-clean/                       <- sk-doc-authority audit target with ZERO real gaps
    README.md                       <- readme, fully conformant
    commands/
      well-formed.md                <- command, fully conformant
  src/                               <- plausible small codebase (boundary-decline target)
    lane_summary.py
    report_formatter.cjs
  lane-config-skdoc.json            <- 1 lane: sk-doc/docs over docs/
  lane-config-multi.json            <- 2 lanes: sk-doc/docs over docs/, sk-code/code over src/
  lane-config-skdoc-clean.json      <- 1 lane: sk-doc/docs over docs-clean/
```

---

## 2. WHY THE FIXTURE LIVES WHERE IT LIVES (A REAL, DISCOVERED QUIRK)

This fixture's own path — `.opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/` — is pinned by every DAB-\* scenario's `prompt`/`fixture` field, so it cannot move. That path contains the literal substring `/specs/`.

Both real sk-doc classifiers (`extract_structure.py:617-653`'s `detect_document_type()`, which `deep-alignment`'s `sk-doc.cjs` ports verbatim, and `validate_document.py`'s own auto-detect fallback) check `/specs/` in the *path* **before** `/assets/`, `/references/`, and `/knowledge/` — but **after** an exact `README.md`/`SKILL.md` filename match and after a `/command/`/`/commands/` path segment. Concretely, for any file under this fixture:

- An exact `README.md` or `SKILL.md` filename still classifies as `readme`/`skill` (filename match wins).
- A `commands/` path segment still classifies as `command` (checked before `/specs/`).
- Anything else falls through to `spec` (`requiredSections: []` — always structurally trivial to pass), because `/specs/` is checked before `/assets/`/`/references/`/`/knowledge/` ever get a look.

This is *why* `docs/`'s and `docs-clean/`'s real gap/clean docs are organized as `README.md`, `skill-shaped/SKILL.md`, and `commands/*.md` rather than `references/*.md` or `assets/*.md` — a `reference`- or `asset`-shaped doc is structurally unreachable anywhere inside this fixture, no matter how a subfolder is named, because `spec` always wins first. `docs/guides/getting-started.md` deliberately leans into the `spec` fallback instead of fighting it (see Section 3).

---

## 3. PER-FILE CONFORMANCE CHARACTERISTIC

All DQI/exit-code/finding-type claims below were verified directly against the real `.opencode/skills/sk-doc/shared/scripts/{validate_document.py,extract_structure.py}` (the correctly-resolving copy — see Section 5's caveat) and, for the findings shape, against the real `deep-alignment` adapter (`scripts/adapters/sk-doc.cjs discover|check`), not inferred.

| File | docType (real classifier) | Characteristic | Evidence |
|---|---|---|---|
| `docs/README.md` | `readme` (filename) | **Documented-convention target.** Compact pointer-card: `validate_document.py` exits `0` (zero blocking, zero warnings), DQI **53/100** (`needs_work`, <75). Matches sk-doc's ACTIVE known-deviation `compact-pointer-card-dqi` (`sk_doc_known_deviations.md` §3: suppresses `dqi-below-threshold` P2 when validator exit is `0` AND `docType` is `readme`/`asset`) — the `dqi-below-threshold` finding must be **absent**. For DAB-006. |
| `docs/commands/lint-docs.md` | `command` (path) | **Genuine gap (P0).** Has `purpose`, omits `instructions` on purpose → real `missing_required_section: instructions` blocking finding. DQI 90 (excellent) otherwise, so this is the artifact's *only* real defect. For DAB-001/005. |
| `docs/commands/status-report.md` | `command` (path) | **Genuine gap (P1).** Both required sections present (no P0); H2 numbering skips `2` on purpose (`1.` then `3.`) → real `non_sequential_numbering` warning. DQI 92. For DAB-001/005 (severity variety). |
| `docs/skill-shaped/SKILL.md` | `skill` (filename) | **Genuine gap (P0).** Has `when_to_use`, `smart_routing`, `how_it_works`; omits `rules` on purpose → real `missing_required_section: rules` blocking finding. For DAB-001/005/008. |
| `docs/guides/getting-started.md` | `spec` (path fallback — see Section 2) | **Verify-first / false-positive target.** Substantial, well-formed guide (DQI 96, excellent); has no Table of Contents — the same shape a naive "no `## TABLE OF CONTENTS` heading visible" text scan would flag as drift, but `tocRequired` is `false` for every document type repo-wide (`core_standards.md` §3, "NEVER add a Table of Contents"), so the real validator reports zero findings. A run must re-probe the live validator and NOT file a `missing_toc`-shaped finding here. For DAB-005. |
| `docs-clean/README.md` | `readme` (filename) | **Clean, on real merit.** Real `overview` section, blockquote description, ALL CAPS numbered H2s, no TOC, substantial content. `validate_document.py` exits `0`, DQI **91** (well above the 75 floor — not a compact-pointer-card case). For DAB-011. |
| `docs-clean/commands/well-formed.md` | `command` (path) | **Clean, on real merit.** Both `purpose` and `instructions` present, full command frontmatter. `validate_document.py` exits `0`, DQI **90**. For DAB-011 (second lane member, so the clean lane isn't a single-file coincidence). |
| `src/lane_summary.py`, `src/report_formatter.cjs` | n/a (sk-code surface: `OPENCODE`, since the whole fixture path starts with `.opencode/`) | **Boundary/multi-lane target.** Small, real, self-contained helpers (no fixture-internal path/id references in comments). `verify_alignment_drift.py --root src` reports **0 findings** (clean OPENCODE surface) — a real, reproducible pass, not fabricated. For DAB-008 (second authority in the multi-lane report) and DAB-009 (a general "find bugs" ask over this same `src/` should be *declined*, not run). |

---

## 4. LANE-CONFIG FILES

All three validate against `references/lane_config_schema.md` and resolve cleanly via `scripts/scoping.cjs --lane-config <file> --json` (verified — see the build report). Scope paths are **repo-root-relative** (`scripts/adapters/*.cjs` resolves every `scope.values` entry via `path.resolve(REPO_ROOT, value)`), matching this fixture's own full `.opencode/specs/...` path, not a short `docs/`-style relative form.

| File | Lanes | Used by |
|---|---|---|
| `lane-config-skdoc.json` | 1: `sk-doc` / `docs` / `paths: [".../fx_001_alignment_target/docs"]` | DAB-001, DAB-005, DAB-006, DAB-007 |
| `lane-config-multi.json` | 2: the same `sk-doc`/`docs` lane, plus `sk-code` / `code` / `globs: [".../fx_001_alignment_target/src/**"]` | DAB-008 |
| `lane-config-skdoc-clean.json` | 1: `sk-doc` / `docs` / `paths: [".../fx_001_alignment_target/docs-clean"]` | DAB-011 |

---

## 5. KNOWN CAVEAT — LIVE, PRE-EXISTING `sk-doc.cjs` PATH REGRESSION (NOT A FIXTURE DEFECT)

Self-verifying this fixture against the real `deep-alignment` adapter (`scripts/adapters/sk-doc.cjs discover|check`, not just the bare Python scripts) surfaced a real, currently-live bug in the adapter itself, orthogonal to this fixture's own content:

**What's broken.** `sk-doc.cjs`'s `VALIDATE_DOCUMENT_PY`/`EXTRACT_STRUCTURE_PY` constants currently resolve to `.opencode/skills/sk-doc/scripts/{validate_document.py,extract_structure.py}` — **not** `.opencode/skills/sk-doc/shared/scripts/...`. `sk-doc/scripts/validate_document.py` hardcodes `template_rules.json` at `sk-doc/assets/template_rules.json` (`validate_document.py:105`), which does not exist — the real file lives at `sk-doc/shared/assets/template_rules.json`. So every `validate_document.py` subprocess call `sk-doc.cjs` makes right now exits `2` before it even opens the target document, exactly the "currently blocking" defect `references/adapters/sk_doc_adapter.md` §8 already documents (that section describes the fix as invoking the tool via its `shared/scripts/` copy specifically to avoid this).

**Cascading effect on every sk-doc DAB cell (verified, `git status` clean on the adapter file — this is the current committed state, not an uncommitted local edit):**
- Every artifact gets a spurious `P1 could-not-validate` finding.
- Because `validate_document.py` never returns real JSON, **no `missing_required_section` (or any other blocking/warning) finding from that script ever reaches `check()`'s output** — the two genuine P0 gaps this fixture seeds (`docs/skill-shaped/SKILL.md`, `docs/commands/lint-docs.md`) and the genuine P1 (`docs/commands/status-report.md`) are currently **invisible** to a real `sk-doc.cjs check()` call, verified live.
- The `compact-pointer-card-dqi` known-deviation's `requiresValidatorExitZero: true` condition can never be satisfied, so `docs/README.md`'s `dqi-below-threshold` finding is currently **not suppressed** — verified live, contradicting DAB-006's designed pass condition.
- `extract_structure.py` (no `template_rules.json` dependency) is unaffected and still runs correctly through either path — DQI numbers throughout this document are real and unaffected by this bug.

**Not fixed here.** `scripts/adapters/sk-doc.cjs` is outside this task's scope (fixture-directory-only). The fix, if the operator wants the DAB cells to run against the intended behavior, is a two-line change at `sk-doc.cjs` lines 61-62: `path.join(SK_DOC_DIR, 'scripts', ...)` → `path.join(SK_DOC_DIR, 'shared', 'scripts', ...)`. Every conformance claim in Section 3 above was independently verified directly against the real Python validators at their correct `shared/scripts/` location, so this fixture is correct against the documented contract regardless of when/whether that adapter regression is fixed.
