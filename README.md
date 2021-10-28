# cache.js

[![Build Status](https://travis-ci.org/Kpatrick1989/cache.js.svg?branch=master)](https://travis-ci.org/Kpatrick1989/cache.js)
[![npm](https://img.shields.io/npm/dw/cache-lib.svg)](https://www.npmjs.com/package/cache-lib)
<a href='https://gitter.im/cache-js/Lobby'>
    <img src='https://badges.gitter.im/Join%20Chat.svg' alt='Gitter Chat' />
</a>

`cache.js` 是一个轻量级的 JS 库，对 `localStorage`、`sessionStorage`进行了扩展，增加了序列化方法和过期时间。可以直接存取JSON对象、设置过期时间。

API 结构如下：

```javascript
cache.doSomething([key], [value], [expire])  // 部分 API 无需传入参数
```



## 开始

### # 直接引用

[下载](https://github.com/Kpatrick1989/cache.js/releases) 最新的 `cache.js` ，直接通过 script 标签在 html 页面引用：

```javascript
<script src="cache.js"></script>
```

### # npm

在命令行工具里执行下面这个命令：

```javascript
$ npm install cache-lib --save-dev
```

### # RequireJS

在 `RequireJS` 里使用：

```javascript
define(['cache'], function(Cache){
    var cache = new Cache();  // 初始化 cahce 实例
    /* ... */
})
```

### # CDN

我们推荐链接到一个你可以手动更新的指定版本号：

```javascript
<script src="https://unpkg.com/cache-lib@0.0.5/dist/cache.js"></script>
```
使用压缩版本，这是一个更小的构建，可以带来比开发环境下更快的速度体验。
```javascript
<script src="https://unpkg.com/cache-lib@0.0.5/dist/cache.min.js"></script>
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



### # __.set( key, value, [expire] )__

__Params:__

* key _(String)_: 需要存储的键名
* value _(Any)_: 需要存储的值
* [expire] _(Object)_: 设置过期时间

__Examples:__

```javascript
// 把字符串'kyle'存储到'user'里，不设置过期时间则永久有效
cache.set('user', 'kyle');

// 直接存储JSON对象，并设置过期时间为2s后
cache.set('user', {name: 'kyle', age: 28}, {type: 's', delay: 2});
```

__Notes:__

1. 设置过期时间时要传入一个对象，指定类型 type\<string\>和延迟时间 delay\<number\>，类型参考如下：

| Type | Description | Example                                           |
| :--- | :---------- | ------------------------------------------------- |
| y    | 年          | {type: 'y', delay: 1}  // 设置过期时间为1年后     |
| M    | 月          | {type: 'M', delay: 1}  // 设置过期时间为1个月后   |
| w    | 星期        | {type: 'w', delay: 1}  // 设置过期时间为1个星期后 |
| d    | 日          | {type: 'd', delay: 1}  // 设置过期时间为1天后     |
| h    | 小时        | {type: 'h', delay: 1}  // 设置过期时间为1个小时后 |
| m    | 分钟        | {type: 'm', delay: 1}  // 设置过期时间为1分钟后   |
| s    | 秒          | {type: 's', delay: 1}  // 设置过期时间为1秒钟后   |

2. 当传入的类型不在上表范围内时，则默认 type 为 'd'；
3. 如果 set 的时候 key 已经存在，并且设置了过期时间，当再次设置过期时间时则覆盖原值，此次 set 时没有设置过期时间则保持此前设置的时间不变；
4. 如果 set 的时候 key 已经存在，并且设置的时间已经过期，不会清除该条数据而是覆盖新值；



### # __.get( key )__

__Params:__

* key _(String)_: 需要获取的键名

__Examples:__

```javascript
// 获取'user'下存储的值
cache.get('user');

// 如存储的是对象时可直接使用
cache.get('user').name;
cache.get('user').age;
```

__Notes:__

1. 如果 get 的这个 key 设置的时间已经过期则返回之前存储的数据，并清除该条数据；
2. 如果 get 的这个 key 不存在则返回 undefined；



### # __.update( key, [value], expire )__

__Params:__

- key _(String)_: 需要更新的键名
- [value] _(Any)_: 需要存储的值
- expire _(Object)_: 设置过期时间

__Examples:__

```javascript
// 更新过期时间为当前时间之后5s
cache.update('user', {type: 's', delay: 5});

// 同时更新存储的数据和过期时间
cache.update('user', {name: 'kyle', age: 28}, {type: 's', delay: 2});
```

__Notes:__

1. 如果 update 的这个 key 不存在则返回 undefined；
2. 只更新过期时间则传入2个参数，第2个参数为过期时间，过期时间设置方法同set，请参考set 的例子；
3. 当同时更新存储的数据和过期时间则传入3个参数，第2个参数为更新的数据，第3个参数为过期时间；（与set传入3个参数时效果相同）
4. 只需更新存储的数据时请使用set方法；



### # __.remove( key )__

__Params:__

- key _(String)_: 需要移除的键名

__Examples:__

```javascript
// 移除'user'
cache.remove('user');
```

__Notes:__

1. 如果 remove 的这个 key 不存在则返回 undefined；



### # .clear( ['exp'] )

__Params:__

* ['exp'] _(String)_: 传入字符串'exp'来选择过期数据

__Examples:__

```javascript
// 清除所有数据
cache.clear();

// 清除过期的数据
cache.clear('exp');
```

__Notes:__

1. 此方法会移除所有包括不是通过cache.js存入的数据；
2. 必须传入'exp'才能清除过期的数据，若不是则清除所有数据；



### # .keys( ['exp'] )

__Params:__

- ['exp'] _(String)_: 传入字符串'exp'来选择过期数据

__Examples:__

```javascript
// 获取所有数据的键名
cache.keys(); 

// 获取过期的数据的键名
cache.keys('exp');
```

__Notes:__

1. 此方法会返回所有包括不是通过cache.js存入的数据的键名；
2. 必须传入'exp'才能返回过期的数据的键名，若不是则返回所有数据的键名；



### # .debug

cache 提供了详细的 console 输出，默认禁用。

__启用如下设置即可：__

```javascript
cache.debug.enable();
```

在浏览器的控制台里可以看到如下输出：

![console.log](https://github.com/Kpatrick1989/cache.js/blob/7352d46ca76d2ce3cdab00b9066b24908eb3855f/consolelog.png)

__禁用如下设置即可：__

```javascript
cache.debug.disabled();
```
