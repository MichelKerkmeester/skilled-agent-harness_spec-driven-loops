# Iteration 003 — NEW ANGLE: the index's own content (phrase corpus census)

**Focus:** Round one verified phrase *quality* for install-guides only (F8.6) and checked single-token *scoring* (L2), but never censused what the committed index actually holds. This pass counts single-token phrases, numeric-only phrases, generic-word phrases and fragment phrases in the CURRENT index, and identifies the owners. No round-one count is reused.

**Method:** Python census over `runtime/data/trigger-index.json` (phrases dict: 35,453 keys, 46,260 postings, 13,680 owning paths) — single-token split, numeric-only split, generic-word membership against the conventions §8 warn list, fragment sampling; then read owner frontmatter for representative rows.

## Findings

### N1 — THE COMMITTED INDEX HOLDS 352 SINGLE-TOKEN PHRASES; 826 DOCS OWN THEM (P1, new)

- **Path:line:** `runtime/data/trigger-index.json` phrases table (census); rule `retrieval-conventions.md:260` ("Declare phrases of two or more tokens"); scoring `lib/normalize.mjs:131-150` (scorePhrase returns null for <2 tokens; exact-only match)
- **Claimed vs actual:** The conventions now state the two-or-more-token rule, and the code makes single-token phrases exact-only. The committed index still holds 352 single-token phrase keys with 2,245 postings across 826 owning documents — measured in THIS tree (round one never produced these counts). 29 are numeric-only ('000'…'029' plus id fragments like '023a1'), owned per-packet by multiple docs (e.g. '000' → specs/system-speckit/000-release/{handover,plan,spec}.md; '001' → four packets). Under scorePhrase these keys can only ever match by exact equality to the whole prompt; against any longer prompt they surface (if at all) as zero-score `partial` rows — the exact tail round one kept documenting.
- **Severity:** P1 — the documented rule is violated by 826 documents in the corpus and nothing in the generation path reports it (see N3 for the enforcement census). The failure mode is silent precision cost and list noise, plus the index carrying keys that can never rank.
- **Recommendation:** Add a single-token negative class to `judgeTriggerPhrase` (grep-convention.mjs:742-781) as a WARN (folder-token echo already exists at :774-779), and surface a single-token phrase count in `generation-diagnostics.json` so the count is observable at generation time and through the doctor.

### N2 — 175 DOCS OWN A PHRASE FROM §8'S OWN WARN LIST (P1, new)

- **Path:line:** census vs `grep-convention.mjs:149-155` (GENERIC_TRIGGER_WORDS: session, context, memory, summary, feature, update, file, document, section) and `retrieval-conventions.md:243-249` (Warn On list)
- **Claimed vs actual:** 175 documents in the committed index own at least one phrase that is in the conventions' own warn-on set — e.g. 'memory' (owner: specs/…/001-continuity-memory-runtime/002-fix-memory-quality/research/research.md), 'session' (specs/hooks/006-spec-gate-question-noise/handover.md), 'context' (specs/system-speckit/000-release/001-context-pack/spec.md), 'summary', 'feature', 'update' (multi-doc owners). These are exactly the "corpus pollution … costs precision on every query that touches it" class §8 names. The judge DOES reject them (generic-workflow-word negative, grep-convention.mjs:755-757) — but the category is a WARN (`CATEGORY_SEVERITY` 'generic-trigger': WARN, grep-convention.mjs:88-100) and the validator rule per spec folder still reports pass on warnings; the generator has no quality gate at all.
- **Severity:** P1 — documented pollution at scale with only a warning-grade validator and a zero-grade generator policy.
- **Recommendation:** Either escalate generic-trigger to ERROR in the validator (validate.sh would start failing packets with junk triggers — blast radius: the 175 docs), or (softer) add the count to diagnostics plus doctor's corpus_pollution screen so the number is tracked; decision is a policy call, but the current state (warn-only, no aggregate) makes the documented precision cost invisible.

### N3 — JUNK FRAGMENT PHRASES FROM A REPO-WIDE FRONTMATTER SWEEP ARE IN THE INDEX (P1, new)

- **Path:line:** index keys 'ation', 'tion', 'ing', 'ment', 'ement', 'ptimization', 'ystem', 'ntime', 'tem', 'dab', 'pec', 'peck', 'rent' (census); owner `specs/system-speckit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/002-copilot-custom-instructions-hook-parity/research/001-copilot-hook-gap-deep-review-remediation/research.md:5-12` — `trigger_phrases: ["ation", "009", "hook", "daemon", "parity", "research", "007", "deep"]`; the doc's `_memory` note: "Backfilled _memory block (repo-wide frontmatter sweep)"
- **Claimed vs actual:** The owner's frontmatter was produced by a repo-wide sweep and carries a truncated path-fragment ('ation' from a mangled `…-adaptation/…` path) plus packet-id digits and generic words. 'ation' is not a generic word, not a stopword-only phrase, not prose, and not a folder token of its own packet — so `judgeTriggerPhrase` (grep-convention.mjs:742-781) admits it; the validator (check-grep-convention-helper.mjs) reports nothing; the generator indexes it; the doctor's pollution screen follows only §8's list. Nothing in the enforcement stack has a class for numeric-only or path-fragment phrases. The same sweep pattern explains '009'/'007'/'002' style numeric keys and the suffix fragments in other owners.
- **Severity:** P1 — this is the concrete proof that the enforcement gap (N1/N2) admits genuinely corrupt declarations: the phrase is not merely low-precision, it is meaningless.
- **Recommendation:** The judge gains two negative classes (numeric-only or digit-led fragment; normalized token that is a suffix of a longer word is not practically detectable — instead: reject tokens that normalize from a list member containing path separators or ellipsis, and reject numeric-only). Simplest robust rule: reject single tokens that are all digits or start with digits, and reject any phrase whose raw spelling contains a slash or ellipsis (a path fragment shape).

## Ruled out this pass

- The digits are a normalization byproduct, not corruption: '2026-05-14 substrate wave closeout' → '2026 05 14 …' is the documented non-ascii-alnum-to-space separator (normalize.mjs:98-104, and the index's serialized normalization block). Version strings ('v1 0 3 stress test') are author-declared and legitimate. The finding is limited to single-TOKEN numeric/fragment phrases, not digits inside multi-token phrases.

## Open questions

1. Who owns the corpus-side cleanup of the ~826 single-token owners, and would a generator dry-run diagnostics list be the right vehicle (count-only, no edit)?
2. Should the sweep-authored docs (`_memory: "repo-wide frontmatter sweep"`) be treated as a distinct provenance class for remediation — i.e., is the sweep itself still running, and can it re-pollute?
