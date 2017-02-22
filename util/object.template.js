
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
    exports.baseObj=new template()

