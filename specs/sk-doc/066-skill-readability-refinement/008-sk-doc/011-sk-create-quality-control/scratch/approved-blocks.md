# Approved fenced blocks

The two nested After examples in `references/transformation-patterns.md`: the outer fence is four backticks so the inner `python` fence no longer closes it early. Contents are unchanged from HEAD.

````markdown
Authenticating Your Client
```python
from library import Client

client = Client(api_key="your_key")
if client.authenticate():
    print("Authenticated!")
```
````

````markdown
Quick Start
```python
# Install: pip install library
from library import Client

client = Client(api_key="key")
response = client.query("SELECT * FROM data")
for row in response:
    print(row)
```
````

The Before examples of Patterns 2 and 3: at HEAD the stray closing fence of each preceding After block opened a block that swallowed the next pattern's heading and ratings, so these two blocks now stand on their own. Contents are unchanged.

```python
from library import Client, Query
```

```python
client = Client()
client.connect()
client.query("SELECT *")
```
