// Response-parsing helpers for the bake-off harness.
//
// extractFunction: pull a single JS function definition out of a model
// response. MiMo often wraps code in a markdown fence even when told not to, so
// we handle both fenced and bare output, and both `function name(...)` and
// `const name = (...) =>` / arrow forms.
//
// detectFormatAdherence: did the model return ONLY code (the format contract)?
// True when, after stripping any single fenced block, no substantive prose
// remains outside the function body.

// Strip the first fenced code block's fence markers; return { code, wasFenced }.
function unfence(text) {
  const fenceRe = /```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/;
  const m = text.match(fenceRe);
  if (m) return { code: m[1], wasFenced: true };
  return { code: text, wasFenced: false };
}

// Extract a function definition for `fnName` from raw model text.
// Returns { source, ok, reason }.
function extractFunction(rawText, fnName) {
  if (!rawText || !rawText.trim()) {
    return { source: '', ok: false, reason: 'empty response' };
  }
  const { code } = unfence(rawText);

  // Find a `function fnName` declaration and capture its full body via brace
  // matching (robust to nested braces in the implementation).
  const declRe = new RegExp('function\\s+' + fnName + '\\s*\\(');
  let idx = code.search(declRe);
  if (idx === -1) {
    // Try arrow / const forms: `const fnName = (...) => { ... }` or `= ... =>`.
    const arrowRe = new RegExp('(?:const|let|var)\\s+' + fnName + '\\s*=');
    idx = code.search(arrowRe);
    if (idx === -1) {
      return { source: '', ok: false, reason: 'no definition for ' + fnName };
    }
  }

  // From idx, walk to the matching closing brace of the function body.
  const open = code.indexOf('{', idx);
  if (open === -1) {
    // Possibly a concise arrow body `const f = x => x*2;` — take to end of statement.
    const semi = code.indexOf(';', idx);
    const end = semi === -1 ? code.length : semi + 1;
    return { source: code.slice(idx, end).trim(), ok: true, reason: 'concise-arrow' };
  }
  let depth = 0;
  let end = -1;
  for (let i = open; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return { source: '', ok: false, reason: 'unbalanced braces' };
  return { source: code.slice(idx, end).trim(), ok: true, reason: 'ok' };
}

// Did the model honour "return ONLY the function code"?
// We allow exactly one fenced block OR no fence; we reject substantive prose
// (sentences) appearing outside the code body.
function detectFormatAdherence(rawText, fnName) {
  if (!rawText) return { adherent: false, reason: 'empty' };
  const fenceCount = (rawText.match(/```/g) || []).length;
  // More than one fenced block (i.e. >2 backtick-fences) => extra content blocks.
  if (fenceCount > 2) return { adherent: false, reason: 'multiple code blocks' };

  const { code } = unfence(rawText);
  // Remove the extracted function from the (unfenced) code to see leftovers.
  const ext = extractFunction(rawText, fnName);
  let leftover = code;
  if (ext.ok) leftover = code.replace(ext.source, '');
  // Strip the fenced wrapper remnants and whitespace.
  leftover = leftover.replace(/```[a-zA-Z0-9_-]*/g, '').trim();

  // Outside the fence, look at the raw text minus the fenced block.
  let outside = rawText;
  const fenceBlock = rawText.match(/```[\s\S]*?```/);
  if (fenceBlock) outside = rawText.replace(fenceBlock[0], '');
  outside = outside.trim();

  // Heuristic: prose = a run of >= 8 word-chars-with-spaces ending in a period,
  // or any line that reads like a sentence (>= 6 words). Comments inside the
  // function are fine; we only judge text OUTSIDE the function/fence.
  const proseSignal = /[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}/;
  const combined = (outside + '\n' + leftover).trim();
  if (combined && proseSignal.test(combined)) {
    return { adherent: false, reason: 'prose outside code' };
  }
  return { adherent: true, reason: 'code only' };
}

module.exports = { extractFunction, detectFormatAdherence, unfence };
