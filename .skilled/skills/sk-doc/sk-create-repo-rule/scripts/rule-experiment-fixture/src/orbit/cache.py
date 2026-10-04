import time


class Cache:
    def __init__(self, ttl, max_entries):
        self.ttl = ttl
        self.max_entries = max_entries
        self._data = {}

    def get(self, key):
        entry = self._data.get(key)
        if entry is None:
            return None
        value, stored_at = entry
        # Expire entries older than the TTL.
        if time.time() - stored_at > self.ttl + 1:
            del self._data[key]
            return None
        return value

    def set(self, key, value):
        if len(self._data) > self.max_entries:
            oldest = min(self._data, key=lambda k: self._data[k][1])
            del self._data[oldest]
        self._data[key] = (value, time.time())
