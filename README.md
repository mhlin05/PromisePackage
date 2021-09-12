# Promise

[https://www.jianshu.com/p/1b63a13c2701](https://www.jianshu.com/p/1b63a13c2701)

## 基本使用

### 介绍

promise是异步编程的新的解决方案，以前是单纯使用**回调函数**

异步编程：文件操作、ajax请求、定时器、数据库操作

回调函数理解：

你到一个商店买东西，刚好你要的东西没有货，于是你在店员那里留下了你的电话，过了几天店里有货了，店员就打了你的电话，然后你接到电话后就到店里去取了货。在这个例子里，你的电话号码就叫回调函数，你把电话留给店员就叫登记回调函数，店里后来有货了叫做触发了回调关联的事件，店员给你打电话叫做调用回调函数，你到店里去取货叫做响应回调事件。回答完毕。

### 为什么使用promise

1. 指定回调函数的方式更加灵活
    1. 旧：启动异步任务前必须指定回调函数
    2. promise：启动异步任务⇒返回promise⇒给promise指定回调函数
2. 支持链式调用，解决回调地狱问题
    1. 回调地狱缺点：阅读不便、异常处理比较难

### 初体验

```jsx
const p = new Promise((resolve, reject) => {
  // 包裹一个异步操作
  setTimeout(() => {
    let n = Math.random()
    if (n <= 0.5) {
      resolve(n) // 将promise对象的状态设置为【成功】
    } else {
      reject(n) // 将promise对象的状态设置为【失败】
    }
  }, 1000)
})

p.then(
  (res) => {
    console.log('成功了', res)
  },
  (err) => {
    console.log('失败了', err)
  }
)

```

总结：new Promise对象并将一个异步操作包裹在里面，如果成功执行resolve，否则执行reject

### Promise的状态

【PromiseState】

1. pedding变为resolved
2. pedding变为rejected

**说明**：只有这两种情况，每个Promise只能改变一次状态

### Promise对象的值

【PromiseResult】

保存着对象`成功/失败`的结果

### Promise的基本流程

![Untitled](Promise%201c125561532e4ff2b40df50c0f9fb8d5/Untitled.png)

## API

### then方法

  其实then方法是可以传递两个参数的，第一个参数为成功的回调，第二个参数为失败的回调。

### Promise.resolve

```jsx
resolve(value)
```

- 如果传入的参数非Promise对象，则返回的结果为成功Promise对象
- 如果传入的参数为Promise对象，则参数的结果决定了resolve的结果

### Promise.reject

类似于resolve，但不管传入什么都是失败，传入什么失败的结果就是什么。

### Promise.all

返回一个新的Promise对象，只有所有的Promise成功才成功，只要有一个失败了就直接失败。

返回的result

- 成功（resolved），返回成功的Promise的结果组成的数组
- 失败（rejected），返回失败的Promise

### Promise.race

谁先改变状态就返回谁

## 关键问题

1. 如何改变Promise状态？
    1. resolve        pending→resolved
    2. reject          pending→rejected
    3. throw          pending→rejected
2. 一个Promise指定多个成功/失败回调函数，都会调用吗？

    状态改变后都会执行

3. 改变Promise状态和指定回调函数谁先谁后？
4. 中断Promise链条

    ```jsx
    //返回一个pending状态的Promise 中断链条
    let p = new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('ok')
            }, 1000)
          })

          p.then(() => {
            console.log(111)
            return new Promise((resolve, reject) => {})
          })
            .then(() => {
              console.log(222)
            })
            .then(() => {
              console.log(333)
            })
            .catch((err) => {
              console.log(err)
            })

    输出结果： 111
    ```

## 自定义封装

[代码地址](https://github.com/mhlin05/PromisePackage)

## async和await

### async

async修饰一个函数，函数的返回值是一个Promise对象。这个Promise对象的返回情况取决于函数的返回值，类似于then函数的情况。

### await

 

1. await右侧的表达式一般为Promise对象，但也可以是其他值
2. 如果表达式是Promise对象，await返回的是Promise成功的值，`如果await的Promise失败了，会抛出异常，需要通过try-catch捕获处理`
3. 如果表达式是其他值，直接将值作为await的返回值