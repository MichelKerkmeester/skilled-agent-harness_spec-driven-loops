---
title: "Implementation Summary"
description: "Both doctor commands are now described where a consumer and a reader look for them: the sk-create-command contract names their targets, assets, loader requirements, destructive operations and aliases, and the root README carries the setup path as its own numbered section built on the two commands."
trigger_phrases:
  - "command contract and readme implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/004-command-contract-and-readme"
    last_updated_at: "2026-10-31T15:54:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Docs written from the recorded runs"
    next_safe_action: "Refresh the two generated metadata files, then rerun validate --strict"
    blockers:
      - "The two generated metadata files still hold the scaffold description. repair-derived.cjs is the fix, and the orchestrator owns those files"
    key_files:
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - ".skilled/commands/doctor/symlink.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-command-contract-and-readme |
| **Status** | Complete |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:symlink` and `/doctor:install` now sit in the two places their audience looks. The sk-create-command contract, which is the shape a consumer walks to dispatch a target, describes every symlink target and the install guide. The root README carries the setup path as its own top-level section instead of leaving a reader to find the two commands in the DOCTOR table.

### Phase 4: command-contract-and-readme

The contract's doctor entry now names both routers, and its argument hint spells out both command lines. Four execution targets point at the symlink check, link and unlink workflows and at the install workflow. Eight owned assets name the symlink presentation, its three workflow files, the manifest the engine reads and the engine itself, plus the install presentation and workflow. Four loader requirements state what each command promises: check is the read-only default, link writes only after a yes to a printed plan digest, unlink restores only what a run recorded, and the install guide is read-only and prints commands for the operator. Two destructive operations cover link and unlink, and two invocation aliases name both commands. The coverage sentence now reads "37 of the 41 shipped commands", which is the census of shipped routers the walk prints.

The reader's side is the README. Section 5, "Use It In Your Own Project", is built on the two commands: Run The Guide, The Steps It Prints as a table, What Gets Linked, Plan, Yes, Undo, and Keep Linked Projects Healthy. The sections after it are renumbered 6 to 17 and their internal anchors moved with them, so the Quick Start line that points at section 5 and the anchors like `#7--deep-loop` all resolve. The DOCTOR section reads "Sixteen commands" and its table carries a row for each new command after `/doctor:setup`, with one entry per command below.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The doctor family entry names both commands, with four execution targets, eight owned assets, four loader requirements, two destructive operations and two invocation aliases, and the coverage sentence reads "37 of the 41 shipped commands" |
| `.skilled/commands/doctor/symlink.md` | Modified | The argument hint is 128 characters, under the 140-character soft budget, and spells the runtime list `<list>` |
| `README.md` | Modified | The top-level section and its five subsections, the renumbering to 6-17 with their anchors, the Keep It Healthy sentence, and the DOCTOR section's count, two rows and two entries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract went first, because it is the file the other checks read. It was edited as text rather than through a serializer, so the diff stays one family's change instead of a reflow of the whole asset. Four execution targets, eight owned assets, four loader requirements, two destructive operations, two invocation aliases and the coverage sentence all went in that pass, and the parse check ran before and after.

The two argument hints came next. `symlink.md`'s ran over the 140-character soft budget the contract repeats, so it was shortened to 128 characters and its `<csv>` became `<list>`, which is what the engine already calls the runtime list. `install.md`'s hint is 56 characters and fits as it stands.

The README ran last, in the order a reader meets it: the new section 5 with its five subsections, then the renumbering of everything after it with the internal anchors updated, then the Keep It Healthy sentence that names both commands, then the DOCTOR section's count and rows. Each lane was proved by the validator that owns the file, and the whole tree was rerun from the final state on 2026-10-31.

One correction belongs to this record. A draft paragraph claimed that `/doctor:install` links the framework. It does not: it checks, asks, inspects the target and prints the ordered commands, and the linking is `/doctor:symlink`'s after a plan and a yes. The section now says so, and the DOCTOR table states the same split.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edited the contract as text instead of rewriting it from a parsed object | The asset is large, and a serializer rewrite reflows every line, so one family's change would land inside a whole-file diff nobody can review. |
| Spelled the runtime list `<list>` rather than `<csv>` | That is the name the engine and its flag parser already use, so the router's frontmatter and the contract's field read the same word. |
| Inserted the setup path as section 5 and renumbered the rest, rather than appending it near the end | Quick Start is section 4, so a reader who starts at the beginning meets the link to their own project in the next section instead of scrolling past eleven others. |
| Corrected the draft that said the install command links | The guide only prints commands. `/doctor:symlink` is the command that writes. A reader who believed the draft would run the guide and wait for a link that never lands. |
| Registered the destructive operations as two entries, `link` and `unlink` | They are separate targets with separate approvals, and `check` writes nothing, so one entry for the command would overstate what a bare `/doctor:symlink` does. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command .skilled/commands/doctor/symlink.md` | PASS: `Total issues: 0`. The same command on `install.md`: `Total issues: 0`. |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` | PASS: `Total issues: 0`. |
| `check_authored_name_kebab.py` on each router | PASS: `PASS: authored artifact name is kebab-case`, exit 0 for both. |
| `python3 -c "import json; json.load(open(...command-contract.json))"` | PASS: it parses, and 16 of its lines name the new commands or their assets. |
| `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` | PASS: `routers=41 clean=41 path-drift=0 shape-drift=0`, exit 0. |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | PASS: `7 suite(s) passed, 0 failed`, node:test totals `pass 991`, `fail 0`, exit 0. The run includes `doctor-install-contract.test.cjs` (16/16), which reads the contract's invocation aliases and loader requirements, and `doctor-symlink-contract.test.cjs` (34/34). |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | PASS: `STATUS=OK`, exit 0. |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/004-command-contract-and-readme --strict` | Every document rule passes. The only findings left are the two generated-metadata rules on `description.json` and `graph-metadata.json`, which `repair-derived.cjs --apply` rewrites from these docs and the orchestrator owns. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The contract is hand-edited JSON.** Nothing generates it, so a new doctor target has to add its own selector, asset, loader requirement and alias by hand. Only the two contract tests notice a field that stopped naming a router. The rest of the entry is held by review and by the parse.
2. **The coverage sentence is a census, not a target.** It reads "37 of the 41 shipped commands" because four shipped commands carry no family entry, and the sentence names them. Adding a routed command moves the number, and a stale count is a doc defect rather than a check failure.
3. **Verification is a set of static checks.** No recorded run walks the contract the way a consumer would dispatch a target end to end. The two contract tests read the aliases and the loader requirements, the parser proves the shape, and the prose is held by the validators.
4. **Section 5 is now part of the README's shape.** A later section inserted above it moves every internal anchor again, so the anchors travel with the section that is added rather than after it.
5. **No commit or push belongs to this phase.** The packet records the work. The orchestrator stages and commits it.
6. **The generated metadata was left for the orchestrator.** This phase changes the description line, so `description.json` and `graph-metadata.json` need `repair-derived.cjs --folder specs/commands/005-doctor-symlink-install/004-command-contract-and-readme --apply` before strict validation reads `RESULT: PASSED`.
<!-- /ANCHOR:limitations -->

---
