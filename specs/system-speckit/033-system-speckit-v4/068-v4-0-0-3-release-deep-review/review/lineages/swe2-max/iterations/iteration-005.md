# Iteration 005 — traceability: spec↔code and skill contract claims

## Scope and method

Verified mechanically-checkable doc/spec claims against shipped code, and traced
declared registries/manifests to the resources they name:

- `specs/system-speckit/047-plugin-scanner-readiness/spec.md` — all six claims
  verified: every workflow `uses:` pinned to a 40-char SHA (grep found zero
  unpinned), `SECURITY.md` present, `.gitignore:372` ignores `specs/**/context/`,
  `code-task-scorer.cjs` loads model code via temp-module `require` (no `Function`/
  `eval`), `minify-webflow.mjs:105` uses `execFileSync` argv, baseline rebuilt.
- `.skilled/commands/deep/assets/compiled/deep-review.contract.md` — all sampled
  sourceDigests recomputed byte-equal (review.md, SKILL.md, prompt-pack tmpl).
- `sk-doc` version authority (SKILL.md:17): `description.json`,
  `mode-registry.json`, `hub-router.json`, `ROUTER.md` all read 2.3.0.0 = newest
  changelog `v2.3.0.0.md`. Consistent.
- `feature-catalog/document-validation/citation-drift-scan.md` — constants
  verified against code: `CONSTRUCT_OFFSET_LINES=60`, `LABEL_GATE=40`,
  `margin: 0.10`, `winnable<5` → `underpowered`, `jev 0.6.2` pin, 20-citation/60 s
  advisory bounds, in-range-only pool. All accurate.
- `commands/deep/{review,research}.md` new footers — claim that SOURCE_TAGS runs
  in `/speckit:*` validation, not in-loop: verified (`validator-registry.json:225`
  warn; `check-source-tags.sh`+helper scan only `research/`+`review/` artifact
  trees, `moved_*`→WARN'moved', `past_end`→WARN, ignored-path handling). The
  prompt-pack wording "are checked" is accurate under the deferred-check model.
- `gates.tsv` ↔ `pre-push` behavior — `prepushSkillGate` warns-only confirmed
  (lines 372-382 no exit); `remotePush` per-branch semantics (`=1` updates only,
  `=<branch>` for creation) matches intent; command-scope git-config filtered.
- `cli-jev`→`cli-classifier` rename — leaf mode keeps name `cli-jev` inside the
  new hub; `serving-closure.manifest.json` and `compiled-route-guard.cjs` HUBS
  updated; remaining `cli-jev` mentions are in preserved benchmark reports and
  `specs/cli-jev/` spec paths (which still exist — historical, correct).
- `sk-doc/leaf-manifest.json` — 5 entries for `sk-create-quality-control` looked
  dangling but resolve via `leaf-aliases.json` `diskPath` (alias mechanism:
  `shared/references/*`, `sk-create-with-human-voice/references/hvr-rules.md`);
  generator reproduces the manifest byte-identical (ci-leaf-manifest-freshness
  OK for all 14 skills). NOT stale — adjudicated and dismissed.
- `commands/README.txt` index ↔ command tree — consistent.
- `speckit/plan.md:107` + `implement.md:93` claim FRONTMATTER_VALUES and
  SOURCE_TAGS are warn-only registered rules — both registered `severity: warn`.
- `.hermes`/`hooks.v1.json`/`hooks.json` mirror symlink layer — consistent.
- `steer.md` — re-read.

## Adjudication update (iteration-3 finding)

**sw2m-P2-006** — feature-catalog `citation-drift-scan.md` DOES disclose the skip
("skips every citation that does not resolve in range"). The residual defect
narrows to the summary line: `unchecked = inRange - checked`, so moved/unresolved
citations are invisible even as *unchecked*. Finding stands at P2 (reporting
precision), confidence lowered to 0.8 — the silent-zero is documented-adjacent
but still undetectable from the printed summary.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **sw2m-P2-009 — the shared `frontmatter-values.json` is consumed by two rules
   with asymmetric failure semantics; the sk-doc consumer hard-crashes where the
   spec-kit consumer degrades cleanly.**
   `check-frontmatter-values-helper.cjs:100-107` wraps `loadAccepted()` in
   try/catch → exit 2 + readable stderr ("shared frontmatter list unreadable"),
   which `check-frontmatter-values.sh` maps to a warn/skip. The sk-doc twin
   `validate_document.py:1607-1652` (iteration-3 sw2m-P2-005) catches only
   `FileNotFoundError` then dereferences `values['contextType']['canonical']`
   unguarded → `JSONDecodeError`/`KeyError` traceback.
   Failure scenario: the shared asset `sk-create-frontmatter/assets/
   frontmatter-values.json` is the single source both runtimes read; a malformed
   edit produces a clean warn in `validate.sh --strict` but a hard crash in every
   `create-*` workflow's `validate_document.py` call — two consumers of one
   contract disagreeing on the same input's failure mode. The speckit side proves
   the degradation contract exists; the sk-doc side doesn't implement it.

## Withdrawn candidate

**Candidate: `SPECKIT_SOURCE_TAG_CUTOFF` exempting this packet from SOURCE_TAGS —
REJECTED on verification.** The cutoff is 2026-10-04
(`check-source-tags-helper.mjs:37`); this packet's `spec.md` records Created
2026-10-05 — it IS scanned. `plan.md:107`/`implement.md:93` also disclose the
cutoff date in the claim text. No defect; recorded so the reasoning is auditable.

## Expansion note

Traced across packet boundaries as required: the shared frontmatter asset's two
consumers (sk-doc `validate_document.py` ↔ spec-kit `check-frontmatter-values`),
the SOURCE_TAGS rule's cutoff against this packet's own metadata, and the
`specs/**/context/` untracking claim into `.gitignore` and vendored-file deletions.

## Review verdict: PASS
