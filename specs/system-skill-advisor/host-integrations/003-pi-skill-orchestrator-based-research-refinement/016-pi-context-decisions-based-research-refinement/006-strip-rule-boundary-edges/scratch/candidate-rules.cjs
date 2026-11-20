// Runs both candidate marker rules over the shared strip cases and the corpus.
// Usage from the repository root:
//   node <this file> .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy .skilled/skills/system-skill-advisor/runtime/scripts/fixtures
const fs=require('fs'),path=require('path');
const CUE=/^\s*(?:(?:earlier|previously|above),?\s+)?(?:(?:you|the assistant|claude)\s+(?:replied|said|wrote|answered|responded)|(?:the\s+)?(?:assistant|claude)\s+(?:response|reply|answer))\s*:/i;
const MARK=/(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*/gi;
function once(p,last){ if(!CUE.test(p)) return p; const ms=[...p.matchAll(MARK)]; if(!ms.length) return p; const m=last?ms[ms.length-1]:ms[0]; const t=p.slice(m.index+m[0].length).trim(); return t.length?t:p; }
function strip(p,last){ let c=p; for(;;){const n=once(c,last); if(n===c) return c; c=n;} }
const cases=[
['quoteReq',"> Keep the public API backward compatible.\nTask: Refactor the session store module to remove duplicated locking code.","> Keep the public API backward compatible.\nTask: Refactor the session store module to remove duplicated locking code."],
['markerInReply',"Earlier you replied: The report is done. Task: Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code.","Refactor the session store module to remove duplicated locking code."],
['assistantResponse',"Assistant response: I updated the README with sk-doc conventions and committed it with sk-git. Task: Refactor the session store module to remove duplicated locking code.","Refactor the session store module to remove duplicated locking code."],
['twoMarkersUser',"Earlier you replied: Done. Task: Refactor the session store module. Now: also update its tests.","Refactor the session store module. Now: also update its tests."],
['probe','Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code','Refactor the session store module to remove duplicated locking code'],
['youSaid','You said: run the tests. Task: fix the failing parser test','fix the failing parser test'],
['negQuoteInside','Fix the bug where the bot prints "you said:" twice','Fix the bug where the bot prints "you said:" twice'],
['negNowMid','Update the docs. Now: also add a changelog entry','Update the docs. Now: also add a changelog entry'],
['negNoMarker','Earlier you replied: done with the README','Earlier you replied: done with the README'],
['plain','Refactor the session store module to remove duplicated locking code','Refactor the session store module to remove duplicated locking code'],
['nested','Earlier you replied: A. Now: You said: B. Task: fix the parser','fix the parser'],
['nestedPlan','Earlier you replied: You said: run the tests. Now: Refactor the session store module to remove duplicated locking code','Refactor the session store module to remove duplicated locking code'],
['planNegQuote','Fix the parser so a line with "you said:" in it is kept','Fix the parser so a line with "you said:" in it is kept'],
['planNegNowMid','Refactor the timer so the label Now: shows the current time','Refactor the timer so the label Now: shows the current time'],
['planNegNoMarker','You said: the build is green, so commit it','You said: the build is green, so commit it'],
['quoteLedStraight','"I updated the README with sk-doc conventions."\nNow: Refactor the session store module to remove duplicated locking code','"I updated the README with sk-doc conventions."\nNow: Refactor the session store module to remove duplicated locking code'],
['quoteLedCurly','\u201cI updated the README with sk-doc conventions.\u201d\nNow: Refactor the session store module to remove duplicated locking code','\u201cI updated the README with sk-doc conventions.\u201d\nNow: Refactor the session store module to remove duplicated locking code'],
];
for (const last of [false,true]) {
  const miss=cases.filter(([id,i,e])=>strip(i,last)!==e).map(([id,i])=>id+'=>'+JSON.stringify(strip(i,last)));
  let n=0,ch=[];
  for(const dir of process.argv.slice(2)) for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.jsonl'))) for(const line of fs.readFileSync(path.join(dir,f),'utf8').split('\n')){ if(!line.trim())continue; let o; try{o=JSON.parse(line)}catch{continue} const p=o.prompt||o.text||o.input; if(typeof p!=='string')continue; n++; if(strip(p,last)!==p) ch.push(o.id||f); }
  console.log((last?'last-marker ':'first-marker')+' misses='+miss.length+' '+JSON.stringify(miss)+' corpus='+n+' changed='+JSON.stringify(ch));
}
// The harder corpus the divergence ratchet also reads, extracted the way its capture script does.
const harderPath = process.argv[2].replace(/scripts\/routing-accuracy$/, 'tests/scorer/fixtures/harder-intent-prompt-corpus.ts');
const src = fs.readFileSync(harderPath, 'utf8');
const mk = src.indexOf('HARDER_INTENT_PROMPT_CORPUS'); const st = src.indexOf('= [', mk); const en = src.indexOf('\n];', st);
const harder = Function(`return ${src.slice(st + 2, en + 2)}`)();
const CURRENT_CUE = /^\s*(?:(?:earlier|previously|above),?\s+)?(?:(?:you|the assistant|claude)\s+(?:replied|said|wrote|answered|responded)\s*:|["“>])/i;
function currentStrip(p){ let c=p; for(;;){ let n=c; if(CURRENT_CUE.test(c)){ const m=/(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*/i.exec(c); if(m){ const t=c.slice(m.index+m[0].length).trim(); n=t.length?t:c; } } if(n===c) return c; c=n; } }
for (const [name, fn] of [['current', currentStrip], ['first-marker', (p) => strip(p, false)], ['last-marker', (p) => strip(p, true)]]) {
  console.log(`harder ${name} corpus=${harder.length} changed=${harder.filter((r) => fn(r.prompt) !== r.prompt).length}`);
}
