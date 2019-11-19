package server

import (
	"pojo"
	"net"
	"fmt"
	"encoding/json"
)

func ParseMsg(msg string, conn net.Conn){

	if msg == "PING"{

		conn.Write([]byte("PONG \r\n"))

	}else{

		var QueryObject = pojo.QueryParser{}

		pojoErr := json.Unmarshal([]byte(msg), &QueryObject)

		if pojoErr != nil{
			fmt.Println("Invalid message...")
			conn.Close()
			return
		}

		// Cache Query SET, GET, DEL method to be invoked

		if QueryObject.Ch != nil{
			CallCacheMethod(conn, QueryObject)
		}
	}
}