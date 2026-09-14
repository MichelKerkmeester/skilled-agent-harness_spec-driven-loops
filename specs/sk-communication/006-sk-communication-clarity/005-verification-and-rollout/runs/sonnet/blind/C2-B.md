Case: C2

Review X; tell me if anything is wrong

Reply B:

I read `parseDescription` (check-repo-rules.cjs:89-97) and its one caller path through `checkIndexSummaries` (check-repo-rules.cjs:370-395). One real gap, currently dormant.

**The gap:** `parseDescription` only reads the value on the same physical line as `description:`. It has no continuation-line handling for a YAML block scalar (`description: >` or `description: |`, with the actual text indented on the next line), unlike `parseTriggerPhrases` a few lines above it, which explicitly walks forward over `- item` continuation lines for its own multi-line construct.

**Why that matters here specifically:** the regex `/^description\s*:\s*(.*)$/u` always matches once a line starts with `description:`, because `(.*)`  matches even an empty remainder. So if a description were ever written as a block scalar, the function would not return `null`, it would return `''` or the bare `>`/`|` character. That silently defeats the safety net at check-repo-rules.cjs:381, `if (rule.description === null)`, which is the only place that reports "no description in frontmatter." Instead the code falls through to the comparison at line 385 and reports a misleading "summary differs from its description," pointing at the wrong problem.

**Current impact:** none. I checked the frontmatter of all 11 files under `repo-rules/` shown in this session and every `description:` is a single-line double-quoted string, so the function parses them correctly today. This is a latent correctness gap, not a live bug, it would only surface if someone authored a description as a block scalar, which YAML permits and nothing in this checker forbids or validates against.

One smaller, lower-confidence note: the quote-stripping chain (`.replace(/^"(.*)"$/u, '$1').replace(/^'(.*)'$/u, '$1')`) doesn't unescape YAML's `''` (doubled single-quote) convention, so a single-quoted description containing an escaped apostrophe would keep the literal `''` in the output. Same limitation exists in `parseTriggerPhrases`'s per-item parsing, and the actual corpus uses double quotes for descriptions containing apostrophes, so this one is unlikely to bite in practice.

Nothing here is yours to act on unless you want the multiline case handled, that's a small, contained fix (make `parseDescription` detect a `>`/`|` line and fall back to `null` or throw, rather than returning a fragment) and I can make it if you want it.
