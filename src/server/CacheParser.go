package server


import(
	"net"
	"pojo"
	"sync"
)

var mutex = &sync.Mutex{}

func CallCacheMethod(conn net.Conn, QueryObject pojo.QueryParser){
	
	if QueryObject.Ch.Set != nil{
		mutex.Lock()
		Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Set.Key] = []byte(*QueryObject.Ch.Set.Val)
		mutex.Unlock()
		WriteBytes(conn, []byte("OK"))
	}else if QueryObject.Ch.Get != nil{
		mutex.Lock()
		var value = Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Get.Key]
		mutex.Unlock()
		if len(value) == 0{
			WriteBytes(conn, []byte("(nil)"))
		}else{
			WriteBytes(conn, value)
		}
	}else if  QueryObject.Ch.Del != nil{
		mutex.Lock()
		delete(Storage[*QueryObject.Ch.DB], *QueryObject.Ch.Del.Key)
		mutex.Unlock()
		WriteBytes(conn, []byte("OK"))
	}
}