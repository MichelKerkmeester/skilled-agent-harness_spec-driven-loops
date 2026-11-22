import json
V = {}
def setv(s, v):
    for i in s.split(): V[i] = v
setv("R1 V1 A2 A5 E2 E4 F3 F4 F5 F6 N1 N2 N3 N4 N5 N6 N8", "right")
setv("R4 V3 E1 E3 F1 F2", "partial")
setv("R2 R3 V2 V4 A1 A3 A4 F7 N7", "wrong")
setv("R5 R7 A6 A7 E5 E6 E7 F8 F11 F12 F13 N10 N12 N13 N14", "right")
setv("V5 V6 V8 F9 F10 N15", "partial")
setv("R2b R3b R6 V2b V7 A8 N9", "wrong")
setv("H1d H1e H3a H4 H5", "right"); setv("H1a H1b", "partial"); setv("H1c H3b H6 H7 H8 H9 H10", "wrong")
setv("K4 X1 X2", "right"); setv("K3 D2", "partial"); setv("K1 K2 K5 K6 D1", "wrong")
setv("cmd-doctor-deep-loop-typed-01 cmd-deep-research-typed-01 cmd-deep-research-plain-tune-01 cmd-deep-review-typed-01 cmd-deep-review-plain-tune-01 nm-system-deep-loop-01", "right")
setv("cmd-doctor-deep-loop-plain-tune-01", "partial")
setv("cmd-doctor-deep-loop-plain-holdout-01 cmd-deep-research-plain-holdout-01 cmd-deep-review-plain-holdout-01", "wrong")
NOTE = {
 "R2":"depth wording present, hub never scored","R3":"topic word pulled the advisor skill; neutral-topic rerun R3b returned nothing","R4":"hub right, mode withheld although the prompt opens with Research",
 "V2":"P0/P1/P2 and iteratively went to single-pass review","V3":"hub right, needs a mode, no command","V4":"several passes and final verdict went to single-pass review",
 "A1":"no recommendation at all","A3":"plain PR review topped the deep-loop hub (floored)","A4":"deep dive is depth wording, no recommendation","E1":"hub floored, mode withheld, cli hub 0.001 behind","E3":"hub right, mode withheld although the prompt says review iterations",
 "F1":"hub floored, mode withheld","F2":"hub floored, mode withheld","F7":"no doctor row; hub routed to research","N7":"an explain question got a run-policy command at the threshold edge",
 "R2b":"same as R2 without the pass wording","R3b":"no recommendation","R6":"research in depth, no recommendation","V2b":"the command's own owned signal, single-pass review won","V5":"single-pass review is defensible; no loop offered on thorough",
 "V6":"hub and mode right, command row withheld (no depth wording)","V7":"release readiness review went to a playbook creation command","V8":"hub right, needs a mode, no command","A8":"no recommendation",
 "F9":"doctor row listed second behind the hub","F10":"doctor row listed second behind the hub","F12":"typed with :auto; row still says ask, Gate 2 lets the typed command outrank it","N9":"a summary request was offered a new research run",
 "N12":"no deep command; the wrong non-deep skill is outside this question","N15":"a code task topped the hub; no command","A6":"defensible; a debug read is also plausible",
 "H1a":"hub and mode right, command row withheld","H1b":"hub and mode right, command row withheld","H1c":"registry alias autoresearch did not win; code search in the prompt is a confound","H3b":"council wording went to the deep-loop hub",
 "H6":"exhaustive audit with a final verdict went to sk-doc","H7":"no recommendation","H8":"deep dive went to spec-kit (floored)","H9":"went to spec-kit (floored)","H10":"multi-pass audit went to single-pass review",
 "K1":"packet keyword trigger, went to sk-prompt","K2":"packet keyword trigger, no recommendation","K3":"hub floored, mode withheld","K5":"packet trigger phrase, went to single-pass review","K6":"packet trigger phrase, went to spec-kit",
 "D1":"a stuck-run diagnosis was offered a new review; doctor row third","D2":"hub top, doctor row third",
 "cmd-doctor-deep-loop-plain-tune-01":"doctor row listed second","cmd-doctor-deep-loop-plain-holdout-01":"no doctor row","cmd-deep-research-plain-holdout-01":"no recommendation","cmd-deep-review-plain-holdout-01":"no recommendation",
}
def load(n): return json.load(open(n))
rounds = [("Round 1, written before any result was seen", load('results.json')), ("Round 2, follow-ups on the round 1 misses", load('results2.json')), ("Round 3, isolating the three vocabularies", load('results3.json')), ("Round 4, packet trigger phrases, doctor and lifecycle", load('results4.json'))]
def cell(r):
    t = r['top']
    if not t: return ("none", "-", "-", "-")
    route = "-" if not t.get('action') else (t['action'] + ("/" + t['modes'] if t.get('modes') else ""))
    skill = f"{t['skill']} {t['conf']:.2f}/{t['unc']:.2f}" + (" floored" if t.get('floored') else "")
    return (skill, route + (" needs-mode" if t.get('needsMode') else ""), t.get('command') or "-", t.get('policy') or "-")
out = []
allrows = []
for title, rs in rounds:
    out.append(f"\n**{title}**\n")
    out.append("| Id | Prompt | Top skill (confidence/uncertainty) | Hub route | Command row | Policy | Verdict | Note |")
    out.append("|---|---|---|---|---|---|---|---|")
    for r in rs:
        s, ro, c, p = cell(r)
        lower = ""
        for x in (r['second'], r['third']):
            if x and x.get('command'): lower = f" Lower row: {x['command']} ({x['policy']})."
        out.append(f"| {r['id']} | {r['prompt'].replace('|','/')} | {s} | {ro} | {c} | {p} | {V[r['id']]} | {NOTE.get(r['id'],'')}{lower} |".replace("  |"," |"))
        allrows.append(r)
open('table.md','w').write("\n".join(out))
corp = load('results5.json')
co = ["| Corpus row id | Row type / split | Top skill | Hub route | Command row | Policy | Verdict | Note |","|---|---|---|---|---|---|---|---|"]
for r in corp:
    s, ro, c, p = cell(r)
    lower = ""
    for x in (r['second'], r['third']):
        if x and x.get('command'): lower = f" Lower row: {x['command']} ({x['policy']})."
    co.append(f"| {r['id']} | {r['cat'].split(':')[1]} | {s} | {ro} | {c} | {p} | {V[r['id']]} | {NOTE.get(r['id'],'')}{lower} |")
open('corpus.md','w').write("\n".join(co))
def tally(rs):
    d = {"right":0,"partial":0,"wrong":0}
    for r in rs: d[V[r['id']]] += 1
    return d, len(rs)
for title, rs in rounds: print(title, tally(rs))
print("all mine", tally(allrows)); print("corpus", tally(corp))
bycat = {}
for r in rounds[0][1]:
    bycat.setdefault(r['cat'], {"right":0,"partial":0,"wrong":0})[V[r['id']]] += 1
print("round1 by cat", bycat)
by = {r['id']: r for r in allrows}
loop = "R1 R2 R3 V1 V2 V3 V4 A1 E1 E2 E3 E4 F1 F2 F3 F4 F5 F6 R2b R3b R5 R6 R7 V6 V8 E5 E6 F8 F12 F13 H1a H1b H1c H1e H6 H7 H8 H9 H10 K3 X1 X2".split()
full = [i for i in loop if by[i]['top'] and by[i]['top']['skill']=='system-deep-loop' and by[i]['top'].get('command') and by[i]['top'].get('policy')=='ask']
print("loop asks", len(loop), "full", len(full), full)
import re
named = [i for i in loop if re.search(r"deep[- ](research|review)", by[i]['prompt'].lower()) and not by[i]['prompt'].startswith('/')]
typed = [i for i in loop if by[i]['prompt'].startswith('/')]
plain = [i for i in loop if i not in named and i not in typed]
print("named", len(named), sum(i in full for i in named), "typed", len(typed), sum(i in full for i in typed), "plain", len(plain), sum(i in full for i in plain), [i for i in plain if i in full])
hubtop = [i for i in plain if by[i]['top'] and by[i]['top']['skill']=='system-deep-loop']
print("plain hub top", len(hubtop), hubtop, "none", [i for i in plain if not by[i]['top']], "other", [(i,by[i]['top']['skill']) for i in plain if by[i]['top'] and by[i]['top']['skill']!='system-deep-loop'])
noloop = "A2 A3 A5 N1 N2 N3 N4 N5 N6 N7 N8 A6 A7 E7 N9 N10 N12 N13 N14 N15 H3a H3b H4 H5".split()
print("noloop", len(noloop), "with deep/doctor cmd", [(i, by[i]['top'].get('command')) for i in noloop if by[i]['top'] and by[i]['top'].get('command') and ('deep' in by[i]['top']['command'])])
anyflag = [r['id'] for r in allrows+corp if r['top'] and r['top'].get('command') and (('--' in r['top']['command']) or r['top']['command'].count(':')>1)]
print("rows whose command carries a suffix or flag:", anyflag, "of", len([r for r in allrows+corp if r['top'] and r['top'].get('command')]))
pol = set((r['top']['command'], r['top']['policy']) for r in allrows+corp if r['top'] and r['top'].get('command'))
print(pol)
