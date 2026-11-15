---
title: "Implementation Plan: Phase 14: vibe-journal-fixture-and-reader"
description: "Run keyed Vibe fixture probes that record the post_agent payload, the deny-retry behavior and a compaction entry, then build a read-only journal reader tested on those recordings. The facts land in scratch/facts.md for phases 016 to 018."
trigger_phrases:
  - "vibe journal fixture and reader plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: vibe-journal-fixture-and-reader

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash fixture scripts, Node.js ES module reader |
| **Framework** | Vibe 3.1.2 hooks and session journal; the shared session-reader package |
| **Storage** | Vibe's session journal (`<output-dir>/session/journal/*.jsonl`), read only |
| **Testing** | Keyed `vibe -p` fixture runs and `node --test` on recorded journals |

### Overview
The probes reuse the shape of `run-fixture.sh`: a trusted throwaway project, the repository's model config in a fresh `VIBE_HOME`, one keyed turn, and the journal read afterwards. A capture hook logs its stdin and a listing of `transcript_path` at the moment it runs. A deny variant proves the retry and its cap. A fixture config with a small `max_context_length` model row, passed through a new optional `run-fixture.sh` argument, forces one compaction. The reader is written against the records those runs show, and tested on redacted copies.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `bash .vibe/plugins/repo-guards/fixtures/run-fixture.sh .vibe/plugins/repo-guards/fixtures/wire-format/hooks.toml "run echo hi"` prints `DENIED`
- [ ] `MISTRAL_API_KEY` is exported in the dispatching shell

### Definition of Done
- [ ] `scratch/facts.md` holds four `## Q` sections, each ending in `Answer:` and `Consequence:`
- [ ] `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe first, then a read-only adapter.

### Key Components
- **Post-agent fixture** (`fixtures/post-agent/`): without it, phase 016's journal-read design rests on an inference.
- **Compaction fixture** (`fixtures/compaction/`): without it, phase 018 cannot match a compaction record.
- **Vibe reader** (`session-readers/vibe.mjs`): one place that knows the journal format, so a Vibe upgrade breaks one file and one test, not three hooks.

### Data Flow
Vibe writes the session journal under `--output-dir`. A hook receives `transcript_path`, which is the session storage root (`_foreign_hooks.py:282`), and calls the reader with it. The reader opens the journal read-only, checks the records match the shapes it knows, and returns the last reply text, the current turn's tool calls, or the compactions after a watermark.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the existing fixture runner still denies and copies the recorded journals into a test fixture folder. Implementation writes the post-agent and compaction fixtures, runs each probe, records the answers in `scratch/facts.md`, then writes the reader and its tests. Verification runs the reader tests and checks that each fact has its evidence. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`vibe-reader.test.mjs` loads redacted copies of the 011 scratch-cwd journal and the new probe journals. It asserts five things. `lastAssistantText` returns the exact recorded reply. `turnToolCalls` lists the recorded `write_file` call. `compactionsSince` returns the recorded compaction after watermark 0 and nothing after its own sequence. `turnId` returns the recorded last turn's id. A missing or foreign-format journal returns a failure code, and the read leaves the file's bytes and modification time unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, `jq`, Node.js, phase 008's `run-fixture.sh` and `MISTRAL_API_KEY`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the reader breaks a hook that calls it. The `vibe` row ships `gated`, so history lookup never offers a Vibe session from this phase; revert this phase's commit. The fixtures are standalone and need no rollback.
<!-- /ANCHOR:rollback -->

---
