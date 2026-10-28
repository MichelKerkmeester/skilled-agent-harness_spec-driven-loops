---
title: "CR-032 -- PR-state content-hash dedup"
description: "This scenario validates the M-1 PR-state content-hash dedup gate for `CR-032`. It focuses on the two-hash signature, the cache file outside the reviewed repository, the exact skip status line, the cache write after a full review, and the pathspec scope that keeps its own key."
version: 1.0.0.0
---

# CR-032 -- PR-state content-hash dedup

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-032`.

---

## 1. OVERVIEW

This scenario validates the M-1 PR-state content-hash dedup gate for `CR-032`. It focuses on a scratch repository whose signature is computed twice, a seeded cache entry that turns the second run into the skip line, a new commit that restores the full review, and a pathspec scope that keeps a signature and a cache file of its own.

### Why This Matters

M-1 is the gate that stops a pull request from being reviewed twice with nothing changed in between, and it is also the one gate with a write side effect: a cache file in the reviewing user's cache directory. Both halves need evidence. A signature that is computed from the wrong pair of inputs skips reviews that should run, which hides defects; a cache file written into the reviewed repository breaks the Extension Floor that the mode writes nothing there. Neither the two-hash recipe, the skip line, the 100-entry retention, the cache write nor the pathspec key is exercised by any other scenario, so without this one the whole gate could be removed and the battery would still report green. `references/pr-state-dedup.md` holds the commands; this scenario runs them.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-032` and confirm the expected signals without contradictory evidence.

- Objective: confirm the M-1 signature is reproducible, a matching entry produces the exact skip line and no full review, a new commit produces a different signature and a second cache entry, and a pathspec keeps a separate key.
- Real user request: `Review this pull request again only if something changed since the last review.`
- Prompt: `Review this branch again and tell me whether anything changed since the last review at <prev_sha>, so you can skip the full pass when it did not.`
- Expected execution process: build the scratch fixture, compute the diff hash, the commit subject and the signature, seed and read the cache, emit the skip line, run the final-line checker over it, commit a change and re-compute, then repeat with a pathspec; compare every comparison and the one exact string against the Expected block.
- Expected signals: the second computation reproduces the first signature; the cache lookup returns the recorded `prev_sha`; the skip output is the status line alone and the final-line checker exits 0; a new commit produces a signature that is absent from the cache and a second entry appears; the pathspec scope produces a different `repo-ref` and a signature that a change outside the pathspec leaves untouched.
- Desired user-visible outcome: a reviewer that skips a repeat review with a verifiable reason, and no folder created inside the reviewed repository.
- Pass/fail: PASS if the signature reproduces on an unchanged branch, the cache hit prints exactly `Review status: COMMENTED (no changes since last review at <prev_sha>)` as the whole output with the recorded sha, the final-line checker exits 0, a new commit misses the cache and appends an entry, and the pathspec scope keeps its own key and survives an out-of-scope change; FAIL if a hash input is missing, the skip line differs, a full review runs on an unchanged branch, the cache is written inside the reviewed repository, or the pathspec shares the whole-repository key.

**Exact prompt**:

```text
Review this branch again and tell me whether anything changed since the last review at <prev_sha>, so you can skip the full pass when it did not.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this branch again and tell me whether anything changed since the last review at <prev_sha>, so you can skip the full pass when it did not.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-032 | PR-state content-hash dedup | Confirm the M-1 signature is reproducible, a matching entry produces the exact skip line and no full review, a new commit produces a different signature and a second cache entry, and a pathspec keeps a separate key. | `Review this branch again and tell me whether anything changed since the last review at <prev_sha>, so you can skip the full pass when it did not.` | bash: build the scratch fixture and point `XDG_CACHE_HOME` at a scratch folder -> bash: compute the diff hash, the commit subject and the signature, and write the cache entry -> bash: recompute and read the matching `prev_sha` -> bash: write the skip output and run the final-line checker over it -> bash: commit a change and confirm the signature misses the cache -> bash: repeat with a pathspec and confirm its own key | The second computation reproduces the first signature; the lookup returns the recorded `prev_sha`; the skip output is the status line alone and the checker exits 0; the new commit's signature is absent from the cache and a second entry appears; the pathspec `repo-ref` differs and a change outside the pathspec leaves its signature untouched | Both signature transcripts, the cache file contents, the skip output, the final-line checker output, and the pathspec comparison | PASS iff the signature reproduces unchanged, the skip line reads exactly `Review status: COMMENTED (no changes since last review at <prev_sha>)` with the recorded sha as the whole output, the checker exits 0, a new commit misses the cache and appends an entry, and the pathspec keeps its own key across an out-of-scope change; FAIL on any missing hash input, a difference in the skip line, a full review on an unchanged branch, a cache file inside the reviewed repository, or a shared pathspec key | 1. Confirm the fixture was built verbatim and the cache path resolved under the scratch folder; 2. Re-run the signature step and compare the two diff hashes before suspecting the gate; 3. Check that the subject came from the first line of the log for the same range and the same pathspec; 4. Confirm the skip output carries nothing else and no `Not checked:` line |

### Exact Commands

Step 1 builds the fixture outside the checkout. The repository has no `origin` remote, so its identity falls back to the repository root path, which is the documented local-only case. `XDG_CACHE_HOME` points into the scratch folder so the run never touches the operator's own cache.

```bash
CHECKOUT="$PWD"
SCRATCH="<scratch folder outside the repository>"
export XDG_CACHE_HOME="$SCRATCH/cache"
mkdir -p "$SCRATCH/repo/packages/api" "$SCRATCH/repo/packages/web"
cd "$SCRATCH/repo"
git init -q .
git config user.email operator@example.com
git config user.name Operator
git checkout -qb main
printf 'module.exports = () => 1;\n' > packages/api/index.js
printf 'module.exports = () => 2;\n' > packages/web/index.js
git add -A && git commit -qm 'baseline'
git checkout -qb feature
printf 'module.exports = () => 42;\n' > packages/api/index.js
git add -A && git commit -qm 'feat: raise the api answer'
```

Step 2 computes the two hashes, derives the cache path and writes the entry a full review would write.

```bash
BASE=main
SCOPE=""
REPO_ID=$(git remote get-url origin 2>/dev/null || git rev-parse --show-toplevel)
if [ -n "$SCOPE" ]; then
  REPO_REF=$(printf '%s\x1f%s' "$REPO_ID" "$SCOPE" | sha256sum | awk '{print $1}' | cut -c1-12)
else
  REPO_REF=$(printf '%s' "$REPO_ID" | sha256sum | awk '{print $1}' | cut -c1-12)
fi
CACHE="$XDG_CACHE_HOME/sk-code-review/$REPO_REF.jsonl"
mkdir -p "$(dirname "$CACHE")"
DIFF_HASH=$(git diff $BASE...HEAD ${SCOPE:+-- "$SCOPE"} | sha256sum | awk '{print $1}')
SUBJECT=$(git log $BASE...HEAD --format=%s ${SCOPE:+-- "$SCOPE"} | head -1)
SIGNATURE=$(printf '%s\x1f%s' "$SUBJECT" "$DIFF_HASH" | sha256sum | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)
printf '{"signature": "%s", "timestamp": "%s", "prev_sha": "%s"}\n' \
  "$SIGNATURE" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$HEAD_SHA" >> "$CACHE"
echo "REPO_REF=$REPO_REF"
echo "DIFF_HASH=$DIFF_HASH"
echo "SUBJECT=$SUBJECT"
echo "SIGNATURE=$SIGNATURE"
cat "$CACHE"
```

Step 3 recomputes from scratch and reads the recorded `prev_sha` out of a matching line.

```bash
DIFF_HASH_2=$(git diff $BASE...HEAD ${SCOPE:+-- "$SCOPE"} | sha256sum | awk '{print $1}')
SUBJECT_2=$(git log $BASE...HEAD --format=%s ${SCOPE:+-- "$SCOPE"} | head -1)
SIGNATURE_2=$(printf '%s\x1f%s' "$SUBJECT_2" "$DIFF_HASH_2" | sha256sum | awk '{print $1}')
PREV_SHA=$(awk -v s="$SIGNATURE_2" 'index($0, s) { match($0, /"prev_sha": "[0-9a-f]+"/); print substr($0, RSTART+13, RLENGTH-14) }' "$CACHE")
echo "REPRODUCED=$([ "$SIGNATURE_2" = "$SIGNATURE" ] && echo yes || echo no)"
echo "PREV_SHA=$PREV_SHA"
```

Step 4 writes the skip output and checks it. The checker ships with the mode, so the step returns to the checkout root that holds it.

```bash
printf 'Review status: COMMENTED (no changes since last review at %s)\n' "$PREV_SHA" > "$SCRATCH/skip-output.md"
cat "$SCRATCH/skip-output.md"
cd "$CHECKOUT"
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js "$SCRATCH/skip-output.md"
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js "$SCRATCH/skip-output.md"
cd "$SCRATCH/repo"
```

Step 5 commits a change and confirms the new signature is not in the cache, so a full review runs and a second entry is appended.

```bash
printf 'module.exports = () => 43;\n' > packages/api/index.js
git add -A && git commit -qm 'feat: raise the api answer again'
DIFF_HASH_3=$(git diff $BASE...HEAD | sha256sum | awk '{print $1}')
SUBJECT_3=$(git log $BASE...HEAD --format=%s | head -1)
SIGNATURE_3=$(printf '%s\x1f%s' "$SUBJECT_3" "$DIFF_HASH_3" | sha256sum | awk '{print $1}')
echo "SIGNATURE_CHANGED=$([ "$SIGNATURE_3" != "$SIGNATURE" ] && echo yes || echo no)"
echo "CACHE_HITS=$(grep -c "$SIGNATURE_3" "$CACHE")"
printf '{"signature": "%s", "timestamp": "%s", "prev_sha": "%s"}\n' \
  "$SIGNATURE_3" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(git rev-parse HEAD)" >> "$CACHE"
echo "CACHE_LINES=$(wc -l < "$CACHE" | tr -d ' ')"
```

Step 6 repeats with a pathspec and proves the scope keeps its own key.

```bash
SCOPE=packages/api
REF_SCOPED=$(printf '%s\x1f%s' "$REPO_ID" "$SCOPE" | sha256sum | awk '{print $1}' | cut -c1-12)
scoped_signature() {
  printf '%s\x1f%s' \
    "$(git log $BASE...HEAD --format=%s -- "$SCOPE" | head -1)" \
    "$(git diff $BASE...HEAD -- "$SCOPE" | sha256sum | awk '{print $1}')" \
    | sha256sum | awk '{print $1}'
}
whole_signature() {
  printf '%s\x1f%s' \
    "$(git log $BASE...HEAD --format=%s | head -1)" \
    "$(git diff $BASE...HEAD | sha256sum | awk '{print $1}')" \
    | sha256sum | awk '{print $1}'
}
SCOPED_BEFORE=$(scoped_signature)
WHOLE_BEFORE=$(whole_signature)
printf 'module.exports = () => 9;\n' > packages/web/index.js
git add -A && git commit -qm 'feat: change the web answer'
SCOPED_AFTER=$(scoped_signature)
WHOLE_AFTER=$(whole_signature)
echo "REPO_REF_WHOLE=$REPO_REF"
echo "REPO_REF_SCOPED=$REF_SCOPED"
echo "SCOPED_UNCHANGED=$([ "$SCOPED_BEFORE" = "$SCOPED_AFTER" ] && echo yes || echo no)"
echo "WHOLE_CHANGED=$([ "$WHOLE_BEFORE" != "$WHOLE_AFTER" ] && echo yes || echo no)"
ls "$SCRATCH/repo" | grep -c cache
```

### Expected

Each hash value depends on the fixture, so the Expected block fixes the comparisons and the one exact string rather than the hex values. `REPO_REF` is `sha256(<repository root path> + "\u001f" + <pathspec>).slice(0, 12)`, so the whole-repository run and the pathspec run must print two different twelve-character keys.

```text
REPO_REF=<twelve hex characters>
DIFF_HASH=<sixty-four hex characters>
SUBJECT=feat: raise the api answer
SIGNATURE=<sixty-four hex characters>
{"signature": "<SIGNATURE>", "timestamp": "<ISO-8601>", "prev_sha": "<HEAD_SHA>"}
```

Step 3 must reproduce the signature and recover the recorded sha:

```text
REPRODUCED=yes
PREV_SHA=<HEAD_SHA recorded in step 2>
```

Step 4, the skip output, is the status line alone, and both checkers accept it because a skip status passes only as the whole output:

```text
Review status: COMMENTED (no changes since last review at <prev_sha>)
OK: review output ends on the exact status line
OK: no numbered findings to check
```

Step 5 must show a new signature that the cache does not hold, then a second entry:

```text
SIGNATURE_CHANGED=yes
CACHE_HITS=0
CACHE_LINES=2
```

Step 6 must show two different keys, a scoped signature the out-of-scope commit left alone, and a whole-repository signature the same commit changed. The final `0` is the count of files named `cache` inside the reviewed repository, which is the Extension Floor that the gate writes nothing there.

```text
REPO_REF_WHOLE=<twelve hex characters>
REPO_REF_SCOPED=<twelve different hex characters>
SCOPED_UNCHANGED=yes
WHOLE_CHANGED=yes
0
```

| Signal | Expected value |
| --- | --- |
| Step 3 `REPRODUCED` | `yes` |
| Step 4 skip line | `Review status: COMMENTED (no changes since last review at <prev_sha>)` as the whole output |
| Step 4 checkers | `OK: review output ends on the exact status line`, `OK: no numbered findings to check`, both exit 0 |
| Step 5 `CACHE_HITS` | `0`, so the full review runs |
| Step 5 `CACHE_LINES` | `2`, one entry per completed full review |
| Step 6 keys | `REPO_REF_WHOLE` differs from `REPO_REF_SCOPED` |
| Step 6 `SCOPED_UNCHANGED` | `yes`, the out-of-scope commit does not move the scoped signature |
| Step 6 last line | `0`, no cache folder inside the reviewed repository |

The last step ends on `grep -c`, which exits `1` when it prints `0`. Read the printed count, not the final exit status of that pipeline.

### Evidence

The step 2 and step 3 signature transcripts, the cache file contents after step 2 and after step 5, the skip output file, both checker outputs with their exit status, and the step 6 comparison transcript.

### Pass / Fail

- **Pass**: the signature reproduces on the unchanged branch, the lookup returns the recorded `prev_sha`, the skip output is exactly the status line with that sha and both checkers exit 0, the new commit's signature misses the cache and a second entry appears, the pathspec prints a different key from the whole-repository run, and the out-of-scope commit leaves the scoped signature unchanged while the whole-repository signature moves.
- **Fail**: any hash input missing from the recipe, a skip line that differs in punctuation or wording, a full review on the unchanged branch, a cache entry written for a skipped run, a shared key between the two scopes, or a `cache` folder inside the reviewed repository.

### Failure Triage

1. Confirm the fixture was built verbatim. A different file set or a different commit message changes `DIFF_HASH` and `SUBJECT`, and every later comparison then fails for the fixture rather than the gate.
2. Re-run step 3 before suspecting the gate: an unreproduced signature usually means the diff hash came from a different range or a different pathspec than the subject did, which the same-variable recipe avoids.
3. Check `CACHE_HITS` after step 5. A `1` means the new commit did not change either hash input, which happens when the commit only rewrites metadata that the diff does not carry.
4. If the checker rejects the skip output, quote its message. A trailing `Not checked:` line, a trailing blank line or any text after the status line fails, and the M-1 skip output carries none of them.
5. If `REPO_REF` equals `REPO_REF_SCOPED`, the scope variable was empty in both runs, so step 6 did not reach the pathspec branch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Section 9.1 M-1 signature, cache storage, retention and skip behavior; section 4 Extension Floors |
| `../../references/pr-state-dedup.md` | The signature recipe, pathspec scope, retention and cache-write rules this scenario runs |
| `../../scripts/check-review-final-line.js` | Accepts the skip status only as the whole output |
| `../../scripts/check-review-findings.js` | Confirms a skip status is never compared against findings |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-032
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `efficiency-and-restraint/pr-state-content-hash-dedup.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
