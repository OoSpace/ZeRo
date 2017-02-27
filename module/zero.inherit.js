var inherit=function (p) {
    if(p==null)throw TypeError();
    if(Object.create){
        return Object.create(p);
    }
    var t= typeof p;
    if(t!=='function'&&t!=='object')throw TypeError();
    var f=new function (){ };
    f.prototype=p.prototype;
    f.prototype.constructor=p;
    return new f();
}
var $=function () {
    this.name="global name";
};
console.log(typeof $)
/*$.prototype.inherit=function (p) {
    return inherit(p)
};*/
$.prototype.inherit=inherit;

var $=new $();
$=$.inherit($);

console.log($.name)