
if(typeof define !== 'function'){
    var define=require('amdefine')(module);
}

define(function(require, exports, module) {
    var path="../libs/"
    //ar _=require(path+"underscore.extend.js");

    var basic={
        name:"",
    }

    var article=function () {
        this.name="",
            this.tag="",
            this.classify="",
            this.content="",
            this.link="",
            this.author="",
            this.from=""
    }
    var vedio=function () {
        this.name="",
            this.tag="",
            this.classify="",
            this.content="",
            this.link="",
            this.author="",
            this.from=""
    }
    var audio=function(){
        this.name="",
            this.tag="",
            this.classify="",
            this.content="",
            this.link="",
            this.author="",
            this.from=""
    }

    var template=function () {
        this.article=new article();
        this.video=new vedio();
        this.audio=new audio();
    }
    var t=new template()
    console.log(t.article);
    module.exports=template;

})



