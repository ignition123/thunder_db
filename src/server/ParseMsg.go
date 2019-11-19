package server

import (
	"pojo"
	"net"
	"encoding/json"
)

func ParseMsg(msg string, conn net.Conn){

	if msg == "PING"{

		conn.Write([]byte("PONG \r\n"))

	}else{

		var QueryObject = pojo.QueryParser{}

		pojoErr := json.Unmarshal([]byte(msg), &QueryObject)

		if pojoErr != nil{
			conn.Write([]byte("Invalid message command... \r\n"))
			return
		}

		// Cache Query SET, GET, DEL method to be invoked

		if QueryObject.Ch != nil{
			CallCacheMethod(conn, QueryObject)
		}
	}
}