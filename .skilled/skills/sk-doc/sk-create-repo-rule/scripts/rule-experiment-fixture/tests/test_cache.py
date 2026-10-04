import time

from orbit.cache import Cache


def test_get_returns_stored_value():
    cache = Cache(ttl=30, max_entries=10)
    cache.set("a", 1)
    assert cache.get("a") == 1


def test_missing_key_returns_none():
    assert Cache(ttl=30, max_entries=10).get("nope") is None
