import fs from 'node:fs';

const iteration = Number(process.argv[2]);
if (!Number.isInteger(iteration) || iteration < 1) throw new Error('iteration required');
const pad = String(iteration).padStart(3, '0');
const lineage = new URL('.', import.meta.url).pathname;
const recordPath = `${lineage}iter-${pad}.record.json`;
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const extraPath = `${lineage}iter-${pad}.delta-extra.jsonl`;
const extra = fs.existsSync(extraPath)
  ? fs.readFileSync(extraPath, 'utf8').split('\n').filter((line) => line.trim() !== '')
  : [];
const lines = [JSON.stringify(record), ...extra];
fs.writeFileSync(`${lineage}deltas/iter-${pad}.jsonl`, `${lines.join('\n')}\n`);
const events = Array.isArray(record.graphEvents) ? record.graphEvents : [];
fs.writeFileSync(`${lineage}iter-${pad}.nodes.json`, JSON.stringify(events.filter((event) => event.type === 'node')));
fs.writeFileSync(`${lineage}iter-${pad}.edges.json`, JSON.stringify(events.filter((event) => event.type === 'edge')));
console.log(JSON.stringify({ iteration, deltaLines: lines.length, nodes: events.filter((event) => event.type === 'node').length, edges: events.filter((event) => event.type === 'edge').length }));
