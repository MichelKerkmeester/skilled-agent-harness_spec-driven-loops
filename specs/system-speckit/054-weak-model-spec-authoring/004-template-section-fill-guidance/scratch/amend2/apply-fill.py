root='.skilled/skills/system-spec-kit/templates/core/'
ESC=' Write `N/A` with one reason, or delete the whole section.'
edits=[
 ('## L2: PHASE DEPENDENCIES','fill the table with depends-on and blocks.'),
 ('## L2: EFFORT ESTIMATION','Mark the total as an assumption.'),
 ('## L3: DEPENDENCY GRAPH','fill the matrix with produces and blocks.'),
 ('## L3: CRITICAL PATH','List what can run in parallel.'),
 ('## L3: MILESTONES','with a command-checkable success criterion.'),
]
p=root+'plan.md.tmpl'
lines=open(p,encoding='utf-8').read().split('\n')
for h,old in edits:
    idx=[i for i,l in enumerate(lines) if l==h]
    assert len(idx)==1,(h,idx)
    j=idx[0]+1
    assert lines[j].startswith('<!-- FILL: ') and lines[j].endswith(' -->'),lines[j]
    assert lines[j].count(old)==1,(h,old)
    print('BEFORE',lines[j])
    lines[j]=lines[j].replace(old,old+ESC)
    print('AFTER ',lines[j])
open(p,'w',encoding='utf-8').write('\n'.join(lines))
plan='specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/plan.md'
t=open(plan,encoding='utf-8').read().split('\n')
rows=[('| B19 |','fill the table with depends-on and blocks. |'),('| B20 |','Mark the total as an assumption. |'),('| B22 |','fill the matrix with produces and blocks. |'),('| B23 |','List what can run in parallel. |'),('| B24 |','with a command-checkable success criterion. |')]
for pre,old in rows:
    ix=[i for i,l in enumerate(t) if l.startswith(pre)]
    assert len(ix)==1,pre
    l=t[ix[0]]
    assert l.count(' '+old)==1,(pre,l)
    t[ix[0]]=l.replace(' '+old,' '+old[:-2]+ESC+' |')
t='\n'.join(t)
anchor="| `## L3+: Sign-Off` | The anchor is `optional` at Level 3 and Level 3+. | Write `N/A` or delete the section when no sign-off applies. |\n"
assert t.count(anchor)==1
add=anchor+"""| `## L2: PHASE DEPENDENCIES`, `## L2: EFFORT ESTIMATION` | Both anchors are `optional` at Levels 2, 3 and 3+. | Write `N/A` with one reason, or delete the whole section. |
| `## L3: DEPENDENCY GRAPH`, `## L3: CRITICAL PATH`, `## L3: MILESTONES` | All three anchors are `optional` at Level 3 and Level 3+. | Write `N/A` with one reason, or delete the whole section. |
"""
t=t.replace(anchor,add)
open(plan,'w',encoding='utf-8').write(t)
print('done')
