import re,sys
root='.skilled/skills/system-spec-kit/templates/core/'
edits=[
 ('spec.md.tmpl','## L2: EDGE CASES','One line each.','One line each. Write `N/A` with one reason, or delete the whole section.'),
 ('spec.md.tmpl','## L2: COMPLEXITY ASSESSMENT','The total must match the level.','The total must match the level. Write `N/A` with one reason, or delete the whole section.'),
 ('plan.md.tmpl','## FIX ADDENDUM: AFFECTED SURFACES','when it does not read the change.','when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies.'),
 ('tasks.md.tmpl','## L3+: Architecture Verification','Write one check per ADR.','Write one check per ADR, or delete the section when the packet records no ADR.'),
 ('tasks.md.tmpl','## L3+: Documentation Verification','that must agree.','that must agree, or delete the section when the packet holds no paired documents.'),
 ('tasks.md.tmpl','## L3+: Sign-Off','when the role does not exist.','when the role does not exist. Write `N/A` or delete the section when no sign-off applies.'),
]
for f,h,old,new in edits:
    p=root+f
    lines=open(p,encoding='utf-8').read().split('\n')
    idx=[i for i,l in enumerate(lines) if l==h]
    assert len(idx)==1,(f,h,idx)
    j=idx[0]+1
    assert lines[j].startswith('<!-- FILL: ') and lines[j].endswith(' -->'),lines[j]
    assert lines[j].count(old)==1,(h,old)
    lines[j]=lines[j].replace(old,new)
    open(p,'w',encoding='utf-8').write('\n'.join(lines))
    print('OK',f,h)
