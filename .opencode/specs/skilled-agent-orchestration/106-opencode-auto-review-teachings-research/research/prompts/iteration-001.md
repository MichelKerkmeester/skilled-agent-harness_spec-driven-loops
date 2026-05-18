# Deep Research Iteration 001 of 20 — Pin upstream commit SHA + read README.md

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 1 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` repository's `auto-review` package (branch `issue-136-package-auto-review`).

**Upstream repository under research**: <https://github.com/dzianisv/opencode-plugins/tree/issue-136-package-auto-review/packages/auto-review>

**Raw file base**: `https://raw.githubusercontent.com/dzianisv/opencode-plugins/issue-136-package-auto-review/packages/auto-review/<file>`

**Local repo for gap-analysis context**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

**Package under research**: an OpenCode plugin that performs autonomous validation of AI-generated work. After task completion (`session.idle` event), it spawns a separate review session using a different model to validate completion quality, test evidence, and catch missed edge cases. The package contains 6 files: `README.md`, `auto-review.example.json`, `auto-review.ts`, `index.ts`, `package.json`, `tsconfig.json`.

**Why this campaign exists**: extract reusable patterns from this upstream package to improve our local skills (`sk-code-review`, `deep-research`, `deep-review`, `deep-agent-improvement`) and the OpenCode plugin ecosystem (`mk-skill-advisor`, `mk-code-graph`).

**Your role in this campaign**: iteration 1 is the FOUNDATION iter. You must (a) pin a specific upstream commit SHA so every subsequent iter cites the SAME ref (the branch may rebase mid-campaign), (b) read the README.md fully and extract structured findings about the package's purpose, install, config, trigger semantics, and output contract.

## TASK

### Step 1 — Pin the upstream commit SHA (CRITICAL — non-negotiable)

Run this exact command and capture the SHA:

```bash
SHA=$(gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha' 2>/dev/null) \
  || SHA=$(curl -s "https://api.github.com/repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review" | jq -r '.commit.sha')
echo "PINNED_SHA=$SHA"
```

**Record this SHA at the top of your output file as a markdown comment**:

```markdown
<!-- PINNED_UPSTREAM_SHA: <full-40-char-sha> -->
<!-- PINNED_AT: <ISO timestamp> -->
```

Every subsequent iteration (002-020) will `grep` for `PINNED_UPSTREAM_SHA:` in `research/iterations/iteration-001.md` to learn the ref. If you fail to pin, the entire campaign loses reproducibility — this step is non-negotiable.

### Step 2 — Fetch and read README.md at the pinned SHA

```bash
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/README.md?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-readme-001.md \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/README.md" > /tmp/upstream-readme-001.md
wc -l /tmp/upstream-readme-001.md
cat /tmp/upstream-readme-001.md
```

### Step 3 — Extract structured findings from README

For each of the following 12 dimensions, find the README line range that addresses it and extract the answer. Quote verbatim where helpful.

| Dimension | What to extract |
|-----------|-----------------|
| **Package purpose** | One-paragraph description of what auto-review does |
| **Installation** | Single-file copy vs symlink? Required path? Config path? |
| **Config schema** | Every documented config field, type, default |
| **Trigger conditions** | What event fires the plugin? What gates filter the event? |
| **Reviewer prompt** | Is the exact prompt template documented, or only summarized? |
| **Cross-model behavior** | Does README state how the reviewer model is chosen vs the work model? |
| **Output contract** | What does the reviewer produce? PASS/FAIL/UNKNOWN format? |
| **Loop prevention** | What does README say about preventing review-of-review? |
| **Diagnostic logging** | Where do debug logs land? When are they enabled? |
| **Limitations** | What does README say the plugin CANNOT do? |
| **Compatibility** | Which OpenCode versions / runtimes does it support? |
| **License + author** | Note the SPDX identifier and author/maintainer |

### Step 4 — Note any README claims that you suspect might be inaccurate

cli-devin SWE-1.6 must NOT assume the README is correct. If a README claim seems implausible (e.g. "fully isolated review session with zero risk") or under-specified (e.g. "uses a structured prompt" but no template shown), flag it for verification in iter 003-005 (which read the actual auto-review.ts source).

## SCOPE (this iteration only)

- `packages/auto-review/README.md` — entire file
- The `gh api` / `curl` commands above to pin the SHA
- No other upstream files in this iter (later iters read them)
- No local-repo file reads in this iter (gap-analysis iters 016-018 handle that)
- **No writes to any file outside `research/iterations/iteration-001.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
# 1. Pin SHA
SHA=$(gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha' 2>/dev/null) \
  || SHA=$(curl -s "https://api.github.com/repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review" | jq -r '.commit.sha')
echo "PINNED_SHA=$SHA"

# 2. Fetch README at pinned SHA
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/README.md?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-readme-001.md \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/README.md" > /tmp/upstream-readme-001.md
wc -l /tmp/upstream-readme-001.md

# 3. Verify file is non-empty + cite line counts
head -5 /tmp/upstream-readme-001.md
echo "..."
tail -5 /tmp/upstream-readme-001.md
```

## CONSTRAINTS

- READ-ONLY: no upstream mutations, no local source mutations. Writes confined to the iteration output file and the state JSONL.
- Cite `packages/auto-review/README.md:<line>` for every README claim.
- Use absolute paths for any local-repo refs (none expected this iter).
- Pin the upstream commit SHA as Step 1; if pinning fails, halt and write `PINNED_UPSTREAM_SHA: PIN_FAILED <reason>` so iter 002 can detect and re-attempt.
- Stop adding new probes past minute 5; spend minute 5-6 writing the output file.
- Do NOT dispatch any cli-* tool (cli-devin / cli-opencode / cli-codex / cli-gemini); you are the dispatched executor.
- Do NOT spawn SpawnAgent / Task / any sub-agent.

## COMMON FAILURE MODES

1. **gh API rate-limit**: if `gh api` returns 403, fall back to `curl` via `api.github.com` (unauthenticated has ~60 req/h limit) or `raw.githubusercontent.com`.
2. **base64 piping**: macOS `base64 -d` works; Linux uses `base64 -d` too. If decode fails, try `base64 --decode`.
3. **Empty file fetched**: a 0-byte README means the API succeeded but the file is missing — record `VERIFIED-MISSING` and let iter 020 synthesis flag it.
4. **SHA pin race**: if the branch is force-pushed mid-iter, your SHA may not match later iters. Pin once and stick with it.

## OUTPUT FORMAT

Write to `research/iterations/iteration-001.md` with this EXACT structure:

```markdown
<!-- PINNED_UPSTREAM_SHA: <40-char-sha-or-PIN_FAILED> -->
<!-- PINNED_AT: <ISO8601-UTC> -->

# Iteration 001 — Pin upstream commit SHA + read README.md

## Summary
<2-4 sentence verdict on what README.md tells us about the package + any reservations about README claims>

## Pinned Upstream SHA
`<full-40-char-sha>` (pinned at <ISO timestamp>)

## Files/Commands Reviewed
- `gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha'` → exit 0, sha=<sha>
- `packages/auto-review/README.md` → <N> lines fetched at <sha>

## Findings

### README Extraction Table
| Dimension | Answer | README line range |
|-----------|--------|-------------------|
| Package purpose | <one paragraph> | <line-range> |
| Installation | <single-file/symlink/both>; path: <path>; config path: <path> | <line-range> |
| Config schema | <field>:<type>:<default>; ... | <line-range> |
| Trigger conditions | <event>; gates: <list> | <line-range> |
| Reviewer prompt | <documented exactly / summarized only / absent> | <line-range> |
| Cross-model behavior | <described how / not described> | <line-range> |
| Output contract | <PASS/FAIL/UNKNOWN / free-form / other> | <line-range> |
| Loop prevention | <what README says> | <line-range> |
| Diagnostic logging | <path + when enabled> | <line-range> |
| Limitations | <list> | <line-range> |
| Compatibility | <opencode versions / runtimes> | <line-range> |
| License + author | <SPDX>; <maintainer> | <line-range> |

### Suspicious / Under-specified README Claims
| ID | Claim | Why suspicious | Where to verify in later iter |
|----|-------|----------------|-------------------------------|
| S-1 | <example: "fully isolated review session"> | <reasoning> | iter-005 (auto-review.ts event handler) |

## Convergence Signal
`newInfoRatio: 1.00` — first iter, all info is new. `dimension status: FULLY EXTRACTED` (README fully read) OR `PARTIAL (X dimensions blank, see suspicious claims)`.
```

Then append exactly one line to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":1,"focus":"README + pin SHA","mechanismsExtracted":0,"gapsIdentified":0,"newInfoRatio":1.00,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] PINNED_UPSTREAM_SHA recorded (40-char hex) at top of output file
- [ ] README extraction table has 12 rows (one per dimension)
- [ ] At least 1 suspicious/under-specified claim flagged (zero is suspicious in itself — README is unlikely to perfectly document every detail)
- [ ] State JSONL line appended with pinnedSha field populated
- [ ] Output file ≥ 50 lines

Begin.
