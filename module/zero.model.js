var baseModel=function () {
    this.$describle="basic model";
    this.$doName="baseModel";
    this.$params={};
    this.$url="";
    this.$type="get";
    this.$dataType="json";

}
var BMP=baseModel.prototype;
var _setParams=["params","describle","type","url","execute"];
BMP.$addMethod=function (name,fn) {
    this["$set"+name.replace(name.substring(0,1),name.substring(0,1).toUpperCase())]=fn;
    //console.log("==$set"+name.replace(name.substring(0,1),name.substring(0,1).toUpperCase())+"==")
    //console.log(fn.toString())
    return this;
}
var _BMP=new baseModel();
_BMP.$describle="_BMP";
for(var i=0;i<_setParams.length;i++){
    name=_setParams[i];
    console.log(name)
    _BMP.$addMethod(name,function (_name,_args){
        this.$doName=_name;
        this["$"+_name]=_args;
        console.log(_BMP["$"+_name]);
        //console.log(_BMP);
        return this;
    })
}
var _param={name:"test"};
_BMP.$setParams("params",_param);
_BMP.$setDescrible("describle","test");
console.log(_BMP.$params);
console.log(_BMP.$doName);

var _bmp=Object.create(_BMP);
//console.log(_bmp.$doName);
//console.log(_bmp.$url);
//exports._BMP=_BMP;
/*
BMP.$setParams=function (params) {
    this.$params=params;
    return this;
}
BMP.$setDescrible=function (describle) {
    this.$describle=describle;
    return this;
}
BMP.$setUrl=function (url) {
    this.$url=url;
    return this;
}
BMP.$setType=function (type) {
    this.$type=type;
    return this;
}*/
