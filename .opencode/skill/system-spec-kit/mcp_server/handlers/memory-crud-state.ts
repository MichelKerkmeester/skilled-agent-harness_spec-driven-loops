// ---------------------------------------------------------------
// MODULE: Memory CRUD State
// ---------------------------------------------------------------

let embeddingModelReady = false;

function setEmbeddingModelReady(ready: boolean): void {
  embeddingModelReady = ready;
}

function isEmbeddingModelReady(): boolean {
  return embeddingModelReady;
}

export {
  setEmbeddingModelReady,
  isEmbeddingModelReady,
};
