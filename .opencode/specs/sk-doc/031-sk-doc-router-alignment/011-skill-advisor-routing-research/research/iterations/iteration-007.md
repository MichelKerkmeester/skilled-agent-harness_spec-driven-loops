# Iteration 7: Joined RRF calibration execution blocked

## Focus

Produce the fresh joined RRF calibration report and numeric proposal.

## Actions Taken

1. Re-read the state, strategy, prior iteration, and workflow contract.
2. Traced the exact RRF and calibration source.
3. Attempted the installed TypeScript runner path; it was absent.
4. Attempted Node's source-level TypeScript loader without writing build artifacts; it failed.

## Findings

The source contract is confirmed: advisor RRF uses `k=8`, zero overlap bonuses, and graduated-on query-local min-max normalization. Confidence and uncertainty are separate policy functions. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:299-444] [SOURCE: .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:445-555] [SOURCE: .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:752-800]

The numeric report could not be produced without either building stale distribution artifacts or creating a temporary test harness, both outside this iteration's allowed write paths. No calibration number is fabricated. Execution evidence: `[eval]:1 \nimport { readFileSync } from "node:fs";\nimport { resolve } from "node:path";\nimport { scoreAdvisorPrompt } from "./.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts";\nimport { mergedSkillForAlias, skillMatchesAlias } from "./.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts";\nconst root=process.cwd(),base=resolve(root,".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy");\nconst read=n=>readFileSync(resolve(base,n),"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);\nconst canon=x=>x===null||x==="none"?null:mergedSkillForAlias(x);\nconst ok=(a,e)=>{a=canon(a);e=canon(e);return a===e||(a!==null&&e!==null&&skillMatchesAlias(a,e));};\nconst rnd=x=>Number(x.toFixed(6));\nfunction summary(name,rows){\n const xs=rows.map(row=>{const r=scoreAdvisorPrompt(row.prompt,{workspaceRoot:root,includeAllCandidates:true});const t=r.topSkill===null?null:r.recommendations.find(x=>x.skill===r.topSkill)??null;const top2=r.recommendations.slice(0,2);return{id:row.id??null,gold:row.skill_top_1,pred:r.topSkill,ok:ok(r.topSkill,row.skill_top_1),c:t?.confidence??0,u:t?.uncertainty??1,s:t?.score??0,amb:r.ambiguous,cluster:`. [SOURCE: command: source-level TypeScript runner attempts]

## Questions Answered

- Exact RRF constant and normalization are answered.

## Questions Remaining

- Floor frequency, ambiguity composition, uncertainty bands, and held-out correctness remain open.
- The final numeric proposal remains open.

## Next Focus

Run the joined report through the workflow's supported prebuilt scorer evaluator after its distribution is rebuilt by an implementation task, or add the report as an in-scope test artifact in a later implementation packet.

## Ruled-Out Directions

- Using the explicitly stale distribution as current-source evidence.
- Writing a temporary harness outside the allowed research artifacts.
- Fabricating a numeric proposal from stale baselines.

## Assessment

- `newInfoRatio`: 0.24
- Novelty justification: Source inspection fixed the exact RRF normalization contract, but both available source-level execution paths were unavailable; the numeric proposal remains blocked rather than fabricated.
- Confidence: high for the static formula; no confidence claim for missing empirical metrics.

## SCOPE VIOLATIONS

- A fresh TypeScript build or temporary executable harness would mutate paths outside the allowed write list, so it was not performed.

