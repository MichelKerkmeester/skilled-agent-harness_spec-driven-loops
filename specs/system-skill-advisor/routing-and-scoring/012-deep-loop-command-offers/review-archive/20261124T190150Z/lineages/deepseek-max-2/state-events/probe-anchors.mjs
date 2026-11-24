import { readFileSync, existsSync } from 'node:fs';
const files = process.argv.slice(2);
const seen = new Set();
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    for (const m of lines[i].matchAll(/`([A-Za-z0-9_./-]+\.[a-z]+):(\d+)(?:`|\s+to\s+`:(\d+)`)/g)) {
      const [, path, line, end] = m;
      const key = `${path}:${line}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!existsSync(path)) { console.log(`MISSING ${path}:${line} (cited at ${file}:${i + 1})`); continue; }
      const target = readFileSync(path, 'utf8').split('\n');
      const want = Number(line);
      const got = target[want - 1] ?? '<past end>';
      console.log(`${file.split('/').pop()}:${i + 1} -> ${path}:${want} | ${JSON.stringify(got.trim().slice(0, 130))}`);
    }
  }
}
