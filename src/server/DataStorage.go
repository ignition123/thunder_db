package server

var Storage = make(map[int] map[string] []byte)

func CreateCacheDB(){
	Storage[0] = make( map[string] []byte)
	Storage[1] = make( map[string] []byte)
	Storage[2] = make( map[string] []byte)
	Storage[3] = make( map[string] []byte)
	Storage[4] = make( map[string] []byte)
	Storage[5] = make( map[string] []byte)
	Storage[6] = make( map[string] []byte)
	Storage[7] = make( map[string] []byte)
	Storage[8] = make( map[string] []byte)
	Storage[9] = make( map[string] []byte)
	Storage[10] = make( map[string] []byte)
	Storage[11] = make( map[string] []byte)
	Storage[12] = make( map[string] []byte)
	Storage[13] = make( map[string] []byte)
	Storage[14] = make( map[string] []byte)
}