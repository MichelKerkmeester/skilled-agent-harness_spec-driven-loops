// -------------------------------------------------------------------
// MODULE: Storage Ports - Common Types
// -------------------------------------------------------------------

/** Synchronous or asynchronous result accepted by storage port operations. */
export type Awaitable<T> = T | Promise<T>;

/** Stable identifier used by storage-backed documents and vectors. */
export type StorageId = number | string;
