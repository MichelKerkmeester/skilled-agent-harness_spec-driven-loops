// Run from the repository root: node <this file>
// Planning probe for the three planned edits to the scorer's `shellReadTargets` and for
// the planned Codex body reader. It holds a copy of the function with its in-place sed
// rule and the planned edits applied, and prints the targets it names for each case beside
// the targets expected. It imports nothing, reads no file and writes nothing. The last
// line is `RESULT: <agree> of <total> agree`.

// Planned edit 1: a search prints matching lines, so `rg` and `grep` leave the list.
const SHELL_READERS = Object.freeze(['cat', 'head', 'tail', 'sed', 'less', 'more', 'bat', 'nl', 'awk']);
// Planned edit 2: the lines of a heredoc are data handed to a program, not commands.
const HEREDOC_BODY = /(<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2[^\n]*)\n[\s\S]*?\n[ \t]*\3[ \t]*(?=\n|$)/g;

const unquote = (word) => {
  const first = word[0];
  return word.length > 1 && (first === '"' || first === "'") && word[word.length - 1] === first
    ? word.slice(1, -1)
    : word;
};

function shellReadTargets(command) {
  const text = (typeof command === 'string' ? command : '').replace(HEREDOC_BODY, '$1');
  const parts = text.split(/;|&&|\|\||\||\r?\n/);
  const targets = [];
  // Planned edit 3: a `cd` earlier in the same command is where a bare name is read.
  let folder = null;

  for (const part of parts) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    let start = 0;
    while (start < words.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[start])) start += 1;
    if (start < words.length && words[start] === 'cd') {
      folder = words[start + 1] === undefined ? null : unquote(words[start + 1]).replace(/\/+$/, '');
      continue;
    }
    if (start >= words.length || !SHELL_READERS.includes(words[start])) continue;
    if (words[start] === 'sed' && words.slice(start + 1).some((word) => word === '--in-place' || /^-[A-Za-z]*i/.test(word))) continue;

    let redirect = false;
    for (const word of words.slice(start + 1)) {
      if (word.startsWith('>')) {
        redirect = true;
        continue;
      }
      if (redirect) continue;
      const unquoted = unquote(word);
      if (!/\.(?:md|ya?ml)$/.test(unquoted)) continue;
      targets.push(folder !== null && !/^[/~]/.test(unquoted) ? `${folder}/${unquoted}` : unquoted);
    }
  }

  return targets;
}

// The planned Codex body reader: the `cmd` strings of an `exec` body, one per line, or
// every string of a body that calls the shell tool with no `cmd` string of its own.
const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
const COMMAND_LITERAL = /\bcmd\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
const decode = (literal) => {
  if (literal.startsWith('"')) {
    try { return JSON.parse(literal); } catch { /* an escape JSON does not know */ }
  }
  return literal.slice(1, -1).replace(/\\(.)/g, '$1');
};
function execBodyCommand(body) {
  if (typeof body !== 'string' || !/\bexec_command\s*\(/.test(body)) return null;
  let found = [...body.matchAll(COMMAND_LITERAL)].map((match) => decode(match[1]));
  if (found.length === 0) found = [...body.matchAll(STRING_LITERAL)].map((match) => decode(match[0]));
  const lines = found.map((value) => value.trim()).filter(Boolean);
  return lines.length > 0 ? lines.join('\n') : null;
}

const DOC = '.skilled/skills/sk-doc/SKILL.md';
const CASES = [
  ['cat with the full path', `cat ${DOC}`, [DOC]],
  ['rg over the document', `rg -n "mode" ${DOC}`, []],
  ['grep over the document', `grep -n workflow ${DOC}`, []],
  ['heredoc body line that starts with head', `python3 - <<'EOF'\nhead ${DOC}\nEOF`, []],
  ['heredoc body line that starts with more', `node - <<EOF\nmore ${DOC}\nEOF`, []],
  ['read after a heredoc ends', `python3 - <<'EOF'\nprint(1)\nEOF\ncat ${DOC}`, [DOC]],
  ['indented heredoc end word', `python3 - <<-EOF\n\thead ${DOC}\n\tEOF\nhead ${DOC}`, [DOC]],
  ['cd into the skill folder, then cat', 'cd .skilled/skills/sk-doc && cat SKILL.md', [DOC]],
  ['cd with a quoted folder and a slash', 'cd ".skilled/skills/sk-doc/" && sed -n 1,80p SKILL.md', [DOC]],
  ['cd elsewhere, then cat a bare name', 'cd docs && cat SKILL.md', ['docs/SKILL.md']],
  ['cd, then an absolute path', 'cd docs && cat /repo/.skilled/skills/sk-doc/SKILL.md', ['/repo/.skilled/skills/sk-doc/SKILL.md']],
  ['sed in place stays a write', `sed -i '' 's/a/b/' ${DOC}`, []],
  ['redirect target stays out', `cat notes.md > ${DOC}`, ['notes.md']],
];

let agree = 0;
let total = 0;
for (const [name, command, expected] of CASES) {
  const actual = shellReadTargets(command);
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  total += 1;
  if (same) agree += 1;
  console.log(`${same ? 'agree' : 'DIFFER'} :: ${name} :: ${JSON.stringify(actual)}`);
}

const BODIES = [
  ['two commands', 'const r = await tools.exec_command({cmd:"cat .skilled/skills/sk-doc/SKILL.md"}); const s = await tools.exec_command({cmd:"git status --porcelain"}); text(r);', 'cat .skilled/skills/sk-doc/SKILL.md\ngit status --porcelain'],
  ['an escaped quote', 'const r = await tools.exec_command({cmd:"rg -n \\"mode\\" notes.md",workdir:"/repo"}); text(r);', 'rg -n "mode" notes.md'],
  ['commands in a list', 'const cmds = [["a", "cat .skilled/skills/sk-doc/SKILL.md"]]; const rs = await Promise.all(cmds.map(async ([k,cmd]) => [k, await tools.exec_command({cmd})]));', 'a\ncat .skilled/skills/sk-doc/SKILL.md'],
  ['no shell tool', 'const r = await tools.web__run({search_query:[{q:"x"}]}); text(r);', null],
  ['no body', undefined, null],
];
for (const [name, body, expected] of BODIES) {
  const actual = execBodyCommand(body);
  const same = actual === expected;
  total += 1;
  if (same) agree += 1;
  console.log(`${same ? 'agree' : 'DIFFER'} :: exec body, ${name} :: ${JSON.stringify(actual)}`);
}
console.log(`RESULT: ${agree} of ${total} agree`);
