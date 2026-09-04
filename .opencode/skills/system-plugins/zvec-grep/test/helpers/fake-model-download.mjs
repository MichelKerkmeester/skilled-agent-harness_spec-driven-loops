const originalFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url =
    typeof Request !== "undefined" && input instanceof Request
      ? input.url
      : String(input);
  if (!url.startsWith("https://huggingface.co/")) {
    return await originalFetch(input, init);
  }

  const size = url.endsWith("/tokenizer.json") ? 128 : 1024;
  const bytes = new Uint8Array(size);
  bytes.fill(1);
  return new Response(bytes, {
    status: 200,
    headers: {
      "content-length": String(bytes.byteLength),
      "content-type": "application/octet-stream",
    },
  });
};
