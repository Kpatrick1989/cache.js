# cache.js
`cache.js` 是一个轻量级的 JS 库，对 `localStorage`、`sessionStorage`进行了扩展，增加了序列化方法和过期时间。可以直接存取JSON对象、设置过期时间。

API 结构如下：

```javascript
cache.doSomething([key], [value], [expire])  // 部分 API 无需传入参数
```


## 开始

#### # 直接引用

[下载](https://github.com/Kpatrick1989/cache.js/releases) 最新的 `cache.js` ，直接通过 script 标签在 html 页面引用：

```javascript
<script src="cache.js"></script>
```



#### # npm

在命令行工具里执行下面这个命令：

```javascript
$ npm install cache-lib --save-dev
```



#### # RequireJS

在 `RequireJS` 里使用：

```javascript
define(['cache'], function(Cache){
    var cache = new Cache();  // 初始化 cahce 实例
    /* ... */
})
```


## API

使用之前需要初始化 cache 实例：

```javascript
var cache = new Cache();
```

默认是使用 localStorage，可传入参数来指定使用 localStorage 或者 sessionStorage：

```javascript
var cache = new Cache('localStorage');
// or
var cache = new Cache('sessionStorage');
```



#### # set

```javascript
// 把字符串'kyle'存储到'user'里，不设置过期时间则永久有效
cache.set('user', 'kyle');

// 直接存储JSON对象，并设置过期时间为2s后
cache.set('user', {name: 'kyle', age: 28}, {type: 's', delay: 2});
```

设置过期时间时要传入一个对象，指定类型 type<string>和延迟时间 delay<number>，类型参考如下：

| Type | Description | Example                                           |
| :--- | :---------- | ------------------------------------------------- |
| y    | 年          | {type: 'y', delay: 1}  // 设置过期时间为1年后     |
| M    | 月          | {type: 'M', delay: 1}  // 设置过期时间为1个月后   |
| w    | 星期        | {type: 'w', delay: 1}  // 设置过期时间为1个星期后 |
| d    | 日          | {type: 'd', delay: 1}  // 设置过期时间为1天后     |
| h    | 小时        | {type: 'h', delay: 1}  // 设置过期时间为1个小时后 |
| m    | 分钟        | {type: 'm', delay: 1}  // 设置过期时间为1分钟后   |
| s    | 秒          | {type: 's', delay: 1}  // 设置过期时间为1秒钟后   |

当传入的类型不在上表范围内时，则默认 type 为 'd'。

如果 set 的时候 key 已经存在，并且设置了过期时间，当再次设置过期时间时则覆盖原值，此次 set 时没有设置过期时间则保持此前设置的时间不变。

如果 set 的时候 key 已经存在并且设置的时间已经过期，不会清除该条数据而是覆盖新值。



#### # get

```javascript
// 获取'user'下存储的值
cache.get('user');

// 如存储的是对象时可直接使用
cache.get('user').name;
cache.get('user').age;
```

如果 get 的这个 key 设置的时间已经过期则返回之前存储的数据，并清除该条数据。

如果 get 的这个 key 不存在则返回 undefined。



#### # remove

```javascript
// 移除'user'
cache.remove('user');
```

如果 remove 的这个 key 不存在则返回 undefined。



#### # update

```javascript
// 更新过期时间为当前时间之后5s
cache.update('user', {type: 's', delay: 5});

// 同时更新存储的数据和过期时间
cache.update('user', {name: 'kyle', age: 28}, {type: 's', delay: 2});
```

如果 update 的这个 key 不存在则返回 undefined。

更新过期时间的方法同设置的方法，请参考上方 set 的例子。

当同时更新存储的数据和过期时间时 update 的效果同 set 设置过期时间的方法。



#### # clear

```javascript
// 清除所有数据
cache.clear();
```



#### # debug

cache 提供了详细的 console 输出，默认禁用。

启用如下设置即可：

```javascript
cache.debug.enable();
```

在浏览器的控制台里可以看到如下输出：

![console.log](http://pengxy-source.b0.upaiyun.com/consolelog.png)

禁用如下设置即可：

```javascript
cache.debug.disabled();
```

