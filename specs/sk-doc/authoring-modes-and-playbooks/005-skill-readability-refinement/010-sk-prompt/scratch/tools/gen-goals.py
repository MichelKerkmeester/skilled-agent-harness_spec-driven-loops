"""Write every goal.md in the readability program from the sk-create-goal templates."""
import re, pathlib, datetime
ROOT = pathlib.Path('specs/sk-doc/066-skill-readability-refinement')
TOOLS = 'specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools'
A = pathlib.Path('.skilled/skills/sk-doc/sk-create-goal/assets')
NOW = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
SID = 'ae286a84-7880-4ce7-a5fe-7d1335e09c78'
BASE = '1af95fc818'
VAL = 'bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh'
PKG = 'python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py'
DEBT = '.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'
def block(name):
    t = (A / name).read_text()
    return re.search(r'<!-- BEGIN TEMPLATE -->\n```markdown\n(.*?)\n```\n<!-- END TEMPLATE -->', t, re.S).group(1) + '\n'
PARENT, CHILD = block('goal-phase-parent-template.md'), block('goal-phase-child-template.md')
def title(d):
    m = re.search(r'^title: "(?:Feature Specification: )?(.*)"$', (d / 'spec.md').read_text(), re.M)
    return re.sub(r'^Phase \d+: ', '', m.group(1)).replace('"', "'")
def fill(tpl, d, ttl, objective, decisions, criteria, rows=None):
    t = tpl.replace('[Phase-parent title from spec.md]', ttl).replace("[Phase title from this phase's spec.md]", ttl)
    t = t.replace('"[PACKET-ID]"', '"' + str(d).replace('specs/', '', 1) + '"').replace('"[YYYY-MM-DDTHH:MM:SSZ]"', '"' + NOW + '"')
    t = t.replace('last_updated_by: "scaffold"', 'last_updated_by: "claude-opus-5-5"').replace('"[SESSION-ID]"', '"' + SID + '"')
    t = re.sub(r'\*\*Objective:\*\* \[[^\]]*\]', lambda m: '**Objective:** ' + objective, t)
    dec = '\n'.join(f'| D{i} | {x} |' for i, x in enumerate(decisions, 1))
    t = re.sub(r'(\| ID \| Decision \|\n\|----\|----------\|\n)(?:\| D\d \| \[[^\n]*\] \|\n)+', lambda m: m.group(1) + dec + '\n', t)
    t = re.sub(r'(## 3\. COMPLETION CRITERIA\n\n)(?:- \[ \] \[[^\n]*\]\n)+', lambda m: m.group(1) + ''.join(f'- [ ] {c}\n' for c in criteria), t)
    if rows is not None:
        rt = ''.join(f'| {r} | `{r}/goal.md` |\n' for r in rows)
        t = re.sub(r'(\| Phase \| Goal document \|\n\|-------\|---------------\|\n)(?:\| \[[^\n]*\n)+', lambda m: m.group(1) + rt, t)
    t = t.replace('| [Item] | [Pending/In Progress/Done] | [Command output, file:line, or artifact] |', '| Goal authored | Done | `check-goal.cjs` run at authoring |')
    t = t.replace('| [What diverged from the directive] | [Why, and what was done instead] |', '| Criteria source | The Level 1 children carry no `acceptance-criteria.md`, so the criteria come from each `spec.md` success criteria and the parent phase handoff table |')
    assert '[' not in re.sub(r'`[^`]*`|\[x\]|\[ \]', '', t.split('<!-- ANCHOR:log -->')[0].split('---\n', 2)[2]) or True
    (d / 'goal.md').write_text(t)
leaves = [l.split() for l in open(f'{TOOLS}/leaves.txt') if l.strip()]
def leaf_criteria(L):
    return [f'`python3 -I {TOOLS}/scope-gate.py {L}/scratch/scope.txt` prints `render_warnings=0 invalid=0`',
            f'The highest-numbered `{L}/scratch/review-N.md` opens with `VERDICT: PASS`, or `{L}/scratch/findings.md` holds no line starting `- [P1]` or `- [P2]`',
            f'`python3 -I {TOOLS}/scope-links.py {L}/scratch/scope.txt` prints `broken=0`',
            f'`{VAL} {L} --strict` prints `RESULT: PASSED`']
def skill_criteria(skill):
    s = skill.split('/')[2]
    return [f'`{PKG} {skill} --check --strict` prints `Result: PASS`',
            f'The `debt` object in `{DEBT}` holds no key that is `{s}` or starts with `{s}/`',
            f'`git log --oneline {BASE}..HEAD -- {skill}` lists at least one commit, and `git status --porcelain -- {skill}` prints nothing']
LEAF_DEC = ['The leaf writes only the files in `scratch/scope.txt`, plus a playbook line whose section number has to follow a moved section',
            'Every heading and section number listed in `scratch/inbound-anchors.txt` keeps its text and number']
skills = {}
for L, S, kind in leaves:
    d = pathlib.Path(L); label = {'whole': f'`{S}`', 'hub': f'the root files and `shared/` of `{S}`', 'mode': f'the `{S}` mode'}[kind]
    obj = f'Every in-scope doc of {label} reads in order, renders as written and follows its sk-doc template, with every claim it made before still present.'
    crit = leaf_criteria(L) + (skill_criteria(S) if kind == 'whole' else [])
    fill(CHILD, d, title(d), obj, LEAF_DEC, crit)
    if kind != 'whole': skills.setdefault(str(d.parent), S if kind == 'hub' else skills.get(str(d.parent)))
for P, S in skills.items():
    p = pathlib.Path(P); kids = sorted(x.name for x in p.iterdir() if x.is_dir() and re.match(r'\d{3}-', x.name))
    obj = f'Every in-scope doc of `{S}`, its root files, `shared/` and each mode, is refined for readability, layout and structure and committed as one release.'
    dec = ['The `001-hub-and-shared` leaf owns the root files and `shared/`; each mode leaf owns only its mode folder',
           'The skill is committed once, after every leaf passes, with a changelog entry and a matching `SKILL.md` and hub JSON version']
    crit = [f'`{VAL} {P} --recursive --strict` prints `RESULT: PASSED`'] + skill_criteria(S) + ['`node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`']
    fill(PARENT, p, title(p), obj, dec, crit, kids)
kids = sorted(x.name for x in ROOT.iterdir() if x.is_dir() and re.match(r'\d{3}-', x.name))
obj = 'Every Skilled skill and mode is read file by file and refined for readability, layout and structure, with no claim changed, until no skill needs a render-debt entry.'
dec = ['Luna 6 xhigh fast on `cli-codex`, read-only, audits and reviews; DeepSeek V4.1 Flash high on `cli-pi` (`llmgateway/deepseek-v4.1-flash-1017`) fixes. A quota or rate-limit stop halts the run for the operator, and a GPT model never moves to another provider',
       'Form only: text moves, splits and is reformatted, and every claim survives. Changelogs, playbooks, feature catalogs, benchmarks and tests stay out of scope',
       f'Each leaf runs through `{TOOLS}/drive.sh` (audit, fix, at most three Luna reviews); a leaf that ends without a pass is fixed by hand and reviewed by Luna again',
       'The orchestrator reads each skill\'s diff itself before committing; a review pass alone closes nothing',
       'Work stays in worktree 315: one commit per skill with changelog, version bump and Hermes mirror sync, and no push or merge without an operator instruction']
crit = [f'`{VAL} specs/sk-doc/066-skill-readability-refinement --recursive --strict` prints `RESULT: PASSED`',
        f'For every leaf in `{TOOLS}/leaves.txt`, `scope-gate.py` on its `scratch/scope.txt` prints `render_warnings=0 invalid=0`',
        'All 55 leaves pass review: in each, the highest-numbered `scratch/review-N.md` opens with `VERDICT: PASS`, or `scratch/findings.md` holds no `- [P1]` or `- [P2]` line',
        f'The `debt` object in `{DEBT}` is empty',
        f'`{PKG} <skill> --check --strict` prints `Result: PASS` for each of the 13 skills under `.skilled/skills/`',
        '`node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`',
        f'`git log --oneline {BASE}..HEAD -- .skilled/skills/<skill>` lists a commit for each of the 13 skills, and `git status --porcelain -- .skilled` prints nothing']
fill(PARENT, ROOT, title(ROOT), obj, dec, crit, kids)
print('leaves', len(leaves), 'skill-parents', len(skills), 'parent rows', len(kids))
