var _=require("../libs/underscore.js")

var Robot=function () {
    this.name="Robot-ZeRo";
    this.func="do something replace humans";

    this.start=function () {
        console.log(this.name+ " is running");
        return this;
    }
    this.stop=function () {
        console.log(this.name+" is stoped");
        return this;
    }
    this.add=function (fucname,fucs) {
        this[fucname]=function(){
            fucs();
        }
        return this;
    }
    this.remove=function (fucname) {
        this[fucname]=undefined;
    }
}

var rb=new Robot();

console.log(rb.name+": "+rb.func);
rb.start().stop();

rb.add("dance",function () {
    console.log("the "+rb.name+" is dancing");
});
rb.dance();
exports.robot=new Robot();