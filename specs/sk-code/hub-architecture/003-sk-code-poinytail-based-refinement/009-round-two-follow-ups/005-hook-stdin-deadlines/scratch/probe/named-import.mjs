import { readStdin, parseJsonFailOpen } from '../../../../../../../.skilled/hooks/shared/hook-adapter-shared.cjs';
console.log(typeof readStdin, typeof parseJsonFailOpen);
const t = Date.now();
const text = await readStdin();
console.log(JSON.stringify({ text, ms: Date.now() - t }));
