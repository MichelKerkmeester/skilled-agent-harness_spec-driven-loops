class Store:
    def __init__(self, client):
        self.client = client

    def balance(self, account_id):
        row = self.client.fetch_one(
            "select balance from accounts where id = %s", (account_id,)
        )
        return row[0] if row else 0
