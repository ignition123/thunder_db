# thunder_db
Thunder DB (Development Build)

To connect server write

thunder --config db_server_config.json

Basic queries:

1. To check if server is working write PING -> PONG will be response.
2. To set key value pair: {"ch":{"db":0,"set":{"key":"name", "val":"Sudeep Dasgupta"}}}
where ch means cache and db is the database number from 0-14
3. To get value {"ch":{"db":0,"get":{"key":"name"}}}
4. To delete value {"ch":{"db":0,"del":{"key":"name"}}}

It is under development will be updating on daily basis
