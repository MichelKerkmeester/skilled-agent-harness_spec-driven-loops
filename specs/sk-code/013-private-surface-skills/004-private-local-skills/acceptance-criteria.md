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
    last_updated_at: "2026-10-23T17:55:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Recorded the two-repository answer and the new criteria"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
    completion_pct: 0
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
**Status:** Draft
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
| AC-001 | REQ-010 | Given phase 004 restores a skill that phase 003's compiler would export, When the ordering gate runs, Then phase 003's `local-*` skip is present on `origin/main` and in the working copy | Unmet | - |
| AC-002 | REQ-001 | Given the operator recorded the layout on 2026-10-23, When the phase starts, Then ADR-001 records `Accepted: symlink to two external repositories`, `Folder mode: symlink`, and both target roots | Unmet | - |
| AC-003 | REQ-001 | Given commit `42b41dd286`, When both trees are restored, Then each skill root holds the archived entry count | Unmet | - |
| AC-004 | REQ-002 | Given the restored trees, When the workflow references are made real, Then no symlink remains and each copy is byte-identical to the pinned blob | Unmet | - |
| AC-005 | REQ-002 | Given the four copies that carry a guardrail link, When the link is rewritten, Then it resolves to the guardrail document from the new depth | Unmet | - |
| AC-006 | REQ-003 | Given the Webflow skill after the move, When the link audit runs, Then the only broken link is the one that was already broken at `42b41dd286` | Unmet | - |
| AC-007 | REQ-003 | Given the Obsidian skill after the move, When the link audit runs, Then no link is broken | Unmet | - |
| AC-008 | REQ-004 | Given both skills, When the absolute self-paths are rewritten, Then no file outside the dated records names the old hub location | Unmet | - |
| AC-009 | REQ-005 | Given the Webflow skill, When the standalone rewrite is applied, Then its identity names `local-webflow` and claims no hub bundle | Unmet | - |
| AC-010 | REQ-005 | Given the Obsidian skill, When the standalone rewrite is applied, Then its identity names `local-obsidian` and claims no hub bundle | Unmet | - |
| AC-011 | REQ-006 | Given the Webflow skill, When the metadata is written, Then its root carries exactly one advisor-readable identity that the generator leaves unchanged | Unmet | - |
| AC-012 | REQ-006 | Given the Obsidian skill, When the metadata is written, Then its root carries exactly one advisor-readable identity that the generator leaves unchanged | Unmet | - |
| AC-013 | REQ-007 | Given both skills present, When git is asked about them in this checkout, Then they are ignored, untracked and unstaged; the target repositories track them separately | Unmet | - |
| AC-014 | REQ-012 | Given a throwaway advisor database, When the graph scan runs, Then it holds one node per private skill | Unmet | - |
| AC-015 | REQ-008 | Given the phase is complete, When the summary is read, Then it records the mode, the restore commands, both audits, the ignore evidence and the scan result | Unmet | - |
| AC-016 | REQ-009 | Given both skills, When their comments and docs are scanned, Then no new packet id or spec path appears in them | Unmet | - |
| AC-017 | REQ-013 | Given the phase's checks have run, When an independent read-only OpenCode subagent review reads them, Then every checklist item reports a pass with its command output | Unmet | - |
| AC-018 | SC-004 | Given the final state, When the packet gate runs, Then the packet passes strict validation | Unmet | - |
| AC-019 | REQ-011 | Given every check has passed, When the documents are committed and pushed, Then the commit holds only this phase's documents and HEAD equals `origin/main` | Unmet | - |
| AC-020 | REQ-014 | Given the two external repositories, When the links are created, Then each symlink resolves into its repository's `local-skills/` directory and both links stay git-ignored in this checkout | Unmet | - |
| AC-021 | REQ-016 | Given each target repository, When its commit is made, Then only `local-skills/<name>` is staged, `git -C <repo> ls-files local-skills/<name>` lists the skill, and its push ran only after an explicit operator yes | Unmet | - |
| AC-022 | REQ-015 | Given the operator's shell, When a fresh login shell reads the environment, Then `SPECKIT_PRIVATE_SKILL_ROOTS` holds both roots joined by `:` | Unmet | - |

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
    git show "42b41dd286:.skilled/skills/sk-code/shared/references/workflow-$phase.md" | cmp - ".skilled/skills/$skill/references/workflow-$phase.md" && echo "$skill $phase IDENTICAL"
  done
done
```

Expected: `3`, `3`, `0`, then six `IDENTICAL` lines.

### AC-005 — the guardrail link resolves

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
for skill in local-webflow local-obsidian; do
  for phase in implement debug verify; do
    printf '%s %s %s\n' "$skill" "$phase" "$(grep -c 'sk-code-skilled/references/shared/workflow-guardrails.md' ".skilled/skills/$skill/references/workflow-$phase.md")"
  done
done
test -f .skilled/skills/local-webflow/references/../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md && echo RESOLVES_WEBFLOW
test -f .skilled/skills/local-obsidian/references/../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md && echo RESOLVES_OBSIDIAN
```

Expected: `local-webflow implement 1`, `local-webflow debug 0`, `local-webflow verify 2`,
`local-obsidian implement 1`, `local-obsidian debug 0`, `local-obsidian verify 2`, then
`RESOLVES_WEBFLOW` and `RESOLVES_OBSIDIAN`.

### AC-006 — the Webflow link audit reaches its baseline

Run this block after T017 and before T100, which removes the audit script. Positive control first: the
audit reports a broken link when one exists.

```bash
mkdir -p /tmp/psurf-phase4/control
printf '[x](missing.md)\n' > /tmp/psurf-phase4/control/broken.md
bash /tmp/psurf-phase4/link-audit.sh /tmp/psurf-phase4/control | grep -c BROKEN
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | grep -c BROKEN
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | grep 'BROKEN'
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | tail -1
```

Expected: `1` from the control, `1` from the Webflow count, one line
`BROKEN .../references/javascript/quality-standards/shared-listener-and-weakmap.md -> target`, and
`AUDIT_FAIL=1`.

### AC-007 — the Obsidian link audit reports nothing broken

Run this block after T017 and before T100, which removes the audit script. Positive control first: the
same audit reports a broken link on the control fixture.

```bash
bash /tmp/psurf-phase4/link-audit.sh /tmp/psurf-phase4/control | grep -c BROKEN
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | grep -c BROKEN || true
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | tail -1
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
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow --write | grep -c -E '"status": "(written|unchanged)"'
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow | grep -c '"status": "unchanged"'
find .skilled/skills/local-webflow \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `1`, `1`, `1`.

### AC-012 — the Obsidian metadata is valid and stable

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node -e "const j=require('./.skilled/skills/local-obsidian/graph-metadata.json');if(j.skill_id!=='local-obsidian')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);for(const k of ['trigger_phrases','key_topics','key_files','entities','source_docs'])if(!Array.isArray(j.derived[k])||j.derived[k].length===0)process.exit(1);if(!j.derived.causal_summary)process.exit(1);console.log('OK')"
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-obsidian --write | grep -c -E '"status": "(written|unchanged)"'
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-obsidian | grep -c '"status": "unchanged"'
find .skilled/skills/local-obsidian \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `1`, `1`, `1`.

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
export SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/psurf-phase4/advisor-db
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json > /tmp/psurf-phase4/scan.json
sqlite3 /tmp/psurf-phase4/advisor-db/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id;"
unset SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_PRIVATE_SKILL_ROOTS
```

Expected: `local-obsidian` and `local-webflow`, one per line.

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
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:closure -->
## 4. CLOSURE STATEMENT

**Closeable:** No

The packet closes when AC-001 to AC-022 are all `Met`. The criteria that carry the phase are AC-001,
because a phase that starts before phase 003 lands exports private signals into the tracked graph,
AC-006 and AC-007, because a private skill nobody can navigate is a private skill nobody uses,
AC-013, because one staged path puts private content into the public repository, and AC-020 to AC-022,
because the recorded answer depends on two repository links, two target commits and both roots in the
environment. Left out on purpose: the `description.json` file the parent spec names for each private
skill, because no leaf skill in the repository carries one and no consumer reads it, and every
pre-existing broken link, which the phase must not fix.
<!-- /ANCHOR:closure -->

---
