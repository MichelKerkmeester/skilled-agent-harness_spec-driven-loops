# Iteration 9: The redaction contract end to end

## Focus

Completion criterion 3 asks that a planted fake token in the sender's turn come back from the receiver's lookup as a `[REDACTED:` marker and never as the token. This iteration establishes what the redaction layer actually guarantees, what token shape a plant must have to be caught, and whether the harness can express the check at all. The answer matters because a plant that misses produces a green-looking run that proves nothing, and a plant that hits proves only the shapes the scrubber already knows.

## Actions Taken

1. Read the redaction entry points in `core.ts`: `redactText`, `redactArgument`, `redactBlock`, `redactHistoryEntries`, and the call order inside `createHistoryLookup`.
2. Read the shared scrubber's ordered pattern list and its `scrubSecrets` entry point.
3. Ran the compiled scrubber against seventeen candidate plant strings to see which shapes are caught.
4. Ran the two lookup-local patterns (`URL_PASSWORD`, `AUTHORIZATION_VALUE`) against seven header and URL shapes.
5. Read the existing redaction test's fixture set and grepped the harness for any token plant or redaction field.

## Findings

1. Redaction runs before projection: `createHistoryLookup` calls `projectHistoryEntries(redactHistoryEntries(entries), options)`, so every preview, page offset, part list and search index is computed on the text a caller receives. A secret therefore cannot be matched by `search`, and a secret straddling a page boundary is redacted before the boundary is chosen. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:136]

2. The shared scrubber is shape-driven, not entropy-driven. It requires a vendor prefix, a fixed length, or an assignment context with both a digit and a letter and a 20-character floor. A generic plant such as `FAKE_TOKEN_abc123` or `PLANTED_FAKE_TOKEN_9f3a2b1c8d7e6f5a` passes through unchanged. [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:59] [SOURCE: verified by running `.skilled/skills/system-spec-kit/shared/dist/parsing/secret-scrubber.js` on both strings; both returned unchanged]

3. A realistic-looking fake key can still miss. `sk-fake-0123456789abcdef0123456789abcdef` misses the OpenAI pattern because the hyphen after `sk-` breaks the base62 value class, and `AIzaFake0123456789abcdef0123456789abc` misses the Google pattern because its tail is 33 characters against a required 35. [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:102] [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:109] [SOURCE: verified by running the compiled scrubber on both strings; both returned unchanged]

4. `SECRET_ARGUMENT_KEY` does not match `x-api-key` or `X-Api-Key`, because the alternation requires the key to begin with `api`, `access`, `auth`, `client`, `refresh` or `secret`. The value alone carries no assignment context, so `{"x-api-key": "FAKE0123456789abcdef"}` leaks both the key and the value. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56] [SOURCE: verified by running the `SECRET_ARGUMENT_KEY` and `redactText` patterns on the header shape; both returned unchanged]

5. The array branch of `redactArgument` drops the key: `value.map((item) => redactArgument(item))` passes no key, so a plural secret key holding an array is not redacted by key and each item is only shape-scanned. `{"api_keys": ["plainpassphrase"]}` survives. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:71]

6. `redactBlock` returns image blocks unchanged, deliberately, because image bytes are base64 where a pattern hit would corrupt the image. A token visible in a screenshot is therefore not redacted, and the criterion cannot be met by planting the token in an image. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:86]

7. The harness cannot express the criterion today. `live-hop.sh` contains no token, redaction or plant reference, and `score.cjs` contains no redaction or token field, so no run has ever checked a `[REDACTED:` marker. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:61] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs]

8. The existing redaction test covers seven secret kinds plus a keyed `password` and `token` argument, and asserts the tail never appears in search, browse, load or page replies. It does not cover `x-api-key`, plural keys, arrays under a secret key, or image blocks, so the guarantee is narrower than the test's name suggests. [SOURCE: .skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts:15] [SOURCE: .skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts:28]

9. The preview is the first 160 characters of already-redacted text, so a token past character 160 yields a reply containing neither the token nor a marker. The criterion is satisfiable only on a `load` or `page` reply, or with the token inside the first 160 characters of the turn. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]

## Ruled Out

- "Any planted fake token will be redacted." The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape and passes through.
- "The redaction test proves the criterion." The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths.
- "Planting the token in an image would exercise redaction." Image blocks are returned unchanged by design.

## Dead Ends

- Looking for an entropy or high-randomness detector in the scrubber. There is none; every pattern is a vendor shape, a fixed length, or an assignment context.
- Looking for a redaction count or marker summary in the reply metadata. The reply carries a `preview` and part handles, but no field saying something was removed.

## Edge Cases

- Ambiguous input: "a planted fake token" could mean any string or a realistic vendor-shaped key. This iteration treats both and reports which shapes are caught.
- Contradictory evidence: none. The code and the empirical runs agree.
- Missing dependencies: the harness has no plant hook, so the criterion was assessed by reading the harness rather than by running it.
- Partial success: the shape analysis is empirical, but no live hop was run with a plant, so the end-to-end marker has not been observed in a receiver's reply.

## Sources Consulted

- `.skilled/hooks/session-handover/history/lib/core.ts:56`
- `.skilled/hooks/session-handover/history/lib/core.ts:71`
- `.skilled/hooks/session-handover/history/lib/core.ts:86`
- `.skilled/hooks/session-handover/history/lib/core.ts:136`
- `.skilled/hooks/session-handover/history/lib/pages.ts:300`
- `.skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts:15`
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:59`
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:102`
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:109`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:61`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs`
- Compiled scrubber run over seventeen candidate strings and seven header/URL shapes

## Assessment

- New information ratio: 0.78
- Questions addressed: what the redaction layer guarantees, which plant shapes are caught, and whether the harness can express the criterion
- Questions answered: the criterion is satisfiable only with a vendor-shaped or assignment-context token, and only on a `load` or `page` reply

## Reflection

- What worked and why: running the compiled scrubber instead of reasoning about the regexes turned a guess into a table. The misses were not the ones the pattern comments predict: the hyphen in `sk-fake-` and the 33-character Google tail both defeat a plausible-looking plant.
- What did not work and why: reading the test file for coverage. The test's fixture set is a list of shapes, not a contract, and the three uncovered paths are exactly the ones a header-shaped plant would use.
- What I would do differently: start from the criterion's wording and ask what string would make it fail, then run that string first. The generic `FAKE_TOKEN_` plant is the obvious operator choice and it is the one that misses.

## Recommended Next Focus

Consolidation: the full failure-mode table with one fix per mode, the residual unproven completion criteria, and the smallest set of changes that would make each criterion provable.

## Fixes Named

- Plant a vendor-shaped token in the harness, not a generic one: `ghp_` plus 36 base62 characters, or `api_key=` plus 20 characters containing a digit, so the scrubber's shape requirement is met and the marker is guaranteed. [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:59]
- Add a `redaction` field to `score.cjs` that asserts the receiver's reply contains `[REDACTED:` and does not contain the planted tail, so the criterion is machine-checked rather than eyeballed. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs]
- Have the harness plant the token inside the first 160 characters of the sender's turn, or require the receiver to `load` the turn, so the preview cut cannot hide both the token and the marker. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]
- Extend `SECRET_ARGUMENT_KEY` to accept a leading vendor prefix and a plural suffix, so `x-api-key` and `api_keys` are redacted by key. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56]
- Pass the parent key into the array branch of `redactArgument`, so an array under a secret key is redacted by key rather than by shape. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:71]
- Surface a redaction count in the reply metadata, so a receiver can tell that something was removed without seeing the value. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]
