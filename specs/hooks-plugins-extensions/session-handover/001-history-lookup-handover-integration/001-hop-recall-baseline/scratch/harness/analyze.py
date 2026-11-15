#!/usr/bin/env python3
"""Score one hop-recall run from the transcripts and the handoff note. Prints one JSON object."""
import glob, json, os, re, sys

project_dir, start_ms, notes_dir, code, question = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]
SEED = '[session-handover] claim and continue handoff'

def load(path):
    rows = []
    for line in open(path, errors='ignore'):
        try:
            rows.append(json.loads(line))
        except ValueError:
            pass
    return rows

def text_of(row):
    content = (row.get('message') or {}).get('content')
    if isinstance(content, str):
        return content
    return ' '.join(b.get('text', '') for b in content or [] if isinstance(b, dict) and b.get('type') == 'text')

sender = receiver = None
for path in glob.glob(os.path.join(project_dir, '*.jsonl')):
    if os.path.getmtime(path) * 1000 < start_ms:
        continue
    rows = load(path)
    users = [text_of(r) for r in rows if r.get('type') == 'user' and not r.get('isMeta')]
    if any(SEED in u for u in users[:3]):
        receiver = (path, rows)
    elif any('show-codes.sh' in u for u in users[:3]):
        sender = (path, rows)

note = None
for path in glob.glob(os.path.join(notes_dir, '*.md')):
    if os.path.getmtime(path) * 1000 >= start_ms:
        note = path
note_text = open(note).read() if note else ''
status = re.search(r'^status:\s*(\S+)', note_text, re.M)

out = {
    'sender': os.path.basename(sender[0])[:-6] if sender else None,
    'receiver': os.path.basename(receiver[0])[:-6] if receiver else None,
    'note': os.path.basename(note) if note else None,
    'note_status': status.group(1) if status else None,
    'note_leaked': int(code in note_text),
    'sender_saw_code': int(bool(sender) and any(code in json.dumps(r) for r in sender[1])),
    'answer': 'pending', 'lookup_attempted': 0, 'native_recall': 0, 'transcript_read': 0, 'reply': None,
}
if receiver:
    rows = receiver[1]
    asked = next((i for i, r in enumerate(rows) if r.get('type') == 'user' and question[:40] in text_of(r)), None)
    if asked is not None:
        after = rows[asked + 1:]
        tools = [json.dumps(b.get('input', {})) for r in after if r.get('type') == 'assistant'
                 for b in ((r.get('message') or {}).get('content') or [])
                 if isinstance(b, dict) and b.get('type') == 'tool_use']
        out['lookup_attempted'] = int(any('history/cli.js' in t or 'history-lookup.mjs' in t for t in tools))
        out['transcript_read'] = int(any('.claude/projects' in t or '.jsonl' in t for t in tools))
        replies = [text_of(r) for r in after if r.get('type') == 'assistant' and text_of(r).strip()]
        out['native_recall'] = int(any(re.search(r'searched memor|recalled|searched (the )?(session|conversation)', t, re.I) for t in replies))
        if replies:
            last = replies[-1].strip()
            out['reply'] = last[:200]
            if code in last:
                out['answer'] = 'correct'
            elif re.search(r'\b[A-HJ-NP-Z2-9]{8}\b', last) and 'UNKNOWN' not in last.upper():
                out['answer'] = 'wrong'
            else:
                out['answer'] = 'missing'
print(json.dumps(out))
