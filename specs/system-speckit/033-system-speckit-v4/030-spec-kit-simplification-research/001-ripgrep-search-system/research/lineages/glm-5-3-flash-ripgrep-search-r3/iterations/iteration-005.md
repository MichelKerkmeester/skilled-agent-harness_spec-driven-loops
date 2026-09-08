# Iteration 5 — Trigger-phrase authoring guidance versus the judge

**Angle (dispatch):** Read `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`, then the trigger-phrase guidance in `templates/spec-kit-docs.json` or the template that carries `trigger_phrases`, `retrieval-conventions.md` section 8, and sk-doc's trigger-phrase rule (one file, found by name). Any guidance that would tell an author to write a phrase the judge now classifies as banned, or that omits a class the judge enforces, is a finding.

**Clock:** 2026-09-07T12:38:16Z · **Tool calls:** 10 of 12 (6 evidence, 4 record writes; one evidence call lost at the compaction boundary and re-run)

## Evidence trail

1. `lib/phrase-judge.mjs` (112 lines, whole): seven negative classes — `generic-workflow-word` (the 9-word set, comment "verbatim from the convention", :11-14), `editor-fallback` (`ensureMinTriggerPhrases`'s terminal `session`/`context` pair, :17-22, :64-67), `stop-word-only` (a 37-word `STOP_WORDS` list, "kept short and explicit: a long borrowed list would silently reject real domain phrases", :27-37, :75-77), `numeric-only` (:79-84), `prose-sentence` (punctuation OR more than `MAX_PHRASE_TOKENS = 10` tokens, :41-46, :85-92), `folder-token-fallback` (single token equal to a packet-folder token — requires `context.folderTokens`, :96-102), `single-token` (:104-109). Module header :1-7: the retrofit pipeline and the validator re-export it "so every enforcer keeps the same verdict". The jsdoc (:50-62) hedges provenance: both fallback shapes are "matched by shape and named in the reason rather than asserted as fact", and the folder-token row is "a warning that reports the resemblance rather than an error".
2. Claim-side greps: the conventions' only "stop-word" prose (:257, the *body extractor's* separate policy), the templates' `trigger_phrases` carriers, sk-doc's non-benchmark trigger mentions. (An earlier pre-compaction note believed section 8's Warn-On covered only ~5 of 7 — settled below: the spelling "Stopword-only" hid the :252 bullet from a hyphen-pattern grep.)
3. Counting-side greps: the phraseQuality counting lives in `generate-trigger-index.mjs:240-258` (not artifact.mjs — its phraseQuality grep is empty); the counting is **class-dynamic** (`bucket = verdict ? verdict.negativeClass : 'ok'`, :244-246) but the judge call at :244 passes **no context**. Skills-wide: the string `folder-token-fallback` exists ONLY in `phrase-judge.mjs:99` and the two tests (`grep-convention.vitest.ts:465`, `grep-convention-rule.vitest.ts:135` — the rule table row `'900-folder-token-fallback' → 'generic-trigger' → 'warn'`). The validator's per-document call DOES pass context (`grep-convention.mjs:719`).
4. Settlements: `normalize.mjs:62-69` — `normalizeTriggerText` = lowercase → `replace(/[^a-z0-9]+/g, ' ')` → collapse → trim; `MAX_PHRASE_LENGTH = 120` (:25) serialized in `NORMALIZATION` as `separators: 'non-ascii-alnum-to-space'` (:31-39). Section 8's Warn-On read in full: five bullets at `retrieval-conventions.md:251-255`. sk-doc's example phrases (:5-9, :100-104). 013's own claims: `implementation-summary.md:55` ("One judge, three readers"), :57 (two classes join the five), :61 ("the diagnostics gain a `phraseQuality` bucket: phrases and owning documents **per class**"; the doctor reads the bucket as its pollution signal), :122 (the corpus keeps its 825 single-token-owning documents until their owners rewrite them).

## Findings (5: 1×P1, 4×P2)

### R3-5.1 — P1 — The judge's seventh class never reaches the generation diagnostics; the "same verdict" promise silently divides

- **Claim side:** `phrase-judge.mjs:3-7` + 013 `implementation-summary.md:55,57,61`
- **Actual side:** `generate-trigger-index.mjs:244-246` (+ `phrase-judge.mjs:96-102,104-109`; `grep-convention.mjs:719`; `grep-convention-rule.vitest.ts:135`; `grep-convention.vitest.ts:465`)
- **Claimed:** the judge module's stated purpose is that its re-exporting enforcers "keep the same verdict" (header :3-7), and 013's closeout promises the diagnostics cover the judge "per class" (:61) under the section premise "One judge, three readers" (:55).
- **Actual:** the generator judges every unique key WITHOUT the folder context the `folder-token-fallback` class requires — `generate-trigger-index.mjs:244` calls `judgeTriggerPhrase(normalized)` — so `phrase-judge.mjs:100`'s `context.folderTokens ?? []` is always empty at generation and those phrases fall through to the `single-token` class (:106). Skills-wide, the class string exists only in the judge and its two tests: zero occurrences in the committed diagnostics, the conventions, the README, or any 013 document. Meanwhile the validator's per-document call passes the context (`grep-convention.mjs:719`) and warns the class as its own (rule-table row `'900-folder-token-fallback' → 'generic-trigger' → 'warn'`, `grep-convention-rule.vitest.ts:135`; verdict test, `grep-convention.vitest.ts:465`). One phrase, two labels: `single-token` in the doctor's pollution signal, `folder-token-fallback` in the validator's warnings.
- **Recommendation:** fix — the smallest repair is one sentence at the call site (or in 013's continuity) accounting for the divergence; the full fix (per-occurrence judging with `folderTokens`) collides with the unique-key design 013:61 actually shipped. The module header's promise holds at the function level and breaks at the caller level — exactly where no document looks.

### R3-5.2 — P2 — The guidance carries none of the judge's deliberately-separated budgets

- **Claim side:** `retrieval-conventions.md:252-253`
- **Actual side:** `phrase-judge.mjs:27-46,85-92` + `normalize.mjs:25`
- **Claimed:** "Stopword-only phrases" (:252) and "Whole prose sentences" (:253) tell the author what the judge rejects.
- **Actual:** the prose-sentence class fires on EITHER punctuation OR more than 10 tokens (`MAX_PHRASE_TOKENS = 10`, judge :41-46, :85-92) — the 11th token of a punctuation-free phrase flips the class, and :253 neither says so nor carries the number; the stop-word-only class's 37-word membership (judge :27-37, "kept short and explicit") is judge-only — :252 warns the concept with no list; and the 120-character oversize variant (`MAX_PHRASE_LENGTH`, `normalize.mjs:25`), which the judge's own comment says is deliberately folded separately so "one defect" is not reported "under the other's label" (judge :41-46), has no section 8 mention at all.
- **Recommendation:** fix — add the 10-token flip to :253 and a pointer to the judge's 37-word list at :252; resolve where the oversize variant actually lives (open question 1) before documenting it.

### R3-5.3 — P2 — "Body-derived fallbacks" names a producer that produces neither of the judge's two fallback shapes

- **Claim side:** `retrieval-conventions.md:254`
- **Actual side:** `phrase-judge.mjs:17-22,50-62,96-102` + `retrieval-conventions.md:257`
- **Claimed:** the Warn-On bullet "Body-derived fallbacks" (:254) covers the fallback class(es).
- **Actual:** BOTH fallback shapes are the frontmatter editor's, not the body's — the `editor-fallback` comment ("the two phrases `ensureMinTriggerPhrases` falls back to", judge :17-22) and the jsdoc ("the two fallback shapes the frontmatter editor actually produces": the terminal `session`/`context` pair AND the folder-token echo, judge :50-62); section 8's own :257 agrees ("The frontmatter editor inserts folder tokens and ultimately falls back to `session` and `context`") while giving the body extractor only "its own separate stop-word and n-gram policy" — a mechanism no judge class covers. "Body-derived" matches neither `editor-fallback` nor `folder-token-fallback`, and neither class string appears anywhere in the conventions, so a reader cannot connect the bullet to a verdict.
- **Recommendation:** fix — rename the bullet ("Editor fallbacks — `session`/`context` — and folder-token echoes") or name the classes; this is the precision-culture document.

### R3-5.4 — P2 — The template tree: field + exemplary phrases, zero guidance, zero pointers; the dispatched first nominee is empty

- **Claim side:** the dispatch's nominee `templates/spec-kit-docs.json` (whole, 2429 lines)
- **Actual side:** `templates/EXTENSION-GUIDE.md:4-8` + `templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl`
- **Claimed:** trigger-phrase guidance lives in the template tree, `spec-kit-docs.json` named first.
- **Actual:** `spec-kit-docs.json` never mentions `trigger_phrases` (the `grep -rln` carrier list: `EXTENSION-GUIDE.md` + the four core `.tmpl` — it is absent); the field's in-repo examples are the four `.tmpl` files (16 phrases, all 2+ tokens and judge-clean under `normalize.mjs:62-69`'s non-ascii-alnum-to-space — `spec-kit-docs.json` itself judges as FOUR tokens) and `EXTENSION-GUIDE.md:4-8`'s own frontmatter. No guidance prose anywhere in the tree; the ONLY authoring guidance is section 8:241-261, referenced by nothing.
- **Recommendation:** document — one pointer line to section 8 where the field is introduced (the `.tmpl` field comment or `EXTENSION-GUIDE`), so the exemplars and the rules they happen to satisfy are one hop apart.

### R3-5.5 — P2 — sk-doc's prescription never meets the judge

- **Claim side:** `sk-doc/sk-create-feature-catalog/references/examples.md:95,141` (+ `common-pitfalls.md:4`)
- **Actual side:** `phrase-judge.mjs:11-117` (the seven classes)
- **Claimed:** "The `trigger_phrases` lead with the exact tool name, then add natural-language alternates and one field name a reader might search for" (:95); "Make `trigger_phrases` lead with the exact tool or feature name, then add alternates" (:141) — the only trigger-phrase authoring guidance outside section 8.
- **Actual:** the prescription is sound (all 10 of the reference's own example phrases — :5-9, :100-104 — are 2+ tokens and judge-clean, including the underscore/camelCase cases: `advisor_recommend` → `advisor recommend`, `compiledRoute enrichment` → `compiledroute enrichment`), but neither the judge, section 8, nor any of the seven class names appears anywhere in sk-doc's non-benchmark documents — precisely the author most likely to write "one field name" (a bare symbol = single-token, the class 013:122 says 825 documents still carry) reads no warning.
- **Recommendation:** document — one line in the reference: phrases are judged at generation (conventions section 8:241-261, `lib/phrase-judge.mjs`); declare two or more tokens.

## Verified as correct (7)

1. The 9-word generic set: `GENERIC_TRIGGER_WORDS` (judge :11-14) == section 8:251, word-for-word — the "verbatim from the convention" comment (judge :11) is TRUE.
2. `EDITOR_FALLBACK_WORDS` = {session, context} (judge :17-22) == section 8:257's "falls back to `session` and `context`".
3. `stop-word-only` IS warned: section 8:252 "Stopword-only phrases" — the earlier 5-of-7 note was a hyphen-grep artifact (the spaced spelling carries no `stop-word` token).
4. Section 8:255's single bullet covers BOTH of the judge's count-classes ("Single-token phrases, and phrases that are only numbers"), and :261 carries the landed L2-remediation clause (exact-equality-only; "a packet id or a date, never a concept") — 013:57/:49's documentation promise, holding.
5. 26/26 inspected phrases survive the judge: 16 `.tmpl` + 4 `EXTENSION-GUIDE` + 10 sk-doc reference examples — 2+ tokens each under `normalize.mjs:62-69`, punctuation-free, not all-stop-words (`what shipped`: `what` is a stop word, `shipped` is not).
6. The counting is class-dynamic: `bucket = verdict ? verdict.negativeClass : 'ok'` (`generate-trigger-index.mjs:244-246`) — no hardcoded bucket list; 013:61's mechanism claim holds for every class the context-less call CAN produce.
7. The verdict reason strings carry the convention's own prose (judge :108 "can only match by exact equality and never ranks" ≈ section 8:261) — the judge→author closed loop 013:64 promised, at the verdict level.

## Ruled out (4)

- **"A hardcoded six-bucket count list drops the 7th class"** — the counting is class-dynamic (`generate:244-246`); the cause is the context-less call, not a dropped bucket. Evidence: `generate-trigger-index.mjs:244-246` + the skills-wide grep (the class string only in the judge and its tests).
- **"`EXTENSION-GUIDE.md:6`'s `spec-kit-docs.json` is a single-token pollution victim"** — `normalizeTriggerText` maps non-alphanumerics to spaces, so it judges as four tokens (`spec kit docs json`); the contract is even serialized (`NORMALIZATION.separators`, `normalize.mjs:36`). Evidence: `normalize.mjs:62-69,31-39`.
- **"Section 8 omits the judge's stop-word-only class"** (the note carried from the pre-compaction read) — `retrieval-conventions.md:252` warns "Stopword-only phrases"; the spaced spelling hid it from the earlier hyphen-pattern grep.
- **"The templates' 16 example phrases violate the judge"** — all 2+ tokens, punctuation-free, not all-stop-words; every one returns null.

## Open questions (3)

1. Where does the 120-character `oversized` variant (judge :41-46; `MAX_PHRASE_LENGTH = 120`, `normalize.mjs:25`) actually live, given `judgeTriggerPhrase` returns only the seven classes? (The retrofit/validator warning paths — not read: call budget.)
2. Does the committed phraseQuality ledger ship the `'ok'` bucket alongside the six negatives (`generate:245-246` makes it a key), and does the doctor's pollution read (it2's `yaml:141` receipt) sum specific buckets or the whole ledger? (Not recounted — the 3.8MB artifact; it2's receipt covered the six negative values of the documents ledger: 825/121/171/18/12/4.)
3. How many of the 314 single-token keys (013:61's committed phrase count; 825 owning documents) would re-bucket as `folder-token-fallback` under a context-ful judge — the blast radius of R3-5.1's divergence, not recounted here (no node tooling).

## Ledger

10 of 12 tool calls: 6 evidence (one lost at the compaction boundary, re-run inside call 2) + 4 record writes. 4 recall calls for continuity, not counted as evidence. No reads skipped that the angle promised: judge (whole), conventions section 8 (whole, :237-261 + bullets), the template carriers (all five), sk-doc's rule file (the reference + the pitfalls example), the counting code, the normalizer, 013's closeout claims.
