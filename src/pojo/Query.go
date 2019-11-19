package pojo

type SetFunc struct{
	Key *string `json:"key"`
	Val *string `json:"val"`
}

type GetFunc struct{
	Key *string `json:"key"`
}

type DelFunc struct{
	Key *string `json:"key"`
}

type ChQuery struct{
	DB *int `json:"db"`
	Set *SetFunc
	Get *GetFunc
	Del *DelFunc
}

type QueryParser struct{
	Ch *ChQuery
}