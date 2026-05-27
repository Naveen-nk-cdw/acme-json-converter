# ACME JSON Converter

A API interface used by ACME for indexing Salicify JSON-native data into Salesforce XML data.

---

## Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose

---

## Sample `.env` File

```env
POSTGRES_USER=string
POSTGRES_PASSWORD=string
POSTGRES_DB=string
KAFKA_CLUSTER_ID=uuid
REDIS_PASSWORD=string
BACKEND_PORT=number
POSTGRES_PORT=number
KAFKA_PORT=number
REDIS_PORT=number
```

---

### Command to run the application

```sh
docker compose --env-file <path-to-env-file> up --build
```
