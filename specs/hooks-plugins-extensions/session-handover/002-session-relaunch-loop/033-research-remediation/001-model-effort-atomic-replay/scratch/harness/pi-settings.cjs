// Prints the model and thinking entries of each Pi session transcript given, one line each.
const fs = require('fs');
for (const file of process.argv.slice(2)) {
  console.log(`-- ${file.split('/').pop()}`);
  for (const line of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    const e = JSON.parse(line);
    if (['session', 'model_change', 'thinking_level_change'].includes(e.type) || e.message?.role === 'assistant') {
      console.log([e.type, e.provider || e.message?.provider || '', e.modelId || e.message?.model || '', e.thinkingLevel ?? '', e.timestamp || ''].join(' '));
    }
  }
}
