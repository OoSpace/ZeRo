var baseModel=function () {
    this.$describle="";
    this.$params={};
    this.$url="";
    this.$type="get";
    this.$dataType="json";

}
var BMP=baseModel.prototype;
var stPrm=["params","describle","url","type"];
BMP.$addMethod=function (name,fn) {
    this[name]=fn;
    return this;
}
var bm=new baseModel();
for(var i=0;i<stPrm.length;i++){
    var key=stPrm[i];
    console.log(key)
    bm.$addMethod(key,function (key) {
        bm["$set"+key.replace(key.substring(0).toUpperCase(),key.substring(0))]=function (key) {
            bm["$"+key]=key;
            return bm;
        };
    })
}
var pm={name:"test"};
bm.$setParams(pm);
console.log(bm.$params);
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
