/**
 * Created by oospace on 2016/10/18.
 */
function Dictionary(){
    this.data = new Object();

    this.put = function(key,value){
        this.data[key] = value;
    };

    this.get = function(key){
        return this.data[key];
    };

    this.remove = function(key){
        this.data[key] = null;
    };

    this.isEmpty = function(){
        return this.data.length == 0;
    };

    this.size = function(){
        return this.data.length;
    };
}

//使用 例子
var d = new Dictionary();
d.put("CN", "China");
d.put("US", "America");
console.log(d.get("CN"));