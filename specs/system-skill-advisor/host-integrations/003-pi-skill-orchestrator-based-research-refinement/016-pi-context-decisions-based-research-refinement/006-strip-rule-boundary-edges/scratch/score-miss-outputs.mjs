// Scores the text each candidate marker rule leaves on its one missed case, beside the ideal text,
// through the built scorer. Usage from the repository root:
//   SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 node <this file> "$PWD"
const root=process.argv[2];
const {scoreAdvisorPrompt}=await import(root+'/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js');
for (const p of ["Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code.","Refactor the session store module to remove duplicated locking code.","also update its tests.","Refactor the session store module. Now: also update its tests."]) {
  const r=scoreAdvisorPrompt(p,{workspaceRoot:root});
  console.log(JSON.stringify(p), '->', r.topSkill, JSON.stringify(r.recommendations.slice(0,3).map(x=>[x.skill,+x.confidence.toFixed(3)])));
}
