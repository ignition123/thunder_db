package server

import (
	"pojo"
	"net"
	"encoding/json"
)

func ParseMsg(msg string, conn net.Conn){

	if msg == "PING"{

		WriteBytes(conn, []byte("PONG"))

	}else{

		var QueryObject = pojo.QueryParser{}

		pojoErr := json.Unmarshal([]byte(msg), &QueryObject)

		if pojoErr != nil{
			WriteBytes(conn, []byte("Invalid message command..."))
			return
		}

		// Cache Query SET, GET, DEL method to be invoked

		if QueryObject.Ch != nil{
			CallCacheMethod(conn, QueryObject)
		}
	}
}