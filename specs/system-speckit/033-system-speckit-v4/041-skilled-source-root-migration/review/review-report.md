---
title: "Deep Review Report: source-root migration"
description: "Synthesis of a nine-angle deep review of the move from .opencode to .skilled, with every reported finding verified against the tree before it was classed."
trigger_phrases:
  - "source root migration review"
  - "dual root resolver findings"
  - "skilled migration deep review"
---

# Deep Review Report: source-root migration

---

## 1. OVERVIEW

**Verdict: CONDITIONAL.** No P0. Active P1 findings remain, so the change is not clean, but none blocks what is running today.

**Scope.** Base `3717ac8854` to tip `0b65a92dad`, reviewed by GPT-5.6 Luna at maximum reasoning on the fast tier, one lane, ten angles, no early stop.

**Coverage.** All ten angles completed. The tenth, documentation truthfulness, was interrupted by a session boundary on the first run and re-run on 2026-09-18 against commit `67fa4f7b8e`, after the remediation of the other nine had landed. Section 12 carries its results.

---

## 2. HOW THE FINDINGS WERE HANDLED

Luna returned 29 findings: 20 P1, 9 P2, no P0. Three are the same defect reported twice under different angles, leaving 26 distinct.

Every one was treated as a hypothesis. Each finding was checked against the tree before it was classed, and the check that settled it is recorded. This mattered: one finding was wrong, one was already fixed by a later change, and one of my own checks produced a false regression that a second, correct check reversed.

The loop read a tree that kept changing while it ran. A finding written against the tree as it stood at iteration two can describe a state that no longer exists.

---

## 3. THE ONE FINDING THAT MATTERS MOST

Nearly half the P1 findings are **one defect class**: code that decides between `.skilled` and `.opencode` by assuming which of the two names is real.

Five instances were found and fixed by hand during the migration: a hook installer, a push allowlist resolver, a routing gate, a CI input parser, and the routing gate a second time. This review found the same shape in at least eight more places.

| Where | What it assumes |
|---|---|
| `.skilled/scripts/git-hooks/pre-commit:331` (`DR-001`, **fixed**) | A directory existing means the tree is there |
| `.skilled/bin/check-git-hooks.sh:58` (`HOOK-001`) | Names the legacy root with no fallback |
| `.github/scripts/check-gate-inputs.sh:194` (`GATE-001`) | Reads one root by name and only guesses at the other |
| `.github/workflows/gate-inputs.yml:27` (`GATE-002`) | Loops over legacy paths only |
| `pre-push:48`, `post-merge:26`, `prepare-commit-msg:55` (`HOOK-003`–`005`) | Unverified; same shape reported |
| `install-codex-hooks.mjs:129` (`INSTALL-001`) | Unverified; same shape reported |

Fixing these one at a time is the pattern that produced them. Each fix is written from scratch, each makes its own guess, and `DR-001` shows a fix can reintroduce the defect: it tested a directory existing when the same file already recognised the tree by a sentinel document twelve lines above.

**Recommendation.** One shared resolver, tested once, that every caller uses. It should select the root by the sentinel `skills/system-spec-kit/SKILL.md`, try the real directory first, and fall back to the legacy name. The existing `_in_toolchain_repo` function in `pre-commit` already carries the right test and is the natural starting point.

---

## 4. CONFIRMED AND LIVE

These are real and affect the tree today.

| ID | Sev | Finding | Settled by |
|---|---|---|---|
| `CI-001` | P1 | `spec-kit-check.yml` has fourteen trigger paths and none matches `.skilled/package.json` or its lockfile, the manifest that workflow installs from. A dependency change never runs the check that installs it. | `fnmatch` of each manifest against every trigger path: no match |
| `RETIRE-001` | P1 | The Chrome DevTools installer's help and usage text name `install-chrome-devtools.sh`, a wrapper deleted with the install-guide folder. | `grep`: lines 9, 72, 75; the named file does not exist |
| `REF-002` | P1 | `sk-doc/README.md:191` documents `validate-flowchart.sh`, deleted in `fd8213edb9`. Predates this work. | File absent; deletion commit found |
| `COMPAT-002` | P2 | `.opencode/SYNC.md` calls `node_modules` a relative symlink and says nothing is authored in the directory. Both stopped being true when the plugins moved in. | Read: line 30 contradicts line 39, lines 14 and 18 contradict line 29 |
| `REF-001` | P2 | `PUBLIC-RELEASE.md:57` lists `.opencode/install-guides/`, retired today. | Path absent |
| `CI-003` | P2 | `.github/workflows/README.md` names `isolation-check.yml` and `spec-root-resolution-matrix.yml`; neither exists. | Name set against directory listing |
| `RETIRE-003` | P2 | The installer library now exists as two identical copies with no drift check between them. Also reported as `COV-003`. | `cmp` identical today; no file references both |

---

## 5. CONFIRMED BUT LATENT

These work today only because `.opencode` is kept as a directory of links. They break in any checkout that carries only one of the two names, which is what a consumer, an older clone or a future removal of the legacy name looks like.

| ID | Sev | Finding |
|---|---|---|
| `HOOK-001` | P1 | `check-git-hooks.sh` sets its source directory to the legacy root unconditionally. |
| `GATE-001` | P1 | The gate-input parser's variable-path branch at line 194 tests only `.opencode/`. The workflow matchers were fixed; this branch was not. Also reported as `GATE-001-REFINED`. |
| `GATE-002` | P1 | `gate-inputs.yml` runs the hook tests through `.opencode/` paths only. |

---

## 6. PRE-EXISTING, NOT CAUSED BY THIS WORK

| ID | Sev | Finding | Why it is not a regression |
|---|---|---|---|
| `RETIRE-004` | P1 | Three of eleven surviving install guides fail the document validator, missing required `installation` and `verification` sections. Also reported as `COV-005`. | The pre-retirement validator, run on each guide at its real path, also reports all three invalid |
| `CI-002` | P1 | Seven workflows run only on pull requests, so a direct push to a release branch skips them. | `comment-hygiene.yml` had zero push triggers at the pre-move base too |

`RETIRE-004` briefly looked like a regression. A first check copied each guide to a temporary file and validated it there, and the validator classifies by filename, so it read the temporary name as a README and reported it valid. Running the pre-retirement validator on the real paths reversed that.

---

## 7. NOT ACTED ON

| ID | Sev | Outcome |
|---|---|---|
| `HOOK-002` | P1 | **Disproved.** Claimed `pre-commit` blocks every commit from the canonical root. The path it names resolves, and every commit during the migration passed through that hook. |
| `COMPAT-001` | P1 | **Stale.** Written before the plugins moved into `.opencode/`. They now load and resolve the SDK installed beside them. |
| `RETIRE-002` | P2 | **By design.** A changelog still describes the retired authoring mode. Changelogs are frozen records of what was true when written. |

---

## 8. NOT YET VERIFIED

Reported and plausible, but not checked against the tree.

| ID | Sev | Claim |
|---|---|---|
| `HOOK-003` | P1 | `pre-push` rejects normal updates from a `.skilled`-only checkout |
| `HOOK-004` | P1 | Post-lifecycle hooks skip autostash protection |
| `HOOK-005` | P2 | `prepare-commit-msg` omits required commit IDs |
| `INSTALL-001` | P1 | The Codex installer writes broken commands in a legacy-only checkout |
| `GEN-001` | P1 | The trigger index publishes a narrowed corpus under the legacy layout |
| `CONSUMER-001` | P1 | Legacy-only consumers bypass the OpenCode dispatch safeguards |
| `CONSUMER-002` | P2 | Legacy-only consumers make advisor cache signatures ignore skill changes |
| `COV-001` | P1 | The per-entry compatibility layout has no test |
| `COV-002` | P1 | The migrated installers have no self-contained smoke test |
| `COV-004` | P2 | The retired authoring mode has no negative contract test |

Six of the first seven are the section 2 defect class. A shared resolver would likely settle them without separate fixes.

---

## 9. RECOMMENDED ORDER

1. **Build the shared root resolver** and move the section 2 and section 4 callers onto it. This is the highest-value change the review supports, and it closes the class rather than the instances.
2. **Fix the section 3 live defects.** Each is small: a trigger path, three help lines, three document edits and one drift check.
3. **Verify section 7**, most of which the resolver should settle.
4. **Re-run angle 10**, documentation truthfulness, which did not complete.
5. **Decide on `RETIRE-004`**: add the missing sections to the three guides, or accept that they are shaped differently.

---

## 10. EVIDENCE

- Findings as extracted: `findings-extracted.json`
- Per-iteration output: `iterations/iteration-001.md` to `iteration-010.md`
- Raw transcripts were not kept. At 6 to 15 MB each they were read for extraction and then discarded, so the iteration files are the record.
- Configuration: `deep-review-config.json`

---

## 11. REMEDIATION

Phase `012-fix-deep-review-p1-p2-findings-for-source-root-migration` closed the findings above. Each fix carries a test that fails against the code or document it replaced.

| Finding | Fix | Proof |
|---|---|---|
| `HOOK-001`, `HOOK-003`, `HOOK-004`, `HOOK-005` | One sentinel selection block in every hook, the checker and both hook installers (`e7c7136391`) | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` |
| `GATE-001`, `GATE-002` | Both roots read alike in every parser branch, `$SOURCE_ROOT` inputs resolved, suites found under the selected root (`e7c7136391`) | `.github/scripts/tests/check-gate-inputs.test.sh` cases 43 to 47 |
| `INSTALL-001`, `GEN-001`, `CONSUMER-001`, `CONSUMER-002` | `findSourceRoot` beside `findRepoRoot`, used by the installer, the generator and four plugins (`63ad140f9b`) | Legacy-only cases in the installer, retrieval, consumer and advisor tests |
| `CI-001`, `CI-002`, `CI-003` | Manifest triggers, push coverage for six guards, a true workflow table (`d755553a6e`) | Trigger table derived from the workflow files |
| `RETIRE-001`, `RETIRE-003`, `RETIRE-004`, `REF-001`, `REF-002`, `COMPAT-002` | Help text, helper drift check, three guides, two stale names, the sync manifest (`67fa4f7b8e`) | `mcp-installers.test.cjs`, `install-guide-contract.test.cjs`, `opencode-compat-layout.test.cjs` |
| `COV-001`, `COV-002`, `COV-004`, `COV-005` | The tests named in the rows above, plus a per-entry layout in the resolver parity suite | Each fails against the pre-fix state |
| `DOC-001` to `DOC-010` | Section 12 | Each claim re-checked against the tree after the edit |

Two guards that now run on push, `markdown-link-integrity` and `skill-doc-frontmatter`, fail on the tree for reasons that predate the migration: 47 broken links and 3 frontmatter violations in files other packets own.

---

## 12. ANGLE 10: DOCUMENTATION TRUTHFULNESS

The re-run returned ten findings, three P1 and seven P2, and every one held up when checked against the tree. The executor printed FAIL. With no P0 the verdict contract makes it CONDITIONAL, the same as the review as a whole.

| ID | Sev | What was false | Fix |
|---|---|---|---|
| `DOC-001` | P1 | The root README offered Gate 3 option E, which does not exist | Option D |
| `DOC-002` | P1 | The hooks README described a pre-push naming gate that was removed, and said the gates find their scripts under `.opencode/` | The four real pre-push gates, and the selected source root |
| `DOC-003` | P1 | The Hermes README, prompt card, provider reference, feature catalog and playbook said the roster is two models; the code enforces seven | Seven ids throughout |
| `DOC-004` | P2 | The `.opencode` README called every entry but the plugins a link | Names every real file |
| `DOC-005` | P2 | Five runtime manifests carried agent and command counts that had drifted | Counts removed in favour of the drift checks they already name |
| `DOC-006` | P2 | The workflows README said CI runs every hook suite; the glob takes only `*.test.sh` | Narrowed, with the harness named as local-only |
| `DOC-007` | P2 | The root README called `.opencode/agents/` canonical | It links to `.skilled/agents/` |
| `DOC-008` | P2 | The root README gave sk-doc ten packets and still listed install-guide authoring | Fourteen modes across thirteen packets, retired mode removed |
| `DOC-009` | P2 | The skills catalog listed six CLI modes | `cli-hermes` added |
| `DOC-010` | P2 | The root README told readers to register a new skill by hand | Discovery is automatic; the catalog row is optional |

One residue stays open: the `cli-external-orchestration` hub's `graph-metadata.json` still summarises a two-model Hermes roster. That file feeds the compiled skill graph, so it changes through its generator, not by hand.
