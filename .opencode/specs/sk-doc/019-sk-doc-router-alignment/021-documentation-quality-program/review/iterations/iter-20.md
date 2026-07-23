# Iteration 20: whole-program coherence + completion-honesty synthesis

> dimension: coherence+honesty | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Header transform committed literal NUL bytes into two documents**
  
  `.opencode/skills/sk-design/design-md-generator/references/writing-style-guide.md:149`  
  `.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:36`
  
  Evidence: `od` shows `00 30 00`; `git diff --text e646d31b..HEAD` shows the branch replaced both backtick spans with `<NUL>0<NUL>`. `file` now classifies both Markdown files as `data`. This directly contradicts phase 009’s “exempt-preserving transform” claim; `validate_document.py` nevertheless reports the first file valid.
  
  Fix: Restore `` `## Tokens — Colors` `` and `` `--file` ``. Add a blocking control-character check and test the transform with collision-safe placeholders before rerunning the full transformed-file sweep.

- **[P0] All ten “complete” phases fail the mandatory strict validation gate**
  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes/implementation-summary.md:103`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/context-index.md:7`
  
  Evidence: The summaries claim `Parent recursive --strict | Clean`, and the context index marks phases 001–010 complete. Running `validate.sh <phase> --strict` against every child returned `RESULT: FAILED`, exit 2, with `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE`, and `SECTION_COUNTS` bridge failures. Parent recursive validation also failed. Whatever the shared bridge’s root cause, the repository’s hard completion gate is red.
  
  Fix: Repair or rebuild the registry-rule bridge, rerun strict validation until the parent and every child exit 0, and replace the clean/complete claims with blocked or unverified status until then.

- **[P0] The broken-reference cleanup left 1,290 catalog links unresolved**
  
  `.opencode/skills/sk-design/styles/README.md:25`
  
  Evidence: A filesystem audit found 1,290 style links such as `(099-supply/)` and `(zora/)` missing relative to this README; every corresponding target exists under `library/bundles/`. Line 8 additionally references missing `_harness/` and `_manifest.json`. Phase 008 modified this README specifically during the broken-reference cleanup but repaired only three engine references, leaving the dominant link class untouched.
  
  Fix: Prefix all style destinations with `library/bundles/`, replace the manifest reference with `library/manifests/retrieval-manifest.json`, and correct or remove the `_harness/` claim. Re-run a relative-link resolver over every repaired README.

- **[P0] Rewritten READMEs contain non-runnable commands and false output contracts**
  
  `.opencode/skills/sk-doc/create-skill/README.md:45`  
  `.opencode/skills/sk-doc/create-skill/README.md:48`  
  `.opencode/skills/system-spec-kit/mcp-server/api/README.md:66`
  
  Evidence: The create-skill Quick Start combines repo-root arguments with `scripts/*.py` paths that do not exist from the repo root. It also says initialization creates `README.md`, `references/`, `assets/`, and `scripts/`, while `init_skill.py:115-134` creates only the directory and `SKILL.md`. Separately, the API README instructs running root `npm test`, but the root `package.json` has no `test` script. These survived the phases’ “all VALID” claims because structural validation never executed documented commands.
  
  Fix: Use unambiguous repo-root-qualified commands, correct the scaffold output description, and smoke-test every added or materially rewritten fenced command from its documented working directory.

- **[P1] The ALL-CAPS validator accepts arbitrary malformed mixed case**
  
  `.opencode/skills/sk-doc/shared/scripts/validate_document.py:308`
  
  Evidence: Any word with an uppercase character after its first letter is treated as a proper noun. Direct execution returned `True` for `tHIS iS nOT cAPS` and `hTTP sERVER rEADME`. No test references `is_uppercase_section`, so the branch’s headline enforcement change has no regression coverage.
  
  Fix: Replace the unrestricted internal-cap exemption with explicit identifier handling—preferably requiring code spans or a constrained proper-noun rule—and add table-driven tests for valid identifiers, malformed mixed case, nested parentheses, URLs, and control characters.

- **[P1] Parent packet state still describes the obsolete eight-phase plan**
  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/spec.md:3`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/spec.md:15`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/graph-metadata.json:44`
  
  Evidence: The parent says “Eight phases,” records phase 002 as the next action, and maps phase 008 to nonexistent `008-verification-and-closeout`. The tree and `children_ids` contain ten children through phase 010, while derived metadata still says `status: planned`. This contradicts the context index’s all-complete state.
  
  Fix: Reconcile the parent description, continuity, phase map, derived status, last-active child, and generated fingerprints with the actual ten-phase program.

Review verdict: FAIL
