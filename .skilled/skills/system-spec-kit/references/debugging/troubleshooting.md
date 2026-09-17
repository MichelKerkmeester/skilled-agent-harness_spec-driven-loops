---
title: Troubleshooting Reference
description: Systematic diagnosis and resolution for trigger-index lookups, ripgrep retrieval, continuity saves, and spec-folder problems.
trigger_phrases:
  - "spec kit troubleshooting guide"
  - "trigger index lookup fails"
  - "ripgrep retrieval returns nothing"
  - "continuity save failures"
  - "spec folder diagnosis"
importance_tier: normal
contextType: general
version: 3.6.0.39
---

# Troubleshooting Reference - Issue Resolution Guide

Systematic diagnosis and resolution for retrieval, continuity and spec-folder problems.

---

## 1. OVERVIEW

**Core Principle:** Systematic diagnosis before fixes. Never guess at solutions.

This reference provides structured troubleshooting for spec-folder retrieval and continuity, covering:

- **Trigger lookup failures** - the Gate 1 index returning nothing, or refusing to run
- **Free-text retrieval failures** - ripgrep recipes returning nothing, or the wrong thing
- **Continuity save failures** - `generate-context.js` rejecting or mis-targeting a save
- **Spec-folder problems** - missing files, validation errors, wrong packet

Retrieval is lexical and file-based. There is no server to restart, no index to warm and no embedding to blame. That narrows the diagnosis: a miss is a corpus gap, a scoping error, or a broken invocation, and the exit status tells you which.

### Diagnosis Decision Tree

```
Issue Detected
     │
     ├─→ "No results" ─────────────────→ See §3 COMMON ERRORS
     │         │
     │         ├─→ Lookup exit 1? ──────→ Clean miss: the phrase was never declared
     │         └─→ Lookup exit 2? ──────→ Broken: bad flags or unreadable index
     │
     ├─→ "Wrong results" ──────────────→ See §4 DEBUGGING
     │         │
     │         ├─→ Too many hits? ──────→ Narrow the positional search root
     │         └─→ Wrong packet? ───────→ Check the track/packet path you passed
     │
     ├─→ "Save rejected" ──────────────→ See §3 Continuity Save Issues
     │
     └─→ "Permission denied" ──────────→ See §3 File System Issues
```

---

## 2. QUICK FIXES

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing spec folder | `Folder not found` | Create the packet folder with canonical docs, then run `generate-context.js` to refresh metadata |
| Lookup returns nothing | Exit `1` from the lookup script | A clean miss. The phrase is not in any document's `trigger_phrases`; fall back to the ripgrep lane |
| Lookup refuses to run | Exit `2` from the lookup script | Bad invocation or unreadable index. Check the flags, then `ls -l runtime/data/trigger-index.json` |
| Index stale after edits | New `trigger_phrases` not matched | Rerun `runtime/cli/retrieval/generate-trigger-index.mjs` |
| Wrong script path | `File not found` | Use `.opencode/skills/system-spec-kit/` |
| Arg format error | Invalid scope | Use the full packet path: `specs/<track>/122-skill-standardization` |
| Ripgrep result set surprises you | Files appear or vanish between runs | Missing `--no-config` or reordered globs; copy the recipe verbatim |

### Before/After: Common Mistakes

❌ **Wrong approach:**
```bash
# Guessing at folder names, and scoping by pattern instead of by path
rg 'auth' --glob '122*'
```

✅ **Correct approach:**
```bash
# Scope by positional search root, using the full packet path
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 --glob '*.md' \
  -- 'auth' specs/<track>/122-skill-standardization
```

❌ **Wrong approach:**
```bash
# Combining output modes: the last one silently wins
rg --json --count -- 'phrase' specs
```

✅ **Correct approach:**
```bash
# One output mode per invocation
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' -- 'phrase' specs .opencode
```

---

## 3. COMMON ERRORS

### Trigger Lookup Issues

| Error | Root Cause | Resolution |
|-------|------------|------------|
| Exit `1`, empty output | No document declares a matching phrase | Expected behavior for a miss. Use the ripgrep lane, or add the phrase to the owning document's `trigger_phrases` |
| Exit `2`, `unreadable index` | `runtime/data/trigger-index.json` missing or truncated | Regenerate with `runtime/cli/retrieval/generate-trigger-index.mjs` |
| Exit `2`, usage error | Flags in the wrong order, or a pattern parsed as a flag | Keep the `--` separator before the prompt |
| Match set feels arbitrary | Generic phrases in the corpus | Author phrases per `../retrieval/retrieval-conventions.md` §8; generic workflow words pollute every query |

### Free-Text Retrieval Issues

| Error | Root Cause | Resolution |
|-------|------------|------------|
| Result set changes between machines | `RIPGREP_CONFIG_PATH` injecting arguments | `--no-config` is mandatory in every recipe |
| Archived packets in the results | Exclusion globs dropped or reordered | Keep the positive glob first, the exclusions last |
| Parser sees an empty result | Two output modes on one command line | One output mode per invocation; the last flag wins silently |
| Exit `2` read as a no-hit | Non-existent search root, or a malformed pattern | Branch on all three exit statuses; `2` is a failure, not a miss |

### Continuity Save Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Save rejected as thin** | `INSUFFICIENT_CONTEXT_ABORT` | Add a specific `sessionSummary`, real `recent_context` entries, and described `FILES` rows |
| **Save rejected as mixed** | `CONTAMINATION_GATE_ABORT` | The payload carries content from another packet; split it |
| **Explicit data file unreadable** | `EXPLICIT_DATA_FILE_LOAD_FAILED` | Surface the error and stop; do not fall back to a capture path |
| **Save landed in the wrong packet** | Continuity written under another folder | Re-run with the exact spec-folder CLI target; the explicit target is authoritative |
| **Script not found** | `File not found` for `generate-context.js` | Run `npm run build` in `system-spec-kit/` |

### Anchor and Document Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Anchor not found** | `Anchor not found: X` | Grep the marker directly: `rg -- '<!-- ANCHOR:' <file>` |
| **Orphan marker** | An opening marker with no closing pair | Report it as a diagnostic; do not silently drop the block |
| **Legacy file detected** | `Legacy format detected` | Re-save to generate current anchors |
| **Token budget exceeded** | Reading whole documents when an anchor would do | Bound the read to the anchor block, per `../retrieval/retrieval-conventions.md` §2.4 |

### File System Issues

| Error | Root Cause | Resolution |
|-------|------------|------------|
| `Permission denied` | Folder not writable | `chmod -R u+w specs/###-*/` |
| `ENOENT: no such file` | Path doesn't exist | Create directory structure first |
| `EACCES` | User lacks permissions | Check ownership: `ls -la` |
| `Disk full` | No space for index | Clear old data or expand storage |

---

## 4. DEBUGGING

### Debugging Commands

```bash
# Check if a canonical spec doc has anchors (UPPERCASE format)
grep -c "<!-- ANCHOR:" .opencode/specs/<track>/<NNN-name>/implementation-summary.md

# List all available anchor IDs in a spec doc
grep -o 'ANCHOR:[a-z0-9-]*' .opencode/specs/<track>/<NNN-name>/*.md | sed 's/ANCHOR://' | sort -u

# Find all spec docs with anchors across the project
find .opencode/specs -name "*.md" -exec grep -l "<!-- ANCHOR:" {} \;

# Resolve a prompt against the trigger index (exit 0 hit, 1 miss, 2 broken)
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder"

# Rebuild the index after frontmatter changes
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs

# Free-text scan, path-only, per references/retrieval/retrieval-conventions.md
rg --no-config --fixed-strings --ignore-case --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

### File Format Detection

```bash
# Check file version (UPPERCASE anchor format)
grep -q "<!-- ANCHOR:" file.md && echo "Current (supports anchors)" || echo "Legacy (full read only)"

# Count files by format in a spec folder
current_count=$(find .opencode/specs/<track>/<NNN-name> -name "*.md" -exec grep -l "<!-- ANCHOR:" {} \; | wc -l)
total_count=$(find .opencode/specs/<track>/<NNN-name> -name "*.md" | wc -l)
echo "Current: $current_count | Legacy: $((total_count - current_count))"
```

### Systematic Debugging Workflow

**Step 1: Gather Information**
```bash
# Does the index exist, and how old is it?
ls -l .opencode/skills/system-spec-kit/runtime/data/trigger-index.json

# Does the phrase resolve at all? Read the exit status, not just the output
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "recent work"; echo "exit=$?"

# Does the text exist anywhere, declared or not?
rg --no-config --fixed-strings --ignore-case --count \
  --glob '*.md' -- 'recent work' specs .opencode
```

**Step 2: Isolate the Problem**

❌ **Wrong approach:**
```
"Search isn't working" → Rerun the same query with different wording
```

✅ **Correct approach:**
```
"Search isn't working" → Read the exit status → Confirm the text exists with a raw scan
  → Then decide: corpus gap, scoping error, or broken invocation
```

**Step 3: Verify Fix**
```bash
# The phrase now resolves
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "test"; echo "exit=$?"

# And the raw scan agrees the content is where you think it is
rg --no-config --fixed-strings --ignore-case --files-with-matches \
  --glob '*.md' -- 'test' specs
```

### Root Cause Analysis Patterns

| Symptom | Check First | Check Second | Likely Cause |
|---------|-------------|--------------|--------------|
| Every lookup empty | Index file exists and parses | Index freshness | Missing or stale `trigger-index.json` |
| One lookup empty, raw scan finds it | The document's `trigger_phrases` | Phrase wording | Corpus gap: the author never declared it |
| Too many hits | The positional search root | The glob list | Scope too wide |
| Results differ between machines | `--no-config` present | Glob order | Ambient ripgrep configuration |
| Exit `2` treated as a miss | The search root exists | The pattern parses | Broken invocation read as no-hit |

---

## 5. ESCALATION

### When to Escalate

**Escalate immediately if:**
- The trigger index cannot be regenerated from a clean checkout
- The continuity writer corrupts or truncates a packet document
- Data loss suspected in `handover.md` or `_memory.continuity`
- Permission issues persist after standard fixes

### Escalation Checklist

Before escalating, gather:

```markdown
□ Error message (exact text)
□ The exact command and its exit status
□ Steps to reproduce
□ Recent changes to config
□ Server logs (if available)
```

### Escalation Path

| Severity | Condition | Action |
|----------|-----------|--------|
| **Critical** | Data loss suspected | Stop operations, backup immediately |
| **High** | System unusable | Restart services, check logs |
| **Medium** | Feature degraded | Document issue, apply workaround |
| **Low** | Minor inconvenience | Log for later fix |

### Common Workflow Issues

**"I can't find a specific decision I know we made"**

✅ Solution: Widen the search root to everything, then narrow once you have a hit
```bash
rg --no-config --fixed-strings --ignore-case --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'auth decision' specs .opencode
```

**"The lookup returns nothing but I know the content exists"**

Root Cause: The index only knows author-declared phrases. Prose the author never listed in `trigger_phrases` is invisible to it, however prominent it is in the document.

✅ Solution:
1. Confirm the text exists with a raw scan over `specs`
2. If it does, add the phrase to that document's `trigger_phrases` and regenerate the index
3. Read the file directly for known content; no lookup is needed to open a path you already have

**"Context loaded from wrong spec folder"**

Root Cause: The wrong positional search root, or a save with the wrong explicit target

✅ Solution:
```bash
# Scope every retrieval by path, not by pattern
rg --no-config --fixed-strings --ignore-case --files-with-matches \
  --glob '*.md' -- 'current task' specs/<track>/<NNN-correct-folder>
```

For direct memory saves, prefer an explicit CLI target:

```bash
node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js \
  /tmp/save-context-data-<session-id>.json \
  <spec-folder>
```

That explicit target is authoritative. Session-learning hints and auto-detect logging do not reroute the save.

Phase-folder targets are valid explicit save destinations. If a save lands in the wrong folder, re-run it with the exact phase-folder CLI target you intended to use.

---

## 6. RECOVERY PROCEDURES

### Index Recovery

If the trigger index is missing or corrupted:

1. **Confirm the damage**: `ls -l .opencode/skills/system-spec-kit/runtime/data/trigger-index.json`
2. **Regenerate**: `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
3. **Verify recovery**: a known phrase resolves with exit `0`

The index is a derived artifact built from committed frontmatter. Losing it costs a regeneration, never data.

### Data Recovery

If packet documents are missing:

1. Check the file system: `find specs -name "*.md"` for canonical spec docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
2. Check git: the documents are the durable record, so `git log --` on the packet path is the real recovery path
3. Rebuild continuity from `handover.md`, then `_memory.continuity`, then the packet docs

There is no checkpoint store to restore from. The documents are the record.

### Configuration Recovery

If settings are wrong:

1. Check `references/config/environment-variables.md` for the variable and its default
2. Verify the variable is exported in the shell that runs the command, not only in a config file
3. Reset to defaults if needed; retrieval itself reads no configuration beyond the index path

---

## 7. RECOVERY HINTS CATALOG

Quick reference for common recovery scenarios with symptoms and actions.

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| **Context Loss** | Agent doesn't remember prior work | Run `/speckit:resume [spec-folder]` |
| **State Mismatch** | Files don't match expected state | Verify with `git status` and `git diff` |
| **Content Not Found** | Retrieval returns no results | Run the ripgrep path-only recipe scoped to the packet, then widen to `specs` |
| **Stale Context** | Information seems outdated | Compare `handover.md` and `_memory.continuity` timestamps against the packet's git log |
| **Incomplete Handover** | Missing continuation context | Review the session summary and next steps in `handover.md` |
| **Wrong Packet Surfaced** | Retrieval answers from a neighbor packet | Narrow the positional search root to the exact packet path |
| **Declared-Phrase Gap** | Lookup misses obvious content | Add the phrase to that document's `trigger_phrases`, then regenerate the index |
| **Continuity Unreadable** | Can't restore state | Rebuild from `handover.md`, `_memory.continuity`, and packet docs, in that order |

### Recovery Action Details

**Context Loss Recovery:**
```bash
# Resume from saved context
# Command: /speckit:resume specs/<track>/<NNN-feature-name>

# Or read the ladder by hand, in order
cat specs/<track>/<NNN-feature-name>/handover.md
rg --no-config --fixed-strings -- '_memory.continuity' specs/<track>/<NNN-feature-name>
```

**State Mismatch Recovery:**
```bash
# Verify git state
git status
git diff HEAD~3

# Compare against spec folder expectations
cat specs/###-feature/acceptance-criteria.md
```

**Stale Context Detection:**
```bash
# Freshness comes from the file system and git, not from a store
ls -l specs/<track>/<NNN-feature>/handover.md specs/<track>/<NNN-feature>/implementation-summary.md
git log -3 --format='%ad %s' -- specs/<track>/<NNN-feature>
```

If the continuity documents are older than the last real work, refresh them with `/speckit:save` before resuming.

---

## 8. EMPTY TRIGGER PHRASES

**Symptom:** The trigger lookup returns nothing even for queries you consider relevant.

**Cause:** Two different things, and they need different fixes. Either the index is older than the frontmatter, or the document never declared the phrase.

**Solution:**
```bash
# 1. Rule out staleness: rebuild and retry
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"

# 2. Still empty? Confirm what the document actually declares
rg --no-config -n -A6 -- 'trigger_phrases:' specs/<track>/<NNN-name>/spec.md
```

If the phrase is absent, add it to that document's `trigger_phrases` and regenerate. A phrase that arrived by fallback rather than by an author's choice is corpus pollution, so write the distinctive term, not a generic workflow word.

---

## 9. RELATED RESOURCES

### Reference Files
- [SKILL.md](../../SKILL.md) - Spec-folder workflow, retrieval and continuity entry point
- [retrieval-conventions.md](../retrieval/retrieval-conventions.md) - The ripgrep recipes, exit-status mapping and ranking contract
- [execution-methods.md](../workflows/execution-methods.md) - Continuity artifact detection and execution trigger patterns
- [folder-routing.md](../structure/folder-routing.md) - Routing logic and alignment scoring

### Related Skills
- `system-spec-kit` - Spec folder creation and template management

---
