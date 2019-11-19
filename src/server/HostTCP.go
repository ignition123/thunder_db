package server

import (
	"pojo"
	"net"
	"fmt"
	"os"
	"time"
)

type ServerConnection struct{
	connections map[net.Conn] time.Time
}

func HostTCP(configObj pojo.Config){

	server, err := net.Listen("tcp", *configObj.Server.Host +":"+ *configObj.Server.Port)

    if err != nil {
        fmt.Println("Error listening:", err.Error())
        os.Exit(1)
	}
	
	defer server.Close()

	fmt.Println("Listening on " + *configObj.Server.Host + ":" + *configObj.Server.Port+"...")

	CreateCacheDB()

    for {

		time.Sleep(1)

		conn, err := server.Accept()

		fmt.Println("connection accepted...")
		
        if err != nil {
            fmt.Println("Error accepting: ", err.Error())
		}

		var messageQueue = make(chan string)

		defer close(messageQueue)
		
		go RecieveMessage(conn, messageQueue)

		go HandleRequest(conn, messageQueue)
		
	}
}
