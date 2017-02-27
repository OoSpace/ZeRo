//ES6块级作用域概念
/*function f1() {
  let n = 5;//此处换为var定义，输出结果一样
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}

//var 定义的变量n作用域是f1函数，与let定义的n作用域相同,属于重复定义 故报错
function f1() {
  let n = 5;
  if (true) {
    var n = 10;
  }
  console.log(n); // Uncaught SyntaxError: Identifier 'n' has already been declared
}*/

//ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。但是浏览器中会报错，因为浏览器可以不遵守ES6的规定，仍然会有函数声明提升，所以建议不要在块级中声明函数
/*function f() { console.log('I am outside!'); }
(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }
 f();
}());*/

//变量的解构赋值
/*let [a,[b,c],d] = [1,[2],4];
console.log(a,b,c,d);*/

//注意：不能随便使用圆括号： (1).变量声明语句，不能使用圆括号(2).函数参数也属于变量声明，不能使用圆括号(3).赋值语句，不能将整个模式或嵌套模式中的一层放在圆括号中

//字符串扩展
/*console.log('x'.padEnd(4,'ab'));
console.log('12'.padStart(10, 'YYYY-MM-DD'));*/

//数组的扩展
/*let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 5
};
console.log(Array.from(arrayLike));//[ 'a', 'b', 'c', undefined, undefined ]
console.log(Array.from(arrayLike,(n) => n||0));
console.log(arrayLike);*/

//箭头函数
//1.不能换行
/*var func = ()
           => 1;*/
//2.不能用作构造函数
/*var Person = (name) => {
    this.name = name;
}
var person = new Person('wdg');*/

//箭头函数出现前this绑定
/*function Person() {
  // 构造函数 Person() 定义的 `this` 就是新实例对象自己，若非严格模式下直接调用Person(),this指向window
  this.age = 0;
  setTimeout(function growUp() {
    // 在非严格模式下，growUp() 函数定义了其内部的 `this` 为全局对象window, 不同于构造函数Person()的定义的 `this`;《JavaScript高级程序设计》第二版中，写到：“超时调用的代码都是在全局作用域中执行的，因此函数中this的值在非严格模式下指向window对象，在严格模式下是undefined”。
    this.age++; 
    console.log(this.age);//11
  }, 10);
}
var age = 10;
var p = new Person();*/

//改变this指向
/*function Person() {
  // 构造函数 Person() 定义的 `this` 就是新实例对象自己
  this.age = 0;
  setTimeout(function growUp() {
    // bind()函数将this指向person实例
    this.age++; 
    console.log(this.age);//1
  }.bind(this), 10);
}
var age = 10;
var p = new Person();*/

//箭头函数的this就是定义它时的作用域
/*function Person(){
  this.age = 0;
  setTimeout(() => {
    this.age++; // |this| 正确地指向了 person 对象
    console.log(this.age);//1
  }, 10);
}

var p = new Person();*/

//验证箭头函数没有绑定this
/*var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b(); // prints undefined, Window,可见箭头函数本身是没有绑定this的
obj.c(); // prints 10, Object {obj}*/


//也不可通过call()、apply()、bind()改变this指向
/*var x = 1,
    o = {
        x : 10,
        test : () => this.x
    };

o.test(); // 1
o.test.call(o); // 依然是1*/

/*var adder = {
  base : 1,
    
  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };
            
    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3）*/

//箭头函数不绑定 this，arguments，super(ES6)，抑或 new.target(ES6)
/*function foo() {
  var f = () => arguments[0];
   console.log(f(2)); // foo's implicit arguments binding
  return f(2);
}

foo(1); */
//可以用rest函数解决
/*function foo() { 
  var f = (...args) => args[0]; 
  console.log(f(2));
  return f(2); 
}

foo(1); */

//对象的扩展Object.assign()
//为对象添加属性
/*class Point{
  construct(x,y){
    Object.assign(this,{x,y});
  }
}*/
//为对象添加方法
/*Object.assign(someClass.prototype,{
  method1(arg1,arg2){...},
  method2(){}
  });*/
//克隆对象
/*function clone(origin){
  return Object.assign({},origin);
}

//如果想要保持继承链
function clone(origin){
  let originProto = Object.getPrototype(origin);
  return Object.assign(Object.create(originProto),origin);
}
*/

//为对象指定默认属性
/*const DEFAULTS = {
  age:1,
  name:"qq"
 }
 function f(person){
   person = Object.assign({},DEFAULTS,person)
   console.log(person);
 }
var p ={add:"ceshi"}
f(p);*/


