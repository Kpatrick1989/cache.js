var expect = chai.expect;
var cache = new Cache();

var storage = window.localStorage;

function clearStorage() {
    storage.clear();
}

describe('Cache', function () {
    'use strict';
    after(function () {
        clearStorage();
    });
    describe('#Constructor', function () {
        it('Constructor should be a function', function () {
            // assert.equal(typeof Cache, 'function')
            expect(Cache).to.be.an('function');
        });
        it('has the Cache API', function () {
            expect(cache.set).to.be.an('function');
            expect(cache.get).to.be.an('function');
            expect(cache.remove).to.be.an('function');
            expect(cache.clear).to.be.an('function');
            expect(cache.update).to.be.an('function');
        });
        it('启用debug正常', function () {
            cache.debug.enable();
            expect(cache.debug.state()).to.be.ok;
        });
        it('取消debug正常', function () {
            cache.debug.disabled();
            expect(cache.debug.state()).to.not.be.ok;
        });
        it('设置localStorage正常', function () {
            var local = new Cache('localStorage');
            local.set('test1', 'localStorage');
            expect(JSON.parse(localStorage.getItem('test1')).Content).to.be.equal('localStorage');
            expect(sessionStorage.getItem('test1')).to.be.a('null');
        });
        it('设置sessionStorage正常', function () {
            var session = new Cache('sessionStorage');
            session.set('test2', 'sessionStorage');
            expect(JSON.parse(sessionStorage.getItem('test2')).Content).to.be.equal('sessionStorage');
            expect(localStorage.getItem('test2')).to.be.a('null');
        })
    });

    describe('#API',function () {
        cache.debug.enable();
        describe('#set, #get', function () {
            it('存储字符串正常', function () {
                cache.set('test', 'test');
                expect(cache.get('test')).to.be.equal('test')
            });
            it('存储对象或数组正常', function () {
                cache.set('test', {'arr':['test1','test2']});
                expect(cache.get('test').arr[0]).to.be.equal('test1')
            });
            it('设置过期时间正常', function () {
                cache.set('expire', '过期时间', {type:'s', delay:2});
                setTimeout(function () {
                    expect(cache.get('expire')).to.be.a('undefined');
                }, 3000)
            })
        });
        describe('#remove', function () {
            it('移除所选数据正常', function () {
                cache.set('remove', 'test');
                cache.remove('remove');
                expect(cache.get('remove')).to.be.a('undefined');
            })
        });
        describe('#update', function () {
            it('更新数据和过期时间正常', function () {
                cache.set('expire', '过期时间', {type:'s', delay:2}); //设置过期时间为2s
                setTimeout(function () {
                    cache.set('expire', '更新过期时间', {type:'s', delay:3}); //第1s更新过期时间为当前时间之后3s
                    setTimeout(function () {
                        expect(cache.get('expire')).to.be.equal('更新过期时间'); //第3s获取存储的值
                        setTimeout(function () {
                            expect(cache.get('expire')).to.be.a('undefined') //第4s再次获取，但是时间到期，值应为undefined
                        },1000)
                    },2000)
                },1000)
            })
        });
        describe('#clear', function () {
            it('清除所有数据正常', function () {
                cache.set('test','test');
                cache.set('haha','haha');
                cache.set('hehe','hehe');
                cache.clear();
                expect(cache.get('test')).to.be.a('undefined');
                expect(cache.get('haha')).to.be.a('undefined');
                expect(cache.get('hehe')).to.be.a('undefined');
            })
        })
    })
});