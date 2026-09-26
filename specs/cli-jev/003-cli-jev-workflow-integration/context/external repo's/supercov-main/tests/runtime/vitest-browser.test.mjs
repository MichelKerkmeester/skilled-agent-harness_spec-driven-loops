import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

test('Vitest browser module setup survives reset without being assigned to a test', () => {
  const adapter = resolve(
    import.meta.dirname,
    '../../runtime/javascript/vitestBrowser.mjs',
  );
  const child = spawnSync(
    process.execPath,
    [
      '--experimental-vm-modules',
      '--input-type=module',
      '--eval',
      `
 import assert from 'node:assert/strict';
 import {readFileSync} from 'node:fs';
 import {SourceTextModule,SyntheticModule,createContext} from 'node:vm';
 import {webcrypto} from 'node:crypto';
 const hooks={},payloads=[];let hits=['module import'],scope;
 const context=createContext({console,crypto:webcrypto,TextEncoder});
 function mock(values){return new SyntheticModule(Object.keys(values),function(){for(const [k,v] of Object.entries(values))this.setExport(k,v)},{context});}
 const vitest=mock({beforeEach:fn=>hooks.before=fn,afterEach:fn=>hooks.after=fn});
 const runtime=mock({coverageSnapshot:()=>({hits:[...hits],decisions:[]}),activateCoverageScope:s=>scope=s,enableRuntimeSnapshotEvidence:()=>{},resetCoverage:()=>{hits=[]},takeNodeAssertionPhases:()=>[]});
 const channel=mock({commands:{__supercovEvidence:async(payload,suffix)=>{payloads.push({payload,suffix});}}});
 await channel.link(()=>{});await channel.evaluate();
 const module=new SourceTextModule(readFileSync(${JSON.stringify(adapter)},'utf8'),{context,importModuleDynamically:async()=>channel});
 await module.link(id=>id==='vitest'?vitest:runtime);await module.evaluate();
 const file={id:'file-a',name:'widget.test.tsx',projectName:'browser'};
 const task={id:'test-a',file,name:'first',result:{state:'pass'}};
 await hooks.before({task});
 assert.equal(payloads.length,1);assert.equal(payloads[0].payload.role,'setup');
 assert.equal(payloads[0].payload.testId,'vitest:file-a:setup');
 assert.equal(payloads[0].payload.scope,undefined);
 assert.deepEqual([...payloads[0].payload.runtime[0].hits],['module import']);
 hits.push('first body');await hooks.after({task});
 assert.deepEqual([...payloads[1].payload.runtime[0].hits],['first body']);
 assert.equal(payloads[1].payload.scope.testId,'vitest:test-a');
 const second={...task,id:'test-b',name:'second'};await hooks.before({task:second});
 hits.push('second body');await hooks.after({task:second});
 assert.equal(payloads.filter(p=>p.payload.role==='setup').length,1);
 assert.deepEqual([...payloads[2].payload.runtime[0].hits],['second body']);
 assert.equal(payloads[2].payload.scope.testId,'vitest:test-b');
 `,
    ],
    { encoding: 'utf8', timeout: 10000 },
  );
  assert.equal(child.status, 0, child.stderr || child.stdout);
});
