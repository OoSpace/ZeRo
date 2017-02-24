var baseModel=function () {
    this.$describle="basic model";
    this.doName="baseModel";
    this.$params={};
    this.$url="";
    this.$type="get";
    this.$dataType="json";

}
var BMP=baseModel.prototype;
var _setParams=["params","describle","url","type"];
BMP.$addMethod=function (name,fn) {
    this["$set"+key.replace(key.substring(0,1),key.substring(0,1).toUpperCase())]=fn;
    console.log("==$set"+key.replace(key.substring(0,1),key.substring(0,1).toUpperCase())+"==")
    console.log(fn.toString())
    return this;
}
var _BMP=new baseModel();
_BMP.$describle="_BMP"
for(var i=0;i<_setParams.length;i++){
    _BMP.$addMethod(_name,function (_args){
        _BMP.doName=_name;
        _BMP["$"+_name]=_args;
        console.log(_BMP["$"+_name]);
        return _BMP;
    })
}
var _param={name:"test"};
_BMP.$setParams(_param);
console.log(_BMP.$params);
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
