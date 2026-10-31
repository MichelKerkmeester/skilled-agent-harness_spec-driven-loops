#!/usr/bin/env python3
"""Draft the CJ-001 and CJ-002 rewrites from their moved text (scratch attachments only)."""
import os
A='specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build/attach/playbook/hub-routing/'
os.makedirs(A,exist_ok=True)
H='.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/'
POL='63c0e7c4be3572f191a720546be69f9933206d52b2ffb8f6626486bce250b8ca'
ROUTE='{"hubId":"cli-classifier","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-dispatch","packetId":"cli-usage","packetKind":"transport","skillId":"cli-classifier","workflowMode":"cli-jev"}],"effectivePolicyHash":"'+POL+'","generation":1}'
def apply(t, reps, glob):
    for o,n in reps:
        assert t.count(o)==1,(o[:70],t.count(o))
        t=t.replace(o,n)
    for o,n,c in glob:
        assert t.count(o)==c,(o,t.count(o))
        t=t.replace(o,n)
    return t
def recorded(t, text):
    s=t.index('### Recorded Result'); e=t.index('---\n\n## 4. SOURCE FILES')
    return t[:s]+'### Recorded Result\n\n'+text+'\n\n'+t[e:]
# CJ-001
t=open(H+'judgment-request-routes-to-transport.md').read()
t=apply(t,[
('title: "A Jev judgment request resolves cli-usage"','title: "A Jev judgment request resolves mode cli-jev"'),
('description: "Confirm the hub resolves a Jev judgment request to the single cli-usage transport, for `CJ-001`."','description: "Confirm the cli-classifier hub resolves a Jev judgment request to mode cli-jev over the cli-usage packet, for `CJ-001`."'),
('expected_intent: cli-usage','expected_intent: cli-jev'),
('expected_workflow_mode: cli-usage','expected_workflow_mode: cli-jev'),
('version: 0.2.0.3','version: 1.1.0.0'),
('# CJ-001: A Jev judgment request resolves cli-usage','# CJ-001: A Jev judgment request resolves mode cli-jev'),
("so the hub resolves `workflowMode: cli-usage` and selects the `cli-usage` transport packet. Because the hub is single-transport, the answer is one dominant route rather than an ordered bundle or a deferred disambiguation.",
 "so the `cli-classifier` hub resolves `workflowMode: cli-jev` and selects the `cli-usage` transport packet. The prompt names no Deem phrase, so the answer is one dominant route rather than an ordered bundle with `cli-deem` or a deferred disambiguation."),
("Now that the hub has joined the compiled serving closure the compiled-route CLI answers with a route whose target is `cli-usage` rather than the legacy sentinel, so this check reads an observed route.",
 "The hub serves compiled routes, so the compiled-route CLI answers with a route whose target is mode `cli-jev` over `cli-usage` rather than the legacy sentinel, and this check reads an observed route."),
("Six of them used to defer, and nothing here noticed,","Six of them once deferred, and nothing here noticed,"),
("- Objective: Confirm the hub resolves a Jev judgment request to the single `cli-usage` transport.","- Objective: Confirm the hub resolves a Jev judgment request to mode `cli-jev` over the `cli-usage` transport packet."),
("one target whose `workflowMode` and `packetId` are both `cli-usage` and whose `packetKind` is `transport`,",
 "one target whose `skillId` is `cli-classifier`, whose `workflowMode` is `cli-jev`, whose `packetId` is `cli-usage` and whose `packetKind` is `transport`,"),
("- Desired user-visible outcome: the resolved workflow mode `cli-usage` with the `cli-usage` transport packet.","- Desired user-visible outcome: the resolved workflow mode `cli-jev` with the `cli-usage` transport packet."),
("4. Read each front door JSON and confirm the single `cli-usage` target.","4. Read each front door JSON and confirm the single `cli-jev` target."),
("| CJ-001 | Hub Routing | Confirm a Jev judgment request resolves the single `cli-usage` transport |","| CJ-001 | Hub Routing | Confirm a Jev judgment request resolves mode `cli-jev` over the `cli-usage` transport |"),
("one target with `workflowMode: \"cli-usage\"`, `packetId: \"cli-usage\"` and `packetKind: \"transport\"`,",
 "one target with `skillId: \"cli-classifier\"`, `workflowMode: \"cli-jev\"`, `packetId: \"cli-usage\"` and `packetKind: \"transport\"`,"),
("| [mode-registry.json](../../mode-registry.json) | The single registered mode and its packet kind |","| [mode-registry.json](../../mode-registry.json) | The two registered modes and their packet kind |"),
],[("--hub cli-jev","--hub cli-classifier",3),("each route a single `cli-usage` target;","each route a single `cli-jev` target;",2)])
t=recorded(t,"Observed on 2026-09-29, after the Jev transport became mode `cli-jev` of this hub: both commands exited 0. The prompt and each of the six phrasings answered `"+ROUTE+"`, a single `cli-jev` target over `cli-usage` under the compiled policy. Verdict PASS.")
open(A+'judgment-request-routes-to-transport.md','w').write(t)
# CJ-002
t=open(H+'alias-still-resolves.md').read()
t=apply(t,[
('title: "The retired cli-jev mode name still resolves the transport"','title: "The cli-jev name resolves the Jev transport"'),
('description: "Confirm the retired cli-jev mode name still resolves the same single cli-usage transport, for `CJ-002`."','description: "Confirm a request that names cli-jev, and no judgment phrase, resolves mode cli-jev over the cli-usage packet, for `CJ-002`."'),
('expected_intent: cli-usage','expected_intent: cli-jev'),
('expected_workflow_mode: cli-usage','expected_workflow_mode: cli-jev'),
('version: 0.2.0.1','version: 1.1.0.0'),
('# CJ-002: The retired cli-jev mode name still resolves the transport','# CJ-002: The cli-jev name resolves the Jev transport'),
("`cli-jev` was the mode's name before the hub took the id, so it survives as a mode alias in `mode-registry.json` `aliases[]` and as a hub vocabulary entry in `hub-router.json` `vocabularyClasses`. A request that still names it resolves the same single mode, `cli-usage`, and loads the same packet.",
 "`cli-jev` has named the Jev transport as a mode, then as a hub of its own, and now names it as a mode again: mode `cli-jev` of the `cli-classifier` hub, over the packet folder `cli-usage`. The name sits in `mode-registry.json` `aliases[]` and as a vocabulary entry in `hub-router.json` `vocabularyClasses`, so a request that names it resolves mode `cli-jev` and loads the `cli-usage` packet."),
("The rename is a compatibility promise: existing habits, notes and scripts still say `cli-jev`, and the alias is what keeps them working.",
 "The name is a compatibility promise: existing habits, notes and scripts say `cli-jev`, and the alias is what keeps them working now that the hub id is `cli-classifier`."),
("- Objective: Confirm the retired `cli-jev` mode name resolves the same single `cli-usage` transport.","- Objective: Confirm the `cli-jev` name resolves mode `cli-jev` over the `cli-usage` transport packet."),
("with `selectionKind: \"single\"` and one target whose `workflowMode` and `packetId` are both `cli-usage`, not the retired name and not a defer.",
 "with `selectionKind: \"single\"` and one target whose `skillId` is `cli-classifier`, whose `workflowMode` is `cli-jev` and whose `packetId` is `cli-usage`, not a defer and not a `cli-deem` target."),
("- Desired user-visible outcome: the resolved workflow mode `cli-usage` for a request that never says `cli-usage`.","- Desired user-visible outcome: the resolved workflow mode `cli-jev` and packet `cli-usage` for a request that never says `cli-usage`."),
("- Pass/fail: PASS when the alias prompt routes a single `cli-usage` target;","- Pass/fail: PASS when the alias prompt routes a single `cli-jev` target;"),
("4. Read the front door's JSON and confirm the single `cli-usage` target.","4. Read the front door's JSON and confirm the single `cli-jev` target."),
("| CJ-002 | Hub Routing | Confirm the retired `cli-jev` mode name still resolves the `cli-usage` transport |","| CJ-002 | Hub Routing | Confirm the `cli-jev` name resolves mode `cli-jev` over the `cli-usage` transport |"),
("one target with `workflowMode: \"cli-usage\"` and `packetId: \"cli-usage\"`, resolved through the alias registration, not the retired name and not a defer",
 "one target with `skillId: \"cli-classifier\"`, `workflowMode: \"cli-jev\"` and `packetId: \"cli-usage\"`, resolved through the alias registration, not a defer"),
("| PASS when the alias prompt routes a single `cli-usage` target;","| PASS when the alias prompt routes a single `cli-jev` target;"),
("check `mode-registry.json` `aliases[]` for the retired name","check `mode-registry.json` `aliases[]` for the `cli-jev` entry"),
("| [mode-registry.json](../../mode-registry.json) | The alias registration for the retired mode name |","| [mode-registry.json](../../mode-registry.json) | The alias registration for the `cli-jev` name |"),
],[("--hub cli-jev","--hub cli-classifier",2)])
t=recorded(t,"Observed on 2026-09-29, after the Jev transport became mode `cli-jev` of this hub: the command exited 0 and the front door answered `"+ROUTE+"`. The prompt names only `cli-jev`, so the alias registration carried the route. Verdict PASS.")
open(A+'alias-still-resolves.md','w').write(t)
for f in ('judgment-request-routes-to-transport.md','alias-still-resolves.md'):
    s=open(A+f).read(); print(f, 'emdash-new' if s.count('\u2014')>open(H+f).read().count('\u2014') else 'ok', s.count('cli-usage'))
