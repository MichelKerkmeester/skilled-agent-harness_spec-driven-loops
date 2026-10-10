'use strict';

// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
function readStdin({ timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    let timer = null;

    const onData = (chunk) => chunks.push(chunk);
    const onEnd = () => {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    };
    const release = () => {
      clearTimeout(timer);
      process.stdin.removeListener('data', onData);
      process.stdin.removeListener('end', onEnd);
      process.stdin.removeListener('error', onError);
      process.stdin.pause();
    };

    timer = setTimeout(onEnd, timeoutMs);
    process.stdin.on('data', onData);
    process.stdin.on('end', onEnd);
    process.stdin.on('error', onError);
  });
}

module.exports = { readStdin };
