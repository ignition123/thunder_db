package server


import(
	"net"
	"pojo"
	"sync"
	"fmt"
	"encoding/json"
)

var mutex = &sync.Mutex{}

func CallCacheMethod(conn net.Conn, QueryObject pojo.QueryParser){

	fmt.Println("ok")
	
	if QueryObject.Ch.Set != nil{

		if QueryObject.Ch.Set.Key == nil || QueryObject.Ch.Set.Val == nil{
			WriteBytes(conn, 2, []byte("Set method needs both key and val"))
			return
		}

		mutex.Lock()
		Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Set.Key] = []byte(*QueryObject.Ch.Set.Val)
		mutex.Unlock()
		WriteBytes(conn, 1, []byte("OK"))

		return
	}
	
	if QueryObject.Ch.Get != nil{

		if QueryObject.Ch.Get.Key == nil{
			WriteBytes(conn, 2, []byte("Get method needs key"))
			return
		}

		mutex.Lock()
		var value = Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Get.Key]
		mutex.Unlock()
		if len(value) == 0{
			WriteBytes(conn, 1, []byte("(nil)"))
		}else{
			WriteBytes(conn, 1, value)
		}

		return
	}
	
	if  QueryObject.Ch.Del != nil{

		if QueryObject.Ch.Del.Key == nil{
			WriteBytes(conn, 2, []byte("Del method needs key"))
			return
		}

		mutex.Lock()
		delete(Storage[*QueryObject.Ch.DB], *QueryObject.Ch.Del.Key)
		mutex.Unlock()
		WriteBytes(conn, 1, []byte("OK"))

		return
	}
	
	if  QueryObject.Ch.Append != nil{

		if QueryObject.Ch.Append.Key == nil || QueryObject.Ch.Append.Val == nil{
			WriteBytes(conn, 2, []byte("Append method needs both key and val"))
			return
		}

		mutex.Lock()
		var value = Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Append.Key]
		if len(value) == 0{
			Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Append.Key] = []byte(*QueryObject.Ch.Append.Val)
		}else{
			value = append(value, []byte(*QueryObject.Ch.Append.Val)...)
			Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Append.Key] = value
		}
		mutex.Unlock()
		WriteBytes(conn, 1, []byte("OK"))

		return
	}
	
	if QueryObject.Ch.SetGrp != nil{

		if QueryObject.Ch.SetGrp.Keys == nil || QueryObject.Ch.SetGrp.Vals == nil{
			WriteBytes(conn, 2, []byte("SetGrp method needs both keys and vals"))
			return
		}

		if len(*QueryObject.Ch.SetGrp.Keys) != len(*QueryObject.Ch.SetGrp.Vals){
			WriteBytes(conn, 2, []byte("Keys and vals must be of same length"))
			return
		}

		mutex.Lock()

		for index ,values := range *QueryObject.Ch.SetGrp.Keys{
			Storage[*QueryObject.Ch.DB][values] = []byte((*QueryObject.Ch.SetGrp.Vals)[index])
		}
		
		mutex.Unlock()
		
		WriteBytes(conn, 1, []byte("OK"))
		
		return
	}

	if QueryObject.Ch.GetGrp != nil{

		if QueryObject.Ch.GetGrp.Keys == nil{
			WriteBytes(conn, 2, []byte("GetGrp method needs keys"))
			return
		}

		var result []string

		mutex.Lock()

		for _ ,values := range *QueryObject.Ch.GetGrp.Keys{
			
			var value = Storage[*QueryObject.Ch.DB][values]

			if len(value) > 0{
				result = append(result, string(value))
			}
		}

		mutex.Unlock()

		if len(result) == 0{
			WriteBytes(conn, 1, []byte("(nil)"))
			return
		}

		pagesJson, err := json.Marshal(result)

		if err != nil{
			WriteBytes(conn, 2, []byte("Failed to convert to bytes"))
			return
		}
		
		WriteBytes(conn, 1, []byte(pagesJson))
		
		return
	}

	if QueryObject.Ch.DelGrp != nil{

		if QueryObject.Ch.DelGrp.Keys == nil{
			WriteBytes(conn, 2, []byte("DelGrp method needs keys"))
			return
		}

		mutex.Lock()

		for _ ,values := range *QueryObject.Ch.DelGrp.Keys{
			delete(Storage[*QueryObject.Ch.DB], values)
		}

		mutex.Unlock()

		WriteBytes(conn, 1, []byte("OK"))
		
		return
	}
}