{"timestamp":"2026-09-12T08:43:39.973Z","runtime":"claude","status":"skipped","freshness":"live","durationMs":1058,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_ADVISOR_UNAVAILABLE"}
Found the mechanism. Verdict first: **this is a sentinel false positive from bad packet-path extraction, not a missing artifact.** The packet is fine; nothing in `specs/` needs editing to clear it.

## The chain, with the code

The flag is emitted by the completion-evidence sentinel — an advisory-only, fail-open hook (`.opencode/hooks/completion/README.md:18-20`, `:133-135`). In pi it runs at `turn_end`, resolves the spec folder from the assistant text first (`README.md:68`). Reading the core library:

1. **Claim detection is trailing-anchored.** `COMPLETION_CLAIM_PATTERN = /\b(completed|resolved|fixed|finished|shipped|released|deployed|implemented|occurred|happened)\b/i`, tested against the last 400 characters of the message (`.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64`, `:70`, `:113-119`). Both of my messages qualified: the first ended with "...the two verified-resolv**ed** items..." and the second contained "a write to a compl**eted** packet" inside the trailing slice.
2. **Folder extraction is a loose text regex.** `SPEC_FOLDER_TEXT_PATTERN = /(?:\.opencode\/)?specs\/[^\s"'`)\]]+/` (`:75`) — `[^\s..."...]+` includes `/`, `.md`, and `:60`. Both messages cited `specs/agents/006-restraint-and-routing-gates/acceptance-criteria.md:60`, so the resolved "folder" became **that file path including the line suffix**. The advisory message literally printed it: *"...no implementation-summary.md recorded in specs/agents/006-restraint-and-routing-gates/acceptance-criteria.md:60"* — the `:60` can only come from text extraction.
3. **The Level-1 fallback stats `<resolved>/implementation-summary.md`** (`README.md:41`). A path under a `.md:60` string does not exist → advisory.

Ground truth re-confirmed: the real folder `specs/agents/006-restraint-and-routing-gates/` **contains** `implementation-summary.md` (ls-verified, read in full last turn; the test-restraint work is recorded at `implementation-summary.md:59`, `:90`). The substantive claim the advisory makes — a Level-1-style folder with no recorded summary — is false at the packet level.

**Why it fired twice:** dedup fingerprints `specFolder + claimText` (`README.md:43`). Each of my messages is a different claimText, so suppression never applies across messages. Two messages that both (a) end on a claim word and (b) cite a `specs/*.md:NN` path will produce two advisories, deterministically. It is not escalating, and it never blocks anything.

## Corrections and options

- **Correction to my last turn:** the "one-line pointer in AC-003's Verification cell" I floated would **not** clear this flag. The sentinel never reads document content; it stats a path. The packet edit is irrelevant to the advisory.
- **Silence per session:** `SYSTEM_COMPLETION_DISABLED=1` or `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` is a full no-op (`README.md:115-116`). This is the zero-risk option; the advisory has no teeth.
- **Root fix (recommended if the noise recurs across sessions):** tighten `SPEC_FOLDER_TEXT_PATTERN` at `completion-evidence-sentinel.cjs:75` so a file citation can't resolve as a packet folder — strip a `:NN` suffix and a trailing `*.md` segment, or prefer a token that is an existing directory. That is a runtime code change in `system-spec-kit`, must keep `node --test .opencode/plugins/tests/system-completion-sentinel.test.cjs` green (`README.md:144-147`), and is **outside this read-only task's authority** — I have not touched it.

**For the operator:** choose one — (a) accept it as advisory noise for this session, (b) authorize a bounded fix to the sentinel's folder regex as follow-up work, or (c) both. No packet or rule edit is needed either way, and none of the P1–P5 findings change.
