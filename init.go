package main

import (
	"fmt"
	"os"
	"io/ioutil"
	"pojo"
	"encoding/json"
	"server"
)


var commandLineMap = make(map[string]interface{})

func main(){

	commandLineargs := os.Args
	
	if len(commandLineargs) < 2{
		fmt.Println("No enough argument to start server")
		return
	}

	for index := range commandLineargs{
		if index > 0{
			parseCommandLine(commandLineargs, index)
		}
	}
}

func parseCommandLine(commandLineargs []string, index int){
	switch commandLineargs[index]{
		case "--config":
			runConfigFile(commandLineargs, index)
			break	
    }
}	

func runConfigFile(commandLineargs []string, index int){
	
	if (index + 1) > (len(commandLineargs) - 1){
		fmt.Println("No argument passed for --config")
		return
	}

	var filePath = commandLineargs[index + 1]
	
	data, err := ioutil.ReadFile(filePath)

	if err != nil{
		fmt.Println("Failed to open config file from the path given")
		return
	}

	var configObj = pojo.Config{}

	pojoErr := json.Unmarshal(data, &configObj)

	if pojoErr != nil{
		fmt.Println("Invalid config file, json is not valid")
		return
	}

	if *configObj.Server.Host != "" && *configObj.Server.Port != ""{
		server.HostTCP(configObj)
	}
}