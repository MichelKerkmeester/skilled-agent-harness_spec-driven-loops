import os, time, json
os.environ['HF_HUB_OFFLINE'] = '1'
from sentence_transformers import SentenceTransformer

t0 = time.time()
m = SentenceTransformer('google/embeddinggemma-300m', device='mps')
load_s = time.time() - t0

t1 = time.time()
v = m.encode('def hello(): return "world"', normalize_embeddings=True)
encode_ms = (time.time() - t1) * 1000

result = {
    'load_s': round(load_s, 2),
    'encode_ms': round(encode_ms, 1),
    'dim': int(v.shape[0]),
    'first5': [round(float(x), 5) for x in v[:5]],
    'norm': round(float((v * v).sum() ** 0.5), 4)
}
print(json.dumps(result, indent=2))
