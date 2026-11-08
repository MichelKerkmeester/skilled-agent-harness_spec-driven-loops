# Iteration 7 — Q10 orphan sweep (method redo) + Q11 validator error text

**Date:** 2026-11-08
**Segment:** 1 | **Iteration:** 7 of 10
**Focus:** REDO key question 10 with a concrete inbound-reference method across all four hubs; then key question 11 UX by running two sk-doc validators on deliberately broken copies under `/tmp`. Cover the v4.0.1.0 *Frontend Surface* and *Clearer Skill Docs* claims.

---

## 1. FOCUS

Two jobs:

1. **Q10, done properly.** Prior iterations asserted orphan/dead-file claims without a full enumeration. This iteration enumerates *every* file under `references/` and `assets/` in sk-doc, sk-code, sk-design and sk-prompt, then tests each one for inbound references, and classifies what kind of reference it is.
2. **Q11, measured not guessed.** Build deliberately broken inputs under `/tmp`, run sk-doc's own validators, and quote the exact text an operator sees — plus repair the input one error at a time to see whether the validator reports everything or only the first thing.

---

## 2. ACTIONS TAKEN

| # | Action | Command shape |
|---|---|---|
| 1 | Counted authored `references/`+`assets/` files per hub | `find .skilled/skills/<hub> -type f \( -path '*/references/*' -o -path '*/assets/*' \) -not -path '*/node_modules/*'` |
| 2 | Naive basename orphan test (all 472 incl. vendored) | `rg -l -F "<basename>" .skilled` |
| 3 | Corrected test: last-two- and last-three-segment path match, self excluded | `rg -l -F -e "<tail2>" -e "<tail3>" .skilled` |
| 4 | Split references into *agent-routable* vs *manifest-only* vs *changelog-only* | post-process of (3), filtering `leaf-manifest.json` and `changelog/` |
| 5 | Checked whether the vendored `node_modules` inflating the count is tracked | `git ls-files`, `git check-ignore -v` |
| 6 | Ran `validate_skill_package.py` on a broken skill, 3 successive repairs | `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py /tmp/skdoc-probe/broken-skill` |
| 7 | Ran `validate_document.py` on a broken doc | `python3 .skilled/skills/sk-doc/scripts/validate_document.py /tmp/skdoc-probe/docs/broken.md` |
| 8 | Ran `package_skill.py --strict` and `--check` on a skill with no `ROUTER.md` | `python3 .skilled/skills/sk-doc/scripts/package_skill.py /tmp/skdoc-probe/no-router --strict` |
| 9 | Established a healthy control | `validate_document.py .skilled/skills/sk-prompt/SKILL.md` → exit 0, 0 issues |
| 10 | Traced the link-resolution scope in `validate_document.py` | `sed -n '2170,2200p'`, `rg -n "def _code_folder"` |
| 11 | Confirmed which sibling palette sheets have consumers | `rg -n "palette-sheet-ordered\|palette-sheet-categorical\|palette-sheet-neutral"` |

**Method correction worth recording.** My first strict pass searched each file's *full* path suffix from the hub root (`sk-design-chart/assets/templates/histogram.html`) and reported 78 sk-design orphans. That was a **false positive**: `catalog.md` cites the skeleton and templates *mode-relative* (`assets/templates/histogram.html`). Re-running with last-two/last-three-segment matching returned **zero** orphans in every hub. The 78 number must not enter the registry.

---

## 3. FINDINGS

### Q10 — the orphan hypothesis is false

**F7-0 (observation, non-finding).** 443 authored files sit under `references/`+`assets/` across the four hubs, distributed sk-doc 135, sk-code 118, sk-design 183, sk-prompt 7. Under a path-suffix test with self-reference excluded: **0 files have zero inbound references.** 439 are referenced by something an agent actually loads; 4 are referenced *only* by `leaf-manifest.json`.

A separate counting trap: `find` without `-not -path '*/node_modules/*'` returns 472 files, because sk-design ships 2,160 on-disk playwright files. Those are **not tracked** (`git ls-files` → 0) and are gitignored via `.skilled/.gitignore:1`. Any future orphan audit must exclude them or it will report 26 phantom orphans.

---

**F7-1 — `palette-sheet-ordered.html` and `palette-sheet-categorical.html` have no consumer anywhere**
- **Type:** 6 over-engineering
- **Severity:** P2
- **Release:** v4.0.0.0 (baseline; present at v4.0.2.0)
- **Evidence:** `[SOURCE: .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palette-sheet-categorical.html:6]` — the only non-manifest mention of either file is its own self-declaration `<meta name="chart-template" content="palette-sheet-categorical">`. `[SOURCE: .skilled/skills/sk-design/sk-design-chart/references/template-contract.md:834]` names **only** `palette-sheet-neutral.html` as "the working skeleton to copy".
- **Consumer asymmetry:** `palette-sheet-neutral.html` is cited three times in `template-contract.md`, three times in `scripts/README.md`, and three times in `manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md`. Its two siblings are cited zero times.
- **What breaks if removed:** nothing found. No script, reference, playbook or test names either file. Removing them leaves the skeleton `palette-sheet-neutral.html` and `palettes.json` (the actual contrast-gate source) untouched.
- **Caveat lowering confidence:** `[SOURCE: .skilled/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs:126]` reads `path.join(ROOT, 'assets', 'style-reference')` as a directory. If that test enumerates the directory rather than joining a named file, adding/removing siblings could shift its expectations. I did **not** execute that test.
- **Confidence:** high that they are unreferenced; medium that removal is free.
- **Verify:** `rg -n "palette-sheet-ordered|palette-sheet-categorical" .skilled --glob '!**/node_modules/**' | grep -v leaf-manifest` → returns only the two self-declarations.

---

**F7-2 — `source-globals.css` is provenance-only and named by nothing but itself**
- **Type:** 6 over-engineering
- **Severity:** P2
- **Release:** v4.0.0.0 (baseline)
- **Evidence:** `[SOURCE: .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/source-globals.css:1]` — its own header comment is the only description of what it is ("The two custom-property blocks the evilcharts Style Reference beside this file was read from"). No `DESIGN.md`, reference or script opens it.
- **What breaks if removed:** the derivation trail from the upstream library to `DESIGN.md` loses its raw captured source; `DESIGN.md:18` still explains the language in prose, so the *reader* loses nothing functional.
- **Confidence:** medium-high.
- **Verify:** `rg -n "source-globals" .skilled --glob '!**/node_modules/**'`.

> Contrast this with `tokens.json` in the same directory, which the manifest-only test also flagged but which is **not** dead: `[SOURCE: .skilled/skills/sk-design/sk-design-chart/references/design-md-theming.md:51]` says `--tokens tokens.json` supplies the sibling inventory, and line 89 reads `darkMode` from it. It is consumed by filename convention, not by path. A path-only orphan test would wrongly condemn it — the method must consider convention-picked siblings.

---

### Q11 — validator friction, measured

**F7-3 — `validate_skill_package.py` surfaces exactly one frontmatter error per run, forcing a serial fix loop**
- **Type:** 5 UX (operator and AI user)
- **Severity:** P1
- **Release:** v4.0.0.0 (baseline; still live at v4.0.2.0)
- **Evidence:** `[SOURCE: .skilled/skills/sk-doc/scripts/validate_skill_package.py:202]` prints `"  Output tail:"` — the wrapper shells out to `package_skill.py --check` (`[SOURCE: .skilled/skills/sk-doc/scripts/validate_skill_package.py:270]`) and shows only that subprocess's tail. The subprocess aborts on the first missing field, so the wrapper can never show more than one.
- **Repro (ran it):**
  ```
  run 1 → ❌ Missing required field 'name' in frontmatter
  (added name)
  run 2 → ❌ Missing required field 'description' in frontmatter
  (probe with plausible frontmatter)
  run 3 → ❌ Missing required field 'allowed-tools' in frontmatter
  ```
- **Why it matters:** a skill missing three fields costs three validator round trips, each one an agent turn. For the AI user filling a template, the cost is the loop itself, not the fix.
- **Confidence:** high.
- **Verify:** `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py /tmp/skdoc-probe/broken-skill`

---

**F7-4 — skill-level dangling links are never checked, because frontmatter validation short-circuits first**
- **Type:** 3 bug
- **Severity:** P1
- **Release:** v4.0.0.0 (baseline)
- **Evidence:** the probe skill's `SKILL.md` carried `See references/missing-file.md for details.` through all three runs of F7-3 and the path was **never** reported. This is the same defect class earlier iterations recorded as five missing paths in sk-doc itself — and it is invisible to the validator sk-doc ships.
- **Repro (ran it):** build `/tmp/skdoc-probe/broken-skill` with a `references/missing-file.md` citation and incomplete frontmatter; run the validator three times with one field added each time; no run mentions the link.
- **Consequence:** `/create:skill` can produce a skill whose own validator will not catch the link rot that this run already found in the parent hub.
- **Confidence:** high for the observation; high that no later check runs while frontmatter fails.
- **Verify:** `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py /tmp/skdoc-probe/broken-skill 2>&1 | grep -c "missing-file"` → `0`.

---

**F7-5 — the v4.0.1.0 "no `ROUTER.md` fails `--strict`" claim cannot be observed from a fresh skill**
- **Type:** 1 drift (note vs code)
- **Severity:** P1
- **Release:** v4.0.1.0
- **Evidence (note):** `[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]` — "A skill that keeps its router inside `SKILL.md`, or has no `ROUTER.md`, now fails `package_skill.py --strict`."
- **Evidence (code):** `[SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1648]` `_partition_strict` only promotes *warnings* to errors; frontmatter validation runs first (`[SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1660]`). A skill with genuinely valid frontmatter and **no** `ROUTER.md` still fails at the frontmatter gate — my probe reported `Missing required field 'allowed-tools'` and never reached routing shape.
- **Repro (ran it):** `package_skill.py /tmp/skdoc-probe/no-router --strict` → exit 1, first error `allowed-tools`. The same call with `--check` → exit 1, **identical** first error. `--strict` and `--check` are indistinguishable at this stage.
- **Why it matters:** the release note's headline routing-shape guarantee is unreachable behind an undocumented `allowed-tools` requirement. An operator reading the note expects a router complaint and gets a frontmatter complaint — an ambiguous-mode signal that the operator and the AI user both pay for.
- **Confidence:** high that the claim is unobservable from a fresh skill; medium that a fully frontmatter-valid skill still passes with no router — I did not construct a skill satisfying every unknown required field.
- **Verify:** `python3 .skilled/skills/sk-doc/scripts/package_skill.py /tmp/skdoc-probe/no-router --strict; echo $?`

---

**F7-6 — `validate_document.py` link resolution is scoped to code-folder READMEs and skips any target lacking a `./` or `../` prefix**
- **Type:** 3 bug
- **Severity:** P2
- **Release:** v4.0.0.0 (baseline)
- **Evidence:** `[SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2186]` — `if not raw.strip().startswith(('./', '../')): continue`, inside `_code_folder_reference_errors` (`[SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2179]`). The only link error text in the script is README-scoped: `'Relative link does not resolve from the README directory'` (`[SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2192]`).
- **Repro (ran it):** `/tmp/skdoc-probe/docs/broken.md` = no frontmatter + `[missing](references/does-not-exist.md)` + a broken JS fence. Output was exactly 2 issues:
  ```
  🚫 Blocking errors (1):
    - [missing_required_section] Missing required section: overview
  ⚠️ Warnings (1):
    - [document_type_fallback] No document type rule matched ..., so README rules were applied.
  ```
  The dangling link and the malformed code fence were both silently ignored.
- **Why it matters:** this is the mechanical reason sk-doc's own link rot survived — the validator cannot see a bare `references/foo.md`, which is precisely how hub docs cite their siblings.
- **Confidence:** high for the skip condition; high that the probe's link was unchecked.
- **Verify:** `python3 .skilled/skills/sk-doc/scripts/validate_document.py /tmp/skdoc-probe/docs/broken.md 2>&1 | grep -c "does-not-exist"` → `0`.

---

**F7-7 — what the validators get right (do not regress these)**
- **Type:** 4 improvement (credit, not a defect)
- **Evidence:** exit codes are honest in both directions — `validate_skill_package.py` on a broken skill → 1, `validate_document.py` on a broken doc → 1, and on a healthy control `.skilled/skills/sk-prompt/SKILL.md` → **0** with `Total issues: 0`. I initially recorded exit 0 for a failing run; that was my own measurement error (I had captured `tail`'s status through a pipe, not the validator's). Re-measured without the pipe, both are correct.
- The `document_type_fallback` warning is a genuinely good operator message: it names the cause *and* the remedy ("Pass `--type` to choose the rule set").
- **Confidence:** high.

---

## 4. QUESTIONS ANSWERED

- **Q10** — *Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another, and what breaks if each is removed?*
  **Answered.** No file has zero inbound references (0/443). The orphan set is 4 manifest-only files, of which 3 are genuinely inert (F7-1 ×2, F7-2 ×1) and 1 (`tokens.json`) is consumed by filename convention and must be kept. Nothing breaks if the 3 inert files are removed, subject to the `apply-design-md.test.cjs:126` directory-read caveat. The 78-orphan figure produced by the over-strict first pass is retracted as a false positive.

---

## 5. QUESTIONS REMAINING

- **Q11 — still open.** Two of its three sub-parts are now measured: *unclear validator errors* is answered concretely by F7-3, F7-4, F7-5 and F7-6. Still open: **ambiguous mode choice** (is the boundary between, say, `sk-doc` and `sk-design`, or `sk-code` review vs `system-deep-loop` review, decidable from the routers alone?) and **large mandatory loads** (what does an agent pay on entry to each hub, measured in tokens, and which loads are genuinely mandatory).
- Noted for a future iteration: the v4.0.1.0 *Frontend Surface* claim ("`sk-code` carries a web frontend surface ... a five-pass Figma check ... a starter `tokens.css`") was confirmed present in the note at `[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:43]` but not yet checked against the shipped sk-code surface files in this iteration. Earlier iterations logged a related finding (the schema doc omitting the new sk-code frontend surface); the `tokens.css` starter specifically remains unverified.

---

## 6. SCOPE VIOLATIONS

**SV-1 — wrote scratch fixtures under `/tmp/skdoc-probe/`, outside the allowed-write list.**

The iteration focus directs the Q11 work "on a deliberately broken copy under /tmp", and the output contract's allowed-write list names only this narrative, `deltas/iter-007.jsonl` and the append gateway's own writes. I followed the focus and created `/tmp/skdoc-probe/{broken-skill,no-router,docs/broken.md,out1..5.txt}` before reconciling the two instructions.

Assessment: the write touches no repository path, no researched target and no run-directory authority. It is throwaway input for a validator, and `/tmp` is outside the repository the constraints protect. The correct ordering was still to record the conflict as a finding first. Recording it here after the fact, per the protocol's disclosure duty.

No repository file outside the three permitted artifacts was created, modified, renamed or deleted. `[SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2179]` and every other researched path were opened read-only.

---

## 7. NEXT FOCUS

Close Q11's two remaining sub-parts:

1. **Ambiguous mode choice.** Take 3–4 realistic prompts that sit on a documented seam (sk-doc vs sk-design for a "style guide"; sk-code review vs deep-loop review; sk-design chart vs a `/create:chart` request) and run the skill advisor on each, recording the score spread when two hubs both clear the bar. The advisor ambiguity already visible in this run's own header — `sk-doc 0.95/0.16` vs `system-deep-loop 0.95/0.12` — is the exact shape to measure.
2. **Large mandatory loads.** Measure the entry cost per hub: total bytes an agent must read to reach a mode, from `SKILL.md` → `ROUTER.md` → mode `SKILL.md`, and compare against the v4.0.1.0 note's claim that per-skill load fell from 328,333 to 238,406 tokens. Name which loads are deferrable.
