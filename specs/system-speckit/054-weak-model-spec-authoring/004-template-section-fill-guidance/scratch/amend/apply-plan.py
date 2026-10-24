p='specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/plan.md'
t=open(p,encoding='utf-8').read()
rows=[
 ('| B03 |','One line each. |','One line each. Write `N/A` with one reason, or delete the whole section. |'),
 ('| B05 |','The total must match the level. |','The total must match the level. Write `N/A` with one reason, or delete the whole section. |'),
 ('| B18 |','when it does not read the change. |','when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. |'),
 ('| B39 |','Write one check per ADR. |','Write one check per ADR, or delete the section when the packet records no ADR. |'),
 ('| B43 |','that must agree. |','that must agree, or delete the section when the packet holds no paired documents. |'),
 ('| B44 |','when the role does not exist. |','when the role does not exist. Write `N/A` or delete the section when no sign-off applies. |'),
]
lines=t.split('\n')
for pre,old,new in rows:
    ix=[i for i,l in enumerate(lines) if l.startswith(pre)]
    assert len(ix)==1,pre
    l=lines[ix[0]]
    assert l.count(old)==1,(pre,l)
    lines[ix[0]]=l.replace(old,new)
t='\n'.join(lines)
anchor="| `## L3+: Compliance Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the whole section when no compliance surface applies. |\n"
assert t.count(anchor)==1
add=anchor+"""| `## L2: EDGE CASES`, `## L2: COMPLEXITY ASSESSMENT` | Both anchors are `optional` at Level 2. | Write `N/A` with one reason, or delete the whole section. |
| `## FIX ADDENDUM: AFFECTED SURFACES` | The anchor is `optional` at Levels 2, 3 and 3+. | Write `N/A` or delete the whole addendum when no fix surface applies. |
| `## L3+: Architecture Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the section when the packet records no ADR. |
| `## L3+: Documentation Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the section when the packet holds no paired documents. |
| `## L3+: Sign-Off` | The anchor is `optional` at Level 3 and Level 3+. | Write `N/A` or delete the section when no sign-off applies. |
"""
t=t.replace(anchor,add)
open(p,'w',encoding='utf-8').write(t)
print('done')
