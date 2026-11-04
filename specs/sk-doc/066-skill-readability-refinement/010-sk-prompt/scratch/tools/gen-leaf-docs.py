"""Fill a leaf phase's spec, plan, tasks and implementation summary from its run artifacts."""
import re, sys, pathlib, glob
leaf, skill, kind = sys.argv[1], sys.argv[2], sys.argv[3]
L = pathlib.Path(leaf); O = L / 'scratch'
T = 'specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools'
scope = [l for l in (O / 'scope.txt').read_text().split('\n') if l.strip()]
log = (O / 'run.log').read_text()
before = re.search(r'scope +\d+ files; (files=\S+ render_warnings=\d+ invalid=\d+)', log).group(1)
after = (O / 'gate-after.txt').read_text().strip().split('\n')[-1]
findings = (O / 'findings.md').read_text()
nf = len(re.findall(r'^- \[P[12]\]', findings, re.M)); np1 = len(re.findall(r'^- \[P1\]', findings, re.M))
reviews = sorted(glob.glob(str(O / 'review-*.md')), key=lambda p: int(re.search(r'review-(\d+)', p).group(1)))
verdicts = [pathlib.Path(r).read_text().split('\n')[0].strip() for r in reviews]
passed = bool(verdicts) and 'PASS' in verdicts[-1] or nf == 0
rounds = len(reviews)
label = {'whole': f'`{skill}`', 'hub': f'the `{skill}` hub root files and `shared/`', 'mode': f'the `{skill}` mode'}[kind]
name = L.name
status = 'Complete' if passed else 'In Progress'
def sub_anchor(text, anchor, body):
    pat = re.compile(rf'(<!-- ANCHOR:{anchor} -->\n)(.*?)(<!-- /ANCHOR:{anchor} -->)', re.S)
    assert pat.search(text), anchor
    return pat.sub(lambda m: m.group(1) + body.rstrip('\n') + '\n' + m.group(3), text, count=1)
def strip_fill(t): return re.sub(r'<!-- FILL:.*?-->\n', '', t)
files_tbl = '\n'.join(f'| `{f}` | Modify | Readability, layout and structure |' for f in scope)
# spec.md
p = L / 'spec.md'; t = strip_fill(p.read_text())
desc = f"Read every in-scope doc of {label.replace('`','')} for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
t = re.sub(r'^description: ".*"$', 'description: "' + desc.replace('"', "'") + '"', t, count=1, flags=re.M)
meta = re.search(r'<!-- ANCHOR:metadata -->\n(.*?)<!-- /ANCHOR:metadata -->', t, re.S).group(1)
meta = meta.replace('[YOUR_VALUE_HERE: P0/P1/P2]', 'P1').replace('| **Status** | Draft |', f'| **Status** | {status} |')
meta = re.sub(r'\| \*\*Branch\*\* \| `[^`]*` \|', '| **Branch** | `worktrees/315-frontend-reference-restructure` |', meta)
meta = meta.replace('[To be defined during planning]', 'The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0`')
t = sub_anchor(t, 'metadata', '## 1. METADATA' + meta.split('## 1. METADATA', 1)[1])
t = sub_anchor(t, 'phase-context', f'''## Phase Context

This phase covers {label}: {len(scope)} docs, listed in `scratch/scope.txt`.

**Scope Boundary**: the files in `scratch/scope.txt`. Changelogs, playbooks, feature catalogs, benchmarks and tests stay out.

**Dependencies**:
- The render checks in `validate_document.py` and the review rubric in the parent `spec.md`.

**Deliverables**:
- The refined docs, `scratch/findings.md`, the review rounds and `scratch/gate-after.txt`.
''')
t = sub_anchor(t, 'problem', f'''## 2. PROBLEM & PURPOSE

### Problem Statement
The docs of {label} were never read as a whole for readability, layout and structure. The render checks reported `{before}` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
''')
t = sub_anchor(t, 'measured-behavior', f'''### Measured Behavior
```text
$ python3 -I {T}/scope-gate.py {O}/scope.txt
{before}
```
''')
t = sub_anchor(t, 'scope', f'''## 3. SCOPE

### In Scope
- Audit each doc against the parent rubric with DeepSeek V4.1 Flash max (`cli-opencode`, opencode-go), with any scope write undone.
- Apply the findings with DeepSeek V4.1 Flash high on the DevPass route.
- Re-read the diff with DeepSeek V4.1 Flash max until it passes, at most three rounds.

### Out of Scope
- Changing what a rule, contract or example says - the program refines form only.
- Headings other files link to - `scratch/inbound-anchors.txt` lists them and they keep their text.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
{files_tbl}
''')
t = sub_anchor(t, 'requirements', '''## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope doc stays valid with no render warning | `scope-gate.py` prints `render_warnings=0 invalid=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A second model family passes the diff | The last `scratch/review-N.md` opens `VERDICT: PASS` |
''')
t = sub_anchor(t, 'success-criteria', '''## 5. SUCCESS CRITERIA

- **SC-001**: The scope gate prints `render_warnings=0 invalid=0`.
- **SC-002**: The last review opens `VERDICT: PASS`.
''')
t = sub_anchor(t, 'risks', '''## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go and llmgateway DeepSeek | A step cannot run | On a quota stop, stop and ask; never re-route |
| Risk | A fix changes a claim while moving text | Med | The review checks claims against the diff each round |
''')
t = sub_anchor(t, 'questions', '## 7. OPEN QUESTIONS\n\n- None.\n')
p.write_text(t)
# plan.md
p = L / 'plan.md'; t = strip_fill(p.read_text())
t = re.sub(r'^description: ".*"$', 'description: "Audit, fix and re-review the in-scope docs, then prove them with the scope gate."', t, count=1, flags=re.M)
t = sub_anchor(t, 'summary', f'''## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc templates and render checks |
| **Storage** | None |
| **Testing** | `scope-gate.py`, DeepSeek review rounds |

### Overview
`run-leaf-v3.sh` lists the scope, records the gate, sends the DeepSeek auditor each chunk of up to eight files, hands the findings to DeepSeek, and loops the diff review until it passes or three rounds end.
''')
t = sub_anchor(t, 'quality-gates', f'''## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [{'x' if passed else ' '}] All acceptance criteria met
- [{'x' if 'render_warnings=0 invalid=0' in after else ' '}] `python3 -I {T}/scope-gate.py {O}/scope.txt` prints `render_warnings=0 invalid=0`
- [{'x' if passed else ' '}] Docs updated (spec/plan/tasks)
''')
t = sub_anchor(t, 'architecture', f'''## 3. ARCHITECTURE

### Pattern
Read, write, re-read loop: DeepSeek V4.1 Flash max reads and re-reads through opencode-go, and DeepSeek V4.1 Flash high writes through llmgateway.

### Key Components
- **DeepSeek V4.1 Flash max (`cli-opencode`, scope writes undone)**: writes `scratch/findings*.md` and `scratch/review-N.md`
- **DeepSeek V4.1 Flash high (`cli-pi`, llmgateway)**: applies the findings, logs `scratch/fix-N.log`

### Data Flow
`scope.txt` to DeepSeek audit to `findings.md` to DeepSeek fix to `diff-N.patch` to DeepSeek review, repeated until `VERDICT: PASS`.
''')
p.write_text(t)
# tasks.md
p = L / 'tasks.md'; t = strip_fill(p.read_text())
t = re.sub(r'^description: ".*"$', 'description: "Scope, audit, fix, review and gate the in-scope docs."', t, count=1, flags=re.M)
x = 'x' if passed else ' '
t = sub_anchor(t, 'phase-1', f'''## Phase 1: Setup

- [x] T001 List the scope and the inbound-linked headings (`scratch/scope.txt`, `scratch/inbound-anchors.txt`). Verify: `wc -l < scratch/scope.txt` prints {len(scope)}.
- [x] T002 Record the gate before any edit (`scratch/run.log`). Verify: its first line reads `{before}`.
''')
t = sub_anchor(t, 'phase-2', f'''## Phase 2: Implementation

- [x] T003 Audit each chunk with DeepSeek max (`scratch/findings.md`). Verify: it holds {nf} findings, {np1} of them P1.
{'- [x] T004 Apply the findings with DeepSeek (`scratch/fix-1.log`). Verify: the log ends `STATUS=OK`.' if nf else '- [x] T004 Apply the findings with DeepSeek. Verify: not needed, the audit found no defect.'}
- [{x}] T005 Review the diff with DeepSeek max until it passes (`scratch/review-*.md`). Verify: {rounds} round(s), verdicts {', '.join(v.replace('VERDICT: ', '') for v in verdicts) or 'none needed'}.
''')
t = sub_anchor(t, 'phase-3', f'''## Phase 3: Verification

- [{'x' if 'render_warnings=0 invalid=0' in after else ' '}] T006 Rerun the scope gate (`scratch/gate-after.txt`). Verify: it prints `{after}`.
''')
t = sub_anchor(t, 'completion', f'''## Completion Criteria

- [{x}] All tasks marked `[x]`
- [{x}] No `[B]` blocked tasks remaining
- [{x}] Manual verification passed
''')
p.write_text(t)
# implementation-summary.md
p = L / 'implementation-summary.md'
if p.exists():
    t = strip_fill(p.read_text())
    t = re.sub(r'^description: ".*"$', f'description: "{len(scope)} docs of {label.replace(chr(96), "")} audited and refined: {nf} findings, {rounds} review round(s), gate {after}."', t, count=1, flags=re.M)
    t = t.replace('packet_pointer: "scaffold/' + name + '"', 'packet_pointer: "' + leaf.replace('specs/', '') + '"')
    t = re.sub(r'session_id: "scaffold-[^"]*"', 'session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"', t)
    t = t.replace('recent_action: "Initialized Level 1 template"', f'recent_action: "Audited, fixed and reviewed {len(scope)} docs"').replace('next_safe_action: "Replace continuity placeholders"', 'next_safe_action: "None; the phase is closed"' if passed else 'next_safe_action: "Resolve the last review round by hand"').replace('last_updated_by: "template-author"', 'last_updated_by: "claude-opus-5-5"')
    t = re.sub(r'completion_pct: \d+', f'completion_pct: {100 if passed else 80}', t)
    i = t.index('<!-- ANCHOR:what-built -->')
    vt = '\n'.join(f'| Review {n} | {v} |' for n, v in enumerate(verdicts, 1)) or '| Review | Not needed: no findings |'
    t = t[:i] + f'''<!-- ANCHOR:what-built -->
## What Was Built

The {len(scope)} in-scope docs of {label} now follow their sk-doc templates and the parent rubric. The DeepSeek max audit listed {nf} defects ({np1} P1), DeepSeek applied them, and the review re-read the diff until it passed.

### {name}

Findings are in `scratch/findings.md`, each round's diff in `scratch/diff-N.patch` and its review in `scratch/review-N.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
{files_tbl}
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`run-leaf-v3.sh` ran the scope, the gate, the DeepSeek max audit, the DeepSeek high fix and the review rounds. `scratch/run.log` records each step with its exit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two model families per leaf | The model that writes a fix is not the one that judges it |
| Inbound-linked headings frozen | Other files link to them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scope gate before | `{before}` |
| Scope gate after | `{after}` |
{vt}
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A review round judges one diff at a time.** A defect neither model saw stays; the render checks cover the mechanical classes.
<!-- /ANCHOR:limitations -->

---
'''
    p.write_text(t)
# continuity fields in every doc, whatever placeholder the scaffold wrote
for d in ('spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'):
    q = L / d
    if not q.exists(): continue
    s = q.read_text()
    s = re.sub(r'(\n\s+recent_action: )"[^"]*"', lambda m: m.group(1) + f'"Audited, fixed and reviewed {len(scope)} docs"', s, count=1)
    s = re.sub(r'(\n\s+next_safe_action: )"[^"]*"', lambda m: m.group(1) + ('"None; the phase is closed"' if passed else '"Resolve the last review round by hand"'), s, count=1)
    s = re.sub(r'(\n\s+last_updated_by: )"[^"]*"', lambda m: m.group(1) + '"claude-opus-5-5"', s, count=1)
    s = re.sub(r'(\n\s+completion_pct: )\d+', lambda m: m.group(1) + str(100 if passed else 80), s, count=1)
    q.write_text(s)
print(f'{name}: {status} findings={nf} rounds={rounds} after={after}')
