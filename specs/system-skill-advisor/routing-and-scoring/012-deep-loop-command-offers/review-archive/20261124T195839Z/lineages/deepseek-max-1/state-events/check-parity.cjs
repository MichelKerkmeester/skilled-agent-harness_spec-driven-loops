const fs = require("fs");
const ts = fs.readFileSync(".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", "utf8");
const py = fs.readFileSync(".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", "utf8");
function tsList(name) {
  const i = ts.indexOf("export const " + name);
  if (i < 0) return null;
  const j = ts.indexOf("];", i);
  const block = ts.slice(ts.indexOf("[", i), j);
  const out = [];
  for (let k = 0; k < block.length; k++) {
    const c = block[k];
    if (c === "'" || c === '"') {
      let s = "", closed = false;
      let m = k + 1;
      for (; m < block.length; m++) {
        if (block[m] === "\\") { s += block[m + 1]; m++; continue; }
        if (block[m] === c) { closed = true; break; }
        s += block[m];
      }
      out.push(s); k = m;
    }
  }
  return out;
}
function pyList(name) {
  const i = py.indexOf(name + " =");
  if (i < 0) return null;
  const open = py.indexOf("(", i);
  const close = py.indexOf(")", open);
  const block = py.slice(open, close);
  return [...block.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
}
const pairs = [
  ["COUNT_WORDS", "_COUNT_WORD_LIST"],
  ["LOOP_NAMES", "_LOOP_NAME_LIST"],
  ["LOOP_WORDING", "_LOOP_WORDING_LIST"],
  ["RUN_ASK_REFUSAL_LEADS", "_RUN_ASK_REFUSAL_LEAD_LIST"],
  ["DEFECT_CHECK_VERBS", "_DEFECT_CHECK_VERB_LIST"],
  ["DEFECT_CHECK_NOUNS", "_DEFECT_CHECK_NOUN_LIST"],
  ["LOOP_EFFORT_WORDS", "_LOOP_EFFORT_WORD_LIST"],
  ["LOOP_EFFORT_LEADS", "_LOOP_EFFORT_LEAD_LIST"],
  ["LOOP_EFFORT_CHANGE_VERBS", "_LOOP_EFFORT_CHANGE_VERB_LIST"],
  ["PAST_RUN_READ_VERBS", "_PAST_RUN_READ_VERB_LIST"],
  ["RERUN_PRONOUNS", "_RERUN_PRONOUN_LIST"],
  ["ITERATIVE_VERBS", "_ITERATIVE_VERB_LIST"],
  ["LOOP_RUN_SYMPTOMS", "_LOOP_RUN_SYMPTOM_LIST"],
  ["LOOP_ARTIFACT_NOUNS", "_LOOP_ARTIFACT_NOUN_LIST"],
  ["MODE_SUFFIXES", "_MODE_SUFFIX_LIST"],
  ["READ_ONLY_LOOP_MODES", "_READ_ONLY_LOOP_MODE_LIST"],
  ["LOOP_WANT_LEADS", "_LOOP_WANT_LEAD_LIST"],
  ["LOOP_QUESTION_AUXILIARIES", "_LOOP_QUESTION_AUXILIARY_LIST"],
  ["MODE_CUE_WORDS.research", "_RESEARCH_MODE_CUE_LIST"],
  ["MODE_CUE_WORDS.review", "_REVIEW_MODE_CUE_LIST"],
];
let bad = 0;
for (const [a, b] of pairs) {
  let x = tsList(a);
  if (a.startsWith("MODE_CUE_WORDS.")) {
    const key = a.split(".")[1];
    const i = ts.indexOf("export const MODE_CUE_WORDS");
    const j = ts.indexOf("\n};", i);
    const block = ts.slice(i, j);
    const ki = block.indexOf(key + ":");
    const arr = block.slice(block.indexOf("[", ki), block.indexOf("]", ki));
    x = [...arr.matchAll(/'([^']*)'/g)].map((m) => m[1]);
  }
  const y = pyList(b);
  if (!x || !y) { console.log("MISSING", a, !!x, !!y, b); bad++; continue; }
  if (JSON.stringify(x) !== JSON.stringify(y)) {
    bad++;
    const sx = new Set(x), sy = new Set(y);
    console.log("DRIFT", a, x.length, "vs", y.length);
    console.log("  only-ts:", JSON.stringify(x.filter((v) => !sy.has(v))));
    console.log("  only-py:", JSON.stringify(y.filter((v) => !sx.has(v))));
  }
}
console.log("pairs", pairs.length, "drift", bad);
