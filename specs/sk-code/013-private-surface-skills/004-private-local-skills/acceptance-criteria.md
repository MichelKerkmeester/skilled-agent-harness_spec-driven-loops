---
title: "Acceptance Criteria: Phase 4: private-local-skills"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "private local skills acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-24T16:20:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Closed the phase: both commits pushed, 22 of 22 criteria Met"
    next_safe_action: "Run phase 005 verification"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-004-private-local-skills"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Folder mode: symlink to two external repositories (operator, 2026-10-23)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: private-local-skills

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-code/013-private-surface-skills/004-private-local-skills`
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.
Every command lives in the fenced block below the table that carries the criterion's id, never in a
table cell. Each block starts from the operator's main checkout unless its first line says otherwise.

| AC-ID | REQ | Given / When / Then | Status | Waiver |
|-------|-----|---------------------|--------|--------|
| AC-001 | REQ-010 | Given phase 004 restores a skill that phase 003's compiler would export, When the ordering gate runs, Then phase 003's `local-*` skip is present on `origin/main` and in the working copy | Met | - |
| AC-002 | REQ-001 | Given the operator recorded the layout on 2026-10-23, When the phase starts, Then ADR-001 records `Accepted: symlink to two external repositories`, `Folder mode: symlink`, and both target roots | Met | - |
| AC-003 | REQ-001 | Given commit `42b41dd286`, When both trees are restored, Then each skill root holds the archived entry count | Met | - |
| AC-004 | REQ-002 | Given the restored trees, When the workflow references are made real, Then no symlink remains and each copy is byte-identical to the pinned blob | Met | - |
| AC-005 | REQ-002 | Given the four copies that carry a guardrail link, When the link is rewritten, Then it resolves to the guardrail document from the new depth | Met | - |
| AC-006 | REQ-003 | Given the Webflow skill after the move, When the link audit runs, Then the only broken link is the one that was already broken at `42b41dd286` | Met | - |
| AC-007 | REQ-003 | Given the Obsidian skill after the move, When the link audit runs, Then no link is broken | Met | - |
| AC-008 | REQ-004 | Given both skills, When the absolute self-paths are rewritten, Then no file outside the dated records names the old hub location | Met | - |
| AC-009 | REQ-005 | Given the Webflow skill, When the standalone rewrite is applied, Then its identity names `local-webflow` and claims no hub bundle | Met | - |
| AC-010 | REQ-005 | Given the Obsidian skill, When the standalone rewrite is applied, Then its identity names `local-obsidian` and claims no hub bundle | Met | - |
| AC-011 | REQ-006 | Given the Webflow skill, When the metadata is written, Then its root carries exactly one advisor-readable identity, and the generator refuses the private root by design | Met | - |
| AC-012 | REQ-006 | Given the Obsidian skill, When the metadata is written, Then its root carries exactly one advisor-readable identity, and the generator refuses the private root by design | Met | - |
| AC-013 | REQ-007 | Given both skills present, When git is asked about them in this checkout, Then they are ignored, untracked and unstaged; the target repositories track them separately | Met | - |
| AC-014 | REQ-012 | Given a throwaway advisor database, When the graph scan runs, Then it holds one node per private skill | Met | - |
| AC-015 | REQ-008 | Given the phase is complete, When the summary is read, Then it records the mode, the restore commands, both audits, the ignore evidence and the scan result | Met | - |
| AC-016 | REQ-009 | Given both skills, When their comments and docs are scanned, Then no new packet id or spec path appears in them | Met | - |
| AC-017 | REQ-013 | Given the phase's checks have run, When an independent read-only OpenCode subagent review reads them, Then every checklist item reports a pass with its command output | Met | - |
| AC-018 | SC-004 | Given the final state, When the packet gate runs, Then the packet passes strict validation | Met | - |
| AC-019 | REQ-011 | Given every check has passed, When the documents are committed and pushed, Then the commit holds only this phase's documents and HEAD equals `origin/main` | Met | - |
| AC-020 | REQ-014 | Given the two external repositories, When the links are created, Then each symlink resolves into its repository's `local-skills/` directory and both links stay git-ignored in this checkout | Met | - |
| AC-021 | REQ-016 | Given each target repository, When its commit is made, Then only `local-skills/<name>` is staged, `git -C <repo> ls-files local-skills/<name>` lists the skill, and its push ran only after an explicit operator yes | Met | - |
| AC-022 | REQ-015 | Given the operator's shell, When a fresh login shell reads the environment, Then `SPECKIT_PRIVATE_SKILL_ROOTS` holds both roots joined by `:` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification block names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:proofs -->
## 3. PROOF COMMANDS

Each block below proves one criterion. A block that starts with `WORKTREE=` runs from that checkout,
resolved with `git rev-parse --show-toplevel`; every other block runs from the operator's main checkout,
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

### AC-001 — the ordering gate

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git fetch origin main
git show origin/main:.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | grep -c 'if entry.startswith("local-"):'
grep -c 'if entry.startswith("local-"):' .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py
```

Expected: `1` from each `grep -c`, and `git fetch` exits 0.

### AC-002 — the two-repository symlink answer is recorded

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
awk '/<!-- ANCHOR:adr-001 -->/,/<!-- ANCHOR:adr-001-context -->/' specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | grep -c -E '^[|] [*][*]Status[*][*] [|] Accepted: symlink to two external repositories [|]$'
awk '/<!-- ANCHOR:adr-001 -->/,/<!-- ANCHOR:adr-001-context -->/' specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | grep -c -E '^[|] [*][*]Folder mode[*][*] [|] symlink [|]$'
awk '/<!-- ANCHOR:adr-001 -->/,/<!-- ANCHOR:adr-001-context -->/' specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | grep -c -E '^[|] [*][*]External repository roots[*][*] [|] .*Obsidian Plugin/local-skills.*Websites/anobel.com/local-skills.*[|]$'
```

Expected: `1`, `1` and `1`.

### AC-003 — both trees hold the archived entry count plus their graph metadata

Positive control first: the archive itself holds 161 and 65 entries; each restored tree adds one
skill-root `graph-metadata.json` at T086 and T087.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -t | grep -v '/$' | wc -l
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -t | grep -v '/$' | wc -l
find .skilled/skills/local-webflow/ -type f | wc -l
find .skilled/skills/local-obsidian/ -type f | wc -l
```

Expected: `161`, `65`, `162`, `66`, in that order. The trailing slash on the `find` argument makes it
follow a symlinked skill folder.

### AC-004 — the workflow references are real files

Positive control first: the archive carries three symlinks per skill, so `0` afterwards is meaningful.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -tv | grep -c '^l'
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -tv | grep -c '^l'
find .skilled/skills/local-webflow/ .skilled/skills/local-obsidian/ -type l | wc -l || echo 0
for skill in local-webflow local-obsidian; do
  for phase in implement debug verify; do
    git show "42b41dd286:.skilled/skills/sk-code/shared/references/workflow-$phase.md" | sed 's#\.\./\.\./sk-code-skilled/#../../sk-code/sk-code-skilled/#g' | cmp - ".skilled/skills/$skill/references/workflow-$phase.md" && echo "$skill $phase IDENTICAL"
  done
done
```

Expected: `3`, `3`, `0`, then six `IDENTICAL` lines. The `sed` maps the pinned guardrail link to its AC-005 form, which is the one intended difference.

### AC-005 — the guardrail link resolves

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
for skill in local-webflow local-obsidian; do
  for phase in implement debug verify; do
    printf '%s %s %s\n' "$skill" "$phase" "$(grep -c 'sk-code-skilled/references/shared/workflow-guardrails.md' ".skilled/skills/$skill/references/workflow-$phase.md")"
  done
done
for skill in webflow obsidian; do
  test -f "$(python3 -c 'import os,sys;print(os.path.normpath(sys.argv[1]))' ".skilled/skills/local-$skill/references/../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md")" && echo "RESOLVES_$(echo $skill | tr a-z A-Z)"
done
```

Expected: `local-webflow implement 1`, `local-webflow debug 0`, `local-webflow verify 2`,
`local-obsidian implement 1`, `local-obsidian debug 0`, `local-obsidian verify 2`, then
`RESOLVES_WEBFLOW` and `RESOLVES_OBSIDIAN`. The link resolves by logical path, as the reader opens it through the symlink.

### AC-006 — the Webflow link audit reaches its baseline

The audit resolves each link by logical path, the way a reader opens it through the symlink, using the kept
script `scratch/link-audit-logical.sh`. Positive control first: the audit reports a broken link when one exists.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
AUDIT=specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/link-audit-logical.sh
CONTROL="$(mktemp -d)"
printf '[x](missing.md)\n' > "$CONTROL/broken.md"
bash "$AUDIT" "$CONTROL" | grep -c BROKEN
bash "$AUDIT" .skilled/skills/local-webflow | grep -c BROKEN
bash "$AUDIT" .skilled/skills/local-webflow | grep 'BROKEN'
bash "$AUDIT" .skilled/skills/local-webflow | tail -1
rm -rf "$CONTROL"
```

Expected: `1` from the control, `1` from the Webflow count, one line
`BROKEN .../references/javascript/quality-standards/shared-listener-and-weakmap.md -> target`, and
`AUDIT_FAIL=1`.

### AC-007 — the Obsidian link audit reports nothing broken

The audit resolves each link by logical path, using the kept script `scratch/link-audit-logical.sh`.
Positive control first: the same audit reports a broken link on a control fixture.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
AUDIT=specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/link-audit-logical.sh
CONTROL="$(mktemp -d)"
printf '[x](missing.md)\n' > "$CONTROL/broken.md"
bash "$AUDIT" "$CONTROL" | grep -c BROKEN
bash "$AUDIT" .skilled/skills/local-obsidian | grep -c BROKEN || true
bash "$AUDIT" .skilled/skills/local-obsidian | tail -1
rm -rf "$CONTROL"
```

Expected: `1` from the control, `0` from the Obsidian count, and `AUDIT_FAIL=0`.

### AC-008 — no old absolute self-path survives

Positive control first: the archived README carries the old path.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git show 42b41dd286:.skilled/skills/sk-code/sk-code-webflow/README.md | grep -c 'sk-code/sk-code-webflow'
rg -c 'sk-code/sk-code-webflow|sk-code/sk-code-obsidian' .skilled/skills/local-webflow .skilled/skills/local-obsidian -g '!**/changelog/**' -g '!**/benchmark/reports/**' || echo 0
```

Expected: `1` from the positive control and `0` from the zero check.

### AC-009 — the Webflow skill is standalone

Positive control first: the archived `SKILL.md` carries the hub vocabulary this criterion removes.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git show 42b41dd286:.skilled/skills/sk-code/sk-code-webflow/SKILL.md | grep -c -i 'hub bundles'
grep -c '^name: local-webflow$' .skilled/skills/local-webflow/SKILL.md
grep -c -E 'packetKind|family: sk-code' .skilled/skills/local-webflow/SKILL.md || true
cat .skilled/skills/local-webflow/SKILL.md .skilled/skills/local-webflow/README.md | grep -c -i -E 'hub bundles|hub detects|the hub.s|packetKind|advisor-invisible|parent hub' || true
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-webflow/README.md --type readme | grep -c 'VALID'
```

Expected: `1` from the positive control, `1` from the name count, `0` from each of the two zero
checks, and `1` from the document validator.

### AC-010 — the Obsidian skill is standalone

Positive control first: the archived `SKILL.md` carries the hub vocabulary this criterion removes.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git show 42b41dd286:.skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c -i 'advisor-invisible'
grep -c '^name: local-obsidian$' .skilled/skills/local-obsidian/SKILL.md
grep -c -E 'packetKind|family: sk-code' .skilled/skills/local-obsidian/SKILL.md || true
cat .skilled/skills/local-obsidian/SKILL.md .skilled/skills/local-obsidian/README.md | grep -c -i -E 'hub bundles|hub detects|the hub.s|packetKind|advisor-invisible|parent hub|NESTED_IDENTITY' || true
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-obsidian/README.md --type readme | grep -c 'VALID'
```

Expected: `1` from the positive control, `1` from the name count, `0` from each of the two zero
checks, and `1` from the document validator.

### AC-011 — the Webflow metadata is valid and stable

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node -e "const j=require('./.skilled/skills/local-webflow/graph-metadata.json');if(j.skill_id!=='local-webflow')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);for(const k of ['trigger_phrases','key_topics','key_files','entities','source_docs'])if(!Array.isArray(j.derived[k])||j.derived[k].length===0)process.exit(1);if(!j.derived.causal_summary)process.exit(1);console.log('OK')"
node -e "const fs=require('fs');const d=require('./.skilled/skills/local-webflow/graph-metadata.json').derived;const p=[...d.key_files,...d.entities.map(e=>e.path),...d.source_docs.map(x=>'.skilled/skills/local-webflow/'+x)];const m=p.filter(x=>!fs.existsSync(x));m.forEach(x=>console.log('MISSING',x));console.log('PATHS='+p.length+' MISSING='+m.length);process.exit(m.length?1:0)"
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow 2>&1 | grep -c 'Refusing a private skill root'
find .skilled/skills/local-webflow/ \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `PATHS=15 MISSING=0`, `1`, `1`. The dead-path line resolves every `key_files`, `entities[].path` and `source_docs` path on disk, which restores the check the generator's `--write` run used to perform. The generator refuses a `local-*` root by design with exit 2, so it never rewrites the hand-written file, and the `find` argument carries a trailing slash so it follows the symlink.

### AC-012 — the Obsidian metadata is valid and stable

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node -e "const j=require('./.skilled/skills/local-obsidian/graph-metadata.json');if(j.skill_id!=='local-obsidian')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);for(const k of ['trigger_phrases','key_topics','key_files','entities','source_docs'])if(!Array.isArray(j.derived[k])||j.derived[k].length===0)process.exit(1);if(!j.derived.causal_summary)process.exit(1);console.log('OK')"
node -e "const fs=require('fs');const d=require('./.skilled/skills/local-obsidian/graph-metadata.json').derived;const p=[...d.key_files,...d.entities.map(e=>e.path),...d.source_docs.map(x=>'.skilled/skills/local-obsidian/'+x)];const m=p.filter(x=>!fs.existsSync(x));m.forEach(x=>console.log('MISSING',x));console.log('PATHS='+p.length+' MISSING='+m.length);process.exit(m.length?1:0)"
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-obsidian 2>&1 | grep -c 'Refusing a private skill root'
find .skilled/skills/local-obsidian/ \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `PATHS=15 MISSING=0`, `1`, `1`. The dead-path line resolves every `key_files`, `entities[].path` and `source_docs` path on disk, which restores the check the generator's `--write` run used to perform. The generator refuses a `local-*` root by design with exit 2, so it never rewrites the hand-written file, and the `find` argument carries a trailing slash so it follows the symlink.

### AC-013 — both paths are ignored, untracked and unstaged

Positive control first: the same status command reports both ignored paths, so an empty non-ignored
status is meaningful.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian | wc -l
git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -c '^!!'
git status --porcelain .skilled | wc -l || echo 0
git diff --cached --name-only | wc -l || echo 0
git ls-files .skilled/skills/local-webflow .skilled/skills/local-obsidian | wc -l || echo 0
git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -c '/.skilled/skills/local-\*'
```

Expected: `2`, `2`, `0`, `0`, `0`, `2`.

### AC-014 — the advisor indexes both skills

The recorded mode is two-repository symlink mode, so this block exports both roots explicitly:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PRIVATE_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
export SPECKIT_PRIVATE_SKILL_ROOTS="$PRIVATE_ROOTS"
SCRATCH="$(mktemp -d)"
export SYSTEM_SKILL_ADVISOR_DB_DIR="$SCRATCH/advisor-db"
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json > "$SCRATCH/scan.json" || true
sqlite3 "$SCRATCH/advisor-db/skill-graph.sqlite" "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id;"
# Stop only the throwaway daemon, whose pid the scan wrote into its own scratch state file.
STATE="$SCRATCH/advisor-db/.system-skill-advisor-launcher.json"
DAEMON_PID="$(node -e "console.log(require(process.argv[1]).pid)" "$STATE")"
SOCK_DIR="$(node -e "console.log(require('path').dirname(require(process.argv[1]).socketPath))" "$STATE")"
kill "$DAEMON_PID"
for i in 1 2 3 4 5 6 7 8 9 10; do kill -0 "$DAEMON_PID" 2>/dev/null || break; sleep 1; done
kill -0 "$DAEMON_PID" 2>/dev/null && echo STILL_RUNNING || echo DAEMON_STOPPED
case "$SOCK_DIR" in /tmp/system-skill-advisor/*) rm -rf "$SOCK_DIR";; esac
rm -rf "$SCRATCH"
test ! -e "$SCRATCH" && echo SCRATCH_REMOVED
unset SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_PRIVATE_SKILL_ROOTS
```

Expected: `local-obsidian` and `local-webflow`, one per line, then `DAEMON_STOPPED` and `SCRATCH_REMOVED`. The scan starts a daemon for the throwaway database, and the cleanup stops it and removes the scratch directory. The kill takes the pid read from the throwaway state file only, so it never signals any other advisor daemon such as the one a live session owns. A scan against a cold database can exit 75 while the daemon starts, so the rows from the query are the proof and the scan exit status is not.

### AC-015 — the summary records the evidence

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c 'Folder mode' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'AUDIT_FAIL' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'check-ignore' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'skill_nodes' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
```

Expected: `1`, at least `2`, at least `1`, at least `1`.

### AC-016 — no new packet id or spec path inside either skill

Positive control first: the packet id matches this phase's own `spec.md`.

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c '013-private-surface-skills' specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg -c '013-private-surface-skills|004-private-local-skills' .skilled/skills/local-webflow .skilled/skills/local-obsidian || echo 0
```

Expected: at least `1` from the positive control and `0` from the zero check.

### AC-017 — the review round passed

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
test -f specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md && echo REPORT_PRESENT
grep -c '^| CHECK-' specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md
grep -c '^| CHECK-.*| PASS |' specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md
```

Expected: `REPORT_PRESENT`, `7`, `7`.

### AC-018 — strict validation passes

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict | grep -c 'RESULT: PASSED'
```

Expected: `1`.

### AC-019 — the documents are committed and pushed last

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git show --name-only --format= HEAD | grep -c '^specs/sk-code/013-private-surface-skills/004-private-local-skills/'
git show --name-only --format= HEAD | grep -c -v '^specs/sk-code/013-private-surface-skills/004-private-local-skills/' || true
git status --porcelain | wc -l || echo 0
git fetch origin main
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo HEAD_EQUALS_ORIGIN_MAIN
```

Expected: at least `9` from the phase-folder control, `0` from the non-phase count, `0` from the
status check, and `HEAD_EQUALS_ORIGIN_MAIN`.

### AC-020 — each link resolves into its repository's `local-skills/`

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
readlink .skilled/skills/local-webflow
readlink .skilled/skills/local-obsidian
test -f .skilled/skills/local-webflow/SKILL.md && echo WEBFLOW_TARGET_OK
test -f .skilled/skills/local-obsidian/SKILL.md && echo OBSIDIAN_TARGET_OK
git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -c '/.skilled/skills/local-\*'
```

Expected: the Webflow path
`/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow`, the Obsidian
path `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian`, then
`WEBFLOW_TARGET_OK`, `OBSIDIAN_TARGET_OK` and `2`.

### AC-021 — each target repository holds only its own skill commit

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
git -C "$WEBFLOW_REPO" ls-files local-skills/local-webflow | wc -l
git -C "$WEBFLOW_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-webflow/' || true
git -C "$OBSIDIAN_REPO" ls-files local-skills/local-obsidian | wc -l
git -C "$OBSIDIAN_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-obsidian/' || true
```

Expected: `162`, `0`, `66` and `0`.

### AC-022 — the environment holds both roots

```bash
zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'
grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc
```

Expected: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills`
and `1`.

### Observed 2026-10-24

Each line below is the output of the proof block above, read on 2026-10-24 at origin `main` HEAD `a393488d82` or later.

- AC-001: `1` and `1`, and `git fetch origin main` exited 0.
- AC-002: `1`, `1` and `1`.
- AC-003: `161`, `65`, `162` and `66`.
- AC-004: `3`, `3`, `0`, then six `IDENTICAL` lines with the guardrail link mapped to its rewritten form.
- AC-005: `1`, `0`, `2` for both skills, then `RESOLVES_WEBFLOW` and `RESOLVES_OBSIDIAN` by logical path.
- AC-006: control `1`, Webflow count `1`, the one `shared-listener-and-weakmap.md -> target` line, and `AUDIT_FAIL=1`.
- AC-007: control `1`, Obsidian count `0`, and `AUDIT_FAIL=0`.
- AC-008: `1` and `0`.
- AC-009 and AC-010: `1`, `1`, `0`, `0` and `1` for each skill.
- AC-011 and AC-012: `OK`, `PATHS=15 MISSING=0`, `1` refusal line and `1` metadata file for each skill. The generator exits 2 on both private roots.
- AC-013: after the launcher fix landed as a local commit, `git status --porcelain .skilled` prints nothing, and the ignored, untracked and unstaged counts read `2`, `0`, `0` and `2`, with `git diff --cached --name-only` empty (2026-10-24 rerun).
- AC-014: with the launcher allowlist carrying the roots, `skill_graph_scan --trusted` exited 0 against a throwaway database and the query printed `local-obsidian` and `local-webflow`. A cold-start rerun that added the cleanup steps exited 75 on the scan while the query still printed both rows, then printed `DAEMON_STOPPED` and `SCRATCH_REMOVED`, and the live daemon was left running.
- AC-015: `1`, `6`, `1` and `1`.
- AC-016: `1` and `0`.
- AC-020: both `readlink` values match, `WEBFLOW_TARGET_OK`, `OBSIDIAN_TARGET_OK` and `2`.
- AC-021: `162`, `0`, `66` and `0`. Webflow `origin/main` equals `4434c1b3` and Obsidian `origin/main` equals `c6cd64b7`.
- AC-022: the login shell prints both roots joined by `:` and the export count is `1`.
- AC-017: an independent read-only Opus review ran the seven checks on 2026-10-24 and every row reads PASS, with the command output in `scratch/review-round-1.md`. An earlier review round found one P1 and five P2 findings, all fixed before this run.
- AC-018: `validate.sh --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0` on the 2026-10-24 rerun.
- AC-019: commit `e8256b8044` (the launcher allowlist fix and its test) and commit `ff993936c7` (the phase documents, 10 paths under the phase folder and 0 paths containing `skilled/skills/local-`) were pushed with `git push origin HEAD:refs/heads/main`, range `75ef2608d0..ff993936c7`. After the push `git rev-parse HEAD origin/main` printed `ff993936c7ddd2d08b8051c1152642a82ce7cb65` twice and `git rev-list --count origin/main..HEAD` printed `0`. `git status --porcelain .skilled | wc -l` printed `0`, the ignored count for the two links printed `2`, `git ls-files` printed `162` for the Webflow skill and `66` for the Obsidian skill, the login shell printed both roots joined by `:` and the `~/.zshrc` export count is `1`. Deviation: the launcher code landed in its own commit, the phase documents in a second commit, and this closing edit lands as a third commit, so the closing commit is not the one the proof block reads as `HEAD`.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:closure -->
## 4. CLOSURE STATEMENT

**Closeable:** Yes

The packet is closed because AC-001 to AC-022 all read `Met`. The criteria that carry the phase are AC-001,
because a phase that starts before phase 003 lands exports private signals into the tracked graph,
AC-006 and AC-007, because a private skill nobody can navigate is a private skill nobody uses,
AC-013, because one staged path puts private content into the public repository, and AC-020 to AC-022,
because the recorded answer depends on two repository links, two target commits and both roots in the
environment. Left out on purpose: the `description.json` file the parent spec names for each private
skill, because no leaf skill in the repository carries one and no consumer reads it, and every
pre-existing broken link, which the phase must not fix.
<!-- /ANCHOR:closure -->

---
