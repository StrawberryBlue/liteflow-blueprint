
export default class Result{
    dataType:string;
    data:any;
    constructor(dataType:string,data:any){
        this.dataType = dataType;
        this.data = data;
    }
    setMsg(dataType:string){
        this.dataType = dataType;
    }
    setData(data:any){
        this.data = data;
    }
}

export var result = new Result('EL','');