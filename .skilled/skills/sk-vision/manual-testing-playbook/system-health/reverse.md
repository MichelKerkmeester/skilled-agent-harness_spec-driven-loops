---
title: "VSN-013 -- Reverse image search"
description: "This scenario validates Reverse image search for `VSN-013`. It focuses on a local perceptual-hash similarity search."
version: 1.0.0.0
---

# VSN-013 -- Reverse image search

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-013`.

---

## 1. OVERVIEW

This scenario validates Reverse image search for `VSN-013`. It focuses on a local perceptual-hash similarity search.

### Why This Matters

Reverse search finds visually similar images on disk - useful for duplicate detection in screenshot corpora.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-013` and confirm the expected signals without contradictory evidence.

- Objective: a local perceptual-hash similarity search over a directory
- Real user request: `Find images like this one in the scratch folder.`
- Prompt: `Use sk_vision_reverse on the fixture and search the scratch folder for similar images.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"hash_search","matches":[...],"scanned":N,"limit":5}}` with N >= 1
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "hash_search"` and `scanned >= 1` (matches may legitimately be empty); FAIL if `scanned` is 0 or the request errors (missing dir or source)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-013 | Reverse image search | Verify a local perceptual-hash similarity search | Use sk_vision_reverse on the fixture and search the scratch folder for similar images. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"hash_search","params":{"source":{"type":"path","path":"<FIXTURE>"},"dir":"<FIXTURE_DIR>","limit":5}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"hash_search","matches":[...],"scanned":N,"limit":5}}` with N >= 1 | The `scanned` count and `matches` array with the transcript | PASS if `result.type == "hash_search"` and `scanned >= 1` (matches may legitimately be empty); FAIL if `scanned` is 0 or the request errors (missing dir or source) | 1. Confirm `dir` points at a readable directory of images -> 2. If `limit` was hit, raise it (max 25) -> 3. Inspect stderr for file-walk errors on unreadable entries |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_reverse on the fixture and search the scratch folder for similar images.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"hash_search","params":{"source":{"type":"path","path":"<FIXTURE>"},"dir":"<FIXTURE_DIR>","limit":5}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"hash_search","matches":[...],"scanned":N,"limit":5}}` with N >= 1

### Evidence

The `scanned` count and `matches` array with the transcript

### Pass / Fail

- **Pass**: `result.type == "hash_search"` and `scanned >= 1` (matches may legitimately be empty)
- **Fail**: `scanned` is 0 or the request errors (missing dir or source)

### Failure Triage

1. Confirm `dir` points at a readable directory of images -> 2. If `limit` was hit, raise it (max 25) -> 3. Inspect stderr for file-walk errors on unreadable entries

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/system-health/reverse.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_hash_search` (dHash) + `_iter_images` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_reverse` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (hash_search) |

---

## 5. SOURCE METADATA

- Group: System health
- Playbook ID: VSN-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `system-health/reverse.md`
